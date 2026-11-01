"""The Hamilton's plate-scale factor f fitted over the classified evidence (PLAN-hamilton-drawings.md, Phase 0; RESCALE-CLASSIFICATION.md), and the escape arbor
re-solved on it (the owner's decision 2: 9.40 from the balance, 11.90 from the fourth). No browser, under a second: python rescale_fit.py

Each piece of evidence is a ratio, true size over the model's plate-scaled size, with a 1-sigma uncertainty stated beside it; f is their weighted mean (the
least-squares fit of one scalar), with its uncertainty, chi-squared and each item's pull, and each item left out in turn. The model's places are read from
movement.js (L, BR_R, MR_RO, PP_R), so the script is valid only on the unscaled model (it says so if PP_R is no longer 87.57/2). Exits 1 if f falls outside
1.11-1.13, the owner's band (31 October 2026)."""
import math, pathlib, re, sys

SRC = (pathlib.Path(__file__).resolve().parent.parent / 'js' / 'movement.js').read_text(encoding='utf-8')
L = eval(re.search(r'^const L=(\{.*?\});', SRC, re.M).group(1).replace('C:', '"C":').replace('T:', '"T":').replace('F:', '"F":').replace('E:', '"E":')
         .replace('B:', '"B":').replace('Fu:', '"Fu":').replace('Ba:', '"Ba":').replace('Ud:', '"Ud":').replace('Mw:', '"Mw":'))
num = lambda pat: float(eval(re.search(pat, SRC).group(1)))
PP_D, BR_R, MR_D = 2 * num(r'const PP_R=([\d./]+)'), num(r'BR_R=([\d.]+)'), 2 * num(r'const MR_RO=([\d./]+)')
if abs(PP_D - 87.57) > 1e-6:
    print(f'movement.js has the plate at {PP_D:.2f}, not 87.57: this fit reads the unscaled model'); sys.exit(1)
fu, tf = math.hypot(*L['Fu']), math.dist(L['T'], L['F'])
# (what, true size, its source, model size, the model's uncertainty in mm or a relative sigma)
EV = [('pillar plate across', 97.8, 'British Museum, Randall and Good 1990 cat. 117A, "front plate"', PP_D, 0.3),   # the catalogue's 0.1 mm, taken as +-0.3 for where it was measured
      ('fusee arbor to centre', (90 + 14) * 0.44 / 2, 'drawing 42015: 90 teeth at module 0.44, the centre pinion 14', fu, 0.3),   # |L.Fu|: 20.2-20.8 on 34:30, 36:15
      ('third to fourth', (80 + 10) * 0.28 / 2, 'drawings 42072/42073: 80 : 10 at module 0.28', tf, 0.35),   # each arbor +-0.25 on the bare plate's frames
      ('train bridge rim across', 87.7, 'British Museum, "back plate"', 2 * BR_R, 1.2),   # BR_R 38.8 +-0.6 (23:30)
      ('mounting ring flange across', 106.6, 'British Museum, the dial ring\'s flange', MR_D, 0.0100 * MR_D / 1.1116)]   # the side photograph, 18.93 px/mm, +-1 %
rows = [(w, t / m, t / m * s / m, src) for w, t, src, m, s in EV]
fit = lambda rs: (sum(r / s ** 2 for _, r, s, _ in rs) / sum(1 / s ** 2 for _, r, s, _ in rs), 1 / math.sqrt(sum(1 / s ** 2 for _, r, s, _ in rs)))
f, sf = fit(rows)
print('evidence (true / model, 1 sigma, pull):')
for w, r, s, src in rows: print(f'  {w:28s} {r:.4f} +-{s:.4f}  {(r - f) / s:+.2f}   {src}')
chi = sum(((r - f) / s) ** 2 for _, r, s, _ in rows)
print(f'f = {f:.4f} +-{sf:.4f}, chi2 {chi:.2f} on {len(rows) - 1}; the plain mean {sum(r for _, r, _, _ in rows) / len(rows):.4f}')
for i, (w, *_ ) in enumerate(rows): print(f'  without {w:28s} {fit(rows[:i] + rows[i + 1:])[0]:.4f}')
F3 = round(f, 3)
print(f'adopted f = {F3:.3f}')
# the escape arbor: 9.40 from the balance (the 0.249 in roller, Op. 84), 11.90 from the fourth (75 : 10 at module 0.28), the root nearer the measured direction
B, Fo, E0 = [v * F3 for v in L['B']], [v * F3 for v in L['F']], L['E']
d = math.dist(B, Fo); a = (9.40 ** 2 - 11.90 ** 2 + d * d) / (2 * d); h = math.sqrt(9.40 ** 2 - a * a); ux, uz = (Fo[0] - B[0]) / d, (Fo[1] - B[1]) / d
cands = [(B[0] + a * ux - s * h * uz, B[1] + a * uz + s * h * ux) for s in (1, -1)]
Ef = [v * F3 for v in E0]; E = min(cands, key=lambda e: math.dist(e, Ef))
ang = lambda p: math.degrees(math.atan2(p[1] - B[1], p[0] - B[0]))
print(f"E' = ({E[0]:.3f}, {E[1]:.3f}): {math.dist(B, E):.3f} from B' ({B[0]:.3f}, {B[1]:.3f}), {math.dist(Fo, E):.3f} from F' ({Fo[0]:.3f}, {Fo[1]:.3f}); "
      f"{ang(E):.2f} deg about B' against the frames' {math.degrees(math.atan2(E0[1] - L['B'][1], E0[0] - L['B'][0])):.2f}; {math.dist(E, Ef):.3f} from E x f")
sys.exit(0 if 1.11 <= F3 <= 1.13 else 1)
