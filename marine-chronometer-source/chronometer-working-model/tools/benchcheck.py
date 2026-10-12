"""The bench tests judged: a maker's measurements of the made parts (a JSON file, filled in as they are taken) against the figures the model gives them
(tools/bench.json's criteria, bench.js: the build book's last chapter), each pass or fail, and where it fails, what to do: set-up turns, the timing weights,
the stud's pinning point, which of the manual's operations moves an escapement figure. No browser; plain Python.

  python benchcheck.py MEAS.json             every measurement in the file judged; exit 1 if one fails (a field left null is skipped)
  python benchcheck.py --template OUT.json   a blank file to fill in, every field named with its unit
  python benchcheck.py --demo                a made-up set (a spring a little weak, the fusee set up too little, a mesh bored close, the balance fast,
                                             the lock shallow) judged, and a check that each fault is found: exit 1 if one is missed

How each is judged (the figures and their sources: bench.js, and the build book):
  mainspring   thickness in its material's band (Nivaflex 45/5, the build's, or carbon steel, the Model 21's); the torque fully wound (the highest
               reading going up) in the band; its fall a turn (a straight line through the readings going up) against the model's; the friction, up
               against down (the model allows 5-15 % for the coils' friction and set: physics.js); a week later, still in the band. Too weak: the set-up
               turns that bring it into the band at the slope measured.
  fusee        every reading within the band of their mean (-5 to +11 %: the swing's band through ampAt). Not even: its slope along the wind says which
               way the set-up is off. Each turn of set-up adds the same moment at both ends, so it changes the ratio of fully wound to run down, which
               the fusee's profile (7.51 to 14.72 mm, 1.96:1) is cut for: rising toward run down, too much set-up; falling, too little; the change
               that brings the ends to the profile's ratio, in turns at the spring's slope.
  depths       each pair's centres, on the plate and on the bridge, against the drawn (solve.py): inside the window less the pivots' shake (gearing.js),
               and inside the CNC's aim of twice the hole tolerance (a warning beyond it).
  endshake     each arbor in the band at 20 °C (Ops. 15, 69, 74, less what 40 and 100 °F take: thermal.js).
  balance      oscillations counted over a time: its rate, s a day. Within one turn of the timing weights (40 s a day, Sec. IX): the weights; beyond, the
               spring's length at the stud (the rate goes as L^-1/2: 2 L × rate / 86400 mm, 409 mm long).
  escapement   each figure in the manual's band (Ops. 84-97; where it says "about", a band either side estimated: bench.js), with the operation that sets it.
  swing        fully wound and run down, 247.5-270° (Sec. II, IX); low at both ends, at one, or high: what each points to.
"""
import json, math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); B = json.load(open(os.path.join(HERE, 'bench.json'), encoding='utf-8'))['criteria']
R_UP, R_DN = 7.51, 14.72   # the fusee's lever fully wound and run down (physics.js: makeFusee's pitch line), mm

TEMPLATE = {'_how': 'Fill in what you measure, leave null what you have not. Torques in N·m, lengths in mm, angles in degrees. python benchcheck.py THIS.json',
  'mainspring': {'material': 'nivaflex (the build) or steel (the Model 21)', 'thickness_mm': None, 'width_mm': None, 'length_mm': None,
                 'winding': {'_': '[turns of the arbor up from let down (the set-up), torque N·m]: each half turn going up', 'up': [], 'down': []},
                 'after_week_fully_wound_Nm': None},
  'fusee': {'_': 'the torque at the fusee wheel arbor each half turn of the fusee, from fully wound (the chain on its top turn) to run down, N·m', 'torque_Nm': []},
  'depths_mm': {n: {'plate': None, 'bridge': None} for n in B['depths']['names']},
  'endshake_mm': {k: None for k in ('fusee', 'centre', 'third', 'fourth', 'escape', 'balance')},
  'balance': {'_': 'oscillations (each a there and back) counted over seconds, the spring pinned in, free in a vibrating tool or the cock', 'oscillations': None, 'seconds': None},
  'escapement': {'lock_deg': None, 'letoff_deg': None, 'overall_deg': None, 'drop_deg': None, 'horn_clearance_mm': None, 'roller_shake_mm': None},
  'swing_deg': {'fully_wound': None, 'run_down': None}}

def check(M):
    out = []; bad = []
    def res(ok, what, s, todo=''):
        out.append(f"  {'ok ' if ok == True else '~~ ' if ok == 'warn' else '!! '} {what}: {s}" + (f'\n       → {todo}' if todo and ok != True else ''))
        if ok == False: bad.append(what)
    ms = M.get('mainspring') or {}
    if ms:
        mat = 'steel' if str(ms.get('material', '')).lower().startswith('steel') else 'nivaflex'; tb = B['mainspring']['thickness'][mat]
        t = ms.get('thickness_mm')
        if t is not None: res(tb[0] <= t <= tb[1], 'mainspring thickness', f'{t:.3f} mm, the band for {mat} {tb[0]:.3f}-{tb[1]:.3f}', 'a thinner strip pulls less as the cube of its thickness: another strip, or a set-up that brings the torque into its band (below)')
        up = [p for p in (ms.get('winding') or {}).get('up', []) if p and p[1] is not None]; dn = [p for p in (ms.get('winding') or {}).get('down', []) if p and p[1] is not None]
        if len(up) >= 2:
            n = len(up); sx = sum(p[0] for p in up); sy = sum(p[1] for p in up); sxx = sum(p[0] ** 2 for p in up); sxy = sum(p[0] * p[1] for p in up)
            k = (n * sxy - sx * sy) / (n * sxx - sx * sx); full = max(p[1] for p in up); lo, hi = B['mainspring']['full']
            res(abs(k / B['mainspring']['perTurn'] - 1) < 0.15, 'mainspring stiffness', f"{k * 1000:.0f} mN·m a turn against the model's {B['mainspring']['perTurn'] * 1000:.0f}", 'a strip of another thickness, width or length than drawn: the fusee is cut for the drawn spring\'s 1.96:1 over its 4.51 turns; measure the strip')
            todo = f'set it up {(lo + 0.5 * (hi - lo) - full) / k:+.1f} turns at the slope measured ({k * 1000:.0f} mN·m a turn), then the fusee test' if k > 0 else ''
            res(lo <= full <= hi, 'mainspring fully wound', f'{full:.3f} N·m, the band {lo:.2f}-{hi:.2f} (the model {B["mainspring"]["model"]:.2f})', todo)
            if dn:
                fr = [(u[1] - d[1]) / (0.5 * (u[1] + d[1])) for u in up for d in dn if abs(u[0] - d[0]) < 1e-6]
                if fr: f_ = sum(fr) / len(fr); res(f_ <= 0.15 or 'warn', 'mainspring friction', f'up against down {f_ * 100:.0f} % (the model allows 5-15 %)', 'more than that: the coils dry or rough; clean and grease (Hamilton T-324), or the barrel\'s wall rubs')
            wk = ms.get('after_week_fully_wound_Nm')
            if wk is not None: res(lo <= wk <= hi, 'mainspring after a week', f'{wk:.3f} N·m fully wound ({(wk / full - 1) * 100:+.1f} % on the first reading)', 'it has set: replace it, or set it up a tooth (Op. 13) and test again' if wk < 0.98 * full else 'below its band from the start: the set-up above')
    fu = [x for x in (M.get('fusee') or {}).get('torque_Nm', []) if x is not None]
    if len(fu) >= 3:
        m = sum(fu) / len(fu); lo, hi = B['fusee']['band']; dev = [x / m - 1 for x in fu]; ok = all(lo <= d <= hi for d in dev)
        a, b = fu[0], fu[-1]; Mup = a * 18.79 / R_UP; Mdn = b * 18.79 / R_DN; Rr = R_DN / R_UP; x = (Mup - Rr * Mdn) / (Rr - 1)   # the set-up moment that brings the ends to the profile's ratio
        k = B['mainspring']['perTurn']; trend = 'rises toward run down' if b > a else 'falls toward run down'
        res(ok, 'fusee evenness', f'{m * 1000:.0f} mN·m mean, readings {min(dev) * 100:+.1f} to {max(dev) * 100:+.1f} % of it (the band {lo * 100:+.0f} to {hi * 100:+.0f} %); it {trend}',
            f'set-up {x / k:+.1f} turns ({x * 1000:+.0f} mN·m at the barrel): {"less" if x < 0 else "more"} set-up evens it; if that takes the torque out of its band, the spring\'s stiffness and the fusee\'s profile don\'t match (the mainspring test)')
    dp = M.get('depths_mm') or {}
    for i, n in enumerate(B['depths']['names']):
        for side in ('plate', 'bridge'):
            v = (dp.get(n) or {}).get(side)
            if v is None: continue
            e = v - B['depths']['centres'][i]; w = B['depths']['windows'][i]; sh = B['depths']['shake']; aim = 2 * B['depths']['tol']
            ok = w[0] + sh <= e <= w[1]; res(ok if (not ok or abs(e) <= aim + 1e-9) else 'warn', f'depth {n} ({side})', f'{v:.4f} mm, {e * 1000:+.1f} µm on the drawn {B["depths"]["centres"][i]:.3f} (the window {w[0] * 1000:+.0f} to {w[1] * 1000:+.0f} µm, its close side less the shake {(w[0] + sh) * 1000:+.0f}; the aim ±{aim * 1000:.0f})',
                'too close: the wheel\'s tips reach the pinion\'s root: re-bush the hole (a bush bored on the drawn centre) or open the depth with a depthing tool' if e < w[0] + sh else 'wide: it runs, with more ripple; inside the window it needs nothing')
    for k_, v in (M.get('endshake_mm') or {}).items():
        if v is None: continue
        lo, hi = B['endshake']; res(lo <= v <= hi, f'endshake {k_}', f'{v * 1000:.0f} µm, the band {lo * 1000:.0f}-{hi * 1000:.0f} at 20 °C', ('too little: it may bind at 40 °F (the brass shrinks more than the steel)' if v < lo else 'too much: the pivots rock in their holes') + ': move the jewel or bush endwise (Ops. 15, 69, 74)')
    bl = M.get('balance') or {}
    if bl.get('oscillations') and bl.get('seconds'):
        f = bl['oscillations'] / bl['seconds']; rate = (f / B['balance']['hz'] - 1) * 86400; w = B['balance']['weightsTurn']
        todo = f'{abs(rate) / w:.1f} turns of the timing weights {"out" if rate > 0 else "in"}' if abs(rate) <= 3 * w else f'take the spring {"longer" if rate > 0 else "shorter"} at the stud by {abs(2 * 409.3 * rate / 86400):.2f} mm, then the weights'
        res(abs(rate) <= w, 'balance vibrated', f'{f:.4f} oscillations a second: {rate:+.0f} s a day {"fast" if rate > 0 else "slow"} (one turn of the weights is {w} s a day)', todo)
    es = M.get('escapement') or {}; E = B['escapement']
    ops = {'lock_deg': ('lock', 'the lock-adjusting screw (Op. 85)'), 'letoff_deg': ('letoff', 'the trip spring\'s tip, bent (Op. 86)'), 'overall_deg': ('overall', 'the trip spring\'s tip and the detent\'s place (Op. 87)'),
           'drop_deg': ('drop', 'the detent-adjusting screw (Op. 97)'), 'horn_clearance_mm': ('horn', 'the horn, set to the unlocking jewel (Op. 88)'), 'roller_shake_mm': ('shake', 'the roller\'s fit on the staff (Op. 84)')}
    for key, (c, op) in ops.items():
        v = es.get(key)
        if v is None: continue
        lo, hi = E[c]; ok = (lo is None or v >= lo) and (hi is None or v <= hi)
        res(ok, f'escapement {c}', f'{v:g} (the manual\'s {"at least " + str(lo) if hi is None else f"{lo}-{hi}"}; the model {E["model"][c]:g})', op)
    sw = M.get('swing_deg') or {}; a, b = sw.get('fully_wound'), sw.get('run_down'); lo, hi = B['swing']
    for n_, v in (('fully wound', a), ('run down', b)):
        if v is not None: res(lo <= v <= hi, f'swing {n_}', f'{v:.0f}° (the manual {lo}-{hi})')
    if a is not None and b is not None and not (lo <= a <= hi and lo <= b <= hi):
        why = ('both low: the train\'s freedom (the depths, endshake, oil) or the escapement\'s figures' if a < lo and b < lo else 'both high: the spring too strong for its band, or too much set-up' if a > hi and b > hi
               else 'one end only: the fusee and the spring don\'t match (the fusee test says which way to move the set-up)')
        out.append(f'       → {why}')
    return out, bad

def demo():
    """a made-up set with known faults; each must be found"""
    up = [[0.5 * i, 0.31 + 0.080 * 0.5 * i] for i in range(10)]; dn = [[p[0], p[1] * 0.92] for p in up]
    M = {'mainspring': {'material': 'nivaflex', 'thickness_mm': 0.384, 'winding': {'up': up, 'down': dn}, 'after_week_fully_wound_Nm': 0.64},
         'fusee': {'torque_Nm': [0.285 + 0.004 * i for i in range(18)]},
         'depths_mm': {'fusee-centre': {'plate': 20.384, 'bridge': 20.390}, 'third-fourth': {'plate': 11.250, 'bridge': 11.300}},
         'endshake_mm': {'centre': 0.04, 'third': 0.02},
         'balance': {'oscillations': 241, 'seconds': 120},
         'escapement': {'lock_deg': 4.2, 'letoff_deg': 8, 'overall_deg': 27.5, 'drop_deg': 2.1},
         'swing_deg': {'fully_wound': 252, 'run_down': 238}}
    out, bad = check(M); print('a made-up set of measurements:'); print('\n'.join(out))
    want = {'mainspring fully wound', 'mainspring after a week', 'fusee evenness', 'depth third-fourth (plate)', 'endshake third', 'balance vibrated', 'escapement lock', 'swing run down'}
    miss = want - set(bad); extra = set(bad) - want
    print(('  ok ' if not miss and not extra else '  !! ') + f'the made-up faults found: {len(want) - len(miss)} of {len(want)}' + (f'; missed {sorted(miss)}' if miss else '') + (f'; flagged besides {sorted(extra)}' if extra else ''))
    return not miss and not extra

def main():
    sys.stdout.reconfigure(encoding='utf-8'); a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == '--demo': sys.exit(0 if demo() else 1)
    if a[0] == '--template':
        out = a[1] if len(a) > 1 else 'bench-measurements.json'; json.dump(TEMPLATE, open(out, 'w', encoding='utf-8'), indent=1, ensure_ascii=False); print('wrote', out); return
    out, bad = check(json.load(open(a[0], encoding='utf-8'))); print('\n'.join(out) or '  nothing measured yet'); print(f'  {len(bad)} failed' if bad else '  all measured pass' if out else ''); sys.exit(1 if bad else 0)

if __name__ == '__main__': main()
