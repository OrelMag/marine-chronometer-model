"""The set-up cover (42029) in place, seen from above at a slant: its thickness and its pads' height off the walls that face the camera, and its
outline and holes on a second frame (the measure-trace skill; 21 October 2026). KLUwI2UUCMQ 11:46.5 (4K, the cover on, its screws out).

    python cover_heights.py traces/cover_11-46.5.seeds.json [--f F] [--free-end] [--png OUT.png] [--walls DIR]

The camera (a pinhole, principal point the frame's centre, pose free, focal length F or free) is fitted on the cover's own top face
(u = 0), circle-geometrically: each hole's edge points (mfgfit.refine_points, the blurred step along the normals) put back on the face
through the camera and held to a circle about its centre (the arbor hole about L.Ba, the screw holes about S.cover, each radius free;
the click's pivot hole's centre free: it is read, not assumed), and the outline's top edges (found along the outline as movement.js
draws it, projected through the holes' camera) held to its circles (the sides; the ends' circle held, or with --free-end fitted free,
its centre and radius then a reading of this frame). A projected circle's ellipse centre is never used.

Then each wall that faces the camera is unrolled: for each point of the outline's circle (plan, mm) and each height u from +0.6 to -3.8
mm below the top face, the pixel the camera puts it at, sampled. On the unrolled image the top edge, the plate's underside (where the
middle is milled away) and the foot on the barrel bridge are horizontal lines; each is found by the blurred step down the column
(the same erf fit), and the wall's heights are their differences (the plan's own error moves the lines together, not apart). Writes
NAME.cal.json (camera, holes, the end circle if free, the walls' steps per stretch), the unrolled walls (PNG) and an overlay.

What it found (24 October 2026, PROVENANCE.md 108-35a/b): nothing settled, nothing changed in the model. With the radii free the holes'
top edges read 0.13-0.18 over their bores (arbor 3.24-3.30, s0 0.91-0.94: their edges broken); fixed at the bores (11:52's) the camera
put the outline about 1 mm out. The ends' top-edge circle (--free-end) reads r 14.34-14.43, 0.2-0.6 off the arbor as f runs 6000-16000
(11:52's underside: 14.69, 0.94), so the two frames don't agree; the click hole again reads about 0.5 in -x from S.click, within the
screws' play. The unrolled walls show no clean foot line (shadows, the milled gap under the plate), so no height is read.
"""
import sys, os, json, math
import numpy as np, cv2
from scipy.optimize import least_squares
from scipy.ndimage import map_coordinates, gaussian_filter, median_filter
from scipy.special import erf
from scipy.optimize import curve_fit
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import mfgfit as M
import cover_overlay as CO
import cover_ends as CE_

VID = os.environ.get('MC_VIDEO', 'E:/mc-video')
Ba = CO.Ba; SC = CO.SC; SCK = CO.SCK
FIX = {'arb': Ba, 's0': SC[0], 's1': SC[1], 'ck': SCK}
CIRC = {'end': (CO.CE, CO.RE), 'sideL': (CO.CL, CO.RL), 'sideR': (CO.CR, CO.RR), 'pads': (CO.CP, CO.RP)}

def rod(r): return cv2.Rodrigues(np.asarray(r, float))[0]
class Cam:
    def __init__(s, p, f, W=3840, H=2160): s.p = np.asarray(p, float); s.f = f; s.c0 = np.array([W/2, H/2])
    def R(s): return rod(s.p[:3])
    def C(s): return -s.R().T @ s.p[3:6]
    def proj(s, X):
        Xc = np.asarray(X, float) @ s.R().T + s.p[3:6]; return s.f*Xc[:, :2]/Xc[:, 2:3] + s.c0
    def rays(s, uv):
        R = s.R(); q = np.c_[(np.asarray(uv, float) - s.c0)/s.f, np.ones(len(uv))]; return s.C(), q @ R   # rows: R^T q
    def to_plane(s, uv, u0=0.0):
        C, d = s.rays(uv); k = (u0 - C[2])/d[:, 2]; return C[None, :2] + k[:, None]*d[:, :2]
    def to_cyl(s, uv, c, r, near=True):
        """Each ray against the vertical cylinder |(x, z) - c| = r: the (x, z, u) where it meets it (the camera's side, or the far one)."""
        C, d = s.rays(uv); o = C[:2] - c; a = np.sum(d[:, :2]**2, 1); b = 2*d[:, :2] @ o; cc = o @ o - r*r
        disc = np.sqrt(np.clip(b*b - 4*a*cc, 0, None)); k = (-b - disc)/(2*a) if near else (-b + disc)/(2*a)
        return C[None] + k[:, None]*d

def ell_pts(e, n=180):
    cx, cy, a, b, th = e; u = np.linspace(0, 2*math.pi, n, endpoint=False); ct, st = math.cos(math.radians(th)), math.sin(math.radians(th))
    x, y = a*np.cos(u), b*np.sin(u); Q = np.c_[cx + x*ct - y*st, cy + x*st + y*ct]
    nx, ny = np.cos(u)/a, np.sin(u)/b; Nn = np.c_[nx*ct - ny*st, nx*st + ny*ct]; return Q, Nn/np.hypot(*Nn.T)[:, None]

def clipmask(P, boxes):
    k = np.ones(len(P), bool)
    for x0, y0, x1, y1 in boxes or []: k &= ~((P[:, 0] > x0) & (P[:, 0] < x1) & (P[:, 1] > y0) & (P[:, 1] < y1))
    return k

def hole_edges(img, e, win, ch, boxes, it=3):
    Q, Nn = ell_pts(e)
    for i in range(it):
        R, sd, c, blur, keep, pol = M.refine_points(img, Q, Nn, win, ch); R = R[clipmask(R, boxes)]
        if len(R) < 12: return None
        if i < it - 1:
            (cx, cy), (w, h), a = cv2.fitEllipse(R.astype(np.float32)); Q, Nn = ell_pts((cx, cy, w/2, h/2, a))
    return R

def step_fit(t, y):
    """The blurred step in a profile: (t0, its sd, the step's height, blur) or None."""
    g = np.gradient(y); j = int(np.argmax(np.abs(g)))
    m = (t > t[j] - 0.25) & (t < t[j] + 0.25)
    if m.sum() < 8: return None
    fe = lambda x, a, b, t0, s: a + b*erf((x - t0)/(s*math.sqrt(2)))
    try: p, cv = curve_fit(fe, t[m], y[m], p0=[y[m].mean(), (y[m][-1] - y[m][0])/2, t[j], 0.03], maxfev=600)
    except Exception: return None
    if not (abs(p[3]) < 0.2 and np.all(np.isfinite(cv))): return None
    return float(p[2]), float(math.sqrt(max(cv[2, 2], 0))), float(2*p[1]), float(abs(p[3]))

def main(a):
    sp = a[0]; S = json.load(open(sp, encoding='utf-8')); img = cv2.imread(os.path.join(VID, 'frames', S['frame']))
    if img is None: sys.exit('cannot read the frame ' + S['frame'])
    Hh, Ww = img.shape[:2]; f0 = float(a[a.index('--f') + 1]) if '--f' in a else S.get('f', 10000.0); ffree = '--f' not in a and S.get('ffree', True)
    free_end = '--free-end' in a; png = a[a.index('--png') + 1] if '--png' in a else None; wdir = a[a.index('--walls') + 1] if '--walls' in a else None
    # holes' edges on the frame
    E = {}
    for n, h in S['holes'].items():
        R = hole_edges(img, h['ell'], h.get('win', 8), h.get('ch', 'luma'), h.get('clip'))
        if R is None: sys.exit(f'hole {n}: no edge')
        E[n] = R
    # the first camera: an affine on the holes' ellipse centres (rough: only to start; three of them nearly in a line make a homography on
    # them degenerate), read as a weak-perspective camera at f0: A = s [r1 r2] over the image's two rows, the face's tilt from A's singular values
    # (the sign of the tilt is the affine's ambiguity: both are fitted, the better kept)
    names = list(E); ce = np.array([cv2.fitEllipse(E[n].astype(np.float32))[0] for n in names]); pl = np.array([FIX[n] for n in names])
    Aff = np.linalg.lstsq(np.c_[pl, np.ones(len(pl))], ce, rcond=None)[0].T; A2, b2 = Aff[:, :2], Aff[:, 2]
    ev, V = np.linalg.eigh(A2.T @ A2); sc = math.sqrt(ev[1]); wv = V[:, 0]*math.sqrt(max(0.0, 1 - ev[0]/ev[1]))
    cams = []
    for sg in (1, -1):
        r1 = np.r_[A2[:, 0]/sc, sg*wv[0]]; r2 = np.r_[A2[:, 1]/sc, sg*wv[1]]
        U, _, Vt = np.linalg.svd(np.c_[r1, r2, np.cross(r1, r2)]); R0 = U @ Vt
        if np.linalg.det(R0) < 0: continue
        tz = f0/sc; t = np.r_[(b2 - np.array([Ww/2, Hh/2]))/sc, tz]
        cm = Cam(np.r_[cv2.Rodrigues(R0)[0].ravel(), t], f0, Ww, Hh)
        if cm.C()[2] > 0: cams.append(cm)
    if not cams: sys.exit('no camera above the face: the plan is mirrored against the frame?')
    free = [n for n in names if S['holes'][n].get('free')]
    tops = {}   # outline top edges: name -> (circle key, px points)
    def unpack(x):
        k = 6; p = x[:6]; f = f0
        if ffree: f = f0*math.exp(x[6]); k = 7
        r = dict(zip(names, x[k:k+len(names)])); k += len(names); fc = {n: x[k+2*i:k+2*i+2] for i, n in enumerate(free)}; k += 2*len(free)
        endc = (x[k:k+2], x[k+2]) if free_end else CIRC['end']
        return Cam(p, f, Ww, Hh), r, fc, endc
    def res(x, use_tops=True):
        c, r, fc, endc = unpack(x); out = []
        def circ_res(Q, cc, rr):   # px: each edge point against the circle's point at its angle (put back on the face), projected
            P = c.to_plane(Q); ph = np.arctan2(P[:, 1] - cc[1], P[:, 0] - cc[0])
            Cp = c.proj(np.c_[cc[0] + rr*np.cos(ph), cc[1] + rr*np.sin(ph), np.zeros(len(ph))])
            return np.hypot(*(Cp - Q).T)*np.sign(np.hypot(*(P - cc).T) - rr)/math.sqrt(len(Q)/30)
        for n in names: out.append(S['holes'][n].get('w', 1.0)*circ_res(E[n], fc[n] if n in fc else FIX[n], S['holes'][n].get('rfix', r[n])))
        if use_tops:
            for n, (ck, Q) in tops.items(): cc, rr = endc if ck == 'end' else CIRC[ck]; out.append(circ_res(Q, cc, rr))
        return np.concatenate(out)
    def x_of(cam, r=None, fc=None, endc=None):
        x = list(cam.p) + ([math.log(cam.f/f0)] if ffree else []) + [r[n] if r else S['holes'][n].get('r', 3.12 if n == 'arb' else 0.8) for n in names]
        for n in free: x += list(fc[n] if fc else FIX[n])
        if free_end: x += list(endc[0]) + [endc[1]] if endc else list(CIRC['end'][0]) + [CIRC['end'][1]]
        return np.array(x, float)
    fits = [least_squares(lambda v: res(v, False), x_of(cm), loss='soft_l1', f_scale=2.0, x_scale='jac') for cm in cams]
    fit = min(fits, key=lambda q: q.cost); print('first fits (cost):', [round(q.cost, 1) for q in fits])
    cam, r, fc, endc = unpack(fit.x)
    # the outline's top edges, searched along the outline projected through the holes' camera (twice: the camera then refitted on them too)
    for it in range(2):
        tops = {}
        for n, o in S['tops'].items():
            if 'pts' in o:   # seeded by hand (+-15 px): moved onto the strongest step near the seeds, then the blurred-step fit (cover_ends.curve_edge)
                R_, ch, blur = CE_.curve_edge(img, o['pts'], o.get('win', 6), o.get('ch', 'luma'), o.get('coarse', 20)); R_ = R_[clipmask(R_, o.get('clip'))]
                if len(R_) >= 8: tops[n] = (o['circle'], R_)
                continue
            c, rr = CIRC[o['circle']] if o['circle'] != 'end' else endc
            ang = np.radians(np.arange(o['a0'], o['a1'], 0.25*np.sign(o['a1'] - o['a0']) or 0.25))
            P = np.c_[c[0] + rr*np.cos(ang), c[1] + rr*np.sin(ang)]; Q = cam.proj(np.c_[P, np.zeros(len(P))])
            T = np.gradient(Q, axis=0); T /= np.hypot(*T.T)[:, None]; Nn = np.c_[-T[:, 1], T[:, 0]]
            R_, sd, ch, blur, keep, pol = M.refine_points(img, Q, Nn, o.get('win', 10), o.get('ch', 'luma')); R_ = R_[clipmask(R_, o.get('clip'))]
            if len(R_) >= 8: tops[n] = (o['circle'], R_)
        fit = least_squares(lambda v: res(v, True), fit.x if it else x_of(cam, r, fc, endc), loss='soft_l1', f_scale=2.0, x_scale='jac')
        cam, r, fc, endc = unpack(fit.x)
    J = fit.jac; s2 = np.sum(fit.fun**2)/max(1, len(fit.fun) - len(fit.x)); sdx = np.sqrt(np.clip(np.diag(np.linalg.pinv(J.T @ J)*s2), 0, None))
    _, sr, sfc, sendc = unpack(sdx)
    rep = dict(frame=S['frame'], pose=cam.p.tolist(), f=round(cam.f, 1), f_free=bool(ffree), f_sd=round(cam.f*float(sdx[6]), 1) if ffree else None, camera_centre=cam.C().round(3).tolist(),
               tilt_deg=round(math.degrees(math.acos(abs(cam.R()[2, 2]))), 2), rms_px=round(float(np.sqrt(np.mean(fit.fun**2))), 3),
               holes={n: dict(r=round(float(S['holes'][n].get('rfix', r[n])), 4), rfix='rfix' in S['holes'][n], sd=round(float(sr[n]), 4), n=len(E[n]), centre=(fc[n] if n in fc else FIX[n]).round(3).tolist(),
                              centre_sd=sfc[n].round(3).tolist() if n in fc else None, from_arbor=round(float(np.hypot(*((fc[n] if n in fc else FIX[n]) - Ba))), 3),
                              rms=round(float(np.sqrt(np.mean((np.hypot(*(cam.to_plane(E[n]) - (fc[n] if n in fc else FIX[n])).T) - r[n])**2))), 4)) for n in names},
               tops={n: dict(circle=ck, n=len(Q), median=round(float(np.median(np.hypot(*(cam.to_plane(Q) - (endc if ck == 'end' else CIRC[ck])[0]).T) - (endc if ck == 'end' else CIRC[ck])[1])), 4))
                     for n, (ck, Q) in tops.items()})
    if free_end: rep['end_circle'] = dict(centre=np.asarray(endc[0]).round(3).tolist(), r=round(float(endc[1]), 3), sd=np.r_[sendc[0], sendc[1]].round(3).tolist(),
                                       from_arbor=round(float(np.hypot(*(np.asarray(endc[0]) - Ba))), 3), model=dict(centre=CO.CE.tolist(), r=CO.RE))
    # the walls unrolled
    lum = gaussian_filter(M.channel(img, 'luma'), 0.7); rep['walls'] = {}; Cc = cam.C()
    if wdir: os.makedirs(wdir, exist_ok=True)
    us = np.arange(0.6, -3.8, -0.01)
    for n, w in S.get('walls', {}).items():
        c, rr = CIRC[w['circle']] if w['circle'] != 'end' else endc
        ang = np.radians(np.arange(w['a0'], w['a1'], 0.1/rr*180/math.pi*np.sign(w['a1'] - w['a0'])))
        P = np.c_[c[0] + rr*np.cos(ang), c[1] + rr*np.sin(ang)]
        X = np.concatenate([np.c_[P, np.full(len(P), u)] for u in us]); Q = cam.proj(X)
        I = map_coordinates(lum, [Q[:, 1], Q[:, 0]], order=1).reshape(len(us), len(P))
        out_n = (P - c)/rr*(1 if w['circle'] in ('end',) else -1)   # the material's outward normal (the sides' material lies outside their circles)
        vis = (out_n*(Cc[None, :2] - P)).sum(1) > 0
        img_u = cv2.normalize(I, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        if wdir:
            big = cv2.resize(img_u, (img_u.shape[1]*3, img_u.shape[0]), interpolation=cv2.INTER_NEAREST); big = cv2.cvtColor(big, cv2.COLOR_GRAY2BGR)
            for uu in (0, -1.1, -2.5): yy = int(round((0.6 - uu)/0.01)); cv2.line(big, (0, yy), (big.shape[1], yy), (0, 0, 255), 1)
            cv2.imwrite(os.path.join(wdir, f'wall_{n}.png'), big)
        # steps down each stretch of columns: the mean profile over each group of 10 columns (1 mm of wall), and each step's u
        groups = []
        for g0 in range(0, len(P) - 9, 10):
            y = I[:, g0:g0+10].mean(1); steps = []
            for lo, hi in w.get('bands', [[0.4, -0.4], [-0.6, -1.6], [-1.8, -3.2]]):
                m = (us <= lo) & (us >= hi); s = step_fit(us[m], y[m])
                if s: steps.append(dict(u=round(s[0], 3), sd=round(s[1], 3), step=round(s[2], 1), blur=round(s[3], 3)))
                else: steps.append(None)
            groups.append(dict(at_deg=round(float(np.degrees(ang[g0 + 5])), 2), visible=bool(vis[g0 + 5]), steps=steps))
        rep['walls'][n] = groups
    base = sp.replace('.seeds.json', '')
    json.dump(rep, open(base + '.cal.json', 'w', encoding='utf-8', newline='\n'), indent=1)
    if png:
        ov = img.copy()
        for n in names:
            for p in E[n]: cv2.circle(ov, tuple(int(v) for v in np.round(p)), 2, (0, 255, 0), -1)
        for ck, Q in tops.values():
            for p in Q: cv2.circle(ov, tuple(int(v) for v in np.round(p)), 2, (255, 0, 0), -1)
        out, inner = CO.outline()
        for u, col in ((0, (0, 0, 255)), (-1.1, (0, 200, 255)), (-2.5, (255, 0, 255))):
            cv2.polylines(ov, [np.round(cam.proj(np.c_[out, np.full(len(out), u)])).astype(np.int32)], True, col, 1)
        for c_, r_ in CO.HOLES: cv2.polylines(ov, [np.round(cam.proj(np.c_[CO.circle(c_, r_), np.zeros(90)])).astype(np.int32)], True, (0, 255, 255), 1)
        bx = S.get('box', [0, 0, Ww, Hh]); cv2.imwrite(png, ov[bx[1]:bx[3], bx[0]:bx[2]])
    print(json.dumps({k: v for k, v in rep.items() if k != 'walls'}, indent=1))
    for n, g in rep['walls'].items():
        print('wall', n)
        for q in g: print('  %7.2f deg %s  ' % (q['at_deg'], 'vis' if q['visible'] else '---'), '  '.join('-' if s is None else f"u {s['u']:+.3f} ({s['sd']:.3f}, {s['step']:+.0f})" for s in q['steps']))
    print('->', base + '.cal.json')

if __name__ == '__main__': main(sys.argv[1:])
