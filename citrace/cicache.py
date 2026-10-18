"""ci.py's results cache, shared by every worktree (it lives in the repository's common git folder, .git/ci-cache/STEP/*.json).

A step that passed is stored with what it read: every file under the repository its processes opened (sitecustomize.py, trace.js, and browser.py for the
pages' loads), each file's sha256 (or '-' where it was missing), and the matches of every glob it ran. Its key is its command line, and for every step the
versions of Python, Node and the installed Python packages (Playwright, and so its Chromium, among them; for a browser step ci.py adds how WebGL is drawn). A later run, in this worktree or any
other, skips the step when an entry with the same key finds every file it read as it was then: the step would read the same bytes, so it would print the
same. Files git ignores (the tools' r_* outputs, __pycache__), files the step wrote itself and ci-logs/ are not inputs. Failures are never stored.

What the trace can't see: a file found only by listing a folder outside a glob (os.listdir: no CI step does), a file read by a program that isn't Python,
Node or the page (Blender's own Python: ci.py names rig.py for it, EXTRA), and anything off the repository (the network; MC_VIDEO). ci.py --no-cache runs
every step and stores what passes."""
import hashlib,json,os,pathlib,subprocess,sys,time
KEEP=40   # entries kept per step (other branches' states), the least recently used dropped
LOGMAX=65536   # the tail of a step's log kept with its entry, shown in ci-logs/STEP.txt when it is skipped
def sha(b):return hashlib.sha256(b).hexdigest()
def environment():
    """The tools' environment: what, besides the repository's files, decides what a step prints."""
    import importlib.metadata as md
    try:node=subprocess.run(['node','--version'],capture_output=True,text=True).stdout.strip()
    except OSError:node=''
    dists=sorted(f"{d.metadata['Name']}=={d.version}" for d in md.distributions() if d.metadata['Name'])
    return {'python':sys.version.split()[0],'node':node,'pkgs':sha('\n'.join(dists).encode())[:16],'os':sys.platform}
class Cache:
    def __init__(s,root,env):
        s.root=pathlib.Path(root);s.env=env;s.memo={}
        cd=subprocess.run(['git','rev-parse','--git-common-dir'],cwd=s.root,capture_output=True,text=True).stdout.strip()
        s.dir=(s.root/cd).resolve()/'ci-cache' if cd else None
        s.nroot=os.path.normcase(str(s.root.resolve()))
    def h(s,dep):
        """The state of one input now: 'r PATH' a file's sha256, '-' missing, 'dir' a folder; 'g DIR|PATTERN' the sorted matches."""
        if dep in s.memo:return s.memo[dep]
        k,p=dep.split(' ',1)
        if k=='g':
            d,pat=p.split('|',1);base=s.root/d
            try:v=sha('\n'.join(sorted(x.relative_to(base).as_posix().lower() for x in base.glob(pat))).encode())
            except (OSError,ValueError):v='-'
        else:
            f=s.root/p
            try:v=sha(f.read_bytes()) if f.is_file() else 'dir' if f.is_dir() else '-'
            except OSError:v='-'
        s.memo[dep]=v;return v
    def forget(s):s.memo.clear()
    def rel(s,p):
        p=os.path.normcase(os.path.abspath(p))
        return None if not p.startswith(s.nroot+os.sep) else p[len(s.nroot)+1:].replace(os.sep,'/')
    def collect(s,tdir,extra=()):
        """The inputs a step's trace folder records: {'r rel': state, 'g rel|pattern': state}."""
        rd,wr,gl=set(),set(),set()
        for f in pathlib.Path(tdir).glob('*.txt'):
            for line in f.read_text(encoding='utf-8',errors='replace').splitlines():
                k,_,p=line.partition(' ')
                if k=='g' or k=='l':
                    d,_,pat=p.partition('|');r=''if os.path.normcase(os.path.abspath(d))==s.nroot else s.rel(d)
                    if r is not None:gl.add(f'g {r}|{pat or "*"}')
                    continue
                r=s.rel(p)
                if r is None or r.startswith(('.git/','ci-logs/')) or r=='.git':continue
                (wr if k=='w' else rd).add(r)
        rd|={x for x in extra};rd-=wr
        ign=set()
        if rd:
            o=subprocess.run(['git','check-ignore','--stdin'],cwd=s.root,input='\n'.join(sorted(rd)),capture_output=True,text=True).stdout
            ign={l.strip().replace('\\','/') for l in o.splitlines() if l.strip()}
        deps={f'r {r}':None for r in sorted(rd-ign)};deps.update({g:None for g in sorted(gl)})
        s.forget()
        return {d:s.h(d) for d in deps}
    def lookup(s,name,key):
        """The stored pass of this step whose every input is as it was then, or None."""
        if not s.dir or not (s.dir/name).is_dir():return None
        es=sorted((s.dir/name).glob('*.json'),key=lambda f:-f.stat().st_mtime)
        for f in es:
            try:e=json.loads(f.read_text(encoding='utf-8'))
            except (OSError,ValueError):continue
            if e.get('key')!=key or e.get('env')!=s.env:continue
            if all(s.h(d)==v for d,v in e['deps'].items()):
                try:os.utime(f)
                except OSError:pass
                return e
        return None
    def why(s,name,key):
        """For --plan: the first input of the newest entry with this key that is no longer as it was."""
        if not s.dir or not (s.dir/name).is_dir():return 'never passed with the cache'
        for f in sorted((s.dir/name).glob('*.json'),key=lambda f:-f.stat().st_mtime):
            try:e=json.loads(f.read_text(encoding='utf-8'))
            except (OSError,ValueError):continue
            if e.get('key')!=key:continue
            if e.get('env')!=s.env:return 'the tools\' environment changed: '+', '.join(k for k in s.env if s.env[k]!=e['env'].get(k))
            for d,v in e['deps'].items():
                if s.h(d)!=v:return d[2:]+(' (new or gone)' if '-' in (v,s.h(d)) else '')
        return 'never passed with this command'
    def store(s,name,key,deps,dt,log,meta):
        if not s.dir:return
        d=s.dir/name;d.mkdir(parents=True,exist_ok=True)
        e={'step':name,'key':key,'env':s.env,'deps':deps,'time':round(dt),'when':time.strftime('%Y-%m-%d %H:%M'),**meta}
        try:t=pathlib.Path(log).read_text(encoding='utf-8',errors='replace')
        except OSError:t=''
        e['log']=t[-LOGMAX:]
        n=sha(json.dumps([key,s.env,deps],sort_keys=True).encode())[:24];tmp=d/f'.{n}.{os.getpid()}.tmp'
        tmp.write_text(json.dumps(e),encoding='utf-8');os.replace(tmp,d/f'{n}.json')
        old=sorted(d.glob('*.json'),key=lambda f:-f.stat().st_mtime)[KEEP:]
        for f in old:
            try:f.unlink()
            except OSError:pass
    def last_deps(s,name):
        """The inputs the step's most recent stored pass read (for --changed), or None."""
        if not s.dir or not (s.dir/name).is_dir():return None
        for f in sorted((s.dir/name).glob('*.json'),key=lambda f:-f.stat().st_mtime):
            try:return [d[2:].split('|')[0] for d in json.loads(f.read_text(encoding='utf-8'))['deps']]
            except (OSError,ValueError,KeyError):continue
        return None
