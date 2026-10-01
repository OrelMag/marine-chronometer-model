"""The site's version and changelog, from CHANGELOG.md.

Each version is a heading `## M.mm.pp · YYYY-MM-DD` followed by `- ` lines (a line indented under one continues it).
`read()` parses and checks the file (versions strictly falling, dates never rising, every version with at least one line),
`stamp(html)` writes the top version and the rendered list into a page, `release(kind, notes)` adds the next version.
"""
import datetime,html as H,pathlib,re
FILE=pathlib.Path(__file__).resolve().parent/'CHANGELOG.md'
MONTHS='January February March April May June July August September October November December'.split()   # not strftime: the build must not depend on the locale
HEAD=re.compile(r'^## (\d+)\.(\d\d)\.(\d\d) · (\d{4}-\d\d-\d\d)$')

def fmt(v):return '%d.%02d.%02d'%v

def read(path=FILE):
    """[(version tuple, date, [lines])], newest first; exits with the reason if the file is malformed."""
    out=[];cur=None
    for n,l in enumerate(path.read_text(encoding='utf-8').splitlines(),1):
        m=HEAD.match(l)
        if m:cur=((int(m[1]),int(m[2]),int(m[3])),datetime.date.fromisoformat(m[4]),[]);out.append(cur);continue
        if l.startswith('## '):raise SystemExit(f'{path.name}:{n}: a version heading is "## M.mm.pp · YYYY-MM-DD", not {l!r}')
        if not cur or not l.strip():continue
        if l.startswith('- '):cur[2].append(l[2:].strip())
        elif l.startswith(' ') and cur[2]:cur[2][-1]+=' '+l.strip()
        else:raise SystemExit(f'{path.name}:{n}: under a version, only "- " lines (or lines indented under them): {l!r}')
    if not out:raise SystemExit(f'{path.name}: no versions')
    for a,b in zip(out,out[1:]):
        if not a[0]>b[0]:raise SystemExit(f'{path.name}: {fmt(a[0])} is listed above {fmt(b[0])}: newest first, each higher than the one below')
        if a[1]<b[1]:raise SystemExit(f'{path.name}: {fmt(a[0])} is dated before {fmt(b[0])}')
    for v,d,ls in out:
        if not ls:raise SystemExit(f'{path.name}: {fmt(v)} lists no changes')
    return out

def _inline(s):
    s=H.escape(s,quote=False)
    s=re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
    return re.sub(r'\*\*([^*]+)\*\*',r'<b>\1</b>',s)

def _entry(v,d,ls):
    return (f'<li><b>{fmt(v)}</b> <time datetime="{d.isoformat()}">{d.day} {MONTHS[d.month-1]} {d.year}</time><ul>'+
            ''.join(f'<li>{_inline(l)}</li>' for l in ls)+'</ul></li>')

def render(log,shown=3):
    """The newest `shown` versions, then the rest folded under Earlier versions."""
    h='<ol class="changes">'+''.join(_entry(*e) for e in log[:shown])+'</ol>'
    if log[shown:]:h+='<details class="changes-older"><summary>Earlier versions</summary><ol class="changes">'+''.join(_entry(*e) for e in log[shown:])+'</ol></details>'
    return h

def stamp(page,path=FILE):
    """Put the version in every <span data-ver>, the JSON-LD's softwareVersion, and the list between <!--changelog--> and <!--/changelog-->."""
    log=read(path);v=fmt(log[0][0])
    page,n=re.subn(r'(<span data-ver>)[^<]*(</span>)',lambda m:m[1]+v+m[2],page)
    page,k=re.subn(r'<!--changelog-->.*?<!--/changelog-->',lambda m:'<!--changelog-->'+render(log)+'<!--/changelog-->',page,flags=re.S)
    page=page.replace('"softwareVersion":"dev"',f'"softwareVersion":"{v}"')
    if not n or not k:raise SystemExit('the page has no <span data-ver> or no <!--changelog--> block for the version')
    return page,v

def release(kind,notes,path=FILE,today=None):
    """Add the next version (kind: major, minor or patch) with today's date and the given lines above the newest; returns it."""
    if not notes or not all(s.strip() for s in notes):raise SystemExit('--release needs at least one -m "what changed" line')
    log=read(path);M,m,p=log[0][0]
    v={'major':(M+1,0,0),'minor':(M,m+1,0),'patch':(M,m,p+1)}[kind]
    if v[1]>99 or v[2]>99:raise SystemExit(f'{fmt(v)} does not fit M.mm.pp: raise the next part instead')
    d=today or datetime.date.today()
    if d<log[0][1]:raise SystemExit(f'today ({d}) is before {fmt(log[0][0])} ({log[0][1]})')
    text=path.read_text(encoding='utf-8');i=text.index('\n## ')+1
    text=text[:i]+f'## {fmt(v)} · {d.isoformat()}\n'+''.join(f'- {s.strip()}\n' for s in notes)+'\n'+text[i:]
    path.write_text(text,encoding='utf-8',newline='\n');read(path)
    return fmt(v)
