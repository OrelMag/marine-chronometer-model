"""The set-up cover (42029) measured face down on KLUwI2UUCMQ 11:51-11:52 (the measure-trace skill; 21 October 2026).

    python cover_ends.py traces/cover_11-52.seeds.json [--proj] [--conc] [--png OUT.png]

The cover lies on the barrel bridge face down, its underside up: two levels, the pads at its ends (h toward the camera) and the
middle milled away (0). The seeds file holds the points placed by hand on the 4K frame (+-10 px): each hole's rough centre and
radius, the dark band of the upper pad's wall (its top edge at h, its foot at 0), and the outline's pieces with their level. Each is
moved onto the image's edge (mfgfit.refine_points: the blurred step along the normals; the band's two edges by their opposite
gradients) and put in mm by one map fitted here:

  - a map (affine, or a homography with --proj) from the recess's plane (level 0) to the movement's frame, mirrored as the cover lies,
    fitted circle-geometrically (each hole's edge points held to a circle about its centre, the radius free) on the cover's own
    features: the arbor hole about L.Ba and its two screw holes about S.cover (12.83 and 13.21 from the arbor; their tapped holes in
    the bridge, 13:04.4); the click's pivot hole's centre is left free (it is read, not assumed);
  - a level's parallax as one image shift delta (px) for everything at the pads' level (the cover is 25 mm across at about 65 px/mm,
    so the shift of a 1 mm step is the same over it to a fraction of a pixel): fitted with the map on the band, whose two edges are
    the same arc at the two levels (one circle, its centre free, or about the arbor with --conc).

Writes NAME.mm.json ({piece: [[x, z], ...]} in the movement's frame, for `mfgfit.py fit`), NAME.cal.json (the map, delta, the holes'
radii and the click hole's centre, the residuals) and an overlay PNG.
"""
import sys, os, json, math
import numpy as np, cv2
from scipy.optimize import least_squares
from scipy.ndimage import gaussian_filter, map_coordinates
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import mfgfit as M

VID = os.environ.get('MC_VIDEO', 'E:/mc-video')
Ba = np.array([-22.144, -5.347]); SC = [np.array([-28.64, 5.72]), np.array([-15.19, -16.58])]   # L.Ba, S.cover (movement.js)
FIX = {'arb': Ba, 's0': SC[0], 's1': SC[1]}

def hole_edge(img, c, r, it=3, win=None):
    u = np.linspace(0, 2*math.pi, 120, endpoint=False); Q = np.c_[c[0] + r*np.cos(u), c[1] + r*np.sin(u)]; Nn = np.c_[np.cos(u), np.sin(u)]
    for _ in range(it):
        R, sd, ch, blur, keep, pol = M.refine_points(img, Q, Nn, win or max(6, 0.25*r), 'auto')
        if len(R) < 20: return None
        Q, Nn = M.ellipse_samples(R, 180)
    return R

def band(img, P, win=22, step=3):
    """The two opposite edges of a dark band along a rough polyline: (edge on the normal's - side, edge on its + side)."""
    Q, Nn = M.cr(np.array(P, float), False, set(), step); g = gaussian_filter(M.channel(img, 'luma'), 1.0)
    t = np.arange(-win, win + 0.01, 0.25); X = Q[:, None, 0] + t*Nn[:, None, 0]; Y = Q[:, None, 1] + t*Nn[:, None, 1]
    Pr = map_coordinates(g, [Y.ravel(), X.ravel()], order=1).reshape(X.shape); G = np.gradient(Pr, axis=1); A, B = [], []
    for k in range(len(Q)):
        i, j = np.argmin(G[k]), np.argmax(G[k])
        if G[k, i] > -3 or G[k, j] < 3 or abs(t[i] - t[j]) < 4: continue
        a, b = sorted([i, j]); A.append(Q[k] + t[a]*Nn[k]); B.append(Q[k] + t[b]*Nn[k])
    return np.array(A), np.array(B)

def curve_edge(img, P, win, ch='luma', coarse=20):
    """Two stages: each sample moved to the strongest step of the smoothed channel within +-coarse px along its normal (the seeds are
    placed by eye, +-10 px), the moved points smoothed into a new curve; then the blurred-step fit (mfgfit.refine_points) within +-win."""
    Q, Nn = M.cr(np.array(P, float), False, set(), 2.0); g = gaussian_filter(M.channel(img, ch), 2.0)
    t = np.arange(-coarse, coarse + 0.01, 0.5); X = Q[:, None, 0] + t*Nn[:, None, 0]; Y = Q[:, None, 1] + t*Nn[:, None, 1]
    G = np.abs(np.gradient(map_coordinates(g, [Y.ravel(), X.ravel()], order=1).reshape(X.shape), axis=1)); tk = t[np.argmax(G, 1)]
    from scipy.ndimage import median_filter
    tk = median_filter(tk, 9, mode='nearest'); Q = Q + tk[:, None]*Nn
    Q, Nn = M.cr(Q[::4], False, set(), 2.0); R, sd, ch_, blur, keep, pol = M.refine_points(img, Q, Nn, win, ch)
    return R, ch_, blur

def snap(img, Q, Nn, ch, coarse, win):
    """Samples along a curve with normals: each moved to the strongest step of the channel (smoothed 1 px) within +-coarse px, of the
    curve's common polarity (the median's), the moves smoothed along the curve (a median over 7), then the blurred-step fit within +-win."""
    from scipy.ndimage import median_filter
    g = gaussian_filter(M.channel(img, ch), 1.0); t = np.arange(-coarse, coarse + 0.01, 0.25)
    X = Q[:, None, 0] + t*Nn[:, None, 0]; Y = Q[:, None, 1] + t*Nn[:, None, 1]; G = np.gradient(map_coordinates(g, [Y.ravel(), X.ravel()], order=1).reshape(X.shape), axis=1)
    pol = np.sign(np.median(G[np.arange(len(G)), np.abs(G).argmax(1)])); tk = median_filter(t[np.argmax(G*pol, 1)], 7, mode='nearest')
    R, sd, ch_, blur, keep, p_ = M.refine_points(img, Q + tk[:, None]*Nn, Nn, win, ch); return R, ch_, blur

def valley(img, P, coarse=12):
    """A thin dark line (a step's edge seen end on): each sample of the seed curve moved to the darkest point of the smoothed luma within
    +-coarse px along its normal (a parabola through the minimum and its neighbours), kept where the dip stands 4 noise levels deep."""
    from scipy.ndimage import median_filter
    Q, Nn = M.cr(np.array(P, float), False, set(), 2.0); g = gaussian_filter(M.channel(img, 'luma'), 1.2); t = np.arange(-coarse, coarse + 0.01, 0.5)
    X = Q[:, None, 0] + t*Nn[:, None, 0]; Y = Q[:, None, 1] + t*Nn[:, None, 1]; Pr = map_coordinates(g, [Y.ravel(), X.ravel()], order=1).reshape(X.shape)
    j = np.clip(np.argmin(Pr, 1), 1, len(t) - 2); k = np.arange(len(Q)); a, b, c = Pr[k, j - 1], Pr[k, j], Pr[k, j + 1]
    tt = t[j] + 0.5*0.5*(a - c)/np.where(np.abs(a - 2*b + c) > 1e-9, a - 2*b + c, 1e-9); depth = np.median(Pr, 1) - b
    noise = 1.4826*np.median(np.abs(np.diff(Pr, 2, axis=1)), 1) + 1e-6; ok = (depth > 4*noise) & (np.abs(tt - median_filter(tt, 9, mode='nearest')) < 2.0)
    return (Q + tt[:, None]*Nn)[ok]

def plate_contour(img, thr):
    """The plate's outer contour: the bright metal (smoothed luma over thr), closed and opened, its largest piece's boundary (px)."""
    l = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (0, 0), 2); m = (l > thr).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m); k = 1 + int(np.argmax(st[1:, 4])); m = (lab == k).astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); return max(cs, key=len)[:, 0].astype(float)

def on_seed(C, P, tol=25.0, end=10.0):
    """The contour's points within tol px of the seed polyline P and inside its ends (less `end` px), in the contour's order."""
    P = np.array(P, float); seg = []
    d = np.full(len(C), np.inf); s_ = np.zeros(len(C)); L0 = 0.0; Ltot = sum(np.hypot(*(P[i+1] - P[i])) for i in range(len(P) - 1))
    for i in range(len(P) - 1):
        a, b = P[i], P[i+1]; ab = b - a; l = np.hypot(*ab); u = np.clip(((C - a) @ ab)/l**2, 0, 1); q = a + u[:, None]*ab; di = np.hypot(*(C - q).T)
        better = di < d; d[better] = di[better]; s_[better] = L0 + u[better]*l; L0 += l
    k = np.where((d < tol) & (s_ > end) & (s_ < Ltot - end))[0]
    if len(k) < 3: return None
    # one run in the contour's order (the contour is closed: rotate to the largest gap)
    g = np.diff(np.r_[k, k[0] + len(C)]); j = int(np.argmax(g)); k = np.r_[k[j+1:], k[:j+1]]
    Q = C[k]; return Q if s_[k[0]] < s_[k[-1]] else Q[::-1]

def Hap(H, P): Y = np.c_[P, np.ones(len(P))] @ H.T; return Y[:, :2]/Y[:, 2:3]

def main(a):
    proj = '--proj' in a; conc = '--conc' in a; png = a[a.index('--png') + 1] if '--png' in a else None
    sp = a[0]; S = json.load(open(sp, encoding='utf-8')); img = cv2.imread(os.path.join(VID, 'frames', S['frame']))
    if img is None: sys.exit('cannot read the frame ' + S['frame'])
    k = S.get('scale', 1.0)   # a soft frame worked at a smaller scale, its blur within the step fit's range (every px figure below in the scaled frame)
    if k != 1.0:
        img = cv2.resize(img, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
        S['holes'] = {n: [v[0]*k, v[1]*k, v[2]*k, *v[3:]] for n, v in S['holes'].items()}
        for b in list(S.get('bands', {}).values()) + list(S['curves'].values()): b['pts'] = [[x*k, y*k] for x, y in b['pts']]
        S['origin'] = [v*k for v in S.get('origin', [2300, 1250])]; S['box'] = [int(v*k) for v in S['box']] if 'box' in S else None
    E = {}; LV = {}
    for n, (cx, cy, r, lev, *w) in S['holes'].items():
        R = hole_edge(img, (cx, cy), r, win=w[0] if w else None)
        if R is None: sys.exit(f'hole {n}: no edge')
        E[n] = R; LV[n] = lev
    bands = {n: band(img, b['pts'], b.get('win', 22)) for n, b in S.get('bands', {}).items()}
    o = np.array(S.get('origin', [2300, 1250]), float)
    names = list(E); fixed = [n for n in names if n in FIX]; free = [n for n in names if n not in FIX]
    nb = len(bands)
    def unpack(x):
        k = 8 if proj else 6; H = np.r_[x[:8], 1].reshape(3, 3) if proj else np.r_[x[:6], 0, 0, 1].reshape(3, 3)
        d = x[k:k+2]; k += 2; r = x[k:k+len(names)]; k += len(names); fc = x[k:k+2*len(free)].reshape(-1, 2); k += 2*len(free); bc = x[k:k+3*nb].reshape(-1, 3)
        return H, d, r, fc, bc
    def res(x):
        H, d, r, fc, bc = unpack(x); out = []
        for i, n in enumerate(names):
            c = FIX[n] if n in FIX else fc[free.index(n)]; P = Hap(H, E[n] - o - d*LV[n]); out.append(np.hypot(*(P - c).T) - r[i])
            out.append(0.2*(P.mean(0) - c))   # the edge points' mean near the centre (weakly: an ellipse's centre is not the circle's), which keeps the map from collapsing onto a point
        for j, (n, (A, B)) in enumerate(bands.items()):
            c = Ba if conc else bc[j, :2]; la, lb = S['bands'][n]['levels']
            out.append(np.hypot(*(Hap(H, A - o - d*la) - c).T) - bc[j, 2]); out.append(np.hypot(*(Hap(H, B - o - d*lb) - c).T) - bc[j, 2])
        return np.concatenate(out)
    ec = np.array([E[n].mean(0) for n in fixed]) - o; cen = np.array([FIX[n] for n in fixed])
    def simil(A, B, mirror):   # a similarity A -> B (Umeyama), mirrored or not: the three fixed centres are nearly in a line, so an affine from them is loose
        if mirror: A = A*[1, -1]
        ma, mb = A.mean(0), B.mean(0); U, sv, Vt = np.linalg.svd((B - mb).T @ (A - ma)); Rm = U @ np.diag([1, np.sign(np.linalg.det(U @ Vt))]) @ Vt
        sc = sv.sum()/np.sum((A - ma)**2); Hm = np.eye(3); Hm[:2, :2] = sc*Rm; Hm[:2, 2] = mb - sc*Rm @ ma
        return Hm @ np.diag([1, -1, 1]) if mirror else Hm
    # the cover lies face down, so the map is mirrored: of the two similarities, the one that puts the click's hole nearer the click (S.click) and the arbor hole round
    SCK = np.array([-22.56, -15.46]); cand = [simil(ec, cen, m) for m in (0, 1)]
    H0 = min(cand, key=lambda Hm: np.hypot(*(Hap(Hm, E['ck'].mean(0)[None] - o)[0] - SCK)) if 'ck' in E else 0)
    x0 = np.r_[H0.ravel()[:8] if proj else H0.ravel()[:6], 0, 0, [0.5]*len(names), np.concatenate([Hap(H0, E[n].mean(0)[None] - o)[0] for n in free]) if free else [],
               np.concatenate([[*Ba, 11.4] for _ in bands]) if nb else []]
    fit = least_squares(res, x0, loss='soft_l1', f_scale=0.02, x_scale='jac'); H, d, r, fc, bc = unpack(fit.x)
    J = fit.jac; s2 = np.sum(fit.fun**2)/max(1, len(fit.fun) - len(fit.x))
    try: Cv = np.linalg.pinv(J.T @ J)*s2; sdx = np.sqrt(np.clip(np.diag(Cv), 0, None))
    except Exception: sdx = np.full(len(fit.x), np.nan)
    _, _, sr, sfc, sbc = unpack(sdx)
    rep = dict(frame=S['frame'], scale=k, map='homography' if proj else 'affine', conc=conc, rms_mm=float(np.sqrt(np.mean(fit.fun**2))), delta_px=d.round(2).tolist(),
               holes={n: dict(r=round(float(r[i]), 4), sd=round(float(sr[i]), 4), level=LV[n], centre=(FIX[n] if n in FIX else fc[free.index(n)]).round(3).tolist(),
                              centre_sd=None if n in FIX else sfc[free.index(n)].round(3).tolist(),
                              from_arbor=round(float(np.hypot(*((FIX[n] if n in FIX else fc[free.index(n)]) - Ba))), 3),
                              rms=round(float(np.sqrt(np.mean((np.hypot(*(Hap(H, E[n] - o - d*LV[n]) - (FIX[n] if n in FIX else fc[free.index(n)])).T) - r[i])**2))), 4)) for i, n in enumerate(names)},
               bands={n: dict(centre=(Ba if conc else bc[j, :2]).round(3).tolist(), r=round(float(bc[j, 2]), 3), sd=sbc[j].round(3).tolist(),
                              centre_from_arbor=round(float(np.hypot(*((Ba if conc else bc[j, :2]) - Ba))), 3)) for j, n in enumerate(bands)},
               H_px_to_mm=H.tolist(), origin=o.tolist())
    # the outline's pieces, each at its level
    out = {}; info = {}; ov = img.copy()
    for n, (A, B) in bands.items():   # the band's two edges, each at its level (the wall's top and foot: one arc)
        la, lb = S['bands'][n]['levels']; out[n + '_top'] = Hap(H, A - o - d*la).round(4).tolist(); out[n + '_foot'] = Hap(H, B - o - d*lb).round(4).tolist()
    CT = plate_contour(img, S['contour']) if S.get('contour') else None
    for n, c in S['curves'].items():
        if CT is not None and not c.get('inner'):   # an outline piece: the plate's contour near its seeds, then the blurred-step fit
            Q = on_seed(CT, c['pts'])
            if Q is None: info[n] = 'no contour near the seeds'; continue
            Q, Nn = M.cr(Q[::6], False, set(), 2.0); R, ch, blur = snap(img, Q, Nn, c.get('ch', 'luma'), c.get('coarse', 8), c.get('win', 4))
            info[n + ' (contour)'] = f'{len(Q)} samples off the contour'
        elif c.get('valley'): R, ch, blur = valley(img, c['pts'], c.get('coarse', 12)), 'luma (valley)', 0.0
        else: R, ch, blur = curve_edge(img, c['pts'], c.get('win', 6), c.get('ch', 'luma'), c.get('coarse', 20))
        if len(R) < 5: info[n] = 'no edge'; continue
        if c.get('clip'):   # leave out a stretch (the tweezers, a reflection): [[x0,y0,x1,y1], ...] boxes in px
            keep = np.ones(len(R), bool)
            for x0_, y0_, x1_, y1_ in c['clip']: keep &= ~((R[:, 0] > x0_) & (R[:, 0] < x1_) & (R[:, 1] > y0_) & (R[:, 1] < y1_))
            R = R[keep]
        out[n] = Hap(H, R - o - d*c['level']).round(4).tolist(); info[n] = f'{len(R)} edge points on {ch}, blur {blur:.2f} px, level {c["level"]}'
        for p in R: cv2.circle(ov, tuple(int(v) for v in np.round(p)), 1, (0, 0, 255), -1)
    for n in names:
        for p in E[n]: cv2.circle(ov, tuple(int(v) for v in np.round(p)), 2, (0, 255, 0), -1)
    for A, B in bands.values():
        for p in A: cv2.circle(ov, tuple(int(v) for v in np.round(p)), 2, (255, 0, 0), -1)
        for p in B: cv2.circle(ov, tuple(int(v) for v in np.round(p)), 2, (255, 255, 0), -1)
    for n in free:   # the read hole drawn back
        rep['holes'][n]['note'] = 'centre free (read)'
    rep['curves'] = info
    base = sp.replace('.seeds.json', '')
    json.dump(out, open(base + '.mm.json', 'w', encoding='utf-8', newline='\n'), indent=0)
    json.dump(rep, open(base + '.cal.json', 'w', encoding='utf-8', newline='\n'), indent=1)
    if png:
        bx = S.get('box') or [0, 0, img.shape[1], img.shape[0]]; cv2.imwrite(png, cv2.resize(ov[bx[1]:bx[3], bx[0]:bx[2]], None, fx=0.5, fy=0.5))
        cv2.imwrite(png.replace('.png', '_full.png'), ov[bx[1]:bx[3], bx[0]:bx[2]])
    print(json.dumps({k: v for k, v in rep.items() if k not in ('H_px_to_mm',)}, indent=1))
    print('->', base + '.mm.json', base + '.cal.json')

if __name__ == '__main__': main(sys.argv[1:])
