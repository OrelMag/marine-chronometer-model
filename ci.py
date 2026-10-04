"""The checks, run here: what CI would run, on this machine, so a branch is judged by results we can read.

    python ci.py              # the checks on every change (about 5 minutes): build, escapement, almanac, hairspring, physics, selfcontained, types, smoke, invariants, solids, exploded, book, audit
    python ci.py --quick      # without the browser checks (about 30 s): build, escapement, almanac, hairspring, types
    python ci.py --full       # and the slow geometry checks (about 11 minutes more): fine.py, maintaining.py, bom.py
    python ci.py --views [BASE]   # and every view rendered from BASE (default: where this branch left main; on main, HEAD) and from the working tree, the changed pixels per view
    python ci.py --only smoke,audit   # just those steps (names as in the summary)

Each step's output goes to ci-logs/STEP.txt (ignored by git); the summary lists each step, ok or FAIL, and its time, and the exit code is 1 if any step
failed. The browser checks run one after another, never side by side (two at once slow each other's page time, which some checks measure).
The build step checks that building changes none of the built copies (chronometer-working-model.html, dist/, site/): run it on the tree you mean to
commit, and commit what it writes. --views reports and never fails: most visual changes are intended; read the table, and r_vd_*.png in ci-logs/views
(the changes in red) for the views that changed."""
import hashlib,os,pathlib,shutil,subprocess,sys,tempfile,time
ROOT=pathlib.Path(__file__).resolve().parent
MC=ROOT/'marine-chronometer-source'/'chronometer-working-model'
TOOLS=MC/'tools'
LOGS=ROOT/'ci-logs'
PY=sys.executable
SITE='https://www.marinechronometermodel.com'
BUILT=[ROOT/'chronometer-working-model.html',MC/'dist',ROOT/'site']
TSC='typescript@5.9.3'
def arg(k):return sys.argv[sys.argv.index(k)+1] if k in sys.argv and sys.argv.index(k)+1<len(sys.argv) and not sys.argv[sys.argv.index(k)+1].startswith('--') else None
def digest():
    h={}
    for p in BUILT:
        for f in ([p] if p.is_file() else sorted(p.rglob('*')) if p.exists() else []):
            if f.is_file():h[str(f.relative_to(ROOT))]=hashlib.sha256(f.read_bytes()).hexdigest()
    return h
def run(cmd,cwd,log):
    with open(log,'w',encoding='utf-8',errors='replace') as o:
        o.write('$ '+' '.join(map(str,cmd))+'\n\n');o.flush()
        return subprocess.run(list(map(str,cmd)),cwd=cwd,stdout=o,stderr=subprocess.STDOUT).returncode
def build(log):
    before=digest();rc=run([PY,'build.py','--site-url',SITE],ROOT,log)
    if rc:return rc
    after=digest();ch=sorted(k for k in set(before)|set(after) if before.get(k)!=after.get(k))
    with open(log,'a',encoding='utf-8') as o:o.write('\nbuilt copies changed by building:\n'+''.join(f'  {k}\n' for k in ch) if ch else '\nbuilt copies up to date with the sources\n')
    return 1 if ch else 0
def tsc(log):
    cfg=MC/'jsconfig.json'
    if not cfg.exists():open(log,'w').write('no jsconfig.json on this branch: skipped\n');return None
    npx=shutil.which('npx') or shutil.which('npx.cmd')
    if not npx:open(log,'w').write('npx not found (Node.js): cannot check types\n');return 1
    return run([npx,'-y','-p',TSC,'tsc','-p',cfg],ROOT,log)
def base_commit():
    b=arg('--views')
    if b:return b
    head=subprocess.run(['git','rev-parse','HEAD'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
    mb=subprocess.run(['git','merge-base','main','HEAD'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
    return mb if mb and mb!=head else 'HEAD'
def views(log):
    b=base_commit();out=LOGS/'views';shutil.rmtree(out,ignore_errors=True);out.mkdir(parents=True)
    tmp=pathlib.Path(tempfile.mkdtemp(prefix='ci-base-'));wt=tmp/'base'
    try:
        rc=run(['git','worktree','add','--detach',wt,b],ROOT,LOGS/'views-base.txt')
        if rc:return rc
        page=wt/'marine-chronometer-source'/'chronometer-working-model'/'index.html'
        rc=run([PY,TOOLS/'views.py','base','--page',page],out,LOGS/'views-render-base.txt') or run([PY,TOOLS/'views.py','head'],out,LOGS/'views-render-head.txt')
        if rc:return rc
        r=subprocess.run([PY,TOOLS/'views.py','--diff','base','head','--md'],cwd=out,capture_output=True,text=True)
        with open(log,'w',encoding='utf-8') as o:o.write(f'the working tree against {b}\n\n'+r.stdout)
        return 0
    finally:
        subprocess.run(['git','worktree','remove','--force',wt],cwd=ROOT,capture_output=True);shutil.rmtree(tmp,ignore_errors=True)
STEPS=[('build',build,'quick'),
 ('escapement',lambda log:run(['node',TOOLS/'escapement.js'],ROOT,log),'quick'),
 ('almanac',lambda log:run(['node',TOOLS/'almanac.js'],ROOT,log),'quick'),
 ('hairspring',lambda log:run(['node',TOOLS/'hairspring.js'],ROOT,log),'quick'),
 ('physics',lambda log:run(['node',TOOLS/'physics.js'],ROOT,log),'quick'),   # the energy budget, the escape wheel's chase, temperature from the materials (under a second)
 ('selfcontained',lambda log:run([PY,'selfcontained.py'],TOOLS,log),'quick'),   # the page alone enough to make it and navigate with it (a few seconds)   # the hairspring's design: Phillips' terminal curves, the strip, the force on the pivots (about 12 s)   # the essay's almanac and sight reduction against JPL Horizons and skyfield (about 1 s)
 ('types',tsc,'quick'),
 ('smoke',lambda log:run([PY,'smoke.py'],TOOLS,log),'browser'),
 ('invariants',lambda log:run([PY,'invariants.py'],TOOLS,log),'browser'),
 ('solids',lambda log:run([PY,'solids.py'],TOOLS,log),'browser'),
 ('exploded',lambda log:run([PY,'exploded.py'],TOOLS,log),'browser'),
 ('book',lambda log:run([PY,'book.py'],TOOLS,log),'browser'),   # the build book checked as paper: each drawing at a stated scale, legible, on a page; each sheet's lines with material and fit (about 1 min)
 ('audit',lambda log:run([PY,'audit.py'],TOOLS,log),'browser'),
 ('audit-box',lambda log:run([PY,'audit.py','box'],TOOLS,log),'browser'),
 ('fine',lambda log:run([PY,'fine.py'],TOOLS,log),'full'),
 ('maintaining',lambda log:run([PY,'maintaining.py'],TOOLS,log),'full'),
 ('bom',lambda log:run([PY,'bom.py'],TOOLS,log),'full'),   # every part against the manual's parts list and its fits (about 6 minutes)
 ('views',views,'views')]
def main():
    only=arg('--only');want={'quick'}|(set() if '--quick' in sys.argv else {'browser'})|({'full'} if '--full' in sys.argv else set())|({'views'} if '--views' in sys.argv else set())
    steps=[s for s in STEPS if s[0] in only.split(',')] if only else [s for s in STEPS if s[2] in want]
    if only and len(steps)!=len(only.split(',')):print('no such step in',only,'; steps:',', '.join(s[0] for s in STEPS));return 2
    LOGS.mkdir(exist_ok=True);res=[];t00=time.time()
    br=subprocess.run(['git','rev-parse','--abbrev-ref','HEAD'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
    dirty=subprocess.run(['git','status','--porcelain','--untracked-files=no'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
    print(f'ci.py on {br}'+(' (uncommitted changes: they are what is checked)' if dirty else ''))
    for name,fn,_ in steps:
        t0=time.time();print(f'  {name:12s}',end=' ',flush=True)
        try:rc=fn(LOGS/f'{name}.txt')
        except Exception as e:rc=1;open(LOGS/f'{name}.txt','a').write(f'\n{type(e).__name__}: {e}\n')
        dt=time.time()-t0;res.append((name,rc,dt));print(f'{"skip" if rc is None else "ok  " if rc==0 else "FAIL"} {dt:6.0f} s'+('' if not rc else f'   ci-logs/{name}.txt'))
    bad=[n for n,rc,_ in res if rc];sk=[n for n,rc,_ in res if rc is None]
    if any(n=='views' and rc==0 for n,rc,_ in res):print('\nViews, '+(LOGS/'views.txt').read_text(encoding='utf-8')+'(changed pixels per view, 0 unchanged; the changes in red in ci-logs/views/r_vd_*.png)\n')
    print(f'{len(res)-len(bad)-len(sk)} of {len(res)} ok'+(f', {len(sk)} skipped ({", ".join(sk)})' if sk else '')+f' in {time.time()-t00:.0f} s'+(f'; failed: {", ".join(bad)}' if bad else ''))
    return 1 if bad else 0
if __name__=='__main__':sys.exit(main())
