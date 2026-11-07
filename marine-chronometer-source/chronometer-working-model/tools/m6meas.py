"""Round features (holes, pins, screw heads, chatons) measured on a photograph through m6cam.py's camera, each at its own height (the 6MX's blind
re-audit, 7 November 2026). For each feature the photograph is flattened on the plane y = Y round its rough place (12 px/mm) and mfgfit.py's
locate_circle (gradient rays, a RANSAC circle, the erf refinement) finds its edge; the circle is fitted in mm. It is done through each of the
cameras given (the same photograph fitted with its distance free and held at the ends of the range its residuals allow), and the spread between
them is the calibration's share of the uncertainty.

  python m6meas.py FEATURES.json CAM.json [CAM2.json ...] [--png OUT.png]

FEATURES (JSON): {"photo": path from the repository's root, "features": {"name": {"uv": [u, v] rough centre px, "rpx": rough radius px, "y": the
plane (mm, movement frame), "search": px (default 0.5 rpx)}}}. Prints each feature's centre (x, z), its radius and angle (deg from 12 toward 3),
the diameter, and the spread over the cameras."""
import json, sys, math, pathlib
import numpy as np, cv2
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parents[2]; sys.path.insert(0, str(HERE))
import mfgfit
a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__)
png = a[a.index('--png') + 1] if '--png' in a else None
if png: i = a.index('--png'); del a[i:i + 2]
F = json.loads(pathlib.Path(a[0]).read_text(encoding='utf-8')); cams = [json.loads(pathlib.Path(p).read_text(encoding='utf-8')) for p in a[1:]]
img = cv2.imdecode(np.fromfile(str(ROOT / F['photo']), np.uint8), cv2.IMREAD_COLOR); H, W = img.shape[:2]
def proj(q, X):
    R = cv2.Rodrigues(q[:3])[0]; Pc = X @ R.T + q[3:6]; f = np.exp(q[6]); return np.c_[W / 2 + f * Pc[:, 0] / Pc[:, 2], H / 2 + f * Pc[:, 1] / Pc[:, 2]]
def unproj(q, uv, y):
    R = cv2.Rodrigues(q[:3])[0]; f = np.exp(q[6]); C = -R.T @ q[3:6]; uv = np.atleast_2d(uv)
    d = np.c_[(uv[:, 0] - W / 2) / f, (uv[:, 1] - H / 2) / f, np.ones(len(uv))] @ R; s = (y - C[1]) / d[:, 1]; return C + d * s[:, None]
K = 12.0; res = {}; ov = img.copy()
for nm, f in F['features'].items():
    out = []
    for ci, cam in enumerate(cams):
        q = np.array(cam['q']); y = f['y']; c0 = unproj(q, f['uv'], y)[0]; pxmm = np.linalg.norm(proj(q, np.array([[c0[0] + 1, y, c0[2]]])) - proj(q, np.array([c0])))
        rmm = f['rpx'] / pxmm; hw = rmm * 1.8 + 1.0; x0, z0 = c0[0] - hw, c0[2] - hw; n = int(round(2 * hw * K))
        I, J = np.meshgrid(np.arange(n), np.arange(n)); X = np.c_[x0 + (I.ravel() + 0.5) / K, np.full(I.size, y), z0 + (J.ravel() + 0.5) / K]; uv = proj(q, X)
        patch = cv2.remap(img, uv[:, 0].reshape(n, n).astype(np.float32), uv[:, 1].reshape(n, n).astype(np.float32), cv2.INTER_CUBIC)
        if f.get('mode') == 'rim':   # a screw head's rim: the strongest luma step in a band +-band (default 20 %) round the rough radius on 90 rays, a RANSAC circle
            g = cv2.GaussianBlur(cv2.cvtColor(patch, cv2.COLOR_BGR2GRAY).astype(np.float32), (0, 0), 1.0); bd = f.get('band', 0.2); pts = []
            for t in np.linspace(0, 2 * np.pi, 90, endpoint=False):
                rr = np.arange(rmm * K * (1 - bd), rmm * K * (1 + bd), 0.25); us = n / 2 + rr * np.cos(t); vs = n / 2 + rr * np.sin(t)
                pr = cv2.remap(g, us.astype(np.float32)[None], vs.astype(np.float32)[None], cv2.INTER_LINEAR)[0]; gr = np.abs(np.gradient(pr)); j = int(np.argmax(gr))
                if gr[j] > 3: pts.append([us[j], vs[j]])
            pts = np.array(pts); rng = np.random.default_rng(0); best = None
            for _ in range(400):
                s3 = pts[rng.choice(len(pts), 3, replace=False)]; A3 = np.c_[2 * s3, np.ones(3)]
                try: cx_, cy_, kk = np.linalg.solve(A3, (s3 ** 2).sum(1))
                except np.linalg.LinAlgError: continue
                inl = np.abs(np.hypot(*(pts - [cx_, cy_]).T) - np.sqrt(kk + cx_ * cx_ + cy_ * cy_)) < 1.5
                if best is None or inl.sum() > best.sum(): best = inl
            r = {'px': pts[best], 'how': 'rim', 'kept': int(best.sum())}
        else: r = mfgfit.locate_circle(patch, np.array([n / 2, n / 2]), rmm * K, f.get('search', 0.5 * f['rpx']) / pxmm * K)
        if r is None: out.append(None); continue
        P = r['px'] / K + [x0, z0]; cx, cz, rr = mfgfit.fit_circle(P)[:3]; out.append((cx, cz, rr, r.get('how'), r.get('kept')))
        if ci == 0:
            E = proj(q, np.c_[P[:, 0], np.full(len(P), y), P[:, 1]])
            for p in E[::3]: cv2.circle(ov, (int(round(p[0])), int(round(p[1]))), 1, (0, 255, 0), -1)
            cv2.putText(ov, nm[:18], (int(f['uv'][0] + f['rpx'] + 2), int(f['uv'][1])), 0, 0.3, (0, 255, 255), 1)
    ok = [o for o in out if o]
    if not ok: print(f'{nm:40s} not found'); continue
    A = np.array([o[:3] for o in ok]); m = A[0]; sp = np.ptp(A[:, :2], 0).max() if len(A) > 1 else 0
    ang = math.degrees(math.atan2(m[0], -m[1])) % 360
    print(f'{nm:40s} x {m[0]:8.3f} z {m[1]:8.3f}  r {math.hypot(m[0], m[1]):7.3f} at {ang:6.1f} deg  D {2*m[2]:6.3f}  ({ok[0][3]}, {ok[0][4]} pts)  cameras spread {sp:.3f} mm, D {2*np.ptp(A[:,2]):.3f}')
    res[nm] = dict(x=float(m[0]), z=float(m[1]), D=float(2 * m[2]), r=float(math.hypot(m[0], m[1])), deg=float(ang), spread=float(sp), y=f['y'], all=A.tolist())
pathlib.Path(a[0]).with_suffix('.res.json').write_text(json.dumps(res, indent=1), encoding='utf-8')
if png: cv2.imwrite(png, cv2.resize(ov, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST))
