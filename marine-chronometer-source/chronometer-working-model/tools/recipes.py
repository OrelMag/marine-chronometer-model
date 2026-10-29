"""recipes.py: the parts as recipes (tools/recipes/: each part a list of machining operations, every size the model's own with its drawing), built as exact
solids, written as STEP, written as operation sheets, and checked against the page's own mesh of each part (PLAN-recipes.md).

    python recipes.py --model wempe [--only a,b] [--step [DIR]] [--sheet [DIR]] [--check] [--json OUT] [--fault]

--step writes KEY.step (and KEY.stl) into DIR (default r_recipes/MODEL/), --sheet KEY.html there. --check opens the model's page (?snap&qa, about a
minute), takes the first mesh of each recipe's parts-list line as shown in the version as last revised, in that object's own frame, and compares it with
the recipe's solid put there by its to_page:
  volume        the recipe's exact volume against the page mesh's, both whole, and the two solids' difference outside the threads (Monte Carlo, 1.5 M points;
                fails past VOL_TOL of the part's volume or 0.5 mm³, whichever is larger: coarse, since the page's turned faces are polygons (72 a turn);
                the surface and hole checks are the fine ones)
  bbox          the boxes' corners (fails past BOX_TOL)
  surface       every point sampled on either surface to the other's (outside the threads, which the recipe draws by convention and the page as a helix):
                the largest and the 99th percentile; fails past SURF_TOL, and lists the five worst places, each with the hole or feature nearest it
  holes         each round hole of a flat part measured on the page by 72 rays from its axis at a depth no other feature of that hole reaches, a circle
                fitted: centre and diameter against the recipe's; fails past HOLE_C, HOLE_D (a tapped hole's rays span a pitch, its centre within 2 HOLE_C: the
                helix runs out at a face or a floor; its diameter the page's at the thread's size + 0.04, reported)
  expected      a recipe's `expect` names where the page's mesh is known to depart from the drawing, with the bound and why: reported, not failed
Exit 1 on any failure. --fault plants one in the top plate's recipe (hole 7 0.03 large, hole 13 0.02 off): the check must fail on both. Each difference is for a person to judge: the recipe wrong (a figure misread) or the old mesh (a modelling artifact)."""
import argparse,asyncio,json,math,pathlib,sys,time,base64
import numpy as np
import model
import build123d as bd
HERE=pathlib.Path(__file__).resolve().parent
VOL_TOL=0.005;BOX_TOL=0.02;SURF_TOL=0.02;HOLE_C=0.01;HOLE_D=0.01

def recipes():
    if model.NAME=='wempe':
        from recipes import wempe;return wempe.RECIPES
    sys.exit('recipes.py: no recipes yet for '+model.NAME)

EXPORT="""hn=>{const mv=window.__mv,shows=o=>{for(let q=o;q;q=q.parent)if(q.userData.rev&&mv.userData.revShows&&!mv.userData.revShows(q.userData.rev,'last'))return false;return true;};
  let root=null;mv.traverse(o=>{if(!root&&o.userData.hn===hn&&shows(o))root=o;});if(!root)return null;mv.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(),out=[],v=new THREE.Vector3();let rotY=null;
  const b64=a=>{const u=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);};
  root.traverse(o=>{if(!o.isMesh||!o.geometry||o.userData.decal||o.userData.surface||!shows(o))return;if(o.userData.screw&&rotY===null)rotY=o.rotation.y;
    const m=inv.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position,n=P.count,pos=new Float32Array(3*n);
    for(let i=0;i<n;i++){v.fromBufferAttribute(P,i).applyMatrix4(m);pos[3*i]=v.x;pos[3*i+1]=v.y;pos[3*i+2]=v.z;}
    const I=o.geometry.index?Uint32Array.from(o.geometry.index.array):Uint32Array.from({length:n},(_,i)=>i);out.push({pos:b64(pos),idx:b64(I)});});
  return{meshes:out,rotY};}"""

async def page_meshes(hns):
    import browser
    from playwright.async_api import async_playwright
    out={}
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(model.PAGE+'#merge=0');await pg.wait_for_function("!document.querySelector('#loading')&&window.__V&&window.__mv",timeout=180000);await pg.wait_for_timeout(1500)
        for h in hns:out[h]=await pg.evaluate(EXPORT,h)
        await b.close()
    if errs:print('page errors:',errs[:3])
    return out

def tm_of(ms):
    import trimesh
    parts=[]
    for m in ms:
        v=np.frombuffer(base64.b64decode(m['pos']),np.float32).reshape(-1,3).astype(float);f=np.frombuffer(base64.b64decode(m['idx']),np.uint32).reshape(-1,3)
        t=trimesh.Trimesh(v,f,process=True);parts.append(t)
    return parts

def tess(part,tol=0.0015):
    import trimesh
    v,f=part.tessellate(tol,0.05);return trimesh.Trimesh(np.array([tuple(q) for q in v]),np.array(f),process=True)

def xf(M,P):return P@M[:3,:3].T+M[:3,3]
def ixf(M,P):return (P-M[:3,3])@M[:3,:3]

def in_zone(Q,zones):
    """points (the recipe's frame) inside a thread's allowance"""
    k=np.zeros(len(Q),bool)
    for (c,r0,r1,z0,z1) in zones:
        rr=np.hypot(Q[:,0]-c[0],Q[:,1]-c[1]);k|=(rr>=r0)&(rr<=r1)&(Q[:,2]>=z0-0.05)&(Q[:,2]<=z1+0.05)
    return k

def contains(meshes,P):
    k=np.zeros(len(P),bool)
    for m in meshes:k|=m.contains(P)
    return k

def nearest(meshes,P):
    import trimesh
    d=np.full(len(P),np.inf)
    for m in meshes:
        _,dd,_=trimesh.proximity.closest_point(m,P);d=np.minimum(d,dd)
    return d

def circle_fit(P):
    A=np.c_[2*P[:,0],2*P[:,1],np.ones(len(P))];b=(P**2).sum(1);c=np.linalg.lstsq(A,b,rcond=None)[0];return c[:2],math.sqrt(c[2]+c[0]**2+c[1]**2)

def check(r,pm):
    from recipes import Hole,Cone
    import trimesh
    res={'part':r.key,'hn':r.hn,'fail':[]};F=res['fail']
    if not pm or not pm['meshes']:F.append('no page mesh for '+r.hn);return res
    M=r.to_page.copy()
    if pm.get('rotY'):   # the page turns each screw's slot by its own angle about the axis (page y)
        a=pm['rotY'];Ry=np.array([[math.cos(a),0,math.sin(a)],[0,1,0],[-math.sin(a),0,math.cos(a)]]);M[:3,:3]=Ry@M[:3,:3];M[:3,3]=Ry@M[:3,3]
    part=r.build();rm=tess(part);rm.vertices=xf(M,rm.vertices);pages=tm_of(pm['meshes']);zones=r.zones()
    vr=part.volume;vp=sum(m.volume for m in pages);res['volume']={'recipe':round(vr,3),'page':round(vp,3),'diff':round(vr-vp,3),'rel':round((vr-vp)/vp,5)}
    lo=np.minimum(rm.bounds[0],np.min([m.bounds[0] for m in pages],0));hi=np.maximum(rm.bounds[1],np.max([m.bounds[1] for m in pages],0))
    rng=np.random.default_rng(3955);N=1500000;P=lo+(hi-lo)*rng.random((N,3));ok=~in_zone(ixf(M,P),zones)
    ir=rm.contains(P);ip=contains(pages,P);bv=np.prod(hi-lo)
    only_r=(ir&~ip&ok).sum()*bv/N;only_p=(ip&~ir&ok).sum()*bv/N
    res['symdiff']={'recipe_only':round(only_r,3),'page_only':round(only_p,3),'sd':round(math.sqrt(max(1,(ir!=ip).sum()))*bv/N,3)}
    vt=max(VOL_TOL*vp,0.5)
    if only_r+only_p>vt:F.append(f'volume: the solids differ by {only_r+only_p:.3f} mm³ outside the threads (tolerance {vt:.3f})')
    bp=np.array([np.min([m.bounds[0] for m in pages],0),np.max([m.bounds[1] for m in pages],0)]);db=np.abs(rm.bounds-bp).max()
    res['bbox']={'recipe':np.round(rm.bounds,3).tolist(),'page':np.round(bp,3).tolist(),'max':round(float(db),4)}
    if db>BOX_TOL:F.append(f'bbox: corners differ by {db:.4f}')
    n=20000;Pr,_=trimesh.sample.sample_surface(rm,n,seed=1);Pp=np.concatenate([trimesh.sample.sample_surface(m,max(200,int(n*m.area/sum(q.area for q in pages))),seed=2)[0] for m in pages])
    kr=~in_zone(ixf(M,Pr),zones);kp=~in_zone(ixf(M,Pp),zones)
    if len(pages)>1:   # a page piece's face inside another piece of the same part (a screw's shank run 0.1 into its head) is no surface of the part
        own=np.concatenate([np.full(max(200,int(n*m.area/sum(q.area for q in pages))),i) for i,m in enumerate(pages)])
        inner=np.array([any(pages[j].contains(Pp[i:i+1])[0] for j in range(len(pages)) if j!=own[i]) for i in range(len(Pp))]);res['inner_faces']=int(inner.sum());kp&=~inner
    dr=nearest(pages,Pr[kr]);dp=nearest([rm],Pp[kp])
    feats=[(o.key if hasattr(o,'key') else '',o.at if hasattr(o,'at') else (0,0)) for o in r.ops() if isinstance(o,(Hole,Cone))]
    def where(q):
        c=ixf(M,q[None])[0]
        if not feats:return f'r {math.hypot(c[0],c[1]):.2f} z {c[2]:.2f}'
        k,a=min(feats,key=lambda f:math.dist(f[1],c[:2]));return f'({c[0]:.2f}, {c[1]:.2f}, z {c[2]:.2f}) near hole {k} ({math.dist(a,c[:2]):.2f} off)'
    allp=np.concatenate([Pr[kr],Pp[kp]]);alld=np.concatenate([dr,dp]);o=np.argsort(-alld);worst=[];seen=[]
    exq=np.zeros(len(allp),bool);C=ixf(M,allp);res['expected']=[]
    for e in r.expect:   # the old mesh's known departures, each within its circle and bound: reported, not failed
        k=(np.hypot(C[:,0]-e['at'][0],C[:,1]-e['at'][1])<=e['r'])&(alld>SURF_TOL);exq|=k&(alld<=e['max'])
        res['expected'].append({'why':e['why'],'max':round(float(alld[k].max()),4) if k.any() else 0,'bound':e['max']})
    for i in o:
        if len(worst)>=5 or alld[i]<SURF_TOL:break
        if any(np.linalg.norm(allp[i]-s)<1.0 for s in seen):continue
        seen.append(allp[i]);worst.append({'d':round(float(alld[i]),4),'at':where(allp[i]),'from':'recipe' if i<len(dr) else 'page','_p':allp[i].tolist()})
    res['surface']={'recipe_to_page':{'max':round(float(dr.max()),4),'p99':round(float(np.percentile(dr,99)),4)},'page_to_recipe':{'max':round(float(dp.max()),4),'p99':round(float(np.percentile(dp,99)),4)},'worst':worst,'excluded':int((~kr).sum()+(~kp).sum())}
    un=alld[~exq]
    if un.max()>SURF_TOL:F.append(f'surface: {un.max():.4f} apart (tolerance {SURF_TOL})')
    for w in worst:w['expected']=bool(exq[np.argmin(np.linalg.norm(allp-np.array(w.pop('_p')),axis=1))])
    holes=[];ops=r.ops()
    for h in [o for o in ops if isinstance(o,Hole)]:
        z0,z1=h.span();cov=[]
        for o in ops:
            if o is h or not hasattr(o,'at') or math.dist(o.at,h.at)>1e-6:continue
            if isinstance(o,Hole) and o.d>h.d:cov.append(o.span())
            if isinstance(o,Cone):
                zf=o.z0 if o.z0 is not None else (0 if o.face=='in' else o.t);cov.append((min(zf,zf+(1 if o.face=='in' else -1)*o.dp),max(zf,zf+(1 if o.face=='in' else -1)*o.dp)))
        zs=[z for z in np.linspace(z0,z1,41)[1:-1] if not any(a-0.03<=z<=b+0.03 for a,b in cov)]
        if not zs:continue
        z=zs[len(zs)//2];th=np.linspace(0,2*math.pi,72,endpoint=False)
        Zs=[z] if not h.thread else [q for q in z+h.thread['p']*(np.arange(12)/12-0.5) if z0<q<z1]   # a tapped hole: rays over one pitch, so the helix averages out
        O=np.array([[h.at[0],h.at[1],q] for q in Zs for _ in th]);Dd=np.tile(np.c_[np.cos(th),np.sin(th),np.zeros(72)],(len(Zs),1))
        Ow=xf(M,O);Dw=Dd@M[:3,:3].T;hits=[]
        for i in range(len(O)):
            best=None
            for m in pages:
                loc,_,_=m.ray.intersects_location(Ow[i:i+1],Dw[i:i+1],multiple_hits=True)
                if len(loc):dd=np.linalg.norm(loc-Ow[i],axis=1);dd=dd[dd>1e-6];best=min(best or 1e9,dd.min()) if len(dd) else best
            if best is not None:hits.append(O[i,:2]+Dd[i,:2]*best)
        if len(hits)<0.8*len(O):holes.append({'hole':h.key,'d':h.d,'z':round(z,3),'page':'no wall found'});F.append(f'hole {h.key} Ø {h.d:.3f}: no wall on the page');continue
        c,rad=circle_fit(np.array(hits));dc=math.dist(c,h.at);dd=2*rad-h.d;e={'hole':h.key,'d':round(h.d,4),'z':round(z,3),'page_d':round(2*rad,4),'dd':round(dd,4),'dc':round(dc,4)}
        if h.thread:e['thread']=f"M{h.thread['d']}: drawn at D1 {h.d:.3f}, the page at its size + 0.04";
        elif abs(dd)>HOLE_D or dc>HOLE_C:F.append(f'hole {h.key} Ø {h.d:.4f}: the page {2*rad:.4f}, centre {dc:.4f} off')
        if h.thread and dc>2*HOLE_C:F.append(f'hole {h.key} (thread): centre {dc:.4f} off')
        holes.append(e)
    res['holes']=holes;return res

SHEET_CSS="body{font:14px/1.45 system-ui,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:#222}h1{font-size:22px;margin:0}.meta{color:#555;margin:4px 0 16px}table{border-collapse:collapse;width:100%;margin:6px 0 14px}td,th{border:1px solid #ccc;padding:3px 6px;text-align:left;vertical-align:top}th{background:#f3f1ec}.setup{margin-top:18px;border-top:2px solid #333;padding-top:6px}.n{color:#777;width:2em}.src{color:#777;font-size:12px}"
def sheet(r):
    import html
    E=html.escape;h=[f"<!doctype html><meta charset=utf-8><title>{E(r.title)}</title><style>{SHEET_CSS}</style><h1>{E(r.title)}</h1>",
      f"<div class=meta>Drawing {E(r.drawing)} · parts-list line {E(r.hn)} · material: {E(r.material)} · treatment: {E(r.treatment)} · solid: {E(r.key)}.step</div>"]
    if r.fits:h.append('<p><b>Fits.</b> '+'; '.join(E(f) for f in r.fits)+'</p>')
    n=0
    for s in r.setups:
        h.append(f"<div class=setup><b>Setup {E(s.name)}</b>: {E(s.hold)}</div><table><tr><th class=n>#</th><th>Operation</th><th>Size</th><th>Tolerance / fit</th><th>Source</th></tr>")
        for o in s.ops:
            n+=1;sz=o.sizes or [{'label':'','value':'','tol':None,'src':o.src}]
            for i,q in enumerate(sz):
                h.append('<tr>'+(f"<td class=n rowspan={len(sz)}>{n}</td><td rowspan={len(sz)}>{E(o.text)}</td>" if i==0 else '')+f"<td>{E((q['label']+' ' if q['label'] else '')+str(q['value']))}</td><td>{E(q['tol'] or '')}</td><td class=src>{E(q['src'] or o.src)}</td></tr>")
        h.append('</table>')
    if r.notes:h.append('<p><b>Notes.</b> '+' '.join(E(x) for x in r.notes)+'</p>')
    h.append('<p class=src>Threads drawn by convention (DIN ISO 6410): the STEP solid has an outside thread at its major diameter, an inside one at its minor (tap drill).</p>')
    return ''.join(h)

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--step',nargs='?',const='');a.add_argument('--sheet',nargs='?',const='');a.add_argument('--check',action='store_true');a.add_argument('--json');a.add_argument('--fault',action='store_true')
    o=a.parse_args();R={k:f() for k,f in recipes().items() if not o.only or k in o.only.split(',')}
    if o.fault and 'topPlate' in R:   # a planted fault the check must find: hole 7 0.03 large, hole 13 0.02 off its place
        from recipes import Hole
        for h in R['topPlate'].ops():
            if isinstance(h,Hole) and h.key==7:h.d+=0.03
            if isinstance(h,Hole) and h.key==13:h.at=(h.at[0]+0.02,h.at[1])
    out=pathlib.Path(o.step or o.sheet or HERE/'r_recipes'/model.NAME) if (o.step or o.sheet) else HERE/'r_recipes'/model.NAME
    if o.step is not None or o.sheet is not None:out.mkdir(parents=True,exist_ok=True)
    for k,r in R.items():
        t=time.time();p=r.build()
        p.label=f'{r.title} {r.hn}'
        if o.step is not None:bd.export_step(p,str(out/f'{k}.step'));bd.export_stl(p,str(out/f'{k}.stl'),tolerance=0.002)
        if o.sheet is not None:(out/f'{k}.html').write_text(sheet(r),encoding='utf-8')
        print(f'{k}: {r.title}, {len(r.ops())} operations, volume {p.volume:.3f} mm³ ({time.time()-t:.1f} s)',flush=True)
    if not o.check:return
    pm=asyncio.run(page_meshes([r.hn for r in R.values()]));bad=0;allres=[]
    for k,r in R.items():
        t=time.time();res=check(r,pm.get(r.hn));allres.append(res);v=res.get('volume',{});s=res.get('surface',{})
        print(f"\n== {k} ({r.hn}) {'FAIL' if res['fail'] else 'ok'} ({time.time()-t:.0f} s)")
        if v:print(f"  volume  recipe {v['recipe']} page {v['page']} ({v['rel']*100:+.3f} %); differ outside threads: recipe only {res['symdiff']['recipe_only']}, page only {res['symdiff']['page_only']} mm³ (±{res['symdiff']['sd']})")
        if 'bbox' in res:print(f"  bbox    corners within {res['bbox']['max']}")
        if s:print(f"  surface recipe→page max {s['recipe_to_page']['max']} p99 {s['recipe_to_page']['p99']}; page→recipe max {s['page_to_recipe']['max']} p99 {s['page_to_recipe']['p99']}")
        for w in s.get('worst',[]):print(f"    {w['d']:.4f} on the {w['from']}'s surface at {w['at']}"+(' (expected)' if w.get('expected') else ''))
        for e in res.get('expected',[]):print(f"  expected, the old mesh: {e['max']} (bound {e['bound']}): {e['why']}")
        if res.get('inner_faces'):print(f"  {res['inner_faces']} sample points on page faces inside another piece of the part, left out")
        for h in res.get('holes',[]):print(f"  hole {h['hole']:>4} Ø {h['d']:.4f}: page {h.get('page_d','-')} (Δd {h.get('dd','-')}, centre {h.get('dc','-')}) {h.get('thread','')}{h.get('page','')}")
        for f in res['fail']:print('  FAIL',f)
        bad+=bool(res['fail'])
    if o.json:pathlib.Path(o.json).write_text(json.dumps(allres,indent=1),encoding='utf-8')
    sys.exit(1 if bad else 0)

if __name__=='__main__':main()
