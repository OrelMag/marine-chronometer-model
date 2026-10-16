"""The report "Does the model behave like a real Hamilton Model 21?" (model README, "Checked against real chronometers"): index.html here, built from
template.html and the results the tools wrote (../../tools: acoustic.json, acoustic_stretches.json, swing.json) with assets/data.json (the model's intervals
and the start run at two run-downs: node reportdata.js, about 10 s). The data are embedded, so the page opens from the file without a server.

  python build_report.py                 index.html here: the charts, our plots and text; the videos linked at the moments used, never copied
  python build_report.py --local DIR     a fuller copy in DIR (outside the repository): also short audio excerpts and the video frames, from $MC_VIDEO
                                         (the recordings, swing.py's frames; imageio-ffmpeg cuts the clips), about 10 s
  python build_report.py --figures       redraw assets/we1d_stretches.png from We1dLNXiBj0's sound (acoustic.py; the recording in $MC_VIDEO), about 20 s

Blocks marked <!--L-->...<!--/L--> in the template are the local copy's only (clips, frames); <!--R ... R--> the repository's only (links instead)."""
import json, os, re, sys, shutil, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); TOOLS = os.path.normpath(os.path.join(HERE, '..', '..', 'tools'))
VID = os.environ.get('MC_VIDEO', os.path.expanduser('~/mc-video'))
D = json.load(open(os.path.join(HERE, 'assets', 'data.json')))
ST = json.load(open(os.path.join(TOOLS, 'acoustic_stretches.json'), encoding='utf-8'))['recordings']['We1dLNXiBj0']['stretches']
SW = json.load(open(os.path.join(TOOLS, 'swing.json'), encoding='utf-8'))['We1dLNXiBj0']

# the corrected model's intervals against the swing (dynamics.js, in beat); the old model's from its kinematic angles (39d6919)
M = sorted(D['model'], key=lambda m: m['A']); MA = np.array([m['A'] for m in M])
SL = np.array([m['E']['1'] - m['E']['0'] for m in M]); US = np.array([m['E']['0'] - m['E']['4'] for m in M])
inv = lambda y, g: float(np.interp(-g, -y, MA))   # both intervals fall as the swing grows
oldt = lambda th, A: np.degrees(np.arccos(np.clip(-th / A, -1, 1))) / 360 / 2 * 1000   # ms from the far turning point, T = 0.5 s
grid = np.arange(132, 350.1, 2.0)
model_sl = [[float(a), round(float(np.interp(a, MA, SL)), 3)] for a in grid]; old_sl = [[float(a), round(float(oldt(20.75, a) - oldt(-20.65, a)), 3)] for a in grid]

# the video's swing at time t, on its three readings (swing.json's A_t is the middle one; low: start 62.6, growth 181.8; high: 70.1, 196.8, the likeliest)
At = np.array(SW['A_t']); a0 = At[0, 1]; g0 = At[-1, 1] - a0
rd = lambda A0, G: [[float(t), round(float(A0 + (A - a0) * G / g0), 1)] for t, A in At]
vid = dict(low=rd(62.6, 181.8), mid=[[float(t), float(A)] for t, A in At], high=rd(70.1, 196.8))
vat = lambda t, k: float(np.interp(t, [p[0] for p in vid[k]], [p[1] for p in vid[k]], left=np.nan, right=np.nan))

# the sound's swing per stretch: strike to lock while the lock is heard (to 2:05), unlocking to strike after (the lock under the threshold)
snd, pts = [], []
for r in ST:
    on = r['onsets']; Mt = max(on, key=lambda o: o[1])[0]
    Y = [t for t, h in on if 4 < t - Mt < 19 and h >= 3]; X = [t for t, h in on if -9.6 < t - Mt < -4 and h >= 3]
    if 65 <= r['t'] <= 125 and Y:
        g = Y[0] - Mt; A = inv(SL, g); snd.append(dict(t=r['t'], A=round(A, 1), how='strike to lock', ms=round(g, 2)))
        lo, mi, hi = vat(r['t'], 'low'), vat(r['t'], 'mid'), vat(r['t'], 'high')
        if hi == hi: pts.append(dict(t=r['t'], x=hi, xlo=lo, xhi=hi, xmid=mi, y=round(g, 2), A=round(A, 1)))
    elif r['t'] > 125 and X:
        g = Mt - X[-1]; A = inv(US, g); snd.append(dict(t=r['t'], A=round(A, 1), how='unlocking to strike', ms=round(g, 2)))
rows = [   # the swing each test reads, per recording: [label, test, value, lo, hi, note] (References/VIDEOS.md, Measurements)
    ['s7VW3RiJ97E', 'sound', 212, 211, 218, 'four clicks, in beat'],
    ['s7VW3RiJ97E', 'sound', 209, 205, 213, 'five clicks, 12° out of beat'],
    ['We1dLNXiBj0 running (2:11-2:53)', 'sound', 294, 290, 302, 'unlocking to strike, 8 stretches'],
    ['We1dLNXiBj0 at 2:03 (still rising)', 'video', 267, 244, 267, 'four readings 244-267; 267 likeliest'],
    ['We1dLNXiBj0 at 2:03 (still rising)', 'sound', 286, 276, 296, 'strike to lock at 2:05, ±0.3 ms'],
    ['We1dLNXiBj0 settling (extrapolated)', 'video', 292, 280, 311, 'averaged build-up law'],
    ['xDKFZaY88cM', 'sound', 195, 180, 210, 'rough: echoing room, edited video'],
]
XM = json.load(open(os.path.join(TOOLS, 'swing.json'), encoding='utf-8'))['xM_mxtGfeqQ']   # a second movement, recovering after handling (12 October 2026)
DATA = dict(xm=dict(pts=XM['A_t'], fit=XM['fit'], curves={k: v['curve'] for k, v in D['xm'].items()}, TF={k: v['TF'] for k, v in D['xm'].items()}, s={k: v['s'] for k, v in D['xm'].items()}), model_sl=model_sl, old_sl=old_sl, pts=pts, snd=snd, vid=vid, start={k: v['curve'] for k, v in D['start'].items()}, startTF={k: v['TF'] for k, v in D['start'].items()}, rows=rows)

def figures():   # the average beat through We1dLNXiBj0's start, stretch by stretch (needs the recording)
    sys.path.insert(0, TOOLS); import acoustic as A; import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    e = A.env(A.audio(A.find('We1dLNXiBj0')), A.BANDS[A.TB]); fig, ax = plt.subplots(figsize=(9.5, 7.5))
    for j, t0 in enumerate([62, 74, 80, 86, 92, 98, 104, 110, 116, 122, 140, 160]):
        sg = e[int(t0 * A.FS):int((t0 + 6) * A.FS)]; c, ok, P, st = A.beats(sg); tt, L = A.mean_db(sg, c[ok]); s = tt < 30
        t, l = tt[s], L[s]; x = t - t[np.argmax(l)]; off = -j * 14; k = (x > 18) & (x < 22); va = vat(t0 + 3, 'mid')
        ax.plot(x[x < 22], l[x < 22] + off, color='#2a78d6', lw=1)
        ax.text(22.6, np.median(l[k]) + off, f'{int((t0 + 3) // 60)}:{int((t0 + 3) % 60):02d}  ' + (f'video {va:.0f}°' if va == va else 'after the video'), fontsize=8.5, color='#52514e', va='center')
    ax.axvline(0, color='#999', lw=.8, ls=':'); ax.set_xlim(-20, 31); ax.set_yticks([]); ax.set_xticks(range(-20, 25, 5)); ax.set_xlabel('ms from the loudest click (the strike)')
    ax.set_title('We1dLNXiBj0: the average beat (4-12 kHz, dB) in 6-s stretches through the start-up\nthe unlocking (left) and the lock (right) close in on the strike as the swing grows', fontsize=10)
    for sp in ('top', 'right', 'left'): ax.spines[sp].set_visible(False)
    plt.tight_layout(); plt.savefig(os.path.join(HERE, 'assets', 'we1d_stretches.png'), dpi=110); print('drew assets/we1d_stretches.png')

def local(out):   # the fuller copy: the repository's assets, plus clips cut from the recordings and swing.py's frames
    import imageio_ffmpeg, cv2; FF = imageio_ffmpeg.get_ffmpeg_exe(); A = os.path.join(out, 'assets'); os.makedirs(A, exist_ok=True)
    for f in os.listdir(os.path.join(HERE, 'assets')): shutil.copy(os.path.join(HERE, 'assets', f), A)
    slow = ['-af', 'atempo=0.5,atempo=0.5,atempo=0.5']   # 8 times slower, the pitch kept: one beat's clicks heard apart
    for f, t, d, name, x in [('s7VW3RiJ97E', 5, 10, 's7VW_10s', []), ('s7VW3RiJ97E', 5, 1, 's7VW_beat_slow8', slow), ('We1dLNXiBj0', 54, 12, 'We1d_start', []),
                             ('We1dLNXiBj0', 140, 10, 'We1d_running', []), ('We1dLNXiBj0', 150, 1, 'We1d_beat_slow8', slow), ('xDKFZaY88cM', 10, 10, 'xDK_10s', []),
                             ('XJQCgMV_GA8', 1, 10, 'XJQ_10s', []), ('FpolZSipVmQ', 10, 10, 'Fpol_10s', [])]:
        src = os.path.join(VID, f'run_{f}.mkv'); subprocess.run([FF, '-v', 'error', '-y', '-ss', str(t), '-t', str(d), '-i', src, '-vn', '-ac', '1', '-ar', '48000', *x, '-c:a', 'libmp3lame', '-b:a', '128k', os.path.join(A, name + '.mp3')], check=True)
    cap = cv2.VideoCapture(os.path.join(VID, 'run_We1dLNXiBj0.mkv'))
    def grab(t): cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); return cap.read()[1]
    for src, d, w in [(os.path.join(VID, 'swing', 'overlay_We1dLNXiBj0.jpg'), 'overlay_We1dLNXiBj0.jpg', 1700), (os.path.join(VID, 'swing', 'we_sd.png'), 'sweep_band.jpg', 1000),
                      (os.path.join(VID, 'swing', 'apstack.png'), 'apstack.jpg', 1400), (grab(30), 'we1d_frame.jpg', 1000)]:
        im = cv2.imread(src) if isinstance(src, str) else src; h, ww = im.shape[:2]
        if ww > w: im = cv2.resize(im, (w, int(h * w / ww)), interpolation=cv2.INTER_AREA)
        cv2.imwrite(os.path.join(A, d), im, [cv2.IMWRITE_JPEG_QUALITY, 85])
    cap = cv2.VideoCapture(os.path.join(VID, 'run_s7VW3RiJ97E.mkv')); im = grab(5); cv2.imwrite(os.path.join(A, 's7vw_frame.jpg'), cv2.resize(im, (1000, int(im.shape[0] * 1000 / im.shape[1]))), [cv2.IMWRITE_JPEG_QUALITY, 85])

if __name__ == '__main__':
    a = sys.argv[1:]
    if '--figures' in a: figures()
    out = a[a.index('--local') + 1] if '--local' in a else HERE; loc = '--local' in a
    t = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read().replace('/*DATA*/null', json.dumps(DATA))
    t = re.sub(r'<!--R.*?R-->', '', t, flags=re.S).replace('<!--L-->', '').replace('<!--/L-->', '') if loc else \
        re.sub(r'<!--L-->.*?<!--/L-->', '', t, flags=re.S).replace('<!--R', '').replace('R-->', '')
    if loc: os.makedirs(out, exist_ok=True); local(out)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8', newline='\n').write(t)
    print('wrote', os.path.join(out, 'index.html'), f'({len(pts)} interval points, {len(snd)} sound swings)')
