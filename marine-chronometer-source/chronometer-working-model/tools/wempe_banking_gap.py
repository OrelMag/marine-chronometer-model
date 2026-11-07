"""Where the Wempe's detent pipe banks, on the page's own solids, in each version (WEMPE-VARIANT-PHYSICS-GAPS.md, gap 3: the 6MX's domed banking head Ø 3.4).

The physics (makeEsc, dynamics.js, tripping.js --model wempe) banks the detent where it is drawn, the pipe's side on the banking, its preload a moment. This finds, with the
detent at rest as the page draws it, how far the pipe's side stands from the nearest solid that isn't the detent's: rays from the pipe's axis outward, every 1° round it at
eleven heights over the pipe's length, against every shown mesh but the detent's moving pieces; the least hit less the pipe's radius is the gap, and the solid hit, its height
and direction say what it banks on. A gap near 0 (the drawn 0.005) where the physics takes it banks where the physics puts it.

    python wempe_banking_gap.py [--rev last,6mx,1943,first,3955]   (about a minute; reports, never fails but on a page error)
"""
import asyncio,browser,json,sys
import model
from playwright.async_api import async_playwright
REVS=(sys.argv[sys.argv.index('--rev')+1] if '--rev' in sys.argv else 'last,6mx').split(',')
JS=r"""(rev)=>{__mv.userData.setRev(rev);__mv.updateMatrixWorld(true);
  const hn=o=>{for(let p=o;p;p=p.parent)if(p.userData&&p.userData.hn)return String(p.userData.hn).split(' ')[0];return'';};
  const pn=o=>{for(let p=o;p;p=p.parent)if(p.userData&&p.userData.partName)return p.userData.partName;return'';};
  const shown=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
  const ms=[];__mv.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes.position&&shown(o)&&!o.userData.decal&&!o.userData.surface)ms.push(o);});
  /* the pipe (fused with the blade and horn into one mesh): its axis the locking stone's (050401-3, Ø 0.75 in it, its length the pipe's: escapement.js's dv,
     the stone y0 yd(o.pp) to yd(o.pp+o.pl) as the pipe), its radius K_.pR 0.575 */
  const bb=new THREE.Box3();let pipe=null;
  for(const o of ms){if(hn(o)!=='050401-3')continue;bb.setFromObject(o);const s=bb.getSize(new THREE.Vector3());if(Math.abs(s.x-0.75)<0.03&&Math.abs(s.z-0.75)<0.03){pipe={o,b:bb.clone()};break;}}
  if(!pipe)return JSON.stringify({rev,err:'no stone'});
  const c=pipe.b.getCenter(new THREE.Vector3()),y0=pipe.b.min.y,y1=pipe.b.max.y,r=0.575;
  /* the detent's moving pieces: everything under the pipe's part group that turns with it (the detent part) */
  let det=pipe.o;while(det.parent&&!det.userData.partName)det=det.parent;
  const under=(o,a)=>{for(let p=o;p;p=p.parent)if(p===a)return true;return false;};
  const near=new THREE.Box3(new THREE.Vector3(c.x-r-1.5,y0-0.5,c.z-r-1.5),new THREE.Vector3(c.x+r+1.5,y1+0.5,c.z+r+1.5)),tb=new THREE.Box3();
  const tg=ms.filter(o=>!under(o,det)&&tb.setFromObject(o).intersectsBox(near));   /* only what stands within 1.5 of the pipe */
  const rc=new THREE.Raycaster();rc.layers.enableAll();rc.far=3;let best={g:1e9};const hits=[];
  for(let k=0;k<=40;k++){const y=y0+0.002+(y1-y0-0.004)*k/40;for(let a=0;a<360;a+=1){const t=a*Math.PI/180,d=new THREE.Vector3(Math.cos(t),0,Math.sin(t));
    rc.set(new THREE.Vector3(c.x,y,c.z),d);const h=rc.intersectObjects(tg,false)[0];if(!h)continue;const g=h.distance-r;if(g<best.g)best={g,y:y-y0,a,hn:hn(h.object),part:pn(h.object),n:h.face?h.face.normal.clone().transformDirection(h.object.matrixWorld).toArray().map(x=>+x.toFixed(3)):null};
    if(g<0.05)hits.push([+(y-y0).toFixed(2),a,+g.toFixed(4),hn(h.object)]);}}
  /* the band of contact: the directions and heights within 5 µm of the least */
  const nr=hits.filter(h=>h[2]<best.g+0.005);
  return JSON.stringify({rev,pipe:{c:[c.x,c.z].map(x=>+x.toFixed(3)),y:[+y0.toFixed(3),+y1.toFixed(3)]},gap:+best.g.toFixed(4),at:{h:+best.y.toFixed(2),deg:best.a,hn:best.hn,part:best.part,normal:best.n},
    band:{n:nr.length,h:[Math.min(...nr.map(h=>h[0])),Math.max(...nr.map(h=>h[0]))],deg:[Math.min(...nr.map(h=>h[1])),Math.max(...nr.map(h=>h[1]))],hn:[...new Set(nr.map(h=>h[3]))]},targets:tg.map(hn),
    within50:[...new Set(hits.map(h=>h[3]))]});}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(2000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(model.PAGE);await pg.wait_for_function("!document.querySelector('#loading')&&window.__mv",timeout=120000);await pg.wait_for_timeout(2500)
        out=[json.loads(await pg.evaluate(JS,r)) for r in REVS];await b.close()
    if errs:print('page errors:',errs);sys.exit(1)
    for q in out:print(json.dumps(q,ensure_ascii=False))
asyncio.run(main())
