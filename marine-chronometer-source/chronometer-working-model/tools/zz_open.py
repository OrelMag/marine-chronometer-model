import os,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
PAGE=(Path(__file__).resolve().parent.parent/'index.html').as_uri()+'?snap&qa'
PART=sys.argv[1] if len(sys.argv)>1 else 'barrelBridge'
JS="""(P)=>{let out=[];__mv.traverse(o=>{if(!o.isMesh)return;let q=o,pn;while(q&&!pn){pn=q.userData.partName;q=q.parent;}if(pn!==P||o.geometry.type!=='ExtrudeGeometry')return;
 const g=o.geometry,p=g.attributes.position;if(!p)return;const ix=g.index?g.index.array:[...Array(p.count).keys()],key=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(4)).join(','),E={};
 for(let t=0;t<ix.length;t+=3)for(let e=0;e<3;e++){const a=key(ix[t+e]),b=key(ix[t+(e+1)%3]),k=a<b?a+'|'+b:b+'|'+a;E[k]=(E[k]||0)+1;}
 o.updateMatrixWorld();for(const [k,n] of Object.entries(E))if(n!==2){const v=k.split('|')[0].split(',').map(Number);const w=new THREE.Vector3(...v).applyMatrix4(o.matrixWorld);out.push([n,+w.x.toFixed(2),+w.y.toFixed(2),+w.z.toFixed(2)]);}});return out;}"""
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=b.new_page();pg.goto(PAGE);pg.wait_for_function('window.__mv',timeout=120000)
    r=pg.evaluate(JS,PART);print(len(r));print(r[:60]);b.close()
