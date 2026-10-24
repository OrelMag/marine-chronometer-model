"""The lower train bridge's end against pillar 1's dial-side screw head (KLUwI2UUCMQ 40:05, 9:03), through the joint fits of
bridges2/ltb*/ (the plate's face and the bar's top as planes of one pinhole camera: H(h) = H0 + h/htop (Htop - H0)). The head's top edge refined
(mfgfit's erf edge along the seed ellipse's normals), put back on the plane at the head's height (1.6 drawn, 2.0 the train side's), a circle;
then, in the bar's own frame (origin the third's sink, u toward the fourth's, as ltb_summary.py), its centre, its radius, its place about the
plate's centre, and its clearance to the bar's end and corner.  python ltb_pillar.py"""
import sys, json, math, os, cv2, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from camlib import *
B2 = r'E:\mc-video\oq\ledger\bridges2'
RUNS = [('40:05', r'E:\mc-video\frames\f_KLUwI2UUCMQ_40-05.png', B2 + r'\ltb\L0.json', (3435, 1868, 112, 86)),
        ('40:05', r'E:\mc-video\frames\f_KLUwI2UUCMQ_40-05.png', B2 + r'\ltb\L_all6.json', (3435, 1868, 112, 86)),
        ('9:03', r'E:\mc-video\frames\f_KLUwI2UUCMQ_9-03.png', B2 + r'\ltb903\M_h432.json', (2420, 1622, 74, 60))]
LF = np.array([0.0, 21.6]); LT = np.array([-8.524, 14.186])
out = []
for name, img_p, jp, seed in RUNS:
    img = cv2.imread(img_p); J = json.load(open(jp)); H0 = np.array(J['Hmm2px_0']); Ht = np.array(J['Hmm2px_top']); ht = J['h']
    P = None; sd = ell(seed[:2], *seed[2:])
    for it in range(3):
        Q, info = refine_hole(img, sd, 'head', win=6)
        if Q is not None and len(Q) >= 12: P = Q; (cx, cy), (w, h), an = cv2.fitEllipse(P.astype(np.float32)); sd = ell((cx, cy), w/2, h/2, an, 60)
    print(name, os.path.basename(jp), info, 'top at h', round(ht, 2))
    ci = J['circles']; o = np.array(ci['sink_T']['c']); s = float(np.linalg.norm(np.array(ci['sink_F']['c']) - o)); u = (np.array(ci['sink_F']['c']) - o)/s; v = np.array([-u[1], u[0]])
    c = np.array(J['rect']['c']); th = math.radians(J['rect']['theta_deg']); a = np.array([math.cos(th), math.sin(th)]); a *= np.sign(a @ u); Lr, W = J['rect']['length'], J['rect']['width']
    eR = ((c + a*Lr/2) - o) @ u; off = (c - o) @ v
    for hh in (1.6, 2.0):
        Hh = H0 + hh/ht*(Ht - H0); X = mf.H_apply(np.linalg.inv(Hh), P); q = mf.fit_circle(X); C = q[:2]
        al = (C - o) @ u; ac = (C - o) @ v; ang = math.degrees(math.atan2(C[0], -C[1])) % 360; r = q[2]
        # the bar's end corner on the head's side (the corner nearest it), in the bar frame
        side = math.copysign(1, ac - off); cor = np.array([eR, off + side*W/2])
        gap_end = (al - r) - eR; gap_cor = math.hypot(al - cor[0], ac - cor[1]) - r
        print(f'   head h {hh}: centre ({C[0]:.2f}, {C[1]:.2f}), r {r:.2f}, {ang:.1f} deg r {np.hypot(*C):.2f} from the plate centre; in the bar frame along {al - s:+.2f} past the fourth\'s sink, '
              f'across {ac - off:+.2f} off the bar\'s centre line (half width {W/2:.2f}); the bar\'s end {eR - s:+.2f} past the fourth\'s sink; head clear of the end face {gap_end:+.2f}, of the corner {gap_cor:+.2f} mm')
        out.append(dict(frame=name, fit=os.path.basename(jp), h=hh, centre=C.tolist(), r=r, angle=ang, along_past_F=al - s, across=ac - off, end_past_F=eR - s, width=W, gap_end=gap_end, gap_corner=gap_cor, s=s))
    vis = img.copy()
    for p in P: cv2.circle(vis, (int(p[0]), int(p[1])), 2, (0, 0, 255), -1)
    x, y = int(seed[0]), int(seed[1]); cv2.imwrite(os.path.join(r'E:\mc-video\oq\ledger\bridges3', f'ltbpil_{name.replace(":", "-")}.jpg'), vis[max(0, y - 300):y + 250, x - 450:x + 250])
json.dump(out, open(r'E:\mc-video\oq\ledger\bridges3\ltb_pillar.json', 'w'), indent=1)
