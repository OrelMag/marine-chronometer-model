"""The barrel bridge's horn end on the cock's side (BB_NE: from the cut round the balance to the rim), read as a machined edge: a line or
a circle, decided by BIC, and its place.

KLUwI2UUCMQ 13:04.2 and 13:04.4 (the bridge upside down on the mat, nearly face-on; 13:04.0 too, the softest): each frame's camera solved
by tools/edgetrace.py on the barrel's and fusee's bushings and the bridge's screw holes (E:\\mc-video\\oq\\reanchor\\et\\et_bb_13-04.*.json,
19 October 2026), and the outline's edge pixels it traced along the model's normals. Those pixels are put back on the plane of the face
whose edge the outline is: for each frame the bridge's wall faces away from the camera (printed), so the far face's edge is hidden behind
the near one and the silhouette is the near face's, the plate side (y -23.76) less its 0.25 bevel (-24.01); the trace of 19 October put
them on the far face (-27.16), 0.4-0.5 mm out. Then, per frame and jointly (one circle, each frame its own shift: its camera's offset), a
line and a circle (mfgfit.fit_circle) with their rms and BIC; and how far the cock's top-face edge (CK_TR, movement.js) lies inside the
circle (the bridge is outside it), negative where they would overlap. The camera registration between 13:03.8-13:04.4 is 0.1 px (SIFT on
the bridge), so the frames are one view with their own noise.

  python bb_hornend.py [--y Y] [--json OUT]"""
import json, sys, os, math, numpy as np, cv2
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D); a = sys.argv[1:]
Y = float(a[a.index('--y') + 1]) if '--y' in a else -24.01; jout = a[a.index('--json') + 1] if '--json' in a else None
sys.argv = sys.argv[:1]; import mfgfit as m, edgetrace as et
from scipy.optimize import least_squares
V = os.environ.get('MC_VIDEO', r'E:\mc-video'); ET = os.path.join(V, 'oq', 'reanchor', 'et')
A, B = np.array([20.72, 5.44]), np.array([38.90, 15.95]); L = np.linalg.norm(B - A); u = (B - A)/L; n = np.array([-u[1], u[0]])   # the 19 October line
CK = np.array([[22.17, 8.07], [23.63, 8.53], [25.08, 9.04], [26.54, 9.54], [28.00, 10.00], [29.47, 10.47], [30.89, 11.04], [32.25, 11.75], [33.57, 12.54], [34.84, 13.40], [36.05, 14.35]])
def bic(r, k): N = len(r); return N*math.log((r**2).sum()/N) + k*math.log(N)
out, Xs = {}, []
for t in ('13-04.0', '13-04.2', '13-04.4'):
    E = json.load(open(os.path.join(ET, f'et_bb_{t}.json'))); C = E['camera']; cam = et.Cam(C['W'], C['H'], C['k1'], C['pp']); p = np.array(C['p'])
    R, _ = cv2.Rodrigues(p[:3]); Cw = -R.T @ p[3:6]
    O = E['outlines']['outline']; P = np.array(O['px'], float); st = np.array(O['strength']); X = cam.onplane(p, P, Y)[:, [0, 2]]
    tt = (X - A) @ u; d = (X - A) @ n; X = X[(tt > 2.5) & (tt < 17.0) & (np.abs(d) < 1.5) & (st > 0.15)]
    q = m.fit_circle(X); rc = np.hypot(*(X - q[:2]).T) - q[2]; c0 = X.mean(0); _, _, vt = np.linalg.svd(X - c0); rl = (X - c0) @ vt[1]
    mid = X[len(X)//2]; wall = np.array([q[0] - mid[0], 0, q[1] - mid[1]]); faces = float((Cw - [mid[0], Y, mid[1]]) @ wall) > 0
    out[t] = dict(n=len(X), r=float(q[2]), c=[float(q[0]), float(q[1])], circ_rms=float(np.sqrt((rc**2).mean())), line_rms=float(np.sqrt((rl**2).mean())),
                  bic_circ=bic(rc, 4), bic_line=bic(rl, 3), wall_faces_camera=faces)
    print(f'{t}: {len(X)} points; circle r {q[2]:.2f} about ({q[0]:.2f}, {q[1]:.2f}) rms {out[t]["circ_rms"]:.3f}; line rms {out[t]["line_rms"]:.3f}; '
          f'BIC circle {out[t]["bic_circ"]:.0f}, line {out[t]["bic_line"]:.0f}; the wall faces the camera: {faces}')
    if t != '13-04.0': Xs.append(X)   # the softest frame left out of the joint fit
res = lambda q: np.r_[np.hypot(*(Xs[0] - q[:2]).T) - q[2], np.hypot(*(Xs[1] - q[:2] - q[3:5]).T) - q[2]]
s = least_squares(res, np.r_[m.fit_circle(np.vstack(Xs)), 0, 0]); q = s.x; rr = res(q); sd = np.sqrt(np.diag(np.linalg.inv(s.jac.T @ s.jac)*(rr**2).sum()/(len(rr) - 5)))
c = q[:2] - q[3:5]/2; r = q[2]
print(f'\n13:04.2 and 13:04.4 as one circle at y {Y}: r {r:.2f} +-{sd[2]:.2f} about ({c[0]:.2f}, {c[1]:.2f}) +-({sd[0]:.2f}, {sd[1]:.2f}); the frames {np.hypot(*q[3:5]):.2f} mm apart; rms {np.sqrt((rr**2).mean()):.3f}')
ins = [round(float(r - np.hypot(*(k - c))), 2) for k in CK]; print("CK_TR inside the circle by (negative: past the bridge's edge):", list(zip(CK[:, 0].tolist(), ins)))
out['joint'] = dict(y=Y, r=float(r), c=[float(c[0]), float(c[1])], sd=sd[:3].tolist(), rms=float(np.sqrt((rr**2).mean())), ck_inside=ins)
if jout: json.dump(out, open(jout, 'w'), indent=1); print('->', jout)
