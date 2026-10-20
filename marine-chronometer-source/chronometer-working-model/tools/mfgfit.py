"""A traced edge measured as the machined part it is: sub-pixel edges, a plane calibrated on holes by their circles, the edge split into
the lines and arcs a machine cuts, and the machining's relations (concentric, tangent, parallel, radial, a standard drill) kept only
where the trace's own scatter allows them. The `measure-trace` skill (.claude/skills/measure-trace/SKILL.md) says when and how to use it.

  python mfgfit.py fit TRACE.json [--map MAP.json] [--image IMG [--channel auto|luma|b|sat|r|g|bl] [--win 6]]
                   [--calib HOLES.json --link trace=hole,...] [--centres L|FILE.json] [--holes HOLES.json] [--sigma MM]
                   [--plane NAME] [--only a,b] [--no-snap] [--floor PX] [--out OUT.mfg.json] [--png OUT.png]
  python mfgfit.py demo [--png DIR]      a synthetic machined part, traced as a hand traces it and refined on a rendered image;
                                         exits 1 if the fit misses what was drawn (about 30 s)

TRACE is the tracer's (tracer.html) `.trace.json` or its `.mm.json` export, or {name: [[x, z], ...]} in mm. Its pixels go to mm by
--map (a flattened image's mapping JSON: x = x0 + (i+0.5)/px_per_mm), by --calib (a homography fitted here on the traced holes linked
to a holes.py table, each hole's edge points held to the hole's circle: a projected circle's ellipse centre is not the circle centre's
image, so ellipse centres are never used), or by the plane's own calibration in the trace. A trace at a height h off the face goes
through a homography fitted on the tracer's own px -> mm pairs for it (exact: a plane at h maps by a homography).

--image refines every traced curve and hole onto the real edge: the image sampled along the trace's normals (+-win px), the blurred
step's profile fitted with an erf (a + b erf((t - t0)/(s sqrt 2))) for t0 to a few hundredths of a pixel, a point kept only where
the step is clear, single and of the edge's common polarity. Then the fit runs on the refined edge, not on the hand's points.

The fit: each curve is split (at the K corners and where the model selection puts them) into lines and arcs by dynamic programming
on the Bayesian information criterion (chi^2 + k ln n; arcs by the hyper-accurate algebraic fit, Al-Sharadqah & Chernov 2009, costed
in O(1) from prefix moments), then everything traced on the plane is fitted at once by geometric least squares (point-to-line and
point-to-circle distances). Relations a machinist makes are tested one at a time, best first, and each kept only if it costs less
than its freed parameters by BIC: tangency at a join (a fillet, a run-out), a fillet inserted at a sharp corner, arcs and holes
concentric with each other or with a named centre (an arbor: --centres L reads movement.js's L), equal radii, lines parallel,
perpendicular or radial through a named centre, a hole's diameter a standard drill (fractional, number, letter or metric) when the
trace's scatter can tell it from its neighbours. Sharp joins are the primitives' intersections; tangent joins their tangent points.

Prints each primitive (centre, radius, sweep or direction, length, rms, sd), each relation tested with its delta chi^2 and the
verdict, each hole against the nearest drill and the model's hole (--holes); writes OUT.mfg.json (the path of exact lines and arcs
per traced object, and a polyline sampled to 0.002 mm, in mm) and OUT.png (the points, the fit, the residuals magnified)."""
import json, math, os, re, sys
import numpy as np
from scipy.optimize import least_squares
from scipy.special import erf
D = os.path.dirname(os.path.abspath(__file__))

# ---------- standard drills (mm) ----------
NUM = [.228,.221,.213,.209,.2055,.204,.201,.199,.196,.1935,.191,.189,.185,.182,.180,.177,.173,.1695,.166,.161,.159,.157,.154,.152,.1495,.147,.144,.1405,.136,.1285,
       .120,.116,.113,.111,.110,.1065,.104,.1015,.0995,.098,.096,.0935,.089,.086,.082,.081,.0785,.076,.073,.070,.067,.0635,.0595,.055,.052,.0465,.043,.042,.041,.040,
       .039,.038,.037,.036,.035,.033,.032,.031,.0292,.028,.026,.025,.024,.0225,.021,.020,.018,.016,.0145,.0135]   # No. 1 .. No. 80, inches
LET = [.234,.238,.242,.246,.250,.257,.261,.266,.272,.277,.281,.290,.295,.302,.316,.323,.332,.339,.348,.358,.368,.377,.386,.397,.404,.413]   # A .. Z
def drills():
    t = [(f'No. {i+1}', v*25.4) for i, v in enumerate(NUM)] + [(chr(65+i), v*25.4) for i, v in enumerate(LET)]
    t += [(f'{n}/64 in' if n % 2 else (f'{n//2}/32 in' if n % 4 else (f'{n//4}/16 in' if n % 8 else f'{n//8}/8 in')), n*25.4/64) for n in range(1, 33)]
    t += [(f'{m/100:.2f} mm', m/100) for m in list(range(20, 300, 5)) + list(range(300, 1300, 10))]
    return sorted(t, key=lambda x: x[1])
DRILLS = drills()
def drill_read(Dm, sd):
    """The drills a diameter Dm (sd) is consistent with (within 2 sd + 0.003), and the one it is, if its neighbours are 4 sd off."""
    tol = 2*sd + 0.003; near = [(n, v) for n, v in DRILLS if abs(v - Dm) <= tol]
    others = [abs(v - Dm) for n, v in DRILLS if abs(v - Dm) > tol]
    uniq = None
    if near:
        vals = sorted(set(round(v, 4) for n, v in near))
        if len(vals) == 1 and (not others or min(others) > 4*sd): uniq = (' = '.join(n for n, v in near), vals[0])
    best = min(DRILLS, key=lambda x: abs(x[1] - Dm))
    return dict(nearest=f'{best[0]} ({best[1]:.4f})', consistent=[f'{n} ({v:.4f})' for n, v in near], unique=uniq[0] if uniq else None, D_std=uniq[1] if uniq else None)
def inch(v): i = v/25.4; return f'{i:.4f} in (nearest 1/64: {round(i*64)}/64 = {round(i*64)*25.4/64:.3f} mm; 0.005 in: {round(i/0.005)*0.005:.3f} in)'

# ---------- primitives ----------
# line q = (th, d): unit normal n = (cos th, sin th), points p with n.p = d.  circle q = (cx, cz, r).
def nrm(th): return np.array([math.cos(th), math.sin(th)])
def dist(t, q, X):
    if t == 'L': return X @ nrm(q[0]) - q[1]
    return np.hypot(X[:, 0] - q[0], X[:, 1] - q[1]) - q[2]
def fit_line(X):
    m = X.mean(0); u = np.linalg.svd(X - m)[2][0]; n = np.array([-u[1], u[0]]); return np.array([math.atan2(n[1], n[0]), n @ m])
def hyper(X):
    """Hyper-accurate algebraic circle fit (Al-Sharadqah & Chernov 2009); None if the points are straight."""
    m = X.mean(0); Y = X - m; z = (Y**2).sum(1); Z = np.c_[z, Y, np.ones(len(Y))]; M = Z.T @ Z/len(Y); zm = z.mean()
    N = np.array([[8*zm, 0, 0, 2], [0, 1, 0, 0], [0, 0, 1, 0], [2, 0, 0, 0]])
    w, V = np.linalg.eig(np.linalg.solve(N, M)); w = w.real; V = V.real; ok = np.where(w > -1e-12)[0]
    if not len(ok): return None
    A = V[:, ok[np.argmin(w[ok])]]
    if abs(A[0]) < 1e-12: return None
    c = -A[1:3]/(2*A[0]); r2 = (A[1]**2 + A[2]**2 - 4*A[0]*A[3])/(4*A[0]**2)
    return None if r2 <= 0 else np.array([c[0] + m[0], c[1] + m[1], math.sqrt(r2)])
def fit_circle(X):
    q = hyper(X)
    if q is None: return None
    r = least_squares(lambda p: dist('C', p, X), q, method='lm'); return r.x if r.success else q

# ---------- segmentation by dynamic programming ----------
MON = lambda x, y: np.c_[np.ones_like(x), x, y, x*x, x*y, y*y, (x*x+y*y)*x, (x*x+y*y)*y, (x*x+y*y)**2]
def seg_costs(X, j, I):
    """Approximate geometric SSE of the best line and the best circle through X[i..j] for each i in I, from prefix moments."""
    S = PS[j+1] - PS[I]; n = S[:, 0]; mx, my = S[:, 1]/n, S[:, 2]/n
    sxx = S[:, 3]/n - mx*mx; sxy = S[:, 4]/n - mx*my; syy = S[:, 5]/n - my*my
    lam = 0.5*(sxx + syy) - np.sqrt(0.25*(sxx - syy)**2 + sxy**2); sse_l = np.maximum(lam, 0)*n
    # moments of [z, x, y, 1] (z = x^2 + y^2) for the hyper fit, in the data's global frame (centred, scaled)
    zz, zx, zy, z = S[:, 8]/n, S[:, 6]/n, S[:, 7]/n, (S[:, 3] + S[:, 5])/n
    M = np.stack([np.stack([zz, zx, zy, z], -1), np.stack([zx, S[:, 3]/n, S[:, 4]/n, mx], -1), np.stack([zy, S[:, 4]/n, S[:, 5]/n, my], -1), np.stack([z, mx, my, np.ones_like(n)], -1)], 1)
    N = np.zeros_like(M); N[:, 0, 0] = 8*z; N[:, 0, 1] = N[:, 1, 0] = 4*mx; N[:, 0, 2] = N[:, 2, 0] = 4*my; N[:, 0, 3] = N[:, 3, 0] = 2; N[:, 1, 1] = N[:, 2, 2] = 1
    sse_c = np.full(len(I), np.inf); R = np.full(len(I), np.inf)
    try: w, V = np.linalg.eig(np.linalg.solve(N, M))
    except np.linalg.LinAlgError: return sse_l, sse_c, R, np.zeros((len(I), 2))
    w = w.real; V = V.real; w = np.where(w > -1e-12, w, np.inf); k = np.argmin(w, 1); A = V[np.arange(len(I)), :, k]
    a = A[:, 0]; ok = (np.abs(a) > 1e-12) & np.isfinite(w[np.arange(len(I)), k])
    r2 = np.where(ok, (A[:, 1]**2 + A[:, 2]**2 - 4*A[:, 0]*A[:, 3])/(4*np.where(ok, a, 1)**2), -1); ok &= r2 > 0
    q = np.einsum('ni,nij,nj->n', A, M, A)*n; sse_c = np.where(ok, q/(4*np.where(ok, a, 1)**2*np.where(ok, r2, 1)), np.inf); R = np.where(ok, np.sqrt(np.maximum(r2, 0)), np.inf)
    Cc = -A[:, 1:3]/(2*np.where(ok, a, 1)[:, None]); return sse_l, sse_c, R, Cc
PS = None
def segment(X, sig, rmax, rmin=0.0, datums=None):
    """Optimal split of an ordered run X (shared break points) into lines and arcs by BIC. Returns [(i, j, 'L'|'C')]."""
    global PS
    m = X.mean(0); s = max(np.abs(X - m).max(), 1e-9); Y = (X - m)/s; PS = np.vstack([np.zeros(9), np.cumsum(MON(Y[:, 0], Y[:, 1]), 0)])
    n = len(X); lnN = math.log(max(n, 3)); cost = np.full(n, np.inf); cost[0] = 0; back = [None]*n
    for j in range(1, n):
        I = np.arange(0, j); sl, sc, R, Cc = seg_costs(Y, j, I); sl = sl*s*s/sig**2; sc = sc*s*s/sig**2; R = R*s; Cc = Cc*s + m
        cnt = j - I + 1; cl = sl + 3*lnN; ch = np.hypot(*(X[j] - X[I]).T); sw = 2*np.arcsin(np.clip(ch/(2*np.maximum(R, 1e-9)), 0, 1))
        flat = sw < math.radians(15)   # a flat arc is cut about a datum (a rim about the plate's centre) or it is a straight cut
        if datums is not None and len(datums): flat_ok = np.min(np.hypot(Cc[:, None, 0] - datums[None, :, 0], Cc[:, None, 1] - datums[None, :, 1]), 1) < 0.5 + 0.03*R; fp = np.where(flat & ~flat_ok, np.inf, 0)
        else: fp = np.where(flat, 2*lnN, 0)
        cc = np.where((cnt >= 3) & (R < rmax) & (R >= rmin), sc + 4*lnN + fp, np.inf)
        tot_l = cost[I] + cl; tot_c = cost[I] + cc; il, ic = np.argmin(tot_l), np.argmin(tot_c)
        if tot_l[il] <= tot_c[ic]: cost[j] = tot_l[il]; back[j] = (il, 'L')
        else: cost[j] = tot_c[ic]; back[j] = (ic, 'C')
    out = []; j = n - 1
    while j > 0: i, t = back[j]; out.append((int(i), j, t)); j = int(i)
    return out[::-1]
def turning(X, closed):
    a = np.roll(X, 1, 0) - X if closed else np.r_[[X[0] - X[1]], X[:-1] - X[1:]]; b = np.roll(X, -1, 0) - X if closed else np.r_[X[1:] - X[:-1], [X[-1] - X[-2]]]
    c = (a*b).sum(1)/np.maximum(np.hypot(*a.T)*np.hypot(*b.T), 1e-12); return math.pi - np.arccos(np.clip(c, -1, 1))

# ---------- the joint fit ----------
class Model:
    """Every primitive on the plane and the relations between them, fitted together by geometric least squares."""
    def __init__(s, X, sig): s.X = X; s.sig = sig; s.P = []; s.rel = []
    def add(s, t, q, idx, obj, kind): s.P.append(dict(t=t, q=np.array(q, float), idx=np.array(idx), obj=obj, kind=kind)); return len(s.P) - 1
    def pack(s): return np.concatenate([p['q'] for p in s.P])
    def unpack(s, v):
        k = 0
        for p in s.P: m = len(p['q']); p['q'] = v[k:k+m].copy(); k += m
    def relres(s, r, Q):
        t = r['t']; a = Q[r['a']]; b = Q[r['b']] if 'b' in r else None
        if t == 'tan':   # tangency, its sign as first seen
            if r['ta'] == 'L': return [r['sg']*(nrm(a[0]) @ b[:2] - a[1]) - b[2]]
            return [math.hypot(a[0] - b[0], a[1] - b[1]) - (a[2] + b[2] if r['sg'] > 0 else abs(a[2] - b[2]))]
        if t == 'cen': return [a[0] - r['c'][0], a[1] - r['c'][1]]
        if t == 'conc': return [a[0] - b[0], a[1] - b[1]]
        if t == 'eqr': return [a[2] - b[2]]
        if t == 'rad': return [a[2] - r['R']]
        if t == 'par': return [math.sin(a[0] - b[0])]
        if t == 'perp': return [math.cos(a[0] - b[0])]
        if t == 'thru': return [nrm(a[0]) @ np.array(r['c']) - a[1]]
    def res(s, v, rels):
        s.unpack(v); Q = [p['q'] for p in s.P]; out = [dist(p['t'], p['q'], s.X[p['idx']])/s.sig for p in s.P]
        for r in rels: out.append(np.array(s.relres(r, Q))*1e4)
        return np.concatenate(out)
    def jac(s, v, rels):
        """Analytic for the points (point-to-line, point-to-circle), central differences for the relations' few rows."""
        s.unpack(v); npar = len(v); rows = []; k = 0
        for p in s.P:
            X = s.X[p['idx']]; m = len(p['q']); Jp = np.zeros((len(X), npar))
            if p['t'] == 'L': th = p['q'][0]; Jp[:, k] = (-X[:, 0]*math.sin(th) + X[:, 1]*math.cos(th))/s.sig; Jp[:, k+1] = -1/s.sig
            else: d = np.maximum(np.hypot(X[:, 0] - p['q'][0], X[:, 1] - p['q'][1]), 1e-12); Jp[:, k] = -(X[:, 0] - p['q'][0])/d/s.sig; Jp[:, k+1] = -(X[:, 1] - p['q'][1])/d/s.sig; Jp[:, k+2] = -1/s.sig
            rows.append(Jp); k += m
        off = np.cumsum([0] + [len(p['q']) for p in s.P])
        for r in rels:   # each relation over its own primitives' parameters only
            f = lambda w: np.array(s.relres(r, [w[off[i]:off[i+1]] for i in range(len(s.P))]))*1e4; Jr = np.zeros((len(f(v)), npar))
            for i in list(range(off[r['a']], off[r['a']+1])) + (list(range(off[r['b']], off[r['b']+1])) if 'b' in r else []):
                h = 1e-7*max(1, abs(v[i])); e = np.zeros(npar); e[i] = h; Jr[:, i] = (f(v + e) - f(v - e))/(2*h)
            rows.append(Jr)
        s.unpack(v); return np.vstack(rows)
    def solve(s, rels=None):
        rels = s.rel if rels is None else rels; v0 = s.pack()
        r = least_squares(s.res, v0, jac=s.jac, args=(rels,), method='trf', x_scale='jac', max_nfev=400)
        s.unpack(r.x); s.J = r.jac; npts = sum(len(p['idx']) for p in s.P); s.chi2 = float(np.sum(r.fun[:npts]**2)); return s.chi2
    def nfree(s): return sum(len(p['q']) for p in s.P) - sum(r['dof'] for r in s.rel)
    def sd(s):
        try: C = np.linalg.pinv(s.J.T @ s.J)
        except Exception: return [None]*len(s.P)
        f = max(1.0, s.chi2/max(1, sum(len(p['idx']) for p in s.P) - s.nfree())); out = []; k = 0
        for p in s.P: m = len(p['q']); out.append(np.sqrt(np.maximum(np.diag(C)[k:k+m]*f, 0))); k += m
        return out

def junction(a, b, near, tangent):
    """The join of primitives a and b nearest `near`: the tangent point, or the intersection (else the mid point of the nearest)."""
    ta, qa, tb, qb = a['t'], a['q'], b['t'], b['q']
    if ta == 'L' and tb == 'L':
        A = np.array([nrm(qa[0]), nrm(qb[0])])
        if abs(np.linalg.det(A)) < 0.02: return 0.5*(project(near, qa, 'L') + project(near, qb, 'L'))
        return np.linalg.solve(A, [qa[1], qb[1]])
    if ta == 'C' and tb == 'L': ta, qa, tb, qb = tb, qb, ta, qa
    if ta == 'L':   # line qa, circle qb
        n = nrm(qa[0]); c = qb[:2]; h = n @ c - qa[1]; foot = c - h*n
        if tangent or abs(h) >= qb[2]: return foot
        u = np.array([-n[1], n[0]]); w = math.sqrt(qb[2]**2 - h*h); P = [foot + w*u, foot - w*u]
        return min(P, key=lambda p: np.hypot(*(p - near)))
    c1, r1, c2, r2 = qa[:2], qa[2], qb[:2], qb[2]; d = np.hypot(*(c2 - c1))
    if d < 1e-12: return near
    u = (c2 - c1)/d
    if tangent or d > r1 + r2 or d < abs(r1 - r2): return min([c1 + r1*u, c1 - r1*u], key=lambda p: np.hypot(*(p - near)))
    x = (d*d + r1*r1 - r2*r2)/(2*d); y = math.sqrt(max(r1*r1 - x*x, 0)); v = np.array([-u[1], u[0]])
    return min([c1 + x*u + y*v, c1 + x*u - y*v], key=lambda p: np.hypot(*(p - near)))
def project(p, q, t):
    if t == 'L': n = nrm(q[0]); return p - (n @ p - q[1])*n
    v = p - q[:2]; return q[:2] + q[2]*v/max(np.hypot(*v), 1e-12)

# ---------- image refinement ----------
def channel(img, ch):
    import cv2
    if img.ndim == 2: return img.astype(float)
    b, g, r = [img[:, :, i].astype(float) for i in range(3)]
    if ch == 'luma': return 0.299*r + 0.587*g + 0.114*b
    if ch == 'b': return cv2.cvtColor(img, cv2.COLOR_BGR2LAB)[:, :, 2].astype(float)
    if ch == 'sat': return cv2.cvtColor(img, cv2.COLOR_BGR2HSV)[:, :, 1].astype(float)
    return {'r': r, 'g': g, 'bl': b}[ch]
def cr(P, closed, corners, step=1.0):
    """The tracer's centripetal Catmull-Rom through P (corners end a span straight), densely; with each sample's normal."""
    n = len(P); out = []
    for i in range(n if closed else n - 1):
        i1 = (i + 1) % n; P1, P2 = P[i], P[i1]
        A = P[(i - 1) % n] if (closed or i > 0) and i not in corners else 2*P1 - P2
        Dd = P[(i1 + 1) % n] if (closed or i1 < n - 1) and i1 not in corners else 2*P2 - P1
        m = max(2, int(math.ceil(np.hypot(*(P2 - P1))/step)))
        t = lambda a, b: max(np.hypot(*(b - a))**0.5, 1e-6); t1 = t(A, P1); t2 = t1 + t(P1, P2); t3 = t2 + t(P2, Dd)
        for u in np.linspace(t1, t2, m + 1)[(0 if i == 0 else 1):]:
            A1 = (t1 - u)/t1*A + u/t1*P1; A2 = (t2 - u)/(t2 - t1)*P1 + (u - t1)/(t2 - t1)*P2; A3 = (t3 - u)/(t3 - t2)*P2 + (u - t2)/(t3 - t2)*Dd
            B1 = (t2 - u)/t2*A1 + u/t2*A2; B2 = (t3 - u)/(t3 - t1)*A2 + (u - t1)/(t3 - t1)*A3; out.append((t2 - u)/(t2 - t1)*B1 + (u - t1)/(t2 - t1)*B2)
    Q = np.array(out); T = np.gradient(Q, axis=0); T /= np.maximum(np.hypot(*T.T), 1e-12)[:, None]; return Q, np.c_[-T[:, 1], T[:, 0]]
def edge_profiles(C, Q, Nn, win):
    from scipy.ndimage import map_coordinates
    t = np.arange(-win, win + 1e-9, 0.25); px = Q[:, None, 0] + t[None]*Nn[:, None, 0]; py = Q[:, None, 1] + t[None]*Nn[:, None, 1]
    return t, map_coordinates(C, [py.ravel(), px.ravel()], order=3, mode='nearest').reshape(px.shape)
def refine_points(img, Q, Nn, win=6, ch='auto', skip=None):
    """Each sample moved along its normal onto the edge (erf fit); returns kept points, their sd (px), the channel used, blur, kept mask."""
    from scipy.ndimage import gaussian_filter
    from scipy.optimize import curve_fit
    chs = ['luma', 'b', 'sat', 'r', 'g', 'bl'] if ch == 'auto' and img.ndim == 3 else [ch if img.ndim == 3 else 'luma']
    best = None
    for c in chs:   # the channel whose edge stands highest over its noise along these normals
        Cc = gaussian_filter(channel(img, c), 0.6); t, Pr = edge_profiles(Cc, Q, Nn, win); g = np.gradient(Pr, axis=1)
        sc = np.median(np.abs(g).max(1))/(np.median(np.abs(np.diff(Pr, 2, axis=1))) + 1e-9)
        if best is None or sc > best[0]: best = (sc, c, Cc, t, Pr, g)
    _, c, Cc, t, Pr, g = best
    pol = np.sign(np.median(g[np.arange(len(g)), np.abs(g).argmax(1)]))
    fe = lambda x, a, b, t0, s: a + b*erf((x - t0)/(s*math.sqrt(2)))
    out, sd, blur, keep = [], [], [], np.zeros(len(Q), bool)
    for k in range(len(Q)):
        if skip is not None and skip[k]: continue
        gg = g[k]*pol; j = int(np.argmax(gg))
        if gg[j] <= 0: continue
        pk = [i for i in range(1, len(gg) - 1) if gg[i] >= gg[i-1] and gg[i] >= gg[i+1] and gg[i] > 0.6*gg[j] and abs(t[i] - t[j]) > 1.5]
        if pk: continue   # two edges within the window: ambiguous
        m = (t > t[j] - 3.5) & (t < t[j] + 3.5)
        if m.sum() < 12: continue
        y = Pr[k, m]; x = t[m]; a0 = 0.5*(y[0] + y[-1]); b0 = 0.5*(y[-1] - y[0])
        try: p, cv = curve_fit(fe, x, y, p0=[a0, b0, t[j], 1.0], maxfev=400)
        except Exception: continue
        if not (abs(p[2]) < win - 1 and 0.2 < abs(p[3]) < 4 and np.all(np.isfinite(cv))): continue
        e = math.sqrt(max(cv[2, 2], 0)); noise = np.std(y - fe(x, *p))
        if abs(p[1]) < 4*noise or e > 0.5: continue
        out.append(Q[k] + p[2]*Nn[k]); sd.append(e); blur.append(abs(p[3])); keep[k] = True
    return np.array(out).reshape(-1, 2), np.array(sd), c, (float(np.median(blur)) if blur else None), keep
def ellipse_samples(P, n=180):
    """A traced hole's points -> an ellipse through them (a circle for under 5), sampled with its outward normals."""
    import cv2
    E = cv2.fitEllipse(P.astype(np.float32)) if len(P) >= 8 else None
    if E and min(E[1]) > 0.6*max(E[1]): (cx, cy), (w, h), a = E; A, B, th = w/2, h/2, math.radians(a)
    else:
        q = fit_circle(P) if len(P) >= 3 else None
        if q is None: return None, None
        cx, cy, A, B, th = q[0], q[1], q[2], q[2], 0
    u = np.linspace(0, 2*math.pi, n, endpoint=False); ct, st = math.cos(th), math.sin(th)
    x, y = A*np.cos(u), B*np.sin(u); Q = np.c_[cx + x*ct - y*st, cy + x*st + y*ct]
    nx, ny = np.cos(u)/max(A, 1e-9), np.sin(u)/max(B, 1e-9); Nn = np.c_[nx*ct - ny*st, nx*st + ny*ct]; Nn /= np.hypot(*Nn.T)[:, None]
    return Q, Nn

# ---------- input ----------
def H_apply(H, P): P = np.asarray(P, float); Y = np.c_[P, np.ones(len(P))] @ np.asarray(H).T; return Y[:, :2]/Y[:, 2:3]
def H_fit(A, B):
    """DLT homography A -> B (normalised)."""
    def T(P): m = P.mean(0); s = math.sqrt(2)/max(np.mean(np.hypot(*(P - m).T)), 1e-12); return np.array([[s, 0, -s*m[0]], [0, s, -s*m[1]], [0, 0, 1]])
    Ta, Tb = T(A), T(B); a = H_apply(Ta, A); b = H_apply(Tb, B); M = []
    for (x, y), (u, v) in zip(a, b): M += [[-x, -y, -1, 0, 0, 0, u*x, u*y, u], [0, 0, 0, -x, -y, -1, v*x, v*y, v]]
    h = np.linalg.svd(np.array(M))[2][-1].reshape(3, 3); H = np.linalg.inv(Tb) @ h @ Ta; return H/H[2, 2]
def load_trace(path, plane=None):
    """-> list of objects {name, kind, closed, h, px (n,2) or None, mm (n,2) or None, corners set, plane, Hpx2mm or None}, image name."""
    d = json.load(open(path, encoding='utf-8')); objs = []
    if d.get('tool') == 'tracer':
        pls = {p['id']: p for p in d.get('planes', [])}
        for o in d.get('objs', []):
            pl = pls.get(o.get('plane'), {}); dv = o.get('derived', {}); pdv = pl.get('derived', {}); Hm = None
            if dv.get('curve_px') and dv.get('curve_mm') and len(dv['curve_px']) >= 4: Hm = H_fit(np.array(dv['curve_px']), np.array(dv['curve_mm']))
            elif dv.get('mm') and len(dv['mm']) >= 4 and (o.get('h') or 0): Hm = H_fit(np.array([p[:2] for p in o['pts']]), np.array(dv['mm']))
            elif pdv.get('H_mm_to_px'): Hm = np.linalg.inv(np.array(pdv['H_mm_to_px']))
            objs.append(dict(name=o.get('name') or f"{o['kind']}{o['id']}", kind=o['kind'], closed=bool(o.get('closed')), h=o.get('h') or 0, plane=pl.get('name', ''),
                             px=np.array([p[:2] for p in o['pts']], float) if o.get('pts') else None, corners={i for i, p in enumerate(o.get('pts', [])) if len(p) > 2 and p[2]}, Hm=Hm, mm=None))
        img = (d.get('image') or {}).get('name') if isinstance(d.get('image'), dict) else d.get('image')
    elif 'planes' in d and isinstance(d['planes'], dict):
        for pn, pl in d['planes'].items():
            cal = pl.get('calibration') or {}; Hp = np.linalg.inv(np.array(cal['H_mm_to_px'])) if cal.get('H_mm_to_px') else None
            for nm, t in pl.get('traces', {}).items():
                Hm = H_fit(np.array(t['points_px']), np.array(t['points_mm'])) if t.get('points_mm') and len(t['points_px']) >= 4 and t.get('h') else Hp
                objs.append(dict(name=nm, kind=t['kind'], closed=bool(t.get('closed')), h=t.get('h') or 0, plane=pn, px=np.array(t['points_px'], float), corners=set(), Hm=Hm, mm=None))
        img = d.get('image')
    else:
        for nm, v in d.items():
            if isinstance(v, list) and v and isinstance(v[0], list): objs.append(dict(name=nm, kind='curve', closed=False, h=0, plane='', px=None, corners=set(), Hm=None, mm=np.array(v, float)))
        img = None
    if plane: objs = [o for o in objs if o['plane'] == plane]
    return [o for o in objs if o['kind'] in ('curve', 'ellipse')], img

def calibrate(objs, holes, links):
    """A homography px -> mm fitted on traced holes' edge points held to the linked model holes' circles (geometric, robust)."""
    H0 = holes['holes']; L = []
    for a in links.split(','):
        t, h = a.split('='); o = next((o for o in objs if o['name'] == t), None)
        if o is None or h not in H0: sys.exit(f'--link: no trace {t} or hole {h}')
        L.append((o['px'], np.array(H0[h][:2], float), float(H0[h][2]), t, h))
    if len(L) < 3: sys.exit('--calib needs 3 or more linked holes (4 or more for a homography)')
    C = np.array([P.mean(0) for P, *_ in L]); M = np.array([c for _, c, *_ in L])
    if len(L) >= 4: H = H_fit(C, M)
    else: sol = np.linalg.lstsq(np.c_[C, np.ones(len(C))], M, rcond=None)[0]; H = np.r_[sol.T, [[0, 0, 1]]]   # an affine first
    def res(h, L=L):
        Hh = np.r_[h, 1].reshape(3, 3); return np.concatenate([np.hypot(*(H_apply(Hh, P) - c).T) - r for P, c, r, *_ in L] + [0.2*(H_apply(Hh, P.mean(0)[None])[0] - c) for P, c, r, *_ in L])
    h0 = (H/H[2, 2]).ravel()[:8]; r = least_squares(res, h0, loss='soft_l1', f_scale=0.05, x_scale='jac'); H = np.r_[r.x, 1].reshape(3, 3)
    rep = []
    for P, c, rr, t, h in L:
        q = fit_circle(H_apply(H, P)) if len(P) >= 3 else None; rep.append((t, h, None if q is None else float(np.hypot(*(q[:2] - c))), None if q is None else float(q[2] - rr)))
    return H, rep

def centres_from(arg):
    if not arg: return {}
    if arg == 'L':
        src = open(os.path.join(D, '..', 'js', 'movement.js'), encoding='utf-8').read(); m = re.search(r'const L=\{([^}]*)\}', src)
        return {k: (float(x), float(z)) for k, x, z in re.findall(r'(\w+):\[([-\d.]+),([-\d.]+)\]', m.group(1))}
    d = json.load(open(arg, encoding='utf-8'))
    if 'holes' in d: return {k: tuple(v[:2]) for k, v in d['holes'].items()}
    return {k: tuple(v[:2]) for k, v in d.items()}

# ---------- the fit ----------
def run(objs, sig=None, centres=None, snap=True, rmax=2000.0, rlim=0.0, floor=0.0):
    """Fit every object (points in mm in o['mm']); returns the Model, the per-object chains, the relations tested."""
    centres = centres or {}; X = []; chains = []
    for o in objs:
        P = o['mm']
        if P is None or len(P) < 2: continue
        o['i0'] = len(X); X += list(P)
    X = np.array(X)
    def local_sigma():
        r = []
        for o in objs:
            P = o['mm']
            if P is None or len(P) < 7 or o['kind'] == 'ellipse': continue
            for i in range(3, len(P) - 3):
                W = P[i-3:i+4]; q = fit_circle(W); e = dist('C', q, W) if q is not None and q[2] < rmax else dist('L', fit_line(W), W); r.append(math.sqrt(np.mean(e**2)*7/4))
        return float(np.median(r)) if r else 0.05
    s0 = sig or max(local_sigma(), floor); M = Model(X, s0)
    for o in objs:
        P = o['mm']
        if P is None or len(P) < 2: continue
        i0 = o['i0']; n = len(P); ch = []
        if o['kind'] == 'ellipse' or (o['closed'] and n >= 5 and (lambda q: q is not None and np.sqrt(np.mean(dist('C', q, P)**2)) < 2.5*s0)(fit_circle(P))):
            q = fit_circle(P); ch.append(M.add('C', q, range(i0, i0 + n), o['name'], 'hole' if o['kind'] == 'ellipse' else 'circle')); chains.append(dict(obj=o['name'], prims=ch, closed=True, full=True)); continue
        cut = sorted(o['corners'])
        if o['closed']:
            st = cut[0] if cut else int(np.argmax(turning(P, True))); order = np.r_[np.arange(st, n), np.arange(0, st), st]; cut = sorted({0} | {(c - st) % n for c in cut}) + [n]
        else: order = np.arange(n); cut = sorted(set([0] + cut + [n - 1]))
        Pp = P[order]; segs = []
        pcs = list(zip(cut[:-1], cut[1:]))
        for pi, (a, b) in enumerate(pcs):   # a refined edge breaks in the gap left at a corner (no shared point); a hand's at its K point
            e = b + (0 if o.get('gapcut') and (o['closed'] or pi < len(pcs) - 1) else 1)
            if e - a < 2: continue
            sel = np.unique(np.r_[np.arange(0, e - a, max(1, (e - a)//400)), e - a - 1])   # long refined runs: the split on a subsample, the fit on all
            for i, j, t in segment(Pp[a:e][sel], s0, rmax, rlim, np.array(list(centres.values())) if centres else None): segs.append((a + int(sel[i]), a + int(sel[j]), t))
        if o['closed'] and len(segs) > 1:   # one primitive across the start
            (i, j, t), (i2, j2, t2) = segs[0], segs[-1]
            if t == t2 and not o['corners']:
                Q = np.r_[Pp[i2:j2+1], Pp[i+1:j+1]]; q = fit_circle(Q) if t == 'C' else fit_line(Q)
                if q is not None and np.sqrt(np.mean(dist(t, q, Q)**2)) < 2*s0: segs = [(i2, j + len(Pp) - 1, t)] + segs[1:-1]
        for i, j, t in segs:
            idx = [i0 + order[k % (len(Pp) - 1)] if o['closed'] else i0 + order[k] for k in range(i, j + 1)]
            Q = X[idx]; q = fit_circle(Q) if t == 'C' else fit_line(Q)
            if q is None: t, q = 'L', fit_line(Q)
            ch.append(M.add(t, q, idx, o['name'], 'arc' if t == 'C' else 'line'))
        chains.append(dict(obj=o['name'], prims=ch, closed=o['closed'], full=False))
    M.solve([])
    for c in chains:   # neighbours that are one primitive (a split the subsample's split left): merged where BIC prefers it
        if c['full']: continue
        k = 0
        while k < len(c['prims']) - 1 and len(c['prims']) > 1:
            a_, b_ = M.P[c['prims'][k]], M.P[c['prims'][k+1]]
            if a_['t'] == b_['t']:
                idx = np.r_[a_['idx'], b_['idx'][1:]]; Q = X[idx]; q = fit_circle(Q) if a_['t'] == 'C' else fit_line(Q)
                if q is not None:
                    old = sum(np.sum(dist(p['t'], p['q'], X[p['idx']])**2) for p in (a_, b_))/s0**2; new = np.sum(dist(a_['t'], q, Q)**2)/s0**2
                    if new - old < (len(q) + 1)*math.log(len(X)):
                        a_['q'] = q; a_['idx'] = idx; b_['idx'] = np.array([], int); c['prims'].pop(k + 1); continue
            k += 1
    for c in chains:   # a line with no point of its own (two shared break points) between others: the fillet test decides that corner
        if c['full'] or len(c['prims']) < 3: continue
        for k in list(c['prims']):
            if M.P[k]['t'] == 'L' and len(M.P[k]['idx']) <= 2 and len(c['prims']) >= 3: M.P[k]['idx'] = np.array([], int); c['prims'].remove(k)
    if rlim:   # slivers no longer than the blur at a join: the corner's rounding by the lens, not the part
        for c in chains:
            if c['full'] or len(c['prims']) < 3: continue
            for k in list(c['prims']):
                p = M.P[k]
                if len(p['idx']) <= 8 and np.hypot(*(X[p['idx'][-1]] - X[p['idx'][0]])) < 3*rlim: p['idx'] = np.array([], int); c['prims'].remove(k)
    keep = [k for k, p in enumerate(M.P) if len(p['idx'])]; ren = {k: i for i, k in enumerate(keep)}; M.P = [M.P[k] for k in keep]
    for c in chains: c['prims'] = [ren[k] for k in c['prims']]
    M.solve([]); dof = max(1, len(X) - M.nfree()); s1 = max(s0*math.sqrt(max(M.chi2/dof, 1e-6)), floor); M.sig = s1; M.solve([])
    tested = []
    if snap:
        lnN = math.log(len(X))
        # fillets at sharp line-line joins: a small tangent arc taking the points nearest the corner
        for c in chains:
            if c['full']: continue
            pr = c['prims']; pairs = list(zip(pr[:-1], pr[1:])) + ([(pr[-1], pr[0])] if c['closed'] and len(pr) > 1 else [])
            for a, b in pairs:
                A, B = M.P[a], M.P[b]
                if A['t'] != 'L' or B['t'] != 'L': continue
                ang = abs(math.degrees(math.asin(max(-1, min(1, math.sin(A['q'][0] - B['q'][0]))))))
                if ang < 8: continue
                v = junction(A, B, X[A['idx'][-1]], False); dd = [np.hypot(*(X[k] - v)) for k in list(A['idx'][-4:]) + list(B['idx'][:4])]
                near = [k for k in list(A['idx'][-4:]) + list(B['idx'][:4]) if np.hypot(*(X[k] - v)) < 3*np.median(dd)]
                if len(near) < 3: continue
                tried = Model(X, s1); tried.P = [dict(p, q=p['q'].copy(), idx=p['idx'].copy()) for p in M.P]; tried.rel = list(M.rel)
                ina = [k for k in near if k in A['idx']]; inb = [k for k in near if k in B['idx']]
                if len(A['idx']) - len(ina) < 2 or len(B['idx']) - len(inb) < 2: continue
                q = fit_circle(X[near]) if len(near) >= 3 else None
                if q is None or q[2] > 5 or q[2] < rlim: continue
                tried.P[a]['idx'] = np.array([k for k in A['idx'] if k not in ina] + ([ina[0]] if ina else [])); tried.P[b]['idx'] = np.array(([inb[-1]] if inb else []) + [k for k in B['idx'] if k not in inb])
                f = tried.add('C', q, near, c['obj'], 'fillet')
                sa = 1 if nrm(A['q'][0]) @ q[:2] - A['q'][1] > 0 else -1; sb = 1 if nrm(B['q'][0]) @ q[:2] - B['q'][1] > 0 else -1
                tried.rel += [dict(t='tan', a=a, b=f, ta='L', sg=sa, dof=1), dict(t='tan', a=b, b=f, ta='L', sg=sb, dof=1)]
                old = M.chi2; new = tried.solve(); dc = new - old; ok = dc < -1*lnN and tried.P[f]['q'][2] >= rlim   # a fillet adds 3 - 2 = 1 parameter; none under the image's blur
                tested.append(dict(t='fillet', prims=[a, b], dchi2=dc, dof=-1, ok=bool(ok), note=f'r {tried.P[f]["q"][2]:.3f}'))
                if ok: M.P, M.rel, M.chi2 = tried.P, tried.rel, new; c['prims'] = c['prims'][:c['prims'].index(a) + 1] + [f] + c['prims'][c['prims'].index(a) + 1:]
        cand = []
        for c in chains:   # tangency at the joins
            if c['full']: continue
            pr = c['prims']; pairs = list(zip(pr[:-1], pr[1:])) + ([(pr[-1], pr[0])] if c['closed'] and len(pr) > 1 else [])
            for a, b in pairs:
                A, B = M.P[a], M.P[b]
                if A['t'] == 'L' and B['t'] == 'L': continue
                if any(r['t'] == 'tan' and {r['a'], r['b']} == {a, b} for r in M.rel): continue
                if A['t'] == 'C' and B['t'] == 'L': a, b, A, B = b, a, B, A
                if A['t'] == 'L':
                    h = nrm(A['q'][0]) @ B['q'][:2] - A['q'][1]; gap = abs(abs(h) - B['q'][2]); sg = 1 if h > 0 else -1
                    if gap < 0.15*B['q'][2] + 5*s1: cand.append(dict(t='tan', a=a, b=b, ta='L', sg=sg, dof=1))
                else:
                    d = np.hypot(*(A['q'][:2] - B['q'][:2])); e1 = abs(d - (A['q'][2] + B['q'][2])); e2 = abs(d - abs(A['q'][2] - B['q'][2])); sg = 1 if e1 < e2 else -1
                    if min(e1, e2) < 0.15*min(A['q'][2], B['q'][2]) + 5*s1: cand.append(dict(t='tan', a=a, b=b, ta='C', sg=sg, dof=1))
        S = M.sd(); C = [k for k, p in enumerate(M.P) if p['t'] == 'C']; Ls = [k for k, p in enumerate(M.P) if p['t'] == 'L']
        for k in C:
            sc = max(float(np.hypot(*S[k][:2])) if S[k] is not None else s1, s1)
            for nm, cc in centres.items():
                if np.hypot(M.P[k]['q'][0] - cc[0], M.P[k]['q'][1] - cc[1]) < max(4*sc, 0.05) + 0.3: cand.append(dict(t='cen', a=k, c=cc, name=nm, dof=2))
            if M.P[k]['kind'] == 'hole':
                Dr = drill_read(2*M.P[k]['q'][2], 2*(S[k][2] if S[k] is not None else s1))
                if Dr['unique']: cand.append(dict(t='rad', a=k, R=Dr['D_std']/2, name=Dr['unique'], dof=1))
        for i, k in enumerate(C):
            for k2 in C[i+1:]:
                A, B = M.P[k], M.P[k2]; se = max(4*s1, 0.05)
                if np.hypot(*(A['q'][:2] - B['q'][:2])) < se + 0.3: cand.append(dict(t='conc', a=k, b=k2, dof=2))
                if abs(A['q'][2] - B['q'][2]) < se and A['kind'] != 'hole' and B['kind'] != 'hole': cand.append(dict(t='eqr', a=k, b=k2, dof=1))
        for i, k in enumerate(Ls):
            for k2 in Ls[i+1:]:
                da = (math.degrees(M.P[k]['q'][0] - M.P[k2]['q'][0])) % 180
                if min(da, 180 - da) < 2: cand.append(dict(t='par', a=k, b=k2, dof=1))
                if abs(da - 90) < 2: cand.append(dict(t='perp', a=k, b=k2, dof=1))
            for nm, cc in centres.items():
                if abs(nrm(M.P[k]['q'][0]) @ np.array(cc) - M.P[k]['q'][1]) < 0.3: cand.append(dict(t='thru', a=k, c=cc, name=nm, dof=1))
        scored = []; v = M.pack(); Jf = M.jac(v, M.rel); C = np.linalg.pinv(Jf.T @ Jf); off = np.cumsum([0] + [len(p['q']) for p in M.P])
        for r in cand:   # each alone by the linearised test, chi2 += g' (G C G')^-1 g (G the constraint's gradient), then best first, each solved against what was kept
            f = lambda w: np.array(M.relres(r, [w[off[i]:off[i+1]] for i in range(len(M.P))])); g = f(v); G = np.zeros((len(g), len(v)))
            for i in list(range(off[r['a']], off[r['a']+1])) + (list(range(off[r['b']], off[r['b']+1])) if 'b' in r else []):
                h = 1e-7*max(1, abs(v[i])); e = np.zeros(len(v)); e[i] = h; G[:, i] = (f(v + e) - f(v - e))/(2*h)
            try: est = float(g @ np.linalg.solve(G @ C @ G.T + 1e-18*np.eye(len(g)), g))
            except np.linalg.LinAlgError: continue
            if est < 3*r['dof']*lnN + 10: scored.append((est, r))
        M.unpack(v); scored.sort(key=lambda z: z[0])
        for dc0, r in scored:
            if any(rr['t'] == r['t'] and rr['a'] == r['a'] and rr.get('b') == r.get('b') for rr in M.rel): continue
            if r['t'] == 'cen' and any(rr['t'] == 'cen' and rr['a'] == r['a'] for rr in M.rel): continue
            if r['t'] == 'conc' and any(rr['t'] == 'cen' and rr['a'] in (r['a'], r['b']) for rr in M.rel) and sum(1 for rr in M.rel if rr['t'] == 'cen' and rr['a'] in (r['a'], r['b'])) == 2: continue
            old = M.chi2; q0 = M.pack(); new = M.solve(M.rel + [r]); dc = new - old; ok = dc < r['dof']*lnN
            tested.append(dict(t=r['t'], prims=[r['a']] + ([r['b']] if 'b' in r else []), dchi2=dc, dof=r['dof'], ok=bool(ok), note=r.get('name', '')))
            if ok: M.rel.append(r)
            else: M.unpack(q0); M.solve(M.rel)
    return M, chains, tested

def paths(M, chains, tested):
    """Each object's path: its primitives between their joins (tangent points or intersections), in mm."""
    tan = {frozenset((r['a'], r['b'])) for r in M.rel if r['t'] == 'tan'}; out = {}
    for c in chains:
        pr = c['prims']; X = M.X
        if c['full']:
            p = M.P[pr[0]]; out[c['obj']] = dict(closed=True, path=[dict(type='circle', c=p['q'][:2].round(4).tolist(), r=round(float(p['q'][2]), 4))]); continue
        n = len(pr); J = []
        for k in range(n - 1 + (1 if c['closed'] else 0)):
            a, b = M.P[pr[k]], M.P[pr[(k + 1) % n]]; near = X[a['idx'][-1]]
            J.append(junction(a, b, near, frozenset((pr[k], pr[(k + 1) % n])) in tan))
        if c['closed']: ends = [J[-1]] + J[:-1], J
        else: ends = [project(X[M.P[pr[0]]['idx'][0]], M.P[pr[0]]['q'], M.P[pr[0]]['t'])] + J, J + [project(X[M.P[pr[-1]]['idx'][-1]], M.P[pr[-1]]['q'], M.P[pr[-1]]['t'])]
        seg = []
        for k, (f, t) in enumerate(zip(*ends)):
            p = M.P[pr[k]]
            if p['t'] == 'L': seg.append(dict(type='line', prim=pr[k], frm=np.round(f, 4).tolist(), to=np.round(t, 4).tolist(), length=round(float(np.hypot(*(t - f))), 4))); continue
            cc = p['q'][:2]; a0 = math.atan2(f[1] - cc[1], f[0] - cc[0]); a1 = math.atan2(t[1] - cc[1], t[0] - cc[0])
            mid = X[p['idx'][len(p['idx'])//2]]; am = math.atan2(mid[1] - cc[1], mid[0] - cc[0])
            ccw = ((am - a0) % (2*math.pi)) < ((a1 - a0) % (2*math.pi)); sw = ((a1 - a0) % (2*math.pi)) if ccw else -((a0 - a1) % (2*math.pi))
            seg.append(dict(type='arc', prim=pr[k], c=np.round(cc, 4).tolist(), r=round(float(p['q'][2]), 4), frm=np.round(f, 4).tolist(), to=np.round(t, 4).tolist(), sweep_deg=round(math.degrees(sw), 3), kind=p['kind']))
        out[c['obj']] = dict(closed=c['closed'], path=seg)
    return out
def sample(path, tol=0.002):
    P = []
    for s in path['path']:
        if s['type'] == 'circle':
            n = max(24, int(math.ceil(2*math.pi/(2*math.acos(max(-1, 1 - tol/s['r'])))))); u = np.linspace(0, 2*math.pi, n, endpoint=False)
            return (np.c_[s['c'][0] + s['r']*np.cos(u), s['c'][1] + s['r']*np.sin(u)]).round(4).tolist()
        if s['type'] == 'line': P += [s['frm']] if not P else []; P.append(s['to']); continue
        c = np.array(s['c']); a0 = math.atan2(s['frm'][1] - c[1], s['frm'][0] - c[0]); sw = math.radians(s['sweep_deg'])
        da = 2*math.acos(max(-1, 1 - tol/s['r'])); n = max(2, int(math.ceil(abs(sw)/max(da, 1e-6)))); u = a0 + np.linspace(0, sw, n + 1)
        Q = np.c_[c[0] + s['r']*np.cos(u), c[1] + s['r']*np.sin(u)].tolist(); P += Q if not P else Q[1:]
    return np.round(P, 4).tolist()

def report(M, chains, tested, holes=None):
    S = M.sd(); L = [f'sigma (the trace\'s scatter, fitted): {M.sig:.4f} mm over {len(M.X)} points; chi2 {M.chi2:.1f}']
    for c in chains:
        L.append(f'\n{c["obj"]}' + (' (closed)' if c['closed'] else ''))
        for k in c['prims']:
            p = M.P[k]; e = dist(p['t'], p['q'], M.X[p['idx']]); rms = math.sqrt(np.mean(e**2)); sd = S[k]
            if p['t'] == 'L':
                th = math.degrees(p['q'][0]) + 90; L.append(f'  [{k}] line    dir {th % 180:7.3f} deg (sd {math.degrees(sd[0]) if sd is not None else 0:.3f})  n {len(e):3d}  rms {rms:.4f}  max {np.abs(e).max():.4f}')
            else:
                L.append(f'  [{k}] {p["kind"]:7s} c ({p["q"][0]:8.4f}, {p["q"][1]:8.4f}) r {p["q"][2]:8.4f}  sd c {np.hypot(*sd[:2]) if sd is not None else 0:.4f} r {sd[2] if sd is not None else 0:.4f}  n {len(e):3d}  rms {rms:.4f}  max {np.abs(e).max():.4f}')
                if p['kind'] in ('hole', 'circle'):
                    dr = drill_read(2*p['q'][2], 2*(sd[2] if sd is not None else M.sig)); L.append(f'          D {2*p["q"][2]:.4f} = {inch(2*p["q"][2])}')
                    L.append(f'          drill: {dr["unique"] or "not told apart"}; consistent with {", ".join(dr["consistent"]) or "none"}; nearest {dr["nearest"]}')
                    if holes:
                        nm, h = min(holes['holes'].items(), key=lambda kv: math.hypot(kv[1][0] - p['q'][0], kv[1][1] - p['q'][1]))
                        L.append(f'          model hole {nm} ({h[0]:.2f}, {h[1]:.2f}) r {h[2]:.3f}: off {math.hypot(h[0] - p["q"][0], h[1] - p["q"][1]):.3f} mm, r {p["q"][2] - h[2]:+.3f}')
                else: L.append(f'          r {inch(p["q"][2])}')
    L.append('\nrelations tested (kept when delta chi2 < dof ln n; a fillet when it lowers chi2 by more than ln n):')
    for t in tested: L.append(f'  {"KEPT " if t["ok"] else "     "} {t["t"]:6s} {t["prims"]}  dchi2 {t["dchi2"]:9.2f}  dof {t["dof"]:+d}  {t["note"]}')
    return '\n'.join(L)

def plot(M, P, out, title='', img=None, Hmm2px=None, mag=None):
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(12, 10)); e = np.concatenate([dist(p['t'], p['q'], M.X[p['idx']]) for p in M.P]) if M.P else np.zeros(1)
    mag = mag or 0.5/max(np.abs(e).max(), 1e-6)*0.1*max(np.ptp(M.X[:, 0]), np.ptp(M.X[:, 1]), 1)
    for k, p in enumerate(M.P):
        X = M.X[p['idx']]; d = dist(p['t'], p['q'], X)
        if p['t'] == 'L': n = np.tile(nrm(p['q'][0]), (len(X), 1))
        else: v = X - p['q'][:2]; n = v/np.maximum(np.hypot(*v.T), 1e-12)[:, None]
        F = X - d[:, None]*n; ax.plot(*np.array([F.T, (F + mag*d[:, None]*n).T]).transpose(1, 0, 2), color='#d33', lw=0.6)
        ax.plot(X[:, 0], X[:, 1], '.', ms=2.5, color='#333')
    for nm, pth in P.items():
        S = np.array(sample(pth, 0.005)); ax.plot(S[:, 0], S[:, 1], '-', lw=1.0, color='#16c' if pth['closed'] else '#1a6')
        for s in pth['path']:
            if s['type'] == 'arc': ax.plot(*s['c'], '+', color='#16c', ms=6); ax.annotate(f'r{s["r"]:.3f}', s['c'], fontsize=7, color='#16c')
            elif s['type'] == 'circle': ax.annotate(f'D{2*s["r"]:.3f}', s['c'], fontsize=7, color='#16c')
            if s['type'] != 'circle': ax.plot(*s['frm'], 'o', ms=3, mfc='none', color='#c80')
    ax.set_aspect('equal'); ax.invert_yaxis(); ax.set_title(f'{title}  (residuals x{mag:.0f}, red)', fontsize=9); ax.grid(alpha=0.2)
    fig.tight_layout(); fig.savefig(out, dpi=150); plt.close(fig)

def to_mm(objs, Hpx2mm):
    for o in objs:
        if o['mm'] is None and o['px'] is not None:
            H = o['Hm'] if o['Hm'] is not None else Hpx2mm
            o['mm'] = H_apply(H, o['px']) if H is not None else o['px'].copy()
def refine(objs, img, Hpx2mm, ch, win, cskip=7):
    """Replace each object's points by the edge found on the image (in px, then mm through its map)."""
    info = {}
    for o in objs:
        if o['px'] is None or len(o['px']) < 3: continue
        if o['kind'] == 'ellipse':
            Q, Nn = ellipse_samples(o['px']); skip = None
            if Q is None: continue
            r0 = np.median(np.hypot(*(Q - Q.mean(0)).T)); R, sd, c, blur, keep = refine_points(img, Q, Nn, max(win, 0.3*r0), ch, skip)
            if len(R) >= 12: Q, Nn = ellipse_samples(R)   # again from the edge found: a few traced points start it several px off
        else:
            Q, Nn = cr(o['px'], o['closed'], o['corners'], 1.0)
            C = o['px'][sorted(o['corners'])] if o['corners'] else np.zeros((0, 2)); skip = np.array([np.min(np.hypot(*(C - q).T)) < cskip if len(C) else False for q in Q])
        R, sd, c, blur, keep = refine_points(img, Q, Nn, win, ch, skip); o['corners0'] = set(o['corners'])
        if len(R) < max(5, 0.3*len(Q)): info[o['name']] = f'refinement kept {len(R)} of {len(Q)}: left as traced'; continue
        if o['kind'] != 'ellipse':   # a real edge's stray finds (a scratch, the wall's shadow, dust): off a sliding local circle by 3 MADs, twice
            for _ in range(2):
                e = np.zeros(len(R)); w = 12
                for i in range(len(R)):
                    W = R[max(0, i - w):i + w + 1]; q = fit_circle(W) if len(W) >= 5 else None
                    e[i] = abs(dist('C', q, R[i:i+1])[0]) if q is not None and q[2] < 1e5 else abs(dist('L', fit_line(W), R[i:i+1])[0])
                ok = e <= max(3*1.4826*np.median(e), 0.3)
                R, sd = R[ok], sd[ok]; idx = np.where(keep)[0]; keep[idx[~ok]] = False
        if o['kind'] != 'ellipse':   # where the image shows no clean edge over 25 px (not a corner's gap), the hand's own points there stand in, so no arc spans a gap unheld
            idx = np.where(keep)[0]; qi = np.array([int(np.argmin(np.hypot(*(Q - p).T))) for p in o['px']]); fq, fp = [], []
            for a0, b0 in zip(idx[:-1], idx[1:]):
                if b0 - a0 > 25 and not (skip is not None and skip[a0+1:b0].any()):
                    for k, q in enumerate(qi):
                        if a0 + 3 < q < b0 - 3: fq.append(q); fp.append(o['px'][k])
            if fq:
                allk = np.r_[idx, fq]; o_ = np.argsort(allk, kind='stable'); R = np.r_[R, np.array(fp)][o_]; sd = np.r_[sd, np.full(len(fq), np.nan)][o_]; keep[fq] = True
                info[o['name'] + ' (gaps)'] = f'{len(fq)} of the hand\'s points stand where the image showed no edge'
        if o['kind'] != 'ellipse' and blur:   # one point per two blurs: neighbours closer share their errors, and would count as independent evidence
            sel = [0]
            for i in range(1, len(R)):
                if np.hypot(*(R[i] - R[sel[-1]])) >= 2*blur: sel.append(i)
            idx = np.where(keep)[0]; m_ = np.zeros(len(R), bool); m_[sel] = True; keep[idx[~m_]] = False; R, sd = R[m_], sd[m_]
        H = o['Hm'] if o['Hm'] is not None else Hpx2mm; o['px_refined'] = R; o['blur'] = blur; o['mm'] = H_apply(H, R) if H is not None else R
        if o['kind'] != 'ellipse' and o['corners0']:   # the K corners stay as break points: in the gap the corner leaves, before the first kept sample past it
            idx = np.where(keep)[0]; o['corners'] = {int(np.searchsorted(idx, np.argmin(np.hypot(*(Q - o['px'][c]).T)))) % len(idx) for c in o['corners0']}; o['gapcut'] = True
        info[o['name']] = f'refined {len(R)} of {len(Q)} samples on {c}, edge sd median {np.nanmedian(sd) if np.isfinite(sd).any() else float('nan'):.3f} px, blur {blur:.2f} px'
    return info

def cmd_fit(a):
    def opt(k, d=None):
        if k in a: i = a.index(k); v = a[i + 1]; del a[i:i + 2]; return v
        return d
    flag = lambda k: (a.remove(k), True)[1] if k in a else False
    mp, imgp, ch, win, cal, link, cen, hol, sig, pl, only, out, png, floorpx = (opt(k, d) for k, d in [('--map', None), ('--image', None), ('--channel', 'auto'), ('--win', '6'), ('--calib', None), ('--link', None),
        ('--centres', None), ('--holes', None), ('--sigma', None), ('--plane', None), ('--only', None), ('--out', None), ('--png', None), ('--floor', '1.0')])
    nosnap = flag('--no-snap'); tr = a[0]; objs, imname = load_trace(tr, pl)
    if only: keep = set(only.split(',')); objs = [o for o in objs if o['name'] in keep]
    Hp = None; frame = 'px'
    if mp:
        m = json.load(open(mp, encoding='utf-8')); k = float(m['px_per_mm']); Hp = np.array([[1/k, 0, m['x0'] + 0.5/k], [0, 1/k, m['z0'] + 0.5/k], [0, 0, 1]]); frame = 'map'
        for o in objs: o['Hm'] = None if not o['h'] else o['Hm']
    if cal:
        hj = json.load(open(cal, encoding='utf-8')); Hp, rep = calibrate(objs, hj, link); frame = 'calib'
        print('calibration on the holes (circle-geometric): ' + '; '.join(f'{t}={h}: centre {d:.3f} mm, r {dr:+.3f}' for t, h, d, dr in rep if d is not None))
        for o in objs: o['Hm'] = None if not o['h'] else o['Hm']
    if frame == 'px' and any(o['Hm'] is not None for o in objs): frame = 'trace'
    if imgp:
        import cv2
        img = cv2.imread(imgp, cv2.IMREAD_UNCHANGED)
        if img is None: sys.exit(f'cannot read {imgp}')
        if img.ndim == 3 and img.shape[2] == 4: img = img[:, :, :3]
        for nm, s in refine(objs, img, Hp, ch, float(win)).items(): print(f'{nm}: {s}')
    rlim = 0.0
    if imgp:
        bl = [o['blur'] for o in objs if o.get('blur')]; Hs = Hp if Hp is not None else next((o['Hm'] for o in objs if o['Hm'] is not None), None)
        if bl and Hs is not None: J = Hs[:2, :2]/Hs[2, 2]; rlim = 2*float(np.median(bl))*math.sqrt(abs(np.linalg.det(J)))   # two blurs: a corner rounder than this the image can't show
    to_mm(objs, Hp); centres = centres_from(cen); holes = json.load(open(hol, encoding='utf-8')) if hol else None
    fl = float(floorpx)*rlim/(2*float(np.median([o['blur'] for o in objs if o.get('blur')]))) if rlim else 0.0   # the edge's accuracy on a real frame (compression, demosaicing, lens): --floor px
    M, chains, tested = run(objs, float(sig) if sig else None, centres, not nosnap, rlim=rlim, floor=fl); P = paths(M, chains, tested)
    if fl: print(f'edge accuracy floor {floorpx} px = {fl:.4f} mm')
    if rlim: print(f'resolution: arcs and fillets under r {rlim:.4f} mm (two blurs) are not drawn')
    print(f'{tr}: {len(objs)} objects, units mm ({frame})' if frame != 'px' else f'{tr}: no map to mm: units are pixels'); print(report(M, chains, tested, holes))
    out = out or re.sub(r'(\.trace|\.mm)?\.json$', '', tr) + '.mfg.json'; png = png or re.sub(r'\.mfg\.json$', '', out) + '_mfg.png'
    S = M.sd(); res = dict(tool='mfgfit', trace=os.path.basename(tr), image=imname, units='mm' if frame != 'px' else 'px', frame=frame, sigma=round(M.sig, 5), chi2=round(M.chi2, 2),
        prims=[dict(id=k, obj=p['obj'], kind=p['kind'], type='line' if p['t'] == 'L' else 'circle', q=np.round(p['q'], 5).tolist(), sd=None if S[k] is None else np.round(S[k], 5).tolist(),
                    n=len(p['idx']), rms=round(float(np.sqrt(np.mean(dist(p['t'], p['q'], M.X[p['idx']])**2))), 5)) for k, p in enumerate(M.P)],
        relations=[dict(t) for t in tested],
        objects={nm: dict(pth, polyline=sample(pth)) for nm, pth in P.items()})
    json.dump(res, open(out, 'w', encoding='utf-8', newline='\n'), indent=1); plot(M, P, png, os.path.basename(tr)); print(f'\n-> {out}\n-> {png}')

# ---------- demo ----------
def rounded_polygon(V, rho):
    """A machined outline: polygon V with a tangent arc of radius rho[i] at each vertex (0: sharp). -> primitives, dense true edge."""
    n = len(V); T = []
    for i in range(n):
        v, a, b = V[i], V[i-1], V[(i+1) % n]; u1 = (a - v)/np.hypot(*(a - v)); u2 = (b - v)/np.hypot(*(b - v)); al = math.acos(np.clip(u1 @ u2, -1, 1))/2
        if rho[i] == 0: T.append((v, v, None)); continue
        t = rho[i]/math.tan(al); bis = (u1 + u2)/np.hypot(*(u1 + u2)); c = v + bis*rho[i]/math.sin(al); T.append((v + u1*t, v + u2*t, c))
    prims = []; dense = []
    for i in range(n):
        p0, p1, c = T[i]
        if c is not None:
            a0 = math.atan2(*(p0 - c)[::-1]); a1 = math.atan2(*(p1 - c)[::-1]); d = (a1 - a0 + math.pi) % (2*math.pi) - math.pi
            prims.append(('C', c, rho[i])); u = a0 + np.linspace(0, d, max(3, int(abs(d)*rho[i]/0.005))); dense += list(np.c_[c[0] + rho[i]*np.cos(u), c[1] + rho[i]*np.sin(u)])
        q0 = p1; q1 = T[(i+1) % n][0]; L = np.hypot(*(q1 - q0)); prims.append(('L', q0, q1)); dense += list(q0 + np.outer(np.linspace(0, 1, max(2, int(L/0.005))), q1 - q0))
    return prims, np.array(dense)
def hand_trace(prims, rng, sig, corners_seen=0.8):
    """Points as a hand places them on the edge: spaced by the curve's tightness, scattered sig across it; K at the sharp corners."""
    pts, cor = [], []
    for k, p in enumerate(prims):
        if p[0] == 'L':
            q0, q1 = p[1], p[2]; L = np.hypot(*(q1 - q0)); n = max(2, int(L/rng.uniform(1.0, 2.0))); tt = np.sort(np.r_[0, rng.uniform(0.05, 0.95, n - 1)])
            nn = np.array([-(q1 - q0)[1], (q1 - q0)[0]])/L; prev = prims[k-1]
            for j, t in enumerate(tt):
                if j == 0 and prev[0] == 'L':   # a sharp corner: the hand puts a point on it, flagged K most times
                    pts.append(q0 + rng.normal(0, sig*0.5, 2)); cor.append(rng.random() < corners_seen); continue
                pts.append(q0 + t*(q1 - q0) + rng.normal(0, sig)*nn); cor.append(False)
        else:
            c, r = p[1], p[2]; i0 = len(pts)
            nxt = prims[(k+1) % len(prims)]; a0 = math.atan2(*(prims[k-1][2] - c)[::-1]); a1 = math.atan2(*(nxt[1] - c)[::-1]); d = (a1 - a0 + math.pi) % (2*math.pi) - math.pi
            n = max(3, int(abs(d)*r/(0.25 if r < 3 else 0.8))); u = a0 + d*np.sort(rng.uniform(0.02, 0.98, n))
            for x in u: rr = r + rng.normal(0, sig); pts.append(c + rr*np.array([math.cos(x), math.sin(x)])); cor.append(False)
    return np.array(pts), cor
def cmd_demo(a):
    import cv2
    pngdir = a[a.index('--png') + 1] if '--png' in a else None; rng = np.random.default_rng(21); K = 40.0; fails = []
    V = np.array([[0, 0], [20, 0], [26, 8], [20, 16], [4, 16], [0, 10]], float) + [2, 2]; rho = [0.5, 0, 6.0, 0.8, 0, 2.0]
    prims, dense = rounded_polygon(V, rho); Qc = next(p[1] for p in prims if p[0] == 'C' and p[2] == 6.0); Pthru = V[2] - (V[3] - V[2])
    HOLES = [('hA', Qc, 0.070*25.4), ('hB', np.array([12.0, 10.0]), 3/32*25.4), ('hC', np.array([7.0, 6.0]), 0.0465*25.4)]
    centres = {'Q': tuple(Qc), 'P': tuple(Pthru)}
    print('drawn: a hexagonal plate 26 x 16 mm, fillets r 0.5, 6.0 (about Q), 0.8, 2.0, two sharp corners, two parallel edges, one edge radial through P;')
    print('       holes ' + ', '.join(f'{n} D {d:.4f}' for n, c, d in HOLES) + ' (No. 50 concentric with the r 6 arc, 3/32 in, No. 56)')
    def check(M, P, tag, tolr, tolc, strict):
        arcs = [M.P[s['prim']] for s in P['outline']['path'] if s['type'] == 'arc']; lines = [s for s in P['outline']['path'] if s['type'] == 'line']
        want = sorted(r for r in rho if r); got = sorted(round(float(p['q'][2]), 3) for p in arcs)
        print(f'[{tag}] outline: {len(lines)} lines, arcs r {got} (drawn {want})')
        if len(lines) != 6: fails.append(f'{tag}: {len(lines)} lines, drawn 6')
        big = [p for p in arcs if abs(p['q'][2] - 6) < 0.5]
        if not big or np.hypot(*(big[0]['q'][:2] - Qc)) > tolc or abs(big[0]['q'][2] - 6) > tolr: fails.append(f'{tag}: the r 6 arc not recovered')
        for r in (want if strict else [r for r in want if r > 2.5]):   # a hand's 3-4 points on a fillet turning 34-90 deg can't tell it from a corner
            if not any(abs(p['q'][2] - r) < max(tolr, 0.15*r) for p in arcs): fails.append(f'{tag}: arc r {r} missing')
        rels = [(t['t'], t['ok']) for t in M_tested[tag]]
        if ('par', True) not in rels: fails.append(f'{tag}: the parallel edges not found')
        if ('cen', True) not in rels and ('conc', True) not in rels: fails.append(f'{tag}: the r 6 arc not concentric with Q or its hole')
        if sum(1 for t, ok in rels if t in ('tan', 'fillet') and ok) < (6 if strict else 2): fails.append(f'{tag}: too few tangencies kept')
        for n, c, d in HOLES:
            k = next(k for k, p in enumerate(M.P) if p['obj'] == n); p = M.P[k]
            e = np.hypot(*(p['q'][:2] - c)); dr = drill_read(2*p['q'][2], 2*(M.sd()[k][2]))
            print(f'[{tag}] {n}: centre off {e:.4f} mm, D {2*p["q"][2]:.4f} (drawn {d:.4f}); drill {dr["unique"] or "not told apart"}; consistent {len(dr["consistent"])}')
            if e > tolc: fails.append(f'{tag}: {n} centre {e:.3f} off')
            if abs(2*p['q'][2] - d) > max(tolr, 4*2*M.sd()[k][2]): fails.append(f'{tag}: {n} diameter {2*p["q"][2]:.4f}')
            if dr['unique'] and abs(dr['D_std'] - d) > 1e-3: fails.append(f'{tag}: {n} read as {dr["unique"]}, drawn {d:.4f}')
        # the fitted path against the drawn edge
        S = np.array(sample(P['outline'], 0.002)); from scipy.spatial import cKDTree; dd = cKDTree(dense).query(S)[0]
        print(f'[{tag}] the fitted outline against the drawn edge: rms {np.sqrt(np.mean(dd**2)):.4f} mm, max {dd.max():.4f}')
        if dd.max() > 3*tolc: fails.append(f'{tag}: outline {dd.max():.3f} off the drawn edge')
    M_tested = {}
    # 1. the hand's points alone (sigma 0.04 mm, as the owner's good traces)
    pts, cor = hand_trace(prims, rng, 0.04)
    objs = [dict(name='outline', kind='curve', closed=True, h=0, px=None, corners={i for i, c in enumerate(cor) if c}, Hm=None, mm=pts)]
    for n, c, d in HOLES:
        u = np.sort(rng.uniform(0, 2*math.pi, 8)); r = d/2 + rng.normal(0, 0.03, 8); objs.append(dict(name=n, kind='ellipse', closed=True, h=0, px=None, corners=set(), Hm=None, mm=np.c_[c[0] + r*np.cos(u), c[1] + r*np.sin(u)]))
    M, ch, M_tested['hand'] = run(objs, None, centres); P = paths(M, ch, M_tested['hand'])
    print(report(M, ch, M_tested['hand'])); check(M, P, 'hand', 0.12, 0.12, False)
    if pngdir: os.makedirs(pngdir, exist_ok=True); plot(M, P, os.path.join(pngdir, 'demo_hand.png'), 'demo: hand trace')
    # 2. the same plate rendered (40 px/mm, blurred 1.2 px, noise), the hand's points 2 px off, refined onto the image
    W, Hh = int(32*K), int(22*K); ss = 8; big = np.full((Hh*ss, W*ss), 60, np.uint8)
    cv2.fillPoly(big, [np.round((dense*K*ss - 0.5)*16).astype(np.int32)], 190, cv2.LINE_8, 4)   # big pixel centres at mm*K*ss - 0.5, to 1/16
    for n, c, d in HOLES: cv2.circle(big, tuple(int(v) for v in np.round((c*K*ss - 0.5)*16)), int(round(d/2*K*ss*16)), 60, -1, cv2.LINE_8, 4)
    img = cv2.resize(big, (W, Hh), interpolation=cv2.INTER_AREA).astype(float); img = cv2.GaussianBlur(img, (0, 0), 1.2) + rng.normal(0, 3, img.shape)
    img = np.clip(img, 0, 255).astype(np.uint8); img = cv2.merge([img, img, img])
    Hp = np.array([[1/K, 0, 0.5/K], [0, 1/K, 0.5/K], [0, 0, 1]])   # px -> mm: the image's own map (pixel centres at integers)
    pts2, cor2 = hand_trace(prims, rng, 0.05)
    o2 = [dict(name='outline', kind='curve', closed=True, h=0, px=pts2*K - 0.5, corners={i for i, c in enumerate(cor2) if c}, Hm=None, mm=None)]
    for n, c, d in HOLES:
        u = np.sort(rng.uniform(0, 2*math.pi, 6)); r = d/2 + rng.normal(0, 0.05, 6); o2.append(dict(name=n, kind='ellipse', closed=True, h=0, px=np.c_[c[0] + r*np.cos(u), c[1] + r*np.sin(u)]*K - 0.5, corners=set(), Hm=None, mm=None))
    for nm, s in refine(o2, img, Hp, 'auto', 6).items(): print(f'[image] {nm}: {s}')
    from scipy.spatial import cKDTree
    E = cKDTree(dense).query(o2[0]['mm'])[0]; print(f'[image] refined edge points against the drawn edge: rms {np.sqrt(np.mean(E**2))*K:.3f} px ({np.sqrt(np.mean(E**2)):.4f} mm), the hand\'s: {np.sqrt(np.mean(cKDTree(dense).query(pts2)[0]**2)):.4f} mm')
    if np.sqrt(np.mean(E**2))*K > 0.35: fails.append(f'image: refined edge rms {np.sqrt(np.mean(E**2))*K:.2f} px')
    to_mm(o2, Hp); M2, ch2, M_tested['image'] = run(o2, None, centres, rlim=2*o2[0]['blur']/K, floor=0.1/K); P2 = paths(M2, ch2, M_tested['image'])
    print(report(M2, ch2, M_tested['image'])); check(M2, P2, 'image', 0.02, 0.02, True)
    if pngdir: plot(M2, P2, os.path.join(pngdir, 'demo_image.png'), 'demo: refined on the image'); cv2.imwrite(os.path.join(pngdir, 'demo_image_render.png'), img)
    print('\n' + ('FAIL\n  ' + '\n  '.join(fails) if fails else 'ok: the demo plate is recovered from the hand trace and from the image'))
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] not in ('fit', 'demo'): sys.exit(__doc__)
    (cmd_fit if a[0] == 'fit' else cmd_demo)(a[1:])
