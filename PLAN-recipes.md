# Parts as recipes: STEP files and operation sheets in place of the build book

On 29 October 2026 the owner judged the Wempe's build book (`tools/drawbook*.py`, a 525-page PDF of DIN-style sheets) unsatisfactory. The content was wrong
or garbled, the format was wrong for making, and it looked unprofessional. The sheets were drawn backwards from the page's triangles, so design intent was
lost before a line was drawn: cut-outs came out as zero-length lines, and sizes printed twice. The owner chose its replacement: each part as a **recipe**,
the operations a maker performs with the model's own numbers. From the recipe come the part's exact solid (a **STEP** file for CAM) and a short
**operation sheet**. The reader is a CNC maker, and the Wempe comes first.

## The format

`marine-chronometer-source/chronometer-working-model/tools/recipes/` (the engine, `__init__.py`; a model's recipes, `wempe.py`):

- A `Recipe` is the part's key, its parts-list line as the page tags it (`hn`), its title, its drawing, its material and treatment as the drawing gives
  them, its fits, its notes, and its **setups in order**. Each setup says how the part is held, then lists its operations.
- An `Op` cuts or forms the solid (`apply`) and says what it does with only the sizes it cuts (`sizes`: label, figure, tolerance or fit, source). Kinds:
  stock (`Bar`, `Ring`, `Plate` with a contour of lines and arcs), turning (`TurnOD`, `TurnCone`, `FaceGroove`), boring (`Bore`, `Countersink`), threads
  (`ThreadOD`, a `thread=` on a `Bore` or `Hole`), drilling (`Hole` from either face, through or to a depth; `Cone` for a sink or a drill point) and
  milling (`Pocket` to a depth or through, `SlotHead`). Each op is one or two booleans in build123d (OpenCascade), so the solid is exact B-rep: planes,
  cylinders, cones, tori. No triangles.
- **Numbers.** WD and WESC come from the page's own `dims.js` and `escapement.js`, run in Node by `wempe_load.js` (`recipes/wempe.py`'s `W()`), so a
  recipe never restates a number the page has. The few the page keeps as literals beside the part in `frame.js` (the cork ring's sizes; the plates'
  reamed and tapped radii) are restated with the line they come from. Phase 1 moves them into `dims.js`.
- **The part's frame.** A turned part's axis is Z, its first face at Z 0. A flat part lies in XY as its sheet draws it (X the sheets' O, Y their N), its
  inner face at Z 0. `to_page` (a proper rotation and a shift) maps it onto the page's mesh of the part.
- **Threads by convention** (DIN ISO 6410). In the solid an outside thread is a cylinder at its major diameter and an inside one a bore at its minor (the
  tap drill). The thread is a note on the sheet. The page draws the helix, so the check allows the thread's depth there.
- `expect`: where the page's mesh is known to depart from the drawing, with a bound and the reason. The check reports these and doesn't fail on them.

## The tools

- `python recipes.py --model wempe [--only a,b] [--step [DIR]] [--sheet [DIR]] [--check] [--json OUT] [--fault]` (about 1½ minutes with `--check`, 1 s
  without). It builds each recipe and writes `KEY.step`, `KEY.stl` and `KEY.html` (the operation sheet) into `tools/r_recipes/MODEL/` (ignored).
  `--check` compares each solid with the page's own mesh of the part: volume (coarse, 0.5 %), bounding box (0.02), the two surfaces sampled each to the
  other outside the threads (0.02, with the five worst places and the hole nearest each), and every round hole of a flat part measured on the page by
  rays from its axis (centre 0.01, diameter 0.01; a tapped hole's rays span a pitch). It exits 1 on a failure. `--fault` plants one in the top plate
  (hole 7 0.03 large, hole 13 0.02 off its place), which it must fail on: it does, on both holes and the surface.
- `python recipes_section.py --model wempe KEY Z [x0 x1 y0 y1] [OUT]` (about a minute) cuts the recipe and the page at one level and draws them over each
  other.

## The pilot (29 October 2026): four parts, every check passing

| Part | Kind | Operations | Volume, recipe / page | Surface apart (max) | Holes |
|---|---|---|---|---|---|
| Cork ring 05 08 01-4 | punched ring | 1 | 478.71 / 478.10 (the page's 72-gon) | 0.0075 | – |
| Pillar 05 08 00-1 | turned, two setups, tapped through | 12 | 973.92 / 953.06 (the page's helix) | 0.013 | – |
| Pillar screw WN-57 | turned, threaded, slotted | 6 | 133.08 / 124.43 (helix) | 0.016 | – |
| Top plate 05 09 01 | crescent plate, 55 holes, pocket, opening | 63 | 12960.90 / 12943.83 | 0.047, expected (below) | 47 measured: plain holes within 0.0032 in Ø, centres within 0.0002 |

What the check found, each sorted into a fault in the recipe or a fault in the old mesh:

- **A fault in the recipe, fixed.** The top plate's pocket N-O, beside the tongue. I took the sheet's "common tangents" as running all the way to the
  opening's r 5. The page leaves the plate whole between the tangent's point on r 5 and the tongue, since 05 08_1b dashes the edge only from the
  tongue's far side (frame.js). The check showed 0.24 mm there; `recipes_section.py` showed where. The recipe now leaves that corner standing.
- **Faults in the old mesh, reported:**
  - The pocket's far side is drawn tangent to r 4.95, not the sheet's r 5 (frame.js does it so the edges cross cleanly): 0.047 mm. It's the recipe's
    first `expect` entry.
  - The pillar screw's shank runs 0.1 into its head as a second solid, so 862 sample points on internal faces are left out. Where the page runs the
    thread out to its root and cones the tip from there, the recipe cones from the crest (inside the thread's allowance).
  - Every turned face on the page is a 72-sided polygon (0.0075 mm at the cork ring's rim). That's why the volume check is coarse and the surface check
    is the fine one.
- **Thread convention.** The page draws tapped holes at the thread's size + 0.02 as a helix, the recipe at the tap drill. Reported for each of the 11
  tapped holes, not failed.

## The format's weak spots (to settle in phase 1)

1. **Numbers in two places** (the frame's moved in batch 1; the rest as each batch reaches its parts). `frame.js` keeps some sizes as literals beside the part (cork ring, `rM26`, `rPinP`, `rJ`, the tongue's 113.5° and 0.85).
   The recipe restates them with the line they come from. Move every such literal into `dims.js` (WD), so the page and the recipe read one value.
2. **The page and the recipe are still two builders.** Until the page's mesh is made from the recipe (phase 3), a change to one must be checked against the
   other. `recipes.py --check` is that check.
3. **Derived geometry is ported by hand.** The pocket's corner logic in the recipe is a second copy of frame.js's. Sizes come through WD; constructions
   don't. Phase 3 removes the copy.
4. **The STEP files carry the part's name only.** Thread specs, fits and tolerances are on the sheet, not in the STEP file (AP242 PMI would carry them;
   OpenCascade's writer can set face names and colours, the minimum a maker's CAM reads).
5. **No sketch on the sheets yet.** The sheet lists the setups, sizes, fits and sources. A small plan or section per setup (from the B-rep, which now has
   exact edges, unlike the old book) is phase 2.
6. **Setups are a first guess at the shop's order.** The drawings give the part, not the process. The setups are mine and marked as such, never as
   Wempe's.
7. **The package and the CLI share a name.** `recipes/` and `recipes.py` sit in one folder (Python's import finds the package). Other tools load the CLI by
   path (`recipes_section.py` does).

## Phases

0. **Pilot** (this branch, `claude/wempe-recipes`): the four parts above, the check, one sheet each.
1. **The format settled.** Literals into `dims.js`; the ops the remaining kinds need: wheels and pinions (teeth from `WTRAIN`'s tooth forms as exact
   involute or cycloidal arcs), springs (strip, coiled), jewels (bought, not made: a line, not a recipe), screws as a family (one recipe, a table of sizes).
   A recipe for each part kind: a wheel, an arbor with its pinion, a cock, a spring, the fusee.
2. **All 229 Wempe parts in batches**, by group (frame, train, escapement, fusee and barrel, motion work, case and box), each batch passing `recipes.py
   --check` with every difference sorted (recipe or old mesh) and the old mesh's faults listed for the model's own ledger. The operation sheets get a
   sketch per setup. The page's part cards link the part's STEP file and sheet, and the site offers all of them in one download.
3. **The page's meshes from the recipes.** Each part's mesh tessellated from its recipe's solid (in Node, or baked into the build), so one builder makes
   the page, the STEP files and the sheets. `fine.py`, `bom.py`, `solids.py`, `holecheck.py` and the views prove the swap changes nothing it shouldn't.
4. **The PDF book and `drawbook*.py` retired** once every part has a recipe (the owner took the PDF off the site on 29 October 2026, the day this began).
5. **The Hamilton**, the same way, from the manual's figures and the measured lines.

## The owner's choices (29 October 2026)

1. **Two builders.** The page's parts stay as they are. `recipes.py --check` keeps each recipe matched to its part; the page is not made from the recipes
   (phase 3 below is dropped).
2. **The setup order is a suggestion.** Every sheet says so at its head: the setups and their order are one workable way, the model's, not Wempe's.
3. **Bought parts** (jewels, spring strip, standard screws and pins) get a line saying what to buy (size, standard, material), not a recipe or STEP file
   (`Bought` in `recipes/__init__.py`).

The PDF book was withdrawn from the site in 3.51.02 (main d35022c4). The `drawbook*` tools stay untouched for now.

## The sheets' sketches

Each setup has a sketch of the part as that setup leaves it, drawn from the B-rep with hidden lines removed (`recipes/sheet.py`). A flat part is shown in
plan from the face the setup works; a turned part in half section, its axis upright. The faces cut in that setup are orange, and each operation's number
sits on the feature it cuts, matching the table's rows. A face only pierced by a hole (on a plane the part already had) isn't counted as cut.

## The batches (by kind, across the Wempe's made parts)

Each part's recipe is checked against the page, and each difference is fixed at its source. A fault in the recipe is fixed in the recipe. A fault in the
page is recorded in the recipe's `expect` (reported, not failed) and listed below for a later fix on the page. No page number is ever moved to suit a
recipe. A size `frame.js` (or another builder) keeps as a literal moves into `dims.js` before a recipe reads it, with the page's meshes hashed before and
after (`recipes_pagehash.py`) and `placements.py --diff`.

| # | Batch | Parts | State |
|---|---|---|---|
| 1 | Frame I: plates, pillars, ring and their fittings | top plate, pillar plate, pillars, movement ring, cork ring; screws WN-57, WN-ps, the ring's (WN-56); pins WN-201, WN-202, WN-203 (bought) | done, 29 Oct |
| 2 | Frame II: barrel bridge, bushes | barrel bridge, its click and click screw WN-22, screws WN-55; fusee bush and screws WN-34; dust bush | done, 29 Oct |
| 3 | Frame III: cocks and the intermediate bridge | upper and lower balance cocks and their screws; intermediate bridge, its screws WN-52 (the bush WN-300 goes with batch 6) | done, 29 Oct |
| 4 | Arbors and pinions | centre, intermediate, seconds and escape pinions with their arbors; balance staff | done, 29 Oct (the fusee and barrel arbors moved to batch 9) |
| 5 | Wheels with teeth | the centre, intermediate and seconds wheels, the escape wheel | done, 29 Oct (the fusee's wheels and ratchets moved to batch 9, the motion work's to batch 10) |
| 6 | Small turned parts | the bushes WN-301, WN-300 (×3), WN-302 and the hand-setting bush, the seconds jewel's setting, the studs' bushes and both studs, the escape wheel's collet; the seconds jewel (bought) | done, 29 Oct (the balance's and escape wheel's jewel settings, the hairspring's collet and stud moved to batch 8) |
| 7 | Springs and the detent | the mainspring and hairspring strip (bought, done 29 Oct); the detent, its block and gold spring (the frozen pose: 7b, done 29 Oct); the clicks and their springs, maintaining spring, maintaining detent and wire spring, stop bar and its spring (fusee.js: with batch 9) | part done: the clicks, stop bar and maintaining detent made, the springs' strip and wire bought (9c); 7b, the detent and gold spring made, the locking stone bought (29 Oct); the block made (29 Oct); the maintaining spring made 31 Oct (9d) |
| 8 | Balance and rollers | rim, masses, timing screws and weights, hub, impulse and discharge rollers, hairspring collet and stud; the balance's and escape wheel's jewel settings and caps, their jewels (bought) | done, 29 Oct; 8c, 31 Oct: the collet and the stud (05 03 02-2, -3) and their two pins (bought), the arm's screws WN-10, the stud's WN-11 and the masses' WN-12 (below) |
| 9 | Fusee and barrel | fusee arbor, body, cover plate, Vorreiber, dust plate, fusee wheel, click wheel, maintaining ratchet; barrel arbor, drum, lid, hook block, Steg, set-up ratchet (fusee.js: needs a Node loader) | done, 29 Oct; the fusee body, the maintaining spring, WN-19/20/21 and the detent's arbor 31 Oct (batch 9d); the arbor hook, chain, band and wire stud left |
| 10 | Motion work, hands, dial | the motion work's wheels and pinions, hands, dial (dial.js: needs a Node loader) | |
| 11 | Case parts | bowl, bezel, gimbal ring, box fittings | part done: the four one-size screws (30 Oct); 31 Oct: the bowl, bezel, closing plate, both brackets' kinds, gimbal ring and its bracket, lock nuts and eight screw lines made, the glass, closing spring, box and two wood-screw lines bought; the transit lock, the key, the box's fittings and the 6MX's left (below) |

### Batch 1 (29 October 2026): all 8 made parts pass

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) | Notes |
|---|---|---|---|---|
| Top plate 05 09 01 | 63 | 12960.90 / 12943.83 | 0.047 (expected) | the page's r 4.95 tangent, below |
| Pillar plate 05 08 02-1 | 41 | 16306.30 / 16298.79 | 0.018 | passed first run, the hand-setting window's Ø 14 arcs and its bore included |
| Movement ring 05 08 00-3 | 14 | 20467.34 / 20438.62 | 0.014 | two recipe faults fixed (below) |
| Pillar 05 08 00-1 | 12 | 973.92 / 953.06 (thread) | 0.013 | |
| Cork ring 05 08 01-4 | 1 | 478.71 / 478.10 | 0.0075 | |
| Screws WN-57, WN-ps, the ring's (WN-56) | 6 each | 133.08 / 124.43, 121.51 / 114.45 (thread) | 0.016 | one screw recipe for all (the page's screw()) |
| Pins WN-201, WN-202, WN-203 | bought | | | dowel pins, ISO 8734 or silver steel |

**Faults found in the recipe and fixed.**
- The ring's cone ran on to the face (11.05) where the page and the sheet ("45°, opening to Ø 93 at the dial's recess") stop it at the recess floor
  (10.35). It's now one 45° cone from under the lip to the recess.
- An engine bug: `TurnOD` and `TurnCone` cut only out to r 50, short of the ring's flange (r 52.95). They now cut out to r 1000.

**What the check learnt.**
- One page mesh can hold two bodies touching (a screw's shank run into its head) or joined on a shared face (the ring's band and flange: an internal
  face, and the mesh not watertight to trimesh). A page face is left out of the surface comparison only where the recipe has metal on both sides of it
  *and* the page does too: it lies inside another closed piece, or an opposite coincident face of the page sits on it. A hole the page has and the recipe
  lacks still fails. `--fault` now also drops the top plate's hole 4 from the recipe, and the check fails on it (1.09 mm).
- The volume test compares exact volumes, with half of each thread's ring allowed. The Monte Carlo of the two solids' difference is reported only where
  the page's mesh is watertight (ray parity breaks on a shared internal face).

**Sizes moved into `dims.js`** (page unchanged: the 27 frame lines' meshes hashed identical before and after, `placements.py --diff` 0 of 39 parts,
the type check clean):
- `WD.FRAME`: the hole radii, the ring pin's notch, hole 10, the intermediate wheel's opening, the hand-setting window and bore.
- `WD.RING`: the movement ring's every size.
- `WD.CORK`: the cork ring's sizes.

The recipes now restate none of them.

### Batch 2 (29 October 2026): all 7 made parts pass

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) |
|---|---|---|---|
| Barrel bridge 05 08 05-1 (the chord, short edge and rim from the sheet's figures) | 9 | 4147.18 / 4144.20 | 0.0033 |
| Click 05 08 05-2 (its six arcs and lines) | 2 | 170.52 / 170.54 | 0.001 |
| Fusee bush 05 08 01-2 | 13 | 344.89 / 344.62 | 0.0048 |
| Dust bush 05 08 01-3 (waisted, as last revised) | 9 | 1099.63 / 1098.57 | 0.0061 |
| Screws WN-55, WN-34, WN-22 (shouldered) | 6-7 | thread allowance | 0.011-0.016 |

**No faults in the recipes.** Two in the engine, fixed:
- A plate whose outline winds clockwise (the bridge, the click) was extruded downward. Plates and pockets now extrude along +Z.
- The inner-face test now looks for a coincident opposite face in every piece of the part, not just the piece the point is on. A convex piece that
  trimesh finds open (a lathe's fan at its axis) is tested by its hull. Vertices are welded at 1 µm, as `solids-check.js` welds them.

**Moved into `dims.js`:** `WD.BB`, `WD.CLICK` (with the screw WN-22), `WD.FB` (with WN-34) and `WD.DB`. The page's 27 frame lines hashed identical
before and after, and the type check is clean. `placements.py --diff` lists only the barrel, fusee, chain, mainspring, hands and motion work: parts that
follow the running clock and the wind between runs (the known flake), none of them touched.

### Batch 3 (29 October 2026): all 6 made parts pass, the frame complete

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) |
|---|---|---|---|
| Upper balance cock 05 08 03-1 (cranked: foot, web, arm; relief with its 45° step; the turned boss; the 82° slot; the settings' seat) | 18 | 2773.71 / 2771.75 | 0.0017 at p99; 0.13 at the slot in the boss (expected, below) |
| Lower balance cock 05 08 00-2 | 9 | 1746.23 / 1736.58 (the threads) | 0.0038 |
| Intermediate bridge 05 08 04 | 10 | 1406.55 / 1406.64 | 0.0016 |
| Screws WN-ucs, WN-53, WN-52 | 6 each | thread allowance | 0.010-0.016 |
| Steady pins WN-203 (cocks, bridge) | bought | | |

No faults in the recipes or the engine. One page fault, recorded in the upper cock's `expect` and listed below.

**Moved into `dims.js`:** `WD.UC`, `WD.LC` and `WD.ZB`. The 27 frame lines hashed identical before and after, and the type check is clean.

### The owner's corrections (29 October 2026): five sizes at their middles

The owner chose to fix the sizes the recipes' check found drawn at their tolerances' tops, in the page and the recipes together:
- the barrel bridge's 3.32 −0.04 → 3.30
- the fusee bush's flange Ø 13.2 −0.2 → 13.1
- the dust bush's body Ø 13.1 −0.2, collar Ø 15.1 −0.2 and neck Ø 9.7 −0.2 → 13.0, 15.0, 9.6. The collar now fits its Ø 15 Rundmessing.

They changed in `dims.js`, which both read, each with its tolerance cited; the Wempe README's "Readings corrected" has them. The top plate's pocket edge
was tried at the sheet's r 5. The solid opened (205 open edges: the tangent lies on the opening's edge, which r 4.95 avoids), so it stays at 4.95, an
expected difference. A fix would cut the opening and the pocket as separate features, which is not a one-number change.

### Batch 4 (29 October 2026): the train's arbors, the escape arbor and the staff pass

| Part | Operations | Surface apart (max) |
|---|---|---|
| Centre pinion and arbor 05 05 03-2 (z 14) | 3 | 0.0032 |
| Intermediate pinion and arbor 05 05 02-2 (z 12) | 3 | 0.0024 |
| Seconds pinion and arbor 05 05 01-2 (z 10) | 3 | 0.0016 |
| Escape pinion and arbor 05 04 05-2 (z 10, m 0.263) | 3 | 0.0051 (the page's 24-sided lathe) |
| Balance staff 05 04 02-1 | 2 | 0.005 (its 32-sided lathe) |

Each arbor is a blank between centres, turned to the page's own profile (pivots, shoulders, seats, collars, its pinion's head at the tip circle), then its
leaves cut to the page's `teeth()` outline, at the page's phase for the check.

**No faults in the recipes or the page.** Four changes to the check:
- The exporter takes only meshes whose nearest parts-list line is the part's own (the staff's line sits on the whole balance's group), and returns a
  pinion's phase, which `CutLeaves` takes.
- Inside tests use the generalized winding number (a lathe's open fan at its axis defeats ray parity and the hull test).
- A page part in several pieces has its volume reported, not compared: the page draws a pinion's leaves as a full disc through its arbor, so the pieces'
  volumes overlap.
- `recipes_pagehash.py` compares vertices within 1e-5 mm, not bit for bit: a part on a turning arbor multiplies its pieces' matrices out differently in
  the last bits from load to load (the original page differed from itself).

**Moved, the page unchanged:** the escape arbor's sizes into `WESC.EARB` with `WESC.earProf()`, and the staff's profile into `WESC.staffProf()` (with its
cone `SCc` and seats `SF`), at `escapement.js`'s module scope, which `build` itself now calls. The escapement's and the train's 7 lines matched within 1e-5
mm before and after, and the type check is clean. The train's arbors read `train.js`'s exported `A` directly.

**Left for batch 9:** the fusee arbor and the barrel arbor. Their sizes are in `fusee.js`, which `wempe_load.js` doesn't run: it needs a loader, or the
profiles lifted into a pure export, along with the rest of the fusee and barrel.

### Batch 5 (29 October 2026): the train's wheels and the escape wheel pass

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) |
|---|---|---|---|
| Centre wheel 05 05 03-1 (z 90, five spokes) | 4 | 376.49 / 376.54 | 0.0021 |
| Intermediate wheel 05 05 02-1 (z 80) | 4 | 151.47 / 151.49 | 0.0015 |
| Seconds wheel 05 05 01-1 (z 80) | 4 | 138.85 / 138.87 | 0.001 |
| Escape wheel 05 04 05-1 (15 teeth, the recess, three openings) | 4 | 34.69 / 34.70 | 0.0019 |

The train wheels are cut to the page's `teeth()` (cycloidal, the sheets' tips and roots) and crossed out with the page's spoke windows. The escape wheel's
outline, floor and openings come from `WESC.ewGeo()`.

**No faults in the recipes or the page.** Three in my own work, fixed:
- The blank was larger than the teeth's cut, leaving a ring.
- The check turned a wheel's teeth twice: once with the whole solid and once through its own phase.
- A wheel that is the part's root mesh is exported in its own frame, so its page phase doesn't apply. The exporter now reports a gear's phase only for a
  piece other than the root (a pinion on its arbor).

**Moved, the page unchanged:** the escape wheel's tooth outlines, floor and openings into `WESC.ewGeo()` and `WESC.EWG` at module scope, which `build`
calls. The 6 lines of the wheels and the escape arbor matched within 1e-5 mm before and after, and the type check is clean.

### Batch 6 (29 October 2026): eleven small turned parts and a bought jewel

| Part | Surface apart (max) |
|---|---|
| Bushes WN-301, WN-300 at 38 and 35 (top plate), WN-302 (pillar plate), WN-300 (intermediate bridge) | 0.0046-0.0049 |
| Seconds jewel's setting 05 05 04-2 | 0.0056 |
| Stud bush 05 08 02-2, hand-setting bush (hole 18) | 0.0038 |
| Long and short studs 05 02 00-6, -7 | 0.0064 |
| Escape wheel collet 05 04 05-3 | 0.0043 |
| Seconds jewel 05 05 04-1 | bought: a hole jewel Ø 3.6 × 1.1, hole Ø 0.78 olive |

Each is a blank turned, bored and sunk to its profile as the page draws it (a bush's spherical oil cup, a setting's seat, a stud's domed ends). No faults
in the recipes or the page.

**Moved, the page unchanged:** the small parts' sizes into `WTRAIN.SM` with a pure `WTRAIN.smallProfs()` and `bushProf()`, and the collet's into
`WESC.EARB.cl` and `earProf().col`. `build` uses them. The 15 lines matched within 1e-5 mm before and after, and the type check is clean.

**Left for batch 8:** the balance's and escape wheel's jewel settings and caps, the hairspring's collet and its stud. They're built from values local to
`escapement.js`'s balance and escapement code (`JR`, `JT`, `hY`, `eY`, `ER`, `EE`, `ck`), which batch 8 lifts with the balance and rollers.

### Batch 7 (29 October 2026): the strip as bought lines; the detent and the fusee's springs need two steps first

Done: the hairspring strip 05 03 02-1 (Bandstahl 0.52 × 0.285, 13 turns as fitted) and the mainspring strip (05 06_20's "Zugfeder 15 × 0,37", about
1.24 m, fitted), each a bought line citing its sheet, with the 1950s build's Nivarox and Nivaflex named.

Not done, and why:
- **The detent (05 04 01-1), its block (05 04 01-4) and the gold spring (05 04 01-2).** The page draws the detent as a fixed spring foot and a moving
  blade (`escapement.js`'s `sS`/`sM`), turned by the escapement's lift at the page's current phase, with the gold spring on the moving part. A reliable
  check needs the page frozen at a stated phase, as `fine.py` freezes it, and the recipe at rest: step 7b, `recipes.py`'s exporter taking a freeze. Then
  each size gets cited, the code lifted the same way as before, and `wempe_escapement.js` and `dynamics.js --model wempe --quick` run after any move.
- **The clicks and their springs, the maintaining spring, the maintaining detent and its wire spring, the stop bar and its spring.** These are built in
  `fusee.js`, which `wempe_load.js` doesn't run. They go with batch 9, after its Node loader for `fusee.js`.

### Batch 9a (29 October 2026): fusee.js's sizes reachable; the fusee and barrel arbors pass

**The loader question, settled without touching `wempe_load.js`.** The sizes the recipes need move from `fusee.js` into `dims.js` (`WD.FA`, the fusee
arbor; `WD.BAR`, the barrel's heights and the barrel arbor), each with a pure profile function, written with the same expressions in the same order.
`fusee.js` reads them, including its module constants (`yD`, `yT`, `SQ0`, `VPR`, `BB`, `BR`, `BBF`, `BLF`, `BA0`, `BA1`), which other fusee code shares.
`dims.js` is already in every Node tool's load, and adding fields there changes nothing those tools compute: `wempe_escapement.js`, `wempe_physics.js`,
`wempe_mainspring.py --check`, `wempe_ratchets.js` and `wempe_strength.js` gave byte-identical output before and after. The page's 18 fusee-side lines
matched within 1e-5 mm, and the type check is clean.

| Part | Operations | Surface apart (max) |
|---|---|---|
| Fusee arbor 05 06 04-1 (journal, step, collar, seats, pivot, stub; the square 1:100 and its 38.7° point; the Vorreiber pin's cross hole) | 5 | 0.0108 |
| Barrel arbor 05 07 02-1 (core with chamfered ends, journals, domed end; the square and its point; the hook's radial hole) | 4 | 0.0218 (tessellation, bounded) |

The hook's hole sits at an angle the mainspring's solve sets (where the spring's eye lands), free against the square. The recipe drills it at a free
angle, `RadialDrill`, and the check fits that angle to the page's own hole walls by least squares, as it reads a pinion's phase.

**Left for 9b and 9c**, each needing its sizes moved the same way: the fusee body (its helical chain groove, a `helixSolid`), the fusee wheel, click wheel,
maintaining ratchet and set-up ratchet (their teeth), the cover plate, Vorreiber and dust plate, the barrel drum, lid, hook block and Steg; and the
fusee-side springs (the clicks and their springs, the maintaining spring, the maintaining detent and its wire spring, the stop bar and its spring).
Pure strip among them is a bought line.

### Batches 9b and 9c (29 October 2026): fourteen more made parts pass; the fusee body deferred

**The lift, the page unchanged.** `fusee.js`'s sizes for these parts moved into `dims.js`, written with its own expressions in its order: `WD.FU` (the
stack along the fusee arbor, VHF to DTT; the chain's pin's angle; `ratchet()`; the cover plate DP, dust plate SP, Vorreiber VR, click wheel CW, fusee
wheel FW, maintaining ratchet MR, set-up ratchet SR; the clicks CK, stop bar SB and maintaining detent DT with their outlines' construction) and `WD.BAR`
(BLK, the drum, lid, Steg, hook block and the chain slot's sizes, `drum()` and `lidP()`). `FA` and `BAR` became locals of WD's builder so `FU` can read
them. `fusee.js` reads all of it. The page's 36 fusee-side lines matched within 1e-5 mm (`recipes_pagehash.py`) after each lift; the four that differ
from one load to the next with no change at all (the wire spring, the click springs, the mainspring and the chain, which follow the clock) excepted.
`wempe_escapement.js`, `wempe_physics.js`, `wempe_mainspring.py --check`, `wempe_ratchets.js` and `wempe_strength.js` gave byte-identical output after
each lift. `wempe_sustaining.js` read the maintaining spring's thickness out of `fusee.js`'s source (`GS1=WW-1.3`): it now reads `WD.FU.MSt`. The
Wempe type check is clean.

| Part | Surface apart (max) | Notes |
|---|---|---|
| Cover plate 05 06 00-4 | 0.0024 | turned, its 60° hole, the screw's hole and 90° sink |
| Dust plate 05 06 00-1 | 0.0017 | the square hole broached 1:100 from the recess floor (page fault 1, below) |
| Vorreiber 05 06 00-2 | 0.0054 | the pin's hole reamed with the arbor's at assembly |
| Click wheel 05 06 04-3 | 0.0034 | 35 teeth (the page's outline), three holes opened 1:8 |
| Fusee wheel 05 06 00-3 | 0.0037 | turned, 90 teeth (train.js's teeth(), the same as fusee.js's copy), the spring's pin hole |
| Maintaining ratchet 05 06 02-1 | 0.0058 | plate, cup and floor, 120 teeth, M1.7 ×2, the rivets' holes across the cup |
| Set-up ratchet 05 07 00-3 | 0.0 | its outline turned 1.17° on the square (`free_spin`), the 1:100 square hole kept |
| Barrel drum 05 07 01-1 | 0.0017 at p99; 0.27 and 0.35 expected | the M2.6 hole (convention), the Steg slot's stray floor (page fault 2); the chain's slot as the page laid it (`page_params`) |
| Barrel lid 05 07 01-2 | 0.0058 | the two notches |
| Steg 05 07 00-1 | 0.0 | |
| Hook block 05 07 01-3 | 0.27, expected | its M2.6 hole by convention; the line's screw left out (`root_only`) |
| Clicks 05 06 02-3 | 0.0053 | exact arcs; two alike |
| Stop bar 05 06 03-1 | 0.0052 | two thicknesses, the pin's hole across |
| Maintaining detent 05 05 05-1 | 0.0177 | exact arcs, the thin tip from the step, the 1:70 hole |

Bought lines: the click springs' bronze strip (1.5 × 0.4, 27.0), the stop bar spring's strip (1.0 × 0.10), the detent's wire (Ø 0.25), and seven pins
(the Vorreiber's taper pin, the chain's pin, the maintaining spring's two pins, the click springs' rivets, the stop bar's pin, its spring's pin, the stop
pin). The formed springs follow their parts on the page (the clicks' ride, the bar's slide, the detent's), so, like the detent (7b), a solid could only
be checked against a frozen pose.

**Changes to the check** (`recipes.py`): `free_spin` (an outline turned on its arbor to where the page's search left it, fitted on the page's mesh outside
a radius, the ops marked `spin` turned); `page_params` (the page's numbers on the part's groups, `pud` in the export: the drum's chain slot, its angle,
height and lean as the laid chain's hook put it; the STEP file puts the slot at 0207's 225° and the middle of the drum's inside); `root_only` (the line's
own mesh: the hook block's line carries its screw); an `expect` entry's `vol`; and a page face whose outer side is the page's own metal (two pieces
welded at shared corners, meeting on faces of different facets: the fusee wheel's hub in its web) is left out as inside. All 57 recipes pass; `--fault`
still fails on its three holes and the surface. `recipes.py --check` now takes about 4 minutes.

**Deferred: the fusee body 05 06 04-2.** Its groove's floor radius changes with the angle, piecewise linear by quarter turns over 9 turns (05 06_20's
curve), so the groove is a sweep along a helix of changing radius whose profile must stay in the meridian plane. OpenCascade's sweep with a fixed
binormal gave a degenerate solid (15 mm³ for a 1,280 mm³ sweep), with an auxiliary spine failed (`MakeSolid`), and the corrected-Frenet sweep turns the
profile up to about 1.7° in its plane where the radius falls fastest (about 0.02 mm at a rib's top, the check's tolerance). Its lands and ribs also tile
the pitch exactly, so one turn's sweep touches the next. With the slot's cutter arc, the first 0.15 turn's cubic rise, the uncut end past N, the stop
bar's slot (two depths) and six holes, it wants a constructed B-rep (ruled patches between meridian sections), not booleans of sweeps: step 9d. Its
sizes are not yet lifted from `fusee.js` (RFT and the helix stay there; `wempe_transmission.js`, `wempe_wear.js` and `wempe_mainspring.py` read RFT from
its source). Also left: the maintaining spring 05 06 01-1 (blanked from Bandstahl 35 × 1.75; the page draws it bent by the running drive: a frozen pose,
with the detent's, 7b), the maintaining detent's arbor 05 05 05-2, the fusee wheel's and ratchet's screws WN-19, WN-20, WN-21.

### Step 7b (29 October 2026): the check reads the page in a frozen pose

`recipes.py --check` (and `recipes_pagehash.py`) now freeze the page before reading a mesh, as `fine.py` and `audit.py` do: the page's `update()` is
replaced by a no-op and called once with `POSE` (recipes.py):

| Input | Value | What it fixes |
|---|---|---|
| `E` | 1000 | the escape wheel a whole number of teeth on, locked on the stone (`ESC.state(0)`: prog 0, lift 0), the train with it |
| `th` | 0 | the balance at its dead point: the rollers at their drawn angle, the hairspring unwound |
| `lift` | 0 | the detent home on its banking: its turning half on its fixed half's line |
| `psDef` | 0 | the gold spring unbent, on the horn |
| `n`, `winding` | 2.5, false | the fusee 2.5 turns from full wind (audit.py's and placements.py's first state) |
| `ms` | 0 | the maintaining spring free, as blanked (the ratchet's lead over the fusee wheel nil) |
| `slip` | 0 | the cannon pinion unslipped |

`--pose JS` replaces the state (a planted fault). `recipes_pagehash.py --rev V` reads another version's meshes, for a builder all versions share.

**The proof.** All 57 recipes pass frozen, with the same figures as before. With the detent lifted 0.02 rad, the balance turned 1 rad, the gold spring
bent 0.05 and the wheel 0.3 of a tooth on (`--pose '{E:1000.3,th:1.0,lift:0.02,psDef:0.05,...}'`), the detent fails (box 0.30, surface 0.34) and so does
the gold spring (box 0.47, surface 0.53). The escape wheel still passes, since it is exported in its own frame. The top plate's `--fault` still fails on
its three planted holes (surface 1.09, hole 7, hole 13).

### The detent group (29 October 2026): the detent and the gold spring made, the stone bought; the block deferred

**The lift, the page unchanged.** `escapement.js`'s `dv` drew the detent and gold spring from literals and one option object per version. The literals
are now `DETK` and the options `DETV` (`last`, `first`, `w3955`, `late` for the 6MX and 1943), at module scope with the same expressions in the same order.
Both are exported as `WESC.DET` with the detent's frame (`ROW`, `DOFF`, `P`, `TD`, `RS`, `GW`, `GN`, `TI`, `SQ0`, `TP`, `HORN_L`). The horn's line and the
gold spring's traced points were already exported (`WESC.HORN`, `WESC.GOLD`). The detent group's seven lines (050401-1 to -4, WN-14, WN-gf, WN-205.d)
matched within 1e-5 mm before and after in all five versions (last, first, 3955, 6mx, 1943), and the Wempe type check is clean. `wempe_escapement.js`,
`dynamics.js --model wempe --quick`, `tripping.js --model wempe --quick`, `wempe_hairspring.js`, `wempe_physics.js`, `wempe_strength.js` and
`escgolden.js` gave byte-identical output, apart from the elapsed-time line that `dynamics.js` and `tripping.js` print.

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) |
|---|---|---|---|
| Detent 05 04 01-1 (1436: the foot, the tapered spring, the square, the blade and its thicker part, the pipe, the traced horn with its bevelled back; the foot's screw and pin holes, the square's M0.7, the stone's bore) | 6 | 13.525 / 13.516 (5 pieces) | 0.018; 0.022 expected (below) |
| Gold spring 05 04 01-2 (the head and arm, the bow formed to its traced line, the head's hole) | 2 | 2.600 / 2.599 | 0.0014 at p99; 0.049 expected (below) |
| Locking stone 05 04 01-3 | bought | | a ruby pin Ø 0.75, ground half away to its flat |

Each is built in the detent's own frame: X along the blade from the stone toward the foot, Y across it, Z the height under the top plate's inner face,
with the stone's centre at the origin. `to_page` is the page's `D(t, n)`, turned to be proper. The horn's face and back are B-splines through 401 points
of `WESC.HORN.line`, split at the bevel's start. The gold spring's bow is a B-spline through `dv`'s Catmull-Rom of `WESC.GOLD`'s points, offset as `dv`
offsets it. Both curves are the page's own functions, not traces.

**No faults in the recipes.** One page fault, recorded in both recipes' `expect` and listed below: the page's bore across a thin strip (fusee.js's
`bore`, cut by `holeCut`, closed by `capFix`) joins its two mouths' vertices with wall triangles that skip round the hole. The chords lie 0.025 inside
the circle at the detent foot's screw hole and 0.048 at the gold spring's head hole. The holes' sizes and places are the page's to 0.002.

**The detent block: done in batch 8 (below).**

**Deferred: the maintaining spring 05 06 01-1 (step 3).** The frozen pose makes it reliable (`ms` 0: the page draws the outline unbent). But its
inner edge's construction (`w48`, between fusee.js's `MS-W48` markers) is read from fusee.js's source by `wempe_sustaining.js`. Lifting it into
`dims.js` means changing that tool's reader too, and checking `wempe_sustaining.js`'s output byte for byte. Next.

**Deferred: the screws WN-19, WN-20, WN-21** (batch 8 done, below). The three screws aren't the kit's `screw()`: WN-19 is countersunk in the click wheel's 1:8 holes, WN-20 is countersunk in
the cover plate, and WN-21 is shouldered. Each has its own literals in fusee.js to lift first.

### Batch 8 and the detent block (29 October 2026): 21 made parts pass, 11 lines bought

**The lift, the page unchanged.** `escapement.js`'s balance, jewel and block literals moved to module scope with the same expressions in the same order, and
`build` reads them: `BJ` (the stones' sizes, `eLip`, the settings' screws) with `jewProf(Q)` (each setting's turned profile, the balance's and the escape
wheel's at Q's heights), `BAL` (the rim's radii, the cuts, the arm's flanks `sw` and `AT`, the hub's and screws' holes, the timing screws' tapped holes),
`HUB`, `MS` (the masses), `TSW` (the timing screws and weights), `ROLI`, `ROLD` with `rolImp()`, `rolDis()` and `rolGeo()` (the rollers' plans at rest), and
`BLK` (the detent block's sizes, shared by its four versions where `build` reads them). All exported on `WESC` (`BLK`, `BLK_NE` and `H13` on `WESC.DET`).
Each lift was checked on its own: the 51 lines of the balance, rollers, hairspring's collet and stud, jewels, escape wheel and detent group (`recipes_pagehash.py`)
matched within 1e-5 mm in all five versions (last, first, 3955, 6mx, 1943) after the jewels, the balance, the hub and the block, and the Wempe type check
is clean. `escgolden.js`, `wempe_escapement.js`, `dynamics.js --model wempe --quick`, `tripping.js --model wempe --quick`, `wempe_hairspring.js`,
`wempe_thermal.js`, `wempe_physics.js` and `wempe_strength.js` gave byte-identical output (the elapsed-time lines aside), and `wempe_inertia.py` reports
`wempe_inertia.json` up to date with output identical to before. `wempe_load.js` now gives the context's `KIT` kit.js's own `domeAt` (read from kit.js's
source), which `jewProf` needs; no Node tool read `KIT` before.

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) |
|---|---|---|---|
| Rim with its arm 05 03 01-1 (one bimetallic solid; the arm's flanks straight then arcs r 20; the cuts; the hub's hole, the screws' holes and 90° sinks; the timing screws' M0.9 × 0.16 across the rim) | 8 | 464.10 / 463.68 (3 pieces) | 0.0013 at p99; 0.106 expected (the tapped holes, below) |
| Compensation mass 05 03 01-4 (the chamfered top, the rim's slot, the counterbore, M0.8 across, M1.2 in its top) | 5 | 178.22 / 177.34 (2 pieces) | 0.038 at p99 (the M0.8's helix); 0.141 expected |
| Timing screw 05 03 01-2 (its head filed to the rim's inside, M0.9 × 0.16) | 7 | 6.19 / 5.65 | 0.0072; 0.126 expected (the slot, below) |
| Timing weight 05 03 01-3 (tapped, two saw cuts at right angles) | 4 | 43.86 / 43.18 (the thread) | 0.0013 |
| Hub 05 04 02-2 (flange, neck, the 1:70 bore and its foot, two M1) | 4 | 52.66 / 51.96 (2 pieces, the threads) | 0.0028 |
| Impulse roller 02 04 02 (the hollow r 3.5 as an exact arc, the stone's slot, the 1:70 bore, the Ø 1.3 hole) | 4 | 49.297 / 49.307 | 0.0014 |
| Discharge roller 05 04 04-1 (the stadium, the stone's slot, the bore) | 3 | 5.710 / 5.713 | 0.0013 |
| The balance's jewel and endstone settings (050406-2.bu, .bl; 050408-2.bu, .bl) and the escape wheel's (050406-2.eu, .el; 050408-2.eu, .el) | 2 each | within 0.29 % (the page's 48-sided lathes) | 0.0027-0.0056 |
| Their screws WN-55.ck, WN-18, WN-es, WN-ec | 6 each | thread allowance | 0.0118-0.0123; WN-es 0.032 expected (below) |
| Detent block 05 04 01-4 as last revised (base, thin part, upright with its cove r 3 as an exact arc, the slit across, the banking screw's M1.2 across the leaves, the pins' holes, the Ø 1.3, the fixing M1.7, the end face's M1 and two pin holes) | 10 | 638.42 / 635.73 | 0.155 expected (the M1.2 across, below); the rest within 0.02 |
| Block screw WN-gk | 6 | thread allowance | 0.0102 |

Bought: the four balance stones (hole jewels and endstones, `050407-1.bu`, `.bl`, `050408-1.bu`, `.bl`), the escape wheel's three (`050406-1.eu`, `.el`,
`050408-1.eu`, `.el`), the impulse and discharge stones, the block's steady pins (`WN-201.gk`) and the detent foot's (`WN-205.d`).

**No faults in the recipes.** One change to the check: `near` (a recipe attribute) keeps only the page's pieces whose box comes within it of the recipe's:
the timing screws' heads are pieces of their line at both ends of the arm, and the exporter took both.

**Page faults, recorded in `expect`** (and in the table below): the timing screw's slot is a solid dark box over the head (1.67 × 0.3 × 0.25, standing
0.02 out of its end), not cut into it; the escape wheel's upper endstone screws (WN-es) have heads 0.3 high whose slot is 0.232 deep, and `screw()`'s
shank runs 0.1 into the head, so its end stands 0.032 up into the slot. Thread conventions, reported not failed: the radial and cross tapped holes (the
rim's M0.9, the mass's M0.8, the block's M1.2) are drawn plain or as helices at their size, the recipes at the tap drill; a hole not along Z has no
thread zone, so each is an `expect` with its volume.

**Deferred, and why:**
- **The hairspring's collet 05 03 02-2.** Its bore is the staff's 1:70 seat (`SF.CS`) warped vertex by vertex onto a polygon solid, and its spring's hole
  is a 1:90 taper 3.7° off square to the bar, cut by `bore` with the hole's frame `CHD(0)` from the hairspring's own construction (`aPinL`, `CTH`). The
  sizes are reachable, but the collet's frame and the hole's lean come from the spring's solved ends: a lift as large as the detent's, not started.
- **The stud 05 03 02-3.** Its two facets are planes through the V's arms and the point at 0.05, its upright an 8° lean extruded in its own frame and fused,
  its Ø 0.7 hole set from the spring's end (`SVH`, `SYH`). Same reason; its screw WN-11 waits with it (its length reads `SBT`).
- **The hub's and the masses' screws WN-10 and WN-12.** Not the kit's `screw()`: WN-10's head is a 90° countersunk lathe with a slot box, WN-12's head and slot
  are bent onto the mass's round side (`onMass`). Small, but each needs its own literals lifted.

### Batch 10 (30 October 2026): the motion work, the up-and-down work, the hands and the dial; 17 recipes pass, and four case screws

**The lift, the page unchanged.** `dial.js`'s sizes moved into `dims.js` as `WD.MW(PPT, yC, crown, swYs)`, a pure function written with dial.js's own expressions in its order (the
centre arbor's journal C, the shank's crown and the seconds arbor's shoulder are train.js's, passed in): the dial's disc, the cannon tube `CN` (with its punch's dents `dn`),
the change wheel `CHW` and hour wheel `HRW`, the up-and-down wheel `UDW` and its pinion `UDP`, the hands `MIN`, `HOUR`, `UDH`, `SEC` (their half-width and thickness tables, each
with its boss's figures `bo`), the riveting sink `SK`, the wheels' thickness and spokes, and the dial's holes, pin and screws `DL`. dial.js reads them (`const MWD=WD.MW(...)`);
the teeth outlines stay train.js's `teeth(...)`, which dial.js and the recipes both call with the argument lists `MW` holds (`wheelA`, `pinA`). `wempe_load.js` is untouched
(its `{train:true}` already gives `WTRAIN`). Verification of the lift: see the verdicts below.

| Part | Operations | Surface apart (max) |
|---|---|---|
| Change wheel pipe 05 02 02-2, hour wheel pipe 05 02 03-2, up-and-down wheel pipe 05 02 04-2 (the foot's riveting flare shown finished) | 3 each | 0.0059, 0.0048, 0.0082 |
| Change wheel 05 02 02-1 (z 56), hour wheel 05 02 03-1 (z 54), up-and-down wheel 05 02 04-1 (z 120, five spokes) with the 30° riveting sink | 4, 4, 5 | 0.0045, 0.0036, 0.0055 |
| Change pinion 05 02 02-3 (18 leaves), up-and-down pinion 05 02 00-5 (12 leaves, bore 1:70) | 3 each | 0.0033, 0.0018 |
| Cannon tube with its pinion 05 05 03-3 (14 leaves, the half-round groove r 0.4, the square 2.6155 with its corners turned Ø 3.45, the sphere crown, the bore on the shank's 1:80, the three punch dents added at assembly) | 10 | 0.0121 |
| Minute hand 05 02 00-1 (the square hole a ruled loft of the clipped square, 1:70; the flange's r 0.4 edge; the blade as the plan prism cut by a turned profile of its thickness) | 5 | 0.0305 recipe to page; 0.0976 page to recipe at the blade's root corners, expected (below) |
| Hour hand 05 02 00-2 (pipe, bevelled flange, the blade's root a wedge on the cone) | 4 | 0.0243; 0.0979 expected |
| Up-and-down hand 05 02 00-3 | 3 | 0.0227; 0.0741 expected |
| Seconds hand 05 02 01-1 (pointer and tail from their tables) | 5 | 0.0265 (the tail's step); 0.0209 |
| Seconds hand collet 05 02 01-2 (bore on the post's 1:90) | 3 | 0.0036 |
| Dial 05 02 00-4 (disc, three holes, the pin's and the Ø 1 under the paint, three screws' holes with 1.8 × 1.0 sinks) | 12 | 0.0065 |
| Dial screw WN-10.d, dial pin | 6, 2 | 0.0182, 0.0068 |

The hands are one solid in the recipe (a plate milled to the outline of the boss's flange and the blade, the underside relieved, the top turned down by a profile of revolution
about the arbor: the page's blade top falls with the distance from the arbor, so it is exactly that), where the page fuses separate closed pieces. The printed face is not a
part: it is the etched printing, `wempe/dials/*.svg`.

**Verdicts (30 October 2026).** `recipes.py --check` on all 101 made parts: every one passes (1,407 s on a machine other sessions were loading). Page hashes (`recipes_pagehash.py`, 17 dial.js
lines and, for the case, WN-kr, WN-hg, WN-kh, WN-zg), in each of last, first, 3955, 6mx, 1943: the page unchanged within 1e-5 mm. Byte-identical output before and after (the elapsed-time
lines aside) from `wempe_motionwork.js`, `wempe_transmission.js`, `gearing.js --model wempe --quick`, `wempe_escapement.js` and `wempe_strength.js`; `dialsvg.py` up to date;
`invariants.py --model wempe` ok; `massprops.py --model wempe` up to date (`gimbals_wempe.json` not stale) and `gimbals.js --model wempe --quick` exit 0; the Wempe type check clean.
`smoke.py --model wempe` reports problems on this machine under load, the same steps on the unmodified source (4 problems there: the walkthrough left on, the wind from run down
not finishing, a train still held after winding and twisting, the detent card's gold spring not in the link) and two to five after, varying run to run with the machine's load
(the extra "Contacts off ... still in the link" was in two runs, not the third); nothing in them touches the dial or the case.

**A gap found and closed in the page hash.** `recipes_pagehash.py` compares only the lines the page's movement group holds; a line the case holds (its meshes are under `__BX.root`, not
`__mv`) was saved and compared as empty, so a first case verdict of "unchanged" meant nothing. The export now looks in `__BX.root` when a line is not in the movement, and the case
hashes were taken again from the unmodified source and after.

**Engine changes.** `recipes.py` reads the root mesh's own turn (`rootRot`, in the export) for a recipe flagged `root_turn`: the cannon tube is fused into its pinion's frame, where
its leaves are unturned and the square is turned by minus the phase, so the recipe is drawn in the group's frame (the square on the axes) and turned into the page's by it.
The worst places now print the angle and the part-frame x, y. A recipe may set `box_tol` (a round the page draws as a polygon: the Ø 9 head of WN-zg on 32 sides is 0.022 inside its circle).

**Page faults, recorded in `expect`** (also in the table below): the four hands' blade roots against the boss. The page's blade is a closed piece whose root is an 8-segment arc
at the boss's radius against the boss's 72-sided wall, a hairline gap the check cannot call an internal face (0.07-0.10 at isolated samples); the hour hand's wedge underside is a
cell-wise triangulation of the cone (about 0.1); the seconds hand's tail ramp from 0.3 to 0.5 is sampled by the page at its stations 6.35 / 6.5 / 6.55 / 6.6, not at the table's
6.4 and 6.6 (0.027).

**Batch 11, the case: four screws done, the rest deferred (30 October; the rest is done in Batch 11b below, except the transit lock, the key and the box's fittings).** `case.js` (1,108 lines) is the bowl (cast, with a bayonet-and-thread rim, bored for the brackets by swept holes), the bezel
(threaded, knurled), the gimbal ring with its swept holes and pivots, the box (birch: joinery), hinges, the maker's plate and the 6MX's fittings, about 30 lines of the parts list.
Done: the screws of one size each, **WN-kr** (the ring's bracket screws), **WN-hg** (the hinges'), **WN-kh** (the key holder's) and **WN-zg** (the transit lock's pivot screw): their
sizes moved into `dims.js` as `WD.CASE` (`[head radius, head height, shank length, thread radius]`), `case.js` spreads them into `screw()`, and the four recipes are the kit screw's
(`screw()` in wempe.py); surface apart (max) 0.012, 0.015, 0.014 and 0.0225 (WN-zg: its Ø 9 head is a 32-sided polygon on the page, 0.0225 inside the circle the
recipe turns, in `expect` with `box_tol` 0.03). Left, and why: the bowl 050100-1, the bezel 050101-2, the brackets 050100-3/-4, the closing plate 050100-2 and the gimbal ring 050100-5/-6 need a recipe
vocabulary the engine has not: a helical thread of the case's profile on a cast part (`thread()` in case.js), a knurl, and a curved hole swept through a ring (`sweepS`): the page draws
each as a sweep that B-rep operations reproduce only by approximating it, and nothing was approximated. WN-79, WN-80, WN-71, WN-72, WN-78, WN-ur, WN-ro and DIN96 are one line each
on several sizes or with a tip or knurl of their own, the page's first mesh not the only one; they want a line per size first. The glass (050101-1, the lid glass) would be a
bought line; the wooden box, its hinges and the maker's plate are made elsewhere (joinery, a stamping), not machined from the model.

### Batch 9d (31 October 2026): the fusee body with its groove as an exact solid; WN-19, WN-20, WN-21, the detent's arbor, the maintaining spring

**The groove, exact.** The body is the turned blank (the lathe profile: flange with its 5° lead-in, hub, large end's recess with its mouth, bore, small end's recess) less, for
each turn m, a cutter: the section of one pitch (the land cut to the floor radius `rf(m)`, the rib to its right to `rf(m) + 0.6`, everything above them to the blank's radius),
swept along m. Each cutter piece is a quarter turn (the floor's breaks, 05 06_20's curve) built as ruled B-rep between B-spline curves of the section's six corners, all through
the same m: the floor and the rib's top are axial ruled surfaces over a spiral, the walls radial ones, so no sweep along a variable helix is needed (OpenCascade's failed there)
and the solid is exact to the spline's interpolation, about a micron. The pieces overlap by 0.002 of a turn, and the rib runs a hair (0.02) into the next land's void, so no two
cutters share a face; each cut is checked by probing the groove's floor (a boolean that leaves metal is retried with another overlap). The last turn's section rises to the hub's
radius and runs on to the end (the page's `rBody`); the flange's slot is cut by the slitting cutter (a cylinder Ø 13.5, axial), the stop bar's slot by three boxes and the circle
r 9.30 of the page, the holes by drilling. The build takes about 40 s (36 booleans). **The table fallback was not needed.**

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max, p99) |
|---|---|---|---|
| Fusee body 05 06 04-2 | 11 | 4022.6 / 4008.7 (the threads) | 0.128 (expected, below), p99 0.026; on the groove itself within 0.002 along the profiles compared at 8 angles **Not fixed (branch claude/wempe-faults-a, 1 November 2026): the body is the manifold3d solid in `js/fuseebody.js`, regenerated offline by `tools/wempe_fusee_body.py` from the page's pieces with the browser; denser rays at the cutter's arc and the groove's end N, and the seam's end caps, are a regeneration of that file and of the hash baselines of the 38 fusee-side lines** |
| Screws WN-19 (3), WN-20, WN-21 | 4 each | thread and slot-box allowance | 0.048, 0.02, 0.049 |
| Maintaining detent arbor 05 05 05-2 | 2 | 78.35 / 77.07 (the page's 20 sides) | 0.014 |
| Maintaining spring 05 06 01-1 | 3 | 270.6 / 270.4 | 0.0155 (eye and pin holes within 0.004 in Ø) |

What the check found, each sorted:
- The recipe's rib was first 0.33 wide always. Where the land's place is the first 0.15 turn's cubic (not whole pitches), the next land starts earlier, and the page's rib runs to it; the
  recipe's now runs to the next land's wall (a 0.2 bump at 17.8 otherwise).
- **Page faults, in the recipe's `expect`** (the check reports, not fails): the flange is a lathe of 216 columns with a row every 0.04 along the axis, so (a) its walls (the first land's run,
  to 2.1 under the blank's face) stand up to 0.04 off the helix [fixed on main in 3.66.01, after this batch: the flange is swept with helixSolid, its ribs square, and the recipe's gap there is now 0.002 at p99], and (b) the slitting cutter's arc, whose floor climbs 0.4 mm between two columns, is chorded up to 0.1 off the circle
  (the page rounds a curve through chords of 1.7°); and at the groove's end N the rays (216 and the two at N) join the last land's floor to the hub across a chord up to 0.13 off the wall.
- The three screws are hand-built in fusee.js: their slots are solid dark boxes lying in the heads (WN-20 and WN-21 stand 0.02 out), not cut; the recipes cut a real slot of the box's size
  and take the difference in `expect`. WN-19's line is three screws: the check takes only the pieces near the first (`near`).
- The arbor is turned on 20 sides by the page: 1.3 mm³ (1.6 %) under the circle's volume, in `expect` with its `vol`.

**The check** (`recipes.py`): an `expect` entry may now name a height range of the part's axis (`z`) and an angle range (`th`, degrees), so a turned part's known band is exempt, not the whole of
its XY circle.

**Sizes lifted into `dims.js`** (the page unchanged: the 37 fusee-side lines hashed within 1e-5 mm in all five versions, before and after; `wempe_sustaining.js`, `wempe_physics.js`,
`wempe_strength.js`, `wempe_escapement.js`, `wempe_wear.js`, `wempe_mainspring.py --check` and `wempe_transmission.js` printed the same): `WD.FU.GR` (the groove: `RFT`, `rf`, the flange's
ribs, the pitch, `ac`, `MN`), `WD.FU.BODY` (the lathe's and the holes' sizes), `WD.FU.SCR` (WN-19, WN-20, WN-21), `WD.FU.DTA` (the detent arbor's profile) and `WD.FU.MS` (the maintaining
spring's outline: `R0`, `RI`, `RP`, `ER`, `U1`, `USQ`, `UPIN`, `EYO`, `HR`, `w48` and the arcs it is made of). `RFT` moved out of fusee.js, so `wempe_transmission.js`, `wempe_wear.js` and
`wempe_mainspring.py` read it from `dims.js`; `wempe_sustaining.js` reads the ring's sizes from `WD.FU.MS` (it took them from fusee.js's source by regex).

**Left, and why.** The arbor hook 05 07 02-2 (its pin and ramped head are posed at the barrel arbor's angle by `hookSet`, in five versions); the wire spring's stud WN-27 (built with the
escapement side's `K.headOn`); the chain 05 07 04 (a bought chain of riveted links, its links drawn by an instanced builder) and the band 05 07 03-1, -2, -3 (a variant, not shown by default):
each a line of its own that this pass did not reach.

### Batch 8c and the detent block's other versions (31 October 2026, the escapement side)

Recipes of another version of the movement. `Recipe.rev` (default `'last'`) names the version a recipe is drawn for ('first', '3955', '6mx', '1943', the page's `setRev`);
`recipes.py --check` loads the page once for each version its recipes name and checks each recipe on the page as that version shows it (the page's meshes keyed
by version and line, since a line like 050401-4 is the block of every version); `recipes_site.py` gives a line's WRECIPES entries a `v` (`'last'` for the ones without a
`rev`) as soon as one of them has a version of its own, and `maker.js`'s `recipesHTML` shows only the entries whose `v` the Wempe's `cfg.recipesShow(v)` accepts (`app.js`:
`revShows(v, mix.esc)`, the escapement subassembly's version, so 3955 shows the 'first' ones). No `v` or no function: every entry, as before.

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) | Notes |
|---|---|---|---|---|
| Stud screw WN-11 | 6 | 12.80 / 11.13 (thread) | 0.0134 | the page's `screw()`: one recipe `screw()` as the others; sizes lifted to `STS` |
| Arm screws WN-10 | 4 | 2.30 / 1.91 (thread) | 0.0051 (slot box 0.1265, expected) | countersunk head, M1 thread; the slot's heading is the page's random one, found by `free_spin`; sizes in `HUB.sc` |
| Mass screws WN-12 | 5 | 1.98 / 1.85 (thread) | 0.022 (head top fan, expected) | the head's face turned on the mass's round side, the slot across; sizes in `MS.sc` |
| Detent block, the escapement of 1943 | 10 | 642.41 / 639.82 | 0.155 (the hole across, expected) | the last revised block's form with the slit along the plate through the upright, the 6MX's stud and pins (`HOLES.block43`); key `detentBlock.1943` |
| Hairspring collet 05 03 02-2 | 4 | 80.68 / 80.68 | 0.004 | `COL` (escapement.js, module scope; build reads it): ends arcs about the bore, the 1:70 bore, the slit, the spring's hole leaning 3.7° and tapering 1:90 |
| Hairspring stud 05 03 02-3 | 3 | 51.66 / 51.67 | 0.0017 | `STD`: the bar, the two facets to a knife edge, the upright leaning 8°, the Ø 1.5 and Ø 0.7 holes |
| Collet's and stud's pins 05 03 02-4 | bought | | | brass wire, filed half round (the page's pins are the hole's round less the strip's side) |

(The first-drawn block's arm and the Soviet 6MX's block, left here on 31 October 2026, are batch 8d below.)

### Batch 8d (1 November 2026): the detent block in every version, the banking screws and studs; 13 recipes pass

The literals of the first-drawn block (`armEl`), the 6MX's block and the 1943 block's screws were lifted into `BLK` (`BLK.first`, `BLK.m6`, `BLK.s43`) and the detent's two screws into `DETK.gs`
and `DETK.gf` (escapement.js), each step with `recipes_pagehash.py` in all five versions (last, first, 3955, 6mx, 1943) over the twelve lines the block touches (050401-4, WN-gk, WN-gkA,
WN-gkA43, cone41, 6MX.gke, 6MX.gks, WN-201.gk, WN-gf, WN-14): the page unchanged within 1e-5 mm. `Recipe.show` (new) is the revision list the card shows a recipe under where it
differs from `rev` (revShows: the drawn first block is `'first -3955'`, since rev `'first'` would also show on Wempe 3955's card); `recipes_site.py` writes it as the entry's `v`. `TurnArcs`
(wempe_esc.py) turns a profile with arcs (a dome, a ball end) exactly. Every version of the detent block now has its recipe, and the cards link the right one (`smoke.py --model wempe` asserts
it for all five versions).

| Part | Key | Volume, recipe / page (mm³) | Surface apart (max) | Notes |
|---|---|---|---|---|
| Detent block as first drawn (05 04_1) | `detentBlock.first` (`v` `first -3955`) | 815.08 / 811.33 | 0.1553 (the hole across, expected) | the long arm with the cove r 1.82 (an exact arc where the page has 16 chords), the slit 0.2 × 6.1 and the screw's hole |
| Detent block as Wempe 3955 photographs it | `detentBlock.3955` | 867.71 / 863.40 | 0.1553 (the hole across, expected) | the arm flush with the base's edge, 3.56 wide, the slit 0.14 × 5.1 |
| Detent block, the Soviet 6MX's | `detentBlock.6mx` | 604.19 / 598.66 | 0.1684 (three holes at the thread's major diameter, expected) | the base, thin part and notch as the page's four cells, the taper, the slit end, the stud's M1.7, the stop screw's M1.4 |
| Adjusting slide 6MX.gks | `adjSlide6` | 30.91 / 30.93 | 0.0019 | a key 3.2 wide, 2.5 deep, the stud's clearance hole |
| Banking screw WN-gkA (6MX) | `bankScrew6` | 13.84 / 13.90 | 0.1578 (the slot bar, 0.4487 where it hangs under the rim, expected) | M1.2 thread, the dome rH 1.7 × 1.4 as an exact cap |
| Banking screw WN-gkA43 (1943) | `bankScrew43` | 20.29 / 20.54 | 0.1986 (the slot bar, expected) | the head 1.1 long under a dome 0.4 |
| Banking screw cone41 (first; Wempe 3955 0.55 longer) | `cone41`, `cone41.3955` | 13.86 / 14.40; 14.48 / 15.02 | 0.1503 (the slot band, expected) | the pointed tail (a cone to a point), the dome R 1.8 |
| Block studs WN-gk (6MX, 1943) | `studScrew6`, `studScrew43` | 63.41 / 60.32; 57.86 / 56.15 | 0.0185 (the kit's 24-sided head) | Ø 3.4 × 5.85, the slot 0.5 × 0.9 at the page's heading; `blockScrew` now `v` `last first` |
| Foot stop screw 6MX.gke | `stopScrew6` | 18.84 / 17.92 | 0.0105 | `screw()` Ø 4.2 × 1.2, M1.4 × 2.5 |
| Gold spring's screw WN-14 | `goldScrew` | 0.69 / 0.74 | 0.1205 (the slot, expected) | Ø 1.4, the head's top rounded 0.1 at the rim (an arc through the page's parabola), M0.7 × 0.175 |
| Foot screw WN-gf | `footScrew` | 3.575 / 3.517 | 0.0098 | the page draws it plain: head Ø 1.6 × 0.45, shank Ø 1 × 3.4 |

**Coverage of the escapement side** (a sweep of every part-line the page shows in the five versions against `WRECIPES`): before the batch, 050401-4 (last, 1943), WN-gk (last/first only; the
6MX's and 1943's studs are other solids under the same line), and no recipe or bought line for WN-gkA, WN-gkA43, cone41, 6MX.gks, 6MX.gke, WN-14, WN-gf; after it, every line escapement.js draws has one
(or a bought line: WN-201.gk, WN-205.d, the stones). Lines the sweep still finds without one are not escapement.js's: the fusee side's 050702-2, 050703-1/-2/-3, 050704 (fusee.js) and the 6MX's
contact set 6MX.ct*, 6MX.cw, 6MX.ch*, 6MX.jw* (train.js and its siblings).

**Page faults, recorded in `expect`** (and in the table below): the slot bars of the dome-headed screws are solid dark bars following the curve 0.45 deep (the 6MX's banking screw's hangs 0.45 under the head's underside at the
rim, in the air), not cut into the head; the 6MX block's M1 and stop-screw holes are drawn at the thread's major diameter (r 0.5, r 0.70), the 1943 block's M1 at the minor; and the 6MX block's notch
for the slide: the thin part's corner stops at the notch's near wall (0.35 beyond the base's side, nE - 6.4), so a strip 0.35 wide stands from 2.5 to 3 under the plate beside the thick part, with nothing at 3-6.5 over it.

Left for later: the bought line WN-201.gk (the steady pins) gives the last revised block's lengths (7.8 and 4.3) for every version; the first-drawn block's are 6.5 through, the 6MX's and 1943's 1.2 into the block
and 3 through the thin part (a bought line has no version).

### Batch 11b (31 October 2026): the case; 23 recipes pass, five lines bought

The page's literals moved into `dims.js` first (`WD.CASEQ`, beside `WD.CASE`), `case.js` reading them back in the same places: the gimbal ring `RG` (its bracket `bk`, the lock's window `lk`), the knurled lock nuts `NUT`,
the inner pivot screw `P79`, the case brackets `BR`, the locking bracket `LB` (its section `P`), the closing plate `CP`, the bowl `BW` and `TH` (the thread), the bezel `BZ` (its section `pz`, the knurl `kn`, the glass `gl`), and the screws `S71`, `S72`, `S80`,
`SUR`. **Proof, stronger than `recipes_pagehash.py`** (which takes a line's first object only): a dump of every mesh under the box (`__BX.root`: the movement and the case) in each of the five versions, each in its local frame (its matrix up to its
`partName` group, so the gimbals' and the shutter's motion does not show), compared vertex for vertex within 1e-5 mm and index for index with the unmodified tree's: identical in all five after the lifts, and again after the retag (only the tags
differ). The scratch script was `casedump.py`; its idea belongs in `recipes_pagehash.py`, which reads the first object only (batch 10's gap, again).

**The case's holes are not curved.** The brief expected torus segments for `sweepS`'s swept holes. They are straight cylinders along a radius (the sections are revolved, the holes bored along a radius at one turn `a`), so an exact `Drill`;
the brackets' sections are exact revolutions (`Sector`: a profile turned through part of a turn). The same for the ring's transit-lock window (a rectangle revolved between two radial planes). No torus segment was needed or cut.

**Engine** (`tools/recipes/ops_case.py`; the case's recipes in `tools/recipes/wempe_case.py`, which `wempe.py` imports in its last three lines): `Revolve` (a profile turned with exact arcs: the bowl's round r 7, the closing plate's r 1.3), `Sector`
(stock, add, cut), `TurnIn`, `DrillT` (a tapped hole along any axis: its thread zone `('ax', origin, direction, r0, r1, l0, l1)`, which `recipes.py`'s `in_zone` and its volume allowance now take), `Point` (a drill's point), `Note` (a zone only: a fine thread on
a cast part and a straight knurl, DIN 82, each drawn as its nominal cylinder with the designation on the sheet). `recipes.py`: a recipe's `rev` (`'6mx'`) checks it against that version's page (parts the 6MX alone has: its flat closing plate's screw and
knob, its box's pivot screws, its carrying case's strap screws); `winding()`'s chunk follows the face count (the bowl's thread band is 300,000 faces; 256 at once would need gigabytes).

| Part | Operations | Surface apart (max, recipe to page / page to recipe) |
|---|---|---|
| Gimbal ring 050100-5 (Ø 140 / 148, 24 high; two Ø 3.2 pivot holes, one blind; M5 and M2.5 tapped radial holes; the transit lock's window) | 8 | 0.0130 / 0.0119 |
| Ring bracket 050100-6 (a sector 44° round the ring, bevelled 2 × 2, three holes) | 4 | 0.0123 / 0.0123 |
| Lock nuts WN-400, WN-400.w (a ring, knurled: Ø 22 / Ø 22.7 at the tips, 120 / 140 teeth, DIN 82 RAA 0.6 / 0.5) | 2 each | 0.0030; 0.0036 |
| Case bracket 050100-3 (foot sector 42.4° + boss 9 wide, pivot hole, two Ø 4.5 screw holes) | 5 | 0.0193 / 0.0195 (the holes are 24-sided polygons whose flats lie at the radius) |
| Locking bracket 050100-4 (a profile extruded 15.7 across, the neck from 1.75, a Ø 2.9 hole) | 2 | 0.0450 / 0.0526, expected (below) |
| Closing plate 050100-2 (turned, the round r 1.3, the groove, five holes, a blind Ø 1.2 with its 118° point) | 8 | 0.0258 / 0.0256, expected (the round in four chords) |
| Bowl 050100-1 (cast, recess opened, floor faced, thread rim, rebate, notch, three holes; the fine thread M110.55 × 0.75 by convention) | 10 | 0.0157 / 0.0163 |
| Bezel 050101-2 (turned section, the thread M110.61 × 0.75 inside by convention, the 460-tooth knurl Ø 121.2, DIN 82 RAA 0.8) | 3 | 0.0173 / 0.0173 |
| WN-79 (M5 × 9.6, a Ø 3.0 tip 4.6 beyond) | 8 | 0.0229 / 0.0230, expected (head Ø 9.2) |
| WN-78.m4, WN-78.m25 | 6 each | 0.0174; 0.0120 |
| WN-71 (shoulder), WN-71.f (6MX) | 7; 6 | 0.0180; 0.0200, expected |
| WN-72, WN-72.6 (6MX) | 6 each | 0.0130; 0.0163 |
| WN-80.3, WN-80.9 (M6, Ø 12 head, tips 5.1 / 4.1 beyond), WN-80.3m, WN-80.9m (6MX box, Ø 9 head) | 8 each | 0.0300, 0.0300, 0.0225, 0.0225, expected (the heads' 32 sides) |
| WN-ur, WN-ur.6 (6MX) | 6 each | 0.0174; 0.0175 |

Bought lines: the bezel's glass 050101-1 (Ø 111.6 × 3.5, its top edge chamfered), the closing spring 050100-7 (Ø 1.0 wire, a flat spiral: its sprung shape follows the plate's turn), the wooden box (joinery; its hinges, handles, latch tongue, key holder, lid
stay and maker's plate are fitted to it and made elsewhere), DIN96 (the transit lock bracket's wood screws, DIN 96 3 × 15) and WN-ro (the eyes' screws, "3 x 15 DIN 96").

**Splits.** `WN-78` (four M4 on the case brackets, one M2.5 on the locking bracket), `WN-71`, `WN-72`, `WN-80` (two sides, two boxes) and `WN-ur` are now one line a size, in `bom.json`, `case.js`, `BOM.md`, `makers.js` and the cards' lines in
`app.js`. `WN-79`, `WN-ro` and `DIN96` are one size each and were not split (WN-ro and DIN96 became bought lines). A line of a part only the 6MX has carries `"rev": "6mx"`, the drawings' `"rev": "last first 1943"`.

**Page faults, recorded in `expect`** (and in the table below): the locking bracket's screw hole (0.05 chords: `bore`'s `capFix`, the detent's and gold spring's fault again); the closing plate's round in four chords (0.025); the kit's 32-sided screw heads above Ø 8
(WN-79 Ø 9.2 0.023, WN-71.f Ø 8 0.020, WN-80 Ø 9 and Ø 12 0.022 and 0.029). Not in an `expect`, to be judged on the page: **WN-ro** is drawn with a head Ø 8.5 × 2.2 on the shank of a "3 x 15 DIN 96" (the standard's head is Ø 5.6 × 2.0).

**Deferred, and why** ((1) and (2) done in batch 12, 1 November 2026). (1) The transit lock `050101.F`: one parts-list line on six pieces (bracket, lever, arbor, hub, pin, knob), whose sizes are mostly estimated; it wants its line split by piece first (as the screws) and the bracket's bent leg, the lever's stadium,
the knurled knob and the pin's head made exact. (2) The key: the body 05 01 02-2 and the tube 05 01 02-3 are every-figure turned parts (the likeliest next candidates), the paddle 51 00 11-1, the grooved pin and the coil spring a disc, a pin and a wound spring; the key
stands in the box or on the fusee's square, so the check needs its pose frozen. (3) The box's fittings (hinges with leaf and knuckle, handles, the lid stay, the key holder's cup, the latch strap, the maker's plate, the carrying case's strap, eyes and cushions) and the 6MX's own
(strips, caps, hasp, badge): brass and steel pieces, each a plate bent and riveted to wood, estimated, with no dimension a maker needs from this model.

### Batch 12 (1 November 2026): the keys, the transit lock, the hook, the stud, the band's hooks, three chatons; 23 recipes pass, 62 lines bought, the parts list covered but for the 6MX's contact and the escapement side's eight

`tools/recipes/wempe_rest.py` (imported by the last line of `wempe.py`). Made (23): the 1943 key's body 05 01 02-2 (`keyBody`), tube 05 01 02-3 (`keyTube`) and paddle 51 00 11-1 (`keyPaddle`); the 1940 key's pipe, body and cap with its handle's blade
(`key40Pipe`, `key40Body`, `key40Cap`, `rev='first'`); the transit lock's bracket, lever, arbor, hub, grip and knob (`lockBr`, `lockLever`, `lockArbor`, `lockHub`, `lockPin`, `lockKnob`, with `lockBr6`, `lockLever6`, `lockPin6` for the 6MX's `rev='6mx'`); the barrel
arbor's hook 05 07 02-2 (`hook`, `hook41` as first drawn, 3 along the arbor); the maintaining detent's wire stud (`wireStud`); the band's round and drum hooks (`bandHookRound`, `bandHookDrum`: fusee.js's BHK walked as exact arcs and tangent lines, the page's polyline
arcs 0.007 and 0.0125 off); and the 6MX's three chatons (`chaton38u`, `chaton35u`, `chaton38l`).

| Recipe | Worst surface gap, recipe to page / page to recipe | Notes |
|---|---|---|
| `keyTube` | 0.012 / 0.022 | the sink's cone from strips along 1.5° sectors; in `expect` |
| `keyBody` | 0.036 / 0.040 | the spring's hole upright above the drill point's foot on the page; the top chamfer's cone in four steps (0.03); in `expect` |
| `keyPaddle` | 0.004 / 0.004 | |
| `key40Pipe`, `key40Body`, `key40Cap` | 0.010 / 0.010, 0.008 / 0.008, 0.009 / 0.009 | the cap and the handle's blade are one parts-list line on the page: the cap turned, the blade let into its slot and soldered |
| `lockBr`, `lockBr6` | 0.029 / 0.029 | the seat's round end is 16 chords; in `expect` |
| `lockLever`, `lockLever6` | 0.0003 | the lever is a stadium of true arcs on the page |
| `lockArbor`, `lockHub`, `lockPin`, `lockPin6`, `lockKnob` | 0.025, 0.024, 0.038, 0.038, 0.028 | 20-, 32-, 16- and 40-sided prisms (cylBetween, latheF); in `expect`, with the prisms' volume where the page is one piece |
| `hook`, `hook41` | 0.017 / 0.020, 0.018 / 0.019 | a 24-gon pin and 20 chords of the ramp |
| `wireStud` | 0.028 / 0.030 | the slot is the head's two halves with the floor between them; in `expect` |
| `bandHookRound`, `bandHookDrum` | 0.007, 0.0125 | |
| `chaton38u`, `chaton35u`, `chaton38l` | 0.005 | the 6MX's estimated chatons (`rev='6mx'`) |

**The key needs no frozen pose.** `recipes.py`'s export takes each mesh in its own frame, so the key's place in the holder or on the fusee's square doesn't matter; the check passes without a change to `POSE`. Which versions have which key: `last`, `6mx`, `1943` the one key
(51 00 11), `first` and `3955` the 1940's (127-556.02); each key's pieces are `rev` `first` for the 1940 and the default for the other.

**The transit lock split.** `050101.F` is now an assembly line (`"kind": "asm"`, not tagged on the page) with six piece lines, `050101.F.b` bracket, `.a` arbor, `.h` hub, `.l` lever, `.p` grip, `.k` knob, in `bom.json`, `case.js`'s `tag()` calls, `app.js`'s `PIECES.caseLock` (the card's
pieces), `BOM.md` and `makers.js`. The names avoid the words `bom.json`'s seat check keys on (pin, screw, stud, hook). The lock's sizes are all estimated (case.js: the owner's case design, Wempe 5377 and 3044's photographs, Romanov for the 6MX); the sheets say so.

**Sizes moved into `dims.js`**, read back by the page with the same expressions in the same order: `KEYQ` (the 1943 key's tube, body, paddle, pin and spring; the 1940 key's body, pipe, cap, handle outline, screws and spring), `LOCKQ`, `FU.HK` (the hook), `FU.WS` (the stud),
`FU.BHK` (the band hooks' circles and the drum's radius), `SM6` (the 6MX's chatons). The page's meshes before and after, every mesh of the box and the movement in all five versions (`last`, `first`, `3955`, `6mx`, `1943`): identical within 1e-5 mm and their indices exactly; only the lock's
tags changed. `wempe_sustaining.js`, `wempe_physics.js`, `wempe_strength.js`, `wempe_overwind.js` and `wempe_escapement.js` print byte-identical output from before and after (elapsed-time lines left out); `wempe_transmission.js` and `maintaining.py --model wempe`: see the report.

**Bought lines (62 new).** The key's grooved pin and coil spring, the 1940 key's click spring and two countersunk screws; the chain `050704` (375 links, the drawing's whole specification: made by a chain maker, 1,500 plates and 750 rivets are not a CNC job; its two hooks are flat parts a maker can
cut from the strip to 05 07 04's outlines) and the band `050703-1` (strip 727 × 0.22, its width not given: taken as the hooks' 0.8, estimated); the box and outer box (joinery and hardware: hinges, handles, latch, stay, key holder, felt, strap, glass, plates: every size the page's, estimated where case.js
says so), the 6MX's box and its hardware, its three hole jewels and the contact's four jewels and pallet stone, its fibre insulation, washers and bushes, its standard screws, pin and terminals. A line the owner would call joinery says so (`JOIN`). `recipes_site.py` now prints the parts-list lines that have neither a recipe nor a bought line on a card
(informational, it never fails).

**Coverage.** Before this batch 113 parts-list lines of 286 had no recipe or bought line (13 of them assemblies, which need none). After: 24 of 278 non-assembly lines: the escapement side's eight (`WN-12a`, `WN-14`, `WN-gf`, `WN-gkA`, `WN-gkA43`, `cone41`, `6MX.gks`, `6MX.gke`: `escapement.js`, the detent
blocks' batch) and the 6MX's electrical contact's made parts (16: `6MX.ct` base, `.ctbp`, `.ctbm` blocks, `.ctd` disc, `.ctst` staff, `.ctjs` jewel setting, `.ctc` cock, `.ctcc` cap plate, `.ctl` lever, `.ctk` screw, `.ctn` nut, `.cth` spiral, `.ctq` stud, `.ctqs` clamp screw, `.cw` contact wheel, `.cf` bowl spring),
all hand-built in `train.js` from Kirov 247's photographs and Romanov's figures with their sizes local literals and every one estimated; each wants its literals lifted into `dims.js` first.

**Page faults, recorded in `expect`** (and in the table below): the lock's prisms and the seat's round end; the key's top chamfer cone and sink strips; the key body's spring hole; the stud's slot as a stepped head. Not in an `expect`: the lock bracket's wall leg has no holes for the two wood screws
the page draws through it; the lever has none for the arbor and the grip; the grip, hub and knob have none for their fits. A maker bores them; the sheets say so.

**Deferred.** The 6MX's contact (above); `6MX.jw38u`, `.jw35u`, `.jw38l` and the contact's jewels are bought lines with the page's sizes where `train.js` has them.

### Batch 13 (1 November 2026): the 6MX's electrical contact; 16 recipes pass, five lines bought, the parts list covered

`tools/recipes/wempe_ct6.py` (imported by the last line of `wempe.py`). All of it was hand-built in `train.js` (and `case.js` for the springs) from Kirov No. 247's photographs and Romanov's figures, with no works drawing: **every size is an estimate**, and every sheet carries a note saying so, with the sources (Kirov No. 247 by Altmeppen, Romanov 1975 Figs. 100-101 and p. 105). Made (16 recipes, all `rev='6mx'`): the base `6MX.ct` (`ct6Base`), the blocks 52 and 57 (`ct6BlockP`, `ct6BlockM`), the spiral stud (`ct6Stud`), the staff (`ct6Staff`) and its upper jewel setting (`ct6Setting`), the cock and its cap plate (`ct6Cock`, `ct6Cap`), the lever (`ct6Lever`: boss, two sheared arms and the holder, one soldered piece), the contact screw (`ct6Screw`), the disc and its bracket (`ct6Disc`, `ct6DiscBracket`), the contact wheel and its collet (`ct6Wheel`, `ct6Collet`), and the two springs in the bowl (`ct6SpringA`, `ct6SpringB`: a milled foot and three soldered tines each).

| Recipe | Worst surface gap, recipe to page / page to recipe | Notes |
|---|---|---|
| `ct6Base` | 0.0049 / 0.0049 | the five tapped M1.4 holes in `expect` (drawn plain at the thread's size + 0.02) |
| `ct6BlockP`, `ct6BlockM` | 0.0055 | |
| `ct6Stud` | 0.0 | the clamp screw's M1.2 hole in `expect` |
| `ct6Staff`, `ct6Setting` | 0.0043, 0.0046 | the page's 24- and 40-sided lathes |
| `ct6Cock`, `ct6Cap` | 0.0049, 0.0062 | the cock's foot, leg and arm one fused mesh; the cap plate a union of true circles |
| `ct6Lever` | under 0.02 outside the holder's bore (0.135 there, in `expect`) | the holder's bore drawn at the screw's major diameter; the arms solid through the staff's seat |
| `ct6Screw` | 0.0062 | the page's thread is grooves 0.06 deep; the recipe a plain cylinder with the thread named |
| `ct6Disc`, `ct6DiscBracket` | 0.0064, 0.0 | the knurl's chords |
| `ct6Wheel`, `ct6Collet` | 0.0015, 0.0021 | the ratchet teeth as splines and arcs against the page's chords |
| `ct6SpringA`, `ct6SpringB` | 0.0068 | the foot's chords every 2 degrees |

**Three new check options (`recipes.py`)**, for lines that hold several pieces: `pieces` (indices into the line's meshes in the export's order, root first: the disc is mesh 0 of `6MX.ctd`, its axle screw 1 and its bracket 2; the wheel 0 and its collet 1), `root_i` (the line's second root: `6MX.cf` is two springs, the second's foot a root of its own, not a sub) and, with it, `near` to keep each spring's tines. The export takes `hn|i` for the i-th root. The bracket's recipe carries the matrix from its own frame into the disc's mesh frame (the box's turn about the disc's axis, and the shortest turn that stands the disc's axis along its direction in the plan), since the export puts every piece in the root's frame.

**Sizes moved into `dims.js`** (`WD.CT6`, read back by the page with the same expressions in the same order): the base's holes, the foot's screw and pins, the fibre and blocks, the disc (teeth, recess, bracket, axle head), the staff's profile, the cock and its cap plate, the stud, the lever, the contact screw's thread, the wheel's ratchet and spokes, and the springs' (`CT6.cf`). The page's meshes before and after, every mesh of the box and the movement in all five versions (`last`, `first`, `3955`, `6mx`, `1943`, with the contact shown): identical within 1e-5 mm and their indices exactly, **compared NaN-aware** (a first comparison passed because `np.abs(nan) > 1e-5` is false: one lifted token read `b:K6.base.pY` for `K6.base.pY[1]` and made the base's blind pin holes' floors NaN; the recipe's check found it, the comparison was made to fail on NaN, and the lift fixed). `wempe_escapement.js`, `wempe_6mx.js`, `gearing.js --model wempe --quick`, `wempe_motionwork.js`, `invariants.py --model wempe`, `wempe_inertia.py`, `wempe_inertia.py --rev 6mx` and the Wempe type check print the same before and after (signed zeros in two inertia lines left out).

**Bought lines (5).** The spiral stud's clamp screw `6MX.ctqs`; the lock nut `6MX.ctn`; the spiral `6MX.cth` with its small collet (a strip wound on a former and a turned ring, whose collet turns with the lever while the spiral is fixed to the stud, a pair no recipe can check on one frame); the disc's axle screw (a `6MX.ctd` line); and `WN-12a`, the poising screw for the masses' empty tapped tops (not fitted: the owner's choice of 28 October 2026; the sources show a cheese head and a thread 1.17 wide and 1.9-2.0 deep but size no head, so none is given).

**Page faults, recorded in `expect` or the table below.** The contact's tapped holes are drawn plain at the thread's size + 0.02 (the base's five, the stud's, the lever's holder). The lock nut `6MX.ctn` is a hex 1.1 across the corners (0.95 across the flats) with a Ø 1.0 bore drawn through it, which breaks through all six flats: six slivers of 0.0135 mm³ in all, no nut at all. The springs' feet have no holes for the screws that hold them; the tines are separate pieces overlapping the foot by 0.016.

## Page faults found (for a later fix on the page)

| Part | Where | Size | What |
|---|---|---|---|
| ~~Top plate 05 09 01~~ | ~~the pocket N-O's far side~~ | 0.047 | drawn tangent to r 4.95 about 23 (frame.js, so it crosses the opening cleanly); the sheet's r 5. Tried at r 5 on 29 October 2026: the solid opens; needs the opening and pocket cut as separate features **fixed on branch claude/wempe-faults-a, in the next release (the hull's tangent runs to the r 5 circle's point at r 4.99: 0.0098 off, inside the check's 0.02, the recipe's `expect` gone; a hull arc on the opening's r 5 itself still opens the solid)** |
| Upper balance cock 05 08 03-1 | the stud's slot through the boss | 0.13 | the boss draws the slot's end wall upright, 0.02 inside its place at the boss's face, where the arm's wall leans 8° (C-D's 82°); one milled slot is one plane through arm and boss **Not fixed (branch claude/wempe-faults-a, 1 November 2026): the slot's end wall sits in the boss's cone-strip cells (frame.js `bo`, their corners shared with the face's disc and the holes' bites); leaning it 8° through the boss means rebuilding those cells, which needs fine.py/bom.py iterations; left for its own pass** |
| ~~Dust plate 05 06 00-1~~ | ~~the square hole at the recess floor~~ | 0.005 | fusee.js tapers the hole from the square's size 3 from its root at the recess's mouth (y0) to 1 at its face, 1:150 over 3 mm; the drawing's 1:100 runs from the floor (y0 + 1): 0.005 large there on the half-diagonal. Within the check **fixed on branch claude/wempe-faults-a, in the next release (dims.js SP.d [4,1]: 1:100 from the face, the recipe's `expect` gone)** |
| ~~Barrel drum 05 07 01-1~~ | ~~the Steg's slot~~ | 0.35 | its pocket is 1.6 deep through the 1.25 bottom, and facePocket leaves its floor as a stray face in the drum's hollow 0.35 under the bottom; in the recipe's `expect` **fixed on branch claude/wempe-faults-a, in the next release (`capFix` at the pocket's floor plane, the recipe's `expect` gone)** |
| Detent 05 04 01-1, gold spring 05 04 01-2 | the foot's screw hole, the head's hole | 0.025, 0.048 | the bore across a thin strip (fusee.js's `bore` through `holeCut`, closed by `capFix`) joins its two mouths' vertices with wall triangles that skip round the hole, chords inside its circle; in both recipes' `expect` **Not fixed (branch claude/wempe-faults-a, 1 November 2026): the bores are `nBore` in escapement.js (the sibling's file, 16 sides); `bore` itself leaves a hole as round as n makes it** |
| ~~Set-up ratchet 05 07 00-3~~ | ~~its height~~ | 0.02 | RS0 counts the barrel bridge 3.32 thick (WD.FU.SR.BB, lifted as fusee.js had it), but the bridge is 3.30 since the owner's correction (WD.BB.t): the ratchet stands 0.07 off the bridge, not the 0.05 its comment says. The recipe and page agree; not changed here **fixed on branch claude/wempe-faults-a, in the next release (dims.js SR.BB 3.30)** |
| ~~Timing screw 05 03 01-2~~ | its slot | 0.126 | drawn as a solid dark box (1.67 × 0.3 × 0.25) standing 0.02 out of the head's end, not cut into the head; in the recipe's `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): the slot cut into the head's end (`KIT.slotHeadGeo`)** |
| ~~Balance arm's screws WN-10, compensation masses' screws WN-12~~ | the head's slot | 0.126 | each slot is a solid dark box (WN-10 1.3 × 0.25 × 0.2, WN-12 1.6 × 0.25 × 0.25) filling the slot and standing 0.02 out of the head's face, not cut into the head; in both recipes' `expect` and `box_tol` **Fixed 1 November 2026 (claude/wempe-faults-b): both slots cut in** |
| ~~Compensation masses' screws WN-12~~ | the head's top | 0.022 | the head's face follows the mass's round side by bending a lathe's top fan (24 triangles from the centre to a rim of 24 points) in x only: the true cylinder is up to 0.022 away between the rim points; in `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): the head's face a surface on the mass's round side (no fan)** |
| Detent block of 1943 (050401-4, 1943) | the banking screw's hole across the leaves | 0.155 | as the last revised block's: a bore r 0.62 round the shank's 0.6, the recipe tapped M1.2 at the tap drill; in `expect` |
| ~~Dome-headed screws WN-gkA, WN-gkA43, cone41, WN-14~~ | the head's slot | 0.12-0.45 | each slot is a solid dark bar following the dome 0.15-0.5 deep and standing 0.01 out of it, not cut into the head; the 6MX's banking screw's bar (WN-gkA) hangs 0.45 under the head's underside at the rim; in the recipes' `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): each slot cut in, flat-floored, ending where its floor meets the dome** |
| Detent block of the 6MX (050401-4, 6mx) | the end face's M1, the stop screw's M1.4 | 0.17 | drawn at the thread's major diameter (r 0.5 and r 0.70 polygons), the 1943 block's M1 at the minor; in `expect` |
| Detent block of the 6MX (050401-4, 6mx) | the notch for the adjusting slide | 0.35 wide strip | the thin part's cell stops at the notch's near wall (nS0 = nE - 6.94), 0.35 beyond the base's side (nE - 6.59), so a strip from 2.5 to 3 under the plate stands beside the thick part with an empty gap over it (3 to 6.5); the recipe follows the page's cells |
| ~~Escape wheel's upper endstone screws WN-es~~ | the shank's end in the slot | 0.032 | `screw()` runs the shank 0.1 into the head, but this head is 0.3 high with a 0.232 slot (KIT headGeo): the shank's end stands up into the slot; in the recipe's `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): `screw()` runs the shank into a thin head only as far as the slot's floor allows (em 0.063)** |
| ~~Minute, hour, up-and-down and seconds hands~~ | the blade's root against the boss | 0.07-0.10 | the blade is a separate closed piece with an 8-segment root arc at the boss's radius, against the boss's 72-sided wall: a hairline gap (0.003) at isolated samples; in the recipes' `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): the roots start on the boss's circle at the bosses' own vertices (72 and 48 sides), the side edges from the circle, the thickness tables' radii stations; recipe check 0.004-0.018** |
| ~~Hour hand 05 02 00-2~~ | the root wedge's underside | about 0.1 | the wedge's underside follows the bevel's cone as flat cells every 0.25 across a blade 1.7 wide, not the cone (likely); in `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): stations every 0.02 across the wedge, its lines in sixteenths (0.0159)** |
| ~~Seconds hand 05 02 01-1~~ | the tail's thickness ramp | 0.027 | the table steps 0.3 to 0.5 between 6.4 and 6.6; the page samples it at 6.35, 6.5, 6.55, 6.6; in `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): stations at the thickness table's radii (0.006)** |
| Locking bracket 050100-4 | the screw's hole through the foot | 0.053 | `bore` through `holeCut`, closed by `capFix`, joins the hole's mouths with triangles that skip round it (the detent's and the gold spring's fault again); in its `expect` |
| ~~Closing plate 050100-2~~ | the round r 1.3 between rim and boss | 0.026 | case.js draws the quarter circle in four straight rings of 22.5°; its chords lie 0.025 inside the arc; in the plate's `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): the round in sixteen rings of 5.6 degrees** |
| ~~Case screw heads (WN-79 Ø 9.2, WN-71.f Ø 8, WN-80 Ø 12 and Ø 9)~~ | the head's round | 0.023, 0.020, 0.029, 0.022 | the kit's 32-sided polygon head, as WN-zg's; in the recipes' `expect` and `box_tol` **Fixed 1 November 2026 (claude/wempe-faults-b): kit headGeo: more segments over r 2 and the slot's mouth on the rim (the slot's end chord was the 0.0225 bulge, not the 32 sides)** |
| ~~WN-ro (the carrying case's eye screws)~~ | the head | 0.5 on the radius | the parts list says "3 x 15 DIN 96" (head Ø 5.6 × 2.0); the page draws Ø 8.5 × 2.2 on a 15 mm M3 shank; the recipe is a bought line, the page not changed **Fixed 1 November 2026 (claude/wempe-faults-b): drawn as DIN 96 3 x 15, head Ø 5.6 x 2.0 (a bought line; no recipe check)** |
| ~~Case screw heads (WN-zg, Ø 9)~~ | the head's round | 0.0225 | the kit draws a head a 32-sided polygon; a head over about Ø 8.5 is more than 0.02 inside its circle; in WN-zg's `expect` and `box_tol` **Fixed 1 November 2026 (claude/wempe-faults-b): the same** |
| Fusee body 05 06 04-2 | ~~the flange's lathe rows (walls up to 0.04 off the helix)~~; the slot's cutter arc and the groove's end N | 0.1, 0.13 | the row fault fixed in 3.66.01 (the flange swept with helixSolid, ribs square). Left: the 216 rays chord the cutter arc (floor climbing 0.4 between rays) up to 0.1 off the circle, and the end's rays join the last land's floor to the hub across a chord up to 0.13; the seam at 0° leaves internal end caps (a check artefact). In the recipe's `expect` |
| ~~Screws WN-19, WN-20, WN-21~~ | ~~the slots~~ | 0.15 | drawn as solid dark boxes lying in the heads (0.02 out on WN-20 and WN-21), not cut; in the recipes' `expect` **fixed on branch claude/wempe-faults-a, in the next release (fusee.js `slotted`: real slots cut across the heads, their apex fans inside the slot; the recipes WN-19 and WN-21 keep an `expect` of 0.13 at the slot floor's ends, p99 0.014: facePocket leaves a ramp where the floor meets the cone; WN-20 none)** |
| ~~Maintaining detent arbor 05 05 05-2~~ | ~~the turned profile~~ | 1.3 mm³ | the page turns it on 20 sides, 1.6 % under the circle's volume; in `expect` **fixed on branch claude/wempe-faults-a, in the next release (96 sides)** |
| Winding key body 05 01 02-2 (batch 12) | the top chamfer's cone; the spring's Ø 0.9 hole | 0.03; 0.04 | the 1.5 × 45° chamfer is cut in four steps up the jaws' columns; the hole is slanted to the drill point's foot and upright above it; in the recipe's `expect` |
| Key tube 05 01 02-3 | the 60° sink | 0.022 | strips along 1.5° sectors, a chord off the cone at the end face; in `expect` |
| ~~Transit lock (bracket, arbor, hub, grip, knob; case.js)~~ | the rounds | 0.025-0.038 | the seat's round end 16 chords, cylBetween prisms of 20, 32 and 16 sides, the knob on 40; in the recipes' `expect` **Fixed 1 November 2026 (claude/wempe-faults-b): the seat's round on 64 chords, the wall leg's corners on 32, the arbor on 64 sides, the hub and knob on 120, the pin and the grip's head on 64 and 120; five exceptions removed** |
| Transit lock | the holes a maker bores | none drawn | no clearance holes for the two wood screws through the wall leg; none in the lever for the arbor and the grip, in the hub and knob for their fits; the sheets say so |
| ~~Barrel bridge, fusee bush, dust bush~~ | ~~five sizes at their tolerances' tops~~ | | fixed 29 October 2026, the owner's choice (above) |
| Contact nut 6MX.ctn | the hex and its bore | whole | 1.1 across the corners (0.95 across the flats, the flats 0.476 from the axis) with a Ø 1.0 bore drawn through: six slivers (0.0135 mm³), 6 bodies; bought here, the page not changed **Not fixed (branch claude/wempe-faults-a, 1 November 2026): an M1.0 bore cannot lie in a hex 0.95 across the flats; the nut's size (0.5-0.8 across by 14_E-Kontakt1.jpg's rough camera) and the screw's M1.0 (drawing check 2, 11-M11) are both estimates that disagree, so the owner chooses which gives way** |
| 6MX contact (base, stud, lever's holder) | the tapped holes | 0.18, 0.14, 0.14 | drawn plain at the thread's size + 0.02, not the tap drill and a thread; in the recipes' `expect` with the volume left over **Not fixed (branch claude/wempe-faults-a, 1 November 2026): the plain-at-thread-size-plus-0.02 tapped hole is the project's convention for every frame hole and the owner kept it on 28 October 2026 (drawing check 2); changing three parts to threaded cells needs fine.py/bom.py/seatcheck iterations and is a decision, not a fault** |
| ~~6MX contact's lever 6MX.ctl~~ | ~~the arms through the staff's seat~~ | whole | the two arms start at the staff's axis and fill the boss's bore; the recipe follows the page **fixed on branch claude/wempe-faults-a, in the next release (train.js: the arms start at r 1.0 of the boss's wall)** |
| 6MX contact springs 6MX.cf | the feet's screws, the tines | whole, 0.016 | no holes in the feet for the screws that pass through the bowl's wall; the tines are separate boxes overlapping the foot by 0.016 **Not fixed (branch claude/wempe-faults-a, 1 November 2026): drawn in case.js (the sibling's file, claude/wempe-faults-b)** |
| 6MX contact disc 6MX.ctd | the axle screw and bracket | whole | the screw is a head only (no shank into the bracket), the bracket a plain block with no hole **Not fixed (branch claude/wempe-faults-a, 1 November 2026): the axle screw's shank and the bracket's hole have no source size (estimates), and the disc's centre is fused solid; they need a hole through the fused centre and a threaded bracket, left for its own pass** |

### Left open by claude/wempe-faults-b (1 November 2026, escapement.js, case.js, dial.js)
- **Upper balance cock's stud slot wall:** the boss is `frame.js`'s (the other branch's file).
- **Detent, gold spring and locking bracket bores:** the chords come from `fusee.js`'s `bore`/`capFix` (the other branch's file); case.js only calls them.
- **Banking screw hole across the leaves (1943 and last revised blocks), the 6MX block's M1 and M1.4, its notch's 0.35 strip:** a tapped hole needs a helix thread wall (`th` in `solidGeo`) and a threaded shank (`KIT.threadGeo`, `matchThreads`) in place of the rings the blocks' screws draw, and the 6MX notch's cells rebuilt; not done without `fine.py`/`seatcheck.py` runs on each version. The slots and domes of those screws are fixed.
- **Key body's chamfer steps and slanted hole, key tube's sink strips:** built from four meshing solids and 1.5 degree sectors (0.03, 0.04, 0.022, all inside the recipe check's 0.04 allowances); a rebuild of that code was not attempted.
- **Transit lock's missing bored holes:** no drawing shows them (the page's lock is scaled from 05 01's Schnitt A-B; the sheets say a maker bores them), so none is drawn.

## Decided

- **The setups' order.** The recipes' setups are a plausible shop order, not a source's. Should a sheet say "a suggested order" and leave it to the
  maker, or should each sheet set the order firmly (as a works drawing's Arbeitsplan would)?
- **Bought parts.** Jewels, the mainspring and hairspring strip, standard screws: a recipe that makes them, or a line saying what to buy and its size?
- **Phase 3, the page built from the recipes.** It ends two builders drifting apart, but it's the largest step (every part's mesh replaced). Do it, or
  keep the page's builders and the recipes side by side with `recipes.py --check` keeping them in step?

### Phase 3 begun: one geometry (11 November 2026)
The owner's decisions on the page built from the recipes, after a pilot on three case parts (the key body, the key tube, the locking bracket; the Wempe README's "Parts drawn from their recipes' solids: one geometry" has the method, the encoding's table and the checks):
- **A leaner encoding first, then land the three.** Done: `tools/recipe_solids.py` writes `wempe/js/solids.js` (95 kB in the page for the three, 351 kB in the pilot), the page draws it, their hand-built builders are deleted from `case.js` and the essay's page loads the same data.
- **Which parts next.** Only parts whose hand-built mesh shows a fault (what `sheets.py --lines` still flags, facets, wrong holes), plain parts first. Threaded parts stay on their builders (a recipe draws a thread as its nominal cylinder). Not every plain part: all 82 plain recipes at the pilot's tessellation would have been 15.5 MB.
- **True B-rep edges in the Edges pass.** Later, not now.

To move a part: add its key to `checks.py`'s `SOLIDS`, run `recipe_solids.py --model wempe`, replace its builder in the page's script by `SOL(key)` (the recipe's `to_page` is the frame of the mesh it replaces), drop the recipe's `expect`, then `recipes.py --check --only KEY`, `sheets.py --lines` and the geometry checks.

### Batch 9d after main's 3.66.01 (1 November 2026)
Merged main's flange (helixSolid, ribs square) and stop bar slot (1,1 deep over the whole upper end's side, 1,5 on the lower end's side of the recess, `SLR` gone). The fusee recipe's slot is now the shallow box over all of u and the deep one for u up to `SB.us`; the body's surface is 0.0019 apart at p99 (was 0.026), 0.13 at most at the groove's end N. The row-quantisation `expect` is dropped; one is added for the page's end caps at the 0° seam. The page was proved main's by `recipes_pagehash.py` (38 fusee-side lines, five versions, against a baseline taken on origin/main's own worktree) and the byte-identity tools.
