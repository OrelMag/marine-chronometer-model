"""The checks, run here: what CI would run, on this machine, so a branch is judged by results we can read.

    python ci.py              # the checks on every change (about 22 minutes: 18-23 over four runs on 15 October 2026, 57 steps, before the Wempe's four build checks added about 2 minutes): build, escapement, escgolden, wempe-escapement, wempe-mainspring, wempe-physics, wempe-strength, wempe-gearing, wempe-hairspring, wempe-thermal, wempe-gimbals, wempe-errorbudget, wempe-tolerances, wempe-keystone, wempe-bench, wempe-montecarlo, wempe-essaydata, almanac, hairspring, hairspring-fe, physics, tolerances, strength, dynamics, tripping, wempe-dynamics, wempe-tripping, gimbals, errorbudget, gearing, thermal, bench, rating, deviations, benchcheck, selfcontained, types, wempe-types, smoke, invariants, massprops, solids, exploded, overhaul, book, audit, holecheck, and the Wempe's smoke, solids, audit, exploded, massprops and stopwork
    python ci.py --quick      # without the browser checks (about 12 minutes, 15 October 2026): build, escapement, escgolden, wempe-escapement, wempe-hairspring, wempe-thermal, wempe-mainspring, wempe-physics, wempe-strength, wempe-gearing, wempe-gimbals, wempe-errorbudget, wempe-tolerances, wempe-keystone, wempe-bench, wempe-montecarlo, wempe-essaydata, almanac, hairspring, hairspring-fe, physics, tolerances, strength, dynamics, tripping, wempe-dynamics, wempe-tripping, gimbals, errorbudget, gearing, thermal, bench, rating, deviations, benchcheck, selfcontained, types, wempe-types
    python ci.py --full       # and the slow checks: estimates.js, dynamics.js in full, tripping.js's sections 2-5 (four steps), the Wempe's dynamics.js and tripping.js in full, gimbals.js in full (the Hamilton's and the Wempe's), mainspring_friction.py (the model's strip, the build's Nivaflex and the sources' proportions), gearing.js in full, the Wempe's mainspring friction and gearing in full, fea.py, fine.py, maintaining.py, bom.py, the Wempe's fine.py and bom.py, gltf_check.py, blender_check.py
    python ci.py --views [BASE]   # and every view rendered from BASE (default: where this branch left main; on main, HEAD) and from the working tree, the changed pixels per view
    python ci.py --only smoke,audit   # just those steps (names as in the summary)
    python ci.py --jobs 1     # one step at a time, as before 16 October 2026 (default: up to 12 at once, --browsers 3 of them with a browser)
    python ci.py --swiftshader   # the browser steps' WebGL in software, as before 16 October 2026 (default: on this machine's GPU, tools/browser.py)

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
BUILT=[ROOT/'chronometer-working-model.html',MC/'dist',WE/'dist',ROOT/'site']
TSC='typescript@5.9.3'
def arg(k):return sys.argv[sys.argv.index(k)+1] if k in sys.argv and sys.argv.index(k)+1<len(sys.argv) and not sys.argv[sys.argv.index(k)+1].startswith('--') else None
def digest():
    h={}
    for p in BUILT:
        for f in ([p] if p.is_file() else sorted(p.rglob('*')) if p.exists() else []):
            if f.is_file():h[str(f.relative_to(ROOT))]=hashlib.sha256(f.read_bytes()).hexdigest()
    return h
def run(cmd,cwd,log,sw=False):
    with open(log,'w',encoding='utf-8',errors='replace') as o:
        o.write('$ '+' '.join(map(str,cmd))+'\n\n');o.flush()
        return subprocess.run(list(map(str,cmd)),cwd=cwd,stdout=o,stderr=subprocess.STDOUT,env={k:v for k,v in os.environ.items() if k!='MC_GL'} if sw else None).returncode
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
 ('wempe-tolerances',lambda log:run(['node',TOOLS/'wempe_tolerances.js'],ROOT,log),'quick'),   # how closely the Wempe's unsized parts must be made: the mainspring, the detent's and gold springs, the preload, the lock, the hairspring, against tolerances_wempe.json (about 40 s)
 ('wempe-keystone',lambda log:run(['node',TOOLS/'keystone.js','--model','wempe'],ROOT,log),'quick'),   # the Wempe's escapement against the 1904 text's rules (reports), against keystone_wempe.json (about 5 s)
 ('wempe-bench',lambda log:run(['node',TOOLS/'wempe_bench.js'],ROOT,log),'quick'),   # the Wempe's tests on the bench from its figures, against bench_wempe.json (about 45 s)
 ('wempe-montecarlo',lambda log:run(['node',TOOLS/'wempe_montecarlo.js'],ROOT,log),'quick'),   # the whole Wempe to a maker's tolerances, as made and after the bench, against montecarlo_wempe.json (about 30 s)
 ('wempe-ratchets',lambda log:run(['node',TOOLS/'wempe_ratchets.js'],ROOT,log),'quick'),   # the Wempe's pawls on their ratchets: the load's draw against friction, the teeth, faces and pivots, the clicks' springs at let-go, the maintaining detent's catch against the spring's travel (about 2 s)
 ('wempe-transmission',lambda log:run(['node',TOOLS/'wempe_transmission.js'],ROOT,log),'quick'),   # the Wempe's whole transmission in time, every part that moves, nonlinear: the train on its meshes driving dynamics.js's escapement, the winds, the let-go, the stop (about 2 minutes)
 ('wempe-essaydata',lambda log:run(['node',TOOLS/'wempe_essaydata.js'],ROOT,log),'quick'),   # the Wempe essay's generated data (js/essaydata.js) and its quoted figures (data-wphys) against what the tools give (about 35 s)
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
 ('selfcontained',lambda log:run([PY,'selfcontained.py'],TOOLS,log),'quick'),   # the page alone enough to make it and navigate with it (a few seconds)   # the hairspring's design: Phillips' terminal curves, the strip, the force on the pivots (about 12 s)   # the essay's almanac and sight reduction against JPL Horizons and skyfield (about 1 s)
 ('types',tsc,'quick'),
 ('wempe-dialtrace',lambda log:run([PY,'dialtrace.py'],TOOLS,log),'quick'),   # the Wempe dial's printing traced off Wempe 3955's photograph, against js/dialface.js (about 13 s)
 ('wempe-dialtrace-lange',lambda log:run([PY,'dialtrace.py','--dial','lange'],TOOLS,log),'quick'),   # the Lange dial's, against js/dialface_lange.js (about 20 s)
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
 ('holecheck',lambda log:run([PY,'holecheck.py'],TOOLS,log),'browser'),
 ('wempe-smoke',lambda log:run([PY,'smoke.py','--model','wempe'],TOOLS,log),'browser'),   # the Wempe's page: its views, sections, Spread, a pick, the opacity menu, a link; then its Essay tab (about 1½ minutes)
 ('wempe-solids',lambda log:run([PY,'solids.py','--model','wempe'],TOOLS,log),'browser'),
 ('wempe-audit',lambda log:run([PY,'audit.py','--model','wempe'],TOOLS,log),'browser'),
 ('wempe-exploded',lambda log:run([PY,'exploded.py','--model','wempe'],TOOLS,log),'browser'),
 ('wempe-audit-first',lambda log:run([PY,'audit.py','--model','wempe','--rev','first'],TOOLS,log),'browser'),   # the same as first drawn (the page's Variants: the sheets of 1940-41), its coplanar faces under movement.first
 ('wempe-exploded-first',lambda log:run([PY,'exploded.py','--model','wempe','--eval',"__mv.userData.setRev('first')"],TOOLS,log),'browser'),
 ('wempe-audit-box',lambda log:run([PY,'audit.py','box','--model','wempe'],TOOLS,log),'browser'),   # the Wempe's case, gimbals and box, against its expected leftovers (about 10 s)
 ('wempe-audit-box-first',lambda log:run([PY,'audit.py','box','--model','wempe','--rev','first'],TOOLS,log),'browser'),   # the box as first drawn (the 1940 key) (about 10 s)
 ('wempe-inertia',lambda log:run([PY,'wempe_inertia.py'],TOOLS,log),'browser'),   # the Wempe's escapement's bodies weighed on its solids, against wempe_inertia.json (about 30 s)
 ('wempe-massprops',lambda log:run([PY,'massprops.py','--model','wempe'],TOOLS,log),'browser'),   # the Wempe's case and ring weighed on the model, against gimbals_wempe.json (about 15 s)
 ('wempe-invariants',lambda log:run([PY,'invariants.py','--model','wempe'],TOOLS,log),'browser'),   # the Wempe's arithmetic: its seven meshes turning as their teeth, the hands against the time, the up-and-down hand on the dial's scale, the fusee's hours, the balance as weighed (about 10 s)
 ('wempe-mechanisms',lambda log:run([PY,'mechanisms.py','--model','wempe'],TOOLS,log),'browser'),   # the Wempe's pawls off the built model (the clicks, the maintaining detent, the set-up click), against mechanisms_wempe.json (about 15 s)
 ('wempe-holecheck',lambda log:run([PY,'holecheck.py','--model','wempe'],TOOLS,log),'browser'),   # every round hole in the Wempe's parts populated or explained (checks.py's HOLE_EXPECTED), as last revised and as first drawn (1½-2¼ minutes)
 ('wempe-stopwork',lambda log:run([PY,'wempe_stopwork.py'],TOOLS,log),'browser'),   # the Wempe's stop bar against its stop pin over the last 1.2 turns, chain and band: the stop holds full wind, never catches early, the pin bears on the bar's whole thickness (about 45 s)
 ('estimates',lambda log:run(['node',TOOLS/'estimates.js'],ROOT,log),'full'),   # the design values resting on estimates swept over their ranges, the bench's correction applied (about 4 min; a sensitivity sweep, so with the slow checks)
 ('dynamics-full',lambda log:run(['node',TOOLS/'dynamics.js'],ROOT,log),'full'),   # and starting, the least drive, knocks and the ship's motion (about 1 minute)
 ('tripping-run',lambda log:run(['node',TOOLS/'tripping.js','--section','2'],ROOT,log),'full'),   # tripping.js's sections 2-5, side by side (0 and 1 are the quick tier's tripping): running as drawn and the estimates varied (about 2 minutes)
 ('tripping-push',lambda log:run(['node',TOOLS/'tripping.js','--section','3'],ROOT,log),'full'),   # the swing pushed until a tooth gets past (about 1¼ minutes)
 ('tripping-knocks',lambda log:run(['node',TOOLS/'tripping.js','--section','4'],ROOT,log),'full'),   # the knocks that trip it, the frame against the rigid detent (about 8 minutes: the longest step)
 ('tripping-bench',lambda log:run(['node',TOOLS/'tripping.js','--section','5'],ROOT,log),'full'),   # the bench's figures (tripping.json) run again (about 5 minutes, on every core)
 ('wempe-dynamics-full',lambda log:run(['node',TOOLS/'dynamics.js','--model','wempe'],ROOT,log),'full'),   # the Wempe's: starting, the least drive, knocks, the ship's motion (about 2½ minutes)
 ('wempe-tripping-full',lambda log:run(['node',TOOLS/'tripping.js','--model','wempe'],ROOT,log),'full'),   # the Wempe's frame running as drawn, the estimates varied, the swing pushed, the knocks (about 2½ minutes)
 ('mainspring-friction',lambda log:run([PY,'mainspring_friction.py','--check'],TOOLS,log),'full'),   # the mainspring's coil friction, against mainspring_friction.json (about a minute)
 *[(f'mainspring-{k}',lambda log,k=k:run([PY,'mainspring_friction.py','--variants',k,'--check'],TOOLS,log),'full') for k in sorted(json.loads((TOOLS/'mainspring_bound.json').read_text(encoding='utf-8'))) if k!='model' and not k.startswith('fz')],   # the same for each strip mainspring.py --bound solved (the build's Nivaflex, the sources' proportions: mainspring_bound.json), against each mainspring_friction_NAME.json, a step each (not drive.js's fz* candidates: mainspring_friction.py --variants --fz) (about 1 minute each one after another, on 14 processes)
 ('wempe-mainspring-friction',lambda log:run([PY,'wempe_mainspring.py','--friction','--check'],TOOLS,log),'full'),   # the Wempe's mainspring's coil friction, against mainspring_friction_wempe.json (about a minute)
 ('wempe-gearing-full',lambda log:run(['node',TOOLS/'gearing.js','--model','wempe'],ROOT,log),'full'),   # and its depthing windows, against gearing_wempe.json (about 2 minutes)
 ('gimbals-full',lambda log:run(['node',TOOLS/'gimbals.js'],ROOT,log),'full'),   # and the seas, the stops, what reaches the escapement (about 2½ minutes)
 ('wempe-gimbals-full',lambda log:run(['node',TOOLS/'gimbals.js','--model','wempe'],ROOT,log),'full'),   # the Wempe's: the seas in both installations, the stops, what reaches the escapement through makeEsc (about 4 minutes)
 ('gearing-full',lambda log:run(['node',TOOLS/'gearing.js'],ROOT,log),'full'),   # and each mesh's depthing window, the holes' tolerance, against gearing.json (about 2 minutes)
 ('fea',lambda log:run([PY,'fea.py'],TOOLS,log),'full'),   # finite elements on the plates and bridges: the pivots' holes under the chain's and teeth's loads, against the depths' windows (about 3 minutes)
 ('fine',lambda log:run([PY,'fine.py'],TOOLS,log),'full'),
 ('maintaining',lambda log:run([PY,'maintaining.py'],TOOLS,log),'full'),
 ('wempe-maintaining',lambda log:run([PY,'maintaining.py','--model','wempe'],TOOLS,log),'full'),   # the Wempe's maintaining work: its clicks, ratchet, detent and wire on the solids through run and wind; the page's own loop through two winds (the maintaining spring's drive); the stop work (1½-2¾ minutes)
 ('bom',lambda log:run([PY,'bom.py'],TOOLS,log),'full'),   # every part against the manual's parts list and its fits (about 6 minutes)
 ('wempe-fine',lambda log:run([PY,'fine.py','--model','wempe'],TOOLS,log),'full'),   # the Wempe's 0.05 mm interference over its escapement's phases, train and wind, against checks.py's EXPECTED (about 1¾ minutes)
 ('wempe-bom',lambda log:run([PY,'bom.py','--model','wempe'],TOOLS,log),'full'),   # every Wempe part against its drawing list (wempe/bom.json) and its relations (about 4 minutes)
 ('gltf',lambda log:run([PY,'gltf_check.py'],TOOLS,log,sw=True),'full'),   # the export to Blender, written and read back (about 2 minutes; in SwiftShader always: exported from a page drawn on the GPU, the Running clip starts the escape wheel 0.105° off, over blender's 0.1°)
 ('blender',lambda log:run([PY,'blender_check.py'],TOOLS,log,sw=True),'full'),   # that file in Blender, with the rig, against its own clips (about 3 minutes; skipped where there is no Blender)
 ('wempe-gltf',lambda log:run([PY,'gltf_check.py','--model','wempe'],TOOLS,log,sw=True),'full'),   # the Wempe's export to Blender (r_wempe.glb) and its STLs, written and read back (about 3½ minutes)
 ('wempe-blender',lambda log:run([PY,'blender_check.py','--model','wempe'],TOOLS,log,sw=True),'full'),   # that file in Blender, with the rig, against its own clips (about 2½ minutes)
 ('views',views,'views')]
# Side by side (--jobs, --browsers): the steps without a browser on up to JOBS processes at once; those with one (Chromium through Playwright: the browser tier's and
# BROWSER below) on up to BROWSERS. SOLO steps measure the page's own time (the train run on frame time): no other browser step runs with them. Steps in one EXCL
# group write the same file or folder and never run together; AFTER: a step waits for the one it reads. build runs first, alone (every step reads what it builds),
# views last. The longest steps start first (their last times in ci-logs/times.json, else EST). --jobs 1 runs every step one after another, as before 16 October 2026.
BROWSER={'fea','fine','maintaining','wempe-maintaining','bom','wempe-fine','wempe-bom','gltf','blender','wempe-gltf','wempe-blender'}   # the full tier's steps that open a page
SOLO={'smoke','wempe-smoke'}
EXCL={'wempe-dialtrace':'r_dial','wempe-dialtrace-lange':'r_dial','bom':'r_bom.json','wempe-bom':'r_bom.json','types':'npx','wempe-types':'npx',   # bom.py writes tools/r_bom.json for either model; two npx -y at once race in npm's cache
      }
AFTER={'blender':'gltf','wempe-blender':'wempe-gltf'}   # blender_check.py imports the r_model21.glb (r_wempe.glb) gltf_check.py writes
POOL=6   # the steps that run on processes of their own (tripping.js's bench figures, the Wempe's tripping.js, mainspring.py's sweeps) run on POOL of them (MC_PROCS,
POOLED={'tripping-bench','wempe-tripping-full','mainspring-friction','wempe-mainspring-friction'}|{s[0] for s in STEPS if s[0].startswith('mainspring-') and s[0]!='mainspring-friction'}   # MC_MS_PROC), and count as POOL of the --jobs
EST={'wempe-transmission':200,'wempe-maintaining':150,'wempe-holecheck':130,'wempe-essaydata':120,'tripping-knocks':520,'bom':510,'wempe-gearing-full':360,'tripping-bench':330,'wempe-bom':330,'smoke':300,'fea':260,'wempe-dynamics-full':220,
     'wempe-fine':190,'estimates':190,'wempe-tripping-full':180,'gimbals-full':180,'wempe-gimbals-full':170,'fine':150,'gearing-full':145,'tripping-run':130,'wempe-smoke':115,'gltf':110,'wempe-gltf':200,'wempe-blender':150}   # seconds: the medians of the worktrees' logs, 16 October 2026
def lane(name,tier):return 'browser' if tier=='browser' or name in BROWSER else 'cpu'
def go(name,fn):
    t0=time.time()
    try:rc=fn(LOGS/f'{name}.txt')
    except Exception as e:rc=1;open(LOGS/f'{name}.txt','a').write(f'\n{type(e).__name__}: {e}\n')
    return rc,time.time()-t0
def parallel(steps,jobs,browsers,report):
    """Runs steps (name, fn, tier) side by side within the limits above, calling report(name, rc, dt) as each ends."""
    import concurrent.futures as cf,json
    tf=LOGS/'times.json'
    try:last=json.loads(tf.read_text(encoding='utf-8'))
    except Exception:last={}
    os.environ.setdefault('MC_PROCS',str(POOL));os.environ.setdefault('MC_MS_PROC',str(POOL))
    w=lambda n:min(POOL,jobs) if n in POOLED else 1
    pend=sorted(steps,key=lambda s:(s[0] not in SOLO,-last.get(s[0],EST.get(s[0],30))));live={};done={}   # SOLO first: alone at the start, not waiting on the others
    with cf.ThreadPoolExecutor(max_workers=jobs+browsers) as ex:
        while pend or live:
            busy={n:lane(n,t) for n,t in live.values()};nb=sum(v=='browser' for v in busy.values());nc=sum(w(n) for n,v in busy.items() if v=='cpu');held=False
            waiting={s[0] for s in pend}
            for s in list(pend):
                name,fn,tier=s;ln=lane(name,tier)
                if AFTER.get(name) in waiting|set(busy):continue
                if EXCL.get(name) and any(EXCL.get(n)==EXCL[name] for n in busy):continue
                if ln=='browser':
                    if held or nb>=browsers or any(n in SOLO for n in busy):continue
                    if name in SOLO and nb:held=True;continue   # no new browser step starts until it can: it isn't passed over
                    nb+=1
                else:
                    if nc+w(name)>jobs:continue
                    nc+=w(name)
                pend.remove(s);waiting.discard(name);busy[name]=ln;live[ex.submit(go,name,fn)]=(name,tier)
            fin,_=cf.wait(list(live),return_when=cf.FIRST_COMPLETED)
            for f_ in fin:
                name,_t=live.pop(f_);rc,dt=f_.result();done[name]=rc;report(name,rc,dt)
                if rc==0:last[name]=round(dt)
    tf.write_text(json.dumps(dict(sorted(last.items())),indent=1)+'\n',encoding='utf-8')
def main():
    only=arg('--only');want={'quick'}|(set() if '--quick' in sys.argv else {'browser'})|({'full'} if '--full' in sys.argv else set())|({'views'} if '--views' in sys.argv else set())
    steps=[s for s in STEPS if s[0] in only.split(',')] if only else [s for s in STEPS if s[2] in want]
    if only and len(steps)!=len(only.split(',')):print('no such step in',only,'; steps:',', '.join(s[0] for s in STEPS));return 2
    jobs=int(arg('--jobs') or min(12,max(2,(os.cpu_count() or 4)//2)));browsers=int(arg('--browsers') or 3)
    if '--swiftshader' not in sys.argv:os.environ.setdefault('MC_GL','gpu')   # the browser steps on this machine's GPU (tools/browser.py); SwiftShader with --swiftshader
    LOGS.mkdir(exist_ok=True);res=[];t00=time.time()
    br=subprocess.run(['git','rev-parse','--abbrev-ref','HEAD'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
    dirty=subprocess.run(['git','status','--porcelain','--untracked-files=no'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
    print(f'ci.py on {br}'+(' (uncommitted changes: they are what is checked)' if dirty else '')+(f'; up to {jobs} steps at once, {browsers} of them with a browser' if jobs>1 else '; one step at a time')+('; WebGL on the GPU' if os.environ.get('MC_GL')=='gpu' else '; WebGL in SwiftShader'))
    def report(name,rc,dt):res.append((name,rc,dt));print(f'  {name:12s} {"skip" if rc is None else "ok  " if rc==0 else "FAIL"} {dt:6.0f} s'+('' if not rc else f'   ci-logs/{name}.txt'),flush=True)
    mid=[s for s in steps if s[0] not in('build','views')]
    for name,fn,_ in steps:
        if name=='build':report(name,*go(name,fn))
    if jobs>1 and len(mid)>1:parallel(mid,jobs,browsers,report)
    else:
        for name,fn,_ in mid:report(name,*go(name,fn))
    for name,fn,_ in steps:
        if name=='views':report(name,*go(name,fn))
    order=[s[0] for s in STEPS];res.sort(key=lambda r:order.index(r[0]))
    bad=[n for n,rc,_ in res if rc];sk=[n for n,rc,_ in res if rc is None]
    if any(n=='views' and rc==0 for n,rc,_ in res):print('\nViews, '+(LOGS/'views.txt').read_text(encoding='utf-8')+'(changed pixels per view, 0 unchanged; the changes in red in ci-logs/views/r_vd_*.png)\n')
    print(f'{len(res)-len(bad)-len(sk)} of {len(res)} ok'+(f', {len(sk)} skipped ({", ".join(sk)})' if sk else '')+f' in {time.time()-t00:.0f} s'+(f' ({sum(r[2] for r in res):.0f} s of steps)' if jobs>1 else '')+(f'; failed: {", ".join(bad)}' if bad else ''))
    return 1 if bad else 0
if __name__=='__main__':sys.exit(main())
