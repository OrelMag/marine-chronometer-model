"""Teeth and parts from videos of real Model 21s (References/VIDEOS.md: what each video shows, every measurement and the methods). No browser; needs opencv-python and,
for fetch, yt-dlp (pip install yt-dlp). Videos and frames are kept outside the repository, in $MC_VIDEO (default ~/mc-video):
they are other people's work, cited, not copied.

  python video.py fetch ID [--height 2160]       the video, video only (yt-dlp; VP9 at 4K is about 4 GB for the hour)
  python video.py sheet ID [--step 10]           contact sheets, a frame every STEP s, 4 x 4, timestamped: sheet_ID_NN.jpg
  python video.py frame ID mm:ss [...]           full frames: f_ID_mm-ss.png (in $MC_VIDEO/frames)
  python video.py count FRAME cx cy a b NAME     a wheel's teeth, counted one by one
        [--s 0.8 1.12] [--band 0.945 0.975] [--ch -V] [--mind 22] [--blue]
  python video.py ticks cx cy v:x,y [v:x,y ...]  a dial scale: the angles of ticks (value v at pixel x,y) about the centre (cx, cy),
                                                 clockwise from 12, and the degrees per unit fitted through them
  python video.py plate FRAME cx cy fx fy [name:x,y ...]   a bare plate's plan (rough): C at (cx, cy), the fourth's jewel at (fx, fy)

count: (cx, cy, a, b) is a first guess at the tooth tips' ellipse in the frame's pixels (axes along x and y). The ellipse is refined
on the outermost brass along each ray (s0..s1 of it), the rim is unrolled along it, and in the band of radii --band (through the
teeth, between tips and roots) every gap is found as a local maximum of the channel --ch (V or S, '-' for a dark gap) at least --mind px
from the last. Prints the gaps found, and the count from the clean intervals only: their local frequency fitted round the turn with
harmonics 0..2 (perspective stretches the pitch smoothly) and integrated over the turn, so a gap missed behind an arbor or a
neighbour doesn't count. Writes g_NAME.png (the strip in four rows, the gaps marked, every tenth numbered) and e_NAME.png (eight
segments, enlarged, for counting by eye: segment k is turn k/8..(k+1)/8). Check the marks on g_NAME.png before trusting a count. A
wheel seen whole gives its count exactly (every interval clean: the fusee wheel, 90); where an arbor or another wheel hides part of
the rim the fit reads a tooth or two low or high (the centre wheel 88.3-90.7 over frames and settings): count e_NAME.png by eye, and
a count the train's ratios can't take is a misread (IDEAS.md 1.8; the model README, "Sources").

The counts of IDEAS.md 1.8 (frames of KLUwI2UUCMQ, 4K):
  python video.py frame KLUwI2UUCMQ 27:30 35:22 35:30 35:33
  count f_KLUwI2UUCMQ_27-30.png 1988 1140 648 620 FU --band 0.94 0.98                      fusee wheel, 90
  count f_KLUwI2UUCMQ_35-30.png 2576 900 790 690 C --ch S --band 0.94 0.98                 centre wheel, 90
  count f_KLUwI2UUCMQ_35-22.png 1890 1416 570 504 T --s 0.75 1.15 --band 0.946 0.969       third wheel, 80
  count f_KLUwI2UUCMQ_35-33.png 1448 820 520 416 F --s 0.75 1.15 --band 0.946 0.969        fourth wheel, 75
  count f_KLUwI2UUCMQ_23-30.png 1860 1553 240 220 UDW --band 0.93 0.975 --mind 10 --blue  wind indicator wheel, 120 (--blue: the
                                                 wheel is lit almost white, so the part is "not the blue mat" rather than brass)

ticks: the UP-DOWN scale of References/photo-dial-hamilton-maritime-commission.jpg (898 px square): 5.65 deg an hour, 316 deg in 56 h
(315.7 by the mean of its 8 h intervals):
  python video.py ticks 410 390 8:705,270 16:710,505 24:535,680 32:295,680 40:120,510 48:130,270   (on the 5x crop at x 345, y 210;
  the same as 427 288 8:486,264 16:487,311 24:452,346 32:404,346 40:369,312 48:371,264 on the photograph)

plate: an affine plan of the pillar plate's train face from one frame, train side up: an ellipse centred on C fitted to the far half of
the rim (the near half shows the side wall), rotated so the fourth's jewel is on +z (6 o'clock), +x (3 o'clock) on the image's left;
the points named T and F (the third's and fourth's settings, on the lower train bridge) are 3.86 mm lower, and their shared parallax is taken out by putting F at
(0, 23.9). Rough (rim rms about 2.4 mm on KLUwI2UUCMQ 14:45): it shows that a part is millimetres off, not where to put it; see
References/VIDEOS.md, "Methods", for the proper camera fit to use instead.
  python video.py plate f_KLUwI2UUCMQ_14-45.png 1876 960 1830 1504 T:2100,1356 Fu:1524,624 Ba:2516,896 E:1570,1324"""
import cv2, numpy as np, sys, os, subprocess
HOME = os.environ.get('MC_VIDEO', os.path.expanduser('~/mc-video'))
def vid(i):   # the largest copy of video i (the highest resolution, where a smaller one was fetched too)
    fs = [os.path.join(HOME, f) for f in os.listdir(HOME) if f.startswith(i) and f.split('.')[-1] in ('webm', 'mp4', 'mkv')]
    if not fs: sys.exit(f'{i}: not in {HOME}; python video.py fetch {i}')
    return max(fs, key=os.path.getsize)
def secs(s): m, x = s.split(':'); return int(m) * 60 + float(x)
def opt(a, k, n, d):
    if k in a: i = a.index(k); v = a[i + 1:i + 1 + n]; del a[i:i + 1 + n]; return v if n > 1 else v[0]
    return d
a = sys.argv[1:]
if not a: sys.exit(__doc__)
cmd = a.pop(0)
if cmd == 'fetch':
    h = opt(a, '--height', 1, '2160'); os.makedirs(HOME, exist_ok=True)
    subprocess.run([sys.executable, '-m', 'yt_dlp', '-f', f'bv*[height<={h}][vcodec^=vp9]/bv*[height<={h}]', '-o', os.path.join(HOME, '%(id)s.%(ext)s'), 'https://www.youtube.com/watch?v=' + a[0]], check=True)
elif cmd in ('sheet', 'frame'):
    cap = cv2.VideoCapture(vid(a[0])); dur = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
    def grab(t): cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, f = cap.read(); return f if ok else None
    if cmd == 'frame':
        os.makedirs(os.path.join(HOME, 'frames'), exist_ok=True)
        for s in a[1:]:
            f = grab(secs(s)); p = os.path.join(HOME, 'frames', f'f_{a[0]}_{s.replace(":", "-")}.png')
            if f is not None: cv2.imwrite(p, f); print(p)
    else:
        step = float(opt(a, '--step', 1, '10')); W, H, C = 400, 225, 4; ts = [i * step for i in range(int(dur // step))]
        for k in range(0, len(ts), C * C):
            sh = np.zeros((H * C, W * C, 3), np.uint8)
            for j, t in enumerate(ts[k:k + C * C]):
                f = grab(t)
                if f is None: continue
                f = cv2.resize(f, (W, H)); lab = f'{int(t // 60)}:{int(t % 60):02d}'
                cv2.putText(f, lab, (6, 22), 0, 0.7, (0, 0, 0), 4); cv2.putText(f, lab, (6, 22), 0, 0.7, (255, 255, 255), 2)
                sh[(j // C) * H:(j // C + 1) * H, (j % C) * W:(j % C + 1) * W] = f
            cv2.imwrite(f'sheet_{a[0]}_{k // (C * C):02d}.jpg', sh, [cv2.IMWRITE_JPEG_QUALITY, 80])
        print(a[0], f'{dur:.0f} s,', len(ts), 'frames')
elif cmd == 'count':
    s0, s1 = map(float, opt(a, '--s', 2, ['0.8', '1.12'])); b0, b1 = map(float, opt(a, '--band', 2, ['0.945', '0.975']))
    ch = opt(a, '--ch', 1, '-V'); mind = int(opt(a, '--mind', 1, '22')); blue = '--blue' in a; a = [x for x in a if x != '--blue']
    img = cv2.imread(a[0]); cx, cy, A, B = map(float, a[1:5]); name = a[5]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV); H, W = hsv.shape[:2]
    brass = ~(cv2.inRange(hsv, (92, 70, 30), (132, 255, 255)) > 0) if blue else cv2.inRange(hsv, (8, 55, 50), (40, 255, 255)) > 0   # the part: brass, or (--blue) anything not the blue mat
    N, M = 4096, 240; th = np.arange(N) / N * 2 * np.pi; ss = np.linspace(s0, s1, M)
    def grid(E):
        ex, ey, A, B, t = E; u = np.cos(th)[None] * A * ss[:, None]; v = np.sin(th)[None] * B * ss[:, None]
        return ex + u * np.cos(t) - v * np.sin(t), ey + u * np.sin(t) + v * np.cos(t)
    E = (cx, cy, A, B, 0.0)
    for it in range(5):   # the outermost brass on each ray (inside out, stopping at a gap of 6 rows); the tips' envelope; an ellipse through it
        X, Y = grid(E); ok = (X >= 0) & (X < W) & (Y >= 0) & (Y < H); b = brass[np.clip(Y.astype(int), 0, H - 1), np.clip(X.astype(int), 0, W - 1)] & ok
        edge = np.full(N, np.nan)
        for i in range(N):
            j = np.where(b[:, i])[0]
            if len(j) == 0: continue
            k = j[0]
            for q in j[1:]:
                if q - k > 6: break
                k = q
            edge[i] = ss[k]
        good = ~np.isnan(edge) & (np.abs(edge - np.nanmedian(edge)) < 0.05); eg = np.where(good, edge, np.nan)
        env = np.array([np.nanmax(eg[max(0, i - 20):i + 20]) if good[max(0, i - 20):i + 20].any() else np.nan for i in range(N)])
        gi = ~np.isnan(env); ex, ey, A0, B0, t = E; u, v = np.cos(th) * A0 * env, np.sin(th) * B0 * env
        P = np.c_[ex + u * np.cos(t) - v * np.sin(t), ey + u * np.sin(t) + v * np.cos(t)][gi]
        (fx, fy), (fa, fb), fang = cv2.fitEllipse(P.astype(np.float32)); E = (fx, fy, fa / 2, fb / 2, np.deg2rad(fang))
    X, Y = grid(E); st = cv2.remap(img, X.astype(np.float32), Y.astype(np.float32), cv2.INTER_CUBIC)
    hv = cv2.cvtColor(st, cv2.COLOR_BGR2HSV).astype(float); band = (ss >= b0) & (ss <= b1)
    s = hv[band][:, :, {'S': 1, 'V': 2}[ch.lstrip('-')]].mean(0) * (-1 if ch.startswith('-') else 1)
    s = s - np.convolve(np.r_[s[-60:], s, s[:60]], np.ones(121) / 121, 'same')[60:-60]; s = np.convolve(np.r_[s[-3:], s, s[:3]], np.ones(7) / 7, 'same')[3:-3]
    pk = [i for i in range(N) if s[i] == np.r_[s[-mind:], s, s[:mind]][i:i + 2 * mind + 1].max() and s[i] > 0]
    if pk and pk[-1] - pk[0] > N - mind: pk = pk[:-1]
    P = np.array(pk + [pk[0] + N]); I = np.diff(P); mid = (P[:-1] + I / 2) % N
    loc = np.array([np.median(I[max(0, k - 4):k + 5]) for k in range(len(I))]); cl = (I > 0.7 * loc) & (I < 1.4 * loc)   # a gap missed doubles an interval, a gap found twice halves it
    Hm = lambda m: np.c_[np.ones(len(m)), np.cos(m), np.sin(m), np.cos(2 * m), np.sin(2 * m)]
    for it in range(3):
        w = np.sqrt(I[cl])[:, None]   # each interval weighted by the angle it covers: an average over the turn, not over the intervals
        c, *_ = np.linalg.lstsq(Hm(mid[cl] / N * 2 * np.pi) * w, 1 / I[cl] * w[:, 0], rcond=None); pred = 1 / (Hm(mid / N * 2 * np.pi) @ c); cl = (I > 0.7 * pred) & (I < 1.4 * pred)
    sc = np.std(I[cl] / pred[cl] - 1)
    print(f'{name}: {len(pk)} gaps found ({"every interval clean, so that is the count" if cl.all() else f"{(~cl).sum()} intervals not clean"}); from {cl.sum()} clean intervals, {c[0] * N:.2f} teeth (scatter {sc:.1%}, so about +/-{c[0] * N * sc / np.sqrt(cl.sum()):.1f}); '
          f'ellipse ({E[0]:.0f}, {E[1]:.0f}) {2 * E[2]:.0f} x {2 * E[3]:.0f} px at {np.rad2deg(E[4]):.1f} deg')
    sf = st[::-1].copy(); r0, r1 = M - 1 - np.where(band)[0][-1], M - 1 - np.where(band)[0][0]
    g = sf.copy()
    for k, i in enumerate(pk):
        cv2.line(g, (i, r0), (i, r1), (0, 0, 255) if k % 10 else (255, 0, 255), 2)
        if k % 10 == 0: cv2.putText(g, str(k), (i - 10, r1 + 22), 0, 0.7, (255, 0, 255), 2)
    cv2.imwrite(f'g_{name}.png', np.vstack([g[:, i * N // 4:(i + 1) * N // 4] for i in range(4)]))
    lo, hi = max(0, r0 - 70), min(M, r1 + 50); seg = []
    for k in range(8):
        z = cv2.resize(sf[lo:hi, k * 512:(k + 1) * 512], None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        for x in range(0, 1024, 100): cv2.line(z, (x, 0), (x, 12), (0, 0, 255), 2)
        cv2.rectangle(z, (0, 0), (1023, z.shape[0] - 1), (255, 0, 255), 3); cv2.putText(z, f'seg {k}', (8, 40), 0, 1, (255, 0, 255), 2); seg.append(z)
    cv2.imwrite(f'e_{name}.png', np.vstack(seg))
elif cmd == 'ticks':
    cx, cy = map(float, a[:2]); V, A = [], []
    for t in a[2:]:
        v, xy = t.split(':'); x, y = map(float, xy.split(',')); ang = np.degrees(np.arctan2(x - cx, cy - y)) % 360; V.append(float(v)); A.append(ang)
        print(f'{v:>6}: {ang:6.1f} deg')
    V, A = np.array(V), np.unwrap(np.radians(A)); k, b = np.polyfit(V, np.degrees(A), 1)
    print(f'{k:.3f} deg per unit, zero at {b % 360:.1f} deg; rms {np.std(np.degrees(A) - (k * V + b)):.2f} deg')
elif cmd == 'plate':
    img = cv2.imread(a[0]); H, W = img.shape[:2]; hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV); C0 = np.array(list(map(float, a[1:3]))); Fp = np.array(list(map(float, a[3:5])))
    pts = {'F': Fp, **{t.split(':')[0]: np.array(list(map(float, t.split(':')[1].split(',')))) for t in a[5:]}}
    notsilver = (hsv[:, :, 1] > 70) & (hsv[:, :, 2] > 40); far = np.arctan2(*(C0 - Fp)[::-1])   # the far side: away from the fourth
    rim = []
    for t in far + np.linspace(-0.45 * np.pi, 0.45 * np.pi, 400):
        d = np.array([np.cos(t), np.sin(t)])
        for r in np.arange(300, 3000, 1.0):
            x, y = (C0 + r * d).astype(int)
            if not (0 <= x < W and 0 <= y < H): break
            if all(notsilver[int(C0[1] + (r + q) * d[1]), int(C0[0] + (r + q) * d[0])] for q in range(8) if 0 <= int(C0[0] + (r + q) * d[0]) < W and 0 <= int(C0[1] + (r + q) * d[1]) < H): rim.append(C0 + r * d); break
    U = np.array(rim) - C0; keep = np.ones(len(U), bool)
    for it in range(8):
        M3, *_ = np.linalg.lstsq(np.c_[U[keep, 0] ** 2, 2 * U[keep, 0] * U[keep, 1], U[keep, 1] ** 2], np.ones(keep.sum()), rcond=None)
        M = np.array([[M3[0], M3[1]], [M3[1], M3[2]]]); q = np.sqrt(np.einsum('ij,jk,ik->i', U, M, U)); e = np.abs(q - 1); keep = e < max(0.003, 3 * 1.48 * np.median(e[keep]))
    R0 = 87.57 / 2; w, V = np.linalg.eigh(M); Ai = np.linalg.inv(V @ np.diag(1 / np.sqrt(w)) @ V.T / R0)
    for refl in (1, -1):
        Q = {k: np.diag([refl, 1.0]) @ Ai @ (v - C0) for k, v in pts.items()}; ang = np.arctan2(Q['F'][0], Q['F'][1])
        Rr = np.array([[np.cos(ang), -np.sin(ang)], [np.sin(ang), np.cos(ang)]]); Q = {k: Rr @ v for k, v in Q.items()}
        img_left = (np.linalg.inv(np.diag([refl, 1.0]) @ Ai) @ (Rr.T @ np.array([1.0, 0])))   # where plan +x points in the image
        if img_left[0] < 0: break   # +x on the image's left: the train side seen from above
    sh = Q['F'] - np.array([0, 23.9])
    print(f'rim: {keep.sum()} of {len(U)} points, rms {np.sqrt(np.mean((q[keep] - 1) ** 2)) * R0:.2f} mm (rough above about 0.5)')
    for k, v in Q.items():
        low = k in ('T', 'F'); u = v - sh if low else v; print(f'{k:>4}: ({u[0]:6.2f}, {u[1]:6.2f}) mm, r {np.hypot(*u):5.2f}' + ('  (on the lower train bridge: parallax taken out)' if low else ''))
else: sys.exit(__doc__)
