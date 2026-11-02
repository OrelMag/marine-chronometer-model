"""hdraw.py: checks the Hamilton drawings' outlines in js/hdims.js (HD) and, for review, plots each beside its scan.

Reads HD through Node (no browser): every outline (an object with an `outline` list of exact segments, in mm, the sheet's own frame, datum 2.0000,2.0000 at 0,0).
Checks, exit 1 on a failure:
  - each arc's two end points lie on its radius to 0.0002 in (0.00508 mm);
  - each outline closes (a segment's end is the next one's start; the last one's, the first's, to 1e-6 mm);
  - each arc flagged tg (tangent to the next segment, where the sheet says so) leaves the same direction as the next one begins, within 1.5 deg
    (the table's four decimals give a small arc half a degree);
  - an arc's sweep is not 0 and its ends are not the same point.
Prints each outline's segments, sweeps, area (shoelace over a fine polyline of the arcs) and bounding box in inches.
  python hdraw.py [--plot [DIR]] [--only wps,ss]   (--plot writes r_hd_NAME.png: the outline, then the sheet's page from the NAWCC scan in
  References/Hamilton-original-drawings/ of the main checkout, MC_HD_PDFS the folder; for review only: the scans are never committed and nothing of them is kept in the repository.)
Without --plot it needs neither the scans nor matplotlib. About 1 s; --plot about 10 s."""
import json, math, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
HDIMS = os.path.join(HERE, '..', 'js', 'hdims.js')
TOL = 0.0002 * 25.4          # mm: the sheets' table is to 0.0001 in, an arc's ends within 0.0002 in of its radius
TGDEG = 1.5
SHEET = {'wp': '42010', 'wps': '42007', 'ss': '42016', 'sp': '42096', 'cl': '42005', 'hk2': '42002', 'hk3': '42003'}   # outline -> the drawing's number
NODE = r"""const fs=require('fs'),vm=require('vm');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(process.argv[1],'utf8')+';this.HD=HD;',c);process.stdout.write(JSON.stringify(c.HD))"""

def load():
    out = subprocess.run(['node', '-e', NODE, HDIMS], capture_output=True, text=True)
    if out.returncode: sys.exit('node failed: ' + out.stderr)
    return json.loads(out.stdout)

def ang(c, p): return math.atan2(p[1] - c[1], p[0] - c[0])
def sweep(s):
    a, b = ang(s['c'], s['p']), ang(s['c'], s['q']); d = b - a
    if s['ccw']:
        while d <= 0: d += 2 * math.pi
    else:
        while d >= 0: d -= 2 * math.pi
    return d
def tangent(s, end):
    """unit direction of travel at the segment's start (end=0) or end (end=1)"""
    if s['k'] == 'l':
        dx, dy = s['q'][0] - s['p'][0], s['q'][1] - s['p'][1]
    else:
        p = s['q'] if end else s['p']; rx, ry = p[0] - s['c'][0], p[1] - s['c'][1]
        dx, dy = (-ry, rx) if s['ccw'] else (ry, -rx)
    n = math.hypot(dx, dy); return dx / n, dy / n
def poly(seg, n=60):
    pts = []
    for s in seg:
        if s['k'] == 'l': pts.append(s['p']); continue
        a, d = ang(s['c'], s['p']), sweep(s)
        pts += [[s['c'][0] + s['r'] * math.cos(a + d * i / n), s['c'][1] + s['r'] * math.sin(a + d * i / n)] for i in range(n)]
    return pts

def check(name, seg):
    bad = []; k = len(seg)
    for i, s in enumerate(seg):
        nx = seg[(i + 1) % k]
        if math.dist(s['q'], nx['p']) > 1e-6: bad.append(f'{name}[{i}]: end {s["q"]} is not the next start {nx["p"]}')
        if s['k'] == 'a':
            for w, p in (('start', s['p']), ('end', s['q'])):
                e = abs(math.dist(p, s['c']) - s['r'])
                if e > TOL: bad.append(f'{name}[{i}]: arc {w} is {e / 25.4:.5f} in off its radius {s["r"] / 25.4:.4f}')
            if math.dist(s['p'], s['q']) < 1e-9 or abs(sweep(s)) < 1e-6: bad.append(f'{name}[{i}]: arc with no sweep')
            if s.get('tg'):
                t0, t1 = tangent(s, 1), tangent(nx, 0)
                dg = math.degrees(math.acos(max(-1, min(1, t0[0] * t1[0] + t0[1] * t1[1]))))
                if dg > TGDEG: bad.append(f'{name}[{i}]: flagged tangent to the next segment, but they meet at {dg:.2f} deg')
    return bad

def report(name, seg):
    pts = poly(seg); A = 0.5 * sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    print(f'{name}: {len(seg)} segments ({sum(s["k"] == "a" for s in seg)} arcs), area {abs(A) / 645.16:.5f} sq in ({"ccw" if A > 0 else "cw"}), box x {min(xs) / 25.4:+.4f}..{max(xs) / 25.4:+.4f} y {min(ys) / 25.4:+.4f}..{max(ys) / 25.4:+.4f} in from the datum')
    for i, s in enumerate(seg):
        print('   ', i, 'line' if s['k'] == 'l' else f'arc R {s["r"] / 25.4:.4f} sweep {math.degrees(sweep(s)):+.1f} deg{" tg" if s.get("tg") else ""}')

def plot(name, seg, outdir):
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    fig, ax = plt.subplots(1, 2, figsize=(13, 6)); pts = poly(seg)
    ax[0].plot([p[0] / 25.4 for p in pts] + [pts[0][0] / 25.4], [p[1] / 25.4 for p in pts] + [pts[0][1] / 25.4], 'k-', lw=1)
    for s in seg:
        if s['k'] == 'a': ax[0].plot(s['c'][0] / 25.4, s['c'][1] / 25.4, 'r+')
    ax[0].plot(0, 0, 'bo', ms=3); ax[0].set_aspect('equal'); ax[0].set_title(f'{name} ({SHEET.get(name, "")}), inches from the datum'); ax[0].grid(alpha=.3)
    pdf = None; root = os.environ.get('MC_HD_PDFS') or 'E:/Marine-Chronometer/References/Hamilton-original-drawings'
    if os.path.isdir(root):
        for f in os.listdir(root):
            if f.startswith(SHEET.get(name, '#')) and f.endswith('.pdf'): pdf = os.path.join(root, f)
    if pdf:
        import pymupdf
        pm = pymupdf.open(pdf)[0].get_pixmap(dpi=100); import numpy as np
        ax[1].imshow(np.frombuffer(pm.samples, np.uint8).reshape(pm.h, pm.w, pm.n)); ax[1].axis('off'); ax[1].set_title('the NAWCC scan (review only)')
    else: ax[1].axis('off'); ax[1].set_title('no scan found (MC_HD_PDFS)')
    p = os.path.join(outdir, f'r_hd_{name}.png'); fig.savefig(p, dpi=90, bbox_inches='tight'); plt.close(fig); print('wrote', p)

def main():
    a = sys.argv[1:]; only = a[a.index('--only') + 1].split(',') if '--only' in a else None
    pl = '--plot' in a; outdir = a[a.index('--plot') + 1] if pl and a.index('--plot') + 1 < len(a) and not a[a.index('--plot') + 1].startswith('--') else HERE
    HD = load(); bad = []; n = 0
    for k, v in HD.items():
        if isinstance(v, dict) and 'outline' in v and (only is None or k in only):
            n += 1; bad += check(k, v['outline']); report(k, v['outline'])
            if pl: plot(k, v['outline'], outdir)
    if n == 0: bad.append('no outline found in HD')
    print('\n'.join(['FAIL: ' + b for b in bad]) or f'ok: {n} outlines closed, arcs on their radii, tangents where flagged')
    sys.exit(1 if bad else 0)
main()
