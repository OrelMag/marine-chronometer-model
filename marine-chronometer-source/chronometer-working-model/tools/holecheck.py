"""Every hole populated: each round hole in a flat face of every part of the movement (screw holes, pivot holes and bushings' bores, jewel holes, pin holes,
gears' bores) is followed along its axis and tested for something in it (a screw's shank, a pivot, an arbor, a pin, a setting), by holecheck.js in the page.
It runs with each balance stop fitted (the Navy's Y-arm, as the page opens, and the manual's locking arm), since each leaves the other's holes. A hole with
nothing in it fails, unless EXPECTED gives the reason it is empty on the real movement too (a hole a figure or a frame shows open, an access hole, a jewel
setting's window, the holes of the stop not fitted). Exit code 1 on an empty hole not expected, or an expected one that is no longer empty or no longer there.

    python holecheck.py [-v] [--json OUT] [--eval JS] [--model wempe]

-v lists every hole and what is in it; --json writes them all; --eval runs code after loading (a planted fault: a screw hidden). About a minute. The model is frozen in one state first, as audit.py
freezes it (placements.py's first state: the escapement locked, the fusee 2.5 turns from full wind), so the parts that turn (the fusee's holes) stand in the same
place every run, or nearly: until 17 October 2026 they stood where the page's clock put them as it loaded, and the fusee's hole 42021 wandered 0.6 mm round, past its
entry's 0.4. The fusee still stands where its catch on the ratchet last left it (update() keeps it from call to call), so its entry gives the hole's distance from
the fusee's axis and its height, at any angle.
--model wempe checks the Wempe's page (tools/model.py): its states are the sheets as last revised and as first drawn (movement.js's setRev; it has no balance
stops), its expected empty holes checks.py's HOLE_EXPECTED, the same form as EXPECTED below."""
import asyncio, json, pathlib, re, sys
import browser
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent
import model; PAGE = model.PAGE   # the model's page: the Hamilton's, or another's with --model NAME (model.py)
RMIN, RMAX = 0.05, 4.0   # mm: smaller is a facet, larger a cut or a recess
FREEZE = """(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0),E=1000+s.prog;mv.userData._u({E,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false,arm:0,blk:0});})()"""   # audit.py's: placements.py's first state
# (part, line or '' for any, centre (movement frame, mm) within 0.4 mm or None for any, the stop fitted or None for both, why it is empty)
# the states the movement is checked in: (name, JS that sets it); the Hamilton's two balance stops, another model's from its checks.py (HOLE_STATES)
STOPS = model.cfg('HOLE_STATES', [(st, "document.querySelector('#stopV button[data-v=\"%s\"]').click()" % st) for st in ('navy', 'arm')])
EXPECTED = model.cfg('HOLE_EXPECTED', [
    ('bal', '42263', None, None, "the impulse roller's three holes, a quarter turn apart from the jewel, open (Figs. 14, 61, 90); the balance turns, so anywhere"),
    ('barrelBridge', '42061', [34.18, -27.16, -3.41], None, "an opening over the train bridge's third pillar screw, its head sunk in a counterbore (23:30): KLUwI2UUCMQ 37:59 has it, about r 3.2 at (35.2, -3.2) through the bushings' similarity"),
    ('cock', '42155', [1.61, -38.26, 10.28], None, "the balance upper endstone setting's window, its endstone filling it 0.3 below"),
    ('lowerBridge', '42159.bl', [1.61, -11.71, 10.28], None, "the balance lower endstone cap's window over its endstone"),
    ('fusee', '42021', {'about': [14.306, -14.519], 'r': 4.264, 'y': -19.45}, None, "(on the fusee, which turns: 4.264 from its axis, L.Fu, at any angle) the second of the two tapped holes in the recess under the fusee's top plate, symmetric about the arbor (25:08.26, their threads seen); the stop-bar spring's end takes the first"),
    ('ltb', '42063', [-8.52, 3.6, 14.19], None, "the counterbore round the third's lower setting at the lower train bridge's face (40:05: each setting in a round recess)"),
    ('pillar', '42057', [1.88, 2.14, -41.36], None, "the mounting ring's small hole at 2.5 deg, seen empty with the dial off (KLUwI2UUCMQ 9:03); what it takes, if anything, unknown (Review-results.md, 'Still open after the collar's height' 2)"),
    ('pillar', '42060', [18.34, -3.86, 12.02], None, "the plate's access hole to the balance lower bridge's screw, for taking the bridge off without taking the movement down (RMG No. 4E019), under the dial"),
    ('sspring', '42016', None, None, "the second hole in the sustaining spring's fixed end, the pin in the first (video 27:26; which one has the pin estimated)"),
    ('trainBridge', '42062', [2.08, -23.76, 30.56], 'navy', "the manual's locking arm's stop pin hole: the arm is off with the Navy's Y-arm fitted"),
    ('trainBridge', '42062', [3.74, -23.76, 30.16], 'navy', "the manual's locking arm's screw hole: the arm is off with the Navy's Y-arm fitted"),
    ('lockArm', '', [-6.96, -30.65, -19.69], 'navy', "the Navy's second dust seal's chamber, closed underneath, the lever through its slot above (illustrative: its inside not seen)"),
    ('barrelBridge', '42061', [-13.96, -27.16, -23.11], 'arm', "the Navy seal's screw hole (13:04.4): the movement drawn is fitted for the Navy's Y-arm, and the manual's arm leaves it empty"),
    ('barrelBridge', '42061', [0.05, -27.16, -16.27], 'arm', "the Navy seal's other screw hole (13:04.4), empty with the manual's arm fitted"),
    ('barrelBridge', '42061', [-15.3, -27.16, -16.75], None, "a hole just beyond the setup cover's end, through the barrel bridge on KLUwI2UUCMQ 13:04.4 (its underside face-on), its use not given by any source"),
    ('barrelBridge', '42061', [-27.72, -27.16, 6.19], None, "a hole just beyond the setup cover's other end (11:48 shows one past its end), through the barrel bridge on KLUwI2UUCMQ 13:04.4 (its underside face-on), its use not given by any source"),
    ('barrelBridge', '42061', [-30.24, -27.16, -2.15], None, "a countersunk hole west of the barrel arbor, through the barrel bridge on KLUwI2UUCMQ 13:04.4 (its underside face-on), its use not given by any source"),
    ('trainBridge', '42062', [-8.7, -23.76, 22.0], None, "a plain hole through the upper train bridge 4 mm beyond the train-blocking screw's (KLUwI2UUCMQ 23:30, 6:49.0, within 1 mm), its use not given by any source"),
    ('pillar', '42060', [-0.6, -3.86, -32.2], None, "a hole at 12 o'clock past the wind indicator's post, through the pillar plate on KLUwI2UUCMQ 9:03 (its dial side face-on), its use not given by any source"),
    ('pillar', '42060', [26.6, -3.86, 19.0], None, "a hole past the access hole at 4 o'clock, through the pillar plate on KLUwI2UUCMQ 9:03 (its dial side face-on), its use not given by any source"),
    ('pillar', '42060', [-31.0, -3.86, 4.2], None, "a hole over the barrel, through the pillar plate on KLUwI2UUCMQ 9:03 (its dial side face-on), its use not given by any source"),
    ('sratchet', '42009', None, None, "the hole through the sustaining ratchet beside each winding pawl's arm, the mat seen through it (KLUwI2UUCMQ 19:12, 28:35; 4f0100d); the wheel turns, so anywhere"),
    ('bal', '42190', None, None, "the hairspring collet's relief hole at the end of its slit (the slit lets the collet grip the staff); the balance turns, so anywhere"),
])
def near(hc, c, tol):
    """the hole's centre against an entry's: a point, or {'about': [x, z], 'r', 'y'}, a hole on a part that turns about that vertical axis (r from it at height y,
    at any angle): the Hamilton's fusee stands where its catch on the ratchet last left it, which the page's history decides even with the model frozen"""
    if isinstance(c, dict):
        return abs(((hc[0] - c['about'][0]) ** 2 + (hc[2] - c['about'][1]) ** 2) ** 0.5 - c['r']) < tol and abs(hc[1] - c['y']) < tol
    return sum((a - b) ** 2 for a, b in zip(hc, c)) ** 0.5 < tol
def matches(h, e, tol=0.4):
    p, hn, c, st, why = e
    return re.fullmatch(p, h['part']) and (not hn or re.fullmatch(hn, h['hn'] or '')) and (c is None or near(h['c'], c, tol)) and (st is None or h['stop'] in st.split())
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=browser.ARGS)
        w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(3000); await w.close()   # see smoke.py
        pg = await b.new_page(viewport={"width": 800, "height": 600}); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(PAGE); await pg.wait_for_function("!document.querySelector('#loading')", timeout=120000); await pg.wait_for_timeout(1500)
        await pg.evaluate("(()=>{const m=document.querySelector('#merge');if(m&&m.checked)m.click();})()")   # Performance mode off: every piece drawn as itself
        await pg.evaluate(FREEZE); await pg.wait_for_timeout(500)
        if '--eval' in sys.argv: await pg.evaluate(sys.argv[sys.argv.index('--eval') + 1])
        r = []
        for st, js in STOPS:
            await pg.evaluate(js); await pg.wait_for_timeout(300)
            res = await pg.evaluate(open(HERE / 'holecheck.js', encoding='utf-8').read(), {'rmin': RMIN, 'rmax': RMAX, 'wall': model.cfg('HOLE_WALL', False)})
            for h in res['holes']: h['stop'] = st; r.append(h)
            if '-v' in sys.argv:
                for k in res['skipped']: print(f"--  {st:4s} {k['part']:14s} {k['hn']:12s} r {k['r']:.3f} @ {k['c']} depth {k['depth']}: skipped, {k['why']}")
        await b.close()
    if errs: print('page errors:', errs)
    if '--json' in sys.argv: pathlib.Path(sys.argv[sys.argv.index('--json') + 1]).write_text(json.dumps(r, indent=1), encoding='utf-8', newline='\n')
    empty = [h for h in r if not h['in']]; fails = []; used = set()
    for h in sorted(r, key=lambda h: (h['part'], h['hn'], h['c'])):
        e = next((i for i, e in enumerate(EXPECTED) if matches(h, e)), None)
        if h['in']:
            e = next((i for i, e in enumerate(EXPECTED) if e[2] is not None and not isinstance(e[2], dict) and matches(h, e, 0.05)), None)   # a hole an entry pins down, filled since (one given by its radius about an axis: below)
            if '-v' in sys.argv: print(f"ok  {h['stop']:4s} {h['part']:14s} {h['hn']:12s} r {h['r']:.3f} @ {h['c']}  holds {', '.join(h['in'])}")
            if e is not None: fails.append(f"no longer empty: {h['part']} {h['hn']} @ {h['c']} (EXPECTED: {EXPECTED[e][4]})")
            continue
        if e is not None: used.add(e); print(f"~~  {h['stop']:4s} {h['part']:14s} {h['hn']:12s} r {h['r']:.3f} @ {h['c']} axis {h['ax']} depth {h['depth']}: {EXPECTED[e][4]}"); continue
        fails.append(f"EMPTY {h['stop']:4s} {h['part']:14s} {h['hn']:12s} {h['geo']:10s} r {h['r']:.3f} @ {h['c']} axis {h['ax']} depth {h['depth']}"+(f"  (on its axis beyond it: {', '.join(h['near'])})" if h.get('near') else ''))
    for i, e in enumerate(EXPECTED):
        if i not in used and (isinstance(e[2], dict) or not any(matches(h, e) for h in r)): fails.append(f"expected hole gone or filled: {e[0]} {e[1]} @ {e[2]} ({e[3]})")   # one given by its radius: a filled hole at that radius may be its twin (the fusee's first, which the stop-bar spring's end takes), so it must be found empty
    for f in fails: print(f)
    print(f"{len(r)} holes over {len(STOPS)} states ({', '.join(n for n, _ in STOPS)}), {len(r) - len(empty)} populated, {len(used)} expected empty, {len(fails)} failing")
    sys.exit(1 if fails or errs else 0)
asyncio.run(main())
