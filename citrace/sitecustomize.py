"""ci.py's trace of what a step reads, for Python (ci.py puts this folder on PYTHONPATH with MC_TRACE, a folder, and MC_TRACE_ROOT, the repository):
every file opened under the repository is appended to MC_TRACE/py-PID.txt as 'r PATH' (read) or 'w PATH' (written), and every glob as 'g DIR|PATTERN'.
A module imported from its bytecode cache is recorded as its source (__pycache__/x.cpython-313.pyc is x.py: the .py isn't opened when its .pyc is fresh).
browser.py adds the files the page loads (Playwright's requests) through rec(). Nothing happens without MC_TRACE."""
import os,sys
D=os.environ.get('MC_TRACE');R=os.environ.get('MC_TRACE_ROOT')
_seen=set();_f=None;_busy=False
def rec(k,p,pat=None):
    global _f,_busy
    if not (D and R) or _busy:return
    try:
        if isinstance(p,int) or p is None:return
        if isinstance(p,bytes):p=os.fsdecode(p)
        p=os.path.normcase(os.path.abspath(os.fspath(p)))
    except Exception:return
    if not p.startswith(_R):return
    if k!='g' and p.endswith('.pyc') and os.sep+'__pycache__'+os.sep in p:   # the module's source
        d,n=os.path.split(p);p=os.path.join(os.path.dirname(d),n.split('.')[0]+'.py')
    if pat is not None:p+='|'+pat
    if (k,p) in _seen:return
    _seen.add((k,p));_busy=True
    try:
        if _f is None:_f=open(os.path.join(D,f'py-{os.getpid()}.txt'),'a',encoding='utf-8')
        _f.write(f'{k} {p}\n');_f.flush()
    except Exception:pass
    finally:_busy=False
if D and R:
    _R=os.path.normcase(os.path.abspath(R))
    _W=os.O_WRONLY|os.O_RDWR|os.O_APPEND|os.O_CREAT
    def _hook(ev,a):
        if ev=='open':
            p,mode,flags=a
            rec('w' if (mode and any(c in mode for c in 'wax+')) or (mode is None and isinstance(flags,int) and flags&_W) else 'r',p)
        elif ev=='glob.glob' and a and isinstance(a[0],str):rec('g',os.path.dirname(a[0]) or '.',os.path.basename(a[0]))
    sys.addaudithook(_hook)
    import pathlib
    for _n in('glob','rglob'):
        def _wrap(f,n=_n):
            def g(self,pattern,*a,**k):
                if isinstance(pattern,str):rec('g',self,('**/' if n=='rglob' else '')+pattern)
                return f(self,pattern,*a,**k)
            return g
        setattr(pathlib.Path,_n,_wrap(getattr(pathlib.Path,_n)))
