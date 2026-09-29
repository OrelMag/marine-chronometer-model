"""Fine interference check: every pair of solid meshes, 0.05 mm grid, through the escapement cycle, round the train and over the wind.

    python fine.py            # 18 escapement phases, then 15 train positions and wind states (full wind and winding included)
    python fine.py --dense    # also 101 phases across a full balance swing
    python fine.py --split    # with the split-balance variant shown (open finding 9 in Review-results.md: expect failures)

dyn.py works in 0.4 mm cubes and misses thin overlaps (the escape pinion, the fourth wheel's collet, the sustaining pawl's pivot and the stop-bar
all went unseen; see RESOLVED.md). This one resolves 0.05 mm. Each pair of meshes that meets is listed once, with its largest overlap; pairs in
EXPECTED are intended contacts, each with the reason and the largest overlap seen when it was recorded. Anything else, or an expected pair that
has grown past its limit, is printed as NEW or GREW and makes the exit code 1. The train positions are whole teeth apart: the escape wheel only
ever rests on a whole tooth plus the escapement's progress, and a fractional offset would put it out of step with the balance."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
PH=[0.0,0.232,0.235,0.238,0.242,0.246,0.25,0.255,0.26,0.264,0.28,0.4,0.6,0.74,0.758,0.764,0.77,0.9]   # unlocking 0.232-0.244, impulse 0.237-0.263, passing 0.756-0.773
WIND=[(2.5,False),(8.7,False),(0.05,False),(4,True),(1,False),(6,True),(8.7,True),(0.3,False),(3.3,False),(5.5,False),(7.1,True),(2,False),(0,False),(0,True),(0.02,True)]   # fusee turns from full wind, winding
STATES=[(ph,0,2.5,False) for ph in PH]+[(0.4,97*k,n,w) for k,(n,w) in enumerate(WIND,1)]
# (part:geometry, part:geometry) sorted: (reason, largest volume mm3, largest depth along y mm) seen when recorded
EXPECTED={
 ('bal:Box','bal:Cylinder'):('impulse jewel set in its roller on the staff',0.69,1.1),
 ('bal:Cylinder','bal:Cylinder'):('balance staff, rollers and collet: one assembly',1.49,2.4),
 ('bal:Cylinder','cock:Extrude'):('balance upper pivot in its jewel in the cock',0.93,1.5),
 ('escBridge:Extrude','escW:Cylinder'):('escape wheel upper pivot in its bridge',0.43,0.45),
 ('barrelBridge:Extrude','fusee:Cylinder'):('fusee upper pivot in the barrel bridge',0.051,0.25),
 ('barrelBridge:Extrude','ratchet:Cylinder'):('barrel arbor in the barrel bridge, under the setup ratchet',0.078,0.21),
 ('spawl:Cylinder','spawl:Extrude'):('sustaining pawl on its arbor',0.75,0.6),
 ('det:Cylinder','det:Extrude'):("detent foot's clamp screw and steady pins through the foot",0.17,0.44),
 ('fw:Cylinder','hands:Cylinder'):('seconds hand collet on the fourth arbor',0.33,0.35),
 ('fw:Cylinder','hands:Extrude'):('seconds hand on the fourth arbor',0.15,0.25),
 ('hands:Cylinder','hands:Extrude'):('hour and minute hands nested on their pipes',2.03,0.35),
 ('hands:Cylinder','motion:Cylinder'):('hand collets on the cannon pinion and wind-indicator arbor',0.33,0.35),
 ('hands:Extrude','motion:Cylinder'):('hands on the cannon pinion and wind-indicator arbor',0.17,0.25),
 ('fusee:Extrude','gw:Extrude'):('winding pawls riding the winding ratchet while winding',0.003,0.5),
 ('cock:Extrude','spr:Tube(tube)'):("hairspring's upper end pinned in its stud on the cock",0.021,0.1),
 ('chain:Box','fusee:Lathe'):("chain links on the fusee cone: the groove is turned rings, not a helix, and the links are upright boxes on a slope",0.27,0.5),
 # bevelled holes: polyGeo's bevel narrows the train bridge's holes near one face, and these two pins nearly fill theirs (inside the bridge, not visible)
 ('spawl:Cylinder','trainBridge:Extrude'):('sustaining pawl arbor (r 0.7) in its 0.72 hole: grazes the bevel',0.06,0.18),
 ('barrelBridge:Cylinder','trainBridge:Extrude'):('winding-stop pin (r 0.9) in its 1.0 hole: grazes the bevel',0.035,0.16),
}
FREEZE="""(()=>{{const mv=window.__mv;if(!mv.userData._u){{mv.userData._u=mv.userData.update;mv.userData.update=()=>{{}};}}
  const s=ESC.state({ph});mv.userData._u({{E:1000+{dE}+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n:{n},winding:{w},springOn:true,msOn:false}});}})()"""
async def main():
    states=STATES+([(i/100,0,2.5,False) for i in range(101)] if '--dense' in sys.argv else [])
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});pg.on("pageerror",lambda e:print("ERR",e))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        if '--split' in sys.argv:await pg.evaluate("window.__mv.userData.balance('split')")
        chk=open(HERE/'fine-interference.js').read();seen={}
        for ph,dE,n,w in states:
            await pg.evaluate(FREEZE.format(ph=ph,dE=dE,n=n,w=str(w).lower()))
            for o in json.loads(await pg.evaluate(chk))['out']:
                k=tuple(sorted((o['a'],o['b'])));o['state']=f"ph {ph} +{dE} teeth, {n} turns{' winding' if w else ''}"
                if k not in seen or o['vol']>seen[k]['vol']:seen[k]={**o,'hits':seen.get(k,{}).get('hits',0)}
                seen[k]['hits']+=1
        await b.close()
    bad=0
    for k,o in sorted(seen.items(),key=lambda kv:-kv[1]['vol']):
        e=EXPECTED.get(k);tag='ok  ' if e and o['vol']<=e[1] and o['maxY']<=e[2] else ('GREW' if e else 'NEW ');bad+=tag!='ok  '
        print(f"{tag} {o['vol']:7.3f} mm3 depth {o['maxY']:5.2f}  {k[0]:26s} x {k[1]:26s} @ {','.join(map(str,o['at']))}  ({o['hits']} hits; largest at {o['state']})"+(f"  -- {e[0]}" if e else ''))
    print(f"{len(states)} states, {len(seen)} pairs, {bad} new or grown");sys.exit(1 if bad else 0)
asyncio.run(main())
