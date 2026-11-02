"""hamilton_detent_export.py: the 3D model's detent group (the support block 42086 with its button and pins, the screws 20756, 37024, 42091, 1770, the washer
42251, the trip spring 42088 and its bracket 42092, the wedge pin 42089, the locking stone, and the detent 42087 itself for reference) read off the page's
solids into the detent's own frame, for the drawn parts' whole detent (recipes/hamilton.py, asmDetent): the parts 42093 lists without sizes, at the
model's measured sizes (KLUwI2UUCMQ 11:10-11:33, Fig. 90, x1.117). The model isn't changed.

    python hamilton_detent_export.py      (about a minute; the page in Chromium)

Writes tools/recipes/hamilton_detent_model.json: for each mesh, its parts-list line and its triangles in mm, (t, n, h): t along the detent from its point
of flexure (makeEsc's Ft) toward the locking stone, n across it in plan (makeEsc's nB), h the movement's height (the dial side up). The page is frozen as
audit.py freezes it (placements.py's first state): the detent home on its button."""
import asyncio,json,pathlib,sys
import browser
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
OUT=HERE/'recipes'/'hamilton_detent_model.json'
import re
FREEZE=re.search(r'FREEZE="""(.*?)"""',(HERE/'audit.py').read_text(encoding='utf-8'),re.S).group(1)   # audit.py's frozen state (placements.py's first), read, not imported (audit.py runs on import)
KEEP=r'^(42086|42087|42088|42089|42091|42092|1770|20756|37024|42251\.det)'
JS=r"""(keep)=>{const re=new RegExp(keep);__mv.updateMatrixWorld(true);const E=ESC,ES=E.ES;
  const o0=E.D(0,0),dB=E.D(1,0),nB=E.D(0,1),lu=Math.hypot(dB.x-o0.x,dB.y-o0.y),lv=Math.hypot(nB.x-o0.x,nB.y-o0.y),u=[(dB.x-o0.x)/lu,(dB.y-o0.y)/lu],v=[(nB.x-o0.x)/lv,(nB.y-o0.y)/lv];
  // the frame the detent's fixed pieces are built in: the group holding the block (its x, z the escapement's unit frame from Ft times ES)
  let G=null;__mv.traverse(o=>{if(!G&&o.isMesh&&o.userData.hn==='42086')G=o.parent;});const Gi=G.matrixWorld.clone().invert();
  const out=[];__mv.traverse(o=>{if(!o.isMesh||!o.visible)return;let h=o.userData.hn,q=o;while(!h&&q.parent){q=q.parent;h=q.userData.hn;}if(!h||!re.test(h))return;
    const g=o.geometry,P=g.attributes.position,M=o.matrixWorld.clone().premultiply(Gi),V=[],w=new THREE.Vector3();
    for(let i=0;i<P.count;i++){w.fromBufferAttribute(P,i).applyMatrix4(M);const x=w.x/ES,z=w.z/ES;V.push(+((x*u[0]+z*u[1])*ES).toFixed(5),+((x*v[0]+z*v[1])*ES).toFixed(5),+(w.y-0).toFixed(5));}
    const I=g.index?Array.from(g.index.array):[...Array(P.count).keys()];
    out.push({hn:h,sub:o.userData.hn?0:1,name:o.name||'',v:V,i:I,mat:(o.material&&o.material.name)||''});});
  // reference points: the block's pins and the clamp screw in t, n (mm) as the model's tables give them
  return {ES,Ft:[E.Ft.x,E.Ft.y],u,v,meshes:out,hG:G.matrixWorld.elements[13]};}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS);pg=await b.new_page()
        await pg.goto(PAGE);await pg.wait_for_function("window.__mv&&__mv.children.length>0",timeout=120000);await pg.wait_for_timeout(3000)
        await pg.evaluate(FREEZE);await pg.wait_for_timeout(300)
        r=await pg.evaluate(JS,KEEP);await b.close()
    OUT.write_text(json.dumps(r,separators=(',',':')),encoding='utf-8',newline='\n')
    from collections import Counter
    print(OUT,len(r['meshes']),'meshes:',dict(Counter(m['hn'] for m in r['meshes'])))
if __name__=='__main__':asyncio.run(main())
