"""Fine interference check: every pair of solid meshes, 0.05 mm grid, through the escapement cycle, round the train and over the wind.

    python fine.py            # 18 escapement phases, then 15 train positions and wind states (full wind and winding included)
    python fine.py --dense    # also 101 phases across a full balance swing
    python fine.py --split    # with the split-balance variant shown (finding 9 in Review-results.md, fixed)
    python fine.py --eval "__mv.userData.R.timing(3,3)"   # run some JS after the page loads (a variant, the weights, a planted fault)
    python fine.py --hold     # with the balance locking arm locked (the balance held at rest, a timing weight against the arm's finger) and the train-blocking screw down (where a spoke leaves room; else just above the wheel)

dyn.py works in 0.4 mm cubes and misses thin overlaps (the escape pinion, the fourth wheel's collet, the sustaining pawl's pivot and the stop-bar
all went unseen; see RESOLVED.md). This one resolves 0.05 mm. Each pair of meshes that meets is listed once, with its largest overlap; pairs in
EXPECTED are intended contacts, each with the reason and the largest overlap seen when it was recorded. Anything else, or an expected pair that
has grown past its limit, is printed as NEW or GREW and makes the exit code 1. The dial's printed face (userData.surface, an open ring 0.02 over the
brass disc the voxels test) is checked exactly: the least height over it of any part above the disc, outside its arbor holes, at least DIAL_MIN. The barrel's wall (userData.barrelWall) is tested as the solid it
encloses, and barrel-clearance.js then measures, at each wind state, how close every other part comes to the solid the whole barrel sweeps as
it turns (wall, caps, cap screws, hook), and where the mainspring lies inside it. A part closer than BARREL_MIN, not listed in BARREL, fails too. The train positions are whole teeth apart: the escape wheel only
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
 ('det:Cylinder','det:Extrude'):("detent foot's clamp screw and steady pins through the foot, and the shanks of the clamp, detent-adjusting and lock-adjusting screws in the foot and support block (horizontal screws in vertically extruded pieces, which can't be holed across)",1.15,0.95),
 ('det:Buffer','det:Extrude'):("the trip spring's screw through the hole in the spring's foot into the angle bracket's upright leg (Figs. 14, 54), and the bracket's screw along its leg into the cross-piece (horizontal screws in vertically extruded pieces, which can't be holed across)",0.02,0.2),
 ('chain:Cylinder','fusee:Lathe'):("the chain's pin in the fusee's large end",0.12,0.45),
 ('chain:Buffer','chain:Cylinder'):("that pin through the rivet hole of the chain's first link (an outer link: two plates and their rivets)",0.03,0.4),
 ('chain:Box','chain:Extrude'):("the barrel-end hook plate riveted to the chain's last link (an inner link's plate)",0.09,0.2),
 ('chain:Box','chain:Buffer'):("the barrel-end hook plate riveted to the chain's last link (an outer link)",0.03,0.2),
 ('bal:Box','spr:Tube(tube)'):("hairspring's inner end in the clamp on the collet's tongue",0.06,0.35),
 ('bal:Extrude','bal:Lathe'):("the balance screws' shanks in the rim's tapped holes (each screw in a group of its own, R.screws; up to five pairs)",0.6,0.75),
 ('bal:Buffer','bal:Extrude'):("the rim's empty holes, marks set 0.05 into its face (one merged mesh in a group of its own, rebuilt by R.screws)",0.25,0.6),
 ('spr:Box','spr:Tube(tube)'):("hairspring's upper end in the stud's clamp",0.06,0.35),
 # bevelled hole: polyGeo's bevel narrows the train bridge's holes near one face, and this pin nearly fills its hole (inside the bridge, not visible)
 ('barrel:Buffer(drum)','ratchet:Cylinder'):("barrel arbor and its core, on the barrel's axis: it carries the barrel and the mainspring's inner end",215,16.5),
 ('barrel:Buffer(drum)','chain:Cylinder'):("the chain's hook: its nose through the hole in the barrel's wall (Figs. 17, 75); the wall is tested as the drum it encloses, so the nose counts as inside it",0.04,0.6),
 ('barrel:Buffer(drum)','barrel:Lathe'):("the barrel cap's five screws, threaded into the lip inside the barrel's rim",0.03,0.45),
 ('barrel:Buffer(drum)','ratchet:Box'):("the barrel arbor's hook for the mainspring's inner end, inside the barrel",1.2,2.5),
 ('ratchet:Cylinder','ratchet:Cylinder'):("the barrel arbor in its squared top's collar: one piece, in two groups so the Exploded view takes the arbor out below with the barrel",7.0,1.2),
 ('fusee:Cylinder','fusee:Cylinder'):("the taper pin through the fusee arbor, under the end plate (their own group, which the Exploded view takes off the arbor's end)",0.25,0.45),
}
CORE=1.74   # mm: the barrel arbor's core (MSPRING.ra - 0.06, movement.js)
BARREL_MIN=0.05   # mm: closest any other part may come to the barrel's swept solid
DIAL_MIN=0.02   # mm: least height of any part over the dial's printed face (it lies 0.02 over the brass disc, which the voxels test)
DIALJS='''(()=>{const mv=window.__mv,T=THREE;let face=null;mv.traverse(o=>{if(o.isMesh&&o.userData.surface)face=o;});mv.updateMatrixWorld(true);
 const inv=new T.Matrix4().copy(mv.matrixWorld).invert(),fy=new T.Vector3().setFromMatrixPosition(face.matrixWorld).applyMatrix4(inv).y,R=face.geometry.parameters.outerRadius,Ri=face.geometry.parameters.innerRadius;
 const holes=[[L.F[0],L.F[1],1.2],[L.Ud[0],L.Ud[1],1.2],[L.C[0],L.C[1],Ri]],pn=o=>{for(let p=o;p;p=p.parent)if(p.userData.partName)return p.userData.partName;return '?';};
 let best=null;const v=new T.Vector3(),m=new T.Matrix4();
 mv.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o===face||pn(o)==='dial'||o.userData.decal||o.userData.surface)return;for(let p=o;p;p=p.parent)if(!p.visible)return;
   const P=o.geometry.attributes&&o.geometry.attributes.position;if(!P)return;m.multiplyMatrices(inv,o.matrixWorld);
   for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(m);if(v.y<fy-0.05||v.y>fy+3||Math.hypot(v.x,v.z)>R||holes.some(([x,z,h])=>Math.hypot(v.x-x,v.z-z)<h))continue;
     const d=v.y-fy;if(!best||d<best.d)best={d:+d.toFixed(3),part:pn(o),type:o.geometry.type.replace('Geometry',''),at:[v.x,v.y,v.z].map(q=>+q.toFixed(2))};}});
 return JSON.stringify({face:+fy.toFixed(3),best});})()'''
BARREL={'ratchet':("barrel arbor: on the barrel's axis, inside it by design",None,None),
 'chain':('chain wound on the drum: its links should touch the wall, not enter it',0,0.1)}   # part: (reason, least, most) clearance allowed; None = any
FREEZE="""(()=>{{const mv=window.__mv;if(!mv.userData._u){{mv.userData._u=mv.userData.update;mv.userData.update=()=>{{}};}}
  const hold={hold},s=ESC.state({ph}),E=1000+{dE}+(hold?0:s.prog),R=mv.userData.R;   /* held: the balance at rest, the escape wheel locked on the detent */
  mv.userData._u({{E,th:hold?0:s.th,lift:hold?0:s.lift,psDef:hold?0:s.psDef,n:{n},winding:{w},springOn:true,msOn:false,arm:hold?1:0,blk:hold?(R.blockClear(E)?1:R.tbs.userData.vFace-0.005):0}});}})()"""
async def main():
    states=STATES+([(i/100,0,2.5,False) for i in range(101)] if '--dense' in sys.argv else [])
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});pg.on("pageerror",lambda e:print("ERR",e))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        if '--split' in sys.argv:await pg.evaluate("window.__mv.userData.balance('split')")
        if '--eval' in sys.argv:await pg.evaluate(sys.argv[sys.argv.index('--eval')+1])
        chk=open(HERE/'fine-interference.js').read();seen={}
        for ph,dE,n,w in states:
            await pg.evaluate(FREEZE.format(ph=ph,dE=dE,n=n,w=str(w).lower(),hold=str('--hold' in sys.argv).lower()))
            for o in json.loads(await pg.evaluate(chk))['out']:
                k=tuple(sorted((o['a'],o['b'])));o['state']=f"ph {ph} +{dE} teeth, {n} turns{' winding' if w else ''}"
                if k not in seen or o['vol']>seen[k]['vol']:seen[k]={**o,'hits':seen.get(k,{}).get('hits',0)}
                seen[k]['hits']+=1
        bc=open(HERE/'barrel-clearance.js').read();near={};spring=None
        for n,w in WIND:
            await pg.evaluate(FREEZE.format(ph=0.4,dE=0,n=n,w=str(w).lower(),hold=str('--hold' in sys.argv).lower()).replace('msOn:false','msOn:true'))
            r=json.loads(await pg.evaluate(bc))
            for o in r['parts']:
                if o['part'] not in near or o['d']<near[o['part']]['d']:near[o['part']]={**o,'state':f"{n} turns{' winding' if w else ''}"}
            sp=r['spring']
            if sp:spring=sp if not spring else {**spring,'rMin':min(spring['rMin'],sp['rMin']),'rMax':max(spring['rMax'],sp['rMax']),'yTop':min(spring['yTop'],sp['yTop']),'yBottom':max(spring['yBottom'],sp['yBottom'])}
        dial=json.loads(await pg.evaluate(DIALJS))
        await b.close()
    bad=0
    for k,o in sorted(seen.items(),key=lambda kv:-kv[1]['vol']):
        e=EXPECTED.get(k);tag='ok  ' if e and o['vol']<=e[1] and o['maxY']<=e[2] else ('GREW' if e else 'NEW ');bad+=tag!='ok  '
        print(f"{tag} {o['vol']:7.3f} mm3 depth {o['maxY']:5.2f}  {k[0]:26s} x {k[1]:26s} @ {','.join(map(str,o['at']))}  ({o['hits']} hits; largest at {o['state']})"+(f"  -- {e[0]}" if e else ''))
    print(f"{len(states)} states, {len(seen)} pairs, {bad} new or grown")
    print(f"\nbarrel: closest approach to its swept solid over {len(WIND)} wind states (mm; negative = inside)")
    nb=0
    for o in sorted(near.values(),key=lambda o:o['d']):
        e=BARREL.get(o['part']);lo,hi=(e[1],e[2]) if e else (BARREL_MIN,None)
        okk=(lo is None or o['d']>=lo) and (hi is None or o['d']<=hi);nb+=not okk
        print(f"{'ok  ' if okk else 'NEAR' if o['d']>=0 else 'HIT '} {o['d']:8.3f}  {o['part']:14s} {o['type']:9s} to the barrel's {o['piece']:16s} @ {','.join(map(str,o['at']))}  ({o['state']})"+(f"  -- {e[0]}" if e else ''))
    if spring:
        s=spring;arb=near.get('ratchet');checks=[(f"innermost coil off the barrel arbor's core (r {CORE})",s['rMin']-CORE),('outermost coil inside the wall',s['wall']-s['rMax']),
          ("below the upper cap's inner face",s['yTop']-s['capTopInner']),("above the lower cap's inner face",s['capBottomInner']-s['yBottom'])]
        print(f"mainspring over the wind: coils {s['rMin']}-{s['rMax']} mm from the axis, {s['yTop']} to {s['yBottom']} in y")
        for t,g in checks:okk=g>=BARREL_MIN;nb+=not okk;print(f"{'ok  ' if okk else 'HIT '} {g:8.3f}  {t}")
    print(f"{nb} barrel problems")
    d=dial['best'];dok=d is None or d['d']>=DIAL_MIN
    print(f"\ndial face (y {dial['face']}): least height of a part over it, outside its arbor holes: "+('nothing over it' if d is None else f"{d['d']:.3f} mm, {d['part']} {d['type']} @ {','.join(map(str,d['at']))}")+f"  {'ok' if dok else 'HIT'} (want {DIAL_MIN} or more)")
    sys.exit(1 if bad or nb or not dok else 0)
asyncio.run(main())
