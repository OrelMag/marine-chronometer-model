"""A photograph's camera fitted on features whose places are not in question, then the photograph flattened at a level, for mfgfit.py (the 6MX's
blind re-audit, 7 November 2026: the photographs of Kirov No. 247 are about 0.11 mm a pixel, so every reading goes through one camera fitted on
the drawings' own features and is put in mm at its own height, never scaled by a feature whose shape is being read).

  python m6cam.py SPEC.json fit                      fit the camera; print each feature's residual (px, mm); write SPEC's stem + .cam.json
  python m6cam.py SPEC.json flat Y [--k 12] [--box x0 z0 x1 z1] [--out NAME]
                                                     the photograph resampled on the plane y = Y (movement frame, mm) at k px/mm over the box:
                                                     NAME.png and NAME.map.json (px_per_mm, x0, z0: mfgfit's --map), x right, z down (seen from the dial side)
  python m6cam.py SPEC.json unproj Y u,v ...         pixels put on the plane y = Y (mm)
  python m6cam.py SPEC.json proj x,y,z ...           movement-frame points to pixels

SPEC (JSON): {"photo": path from the repository's root, "f0": a focal length in px to start from, "look": [cx, cy, cz] a point the camera looks at
and "eye": [ex, ey, ez] roughly where it is (movement frame), "circles": {"name": {"c": [x, y, z], "r": mm, "uv": [u, v] rough centre,
"rpx": rough radius px, "arc": [deg0, deg1] the image angles to search (optional; else all round), "w": weight}}}. Each circle is a round edge on a
plane y = c[1] (a screw head's rim, a plate's rim): its edge points are found on rays from the rough centre (the strongest luma step within
±35 % of rpx, kept by a RANSAC circle in the image) and held to the projected circle; never anchored on an ellipse's centre. The camera is a pinhole
(pose and focal length, principal point at the centre)."""
import json, sys, pathlib
import numpy as np, cv2
from scipy.optimize import least_squares
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parents[2]
a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__)
SP = pathlib.Path(a[0]); S = json.loads(SP.read_text(encoding='utf-8')); CAM = SP.with_suffix('.cam.json')
PH = ROOT / S['photo']; img = cv2.imdecode(np.fromfile(str(PH), np.uint8), cv2.IMREAD_COLOR); H, W = img.shape[:2]
lum = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(float), (0, 0), 0.8)

def proj(q, X):
    R = cv2.Rodrigues(q[:3])[0]; Pc = X @ R.T + q[3:6]; f = np.exp(q[6])
    return np.c_[W / 2 + f * Pc[:, 0] / Pc[:, 2], H / 2 + f * Pc[:, 1] / Pc[:, 2]]
def unproj(q, uv, y):
    R = cv2.Rodrigues(q[:3])[0]; f = np.exp(q[6]); C = -R.T @ q[3:6]; uv = np.atleast_2d(uv)
    d = np.c_[(uv[:, 0] - W / 2) / f, (uv[:, 1] - H / 2) / f, np.ones(len(uv))] @ R; s = (y - C[1]) / d[:, 1]
    return C + d * s[:, None]

def edges(c):   # a round edge's points in the image: the strongest luma step along rays from the rough centre
    u0, v0 = c['uv']; r0 = c['rpx']; a0, a1 = c.get('arc', [0, 360]); out = []
    for t in np.radians(np.arange(a0, a1, 2.0 if r0 > 60 else 6.0)):
        rr = np.arange(r0 * 0.65, r0 * 1.35, 0.25); us = u0 + rr * np.cos(t); vs = v0 + rr * np.sin(t)
        ok = (us > 1) & (us < W - 2) & (vs > 1) & (vs < H - 2)
        if ok.sum() < 8: continue
        p = cv2.remap(lum.astype(np.float32), us[ok].astype(np.float32)[None], vs[ok].astype(np.float32)[None], cv2.INTER_LINEAR)[0]
        g = np.abs(np.gradient(p)); i = int(np.argmax(g))
        if g[i] < 4: continue
        out.append([us[ok][i], vs[ok][i]])
    P = np.array(out); best = None
    for _ in range(300):   # RANSAC circle
        s = P[np.random.choice(len(P), 3, replace=False)]; A = np.c_[2 * s, np.ones(3)]; b = (s ** 2).sum(1)
        try: cx, cy, k = np.linalg.solve(A, b)
        except np.linalg.LinAlgError: continue
        r = np.sqrt(k + cx * cx + cy * cy); d = np.abs(np.hypot(*(P - [cx, cy]).T) - r); inl = d < 1.2
        if best is None or inl.sum() > best.sum(): best = inl
    return P[best]

np.random.seed(1)
CI = {k: v for k, v in S.get('circles', {}).items()}
if a[1] == 'fit':
    EP = {k: edges(v) for k, v in CI.items()}
    for k, v in EP.items(): print(f'  {k}: {len(v)} edge points')
    def circ3(c, n=180):
        t = np.linspace(0, 2 * np.pi, n, endpoint=False); return np.c_[c['c'][0] + c['r'] * np.cos(t), np.full(n, c['c'][1]), c['c'][2] + c['r'] * np.sin(t)]
    def res(q):
        o = []
        k_mm = np.exp(q[6]) / abs(-(cv2.Rodrigues(q[:3])[0].T @ q[3:6])[1] + 22)   # px a mm near the plates
        for k, c in CI.items():
            X = unproj(q, EP[k], c['c'][1]); d = (np.hypot(X[:, 0] - c['c'][0], X[:, 2] - c['c'][2]) - c['r']) * k_mm   # each edge point, on its plane, off the circle (px)
            o.append(d * c.get('w', 1) / np.sqrt(len(d)) * 6)
        for k, v in S.get('points', {}).items():   # a point picked by hand (an arbor's end): its residual in px, weighted as one circle
            o.append((proj(q, np.array([v['xyz']]))[0] - v['uv']) * v.get('w', 1) * 3)
        if S.get('dist'): o.append([(np.linalg.norm(cv2.Rodrigues(q[:3])[0].T @ q[3:6]) - S['dist']) * 10])   # the camera's distance held (a study of how loose it is)
        return np.concatenate(o)
    eye = np.array(S['eye'], float); look = np.array(S['look'], float); zc = look - eye; zc /= np.linalg.norm(zc)
    xc = np.cross([0, 0, -1.0], zc); xc = np.array(S.get('xdir', xc), float); xc -= zc * (xc @ zc); xc /= np.linalg.norm(xc); yc = np.cross(zc, xc)
    R0 = np.array([xc, yc, zc]); q0 = np.r_[cv2.Rodrigues(R0)[0].ravel(), -R0 @ eye, np.log(S['f0'])]
    best = None
    for sgn in (1, -1):   # the image's x may run either way: try both
        R1 = np.array([sgn * xc, sgn * yc, zc]); q1 = np.r_[cv2.Rodrigues(R1)[0].ravel(), -R1 @ eye, np.log(S['f0'])]
        r = least_squares(res, q1, loss='soft_l1', f_scale=1.0)
        if best is None or r.cost < best.cost: best = r
    q = best.x
    for it in range(2):   # drop each circle's outliers against the fit, then refit
        for k, c in CI.items():
            X = unproj(q, EP[k], c['c'][1]); d = np.abs(np.hypot(X[:, 0] - c['c'][0], X[:, 2] - c['c'][2]) - c['r']) * 8.8; EP[k] = EP[k][d < max(1.5, 3 * np.median(d))]
        q = least_squares(res, q, loss='soft_l1', f_scale=1.0).x
    C = -cv2.Rodrigues(q[:3])[0].T @ q[3:6]; f = np.exp(q[6])
    print(f'camera at ({C[0]:.1f}, {C[1]:.1f}, {C[2]:.1f}) mm, f {f:.0f} px; mm a px at y -22: {abs(C[1]+22)/f:.4f}')
    out = {}
    for k, v in S.get('points', {}).items(): print(f'  point {k:36s} off {np.linalg.norm(proj(q, np.array([v["xyz"]]))[0] - v["uv"]):.2f} px')
    for k, c in CI.items():
        X = unproj(q, EP[k], c['c'][1]); d = (np.hypot(X[:, 0] - c['c'][0], X[:, 2] - c['c'][2]) - c['r']) * 8.8
        # the centre the edge points give, put on the plane, against the feature's own place
        E = EP[k]; X = unproj(q, E, c['c'][1]); A = np.c_[2 * X[:, [0, 2]], np.ones(len(X))]; sol = np.linalg.lstsq(A, (X[:, [0, 2]] ** 2).sum(1), rcond=None)[0]
        rr = np.sqrt(sol[2] + sol[0] ** 2 + sol[1] ** 2); dc = np.hypot(sol[0] - c['c'][0], sol[1] - c['c'][2])
        print(f'  {k:42s} rms {np.sqrt((d**2).mean()):.2f} px over {len(d)}; centre off {dc:.3f} mm ({sol[0]-c["c"][0]:+.3f}, {sol[1]-c["c"][2]:+.3f}), r {rr:.3f} (given {c["r"]})')
        out[k] = {'n': len(d), 'rms_px': float(np.sqrt((d ** 2).mean())), 'centre': [float(sol[0]), float(sol[1])], 'r': float(rr), 'edges': E.tolist()}
    CAM.write_text(json.dumps({'q': q.tolist(), 'W': W, 'H': H, 'photo': S['photo'], 'fit': out}, indent=1), encoding='utf-8'); print('wrote', CAM)
    ov = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)   # the fit drawn on the photograph, doubled: projected circles red, edge points green
    for k, c in CI.items():
        cv2.polylines(ov, [(proj(q, circ3(c, 720)) * 2).astype(np.int32)], True, (0, 0, 255), 1)
        for p in EP[k]: cv2.circle(ov, (int(p[0] * 2), int(p[1] * 2)), 2, (0, 255, 0), -1)
    cv2.imwrite(str(SP.with_suffix('')) + '_fit.png', ov)
    sys.exit(0)

q = np.array(json.loads(CAM.read_text(encoding='utf-8'))['q'])
if a[1] == 'unproj':
    y = float(a[2])
    for t in a[3:]: u, v = map(float, t.split(',')); X = unproj(q, [u, v], y)[0]; print(f'{t} -> x {X[0]:.3f} z {X[2]:.3f} (r {np.hypot(X[0],X[2]):.3f}, {np.degrees(np.arctan2(X[0],-X[2]))%360:.1f} deg from 12 toward 3)')
elif a[1] == 'proj':
    for t in a[2:]: X = np.array([list(map(float, t.split(',')))]); print(t, '->', np.round(proj(q, X)[0], 2))
elif a[1] == 'flat':
    y = float(a[2]); k = float(a[a.index('--k') + 1]) if '--k' in a else 12.0
    x0, z0, x1, z1 = map(float, a[a.index('--box') + 1:a.index('--box') + 5]) if '--box' in a else (-46, -46, 46, 46)
    name = a[a.index('--out') + 1] if '--out' in a else f'{SP.stem}_y{y:g}'
    nx, nz = int(round((x1 - x0) * k)), int(round((z1 - z0) * k)); I, J = np.meshgrid(np.arange(nx), np.arange(nz))
    X = np.c_[(x0 + (I.ravel() + 0.5) / k), np.full(I.size, y), (z0 + (J.ravel() + 0.5) / k)]; uv = proj(q, X)
    mu = uv[:, 0].reshape(nz, nx).astype(np.float32); mv = uv[:, 1].reshape(nz, nx).astype(np.float32)
    o = cv2.remap(img, mu, mv, cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT); cv2.imwrite(name + '.png', o)
    pathlib.Path(name + '.map.json').write_text(json.dumps({'px_per_mm': k, 'x0': x0, 'z0': z0, 'y': y, 'photo': S['photo'], 'cam': str(CAM.name)}), encoding='utf-8')
    print('wrote', name + '.png', name + '.map.json', f'({nx}x{nz}, {k} px/mm; the photograph is about {1/0.113:.1f} px/mm: resampled, not sharper)')
