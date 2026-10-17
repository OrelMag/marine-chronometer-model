"""A frame of a real part laid over the model's plan of it, to find the holes the model lacks (or has and the part doesn't): the frame is mapped onto the
part's face by a homography fitted on seed points (a model place and the pixel where the frame shows it: bushings, screws, pillars), and with --refine refined on every model
hole whose dark disc is found near where the seeds put it (it can lock onto the wrong spots: check the residuals); the frame is warped into the plan (20 px/mm, as the dial side sees it: +x right, +z down) and the
model's outline and holes drawn over it, numbered, into r_hm_NAME.png, with r_hm_NAME_tNN.png tiles at 2x for reading by eye. It prints each model hole's
residual and, for each dark round blob inside the part that no model hole explains, its place in mm: candidates to look at, not findings.

    python holemap.py FRAME PART [--model wempe] [--bottom] --seed X,Z:U,V [--seed ...] [--name NAME] [--tol 0.8] [--reuse] [--refine] [--fix mI:RX,RY ...] [--nocand]

PART is a part name (__mv.userData.parts); --bottom takes the face toward the dial (+y), else the face toward the train side. Seeds are model x,z (mm)
and pixel u,v; two give a similarity (the mirror chosen by which face the frame shows: the train side's face seen from above is the plan mirrored), three
or more an affine or homography. --reuse reads the part's loops from r_hm_PART.json in the current directory (written the first time). About 20 s for the loops, then a few seconds."""
import asyncio, json, math, os, pathlib, sys
import browser
import cv2, numpy as np
import model   # --model NAME: another model's page (the Wempe's plates); stripped from sys.argv
HERE = pathlib.Path(__file__).resolve().parent
PAGE = model.PAGE
a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__)
def opt(k, d=None, many=False):
    vals = []
    while k in a: i = a.index(k); vals.append(a[i + 1]); del a[i:i + 2]
    return vals if many else (vals[-1] if vals else d)
bottom = '--bottom' in a
if bottom: a.remove('--bottom')
reuse = '--reuse' in a
if reuse: a.remove('--reuse')
refine = '--refine' in a
if refine: a.remove('--refine')
nocand = '--nocand' in a
if nocand: a.remove('--nocand')
seeds = [tuple(map(float, s.replace(':', ',').split(','))) for s in opt('--seed', many=True)]
tol = float(opt('--tol', 0.8)); frame, part = a[0], a[1]; name = opt('--name', f'{part}{"_bottom" if bottom else ""}')
JS = """([name,bottom])=>{const g0=__mv.userData.parts[name];if(!g0)return null;let m=null;g0.traverse(o=>{if(o.isMesh&&(!m||o.geometry.attributes.position.count>m.geometry.attributes.position.count))m=o;});
  m.updateWorldMatrix(true,false);const inv=new THREE.Matrix4().copy(__mv.matrixWorld).invert(),T=new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld);
  const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry,p=g.attributes.position,V=[];for(let i=0;i<p.count;i++)V.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(T));
  let y=bottom?-1e9:1e9;for(const v of V)y=bottom?Math.max(y,v.y):Math.min(y,v.y);
  const key=v=>v.x.toFixed(4)+','+v.z.toFixed(4),E=new Map();
  for(let i=0;i<V.length;i+=3){const t=[V[i],V[i+1],V[i+2]];if(!t.every(v=>Math.abs(v.y-y)<1e-3))continue;for(let k=0;k<3;k++){const a=key(t[k]),b=key(t[(k+1)%3]),e=a<b?a+'|'+b:b+'|'+a;E.set(e,(E.get(e)||0)+1);}}
  const adj=new Map();for(const[e,n]of E)if(n===1){const[a,b]=e.split('|');(adj.get(a)||adj.set(a,[]).get(a)).push(b);(adj.get(b)||adj.set(b,[]).get(b)).push(a);}
  const seen=new Set(),loops=[];for(const s of adj.keys()){if(seen.has(s))continue;const L=[];let c=s,prev=null;while(c&&!seen.has(c)){seen.add(c);L.push(c.split(',').map(Number));const n=adj.get(c).find(x=>x!==prev&&!seen.has(x));prev=c;c=n;}loops.push(L);}
  /* the screws, pins and arbors through it: what the model puts in its holes (their centres, for reading the frame) */
  return{y,loops};}"""
cache = pathlib.Path(f'r_hm_{part}{"_bottom" if bottom else ""}.json')   # in the current directory, as the other outputs
if reuse and cache.exists(): face = json.loads(cache.read_text())
else:
    from playwright.async_api import async_playwright
    async def main():
        async with async_playwright() as p:
            b = await p.chromium.launch(args=browser.ARGS)
            w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(3000); await w.close()   # see smoke.py
            pg = await b.new_page(); await pg.goto(PAGE); await pg.wait_for_function("!document.querySelector('#loading')", timeout=120000); await pg.wait_for_timeout(1500)
            r = await pg.evaluate(JS, [part, bottom]); await b.close(); return r
    face = asyncio.run(main())
    if face is None: sys.exit(f'{part}: no such part')
    cache.write_text(json.dumps(face), encoding='utf-8')
loops = [np.array(L, float) for L in face['loops'] if len(L) > 2]
area = lambda L: 0.5 * abs(np.dot(L[:, 0], np.roll(L[:, 1], 1)) - np.dot(L[:, 1], np.roll(L[:, 0], 1)))
loops.sort(key=area, reverse=True); outer = loops[0]
holes = []
for L in loops[1:]:
    c = L.mean(0); rs = np.hypot(*(L - c).T); r = rs.mean()
    holes.append((c, r, np.abs(rs - r).max() < 0.08 * r + 0.01))   # centre, radius, round or not
img = cv2.imread(frame); assert img is not None, frame
# the map: model x,z -> pixel u,v (a similarity from two seeds, mirrored when the frame shows the train side's face)
M = np.array([s[:2] for s in seeds]); P = np.array([s[2:] for s in seeds])
def sim(M, P, mirror):
    Mm = M * [1, -1] if mirror else M
    zm, zp = Mm[:, 0] + 1j * Mm[:, 1], P[:, 0] + 1j * P[:, 1]
    A = np.c_[zm, np.ones(len(zm))]; k, t = np.linalg.lstsq(A, zp, rcond=None)[0]
    return lambda X: (lambda z: np.c_[z.real, z.imag])(k * ((X * [1, -1] if mirror else X)[:, 0] + 1j * (X * [1, -1] if mirror else X)[:, 1]) + t)
if len(seeds) >= 4: H, _ = cv2.findHomography(M, P); f = lambda X: cv2.perspectiveTransform(X.reshape(-1, 1, 2).astype(np.float64), H).reshape(-1, 2)
else: f = sim(M, P, not bottom)
# --fix mI:RX,RY: model hole mI is really at (RX, RY) of the plan raster this same command drew (read off r_hm_NAME.png); each becomes a seed, then a homography on all
fixes = opt('--fix', many=True)
if fixes:
    K0 = 20.0; lo0 = outer.min(0) - 3; MM, PP = list(M), list(P)
    for fx in fixes:
        i, xy = fx.split(':'); i = int(i.lstrip('m')) - 1; rx, ry = map(float, xy.split(','))
        MM.append(holes[i][0]); PP.append(f(np.array([[rx / K0 + lo0[0], ry / K0 + lo0[1]]]))[0])
    H, _ = cv2.findHomography(np.array(MM, float), np.array(PP, float)); f = lambda X, H=H: cv2.perspectiveTransform(X.reshape(-1, 1, 2).astype(np.float64), H).reshape(-1, 2)
    M, P = np.array(MM, float), np.array(PP, float)
# refine: each round model hole's dark disc near its projection (the darkest small blob within 1.5 r + 1 mm), then a homography on them all
g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (5, 5), 0)
def scale_at(c):
    q = f(np.array([c, c + [1, 0]])); return np.hypot(*(q[1] - q[0]))
src = []
for it in range(3 if refine else 0):
    src, dst = [], []
    for c, r, rnd in holes:
        if not rnd or r < 0.2: continue
        u, v = f(np.array([c]))[0]; s = scale_at(c); R = int((1.5 * r + 1.0) * s)
        x0, y0 = int(u - R), int(v - R)
        if x0 < 0 or y0 < 0 or x0 + 2 * R >= g.shape[1] or y0 + 2 * R >= g.shape[0]: continue
        win = g[y0:y0 + 2 * R, x0:x0 + 2 * R]; k = max(3, int(r * s * 0.8) | 1)
        sm = cv2.blur(win, (k, k)); j = np.unravel_index(np.argmin(sm), sm.shape)
        if win.mean() - sm[j] < 25: continue   # no dark disc there
        src.append(c); dst.append([x0 + j[1], y0 + j[0]])
    if len(src) >= 6:
        H, inl = cv2.findHomography(np.array(src), np.array(dst, float), cv2.RANSAC, 6.0)
        f = lambda X, H=H: cv2.perspectiveTransform(X.reshape(-1, 1, 2).astype(np.float64), H).reshape(-1, 2)
print(f'{len(holes)} model holes on the face (y {face["y"]:.2f})' + (f'; refined on {len(src)}' if refine else '') + '; seeds back through the map (px): ' + ', '.join(f'{np.hypot(*(f(np.array([m]))[0] - p)):.1f}' for m, p in zip(M, P)))
# the plan raster: 20 px/mm over the part's box, the frame warped onto it
K = 20.0; lo = outer.min(0) - 3; hi = outer.max(0) + 3; Wd, Ht = (hi - lo) * K
plan2px = lambda X: (np.asarray(X) - lo) * K
gx, gy = np.meshgrid(np.arange(int(Wd)), np.arange(int(Ht)))
pts = np.c_[gx.ravel() / K + lo[0], gy.ravel() / K + lo[1]]
uv = f(pts).astype(np.float32).reshape(int(Ht), int(Wd), 2)
warp = cv2.remap(img, uv[..., 0], uv[..., 1], cv2.INTER_LINEAR, borderValue=(40, 40, 40))
out = warp.copy()
cv2.polylines(out, [plan2px(outer).astype(np.int32)], True, (0, 255, 255), 1, cv2.LINE_AA)
for i, (c, r, rnd) in enumerate(holes):
    q = plan2px(c); cv2.circle(out, (int(q[0]), int(q[1])), int(r * K), (0, 230, 0) if rnd else (0, 160, 255), 1, cv2.LINE_AA)
    cv2.putText(out, f'm{i + 1}', (int(q[0] + r * K + 2), int(q[1] - 2)), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 230, 0), 1)
# dark round blobs inside the outline that no model hole explains
mask = np.zeros(warp.shape[:2], np.uint8); cv2.fillPoly(mask, [plan2px(outer).astype(np.int32)], 255)
for c, r, rnd in holes: cv2.circle(mask, tuple(plan2px(c).astype(int)), int((r + tol) * K), 0, -1)
gw = cv2.cvtColor(warp, cv2.COLOR_BGR2GRAY); bg = cv2.medianBlur(gw, 51); dark = ((bg.astype(int) - gw) > 35).astype(np.uint8) & (mask > 0)
dark = cv2.morphologyEx(dark, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n, lab, st, cen = cv2.connectedComponentsWithStats(dark); cands = []
for i in range(1, n):
    x, y, w, h, A = st[i]
    if A < 0.15 * 0.15 * math.pi * K * K or w > 4 * K * 2 or h > 4 * K * 2: continue
    if max(w, h) > 1.8 * min(w, h) or A < 0.55 * w * h * math.pi / 4: continue   # round, filled
    c = cen[i] / K + lo; r = math.sqrt(A / math.pi) / K; cands.append((c, r))
    if nocand: continue
    cv2.circle(out, tuple(cen[i].astype(int)), int(r * K) + 4, (0, 0, 255), 2, cv2.LINE_AA)
    cv2.putText(out, f'c{len(cands)}', (int(cen[i][0] + r * K + 5), int(cen[i][1] + 12)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
cv2.imwrite(f'r_hm_{name}.png', out)
T = 600; k = 0
for ty in range(0, out.shape[0], T):
    for tx in range(0, out.shape[1], T):
        tile = out[ty:ty + T, tx:tx + T]
        if (mask[ty:ty + T, tx:tx + T] > 0).mean() < 0.05 and not ((tile != 40).mean() > 0.3): continue
        k += 1; cv2.imwrite(f'r_hm_{name}_t{k:02d}.png', cv2.resize(tile, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC))
for i, (c, r) in enumerate(cands): print(f'c{i + 1}: ({c[0]:.2f}, {c[1]:.2f}) r {r:.2f}')
print(f'wrote r_hm_{name}.png and {k} tiles')
