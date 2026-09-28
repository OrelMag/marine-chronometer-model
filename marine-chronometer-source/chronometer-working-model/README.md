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
| `index.html` | Page markup: stage, walkthrough card, controls (View, Time, Display, collapsible Cross-section and Variants), the About dialog with sources and method |
| `css/style.css` | Layout, theme tokens (light and dark), controls, labels |
| `js/core.js` | Math helpers, materials and procedural textures (plate striping, wood grain, engraving), gear / hairspring / hand / mainspring geometry, dial artwork, cross-section shader patch |
| `js/movement.js` | The movement: layout constants, detent-escapement kinematics (`ESC.state`), pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate), winding key |
| `js/app.js` | Renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, and the animation loop |
| `build.py` | Inlines the CSS, JS, three.js and fonts into `dist/` (through `inline.py` at the repository root) |
| `tools/interference-check.js` | Voxel collision test used to find and remove overlapping parts |
| `tools/audit.py`, `tools/geometry-audit*.js` | Geometry audit: overlapping or unsupported screws, loose arbor ends, coplanar faces, isolated parts |
| `tools/escapement.js` | Measures the escapement against the manual's adjustment figures (Node.js, no browser) |
| `tools/social.py` | Renders the 1200 × 630 link-preview images into `site-assets/`: `social.png` (the dial in its box) and `social-movement.png` (the moving parts) |

## Controls

Speed: the presets, or any value from 0.01× to 10,000× on the Custom slider or typed in; the space bar stops and restarts. Right-click a part to fade or hide it; right-click empty space to bring hidden parts back.

- Keys 1–6 pick the views. Exploded has a Spread slider.
- Time: set the hands to any time of day, or to now. Wind with the key turns the fusee half a turn at a time, 17½ half turns from run down (the fusee's 8¾ turns, 60 h of chain), with the plates see-through and the winding stop kept solid. For the last half turns the camera closes in on the stop-bar catching.
- Rate and timing weights: turn the timing or vernier weight pair in or out by quarter turns. `R.timing(dt, dv)` in `movement.js` moves them and returns the balance's moment of inertia, computed from the balance's own geometry (576 g·mm² as built). The model clock `tSim` then runs √(I₀/I) as fast as real time, so the hands gain or lose. A quarter turn of the timing pair is about 15 s a day, of the vernier pair about 3 s a day.
- Parts: every named part by group, to single out (as a tap does) or hide. Display adds a slow turn and an Auto/Light/Dark theme. Save writes the view as a PNG.

## Testing

Append `?snap` to the URL to switch off camera and state easing. Views then settle
immediately, which is useful for automated screenshots.

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

Everything is driven from one model clock `tSim`, in local seconds.

- The balance phase is `p = frac(tSim / 0.5)`, one oscillation per half-second.
- `ESC.state(p)` returns the balance angle, detent lift, trip-spring deflection
  and the escape wheel’s progress through its current tooth.
- Escape wheel position is `E = completed oscillations + progress`, counted in
  teeth. Every other arbor is a fixed ratio of `E`. The hands therefore advance
  in half-second steps, as the manual states (Sec. IX, p. 66).
- The fusee and chain follow the hours since winding: one fusee turn per 96/14
  = 6.86 hours.
- Maintaining work: when running, the fusee's winding ratchet drives the
  sustaining ratchet through the two winding pawls, and a pin on that ratchet
  drives the fusee wheel through the sustaining spring. When winding, the
  sustaining pawl holds the ratchet and the spring alone drives the train.
  Every pawl is rested on its ratchet's teeth each frame (`seatPawl`), so it
  rides over them or bears on a steep face.

## Sources

- *Manual for Overhaul, Repair and Handling of Hamilton Ship Chronometer*, NAVSHIPS 250-624, Bureau of Ships, 1948. Used for:
  - the structure: pillar plate, barrel bridge, upper and lower train bridges, balance lower bridge, escape upper bridge. The lower train bridge is screwed to the dial side of the pillar plate (Figs. 29, 67, 110);
  - the maintaining work and the winding stop-bar;
  - the detent escapement. Its layout comes from the plan view, Fig. 90: the detent lies at 68° to the line of centres, with 11.3 mm from the point of flexure to the locking jewel, and the trip spring is 7.9 mm long, 2.3 mm to the side, on the line through the balance staff;
  - the detent's construction, from Figs. 14, 54–60 and 110 and the parts list. The detent is beryllium copper with a two-strip detent spring and a round locking jewel with a flat. The trip spring is Elinvar, on an angle bracket. The support block hangs from the upper train bridge and carries the stop button, lock-adjusting and detent-adjusting screws;
  - the escapement's adjustment figures (Sec. VIII, Ops. 76–97): roller shake about 0.002 in (Op. 84), lock about 6° (Op. 85), let-off at least 6° (Op. 86), overall 26–30° (Op. 87), horn clearance about 0.010 in (Op. 88) and drop about 2° (Op. 97). The teeth drop into the large portion of the impulse roller's crescent and never enter the small portion (Ops. 76, 83). The wheel is centred on the impulse jewel (Op. 82);
  - the impulse roller, 0.249 in (6.32 mm) across (parts list, p. 82). Variants of .250–.253 in exist to set roller shake;
  - the balance and hairspring. The balance carries 10 screws in diametric pairs, 6 of 0.049 in, 2 of 0.080 in and 2 of 0.101 in head height, plus 2 timing and 2 vernier weights (parts list, p. 82);
  - the barrel cap with its five screws on the pillar-plate end (Figs. 26, 109), and the dust seal with three packing rings around the fusee arbor (Fig. 24);
  - the gimbal mounting (Figs. 1, 94, 106): a flat ring hung on two pivot screws through the box sides (washer inside, lock nut outside), the case hung in it on front and rear pivot screws into brackets on the case, support straps at 3 and 6, the gimbal latch at the front right and the key at the back right;
  - the dial markings, winding figures and part numbers. The UP–DOWN scale runs clockwise round the bottom of its sub-dial from UP (upper right) to DOWN (upper left), so winding turns the hand counterclockwise back to UP (Fig. 107, Sec. III).
- New-old-stock Hamilton Model 21 pillar plate listing: 87.57 mm diameter, 3.86 mm thick.
- chronometerbook.com, post 4: W. Rawlings' plan of the Model 21 escapement, a redrawing of the manual's Fig. 90, and a photograph of a Model 21 detent.
- chronometerbook.com, post 30: escape wheel specification of 16 teeth, 13.14-13.18 mm diameter, 1.27-1.32 mm thick and no wider than the impulse roller; the locking jewel set at 8-12° of draw.
- The manual's Fig. 2 photograph (layout) and Fig. 107 (dial side, wind-indicator wheel).

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
5. **Hidden wheels.** The third-wheel position and per-stage modules (0.29, 0.30, 0.31) are solved so every arbor clears every wheel, the barrel and the pillars.
   - The escape wheel sits 9.40 mm from the balance. There the 0.249 in impulse roller clears the teeth either side of it by 0.002 in (roller shake, Op. 84), and the teeth dip into its crescent (Ops. 76, 83).
   - An earlier scaling of Rawlings' drawing gave 10.2 mm. Readings of the drawing vary with the feature used for scale; the manual's specifications fix the distance.
   - The escape arbor keeps its depth with the fourth wheel.
6. **Heights.** A side photograph of an unmounted movement is scaled by the pillar plate's 3.86 mm edge (75 px; the plate's width gives the same scale to 2 %). On it, in mm above the pillar plate:
   - The pillars are 16.8 tall, the train bridge 3.1 thick, and the barrel bridge 3.4 thick on top of it.
   - The cock foot stands 14.2 tall on the train bridge.
   - The fusee cone spans 6.7–15.8, which the model matches.
   - The escape wheel runs 0.9 below the train bridge.
   - The escape pinion meshes with the fourth wheel 3.6 above the plate, and a large wheel runs lowest, at 0.4–1.6. That is the centre wheel, which must pass under the fusee wheel and the barrel.
   - A 3 mm plate at 7.9–10.9 is taken to be the balance lower bridge. It also carries the fourth wheel's upper pivot, and the train-blocking screw reaches down from it to the fourth wheel's spokes (Sec. II).
   - Fig. 2 and Fig. 109 show a tall barrel that rises past the train bridge to the barrel bridge, and Figs. 108 and 110 show the train bridge cut round it.
   - The plan positions (`L`) were fitted before the re-stack, with the old heights, which `bundle.py`, `fit.py` and `unproj.py` still use. They were not re-fitted.
   - Re-running `bundle.py` with the new heights puts the fusee and barrel axes within 0.8 mm of `L` and the balance within 2 mm. That is about the run-to-run spread of its random restarts.
7. **Collision check.** `tools/dyn.py` with `tools/interference-check.js` checks every closed part at 0.4 mm through a full escapement cycle. Only intended joints remain.
8. **Visual check.** `tools/p3fit.py` renders the model from the top-view photograph's camera. The result is `verification/topview-comparison.png`.

The tools need Playwright with Chromium. Open the page as `index.html?snap&qa`.

## Estimated, not from the manual

- Tooth counts of the centre, third and fourth wheels and pinions. They are chosen to give the half-second train's ratios. The escape wheel (16) is Hamilton's; the 96/14 first stage reproduces the manual's seven key half-turns per 24 h.
- Dimensions and positions, estimated from the figures and a 4-inch dial, except where the photographs give them (plan: "How the layout was measured", steps 1–5; heights: step 6).
- Heights the side photograph doesn't show:
  - The third wheel (8.6 mm above the plate, between the centre pinion and the barrel).
  - The barrel (13.2 mm tall, from just above the third wheel to 1 mm under the barrel bridge; its chain band runs level with the fusee's cone).
  - The balance rim, 0.4 mm clear of the escape upper bridge.
  - The hairspring, 6.7 mm tall to the cock.
- The train bridge's cut round the barrel: a 19.2 mm circle that holds the barrel, open to the rim and clear of the centre arbor. Figs. 108 and 110 show its presence, not its size.
- The balance lower bridge: a 3 mm plate on a boss under the train bridge, with two screws (Op. 50). Fig. 110 shows it stepped and lobed; its outline is simplified.
- The train-bridge and barrel-bridge screws. Their positions come from the top-view photograph; the manual gives three screws for each bridge. One train-bridge screw, at (−8.5, 27.7), has no pillar under it in the model.
- The fusee profile and the wind indicator ratio.
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
- The rate panel's figures: the timing weights' thread (0.2 mm a turn) and the weights' sizes are estimates. The moment of inertia leaves out the rim's holes and the staff, and treats every screw as a solid cylinder.
- The upper train bridge's outline under the barrel bridge (drawn as a full disc) and its opening round the balance staff (r 8.0 mm).
- The sustaining pawl's position: 21 mm from the fusee axis, where the pawl reaches the sustaining ratchet and its arbor can run from the pillar plate to the train bridge clear of the centre wheel.

## Modifying the model

Work on `index.html` (not the built file) and reload the browser after each
edit; see "Changing things" in the root README for the loop and the checks.

### How the code fits together

- **Load order.** The four scripts are classic scripts that share global names,
  loaded in order: `core.js`, `movement.js`, `box.js`, `app.js`. A later file
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
  - `off` is how far the part rises in the Exploded view, in millimetres;
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
2. `app.js`: add a description to `INFO`:
   `myPart: ['Title', 'What it does.', 'Part number or spec']`. Without an
   entry the part can't be tapped or right-clicked.
3. `app.js`: add a flat colour for Colour by part to `PCOL`.
4. `app.js` (optional): add a label with `addL('Text', 'subtitle', 'myPart',
   anchor, group)`:
   - the anchor is a point on the part, e.g. `pw(P.myPart, x, y, z)`;
   - the group is `'mv'` (movement views), `'dial'`, `'box'` or `'motion'`;
   - `PRI` sets which labels win when space is short.
5. `app.js`, if it's a plate or bridge: add it to `PLATES` (made see-through by
   See-through plates) and `DRIVE_HIDE` (hidden by Moving parts only).
6. `README.md` (this file): record where each dimension comes from, or add it
   to "Estimated, not from the manual" above.

**Change gear ratios or tooth counts.** The counts are in `TRAIN` (and `UD`
for the wind indicator; `MOD` holds the tooth sizes).
- The ratios follow from these automatically. The fusee wheel's 96 teeth are
  written directly in the fusee-wheel code.
- The same numbers also appear as text, so update all of them:
  - the labels in `app.js` (`addL('Centre wheel','80 teeth, …')` and the
    others);
  - `INFO`;
  - the ratio table built in `setInset` (the `'train'` case);
  - the live angle readout in `drawInset`, which uses 7.5, 56.25 and 450;
  - the tooth counts in this README.
- Any tooth count changes the wheel's radius, so re-run `tools/solve.py` or
  check clearances with `dyn.py`.

**Change the dial.** The dial is painted on a canvas in `dialCanvas()` in
`core.js`: chapter ring, numerals, the seconds and UP–DOWN sub-dials and the
inscription. The hands are `handGeo()` shapes in `core.js`, placed in the
"dial, hands, motion work" block of `movement.js`.

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

**Change the escapement.** Its geometry and motion are solved in `ESC` near the
top of `movement.js`, in a unit frame scaled to the escape wheel's radius.
`ESC.state(p)` returns the balance angle, detent lift, passing-spring bend and
escape-wheel progress for balance phase `p`. The 2-D walkthrough diagram
(`drawEsc2D` in `app.js`) draws from the same data, so the two stay in step.
The detent's plan outlines are `ESC.pieces` (turning about the point of
flexure) and `ESC.fixed`; their heights are set where the detent is built.
After a change, run `node escapement.js` in `tools/`. It measures lock, let-off,
overall, drop, roller shake and the horn clearance, and flags any outside the
manual's figures. To try a setting before editing, pass it on the command line,
for example `node escapement.js rT=0.29`. Record the results in the escapement
entries under "Estimated, not from the manual".

**Update the link-preview images** after visible changes: from `tools/`, run
`python social.py` for both, or `python social.py dial` / `python social.py movement` for one, then rebuild
from the root. For a custom shot: `python social.py --out name.png --view movement --drive --cam YAW PITCH DIST FOV`.
