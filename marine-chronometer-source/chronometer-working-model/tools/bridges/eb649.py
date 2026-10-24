"""KLUwI2UUCMQ 6:49.0 (and the same pipeline for any frame with a SEED table): the escape upper bridge in place on the upper train bridge.
The train bridge's outer face (level 0) calibrated on its holes by their circles (centres held at the model's holes, radii free), the
frame's camera from that face; the bar's screws (level +0.7, the bar's top) and its long edges put back on their plane: the bar's axis
against the balance-escape line (model 72 deg), the screws' spacing and midpoint against L.E.
python eb649.py CFG.json [holes,...]"""
import sys, json, math, os, cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from camlib import *
C = json.load(open(sys.argv[1])); OUT = C['out']; os.makedirs(OUT, exist_ok=True)
img = cv2.imread(C['img']); HJ = json.load(open(C['holes']))['holes']
SEED = C['seed']; use = sys.argv[2].split(',') if len(sys.argv) > 2 else list(SEED); HB = C.get('hbar', 0.7)
R = {}
for k, s in SEED.items():
    P = None; seed = ell(s[:2], *s[2:4])
    for it in range(2):
        Q, info = refine_hole(img, seed, k, win=5)
        if Q is not None and len(Q) >= 12: P = Q; (cx, cy), (w, h), an = cv2.fitEllipse(P.astype(np.float32)); seed = ell((cx, cy), w/2, h/2, an, 48)
    R[k] = P; print(k, info, None if P is None else len(P))
holes = [(R[k], np.array(HJ[k][:2]), None) for k in use if R.get(k) is not None]
names = [k for k in use if R.get(k) is not None]
H, rep, s, res, Cv = calib(holes)
print(f'face calibration on {len(holes)} holes (radii free): sigma {s:.3f} mm')
for k, r in zip(names, rep): print(f"   {k}: centre miss {r['centre_miss']:.3f} mm, r {r['r_used']:.2f} (model {HJ[k][2]:.2f}), rms {r['rms']:.3f}, n {r['n']}")
cam = Camera(np.linalg.inv(H)); print(f'camera f {cam.f:.0f}, axes ratio {cam.ratio:.3f}, cos {cam.cosang:.3f}, tilt {cam.tilt:.1f}')
B = {}
for k, s_ in C['bar_holes'].items():
    P = None; seed = ell(s_[:2], *s_[2:4])
    for it in range(2):
        Q, info = refine_hole(img, seed, k, win=5)
        if Q is not None and len(Q) >= 12: P = Q; (cx, cy), (w, h), an = cv2.fitEllipse(P.astype(np.float32)); seed = ell((cx, cy), w/2, h/2, an, 48)
    B[k] = P; print(k, info)
Lns = {}
for k, seg in C['bar_edges'].items():
    Q = np.array([np.array(seg[0]) + t*(np.array(seg[1]) - np.array(seg[0])) for t in np.linspace(0, 1, 40)])
    Rr, info = refine_line(img, Q, win=6); Lns[k] = Rr; print(k, info)
LE, LB = np.array([8.926, 16.178]), np.array([1.609, 10.277]); eu = (LE - LB)/np.linalg.norm(LE - LB)
ang_of = lambda d: math.degrees(math.atan2(eu[0]*d[1] - eu[1]*d[0], eu @ d)) % 180
rows = []
for f in (cam.f*0.8, cam.f, cam.f*1.25):
    cam.set(f); out = {k: mf.fit_circle(cam.to_mm(P, HB)) for k, P in B.items() if P is not None}
    a, b = C['screws']; d = out[b][:2] - out[a][:2]; sp = np.hypot(*d); mid = (out[a][:2] + out[b][:2])/2; ub = d/sp
    dirs = []
    for k, P in Lns.items():
        m, dd, rms, e = line_fit(cam.to_mm(P, HB)); dirs.append(dd if dd @ ub > 0 else -dd); print(f'   f {f:.0f} edge {k}: dir {ang_of(dirs[-1]):.2f} deg, rms {rms:.3f} mm, n {len(P)}')
    if len(Lns) == 2:
        (m1, d1, _, _), (m2, d2, _, _) = [line_fit(cam.to_mm(P, HB)) for P in Lns.values()]; nn = np.array([-ub[1], ub[0]]); wid = abs((m2 - m1) @ nn)
    else: wid = float('nan')
    de = np.mean(dirs, 0) if dirs else ub
    print(f'f {f:.0f}: screws {sp:.3f} apart; midpoint ({mid[0]:.3f}, {mid[1]:.3f}), {np.hypot(*(mid - LE)):.3f} from L.E '
          f'(along {(mid - LE) @ ub:+.3f}, across {(mid - LE) @ np.array([-ub[1], ub[0]]):+.3f}); bar axis by the screws {ang_of(ub):.2f} deg, by the edges {ang_of(de):.2f} deg '
          f'from the balance-escape line (model 72); width {wid:.3f}')
    for k, q in out.items(): print(f'      {k}: ({q[0]:.3f}, {q[1]:.3f}) r {q[2]:.3f}')
    rows.append(dict(f=f, spacing=sp, mid=mid.tolist(), ang_screws=ang_of(ub), ang_edges=ang_of(de), width=wid, circles={k: v.tolist() for k, v in out.items()}))
json.dump(dict(cfg=sys.argv[1], use=names, sigma=s, rep=rep, f=cam.f, rows=rows, H_px2mm=H.tolist()), open(os.path.join(OUT, 'result.json'), 'w'), indent=1)
vis = img.copy(); cam.set(rows[1]['f'])
for k, (x, z, r) in HJ.items():
    c = cam.to_px(np.array([[x + r*math.cos(t), z + r*math.sin(t)] for t in np.linspace(0, 2*math.pi, 60)]), 0).astype(np.int32); cv2.polylines(vis, [c], True, (255, 255, 0), 2)
for k, P in list(R.items()) + list(B.items()) + list(Lns.items()):
    if P is None: continue
    for p in P: cv2.circle(vis, (int(p[0]), int(p[1])), 2, (0, 0, 255), -1)
    cv2.putText(vis, k, tuple(int(x) for x in P.mean(0) + [15, -15]), 0, 1.0, (0, 255, 255), 2)
# the model's bar axis (72 deg) and the measured one through the jewel, at the bar's level
for angd, col in ((72, (255, 0, 255)), (rows[1]['ang_screws'], (0, 255, 0))):
    th = math.radians(angd); u = np.array([eu[0]*math.cos(th) - eu[1]*math.sin(th), eu[0]*math.sin(th) + eu[1]*math.cos(th)])
    p = cam.to_px(np.array([LE - 12*u, LE + 12*u]), HB).astype(int); cv2.line(vis, tuple(p[0]), tuple(p[1]), col, 2)
x0, y0, x1, y1 = C['view']; cv2.imwrite(os.path.join(OUT, 'overlay.jpg'), vis[y0:y1, x0:x1], [cv2.IMWRITE_JPEG_QUALITY, 90])
