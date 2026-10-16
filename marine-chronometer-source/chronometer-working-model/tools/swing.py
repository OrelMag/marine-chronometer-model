"""The balance's swing (amplitude, degrees each side of rest) read frame by frame off a video of a running Model 21 (References/VIDEOS.md,
"Methods"). No browser; opencv-python, numpy, scipy, matplotlib. Needs the videos in $MC_VIDEO (default ~/mc-video; video.py fetch), so it
can't run in ci.py. Plots and overlays go to $MC_VIDEO/swing/, the result to tools/swing.json (one entry per video, merged).

  python swing.py We1dLNXiBj0        the measurement (about 7 s: 2,400 frames read, the rest is arithmetic)
  python swing.py survey             write the surveyed and rejected videos (with the reasons) into swing.json, no video read

What We1dLNXiBj0 shows (bunnspecial, Part 1 of 3, 720p 29.97 fps): the camera on a tripod from 0:45 to 2:04 (the plate moves < 0.4 px),
the balance's screws seen through the train bridge's cutouts. The balance stands still until 0:52.6 (at rest), then a stick turns it
about 65 deg (0:52.6-0:55.2) and lets go: the balance starts from that angle and the escapement builds the swing up. So this is not a
steady swing but a start: A(t) from about 66 deg to the end of the stretch (2:04), where it is still rising about 1 deg/s.

Method. (1) The screws' sweep (max - min over 10 s) fitted as an ellipse; every frame sampled along it, 0.5 deg a column (the ellipse's
affine angle; the lower cutout's comb of screws comes out at 15.0 deg a hole there, the 24 holes of the parts list, so that window's
angle is the balance's to about 1 %; the upper cutout reads 6 % short and is scaled to it). (2) Turning points by mirror symmetry
(frames t0-d and t0+d look alike about a turning point, blur included): two a period, 7.5 frames apart; timed in each cutout
separately, the lower one 0.24 frame earlier than the upper (a rolling shutter reading the 720 rows in about 21 ms). (3) The frame
nearest each turning point is nearly sharp (its exposure folds about the turn); the frames between are smeared over 40-100 deg and are
not used. Each turning point's frame is registered on the same side's frame two periods later, after taking out the background (the
median of the neighbouring turning-point frames, which removes the static cutout edges that otherwise pin a registration at 0): how far
that extreme moved. Both extremes move apart by the same amount (the swing grows about a fixed centre), which checks it; where one side
shows no screws in the cutouts (66-80 s on one side, 77-100 s on the other) the other side carries it. Summed: the growth of A.
(4) The start: the twist from the rest frame to the release, registered frame by frame (62-66 deg, +-5: for 1.3 s only the cutout
with the stick shows screws), and, cross-cutout, the screws of the release frame found again in the first opposite turning point, which
gives the first swing 2A modulo one screw hole (15 deg: the screws stand in every hole over long stretches); the twist picks the two
nearest aliases (A0 = 62.6 or 70.1). (5) The growth, likewise, is fixed modulo a hole: the first and last turning-point frames show the
same screws, 1.8 deg (mod 15) apart, on both sides. The summed growth (3) is 191 deg, between 181.8 and 196.8 (196.8 the nearer); the
screws stand in long combs, so the patterns can't tell the hole count (a gap edge in the lower cutout sits on a static feature at 90 deg,
and the late release-side turns all fall half a frame from a frame, smeared). A slip of a whole hole can't hide in a registered link
(it would be a 15 deg/s outlier in dA/dt, in both cutouts); it could only hide in the 4.8 s where neither side shows screws (1:15.7-
1:20.5, about 12 deg interpolated): +15 there needs about 6 deg/s against 3.6 before and 2.0-2.4 after, +30 about 9 deg/s; and the
one-side stretches (1:06-1:15, 1:21-1:40) show no step in dA/dt where the second side joins, and screw-head tracking gives the same
rate (1.6-2.2 deg/s at 1:25-1:40). So 211.8 is unlikely, 181.8 and 196.8 are both kept (its fit extrapolates to Ainf 319-353 deg).
A = the mean of the four combinations, +- their spread (and 3 deg for registration and scale). (6) A(t) fitted with
the model's averaged balance equation, A^2 -> Ainf^2 at exp(-2t/TF) (model README, "The balance's dynamics"), Ainf and TF free: an
extrapolation, the swing being still on the rise.
Rolling shutter: turning points timed per cutout; at a turning point the angle changes slowly, so it moves the reading < 0.1 deg."""
import cv2, numpy as np, sys, os, json
from scipy.signal import find_peaks
from scipy.optimize import least_squares
HOME = os.environ.get('MC_VIDEO', os.path.expanduser('~/mc-video')); OUT = os.path.join(HOME, 'swing'); JS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'swing.json')
def vid(i):
    fs = [os.path.join(HOME, f) for f in os.listdir(HOME) if i in f and f.split('.')[-1] in ('webm', 'mp4', 'mkv')]
    if not fs: sys.exit(f'{i}: not in {HOME}; python video.py fetch {i}')
    return max(fs, key=os.path.getsize)
def mmss(t): return f'{int(t // 60)}:{t % 60:04.1f}'
def save(key, entry):
    d = json.load(open(JS, encoding='utf-8')) if os.path.exists(JS) else {}
    d[key] = entry; json.dump(d, open(JS, 'w', encoding='utf-8', newline='\n'), indent=1, ensure_ascii=False); print('wrote', JS)

FPS = 30000 / 1001   # the file's rate: frame times are n/FPS (checked: 33/34 ms steps, no dropped or doubled frames)
CFG = {'We1dLNXiBj0': dict(t=(44.0, 124.0), sweep=(60.0, 70.0), c0=(605, 414), rest=(46.0, 52.4), twist=(1574, 1654), release=1654,
       win={'lower': (76, 146), 'upper': (251, 312)}, upper_k=1.06)}   # cutouts in the ellipse's angle (deg); upper_k: its angle scale (comb pitch 14.1 against the lower's 15.0)

def ellipse(mx, mn, c0):   # the screws' sweep band: centroid radius of max - min along rays, a conic through it, outliers out
    d = cv2.GaussianBlur((mx.astype(float) - mn.astype(float)).mean(-1), (0, 0), 1.5); P = []
    for a in np.radians(np.arange(0, 360, 1.0)):
        r = np.arange(105, 195); x = c0[0] + r * np.cos(a); y = c0[1] + r * np.sin(a); v = d[y.astype(int), x.astype(int)]; k = v.argmax()
        if v[k] < 120: continue
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
    return x0, ax, U, np.abs(res[ok]).mean()

def ncc(a, b): a = a - a.mean(); b = b - b.mean(); return (a * b).sum() / np.sqrt((a * a).sum() * (b * b).sum() + 1e-9)
def reg(a, b, m, D):   # the shift d (0.5 deg bins) with a(alpha) ~ b(alpha - d), sub-bin by a parabola; returns deg, peak
    r = np.array([ncc(a[..., m & np.roll(m, d)], np.roll(b, d, -1)[..., m & np.roll(m, d)]) for d in D]); i = int(r.argmax()); o = 0.0
    if 0 < i < len(D) - 1: o = 0.5 * (r[i - 1] - r[i + 1]) / (r[i - 1] - 2 * r[i] + r[i + 1])
    return (D[i] + o) * 0.5, r[i]
def peaks(row, m):   # screw heads: bright peaks along the band, sub-bin
    d = row - np.convolve(row, np.ones(41) / 41, 'same'); pk, _ = find_peaks(d, prominence=15, distance=8)
    return np.array([i * 0.5 + 0.25 * (d[i - 1] - d[i + 1]) / (d[i - 1] - 2 * d[i] + d[i + 1]) for i in pk if m[i]])

def measure(vid_id):
    C = CFG[vid_id]; os.makedirs(OUT, exist_ok=True); cap = cv2.VideoCapture(vid(vid_id)); N0 = int(round(C['t'][0] * FPS)); N1 = int(round(C['t'][1] * FPS))
    cap.set(cv2.CAP_PROP_POS_FRAMES, N0); G = [cap.read()[1] for _ in range(N1 - N0)]
    s0, s1 = (int(round(t * FPS)) - N0 for t in C['sweep']); sw = np.array(G[s0:s1]); x0, ax, U, erms = ellipse(sw.max(0), sw.min(0), C['c0'])
    al = np.arange(720) * 0.5; S = np.linspace(0.84, 1.06, 24); th = np.radians(al)
    P = x0[:, None, None] + np.einsum('ij,jkl->ikl', U, np.stack([ax[0] * S[:, None] * np.cos(th)[None], ax[1] * S[:, None] * np.sin(th)[None]]))
    K = np.array([cv2.remap(cv2.cvtColor(g, cv2.COLOR_BGR2GRAY), P[0].astype(np.float32), P[1].astype(np.float32), cv2.INTER_LINEAR) for g in G]).astype(np.float32)
    W = {w: (al >= a) & (al <= b) for w, (a, b) in C['win'].items()}; fr = lambda n: int(n) - N0
    print(f'{vid_id}: {len(K)} frames {mmss(C["t"][0])}-{mmss(C["t"][1])}, sweep ellipse ({x0[0]:.0f}, {x0[1]:.0f}) {2*ax[0]:.0f} x {2*ax[1]:.0f} px, rms {erms:.2f} px')
    # turning points by mirror symmetry, from the release on, every cutout apart (rolling shutter)
    i0 = fr(C['release']) - 2; Z = {w: K[i0:][:, :, m].reshape(len(K) - i0, -1) for w, m in W.items()}
    for w in Z: Z[w] = Z[w] - Z[w].mean(1, keepdims=True); Z[w] /= np.linalg.norm(Z[w], axis=1, keepdims=True)
    def mirror(z):
        M = np.full(2 * len(z), np.nan)
        for h2 in range(4, 2 * len(z) - 5):
            h = h2 / 2; M[h2] = np.mean([(z[int(np.floor(h - d))] * z[int(np.ceil(h + d))]).sum() for d in ((0.5, 1.5) if h2 % 2 else (1, 2))])
        return M
    Ms = {w: mirror(z) for w, z in Z.items()}; Mm = np.nanmean(np.array(list(Ms.values())), 0); hh = i0 + N0 + np.arange(len(Mm)) / 2
    sub = lambda M, i: hh[i] + (0.25 * (M[i - 1] - M[i + 1]) / (M[i - 1] - 2 * M[i] + M[i + 1]) if M[i - 1] - 2 * M[i] + M[i + 1] < 0 else 0)
    j = max(range(int((C['release'] + 5.5 - hh[0]) * 2), int((C['release'] + 9.5 - hh[0]) * 2)), key=lambda q: Mm[q]); ap = [sub(Mm, j)]   # the first turn after the release
    while ap[-1] + 9 < N0 + len(K) - 4:
        pred = ap[-1] + (ap[-1] - ap[-2] if len(ap) > 1 else 7.5); i = int(round((pred - hh[0]) * 2)); j = max(range(i - 3, i + 4), key=lambda q: Mm[q]); ap.append(sub(Mm, j))
    ap = np.array(ap); apw = {w: np.array([sub(M, max(range(int(round((a - hh[0]) * 2)) - 2, int(round((a - hh[0]) * 2)) + 3), key=lambda q: M[q])) for a in ap]) for w, M in Ms.items()}
    rs = np.nanmedian(apw['lower'] - apw['upper']); T = 2 * np.median(np.diff(ap)) / FPS
    print(f'  {len(ap)} turning points, period {T:.5f} s (file time; {np.diff(ap)[:10].mean()*2:.3f} frames a period at the start, {np.diff(ap)[-40:].mean()*2:.3f} at the end); lower cutout {rs:+.2f} frame against the upper (rolling shutter)')
    # each side's turning-point frames registered two periods on, background = median of the neighbouring turning-point frames
    t = ap / FPS; D = np.arange(-80, 81); seg = {}
    for par in (0, 1):   # 0: the side opposite the release (first turn), 1: the release side
        ks = list(range(par, len(ap), 2)); F = np.array([K[fr(round(ap[k]))] for k in ks]); rows = []
        for r in range(0, len(ks) - 2, 2):
            bg = np.median(F[max(0, r - 10):r + 12], 0); row = [t[ks[r]], t[ks[r + 2]]]
            for w in W: row += list(reg(F[r + 2] - bg, F[r] - bg, W[w], D))
            rows.append(row)
        seg[par] = np.array(rows)   # t0, t1, lower shift, corr, upper shift, corr
    def good(r): return r[3] > 0.75 and r[5] > 0.75 and abs(r[2] - C['upper_k'] * r[4]) < max(1.5, 0.25 * abs(r[2]))
    grid = np.arange(t[0], t[-1], 1.0); rate = {}
    for par in (0, 1):
        g = [(0.5 * (r[0] + r[1]), (-1 if par else 1) * 0.5 * (r[2] + C['upper_k'] * r[4]) / (r[1] - r[0])) for r in seg[par] if good(r)]
        rate[par] = np.array(g)
    R = []   # dA/dt (deg/s) on a 1 s grid: the sides that are good there, averaged; gaps interpolated
    for x in grid:
        v = [rr[np.abs(rr[:, 0] - x) <= 0.75, 1].mean() for rr in rate.values() if (np.abs(rr[:, 0] - x) <= 0.75).any()]
        R.append(np.mean(v) if v else np.nan)
    R = np.array(R); gap = np.isnan(R); R[gap] = np.interp(grid[gap], grid[~gap], R[~gap]); dA = np.r_[0, np.cumsum(0.5 * (R[1:] + R[:-1]))]
    # the twist: rest frame to the release, frame by frame, the cutout that moves most (the others go blank or show the stick)
    Wt = dict(W, golden=(al >= 170) & (al <= 233)); tw = 0.0; Dt = np.arange(-30, 31)
    for n in range(*C['twist']):
        s = [reg(K[fr(n + 1)], K[fr(n)], m, Dt) for m in Wt.values()]; tw += max(s, key=lambda q: abs(q[0]))[0]
    # cross-cutout: release frame's screws in the first opposite turning point (lower -> upper, upper -> lower)
    rel = K[fr(C['release'] - 1)][4:16].mean(0); first = K[fr(round(ap[0]))][4:16].mean(0); mk = {w: np.isin(np.arange(720), np.where(m)[0]) for w, m in W.items()}
    pl, pu = peaks(rel, W['lower']), peaks(first, W['upper']); pu2, pl2 = peaks(rel, W['upper']), peaks(first, W['lower'])
    def best(a, b, lo, hi):   # shift x (deg) putting peaks a onto peaks b
        xs = np.arange(lo, hi, 0.25); c = [np.mean([np.min(np.abs(b - (q + x))) for q in a]) for x in xs]; return xs[int(np.argmin(c))], min(c)
    x1, e1 = best(pl, pu, 100, 200); x2, e2 = best(pu2 - 360, pl2, 100, 200)
    exp2 = 2 * abs(tw) + R[0] * T / 2; two = np.array([x1 + 15 * k for k in range(-6, 7)]); two = np.sort(two[np.argsort(np.abs(two - exp2))[:2]]); A0s = two / 2   # the twist is good to a few deg only: the two aliases nearest it
    print(f'  twist {tw:+.1f} deg (rest {mmss(C["rest"][0])}-{mmss(C["rest"][1])} to the release {mmss(C["release"] / FPS)}); first swing 2A = {x1 % 15:.1f} / {x2 % 15:.1f} deg mod 15 (lower->upper / upper->lower, '
          f'peak misfit {e1:.1f} / {e2:.1f} deg): with the twist (2A about {exp2:.0f}), A0 = {A0s[0]:.1f} or {A0s[1]:.1f} deg at {mmss(ap[0] / FPS)}')
    # growth modulo a hole: first against last turning-point frame, same cutout, same side
    md = []
    for par in (0, 1):
        a, b = peaks(K[fr(round(ap[par]))][4:16].mean(0), W['lower']), peaks(K[fr(round(ap[len(ap) - 2 + par]))][4:16].mean(0), W['lower'])
        xs = np.arange(-7.5, 7.5, 0.1); c = [np.mean([np.min(np.abs(((b - (q + (1 if par == 0 else -1) * x)) + 7.5) % 15 - 7.5)) for q in a]) for x in xs]; md.append(xs[int(np.argmin(c))])
    dm = np.mean(md) % 15; Dint = dA[-1]; cand = np.array([15 * k + dm for k in range(int(Dint // 15) - 2, int(Dint // 15) + 3)]); Ds = np.sort(cand[np.argsort(np.abs(cand - Dint))[:2]])
    print(f'  growth summed {Dint:.1f} deg; first vs last turning points {md[0]:+.1f} / {md[1]:+.1f} deg mod 15 (both sides): {Ds[0]:.1f} or {Ds[1]:.1f} (the two aliases nearest the sum; one more hole, +15, would need a 6 deg/s burst in the 4.8 s with no screws in view)')
    combos = np.array([a0 + d for a0 in A0s for d in Ds]); Ae = combos.mean(); sA = np.sqrt(combos.var() + 3 ** 2)   # 3 deg: registration and scale, beside the aliases
    A0, Dsel = A0s.mean(), Ds.mean(); At = A0 + dA * Dsel / Dint
    f = lambda q, x: np.sqrt(np.maximum(q[0] ** 2 - (q[0] ** 2 - q[1] ** 2) * np.exp(-2 * (x - grid[0]) / q[2]), 0))
    fits = [least_squares(lambda q: f(q, grid) - (a0 + dA * d / Dint), [270, a0, 50], bounds=([150, 0, 5], [400, 200, 300])).x for a0 in A0s for d in Ds]
    q = least_squares(lambda q: f(q, grid) - At, [270, A0, 50], bounds=([150, 0, 5], [400, 200, 300])).x; rr = f(q, grid) - At
    print(f'  A = {Ae:.0f} +- {sA:.0f} deg at {mmss(grid[-1])} (the aliases {", ".join(f"{c:.0f}" for c in np.sort(combos))}), rising {R[-8:].mean():.2f} deg/s; fit A^2 -> Ainf^2 exp(-2t/TF): '
          f'Ainf {q[0]:.0f} deg, TF {q[2]:.0f} s, rms {rr.std():.1f} deg (over the aliases Ainf {min(x[0] for x in fits):.0f}-{max(x[0] for x in fits):.0f}, TF {min(x[2] for x in fits):.0f}-{max(x[2] for x in fits):.0f} s)')
    # figures
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    fig, axs = plt.subplots(1, 2, figsize=(12, 4.2))
    axs[0].fill_between(grid, A0s[0] + dA * Ds[0] / Dint, A0s[1] + dA * Ds[1] / Dint, color='0.85', label='the aliases (start, growth)'); axs[0].plot(grid, At, 'k', label='measured (middle)')
    axs[0].plot(grid, f(q, grid), 'C1--', label=f'A$^2$ relaxation: A$_\\infty$ {q[0]:.0f}, TF {q[2]:.0f} s'); axs[0].axhspan(247.5, 270, color='C2', alpha=.15, label='manual 247.5-270 deg')
    axs[0].axhline(255, color='C0', lw=.8, label='model 255 deg'); axs[0].set_xlabel(f'{vid_id} time (s)'); axs[0].set_ylabel('swing A (deg)'); axs[0].legend(fontsize=7); axs[0].grid(alpha=.3)
    for par, cl in ((0, 'C0'), (1, 'C3')): axs[1].plot(rate[par][:, 0], rate[par][:, 1], '.', color=cl, label=('opposite side' if par == 0 else 'release side'))
    axs[1].plot(grid, R, 'k-', lw=.8, label='used'); axs[1].set_xlabel('time (s)'); axs[1].set_ylabel('dA/dt (deg/s)'); axs[1].legend(fontsize=7); axs[1].grid(alpha=.3)
    fig.tight_layout(); fig.savefig(os.path.join(OUT, f'swing_{vid_id}.png'), dpi=90)
    def ticks(n, name):
        cap.set(cv2.CAP_PROP_POS_FRAMES, n); g = cv2.resize(cap.read()[1], None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC); Pt = lambda a, s: 2 * (x0 + U @ np.array([ax[0] * s * np.cos(np.radians(a)), ax[1] * s * np.sin(np.radians(a))]))
        for a in range(0, 360, 5): cv2.line(g, tuple(np.int32(Pt(a, 1.03))), tuple(np.int32(Pt(a, 1.13 if a % 15 == 0 else 1.08))), (0, 255, 255) if a % 30 else (0, 0, 255), 1)
        for a in range(0, 360, 30): cv2.putText(g, str(a), tuple(np.int32(Pt(a, 1.2) - [12, -5])), 0, 0.5, (0, 255, 0), 1)
        g = g[300:1300, 700:1760]; cv2.putText(g, f'{name} {mmss(n / FPS)} (frame {n})', (10, 30), 0, 0.9, (0, 255, 0), 2); return g
    sharp = lambda par: int(round(min([a for k, a in enumerate(ap) if k % 2 == par and k >= len(ap) - 20], key=lambda a: abs(round(a) - a))))   # the late turn nearest a frame: the sharpest
    ov = [ticks(int(np.mean([int(round(x * FPS)) for x in C['rest']])), 'rest'), ticks(C['release'] - 1, 'held, before release'), ticks(int(round(ap[0])), 'first turn, opposite side'),
          ticks(int(round(ap[1])), 'first turn, release side'), ticks(sharp(0), 'late turn, opposite side'), ticks(sharp(1), 'late turn, release side')]
    cv2.imwrite(os.path.join(OUT, f'overlay_{vid_id}.jpg'), np.vstack([np.hstack(ov[:3]), np.hstack(ov[3:])]), [cv2.IMWRITE_JPEG_QUALITY, 85])
    print('  figures:', os.path.join(OUT, f'swing_{vid_id}.png'), os.path.join(OUT, f'overlay_{vid_id}.jpg'))
    save(vid_id, {'A_deg': round(float(Ae), 1), 'sigma_deg': round(float(sA), 1), 'at': mmss(grid[-1]), 'aliases_deg': [round(float(c), 1) for c in np.sort(combos)],
        'rising_deg_per_s': round(float(R[-8:].mean()), 2), 'stretch': f'{mmss(ap[0] / FPS)}-{mmss(grid[-1])} (camera on a tripod 0:45-2:04)',
        'start': {'rest': f'{mmss(C["rest"][0])}-{mmss(C["rest"][1])}', 'release': mmss(C['release'] / FPS), 'twist_deg': round(float(tw), 1), 'first_swing_2A_mod15_deg': round(float(x1 % 15), 1), 'A0_deg': [round(float(x), 1) for x in A0s]},
        'growth_deg': {'summed': round(float(Dint), 1), 'mod15_first_last': [round(float(x), 1) for x in md], 'aliases': [round(float(x), 1) for x in Ds]},
        'frames': {'read': len(K), 'turning_points': len(ap), 'registrations': int(sum(len(s) for s in seg.values())), 'good': int(sum(len(r) for r in rate.values()))},
        'period_s': {'median': round(float(T), 5), 'first_5_s': round(float(np.diff(ap)[:10].mean() * 2 / FPS), 5), 'last_20_s': round(float(np.diff(ap)[-40:].mean() * 2 / FPS), 5), 'note': 'file time (29.97 fps nominal)'}, 'rolling_shutter_frames': round(float(rs), 2),
        'fit': {'form': 'A^2 = Ainf^2 - (Ainf^2 - A0^2) exp(-2t/TF), on the middle curve', 'Ainf_deg': round(float(q[0])), 'TF_s': round(float(q[2])), 'rms_deg': round(float(rr.std()), 1),
                'over_aliases': {'Ainf_deg': [round(float(min(x[0] for x in fits))), round(float(max(x[0] for x in fits)))], 'TF_s': [round(float(min(x[2] for x in fits))), round(float(max(x[2] for x in fits)))]}},
        'A_t': [[round(float(x), 1), round(float(y), 1)] for x, y in zip(grid[::4], At[::4])],
        'sure': 'likely within the stated range, not certain to better than one alias: this is a start from a twist, not the steady swing (still rising about 1 deg/s at 2:03); '
                'the growth is summed over 135 periods (one side only 1:06-1:15 and 1:21-1:40, neither side 1:15.7-1:20.5, interpolated) and known exactly only modulo one screw hole (15 deg): '
                '181.8 or 196.8 (the sum, 191, is nearer 196.8); 211.8 is unlikely (a 9 deg/s burst in the blind 4.8 s, or a 30 % under-reading not seen where the second side joins); the start only modulo 7.5 deg; '
                'the steady swing (Ainf) is an extrapolation of the fit, not a measurement'})

SURVEY = {'We1dLNXiBj0 2:37-3:02': 'not measured: the camera back on the tripod in a new place (a plate homography maps the band), but the turning-point frames show the screws '
                                   'smeared and low in contrast (mirror similarity 0.65-0.8, registrations below 0.5 correlation); no absolute link to the earlier stretch either',
          'We1dLNXiBj0 0:00-0:52': 'no swing: the balance stands still (consecutive frames alike at 0:30, 0:46-0:52); the movement is started at 0:55',
          'FpolZSipVmQ': 'rejected: the rollers seen edge-on through the keyhole, hand-held; the impulse jewel shows over a narrow arc only and the balance arm crosses '
                         'the view for one frame (0:20); no angle readable over a swing; 0:00-1:06',
          'run_s7VW3RiJ97E': 'rejected: the plate seen from above for about 5 s (0:04-0:09) while the camera pans and zooms, then the movement lifted and side-on; too short',
          'XJQCgMV_GA8': 'rejected: keyhole view of the locking stone and escape wheel (portrait), no part of the balance in view; 0:00-1:12',
          'run_xDKFZaY88cM': 'rejected, and a warning: 2:00-2:40 shows the balance close and oblique (brass screws, the timing nut), running, but the footage is edited: 2:03-2:15 '
                             'repeats its frame-sharpness sequence exactly every 2.00 s (frames 60 apart most alike, not 15), 2:15-2:39 holds frames for 20 at a time '
                             '(slow motion or stills); not a real-time record (its sound may be edited too); 0:00-1:58 is restoration footage',
          'bEWF2ivi1Rg': 'rejected: the movement turned on a turntable side-on (0:10-1:40), the barrel and fusee; the balance not in view',
          'R-DrJz1DYOY': 'rejected: the movement on a turntable seen from above (2:54-3:24), turning all the time; the balance under the cock, not followed; 3:20-3:25.6 '
                         'still (60 fps, drifting 20 px), but 5 s and no screws clearly in view',
          # searched again 12 October 2026 (band power at 2 Hz over every downloaded video, each hit checked frame by frame: $MC_VIDEO/oq/starts)
          'xM_mxtGfeqQ 8:56-10:43': 'measured, not by this tool: a recovery after handling, 170 to 229 deg (the xM_mxtGfeqQ entry; $MC_VIDEO/oq/xm)',
          'SNLqsS9wrrM 4:04-4:07': 'measured, not used: a 13 deg free swing flicked by a brush (13.2 to 11.8 deg, -0.49 deg/s), but its period reads 0.4786 s, 4.4 % short: '
                                   'the time base altered or the Navy Y-stop touching; 5:11 and 5:23 smaller swings side-on, 2.3 and 1.4 deg',
          'KLUwI2UUCMQ 47:03-47:13': 'not measured: a running swing after the restoration, under the cock, 23.976 fps, the camera sliding about 13 px/s; '
                                     'three usable frames a turn, so about +-15 % by the shape of the turns; no start seen (cut)',
          'W9gy2gjvZHc 0:01-0:30': 'not measured: steady, 4K, the camera fixed (period 0.5005 s), but the rim seen low and very flat: a camera fit needed, aliases likely',
          'cwzM-GK9VOw': 'rejected: steady (0:00-0:08 real time, then 120 fps slowed 4x), the camera fixed, but the front of the rim hidden by the bridge, only its plain back soft',
          'QjRur8MO8B0 0:45-1:12': 'rejected: running, from above, 480p at 12.75 fps, the camera moving',
          'yRlBXMjV-Cc 0:15-0:26': 'rejected: running rim, hand-held',
          'zuy2S-aIBVM 0:06-0:17': 'rejected: Tantdetemps "hamilton-21" (2014, N4984, 1941; found 12 October 2026), running from above, 480x360, hand-held and zooming',
          'others': 'no balance swing found: wuobTVulVGY (its hits near-still frames), 7iDdXkCBkfY, adGQ1zMSM-Q, TWQsSVWuikk, -5Ygn53f208, 3w3bf1ZszuI, h4qHhIVZ3FE, '
                    'lY3syHYrr6k, cnWy_M-yZrY, uX97j9NPdPk, bgvWk20Y7j8, nnhqqsiqD3Y, i6orz5MTujk, Umoe-T5yK7s, 8yog8dKiyQY, o819elZ2pi0, umslgYaJYUY, dO58jf0tRUA'}
a = sys.argv[1:]
if not a: sys.exit(__doc__)
if a[0] == 'survey': save('_surveyed', SURVEY)
else: measure(a[0])
