"""detent_overlay.py: the detent assembly in plan, the model as drawn now against the measurements it was rebuilt from.

    python detent_overlay.py [OUT.png]      (about 3 s; default r_detent_overlay.png in the current directory)

The model's outlines (shared/escapement.js's pieces and fixed parts, the trip spring Ps0-Pt, the block's pins from movement.js's DBLK, the steady pins and clamp
screw) are put in the frame the measurements were made in: t along the detent, n across (+n away from the escape wheel), mm, aligned on the block's two
positioning pins (the frame of the point of flexure drawn until 20 October 2026, the pins at (-7.212, -1.612) and (2.908, -1.737)). The measurements are
KLUwI2UUCMQ 11:10-11:33, the detent out and held up, four frames by bundle adjustment on those pins (10.12 apart): $MC_VIDEO/oq/ledger/detent's
ba_f12000.json (the block's box and pins), tri_f12000.json (points triangulated) and aray.json (lines read on 11:26.435 at their heights), and Fig. 90
scaled by the same pins. The frames and those files stay outside the repository (References/VIDEOS.md). Model README, "The detent's dimensions"."""
import json, os, pathlib, re, subprocess, sys
import numpy as np, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
HERE = pathlib.Path(__file__).resolve().parent
D = pathlib.Path(os.environ.get('MC_VIDEO', 'E:/mc-video')) / 'oq' / 'ledger' / 'detent'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'r_detent_overlay.png'
JS = r"""const {ESC:E}=require(process.argv[1]).build();const ES=E.ES,F=E.Ft,d=E.dirB,n=E.nB,tn=p=>[((p.x-F.x)*d.x+(p.y-F.y)*d.y)*ES,((p.x-F.x)*n.x+(p.y-F.y)*n.y)*ES];
const o={pieces:{},fixed:{},Pt:tn(E.Pt),Ps0:tn(E.Ps0),Jc:tn(E.Jc),rJ:E.rJ*ES,bal:tn({x:0,y:0}),ES};for(const k in E.pieces)o.pieces[k]=E.pieces[k].map(tn);for(const k in E.fixed)o.fixed[k]=E.fixed[k].map(tn);console.log(JSON.stringify(o));"""
M = json.loads(subprocess.run(['node', '-e', JS, str(HERE / 'escapement.js')], capture_output=True, text=True, check=True).stdout)
mv = (HERE.parent / 'js' / 'movement.js').read_text(encoding='utf-8'); ES = M['ES']
DB = json.loads(re.search(r'const DBLK=(\{s:\[[^;]*?\]\]\});', mv).group(1).replace('s:', '"s":').replace('p:', '"p":'))
pins = np.array(DB['p']) * ES
tCS = float(re.search(r'const tCS=(-?[\d.]+)/ES', mv).group(1)); sp = [float(v) for v in re.search(r'for\(const t of\[(-?[\d.]+)/ES,(-?[\d.]+)/ES\]\)hn\(across\(dd,t,-0\.2', mv).groups()]
pL0, pR0 = np.array([-7.212, -1.612]), np.array([2.908, -1.737])   # the measurement's frame: the pins where the model drew them until 20 October 2026
off = (pL0 + pR0) / 2 - pins.mean(0)   # the model as drawn now, moved onto the pins
X = lambda P: np.array(P) + off
fig, ax = plt.subplots(figsize=(17, 7.5))
for k, P in list(M['pieces'].items()) + list(M['fixed'].items()):
    P = X(P + [P[0]]); ax.plot(P[:, 0], P[:, 1], color='0.35', lw=1)
q = X([M['Ps0'], M['Pt']]); ax.plot(q[:, 0], q[:, 1], color='0.35', lw=2.5, alpha=0.6)
for t, n in X(pins): ax.add_patch(plt.Circle((t, n), 0.425, fill=False, color='0.35'))
for t in sp: q = X([[t, 0.55], [t, 0.55 + 1.05]]); ax.plot(q[:, 0], q[:, 1], color='0.35', lw=2)
c = X([[tCS * ES, 0.55]])[0]; ax.plot(*c, 's', color='0.35', ms=5)
ax.plot(*X([M['bal']])[0], '+', color='0.35', ms=12)
u = (pR0 - pL0) / np.linalg.norm(pR0 - pL0); v = np.array([-u[1], u[0]]); tn = lambda a, b: pL0 + u * a + v * b
B = json.load(open(D / 'ba_f12000.json')); T = json.load(open(D / 'tri_f12000.json')); A = json.load(open(D / 'aray.json')); Xb = B['X']
bx = np.array([tn(Xb[k][0], Xb[k][1]) for k in ('bLo', 'bEo', 'bEi', 'bLi', 'bLo')]); ax.plot(bx[:, 0], bx[:, 1], 'r-', lw=1.6)
for t, n in (pL0, pR0): ax.add_patch(plt.Circle((t, n), 0.43, fill=False, color='r', lw=1.4))
P = lambda k, s: np.array(s[k]['tn'])
def seg(ks, s, **kw): q = np.array([P(k, s) for k in ks]); ax.plot(q[:, 0], q[:, 1], **kw)
seg(['ftT', 'ftB'], A, color='r', lw=2); seg(['s1', 's2'], A, color='r', lw=1.2, ls='--'); seg(['xTL', 'xTR', 'xBR', 'xBL', 'xTL'], A, color='r', lw=1.6)
seg(['bl0u', 'bl1u'], A, color='r', lw=1); seg(['bl0l', 'bl1l'], A, color='r', lw=1); seg(['brTL', 'brKL'], A, color='r', lw=1.6); seg(['brTR', 'brKR'], A, color='r', lw=1.6)
seg(['tsR', 'tsEa'], A, color='r', lw=2.5, alpha=0.7); seg(['armK', 'hornE'], A, color='r', lw=1.6); seg(['hornE', 'nibT'], A, color='r', lw=1.6)
for k in ('rubyT', 'rubyB', 'jbBR', 'jbTL', 'nibR', 'nibB', 'tsE', 'sp1T', 'sp1R', 'sp2R', 'csH', 'armK'):
    if k in T: ax.plot(*T[k]['tn'], 'o', color='m' if k.startswith('ruby') else 'r', ms=4); ax.annotate(k, T[k]['tn'], fontsize=7, color='r', xytext=(3, 3), textcoords='offset points')
F = lambda x, y: (2.91 + (x - 1533) / 102.5, -1.67 + (y - 1208) / 102.5)   # Fig. 90 at the pins' scale (10.12 mm = 1037 px at 500 dpi)
fb = np.array([F(363, 1067), F(1658, 1067), F(1658, 1340), F(363, 1340), F(363, 1067)]); ax.plot(fb[:, 0], fb[:, 1], 'b-', lw=1, alpha=0.6)
for x, y, l in ((2356, 1400, 'Fig90 stone'), (2828, 1605, 'Fig90 balance'), (2645, 1605, 'Fig90 ts tip')):
    q = F(x, y); ax.plot(*q, 'b^', ms=5, alpha=0.7); ax.annotate(l, q, fontsize=7, color='b', xytext=(3, -10), textcoords='offset points')
ax.text(-11.8, -4.2, 'dark grey: the model as drawn now (shared/escapement.js, movement.js), moved onto the block\'s pins by %+.3f, %+.3f mm' % tuple(off), color='0.3', fontsize=8)
ax.text(-11.8, -4.6, 'red: measured on KLUwI2UUCMQ 11:10-11:33 (bundle adjustment on the pins); magenta: the locking stone; blue: Fig. 90 scaled by the pins', fontsize=8)
ax.set_aspect('equal'); ax.grid(alpha=0.3); ax.set_xlim(-12.5, 17); ax.set_ylim(-4.8, 3.2)
ax.set_xlabel('t (mm, along the detent, from the point of flexure drawn until 20 October 2026)'); ax.set_ylabel('n (mm, across; +n away from the escape wheel)')
ax.set_title('Hamilton Model 21 detent in plan: the model rebuilt (20 October 2026) against the measurements, aligned on the block\'s positioning pins')
plt.tight_layout(); plt.savefig(OUT, dpi=130)
jc = X([M['Jc']])[0]; print('wrote', OUT, '| the stone %.2f past the right pin along t (frames 7.9-8.0); its centre at t %.2f (frames 10.8 +-0.2)' % (jc[0] - pR0[0], jc[0]))
