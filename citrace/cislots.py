"""ci.py's share of the machine: slots every ci.py run on it takes from one pool, so runs in several worktrees at once queue instead of crowding the cores.

The slots are lock files in the repository's common git folder (.git/ci-slots/): cpu-0 ... (MC_CI_CPU of them, default the cores less four) and browser-0 ...
(MC_CI_BROWSERS, default 4). A step takes its slots before it starts (a step on processes of its own, POOL of them) and gives them back when it ends; the
operating system frees a run's locks if it dies. A step that measures the page's own time (smoke.py) takes every browser slot; while it waits it holds
solo-wait, and no run starts a browser step meanwhile, so it isn't starved."""
import os,pathlib,subprocess
if os.name=='nt':import msvcrt
else:import fcntl
class Lock:
    def __init__(s,path):s.path=path;s.f=None
    def take(s):
        if s.f:return True
        try:f=open(s.path,'a+b')
        except OSError:return False
        try:
            if os.name=='nt':f.seek(0);msvcrt.locking(f.fileno(),msvcrt.LK_NBLCK,1)
            else:fcntl.flock(f.fileno(),fcntl.LOCK_EX|fcntl.LOCK_NB)
        except OSError:f.close();return False
        s.f=f;return True
    def give(s):
        if not s.f:return
        try:
            if os.name=='nt':s.f.seek(0);msvcrt.locking(s.f.fileno(),msvcrt.LK_UNLCK,1)
            else:fcntl.flock(s.f.fileno(),fcntl.LOCK_UN)
        except OSError:pass
        s.f.close();s.f=None
    def busy(s):
        """Held by another run (not by this one)."""
        if s.f:return False
        if s.take():s.give();return False
        return True
class Slots:
    def __init__(s,root):
        cd=subprocess.run(['git','rev-parse','--git-common-dir'],cwd=root,capture_output=True,text=True).stdout.strip()
        d=(pathlib.Path(root)/cd).resolve()/'ci-slots';d.mkdir(exist_ok=True)
        s.ncpu=int(os.environ.get('MC_CI_CPU') or max(4,(os.cpu_count() or 8)-4));s.nbr=int(os.environ.get('MC_CI_BROWSERS') or 4)
        s.cpu=[Lock(d/f'cpu-{i}') for i in range(s.ncpu)];s.br=[Lock(d/f'browser-{i}') for i in range(s.nbr)];s.solo=Lock(d/'solo-wait')
    def take(s,kind,n):
        """n free slots of a kind ('cpu', 'browser'), all or none; None when they aren't free now."""
        got=[]
        for l in (s.cpu if kind=='cpu' else s.br):
            if l.f:continue
            if l.take():
                got.append(l)
                if len(got)==n:return got
        for l in got:l.give()
        return None
    def give(s,got):
        for l in got or ():l.give()
