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
| `css/essay.css` | The Essay tab: a reading page laid over the model, in the model's tokens; its classes start `e-` |
| `js/core.js` | Math helpers, materials and procedural textures (plate striping, wood grain, engraving), gear / hairspring / hand / mainspring geometry, dial artwork, cross-section shader patch, the tinted and ink drawings (`drawOf`, `makeInk`) |
| `jsconfig.json`, `js/globals.d.ts` | Type checking without npm: the scripts in load order, and the globals TypeScript can't see; `core.js`, `movement.js`, `box.js` and the shared scripts start with `// @ts-check` (`ci.py` runs `tsc`) |
| `../shared/escapement.js` | The detent escapement's solver, `makeEsc(settings)`, shared with the essay's detent figure and `tools/escapement.js` |
| `../shared/escplan.js` | Its plan, `drawEscPlan(ctx, w, h, state, E, o)`, drawn from the solver's outlines, as Fig. 90 has it: the walkthrough's inset and the adjuster's bench (three names, the stage written under it) and the essay's detent figure (every part named, a dial for the balance's angle); `escStage(state)` names what the escapement is doing |
| `../shared/almanac.js` | A nautical almanac and the navigator's arithmetic, `ALM`: the Sun, Moon and 58 stars, sidereal time, the altitude corrections, sight reduction, the time sight, equal altitudes, clearing a lunar distance, and sights made from the almanac for the essay's worked examples (see "The almanac" below); shared with `tools/almanac.js` |
| `js/movement.js` | The movement: layout constants, the escapement (`ESC=makeEsc(...)`, with the centre distance from `L`), screw positions and holes, pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, train-blocking screw and balance locking arm, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate that turns to admit the winding key), winding key |
| `js/essay.js` | The Essay tab (see "The Essay tab" below): its figures, drawn from the model's code, and the tab, hash and scroll handling. One IIFE that declares only `ESSAY` |
| `js/app.js` | The parts registry (`PARTS`: every part's name, description, part numbers, group, colour and flags), renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, stopping and starting (the balance's amplitude, the locking arm, the train-blocking screw, the twist), and the animation loop |
| `build.py` | Inlines the CSS, JS, three.js and fonts into `dist/` (through `inline.py` at the repository root), with the version and the list of changes from the root `CHANGELOG.md` (`changelog.py`) |
| `dist/chronometer-working-model.html` | The built single file (committed) |
| `tools/bundle.py`, `tools/fit.py`, `tools/unproj.py` | Photo fitting: camera fits to the Fig. 2 and top-view photographs, triangulation of the balance, fusee and barrel axes, photo points projected onto the movement (see "How the layout was measured") |
| `tools/almanac.js`, `tools/almanac-ref.json`, `tools/almanac_ref.py` | The almanac's check (Node, about 1 s): Meeus's worked examples, the Sun, Moon, stars and sidereal time against JPL Horizons and skyfield (`almanac-ref.json`, made by `almanac_ref.py` with the network: SIMBAD's catalogue, Horizons' DE441 places, skyfield 1.55 with de440s), and round trips of every reduction; the essay's stated accuracy (`data-bound` spans) must cover the worst found |
| `tools/solve.py` | Reads `L` and `TRAIN` from `movement.js`: solves the escape arbor against `L.E`, gives the modules and wheel tips, checks the arbors clear the wheels in plan (no browser) |
| `tools/p3map.json`, `tools/cock_outline.json`, `tools/engr.json` | Traced from the top-view photograph: its mapping into the model, the balance cock's outline, the engraving columns |
| `tools/dyn.py`, `tools/interference-check.js` | Voxel collision check through a full escapement cycle |
| `tools/views.py` | Before/after renders of every view (frozen, labels hidden), a pixel diff between two runs (`--md` as a table), and close-ups of chosen parts; `--page` renders another copy of the page, as `ci.py --views` does for where a branch left `main` |
| `tools/isolate.py` | Renders chosen parts alone, everything else hidden, each view beside a reference image (a photograph, a video frame, a figure): the check after any change to a part's geometry |
| `tools/maintaining.py` | The maintaining work over run and wind cycles: the sustaining ratchet never turns back, the sustaining spring is loaded in running and only relaxes while winding, the fusee catches forward when the key lets go, the pawls sit on their teeth, and the stop-bar meets the winding stop at full wind |
| `tools/fine.py`, `tools/fine-interference.js`, `tools/barrel-clearance.js` | Fine (0.05 mm) collision check through the escapement cycle, round the train and over the wind, against a table of expected contacts; the barrel's margins and the mainspring |
| `tools/audit.py`, `tools/geometry-audit.js`, `tools/geometry-audit-box.js` | Geometry audit of the movement (and, with `audit.py box`, the box and gimbals): overlapping or unsupported screws, loose arbor ends, coplanar faces, isolated parts, among the parts shown, in one frozen state; anything not expected (the loose ends in its `LOOSE` table, the coplanar faces in `tools/audit-expected.json`) fails, `--update` rewrites the coplanar faces (`--eval JS` after loading, e.g. to fit a variant or plant a fault) |
| `tools/exploded.py`, `tools/exploded-check.js` | Exploded-view clearance: every part and screw, taken as it stands assembled, against every other, at every spread from 0 to 100 % (none may meet at full spread, or pass through another on the way), over escapement phases, train positions and the wind |
| `tools/solids.py`, `tools/solids-check.js` | Solid geometry check: every mesh closed (no open edge), consistently wound and not inside out, but the decals and surfaces flagged as such; loaded as it is and with Moving parts only and a section on |
| `tools/placements.py` | Every mesh's position and bounding box in seven model states (escapement phases, train and wind positions), and a diff between two runs or two copies of the page: proves a change moved only the parts it meant to, and that the mechanism moves as before |
| `tools/escapement.js` | Measures the escapement against the manual's adjustment figures (Node.js, no browser) |
| `tools/keystone.js` | Measures the escapement against a period text's rules for the chronometer escapement (*Watch and Clock Escapements*, 1904); reports, never fails (Node.js, no browser) |
| `tools/invariants.py` | Checks the model's arithmetic: hands against the time, the wind indicator's scale, the fusee's 56¼ h and 17½ half turns, the balance's moment of inertia and the rate for a turn of the weights (exit code 1 on a failure) |
| `tools/smoke.py` | Loads the model and clicks through every control (views, walkthrough, variants, sections, time zone, keys, a URL-hash link), then opens the Essay tab, scrolls it and works every control in it (the model not drawn under it, at most two WebGL contexts, a link into the model and Back, `#essay=detent`); fails on any console error or warning (`--model`, `--essay`: one half) |
| `tools/p3fit.py` | Renders the model from the top-view photograph's camera |
| `verification/lower-bridge-comparison.png` | The balance lower bridge against its sources: the restoration video's face-on frame (13:49.5) beside the model seen from the same camera (`tools/framecam.py`), the model's outline drawn on the frame, the measured and model plans (`tools/lower_bridge.py`), the two levels side-on (36:45), Figs. 110, 29 and 30, and the model from below, in place and from above |
| `tools/lower_bridge.py` | Lays out the balance lower bridge after the restoration video's (13:49.5, measured with `tools/framecam.py`; formerly 36:01, measured through a camera fitted to the train bridge's rim; Figs. 29, 30, 110) round the model's arbors and what it must clear, reports the clearances, prints `LB_UP`, `LB_WALL` and `LB_LO` for `movement.js` and draws the plan beside the video's outline (no browser) |
| `tools/rimfit.py`, `tools/rimfit_36-01.json` | A plate or bridge lying on the blue mat in a video frame, put in millimetres through a perspective camera fitted to its rim (and to round settings traced on it, made to come out circular): picked points at their heights above the face, turned onto the model by named arbors (no browser). The specs: the restoration video's upturned train bridge with the balance lower bridge (36:01), the dial side (40:08) and the bare plate from the train side (34:30, its rim traced beforehand: `rim_pts`) |
| `tools/framecam.py`, `tools/anchors/lower_bridge_13-49.5.json` | A video frame's camera recovered from the homography `video.py anchor` fitted on it (the focal length where the face's axes come out orthonormal): picks put back on planes at their heights off the anchored face, the `--look` for `isolate.py` that sees the model from that camera, and a render warped onto the frame beside it (no browser for the picks). The spec: the balance lower bridge on the train bridge's underside at 13:49.5 |
| `tools/train_bridge.py` | Builds the upper train bridge's notch, horn and mouth from their edges measured on two frames of a restoration video (`tools/anchors/`), prints `TB_NOTCH` and `TB_EDGE` for `movement.js` and the metal left round each hole; with the frames, draws the outline back on them (no browser) |
| `tools/video.py` | Teeth and parts from videos of real Model 21s (`References/README.md`, "Videos consulted"): fetches a video (yt-dlp) and takes contact sheets and frames from it, into a folder outside the repository; counts a wheel's teeth one by one on a frame, unrolling its rim along a fitted ellipse, and writes strips for checking the count by eye (no browser) |
| `tools/topview.py` | Renders the model from above and warps it onto `References/photo-top-view.jpg` through five screws on the barrel bridge: `verification/topview-comparison.png` (photo, model, the two blended); `--hide PARTS` or `--eval JS` (a variant fitted: `"__mv.userData.stop('navy')"`) write `r_topview.png` instead |
| `tools/social.py` | Renders the 1200 × 630 link-preview images into `site-assets/`, the model on a dark background beside a title column: `social.png` (the page's preview: the dial in its box, hands at 10:10) and `social-movement.png` (the moving parts, titled for the essay, for posting) |
| `verification/` | Reference results: the top-view comparison, the Fig. 2 overlay and its camera fit |

## Controls

Speed: the presets, or any value from 0.01× to 10,000× on the Custom slider or typed in; the space bar stops and restarts. Up to 5× (`REAL_X` in `app.js`) the balance swings as it really does and the escape wheel steps; faster, a real swing would be a blur, so the balance swings at 0.9 Hz with the detent and trip spring still, the wheels turn smoothly, and the HUD adds "balance swing shown slowed". While winding, model time runs at most 10× (`WIND_X`), so a wind takes at most about 3 minutes of it, inside the 5 to 10 minutes the sustaining spring drives the train (Sec. IV); the HUD says so. Right-click a part to fade, hide or isolate it (Isolate shows that part alone, box and floor shadow gone; picking a part from the parts list, or ticking its box, adds it to the isolated ones); right-click empty space to bring hidden parts back or leave isolation. On touch screens a long press (half a second, barely moving) does the same; Android's own long-press `contextmenu` and the page's timer open the menu once between them, and the press never picks.

- The **?** button on the model (or the **?** key) opens a card listing every control, for a mouse and for touch, with this device's first; the header and the hint word the gestures for the device too (`.m-only` / `.t-only`, switched by `@media (hover:none)`). A tap in the model, × or Esc closes it; dragging doesn't, so the gestures can be tried with it open.
- Keys 1–9 pick the views, in the order of their buttons. Exploded has a Spread slider.
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
  - See-through schematic plates stand in for them: pillar plate, train bridge, barrel bridge, a cock over the balance, and pillars. They are drawn only in this view, carry no part name, and go with Moving parts only.
  - The camera's field of view narrows from 32° to 20° so the elevation looks nearly flat.
  - The Spread slider sets how far the train is laid out (`mv.userData.develop(e)` in `movement.js`, 0 as built, 1 laid out).
- Time: set the hands to any time of day, or to now. The model keeps Greenwich Mean Time by default, as U.S. Navy chronometers were kept (the HUD says GMT); Keep: Local time switches to the viewer's time zone, moving the hands by the difference. The HUD shows the time the hands show and, once it is a quarter second or more, the dial error against the master time (below): `+` fast, `−` slow, to the half second as a navigator records it. Now sets both the hands and the master time to the viewer's clock; Set the hands moves the hands only, so it makes a dial error. Tick sound is under Time too.
- Setting, With the key: sets the hour and minute hands as the manual does while the chronometer runs (Sec. III, "Setting While Running"). The gimbals are latched, the bezel and crystal come off, and the winding key goes on the hand-setting square, turned by its shank, forward only: the minute hand goes on its marker half a minute behind the master, and to the next marker as the master's second hand passes 60. The second hand is never touched, so the dial can still be up to 30 s out, as the manual says; the Time section reports it. A dial that is fast has its hands turned nearly round the dial. The hands turn on the centre arbor as the cannon pinion slips (`slip`, passed to `update()`), which leaves the train and the second hand alone. How fast the key turns is illustrative. Another view, or the walkthrough, ends the setting.
- Adjuster's bench (its own section): the escapement's six settings on sliders (trip-spring tip `rT`, discharge-jewel reach `rd`, depth of lock `dL`, locking-jewel draw `DRAW`, and the discharge and impulse jewels' angles `aD`, `aI`). Each change rebuilds `ESC` with `makeEsc` and takes it over in place (`Object.assign`, so everything reading `ESC` follows), rebuilds the detent pieces, trip spring screw, roller and jewels (`mv.userData.escSet()`), and measures lock, let-off, overall, drop, roller shake, the teeth's dip, horn clearance and the jewels' angle against the manual (`ESC.checks()`, as `tools/escapement.js`), with the plan view live beside them. The model runs with the settings: they set the balance's running amplitude `ESC.A` (which the balance eases to) and the escapement's rate `ESC.run.rate`, s a day against the model's settings, which multiplies into the model's rate as `escK` ("The escapement's amplitude and rate", below); the Rate panel says how much of the rate is the escapement's, and the rate book notes "escapement adjusted". A setting at which the escapement would not run (`ESC.measure().runs`), or at which the balance would swing too little to keep it going (`ESC.A` under `ESC.AMIN`), is refused, with the reason, and the last working one kept. The least amplitude that runs (`ESC.AMIN`) follows the settings: past it the train stops, and a twist starts it again. The hash carries the changed settings (`esc=rT:0.29,aI:185`). The model's settings are one button away; the geometry checks (`fine.py` and the rest) cover only those.
- Rate book (its own section): the navigator's record of Sec. IX, Table I. The dial is compared with the master at noon each day, master time, and on Compare now; the error is read to the nearest half second, as the hands step. The daily rate is the change in error per day, taken against the latest comparison at least half a day back with no break (started, stopped, set, not wound) since, since over a shorter time the half-second reading swamps it. Below the table, the mean daily rate and mean deviation over the last ten rates since a break, and live for the current dial error, what it does to a position: 4 s of time is 1′ of longitude, that many nautical miles times cos(latitude) (Latitude input), uncorrected and after the navigator's correction with the last error and the mean rate. The remarks are recorded automatically. The rate is steady in the model (only the weights, screws and escapement's settings change it), so the mean deviation shows the reading's half-second steps.
- Setting, Stop to set: the manual's other way (Sec. III, "Setting When Stopped"), to the second. The button is the next step: Stop to set locks the balance with the locking arm (the manual stops the balance by hand, the movement out of its case), Unlock arm takes the arm off with the balance at rest, and Twist to start gives the twist. Meanwhile the Time section counts down: to the moment the master overtakes a fast dial, or to when the second hands agree on a slow one, after which the minutes are set forward with the key. The wheel stands locked, so the second hand is on a half second, and what is left after the start is the moment of the twist (and the fraction of a second the balance takes to pick up).
- Winding: Since winding and Wind, and Wind with the key, which turns the fusee half a turn at a time, 17½ half turns from run down (the fusee's 8¾ turns, 56¼ h of chain), with the plates see-through and the winding stop kept solid. For the last turn the camera closes in on the fusee's top: the chain winds over the stop-bar's nose, and the bar's far end comes round to the winding stop.
  Three options under it act whenever the model winds (the key, Wind, or the walkthrough's Wind it now). **Load path in colour** (on) tints the parts carrying the train's load (`lpCol`, `tintOf` in `app.js`, from the `lp` tags `movement.js` sets): while winding the sustaining spring, which drives (rose), and the sustaining ratchet and pawl, which hold (teal); for 2 s after the key lets go, the mainspring's whole path in rose (barrel, chain, fusee, winding ratchet and pawls, sustaining ratchet, spring, fusee wheel). **Close-up of the sustaining spring** (on) draws the fusee wheel's maintaining work again in a box at the stage's lower left (`cuDraw`): the same renderer and canvas (a scissored viewport, layer 1 for its parts and the lights, so the page keeps to two WebGL contexts), seen from the train bridge's side in the movement's own frame, the sustaining ratchet drawn at 45% so the spring under it shows; under it, the spring's drive left, 10 min less `R.ssD` of `R.SMAX`. **Exaggerate the spring's motion** (off) draws the spring relaxing 20 times as far (`ssX` in `update()`, up to `SMAX`) and eases it back over 0.4 s at the catch; the working end's pin moves round the ratchet with it, while the ratchet, the pawls and the time left stay the real ones. At 1× a wind from run down takes about 17 s of model time, about 3% of the spring's travel, too little to see without it. Under `?qa`, `__lp()` gives the phase (`ph` 'w' winding, 'r' the 2 s after, '' otherwise) and whether the close-up shows.
- Rate and timing weights: turn the timing or vernier weight pair in or out by eighth turns, up to 2 turns either way from mid-travel for the timing weights and 3 for the verniers. `R.timing(nt, nv)` in `movement.js` moves them and returns the balance's moment of inertia, computed from the balance's geometry and the parts list's masses (1,140 g·mm², Table II's). The weights' thread pitch (`R.pitch`) is set so that a full turn gives the manual's figures (p. 70): about 40 s a day for the timing pair and 2.8 s for the vernier pair, which makes the pitches 0.178 and 0.151 mm. Below them, a screw pair stands in a hole (3–12, numbered round each half from the arm's end as the numbered balance block of Fig. 99 numbers them) and takes any of Table II's five head heights (0.040–0.100 in) and the washers of Table III (0.002–0.010 in) under its heads, as Op. 3 changes them; it can be moved to another empty hole (Op. 8), taken out, or another pair put in (up to all ten holes): `R.screws(pairs)` sets them and `R.timing` counts their masses. The panel puts the manual's figure for the change (Tables II and III, for pairs) beside the model's, and for a pair moved along the rim Table IV's change in the rate at 90 °F against 55 °F (`R.T4`); a temperature slider (40–100 °F) runs the clock with that change, linear about 72.5 °F, the standard set taken as compensated, and the balance's own curvature on top (`MTE` in `core.js`: the Model 21's from the factory test card of No. 3390, the split balance's illustrative); a chart below it plots the rate from 40 to 100 °F for the balance shown, the other dashed, and gives the Navy test's three temperature compensation figures against their limits. With the split balance shown, its rim curls with the temperature, drawn 20 times as far (`R.balCurl`). Zero puts back the weights' mid-travel, the standard screws and 72.5 °F. The panel's state is kept in the link (`bal=`, as `esc=` keeps the bench's). The model clock `tSim` then runs `rateW`·`escK` as fast as real time (`rateW`: √(I₀/I) and the temperature; `escK`, the escapement's share at the balance's swing now and the drive's torque, `ESC.rateAt`: 1 at the model's settings and 255°), so the hands gain or lose; the panel shows the daily rate, the escapement's share of it when there is one, and what the hands have gained since the weights, screws or escapement were changed or the hands set.
- Stopping and starting (and Twist to start under Winding): the balance locking arm (Fig. 9) and the train-blocking screw (Sec. II), and the twist that starts a stopped chronometer. See "Stopping and starting" under How the timing works. Jolt the box knocks it about the balance staff: depending on where the balance is in its swing it sets (stops), trips (the hands jump half a second) or is upset and settles (illustrative; "The balance's dynamics").
- 30-day performance test: the Navy's test (Sec. IX) run on the model as it stands: six periods of five days at 90, 72½, 55, 55, 72½ and 90 °F, wound at each daily reading, read to 0.01 s; the daily rates per period, and regulation, rating, largest difference, the three temperature compensation figures, recovery and isochronism against the Bureau of Ships' limits, beside the factory card of No. 3390. It is computed again whenever a setting changes (`testCalc` in `app.js`; `__test` with `?qa`).
- Swing and isochronism: a Mainspring set slider (0–30%, Op. 13, kept in the link as `mset=`) weakens the spring's pull all through its run; and a chart of the balance's swing over the last minute, the rate against the swing at a steady torque, or the swing over a wind with the fusee and, ticked, a going barrel; the swing and the escapement's rate now, the rate's spread over a wind and the manual's isochronism check (Sec. IX). See "The balance's dynamics".
- Parts: every named part by group, to single out (as a tap does) or hide. Display adds a slow turn and an Auto/Light/Dark theme, and Reset display puts every Display box back to its default (See-through to the view's own) and shows faded and hidden parts again, leaving the theme. Save writes the view as a PNG; Link copies the page's address with the state in its hash (without clipboard access it is put in the address bar instead).
- Roll period (Display, under Ship motion): how long the box takes to roll, 0.4–12 s (7 s by default). The case hangs in the gimbals as a pendulum with its own period of about 0.7 s (estimated), so at a ship's period it stays level and near its own it swings with the box ("The balance's dynamics").
- Gimbals latched (Display) swings the latch lever in through the slot in the gimbal ring to the keeper on the case, bringing ring and case level with the box first; latched, they tilt with the box, as Ship motion then shows. Unticked, the lever swings back along the wall and the gimbals are free. A walkthrough step with ship motion releases them.
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
- Parts: a search box above the list finds parts by name, Hamilton part number (`42087` finds the detent) or words in the source note, every word; `fig 90` finds the parts the manual's Fig. 90 shows (from `figs`, ranges included). Sizes in: mm or inches, the manual's unit, for the sizes on the part cards (remembered in `cm-set`).
- Colour by source (Display) colours each part by where its shape and size mainly come from (`src` in `PARTS`, `SRC`): the manual (green: its figures, parts list or specifications), measured (blue: on photographs, or a real part), solved (amber: placed or sized to fit the rest) or estimated (grey: the manual shows it, not its size or shape). A key under the tabs names the colours; the part's card says what came from where. It and Colour by part exclude each other; `colr=part` or `colr=src` in the hash.
- Labels are off by default (Display turns them on, and the choice isn't remembered). The walkthrough shows the labels of each step's parts regardless.
- The walkthrough sets its own view, speed, Moving parts only, ship motion and gimbal latch for each step. Ending it (Finish, Exit, or anything that leaves it) gives back the viewer's own: the view, See-through, Ship motion, Gimbals latched, the speed, Moving parts only and the motion work, as they were when it started.
- Shadows (Display; off by default; `shadows=1` in the hash when on): the key light casts shadows through a shadow map (`PCFSoftShadowMap`, 2048 px, 1024 on phones). With it off, the light casts none: no shadow pass, simpler shaders to compile (two programs fewer at start), and the map is freed. The floor's soft shadow under the box is a texture (`shadowTex`) and is always drawn. The tinted and ink drawings follow the switch. Cost with it on, measured with `tools/perf.py`: about 230–380 more draw calls and every caster's triangles again; 0.4–1.1 ms a frame on a desktop GPU, 22 % (Edges on) to 47 % (Edges off) on the Dial view with the CPU throttled 4×, 14–22 % in the software renderer. `social.py`, `topview.py` and `p3fit.py` turn it on, as their images were made.
- Performance mode (Display; on by default; `merge=0` in the hash when off): the parts that don't move against each other are drawn merged, about 40% fewer draw calls with the same picture ("Static pieces drawn merged", under Modifying the model). Off, every piece draws itself, as before the merge: the way out if a display mode ever shows something wrong with it on. Reset display turns it back on.
- Screen readers: the model's `aria-label` says what the stage shows, the view (`VIEW_DESC` in `app.js`) or the walkthrough step, and Moving parts only, and is updated with it.
- Keyboard and reduced motion: Space stops and restarts, 1 to 9 pick the views (the key for a view that is off, Box or Dial with Moving parts only, flashes its button and says why in the HUD); with the model focused (click it or Tab to it) the arrow keys turn the view, + and − zoom and 0 resets it. With reduced motion set in the system, camera and state moves are instant (as with `?snap`), the walkthrough leaves ship motion off and scrolls without animation, and the page's fades are off.
- Phones: below 600 px wide the part card is a sheet along the bottom of the stage; on touch screens buttons and checkboxes are finger-sized; in landscape with the height under 560 px the stage fills the height and the panel scrolls beside it. On a phone (coarse pointer, screen under 600 px on its short side) the pixel ratio is capped at 1.5 and the shadow map at 1024 px, against 2 and 2048 px elsewhere. A part casts a shadow only when its radius spans 6 texels of the shadow map, which follows the view: far views drop the screws and pins, close-ups keep them. The knurled nuts and the balance rim's holes are each one merged mesh (`mergeGeo` in `core.js`).

## The Essay tab

The page's second tab is *The Marine Chronometer*, an essay on how the chronometer keeps time at sea, in the manner of Bartosz Ciechanowski's
*Mechanical Watch*. It replaced two things: a separate essay page (`marine-chronometer.html`, which predated the manual and had drifted from the model:
a 15-tooth escape wheel, 8 fusee turns, a Roman dial, the old names for the escapement's parts) and the Illustration tab, an overview drawing.

- **Where it is.** Its text and figure markup are the `<article id="essay">` in `index.html`, its styles `css/essay.css` (classes `e-…`, since the model's
  `.stage`, `.sl` and `h2` mean other things), its code `js/essay.js`. It is laid over the whole page (`position: fixed`), so the model's layout underneath
  is untouched, and the tab bar moves into its sticky bar while it shows.
- **Sections** (each heading's id is its link: `#essay=detent`): time is a position, an oscillator that ignores the sea, the spring that breathes, heat,
  constant force, winding, counting, the detent, level on a moving ship, keeping the rate, Greenwich time from the sky (equal altitudes ashore), longitude by
  chronometer (the time sight), the lunar distance, an almanac to print (with the hand rules and the workbook), the Hamilton Model 21.
- **Figures, and what each takes from the model:**

  | Figure | Drawn with |
  |---|---|
  | The dial at the top | `dialCanvas('hamilton')` and the hands' outlines (`handShape`, core.js) at the model's own time and state of wind (`bind`) |
  | Longitude, clock error | 2D; 4 s of time is 1′ of longitude |
  | Balance and hairspring | The Model 21's balance rebuilt in the essay (the model's is built inside `buildMovement`): `BAL_R`, the rim's section, screws and weights as `movement.js` places them; `springGeo` with the model's hairspring numbers; the swing `ESC.A`; the moment of inertia `R.timing(0,0)` |
  | Terminal curves | `springGeo`, and a plain-ended coil (essay-only), drawn with 10 coils, r 5.5 and 9 tall, to show the curves (the model's spring has 12 turns, `HS_N`) |
  | Heat | A split bimetallic rim (as history), a plain brass one and the Model 21's; the older balances' rate curves are illustrative; the Model 21's band is the Navy test's limit (Sec. IX), not a curve |
  | Constant force | The model's fusee profile and barrel turns (`R.fs.rf`, `R.fs.I`), 8¾ turns, 0 to 56¼ h; the spring's pull shown is the one the profile answers |
  | Maintaining power | The model's own maintaining-work meshes (`R.gw`, `R.ssg`, `R.sr`, `R.spawl` and the fusee's winding ratchet, cloned with their materials, bound by `bind`'s `R`, `mv` and `M`), the spring rebuilt with `R.sspGeo(d)`, the pawls seated with `seatPawl` on `R.SRP` and `R.FPR` and the ratchet where `phaseAgainst` has the sustaining pawl hold it; `d = SMAX t/10`. The fusee's turning back, half a turn a minute, is the figure's |
  | Winding | The dial's up/down sub-dial and hand; 3.43 h a half turn (`FUSEE_PER_HOUR`) |
  | Counting | `arbor`, `gearGeo` and `escapeWheel` with `TRAIN`'s counts and `MOD`'s modules; turn times from `ESC_PER` |
  | The detent | `drawEscPlan` with the model's `ESC` (it follows the adjuster's bench) |
  | Gimbals | `buildBox` itself, with a dial at the model's time |
  | Keeping the rate | 2D; a simulated chronometer's rate book in the form of Table I |
  | Equal altitudes, the time sight, the lunar distance | 2D, `ALM` (`shared/almanac.js`): fixed days and places (15 and 18 October 2026, Annapolis, 35° N 40° W), each sight made by `ALM.sextant` / `sextantLunar` at the true time and place and worked from the readings alone, as a sight form |
  | The almanac's pages, the workbook | HTML tables from `ALM` for any days (Print lays them out alone, `#almPrint`, `html.alm-print`); the workbook reduces one's own sights |

- **Numbers in the text** that the model computes are `data-live` spans filled by `fillLive()` when the essay shows: the escapement's figures
  (`ESC.measure()`), the swing and the least swing that keeps it going, the roller, the centre distance, the tooth counts, the fusee's radii, the
  moment of inertia, the sustaining spring's travel (`ssDeg`). The text's other facts come from the manual (Secs. I–IV, VIII, IX) and this README; keep them to those sources. The sky sections
  (from "Greenwich time from the sky" on) also use published literature, named in the text and under Sources (PLAN-self-contained.md, decision D1):
  Meeus's *Astronomical Algorithms*, the Astronomical Almanac's short formulas for the Sun, Bowditch's *American Practical Navigator*; their stated
  accuracy is in `data-bound` spans, which `tools/almanac.js` checks against what it finds.
- **Building and drawing.** A figure is built the first time it comes within 300 px of the view (an `IntersectionObserver` on the essay), once the fonts
  are loaded (the dial is drawn once and kept) and, for those that read the model (the fusee), once app.js has called `ESSAY.bind()`. A figure is drawn
  only while the essay shows, and only when something in it changed. The 3D figures share one `WebGLRenderer` on a canvas off the page: each renders
  into the bottom-left corner of that canvas and is copied onto its own 2D canvas in the same task, so the page has two WebGL contexts (the model's and
  this one), where one per figure would have been seven more. The model keeps time under the essay but isn't drawn, and its keys are left alone.
- **Hash and history.** `#essay`, or `#essay=<section>` as the reader scrolls, written by app.js's `hashOf` (by the essay itself before the model is
  built). Links from the essay into the model are ordinary links (`#tour=3`, `#view=escapement&speed=0.05&part=det`, `#open=bookDet`), so Back returns
  to the essay where it was left; `sessionStorage` (`cm-essay-y`) keeps the place through a reload. The essay's old address on the live site
  (`/marine-chronometer`) is redirected to `/#essay` by `worker.js`.

## The hairspring, designed

`HSPR` (`shared/hairspring.js`, checked by `tools/hairspring.js`) designs the spring a maker would wind, from what the model measures: the coil (r 5.1, 12
turns, 6.7 tall), the stud's clamp (2.65 from the staff, the stud's bar 54.8° off that radius) and the collet's face (3.62). The model doesn't draw it yet:
`springGeo` still draws round wire with sine-ramp ends (below, the inner end is open).

- **The stiffness** the balance needs: k = I (2π/T)², with Table II's I (578.5 g·mm²) and T 0.5 s: 91.4 µN·m a radian.
- **The strip.** Its width along the axis measured on the restoration video side-on (6:49.5): each turn's section at the coil's edge 9–11 px at 45 px/mm,
  and its share of the 0.56 mm pitch down the stack 0.38–0.50: 0.20–0.28 mm, 0.23 taken. From k = E b t³ / 12 L over the designed spring's 439 mm, its
  thickness: 0.226 mm for an Elinvar-type alloy at 180 GPa (0.218–0.231 over 165–195 GPa and the width's range), 0.216 for spring steel (207 GPa): the
  section about square, a wire more than a ribbon (the cube root keeps it within 4 % of the width's 13 %). Its bending stress at the 255° swing about 210 MPa.
  Hamilton's patent US 2,379,780 ("a change in length of five one-hundred-thousandths of an inch in the usual chronometer hairspring will cause a change
  of rate of one-tenth second per day") implies 549 mm for its usual spring, 20 % more than this one: a general figure, not the Model 21's.
- **Phillips' conditions** (Phillips, 1861): each terminal curve's centroid on the perpendicular through the staff to the radius at its junction with the
  coil, at R²/l from the staff, on the side the curve goes; with both, the spring's centroid stays on the staff as the coil winds and unwinds, and its
  pull on the balance is a pure couple. Each curve is solved from its curvature (the coil's at the junction, a cubic after) for its end's place and
  heading and the two conditions. The check (`HSPR.lateral`, Castigliano's theorem on the whole spring as a slender beam): the force the pivots carry
  under a couple, over couple / R.
- **The outer curve** runs into the clamp along the stud's bar toward its end (out along it toward the wedge pin, no curve meets the conditions inside
  the coil): 15.3 mm, turning 343°, from r 5.1 to 2.65.
- **The inner end is open.** At the collet's face as drawn (3.62, running along it) the shortest curve that meets the conditions and keeps off the collet
  winds 1.9 turns in (54 mm); with the end held at 3.0–3.3 a curve of 21–24 mm (about 300°, like the outer) does it. The restoration video, face-on from
  the stud's end (6:52.5), shows the outer curve, about half a turn turned in, and not the inner. So either the collet takes the spring nearer the staff
  than drawn (Hamilton's US 2,457,631 forms the spring with "each end turned in" to the staff and to the cock), or the Model 21's inner curve doesn't meet
  Phillips' conditions. Forces: both ends designed, 2.6e-5 of couple / R; the outer designed and the inner as drawn, 0.020; both as `springGeo` draws
  them, 0.023: the inner end matters as much as the outer.

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
- **By hand.** `sunHand` is the Astronomical Almanac's short formulas, as the essay prints them: within 0.6′ of the full series from 1950 to 2049, enough
  for a time sight, not for a lunar (the Moon needs the series, so its pages print).

## Testing

The page's state is kept in the URL hash, so a link opens the model as it
was: `#view=escapement&speed=0.05&part=det` (a view, speed and picked part; `view=laidout` is the laid-out train), `arm=1` (the balance locked, at rest), `block=1` (the train-blocking screw down),
`#tour=6` (a walkthrough step), `#essay` or `#essay=detent` (the Essay tab, at a section), `open=bookDet` (in a link: open that panel section), `drive=1` (Moving parts only), `draw=1` / `draw=ink` (Tinted / Ink drawing), `edges=0` (Edges off), `shadows=1` (Shadows on), `merge=0` (Performance mode off), `sec=x:-3.5`, `esc=rT:0.29,aI:185` (the adjuster's bench, where it differs)
(a cross-section; `:f` shows the other half), `tz=local`, and `t=10:09:30`
once the hands have been set. It is read at load and when edited, and
rewritten (without adding to the history) 0.3 s after any change.

Two URL flags help with testing:

- `?snap` switches off camera and state easing, so views settle immediately
  (useful for screenshots), and draws every frame (see below).
- `?qa` exposes the movement (`__mv`), the photo-projection helpers (`__proj`,
  `__unproj`) and camera controls (`__cam`, `__look`, `__camInfo()`) for the
  tools, plus the parts registry (`__parts`), the renderer (`__r`), a count
  of frames drawn (`__renders()`) and the stopping-and-starting state
  (`__H()`: amplitude, whether the train is held, the arm and screw).

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
the folder they're run from. `escapement.js`, `almanac.js` and `solve.py` need no browser. The
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

- The balance phase is `p = frac(tSim / 0.5)`, one oscillation per half-second.
- `ESC.state(p)` returns the balance angle, detent lift, trip-spring deflection
  and the escape wheel’s progress through its current tooth.
- Escape wheel position is `E = completed oscillations + progress`, counted in
  teeth. Every other arbor is a fixed ratio of `E`. The hands therefore advance
  in half-second steps, as the manual states (Sec. IX, p. 66).
- The fusee and chain follow the hours since winding: one fusee turn per 90/14
  = 6.43 hours. The model runs down after 56¼ h (`RUN_H`, the fusee's 8¾ turns),
  when the chain is all on the barrel; the dial's UP–DOWN scale covers the rated
  56 h.
- The chain lies in the fusee's helical groove, locked to it: `setWind(n, eps)`
  places its joints 1 mm apart along a pitch line wound on the fusee from its
  large end to where it leaves (`md`, the fusee's turn plus the common
  tangent's drift), then along the drums' common tangent and round the barrel
  to its hook. The stop-bar's travel comes from the same place: while the
  incoming run passes over the nose in the groove's top turn it presses it
  in (`barTravel`), so the bar's far end stands out past the rim for the last
  0.7 turn of a wind and meets the winding stop at full wind.
- Maintaining work: when running, the fusee's winding ratchet drives the
  sustaining ratchet through the two winding pawls, and a pin on that ratchet
  drives the fusee wheel through the sustaining spring, at its loaded
  deflection: the ratchet and the fusee wheel turn together. The fusee and
  chain follow the hours, the fusee wheel the train, so the fusee sits `eps`
  (less than one winding tooth) past its `n` turns, where its ratchet bears on
  the pawls. When winding, the spring turns the sustaining ratchet back until
  the sustaining pawl holds it (`holdBack`), then relaxes as it alone drives
  the train (drawn up to `SMAX`, 9.3°; `R.ssD` is how far it has relaxed); `eps` runs down with `n`, so the
  stop-bar meets the winding stop at full wind. When the key lets go, the fusee
  turns forward until its ratchet catches the pawls, and the sustaining ratchet
  forward to load the spring again. Nothing turns back; `tools/maintaining.py`
  checks this. Every pawl is rested on its ratchet's teeth each frame
  (`seatPawl`), so it rides over them or bears on a steep face. The winding
  pawls' flat springs are rebuilt with them (`wpsGeo`), their ends kept on the
  arm as the pawls swing out over the teeth while winding.
- The mainspring (`mainspringGeo` in `core.js`) is rebuilt from the barrel's turns `I(n)`: its turns from the inner end to the outer fall from `Tup` at full wind by the barrel's turns (`fs.MS`). Running peels coils off the pack on the arbor onto the pack on the wall, with one free turn between them. Its inner end is held by the arbor's hook in an eye, and its outer end turns with the barrel, its anchor pin on the brace. The arbor never turns, and the setup click faces the spring's pull.
- What turns while winding: the fusee wheel follows the train (`gA`), not the
  fusee, so it keeps turning forward, driven by the sustaining spring, while
  the key turns the fusee and its winding ratchet back and the sustaining
  pawl holds the sustaining ratchet. The setup ratchet never turns: its angle
  is set once when the movement is built (`srw.rotation.y`, a steep face on
  the click) and `update()` leaves it alone. The barrel arbor turns only when
  the watchmaker lets the mainspring down or sets it up with a let-down key
  (Sec. II, p. 4: "the only time that the mainspring arbor turns is when
  manipulated during assembly, disassembly or adjustment"; Ops. 8, 53).

### Stopping and starting

A detent chronometer does not start by itself (Sec. III), so the balance's
amplitude is kept as state (`H.amp` in `app.js`; running, it comes to `ESC.A`, 255° each way at the model's settings)
and `ESC.state(p, amp)` gives the escapement at that amplitude.

- **What keeps it going.** A swing must carry the discharge jewel past the trip
  spring on the return (it falls off at −39.1°), unlock the wheel (−21.3°) and
  see the impulse through (+20.8°). `makeEsc` works out that least amplitude
  from its own tables: `ESC.AMIN`, 41.1° with 2° to spare.
- **When the train stops.** It stops at a locked beat when there is no power
  (run down), when the swing falls below `AMIN`, when the locking arm brakes
  the balance, or when the train-blocking screw's dog point is down and the
  next beat would bring a spoke onto it (`R.blockRoom(E)`, the beats left). It
  stops at the last whole beat before a spoke meets the dog point, within 3° of
  the fourth wheel.
- **While it is stopped** `tSim` and the hands stand, so they lose the time it
  stood, as a real one does. The balance keeps its own phase (`H.bph`) and runs
  down. It runs down freely with the train held (1/e in 25 s, `TAU_FREE`, from
  `ESC.settings.TF`, estimated) and at once, within a swing or two, against the locking arm
  (`TAU_ARM`, 0.2 s). While the swing still carries the discharge jewel back
  past the trip spring's tip (above 39.1°), the detent lifts but the wheel
  can't turn. A smaller swing leaves the jewel on the near side of the tip: the
  trip spring stays bent against it and follows it back, and the detent stays on
  its stop (`ESC.state`).
- **When it goes again.** The train runs again when there is power, the arm is
  off, the screw is up and the swing is above `AMIN`. That happens at once if
  the balance is still swinging: the screw raised, or the chronometer wound,
  before the balance has run down. Otherwise it takes Twist to start. The twist
  turns the box sharply and back and sets the balance swinging (160°), and the
  impulses bring it up to the swing the train's torque gives (`ESC.ampAt`, 255°
  at the calibrated torque), settling in about 12.5 s (below, The balance's
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
  (`IGN`). The cock's body is 17.7 mm from the balance axis, on the barrel bridge's circle.
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
  of the hairspring's stiffness. The impulse gives w (the wheel's torque over
  the stiffness) times the wheel's turn while it drives the jewel: at the
  model's settings the tooth lands on the jewel at −20.6° and drives it through
  19.4° of the wheel's 22.5° pitch, the rest being the drop onto it and the
  tooth's fall off its tip to the locking jewel. Unlocking takes back three
  things: the locking jewel drawn back against the tooth and rubbing on it,
  dL(tan DRAW + μ)/(1 − μ tan DRAW) of the wheel's turn; the detent spring
  lifted (lost as the detent falls back); and the trip spring bent on the
  return (lost as it flies back). The swing loses πA²/Q, Q = πTF/T from the
  balance's free run-down, so A = √(QW/π). The constants are fitted so the
  model's settings give 255°, with unlocking taking 5.4% of the impulse's work.
- **Rate, by Airy's result.** A push at balance angle θ moves the phase by
  −(τ|dθ|/k)·θ/(A²√(A²−θ²)) an oscillation: a push before the dead point gains
  and one after it loses, a resistance the reverse. Summed over the impulse
  and the unlocking, and taken against the model's settings, this is the rate
  in s a day. The escapement's own error at the model's settings (−1.4 s a day:
  impulse −0.5, draw −0.5, detent spring −0.6, trip spring +0.2) is taken up in
  the timing, so it shows as 0.
- **What the settings do.**

  | Setting | Amplitude | Rate | Why |
  |---|---|---|---|
  | Impulse jewel at 184° | 244° | +1.0 s a day | The impulse ends sooner after the dead point (18.0°) |
  | Impulse jewel at 178° | 264° | −1.9 s a day | |
  | Depth of lock 0.20 mm (0.03) | 248° | −3.6 s a day | More resistance before the dead point |
  | Depth of lock 0.33 mm (0.05) | 225° | −9.1 s a day | |
  | Discharge jewel at 262° | 230° | −7.1 s a day | |

  One slider alone keeps the balance above `AMIN`. Several together can bring
  it under, and the bench then refuses the setting.
- **The model's settings are the reference.** There `ESC.A` is exactly 255°
  and the rate exactly 0. Every tool that calls `ESC.state(p)` with the default
  amplitude sees no change. The reference's constants are cached on
  `makeEsc.refs`, by the calibration settings (`EX`, `A`, `TF`, `MU`, `fD`,
  `fP`).
- **While the train is held,** the balance swings free: it has no escapement
  error and keeps the weights' rate alone.
- **Isochronism** is the escapement's, its rate at another swing
  (`ESC.rateAt`, below), plus the hairspring's own, `HS` s a day for each 10°
  more swing: 0 by default (the spring taken as isochronous), set on the
  Adjuster's bench's last slider. At −0.1 the spring all but cancels the
  escapement's loss at a smaller swing (0.00 s a day at 90% of the torque).
  `tools/escapement.js HS=-0.1` prints it.
- **Not modelled:** friction at the impulse, and the recoil in the motion (it
  counts in the work only).

### The balance's dynamics

The balance's equation of motion, averaged over a swing. The model's clock
still sets the phase (`frac(tSim/0.5)`, so the hands step in half seconds at
every speed); the equation gives the amplitude and the rate.

- **Amplitude.** The escape wheel's torque is `s` times the one the escapement
  is calibrated at. The impulse's work and the locking jewel's draw scale with
  it; the detent and trip springs' work doesn't. In ½A², in units of the
  hairspring's stiffness, a swing gains that work and loses πA²/Q. So A²
  relaxes to `ESC.ampAt(s)²` as exp(−2t/TF), exactly for a steady torque.
  `ampStep` steps it so, at any speed. The swing settles in TF/2, 12.5 s.
  Free, with no impulse, the swing falls as exp(−t/TF), as before.
- **The drive** (`driveNow` in `app.js`). Running, the mainspring through the
  fusee: `R.fs.torque`, 1 at 12 h from full wind, the middle of a day's
  running. While the key turns, the sustaining spring alone drives: 0.8 of
  that when loaded (estimated), falling linearly to nothing as it relaxes over
  its 10 minutes (`R.ssD` of `R.SMAX`). So the swing dips while winding (227°
  at the spring's full load) and comes back when the key lets go. Run down,
  there is no drive.
- **The spring's pull** (`makeFusee`'s `pull`, `pullB`, `torque`;
  illustrative). The profile evens out exactly a pull falling in step with the
  barrel's turns, from 1 to rmin/rmax. The model's spring is that pull made 3%
  steeper at each end, as a real spring's is where its coils crowd the arbor
  fully wound and near run down. The torque on the fusee wheel then keeps a
  ±3% residual. A going barrel with the same spring (`pullB`, its pull falling
  evenly with time, geared to match at 28 h) would vary 2:1.
- **Rate against swing** (`ESC.rateAt(a, s)`): Airy's sum over the impulse,
  the unlocking and the springs at amplitude a, against the reference.
  A smaller swing feels the escapement's pushes more:

  | Swing | Torque | Rate |
  |---|---|---|
  | 247.5° (1⅜ turns) | 94% | −0.07 s a day |
  | 255° | 100% | 0 |
  | 270° (1½ turns) | 112% | +0.13 s a day |

  Each frame, `escK = 1 + ESC.rateAt(H.amp, drive)/86400` while the train
  runs, so the dip while winding and a jolt show in the rate book.
- **Over a wind.** With the fusee the rate stays within −0.05 to +0.02 s a day
  from full wind to run down; with a going barrel, −0.76 to +0.33. The manual's
  isochronism check (Sec. IX: the 12-hour rate against half the 24-hour rate
  at 72½ °F, wound at the start; tolerance 0.50 s, the factory test card of
  No. 3390 reads 0.00) comes to 0.00 s with the fusee and +0.03 s with a
  going barrel. `tools/escapement.js` prints the rate at 1⅜ and 1½ turns.
- **The mainspring's set** (`MSET`; Op. 13, "Check condition and set of
  mainspring"). A spring that has taken a set pulls less all through its run;
  the drive is scaled by 1 − set, so the fusee keeps it level but lower. At
  20% the balance swings 227° and the chronometer loses about 0.3 s a day.
- **The 30-day performance test** (`testCalc`). Each day's rate is the
  model's at the period's temperature: √(I₀/I) from the weights and screws,
  the balance's temperature curve, and the escapement's and hairspring's rate
  averaged over the 24 hours after winding (wound at each daily reading). The
  errors are rounded to the comparator's 0.01 s and the rates read from them,
  as on the card. At the model's settings it passes: regulation 0.07,
  temperature 0.07, 0.07 and 0.00 (the card of No. 3390: 0.08, 0.06, 0.02),
  isochronism 0.00; the split balance fails 90 against 72½ °F (1.46, limit
  0.75), and an eighth of a turn on the timing weights fails regulation. The
  model has no day-to-day scatter, so rating and recovery come out 0.00 (the
  card's real chronometer: 0.03 and 0.06).
- **A jolt** (`jolt` in `app.js`; illustrative). A knock about the staff jerks
  the balance's speed by 0.6 to 1 of its running top speed, either way at
  random. From θ and θ′ the balance goes on at A = √(θ² + (θ′/ω)²). Checked
  under `AMIN`, it sets (stops). Carried past `ESC.TRIP` (a full turn plus the
  angle where the discharge jewel meets the trip spring, 332.7°), the jewel
  comes round and unlocks a second time, so the wheel trips: one extra tooth,
  and the hands jump half a second. The phase is kept, so the train stays on
  its half second.
- **Gimbals with inertia** (`gimStep`; illustrative). The case, with the ring
  about the ring's pivots, hangs as a pendulum below each axis:
  ψ″ = −ω0²ψ − 2ζω0(ψ′ − φ′), φ the box's angle. The case's own period is
  0.7 s (estimated: its weight some 15 mm below the pivots, radius of gyration
  about 45 mm) and ζ is 0.05. At a ship's roll period (7 s by default) the
  case stays level within a few hundredths of the roll. Near 0.7 s (the Roll
  period slider) it swings with the box, stopping 25° off it against the ring.
  A jolt kicks it. `?snap` and reduced motion keep it exactly level, as
  before.
- **Temperature** (`MTE` in `core.js`). The balance's own curvature, on top of
  Table IV's line. The Model 21's balance: the second difference of the
  factory test card of No. 3390 (Sec. IX, p. 68; period means 90 °F −0.02,
  72½ +0.06, 55 0.00 s a day), a gain in the middle of 0.07 s a day against
  both ends. The split balance: the essay's illustrative middle temperature
  error, compensated near 45 and 90 °F and gaining up to 1.5 s a day between.
  The rate panel's chart gives the Navy test's three temperature compensation
  figures against their limits (0.75, 0.75, 1.20 s a day). The split rim curls
  (`R.balCurl`): a two-layer strip's curvature changes by 1.5 Δα ΔT / h,
  about 3.9 × 10⁻⁶ /mm a °F for brass on steel 1.6 mm thick. A point φ from the
  fixed end then comes in by R²Δκ(1 − cos φ), 0.05 mm at the free end for
  27½ °F, drawn 20 times as far (`R.CURLX`).

## Sources

- *Manual for Overhaul, Repair and Handling of Hamilton Ship Chronometer*, NAVSHIPS 250-624, Bureau of Ships, 1948. Used for:
  - the structure: pillar plate, barrel bridge, upper and lower train bridges, balance lower bridge, escape upper bridge. The lower train bridge is screwed to the dial side of the pillar plate (Figs. 29, 67, 110): a straight steel bar with square ends across an opening in the plate, its settings inboard and a screw toward each end (Figs. 30, 31 and a photograph of a Model 21's dial side);
  - the going train's stack (Figs. 13, 29, 110): third, centre and fourth wheels from the plate up, the third and centre pinions above their wheels and the fourth's below, and five spokes on each wheel;
  - the maintaining work and the winding stop-bar (Sec. IV, Figs. 12, 28, 69–74, parts list Fig. 109): the fusee's winding ratchet with its two screws; the sustaining ratchet wheel, free on the arbor, with two winding pawls, their springs and four screws; the sustaining spring in the fusee wheel's recess; the end plate and taper pin; the stop-bar in a slot in the fusee's top with its spring, under the top plate and its two screws; the winding stop screwed into the barrel bridge; the sustaining pawl on its arbor with its spring;
  - the upper train bridge leaving the fusee's top open to the barrel bridge, which holds the fusee's upper bushing (Figs. 24, 29, 67, 77; parts list 108-45);
  - the barrel's inside (Figs. 26, 75): the arbor's core with its hook for the mainspring, and the brace lining the wall; the chain hooked to the barrel and pinned to the fusee (Figs. 26, 28); the setup pawl spring (Figs. 17, 24, 80);
  - the detent escapement. Its layout comes from the plan view, Fig. 90: the detent lies at 68° to the line of centres, with 11.3 mm from the point of flexure to the locking jewel, and the trip spring is 7.9 mm long, 2.3 mm to the side, on the line through the balance staff;
  - the detent's construction, from Figs. 14, 54–60 and 110 and the parts list. The detent is beryllium copper with a two-strip detent spring and a round locking jewel with a flat. The trip spring is Elinvar, on an angle bracket. The support block hangs from the upper train bridge, held by one screw and two positioning pins (Sec. II; Figs. 14, 22, 90), and carries the stop button, lock-adjusting and detent-adjusting screws. The detent-adjusting screw, threaded into the block's end, has its head in a slot across the detent's foot, so turning it slides the detent along (Fig. 90; Ops. 84, 93); the trip spring's screw goes through a hole in the spring's foot into the bracket's upright leg (Figs. 14, 54; reassembly of the detent, 8). The block's screw goes in from above, through the train bridge into a tapped hole in the block's top (Figs. 14, 22, 84; the restoration video, `KLUwI2UUCMQ` 10:45 and 11:08). The model does too: since the photographed group's 14° turn the barrel bridge's horn no longer covers its place for the block;
  - the escapement's adjustment figures (Sec. VIII, Ops. 76–97): roller shake about 0.002 in (Op. 84), lock about 6° (Op. 85), let-off at least 6° (Op. 86), overall 26–30° (Op. 87), horn clearance about 0.010 in (Op. 88) and drop about 2° (Op. 97). The teeth drop into the large portion of the impulse roller's crescent and never enter the small portion (Ops. 76, 83). The wheel is centred on the impulse jewel (Op. 82);
  - the impulse roller, 0.249 in (6.32 mm) across (parts list, p. 82). Variants of .250–.253 in exist to set roller shake;
  - the balance and hairspring. The parts list gives 4–6 balance screws of 0.049 in head height, 2 of 0.080 in and 2 of 0.101 in, in diametric pairs, plus 2 timing weights (93 mg) and 2 vernier weights (10.5 mg), each a nut on a screw in one of the rim's holes (parts list, p. 82; Fig. 3); the model carries 8 screws, as the restoration video's balance does, the holes numbered as Fig. 99 and Table IV number them;
  - the barrel cap with its five screws on the pillar-plate end (Figs. 26, 109), and the dust seal with three packing rings around the fusee arbor (Fig. 24);
  - the gimbal mounting (Figs. 1, 94, 106): a flat ring hung on two pivot screws through the box sides (washer inside, lock nut outside), the case hung in it on front and rear pivot screws into brackets on the case, support straps at 3 and 6, the gimbal latch at the front right (a lever on a support bracket, through a slot in the ring to the keeper on the case: Fig. 106 and the parts list) and the key at the back right;
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
- For the essay's sky sections and their almanac (`shared/almanac.js`, "The almanac" above): J. Meeus, *Astronomical Algorithms*, 2nd ed. (Willmann-Bell,
  1998), chs. 7, 10–13, 16, 21–23, 25, 40, 47 and Appendix III; F. Espenak and J. Meeus's ΔT polynomials (NASA, 2006); the IERS's measured ΔT (as skyfield
  1.55 carries it); the Astronomical Almanac's low-precision formulas for the Sun (the essay's hand rules); N. Bowditch, *The American Practical Navigator*
  (Pub. No. 9), and the Nautical Almanac, for the altitude corrections, sight reduction and the 57 navigational stars; SIMBAD (CDS, Strasbourg) for the
  stars' places and motions. Checked against JPL Horizons (DE441) and skyfield 1.55 with JPL's de440s (`tools/almanac-ref.json`).
- *Watch and Clock Escapements* (compiled from *The Keystone*, 1904; Project Gutenberg eBook 17021), Ch. III "The Chronometer Escapement": a period text on the spring-detent escapement in general, not the Model 21. It is a cross-check only, below; nothing in the model is drawn from it.

### Against a period text

`tools/keystone.js` measures the model's escapement against each rule the 1904 text gives. It reads `ESC` as `escapement.js` builds it, the tooth outline (`ESC.toothPts`), the locking stone and detent pieces (`ESC.pieces`), and the sizes set in `core.js` and `movement.js`. The text describes a generic English chronometer, so where the manual, Hamilton's specification or a photograph gives a figure, that figure stands; the text is never a reason to change one. As of 4 October 2026:

- **Agrees.** The impulse roller is 0.480 of the wheel's diameter (the text: about half). The teeth are 1.30 mm along the arbor (1/20 in, 1.27 mm). The draw is 10° (about 12°). The jewel is flush with the roller (at most 0.002 in proud). The unlocking takes 6.0° of balance (about 5°; the manual's lock is about 6°). The balance beats 14,400 an hour. The impulse covers 41.4° of balance, against the text's 43° of a 48° arc.
- **The planting.** The text places the balance where the wheel's and roller's rims cross over one pitch (Fig. 139). Applied to the Model 21's own parts (16 teeth, a 13.16 mm wheel, the 0.249 in roller), that puts the balance 9.34 mm from the escape arbor; the model's is 9.40 mm, from the photo fit and Fig. 90. The rims cross over 20.7° of the wheel, 92% of a pitch.
- **Hamilton's choices.** 16 teeth (the text: 15), a 13.16 mm wheel (0.55 in, 13.97 mm), a 255° swing (about 225°; the manual's 1⅜–1½ turns decide), and a beryllium-copper detent 11.32 mm from the point of flexure to the jewel (the text: as long as the wheel is wide), its spring 0.337 of that (2/7).
- **Fig. 90 decides.** The teeth's locking face leans 15.5° from the radial (the text: 28°; Saunier 27°, Britten 20°), and the back's curve fits a circle of 3.75 mm (the text: the roller's radius, 3.16 mm). Both are traced from Fig. 90.
- **The release.** The impulse jewel is 2.1° inside the wheel's tip circle when the wheel is released; the text allows 5°, so that the tooth meets the jewel's flat face. The model's release is set by the manual's lock, let-off, overall and drop, and its tooth lands on the jewel 0.7° after the release.
- **The detent's turn.** At release the model's detent has turned 0.79° about its point of flexure, the jewel moving 0.16 mm. The text's "locking of about two degrees … counting the center of fluxion" would move a jewel 0.49 mm on its own 0.55 in detent, four times the depth of lock that the manual's figures give here. The passage doesn't say what the two degrees are measured on, so the comparison is left open.
- **Estimates near the text.** The model's detent spring is two beryllium-copper strips 0.079 mm thick (0.50 and 0.45 mm wide; estimated). The text's steel spring is 0.002 × 0.080 in. Taking E as 128 GPa for beryllium copper and 200 GPa for steel, the model's spring is 29% stiffer than the text's would be at its own length. The locking stone is 0.61 mm across (Figs. 57–59 give no size), under the text's third of a tooth space (0.86 mm); its flat removes 0.37 of the diameter (the text: 4/10).

## How the layout was measured

1. **Two photographs.** The manual's Fig. 2 and a near top-down photograph of a 1941 movement. `tools/bundle.py` fits an independent camera to each photo and triangulates the balance, fusee and barrel axes. Point residuals are under 9 px in both photos.
2. **Scale.** Two photographs fix the group's shape but not its size. It was first scaled so the fusee wheel, then taken as 96:14 and 40.87 mm across, stayed inside the 87.57 mm pillar plate (factor 0.955). That wheel is 36.0–36.9 mm across on the side photograph read at the plate's own scale (step 6), and the group's scale and place now come from the real movements instead (step 4).
3. **Mapping the top view.** Using those three axes, a similarity transform maps the top-view photograph into the model, with under 0.4 mm residual (`tools/p3map.json`). The following were traced through it:
   - the bridge outline (radius about 40 mm);
   - the crescent balance cock (`tools/cock_outline.json`), shifted for its height parallax so its endstone lands over the staff. The traced edge passes 0.7 mm from the staff, too close for the upper setting and the endstone cap, so the nose is widened round the cap (see "Estimated"). The outline is the cock's top: the cock is one solid block (C Spinner's restoration video, the cock off at 41:58 and 23:45, in place from the side at 2:36; `References/VIDEOS.md`), its outer wall following the rim the full 14.2 mm down to the train bridge, and only its nose an arm 2.6 mm thick over the balance. The body is all of the outline more than 17.7 mm from the staff, the circle the barrel bridge is cut on; the screw's head lies in a counterbore, and two steady pins go into the train bridge;
   - the barrel bridge's far horn, past the balance on the 6 o'clock side to about 100°, where a cut from the balance's opening to the rim ends it, and its two screws;
   - the barrel bridge's cut round the balance. Its edge, traced on `References/photo-top-view.jpg` through an affine map fitted to five screws on the barrel bridge (within 0.6 mm), fits a circle of r 17.6 about (5.24, 6.33) to 1.3 mm: 2.8 mm off the staff toward the barrel, so it reaches 20.5 mm from the staff on that side. The cut is that circle joined with the balance's clearance circle (r 17.7 about the staff), and the barrel's cap and the fusee's large end show through it, as photographed. On the cock's side the bridge's horn ends against the cock's straight edge, which meets the rim about 5° round from 3 o'clock: with the cock off (6:47) the bridge's edge meets the rim there, and the bridge laid flat (23:30) ends that horn at 2–9°, so the cock stands on the train bridge in the bridge's opening;
   - the setup cover over the ratchet: a waisted plate across the arbor, symmetric about its long axis and across it, as both photographs show, about its own centre 0.53 mm off the arbor toward the movement's centre: its ends arcs round that centre at r 12.69, 75.6° wide, both long sides like concave arcs to 5.58 mm from it (5.05 from the arbor on the rim side, 6.11 on the centre side), so the ratchet's teeth show on either side and the click's tip on the rim side (as in Fig. 24 and the 2E12055 photograph). Fitted to the plate's edge traced along the outline on both photographs (2E12055 through a camera fitted to 11 screws and the arbor, the top-view photograph through `tools/topview.py`'s map); each alone gives the centre 0.59 and 0.41 mm off and the sides 5.61 and 5.43 from it, and the fitted edge lies within about 0.2 mm (median) of the traced one, 0.5 mm at most by side. And the ratchet's size (42 teeth, 14.1 mm across its tips: C Spinner's video, 11:58, against the cover screws' tapped holes, and the top-view photograph);
   - the screw positions;
   - the engraving columns (`tools/engr.json`);
   - the damascene direction. The damascening is on the plates' and bridges' train-side faces only; their undersides, edges and bevels, and the balance lower bridge all over, are plain, as the restoration video shows them (`plainFaces` in `core.js`, which pins those faces' uvs to a ridge's crest).
4. **Placing the group.** From Fig. 107: the wind-indicator wheel sits under the 12, driven from the fusee arbor; the dial's 12–6 axis, the centre, third and fourth arbors, the indicator and the motion work are the dial's and the train's. The photographed group (the balance, fusee and barrel of step 1, and everything traced with them in step 3: the pillars, bridges' cuts and holes, cock, their screws and pins, the engraving, the damascening) is taken into that frame by one similarity (`PT` in `movement.js`: ×1.039, turned 19.42°, shifted (−3.891, 0.879); `L` holds the results), fitted so its three arbors land where the real movements measure them (IDEAS.md 1.12; `Review-results.md` 22):
   - the balance on its lower cap, read face-on on the train bridge's underside (KLUwI2UUCMQ 13:49.5, `tools/framecam.py`); the upper train bridge's opening has its balance lobe centred 0.6 mm from it (23:30);
   - the fusee 20.4 mm from the centre: the bare plate fitted at 34:30 and 36:15 (`tools/rimfit.py`, 20.2–20.8), the side photograph's fusee wheel at the plate's scale (36.0–36.9 mm across, which with its 90 teeth and the centre pinion's 14 puts it 20.3–20.9 out), and the train bridge's notch round it (20.9); on the angle the dial side gives (43–45° from the indicator's stud, `rimfit_40-08.json`);
   - the barrel at the centre of the train bridge's cut round it, 22.56 mm out (the bare plate: 21.4–23.5).
   All three land within 0.23–0.31 mm: the photographs' own layout holds, at 1.039 times the size it was given (about undoing the 0.955) and set 4 mm off the centre. Outlines that run to the rim keep their radius there (`PTr`), so the bridges' rims stay concentric with the plate. What was measured on the video in the train bridge's own frame (its rim, barrel cut and centre bushing) goes through the 14° turn alone (`PR`): the notch, mouth and end, the opening in the middle, the third screw and its pillar. The escape arbor is solved again from the balance (9.40 mm, the escapement) and the fourth (10.585, their mesh); the escapement's plan and the detent turn with it, about 29° from before.
5. **The train.** The fourth, third and escape arbors are measured on the restoration video (`References/VIDEOS.md`, "The fourth arbor, the pillars, the indicator and the ring" and "The scale"; 2 October 2026), at the plate's 87.57 mm: the fourth 21.6 mm from the centre under the seconds (34:30, 40:08; 23.9 until then), the third 16.55 mm out at 149° from the 12 (34:30; earlier (−6.18, 14.75), from the train bridge's underside at 13:49.5), and the escape arbor 9.40 mm from the balance toward the escape jewel seen from above (10:00, where it is 9.46 from it), 11.1 mm from the fourth. With the modules from these spacings (`MOD`: 0.325, 0.251, 0.261) the centre, third and fourth wheels come out in the size ratios counted on the video (centre ÷ third 1.45 against 1.36–1.39, centre ÷ fourth 1.48 against 1.48–1.50), and the fourth's setting stands in the train bridge's keyhole lobe over it (it stood 0.7 mm outside it). The video's plate and ring agree only with a 4–5 % error in one of them; the ring's own proportions put it in the ring's bore, so the plate's 87.57 stands. `tools/solve.py` checks the spacings.
   - The escape wheel sits 9.40 mm from the balance. There the 0.249 in impulse roller clears the teeth either side of it by 0.002 in (roller shake, Op. 84), and the teeth dip into its crescent (Ops. 76, 83).
   - An earlier scaling of Rawlings' drawing gave 10.2 mm. Readings of the drawing vary with the feature used for scale; the manual's specifications fix the distance.
   - The escape arbor keeps its depth with the fourth wheel: that stage's module, 0.249, fits the 10.59 mm centre distance the escape wheel's position leaves.
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
7. **Collision check.** `tools/fine.py --hold` runs the same check with the balance locking arm locked and the train-blocking screw down. `tools/dyn.py` with `tools/interference-check.js` checks every closed part at 0.4 mm through a full escapement cycle. `tools/fine.py` checks at 0.05 mm, also at 15 train positions and wind states, and includes the chain and the tube springs; it found four overlaps of 0.1–0.4 mm that the coarser check could not see. Only intended contacts remain, listed with their reasons in `fine.py`. The barrel's wall is an open drum; `fine.py` tests it as the solid it encloses and measures every part's distance to the solid the barrel sweeps: the tightest are the barrel bridge (0.55 mm above the boss), the detent's foot (0.98 mm) and the train bridge's cutout (1.0 mm from the caps' rim). The mainspring stays 1.2 mm off the arbor, 0.6 mm inside the wall and 0.2–0.3 mm from the caps at every wind. The dial's printed face, an open ring 0.02 mm over its brass disc, is checked exactly instead: no part over the dial, outside its arbor holes, may come within 0.02 mm of it.
8. **Visual check.** `tools/topview.py` renders the model from above and warps it onto the top-view photograph through five barrel-bridge screws: `verification/topview-comparison.png` shows the photo, the model and the two blended. Parts far above or below the barrel bridge (the cock, the balance's endstone) are off by up to about 3 mm there, from the photograph's tilt. The photographed movement has the balance locking arm (Fig. 9), which the model now has too, though its shape is estimated. `tools/p3fit.py` renders from the camera fitted to the photograph the tracing was first done on.

## Estimated, not from the manual

- The balance's dynamics ("The balance's dynamics", under How the timing works): the hairspring's isochronism (0, or the bench's setting), the mainspring's set (a uniform weakening), the mainspring's pull (the profile's pull made 3% steeper at each end), the sustaining spring's strength (0.8 of the drive, loaded) and its linear relaxing, the free run-down (25 s, as before), the jolt's strength (0.6–1 of the balance's top speed), the gimbals' period (0.7 s) and pivot friction (ζ 0.05), the split balance's middle temperature error and the bimetal constants of its curl. The hairspring is taken as isochronous. The Model 21 balance's curvature in temperature is read from one chronometer's test card (No. 3390), so it is that chronometer's, not a type figure; the three period means it rests on are read to 0.01 s a day, sure.

- Tooth counts: the fusee wheel (90), centre wheel (90), third wheel (80) and its pinion (12), fourth wheel (75) and the wind indicator wheel (120) were counted on a restoration video of a 1941 Model 21 (`References/README.md`, "Videos consulted"; `tools/video.py`; IDEAS.md 1.8), not taken from the manual; the escape wheel (16) is Hamilton's. The fourth and escape pinions (10, 10) follow from those counts and a one-minute fourth wheel. The centre pinion (14) is counted on the same video, likely but not certain (end-on at 13:59.5, from above at 35:23.66; no frame shows every leaf); the fusee arbor's pinion (12) is inferred, not counted: 14 makes the manual's 17½ half turns hold its "maximum of 56 hours", and 14 × 12 sweeps the UP–DOWN hand 313.6° in 56 h, against the 315.7° a photographed dial's scale spans. 13 and 13 would fit the dial and the manual's seven half turns a day better, but run 60.6 h. The motion work (cannon pinion 14 : minute wheel 56, minute pinion 18 : hour wheel 54, `MW` in movement.js) is counted on the video, the wheels lying whole on the mat (`References/VIDEOS.md`); it was 12 : 36, 10 : 40, chosen, until the count.
- Dimensions and positions, estimated from the figures and the dial (95 mm, the side photograph), except where the photographs give them (plan: "How the layout was measured", steps 1–5; heights: step 6).
- Heights the side photograph doesn't show:
  - The third wheel's proportions (hub, rim and spokes): given the fourth's, the wheel of its size, since on the restoration video's flat wheels (23:45) the third lies tilted and blurred. The centre and fourth wheels' are measured there (`WHEEL_PROP`, movement.js: hub 0.30 and 0.36 of the tip radius, rim from 0.79 and 0.83, spokes 0.10 and 0.07).
  - The train wheels' and pinions' heights within the stack that Figs. 13, 29 and 110 give (third wheel 0.35–1.0 mm above the plate, centre wheel 1.15–1.85, pinions ending at their wheels' bosses), and the bosses' sizes (the centre boss r 1.3, inside the radius the third wheel's teeth leave free).
  - The barrel's place in height: from 2.4 mm above the plate, over the third and centre wheels, to 1 mm under the train bridge's top; its chain band runs level with the fusee's cone (its height, 16.5 mm, is measured: below).
  - The balance rim, clear of the escape upper bridge, whose end screws sit flush in its top.
  - The hairspring, 6.7 mm tall, from the collet's tongue, 1.1 mm below the balance rim's top edge, to the stud's clamp under the cock (the restoration video side-on, 6:49.5: its top wire 5.8 mm over the rim's top, the coils running on behind the rim's front edge, 7.15 mm or more; Fig. 2, about 2.1 below the rim's top; the collet as low as the hub's estimated boss, cap and screws let it go, 0.5 mm or more short: open; its coils' radius, 5.1, and 12 turns are measured (13 wires down each side on the video side-on, 6:49.5): the radius against the balance rim on the restoration video side-on and face-on, the manual's Fig. 2 and two photographs, 5.26 to the outer edge, their median; Review-results.md, 25).
- The train bridge's cut round the barrel: a circle r 21.0 centred 24.8 mm out (fitted with both free on C Spinner's video, 23:30: r 21.0-22.0, centred 24.6-25.1 out; it was r 19.2 about the barrel until 2 October 2026), open to the rim, which holds the barrel and clears the centre arbor. Figs. 108 and 110 show its presence.
- The escape upper bridge's sizes. Its form is from C Spinner's video (`KLUwI2UUCMQ` 10:00-10:50) and Figs. 84 and 110 (`References/VIDEOS.md`, "The escape upper bridge, close"): a flat bar 1.0 thick, 5.2 wide and 22 long with round ends, across the train bridge's escape opening, a countersunk screw flush near each end (8.3 mm from the jewel) and a steady pin beside it (1.6 further out, 1.3 toward the balance); under its middle 2.5 thick over 10.8 mm with a round boss r 3.8 hanging 1.5 into the opening, which holds the setting; the endstone cap R 4.1, 1.0 thick, sunk flush in the bar on the boss and cut flat both sides with the bar's edges, its window a 90° cone r 1.55 at the top down to the endstone, its screws' heads r 0.75; the bar's ends lie in seats sunk in the train bridge's face (`TB_SEAT`, from `tools/train_bridge.py`: the ends grown 0.25). Sizes as ratios to the end screws' spacing (16.0–16.9 mm), medium. Its length lies 72° round from the balance–escape line (the end screws' line at 10:00). Estimated: the seats' depth (0.3, `SEAT_D`), the screws' countersinks (drawn as counterbores). The train bridge's escape opening is a circle r 6.9 about the arbor (the escape wheel lifts out through it), joined to the traced keyhole.
- The balance lower bridge's outline. It is measured on the restoration video at 13:49.5 (the upper train bridge held underside up with the bridge on it, face-on at 4K) with `tools/framecam.py` (`tools/anchors/lower_bridge_13-49.5.json`): the frame's homography, fitted by `video.py anchor` on the train bridge's rim (r 40.5), its cut round the barrel and the centre bushing (0.2–0.3 mm rms), gives the camera (focal length 6000 px, where the face's two axes come out orthonormal; 5000–7000 move points 0.5 mm or less), and the picked outline goes back at its height: the slab's face 7.9 mm off the train bridge's underside, the lugs' 3.3 (the side views). In the train bridge's frame (turned with the photographed group since the 14° turn: the outline, its circles, the lugs and the screws go through `PT`), the slab is a lens: an outer edge on a circle of r 20.8 (0.2 mm rms over 13 points) round from the 3 o'clock lug past the centre arbor, a flatter convex edge (r 25.7) to the fourth's end, a straight edge across it and a short one to the train bridge's escape lobe, and a concave edge on the lobe's circle (r 7.14 about (13.81, 15.51), 0.04 mm rms; finding 18 under Elsewhere read the lobe at r 7.0 about (12.6, 15.4) from above); a chamfer about 1 mm wide round the convex edges and the end (0.8 in the model, drawn as a step: `LB_LO2` is the underside). The lugs are the video's (their faces traced), the screws at (20.70, 7.23) and (−9.18, 21.87), 33.3 mm apart. Where it differs is round the model's own arbors, which stand off the real ones (on the video the cap is 11.0 mm from the fourth's setting, the model's balance 18.9 from its fourth arbor; `Review-results.md`, "The balance lower bridge", 14): the model's balance is 5.2 mm from the real cap and its fourth arbor 3.8 from the real setting (the fourth doesn't turn), so the slab bulges about 1 mm to keep 1 mm of metal round the cap's counterbore (r 4.3) and the fourth's sink (r 2.7); the model's escape arbor stands 0.5 mm inside the lobe's circle, so the slab has a bite of r 2.4 round it for the pinion to lift out; the third arbor, which doesn't turn either, stands inside the turned slab and has a slot to its edge, 1.0 mm clear; it keeps clear of the far screw's head, and the 3 o'clock lug 1 mm off the escape wheel's tips. The far lug is the video's less where the model's detent (1.0 mm off), the pillar (0.7), a barrel-bridge screw and the balance locking arm's screw and stop pin stand, which on the real movement are elsewhere. The turned detent crosses the slab beside the fourth arbor, so the train-blocking screw keeps a column of its own at (−3.70, 26.50), 4.5 mm from the fourth arbor, with a boss of the slab round it (the video has its dog point 6.9 mm out, toward the far lug). The upper level is 2 mm thick, the steady pins r 0.4; the lower is the 3 mm plate of the side photograph, with the cap's counterbore (r 4.3) and the fourth's sink (r 2.7) 0.4 deep in its underside, so the balance's lower setting, jewel and cap and the staff's lower pivot sit 0.4 mm nearer the train bridge than the slab's underside. The access hole in the pillar plate (RMG No. 4E019) is under the screw at the 3 o'clock end.
- The pillar screws' heads (42055) are measured on the side photograph: r 2.77 and 2.0 tall, a head standing on the barrel bridge in profile at its 18.93 px/mm (±0.1 mm); their shanks are half that, estimated. The detent support block's screw (42056) is sunk flush in a counterbore in the train bridge (10:46: head r about 1.0, counterbore 1.4, against a pillar screw's head in the frame; ±0.15); the counterbore's depth estimated.
- The pillars' profile is measured side-on on the restoration video (KLUwI2UUCMQ 42:56, scaled by the 16.8 mm height, ±0.15 mm): a straight shaft r 2.7 with a collar at each end, the foot r 2.9 over 3.3 mm and the top r 3.3 over 3.4 mm. The barrel pillar is not the train pillars' shape: on the same video (13:06, beside the barrel) a cone: a wide foot (r 3.2-3.4 over its lowest 3-5 mm) narrowing steadily to r 2.25 just under a groove 14.0 mm up, a body r 3.0 above it and a boss r 1.75 on its top, its left edge traced row by row on 13:08 and scaled by the body's radius and its own height (r to about 0.3, heights 0.5; the body's r 3.0 itself estimated, from 13:06 by eye).
- The train-bridge and barrel-bridge screws. Their positions come from the top-view photograph; the manual gives three screws for each bridge. Which bridge each belongs to is read from the photograph (heads proud of the barrel bridge are its own; heads sunk in clearance holes through it belong to the train bridge, below), from the barrel bridge laid flat (C Spinner 23:30: through holes at pillar 0 and over the train bridge's third screw, a screw hole at pillar 2) and from the movement with the barrel bridge off (BunnSpecial 12:05: the train bridge's screw at pillar 0 in place, nothing at the far horn's screw). The barrel bridge: its pillar screw, one through the train bridge into pillar 2, and one in its far horn at (−11.07, 26.46) into the train bridge. The train bridge: screws into pillars 0 and 1, and a third at (32.25, −10.81), at the end of the tongue beside the notch's mouth, its head sunk flush in the 5.3 mm counterbore the video shows there (23:30, 36:26; the head's size and the counterbore's depth estimated). It was at (29.24, −12.28), from the top-view photograph's five-screw map, which fits the model's own screws and so shares their layout; the train bridge laid flat has no hole there. On the video (36:34) the third screw goes down into a pillar, as the manual has all three (Op. 14); in the model a pillar there would stand 0.6 mm in the fusee wheel, so the screw is threaded into the bridge alone until the fusee's place is settled (`Review-results.md` 21). Figs. 29, 67 and 110 draw three train pillars without fixing their places (`IDEAS.md` 1.2).
- The wind indicator's pinion (see the tooth counts). The hand's sweep, `UD_SWEEP`, comes from the train (313.6° in 56 h); every dial's scale is drawn on it through `UDA` (movement.js), so hand and scale agree. The photographed Hamilton dial's ticks, 8 h apart, give 315.7°.
- The Hamilton dial's proportions. The sub-dial centres are fixed by their arbors (the seconds 21.6 mm from the centre, 0.45 of the dial's radius; the UP–DOWN 22.9; until October 2026 the print put the seconds at a fixed 0.472 of the dial's radius, 1.5 mm off its arbor), and the print is the photographed dial's scaled by the seconds' centre (0.535 of its track's inner radius): the track r 40.4-42.2, the seconds track r 17.9, the UP-DOWN ring r 11.2 (measured: `References/VIDEOS.md`, "The Hamilton dial's proportions"). On that dial the UP–DOWN sub-dial is 1.107 times as far out as the seconds (1.12 on the restoration video's dial side; the model's 1.06). The model can't take that: its indicator wheel, 32.5 mm across (module 0.266, from the fusee 17.6 mm away), would then reach past the mounting ring's bore; its stud is 22.9 mm out, as the video has it, and its teeth pass the bore (r 39.0) in the ring's relief round the 12, and the wheel lies between the pillar screws' heads and the hour wheel (open: `Review-results.md`, "Elsewhere", 19). The plate engraving's block is 2.5 mm nearer the rim than on the top-view tracing, to clear the dust-seal flange.
- The stop-bar's size, nose and travel, and the fusee's top: a slotted layer with a groove for the stop-bar spring, and the top plate (r 9.15) with its two screws (at r 7.0, and the steel collar r 3.0 on the arbor, measured on the restoration video, 13:30, which stands on the hub and rises through the plate's hole, r 3.05, as Fig. 28 draws it: the plate comes off over it, 19:58-20:00; its height, 2.8 mm over the top layer, measured side-on at 20:00 against the groove's pitch, so it reaches the barrel bridge, 0.05 under it, the arbor's shoulder under the bushing). Sec. IV describes the mechanism (the chain bears on one end, the other moves out to the winding stop), not its dimensions. The model's bar lies in a slot open to the rim at both ends, beside the hub 3.6 mm off the axis (Figs. 12, 28; C Spinner's video, 20:05-20:27, puts it 3.5-5 mm off, the recess round the hub r 4-5), its spring a round wire in an open C of about 270° in the groove round the hub (r 2.4-2.9), then into the slot to the bar's tab (the video, 20:20; the sizes to about 30 %); a nose from its end hangs 1.6 mm proud of the groove's floor in the top turn, 0.7 turn in, through a window in the top rim, and the chain winding over it slides the bar 1.64 mm, so the far end stands about 1.4 mm past the rim, where the winding stop hangs. The spring bears on a tab on the bar's inner side. The groove is led in over 0.12 turn at its start, where the chain leaves the fusee at full wind, and out over 0.04 at its end.
- The shapes of the springs: the winding-pawl springs (long arcs round the wheel's middle from a two-screw foot about 150° round back to the pawl, as the video, 19:12, and Figs. 28 and 69 have them; their radius, 12.1 FK, and the feet's places read to about 1 mm), the stop-bar spring, the sustaining pawl's spring's top (a straight wire set upright in the pawl, as the video has it, 35:37.5-36:15; its top end taken to stand in a hole through the train bridge, where two small sunk holes stand side by side on the bridge's face over it, 36:23-36:29, and its preload, the pawl turned 0.12 rad in from its seat there) and the setup pawl spring's thickness and height (0.3 and 0.85 mm) and its pins' places: it runs about half a turn round the ratchet at r 8.98 (the video: 1.23-1.31 of the ratchet's tip radius) from two steady pins to the click's back, as C Spinner's video (11:58) and Fig. 108 have it. The setup ratchet's 42 teeth are counted on that video to about ± 2 (`References/VIDEOS.md`), its tips at r 7.05 (the video at 11:58, against the cover screws' tapped holes 23.6 mm apart: 7.04; the top-view photograph through `tools/topview.py`'s map: 7.0-7.3); the cover's feet are steps under its ends, outside the spring; its centre hole r 3.0 and the arbor's square about 7.5 mm over the ratchet (the video: about r 3 and 8–10 mm, rough). The setup pawl turns on its pivot screw, put in from under the barrel bridge (Op. 41, Fig. 80), whose end shows in the cover as both photographs show it, 8.95 mm from the barrel arbor (2E12055 8.94, the top-view photograph 8.95, each through its fitted map; the video 1.34 tip radii, 9.4); the tip at the teeth's root about 34° round, the click 5.07 mm from pivot to tip (the video about 5.1 in the ratchet's measure, the top-view photograph 5.1). The winding-pawl springs lie in a groove in the sustaining ratchet's face on the video (19:12: about 0.7 wide at r 10.6-11.3); the model lays them over the face at that radius, the groove not cut (hidden between the fusee and its wheel; the toothed wheel would have to be built in layers). The fusee's large end has a rim 0.4 tall (estimated: as tall as it can be, 0.1 clear of the sustaining ratchet and its pawl) round its recess, its inner edge 0.84 of the end's radius (18:20). The dust seal is in its proportions on the video (6:29: the packing 0.42 of its diameter tall, the column about 3.5 mm, the flange r 8.6), its flange with a shallow concave bite between the screws on the 12's side (about 7 mm wide, 1.6 deep: rough). The sustaining spring's travel from loaded to spent (`SMAX`): the fusee wheel's turn in the longer of Sec. IV's 5 to 10 minutes of drive, 9.3°. No wind outlasts it, since model time runs at most 10× while winding. The close-up's drive left and the essay's maintaining-power figure count from these 10 minutes.
- The sustaining spring: its band (2.1 mm wide, r 15.8–18.0), its ends and the fusee wheel's recess (wall r 18.0, a raised disc to r 9.3 and a hub) are measured on the restoration video (`References/VIDEOS.md`, 27:26), against the wheel's tips taken as 40.87 mm, and drawn ×`FK` (0.882) like every size read against the wheel; the gap (17° relaxed), the lobes' sizes, which of the fixed end's two holes has the pin, the band's thickness (1.13 mm) and the elevations' heights are estimated. It is pinned to the wheel at one end and to the sustaining ratchet at the other, as the manual has it; loaded, the ratchet's pin closes the gap and the band bows in from the wall, keeping its length.
- The barrel arbor's core (r 1.74) and hook, the barrel wall (0.2 mm thick) and the brace lining it (0.25 mm thick, 40° of the wall), the end plate and taper pin (the plate gilt brass, r 7.0 or less to clear the centre wheel, with a raised boss round its hole and the slot of Ops. 27–29 across the boss, as Fig. 69 draws it and the video shows it, 18:22, 18:25; the boss's r 2.2 estimated; the 9.6 mm pin's ends standing out past the boss), the winding ratchet's 36 teeth (the video, 18:20: likely, not certain), and the chain's end pin and hook (its nose through a hole 0.7 mm across in the wall, as Figs. 17 and 75 have it; the hole's size and the nose's place, 0.85 mm past the last link, estimated).
- The chain's links: figure-eight plates (Fig. 38) 0.9 mm high and 0.18 thick, three deep along the arbor, riveted at a 1.7 mm pitch (the side photograph's chain on the fusee, 1.55-1.76, and KLUwI2UUCMQ 23:45, the chain on the mat, 1.71-1.85; 1.0 until 4 October 2026); the plates' height is measured there too, their thickness estimated. The chain is about 390 links, about 26 in (660 mm) with its straight run; one sale listing gives 28.5 in for the Hamilton's.
- The mainspring's length and lie. Its thickness is from the parts list (0.0165 in, 0.419 mm); its length (1,064 mm) is estimated, filling half the room between the core and the brace, the length that gives the most turns; C Spinner's video gives about 1.1 m (0.9–1.25; 15:54, 32:30). It lies in two packs, one on the arbor and one on the wall, their coils 0.01 mm apart (the grease), joined by one free turn (estimated). In the model's barrel, on a core of r 1.74 (estimated: the arbor's pivots are r 1.4), that spring takes 11.4 turns from its fewest to its most. The fusee's chain needs 4.85 of them on the barrel (r 17.6, measured: below), with a set-up of 0.37 turn (estimated), so it is never wound near its most. The core was r 2.4 (6.53 turns) until the fusee was measured, which needed more chain. The eye in its inner end for the arbor's hook, and the anchor pin at its outer end (the parts list's "complete with anchor pin"), drawn bearing on the brace's leading end, are estimated.
- The detent's dimensions.
  - Its plan follows Fig. 90 and its construction Figs. 14 and 110 and the chronometerbook photograph. Thicknesses and heights are estimated.
  - The foot and support block are shorter than in Fig. 90, so they clear the model's train pillar (the block's end at 1.40 escape radii from the foot, with the pillar's measured top collar). The block is notched round the third arbor, which runs up past it to the train bridge. The block's place is Fig. 90's, about the escape arbor and the balance, which stand ("Elsewhere", 18 in `Review-results.md`); the plan's handedness is not in doubt (the train turns the escape wheel the way Fig. 90's teeth lead; "Elsewhere", 16). A video reading that put the real block elsewhere came from an unreliable fit and is set aside ("Elsewhere", 12). The shortening and the notch stay estimates.
  - The detent's lift, the wheel's release and the trip spring's bending are solved in `ESC` from the discharge jewel's contact with the trip spring's tip. The spring projects past the horn, so the jewel never touches the horn.
  - The wheel's advance is solved from its teeth's contact with the impulse jewel.
- The escapement's settings. They were chosen to meet the manual's adjustment figures, measured with its own definitions (Sec. VIII):

  | Setting | Model | Manual |
  |---|---|---|
  | Lock: detent leaves the stop button, until the tooth drops off | 6.0° | about 6° (Op. 85) |
  | Let-off: tooth drops off, until the detent falls back | 10.2° | at least 6° (Op. 86) |
  | Overall: trip spring falls off the jewel on the passing swing, until the detent falls back on the unlocking swing | 28.0° | 26–30° (Op. 87) |
  | Drop | 2.1° | about 2° (Op. 97) |
  | Roller shake | 0.055 mm | about 0.002 in (Op. 84) |
  | Horn clearance | 0.25 mm | about 0.010 in (Op. 88) |
  | Angle between the jewels | 88° | about 90° in Fig. 90 and Op. 7 (adjustable) |
  | Locking-jewel draw | 10° | 8–12° (chronometerbook post 30) |

  - Depth of lock is 0.125 mm, and the trip spring's tip lifts 0.20 mm to release.
  - The discharge jewel meets the trip spring at −27.3° of balance and releases the wheel at −21.3°. The impulse runs from −20.7° to +20.7°, centred on the dead point.
  - The detent falls back, and on the return swing the trip spring flies back, where the spring's tip leaves the jewel's end (−11.1° and −39.1°). The push peaks about a degree earlier, where the tip slides off the jewel's side onto its end. Let-off and overall are measured to the fall, as the manual's gauge reads them.
  - Simplified: unlocking against the 10° of draw would turn the wheel back a little (recoil, about 0.2° of the wheel); the model's wheel stands until release (the recoil counts in the work unlocking takes from the balance only). Roller shake is equal on both sides, where Op. 84 prefers slightly more on the outgoing tooth. The solver, the mesh and the 2D inset share one tooth outline (`ESC.toothPts`).
- The escapement's parts beyond the plan.
  - The escape teeth: their form follows Fig. 90 and an original wheel photographed in chronometerbook post 30 (a land 0.13 mm wide at the tip, the root circle at 5.5 mm). The undercut of the locking face (the root trails the tip by 0.14 of a pitch, about 16°), the length of the hollow back (0.55 of a pitch) and its curve (meeting the root circle tangentially) are traced from Fig. 90. Fig. 14's cut-away gives the arrangement: the teeth stand the wheel's full thickness on a thin rim and spokes. The plate's thickness (0.5 mm), the rim's width (0.5 mm), the spokes (0.5 mm wide) and the collet (r 1.5 mm) are estimated from the photograph and Fig. 14.
  - The impulse roller's three holes (0.5 mm radius, a quarter turn apart from the jewel, Figs. 14, 61 and 90) and the impulse jewel's section (flat on the impulse face, curved behind, thinning to 0.45 of its width at the ends; "curved side of the jewel", Sec. VII) are estimated in size.
  - The unlocking roller is a collar 1 mm long with its jewel in a slot and a wider slot opposite (Fig. 64); its length and the slots' depths are estimated.
  - The trip spring is a flat strip 0.06 mm thick and 0.3 mm deep, its foot 0.2 mm thick against the angle bracket; both estimated. Its thickness sets where the jewel meets and leaves it, so the settings above were chosen with it: the tip radius `rT` 0.286 and the unlocking jewel at `aD` 269.6° (the jewels 88° apart, as Op. 97 adjusts the drop).
  - The locking jewel's wedge pin (42089, Figs. 57–59), 0.2 mm across, beside the jewel on the side away from the wheel, flush with the block at both ends (Sec. VII).
  - The balance lower endstone cap is round, R 2.7, cut flat 0.65 R from the jewel on the side away from the escape arbor, parallel to its two screws (KLUwI2UUCMQ 13:49.5; Fig. 30 draws it round); its radius is set by the screws' 1.9 mm, which is estimated, at the 0.71 R the frame shows; its window a straight bore r 1.1 over a wider endstone, its screws' heads r 0.5 (the same frame); its thickness (0.45) estimated.
  - The support block's top face is laid out from Fig. 90, scaled by the 11.3 mm from the point of flexure to the locking jewel (to about 0.3 mm): the screw 3.7 mm from the point of flexure toward the foot, a positioning pin 2.0 mm the other way and the other as far toward the foot (Fig. 90 draws them symmetric, 11.85 mm apart; the train bridge's holes on the video are in line with the screw, 5.7 and 5.5 mm from it). The block runs 15 mm toward the foot from the point of flexure and the detent's foot about 16.4, as Fig. 90 draws them (until October 2026 9.2 and 10.6, shortened to clear a train pillar since moved). The pins (r 0.4) stand 1.2 mm into the train bridge; their size and depth are estimated.
  - The block's front is split along its length by a slot open at the stop button's end, as Fig. 90 draws it: the lock-adjusting screw, threaded in the outer part, bears on the strip that carries the button, and its clamp screw crosses the slot into the strip. The slot (0.24 mm), the strip (0.36 mm) and the solid root (0.2 mm) are in Fig. 90's proportions; one drawing, so medium sure.
  - The detent-adjusting screw's head (r 0.9, 0.45 thick) stands 0.3 mm off the block's end and 0.3 mm deep in the slot across the foot, which runs on 0.6 mm past it (Fig. 90's foot runs on about 1.1 mm); sizes estimated. The detent's two steady pins stand 1.2 mm out of the foot, as Fig. 90 draws them.
  - The trip spring's screw: shank r 0.07, head r 0.16 and 0.12 thick, 0.2 mm along the spring's foot, threaded 0.32 mm into the angle bracket's upright leg, which is 0.36 mm thick and 0.4 mm tall; all estimated (on the video the bracket looks taller).
- The balance rim diameter (29 mm), measured on the top-view photograph.
- Where the group's transform (`PT`) and the train disagree, an estimate takes the place (IDEAS.md 1.12): the pillars' feet are measured on the video's bare plate (r 34.1-34.7), but pillar 1 stands at 170.8° rather than the video's 166.3° (40:08, where its dial-side screw is just clear of the lower train bridge's end), where its top screw's head would stand in the cock's foot (the video shows no screw under the cock, 6:29 and 6:47; the photograph has the screw at 172°), and the lower train bridge ends 9.2 mm past the fourth (the video's 10.3) to clear that screw; the balance locking arm's screw stands 30° round from the timing weight it locks (Fig. 9 draws it beside the cock's foot), and the arm swings back over it 120° (`ARM_U`); the dust seal's screws, the setup cover, click and ratchet keep the photograph's sizes ×1.039 (`PHOTO_K`).
- The rate panel's figures (see "The rate panel" under How the timing works). Sourced: the rate for a full turn (p. 70) and the screws' and weights' masses (parts list). Estimated:
  - The rim's section, 3.5 by 0.6 mm (the video: 0.5–0.85 thick on three frames, scaled by the rim's 29 mm and the impulse roller's 0.249 in; its height from the heads' 0.9 of it side-on, to about 10 %), and the arm's thickness (1.1) and its widening round the hub (hidden under the hairspring on every frame; its width, 1.9, is the video's, 6:52.5). `I_REST`, 44 g·mm², added so that the moment of inertia is Table II's 578 (the drawn balance makes 534; a rim 0.69 thick, inside the video's 0.5–0.85, would make it all). Each screw's or weight's mass is spread along its drawn cylinder; the rim's holes, the weights' screws and the staff are left out.
  - The thread pitches (0.177 and 0.151 mm), which follow from the moment of inertia and where the weights stand.
  - Which of holes 3, 5 and 12 carries the 0.080 in heads (the video shows the longest heads, about 2.6 mm, in hole 9; the others can't be told apart at its angles), and the heads' diameter (3.1 mm; the video 2.9–3.2 face-on, 6:52.5). The screws' points inside the rim (1.3 mm) and the verniers' stems outside it (1.6 mm, with a collar) are estimated from the video's look.
  - The temperature's effect taken as linear in temperature about 72.5 °F, with the standard set compensated (Table IV gives the change between 55 and 90 °F only).
  - Reading "one full turn of timing weight" as both weights of the pair turned a turn each.
  - The weights' travel from the middle position the manual starts them at: the verniers 3 turns either way; the timing weights 2, all the room the measured nuts (2.3 mm long, 2.1 across; 6:52.5) leave between the rim and the barrel bridge's cut round the balance (r 17.6): 80 s a day either way at 40 s a turn, where 3 turns would cover the 2 minutes a day that screws and washers leave (Op. 5). Until 4 October 2026 the nuts were drawn 1.7 long with 3 turns.
  - The weights' drawn sizes.
  - The hairspring's strip ("The hairspring, designed"): its width read on the video (0.20–0.28 mm), its moduli from published ranges (Elinvar-type alloys 165–195 GPa, spring steel 207), the spring's winding sense (counterclockwise from the collet, seen as `springGeo` draws it), and the terminal curves' form (a cubic in curvature: any curve that meets the conditions would do as well).
  - **The parts list's masses read as a matched pair's** (`PM` = ½; likely, not certain). The list prints each line once with its quantity beside it ("2", "4-6"), and Tables II and III change screws and washers only "For Pairs". Read as each one's mass: the timing nut as measured (2.1 mm across, 2.3 long, bored and slit; 6:52.5) is about 50 mg of steel, 63 solid, and can't weigh 93; the screws' heads as measured (2.9–3.2 across) would need a metal of density 12.6–14.3, gold, where read as a pair's they come to 6.3–7.1, a little lighter than solid brass (8.5; slotted and pointed); and the drawn balance falls 37 % short of Table II, against 8 % read as a pair's. What would settle it: a Model 21 balance screw or timing weight weighed, or the parts catalogue's own note on how its weights are given.
  - The washers' outer radius (1.0 mm, under the heads' 1.3) and the screws' masses at the middle of the parts list's ranges.
- The upper train bridge's outline, the crescent of Figs. 29, 67 and 110: the disc of the rim (40.5; at least 38.5-39.4 on the side photograph against the measured plate, 38.6-40.2 on the video: `References/VIDEOS.md`, "The bridges' rims against the plate") less the cut round the barrel (r 21.0, above) and the notch round the fusee. The notch, its horn and its mouth are measured on two frames of C Spinner's restoration video (`KLUwI2UUCMQ` 23:30, the bridge lying flat face up; 13:49.5, turned over in the hand), each put on the bridge's face by `tools/video.py anchor` through the rim, the barrel's cut and the centre bushing (0.2–0.3 mm rms on the circles); `tools/train_bridge.py` builds the edge from them. Until October 2026 it was traced on Fig. 67, pushed off the holes and smoothed, which rounded the horn's end. The opening in the middle (two lobes, over the balance and the fourth's setting, and the escape passage) and the straight end past the barrel are traced on 23:30 the same way (`TB_KEY`, `TB_END`); the seats for the escape upper bridge's ends either side of the passage are not drawn (the bar lies on the face). The places of its small holes (pins, the lower bridge's screws) are the model's, not all the video's.
  - Coordinates here are in the photographed group's frame, before the 14° turn (Dial orientation, step 4): the outline is measured against the bridge's rim, barrel cut and centre bushing, so `movement.js` takes it through `PT` with the barrel and fusee.
  - The notch is a circle, r 16.57 about (11.46, −17.47) (32 points at 23:30, 0.12 mm rms; 13:49.5's points within 0.4 mm): sure to about 0.5 mm. Its centre is 2.3 mm from the model's fusee arbor; which of the two is off is open.
  - The horn between the notch and the barrel's cut carries the centre wheel's upper bushing. Its sides are those two circles (both frames, within about 0.6 mm), and it ends in a straight cut across with sharp corners, about 2.9 mm wide and 12.4 mm from the centre: the end only from 13:49.5 (at 23:30 a part lies over it), about 1 mm.
  - The mouth: a sharp corner on the notch's circle at (28.0, −18.7) (both frames, within 0.3 mm), then a straight edge 6.8 mm long that turns into the rim through a round corner of r 6, meeting it at −18.5° (23:30 only, where another part lies near it: about 1–1.5 mm; the edge's last points fit any radius from 5 to 8 mm). The barrel pillar stands in the open notch.
  - Nothing is pushed off the holes: `train_bridge.py` prints the metal left round each. The train bridge's third screw's counterbore keeps 2.6 mm.
  - The keyhole is built from the model's own centres, not traced: the opening round the balance staff and rollers (r 8.0) joined to one round the escape arbor (r 3.0), which the escape upper bridge spans, kept 1 mm off the notch (the video's keyhole leaves 3 mm or more there). Its lobes (one of them under the detent support block's screw) are not drawn.
- The barrel bridge's far horn: past the balance on the 6 o'clock side, round to about 100°, ending in a cut from the cut round the balance (at (−5.45, 21.46)) to the rim. Traced on the top-view photograph through the five bridge screws (about 0.6 mm); C Spinner's video of the bridge laid flat (23:30) agrees to about 2 mm. Its rim is the model's 40.5 mm. Read against the screws, the photograph and the flat bridge put the rim at 34–35 mm, but those screws sit on the pillars, which the bare plate (BunnSpecial 22:00) shows about 1.2 times further out from the centre, against the plate's rim, than the model has them: against the plate itself the rim is 39–40.5 mm (the side photograph's silhouette, 39–39.5), so the rim stands and the pillars' and screws' places are what is off (`IDEAS.md` 1.2, 1.11).
- The barrel bridge's cut round the balance: traced on the top-view photograph, to about 1.3 mm (see "How the layout was measured", step 3). The end of its horn on the cock's side is a straight cut along the cock's traced straight edge, 0.1–0.2 mm off it; the video places it to about 2 mm.
- The balance cock's solid: the body stands outside the barrel bridge's 17.7 mm circle about the staff, and the arm, 2.6 mm thick, is flat underneath out to the body's wall, a square step (the restoration video, 44:02: the cock in place seen from its straight edge, the space under the arm open from the barrel bridge's horn, 16.4 mm from the staff, to the body's wall, 18.6, mapped through a homography on the cock's top; 23:45, flat faces). Its thickness reads 2.9 ± 0.3 there, the model's 2.6 kept (the stud and the hairspring hang from it). Until 4 October 2026 the underside swept down into the body in an estimated quarter-circle cove. The concave edge is one smooth curve from the nose to the horn's tip, fitted to the traced points (within 0.43 mm); the counterbore (1.5 mm, as deep as the screw's head) and the two steady pins' places (where the train bridge shows two plain holes under the cock with it off, 6:47, placed to about 2 mm) are estimated. The walls are drawn plain, as the video shows them polished; the top keeps the plates' damascening.
- The balance cock's nose and its endstone cap. The top-view photograph gives the cap's place, width and screws to about 0.3 mm: a steel plate 4.6 mm wide lying along the cock's straight edge, its two screws 2.75 mm either side of the staff, the cock's metal all round it. C Spinner's video gives its form, close (5:51 and 42:03, 42:08 on the cock, 41:58 off it; `References/VIDEOS.md`): symmetric about the staff, 7.2 mm long (to about 0.3 mm, scaled by the screws and the cone), its corners rounded r 1.2 at the nose's end and r 0.4 at the foot's (about 0.3 mm), the screws' heads (r 0.7) sunk flush in counterbores, and a polished conical oil sink 3.1 mm across (two thirds of the plate's width in each view; on the 1941 movement of the top-view photograph it looks nearer 2.2 mm) down to the endstone, set from below in its setting (42155), which shows on the underside as a ring about 3.4 mm across. The plate's thickness (0.7), the counterbores' depth (0.4) and the stone's size (r 0.95) are estimated. On the real cock the cap ends at the nose's end (within about 0.3 mm); the model's nose runs on about 1.2 mm past it. The tracing, taken through the plate-height mapping and shifted for parallax, puts the nose's edge 0.7 mm from the staff and leaves the cap and one of its screws over nothing, so the nose is widened to the hull of the cap with 0.9 mm to spare, joined to the traced straight and concave edges. The manual's drawings show the setting inside the cock's nose and the cap on it (Figs. 19, 85). The settings' and jewels' sizes are estimated.
- The collet and stud: their outlines and sizes, and the stud's direction.
  - The collet is measured on Fig. 6's two drawings of it (alone, and in the spring's lowest coil; Figs. 5 and 49 agree), the only source: no photograph or video shows one. The points were put back on the plan through a parallel projection foreshortened 0.63, the coil's ellipse; at that value the plate's outer edge comes out a circle (within 0.06 mm), the ledge's round cut a circle (0.03 mm) tangent to its straight part, the notch's walls square to the front edge, and the ledge's top and foot fall on one another (0.1 mm). The hub's own ellipse is drawn flatter (0.45) and was not used. The scale is the hub against the coil, 0.213 of its diameter, the coil as five sources measure it (r 5.1: the drawing's points were read against it as r 5.5 and scaled by 5.1/5.5; until 4 October 2026 by 6.3/5.5): the hub 2.17 mm across; the outer arc r 4.95 about a point 1.21 mm off the staff, 3.72–3.93 from it; the front edge 1.25 mm from the staff, the end face 3.45 along it; the notch 0.84 wide and to the ledge; the hub 1.48 tall, the body 1.47, the tongue 0.46 of it and the front left end 0.50. Read to about 10 % (the two drawings differ by up to 20 % on the tongue's thickness and the clamp's length). Estimated: the body's hidden side behind the front step (taken back to the plate's corner), the groove's depth (0.15), the bore (the staff's, 0.47; the drawings draw it wider), the slit's width (0.1), the clamp's sizes (2.23 × 0.73, jaws 0.42, from the exploded drawing's proportions) and the wedge pin's (r 0.17, straight, not tapered). Its counterpoising is not modelled.
  - The spring's inner end lies against the collet's end face, 3.45 + 0.17 mm from the staff, not at the stud end's 2.65, bent to run 1.43 mm straight along it into the clamp (Fig. 6 draws the end bent; Op. 4); the lead's length is estimated.
  - The stud's bar: 1.6 wide and 0.5 thick (estimated), and the stud screw's counterbore in the cock (r 0.9, its head flush). Its ends are measured on the restoration video (6:47.5, 6:47.75: the balance lifted out, the stud seen from the cock side, 33 px/mm at 4K, put in mm along the row by a 1D perspective fit on its three holes): the outer 0.8 past the outer pin (0.79, 0.77), the inner 2.2 inside the inner pin (2.24, 2.10), and the clamp is a block under the inner end, from there to 1.1 inside the pin (1.13, 1.10), the wedge pin's end showing in the bar's top face 1.7 inside the pin (1.76, 1.68), 0.4 off the bar's middle line; Fig. 5 and Hamilton's patent US 2,379,780 (Fig. 10) put the clamp there too. Estimated: the block's width (2.0, about 1.3 times the bar's on both frames, drawn centred: the side its extra width stands out to isn't read), its drop under the bar (0.7, to the spring's measured height; the frames give 0.9-1.3 with their tilt unknown), and which side of the middle line the wedge pin is on. Until 4 October 2026 the clamp was a block between the inner pin and the stud screw, 4.6 mm from the staff, and the bar ended 0.8 past the inner pin. Open: the frames show the steady pins' holes empty or flush on the bar's top face, where the model has the pins standing 0.8 into the cock. Its holes are measured: three in a row along the cock's straight edge, 3.9, 7.0 and 10.5 mm from the staff, the screw's the middle one: the mean of the restoration video (41:58, through a homography on the cock's screw, setting, cap screws and outline corners) and the top-view photograph (the stud in place, through its map on the barrel bridge's screws from the setting's centre), which agree within 0.5-0.8 mm; the side view (6:50.0) shows the bar running out past the coils with a pin standing up at each end. Until 4 October 2026 it was a bar 5.7 long toward the cock screw, the screw 7.6 from the staff and one steady pin at 5.6.
  - The spring's upper end is in the stud's clamp, 2.65 mm from the staff (measured, above), its terminal curve running in from the coils over the last half turn (the curve's form is estimated); both ends lie in the stud's direction when the balance is at rest.
- The centre of the dial. Sourced: the order of the parts and how they fit (the cannon pinion a friction fit on the centre arbor, Op. 58; the hour wheel free on the cannon pinion, Op. 59; the hour hand broached round onto the hour wheel's pipe and the minute hand broached square onto the cannon pinion, Op. 64; the key on "the bright, square arbor at the center of the dial", Fig. 8). Estimated: the sizes.
  - The hand-setting square is the cannon pinion's squared end, 2.4 mm across, as the fusee arbor's square, since the one key fits both (Fig. 8), standing 1.6 mm proud of the minute hand's collet, as the fusee's square stands (the side photograph suggests about 2 mm).
  - The cannon pinion's pipe is r 1.7, as the square's corners need, since the hour wheel goes on over the square; the hour wheel's bore is r 1.75 and its pipe r 2.3, through a dial hole of r 2.5.
  - The hour hand's boss is r 2.9, its collet r 2.7 and 0.6 mm deep under the blade (clear of the seconds hand's tip, which reaches r 4.0 at :00: the seconds hand is 17.6 mm long, as photographed, and the seconds track is drawn to r 17.9, as the photographed dial has it; the Hamilton dial is printed to that photograph's proportions, scaled by the seconds' centre on the fourth arbor: the minute track r 40.4-42.2, the seconds track meeting it at 6 (0.9 inside), the UP-DOWN ring r 11.2, the dial showing to r 45.9 inside the bezel as photographed; until 3 October 2026 its track was r 43.0-45.4, which with the fourth's measured place left the seconds short of it); the minute hand's boss and collet are r 3.2, the collet 0.8 mm deep over it (the dial photograph shows one round boss about 7 mm across). The hour hand is 1.9 mm and the minute hand 2.45 mm above the dial's seat, the minute hand on the cannon pinion's shoulder. The Hamilton hands' outlines and lengths are measured on the photographed dial (`HAND_W`, core.js; 4 October 2026): sections across each blade every 0.5 mm at 0.1674 mm/px, so the hour hand's swelling stem, round-backed bulb (widest 3.85 at 0.67 of its 35.2 mm) and needle point, the minute hand's long leaf (widest 1.9 at 29 of 42.2), the seconds hand's needle (17.6) and arrowhead counterpoise (9.55), and the UP-DOWN hand's needle (9.8) and boss (r 1.86) are the photograph's, each width to about 0.1 mm (the needles, about 0.3 wide, at the photograph's blur). Estimated: their thickness (0.35), and that they are flat: their side profile (Fig. 21 bends the minute hand's tip toward the dial; the restoration video puts them back on at 46:30-46:45) is not yet read, and the minute hand's bevel, which shows down its length in two tones, is not drawn.
- The gimbal latch's geometry. Sourced: its parts and how they go together (Fig. 106, parts list): the support bracket screwed into the corner from outside the box with washers under the screws' heads, the lever turning on the knurled clamping screw, which goes down through the clamping bracket and the lever into the support bracket, the take-up spring on its two screws, the handle, the keeper on the case on its separating washer and screw, and the slot in the ring the lever passes. Estimated: the brackets' shapes and sizes, the take-up spring pressing up on a collar under the lever, the lever at the height of the ring's pivots swinging 45° between the right wall and the keeper; the slot is 7.3 × 4.4 mm; the keeper is a back and two cheeks.
- The gimbal pivots (Fig. 106, Sec. III, Op. 104): each ring pivot screw in through the box side, its washer under the head outside and its lock nut inside against the wall, its point (r 0.8) in a bushing (42214) in the ring at 9 and the support strap at 3; each case pivot screw threaded through the ring (and at 6 the case support strap), locked by its nut, its point in a bushing in the case bracket. The straps are curved to the ring, the case brackets flat-backed on the case; sizes estimated.
- Pivots and jewels (sizes estimated; the manual gives the jewels' kinds, Sec. II, and the endshake, Ops. 15, 69, 74): every jewelled or bushed arbor is turned to pivots with shoulders: balance and escape r 0.2 in olive-hole jewels (hole 0.22), fourth and third r 0.25 in bar-hole jewels (hole 0.27), third upper r 0.3 and centre r 0.5 in bushings bored 0.02 over, sustaining pawl r 0.5 in the bridge and plate. Endshake 0.05 mm on each: at the endstones for the balance and escape arbor, at the shoulders for the others. The lower train bridge's settings go through the bridge; the endstones are set flush in their caps.
- The oil sinks in the fusee's and barrel's lower bushings, on the dial side (C Spinner 37:59, 38:02): 90° cones round the bores, their outside 0.65 of the bushing's radius (at least 0.25 past the bore), as read on the video; the other unjewelled bushings are drawn plain, not having been seen.
- The barrel's size: its top lip r 18.3, fitted on C Spinner's video (23:30, the barrel standing on the mat beside the upper train bridge, an upright cylinder through a camera scaled by the bridge; r 17.4–19.6 over the focal lengths the frame allows; 13:06 agrees roughly), so the wall r 17.6 under a 0.7 mm lip and the cap 0.7 wider (the bottom outline reads that much larger). It fits the train bridge's measured cut round it (r 19.2) and clears the parts round it by 0.9 mm or more. It is 16.5 mm tall cap to cap, from 2.4 mm over the pillar plate (over the centre wheel, 0.28 clear) to 1 mm under the train bridge's top: side-on frames (33:09.5–33:35) give its height to radius as 0.95 ± 0.06, camera-free, and the 23:30 fit gives 15.6–16.3 at the focal length that agrees with them (±1.2 mm). It was r 13.5 and 13.2 tall until October 2026.
- The barrel's cap screws go into a lip inside the barrel's rim at its plate end (r 12.9-13.3, 0.5 thick), five at 115° + 72° k, clear of the brace (Fig. 109 draws the screws at the cap's edge; the lip is estimated).
- The dust seal's inside: a chamber holding the seal ring (42052) on the arbor's square end, pressed against its top by the helical seal spring (42053); sizes estimated.
- The fusee arbor's collar (r 2.7, from the fusee's large end to the end plate) and the bores on it (r 2.75: the winding ratchet's, the sustaining ratchet's web and the fusee wheel's) are measured on the restoration video (28:08–28:35, 27:26; ±0.3 mm), against the wheel, so drawn ×`FK`. The end plate is cut to r 5.6 to clear the centre wheel's teeth, which run at its height (Figs. 28 and 69 draw it about r 6.7). The sustaining ratchet runs free on the collar on a web 0.3 thick below the heads of the winding ratchet's screws, which turn round in its open centre while the key winds (Fig. 109; the web is estimated).
- The dial's four feet and screws (Fig. 107, parts list: 4): feet down into the mounting ring's flange, 45.9 mm out, screwed from the flange's train side; two where the top-view photographs show them (38.5° and 111.6°), the other two opposite them (a straight-down photograph of serial 623 shows four such screws near the plate's edge).
- The mounting ring's tabs inward under its three screws (its bore, r 39.0, is measured on the video); the relief in the bore's dial-side face round the 12 (11° back to 10° on, 0.4 mm out, 1.0 deep: the video shows a recessed shelf there, its size rough); the alignment pin's place (12 o'clock) and size, and its slot in the case.
- The dial take-off slot (Fig. 21): a notch in the flange's rim, 167° round from 12 seen from the dial, 1.4 mm wide and 2.2 in from the rim, read on the restoration video (9:03, the ring face-on through an ellipse fitted to its rim, oriented by the indicator's stud and the bore's relief; ±3°, sizes ±0.4 mm); its depth, 1.0 (the flange's top layer), estimated: its floor shows brass, so it doesn't go through.
- The case's sizes: the recess round its top fits the ring's flange (r 48.0, 0.05 mm clear) on a shoulder 0.9 mm wide, outside the dial screws' heads, the rim 105 mm across (the top-view photographs), the wall 2.4 mm below the shoulder, the floor 64 mm down (2 mm shallower than it was, so the shield plate's screws clear the box's felt), and the bezel's section, rising to hold the crystal clear of the hand-setting square. The gimbal ring is r 66–68, from the top-view photographs. The box stays 7¾ in; in the 2E12055 photograph the gimbal ring's pivot nuts sit nearer the box's walls than the model's, so the box may be narrower.
- The trip spring bracket's screw (1770) along the bracket's leg into the cross-piece, and the trip spring's foot under the head of its screw; the hairspring stud a bar tapped for its screw, its steady pin through it into the cock; the locking arm's stop pin pressed into the train bridge; the winding stop's thread 2 mm into the barrel bridge; the balance screws' threads in the rim; the timing and vernier weights nuts on their screws. Positions and sizes estimated.
- The case's winding-hole shield plate. Sourced: its parts (plate, shoulder screw, stop screw, return spring; parts list) and their arrangement in Fig. 107: a disc nearly the size of the case's flat bottom with three holes (the shoulder screw's at its centre, the key's, the stop screw's on the other side), and the return spring an open ring with a hooked end, between the plate and the bottom, the stop screw going up through the plate and the hook; its action, turned clockwise, seen from below, until its hole lines up with the case's, and returned by the spring (Sec. III, Fig. 7). Estimated: everything else.
  - The plate 36 mm in radius and 0.8 thick, 0.5 mm below the bottom, turning on the shoulder screw at the case's centre through half a radian.
  - The stop screw, fixed in the case 17 mm from the centre opposite the key hole, runs in an arc slot in the plate, whose two ends set the rest and open positions (Fig. 107 draws a round hole; the parts list names no other stop).
  - The spring's ring (wire r 0.18) runs the long way round inside the stop screw, its other end turned in to a pin in the plate 4.5 mm from the centre; it is rebuilt as the plate turns.
  - The case bottom is 1 mm thick.
- The screws' shanks: a thread of half the head's diameter (0.8 mm for the cock screw, 0.07 mm for the trip-spring screw in the bracket's thin leg), drawn as turned rings, and each one's length. The parts list gives the screws, not their threads or lengths. The cock screw sits 0.3 mm off its traced position (within the tracing's 0.4 mm) so its thread cleared the edge of the foot the cock was once drawn on.
- The lower train bridge: its sizes are measured on C Spinner's video (40:08, the dial side fitted at the plate's scale; `References/VIDEOS.md`, "The lower train bridge"): 4.4 mm thick (4.2-4.9), about 10 wide (9.7-10.3), from 18.3 mm short of the third arbor to 10.3 past the fourth (9.2 in the model: see pillar 1 below), its screws 13.6 and 6.1 out, the settings in counterbores r 3.0 at its top. The settings run through it: gilt at its train-side face too, about r 2.5 (34:30). The opening in the plate under it is measured on 34:30 and 40:08 (`References/VIDEOS.md`, "The plate's opening under the lower train bridge"): a circle r 11.3 about the third arbor, a lobe r 4.85 at (2.9, 10.9) toward the balance, and a bore r 3.2 about the fourth (the lobe's place to about 1 mm). Estimated: the counterbores' depths (0.8), the settings' size (r 2.5), where the stones sit in them, the bore under the stones (r 1.1), and the steady pins' places (16.4 short of the third, past the screw, and beside the fourth's setting; outside the opening).
- The motion work's counts are C Spinner's video's (cannon pinion 14 : minute wheel 56, minute pinion 18 : hour wheel 54; the wheels whole on the mat at 23:45-23:46, the pinion's 18 leaf ends on the wheel's back at 9:06, the cannon pinion's 14 forced by the ratio of 12); their modules come from the minute wheel's place, at 3 o'clock 11.3 mm from the centre, where C Spinner's video puts its stud (40:08 at the plate's scale; the dial-side photograph, mapped through anchors that have since moved, gave 10.5; Fig. 107 draws it on that side of the hour wheel). On the mat the minute wheel reads about 1.13 times the hour wheel across (the model's 1.07) and its pinion 0.28 of it (0.33): by eye on an oblique frame, not acted on.
- The teeth's profiles: cycloidal clock teeth in BS 978 Part 2's proportions (the manual gives no profiles): a wheel's tooth 1.41 module thick at the pitch circle with radial flanks and an epicycloidal addendum capped at 1.15 module, a pinion's leaf 1.05 module thick with a round tip, both 1.3 module deep.
- The pillar screws from the dial side (four), the mounting ring's three screws' places other than the one at 6 o'clock (the screws go in from the train side, through the plate into the ring, as reassembly Op. 1 and Fig. 29 have them; the top-view photographs show the 6 o'clock one on the plate at the rim, half under the train bridge: 40.6 mm out at 100°, the others at 210° and 340°), the dial screws (one into each foot), and the posts of the minute and wind indicator wheels with their screws from the train side. The parts list and Figs. 107 and 110 give the parts, not their sizes or positions.
- The endstone caps: the escape lower cap, a steel plate 1.3 mm wide over the setting, its screws 2.1 mm either side of the arbor (estimated); the escape upper and balance lower caps are measured (above), their screws' heads r 0.75 and r 0.5 on the video though the parts list gives one screw (20762) for all of them; the threads (r 0.225) estimated. The balance lower bridge's steady pins (one in each lug) are estimated: no frame shows the joint they would be hidden in.
- The balance's hub, cap and hold-down screws (Fig. 4): a flange 0.6 mm thick under the arm, a boss through it, a cap 0.35 mm thick, screws 1.7 mm from the staff. The balance's moment of inertia counts them in place of the old hub.
- The train-blocking screw (Sec. II, Fig. 110): its size (head 1.7 mm, thread 0.84 mm, dog point 0.5 mm) and 5.6 mm travel; the wall round it (bored r 0.95 down to the seat 0.6 mm into the bridge's top: the section gives the arrangement, not the sizes) and the access hole in the train bridge (r 0.72). Its place, 5.0 mm from the fourth arbor, is a countersunk hole on the top-view photograph, to about 1 mm.
- The balance locking arm's sizes (Fig. 9 shows it curved, its screw outside the rim and its end at a timing weight; Sec. X: "place the locking arm over the timing weight"): a strip 0.8 mm wide and 0.45 thick, bowed 0.25 mm away from the staff, turning 120° on its screw 20 mm from the staff in the open 6 o'clock sector of the train bridge (at 45° from the timing weight, just clear of the barrel bridge's far horn; locked, the arm passes between the cock's foot and the escape upper bridge, clear of both by little), with a round finger 2.4 mm tall at its end. Locked, the finger stands 15.6 mm from the staff on the counterclockwise side of the timing weight that rests at the arm's end on the 6 o'clock side (0.02 mm clear), and the vernier weight's screw, standing 1.6 mm outside the rim one hole on, stops the balance 15° the other way. Unlocked, it lies against its stop pin, clear of the balance. It gets there by turning 120° with its end passing in under the balance, where Fig. 9 turns it the other way, out from the balance; here the second train pillar's screw head (1.6 mm proud, 4 mm out from the arm's screw) and the cock's foot leave no room for that (Review-results.md, BOM comparison, still open 9). Fig. 9 draws the arm curved along the rim and Fig. 108 a short flat lever with a raised boss round its screw, about 4 to 5 screw heads long (about 7-10 mm; the model's is 13). No photograph or video of the arm fitted has been found: `KLUwI2UUCMQ`'s movement and the top-view photograph's carry the Navy's Y-arm instead.
- The Navy's Y-arm balance stop (Variants, Balance stop; illustrative): as on serial 2E11795 (the top-view photograph), Delaney No. 8854 and a third movement, the last two photographed from straight above. A second dust seal on the barrel bridge, like the fusee's: a nickel body on a flange held by screws, packing rings (black on 2E11795, the cap the fusee seal's size), and a nickel plunger head with a hex socket screw. Under it runs a lever of spring steel (satin, as photographed). Its root is held on a shouldered stud by a large slotted screw near the bridge's rim; the stud takes the place of the barrel bridge's pillar screw, which both photographs put within 2.5 mm of it. The lever runs straight under the cap, through a slot in the seal's body, to a crossbar symmetric about it: an arch round the cock's end, its legs coming down 7.8 mm either side of the staff (clear of the hairspring) and rounding over in a half circle, its top 8.3 mm out on the bar's centre line, and from the foot of each leg, level with the staff, an arm straight out to a round eye with a pin over the rim (13.9 mm out). Measured: the widths, on Delaney's photograph (stem 2.9 mm, lever 2.5, bar 2.2, eyes r 1.4), and the eyes' places (level with the staff, over the rim; Delaney's and 2E11795's photographs registered by the balance rim agree with them to about 1 mm; the cock's edge hides the left end on 2E11795). The arch is traced on Delaney's photograph (its radius about 7.9 mm, its top 8.3, the arms nearly level with the staff); all four movements photographed with the stop (2E11795, Delaney's, the omegaforums one and 2E8489 in the restoration video) have this shape (Review-results.md, open findings 13). Until 4 October 2026 its top stood 12.3 mm out, after a sketch. The outline is the boundary of bars of those widths joined with round fillets, cut as one plate. Estimated: the heights, the lever's 0.45 mm thickness, the stud and its screw, the chamber and slot inside the body, the second flange screw's place, the flange's bite round the setup cover's end and foot, and the screws' threads (not drawn; the bridge is the manual's). The manual doesn't describe the stop (its "balance stop", Sec. I, is Fig. 9's arm), so how it works is taken from two descriptions of it (Review-results.md, 13): the plunger, screwed down by its hex socket with an Allen key through the bottom of the case, presses the lever down, which bends about its screwed root (drawn as a turn about the horizontal through the pivot, along the crossbar, so both pins come down together) until the pins bear on the rim's top edge, as the wedges did; free, they stand 0.5 mm over it. Locked and Unlocked under Stopping and starting work it as they work the locking arm.
- Stopping and starting: the balance's free run-down (1/e in 25 s), the arm's braking (0.2 s), the twist's swing (160°) and the build-up to `ESC.A` (3 s). `ESC.AMIN` is worked out from the escapement.
- The escapement's amplitude and rate ("The escapement's amplitude and rate"): the free run-down's 25 s (`TF`) sets Q = 157 and so the scale of every escapement error; friction at the locking jewel μ = 0.15 (steel on sapphire); the detent spring's and trip spring's shares of the impulse's work at the model's settings, 3% and 0.5% (`fD`, `fP`). With them the wheel's torque comes out about 0.22 mN·m at the escape arbor (1,140 g·mm², a 0.5 s oscillation). The escapement's own error at the model's settings (−1.4 s a day) is taken to be timed out; the rate shown is the change from it.
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
  except at their intended contacts (`tools/fine.py`).
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
  uses to check that a pinion ends at its wheel's boss.
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
in its seconds sub-dial and engraved on the plates. The numerals are sized from
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
values. The Nickel/Gilt plate finishes are in `PLATE_FINISH`.

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
