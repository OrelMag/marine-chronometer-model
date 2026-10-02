"""Teeth and parts from videos of real Model 21s (References/VIDEOS.md: what each video shows, every measurement and the methods). No browser; needs opencv-python and,
for fetch, yt-dlp (pip install yt-dlp). Videos and frames are kept outside the repository, in $MC_VIDEO (default ~/mc-video):
they are other people's work, cited, not copied.

  python video.py fetch ID [--height 2160]       the video, video only (yt-dlp; VP9 at 4K is about 4 GB for the hour)
  python video.py sheet ID [--step 10]           contact sheets, a frame every STEP s, 4 x 4, timestamped: $MC_VIDEO/sheets/sheet_ID_NN.jpg
        [--from mm:ss] [--to mm:ss]               only that stretch (sheet_ID_mm-ss_NN.jpg)
  python video.py frame ID mm:ss [...]           full frames: f_ID_mm-ss.png (in $MC_VIDEO/frames)
  python video.py count FRAME cx cy a b NAME     a wheel's teeth, counted one by one
        [--s 0.8 1.12] [--band 0.945 0.975] [--ch -V] [--mind 22] [--blue]
  python video.py ticks cx cy v:x,y [v:x,y ...]  a dial scale: the angles of ticks (value v at pixel x,y) about the centre (cx, cy),
                                                 clockwise from 12, and the degrees per unit fitted through them
  python video.py plate FRAME cx cy fx fy [name:x,y ...]   a bare plate's plan (rough): C at (cx, cy), the fourth's jewel at (fx, fy)
  python video.py fit SPEC.json [--draw OUT.png]   a frame's camera (pose and focal length) from model points and circles traced on it: SPEC.cam.json
  python video.py unproj SPEC.json Y u,v [...] [--circle]   pixels put back on the plane y = Y (mm, or TBtop / TBbot / PPtop) through that camera
  python video.py anchor SPEC.json [--tol 1.0] [--draw OUT.png]   a frame mapped onto one face of a part (a homography): SPEC.H.json

anchor: SPEC is {"frame", "view": "above" (seen from the train side) or "below" (the dial side, or a part turned over), "holes": the
part's holes (holes.py's JSON, or {name: [x, z]}), "use": [the holes to pair], "picks": {name: [u, v]} (holes found on the frame),
"pairs": {model hole: pick} (named, always kept), "circles": {name: {"c": [x, z], "r": mm, "pts": [[u, v], ...]}} (edges traced on the
frame: the train bridge's rim, r 40.5 about the centre, and its cut round the barrel, r 19.2 about (-22.56, 0.23)), "init": an earlier
H.json to start from, "map": {name: [x, z]} (drawn), "unmap": {name: [u, v]} (put on the face)}. With circles, the homography is fitted
on them and the named pairs only, and every other hole that pairs within --tol mm is an independent check; without, it is fitted on
every pair, and each is reported with the pair left out (a homography passes near any five points, so five pairs prove little: on
KLUwI2UUCMQ 13:49.5 three searches gave three fits, each to 0.1-0.3 mm). Name the centre bushing and trace the rim: the circles fix
the face's perspective and scale; the cut, or a second named hole, its rotation. Only points on the face map: on a view tilted 45 deg
a jewel 12 mm below it lands about 10 mm off.

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
        step = float(opt(a, '--step', 1, '10')); t0 = secs(opt(a, '--from', 1, '0:00')); t1 = min(secs(opt(a, '--to', 1, '999:00')), dur); W, H, C = 400, 225, 4; ts = list(np.arange(t0, t1, step))
        tag = f'_{a[0]}_' + (f'{int(t0 // 60)}-{int(t0 % 60):02d}_' if t0 else '')
        os.makedirs(os.path.join(HOME, 'sheets'), exist_ok=True)
        for k in range(0, len(ts), C * C):
            sh = np.zeros((H * C, W * C, 3), np.uint8)
            for j, t in enumerate(ts[k:k + C * C]):
                f = grab(t)
                if f is None: continue
                f = cv2.resize(f, (W, H)); lab = f'{int(t // 60)}:{t % 60:04.1f}' if step < 1 else f'{int(t // 60)}:{int(t % 60):02d}'
                cv2.putText(f, lab, (6, 22), 0, 0.7, (0, 0, 0), 4); cv2.putText(f, lab, (6, 22), 0, 0.7, (255, 255, 255), 2)
                sh[(j // C) * H:(j // C + 1) * H, (j % C) * W:(j % C + 1) * W] = f
            cv2.imwrite(os.path.join(HOME, 'sheets', f'sheet{tag}{k // (C * C):02d}.jpg'), sh, [cv2.IMWRITE_JPEG_QUALITY, 80])
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
elif cmd in ('fit', 'unproj'):
    # a frame's camera from the model: named points and circles (movement frame, mm; dial side +y, 12 o'clock -z, 3 o'clock +x) whose pixels are
    # traced on the frame. SPEC is a JSON file: {"frame": path, "points": {"NAME@LEVEL": [u, v]}, "circles": {"NAME@LEVEL": [[u, v], ...]}}
    import json; from scipy.optimize import least_squares
    LEV = {'TBtop': -23.76, 'TBbot': -20.66, 'PPtop': -3.86}   # movement.js: TB_T, TB_U, the pillar plate's train face (-PP_T)
    PT = {'C': (0, 0), 'T': (-6.18, 14.75), 'F': (0, 23.9), 'B': (6.125, 8.504), 'E': (8.504, 17.598), 'Fu': (16.036, -16.408), 'Ba': (-18.055, -4.306),
          'tb0': (-21.57, 17.79), 'tb1': (11.12, 30.52), 'tb2': (-14.95, 24.82)}   # movement.js L and PILLARS (tb: the train bridge's pillar screws), the photographed group turned 14 deg (PHOTO_TURN)
    CI = {'tbrim': (0, 0, 40.5), 'bcut': (-21.95, -5.23, 19.2), 'plate': (0, 0, 87.57 / 2)}   # BR_R; the train bridge's cut round the barrel (crescent's bc, br); the plate
    def at(n):   # NAME@LEVEL -> (name, y); a name may be x,z and a level a number
        k, l = n.split('@'); return k, LEV[l] if l in LEV else float(l)
    def xyz(k, y): x, z = PT[k] if k in PT else map(float, k.split(',')); return np.array([x, y, z], float)
    S = json.load(open(a[0])); fr = S['frame'] if os.path.isabs(S['frame']) else os.path.join(HOME, 'frames', S['frame']); img = cv2.imread(fr); H, W = img.shape[:2]
    cam = a[0].replace('.json', '') + '.cam.json'
    def proj(P, q): K = np.array([[np.exp(q[6]), 0, W / 2], [0, np.exp(q[6]), H / 2], [0, 0, 1]]); return cv2.projectPoints(np.asarray(P, float).reshape(-1, 3), q[:3], q[3:6], K, None)[0].reshape(-1, 2)
    def circ(n): k, y = at(n); cx, cz, r = CI[k]; t = np.linspace(0, 2 * np.pi, 720, endpoint=False); return np.c_[cx + r * np.cos(t), np.full_like(t, y), cz + r * np.sin(t)]
    P3 = [xyz(*at(n)) for n in S.get('points', {})]; P2 = np.array(list(S.get('points', {}).values()), float).reshape(-1, 2)
    C3 = {n: circ(n) for n in S.get('circles', {})}; C2 = {n: np.array(v, float) for n, v in S.get('circles', {}).items()}
    def res(q):
        r = [(proj(P3, q) - P2).ravel()] if len(P3) else []
        for n in C3: e = proj(C3[n], q); r.append(np.sqrt(((C2[n][:, None, :] - e[None]) ** 2).sum(-1)).min(1))
        return np.concatenate(r)
    if cmd == 'fit':
        rim = np.vstack(list(C2.values())) if C2 else P2; c0 = rim.mean(0); best = None
        for f0 in (2500, 5000):
            for side in (1, -1):   # the train side (-y) or the dial side toward the camera
                for roll in np.radians(np.arange(0, 360, 30)):
                    for tilt in np.radians((0, 30)):
                        R0 = cv2.Rodrigues(np.array([np.pi / 2 * side, 0, 0]))[0]; R0 = cv2.Rodrigues(np.array([0, 0, roll]))[0] @ cv2.Rodrigues(np.array([tilt, 0, 0]))[0] @ R0
                        d = f0 * 45 / max(1.0, np.ptp(rim, 0).max() / 2); t0 = np.array([(c0[0] - W / 2) * d / f0, (c0[1] - H / 2) * d / f0, d]) - R0 @ np.array([0, -15.0, 0])
                        q0 = np.r_[cv2.Rodrigues(R0)[0].ravel(), t0, np.log(f0)]
                        try: s_ = least_squares(res, q0, max_nfev=40)
                        except Exception: continue
                        if best is None or s_.cost < best.cost: best = s_
        best = least_squares(res, best.x, max_nfev=4000); q = best.x; r = res(q); i = 0
        print(f'{os.path.basename(fr)}: f {np.exp(q[6]):.0f} px, camera {np.linalg.norm(q[3:6]):.0f} mm from the origin; rms {np.sqrt(np.mean(r ** 2)):.1f} px')
        for n in S.get('points', {}): print(f'  {n:16s} {np.hypot(*r[i:i + 2]):6.1f} px'); i += 2
        for n in C3: m = len(C2[n]); print(f'  {n:16s} {np.sqrt(np.mean(r[i:i + m] ** 2)):6.1f} px rms over {m} points'); i += m
        json.dump({'frame': fr, 'q': list(map(float, q)), 'W': W, 'H': H}, open(cam, 'w')); print('wrote', cam)
        if '--draw' in a:
            o = img.copy()
            for n in C3: cv2.polylines(o, [proj(C3[n], q).astype(np.int32)], True, (0, 255, 255), 3); [cv2.circle(o, tuple(map(int, u)), 8, (255, 0, 255), -1) for u in C2[n]]
            for k in PT:
                for l in ('TBtop', 'TBbot'): u = proj([xyz(k, LEV[l])], q)[0]; cv2.drawMarker(o, tuple(map(int, u)), (0, 0, 255) if l == 'TBtop' else (255, 0, 0), 1, 30, 3); cv2.putText(o, k, (int(u[0]) + 10, int(u[1]) - 10), 0, 1.2, (0, 0, 255), 3)
            for n, u in zip(S.get('points', {}), P2): cv2.circle(o, tuple(map(int, u)), 14, (0, 255, 0), 3)
            cv2.imwrite(a[a.index('--draw') + 1], o)
    else:   # unproj SPEC Y u,v [u,v ...] [--circle]: the pixels put back on the plane y = Y (a level name or mm), through the fitted camera
        q = np.array(json.load(open(cam))['q']); y = LEV[a[1]] if a[1] in LEV else float(a[1]); R = cv2.Rodrigues(q[:3])[0]; o = -R.T @ q[3:6]; out = []
        for t in a[2:]:
            if t.startswith('--'): continue
            u, v = map(float, t.split(',')); d = R.T @ np.array([(u - W / 2) / np.exp(q[6]), (v - H / 2) / np.exp(q[6]), 1]); P = o + d * (y - o[1]) / d[1]; out.append(P[[0, 2]])
            print(f'  ({u:6.0f},{v:6.0f}) -> x {P[0]:7.2f}  z {P[2]:7.2f}')
        if '--circle' in a and len(out) > 2:
            U = np.array(out); A_ = np.c_[2 * U, np.ones(len(U))]; c = np.linalg.lstsq(A_, (U ** 2).sum(1), rcond=None)[0]; r = np.sqrt(c[2] + c[0] ** 2 + c[1] ** 2)
            print(f'  circle: centre ({c[0]:.2f}, {c[1]:.2f}), r {r:.2f}, rms {np.sqrt(np.mean((np.hypot(*(U - c[:2]).T) - r) ** 2)):.2f} mm')
elif cmd == 'anchor':
    # a frame mapped onto one face of a part by its holes: SPEC is a JSON file {"frame": path, "view": "above" | "below", "holes": holes_PART.json
    # (holes.py; or {name: [x, z]}), "use": [names to anchor on; default all], "picks": {name: [u, v]} (holes found on the frame, unnamed),
    # "map": {name: [x, z]} (model points to draw), "unmap": {name: [u, v]} (frame points to put on the face)}. "above" is a view of the face from
    # the train side (+x, 3 o'clock, on the image's left when 12 is up); "below" from the dial side, or a part turned over to show its underside
    import json, itertools; from scipy.optimize import linear_sum_assignment
    sp = a[0]; S = json.load(open(sp)); here = os.path.dirname(os.path.abspath(sp))
    fr = S['frame'] if os.path.isabs(S['frame']) else os.path.join(HOME, 'frames', S['frame']); img = cv2.imread(fr)
    hs = S['holes']; hs = json.load(open(os.path.join(here, hs)))['holes'] if isinstance(hs, str) else hs
    use = S.get('use', list(hs)); mk = [k for k in hs if k in use]; Mh = np.array([hs[k][:2] for k in mk], float)
    pk = list(S['picks']); Fp = np.array([S['picks'][k] for k in pk], float); mir = -1 if S['view'] == 'above' else 1
    tol = float(opt(a, '--tol', 1, 1.0))   # mm: how near a pick must fall to a model hole to pair with it
    def sim(s, t, M): z = s * (mir * M[:, 0] + 1j * M[:, 1]) + t; return np.c_[z.real, z.imag]
    best = None; Mz = mir * Mh[:, 0] + 1j * Mh[:, 1]; Fz = Fp[:, 0] + 1j * Fp[:, 1]
    kp = [(mk.index(m), pk.index(f)) for m, f in S.get('pairs', {}).items()]   # pairs named in the SPEC: kept, and with two or more the similarity is theirs
    if 'init' in S and S.get('circles'): best = (0, 1, 0, 0)
    elif len(kp) >= 2: A_ = np.c_[[Mz[i] for i, _ in kp], np.ones(len(kp))]; s, t = np.linalg.lstsq(A_, np.array([Fz[j] for _, j in kp]), rcond=None)[0]; best = (0, s, t, 0)
    for i, j in (() if best else itertools.permutations(range(len(Fp)), 2)):   # else every pair of picks on every pair of model holes: a similarity of the right handedness
        for p, q in itertools.permutations(range(len(Mh)), 2):
            s = (Fz[j] - Fz[i]) / (Mz[q] - Mz[p])
            if not 8 < abs(s) < 120: continue
            t = Fz[i] - s * Mz[p]; D = np.abs((s * Mz + t)[:, None] - Fz[None]); n = (D.min(1) < tol * abs(s)).sum()
            if best is None or n > best[0] or (n == best[0] and D.min(1)[D.min(1) < tol * abs(s)].sum() < best[3]): best = (n, s, t, D.min(1)[D.min(1) < tol * abs(s)].sum())
    _, s, t, _ = best; P = sim(s, t, Mh); sc = abs(s)
    def pairup(P):   # one to one, the named pairs kept
        D = np.linalg.norm(P[:, None] - Fp[None], axis=2)
        for i, j in kp: D[i, :] = 1e9; D[:, j] = 1e9; D[i, j] = 0
        r_, c_ = linear_sum_assignment(D); return [(i, j) for i, j in zip(r_, c_) if D[i, j] < tol * sc]
    CI = {k: (np.array(v['c'], float), float(v['r']), np.array(v['pts'], float)) for k, v in S.get('circles', {}).items()}
    toMH = lambda H, u: cv2.perspectiveTransform(np.array(u, np.float64).reshape(-1, 1, 2), np.linalg.inv(H))[:, 0]
    if CI:   # fitted on the named pairs and the circles (edges traced on the frame: a circle of radius r about c on the face); every other hole is a check
        from scipy.optimize import least_squares
        if 'init' in S: H0 = np.array(json.load(open(os.path.join(here, S['init'])))['H']); H0 /= H0[2, 2]   # a start: an earlier anchor's H.json
        elif len(kp) >= 2: H0 = np.array([[mir * s.real, -s.imag, t.real], [mir * s.imag, s.real, t.imag], [0, 0, 1]])
        else: sys.exit('circles need a start: two or more named "pairs", or "init"')
        Hq = lambda q: np.r_[q, 1].reshape(3, 3)
        def rr(q):
            H = Hq(q); r = [(toMH(H, [Fp[j] for _, j in kp]) - Mh[[i for i, _ in kp]]).ravel()]
            for c, R, U in CI.values(): r.append(np.linalg.norm(toMH(H, U) - c, axis=1) - R)
            return np.concatenate(r)
        Hm = Hq(least_squares(rr, H0.ravel()[:8], x_scale='jac', max_nfev=20000).x)
        J = np.array([[Hm[0, 0] - Hm[2, 0] * Hm[0, 2], Hm[0, 1] - Hm[2, 1] * Hm[0, 2]], [Hm[1, 0] - Hm[2, 0] * Hm[1, 2], Hm[1, 1] - Hm[2, 1] * Hm[1, 2]]]); sc = np.sqrt(abs(np.linalg.det(J)))   # px per mm at the origin
        pr = pairup(cv2.perspectiveTransform(Mh[:, None], Hm)[:, 0]); src = np.array([Mh[i] for i, _ in pr]); dst = np.array([Fp[j] for _, j in pr])
    else:
        for it in range(4):   # pair one to one, then a homography on the pairs
            pr = pairup(P); src = np.array([Mh[i] for i, _ in pr], np.float32); dst = np.array([Fp[j] for _, j in pr], np.float32)
            if len(pr) < 4: sys.exit(f'only {len(pr)} holes pair within {tol} mm: pick more, or check "view"')
            Hm = cv2.findHomography(src, dst, 0)[0]; P = cv2.perspectiveTransform(Mh[:, None].astype(np.float32), Hm)[:, 0]
    toM = lambda u: toMH(Hm, u)
    res = np.linalg.norm(toM(dst) - src, axis=1) if len(pr) else np.zeros(0)
    print(f'{os.path.basename(fr)} ({S["view"]}): {len(pr)} of {len(mk)} model holes paired with {len(pk)} picks within {tol} mm' + (f'; fitted on {len(kp)} named pairs and {len(CI)} circles' if CI else ''))
    for k, (c, R, U) in CI.items(): e = np.linalg.norm(toM(U) - c, axis=1) - R; print(f'  circle {k}: {len(U)} points, rms {np.sqrt(np.mean(e ** 2)):.2f} mm (r {R} about ({c[0]}, {c[1]}))')
    def loo(k):   # that pair's error with the homography fitted on the others: a homography passes near any five points, so this is the test
        if CI or len(pr) < 6: return float('nan')
        o_ = [n for n in range(len(pr)) if n != k]; h = cv2.findHomography(src[o_], dst[o_], 0)[0]
        return float(np.linalg.norm(toMH(h, dst[k]) - src[k]))
    lo = [loo(k) for k in range(len(pr))]
    print(f'  pair                 model hole      pick   off (mm)' + ('' if CI else '  left out' + ('' if len(pr) >= 6 else ' (needs six pairs)')))
    for (i, j), r, l in zip(pr, res, lo): print(f'  {mk[i]:8s} ({Mh[i][0]:7.2f}, {Mh[i][1]:7.2f}) <-> {pk[j]:6s} {r:.2f}' + ('  named' if (i, j) in kp else '  check' if CI else f'      {l:.2f}'))
    lone = [pk[j] for j in range(len(pk)) if j not in [j for _, j in pr]]
    if lone: print('picks with no model hole (on the face):'); [print(f'  {k:6s} -> ({m[0]:7.2f}, {m[1]:7.2f})') for k, m in zip(lone, toM([S['picks'][k] for k in lone]))]
    if S.get('unmap'): print('frame points on the face:'); [print(f'  {k:8s} -> ({m[0]:7.2f}, {m[1]:7.2f})') for k, m in zip(S['unmap'], toM(list(S['unmap'].values())))]
    json.dump({'frame': fr, 'H': Hm.tolist(), 'pairs': {mk[i]: pk[j] for i, j in pr}}, open(sp.replace('.json', '') + '.H.json', 'w')); print('wrote', sp.replace('.json', '') + '.H.json')
    if '--draw' in a:
        o = img.copy(); toF = lambda M: cv2.perspectiveTransform(np.array(M, np.float32).reshape(-1, 1, 2), Hm)[:, 0]
        for k, v in hs.items():   # every model hole at its size: green if anchored on, yellow if used but unpaired, red if left out of "use"
            c = (0, 200, 0) if k in [mk[i] for i, _ in pr] else (0, 255, 255) if k in mk else (0, 0, 255); r = v[2] if len(v) > 2 else 0.5
            ring = toF(np.c_[v[0] + r * np.cos(np.linspace(0, 6.3, 40)), v[1] + r * np.sin(np.linspace(0, 6.3, 40))]).astype(np.int32)
            cv2.polylines(o, [ring], True, c, 3); u = ring.mean(0).astype(int); cv2.putText(o, k, (int(u[0]) + 14, int(u[1]) - 14), 0, 1.1, c, 3)
        for k, u in S['picks'].items(): cv2.drawMarker(o, tuple(map(int, u)), (255, 0, 255), 1, 26, 3)
        for k, v in S.get('map', {}).items(): u = toF([v])[0]; cv2.drawMarker(o, tuple(map(int, u)), (255, 128, 0), 0, 40, 4); cv2.putText(o, k, (int(u[0]) + 14, int(u[1]) + 30), 0, 1.3, (255, 128, 0), 4)
        cv2.imwrite(a[a.index('--draw') + 1], o)
else: sys.exit(__doc__)
