"""The Wempe's maintaining spring (Gegenfeder 05 06 01-1) traced on its sheet, the construction fusee.js builds its outline from (its MS-W48 block and the eye's
outer blend; the Wempe README, "Readings corrected").

    python wempe_maintspring.py          (no browser; opencv-python, numpy; a second)

The sheet (References/wempe/drawings/05-06/Wempe_05-06_10.jpg, 5:1) is read along rays from the ring's centre every 0.25°: each ray's dark runs (the drawn lines),
each run's ink-weighted middle the edge. The centre and the scale come from the ring's two circles, fitted to the outer and inner edges where the band is plain
(50-262° from the eye; 2.5-sigma outliers dropped, three passes, the centre the two fits' mean): px/mm the mean of their radii over 16.125 and 14.125 (Ø 32.3 -0.1, 2 wide).
u is the sheet's angle from the eye's hole (anticlockwise as drawn), the inner edge tracked run to run so dimension lines and the hole at 295° are passed over.

Prints, for fusee.js's three arcs and the blend:
  - the inner edge from the eye, 11-40°: a circle fitted (fusee.js: r 10.41, tangent to the inner circle at 50.3°);
  - the swell, 270-293.5°: its distance from the r 6 circle about 8.125 on the 9 o'clock line (the sheet's "6" and its small circle there);
  - the end, 295-335°: a circle fitted (fusee.js: r 13.24, its centre on the 160.3° ray, through the "4" at 336°);
  - the outer edge from the eye, 0-60°: its radius against the ring's (fusee.js: an arc tangent to the outer circle 60° from the eye and to the eye's round).
Reports, never fails. 27 October 2026 (the drawings check's open items)."""
import pathlib, sys
import cv2, numpy as np

HERE = pathlib.Path(__file__).resolve().parent
IMG = HERE.parents[2] / 'References' / 'wempe' / 'drawings' / '05-06' / 'Wempe_05-06_10.jpg'
im = cv2.imread(str(IMG), 0).astype(np.float32)
HOLE = np.array((350.95, 589.35))   # the eye's hole, px (a circle fitted to its drawn edge along 90 rays)

def fit(P):
    P = np.asarray(P, float); A = np.c_[2 * P[:, 0], 2 * P[:, 1], np.ones(len(P))]; s = np.linalg.lstsq(A, (P ** 2).sum(1), rcond=None)[0]
    r = np.sqrt(s[2] + s[0] ** 2 + s[1] ** 2); return np.array([s[0], s[1], r]), np.hypot(P[:, 0] - s[0], P[:, 1] - s[1]) - r

def runs(c, a, r0, r1):
    rs = np.arange(r0, r1, 0.05); xs = c[0] + rs * np.cos(a); ys = c[1] + rs * np.sin(a)
    v = cv2.remap(im, xs.astype(np.float32)[None], ys.astype(np.float32)[None], cv2.INTER_CUBIC)[0]; R = []
    for i in np.where(v < 110)[0]:
        if R and i - R[-1][-1] <= 4: R[-1].append(i)
        else: R.append([i])
    return [float((rs[r] * (255 - v[r])).sum() / (255 - v[r]).sum()) for r in R]

c = np.array((355.82, 344.22))
for _ in range(3):   # the ring's centre and scale
    ea = np.arctan2(*(HOLE - c)[::-1]); O, I = [], []
    for u in np.arange(50, 262, 0.5):
        a = ea - np.radians(u); R = runs(c, a, 170, 300)
        if len(R) >= 2: O.append(c + R[-1] * np.array((np.cos(a), np.sin(a)))); I.append(c + R[-2] * np.array((np.cos(a), np.sin(a))))
    O, I = np.array(O), np.array(I)
    for _ in range(3): fo, ro = fit(O); O = O[np.abs(ro) < 2.5 * ro.std()]
    for _ in range(3): fi, ri = fit(I); I = I[np.abs(ri) < 2.5 * ri.std()]
    c = (fo[:2] + fi[:2]) / 2
k = (fo[2] / 16.125 + fi[2] / 14.125) / 2; ea = np.arctan2(*(HOLE - c)[::-1])
print('the ring: centre (%.2f, %.2f) px, %.3f px/mm; outer r %.3f (rms %.3f), inner r %.3f (rms %.3f) mm; the eye\'s hole on r %.3f'
      % (*c, k, fo[2] / k, ro.std() / k, fi[2] / k, ri.std() / k, np.hypot(*(HOLE - c)) / k))
xy = lambda u, r: np.array((r * np.sin(np.radians(u)), r * np.cos(np.radians(u))))   # the sheet's frame: the eye on +y, the band toward +x

def track(u0, u1, r_start):   # the inner edge, run to run (each within 0.12 + 0.05 a degree of the last)
    out = []; last, lu = r_start, u0
    for u in np.arange(u0, u1, 0.25):
        R = runs(c, ea - np.radians(u), 150, 300)
        if len(R) < 2: continue
        cand = [x / k for x in R[:-1] if abs(x / k - last) < 0.12 + 0.05 * (u - lu)]
        if not cand: continue
        r = min(cand, key=lambda x: abs(x - last)); out.append((u, R[-1] / k, r)); last, lu = r, u
    return out

eye = track(11, 40.01, 13.08); P = np.array([xy(u, r) for u, o, r in eye]); fA, rA = fit(P)
print('\nnear the eye, 11-40°: a circle r %.3f, its centre %.3f from the axis on the %.1f° ray (rms %.4f, max %.4f mm); tangent to the inner circle it would sit %.3f from the axis'
      % (fA[2], np.hypot(*fA[:2]), np.degrees(np.arctan2(*fA[:2])) % 360, rA.std(), np.abs(rA).max(), 14.125 - fA[2]))
sw = track(262, 336.01, 14.06)
c6 = xy(270, 8.125); d6 = [np.hypot(*(xy(u, r) - c6)) - 6 for u, o, r in sw if 278 <= u <= 293.5]
print('the swell, 278-293.5°: the edge off the r 6 circle about 8.125 on the 270° ray: mean %+.3f, max %.3f mm' % (np.mean(d6), np.abs(d6).max()))
P = np.array([xy(u, r) for u, o, r in sw if 295 <= u <= 335]); fE, rE = fit(P)
print('the end, 295-335°: a circle r %.3f, its centre %.3f from the axis on the %.2f° ray (rms %.4f, max %.4f mm)'
      % (fE[2], np.hypot(*fE[:2]), np.degrees(np.arctan2(*fE[:2])) % 360, rE.std(), np.abs(rE).max()))
oe = [(u, o) for u, o, r in track(0.5, 60.01, 12.6)]
ref = np.median([o for u, o, r in track(60, 120, 14.2)])
print('the outer edge from the eye, against its own %.3f over 60-120°:' % ref, ', '.join('%d° %+.3f' % (u, o - ref) for u, o in oe if abs(u % 10) < 0.2))
