"""Bartosz Ciechanowski's *Mechanical Watch* (https://ciechanow.ski/mechanical-watch/),
the essay's model, kept whole outside the repository and checked against a manifest.

The article (its text, scripts, styles, images and the watch's 3D model) carries no
licence, so it is all rights reserved: the repository is public, and like the videos
(`video.py`) the copy stays outside it. What is tracked is the manifest,
`References/ciechanowski-mechanical-watch.json` (every file's path, size and sha256,
the date fetched), and `References/CIECHANOWSKI.md`, what each file is.

    python ciechanowski.py fetch [--write]   # download every file the page loads into
                                             # $MC_REF/ciechanowski-mechanical-watch
                                             # (default ~/mc-ref), compare with the manifest
    python ciechanowski.py check             # the local copy against the manifest; exit 1 if
                                             # a file is missing or differs

The files are found from the page itself: its src/href and og:image, the stylesheets'
url(), the scripts' quoted /models/ and /images/ paths, so a file the article gains is
fetched too. If the site has changed since the manifest, `fetch` keeps the old copy
(renamed with its date) beside the new one; `--write` then records the new manifest.
A few seconds with the network (about 6.6 MB).
"""
import argparse, datetime, hashlib, json, os, re, shutil, sys, tempfile, urllib.parse, urllib.request

BASE = 'https://ciechanow.ski/'
PAGE = BASE + 'mechanical-watch/'
NAME = 'ciechanowski-mechanical-watch'
DIR = os.path.join(os.environ.get('MC_REF', os.path.expanduser('~/mc-ref')), NAME)
MAN = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'References', NAME + '.json')
EXT = r'\.(?:css|js|png|jpe?g|gif|svg|webp|ico|dat|bin|glb|gltf|json|mp4|webm|woff2?|ttf)'

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as r: return r.read()

def local(url):
    """The site path of a URL on ciechanow.ski, or None."""
    u = urllib.parse.urlparse(url)
    if u.netloc not in ('', 'ciechanow.ski', 'www.ciechanow.ski'): return None
    p = u.path.lstrip('/')
    return p if re.search(EXT + '$', p, re.I) else None

def discover(html):
    """Every site file the page loads: from its markup, then its stylesheets and scripts."""
    found, todo = {'index.html': PAGE}, []
    for m in re.finditer(r'(?:src|href|content)="([^"]+)"', html):
        p = local(urllib.parse.urljoin(PAGE, m.group(1)))
        if p: found[p] = BASE + p; todo.append(p)
    seen = set()
    while todo:
        p = todo.pop()
        if p in seen or not re.search(r'\.(css|js)$', p): continue
        seen.add(p); txt = get(BASE + p).decode('utf-8', 'replace')
        refs = re.findall(r'url\(\s*[\'"]?([^\'")]+)', txt) if p.endswith('.css') else \
            re.findall(r'["\'`](\.{0,2}/?(?:models|images|js|css)/[^"\'`\s]+|\./[\w.-]+\.js)["\'`]', txt)
        for r in refs:
            q = local(urllib.parse.urljoin(BASE + p, r))
            if q and q not in found: found[q] = BASE + q; todo.append(q)
    return dict(sorted(found.items()))

def sha(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()

def inventory(root):
    out = {}
    for d, _, fs in os.walk(root):
        for f in fs:
            fp = os.path.join(d, f); out[os.path.relpath(fp, root).replace(os.sep, '/')] = {'bytes': os.path.getsize(fp), 'sha256': sha(fp)}
    return dict(sorted(out.items()))

def load():
    if not os.path.exists(MAN): return None
    with open(MAN, encoding='utf-8') as f: return json.load(f)

def compare(man, inv):
    old = man['files'] if man else {}
    bad = [f'missing  {p}' for p in old if p not in inv]
    bad += [f'changed  {p}' for p in old if p in inv and inv[p]['sha256'] != old[p]['sha256']]
    bad += [f'new      {p}' for p in inv if p not in old]
    return bad

def fetch(write):
    tmp = tempfile.mkdtemp(prefix='cw_')
    try:
        html = get(PAGE); files = discover(html.decode('utf-8', 'replace'))
        for p, url in files.items():
            fp = os.path.join(tmp, *p.split('/')); os.makedirs(os.path.dirname(fp), exist_ok=True)
            data = html if p == 'index.html' else get(url)
            with open(fp, 'wb') as f: f.write(data)
            print(f'{len(data):>9}  {p}')
        inv, man = inventory(tmp), load(); diff = compare(man, inv)
        print(f'{len(inv)} files, {sum(v["bytes"] for v in inv.values())} bytes')
        if os.path.isdir(DIR) and compare({'files': inventory(DIR)}, inv):
            keep = DIR + '-' + (man['fetched'] if man else datetime.date.today().isoformat()) + '-old'
            print(f'the site differs from the local copy: kept it as {keep}'); shutil.move(DIR, keep)
        if os.path.isdir(DIR): shutil.rmtree(DIR)
        shutil.copytree(tmp, DIR); print(f'local copy: {DIR}')
    finally: shutil.rmtree(tmp, ignore_errors=True)
    for d in diff: print(d)
    if write:
        with open(MAN, 'w', encoding='utf-8', newline='\n') as f:
            json.dump({'url': PAGE, 'fetched': datetime.date.today().isoformat(), 'files': inv}, f, indent=1); f.write('\n')
        print(f'wrote {os.path.normpath(MAN)}'); return 0
    if diff: print('the site differs from the manifest: check what changed, then fetch --write')
    return 1 if diff else 0

def check():
    man = load()
    if not man: print('no manifest: fetch --write first'); return 1
    if not os.path.isdir(DIR): print(f'no local copy at {DIR}: run fetch (or set MC_REF)'); return 1
    diff = compare(man, inventory(DIR))
    for d in diff: print(d)
    print(f'{len(man["files"])} files against the manifest of {man["fetched"]}: ' + ('differs' if diff else 'all match'))
    return 1 if diff else 0

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['fetch', 'check']); ap.add_argument('--write', action='store_true')
    a = ap.parse_args()
    sys.exit(fetch(a.write) if a.cmd == 'fetch' else check())
