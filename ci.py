"""The checks, run here: what CI would run, on this machine, so a branch is judged by results we can read.

    python ci.py              # the checks on every change (about 22 minutes: 18-23 over four runs on 15 October 2026, 57 steps, before the Wempe's four build checks added about 2 minutes): build, escapement, escgolden, wempe-escapement, wempe-mainspring, wempe-physics, wempe-sustaining, wempe-strength, wempe-gearing, wempe-hairspring, wempe-thermal, wempe-gimbals, wempe-errorbudget, wempe-tolerances, wempe-keystone, wempe-bench, wempe-montecarlo, wempe-essaydata, almanac, hairspring, hairspring-fe, physics, tolerances, strength, dynamics, tripping, wempe-dynamics, wempe-tripping, gimbals, errorbudget, gearing, thermal, bench, rating, deviations, benchcheck, selfcontained, types, wempe-types, smoke, invariants, massprops, solids, exploded, overhaul, book, audit, holecheck, and the Wempe's smoke, solids, audit, exploded, massprops and stopwork
    python ci.py --quick      # without the browser checks (about 12 minutes, 15 October 2026): build, escapement, escgolden, wempe-escapement, wempe-hairspring, wempe-thermal, wempe-mainspring, wempe-physics, wempe-sustaining, wempe-strength, wempe-gearing, wempe-gimbals, wempe-errorbudget, wempe-tolerances, wempe-keystone, wempe-bench, wempe-montecarlo, wempe-essaydata, almanac, hairspring, hairspring-fe, physics, tolerances, strength, dynamics, tripping, wempe-dynamics, wempe-tripping, gimbals, errorbudget, gearing, thermal, bench, rating, deviations, benchcheck, selfcontained, types, wempe-types
    python ci.py --full       # and the slow checks: estimates.js, dynamics.js in full, tripping.js's sections 2-5 (four steps), the Wempe's dynamics.js and tripping.js in full, gimbals.js in full (the Hamilton's and the Wempe's), mainspring_friction.py (the model's strip, the build's Nivaflex and the sources' proportions), gearing.js in full, the Wempe's mainspring friction and gearing in full, fea.py, fine.py, maintaining.py, bom.py, the Wempe's fine.py and bom.py, gltf_check.py, blender_check.py
    python ci.py --views [BASE]   # and every view rendered from BASE (default: where this branch left main; on main, HEAD) and from the working tree, the changed pixels per view
    python ci.py --only smoke,audit   # just those steps (names as in the summary)
    python ci.py --jobs 1     # one step at a time, as before 16 October 2026 (default: up to 12 at once, --browsers 3 of them with a browser)
    python ci.py --swiftshader   # the browser steps' WebGL in software, as before 16 October 2026 (default: on this machine's GPU, tools/browser.py)
    python ci.py --plan       # which steps would run and, for each, the input that changed since it last passed; nothing is run
    python ci.py --no-cache   # every step, cached or not (what passes is still stored)
    python ci.py --changed    # only the steps that read a file this branch changed since main (committed or not), cached or not
    python ci.py --fail-fast  # stop at the first failure: the running steps killed, the rest not started

The results cache (citrace/cicache.py, 18 October 2026): every step but build and views runs with its reads traced (citrace/: Python's opens and globs, Node's fs and
modules, the pages' loads), and a pass is stored in the repository's common git folder (.git/ci-cache/) with the sha256 of every file it read. A later run, in this
worktree or another, skips the step ("cached", its old log in ci-logs/STEP.txt) while every one of those files is byte for byte as it was, with the same command
and the same Python, Node and packages: a change to the Wempe reruns only the steps that read the Wempe's files. A step whose input changed while it ran isn't
stored. The machine's slots (citrace/cislots.py): every run takes its steps' CPU and browser slots from one pool in .git/ci-slots/ (MC_CI_CPU, default the cores
less four; MC_CI_BROWSERS, 4), so runs in several worktrees queue instead of crowding the cores; --no-slots leaves the pool out.

Each step's output goes to ci-logs/STEP.txt (ignored by git); the summary lists each step, ok or FAIL, and its time, and the exit code is 1 if any step
failed. The steps run side by side (the notes above parallel() below): without a browser up to --jobs at once (half the cores, at most 12), with one up to --browsers (3); smoke
and wempe-smoke, which run the train on the page's own frame time, with no other browser step beside them (two pages at once slow each other's page time).
The build step checks that building changes none of the built copies (chronometer-working-model.html, both models' dist/, site/): run it on the tree you mean to
commit, and commit what it writes. --views reports and never fails: most visual changes are intended; read the table, and r_vd_*.png in ci-logs/views
(the changes in red) for the views that changed."""
import hashlib,json,os,pathlib,shutil,subprocess,sys,tempfile,time
ROOT=pathlib.Path(__file__).resolve().parent
MC=ROOT/'marine-chronometer-source'/'chronometer-working-model'
TOOLS=MC/'tools'
LOGS=ROOT/'ci-logs'
PY=sys.executable
SITE='https://www.marinechronometermodel.com'
WE=ROOT/'marine-chronometer-source'/'wempe'   # the second model, the Wempe (tools/model.py: --model wempe)
BUILT=[ROOT/'chronometer-working-model.html',MC/'dist',WE/'dist',ROOT/'marine-chronometer-source'/'essay'/'dist',ROOT/'site']
TSC_PKG='typescript@5.9.3'
def arg(k):return sys.argv[sys.argv.index(k)+1] if k in sys.argv and sys.argv.index(k)+1<len(sys.argv) and not sys.argv[sys.argv.index(k)+1].startswith('--') else None
def digest():
    h={}
    for p in BUILT:
        for f in ([p] if p.is_file() else sorted(p.rglob('*')) if p.exists() else []):
            if f.is_file():h[str(f.relative_to(ROOT))]=hashlib.sha256(f.read_bytes()).hexdigest()
    return h
CT=ROOT/'citrace'   # the trace of what each step reads (sitecustomize.py, trace.js), the results cache (cicache.py) and the machine's slots (cislots.py)
sys.path.insert(0,str(CT))
import cicache,cislots
PROCS={}   # the running steps' processes, for --fail-fast
def run(cmd,cwd,log,sw=False,env=None):
    e=dict(env or os.environ)
    if sw:e.pop('MC_GL',None)
    with open(log,'w',encoding='utf-8',errors='replace') as o:
        o.write('$ '+' '.join(map(str,cmd))+'\n\n');o.flush()
        p=subprocess.Popen(list(map(str,cmd)),cwd=cwd,stdout=o,stderr=subprocess.STDOUT,env=e);PROCS[str(log)]=p
        try:return p.wait()
        finally:PROCS.pop(str(log),None)
def kill(p):   # a step's process and its children (Chromium, node workers)
    if os.name=='nt':subprocess.run(['taskkill','/T','/F','/PID',str(p.pid)],capture_output=True)
    else:p.kill()
def rel(c):   # a command's word as the cache keys it: paths from the repository, the interpreter as python
    c=str(c)
    if c==PY:return 'python'
    try:return pathlib.Path(c).resolve().relative_to(ROOT).as_posix()
    except (ValueError,OSError):return c
class R:
    """A step's command: run from cwd, with the browser's WebGL in SwiftShader when sw (MC_GL dropped); key() is what the cache keys it by."""
    def __init__(s,cmd,cwd,sw=False):s.cmd=cmd;s.cwd=cwd;s.sw=sw
    def __call__(s,log,env=None):return run(s.cmd,s.cwd,log,s.sw,env)
    def key(s):return json.dumps([[rel(c) for c in s.cmd],rel(s.cwd),s.sw])
class RE(R):
    """A step run with environment variables of its own (a Wempe build: MC_WREV=build40, build), which its cache key carries."""
    def __init__(s,cmd,cwd,env):super().__init__(cmd,cwd);s.env=env
    def __call__(s,log,env=None):return run(s.cmd,s.cwd,log,s.sw,{**(env or os.environ),**s.env})
    def key(s):return json.dumps([[rel(c) for c in s.cmd],rel(s.cwd),s.sw,s.env])
class TSC(R):
    """The type check of a jsconfig.json (skipped where the branch has none)."""
    def __init__(s,cfg):super().__init__(['npx','-y','-p',TSC_PKG,'tsc','-p',cfg],ROOT)
    def __call__(s,log,env=None):
        if not s.cmd[-1].exists():open(log,'w').write('no jsconfig.json on this branch: skipped\n');return None
        npx=shutil.which('npx') or shutil.which('npx.cmd')
        if not npx:open(log,'w').write('npx not found (Node.js): cannot check types\n');return 1
        return run([npx,*s.cmd[1:]],ROOT,log,env=env)
def build(log):
    before=digest();rc=run([PY,'build.py','--site-url',SITE],ROOT,log)
    if rc:return rc
    after=digest();ch=sorted(k for k in set(before)|set(after) if before.get(k)!=after.get(k))
    with open(log,'a',encoding='utf-8') as o:o.write('\nbuilt copies changed by building:\n'+''.join(f'  {k}\n' for k in ch) if ch else '\nbuilt copies up to date with the sources\n')
    return 1 if ch else 0
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
 ('escapement',R(['node',TOOLS/'escapement.js'],ROOT),'quick'),
 ('escgolden',R(['node',TOOLS/'escgolden.js'],ROOT),'quick'),   # makeEsc's fingerprint: the Hamilton's escapement bit for bit as escgolden.json has it (about 1 s)
 ('wempe-escapement',R(['node',TOOLS/'wempe_escapement.js'],ROOT),'quick'),   # the Wempe's escapement in time: makeEsc with its settings, the measured drive, its bodies against wempe_inertia.json, the swing over the wind, the stone in no tooth (about 20 s)
 ('wempe-mainspring',R([PY,'wempe_mainspring.py','--check'],TOOLS),'quick'),   # the Wempe's solved mainspring against 05 06_20's force, against wempe_mainspring.json (a second)
 ('wempe-physics',R(['node',TOOLS/'wempe_physics.js'],ROOT),'quick'),   # the Wempe's energy budget, mainspring to balance: does it close (a second)
 ('wempe-sustaining',R(['node',TOOLS/'wempe_sustaining.js'],ROOT),'quick'),   # the Wempe's maintaining spring from its drawn ring: banked, its push, the train on it while winding, escphys.js's figures (about 20 s)
 ('wempe-6mx',R(['node',TOOLS/'wempe_6mx.js'],ROOT),'quick'),   # the Soviet 6MX's physics against the drawings' (its jewels' shake, its first-drawn bodies): tools/wempe_6mx.json up to date (a second)
 ('wempe-makers',R([PY,'wempe_makers.py','--check'],TOOLS),'quick'),   # the Wempe's maker's sheets' data (wempe/js/makers.js) up to date with its bom.json, BOM.md, transcriptions, bench and tolerances (a second)
 ('wempe-strength',R(['node',TOOLS/'wempe_strength.js'],ROOT),'quick'),   # the Wempe's loaded parts fully wound against their materials (about 20 s, with wempe_sustaining.js)
 ('wempe-gearing',R(['node',TOOLS/'gearing.js','--model','wempe','--quick'],ROOT),'quick'),   # the Wempe's meshes tooth by tooth, the swing over hours (about 30 s)
 ('wempe-hairspring',R(['node',TOOLS/'wempe_hairspring.js'],ROOT),'quick'),   # the Wempe's hairspring as drawn: its length's readings, Phillips' conditions on 05 03_7's curve, the force on the pivots, its isochronism by elastica and beam elements, against WESC.SET.HS (about 20 s)
 ('wempe-thermal',R(['node',TOOLS/'wempe_thermal.js'],ROOT),'quick'),   # the Wempe's cut bimetallic balance and steel spring in heat and cold against the 6MX's TU: the linear term, the masses' place, the secondary error (under a second)
 ('wempe-gimbals',R(['node',TOOLS/'gimbals.js','--model','wempe','--quick'],ROOT),'quick'),   # the Wempe's case and ring as weighed (gimbals_wempe.json): levelled, their periods and resonance (about 12 s)
 ('wempe-errorbudget',R(['node',TOOLS/'wempe_errorbudget.js'],ROOT),'quick'),   # the Wempe through the TU's 35-day trial, as adjusted and as drawn, and the error carried at sea (about 10 s)
 ('wempe-tolerances',R(['node',TOOLS/'wempe_tolerances.js'],ROOT),'quick'),   # how closely the Wempe's unsized parts must be made: the mainspring, the detent's and gold springs, the preload, the lock, the hairspring, against tolerances_wempe.json (about 40 s)
 ('wempe-keystone',R(['node',TOOLS/'keystone.js','--model','wempe'],ROOT),'quick'),   # the Wempe's escapement against the 1904 text's rules (reports), against keystone_wempe.json (about 5 s)
 ('wempe-bench',R(['node',TOOLS/'wempe_bench.js'],ROOT),'quick'),   # the Wempe's tests on the bench from its figures, against bench_wempe.json (about 45 s)
 ('wempe-montecarlo',R(['node',TOOLS/'wempe_montecarlo.js'],ROOT),'quick'),   # the whole Wempe to a maker's tolerances, as made and after the bench, against montecarlo_wempe.json (about 30 s)
 ('wempe-build',R(['node',TOOLS/'wempe_build.js'],ROOT),'quick'),   # the Wempe's two builds for a navigator (1940s, 1950s): the swing, the lock's window, in time, pushed, knocked, the preload's floors, energy, strength, maintaining work, voyage, against wempe_build.json (about 4 min)
 ('wempe-tolerances-build40',RE(['node',TOOLS/'wempe_tolerances.js'],ROOT,{'MC_WREV':'build40'}),'quick'),   # the build40 build's tolerances, against tolerances_wempe_build40.json
 ('wempe-bench-build40',RE(['node',TOOLS/'wempe_bench.js'],ROOT,{'MC_WREV':'build40'}),'quick'),   # the build40 build's bench, against bench_wempe_build40.json
 ('wempe-montecarlo-build40',RE(['node',TOOLS/'wempe_montecarlo.js'],ROOT,{'MC_WREV':'build40'}),'quick'),   # the build40 build's montecarlo, against montecarlo_wempe_build40.json
 ('wempe-tolerances-build',RE(['node',TOOLS/'wempe_tolerances.js'],ROOT,{'MC_WREV':'build'}),'quick'),   # the build build's tolerances, against tolerances_wempe_build.json
 ('wempe-bench-build',RE(['node',TOOLS/'wempe_bench.js'],ROOT,{'MC_WREV':'build'}),'quick'),   # the build build's bench, against bench_wempe_build.json
 ('wempe-montecarlo-build',RE(['node',TOOLS/'wempe_montecarlo.js'],ROOT,{'MC_WREV':'build'}),'quick'),   # the build build's montecarlo, against montecarlo_wempe_build.json
 ('wempe-wear',R(['node',TOOLS/'wempe_wear.js'],ROOT),'quick'),   # the Wempe's sliding contacts' wear by Archard against the tolerance each eats, over a service interval (about 10 s)
 ('wempe-wear-build',RE(['node',TOOLS/'wempe_wear.js'],ROOT,{'MC_WREV':'build'}),'quick'),   # the 1950s build's wear: its strip's loads, its lock window
 ('wempe-overwind',R(['node',TOOLS/'wempe_overwind.js'],ROOT),'quick'),   # the Wempe's key forced: against the stop, the wrong way through the one-way key and the plain 1940 key (about 5 s)
 ('wempe-motionwork',R(['node',TOOLS/'wempe_motionwork.js'],ROOT),'quick'),   # the Wempe's motion work and up-and-down work: the meshes, their depthing windows and studs' holes, the cannon pinion as a bench test (about 1½-2½ min)
 ('wempe-estimates',R(['node',TOOLS/'wempe_estimates.js'],ROOT),'quick'),   # the Wempe's estimated values swept with the bench's correction: TF, the pivots' shake, the hairspring's length, its curve formed by hand (about 30 s)
 ('wempe-estimates-build',RE(['node',TOOLS/'wempe_estimates.js'],ROOT,{'MC_WREV':'build'}),'quick'),   # the 1950s build's estimates
 ('wempe-estimates-build40',RE(['node',TOOLS/'wempe_estimates.js'],ROOT,{'MC_WREV':'build40'}),'quick'),   # the 1940s build's estimates
 ('wempe-ratchets',R(['node',TOOLS/'wempe_ratchets.js'],ROOT),'quick'),   # the Wempe's pawls on their ratchets: the load's draw against friction, the teeth, faces and pivots, the clicks' springs at let-go, the maintaining detent's catch against the spring's travel (about 2 s)
 ('wempe-transmission',R(['node',TOOLS/'wempe_transmission.js'],ROOT),'quick'),   # the Wempe's whole transmission in time, every part that moves, nonlinear: the train on its meshes driving dynamics.js's escapement, the winds, the let-go, the stop (about 2 minutes)
 ('hamilton-transmission',R(['node',TOOLS/'hamilton_transmission.js'],ROOT),'quick'),   # the Hamilton's whole transmission in time, as the Wempe's: the train on its meshes driving dynamics.js's escapement, the winds, the let-go, the stop (about 70 s)
 ('wempe-essaydata',R(['node',TOOLS/'wempe_essaydata.js'],ROOT),'quick'),   # the Wempe essay's generated data (js/essaydata.js) and its quoted figures (data-wphys) against what the tools give (about 35 s)
 ('almanac',R(['node',TOOLS/'almanac.js'],ROOT),'quick'),
 ('mfgfit',R([PY,TOOLS/'mfgfit.py','demo'],ROOT),'quick'),   # the measure-trace skill's fitter on a synthetic plate, pin, collar and pillar, hand-traced and rendered: lines, arcs, fillets, notch, drills, pin stock, turned groups, the side profile (about 11 s)
 ('hairspring',R(['node',TOOLS/'hairspring.js'],ROOT),'quick'),
 ('hairspring-fe',R(['node',TOOLS/'hairspring-fe.js'],ROOT),'quick'),   # the hairspring at large swings by co-rotational beam elements, against hairspring.js's elastica (about 20 s)
 ('physics',R(['node',TOOLS/'physics.js'],ROOT),'quick'),
 ('tolerances',R(['node',TOOLS/'tolerances.js'],ROOT),'quick'),   # how closely the springs the sources don't size must be made, and that the sheets say so (under a second)   # the energy budget, the escape wheel's chase, temperature from the materials (under a second)
 ('strength',R(['node',TOOLS/'strength.js'],ROOT),'quick'),   # every loaded part against its material's range, and the knocks it takes (under a second)
 ('dynamics',R(['node',TOOLS/'dynamics.js','--quick'],ROOT),'quick'),   # the escapement integrated in time against the averaged model; the detent's return (about 15 s)
 ('tripping',R(['node',TOOLS/'tripping.js','--quick'],ROOT),'quick'),   # the detent as a frame: its modes, and the frame made rigid running as dynamics.js does (about 10 s)
 ('wempe-dynamics',R(['node',TOOLS/'dynamics.js','--model','wempe','--quick'],ROOT),'quick'),   # the Wempe's escapement integrated in time against makeEsc: the detent off its stone's corner, its stone riding the tooth it let go, its return (about 70 s)
 ('wempe-tripping',R(['node',TOOLS/'tripping.js','--model','wempe','--quick'],ROOT),'quick'),   # the Wempe's detent as a frame (wempe_tripping.js): its modes, weighed against its solids, made rigid running as dynamics.js does (about 1 minute)
 ('gimbals',R(['node',TOOLS/'gimbals.js','--quick'],ROOT),'quick'),   # the case and ring weighed on the model: their periods and resonance (about 20 s)
 ('errorbudget',R(['node',TOOLS/'errorbudget.js'],ROOT),'quick'),   # as made (Monte Carlo) and the error carried at sea (about 6 s)
 ('gearing',R(['node',TOOLS/'gearing.js','--quick'],ROOT),'quick'),   # the train's meshes tooth by tooth at their drawn centres, the swing over hours (about 15 s)
 ('thermal',R(['node',TOOLS/'thermal.js'],ROOT),'quick'),   # 40-100 °F: the depths, endshake, the escapement (under a second)
 ('bench',R(['node',TOOLS/'bench.js'],ROOT),'quick'),   # the tests on the bench from the model's figures, against bench.json (a second)
 ('rating',R([PY,'rating.py','--demo'],TOOLS),'quick'),   # the rating of a made chronometer's log, on a made-up log with known figures (under a second)
 ('deviations',R(['node',TOOLS/'deviations.js'],ROOT),'quick'),   # the build's deviations' numbers, against deviations.json (under a second)
 ('benchcheck',R([PY,'benchcheck.py','--demo'],TOOLS),'quick'),   # a maker's bench measurements judged, on a made-up set with known faults (under a second)
 ('overwind',R(['node',TOOLS/'overwind.js'],ROOT),'quick'),   # the key forced: against the stop and the wrong way (under a second)
 ('ratchets',R(['node',TOOLS/'ratchets.js'],ROOT),'quick'),   # the ratchets and pawls: draw, strength, springs (under a second)
 ('sustaining',R(['node',TOOLS/'sustaining.js'],ROOT),'quick'),   # the sustaining spring and the train run on it (about 15 s)
 ('motionwork',R(['node',TOOLS/'motionwork.js'],ROOT),'quick'),   # the motion work's meshes, the hands' play, the cannon pinion's friction (about 7 s)
 ('wear',R(['node',TOOLS/'wear.js'],ROOT),'quick'),   # wear at every sliding contact against its tolerance (a few seconds)
 ('traindyn',R(['node',TOOLS/'traindyn.js'],ROOT),'quick'),   # the going train in time on sprung meshes (a few seconds)
 ('montecarlo',R(['node',TOOLS/'montecarlo.js'],ROOT),'quick'),   # the whole movement to a maker's tolerances (about 30 s)
 ('selfcontained',R([PY,'selfcontained.py'],TOOLS),'quick'),   # the page alone enough to make it and navigate with it (a few seconds)   # the hairspring's design: Phillips' terminal curves, the strip, the force on the pivots (about 12 s)   # the essay's almanac and sight reduction against JPL Horizons and skyfield (about 1 s)
 ('types',TSC(MC/'jsconfig.json'),'quick'),
 ('wempe-dialtrace',R([PY,'dialtrace.py'],TOOLS),'quick'),   # the Wempe dial's printing traced off Wempe 3955's photograph, against js/dialface.js (about 13 s)
 ('wempe-dialtrace-lange',R([PY,'dialtrace.py','--dial','lange'],TOOLS),'quick'),   # the Lange dial's, against js/dialface_lange.js (about 20 s)
 ('wempe-dialsvg',R([PY,'dialsvg.py'],TOOLS),'quick'),   # the three dials' SVGs (wempe/dials/) against dial.js's face() as it draws them now (about 2 s)
 ('wempe-types',TSC(WE/'jsconfig.json'),'quick'),   # the Wempe's scripts, core.js and the shared kit among them (about 10 s)
 ('smoke',R([PY,'smoke.py'],TOOLS),'browser'),   # the Hamilton's page, then the essay's own (../essay/)
 ('essay-hamdata',R([PY,'essay_hamdata.py'],TOOLS),'browser'),   # the Model 21's figures the essay quotes (essay/js/hamdata.js) against the Hamilton's page (about 20 s)
 ('sitecheck',R([PY,'sitecheck.py'],TOOLS),'browser'),   # site/ through worker.js: every address, old and new, and where it leads (about 1½ minutes)
 ('invariants',R([PY,'invariants.py'],TOOLS),'browser'),
 ('massprops',R([PY,'massprops.py'],TOOLS),'browser'),   # the case and ring weighed on the model, against gimbals.json (about 30 s)
 ('mechanisms',R([PY,'mechanisms.py'],TOOLS),'browser'),   # the mechanisms off the built model, against mechanisms.json (about 40 s)
 ('solids',R([PY,'solids.py'],TOOLS),'browser'),
 ('exploded',R([PY,'exploded.py'],TOOLS),'browser'),
 ('overhaul',R([PY,'overhaul.py'],TOOLS),'browser'),
 ('book',R([PY,'book.py'],TOOLS),'browser'),   # the build book checked as paper: each drawing at a stated scale, legible, on a page; each sheet's lines with material and fit (about 1 min)
 ('wempe-book',R([PY,'book.py','--model','wempe'],TOOLS),'browser'),   # the Wempe's build book checked as paper, as the Hamilton's: every shown line on a sheet, each with its drawing's material or why it has none (about 1½ min)
 ('audit',R([PY,'audit.py'],TOOLS),'browser'),
 ('audit-box',R([PY,'audit.py','box'],TOOLS),'browser'),
 ('holecheck',R([PY,'holecheck.py'],TOOLS),'browser'),
 ('wempe-smoke',R([PY,'smoke.py','--model','wempe'],TOOLS),'browser'),   # the Wempe's page: its views, sections, Spread, a pick, the opacity menu, a link; then its Essay tab (about 1½ minutes)
 ('wempe-solids',R([PY,'solids.py','--model','wempe'],TOOLS),'browser'),
 ('wempe-audit',R([PY,'audit.py','--model','wempe'],TOOLS),'browser'),
 ('wempe-exploded',R([PY,'exploded.py','--model','wempe'],TOOLS),'browser'),
 ('wempe-audit-first',R([PY,'audit.py','--model','wempe','--rev','first'],TOOLS),'browser'),   # the same as first drawn (the page's Variants: the sheets of 1940-41), its coplanar faces under movement.first
 ('wempe-exploded-first',R([PY,'exploded.py','--model','wempe','--eval',"__mv.userData.setRev('first')"],TOOLS),'browser'),
 ('wempe-audit-3955',R([PY,'audit.py','--model','wempe','--rev','3955'],TOOLS),'browser'),   # Wempe 3955 as photographed (the first-drawn pieces but where its photographs differ: photocompare.py), its coplanar faces under movement.3955
 ('wempe-exploded-3955',R([PY,'exploded.py','--model','wempe','--eval',"__mv.userData.setRev('3955')"],TOOLS),'browser'),
 ('wempe-audit-box',R([PY,'audit.py','box','--model','wempe'],TOOLS),'browser'),   # the Wempe's case, gimbals and box, against its expected leftovers (about 10 s)
 ('wempe-audit-box-first',R([PY,'audit.py','box','--model','wempe','--rev','first'],TOOLS),'browser'),   # the box as first drawn (the 1940 key) (about 10 s)
 ('wempe-inertia',R([PY,'wempe_inertia.py'],TOOLS),'browser'),   # the Wempe's escapement's bodies weighed on its solids, against wempe_inertia.json (about 30 s)
  ('wempe-audit-box-6mx',R([PY,'audit.py','box','--model','wempe','--rev','6mx'],TOOLS),'browser'),   # the 6MX's case and boxes (box.6mx) (about 15 s)
 ('wempe-inertia-6mx',R([PY,'wempe_inertia.py','--rev','6mx'],TOOLS),'browser'),   # the 6MX's escapement bodies weighed (tools/wempe_inertia_6mx.json, which wempe_6mx.js reads)
 ('wempe-audit-6mx',R([PY,'audit.py','--model','wempe','--rev','6mx'],TOOLS),'browser'),   # the Soviet 6MX (the Variants' third version, Kirov No. 247), its coplanar faces under movement.6mx
 ('wempe-exploded-6mx',R([PY,'exploded.py','--model','wempe','--eval',"__mv.userData.setRev('6mx')"],TOOLS),'browser'),
 ('wempe-audit-box-1943',R([PY,'audit.py','box','--model','wempe','--rev','1943'],TOOLS),'browser'),   # the escapement of 1943's case and box: the drawings' (box.1943)
 ('wempe-audit-1943',R([PY,'audit.py','--model','wempe','--rev','1943'],TOOLS),'browser'),   # the escapement of 1943 as photographed (the Variants' fourth version: the 1943 block, its banking screw), its coplanar faces under movement.1943
 ('wempe-exploded-1943',R([PY,'exploded.py','--model','wempe','--eval',"__mv.userData.setRev('1943')"],TOOLS),'browser'),
 ('wempe-massprops',R([PY,'massprops.py','--model','wempe'],TOOLS),'browser'),   # the Wempe's case and ring weighed on the model, against gimbals_wempe.json (about 15 s)
 ('wempe-invariants',R([PY,'invariants.py','--model','wempe'],TOOLS),'browser'),   # the Wempe's arithmetic: its seven meshes turning as their teeth, the hands against the time, the up-and-down hand on the dial's scale, the fusee's hours, the balance as weighed (about 10 s)
 ('wempe-mechanisms',R([PY,'mechanisms.py','--model','wempe'],TOOLS),'browser'),   # the Wempe's pawls off the built model (the clicks, the maintaining detent, the set-up click), against mechanisms_wempe.json (about 15 s)
 ('wempe-holecheck',R([PY,'holecheck.py','--model','wempe'],TOOLS),'browser'),   # every round hole in the Wempe's parts populated or explained (checks.py's HOLE_EXPECTED), as last revised and as first drawn (1½-2¼ minutes)
 ('wempe-assembly',R([PY,'assembly.py','--model','wempe'],TOOLS),'browser'),   # the Wempe taken apart in the 1958 Soviet repair book's order for the MX, each step's parts drawn straight off, none through another (checks.py's ASSEMBLY; about 15 s)
 ('wempe-stopwork',R([PY,'wempe_stopwork.py'],TOOLS),'browser'),   # the Wempe's stop bar against its stop pin over the last 1.2 turns, chain and band: the stop holds full wind, never catches early, the pin bears on the bar's whole thickness (about 45 s)
 ('estimates',R(['node',TOOLS/'estimates.js'],ROOT),'full'),   # the design values resting on estimates swept over their ranges, the bench's correction applied (about 4 min; a sensitivity sweep, so with the slow checks)
 ('dynamics-full',R(['node',TOOLS/'dynamics.js'],ROOT),'full'),   # and starting, the least drive, knocks and the ship's motion (about 1 minute)
 ('tripping-run',R(['node',TOOLS/'tripping.js','--section','2'],ROOT),'full'),   # tripping.js's sections 2-5, side by side (0 and 1 are the quick tier's tripping): running as drawn and the estimates varied (about 2 minutes)
 ('tripping-push',R(['node',TOOLS/'tripping.js','--section','3'],ROOT),'full'),   # the swing pushed until a tooth gets past (about 1¼ minutes)
 ('tripping-knocks',R(['node',TOOLS/'tripping.js','--section','4'],ROOT),'full'),   # the knocks that trip it, the frame against the rigid detent (about 8 minutes: the longest step)
 ('tripping-bench',R(['node',TOOLS/'tripping.js','--section','5'],ROOT),'full'),   # the bench's figures (tripping.json) run again (about 5 minutes, on every core)
 ('wempe-dynamics-full',R(['node',TOOLS/'dynamics.js','--model','wempe'],ROOT),'full'),   # the Wempe's: starting, the least drive, knocks, the ship's motion (about 2½ minutes)
 ('wempe-tripping-full',R(['node',TOOLS/'tripping.js','--model','wempe'],ROOT),'full'),   # the Wempe's frame running as drawn, the estimates varied, the swing pushed, the knocks (about 2½ minutes)
 ('mainspring-friction',R([PY,'mainspring_friction.py','--check'],TOOLS),'full'),   # the mainspring's coil friction, against mainspring_friction.json (about a minute)
 *[(f'mainspring-{k}',R([PY,'mainspring_friction.py','--variants',k,'--check'],TOOLS),'full') for k in sorted(json.loads((TOOLS/'mainspring_bound.json').read_text(encoding='utf-8'))) if k!='model' and not k.startswith('fz')],   # the same for each strip mainspring.py --bound solved (the build's Nivaflex, the sources' proportions: mainspring_bound.json), against each mainspring_friction_NAME.json, a step each (not drive.js's fz* candidates: mainspring_friction.py --variants --fz) (about 1 minute each one after another, on 14 processes)
 ('wempe-mainspring-friction',R([PY,'wempe_mainspring.py','--friction','--check'],TOOLS),'full'),   # the Wempe's mainspring's coil friction, against mainspring_friction_wempe.json (about a minute)
 ('wempe-gearing-full',R(['node',TOOLS/'gearing.js','--model','wempe'],ROOT),'full'),   # and its depthing windows, against gearing_wempe.json (about 2 minutes)
 ('gimbals-full',R(['node',TOOLS/'gimbals.js'],ROOT),'full'),   # and the seas, the stops, what reaches the escapement (about 2½ minutes)
 ('wempe-gimbals-full',R(['node',TOOLS/'gimbals.js','--model','wempe'],ROOT),'full'),   # the Wempe's: the seas in both installations, the stops, what reaches the escapement through makeEsc (about 4 minutes)
 ('gearing-full',R(['node',TOOLS/'gearing.js'],ROOT),'full'),   # and each mesh's depthing window, the holes' tolerance, against gearing.json (about 2 minutes)
 ('fea',R([PY,'fea.py'],TOOLS),'full'),   # finite elements on the plates and bridges: the pivots' holes under the chain's and teeth's loads, against the depths' windows (about 3 minutes)
 ('wempe-fea',R([PY,'fea.py','--model','wempe'],TOOLS),'full'),   # the Wempe's plates, barrel bridge, fusee bush and intermediate bridge under load (checks.py's FEA; about 5 minutes)
 ('wempe-dfm',R([PY,'dfm.py','--model','wempe'],TOOLS),'full'),   # each machined piece of the Wempe against the machine: walls, slots, corners, holes, undercuts, sealed voids (fails only on a sealed void)
 ('fine',R([PY,'fine.py'],TOOLS),'full'),
 ('maintaining',R([PY,'maintaining.py'],TOOLS),'full'),
 ('wempe-maintaining',R([PY,'maintaining.py','--model','wempe'],TOOLS),'full'),   # the Wempe's maintaining work: its clicks, ratchet, detent and wire on the solids through run and wind; the page's own loop through two winds (the maintaining spring's drive); the stop work (1½-2¾ minutes)
 ('bom',R([PY,'bom.py'],TOOLS),'full'),   # every part against the manual's parts list and its fits (about 6 minutes)
 ('wempe-fine',R([PY,'fine.py','--model','wempe'],TOOLS),'full'),   # the Wempe's 0.05 mm interference over its escapement's phases, train and wind, against checks.py's EXPECTED (about 1¾ minutes)
 ('wempe-bom',R([PY,'bom.py','--model','wempe'],TOOLS),'full'),   # every Wempe part against its drawing list (wempe/bom.json) and its relations (about 4 minutes)
 ('wempe-fine-first',R([PY,'fine.py','--model','wempe','--eval',"__mv.userData.setRev('first')"],TOOLS),'full'),   # as first drawn (the first-drawn stud pin stood 0.05 off the stud unseen on main for want of it)
 ('wempe-bom-first',R([PY,'bom.py','--model','wempe','--eval',"__mv.userData.setRev('first')"],TOOLS),'full'),
 ('wempe-fine-3955',R([PY,'fine.py','--model','wempe','--eval',"__mv.userData.setRev('3955')"],TOOLS),'full'),   # Wempe 3955 as photographed
 ('wempe-bom-3955',R([PY,'bom.py','--model','wempe','--eval',"__mv.userData.setRev('3955')"],TOOLS),'full'),
 ('wempe-fine-6mx',R([PY,'fine.py','--model','wempe','--eval',"__mv.userData.setRev('6mx')"],TOOLS),'full'),   # the Soviet 6MX (its case and boxes too)
 ('wempe-bom-6mx',R([PY,'bom.py','--model','wempe','--eval',"__mv.userData.setRev('6mx')"],TOOLS),'full'),   # its lines with "rev", its 15 jewels
 ('wempe-fine-1943',R([PY,'fine.py','--model','wempe','--eval',"__mv.userData.setRev('1943')"],TOOLS),'full'),   # the escapement of 1943
 ('wempe-bom-1943',R([PY,'bom.py','--model','wempe','--eval',"__mv.userData.setRev('1943')"],TOOLS),'full'),
 ('gltf',R([PY,'gltf_check.py'],TOOLS,sw=True),'full'),   # the export to Blender, written and read back (about 2 minutes; in SwiftShader always: exported from a page drawn on the GPU, the Running clip starts the escape wheel 0.105° off, over blender's 0.1°)
 ('blender',R([PY,'blender_check.py'],TOOLS,sw=True),'full'),   # that file in Blender, with the rig, against its own clips (about 3 minutes; skipped where there is no Blender)
 ('wempe-gltf',R([PY,'gltf_check.py','--model','wempe'],TOOLS,sw=True),'full'),   # the Wempe's export to Blender (r_wempe.glb) and its STLs, written and read back (about 3½ minutes)
 ('wempe-blender',R([PY,'blender_check.py','--model','wempe'],TOOLS,sw=True),'full'),   # that file in Blender, with the rig, against its own clips (about 2½ minutes)
 ('views',views,'views')]
# Side by side (--jobs, --browsers): the steps without a browser on up to JOBS processes at once; those with one (Chromium through Playwright: the browser tier's and
# BROWSER below) on up to BROWSERS. SOLO steps measure the page's own time (the train run on frame time): no other browser step runs with them. Steps in one EXCL
# group write the same file or folder and never run together; AFTER: a step waits for the one it reads. build runs first, alone (every step reads what it builds),
# views last. The longest steps start first (their last times in ci-logs/times.json, else EST). --jobs 1 runs every step one after another, as before 16 October 2026.
# Every ci.py run on the machine also takes its steps' slots from one pool (citrace/cislots.py): runs in several worktrees queue instead of crowding the cores.
def tool(s):return s[1].cmd[1] if isinstance(s[1],R) and len(s[1].cmd)>1 and s[1].cmd[0]==PY else None
BROWSER={'fea','wempe-fea','wempe-dfm'}|{s[0] for s in STEPS if s[2]=='full' and tool(s) in('fine.py','bom.py','maintaining.py','gltf_check.py','blender_check.py')}   # the full tier's steps that open a page
SOLO={'smoke','wempe-smoke'}
EXCL={'wempe-dialtrace':'r_dial','wempe-dialtrace-lange':'r_dial','types':'npx','wempe-types':'npx',**{s[0]:'r_bom.json' for s in STEPS if tool(s)=='bom.py'}}   # bom.py writes tools/r_bom.json for either model; two npx -y at once race in npm's cache
AFTER={'blender':'gltf','wempe-blender':'wempe-gltf'}   # blender_check.py imports the r_model21.glb (r_wempe.glb) gltf_check.py writes
EXTRA={'blender':[MC/'blender'/'rig.py'],'wempe-blender':[MC/'blender'/'rig.py'],   # inputs the trace can't see: Blender's own Python runs the rig; sitecheck.py's server (Node, siteserve.mjs) reads site/ and worker.js
       'sitecheck':[ROOT/'worker.js',*[ROOT/'site'/f for f in('index.html','hamilton/index.html','essay/index.html','verification/build-verification/index.html','verification/real-chronometers/index.html','wempe/verification/index.html','sitemap.xml')]]}   # inputs the trace can't see: Blender's own Python runs the rig
POOL=6   # the steps that run on processes of their own (tripping.js's bench figures, the Wempe's tripping.js, mainspring.py's sweeps) run on POOL of them (MC_PROCS,
POOLED={'tripping-bench','wempe-tripping-full','wempe-build','mainspring-friction','wempe-mainspring-friction'}|{s[0] for s in STEPS if s[0].startswith('mainspring-') and s[0]!='mainspring-friction'}   # MC_MS_PROC), and count as POOL of the --jobs
EST={'wempe-fea':300,'wempe-dfm':600,'wempe-assembly':20,'wempe-transmission':200,'hamilton-transmission':90,'wempe-build':230,'wempe-maintaining':150,'wempe-holecheck':130,'wempe-essaydata':120,'tripping-knocks':520,'bom':510,'wempe-gearing-full':360,'tripping-bench':330,'wempe-bom':330,'smoke':300,'fea':260,'wempe-dynamics-full':220,
     'wempe-fine':190,'wempe-fine-first':190,'wempe-fine-6mx':190,'wempe-fine-1943':190,'wempe-bom-first':330,'wempe-bom-6mx':330,'wempe-bom-1943':330,'estimates':190,'wempe-tripping-full':180,'gimbals-full':180,'wempe-gimbals-full':170,'fine':150,'gearing-full':145,'tripping-run':130,'wempe-smoke':115,'gltf':110,'wempe-gltf':200,'wempe-blender':150}   # seconds: the medians of the worktrees' logs, 16 October 2026
def lane(name,tier):return 'browser' if tier=='browser' or name in BROWSER else 'cpu'
CACHE=None   # the results cache (cicache.Cache), unless --no-cache; KEYS: each step's key in it
KEYS={}
STOPPED=set()   # steps --fail-fast stopped
def trace_env(name):
    """The environment a step runs in with its reads traced into ci-logs/trace/STEP (citrace/)."""
    d=LOGS/'trace'/name;shutil.rmtree(d,ignore_errors=True);d.mkdir(parents=True)
    e=dict(os.environ);e['MC_TRACE']=str(d);e['MC_TRACE_ROOT']=str(ROOT)
    e['PYTHONPATH']=os.pathsep.join([str(CT)]+([e['PYTHONPATH']] if e.get('PYTHONPATH') else []))
    e['NODE_OPTIONS']=(e.get('NODE_OPTIONS','')+f' --require "{(CT/"trace.js").as_posix()}"').strip()
    return e,d
def isfile(p):
    try:return p.is_file()
    except (OSError,ValueError):return False
def go(name,fn):
    t0=time.time();traced=CACHE is not None and name in KEYS
    try:
        if traced:env,tdir=trace_env(name);rc=fn(LOGS/f'{name}.txt',env)
        else:rc=fn(LOGS/f'{name}.txt')
    except Exception as e:rc=1;open(LOGS/f'{name}.txt','a').write(f'\n{type(e).__name__}: {e}\n')
    dt=time.time()-t0
    if traced and rc==0 and name not in STOPPED:
        try:
            files=[p for p in EXTRA.get(name,[])]+[pathlib.Path(fn.cwd)/c for c in fn.cmd[1:] if not str(c).startswith('-') and isfile(pathlib.Path(fn.cwd)/c)]
            deps=CACHE.collect(tdir,[x for x in (CACHE.rel(str(f)) for f in files) if x])
            late=[d[2:] for d in deps if d[0]=='r' and (ROOT/d[2:]).is_file() and (ROOT/d[2:]).stat().st_mtime>t0]
            if late:open(LOGS/f'{name}.txt','a').write('\nci.py: not cached: inputs changed while the step ran: '+', '.join(late[:5])+'\n')
            else:CACHE.store(name,KEYS[name],deps,dt,LOGS/f'{name}.txt',{'branch':BRANCH,'commit':COMMIT})
        except Exception as e:open(LOGS/f'{name}.txt','a').write(f'\nci.py: not cached: {type(e).__name__}: {e}\n')
    return rc,dt
SLOTS=None   # the machine's slots (cislots.Slots)
def parallel(steps,jobs,browsers,report,ff=False):
    """Runs steps (name, fn, tier) side by side within the limits above, calling report(name, rc, dt) as each ends; with ff (--fail-fast) the first failure
    stops the rest: the running steps are killed (STOPPED) and the ones not started are left out."""
    import concurrent.futures as cf,json
    tf=LOGS/'times.json'
    try:last=json.loads(tf.read_text(encoding='utf-8'))
    except Exception:last={}
    os.environ.setdefault('MC_PROCS',str(POOL));os.environ.setdefault('MC_MS_PROC',str(POOL))
    w=lambda n:min(POOL,jobs) if n in POOLED else 1
    pend=sorted(steps,key=lambda s:(s[0] not in SOLO,-last.get(s[0],EST.get(s[0],30))));live={};done={};held_slots={};told=False;stop=False   # SOLO first: alone at the start, not waiting on the others
    take=lambda kind,n:[] if SLOTS is None else SLOTS.take(kind,n)
    with cf.ThreadPoolExecutor(max_workers=jobs+browsers) as ex:
        while pend or live:
            busy={n:lane(n,t) for n,t in live.values()};nb=sum(v=='browser' for v in busy.values());nc=sum(w(n) for n,v in busy.items() if v=='cpu');held=False;blocked=False
            waiting={s[0] for s in pend};other_solo=SLOTS is not None and SLOTS.solo.busy()   # another run's smoke waits for the browsers: leave them to it
            for s in ([] if stop else list(pend)):
                name,fn,tier=s;ln=lane(name,tier)
                if AFTER.get(name) in waiting|set(busy):continue
                if EXCL.get(name) and any(EXCL.get(n)==EXCL[name] for n in busy):continue
                if ln=='browser':
                    if held or nb>=browsers or any(n in SOLO for n in busy):continue
                    if name in SOLO:
                        if nb:held=True;continue   # no new browser step starts until it can: it isn't passed over
                        g=take('browser',SLOTS.nbr if SLOTS else 0)
                        if g is None:SLOTS.solo.take();held=True;blocked=True;continue   # every browser slot, the machine's other runs' too
                        if SLOTS:SLOTS.solo.give()
                    else:
                        if other_solo:continue
                        g=take('browser',1)
                        if g is None:blocked=True;continue
                    nb+=1
                else:
                    if nc+w(name)>jobs:continue
                    g=take('cpu',w(name))
                    if g is None:blocked=True;continue
                    nc+=w(name)
                held_slots[name]=g;pend.remove(s);waiting.discard(name);busy[name]=ln;live[ex.submit(go,name,fn)]=(name,tier)
            if stop:pend.clear()
            if not live:
                if not pend:break
                if not told:print('  (waiting for slots: other ci.py runs on this machine hold them)',flush=True);told=True
                time.sleep(2);continue
            fin,_=cf.wait(list(live),timeout=2 if blocked or held or other_solo else None,return_when=cf.FIRST_COMPLETED)
            for f_ in fin:
                name,_t=live.pop(f_);rc,dt=f_.result();done[name]=rc
                if SLOTS:SLOTS.give(held_slots.pop(name,None))
                report(name,rc,dt)
                if rc==0 and name not in STOPPED:last[name]=round(dt)
                if ff and rc and name not in STOPPED and not stop:
                    stop=True;STOPPED.update(n for n,_ in live.values())
                    for p in list(PROCS.values()):kill(p)
    tf.write_text(json.dumps(dict(sorted(last.items())),indent=1)+'\n',encoding='utf-8')
def git(*a):return subprocess.run(['git',*a],cwd=ROOT,capture_output=True,text=True).stdout.strip()
BRANCH=COMMIT=''
def blender_exe():
    exe=os.environ.get('MC_BLENDER')
    if not exe:
        for p in sorted(pathlib.Path(r'C:\Program Files\Blender Foundation').glob('Blender */blender.exe'),reverse=True):exe=str(p);break
    return exe or ''
def main():
    global CACHE,SLOTS,BRANCH,COMMIT
    only=arg('--only');want={'quick'}|(set() if '--quick' in sys.argv else {'browser'})|({'full'} if '--full' in sys.argv else set())|({'views'} if '--views' in sys.argv else set())
    steps=[s for s in STEPS if s[0] in only.split(',')] if only else [s for s in STEPS if s[2] in want]
    if only and len(steps)!=len(only.split(',')):print('no such step in',only,'; steps:',', '.join(s[0] for s in STEPS));return 2
    jobs=int(arg('--jobs') or min(12,max(2,(os.cpu_count() or 4)//2)));browsers=int(arg('--browsers') or 3)
    if '--swiftshader' not in sys.argv:os.environ.setdefault('MC_GL','gpu')   # the browser steps on this machine's GPU (tools/browser.py); SwiftShader with --swiftshader
    plan='--plan' in sys.argv;changed='--changed' in sys.argv;ff='--fail-fast' in sys.argv
    LOGS.mkdir(exist_ok=True);res=[];t00=time.time()
    BRANCH=git('rev-parse','--abbrev-ref','HEAD');COMMIT=git('rev-parse','--short','HEAD')
    dirty=git('status','--porcelain','--untracked-files=no')
    if '--no-slots' not in sys.argv and not plan:
        try:SLOTS=cislots.Slots(ROOT)
        except Exception as e:print('no machine slots:',e)
    print(f'ci.py on {BRANCH}'+(' (uncommitted changes: they are what is checked)' if dirty else '')+(f'; up to {jobs} steps at once, {browsers} of them with a browser' if jobs>1 else '; one step at a time')+('; WebGL on the GPU' if os.environ.get('MC_GL')=='gpu' else '; WebGL in SwiftShader')
          +('' if '--no-cache' in sys.argv else '; passed steps whose inputs are unchanged are taken from the cache')+(f'; the machine\'s slots {SLOTS.ncpu} CPU, {SLOTS.nbr} browser' if SLOTS else ''))
    def report(name,rc,dt,note=''):
        res.append((name,rc,dt,note))
        st='cached' if note else 'stop  ' if name in STOPPED else 'skip  ' if rc is None else 'ok    ' if rc==0 else 'FAIL  '
        print(f'  {name:12s} {st} {dt:6.0f} s'+(f'   {note}' if note else '' if not rc or name in STOPPED else f'   ci-logs/{name}.txt'),flush=True)
    mid=[s for s in steps if s[0] not in('build','views')]
    for name,fn,_ in steps:
        if name=='build' and not plan:
            report(name,*go(name,fn))
            if ff and res[-1][1]:print('build failed: --fail-fast stops here');return 1
    if '--no-cache' not in sys.argv:   # the cache: after the build, which writes what many steps read
        gl='sw' if os.environ.get('MC_GL')!='gpu' else 'gpu'
        CACHE=cicache.Cache(ROOT,cicache.environment())
        for name,fn,tier in mid:
            if isinstance(fn,R):KEYS[name]=fn.key()+('' if lane(name,tier)=='cpu' else '|gl='+('sw' if fn.sw else gl))+('|blender='+blender_exe() if name in EXTRA else '')
    hits={}
    if CACHE:
        hits={n:e for n,*_ in mid if n in KEYS and (e:=CACHE.lookup(n,KEYS[n]))}
        for a,b in AFTER.items():   # a step and the one it reads: both or neither
            if (a in hits)!=(b in hits):hits.pop(a,None);hits.pop(b,None)
    if changed:   # only the steps whose inputs the branch changed (since it left main, committed or not), cached or not
        mb=git('merge-base','main','HEAD');ch={f.lower() for f in (git('diff','--name-only',mb).splitlines()+git('ls-files','-o','--exclude-standard').splitlines()) if f}
        keep=[];probe=CACHE or cicache.Cache(ROOT,{})
        for s in mid:
            d=probe.last_deps(s[0])
            if d is None or ch&{x.lower() for x in d}:keep.append(s)
        print(f'--changed: {len(ch)} files changed since main; {len(keep)} of {len(mid)} steps read them (or were never traced)')
        mid=keep;hits={}
    if plan:
        for name,fn,tier in mid:print(f'  {name:24s} '+(f'cached ({hits[name]["time"]} s, passed on {hits[name].get("branch")} {hits[name].get("commit")}, {hits[name]["when"]})' if name in hits else 'run: '+(CACHE.why(name,KEYS[name]) if CACHE and name in KEYS else 'not cacheable')))
        try:last=json.loads((LOGS/'times.json').read_text(encoding='utf-8'))
        except Exception:last={}
        print(f'{len(hits)} of {len(mid)} cached; about {sum(last.get(n,EST.get(n,30)) for n,*_ in mid if n not in hits)//60} min of steps to run (their last times here)');return 0
    for name,e in hits.items():
        (LOGS/f'{name}.txt').write_text(f'ci.py: cached: passed in {e["time"]} s on {e.get("branch")} {e.get("commit")} ({e["when"]}) with every input as it is now; its log then:\n\n'+e.get('log',''),encoding='utf-8')
        report(name,0,0,f'cached ({e["time"]} s on {e.get("branch")})')
    mid=[s for s in mid if s[0] not in hits]
    if jobs>1 and len(mid)>1:parallel(mid,jobs,browsers,report,ff)
    else:
        for name,fn,tier in mid:
            if ff and any(r[1] for r in res):break
            g=None
            while SLOTS and g is None:
                g=SLOTS.take('browser' if lane(name,tier)=='browser' else 'cpu',1)
                if g is None:time.sleep(2)
            try:report(name,*go(name,fn))
            finally:
                if SLOTS:SLOTS.give(g)
    for name,fn,_ in steps:
        if name=='views':report(name,*go(name,fn))
    order=[s[0] for s in STEPS];res.sort(key=lambda r:order.index(r[0]))
    bad=[n for n,rc,_,_ in res if rc and n not in STOPPED];sk=[n for n,rc,_,_ in res if rc is None];st=[n for n,*_ in res if n in STOPPED];nc=sum(1 for r in res if r[3])
    left=len(steps)-len(res)
    if any(n=='views' and rc==0 for n,rc,*_ in res):print('\nViews, '+(LOGS/'views.txt').read_text(encoding='utf-8')+'(changed pixels per view, 0 unchanged; the changes in red in ci-logs/views/r_vd_*.png)\n')
    print(f'{len(res)-len(bad)-len(sk)-len(st)} of {len(res)} ok'+(f' ({nc} cached)' if nc else '')+(f', {len(sk)} skipped ({", ".join(sk)})' if sk else '')+(f', {len(st)} stopped' if st else '')+(f', {left} not run (--fail-fast)' if ff and left>0 and not changed else '')
          +f' in {time.time()-t00:.0f} s'+(f' ({sum(r[2] for r in res):.0f} s of steps)' if jobs>1 else '')+(f'; failed: {", ".join(bad)}' if bad else ''))
    return 1 if bad else 0
if __name__=='__main__':sys.exit(main())
