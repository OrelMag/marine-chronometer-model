"""10:00: the escape upper bridge in place on the upper train bridge. The train bridge's outer face (level 0) calibrated on its holes by
their circles (centres held at holes_trainBridge_outer.json, radii free), the frame's camera from that face; then the bar's countersinks
(level +0.7, the bar's top), the cap's window and round edge (+0.9) put back on their planes: the bar screws' absolute spacing, the
jewel's place against L.E and the bar's direction. Edges by mfgfit. python eb00.py [holes,...] [hbar]"""
import sys, json, math, os, cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from camlib import *
OUT = r'E:\mc-video\oq\ledger\bridges3\eb1000'; IMG = r'E:\mc-video\oq\measure\05_escape_bridge\f_KLUwI2UUCMQ_10-00_crop.png'; OX, OY = 1150, 150
img = cv2.imread(IMG); HJ = json.load(open(r'E:\mc-video\oq\measure\02_train_bridge\holes_trainBridge_outer.json'))['holes']
SEED = {'h1': (746, 147, 97, 67), 'h17': (1587, 300, 100, 70), 'h8': (465, 1002, 75, 58), 'h9': (812, 1586, 70, 55), 'h10': (1526, 1578, 65, 50), 'h12': (1620, 891, 30, 25),
        'h16': (1686, 470, 50, 35), 'h15': (1899, 549, 45, 35), 'h18': (1955, 324, 75, 55), 'h7': (177, 1442, 60, 50), 'h14': (2162, 1119, 35, 28)}
use = sys.argv[1].split(',') if len(sys.argv) > 1 and sys.argv[1] else list(SEED); HB = float(sys.argv[2]) if len(sys.argv) > 2 else 0.7
R = {}
for k, s in SEED.items():
    P = None; seed = ell(s[:2], *s[2:4])
    for it in range(2):
        Q, info = refine_hole(img, seed, k, win=6)
        if Q is not None and len(Q) >= 12: P = Q; (cx, cy), (w, h), an = cv2.fitEllipse(P.astype(np.float32)); seed = ell((cx, cy), w/2, h/2, an, 48)
    R[k] = P; print(k, info)
holes = [(R[k], np.array(HJ[k][:2]), None) for k in use if R[k] is not None]
H, rep, s, res, Cv = calib(holes)
print(f'face calibration on {len(holes)} holes (radii free): sigma {s:.3f} mm; ' + '; '.join(f"{k} miss {r['centre_miss']:.2f} r {r['r_used']:.2f} rms {r['rms']:.3f}" for k, r in zip([k for k in use if R[k] is not None], rep)))
cam = Camera(T(OX, OY) @ np.linalg.inv(H)); print(f'camera f {cam.f:.0f}, axes ratio {cam.ratio:.3f}, cos {cam.cosang:.3f}, tilt {cam.tilt:.1f}')
B = {}
for k, s_, lev in (('e_h1', (645, 680, 55, 40), HB), ('e_h5', (1460, 1035, 55, 40), HB), ('e_h3', (1040, 840, 95, 72), HB + 0.2)):
    P = None; seed = ell(s_[:2], *s_[2:4])
    for it in range(2):
        Q, info = refine_hole(img, seed, k, win=6)
        if Q is not None and len(Q) >= 12: P = Q; (cx, cy), (w, h), an = cv2.fitEllipse(P.astype(np.float32)); seed = ell((cx, cy), w/2, h/2, an, 48)
    B[k] = (P, lev); print(k, info)
LE, LB = np.array([8.926, 16.178]), np.array([1.609, 10.277])
for f in (cam.f*0.8, cam.f, cam.f*1.25):
    cam.set(f); out = {}
    for k, (P, lev) in B.items():
        X = cam.to_mm(P + [OX, OY], lev); q = mf.fit_circle(X); out[k] = q
    d = out['e_h5'][:2] - out['e_h1'][:2]; sp = np.hypot(*d); mid = (out['e_h5'][:2] + out['e_h1'][:2])/2; ub = d/sp
    eu = (LB - LE)/np.linalg.norm(LB - LE); ang = math.degrees(math.atan2(eu[0]*ub[1] - eu[1]*ub[0], eu @ ub))
    w = out['e_h3'][:2]
    print(f'f {f:.0f}: screws {sp:.3f} apart (r {out["e_h1"][2]:.3f}, {out["e_h5"][2]:.3f}); midpoint ({mid[0]:.3f}, {mid[1]:.3f}) = {np.hypot(*(mid - LE)):.3f} from L.E; '
          f'window centre ({w[0]:.3f}, {w[1]:.3f}) {np.hypot(*(w - LE)):.3f} from L.E (along {(w - LE) @ ub:+.3f}, across {(w - LE) @ np.array([-ub[1], ub[0]]):+.3f}), r {out["e_h3"][2]:.3f}; '
          f'window from the screws\' midpoint along {(w - mid) @ ub:+.3f}; bar axis {ang:.2f} deg from the balance-escape line (model 72: the bar from h1 to h5)')
json.dump(dict(H_px2mm_crop=H.tolist(), f=Camera(T(OX, OY) @ np.linalg.inv(H)).f, use=use, edges={k: (None if v is None else np.round(v, 2).tolist()) for k, v in R.items()},
               bar={k: np.round(v[0], 2).tolist() for k, v in B.items()}), open(OUT + r'\eb00.json', 'w'), indent=1)
vis = img.copy()
for k, P in list(R.items()) + [(k, v[0]) for k, v in B.items()]:
    if P is None: continue
    for p in P: cv2.circle(vis, (int(p[0]), int(p[1])), 2, (0, 0, 255), -1)
    cv2.putText(vis, k, tuple(int(x) for x in P.mean(0) + [20, -20]), 0, 1.2, (0, 255, 255), 3)
cv2.imwrite(OUT + r'\eb00.jpg', cv2.resize(vis, None, fx=0.6, fy=0.6), [cv2.IMWRITE_JPEG_QUALITY, 88])
