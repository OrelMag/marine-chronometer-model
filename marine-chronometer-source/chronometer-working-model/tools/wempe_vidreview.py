"""The review of the Einheits-Chronometer videos against the Wempe model (27 October 2026; References/wempe/VIDEOS.md, "The video review"): the two
measurements made by script, so they can be run again. No browser; opencv-python, numpy, scipy. The videos are in $MC_VIDEO (default ~/mc-video;
video.py fetch, or yt-dlp for the 1080p/2160p files), so ci.py can't run it.

  python wempe_vidreview.py sharp ID FROM TO [x0 y0 x1 y1]     the frames FROM..TO (s) ranked by the variance of the Laplacian over the box (whole frame
                                                                by default), the six sharpest printed: how each frame read in the review was picked
  python wempe_vidreview.py template [--t 317.5] [--json OUT]  Ldzmn4kuKMA 5:17.5: the restorer's terminal-curve template (a textbook figure) against
                                                                05 03_7's table (wempe/js/escapement.js TBL), about 5 s

template: the left copy of the figure (lying face-on on the bench) in crop [290:790, 180:690] of the 1080p frame; the ink is its darkness in luma under a
15 px closing of the paper; the coil's circle is fitted (soft L1) to the ink 200-240 px from the crop's middle, refined on the pixels within 8 px of it;
every 5 deg about its centre the ink's ridges are found (peaks over 35 along the ray); the terminal curve's ridge (125-220 px, the one nearest a first
guess where two compete) at 55-170 and 200-330 deg (clear of the stud's and the coil's ink) is fitted with a circle. Scaled so the coil's ridge is 6.4
(05 03_7's coil to the strip's centre), its radius from the coil's centre at each angle from where it meets the coil is set beside 05 03_7's
(TBL + 0.1425, the strip's centre). Found: a circle (rms 0.92 px over 51 points), r 0.754 of the coil's, centred 0.193 of it off: up to 1.39 mm from
05 03_7's curve at 120-130 deg. The figure is generic (not to the Wempe's scale), so this says what the restorer formed, not what Wempe drew."""
import os, sys, json
import numpy as np, cv2
from scipy import optimize
from scipy.signal import find_peaks
HOME = os.environ.get('MC_VIDEO', os.path.expanduser('~/mc-video'))
def vid(i):
    fs = [os.path.join(HOME, f) for f in os.listdir(HOME) if f.startswith(i) and f.split('.')[-1] in ('webm', 'mp4', 'mkv') and not f.endswith('.part')]
    if not fs: sys.exit(f'{i}: not in {HOME}')
    return max(fs, key=os.path.getsize)

def sharp(i, t0, t1, box=None):
    v = cv2.VideoCapture(vid(i)); fps = v.get(5); v.set(cv2.CAP_PROP_POS_FRAMES, int(t0 * fps)); res = []
    while True:
        n = int(v.get(cv2.CAP_PROP_POS_FRAMES)); ok, f = v.read()
        if not ok or n / fps > t1: break
        if box: x0, y0, x1, y1 = box; f = f[y0:y1, x0:x1]
        res.append((cv2.Laplacian(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var(), n, n / fps))
    for r in sorted(res, reverse=True)[:6]: print('%.0f  frame %d  %.3f s' % r)

# 05 03_7's radii to the strip's inside every 10 deg from where the curve leaves the coil (wempe/js/escapement.js TBL); the strip 0.285 thick
TBL = [6.12, 6.07, 6.01, 5.96, 5.90, 5.83, 5.78, 5.74, 5.72, 5.65, 5.59, 5.49, 5.34, 5.19, 5.01, 4.79, 4.54, 4.31, 4.11, 3.88, 3.69, 3.52, 3.41, 3.37, 3.37, 3.37]

def template(t=317.5, out=None):
    v = cv2.VideoCapture(vid('Ldzmn4kuKMA')); v.set(cv2.CAP_PROP_POS_FRAMES, int(t * v.get(5))); ok, f = v.read()
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32)[290:790, 180:690]
    ink = cv2.morphologyEx(g, cv2.MORPH_CLOSE, np.ones((15, 15))) - g; H, W = ink.shape
    ys, xs = np.nonzero(ink > 40); fr = lambda p, m: np.hypot(xs[m] - p[0], ys[m] - p[1]) - p[2]
    d = np.hypot(xs - 255, ys - 255); m = (d > 200) & (d < 240); p = optimize.least_squares(lambda q: fr(q, m), [255, 255, 220], loss='soft_l1', f_scale=3).x
    for _ in range(3):
        m = np.abs(np.hypot(xs - p[0], ys - p[1]) - p[2]) < 8; p = optimize.least_squares(lambda q: fr(q, m), p, loss='soft_l1', f_scale=2).x
    cx, cy, R = p; print(f'the coil: centre ({cx:.1f}, {cy:.1f}) px, r {R:.1f} px, {m.sum()} ink px, rms {np.sqrt(np.mean(fr(p, m) ** 2)):.2f} px')
    pts = []
    for a in range(0, 360, 5):
        if not (55 <= a <= 170 or 200 <= a <= 330): continue
        th = np.radians(a); rr = np.arange(40, R + 15, 0.5); x = (cx + rr * np.cos(th)).astype(np.float32); y = (cy - rr * np.sin(th)).astype(np.float32)
        val = cv2.remap(ink, x.reshape(1, -1), y.reshape(1, -1), cv2.INTER_LINEAR)[0]; val[(x < 0) | (x >= W - 1) | (y < 0) | (y >= H - 1)] = 0
        pk, _ = find_peaks(val, height=35, distance=8); c = [rr[k] for k in pk if 125 < rr[k] < 220]
        if c: pts.append((a, min(c, key=lambda r: abs(r - (165 + 51 * np.cos(np.radians(a - 195)))))))
    pts = np.array(pts); th = np.radians(pts[:, 0]); X, Y = pts[:, 1] * np.cos(th), pts[:, 1] * np.sin(th)
    q = optimize.least_squares(lambda q: np.hypot(X - q[0], Y - q[1]) - q[2], [-50, -13, 165]).x; e = np.hypot(q[0], q[1]); k = 6.4 / R
    rms = np.sqrt(np.mean((np.hypot(X - q[0], Y - q[1]) - q[2]) ** 2))
    print(f'the terminal curve: a circle r {q[2]:.1f} px ({q[2] / R:.3f} of the coil\'s), centred {e:.1f} px ({e / R:.3f}) off, toward {np.degrees(np.arctan2(q[1], q[0])) % 360:.1f} deg; rms {rms:.2f} px over {len(pts)} points')
    rho, ee = q[2] * k, e * k; rows = []
    print(' deg   05 03_7 (strip centre)   template (coil 6.4)   difference')
    for i, tb in enumerate(TBL):
        a = np.radians(i * 10); rc = ee * np.cos(a) + np.sqrt(max(rho ** 2 - (ee * np.sin(a)) ** 2, 0)); rows.append([i * 10, round(tb + 0.1425, 3), round(float(rc), 3)])
        print(f'{i * 10:4d}   {tb + 0.1425:6.2f}   {rc:6.2f}   {rc - tb - 0.1425:+6.2f}')
    if out: json.dump(dict(frame_s=t, coil_px=[round(float(v), 2) for v in p], curve_px=[round(float(v), 2) for v in q], rms_px=round(float(rms), 2), n=len(pts), table=rows), open(out, 'w'), indent=1)

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == 'sharp': sharp(a[1], float(a[2]), float(a[3]), list(map(int, a[4:8])) if len(a) >= 8 else None)
    elif a[0] == 'template':
        t = float(a[a.index('--t') + 1]) if '--t' in a else 317.5; template(t, a[a.index('--json') + 1] if '--json' in a else None)
    else: sys.exit(__doc__)
