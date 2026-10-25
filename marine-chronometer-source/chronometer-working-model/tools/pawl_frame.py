"""Each winding pawl's outline on KLUwI2UUCMQ 27:00 (flattened on the sustaining ratchet's tips, 40 px/mm: $MC_VIDEO/oq/ledger/inner_fusee/sr2700_f6000.png)
as the b* 13 iso-contour round its stud (pawlgeo.py's level), put in the pawl's own frame (s from the stud toward its end's middle, t across, negative
toward the ratchet's centre, as WPO) beside WPO as it stood until 25 October 2026 (x WFS), with the widths across both at stations along s. The contour
wraps round the dark hole beside the right pawl's arm and misses its end's inner corner, so the end was read from corners picked on the frame
(movement.js's WPO comment); the left pawl's contour is clean. Writes pawlframe.png and Q_/P_/A_ .npy files to the current directory.

    python pawl_frame.py        (a few seconds)
"""
import json, math, sys, cv2, numpy as np, contourpy
from matplotlib.path import Path
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
import os; D = os.environ.get('MC_VIDEO', 'E:/mc-video')+'/oq/ledger/inner_fusee/'
im = cv2.imread(D+'sr2700_f6000.png'); K = 40.0; x0 = z0 = -18.536
F = json.load(open(D+'sr2700.found.mm.json'))['planes']['found']['traces']
C0 = np.array([F['bore']['circle_mm']['x'], F['bore']['circle_mm']['z']])
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32); b = cv2.GaussianBlur(lab[..., 2], (0, 0), 0.8)-128
b[b < -5] = 40
WFS = 16.55/14.53
def wpo():
    o = []; e0 = math.atan2(0.73, 0.82); e1 = 2*math.pi-math.atan2(0.45, 1.0)
    for i in range(25): f = e0+(e1-e0)*i/24; o.append([1.1*math.cos(f), 1.1*math.sin(f)])
    o += [[1.73,-0.48],[2.59,-0.58],[3.24,-0.60],[3.87,-0.97],[4.50,-1.06],[4.02,1.06],[3.49,0.905],[2.68,0.80],[1.61,0.75]]
    return np.array(o)*WFS
W = wpo(); W = np.vstack([W, W[:1]])
out = {}
fig, axs = plt.subplots(1, 2, figsize=(14, 6))
for ax, nm in zip(axs, ('studR', 'studL')):
    c = np.array([F[nm]['circle_mm']['x'], F[nm]['circle_mm']['z']])
    i0, j0 = int((c[1]-6-z0)*K), int((c[0]-6-x0)*K); sub = b[i0:i0+480, j0:j0+480]
    g = contourpy.contour_generator(z=sub); best = None
    for q in g.lines(13.0):
        P = np.c_[(q[:, 0]+j0+0.5)/K+x0, (q[:, 1]+i0+0.5)/K+z0]
        if len(P) > 30 and Path(P).contains_point(c) and np.hypot(*(P-c).T).max() < 5.9 and (best is None or len(P) > len(best)): best = P
    P = best; d = np.hypot(*(P-c).T); far = P[d > d.max()-0.45]; m = far.mean(0)
    s = (m-c)/np.linalg.norm(m-c); n = np.array([-s[1], s[0]])
    if n @ (C0-c) > 0: n = -n            # t negative toward the ratchet's centre, as WPO
    Q = np.c_[(P-c) @ s, (P-c) @ n]
    # the end: the face's points (s beyond max-0.25), their t span; widths across the arm at s stations
    tip = Q[:, 0].max(); e = Q[Q[:, 0] > tip-0.2]
    st = {}
    for sv in (1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.3, 4.6, 4.9):
        if sv > tip: continue
        cut = []
        for a, bb in zip(Q, np.roll(Q, -1, 0)):
            if (a[0]-sv)*(bb[0]-sv) < 0: cut.append(a[1]+(bb[1]-a[1])*(sv-a[0])/(bb[0]-a[0]))
        if len(cut) >= 2: st[sv] = [round(min(cut), 3), round(max(cut), 3)]
    # the model's at the same stations
    sm = {}
    for sv in st:
        cut = []
        for a, bb in zip(W[:-1], W[1:]):
            if (a[0]-sv)*(bb[0]-sv) < 0: cut.append(a[1]+(bb[1]-a[1])*(sv-a[0])/(bb[0]-a[0]))
        if len(cut) >= 2: sm[sv] = [round(min(cut), 3), round(max(cut), 3)]
    out[nm] = dict(stud=c.round(3).tolist(), tip_s=round(tip, 3), end_t=[round(e[:, 1].min(), 3), round(e[:, 1].max(), 3)], photo=st, model=sm, r_stud=round(float(np.hypot(*(c-C0))), 3))
    ax.plot(Q[:, 0], Q[:, 1], 'b-', lw=1, label='27:00 b* edge'); ax.plot(W[:, 0], W[:, 1], 'r-', lw=1, label='model WPO')
    ax.set_aspect('equal'); ax.grid(True, lw=0.3); ax.set_title(nm+' (s along the pawl, t across; t<0 toward the ratchet centre)'); ax.legend()
    np.save('Q_'+nm+'.npy', Q); np.save('P_'+nm+'.npy', P); np.save('A_'+nm+'.npy', np.r_[c, s, n])
plt.tight_layout(); plt.savefig('pawlframe.png', dpi=110)
print(json.dumps(out, indent=1))
