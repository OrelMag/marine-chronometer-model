"""The sustaining ratchet's face as the model draws it (movement.js: the winding pawls' springs, their screws and pins, the pawls' studs, the holes
beside the arms, the bore and the sustaining spring's pin hole) laid over KLUwI2UUCMQ 27:00 flattened on the ratchet's tips (40 px/mm, f 6000:
E:\\mc-video\\oq\\ledger\\inner_fusee\\sr2700_f6000.png and its .map.json), placed by the two studs found on the frame (sr2700.found.mm.json).
The frame's angles run the other way round from the model's t (the screws by stud R sit 18 and 49.5 deg past it on the frame, 161.8 and 130.5 back
from the other stud in the model), so t is drawn as the stud's angle less t.

    python fusee_face_overlay.py [OUT.png]      (about a second)
"""
import json, math, sys
import numpy as np, cv2

D = r'E:\mc-video\oq\ledger\inner_fusee'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'r_fusee_face_2700.png'
# the model's numbers (movement.js, the winding pawls' block)
WFS = 16.55/14.53; WPR = 9.84; WRI = 8.04; WRO = 10.475; WW = 0.78; WBI = WRO-WW; WT0 = 87; WT1 = 110; WTE = 178
WSC = [(130.5, 9.25), (161.8, 9.25)]; WSN = (108, 8.1*WFS, 0.38*WFS); WTH = (13.6, 6.8*WFS, 0.66*WFS); WSD = 0.385*WFS; WEYE = 1.1*WFS

F = json.load(open(D+r'\sr2700.found.mm.json'))['planes']['found']['traces']
img = cv2.imread(D+r'\sr2700_f6000.png'); px = 40.0; o = 740.94
sR = np.array([F['studR']['circle_mm'][k] for k in 'xz']); sL = np.array([F['studL']['circle_mm'][k] for k in 'xz']); C = (sR+sL)/2
aR = math.atan2(*(sR-C)[::-1]); aL = aR+math.pi
def P(a0, t, r): a = a0-math.radians(t); return C+r*np.array([math.cos(a), math.sin(a)])
def pix(p): return (int(round(p[0]*px+o)), int(round(p[1]*px+o)))
def poly(pts, col, w=2, closed=False): cv2.polylines(img, [np.array([pix(p) for p in pts], np.int32)], closed, col, w, cv2.LINE_AA)
def circ(p, r, col, w=2): cv2.circle(img, pix(p), int(round(r*px)), col, w, cv2.LINE_AA)
def taper(a0):
    A = P(a0, WT0, WBI); B = P(a0, WT1, WRI); R0 = 3.2; m = (A+B)/2; d = B-A; c = np.hypot(*d); h = math.sqrt(R0*R0-c*c/4)
    n = np.array([-d[1], d[0]])/c
    if n @ (m-C) > 0: n = -n
    Q = m+n*h; a1 = math.atan2(*(A-Q)[::-1]); a2 = math.atan2(*(B-Q)[::-1])
    while a2-a1 > math.pi: a2 -= 2*math.pi
    while a1-a2 > math.pi: a2 += 2*math.pi
    return [Q+R0*np.array([math.cos(a1+(a2-a1)*i/20), math.sin(a1+(a2-a1)*i/20)]) for i in range(21)]
for a0, col in ((aR, (0, 0, 255)), (aL, (255, 0, 255))):   # the spring bearing on each pawl, red on R's, magenta on L's
    poly([P(a0, t, WRO) for t in np.arange(30, WTE+0.1, 1)], col)
    poly([P(a0, t, WBI) for t in np.arange(30, WT0+0.1, 1)]+taper(a0)+[P(a0, t, WRI) for t in np.arange(WT1, WTE+0.1, 1)], col)
    for t, r in WSC: circ(P(a0, t, r), 0.45, col)
    circ(P(a0, WSN[0], WSN[1]), WSN[2], col, 1); circ(P(a0, WTH[0], WTH[1]), WTH[2], col, 1)
    circ(P(a0, 0, WPR), WSD, col, 1); circ(P(a0, 0, WPR), WEYE, col, 1)
circ(C, 3.34, (0, 255, 0)); circ(C, 16.55, (0, 255, 0), 1)
for k in ('studR', 'studL', 'scrA1', 'scrA2', 'scrB1', 'scrB2', 'wthR', 'wthL', 'pinhole', 'bore'):   # what mfgfit found, cyan
    c = F[k]['circle_mm']; circ(np.array([c['x'], c['z']]), c['r'], (255, 255, 0), 1)
cv2.imwrite(OUT, img); print('wrote', OUT, 'studs', sR, sL, 'pattern centre', C)
