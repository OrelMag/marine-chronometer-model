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
| `index.html` | Page markup: the stage with its 3D model / Illustration tabs, walkthrough card, controls (View, Time, Display, and collapsible Parts, Rate and timing weights, Cross-section and Variants), the About dialog with sources and method |
| `css/style.css` | Layout, theme tokens (light and dark), controls, labels |
| `img/illustration.webp` | The overview drawing shown in the Illustration tab, rendered from the model by `tools/illustration.py` |
| `js/core.js` | Math helpers, materials and procedural textures (plate striping, wood grain, engraving), gear / hairspring / hand / mainspring geometry, dial artwork, cross-section shader patch, the Pen and wash drawing (`drawOf`, `makeInk`) |
| `../shared/escapement.js` | The detent escapement's solver, `makeEsc(settings)`, shared with the essay's detent figure and `tools/escapement.js` |
| `js/movement.js` | The movement: layout constants, the escapement (`ESC=makeEsc(...)`, with the centre distance from `L`), pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate), winding key |
| `js/app.js` | The parts registry (`PARTS`: every part's name, description, part numbers, group, colour and flags), renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, and the animation loop |
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
| `tools/escapement.js` | Measures the escapement against the manual's adjustment figures (Node.js, no browser) |
| `tools/invariants.py` | Checks the model's arithmetic: hands against the time, the wind indicator's scale, the fusee's 60 h and 17½ half turns, the balance's moment of inertia and the rate for a turn of the weights (exit code 1 on a failure) |
| `tools/smoke.py` | Loads the model and clicks through every control (views, walkthrough, variants, sections, time zone, keys, a URL-hash link), then scrolls the essay; fails on any console error or warning |
| `tools/p3fit.py` | Renders the model from the top-view photograph's camera |
| `tools/illustration.py`, `tools/illustration-passes.js` | Draws `img/illustration.webp` from the model in pen and wash: renders each view's colour, lit shade, normals, depth and part ids in the page, turns them into ink and wash, and lays out the labelled sheet |
| `tools/social.py` | Renders the 1200 × 630 link-preview images into `site-assets/`, the model on a dark background beside a title column: `social.png` (the model page: the dial in its box, hands at 10:10) and `social-movement.png` (the essay: the moving parts) |
| `verification/` | Reference results: the top-view comparison, the Fig. 2 overlay and its camera fit |

## Controls

Speed: the presets, or any value from 0.01× to 10,000× on the Custom slider or typed in; the space bar stops and restarts. Right-click a part to fade or hide it; right-click empty space to bring hidden parts back. On touch screens a long press (half a second, barely moving) does the same; Android's own long-press `contextmenu` and the page's timer open the menu once between them, and the press never picks.

- The **?** button on the model (or the **?** key) opens a card listing every control, for a mouse and for touch, with this device's first; the header and the hint word the gestures for the device too (`.m-only` / `.t-only`, switched by `@media (hover:none)`). A tap in the model, × or Esc closes it; dragging doesn't, so the gestures can be tried with it open.
- Keys 1–7 pick the views. Exploded has a Spread slider.
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
- Time: set the hands to any time of day, or to now. The model keeps Greenwich Mean Time by default, as U.S. Navy chronometers were kept (the HUD says GMT); Keep: Local time switches to the viewer's time zone, moving the hands by the difference. Wind with the key turns the fusee half a turn at a time, 17½ half turns from run down (the fusee's 8¾ turns, 60 h of chain), with the plates see-through and the winding stop kept solid. For the last half turns the camera closes in on the stop-bar catching.
- Rate and timing weights: turn the timing or vernier weight pair in or out by eighth turns, up to 3 turns either way from mid-travel. `R.timing(nt, nv)` in `movement.js` moves them and returns the balance's moment of inertia, computed from the balance's geometry and the parts list's masses (931 g·mm² as built). The weights' thread pitch (`R.pitch`) is set so that a full turn gives the manual's figures (p. 70): about 40 s a day for the timing pair and 2.8 s for the vernier pair, which makes the pitches 0.146 and 0.092 mm. The model clock `tSim` then runs √(I₀/I) as fast as real time, so the hands gain or lose; the panel shows the daily rate and what the hands have gained since the weights were moved or the hands set.
- Parts: every named part by group, to single out (as a tap does) or hide. Display adds a slow turn and an Auto/Light/Dark theme. Save writes the view as a PNG.
- Tick sound (Display) is on by default: a click at each beat, while the model runs at up to 1×. Browsers start audio only from a user gesture, so the page makes or resumes its audio context on the first click, tap or key press, and it is silent until then.
- Pen and wash (Display; `draw=1` in the hash) draws the live model as the Illustration tab is drawn: `tools/illustration.py`'s `stylize()` done on the GPU, with its numbers except one: the wash is laid lighter (pigment density `INK.wash` 0.75 against `stylize()`'s 1.25), so the live model reads through it.
  - `drawOf(m)` in `core.js` gives each shown material a Phong copy whose output is the wash. It is the albedo lifted toward the paper, the lit value in soft bands, white where metal catches the light. `look()` applies it to whatever a part shows, so it combines with Colour by part, fading and sections.
  - `makeInk(r)` draws the frame. Three scene passes: normals, part ids and 24-bit depth for the solids, then the same for the ghosts, then the wash with the shadows. Two full-screen passes follow: the lines, then the sheet. The sheet lays the wash a little off the lines, mottles it and pools it at edges, hatches deep shade and inks with a varying pressure.
  - Lines fall where depth jumps (0.6 mm + 1.2 % of the distance) or the drawing ends, with lighter ones at creases and between parts.
  - Parts under half opaque (see-through plates, the glass, faded parts) are ghosts, drawn in outline only and lighter.
  - The stage is paper in either theme, the floor shadow is left out, and the plates' damascening is muted.
  - A moving model costs three scene renders a frame instead of one. The shadow map is still drawn once. With the option off, nothing is drawn differently.
  - Known limits:
    - Cost: frames with nothing moving are still skipped, as in the normal rendering. It was measured only in headless Chromium's software renderer (SwiftShader), not on a phone's GPU. The wash's render target is sized when the option is turned on and dropped when it is turned off (the others serve Edges too); the paper's noise texture is made the first time it draws.
    - Views from below are heavily hatched. The light comes from above, so in the Escapement view (from the pillar-plate side) most faces are in shade, and `stylize()` hatches shade under a band of 0.4. The Illustration never looks up at the movement, so it doesn't show this. To lighten it, change the hatching's threshold (`0.4`) or weight (`0.55`) in the sheet shader of `makeInk`.
    - The plates' damascening is kept at 30 % in the wash (`uTex` in `drawOf`). At full strength it read as hatching. The shade is taken before that mix, so a darker stripe never changes a band.
    - The lines are found in screen space, one or two device pixels apart depending on the pixel ratio. Very thin parts far away (screws, pins in the Box view) can be only a line or two wide.
- Edges (Display; on by default, off on phones; `edges=0` or `edges=1` in the hash when it differs from that default) outlines the movement's parts over the normal rendering, so that parts of one finish lying on each other stay apart: the steel winding pawls on the steel sustaining ratchet, for one. It is Pen and wash's line pass (`makeInk(r).lines()` in `core.js`) laid over the ordinary frame instead of the wash.
  - The thresholds are Pen and wash's: depth jumps, creases, and ghosts in lighter lines. Two things differ. The ids are per mesh, not per part, because a pawl is the same part as the wheel it lies on and less than the depth threshold above it. And the box, case, gimbals and glass (id 0) draw no lines, including where they meet the movement or stand in front of it. The engravings and the floor shadow are left out of the id passes, so an engraving doesn't outline itself on its plate.
  - Cost: the two id passes plus the normal render, three scene renders for a moving frame, as with Pen and wash; the id passes' shader is trivial. In headless Chromium's software renderer a moving frame took 3–8 % longer at a pixel ratio of 1 and 12–28 % at 2 (Movement and Escapement views). Not measured on a phone's GPU, where the tripled draw calls weigh most; phones start with it off.
  - Memory: `makeInk`'s render targets are the drawing's size only while in use, else 1 px. Edges keeps the normals and ids (4 bytes a pixel, plus 4 of depth) and the lines (4): 12 bytes a pixel, about 23 MB for a 1600 × 1200 drawing. See-through parts add the ghosts' 8, and pen and wash the wash's 8 (dropped again when it goes off).
  - With the option off, nothing is drawn differently.
  - Pen and wash inks its own lines. While it is on, Edges is greyed out and kept, and it comes back when Pen and wash goes off.
- Labels are off by default (Display turns them on, and the choice isn't remembered). The walkthrough shows the labels of each step's parts regardless.
- Keyboard and reduced motion: Space stops and restarts, 1 to 7 pick the views; with the model focused (click it or Tab to it) the arrow keys turn the view, + and − zoom and 0 resets it. With reduced motion set in the system, camera and state moves are instant (as with `?snap`), the walkthrough leaves ship motion off and scrolls without animation, and the page's fades are off.
- Phones: below 600 px wide the part card is a sheet along the bottom of the stage; on touch screens buttons and checkboxes are finger-sized; in landscape with the height under 560 px the stage fills the height and the panel scrolls beside it. On a phone (coarse pointer, screen under 600 px on its short side) the pixel ratio is capped at 1.5 and the shadow map at 1024 px, against 2 and 2048 px elsewhere. A part casts a shadow only when its radius spans 6 texels of the shadow map, which follows the view: far views drop the screws and pins, close-ups keep them. The knurled nuts and the balance rim's holes are each one merged mesh (`mergeGeo` in `core.js`).

## Testing

The page's state is kept in the URL hash, so a link opens the model as it
was: `#view=escapement&speed=0.05&part=det` (a view, speed and picked part; `view=laidout` is the laid-out train),
`#tour=6` (a walkthrough step), `drive=1` (Moving parts only), `draw=1` (Pen and wash), `edges=0` / `edges=1` (Edges, when not its default), `sec=x:-3.5`
(a cross-section; `:f` shows the other half), `tz=local`, and `t=10:09:30`
once the hands have been set. It is read at load and when edited, and
rewritten (without adding to the history) 0.3 s after any change.

Two URL flags help with testing:

- `?snap` switches off camera and state easing, so views settle immediately
  (useful for screenshots), and draws every frame (see below).
- `?qa` exposes the movement (`__mv`), the photo-projection helpers (`__proj`,
  `__unproj`) and camera controls (`__cam`, `__look`, `__camInfo()`) for the
  tools, plus the parts registry (`__parts`), the renderer (`__r`) and a count
  of frames drawn (`__renders()`).

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
- What turns while winding: the fusee wheel follows the train (`gA`), not the
  fusee, so it keeps turning forward, driven by the sustaining spring, while
  the key turns the fusee and its winding ratchet back and the sustaining
  pawl holds the sustaining ratchet. The setup ratchet never turns: its angle
  is set once when the movement is built (`srw.rotation.y`, a steep face on
  the click) and `update()` leaves it alone. The barrel arbor turns only when
  the watchmaker lets the mainspring down or sets it up with a let-down key
  (Sec. II, p. 4: "the only time that the mainspring arbor turns is when
  manipulated during assembly, disassembly or adjustment"; Ops. 8, 53).

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
  the moment of inertia is 931 g·mm². Table II gives a second estimate:
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
  - the gimbal mounting (Figs. 1, 94, 106): a flat ring hung on two pivot screws through the box sides (washer inside, lock nut outside), the case hung in it on front and rear pivot screws into brackets on the case, support straps at 3 and 6, the gimbal latch at the front right and the key at the back right;
  - the dial markings, winding figures and part numbers. The UP–DOWN scale runs clockwise round the bottom of its sub-dial from UP (upper right) to DOWN (upper left), so winding turns the hand counterclockwise back to UP (Fig. 107, Sec. III).
- New-old-stock Hamilton Model 21 pillar plate listing: 87.57 mm diameter, 3.86 mm thick.
- chronometerbook.com, post 4: W. Rawlings' plan of the Model 21 escapement, a redrawing of the manual's Fig. 90, and a photograph of a Model 21 detent.
- chronometerbook.com, post 30: escape wheel specification of 16 teeth, 13.14-13.18 mm diameter, 1.27-1.32 mm thick and no wider than the impulse roller; the locking jewel set at 8-12° of draw.
- The manual's Fig. 2 photograph (layout) and Fig. 107 (dial side, wind-indicator wheel).
- A photographed Model 21 dial of the U.S. Maritime Commission contract (the Hamilton dial's layout, inscriptions and hands) and a photographed movement, serial 2E12055 (the plate engraving's text and layout, and the serial used on the plates and dial). Both are in `References/`.

## How the layout was measured

1. **Two photographs.** The manual's Fig. 2 and a near top-down photograph of a 1941 movement. `tools/bundle.py` fits an independent camera to each photo and triangulates the balance, fusee and barrel axes. Point residuals are under 9 px in both photos.
2. **Scale.** The fusee wheel is fixed at 96:14 by the manual's winding figures and must stay inside the 87.57 mm pillar plate. The two-view result is scaled to meet that (factor 0.955).
3. **Mapping the top view.** Using those three axes, a similarity transform maps the top-view photograph into the model, with under 0.4 mm residual (`tools/p3map.json`). The following were traced through it:
   - the bridge outline (radius about 40 mm);
   - the crescent balance cock (`tools/cock_outline.json`), shifted for its height parallax so its endstone lands over the staff;
   - the bow-shaped setup cover over the ratchet, and the ratchet's size (about 52 teeth, 15.6 mm across);
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
   - The fusee cone spans 6.7–15.8, which the model matches.
   - The escape wheel runs 0.9 below the train bridge.
   - The escape pinion meshes with the fourth wheel 3.6 above the plate, and a large wheel runs lowest, at 0.4–1.6. That is the centre wheel, which must pass under the fusee wheel and the barrel. The escape pinion runs from the fourth wheel down toward the plate (2.1–4.1), clear of the third wheel just above.
   - A 3 mm plate at 7.9–10.9 is taken to be the balance lower bridge. It also carries the fourth wheel's upper pivot, and the train-blocking screw reaches down from it to the fourth wheel's spokes (Sec. II).
   - Fig. 2 and Fig. 109 show a tall barrel that rises past the train bridge to the barrel bridge, and Figs. 108 and 110 show the train bridge cut round it.
   - The plan positions (`L`) were fitted before the re-stack, with the old heights, which `bundle.py`, `fit.py` and `unproj.py` still use. They were not re-fitted.
   - Re-running `bundle.py` with the new heights puts the fusee and barrel axes within 0.8 mm of `L` and the balance within 2 mm. That is about the run-to-run spread of its random restarts.
7. **Collision check.** `tools/dyn.py` with `tools/interference-check.js` checks every closed part at 0.4 mm through a full escapement cycle. `tools/fine.py` checks at 0.05 mm, also at 15 train positions and wind states, and includes the chain and the tube springs; it found four overlaps of 0.1–0.4 mm that the coarser check could not see. Only intended contacts remain, listed with their reasons in `fine.py`. The barrel's wall is an open drum; `fine.py` tests it as the solid it encloses and measures every part's distance to the solid the barrel sweeps: the tightest are the third wheel (0.150 mm below the cap screws), the barrel bridge (0.55 mm above the boss), the detent's foot (0.98 mm) and the train bridge's cutout (1.0 mm from the caps' rim). The mainspring stays 1.2 mm off the arbor, 0.6 mm inside the wall and 0.2–0.3 mm from the caps at every wind. The dial face is the one open surface not tested.
8. **Visual check.** `tools/p3fit.py` renders the model from the top-view photograph's camera. The result is `verification/topview-comparison.png`.

## Estimated, not from the manual

- Tooth counts of the centre, third and fourth wheels and pinions. They are chosen to give the half-second train's ratios. The escape wheel (16) is Hamilton's; the 96/14 first stage reproduces the manual's seven key half-turns per 24 h.
- Dimensions and positions, estimated from the figures and a 4-inch dial, except where the photographs give them (plan: "How the layout was measured", steps 1–5; heights: step 6).
- Heights the side photograph doesn't show:
  - The third wheel (4.3–5.2 mm above the plate, just above the fourth wheel, between the centre pinion and the barrel).
  - The barrel (13.2 mm tall, from just above the third wheel to 1 mm under the barrel bridge; its chain band runs level with the fusee's cone).
  - The balance rim, 0.4 mm clear of the escape upper bridge. The bridge's two screws have low heads (0.3 mm), 0.14 mm clear of the rim and the timing weights, which pass over them.
  - The hairspring, 6.7 mm tall to the cock.
- The train bridge's cut round the barrel: a 19.2 mm circle that holds the barrel, open to the rim and clear of the centre arbor. Figs. 108 and 110 show its presence, not its size.
- The balance lower bridge: a 3 mm plate on a boss under the train bridge, with two screws (Op. 50). Fig. 110 shows it stepped and lobed; its outline is simplified.
- The train-bridge and barrel-bridge screws. Their positions come from the top-view photograph; the manual gives three screws for each bridge. One train-bridge screw, at (−8.5, 27.7), has no pillar under it in the model.
- The fusee profile and the wind indicator ratio. The ratio gives the UP–DOWN hand a 240° sweep for 56 h; the photographed Hamilton dial's scale spans about 310°, so the model's scale is drawn on 240°, open wider round the 12.
- The Hamilton dial's proportions. The sub-dial centres are fixed by their arbors (23.9 mm from the centre, 0.47 of the dial's radius), nearer the centre than on the photographed dial (about 0.54), so the sub-dials sit lower and the inscriptions closer together. The plate engraving's block is 2.5 mm nearer the rim than on the top-view tracing, to clear the dust-seal flange.
- The stop-bar's size and travel, and the fusee's top: a turned boss, a slotted layer with a groove for the stop-bar spring, and the top plate (r 5.4) with its two screws. Sec. IV describes the mechanism (the chain bears on one end, the other moves out to the winding stop), not its dimensions. The stop-bar slides out over the last quarter turn, driven from the wind, not from contact with the chain.
- The shapes of the springs: the winding-pawl springs, the stop-bar spring, the sustaining pawl's spring (a wire round a steady pin in the train bridge) and the setup pawl spring. The sustaining spring's travel from loaded to spent (10°, `SMAX`): 5 to 10 minutes of drive (Sec. IV) is 4.4–8.75° of the fusee wheel. The model does not stop the train if a wind outlasts it (only possible at high speed).
- The sustaining spring is pinned to the fusee wheel and pushed by a pin on the sustaining ratchet; the manual pins it to both.
- The barrel arbor's core (r 2.4) and hook, the brace (0.43 mm thick, 40° of the wall), the end plate and taper pin, and the chain's end pin and hook.
- The mainspring’s coils, which are drawn schematically.
- The detent's dimensions.
  - Its plan follows Fig. 90 and its construction Figs. 14 and 110 and the chronometerbook photograph. Thicknesses and heights are estimated.
  - The foot and support block are shorter than in Fig. 90, so they clear the model's train pillar.
  - The detent's lift, the wheel's release and the trip spring's bending are solved in `ESC` from the discharge jewel's contact with the trip spring's tip. The spring projects past the horn, so the jewel never touches the horn.
  - The wheel's advance is solved from its teeth's contact with the impulse jewel.
- The escapement's settings. They were chosen to meet the manual's adjustment figures, measured with its own definitions (Sec. VIII):

  | Setting | Model | Manual |
  |---|---|---|
  | Lock: detent leaves the stop button, until the tooth drops off | 6.1° | about 6° (Op. 85) |
  | Let-off: tooth drops off, until the detent falls back | 11.9° | at least 6° (Op. 86) |
  | Overall: trip spring falls off the jewel on the passing swing, until the detent falls back on the unlocking swing | 27.8° | 26–30° (Op. 87) |
  | Drop | 2.1° | about 2° (Op. 97) |
  | Roller shake | 0.055 mm | about 0.002 in (Op. 84) |
  | Horn clearance | 0.25 mm | about 0.010 in (Op. 88) |
  | Angle between the jewels | 86° | about 90° in Fig. 90 (adjustable) |
  | Locking-jewel draw | 10° | 8–12° (chronometerbook post 30) |

  - Depth of lock is 0.125 mm, and the trip spring's tip lifts 0.20 mm to release.
  - The discharge jewel meets the trip spring at −27.4° of balance and releases the wheel at −21.3°. The impulse runs from −20.7° to +20.8°, centred on the dead point.
- The balance rim diameter (29 mm), measured on the top-view photograph.
- The rate panel's figures (see "The rate panel" under How the timing works). Sourced: the rate for a full turn (p. 70) and the screws' and weights' masses (parts list). Estimated:
  - The moment of inertia: the rim's and arm's section, and each screw's or weight's mass spread along its drawn cylinder. It leaves out the rim's holes, the weights' screws and the staff. Table II's screw changes imply a larger moment, about 1,100–1,300 g·mm², so the rim is probably heavier than drawn. The drawn balance-screw heads (1.5 mm across) are also too small for their masses.
  - The thread pitches (0.146 and 0.092 mm), which follow from the moment of inertia.
  - Reading "one full turn of timing weight" as both weights of the pair turned a turn each.
  - The weights' travel, 3 turns either way from the middle position the manual starts them at. At 40 s a turn, that covers the 2 minutes a day that screws and washers leave (Op. 5).
  - The weights' drawn sizes.
- The upper train bridge's outline under the barrel bridge (drawn as a full disc, cut round the barrel) and its opening round the balance staff (r 8.0 mm). Figs. 29 and 67 show a crescent. Round the fusee it has a pocket: the top plate (r 5.9), the winding stop and the stop-bar's sweep over the last quarter turn. The pocket stays 0.5 mm under the barrel bridge's straight edge, where the top-view photograph shows the train bridge, so it is smaller than the manual's opening.
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
  - `off` is how far the part rises in the Exploded view, in millimetres (the laid-out view moves parts only across, in x and z, so the two combine);
  - `ef` set to true puts the part in the escapement's rotated frame.

  Put meshes in a part with `mesh(parent, geometry, material, x, y, z)`.
  Anything that moves is stored in `R` and moved in `mv.userData.update()`.
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
  `cylY(radius, height)`.
- **Wheels and pinions** are `arbor(parent, M, x, z, {wheel, pin, ar})` with
  `gearGeo(teeth, module, thickness, options)`. The pitch radius is
  module × teeth ÷ 2.
- **Arbor positions** come from the photo fit, in `L` at the top of
  `movement.js`. Don't move them without re-running the tools in `tools/`.

**Add a screw.** Use `screw(parent, x, z, y, radius, headHeight)`:
- `y` is the surface the head sits on;
- the head extends from `y` towards −y, so it seats on the train side;
- screws are tagged `userData.screw`, which is how the audit finds them.

**Add a new part.**
1. Build it in a new `part('myPart', explodeOffset)` group in `movement.js`,
   or in `box.js` (give that group `userData.partName = 'myPart'`).
2. `app.js`: add one entry to `PARTS`, in the place it should take in the
   parts list: `myPart: {t: 'Title', g: 2, c: '#a0922f', d: 'What it does.',
   sp: 'Part number or spec'}`. `g` is its group in the parts list (`PG`), `c`
   its flat colour for Colour by part; add `plate: 1` for a plate or bridge
   (see-through with the plates, hidden by Moving parts only) or `dh: 1` to be
   hidden by Moving parts only, and `pri` to rank its label. Without an entry
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
pear's bulb), placed in the
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
manual's figures. To try a setting before editing, pass it on the command line,
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
five views, draws them and writes `img/illustration.webp` (about two minutes;
`--only esc bal` re-renders some views, `--no-render` only redraws and lays
out). Look at `r_ill/sheet.png`: labels pointing at a sheet position were placed
by eye, so move them in `sheet()` if a part has moved. Then rebuild from the root.
