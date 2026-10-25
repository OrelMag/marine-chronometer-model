# The Marine Chronometer, working

Interactive 3D model of a two-day fusee marine chronometer with a spring detent
escapement, running in real time inside its gimballed case and mounting box.
Built with three.js r128. There is no bundler and no package manager: the page
is plain HTML, CSS and JavaScript.

## Run

Open `index.html` in a browser. It loads `css/`, `js/`, and three.js and the
fonts from `../../vendor/`, all from local files, so it works offline.

`dist/chronometer-working-model.html` is the same thing as one self-contained
file. `python build.py` here regenerates it. Normally you run `python build.py`
at the repository root instead: it also refreshes the root copy and assembles
the website (see the root README).

## Files

| File | Contents |
|---|---|
| `index.html` | Page markup: the stage with its 3D model / Essay tabs, walkthrough card, controls (View, Time, Winding and Display, open by default, and Parts, Rate and timing weights, Stopping and starting, Cross-section and Variants, closed; every section folds, and each viewer's open ones are remembered in `localStorage` as `cm-open`), the About dialog with sources and method, and the essay (`<article id="essay">`: its text and its figures' markup) |
| `css/style.css` | Layout, theme tokens (light and dark), controls, labels |
| `css/essay.css` | The essay's styles (its page, `../essay/`; this page's Essay tab until 21 October 2026): a reading page in the model's tokens; its classes start `e-` |
| `js/core.js` | Math helpers, materials and procedural textures (plate striping, wood grain, engraving), gear / hairspring / hand / mainspring geometry, dial artwork, cross-section shader patch, the tinted and ink drawings (`drawOf`, `makeInk`) |
| `js/mainspring.js`, `tools/mainspring.py` | The mainspring's shape in its barrel over the wind, `MSHAPE`: the strip's equilibrium from its measured free curve, solved by `tools/mainspring.py` (torch, about 30 min; `--write` from its last solution) and drawn by `mainspringGeo` in `core.js` ("The mainspring, solved" below) |
| `jsconfig.json`, `js/globals.d.ts` | Type checking without npm: the scripts in load order, and the globals TypeScript can't see; `core.js`, `movement.js`, `box.js` and the shared scripts start with `// @ts-check` (`ci.py` runs `tsc`) |
| `../shared/escapement.js` | The detent escapement's solver, `makeEsc(settings)`, shared with the essay's detent figure and `tools/escapement.js`; `makeEsc(settings, base)` solves another chronometer's (its teeth, radius, lock, detent, tooth form, drive), counted from its own reference |
| `../shared/escplan.js` | Its plan, `drawEscPlan(ctx, w, h, state, E, o)`, drawn from the solver's outlines, as Fig. 90 has it: the walkthrough's inset and the adjuster's bench (three names, the stage written under it) and the essay's detent figure (every part named, a dial for the balance's angle); `escStage(state)` names what the escapement is doing |
| `../shared/almanac.js` | A nautical almanac and the navigator's arithmetic, `ALM`: the Sun, Moon and 58 stars, sidereal time, the altitude corrections, sight reduction, the time sight, equal altitudes, clearing a lunar distance, and sights made from the almanac for the essay's worked examples (see "The almanac" below); shared with `tools/almanac.js` |
| `../shared/hairspring.js` | The hairspring's design, `HSPR`: terminal curves solved to Phillips' conditions, the whole spring's path, the force it leaves on the pivots, the strip's section from the stiffness ("The hairspring, designed"); shared with `tools/hairspring.js` |
| `js/makers.js`, `js/maker.js` | The maker's tools ("What the model gives a maker" below): `MAKERS`, each parts-list line's measured fit, material and treatment (written by `tools/makers.py`); `MAKER`, each card's maker's sheet, drawing (SVG) and STL, Measure, the build book, the model's data as JSON, the movement as STL |
| `js/overhaul.js` | The overhaul ("The overhaul" below): `OVH`, the manual's 58 operations to take the movement down (Sec. V) and 105 to put it back (Sec. VIII), each with its tools (Sec. XIII's numbers), figures, oil and the parts it moves by their parts-list lines; the parts moved one operation at a time, as the Exploded view moves them. One IIFE; app.js calls `OVH.bind()` |
| `js/gltf.js`, `js/blender.js` | The export to Blender ("The model in Blender" below): `GLTF`, a binary glTF 2.0 writer (nodes, meshes, materials, textures, morph targets, animations; one IIFE); `BLENDER`, the export itself: its own copy of the model, every motion played through it and read back |
| `blender/rig.py`, `js/rigpy.js` | The rig, run in Blender's Text Editor after the import (Blender 5.x); `js/rigpy.js` is its text for the panel's Blender rig button, written by `tools/rigpy.py` (`--check`: up to date) |
| `js/movement.js` | The movement: layout constants, the escapement (`ESC=makeEsc(...)`, with the centre distance from `L`), screw positions and holes, pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, train-blocking screw and balance locking arm, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate that turns to admit the winding key), winding key |
| `js/report.js` | Report a bug or inaccuracy (under Controls below): the dialog, and a log of the page's last 30 errors and warnings, kept from the first script on. Loaded first; one IIFE that declares only `REPORT` |
| `../essay/js/essay.js` | The essay (see "The essay" below), on its own page since 21 October 2026: its figures, drawn from the Wempe's model, its sections and hash. One IIFE that declares only `ESSAY` |
| `js/app.js` | The parts registry (`PARTS`: every part's name, description, part numbers, group, colour and flags; `PIECES`: the pieces of the parts that are several things), renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, stopping and starting (the balance's amplitude, the locking arm, the train-blocking screw, the twist), and the animation loop |
| `build.py` | Inlines the CSS, JS, three.js and fonts into `dist/` (through `inline.py` at the repository root), with the version and the list of changes from the root `CHANGELOG.md` (`changelog.py`) |
| `dist/chronometer-working-model.html` | The built single file (committed) |
| `tools/bundle.py`, `tools/fit.py`, `tools/unproj.py` | Photo fitting: camera fits to the Fig. 2 and top-view photographs, triangulation of the balance, fusee and barrel axes, photo points projected onto the movement (see "How the layout was measured") |
| `tools/almanac.js`, `tools/almanac-ref.json`, `tools/almanac_ref.py` | The almanac's check (Node, about 1 s): Meeus's worked examples, the Sun, Moon, stars and sidereal time against JPL Horizons and skyfield (`almanac-ref.json`, made by `almanac_ref.py` with the network: SIMBAD's catalogue, Horizons' DE441 places, skyfield 1.55 with de440s), and round trips of every reduction; the essay's stated accuracy (`data-bound` spans) must cover the worst found |
| `tools/physics.js` | Phase A's physics derived (Node, under a second): the energy budget from the mainspring to the balance, the escape wheel's chase onto the impulse jewel (its inertia measured on the solid), the balance's Q the budget needs (which sets `TF`), the detent spring's preload from Op. 78 and its share of the work, temperature from the materials; the essay's `data-phys` figures must be what it finds |
| `tools/makers.py`, `tools/selfcontained.py` | `js/makers.js` from `bom.json` and `BOM.md` (`--check`: up to date); the check that the page alone is enough to make the chronometer and navigate with it (no network, the manual shipped, every card's sheet, the essay's checked figures, the tools in the page) |
| `tools/solve.py` | Reads `L` and `TRAIN` from `movement.js`: solves the escape arbor against `L.E`, gives the modules and wheel tips, checks the arbors clear the wheels in plan (no browser) |
| `tools/p3map.json`, `tools/cock_outline.json`, `tools/engr.json` | Traced from the top-view photograph: its mapping into the model, the balance cock's outline, the engraving columns |
| `tools/dyn.py`, `tools/interference-check.js` | Voxel collision check through a full escapement cycle |
| `tools/views.py` | Before/after renders of every view (frozen, labels hidden), a pixel diff between two runs (`--md` as a table), and close-ups of chosen parts; `--page` renders another copy of the page, as `ci.py --views` does for where a branch left `main` |
| `tools/isolate.py` | Renders chosen parts alone, everything else hidden, each view beside a reference image (a photograph, a video frame, a figure): the check after any change to a part's geometry |
| `tools/maintaining.py` | The maintaining work over run and wind cycles: the sustaining ratchet never turns back, the sustaining spring is loaded in running and only relaxes while winding, the fusee catches forward when the key lets go, the pawls sit on their teeth, the stop-bar meets the winding stop at full wind, and, the fusee swept from full wind to run down, it passes the stop more than the fusee's widest endshake clear (0.1 mm) |
| `tools/fine.py`, `tools/fine-interference.js`, `tools/barrel-clearance.js` | Fine (0.05 mm) collision check through the escapement cycle, round the train and over the wind, against a table of expected contacts; the barrel's margins and the mainspring |
| `tools/audit.py`, `tools/geometry-audit.js`, `tools/geometry-audit-box.js` | Geometry audit of the movement (and, with `audit.py box`, the box and gimbals): overlapping or unsupported screws, loose arbor ends, coplanar faces, isolated parts, among the parts shown, in one frozen state; anything not expected (the loose ends in its `LOOSE` table, the coplanar faces in `tools/audit-expected.json`) fails, `--update` rewrites the coplanar faces (`--eval JS` after loading, e.g. to fit a variant or plant a fault) |
| `tools/exploded.py`, `tools/exploded-check.js` | Exploded-view clearance: every part and screw, taken as it stands assembled, against every other, at every spread from 0 to 100 % (none may meet at full spread, or pass through another on the way), over escapement phases, train positions and the wind |
| `tools/overhaul.py`, `tools/overhaul-check.js` | The overhaul's clearance (about 12 s): every operation of both sequences followed as the page moves its parts, every pair of bodies against each other (exploded.py's columns); none may pass through another, but those in its `EXPECTED` table, each with its reason (a part a real movement takes out sideways or tilted, or a reading still open) |
| `tools/solids.py`, `tools/solids-check.js` | Solid geometry check: every mesh closed (no open edge), consistently wound and not inside out, but the decals and surfaces flagged as such; loaded as it is and with Moving parts only and a section on |
| `tools/placements.py` | Every mesh's position and bounding box in seven model states (escapement phases, train and wind positions), and a diff between two runs or two copies of the page: proves a change moved only the parts it meant to, and that the mechanism moves as before |
| `tools/escapement.js` | Measures the escapement against the manual's adjustment figures (Node.js, no browser) |
| `tools/escgolden.js` | The escapement's fingerprint: every result `makeEsc` gives the Hamilton hashed bit for bit against `tools/escgolden.json` (Node.js, no browser) |
| `tools/keystone.js` | Measures the escapement against a period text's rules for the chronometer escapement (*Watch and Clock Escapements*, 1904); reports, never fails (Node.js, no browser) |
| `tools/invariants.py` | Checks the model's arithmetic: hands against the time, the wind indicator's scale, the fusee's 56¼ h and 17½ half turns, the balance's moment of inertia and the rate for a turn of the weights (exit code 1 on a failure) |
| `tools/smoke.py` | Loads the model and clicks through every control (views, walkthrough, the overhaul, variants, sections, time zone, keys, a URL-hash link), then opens the essay's own page (`../essay/`), scrolls it and works every control in it (the model not drawn under it, at most two WebGL contexts, a link into the model and Back, `#essay=detent`); fails on any console error or warning (`--model`, `--essay`: one half) |
| `tools/p3fit.py` | Renders the model from the top-view photograph's camera |
| `tools/gltf_check.py`, `tools/blender_check.py` | The export to Blender checked: the page's own export written to `r_model21.glb` and read back (structure, accessors, the tree, names, every clip), then that file imported into Blender headless (`MC_BLENDER`, else the usual install; skipped without one), the rig run and set against the export's own clips, and two renders (`r_blender_*.png`) |
| `verification/lower-bridge-comparison.png` | The balance lower bridge against its sources: the restoration video's face-on frame (13:49.5) beside the model seen from the same camera (`tools/framecam.py`), the model's outline drawn on the frame, the measured and model plans (`tools/lower_bridge.py`), the two levels side-on (36:45), Figs. 110, 29 and 30, and the model from below, in place and from above |
| `tools/lower_bridge.py` | Lays out the balance lower bridge after the restoration video's (13:49.5, measured with `tools/framecam.py`; formerly 36:01, measured through a camera fitted to the train bridge's rim; Figs. 29, 30, 110) round the model's arbors and what it must clear, reports the clearances, prints `LB_UP`, `LB_WALL` and `LB_LO` for `movement.js` and draws the plan beside the video's outline (no browser) |
| `tools/rimfit.py`, `tools/rimfit_36-01.json` | A plate or bridge lying on the blue mat in a video frame, put in millimetres through a perspective camera fitted to its rim (and to round settings traced on it, made to come out circular): picked points at their heights above the face, turned onto the model by named arbors (no browser). The specs: the restoration video's upturned train bridge with the balance lower bridge (36:01), the dial side (40:08) and the bare plate from the train side (34:30, its rim traced beforehand: `rim_pts`) |
| `tools/framecam.py`, `tools/anchors/lower_bridge_13-49.5.json`, `photo_lower_bridge.json`, `photo_lower_bridge_cam.json` | A video frame's (or a photograph's) camera recovered from the homography `video.py anchor` fitted on it (the focal length where the face's axes come out orthonormal): picks put back on planes at their heights off the anchored face, the `--look` for `isolate.py` that sees the model from that camera, and a render warped onto the frame beside it (no browser for the picks). The specs: the balance lower bridge on the train bridge's underside at 13:49.5, and on a phone photograph (`References/photo-lower-bridge-underside.jpg`, f about 970) |
| `tools/train_bridge.py` | Builds the upper train bridge's notch, horn and mouth from their edges measured on two frames of a restoration video (`tools/anchors/`), prints `TB_NOTCH` and `TB_EDGE` for `movement.js` and the metal left round each hole; with the frames, draws the outline back on them (no browser) |
| `tools/video.py` | Teeth and parts from videos of real Model 21s (`References/README.md`, "Videos consulted"): fetches a video (yt-dlp) and takes contact sheets and frames from it, into a folder outside the repository; counts a wheel's teeth one by one on a frame, unrolling its rim along a fitted ellipse, and writes strips for checking the count by eye (no browser) |
| `tools/topview.py` | Renders the model from above and warps it onto `References/photo-top-view.jpg` through five screws on the barrel bridge: `verification/topview-comparison.png` (photo, model, the two blended); `--hide PARTS` or `--eval JS` (a variant fitted: `"__mv.userData.stop('navy')"`) write `r_topview.png` instead |
| `tools/social.py` | Renders the 1200 × 630 link-preview images into `site-assets/`, the model on a dark background beside a title column: `social.png` (the page's preview: the dial in its box, hands at 10:10) and `social-movement.png` (the moving parts, titled for the essay, for posting) |
| `verification/` | Reference results: the top-view comparison, the Fig. 2 overlay and its camera fit |

## Controls

Speed: the presets, or any value from 0.01× to 10,000× on the Custom slider or typed in; the space bar stops and restarts. Up to 5× (`REAL_X` in `app.js`) the balance is drawn swinging as it really does; faster, a real swing would be a blur, so it is drawn swinging at 0.9 Hz with the detent and trip spring still, and the HUD adds "balance swing shown slowed". At every speed the train goes by the balance's real phase, so the escape wheel steps a tooth a beat, stops and starts on whole beats, and a change of speed moves nothing. While winding, model time runs at most 10× (`WIND_X`), so a wind takes at most about 3 minutes of it, inside the 5 to 10 minutes the sustaining spring drives the train (Sec. IV); the HUD says so. Right-click a part to fade, hide or isolate it (Isolate shows that part alone, box and floor shadow gone; picking a part from the parts list, or ticking its box, adds it to the isolated ones); right-click empty space to bring hidden parts back or leave isolation. On touch screens a long press (half a second, barely moving) does the same; Android's own long-press `contextmenu` and the page's timer open the menu once between them, and the press never picks.

- The **?** button on the model (or the **?** key) opens a card listing every control, for a mouse and for touch, with this device's first; the header and the hint word the gestures for the device too (`.m-only` / `.t-only`, switched by `@media (hover:none)`). A tap in the model, × or Esc closes it; dragging doesn't, so the gestures can be tried with it open.
- Keys 1–9 pick the views, in the order of their buttons. Exploded has a Spread slider and a Take apart switch (25 October 2026; `exp=all` in the link): Movement, the movement alone as before, or All, the box and case taken apart too under it, up the bowl's axis (`box.js`'s `explode(e)`: the gimbal ring with its pivot screws, the case, its shield plate, the bezel and the crystal; the latch and the key out to the right, the lids back off their hinges), the camera stood back to see it all. Its offsets are a view's layout, not measurements; Spread sets both.
- **Overhaul** (the card under the walkthrough's): **Take it down** and **Put it back** step through the manual's operations ("The overhaul" below); Back and Next move one operation's parts, the slider goes straight to any operation, Play goes on by itself, End overhaul gives back the view, speed and balance stop it found. The model stands still meanwhile.
- Double-click a part (double-tap on touch) to zoom to it: the camera closes in to fit the part's shown meshes (centring without backing away when the part is larger than the view) and then turns about it, following it as the movement lifts or spreads (`focusPart` in `app.js`); double-click empty space, 0 or Reset for the whole view again. A second click within 0.4 s and 24 px of the first makes the double, on any pointer (`lastTap`).
- Back and Forward (↶ ↷ under the tabs, Backspace and Shift-Backspace): the places the view has been, up to 30. Each jump made with a view button or key, Reset or 0, a double-click, a panel's Show button or winding keeps the place it left (`jump(f)`), unless it didn't move the camera; the walkthrough keeps its own steps, and links and the opening view aren't kept. The buttons show once there is somewhere to go back to.
- The panel's width (wider than 960 px): drag the line in the gap between the model and the panel, or the arrow keys on it (Home and End for the narrowest and widest); double-click it for 350 px. 320 to 640 px, leaving the model at least 600 px; on a wide screen the page grows with the panel, so the model keeps its width. Remembered in `cm-set` (`pw`) with Remember settings.
- Hide panel: the tab on the stage's right edge (or the **P** key) hides the panel and gives the stage its width, remembered in `cm-set` (`nopanel`) with Remember settings; the walkthrough and a link opening a panel section (`open=`) bring it back. It is offered only where the panel sits beside the stage (wider than 960 px, or a landscape phone) and not in full screen; with the panel below the stage (portrait) the tab is hidden and the class does nothing.
- Fusee (`#view=fusee`) looks across the line from the barrel to the fusee, plates see-through, so the chain runs from one to the other. Balance (`#view=balance`) is the balance close up under its cock, with the timing weights; Rate and timing weights' Show the balance goes there too.
- Laid out in a line (`#view=laidout`) is the textbooks' developed drawing of the train: the arbors set in one
  line and seen square from the side, hands below. The barrel and fusee stay where they are, and the line runs
  on from the barrel through the fusee; the centre, third, fourth and escape arbors follow, each at its real
  centre distance from the one before, so every pair still meshes. The escape wheel, detent and balance turn
  together about the escape arbor, so the escapement is unchanged and the balance ends the line.
  - Each driven pinion is turned by the change in its line of centres times (1 + driver teeth / pinion teeth), so its leaves stay in the driver's gaps.
  - The real plates and bridges are hidden, since their holes no longer meet the arbors, and so are the box and case.
  - See-through schematic plates stand in for them: pillar plate, train bridge, barrel bridge, a cock over the balance, and pillars. They are drawn only in this view and go with Moving parts only; they carry no part name (not listed as parts, sectioned, checked or exported as the movement's), but each stands in for its part (`userData.devOf`, 25 October 2026): a click on one opens that part's card and shows it solid. Where a part shows through a stand-in the click goes to the part; where stand-ins overlap, to the smallest. Until then they took the case's part name (`bowl`, the group the movement hangs in), so a click on one would have opened the case's card had it not passed through.
  - Kept shown, though its part is hidden (`userData.devKeep`): the winding stop (42099) in the barrel bridge's underside, which the fusee's stop-bar meets at full wind (the export's laid-out state keeps it too). With it the view holds every element a textbook's developed drawing letters ("Modern chronometer movement", Figs. 83 elevation and 84 plan). Its top plate (A′) is the Model 21's two bridges, the upper train bridge and the barrel bridge; its B′, the stud carrying the stop work, has no counterpart (the stop-bar slides in a slot across the fusee's top); its S′, the snail the stopping arm meets, is the winding stop (the stop work turned round); its s, the arm's spring, is the stop-bar's spring (42025), in the recess round the hub under the fusee's top plate and out of sight from any side. `tools/laidout.py` checks each is shown and opens its own card when clicked (`--model wempe` the Wempe's) and draws both views on one sheet with the drawing's letters and a key (`r_laidout_sheet.png`).
  - The camera's field of view narrows from 32° to 20° so the elevation looks nearly flat.
  - The Spread slider sets how far the train is laid out (`mv.userData.develop(e)` in `movement.js`, 0 as built, 1 laid out).
- Time: set the hands to any time of day, or to now. The model keeps Greenwich Mean Time by default, as U.S. Navy chronometers were kept (the HUD says GMT); Keep: Local time switches to the viewer's time zone, moving the hands by the difference. The HUD shows the time the hands show and, once it is a quarter second or more, the dial error against the master time (below): `+` fast, `−` slow, to the half second as a navigator records it. Now sets the master time to the viewer's clock and the hands to it; Set the hands moves the hands only, so it makes a dial error. Neither turns the train: the hour and minute hands go round by the cannon pinion's slip, as the key turns them, and the second hand, which is on the train, is put right as Stop to set does it (the locking arm stops the balance, then a twist starts it as the time comes round to the hands), so the dial is never more than a minute fast while it waits (`setHands` in `app.js`; until 11 October 2026 they moved the model's clock and the whole train, backward as often as forward). A time in the page's address is set directly as it loads. Local time moves the master and the hands by the zone's difference through the slip alone. Tick sound is under Time too.
- Setting, With the key: sets the hour and minute hands as the manual does while the chronometer runs (Sec. III, "Setting While Running"). The gimbals are latched, the bezel and crystal come off, and the winding key goes on the hand-setting square, turned by its shank, forward only: the minute hand goes on its marker half a minute behind the master, and to the next marker as the master's second hand passes 60. The second hand is never touched, so the dial can still be up to 30 s out, as the manual says; the Time section reports it. A dial that is fast has its hands turned nearly round the dial. The hands turn on the centre arbor as the cannon pinion slips (`slip`, passed to `update()`), which leaves the train and the second hand alone. How fast the key turns is illustrative. Another view, or the walkthrough, ends the setting.
- Adjuster's bench (its own section): the escapement's six settings on sliders (trip-spring tip `rT`, discharge-jewel reach `rd`, depth of lock `dL`, locking-jewel draw `DRAW`, and the discharge and impulse jewels' angles `aD`, `aI`). Each change rebuilds `ESC` with `makeEsc` and takes it over in place (`Object.assign`, so everything reading `ESC` follows), rebuilds the detent pieces, trip spring screw, roller and jewels (`mv.userData.escSet()`), and measures lock, let-off, overall, drop, roller shake, the teeth's dip, horn clearance and the jewels' angle against the manual (`ESC.checks()`, as `tools/escapement.js`), with the plan view live beside them. The model runs with the settings: they set the balance's running amplitude `ESC.A` (which the balance eases to) and the escapement's rate `ESC.run.rate`, s a day against the model's settings, which multiplies into the model's rate as `escK` ("The escapement's amplitude and rate", below); the Rate panel says how much of the rate is the escapement's, and the rate book notes "escapement adjusted". A setting at which the escapement would not run (`ESC.measure().runs`), or at which the balance would swing too little to keep it going (`ESC.A` under `ESC.AMIN`), is refused, with the reason, and the last working one kept. The least amplitude that runs (`ESC.AMIN`) follows the settings: past it the train stops, and a twist starts it again. The hash carries the changed settings (`esc=rT:0.29,aI:185`). The model's settings are one button away; the geometry checks (`fine.py` and the rest) cover only those.
- Rate book (its own section): the navigator's record of Sec. IX, Table I. The dial is compared with the master at noon each day, master time, and on Compare now; the error is read to the nearest half second, as the hands step. The daily rate is the change in error per day, taken against the latest comparison at least half a day back with no break (started, stopped, set, not wound) since, since over a shorter time the half-second reading swamps it. Below the table, the mean daily rate and mean deviation over the last ten rates since a break, and live for the current dial error, what it does to a position: 4 s of time is 1′ of longitude, that many nautical miles times cos(latitude) (Latitude input), uncorrected and after the navigator's correction with the last error and the mean rate. The remarks are recorded automatically. The rate is steady in the model (only the weights, screws and escapement's settings change it), so the mean deviation shows the reading's half-second steps.
- Setting, Stop to set: the manual's other way (Sec. III, "Setting When Stopped"), to the second. The button is the next step: Stop to set locks the balance with the locking arm (the manual stops the balance by hand, the movement out of its case), Unlock arm takes the arm off with the balance at rest, and Twist to start gives the twist. Meanwhile the Time section counts down: to the moment the master overtakes a fast dial, or to when the second hands agree on a slow one, after which the minutes are set forward with the key. The wheel stands locked, so the second hand is on a half second, and what is left after the start is the moment of the twist (and the fraction of a second the balance takes to pick up).
- Winding: Since winding and Wind, and Wind with the key, which turns the fusee half a turn at a time, 17½ half turns from run down (the fusee's 8¾ turns, 56¼ h of chain), with the plates see-through and the winding stop kept solid. For the last turn the camera closes in on the fusee's top: the chain winds over the stop-bar's nose, and the bar's far end comes round to the winding stop.
  Three options under it act whenever the model winds (the key, Wind, or the walkthrough's Wind it now). **Load path in colour** (on) tints the parts carrying the train's load (`lpCol`, `tintOf` in `app.js`, from the `lp` tags `movement.js` sets): while winding the sustaining spring, which drives (rose), and the sustaining ratchet and pawl, which hold (teal); for 2 s after the key lets go, the mainspring's whole path in rose (barrel, chain, fusee, winding ratchet and pawls, sustaining ratchet, spring, fusee wheel). **Close-up of the sustaining spring** (on) draws the fusee wheel's maintaining work again in a box at the stage's lower left (`cuDraw`): the same renderer and canvas (a scissored viewport, layer 1 for its parts and the lights, so the page keeps to two WebGL contexts), seen from the train bridge's side in the movement's own frame, the sustaining ratchet drawn at 45% so the spring under it shows; under it, the spring's drive left, 10 min less `R.ssD` of `R.SMAX`. **Exaggerate the spring's motion** (off) draws the spring relaxing 20 times as far (`ssX` in `update()`, up to `SMAX`) and eases it back over 0.4 s at the catch; the working end's pin moves round the ratchet with it, while the ratchet, the pawls and the time left stay the real ones. At 1× a wind from run down takes about 17 s of model time, about 3% of the spring's travel, too little to see without it. The close-up has its own tools in a row under its title (`cuBind`): the mouse wheel, a pinch or + and − zoom about the pointer (to 16×), a drag moves the view, a double-click resets it; ⤢ enlarges the box (to 600 × 470 px); the speed button gives slow motion, ¼×, ⅒× and 1/25×, which acts only while the close-up shows and slows the key, the model's time, the 2 s after the key lets go and the spring's easing together (`mClk`, the clock `kwStep` and the load path's phase run on; the HUD says Slow motion); ⊙ keeps it open after the key lets go, as **Open the close-up** under Winding does, to watch the spring under load in running (tinted as the mainspring's path, its gauge then how hard the spring pushes); and ? opens **How the sustaining spring takes the load** beside it (`cuHelpBuild`, `cuHelpSet`): the band, its two pins and why the whole drive passes through it, then running, winding and the key let go, the phase under way opened and picked out with its figures of the moment (the fusee's drive and the spring's push as shares of the 12-hour drive, the spring's gap from `R.SSG`, the swing, the drive left, and what letting go now would cost, from `R.release()`), its links zooming the close-up onto the spring's working end and gap, the sustaining pawl or a winding pawl and following it. Under `?qa`, `__lp()` gives the phase (`ph` 'w' winding, 'r' the 2 s after, '' otherwise; `now`, its clock `mClk`) and whether the close-up shows, and `__cu()` the close-up's zoom, pan, part followed, enlarged, kept open, explanation and slow motion.
- Rate and timing weights: turn the timing or vernier weight pair in or out by eighth turns, up to 3 turns either way from mid-travel. `R.timing(nt, nv)` in `movement.js` moves them and returns the balance's moment of inertia, computed from the balance's geometry and the parts list's masses (1,140 g·mm², Table II's). The weights' thread pitch (`R.pitch`) is set so that a full turn gives the manual's figures (p. 70): about 40 s a day for the timing pair and 2.8 s for the vernier pair, which makes the pitches 0.178 and 0.142 mm. Below them, a screw pair stands in a hole (3–12, numbered round each half from the arm's end as the numbered balance block of Fig. 99 numbers them) and takes any of Table II's five head heights (0.040–0.100 in) and the washers of Table III (0.002–0.010 in) under its heads, as Op. 3 changes them; it can be moved to another empty hole (Op. 8), taken out, or another pair put in (up to all ten holes): `R.screws(pairs)` sets them and `R.timing` counts their masses. The panel puts the manual's figure for the change (Tables II and III, for pairs) beside the model's, and for a pair moved along the rim Table IV's change in the rate at 90 °F against 55 °F (`R.T4`); a temperature slider (40–100 °F) runs the clock with that change, linear about 72.5 °F, the standard set taken as compensated, and the balance's own curvature on top (`MTE` in `core.js`: the Model 21's from the factory test card of No. 3390, the split balance's illustrative); a chart below it plots the rate from 40 to 100 °F for the balance shown, the other dashed, and gives the Navy test's three temperature compensation figures against their limits. With the split balance shown, its rim curls with the temperature, drawn 20 times as far (`R.balCurl`). Zero puts back the weights' mid-travel, the standard screws and 72.5 °F. The panel's state is kept in the link (`bal=`, as `esc=` keeps the bench's). The model clock `tSim` then runs `rateW`·`escK` as fast as real time (`rateW`: √(I₀/I) and the temperature; `escK`, the escapement's share at the balance's swing now and the drive's torque, `ESC.rateAt`: 1 at the model's settings and 255°), so the hands gain or lose; the panel shows the daily rate, the escapement's share of it when there is one, and what the hands have gained since the weights, screws or escapement were changed or the hands set.
- Mainspring, Let down and set up (under Winding): the manual's let-down and set-up, on the wall clock (`ldStart` in `app.js`, about 25 s). From run down, the let-down key on the barrel arbor's square: the set-up click held out of its ratchet (Op. 8), the arbor let back slowly by the set-up's 1.26 turns (`R.fs.MS.setup`; the manual's "wind barrel about one turn", Op. 53) until the spring is slack, its inner end going round with the arbor's hook while the barrel holds its outer end; then the click let go and the arbor turned forward again, the click riding up each tooth's back and dropping in (`seatPawl` on the ratchet's profile), 53 teeth. `update()` takes `ld` (turns let down) and `clk` (the click held out, 0 to 1); the set-up cover is faded meanwhile and the barrel drawn see-through round the spring. The chronometer is left run down. The let-down key itself (Tool No. 18) isn't drawn.
- Stopping and starting (and Twist to start under Winding): the balance locking arm (Fig. 9) and the train-blocking screw (Sec. II), and the twist that starts a stopped chronometer. See "Stopping and starting" under How the timing works. Jolt the box knocks it about the balance staff: depending on where the balance is in its swing it sets (stops), trips (the hands jump half a second) or is upset and settles (illustrative; "The balance's dynamics").
- 30-day performance test: the Navy's test (Sec. IX) run on the model as it stands: six periods of five days at 90, 72½, 55, 55, 72½ and 90 °F, wound at each daily reading, read to 0.01 s; the daily rates per period, and regulation, rating, largest difference, the three temperature compensation figures, recovery and isochronism against the Bureau of Ships' limits, beside the factory card of No. 3390. It is computed again whenever a setting changes (`testCalc` in `app.js`; `__test` with `?qa`).
- Swing and isochronism: a Mainspring set slider (0–30%, Op. 13, kept in the link as `mset=`) weakens the spring's pull all through its run; and a chart of the balance's swing over the last minute, the rate against the swing at a steady torque, or the swing over a wind with the fusee and, ticked, a going barrel; the swing and the escapement's rate now, the rate's spread over a wind and the manual's isochronism check (Sec. IX). See "The balance's dynamics".
- Parts: every named part by group, to single out (as a tap does) or hide. A part that is several things (the balance, the fusee, the barrel, the detent, the cock, the setup ratchet, the plates and bridges with their jewels and screws, the motion work, the hands…) lists its pieces under it, folded until it or one of them is picked. A tap on the model picks the piece: its card says what it is part of, with a link up, and the part's card lists its pieces. A piece hides, fades and isolates on its own (the right-click menu, or its box), its part's box half ticked meanwhile; with a part or piece picked, the ghosted rest still takes a tap. Display adds a slow turn and an Auto/Light/Dark theme, and Reset display puts every Display box back to its default (See-through to the view's own) and shows faded and hidden parts again, leaving the theme. Save writes the view as a PNG; Link copies the page's address with the state in its hash (without clipboard access it is put in the address bar instead).
- Ship motion (Display) is drawn with the apparent vertical up (18 October 2026), as a plumb line hung beside the box would show down (`gimStep`'s `ap`, `ar`): the case, hanging along it in its gimbals, stays put, and the box rolls and pitches round it (about 20° each way at the 7 s roll: the ship's 14° and the apparent vertical's 5.4° the other way); latched, the case goes with the box. The export's At sea clip is drawn the same way. Until 16 October the box rolled in the true vertical's frame and the case leaned in it toward the apparent vertical, so both seemed to move; then until 18 October the camera rode with the ship, the box standing still and the movement swinging in it. The jolt and the twist that starts it move the box, being done by hand.
- Roll period (Display, under Ship motion): how long the ship takes to roll, 0.4–12 s (7 s by default). The case hangs in the gimbals as a pendulum with its own period of about 0.7 s (estimated), so at a ship's period it hangs along the apparent vertical (leaning a few degrees against the roll at its ends, the ship's axes being 5 m below, estimated) and near its own it swings with the box ("The balance's dynamics").
- Gimbals latched (Display) swings the latch lever in through the slot in the gimbal ring to the keeper on the case, bringing ring and case level with the box first; latched, they go with the box and stand still with it, as Ship motion then shows. Unticked, the lever swings back along the wall and the gimbals are free. A walkthrough step with ship motion releases them.
- Tick sound (Time) is on by default: a click at each beat, while the model runs at up to 1×. Browsers start audio only from a user gesture, so the page makes or resumes its audio context on the first click, tap or key press, and it is silent until then.
- Tinted drawing and Ink drawing (Display; `draw=1` and `draw=ink` in the hash; one at a time) draw the live model as a pen-and-wash drawing, tinted or in ink alone; the tint is laid light (pigment density `INK.wash` 0.75), so the live model reads through it. (The numbers were first those of an overview drawing rendered from the model, the Illustration tab, which the Essay tab replaced.)
  - `drawOf(m)` in `core.js` gives each shown material a Phong copy whose output is the tint. It is the albedo lifted toward the paper, the lit value in soft bands, white where metal catches the light. `look()` applies it to whatever a part shows, so it combines with Colour by part, fading and sections. In ink (`INK.ink`) the copy is paper, inked only where its albedo falls under 55 % of the material's median (`inkRef`: the colour times a 48 × 48 sample of the map), which is the printing: the dial's figures. The engravings (`userData.inkDecal`) are ink under their own alpha; a faded part is paper at its opacity.
  - `makeInk(r)` draws the frame. Three scene passes: normals, part ids and 24-bit depth for the solids, then the same for the ghosts, then the tint (with the shadows when Shadows is on). Two full-screen passes follow: the lines, then the sheet. The sheet lays the tint on paper, true to the lines, and inks with a varying pressure.
  - The tint was once a pen-and-wash wash, laid up to 1.4 px off the lines by a noise field, mottled, pooled at edges, with hatching in deep shade. The offset read as the parts being distorted, so both drawings now keep to the lines and none of these effects is left.
  - Lines fall where depth jumps (0.6 mm + 1.2 % of the distance) or the drawing ends, with lighter ones at creases and between parts.
  - Parts under half opaque (see-through plates, the glass, faded parts) are ghosts, drawn in outline only and lighter.
  - The stage is paper in either theme, the floor shadow is left out, and the plates' damascening is muted.
  - A moving model costs three scene renders a frame instead of one. The shadow map, with Shadows on, is still drawn once. With the option off, nothing is drawn differently.
  - Known limits:
    - Cost: frames with nothing moving are still skipped, as in the normal rendering. It was measured only in headless Chromium's software renderer (SwiftShader), not on a phone's GPU. The tint's render target is sized when a drawing is turned on and dropped when it is turned off (the others serve Edges too); the pen-pressure noise texture is made the first time it draws.
    - The plates' damascening is kept at 30 % in the tint (`uTex` in `drawOf`). At full strength it read as hatching. The shade is taken before that mix, so a darker stripe never changes a band.
    - The lines are found in screen space, one or two device pixels apart depending on the pixel ratio. Very thin parts far away (screws, pins in the Box view) can be only a line or two wide.
- Edges (Display; on by default, phones included; `edges=0` in the hash when it is off) outlines the movement's parts over the normal rendering, so that parts of one finish lying on each other stay apart: the steel winding pawls on the steel sustaining ratchet, for one. It is the drawings' line pass (`makeInk(r).lines()` in `core.js`) laid over the ordinary frame instead of the wash.
  - The thresholds are the drawings': depth jumps, creases, and ghosts in lighter lines. Two things differ. The ids are per mesh, not per part, because a pawl is the same part as the wheel it lies on and less than the depth threshold above it. And the box, case, gimbals and glass (id 0) draw no lines, including where they meet the movement or stand in front of it. The engravings and the floor shadow are left out of the id passes, so an engraving doesn't outline itself on its plate.
  - Cost: the two id passes plus the normal render, three scene renders for a moving frame, as with the drawings; the id passes' shader is trivial. Measured with `tools/perf.py` (1440 × 900, Shadows off): on a desktop GPU a frame takes 0.7–2 ms longer (Dial 1.5 → 2.5 ms, Movement 1.9 → 2.6 ms), mostly the JavaScript of the extra draw calls (470 → 940 in the Dial view); with the CPU throttled 4× (about a phone's) the Dial view went from 6.9 to 12.2 ms. It stays on for phones, where Shadows being off pays for it.
  - Memory: `makeInk`'s render targets are the drawing's size only while in use, else 1 px. Edges keeps the normals and ids (4 bytes a pixel, plus 4 of depth) and the lines (4): 12 bytes a pixel, about 23 MB for a 1600 × 1200 drawing. See-through parts add the ghosts' 8, and a drawing the tint's 8 (dropped again when it goes off).
  - With the option off, nothing is drawn differently.
  - The drawings ink their own lines. While one is on, Edges is greyed out and kept, and it comes back when the drawing goes off.
- Remember settings (Display, off by default; `cm-remember`): only with it on does this browser keep anything (`localStorage`, each in a `try`): the theme (`cm-theme`), the open panel sections (`cm-open`), in `cm-set` the plate finish, dial style, balance, the last view, the cards' units, whether the panel is hidden and its width, and in `cm-state` the hash's settings without what belongs to a moment (`tour`, `part`, `t`, `open`, `arm`, `block`), written with the hash. A page opened without a hash takes `cm-state` as its hash; the remembered view opens the page when its link names no view or walkthrough step. Off, nothing is stored, and the keys are removed when it is turned off and at every load without it, so each visit opens as new.
- Parts: a search box above the list finds parts and pieces by name, Hamilton part number (`42087` finds the detent, `42263` the impulse roller, shown under its part) or words in the source note, every word; `fig 90` finds the parts the manual's Fig. 90 shows (from `figs`, ranges included). Sizes in: mm or inches, the manual's unit, for the sizes on the part cards (remembered in `cm-set`).
- Colour by source (Display) colours each part by where its shape and size mainly come from (`src` in `PARTS`, `SRC`): the manual (green: its figures, parts list or specifications), measured (blue: on photographs, or a real part), solved (amber: placed or sized to fit the rest) or estimated (grey: the manual shows it, not its size or shape). A key under the tabs names the colours; the part's card says what came from where (a piece's card gives its part's, said so, unless the piece has its own). It and Colour by part exclude each other; `colr=part` or `colr=src` in the hash.
- Labels are off by default (Display turns them on, and the choice isn't remembered). The walkthrough shows the labels of each step's parts regardless.
- The walkthrough sets its own view, speed, Moving parts only, ship motion and gimbal latch for each step. Ending it (Finish, Exit, or anything that leaves it) gives back the viewer's own: the view, See-through, Ship motion, Gimbals latched, the speed, Moving parts only and the motion work, as they were when it started.
- Shadows (Display; off by default; `shadows=1` in the hash when on): the key light casts shadows through a shadow map (`PCFSoftShadowMap`, 2048 px, 1024 on phones). With it off, the light casts none: no shadow pass, simpler shaders to compile (two programs fewer at start), and the map is freed. The floor's soft shadow under the box is a texture (`shadowTex`) and is always drawn. The tinted and ink drawings follow the switch. Cost with it on, measured with `tools/perf.py`: about 230–380 more draw calls and every caster's triangles again; 0.4–1.1 ms a frame on a desktop GPU, 22 % (Edges on) to 47 % (Edges off) on the Dial view with the CPU throttled 4×, 14–22 % in the software renderer. `social.py`, `topview.py` and `p3fit.py` turn it on, as their images were made.
- Performance mode (Display; on by default; `merge=0` in the hash when off): the parts that don't move against each other are drawn merged, about 40% fewer draw calls with the same picture ("Static pieces drawn merged", under Modifying the model). Off, every piece draws itself, as before the merge: the way out if a display mode ever shows something wrong with it on. Reset display turns it back on.
- **Contacts** (its own section; `contacts=1` or `contacts=sweep` in the link, `ceps=` the band, `ctin=1`; 18 October 2026, the Wempe's view from `../shared/contacts.js`, which `app.js` binds as the Wempe's viewer does): a debug view of where the parts touch (within 0.006 mm), come close (a gap up to the band, 0.03 mm unless chosen) or pass into each other, found on the built solids as `fine.py` finds overlaps but along all three axes and with the gap too (the barrel's wall tested as the drum it encloses, as `fine.py` tests it); an overlap `fine.py`'s `EXPECTED` lists is expected (its reason in the list; `js/contactdata.js`, written from `fine.py` by `tools/contacts.py --write`), any other not. Drawn on both solids in each one's frame over every part (and the box) as a faint ghost, plainly (no merged copies, Edges or ink); a scan holds the explode and the laid-out train at 0, so Exploded and Laid out carry the assembled contacts out with their parts. This moment stops the clock and scans the model as it stands (under 2 s), again where something moved once it stands still; Over a beat and the wind poses it in `fine.py`'s 42 states through its update. A part picked shows its contacts alone and lists its pairs, with its own pieces' (Inside the picked part too); a part hidden, faded away, isolated out, hidden by Moving parts only or taken off by the overhaul takes its contacts with it on both sides (`userData.ctOff`, set in `look()`). `tools/contacts.py` renders and lists it; `smoke.py` works it. What it showed first (18 October 2026, the sweep in 35 s): 64 pairs, no overlap `fine.py` doesn't expect; the trip spring on the unlocking jewel in 1 of the 42 states and the escape wheel at the impulse jewel (0.014 mm) in 3; the locked tooth never within 0.03 mm of the locking stone (the lock drawn with more room), so the lock shows only with a wider band.
- Screen readers: the model's `aria-label` says what the stage shows, the view (`VIEW_DESC` in `app.js`) or the walkthrough step, and Moving parts only, and is updated with it.
- Keyboard and reduced motion: Space stops and restarts, 1 to 9 pick the views (the key for a view that is off, Box or Dial with Moving parts only, flashes its button and says why in the HUD); with the model focused (click it or Tab to it) the arrow keys turn the view, + and − zoom and 0 resets it. With reduced motion set in the system, camera and state moves are instant (as with `?snap`), the walkthrough leaves ship motion off and scrolls without animation, and the page's fades are off.
- Report a bug or inaccuracy (`js/report.js`): the panel's button under About, a link on every part's card (about that part, as an inaccuracy), one in About's byline and one at the essay's end (about the section being read). The dialog asks what kind (broken, inaccurate, something else), where, what's wrong and, for an inaccuracy, what shows it (a photograph, a video's time, the manual's page or figure). Ticked by default, technical details go with it: the version, the page's address (the model's state is its hash; a local copy gives the file's name, never its folders), the tab, the balance's swing, whether the train is held or winding, the hours since winding, the speed, the frames drawn, the browser, screen and pointer, the WebGL renderer, and the page's last 30 errors and warnings (`console.error`, `console.warn`, uncaught errors and rejections, failed loads, the WebGL context lost or restored, each at its second since load, URLs cut to their file). Nothing is sent from the page (no `fetch`: `tools/selfcontained.py`): "Write it in my email" is a `mailto:` link to the author with the report filled in, "In Gmail" Gmail's compose page, and "Copy it" the clipboard (or, without one, the report selected under "What will be sent", which shows every word that goes). A `mailto:` longer than 1,900 characters, which some mail programs cut short, is shortened from its end, the log first, and the whole report put on the clipboard as it opens. `smoke.py` reads the links it writes without following them.
- Phones: below 600 px wide the part card is a sheet along the bottom of the stage; on touch screens buttons and checkboxes are finger-sized; in landscape with the height under 560 px the stage fills the height and the panel scrolls beside it. On a phone (coarse pointer, screen under 600 px on its short side) the pixel ratio is capped at 1.5 and the shadow map at 1024 px, against 2 and 2048 px elsewhere. A part casts a shadow only when its radius spans 6 texels of the shadow map, which follows the view: far views drop the screws and pins, close-ups keep them. The knurled nuts and the balance rim's holes are each one merged mesh (`mergeGeo` in `core.js`).

## The essay

*The Marine Chronometer*, an essay on how the chronometer keeps time at sea, in the manner of Bartosz Ciechanowski's *Mechanical Watch*, was this
page's second tab until 21 October 2026. It is now shared by both models and has a page of its own, `../essay/` (`/essay/` on the site), and its 3D
figures and dial are the Wempe Einheits-Chronometer's (the owner's choice, 21 October 2026). It replaced, before that, a separate essay page
(`marine-chronometer.html`, which predated the manual and had drifted from the model) and the Illustration tab, an overview drawing.

- **Where it is.** Its text and figure markup are `../essay/index.html` (the `<article id="essay">`), its styles this folder's `css/essay.css` (classes
  `e-…`), its code `../essay/js/essay.js`. The page loads the Wempe's model's scripts (`../wempe/js/`, `../shared/kit.js`, this folder's `core.js`) and
  builds the Wempe's movement once after its first frame; the Hamilton's `movement.js` can't load beside them (both declare `ESC`). This page's Essay
  tab is a link to it (`?edges=0` added when Edges are off here), and `#essay` or `#essay=detent` here goes there (`../essay/index.html#detent`).
- **Sections** (each heading's id is its link: `#detent`; the old `#essay=detent` works too): time is a position, an oscillator that ignores the sea, the
  spring that breathes, heat, constant force, winding, counting, the detent, level on a moving ship, keeping the rate, Greenwich time from the sky (equal
  altitudes ashore), longitude by chronometer (the time sight), the lunar distance, an almanac to print (with the hand rules and the workbook), what the
  model gives a maker (the Hamilton's, with the manual's tolerances), oil and where it goes, adjusting the escapement, the order of work, materials,
  hardening and tools, and the Hamilton Model 21.
- **Figures, and what each takes from the Wempe's model** (the movement lent to each 3D figure as it draws: `lend()` puts it in the figure's scene, shows
  the parts it names, poses it by its own `update(s)`, swaps colours, then puts everything back):

  | Figure | Drawn with |
  |---|---|
  | The dial at the top | `WDIAL.face(1)` and `WDIAL.HANDS` at Greenwich time, wound daily at 08:00 GMT |
  | Longitude, clock error | 2D; 4 s of time is 1′ of longitude |
  | Balance and hairspring | The Wempe's balance, hairspring, rollers and stud, swinging `WPHYS.ESC.A`; the masses swollen and the strip thickened (`R.spPath`, `ribbonGeo`) by the sliders |
  | Terminal curves | The Wempe's hairspring (05 03_7's curves) and, for plain ends, a coil of its size led straight in (essay-only, its drift exaggerated) |
  | Heat | A copy of the Wempe's cut bimetallic balance, its quarters curled in by bending the rim's vertices (exaggerated), a plain brass rim its size, and the Model 21's simplified (`HAMDATA.BAL_R`); the curves illustrative, the Model 21's its Navy test card's |
  | Constant force | The Wempe's fusee, chain and barrel posed at each hour (`n`); the lever from `R.fu.rf`; the force on the train 05 06_20's measured (`WPHYS.fusT`), the spring's pull its solved torque (`WEDATA.fusee.tq`) over the lever |
  | Maintaining power | The Wempe's maintaining ratchet, spring and detent, and the fusee wheel, posed by `update()` with the spring's lead (`WPHYS.runPhi`, `susPhi`) |
  | Winding | The Wempe's up-and-down sub-dial and hand; 3.21 h a half turn (`WPHYS.HPT`) |
  | Counting | The Wempe's centre, intermediate, seconds and escape wheels, turned by the train from the escape wheel's teeth |
  | The detent | The Wempe's escapement flattened into the wheel's plane (as its own essay draws it), moved by `WESC.ESC.state` |
  | Gimbals | `WCASE.build` with the Wempe's dial at Greenwich time |
  | Keeping the rate | 2D; a simulated chronometer's rate book in the form of Table I |
  | Equal altitudes, the time sight, the lunar distance | 2D, `ALM` (`shared/almanac.js`): fixed days and places, each sight made by `ALM.sextant` / `sextantLunar` at the true time and place and worked from the readings alone |
  | The almanac's pages, the workbook | HTML tables from `ALM` for any days (Print lays them out alone); the workbook reduces one's own sights |

- **Numbers in the text.** What a Wempe figure shows is a `data-live` span, filled by `fillLive()` from `WESC`, `WPHYS` and the built movement. What the
  text quotes of the Model 21 is a `data-ham` span, from `../essay/js/hamdata.js` (`HAMDATA`), which `tools/essay_hamdata.py --write` works out on this
  page by the expressions the Essay tab's `fillLive()` used (`ESC.measure()`, `TRAIN`, `ESC_PER`, `RUN_H`, `R.timing`, `R.hsDesign`, `ESC.ampAt`/`rateAt`);
  without `--write` it fails if the file is stale (`ci.py`'s essay-hamdata step). The Model 21's facts come from the manual and this README; the Wempe's
  only from `References/wempe/` and the Wempe's README. The sky sections also use published literature (PLAN-self-contained.md, decision D1); their stated
  accuracy is in `data-bound` spans, which `tools/almanac.js` checks; `data-phys` and `data-hs` spans are checked by `tools/physics.js` and
  `tools/hairspring.js` (all three read `../essay/index.html`).
- **Building and drawing.** A figure is built the first time it comes within 300 px of the view, once the fonts are loaded and, for those that show the
  movement, once it is built. A figure is drawn only when something in it changed. The 3D figures share one `WebGLRenderer` on a canvas off the page:
  each renders into the bottom-left corner of that canvas and is copied onto its own 2D canvas, so the page has one WebGL context. They are drawn with the
  models' Edges (`makeInk(r).lines`, `core.js`, told the corner's size and pixel ratio by `r.inkBS` and `r.inkPR`), unless `?edges=0`.
- **Hash and history.** `#detent`, the section in view as the reader scrolls (a heading within 150 px of the top). Links to the models are ordinary links
  (`../wempe/index.html#view=train`, `../chronometer-working-model/index.html#tour=3`), so Back returns to the essay where it was left; `sessionStorage`
  (`cm-essay-y`) keeps the place. On the site, `worker.js` sends the essay's first address (`/marine-chronometer`) to `/essay/`, and the Wempe's page at
  `/` sends the Hamilton's old `/#essay=…` there.

## The hairspring, designed

`HSPR` (`shared/hairspring.js`, checked by `tools/hairspring.js` and `invariants.py`) designs the spring a maker would wind, and the model draws it
(`R.hsDesign`, `R.spPath`, `ribbonGeo` in `core.js`), from what the model measures: the coil (r 5.1, 12 turns, 6.4 tall: the stud bar and its clamp measured at 6:50.0), the stud's clamp (its step
3.03 from the staff, the stud's bar 54.8° off the clamp's radius) and the collet's end (3.2).

- **The stiffness** the balance needs: k = I (2π/T)², with Table II's I (578.5 g·mm²) and T 0.5 s: 91.4 µN·m a radian.
- **The strip.** Its width along the axis measured on the restoration video side-on (6:49.5): each turn's section at the coil's edge 9–11 px at 45 px/mm,
  and its share of the 0.56 mm pitch down the stack 0.38–0.50: 0.20–0.28 mm, 0.23 drawn (`HS_B`). From k = E b t³ / 12 L over the spring's free length,
  414 mm, its thickness 0.221 mm for an Elinvar-type alloy at 180 GPa (`HS_T`; 0.213–0.226 over 165–195 GPa and the width's range), 0.211 for spring
  steel (207 GPa): the section about square, a wire more than a ribbon. Its bending stress at the 255° swing about 217 MPa. Hamilton's patent
  US 2,379,780 ("a change in length of five one-hundred-thousandths of an inch in the usual chronometer hairspring will cause a change of rate of
  one-tenth second per day") implies 549 mm for its usual spring, 25 % more: a general figure, not the Model 21's. Here 1 µm of length is 0.104 s a day.
- **Phillips' conditions** (Phillips, 1861): each terminal curve's centroid on the perpendicular through the staff to the radius at its junction with the
  coil, at R²/l from the staff, on the side the curve goes; with both, the spring's centroid stays on the staff as the coil winds and unwinds, and its
  pull on the balance is a pure couple. Each curve is solved from its curvature (the coil's at the junction, a cubic after) for its end's place and
  heading and the two conditions, at build time from a stored first guess (searched afresh if a re-measured end defeats it). The check
  (`HSPR.lateral`, Castigliano's theorem on the whole spring as a slender beam): the force the pivots carry under a couple, over couple / R.
- **The outer curve** runs from the coil to the stud's clamp at its step, along the bar toward its end (along it the other way no curve meets the
  conditions inside the coil): 14.6 mm, an S that swings in to r 1.46 (0.7 mm clear of the staff) and back out into the clamp, its ends' tangents 87° apart, and on
  along the bar into the clamp to 0.2 short of its end. Since 14 October 2026 the clamp is 4.34 mm from the staff, where the stud's holes measure (6:29 through the camera
  fitted on 6:49.0); there four curves meet the conditions, and this is much the smoothest (its tightest bend r 1.24 mm, the others' 0.30-0.39), so it is drawn: the
  curve's path is a design, no frame showing it (6:52.5 looks down the coil at the collet's end). With the clamp at 2.65 (the holes read through the old scale) it was a
  14.8 mm curve turning 330°.
- **The inner curve** runs from the coil to the collet's end, held there along the collet's end face: 21.8 mm, turning 308°, and `HS_LEAD` on into the
  collet's clamp. Where the collet takes it: KLUwI2UUCMQ 6:53.25 and 6:53.5, the balance held with the arm to the camera, show the collet's block and its
  brass wedge pin by the hub's cap, the pin 2.8–3.9 mm from the staff against the coil's near end (Hough circles, 229–235 px for its 5.26 mm outer edge).
  A short curve meets the conditions only for an end at 2.9–3.3 (at 2.8 and from 3.4 to 3.62 the shortest is a 1.9-turn spiral, 49–54 mm), so the end is
  drawn at 3.2 (`HS_RI`) and the collet scaled from it (`CKC`, Fig. 6's proportions kept; until 4 October 2026 it was scaled by the coil, its end at 3.62).
- **The force on the pivots:** as designed, 1.7e-5 of couple / R; with the ends the model drew before (`springGeo`'s ramps, round wire), 0.017.
- **At large swings** (`HSPR.large`, `HSPR.period`): small-deflection theory, Phillips' and Castigliano's, holds only near the rest. Solved as a planar elastica (an
  inextensible strip with its designed curvature unstressed, the stud's end clamped, the collet's end turned with the balance; the end loads by Newton's method, to
  4e-13 mm at the stud, the couple from them and dU/dθ agreeing to 2e-8), the couple stiffens by one part in 129,000 at 270° and the force on the pivots grows to
  1.1e-3 of couple / R at 90° and 1.5e-3 at 270°. The balance's period at each swing from the energy (the integration checked on a linear and a Duffing spring): the
  spring gains 0.182 s a day at 247.5° and 0.298 at 270° against small swings, **0.12 s a day over the manual's 1⅜ to 1½ turns, +0.05 for each 10°**, the same
  way as the escapement's error, so the adjuster's setting (`HS`, the bench) is about -0.18 for the designed spring where the model's -0.13 assumes an isochronous one.
  The model keeps `HS` 0 (the spring as adjusted, as the performance card shows it); the essay quotes the figures (`data-hs`, checked by `tools/hairspring.js`).
- **It breathes** (`R.spPath`, since 11 October 2026; before, each point turned rigidly by θ(1 − s/L) about the staff, the coils
  keeping their radii). With the ends meeting Phillips' conditions the collet's pull is a pure couple, so the bending moment is the
  same all along the strip and every part of the free length changes its curvature by θ/L: the heading at s turns θ(1 − s/L). The
  coils close as the balance turns one way and open the other, each by θ/(2πN) of its radius (r 4.83 to 5.40 over the 255° swing,
  5.10 at rest; 4.74 to 5.51 at 347°, the most a jolt gives), concentric to 0.04 mm, the terminal curves curling by as much, the
  length kept. Drawn from the stud's end back, each 0.3 mm segment turned at its middle; the second-order miss at the collet's end
  (0.024 mm at 255°) is taken out along the free length. Against the elastica (`HSPR.large`, the strip as drawn compared point
  for point with its solved shape) it is within 0.025 mm at 255° and 0.039 at 345°; the rigid turn was 0.28-0.46 off. The turns
  stay 0.2 mm or more apart (a helix: each turn 0.56 above the last). No photograph or video shows a Model 21's spring breathing.
  **Against the collet:** curling inward by θs²/2L near its clamp (0.39 mm 7 mm from it at 347°), the inner curve ran into the corner of
  the collet's body, whose hidden side was taken back to the plate's corner (0.02 mm off the strip at rest). No inner curve meeting Phillips'
  conditions from the collet's end clears that corner (the farthest out passes it at r 3.64; it would need 4.0), so the body's hidden side,
  which no source shows, now stops short of it: the strip clears the collet by 0.063 mm at the widest swing the model allows (347° wound),
  0.14 at 255° and 0.35 at rest, beyond the clamp's edge (the "Estimated" section, the collet).
- **Isochronism.** In small-deflection theory, with the force on the pivots gone, the spring's own isochronism error is what its curves' departure from the
  conditions leaves (residuals under 1e-11 mm) and the material's; the escapement's is `tools/escapement.js`'s. At the balance's real swing the strip's large
  deflection adds +0.05 s a day for each 10° (above). The model keeps the hairspring term at 0 (`HS`): the spring as an adjuster leaves it, set against the
  escapement, which the performance card shows.

## The mainspring, solved

The mainspring's shape in its barrel is the strip's equilibrium, not a drawing (`tools/mainspring.py` writes `js/mainspring.js`, `MSHAPE`; `mainspringGeo` in
`core.js` draws it). A spring in a barrel lies where its bending energy is least: each free stretch is bent from its natural curve by the moment it carries
(k - k0 = M / EI), and where the strip would want to pass through itself the coils press on each other instead.

- **The strip and the core** (12 October 2026, the owner's decision: follow the videos). The strip 0.394 mm thick by 1,064 long and 13.55 wide: the coils'
  pitch on KLUwI2UUCMQ's let-down spring, read round the whole turn, is 1/41.0-1/41.8 of the measured barrel's inside radius (15:54, 33:06), at most 0.394 mm
  inside r 16.3, and the length over the thickness, the pack's area over the pitch squared, about 2,700 with no scale needed (`References/VIDEOS.md`,
  Measurements). On the arbor's core r 4.9, the low end of three readings on two 1941 movements (r 4.8-5.7). The parts list's 0.0165 in (0.419) and the British
  Museum's late example's 0.44 disagree with it (OPEN-QUESTIONS.md 1: on this core in this barrel neither winds the fusee's turns). Until then the parts list's
  strip on an estimated core of r 1.8.
- **Its natural curve.** Out of the barrel (KLUwI2UUCMQ 32:18 and 32:30) the spring is a spiral of about 7½ turns, all bent one way (a spiral set, not the
  reverse curve of a modern alloy spring): its turns' radii, read along the line through its centre and scaled so the turns add up to the 1,064 mm strip,
  about 5, 10, 13, 18, 22, 27, 34 and 40 mm (two frames within 3 % of each other; oblique, so about 15 %; `References/VIDEOS.md`).
- **The solve.** The strip as r(θ) about the arbor, 48 samples a turn: least  ∫ (k − k0(s))² ds  for its length, its coils at least the strip apart (no film:
  the videos' pitch is the strip at most; 0.01 of grease until 12 October 2026), between the core and the brace, its inner end on the core over the eye where the hook holds it, its outer end along the brace. An augmented
  Lagrangian over L-BFGS (torch), each state from an even spiral and again from its neighbours' solutions, the least energy kept: states every quarter turn
  from 12.75 to 19.25 turns (about 20 minutes on 14 processes; 68 KB in the page), the states past coil-bound on the core (19.5 on) left out. Below its slack the energy climbs steeply (the coils on the wall can't open, so the inner ones
  must unbend), so no state is carried up from one below it alone.
- **In the page.** `msShape(T)` blends the two states either side, each piece of steel (the same distance along the strip) moving between its places in
  them, so the shape changes smoothly as the barrel turns. A blend a quarter turn from both has the energy of the state solved there to 0.4 % and its coils
  at least the strip's thickness apart (the energy is nearly flat, so shapes of about equal energy may lie up to 4 mm apart in places; states half a turn
  apart blend 3 mm out and let the coils touch). θ is rebuilt from r, to 0.04 mm along the coil.
- **What it shows.** Fully wound, the coils draw in round the arbor and fill the middle of the barrel, a gap at the wall; as it runs they spread out toward
  the wall, still half a turn past the slack at run down. Let right down, most lie packed against the wall with loose turns inside. Let down with the arbor out (`--letdown`), as C Spinner's 15:54 shows it, it
  gives 13.4 turns, 11.2 packed on the wall along a ray (11-12) and the rest loose (mean radii 5.1, 9.4, 11.6), where the frame
  shows 12 ± 1 packed (10.4, up to 11, with the coils 0.01 apart packed, until 12 October 2026: below) and one loose turn of about r 8 (the parts list's strip on r 1.8 until 12 October 2026: 13.6 turns, about 10½ packed). In the r 17.6 barrel it gave 14.3 turns, 11.9 packed (with the wall 0.2 thick, until 5 October 2026,
  9½ packed and 2½ loose); in the measured r 18.3 the pack is a turn or so thinner than the frame's, which the grease's friction, left out, may hold.
- **Its pull** (`MSHAPE.pull`, the energy's slope, smoothed by a quartic from half a turn past the slack, against its most, `MSHAPE.M1`, 1.01 N·m: EI/2 times
  the slope a radian; `physics.js` takes the torque from it, 0.96 N·m fully wound): nothing at the slack (13.25 turns), rising
  steeply over the first turn, then about evenly. **The set-up comes from it:** a fusee is cut for its spring, so the spring is set up where its pull falls
  over the 4.62 barrel turns the chain takes to leave the fusee as the chain's lever there grows, 8.03 to 15.25 mm on its pitch line (0.526; `fs.MS` in
  `movement.js`, read off the page by `tools/fusee_table.py`): 1.14 turns past the slack (run down at 14.39 turns, fully wound at 19.11, 0.24 turn short of coil-bound on the core, past 19.35,
  `mainspring.py --bound`): Op. 53's "wind barrel about one turn". Until the chain was drawn at its measured size (20 October 2026) the chain took 4.51 turns on a lever of 7.51 to 14.72 (0.510), set up 0.89 turn, run down at 14.14, fully wound at 18.75, 0.60 turn short of coil-bound. **The coils pack at the pitch the videos measure** (the strip 0.394, no film between
  them: the pitch is the strip at most, and no source gives a film); until 12 October 2026 the solver kept them 0.01 apart, so the model packed at 1/40.3 of
  the inside radius, coarser than every source (1/41.0-1/43.7), and was set up 1.01 turns, fully wound at 18.87, 0.33 turn short of coil-bound (19.20). The parts list's strip on the r 1.8 core, until 12 October 2026, 1.26; 0.99 on the groove's floor's
  0.473 until 11 October 2026, 0.47 in the r 17.6 barrel before 5 October, 1.62 in the thin-walled one, and 0.37 estimated before that). **The drive is
  taken from it** too ("How the timing works", the drive): until 11 October 2026 the timing had an illustrative pull of its own.
  **The arbor against the strip** (14 October 2026): the core is 9.8 mm across, 24.9 times the strip, where Daniels (*Watchmaking*, 1981, p. 254) wants 28 or
  more for a carbon-steel spring's life. No carbon-steel strip at 28:1 gives the fusee's turns in the measured barrel at this torque: kept as stiff, 0.36 × 812 mm
  on r 5.04 has 3.4 turns from slack to coil-bound where the set-up and the fusee want about 5.9; 0.385 × 1,064 mm and 14.3 wide (the barrel's 14.5 inside) on
  r 5.39 (`mainspring.py`'s variant `d28w`) leaves 0.10 turn past full wind, its coils' friction 8 % and the fusee's pull uneven past the bench's band. So the
  arbor stays the videos' and the build's spring is Nivaflex (`deviations.js`), which doesn't take a set; a carbon-steel spring is tested again after a month
  (the bench's mainspring test).

## What the model gives a maker

Phases B–D of `PLAN-self-contained.md`, in the page:

- **Tolerances for what the sources don't size** (`tools/tolerances.js`, `tools/tolerances.json`; OPEN-QUESTIONS.md): the mainspring's, the detent spring's and the trip spring's sections are known to no source, so their sheets say how closely each must be made, from the model's escapement (`ESC.atK`: the swing and rate with the drive and the two springs' stiffness scaled). The balance keeps the manual's 1⅜–1½ turns (247.5–270°) for a mainspring within −5 % to +11 % of the drawn stiffness (0.387–0.408 mm thick at the drawn width and length, 0.74–0.86 N·m fully wound), a detent spring up to 5.27 times the drawn stiffness (0.137 mm), where Op. 78's 0.005 in leaves it no preload (set up by the test, a stiffer spring takes a little less of the impulse, so the swing doesn't bound it: 6.9 times and 0.150 mm until 14 October 2026, the whole 0.770 g then taken as the preload), a trip spring up to about 2.4 times (0.081 mm). The parts list's 0.0165 in (0.419 mm), the same length, would swing it 282°; the other movement's pitch, 0.374, 234°.
- **The maker's sheet** of each part card (`MAKER.card`): its lines of the parts list (`js/makers.js`, from `bom.json`), each with the fit `bom.py` measured
  on the model (from `BOM.md`), its material, finish and heat treatment (the manual's where it names them: the Elinvar hairspring and trip spring, the
  beryllium-copper detent, the stainless rim on its Invar arm, the mahogany box; else watchmaking practice, marked as such), and the part's size, volume and
  mass measured on its closed solids (densities by the model's material), and its **holes** (`MAKER.holes`, as `tools/holes.py` reads them: the round inner
  loops of each mesh's faces square to the arbors, both faces, so a counterbore or countersink shows as two diameters; centres from the movement's centre).
  Its **drawing**: the solids' creases over 30° projected to a plan (from the dial side, 12 o'clock up) and an elevation, in millimetres, with the overall
  sizes and every hole marked and numbered as the sheet's table lists them (centres and diameters there), printed at a standard scale its title states
  (20:1 to 1:4, the largest that fits A4's column and page), its lines and text sized for paper. A line no relation measures shows what other parts it
  takes (the other side of their fits), or says it isn't measured. `tools/book.py` checks the book as printed. The screws on a card are listed
  with their heads, threads and lengths as drawn and, since Hamilton's threads are in none of the sources, the ISO 261 coarse metric thread nearest each (M1 × 0.25
  and so on) for a maker to cut. Its **STL**: its triangles in the movement's frame, mm.
- **Making it** (the panel): **Measure** (two points on the model, their distance and its components), **Oil** (each part coloured by the oil or grease it takes, after Ops. 18–71: red oil the jewelled pivots, argon oil the bushed ones, grease the mainspring and maintaining work), **Build book** (every card's sheet and drawing,
  printed alone: `#bookPrint`, `html.book-print`; the box and gimbals' parts with the movement's; a part with pieces as an assembly, its card and its drawing as assembled, then each piece to make on its own sheet, so each parts-list line is on one sheet; the split balance and the key on the hands' square, a variant and a copy, left out), **Data** (the train, `MOD`, `L`, the fusee's profile, the escapement's settings, figures and cycle,
  the hairspring's design and centreline, the balance's moment and pitches, the parts list), **STL** (every part shown), **Blender (.glb)** and **Blender rig (.py)** ("The model in Blender" below).
- **The essay's workshop**: the tolerances the manual gives (end-shakes, roller fit and shake, horn and stop-button clearances, the detent spring's 0.770 g,
  the escapement's angles, the wedge pins, the mainspring's let-down, the rate before the weights); the oiling chart (Ops. 43–71, the three lubricants);
  adjusting the escapement (Ops. 77–97 beside the model's live figures); the order of work (Sec. VIII's reassembly, the mainspring made safe first);
  materials, hardening and tools, and the chronometer that can be made without Elinvar and Invar (a steel spring on a split bimetallic balance).
- **Phase A's physics** (`tools/physics.js`): the fusee asks the mainspring (0.394 mm, the videos' coils' pitch; 13.55 wide, KLUwI2UUCMQ 15:54; 1,064 long, their L/t) for 0.96 N·m fully wound,
  solved coil by coil (`mainspring.py`'s `M1`: its packed coils don't bend, so it is stiffer than the linear strip's E b t³/12 L, which gave 0.78 until 16 October 2026;
  0.93 with the parts list's 0.419 until 12 October 2026), 2.75 GPa reckoned from its set curve: under a set strip's limit, 1.5 times hardened carbon steel's elastic
  limit, about 2.55–2.85 GPa (a rectangle's plastic moment over its elastic one; the strip is formed past its elastic limit, ICMFF9, so its free curve is a set one).
  Any strip at the measured proportions works at 2.60–2.77 GPa (0.365–0.394 mm solved, 16 October 2026): the thickness sets the torque, not the stress.
  Through the train (2,893:1, each stage 0.85–0.95) 66–103 µN·m at the escape wheel. Released from rest, the wheel (4.80e-9 kg·m², measured on its
  solid; `invariants.py` checks the two agree) and the fourth wheel behind it chase the impulse jewel, already running away from them, and catch it about 19° of the
  balance after the release, striking it at more than twice its speed (the escapement, `makeEsc`, counts the chase and the strike; `tools/dynamics.js` checks it beat by
  beat). The balance holds 255° if its Q is 212–390. **From the parts** (A6): each stage's efficiency from its measured pivots (μ 0.10–0.15 on the tooth loads) and its teeth's friction (μ 0.10–0.20,
  run dry), 0.91–0.97, at the top of the range assumed; the balance's damping from the air on its screws, nuts and arm (Cd 0.8–1.4 at Re about 180, Q 761–909, the timing nuts at mid-travel), the
  constant friction of its staff on the endstone, **measured** (12 October 2026: BunnSpecial's No. 2182, `Jd2c3x8VKsE` 14:04.3–14:12.5 and 16:10.4–16:17.1, the balance
  swinging freely from 2.2° and 2.0°, too little to meet the trip spring, its swing falling in a straight line at 0.238 and 0.231° a second, 0.16–0.22 with a viscous
  term free beside it, period 0.498 s: a constant torque Mc = k c T / 4, k from Table II's balance, 32–47 nN·m, Q 6,760–10,050 at 255°, 4–6 % of the model's loss
  there; the flat end worked out before, μ 0.10–0.15 across its whole face, gave Q 378–793, ten to twenty times the friction measured, which is that of μ
  0.008–0.012 on it; a domed end would give Q 22,000), the spring's residual side force and its own internal damping (Q 1,000–5,000): Q 405–710, a free decay of
  64–113 s (202–390, 32–62 s, with the flat end worked out). With the train's efficiency from its parts the budget needs 195–266, 199–313 with the mainspring's
  own coil friction and set (1.6–11 %): **the two don't meet** (16 October 2026, the solved spring's torque; with the linear strip's 0.78 they met, 262–423). At the
  model's `TF` the budget swings the balance about 312° (265–359°), above the manual's 1½ turns, as the one running Model 21 measured on video swings about 300°
  (We1dLNXiBj0: `startup.js`, `acoustic.py`). The page keeps the manual's 255° (the owner's decision, 16 October 2026): `physics.js` reports the gap (`~~`, not a
  failure) and OPEN-QUESTIONS.md records it; a made chronometer's spring is sized to its balance by the bench's run-down test. `TF` (the free swing's decay) is
  67 s (Q 421), inside the parts' range: the torque the model is calibrated at, 62.4 µN·m, is within 0.4 % of the linear strip's through the same train and losses as the old calibration took (0.611 of the fusee's torque reaching the escape
  wheel: 75.0 µN·m of the parts list's spring with `TF` 52 s, Q 327, until 12 October 2026; 68 s, Q 427, until 14 October 2026, when Op. 78's preload lost its
  0.005 in bend: the escapement then takes less work unlocking, and at 68 s the calibrated torque fell 1.3 % under the spring's and Q past the budget's 423). It was 34 s (Q 214) until 11 October 2026, when the escapement still left out the chase and the detent's whole lift.
  A real start (`tools/startup.js`, "Checked against real chronometers") wants 120 s or more. Op. 78 sets the detent
  spring's preload: a 0.770 g weight on the locking jewel should part it from its stop button by approximately 0.005 in (pp. 60-61, Fig. 88's "(.005 in. clearance)"),
  so the preload is the weight's moment less the spring's stiffness over that bend (`W78`, `G78`): 0.63 g at the jewel with the drawn spring (0.079 mm), and none
  left at 0.139 mm, an upper bound on the spring's thickness from the manual alone (until 14 October 2026 the whole 0.770 g, p. 61's clause missed). The discharge
  jewel carries the detent on past the release to 1.55 times the release lift, so the detent takes about 8 % of the impulse
  (`fD`, 5.7 %, was fitted to the lift at release until 11 October 2026). The escapement's own error is −3.0 s a day, absorbed by the timing, and the
  hairspring isochronism term that cancels its isochronism at 90 % of the torque −0.20 (`invariants.py`; −0.22 until 12 October 2026). Temperature: a steel spring on a steel balance
  loses 10.3 s a day a °C; the Model 21's Elinvar spring must be treated to -22 to 10 × 10⁻⁶ a °C to cancel its balance; the split variant's rim gives back
  7.0 s a day a °C.
- **Still estimated** (README "Estimated"): pivot and jewel-hole diameters (the balance staff's lower end, the escape jewel's hole and the third's and fourth's lower jewels now measured) and the screws' threads (the videos don't resolve them; the model's are its own,
  each fit's clearance on the sheets, with the ISO thread to cut beside each), the train's efficiencies (0.85–0.95 a stage), the trip spring's section, the materials where the manual names none.

## The overhaul

The manual is an overhaul manual, and its order is how a Model 21 comes apart and goes back together: Sec. V's 58 operations take the movement down,
Sec. VIII's 105 put it back (Ops. 16-34, the fusee, and 35-39, the barrel, usually done first, set where those parts go in, as the manual sets them),
read from the manual's text and transcribed in `js/overhaul.js` (`DIS`, `RE`). Each operation has the manual's instruction, cautions and notes; its
tools by Sec. XIII's numbers and names (`TOOLS`); its figures; its oil (red oil, argon oil, grease, and the points it goes on); and the parts it takes
off, puts on or loosens, named by their lines of the parts list (`bom.json`'s ids, which every piece of the model carries as `userData.hn`), or by a
part of the page (`@name`) where the line is a whole part. The card shows them with each line's number and name (`MAKERS`), and the build book's
"Putting it together" chapter prints the reassembly from the same data.

**How the parts move.** Only along the arbors, as the Exploded view moves them: a part comes off to where that view puts it (its rise measured on
the page: `explode(1)` against `explode(0)`, so a part turned over inside another goes the right way), a screw out of its hole by its own lift. A part
rides on what carries it until its own operation (`HOST`): the fusee wheel, the sustaining ratchet and spring and the chain on the fusee until Ops.
39-41, the setup pawl's spring and pivot screw on the barrel bridge until Op. 32, the balance lower bridge on the upper train bridge until Op. 50. Each
comes off its host by its offset in the Exploded view, so a part and its host moving in one operation go in straight lines. A piece the Exploded view
doesn't move from what carries it (a cap on its bridge, a post in its plate) comes off away from the side facing up, by half the least lift of the
screws coming out with it (so it never rises past their heads), else 6 mm; where the sources say otherwise, `UP` gives the way and the distance: the
winding stop unscrews from under the barrel bridge (KLUwI2UUCMQ 12:58-13:04); the barrel's cap is on its dial side, and its screws, arbor, mainspring
and brace come out that way (Ops. 34-37); the winding ratchet wheel comes off the fusee arbor's lower end, past the pinion, its two screws ahead of it
(Op. 43); the seal ring and its spring stand on the barrel bridge, which carries them as the dust seal lifts (KLUwI2UUCMQ 12:34-12:38.5); the balance
lower endstone cap comes off the lower bridge's underside; the fusee goes 90 mm clear, so what comes off it on the bench (Ops. 39-45) lands above the movement. A part done with goes in the
cleaning tray: once its operation is over it is hidden, unless a later operation works on it or on what it rides on. Every part in one operation moves
by the same share, the path `tools/overhaul.py` checks; Back and Next move one operation's parts, the slider goes straight to another operation.

**What it shows as the manual has it.** The manual's balance locking arm (Fig. 9), which rides on the upper train bridge: the Navy's Y-arm balance stop
(the page's default, as on 2E11795) isn't in its operations. On the restoration video's 2E8489 it comes off before the cock, unscrewed at its seal's
flange and lifted off with the seal (6:15-6:24), which Op. 10's text says. The train-blocking screw goes down at Op. 5 and up at Op. 46 (and in the
reassembly at Ops. 45 and 75); Op. 7 and the reassembly's Op. 54 wind the fusee. The bezel is off from the first operation until the reassembly's Op.
103; the box is hidden while the movement is on the work ring or in the dialing ring.

**The check** (`tools/overhaul.py`, `overhaul-check.js`, about 12 s; `ci.py` runs it). Every body (each part, screw and loose piece the operations
move, and what they leave of their parts) is rastered as assembled into vertical columns 0.2 mm apart, as `exploded.py` does, giving for every pair the
relative rises at which they meet. Each operation is followed along its path (41 points); a pair fails if it passes into a meeting it didn't start or end
in, or leaves (or enters) an overlap as assembled the long way round. What the operation leaves in the tray is out of the way. It found the movement's
order sound and the model's own placement rules wrong in a dozen places, all fixed; what remains is in its `EXPECTED` table, each with its reason:

- what a real movement does other than straight along the arbors: the detent is drawn out sideways from under the upper train bridge (KLUwI2UUCMQ
  10:51-11:06); the fusee comes out tilted, its wheel's edge from under the upper train bridge, the wheel's teeth reaching under it to the centre pinion
  (the video lifts it out with the bridge still on, 13:06-13:33, as the manual's order has it), the sustaining pawl held aside; the chain is unwound from
  the fusee's groove and unhooked from the barrel (Op. 8); the taper pin goes in across the arbor; the brace slides along the barrel's wall; the second
  hand goes on with the minute hand at 12 (Op. 64), where the model's hands show the time.

Three readings the check found the model drawing wrong were fixed on 15 October 2026 (Review-results.md, "The overhaul's order against the model"): the
fusee's and barrel's bushings and the arbors in them, the winding ratchet's way off the fusee, and the dust seal's ring and spring.

## The model in Blender

**Blender (.glb)** in Making it writes the whole instrument as a glTF 2.0 file (`model21.glb`, about 95 MB, a minute or so to make), and **Blender rig
(.py)** the script that drives it. In Blender (5.x): File, Import, glTF 2.0; then open the rig in the Text Editor and press Run Script. Set the scene's
frame rate before importing: the clips come in at it.

- **What comes across.** Every part a named object in the model's own hierarchy: the root (millimetres scaled to metres), the box, ring, case, movement,
  each part (named as its card, with its key: "Escape wheel (escW)"), each arbor and pivot group (by its name in the code: `esc`, `staff`, `fz`), each
  piece (by its line of the parts list: "42173 Screw - Balance, 200-205 mg, …", else its part and material). Custom properties keep the part key, the
  parts-list line (`hn`) and, for the rig, the rest pose and the drives. The materials as the page has them (colour, metal, roughness, the damascening's
  stripes and normal map through `KHR_texture_transform`, the wood, the engravings and the dial as textures, drawn again for the file finer than the page's: twice as fine, the engravings' lettering four
  times (each texture's `redraw` in `core.js`, the same drawing at a size)), but the jewels and the crystal as what they
  are, not the page's stand-ins: transmitting, with the published refractive indices of ruby (1.77) and glass (1.52). Only the variants chosen on the page
  (dial, balance, stop, plate finish, the timing weights' places and the screws) are in it. The page's own lighting is not: give Blender a world (an HDRI).
- **The clips**, each an action: Running (a minute, the second hand once round), Beat (slow motion, one beat 20 times slower), Run down (56¼ hours in 30 s;
  the escape, fourth and third wheels and the seconds hand left out, as a blur), Winding (from a quarter of an hour short of run down to the stop, the
  sustaining spring driving the train), Setting the hands, Stop and start (the locking arm, a twist, the train-blocking screw), Exploded, Laid out, Lift
  out, Lids, Latch and At sea (the box rolling, the case swinging in its gimbals; six rolls, which loop, the case's swing settled first); and the rig's own, one parameter each (Rig · beat, Rig · explode, …).
  They are played through the export's own copy of the model with the equations of `app.js`'s loop (the stopping and starting, the balance's amplitude,
  the gimbals' pendulum), each from the rest pose (the page's state of wind, the escape wheel at the start of a beat, the lids open), and read back off its
  nodes: a node that moves gets keys where it changes, as few as put it back within 0.0005 mm and about 0.006°.
- **What deforms.** The hairspring is keyed by the balance's angle: shape keys 0.15 rad apart over the widest swing, each moment a blend of the two either
  side (within about 0.015 mm). The mainspring, whose vertices change with its wind, is a flipbook of 24 shapes over the whole wind, the nearest shown; the
  trip spring a flipbook of its shapes through a beat (the first 128, then the nearest); the stop-bar spring, the sustaining spring and the winding pawls'
  springs shape keys; the chain one object a link, a link the chain doesn't reach at scale 0. Hidden is scale 0 throughout (glTF has no visibility).
- **The rig** (`blender/rig.py`) runs the chronometer on the timeline for as long as it plays: the escape wheel, train, hands, motion work and fusee by
  drivers in step with the escape wheel's place (the beats run, plus how far the wheel is ahead of that even run, read off the export's helper "Rig ·
  escape wheel teeth", 0 at each end of a beat so its loop has no seam; each such part was found turning about one axis in step with it, `extras.rig`), the balance, detent, trip spring and hairspring by Rig · beat on a loop, and the
  rest by Action constraints whose time its controls drive ("Chronometer controls": hours since full wind, the hands set on, explode, laid out, lift, lids,
  latch, roll and pitch). The constraints' actions are made over into changes from each part's rest, so two can move one part, and in Euler: Blender 5.2's
  Action constraint reads an object's rotation channels only so. No Python runs in the drivers. `PLAY = 'Winding'` (any clip) at its top plays that clip
  on every part instead. Against the clips (`tools/blender_check.py`), the rig puts every part where Running has it within 0.02 mm and 0.1°, but the chain's
  links (0.05 mm: Run down's moments are 1.9 hours of wind apart), and explode, laid out, lift and lids at 1 where their clips end.
  The rig is shared with the Wempe's export (`wempe/js/blender.js`, the Wempe README's "Downloads"): it makes only the controls whose rig clip the file has,
  and drives a part that repeats with the escape wheel's place by a clip whose `rig.p` is `E`, over its `b − a` beats (the Wempe's maintaining detent riding
  its ratchet). The export takes its start hours in single precision (`Math.fround`), as Blender's driver variables hold them: until 16 October 2026 an
  export made between round hours left the rig's hours up to 2e-6 h off its own, the escape wheel up to 0.3° off its clips at 30 h.
- **Checked against the page** (`tools/blender_check.py --looks`): close-ups of the engraving, the serial, the damascening, the dial and the box, rendered by
  the page and by Blender (Cycles) from the same cameras, agree in place, orientation and scale: the engraving reads as on the page, the stripes run the same
  way at the same pitch and the bridges' undersides are plain, the dial is the page's. Blender's plates look more mirror-like: the same nickel (metal,
  roughness 0.2), but path-traced, reflecting the parts round them; give it an HDRI, or raise the plates' roughness, for the page's satin look.
- **Not carried across**: the escapement's settings as a bench to adjust (the export is at the page's), the jolt, the oiling and drawing modes, sections.

## The almanac

The essay's sky sections carry their own almanac, `ALM` in `shared/almanac.js`, so the page alone (or its single-file copy, offline) is enough to rate
the chronometer by the Sun, find longitude with it, and check it at sea by the Moon, with no radio signal. Angles are degrees, the corrections arcminutes,
times JavaScript's milliseconds of UT.

- **The places.** The Sun: the abridged VSOP87 series (Meeus, Appendix III) with the FK5 correction, nutation and aberration. The Moon: Meeus ch. 47 (the
  main ELP-2000/82 terms) with nutation. The stars: the Nautical Almanac's 57 and Polaris, SIMBAD's ICRS J2000 places and proper motions, carried by
  precession (ch. 21), nutation (23.1) and annual aberration (23.3). Sidereal time: Meeus 12.4 and the equation of the equinoxes. Nutation: the short
  series (0.5″). `tools/almanac.js` finds, against JPL Horizons (DE441) over 1950–2149: the Sun within 0.5″, the Moon within 6.5″ (its distance to
  42 km, 0.4″ of parallax); against skyfield, the stars within 2.1″ to 2120. Left out: the annual parallax (under 0.8″), light's bending, proper motion's
  second order (α Cen's 3.7″ a year carried linearly gives the 2.1″).
- **ΔT** (TT − UT1): Espenak and Meeus's polynomials to 2000, the IERS's measured values (each 1 January) from 2000 to October 2026 (69.09 s), then a
  forecast: that value held to 2050, then growing as their long-term parabola. It only matters to the Moon against the stars: a second of ΔT moves a
  lunar distance's Greenwich time by a second. The almanac's pages take a value instead.
- **The sight.** Dip 1.76′ √h; refraction by Bennett's formula with temperature and pressure (run backwards, by iteration, to make a sight); the
  semi-diameter (the Moon's augmented by 1 + sin HP sin h) and parallax HP cos h (the Moon's HP reduced for the latitude). The time sight, the intercept,
  a least-squares fix, the latitude by a meridian altitude (the noon sight) or by the pole star (the triangle solved for the latitude, at any hour angle), the daily rate from two errors, and equal altitudes (the chronometer's error that makes the two altitudes equal; the old rule, the middle of the readings, and the
  equation of equal altitudes for the difference). Round trips from sights the almanac makes give the longitude back within 0.001 nm, the error by
  equal altitudes within 0.01 s, the latitude by noon sights within 0.001′ and by the pole star within 0.33′ (with the DR longitude 30′ out).
- **The lunar distance** is cleared exactly on a sphere (the angle at the zenith from the apparent altitudes and distance, then the true distance from the
  true altitudes); the Earth's figure (up to 0.2′, 24 s of time) is taken off by clearing a sight the almanac makes from the place by dead reckoning, which
  brings the Greenwich time back within 1 s with the DR 30′ out. A distance changing under 15′ an hour is reported too slow. Refraction's flattening of the
  discs is left out (under 0.3′ above 10°, and the same in the almanac's own sight).
- **Venus and Mars** (`ALM.planet`): JPL's approximate Keplerian elements (Standish, Table 1, 1800–2050), the Earth from the Earth–Moon barycentre less
  the Moon's share, light-time, then precession, nutation and aberration: within 36″ and 102″ of Horizons from 1950 to 2049 (the essay states 1′ and 2′),
  for sights, not lunars.
- **Jupiter and Saturn** (`ALM.planet`, `PF` in `shared/almanac.js`): those elements err 400″ and 600″ for them (the two pull on each other), so their
  heliocentric longitude, latitude and radius are short series fitted by least squares to JPL's DE440 (`tools/planets_fit.py`, from DE440s through skyfield,
  every 4 days over 1850-2150): polynomials in T and 35-56 sine and cosine terms each in k1 λJ + k2 λS + k3 λU, chosen one at a time (the strongest left,
  none within one cycle a span of another's frequency, so no two cancel), a factor T on the strongest. Within 8.1″ and 4.0″ of DE440 seen from the Earth at
  worst, on the fit's dates and between them; against Horizons' apparent places at the 90 reference epochs, 6.6″ and 2.6″ (`tools/almanac.js`; the essay
  states 10″ and 5″). Good for lunars, but only from 1850 to 2150: fitted to 1850-2100 alone, the series errs 108″ and 183″ by 2149. Semi-diameters at 1 au
  98.44″ and 82.73″ (Meeus, Ch. 55; Saturn's globe).
- **By hand.** `sunHand` is the Astronomical Almanac's short formulas, as the essay prints them: within 0.6′ of the full series from 1950 to 2049, enough
  for a time sight, not for a lunar (the Moon needs the series, so its pages print).

## Testing

The page's state is kept in the URL hash, so a link opens the model as it
was: `#view=escapement&speed=0.05&part=det` (a view, speed and picked part, or piece: `part=bal.staff`; `view=laidout` is the laid-out train), `arm=1` (the balance locked, at rest), `block=1` (the train-blocking screw down),
`#tour=6` (a walkthrough step), `#ovh=d12` or `#ovh=r46` (the overhaul at Op. 12 of the disassembly, Op. 46 of the reassembly), `#essay` or `#essay=detent` (the essay, sent on to its own page at that section, `../essay/index.html#detent`), `open=bookDet` (in a link: open that panel section), `drive=1` (Moving parts only), `draw=1` / `draw=ink` (Tinted / Ink drawing), `edges=0` (Edges off), `shadows=1` (Shadows on), `merge=0` (Performance mode off), `sec=x:-3.5`, `esc=rT:0.29,aI:185` (the adjuster's bench, where it differs)
(a cross-section; `:f` shows the other half, `:o` draws the Edges of the faces inside the cut parts across their cut faces: the panel's Outlines through the cut ticked; plain, unticked, is the default since 3.26.04, and `:p` from 3.26.03's links still reads as it), `tz=local`, and `t=10:09:30`
once the hands have been set. It is read at load and when edited, and
rewritten (without adding to the history) 0.3 s after any change.

Two URL flags help with testing:

- `?snap` switches off camera and state easing, so views settle immediately
  (useful for screenshots), and draws every frame (see below).
- `?qa` exposes the movement (`__mv`), the photo-projection helpers (`__proj`,
  `__unproj`) and camera controls (`__cam`, `__look`, `__camInfo()`) for the
  tools, plus the parts registry (`__parts`), the renderer (`__r`), a count
  of frames drawn (`__renders()`) and the stopping-and-starting state
  (`__H()`: amplitude, whether the train is held, the arm and screw), and the export to Blender (`__glb(clips)`: the file saved as a download,
  the named clips only if given; `tools/gltf_check.py`).

The stage is drawn only when something shown has changed: the camera, the
lids and lift, the wheels and balance, the wind, ship motion or a section, or
any input in the last 0.6 s. Otherwise it is redrawn once a second, and not at
all while scrolled off screen. A stopped model with a still camera draws once a
second instead of every frame. The balance's swing counts only while the
balance can be seen: with the movement in its case under the dial (the Dial and
Box views, nothing see-through, hidden, faded or cut), the hands' steps alone
draw a frame, about 4 a second at 1×, unless the walkthrough's inset or the
adjuster's bench shows the escapement. Without input a frame comes at most
every 10 ms, so a 120 or 144 Hz display draws the running model at 60 or 72 Hz;
input draws at the display's rate. Each frame is compared with the last one
drawn. Code that changes the scene without input or a `look()` call should call
`wake()`.

Every piece of the model is tagged with its line in the manual's parts list
(`userData.hn`, set by `hn()` in `core.js`; `bom.json` is the list, `tools/bom.py`
checks the model against it and writes `BOM.md` at the repository root).

The browser tools in `tools/` open `index.html?snap&qa` themselves. They need
Python with numpy, scipy and Playwright's Chromium, and write their output into
the folder they're run from. `escapement.js`, `almanac.js`, `solve.py` and the checks of the physics (`physics.js`, `dynamics.js`, `strength.js`, `errorbudget.js`: "Checked in time" below) need no browser. The
root README's "Checking your changes" lists which to run and what they should
report.

## Coordinates and units

Millimetres. Movement frame: dial side is +y, 12 o’clock is −z, 3 o’clock is +x.
Arbor positions are in `L` at the top of `movement.js`. The main levels are the
constants beside it:

| Constant | Level | Height above the pillar plate |
|---|---|---|
| `TB_U`, `TB_T` | Train bridge underside and top | 16.8 and 19.9 mm |
| `BB_T` | Barrel bridge top | 23.3 mm |
| `CK_T` | Cock top | 34.1 mm |
| `EY` | Escape wheel | 15.1 mm |
| `LB_T` | Balance lower bridge's top face | 10.9 mm |
| `BAL_Y` | Balance rim | 22.4 mm |

Below the plate (+y, on its dial side): the mounting ring's flange from `MR_FL` (2.14 mm) to `MR_Y` (6.54 mm), the dial's seat. The dial and all above it (`DD`, 3.24 mm) stand that much higher than when the dial stood on 3.3 mm feet on the plate.

## How the timing works

Everything is driven from one model clock `tSim`, in seconds of the time kept (GMT by default, or local time).

Beside it runs the master time `tM`: a perfect clock, standing for the time signal the chronometer is compared with. It runs at the model's speed, also while the chronometer stands, and doesn't follow the weights. The dial error is what the hands show (`dialRead()` in `app.js`: the second hand's time, continuous as a comparator reads it, with the minutes from the minute hand) less `tM`; it grows with the rate, with the time the chronometer stood, and with setting the hands.

- The balance's phase is `y = tSim / 0.5 + bOff + PL`, one oscillation per half-second, counted
  from its far turn before the unlocking; `p = frac(y)`.
- `ESC.state(p)` returns the balance angle, detent lift, trip-spring deflection
  and the escape wheel’s progress through its current tooth. `p` 0 is the active
  swing's start, the wheel locked (progress 0). The progress dips a little under
  0 while the stone is drawn out against the locked tooth (the recoil, at most
  0.18° of the wheel, from −27.8° to −22.6° of the balance), and after the impulse
  the tooth runs on from where the jewel lets it go (0.96 of a pitch, +20.7°) to
  the stone at the speed it had and more, locking at +22.1° (at 255°).
- Escape wheel position is `E = floor(y) − 1 + progress + eOff`, counted in
  teeth (`eOff` whole). Every other arbor is a fixed ratio of `E`. The hands therefore advance
  in half-second steps, as the manual states (Sec. IX, p. 66). `PL` (0.263 of an
  oscillation at 255°) is where the next tooth locks and the second hand comes to rest, so
  with `bOff` and `eOff` 0 the hand lands on the mark k/2 s at `tSim` = k/2, as on a
  chronometer set to a time signal; `dialRead()` gives the time the hands show,
  `tSim + (bOff + eOff)/2` (with `slip`, the hour and minute hands' turn on the cannon pinion). The train goes by this phase
  at every speed (above `REAL_X` only the drawn balance is slowed), and the wheel never turns
  back (the progress at a phase changes with the swing).
- The fusee and chain follow the hours since winding (`hrs`, which runs with the
  train's own time, `tSim`, so a fast chronometer runs down sooner by the master's
  clock): one fusee turn per 90/14 = 6.43 hours. The model runs down after 56¼ h (`RUN_H`, the fusee's 8¾ turns,
  the manual's 17½ half turns from completely run down); the dial's UP–DOWN scale
  covers the rated 56 h. The run down is the chain's own: its last turn leaves the
  fusee at 55.1 h, and its end pin (`ME`, 8.54 turns down the groove, 0.21 turn
  short of the groove's end) then swings on past the tangent toward the barrel, the
  chain running straight from it, so the chain's lever on the fusee (the arbor's
  distance from that line, `fs.lever`) falls from 14.7 mm to nothing over 1.2 h,
  where the line passes through the arbor (`geo` in `makeFusee`). The pin is placed
  so that is at `RUN_H`: the chain's end on the fusee isn't seen in any source, and
  the manual's 17½ half turns are the fusee's turns from that rest. The drive falls
  with the lever, and the train stops about 5 minutes before `RUN_H`, its drive
  under the 0.14 that keeps the balance above `ESC.AMIN`. Until 11 October 2026
  the chain ran to the groove's end and the drive stopped at `RUN_H` from full,
  with 0.03 turn of chain still on the fusee.
- The chain lies in the fusee's helical groove, locked to it: `setWind(n, eps)`
  places its joints 1.7 mm apart along a pitch line wound on the fusee from its
  end pin (`ME`) to where it leaves (`md`, the fusee's turn plus the common
  tangent's drift), then along the drums' common tangent and round the barrel
  (the barrel taking up what that straight run gains, so the chain keeps its length)
  to its hook. The stop-bar's travel comes from the same place: the bar's
  chain end, which stands out over the groove's top turn 0.14 turn from where
  the chain leaves at full wind and reaches down into the links' upper plates,
  is kept just outside the drawn chain (`barTravel`: each corner of its end
  inside the incoming run's inner face, then inside the wound turn's), so the
  links press it in as they arrive, until the end's outer corner is at the
  chain's inner face, 1.98 mm, so the stop end stands out past the rim for the last
  0.4 turn of a wind and meets the winding stop at full wind. Full wind is
  where the stop end's leading corner first touches the stud (the bar's turn
  `al` is solved for it from the stud's measured place), 0.47 mm into the
  stud's path; on every earlier turn both ends pass it 0.6 mm or more clear
  (`tools/maintaining.py`).
- Maintaining work (`update()` in `movement.js`): when running, the fusee's
  winding ratchet drives the sustaining ratchet through the two winding pawls,
  and a pin on that ratchet drives the fusee wheel through the sustaining
  spring, which carries the whole drive (the manual: "through the sustaining
  spring, under load during the entire running cycle"). It is a split ring
  weaker than the drive (Gould, 1923; Glasgow, 1885), so in running the drive
  closes it on its banking (`SSB`, its lobes 0.5° apart). `R.ssD` is how far it
  has relaxed from banked; it pushes with `SPU` (0.28, what its section traced on the
  video gives: `tools/sustaining.js`; 0.33 from the automated trace and 0.22 with the 12.5° gap first read, 18 October 2026; 0.82 designed until 17 October 2026) times 1 − `R.ssD`/`SMAX` of the 12-hour drive (`R.ssF`,
  `SMAX` 16.9°, its 17.4° gap measured less the banking; 12° until 18 October 2026, 19.5° until 17 October), so running it stays
  banked while the fusee's drive is over its push (`R.drvN`, the mainspring's
  set included), all the run but its last taper, then relaxes as the drive
  tapers to run down (a taper of 1.2 h, far slower than the spring, so it
  follows it and the sustaining pawl never holds). Until 14 October 2026 it
  was an unbanked spring carrying the whole drive, `SMAX` 9.3°, the fusee
  wheel's turn in 10 minutes. The fusee turns with the sustaining ratchet, its faces on
  the winding pawls, so it sits `eps` (`R.eps`, within a tooth) past its `n`
  turns. Should the fusee's drive fall faster than the train relaxes the spring
  (the slider set to run down, a set taken), the spring turns the ratchet back
  until the sustaining pawl holds it (`holdBack`: the next place a face meets
  it, every tooth from `phaseAgainst`'s) and drives the train alone, the fusee
  standing. When winding starts, the spring pushes the ratchet back with the
  fusee, the winding pawls still on their faces, until the sustaining pawl
  catches it; only then do the winding pawls ride over the winding ratchet's
  teeth, and the spring relaxes as it drives the train; `eps` runs down with
  `n`, so the stop-bar meets the winding stop at full wind. When the key lets
  go (`catchAt`), the fusee turns forward to the first place its ratchet meets
  the pawls (none if it is on them), then on with the ratchet until the spring
  is loaded to the drive again; `R.release` gives those turns and `app.js`
  (`windEnd`) takes their hours off the mainspring, so `eps` stays within a
  tooth over any number of partial winds. A set of the hands moves the ratchet
  with the train (the spring as it was; the loop can say so with `reset`), a
  jump of the slider the fusee to its new turns on the nearest tooth. Nothing
  turns back but as said; `tools/maintaining.py` checks it all. Every pawl is rested on its ratchet's teeth each frame
  (`seatPawl`: turned in from outside to its first touch, the teeth's tips kept out of its outline too), so it rides over them or bears on a steep face. The winding
  pawls' flat springs are rebuilt with them (`wpsGeo`), their ends kept on the
  arm as the pawls swing out over the teeth while winding.
- The mainspring (`mainspringGeo` in `core.js`) is rebuilt from the barrel's turns `Ib(n, eps)`: its turns from the inner end to the outer fall from `Tup` at full wind by the barrel's turns (`fs.MS`), and its shape at each is the solved one ("The mainspring, solved" below): wound, its coils drawn in round the arbor, a gap at the wall; running, they open out toward the wall (let right down, as for service, most would lie in a pack against it with loose turns inside). Its inner end is held by the arbor's hook in an eye, and its outer end turns with the barrel, its anchor pin on the brace. The arbor never turns, and the setup click faces the spring's pull.
- What turns while winding: the fusee wheel follows the train (`gA`), not the
  fusee, so it keeps turning forward, driven by the sustaining spring, while
  the key turns the fusee and its winding ratchet back and the sustaining
  pawl holds the sustaining ratchet. The setup ratchet never turns in running
  or winding: its angle is set once when the movement is built (`srw.rotation.y`,
  a steep face on the click), and `update()` turns it only by `ld`, when the
  page lets the mainspring down and sets it up (Mainspring, under Winding). The barrel arbor turns only when
  the watchmaker lets the mainspring down or sets it up with a let-down key
  (Sec. II, p. 4: "the only time that the mainspring arbor turns is when
  manipulated during assembly, disassembly or adjustment"; Ops. 8, 53).

### Stopping and starting

A detent chronometer does not start by itself (Sec. III), so the balance's
amplitude is kept as state (`H.amp` in `app.js`; running, it comes to `ESC.A`, 255° each way at the model's settings)
and `ESC.state(p, amp)` gives the escapement at that amplitude.

- **What keeps it going.** A swing must carry the discharge jewel past the trip
  spring on the return (it comes clear of the jewel's end at −40.2°), unlock the wheel (−21.3°) and
  see the impulse through (the tooth leaves the jewel at +20.7°). `makeEsc` works out that least amplitude
  from its own tables: `ESC.AMIN`, 40.6°, the trip spring's the one that binds. Exactly so: the 2° it
  was given to spare until 11 October 2026 had the train held between 40.2° and 42.3° while
  `ESC.state` drew the detent unlocking it.
- **When the train stops.** It stops at a locked beat when there is no power
  (run down: a frame runs the train no further than the chain has left, and only the
  beat under way then finishes), when the swing falls below `AMIN`, or when the locking arm brakes
  the balance. With the train-blocking screw's dog point down between the fourth
  wheel's spokes it goes on until the next unlocking lets the escape wheel go and a
  spoke meets the point (`R.blockRoom(E)`, the beats left), a fraction of a tooth past
  the lock, as the manual's Op. 6 has it ("allow the escapement to function until the
  train is stopped by the blocking screw bearing against one of the arms of the fourth
  wheel"). The detent is back on its stop with no tooth on it, and the tooth the spoke
  holds stands in the impulse jewel's path (unless it stopped within 0.04 of a tooth of
  either lock): the jewel strikes it on each return swing (`bankAt`, `bankState` in
  `box.js`, the angle where `ESC.PA` meets the wheel's place), so the balance swings
  only on its own side of the tooth and is stopped as quickly as by the arm (`TAU_ARM`,
  estimated). Raised, the screw lets the wheel run on to the next tooth's lock, a
  whole beat again.
- **While it is stopped** `tSim` and the hands stand, so they lose the time it
  stood, as a real one does. The balance keeps its own phase (`H.bph`) and runs
  down. With the train held it runs down free of the impulse (the air and pivots, 1/e in 67 s, `TAU_FREE`, from
  `ESC.settings.TF`, derived from the energy budget: "What the model gives a maker"), but while the swing still carries the discharge jewel back
  past the trip spring's tip (above 40.6°) the jewel still bends the trip spring on the return and lifts the
  detent on the next swing, and the wheel can't turn: the springs take `ESC.EHd`, 0.027 of k
  an oscillation (19 % of the air and pivots' loss at 255°, more than theirs below about 109°: the drawn detent leaves the jewel still
  moving and loses its springs' and its own kinetic energy there, about 9 % more than a massless one's 0.025, `ESC.EH`), so from
  255° it comes down to 40.6° in 59 s, not 125 (`ESC.freeStep`, in closed form a second at a time; `tools/dynamics.js`
  integrates the same run-down within 0.7°). Against the locking arm it stops at once, within a swing or two
  (`TAU_ARM`, 0.2 s). A smaller swing leaves the jewel on the near side of the tip: the
  trip spring stays bent against it and follows it back, and the detent stays on
  its stop (`ESC.state`).
- **When it goes again.** The train runs again when there is power, the arm is
  off, the screw is up (or leaves a spoke's room) and the swing is above `AMIN`, the
  wheel on its stone and the balance where its swing doesn't unlock it. That happens at once if
  the balance is still swinging: the screw raised before a spoke stopped the train (or
  after, if the tooth it held was clear of the jewel), or the chronometer wound,
  before the balance has run down. Otherwise it takes Twist to start. The twist
  turns the box sharply 35° about the vertical and back a quarter of a second
  later (`TWIST` in `box.js`, illustrative); the balance, free on its pivots but for
  the hairspring, stays where it is in space while the box turns under it, so
  relative to the movement θ″ = −ω²θ − α″, and turning back half its period later
  doubles what the first turn gave: from rest it is left swinging about 67° (a real
  start by hand, `We1dLNXiBj0` 0:55, was 62-66°), worked out from where the balance is
  (`TWIST.path`, which the page also draws the balance along while the box turns, then
  leaves it with the swing and phase it ends with; with reduced motion the box doesn't
  turn and the end state is eased in over 0.15 s; with the train going, a twist is a
  knock, as a jolt is), and the
  impulses bring it up to the swing the train's torque gives (`ESC.ampAt`, 255°
  at the calibrated torque), settling over a minute or so (A² relaxes as exp(−2t/TF), 34 s; below, The balance's
  dynamics).
- **Nothing jumps on restarting.** `H.bOff` and `H.eOff` carry the balance's
  phase and the beat count across, so neither the balance nor the hands jump.
- **Moving the controls.** The arm and screw move on frame time, not model
  time, whatever the speed: the arm turns in 0.8 s, and the screw takes 2.5 s
  over its 32 turns. The screw can't
  come down on a spoke (`R.blockClear(E)`), so it waits just above the wheel
  until a gap comes round.

### The rate panel

`R.timing(nt, nv)` returns the balance's moment of inertia `I` with the timing
and vernier pairs turned `nt` and `nv` turns out, and `tSim` runs √(I₀/I) as
fast as real time. The rate for a turn is the manual's; the moment of inertia
and the thread pitches are the model's. Things to know before changing it:

- **"One full turn" is read as the pair.** The manual says "One full turn of
  timing weight equals about 40 seconds. One full turn of vernier timing
  weight equals about 2.8 seconds" (p. 70, under Table II, which is for pairs
  of screws). The model takes this as both weights of a pair turned a turn
  each, as they are in practice to keep the balance in poise. If it means one
  weight, the pitches double, to 0.29 and 0.18 mm. The rates the panel shows
  would not change, because the pitches are fitted to the manual's figures.
- **The moment of inertia is Table II's.** Table II (p. 70) gives the rate a
  pair of screws of one head height makes against another: 0.100 in to 0.080
  in, about 16 minutes a day; 0.100 to 0.050, about 43; and eight more. The
  parts list's masses (the screws' 125–130 mg and so on, the timing weights'
  93 mg, the verniers' 10.5 mg, the washers') are read as a matched pair's, half
  each (`PM` in `movement.js`; inferred, likely: "Estimated" below). With them at
  their heads' radii, those changes fit a balance of 578 g·mm² (least squares
  over the ten, `I_T2`; each within 2.6 minutes a day of the table). The balance
  is drawn as the restoration video measures it: the rim 3.5 mm tall and 0.6
  thick, the screw heads 3.1 mm across, each screw through the rim to a point
  inside it. Drawn so, it makes 534 g·mm²; `I_REST` (44 g·mm², 8 %) adds the
  difference, so a screw change makes Table II's rate. Read as each one's mass,
  the same table would need 1,157 against a drawing of 731: 37 % that nothing
  measured carries (it was `I_REST`'s 410 until 4 October 2026).
  The hairspring's stiffness follows: I (4π)², about 91 µN·m a radian.
- **Changing the balance changes the pitches, not the rates.** A heavier rim
  or larger screws raise `I₀`; `R.pitch` follows, and a turn stays 40 s and
  2.8 s a day.
- **Check clearances after any change to the balance.** The balance runs in
  the barrel bridge's 17.7 mm cutout, at the bridge's own level. The weights'
  screw tips reach 17.35 mm from the balance axis, and the 0.101 in screws
  17.07 mm. `dyn.py` tests only mid-travel, so also run it with the weights at
  both ends of their travel: call `__mv.userData.R.timing(3,3)`, then
  `(-3,-3)`, after the page loads (`python fine.py --eval "__mv.userData.R.timing(3,3)"` does this). `dyn.py` ignores balance–cock overlaps
  (`IGN`). The cock's body is 22.6 mm from the balance axis (`CK_RP`, measured on 44:02; 17.7, the barrel bridge's circle, until 15 October 2026).
- **`audit.py` lists the weights' screw tips as loose ends.** They stand
  beyond the nuts, as in Fig. 3, and are expected (its `LOOSE` table).
- **The holes.** The rim has 24 tapped holes, 15° apart, numbered 1–13 round
  each half from an arm's end (Fig. 99's numbered block; Table IV): hole 1 is
  the arm's end, where the timing weight's screw goes through the rim into the
  arm, 2 the vernier weight's, inside the rim, 7 the quarter, and 3–12 take the
  balance screws, a pair in the same hole of each half (`R.holeA(h, n)`). Table IV's moves are
  symmetric about hole 7 (3 to 4 as 11 to 10), which puts it at 90° from the
  arm's end; the restoration video (KLUwI2UUCMQ 6:47.5, 6:52.5, the rim fitted
  as an ellipse) shows every hole and screw within 1.5° of a 15° place. Its
  balance carries four pairs, in holes 3, 5, 9 and 12, the model's standard set.
- **Table IV, as data.** `R.T4(hh, n)` gives the change in the temperature
  compensation for a pair at hole n against hole 7, hh its head's height and
  washer in inches, from Table IV's "7 to n" figures, each column fitted to its
  30 printed rows (`invariants.py` checks them to 0.04 s a day; two printed
  figures disagree with their rows, see the comment in `movement.js`). Moving a
  pair keeps the moment of inertia, so only the rate in heat changes. The table
  has no figure for a pair taken out or put in, nor for a head changed where it
  stands, and the panel says so.

### The escapement's amplitude and rate

`makeEsc` works out how far the balance swings and what the escapement does to
the rate from its own geometry, so the Adjuster's bench changes both (`ESC.A`,
`ESC.run`).

- **Amplitude, from the work done each oscillation.** Work is counted in units
  of the hairspring's stiffness k. Released from rest, the escape wheel and the
  train behind it (`JW`, 6.05 g·mm²: every arbor weighed on its drawn solids,
  mechanisms.json, the escape wheel with its pinion and arbor 5.22 and the
  fourth wheel's 0.81 reflected through its pinion; 5.9 until 14 October 2026,
  the fourth wheel estimated) gather speed under the torque w k and chase the
  impulse jewel, already running away from them: at the model's settings the
  tooth lands on it at −2.1°, 19.2° of the balance after the release, running
  at 2.6 times the jewel's speed. The
  strike gives the balance J v_j (v_w − v_j) (29 % of the impulse); then the
  tooth drives the jewel through 12.1° of the wheel, w times that turn less what
  speeding the wheel up with the jewel takes (lost when the next tooth locks).
  Unlocking takes back three things: the locking jewel drawn back against the
  tooth and rubbing on it, dL(tan DRAW + μ)/(1 − μ tan DRAW) of the wheel's
  turn; the detent, lifted against Op. 78's preload and its spring's stiffness
  (`W78`, `hD`, `EB`) all the way the discharge jewel carries it, 1.5 times the
  lift at release (lost as it falls back); and the trip spring (`tsH`, `ET`),
  bent on the return round the jewel's end, its radiused back and then its square acting corner (lost as it flies back). The swing
  loses πA²/Q, Q = πTF/T from the balance's free run-down, so πA²/Q = Wn(A).
  Only w is fitted, so the model's settings give 255°; unlocking then takes
  14 % of the impulse's work, the detent 8 %. Until 11 October 2026 the wheel
  moved as a kinematic gear (`G`, landing 0.6° after release) and the
  springs' shares were fitted (`fD`, `fP`); `tools/dynamics.js`, integrating
  the escapement beat by beat, found both wrong, and now agrees with it.
- **Rate, by Airy's result.** A push at balance angle θ moves the phase by
  −(τ|dθ|/k)·θ/(A²√(A²−θ²)) an oscillation: a push before the dead point gains
  and one after it loses, a resistance the reverse. Summed over the impulse
  and the unlocking, and taken against the model's settings, this is the rate
  in s a day. The escapement's own error at the model's settings (−3.0 s a day:
  impulse −2.5, draw −0.3, detent spring −0.9, trip spring +0.6) is taken up in
  the timing, so it shows as 0.
- **What the settings do.**

  | Setting | Amplitude | Rate | Why |
  |---|---|---|---|
  | Impulse jewel at 184° | 246° | +0.5 s a day | The impulse ends sooner after the dead point (18.0°) |
  | Impulse jewel at 178° | 266° | −0.5 s a day | |
  | Depth of lock 0.17 mm (0.025) | 244° | −1.5 s a day | More resistance before the dead point |
  | Depth of lock 0.20 mm (0.03) | 237° | −2.7 s a day | |
  | Discharge jewel at 262° | 225° | −4.2 s a day | |

  One slider alone keeps the balance above `AMIN`. Several together can bring
  it under, and the bench then refuses the setting.
- **The model's settings are the reference.** There `ESC.A` is exactly 255°
  and the rate exactly 0. Every tool that calls `ESC.state(p)` with the default
  amplitude sees no change. The reference's constants are cached on
  `makeEsc.refs`, by the calibration settings (`EX`, `A`, `TF`, `MU` and the
  bodies' and springs' `I`, `JW`, `W78`, `hD`, `EB`, `ET`, `tsH`).
- **While the train is held,** the balance swings free: it has no escapement
  error and keeps the weights' rate alone.
- **Isochronism** is the escapement's, its rate at another swing
  (`ESC.rateAt`, below), plus the hairspring's own, `HS` s a day for each 10°
  more swing: 0 by default (the spring taken as isochronous), set on the
  Adjuster's bench's last slider. At −0.20 the spring all but cancels the
  escapement's loss at a smaller swing (0.003 s a day at 90% of the torque).
  `tools/escapement.js HS=-0.20` prints it.
- **Not modelled:** friction at the impulse and, in the work, the detent's own
  inertia and bounce (`tools/dynamics.js`: they change the swing by about 1° and the
  rate by about 0.1 s a day). The recoil is drawn (`ESC.state`, since 11 October
  2026) and counts in the work as before.

### The balance's dynamics

The balance's equation of motion, averaged over a swing. The model's clock
still sets the phase (`frac(tSim/0.5)`, so the hands step in half seconds at
every speed); the equation gives the amplitude and the rate.

- **Amplitude.** The escape wheel's torque is `s` times the one the escapement
  is calibrated at. The impulse's work and the locking jewel's draw scale with
  it; the detent and trip springs' work doesn't. In ½A², in units of the
  hairspring's stiffness, a swing gains that work and loses πA²/Q. So A²
  relaxes to `ESC.ampAt(s)²` as exp(−2t/TF), exactly for a steady torque.
  `ampStep` steps it so, at any speed. A² settles as exp(−2t/TF), 34 s.
  Free, with no impulse (the train held), d(A²)/dt = −2A²/TF − 2·EHd(A)/T while the swing still
  passes the trip spring (the detent's and trip spring's work, `ESC.EHd`, lost as each flies
  back: the detent's from where it leaves the jewel, `depart`, its springs' energy and its own kinetic energy), −2A²/TF below it:
  `ESC.freeStep`, in closed form a second at a time. Until 11 October 2026 it fell as
  exp(−t/TF) at every swing.
- **The drive** (`driveNow` in `app.js`). Running, the mainspring through the
  fusee: `R.fs.torque`, 1 at 12 h from full wind, the middle of a day's
  running, falling to nothing over the last 1.2 h as the chain's end pin swings
  round (the train stops about 5 minutes before `RUN_H`, under 0.14 of it).
  The sustaining spring carries it, closed on its banking, so while the key
  turns it drives alone with its banked push, 0.28 of the 12-hour drive,
  falling linearly to nothing as it relaxes over its 16.9° (`R.ssF`; about 18
  minutes at the train's pace, but the swing falls with the push: it falls under
  a turn within the first minute and the train stops after about 6, `tools/sustaining.js`): a wind of half a minute takes the swing from 255° to about 180°
  and it comes back when the key lets go. The
  same push drives the train when the fusee's drive falls faster than the
  spring relaxes (`canDrive` holds the train only when neither drives). Until
  11 October 2026 the drive dropped to 0.8 the moment the key turned, as if
  the spring were weaker than the drive it had been carrying.
- **The spring's pull** (`makeFusee`'s `pull`, `lever`, `torque`). The solved
  spring's pull (`msPull`) at the barrel's turns, times the chain's lever on
  the fusee (its pitch line where it leaves the fusee): with the set-up the
  profile asks for, the torque on the fusee wheel keeps within about 2 % of its
  mean (0.986–1.021) while the chain leaves the fusee, the residual of the solved
  spring's curve against the profile. A going barrel with the same spring
  (`pullB`, its pull falling evenly with time, geared to match at 28 h) would
  vary about 2:1. Until 11 October 2026 the drive took an illustrative pull,
  the profile's even fall made 3 % steeper at each end, on the groove's floor.
- **Rate against swing** (`ESC.rateAt(a, s)`): Airy's sum over the impulse,
  the unlocking and the springs at amplitude a, against the reference.
  A smaller swing feels the escapement's pushes more:

  | Swing | Torque | Rate |
  |---|---|---|
  | 247.5° (1⅜ turns) | 95% | −0.15 s a day |
  | 255° | 100% | 0 |
  | 270° (1½ turns) | 111% | +0.28 s a day |

  Each frame, `escK = 1 + ESC.rateAt(H.amp, drive)/86400` while the train
  runs, so the dip while winding and a jolt show in the rate book.
- **Over a wind.** With the fusee the rate stays within −0.01 to +0.08 s a day
  while the chain leaves the fusee (to 55.1 h; then it falls with the drive);
  with a going barrel, −1.47 to +0.71. The manual's
  isochronism check (Sec. IX: the 12-hour rate against half the 24-hour rate
  at 72½ °F, wound at the start; tolerance 0.50 s, the factory test card of
  No. 3390 reads 0.00) comes to +0.01 s with the fusee and +0.07 s with a
  going barrel. `tools/escapement.js` prints the rate at 1⅜ and 1½ turns.
- **The mainspring's set** (`MSET`; Op. 13, "Check condition and set of
  mainspring"). A spring that has taken a set pulls less all through its run;
  the drive is scaled by 1 − set, so the fusee keeps it level but lower. At
  20% the balance swings 224° and the chronometer loses about 0.7 s a day.
- **The 30-day performance test** (`testCalc`). Each day's rate is the
  model's at the period's temperature: √(I₀/I) from the weights and screws,
  the balance's temperature curve, and the escapement's and hairspring's rate
  averaged over the 24 hours after winding (wound at each daily reading). The
  errors are rounded to the comparator's 0.01 s and the rates read from them,
  as on the card. At the model's settings it passes: regulation 0.06,
  temperature 0.07, 0.07 and 0.00 (the card of No. 3390: 0.08, 0.06, 0.02),
  isochronism 0.01; the split balance fails 90 against 72½ °F (1.46, limit
  0.75), and an eighth of a turn on the timing weights fails regulation. The
  model has no day-to-day scatter, so rating and recovery come out 0.00 (the
  card's real chronometer: 0.03 and 0.06).
- **A jolt** (`jolt` in `app.js`; illustrative). A knock about the staff jerks
  the balance's speed by 0.6 to 1 of its running top speed, either way at
  random. From θ and θ′ the balance goes on at A = √(θ² + (θ′/ω)²). Checked
  under `AMIN`, it sets (stops). Carried past `ESC.TRIP` (a full turn plus the
  angle where the discharge jewel meets the trip spring, 333.2°), the jewel
  comes round and unlocks a second time, so the wheel trips: one extra tooth,
  and the hands jump half a second. The knock also moves the balance's phase,
  to the one θ and θ′/ω give (`knock` in `app.js`): the escape wheel stays on its
  stone, so the next unlocking comes sooner or later, and the dial error shows the
  knock's time error (a few hundredths of a second, more when it nearly sets).
- **Gimbals with inertia** (`gimStep` and `GIM` in `box.js`, the page's and the
  export's; illustrative). The case, with the ring about the ring's pivots, hangs as
  a pendulum below each axis: ψ″ = −ω0²((1 + av/g) sin ψ − (ah/g) cos ψ) − 2ζω0(ψ′ − φ′),
  φ the box's angle. At sea the box rolls and pitches about the ship's axes, taken
  5 m below it (`GIM.RD`, estimated: a chart room above the centre of roll; the U.S. Naval
  Institute's rules of 1882 have the case screwed down amidships, and no source found gives its
  height above the roll axis), so the
  pivots move with it, ah = RD(φ″ cos φ − φ′² sin φ) and av = −RD(φ″ sin φ + φ′² cos φ),
  and the case hangs along the apparent vertical, gravity less the pivots'
  acceleration, not the true one: at the default 7 s and 14° it leans 5.4° against the
  roll at its ends (1.9° at 12 s), within 0.2° of the apparent vertical. A box rolled
  faster than a ship rolls (under 4 s, the distance falling to 0 at 2 s) stands for one
  rocked about its own pivots. The case's own period is 0.7 s (estimated: its weight
  some 15 mm below the pivots, radius of gyration about 45 mm) and ζ is 0.05; near
  0.7 s (the Roll period slider) it swings with the box, stopping 25° off it against
  the ring. A jolt kicks it. `?snap` and reduced motion keep it exactly level, as
  before.
- **Temperature** (`MTE` in `core.js`). The balance's own curvature, on top of
  Table IV's line. The Model 21's balance: the second difference of the
  factory test card of No. 3390 (Sec. IX, p. 68; period means 90 °F −0.02,
  72½ +0.06, 55 0.00 s a day), a gain in the middle of 0.07 s a day against
  both ends. A second card, No. 5580's (Bennett, *NAWCC Bulletin* 356, 2005, Fig. 5:
  90 °F −0.015, 72½ +0.01, 55 −0.18), gains 0.11 in the middle: the same sign
  and size (not used to change `MTE`). The split balance: the essay's illustrative middle temperature
  error, compensated near 45 and 90 °F and gaining up to 1.5 s a day between.
  The rate panel's chart gives the Navy test's three temperature compensation
  figures against their limits (0.75, 0.75, 1.20 s a day). The split rim curls
  (`R.balCurl`): a two-layer strip's curvature changes by 1.5 Δα ΔT / h,
  about 3.9 × 10⁻⁶ /mm a °F for brass on steel 1.6 mm thick. A point φ from the
  fixed end then comes in by R²Δκ(1 − cos φ), 0.05 mm at the free end for
  27½ °F, drawn 20 times as far (`R.CURLX`).

### Checked in time: the escapement, strength and an error budget

Three Node tools (no browser) check the averaged physics above against a model
that doesn't average, and ask the questions it can't: would it work, would it
fall apart, would it keep time. They fail on a disagreement with the model and
on what would stop the chronometer.

- **`tools/dynamics.js`, the escapement in time.** The balance, the escape
  wheel (the fourth wheel's inertia reflected onto it) and the detent as
  bodies, integrated through every contact (RK4, each contact found by
  bisection), on the contact geometry worked out apart from makeEsc's (the two
  agree to 0.01 µm). The integrator is checked against a damped oscillator kicked
  at its dead point (−ζ²/2). Against makeEsc, with its springs and a massless
  detent: the swing 255.5° (255°), the tooth landing 18.7° after the release
  (18.9°; 16.2° and 16.3° at the old spring's torque, until 12 October 2026), the detent falling back at −12.6° (−12.6°), the escapement's own rate
  within 0.1 s a day, its isochronism within 0.01 s a day over the manual's
  swing. With the detent's own inertia (2.609 g·mm², from the drawn pieces) and
  its bounce on the stop button, the swing 1.3° less and the rate 0.1 s a day.
  - *What it found* (11 October 2026), now in makeEsc: the wheel, released from
    rest, catches the impulse jewel well after the release (it was taken as a
    kinematic gear landing 0.6° after it), and strikes it; the discharge jewel's
    square end held both springs' tips across its whole width (overall about
    38°, past Op. 87: the end was then stoned to a half round and the jewel's
    settings re-chosen to the manual's figures; since 12 October 2026 only its
    back is radiused, as the British Museum's Model 21 is described, `rB`); the detent's work is Op. 78's preload (the weight less the spring's bend over 0.005 in, since 14 October 2026)
    over its whole lift, not a fitted share; and 255° with those wants a balance
    running down in 52 s (Q 327), as the energy budget and the balance's parts
    allowed (`TF` was 34); 68 s (Q 427) from 12 October 2026, with the videos' thinner mainspring and the endstone's friction measured; 67 s (Q 421) since 14 October 2026, with Op. 78's preload less the spring's bend.
  - *The detent's return* (OPEN-QUESTIONS.md 2): makeEsc draws its fall as dynamics.js
    integrates it (off the square acting corner at about −18°, falling back onto the
    jewel's end and carried on it; leaving it for the last time at −13.06°, first on its stop
    at −10.26°; dynamics.js the same). The detent is back on its stop
    about 10 ms before the next tooth reaches the stone, from half to twice the
    drawn spring's stiffness, at half or 1.5 times Op. 78's preload, with a dead
    or a bouncy stop, and even with no preload at all.
  - *Starting and stopping.* Twisted to 67° (the page's twist from rest, box.js `TWIST`), the balance comes within 2° of its
    swing in about a minute and a half (93.5 s; the averaged model 124 s); the least drive that keeps it going is about 12 % of
    the calibrated torque, the balance swinging about 41° (makeEsc: 13 %, at its `AMIN`, 40.6°).
  - *Run down with the train held* (no torque): from 150°, 117.4° after 10 s and 85.0° after 20
    (makeEsc's `freeStep` 117.1° and 84.7°; the air and pivots alone would leave 129.5° and 111.8°), 48.8° after 30 s (48.4°): within 0.7° at 5, 10, 20, 30 and 45 s
    (dynamics.js's check, within 2°). Until 12 October 2026 `freeStep` took a massless detent's loss (`ESC.EH`, the springs' energy where the jewel releases it), and ran
    2.8° behind the integration at 30 s: the drawn detent (then 2.67 g·mm²) leaves the jewel earlier, still moving, and loses about 9 % more (`ESC.EHd`).
  - *Knocks and the sea.* A twist about the staff upsets the beat at about
    29 rad/s in 2 ms (it gains a beat); a blow across the plate frees the wheel
    at about 40 g over 3 ms, 112 g over 0.5 ms (the detent isn't poised about
    its flexure: a steady 18 g lifts it off its stop and 34 g frees the wheel; 55 g, 140 g and 47 g
    before the detent was rebuilt to its measured lengths, 20 October 2026: shorter and lighter, and Op. 78's
    preload, 0.56 g at the jewel, less). Yaw of ±10° and ±0.3 g
    sideways at the period of a roll move the rate by under 0.01 s a day.
- **`tools/strength.js`, would it fall apart.** Every loaded part fully wound,
  against its material's published range (the margin at both ends): the train's
  teeth by Lewis (each stage lossless), the escape wheel's tooth struck at the
  jewel's speed, the pivots and the fusee's bushing, the chain and its end
  fittings at the chain's 48 N, the mainspring, hairspring, detent spring (by
  Goodman, preload and whole lift) and trip spring, and the knocks that bend a
  pivot (the balance staff's at about 700–1,400 g). Nothing fails. The thinnest
  margins: the fusee wheel's teeth (1.5–2.2), the fusee bushing's pressure
  (1.0–3.6) and the mainspring, which works near its limit, as a mainspring does
  (it fails by taking a set).
- **`tools/errorbudget.js`, would it keep time.** As made: makeEsc with a
  maker's tolerances on every escapement setting (Monte Carlo, estimated
  tolerances): about 81 % run as made and 64 % swing inside the manual's band (70 % with the parts list's spring and `TF` 52 s),
  about a fifth meet every adjustment figure before adjusting (overall, drop
  and let-off are the usual misses: the adjuster's work, Ops. 84–97). At sea:
  60 days from a winter port into the tropics, rated over 10 days in port, each
  day's rate the sum of the test card's temperature curve, scatter and drift
  (calibrated so the simulated Navy test reads as No. 3390's card), the
  barometer through the air's share of the damping and the time-domain
  isochronism, the oil thickening (estimated) and heavy weather from
  dynamics.js. A chronometer like No. 3390 carries about 1.4 s after a month (a
  third of a mile of longitude on the equator), 4 s after two; one that passes
  the Navy's test only half the time, about 15 s and 38 s. Drift and the
  temperature curve dominate. The empirical terms are the card's, not physics:
  the model has no other source for a chronometer's day-to-day scatter.
- **`tools/gearing.js`, would the train run, made on a CNC.** The four meshes of
  the going train worked tooth by tooth on the outlines the model draws (core.js
  `gearOutline`, BS 978's cycloidal teeth, sampled finer): the wheel turned
  through a pitch, the pinion turned back against its load until the outlines
  touch (found to well under a micrometre), and from the contact's normal and
  slip the torque the pinion receives, with the teeth's friction at 0.10 and
  0.20. At the drawn centres every mesh runs without a drop, about a fifth of
  the action before the line of centres, 95–98 % on average and 89–91 % at the
  worst instant at 0.20. Then the train in time: the four stages' ratios
  multiplied as their wheels turn, the swing following them through the
  escapement's own equation (A² towards `ampAt(drive)²`, `TF`): 250–259° at
  0.20, inside the manual's band, and the time wanders under 0.1 ms about the
  mean rate (the ripple repeats daily, so a navigator's rate takes it in).
  Last, each mesh's depthing window (it jams on the close side when the wheel's
  tips reach the pinion's root, 37–58 µm; on the wide side the ripple takes the
  swing out of the band, or nothing does to a module wider), and from it the
  hole positions a CNC must hold aimed at the drawn centres: ±13 µm (the
  fourth wheel's mesh, the pivots' 10 µm shake taken off), bored, not drilled.
  `--write` writes `tools/gearing.json`, which `thermal.js` reads.
- **`tools/thermal.js`, does it still fit at 40 and 100 °F.** Brass holds
  (plates, bridges, pillars, wheels), steel turns and locks (pinions, arbors,
  escape wheel, roller, detent), and brass grows 6–10 × 10⁻⁶ a °C more. The
  depths change by the pinion's radius times that (under 0.5 µm: the wheels and
  their holes are both brass); the endshake over the train's 16.8 mm span
  −2.6 and +3.0 µm (set it at 28–73 µm at 20 °C to stay in Ops. 15, 69 and
  74's 25–76 µm); the escapement's centre distance and depth of lock under
  2 µm, which moves lock and drop a tenth of a degree and its rate a few
  hundredths of a second a day. The temperature error is the balance's and its
  spring's alone, which is measured on the bench, not worked out.
- **`tools/fea.py`, do the plates and bridges hold the arbors.** Finite
  elements on the six parts that hold pivots (the pillar plate, the train,
  barrel, escape and lower bridges, and the bridge on the plate's dial side
  that carries the third's and fourth's lower jewels): each part's solid cut
  into voxel bricks (trilinear, about 0.25–0.55 mm), brass at 100 GPa, solved
  by multigrid; the solver comes within 1.4 % of a cantilever's textbook
  deflection. Loaded fully wound (the chain's 41 N along its drums' tangent at
  the fusee's top turn, three quarters of it on the barrel bridge) and run down
  (21 N on its bottom turn), with every mesh's tooth force; each part held at
  its screws, the parts put together by superposition. No pivot hole moves
  more than 0.4 µm, no arbor leans more than 13 µrad, and no mesh's depth
  changes by more than 0.02 µm, a thousandth of the ±13 µm the holes are given;
  the most stress is 13 MPa, at a voxel's corner on the barrel bridge, against
  brass's 300. The plates and bridges are many times stiffer than they need to
  be: the hole positions and the depthing are what the maker must hold.
- **`tools/hairspring-fe.js`, the hairspring by another method.** The designed
  spring (hairspring.js) solved again as 1,359 co-rotational beam elements
  (Crisfield; the strip extensible, 0.221 mm thick), the stud clamped and the
  collet turned to ±300° in steps by Newton's method, against the shooting
  elastica it was designed with: the couple's departure from linear agrees to
  4 in 10⁷, the force on the pivots at 270° (1.5 × 10⁻³ of couple / R) to two
  figures, and the spring's own isochronism, 0.12 s a day over the manual's
  band, to 0.003 s a day.
- **`tools/estimates.js`, the estimates swept** (14 October 2026). The design
  values no source settles, each over the range its sources allow, the bench's
  correction applied: with the strip the run-down test chooses, a balance
  running down in 40-200 s swings 255° and stays isochronous to 0.35 s a day
  over the band (unadjusted, the drawn strip would swing it 232-401°); every
  detent spring the ring test passes (0.072-0.110 mm, mapped every 0.005 mm:
  outside it a held tooth's stone rings past half the lock, and at 0.15 a
  tooth gets past) runs in the band with the set-up turned; every back radius
  of the discharge jewel from 0.066 to 0.158 mm is brought to the manual's
  figures by the screws and the trip spring's tip; the sustaining spring's band
  ±0.02, lobes ±15° and gap 18-22° keep the balance over a turn 6-11 minutes;
  and the hairspring's upper curve formed 0.3 mm off its drawing leaves the
  pivots less force than plain ramps did. The report's section 12.
- **`tools/bench.js` and `tools/rating.py`, a made chronometer tested.** The
  analysis can't say a chronometer made to the model keeps time; the bench
  can. bench.js writes the tests (the build book's last chapter, and each on
  its part's sheet) with what each must read from the model's own figures: the
  balance's free run-down, the train held (since 14 October 2026: the time its
  swing takes to halve, 35 s for the model's `TF` 67 s, chooses the strip from a
  table makeEsc works out, 23-71 s wanting 1.06-0.78 times the drawn, since the
  swing goes as drive times damping and no source gives the damping within a
  factor of two; benchcheck.py scales the strip's and torque's bands with it), the
  mainspring 0.74–0.86 N·m fully wound for the model's balance (tolerances.js), the fusee's torque
  within −5 to +11 % at every half turn (the swing's band through `ampAt`), the
  centres to ±13 µm (gearing.js), endshake 28–73 µm at 20 °C (thermal.js), the
  balance 7,200 an hour, the escapement's and the swing's figures (the
  manual's), and the Navy's test. rating.py works the maker's log of daily
  comparisons with a time signal as the test card does, fits its rate against
  time and temperature, backtests a ten-day rate carried on, and projects what
  a navigator would be out after 10, 30 and 60 days; acoustic.py takes a
  recording of the made movement for its swing.
  benchcheck.py judges the measurements themselves (a JSON file it makes to
  fill in): each against bench.js's figures, and where one fails, what to do:
  the set-up turns that bring the mainspring into its band or even the fusee
  (from the curve's slope and the fusee's 1.96:1 profile), the timing weights
  or the millimetres to take at the stud, the manual's operation that sets an
  escapement figure.

- **`tools/deviations.js`, the build's two changes.** Nothing the checks
  found needs changing for the chronometer to work; two changes, with 1950s
  materials, make it easier to make and steadier to keep, each on its part's
  card as the build's with the Model 21's original beside it and a button back
  (the link keeps `orig=mainspring,hairspring` for those set back; the 3D model
  stays the Model 21). The mainspring in Nivaflex 45/5 (Straumann, patented
  1948): the same torque from a strip 0.386 mm thick (E 220 GPa against carbon
  steel's 207), stressed 2,309 MPa fully wound, a margin of 1.30 on its
  3,000 N/mm² against carbon steel's 1.13–1.17, and it doesn't set, rust or
  magnetize. The hairspring in Nivarox (Straumann, 1933), graded for a
  monometallic balance, in place of Elinvar heat-treated to the balance; the
  balance kept as the Model 21's, a stainless rim on an Invar arm, so Table
  IV's screw moves (Op. 8) still trim the temperature error.
- **The balance's temperature compensation, from Table IV.** Table IV's forty
  figures (a pair moved from the quarter, hole 7, to holes 8–12 under each
  head) read as the rim's bending: the rim grows as stainless, the arm's ends
  hold it to Invar's growth, so it is pulled in at the arm and bulges at the
  quarter, as a thin ring under two opposite forces does (its Fourier series,
  which gives Roark's 0.1366/0.1488 for its two diameters). One constant
  fitted reproduces all forty within 0.20 s a day rms, the quarter bulging
  0.48 µm a °C past the arm's ends: the rim growing 17.4 × 10⁻⁶ a °C more
  than the arm, against 14.4–16.3 for austenitic stainless on Invar. The
  manual's table, made on real balances, so agrees with the model's stainless
  rim and Invar arm. Read so, the balance with its standard screws expands as
  a 15.1–17.0 × 10⁻⁶ a °C metal would, and the spring's thermoelastic
  coefficient must be +0.1 to +13.0 × 10⁻⁶ a °C (Nivarox's own expansion,
  7–10, estimated, makes most of the spread); a beryllium-bronze balance needs
  +4 to +14, so Nivarox's grade for monometallic balances suits it. Moving the
  standard pairs among holes 3–12 reaches −6.45 to +4.61 s a day between 55
  and 90 °F, in steps of 0.42 s or less, taking up a spring −5.5 to
  +7.7 × 10⁻⁶ a °C off its mark. A one-piece Glucydur balance (the build's
  until 13 October 2026) has nothing to trim and would need the spring held to
  ±1.43, a seventh of the ±10 a bought spring holds (EP3502288A1); the bench's
  temperature test (`bench.js`, the rate) says which pairs to move.
- **Every mechanism, each in turn (13 October 2026).** Seven analyses take the
  rest of the movement (the build-verification report's section 11), on the
  geometry `tools/mechanisms.py` reads off the built model (each pawl's contact
  on its ratchet, the arbors' inertias from their solids). `overwind.js`: a
  strong hand on the key's paddle (1.06 N·m, from finger-torque studies) wound
  against the stop breaks nothing once the stop-bar and stud are hardened (soft,
  the bar bends at 1.59 N·m, about half as much again as a strong hand's: a gloved
  hand or a longer bow); turned the wrong way, its torque goes into
  the train the escapement holds still, and 0.20 N·m bends the fusee wheel's
  teeth (their face where they overlap the centre pinion's leaves, 1.40 mm; 0.11 on
  the 1.2 mm teeth drawn until 18 October 2026): so the build's winding key has a ratchet in its pipe (deviation 3).
  `ratchets.js`: the winding pawls are drawn in by their load (12.5°, past the
  friction angle), the setup click at 4.5° (friction and its spring hold it;
  its ratchet's faces drawn undercut 4.5°, as measured, since 14 October 2026: 8.7°),
  the sustaining pawl as traced meets a tooth's tip corner with its side and is
  drawn in at 32.8° once its end is fitted to the face; every part at least 1.9
  times short of its material's weak end; the winding pawls' springs need at
  least 0.07 mm of set to follow the fusee down when the key lets go (0.08 until
  15 October 2026, when the springs' feet moved to the screws' measured places
  and the longer spring came out 17.9 mm long, not 18.4).
  `sustaining.js`: the split ring, weaker than the drive and banked in running
  (since 14 October 2026), pushes 0.28 of the drive from its band as traced on the
  video, 0.96 mm high and 1.3-1.9 wide, over its 17.4° gap (0.33 from the automated trace, 0.22 over the 12.5° first read, 18 October 2026; 0.82 from a designed 1.45 mm band until 17 October 2026, 0.88 from 1.25 until 16 October), keeps the
  chronometer running 10.5 minutes (the manual's five to ten read as the least it gives: over ten is reported), its swing under a turn within the first, and a wind costs microseconds. `motionwork.js`: the motion
  work and wind indicator meshes run, the hour hand stands up to 3.8 minutes
  off in their backlash, and the cannon pinion's friction belongs between 1.4
  and 37 mN·m (about 18 g hung 40 mm out on the minute hand). `wear.js`: well
  oiled every contact keeps its tolerance 26 years and more; the balance
  staff's pivot ends and the escape arbor's pivots go first, a few years poorly
  oiled, so the oil's life sets the overhaul. `traindyn.js`: the train's inertia
  at the escape wheel from the solids is 6.05 g·mm², which dynamics.js and
  makeEsc take since 14 October 2026 (5.88 before, the fourth wheel estimated;
  the escape wheel's calibrated torque 62.4 → 62.8 µN·m), its
  modes lie in the kilohertz, and the strike on the jewel rebounds the escape
  mesh inside its backlash. `montecarlo.js`: made to a maker's tolerances, all
  at once, 98.8 % work as made (1.1 % swing out of the band, 0.1 % have a
  winding pawl's spring under its 0.07 mm); the bench's tests, applied as a
  maker would by bench.json's figures, catch them all: the swing test has the
  set-up turned (Op. 13), the pawls' test bends a short spring back to the aim
  (it catches 5 of 2,000, 2 of which would have failed), the depths test
  re-bushes a mesh too close (5, none of which would have jammed), and every
  movement works after the bench. A movement still failing that no test
  catches fails the check. `bench.js` carries four tests from them.
- **`tools/tripping.js`, does a tooth ever get past the stone.** The classic
  failure of a detent escapement at sea is tripping: the wheel lets a tooth go
  that the balance didn't unlock, and the chronometer gains. dynamics.js takes
  the detent as one rigid body on a hinge; this takes it as a plane frame of
  37 beam elements from the drawn pieces (the two-strip spring, the blade, the
  arm to the horn and the trip spring bending and stretching, the cross-piece,
  block and horn rigid; mass and inertia within 1 % of dynamics.js's), its
  modes carried in time with the balance and the wheel through elastic
  contacts (the jewel's own outline on the trip spring's tip, the trip spring
  on the horn, the blade on its button, the tooth on the stone and on the
  impulse jewel), Op. 78's preload (the weight lifting the button's middle
  0.005 in, since 14 October 2026). Made rigid and hinged at Ft it runs as
  dynamics.js does (swing 0.4°, rate 0.1 s a day, release, fall and landing
  within 0.1°). As drawn: the spring bends about its middle, so the detent is
  38 % stiffer at the stone than the hinge (first mode 148 Hz, not 122, with
  the spring at its measured 3.30 mm; 137 and 112 at 3.82); a held
  tooth's stone lifts at most 14.5 % of the depth of lock (127 µm at the stone,
  where makeEsc's recoil peaks: past it the tooth's pressure on the stone's
  rounded edge throws the stone off; the tip is free at 131 µm, makeEsc's
  release keeping 157 as room to spare), at most 47 % over the estimates varied (every contact four times stiffer)
  (the detent's damping, every contact's restitution and stiffness, the blade
  half as stiff); no tooth gets past until the swing reaches 337°, where the
  discharge jewel comes round and unlocks again in the same swing (makeEsc's
  TRIP, 333°, is where it first touches); a blow across the plate of 42 g over
  3 ms or 113 g over 0.5 ms, or a twist of 19 rad/s, lets a tooth go, within
  7 % of the rigid detent's (50 g and 125 g with the detent as drawn before 20 October 2026, its lighter measured
  detent less preloaded; 61 g and 138 g until 14 October 2026, with the
  whole 0.770 g as the preload). The estimates are the contacts' restitution
  (0.3, 0 at the jewels) and the detent's damping (Q 100). For the bench
  (`--write`, `tools/tripping.json`): run at shallower locks, the stone's
  largest lift while held stays at 25-50 µm whatever the depth, so the lock's
  floor is 5.58° (the margin under two below it; the drop gone at 3.95°, a tooth
  past at 3.5°; 5°, 3.4° and 2.9° before 20 October 2026), and the blow that trips it hardly changes with
  the lock: against knocks it is Op. 78's preload that holds. Clamped by its
  foot and flicked, the detent rings at 148 Hz as drawn, the pitch rising
  nearly as its spring's thickness to the 1.5 (75-194 Hz for 0.05-0.095 mm;
  131 Hz and 120-222 Hz for 0.072-0.110 at the 3.82 mm drawn before 20 October 2026;
  thinner springs ring more after each lock, and from 0.12 mm, Op. 78's
  0.005 in leaving little preload, the stone's ringing uses over half the
  depth of lock), which makes a phone's recording
  a measure of the spring's section no source gives: bench.js's test
  "The detent rings", benchcheck.py `--ring`. dynamics.js now counts a second
  unlocking in one swing as a trip (it was booked as a beat).
- **`tools/gimbals.js` and `tools/massprops.py`, the box and gimbals in a
  seaway.** The case with the movement weighs 1,250 g on the model (every solid
  at its material's density) and the gimbal ring 151 g; as drawn the case's
  centre of gravity lies 9.9 mm under its pivots and 0.1 mm to one side, so
  the drawn pivots are nearly level (it would hang 1° out of level), and the
  manual levels a chronometer by its case brackets and straps (p. 13), as the
  analysis does. Levelled, the case swings in 0.67 s on its pivots and 0.77 s
  with the ring (the page's estimate, 0.7 s, holds), far from a ship's roll
  (10-30 s) and 34 % clear of the balance's 0.5 s beat, which can't set it
  swinging (a balance 2 µm out of poise moves it a fraction of a second of
  arc). In a merchant ship's seas, up to NORDFORSK's operability limit (0.12 g
  athwartships), the case leans up to 10° from the true vertical but stays
  within 0.4° of the apparent, and the rate moves 0.006 s a day. Since the
  gimbal pivots were measured (20 October 2026: 92.9 over the box's bottom,
  12.9 higher than drawn before) nothing in the drawn box stops the case, which
  the manual has turned over in the ring to wind a run-down chronometer (Sec.
  III, "Slowly invert the instrument"), and the ring meets the box only at 63.5°
  and 73.5°: in none of the seas, a small vessel's quick roll and a storm among
  them, does the case reach a stop (the rate moves 0.17 s a day at most while
  the small vessel's roll lasts). Before then the case's bottom met the felt at
  29.5°, and beyond NORDFORSK's limit each blow nudged the balance's phase by
  0.04-0.16 ms; the ring weighed 140 g, with smaller nuts. Until 18
  October 2026 the case was weighed with the Laid out view's schematic plates
  in it (1,662 g, its centre of gravity 7.8 mm off the pivots' line: 0.72 and
  0.68 s, 35° out of level as drawn); `massprops-check.js` leaves them out.
- **`tools/mainspring_friction.py`, the mainspring's coil friction.** On the
  solved spring, the coils' slip followed from state to state and the packed
  coils' pressure by the ring equations of a packed spiral: over the fusee's
  turns (14.39 to 19.11) the coils take 2.6 % of the spring's work running (2.1-4.2 % at
  friction 0.08-0.16), winding 5.2 % more than running gives (2.0 % and 4.0 % until the chain
  was drawn at its measured size, 20 October 2026); under 1 % in
  the middle of the wind, steep in the last half turn before coil-bound.
  Mainsprings measure running 10-20 % under winding (ICMFF9; the strip's edges
  and its steel too): physics.js now takes the spring's losses between the two
  (it had a published 5-15 %). The model's spring, fully wound, is 0.24 turn
  from coil-bound (0.60 until the chain was drawn at its measured size, 20 October 2026) (`mainspring.py --bound` solves it to 0.05 turn), so
  running the fusee wheel gets 83.1 % of its frictionless torque at full wind, and set up as
  the page sets it 6 % of the wind (about 3.2 of its 56 hours) drives outside the bench's band
  (`mainspring_friction.py`, 25 October 2026); with 0.60 turn of room, until 20 October 2026,
  it got 95.3 % and the swing started at 248°, in the manual's band all through the wind.
  Packed 0.01 apart (until 12 October 2026) it had 0.33 turn (0.13 by the
  quarter-turn table), 78.5 %, the swing from 225° and under the band for
  about 6 hours after winding, which no set-up mended. A spring wants half a
  turn of room (Britten; bench.js's mainspring test counts it). The build's
  Nivaflex strip, 0.386 mm (`--nivaflex`: solved by mainspring.py beside the
  model's spring, set up by the page's fusee rule), has 0.79 turn: 97.1 %
  fully wound, the swing from 251° (the report's section 10). The
  sources' proportions solved in the model's barrel (variants:
  `MC_MS_T`/`_L`/`_RA`/`_GAP`/`_TAG`, `mainspring_friction.py --variants`):
  the model packed its coils at 1/40.3 of the inside radius, coarser than the
  videos' 1/41.0-1/43.7 (their pitch taken as the bare strip and a 0.01 film
  added: corrected 12 October 2026); at the videos' pitch it has 0.60 turn,
  but on the core's mean reading (r 5.2) 0.20, and in the British Museum's
  proportions 0.30 (OPEN-QUESTIONS.md 1).
- **The report**, `verification/build-verification/index.html` (open the
  file; `build_report.py` rebuilds it): the process, figures, sources and
  scripts of these checks, the earlier ones' output beside them. The site
  carries it at `/verification/build-verification/` (the root `build.py` copies
  it), linked from About and the essay.

### The whole transmission in time

`tools/hamilton_transmission.js` (19 October 2026) runs every part that moves,
from the mainspring to the escape wheel and the hands, as one system in time:
the Wempe's `wempe_transmission.js` (its README's "Physics: the transmission")
on the Model 21's own parts. Each part is a body, its inertia weighed on the
model's solids (`mechanisms.json`), joined by the element a real movement has,
none linearised: the mainspring through the fusee (`mainspring_friction.json`'s
fusee table: the drum's turns and the torque on the fusee arbor, frictionless
and running, every quarter turn; the chain's lever on the fusee is the drum's
radius times the drum's turn for the fusee's, 7.50 mm fully wound to 14.53 at
8.5 turns), its coils' friction a stick-slip element (winding takes as much
more as running gives less); the chain in tension only, going slack, its
polygon on both drums; the two winding pawls and the sustaining pawl as bodies
on their pivots under their springs (`ratchets.js`), riding the teeth and
catching a face only when down; the sustaining spring (`sustaining.js`'s
stiffness, 0.36 N·m a radian over 16.9°) **banked in running**, where the
Wempe's maintaining spring runs open; every mesh tooth by tooth on the model's
own outlines (`gearing.js`'s `mesh`: the train, the motion work and the wind
indicator); the cannon pinion's friction fit (`motionwork.js`'s window); the
Model 21's plain key on the fusee's square (no one-way key: that is the
build's deviation); the stop-bar on its stud (`overwind.js`). The escapement is
`dynamics.js`'s own, its escape wheel driven by the train's last mesh each step.

The drive: makeEsc is calibrated at 255° on the page's 12-hour drive, and the
solved spring through the train gives the escape wheel 1.62 times that
(`physics.js`'s budget gap, kept open by the owner's choice). The runs that
drive the escapement take the mainspring at the page's level (×0.607); the
winds and the stop take its own torque, and a beat's peaks are judged as their
factor over running times `strength.js`'s fully wound load.

What it finds:

- **Statically** the spring stays on its bank from full wind to run down (at
  least 1.04° closed past it), and the train passes 0.80 of the fusee's torque
  to the escape wheel (`physics.js`'s parts give 0.69-0.87). The chain's
  polygon and the meshes' ripple move the swing over a run between 249° and
  269° (smooth 253-265°), and the time wanders 0.2 ms within a day.
- **The modes**: the lowest, 192 Hz, is the barrel and fusee on the chain; the
  train's run from 2.9 to 21 kHz: nothing near the beat.
- **A beat** at 12 h, the train on its meshes against the same escapement on a
  rigid train: every beat taken; an impulse gives the balance 2.6 % more work
  (the meshes give back some of the wheel's landing and start), worth +3.6° of
  swing and +0.05 s a day: the rigid train `dynamics.js` and makeEsc take reads
  the swing low by about that (the check holds it within 8° and 0.5 s a day,
  the Wempe's tolerance). The escape pinion's mesh takes 27 times its running
  load as the wheel lands on its stone (1.4 N; 2.9 N on the fully wound drive,
  margin 2.2 on brass's endurance) and lets go 1.4 % of the time; the other
  meshes never let go. The seconds hand overshoots 19″ of arc; the cannon
  pinion doesn't slip; the sustaining spring never leaves its bank.
- **Winding**: the key put on, the sustaining ratchet falls 1.5° back onto its
  pawl; the hand needs 0.41 N·m. Eased back, the pawls catch with at most
  73 N each (margin 4.4 on the hardened ratchet), the chain at most 59 N. **Let
  go outright** (the fingers off the plain key, the fusee and barrel flung
  forward up to a tooth, 10°) the blow closes the sustaining spring 5° past its
  bank: the pawls catch with 273 N, the fusee wheel's teeth take 80 N (728 MPa:
  past brass's yield), the chain snatches to 107 N (past its weakest part, the
  hook's bearing on the barrel's brass wall, 76-113 N), the sustaining ratchet
  is thrown back onto its pawl with 60 N. Judged as a misuse, as the Wempe's
  outright let-go is: the key should be eased back to the pawls. The result
  rests on the estimated bank stiffness (×0.25 to ×4: the fusee wheel's teeth
  55-137 N) and the chain's (37-253 N/mm: 66-83 N).
- **The stop**: wound into it at a turn a second and forced by a strong hand
  (1.06 N·m), 57 N on the stud (the stop-bar's end 193 MPa), the chain 54 N.
- **The motion work**: the hour hand's play 3.9 minutes of time; the wind
  indicator's 0.66° (7 minutes of its 56 hours).

Estimated (no source gives them): the sustaining spring's bank stiffness (40
times its own), the chain's stiffness (from its plates' sections and rivets
over its span and lead-in), the pawls' faces (10 and 5 kN/mm), the winding
pawls' springs' set (0.2 mm), the cannon pinion's grip, the key's inertia and
its square's stiffness, the wind indicator's inertia, the motion work's faces
and bores, the contacts' damping. `hamilton_transmission_trace.js` traces the
beat, the two let-gos and the stop in the Wempe trace's format for the
motion-3d pipeline (`tools/r_motion3d/hamilton/trace_last.js`, ignored).

### Checked against real chronometers

The tools above check the model against itself and against the manual's
figures: parity, not proof. Two tests (11 October 2026) compare it with
recordings of real, running Model 21s it was never fitted to (References/VIDEOS.md,
Measurements and Methods; the recordings stay outside the repository, so `ci.py`
can't run them).

- **`tools/acoustic.py`, the clicks inside a beat.** The beats of a recording
  averaged (aligned by cross-correlation, speech and handling rejected), the
  onsets found on the 4-12 kHz envelope with their spread over bootstrap
  resamples, and paired one to one with `dynamics.js`'s events (unlocking,
  release, detent landing, strike, lock; on the return swing the trip spring
  met and coming clear), the swing the free parameter; then the beat error too.
  The corrected escapement, as it stands (14 October 2026), puts the strike 7.7 ms
  after the unlocking and the lock 7.6 ms after the strike at 255°; the old one
  (before 11 October, its wheel kinematic) 2.1 and 12.9. The corrected unlocking to
  strike hardly changes with the swing (7.3-7.7 ms from 200° to 255°: the wheel's
  chase), the old one's is a quarter of it, so hearing all three tells the models
  apart. On 11 October, before the detent's preload, the run-down and the train's
  inertia changed, they were 7.2 and 8.5 ms; the readings below are on the current
  model, the 11 October ones in brackets.
  - `s7VW3RiJ97E` (the cleanest): **about 205°** (202°, 187-207 over resamples;
    with the beat error free 207°, 203-212, 11° out of beat; 212° before), the
    unlocking, strike, lock and the trip spring met paired at chi² 2.4; single
    intervals read 188-220°. The old model can't place its strike 2 ms after an
    unlocking that is 8.8 ms before the loudest click: its best leaves the loudest
    click unexplained.
  - `We1dLNXiBj0`, a balance started by hand at 0:55 (below): read in 6 s
    stretches, from 1:23 to 2:05 three clicks paired as the unlocking (or the
    release), the strike and the lock, the strike-to-lock interval falling from
    10.2 to 7.5 ms as the swing builds, **read as 198-259°** (217-286° before); the
    steady stretch after it (`--from 2:08`, 93 beats): strike to lock 6.36 ms,
    299°, and the return swing's own clicks, the trip spring met to clear, 5.88 ms,
    324° (306° at one sigma), the clear to the next strike 317°: **about 300-320°
    running** (all four fitted at once 316°; about 295° before).
  - `xDKFZaY88cM` (a reverberant room, an edited video): roughly 150-200°;
    `XJQCgMV_GA8` (13 s of sound) and `FpolZSipVmQ`: inconclusive.
- **`tools/swing.py`, the swing on video.** Only `We1dLNXiBj0` shows the balance
  long enough, through the plate's cutouts, and it shows a start: let go from a
  twist at 0:55.2, **256 ± 9° at 2:03.4** (four readings, 244-267°, a screw hole
  apart; 267° the likeliest), still rising about 1°/s.
- **Do they agree?** On the current model, through the start the sound's
  strike-to-lock reading follows the video within 2-11° (198-255° against 196-252°
  on its middle reading, 1:23-1:59; on the 11 October model it read 15-30° high,
  which looked like a strike-to-lock arc 6 % too long), and the steady 299-324°
  sits at and above the video's extrapolated 280-311°. So the two independent
  tests agree within their uncertainties.
- **What they say about the model.** (1) The corrected escapement's timing is what a
  real Model 21 does: the wheel catches the impulse jewel 7-9 ms after the unlocking,
  not 2 ms, and the intervals follow the swing as `dynamics.js` has them; the old
  kinematic wheel is ruled out. (2) Real swings differ from unit to unit and with the
  state of the movement: about 205° and about 300-320° on two movements, around the manual's
  247.5-270° and the model's 255°. (3) The return swing's clicks sit a few
  milliseconds off where an in-beat balance puts them, differently in each
  recording: each movement's beat error (5-12°), fitted as such; so the sound
  doesn't test the trip spring's own geometry. (4) The balance's free run-down: the
  start builds up far more slowly than the model's `TF` allows. Run in
  `dynamics.js` (`tools/startup.js`), the model's 67 s (since 14 October 2026; 68 from 12 October 2026: the
  videos' mainspring and the endstone's friction measured; the train's measured
  inertia since 14 October 2026) misses the video's build-up by 11.5-12.2° rms at its
  best drive (85-100 % of the calibrated torque; 52 s 14.5-16.7°); it comes within
  6-7° from TF 120 s (Q 750 and more, the drive 70-80 %), within twice the best fit's
  rms (2.8°) from 160 s, and fits best at 260-320 s with 60-70 % of the drive, settling
  at 304-320°; the fit gives no upper bound. That is past the 64-113 s the balance's
  parts give in `physics.js` (32-62 s before the endstone was measured):
  OPEN-QUESTIONS.md. The model's `TF` comes from its spring and train, not from this
  start: one movement, started by hand, and its absolute swing known to a screw hole.
  (5) Why the start is slow (14 October 2026; `startup.js --chase`, a few seconds).
  The clicks through the start, read on the video's swing instead of the model's
  timing (the first click the discharge jewel meeting the trip spring, -26.8°), put
  the strike at -8.6° at 196° of swing and about -6.5° from 217° to 252°: it moves
  1.9° over 56° of swing. The model's tooth lands where they do up to 217° (within
  0.4°), then later and later (-2.4° at 252°: 6.2° over the same swing): its wheel,
  let go from rest, chases the jewel, and catches it later the faster the balance
  runs, so a small swing gets more of the escapement's work than a running one
  (`impulse()`: 1.34 times at 60° against 255°; moved as the clicks move, about
  1.24). No drive or inertia makes the landing stop moving (a faster wheel lands
  earlier at every swing, toward -20.7°, just after the release), and the train's
  elasticity slows the chase (`traindyn.js`); what does is open. Is the loud
  click the strike? Taken instead as the detent coming home on its stop button
  (its last landing, `acoustic.py`'s event 7 since 14 October 2026), the first
  interval fits better (its trend 0.13-0.14 against 0.48-0.50 ms rms), but the lock
  comes 1.4-1.9 ms early, and the steady swing it reads, about 255°, the return
  swing's own clicks rule out (5.88 ms, 306-324°; they involve neither): the loud
  click is the strike. Nor is it the cause
  of the slow start: the averaged build-up law refitted with the work falling as the
  model's, the clicks' or not at all wants TF 156-160, 136-142 or 104-106 s (each
  1.7-2.0° rms; the model's 67 s 5.7-10.1°), and a steady swing of 294-316°. So this
  movement's balance loses less than the model's, and the drive that reaches it is
  smaller (at TF 140 s the model's drive would hold it near 340°). The model keeps
  its budget's 67 s: one movement, started once; a made chronometer's own run-down
  is measured on the bench (`bench.js`'s run-down test).
  (6) A second movement (12 October 2026): `xM_mxtGfeqQ`'s swing recovering after the
  movement was handled, 170° to 229° over 107 s (its 186° reading picked by the sound and
  the clicks' interval), fits 133 ± 4 s by the averaged law and 200-320 s in
  `dynamics.js` (`startup.js --xm`; the model's 68 s, as it then was, misses it by 7.3°). The published
  figures for chronometer balances (Q 300-700, TF 48-111 s: Sources) don't reach it, and
  the fusee's own spring (`tools/drive.js`) can't supply the weaker drive it needs through
  the model's train: OPEN-QUESTIONS.md 1, "The two together".

The whole of it, with the charts (hover for values; each with its data table),
the analysis plots, the implications and the gaps, is a report:
`verification/real-chronometers/index.html` (open the file; `build_report.py`
there rebuilds it from the tools' results, `--local DIR` a fuller copy outside
the repository with short audio excerpts and the video frames); the site
carries the repository's copy at `/verification/real-chronometers/`.

## Sources

- *Manual for Overhaul, Repair and Handling of Hamilton Ship Chronometer*, NAVSHIPS 250-624, Bureau of Ships, 1948. Used for:
  - the structure: pillar plate, barrel bridge, upper and lower train bridges, balance lower bridge, escape upper bridge. The lower train bridge is screwed to the dial side of the pillar plate (Figs. 29, 67, 110): a straight steel bar with square ends across an opening in the plate, its settings inboard and a screw toward each end (Figs. 30, 31 and a photograph of a Model 21's dial side);
  - the going train's stack (Figs. 13, 29, 110): third, centre and fourth wheels from the plate up, the third and centre pinions above their wheels and the fourth's below, and five spokes on each wheel;
  - the maintaining work and the winding stop-bar (Sec. IV, Figs. 12, 28, 69–74, parts list Fig. 109): the fusee's winding ratchet with its two screws; the sustaining ratchet wheel, free on the arbor, with two winding pawls, their springs and four screws; the sustaining spring in the fusee wheel's recess; the end plate and taper pin; the stop-bar in a slot in the fusee's top with its spring, under the top plate and its two screws; the winding stop screwed into the barrel bridge; the sustaining pawl on its arbor with its spring;
  - the upper train bridge leaving the fusee's top open to the barrel bridge, which holds the fusee's upper bushing (Figs. 24, 29, 67, 77; parts list 108-45);
  - the barrel's inside (Figs. 26, 75): the arbor's core with its hook for the mainspring, and the brace lining the wall; the chain hooked to the barrel and pinned to the fusee (Figs. 26, 28); the setup pawl spring (Figs. 17, 24, 80);
  - the detent escapement. Its layout comes from the plan view, Fig. 90: the detent lies at 68° to the line of centres, with 10.1 mm from the point of flexure to the locking jewel, and the trip spring is 6.45 mm free (5.8, its length to the horn's tab, from 20 to 25 October 2026), 2.3 mm to the side, on the line through the balance staff (the lengths measured on KLUwI2UUCMQ 11:10-11:33 (the detent out and held up, four frames by bundle adjustment on the block's two positioning pins, 10.12 mm apart; Fig. 90 scaled by the same pins agrees along the detent to 0.1-0.3 mm; `E:\mc-video\oq\ledger\detent`) since 20 October 2026: 11.3 and 7.9 before, Fig. 90 scaled 12-17 % large);
  - the detent's construction, from Figs. 14, 54–60 and 110 and the parts list. The detent is beryllium copper with a two-strip detent spring and a round locking jewel with a flat. The trip spring is Elinvar, on an angle bracket. The support block hangs from the upper train bridge, held by one screw and two positioning pins (Sec. II; Figs. 14, 22, 90), and carries the stop button, lock-adjusting and detent-adjusting screws. The detent-adjusting screw, threaded into the block's end, has its head in a slot across the detent's foot, so turning it slides the detent along (Fig. 90; Ops. 84, 93); the trip spring's screw goes through a hole in the spring's foot into the bracket's upright leg (Figs. 14, 54; reassembly of the detent, 8). The block's screw goes in from above, through the train bridge into a tapped hole in the block's top (Figs. 14, 22, 84; the restoration video, `KLUwI2UUCMQ` 10:45 and 11:08). The model does too: since the photographed group's 14° turn the barrel bridge's horn no longer covers its place for the block;
  - the escapement's adjustment figures (Sec. VIII, Ops. 76–97): roller shake about 0.002 in (Op. 84), lock about 6° (Op. 85), let-off at least 6° (Op. 86), overall 26–30° (Op. 87), horn clearance about 0.010 in (Op. 88) and drop about 2° (Op. 97). The teeth drop into the large portion of the impulse roller's crescent and never enter the small portion (Ops. 76, 83). The wheel is centred on the impulse jewel (Op. 82);
  - the impulse roller, 0.249 in (6.32 mm) across (parts list, p. 82). Variants of .250–.253 in exist to set roller shake;
  - the balance and hairspring. The parts list gives 4–6 balance screws of 0.049 in head height, 2 of 0.080 in and 2 of 0.101 in, in diametric pairs, plus 2 timing weights (93 mg) and 2 vernier weights (10.5 mg), each a nut on a screw in one of the rim's holes (parts list, p. 82; Fig. 3); the model carries 8 screws, as the restoration video's balance does, the holes numbered as Fig. 99 and Table IV number them;
  - the barrel cap with its five screws on the pillar-plate end (Figs. 26, 109), and the dust seal with three packing rings around the fusee arbor (Fig. 24);
  - the gimbal mounting (Figs. 1, 94, 106): a flat ring hung on two pivot screws through the box sides (a cup washer under each head outside, the lock nut inside against the wall: Fig. 106, Jones-Horan 63662_17), the case hung in it on front and rear pivot screws into brackets on the case, support straps at 3 and 6, the gimbal latch at the front right (a lever on a support bracket, through a slot in the ring to the keeper on the case: Fig. 106 and the parts list) and the key at the back right;
  - every part in the parts lists of Figs. 106–110, checked one by one (`Review-results.md`, "Every part against the manual"); among them the pillar, mounting-ring, dial and post screws, the endstone caps and settings, and the barrel and fusee upper bushings;
  - the balance's hub, cap and hold-down screws (Fig. 4), the balance wheel locking arm with its screw, washer and stop pin (Sec. III, Fig. 9; parts list 108-31 to 108-34), and the train-blocking screw (Sec. II, Fig. 110): threaded through the balance lower bridge's slab beside the fourth's setting, its head in the lug's column, which rises to the train bridge's underside as the figure's section draws it; screwed down between the fourth wheel's spokes, its head on the seat at the bottom of the column's bore, the chamfer seating in the train bridge's access hole when raised, with the slotted spigot above the head standing in the hole;
  - the balance lower bridge (Figs. 29, 30, 110; Ops. 11, 12, 50; parts list 110-27, 110-20): a stepped block of two levels, its outline measured on the restoration video below, the train bridge held underside up with the bridge on it (`References/VIDEOS.md`, "The balance lower bridge"). The lower level is a slab curved as a lens, its convex edges chamfered, carrying the balance's lower setting and endstone cap (the cap in a round counterbore) and the fourth wheel's upper setting (a large gilt setting in a sink); its concave edge follows the train bridge's round escape lobe, so the escape wheel lifts out past it with the bridge in place (Fig. 110 draws the bridge as a C round that opening). A lug stands at each end of the bridge's long axis, its pad against the upper train bridge's underside, held by a screw 42055 put in from below (the figures draw them head down under the bridge; Op. 12 screws it to the upturned train bridge, Op. 50 takes the screws out once that bridge is off) and a steady pin, and joined to the slab by a wall; between the lugs the escape wheel turns over the slab. Along the bridge, Fig. 30's order: a lug with its screw, the train-blocking screw, the fourth's setting, the balance's endstone cap, and the arm to the other lug;
  - the balance upper setting and jewel, pressed into the cock under the endstone cap and its two screws (Figs. 19, 36, 84, 85; parts list 42162, 42160), and the staff's pivot in it;
  - the hairspring's collet and stud (Sec. II; Figs. 5, 6, 19, 84, 85): the collet, slit from its bore to a relief hole so it grips the staff, a stepped block with the hub on its plate, a ledge cut back over the tongue at its foot, and the tongue's end, against which the clamp, closed over the spring's end, is drawn by the wedge pin through the tongue's notch; the stud under the cock, held by the stud screw from the cock's top and a steady pin, holding the upper end the same way;
  - the hand-setting square at the centre of the dial, which takes the winding key (Sec. III, Setting; Fig. 8): the cannon pinion's squared end, with the minute hand broached square on it and the hour hand pressed on the hour wheel's pipe (Sec. VIII, Ops. 58, 59, 64);
  - starting: a detent chronometer is not self-starting, and is started with "a single quick twist" of its box (Sec. III);
  - the dial markings, winding figures and part numbers. The UP–DOWN scale runs clockwise round the bottom of its sub-dial from UP (upper right) to DOWN (upper left), so winding turns the hand counterclockwise back to UP (Fig. 107, Sec. III).
- New-old-stock Hamilton Model 21 pillar plate listing: 87.57 mm diameter, 3.86 mm thick.
- The mounting ring and the case (Figs. 29, 67 and 110 draw the ring as a deep ring under the plate, cut; Sec. VI: it is lacquered; Sec. III, taking the movement from its case: the bezel unscrews counterclockwise, the movement may "stick in the case" and is pushed free with the key, put upside down on the case "with the dial carefully located in the shoulder recess around the top edge of the case", and "the alignment pin protruding beyond the movement enters its slot in the edge of the case"; the note at Op. 98: "the dial or the movement [may] shift on the mounting ring"). The case's parts list (Fig. 107) has nothing between the case and the movement: the ring holds it. Measured on the photographs:
  - the side photograph (`photo-side-view.jpg`, 18.9 px/mm by the plate's width), from the plate's train face down: a silver band 1.9 mm, a gold band 4.1 mm as wide as the plate, a flange 4.4 mm deep and 95.9 mm across with a slot in its edge, and a thin layer about 95 mm across under it, the dial. The model reads the gold band and the flange as the ring under the plate, so the dial lies 10.4 mm below the plate's train face. The plate is the listing's 3.86 mm, so the colour change 1.9 mm down its edge is not explained (the edge may be gilt below its plating, or the plate stepped into the ring);
  - the dial-side photograph (`photo-dial-side-lower-train-bridge.png`): the ring's bore, about 0.84 of its outside across (r 40.2 until October 2026; the restoration video's ring, 40:08, gives 0.81-0.83 camera-free, and the model has r 39.0), the plate's dial face sunk in it;
  - the top-view photograph: two small screws in the flange outside the plate's edge, 45–47 mm out at about 38.5° and 111.6° (the dial screws); the case's threaded rim about 1.2 times the plate's width, 105 mm across; the gimbal ring's inside about 1.5 times it, r 66 (the ring lies lower, so it is if anything larger).
- Royal Museums Greenwich, Hamilton Model 21 No. 4E019 (https://www.rmg.co.uk/collections/objects/rmgc-object-387425): "a large hole in the pillar plate for access to one of the lower balance bridge screws to enable removal of the bridge without dismantling the sub-frame". The model has that hole under the screw at the end of the bridge's arm.
- chronometerbook.com, post 4: W. Rawlings' plan of the Model 21 escapement, a redrawing of the manual's Fig. 90, and a photograph of a Model 21 detent.
- chronometerbook.com, post 30: escape wheel specification of 16 teeth, 13.14-13.18 mm diameter, 1.27-1.32 mm thick and no wider than the impulse roller; the locking jewel set at 8-12° of draw.
- The manual's Fig. 2 photograph (layout) and Fig. 107 (dial side, wind-indicator wheel).
- Photographs of a Model 21's dial side during reassembly and of its loose motion-work wheels (user-supplied, source unknown): the solid minute and hour wheels and the five thin spokes of the wind indicator wheel. Shapes only; the counts and the wind indicator wheel's radius (Fig. 107) are unchanged, though the photographed wheel looks larger (about r 15–17 mm).
- A photographed Model 21 dial of the U.S. Maritime Commission contract (the Hamilton dial's layout, inscriptions and hands) and a photographed movement, serial 2E12055 (the plate engraving's text and layout, and the serial used on the plates and dial). Both are in `References/`.
- Videos of real Model 21s (`References/VIDEOS.md`, which records what each shows and every measurement): a 4K restoration of a 1941 movement, serial 2E8489 (C Spinner Watch Restorations, https://www.youtube.com/watch?v=KLUwI2UUCMQ), for the going train's tooth counts (fusee and centre wheels 90, third 80 with a pinion of 12, fourth 75, the wind indicator wheel 120) and which wheel is which, and for the balance lower bridge's form and heights; BunnSpecial's two-part teardown (https://www.youtube.com/watch?v=Jd2c3x8VKsE, https://www.youtube.com/watch?v=wcYqdgpyggQ) for the bridges and pillars off. Counted with `tools/video.py`. Like the photographs, they are a source of truth.
- The photographed dial above, again: its UP–DOWN scale's ticks, 8 h apart, sweep 315.7° over 56 h; the model's 313.6° comes from the train.
- Two *NAWCC Bulletin* articles (read 18 October 2026, the owner's copies; © NAWCC, not committed; `References/NAWCC-ARTICLES.md` records what each says):
  W. O. Bennett, "The Hamilton Marine Chronometer", No. 356 (June 2005), pp. 325-334, the designer's account: the Invar arm on the stainless rim, about
  1½ turns of motion, the one-piece roller changed to two, two adjustments, the rate the same from one turn of motion to one and a half "within a fraction
  of a second per day" and "two identical terminals" on the hairspring (both against the model: Review-results.md, finding 11), and a second Navy test
  card, No. 5580 (1944), whose middle-temperature gain (0.11 s a day) agrees with No. 3390's that `MTE` takes; D. Sinclair, "From the Workshop: The Hamilton
  Series XXI Marine Chronometer", No. 365 (December 2006), pp. 707-713, a service of No. 2E11334: the balance cock's endstone a diamond, the other
  thirteen jewels rubies (`J.bue`), the set-up as Op. 56 has it, the trip spring's one screw, the locking jewel's wedge and shellac, the Y-arm stop's nylon tips.
- For the essay's sky sections and their almanac (`shared/almanac.js`, "The almanac" above): J. Meeus, *Astronomical Algorithms*, 2nd ed. (Willmann-Bell,
  1998), chs. 7, 10–13, 16, 21–23, 25, 40, 47 and Appendix III; F. Espenak and J. Meeus's ΔT polynomials (NASA, 2006); the IERS's measured ΔT (as skyfield
  1.55 carries it); the Astronomical Almanac's low-precision formulas for the Sun (the essay's hand rules); N. Bowditch, *The American Practical Navigator*
  (Pub. No. 9), and the Nautical Almanac, for the altitude corrections, sight reduction and the 57 navigational stars; SIMBAD (CDS, Strasbourg) for the
  stars' places and motions. Checked against JPL Horizons (DE441) and skyfield 1.55 with JPL's de440s (`tools/almanac-ref.json`).
- For the balance's damping (OPEN-QUESTIONS.md, "The balance's free run-down"; build-verification report, section 11; read 12 October 2026, not used to change the model):
  I. Vardi, "Le facteur de qualité en horlogerie mécanique", *Bulletin de la Société Suisse de Chronométrie* 75 (2014), pp. 57-65 (its Fig. 1, D. A. Bateman's
  chart: a "Hamilton chronometer" about Q 220, a Mercer marine chronometer about 315; its table after A. L. Rawlings, *The Science of Clocks and Watches*, 3rd ed.,
  1993, p. 103: a marine chronometer's balance 300-700; and M. Girardin and P. Jeannet, *Bull. SSC & LSRH* 45, 1970: watch balances' Q doubled or tripled in vacuum);
  D. A. Bateman, "Vibration theory and clocks", *Horological Journal* 120-121 (1977-78) (spring balances 100-300, as quoted by D. C. Agnew, 2019); Cartier's
  US 9,389,588 B2 and US 9,535,404 B2 (four 4 Hz watches at 1 mbar, the drive unchanged: the air 28-40 % of the loss); E. Thalmann et al., *J. Mech. Des.* 142
  (2020) 075001 (a balance's Q "barely surpasses 200", the bearings the main loss).
- *Watch and Clock Escapements* (compiled from *The Keystone*, 1904; Project Gutenberg eBook 17021), Ch. III "The Chronometer Escapement": a period text on the spring-detent escapement in general, not the Model 21. It is a cross-check only, below; nothing in the model is drawn from it.

### Against a period text

`tools/keystone.js` measures the model's escapement against each rule the 1904 text gives. It reads `ESC` as `escapement.js` builds it, the tooth outline (`ESC.toothPts`), the locking stone and detent pieces (`ESC.pieces`), and the sizes set in `core.js` and `movement.js`. The text describes a generic English chronometer, so where the manual, Hamilton's specification or a photograph gives a figure, that figure stands; the text is never a reason to change one. As of 4 October 2026:

- **Agrees.** The impulse roller is 0.480 of the wheel's diameter (the text: about half). The teeth are 1.30 mm along the arbor (1/20 in, 1.27 mm). The draw is 10° (about 12°). The jewel is flush with the roller (at most 0.002 in proud). The unlocking takes 5.4° of balance (about 5°; the manual's lock is about 6°). The balance beats 14,400 an hour.
- **The planting.** The text places the balance where the wheel's and roller's rims cross over one pitch (Fig. 139). Applied to the Model 21's own parts (16 teeth, a 13.16 mm wheel, the 0.249 in roller), that puts the balance 9.34 mm from the escape arbor; the model's is 9.40 mm, from the photo fit and Fig. 90. The rims cross over 20.7° of the wheel, 92% of a pitch.
- **Hamilton's choices.** 16 teeth (the text: 15), a 13.16 mm wheel (0.55 in, 13.97 mm), a 255° swing (about 225°; the manual's 1⅜–1½ turns decide), and a beryllium-copper detent 11.32 mm from the point of flexure to the jewel (the text: as long as the wheel is wide), its spring 0.337 of that (2/7).
- **Fig. 90 decides.** The teeth's locking face leans 15.5° from the radial (the text: 28°; Saunier 27°, Britten 20°), and the back's curve fits a circle of 3.75 mm (the text: the roller's radius, 3.16 mm). Both are traced from Fig. 90.
- **The release.** The impulse jewel is 2.0° inside the wheel's tip circle when the wheel is released; the text allows 5°, so that the tooth meets the jewel's flat face. The model's release is set by the manual's lock, let-off, overall and drop. The wheel, released from rest, catches the jewel 16.9° of balance later (at −4.4°), so the impulse covers 25.2° of balance against the text's 43° of a 48° arc: the text's figure is the geometric arc, the model's what a wheel of this inertia at this torque reaches (`tools/dynamics.js` agrees beat by beat).
- **The detent's turn.** At release the model's detent has turned 0.73° about its point of flexure, the jewel moving 0.14 mm. The text's "locking of about two degrees … counting the center of fluxion" would move a jewel 0.49 mm on its own 0.55 in detent, four times the depth of lock that the manual's figures give here. The passage doesn't say what the two degrees are measured on, so the comparison is left open.
- **Estimates near the text.** The model's detent spring is two beryllium-copper strips 0.079 mm thick (0.50 and 0.45 mm wide; estimated). The text's steel spring is 0.002 × 0.080 in. Taking E as 128 GPa for beryllium copper and 200 GPa for steel, the model's spring is 29% stiffer than the text's would be at its own length. The locking stone is 0.61 mm across (Figs. 57–59 give no size), under the text's third of a tooth space (0.86 mm); its flat removes 0.37 of the diameter (the text: 4/10).

## How the layout was measured

1. **Two photographs.** The manual's Fig. 2 and a near top-down photograph of a 1941 movement. `tools/bundle.py` fits an independent camera to each photo and triangulates the balance, fusee and barrel axes. Point residuals are under 9 px in both photos.
2. **Scale.** Two photographs fix the group's shape but not its size. It was first scaled so the fusee wheel, then taken as 96:14 and 40.87 mm across, stayed inside the 87.57 mm pillar plate (factor 0.955). That wheel is 36.0–36.9 mm across on the side photograph read at the plate's own scale (step 6), and the group's scale and place now come from the real movements instead (step 4).
3. **Mapping the top view.** Using those three axes, a similarity transform maps the top-view photograph into the model, with under 0.4 mm residual on those three axes (`tools/p3map.json`); elsewhere on it, its points standing at different heights, a 2-D map leaves 1-2 mm (the photocompare pilot of 18 October 2026, with a fitted camera; PROVENANCE.md, seam 6). The following were traced through it:
   - the bridge outline (radius about 40 mm);
   - the crescent balance cock's outer edge along the rim (`tools/cock_outline.json`), shifted for its height parallax. The rest of its top face (`CK_TR` in `movement.js`) is traced on the restoration video's cock alone (41:58, 4K) put on the cock's top through its holes at their measured places and its rim (checked on 6:29 through its own fit; the cock turned about the staff to stand against the barrel bridge's horn, see "Estimated"): the straight edge 0.5 mm outside the stud's holes from the nose, then bending about 28° toward the rim, the nose round with no corner, and the concave edge (see "Estimated"). The outline is the cock's top: the cock is one solid block (C Spinner's restoration video, the cock off at 41:58 and 23:45, in place from the side at 2:36; `References/VIDEOS.md`), its outer wall following the rim the full 14.2 mm down to the train bridge, and only the arm over the balance thinner: 2.6 mm from the nose, then a square step down on its underside to 6.0 mm (44:02, from the straight edge; 41:58 on the concave side). The body is all of the outline more than 17.7 mm from the staff, the circle the barrel bridge is cut on; the screw's head lies in a counterbore, and two steady pins go into the train bridge;
   - the barrel bridge's far horn, past the balance on the 6 o'clock side to about 100°, where a cut from the balance's opening to the rim ends it, and its two screws;
   - the barrel bridge's cut round the balance: one circle, r 20.06 about (2.03, 9.96), 0.5 mm from the staff, measured on C Spinner's 13:04.4 (the bridge upside down, nearly face-on, the whole cut in view): a homography on nine of the bridge's holes (0.03-1.14 mm each left out), the edge found along 49 rays 4° apart, fitted to 0.11 mm rms (0.23 at most) over 196°. The barrel's cap and the fusee's large end show through it. Until 15 October 2026 it was three circles joined, which left a step under the fusee's dust cap: the balance's clearance (r 17.7 about the staff), a circle fitted on the top-view photograph (r 17.6 about (5.24, 6.33) in its frame), both 1-1.7 mm outside the edge past the balance, and a circle through the top edge traced on 6:49.0 between the cock's horn and the fusee (r 16.85 about (6.84, 9.53)), 1.5-1.9 mm outside it, that frame's camera being out by as much on the bridges' right side. On the cock's side the bridge's horn ends against the cock's straight edge, which meets the rim about 5° round from 3 o'clock: with the cock off (6:47) the bridge's edge meets the rim there, and the bridge laid flat (23:30) ends that horn at 2–9°, so the cock stands on the train bridge in the bridge's opening;
   - the setup cover over the ratchet (until 21 October 2026 traced on the two photographs, its ends r 12.69 about a centre 0.53 off the arbor, with round bosses r 1.35 standing out round its screws): measured on C Spinner's 11:52 (4K), the cover face down on the barrel bridge (`tools/cover_ends.py`, `cover_fit.py`, `cover_overlay.py`; the traces and fits in `tools/traces/cover_11-5*`): its edges put in mm through a homography fitted on its own holes (the arbor hole about the barrel arbor, the screws' holes about `S.cover`), the pads' edges through the image shift of their height (fitted on the upper pad's wall). It is four circles: two concave sides, r 23.04 and 23.59 (0.005 and 0.010 mm median residual), each running on past the pads' step to the end, and both ends one circle r 14.69 about a centre 0.94 mm off the arbor; the screw holes plain, 1.6 mm inside the ends, r 0.77; the click pivot's hole r 0.49 (the frame's small third hole by the lower screw; no steady pin); the arbor hole r 3.12; the pads' inner edge one circle r 11.49 about a centre 0.52 off the arbor. What look like straight cuts at the corners on the frame are the same wall at the pad's height, jogged by the step's parallax. A second view, 11:48 (from above, the cover in place), agrees on the left end and the sides through an affine on the holes (its right end, far up the tilted frame, is beyond an affine's reach); 11:51.0 is too soft to fit the outline. And the ratchet's size (42 teeth, 14.1 mm across its tips: C Spinner's video, 11:58, against the cover screws' tapped holes, and the top-view photograph);
   - the screw positions;
   - the engraving columns (`tools/engr.json`);
   - the damascene direction. The damascening is on the plates' and bridges' train-side faces only; their undersides, edges and bevels, and the balance lower bridge all over, are plain, as the restoration video shows them (`plainFaces` in `core.js`, which pins those faces' uvs to a ridge's crest).
4. **Placing the group.** From Fig. 107: the wind-indicator wheel sits under the 12, driven from the fusee arbor; the dial's 12–6 axis, the centre, third and fourth arbors, the indicator and the motion work are the dial's and the train's. The photographed group (the balance, fusee and barrel of step 1, and everything traced with them in step 3: the pillars, bridges' cuts and holes, cock, their screws and pins, the engraving, the damascening) is taken into that frame by one similarity (`PT` in `movement.js`: ×1.039, turned 19.42°, shifted (−3.891, 0.879); `L` holds the results), fitted so its three arbors land where the real movements measure them (IDEAS.md 1.12; `Review-results.md` 22):
   - the balance on its lower cap, read face-on on the train bridge's underside (KLUwI2UUCMQ 13:49.5, `tools/framecam.py`); the upper train bridge's opening has its balance lobe centred 0.6 mm from it (23:30);
   - the fusee 20.4 mm from the centre: the bare plate fitted at 34:30 and 36:15 (`tools/rimfit.py`, 20.2–20.8), the side photograph's fusee wheel at the plate's scale (36.0–36.9 mm across, which with its 90 teeth and the centre pinion's 14 puts it 20.3–20.9 out), and the train bridge's notch round it (20.9); on the angle the dial side gives (43–45° from the indicator's stud, `rimfit_40-08.json`);
   - the barrel at the centre of the train bridge's cut round it, 22.56 mm out (the bare plate: 21.4–23.5).
   All three land within 0.23–0.31 mm: the photographs' own layout holds, at 1.039 times the size it was given (about undoing the 0.955) and set 4 mm off the centre. Outlines that run to the rim keep their radius there (`PTr`), so the bridges' rims stay concentric with the plate. What was measured on the video in the train bridge's own frame (its rim, barrel cut and centre bushing) goes through the 14° turn alone (`PR`): the notch, mouth and end, the opening in the middle, the third screw and its pillar. The escape arbor is solved again from the balance (9.40 mm, the escapement) and the fourth (10.585 then, their mesh; 11.107 since the fourth's place was measured, step 5); the escapement's plan and the detent turn with it, about 29° from before.
5. **The train.** The fourth, third and escape arbors are measured on the restoration video (`References/VIDEOS.md`, "The fourth arbor, the pillars, the indicator and the ring" and "The scale"; 2 October 2026), at the plate's 87.57 mm: the fourth 21.6 mm from the centre under the seconds (34:30, 40:08; 23.9 until then), the third 16.55 mm out at 149° from the 12 (34:30; earlier (−6.18, 14.75), from the train bridge's underside at 13:49.5), and the escape arbor 9.40 mm from the balance at the mean direction of its lower setting on the bare plate (12 October 2026: 34:30, 14:45 and 13:52.0 from the train side, 40:08 from the dial side, each through `tools/rimfit.py`'s camera on the plate's face edge and put on the model's plan by a rigid fit on the centre, fusee and barrel bushings; the four at 37.9–40.7° round the balance, 9.3–9.8 mm from it), 10.44 mm from the fourth. Until then it stood 4.3° back toward the fourth's line, 0.74 mm off, toward the escape jewel as 10:00 was then anchored (on the third arbor's old place), 11.1 mm from the fourth. With the modules from these spacings (`MOD`: 0.325, 0.251, 0.246) the centre, third and fourth wheels come out in the size ratios measured on the videos (centre ÷ third 1.45 against 1.42–1.46 rectified, third ÷ fourth 1.09 against 1.05–1.10), and the fourth's setting stands in the train bridge's keyhole lobe over it (it stood 0.7 mm outside it). The video's plate and ring agree only with a 4–5 % error in one of them; the ring's own proportions put it in the ring's bore, so the plate's 87.57 stands. `tools/solve.py` checks the spacings.
   - The escape wheel sits 9.40 mm from the balance. There the 0.249 in impulse roller clears the teeth either side of it by 0.002 in (roller shake, Op. 84), and the teeth dip into its crescent (Ops. 76, 83).
   - An earlier scaling of Rawlings' drawing gave 10.2 mm. Readings of the drawing vary with the feature used for scale; the manual's specifications fix the distance.
   - The escape arbor keeps its depth with the fourth wheel: that stage's module, 0.2457, fits the 10.444 mm centre distance between the fourth's measured place and the escape arbor's (`tools/solve.py`; 0.2614 at 11.107 mm until 12 October 2026, 0.249 at the 10.585 mm it was before the fourth was measured), so the fourth's tips are r 9.50, inside the 9.4–9.8 the third ÷ fourth ratio gives. Everything laid out about the line of centres turned with it (4.3° about the balance): the detent, its support block and pins, the escape upper bridge and its seats and screws, the train bridge's escape passage, the balance locking arm, the balance at rest; the camera fitted on 6:49.0 now puts the block's screw 0.76 mm and its far pin 0.91 mm from the model's (1.0 and 1.65 before).
6. **Heights.** A side photograph of an unmounted movement is scaled by the pillar plate's 3.86 mm edge (75 px; the plate's width gives the same scale to 2 %). On it, in mm above the pillar plate:
   - The pillars are 16.8 tall, the train bridge 3.1 thick, and the barrel bridge 3.4 thick on top of it.
   - The cock stands 14.2 tall on the train bridge.
   - The fusee cone spans 6.7–15.8, which the model matches. Its profile is measured on the same photograph about its axis, against the fusee wheel's tips: read with them taken as 40.87 mm (16.98 px/mm), the groove's floor on the eight upper turns is 8.33, 8.54, 8.95, 9.54, 10.19, 11.07, 12.16 and 13.81 mm, the flanges standing about 1.25 mm over the floor of the turn below them, the top 9.3 and the base flange 18.3, and `r0/√(1−a·m)` fits those floors to 0.085 mm rms (r0/(1−a·m), the old form, to 0.21): 7.95 mm at the small end and 16.8 at the large. At the plate's own scale (the plate's width, 18.96 px/mm; its edge, 19.4) the wheel is 36.0–36.9 mm across, and the model's, from its centre distance, 36.1: so everything read against the wheel (the cone, the wheel's recess and sustaining spring, the two ratchets, the pawls, the end plate, the top's screws and collars) is scaled by `FK` (0.882), the cone 7.01–14.82. That is the fusee for a pull falling in step with the barrel's turns, as a mainspring's does. Fig. 28 draws the same proportions.
   - The escape wheel runs 0.9 below the train bridge.
   - The escape pinion meshes with the fourth wheel 3.6 above the plate, and a large wheel runs lowest, at 0.4–1.6. Figs. 13, 29 and 110 stack the train third, centre, fourth from the plate, so that band is the third wheel (0.35–1.0) with the centre wheel just above it (1.15–1.85), under the fusee wheel (2.04). The third and centre pinions stand above their wheels, the fourth pinion below its wheel, long, down to the third wheel (0.2–3.1), and all three wheels have five spokes. The escape pinion runs from the fourth wheel down toward the plate (2.1–4.1), 1.1 mm above the third wheel's teeth.
   - A 3 mm plate at 7.9–10.9 is taken to be the balance lower bridge's lower tier (its upper tier lies against the train bridge). It also carries the fourth wheel's upper pivot, and the train-blocking screw reaches down from it to the fourth wheel's spokes (Sec. II). Side views in the restoration video (`References/VIDEOS.md`), scaled by the pillars, put the slab at 8.8–11.9 (its underside 8.4–9.4 over three views) and the escape wheel at 15.6, just under the train bridge: within about 1 mm of these, so the heights stand.
   - Fig. 2 and Fig. 109 show a tall barrel that rises past the train bridge to the barrel bridge, and Figs. 108 and 110 show the train bridge cut round it.
   - The plan positions (`L`) were fitted before the re-stack. `bundle.py`, `fit.py` and `unproj.py` now read their heights from `movement.js`'s constants. Only heights relative to the edge ring's matter to the fit (a common offset moves the camera), and the re-stack changed only the balance's, by 0.64 mm.
   - Re-fitted with those heights over eight seeds (`python bundle.py --seed N`, 45 restarts each), and fitted to `L` by a turn and a scale about the centre, the axes land within 0.16–1.43 mm of `L` for the balance, 0.09–0.73 mm for the fusee and 0.12–0.38 mm for the barrel, the balance's mean offset about 0.1 mm; the scale comes out 0.948–0.960 (the 0.955 of step 2). With the old heights the same seeds give 0.5–2.1, 0.3–0.8 and 0.3–0.7 mm (two seeds fall into a wrong minimum). No axis moves clear of that spread, so `L` stays as fitted.
7. **Collision check.** `tools/fine.py --hold` runs the same check with the balance locking arm locked and the train-blocking screw down. `tools/dyn.py` with `tools/interference-check.js` checks every closed part at 0.4 mm through a full escapement cycle. `tools/fine.py` checks at 0.05 mm, also at 15 train positions and wind states, and includes the chain and the tube springs; it found four overlaps of 0.1–0.4 mm that the coarser check could not see. Only intended contacts remain, listed with their reasons in `fine.py`. The barrel's wall is an open drum; `fine.py` tests it as the solid it encloses and measures every part's distance to the solid the barrel sweeps: the tightest are the barrel bridge (0.55 mm above the boss), the detent's foot (0.98 mm) and the train bridge's cutout (1.0 mm from the caps' rim). The mainspring's inner coil lies on the arbor's core (0.06 mm off it), and the spring stays 0.46 mm inside the wall and 0.2–0.3 mm from the caps at every wind. The dial's printed face, an open ring 0.02 mm over its brass disc, is checked exactly instead: no part over the dial, outside its arbor holes, may come within 0.02 mm of it.
8. **Visual check.** `tools/topview.py` renders the model from above and warps it onto the top-view photograph through five barrel-bridge screws: `verification/topview-comparison.png` shows the photo, the model and the two blended. Parts far above or below the barrel bridge (the cock, the balance's endstone) are off by up to about 3 mm there, from the photograph's tilt. The photographed movement has the balance locking arm (Fig. 9), which the model now has too, though its shape is estimated. `tools/p3fit.py` renders from the camera fitted to the photograph the tracing was first done on.

## Estimated, not from the manual

- The set-up pawl spring's inner pin (13 deg along the band from the outer one, 0.84 mm further in) and the outer pin's counterbore depth (0.5 mm) in the barrel bridge's underside: the outer pin and its counterbore's place and width are measured (KLUwI2UUCMQ 13:03.5 and 13:04.4, 20 October 2026); neither frame shows the inner pin's hole or the counterbore edge-on.
- The Ulysse Nardin finish's roughness (Variants): frosted plates and lacquered bowl at 0.45, read off the photographs' soft highlights, not measured; its colours are fitted (`UN_FIT` in `core.js`).
- The mechanisms' analyses (13 October 2026): the hand's torque on this key (finger torque on handles of like size, Imrhan and Munoz-Vasa 2013, Swain 1970); the stop-bar's and stud's temper (hardened is the build's); the pawls' springs' set when free (the least each needs is found), the springs taken as straight cantilevers; the click's and the sustaining pawl's ends taken as fitted to their faces; the teeth's stiffness (cantilevers, halved for the contact) and the meshes' and contacts' damping (3 %); the wear coefficients (Rabinowicz's orders of magnitude) and the sliding at the escape teeth (0.5 mm on the jewel), the chain and the wheel teeth; a chain's allowed stretch (1 % of its pitch) and a tooth's wear (20 µm); the tolerances a maker holds on the strips (±0.005 mm), the sustaining spring's band (±0.02) and the springs' set.
- The build's deviations (tools/deviations.js): Nivarox's expansion (7-10 × 10⁻⁶/°C) and modulus (165-195 GPa, as Elinvar-type alloys'), and with them the spring's thermoelastic coefficient for the Model 21's balance (+0.1 to +13.0 × 10⁻⁶ a °C); that balance's expansion read from Table IV as a thin ring's bending (inextensible, on a rigid arm; the 0.120 in head's mass extrapolated, I_REST's 8 % anywhere between Invar and the rim, Invar 1.0-1.6 × 10⁻⁶/°C); a bought spring's coefficient held to ±10 × 10⁻⁶ (EP3502288A1, an alloy's target, not a grade's published tolerance); Nivaflex's 3000 N/mm² is its maker's achievable strength, aged. The gear-mesh and FEA checks' inputs: tooth friction 0.10-0.20, the pivots' shake 10 µm, brass E 97-110 GPa and the expansions of brass and steel (published ranges), the chain's height on the fusee (makeFusee's yS, yB).

- The balance's dynamics ("The balance's dynamics", under How the timing works): the hairspring's isochronism (0, or the bench's setting), the mainspring's set (a uniform weakening), the mainspring's pull at the barrel (the solved spring's, `tools/mainspring.py`: its free curve measured, its length estimated; until 11 October 2026 the drive took an illustrative pull, the profile's made 3% steeper at each end), the sustaining spring's push and its banking (a design, 14 October 2026: a split ring weaker than the drive, Gould 1923 and Glasgow 1885, banked in running where its lobes nearly meet, pushing `SPU` 0.22 of the 12-hour drive as its section traced on the video gives it (0.82 from a designed 1.45 mm band until 17 October 2026, 0.88 from 1.25 until 16 October), `tools/sustaining.js`, and relaxing linearly over its measured 12.5° gap (its outline and height measured, 17 October 2026). No banking is seen on the video, looked for on 11 October 2026 at 18:49-18:58 (the fusee wheel's face, the spring in and coming out: its two pins and the raised disc's step, which a shadow shows as a crescent, no slot) and 19:05-19:09 (the sustaining ratchet bare), and on a second movement (2E7437, `TWQsSVWuikk` 45:40, the recess open face-on: a plain ring of spring), or in Figs. 69-73 and Ops. 19-29; the lobes meeting would be the banking. Sec. IV's five to ten minutes read as the time it keeps the chronometer running: 6.2; over a turn until 17 October 2026), the free run-down (68 s, from the energy budget and the balance's parts), the jolt's strength (0.6–1 of the balance's top speed), the gimbals' period (0.7 s) and pivot friction (ζ 0.05), the split balance's middle temperature error and the bimetal constants of its curl. The hairspring is taken as isochronous. The Model 21 balance's curvature in temperature is read from one chronometer's test card (No. 3390), so it is that chronometer's, not a type figure; the three period means it rests on are read to 0.01 s a day, sure.

- Tooth counts: the fusee wheel (90), centre wheel (90), third wheel (80) and its pinion (12), fourth wheel (75) and the wind indicator wheel (120) were counted on a restoration video of a 1941 Model 21 (`References/README.md`, "Videos consulted"; `tools/video.py`; IDEAS.md 1.8), not taken from the manual; the escape wheel (16) is Hamilton's. The fourth and escape pinions (10, 10) follow from those counts and a one-minute fourth wheel. The centre pinion (14) is counted on the same video, likely but not certain (end-on at 13:59.5, from above at 35:23.66; no frame shows every leaf); the fusee arbor's pinion (12) is inferred, not counted: 14 makes the manual's 17½ half turns hold its "maximum of 56 hours", and 14 × 12 sweeps the UP–DOWN hand 313.6° in 56 h, against the 315.7° a photographed dial's scale spans. 13 and 13 would fit the dial and the manual's seven half turns a day better, but run 60.6 h. The motion work (cannon pinion 14 : minute wheel 56, minute pinion 18 : hour wheel 54, `MW` in movement.js) is counted on the video, the wheels lying whole on the mat (`References/VIDEOS.md`); it was 12 : 36, 10 : 40, chosen, until the count.
- Dimensions and positions, estimated from the figures and the dial (95 mm, the side photograph), except where the photographs give them (plan: "How the layout was measured", steps 1–5; heights: step 6).
- Heights the side photograph doesn't show:
  - The train wheels' proportions are measured: the third's at 35:22.54, in its opening in the plate (hub 0.41, rim from 0.79, spokes 0.095 of the tip radius, ratios along both axes of the tilted wheel); it took the fourth's until 5 October 2026, since on the flat wheels (23:45) it lies tilted and blurred. The centre and fourth wheels' are measured there (`WHEEL_PROP`, movement.js: hub 0.30 and 0.36 of the tip radius, rim from 0.79 and 0.83, spokes 0.10 and 0.07).
  - The train wheels' and pinions' heights within the stack that Figs. 13, 29 and 110 give (third wheel 0.35–1.0 mm above the plate, centre wheel 1.15–1.85, pinions ending at their wheels' bosses), and the bosses' sizes (the centre boss r 1.3, inside the radius the third wheel's teeth leave free).
  - The barrel's place in height: from 2.4 mm above the plate, over the third and centre wheels, to 1 mm under the train bridge's top; its chain band runs level with the fusee's cone (its height, 16.5 mm, is measured: below).
  - The balance rim, clear of the escape upper bridge, whose end screws sit flush in its top.
  - The hairspring, 6.4 mm tall (`HS_H`), from the collet's tongue, 1.1 mm below the balance rim's top edge, to the stud's clamp under the cock (the restoration video side-on, 6:49.5: its top wire 5.8 mm over the rim's top, the coils running on behind the rim's front edge, 7.15 mm or more (7.3 ±0.4 on 6:49.5 re-read 20 October 2026, its bottom 0.9 lower: not built, the hub and collet not seen side-on; PLAN-hamilton-ledger.md); Fig. 2, about 2.1 below the rim's top; the collet as low as the hub's estimated boss, cap and screws let it go, 0.5 mm or more short: open; its coils' radius, 5.1, and 12 turns are measured (13 wires down each side on the video side-on, 6:49.5): the radius against the balance rim on the restoration video side-on and face-on, the manual's Fig. 2 and two photographs, 5.26 to the outer edge, their median; Review-results.md, 25). On 6:49.5 (20 October 2026, `E:\mc-video\oq\ledger\balance_small`) its pitch reads 0.607 and its lowest wire 1.3-1.7 under the rim's top, so about 7.3 tall: not drawn, since the collet would then stand in the hub's boss, which no frame shows (open).
- The train bridge's cut round the barrel: a circle r 20.0 about the barrel's arbor (fitted with both free on C Spinner's video through homographies anchored on the holes the bare plate places: 23:30 r 20.26, 13:49.5 r 19.69, their centres' mean 0.04 mm from the arbor; 18 October 2026, PROVENANCE.md, Step 3). It was r 21.0 centred 24.8 mm out from 2 October, read through anchors that held the bridge's rim at r 40.5, and r 19.2 about the barrel before. Open to the rim, which holds the barrel and clears the centre arbor. Figs. 108 and 110 show its presence.
- The escape upper bridge's sizes. Its form is from C Spinner's video (`KLUwI2UUCMQ` 10:00-10:50) and Figs. 84 and 110 (`References/VIDEOS.md`, "The escape upper bridge, close"): a flat bar 1.0 thick, 5.6 wide and 22 long with round ends, across the train bridge's escape opening, a countersunk screw flush near each end (8.3 mm from the jewel) and a steady pin beside it (1.6 further out, 1.3 toward the balance); under its middle 2.5 thick over 10.8 mm with a round boss r 3.8 hanging 1.5 into the opening, which holds the setting; the endstone cap R 4.1, 1.0 thick, sunk flush in the bar on the boss and cut flat both sides with the bar's edges, its window a 90° cone r 1.55 at the top down to the endstone, its screws' heads r 0.75; the bar's ends lie in seats sunk in the train bridge's face (`TB_SEAT`, from `tools/train_bridge.py`: the ends grown 0.25). Sizes as ratios to the end screws' spacing (16.0–16.9 mm), medium. Its length lies 68.7° round from the balance–escape line (72° until 24 October 2026): measured on two cameras, each with the train bridge's face calibrated on its own holes by their circles and the bar put back at its top's level, 10:00 (the end screws' line 69.0°) and 6:49.0 (the screws' line 68.3°, the long edges 67.9-69.4°), ±0.6° each; sure. The seats turn with it (`tools/train_bridge.py` grows them from the bar's ends, 5.45 wide, round about the screws 8.3 out). The jewel's place against `L.E` is not settled by those frames (0.7 mm one way on 10:00, the other on 6:49.0). Estimated: the seats' depth (0.3, `SEAT_D`), the screws' countersinks (drawn as counterbores). The train bridge's escape opening is a circle r 6.9 about the arbor (the escape wheel lifts out through it), joined to the traced keyhole.
- The balance lower bridge's outline. **Two levels, the slab (`LB_LO`) since 18 October 2026**: traced by hand by the owner (`tools/tracer.html`) on KLUwI2UUCMQ 13:49.5 and 36:01, each flattened at the slab's face and placed by the balance cap on the model's balance and the fourth's setting on its fourth arbor (`E:\mc-video\oq\cockfix2`: clean_lb.py, trace1349.py, trace36.py); the two traces agree to a median 0.24 mm (0.66 at most). Built as exact arcs and lines fitted to the trace's runs (each 0.02-0.08 mm rms; a run that fits a circle is a circle): the top edge r 28.84, the long convex edge r 28.35, the concave edge round the escape opening r 7.12 (as below), the corner by the far lug r 3.90, the end straight, the upper-left and right edges r 42.35 and 32.54. It is one level, 3 mm, with no chamfer step under it (the owner: "only 2 levels, clean and machined"; `LB_LO2`, the convex edges and the end 0.8 in, 0.4 deep, until then). It drops the earlier slab's bulges round the model's arbors and its longer far end (2.5 mm). **The lugs since 18 October 2026** (LB_UP): traced by hand by the owner on 36:01 (lowerbridge_36-01_lugs.png), exact arcs fitted, 3.5 thick (their sides traced down to the train bridge's underside), since 19 October 2026 each swept along the shift that puts its traced screw where the screw comes up through the train bridge, so it spans its traced place (its sides running on from the slab's end corners, as traced) and that one, its long sides straight (the owner's choice; slid alone, the lugs left the posts standing off them as blocks and slots and the slab's 9 o'clock end 2.6 mm past its lug): a ring with the screw's end in it on KLUwI2UUCMQ 23:30 and 13:44 (through the holes the bare plate places), where the heads land on 36:01 (0.1-0.2 mm) and on the phone photograph of another Model 21 (0.06, 0.48; `tools/edgetrace.py`), 2.2-2.6 mm from where the trace placed them through a camera 36:01 can't support (PROVENANCE.md); moved so, the 3 o'clock lug lies on the photograph's lug along every visible edge, and stops at the slab's concave edge round the escape opening (r 7.12), where the photograph ends its corner, 0.18 mm clear of the escape wheel's tips; the pins with them; the posts (`LB_WALL`) exactly where the slab lies over its lug, so each end is one block, the slab's end face flush down onto the lug's (KLUwI2UUCMQ 13:48.6, 36:01; wcYqdgpyggQ 19:38.1-19:39.2, the 3 o'clock end); the slab's three end corners where the lugs meet it sharp, lug, post and slab sharing their vertices along every common edge, so their side faces are one face, and the 9 o'clock lug's lower side one face with the slab's convex edge, along its tangent at the corner (13.9 deg; the trace's 16 left a 5 deg crease); each lug's traced arcs meet at their intersections, so its outline has no jogs, and the whole bridge is drawn as one mesh, so no seam shows between slab, posts and lugs (the owner: "smooth it"). The 9 o'clock post and lug are bored round the train-blocking screw (r 1.15, the slab's seat), which since 19 October 2026 stands at its access hole in the train bridge (23:30, 13:44) and passes down through them. No column stands round the train-blocking screw: main's (after Fig. 110's section, partly schematic: it draws the lower bridge against the train bridge) shows on no frame, and the owner judged the real bridge has none; the screw is threaded through the slab, its head seated 0.6 into the slab's top and, raised, in the train bridge's access hole. **Estimated**: how far each lug runs under the slab (the traced lug swept along its shift; hidden on every frame, the owner's side views (36:41-36:45) included); the 9 o'clock lug's lower side, made one face with the slab's edge, up to 0.49 mm further out than traced at its far end, and its far corner's traced round (r 1.25) set tangent to it; the slab's three end corners by the lugs made sharp where the trace has 0.3 mm rounds (about 0.2 mm out). wcYqdgpyggQ 19:38.58 has the 3 o'clock lug perhaps 2 mm narrower across, through a camera that puts slab-level points 2-3 mm off (not taken). Until then hull-shaped walls joined lugs and slab and a wall ran along the slab's top edge (`LB_TOPW`, from 1 mm off the train bridge), which made more than two levels. The lower bridge against the train bridge's holes, open until 19 October 2026 (the frames turned it about 7 deg against its lug screws), is settled: the balance stands at `L.B` (13:44, uncropped: its lower jewel 0.57-0.67 mm from it), and the lug screws at their rings (PROVENANCE.md, "The balance's place and the lug screws"). The rest of this entry is the slab as it was until then, and the lugs as they still are. It was measured on the restoration video at 13:49.5 (the upper train bridge held underside up with the bridge on it, face-on at 4K) with `tools/framecam.py` (`tools/anchors/lower_bridge_13-49.5.json`): the frame's homography, fitted by `video.py anchor` on the train bridge's rim (r 40.5), its cut round the barrel and the centre bushing (0.2–0.3 mm rms), gives the camera (focal length 6000 px, where the face's two axes come out orthonormal; 5000–7000 move points 0.5 mm or less), and the picked outline goes back at its height: the slab's face 7.9 mm off the train bridge's underside, the lugs' 3.3 (the side views). In the train bridge's frame (turned with the photographed group since the 14° turn: the outline, its circles, the lugs and the screws go through `PT`), the slab is a lens: an outer edge on a circle of r 20.8 (0.2 mm rms over 13 points) round from the 3 o'clock lug past the centre arbor, a flatter convex edge (r 25.7) to the fourth's end, a straight edge across it and a short one to the train bridge's escape lobe, and a concave edge on the lobe's circle (r 7.14 about (13.81, 15.51), 0.04 mm rms; finding 18 under Elsewhere read the lobe at r 7.0 about (12.6, 15.4) from above); a chamfer about 1 mm wide round the convex edges and the end (0.8 in the model, drawn as a step: `LB_LO2` is the underside). The lugs are the video's (their faces traced), the screws at (20.70, 7.23) and (−9.18, 21.87), 33.3 mm apart. Where it differs is round the model's own arbors, which stand off the real ones (on the video the cap is 11.0 mm from the fourth's setting, the model's balance 18.9 from its fourth arbor; `Review-results.md`, "The balance lower bridge", 14): the model's balance is 5.2 mm from the real cap and its fourth arbor 3.8 from the real setting (the fourth doesn't turn), so the slab bulges about 1 mm to keep 1 mm of metal round the cap's counterbore (r 4.3) and the fourth's sink (r 2.7); the model's escape arbor stands 0.5 mm inside the lobe's circle, so the slab has a bite of r 2.4 round it for the pinion to lift out; the third arbor, which doesn't turn either, stands inside the turned slab and has a slot to its edge, 1.0 mm clear; it keeps clear of the far screw's head, and the 3 o'clock lug 1 mm off the escape wheel's tips. The far lug is the video's less where the model's detent (1.0 mm off), the pillar (0.7), a barrel-bridge screw and the balance locking arm's screw and stop pin stand, which on the real movement are elsewhere. The turned detent crosses the slab beside the fourth arbor, so the train-blocking screw keeps a column of its own at (−3.70, 26.50), 4.5 mm from the fourth arbor, with a boss of the slab round it (the video has its dog point 6.9 mm out, toward the far lug). The upper level is 2 mm thick, the steady pins r 0.4; the lower is the 3 mm plate of the side photograph, with the cap's counterbore (r 4.3) and the fourth's sink (r 2.7) 0.4 deep in its underside, so the balance's lower setting, jewel and cap and the staff's lower pivot sit 0.4 mm nearer the train bridge than the slab's underside. The access hole in the pillar plate (RMG No. 4E019) is under the screw at the 3 o'clock end.
- The pillar screws' heads (42055) are measured on the side photograph: r 2.77 and 2.0 tall, a head standing on the barrel bridge in profile at its 18.93 px/mm (±0.1 mm); their shanks are half that, estimated. The detent support block's screw (42056) is sunk flush in a counterbore in the train bridge (10:46: head r about 1.0, counterbore 1.4, against a pillar screw's head in the frame; ±0.15); the counterbore's depth estimated.
- The pillars' profile is measured side-on on the restoration video (KLUwI2UUCMQ 42:56, scaled by the 16.8 mm height, ±0.15 mm): a straight shaft r 2.7 with a collar at each end, the foot r 2.9 over 3.3 mm and the top r 3.3 over 3.4 mm. The barrel pillar is not the train pillars' shape: on the same video (13:06, beside the barrel) a cone: a wide foot (r 3.2-3.4 over its lowest 3-5 mm) narrowing steadily to r 2.25 just under a groove 14.0 mm up, a body r 3.0 above it and a boss r 1.75 on its top, its left edge traced row by row on 13:08 and scaled by the body's radius and its own height (r to about 0.3, heights 0.5; the body's r 3.0 itself estimated, from 13:06 by eye).
- The train-bridge and barrel-bridge screws. Their positions come from the top-view photograph; the manual gives three screws for each bridge. Which bridge each belongs to is read from the photograph (heads proud of the barrel bridge are its own; heads sunk in clearance holes through it belong to the train bridge, below), from the barrel bridge laid flat (C Spinner 23:30: through holes at pillar 0 and over the train bridge's third screw, a screw hole at pillar 2) and from the movement with the barrel bridge off (BunnSpecial 12:05: the train bridge's screw at pillar 0 in place, nothing at the far horn's screw). The barrel bridge: its pillar screw, one near 3 o'clock and one in its far horn, both into the train bridge: their heads on C Spinner's 6:49.0 (and 6:29) through the camera fitted there (the bridges' rim at r 40.5 among its fit) put them at (35.18, 8.06) and (−24.85, 26.27), r 36.1-36.2. The near one is at (32.90, 6.60) since 15 October 2026 (`movement.js`, `S.bb`); the far one at (−22.96, 25.82) since 19 October 2026: its tapped hole in the train bridge on 23:30 and 13:49.5, through the homographies on the holes the bare plate places, ± 0.3 mm (PROVENANCE.md, "Step 3, continued"). The top-view photograph has the same two heads 4.5-4.9 mm inside the rim (r 35.6-36.0); its five-screw map, about 10 % small near the rim, placed them at (28.99, 7.95) and (−23.88, 22.98) (photograph (32.11, −4.1) and (−11.07, 26.46) through `PT`) until 12 October 2026. The train bridge: screws into pillars 0 and 1, and a third at (32.25, −10.81), at the end of the tongue beside the notch's mouth, its head sunk flush in the 5.3 mm counterbore the video shows there (23:30, 36:26; the head's size and the counterbore's depth estimated). It was at (29.24, −12.28), from the top-view photograph's five-screw map, which fits the model's own screws and so shares their layout; the train bridge laid flat has no hole there. On the video (36:34) the third screw goes down into a pillar, as the manual has all three (Op. 14); in the model it does too, the third train pillar under it at (34.13, −3.41), where 34:30 and 40:08 measure its foot (`PILLARS` in `movement.js`; until the pillars were measured a pillar there would have stood in the fusee wheel and the screw was threaded into the bridge alone, `Review-results.md` 21). Figs. 29, 67 and 110 draw three train pillars without fixing their places (`IDEAS.md` 1.2).
- The wind indicator's pinion (see the tooth counts). The hand's sweep, `UD_SWEEP`, comes from the train (313.6° in 56 h); every dial's scale is drawn on it through `UDA` (movement.js), so hand and scale agree. The photographed Hamilton dial's ticks, 8 h apart, give 315.7°.
- The Hamilton dial's proportions. The sub-dial centres are fixed by their arbors (the seconds 21.6 mm from the centre, 0.45 of the dial's radius; the UP–DOWN 22.9; until October 2026 the print put the seconds at a fixed 0.472 of the dial's radius, 1.5 mm off its arbor), and the print is the photographed dial's scaled by the seconds' centre (0.535 of its track's inner radius): the track r 40.4-42.2, the seconds track r 17.9, the UP-DOWN ring r 11.2 (measured: `References/VIDEOS.md`, "The Hamilton dial's proportions"). On that dial the UP–DOWN sub-dial is 1.107 times as far out as the seconds (1.12 on the restoration video's dial side; the model's 1.06). The model can't take that: its indicator wheel, tips 30.6 mm across (120 teeth, module 0.2512, from the fusee 16.58 mm away; 32.5 at module 0.266 and 17.6 mm until 20 October 2026), would then reach past the mounting ring's bore; its stud is 22.9 mm out, as the video has it, and its teeth pass the bore (r 39.0) in the ring's relief round the 12, and the wheel lies between the pillar screws' heads and the hour wheel (open: `Review-results.md`, "Elsewhere", 19). The plate engraving's block is 2.5 mm nearer the rim than on the top-view tracing, to clear the dust-seal flange.
- The fusee's top: the slotted top layer and the top plate (r 8.21, 0.2 inside the rim round the recess, `capR`: 7.95 `FK` + 1.4; r 9.15 in this note until 25 October 2026) with its two screws (at r 7.0, and the steel collar r 3.0 on the arbor, measured on the restoration video, 13:30, which stands on the hub and rises through the plate's hole, r 3.05, as Fig. 28 draws it: the plate comes off over it, 19:58-20:00; its height, 2.8 mm over the top layer, measured side-on at 20:00 against the groove's pitch, so it reaches the barrel bridge, 0.05 under it, the arbor's shoulder under the bushing). Sec. IV describes the stop-bar's mechanism (the chain bears on one end, the other moves out to the winding stop), not its dimensions.
- The stop-bar (42024), its spring (42025), the fusee's top and the winding stop (42099), measured on the restoration video (KLUwI2UUCMQ, 4K; the fusee's top in `makeFusee`, the stop in `buildMovement`): the bar 15.0 ± 0.6 long, 1.8 (1.6–1.9; drawn 1.9) wide, its edges 2.9 and 4.9 from the axis, both ends slanted the same way (a parallelogram, about 20° from square: 20:01.23 rectified), a small step on its underside 0.52 ± 0.03 of the length from the chain end (20:04.29, moderate; Fig. 28 draws a plain bar), the stop end 0.8 of the chain end's thickness, read as ratios within one frame (20:04.27, 21 px against 27; 26:23.75 side-on, 39 against 46; moderate), a round hole 0.5 ± 0.1 across in its inner side face 0.27 of the length from the chain end, which the spring's end goes into sideways (25:14.47–25:17.47, sure); which end is the chain end from 25:40 and 26:05–26:23; released, it lies centred in its slot (20:01.23, and 26:23.4–26:24.5 side-on: within ±0.2); the chain pushes it 1.9–2.5 (13:16.0, 13:26.14; drawn 1.98, from its outer corner to the chain's inner face), and the tweezers to a hard stop at 2.44 ± 0.12 (26:15.6–26:20.2), not drawn: what it is isn't seen; the fusee's top a slotted band 1.15 deep (as deep as the chain end reads), the slot 1.8–2.1 wide and open at both ends, its floor flat across (25:04), the chain end's lower face level with the band's and 0.0–0.3 over the chain's links on the top turn (37:22.3–37:26.6, the chain laid on by hand), so the top turn drawn 0.34 lower than before; the recess r 5.1 (the spring's wire hugging its wall: 20:01.23, 25:13), a plate in its floor with the two tapped holes 0.8 across, their centres 4.27 out on the diameter along the bar (25:08.26; the "balls" of 20:01.23); the spring a wire 0.30 across bent to a C on the floor, its fixed end down in the hole on the stop end's side, past the other, then in to the bar's side hole (25:10.6–25:17.5); the stop a plain stud 2.3 ± 0.2 across and 5.5 ± 0.5 long, its end cut by three grooves running along the line to the fusee (+3 ± 4°: 13:04.0, 13:04.2), at (4.0, −19.9) ± 0.5, 11.6 from the fusee's axis (12:58–13:04, mapped on the bridge's bushings). Estimated: the chain end 1.5 thick (the stop end 1.2, 0.8 of it), its lower face 0.4 under the band's, where the reading has it 1.1 ± 0.2 and level with the band, and the slot's floor and the recess cut to it, 1.55 deep (the slot read 1.1–1.6 deep at 25:04, the recess 1.2–2.0): drawn as read, the chain end stood 0.22 over the links where the chain meets it (the top turn there 0.13 lower than at its start) and the band covered the chain all round, so no link could touch it, where Sec. IV has the chain bear on it; now the incoming links reach 0.09 up its end as they first touch it and 0.18 once wound under it, and its travel is worked out from the drawn chain (each end corner kept out of the wound turn and the incoming run); the slant drawn as one 20° line through each end's middle; the side hole's depth (0.6, blind) and its block's size; the spring's height between the floor and the hole and its tip's bend, the holes' depth (0.6); the stud's thread (r 0.8, 2 mm); no turned flange over the top turn (the band is the rim there). Open: at 37:22.323 the released chain end reads about 1.5 mm proud of the rim, where 20:01.23 and 26:23 have both ends inside the plate's edge; the hard stop's cause; how deep the chain end really reaches into the links (OPEN-QUESTIONS.md). Until 12 October 2026 the bar was 14.6 × 1.0 × 0.45, square-ended, with an estimated nose into the groove, and the stud r 0.9, 3.2 long, about 108° round the fusee from its measured place; then, the same day, the spring's end was drawn hooked up into a hole in the bar's underside and the top turn 0.34 higher; until 13 October 2026 the chain end was drawn 1.1 thick, level with the band, and slid in on a formula with nothing touching it, the recess 1.15 deep; until 15 October 2026 the stop end was drawn 0.7 thick (the absolute reading at 26:05-26:23), a step of 0.8 against the 1.5 chain end, where the frames' ratios give 0.3.
- The shapes of the springs: the winding-pawl springs (long arcs round the wheel's middle from a two-screw foot back to the pawl, as Figs. 28 and 69 have them, each in its own bed cut in the sustaining ratchet's face: the beds' centres traced every degree on 19:12 (4K, rectified on the ratchet's tips, the springs off; 19:15 and 19:20, lit from one side, show the sunk bed between a raised middle and the face outside), 0.6 wide, one at r 8.9-8.7 turning in to r 7.04 before its foot, the other at r 9.3-9.1, their angles counted from the pawls' studs where they truly stand, opposite each other (the underside face-on at 28:35, and the four screw holes on 19:12 symmetric about the studs' centre: until 15 October 2026 from the studs as 19:12 shows them, 172.6° apart); the feet's screws measured, the same for both feet, 132.0° and 161.8° round from their own pawl at r 8.15 (28:35 and 19:12 within 2°; until 15 October 2026 29-32° apart at 124-171° and r 7.8-8.35, read from the displaced studs); a hole through the wheel beside each pawl's arm, r 0.66 at r 6.8, 13.6° from the stud toward its tip (seen through from both faces, 19:12 and 28:35), what for unknown; the pawls grey steel, their studs r 0.385 filling the pawls' holes (19:12: 0.38-0.46; r 0.22 until 15 October 2026); estimated: the beds' depth (0.2), the springs' blades (0.3 wide, standing 0.5 from the bed's floor) and their finish (polished steel, as the setup pawl's spring is at 11:58; blued until 15 October 2026, from no source), the feet's pockets' outer walls, their far ends (past the far screw) and the second pocket's inner one (lit or in glare on the frame), the feet, drawn filling their pockets, and the springs' pins (42007 is "complete with pins"; a small hole r 0.38 at r 8.1, 108° from each foot's own pawl, shows on the underside at 28:35 but not through the face at 19:12: not drawn); the beds' radii read about the bore's edge, which on 19:12 is 0.56 mm off the studs' centre: about the studs' centre the two beds come out 1.4 mm apart in radius, not 0.4, so each is good to about 0.5 mm), the stop-bar spring, the sustaining pawl's spring's top (a straight wire set upright in the pawl, as the video has it, 35:37.5-36:15; its top end taken to stand in a hole through the train bridge, where two small sunk holes stand side by side on the bridge's face over it, 36:23-36:29, and its preload, the pawl turned 0.12 rad in from its seat there) and the setup pawl spring's thickness and height (0.3 and 0.85 mm) and its pins' places: it runs about half a turn round the ratchet at r 8.98 (the video: 1.23-1.31 of the ratchet's tip radius) from two steady pins to the click's back, as C Spinner's video (11:58) and Fig. 108 have it. The setup ratchet's 42 teeth are counted on that video to about ± 2 (`References/VIDEOS.md`), its tips at r 7.05 (the video at 11:58, against the cover screws' tapped holes 23.6 mm apart: 7.04; the top-view photograph through `tools/topview.py`'s map: 7.0-7.3); the cover's pads' height (1.4: the step's parallax on 11:52 gives 1.5 ±0.3, not side-on), its plate's thickness (1.1), and the places of its outline's centres to ±0.2-0.3 mm (one frame's map on three holes nearly in a line: the click's hole, read free, comes 0.53 mm from `S.click` across that line); the arbor's square about 7.5 mm over the ratchet (the video: 8–10 mm, rough). The setup pawl turns on its pivot screw, put in from under the barrel bridge (Op. 41, Fig. 80), whose end shows in the cover as both photographs show it, 8.95 mm from the barrel arbor (2E12055 8.94, the top-view photograph 8.95, each through its fitted map; the video 1.34 tip radii, 9.4); the tip at the teeth's root about 34° round, the click 5.07 mm from pivot to tip (the video about 5.1 in the ratchet's measure, the top-view photograph 5.1). The fusee's large end has a rim 0.4 tall (estimated: as tall as it can be, 0.1 clear of the sustaining ratchet and its pawl) round its recess, its inner edge 0.84 of the end's radius (18:20). The dust seal is in its proportions on the video (6:29: the packing 0.42 of its diameter tall, the column about 3.5 mm, the flange r 8.6), its flange with a shallow concave bite between the screws on the 12's side (about 7 mm wide, 1.6 deep: rough). The sustaining spring's travel from loaded to spent (`SMAX`): the fusee wheel's turn in the longer of Sec. IV's 5 to 10 minutes of drive, 9.3°. No wind outlasts it, since model time runs at most 10× while winding. The close-up's drive left and the essay's maintaining-power figure count from these 10 minutes.
- The sustaining spring (measured 17 October 2026; `References/VIDEOS.md`, "The sustaining spring traced"): its outline traced on the restoration video's face-on frame of the wheel alone (KLUwI2UUCMQ 27:26), the frame rectified on the tips' ellipse about the recess wall's centre and scaled to the wall (r 17.97 before `FK`), the edges where CIELAB's b* (yellowness) crosses halfway between the steel's and the brass's (brass stays yellow in shadow; a threshold on brightness or saturation read shadows as steel), every half degree, the band's inner face taken off where the frame's 19° tilt shows it, smoothed over 1.5° (5° on the plain band): `SSI` in `movement.js`. The band tapers, about 1.6 mm wide (×`FK` 1.4) over the 90° after the working lobe, 1.8 over the next 90°, 2.1 toward the fixed lobe (2.1 uniform until 17 October 2026); the working lobe a teardrop round its pin (36°); the fixed lobe 90° from where it leaves the band, a bulge round each hole and a waist between; the tips' ends round (`SFT`, `SWT`: traced again 18 October 2026 as outlines on rays from inside each nose, so they leave the inner edge and meet the wall as the frame shows; until then a quartic in r fitted to the gap at each radius, which met the inner edge at about 50° and the wall at a point). The fixed nose a D, round from the inner edge over 6°, its top edge's highlight followed round to the wall (b* reads the black shadow beyond it as steel); the working nose round from the inner edge over 4.4°, its end face the 19° tilt shows taken off. Its whole outline, `SSI` and the tips, is the owner's hand trace (18 October 2026, `tools/tracer.html` on the frame rectified at 40 px/mm), the faces the tilt shows taken off (the trace's inner edge 0.29 mm further in on the far half than on the near: the band's inner face), the band's outer edge, against the wall, left as it is. The gap where the tips come nearest is 17.4° (the relaxed travel `SMAX`, less the banking, 16.9°), as the loose spring's 16-18° (18:58.0); the automated trace that day gave 17.8° (b*, the same faces off), the hand trace as drawn 16.4° (the working tip's end face in it), the first reading 12.5° (a shadow and an end face taken as steel; 20° read at the wall until 17 October). The holes and the pin, measured on the same frame, stand 8.6° from the fixed tip and 8.0° from the working tip. The b* trace's inner edge lay 0.1-0.35 mm further in, the lobes the most: the band's free part is 1.71 mm wide on average by hand, 1.81 by b* (before `FK`). NAVSHIPS 250-624 Fig. 70, rectified on its wall's ellipse, draws the same bulges, waist and round tips; its band is narrower and its lobe starts with a step (a line drawing; the photographs decide). The pin is in the hole farther from the tip (its centre steel grey; the other shows the floor's brass through it: likely). The band's height, 0.96 mm (1.1 ±0.2 before `FK`), from the wheel tilted 55-58° (28:42.5, 28:43.0: the band's top and inner faces between the wall and the floor at the frame's radial and axial scales, the band's width there known), its top flush with the rim, so the recess is 1.0 deep (1.3 until 17 October 2026, estimated; the raised disc and hub moved up with its floor, their heights over it still estimated). Loose (18:58.0) its tips stand about 16-18° apart, as in the wheel. Its push from its section (`tools/sustaining.js`: Castigliano along the band from pin to pin, the width varying: 0.36 N·m a radian, banked over its 16.9° pushing 0.28 of the solved mainspring's drive, `SPU`, 685 MPa, 1.8-2.6 times short of hardened spring steel's yield; 0.33 and 747 MPa from the automated trace, 0.22 and 509 MPa over the 12.5° gap first read, 18 October 2026). The key held, the swing falls under a turn within the first minute and the chronometer runs on 10.5 minutes: the manual's "enough power to drive the chronometer for five to ten minutes" (Sec. IV) read as the time it keeps it going (the owner's reading, 17 October 2026) and as the least it gives (the owner's reading, 18 October 2026: the measured outline and height give half a minute more; `sustaining.js` reports it, `~~`; until then the time it kept the balance over a turn, which the designed band, 1.45 high and 2.1 wide, pushing 0.82, gave in 7.5 minutes and no band the recess holds can give at the traced width). Over its readings' uncertainty (the height 0.78-1.14, the width ±0.1, the gap 16.4-18.4°) it pushes 0.17-0.42 and runs 5.4-14.1 minutes (`estimates.js`; 7.6-15.2 over the b* trace's outline, 3.9-7.8 over the first reading's gap). Still estimated: the elevations' heights, the spring's steel's modulus (207 GPa), and its loading as a band pinned at its two pins (its rest against the wall left out).
- The maintaining work's ratchet teeth. The winding ratchet's 36 teeth on tips r 6.9 are measured (18:20, 23:30), and the sustaining ratchet's 120 (28:35) on tips r 16.55, measured side-on against the fusee wheel's tips in one frame (SNLqsS9wrrM 4:20–4:28: 0.918 of them, on both edges, so no scale is assumed; ±0.2), its teeth standing past the fusee's large end as KLUwI2UUCMQ 28:46 and 17:39 show them. Until 18 October 2026 its tips were r 14.5, a module (0.27 FK) chosen when the fusee was laid out and from no source; 19:12's and 28:35's readings on its face (the winding pawls, their studs, beds, feet and screws, the holes) were scaled on that radius and are kept in millimetres, since at that scale the pawls' ends land on the winding ratchet measured on its own (r 6.9 ± 0.3): on the face they now stand at 0.52 of the tips where those frames read 0.59 (OPEN-QUESTIONS.md). The winding ratchet's teeth are 1.5 modules deep (0.55 mm; `WRT.d` modules, `ratchetProf`'s and gearGeo's `rd` in mm), measured face-on at 18:24.5 (4K, the end plate off): the steel-to-gilt edge traced along rays over five clean teeth, 0.47 ± 0.03 of the pitch deep, their backs straight from tip to root; until 11 October 2026 the gear convention's 2.25 (0.82 mm, 0.68 of the pitch). The sustaining ratchet's depth is still the convention (2.25 m, 0.61 mm), not measured. Their locking faces are drawn along a radius (`ratchetProf`, gearGeo's `'radial'`): the winding ratchet's look so at 18:20 (oblique, to the frame's resolution) and the winding pawls' square ends lie along a radius at 19:12 (within 1°); the sustaining ratchet's aren't seen and are drawn so on the same grounds (a face leaning back pushes the pawl out under load). The winding pawls are traced on 19:12 (`WPO` in `movement.js`, ±0.15 mm): seated, their ends go 0.37 mm into the 0.55 tooth, the flare on their inner side meeting the back of the tooth behind, and bear on the locking face's upper two thirds, the load drawing the pawl in; a flare a little narrower (inside the trace's ±0.15) would seat them to the root. The sustaining pawl (36:15, traced) goes 0.33 into its 0.54. Their ends since 25 October 2026 are 27:00's right pawl, lying flat (corners picked on the flattened frame, ±0.05 mm: 2.19 across, 2.42 before); the other pawl reads slimmer there with a band across it near its end, a step or a tilt not measured, and is drawn as the first. The sustaining spring's working pin, r 0.51 (27:26), goes through a hole in the sustaining ratchet, r 0.71 on 27:00 and 19:12 (cut since 25 October 2026; before, the pin stopped on the ratchet's back): estimated, its shank's depth (to 0.05 inside the pawls' face) and why the hole reads wider than the pin (a chamfer or clearance).
- The fusee's stack, side-on (SNLqsS9wrrM 4:20–4:28, the chain let down: the silhouette traced row by row at 16.25 px/mm, the wheel's tips and the groove's pitch agreeing): the fusee wheel toothed over its whole 2.22 mm (a plain rim over 1.2 of teeth until 18 October 2026), the sustaining ratchet 1.18 over it, 0.05 off, the fusee's rim 0.45 (r 16.3, 0.3 proud of the band) and the large end's plain band 0.98 (r 16.0: KLUwI2UUCMQ 17:49, 16.15–16.4 an upper bound; R-DrJz1DYOY 2:22, 16.1; this frame's right edge 15.6–15.8). The wheel's face toward the plate kept at −5.9 (the frame puts it 2.2 over the plate; the model 2.04). The recess's depth is the spring's band's, so the floor, the raised disc and the hub moved with the wheel's top (0.78); the ratchet's face toward the fusee, its pawls, springs and the fusee's large end with its winding ratchet 0.45; the sustaining pawl to the ratchet's toothed layer (4.5–5.1 mm over the plate, 36:15's 4–5.5). The thicknesses of the floor, raised disc and hub inside the recess are estimated. The chain's fusee end: an S-shaped hook (17:43, off) into a slot in the band (SNLqsS9wrrM 4:24: 3.5 mm long, 0.49 tall, at the band's top under the last link; KLUwI2UUCMQ 17:49 shows it): the slot cut from the end link round the way the groove runs on, down to the hook's nose (the end pin, `fPin`); the slot's depth and the hook's form are estimated, and its angle against the groove's end is not measured (the end is placed by the run-down, `ME`).
- The setup ratchet's locking faces: undercut 3-6° on the video (38:25.8, 38:26.0, `tools/ratchetface.py`), drawn undercut 4.5°, their middle (`SRU`; the readings spread 4-5° tooth to tooth, so the size is an estimate within them; radial until 14 October 2026); a face leaning back, as drawn until 11 October 2026, is ruled out. Its teeth's depth, 0.48 mm (`SRD`), is measured on the same frames, and its click is seated on its outline (`phaseAgainst`'s `deep`), 0.43 mm inside the tips and 0.04 off the root.
- The barrel arbor's core, drawn r 4.9 (12 October 2026; r 1.74, estimated, until then): measured, three readings on two 1941 movements, r 4.8-5.7 (KLUwI2UUCMQ 33:20.5, the cap off and the arbor in, and 33:06, the spring's inner end curled at 0.30-0.34 of the inside radius; TN24H 3SFDplGq6vs 0:16, 0.326 of the outer radius), drawn at their low end, where the videos' 0.394 strip winds the fusee's turns and a set-up of about one (on r 5.0 it has about 0.15 turn to spare, on r 4.8 0.4; `tools/mainspring.py`). Estimated: its height (its ends 0.1 clear of the caps; no frame shows it side-on), a plain cylinder, and the hook (0.9 along, 2.4 tall, 0.5 deep, against the eye's end); the brace's thickness (0.25), the window its anchor pin sits in, the barrel's fixed hook's size and where round the wall the brace lies (its reach, 255°, from the Royal Museums Greenwich catalogue's "just under three quarters", rough; the wall's 1.95 is measured, 0.11 of the radius on three frames of two movements); the end plate and taper pin (the plate gilt brass, r 7.0 or less to clear the centre wheel, with a raised boss round its hole and the slot of Ops. 27–29 across the boss, as Fig. 69 draws it and the video shows it, 18:22, 18:25; the boss's r 2.2 estimated; the 9.6 mm pin's ends standing out past the boss), the winding ratchet's 36 teeth (the video, 18:20: likely, not certain), and the chain's end pin and hook (its nose through a hole 0.7 mm across in the wall, as Figs. 17 and 75 have it; the hole's size and the nose's place, 0.85 mm past the last link, estimated).
- The chain's links: figure-eight plates (Fig. 38) 0.9 mm high and 0.18 thick, three deep along the arbor, riveted at a 1.7 mm pitch (the side photograph's chain on the fusee, 1.55-1.76, and KLUwI2UUCMQ 23:45, the chain on the mat, 1.71-1.85; 1.0 until 4 October 2026); the plates' height is measured there too, their thickness estimated. The chain is 566 mm along its pitch line, end pin to hook (333 pitches; 586 until 11 October 2026, when it ran to the groove's end); one sale listing gives 28.5 in (724 mm) for the Hamilton's.
- The chain's end on the fusee (`ME`, 8.54 turns down the 8¾-turn groove, 0.21 turn short of its end): placed so that run down, where the chain's line from its end pin passes through the fusee's arbor and the fusee's torque is gone, falls at the manual's 17½ half turns from full wind (`RUN_H`). No source shows where the chain ends; with the chain to the groove's end the fusee would turn 8.96 turns to that rest (17.9 half turns).
- The mainspring's thickness, length and lie. **Its thickness, 0.394 mm, is the videos', not the parts list's** (12 October 2026, the owner's decision): the coils' pitch on KLUwI2UUCMQ's let-down spring, read round the whole turn (1/41.0-1/41.8 of the measured barrel's inside radius, 15:54 and 33:06; one coil a stripe, as the winder's collar's separate coils agree), at most 0.394 inside r 16.3 (0.38-0.41 over the barrel's measured range); TN24H's spring reads 0.374. **The parts list says 0.0165 in (0.419 mm) and the British Museum's late Model 21 0.44: the conflict stays open** (OPEN-QUESTIONS.md 1). The museum's proportions match the videos' and would fit a barrel 10 % larger than the one measured (r 18.2 ± 0.5 on two routes); on the measured core in this barrel the parts list's strip is coil-bound short of the fusee's turns and a set-up. Its length, 1,064 mm, from the videos' L/t, about 2,700 (the pack's area over the pitch squared, no scale needed: 2,630-2,790 on two movements), as their frames give it, about 1.1 m (0.9–1.25; 15:54, 32:30); half the room would be shorter. Its width (13.55) from its cap-side edge, 1.45 under the barrel's open face (KLUwI2UUCMQ 15:54, ±0.3; the floor-side gap, 0.3, estimated). No catalogue gives it: Hamilton's material catalogues of 1947, 1951 and 1953 (NAWCC's scans) leave the marine chronometer's parts out ("Materials for all war timepieces, therefore, require separate inquiry direct to the Material Sales Department"), and their mainspring chart lists watch sizes only. How it lies is solved from its natural curve ("The mainspring, solved"), measured on the video's free spring; the solver leaves out the coils' friction, and its slack (13.25 turns, to about 0.25) rests on the length and core. In the model's barrel, on the core r 4.9, the fusee's chain needs 4.61 turns on the barrel, with a set-up of 0.89 turn past the slack (the fusee's rule: where the solved spring's pull falls over them as the fusee's measured profile evens out, 0.510 on the chain's pitch line; Op. 53: "wind barrel about one turn"), fully wound 0.60 turn short of where the coils bind on the core (19.35 turns, `mainspring.py --bound`), the coils packed at the videos' pitch with no film (estimated: no source gives one; 0.01 until 12 October 2026, which left 0.33 turn). The room rests on the core, r 4.9, the lowest of its readings: on their mean, r 5.2, it would be about 0.2 turn (OPEN-QUESTIONS.md 1). It rests on the solved pull, which leaves out coil friction (2.0 % running, `mainspring_friction.py`, though tens of per cent in the last half turn before coil-bound) and the free curve's 15 %; the set-up was 0.37 (estimated) until 5 October 2026, then 0.47, 1.0 and 1.26 on the parts list's strip and the estimated r 1.8 core (the slack's place is read to a quarter turn, the grid of the solved states, so the set-up is good to about that). The eye in its inner end for the arbor's hook, drawn as 15:54 shows it (an oblong about 7.2 long and 5.2 across, 2.2 from the end, rough ±20 %), and the anchor pin at its outer end (the parts list's "complete with anchor pin"), in a window through the brace near its leading end (the RMG catalogue: "a fixed hook in the mainspring proper locating in a hole in the piece"), are estimated in size and place.
- The detent's dimensions.
  - Its lengths along it are measured on KLUwI2UUCMQ 11:10-11:33 (the detent out and held up, four frames by bundle adjustment on the block's two positioning pins, 10.12 mm apart; Fig. 90 scaled by the same pins agrees along the detent to 0.1-0.3 mm; `E:\mc-video\oq\ledger\detent`) (since 20 October 2026; until then Fig. 90 scaled by an 11.3 mm flexure-to-jewel, 12-17 % large): the locking jewel 10.1 ± 0.3 from the point of flexure (`BL` 10.21 to the locking face), the detent spring 3.30 to the cross-piece (BM 117A's strips 3.5; Fig. 90 3.38; 3.82 before), the cross-piece 0.42 wide, the jewel block 0.9 long and 1.26 tall with the stone's top 1.75 above it, the arm bent 1.15 past the locking face, the trip spring 6.45 free (its tip under the horn's tab) and its band 0.37 tall, its bracket a Z on the blade (its leg on the detent holding its screw, the leg across 0.3, the leg along carrying the trip spring's foot), the block's steady pins 6.8 apart and its clamp screw between them, the block's own positioning pins Ø 0.85 standing 1.1. Positions along the detent are good to 0.15-0.25 mm; across it (n) only to about 0.5, so the parts' places across stay Fig. 90's. Its construction follows Figs. 14 and 110 and the chronometerbook photograph; thicknesses (the spring's 0.079, the trip spring's 0.041, the blade's 0.2) are estimated. Two readings stay open: the trip spring's tip stands 2.4-2.6 mm past the stone on the frames and 3.07 in the model, whose tip `rT` places about the staff for the manual's figures (the bracket is drawn from the trip spring it carries, so it stands about 0.5 further along than measured too); and the stone stands 7.9-8.0 past the block's right positioning pin on the frames, 8.30 in the model, where the block's holes in the train bridge (23:30, 13:44) and the escape wheel's lock place them (the chain's 0.3-0.4 mm; the detent-adjusting screw slides the detent along, Ops. 84, 93).
  - The support block's top face is measured (t -9.46 to +2.99 mm from the point of flexure, 2.75 ± 0.17 wide: the same frames by the same adjustment; -10.5 to +3.85 and 3.1, scaled by the pins at 11.45 mm, until 20 October 2026); the second train pillar stands 0.33 mm further out than its reading (inside the reading's 0.4 mm) so its top collar clears the block's straight edge, which 11:26 shows without a notch there. The block is notched round the third arbor, which runs up past it to the train bridge. The block's place is Fig. 90's, about the escape arbor and the balance, which stand ("Elsewhere", 18 in `Review-results.md`); the plan's handedness is not in doubt (the train turns the escape wheel the way Fig. 90's teeth lead; "Elsewhere", 16). A video reading that put the real block elsewhere came from an unreliable fit and is set aside ("Elsewhere", 12). The notch stays an estimate.
  - The detent's lift, the wheel's release and the trip spring's bending are solved in `ESC` from the discharge jewel's contact with the trip spring's tip. The spring projects past the horn, so the jewel never touches the horn.
  - The wheel's advance is solved from its teeth's contact with the impulse jewel.
- The escapement's settings. They were chosen to meet the manual's adjustment figures, measured with its own definitions (Sec. VIII):

  | Setting | Model | Manual |
  |---|---|---|
  | Lock: detent leaves the stop button, until the tooth drops off | 6.1° | about 6° (Op. 85) |
  | Let-off: tooth drops off, until the detent falls back | 7.6° | at least 6° (Op. 86) |
  | Overall: trip spring falls off the jewel on the passing swing, until the detent falls back on the unlocking swing | 28.0° | 26–30° (Op. 87) |
  | Drop | 2.2° | about 2° (Op. 97) |
  | Roller shake | 0.056 mm | about 0.002 in (Op. 84) |
  | Horn clearance | 0.25 mm | about 0.010 in (Op. 88) |
  | Angle between the jewels | 88.6° | about 90° in Fig. 90 and Op. 7 (adjustable) |
  | Locking-jewel draw | 10° | 8–12° (chronometerbook post 30) |

  - Depth of lock is 0.125 mm (`dL` 0.019, the lock Op. 85's 6°, since 20 October 2026), and the trip spring's tip lifts 0.21 mm to release. Since 20 October 2026, with the detent at its measured lengths and the trip spring 5.8 mm free and drawn 0.041 thick (its thinner tip comes clear later), `rT` 0.2884 keeps overall at 28.0° and `aD` 269.9° brings the drop back to 2.2° (269.1° left it 3.0°; at exactly 270° the unlocking roller's flats leave its face's triangulation open). Before then: depth of lock 0.112 mm, the tip lifting 0.18 mm (the settings rd 0.296, rT 0.2894, aD 269.1°, dL 0.017 of the unit and the back's radius rB 0.024, re-chosen on 12 October 2026 when the jewel's end became square at its acting corner and radiused at its back: rd 0.300 and aD 271° with a half-round end from 11 October, 0.305, 0.286, 269.6° and 0.019 before). rd 0.296 puts the jewel 0.50 mm proud of its roller, the top of what KLUwI2UUCMQ 6:58 shows (0.4-0.5, ±25 %; 0.53 before); aD sets the drop and dL is unchanged. With the acting corner square the trip spring's tip comes clear at that corner on the return, so overall wants less overlap of the jewel past the tips, and less overlap leaves less lift to spare past the release; a larger radius lets the detent off sooner at the same overlap. rB and rT were searched together (rd kept within the frames' 0.4-0.5 mm), for overall near the middle of Op. 87's range with the most escapements made to a maker's tolerances still running (`tools/errorbudget.js`): at overall 28°, rB 0.010 runs 66 % (of 300), 0.016 73 %, 0.024 81 %, and a smaller reach less; rB 0.024 (wD/2, the back half of a half round, 0.158 mm, the most) with rT 0.2894 gives 28.0° and 81 % (1,000; 92 % with the half round), the jewel lifting the passing spring's tip at most 0.28 mm against the 0.18 mm that frees the wheel. A lock deeper than about 0.18 mm (dL 0.028) no longer unlocks. (A first choice the same day, rB 0.010 with rT 0.290, the least radius within 30°, gave 29.7° and 77 %.)
  - The discharge jewel meets the trip spring at −27.3° of balance and releases the wheel at −21.2°. The wheel catches the impulse jewel at −1.9° and drives it to +20.7°.
  - The detent falls back in time (`ESC.state`, since 11 October 2026; it went home in one step at −12.4°, the stone standing 0.07 mm in the escaping tooth's way for about 0.6 ms): it leaves the jewel where the jewel's end runs away faster than it can follow (first at the square acting corner, about −18°, where it falls back onto the jewel's end and is carried on; for good at −14.10° at 255°, off the radiused back), falls as a preloaded spring and mass (Op. 78's preload, the drawn spring's stiffness, its inertia `ID` 2.609 g·mm² from the drawn pieces, `tools/dynamics.js`; 3.002 before the detent was rebuilt to its measured lengths on 20 October 2026, 2.67 before its bracket was measured 1.05 tall), first lands on its stop button at −10.77° and hops on it (restitution `eS` 0.3, estimated, as dynamics.js has it) until −7.1°; its own damping (Q about 100, estimated) is left out. dynamics.js, integrating the same detent through its contacts, has it leave at −14.11° and land at −10.78°. A detent that falls back before the escaping tooth has passed (a swing larger than the drive keeps, after a jolt or while the key turns) lands on the tooth's land or back and rides it down (`ESC.state`'s `ride`); `tools/escapement.js` checks that the stone is never inside a tooth, at ten swings from `AMIN` to 340°.
  - The trip spring flies back on the return swing where the spring's tip comes clear of the jewel (−41.6°), as the detent leaves it on the active swing (−13.6° for a massless detent): pushed along the jewel's face, then round its end. The end is square at its acting corner and radiused at its back (`rB`, 0.158 mm, half its 0.32 mm width): the British Museum's Model 21 is "set with a jewel with a radius to the back of the acting part of the tip" (*Catalogue of Watches* VI, 1990, no. 117A), and KLUwI2UUCMQ 6:58.17-6:58.33 shows the acting face flat to a sharp corner. On the active swing the passing spring's tip goes over the square corner, along the end and off the radiused back; on the return the trip spring's tip goes round the back and comes clear at the square corner, so the radius sets where the detent falls back (let-off and overall) and not where the trip spring flies back. The radius isn't given: the most, which keeps overall in the middle of Op. 87 with the most lift to spare (estimated). Until 12 October 2026 the end was a half round (`rnd`, both corners), and square before 11 October (overall about 38°). Let-off and overall are measured to the fall, as the manual's gauge reads them.
  - Unlocking against the 10° of draw turns the wheel back (recoil): the locked tooth's tip pushed back along the stone's flat as it lifts, at most 0.18° of the wheel at 0.145 mm of lift, until the flat's inner end passes the tip (`ESC.recoil`, from the shapes). Past it the tip would slide round the stone's edge and be free about 0.025 mm short of the release, where the model keeps 0.02 mm to spare (`lRel`); the tooth is held at its locked place over that stretch. The tooth leaving the impulse jewel runs on to the stone from the jewel's place and speed under the wheel's torque (`ESC.thE`, about 1.4° of the balance). Roller shake is equal on both sides, where Op. 84 prefers slightly more on the outgoing tooth. The solver, the mesh and the 2D inset share one tooth outline (`ESC.toothPts`).
- The escapement's parts beyond the plan.
  - The escape teeth: their form follows Fig. 90 and an original wheel photographed in chronometerbook post 30 (a land 0.13 mm wide at the tip, the root circle at 5.5 mm). The undercut of the locking face (the root trails the tip by 0.14 of a pitch, about 16°), the length of the hollow back (0.55 of a pitch) and its curve (meeting the root circle tangentially) are traced from Fig. 90. Fig. 14's cut-away gives the arrangement: the teeth stand the wheel's full thickness on a thin rim and spokes. The rim's inner edge (0.77 of the tips), the spokes (0.105 of the tips wide), the hub (r 0.31) and the collet's pipe (r 0.20, toward the pinion) are measured on 43:21.1, the wheel face up in the staking tool; the web's thickness (0.5), the pipe's length (1.9, off the view's tilt: rough) and the collet's foot, a collar about 0.65 tall there where the model has the web's 0.5, are estimated.
  - The impulse roller's three holes (0.5 mm radius, a quarter turn apart from the jewel, Figs. 14, 61 and 90) and the impulse jewel's section (flat on the impulse face, curved behind, thinning to 0.45 of its width at the ends; "curved side of the jewel", Sec. VII) are estimated in size.
  - The unlocking roller is measured side-on at 34:09.26 (a flatted body 2.0 long, a round end 2.57 across, 3.1 in all); its jewel's slot and the wider slot opposite (Fig. 64) are estimated in depth.
  - The trip spring is a flat strip 6.45 mm free and 0.37 mm deep (measured: it leaves its screw block 3.30-3.45 before the stone on 11:10-11:33 at every focal length, its tip hidden under the horn's tab; its band 0.36-0.39 tall beside the bracket, 11:10 and 11:24; 5.8 free, the length to the tab, 20-25 October 2026), 0.0456 mm thick (estimated: the stiffness at its tip, 5.9 N/m, that the 0.06 × 0.3 strip 7.9 long drawn until 20 October 2026 had; 0.041 at 5.8 until 25 October; 0.06 at the measured length would be 2.4 times as stiff), its foot 0.2 mm thick against the angle bracket for 0.45 mm behind its free start (estimated). No source gives these sections or the detent spring's (searched 5 October 2026: the videos, Hamilton's material catalogues, Google Patents, NAWCC's threads through the Wayback Machine, museum catalogues; `References/README.md`); the frames that show a detent out of its block are too coarse (TN24H 0:11.0, 8.6 px/mm: the blades under a pixel) or overexposed (KLUwI2UUCMQ 11:04-11:30). Sinclair's teardown in *NAWCC Bulletin* No. 365 (members only) is the likeliest source left (SHAPE-PASS.md 110-7, 110-10). Its thickness sets where the jewel meets and leaves it, so the settings above were chosen with it: the tip radius `rT` 0.2884 and the unlocking jewel at `aD` 269.9° (the jewels 88.6° apart, as Op. 97 adjusts the drop).
  - The locking jewel's wedge pin (42089, Figs. 57–59), 0.2 mm across, beside the jewel on the side away from the wheel, flush with the block at both ends (Sec. VII).
  - The balance lower endstone cap is round, R 4.46, cut flat 2.78 from the jewel on the side away from the escape arbor, parallel to its two screws, which stand 3.25 either side of it (6.5 apart) along the balance-fourth line; its window a straight bore r 1.87 over a wider endstone, its screws' heads r 0.85. All measured on KLUwI2UUCMQ 13:49.5 (the underside face-on), its edge, flat, window and screws picked at 4K and put back through `tools/framecam.py` at the cap's face (`tools/anchors/cap_13-49.5.json`: R 4.42-4.49 over f 5000-7000, round to 0.09 mm rms); Fig. 30 draws it round. Its thickness (0.45) is estimated. (It was R 2.7, the same ratios scaled by an estimated 1.9 mm to its screws, until 4 October 2026.) The balance lower setting in the slab, under it, is r 2.52, measured from above through the keyhole (13:44, `tools/anchors/setting_13-44.json`: the gilt edge put back 9.0 mm under the train bridge's top, round to 0.05 mm rms, r 2.51-2.53 over f 2600-4000; it was r 1.2, estimated); the two holes either side of it there, 7.2 mm apart, are the cap screws' tapped holes through the slab.
  - The support block's top face is measured (above; until 20 October 2026 laid out from Fig. 90, scaled by the 11.3 mm from the point of flexure to the locking jewel). Its screw and two positioning pins are where their holes in the train bridge are on KLUwI2UUCMQ 23:30 and 13:44 (since 19 October 2026; each frame through a homography on the holes the bare plate places, the two within 0.2-0.4 mm): the screw 2.2 mm from the point of flexure toward the foot, a pin 2.9 mm the other way and the other 7.2 mm toward the foot, 5.1 mm either side of the screw on the line Fig. 90 puts them on. Fig. 90, scaled, has them symmetric, 11.85 mm apart, the screw 3.7 mm toward the foot; the model drew that until then (the 5.7 and 5.5 mm once read on 10:00 and 10:50 went through that fit's scale, about 10 %). (Their numbers in `DBLK` are counted from the point of flexure, so they were re-expressed when it moved 1.11 mm with the detent's measured length, the holes staying put.) The block runs 9.46 mm toward the foot from the point of flexure and the detent's foot about 10.8 (15 and 16.4 as Fig. 90 draws them until 20 October 2026; 9.2 and 10.6 until October 2026, shortened to clear a train pillar since moved). The pins, Ø 0.85, stand 1.1 mm into the train bridge (measured; r 0.53 and 1.2 before).
  - The block's front is split along its length by a slot open at the stop button's end, as Fig. 90 draws it: the lock-adjusting screw, threaded in the outer part, bears on the strip that carries the button, and its clamp screw crosses the slot into the strip. The slot (0.24 mm), the strip (0.36 mm) and the solid root (0.2 mm) are in Fig. 90's proportions; one drawing, so medium sure.
  - The detent-adjusting screw's head (r 0.9, 0.45 thick) stands 0.3 mm off the block's end and 0.3 mm deep in the slot across the foot, which runs on 0.6 mm past it (Fig. 90's foot runs on about 1.1 mm); sizes estimated. The detent's two steady pins stand 1.05 mm out of the foot, 6.8 mm apart, with the clamp screw between them (measured on the same frames; 1.2 out and 7.6 apart before).
  - The trip spring's screw: shank r 0.07, head r 0.16 and 0.12 thick, through the spring's foot 0.2 mm before its free start, threaded 0.32 mm into the angle bracket's leg along the spring, which is 0.36 mm thick (estimated) and 1.05 mm tall (measured). The bracket's own screw goes across its leg on the detent into the blade, which is drawn 0.2 mm wide, so its thread holds only that (`bom.json`'s known deviation).
- The balance rim diameter (29 mm), measured on the top-view photograph.
- Where the group's transform (`PT`) and the train disagree, an estimate takes the place (IDEAS.md 1.12): the pillars' feet are measured on the video's bare plate (r 34.1-34.7), but pillar 1 stands at 169.2° rather than the dial side's 166.3° (40:08, where its dial-side screw is just clear of the lower train bridge's end), where the train side has its top screw against the cock's holes (23:30, 6:49.0, 23:45: 169.2 ± 0.5°; at 166.3° its head would reach the cock's foot, which 6:29 shows clear), and the lower train bridge ends 10.0 mm past the fourth, its corner 0.2 mm clear of that screw's head (the frames' 10.3 would meet it by 0.09 mm; 9.2 until 24 October 2026). On the real movement the bar's end clears the head by 1.5-1.9 mm: the dial-side screw stands at 166.3-166.6° on 40:05 and 167.4-167.7° on 9:03, 14.8-15.0 mm past the fourth's setting along the bar, against the model's 12.96 (`tools/bridges/ltb_pillar.py`), so the pillar's two readings, train side and dial side, are the open question, not the bar; 23:30 alone puts the cock's holes 1.3-2.3° short of the model's about the centre (Review-results.md, Elsewhere 24), left as the cock was measured; the balance locking arm's screw stands 30° round from the timing weight it locks (Fig. 9 draws it beside the cock's foot), and the arm swings back over it 120° (`ARM_U`); the dust seal's screws, the setup cover, click and ratchet keep the photograph's sizes ×1.039 (`PHOTO_K`).
- The rate panel's figures (see "The rate panel" under How the timing works). Sourced: the rate for a full turn (p. 70) and the screws' and weights' masses (parts list). Estimated:
  - The rim's section, 3.5 by 0.6 mm (the video: 0.5–0.85 thick on three frames, scaled by the rim's 29 mm and the impulse roller's 0.249 in; its height from the heads' 0.9 of it side-on, to about 10 %), and the arm's thickness (1.1; its plate-side face flush with the rim's plate-side edge, measured side-on at 6:50.0, as Hamilton's US 2,356,911 Fig. III sets it) and its widening round the hub (hidden under the hairspring on every frame; its width, 1.9, is the video's, 6:52.5). `I_REST`, 44 g·mm², added so that the moment of inertia is Table II's 578 (the drawn balance makes 534; a rim 0.69 thick, inside the video's 0.5–0.85, would make it all). Each screw's or weight's mass is spread along its drawn cylinder; the rim's holes, the weights' screws and the staff are left out.
  - The thread pitches (0.177 and 0.151 mm), which follow from the moment of inertia and where the weights stand.
  - Which of holes 3, 5 and 12 carries the 0.080 in heads (the video shows the longest heads, about 2.6 mm, in hole 9; the others can't be told apart at its angles), and the heads' diameter (3.1 mm; the video 2.9–3.2 face-on, 6:52.5). The screws' points inside the rim (1.3 mm) and the verniers' stems outside it (1.6 mm, with a collar) are estimated from the video's look.
  - The balance screws' slots and the timing nuts' slit (`tools/balance_details.py`, KLUwI2UUCMQ 6:47.5-6:53.3, 21 October 2026). Measured: the slots 0.38 mm wide (0.37 face-on through the slot at 6:52.621, 0.40 end-on at 6:50.035, against the head's 3.1) and 0.75 deep (0.71 and 0.77 on one head, about 0.080 in, at 6:52.621 and 6:53.121); the slit 0.63 of the nut's length from its inner end (both frames), about 0.10 wide (the frames' blur). Estimated: the shorter heads' slot depth (kept within 0.6 of the head), every slot's heading (drawn along the staff, as on seven heads; one head at 6:50.0 has its slot across, since a slot's heading follows how far its screw is turned home), and the slit through the nut's far wall (only the near wall is seen). The arm has no holes: the "small holes along its middle" read on 6:52.5 on 4 October 2026 are the hairspring stud's, hanging on the spring and lying over the arm there.
  - The temperature's effect taken as linear in temperature about 72.5 °F, with the standard set compensated (Table IV gives the change between 55 and 90 °F only).
  - Reading "one full turn of timing weight" as both weights of the pair turned a turn each.
  - The weights' travel from the middle position the manual starts them at: 3 turns either way for both pairs. For the timing weights, 3 turns at about 40 s a day is the 2 minutes a day they alone must take out (Op. 5 leaves the rate within 2 minutes by screws and washers, and Op. 6 regulates with the timing weights only, p. 81); the manual gives the figure per turn, not the travel. Mid-travel is drawn 3 turns (0.534 mm) off the rim. Nothing in the model limits them sooner: the barrel bridge's cut round the balance, measured on 13:04.4, is 19.5 mm from the staff at its nearest, 1.6 beyond the nut turned fully out (fine.py finds no contact). The screw's length outside the rim (2.7 mm, 6:50.0) is the nut's and screw's reach together, the screw's end not told apart from the nut's: drawn so, the nut turned fully out overhangs it by 0.7, 1.6 of its 2.3 mm still on the thread. The verniers' 3 turns are estimated. Until 15 October 2026 the timing weights had 2 turns from 0.35 mm off the rim, all the room the cut then drawn (r 17.6) left; until 4 October 2026 the nuts were drawn 1.7 long with 3 turns.
  - The weights' drawn sizes.
  - The hairspring ("The hairspring, designed"): the strip's width read on the video (0.20–0.28 mm) and its moduli from published ranges (Elinvar-type alloys 165–195 GPa, spring steel 207); the spring's inner end at 3.2 from the staff and the collet scaled from it (the video 2.8–3.9; 3.2 inside the window where a short curve meets Phillips' conditions); the winding sense (counterclockwise from the collet, as `springGeo` drew it); the terminal curves' form (a cubic in curvature: any curve that meets the conditions would do as well); the spring rising evenly along its length.
  - **The parts list's masses read as a matched pair's** (`PM` = ½; likely, not certain). The list prints each line once with its quantity beside it ("2", "4-6"), and Tables II and III change screws and washers only "For Pairs". Read as each one's mass: the timing nut as measured (2.1 mm across, 2.3 long, bored and slit; 6:52.5) is about 50 mg of steel, 63 solid, and can't weigh 93; the screws' heads as measured (2.9–3.2 across) would need a metal of density 12.6–14.3, gold, where read as a pair's they come to 6.3–7.1, a little lighter than solid brass (8.5; slotted and pointed); and the drawn balance falls 37 % short of Table II, against 8 % read as a pair's. What would settle it: a Model 21 balance screw or timing weight weighed, or the parts catalogue's own note on how its weights are given.
  - The washers' outer radius (1.0 mm, under the heads' 1.3) and the screws' masses at the middle of the parts list's ranges.
- The upper train bridge's outline, the crescent of Figs. 29, 67 and 110: the disc of the rim (r 38.8 ±0.6 since 18 October 2026, `BR_R`'s comment: KLUwI2UUCMQ 23:30, the bridge flat on the mat, its rim's edge against the bridge's five holes the plate places; 40.5, the top-view trace's, until then; at least 38.5-39.4 on the side photograph against the measured plate, 38.6-40.2 on the video: `References/VIDEOS.md`, "The bridges' rims against the plate") less the cut round the barrel (r 20.0, above) and the notch round the fusee. Its end by the barrel (`TB_END`) is the owner's trace of the bridge flat on 23:30 through its five plate-placed holes since 18 October 2026: a straight cut, 2.4 mm in from the earlier reading at the same slope. The notch, its horn and its mouth are measured on two frames of C Spinner's restoration video (`KLUwI2UUCMQ` 23:30, the bridge lying flat face up; 13:49.5, turned over in the hand), each put on the bridge's face by `tools/video.py anchor` through the rim, the barrel's cut and the centre bushing (0.2–0.3 mm rms on the circles); `tools/train_bridge.py` builds the edge from them. Those anchors hold the rim at r 40.5 about the centre, which the frames anchored on the plate's holes put nearer r 39 (PROVENANCE.md, Step 3): the edge's readings near the rim were 1-3 mm out, the barrel's side most. The notch and the mouth are re-read since 19 October 2026 on 23:30 through the homography on the bridge's five holes the plate places (`tools/anchors/KLUwI2UUCMQ_23-30_plate.json`; PROVENANCE.md, "Step 3, continued"); the horn's end is still the rim-held reading. Until October 2026 it was traced on Fig. 67, pushed off the holes and smoothed, which rounded the horn's end. The opening in the middle (two lobes, over the balance and the fourth's setting, and the escape passage) and the straight end past the barrel are traced on 23:30 the same way (`TB_KEY`, `TB_END`); the seats for the escape upper bridge's ends either side of the passage are not drawn (the bar lies on the face). The places of its small holes (pins, the lower bridge's screws) are the model's, not all the video's.
  - Coordinates here are in the photographed group's frame, before the 14° turn (Dial orientation, step 4): the outline is measured against the bridge's rim, barrel cut and centre bushing, so `movement.js` takes it through `PT` with the barrel and fusee.
  - The notch is a circle about the fusee's arbor, r 16.72 (`TB_NOTCH`; 23:30 through the plate-anchored homography, the step from the blue mat to the face along rays from `L.Fu` every 0.5° over 10-126°: ± 0.06 mm, a free circle centred 0.09 mm from `L.Fu`; past 128° the silhouette is the bridge's wall, the face's edge keeping to the circle): sure to about 0.3 mm. Through the rim-held anchors it was r 16.57 about a point 1.09 mm (2.3 mm before the photographed group was refitted) from the arbor.
  - The horn between the notch and the barrel's cut carries the centre wheel's upper bushing. Its sides are those two circles (both frames, within about 0.6 mm), and it ends in a straight cut across with sharp corners, about 2.9 mm wide and 12.4 mm from the centre: the end only from 13:49.5 (at 23:30 a part lies over it), about 1 mm.
  - The mouth (`TB_MOUTH`, movement frame): a straight edge from a sharp corner on the notch's circle at (30.86, −12.19) to a sharp corner on the rim at (37.69, −9.20), 7.5 mm (23:30 through the plate-anchored homography, 68 points across it, a line to 0.045 mm rms; the frame shows both corners sharp); about 0.3 mm. Through the rim-held anchors it was 0.5-1.3 mm further out and turned into the rim through a round corner of r 6. The barrel pillar stands in the open notch.
  - Nothing is pushed off the holes: `train_bridge.py` prints the metal left round each. The train bridge's third screw's counterbore keeps 2.6 mm.
  - The keyhole is built from the model's own centres, not traced: the opening round the balance staff and rollers (r 8.0) joined to one round the escape arbor (r 3.0), which the escape upper bridge spans, kept 1 mm off the notch (the video's keyhole leaves 3 mm or more there). Its lobes (one of them under the detent support block's screw) are not drawn.
- The barrel bridge's far horn: past the balance on the 6 o'clock side, round to about 100°, ending in a cut from the cut round the balance (at (−5.45, 21.46)) to the rim. Its tip traced on the top-view photograph through the five bridge screws (about 0.6 mm); C Spinner's video of the bridge laid flat (23:30) agrees to about 2 mm. The cut is curved (6 October 2026): traced on the flat bridge at 23:45 through a homography on its rim and the fusee and barrel bushings (a cubic through the trace to 0.03 mm rms), it bows 0.46 mm off its 12.8 mm chord, and the photograph traces the same bow (0.59 on 11.0); drawn with that shape from the photograph's tip to the rim, where it lands 0.7 mm from the straight cut's end. The flat frame's own map puts the whole cut 2.6 mm off, about its holes' check (1.3–1.4 mm, two small holes 3.5 and 6 mm), so it gives the shape, not the place. Its rim is the model's 40.5 mm. Read against the screws, the photograph and the flat bridge put the rim at 34–35 mm, but those screws sit on the pillars, which the bare plate (BunnSpecial 22:00) shows about 1.2 times further out from the centre, against the plate's rim, than the model has them: against the plate itself the rim is 39–40.5 mm (the side photograph's silhouette, 39–39.5), so the rim stands and the pillars' and screws' places are what is off (`IDEAS.md` 1.2, 1.11).
- The barrel bridge's cut round the balance: one circle, r 20.06 about (2.03, 9.96), since 15 October 2026 (`BB_CUT`: 13:04.4, the bridge upside down, its edge along 49 rays, 0.11 mm rms over 196°); before, traced on the top-view photograph, to about 1.3 mm, and between the horn on the cock's side and the fusee on 6:49.0 through the camera fitted there. The horn's inner corner, where that cut meets the horn's edge, is at (23.67, 8.65), the frame's (23.71, 8.42); it was at (19.5, 9.87) until 12 October 2026. The top-view photograph's edge on that stretch, in the cock's shadow, reads 16.7-18 mm from the staff, which on 6:49.0 is plain train bridge. The end of its horn on the cock's side is its own edge (`BB_NE`): since 20 October 2026 a circle, r 35.15 about (10.69, 39.43), the edge traced on 13:04.2 and 13:04.4 (the bridge upside down) through cameras on its bushings and screw holes put on the near face, whose edge the outline is (`tools/bb_hornend.py`; 0.04 mm rms against a line's 0.20), meeting the cut in a fillet r 0.8 (13:04.0-.4: 0.63-1.04) and easing 0.05 clear of the cock's edge over its last 2.5 mm before the rim (estimated, the owner's choice); a straight cut through (28.51, 9.95) at 30.0° from 19 October 2026 (the same frames, its points on the far face and fitted as a line). Until then it followed the cock's traced straight edge (`CK_TR`), 0.15 mm off it, 0.4-1.5 mm from the bridge's own edge; on 6:49.0 the bridge's own top edge, traced as 13 points, lies within 0.6 mm of it (f 5,000; ±1.5 over f 4,000-6,000), its tip at the rim within 0.7 mm. The flat bridge traces that cut bowed into the bridge the same way (23:45, through a homography on its rim and the fusee and barrel bushings: 1.02 mm off its 15.2 mm chord at most; about 0.7 on 17 in place at 6:47.5), the cock's edge bowing 1.2 on its chord; hung on the old trace's ends, the bridge's bow lay 1.5-1.8 mm nearer the cock than the cock's own pictures put its edge, and the cock's is kept (OPEN-QUESTIONS.md); the flat frame itself puts that end about 4–5 mm further toward 12 o'clock than the old trace, the way the cock's pictures move it, and its small hole 6 mm from the model's (open, `OPEN-QUESTIONS.md`). A straight cut until 6 October 2026.
- The steady pins. The cock's two (42066, "complete with pins") are placed from its screw's hole, where 6:47 and 23:30 agree within 0.4 mm, and their holes in the train bridge measured r 1.07 on 23:30; the pins' r 1.0 and 1.5 mm length are estimated. Both frames put the cock screw's hole itself 2.5-2.8 mm from where the model has it, toward the centre, which the cock's measured wall (r 22.6 about the staff) and counterbore (7.4 across) don't leave room for unless the balance's place moves too: kept, the pins with it (Review-results.md, the upper train bridge's hole survey). The barrel bridge's two (42061, "complete with pins"; 13:04.4 shows them standing out of its horns, 1.8-1.9 mm across): the cock side's from 13:04.4 and its hole on 23:30 (0.3 mm apart), the far one in the train bridge's hole, at (−21.58, 19.73) since 19 October 2026, where 23:30 and 13:49.5 put it through their plate-anchored homographies within 0.3 mm (1.8 mm further out through the rim-held anchors; 13:04.4 2.1-2.5 mm off that, that horn distorted there); r 0.9 in holes r 0.95, 1.5 mm long, estimated.
- The barrel bridge's pry slot (`S.bbN`): a blind slot in its underside at 3 o'clock, open at the rim, where 6:47 and 6:49.0 show the face whole from above and 13:00.5, 13:03.8 and 13:04.4 show it from below with a floor. Its width (2.12; 2.04-2.20), inner end (r 35.2) and direction (5.4°, the radius there 4.0°) are read on 13:04.4 through a homography on nine of the bridge's holes (`tools/anchors/KLUwI2UUCMQ_13-04.4.json`). Its depth, 1.0 mm of the bridge's 3.4, is estimated: 12:59.0 sees its mouth in the rim's side, motion-blurred, about half as tall as it is wide. It is cut by `facePocket` in `core.js`. Until 15 October 2026 it was drawn as a round hole r 0.9 through the bridge.
- The balance cock's solid: the body stands outside a circle through the wall's measured end (`CK_WC`, `CK_WR`: r 21.55 about (2.65, 7.93), 22.6 mm from the staff at the straight edge's side, `CK_RP`), and the arm is in two thicknesses, flat underneath, with square steps between them and at the body's wall (the restoration video, 44:02: the cock in place seen from its straight edge, the space under the arm's thick part open to the body's wall; 23:45, flat faces). The wall's corner with the straight edge's side is measured on 44:02 (4K; 44:20 shows the same edge) through a camera fitted on the cock's top (the cap's screws and oil sink, the stud's three holes and the cock screw's counterbore at their measured places; 3-9 px rms over f 2,200-8,000): where the open space ends (x 2665, the thick part's underside at y 1155-1158) the ray meets the traced side face 22.5-22.7 mm from the staff, 5.0-5.8 mm under the top, and on the plane of the thick part's underside 22.6-23.0; beyond it the side face is the body's, polished and reflecting the plate, where the space before it is dark. Until 15 October 2026 the body stood outside the barrel bridge's 17.7 mm circle round the balance, the wall read at 18.6 along the stud's holes at their old scale (21.3 with them at 6:29's, extrapolated past them). Estimated: the wall's form across the underside (no frame shows its other end: on 41:58 the concave side's band shows no full-height face before the corner, and 23:45 is too coarse to place one), drawn as the circle through its measured end moved least from the staff's circle that leaves 0.48 mm of metal round the cock screw's counterbore where the screw is measured (19.7 mm from the staff at its nearest). Until 15 October 2026 an arc about the staff, with the screw drawn 2.2 mm further toward 3 o'clock. The cock screw's place (`S.cock`, `CK_Q`) is measured, not estimated: the mean of its tapped hole in the train bridge on three frames of two movements (KLUwI2UUCMQ 23:30 and 13:49.5 face-on, Jd2c3x8VKsE 26:00 through a fitted camera), within 0.45 mm across and 1.7 mm along the line toward the 6; the stud's frame (`SPD`) stays on its old place (`CK_Q0`), where the stud's holes were measured on the cock's top. The top's trace (`CK_TR`, below) was put on through a homography with the counterbore at its old place among its anchors (41:58 can't place the counterbore without it: the other holes lie in a 13 mm cluster round the nose and extrapolate it anywhere within 10 mm), so its far part, round the counterbore, may be up to about 2 mm off. Along the straight edge the arm's side deepens from 88 to 206 px at a step 14.6 mm from the staff (44:02, placed along the stud's three holes by a 1-D projective map, the holes where 6:29 measures them; 12.1 with them at the old scale until 14 October 2026; the camera fitted on the cock's top puts it 14.9-15.1); on the concave side the polished band steps down 13.7 mm from it (41:58). The step is drawn as the straight line through those two places (straight across the underside: estimated); the thin part 2.6 mm (the stud and the hairspring hang from it; 2.5 against the body's 10.8 mm visible down to the horn), the thick 6.0, 2.34 times it (5.9 by the same scale). Until 6 October 2026 the arm was 2.6 mm out to the body's wall (the "2.9 ± 0.3" read there was the thick part), and until 4 October 2026 its underside swept down into the body in an estimated quarter-circle cove. The top face beyond the rim's arc is traced (`CK_TR`, 12 October 2026) on the restoration video's cock alone (41:58, 4K), its outline segmented where the top face meets the blue mat and the outer wall (which mirrors the mat) and, along the concave edge and round the nose, where the gilt meets the polished wall; put on the cock's top through a homography on its holes at their measured places (the counterbore and the setting where the model has them, the cap's screws 3.33 either side of the staff, the stud's three holes as 6:29 reads them through the camera fitted on 6:49.0, 4.0 mm apart and 5.6, 9.1 and 12.8 from the staff) with the rim's arc held to r 40.1 about the centre. The holes fit to 0.08-0.28 mm and the rim to ±0.15; with the holes alone the rim comes out r 40.02 ± 0.37 (the old layout's, 40.79 ± 0.75). The straight edge read on 6:29 lies 0.02-0.25 mm from the trace at x 6-14 (about 0.8 near the rim); the photograph from above (`References/photo-cock-top.png`) through its own homography on the same holes puts the straight edge, the nose and the upper concave edge 0.01-0.64 mm from it and the lower concave edge 0.8-1.6 mm toward the opening (far from its holes; 6:29 sides with 41:58). The straight edge runs 0.5 mm outside the stud's holes, then bends about 28° toward the rim; the corner is at 23.4° on the rim, the tip at 76°. Until 12 October 2026 the trace was the mean of 41:58 and the photograph through the holes as the model placed them (the cap's screws 2.75 either side, the stud's row 3.9, 7.0 and 10.5 from the staff, both read at the top-view photograph's scale, about 0.83 of the video's): it lay 1.9-3.5 mm inside the real straight edge and 1.4-3.3 mm inside the concave edge, and put the cock screw about 22 mm from the staff. Until 6 October 2026 the straight edge was one straight line to a corner where the nose was widened round the cap, and the concave edge a cubic bulging about 1 mm into the opening. The stud and its holes (`SPHa`-`SPHc`) and the step's end on the straight edge (`CK_SP`) were drawn at the old reading, 1.7-2.3 mm inside 6:29's, until 14 October 2026; the step's concave end, read on 41:58, lies on the retraced edge and is not re-read. The counterbore (r 3.7, measured on 6:29; its depth the screw's head and 1.2 more) is drawn; the two steady pins' places (where the train bridge shows two plain holes under the cock with it off, 6:47, placed to about 2 mm) are estimated. The walls are drawn plain, as the video shows them polished; the top keeps the plates' damascening.
- The balance cock's top face (`CK_TR`, `COCK_POLY`) and its turn about the staff (`CK_TURN`), since 25 October 2026 (`tools/cock_refit.py`): the owner's trace of the cock alone on KLUwI2UUCMQ 41:58 (`tools/traces/cock_41-58.mm.json`) through a homography on its holes at their places now (the counterbore at `CK_Q`, the setting, the cap's two screws, the stud's row at 5.0, 8.4, 12.3) and its rim held to r 38.8 (holes 0.08-0.24 mm, rim r 38.64 +-0.16); the straight edge two circles and the concave edge one, the nose as traced; 6:29, fitted on its own, agrees within 0.3-0.7 mm. The turn, -5.03 deg, is estimated: placed by its near holes and rim, the cock's pictures put its screw 30.0-33.5 deg about the staff where the tapped hole's frames put it at 35.6, and the cock is drawn standing against the barrel bridge's measured horn (0.05 clear), as the top-view photograph shows it, the screw 2.2 mm from the tapped hole's frames (the owner's choice; OPEN-QUESTIONS.md). 18-25 October the trace through the holes as they were then drawn, its far end up to 3.2 mm off.
- The balance cock's nose and its endstone cap. The top-view photograph gives the cap's place and direction: a steel plate lying along the cock's straight edge, the cock's metal all round it. Its sizes are measured on C Spinner's video at 6:29 (the cap on the cock, 4K) through the camera fitted on 6:49.0 (the train and barrel bridges' rims, the centre bushing, the third's setting, the lower bridge's screws and the barrel pillar's hole; f about 5,000 px, 4,000-6,000 by its cost profile): the screws 6.66 mm apart (6.63-6.70 over those focal lengths), so 3.33 either side of the staff; the plate 8.9 long (8.83-8.94) and 5.5 wide (5.47-5.56); its setting 3.85 across. Until 12 October 2026 it was 7.2 × 4.6 with the screws 2.75 either side, the photographs scaled by the top-view photograph's screw spacing, which reads every size on the cock's top about 0.83 of the video's (the counterbore 6.1 for 7.4). C Spinner's video gives its form, close (5:51 and 42:03, 42:08 on the cock, 41:58 off it; `References/VIDEOS.md`): symmetric about the staff, its corners rounded r 1.45 at the nose's end and r 0.48 at the foot's (the old 1.2 and 0.4 with the screws' spacing), the screws' heads (r 0.85, 1.67 mm across on 6:29: the escape cap's 0.85, the same screw, 20762) sunk flush in counterbores, and a polished conical oil sink 3.75 mm across (two thirds of the plate's width in each view; on the 1941 movement of the top-view photograph it looks nearer 2.2 mm of its 4.6) down to the endstone, set from below in its setting (42155), which shows on the underside as a ring about 3.4 mm across. The plate's thickness (0.7), the counterbores' depth (0.4) and the stone's size (r 0.95) are estimated. The balance upper setting in the cock under it (42162) is r 2.2 (41:58, the cap off: its gilt fades into the cock's face from r 2.0 to 2.55, through the homography on the cock's holes at their measured places; r 1.5, estimated, until 12 October 2026); the 0.3 mm it stands below the arm stays r 1.5, estimated: at 2.2 it would meet the stud's bar, which is still drawn at the old reading). On the real cock the cap ends at the nose's end (within about 0.3 mm). The nose is traced (above); with the cap placed by the staff, its corner at the straight edge would stand 0.5 mm over the traced edge, so the nose is the hull of the trace and the cap's outline 0.3 mm out (until 6 October 2026, 0.9 mm out on an outline that passed 0.7 mm from the staff). The manual's drawings show the setting inside the cock's nose and the cap on it (Figs. 19, 85). The jewels' sizes are estimated.
- The collet and stud: their outlines and sizes, and the stud's direction.
  - The collet is measured on Fig. 6's two drawings of it (alone, and in the spring's lowest coil; Figs. 5 and 49 agree), the only source: no photograph or video shows one. The points were put back on the plan through a parallel projection foreshortened 0.63, the coil's ellipse; at that value the plate's outer edge comes out a circle (within 0.06 mm), the ledge's round cut a circle (0.03 mm) tangent to its straight part, the notch's walls square to the front edge, and the ledge's top and foot fall on one another (0.1 mm). The hub's own ellipse is drawn flatter (0.45) and was not used. The scale is the hub against the coil, 0.213 of its diameter, the coil as five sources measure it (r 5.1: the drawing's points were read against it as r 5.5 and scaled by 5.1/5.5; until 4 October 2026 by 6.3/5.5): the hub 2.17 mm across; the outer arc r 4.95 about a point 1.21 mm off the staff, 3.72–3.93 from it; the front edge 1.25 mm from the staff, the end face 3.45 along it; the notch 0.84 wide and to the ledge; the hub 1.48 tall, the body 1.47, the tongue 0.46 of it and the front left end 0.50. Read to about 10 % (the two drawings differ by up to 20 % on the tongue's thickness and the clamp's length). Estimated: the body's hidden side behind the front step (it ends 0.9 of the way to the plate's corner, 2.31 mm out on the step's line: taken to the corner until 11 October 2026, it stood 0.02 mm off the inner terminal curve at rest and in its way once the breathing spring, wound, curled in; no inner curve meeting Phillips' conditions from the collet's end passes the corner (searched: the farthest out of 3,000 passes it at r 3.64, the corner at 3.48 needing 4.0 at a 347° swing), so the hidden side is drawn as short of the corner as leaves the strip 0.05 mm at 347°: 0.063, 0.35 at rest; the plate above it, measured, unchanged), the groove's depth (0.15), the bore (the staff's, 0.47; the drawings draw it wider), the slit's width (0.1), the clamp's sizes (2.23 × 0.73, jaws 0.42, from the exploded drawing's proportions) and the wedge pin's (r 0.17, straight, not tapered). Its counterpoising is not modelled.
  - The spring's inner end lies against the collet's end face, 3.45 + 0.17 mm from the staff, not at the stud end's 4.34, bent to run 1.43 mm straight along it into the clamp (Fig. 6 draws the end bent; Op. 4); the lead's length is estimated.
  - The stud's bar: 1.6 wide (estimated) and 0.85 thick (`SB_T`; side-on at 6:50.0 it reads 0.7-1.1 mm), its steady pins measured there (0.65 into the cock, the outer one 0.9 under the bar too), and the stud screw's counterbore in the cock (r 0.65, its head flush; 42:08 reads it about 1.7 across, rough). Its ends are measured on the restoration video (6:47.5, 6:47.75: the balance lifted out, the stud seen from the cock side, 33 px/mm at 4K, put in mm along the row by a 1D perspective fit on its three holes): the outer 0.8 past the outer pin (0.79, 0.77), the inner 2.2 inside the inner pin (2.24, 2.10), and the clamp is a block under the inner end, from there to 1.1 inside the pin (1.13, 1.10), the wedge pin's end showing in the bar's top face 1.7 inside the pin (1.76, 1.68), 0.4 off the bar's middle line; Fig. 5 and Hamilton's patent US 2,379,780 (Fig. 10) put the clamp there too. Estimated: the block's width (2.0, about 1.3 times the bar's on both frames, drawn centred: the side its extra width stands out to isn't read), its drop under the bar (0.7, to the spring's measured height; the frames give 0.9-1.3 with their tilt unknown), and which side of the middle line the wedge pin is on. Until 4 October 2026 the clamp was a block between the inner pin and the stud screw, 4.6 mm from the staff, and the bar ended 0.8 past the inner pin. Open: the frames show the steady pins' holes empty or flush on the bar's top face, where the model has the pins standing 0.8 into the cock. Its holes are measured: three in a row along the cock's straight edge, the screw's the middle one, since 20 October 2026 5.0, 8.4 and 12.3 mm from the staff (42:08 face-on, scaled by the cap screws, and 41:58 through a camera of its own; along 6:29's directions); before, 5.49, 9.00 and 12.75 (6:29), and first 3.9, 7.0 and 10.5: the mean of the restoration video (41:58, through a homography on the cock's screw, setting, cap screws and outline corners) and the top-view photograph (the stud in place, through its map on the barrel bridge's screws from the setting's centre), which agree within 0.5-0.8 mm; the side view (6:50.0) shows the bar running out past the coils with a pin standing up at each end. Until 4 October 2026 it was a bar 5.7 long toward the cock screw, the screw 7.6 from the staff and one steady pin at 5.6.
  - The spring's upper end is in the stud's clamp, 4.34 mm from the staff (the stud's holes measured on 6:29, 14 October 2026; 2.65 through the old scale before), its terminal curve solved to Phillips' conditions (the curve's form is a design: no frame shows it); both ends lie in the stud's direction when the balance is at rest.
- The centre of the dial. Sourced: the order of the parts and how they fit (the cannon pinion a friction fit on the centre arbor, Op. 58; the hour wheel free on the cannon pinion, Op. 59; the hour hand broached round onto the hour wheel's pipe and the minute hand broached square onto the cannon pinion, Op. 64; the key on "the bright, square arbor at the center of the dial", Fig. 8). Estimated: the sizes.
  - The hand-setting square is the cannon pinion's squared end, 2.16 mm across (KLUwI2UUCMQ 40:39.0, ±2 %), from 10.0 to 14.5 mm over the plate's train face; the fusee arbor's square reads 2.4 (20:00), where Fig. 8 has one key fit both, so one of the two readings is off (`PROVENANCE.md`, Fig. 107's disagreements, 4). Until 5 October 2026 it was 2.4 across, as the fusee's, estimated.
  - The cannon pinion is stepped (40:39.0 and 40:16.6, radii ±2 %, heights ±10 %): its leaves from 0.3 to 4.3 (tips r 2.49), a collar r 1.57 to 5.3, a neck r 0.75 to 10.0, then the square; the hour wheel's boss r 3.47 from the wheel to 5.9, recessed over the leaves, its pipe r 2.2 to 9.5, through the dial. Until 5 October 2026 one pipe r 1.7 and the hour wheel's pipe r 2.3, estimated.
  - The hour hand's boss is r 2.9, its collet r 2.7 and 0.6 mm deep under the blade (clear of the seconds hand's tip, which reaches r 4.0 at :00: the seconds hand is 17.6 mm long, as photographed, and the seconds track is drawn to r 17.9, as the photographed dial has it; the Hamilton dial is printed to that photograph's proportions, scaled by the seconds' centre on the fourth arbor: the minute track r 40.4-42.2, the seconds track meeting it at 6 (0.9 inside), the UP-DOWN ring r 11.2, the dial showing to r 45.9 inside the bezel as photographed; until 3 October 2026 its track was r 43.0-45.4, which with the fourth's measured place left the seconds short of it); the minute hand's boss and collet are r 3.2, the collet 0.8 mm deep over it (the dial photograph shows one round boss about 7 mm across). The hour hand sits on the hour wheel's pipe top (9.5 over the plate's train face, 2.96 above the dial's seat `MR_Y`) and the minute hand at 10.3 (3.76 above it), on the cannon pinion's shoulder (40:39.0 the pipe's top; 1.9 and 2.45 above the seat, estimated, until 5 October 2026). The Hamilton hands' outlines and lengths are measured on the photographed dial (`HAND_W`, core.js; 4 October 2026): sections across each blade every 0.5 mm at 0.1674 mm/px, so the hour hand's swelling stem, round-backed bulb (widest 3.85 at 0.67 of its 35.2 mm) and needle point, the minute hand's long leaf (widest 1.9 at 29 of 42.2), the seconds hand's needle (17.6) and arrowhead counterpoise (9.55), and the UP-DOWN hand's needle (9.8) and boss (r 1.86) are the photograph's, each width to about 0.1 mm (the needles, about 0.3 wide, at the photograph's blur). Estimated: their thickness (0.35), and that they are flat: their side profile (Fig. 21 bends the minute hand's tip toward the dial; the restoration video puts them back on at 46:30-46:45) is not yet read, and the minute hand's bevel, which shows down its length in two tones, is not drawn.
- The gimbal latch's geometry. Sourced: its parts and how they go together (Fig. 106, parts list): the support bracket screwed into the corner from outside the box with washers under the screws' heads, the lever turning on the knurled clamping screw, which goes down through the clamping bracket and the lever into the support bracket, the take-up spring on its two screws, the handle, the keeper on the case on its separating washer and screw, and the slot in the ring the lever passes. Estimated: the brackets' shapes and sizes, the take-up spring pressing up on a collar under the lever, the lever at the keeper's window (4.7 under the ring's pivots since 25 October 2026, at their height before) swinging 45° between the right wall and the keeper; the slot follows the lever's swing and height; the keeper's form is measured, roughly (1:21.5-1:24.5: a block 11 wide and about 21 tall with a window 6.3 by 4 for the lever's tip, a plate below with a 4.4 hole), its plate's depth and screw estimated; the support bracket's outline (a plate against the right wall under the head; the lever's pivot measured there, `LATCH_X`/`LATCH_Z` 47: 0:28.7 with its 51° tilt undone, 0:42.5 and the bracket screws on the box's side agree, roughly), its two screws' places (one above the other, 34.5 from the front corner, 11.5 and 32.5 under the pivot, in cup washers 10 across: Jones-Horan lots 63662 and 38240 square-on, 20 October 2026, likely; their heads about r 3.7, rough), the support bracket an L as Fig. 106 draws it (the plate under the head and a leg 12 wide and 3 thick down the wall to the screws: estimated), the clamping head 19.5 across (rough, 63662's from above; `LATCH_X` 67.25 keeps it 0.5 off the wall, the video's 67 agreeing), the lever's width (3; its top face reads 2.4-4 at 0:28.7), and the post the head stands on (5.5 long, 7.1 across: Bonhams' photograph of 2E11795 in its box), whose part isn't seen (drawn with the screw); the lever's knob beside the raised head.
- The gimbal pivots (Fig. 106, Sec. III, Op. 104): each ring pivot screw in through the box side, its washer under the head outside and its lock nut inside against the wall, its shank and point r 2.22 in a bushing (42214) in the ring at 9 and the support strap at 3; each case pivot screw threaded through the ring (and at 6 the case support strap), locked by its nut inside the ring (the top-view photograph at 12), its point in a bushing in the case bracket. Measured: the case pivot screws' heads (12.3 across at 6, at least 10.6 at 12, the photograph); since 20 October 2026, on Jones-Horan lots 63662 and 38240 (`E:\mc-video\oq\ledger\box\REPORT.md`, a cuboid camera on each photograph scaled by the box's 197 width): the ring pivots' height (92.9 over the box's bottom, 92.7-93.1, likely ±1.5: `RY` −7.1; −20, raised only to clear the floor, until then), their screws' heads 12.4 across, slotted and slightly domed (likely ±1), in cup washers 18.0-18.3 across (sure), the four lock nuts 25 across (24.9-25.2, likely ±1.5; 17 until then), the gimbal strap 45 long with its screws 31 apart and the case strap 52 long with its screws 35 apart (likely; both 50, 32.6, until then), the case brackets 17.7 wide (likely; until the strap below). Inferred, since 25 October 2026: the four bushings are one part (42214) in the parts list, so the ring's and the strap's are drawn as the case brackets' (7.0 across, bored 4.5; below), in bosses r 4.5 (estimated), and the ring pivot screws' shanks and points r 2.22 to run in them (r 1.4 bored 0.82, points r 0.8, until then). Estimated: the heads' side (3.6) and dome (1.2), the cups' depth and rim, the nuts' thickness. The straps are drawn curved to the ring (the photograph's are straight bars); the rest estimated.
- The case support brackets (42105, Fig. 107) as bent straps, since 20 October 2026 (until then a flat-backed block 17.7 × 12 × 6.5): two wings bent to the case's wall, each slotted round its screw (42117), and between them a hat joggled out whose flat runs on toward the bezel as the tab holding the bushing (42214), its bore radial. The form from KLUwI2UUCMQ 47:43.0-47:46.0 (one loose on the mat), 52:27.5 and 52:25.0 (sure); the sizes on 47:22.5 (nearly square-on, 4K) at 22.0 px/mm, the scale the tab's width sets (10.4 on Jones-Horan 63662_06 at the case rim's scale): the tab 10.5 wide, the hat 16.0 across at the wall, the strap 9.6 tall, the screws ±17.2 round the wall with heads 8.1 across, the slots 14.0 × 4.6, the wings' ends ±27.3, the bushing 12.4 over the screws' line and 5.0 short of the tab's end (52:27.5, 47:22.5 4.9; 5.8 until 25 October 2026) (likely ±10 %). Estimated: the strip 1.5 thick, the walls' run 2.7, the heads' side 2.0 and dome 0.8, the screws' thread r 1.75; the strap stands on the wall under the lip (`YB`), its screws' line 12.4 under the pivot (47:22.5 12.3, Jones-Horan 63662_07 11.9; drawn 0.75 lower until 25 October 2026). The tab's outer face is kept at `CR`+6.5, so the bushing and the case pivots stand where they were. Since 25 October 2026 the bushing (42214) is a steel ring 7.0 across, bored 4.5 and countersunk at its face, flush with the tab's outer face and 1.5 standing in behind it (KLUwI2UUCMQ 52:27.5, a bracket loose and nearly face-on: 0.684 and 0.435 of the tab's width, likely ±6 % with the tab's 10.5; its length estimated). The case pivot screws' shanks and points are r 2.22, a plain end in its bore (inferred from the bore; r 0.8 points until then). Since 25 October 2026 the pivots stand 4.0 nearer the bezel than the thread's foot less 5.2 (`CSY`; 47:22.5 the bushing 1.0-1.1 under the thread's first groove, 1,111 of the 1,135 px from the case's bottom; Jones-Horan 63662_07 the lock nut's centre 1-2 under the thread's lip; likely ±0.6): the case and the movement in it are drawn in a frame of their own (`BX.cs`) under the pivots' (`BX.bowl`, which turns on them, the brackets and bushings in it). The case's band step (`YB`) is a lip 3.06 under the thread, from the shoulder the movement's ring sits on (63662_07 2.7; 47:22.5 shows the wall plain from the strap to it; rough), where it was 13.5 under it (LPEC109-4's cove and band, read now as the bezel's skirt). The latch keeper's top is at the thread's foot, just under the bezel (1:22.5), so its window stands 4.7 under the pivots, and the latch lever, its support bracket's plate and the ring's slot (3.0 tall) are drawn there: estimates, set by the keeper. The case's centre of gravity is 14.7 under the pivots (10.4 before), its period 0.575 s (0.653), the ring's 0.653 (0.745); gimbals.js asks 10 % clear of the beat since (15 % before; the owner's choice). Open: the wall's radius under the lip (r 47.6, inside the movement's ring r 47.95) and the case's depth (47:22.5 about 51.6 to the first groove against 49); the bezel's knurl, at its glass end on 0:28.7 and 1:22.5, drawn at its case end (`OPEN-QUESTIONS.md`).
- The mounting box (Fig. 106), measured 20 October 2026 on Jones-Horan lots 63662 and 38240 (sides, front, back and from above; KLUwI2UUCMQ 0:38.5-0:47.5) through a cuboid camera fitted to each photograph's edges (0.75-1.6 px rms) and scaled by the box's width (197, the sale listings'; 7½ in would make every size 3.3 % smaller): the heights, the base 105, the glass lid's tier 71 and the outer lid 20 (196.4 closed; sure); one piano hinge on each seam, 158 long, centred (likely ±5); two hasps 51 × 22, each split at its seam, two screws to a half and a turn knob about 10 across on the lower half (likely ±1); the Hamilton nameplate 87 × 17 on the glass lid's front at 148 over the bottom (boxes vary; likely); the brass corner caps about 10 tall with legs 26.5, one to each edge on each tier (two on the base) at 2-11, 63-74, 132-142 and 184-195 over the bottom (likely ±1.5); the side handles on 38240's round rosettes 29.2 across, 68.5 apart and 9 under the pivot, the bail's lowest point 41 under it (likely; 63662's rosettes are ovals 22.5 × 30, 82-83 apart); the key's corner block a concave quarter block, its face r 70.5 ±3 about the case's axis, its legs 38 along the walls, its top near the base's top (the form likely), and the key's hole 7.1 across at (54, −57) (rough). Estimated: the walls' and floor's thickness (21, the inside measured on the video), the glass lid's walls 11 thick (its frame read about 11 ±2 wide from above, rough), the outer lid a solid board, the hinges' leaves (8 wide, 0.6 thick) and knuckles (r 2.6, seven lengths), the hasps' and nameplate's thickness, cut corners and screws, the caps' thickness (1.2) and the top's corner plates (a quarter disc r 26.5), the bail's path (traced by eye on 63662_17) and section (r 2.4), the block's top (1.5 under the base's top), the key's hole 25 deep, the key seated on its cone in it, and the lid stay: a slotted brass bar on the glass lid's left as the photographs show it (form sure), its sizes and places as the Wempe's (6 × 1.5, slot 2.4 wide from 23.5 to 85 from the pivot on a post out of the lid's wall, a headed pin in the box's wall: estimated). Not settled: the box's width in mm, the ring band's height, the straps' slots, the key's length, the latch lever's plan.
- Pivots and jewels (sizes estimated; the manual gives the jewels' kinds, Sec. II, and the endshake, Ops. 15, 69, 74): every jewelled or bushed arbor is turned to pivots with shoulders: the balance staff's measured (below), the escape arbor's r 0.089 in olive-hole jewels (hole r 0.095; below), the third's and fourth's lower pivots r 0.31 and 0.35 in bar-hole jewels (holes r 0.32 and 0.36, stones r 1.13, measured; below), their upper pivots r 0.3 (third) and 0.25 (fourth, in a bar-hole jewel, hole 0.27; both estimated), third upper r 0.3 and centre r 0.5 in bushings bored 0.02 over, sustaining pawl r 0.5 in the bridge and plate. The fusee's and barrel's four bushings are one part (42164), r 3.4 bored 1.85, and their arbors' pivots r 1.82 (measured, ±0.15: KLUwI2UUCMQ 13:04.4, 12:39.0, 37:59, 40:05; Fig. 75); estimated with them: the barrel arbor's bearings in the barrel's end holes, r 2.35 in 2.38 (Fig. 75's proportions; 16:16.5 reads the hole r 2.3), its lower step on the plate's bushing; the fusee arbor's shoulder under the collar, r 2.2 to the plate's bushing (18:24.5 reads r 2.4 ±0.2 at the taper pin's hole), and the end plate bored 2.25 to pass it (23:30: the bore 0.39 of its outside), its boss r 2.9. The pillar plate's dial side is surveyed on KLUwI2UUCMQ 9:03 (and 40:05) and the upper train bridge on 13:49.5 and 23:30 the same way: three through holes in the plate (`PP_X`) and one countersunk in the train bridge, their uses not known, are drawn empty, ±1 mm. The barrel bridge's holes are surveyed on KLUwI2UUCMQ 13:04.4 (its underside, `tools/holemap.py`, ±1 mm away from the anchors): six through holes there whose use no source gives are drawn, empty (`S.bbX`), and the setup cover's screws' tapped holes are blind (nothing under them there; 11:48). The winding stop's tapped hole is blind, 2.0 deep from the barrel bridge's underside, the thread's length (estimated: no frame shows it), the bridge's top plain over it (12:39.0). Endshake 0.05 mm on each: at the endstones for the balance and escape arbor, at the shoulders for the others. The lower train bridge's settings go through the bridge; the endstones are set flush in their caps.
  The balance staff is measured whole on a bare staff photographed on its own (watchdoc.com; References/README.md): from its lower tip a cone to 1.37 mm, a collar 2.62 mm (the impulse
  roller's seat), 1.84 under the hub's sleeve and the hub, 1.53 at the collet, 1.22 near the cock; scaled by its length between the tips (the model's 25.75, ±3 %). Its pivots: a staff out of its balance, side-on at 4K (KLUwI2UUCMQ 7:08), scaled by the impulse roller (0.249 in, 495 px, 78.3 px/mm),
  its silhouette's width traced every 8 px along the axis: the pivot 0.36 mm across (+/- 0.03; the polished pivot shows two dark edges round a bright highlight,
  the outer edges taken) for 0.65 mm (the shoulder and seat that frame shows by the lower end belong to the unlocking roller's boss: the bare staff is 1.37
  there). The rollers, the hub, its sleeve and the collet are bored to the staff's sections. Estimated: the upper pivot, taken as the lower; the collar's lip
  (the photograph's slants, the model's is square); the jewel holes, r 0.19 round the pivots' 0.18 (0.01 side shake). Between the hub's flange and the impulse roller the staff
  is sheathed in the hub's brass sleeve, 3.24 mm across (34:12, measured against the roller), so the thin body shows only past the rollers. Estimated:
  the hub's flange is drawn brass, 7.0 across, as 34:12 shows it under the sleeve (it was a steel disc 4.4 across, estimated).
  The escape upper jewel's hole is measured: its bridge held to the light (KLUwI2UUCMQ 10:14.5), the hole a white disc 36-44 px across in the stone's 446
  (the stone 1.96 mm at the cap window's scale, the model's 1.9), 0.17 +/- 0.02 mm. The pivots are Hamilton's figure for escape staffs, "about 7 thousandths of an inch" (0.178 mm; US 2,392,745, 1946), so the holes are
  drawn 0.19 (the measurement's top, 0.006 side shake), the lower jewel taken the same. The patent's Fig. 4 and claim 2 give the arbor's end form: the body,
  a reduced neck, then the pivot end, as 10:12.2 shows.
  Estimated: the escape arbor's shoulders, drawn as steps: 10:12.2 shows a neck and a conical end before the lower pivot, but the arbor's shadow on the plate
  spoils a trace (the shank reads 58 px wide traced, about 38 by eye). The arbor's body is r 0.67, measured beside the pinion in the staking tool (43:21.1:
  0.456-0.478 of the pinion's tip radius); the escape wheel's brass hub on it is not drawn (its web is bored to the arbor).
  The lower train bridge's two jewels are measured: held to the light in the bridge (KLUwI2UUCMQ 15:00-15:06), the stones r 213-220 px against the bar's
  1,990 across (its 10.3 mm, measured at 40:08 and 14:40): r 1.13 (1.23 by the arbors' 11.30 apart; they were r 0.62). The third's hole 0.286 of its stone (0.284
  and 0.288 on two frames), r 0.32; the fourth's 0.32 (its bore seen at a slant), r 0.36; +/- 0.03 with the scale. The pivots 0.01 under them; the fourth's
  drawn on at r 0.35 to the seconds hand (its collet bored to it; the extension not measured). Estimated: the upper pivots of both; the settings' depth (the frames
  show each stone nearly flush with its setting's face, the model sets it at the bottom of a bore).
- The centre and third upper bushings in the train bridge are measured (r 1.95 and 1.9, gilt, with polished oil sinks out to r 1.0-1.15: 23:30, 13:44, through the anchored homographies); the sinks' 90° and how far they stand proud are estimated.
- The oil sinks in the fusee's and barrel's lower bushings, on the dial side (C Spinner 37:59, 38:02): 90° cones round the bores, their outside 0.65 of the bushing's radius (at least 0.25 past the bore), as read on the video; the other unjewelled bushings are drawn plain, not having been seen.
- The barrel's size: r 18.3 ± 0.5 outside, a plain cylinder with its end and cap flush (5 October 2026). Measured on TN24H's video (`3SFDplGq6vs` 0:12.6–0:12.75), where the barrel's cap lies flat on the cloth beside the fusee wheel: the two outlines put back on the cloth's plane through a camera whose tilt makes both round (each alone gives the same tilt, 7.8° and 8.5°, so both lie flat), its focal length from the barrel's own top, 16.5 mm up, moving 1.117 times as far as the cloth between 0:12.68 and 0:13.38; the cap is 1.009 of the fusee wheel's tips (r 18.09, 90 teeth at the measured centre distance), r 18.26 (17.9–18.5 over the camera's unknowns), and the barrel's own end 1.02 of the cap. BunnSpecial's side-on turntable (`bEWF2ivi1Rg` 0:06, 0:21) shows the wall straight, 1.8–2.2 mm in from the pillar plate's edge (r 18.1–19.9, rough). The coils' pitch, which with the parts list's 0.419 strip asked r 20.5, is ruled out as a measure of size (`References/VIDEOS.md`). Until 5 October 2026 the wall was r 17.6 under a 0.7 mm lip, from C Spinner's video (23:30, the barrel standing on the mat beside the upper train bridge, an upright cylinder through a camera scaled by the bridge: the top lip r 18.3, r 17.4–19.6 over the focal lengths the frame allows; 13:06 agrees roughly), and the cap 0.4 wider. It fits inside the train bridge's measured cut round it (r 21.0 centred 2 mm outside its axis, about 19.0 on its inner side). It is 16.5 mm tall cap to cap, from 2.4 mm over the pillar plate (over the centre wheel, 0.28 clear) to 1 mm under the train bridge's top: side-on frames (33:09.5–33:35) give its height to radius as 0.95 ± 0.06, camera-free, and the 23:30 fit gives 15.6–16.3 at the focal length that agrees with them (±1.2 mm). It was r 13.5 and 13.2 tall until October 2026.
- The barrel's cap (r 18.3, the wall's `RB_O`, flush with the wall: 33:34; r 18.0 in this note until 25 October 2026) and its five screws on r 16.6, 72° apart (15:54 rectified) are measured; they go into the wall's end, as RMG's catalogue has it ("secured with five screws into the edge of the barrel wall"), the wall 1.95 thick there and all the way down (16:54); their threads' depth (0.8 into the wall past the cap), the cap's thickness (0.6) and the screws' starting angle (115°) are estimated.
- The dust seal's inside: a chamber open underneath, the seal ring (42052) pressed against its roof by the helical seal spring (42053), which stands on the barrel bridge round the fusee's bushing (KLUwI2UUCMQ 12:33.0-12:39.0, the seal lifted off and the two taken off after it, as Ops. 29-30 and Fig. 24 order them). Measured there against the arbor's shaft: the ring r 4.7 (4.6-4.9) bored 1.87, the spring r 4.07 outside, its wire 0.24, five turns. Estimated: the ring's thickness (0.8; its edge reads 0.7-1.2), the chamber's radius (4.85) and the roof's thickness (0.8, bored 1.9 to pass the square); the spring is drawn as compressed under the seal, about 3.7 tall (3.8 free at 12:34.0). The video shows a metal ring in the packing rings' top (6:29, 44:02: 0.48-0.67 of their radius), perhaps that seal ring, not drawn there. The packing rings themselves are measured as ratios (three, fibre, the bore 0.475 of the outside, 6:29); their outside, r 6.45, the video's rulers put at 6.1-7.9.
- The fusee arbor's collar (r 2.7, from the fusee's large end to the end plate) and the bores on it (r 2.75: the winding ratchet's, the sustaining ratchet's web and the fusee wheel's) are measured on the restoration video (28:08–28:35, 27:26; ±0.3 mm), against the wheel, so drawn ×`FK`. The end plate is cut to r 5.6 to clear the centre wheel's teeth, which run at its height (Figs. 28 and 69 draw it about r 6.7). The winding ratchet's two screws stand at r 4.6, their heads (r 1.15) flush in counterbores r 1.4 (23:30; another movement, James Martin's SNLqsS9wrrM 7:11, puts them at 0.705 of the tips' radius, 4.86, heads 0.17 of it), and the sustaining ratchet is solid from its bore, r 2.92, to its rim (19:12), as measured (5 October 2026; until then the heads stood proud at r 3.0 in its open centre, over a web). Estimated with them: the counterbores' depth (0.35), the fusee's boss under the ratchet (r 5.8, to take the threads), and the fusee wheel's hub carried up as a pipe r 2.87 through the sustaining ratchet's bore, on which the ratchet rides (Op. 20 greases "the outside of the hub", Fig. 71's arrow 2; no frame shows its size; until 15 October 2026 a step r 2.87 on the collar, inferred, which kept the winding ratchet from coming off); the winding ratchet's bore stays 2.75 ×`FK` (2.43; 23:30, flat on the mat, reads 0.335 of its tips, r 2.31, and no hub), and the sustaining ratchet's raised plateau inside r 8.6-9.2 (19:12) isn't drawn, its height not seen. The winding ratchet's tips r 6.9 (23:30) and the winding pawls (pivots r 8.78, ends r 6.8, 1.6 wide, 19:12 scaled on the sustaining ratchet's tips) are measured.
- The dial's four feet and screws (Fig. 107, parts list: 4): feet down into the mounting ring's flange, 45.9 mm out (the top-view photograph's radius), screwed from the flange's train side. Their angles are measured (14 October 2026): on KLUwI2UUCMQ 9:03 the flange's three open feet holes at 132.9°, 226.0° and 318.5° from 12 seen from the dial (319.2° on 40:08; `tools/rimfit.py` anchored on the centre, third and fourth arbors, within 0.5° over focal lengths 4000-6000), and a fourth hole of their size filled flush with steel, a screw's end, at 178.7°, 10° from the take-off slot (likely); the model's 132.9°, 178.7°, 226.0° and 318.9°. Each open one lies 0.85-0.89 of the way from the bore to the flange's rim along its own ray (radial strips through each hole: a ratio on one face, no camera needed), the filled one at 0.97 of their circle. A fifth plain hole of their size at 2.3° (3.0° on 40:08) lies 0.23-0.29 of the way, about r 41.4, among the ring screws: drawn, what it holds not known (a steady pin's?). On 14 October it was first taken for the fourth foot and the model put one at 2.6°, until the strips put it inside the feet's circle. The top-view photograph's movement (2E11795) has flange screws at about 152° and 224° through `topview.py`'s map; the model had those two (38.5° and 111.6° in that photograph's frame) and two opposite them (estimated, 38.0° and 323.5°). Its 152° is 20° from the video's 133°, so the four follow the one movement that shows them all. Still estimated: the radius on the video (its dial side's scale is the bore's, about 5 % uncertain) and the feet's size.
- The mounting ring's bore, r 39.0, is measured on the video; the relief in the bore's dial-side face round the 12 (11° back to 10° on, 0.4 mm out, 1.0 deep: the video shows a recessed shelf there, its size rough); the alignment pin's place (12 o'clock) and size, and its slot in the case.
- The dial take-off slot (Fig. 21): a notch in the flange's rim, 167° round from 12 seen from the dial, 1.4 mm wide and 2.2 in from the rim, read on the restoration video (9:03, the ring face-on through an ellipse fitted to its rim, oriented by the indicator's stud and the bore's relief; ±3°, sizes ±0.4 mm); its depth, 1.0 (the flange's top layer), estimated: its floor shows brass, so it doesn't go through.
- The case's sizes: the recess round its top fits the ring's flange (r 48.0, 0.05 mm clear) on a shoulder 0.9 mm wide, outside the dial screws' heads, the rim 105 mm across (the top-view photographs); its outside below the bezel measured on a side-on photograph (Renaissance Antiques, LPEC109-4) and KLUwI2UUCMQ 8:33, scaled on the band: a band, a step to a wall 0.962 of it, a chamfer to a base 0.82 of it, 49 mm deep (the floor at 42.8, 64 until 5 October 2026). Since 26 October 2026 the case's rim is threaded 5.5 mm up from the lip (KLUwI2UUCMQ 47:22.5 and Jones-Horan 63662_07: five grooves; pitch 1.1, the 60° basic form, roots r 48.35, crests 48.95; right-hand estimated), the alignment pin's slot cut through it, and the bezel is one turned solid on that thread (the Wempe's machinery: its thread, `lathT`): its outside traced on LPEC109-4 at the knurl's scale (r 54.2, KLUwI2UUCMQ 2:42), a plain skirt r 49.45 over the thread, a cove from 7.0 mm flaring to the knurl, the knurled band at the top (r 54.15, 3.4 tall: 48:27.61; a diamond knurl of about 0.85 mm pitch, 400 round, its depth 0.3 estimated), 17.6 mm in all; inside, the glass in a groove on its seat (r 45.9) under a sight cone to the top's inner edge (r 53.0; 0:28.7's bright cone, its depth estimated). The knurl is at the glass end (0:28.7, 1:22.5, 2:33-2:43): until then it was drawn at the case end (48:30 read so) with a cone over it to the crystal, and LPEC109-4's cove and band were drawn as the case's. Estimated: the wall's thickness (1.2), the sight cone's depth. The gimbal ring is r 66–68, from the top-view photographs, which 0:28.7 confirms against the bezel. The box is 197 mm outside, its walls 21 thick (0:28.7; 5 October 2026).
- The trip spring bracket's screw (1770) along the bracket's leg into the cross-piece, and the trip spring's foot under the head of its screw; the hairspring stud a bar tapped for its screw, its steady pin through it into the cock; the locking arm's stop pin pressed into the train bridge; the winding stop's thread 2 mm into the barrel bridge; the balance screws' threads in the rim; the timing and vernier weights nuts on their screws. Positions and sizes estimated.
- The case's winding-hole shield plate. Sourced: its parts (plate, shoulder screw, stop screw, return spring; parts list) and their arrangement in Fig. 107: a disc nearly the size of the case's flat bottom with three holes (the shoulder screw's at its centre, the key's, the stop screw's on the other side), and the return spring an open ring with a hooked end, between the plate and the bottom, the stop screw going up through the plate and the hook; its action, turned clockwise, seen from below, until its hole lines up with the case's, and returned by the spring (Sec. III, Fig. 7). Measured (KLUwI2UUCMQ 47:24.0, 47:36.5, rectified on the plate's traced edge, scaled by the key hole's place): the plate r 30.1, its key hole r 3.34, the shoulder screw's head 9.1 across, the stop screw's head 4.6 across 16.3 out opposite the key hole, screwed into the plate and turning with it, and a fourth hole (r 1.7, 90° from the key hole, clockwise seen from below); the raised ring round the plate r 30.5-33.7 (rough). Estimated: the thicknesses, the gap, the half-radian turn, the spring's pin in the case's bottom and what stops the plate (unseen).
  - The plate r 30.1 (measured, above) and 0.8 thick (estimated), 0.5 mm below the bottom, turning on the shoulder screw at the case's centre through half a radian (estimated: the turn isn't seen, 47:20-47:44, 8:33).
  - The stop screw is screwed into the plate 16.3 mm out opposite the key hole and turns with it, its end standing up into the gap (47:24.0 and 47:36.5 in both states); what stops the plate's turn lies under it, unseen. Until 5 October 2026 the plate was r 33.3 (36 before) with an arc slot round a stop screw fixed in the case.
  - The spring's ring (wire r 0.18) runs from its hook round the stop screw's end the long way round to a pin pressed into the case's bottom 4.5 mm from the centre, its end turned in to the pin (estimated); it is rebuilt as the plate turns.
  - The case bottom is 1 mm thick.
- The screws' shanks: a thread of half the head's diameter (0.07 mm for the trip-spring screw in the bracket's thin leg; the cock screw's measured, r 1.23, 0.37 of its head's width, its head a cheese head r 3.33 and 10.0 long (1.5 times its width: 5:59, 44:02) in a counterbore r 3.7 (7.4 across on 6:29 through the fitted camera; the head 0.90 of it, as the photographs have it) 11.2 deep; r 1.0, a head r 2.75 and 8.2 long in a counterbore r 3.05, until 12 October 2026), drawn as turned rings, and each one's length. The parts list gives the screws, not their threads or lengths. The cock screw sits 0.3 mm off its traced position (within the tracing's 0.4 mm) so its thread cleared the edge of the foot the cock was once drawn on.
- The lower train bridge: its sizes are measured on C Spinner's video (40:08, the dial side fitted at the plate's scale; `References/VIDEOS.md`, "The lower train bridge"): 4.4 mm thick (4.2-4.9), 10.65 wide (±0.15, since 24 October 2026: 40:05 10.62, 9:03 10.86, 14:40 10.65, each against the settings' spacing, 11.30 by the train; 10.0 from 40:08's fitted camera before), from 18.3 mm short of the third arbor to 10.3 past the fourth (40:05 10.32, 9:03 10.22; 10.0 in the model, 9.2 until 24 October 2026: see pillar 1 below), its screws 13.6 and 6.1 out, the settings in counterbores r 3.0 at its top. The settings run through it: gilt at its train-side face too, about r 2.5 (34:30). The opening in the plate under it is measured on 34:30 and 40:08 (`References/VIDEOS.md`, "The plate's opening under the lower train bridge"): a circle r 11.3 about the third arbor, a lobe r 4.85 at (2.9, 10.9) toward the balance, and a bore r 3.2 about the fourth (the lobe's place to about 1 mm). Estimated: the counterbores' depths (0.8), the settings' size (r 2.5), where the stones sit in them, the bore under the stones (r 1.1), and the steady pins' places (16.4 short of the third, past the screw, and beside the fourth's setting; outside the opening).
- The motion work's counts are C Spinner's video's (cannon pinion 14 : minute wheel 56, minute pinion 18 : hour wheel 54; the wheels whole on the mat at 23:45-23:46, the pinion's 18 leaf ends on the wheel's back at 9:06, the cannon pinion's 14 forced by the ratio of 12); their modules come from the minute wheel's place, at 3 o'clock 11.3 mm from the centre, where C Spinner's video puts its stud (40:08 at the plate's scale; the dial-side photograph, mapped through anchors that have since moved, gave 10.5; Fig. 107 draws it on that side of the hour wheel). On the mat the minute wheel reads about 1.13 times the hour wheel across (the model's 1.07) and its pinion 0.28 of it (0.33): by eye on an oblique frame, not acted on.
- The teeth's profiles: cycloidal clock teeth in BS 978 Part 2's proportions (the manual gives no profiles): a wheel's tooth 1.41 module thick at the pitch circle with radial flanks and an epicycloidal addendum capped at 1.15 module, a pinion's leaf 1.05 module thick with a round tip, both 1.3 module deep. So the backlash is estimated too: each mesh is drawn as it runs, the driven flank on the driver's driving flank and the rest behind (`gearLash`, "Meshing" under Modifying the model).
- The train wheels' sizes: their modules follow from the measured centre distances and the counted teeth (`MOD`), the third stage 0.251 and the fourth 0.246, within the 0.243–0.254 the measured tips allow for one module through both. The centre and third wheels' tips are measured in millimetres (13:52, within 1 %); the fourth's only through the third ÷ fourth ratio (r 9.4–9.8; the model's 9.50), not directly (`OPEN-QUESTIONS.md`).
- The pillar screws from the dial side (four), the mounting ring's three screws' radius and threads (the screws go in from the train side, through the plate into the ring, as reassembly Op. 1 and Fig. 29 have them; their angles are measured, 14 October 2026: on KLUwI2UUCMQ the heads at the plate's rim from the train side at 215.1° and 335.0° (34:30, r 40.3-42 against the plate's 43.785), their ends in the ring's three threaded holes from the dial side at 90.9°, 213.8° and 336.9° (9:03) and 92.6° and 337.5° (40:08), and the top-view photograph's head at the rim under the train bridge at about 215°; the model's 91.5°, 214° and 336.5°. They were at 70°, 190° and 300° until then: the photograph's 6 o'clock head read before the photographed group's 19.4° turn and not turned with it, the other two estimated. Their radius is measured too: 42.0 mm, the threaded holes 0.31-0.33 of the way from the bore (r 39.0) to the flange's rim (47.95) along their rays on 40:08 and 9:03 (radial strips, no camera needed; one 0.47), 41.8-42.2, the heads on 34:30 41.9-42.8, and through the plate at most 42.4; r 40.6 until 14 October 2026, in tabs the band reached in with under each. Each is tapped through the band and the flange, as the video's ends show them; how far the end stands below the flange's face, 2.0 mm (four or five thread crests show above it on 40:08), and the thread's pitch are estimated), the dial screws (one into each foot), and the posts of the minute and wind indicator wheels with their screws from the train side. The parts list and Figs. 107 and 110 give the parts, not their sizes or positions.
- The endstone caps: the escape lower cap, a steel plate 1.3 mm wide over the setting, its screws 2.1 mm either side of the arbor (estimated); the escape upper and balance lower caps are measured (above), their screws' heads r 0.75 and r 0.5 on the video though the parts list gives one screw (20762) for all of them; the threads (r 0.225) estimated. The balance lower bridge's steady pins (one in each lug) are estimated: no frame shows the joint they would be hidden in.
- The balance's hub, cap and hold-down screws (Fig. 4): a flange 0.6 mm thick under the arm, a boss through it; the cap a lobed link as Figs. 4 and 108 draw it (lobes r 1.5 round the screws, 7.3 long, 0.85 thick, its collar a rim round the staff; hidden on every frame), the screws' heads r 0.85 flush in its counterbores, 2.15 mm from the staff (measured). The balance's moment of inertia counts them in place of the old hub.
- The train-blocking screw (Sec. II, Fig. 110): its sizes after Fig. 110's section (head 1.74 across and 1.34 tall, spigot 0.92 and 2.4 tall, thread 1.22, dog point 0.7; the drawing partly schematic), and its 5.6 mm travel (the figure's 2.4 draws the lower bridge on the train bridge); the wall round it (bored r 0.95 down to the seat 0.6 mm into the bridge's top: the section gives the arrangement, not the sizes) and the access hole in the train bridge (r 0.72). Its place, 5.0 mm from the fourth arbor, is a countersunk hole on the top-view photograph, to about 1 mm.
- The balance locking arm's sizes (Fig. 9 shows it curved, its screw outside the rim and its end at a timing weight; Sec. X: "place the locking arm over the timing weight"): a strip 0.8 mm wide and 0.45 thick, bowed 0.25 mm away from the staff, turning 120° on its screw 20 mm from the staff in the open 6 o'clock sector of the train bridge (at 45° from the timing weight, just clear of the barrel bridge's far horn; locked, the arm passes between the cock's foot and the escape upper bridge, clear of both by little), with a round finger 2.4 mm tall at its end. Locked, the finger stands 15.6 mm from the staff on the counterclockwise side of the timing weight that rests at the arm's end on the 6 o'clock side (0.02 mm clear), and the vernier weight's screw, standing 1.6 mm outside the rim one hole on, stops the balance 15° the other way. Unlocked, it lies against its stop pin, clear of the balance. It gets there by turning 120° with its end passing in under the balance, where Fig. 9 turns it the other way, out from the balance; here the second train pillar's screw head (1.6 mm proud, 4 mm out from the arm's screw) and the cock's foot leave no room for that (Review-results.md, BOM comparison, still open 9). Fig. 9 draws the arm curved along the rim, about 4 to 5 screw heads long (about 7-10 mm; the model's is 13), and both Fig. 9 and Fig. 108 (item 31) end it in a round eye bent up out of the strip, the timing weight in its hole (Sec. X's "over the timing weight"), where the model has its finger; the screw's end of the strip is plain, its washer and the screw's turned collar on it (Review-results.md, BOM comparison, 9). No photograph or video of the arm fitted has been found: `KLUwI2UUCMQ`'s movement and the top-view photograph's carry the Navy's Y-arm instead.
- The Navy's Y-arm balance stop (Variants, Balance stop, fitted by default; the manual's locking arm is the other choice; illustrative): as on serial 2E11795 (the top-view photograph), Delaney No. 8854 and a third movement, the last two photographed from straight above. A second dust seal on the barrel bridge, like the fusee's: a nickel body on a flange held by screws, packing rings (black on 2E11795, the cap the fusee seal's size), and a nickel plunger head with a hex socket screw (Sinclair's No. 2E6125, *NAWCC Bulletin* 365, 2006, Fig. D: turned about two turns clockwise by a knurled key with a hexagonal tip, through a covered hole in the case; the yoke's two tips on the balance nylon, drawn steel here: his halftone too coarse to measure them). Under it runs a lever of spring steel (satin, as photographed). Its root is held on a shouldered stud by a large slotted screw near the bridge's rim; the stud takes the place of the barrel bridge's pillar screw, which both photographs put within 2.5 mm of it. The lever runs straight under the cap, through a slot in the seal's body, to a crossbar symmetric about it: an arch round the cock's end, its legs coming down 7.8 mm either side of the staff (clear of the hairspring) and rounding over in a half circle, its top 8.3 mm out on the bar's centre line, and from the foot of each leg, level with the staff, an arm straight out to a round eye with a pin over the rim (13.9 mm out). Measured: the widths, on Delaney's photograph (stem 2.9 mm, lever 2.5, bar 2.2, eyes r 1.4), and the eyes' places (level with the staff, over the rim; Delaney's and 2E11795's photographs registered by the balance rim agree with them to about 1 mm; the cock's edge hides the left end on 2E11795). The arch is traced on Delaney's photograph (its radius about 7.9 mm, its top 8.3, the arms nearly level with the staff); all four movements photographed with the stop (2E11795, Delaney's, the omegaforums one and 2E8489 in the restoration video) have this shape (Review-results.md, open findings 13). Until 4 October 2026 its top stood 12.3 mm out, after a sketch. The outline is the boundary of bars of those widths joined with round fillets, cut as one plate. Estimated: the heights, the lever's 0.45 mm thickness, the stud and its screw, the chamber and slot inside the body, the second flange screw's place, the flange's bite round the setup cover's end and pad (since 21 October 2026 on the cover's measured end circle, deep enough to open the flange's ring), the seal's place 0.3 mm off its screw holes' midpoint as read on 13:04.4, away from the cover's measured end (which came 0.12 mm into its packing), and the screws' threads (not drawn; the bridge is the manual's). The manual doesn't describe the stop (its "balance stop", Sec. I, is Fig. 9's arm), so how it works is taken from two descriptions of it (Review-results.md, 13): the plunger, screwed down by its hex socket with an Allen key through the bottom of the case, presses the lever down, which bends about its screwed root (drawn as a turn about the horizontal through the pivot, along the crossbar, so both pins come down together) until the pins bear on the rim's top edge, as the wedges did; free, they stand 0.5 mm over it. Locked and Unlocked under Stopping and starting work it as they work the locking arm. It is the same part as the locking arm (`lockArm`), and that part's card, name and source note follow the stop fitted (`STOP_INFO` in `app.js`).
- The gimbals at sea: the ship's roll and pitch axes 5 m below the box (`GIM.RD`; their distance sets how far the case leans to the apparent vertical: 5.4° at 7 s and 14°), faded to 0 for periods under 4 s; the case's own period (0.7 s) and damping (ζ 0.05); the ship's motion (14° of roll, 0.55 of it in pitch at two thirds of its rate, so it repeats every three rolls).
- Stopping and starting: the arm's braking (0.2 s), and the balance banking on a tooth the train-blocking screw holds in the impulse jewel's path stopped as quickly; the twist's 35° turn of the box, out in 0.1 s and back 0.25 s later (the balance's swing from it, 67° from rest, follows from the turn); the build-up to `ESC.A` follows the balance's dynamics (with the twist's 67°: 203° after 25 s, 232° after 45 s, 246° after 68 s, against the video's start, 190°, 230° and 256 ± 9°). `ESC.AMIN` is worked out from the escapement.
- The escapement's amplitude and rate ("The escapement's amplitude and rate"): the free run-down's 67 s (`TF`, Q 421; 52 s until 12 October 2026, 68 until 14 October 2026) is set inside both what the energy budget needs with the train's efficiency from its parts and the mainspring's own losses (262–423) and what the balance's parts give (406–712, the endstone's friction measured on `Jd2c3x8VKsE`'s small free swings), at the torque the videos' spring gives through the train as the old calibration took it (`tools/physics.js`); two real movements settle as if it were 130 s or more, the published figures put it at 48-111 s (OPEN-QUESTIONS.md, not settled); the air's drag coefficient and the spring's internal damping, which now set most of the parts' range, are estimated; friction at the locking jewel μ = 0.15 (steel on sapphire); the fourth wheel's inertia in the wheel's chase (about 1.4 of `JW`'s 6.2 g·mm²); the detent spring's and trip spring's sections (`hD`, `tsH`: OPEN-QUESTIONS.md; the detent spring's thickness under 0.139 mm, where Op. 78's 0.005 in would leave it no preload) and moduli; the radius on the back of the discharge jewel's end (`rB` 0.158 mm, half the jewel's width: the British Museum's catalogue, no. 117A, gives the radius but not its size; chosen with the trip spring's tip `rT` for overall in the middle of Op. 87 and the most escapements made to a maker's tolerances running), its reach (`rd`, 0.50 mm proud of its roller: KLUwI2UUCMQ 6:58 reads 0.4-0.5, ±25 %) and its length along the staff (0.7 mm; the same frames read 0.85-1.0). The escapement's own error at the model's settings (−3.0 s a day) is taken to be timed out; the rate shown is the change from it.
- The sustaining pawl's arbor is placed on C Spinner's video, its foot read on two frames (36:15 through `rimfit_36-15.json`'s camera: 21.8 mm from the fusee axis at 67°; 14:06, nearly overhead, through a homography on the plate's bushings and pillars' feet: 21.7 at 71°), the model 21.8 at 69°; its blade the crescent 36:15 shows (its two edges put through that camera at the blade's height). its outline one smooth curve through those edges, the tip's end face straight between them. Estimated: the root's back behind the arbor (the video doesn't show it; drawn 1.6-1.9 mm from the arbor), the hub's height (to about 1 mm) and the arbor's radius (0.7; the video's reads about 0.9, against the pillar beyond it).

## Modifying the model

Every new piece needs its parts-list line: `hn(object, 'line id')` on one object per piece (`{sub:1}` on any other mesh of the same piece), and a line or relation in `bom.json`. Then run `tools/bom.py` (it fails on a mesh with no line) and `python bom.py --md` to regenerate `BOM.md`.


Work on `index.html` (not the built file) and reload the browser after each
edit; see "Changing things" in the root README for the loop and the checks.

### How the code fits together

- **Load order.** The four scripts are classic scripts that share global names,
  loaded in order: `core.js`, `../shared/escapement.js`, `movement.js`, `box.js`, `app.js`. A later file
  may use anything an earlier one defines, never the reverse.
- **Style.** The code is deliberately dense: long one-line statements and short
  names. Keep new code in the same style so it reads like the rest.
- **Frame and units.** Millimetres, in the movement frame:
  - +y is the dial side, −y the train side;
  - −z points to 12 o'clock, +x to 3 o'clock;
  - the pillar plate spans y = −3.86 to 0, and the dial is above y = 0.
- **Parts.** `buildMovement()` in `movement.js` builds the movement from
  *parts*. `part(name, off, ef)` makes a group:
  - `name` is the part's id; it links the part to its description, colour,
    label and picking;
  - `off` is how far the part rises in the Exploded view, in millimetres (the laid-out view moves parts only across, in x and z, so the two combine).
    Where two parts overlap seen along the arbors, the one on top must rise more, or it passes through the other as the Spread slider moves: the
    fusee and barrel rise above the centre and third wheels they cover, the fusee wheel above the centre wheel. The third wheel, escape wheel,
    detent and lower bridge are nested (the escape pinion runs under the third wheel's rim and the lower bridge's edge, the escape wheel over
    both), so they rise within a millimetre or two of each other. `tools/exploded.py` checks every pair;
  - `ef` set to true puts the part in the escapement's rotated frame.

  Put meshes in a part with `mesh(parent, geometry, material, x, y, z)`.
  Anything that moves is stored in `R` and moved in `mv.userData.update()`.
- **Solid parts.** Every part is a closed solid facing out, as in a CAD model,
  so a hole shows its wall, a part taken out leaves real metal behind, and a
  cross-section cuts solid material. The only surfaces are the engravings
  (`userData.decal`), the dial's printed face and the floor's shadow
  (`userData.surface`). Build shapes so they stay closed:
  - extrusions through `extrude(shape, options)` in `core.js`, not
    `THREE.ExtrudeGeometry` directly: three.js r128 winds a hole's wall into
    the metal when the outline is clockwise, and `extrude()` turns it over;
  - lathe profiles closed (back to their first point) or run to the axis at
    radius 0, not 0.01;
  - anything else left open (a tube's ends, a lathe or torus turned less than a
    full circle) through `closeGeo(geometry)`, which caps each open loop with a
    flat face. A tube rebuilt as it moves (the hairspring every frame the
    balance turns, the stop-bar spring) goes through `reclose(old, geometry)`,
    which writes the new positions and normals into the old closed geometry,
    keeping its weld and caps: `closeGeo` on the hairspring cost about 9 ms a
    frame;
  - single-sided materials (no `DoubleSide`) and no `noCap` on a new part.

  `tools/solids.py` checks all of this.
- **Cross-sections.** A section clips every material at one plane, and the cut
  faces are the solids' back faces seen through the cut, drawn hatched
  (`patchSection` in `core.js`). They are drawn 0.015 mm nearer than they lie
  (`SEC_DEPTH`, compiled in only while a section is on, also in Edges' id pass),
  so a part lying on the cut one doesn't show through in patches. Two solids
  that overlap show each other through a cut, so keep parts from overlapping
  except at their intended contacts (`tools/fine.py`). Edges draws the lines of
  those back faces too (the hidden edges inside a cut part, across its cut);
  Outlines through the cut (Cross-section, off by default since 3.26.04; `:o` in
  the hash when on, both models) clears `SEC.flat`. With it set, the id pass marks a cut face
  with a normal of 0, which the line pass reads as one flat face: no depth or crease
  line between two cut pixels, only the lines between parts and round the cut.
- **Static pieces drawn merged.** Each frame draws about 40% fewer meshes than
  the model has: the pieces under one group that share a material are drawn as
  one merged copy (`drawMerge` in `core.js`, synced in `app.js`'s `paint()`).
  Performance mode (Display, on by default) switches it: off, `sync(false)`
  draws every piece itself and keeps the copies for when it comes back on.
  - The pieces stay where they are, for the tools, picking and every display
    mode. The copies live in a group of their own in the scene, outside the
    model's tree, and that group's `traverse()` stops at itself, so the tools,
    which walk `__mv` or the whole scene with `traverse()`, never see them.
    three.js draws, updates and raycasts through `children`, so it still does.
  - A batch is drawn merged only while all its pieces are shown and wear their
    own material (`userData.mat0`). Colour modes, fading, ghosts, the load
    path's tint and the drawings change materials, so those parts draw
    their pieces instead, with nothing to keep in step.
  - A piece that moves against its group, or whose geometry is rebuilt or
    replaced, leaves its batch for good the first frame it does, and the batch
    is merged again without it. Animate a piece by moving it or its group, as
    the model already does.
  - A merged piece leaves layer 0, the camera's, for layer 2. A raycaster that
    should hit the model enables layer 2 (`app.js`'s picking and label
    occlusion) or all layers (`bom-check.js`, `geometry-audit*.js`).
  - The copy casts shadows for its pieces, since r128's shadow pass tests
    layers against the main camera, not the shadow camera.
  - The copies carry each piece's Edges id per vertex (`aId`, from `inkTag`),
    so the lines between pieces are drawn as before.
  - Left out: transparent materials (drawn sorted, one by one), decals and
    surfaces, instanced meshes and geometry drawn only in part. `__dm.stats()`
    (`?qa`) counts the batches and how many are drawn merged.
- **One clock drives everything.** `app.js` advances `tSim` and passes
  `update()` the escape wheel's position `E`, the balance angle and the hours
  since winding. Each arbor turns by a fixed ratio of `E`, so never animate a
  wheel on its own clock.

### Common changes

**Change a part's shape or size.** Find where it is built in `movement.js`,
usually a few lines after its `part('<name>', …)` call, or in `box.js` for the
box and gimbals.
- **Flat plates and bridges** are outlines extruded by `polyGeo(points,
  thickness, holes, bevel)` or `discGeo(radius, thickness, holes)`. Holes are
  `[x, z, radius]`. A hole that crosses an outline or another hole is reported
  as a warning in the console.
- **Round parts** (screws, posts, collets) use `LatheGeometry` profiles or
  `cylY(radius, height)`. Close each profile or run it to the axis (see
  "Solid parts" above).
- **After a shape change,** run `tools/solids.py` (every part still a closed
  solid) and `tools/placements.py` before and after (nothing else moved).
- **Wheels and pinions** are `arbor(parent, M, x, z, {wheel, pin, ar})` with
  `gearGeo(teeth, module, thickness, options)`. The pitch radius is
  module × teeth ÷ 2. Teeth are cycloidal clock teeth: a wheel's epicycloidal
  addendum is rolled by a circle half its pinion's pitch radius (`wheel.mate`,
  the pinion's leaves), a pinion's leaves have round tips; the geometry's
  `userData` gives its tip radius (`ro`), root (`ri`) and hub, which `arbor()`
  uses to check that a pinion ends at its wheel's boss, and its outline (`pl`).
- **Meshing.** Each pair is phased once, as it runs under load: `ph()` in
  `movement.js` calls `gearLash` (`core.js`), which centres the driver's tooth on
  the line of centres and the driven gap opposite, then turns the driven member
  back until its flank lies 0.005 mm off the driver's driving flank where the two
  come closest over a whole tooth (the profiles aren't conjugate, so the gap
  varies as they turn), so the backlash is all on the far side and the teeth
  never pass. It needs the way the driver turns as the train runs, as `update()`
  turns it (its `rotation.y` rising for the fusee wheel, third wheel, minute
  pinion and fusee arbor, falling for the centre wheel, fourth wheel and cannon
  pinion). The laid-out view
  keeps the phase (`DPH` rolls each pinion on), and so does the Essay's train
  figure. Winding turns the fusee arbor's pinion back, and setting the hands
  back turns the cannon pinion back; the backlash would then cross to the other
  flank, which isn't drawn.
- **Arbor positions** come from the photo fit, in `L` at the top of
  `movement.js`. Don't move them without re-running the tools in `tools/`.

**Add a screw.** Use `screw(parent, x, z, y, radius, headHeight, length, thread)`:
- `y` is the surface the head sits on;
- the head extends from `y` towards −y, so it seats on the train side; build
  in a frame turned over (`rotation.x = π`) for a screw put in from the other side;
- `length` is the threaded shank, toward +y: through the parts it holds and
  about 3 mm into the part it screws into;
- `thread` is the thread's radius, half the head's (`sR`) unless given;
- cut the holes: `hC(x, z, radius)` (clearance) in each part the shank passes
  through and `hT(x, z, radius)` (tapped) in the part it screws into, in the
  part's `polyGeo` / `discGeo` / `gearGeo` hole list (pass the same `thread`
  if you gave one). `polyGeo` draws these holes 0.8 × its bevel larger, because
  its bevel narrows every hole by that much at both faces;
- work out the position once, in the `S` table at the top of
  `buildMovement`, when a part built earlier needs its hole;
- screws are tagged `userData.screw`, which is how the audit finds them, and
  kept in `SCREWS`, which the Exploded view lifts out of their holes (by the
  shank and head's length, `userData.lift`). A screw put in through another
  part takes `headOn(screw(...), 'itsPart', 'thatPart')`, so it leaves with
  that part before lifting out; one its own part covers (the balance hub's)
  stays in, `lift` 0. `loose(group, lift)` does the same for any other piece
  that comes off its part another way (the fusee's end plate, the barrel arbor);
- run `fine.py`: a shank in a part without its hole shows as a new overlap.

**Add a new part.**
1. Build it in a new `part('myPart', explodeOffset)` group in `movement.js`,
   or in `box.js` (give that group `userData.partName = 'myPart'`). Choose the
   offset so it stacks with its neighbours (see `off` above) and run
   `tools/exploded.py`.
2. `app.js`: add one entry to `PARTS`, in the place it should take in the
   parts list: `myPart: {t: 'Title', g: 2, c: '#a0922f', d: 'What it does.',
   sp: 'Part number or spec'}`. `g` is its group in the parts list (`PG`), `c`
   its flat colour for Colour by part; add `plate: 1` for a plate or bridge
   (see-through with the plates, hidden by Moving parts only) or `dh: 1` to be
   hidden by Moving parts only, and `pri` to rank its label. Say where its
   shape and size come from: `src` (`manual`, `photo` for measured, `solved`
   for placed or sized to fit, `est` for estimated; `SRC`), `sn` (a short note
   of what came from where) and `figs` (the manual's figures that show it), in
   step with "Sources" and "Estimated, not from the manual" above; they show on
   its card and in Colour by source. Without an entry
   the part can't be tapped or right-clicked. `INFO`, `PCOL`, `PRI`, `PGRP`,
   `PLATES` and `DRIVE_HIDE` are derived from `PARTS`.
   If it is several things, list its pieces in `PIECES`: `{k, t, h, d, sp}`,
   `h` the parts-list lines (`bom.json` ids) its meshes carry (`hn()`). A mesh
   is the piece listing its line; where the line doesn't tell (the balance
   hub's flange carries the staff's 42186, the other dial styles' hands none),
   tag the object with `pc(object, k)` in `movement.js`. `smoke.py` checks that
   every mesh of the part lands in a piece, and `bom.py` the pieces' numbers.
   The part's key stays its meshes' `partName` for every tool; the piece's key,
   `part.k`, is only the page's (picking, cards, the list, colours, links).
3. `app.js` (optional): add a label with `addL('Text', 'subtitle', 'myPart',
   anchor, group)`:
   - the anchor is a point on the part, e.g. `pw(P.myPart, x, y, z)`;
   - the group is `'mv'` (movement views), `'dial'`, `'box'` or `'motion'`.
4. `README.md` (this file): record where each dimension comes from, or add it
   to "Estimated, not from the manual" above.

**Change gear ratios or tooth counts.** The counts are in `TRAIN` (the fusee
wheel and centre pinion `fu`/`cp`, then the going train), `MW` (motion work) and
`UD` (wind indicator) at the top of `movement.js`; `MOD` holds the tooth sizes.
- Everything follows from these: the ratios (`ESC_PER`, escape turns per turn
  of each wheel), `FUSEE_PER_HOUR`, the hands, and every count or turn time the
  page shows (labels, part cards, the walkthrough's train and motion-work
  tables and its live angles). Only the tooth counts written in this README
  need updating by hand.
- `MOD` is worked out from the centre distances in `L`, so a new count changes
  a wheel's module, not its place. Re-run `tools/solve.py` (it reads the counts and `L`
  from `movement.js`) for the new modules and wheel tips and whether an arbor now stands in a wheel, and
  check clearances with `fine.py` (`dyn.py` can't see gaps under 0.4 mm).

**Change the dial.** The dial is painted on a canvas in `dialCanvas()` in
`core.js`: chapter ring, numerals, the seconds and UP–DOWN sub-dials and the
inscription. The default, Hamilton dial follows a photographed Model 21 dial of
the U.S. Maritime Commission contract; `SERIAL` (top of `core.js`) is printed
in its seconds sub-dial and engraved on the plates. `dialCanvas('usn')` is the
same face as made for the U.S. Navy: a ringed N with the dial's Navy number above
the seconds' centre and the year below it, in place of the serial and the
contract, measured on a photograph of 2E7832's dial (N 7832, 1941) against the
seconds track and checked on C Spinner's video (46:44, N 5892 on movement
2E8489: the number is the dial's, not the movement's); `NAVY` (top of `core.js`)
prints 2E7832's, since none is known for 2E12055. It wears the Hamilton hands.
The numerals are sized from
the loaded face's measured figure height, so `app.js` loads the canvas-only
font faces before building the model. `dialCanvas('roman')` draws the Variants panel's alternative, a
Roman dial after the A. Lange & Söhne deck chronometers (no maker's name or
number; its AUF–AB wind scale uses this movement's sweep, `UDA`).
`dialCanvas('swiss')` and `dialCanvas('soviet')` share one branch for the
Nardin pattern. The Swiss one follows the Ulysse Nardin dial photographed by NOAA
(Roman hours, UP/HAUT–DOWN/BAS). The Soviet one follows the First Moscow Watch
Factory's copy of it (Arabic hours, ЗАВОД–СПУСК, СДЕЛАНО В СССР, its Cyrillic
set in system sans because the vendored fonts are Latin only). Both leave off
the maker's name and number and keep this movement's wind sweep (`UDA`). `References/` holds
the photographs. The hands are `handGeo()` shapes in `core.js` (spade, leaf,
lance, pear, plain; a negative tail gives a spear counterpoise; `at` moves the
pear's bulb; `{boss, bore}` or `{boss, sq}` draws a round boss with a round or
square hole, as the hour and minute hands have; `sqRingGeo()` makes the
minute hand's collet and the keys' square sockets), placed in the
"dial, hands, motion work" block of `movement.js`. Each dial style has its own
set (`userData.dk`), switched with `mv.userData.dial(kind)`, which paints a
style's texture on first use.

**Change materials and colours.** `mats()` in `core.js` defines every material
(`M.plate`, `M.gilt`, `M.steel`, `M.blued`, `M.ruby`, …). Colours are sRGB hex
values. The Nickel/Gilt plate finishes are in `PLATE_FINISH`. The third, Ulysse Nardin
(as No. 7400, c. 1955; `References/ulysse-nardin-7400/`), is the colours of that chronometer
on this movement: its frosted gilt plates and bridges (no damascening), its gilt bowl and
gimbal ring and the movement's other brass (matte), and its redder mahogany (the same grain
on its own ground), in `UN_FIT`, applied by `M.setPlateFinish('un')`; chosen by hand it puts
on the Swiss dial too. Each colour is fitted on the page: the surface rendered in the
Movement, Dial and Box views, its pixels' brightness bands and G/R, B/R against the
photographs' over the same kind of surface (the numbers are in `core.js`). The shapes stay
the Hamilton's (its box keeps its brass corners; 7400's box has none, and nickel fittings).

**Edit the walkthrough.** Each step is one entry in `TOUR` in `app.js`:

    {t:'Title', x:'<p>HTML text</p>', drive:true, v:{lift:1, flip:1, explode:0, yaw, pitch, dist, target:mvL(x,y,z)},
     speed:1, focus:['part', …], inset:'esc'}

- **Camera** (`v`): `yaw` and `pitch` in radians, `dist` in millimetres;
  `target` is the point to look at.
- **State:** `lift` and `flip` take the movement out of the case and turn it
  over; `explode` spreads the parts apart.
- **`focus`:** parts left solid; everything else goes see-through.
- **`inset`:** the live diagram. It is one of `'power'`, `'fusee'`, `'wind'`,
  `'train'`, `'esc'`, `'bal'` or `'motion'`, all drawn in `setInset` and
  `drawInset`.

Update the step count in `index.html` ("Eight steps …") if it changes.

**Add a view button.**
1. Add an entry to `VIEWS` in `app.js`, with the same fields as a walkthrough
   camera.
2. Add a `<button data-v="name">` to `#views` in `index.html`.
3. To find good camera numbers: open `index.html?qa`, orbit to the view you
   want, and run `__camInfo()` in the console.

**Change the escapement.** Its geometry and motion are solved by `makeEsc` in
`../shared/escapement.js`, in a unit frame scaled to the escape wheel's radius;
`movement.js` builds `ESC` from it with the centre distance in `L`. Its settings
(`rT`, `rd`, `dL`, `DRAW`, `aI`, `aD` and the rest, angles in degrees) are the
defaults listed at the top of `makeEsc`.
`ESC.state(p)` returns the balance angle, detent lift, trip-spring deflection and
escape-wheel progress for balance phase `p`. The 2-D plan (`drawEscPlan` in
`../shared/escplan.js`: the walkthrough's inset, the adjuster's bench and the essay's detent figure) draws from the same data, so they stay in step.
The detent's plan outlines are `ESC.pieces` (turning about the point of
flexure) and `ESC.fixed`; their heights are set where the detent is built.
After a change, run `node escapement.js` in `tools/`. It measures lock, let-off,
overall, drop, roller shake and the horn clearance, and flags any outside the
manual's figures. The measurements and tolerances are `ESC.measure()` and
`ESC.checks()` in `makeEsc`, so the tool and the page's adjuster's bench use
one definition; `measure()` also says when a setting would not run at all
(`runs`, `why`), among them a balance swinging too little to keep it going, and the tool then exits with 1. It also prints the running amplitude and the escapement's rate against the model's settings. To try a setting before editing, pass it on the command line,
for example `node escapement.js rT=0.29`. Record the results in the escapement
entries under "Estimated, not from the manual". The essay's detent figure and
the figures in its text (lock, let-off, drop, overall, shake, horn clearance) read
the model's own `ESC`, so they follow the change. `node escapement.js`
exits with 1 when a figure is out of tolerance. `node keystone.js` (same
arguments) prints the escapement against the 1904 text's rules; update
"Against a period text" if a figure there moves.

**Update the link-preview images** after visible changes. From `tools/`, run
`python social.py` for both, or `python social.py dial` or
`python social.py movement` for one, then rebuild from the root. For a custom
shot:

    python social.py --out name.png --view movement --drive --cam YAW PITCH DIST FOV

**Look over the essay** (`index.html#essay`) after a visible change to the box,
gimbals, fusee, chain, train, escapement or balance: its figures are built from the
same code (`buildBox`, `arbor`, `escapeWheel`, `gearGeo`, `springGeo`, `dialCanvas`,
`handShape`, `ESC`, `R.fs`), so they follow, but their cameras and labels were placed by eye.

**Measure performance** after a change that could cost frame time: `python perf.py`
from `tools/` prints, for each view, the frame's cost as opened (Edges on,
Shadows off), with Shadows and without Edges (ms, draw calls and triangles over
every pass, the JavaScript inside the renders), then how many frames a second
the page draws when left alone, and the time to the first frame. It runs
Chromium on the machine's GPU with vsync off; `--throttle 4` slows the CPU about
to a phone's, `--sw` uses the software renderer (a weak GPU), `--views` and
`--dpr` choose what to measure.
