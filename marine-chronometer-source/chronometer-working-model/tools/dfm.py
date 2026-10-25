"""Can each part be made as drawn? A design-for-manufacture survey of the model's machined parts, read off its solids (the page's own meshes, ?qa).

    python dfm.py --model wempe                 # every machined piece (about 3-6 minutes)
    python dfm.py --model wempe --mill 0.2      # the smallest end mill's radius, mm (default 0.2: a 0.4 mm cutter, a toolmaker's usual smallest)
    python dfm.py --model wempe --only topPlate,fusee     # those parts' pieces
    python dfm.py --model wempe --json OUT      # the pieces and the findings as JSON (the Wempe report's section 19)
    python dfm.py                               # the Hamilton's

Exit code 1 only on a clear impossibility: a void sealed inside one piece (no tool reaches it; it has to be made of two). Everything else is reported against
stated limits, for a maker to plan the work by:

- the thinnest wall in plan (each level's section: the ridge of its distance map, each wall's tenth percentile along its length, so a tapering end doesn't
  set it), under WALL (0.15 mm) flagged fragile in brass; teeth (an outline that rises and falls round a centre twelve or more times) left to the gear cutter;
- slots narrower than the mill (a void's ridge under 2 × the mill's radius: a smaller mill, a slitting saw or EDM), and the inside corners the mill leaves
  rounded (the void the mill's disc can't reach: drawn sharp, cut they keep a fillet up to its radius, which a mating outside corner must clear);
- round holes (enclosed voids within 15 % of a circle's area): diameter, depth, through or blind, depth over diameter (over 10 needs peck drilling, over 20 a
  gun drill or EDM), and under 0.2 mm across a micro drill's;
- the thinnest floor along the arbors (each column's shortest solid run, away from the outline);
- access: what is cut from each face (a column whose solid starts above the piece's lowest face, or ends below its highest), and undercuts (a column with
  material both above and below a gap: only a side cutter, a lathe's grooving tool or a second piece reaches it); a piece whose every level is round about
  one centre (its section turned by 23, 61 and 137 degrees within 3 %) is a turned piece, its grooves the lathe's;
- the setups that follows: one per face cut, one more for side work on a milled piece.

Method: each piece's triangles (in the movement frame) cast into columns h square in plan (h from the piece's size, 0.01-0.06 mm), each column's
crossings sorted; a level is sampled between every two heights at which the piece has a flat face (the sections are constant between them for an extruded
part) and at even steps where it slopes (up to 32 levels); the masks analysed with scipy.ndimage (distance transforms, openings, labels), the void's 3-D
connectivity over the stack of levels. Bought, stamped, rolled or wound pieces are left out (the model's checks.py DFM_SKIP: jewels, springs, the chain, the
dial's enamel, the hands; screws, by userData.sc)."""
import asyncio, base64, json, math, re, sys, time
import numpy as np
from scipy import ndimage as nd
import browser, model
PAGE = model.PAGE
CFG = model.cfg('DFM', {}) or {}
SKIP = CFG.get('skip', ['mainspring', 'hairspring', 'chain', 'dial', 'hands', 'balanceJewels', 'jewel', 'Jewel', 'endstone', 'Endstone', 'box', 'case', 'lid', 'glass'])
WALL, DRILL, DEEP, VDEEP = 0.15, 0.2, 10, 20
MILL = float(sys.argv[sys.argv.index('--mill') + 1]) if '--mill' in sys.argv else 0.2
NOTES = CFG.get('notes', {})   # a piece's catalogue number: how a finding on it is cut (a fusee engine's groove, a cutter's teeth)
ONLY = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None

JS = """(skip)=>{const mv=window.__mv,inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),P=mv.userData.parts,out=[],seen=new Map(),v=new THREE.Vector3();mv.updateMatrixWorld(true);
 const shown=o=>{for(let q=o;q&&q!==mv;q=q.parent)if(!q.visible)return false;return true;},isSc=o=>{for(let q=o;q&&q!==mv;q=q.parent)if(q.userData.sc||q.userData.screw)return true;return false;};
 for(const n in P){if(!P[n].visible||skip.some(s=>n.includes(s)))continue;
  P[n].traverse(o=>{if(!o.isMesh||o.userData.decal||o.userData.surface||o.userData.devPlate||!shown(o)||isSc(o))return;const g=o.geometry;if(!g.attributes||!g.attributes.position)return;
   const M=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld);if(o.isInstancedMesh){const im=new THREE.Matrix4();o.getMatrixAt(0,im);M.multiply(im);}
   const key=g.uuid,hn=o.userData.hn||(o.parent&&o.parent.userData.hn)||'';if(seen.has(key)){seen.get(key).n+=o.isInstancedMesh?o.count:1;return;}
   const p=g.attributes.position,idx=g.index,nt=idx?idx.count/3:p.count/3,T=new Float32Array(nt*9);
   for(let t=0;t<nt;t++)for(let c=0;c<3;c++){const i=idx?idx.array[3*t+c]:3*t+c;v.fromBufferAttribute(p,i).applyMatrix4(M);T[9*t+3*c]=v.x;T[9*t+3*c+1]=v.y;T[9*t+3*c+2]=v.z;}
   const u8=new Uint8Array(T.buffer);let s='';for(let i=0;i<u8.length;i+=32768)s+=String.fromCharCode.apply(null,u8.subarray(i,i+32768));
   const r={part:n,hn,name:o.name||'',gear:o.userData.gear||null,n:o.isInstancedMesh?o.count:1,tri:btoa(s)};seen.set(key,r);out.push(r);});}
 return out;}"""

async def fetch():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=browser.ARGS)
        w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(2000); await w.close()
        pg = await b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_function("!document.querySelector('#loading')", timeout=180000); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]')?.click()")
        r = await pg.evaluate(JS, SKIP); await b.close()
    return r, errs

def close_r(m, r):
    """m closed by a disc of radius r px (two distance transforms)"""
    d = nd.distance_transform_edt(~m) <= r; return nd.distance_transform_edt(np.pad(d, 1))[1:-1, 1:-1] > r

def open_r(m, r):
    """m opened by a disc of radius r px"""
    e = nd.distance_transform_edt(np.pad(m, 1))[1:-1, 1:-1] > r; return nd.distance_transform_edt(~e) <= r if e.any() else e

def disk(rp):
    rp = max(1, int(round(rp))); y, x = np.ogrid[-rp:rp + 1, -rp:rp + 1]; return x * x + y * y <= rp * rp

def columns(T, h):
    """the columns' crossings: grid origin, sizes, and for each column (flattened) its sorted crossing heights"""
    x0, z0 = T[:, :, 0].min() - 2 * h, T[:, :, 2].min() - 2 * h; nx = int(math.ceil((T[:, :, 0].max() + 2 * h - x0) / h)); nz = int(math.ceil((T[:, :, 2].max() + 2 * h - z0) / h))
    cx = x0 + (np.arange(nx) + 0.5) * h + 1.37e-5 * h; cz = z0 + (np.arange(nz) + 0.5) * h + 0.71e-5 * h
    ci, cy = [], []
    for t in T:
        (ax, ay, az), (bx, by, bz), (qx, qy, qz) = t; den = (bz - qz) * (ax - qx) + (qx - bx) * (az - qz)
        if abs(den) < 1e-14: continue
        i0, i1 = np.searchsorted(cx, min(ax, bx, qx)), np.searchsorted(cx, max(ax, bx, qx)); k0, k1 = np.searchsorted(cz, min(az, bz, qz)), np.searchsorted(cz, max(az, bz, qz))
        if i0 >= i1 or k0 >= k1: continue
        X, Z = np.meshgrid(cx[i0:i1], cz[k0:k1], indexing='ij'); l1 = ((bz - qz) * (X - qx) + (qx - bx) * (Z - qz)) / den; l2 = ((qz - az) * (X - qx) + (ax - qx) * (Z - qz)) / den; l3 = 1 - l1 - l2
        m = (l1 >= -1e-12) & (l2 >= -1e-12) & (l3 >= -1e-12)
        if m.any(): I, K = np.nonzero(m); ci.append((I + i0) * nz + K + k0); cy.append((l1 * ay + l2 * by + l3 * qy)[m])
    if not ci: return None
    ci, cy = np.concatenate(ci), np.concatenate(cy); o = np.lexsort((cy, ci)); return dict(x0=x0, z0=z0, nx=nx, nz=nz, h=h, ci=ci[o], cy=cy[o])

def levels(T, Cl):
    """the heights to sample: between every two flat faces' heights, and evenly where the piece slopes"""
    nrm = np.cross(T[:, 1] - T[:, 0], T[:, 2] - T[:, 0]); a = np.linalg.norm(nrm, axis=1); ok = a > 1e-12; ny = np.abs(nrm[ok, 1]) / a[ok]
    y0, y1 = T[:, :, 1].min(), T[:, :, 1].max(); flat = np.unique(np.round(T[ok][ny > 0.999][:, 0, 1] / 0.002) * 0.002)
    ys = np.unique(np.r_[y0, y1, flat[(flat > y0) & (flat < y1)]]); sloped = ((ny > 0.02) & (ny < 0.999)).sum() > 0.05 * ok.sum()
    if sloped or len(ys) < 3: ys = np.unique(np.r_[ys, np.linspace(y0, y1, 13)])
    ys = ys[np.r_[True, np.diff(ys) > 0.004]]
    if len(ys) > 33: ys = np.unique(np.r_[y0, y1, ys[np.linspace(1, len(ys) - 2, 31).astype(int)]])
    return ys

def masks(C, ys):
    """the section at the middle of each pair of heights: inside where the crossings below it are odd"""
    nx, nz = C['nx'], C['nz']; mids = (ys[:-1] + ys[1:]) / 2; M = np.zeros((len(mids), nx, nz), bool)
    starts = np.r_[0, np.nonzero(np.diff(C['ci']))[0] + 1, len(C['ci'])]; bad = 0
    for a, b in zip(starts[:-1], starts[1:]):
        yy = C['cy'][a:b]
        if len(yy) % 2: bad += 1; yy = yy[:-1]
        ix, iz = divmod(C['ci'][a], nz); M[:, ix, iz] = np.searchsorted(yy, mids) % 2 == 1
    return mids, M, starts, bad

def teeth(mask, h):
    """an outline that rises and falls round its centre 12 or more times (a wheel's, pinion's or ratchet's teeth): the root's radius and centre, else None"""
    if mask.sum() < 50: return None
    I, K = np.nonzero(mask); c = np.array([I.mean(), K.mean()]); edge = mask & ~nd.binary_erosion(mask); E = np.argwhere(edge) - c
    th = np.arctan2(E[:, 1], E[:, 0]); r = np.hypot(E[:, 0], E[:, 1]); nb = 720; b = ((th + math.pi) / (2 * math.pi) * nb).astype(int) % nb
    R = np.zeros(nb); np.maximum.at(R, b, r)
    if (R == 0).sum() > nb * 0.1: return None
    R = np.where(R == 0, np.interp(np.arange(nb), np.nonzero(R)[0], R[R > 0]), R); d = R - R.mean()
    cross = ((d[:-1] < -0.25 * d.std()) & (d[1:] >= -0.25 * d.std())).sum()
    if cross < 12 or (R.max() - R.min()) * h < 0.15 or R.min() < 0.5 * R.max(): return None
    lo = np.percentile(R, 5); return dict(c=c, rroot=lo, rtip=R.max(), n=int(cross))

def ridge_widths(F, h, minlen):
    """the walls of a region F (bool): its distance map's ridge, each long ridge piece's width at its tenth percentile and where"""
    if F.sum() < 4: return []
    dt = nd.distance_transform_edt(np.pad(F, 1))[1:-1, 1:-1]; rid = F & (dt >= nd.maximum_filter(dt, size=3) - 1e-9) & (dt > 0.6)
    lab, n = nd.label(rid, structure=np.ones((3, 3))); out = []
    if not n: return out
    for i, sl in enumerate(nd.find_objects(lab), 1):
        m = lab[sl] == i; L = m.sum()
        if L < minlen: continue
        w = 2 * dt[sl][m] * h; k = np.argsort(w)[max(0, int(0.1 * L) - 1)]; pt = np.argwhere(m)[k] + [sl[0].start, sl[1].start]
        out.append((float(w[k]), pt, int(L)))
    return out

def analyse(T, name):
    span = max(np.ptp(T[:, :, 0]), np.ptp(T[:, :, 2])); h = float(np.clip(span / 900, 0.01, 0.06))
    C = columns(T, h)
    if C is None: return None
    ys = levels(T, C); mids, M, starts, bad = masks(C, ys); dyl = np.diff(ys); x0, z0 = C['x0'], C['z0']
    xz = lambda p: [round(float(x0 + (p[0] + 0.5) * h), 2), round(float(z0 + (p[1] + 0.5) * h), 2)]
    R = dict(h=round(h, 3), levels=len(mids), y=[round(float(ys[0]), 2), round(float(ys[-1]), 2)], badcols=int(bad))
    # turned: the three largest levels round about one centre (each downsampled to 240 px), or their filled outlines (a turned blank, then milled, drilled or toothed)
    def roundness(m):
        f = max(1, int(math.ceil(max(m.shape) / 240))); m = m[::f, ::f] if f > 1 else m
        I, K = np.nonzero(m); c = np.array([I.mean(), K.mean()]); best = 1
        for ang in (23, 61, 137):
            rm = nd.rotate(m.astype(float), ang, reshape=False, order=1) > 0.5
            if rm.any(): rm = nd.shift(rm.astype(float), c - np.array(nd.center_of_mass(rm)), order=0) > 0.5
            best = min(best, (m & rm).sum() / max(1, (m | rm).sum()))
        return best
    big = [i for i in np.argsort([-m.sum() for m in M])[:3] if M[i].sum() >= 30]
    R['round'] = round(min(roundness(M[i]) for i in big), 3) if big else 0
    R['roundFilled'] = round(min(roundness(nd.binary_fill_holes(M[i])) for i in big), 3) if big else 0
    R['turned'] = R['round'] > 0.97; R['turnedcut'] = not R['turned'] and R['roundFilled'] > 0.9
    # teeth (to the gear cutter)
    tz = None
    for m in M:
        t = teeth(m, h)
        if t and (tz is None or t['n'] > tz['n']): tz = t
    if tz: R['teeth'] = dict(n=tz['n'], root=round(tz['rroot'] * h, 2), tip=round(tz['rtip'] * h, 2))
    keep = np.ones(M.shape[1:], bool)
    if tz: I, K = np.ogrid[:M.shape[1], :M.shape[2]]; keep = np.hypot(I - tz['c'][0], K - tz['c'][1]) < tz['rroot'] - max(1, 0.3 / h)   # 0.3 mm clear of the roots: an undercut tooth's root is the cutter's
    # walls, slots, corners, holes, level by level
    walls, slots, corners, holes = [], [], 0, []
    rm = MILL / h; minlen = max(4, 0.4 / h)
    for li, m in enumerate(M):
        if m.sum() < 10: continue
        for w, p, L in ridge_widths(m & keep, h, minlen):
            if keep[tuple(p)]: walls.append((w, xz(p), round(float(mids[li]), 2)))
        filled = nd.binary_fill_holes(m); pd = int(max(rm, 0.5 / h)) + 3; near = close_r(np.pad(m, pd), max(rm, 0.5 / h))[pd:-pd, pd:-pd]
        void = (filled | near) & ~m & keep
        lab, n = nd.label(void)
        for i, sl in enumerate(nd.find_objects(lab), 1):
            v = lab[sl] == i; A = v.sum()
            if A < 3: continue
            I, K = np.nonzero(v); I = I + sl[0].start; K = K + sl[1].start; enclosed = bool(filled[I, K].all())
            circ = A / (math.pi * ((max(np.ptp(I), np.ptp(K)) + 1) / 2) ** 2)
            if enclosed and 0.85 < circ < 1.15 and abs(np.ptp(I) - np.ptp(K)) <= 2:
                holes.append(dict(c=[x0 + (I.mean() + 0.5) * h, z0 + (K.mean() + 0.5) * h], d=float((2 * math.sqrt(A / math.pi)) * h), li=li)); continue
            for w, p, L in ridge_widths(v, h, minlen):
                if w < 2 * MILL: slots.append((round(w, 3), xz(np.array(p) + [sl[0].start, sl[1].start]), round(float(mids[li]), 2)))
            op = open_r(v, rm)
            rest = v & ~op; lr, nr = nd.label(rest); corners += sum(1 for s in nd.find_objects(lr) if s and (lr[s] > 0).sum() * h * h > (0.15 * MILL) ** 2)
    if walls: w = min(walls); R['wall'] = dict(min=round(w[0], 3), at=w[1], y=w[2], thin=sorted({(round(a, 2), tuple(b)) for a, b, c in walls if a < WALL})[:6])
    if slots: s = min(slots); R['slots'] = dict(n=len({tuple(x[1]) for x in slots}), min=s[0], at=s[1], y=s[2])
    R['corners'] = corners
    # holes: the same centre over consecutive levels
    H = []
    for q in sorted(holes, key=lambda q: q['li']):
        for g in H:
            if math.hypot(g['c'][0] - q['c'][0], g['c'][1] - q['c'][1]) < 2 * h + 0.02 and q['li'] == g['l1'] + 1 and abs(g['d'] - q['d']) < 3 * h: g['l1'] = q['li']; g['ds'].append(q['d']); break
        else: H.append(dict(c=q['c'], d=q['d'], ds=[q['d']], l0=q['li'], l1=q['li']))
    hl = []
    for g in H:
        depth = float(ys[g['l1'] + 1] - ys[g['l0']]); d = float(np.median(g['ds'])); thr = g['l0'] == 0 and g['l1'] == len(mids) - 1
        hl.append(dict(c=[round(g['c'][0], 2), round(g['c'][1], 2)], d=round(d, 3), depth=round(depth, 2), through=bool(thr), ratio=round(depth / d, 1)))
    R['holes'] = hl
    # columns: floors along y, faces cut, undercuts
    nz = C['nz']; Y0, Y1 = ys[0], ys[-1]; inner = nd.binary_erosion(M.any(0), iterations=2); fl, top, bot, und = [], 0, 0, []
    for a, b in zip(starts[:-1], starts[1:]):
        yy = C['cy'][a:b]
        if len(yy) < 2 or len(yy) % 2: continue
        ix, iz = divmod(C['ci'][a], nz); seg = yy.reshape(-1, 2); seg = seg[seg[:, 1] - seg[:, 0] > 0.005]   # a ray through an edge pairs two crossings at one height
        if not len(seg): continue
        if inner[ix, iz]: fl.append((float((seg[:, 1] - seg[:, 0]).min()), ix, iz))
        if seg[0, 0] > Y0 + 0.02: bot += 1
        if seg[-1, 1] < Y1 - 0.02: top += 1
        if len(seg) > 1:
            gap = (seg[1:, 0] - seg[:-1, 1]).max()
            if gap > 0.02: und.append((gap, ix, iz))
    if fl: f = min(fl); R['floor'] = dict(min=round(f[0], 3), at=xz((f[1], f[2])))
    cell = h * h; R['faces'] = dict(low=round(bot * cell, 2), high=round(top * cell, 2))
    R['undercut'] = dict(area=round(len(und) * cell, 2), gap=round(max(u[0] for u in und), 2), at=xz(max(und)[1:])) if len(und) * cell > 0.05 else None
    if R['undercut']:   # a groove round the piece's centre (the lathe's), or not (a side cutter's)
        A = M.any(0); I, K = np.nonzero(A); c = (I.mean(), K.mean()); U = np.array([(u[1], u[2]) for u in und]); th = np.arctan2(U[:, 1] - c[1], U[:, 0] - c[0])
        R['undercut']['ring'] = bool(len(np.unique(((th + math.pi) / (2 * math.pi) * 36).astype(int) % 36)) >= 33)
    R['setups'] = (1 if bot * cell > 0.05 else 0) + (1 if top * cell > 0.05 else 0) + (1 if R['undercut'] and not R['undercut']['ring'] else 0) or 1
    # sealed voids: the void's 3-D connectivity over the stack of levels, the grid's border padded open
    V = np.pad(~M, 1, constant_values=True); lab, n = nd.label(V); outside = set(np.unique(np.r_[lab[0].ravel(), lab[-1].ravel(), lab[:, 0].ravel(), lab[:, -1].ravel(), lab[:, :, 0].ravel(), lab[:, :, -1].ravel()]))
    sealed = []
    for i, sl in enumerate(nd.find_objects(lab), 1):
        if i in outside or sl is None: continue
        vol = (lab[sl] == i).sum() * cell * float(np.mean(dyl))
        if vol > 0.002: c = np.argwhere(lab[sl] == i).mean(0) + [s.start for s in sl]; sealed.append(dict(vol=round(vol, 4), at=xz(c[1:] - 1), y=round(float(mids[min(len(mids) - 1, max(0, int(c[0]) - 1))]), 2)))
    R['sealed'] = sealed
    return R

def main():
    sys.stdout.reconfigure(encoding='utf-8'); t0 = time.time()
    data, errs = asyncio.run(fetch())
    if errs: print('page errors:', errs)
    rows = []; fail = 0
    for r in data:
        if ONLY and r['part'] not in ONLY: continue
        T = np.frombuffer(base64.b64decode(r['tri']), np.float32).astype(float).reshape(-1, 3, 3)
        if len(T) < 4 or max(np.ptp(T[:, :, 0]), np.ptp(T[:, :, 1]), np.ptp(T[:, :, 2])) < 0.3: continue
        nm = r['part'] + (' ' + r['hn'] if r['hn'] else '') + (' (' + r['name'] + ')' if r['name'] else '')
        t1 = time.time()
        try: R = analyse(T, nm)
        except MemoryError: R = None
        if not R: continue
        R.update(name=nm, part=r['part'], hn=r['hn'], count=r['n'], tris=len(T), s=round(time.time() - t1, 1), note=NOTES.get(r['hn'], ''))
        key = json.dumps({k: v for k, v in R.items() if k not in ('s', 'count', 'tris')}, sort_keys=True, default=str); same = next((q for q in rows if q['_k'] == key), None)
        if same: same['count'] += R['count']; continue   # the same piece again (a sub-mesh repeated, a pin in several places)
        R['_k'] = key; rows.append(R)
        if R['sealed']: fail = 1
    def line(R):
        s = f"{R['name'][:58]:58s} {'turned' if R['turned'] else 'turned, then cut' if R['turnedcut'] else 'milled'}{' + teeth ' + str(R['teeth']['n']) if R.get('teeth') else ''}; setups {R['setups']}"
        if R.get('wall'): s += f"; wall {R['wall']['min']:.3f}"
        if R.get('floor'): s += f"; floor {R['floor']['min']:.3f}"
        if R.get('slots'): s += f"; {R['slots']['n']} slot(s) under the mill, {R['slots']['min']:.3f} wide"
        if R['holes']: s += f"; holes {len(R['holes'])} (Ø {min(x['d'] for x in R['holes']):.2f}-{max(x['d'] for x in R['holes']):.2f}, deepest {max(x['ratio'] for x in R['holes'])}×Ø)"
        if R['undercut']: s += f"; undercut {R['undercut']['area']} mm² ({'lathe' if R['undercut']['ring'] else 'side cutter'})"
        return s
    print(f"{len(rows)} machined pieces (screws, jewels, springs, chain, dial and hands left out); the mill's radius {MILL} mm, walls under {WALL} flagged, drills under Ø {DRILL}, holes over {DEEP} and {VDEEP} diameters deep")
    for R in rows: print(('!! ' if R['sealed'] else '   ') + line(R))
    for R in rows: R.pop('_k', None)
    thin = [R for R in rows if R.get('wall') and R['wall']['min'] < WALL]; nar = [R for R in rows if R.get('slots')]
    deep = [(R['name'], x) for R in rows for x in R['holes'] if x['ratio'] > DEEP]; small = [(R['name'], x) for R in rows for x in R['holes'] if x['d'] < DRILL]
    print(f"\nwalls under {WALL}: {len(thin)} pieces" + ''.join(f"\n   {R['name'][:60]}: {R['wall']['min']:.3f} at {R['wall']['at']} (y {R['wall']['y']})" for R in thin))
    print(f"slots narrower than the mill (Ø {2 * MILL}): {len(nar)} pieces" + ''.join(f"\n   {R['name'][:60]}: {R['slots']['n']}, the narrowest {R['slots']['min']:.3f} at {R['slots']['at']}" for R in nar))
    print(f"holes deeper than {DEEP} diameters: {len(deep)}" + ''.join(f"\n   {n[:50]}: Ø {x['d']} × {x['depth']} ({x['ratio']}×) at {x['c']}" for n, x in deep[:20]))
    print(f"holes under Ø {DRILL}: {len(small)}" + ''.join(f"\n   {n[:50]}: Ø {x['d']} × {x['depth']} at {x['c']}" for n, x in small[:20]))
    und = [R for R in rows if R['undercut'] and not R['undercut']['ring']]
    print(f"milled pieces with undercuts (side work): {len(und)}" + ''.join(f"\n   {R['name'][:60]}: {R['undercut']['area']} mm², gap {R['undercut']['gap']} at {R['undercut']['at']}" for R in und))
    print(f"inside corners drawn sharp that the mill leaves rounded (r ≤ {MILL}): {sum(R['corners'] for R in rows)} in {sum(1 for R in rows if R['corners'])} pieces")
    sl = [(R['name'], s) for R in rows for s in R['sealed']]
    print(f"voids sealed inside one piece (can't be cut: two pieces): {len(sl)}" + ''.join(f"\n!! {n}: {s['vol']} mm³ at {s['at']} y {s['y']}" for n, s in sl))
    print(f"{time.time() - t0:.0f} s")
    if '--json' in sys.argv:
        out = sys.argv[sys.argv.index('--json') + 1]
        for R in rows: R.pop('badcols', None)
        json.dump(dict(mill=MILL, wall=WALL, drill=DRILL, deep=[DEEP, VDEEP], pieces=rows), open(out, 'w', encoding='utf-8', newline='\n'), indent=0, default=lambda o: o.tolist() if hasattr(o, 'tolist') else str(o)); print('wrote', out)
    sys.exit(1 if fail or errs else 0)

if __name__ == '__main__': main()
