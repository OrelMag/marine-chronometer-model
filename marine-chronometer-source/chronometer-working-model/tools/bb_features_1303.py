"""The barrel bridge's small features on KLUwI2UUCMQ 13:03.5 and 13:04.4 (20 October 2026; PROVENANCE.md, "The barrel bridge against the owner's trace"):
the set-up spring pin's counterbore, the far steady pin and the slotted head, each found by its edge (mfgfit.locate_circle) and put in mm through the
frame's map from mfgfit.py match (the .matched.mm.json beside each crop in $MC_VIDEO/oq/measure/01_barrel_bridge: 13:03.5 from the owner's points,
tools/traces/f_KLUwI2UUCMQ_13-03.5_crop.mm.json, held to the rim with --arc edge1:1-16=0,0,38.8; 13:04.4 from its round features found by Hough).
A few seconds."""
import json, sys, os, numpy as np, cv2
sys.argv = sys.argv[:1]; import mfgfit as m
M = os.path.join(os.environ.get('MC_VIDEO', os.path.expanduser('~/mc-video')), 'oq', 'measure', '01_barrel_bridge')
feats = {'counterbore (set-up spring pin)': ((-24.2, 3.6), 0.8), 'steady pin bbp[1]': ((-21.0, 20.0), 0.9), 'slotted head': ((-22.9, -16.3), 0.9)}
Ba = np.array([-22.144, -5.347])
for F in ('f_KLUwI2UUCMQ_13-04.4_crop', 'f_KLUwI2UUCMQ_13-03.5_crop'):
    H = np.array(json.load(open(os.path.join(M, F + '.matched.mm.json')))['planes']['Face']['calibration']['H_mm_to_px']); Hi = np.linalg.inv(H); img = cv2.imread(os.path.join(M, F + '.png'))
    for nm, ((x, z), r) in feats.items():
        c = m.H_apply(H, [[x, z]])[0]; s = m.local_scale(H, c); f = m.locate_circle(img, c, r*s, 1.2*s)
        if f is None: print(F[14:21], nm, 'not found'); continue
        q = m.fit_circle(m.H_apply(Hi, f['px'])); d = q[:2] - Ba
        print(f'{F[14:21]} {nm:31s} centre ({q[0]:7.3f}, {q[1]:7.3f})  D {2*q[2]:.3f}  ({f["how"]}, {"dark" if f["pol"] > 0 else "bright"} inside)  from the barrel arbor r {np.hypot(*d):.3f} at {np.degrees(np.arctan2(d[1], d[0])):.1f} deg')
