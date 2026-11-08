"""The working copy of Bartosz Ciechanowski's *Mechanical Watch*
(https://ciechanow.ski/mechanical-watch/), the one we improve:
`marine-chronometer-source/mechanical-watch/`, made from the originals kept as fetched in
`References/ciechanowski-mechanical-watch/` (`ciechanowski.py check`), which are never edited.

    python mechanical_watch.py init     # make the working copy (refuses if it exists:
                                        # it holds our improvements)
    python mechanical_watch.py models   # rewrite only its models/watch_models.js from the
                                        # originals' .dat files
    python mechanical_watch.py compare [OUT] [--sections a,b]
                                        # the working copy opened from disk against the
                                        # originals served over http, in Chromium: console
                                        # errors, requests off the page, and each section's
                                        # screen (mw_{orig,work}_SECTION.png in OUT, default
                                        # the current directory) compared pixel by pixel;
                                        # exit 1 on an error or a request to analytics. It
                                        # reports the differing pixels and never fails on
                                        # them: the copy is meant to change. About 30 s.

`init` changes only what it takes for the page to open from disk (file://) as well as served:
  - the site-root paths (/css/, /js/, /images/, /favicon.ico) made relative, in the page
    and in base.css; watch.js's /models/ the same;
  - the header's Blog and Archives links, and the name, pointed at https://ciechanow.ski/;
  - the site's Google Analytics tag taken out (a copy shouldn't report to his account);
  - the 3D model's two .dat files embedded as base64 in models/watch_models.js (a <script>,
    which file:// allows where XMLHttpRequest doesn't), read by base.js's download_file
    before it falls back to the network.
About a second (the model is 6 MB; the script about 8.1 MB).
"""
import base64, json, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
ORIG = os.path.join(ROOT, 'References', 'ciechanowski-mechanical-watch')
WORK = os.path.join(ROOT, 'marine-chronometer-source', 'mechanical-watch')
DATS = ['models/watch_vertices.dat', 'models/watch_indices.dat']

def rd(p): return open(os.path.join(WORK, p), 'rb').read().decode('utf-8')
def wr(p, s): open(os.path.join(WORK, p), 'wb').write(s.encode('utf-8'))

def sub(s, old, new, n=1):
    """Replace old with new, failing unless it occurs exactly n times (the originals unchanged)."""
    c = s.count(old)
    if c != n: sys.exit(f'expected {n} of {old!r}, found {c}: the originals changed?')
    return s.replace(old, new)

def models():
    """models/watch_models.js: each .dat as base64 under its path, for download_file."""
    d = {p: base64.b64encode(open(os.path.join(ORIG, *p.split('/')), 'rb').read()).decode('ascii') for p in DATS}
    js = ('// Bartosz Ciechanowski\'s watch model (models/*.dat from https://ciechanow.ski/mechanical-watch/),\n'
          '// base64, so the page opens from disk. Written by tools/mechanical_watch.py models.\n'
          'window.WATCH_MODELS = ' + json.dumps(d, indent=0) + ';\n')
    os.makedirs(os.path.join(WORK, 'models'), exist_ok=True); wr('models/watch_models.js', js)
    print(f'models/watch_models.js: {len(js):,} bytes')

def init():
    if os.path.exists(WORK): sys.exit(f'{WORK} exists: it holds the improvements; not overwritten')
    shutil.copytree(ORIG, WORK, ignore=shutil.ignore_patterns('*.dat'))
    h = rd('index.html')
    a = h.index('<script async src="https://www.googletagmanager.com'); b = h.index('</script>', h.index('<script>', a)) + len('</script>')
    h = h[:a] + h[b:]
    h = sub(h, '<a href="/">Bartosz Ciechanowski</a>', '<a href="https://ciechanow.ski/">Bartosz Ciechanowski</a>')
    h = sub(h, '<a href="/">Blog</a>', '<a href="https://ciechanow.ski/">Blog</a>')
    h = sub(h, '<a href="/archives">Archives</a>', '<a href="https://ciechanow.ski/archives/">Archives</a>')
    for p in ('css/', 'js/', 'images/'): h = h.replace(f'"/{p}', f'"{p}')
    h = sub(h, 'href="/favicon.ico"', 'href="favicon.ico"')
    h = sub(h, '<script defer src="js/base.js"></script>', '<script src="models/watch_models.js"></script>\n  <script defer src="js/base.js"></script>')
    if '="/' in h.replace('href="/"', ''): print('note: root paths left in index.html:', sorted({h[i:i + 30] for i in range(len(h)) if h.startswith('="/', i)})[:5])
    wr('index.html', h)
    c = rd('css/base.css'); c = c.replace("url('/images/", "url('../images/"); wr('css/base.css', c)
    w = rd('js/watch.js')
    for p in DATS: w = sub(w, f'"/{p}"', f'"{p}"')
    wr('js/watch.js', w)
    j = rd('js/base.js')
    j = sub(j, 'function download_file(file_path, handler) {\n',
            'function download_file(file_path, handler) {\n'
            '    // The model embedded by models/watch_models.js, so the page also opens from disk.\n'
            '    let m = window.WATCH_MODELS && window.WATCH_MODELS[file_path];\n'
            '    if (m) {\n'
            '        let s = atob(m), b = new Uint8Array(s.length);\n'
            '        for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);\n'
            '        setTimeout(function() { handler(b.buffer); }, 0);\n'
            '        return;\n'
            '    }\n')
    wr('js/base.js', j)
    models(); print(f'working copy: {WORK}')

def compare(out, sections):
    import socket, subprocess, time, pathlib, numpy as np
    from PIL import Image
    from playwright.sync_api import sync_playwright
    out = pathlib.Path(out); s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], cwd=ORIG, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.5)
    bad = 0
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(args=['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']); res = {}
            for name, url in [('orig', f'http://127.0.0.1:{port}/'), ('work', pathlib.Path(WORK, 'index.html').as_uri())]:
                pg = b.new_page(viewport={'width': 1100, 'height': 900}); errs = []; reqs = []
                pg.on('console', lambda m, e=errs: e.append(m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
                pg.on('pageerror', lambda x, e=errs: e.append('pageerror: ' + str(x)))
                pg.on('request', lambda r, q=reqs: q.append(r.url))
                pg.goto(url); pg.wait_for_timeout(4000); res[name] = []
                for sec in sections:
                    pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()"); pg.mouse.wheel(0, 300); pg.wait_for_timeout(2500)
                    f = out / f'mw_{name}_{sec}.png'; pg.screenshot(path=str(f)); res[name].append(f)
                net = sorted({u.split('?')[0] for u in reqs if not u.startswith(('file:', f'http://127.0.0.1:{port}', 'data:'))})
                print(name, 'errors:', errs or 'none'); print(name, 'requests off the page:', net)
                if name == 'work': bad += len(errs) + sum('google-analytics' in u or 'googletagmanager' in u for u in net)
            for a, c in zip(res['orig'], res['work']):
                x = np.asarray(Image.open(a).convert('RGB'), float); y = np.asarray(Image.open(c).convert('RGB'), float)
                d = np.abs(x - y).max(2) > 24 if x.shape == y.shape else np.ones(1, bool)
                print(f'{a.stem[8:]:<20} pixels differing: {int(d.sum()):>7} ({d.mean() * 100:.2f} %)')
            b.close()
    finally: srv.terminate()
    return 1 if bad else 0

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'init': init()
    elif cmd == 'models': models()
    elif cmd == 'compare':
        a = sys.argv[2:]; secs = ['power', 'mainplate', 'automatic-winding']
        if '--sections' in a: i = a.index('--sections'); secs = a[i + 1].split(','); del a[i:i + 2]
        sys.exit(compare(a[0] if a else '.', secs))
    else: sys.exit(__doc__)
