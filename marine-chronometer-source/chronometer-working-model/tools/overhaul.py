"""Overhaul clearance: the manual's operations (js/overhaul.js) take each part off, and put it back, without passing through another.

    python overhaul.py            # every operation of both sequences; exit code 1 on any failure
    python overhaul.py --eval "OVH.HOST['42015']=0"   # run some JS after the page loads (a trial host, a planted fault)

The overhaul moves every piece along the movement's y only, as the Exploded view does, one operation at a time: what an operation takes off goes to where
the Exploded view puts it, carried meanwhile by what it rides on (HOST). overhaul-check.js rasters every body as assembled into vertical columns (R mm apart:
exploded.py's method) and finds, for each pair, the set of relative rises d at which they meet; then follows each operation's path as the page moves it
(N+1 points, every part of the step by the same share); what the step leaves in the cleaning tray is out of the way. A pair fails at an operation if its d, moving along the path, enters a part of the set that doesn't
hold where it started (one passes through the other, or comes to rest in it), or if the two overlapped as assembled (a pivot in its hole, a screw in its
thread) and the move takes them apart the long way (one dragged through the other). Checked in the page as loaded, the model stopped."""
import asyncio,browser,json,pathlib,re,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS=(HERE/'overhaul-check.js').read_text(encoding='utf-8')
R=0.2;N=40;T=0.05   # mm: column spacing; path samples; overlap as assembled
FU='42021|42015|42016|42009|42001 #.*|42001'
DET='the detent is drawn out sideways from under the upper train bridge (KLUwI2UUCMQ 10:51-11:06), not lifted, as the overhaul shows it'
# what may pass through what, with the reason: (sequence, operations, one body, the other, why). A real movement does these another way than straight along
# the arbors, or the model can't yet (a reading still open); everything else must clear
EXPECTED=[
    ('d',{26},'@det','.*',DET),('r',{80,89,92,94,95},'@det','.*',DET),
    ('d',{38},FU,'@trainBridge','the fusee comes out tilted, its wheel\'s edge from under the upper train bridge (its teeth reach under the bridge to the centre pinion): the video lifts it out with the bridge still on (KLUwI2UUCMQ 13:06-13:33; the bridge off at 13:36-13:48), as the manual\'s order has it'),
    ('r',{34},FU,'@trainBridge','the fusee goes in tilted, its wheel\'s edge under the upper train bridge (the disassembly\'s Op. 38, the other way)'),
    ('d',{38},FU,'@spawl','the sustaining pawl is held aside (Op. 38: "release sustaining pawl")'),('r',{34},FU,'@spawl','the sustaining pawl is held aside (Op. 34)'),
    ('d',{33},'42168|42169','42001 #[34]','the chain\'s end was unhooked from the barrel at Op. 8; the overhaul leaves it where it hung'),('r',{40},'42168|42169','42001 #[34]','the chain\'s end is hooked on at Op. 53, after the barrel is in'),
    ('d',{39},'42021','42001 #.*','the chain is unwound from the fusee\'s groove, not lifted off it'),('r',{33},'42021','42001 #.*','the chain is wound onto the fusee\'s groove, not dropped onto it'),
    ('r',{28},'42021','42020','the taper pin goes in across the arbor, through its hole (Fig. 70)'),
    ('r',{99},'42032|42033','42034 #.*|42034','the manual sets the minute hand to 12 and the hour hand to 3 first (Op. 64): the model\'s hands show the time'),
    ('d',{37},'42168','42037','the brace lies against the barrel\'s wall, inside the raster\'s 0.2 mm columns: it slides out along the wall'),('r',{35},'42168','42037','the brace lies against the barrel\'s wall, inside the raster\'s 0.2 mm columns: it slides in along the wall')]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # see smoke.py
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(2000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        await pg.evaluate("document.querySelector('#stopV button[data-v=\"arm\"]').click()")   # the manual's locking arm, as the overhaul shows it (the Navy's Y-arm isn't in its operations)
        if '--eval' in sys.argv:await pg.evaluate(sys.argv[sys.argv.index('--eval')+1])
        r=json.loads(await pg.evaluate(JS,{'r':R,'n':N}))
        await b.close()
    if errs:print('page errors:',errs)
    bodies=[x['name'] for x in r['bodies']];fails=[];known=[]
    for st in r['steps']:
        P=st['path'];aw=set(st['away'])
        for q in r['pairs']:
            a,c,m=q['a'],q['b'],q['f']
            if a in aw or c in aw:continue   # one of them is in the tray
            d=[s[c]-s[a] for s in P]
            if max(d)-min(d)<1e-6:continue   # the pair didn't move against each other in this step
            d0,d1=d[0],d[-1];h0=[x for x in m if x[0]<d0<x[1]];h1=[x for x in m if x[0]<d1<x[1]]   # the parts of the meeting set where the pair starts and ends (overlapping as assembled), if any
            hit=[x for x in m if x not in h0 and x not in h1 and any(min(u,v)<x[1] and max(u,v)>x[0] for u,v in zip(d,d[1:]))]   # entered another part of it on the way
            long=[x for x in h0 if x[0]<d0-T and d0+T<x[1] and (d1-d0)*((x[1]-d0)+(x[0]-d0))>0]+[x for x in h1 if x not in h0 and x[0]<d1-T and d1+T<x[1] and (d0-d1)*((x[1]-d1)+(x[0]-d1))>0]   # left an overlap, or came into one, the long way round
            if hit or long:
                why=next((w for sq,ops,ra,rb,w in EXPECTED if sq==st['q'] and st['op'] in ops and (re.fullmatch(ra,bodies[a]) and re.fullmatch(rb,bodies[c]) or re.fullmatch(ra,bodies[c]) and re.fullmatch(rb,bodies[a]))),None)
                (known if why else fails).append((st['q'],st['op'],st['t'],bodies[a],bodies[c],round(d0,2),round(d1,2),hit,long,why))
    seen=set()
    for q,op,tt,a,c,d0,d1,hit,long,why in known:
        if (q,why) in seen and '-v' not in sys.argv:continue
        n=sum(1 for k in known if k[0]==q and k[9]==why)-1;seen.add((q,why))
        print(f"~~ {'disassembly' if q=='d' else 'reassembly'} Op. {op} ({tt}): {a} x {c}: {why}"+(f" (and {n} more like it)" if n and '-v' not in sys.argv else ''))
    for q,op,tt,a,c,d0,d1,hit,long,why in fails:
        print(f"FAIL {'disassembly' if q=='d' else 'reassembly'} Op. {op} ({tt}): {a} x {c}, d {d0} to {d1}"+(f"  pass through {hit}" if hit else '')+(f"  dragged through {long}" if long else ''))
    nd=sum(1 for s in r['steps'] if s['q']=='d');print(f"{len(bodies)} bodies, {len(r['pairs'])} pairs sharing a column, {nd} + {len(r['steps'])-nd} operations, {len(known)} expected, {len(fails)} failing")
    sys.exit(1 if fails or errs else 0)   # the expected (~~), one of each listed (-v: all), don't fail
asyncio.run(main())
