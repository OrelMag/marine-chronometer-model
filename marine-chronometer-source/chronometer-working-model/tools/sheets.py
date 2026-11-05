"""Sheets of no width: faces of one part lying back to back, facing opposite ways within --tol mm (sheets.js), over every version shown, each mesh once by its geometry. Within one mesh it is a fault of the mesh (two solids' ends left against each other: the Wempe fusee's flange's seams, 8.4 mm², until 3.82.01; a line on the part in the Edges pass, and a slit no machine cuts); between two meshes of one part, two pieces butted with their faces inside the metal. Nothing else finds these: solids.py passes them (each mesh still closed and wound), and recipes.py's samples may miss them. It reports, never fails (exit 1 on a page error; --fail MM2 fails past that area within one mesh).

    python sheets.py [--model wempe] [--tol 0.005] [--min 0.001] [--json OUT] [--fail MM2]
    python sheets.py --lines [--model wempe]   # only where a sheet comes to the surface as a line across a wall running on flush (sheetlines.js): the visible ones

About a minute. Written 5 November 2026 for the sweep after the fusee's sheet."""
import asyncio,browser,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
import model;PAGE=model.PAGE
def opt(k,d):return type(d)(sys.argv[sys.argv.index(k)+1]) if k in sys.argv else d
TOL=opt('--tol',0.005);MIN=opt('--min',0.001)
STATES=[('as loaded',None)]+[(n,e) for n,e in model.cfg('HOLE_STATES',[]) if n!='last']
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0),E=1000+s.prog;mv.userData._u({E,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false,arm:0,blk:0});})()"""   # audit.py's frozen state
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS);w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(1500);await w.close()
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE,timeout=120000);await pg.wait_for_function("window.__mv&&!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(1500)
        await pg.evaluate(f"window.__SHEETTOL={TOL}");await pg.evaluate(FREEZE);await pg.wait_for_timeout(300)
        js=open(HERE/('sheetlines.js' if '--lines' in sys.argv else 'sheets.js'),encoding='utf-8').read();R=[]
        for n,e in STATES:
            if e:await pg.evaluate(e);await pg.wait_for_timeout(500)
            r=json.loads(await pg.evaluate(js));print(f"{n}: {r['meshes']} new meshes");R+=[dict(h,state=n) for h in r['hits']]
        await b.close();return R,errs
def main():
    R,errs=asyncio.run(run())
    if '--lines' in sys.argv:
        R.sort(key=lambda x:-x['len'])
        for x in R:print(f"{x['part']:22s} {x['len']:9.2f} mm  at {x['at']}  {x['hn']} {x['type']}{'' if x['vis'] else ' (hidden)'}  [{x['state']}]")
        print(f"{len(R)} meshes with a line where a sheet comes to the surface, {sum(x['len'] for x in R):.1f} mm");return 1 if errs else 0
    R=[x for x in R if x['area']>=MIN];R.sort(key=lambda x:(x['kind']!='in',-x['area']))
    for x in R:print(f"{'WITHIN ' if x['kind']=='in' else 'between'} {x['part']:22s} {x['area']:9.4f} mm²  gap {x['gap']:.1e}  n {x['n']}  at {x['c']}  {x['lines']}  [{x['state']}]")
    w=[x for x in R if x['kind']=='in'];print(f"{len(w)} within one mesh ({sum(x['area'] for x in w):.3f} mm²), {len(R)-len(w)} between meshes of one part")
    if '--json' in sys.argv:pathlib.Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps(R,indent=1),encoding='utf-8')
    for e in errs:print('page error:',e)
    F=opt('--fail',0.0)
    return 1 if errs or (F and any(x['area']>F for x in w)) else 0
if __name__=='__main__':sys.exit(main())
