"""The set-up cover's outline (42029) from cover_ends.py's measured edges: the circles a machinist cut (21 October 2026).

    python cover_fit.py traces/cover_11-52.mm.json [--out traces/cover_11-52.fit.json]

Reads the edges in the movement's frame (cover_ends.py: KLUwI2UUCMQ 11:52, the cover face down, each edge put on its own level) and fits,
robustly (soft L1 at 0.03 mm), the few circles the part is made of; each with the median and mean of its pieces' residuals:

  - the two concave sides: one circle each, through the side's run over the middle and its run along the pad (L_side + L_cutL;
    R_side + U_cutR): on the frame the wall's top edge jogs at the pads' step, the same wall seen at two heights (the parallax of
    the step, cover_ends.py's delta), which read as "straight cuts" at the corners; on the face's plan they are one arc. Fitted
    with their radii free, then with one radius (one cutter), kept when it costs less than ln n (BIC);
  - the two ends: one circle through both (U_end, L_end), and each alone for comparison;
  - the pads' inner edge (the milled middle's boundary): one circle through the upper pad's wall (its top and its foot) and the lower
    pad's step.
Then the corners (the end circle against each side) and the screws' and click's distances from the edges. Writes OUT (JSON).
U_left (the upper pad's side, 2.6 mm) is reported against its side's circle and not fitted: it lies 0.05-0.2 mm inside it.
"""
import sys, json, math
import numpy as np
from scipy.optimize import least_squares

Ba = np.array([-22.144, -5.347]); SC = [np.array([-28.64, 5.72]), np.array([-15.19, -16.58])]; SCK = np.array([-22.56, -15.46])

def circ(X, c0, r0):
    f = lambda p: np.hypot(*(X - p[:2]).T) - p[2]
    a = least_squares(f, [*c0, r0], loss='soft_l1', f_scale=0.03, x_scale='jac'); e = f(a.x)
    J = a.jac; s2 = np.median(np.abs(e))**2*1.4826**2; Cv = np.linalg.pinv(J.T @ J)*s2
    return a.x, e, np.sqrt(np.clip(np.diag(Cv), 0, None))

def stats(e, parts):
    k = 0; out = {}
    for n, m in parts: out[n] = dict(n=m, median=round(float(np.median(np.abs(e[k:k+m]))), 4), mean=round(float(e[k:k+m].mean()), 4)); k += m
    return out

def ccx(c1, r1, c2, r2):
    d = np.hypot(*(c2 - c1)); a = (r1**2 - r2**2 + d**2)/(2*d); h = math.sqrt(max(r1**2 - a**2, 0)); u = (c2 - c1)/d; m = c1 + a*u; v = np.array([-u[1], u[0]])
    return m + h*v, m - h*v

def main(a):
    src = a[0]; out = a[a.index('--out') + 1] if '--out' in a else src.replace('.mm.json', '.fit.json')
    d = {k: np.array(v) for k, v in json.load(open(src, encoding='utf-8')).items()}; R = {}
    def fit(name, pieces, c0, r0):
        X = np.concatenate([d[p] for p in pieces]); q, e, sd = circ(X, c0, r0)
        R[name] = dict(centre=q[:2].round(4).tolist(), r=round(float(q[2]), 4), sd=sd.round(4).tolist(), from_arbor=round(float(np.hypot(*(q[:2] - Ba))), 3),
                       pieces=stats(e, [(p, len(d[p])) for p in pieces]))
        return q
    L = fit('side_L', ['L_side', 'L_cutL'], (2.4, 9.6), 23.0); Rr = fit('side_R', ['R_side', 'U_cutR'], (-46.6, -20.8), 23.0)
    # one radius for both sides (one cutter): kept if it costs less than ln n
    XL = np.concatenate([d['L_side'], d['L_cutL']]); XR = np.concatenate([d['R_side'], d['U_cutR']])
    f2 = lambda p: np.r_[np.hypot(*(XL - p[0:2]).T) - p[4], np.hypot(*(XR - p[2:4]).T) - p[4]]
    b = least_squares(f2, [*L[:2], *Rr[:2], 0.5*(L[2] + Rr[2])], loss='soft_l1', f_scale=0.03); e2 = f2(b.x)
    e1 = np.r_[np.hypot(*(XL - L[:2]).T) - L[2], np.hypot(*(XR - Rr[:2]).T) - Rr[2]]; s = 1.4826*np.median(np.abs(e1)); n = len(e1)
    dchi = float(np.sum(np.minimum((e2/s)**2, 9)) - np.sum(np.minimum((e1/s)**2, 9)))
    R['sides_one_radius'] = dict(r=round(float(b.x[4]), 4), centre_L=b.x[0:2].round(4).tolist(), centre_R=b.x[2:4].round(4).tolist(), dchi2=round(dchi, 1), ln_n=round(math.log(n), 1),
                                 kept=bool(dchi < math.log(n)), pieces=stats(e2, [('L', len(XL)), ('R', len(XR))]))
    E = fit('ends', ['U_end', 'L_end'], (-22.4, -5.8), 14.5); fit('end_U_alone', ['U_end'], (-22.4, -5.8), 14.5); fit('end_L_alone', ['L_end'], (-22.4, -5.8), 13.0)
    P = fit('pads_inner', [k for k in ('padU_top', 'padU_foot', 'L_step') if k in d], (-22.4, -5.8), 11.4)
    if 'U_left' in d: R['U_left_vs_side_L'] = dict(median=round(float(np.median(np.hypot(*(d['U_left'] - L[:2]).T) - L[2])), 4), note='+ outside the side circle (in the plate), - inside')
    cL, cR, rS = (b.x[0:2], b.x[2:4], b.x[4]) if R['sides_one_radius']['kept'] else (L[:2], Rr[:2], None)
    rL, rR = (rS, rS) if rS is not None else (L[2], Rr[2])
    corners = {}
    for sn, c, r in (('L', cL, rL), ('R', cR, rR)):
        for p in ccx(E[:2], E[2], c, r): corners[f'{sn}_{"U" if (p - Ba) @ (SC[0] - SC[1]) > 0 else "L"}'] = p.round(4).tolist()
    R['corners'] = corners
    dist = lambda p: dict(to_end=round(float(E[2] - np.hypot(*(p - E[:2]))), 3), to_side_L=round(float(np.hypot(*(p - cL)) - rL), 3), to_side_R=round(float(np.hypot(*(p - cR)) - rR), 3),
                          to_pads_inner=round(float(np.hypot(*(p - P[:2])) - P[2]), 3))
    R['features'] = {'s0 (S.cover[0])': dist(SC[0]), 's1 (S.cover[1])': dist(SC[1]), 'click (S.click)': dist(SCK)}
    R['source'] = src
    json.dump(R, open(out, 'w', encoding='utf-8', newline='\n'), indent=1); print(json.dumps(R, indent=1)); print('->', out)

if __name__ == '__main__': main(sys.argv[1:])
