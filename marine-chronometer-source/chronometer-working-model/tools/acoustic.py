"""The escapement heard: the clicks inside each beat of recordings of real, running Model 21s, timed and fitted with the model's escapement in time
(dynamics.js), the balance's swing the free parameter (References/VIDEOS.md, "Methods": the clicks of a beat). No browser; numpy, scipy, matplotlib and
imageio-ffmpeg (its ffmpeg reads the audio), yt-dlp for --fetch. The recordings stay in $MC_VIDEO (default ~/mc-video), so ci.py can't run it.

  python acoustic.py ID [ID ...]        each recording's beat, its onsets and the fits: about 20 s for the models, then 15 s to 2 min a recording
                                          (the fit with the beat error free tries every pairing on a 2-parameter grid: longest where many onsets are found)
        [--fetch]                         fetch a recording first, with its sound: $MC_VIDEO/run_ID.mkv (yt-dlp, 1080p at most; video.py fetch takes no sound)
        [--from mm:ss] [--to mm:ss]       only that stretch (every recording)
        [--boot 200]                      bootstrap resamples over beats (the onsets' spread, and the swing's over the first 100)
        [--plots DIR]                     where the plots go (default $MC_VIDEO/acoustic): ac_ID.png, the beat with its onsets and both models' best fits
        [--every S]                       stretch by stretch, S s each (a swing that changes: a start), the active swing's clicks alone
        [--write]                         write tools/acoustic.json (per recording, merged: beats used, onsets, each model's fits and residuals, single intervals)
  python acoustic.py s7VW3RiJ97E We1dLNXiBj0 xDKFZaY88cM XJQCgMV_GA8 FpolZSipVmQ --write   (the five of VIDEOS.md with running sound, about 4 min)
  python acoustic.py We1dLNXiBj0 --every 6 --from 0:56 --write   (the balance started by hand at 0:55, swing.py's build-up: acoustic_stretches.json, 30 s)

Method. 1. The audio, mono at 48 kHz, filtered to 4-12 kHz (timing: the case rings near 1 kHz, every 1.1 ms in a lower band's envelope) and 1.5-4 kHz
(shown); the envelope |hilbert|, smoothed to 3 kHz (both zero-phase). 2. The beat: the envelope's autocorrelation between 0.3 and 1.2 s (0.5 s, one
impulse an oscillation). 3. Candidate clicks: the loudest point of every stretch 0.8 of a beat long, kept where another stands a beat off within 5 ms
(edited videos jump in phase at their cuts, so no one beat train runs through a recording); each then placed by cross-correlating its envelope
(-30..+40 ms) with the trimmed mean of the beats kept, within 8 ms, three passes. Only intervals inside a beat are used: the recording's clock is good to
tens of ppm, not the rate. 4. Beats rejected when their quiet floor (FL, 300-440 ms after the click: after the return swing, before the next beat) is
over twice the median (speech, handling), or their correlation with the template under half the median. 5. Each beat over its own floor, the trimmed
mean (20 % each end) per band, in dB: 0 dB is the quiet floor. 6. Onsets: where the level first stands DLO (1.5 dB) over the highest it reached 4 to 2 ms
before, on a rise that goes on to DHI (2 dB) over it: a click's ringing never rises above its own earlier peaks, a new click on its tail does, and a rise
of up to 2 ms is measured whole. Their spread over --boot resamples of the beats (with replacement) is each onset's uncertainty, and how often it is
found its weight: an onset rising STRONG (3 dB) in 80 % of them must be explained, a weaker one may be. 7. The model: dynamics.js's time-domain
escapement at 15 drives (about 140-350 deg) and 7 beat errors (bE -12 to +12 deg), each beat's events relative to the strike: 4 the discharge jewel meets
the passing spring (unlocking), 2 the wheel released (the tooth leaves the stone), 3 the detent lands on its stop (first), 7 it is home on it (its last
landing, the bounces dying away: since 14 October 2026; We1dLNXiBj0's loud click is this one, the video's swing shows, not the strike), 0 the tooth strikes
the impulse jewel, 1 the next tooth locks on the stone, and on the return swing 8 the jewel meets the trip spring and 9 the spring comes clear; the old model (before
11 October 2026, 39d6919) from its kinematic angles, t(theta) = acos((bE - theta)/A)/(4 pi) from the far turning point (the return swing T - t). 8. The
fit: every order-keeping one-to-one pairing of events with onsets (which click the beats were aligned on is free: the strike in one recording, the lock
in another); for each, the shift by weighted least squares at every swing, the cost the pairs' chi^2 (sigma: the onset's spread and SM, 0.3 ms, the
onset's definition and Opus's smearing of transients, in quadrature) plus UE (4) an event unheard and UO (9) a strong onset unexplained. Swing only
(in beat), its uncertainty the 16-84 % of the fit over resamples; then the beat error free too, a second parameter (the chronometer's own state, like
its swing), its ranges where the cost stays within 1 of the least. The runner-up is the best pairing of other onsets: what the reading had to beat.
9. Single intervals between paired onsets, each read as a swing on the corrected model alone: unlocking to strike to lock (corrected 7.2 and 8.5 ms at
255 deg, old 2.1 and 12.9: their ratio, about 0.85 against 0.16, doesn't depend on the swing) and the return swing's clicks to the next unlocking (the
lift-angle method: from one known angle to another, the swing alone sets the time)."""
import numpy as np, sys, os, glob, json, subprocess, re
from itertools import combinations
from scipy import signal, stats
TOOLS = os.path.dirname(os.path.abspath(__file__)); HOME = os.environ.get('MC_VIDEO', os.path.expanduser('~/mc-video')); FS = 48000
BANDS = {'4-12 kHz': (4000, 12000), '1.5-4 kHz': (1500, 4000)}; TB = '4-12 kHz'
W0, W1, R0, R1 = -30, 40, 215, 295   # the windows read, ms from the aligned click: the active swing's clicks and the return swing's, half a period on
DLO, DHI, STRONG, SM = 1.5, 2.0, 3.0, 0.3   # onset thresholds (dB; an onset rising STRONG or more must be explained, a weaker one may be), and the timing sigma (ms) every onset carries besides its spread: the onset's definition, Opus's smearing of transients
FL = (300, 440)   # the quiet floor, ms after the aligned click: after the return swing's clicks, before the next beat (a click rings for 100 ms in xDKFZaY88cM)
GB = (4, 2)   # the baseline: the highest level 4 to 2 ms before (a rise of up to 2 ms is measured whole; ringing, every 1.1 ms, stays under its earlier peaks)
NAMES = {4: 'jewel meets passing spring', 2: 'wheel released', 3: 'detent lands', 7: 'detent home', 0: 'strike', 1: 'lock', 8: 'jewel meets trip spring', 9: 'trip spring clear'}
FIT = [4, 2, 3, 7, 0, 1, 8, 9]; CORE = [0, 1, 8, 9]; ACT = [4, 2, 3, 7, 0, 1]
UE, UO = 4.0, 9.0   # the fit's price for a model event left unheard (2 sigma squared: some contacts are quiet) and for a clear onset no event explains (3 sigma squared)
def opt(a, k, n, d):
    if k in a: i = a.index(k); v = a[i + 1:i + 1 + n]; del a[i:i + 1 + n]; return v if n > 1 else v[0]
    return d
def secs(s): m, x = s.split(':'); return int(m) * 60 + float(x)
def ffmpeg():
    import imageio_ffmpeg; return imageio_ffmpeg.get_ffmpeg_exe()
def find(i):   # the copy of recording i that has a sound track (run_ID.mkv, fetched with --fetch; video.py's fetch takes the picture alone)
    if os.path.isfile(i): return i   # a recording of your own (a phone's, of the movement you made): any file ffmpeg reads
    for f in sorted(glob.glob(os.path.join(HOME, f'*{i}*')), key=lambda f: not os.path.basename(f).startswith('run_')):
        if f.split('.')[-1] in ('mkv', 'webm', 'mp4') and 'Audio:' in subprocess.run([ffmpeg(), '-hide_banner', '-i', f], capture_output=True, text=True).stderr: return f
    sys.exit(f'{i}: no copy with sound in {HOME}; python acoustic.py {i} --fetch')
def fetch(i):
    subprocess.run([sys.executable, '-m', 'yt_dlp', '-f', 'bv*[height<=1080]+ba/b', '--merge-output-format', 'mkv', '--no-progress', '--ffmpeg-location', ffmpeg(),
                    '-o', os.path.join(HOME, f'run_{i}.%(ext)s'), 'https://www.youtube.com/watch?v=' + i], check=True)
def audio(f, t0=0, t1=None):
    r = subprocess.run([ffmpeg(), '-v', 'error', '-ss', str(t0)] + (['-to', str(t1)] if t1 else []) + ['-i', f, '-vn', '-ac', '1', '-ar', str(FS), '-f', 'f32le', '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).astype(float)
def env(x, b):
    y = signal.sosfiltfilt(signal.butter(4, b, 'band', fs=FS, output='sos'), x)
    return signal.sosfiltfilt(signal.butter(2, 3000, fs=FS, output='sos'), np.abs(signal.hilbert(y)))
ms = lambda v: int(round(v * FS / 1000))
def beats(e):
    """the beat period, and each beat's click placed on the running template; returns (times in samples, kept mask, period s, stats)"""
    z = e - e.mean(); n = len(z); ac = np.fft.irfft(np.abs(np.fft.rfft(z, 2 * n)) ** 2)[:int(1.3 * FS)]; P = (int(0.3 * FS) + np.argmax(ac[int(0.3 * FS):int(1.2 * FS)])) / FS; N = int(round(P * FS))
    # candidates: the loudest point of every stretch at least 0.8 P long, kept where a neighbour stands a period off (within 5 ms): edited videos jump in phase at
    # their cuts, so no single beat train runs through a whole recording
    es = signal.sosfiltfilt(signal.butter(2, 200, fs=FS, output='sos'), e); pk, _ = signal.find_peaks(es, distance=int(0.8 * N))
    nb = lambda q: np.any(np.abs(np.abs(pk - q) - N) < ms(5)); c = np.array([q for q in pk if nb(q)])
    a0, a1, S = ms(W0), ms(W1), ms(8); c = c[(c + a0 - 2 * S >= 0) & (c + ms(max(R1, FL[1])) + 2 * S < n)]; ok = np.ones(len(c), bool)
    for it in range(3):   # each beat placed on the trimmed mean of the beats kept so far, by cross-correlation within 8 ms (the strike and the lock trade loudness)
        E = np.array([e[t + a0:t + a1] for t in c]); tpl = stats.trim_mean(E[ok], 0.2, axis=0); tpl = tpl - tpl.mean(); cc = np.zeros(len(c)); nc = c.copy()
        for j, t in enumerate(c):
            w = e[t + a0 - S:t + a1 + S]; r = signal.correlate(w - w.mean(), tpl, 'valid'); nc[j] = t - S + np.argmax(r); cc[j] = np.corrcoef(e[nc[j] + a0:nc[j] + a1], tpl)[0, 1]
        c = nc; fl = np.array([np.median(e[t + ms(FL[0]):t + ms(FL[1])]) for t in c]); ok = (fl < 2 * np.median(fl)) & (cc > 0.5 * np.median(cc))
    d = np.diff(c[ok]); d = d[np.abs(d - N) < ms(5)] / FS
    return c, ok, P, dict(n=len(c), kept=int(ok.sum()), cc=float(np.median(cc[ok])), period=float(np.median(d)), jitter=float(np.std(d) * 1e3))
def mean_db(e, c, idx=None):
    """the beats (rows: c's) each over its own quiet floor, trimmed mean, in dB; on the time axis of both windows"""
    tt = np.r_[np.arange(ms(W0), ms(W1)), np.arange(ms(R0), ms(R1))]; c = c if idx is None else c[idx]
    E = e[c[:, None] + tt[None]]; fl = np.median(np.array([e[t + ms(FL[0]):t + ms(FL[1])] for t in c]), 1); E = E / fl[:, None]
    return tt / FS * 1000, 20 * np.log10(np.maximum(stats.trim_mean(E, 0.2, axis=0), 1e-6))
def onsets(tt, L):
    """onsets on a level curve (dB): the level DLO over its own highest in the 3 ms before (to 0.3 ms before), on a rise that reaches DHI over it"""
    out = []; dt = tt[1] - tt[0]
    for seg in (tt < W1 + 1, tt > R0 - 1):
        t, l = tt[seg], L[seg]; b0, b1 = ms(GB[0]), ms(GB[1]); D = np.full(len(l), -99.0)
        for i in range(b0, len(l)): D[i] = l[i] - l[i - b0:i - b1].max()
        i = b0
        while i < len(l):
            if D[i] >= DLO:
                j = i; pk = i
                while j < len(l) and D[j] > 0: pk = j if D[j] > D[pk] else pk; j += 1
                if D[pk] >= DHI:
                    f = (DLO - D[i - 1]) / (D[i] - D[i - 1]) if D[i - 1] > -99 else 0   # sub-sample, linear between the samples either side of DLO
                    out.append((float(t[i] - (1 - f) * dt), float(D[pk]), float(l[pk])))
                i = j + 1
            else: i += 1
    return out
def boot(e, c, B, rng):
    """onsets of every resample of the beats"""
    return [onsets(*mean_db(e, c, rng.integers(0, len(c), len(c)))) for _ in range(B)]
def match(on, bs):   # each onset's spread over the resamples (nearest within 1 ms) and the share of resamples finding it
    r = []
    for t, h, l in on:
        x = [min((abs(o[0] - t), o[0]) for o in b)[1] for b in bs if b and min(abs(o[0] - t) for o in b) < 1.0]
        r.append(dict(t=round(t, 3), sd=round(float(np.std(x)) if len(x) > 2 else 1.0, 3), p=round(len(x) / len(bs), 2), rise=round(h, 1), level=round(l, 1)))
    return r

# ---------- the models ----------
JS = r"""const {sim,ESC}=require(process.argv[1]+'/dynamics.js'),D=Math.PI/180,out=[];
for(const bE of [-12,-8,-4,0,4,8,12])for(const s of [0.35,0.4,0.45,0.5,0.6,0.7,0.8,0.9,1,1.1,1.25,1.4,1.6,1.8,2]){const tr=[],r=sim({mode:'phys',T:4,from:3,trace:tr,s,bE,A:ESC.ampAt(s)/D}),ev=tr.map(x=>[+x[0],x[1]]);
  const q=ev.filter(e=>e[1]===0&&e[0]>2.9&&e[0]<3.4);if(!q.length)continue;const st=q[0][0],E={},L3=[];for(const[t,k]of ev){const d=(t-st)*1e3;if(d<-20||d>300)continue;if(k===3)L3.push(d);if(E[k]===undefined)E[k]=d;}
  const h=L3.filter(d=>d<E[1]);if(h.length)E[7]=h[h.length-1];   /* 7: the detent home on its stop, its last landing before the lock */
  if([4,2,3,7,0,1,8,9].every(k=>E[k]!==undefined))out.push({s,bE,A:r.A,E});}   /* far out of beat at the strongest drive it trips: no clean beat, left out */
console.log(JSON.stringify(out));"""
DB = [-12, -8, -4, 0, 4, 8, 12]   # out of beat (deg) the model is run at: the hairspring's rest that far from the escapement's zero (dynamics.js bE)
def corrected():   # {bE: (swings, {event: times})} over the drives
    r = subprocess.run(['node', '-e', JS, os.path.join(TOOLS)], capture_output=True, text=True, check=True); T = json.loads(r.stdout)
    return {d: (np.array([x['A'] for x in T if x['bE'] == d]), {k: np.array([x['E'][str(k)] for x in T if x['bE'] == d]) for k in FIT}) for d in DB}
# the old model (39d6919's makeEsc, kinematic, no time-domain version): angles from its measure() at the model's settings: the jewel meets the passing spring at
# contact -27.32 deg, the wheel is released (rel) -21.28, the tooth lands on the impulse jewel (run.land) -20.65, the detent falls back (off) -10.96, impulse ends at the lock (impEnd) +20.75; on the
# return swing the jewel meets the trip spring at -15.88 (its PS table's first contact) and the spring comes clear (poff) -39.12
OLD = {4: -27.32, 2: -21.28, 0: -20.65, 3: -10.96, 7: -10.96, 1: 20.75, 8: -15.88, 9: -39.12}   # 7: the old model's detent falls back in one step (3)
def old_at(A, d=0.0):   # the balance at d - A cos(wt): out of beat by d, the oscillation's centre d from the escapement's zero
    t = lambda th: np.arccos(np.clip((d - th) / A, -1, 1)) / (4 * np.pi) * 1000; s = t(OLD[0])
    return {k: (500 - t(v) - s if k in (8, 9) else t(v) - s) for k, v in OLD.items()}
def table(kind, GA, GD, C=None):
    """the model's event times (ms from the strike) on the grid of swings GA and beat errors GD (parallel arrays)"""
    if kind == 'old': return {k: np.array([old_at(A, d)[k] for A, d in zip(GA, GD)]) for k in FIT}
    at = lambda d: {k: np.interp(GA, C[d][0], C[d][1][k]) for k in FIT}; out = {k: np.zeros(len(GA)) for k in FIT}
    for j in range(len(DB) - 1):   # linear between the beat errors run
        m = (GD >= DB[j]) & (GD <= DB[j + 1]); f = (GD[m] - DB[j]) / (DB[j + 1] - DB[j]); a0, a1 = at(DB[j]), at(DB[j + 1])
        for k in FIT: out[k][m] = (1 - f) * a0[k][m] + f * a1[k][m]
    return out
def fit(on, Ag, M, evs, GD=None):
    """every order-keeping one-to-one pairing of model events with onsets; for each swing on the grid the shift t0 by weighted least squares; the cost the
    pairs' chi^2, UE for each event left unpaired and UO for each onset rising STRONG, found in 80 % of resamples, left unexplained. Returns the best (A, t0, cost,
    pairs, chi2) and, as alt, the best that pairs different onsets (the runner-up reading: what the fit had to beat)"""
    ot = np.array([o['t'] for o in on]); sg = np.hypot([o['sd'] for o in on], SM); strong = np.array([o['p'] >= 0.8 and o['rise'] >= STRONG for o in on]); ev = sorted(evs, key=lambda k: M[k][len(Ag) // 2]); top = {}; prof = np.full(len(Ag), np.inf)
    for m in range(1, min(len(ev), len(on)) + 1):
        for E in combinations(range(len(ev)), m):
            mt = np.stack([M[ev[e]] for e in E], 1)
            for O in combinations(range(len(on)), m):
                O = list(O); w = 1 / sg[O] ** 2; r = ot[O][None] - mt; t0 = (r * w).sum(1) / w.sum(); chi = ((r - t0[:, None]) ** 2 * w).sum(1)
                cost = chi + UE * (len(ev) - m) + UO * (strong.sum() - strong[O].sum()); i = int(np.argmin(cost)); key = tuple(O); prof = np.minimum(prof, cost)
                if key not in top or cost[i] < top[key]['cost'] - 1e-9: top[key] = dict(A=float(Ag[i]), bE=float(GD[i]) if GD is not None else 0.0, i=i, t0=float(t0[i]), cost=float(cost[i]), chi2=float(chi[i]), pairs=[(ev[e], o) for e, o in zip(E, O)])
    r = sorted(top.values(), key=lambda f: f['cost']); best = r[0]; best['prof'] = prof
    best['alt'] = next((f for f in r[1:] if {o for _, o in f['pairs']} != {o for _, o in best['pairs']} and len(f['pairs']) > 1), None); return best
def residuals(on, M, f):
    return {NAMES[k]: dict(model=round(float(M[k][f['i']] + f['t0']), 2), onset=on[o]['t'], res=round(float(on[o]['t'] - M[k][f['i']] - f['t0']), 2)) for k, o in f['pairs']}
def invert(CA, y, g):   # a swing from one interval on the corrected model (monotonic in the swing over the grid)
    o = np.argsort(y); return float(np.interp(g, y[o], CA[o], left=np.nan, right=np.nan))

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    t0s, t1s = opt(a, '--from', 1, None), opt(a, '--to', 1, None); B = int(opt(a, '--boot', 1, '200')); NB = min(B, 100); pd = opt(a, '--plots', 1, os.path.join(HOME, 'acoustic'))
    every = float(opt(a, '--every', 1, '0')); write = '--write' in a; get = '--fetch' in a; ids = [x for x in a if not x.startswith('--')]
    os.makedirs(pd, exist_ok=True); rng = np.random.default_rng(1)
    C = corrected(); lo_, hi_ = max(max(140, np.ceil(C[d][0].min())) for d in DB), min(min(360, np.floor(C[d][0].max())) for d in DB)
    Ag = np.arange(lo_, hi_ + 0.01, 0.5); Z = np.zeros(len(Ag)); MC, MO = table('new', Ag, Z, C), table('old', Ag, Z)
    A2, D2 = [g.ravel() for g in np.meshgrid(np.arange(lo_, hi_ + 0.01, 1.0), np.arange(-12, 12.01, 1.0))]; MC2, MO2 = table('new', A2, D2, C), table('old', A2, D2)
    i255 = np.argmin(abs(Ag - 255))
    print(f'  corrected model (dynamics.js), at {lo_:.0f}-{hi_:.0f} deg; at 255 deg: ' + ', '.join(f'{NAMES[k]} {MC[k][i255]:+.2f}' for k in FIT) + ' ms from the strike')
    print(f'  old model (39d6919, kinematic), at 255 deg: ' + ', '.join(f'{NAMES[k]} {MO[k][i255]:+.2f}' for k in FIT))
    res = {}
    for i in ids:
        if get: fetch(i)
        f = find(i); x = audio(f, secs(t0s) if t0s else 0, secs(t1s) if t1s else None); e = {b: env(x, v) for b, v in BANDS.items()}
        if every:   # the swing stretch by stretch: a recording whose swing changes (a start), each stretch's active-swing clicks fitted alone (no beat error to fit)
            out, T0 = [], secs(t0s) if t0s else 0
            print(f'\n{i} ({os.path.basename(f)}): stretches of {every:g} s, the active swing\'s clicks only (unlocking, release, detent, strike, lock)')
            for k in range(int(len(x) / FS // every)):
                sg = e[TB][int(k * every * FS):int((k + 1) * every * FS)]
                try: c, ok, P, st = beats(sg); ck = c[ok]; tt, L = mean_db(sg, ck)
                except Exception: continue
                on = [o for o in match(onsets(tt, L), boot(sg, ck, 40, rng)) if o['t'] < W1 + 1]
                if st['kept'] < 6 or not on: continue
                row = dict(t=round(T0 + (k + 0.5) * every, 1), beats=st['kept'], onsets=[(o['t'], o['rise']) for o in on])
                for nm, M in (('corrected', MC), ('old', MO)):
                    F = fit(on, Ag, M, ACT); ev = {q: on[o]['t'] for q, o in F['pairs']}
                    sl = invert(Ag, M[1] - M[0], ev[1] - ev[0]) if 0 in ev and 1 in ev else np.nan
                    uh = invert(Ag, M[7] - M[4], ev[7] - ev[4]) if 4 in ev and 7 in ev else np.nan   # the unlocking to the detent home: since 14 October 2026
                    row[nm] = dict(A=F['A'], cost=round(F['cost'], 1), pairs={NAMES[q]: v for q, v in ev.items()}, strike_lock=round(ev[1] - ev[0], 2) if 0 in ev and 1 in ev else None, A_strike_lock=sl,
                                   unlock_home=round(ev[7] - ev[4], 2) if 4 in ev and 7 in ev else None, A_unlock_home=uh)
                out.append(row); g = row['corrected']; h = row['old']
                print(f'  {int(row["t"] // 60)}:{row["t"] % 60:04.1f} {st["kept"]:3d} beats: corrected {g["A"]:.0f} deg (cost {g["cost"]:.1f}' + (f', strike to lock {g["strike_lock"]:.2f} ms: {g["A_strike_lock"]:.0f} deg' if g['strike_lock'] else '') + (f', unlocking to the detent home {g["unlock_home"]:.2f} ms: {g["A_unlock_home"]:.0f} deg' if g['unlock_home'] else '')
                      + f'), old {h["A"]:.0f} deg (cost {h["cost"]:.1f}): ' + ', '.join(f'{q} {v:+.2f}' for q, v in g['pairs'].items()))
            res[i] = dict(file=os.path.basename(f), every=every, stretches=out); continue
        c, ok, P, st = beats(e[TB]); ck = c[ok]
        tt, L = mean_db(e[TB], ck); on = onsets(tt, L); bs = boot(e[TB], ck, B, rng); on = match(on, bs)
        print(f'\n{i} ({os.path.basename(f)}, {len(x) / FS:.0f} s): beat {P * 1000:.1f} ms by autocorrelation, {st["n"]} beats, {st["kept"]} kept (median correlation {st["cc"]:.2f}; '
              f'interval {st["period"]:.5f} s, sd {st["jitter"]:.2f} ms, the recording\'s clock: never used for the rate)')
        print('  onsets, ms from the aligned click (4-12 kHz, over ' + f'{B} resamples): ' + '  '.join(f'{o["t"]:+.2f}±{o["sd"]:.2f} ({o["rise"]:.0f} dB, {o["p"]:.0%})' for o in on))
        R = dict(file=os.path.basename(f), stretch=[t0s or '0:00', t1s or 'end'], beats=st['n'], kept=st['kept'], onsets=on, fits={})
        bt = {}
        for nm, M in (('corrected', MC), ('old', MO)):
            for evn, evs in (('all', FIT), ('core', CORE)):
                F = fit(on, Ag, M, evs)
                # the swing's uncertainty: the same fit on each resample's onsets (the full set's spreads)
                Ab, same = [], 0
                for b in bs[:NB]:
                    ob = [dict(t=o[0], sd=min(on, key=lambda q: abs(q['t'] - o[0]))['sd'], p=1.0, rise=o[1]) for o in b]
                    if ob: g = fit(ob, Ag, M, evs); Ab.append(g['A']); same += [k for k, _ in g['pairs']] == [k for k, _ in F['pairs']]
                lo, hi = np.percentile(Ab, [16, 84]); edge = F['A'] in (Ag[0], Ag[-1])
                R['fits'][f'{nm}/{evn}'] = dict(A=F['A'], A16=float(lo), A84=float(hi), t0=round(F['t0'], 2), cost=round(F['cost'], 2), chi2=round(F['chi2'], 2), paired=len(F['pairs']),
                                                same_pairing=round(same / len(Ab), 2), edge=bool(edge), res=residuals(on, M, F))
                bt[(nm, evn)] = F
                print(f'  {nm:9s} {evn:4s}: swing {F["A"]:.0f} deg (resamples 16-84 %: {lo:.0f}-{hi:.0f}){" at the grid edge" if edge else ""}, shift {F["t0"]:+.2f} ms, cost {F["cost"]:.1f} '
                      f'(chi2 {F["chi2"]:.1f} on {len(F["pairs"])} pairs, the same pairing in {same / len(Ab):.0%} of resamples): ' + ', '.join(f'{k} {v["res"]:+.2f}' for k, v in R['fits'][f'{nm}/{evn}']['res'].items()))
                if F['alt']:
                    G = F['alt']; R['fits'][f'{nm}/{evn}']['alt'] = dict(A=G['A'], cost=round(G['cost'], 2), pairs={NAMES[k]: on[o]['t'] for k, o in G['pairs']})
                    print(f'       runner-up: swing {G["A"]:.0f} deg, cost {G["cost"]:.1f}: ' + ', '.join(f'{NAMES[k]} at {on[o]["t"]:+.2f}' for k, o in G['pairs']))
        # and with the beat error free too (a second parameter, the chronometer's own state like its swing): the range where the cost stays within 1 of its least
        for nm, M in (('corrected', MC2), ('old', MO2)):
            F = fit(on, A2, M, FIT, D2); pr = F['prof']; okA = pr <= F['cost'] + 1; aR, dR = (A2[okA].min(), A2[okA].max()), (D2[okA].min(), D2[okA].max())
            R['fits'][f'{nm}/beat'] = dict(A=F['A'], bE=F['bE'], A_range=[float(v) for v in aR], bE_range=[float(v) for v in dR], t0=round(F['t0'], 2), cost=round(F['cost'], 2), chi2=round(F['chi2'], 2),
                                           paired=len(F['pairs']), res=residuals(on, M, F)); bt[(nm, 'beat')] = F
            print(f'  {nm:9s} beat: swing {F["A"]:.0f} deg ({aR[0]:.0f}-{aR[1]:.0f}), out of beat {F["bE"]:+.0f} deg ({dR[0]:+.0f} to {dR[1]:+.0f}), cost {F["cost"]:.1f} (chi2 {F["chi2"]:.1f} on {len(F["pairs"])} pairs): '
                  + ', '.join(f'{k} {v["res"]:+.2f}' for k, v in R['fits'][f'{nm}/beat']['res'].items()))
        # single intervals read on the corrected model, between the onsets its fit paired with two events
        F = bt[('corrected', 'all')]; ev = {k: on[o] for k, o in F['pairs']}; one = {}
        for a_, b_ in ((0, 1), (4, 0), (4, 7), (7, 1), (8, 9), (8, 4), (9, 4), (8, 0), (9, 0)):
            if a_ in ev and b_ in ev:
                wr = (a_ in (8, 9)) != (b_ in (8, 9)); g = (ev[b_]['t'] - ev[a_]['t']) % 500 if wr else ev[b_]['t'] - ev[a_]['t']; s = float(np.hypot(ev[a_]['sd'], ev[b_]['sd']))
                y = (MC[b_] - MC[a_]) % 500 if wr else MC[b_] - MC[a_]; yo = (MO[b_] - MO[a_]) % 500 if wr else MO[b_] - MO[a_]
                As = [invert(Ag, y, g + q * np.hypot(s, SM)) for q in (-1, 0, 1)]
                one[f'{NAMES[a_]} -> {NAMES[b_]}'] = dict(ms=round(g, 2), sd=round(s, 2), A=As[1], A_range=[As[0], As[2]], corrected_255=round(float(y[i255]), 2), old_255=round(float(yo[i255]), 2))
                print(f'     {NAMES[a_]} -> {NAMES[b_]}{" (next beat)" if wr and a_ in (8, 9) else ""}: {g:.2f} ± {s:.2f} ms (corrected at 255 deg {y[i255]:.2f}, old {yo[i255]:.2f}): on the corrected model '
                      + (f'{As[1]:.0f} deg' if not np.isnan(As[1]) else f'outside {Ag[0]:.0f}-{Ag[-1]:.0f} deg') + f' ({", ".join("-" if np.isnan(v) else f"{v:.0f}" for v in (As[0], As[2]))} at ±1 sigma with 0.3 ms)')
        R['intervals'] = one; res[i] = R
        # the plot: the beat in both bands, onsets with their spread, both models' best fits
        import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
        fig, ax = plt.subplots(1, 2, figsize=(15, 4.8), gridspec_kw=dict(width_ratios=[7, 8]))
        for b, col in zip(BANDS, ('C1', 'C0')):
            t_, L_ = mean_db(e[b], ck)
            for k_, s_ in enumerate((t_ < W1 + 1, t_ > R0 - 1)): ax[k_].plot(t_[s_], L_[s_], col, lw=0.8, label=f'{b} ({st["kept"]} beats)')
        for o in on:
            k_ = int(o['t'] > W1 + 1); ax[k_].axvline(o['t'], color='k', lw=0.8 if o['p'] >= 0.8 and o['rise'] >= STRONG else 0.4, ls='-' if o['p'] >= 0.8 and o['rise'] >= STRONG else ':')
            ax[k_].errorbar(o['t'], -3, xerr=o['sd'], fmt='k|', ms=8)
        for (nm, col, ls) in (('corrected', 'g', '-'), ('old', 'r', '--')):
            F = bt[(nm, 'all')]; A = F['A']; M = MC if nm == 'corrected' else MO
            for k in FIT:
                x = M[k][F['i']] + F['t0']; k_ = int(x > W1 + 1); ax[k_].axvline(x, color=col, ls=ls, lw=1.2, alpha=0.7); ax[k_].text(x, ax[k_].get_ylim()[1] if False else 38 - 4 * (nm == 'old'), f'{k}', color=col, fontsize=8, ha='center')
            ax[1].plot([], [], color=col, ls=ls, label=f'{nm} model at {A:.0f} deg')
        ax[0].set_xlim(W0, W1); ax[1].set_xlim(R0, R1)
        for k_ in (0, 1): ax[k_].grid(alpha=0.3); ax[k_].set_xlabel('ms from the aligned click'); ax[k_].set_ylim(-6, max(42, L.max() + 3))
        ax[0].set_ylabel('dB over each beat\'s quiet floor'); ax[0].set_title(f'{i}: the active swing (4 unlock, 3 detent lands, 7 home, 0 strike, 1 lock)', fontsize=9)
        ax[1].set_title('half a period on: the return swing (8 the jewel meets the trip spring, 9 it comes clear)', fontsize=9); ax[0].legend(fontsize=7, loc='upper left'); ax[1].legend(fontsize=7, loc='upper right')
        plt.tight_layout(); p = os.path.join(pd, f'ac_{i}.png'); plt.savefig(p, dpi=80); plt.close(); print('  plot', p)
    if write:
        out = dict(note='acoustic.py: onsets in ms from each recording\'s aligned click; fits: swing A (deg) with the 16-84 % of resamples, shift t0, cost, residual per event (onset - model, ms)', recordings=res)
        fn = os.path.join(TOOLS, 'acoustic_stretches.json' if every else 'acoustic.json')   # merged: a recording run again replaces its own entry only
        if os.path.exists(fn): out['recordings'] = {**json.load(open(fn, encoding='utf-8')).get('recordings', {}), **res}
        json.dump(out, open(fn, 'w', encoding='utf-8', newline=''), indent=1, ensure_ascii=False); print('\nwrote', os.path.join(TOOLS, 'acoustic_stretches.json' if every else 'acoustic.json'))
