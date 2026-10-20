"""Leave-one-out over a frame's matched holes (mfgfit.py match's .matched.mm.json): each named hole left out in turn, the map refitted
on the rest (a similarity, an affine and a homography, least squares on the hole centres), and where the left-out hole lands against
the model's place for it. A hole the model has out lands off by the same amount under every map; one the map extrapolates to scatters
between them. Pairs of holes (--pair a,b) give their distance with both left out of nothing (the frame's own ruler is the other holes).

  python holeloo.py MATCHED.mm.json HOLES.json [--only h2,h10] [--pair h2,h10]"""
import json, sys, numpy as np
a = sys.argv[1:]
def opt(k):
    if k in a: i = a.index(k); v = a[i + 1]; del a[i:i + 2]; return v
only, pair = opt('--only'), opt('--pair')
if len(a) < 2: sys.exit(__doc__)
d = json.load(open(a[0])); Hj = json.load(open(a[1]))['holes']; tr = d['planes']['Face']['traces']
P = {k: np.array(t['points_px'][0], float) for k, t in tr.items() if k in Hj and t.get('kind') == 'point'}
def fit(kind, src, dst):   # model mm -> px
    n = len(src)
    if kind == 'sim':
        A = []; b = []
        for (x, y), (u, v) in zip(src, dst): A += [[x, -y, 1, 0], [y, x, 0, 1]]; b += [u, v]
        p = np.linalg.lstsq(np.array(A), np.array(b), rcond=None)[0]; return np.array([[p[0], -p[1], p[2]], [p[1], p[0], p[3]], [0, 0, 1]])
    if kind == 'aff':
        X = np.c_[src, np.ones(n)]; M = np.linalg.lstsq(X, dst, rcond=None)[0].T; return np.vstack([M, [0, 0, 1]])
    A = []
    for (x, y), (u, v) in zip(src, dst): A += [[x, y, 1, 0, 0, 0, -u*x, -u*y, -u], [0, 0, 0, x, y, 1, -v*x, -v*y, -v]]
    return np.linalg.svd(np.array(A))[2][-1].reshape(3, 3)
def inv(H, p): q = np.linalg.inv(H) @ [p[0], p[1], 1]; return q[:2]/q[2]
ks = sorted(P); print(f'{a[0].split(chr(92))[-1]}: {len(ks)} matched holes: {" ".join(ks)}')
print(f'{"hole":5s} {"model":>16s} | {"sim dx,dz":>15s} {"aff dx,dz":>15s} {"hom dx,dz":>15s}')
for k in ks:
    if only and k not in only.split(','): continue
    rest = [q for q in ks if q != k]; src = np.array([Hj[q][:2] for q in rest]); dst = np.array([P[q] for q in rest]); row = []
    for kind, mn in (('sim', 2), ('aff', 3), ('hom', 4)):
        if len(rest) < mn + 1: row.append('    -    '); continue
        p = inv(fit(kind, src, dst), P[k]) - Hj[k][:2]; row.append(f'{p[0]:+6.2f},{p[1]:+6.2f}')
    print(f'{k:5s} {Hj[k][0]:7.2f},{Hj[k][1]:7.2f} | {row[0]:>15s} {row[1]:>15s} {row[2]:>15s}')
if pair:
    i, j = pair.split(','); rest = [q for q in ks if q not in (i, j)]; src = np.array([Hj[q][:2] for q in rest]); dst = np.array([P[q] for q in rest])
    for kind in ('sim', 'aff', 'hom'):
        H = fit(kind, src, dst); pi, pj = inv(H, P[i]), inv(H, P[j]); print(f'{kind}: {i}-{j} {np.hypot(*(pi - pj)):.2f} mm (model {np.hypot(*(np.array(Hj[i][:2]) - Hj[j][:2])):.2f}), {i} at ({pi[0]:.2f}, {pi[1]:.2f}), {j} at ({pj[0]:.2f}, {pj[1]:.2f})')
