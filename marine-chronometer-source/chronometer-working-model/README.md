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
at the repository root instead: it also rebuilds the essay, refreshes the root
copies and assembles the website (see the root README).

## Files

| File | Contents |
|---|---|
| `index.html` | Page markup: the stage with its 3D model / Illustration tabs, walkthrough card, controls (View, Time, Winding and Display, open by default, and Parts, Rate and timing weights, Stopping and starting, Cross-section and Variants, closed; every section folds, and each viewer's open ones are remembered in `localStorage` as `cm-open`), the About dialog with sources and method |
| `css/style.css` | Layout, theme tokens (light and dark), controls, labels |
| `img/illustration.webp`, `img/illustration-ink.webp` | The overview drawing shown in the Illustration tab, tinted and in ink (Tinted / Ink under it, remembered in `localStorage` as `cm-set.fig`), rendered from the model by `tools/illustration.py` |
| `js/core.js` | Math helpers, materials and procedural textures (plate striping, wood grain, engraving), gear / hairspring / hand / mainspring geometry, dial artwork, cross-section shader patch, the tinted and ink drawings (`drawOf`, `makeInk`) |
| `../shared/escapement.js` | The detent escapement's solver, `makeEsc(settings)`, shared with the essay's detent figure and `tools/escapement.js` |
| `js/movement.js` | The movement: layout constants, the escapement (`ESC=makeEsc(...)`, with the centre distance from `L`), screw positions and holes, pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, train-blocking screw and balance locking arm, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate that turns to admit the winding key), winding key |
| `js/app.js` | The parts registry (`PARTS`: every part's name, description, part numbers, group, colour and flags), renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, stopping and starting (the balance's amplitude, the locking arm, the train-blocking screw, the twist), and the animation loop |
| `build.py` | Inlines the CSS, JS, image, three.js and fonts into `dist/` (through `inline.py` at the repository root) |
| `dist/chronometer-working-model.html` | The built single file (committed) |
| `tools/bundle.py`, `tools/fit.py`, `tools/unproj.py` | Photo fitting: camera fits to the Fig. 2 and top-view photographs, triangulation of the balance, fusee and barrel axes, photo points projected onto the movement (see "How the layout was measured") |
| `tools/solve.py` | Places the arbors from the measured positions and the centre distances the wheels need (no browser) |
| `tools/p3map.json`, `tools/cock_outline.json`, `tools/engr.json` | Traced from the top-view photograph: its mapping into the model, the balance cock's outline, the engraving columns |
| `tools/dyn.py`, `tools/interference-check.js` | Voxel collision check through a full escapement cycle |
| `tools/views.py` | Before/after renders of every view (frozen, labels hidden), a pixel diff between two runs, and close-ups of chosen parts |
| `tools/maintaining.py` | The maintaining work over run and wind cycles: the sustaining ratchet never turns back, the sustaining spring is loaded in running and only relaxes while winding, the fusee catches forward when the key lets go, the pawls sit on their teeth, and the stop-bar meets the winding stop at full wind |
| `tools/fine.py`, `tools/fine-interference.js`, `tools/barrel-clearance.js` | Fine (0.05 mm) collision check through the escapement cycle, round the train and over the wind, against a table of expected contacts; the barrel's margins and the mainspring |
| `tools/audit.py`, `tools/geometry-audit.js`, `tools/geometry-audit-box.js` | Geometry audit of the movement (and, with `audit.py box`, the box and gimbals): overlapping or unsupported screws, loose arbor ends, coplanar faces, isolated parts |
| `tools/exploded.py`, `tools/exploded-check.js` | Exploded-view clearance: every part and screw, taken as it stands assembled, against every other, at every spread from 0 to 100 % (none may meet at full spread, or pass through another on the way), over escapement phases, train positions and the wind |
| `tools/solids.py`, `tools/solids-check.js` | Solid geometry check: every mesh closed (no open edge), consistently wound and not inside out, but the decals and surfaces flagged as such; loaded as it is and with Moving parts only and a section on |
| `tools/placements.py` | Every mesh's position and bounding box in seven model states (escapement phases, train and wind positions), and a diff between two runs or two copies of the page: proves a change moved only the parts it meant to, and that the mechanism moves as before |
| `tools/escapement.js` | Measures the escapement against the manual's adjustment figures (Node.js, no browser) |
| `tools/invariants.py` | Checks the model's arithmetic: hands against the time, the wind indicator's scale, the fusee's 60 h and 17½ half turns, the balance's moment of inertia and the rate for a turn of the weights (exit code 1 on a failure) |
| `tools/smoke.py` | Loads the model and clicks through every control (views, walkthrough, variants, sections, time zone, keys, a URL-hash link), then scrolls the essay; fails on any console error or warning |
| `tools/p3fit.py` | Renders the model from the top-view photograph's camera |
| `verification/lower-bridge-comparison.png` | The balance lower bridge side by side with the manual's Figs. 29, 30 and 110 (the exploded view from a camera fitted to Fig. 110's projection, the underside, the section through the train-blocking screw) |
| `tools/lower_bridge.py` | Lays out the balance lower bridge's upper tier (Figs. 29, 30, 110) round what it must clear, reports the clearances, prints `LB_UP` for `movement.js` and draws it back on Fig. 110 (no browser) |
| `tools/train_bridge.py` | Traces the upper train bridge's crescent on the manual's Fig. 67 through an affine fit, pushes the notch's edge off the screws and bushings, and prints `TB_EDGE` for `movement.js` (no browser) |
| `tools/topview.py` | Renders the model from above and warps it onto `References/photo-top-view.jpg` through five screws on the barrel bridge: `verification/topview-comparison.png` (photo, model, the two blended) |
| `tools/illustration.py`, `tools/illustration-passes.js` | Draws `img/illustration.webp` (tinted) and `img/illustration-ink.webp` from the model: renders each view's colour, lit shade, normals, depth and part ids in the page, turns them into lines and a tint (or lines alone), and lays out the labelled sheet |
| `tools/social.py` | Renders the 1200 × 630 link-preview images into `site-assets/`, the model on a dark background beside a title column: `social.png` (the model page: the dial in its box, hands at 10:10) and `social-movement.png` (the essay: the moving parts) |
| `verification/` | Reference results: the top-view comparison, the Fig. 2 overlay and its camera fit |

## Controls

Speed: the presets, or any value from 0.01× to 10,000× on the Custom slider or typed in; the space bar stops and restarts. Up to 5× (`REAL_X` in `app.js`) the balance swings as it really does and the escape wheel steps; faster, a real swing would be a blur, so the balance swings at 0.9 Hz with the detent and trip spring still, the wheels turn smoothly, and the HUD adds "balance swing shown slowed". Right-click a part to fade or hide it; right-click empty space to bring hidden parts back. On touch screens a long press (half a second, barely moving) does the same; Android's own long-press `contextmenu` and the page's timer open the menu once between them, and the press never picks.

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
- Winding: Since winding and Wind, and Wind with the key, which turns the fusee half a turn at a time, 17½ half turns from run down (the fusee's 8¾ turns, 60 h of chain), with the plates see-through and the winding stop kept solid. For the last turn the camera closes in on the fusee's top: the chain winds over the stop-bar's nose, and the bar's far end comes round to the winding stop.
- Rate and timing weights: turn the timing or vernier weight pair in or out by eighth turns, up to 3 turns either way from mid-travel. `R.timing(nt, nv)` in `movement.js` moves them and returns the balance's moment of inertia, computed from the balance's geometry and the parts list's masses (930 g·mm² as built). The weights' thread pitch (`R.pitch`) is set so that a full turn gives the manual's figures (p. 70): about 40 s a day for the timing pair and 2.8 s for the vernier pair, which makes the pitches 0.146 and 0.092 mm. The model clock `tSim` then runs √(I₀/I) as fast as real time, so the hands gain or lose; the panel shows the daily rate and what the hands have gained since the weights were moved or the hands set.
- Stopping and starting (and Twist to start under Winding): the balance locking arm (Fig. 9) and the train-blocking screw (Sec. II), and the twist that starts a stopped chronometer. See "Stopping and starting" under How the timing works.
- Parts: every named part by group, to single out (as a tap does) or hide. Display adds a slow turn and an Auto/Light/Dark theme, and Reset display puts every Display box back to its default (See-through to the view's own) and shows faded and hidden parts again, leaving the theme. Save writes the view as a PNG; Link copies the page's address with the state in its hash (without clipboard access it is put in the address bar instead).
- Gimbals latched (Display) swings the latch lever in through the slot in the gimbal ring to the keeper on the case, bringing ring and case level with the box first; latched, they tilt with the box, as Ship motion then shows. Unticked, the lever swings back along the wall and the gimbals are free. A walkthrough step with ship motion releases them.
- Tick sound (Time) is on by default: a click at each beat, while the model runs at up to 1×. Browsers start audio only from a user gesture, so the page makes or resumes its audio context on the first click, tap or key press, and it is silent until then.
- Tinted drawing and Ink drawing (Display; `draw=1` and `draw=ink` in the hash; one at a time) draw the live model as the Illustration tab's two drawings are drawn: `tools/illustration.py`'s `stylize()` done on the GPU, with its numbers except one: the tint is laid lighter (pigment density `INK.wash` 0.75 against `stylize()`'s 1.25), so the live model reads through it.
  - `drawOf(m)` in `core.js` gives each shown material a Phong copy whose output is the tint. It is the albedo lifted toward the paper, the lit value in soft bands, white where metal catches the light. `look()` applies it to whatever a part shows, so it combines with Colour by part, fading and sections. In ink (`INK.ink`) the copy is paper, inked only where its albedo falls under 55 % of the material's median (`inkRef`: the colour times a 48 × 48 sample of the map), which is the printing: the dial's figures. The engravings (`userData.inkDecal`) are ink under their own alpha; a faded part is paper at its opacity. `stylize()` takes the median per mesh over its visible pixels, the live mode per material over its whole map, which comes to the same for the dial.
  - `makeInk(r)` draws the frame. Three scene passes: normals, part ids and 24-bit depth for the solids, then the same for the ghosts, then the tint with the shadows. Two full-screen passes follow: the lines, then the sheet. The sheet lays the tint on paper, true to the lines, and inks with a varying pressure.
  - The tint was once a pen-and-wash wash, laid up to 1.4 px off the lines by a noise field, mottled, pooled at edges, with hatching in deep shade. The offset read as the parts being distorted, so both drawings now keep to the lines and none of these effects is left.
  - Lines fall where depth jumps (0.6 mm + 1.2 % of the distance) or the drawing ends, with lighter ones at creases and between parts.
  - Parts under half opaque (see-through plates, the glass, faded parts) are ghosts, drawn in outline only and lighter.
  - The stage is paper in either theme, the floor shadow is left out, and the plates' damascening is muted.
  - A moving model costs three scene renders a frame instead of one. The shadow map is still drawn once. With the option off, nothing is drawn differently.
  - Known limits:
    - Cost: frames with nothing moving are still skipped, as in the normal rendering. It was measured only in headless Chromium's software renderer (SwiftShader), not on a phone's GPU. The tint's render target is sized when a drawing is turned on and dropped when it is turned off (the others serve Edges too); the pen-pressure noise texture is made the first time it draws.
    - The plates' damascening is kept at 30 % in the tint (`uTex` in `drawOf`). At full strength it read as hatching. The shade is taken before that mix, so a darker stripe never changes a band.
    - The lines are found in screen space, one or two device pixels apart depending on the pixel ratio. Very thin parts far away (screws, pins in the Box view) can be only a line or two wide.
- Edges (Display; on by default, off on phones; `edges=0` or `edges=1` in the hash when it differs from that default) outlines the movement's parts over the normal rendering, so that parts of one finish lying on each other stay apart: the steel winding pawls on the steel sustaining ratchet, for one. It is the drawings' line pass (`makeInk(r).lines()` in `core.js`) laid over the ordinary frame instead of the wash.
  - The thresholds are the drawings': depth jumps, creases, and ghosts in lighter lines. Two things differ. The ids are per mesh, not per part, because a pawl is the same part as the wheel it lies on and less than the depth threshold above it. And the box, case, gimbals and glass (id 0) draw no lines, including where they meet the movement or stand in front of it. The engravings and the floor shadow are left out of the id passes, so an engraving doesn't outline itself on its plate.
  - Cost: the two id passes plus the normal render, three scene renders for a moving frame, as with the drawings; the id passes' shader is trivial. In headless Chromium's software renderer a moving frame took 3–8 % longer at a pixel ratio of 1 and 12–28 % at 2 (Movement and Escapement views). Not measured on a phone's GPU, where the tripled draw calls weigh most; phones start with it off.
  - Memory: `makeInk`'s render targets are the drawing's size only while in use, else 1 px. Edges keeps the normals and ids (4 bytes a pixel, plus 4 of depth) and the lines (4): 12 bytes a pixel, about 23 MB for a 1600 × 1200 drawing. See-through parts add the ghosts' 8, and a drawing the tint's 8 (dropped again when it goes off).
  - With the option off, nothing is drawn differently.
  - The drawings ink their own lines. While one is on, Edges is greyed out and kept, and it comes back when the drawing goes off.
- Remembered in this browser (`localStorage`, each in a `try`): the theme (`cm-theme`), the open panel sections (`cm-open`), and in `cm-set` the plate finish, dial style, balance, the last view and the cards' units. The remembered view opens the page when its link names no view or walkthrough step. Nothing else is kept: a link (the hash) carries the rest.
- Parts: a search box above the list finds parts by name, Hamilton part number (`42087` finds the detent) or words in the source note, every word; `fig 90` finds the parts the manual's Fig. 90 shows (from `figs`, ranges included). Sizes in: mm or inches, the manual's unit, for the sizes on the part cards (remembered in `cm-set`).
- Colour by source (Display) colours each part by where its shape and size mainly come from (`src` in `PARTS`, `SRC`): the manual (green: its figures, parts list or specifications), measured (blue: on photographs, or a real part), solved (amber: placed or sized to fit the rest) or estimated (grey: the manual shows it, not its size or shape). A key under the tabs names the colours; the part's card says what came from where. It and Colour by part exclude each other; `colr=part` or `colr=src` in the hash.
- Labels are off by default (Display turns them on, and the choice isn't remembered). The walkthrough shows the labels of each step's parts regardless.
- The walkthrough sets its own view, speed, Moving parts only, ship motion and gimbal latch for each step. Ending it (Finish, Exit, or anything that leaves it) gives back the viewer's own: the view, See-through, Ship motion, Gimbals latched, the speed, Moving parts only and the motion work, as they were when it started.
- Screen readers: the model's `aria-label` says what the stage shows, the view (`VIEW_DESC` in `app.js`) or the walkthrough step, and Moving parts only, and is updated with it.
- Keyboard and reduced motion: Space stops and restarts, 1 to 9 pick the views (the key for a view that is off, Box or Dial with Moving parts only, flashes its button and says why in the HUD); with the model focused (click it or Tab to it) the arrow keys turn the view, + and − zoom and 0 resets it. With reduced motion set in the system, camera and state moves are instant (as with `?snap`), the walkthrough leaves ship motion off and scrolls without animation, and the page's fades are off.
- Phones: below 600 px wide the part card is a sheet along the bottom of the stage; on touch screens buttons and checkboxes are finger-sized; in landscape with the height under 560 px the stage fills the height and the panel scrolls beside it. On a phone (coarse pointer, screen under 600 px on its short side) the pixel ratio is capped at 1.5 and the shadow map at 1024 px, against 2 and 2048 px elsewhere. A part casts a shadow only when its radius spans 6 texels of the shadow map, which follows the view: far views drop the screws and pins, close-ups keep them. The knurled nuts and the balance rim's holes are each one merged mesh (`mergeGeo` in `core.js`).

## Testing

The page's state is kept in the URL hash, so a link opens the model as it
was: `#view=escapement&speed=0.05&part=det` (a view, speed and picked part; `view=laidout` is the laid-out train), `arm=1` (the balance locked, at rest), `block=1` (the train-blocking screw down),
`#tour=6` (a walkthrough step), `drive=1` (Moving parts only), `draw=1` / `draw=ink` (Tinted / Ink drawing), `edges=0` / `edges=1` (Edges, when not its default), `sec=x:-3.5`, `esc=rT:0.29,aI:185` (the adjuster's bench, where it differs)
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
second instead of every frame. Code that changes the scene without input or a
`look()` call should call `wake()`.

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

## How the timing works

Everything is driven from one model clock `tSim`, in seconds of the time kept (GMT by default, or local time).

Beside it runs the master time `tM`: a perfect clock, standing for the time signal the chronometer is compared with. It runs at the model's speed, also while the chronometer stands, and doesn't follow the weights. The dial error is what the hands show (`dialRead()` in `app.js`: the second hand's time, continuous as a comparator reads it, with the minutes from the minute hand) less `tM`; it grows with the rate, with the time the chronometer stood, and with setting the hands.

- The balance phase is `p = frac(tSim / 0.5)`, one oscillation per half-second.
- `ESC.state(p)` returns the balance angle, detent lift, trip-spring deflection
  and the escape wheel’s progress through its current tooth.
- Escape wheel position is `E = completed oscillations + progress`, counted in
  teeth. Every other arbor is a fixed ratio of `E`. The hands therefore advance
  in half-second steps, as the manual states (Sec. IX, p. 66).
- The fusee and chain follow the hours since winding: one fusee turn per 96/14
  = 6.86 hours. The model runs down after 60 h (`RUN_H`, the fusee's 8¾ turns),
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
- **The balance is probably heavier than drawn.** With the parts list's masses
  the moment of inertia is 930 g·mm². Table II gives a second estimate:
  replacing a pair of 0.100 in screws with 0.080 in ones changes the rate by
  about 16 minutes a day (the model gives 22.6), and 0.100 in to 0.050 in by
  about 43 (the model gives 55.6, going to the 0.049 in screws). Both imply
  about 1,100–1,300 g·mm², so the rim's section (1.4 × 2.4 mm, estimated) is
  likely too light. The drawn balance-screw heads are also too small. They
  are 1.5 mm across, but screws of 125–255 mg with those head heights need
  heads of about 3–4 mm, which is closer to what the photographs show.
- **Changing the balance changes the pitches, not the rates.** A heavier rim
  or larger screws raise `I₀`; `R.pitch` follows, and a turn stays 40 s and
  2.8 s a day.
- **Check clearances after any change to the balance.** The balance runs in
  the barrel bridge's 17.7 mm cutout, at the bridge's own level. The weights'
  screw tips reach 17.35 mm from the balance axis, and the 0.101 in screws
  17.07 mm. `dyn.py` tests only mid-travel, so also run it with the weights at
  both ends of their travel: call `__mv.userData.R.timing(3,3)`, then
  `(-3,-3)`, after the page loads (`python fine.py --eval "__mv.userData.R.timing(3,3)"` does this). `dyn.py` ignores balance–cock overlaps
  (`IGN`). The cock foot is 20.7 mm from the balance axis.
- **`audit.py` lists the weights' screw tips as loose ends.** They stand
  beyond the nuts, as in Fig. 3, and are expected.

## Sources

- *Manual for Overhaul, Repair and Handling of Hamilton Ship Chronometer*, NAVSHIPS 250-624, Bureau of Ships, 1948. Used for:
  - the structure: pillar plate, barrel bridge, upper and lower train bridges, balance lower bridge, escape upper bridge. The lower train bridge is screwed to the dial side of the pillar plate (Figs. 29, 67, 110);
  - the maintaining work and the winding stop-bar (Sec. IV, Figs. 12, 28, 69–74, parts list Fig. 109): the fusee's winding ratchet with its two screws; the sustaining ratchet wheel, free on the arbor, with two winding pawls, their springs and four screws; the sustaining spring in the fusee wheel's recess; the end plate and taper pin; the stop-bar in a slot in the fusee's top with its spring, under the top plate and its two screws; the winding stop screwed into the barrel bridge; the sustaining pawl on its arbor with its spring;
  - the upper train bridge leaving the fusee's top open to the barrel bridge, which holds the fusee's upper bushing (Figs. 24, 29, 67, 77; parts list 108-45);
  - the barrel's inside (Figs. 26, 75): the arbor's core with its hook for the mainspring, and the brace lining the wall; the chain hooked to the barrel and pinned to the fusee (Figs. 26, 28); the setup pawl spring (Figs. 17, 24, 80);
  - the detent escapement. Its layout comes from the plan view, Fig. 90: the detent lies at 68° to the line of centres, with 11.3 mm from the point of flexure to the locking jewel, and the trip spring is 7.9 mm long, 2.3 mm to the side, on the line through the balance staff;
  - the detent's construction, from Figs. 14, 54–60 and 110 and the parts list. The detent is beryllium copper with a two-strip detent spring and a round locking jewel with a flat. The trip spring is Elinvar, on an angle bracket. The support block hangs from the upper train bridge and carries the stop button, lock-adjusting and detent-adjusting screws;
  - the escapement's adjustment figures (Sec. VIII, Ops. 76–97): roller shake about 0.002 in (Op. 84), lock about 6° (Op. 85), let-off at least 6° (Op. 86), overall 26–30° (Op. 87), horn clearance about 0.010 in (Op. 88) and drop about 2° (Op. 97). The teeth drop into the large portion of the impulse roller's crescent and never enter the small portion (Ops. 76, 83). The wheel is centred on the impulse jewel (Op. 82);
  - the impulse roller, 0.249 in (6.32 mm) across (parts list, p. 82). Variants of .250–.253 in exist to set roller shake;
  - the balance and hairspring. The balance carries 10 screws in diametric pairs, 6 of 0.049 in, 2 of 0.080 in and 2 of 0.101 in head height, plus 2 timing weights (93 mg) and 2 vernier weights (10.5 mg), each a nut on a screw in one of the rim's holes (parts list, p. 82; Fig. 3);
  - the barrel cap with its five screws on the pillar-plate end (Figs. 26, 109), and the dust seal with three packing rings around the fusee arbor (Fig. 24);
  - the gimbal mounting (Figs. 1, 94, 106): a flat ring hung on two pivot screws through the box sides (washer inside, lock nut outside), the case hung in it on front and rear pivot screws into brackets on the case, support straps at 3 and 6, the gimbal latch at the front right (a lever on a support bracket, through a slot in the ring to the keeper on the case: Fig. 106 and the parts list) and the key at the back right;
  - every part in the parts lists of Figs. 106–110, checked one by one (`Review-results.md`, "Every part against the manual"); among them the pillar, mounting-ring, dial and post screws, the endstone caps and settings, and the barrel and fusee upper bushings;
  - the balance's hub, cap and hold-down screws (Fig. 4), the balance wheel locking arm with its screw, washer and stop pin (Sec. III, Fig. 9; parts list 108-31 to 108-34), and the train-blocking screw (Sec. II, Fig. 110): threaded through the balance lower bridge's lobe, which rises in a column to the train bridge's underside as the figure's section draws it; screwed down between the fourth wheel's spokes, its head on the seat at the bottom of the column's bore, the chamfer seating in the train bridge's access hole when raised, with the slotted spigot above the head standing in the hole;
  - the balance lower bridge (Figs. 29, 30, 110; Ops. 11, 12, 50; parts list 110-27, 110-20): a stepped block whose upper tier lies against the upper train bridge's underside, held by two screws 42055 put in from below (the figures draw them head down under the bridge; Op. 12 screws it to the upturned train bridge, Op. 50 takes the screws out once that bridge is off), with steady pins; the lower tier carries the balance's lower setting and endstone cap and the fourth wheel's upper setting;
  - the balance upper setting and jewel, pressed into the cock under the endstone cap and its two screws (Figs. 19, 36, 84, 85; parts list 42162, 42160), and the staff's pivot in it;
  - the hairspring's collet and stud (Sec. II; Figs. 5, 6, 19, 84, 85): the collet slotted to grip the staff, with a flat plate whose tongue carries a clamp and wedge pin for the spring's inner end; the stud under the cock, held by the stud screw from the cock's top and a steady pin, holding the upper end the same way;
  - the hand-setting square at the centre of the dial, which takes the winding key (Sec. III, Setting; Fig. 8): the cannon pinion's squared end, with the minute hand broached square on it and the hour hand pressed on the hour wheel's pipe (Sec. VIII, Ops. 58, 59, 64);
  - starting: a detent chronometer is not self-starting, and is started with "a single quick twist" of its box (Sec. III);
  - the dial markings, winding figures and part numbers. The UP–DOWN scale runs clockwise round the bottom of its sub-dial from UP (upper right) to DOWN (upper left), so winding turns the hand counterclockwise back to UP (Fig. 107, Sec. III).
- New-old-stock Hamilton Model 21 pillar plate listing: 87.57 mm diameter, 3.86 mm thick.
- Royal Museums Greenwich, Hamilton Model 21 No. 4E019 (https://www.rmg.co.uk/collections/objects/rmgc-object-387425): "a large hole in the pillar plate for access to one of the lower balance bridge screws to enable removal of the bridge without dismantling the sub-frame". The model has that hole under the screw at the end of the bridge's arm.
- chronometerbook.com, post 4: W. Rawlings' plan of the Model 21 escapement, a redrawing of the manual's Fig. 90, and a photograph of a Model 21 detent.
- chronometerbook.com, post 30: escape wheel specification of 16 teeth, 13.14-13.18 mm diameter, 1.27-1.32 mm thick and no wider than the impulse roller; the locking jewel set at 8-12° of draw.
- The manual's Fig. 2 photograph (layout) and Fig. 107 (dial side, wind-indicator wheel).
- A photographed Model 21 dial of the U.S. Maritime Commission contract (the Hamilton dial's layout, inscriptions and hands) and a photographed movement, serial 2E12055 (the plate engraving's text and layout, and the serial used on the plates and dial). Both are in `References/`.

## How the layout was measured

1. **Two photographs.** The manual's Fig. 2 and a near top-down photograph of a 1941 movement. `tools/bundle.py` fits an independent camera to each photo and triangulates the balance, fusee and barrel axes. Point residuals are under 9 px in both photos.
2. **Scale.** The fusee wheel is fixed at 96:14 by the manual's winding figures and must stay inside the 87.57 mm pillar plate. The two-view result is scaled to meet that (factor 0.955).
3. **Mapping the top view.** Using those three axes, a similarity transform maps the top-view photograph into the model, with under 0.4 mm residual (`tools/p3map.json`). The following were traced through it:
   - the bridge outline (radius about 40 mm);
   - the crescent balance cock (`tools/cock_outline.json`), shifted for its height parallax so its endstone lands over the staff. The traced edge passes 0.7 mm from the staff, too close for the upper setting and the endstone cap, so the nose is widened round the cap (see "Estimated");
   - the barrel bridge's cut round the balance. Its edge, traced on `References/photo-top-view.jpg` through an affine map fitted to five screws on the barrel bridge (within 0.6 mm), fits a circle of r 17.6 about (5.24, 6.33) to 1.3 mm: 2.8 mm off the staff toward the barrel, so it reaches 20.5 mm from the staff on that side. The cut is that circle joined with the balance's clearance circle (r 17.7 about the staff), and the barrel's cap and the fusee's large end show through it, as photographed;
   - the setup cover over the ratchet: a waisted plate across the arbor, its ends arcs about 13 mm out, both long sides concave to about 6 mm from the arbor, so the ratchet's teeth show on either side and the click's tip on the rim side (as in Fig. 24 and the 2E12055 photograph). Traced through a fit to its two screws and the arbor; the rim-side edge is an arc within 0.5 mm of the tracing. And the ratchet's size (about 52 teeth, 15.6 mm across);
   - the screw positions;
   - the engraving columns (`tools/engr.json`);
   - the damascene direction.
4. **Dial orientation.** From Fig. 107: the wind-indicator wheel sits under the 12, driven from the fusee arbor.
5. **Hidden wheels.** The third-wheel position and per-stage modules (0.29, 0.30, 0.3113) are solved so every arbor clears every wheel, the barrel and the pillars.
   - The escape wheel sits 9.40 mm from the balance. There the 0.249 in impulse roller clears the teeth either side of it by 0.002 in (roller shake, Op. 84), and the teeth dip into its crescent (Ops. 76, 83).
   - An earlier scaling of Rawlings' drawing gave 10.2 mm. Readings of the drawing vary with the feature used for scale; the manual's specifications fix the distance.
   - The escape arbor keeps its depth with the fourth wheel: that stage's module, 0.3113, fits the 10.585 mm centre distance the escape wheel's position leaves.
6. **Heights.** A side photograph of an unmounted movement is scaled by the pillar plate's 3.86 mm edge (75 px; the plate's width gives the same scale to 2 %). On it, in mm above the pillar plate:
   - The pillars are 16.8 tall, the train bridge 3.1 thick, and the barrel bridge 3.4 thick on top of it.
   - The cock foot stands 14.2 tall on the train bridge.
   - The fusee cone spans 6.7–15.8, which the model matches. Its profile is measured on the same photograph, scaled by the fusee wheel's tips (40.87 mm, 16.98 px/mm) about its axis: the groove's floor on the eight upper turns is 8.33, 8.54, 8.95, 9.54, 10.19, 11.07, 12.16 and 13.81 mm, the flanges standing about 1.25 mm over the floor of the turn below them, the top 9.3 and the base flange 18.3. `r0/√(1−a·m)` fits those floors to 0.085 mm rms (r0/(1−a·m), the old form, to 0.21): 7.95 mm at the small end and 16.8 at the large. That is the fusee for a pull falling in step with the barrel's turns, as a mainspring's does. Fig. 28 draws the same proportions.
   - The escape wheel runs 0.9 below the train bridge.
   - The escape pinion meshes with the fourth wheel 3.6 above the plate, and a large wheel runs lowest, at 0.4–1.6. That is the centre wheel, which must pass under the fusee wheel and the barrel. The escape pinion runs from the fourth wheel down toward the plate (2.1–4.1), clear of the third wheel just above.
   - A 3 mm plate at 7.9–10.9 is taken to be the balance lower bridge's lower tier (its upper tier lies against the train bridge). It also carries the fourth wheel's upper pivot, and the train-blocking screw reaches down from it to the fourth wheel's spokes (Sec. II).
   - Fig. 2 and Fig. 109 show a tall barrel that rises past the train bridge to the barrel bridge, and Figs. 108 and 110 show the train bridge cut round it.
   - The plan positions (`L`) were fitted before the re-stack, with the old heights, which `bundle.py`, `fit.py` and `unproj.py` still use. They were not re-fitted.
   - Re-running `bundle.py` with the new heights puts the fusee and barrel axes within 0.8 mm of `L` and the balance within 2 mm. That is about the run-to-run spread of its random restarts.
7. **Collision check.** `tools/fine.py --hold` runs the same check with the balance locking arm locked and the train-blocking screw down. `tools/dyn.py` with `tools/interference-check.js` checks every closed part at 0.4 mm through a full escapement cycle. `tools/fine.py` checks at 0.05 mm, also at 15 train positions and wind states, and includes the chain and the tube springs; it found four overlaps of 0.1–0.4 mm that the coarser check could not see. Only intended contacts remain, listed with their reasons in `fine.py`. The barrel's wall is an open drum; `fine.py` tests it as the solid it encloses and measures every part's distance to the solid the barrel sweeps: the tightest are the third wheel (0.150 mm below the cap screws), the barrel bridge (0.55 mm above the boss), the detent's foot (0.98 mm) and the train bridge's cutout (1.0 mm from the caps' rim). The mainspring stays 1.2 mm off the arbor, 0.6 mm inside the wall and 0.2–0.3 mm from the caps at every wind. The dial face is the one open surface not tested.
8. **Visual check.** `tools/topview.py` renders the model from above and warps it onto the top-view photograph through five barrel-bridge screws: `verification/topview-comparison.png` shows the photo, the model and the two blended. Parts far above or below the barrel bridge (the cock, the balance's endstone) are off by up to about 3 mm there, from the photograph's tilt. The photographed movement has the balance locking arm (Fig. 9), which the model now has too, though its shape is estimated. `tools/p3fit.py` renders from the camera fitted to the photograph the tracing was first done on.

## Estimated, not from the manual

- Tooth counts of the centre, third and fourth wheels and pinions. They are chosen to give the half-second train's ratios. The escape wheel (16) is Hamilton's; the 96/14 first stage reproduces the manual's seven key half-turns per 24 h.
- Dimensions and positions, estimated from the figures and a 4-inch dial, except where the photographs give them (plan: "How the layout was measured", steps 1–5; heights: step 6).
- Heights the side photograph doesn't show:
  - The third wheel (4.3–5.2 mm above the plate, just above the fourth wheel, between the centre pinion and the barrel).
  - The barrel (13.2 mm tall, from just above the third wheel to 1 mm under the barrel bridge; its chain band runs level with the fusee's cone).
  - The balance rim, 0.4 mm clear of the escape upper bridge. The bridge's two screws have low heads (0.3 mm), 0.14 mm clear of the rim and the timing weights, which pass over them.
  - The hairspring, 5.9 mm tall, from under the collet to the stud's clamp under the cock.
- The train bridge's cut round the barrel: a 19.2 mm circle that holds the barrel, open to the rim and clear of the centre arbor. Figs. 108 and 110 show its presence; the lower cutout of Fig. 67 follows this circle to 0.7 mm (see the next item).
- The balance lower bridge's outline. The figures give its arrangement: a stepped block, the screws from below with steady pins, one screw at the end of a long curved arm (Fig. 30), the train-blocking screw's column (Fig. 110's section). Fig. 110 is too loose to trace it from: fitted to the train bridge's rim and barrel cut as Fig. 67 is (0.44 mm rms), the drawing's holes land 4–10 mm off the model's. So `tools/lower_bridge.py` lays the upper tier out as an arm round the escape wheel (0.39 mm clear of its tips at the boss, 0.75 mm along the arm), from a lobe beside the train-blocking screw to a lug on the 3 o'clock side, where Fig. 110 puts it and where the screw is outside every wheel, over the pillar plate's access hole (r 3.4). Drawn back on Fig. 110, its screws land on the drawn lug and lobe. The upper tier is 2 mm thick, the steady pins r 0.4; the lower tier is the 3 mm plate of the side photograph (a stadium between the balance and fourth arbors), with a boss and the column between the tiers.
- The train-bridge and barrel-bridge screws. Their positions come from the top-view photograph; the manual gives three screws for each bridge. One train-bridge screw, at (−8.5, 27.7), has no pillar under it in the model. It is drawn threaded into the bridge alone.
- The wind indicator ratio. The ratio gives the UP–DOWN hand a 240° sweep for 56 h; the photographed Hamilton dial's scale spans about 310°, so the model's scale is drawn on 240°, open wider round the 12.
- The Hamilton dial's proportions. The sub-dial centres are fixed by their arbors (23.9 mm from the centre, 0.47 of the dial's radius), nearer the centre than on the photographed dial (about 0.54), so the sub-dials sit lower and the inscriptions closer together. The plate engraving's block is 2.5 mm nearer the rim than on the top-view tracing, to clear the dust-seal flange.
- The stop-bar's size, nose and travel, and the fusee's top: a slotted layer with a groove for the stop-bar spring, and the top plate (r 9.15) with its two screws. Sec. IV describes the mechanism (the chain bears on one end, the other moves out to the winding stop), not its dimensions. The model's bar lies beside the arbor in a slot open to the rim at both ends (Figs. 12, 28); a nose from its end hangs 1.6 mm proud of the groove's floor in the top turn, 0.7 turn in, through a window in the top rim, and the chain winding over it slides the bar 1.64 mm, so the far end stands about 1.4 mm past the rim, where the winding stop hangs. The spring bears on a tab on the bar's inner side. The groove is led in over 0.12 turn at its start, where the chain leaves the fusee at full wind, and out over 0.04 at its end.
- The shapes of the springs: the winding-pawl springs, the stop-bar spring, the sustaining pawl's spring (a wire round a steady pin in the train bridge) and the setup pawl spring. The sustaining spring's travel from loaded to spent (10°, `SMAX`): 5 to 10 minutes of drive (Sec. IV) is 4.4–8.75° of the fusee wheel. The model does not stop the train if a wind outlasts it (only possible at high speed).
- The sustaining spring is pinned to the fusee wheel and pushed by a pin on the sustaining ratchet; the manual pins it to both.
- The barrel arbor's core (r 1.74) and hook, the barrel wall (0.2 mm thick) and the brace lining it (0.25 mm thick, 40° of the wall), the end plate and taper pin, and the chain's end pin and hook.
- The chain's links: figure-eight plates (Fig. 38) 0.9 mm high and 0.18 thick, three deep along the arbor, riveted at a 1.0 mm pitch. The chain is 660 links, about 26 in with its straight run; one sale listing gives 28.5 in for the Hamilton's.
- The mainspring's length and lie. Its thickness is from the parts list (0.0165 in, 0.419 mm); its length (600 mm) is estimated, filling half the room between the core and the brace, the length that gives the most turns. It lies in two packs, one on the arbor and one on the wall, their coils 0.01 mm apart (the grease), joined by one free turn (estimated). In the model's barrel, on a core of r 1.74 (estimated: the arbor's pivots are r 1.4), that spring takes 7.64 turns from its fewest to its most. The fusee's chain needs 7.07 of them, which leaves a set-up of 0.37 turn and 0.2 turn unused at full wind. The core was r 2.4 (6.53 turns) until the fusee was measured, which needed more chain. The eye in its inner end for the arbor's hook, and the anchor pin at its outer end (the parts list's "complete with anchor pin"), drawn bearing on the brace's leading end, are estimated.
- The detent's dimensions.
  - Its plan follows Fig. 90 and its construction Figs. 14 and 110 and the chronometerbook photograph. Thicknesses and heights are estimated.
  - The foot and support block are shorter than in Fig. 90, so they clear the model's train pillar.
  - The detent's lift, the wheel's release and the trip spring's bending are solved in `ESC` from the discharge jewel's contact with the trip spring's tip. The spring projects past the horn, so the jewel never touches the horn.
  - The wheel's advance is solved from its teeth's contact with the impulse jewel.
- The escapement's settings. They were chosen to meet the manual's adjustment figures, measured with its own definitions (Sec. VIII):

  | Setting | Model | Manual |
  |---|---|---|
  | Lock: detent leaves the stop button, until the tooth drops off | 6.0° | about 6° (Op. 85) |
  | Let-off: tooth drops off, until the detent falls back | 10.6° | at least 6° (Op. 86) |
  | Overall: trip spring falls off the jewel on the passing swing, until the detent falls back on the unlocking swing | 28.4° | 26–30° (Op. 87) |
  | Drop | 2.1° | about 2° (Op. 97) |
  | Roller shake | 0.055 mm | about 0.002 in (Op. 84) |
  | Horn clearance | 0.25 mm | about 0.010 in (Op. 88) |
  | Angle between the jewels | 88° | about 90° in Fig. 90 and Op. 7 (adjustable) |
  | Locking-jewel draw | 10° | 8–12° (chronometerbook post 30) |

  - Depth of lock is 0.125 mm, and the trip spring's tip lifts 0.20 mm to release.
  - The discharge jewel meets the trip spring at −27.3° of balance and releases the wheel at −21.3°. The impulse runs from −20.7° to +20.8°, centred on the dead point.
  - The detent falls back, and on the return swing the trip spring flies back, where the spring's tip leaves the jewel's end (−10.7° and −39.1°). The push peaks about a degree earlier, where the tip slides off the jewel's side onto its end. Let-off and overall are measured to the fall, as the manual's gauge reads them.
  - Simplified: unlocking against the 10° of draw would turn the wheel back a little (recoil, about 0.2° of the wheel); the model's wheel stands until release. Roller shake is equal on both sides, where Op. 84 prefers slightly more on the outgoing tooth. The solver, the mesh and the 2D inset share one tooth outline (`ESC.toothPts`).
- The escapement's parts beyond the plan.
  - The escape teeth: their form follows Fig. 90 and an original wheel photographed in chronometerbook post 30 (a land 0.13 mm wide at the tip, the root circle at 5.5 mm). The undercut of the locking face (the root trails the tip by 0.1 of a pitch, about 11°) and the length of the hollow back (0.55 of a pitch) are read from the drawing and photograph. The rim (0.5 mm), the spokes (0.5 mm wide and thick) and the collet (r 1.5 mm) are estimated from the photograph.
  - The impulse roller's three holes (0.5 mm radius, a quarter turn apart from the jewel, Figs. 14, 61 and 90) and the impulse jewel's section (flat on the impulse face, curved behind, thinning to 0.45 of its width at the ends; "curved side of the jewel", Sec. VII) are estimated in size.
  - The unlocking roller is a collar 1 mm long with its jewel in a slot and a wider slot opposite (Fig. 64); its length and the slots' depths are estimated.
  - The trip spring is a flat strip 0.06 mm thick and 0.3 mm deep, its foot 0.2 mm thick against the angle bracket; both estimated. Its thickness sets where the jewel meets and leaves it, so the settings above were chosen with it: the tip radius `rT` 0.286 and the unlocking jewel at `aD` 269.6° (the jewels 88° apart, as Op. 97 adjusts the drop).
  - The locking jewel's wedge pin (42089, Figs. 57–59), 0.2 mm across, beside the jewel on the side away from the wheel.
- The balance rim diameter (29 mm), measured on the top-view photograph.
- The rate panel's figures (see "The rate panel" under How the timing works). Sourced: the rate for a full turn (p. 70) and the screws' and weights' masses (parts list). Estimated:
  - The moment of inertia: the rim's and arm's section, and each screw's or weight's mass spread along its drawn cylinder. It leaves out the rim's holes, the weights' screws and the staff. Table II's screw changes imply a larger moment, about 1,100–1,300 g·mm², so the rim is probably heavier than drawn. The drawn balance-screw heads (1.5 mm across) are also too small for their masses.
  - The thread pitches (0.146 and 0.092 mm), which follow from the moment of inertia.
  - Reading "one full turn of timing weight" as both weights of the pair turned a turn each.
  - The weights' travel, 3 turns either way from the middle position the manual starts them at. At 40 s a turn, that covers the 2 minutes a day that screws and washers leave (Op. 5).
  - The weights' drawn sizes.
- The upper train bridge's outline, the crescent of Figs. 29, 67 and 110. `tools/train_bridge.py` fits an affine map from Fig. 67 (a parallel projection) to the model, through the plate's rim and the cut round the barrel (0.34 mm rms); the model's pillar-screw holes and the centre, third and fourth wheel holes land within 1–2 mm of holes in the drawing.
  - The notch round the fusee is traced through that map. It is open to the rim, and its edge runs past the centre arbor to a horn that carries the centre wheel's upper bushing, then into the barrel's cut. The barrel pillar stands in the open notch.
  - The edge is pushed off every screw hole, bushing and pivot the bridge holds, so each keeps at least 1 mm of metal (the barrel bridge's tapped screw 0.98 mm).
  - The keyhole is built from the model's own centres, not traced: through the fit the drawing's keyhole lands about 5 mm off the balance and escape arbors. It is the opening round the balance staff and rollers (r 8.0) joined to one round the escape arbor (r 3.0), which the escape upper bridge spans. Its lobes in the drawing (one of them under the detent support block's screw) are not drawn.
- The barrel bridge's cut round the balance: traced on the top-view photograph, to about 1.3 mm (see "How the layout was measured", step 3).
- The balance cock's nose and its endstone cap. The top-view photograph gives the cap's shape and size, to about 0.3 mm: a steel plate 7.6 × 4.6 mm lying along the cock's straight edge, square at the foot's end and round at the nose's, with the endstone in a gilt setting at its centre and its two screws 2.75 mm either side, and the cock's metal all round it. The tracing, taken through the plate-height mapping and shifted for parallax, puts the nose's edge 0.7 mm from the staff and leaves the cap and one of its screws over nothing, so the nose is widened to the hull of the cap with 0.9 mm to spare, joined to the traced straight and concave edges. The manual's drawings show the setting inside the cock's nose and the cap on it (Figs. 19, 85). The settings' and jewels' sizes are estimated.
- The collet and stud: their outlines and sizes, and the stud's direction.
  - The collet's plate is a 130° sector 3 mm in radius with a tongue out to the clamp, and a hub 1.15 mm in radius (Figs. 5 and 6 show the shape, not its size). Its counterpoising is not modelled.
  - The stud is a bar 5.7 × 1.6 × 0.5 mm, running from over the spring's end along the cock toward the cock screw; the stud screw is 7.6 mm from the staff and the steady pin 5.6 mm.
  - Both ends of the spring are 3.6 mm from the staff, in the stud's direction when the balance is at rest.
- The centre of the dial. Sourced: the order of the parts and how they fit (the cannon pinion a friction fit on the centre arbor, Op. 58; the hour wheel free on the cannon pinion, Op. 59; the hour hand broached round onto the hour wheel's pipe and the minute hand broached square onto the cannon pinion, Op. 64; the key on "the bright, square arbor at the center of the dial", Fig. 8). Estimated: the sizes.
  - The hand-setting square is the cannon pinion's squared end, 2.4 mm across, as the fusee arbor's square, since the one key fits both (Fig. 8), standing 1.6 mm proud of the minute hand's collet, as the fusee's square stands (the side photograph suggests about 2 mm).
  - The cannon pinion's pipe is r 1.7, as the square's corners need, since the hour wheel goes on over the square; the hour wheel's bore is r 1.75 and its pipe r 2.3, through a dial hole of r 2.5.
  - The hour hand's boss is r 2.9, its collet r 2.7 and 0.6 mm deep under the blade (clear of the seconds hand's tip, which reaches r 2.9 at :00); the minute hand's boss and collet are r 3.2, the collet 0.8 mm deep over it (the dial photograph shows one round boss about 7 mm across). The hour hand is at 5.2 mm and the minute hand at 5.75 mm, on the cannon pinion's shoulder.
- The gimbal latch's geometry. Sourced: its parts (support bracket screwed from outside the box, lever, handle, keeper on the case) and the slot in the ring the lever passes (Figs. 1, 106; parts list). Estimated: the lever pivots on a pin in a corner bracket at the height of the ring's pivots and swings 45° between the right wall and the keeper; the slot is 7.3 × 4.4 mm; the keeper is a back and two cheeks. The take-up spring and the clamping bracket and screw are left out.
- The case's winding-hole shield plate. Sourced: its parts (plate, shoulder screw, stop screw, return spring; parts list) and its action, turned clockwise, seen from below, until its hole lines up with the case's, and returned by the spring (the case's description and the winding instructions). Estimated: everything else.
  - The plate's shape: a rounded triangle on a shoulder screw 9 mm from the key hole, covering the hole at rest and turning 0.75 rad to open it.
  - The stop screw runs in an arc slot in the plate, whose two ends set the rest and open positions.
  - The spring is a torsion coil round the shoulder, with one leg on the stop screw and one on a pin in the plate.
  - The case bottom is 1 mm thick (the rest of the bowl is a sheet).
- The screws' shanks: a thread of half the head's diameter (0.8 mm for the cock screw, 0.07 mm for the trip-spring screw in the bracket's thin leg), drawn as turned rings, and each one's length. The parts list gives the screws, not their threads or lengths. The cock screw sits 0.3 mm off its traced position (within the tracing's 0.4 mm) so its thread clears the foot's edge.
- The pillar screws from the dial side (four), the mounting ring's lip and its three screws (on 42 mm, at 90°, 210° and 330°), the dial screws (one into each foot), and the posts of the minute and wind indicator wheels with their screws from the train side. The parts list and Figs. 107 and 110 give the parts, not their sizes or positions.
- The endstone caps (escape upper and lower, balance lower): a steel plate 1.3 mm wide over the setting, its screws 2.1 mm (1.9 mm on the balance lower bridge) either side of the arbor.
- The balance's hub, cap and hold-down screws (Fig. 4): a flange 0.6 mm thick under the arm, a boss through it, a cap 0.35 mm thick, screws 1.7 mm from the staff. The balance's moment of inertia counts them in place of the old hub.
- The train-blocking screw (Sec. II, Fig. 110): its place on a lobe of the balance lower bridge, 3.5 mm from the fourth arbor on the 6 o'clock side, clear of the third wheel and the escape wheel; its size (head 1.7 mm, thread 0.84 mm, dog point 0.5 mm) and 5.6 mm travel; the lobe's column (r 1.9, bored r 0.95 down to the seat 0.6 mm into the bridge's top: the section gives the arrangement, not the sizes) and the access hole in the train bridge (r 0.72).
- The balance locking arm (Fig. 9, which shows its screw, positions and stop, not its shape): a flat arm 3.6 mm long on the train bridge under the balance, turning 90° on its screw 10.6 mm from the staff at −30° (where the train bridge's notch round the fusee leaves it metal; at −60° it would stand in the notch), with a pad at its end that comes under the rim; the stop pin's place.
- Stopping and starting: the balance's free run-down (1/e in 25 s), the arm's braking (0.2 s), the twist's swing (160°) and the build-up to 255° (3 s). `ESC.AMIN` is worked out from the escapement.
- The sustaining pawl's position: 21.35 mm from the fusee axis, where the pawl reaches the sustaining ratchet and its arbor can run from the pillar plate to the train bridge clear of the centre wheel and of the fusee wheel's teeth.

## Modifying the model

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
    flat face;
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
  module × teeth ÷ 2.
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
- Any tooth count changes the wheel's radius, so re-run `tools/solve.py` (its
  pitch radii are written from the counts: update them there) and
  check clearances with `fine.py` (`dyn.py` can't see gaps under 0.4 mm).

**Change the dial.** The dial is painted on a canvas in `dialCanvas()` in
`core.js`: chapter ring, numerals, the seconds and UP–DOWN sub-dials and the
inscription. The default, Hamilton dial follows a photographed Model 21 dial of
the U.S. Maritime Commission contract; `SERIAL` (top of `core.js`) is printed
in its seconds sub-dial and engraved on the plates. The numerals are sized from
the loaded face's measured figure height, so `app.js` loads the canvas-only
font faces before building the model. `dialCanvas('roman')` draws the Variants panel's alternative, a
Roman dial after the A. Lange & Söhne deck chronometers (no maker's name or
number; its AUF–AB wind scale uses this movement's 240° sweep).
`dialCanvas('swiss')` and `dialCanvas('soviet')` share one branch for the
Nardin pattern. The Swiss one follows the Ulysse Nardin dial photographed by NOAA
(Roman hours, UP/HAUT–DOWN/BAS). The Soviet one follows the First Moscow Watch
Factory's copy of it (Arabic hours, ЗАВОД–СПУСК, СДЕЛАНО В СССР, its Cyrillic
set in system sans because the vendored fonts are Latin only). Both leave off
the maker's name and number and keep the 240° wind sweep. `References/` holds
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
escape-wheel progress for balance phase `p`. The 2-D walkthrough diagram
(`drawEsc2D` in `app.js`) draws from the same data, so the two stay in step.
The detent's plan outlines are `ESC.pieces` (turning about the point of
flexure) and `ESC.fixed`; their heights are set where the detent is built.
After a change, run `node escapement.js` in `tools/`. It measures lock, let-off,
overall, drop, roller shake and the horn clearance, and flags any outside the
manual's figures. The measurements and tolerances are `ESC.measure()` and
`ESC.checks()` in `makeEsc`, so the tool and the page's adjuster's bench use
one definition; `measure()` also says when a setting would not run at all
(`runs`, `why`), and the tool then exits with 1. To try a setting before editing, pass it on the command line,
for example `node escapement.js rT=0.29`. Record the results in the escapement
entries under "Estimated, not from the manual". The essay's detent figure (F7
in `../marine-chronometer-essay/src/p4.js`) calls the same `makeEsc`, so it
follows the change; rebuild with `python build.py` at the root. `node escapement.js`
exits with 1 when a figure is out of tolerance.

**Update the link-preview images** after visible changes. From `tools/`, run
`python social.py` for both, or `python social.py dial` or
`python social.py movement` for one, then rebuild from the root. For a custom
shot:

    python social.py --out name.png --view movement --drive --cam YAW PITCH DIST FOV

**Update the illustration** after a visible change to the box, gimbals, fusee,
chain, escapement or balance: `python illustration.py` from `tools/` renders the
five views, draws them tinted and in ink and writes `img/illustration.webp` and
`img/illustration-ink.webp` (about two minutes; `--only esc bal` re-renders some
views, `--no-render` only redraws and lays out). Look at `r_ill/sheet-tint.png`
and `sheet-ink.png`: labels pointing at a sheet position were placed
by eye, so move them in `sheet()` if a part has moved. Then rebuild from the root.
