"""Geometry audit: screws that overlap or have nothing under their seat, cylinders (arbors, pins) whose ends sit in nothing,
coplanar overlapping faces (possible z-fighting), and parts that touch nothing (visible ones only). Usage: python audit.py [box] [--eval JS] [--update]
(--eval runs JS after loading, e.g. "__mv.userData.stop('arm')" to fit the manual's locking arm in place of the Navy's Y-arm, the default)

The model is frozen in one state first (the escapement locked, the fusee 2.5 turns from full wind: placements.py's first state), so a run
doesn't depend on the time of day. Then every finding is compared with what is expected: no overlapping or floating screw and no isolated
part at all; the loose ends in LOOSE below, each with its reason; and the coplanar faces in audit-expected.json (pairs of parts with the face
level they share, and how many: most are faces in contact). Anything new fails (exit code 1); an expected entry no longer found is listed,
to be taken out. After a change that adds or removes coplanar faces on purpose, look at what is new, then rewrite the file with --update.
With --eval the comparison still runs: a planted fault proves the check, and a variant (the manual's arm) lists what it changes."""
import asyncio,json,pathlib,sys
from collections import Counter
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
MODE='box' if 'box' in sys.argv[1:2] else 'movement'
JS='geometry-audit-box.js' if MODE=='box' else 'geometry-audit.js'
EXP=HERE/'audit-expected.json'
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0),E=1000+s.prog;mv.userData._u({E,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false,arm:0,blk:0});})()"""   # placements.py's first state
# loose ends expected (part:geometry, place in the movement frame at the frozen state, radius, why); matched within 0.3 mm
LOOSE=[('barrelBridge:Cylinder',(20.95,-20.2,-21.26),0.9,"the winding-stop pin, standing out of the barrel bridge's underside into the stop-bar's path"),
 ('lowerBridge:Cylinder',(20.62,-21.91,14.01),0.4,"a steady pin of the balance lower bridge: its hole in the train bridge is drawn through, so the end above sits in a hole"),
 ('lowerBridge:Cylinder',(-13.6,-21.91,16.4),0.4,"the lower bridge's other steady pin, the same"),
 ('det:Cylinder',(-3.65,-18.31,35.21),0.22,"a steady pin across the detent's foot, standing out of it"),
 ('det:Cylinder',(-2.06,-18.31,28.06),0.22,"the foot's other steady pin, the same"),
 ('bal:Cylinder',None,0.25,"a vernier timing weight's screw, its free end past the nut"),
 ('bal:Cylinder',None,0.25,"the other vernier weight's screw")]
# with the Navy's balance brake fitted (the page's default; --eval "__mv.userData.stop('arm')" fits the manual's arm instead), free: its pins end 0.5 mm over the rim's top edge, and come down onto it when locked
LOOSE_NAVY=[('lockArm:Cylinder',(14.99,-28.85,6.51),0.4,"the Navy brake's pin over the rim, free"),('lockArm:Cylinder',(-11.77,-28.85,14.05),0.4,"its other pin, the same")]
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:(errs.append(str(e)),print("ERR",e)))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        await pg.evaluate(FREEZE);await pg.wait_for_timeout(200)
        if '--eval' in sys.argv:await pg.evaluate(sys.argv[sys.argv.index('--eval')+1]);await pg.wait_for_timeout(300)
        r=json.loads(await pg.evaluate(open(HERE/JS).read()))
        await b.close();return r,errs
def zkey(z):return f'{z[0]} | {z[1]} | {z[2]}'
def main():
    r,errs=asyncio.run(run())
    for k,v in r.items():
        print(f'== {k} ({len(v)})')
        for x in v: print('  ',x)
    exp=json.loads(EXP.read_text(encoding='utf-8')) if EXP.exists() else {}
    zf=Counter(zkey(z) for z in r['zfight'])
    if '--update' in sys.argv and '--eval' not in sys.argv:
        exp[MODE]=dict(sorted(zf.items()));EXP.write_text(json.dumps(exp,indent=1,ensure_ascii=False)+'\n',encoding='utf-8',newline='\n')
        print(f'wrote {EXP.name} [{MODE}]: {sum(zf.values())} coplanar faces in {len(zf)} pairs')
    bad,gone=[],[]
    bad+=[f'page error: {e}' for e in errs]
    for k in ('dupScrews','floatScrews','isolated'):bad+=[f'{k}: {x}' for x in r[k]]
    left=list(LOOSE)+(LOOSE_NAVY if "stop('arm')" not in ' '.join(sys.argv) else []) if MODE=='movement' else []
    for x in r['looseEnds']:
        nm,pos,rad=x[0],x[1],float(x[2][1:])
        m=next((e for e in left if e[0]==nm and abs(e[2]-rad)<1e-6 and (e[1] is None or max(abs(a-b) for a,b in zip(pos,e[1]))<=0.3)),None)
        if m:left.remove(m)
        else:bad.append(f'looseEnds: {x}')
    gone+=[f'looseEnds: {e[0]} r{e[2]} at {e[1]} ({e[3]})' for e in left]
    ez=Counter(exp.get(MODE,{}))
    for k,n in zf.items():
        if n>ez.get(k,0):bad.append(f'zfight: {k} (x{n}, expected x{ez.get(k,0)})')
    for k,n in ez.items():
        if zf.get(k,0)<n:gone.append(f'zfight: {k} (x{zf.get(k,0)}, expected x{n})')
    print(f'\n== compared with the expected leftovers [{MODE}]')
    for g in gone:print('   no longer found (take it out):',g)
    for x in bad:print('   NEW:',x)
    if bad:print(f'FAIL: {len(bad)} new finding(s); fix them, or if intended, add the loose end to LOOSE (with its reason) or run --update for coplanar faces');return 1
    print('OK: nothing new'+(f' ({len(gone)} expected entries no longer found)' if gone else ''));return 0
sys.exit(main())
