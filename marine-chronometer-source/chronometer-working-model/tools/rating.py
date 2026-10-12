"""The rating of a chronometer you made: its log of daily comparisons with a time signal worked as the Navy's test works them (Sec. IX; the working
model's thirty-day test card, app.js testCalc), and what a navigator carrying its rate would be out after a voyage. No browser; numpy.

  python rating.py LOG.csv            the daily rates, the Navy test's figures if the log has its six periods, the rate against temperature, and the error carried
  python rating.py --demo             a log made up with known properties (the error budget's chronometer like No. 3390, errorbudget.js), worked and checked: exit 1
                                      if the figures it finds are not the ones it was made with (a few seconds)
  python rating.py --template OUT.csv a blank log to fill in

The log: one row a comparison, a header naming its columns:
  when      the date and time of the comparison (ISO, 2026-11-02 12:00; the same hour each day is best, but any times do)
  error     the chronometer's reading less the true time, seconds (+ fast, - slow), read off a time signal to a tenth (radio pips, GPS, a phone's network time)
  temp      the temperature beside it, °F (or temp_c, °C) [optional]
  period    the Navy test's period, I to VI, at 90, 72½, 55, 55, 72½ and 90 °F, five days each [optional: without it the figures need the temperatures]
  wound     y on the days it was wound before the comparison [optional]

Daily rate: the change of error over the days between two comparisons (s a day; + gaining). The Navy test's figures, as the card works them: each period's mean
rate (its error's change over its five days, a fifth), the mean deviation of its daily rates from it, and the largest difference between two of them;
regulation the largest mean rate, rating the deviations' mean, the temperature figures the mean rates at a temperature (two periods each) apart, recovery
the most two periods at the same temperature part. Isochronism (12 hours against 24 after winding) needs two comparisons a day and is left to the card.

The error carried, two ways. Backtest (needs 20 days or more): for every day k with ten days before it, the rate of those ten carried on, and the error found
after 5, 10, 20 and 30 days of what actually followed: the median and the worst, from the log alone. Projection: the daily rates fitted as a constant, a
linear drift and the temperature's linear and squared terms, the rest as day-to-day scatter; the error a navigator carrying the ten-day rate is out after
N days, drift N² / 2 plus the scatter's random walk, its spread from 2000 voyages at the log's own temperatures repeated. 4 s of time is a mile of longitude
on the equator.
"""
import csv, datetime as dt, math, os, sys
import numpy as np

LIM = {'reg': 1.55, 'dev': 0.50, 'dif': 0.75, 't1': 0.75, 't2': 0.75, 't3': 1.20, 'rec': 0.70}   # the Bureau of Ships' limits (Sec. IX; app.js testCalc)
NAME = {'reg': 'Regulation, the largest mean daily rate of a period', 'dev': 'Rating, the mean deviation of the daily rates', 'dif': 'The largest difference between two daily rates in a period',
        't1': 'Temperature, 90 against 72½ °F', 't2': 'Temperature, 72½ against 55 °F', 't3': 'Temperature, 90 against 55 °F', 'rec': 'Recovery, periods at the same temperature apart'}
PERIODS = [('I', 90), ('II', 72.5), ('III', 55), ('IV', 55), ('V', 72.5), ('VI', 90)]

def read(path):
    rows = list(csv.DictReader(open(path, encoding='utf-8-sig')))
    if not rows: sys.exit(f'{path}: no rows')
    k = {c.strip().lower(): c for c in rows[0]}
    if 'when' not in k or 'error' not in k: sys.exit(f'{path}: the header must name when and error (and may name temp or temp_c, period, wound)')
    t, e, T, P = [], [], [], []
    for r in rows:
        if not r[k['when']].strip(): continue
        t.append(dt.datetime.fromisoformat(r[k['when']].strip())); e.append(float(r[k['error']]))
        if 'temp' in k and r[k['temp']].strip(): T.append(float(r[k['temp']]))
        elif 'temp_c' in k and r[k['temp_c']].strip(): T.append(float(r[k['temp_c']]) * 1.8 + 32)
        else: T.append(math.nan)
        P.append(r[k['period']].strip() if 'period' in k else '')
    o = np.argsort(t); t0 = t[o[0]]
    days = np.array([(t[i] - t0).total_seconds() / 86400 for i in o]); return days, np.array(e)[o], np.array(T)[o], [P[i] for i in o]

def rates(d, e, T):
    """each interval's rate, its mid-time and its mean temperature"""
    dd = np.diff(d); r = np.diff(e) / dd; tm = (d[1:] + d[:-1]) / 2; Tm = (T[1:] + T[:-1]) / 2; return r, tm, Tm, dd

def navy(d, e, T, P):
    """the six periods, by their labels or by the temperatures in order; None if the log hasn't them"""
    idx = []
    if any(P):
        for n, _ in PERIODS:
            i = [j for j, p in enumerate(P) if p.upper() == n]
            if len(i) < 2: return None
            idx.append(i)
    else:   # unlabelled: the first thirty days in five-day periods, each kept near its temperature (within 5 °F)
        if np.isnan(T).any() or d[-1] - d[0] < 29.5: return None
        for k, (n, Tn) in enumerate(PERIODS):
            i = [j for j in range(len(d)) if 5 * k < d[j] - d[0] <= 5 * k + 5 + 1e-9]
            if len(i) < 2 or abs(np.mean(T[i]) - Tn) > 5: return None
            idx.append(i)
    out = []
    for (n, Tn), i in zip(PERIODS, idx):
        i0 = i[0] - 1 if i[0] > 0 else i[0]   # a period's first rate runs from the last comparison before it
        rr = np.diff(e[i0:i[-1] + 1]) / np.diff(d[i0:i[-1] + 1]); m = (e[i[-1]] - e[i0]) / (d[i[-1]] - d[i0])
        out.append(dict(n=n, T=Tn, rs=rr, m=m, dev=np.mean(np.abs(rr - m)), dif=rr.max() - rr.min()))
    M = lambda a, b: (out[a]['m'] + out[b]['m']) / 2; m90, m72, m55 = M(0, 5), M(1, 4), M(2, 3)
    return out, {'reg': max(abs(p['m']) for p in out), 'dev': np.mean([p['dev'] for p in out]), 'dif': max(p['dif'] for p in out), 't1': abs(m90 - m72), 't2': abs(m72 - m55),
                 't3': abs(m90 - m55), 'rec': max(abs(out[0]['m'] - out[5]['m']), abs(out[1]['m'] - out[4]['m']), abs(out[2]['m'] - out[3]['m']))}

def fit(r, tm, Tm, dd):
    """the rates as a + b t + c (T-70) + q (T-70)², weighted by each interval's length; the rest the scatter (s a day, for a one-day interval)"""
    cols = [np.ones_like(r), tm]; names = ['rate', 'drift']
    if not np.isnan(Tm).any() and np.ptp(Tm) > 5:
        cols += [Tm - 70, (Tm - 70) ** 2]; names += ['temp', 'temp2']
    X = np.array(cols).T; w = np.sqrt(dd); c, *_ = np.linalg.lstsq(X * w[:, None], r * w, rcond=None)
    res = (r - X @ c) * w; sig = math.sqrt((res ** 2).sum() / max(1, len(r) - len(c))); return dict(zip(names, c)), sig

def backtest(d, e, rate_days=10):
    out = {}
    for N in (5, 10, 20, 30):
        errs = []
        for k in range(len(d)):
            j0 = np.searchsorted(d, d[k] - rate_days - 1e-9)
            if d[k] - d[j0] < rate_days - 0.5: continue
            jN = np.searchsorted(d, d[k] + N - 1e-9)
            if jN >= len(d) or abs(d[jN] - d[k] - N) > 0.5: continue
            rk = (e[k] - e[j0]) / (d[k] - d[j0]); errs.append((e[jN] - e[k]) - rk * (d[jN] - d[k]))
        if errs: out[N] = (np.median(np.abs(errs)), np.max(np.abs(errs)), len(errs))
    return out

def project(F, sig, Ts, n=2000, seed=1):
    """voyages: the fitted rate law with the scatter, rated over ten days, carried on; the error after N days"""
    rng = np.random.default_rng(seed); out = {}
    for N in (10, 30, 60):
        E = []
        for _ in range(n):
            T = np.resize(Ts, 10 + N) if Ts is not None else np.full(10 + N, 70.0); t = np.arange(10 + N, dtype=float)
            r = F['rate'] + F['drift'] * t + F.get('temp', 0) * (T - 70) + F.get('temp2', 0) * (T - 70) ** 2 + sig * rng.standard_normal(10 + N)
            carry = r[:10].mean(); E.append(abs((r[10:] - carry).sum()))
        out[N] = (np.median(E), np.percentile(E, 95))
    return out

def report(path_or_data):
    d, e, T, P = path_or_data; r, tm, Tm, dd = rates(d, e, T); L = []
    L.append(f'{len(d)} comparisons over {d[-1] - d[0]:.1f} days; the error from {e[0]:+.1f} to {e[-1]:+.1f} s')
    L.append(f'daily rates {r.min():+.2f} to {r.max():+.2f} s a day, mean {(e[-1] - e[0]) / (d[-1] - d[0]):+.3f} (+ gaining)')
    nv = navy(d, e, T, P); ok = True
    if nv:
        out, fig = nv; L.append("the Navy's test (Sec. IX), the figures as the card works them, the Bureau of Ships' limit beside each:")
        for p in out: L.append(f"  period {p['n']:3s} {p['T']:5.1f} °F: mean {p['m']:+.2f} s a day, deviation {p['dev']:.2f}, largest difference {p['dif']:.2f}")
        for k, v in fig.items():
            good = v <= LIM[k]; ok &= good; L.append(f"  {'ok' if good else '!!'}  {NAME[k]}: {v:.2f} (limit {LIM[k]:.2f})")
    else: L.append("the Navy's test: the log hasn't its six periods (label them I-VI, or keep five days each at 90, 72½, 55, 55, 72½, 90 °F)")
    F, sig = fit(r, tm, Tm, dd)
    L.append(f"the rates fitted: {F['rate']:+.3f} s a day, drifting {F['drift'] * 30:+.3f} s a day a month" + (f", {F['temp']:+.4f} s a day a °F and {F['temp2']:+.5f} a °F² about 70 °F" if 'temp' in F else '') + f"; the day-to-day scatter {sig:.3f} s a day")
    bt = backtest(d, e)
    if bt: L.append('backtest, its own log (a ten-day rate carried on): ' + '; '.join(f'{N} days {m:.1f} s (worst {w:.1f}, {n} tries)' for N, (m, w, n) in bt.items()))
    else: L.append('backtest: needs 20 days of log or more')
    pj = project(F, sig, None if np.isnan(Tm).any() else Tm)
    L.append('projected (the fitted law, the log\'s temperatures repeated, 2000 voyages): ' + '; '.join(f'{N} days {m:.1f} s ({m / 4:.2f} mi), 95 % {q:.1f} s ({q / 4:.2f} mi)' for N, (m, q) in pj.items()))
    good = pj[30][1] < 30; L.append(f"{'ok' if good else '!!'}  good enough to navigate by: 95 % of voyages under 30 s (7½ miles) after 30 days" + ('' if good else ': rate it again, find the drift or the temperature term, or adjust'))
    return L, F, sig, nv, ok and good

def demo():
    """a log like the error budget's chronometer like No. 3390 (errorbudget.js: scatter 0.042 s a day, its temperature curve), through the Navy test's periods,
    worked; the figures found against those it was made with"""
    rng = np.random.default_rng(3390); F0 = dict(rate=0.35, drift=0.002, temp=-0.004, temp2=0.0002); sig0 = 0.042; d, e, T, P = [0.0], [0.0], [90.0], ['I']; t = 0
    for n, Tn in PERIODS:
        for _ in range(5):
            r = F0['rate'] + F0['drift'] * (t + 0.5) + F0['temp'] * (Tn - 70) + F0['temp2'] * (Tn - 70) ** 2 + sig0 * rng.standard_normal(); t += 1
            d.append(t); e.append(round(e[-1] + r, 2)); T.append(Tn); P.append(n)
    for _ in range(30):   # thirty more days in a room at 70 °F
        r = F0['rate'] + F0['drift'] * (t + 0.5) + sig0 * rng.standard_normal(); t += 1; d.append(t); e.append(round(e[-1] + r, 2)); T.append(70.0); P.append('')
    P = [p if i <= 30 else '' for i, p in enumerate(P)]; P[0] = 'I'
    d, e, T = np.array(d), np.array(e), np.array(T); L, F, sig, nv, _ = report((d[:31], e[:31], T[:31], P[:31]))
    print('a made-up log, the Navy test\'s thirty days (rate +0.35 s a day, drift +0.06 a month, scatter 0.042, the temperature curve -0.004 s a day a °F, 0.0002 a °F²):')
    print('\n'.join('  ' + x for x in L))
    L2, F2, sig2, _, _ = report((d, e, T, [''] * len(d)))
    print('the same with thirty more days at 70 °F:'); print('\n'.join('  ' + x for x in L2))
    good = nv is not None and abs(F2['rate'] - F0['rate']) < 0.05 and abs(sig2 - sig0) < 0.02 and abs(F2.get('temp', 0) - F0['temp']) < 0.004
    print(('  ok ' if good else '  !! ') + f"the fit finds rate {F2['rate']:+.3f} (made {F0['rate']:+.3f}), scatter {sig2:.3f} ({sig0}), temperature {F2.get('temp', 0):+.4f} ({F0['temp']:+.4f}), the comparator's 0.01 s rounding in it")
    return good

def main():
    sys.stdout.reconfigure(encoding='utf-8'); a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == '--demo': sys.exit(0 if demo() else 1)
    if a[0] == '--template':
        out = a[1] if len(a) > 1 else 'rating-log.csv'; open(out, 'w', encoding='utf-8').write('when,error,temp,period,wound\n2026-11-02 12:00,0.0,90,I,y\n'); print('wrote', out); return
    L, F, sig, nv, ok = report(read(a[0])); print('\n'.join('  ' + x for x in L)); sys.exit(0 if ok else 1)

if __name__ == '__main__': main()
