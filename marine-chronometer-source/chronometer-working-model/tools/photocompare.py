"""A photograph of a real chronometer against the model in the same view: the photograph's camera fitted to model points traced on it, the model rendered
through that camera at the photograph's own size, and the two laid side by side, blended and outlined (each part's outline, from a pass with every part in its
own flat colour, drawn over the photograph), so what differs shows where it is and on which part.

    python photocompare.py SPEC.json [--model wempe]          fit, render, compare: r_pc_NAME.png (photo | model; outlines on the photo | blend)
    python photocompare.py SPEC.json --labels                 the candidate points (screw heads, arbors) projected through the spec's rough "look" (or the fit)
                                                              and numbered, beside the photograph: r_pc_NAME_labels.png, their coordinates r_pc_NAME_points.json
    python photocompare.py SPEC.json --crop x0 y0 x1 y1       the sheet cropped to that part of the photograph (pixels), enlarged
    python photocompare.py SPEC.json --bbox part,part        each part's box in the movement frame (to place circles: a plate's rim)
    python photocompare.py SPEC.json --grid x0 y0 x1 y1 [--step 10]   the photograph's patch enlarged with a pixel grid, to read picks off: r_pc_NAME_grid.png

Picks can be snapped (--snaps N rounds, default 3; --save writes the snapped picks back into the spec): a point with "snap": r is a round edge of radius r mm about
its xyz, slid to the photograph's edge; a circle with "snap": {"arcs": [[deg0, deg1]], "win": px} has its visible arcs found on the photograph (no "uv" needed).

SPEC (JSON): {"photo": path (from the repository's root), "rev": the model's version ("last", "first", "6mx", "1943"), "hash": more of the page's hash
("dial=kirov&conn=band"), "case": true to keep the case, box and gimbals (else only the movement), "hide": [parts], "eval": JS run after loading,
"look": [yaw, pitch, dist, x, y, z, fov] a rough camera (the page's __look and fov, target in the movement frame) for --labels and as the fit's start,
"points": {"what it is": {"xyz": [x, y, z] (movement frame, mm: dial side +y, 12 o'clock -z, 3 o'clock +x), "uv": [u, v] (the photograph's pixels)}},
"circles": {"what": {"c": [x, y, z], "r": mm, "n": [0, 1, 0] its axis, "uv": [[u, v], ...] points traced on its edge}}, "fix_f": a focal length in pixels
to hold}. The camera is a pinhole (no lens distortion) with its principal point at the photograph's centre: 7 unknowns (pose and focal length), so give
at least five points spread over the movement, at different heights; circles (a plate's rim) fix tilt and scale well. Each point's residual is printed in
pixels and in mm at its depth; a point far off when the rest fit is a place where the model and the photograph disagree (or a mispick: check it on --grid).

Each part's outline is also scored against the photograph's edges (Canny): the share of its outline pixels with no photographed edge within 3 px, worst first.
It is triage only (texture makes edges everywhere; a part hidden in the photograph scores badly): look at the sheet.
The model is frozen (speed 0) in whatever state the page opens in; "eval" can pose it. Say what matches, what differs and how sure each reading is
(CLAUDE.md, Source of truth). About 30-60 s."""
import asyncio,base64,io,json,pathlib,sys
import numpy as np,cv2
from scipy.optimize import least_squares
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
import browser
import model;PAGE=model.PAGE
HERE=pathlib.Path(__file__).resolve().parent;ROOT=HERE.parents[2]
a=sys.argv[1:]
def opt(k,n=1,d=None):
    if k not in a:return d
    i=a.index(k);return a[i+1:i+1+n] if n>1 else a[i+1]
if not a or a[0].startswith('-'):sys.exit(__doc__)
SP=pathlib.Path(a[0]);S=json.loads(SP.read_text(encoding='utf-8'));NAME=SP.stem
PH=(ROOT/S['photo']) if not pathlib.Path(S['photo']).is_absolute() else pathlib.Path(S['photo'])
photo=cv2.imdecode(np.fromfile(str(PH),np.uint8),cv2.IMREAD_COLOR);H,W=photo.shape[:2]

if '--grid' in a:   # the photograph's patch enlarged, a line every --step px, labelled: to read picks off by eye
    x0,y0,x1,y1=map(int,opt('--grid',4));st=int(opt('--step',1,10));k=max(2,min(12,1400//max(x1-x0,y1-y0)))
    p=cv2.resize(photo[y0:y1,x0:x1],None,fx=k,fy=k,interpolation=cv2.INTER_NEAREST)
    for x in range((x0//st+1)*st,x1,st):cv2.line(p,((x-x0)*k,0),((x-x0)*k,p.shape[0]),(0,255,255) if x%(st*5)==0 else (0,160,160),1);cv2.putText(p,str(x),((x-x0)*k+2,12),0,0.4,(0,255,255),1) if x%(st*5)==0 else None
    for y in range((y0//st+1)*st,y1,st):cv2.line(p,(0,(y-y0)*k),(p.shape[1],(y-y0)*k),(0,255,255) if y%(st*5)==0 else (0,160,160),1);cv2.putText(p,str(y),(2,(y-y0)*k-2),0,0.4,(0,255,255),1) if y%(st*5)==0 else None
    o=f'r_pc_{NAME}_grid.png';cv2.imwrite(o,p);print('wrote',o);sys.exit(0)

# ---------- the camera: x_cam = R x_mv + t, pixels = f x_cam/z + (W/2, H/2) (OpenCV's: x right, y down, z forward) ----------
def K(f):return np.array([[f,0,W/2],[0,f,H/2],[0,0,1]],float)
def proj(P,q):return cv2.projectPoints(np.ascontiguousarray(np.asarray(P,float).reshape(-1,3)),q[:3],q[3:6],K(np.exp(q[6])),None)[0].reshape(-1,2)
def circ3(c):
    n=np.array(c.get('n',[0,1,0]),float);n/=np.linalg.norm(n);u=np.cross(n,[1,0,0] if abs(n[0])<0.9 else [0,0,1]);u/=np.linalg.norm(u);v=np.cross(n,u)
    t=np.linspace(0,2*np.pi,int(c.get('ns',360)),endpoint=False);return np.array(c['c'],float)+c['r']*(np.outer(np.cos(t),u)+np.outer(np.sin(t),v))
PTS=S.get('points',{});CIR=S.get('circles',{})
P3=np.array([v['xyz'] for v in PTS.values()],float).reshape(-1,3);P2=np.array([v.get('uv',[np.nan,np.nan]) for v in PTS.values()],float).reshape(-1,2)
C3={k:circ3(v) for k,v in CIR.items()};C2={k:np.array(v.get('uv',[]),float).reshape(-1,2) for k,v in CIR.items()}
# ---------- snapping: picks moved onto the photograph's own edges, the shapes the model gives them (a screw head's ellipse, a rim's arc) ----------
GR=cv2.GaussianBlur(cv2.cvtColor(photo,cv2.COLOR_BGR2GRAY).astype(np.float32),(0,0),1.0);GM=np.hypot(cv2.Sobel(GR,cv2.CV_32F,1,0),cv2.Sobel(GR,cv2.CV_32F,0,1))
def samp(U):   # the gradient's magnitude at pixels U (bilinear), 0 outside
    x,y=U[...,0],U[...,1];ok=(x>=0)&(y>=0)&(x<W-1)&(y<H-1);x=np.clip(x,0,W-1.001);y=np.clip(y,0,H-1.001);x0=x.astype(int);y0=y.astype(int);fx=x-x0;fy=y-y0
    v=GM[y0,x0]*(1-fx)*(1-fy)+GM[y0,x0+1]*fx*(1-fy)+GM[y0+1,x0]*(1-fx)*fy+GM[y0+1,x0+1]*fx*fy;return np.where(ok,v,0)
SNAPE={}
def snap(q,win=None):
    """points with "snap": r (mm): a round edge of that radius about xyz (its axis "n", default the arbors') projected through q and slid (and scaled 0.9-1.1) to where the
    photograph's gradient along it is strongest, within "win" px (default 8): the pick is its centre's projection so moved. Circles with "snap": {"arcs": [[deg0, deg1], ...]
    (angle about the axis from +x toward +z), "win"}: the arcs' points slid along their normals to the strongest edge; those weaker than a quarter of the median dropped."""
    out=[]
    for i,(k,v) in enumerate(PTS.items()):
        if 'snap' not in v:continue
        c={'c':v['xyz'],'r':v['snap'],'n':v.get('n',[0,1,0])};E=proj(circ3(c)[::6],q);cm=proj([v['xyz']],q)[0];w=win or v.get('win',16);best=(-1,0,0,1)
        c0=np.array(v['uv'],float) if 'uv' in v else cm;E=E-cm+c0   # the model's ellipse (its shape and size) about the pick as given (never the last snap): the photograph decides where
        for sc in np.arange(0.7,1.26,0.05):
            Es=c0+(E-c0)*sc
            for dx in np.arange(-w,w+0.5,1.0):
                for dy in np.arange(-w,w+0.5,1.0):
                    m=samp(Es+[dx,dy]).mean()
                    if m>best[0]:best=(m,dx,dy,sc)
        _,dx,dy,sc=best
        for dd in (0.5,0.25):   # refine to a quarter pixel
            for ex in (-dd,0,dd):
                for ey in (-dd,0,dd):
                    m=samp(c0+(E-c0)*sc+[dx+ex,dy+ey]).mean()
                    if m>best[0]:best=(m,dx+ex,dy+ey,sc)
        _,dx,dy,sc=best;P2[i]=c0+[dx,dy];out.append((k,P2[i].copy(),sc));SNAPE[k]=c0+(E-c0)*sc+[dx,dy]
    for k,v in CIR.items():
        if 'snap' not in v:continue
        sn=v['snap'];w=sn.get('win',8);cx,cy,cz=v['c'];T=[]
        for a0,a1 in sn['arcs']:T+=list(np.radians(np.arange(a0,a1,2.0)))
        T=np.array(T);P=np.c_[cx+v['r']*np.cos(T),np.full_like(T,cy),cz+v['r']*np.sin(T)];U=proj(P,q);U2=proj(np.c_[cx+v['r']*np.cos(T+0.01),np.full_like(T,cy),cz+v['r']*np.sin(T+0.01)],q)
        tg=U2-U;tg/=np.linalg.norm(tg,axis=1)[:,None];nm=np.c_[-tg[:,1],tg[:,0]];sl=np.arange(-w,w+0.25,0.25)
        Ms=samp(U[:,None,:]+sl[None,:,None]*nm[:,None,:]);j=Ms.argmax(1);mx=Ms.max(1);keep=mx>0.25*np.median(mx)
        C2[k]=(U+sl[j][:,None]*nm)[keep];out.append((k,len(C2[k]),None))
    return out
FIXF=S.get('fix_f')
def res(q):
    if FIXF:q=np.r_[q[:6],np.log(FIXF)]
    ok=~np.isnan(P2[:,0]);r=[(proj(P3[ok],q)-P2[ok]).ravel()] if ok.any() else []
    for k in C3:e=proj(C3[k],q);r.append(np.sqrt(((C2[k][:,None,:]-e[None])**2).sum(-1)).min(1))
    return np.concatenate(r) if r else np.zeros(0)
def fit(q0):
    """least squares from q0 (and from solvePnP over a sweep of focal lengths when there are points enough), soft-l1 so one bad pick doesn't pull the rest"""
    starts=[q0] if q0 is not None else []
    okp=~np.isnan(P2[:,0])
    if okp.sum()>=4:
        for f in np.geomspace(800,20000,14):
            try:ok,rv,tv=cv2.solvePnP(P3[okp],P2[okp],K(f),None,flags=cv2.SOLVEPNP_SQPNP)
            except cv2.error:continue
            if ok:starts.append(np.r_[rv.ravel(),tv.ravel(),np.log(f)])
    best=None
    for s in starts:   # a short run from each start, then the best polished
        try:r=least_squares(res,s,loss='soft_l1',f_scale=3.0,max_nfev=60)
        except Exception:continue
        if best is None or r.cost<best.cost:best=r
    best=least_squares(res,best.x,loss='soft_l1',f_scale=3.0,max_nfev=2000);q=best.x
    if FIXF:q=np.r_[q[:6],np.log(FIXF)]
    return q

# ---------- the page: load, pose, render through a camera at the photograph's size ----------
PAGEJS=r"""
window.__pc={
  /* the scene, the movement's frame */
  sc:()=>{let s=__mv;while(s.parent)s=s.parent;return s;},
  inside:o=>{for(let p=o;p;p=p.parent)if(p===__mv)return true;return false;},
  part:o=>{for(let p=o;p;p=p.parent)if(p.userData&&p.userData.partName)return p.userData.partName;return null;},
  hn:o=>{for(let p=o;p&&p!==__mv;p=p.parent)if(p.userData&&p.userData.hn)return p.userData.hn;return '';},
  show:(caseToo,hide)=>{const sc=__pc.sc();sc.traverse(o=>{if(!o.isMesh&&!o.isLine&&!o.isLineSegments)return;if(o.userData._pcv===undefined)o.userData._pcv=o.visible;
    let v=o.userData._pcv;if(!caseToo&&!__pc.inside(o))v=false;if(hide.includes(__pc.part(o)))v=false;o.visible=v;});},
  /* a camera from OpenCV's R (row-major 3x3, movement frame to camera), t (mm) and f (px) */
  camCV:(R,t,f,W,H)=>{const mv=__mv;mv.updateMatrixWorld(true);const c=new THREE.PerspectiveCamera(2*Math.atan(H/2/f)*180/Math.PI,W/H,0.5,20000);
    const Rt=[[R[0],R[3],R[6]],[R[1],R[4],R[7]],[R[2],R[5],R[8]]];   /* R^T: camera axes in the movement frame (columns) */
    const C=[-(Rt[0][0]*t[0]+Rt[0][1]*t[1]+Rt[0][2]*t[2]),-(Rt[1][0]*t[0]+Rt[1][1]*t[1]+Rt[1][2]*t[2]),-(Rt[2][0]*t[0]+Rt[2][1]*t[1]+Rt[2][2]*t[2])];
    const ax=i=>new THREE.Vector3(Rt[0][i],Rt[1][i],Rt[2][i]);const xm=ax(0),ym=ax(1).negate(),zm=ax(2).negate();   /* three's camera: y up, looking down -z */
    const q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3();mv.matrixWorld.decompose(p,q,s);
    const m=new THREE.Matrix4().makeBasis(xm,ym,zm);const qc=new THREE.Quaternion().setFromRotationMatrix(m).premultiply(q);
    c.position.copy(mv.localToWorld(new THREE.Vector3(...C)));c.quaternion.copy(qc);c.updateMatrixWorld(true);c.updateProjectionMatrix();return c;},
  /* the page's look (yaw, pitch, dist about a target in the movement frame, fov) as OpenCV's R, t, f */
  look2cv:(yaw,pitch,dist,x,y,z,fov,W,H)=>{const mv=__mv;mv.updateMatrixWorld(true);const t=mv.localToWorld(new THREE.Vector3(x,y,z)),cp=Math.cos(pitch);
    const c=new THREE.PerspectiveCamera(fov,W/H,1,20000);c.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c.lookAt(t);c.updateMatrixWorld(true);
    const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),M=new THREE.Matrix4().multiplyMatrices(inv,c.matrixWorld),e=M.elements;
    const col=i=>{const v=new THREE.Vector3(e[4*i],e[4*i+1],e[4*i+2]).normalize();return[v.x,v.y,v.z];};const X=col(0),Y=col(1).map(v=>-v),Z=col(2).map(v=>-v),C=[e[12],e[13],e[14]];
    const R=[X,Y,Z],tt=R.map(r=>-(r[0]*C[0]+r[1]*C[1]+r[2]*C[2]));return{R:[].concat(...R),t:tt,f:H/2/Math.tan(fov*Math.PI/360)};},
  /* render through c at W x H: the lit page as drawn ('lit') or every part flat in its own colour ('id', with the table of colours) */
  render:(c,W,H,mode)=>{const r=__r,sc=__pc.sc(),sz=r.getSize(new THREE.Vector2()),pr=r.getPixelRatio(),enc=r.outputEncoding,tm=r.toneMapping,cc=r.getClearColor(new THREE.Color()),ca=r.getClearAlpha();
    r.setPixelRatio(1);r.setSize(W,H,false);let ids=null;const sw=[];
    if(mode==='id'){ids=[];const key={};r.outputEncoding=THREE.LinearEncoding;r.toneMapping=THREE.NoToneMapping;
      sc.traverse(o=>{if(!o.isMesh||!o.visible)return;const k=__pc.part(o)+'|'+__pc.hn(o);if(!(k in key)){key[k]=ids.length;ids.push(k);}const i=key[k]+1;
        const m=new THREE.MeshBasicMaterial({color:new THREE.Color(((i*67)%251+4)/255,((i>>8)*40+(i*13)%60+10)/255,((i*29)%250+4)/255)});m.userData.i=i;sw.push([o,o.material]);o.material=m;});}
    r.setClearColor(0x000000,0);sc.updateMatrixWorld(true);r.render(sc,c);const url=r.domElement.toDataURL('image/png');
    for(const[o,m]of sw){o.material.dispose();o.material=m;}r.outputEncoding=enc;r.toneMapping=tm;r.setClearColor(cc,ca);r.setPixelRatio(pr);r.setSize(sz.x,sz.y,false);
    return{url,ids};},
  /* the candidate points: screw heads (their axis's two ends), wheels' and pinions' centres (both faces), in the movement frame */
  points:()=>{const mv=__mv,inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),out=[];mv.updateMatrixWorld(true);
    __pc.sc().traverse(o=>{if(!o.isMesh||!o.visible)return;const s=o.userData.screw,g=o.userData.gear;if(!s&&!g)return;o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox;
      const m=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),c=bb.getCenter(new THREE.Vector3()),y0=c.clone(),y1=c.clone();y0.y=bb.min.y;y1.y=bb.max.y;   /* screws and wheels turn about their local y */
      out.push({k:s?'screw':'gear',part:__pc.part(o),hn:__pc.hn(o),r:s||((bb.max.x-bb.min.x)/2),a:y0.applyMatrix4(m).toArray(),b:y1.applyMatrix4(m).toArray()});});
    return out;},
  /* each named part's box in the movement frame (its visible meshes) */
  bbox:names=>{const mv=__mv,inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),o={};mv.updateMatrixWorld(true);
    __pc.sc().traverse(m=>{if(!m.isMesh||!m.visible)return;const p=__pc.part(m);if(!names.includes(p))return;m.geometry.computeBoundingBox();
      const b=m.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld));o[p]=o[p]?o[p].union(b):b;});
    return Object.fromEntries(Object.entries(o).map(([k,b])=>[k,[b.min.toArray().map(v=>+v.toFixed(3)),b.max.toArray().map(v=>+v.toFixed(3))]]));}};
"""
def png(url):return np.array(Image.open(io.BytesIO(base64.b64decode(url.split(',')[1]))).convert('RGBA'))
async def page_run(job):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=1);errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        h='&'.join(x for x in ('rev='+S.get('rev','last'),'merge=0','edges=0',S.get('hash','')) if x)
        await pg.goto(PAGE+'#'+h);await pg.wait_for_function("!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(2500)
        await pg.evaluate("(()=>{const b=document.querySelector('#speeds button[data-v=\"0\"]');if(b)b.click();})()");await pg.wait_for_timeout(500)
        if S.get('eval'):await pg.evaluate(S['eval']);await pg.wait_for_timeout(500)
        await pg.evaluate(PAGEJS);await pg.evaluate("([c,h])=>__pc.show(c,h)",[bool(S.get('case')),S.get('hide',[])])
        out=await job(pg);await b.close()
    if errs:print('page errors:',errs)
    return out

def q_of(R,t,f):return np.r_[cv2.Rodrigues(np.array(R,float).reshape(3,3))[0].ravel(),np.array(t,float),np.log(f)]
def cv_of(q):return cv2.Rodrigues(q[:3])[0].ravel().tolist(),q[3:6].tolist(),float(np.exp(q[6]))
async def job(pg):
    q0=None
    if '--bbox' in a:return ('bbox',await pg.evaluate("n=>__pc.bbox(n)",opt('--bbox').split(',')),None,None)
    if S.get('look'):l=S['look'];c=await pg.evaluate("a=>__pc.look2cv(...a)",l+[W,H]);q0=q_of(c['R'],c['t'],c['f'])
    if '--labels' in a or not (len(P3)+len(C3)):
        q=fit(q0) if (~np.isnan(P2[:,0])).sum()+sum(len(v) for v in C2.values())>=7 else q0
        if q is None:sys.exit('no "look" and too few points to fit: give the spec a rough "look"')
        R,t,f=cv_of(q);cam=await pg.evaluate("([R,t,f,W,H])=>{window.__pcC=__pc.camCV(R,t,f,W,H);return 1;}",[R,t,f,W,H])
        lit=png((await pg.evaluate("([W,H])=>__pc.render(__pcC,W,H,'lit')",[W,H]))['url']);pts=await pg.evaluate("__pc.points()")
        return ('labels',q,lit,pts)
    havep=(~np.isnan(P2[:,0])).sum()+sum(len(v) for v in C2.values())
    q=fit(q0) if havep>=4 else q0
    if q is None:sys.exit('no "look" and too few picks to fit')
    if any('snap' in v for v in list(PTS.values())+list(CIR.values())):
        for it in range(int(opt('--snaps',1,3))):
            sn=snap(q,win=12 if havep<4 else None);q=fit(q)
        for k,u,sc in sn:print(f'  snapped {k}: '+(f'({u[0]:.1f}, {u[1]:.1f}), size x{sc:.2f}' if sc else f'{u} points'))
        tiles=[]   # each snapped pick: its patch, enlarged, the ellipse it snapped to drawn on it (yellow) and the pick as given (cyan)
        for k,E in SNAPE.items():
            c=E.mean(0);hw=int(max(24,np.ptp(E,0).max()*0.9));x0,y0=int(c[0])-hw,int(c[1])-hw;pt=np.zeros((2*hw,2*hw,3),np.uint8)
            ys,xs=slice(max(0,y0),min(H,y0+2*hw)),slice(max(0,x0),min(W,x0+2*hw));pt[ys.start-y0:ys.stop-y0,xs.start-x0:xs.stop-x0]=photo[ys,xs];kk=240/(2*hw);pt=cv2.resize(pt,(240,240),interpolation=cv2.INTER_CUBIC)
            cv2.polylines(pt,[((E-[x0,y0])*kk).astype(np.int32)],True,(0,255,255),1);g=PTS[k].get('uv');
            if g:cv2.drawMarker(pt,tuple(int(v) for v in ((np.array(g)-[x0,y0])*kk)),(255,255,0),1,10,1)
            cv2.putText(pt,k[:34],(3,234),0,0.33,(255,255,255),1);tiles.append(pt)
        if tiles:
            while len(tiles)%6:tiles.append(np.zeros_like(tiles[0]))
            cv2.imwrite(f'r_pc_{NAME}_snaps.png',np.vstack([np.hstack(tiles[i:i+6]) for i in range(0,len(tiles),6)]))
        if '--save' in a:   # the snapped picks written into the spec, as measured
            for i,(k,v) in enumerate(PTS.items()):
                if 'snap' in v:v['uv']=[round(float(P2[i,0]),2),round(float(P2[i,1]),2)]
            for k,v in CIR.items():
                if 'snap' in v:v['uv']=[[round(float(x),1),round(float(y),1)] for x,y in C2[k]]
            SP.write_text(json.dumps(S,indent=1,ensure_ascii=False),encoding='utf-8');print('saved the snapped picks in',SP)
    R,t,f=cv_of(q)
    await pg.evaluate("([R,t,f,W,H])=>{window.__pcC=__pc.camCV(R,t,f,W,H);return 1;}",[R,t,f,W,H])
    lit=png((await pg.evaluate("([W,H])=>__pc.render(__pcC,W,H,'lit')",[W,H]))['url']);idr=await pg.evaluate("([W,H])=>__pc.render(__pcC,W,H,'id')",[W,H])
    return ('cmp',q,lit,(png(idr['url']),idr['ids']))
kind,q,lit,extra=asyncio.run(page_run(job))
if kind=='bbox':
    for k,v in q.items():print(f'  {k:24s} min {v[0]}  max {v[1]}')
    sys.exit(0)
R=cv2.Rodrigues(q[:3])[0];f=np.exp(q[6]);Cw=-R.T@q[3:6]
print(f'{PH.name} ({W}x{H}): f {f:.0f} px (fov {2*np.degrees(np.arctan(H/2/f)):.1f} deg), camera at ({Cw[0]:.1f}, {Cw[1]:.1f}, {Cw[2]:.1f}) mm, {np.linalg.norm(Cw):.0f} mm from the origin')
def comp(rgba,bg):   # a render (RGBA) over a background (BGR)
    al=rgba[...,3:4]/255.0;return (rgba[...,2::-1]*al+bg*(1-al)).astype(np.uint8)
FONT=ImageFont.load_default()
def side(ims,labels):   # images side by side, a caption on each
    hh=max(i.shape[0] for i in ims);row=np.full((hh+22,sum(i.shape[1] for i in ims)+8*(len(ims)-1),3),255,np.uint8);x=0
    for i,l in zip(ims,labels):row[22:22+i.shape[0],x:x+i.shape[1]]=i;cv2.putText(row,l,(x+4,16),0,0.5,(0,0,0),1,cv2.LINE_AA);x+=i.shape[1]+8
    return row
def cropz(img):
    if '--crop' not in a:return img
    x0,y0,x1,y1=map(int,opt('--crop',4));c=img[y0:y1,x0:x1];k=max(1,min(4,1000//max(1,x1-x0)));return cv2.resize(c,None,fx=k,fy=k,interpolation=cv2.INTER_LANCZOS4)
if kind=='labels':
    pts=extra;grey=np.full_like(photo,235);rend=comp(lit,grey);out=[];pr=photo.copy()
    for i,p in enumerate(pts):
        ua,ub=proj([p['a'],p['b']],q);top=ua if np.linalg.norm(Cw-np.array(p['a']))<np.linalg.norm(Cw-np.array(p['b'])) else ub;end=p['a'] if top is ua else p['b']
        if not (0<=top[0]<W and 0<=top[1]<H):continue
        col=(0,0,255) if p['k']=='screw' else (255,0,0);cv2.circle(rend,tuple(map(int,top)),3,col,-1);cv2.putText(rend,str(i),(int(top[0])+4,int(top[1])-4),0,0.4,col,1,cv2.LINE_AA)
        out.append({'i':i,**p,'near':[round(v,3) for v in end],'uv':[round(float(top[0]),1),round(float(top[1]),1)]})
    json.dump(out,open(f'r_pc_{NAME}_points.json','w'),indent=0)
    for u in P2:
        if not np.isnan(u[0]):cv2.drawMarker(pr,tuple(map(int,u)),(0,255,0),1,14,2)
    cv2.imwrite(f'r_pc_{NAME}_labels.png',side([cropz(pr),cropz(rend)],['photograph (green: picks)','model through the spec\'s look: red screws, blue wheels (i in r_pc_%s_points.json; "near": the end facing the camera)'%NAME]))
    print(f'wrote r_pc_{NAME}_labels.png, r_pc_{NAME}_points.json ({len(out)} points in frame)');sys.exit(0)

# ---------- the comparison ----------
idimg,ids=extra;r=res(q);i=0;print('points: residual px (mm at their depth)')
for j,(k,v) in enumerate(PTS.items()):
    if np.isnan(P2[j,0]):continue
    z=(R@np.array(v['xyz'])+q[3:6])[2];e=np.hypot(*r[i:i+2]);print(f'  {k:40s} {e:6.1f} px  {e*z/f:5.2f} mm');i+=2
for k in C3:m=len(C2[k]);z=(R@C3[k].mean(0)+q[3:6])[2];e=np.sqrt(np.mean(r[i:i+m]**2));print(f'  {k:40s} {e:6.1f} px rms over {m} ({e*z/f:.2f} mm)');i+=m
mmpx=float(np.median([(R@p+q[3:6])[2] for p in (P3 if len(P3) else [c.mean(0) for c in C3.values()])]))/f
print(f'  rms {np.sqrt(np.mean(r**2)):.1f} px; about {mmpx:.3f} mm a pixel at the movement')
# the id pass: each pixel's part (exact colours only: antialiased edges between parts match none)
codes=(idimg[...,0].astype(np.int64)<<16)|(idimg[...,1].astype(np.int64)<<8)|idimg[...,2]
tab={}
for n,k in enumerate(ids,1):
    c=(((n*67)%251+4),((n>>8)*40+(n*13)%60+10),((n*29)%250+4));tab[(c[0]<<16)|(c[1]<<8)|c[2]]=n
lab=np.zeros(codes.shape,np.int32);
for c,n in tab.items():lab[(codes==c)&(idimg[...,3]==255)]=n
# fill the antialiased seams with the nearest labelled pixel, so outlines are closed
mask=(lab==0)&(idimg[...,3]>0)
if mask.any():
    d,ix=cv2.distanceTransformWithLabels((lab==0).astype(np.uint8),cv2.DIST_L2,3,labelType=cv2.DIST_LABEL_PIXEL)
    yy,xx=np.nonzero(lab);lut=np.zeros(ix.max()+1,np.int32);src=ix[yy,xx];lut[src]=lab[yy,xx];lab[mask]=lut[ix[mask]]
edge=np.zeros(lab.shape,bool);edge[:,1:]|=lab[:,1:]!=lab[:,:-1];edge[1:,:]|=lab[1:,:]!=lab[:-1,:]
partof=lambda n:ids[n-1].split('|')[0] if n else None
parts=sorted({partof(n) for n in range(1,len(ids)+1)});rng=np.random.default_rng(3);pc={p:tuple(int(v) for v in rng.integers(40,255,3)) for p in parts}
ov=(photo*0.75).astype(np.uint8);ys,xs=np.nonzero(edge)
for y,x in zip(ys,xs):
    n=max(lab[y,x],lab[y,max(0,x-1)],lab[max(0,y-1),x]);
    if n:ov[y,x]=pc[partof(n)]
pr=photo.copy()
for j,(k,v) in enumerate(PTS.items()):
    if np.isnan(P2[j,0]):continue
    v=dict(v,uv=P2[j]);u=proj([v['xyz']],q)[0];cv2.drawMarker(pr,tuple(map(int,v['uv'])),(0,255,0),1,12,2);cv2.drawMarker(pr,tuple(map(int,u)),(0,0,255),2,10,2);cv2.line(pr,tuple(map(int,v['uv'])),tuple(map(int,u)),(0,0,255),1)
for k in C3:cv2.polylines(pr,[proj(C3[k],q).astype(np.int32)],True,(0,0,255),1);[cv2.circle(pr,tuple(map(int,u)),2,(0,255,0),-1) for u in C2[k]]
rend=comp(lit,np.full_like(photo,235));bl=comp(np.dstack([lit[...,:3],(lit[...,3]*0.5).astype(np.uint8)]),photo)
sheet=np.vstack([side([cropz(pr),cropz(rend)],['photograph (green: picks, red: the model\'s points through the fitted camera)','model, same camera']),
                 side([cropz(ov),cropz(bl)],['the model\'s part outlines on the photograph','blend 50 %'])])
o=f'r_pc_{NAME}.png';cv2.imwrite(o,sheet);cv2.imwrite(f'r_pc_{NAME}_outline.png',ov);cv2.imwrite(f'r_pc_{NAME}_render.png',rend);print('wrote',o,f'(and r_pc_{NAME}_outline.png, _render.png)')
# triage: each part's outline against the photograph's edges
g=cv2.GaussianBlur(cv2.cvtColor(photo,cv2.COLOR_BGR2GRAY),(5,5),1.2);ed=cv2.Canny(g,40,110);dt=cv2.distanceTransform((ed==0).astype(np.uint8),cv2.DIST_L2,3)
sc=[]
for p in parts:
    ns=[n for n in range(1,len(ids)+1) if partof(n)==p];m=np.isin(lab,ns);e=m&edge
    if e.sum()<40:continue
    sc.append((float((dt[e]>3).mean()),int(e.sum()),p))
print('outline pixels with no photographed edge within 3 px (triage, worst first):')
for s,n,p in sorted(sc,reverse=True)[:25]:print(f'  {p:28s} {s*100:5.1f} %  of {n}')
json.dump({'photo':S['photo'],'q':q.tolist(),'f':float(f),'W':W,'H':H,'score':{p:s for s,n,p in sc}},open(f'r_pc_{NAME}.json','w'),indent=1)
