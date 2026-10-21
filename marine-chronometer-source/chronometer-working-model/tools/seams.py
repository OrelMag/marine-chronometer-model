"""False seams: pairs of meshes of one part whose flat faces lie in one plane, facing the same way, and meet or overlap (seams.js). The page's Edges pass
outlines each mesh, so two meshes of one machined solid that share a visible face, or whose walls run flush, draw a line across the part where the real
one has none; such pieces are merged into one geometry (mergeGeo in core.js) or one outline. Pieces that are separate on the real part (a jewel or bushing
pressed in flush, a screw, a pin, another parts-list line) keep their line. It reports, never fails (exit 1 only on a page error).

    python seams.py [box] [--model wempe] [--rev first|6mx|1943|3955] [--json OUT] [--min MM]

Lists each pair: the part, both meshes' geometry type, parts-list line (hn) and material, whether they share a material, the plane (normal, offset) and the
length in mm of the cells where they meet (0.05 mm grid). About 20 s a run. Written 21 October 2026 for the seam sweep (Review-results.md, "False seams")."""
import asyncio,browser,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
import model;PAGE=model.PAGE
BOX='box' in sys.argv[1:2]
REV=sys.argv[sys.argv.index('--rev')+1] if '--rev' in sys.argv else None
MIN=float(sys.argv[sys.argv.index('--min')+1]) if '--min' in sys.argv else 0.5
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
        await pg.evaluate(f"window.__SEAMBOX={'true' if BOX else 'false'}")
        r=json.loads(await pg.evaluate(open(HERE/'seams.js').read()))
        await b.close();return r,errs
def main():
    r,errs=asyncio.run(run())
    pairs={}
    for x in r:
        k=(x['part'],x['ia'],x['ib']);q=pairs.setdefault(k,{'part':x['part'],'a':x['a'],'b':x['b'],'ca':x['ca'],'cb':x['cb'],'sameMat':x['sameMat'],'ba':x['ba'],'bb':x['bb'],'ia':x['ia'],'ib':x['ib'],'len':0,'planes':0,'flat':0,'wall':0})
        q['len']+=x['len'];q['planes']+=1;q['flat' if abs(x['n'][1])>0.99 else 'wall']+=x['len']
    r=[q for q in pairs.values() if q['len']>=MIN];r.sort(key=lambda x:(x['part'],-x['len']))
    for x in r:
        print(f"{x['part']:22s} {'SAME' if x['sameMat'] else 'diff'} {x['len']:7.1f} mm in {x['planes']:3d} planes (flat {x['flat']:.1f}, walls {x['wall']:.1f})  A {x['a']} {x['ba']}  B {x['b']} {x['bb']}")
    print(f'{len(r)} pairs ({len({x["part"] for x in r})} parts)')
    if '--json' in sys.argv:pathlib.Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps(r,indent=1),encoding='utf-8')
    for e in errs:print('page error:',e)
    return 1 if errs else 0
if __name__=='__main__':sys.exit(main())
