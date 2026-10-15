"""The checks, run here: what CI would run, on this machine, so a branch is judged by results we can read.

    python ci.py              # the checks on every change (about 5 minutes): build, escapement, escgolden, wempe-escapement, wempe-mainspring, wempe-physics, wempe-strength, wempe-gearing, wempe-hairspring, wempe-thermal, wempe-gimbals, wempe-errorbudget, wempe-essaydata, almanac, hairspring, hairspring-fe, physics, tolerances, strength, dynamics, tripping, wempe-dynamics, wempe-tripping, gimbals, errorbudget, gearing, thermal, bench, rating, deviations, benchcheck, selfcontained, types, wempe-types, smoke, invariants, massprops, solids, exploded, overhaul, book, audit, and the Wempe's smoke, solids, audit, exploded and massprops
    python ci.py --quick      # without the browser checks (about 10 minutes, 15 October 2026): build, escapement, escgolden, wempe-escapement, wempe-hairspring, wempe-thermal, wempe-mainspring, wempe-physics, wempe-strength, wempe-gearing, wempe-gimbals, wempe-errorbudget, wempe-essaydata, almanac, hairspring, hairspring-fe, physics, tolerances, strength, dynamics, tripping, wempe-dynamics, wempe-tripping, gimbals, errorbudget, gearing, thermal, bench, rating, deviations, benchcheck, selfcontained, types, wempe-types
    python ci.py --full       # and the slow checks (about 44 minutes more): dynamics.js in full, tripping.js in full, the Wempe's dynamics.js and tripping.js in full, gimbals.js in full (the Hamilton's and the Wempe's), mainspring_friction.py (the model's strip, the build's Nivaflex and the sources' proportions), gearing.js in full, the Wempe's mainspring friction and gearing in full, fea.py, fine.py, maintaining.py, bom.py, gltf_check.py, blender_check.py
    python ci.py --views [BASE]   # and every view rendered from BASE (default: where this branch left main; on main, HEAD) and from the working tree, the changed pixels per view
    python ci.py --only smoke,audit   # just those steps (names as in the summary)

Each step's output goes to ci-logs/STEP.txt (ignored by git); the summary lists each step, ok or FAIL, and its time, and the exit code is 1 if any step
failed. The browser checks run one after another, never side by side (two at once slow each other's page time, which some checks measure).
The build step checks that building changes none of the built copies (chronometer-working-model.html, both models' dist/, site/): run it on the tree you mean to
commit, and commit what it writes. --views reports and never fails: most visual changes are intended; read the table, and r_vd_*.png in ci-logs/views
(the changes in red) for the views that changed."""
import hashlib,os,pathlib,shutil,subprocess,sys,tempfile,time
ROOT=pathlib.Path(__file__).resolve().parent
MC=ROOT/'marine-chronometer-source'/'chronometer-working-model'
TOOLS=MC/'tools'
LOGS=ROOT/'ci-logs'
PY=sys.executable
SITE='https://www.marinechronometermodel.com'
WE=ROOT/'marine-chronometer-source'/'wempe'   # the second model, the Wempe (tools/model.py: --model wempe)
BUILT=[ROOT/'chronometer-working-model.html',MC/'dist',WE/'dist',ROOT/'site']
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
def tsc(log,cfg=MC/'jsconfig.json'):
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
 ('escgolden',lambda log:run(['node',TOOLS/'escgolden.js'],ROOT,log),'quick'),   # makeEsc's fingerprint: the Hamilton's escapement bit for bit as escgolden.json has it (about 1 s)
 ('wempe-escapement',lambda log:run(['node',TOOLS/'wempe_escapement.js'],ROOT,log),'quick'),   # the Wempe's escapement in time: makeEsc with its settings, the measured drive, its bodies against wempe_inertia.json, the swing over the wind, the stone in no tooth (about 20 s)
 ('wempe-mainspring',lambda log:run([PY,'wempe_mainspring.py','--check'],TOOLS,log),'quick'),   # the Wempe's solved mainspring against 05 06_20's force, against wempe_mainspring.json (a second)
 ('wempe-physics',lambda log:run(['node',TOOLS/'wempe_physics.js'],ROOT,log),'quick'),   # the Wempe's energy budget, mainspring to balance: does it close (a second)
 ('wempe-strength',lambda log:run(['node',TOOLS/'wempe_strength.js'],ROOT,log),'quick'),   # the Wempe's loaded parts fully wound against their materials (a second)
 ('wempe-gearing',lambda log:run(['node',TOOLS/'gearing.js','--model','wempe','--quick'],ROOT,log),'quick'),   # the Wempe's meshes tooth by tooth, the swing over hours (about 30 s)
 ('wempe-hairspring',lambda log:run(['node',TOOLS/'wempe_hairspring.js'],ROOT,log),'quick'),   # the Wempe's hairspring as drawn: its length's readings, Phillips' conditions on 05 03_7's curve, the force on the pivots, its isochronism by elastica and beam elements, against WESC.SET.HS (about 20 s)
 ('wempe-thermal',lambda log:run(['node',TOOLS/'wempe_thermal.js'],ROOT,log),'quick'),   # the Wempe's cut bimetallic balance and steel spring in heat and cold against the 6MX's TU: the linear term, the masses' place, the secondary error (under a second)
 ('wempe-gimbals',lambda log:run(['node',TOOLS/'gimbals.js','--model','wempe','--quick'],ROOT,log),'quick'),   # the Wempe's case and ring as weighed (gimbals_wempe.json): levelled, their periods and resonance (about 12 s)
 ('wempe-errorbudget',lambda log:run(['node',TOOLS/'wempe_errorbudget.js'],ROOT,log),'quick'),   # the Wempe through the TU's 35-day trial, as adjusted and as drawn, and the error carried at sea (about 10 s)
 ('wempe-essaydata',lambda log:run(['node',TOOLS/'wempe_essaydata.js'],ROOT,log),'quick'),   # the Wempe essay's generated data (js/essaydata.js) and its quoted figures (data-wphys) against what the tools give (about 6 s)
 ('almanac',lambda log:run(['node',TOOLS/'almanac.js'],ROOT,log),'quick'),
 ('hairspring',lambda log:run(['node',TOOLS/'hairspring.js'],ROOT,log),'quick'),
 ('hairspring-fe',lambda log:run(['node',TOOLS/'hairspring-fe.js'],ROOT,log),'quick'),   # the hairspring at large swings by co-rotational beam elements, against hairspring.js's elastica (about 20 s)
 ('physics',lambda log:run(['node',TOOLS/'physics.js'],ROOT,log),'quick'),
 ('tolerances',lambda log:run(['node',TOOLS/'tolerances.js'],ROOT,log),'quick'),   # how closely the springs the sources don't size must be made, and that the sheets say so (under a second)   # the energy budget, the escape wheel's chase, temperature from the materials (under a second)
 ('strength',lambda log:run(['node',TOOLS/'strength.js'],ROOT,log),'quick'),   # every loaded part against its material's range, and the knocks it takes (under a second)
 ('dynamics',lambda log:run(['node',TOOLS/'dynamics.js','--quick'],ROOT,log),'quick'),   # the escapement integrated in time against the averaged model; the detent's return (about 15 s)
 ('tripping',lambda log:run(['node',TOOLS/'tripping.js','--quick'],ROOT,log),'quick'),   # the detent as a frame: its modes, and the frame made rigid running as dynamics.js does (about 10 s)
 ('wempe-dynamics',lambda log:run(['node',TOOLS/'dynamics.js','--model','wempe','--quick'],ROOT,log),'quick'),   # the Wempe's escapement integrated in time against makeEsc: the detent off its stone's corner, its stone riding the tooth it let go, its return (about 70 s)
 ('wempe-tripping',lambda log:run(['node',TOOLS/'tripping.js','--model','wempe','--quick'],ROOT,log),'quick'),   # the Wempe's detent as a frame (wempe_tripping.js): its modes, weighed against its solids, made rigid running as dynamics.js does (about 1 minute)
 ('gimbals',lambda log:run(['node',TOOLS/'gimbals.js','--quick'],ROOT,log),'quick'),   # the case and ring weighed on the model: their periods and resonance (about 20 s)
 ('errorbudget',lambda log:run(['node',TOOLS/'errorbudget.js'],ROOT,log),'quick'),   # as made (Monte Carlo) and the error carried at sea (about 6 s)
 ('gearing',lambda log:run(['node',TOOLS/'gearing.js','--quick'],ROOT,log),'quick'),   # the train's meshes tooth by tooth at their drawn centres, the swing over hours (about 15 s)
 ('thermal',lambda log:run(['node',TOOLS/'thermal.js'],ROOT,log),'quick'),   # 40-100 °F: the depths, endshake, the escapement (under a second)
 ('bench',lambda log:run(['node',TOOLS/'bench.js'],ROOT,log),'quick'),   # the tests on the bench from the model's figures, against bench.json (a second)
 ('rating',lambda log:run([PY,'rating.py','--demo'],TOOLS,log),'quick'),   # the rating of a made chronometer's log, on a made-up log with known figures (under a second)
 ('deviations',lambda log:run(['node',TOOLS/'deviations.js'],ROOT,log),'quick'),   # the build's deviations' numbers, against deviations.json (under a second)
 ('benchcheck',lambda log:run([PY,'benchcheck.py','--demo'],TOOLS,log),'quick'),   # a maker's bench measurements judged, on a made-up set with known faults (under a second)
 ('overwind',lambda log:run(['node',TOOLS/'overwind.js'],ROOT,log),'quick'),   # the key forced: against the stop and the wrong way (under a second)
 ('ratchets',lambda log:run(['node',TOOLS/'ratchets.js'],ROOT,log),'quick'),   # the ratchets and pawls: draw, strength, springs (under a second)
 ('sustaining',lambda log:run(['node',TOOLS/'sustaining.js'],ROOT,log),'quick'),   # the sustaining spring and the train run on it (about 15 s)
 ('motionwork',lambda log:run(['node',TOOLS/'motionwork.js'],ROOT,log),'quick'),   # the motion work's meshes, the hands' play, the cannon pinion's friction (about 7 s)
 ('wear',lambda log:run(['node',TOOLS/'wear.js'],ROOT,log),'quick'),   # wear at every sliding contact against its tolerance (a few seconds)
 ('traindyn',lambda log:run(['node',TOOLS/'traindyn.js'],ROOT,log),'quick'),   # the going train in time on sprung meshes (a few seconds)
 ('montecarlo',lambda log:run(['node',TOOLS/'montecarlo.js'],ROOT,log),'quick'),   # the whole movement to a maker's tolerances (about 30 s)
 ('estimates',lambda log:run(['node',TOOLS/'estimates.js'],ROOT,log),'quick'),   # the design values resting on estimates swept over their ranges, the bench's correction applied (about 4 min)
 ('selfcontained',lambda log:run([PY,'selfcontained.py'],TOOLS,log),'quick'),   # the page alone enough to make it and navigate with it (a few seconds)   # the hairspring's design: Phillips' terminal curves, the strip, the force on the pivots (about 12 s)   # the essay's almanac and sight reduction against JPL Horizons and skyfield (about 1 s)
 ('types',tsc,'quick'),
 ('wempe-types',lambda log:tsc(log,WE/'jsconfig.json'),'quick'),   # the Wempe's scripts, core.js and the shared kit among them (about 10 s)
 ('smoke',lambda log:run([PY,'smoke.py'],TOOLS,log),'browser'),
 ('invariants',lambda log:run([PY,'invariants.py'],TOOLS,log),'browser'),
 ('massprops',lambda log:run([PY,'massprops.py'],TOOLS,log),'browser'),   # the case and ring weighed on the model, against gimbals.json (about 30 s)
 ('mechanisms',lambda log:run([PY,'mechanisms.py'],TOOLS,log),'browser'),   # the mechanisms off the built model, against mechanisms.json (about 40 s)
 ('solids',lambda log:run([PY,'solids.py'],TOOLS,log),'browser'),
 ('exploded',lambda log:run([PY,'exploded.py'],TOOLS,log),'browser'),
 ('overhaul',lambda log:run([PY,'overhaul.py'],TOOLS,log),'browser'),
 ('book',lambda log:run([PY,'book.py'],TOOLS,log),'browser'),   # the build book checked as paper: each drawing at a stated scale, legible, on a page; each sheet's lines with material and fit (about 1 min)
 ('audit',lambda log:run([PY,'audit.py'],TOOLS,log),'browser'),
 ('audit-box',lambda log:run([PY,'audit.py','box'],TOOLS,log),'browser'),
 ('wempe-smoke',lambda log:run([PY,'smoke.py','--model','wempe'],TOOLS,log),'browser'),   # the Wempe's page: its views, sections, Spread, a pick, the opacity menu, a link; then its Essay tab (about 1½ minutes)
 ('wempe-solids',lambda log:run([PY,'solids.py','--model','wempe'],TOOLS,log),'browser'),
 ('wempe-audit',lambda log:run([PY,'audit.py','--model','wempe'],TOOLS,log),'browser'),
 ('wempe-exploded',lambda log:run([PY,'exploded.py','--model','wempe'],TOOLS,log),'browser'),
 ('wempe-massprops',lambda log:run([PY,'massprops.py','--model','wempe'],TOOLS,log),'browser'),   # the Wempe's case and ring weighed on the model, against gimbals_wempe.json (about 15 s)
 ('dynamics-full',lambda log:run(['node',TOOLS/'dynamics.js'],ROOT,log),'full'),   # and starting, the least drive, knocks and the ship's motion (about 1 minute)
 ('tripping-full',lambda log:run(['node',TOOLS/'tripping.js'],ROOT,log),'full'),   # and running as drawn, the estimates varied, the swing pushed, the knocks that trip it (about 8 minutes)
 ('wempe-dynamics-full',lambda log:run(['node',TOOLS/'dynamics.js','--model','wempe'],ROOT,log),'full'),   # the Wempe's: starting, the least drive, knocks, the ship's motion (about 2½ minutes)
 ('wempe-tripping-full',lambda log:run(['node',TOOLS/'tripping.js','--model','wempe'],ROOT,log),'full'),   # the Wempe's frame running as drawn, the estimates varied, the swing pushed, the knocks (about 2½ minutes)
 ('mainspring-friction',lambda log:run([PY,'mainspring_friction.py','--check'],TOOLS,log),'full'),   # the mainspring's coil friction, against mainspring_friction.json (about a minute)
 ('mainspring-variants',lambda log:run([PY,'mainspring_friction.py','--variants','--check'],TOOLS,log),'full'),   # the same for each strip mainspring.py --bound solved (the build's Nivaflex, the sources' proportions: mainspring_bound.json), against each mainspring_friction_NAME.json (about 6 minutes)
 ('wempe-mainspring-friction',lambda log:run([PY,'wempe_mainspring.py','--friction','--check'],TOOLS,log),'full'),   # the Wempe's mainspring's coil friction, against mainspring_friction_wempe.json (about a minute)
 ('wempe-gearing-full',lambda log:run(['node',TOOLS/'gearing.js','--model','wempe'],ROOT,log),'full'),   # and its depthing windows, against gearing_wempe.json (about 2 minutes)
 ('gimbals-full',lambda log:run(['node',TOOLS/'gimbals.js'],ROOT,log),'full'),   # and the seas, the stops, what reaches the escapement (about 2½ minutes)
 ('wempe-gimbals-full',lambda log:run(['node',TOOLS/'gimbals.js','--model','wempe'],ROOT,log),'full'),   # the Wempe's: the seas in both installations, the stops, what reaches the escapement through makeEsc (about 4 minutes)
 ('gearing-full',lambda log:run(['node',TOOLS/'gearing.js'],ROOT,log),'full'),   # and each mesh's depthing window, the holes' tolerance, against gearing.json (about 2 minutes)
 ('fea',lambda log:run([PY,'fea.py'],TOOLS,log),'full'),   # finite elements on the plates and bridges: the pivots' holes under the chain's and teeth's loads, against the depths' windows (about 3 minutes)
 ('fine',lambda log:run([PY,'fine.py'],TOOLS,log),'full'),
 ('maintaining',lambda log:run([PY,'maintaining.py'],TOOLS,log),'full'),
 ('bom',lambda log:run([PY,'bom.py'],TOOLS,log),'full'),   # every part against the manual's parts list and its fits (about 6 minutes)
 ('gltf',lambda log:run([PY,'gltf_check.py'],TOOLS,log),'full'),   # the export to Blender, written and read back (about 2 minutes)
 ('blender',lambda log:run([PY,'blender_check.py'],TOOLS,log),'full'),   # that file in Blender, with the rig, against its own clips (about 3 minutes; skipped where there is no Blender)
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
