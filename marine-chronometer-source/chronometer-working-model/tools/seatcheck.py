"""Every pin seated: each straight piece that is held by going into another part (a pin, a screw, a pipe, a bush, a hook: its bom.json line named so, SEAT_NAME)
is followed along its own axis by seatcheck.js in the page, and somewhere along it one other part must be round it (a hole, not a slot or nothing), and its own metal must not lie in another part's (a pin buried in solid metal, no hole drilled for it: BURIED). It is the
other half of holecheck.py (every hole filled): the Wempe's hairspring stud was drawn with a slot its sheet doesn't have and its pin lying in it beside the spring,
in no hole (RESOLVED.md, 27 October 2026), and the drawn Ø 0.7 hole left out; holecheck.py found no empty hole, since the hole was never built, and audit.py's
loose ends test only cylinders 2.5 long or more, and only that their ends are in something. A piece held another way, on the real chronometer too, is in
SEAT_EXPECTED (checks.py's for another model) with its reason. Exit code 1 on a piece held nowhere and not expected, or an expected one now held or gone.

    python seatcheck.py [--model wempe] [-v] [--json OUT] [--eval JS] [--state a,b] [--page PATH]

--page checks another copy of index.html (a worktree at another commit). --state checks only those states (the expected entries then aren't required). -v lists every piece and what holds it. The model is frozen as holecheck.py freezes it, in each of its states (HOLE_STATES). About a minute a state."""
import asyncio, json, pathlib, re, sys
import browser
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent
import model; PAGE = model.PAGE
if '--page' in sys.argv: PAGE = pathlib.Path(sys.argv[sys.argv.index('--page') + 1]).resolve().as_uri() + model.PAGE[model.PAGE.index('?'):]   # another copy of the page (a worktree of main): a before/after
FREEZE = """(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0),E=1000+s.prog;mv.userData._u({E,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false,arm:0,blk:0});})()"""   # holecheck.py's
STATES = model.cfg('HOLE_STATES', [(st, "document.querySelector('#stopV button[data-v=\"%s\"]').click()" % st) for st in ('navy', 'arm')])
NAME = model.cfg('SEAT_NAME', r'(?i)\b(pins?|stift|kerbstift|stellstift|stud|pipe|post|rivet|niet|peg|dowel|screws?|schraube|bush|hook|haken)\b|rohr|futter')   # the German compounds' last words anywhere in a word (Minutenrohr, Zeigerfutter, Schlüsselrohr): until 28 October 2026 only as words of their own, so the Wempe's cannon tube and seconds collet were never followed (drawing check 2's 7-M6)
SKIP = model.cfg('SEAT_SKIP', r'(?i)holzschraube|DIN 96')   # lines not in the movement's metal (wood screws)
# (part, line, why it is held another way[, the states it holds in, space-separated])
EXPECTED = model.cfg('SEAT_EXPECTED', [])
STEP, GAP, NEED, EMB = 0.1, 0.04, 10, 2
async def main():
    lines = json.loads((model.DIR / 'bom.json').read_text(encoding='utf-8'))['lines']
    hns = [l['id'] for l in lines if re.search(NAME, l['name']) and not re.search(SKIP, l['name'])]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=browser.ARGS)
        w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(3000); await w.close()   # see smoke.py
        pg = await b.new_page(viewport={"width": 800, "height": 600}); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_function("!document.querySelector('#loading')", timeout=120000); await pg.wait_for_timeout(1500)
        await pg.evaluate("(()=>{const m=document.querySelector('#merge');if(m&&m.checked)m.click();})()")
        await pg.evaluate(FREEZE); await pg.wait_for_timeout(500)
        if '--eval' in sys.argv: await pg.evaluate(sys.argv[sys.argv.index('--eval') + 1])
        r = []
        for st, js in STATES:
            if '--state' in sys.argv and st not in sys.argv[sys.argv.index('--state') + 1].split(','): continue
            await pg.evaluate(js); await pg.wait_for_timeout(300)
            for h in await pg.evaluate(open(HERE / 'seatcheck.js', encoding='utf-8').read(), {'hns': hns, 'step': STEP, 'gap': GAP, 'need': NEED}): h['state'] = st; r.append(h)
        await b.close()
    if errs: print('page errors:', errs)
    if '--json' in sys.argv: pathlib.Path(sys.argv[sys.argv.index('--json') + 1]).write_text(json.dumps(r, indent=1), encoding='utf-8', newline='\n')
    fails, used = [], set()
    for h in sorted(r, key=lambda h: (h['hn'], h['state'], h['c'])):
        e = next((i for i, e in enumerate(EXPECTED) if re.fullmatch(e[0], h['part']) and re.fullmatch(e[1], h['hn'].split('|')[0]) and (len(e) < 4 or h['state'] in e[3].split())), None)
        if h['emb'] >= EMB:   # buried in another part's metal over 0.3 mm or more: no hole for it
            if e is not None: used.add(e); print(f"~~  {h['state']:5s} {h['part']:14s} {h['hn']:14s} @ {h['c']}: {EXPECTED[e][2]}"); continue
            fails.append(f"BURIED     {h['state']:5s} {h['part']:14s} {h['hn']:14s} r {h['r']:.3f} len {h['len']:5.2f} @ {h['c']}  {h['emb']} steps (of {h['steps']}: {h['embAt'][0]}-{h['embAt'][-1]}) in {', '.join(h['embBy'])}'s metal"); continue
        if h['held']:
            if '-v' in sys.argv: print(f"ok  {h['state']:5s} {h['part']:14s} {h['hn']:14s} r {h['r']:.3f} len {h['len']:5.2f} @ {h['c']}  held {h['held']}/{h['steps']} by {', '.join(h['by'])}")
            if e is not None: fails.append(f"no longer held another way: {h['state']} {h['part']} {h['hn']} @ {h['c']} held by {', '.join(h['by'])} (SEAT_EXPECTED: {EXPECTED[e][2]})")
            continue
        if e is not None: used.add(e); print(f"~~  {h['state']:5s} {h['part']:14s} {h['hn']:14s} @ {h['c']}: {EXPECTED[e][2]}"); continue
        fails.append(f"NOT SEATED {h['state']:5s} {h['part']:14s} {h['hn']:14s} r {h['r']:.3f} len {h['len']:5.2f} @ {h['c']} axis {h['ax']}  best {h['best']}/12 by {h['bestBy'] or 'nothing'}")
    for i, e in enumerate(EXPECTED):
        if i not in used and '--state' not in sys.argv: fails.append(f"expected entry unused (piece held, or gone): {e[0]} {e[1]} ({e[2][:80]})")
    for f in fails: print(f)
    print(f"{len(r)} pieces over {len(STATES)} states ({', '.join(n for n, _ in STATES)}), {sum(1 for h in r if h['held'])} seated, {len(used)} expected, {len(fails)} failing")
    sys.exit(1 if fails or errs else 0)
asyncio.run(main())
