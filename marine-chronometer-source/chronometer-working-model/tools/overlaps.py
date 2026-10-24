"""Metal counted twice: where pieces of one part overlap (overlaps.js). Every weighing tool (massprops-check.js, wempe-inertia.js, mechanisms-*.js) integrates a mesh's
signed volume, the integral of its winding number, so where two pieces fused into one mesh (fuse, core.js) or two meshes of one part overlap, that metal is weighed twice.
Rays on a grid over each part (at most --n cells across its box) along each of --axes (the median reported: a ray through an edge counts it twice, along one axis), each crossing's sign giving the winding number between them: per mesh
the excess ∫max(w-1,0) of its own pieces (and ∫min(w,0), inside out), per part the excess of all its meshes together (pressed pins and settings included). It reports,
never fails (exit 1 only on a page error; --fail MM3 fails on a mesh's own excess past MM3).

    python overlaps.py [box] [--model wempe] [--rev first|3955|6mx|1943] [--axes xyz] [--n 400] [--min 0.01] [--part a,b] [--json OUT] [--fail MM3]
    python overlaps.py --all [--model wempe]   # every state: the movement and the box, as last revised and in each version

Prints each part whose meshes overlap past --min mm³: the part's excess (all its meshes together), then each mesh's own (pieces of one mesh), with its parts-list line,
material, the grid's cell and where the excess lies. A cell of 1/400 of the part's box gives about 1 % on an overlap a few cells deep; the three axes' readings are printed beside it.
About 10-40 s a state (the Wempe's ten with --all about 5 min, 21 October 2026). Written 21 October 2026 after the seam sweep (Review-results.md, "False seams": the overlaps among merged pieces)."""
import asyncio,browser,json,pathlib,subprocess,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
import model;PAGE=model.PAGE
A=sys.argv[1:]
def opt(k,d=None):return A[A.index(k)+1] if k in A else d
BOX='box' in A[:1];REV=opt('--rev');AXES=opt('--axes','xyz');N=int(opt('--n','400'));MIN=float(opt('--min','0.01'));PART=opt('--part');FAIL=opt('--fail')
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0),E=1000+s.prog;mv.userData._u({E,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false,arm:0,blk:0});})()"""   # audit.py's frozen state
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        await pg.evaluate(FREEZE);await pg.wait_for_timeout(200)
        if REV:await pg.evaluate(f"__mv.userData.setRev('{REV}')");await pg.wait_for_timeout(300)
        if BOX:await pg.evaluate("window.__BX&&__BX.showOver&&__BX.showOver(1)")   # the outer box, shown only in its own view (bom.py's ARM)
        await pg.evaluate(f"window.__OVBOX={'true' if BOX else 'false'};window.__OVAXES='{AXES}';window.__OVN={N};window.__OVEX={int(opt('--ex','0'))};window.__OVONLY={json.dumps(PART.split(',')) if PART else 'null'}")
        r=json.loads(await pg.evaluate((HERE/'overlaps.js').read_text(encoding='utf-8')))
        await b.close();return r,errs
def main():
    if '--all' in A:   # every state, each in its own run
        rest=[a for a in A if a!='--all'];m=['--model',model.NAME]
        revs=[None,'first','3955','6mx','1943'] if not model.HAMILTON else [None]
        rc=0
        for box in(False,True):
            for rv in revs:
                print(f"=== {model.NAME} {'box' if box else 'movement'} {rv or 'last'}",flush=True)
                rc|=subprocess.call([sys.executable,__file__,*(['box'] if box else []),*m,*(['--rev',rv] if rv else []),*rest])
        return rc
    r,errs=asyncio.run(run());bad=0
    r=[x for x in r if x['excess']>=MIN or any(q['self']>=MIN or q['neg']>=MIN for q in x['per'])];r.sort(key=lambda x:-x['excess'])
    for x in r:
        print(f"{x['part']:24s} {x['meshes']:3d} meshes  excess {x['excess']:9.3f} mm3 (x y z {x['axes']}, cell {x['cell']})  at {x['where']}")
        for q in x['per']:
            if q['self']>=MIN or q['neg']>=MIN:
                print(f"    {q['geo']:9s} {q['hn']:14s} {q['mat']:10s} own {q['self']:9.3f} mm3 of {q['vol']:.2f} (x y z {q['axes']}, cell {q['cell']}{', inside out %.3f'%q['neg'] if q['neg'] else ''})  at {q['where']}  box {q['box']}")
                if FAIL and q['self']>float(FAIL):bad=1
    print(f'{len(r)} parts with metal counted twice past {MIN} mm3 (the median of axes {AXES})')
    if opt('--json'):pathlib.Path(opt('--json')).write_text(json.dumps(r,indent=1),encoding='utf-8')
    for e in errs:print('page error:',e)
    return 1 if errs or bad else 0
if __name__=='__main__':sys.exit(main())
