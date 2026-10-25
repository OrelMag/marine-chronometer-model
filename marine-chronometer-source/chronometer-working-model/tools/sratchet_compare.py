"""The sustaining ratchet's face (sratchet: the winding pawls, their springs, the studs, screws and holes, the sustaining spring's pin) rendered alone
straight down (isolate.py) and laid beside KLUwI2UUCMQ 27:00 flattened on the ratchet's tips (40 px/mm, f 6000:
$MC_VIDEO/oq/ledger/inner_fusee/sr2700_f6000.png): the render scaled by the bore (r 3.34), centred on the frame's bore and turned by the mean of
the two studs' angles (the frame's 184 deg apart, the model's 180: +-2 deg, about 0.5 mm at the rim). Writes r_sr_compare.png (frame | model |
blend) and r_sr_zoom_R.png, _L.png, _pin.png. The pawls stand free on the frame and seated in the model, so they are turned differently; compare
their outlines in their own frames (25 October 2026).

    python sratchet_compare.py        (about a minute: isolate.py's render, then a second)
"""
import json, math, os, pathlib, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
HERE = pathlib.Path(__file__).resolve().parent
D = pathlib.Path(os.environ.get('MC_VIDEO', r'E:\mc-video'))/'oq'/'ledger'/'inner_fusee'
FU = (14.306, -14.519)   # L.Fu
subprocess.run([sys.executable, str(HERE/'isolate.py'), 'sratchet', '--look', '0', '1.5707', '75', str(FU[0]), '0', str(FU[1])], check=True)
rd = Image.open('r_iso_0.png').convert('RGB'); a = np.asarray(rd).astype(int)
lab, n = nd.label(a.min(2) > 225); k = np.bincount(lab[350:450, 550:650].ravel()); k[0] = 0; ys, xs = np.nonzero(lab == k.argmax())
cx, cy, rpx = xs.mean(), ys.mean(), math.sqrt(len(xs)/math.pi); s = 40/(rpx/3.34)   # the bore, white in the render
w = (a.min(2) > 215) & (np.ptp(a, 2) < 20); w[:, 1050:] = 0; lab, n = nd.label(w); st = []
for i in range(1, n+1):   # the studs' bright ends: small, r 10.1-10.8 in the render's mm (the studs stand 0.5 proud, so read 10.4; the screw holes beside them 9.7)
    m = lab == i
    if 30 < m.sum() < 2000:
        y, x = nd.center_of_mass(m); r = math.hypot(x-cx, y-cy)/(rpx/3.34)
        if 10.1 < r < 10.8: st.append(math.degrees(math.atan2(y-cy, x-cx)))
F = json.load(open(D/'sr2700.found.mm.json'))['planes']['found']['traces']; mp = json.load(open(D/'sr2700_f6000.map.json'))
b = F['bore']['circle_mm']; ang = lambda c: math.degrees(math.atan2(c['z']-b['z'], c['x']-b['x']))
fR, fL = ang(F['studR']['circle_mm']), ang(F['studL']['circle_mm'])
mR = sorted(st)[0] if len(st) == 2 else -87.2; mL = mR+180   # the model's stud that goes onto the frame's R: the turn that puts the pin hole on the frame's (checked 25 October 2026)
rot = ((fR-mR)+(fL-mL))/2
print('studs: frame', round(fR, 1), round(fL, 1), 'model', [round(t, 1) for t in st], 'turn', round(rot, 1), 'scale', round(s, 3))
ph = Image.open(D/'sr2700_f6000.png').convert('RGB'); K = mp['px_per_mm']; px, py = (b['x']-mp['x0'])*K, (b['z']-mp['z0'])*K
big = rd.resize((round(rd.width*s), round(rd.height*s)), Image.LANCZOS); bx, by = cx*s, cy*s
big = big.rotate(-rot, center=(bx, by), resample=Image.BICUBIC, fillcolor=(230, 232, 234))
out = Image.new('RGB', ph.size, (230, 232, 234)); out.paste(big, (round(px-bx), round(py-by)))
def sheet(box, name):
    P, M = ph.crop(box), out.crop(box); W = P.width; sh = Image.new('RGB', (3*W+40, P.height), 'white')
    for i, im in enumerate((P, M, Image.blend(P, M, 0.5))): sh.paste(im, (i*(W+20), 0))
    sh.save(name); print('wrote', name)
R = 17.3*K; sheet((round(px-R), round(py-R), round(px+R), round(py+R)), 'r_sr_compare.png')
pin = F['pinhole']['circle_mm']; pa = ang(pin); pr = math.hypot(pin['x']-b['x'], pin['z']-b['z'])
for nm, a0, rr, h in (('R', fR-25, 9.0, 6), ('L', fL-25, 9.0, 6), ('pin', pa, pr, 2.5)):
    zx, zy = px+rr*K*math.cos(math.radians(a0)), py+rr*K*math.sin(math.radians(a0))
    sheet((round(zx-h*K), round(zy-h*K), round(zx+h*K), round(zy+h*K)), f'r_sr_zoom_{nm}.png')
