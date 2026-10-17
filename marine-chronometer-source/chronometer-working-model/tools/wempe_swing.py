"""The balance's swing of a running 6MX read frame by frame off a video (References/wempe/VIDEOS.md, "Measured"), for the Wempe's damping (TF), as swing.py
reads the Hamilton's. No browser; opencv-python, numpy, scipy, matplotlib. Needs the video in $MC_VIDEO (default ~/mc-video; video.py fetch), so it can't
run in ci.py. Plots and overlays go to $MC_VIDEO/swing/, the result to tools/wempe_swing.json.

  python wempe_swing.py moMvyx8eXfo       the measurement (about 8 minutes: 2,400 frames read in six still stretches, each window fitted on a grid)

What moMvyx8eXfo shows (A. Tkachenko / 6MX manufactory, 1080p 29.97 fps, 2022): a 6MX (No. 32332) out of its bowl, top plate up, the camera on a stand
from 17:53 to 19:50 looking down at about 25 deg; the balance (cut bimetallic rim, four masses, two timing nuts on the arm's ends) runs above the
plate under its cock, seen whole but for the cock's foot and the helical spring over its centre. Hands come in at 17:59-18:02 (tweezers pointed at
the balance), 18:13-18:18 (the movement lifted on its edge and set down), 18:35-18:37 (a finger and tool by it: the movement turned 10 deg on the table),
18:46-18:49 (the movement turned to and fro in the hands, the 6MX's start) and 19:13-19:20 (tweezers pointed); the six still stretches between are read.

Method. (1) Each stretch: the moving parts' sweep (max - min of 300 frames) fitted as an ellipse (swing.py's, a band's centroid along rays), its
affine angle the balance's (the view's ellipse is 0.90: an affine reading, perspective leaving a few degrees, below). (2) The arm: a steel bar across
the rim's diameter, grey on the gilt plate and gilt masses; each frame's saturation along the ellipse, scales 0.35-0.85 of the masses' circle (inside
the masses, outside the spring), less the stretch's median: the arm shows as a drop in saturation at its angle and at that plus 180 (its two ends:
folded, the arm's angle mod 180). (3) The balance seen from above repeats every 180 deg (four masses, two nuts, two cuts) and the frame rate samples a
0.5 s period about 15 times: a frame two periods on can't say how far the balance turned. So nothing is registered frame to frame: every frame's arm
profile is scored against the motion theta(t) = theta0 + A cos(2 pi f t + phi) (the arm's angle mod 180 at mid-exposure), A, theta0, phi and f fitted
over windows of 4 s (about 8 periods, 120 frames), A first on a grid 30-360 deg against the best of the others, then all refined. A's aliases are
the swings that put the turning points at the same angles mod 180 (A + 90 k): the frames between the turning points decide among them, and the
next alias's score is printed for each window. The staff's image at the arm's height isn't the sweep ellipse's centre (the masses stand 5.4 mm
proud): each stretch's is found where the folded arm's peaks are sharpest (a wrong centre splits the arm's two ends by 20 deg). (4) A(t) over the stretches; if it moves, fitted with A^2 -> Ainf^2 at exp(-2t/TF) (the balance's
averaged equation, model README "The balance's dynamics"): wempe_startup.js.
Rolling shutter: about 8 ms between the balance's top and bottom rows (30 ms a frame), a few degrees at mid-swing, alike in every period: it widens
the fit's scatter, not its A, which the turning points fix."""
import cv2, numpy as np, sys, os, json
from scipy.optimize import minimize
from scipy.ndimage import gaussian_filter1d
HOME = os.environ.get('MC_VIDEO', os.path.expanduser('~/mc-video')); OUT = os.path.join(HOME, 'swing'); JS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'wempe_swing.json')
def vid(i):
    fs = [os.path.join(HOME, f) for f in os.listdir(HOME) if i in f and f.split('.')[-1] in ('webm', 'mp4', 'mkv') and not f.endswith('.part')]
    if not fs: sys.exit(f'{i}: not in {HOME}; python video.py fetch {i}')
    return max(fs, key=os.path.getsize)
def mmss(t): return f'{int(t // 60)}:{t % 60:04.1f}'
def save(key, entry):
    d = json.load(open(JS, encoding='utf-8')) if os.path.exists(JS) else {}
    d[key] = entry; json.dump(d, open(JS, 'w', encoding='utf-8', newline=''), indent=1, ensure_ascii=False); print('wrote', JS)

FPS = 30000 / 1001
CFG = {'moMvyx8eXfo': dict(c0=(1075, 545), ref=1130.0, crop=(700, 250, 1450, 850), r=(60, 240),
       still=[(1073.5, 1077.5), (1084.0, 1091.5), (1098.5, 1113.5), (1119.0, 1125.5), (1130.0, 1151.5), (1164.0, 1189.5)])}

def ellipse(d, c0, r0, r1, thr):   # swing.py's: the sweep band's centroid along rays, a conic through it, outliers out
    P = []
    for a in np.radians(np.arange(0, 360, 1.0)):
        r = np.arange(r0, r1); x = c0[0] + r * np.cos(a); y = c0[1] + r * np.sin(a); v = d[y.astype(int), x.astype(int)]; k = v.argmax()
        if v[k] < thr: continue
        i0 = i1 = k; m = v > 0.5 * v[k]
        while i0 > 0 and m[i0 - 1]: i0 -= 1
        while i1 < len(v) - 1 and m[i1 + 1]: i1 += 1
        w = v[i0:i1 + 1] - 0.5 * v[k]; rc = (w * r[i0:i1 + 1]).sum() / w.sum(); P.append((c0[0] + rc * np.cos(a), c0[1] + rc * np.sin(a)))
    x, y = np.array(P).T; ok = np.ones(len(x), bool)
    for it in range(4):
        _, _, V = np.linalg.svd(np.c_[x * x, x * y, y * y, x, y, np.ones_like(x)][ok]); a, b, c, dd, e, f = V[-1]
        M = np.array([[a, b / 2], [b / 2, c]]); x0 = np.linalg.solve(2 * M, [-dd, -e]); k = -(f + a * x0[0] ** 2 + b * x0[0] * x0[1] + c * x0[1] ** 2 + dd * x0[0] + e * x0[1])
        w, U = np.linalg.eigh(M / k); ax = 1 / np.sqrt(w); q = np.c_[x - x0[0], y - x0[1]] @ U
        res = (np.sqrt((q[:, 0] / ax[0]) ** 2 + (q[:, 1] / ax[1]) ** 2) - 1) * np.sqrt(ax[0] * ax[1]); ok = np.abs(res) < max(2.5, 3 * np.median(np.abs(res)))
    if U[0, 0] < 0: U = -U   # the angle's zero along +x of the image, increasing clockwise on screen
    return x0, ax, U, float(np.abs(res[ok]).mean())

def stretch(cap, t0, t1, c0, C):   # frames of one still stretch: the ellipse, and each frame's arm profile (n x 360, the arm's angle mod 180 in 0.5 deg)
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t0 * FPS))); G = [cap.read()[1] for _ in range(int((t1 - t0) * FPS))]
    sw = np.array(G[:300]); d = cv2.GaussianBlur((sw.max(0).astype(float) - sw.min(0)).mean(-1), (0, 0), 2); x0, ax, U, erms = ellipse(d, c0, *C['r'], 60)
    x, y, X, Y = C['crop']; G0 = G[0]; sats = [cv2.cvtColor(g[y:Y, x:X], cv2.COLOR_BGR2HSV)[..., 1] for g in G]; del G, sw
    al = np.radians(np.arange(720) * 0.5); S = np.linspace(0.35, 0.85, 30)
    def prof(c, idx):   # the arm's profile about centre c (image px) for frames idx: the folded saturation drop, z-scored, 2 deg smoothing
        P = (c[:, None, None] - [[[x]], [[y]]] + np.einsum('ij,jkl->ikl', U, np.stack([ax[0] * S[:, None] * np.cos(al)[None], ax[1] * S[:, None] * np.sin(al)[None]]))).astype(np.float32)
        sat = np.array([cv2.remap(sats[i], P[0], P[1], cv2.INTER_LINEAR) for i in idx]).astype(np.float32)
        pr = np.clip(np.median(sat, 0) - sat, 0, None).mean(1); pr = pr[:, :360] + pr[:, 360:]
        pr = gaussian_filter1d(pr, 4, axis=1, mode='wrap'); return (pr - np.median(pr, 1, keepdims=True)) / (pr.std(1, keepdims=True) + 1e-6)
    # the staff's image at the arm's height: the sweep's ellipse is the masses' (5.4 mm tall), its centre off the staff's by several px, which splits
    # the arm's two ends when folded (a peak doubled 20-25 deg apart at 0.35-0.85 of the radius). The centre taken where the folded peaks are sharpest
    idx = np.arange(0, len(sats), max(1, len(sats) // 90)); best = (-1, x0)
    for r, st in ((36, 6.0), (6, 1.0)):
        c0b = best[1]
        for dx in np.arange(-r, r + 0.1, st):
            for dy in np.arange(-r, r + 0.1, st):
                c = c0b + [dx, dy]; v = prof(c, idx).max(1).mean()
                if v > best[0]: best = (v, c)
    xc = best[1]; pr = prof(xc, range(len(sats)))
    return dict(t=t0 + np.arange(len(sats)) / FPS, pr=pr, x0=x0, xc=xc, ax=ax, U=U, erms=erms, G0=G0)

def look(pr, psi):   # each frame's profile at the predicted angle (deg, mod 180), linear
    u = (np.asarray(psi) % 180) * 2; i = np.floor(u).astype(int); w = u - i; n = np.arange(len(pr))
    return pr[n, i % 360] * (1 - w) + pr[n, (i + 1) % 360] * w
def model(q, t): return q[1] + q[0] * np.cos(2 * np.pi * q[3] * t + q[2])   # A, theta0, phi, f
def fit(t, pr, Agrid):   # the window's best (A, theta0, phi, f) for each A of the grid (theta0, phi on a grid, f 2 Hz; then refined), and the best of all
    tt = t - t[0]; th0 = np.arange(0, 180, 3.0); ph = np.radians(np.arange(0, 360, 4.0)); curve = []
    for A in Agrid:
        psi = th0[:, None, None] + A * np.cos(2 * np.pi * 2.0 * tt[None, None, :] + ph[None, :, None])   # th0 x phi x frames
        u = (psi % 180) * 2; i = np.floor(u).astype(int); w = u - i; n = np.arange(len(tt))
        s = (pr[n, i % 360] * (1 - w) + pr[n, (i + 1) % 360] * w).mean(-1); k = np.unravel_index(s.argmax(), s.shape)
        curve.append((A, s[k], th0[k[0]], ph[k[1]]))
    curve = np.array(curve); best = None
    for A, s, a0, p0 in curve[np.argsort(-curve[:, 1])[:6]]:   # refine the six best grid points (all free, f within 1.99-2.01 Hz)
        r = minimize(lambda q: -look(pr, model(q, tt)).mean() + (0 if abs(q[3] - 2) < 0.01 else 1e3), [A, a0, p0, 2.0], method='Nelder-Mead', options=dict(xatol=0.01, fatol=1e-5, maxiter=4000))
        if best is None or r.fun < best.fun: best = r
    return curve, best.x, -best.fun

def measure(vid_id):
    C = CFG[vid_id]; os.makedirs(OUT, exist_ok=True); cap = cv2.VideoCapture(vid(vid_id))
    x, y, X, Y = C['crop']; refm = None; rows = []; curves = []; stats = []; Agrid = np.arange(30, 361, 2.0); win = int(4 * FPS)
    def med(t):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * FPS))); return np.median(np.array([cv2.cvtColor(cap.read()[1][y:Y, x:X], cv2.COLOR_BGR2GRAY) for _ in range(30)]), 0).astype(np.float32)
    refm = med(C['ref']); hw = cv2.createHanningWindow(refm.shape[::-1], cv2.CV_32F)
    for t0, t1 in C['still']:
        sh, resp = cv2.phaseCorrelate(refm, med(t0), hw); c0 = (C['c0'][0] + sh[0], C['c0'][1] + sh[1]); S = stretch(cap, t0, t1, c0, C)
        print(f'{mmss(t0)}-{mmss(t1)}: {len(S["t"])} frames, the balance shifted ({sh[0]:+.0f}, {sh[1]:+.0f}) px; sweep ellipse ({S["x0"][0]:.0f}, {S["x0"][1]:.0f}) {2*S["ax"][0]:.0f} x {2*S["ax"][1]:.0f} px, rms {S["erms"]:.1f} px; the staff at ({S["xc"][0]-S["x0"][0]:+.1f}, {S["xc"][1]-S["x0"][1]:+.1f}) px from its centre')
        stats.append(dict(stretch=f'{mmss(t0)}-{mmss(t1)}', frames=len(S['t']), ellipse_px=[round(float(v), 1) for v in [*S['x0'], *(2 * S['ax'])]], rms_px=round(S['erms'], 1), staff_offset_px=[round(float(v), 1) for v in S['xc'] - S['x0']]))
        for k in range(0, len(S['t']) - win // 2, win // 2 if len(S['t']) >= win else len(S['t'])):
            sl = slice(k, min(k + win, len(S['t']))); t, pr = S['t'][sl], S['pr'][sl]
            if len(t) < 60: continue
            cv, q, sc = fit(t, pr, Agrid); A = abs(q[0])
            # the aliases: the grid's best within each 90 deg step of A
            al = sorted(((cv[np.abs(cv[:, 0] - (A + 90 * j)) <= 10, 1].max(), A + 90 * j) for j in range(-3, 4) if 30 <= A + 90 * j <= 360), reverse=True)
            rows.append(dict(t=float(t.mean()), A=float(A), theta0=float(q[1] % 180), f=float(q[3]), score=float(sc), runner=float(al[1][1]) if len(al) > 1 else None, margin=float(al[0][0] - al[1][0]) if len(al) > 1 else None))
            curves.append(cv[:, 1]); r = rows[-1]
            print(f'  {mmss(r["t"])}: A {r["A"]:6.1f} deg, rest {r["theta0"]:5.1f}, {r["f"]:.4f} Hz, score {r["score"]:.2f}; next alias {r["runner"]:.0f} deg, {r["margin"]:.2f} lower')
    R = np.array([[r['t'], r['A'], r['score'], r['f'], r['margin']] for r in rows]); runners = sorted({int(round(r['runner'])) for r in rows})
    print(f'A from {R[:, 1].min():.1f} to {R[:, 1].max():.1f} deg over {len(R)} windows (each stretch relaxing: wempe_startup.js fits them); scores {R[:, 2].min():.2f}-{R[:, 2].max():.2f}, '
          f'the next alias in each window {R[:, 4].min():.2f}-{R[:, 4].max():.2f} lower (A + 90 k: ' + ', '.join(f'{v}' for v in runners) + ' deg)')
    print(f'  the balance\'s frequency in file time {np.median(R[:, 3]):.4f} Hz (2 Hz: a 0.5 s period)')
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    fig, axs = plt.subplots(1, 2, figsize=(12, 4.2))
    axs[0].plot(R[:, 0], R[:, 1], 'k.'); axs[0].axhspan(225, 270, color='C2', alpha=.15, label='1954 instruction 225-270 deg')
    axs[0].set_xlabel(f'{vid_id} time (s)'); axs[0].set_ylabel('swing A (deg)'); axs[0].set_ylim(0, 360); axs[0].legend(fontsize=7); axs[0].grid(alpha=.3)
    for k, cl in ((int(np.argmin(np.abs(R[:, 0] - 1110))), 'C0'), (int(np.argmin(np.abs(R[:, 0] - 1140))), 'C3')):
        axs[1].plot(Agrid, curves[k], color=cl, label=f'window at {mmss(R[k, 0])}: best {R[k, 1]:.0f} deg')
    axs[1].set_xlabel('A (deg)'); axs[1].set_ylabel('score (the others fitted)'); axs[1].legend(fontsize=7); axs[1].grid(alpha=.3)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, f'wempe_swing_{vid_id}.png'), dpi=90); print('  figure:', os.path.join(OUT, f'wempe_swing_{vid_id}.png'))
    save(vid_id, {'A_range_deg': [round(float(R[:, 1].min()), 1), round(float(R[:, 1].max()), 1)], 'windows': len(R), 'f_Hz': round(float(np.median(R[:, 3])), 4),
        'alias_margin': [round(float(R[:, 4].min()), 2), round(float(R[:, 4].max()), 2)], 'aliases_seen_deg': runners, 'stretches': stats,
        'A_t': [[round(r['t'], 1), round(r['A'], 1), round(r['score'], 2), round(r['margin'], 2)] for r in rows],
        'sure': 'the alias (A + 90 k) certain in every window (the next 1.4-2.1 lower against scores of 3.1-3.6, the frames between the turning points deciding); '
                'each reading to about 2 deg against its neighbours; the scale (the ellipse\'s affine angle at a 0.90 view, the staff\'s image fitted per stretch) a few percent, '
                'and between stretches the staff and ellipse are fitted anew (3 % between them moves wempe_startup.js\'s TF 13 %)'})

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    measure(a[0])
