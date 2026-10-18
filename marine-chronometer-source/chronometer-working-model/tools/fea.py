"""Do the plates and bridges hold the arbors where they belong? Finite elements (linear elasticity) on the parts that carry the pivots,
loaded as the movement is fully wound and as it runs down, and what their bending does to the train's depths (gearing.json's
windows, gearing.js) and to the arbors' upright. Opens ../index.html?snap&qa once, for the geometry.

  python fea.py              # the parts at two resolutions (the coarse a check on the fine), both load cases: about 3 minutes
  python fea.py --check      # the solver against a cantilever's textbook deflection, at three resolutions (about 20 s)
  python fea.py --reuse      # the geometry from the last run's r_fea_geom.json, without the browser
  python fea.py --json OUT   # and the results as JSON (the report in verification/build-verification reads it)

Exit code 1 if a mesh's depth moves by more than a tenth of the room its window leaves past the holes' tolerance, or a part is
stressed past brass's yield, or --check misses the textbook by more than 6 %.

Method. Each part's solid (its largest mesh, as holes.py takes it: closed and consistently wound, solids.py) is cut into bricks:
columns h square in plan, a ray up each column finding where it is inside, the part's height in layers about 0.7 h deep. Brass
(leaded clock brass, CuZn39Pb3: E 97-110 GPa, Poisson's ratio 0.34; the deflections are given at 100 GPa and scale as 1/E).
Trilinear bricks (2 x 2 x 2 Gauss points), assembled in numpy, solved by smoothed-aggregation multigrid (pyamg) as a preconditioner
for conjugate gradients, the six rigid-body modes given. A bridge is held where it is screwed down: the nodes within its screw's
head radius, through its height (the head clamps it to the pillar or part beneath); the pillar plate at its rim, where the case's
seat ring takes it. A pivot's load goes on its hole's wall, over the half it bears on, as cos θ. A hole's displacement is the mean
of its wall's nodes'.

The parts put together by superposition: each fixing's reaction goes onto what is beneath it (another part, or a pillar, a brass
rod 6.7 mm across fixed at both ends, bending as a beam, its foot's force on the plate); a part's fixings move as what is beneath
them does, and the part follows them as a rigid body (fitted in plan), plus its own bending.

Loads (strength.js's, every stage lossless: the largest): the chain's pull, the spring's moment on the barrel's pitch radius
(physics.js: fully wound, and run down), along the chain's line, the two drums' external tangent, on the fusee and the barrel at
the chain's height (fully wound on the fusee's top turn, run down on its bottom: makeFusee's yS, yB); and at each mesh the tooth
force, tangential from the torque, radial from gearing.json's mean pressure angle, on the wheel and the pinion at the wheel's plane.
Each split between its arbor's two pivots by the lever rule.

What it leaves out: the arbors' own bending (steel, 2 to 4 times as stiff as brass and short between shoulders), the jewels'
settings (pressed in, taken as the brass round them), friction at the fixings (taken as bonded) and the case.
"""
import asyncio, json, math, os, subprocess, sys, time
import browser
import numpy as np, scipy.sparse as sp, pyamg

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = 'file:///' + os.path.abspath(os.path.join(HERE, '..', 'index.html')).replace('\\', '/') + '?snap&qa'
PARTS = ['pillar', 'trainBridge', 'barrelBridge', 'escBridge', 'lowerBridge', 'ltb']
E_B, E_RANGE, NU = 100e3, (97e3, 110e3), 0.34          # brass, N/mm² (MPa)
YIELD = (300, 450)                                      # half-hard to hard leaded brass, MPa
PILLAR_D = 6.7                                          # the pillars' diameter (the pillars' group, probed: x -14.7..-8)
O = np.array([(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)])   # a brick's corners (x, y, z index offsets)

# ---------------------------------------------------------------- the geometry, from the page
JS = """(names)=>{const inv=new THREE.Matrix4().copy(__mv.matrixWorld).invert(),out={parts:{},screws:[],L:{}};for(const k in L)out.L[k]=L[k];
for(const n of names){const g0=__mv.userData.parts[n];let m=null;g0.traverse(o=>{if(o.isMesh&&o.geometry.attributes.position&&(!m||o.geometry.attributes.position.count>m.geometry.attributes.position.count))m=o;});
 m.updateWorldMatrix(true,false);const T=new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld),g=m.geometry.index?m.geometry.toNonIndexed():m.geometry,p=g.attributes.position,V=[];
 for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(T);V.push(+v.x.toFixed(5),+v.y.toFixed(5),+v.z.toFixed(5));}out.parts[n]=V;}
__mv.traverse(o=>{if(!o.userData.sc)return;o.updateWorldMatrix(true,false);const M=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld),p=new THREE.Vector3().applyMatrix4(M),ax=new THREE.Vector3(0,1,0).transformDirection(M);
 let q=o.parent,pn=null;while(q&&!pn){pn=q.userData.partName||null;q=q.parent;}out.screws.push({p:p.toArray(),ax:ax.toArray(),r:o.userData.sc.r,part:pn});});return out;}"""

async def fetch():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=browser.ARGS)
        w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(3000); await w.close()   # see smoke.py
        pg = await b.new_page(); await pg.goto(PAGE); await pg.wait_for_function("!document.querySelector('#loading')", timeout=120000); await pg.wait_for_timeout(1500)
        r = await pg.evaluate(JS, PARTS); await b.close(); return r

# ---------------------------------------------------------------- voxels
def voxelize(T, h, ratio=0.7):
    """T (n, 3, 3) triangles; columns h square in plan, layers about ratio h deep. Returns the grid and the solid bricks [ix, iy, iz]."""
    x0, z0 = T[:, :, 0].min() - h, T[:, :, 2].min() - h; nx = int(math.ceil((T[:, :, 0].max() + h - x0) / h)); nz = int(math.ceil((T[:, :, 2].max() + h - z0) / h))
    y0, y1 = T[:, :, 1].min(), T[:, :, 1].max(); ny = max(4, int(round((y1 - y0) / (ratio * h)))); dy = (y1 - y0) / ny
    cx = x0 + (np.arange(nx) + 0.5) * h + 1.37e-5; cz = z0 + (np.arange(nz) + 0.5) * h + 0.71e-5   # off the grid, so no ray runs along an edge
    ci, cy = [], []
    for t in T:
        (ax, ay, az), (bx, by, bz), (qx, qy, qz) = t; den = (bz - qz) * (ax - qx) + (qx - bx) * (az - qz)
        if abs(den) < 1e-12: continue   # a wall, edge on to the rays
        i0, i1 = np.searchsorted(cx, min(ax, bx, qx)), np.searchsorted(cx, max(ax, bx, qx)); k0, k1 = np.searchsorted(cz, min(az, bz, qz)), np.searchsorted(cz, max(az, bz, qz))
        if i0 >= i1 or k0 >= k1: continue
        X, Z = np.meshgrid(cx[i0:i1], cz[k0:k1], indexing='ij'); l1 = ((bz - qz) * (X - qx) + (qx - bx) * (Z - qz)) / den; l2 = ((qz - az) * (X - qx) + (ax - qx) * (Z - qz)) / den; l3 = 1 - l1 - l2
        m = (l1 >= 0) & (l2 >= 0) & (l3 >= 0)
        if m.any():
            I, K = np.nonzero(m); ci.append((I + i0) * nz + K + k0); cy.append((l1 * ay + l2 * by + l3 * qy)[m])
    ci, cy = np.concatenate(ci), np.concatenate(cy); o = np.lexsort((cy, ci)); ci, cy = ci[o], cy[o]
    yc = y0 + (np.arange(ny) + 0.5) * dy; solid = np.zeros((nx, ny, nz), bool); bad = 0
    starts = np.r_[0, np.nonzero(np.diff(ci))[0] + 1, len(ci)]
    for a, b in zip(starts[:-1], starts[1:]):
        ys = cy[a:b]
        if len(ys) % 2: bad += 1; ys = ys[:-1]   # a ray through a vertex counted twice: drop the column's last crossing
        ix, iz = divmod(ci[a], nz); solid[ix, :, iz] = np.searchsorted(ys, yc) % 2 == 1
    return dict(x0=x0, z0=z0, y0=y0, h=h, dy=dy, nx=nx, ny=ny, nz=nz, solid=solid, bad=bad)

def mesh_of(G):
    """the solid bricks' nodes: coordinates, and each brick's 8 node numbers (O's order)"""
    e = np.argwhere(G['solid']); ny1, nz1 = G['ny'] + 1, G['nz'] + 1
    keys = ((e[:, None, 0] + O[None, :, 0]) * ny1 + (e[:, None, 1] + O[None, :, 1])) * nz1 + (e[:, None, 2] + O[None, :, 2])
    u, inv = np.unique(keys.ravel(), return_inverse=True); conn = inv.reshape(-1, 8)
    ix, r = np.divmod(u, ny1 * nz1); iy, iz = np.divmod(r, nz1)
    X = np.c_[G['x0'] + ix * G['h'], G['y0'] + iy * G['dy'], G['z0'] + iz * G['h']]
    return X, conn, e

# ---------------------------------------------------------------- the brick
def brick(a, b, c, E=1.0, nu=NU):
    """the stiffness (24 x 24) and the strain-displacement matrix at the centre (6 x 24) of a brick a x b x c (along x, y, z)"""
    lam, mu = E * nu / ((1 + nu) * (1 - 2 * nu)), E / (2 * (1 + nu)); D = np.zeros((6, 6)); D[:3, :3] = lam; D[[0, 1, 2], [0, 1, 2]] += 2 * mu; D[[3, 4, 5], [3, 4, 5]] = mu
    xi = 2 * O - 1; g = 1 / math.sqrt(3); K = np.zeros((24, 24))
    def Bm(p):
        dN = np.array([xi[:, 0] * (1 + xi[:, 1] * p[1]) * (1 + xi[:, 2] * p[2]) / 8 * 2 / a, xi[:, 1] * (1 + xi[:, 0] * p[0]) * (1 + xi[:, 2] * p[2]) / 8 * 2 / b, xi[:, 2] * (1 + xi[:, 0] * p[0]) * (1 + xi[:, 1] * p[1]) / 8 * 2 / c])
        B = np.zeros((6, 24)); B[0, 0::3] = dN[0]; B[1, 1::3] = dN[1]; B[2, 2::3] = dN[2]; B[3, 0::3] = dN[1]; B[3, 1::3] = dN[0]; B[4, 1::3] = dN[2]; B[4, 2::3] = dN[1]; B[5, 0::3] = dN[2]; B[5, 2::3] = dN[0]; return B
    for p in np.array(np.meshgrid([-g, g], [-g, g], [-g, g])).reshape(3, -1).T:
        B = Bm(p); K += B.T @ D @ B * (a * b * c / 8)
    return K, Bm(np.zeros(3)), D

def solve(X, conn, h, dy, fixed, F, E=E_B):
    """K u = F with the nodes in `fixed` held; returns u (n, 3), the reactions at the held nodes (n, 3) and each brick's von Mises stress"""
    n = len(X); ke, B0, D = brick(h, dy, h, E); dof = (conn[:, :, None] * 3 + np.arange(3)).reshape(-1, 24).astype(np.int64); K = None
    for s in range(0, len(dof), 20000):
        d = dof[s:s + 20000]; Kc = sp.coo_matrix((np.tile(ke.ravel(), len(d)), (np.repeat(d, 24, axis=1).ravel(), np.tile(d, 24).ravel())), shape=(3 * n, 3 * n)).tocsr()
        K = Kc if K is None else K + Kc
    fx = np.zeros(3 * n, bool); fx[(np.nonzero(fixed)[0][:, None] * 3 + np.arange(3)).ravel()] = True; fr = ~fx
    Kff = K[fr][:, fr].tocsr(); c = X - X.mean(0)
    RB = np.zeros((3 * n, 6)); RB[0::3, 0] = 1; RB[1::3, 1] = 1; RB[2::3, 2] = 1
    RB[1::3, 3], RB[2::3, 3] = -c[:, 2], c[:, 1]; RB[0::3, 4], RB[2::3, 4] = c[:, 2], -c[:, 0]; RB[0::3, 5], RB[1::3, 5] = -c[:, 1], c[:, 0]
    ml = pyamg.smoothed_aggregation_solver(Kff, B=RB[fr], max_coarse=500); res = []
    uf = ml.solve(F.ravel()[fr], tol=1e-10, accel='cg', maxiter=400, residuals=res)
    u = np.zeros(3 * n); u[fr] = uf; R = (K @ u - F.ravel()).reshape(-1, 3); R[~fixed] = 0
    eps = np.einsum('ij,ej->ei', B0, u[dof]); s = eps @ D.T
    vm = np.sqrt(0.5 * ((s[:, 0] - s[:, 1]) ** 2 + (s[:, 1] - s[:, 2]) ** 2 + (s[:, 2] - s[:, 0]) ** 2) + 3 * (s[:, 3:] ** 2).sum(1))
    return u.reshape(-1, 3), R, vm, res[-1] / res[0]

# ---------------------------------------------------------------- the textbook check
def box(L, w, t):
    v = np.array([[x, y, z] for x in (0, L) for y in (0, t) for z in (0, w)], float)
    q = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    return np.array([[v[a], v[b], v[c]] for a, b, c, d in q for a, b, c in ((a, b, c), (a, c, d))])

CHECK = []   # the cantilever's rows, for --json
def check():
    """a brass cantilever 20 long, 2 wide, 2 deep, held at one end, 1 N on the other: Timoshenko's deflection P L³/3EI + P L/(κ G A)"""
    L, w, t, P = 20.0, 2.0, 2.0, 1.0; I = w * t ** 3 / 12; G = E_B / (2 * (1 + NU)); exact = P * L ** 3 / (3 * E_B * I) + P * L / (5 / 6 * G * w * t); worst = 0
    for h in (0.5, 0.25, 0.1667):
        G_ = voxelize(box(L, w, t), h, ratio=1.0); X, conn, e = mesh_of(G_); fixed = X[:, 0] < 1e-6; tip = X[:, 0] > L - 1e-6
        F = np.zeros_like(X); F[tip, 1] = -P / tip.sum(); u, R, vm, rr = solve(X, conn, h, G_['dy'], fixed, F)
        d = -u[tip, 1].mean(); err = d / exact - 1; worst = err if abs(err) > abs(worst) else worst; CHECK.append(dict(h=h, bricks=len(conn), depth=round(t / G_['dy']), tip=d * 1000, exact=exact * 1000, err=err))
        print(f'  h {h:.3f} mm ({len(conn)} bricks, {t / G_["dy"]:.0f} through the depth): tip {d * 1000:.2f} µm against {exact * 1000:.2f} ({err * 100:+.1f} %); reactions {R[:, 1].sum():+.4f} N against {P:+.4f}; residual {rr:.0e}')
    return abs(worst) <= 0.06 and abs(err) <= 0.03, err

# ---------------------------------------------------------------- the loads
def node_js(expr):
    return json.loads(subprocess.run(['node', '-e', f"const P=require('./physics.js');console.log(JSON.stringify({expr}))"], cwd=HERE, capture_output=True, text=True, check=True).stdout)

def loads(Lp, GJ):
    """each arbor's forces, [(Fx, Fz) N, y mm], for the two cases"""
    P = node_js('{Mup:P.Mup,Mdn:P.Mdn,rB:P.rB,Tf:P.Tf,TRAIN:P.TRAIN,MODS:P.MODS}'); T, M = P['TRAIN'], P['MODS']
    W = {'Fu': 1, 'Ba': 1, 'C': -1, 'T': 1, 'F': -1, 'E': 1}   # turning about +y (counterclockwise from the dial) or -y: the centre clockwise, each mesh reversing, the barrel with the fusee (an open chain)
    cases = {}
    for case, Mom, rf, y in (('fully wound', P['Mup'], 7.51, -19.86), ('run down', P['Mdn'], 14.72, -10.9)):   # the fusee's lever and the chain's height (makeFusee: yS, yB)
        A = {k: [] for k in W}; Tc = Mom / (P['rB'] / 1000)
        C1, C2 = np.array(Lp['Fu'], float), np.array(Lp['Ba'], float); r1, r2 = rf, P['rB']; d = C2 - C1; D = np.hypot(*d); a0 = math.atan2(d[1], d[0]); al = math.acos((r1 - r2) / D)
        for s in (1, -1):   # the external tangent whose pull turns the fusee its running way
            n = np.array([math.cos(a0 + s * al), math.sin(a0 + s * al)]); Q1, Q2 = C1 + r1 * n, C2 + r2 * n; f = (Q2 - Q1) / np.hypot(*(Q2 - Q1)); rr = Q1 - C1
            if (rr[1] * f[0] - rr[0] * f[1]) * W['Fu'] > 0: break
        A['Fu'].append((Tc * f, y)); A['Ba'].append((-Tc * f, y))
        tq = P['Tf']
        for (a, b, za, zb, m, yw), g in zip((('Fu', 'C', T['fu'], T['cp'], M['fusee'], -6.6), ('C', 'T', T['cw'], T['tp'], M['centre'], -5.36), ('T', 'F', T['tw'], T['fp'], M['third'], -4.535), ('F', 'E', T['fw'], T['ep'], M['fourth'], -7.46)), GJ['stages']):
            pa, pb = np.array(Lp[a], float), np.array(Lp[b], float); u = (pb - pa) / np.hypot(*(pb - pa)); rA = m * za / 2; P_ = pa + rA * u
            v = P_ - pb; t = np.array([W[b] * v[1], -W[b] * v[0]]); t /= np.hypot(*t); Ft = tq / (rA / 1000); FB = Ft * t + Ft * math.tan(math.radians(g['phi'])) * u
            A[b].append((FB, yw)); A[a].append((-FB, yw)); tq = tq * zb / za
        cases[case] = (A, Tc)
    return cases

# ---------------------------------------------------------------- one part
class Part:
    def __init__(s, name, T, h):
        s.name, s.T = name, T; s.G = voxelize(T, h); s.X, s.conn, s.e = mesh_of(s.G); s.h, s.dy = h, s.G['dy']
        s.ybot, s.ytop = T[:, :, 1].min(), T[:, :, 1].max(); s.F = np.zeros_like(s.X); s.fix = {}   # fixing name -> node mask
        c = s.X[s.conn].mean(1); s.ec = c
    def solid_at(s, x, z):
        G = s.G; i, k = int((x - G['x0']) // G['h']), int((z - G['z0']) // G['h'])
        return 0 <= i < G['nx'] and 0 <= k < G['nz'] and G['solid'][i, :, k].any()
    def ring(s, x, z, R=5.0):
        """the hole about (x, z): its wall's nodes, its radius, and whether the part closes round it (a bearing, not a clearance cut); R reaches past the
        widest, the fusee's and barrel's bushings' holes, r 3.4 (3.5 until 15 October 2026, when they were r 1.4-1.95)"""
        r = np.hypot(s.ec[:, 0] - x, s.ec[:, 2] - z); near = r < R
        if not near.any(): return None
        rh = r[near].min() - s.h / 2; th = np.arctan2(s.ec[near, 2] - z, s.ec[near, 0] - x); full = len(np.unique(np.floor((th[r[near] < rh + s.h / 2 + 1.2] + math.pi) / (2 * math.pi) * 16))) >= 12   # brass round most of it within 1.2 mm (a bridge's arm may be narrower than the hole's ring)
        rn = np.hypot(s.X[:, 0] - x, s.X[:, 2] - z); inel = np.zeros(len(s.X), bool); inel[np.unique(s.conn[r < rh + s.h * 1.01])] = True
        wall = inel & (rn < rh + 0.75 * s.h)
        return dict(wall=wall, rh=rh, full=full, y=s.X[wall, 1].mean())
    def load(s, x, z, f):
        rg = s.ring(x, z); w = s.X[rg['wall']] - [x, 0, z]; cs = (w[:, 0] * f[0] + w[:, 2] * f[1]) / np.maximum(1e-9, np.hypot(w[:, 0], w[:, 2])) / np.hypot(*f)
        cs = np.maximum(cs, 0); idx = np.nonzero(rg['wall'])[0]; s.F[idx, 0] += f[0] * cs / cs.sum(); s.F[idx, 2] += f[1] * cs / cs.sum()
    def run(s):
        fixed = np.zeros(len(s.X), bool)
        for m in s.fix.values(): fixed |= m
        s.u, s.R, s.vm, s.rr = solve(s.X, s.conn, s.h, s.dy, fixed, s.F)
    def at(s, x, z):
        rg = s.ring(x, z); return s.u[rg['wall']].mean(0)

def near(p, xz, r):
    """the nodes of part p within r of (x, z) in plan, or the 20 nearest if none is"""
    d = np.hypot(p.X[:, 0] - xz[0], p.X[:, 2] - xz[1]); m = d < r
    if not m.any(): m = np.zeros(len(d), bool); m[np.argsort(d)[:20]] = True
    return m

def rigid(P, D):
    """the plan's rigid motion (tx, tz, θ) fitting displacements D (k, 2) at points P (k, 2); returns a function of a point"""
    c = P.mean(0); q = P - c; A = np.zeros((2 * len(P), 3)); A[0::2, 0] = 1; A[1::2, 1] = 1; A[0::2, 2] = -q[:, 1]; A[1::2, 2] = q[:, 0]
    sol = np.linalg.lstsq(A, D.ravel(), rcond=None)[0] if len(P) > 1 else np.r_[D[0], 0]
    return lambda p: np.array([sol[0] - sol[2] * (p[1] - c[1]), sol[1] + sol[2] * (p[0] - c[0])])

# ---------------------------------------------------------------- the movement
# each arbor's two bearings, the dial side's first (movement.js: the plate's bushings bushR/bushS 42164-42165 and the escape's setting 42162; the third's and
# fourth's jewels 42161 in the bridge on the plate's dial side, ltb; the train bridge's bushings bushO 42166-42167; the barrel bridge's bushR; the lower bridge's
# and escape bridge's holes, LBh and eb)
ARB = {'Fu': ('pillar', 'barrelBridge'), 'Ba': ('pillar', 'barrelBridge'), 'C': ('pillar', 'trainBridge'), 'T': ('ltb', 'trainBridge'), 'F': ('ltb', 'lowerBridge'), 'E': ('pillar', 'escBridge')}
PILLARS = 'the pillar plate\'s screws from the dial side (y 0, pointing -y): each pillar stands on one'

def movement(geo, scale, GJ, cases, say):
    Lp = geo['L']; out = {}
    tris = {n: np.array(v, float).reshape(-1, 3, 3) for n, v in geo['parts'].items()}
    area = {n: (np.ptp(T[:, :, 0]) * np.ptp(T[:, :, 2])) for n, T in tris.items()}
    pil = [np.array(s['p'])[[0, 2]] for s in geo['screws'] if s['part'] == 'pillar' and abs(s['p'][1]) < 0.05 and s['ax'][1] < 0 and s['r'] > 2]
    for case, (A, Tc) in cases.items():
        t0 = time.time()
        P = {n: Part(n, T, max(0.25, scale * math.sqrt(area[n]) / 160)) for n, T in tris.items()}
        # the pivots: each arbor's two holes, checked to be bearings in the parts ARB names
        piv = {}
        for a, (p1, p2) in ARB.items():
            x, z = Lp[a]; ys = []
            for pn in (p1, p2):
                rg = P[pn].ring(x, z)
                if rg is None or not rg['full']: raise SystemExit(f'{a}: no bearing round it in {pn} (ARB in fea.py)')
                ys.append(rg['y'])
            piv[a] = (ys[0], ys[1])
            for f, y in A[a]:   # the lever rule between the two pivots
                k = (y - ys[0]) / (ys[1] - ys[0]); P[p1].load(x, z, f * (1 - k)); P[p2].load(x, z, f * k)
        # the fixings: each part's screws; what is beneath each (another part touching it there, else a pillar, else the plate)
        sup = {}
        for n in P:
            if n == 'pillar':
                r = np.hypot(P[n].X[:, 0], P[n].X[:, 2]); P[n].fix['rim'] = r > r.max() - 1.0; continue
            for i, s in enumerate(x for x in geo['screws'] if x['part'] == n):
                x, z = s['p'][0], s['p'][2]; m = np.hypot(P[n].X[:, 0] - x, P[n].X[:, 2] - z) < s['r']
                if not m.any(): continue
                key = f'{n}#{i}'; P[n].fix[key] = m; under = None
                for o in P:
                    if o != n and o != 'pillar' and P[o].solid_at(x, z) and (abs(P[o].ytop - P[n].ybot) < 0.06 or abs(P[o].ybot - P[n].ytop) < 0.06): under = o
                if under is None and min(np.hypot(*(q - [x, z])) for q in pil) < 1.0: under = 'pillars'
                if under is None:   # held through a post or a step the largest mesh leaves out: the nearest part in height solid there
                    c = [(min(abs(P[o].ybot - P[n].ytop), abs(P[o].ytop - P[n].ybot)), o) for o in P if o != n and P[o].solid_at(x, z)]
                    under = min(c)[1] if c else 'pillar'
                sup[key] = (n, under or 'pillar', np.array([x, z]))
        # solve from the top down: a part's reactions go onto what is beneath it before that is solved
        # solve from the top down: a part's reactions go onto what is beneath it before that is solved (the plate last)
        above = {n: {v[0] for v in sup.values() if v[1] == n} for n in P}; order = []
        while len(order) < len(P):
            nxt = [n for n in P if n not in order and n != 'pillar' and above[n] <= set(order)] or ['pillar']
            order += nxt[:1]
        for n in order:
            P[n].run()
            for key, v in list(sup.items()):
                pn, under, xz = v[:3]
                if pn != n: continue
                Rk = -P[n].R[P[n].fix[key]].sum(0)   # what the part puts on its fixing
                tgt = under if under in P else 'pillar'; m = near(P[tgt], xz, 1.5 if under in P else PILLAR_D / 2); P[tgt].F[m] += Rk / m.sum()
                sup[key] = (pn, under, xz, Rk)
        # the parts put together: the plate as solved; each part on its fixings, the plate's moved plus the pillar's bending, or the part's beneath
        I = math.pi * PILLAR_D ** 4 / 64; move = {'pillar': lambda p: np.zeros(2)}
        for n in reversed(order[:-1]):
            pts, ds = [], []
            for key, v in sup.items():
                pn, under, xz, Rk = v
                if pn != n: continue
                if under == 'pillars':
                    Lb = P['pillar'].ybot - P[n].ybot if P[n].ybot < P['pillar'].ybot else 1.0; m = near(P['pillar'], xz, PILLAR_D / 2)
                    d = P['pillar'].u[m].mean(0)[[0, 2]] + Rk[[0, 2]] * abs(Lb) ** 3 / (12 * E_B * I)
                elif under == 'pillar': d = P['pillar'].u[near(P['pillar'], xz, 1.5)].mean(0)[[0, 2]]
                else:
                    d = P[under].u[near(P[under], xz, 1.5)].mean(0)[[0, 2]] + move[under](xz)
                pts.append(xz); ds.append(d)
            move[n] = rigid(np.array(pts), np.array(ds))
        pos = {}
        for a, (p1, p2) in ARB.items():
            xz = np.array(Lp[a], float); pos[a] = [(P[p].at(*xz)[[0, 2]] + move[p](xz), y) for p, y in zip((p1, p2), piv[a])]
        uy = {a: (P[ARB[a][0]].at(*Lp[a])[1], P[ARB[a][1]].at(*Lp[a])[1]) for a in ARB}
        out[case] = dict(P=P, pos=pos, uy=uy, piv=piv, Tc=Tc, t=time.time() - t0, sup={k: (v[0], v[1], v[3]) for k, v in sup.items()}, order=order)
    return out

def main():
    sys.stdout.reconfigure(encoding='utf-8'); a = sys.argv[1:]; rows = []; fail = [0]
    say = lambda s: rows.append('  ' + s)
    def chk(ok, s):
        rows.append(('  ok ' if ok else '  !! ') + s.strip())
        if not ok: fail[0] = 1
    if '--check' in a:
        print('the solver against a cantilever (Timoshenko):'); ok, w = check(); print(('  ok ' if ok else '  !! ') + f'at the finest {w * 100:+.1f} % (trilinear bricks are stiff in bending until fine through the depth: the parts here have 5-10 layers)'); sys.exit(0 if ok else 1)
    cache = 'r_fea_geom.json'
    if '--reuse' in a and os.path.exists(cache): geo = json.load(open(cache))
    else: geo = asyncio.run(fetch()); json.dump(geo, open(cache, 'w'))
    GJ = json.load(open(os.path.join(HERE, 'gearing.json'), encoding='utf-8')); cases = loads(geo['L'], GJ); Lp = geo['L']
    say('the solver against a cantilever (Timoshenko, P L³/3EI with shear):'); ok, w = check(); chk(ok, f'the voxel bricks come within {abs(w) * 100:.1f} % of it at the finest')
    runs = {}
    for scale in (1.4, 1.0):
        runs[scale] = movement(geo, scale, GJ, cases, say)
    fine, coarse = runs[1.0], runs[1.4]
    stg = [('Fu', 'C', -6.6),   # the fusee wheel's teeth (-5.9 to -8.12) on the centre pinion's leaves (-5.76 to -7.30): -6.5, the wheel's middle, until 18 October 2026
            ('C', 'T', -5.36), ('T', 'F', -4.535), ('F', 'E', -7.46)]
    def depth(r, a, b, y):
        def at(c):
            (d1, y1), (d2, y2) = r['pos'][c]; k = (y - y1) / (y2 - y1); return d1 + k * (d2 - d1)
        pa, pb = np.array(Lp[a], float), np.array(Lp[b], float); u = (pb - pa) / np.hypot(*(pb - pa)); return float((at(b) - at(a)) @ u)
    J = dict(check=CHECK, E=E_B, Erange=E_RANGE, yieldMPa=YIELD, cases={})
    for case in cases:
        r = fine[case]; rc = coarse[case]; jc = J['cases'][case] = dict(Tc=r['Tc'], parts={}, arbors={}, depths=[], fields={}); say(''); say(f'{case}: the chain pulls {r["Tc"]:.1f} N, every stage lossless')
        if case == list(cases)[0]:
            say('  what each part is held by (its screws), and what each fixing carries:')
            for n in r['order'][:-1]: say(f'    {n}: ' + ', '.join(f'{u} {np.hypot(R[0], R[2]):.2f} N' for k, (pn, u, R) in r['sup'].items() if pn == n))
        for n, p in r['P'].items():
            say(f'  {n:12s} {len(p.conn):6d} bricks ({p.h:.2f} mm, {p.dy:.2f} deep), solved to {p.rr:.0e}; stress under {np.percentile(p.vm, 99.5):.2f} MPa in 99.5 % of it, at most {p.vm.max():.2f} (at a voxel\'s corner)')
            jc['parts'][n] = dict(bricks=len(p.conn), h=p.h, dy=p.dy, vm995=float(np.percentile(p.vm, 99.5)), vmmax=float(p.vm.max()), res=float(p.rr))
            if n == 'barrelBridge' and case == list(cases)[0]:   # the field in plan (the report draws it): each column's largest in-plane movement, on a 0.6 mm grid
                um = np.hypot(p.u[:, 0], p.u[:, 2]) * 1000; key = np.round(p.X[:, [0, 2]] / 0.6).astype(int); o = np.lexsort((-um, key[:, 1], key[:, 0])); k2 = key[o]; first = np.r_[True, (np.diff(k2, axis=0) != 0).any(1)]
                jc['fields'][n] = [[round(float(kx) * 0.6, 2), round(float(kz) * 0.6, 2), round(float(v), 4)] for (kx, kz), v in zip(k2[first], um[o][first])]
            chk(p.vm.max() < YIELD[0] / 1.5, f'  {n}: at most {p.vm.max():.1f} MPa, against brass\'s yield {YIELD[0]}-{YIELD[1]}')
        for a, ((d1, y1), (d2, y2)) in r['pos'].items():
            jc['arbors'][a] = dict(parts=ARB[a], y=[y1, y2], um=[float(np.hypot(*d1) * 1000), float(np.hypot(*d2) * 1000)], lean_urad=float(np.hypot(*(d2 - d1)) / abs(y2 - y1) * 1e6))
            say(f'  {a:2s}: its holes move {np.hypot(*d1) * 1000:.3f} µm (y {y1:.1f}, {ARB[a][0]}) and {np.hypot(*d2) * 1000:.3f} µm (y {y2:.1f}, {ARB[a][1]}); it leans {np.hypot(*(d2 - d1)) / abs(y2 - y1) * 1e6:.1f} µrad')
        for (a, b, y), g in zip(stg, GJ['stages']):
            d, dc = depth(r, a, b, y), depth(rc, a, b, y); jc['depths'].append(dict(stage=g['stage'], um=d * 1000, coarse=dc * 1000, lo=g['lo'] * 1000, tp=g['tp'] * 1000))
            chk(abs(d) < 0.1 * (-g['lo']), f'  {g["stage"]}: the centres {"part" if d > 0 else "close"} {abs(d) * 1000:.3f} µm (coarser bricks {abs(dc) * 1000:.3f}), {abs(d) / -g["lo"] * 100:.2f} % of the {-g["lo"] * 1000:.0f} µm the depth may close, against the holes\' ±{g["tp"] * 1000:.0f} µm')
    say(''); say(f'the deflections are at E {E_B / 1e3:.0f} GPa; at {E_RANGE[0] / 1e3:.0f}-{E_RANGE[1] / 1e3:.0f} they are {E_B / E_RANGE[1]:.2f}-{E_B / E_RANGE[0]:.2f} times as large')
    if '--json' in sys.argv: out = sys.argv[sys.argv.index('--json') + 1]; json.dump(J, open(out, 'w', encoding='utf-8')); rows.append(f'  wrote {out}')
    print('\n'.join(rows)); sys.exit(fail[0])

if __name__ == '__main__': main()
