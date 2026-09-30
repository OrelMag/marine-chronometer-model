"""Exploded-view clearance: no two parts (or screws) meet anywhere on the Spread slider, 0 to 100 %.

    python exploded.py            # 6 states (escapement phases, train positions, wind); exit code 1 on any failure
    python exploded.py --json f   # also write every pair's meeting set to f (for choosing offsets)
    python exploded.py --eval "__mv.userData.parts.cw.userData.off=-26"   # run some JS after the page loads (a trial offset, a planted fault)

The Exploded view moves each part by userData.off times the spread, and each screw or loose piece (mv.userData.lifted) by its part's offset less its lift, along the movement's y only.
exploded-check.js rasters every body as assembled into vertical columns (R mm apart) and finds, for each pair of bodies, the set of relative offsets
d at which they meet. A pair fails if they meet at full spread (d within GAP of that set, so a thin tooth between columns can't hide a contact), or if
they pass through each other on the way (the segment from 0 to d crosses a part of the set not containing 0: a part that has to move through another,
because its offset is the wrong way round for the order the two are stacked in), or if two that overlap as assembled (a pivot in its hole, a pin
through a part) part the long way, one dragged through the other. Two with the same offset stay as assembled all the way (fine.py checks those).
Checked over escapement phases, train positions and the wind, since the wheels turn and the chain moves in the Exploded view too. Invisible variants
(the split balance) are left out; the mainspring, shown only with Moving parts only, is in."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS=(HERE/'exploded-check.js').read_text(encoding='utf-8')
R=0.2;GAP=0.5;T=0.05   # mm: column spacing; least clearance at full spread; overlap as assembled
STATES=[(0.0,0,2.5,False),(0.25,0,2.5,False),(0.4,37,0.05,False),(0.7,113,8.7,False),(0.4,251,5.5,True),(0.9,409,1,False)]   # (balance phase, escape teeth, fusee turns from full wind, winding)
FREEZE="""(()=>{{const mv=window.__mv;if(!mv.userData._u){{mv.userData._u=mv.userData.update;mv.userData.update=()=>{{}};}}
  const s=ESC.state({ph});mv.userData._u({{E:1000+{dE}+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n:{n},winding:{w},springOn:true,msOn:true,arm:0,blk:0}});}})()"""
async def main():
    pairs={};bodies=None
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(2000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        if '--eval' in sys.argv:await pg.evaluate(sys.argv[sys.argv.index('--eval')+1])
        for ph,dE,n,wd in STATES:
            await pg.evaluate(FREEZE.format(ph=ph,dE=dE,n=n,w=str(wd).lower()))
            r=json.loads(await pg.evaluate(JS,{'r':R}));bodies=r['bodies']
            for q in r['pairs']:pairs.setdefault((q['a'],q['b']),[]).extend(q['f'])
        await b.close()
    if errs:print('page errors:',errs)
    off={b['name']:b['off'] for b in bodies};bad=[b for b in bodies if b['drift']>1e-3]
    for b in bad:print(f"FAIL {b['name']} moves across as well as along y ({b['drift']} mm)")
    fails=[]
    for (a,c),iv in pairs.items():
        iv.sort();m=[]
        for lo,hi in iv:
            if m and lo<=m[-1][1]:m[-1][1]=max(m[-1][1],hi)
            else:m.append([lo,hi])
        pairs[(a,c)]=m;d=off[c]-off[a]
        hit=[x for x in m if x[0]-GAP<d<x[1]+GAP] if abs(d)>1e-6 else []   # d 0: the two move together, as assembled (fine.py checks that)
        thru=[x for x in m if not x[0]<0<x[1] and (x[0]<d and x[1]>0 if d>0 else x[1]>d and x[0]<0)]   # crossed between 0 and d
        thru+=[x for x in m if x[0]<-T<T<x[1] and d*(x[1]+x[0])>0]   # an overlap as assembled (a pivot in its hole) left the long way: dragged through
        if hit or thru:fails.append((a,c,d,hit,thru))
    for a,c,d,hit,thru in sorted(fails):
        print(f"FAIL {a:34s} x {c:34s} d {d:7.2f}"+(f"  meet at full spread {hit}" if hit else '')+(f"  pass through {thru}" if thru else ''))
    print(f"{len(bodies)} bodies, {len(pairs)} pairs sharing a column, {len(fails)} failing, {len(STATES)} states")
    if '--json' in sys.argv:
        pathlib.Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps({'bodies':bodies,'pairs':[{'a':a,'b':c,'f':m} for (a,c),m in pairs.items()]}))
    sys.exit(1 if fails or bad or errs else 0)
asyncio.run(main())
