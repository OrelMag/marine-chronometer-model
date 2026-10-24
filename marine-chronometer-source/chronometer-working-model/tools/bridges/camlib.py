"""Shared helpers for the bridges' measurements (KLUwI2UUCMQ frames in $MC_VIDEO; outputs under E:/mc-video/oq/ledger/bridges2, bridges3): mfgfit's edge refinement on seeds, a circle-geometric plane calibration with each hole's
radius free or held, and the frame's pinhole camera from a face homography (principal point at the 4K frame's centre, f from the face
axes' orthonormality), so planes at other heights map exactly."""
import sys, os, json, math
import numpy as np
from scipy.optimize import least_squares, minimize_scalar
TOOLS = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, TOOLS)
import mfgfit as mf

def ell(c, a, b, ang=0.0, n=36):
    u = np.linspace(0, 2*math.pi, n, endpoint=False); ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    x, y = a*np.cos(u), b*np.sin(u); return np.c_[c[0] + x*ca - y*sa, c[1] + x*sa + y*ca]

def refine_hole(img, P, name='h', win=6, ch='auto'):
    o = dict(name=name, kind='ellipse', closed=True, h=0, px=np.asarray(P, float), corners=set(), Hm=None, mm=None)
    info = mf.refine([o], img, None, ch, win); return o.get('px_refined'), info.get(name, '')

def refine_curve(img, P, corners=(), closed=False, name='c', win=6, ch='auto'):
    o = dict(name=name, kind='curve', closed=closed, h=0, px=np.asarray(P, float), corners=set(corners), Hm=None, mm=None)
    info = mf.refine([o], img, None, ch, win); return o.get('px_refined'), info.get(name, ''), o

def calib(holes, H0=None):
    """holes: list of (px edge points (n,2), centre mm (2), r mm or None for free). -> H px->mm, per-hole report.
    Each mapped edge point's distance from its circle (centre held, radius held or free), soft-l1."""
    C = np.array([P.mean(0) for P, c, r in holes]); M = np.array([c for P, c, r in holes])
    H = H0 if H0 is not None else mf.H_fit(C, M)
    free = [i for i, (P, c, r) in enumerate(holes) if r is None]
    rad0 = [float(np.median(np.hypot(*(mf.H_apply(H, holes[i][0]) - holes[i][1]).T))) for i in free]
    def res(v):
        Hh = np.r_[v[:8], 1].reshape(3, 3); rr = dict(zip(free, v[8:])); out = []
        for i, (P, c, r) in enumerate(holes):
            out.append(np.hypot(*(mf.H_apply(Hh, P) - c).T) - (rr[i] if r is None else r))
        return np.concatenate(out)
    v0 = np.r_[(H/H[2, 2]).ravel()[:8], rad0]
    r = least_squares(res, v0, loss='soft_l1', f_scale=0.03, x_scale='jac'); H = np.r_[r.x[:8], 1].reshape(3, 3); rr = dict(zip(free, r.x[8:]))
    J = r.jac; s2 = np.sum(r.fun**2)/max(1, len(r.fun) - len(r.x))
    try: Cv = np.linalg.inv(J.T @ J)*s2
    except np.linalg.LinAlgError: Cv = None
    rep = []
    for i, (P, c, rh) in enumerate(holes):
        X = mf.H_apply(H, P); q = mf.fit_circle(X); e = np.hypot(*(X - c).T) - (rr[i] if rh is None else rh)
        rep.append(dict(centre_miss=float(np.hypot(*(q[:2] - c))), free_circle=q.tolist(), r_used=float(rr[i] if rh is None else rh), rms=float(np.sqrt(np.mean(e**2))), n=len(P)))
    return H, rep, float(np.sqrt(s2)), r, Cv

class Camera:
    """H: face mm (x, z) -> FRAME px. pp at (W/2, Hh/2). f where |m1| = |m2| and m1 . m2 = 0 best (or given)."""
    def __init__(s, H, W=3840, Hh=2160, f=None, pp=None):
        s.H = np.asarray(H, float); s.W, s.Hh = W, Hh; s.pp = pp if pp is not None else (W/2, Hh/2)
        if f is None:
            g = lambda f: s.ortho(f)
            r = minimize_scalar(g, bounds=(800, 40000), method='bounded'); f = r.x
        s.f = f; s.set(f)
    def K(s, f): return np.array([[f, 0, s.pp[0]], [0, f, s.pp[1]], [0, 0, 1.0]])
    def ortho(s, f):
        M = np.linalg.inv(s.K(f)) @ s.H; a, b = M[:, 0], M[:, 1]; return (np.linalg.norm(b)/np.linalg.norm(a) - 1)**2 + (a @ b/np.linalg.norm(a)/np.linalg.norm(b))**2
    def set(s, f):
        K = s.K(f); M = np.linalg.inv(K) @ s.H; l = 1/math.sqrt(np.linalg.norm(M[:, 0])*np.linalg.norm(M[:, 1])); r1, r2, t = M[:, 0]*l, M[:, 1]*l, M[:, 2]*l
        if t[2] < 0: r1, r2, t = -r1, -r2, -t
        r3 = np.cross(r1, r2); r3 /= np.linalg.norm(r3); n = r3 if r3 @ (-t) > 0 else -r3
        s.Kf, s.r1, s.r2, s.t, s.n = K, r1, r2, t, n
        s.ratio = np.linalg.norm(M[:, 1])/np.linalg.norm(M[:, 0]); s.cosang = float(M[:, 0] @ M[:, 1]/np.linalg.norm(M[:, 0])/np.linalg.norm(M[:, 1]))
        s.tilt = math.degrees(math.acos(abs(n @ (-t)/np.linalg.norm(t))))
    def plane(s, h):
        """mm (x, z) on the plane h toward the camera off the face -> frame px."""
        return s.Kf @ np.c_[s.r1, s.r2, s.t + h*s.n]
    def to_px(s, X, h): return mf.H_apply(s.plane(h), X)
    def to_mm(s, P, h): return mf.H_apply(np.linalg.inv(s.plane(h)), P)

def off(H_mm2crop, ox, oy):
    """mm -> crop px  =>  mm -> frame px."""
    return np.array([[1, 0, ox], [0, 1, oy], [0, 0, 1.0]]) @ H_mm2crop
def T(ox, oy): return np.array([[1, 0, ox], [0, 1, oy], [0, 0, 1.0]])

def line_fit(X):
    """Total least squares line: point, unit direction, rms."""
    m = X.mean(0); U, S, Vt = np.linalg.svd(X - m); d = Vt[0]; nrm_ = np.array([-d[1], d[0]]); e = (X - m) @ nrm_
    return m, d, float(np.sqrt(np.mean(e**2))), e

def refine_line(img, Q, win=6, ch='luma', pol=None):
    """Seed points along a straight run -> mfgfit's erf edge points along the run's normal (refine_points), without refine()'s 30 % rule
    (a long edge with stretches of poor contrast still gives its clean stretches). pol: +1/-1 to keep only that polarity (None: majority)."""
    Q = np.asarray(Q, float); d = Q[-1] - Q[0]; d /= np.linalg.norm(d); Nn = np.tile([-d[1], d[0]], (len(Q), 1))
    R, sd, c, blur, keep, p = mf.refine_points(img, Q, Nn, win, ch)
    return R, dict(channel=c, blur=blur, kept=len(R), of=len(Q), pol=p)

def refine_ring(img, P, win=5, ch='luma'):
    """A closed seed (points round a round edge) -> mfgfit's erf edge points along the seed ellipse's normals within +-win px (one pass:
    no refit of the ellipse, so a good seed keeps the edge it is put on)."""
    Q, Nn = mf.ellipse_samples(np.asarray(P, float), 240)
    R, sd, c, blur, keep, pol = mf.refine_points(img, Q, Nn, win, ch)
    return R, dict(channel=c, blur=blur, kept=len(R), of=len(Q), pol=pol)
