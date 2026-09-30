"""Placements: prove a geometry change moved nothing it shouldn't, and the mechanism still moves as before.

    python placements.py dump before                           # every mesh's place, in 7 model states, into placements_before.json
    python placements.py dump main --page ../../other/index.html   # the same from another copy of the page (a worktree of main)
    python placements.py --diff before after                   # parts whose meshes moved, grew or changed count

The states are escapement phases (locked, impulse, passing) and train and wind positions (full wind, run down, winding), set as fine.py sets them,
so moving parts are compared where they are, not where the clock left them. For each mesh (numbered in order within its part) it records the
geometry type, its position and its bounding box in the movement's frame; --diff lists, per part, what differs by more than 0.005 mm (position)
or 0.02 mm (box). A part that was rebuilt shows here; every other part should not."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
STATES=[(0.0,0,2.5,False),(0.25,0,2.5,False),(0.764,0,2.5,False),(0.4,97,8.7,False),(0.4,194,0.05,False),(0.4,291,4,True),(0.4,388,0,True)]   # (phase, teeth, fusee turns from full wind, winding)
FREEZE="""(()=>{{const mv=window.__mv;if(!mv.userData._u){{mv.userData._u=mv.userData.update;mv.userData.update=()=>{{}};}}
  const s=ESC.state({ph}),E=1000+{dE}+s.prog;mv.userData._u({{E,th:s.th,lift:s.lift,psDef:s.psDef,n:{n},winding:{w},springOn:true,msOn:false,arm:0,blk:0}});}})()"""
DUMP="""(()=>{const mv=window.__mv;let root=mv;while(root.parent)root=root.parent;root.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),M=new THREE.Matrix4(),b=new THREE.Box3(),v=new THREE.Vector3(),out={},cnt={};
  root.traverse(o=>{if(!o.isMesh||!o.geometry.attributes||!o.geometry.attributes.position)return;let n=o,pn=null;while(n&&!pn){pn=n.userData.partName;n=n.parent;}pn=pn||'?';
    const i=cnt[pn]=(cnt[pn]||0)+1;M.multiplyMatrices(inv,o.matrixWorld);o.geometry.computeBoundingBox();b.copy(o.geometry.boundingBox).applyMatrix4(M);v.setFromMatrixPosition(M);
    out[pn+'#'+i]=[o.geometry.type,[v.x,v.y,v.z].map(x=>+x.toFixed(4)),[b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z].map(x=>+x.toFixed(3))];});return out;})()"""
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
async def dump(tag,page):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # see smoke.py
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(page);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        res=[]
        for ph,dE,n,wd in STATES:
            await pg.evaluate(FREEZE.format(ph=ph,dE=dE,n=n,w='true' if wd else 'false'));res.append(await pg.evaluate(DUMP))
        pathlib.Path(f'placements_{tag}.json').write_text(json.dumps(res));print(f'placements_{tag}.json: {len(res)} states, {len(res[0])} meshes; page errors: {errs}')
        await b.close()
def diff(a,b):
    A=json.loads(pathlib.Path(f'placements_{a}.json').read_text());B=json.loads(pathlib.Path(f'placements_{b}.json').read_text());parts={}
    for si,(sa,sb) in enumerate(zip(A,B)):
        for k in sorted(set(sa)|set(sb)):
            pn=k.split('#')[0];d=parts.setdefault(pn,{'na':0,'nb':0,'moved':set(),'dp':0,'db':0,'type':set()})
            if si==0:d['na']+=k in sa;d['nb']+=k in sb
            if k in sa and k in sb:
                ta,pa,ba=sa[k];tb,pb,bb=sb[k];dp=max(abs(x-y) for x,y in zip(pa,pb));db=max(abs(x-y) for x,y in zip(ba,bb))
                if ta!=tb:d['type'].add(f'{k} {ta}->{tb}')
                if dp>0.005 or db>0.02:d['moved'].add(k);d['dp']=max(d['dp'],dp);d['db']=max(d['db'],db)
    ch=0
    for pn,d in sorted(parts.items()):
        if d['na']==d['nb'] and not d['moved'] and not d['type']:continue
        ch+=1
        if d['na']!=d['nb']:   # meshes added or taken away renumber the rest: match them by type and box instead, in every state
            key=lambda s,k:(s[k][0],tuple(round(x,2) for x in s[k][2]))
            gone,new=set(),set()
            for sa,sb in zip(A,B):
                ka=[key(sa,k) for k in sa if k.split('#')[0]==pn];kb=[key(sb,k) for k in sb if k.split('#')[0]==pn]
                for x in ka:
                    if x in kb:kb.remove(x)
                    else:gone.add(x)
                new|=set(kb)
            print(f"{pn:14s} meshes {d['na']}->{d['nb']}  matched by box: {len(gone)} gone, {len(new)} new (any state)")
            for t,bx in sorted(gone)[:8]:print('    gone',t,bx)
            for t,bx in sorted(new)[:8]:print('    new ',t,bx)
            continue
        print(f"{pn:14s} meshes {d['na']}->{d['nb']}  moved or resized {len(d['moved'])} (position {d['dp']:.3f} mm, box {d['db']:.3f} mm)"+('  '+'; '.join(sorted(d['type'])[:3]) if d['type'] else ''))
        for k in sorted(d['moved'],key=lambda s:int(s.split('#')[1]))[:6]:print('   ',k)
    print(f'{ch} of {len(parts)} parts differ')
if sys.argv[1:2]==['--diff']:diff(sys.argv[2],sys.argv[3])
elif sys.argv[1:2]==['dump']:asyncio.run(dump(sys.argv[2],pathlib.Path(arg('--page',HERE.parent/'index.html')).resolve().as_uri()+'?snap&qa'))
else:print(__doc__)
