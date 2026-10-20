"""The chain plate's outline between its lobes: the strand's width across its axis, from one rivet's lobe to the next, on a frame of the chain
lying flat (KLUwI2UUCMQ 23:30, 4K). Lobe centres from chain_size's L2330.json; for consecutive lobes a pitch apart, at t = 0..1 (0.05) along
the line between them the two side edges are refined with mfgfit's erf edges along the normal; the width over the lobes' mean diameter.
python neck.py LOBES.json OUT"""
import sys, json, math, numpy as np, cv2
sys.path.insert(0, r'E:\Marine-Chronometer\.claude\worktrees\hamilton-barrel\marine-chronometer-source\chronometer-working-model\tools')
import mfgfit as M
d = json.load(open(sys.argv[1])); out = sys.argv[2]
x0, y0, x1, y1 = d['box']; FULL = cv2.imread(d['frame']); img = FULL[y0:y1, x0:x1].copy(); L = d['lobes']
C = np.array([l['c'] for l in L]) - [x0, y0]; R = np.array([l['r'] for l in L])
pairs = []
for i in range(len(C)):
    dd = np.hypot(*(C - C[i]).T); dd[i] = 1e9; j = int(np.argmin(dd))
    for j in np.argsort(dd)[:2]:
        if i < j and 1.8*np.mean(R) < dd[j] < 2.8*np.mean(R): pairs.append((i, int(j)))
pairs = sorted(set(pairs)); T = np.round(np.arange(0, 1.0001, 0.05), 3); rows = []
for i, j in pairs:
    a, b = C[i], C[j]; e = (b - a)/np.hypot(*(b - a)); n = np.array([-e[1], e[0]]); r0 = (R[i] + R[j])/2
    w = []
    for t in T:
        m = a + t*(b - a); Q = np.array([m + r0*n, m - r0*n]); Nn = np.array([n, -n])
        P, sd, c, blur, keep, pol = M.refine_points(img, Q, Nn, win=7, ch='luma')
        if len(P) < 2 or not np.all(keep): w.append(np.nan); continue
        w.append(float(np.hypot(*(P[0] - P[1]))))
    w = np.array(w)
    if np.isnan(w).sum() > 2: continue
    rows.append(dict(i=i, j=j, pitch=float(np.hypot(*(b - a))), D=float(2*r0), w=w.tolist()))
W = np.array([r['w'] for r in rows]); Dm = np.array([r['D'] for r in rows])[:, None]; Rt = W/Dm
med = np.nanmedian(Rt, 0); q1, q3 = np.nanpercentile(Rt, [25, 75], 0)
print(f'{len(rows)} plates (lobe pairs) of {len(pairs)}; width / lobe diameter along the plate, t from one rivet to the next:')
for t, m, l, h in zip(T, med, q1, q3): print(f'  t {t:.2f}  {m:.3f}  (quartiles {l:.3f}-{h:.3f})')
neck = np.nanmin(Rt[:, 8:13], 1); print(f'neck (least width, t 0.4-0.6) / D: median {np.nanmedian(neck):.3f}, quartiles {np.nanpercentile(neck,25):.3f}-{np.nanpercentile(neck,75):.3f}, n {np.sum(~np.isnan(neck))}')
print(f'pitch / D: median {np.median([r["pitch"]/r["D"] for r in rows]):.3f}')
json.dump(dict(frame=d['frame'], t=T.tolist(), med=med.tolist(), q1=q1.tolist(), q3=q3.tolist(), plates=rows), open(out + '.json', 'w'))
# overlay
V = img.copy(); V = cv2.resize(V, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
for r in rows:
    a, b = C[r['i']], C[r['j']]; e = (b - a)/np.hypot(*(b - a)); n = np.array([-e[1], e[0]])
    for t, wv in zip(T, r['w']):
        if np.isnan(wv): continue
        m = a + t*(b - a)
        for s in (1, -1):
            p = (m + s*wv/2*n)*2; cv2.circle(V, (int(p[0]), int(p[1])), 1, (0, 0, 255), -1)
cv2.imwrite(out + '.png', V)
