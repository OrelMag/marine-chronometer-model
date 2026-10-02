"""A video frame's camera, recovered from the homography video.py anchor fitted on it: points at any height off the anchored face, and the model seen from it.

    python framecam.py SPEC.json [--f 6000]                    # the picks in SPEC put back on planes at their heights (mm, the model's frame)
    python framecam.py SPEC.json look [--f 6000]               # the --look for isolate.py that sees the model from the frame's camera
    python framecam.py SPEC.json warp RENDER.png OUT.png yaw pitch dist [--f 6000]   # an isolate.py render (1200x800, that --look) mapped onto the frame, beside it

SPEC: {"anchor": the video.py anchor spec whose ANCHOR.H.json holds H (model (x, z) on the face -> pixels), "frame": the frame (in $MC_VIDEO/frames), "face_y": the anchored face's
y in the movement frame (the train bridge's underside: -20.66), "target": [x, y, z] (where the look aims), "picks": {NAME: {"h": mm toward the camera off the face,
"px": [[u, v], ...]}}}. The camera: K with the principal point at the frame's centre and focal length f, R and t from H; f is where the two face axes come out orthonormal
(the ratio of H's first two columns through K^-1 is 1), which for KLUwI2UUCMQ 13:49.5 is about 6000 px (5000-7000 move points 0.5 mm or less). A point h above the face is
put back through K [r1 r2 t + h n]. Example: anchors/lower_bridge_13-49.5.json, the balance lower bridge on the train bridge's underside (tools/lower_bridge.py's MEAS).
About 1 s; look and warp open the page (about 30 s each)."""
import asyncio,json,os,re,sys,numpy as np,cv2
HERE=os.path.dirname(os.path.abspath(__file__));HOME=os.environ.get('MC_VIDEO',os.path.expanduser('~/mc-video'))
a=sys.argv[1:]
if not a or a[0].startswith('-'):sys.exit(__doc__)
def opt(k,d):
    if k in a:i=a.index(k);v=a[i+1];del a[i:i+2];return v
    return d
F=float(opt('--f',6000));sp=a[0];S=json.load(open(sp));here=os.path.dirname(os.path.abspath(sp))
H=np.array(json.load(open(os.path.join(here,S['anchor'].replace('.json','.H.json'))))['H'],float)
fr=S['frame'] if os.path.isabs(S['frame']) else os.path.join(HOME,'frames',S['frame']);W,Hh=3840,2160
def camera(f):
    K=np.array([[f,0,W/2],[0,f,Hh/2],[0,0,1.0]]);M=np.linalg.inv(K)@H;l=1/np.linalg.norm(M[:,0]);r1,r2,t=M[:,0]*l,M[:,1]*l,M[:,2]*l
    if t[2]<0:r1,r2,t=-r1,-r2,-t
    r3=np.cross(r1,r2);n=r3 if r3@(-t)>0 else -r3;return K,r1,r2,t,n,np.linalg.norm(M[:,1])*l
def plane(f,h):K,r1,r2,t,n,_=camera(f);return K@np.c_[r1,r2,t+h*n]
to_mm=lambda P,h,f=F:cv2.perspectiveTransform(np.asarray(P,float).reshape(-1,1,2),np.linalg.inv(plane(f,h)))[:,0]
to_px=lambda X,h,f=F:cv2.perspectiveTransform(np.asarray(X,float).reshape(-1,1,2),plane(f,h))[:,0]
if len(a)==1:
    print(f'f {F:.0f} px: the face axes\' length ratio {camera(F)[5]:.3f} (1 where f is right)')
    out={}
    for k,v in S['picks'].items():
        q=np.round(to_mm(v['px'],v['h']),2);out[k]=q.tolist();print(f'{k} (h {v["h"]}):',json.dumps(out[k]).replace(' ',''))
    sys.exit()
TB=S['face_y'];TGT=S['target'];K,r1,r2,t,n,_=camera(F);CAM=[float(-t@r1),float(TB-t@n),float(-t@r2)]   # the camera's centre in the movement frame (n: toward the camera, +y off the underside)
src=open(os.path.join(HERE,'isolate.py'),encoding='utf-8').read();ns={};exec(re.search(r'^CSS=\((?:.|\n)*?\)\n',src,re.M).group(0),ns)
PAGE='file:///'+os.path.abspath(os.path.join(HERE,'..','index.html')).replace(os.sep,'/')+'?snap&qa'
async def page(fn):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # see smoke.py
        pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=1,color_scheme='light')
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%ns['CSS'])
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate("document.querySelector('#views button[data-v=\"movement\"]').click()");await pg.wait_for_timeout(2500)   # as isolate.py sets the page
        r=await fn(pg);await b.close();return r
if a[1]=='look':   # yaw and pitch for the page's __look, its signs read back from where the page then puts the camera
    async def fn(pg):
        d=await pg.evaluate("""([c,t])=>{__mv.updateMatrixWorld(true);const C=__mv.localToWorld(new THREE.Vector3(...c)),T=__mv.localToWorld(new THREE.Vector3(...t)),d=C.clone().sub(T);return [d.x,d.y,d.z,d.length()];}""",[CAM,TGT]);L=d[3];best=None
        for sy in(1,-1):
            for s_ in(1,-1):
                for off in(0,np.pi):
                    yaw=sy*np.arctan2(d[0],d[2])+off;pitch=s_*np.arcsin(d[1]/L)
                    await pg.evaluate(f"window.__look({yaw},{pitch},{L},{TGT[0]},{TGT[1]},{TGT[2]})");await pg.wait_for_timeout(1500)
                    i=json.loads(await pg.evaluate("__camInfo()"));dd=np.subtract(i['pos'],i['tgt']);e=np.linalg.norm(dd/np.linalg.norm(dd)-np.array(d[:3])/L)
                    if best is None or e<best[0]:best=(e,yaw,pitch,L)
        return best
    e,yaw,pitch,L=asyncio.run(page(fn));print(f'camera at ({CAM[0]:.1f}, {CAM[1]:.1f}, {CAM[2]:.1f}) in the movement frame, {L:.1f} mm from the target');print(f'--look {yaw:.4f} {pitch:.4f} {L:.1f} {" ".join(map(str,TGT))}')
elif a[1]=='warp':   # model points projected through the page's camera and through the frame's, a similarity between them, the render warped by it
    ren,out,yaw,pitch,L=a[2],a[3],*map(float,a[4:7]);P=[(x,z,h) for x in(-10,0,10,20) for z in(0,10,20,30) for h in(0,8)]
    async def fn(pg):
        await pg.evaluate(f"window.__look({yaw},{pitch},{L},{TGT[0]},{TGT[1]},{TGT[2]})");await pg.wait_for_timeout(1500)
        return await pg.evaluate("""(pts)=>{__mv.updateMatrixWorld(true);const i=JSON.parse(__camInfo()),c=new THREE.PerspectiveCamera(i.fov,i.aspect,1,6000);c.position.fromArray(i.pos);c.lookAt(new THREE.Vector3(...i.tgt));c.updateMatrixWorld();c.updateProjectionMatrix();
          const cv=document.querySelector('canvas').getBoundingClientRect();return pts.map(p=>{const v=__mv.localToWorld(new THREE.Vector3(...p)).project(c);return[cv.left+(v.x+1)/2*cv.width,cv.top+(1-v.y)/2*cv.height];});}""",[[x,TB+h,z] for x,z,h in P])
    rp=np.array(asyncio.run(page(fn)),np.float32);fp=np.array([to_px([(x,z)],h)[0] for x,z,h in P],np.float32)
    M,_=cv2.estimateAffinePartial2D(rp,fp);e=np.linalg.norm(cv2.transform(rp[None],M)[0]-fp,axis=1);print(f'similarity: {np.sqrt((e**2).mean()):.1f} px rms over {len(P)} points')
    im=cv2.imread(ren);F_=cv2.imread(fr);wr=cv2.warpAffine(im,M,(F_.shape[1],F_.shape[0]),borderValue=(235,235,235))
    box=S.get('box',[0,0,W,Hh]);cv2.imwrite(out,np.hstack([F_[box[1]:box[3],box[0]:box[2]],wr[box[1]:box[3],box[0]:box[2]]]));print('wrote',out)
