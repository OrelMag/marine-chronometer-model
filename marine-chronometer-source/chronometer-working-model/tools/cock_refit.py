"""The balance cock's top face re-fitted (25 October 2026; PROVENANCE 108-1b, 108-1c): the owner's hand trace on KLUwI2UUCMQ 41:58 (traces/cock_41-58.mm.json, the frame
cropped at x 700, y 50: $MC_VIDEO/oq/cockfix2/clean/rim/cock_KLUwI2UUCMQ_41-58.png) put on the cock's top through a homography fitted on its holes at their places now (the
cock screw's counterbore at CK_Q, the setting at L.B, the cap's screws 3.33 either side, the stud's row 5.0, 8.4, 12.3 from the staff) and its rim held to r 38.8; then the
whole cock turned about the staff by CK_TURN so that its straight edge stands against the barrel bridge's measured horn (BB circle r 35.15 about (10.69, 39.43)), 0.05 clear.

Why the turn: with the cock's near holes and rim alone placing it, 41:58, 6:29 (fitted here on the cap's screws, the stud's holes and the rim) and the top-view photograph
(another chronometer, a similarity on the same) put the counterbore 30.0-33.5 deg about the staff, 25.7-26.3 mm out, where CK_Q (the train bridge's tapped hole, 23:30,
13:49.5, Jd2c3x8VKsE 26:00) is 35.6 deg; held at CK_Q the re-fitted cock leaves 1.7-2.8 mm between its straight edge and the horn, which the top-view photograph shows as a
hairline seam. The owner's choice (25 October 2026): the cock meets the horn.

  python cock_refit.py              # the fits, the turn and the outlines, printed
  python cock_refit.py --write      # also writes CK_TURN, CK_TR, COCK_POLY, CK_SP into js/movement.js
  python cock_refit.py --check      # 6:29 and the top-view photograph's fits only (the cross-checks)
About 5 s."""
import json, os, re, sys, numpy as np, cv2
from scipy.optimize import least_squares, brentq
from scipy.ndimage import map_coordinates, gaussian_filter1d
D = os.path.dirname(os.path.abspath(__file__)); MV = os.path.join(D, '..', 'js', 'movement.js')
VID = os.environ.get('MC_VIDEO', r'E:\mc-video')
IMG = os.path.join(VID, 'oq', 'cockfix2', 'clean', 'rim', 'cock_KLUwI2UUCMQ_41-58.png'); TRACE = os.path.join(D, 'traces', 'cock_41-58.mm.json')
RR = 38.8; BBC, BBR = np.array([10.69, 39.43]), 35.15; CLEAR = 0.05
# ---------- the holes at their places before the turn (movement.js: L.B, CK_Q, EPa, SPH; checked against the file below) ----------
D2R = np.pi/180; K, TU, T0 = 1.039, 19.42*D2R, np.array([-3.891, 0.879])
PT = lambda p: np.array([K*(p[0]*np.cos(TU) - p[1]*np.sin(TU)) + T0[0], K*(p[0]*np.sin(TU) + p[1]*np.cos(TU)) + T0[1]])
ry = lambda a, q: np.array([q[0]*np.cos(a) + q[1]*np.sin(a), -q[0]*np.sin(a) + q[1]*np.cos(a)])
LB = np.array([1.609, 10.277]); CKQ = np.array([22.01, 24.87]); Q0 = PT([33.11, 12.62]); EPa = np.arctan2(-0.24, -5.83) - TU
sd = (Q0 - LB)/np.linalg.norm(Q0 - LB); sn = np.array([-sd[1], sd[0]]); SPH = lambda a, c: LB + a*sd + c*sn
HOLES = {'cb': (CKQ, 3.7), 'set': (LB, 2.2), 'capN': (LB + ry(EPa, [3.33, 0]), 0.445), 'capF': (LB + ry(EPa, [-3.33, 0]), 0.445),
         'SPHc': (SPH(2.004, -4.581), 0.3), 'SPHb': (SPH(5.469, -6.375), 0.346), 'SPHa': (SPH(9.125, -8.247), 0.3)}
def checkfile(src):
    m = re.search(r'const L=\{[^}]*B:\[([-\d.]+),([-\d.]+)\]', src); assert np.allclose([float(m.group(1)), float(m.group(2))], LB), 'L.B moved'
    m = re.search(r'CK_Q=ckT\(\[([-\d.]+),([-\d.]+)\]\)', src); assert np.allclose([float(m.group(1)), float(m.group(2))], CKQ), 'CK_Q moved'
    assert 'SPH(2.004,-4.581),SPHb=SPH(5.469,-6.375),SPHa=SPH(9.125,-8.247)' in src, 'the stud row moved'
# ---------- 41:58: the holes on the frame (crop px) ----------
# the counterbore's rim (the brass face's edge round the bore) and the setting's centre (the sink round its gilt), read on 3x and 5x gridded enlargements (+-3 px, 0.08 mm);
# the cap's screw holes and the stud's three snapped on the frame (the strongest step along 120 rays round the owner's three points, an ellipse fitted robustly)
CB4158 = np.array([(440, 423), (431, 463), (440, 507), (463, 547), (497, 577), (537, 607), (570, 625), (617, 633), (650, 627), (673, 607), (683, 580), (667, 463), (643, 440),
                   (610, 417), (560, 398), (520, 393), (483, 400), (460, 407)], float)
SET4158 = np.array([1445., 732.]); SMALL = [('hole5', 'capF'), ('hole7', 'capN'), ('hole4', 'SPHc'), ('hole2', 'SPHb'), ('hole3', 'SPHa')]
# ---------- 6:29 (KLUwI2UUCMQ, 4K frame px; the cock in place from its straight edge) and the top-view photograph (References/photo-top-view.jpg, full px) ----------
P629 = {'capN': (1542.3, 541.7), 'capF': (1723.3, 538.3), 'SPHc': (1718, 641), 'SPHb': (1826, 655), 'SPHa': (1935, 669)}
CB629 = np.array([(2190, 400), (2280, 322), (2385, 400), (2280, 470), (2207.5, 350), (2360, 342.5), (2210, 440), (2355, 450)], float)
RIM629 = np.array([(2048, 100), (2140, 155), (2240, 220), (2340, 295), (2440, 400), (2480, 463), (2500, 500), (2523, 537), (2543, 573)], float); CORNER629 = np.array([2558.3, 625.0])
PTV = {'set': (1018, 978), 'capN': (1075, 965), 'capF': (961, 983), 'SPHc': (958, 930), 'SPHb': (891, 931), 'SPHa': (821, 930)}; CBTV = np.array([617, 1174.])
RIMTV = np.array([(422, 1005), (450, 1075), (485, 1150), (525, 1220), (580, 1290)], float); CORNERTV = np.array([422, 1000.])

def Hap(H, P): P = np.atleast_2d(np.asarray(P, float)); Y = np.c_[P, np.ones(len(P))] @ H.T; return Y[:, :2]/Y[:, 2:]
def circ(X):
    A = np.c_[2*X, np.ones(len(X))]; x = np.linalg.lstsq(A, (X**2).sum(1), rcond=None)[0]; c = x[:2]; r = np.sqrt(x[2] + c@c); return c, r, np.sqrt(np.mean((np.hypot(*(X - c).T) - r)**2))
ang = lambda p, o=np.zeros(2): np.degrees(np.arctan2(p[1] - o[1], p[0] - o[0]))
def snap(g, P):
    """a small hole's edge: the strongest step along 120 rays round the circle through the owner's three points, kept near a robust ellipse"""
    A = np.c_[2*P, np.ones(3)]; x = np.linalg.solve(A, (P**2).sum(1)); c = x[:2]; R = np.sqrt(x[2] + c@c); pts = []
    for th in np.linspace(0, 2*np.pi, 120, endpoint=False):
        rr = np.linspace(0.5*R, 1.5*R, 200); xx = c[0] + rr*np.cos(th); yy = c[1] + rr*np.sin(th); v = gaussian_filter1d(map_coordinates(g, [yy, xx], order=1), 1.5)
        k = np.argmax(np.abs(np.gradient(v))); pts.append([xx[k], yy[k]])
    pts = np.array(pts, np.float32)
    for _ in range(3):
        e = cv2.fitEllipse(pts); r = np.hypot(*(pts - np.array(e[0])).T); pts = pts[np.abs(r - np.median(r)) < max(2, 2.5*np.median(np.abs(r - np.median(r))))]
    return pts.astype(float)
def fit(pts, cb, rim, w_rim=1.0, use_cb=True, set_c=None):
    """a homography frame px -> mm: the near holes' centres (circles fitted to their mapped edges), the counterbore's rim held to r 3.7 about CK_Q, the rim to r 38.8 about the centre"""
    keys = list(pts); src = [np.atleast_2d(pts[k]).mean(0) for k in keys] + [cb.mean(0)]; dst = [HOLES[k][0] for k in keys] + [CKQ]
    if set_c is not None: src.append(set_c); dst.append(LB)
    H0 = cv2.findHomography(np.array(src), np.array(dst), 0)[0]
    def cen(Q): return Q.mean(0) if len(Q) < 3 else circ(Q)[0]
    def res(x):
        H = np.r_[x, 1].reshape(3, 3); o = [(cen(Hap(H, np.atleast_2d(pts[k]))) - HOLES[k][0])/0.15 for k in keys]
        if set_c is not None: o.append((Hap(H, set_c)[0] - LB)/0.15)
        if use_cb: o.append((np.hypot(*(Hap(H, cb) - CKQ).T) - 3.7)/0.13)
        o.append(w_rim*(np.hypot(*Hap(H, rim).T) - RR)/0.15); return np.concatenate(o)
    r = least_squares(res, (H0/H0[2, 2]).ravel()[:8], loss='soft_l1', x_scale='jac'); H = np.r_[r.x, 1].reshape(3, 3)
    rep = {k: float(np.hypot(*(cen(Hap(H, np.atleast_2d(pts[k]))) - HOLES[k][0]))) for k in keys}
    if set_c is not None: rep['set'] = float(np.hypot(*(Hap(H, set_c)[0] - LB)))
    c = circ(Hap(H, cb))[0]; rr = np.hypot(*Hap(H, rim).T)
    return H, rep, c, rr
def similarity(pts, refl=True):
    """the top-view photograph: nearly overhead, a similarity (mirrored: its y runs down) on the near holes with the rim at r 38.8"""
    def T(x, Q): Q = np.atleast_2d(np.asarray(Q, float))*[1, -1]; s, a, tx, ty = x; c, sn_ = np.cos(a), np.sin(a); return np.c_[s*(c*Q[:, 0] - sn_*Q[:, 1]) + tx, s*(sn_*Q[:, 0] + c*Q[:, 1]) + ty]
    res = lambda x: np.concatenate([T(x, pts[k])[0] - HOLES[k][0] for k in pts] + [np.hypot(*T(x, RIMTV).T) - RR])
    x = least_squares(res, [1/17, 0, 0, 0]).x; return (lambda Q: T(x, Q)), 1/x[0]

def crosschecks():
    print('the cock placed by its near holes and rim alone (the counterbore free), each picture:')
    g = cv2.cvtColor(cv2.imread(IMG), cv2.COLOR_BGR2GRAY).astype(float); J = json.load(open(TRACE, encoding='utf-8'))['planes']['Face']['traces']; E1 = np.array(J['edge1']['points_px'], float)
    pts = {h: snap(g, np.array(J[t]['points_px'], float)) for t, h in SMALL}
    for nm, (p, cb, rim, corner, s_c) in {'41:58': (pts, CB4158, E1[27:], E1[0], SET4158), '6:29': ({k: np.array(v, float) for k, v in P629.items()}, CB629, RIM629, CORNER629, None)}.items():
        H, rep, c, rr = fit(p, cb, rim, use_cb=False, set_c=s_c); k = Hap(H, corner)[0]
        print(f'  {nm}: holes {" ".join(f"{q} {v:.2f}" for q, v in rep.items())} mm; counterbore {np.hypot(*(c - LB)):.2f} from the staff at {ang(c, LB):.1f} deg (CK_Q {ang(CKQ, LB):.1f});'
              f' corner {ang(k):.2f} deg on the rim; rim r {rr.mean():.2f} +-{rr.std():.2f}')
    f, s = similarity(PTV); c = f(CBTV)[0]; k = f(CORNERTV)[0]
    print(f'  top-view photograph ({s:.2f} px/mm): holes {" ".join(f"{q} {np.hypot(*(f(v)[0] - HOLES[q][0])):.2f}" for q, v in PTV.items())} mm; counterbore {np.hypot(*(c - LB)):.2f} at {ang(c, LB):.1f} deg; corner {ang(k):.2f} deg')
    t = np.linspace(-np.pi, 0, 200001); P = BBC + BBR*np.c_[np.cos(t), np.sin(t)]; i = np.argmin(np.abs(np.hypot(*P.T) - RR) + (P[:, 0] < 0)*99)
    print(f'  the barrel bridge\'s measured horn meets the rim at {ang(P[i]):.2f} deg')
    return g, J, E1, pts

def catmull(P, n=24, a=0.5):
    P = np.asarray(P, float); P = np.r_[[2*P[0] - P[1]], P, [2*P[-1] - P[-2]]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i-1:i+3]; t0 = 0; t1 = t0 + np.hypot(*(p1 - p0))**a; t2 = t1 + np.hypot(*(p2 - p1))**a; t3 = t2 + np.hypot(*(p3 - p2))**a
        for t in np.linspace(t1, t2, n, endpoint=False):
            A1 = (t1 - t)/(t1 - t0)*p0 + (t - t0)/(t1 - t0)*p1; A2 = (t2 - t)/(t2 - t1)*p1 + (t - t1)/(t2 - t1)*p2; A3 = (t3 - t)/(t3 - t2)*p2 + (t - t2)/(t3 - t2)*p3
            B1 = (t2 - t)/(t2 - t0)*A1 + (t - t0)/(t2 - t0)*A2; B2 = (t3 - t)/(t3 - t1)*A2 + (t - t1)/(t3 - t1)*A3; out.append((t2 - t)/(t2 - t1)*B1 + (t - t1)/(t2 - t1)*B2)
    out.append(P[-2]); return np.array(out)
def arclen(P): return np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]
def resample(P, n): s = arclen(P); t = np.linspace(0, s[-1], n); return np.c_[np.interp(t, s, P[:, 0]), np.interp(t, s, P[:, 1])]
turn = lambda P, d: LB + (np.atleast_2d(P) - LB) @ np.array([[np.cos(d), np.sin(d)], [-np.sin(d), np.cos(d)]])   # by d (radians) about the staff, the movement frame's sense (x toward z)
def to_rim(P, first):
    Q = P[:int(np.argmax(arclen(P) > 3)) + 1] if first else P[::-1][:int(np.argmax(arclen(P[::-1]) > 3)) + 1]
    p = Q[0]; d = Q[0] - Q[-1]; d /= np.hypot(*d); f = lambda t: np.hypot(*(p + t*d)) - RR
    return p + brentq(f, -6, 6)*d if f(-6)*f(6) < 0 else p
def dense(P, step=0.02):
    s = arclen(P); t = np.arange(0, s[-1], step); return np.c_[np.interp(t, s, P[:, 0]), np.interp(t, s, P[:, 1])]
def two_runs(P, say=False):
    """the straight edge from the corner to the nose: one circle, or two runs (each a circle within 0.1 mm rms, the hand trace's scatter) meeting where the circles cross nearest the break, 22 points"""
    c, r, e = circ(P)
    if e <= 0.08:
        if say: print(f'  straight edge: one circle r {r:.3f} about ({c[0]:.3f}, {c[1]:.3f}), {e:.3f} mm rms')
        return as_circle(P, '', say=False)[0](22)
    best = None
    for k in range(5, len(P) - 5):
        a, b = circ(P[:k + 1]), circ(P[k:]); m = max(a[2], b[2])
        if best is None or m < best[0]: best = (m, k, a, b)
    m, k, (c1, r1, e1), (c2, r2, e2) = best
    if m > 0.1:   # the hand trace's own scatter (about 0.1 mm rms)
        if say: print(f'  straight edge: no two circles within 0.1 ({m:.3f}): the traced curve')
        return resample(P, 22)
    d = c2 - c1; L_ = np.hypot(*d); x = (L_**2 + r1**2 - r2**2)/(2*L_); h = np.sqrt(max(r1**2 - x**2, 0)); u = d/L_; n = np.array([-u[1], u[0]])
    J = min([c1 + x*u + h*n, c1 + x*u - h*n], key=lambda q: np.hypot(*(q - P[k])))
    def arc(c, r, p, q, n_):
        a0 = np.arctan2(*(p - c)[::-1]); a1 = a0 + ((np.arctan2(*(q - c)[::-1]) - a0 + np.pi) % (2*np.pi) - np.pi); t = np.linspace(a0, a1, n_); return c + r*np.c_[np.cos(t), np.sin(t)]
    if say: print(f'  straight edge: two runs, the outer a circle r {r1:.3f} about ({c1[0]:.3f}, {c1[1]:.3f}), {e1:.3f} mm rms, the inner r {r2:.3f} about ({c2[0]:.3f}, {c2[1]:.3f}), {e2:.3f} rms, meeting at ({J[0]:.2f}, {J[1]:.2f})')
    return np.r_[arc(c1, r1, P[0], J, 11), arc(c2, r2, J, P[-1], 12)[1:]]
def as_circle(P, name, end_on_rim=False, say=True):
    c, r, e = circ(P)
    if e <= 0.08:
        a = np.unwrap(np.arctan2(P[:, 1] - c[1], P[:, 0] - c[0]))
        if end_on_rim: a = np.r_[a[:-1], brentq(lambda t: np.hypot(*(c + r*np.array([np.cos(t), np.sin(t)]))) - RR, a[-1] - 0.3, a[-1] + 0.3)]
        if say: print(f'  {name}: a circle r {r:.3f} about ({c[0]:.3f}, {c[1]:.3f}), {e:.3f} mm rms: built as it')
        return (lambda n: c + r*np.c_[np.cos(np.linspace(a[0], a[-1], n)), np.sin(np.linspace(a[0], a[-1], n))]), (c, r, e)
    if say: print(f'  {name}: no circle within 0.08 ({e:.3f} rms, r {r:.1f}): the traced curve')
    return (lambda n: resample(P, n)), None

def main():
    a = sys.argv[1:]; src = open(MV, encoding='utf-8').read(); checkfile(src)
    g, J, E1, pts = crosschecks()
    if '--check' in a: return
    H, rep, c, rr = fit(pts, CB4158, E1[27:], set_c=SET4158)
    print(f'41:58 on the holes at their places and the rim: {" ".join(f"{q} {v:.2f}" for q, v in rep.items())}, counterbore {np.hypot(*(c - CKQ)):.2f} mm; rim r {rr.mean():.2f} +-{rr.std():.2f}')
    top0 = Hap(H, catmull(E1[:28]))   # the corner, along the straight edge, round the nose, down the concave edge to the tip, at the holes' places before the turn
    # the turn: the straight edge (x past the cut round the balance, 21.7) 0.05 clear of the horn's circle at its nearest
    se_ = lambda P: P[(P[:, 0] > 21.7) & (np.arange(len(P)) < np.argmax(P[:, 0] < 5.5))]
    clear = lambda d: (BBR - np.hypot(*(se_(turn(top0, d)) - BBC).T)).min()
    d = brentq(lambda d: clear(d) - CLEAR, -12*D2R, 0); print(f'the turn about the staff: {d/D2R:.3f} deg (the corner {np.hypot(*(turn(top0[:1], d)[0] - top0[0])):.2f} mm); clearance before it {clear(0):.2f}')
    def build(d, say=False):
        top = turn(top0, d)
        i_se = np.argmax(top[:, 0] < 5.5); rest = top[i_se:]; i_no = np.argmax((rest[:, 1] > 15.2) & (np.r_[0, np.diff(rest[:, 1])] > 0) & (rest[:, 0] > rest[:, 0].min() - 0.01))
        SE = top[:i_se + 1]; NO = rest[:i_no + 1]; CE = rest[i_no:]
        corner = to_rim(SE, True); tip = to_rim(CE, False); SEi = SE[1:][np.hypot(*SE[1:].T) < RR - 0.05]
        if say: print(f'  corner ({corner[0]:.2f}, {corner[1]:.2f}) at {ang(corner):.2f} deg, tip ({tip[0]:.2f}, {tip[1]:.2f}) at {ang(tip):.2f} deg')
        se = two_runs(np.r_[[corner], SEi], say); no, _ = as_circle(NO, 'nose', say=say); ce, _ = as_circle(np.r_[CE[:-1], [tip]], 'concave edge', True, say=say)
        return np.r_[se, no(18)[1:18], ce(23)[1:23]]
    gapmin = lambda CK: (lambda s_: (BBR - np.hypot(*(s_[s_[:, 0] > 21.7] - BBC).T)).min())(dense(CK[:22]))
    d = brentq(lambda dd: gapmin(build(dd)) - CLEAR, d - 2*D2R, d + 2*D2R); print(f'  on the outline as built: {d/D2R:.3f} deg')
    CK = build(d, True); assert len(CK) == 61
    s_ = dense(CK[:22]); gap = BBR - np.hypot(*(s_[s_[:, 0] > 21.7] - BBC).T); print(f'  the straight edge against the horn circle: {gap.min():.3f}-{gap.max():.3f} mm clear over x 21.7-{s_[:, 0].max():.1f}')
    a0 = np.arctan2(CK[-1][1], CK[-1][0]) - 0.3*D2R; a1 = np.arctan2(CK[0][1], CK[0][0]) + 0.4*D2R; t = np.linspace(a0, a1, 31); CP = RR*np.c_[np.cos(t), np.sin(t)]
    # the arm's step (CK_SP): 41:58's polished band's step, (8.4, 22.1) through the 18 October homography, back to its pixel and through this one; 44:02's, the step at x 2307.5 on the
    # stud's row (its holes at 1780, 1997, 2207) by a 1-D projective map on their places now (0, 3.4, 7.3 mm along the row)
    m = {k: v[0] for k, v in HOLES.items()}
    Hold = cv2.findHomography(np.array([c3(np.array(J[t_]['points_px'], float)) for t_, _ in OLDPAIRS]), np.array([OLDHOLES[h] for _, h in OLDPAIRS]), 0)[0]
    p4158 = Hap(H, Hap(np.linalg.inv(Hold), [8.4, 22.1]))[0]
    row = [m['SPHc'], m['SPHb'], m['SPHa']]; u = (row[2] - row[0])/np.hypot(*(row[2] - row[0])); s = [0.0, float((row[1] - row[0])@u), float((row[2] - row[0])@u)]
    px = np.array([1780., 1997., 2207.]); A = np.c_[px, np.ones(3), -px*np.array(s)]; ab = np.linalg.solve(A, np.array(s)); x = 2307.5; dd = (ab[0]*x + ab[1])/(ab[2]*x + 1)
    p4402 = row[0] + dd*u; SP = turn(np.array([p4402, p4158]), d)
    print(f'  the arm\'s step: 44:02 {dd:.2f} mm past the inner hole, 41:58 ({p4158[0]:.2f}, {p4158[1]:.2f}); turned: {np.round(SP, 2).tolist()}')
    if '--overlay' in a: overlay(H, turn(np.r_[CP, CK], -d), turn(BBC + BBR*np.c_[np.cos(np.linspace(-1.95, -1.1, 200)), np.sin(np.linspace(-1.95, -1.1, 200))], -d))
    if '--write' in a:
        fmt =lambda V: '[' + ', '.join(f'[{x:.2f}, {z:.2f}]' for x, z in V) + ']'
        for nm, V in (('CK_TR', CK), ('COCK_POLY', CP)):
            mm = re.search(r'const ' + nm + r'=(\[\[.*?\]\])', src, re.S); old = np.array(json.loads(mm.group(1)))
            print(f'  {nm}: moved {np.median(np.hypot(*(old - V).T)):.2f} mm median, {np.hypot(*(old - V).T).max():.2f} at most'); src = src[:mm.start(1)] + fmt(V) + src[mm.end(1):]
        src = re.sub(r'const CK_SP=\[\[[-\d.,\[\] ]*?\]\]', 'const CK_SP=' + json.dumps(np.round(SP, 2).tolist()).replace(' ', ''), src, count=1)
        src = re.sub(r'CK_TURN=[-\d.]+\*D2R', f'CK_TURN={d/D2R:.3f}*D2R', src, count=1)
        open(MV, 'w', encoding='utf-8', newline='\n').write(src); print('wrote', MV)
def overlay(H, OUT, HORN):
    """the outline as built (COCK_POLY then CK_TR, turned back into the frame its holes were fitted in) drawn in red on 41:58, 6:29 and the top-view photograph, each through its
    own fit; on the photograph also the barrel bridge's horn circle (green; at the bridge's face, 10.8 mm under the cock's top, so a few % small there): r_cock_refit_*.png"""
    pl = lambda im, P, col, w=2: cv2.polylines(im, [np.round(P).astype(np.int32)], False, col, w, cv2.LINE_AA)
    im = cv2.imread(IMG); pl(im, Hap(np.linalg.inv(H), OUT), (0, 0, 255)); cv2.imwrite('r_cock_refit_4158.png', im)
    H6 = fit({k: np.array(v, float) for k, v in P629.items()}, CB629, RIM629)[0]
    im = cv2.imread(os.path.join(VID, 'frames', 'f_KLUwI2UUCMQ_6-29.png')); pl(im, Hap(np.linalg.inv(H6), OUT), (0, 0, 255)); cv2.imwrite('r_cock_refit_629.png', im[0:900, 1400:2700])
    f, _ = similarity(PTV); A = np.array([[0., 0.], [1000., 0.], [0., 1000.]]); B = f(A); M = np.linalg.lstsq(np.c_[B, np.ones(3)], A, rcond=None)[0]; inv = lambda P: np.c_[P, np.ones(len(P))] @ M
    im = cv2.imread(os.path.join(D, '..', '..', '..', 'References', 'photo-top-view.jpg')); pl(im, inv(OUT), (0, 0, 255)); pl(im, inv(HORN), (0, 200, 0)); cv2.imwrite('r_cock_refit_tv.png', im[700:1400, 250:1250])
    print('wrote r_cock_refit_4158.png, r_cock_refit_629.png, r_cock_refit_tv.png')
# the 18 October fit's holes (cockfix/owner4158.py: the counterbore at CK_Q0, the stud's row as 6:29 read it), to carry CK_SP's 41:58 point off it
def c3(P): A = np.c_[2*P, np.ones(3)]; x = np.linalg.solve(A, (P**2).sum(1)); return x[:2]
OLDPAIRS = [('hole1', 'cb'), ('hole6', 'set'), ('hole5', 'capF'), ('hole7', 'capN'), ('hole4', 'SPHc'), ('hole2', 'SPHb'), ('hole3', 'SPHa')]
OLDHOLES = {'cb': Q0, 'set': LB, 'capN': LB + ry(EPa, [3.33, 0]), 'capF': LB + ry(EPa, [-3.33, 0]), 'SPHc': np.array([6.17, 7.22]), 'SPHb': np.array([10.22, 7.67]), 'SPHa': np.array([14.18, 8.16])}
if __name__ == '__main__': main()
