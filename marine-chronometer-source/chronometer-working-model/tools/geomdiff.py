"""geomdiff.py: which parts' geometry differs between two copies of a model's page (a release against the one before, a branch against main).

    python geomdiff.py --model wempe --before ../../../../ba-before/marine-chronometer-source/wempe/index.html [--revs last,6mx] [--tol 0.0002] [--spec OUT.json] [--json OUT]

Both pages are opened, and for each version (the Wempe's setRev names; the Hamilton has one) the model is put in one stated pose, the same numbers on both pages (the escape
wheel at a whole tooth, the balance at rest, the detent home, the springs free, the fusee 2.5 turns from full wind: not a moment of the running escapement, whose timing a
change may move, but a pose in which only a part's own shape and place can differ). Every mesh shown is read in the movement's frame and summed by its parts-list line
(userData.hn, else its part's name): meshes, vertices, centroid, second moments and box. A line differs when any of them moves more than --tol (mm, default 0.0002);
it prints the line with what moved and how far, and lines only one page has. --spec writes the changed lines as a beforeafter.py SPEC (run it with --still, the same pose)
for pictures. It reports and exits 0; exit 1 on a page error. About 1 minute a version on a quiet machine."""
import asyncio,browser,json,pathlib,sys
from playwright.async_api import async_playwright
import model
POSE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const u=(n,w)=>mv.userData._u({E:1000,th:0,lift:0,psDef:0,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""
READ=r"""(()=>{const mv=window.__mv;let sc=mv;while(sc.parent)sc=sc.parent;sc.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),out={},v=new THREE.Vector3(),m=new THREE.Matrix4();
  const shows=o=>{for(let q=o;q;q=q.parent)if(!q.visible)return false;return true;};
  const own=o=>{let pn=null;for(let q=o;q;q=q.parent){if(q.userData.hn)return q.userData.hn;if(!pn&&q.userData.partName)pn='part:'+q.userData.partName;}return pn||'(untagged)';};
  sc.traverse(o=>{if(!o.isMesh||!shows(o)||!o.geometry||!o.geometry.attributes.position||o.userData.decal||o.userData.surface)return;
    const k=own(o),e=out[k]||(out[k]={m:0,n:0,s:[0,0,0],q:[0,0,0],lo:[1e9,1e9,1e9],hi:[-1e9,-1e9,-1e9]}),p=o.geometry.attributes.position;m.multiplyMatrices(inv,o.matrixWorld);e.m++;e.n+=p.count;
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(m);const a=[v.x,v.y,v.z];for(let j=0;j<3;j++){e.s[j]+=a[j];e.q[j]+=a[j]*a[j];if(a[j]<e.lo[j])e.lo[j]=a[j];if(a[j]>e.hi[j])e.hi[j]=a[j];}}});
  return out;})()"""
async def page(b,url):
    pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=1,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto(url,timeout=300000);await pg.wait_for_function("window.__mv&&!document.querySelector('#loading')",timeout=300000);await pg.wait_for_timeout(2000)
    await pg.evaluate("(()=>{const b=document.querySelector('#speeds button[data-v=\"0\"]');if(b)b.click();})()");pg.errs=errs;return pg
async def read(pg,rev):
    if rev is not None:await pg.evaluate(f"__mv.userData.setRev({json.dumps(rev)})")
    await pg.evaluate(POSE);await pg.wait_for_timeout(300);return await pg.evaluate(READ)
def cmp(a,b,tol):
    """What differs between a line's sums on the two pages: [] if nothing past tol."""
    d=[]
    if a['m']!=b['m']:d.append(f"meshes {a['m']} -> {b['m']}")
    if a['n']!=b['n']:d.append(f"vertices {a['n']} -> {b['n']}")
    ca=[s/a['n'] for s in a['s']];cb=[s/b['n'] for s in b['s']];dc=sum((x-y)**2 for x,y in zip(ca,cb))**0.5
    if dc>tol:d.append(f"centroid moved {dc:.4f} mm ({', '.join(f'{y-x:+.4f}' for x,y in zip(ca,cb))})")
    db=max(max(abs(x-y) for x,y in zip(a['lo'],b['lo'])),max(abs(x-y) for x,y in zip(a['hi'],b['hi'])))
    if db>tol:d.append(f"box moved {db:.4f} mm (size {' x '.join(f'{h-l:.3f}' for l,h in zip(a['lo'],a['hi']))} -> {' x '.join(f'{h-l:.3f}' for l,h in zip(b['lo'],b['hi']))})")
    ra=[(q/a['n']-c*c) for q,c in zip(a['q'],ca)];rb=[(q/b['n']-c*c) for q,c in zip(b['q'],cb)];dr=max(abs(max(x,0)**0.5-max(y,0)**0.5) for x,y in zip(ra,rb))
    if dr>tol and not d:d.append(f"spread about the centroid moved {dr:.4f} mm (the same count, centroid and box: turned or reshaped inside)")
    elif dr>tol:d.append(f"spread {dr:.4f} mm")
    return d
async def main():
    a=sys.argv;tol=float(a[a.index('--tol')+1]) if '--tol' in a else 2e-4
    before=pathlib.Path(a[a.index('--before')+1]).resolve().as_uri()+model.PAGE[model.PAGE.index('?'):]+'#merge=0';after=model.PAGE.split('#')[0]+'#merge=0'
    revs=a[a.index('--revs')+1].split(',') if '--revs' in a else (None if model.HAMILTON else ['last','first','3955','6mx','1943'])
    res={};spec=[];bad=False
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        P=await page(b,before);Q=await page(b,after)
        for rev in (revs or [None]):
            A=await read(P,rev);B=await read(Q,rev);name=rev or 'the model';rows=[]
            for k in sorted(set(A)|set(B)):
                if k not in A:rows.append((k,['only on the after page']))
                elif k not in B:rows.append((k,['only on the before page']))
                else:
                    d=cmp(A[k],B[k],tol)
                    if d:rows.append((k,d))
            res[name]={'lines':len(set(A)|set(B)),'vertices':[sum(e['n'] for e in A.values()),sum(e['n'] for e in B.values())],'changed':{k:d for k,d in rows}}
            print(f"{name}: {len(set(A)|set(B))} lines, {res[name]['vertices'][0]:,} vertices before and {res[name]['vertices'][1]:,} after; {len(rows)} differ"+(':' if rows else ''),flush=True)
            for k,d in rows:
                print(f"  {k:<16} "+'; '.join(d))
                if not k.startswith(('part:','(')) and k in B:spec.append({'name':f"{k.replace('.','_')}{'' if rev in (None,'last') else '_'+rev}",'hn':[k],**({} if rev in (None,'last') else {'rev':rev})})
        for g,t in ((P,'before'),(Q,'after')):
            if g.errs:print(t,'page errors:',g.errs[:3]);bad=True
        await b.close()
    if '--spec' in a:
        seen=set();uniq=[]
        for it in spec:   # a line that differs in every version once, in the first version it shows in
            if it['hn'][0] in seen:continue
            seen.add(it['hn'][0]);uniq.append(it)
        pathlib.Path(a[a.index('--spec')+1]).write_text(json.dumps(uniq,indent=1),encoding='utf-8');print('wrote',a[a.index('--spec')+1],f'({len(uniq)} pieces)')
    if '--json' in a:pathlib.Path(a[a.index('--json')+1]).write_text(json.dumps(res,indent=1),encoding='utf-8')
    sys.exit(1 if bad else 0)
asyncio.run(main())
