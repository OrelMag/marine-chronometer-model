"""Assembly clearance for a model without the Hamilton's overhaul (overhaul.py runs the manual's operations on the Hamilton's page): the model's sequence
(its checks.py's ASSEMBLY) taken apart one step at a time, each step's parts drawn straight off along the arbors, without passing through a part still in.

    python assembly.py --model wempe              # every step; exit code 1 on any failure (about 1 minute)
    python assembly.py --model wempe --json OUT   # and the steps, the pairs met and the expected ones as JSON (the Wempe report's section 19)
    python assembly.py --model wempe --eval JS    # run some JS after the page loads (a planted fault)

assembly-check.js rasters every part as assembled into vertical columns (R mm apart: exploded.py's and overhaul.py's method) and gives, for each pair, the set of
relative rises d at which they meet. Each step moves its parts by D along y, to the train side (-y, the movement lying dial down, as the book works it) or the
dial side (+y), together; the parts of earlier steps are gone. A pair fails at a step if, along the move, it enters a part of its meeting set that didn't hold
where it started (one passes through the other), or the two overlapped as assembled (a pivot in its hole, a screw in its thread) and the move takes them apart
the long way (one dragged along the other). Putting it back together is the same moves backwards, the steps in the other order, so one pass checks both.
A step whose way is {'path': [[x, y, z], ...]} (mm, movement frame, each waypoint from where its parts stand assembled) draws them along those straight legs
instead, sideways too: their columns shifted along it every R in plan and every T in height, a pair failing where they go deeper into a part still in than they
stood assembled (by T). The sequence's 'split' {part: y} makes that part's screws seated past y their own body, NAME.screws, to be taken out first.
Pairs in the sequence's EXPECTED (step, one part, the other, why) are parts a real movement takes off another way (tilted, unhooked, unwound) and print ~~."""
import asyncio,browser,json,re,sys
import model
from playwright.async_api import async_playwright
HERE=model.HERE
JS=(HERE/'assembly-check.js').read_text(encoding='utf-8')
R=0.2;D=120.0;T=0.05   # mm: column spacing; how far a step draws its parts off; overlap as assembled
SEQ=model.cfg('ASSEMBLY')
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0),E=1000+s.prog;mv.userData._u({E,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false,arm:0,blk:0});})()"""   # audit.py's and placements.py's first state: the escapement locked, the fusee 2.5 turns from full wind
async def main():
    if not SEQ:print(f'{model.NAME}: no ASSEMBLY in its checks.py (the Hamilton\'s is overhaul.py)');sys.exit(1)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # see smoke.py
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(model.PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(2000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]')?.click()");await pg.evaluate(FREEZE);await pg.wait_for_timeout(200)   # one state, so a run doesn't depend on the clock (the balance's swing)
        if SEQ.get('setup'):await pg.evaluate(SEQ['setup'])
        if '--eval' in sys.argv:await pg.evaluate(sys.argv[sys.argv.index('--eval')+1])
        if '--where' in sys.argv:   # --where A B lo hi: the columns (x, z, A's interval, B's) where A and B meet at a relative rise in [lo, hi]
            i=sys.argv.index('--where');w=json.loads(await pg.evaluate(JS,{'r':R,'pair':sys.argv[i+1:i+3],'range':[float(sys.argv[i+3]),float(sys.argv[i+4])]}))['where']
            xs=[c[0] for c in w];zs=[c[1] for c in w];print(len(w),'columns; x',min(xs),max(xs),'z',min(zs),max(zs));[print(c) for c in w[::max(1,len(w)//25)]];await b.close();return
        paths=any(isinstance(s[3],dict) for s in SEQ['steps'])
        r=json.loads(await pg.evaluate(JS,{'r':R,'split':SEQ.get('split',{}),'cols':paths}))
        await b.close()
    if errs:print('page errors:',errs)
    bodies=[x['name'] for x in r['bodies']];ix={n:i for i,n in enumerate(bodies)}
    named={p for s in SEQ['steps'] for p in s[2]}|set(SEQ['static'])
    miss=[p for p in named if p not in ix];left=[n for n in bodies if n not in named]
    if miss:print('the sequence names parts the page hasn\'t (or hides):',', '.join(sorted(miss)))
    if left:print('parts the sequence leaves out:',', '.join(left))
    gone=set();fails=[];known=[];rows=[]
    def along(mv,pts):   # a step drawn along a path: for each pair (moving, still in) the deepest it goes into the other past its assembled overlap
        cols=[{tuple(map(int,k.split(','))):v for k,v in c.items()} for c in r['cols']];st={}
        for j,c in enumerate(cols):
            if j in mv or j in gone:continue
            for k,v in c.items():st.setdefault(k,[]).append((j,v))
        def deep(dx,dy,dz):
            o={}
            for i in mv:
                for (x,z),ys in cols[i].items():
                    for j,v in st.get((x+dx,z+dz),()):
                        for a in range(0,len(ys),2):
                            for b in range(0,len(v),2):
                                d=min(ys[a+1]+dy,v[b+1])-max(ys[a]+dy,v[b])
                                if d>o.get((i,j),0):o[(i,j)]=d
            return o
        o0=deep(0,0,0);worst={};p0=[0.0,0.0,0.0]
        for p1 in pts:
            n=max(1,int(max(abs(p1[0]-p0[0])/R,abs(p1[2]-p0[2])/R,abs(p1[1]-p0[1])/T)))
            for s in range(1,n+1):
                f=s/n;x,y,z=[p0[c]+(p1[c]-p0[c])*f for c in range(3)]
                for k,d in deep(round(x/R),y,round(z/R)).items():
                    if d>o0.get(k,0)+T and d>worst.get(k,(0,))[0]:worst[k]=(round(d,2),[round(x,1),round(y,2),round(z,1)])
            p0=p1
        return worst
    for op,title,parts,way in SEQ['steps']:
        mv={ix[p] for p in parts if p in ix};met=[]
        if isinstance(way,dict):
            for (a,c),(d,at) in sorted(along(mv,way['path']).items()):
                A,C=bodies[a],bodies[c];why=next((w for o,ra,rb,w in SEQ['expected'] if o==op and (re.fullmatch(ra,A) and re.fullmatch(rb,C) or re.fullmatch(ra,C) and re.fullmatch(rb,A))),None)
                e=dict(op=op,a=A,b=C,hit=[[d,at]],long=[],why=why);(known if why else fails).append(e);met.append(e)
            rows.append(dict(op=op,title=title,parts=parts,way=way,met=met));gone|=mv;continue
        dy=D*(1 if way=='dial' else -1)
        for q in r['pairs']:
            a,c,m=q['a'],q['b'],q['f']
            if a in gone or c in gone or (a in mv)==(c in mv):continue   # one of them is off already, or neither or both move
            d1=-dy if a in mv else dy;d0=0.0   # d = riseB - riseA
            h0=[x for x in m if x[0]<d0<x[1]]
            hit=[x for x in m if x not in h0 and min(d0,d1)<x[1] and max(d0,d1)>x[0]]
            long=[x for x in h0 if x[0]<d0-T and d0+T<x[1] and (d1-d0)*((x[1]-d0)+(x[0]-d0))>0]
            if not(hit or long):continue
            A,C=bodies[a],bodies[c];why=next((w for o,ra,rb,w in SEQ['expected'] if o==op and (re.fullmatch(ra,A) and re.fullmatch(rb,C) or re.fullmatch(ra,C) and re.fullmatch(rb,A))),None)
            e=dict(op=op,a=A,b=C,hit=hit,long=long,why=why);(known if why else fails).append(e);met.append(e)
        rows.append(dict(op=op,title=title,parts=parts,way=way,met=met));gone|=mv
    for e in known:print(f"~~ step {e['op']}: {e['a']} x {e['b']}: {e['why']}")
    for e in fails:print(f"FAIL step {e['op']} ({next(s[1] for s in SEQ['steps'] if s[0]==e['op'])}): {e['a']} x {e['b']}"+(f"  passes through at {'depth, place' if isinstance(next(s[3] for s in SEQ['steps'] if s[0]==e['op']),dict) else 'd'} {e['hit']}" if e['hit'] else '')+(f"  dragged the long way out of {e['long']}" if e['long'] else ''))
    print(f"{len(bodies)} parts, {len(r['pairs'])} pairs sharing a column, {len(SEQ['steps'])} steps ({SEQ['source']}), {len(known)} expected, {len(fails)} failing")
    if '--json' in sys.argv:
        out=sys.argv[sys.argv.index('--json')+1];json.dump(dict(source=SEQ['source'],steps=rows,static=SEQ['static'],parts=len(bodies),pairs=len(r['pairs']),expected=len(known),fails=len(fails),left=left),open(out,'w',encoding='utf-8',newline='\n'),indent=1);print('wrote',out)
    sys.exit(1 if fails or errs or miss else 0)
asyncio.run(main())
