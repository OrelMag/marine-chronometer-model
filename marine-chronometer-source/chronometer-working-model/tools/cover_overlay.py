"""The set-up cover's outline as movement.js now draws it (cover_fit.py's circles), drawn back on the frames it was measured on and checked on.

    python cover_overlay.py traces/cover_11-52.cal.json OUT.png          # through cover_ends.py's map (the face's homography, the pads' shift)
    python cover_overlay.py --top FRAME HOLES_PX OUT.png                 # a frame of the cover in place from above (11:48): an affine fitted
                                                                         # on the cover's own holes' centres picked there, HOLES_PX = arb:x,y;s0:x,y;s1:x,y;ck:x,y

The outline is rebuilt here from the same four circles as movement.js (the sides, the ends, the pads' inner circle), with its holes.
On the face-down frame the pads' parts go through the pads' shift; from above the cover's top is one plane.
"""
import sys, json, math, os
import numpy as np, cv2

VID = os.environ.get('MC_VIDEO', 'E:/mc-video')
Ba = np.array([-22.144, -5.347]); SC = [np.array([-28.64, 5.72]), np.array([-15.19, -16.58])]; SCK = np.array([-22.56, -15.46])
CE, RE = np.array([-22.865, -5.943]), 14.690; CL, RL = np.array([2.292, 9.548]), 23.045; CR, RR = np.array([-47.050, -21.112]), 23.586; CP, RP = np.array([-22.476, -5.750]), 11.490
HOLES = [(Ba, 3.12), (SC[0], 0.77), (SC[1], 0.77), (SCK, 0.49)]

def up(p): return (p - Ba) @ (SC[0] - SC[1]) > 0
def ccx(c1, r1, c2, r2):
    d = np.hypot(*(c2 - c1)); a = (r1*r1 - r2*r2 + d*d)/(2*d); h = math.sqrt(max(r1*r1 - a*a, 0)); u = (c2 - c1)/d; m = c1 + a*u; v = np.array([-u[1], u[0]])
    P = [m + h*v, m - h*v]; return P if up(P[0]) else P[::-1]
def arc(c, r, A, B, n=60):
    a0 = math.atan2(*(A - c)[::-1]); d = math.atan2(*(B - c)[::-1]) - a0; d = (d + math.pi) % (2*math.pi) - math.pi
    t = a0 + d*np.linspace(0, 1, n); return np.c_[c[0] + r*np.cos(t), c[1] + r*np.sin(t)]
def outline():
    LU, LL = ccx(CE, RE, CL, RL); RU, RL_ = ccx(CE, RE, CR, RR); pLU, pLL = ccx(CP, RP, CL, RL); pRU, pRL = ccx(CP, RP, CR, RR)
    out = np.r_[arc(CE, RE, LU, RU), arc(CR, RR, RU, RL_), arc(CE, RE, RL_, LL), arc(CL, RL, LL, LU)]
    inner = [arc(CP, RP, pRU, pLU), arc(CP, RP, pLL, pRL)]
    return out, inner
def circle(c, r, n=90): t = np.linspace(0, 2*math.pi, n); return np.c_[c[0] + r*np.cos(t), c[1] + r*np.sin(t)]
def Hap(H, P): Y = np.c_[P, np.ones(len(P))] @ np.asarray(H).T; return Y[:, :2]/Y[:, 2:3]

def main(a):
    out, inner = outline()
    if a[0] == '--top':
        img = cv2.imread(os.path.join(VID, 'frames', a[1])); pk = {k: tuple(map(float, v.split(','))) for k, v in (s.split(':') for s in a[2].split(';'))}
        M = {'arb': Ba, 's0': SC[0], 's1': SC[1], 'ck': SCK}; A = np.array([M[k] for k in pk]); B = np.array([pk[k] for k in pk])
        H = np.r_[np.linalg.lstsq(np.c_[A, np.ones(len(A))], B, rcond=None)[0].T, [[0, 0, 1]]]   # an affine: three of the four centres are nearly in a line, so a homography on them is degenerate
        f = lambda P, lev=0: Hap(H, P); png = a[3]; lw = 3
    else:
        cal = json.load(open(a[0], encoding='utf-8')); Hi = np.linalg.inv(np.array(cal['H_px_to_mm'])); o = np.array(cal['origin']); dl = np.array(cal['delta_px']); k = cal.get('scale', 1.0)
        img = cv2.imread(os.path.join(VID, 'frames', cal['frame']))
        f = lambda P, lev=0: (Hap(Hi, P) + o + dl*lev)/k; png = a[1]; lw = 3
    pad = lambda P: np.hypot(*(P - CP).T) > RP   # on the pads (toward the camera, face down)
    ov = img.copy()
    if a[0] != '--top':   # the outline's points each at their level
        lev = pad(out).astype(float); px = np.array([f(p[None], l)[0] for p, l in zip(out, lev)])
        cv2.polylines(ov, [np.round(px).astype(np.int32)], True, (0, 0, 255), lw)
        for P in inner: cv2.polylines(ov, [np.round(f(P, 1)).astype(np.int32)], False, (255, 0, 255), lw); cv2.polylines(ov, [np.round(f(P, 0)).astype(np.int32)], False, (255, 128, 255), 1)
        for c, r in HOLES: cv2.polylines(ov, [np.round(f(circle(c, r), float(pad(c[None])[0]))).astype(np.int32)], True, (0, 255, 0), 2)
    else:
        cv2.polylines(ov, [np.round(f(out)).astype(np.int32)], True, (0, 0, 255), lw)
        for c, r in HOLES: cv2.polylines(ov, [np.round(f(circle(c, r))).astype(np.int32)], True, (0, 255, 0), 2)
    allp = f(out); x0, y0 = np.maximum(allp.min(0) - 150, 0).astype(int); x1, y1 = np.minimum(allp.max(0) + 150, [img.shape[1], img.shape[0]]).astype(int)
    cv2.imwrite(png, np.hstack([img[y0:y1, x0:x1], ov[y0:y1, x0:x1]])); print('->', png)

if __name__ == '__main__': main(sys.argv[1:])
