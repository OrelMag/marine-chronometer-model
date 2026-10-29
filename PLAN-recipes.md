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
| 1 | Frame I: plates, pillars, ring and their fittings | top plate, pillar plate, pillars, movement ring, cork ring; screws WN-57, WN-56, the ring's; pins WN-201, WN-202, WN-203 (bought) | done, 29 Oct |
| 2 | Frame II: barrel bridge, bushes | barrel bridge, its click and click screw WN-22, screws WN-55; fusee bush and screws WN-34; dust bush | done, 29 Oct |
| 3 | Frame III: cocks and the intermediate bridge | upper and lower balance cocks and their screws; intermediate bridge, its screws WN-52 (the bush WN-300 goes with batch 6) | done, 29 Oct |
| 4 | Arbors and pinions | centre, intermediate, seconds and escape pinions with their arbors; balance staff | done, 29 Oct (the fusee and barrel arbors moved to batch 9) |
| 5 | Wheels with teeth | the centre, intermediate and seconds wheels, the escape wheel | done, 29 Oct (the fusee's wheels and ratchets moved to batch 9, the motion work's to batch 10) |
| 6 | Small turned parts | the bushes WN-301, WN-300 (×3), WN-302 and the hand-setting bush, the seconds jewel's setting, the studs' bushes and both studs, the escape wheel's collet; the seconds jewel (bought) | done, 29 Oct (the balance's and escape wheel's jewel settings, the hairspring's collet and stud moved to batch 8) |
| 7 | Springs and the detent | the mainspring and hairspring strip (bought, done 29 Oct); the detent, its block and gold spring (the frozen pose: 7b, done 29 Oct); the clicks and their springs, maintaining spring, maintaining detent and wire spring, stop bar and its spring (fusee.js: with batch 9) | part done: the clicks, stop bar and maintaining detent made, the springs' strip and wire bought (9c); 7b, the detent and gold spring made, the locking stone bought (29 Oct); the block made (29 Oct); the maintaining spring left |
| 8 | Balance and rollers | rim, masses, timing screws and weights, hub, impulse and discharge rollers, hairspring collet and stud; the balance's and escape wheel's jewel settings and caps, their jewels (bought) | done, 29 Oct: the collet and the stud (05 03 02-2, -3), the hub and mass screws (WN-10, WN-12) and the stud screw (WN-11) left (below) |
| 9 | Fusee and barrel | fusee arbor, body, cover plate, Vorreiber, dust plate, fusee wheel, click wheel, maintaining ratchet; barrel arbor, drum, lid, hook block, Steg, set-up ratchet (fusee.js: needs a Node loader) | done but the fusee body (9d) and the maintaining spring (7b), 29 Oct |
| 10 | Motion work, hands, dial | the motion work's wheels and pinions, hands, dial (dial.js: needs a Node loader) | |
| 11 | Case parts | bowl, bezel, gimbal ring, box fittings | |

### Batch 1 (29 October 2026): all 8 made parts pass

| Part | Operations | Volume, recipe / page (mm³) | Surface apart (max) | Notes |
|---|---|---|---|---|
| Top plate 05 09 01 | 63 | 12960.90 / 12943.83 | 0.047 (expected) | the page's r 4.95 tangent, below |
| Pillar plate 05 08 02-1 | 41 | 16306.30 / 16298.79 | 0.018 | passed first run, the hand-setting window's Ø 14 arcs and its bore included |
| Movement ring 05 08 00-3 | 14 | 20467.34 / 20438.62 | 0.014 | two recipe faults fixed (below) |
| Pillar 05 08 00-1 | 12 | 973.92 / 953.06 (thread) | 0.013 | |
| Cork ring 05 08 01-4 | 1 | 478.71 / 478.10 | 0.0075 | |
| Screws WN-57, WN-56, the ring's | 6 each | 133.08 / 124.43, 121.51 / 114.45 (thread) | 0.016 | one screw recipe for all (the page's screw()) |
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
| Their screws WN-55.ck, WN-10.bl, WN-es, WN-ec | 6 each | thread allowance | 0.0118-0.0123; WN-es 0.032 expected (below) |
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

## Page faults found (for a later fix on the page)

| Part | Where | Size | What |
|---|---|---|---|
| Top plate 05 09 01 | the pocket N-O's far side | 0.047 | drawn tangent to r 4.95 about 23 (frame.js, so it crosses the opening cleanly); the sheet's r 5. Tried at r 5 on 29 October 2026: the solid opens; needs the opening and pocket cut as separate features |
| Upper balance cock 05 08 03-1 | the stud's slot through the boss | 0.13 | the boss draws the slot's end wall upright, 0.02 inside its place at the boss's face, where the arm's wall leans 8° (C-D's 82°); one milled slot is one plane through arm and boss |
| Dust plate 05 06 00-1 | the square hole at the recess floor | 0.005 | fusee.js tapers the hole from the square's size 3 from its root at the recess's mouth (y0) to 1 at its face, 1:150 over 3 mm; the drawing's 1:100 runs from the floor (y0 + 1): 0.005 large there on the half-diagonal. Within the check |
| Barrel drum 05 07 01-1 | the Steg's slot | 0.35 | its pocket is 1.6 deep through the 1.25 bottom, and facePocket leaves its floor as a stray face in the drum's hollow 0.35 under the bottom; in the recipe's `expect` |
| Detent 05 04 01-1, gold spring 05 04 01-2 | the foot's screw hole, the head's hole | 0.025, 0.048 | the bore across a thin strip (fusee.js's `bore` through `holeCut`, closed by `capFix`) joins its two mouths' vertices with wall triangles that skip round the hole, chords inside its circle; in both recipes' `expect` |
| Set-up ratchet 05 07 00-3 | its height | 0.02 | RS0 counts the barrel bridge 3.32 thick (WD.FU.SR.BB, lifted as fusee.js had it), but the bridge is 3.30 since the owner's correction (WD.BB.t): the ratchet stands 0.07 off the bridge, not the 0.05 its comment says. The recipe and page agree; not changed here |
| Timing screw 05 03 01-2 | its slot | 0.126 | drawn as a solid dark box (1.67 × 0.3 × 0.25) standing 0.02 out of the head's end, not cut into the head; in the recipe's `expect` |
| Escape wheel's upper endstone screws WN-es | the shank's end in the slot | 0.032 | `screw()` runs the shank 0.1 into the head, but this head is 0.3 high with a 0.232 slot (KIT headGeo): the shank's end stands up into the slot; in the recipe's `expect` |
| ~~Barrel bridge, fusee bush, dust bush~~ | ~~five sizes at their tolerances' tops~~ | | fixed 29 October 2026, the owner's choice (above) |

## Decided

- **The setups' order.** The recipes' setups are a plausible shop order, not a source's. Should a sheet say "a suggested order" and leave it to the
  maker, or should each sheet set the order firmly (as a works drawing's Arbeitsplan would)?
- **Bought parts.** Jewels, the mainspring and hairspring strip, standard screws: a recipe that makes them, or a line saying what to buy and its size?
- **Phase 3, the page built from the recipes.** It ends two builders drifting apart, but it's the largest step (every part's mesh replaced). Do it, or
  keep the page's builders and the recipes side by side with `recipes.py --check` keeping them in step?
