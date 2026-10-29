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
| 4 | Arbors and pinions | centre, intermediate, seconds and escape pinions with their arbors; fusee arbor; barrel arbor; balance staff | |
| 5 | Wheels with teeth | train wheels, escape wheel, fusee wheel, click wheel, maintaining ratchet, set-up ratchet, motion work's wheels | |
| 6 | Small turned parts | bushes WN-300/301/302, settings and caps, studs, collets, the remaining WN screws; jewels (bought) | |
| 7 | Springs and the detent | the detent and its block, gold spring, clicks and click springs, maintaining spring, stop bar and its spring; mainspring and hairspring strip (bought) | |
| 8 | Balance and rollers | rim, masses, timing screws and weights, hub, impulse and discharge rollers, hairspring collet and stud | |
| 9 | Fusee and barrel | fusee body, cover plate, Vorreiber, dust plate, barrel drum, lid, hook block, Steg | |
| 10 | Motion work, hands, dial | | |
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

## Page faults found (for a later fix on the page)

| Part | Where | Size | What |
|---|---|---|---|
| Top plate 05 09 01 | the pocket N-O's far side | 0.047 | drawn tangent to r 4.95 about 23 (frame.js, so it crosses the opening cleanly); the sheet's r 5. Tried at r 5 on 29 October 2026: the solid opens; needs the opening and pocket cut as separate features |
| Upper balance cock 05 08 03-1 | the stud's slot through the boss | 0.13 | the boss draws the slot's end wall upright, 0.02 inside its place at the boss's face, where the arm's wall leans 8° (C-D's 82°); one milled slot is one plane through arm and boss |
| ~~Barrel bridge, fusee bush, dust bush~~ | ~~five sizes at their tolerances' tops~~ | | fixed 29 October 2026, the owner's choice (above) |

## Decided

- **The setups' order.** The recipes' setups are a plausible shop order, not a source's. Should a sheet say "a suggested order" and leave it to the
  maker, or should each sheet set the order firmly (as a works drawing's Arbeitsplan would)?
- **Bought parts.** Jewels, the mainspring and hairspring strip, standard screws: a recipe that makes them, or a line saying what to buy and its size?
- **Phase 3, the page built from the recipes.** It ends two builders drifting apart, but it's the largest step (every part's mesh replaced). Do it, or
  keep the page's builders and the recipes side by side with `recipes.py --check` keeping them in step?
