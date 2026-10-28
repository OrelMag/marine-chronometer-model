"""Geometry audit: screws that overlap or have nothing under their seat, cylinders (arbors, pins) whose ends sit in nothing,
coplanar overlapping faces (possible z-fighting), and parts that touch nothing (visible ones only). Usage: python audit.py [box] [--eval JS] [--rev first] [--update]
(--eval runs JS after loading, e.g. "__mv.userData.stop('arm')" to fit the manual's locking arm in place of the Navy's Y-arm, the default)

The model is frozen in one state first (the escapement locked, the fusee 2.5 turns from full wind: placements.py's first state), so a run
doesn't depend on the time of day. Then every finding is compared with what is expected: no overlapping or floating screw and no isolated
part at all; the loose ends in LOOSE below, each with its reason; and the coplanar faces in audit-expected.json (pairs of parts with the face
level they share, and how many: most are faces in contact). Anything new fails (exit code 1); an expected entry no longer found is listed,
to be taken out. After a change that adds or removes coplanar faces on purpose, look at what is new, then rewrite the file with --update.
With --eval the comparison still runs: a planted fault proves the check, and a variant (the manual's arm) lists what it changes."""
import asyncio,browser,json,pathlib,sys
from collections import Counter
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
import model;PAGE=model.PAGE   # the model's page: the Hamilton's (../index.html), or another's with --model NAME (model.py)
MODE='box' if 'box' in sys.argv[1:2] else 'movement'
# --rev first: a model whose drawings have two states (the Wempe's sheets as first drawn: its page's Variants, movement.js's setRev) is audited in that state, its coplanar
# faces kept under their own key ('movement.first'), so --update records them as it does the default's
REV=sys.argv[sys.argv.index('--rev')+1] if '--rev' in sys.argv else None
KEY=MODE+('.'+REV if REV else '')
JS='geometry-audit-box.js' if MODE=='box' else 'geometry-audit.js'
EXP=(HERE if model.HAMILTON else model.DIR)/'audit-expected.json'   # another model's beside its page
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0),E=1000+s.prog;mv.userData._u({E,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false,arm:0,blk:0});})()"""   # placements.py's first state
# loose ends expected (part:geometry, place in the movement frame at the frozen state, radius, why); matched within 0.3 mm
LOOSE=model.cfg('LOOSE',[   # the winding stop's stud (barrelBridge:Cylinder, standing 5.5 out of the bridge into the stop-bar's path) was listed until 21 October 2026: one mesh with its grooved end since (fuse), no longer a cylinder the check reads
 ('det:Cylinder',(-4.77,-18.31,32.77),0.22,"a steady pin across the detent's foot, standing out of it"),
 ('det:Cylinder',(-2.8,-18.31,26.26),0.22,"the foot's other steady pin, the same"),
 ('bal:Cylinder',None,0.25,"a vernier timing weight's screw, its free end past the nut"),
 ('bal:Cylinder',None,0.25,"the other vernier weight's screw")])
# with the Navy's balance brake fitted (the page's default; --eval "__mv.userData.stop('arm')" fits the manual's arm instead), free: its pins end 0.5 mm over the rim's top edge, and come down onto it when locked
LOOSE_NAVY=model.cfg('LOOSE_NAVY',[('lockArm:Cylinder',(14.99,-28.85,6.51),0.4,"the Navy brake's pin over the rim, free"),('lockArm:Cylinder',(-11.77,-28.85,14.05),0.4,"its other pin, the same")])
FLOAT=model.cfg('FLOAT_BOX' if MODE=='box' else 'FLOAT',[] if MODE=='box' else [('fusee:Lathe',(9.69,-9.7,-16.02),1.26,"a winding ratchet screw (42014): its head in the ratchet's counterbore, whose floor is the ratchet's lower 0.15, so the probe 0.15 under the seat lies on that floor's far face (the ratchet one mesh since 21 October 2026, fuse)"),
  ('fusee:Lathe',(18.92,-9.7,-13.02),1.26,"the other winding ratchet screw, the same")])   # screws whose head is meant to bear on a part only at its edge (another model's checks.py lists them, FLOAT_BOX for the box: part:geometry, place, head radius, why); none on the Hamilton
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:(errs.append(str(e)),print("ERR",e)))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        await pg.evaluate(FREEZE);await pg.wait_for_timeout(200)
        if REV:await pg.evaluate(f"__mv.userData.setRev('{REV}')");await pg.wait_for_timeout(300)
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
        exp[KEY]=dict(sorted(zf.items()));EXP.write_text(json.dumps(exp,indent=1,ensure_ascii=False)+'\n',encoding='utf-8',newline='\n')
        print(f'wrote {EXP.name} [{KEY}]: {sum(zf.values())} coplanar faces in {len(zf)} pairs')
    bad,gone=[],[]
    bad+=[f'page error: {e}' for e in errs]
    fl=[e for e in FLOAT if len(e)<5 or (REV or 'last') in e[4].split()]   # an entry's fifth field, if any, the versions it applies to (another model's Variants, setRev's names; the default 'last'): judged only there (28 October 2026, the Wempe's drawing check 2's 9-M6: the 6MX's ring screws reported "no longer found" in every other version)
    for x in r['floatScrews']:
        m=next((e for e in fl if e[0]==x[0] and abs(e[2]-x[2])<1e-6 and max(abs(a-b) for a,b in zip(x[1],e[1]))<=0.3),None)
        if m:fl.remove(m)
        else:bad.append(f'floatScrews: {x}')
    gone+=[f'floatScrews: {e[0]} r{e[2]} at {e[1]} ({e[3]})' for e in fl]
    for k in ('dupScrews','isolated'):bad+=[f'{k}: {x}' for x in r[k]]
    left=list(LOOSE)+(LOOSE_NAVY if "stop('arm')" not in ' '.join(sys.argv) else []) if MODE=='movement' else []
    for x in r['looseEnds']:
        nm,pos,rad=x[0],x[1],float(x[2][1:])
        m=next((e for e in left if e[0]==nm and abs(e[2]-rad)<1e-6 and (e[1] is None or max(abs(a-b) for a,b in zip(pos,e[1]))<=0.3)),None)
        if m:left.remove(m)
        else:bad.append(f'looseEnds: {x}')
    gone+=[f'looseEnds: {e[0]} r{e[2]} at {e[1]} ({e[3]})' for e in left]
    ez=Counter(exp.get(KEY,{}))
    for k,n in zf.items():
        if n>ez.get(k,0):bad.append(f'zfight: {k} (x{n}, expected x{ez.get(k,0)})')
    for k,n in ez.items():
        if zf.get(k,0)<n:gone.append(f'zfight: {k} (x{zf.get(k,0)}, expected x{n})')
    print(f'\n== compared with the expected leftovers [{KEY}]')
    for g in gone:print('   no longer found (take it out):',g)
    for x in bad:print('   NEW:',x)
    if bad:print(f'FAIL: {len(bad)} new finding(s); fix them, or if intended, add the loose end to LOOSE (with its reason) or run --update for coplanar faces');return 1
    print('OK: nothing new'+(f' ({len(gone)} expected entries no longer found)' if gone else ''));return 0
sys.exit(main())
