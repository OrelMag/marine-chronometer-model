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
| `../shared/escapement.js` | The detent escapement's solver, `makeEsc(settings)`, shared with the essay's detent figure and `tools/escapement.js` |
| `../shared/escplan.js` | Its plan, `drawEscPlan(ctx, w, h, state, E, o)`, drawn from the solver's outlines, as Fig. 90 has it: the walkthrough's inset and the adjuster's bench (three names, the stage written under it) and the essay's detent figure (every part named, a dial for the balance's angle); `escStage(state)` names what the escapement is doing |
| `js/movement.js` | The movement: layout constants, the escapement (`ESC=makeEsc(...)`, with the centre distance from `L`), screw positions and holes, pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, train-blocking screw and balance locking arm, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate that turns to admit the winding key), winding key |
| `js/essay.js` | The Essay tab (see "The Essay tab" below): its figures, drawn from the model's code, and the tab, hash and scroll handling. One IIFE that declares only `ESSAY` |
| `js/app.js` | The parts registry (`PARTS`: every part's name, description, part numbers, group, colour and flags), renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, stopping and starting (the balance's amplitude, the locking arm, the train-blocking screw, the twist), and the animation loop |
| `build.py` | Inlines the CSS, JS, three.js and fonts into `dist/` (through `inline.py` at the repository root), with the version and the list of changes from the root `CHANGELOG.md` (`changelog.py`) |
| `dist/chronometer-working-model.html` | The built single file (committed) |
| `tools/bundle.py`, `tools/fit.py`, `tools/unproj.py` | Photo fitting: camera fits to the Fig. 2 and top-view photographs, triangulation of the balance, fusee and barrel axes, photo points projected onto the movement (see "How the layout was measured") |
| `tools/solve.py` | Reads `L` and `TRAIN` from `movement.js`: solves the escape arbor against `L.E`, gives the modules and wheel tips, checks the arbors clear the wheels in plan (no browser) |
| `tools/p3map.json`, `tools/cock_outline.json`, `tools/engr.json` | Traced from the top-view photograph: its mapping into the model, the balance cock's outline, the engraving columns |
| `tools/dyn.py`, `tools/interference-check.js` | Voxel collision check through a full escapement cycle |
| `tools/views.py` | Before/after renders of every view (frozen, labels hidden), a pixel diff between two runs, and close-ups of chosen parts |
| `tools/isolate.py` | Renders chosen parts alone, everything else hidden, each view beside a reference image (a photograph, a video frame, a figure): the check after any change to a part's geometry |
| `tools/maintaining.py` | The maintaining work over run and wind cycles: the sustaining ratchet never turns back, the sustaining spring is loaded in running and only relaxes while winding, the fusee catches forward when the key lets go, the pawls sit on their teeth, and the stop-bar meets the winding stop at full wind |
| `tools/fine.py`, `tools/fine-interference.js`, `tools/barrel-clearance.js` | Fine (0.05 mm) collision check through the escapement cycle, round the train and over the wind, against a table of expected contacts; the barrel's margins and the mainspring |
| `tools/audit.py`, `tools/geometry-audit.js`, `tools/geometry-audit-box.js` | Geometry audit of the movement (and, with `audit.py box`, the box and gimbals): overlapping or unsupported screws, loose arbor ends, coplanar faces, isolated parts |
| `tools/exploded.py`, `tools/exploded-check.js` | Exploded-view clearance: every part and screw, taken as it stands assembled, against every other, at every spread from 0 to 100 % (none may meet at full spread, or pass through another on the way), over escapement phases, train positions and the wind |
| `tools/solids.py`, `tools/solids-check.js` | Solid geometry check: every mesh closed (no open edge), consistently wound and not inside out, but the decals and surfaces flagged as such; loaded as it is and with Moving parts only and a section on |
| `tools/placements.py` | Every mesh's position and bounding box in seven model states (escapement phases, train and wind positions), and a diff between two runs or two copies of the page: proves a change moved only the parts it meant to, and that the mechanism moves as before |
| `tools/escapement.js` | Measures the escapement against the manual's adjustment figures (Node.js, no browser) |
| `tools/invariants.py` | Checks the model's arithmetic: hands against the time, the wind indicator's scale, the fusee's 56¼ h and 17½ half turns, the balance's moment of inertia and the rate for a turn of the weights (exit code 1 on a failure) |
| `tools/smoke.py` | Loads the model and clicks through every control (views, walkthrough, variants, sections, time zone, keys, a URL-hash link), then opens the Essay tab, scrolls it and works every control in it (the model not drawn under it, at most two WebGL contexts, a link into the model and Back, `#essay=detent`); fails on any console error or warning (`--model`, `--essay`: one half) |
| `tools/p3fit.py` | Renders the model from the top-view photograph's camera |
| `verification/lower-bridge-comparison.png` | The balance lower bridge against its sources: the restoration video's face-on frame (13:49.5) beside the model seen from the same camera (`tools/framecam.py`), the model's outline drawn on the frame, the measured and model plans (`tools/lower_bridge.py`), the two levels side-on (36:45), Figs. 110, 29 and 30, and the model from below, in place and from above |
| `tools/lower_bridge.py` | Lays out the balance lower bridge after the restoration video's (13:49.5, measured with `tools/framecam.py`; formerly 36:01, measured through a camera fitted to the train bridge's rim; Figs. 29, 30, 110) round the model's arbors and what it must clear, reports the clearances, prints `LB_UP`, `LB_WALL` and `LB_LO` for `movement.js` and draws the plan beside the video's outline (no browser) |
| `tools/rimfit.py`, `tools/rimfit_36-01.json` | A plate or bridge lying on the blue mat in a video frame, put in millimetres through a perspective camera fitted to its rim (and to round settings traced on it, made to come out circular): picked points at their heights above the face, turned onto the model by named arbors (no browser). The specs: the restoration video's upturned train bridge with the balance lower bridge (36:01), the dial side (40:08) and the bare plate from the train side (34:30, its rim traced beforehand: `rim_pts`) |
| `tools/framecam.py`, `tools/anchors/lower_bridge_13-49.5.json` | A video frame's camera recovered from the homography `video.py anchor` fitted on it (the focal length where the face's axes come out orthonormal): picks put back on planes at their heights off the anchored face, the `--look` for `isolate.py` that sees the model from that camera, and a render warped onto the frame beside it (no browser for the picks). The spec: the balance lower bridge on the train bridge's underside at 13:49.5 |
| `tools/train_bridge.py` | Builds the upper train bridge's notch, horn and mouth from their edges measured on two frames of a restoration video (`tools/anchors/`), prints `TB_NOTCH` and `TB_EDGE` for `movement.js` and the metal left round each hole; with the frames, draws the outline back on them (no browser) |
| `tools/video.py` | Teeth and parts from videos of real Model 21s (`References/README.md`, "Videos consulted"): fetches a video (yt-dlp) and takes contact sheets and frames from it, into a folder outside the repository; counts a wheel's teeth one by one on a frame, unrolling its rim along a fitted ellipse, and writes strips for checking the count by eye (no browser) |
| `tools/topview.py` | Renders the model from above and warps it onto `References/photo-top-view.jpg` through five screws on the barrel bridge: `verification/topview-comparison.png` (photo, model, the two blended) |
| `tools/social.py` | Renders the 1200 × 630 link-preview images into `site-assets/`, the model on a dark background beside a title column: `social.png` (the page's preview: the dial in its box, hands at 10:10) and `social-movement.png` (the moving parts, titled for the essay, for posting) |
| `verification/` | Reference results: the top-view comparison, the Fig. 2 overlay and its camera fit |

## Controls

Speed: the presets, or any value from 0.01× to 10,000× on the Custom slider or typed in; the space bar stops and restarts. Up to 5× (`REAL_X` in `app.js`) the balance swings as it really does and the escape wheel steps; faster, a real swing would be a blur, so the balance swings at 0.9 Hz with the detent and trip spring still, the wheels turn smoothly, and the HUD adds "balance swing shown slowed". While winding, model time runs at most 10× (`WIND_X`), so a wind takes at most about 3 minutes of it, inside the 5 to 10 minutes the sustaining spring drives the train (Sec. IV); the HUD says so. Right-click a part to fade, hide or isolate it (Isolate shows that part alone, box and floor shadow gone; picking a part from the parts list, or ticking its box, adds it to the isolated ones); right-click empty space to bring hidden parts back or leave isolation. On touch screens a long press (half a second, barely moving) does the same; Android's own long-press `contextmenu` and the page's timer open the menu once between them, and the press never picks.

- The **?** button on the model (or the **?** key) opens a card listing every control, for a mouse and for touch, with this device's first; the header and the hint word the gestures for the device too (`.m-only` / `.t-only`, switched by `@media (hover:none)`). A tap in the model, × or Esc closes it; dragging doesn't, so the gestures can be tried with it open.
- Keys 1–9 pick the views, in the order of their buttons. Exploded has a Spread slider.
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
- Adjuster's bench (its own section): the escapement's six settings on sliders (trip-spring tip `rT`, discharge-jewel reach `rd`, depth of lock `dL`, locking-jewel draw `DRAW`, and the discharge and impulse jewels' angles `aD`, `aI`). Each change rebuilds `ESC` with `makeEsc` and takes it over in place (`Object.assign`, so everything reading `ESC` follows), rebuilds the detent pieces, trip spring screw, roller and jewels (`mv.userData.escSet()`), and measures lock, let-off, overall, drop, roller shake, the teeth's dip, horn clearance and the jewels' angle against the manual (`ESC.checks()`, as `tools/escapement.js`), with the plan view live beside them. A setting at which the escapement would not run (`ESC.measure().runs`) is refused, with the reason, and the last working one kept. The least amplitude that runs (`ESC.AMIN`) follows the settings: past it the train stops, and a twist starts it again. The hash carries the changed settings (`esc=rT:0.29,aI:185`). The model's settings are one button away; the geometry checks (`fine.py` and the rest) cover only those.
- Rate book (its own section): the navigator's record of Sec. IX, Table I. The dial is compared with the master at noon each day, master time, and on Compare now; the error is read to the nearest half second, as the hands step. The daily rate is the change in error per day, taken against the latest comparison at least half a day back with no break (started, stopped, set, not wound) since, since over a shorter time the half-second reading swamps it. Below the table, the mean daily rate and mean deviation over the last ten rates since a break, and live for the current dial error, what it does to a position: 4 s of time is 1′ of longitude, that many nautical miles times cos(latitude) (Latitude input), uncorrected and after the navigator's correction with the last error and the mean rate. The remarks are recorded automatically. The rate is steady in the model (only the weights change it), so the mean deviation shows the reading's half-second steps.
- Setting, Stop to set: the manual's other way (Sec. III, "Setting When Stopped"), to the second. The button is the next step: Stop to set locks the balance with the locking arm (the manual stops the balance by hand, the movement out of its case), Unlock arm takes the arm off with the balance at rest, and Twist to start gives the twist. Meanwhile the Time section counts down: to the moment the master overtakes a fast dial, or to when the second hands agree on a slow one, after which the minutes are set forward with the key. The wheel stands locked, so the second hand is on a half second, and what is left after the start is the moment of the twist (and the fraction of a second the balance takes to pick up).
- Winding: Since winding and Wind, and Wind with the key, which turns the fusee half a turn at a time, 17½ half turns from run down (the fusee's 8¾ turns, 56¼ h of chain), with the plates see-through and the winding stop kept solid. For the last turn the camera closes in on the fusee's top: the chain winds over the stop-bar's nose, and the bar's far end comes round to the winding stop.
- Rate and timing weights: turn the timing or vernier weight pair in or out by eighth turns, up to 3 turns either way from mid-travel. `R.timing(nt, nv)` in `movement.js` moves them and returns the balance's moment of inertia, computed from the balance's geometry and the parts list's masses (1,140 g·mm², Table II's). The weights' thread pitch (`R.pitch`) is set so that a full turn gives the manual's figures (p. 70): about 40 s a day for the timing pair and 2.8 s for the vernier pair, which makes the pitches 0.179 and 0.113 mm. Below them, a screw pair (numbered 1–5 round the rim) takes any of Table II's five head heights (0.040–0.100 in) and the washers of Table III (0.002–0.010 in) under its heads, as Op. 3 changes them: `R.screws(heads, washers)` rebuilds them and `R.timing` counts their masses; the panel puts the manual's figure for the change (Tables II and III, for pairs) beside the model's, which are within about 10 % for screws and 15–25 % for washers (Table III fits a lighter balance, about 960 g·mm²). Zero puts back the weights' mid-travel and the standard screws. The model clock `tSim` then runs √(I₀/I) as fast as real time, so the hands gain or lose; the panel shows the daily rate and what the hands have gained since the weights were moved or the hands set.
- Stopping and starting (and Twist to start under Winding): the balance locking arm (Fig. 9) and the train-blocking screw (Sec. II), and the twist that starts a stopped chronometer. See "Stopping and starting" under How the timing works.
- Parts: every named part by group, to single out (as a tap does) or hide. Display adds a slow turn and an Auto/Light/Dark theme, and Reset display puts every Display box back to its default (See-through to the view's own) and shows faded and hidden parts again, leaving the theme. Save writes the view as a PNG; Link copies the page's address with the state in its hash (without clipboard access it is put in the address bar instead).
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
- Remembered in this browser (`localStorage`, each in a `try`): the theme (`cm-theme`), the open panel sections (`cm-open`), and in `cm-set` the plate finish, dial style, balance, the last view and the cards' units. The remembered view opens the page when its link names no view or walkthrough step. Nothing else is kept: a link (the hash) carries the rest.
- Parts: a search box above the list finds parts by name, Hamilton part number (`42087` finds the detent) or words in the source note, every word; `fig 90` finds the parts the manual's Fig. 90 shows (from `figs`, ranges included). Sizes in: mm or inches, the manual's unit, for the sizes on the part cards (remembered in `cm-set`).
- Colour by source (Display) colours each part by where its shape and size mainly come from (`src` in `PARTS`, `SRC`): the manual (green: its figures, parts list or specifications), measured (blue: on photographs, or a real part), solved (amber: placed or sized to fit the rest) or estimated (grey: the manual shows it, not its size or shape). A key under the tabs names the colours; the part's card says what came from where. It and Colour by part exclude each other; `colr=part` or `colr=src` in the hash.
- Labels are off by default (Display turns them on, and the choice isn't remembered). The walkthrough shows the labels of each step's parts regardless.
- The walkthrough sets its own view, speed, Moving parts only, ship motion and gimbal latch for each step. Ending it (Finish, Exit, or anything that leaves it) gives back the viewer's own: the view, See-through, Ship motion, Gimbals latched, the speed, Moving parts only and the motion work, as they were when it started.
- Shadows (Display; off by default; `shadows=1` in the hash when on): the key light casts shadows through a shadow map (`PCFSoftShadowMap`, 2048 px, 1024 on phones). With it off, the light casts none: no shadow pass, simpler shaders to compile (two programs fewer at start), and the map is freed. The floor's soft shadow under the box is a texture (`shadowTex`) and is always drawn. The tinted and ink drawings follow the switch. Cost with it on, measured with `tools/perf.py`: about 230–380 more draw calls and every caster's triangles again; 0.4–1.1 ms a frame on a desktop GPU, 22 % (Edges on) to 47 % (Edges off) on the Dial view with the CPU throttled 4×, 14–22 % in the software renderer. `social.py`, `topview.py` and `p3fit.py` turn it on, as their images were made.
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
  constant force, winding, counting, the detent, level on a moving ship, keeping the rate, the Hamilton Model 21.
- **Figures, and what each takes from the model:**

  | Figure | Drawn with |
  |---|---|
  | The dial at the top | `dialCanvas('hamilton')` and the hands' outlines (`handShape`, core.js) at the model's own time and state of wind (`bind`) |
  | Longitude, clock error | 2D; 4 s of time is 1′ of longitude |
  | Balance and hairspring | The Model 21's balance rebuilt in the essay (the model's is built inside `buildMovement`): `BAL_R`, the rim's section, screws and weights as `movement.js` places them; `springGeo` with the model's hairspring numbers; the swing `ESC.A`; the moment of inertia `R.timing(0,0)` |
  | Terminal curves | `springGeo`, and a plain-ended coil (essay-only), drawn with fewer coils than the model's fourteen |
  | Heat | A split bimetallic rim (as history), a plain brass one and the Model 21's; the older balances' rate curves are illustrative; the Model 21's band is the Navy test's limit (Sec. IX), not a curve |
  | Constant force | The model's fusee profile and barrel turns (`R.fs.rf`, `R.fs.I`), 8¾ turns, 0 to 56¼ h; the spring's pull shown is the one the profile answers |
  | Winding | The dial's up/down sub-dial and hand; 3.43 h a half turn (`FUSEE_PER_HOUR`) |
  | Counting | `arbor`, `gearGeo` and `escapeWheel` with `TRAIN`'s counts and `MOD`'s modules; turn times from `ESC_PER` |
  | The detent | `drawEscPlan` with the model's `ESC` (it follows the adjuster's bench) |
  | Gimbals | `buildBox` itself, with a dial at the model's time |
  | Keeping the rate | 2D; a simulated chronometer's rate book in the form of Table I |

- **Numbers in the text** that the model computes are `data-live` spans filled by `fillLive()` when the essay shows: the escapement's figures
  (`ESC.measure()`), the swing and the least swing that keeps it going, the roller, the centre distance, the tooth counts, the fusee's radii, the
  moment of inertia. The text's other facts come from the manual (Secs. I–IV, VIII, IX) and this README; keep them to those sources.
- **Building and drawing.** A figure is built the first time it comes within 300 px of the view (an `IntersectionObserver` on the essay), once the fonts
  are loaded (the dial is drawn once and kept) and, for those that read the model (the fusee), once app.js has called `ESSAY.bind()`. A figure is drawn
  only while the essay shows, and only when something in it changed. The 3D figures share one `WebGLRenderer` on a canvas off the page: each renders
  into the bottom-left corner of that canvas and is copied onto its own 2D canvas in the same task, so the page has two WebGL contexts (the model's and
  this one), where one per figure would have been seven more. The model keeps time under the essay but isn't drawn, and its keys are left alone.
- **Hash and history.** `#essay`, or `#essay=<section>` as the reader scrolls, written by app.js's `hashOf` (by the essay itself before the model is
  built). Links from the essay into the model are ordinary links (`#tour=3`, `#view=escapement&speed=0.05&part=det`, `#open=bookDet`), so Back returns
  to the essay where it was left; `sessionStorage` (`cm-essay-y`) keeps the place through a reload. The essay's old address on the live site
  (`/marine-chronometer`) is redirected to `/#essay` by `worker.js`.

## Testing

The page's state is kept in the URL hash, so a link opens the model as it
was: `#view=escapement&speed=0.05&part=det` (a view, speed and picked part; `view=laidout` is the laid-out train), `arm=1` (the balance locked, at rest), `block=1` (the train-blocking screw down),
`#tour=6` (a walkthrough step), `#essay` or `#essay=detent` (the Essay tab, at a section), `open=bookDet` (in a link: open that panel section), `drive=1` (Moving parts only), `draw=1` / `draw=ink` (Tinted / Ink drawing), `edges=0` (Edges off), `shadows=1` (Shadows on), `sec=x:-3.5`, `esc=rT:0.29,aI:185` (the adjuster's bench, where it differs)
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
the folder they're run from. `escapement.js` and `solve.py` need no browser. The
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
  the train (drawn up to `SMAX`, 10°); `eps` runs down with `n`, so the
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
amplitude is kept as state (`H.amp` in `app.js`, 255° each way when running)
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
  down. It runs down freely with the train held (1/e in 25 s, `TAU_FREE`,
  estimated) and at once, within a swing or two, against the locking arm
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
  impulses bring it up to 255° (`TAU_UP`, 3 s).
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
  in, about 16 minutes a day; 0.100 to 0.050, about 43; and eight more. With
  the parts list's masses at their heads' radii, those changes fit a balance of
  1,140 g·mm² (least squares over the ten; Table III's washers give about 960).
  The rim is drawn to give it: 4.3 mm tall, as Fig. 3 draws the band against
  the 29 mm balance, and 1.12 wide. The screw heads are 2.6 mm across, as Fig.
  3 draws them; at that size their masses need a dense metal (gold, or
  platinum; brass would need heads of 3.9 mm).
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
  beyond the nuts, as in Fig. 3, and are expected.

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
  - the balance and hairspring. The balance carries 10 screws in diametric pairs, 6 of 0.049 in, 2 of 0.080 in and 2 of 0.101 in head height, plus 2 timing weights (93 mg) and 2 vernier weights (10.5 mg), each a nut on a screw in one of the rim's holes (parts list, p. 82; Fig. 3);
  - the barrel cap with its five screws on the pillar-plate end (Figs. 26, 109), and the dust seal with three packing rings around the fusee arbor (Fig. 24);
  - the gimbal mounting (Figs. 1, 94, 106): a flat ring hung on two pivot screws through the box sides (washer inside, lock nut outside), the case hung in it on front and rear pivot screws into brackets on the case, support straps at 3 and 6, the gimbal latch at the front right (a lever on a support bracket, through a slot in the ring to the keeper on the case: Fig. 106 and the parts list) and the key at the back right;
  - every part in the parts lists of Figs. 106–110, checked one by one (`Review-results.md`, "Every part against the manual"); among them the pillar, mounting-ring, dial and post screws, the endstone caps and settings, and the barrel and fusee upper bushings;
  - the balance's hub, cap and hold-down screws (Fig. 4), the balance wheel locking arm with its screw, washer and stop pin (Sec. III, Fig. 9; parts list 108-31 to 108-34), and the train-blocking screw (Sec. II, Fig. 110): threaded through the balance lower bridge's slab beside the fourth's setting, its head in the lug's column, which rises to the train bridge's underside as the figure's section draws it; screwed down between the fourth wheel's spokes, its head on the seat at the bottom of the column's bore, the chamfer seating in the train bridge's access hole when raised, with the slotted spigot above the head standing in the hole;
  - the balance lower bridge (Figs. 29, 30, 110; Ops. 11, 12, 50; parts list 110-27, 110-20): a stepped block of two levels, its outline measured on the restoration video below, the train bridge held underside up with the bridge on it (`References/VIDEOS.md`, "The balance lower bridge"). The lower level is a slab curved as a lens, its convex edges chamfered, carrying the balance's lower setting and endstone cap (the cap in a round counterbore) and the fourth wheel's upper setting (a large gilt setting in a sink); its concave edge follows the train bridge's round escape lobe, so the escape wheel lifts out past it with the bridge in place (Fig. 110 draws the bridge as a C round that opening). A lug stands at each end of the bridge's long axis, its pad against the upper train bridge's underside, held by a screw 42055 put in from below (the figures draw them head down under the bridge; Op. 12 screws it to the upturned train bridge, Op. 50 takes the screws out once that bridge is off) and a steady pin, and joined to the slab by a wall; between the lugs the escape wheel turns over the slab. Along the bridge, Fig. 30's order: a lug with its screw, the train-blocking screw, the fourth's setting, the balance's endstone cap, and the arm to the other lug;
  - the balance upper setting and jewel, pressed into the cock under the endstone cap and its two screws (Figs. 19, 36, 84, 85; parts list 42162, 42160), and the staff's pivot in it;
  - the hairspring's collet and stud (Sec. II; Figs. 5, 6, 19, 84, 85): the collet slotted to grip the staff, with a flat plate whose tongue carries a clamp and wedge pin for the spring's inner end; the stud under the cock, held by the stud screw from the cock's top and a steady pin, holding the upper end the same way;
  - the hand-setting square at the centre of the dial, which takes the winding key (Sec. III, Setting; Fig. 8): the cannon pinion's squared end, with the minute hand broached square on it and the hour hand pressed on the hour wheel's pipe (Sec. VIII, Ops. 58, 59, 64);
  - starting: a detent chronometer is not self-starting, and is started with "a single quick twist" of its box (Sec. III);
  - the dial markings, winding figures and part numbers. The UP–DOWN scale runs clockwise round the bottom of its sub-dial from UP (upper right) to DOWN (upper left), so winding turns the hand counterclockwise back to UP (Fig. 107, Sec. III).
- New-old-stock Hamilton Model 21 pillar plate listing: 87.57 mm diameter, 3.86 mm thick.
- The mounting ring and the case (Figs. 29, 67 and 110 draw the ring as a deep ring under the plate, cut; Sec. VI: it is lacquered; Sec. III, taking the movement from its case: the bezel unscrews counterclockwise, the movement may "stick in the case" and is pushed free with the key, put upside down on the case "with the dial carefully located in the shoulder recess around the top edge of the case", and "the alignment pin protruding beyond the movement enters its slot in the edge of the case"; the note at Op. 98: "the dial or the movement [may] shift on the mounting ring"). The case's parts list (Fig. 107) has nothing between the case and the movement: the ring holds it. Measured on the photographs:
  - the side photograph (`photo-side-view.jpg`, 18.9 px/mm by the plate's width), from the plate's train face down: a silver band 1.9 mm, a gold band 4.1 mm as wide as the plate, a flange 4.4 mm deep and 95.9 mm across with a slot in its edge, and a thin layer about 95 mm across under it, the dial. The model reads the gold band and the flange as the ring under the plate, so the dial lies 10.4 mm below the plate's train face. The plate is the listing's 3.86 mm, so the colour change 1.9 mm down its edge is not explained (the edge may be gilt below its plating, or the plate stepped into the ring);
  - the dial-side photograph (`photo-dial-side-lower-train-bridge.png`): the ring's bore, about 0.84 of its outside across (r 40.2), the plate's dial face sunk in it;
  - the top-view photograph: two small screws in the flange outside the plate's edge, 45–47 mm out at about 38.5° and 111.6° (the dial screws); the case's threaded rim about 1.2 times the plate's width, 105 mm across; the gimbal ring's inside about 1.5 times it, r 66 (the ring lies lower, so it is if anything larger).
- Royal Museums Greenwich, Hamilton Model 21 No. 4E019 (https://www.rmg.co.uk/collections/objects/rmgc-object-387425): "a large hole in the pillar plate for access to one of the lower balance bridge screws to enable removal of the bridge without dismantling the sub-frame". The model has that hole under the screw at the end of the bridge's arm.
- chronometerbook.com, post 4: W. Rawlings' plan of the Model 21 escapement, a redrawing of the manual's Fig. 90, and a photograph of a Model 21 detent.
- chronometerbook.com, post 30: escape wheel specification of 16 teeth, 13.14-13.18 mm diameter, 1.27-1.32 mm thick and no wider than the impulse roller; the locking jewel set at 8-12° of draw.
- The manual's Fig. 2 photograph (layout) and Fig. 107 (dial side, wind-indicator wheel).
- Photographs of a Model 21's dial side during reassembly and of its loose motion-work wheels (user-supplied, source unknown): the solid minute and hour wheels and the five thin spokes of the wind indicator wheel. Shapes only; the counts and the wind indicator wheel's radius (Fig. 107) are unchanged, though the photographed wheel looks larger (about r 15–17 mm).
- A photographed Model 21 dial of the U.S. Maritime Commission contract (the Hamilton dial's layout, inscriptions and hands) and a photographed movement, serial 2E12055 (the plate engraving's text and layout, and the serial used on the plates and dial). Both are in `References/`.
- Videos of real Model 21s (`References/VIDEOS.md`, which records what each shows and every measurement): a 4K restoration of a 1941 movement, serial 2E8489 (C Spinner Watch Restorations, https://www.youtube.com/watch?v=KLUwI2UUCMQ), for the going train's tooth counts (fusee and centre wheels 90, third 80 with a pinion of 12, fourth 75, the wind indicator wheel 120) and which wheel is which, and for the balance lower bridge's form and heights; BunnSpecial's two-part teardown (https://www.youtube.com/watch?v=Jd2c3x8VKsE, https://www.youtube.com/watch?v=wcYqdgpyggQ) for the bridges and pillars off. Counted with `tools/video.py`. Like the photographs, they are a source of truth.
- The photographed dial above, again: its UP–DOWN scale's ticks, 8 h apart, sweep 315.7° over 56 h; the model's 313.6° comes from the train.

## How the layout was measured

1. **Two photographs.** The manual's Fig. 2 and a near top-down photograph of a 1941 movement. `tools/bundle.py` fits an independent camera to each photo and triangulates the balance, fusee and barrel axes. Point residuals are under 9 px in both photos.
2. **Scale.** Two photographs fix the group's shape but not its size. It was first scaled so the fusee wheel, then taken as 96:14 and 40.87 mm across, stayed inside the 87.57 mm pillar plate (factor 0.955). That wheel is 36.0–36.9 mm across on the side photograph read at the plate's own scale (step 6), and the group's scale and place now come from the real movements instead (step 4).
3. **Mapping the top view.** Using those three axes, a similarity transform maps the top-view photograph into the model, with under 0.4 mm residual (`tools/p3map.json`). The following were traced through it:
   - the bridge outline (radius about 40 mm);
   - the crescent balance cock (`tools/cock_outline.json`), shifted for its height parallax so its endstone lands over the staff. The traced edge passes 0.7 mm from the staff, too close for the upper setting and the endstone cap, so the nose is widened round the cap (see "Estimated"). The outline is the cock's top: the cock is one solid block (C Spinner's restoration video, the cock off at 41:58 and 23:45, in place from the side at 2:36; `References/VIDEOS.md`), its outer wall following the rim the full 14.2 mm down to the train bridge, and only its nose an arm 2.6 mm thick over the balance. The body is all of the outline more than 17.7 mm from the staff, the circle the barrel bridge is cut on; the screw's head lies in a counterbore, and two steady pins go into the train bridge;
   - the barrel bridge's far horn, past the balance on the 6 o'clock side to about 100°, where a cut from the balance's opening to the rim ends it, and its two screws;
   - the barrel bridge's cut round the balance. Its edge, traced on `References/photo-top-view.jpg` through an affine map fitted to five screws on the barrel bridge (within 0.6 mm), fits a circle of r 17.6 about (5.24, 6.33) to 1.3 mm: 2.8 mm off the staff toward the barrel, so it reaches 20.5 mm from the staff on that side. The cut is that circle joined with the balance's clearance circle (r 17.7 about the staff), and the barrel's cap and the fusee's large end show through it, as photographed. On the cock's side the bridge's horn ends against the cock's straight edge, which meets the rim about 5° round from 3 o'clock: with the cock off (6:47) the bridge's edge meets the rim there, and the bridge laid flat (23:30) ends that horn at 2–9°, so the cock stands on the train bridge in the bridge's opening;
   - the setup cover over the ratchet: a waisted plate across the arbor, its ends arcs about 13 mm out, both long sides concave to about 6 mm from the arbor, so the ratchet's teeth show on either side and the click's tip on the rim side (as in Fig. 24 and the 2E12055 photograph). Traced through a fit to its two screws and the arbor; the rim-side edge is an arc within 0.5 mm of the tracing. And the ratchet's size (about 52 teeth, 15.6 mm across);
   - the screw positions;
   - the engraving columns (`tools/engr.json`);
   - the damascene direction. The damascening is on the plates' and bridges' train-side faces only; their undersides, edges and bevels, and the balance lower bridge all over, are plain, as the restoration video shows them (`plainFaces` in `core.js`, which pins those faces' uvs to a ridge's crest).
4. **Placing the group.** From Fig. 107: the wind-indicator wheel sits under the 12, driven from the fusee arbor; the dial's 12–6 axis, the centre, third and fourth arbors, the indicator and the motion work are the dial's and the train's. The photographed group (the balance, fusee and barrel of step 1, and everything traced with them in step 3: the pillars, bridges' cuts and holes, cock, their screws and pins, the engraving, the damascening) is taken into that frame by one similarity (`PT` in `movement.js`: ×1.039, turned 19.42°, shifted (−3.891, 0.879); `L` holds the results), fitted so its three arbors land where the real movements measure them (IDEAS.md 1.12; `Review-results.md` 22):
   - the balance on its lower cap, read face-on on the train bridge's underside (KLUwI2UUCMQ 13:49.5, `tools/framecam.py`); the upper train bridge's opening has its balance lobe centred 0.6 mm from it (23:30);
   - the fusee 20.4 mm from the centre: the bare plate fitted at 34:30 and 36:15 (`tools/rimfit.py`, 20.2–20.8), the side photograph's fusee wheel at the plate's scale (36.0–36.9 mm across, which with its 90 teeth and the centre pinion's 14 puts it 20.3–20.9 out), and the train bridge's notch round it (20.9); on the angle the dial side gives (43–45° from the indicator's stud, `rimfit_40-08.json`);
   - the barrel at the centre of the train bridge's cut round it, 22.56 mm out (the bare plate: 21.4–23.5).
   All three land within 0.23–0.31 mm: the photographs' own layout holds, at 1.039 times the size it was given (about undoing the 0.955) and set 4 mm off the centre. Outlines that run to the rim keep their radius there (`PTr`), so the bridges' rims stay concentric with the plate. What was measured on the video in the train bridge's own frame (its rim, barrel cut and centre bushing) goes through the 14° turn alone (`PR`): the notch, mouth and end, the opening in the middle, the third screw and its pillar. The escape arbor is solved again from the balance (9.40 mm, the escapement) and the fourth (10.585, their mesh); the escapement's plan and the detent turn with it, about 29° from before.
5. **Hidden wheels.** The third arbor is measured on a restoration video (`References/VIDEOS.md`): on the train bridge's underside (KLUwI2UUCMQ 13:49.5), anchored on five holes that match the model's to 0.2–0.6 mm, its bushing is at (−6.18, 14.75), 16.0 mm from the centre; the bare plate gives 15.7. There the modules, which follow from the arbors' spacing (`MOD`: 0.314, 0.245, 0.249), give the centre, third and fourth wheels the size ratios measured on the video (centre ÷ third 1.43 against 1.36–1.39, centre ÷ fourth 1.48 against 1.48–1.50). It was earlier solved for clearances at 13.05 mm (`tools/solve.py`), where the centre and third wheels came out the same size.
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
7. **Collision check.** `tools/fine.py --hold` runs the same check with the balance locking arm locked and the train-blocking screw down. `tools/dyn.py` with `tools/interference-check.js` checks every closed part at 0.4 mm through a full escapement cycle. `tools/fine.py` checks at 0.05 mm, also at 15 train positions and wind states, and includes the chain and the tube springs; it found four overlaps of 0.1–0.4 mm that the coarser check could not see. Only intended contacts remain, listed with their reasons in `fine.py`. The barrel's wall is an open drum; `fine.py` tests it as the solid it encloses and measures every part's distance to the solid the barrel sweeps: the tightest are the barrel bridge (0.55 mm above the boss), the detent's foot (0.98 mm) and the train bridge's cutout (1.0 mm from the caps' rim). The mainspring stays 1.2 mm off the arbor, 0.6 mm inside the wall and 0.2–0.3 mm from the caps at every wind. The dial face is the one open surface not tested.
8. **Visual check.** `tools/topview.py` renders the model from above and warps it onto the top-view photograph through five barrel-bridge screws: `verification/topview-comparison.png` shows the photo, the model and the two blended. Parts far above or below the barrel bridge (the cock, the balance's endstone) are off by up to about 3 mm there, from the photograph's tilt. The photographed movement has the balance locking arm (Fig. 9), which the model now has too, though its shape is estimated. `tools/p3fit.py` renders from the camera fitted to the photograph the tracing was first done on.

## Estimated, not from the manual

- Tooth counts: the fusee wheel (90), centre wheel (90), third wheel (80) and its pinion (12), fourth wheel (75) and the wind indicator wheel (120) were counted on a restoration video of a 1941 Model 21 (`References/README.md`, "Videos consulted"; `tools/video.py`; IDEAS.md 1.8), not taken from the manual; the escape wheel (16) is Hamilton's. The fourth and escape pinions (10, 10) follow from those counts and a one-minute fourth wheel. The centre pinion (14) is counted on the same video, likely but not certain (end-on at 13:59.5, from above at 35:23.66; no frame shows every leaf); the fusee arbor's pinion (12) is inferred, not counted: 14 makes the manual's 17½ half turns hold its "maximum of 56 hours", and 14 × 12 sweeps the UP–DOWN hand 313.6° in 56 h, against the 315.7° a photographed dial's scale spans. 13 and 13 would fit the dial and the manual's seven half turns a day better, but run 60.6 h. The motion work (12 : 36, 10 : 40) is chosen; the minute wheel looks nearer 55 teeth on the video, too blurred to count.
- Dimensions and positions, estimated from the figures and the dial (95 mm, the side photograph), except where the photographs give them (plan: "How the layout was measured", steps 1–5; heights: step 6).
- Heights the side photograph doesn't show:
  - The train wheels' and pinions' heights within the stack that Figs. 13, 29 and 110 give (third wheel 0.35–1.0 mm above the plate, centre wheel 1.15–1.85, pinions ending at their wheels' bosses), and the bosses' sizes (the centre boss r 1.3, inside the radius the third wheel's teeth leave free).
  - The barrel (13.2 mm tall, from 5.7 mm above the plate, over the third and centre wheels, to 1 mm under the barrel bridge; its chain band runs level with the fusee's cone).
  - The balance rim, 0.4 mm clear of the escape upper bridge. The bridge's two screws have low heads (0.3 mm), 0.14 mm clear of the rim and the timing weights, which pass over them.
  - The hairspring, 5.9 mm tall, from under the collet to the stud's clamp under the cock.
- The train bridge's cut round the barrel: a 19.2 mm circle that holds the barrel, open to the rim and clear of the centre arbor. Figs. 108 and 110 show its presence; the lower cutout of Fig. 67 follows this circle to 0.7 mm (see the next item).
- The escape upper bridge's sizes and direction. Its form is from C Spinner's video (`KLUwI2UUCMQ` 10:00, from above) and Figs. 84 and 110: a straight bar with round ends across the keyhole, a screw near each end, symmetric about the setting, with a round endstone cap on a boss in the middle. Read off that frame against the end screws' spacing, which the frame's fit gives as 16 mm to about 10 %: the end screws 8.0 mm either side of the jewel, the cap's screws 3.1 mm, the cap r 4.4, the bar 22 mm long and 4.0 wide. Its length lies 68° round from the balance–escape line, to about 10°. Estimated: the bar's thickness (0.9; the real one may be thicker), the boss (flush with the bar here; the real one hangs below it), its steady pins (the parts list's "complete with pins"; not seen, not drawn) and the flat-headed end screws (the real ones sit flush in countersinks). The escape lower and balance lower endstone caps are the same part (42159) and look round too (the dial side at 40:08, the lower bridge's underside at 13:49.5), but are still drawn as small bars.
- The balance lower bridge's outline. It is measured on the restoration video at 13:49.5 (the upper train bridge held underside up with the bridge on it, face-on at 4K) with `tools/framecam.py` (`tools/anchors/lower_bridge_13-49.5.json`): the frame's homography, fitted by `video.py anchor` on the train bridge's rim (r 40.5), its cut round the barrel and the centre bushing (0.2–0.3 mm rms), gives the camera (focal length 6000 px, where the face's two axes come out orthonormal; 5000–7000 move points 0.5 mm or less), and the picked outline goes back at its height: the slab's face 7.9 mm off the train bridge's underside, the lugs' 3.3 (the side views). In the train bridge's frame (turned with the photographed group since the 14° turn: the outline, its circles, the lugs and the screws go through `PT`), the slab is a lens: an outer edge on a circle of r 20.8 (0.2 mm rms over 13 points) round from the 3 o'clock lug past the centre arbor, a flatter convex edge (r 25.7) to the fourth's end, a straight edge across it and a short one to the train bridge's escape lobe, and a concave edge on the lobe's circle (r 7.14 about (13.81, 15.51), 0.04 mm rms; finding 18 under Elsewhere read the lobe at r 7.0 about (12.6, 15.4) from above); a chamfer about 1 mm wide round the convex edges and the end (0.8 in the model, drawn as a step: `LB_LO2` is the underside). The lugs are the video's (their faces traced), the screws at (20.70, 7.23) and (−9.18, 21.87), 33.3 mm apart. Where it differs is round the model's own arbors, which stand off the real ones (on the video the cap is 11.0 mm from the fourth's setting, the model's balance 18.9 from its fourth arbor; `Review-results.md`, "The balance lower bridge", 14): the model's balance is 5.2 mm from the real cap and its fourth arbor 3.8 from the real setting (the fourth doesn't turn), so the slab bulges about 1 mm to keep 1 mm of metal round the cap's counterbore (r 4.3) and the fourth's sink (r 2.7); the model's escape arbor stands 0.5 mm inside the lobe's circle, so the slab has a bite of r 2.4 round it for the pinion to lift out; the third arbor, which doesn't turn either, stands inside the turned slab and has a slot to its edge, 1.0 mm clear; it keeps clear of the far screw's head, and the 3 o'clock lug 1 mm off the escape wheel's tips. The far lug is the video's less where the model's detent (1.0 mm off), the pillar (0.7), a barrel-bridge screw and the balance locking arm's screw and stop pin stand, which on the real movement are elsewhere. The turned detent crosses the slab beside the fourth arbor, so the train-blocking screw keeps a column of its own at (−3.70, 26.50), 4.5 mm from the fourth arbor, with a boss of the slab round it (the video has its dog point 6.9 mm out, toward the far lug). The upper level is 2 mm thick, the steady pins r 0.4; the lower is the 3 mm plate of the side photograph, with the cap's counterbore (r 4.3) and the fourth's sink (r 2.7) 0.4 deep in its underside, so the balance's lower setting, jewel and cap and the staff's lower pivot sit 0.4 mm nearer the train bridge than the slab's underside. The access hole in the pillar plate (RMG No. 4E019) is under the screw at the 3 o'clock end.
- The pillars' profile is measured side-on on the restoration video (KLUwI2UUCMQ 42:56, scaled by the 16.8 mm height, ±0.15 mm): a straight shaft r 2.7 with a collar at each end, the foot r 2.9 over 3.3 mm and the top r 3.3 over 3.4 mm. The barrel pillar is drawn the same way (not measured).
- The train-bridge and barrel-bridge screws. Their positions come from the top-view photograph; the manual gives three screws for each bridge. Which bridge each belongs to is read from the photograph (heads proud of the barrel bridge are its own; heads sunk in clearance holes through it belong to the train bridge, below), from the barrel bridge laid flat (C Spinner 23:30: through holes at pillar 0 and over the train bridge's third screw, a screw hole at pillar 2) and from the movement with the barrel bridge off (BunnSpecial 12:05: the train bridge's screw at pillar 0 in place, nothing at the far horn's screw). The barrel bridge: its pillar screw, one through the train bridge into pillar 2, and one in its far horn at (−11.07, 26.46) into the train bridge. The train bridge: screws into pillars 0 and 1, and a third at (32.25, −10.81), at the end of the tongue beside the notch's mouth, its head sunk flush in the 5.3 mm counterbore the video shows there (23:30, 36:26; the head's size and the counterbore's depth estimated). It was at (29.24, −12.28), from the top-view photograph's five-screw map, which fits the model's own screws and so shares their layout; the train bridge laid flat has no hole there. On the video (36:34) the third screw goes down into a pillar, as the manual has all three (Op. 14); in the model a pillar there would stand 0.6 mm in the fusee wheel, so the screw is threaded into the bridge alone until the fusee's place is settled (`Review-results.md` 21). Figs. 29, 67 and 110 draw three train pillars without fixing their places (`IDEAS.md` 1.2).
- The wind indicator's pinion (see the tooth counts). The hand's sweep, `UD_SWEEP`, comes from the train (313.6° in 56 h); every dial's scale is drawn on it through `UDA` (movement.js), so hand and scale agree. The photographed Hamilton dial's ticks, 8 h apart, give 315.7°.
- The Hamilton dial's proportions. The sub-dial centres are fixed by their arbors (the seconds 23.9 mm from the centre, 0.50 of the dial's radius, 0.52 of its minute track's; the UP–DOWN 23.6), a little nearer the centre than on the photographed dial (about 0.54 of its track's), where the UP–DOWN sub-dial is 1.13 times as far out as the seconds (and 1.12 on the restoration video's dial side). The model can't take that: its indicator wheel, 32.5 mm across (module 0.266, from the fusee 17.6 mm away), would then reach past the mounting ring's bore (40.2), so its centre is 23.6 mm out, 0.3 nearer than before, and the wheel lies between the pillar screws' heads and the hour wheel (open: `Review-results.md`, "Elsewhere", 19). The plate engraving's block is 2.5 mm nearer the rim than on the top-view tracing, to clear the dust-seal flange.
- The stop-bar's size, nose and travel, and the fusee's top: a slotted layer with a groove for the stop-bar spring, and the top plate (r 9.15) with its two screws (at r 7.0, and the steel collar r 2.9 on the arbor over the plate, measured on the restoration video, 13:30; the collar's height estimated). Sec. IV describes the mechanism (the chain bears on one end, the other moves out to the winding stop), not its dimensions. The model's bar lies beside the arbor in a slot open to the rim at both ends (Figs. 12, 28); a nose from its end hangs 1.6 mm proud of the groove's floor in the top turn, 0.7 turn in, through a window in the top rim, and the chain winding over it slides the bar 1.64 mm, so the far end stands about 1.4 mm past the rim, where the winding stop hangs. The spring bears on a tab on the bar's inner side. The groove is led in over 0.12 turn at its start, where the chain leaves the fusee at full wind, and out over 0.04 at its end.
- The shapes of the springs: the winding-pawl springs, the stop-bar spring, the sustaining pawl's spring (a wire round a steady pin in the train bridge) and the setup pawl spring's thickness and height (0.3 and 0.85 mm) and its pins' places: it runs about half a turn round the ratchet at r 10 from two steady pins to the click's back, as C Spinner's video (11:58) and Fig. 108 have it. The setup ratchet's 42 teeth are counted on that video to about ± 2 (`References/VIDEOS.md`), on the pitch radius the top-view photograph gives; the cover's feet are steps under its ends, outside the spring. The setup pawl turns on its pivot screw, put in from under the barrel bridge (Op. 41, Fig. 80), whose end shows in the cover as the top-view photograph shows it. The sustaining spring's travel from loaded to spent (`SMAX`): the fusee wheel's turn in the longer of Sec. IV's 5 to 10 minutes of drive, 9.3°. No wind outlasts it, since model time runs at most 10× while winding.
- The sustaining spring: its band (2.1 mm wide, r 15.8–18.0), its ends and the fusee wheel's recess (wall r 18.0, a raised disc to r 9.3 and a hub) are measured on the restoration video (`References/VIDEOS.md`, 27:26), against the wheel's tips taken as 40.87 mm, and drawn ×`FK` (0.882) like every size read against the wheel; the gap (17° relaxed), the lobes' sizes, which of the fixed end's two holes has the pin, the band's thickness (1.13 mm) and the elevations' heights are estimated. It is pinned to the wheel at one end and to the sustaining ratchet at the other, as the manual has it; loaded, the ratchet's pin closes the gap and the band bows in from the wall, keeping its length.
- The barrel arbor's core (r 1.74) and hook, the barrel wall (0.2 mm thick) and the brace lining it (0.25 mm thick, 40° of the wall), the end plate and taper pin (the plate r 7.0, from Figs. 28 and 69's proportions, with the slot of Ops. 27–29 that the 9.6 mm pin lies in), and the chain's end pin and hook (its nose through a hole 0.7 mm across in the wall, as Figs. 17 and 75 have it; the hole's size and the nose's place, 0.85 mm past the last link, estimated).
- The chain's links: figure-eight plates (Fig. 38) 0.9 mm high and 0.18 thick, three deep along the arbor, riveted at a 1.0 mm pitch. The chain is 660 links, about 26 in with its straight run; one sale listing gives 28.5 in for the Hamilton's.
- The mainspring's length and lie. Its thickness is from the parts list (0.0165 in, 0.419 mm); its length (600 mm) is estimated, filling half the room between the core and the brace, the length that gives the most turns. It lies in two packs, one on the arbor and one on the wall, their coils 0.01 mm apart (the grease), joined by one free turn (estimated). In the model's barrel, on a core of r 1.74 (estimated: the arbor's pivots are r 1.4), that spring takes 7.64 turns from its fewest to its most. The fusee's chain needs 7.07 of them, which leaves a set-up of 0.37 turn and 0.2 turn unused at full wind. The core was r 2.4 (6.53 turns) until the fusee was measured, which needed more chain. The eye in its inner end for the arbor's hook, and the anchor pin at its outer end (the parts list's "complete with anchor pin"), drawn bearing on the brace's leading end, are estimated.
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
  - Simplified: unlocking against the 10° of draw would turn the wheel back a little (recoil, about 0.2° of the wheel); the model's wheel stands until release. Roller shake is equal on both sides, where Op. 84 prefers slightly more on the outgoing tooth. The solver, the mesh and the 2D inset share one tooth outline (`ESC.toothPts`).
- The escapement's parts beyond the plan.
  - The escape teeth: their form follows Fig. 90 and an original wheel photographed in chronometerbook post 30 (a land 0.13 mm wide at the tip, the root circle at 5.5 mm). The undercut of the locking face (the root trails the tip by 0.14 of a pitch, about 16°), the length of the hollow back (0.55 of a pitch) and its curve (meeting the root circle tangentially) are traced from Fig. 90. Fig. 14's cut-away gives the arrangement: the teeth stand the wheel's full thickness on a thin rim and spokes. The plate's thickness (0.5 mm), the rim's width (0.5 mm), the spokes (0.5 mm wide) and the collet (r 1.5 mm) are estimated from the photograph and Fig. 14.
  - The impulse roller's three holes (0.5 mm radius, a quarter turn apart from the jewel, Figs. 14, 61 and 90) and the impulse jewel's section (flat on the impulse face, curved behind, thinning to 0.45 of its width at the ends; "curved side of the jewel", Sec. VII) are estimated in size.
  - The unlocking roller is a collar 1 mm long with its jewel in a slot and a wider slot opposite (Fig. 64); its length and the slots' depths are estimated.
  - The trip spring is a flat strip 0.06 mm thick and 0.3 mm deep, its foot 0.2 mm thick against the angle bracket; both estimated. Its thickness sets where the jewel meets and leaves it, so the settings above were chosen with it: the tip radius `rT` 0.286 and the unlocking jewel at `aD` 269.6° (the jewels 88° apart, as Op. 97 adjusts the drop).
  - The locking jewel's wedge pin (42089, Figs. 57–59), 0.2 mm across, beside the jewel on the side away from the wheel, flush with the block at both ends (Sec. VII).
  - The support block's top face is laid out from Fig. 90, scaled by the 11.3 mm from the point of flexure to the locking jewel (to about 0.3 mm): the screw 3.7 mm from the point of flexure toward the foot, a positioning pin 2.0 mm the other way. The second pin is drawn 2.9 mm nearer the screw than Fig. 90 has it, which would put it past the train bridge's cut round the barrel in the model's place for the block. The pins (r 0.4) stand 1.2 mm into the train bridge; their size and depth are estimated.
  - The block's front is split along its length by a slot open at the stop button's end, as Fig. 90 draws it: the lock-adjusting screw, threaded in the outer part, bears on the strip that carries the button, and its clamp screw crosses the slot into the strip. The slot (0.24 mm), the strip (0.36 mm) and the solid root (0.2 mm) are in Fig. 90's proportions; one drawing, so medium sure.
  - The detent-adjusting screw's head (r 0.9, 0.45 thick) stands 0.3 mm off the block's end and 0.3 mm deep in the slot across the foot, which runs on 0.6 mm past it (Fig. 90's foot runs on about 1.1 mm); sizes estimated. The detent's two steady pins stand 1.2 mm out of the foot, as Fig. 90 draws them.
  - The trip spring's screw: shank r 0.07, head r 0.16 and 0.12 thick, 0.2 mm along the spring's foot, threaded 0.32 mm into the angle bracket's upright leg, which is 0.36 mm thick and 0.4 mm tall; all estimated (on the video the bracket looks taller).
- The balance rim diameter (29 mm), measured on the top-view photograph.
- Where the group's transform (`PT`) and the train disagree, an estimate takes the place (IDEAS.md 1.12): pillar 1, traced at (4.61, 33.53), is pushed 2.3 mm out from the fourth arbor to clear the fourth wheel by 0.5 mm; the train-blocking screw stands 4.5 mm from the fourth arbor at (3.9, 26.15), where it clears the turned detent (the video's place is under it); the balance locking arm swings back over its screw 120° (`ARM_U`), clear of the cock and pillar 1's screw head; the dust seal's screws, the setup cover, click and ratchet keep the photograph's sizes ×1.039 (`PHOTO_K`).
- The rate panel's figures (see "The rate panel" under How the timing works). Sourced: the rate for a full turn (p. 70) and the screws' and weights' masses (parts list). Estimated:
  - The rim's width (1.12 mm), fitted so that the moment of inertia is the 1,140 g·mm² Table II gives (its height, 4.3 mm, is Fig. 3's; its section otherwise estimated), and the arm's section. Each screw's or weight's mass is spread along its drawn cylinder; the rim's holes, the weights' screws and the staff are left out.
  - The thread pitches (0.179 and 0.113 mm), which follow from the moment of inertia.
  - Reading "one full turn of timing weight" as both weights of the pair turned a turn each.
  - The weights' travel, 3 turns either way from the middle position the manual starts them at. At 40 s a turn, that covers the 2 minutes a day that screws and washers leave (Op. 5).
  - The weights' drawn sizes.
  - The washers' outer radius (1.0 mm, under the heads' 1.3) and the screws' masses at the middle of the parts list's ranges.
- The upper train bridge's outline, the crescent of Figs. 29, 67 and 110: the disc of the rim (40.5) less the cut round the barrel (19.2) and the notch round the fusee. The notch, its horn and its mouth are measured on two frames of C Spinner's restoration video (`KLUwI2UUCMQ` 23:30, the bridge lying flat face up; 13:49.5, turned over in the hand), each put on the bridge's face by `tools/video.py anchor` through the rim, the barrel's cut and the centre bushing (0.2–0.3 mm rms on the circles); `tools/train_bridge.py` builds the edge from them. Until October 2026 it was traced on Fig. 67, pushed off the holes and smoothed, which rounded the horn's end. The opening in the middle (two lobes, over the balance and the fourth's setting, and the escape passage) and the straight end past the barrel are traced on 23:30 the same way (`TB_KEY`, `TB_END`); the seats for the escape upper bridge's ends either side of the passage are not drawn (the bar lies on the face). The places of its small holes (pins, the lower bridge's screws) are the model's, not all the video's.
  - Coordinates here are in the photographed group's frame, before the 14° turn (Dial orientation, step 4): the outline is measured against the bridge's rim, barrel cut and centre bushing, so `movement.js` takes it through `PT` with the barrel and fusee.
  - The notch is a circle, r 16.57 about (11.46, −17.47) (32 points at 23:30, 0.12 mm rms; 13:49.5's points within 0.4 mm): sure to about 0.5 mm. Its centre is 2.3 mm from the model's fusee arbor; which of the two is off is open.
  - The horn between the notch and the barrel's cut carries the centre wheel's upper bushing. Its sides are those two circles (both frames, within about 0.6 mm), and it ends in a straight cut across with sharp corners, about 2.9 mm wide and 12.4 mm from the centre: the end only from 13:49.5 (at 23:30 a part lies over it), about 1 mm.
  - The mouth: a sharp corner on the notch's circle at (28.0, −18.7) (both frames, within 0.3 mm), then a straight edge 6.8 mm long that turns into the rim through a round corner of r 6, meeting it at −18.5° (23:30 only, where another part lies near it: about 1–1.5 mm; the edge's last points fit any radius from 5 to 8 mm). The barrel pillar stands in the open notch.
  - Nothing is pushed off the holes: `train_bridge.py` prints the metal left round each. The train bridge's third screw's counterbore keeps 2.6 mm.
  - The keyhole is built from the model's own centres, not traced: the opening round the balance staff and rollers (r 8.0) joined to one round the escape arbor (r 3.0), which the escape upper bridge spans, kept 1 mm off the notch (the video's keyhole leaves 3 mm or more there). Its lobes (one of them under the detent support block's screw) are not drawn.
- The barrel bridge's far horn: past the balance on the 6 o'clock side, round to about 100°, ending in a cut from the cut round the balance (at (−5.45, 21.46)) to the rim. Traced on the top-view photograph through the five bridge screws (about 0.6 mm); C Spinner's video of the bridge laid flat (23:30) agrees to about 2 mm. Its rim is the model's 40.5 mm. Read against the screws, the photograph and the flat bridge put the rim at 34–35 mm, but those screws sit on the pillars, which the bare plate (BunnSpecial 22:00) shows about 1.2 times further out from the centre, against the plate's rim, than the model has them: against the plate itself the rim is 39–40.5 mm (the side photograph's silhouette, 39–39.5), so the rim stands and the pillars' and screws' places are what is off (`IDEAS.md` 1.2, 1.11).
- The barrel bridge's cut round the balance: traced on the top-view photograph, to about 1.3 mm (see "How the layout was measured", step 3). The end of its horn on the cock's side is a straight cut along the cock's traced straight edge, 0.1–0.2 mm off it; the video places it to about 2 mm.
- The balance cock's solid: the body stands outside the barrel bridge's 17.7 mm circle about the staff, and the arm's underside sweeps down into it (41:58, 23:45) as a quarter-circle cove from 9 mm round the staff, flat at 2.6 mm within it, to 7.6 mm under the top at 17.7 mm, 1 mm over the balance's top, where a vertical wall goes on down; the cove's size is estimated. The concave edge is one smooth curve from the nose to the horn's tip, fitted to the traced points (within 0.43 mm); the counterbore (1.5 mm, as deep as the screw's head) and the two steady pins' places (where the train bridge shows two plain holes under the cock with it off, 6:47, placed to about 2 mm) are estimated. The walls are drawn plain, as the video shows them polished; the top keeps the plates' damascening.
- The balance cock's nose and its endstone cap. The top-view photograph gives the cap's place, width and screws to about 0.3 mm: a steel plate 4.6 mm wide lying along the cock's straight edge, its two screws 2.75 mm either side of the staff, the cock's metal all round it. C Spinner's video gives its form, close (5:51 and 42:03, 42:08 on the cock, 41:58 off it; `References/VIDEOS.md`): symmetric about the staff, 7.2 mm long (to about 0.3 mm, scaled by the screws and the cone), its corners rounded r 1.2 at the nose's end and r 0.4 at the foot's (about 0.3 mm), the screws' heads (r 0.7) sunk flush in counterbores, and a polished conical oil sink 3.1 mm across (two thirds of the plate's width in each view; on the 1941 movement of the top-view photograph it looks nearer 2.2 mm) down to the endstone, set from below in its setting (42155), which shows on the underside as a ring about 3.4 mm across. The plate's thickness (0.7), the counterbores' depth (0.4) and the stone's size (r 0.95) are estimated. On the real cock the cap ends at the nose's end (within about 0.3 mm); the model's nose runs on about 1.2 mm past it. The tracing, taken through the plate-height mapping and shifted for parallax, puts the nose's edge 0.7 mm from the staff and leaves the cap and one of its screws over nothing, so the nose is widened to the hull of the cap with 0.9 mm to spare, joined to the traced straight and concave edges. The manual's drawings show the setting inside the cock's nose and the cap on it (Figs. 19, 85). The settings' and jewels' sizes are estimated.
- The collet and stud: their outlines and sizes, and the stud's direction.
  - The collet's plate is a 130° sector 3 mm in radius with a tongue out to the clamp, and a hub 1.15 mm in radius (Figs. 5 and 6 show the shape, not its size). Its counterpoising is not modelled.
  - The stud is a bar 5.7 × 1.6 × 0.5 mm, running from over the spring's end along the cock toward the cock screw; the stud screw is 7.6 mm from the staff and the steady pin 5.6 mm.
  - Both ends of the spring are 3.6 mm from the staff, in the stud's direction when the balance is at rest.
- The centre of the dial. Sourced: the order of the parts and how they fit (the cannon pinion a friction fit on the centre arbor, Op. 58; the hour wheel free on the cannon pinion, Op. 59; the hour hand broached round onto the hour wheel's pipe and the minute hand broached square onto the cannon pinion, Op. 64; the key on "the bright, square arbor at the center of the dial", Fig. 8). Estimated: the sizes.
  - The hand-setting square is the cannon pinion's squared end, 2.4 mm across, as the fusee arbor's square, since the one key fits both (Fig. 8), standing 1.6 mm proud of the minute hand's collet, as the fusee's square stands (the side photograph suggests about 2 mm).
  - The cannon pinion's pipe is r 1.7, as the square's corners need, since the hour wheel goes on over the square; the hour wheel's bore is r 1.75 and its pipe r 2.3, through a dial hole of r 2.5.
  - The hour hand's boss is r 2.9, its collet r 2.7 and 0.6 mm deep under the blade (clear of the seconds hand's tip, which reaches r 2.9 at :00); the minute hand's boss and collet are r 3.2, the collet 0.8 mm deep over it (the dial photograph shows one round boss about 7 mm across). The hour hand is 1.9 mm and the minute hand 2.45 mm above the dial's seat, the minute hand on the cannon pinion's shoulder. The hands are drawn for a 4 in dial and scaled to the 95 mm one.
- The gimbal latch's geometry. Sourced: its parts and how they go together (Fig. 106, parts list): the support bracket screwed into the corner from outside the box with washers under the screws' heads, the lever turning on the knurled clamping screw, which goes down through the clamping bracket and the lever into the support bracket, the take-up spring on its two screws, the handle, the keeper on the case on its separating washer and screw, and the slot in the ring the lever passes. Estimated: the brackets' shapes and sizes, the take-up spring pressing up on a collar under the lever, the lever at the height of the ring's pivots swinging 45° between the right wall and the keeper; the slot is 7.3 × 4.4 mm; the keeper is a back and two cheeks.
- The gimbal pivots (Fig. 106, Sec. III, Op. 104): each ring pivot screw in through the box side, its washer under the head outside and its lock nut inside against the wall, its point (r 0.8) in a bushing (42214) in the ring at 9 and the support strap at 3; each case pivot screw threaded through the ring (and at 6 the case support strap), locked by its nut, its point in a bushing in the case bracket. The straps are curved to the ring, the case brackets flat-backed on the case; sizes estimated.
- Pivots and jewels (sizes estimated; the manual gives the jewels' kinds, Sec. II, and the endshake, Ops. 15, 69, 74): every jewelled or bushed arbor is turned to pivots with shoulders: balance and escape r 0.2 in olive-hole jewels (hole 0.22), fourth and third r 0.25 in bar-hole jewels (hole 0.27), third upper r 0.3 and centre r 0.5 in bushings bored 0.02 over, sustaining pawl r 0.5 in the bridge and plate. Endshake 0.05 mm on each: at the endstones for the balance and escape arbor, at the shoulders for the others. The lower train bridge's settings go through the bridge; the endstones are set flush in their caps.
- The barrel's cap screws go into a lip inside the barrel's rim at its plate end (r 12.9-13.3, 0.5 thick), five at 115° + 72° k, clear of the brace (Fig. 109 draws the screws at the cap's edge; the lip is estimated).
- The dust seal's inside: a chamber holding the seal ring (42052) on the arbor's square end, pressed against its top by the helical seal spring (42053); sizes estimated.
- The fusee arbor's collar (r 2.7, from the fusee's large end to the end plate) and the bores on it (r 2.75: the winding ratchet's, the sustaining ratchet's web and the fusee wheel's) are measured on the restoration video (28:08–28:35, 27:26; ±0.3 mm), against the wheel, so drawn ×`FK`. The end plate is cut to r 5.6 to clear the centre wheel's teeth, which run at its height (Figs. 28 and 69 draw it about r 6.7). The sustaining ratchet runs free on the collar on a web 0.3 thick below the heads of the winding ratchet's screws, which turn round in its open centre while the key winds (Fig. 109; the web is estimated).
- The dial's four feet and screws (Fig. 107, parts list: 4): feet down into the mounting ring's flange, 45.9 mm out, screwed from the flange's train side; two where the top-view photographs show them (38.5° and 111.6°), the other two opposite them (a straight-down photograph of serial 623 shows four such screws near the plate's edge).
- The mounting ring's bore (r 40.2, the dial-side photograph) and the tabs inward under its three screws; the alignment pin's place (12 o'clock) and size, and its slot in the case.
- The case's sizes: the recess round its top fits the ring's flange (r 48.0, 0.05 mm clear) on a shoulder 0.9 mm wide, outside the dial screws' heads, the rim 105 mm across (the top-view photographs), the wall 2.4 mm below the shoulder, the floor 64 mm down (2 mm shallower than it was, so the shield plate's screws clear the box's felt), and the bezel's section, rising to hold the crystal clear of the hand-setting square. The gimbal ring is r 66–68, from the top-view photographs. The box stays 7¾ in; in the 2E12055 photograph the gimbal ring's pivot nuts sit nearer the box's walls than the model's, so the box may be narrower.
- The trip spring bracket's screw (1770) along the bracket's leg into the cross-piece, and the trip spring's foot under the head of its screw; the hairspring stud a bar tapped for its screw, its steady pin through it into the cock; the locking arm's stop pin pressed into the train bridge; the winding stop's thread 2 mm into the barrel bridge; the balance screws' threads in the rim; the timing and vernier weights nuts on their screws. Positions and sizes estimated.
- The case's winding-hole shield plate. Sourced: its parts (plate, shoulder screw, stop screw, return spring; parts list) and their arrangement in Fig. 107: a disc nearly the size of the case's flat bottom with three holes (the shoulder screw's at its centre, the key's, the stop screw's on the other side), and the return spring an open ring with a hooked end, between the plate and the bottom, the stop screw going up through the plate and the hook; its action, turned clockwise, seen from below, until its hole lines up with the case's, and returned by the spring (Sec. III, Fig. 7). Estimated: everything else.
  - The plate 36 mm in radius and 0.8 thick, 0.5 mm below the bottom, turning on the shoulder screw at the case's centre through half a radian.
  - The stop screw, fixed in the case 17 mm from the centre opposite the key hole, runs in an arc slot in the plate, whose two ends set the rest and open positions (Fig. 107 draws a round hole; the parts list names no other stop).
  - The spring's ring (wire r 0.18) runs the long way round inside the stop screw, its other end turned in to a pin in the plate 4.5 mm from the centre; it is rebuilt as the plate turns.
  - The case bottom is 1 mm thick.
- The screws' shanks: a thread of half the head's diameter (0.8 mm for the cock screw, 0.07 mm for the trip-spring screw in the bracket's thin leg), drawn as turned rings, and each one's length. The parts list gives the screws, not their threads or lengths. The cock screw sits 0.3 mm off its traced position (within the tracing's 0.4 mm) so its thread cleared the edge of the foot the cock was once drawn on.
- The lower train bridge's sizes: a bar 6 mm wide and 1.2 thick, reaching 21 mm past the third arbor and 14 past the fourth, its screws 14 and 9 mm past them and its steady pins 10 and 5 (the screws about 2.9 times as far apart as the settings, measured on Fig. 31 and the dial-side photograph, whose perspectives err opposite ways), and the opening in the plate under it, r 6 about the third arbor.
- The minute wheel's place: at 3 o'clock, 9.6 mm from the centre (the dial-side photograph puts it there, 10.5 mm out, and Fig. 107 draws it on that side of the hour wheel); the distance is the motion work's counts'.
- The teeth's profiles: cycloidal clock teeth in BS 978 Part 2's proportions (the manual gives no profiles): a wheel's tooth 1.41 module thick at the pitch circle with radial flanks and an epicycloidal addendum capped at 1.15 module, a pinion's leaf 1.05 module thick with a round tip, both 1.3 module deep.
- The pillar screws from the dial side (four), the mounting ring's three screws' places other than the one at 6 o'clock (the screws go in from the train side, through the plate into the ring, as reassembly Op. 1 and Fig. 29 have them; the top-view photographs show the 6 o'clock one on the plate at the rim, half under the train bridge: 40.6 mm out at 100°, the others at 210° and 340°), the dial screws (one into each foot), and the posts of the minute and wind indicator wheels with their screws from the train side. The parts list and Figs. 107 and 110 give the parts, not their sizes or positions.
- The endstone caps (escape upper and lower, balance lower): a steel plate 1.3 mm wide over the setting, its screws 2.1 mm (1.9 mm on the balance lower bridge) either side of the arbor.
- The balance's hub, cap and hold-down screws (Fig. 4): a flange 0.6 mm thick under the arm, a boss through it, a cap 0.35 mm thick, screws 1.7 mm from the staff. The balance's moment of inertia counts them in place of the old hub.
- The train-blocking screw (Sec. II, Fig. 110): its size (head 1.7 mm, thread 0.84 mm, dog point 0.5 mm) and 5.6 mm travel; the wall round it (bored r 0.95 down to the seat 0.6 mm into the bridge's top: the section gives the arrangement, not the sizes) and the access hole in the train bridge (r 0.72). Its place, 5.0 mm from the fourth arbor, is a countersunk hole on the top-view photograph, to about 1 mm.
- The balance locking arm's sizes (Fig. 9 shows it curved, its screw outside the rim and its end at a timing weight; Sec. X: "place the locking arm over the timing weight"): a strip 1.0 mm wide and 0.45 thick, bowed 0.6 mm, turning 90° on its screw 20 mm from the staff in the open 6 o'clock sector of the train bridge (at 18° from the timing weight, just clear of the barrel bridge's far horn), with a round finger 1.65 mm tall at its end. Locked, the finger stands 15.6 mm from the staff on the counterclockwise side of the timing weight that rests on the 6 o'clock side (0.02 mm clear), and a balance screw stops the balance 39° the other way; the top-view photograph shows the arm's end beside a timing weight on that side. Unlocked, it lies turned out against its stop pin, clear of the balance.
- Stopping and starting: the balance's free run-down (1/e in 25 s), the arm's braking (0.2 s), the twist's swing (160°) and the build-up to 255° (3 s). `ESC.AMIN` is worked out from the escapement.
- The sustaining pawl's position: 21.35 mm from the fusee axis, where the pawl reaches the sustaining ratchet and its arbor can run from the pillar plate to the train bridge clear of the centre wheel and of the fusee wheel's teeth.

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
(`runs`, `why`), and the tool then exits with 1. To try a setting before editing, pass it on the command line,
for example `node escapement.js rT=0.29`. Record the results in the escapement
entries under "Estimated, not from the manual". The essay's detent figure and
the figures in its text (lock, let-off, drop, overall, shake, horn clearance) read
the model's own `ESC`, so they follow the change. `node escapement.js`
exits with 1 when a figure is out of tolerance.

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
