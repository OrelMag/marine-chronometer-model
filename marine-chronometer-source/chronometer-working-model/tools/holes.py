"""The holes through a part's face, read off the built model: each hole's centre (movement frame, mm: x toward 3 o'clock, z toward
6 o'clock) and radius, as JSON for video.py anchor. The face is the part's top (or with --bottom its underside); a hole is an inner
loop of its outline there, so countersinks and counterbores read at that face's size.

  python holes.py trainBridge [--bottom] [--out holes_trainBridge.json] [--min 0.2] [--max 4] [--plan plan.png]

--plan draws the face in plan as the dial side sees it (+x, 3 o'clock, right; 12 o'clock up; 20 px/mm): every loop of its outline,
the holes kept numbered.

The part is the largest mesh of its group (__mv.userData.parts). Loops with a radius outside --min..--max (mm) are left out (the
keyhole and the bridge's own cuts are larger). The holes are numbered h1, h2... in order of angle round the movement's centre;
give the ones you anchor on their names in the JSON (what each is: the S table in movement.js). About 20 s."""
import asyncio, json, math, os, sys
from playwright.async_api import async_playwright
PAGE = 'file:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'index.html')).replace('\\', '/') + '?snap&qa'
a = sys.argv[1:]
if not a: sys.exit(__doc__)
def opt(k, d):
    if k in a: i = a.index(k); v = a[i + 1]; del a[i:i + 2]; return v
    return d
bottom = '--bottom' in a
if bottom: a.remove('--bottom')
plan = opt('--plan', None); part = a[0]; out = opt('--out', f'holes_{part}.json'); rmin = float(opt('--min', 0.2)); rmax = float(opt('--max', 4))
JS = """([name,bottom])=>{const g0=__mv.userData.parts[name];if(!g0)return null;let m=null;g0.traverse(o=>{if(o.isMesh&&(!m||o.geometry.attributes.position.count>m.geometry.attributes.position.count))m=o;});if(!m)return null;
  m.updateWorldMatrix(true,false);const inv=new THREE.Matrix4().copy(__mv.matrixWorld).invert(),T=new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld);
  const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry,p=g.attributes.position,V=[];for(let i=0;i<p.count;i++)V.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(T));
  let y=bottom?1e9:-1e9;for(const v of V)y=bottom?Math.min(y,v.y):Math.max(y,v.y);
  const key=v=>v.x.toFixed(4)+','+v.z.toFixed(4),E=new Map();
  for(let i=0;i<V.length;i+=3){const t=[V[i],V[i+1],V[i+2]];if(!t.every(v=>Math.abs(v.y-y)<1e-3))continue;
    for(let k=0;k<3;k++){const a=key(t[k]),b=key(t[(k+1)%3]),e=a<b?a+'|'+b:b+'|'+a;E.set(e,(E.get(e)||0)+1);}}
  const adj=new Map();for(const[e,n]of E)if(n===1){const[a,b]=e.split('|');(adj.get(a)||adj.set(a,[]).get(a)).push(b);(adj.get(b)||adj.set(b,[]).get(b)).push(a);}
  const seen=new Set(),loops=[];for(const s of adj.keys()){if(seen.has(s))continue;const L=[];let c=s,prev=null;
    while(c&&!seen.has(c)){seen.add(c);L.push(c.split(',').map(Number));const n=adj.get(c).find(x=>x!==prev&&!seen.has(x));prev=c;c=n;}loops.push(L);}
  return{y,loops};}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"])
        w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(3000); await w.close()   # see smoke.py
        pg = await b.new_page(); await pg.goto(PAGE); await pg.wait_for_function("!document.querySelector('#loading')", timeout=120000); await pg.wait_for_timeout(1500)
        r = await pg.evaluate(JS, [part, bottom]); await b.close(); return r
r = asyncio.run(main())
if r is None: sys.exit(f'{part}: no mesh with that partName')
H = []
for L in r['loops']:
    if len(L) < 6: continue
    cx = sum(q[0] for q in L) / len(L); cz = sum(q[1] for q in L) / len(L); rr = sum(math.hypot(q[0] - cx, q[1] - cz) for q in L) / len(L)
    if rmin <= rr <= rmax: H.append((cx, cz, rr))
H.sort(key=lambda h: math.atan2(h[1], h[0]))
res = {'part': part, 'face_y': round(r['y'], 3), 'holes': {f'h{i + 1}': [round(x, 2), round(z, 2), round(rr, 2)] for i, (x, z, rr) in enumerate(H)}}
json.dump(res, open(out, 'w'), indent=1); print(f"{len(H)} holes on {part}'s {'underside' if bottom else 'top'} (y {r['y']:.2f}) -> {out}")
for k, (x, z, rr) in res['holes'].items(): print(f'  {k:4s} ({x:7.2f}, {z:7.2f})  r {rr:.2f}')
if plan:
    import cv2, numpy as np
    S_ = 20; W_ = 1800; o = np.full((W_, W_, 3), 255, np.uint8); P_ = lambda x, z: (int(W_ / 2 + x * S_), int(W_ / 2 + z * S_))
    for L in r['loops']: cv2.polylines(o, [np.array([P_(*q) for q in L], np.int32)], True, (90, 90, 90), 2)
    for k, (x, z, rr) in res['holes'].items(): cv2.putText(o, k, (P_(x, z)[0] + 6, P_(x, z)[1] - 6), 0, 0.6, (200, 0, 0), 2)
    cv2.putText(o, '12', P_(-1, -43), 0, 0.9, (0, 0, 0), 2); cv2.putText(o, '3', P_(43, 0.5), 0, 0.9, (0, 0, 0), 2); cv2.drawMarker(o, P_(0, 0), (0, 0, 255), 0, 20, 2)
    cv2.imwrite(plan, o); print('drew', plan)
