# The Marine Chronometer, working

Interactive 3D model of a two-day fusee marine chronometer with a spring detent
escapement, running in real time inside its gimballed case and mounting box.
Built with three.js r128 (loaded from cdnjs); no build tools are required.

## Run

Open `index.html` in a browser. Everything loads from local files, except
three.js (from cdnjs) and the fonts (from Google Fonts).

`dist/chronometer-working-model.html` is the same thing as one self-contained
file. Regenerate it after editing with:

    python3 build.py

## Files

| File | Contents |
|---|---|
| `index.html` | Page markup: stage, walkthrough card, controls (View, Time, Display, collapsible Cross-section and Variants), the About dialog with sources and method |
| `css/style.css` | Layout, theme tokens (light and dark), controls, labels |
| `js/core.js` | Math helpers, materials and procedural textures (plate striping, wood grain, engraving), gear / hairspring / hand / mainspring geometry, dial artwork, cross-section shader patch |
| `js/movement.js` | The movement: layout constants, detent-escapement kinematics (`ESC.state`), pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate), winding key |
| `js/app.js` | Renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, and the animation loop |
| `build.py` | Inlines CSS and JS into `dist/` |
| `tools/interference-check.js` | Voxel collision test used to find and remove overlapping parts |
| `tools/audit.py`, `tools/geometry-audit*.js` | Geometry audit: overlapping or unsupported screws, loose arbor ends, coplanar faces, isolated parts |

## Controls

Speed: the presets, or any value from 0.01× to 10,000× on the Custom slider or typed in; the space bar stops and restarts. Right-click a part to fade or hide it; right-click empty space to bring hidden parts back.

## Testing

Append `?snap` to the URL to switch off camera and state easing. Views then settle
immediately, which is useful for automated screenshots.

## Coordinates and units

Millimetres. Movement frame: dial side is +y, 12 o’clock is −z, 3 o’clock is +x.
Arbor positions are in `L` at the top of `movement.js`.

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
  - the detent, the balance and hairspring. The balance carries 10 screws in diametric pairs, 6 of 0.049 in, 2 of 0.080 in and 2 of 0.101 in head height, plus 2 timing and 2 vernier weights (parts list, p. 82). The impulse roller is 0.249 in (6.32 mm) across, as modelled;
  - the barrel cap with its five screws on the pillar-plate end (Figs. 26, 109), and the dust seal with three packing rings around the fusee arbor (Fig. 24);
  - the gimbal mounting (Figs. 1, 94, 106): a flat ring hung on two pivot screws through the box sides (washer inside, lock nut outside), the case hung in it on front and rear pivot screws into brackets on the case, support straps at 3 and 6, the gimbal latch at the front right and the key at the back right;
  - the dial markings, winding figures and part numbers. The UP–DOWN scale runs clockwise round the bottom of its sub-dial from UP (upper right) to DOWN (upper left), so winding turns the hand counterclockwise back to UP (Fig. 107, Sec. III).
- New-old-stock Hamilton Model 21 pillar plate listing: 87.57 mm diameter, 3.86 mm thick.
- chronometerbook.com, post 4: W. Rawlings' plan of the Model 21 escapement.
- chronometerbook.com, post 30: escape wheel specification of 16 teeth, 13.14-13.18 mm diameter, 1.27-1.32 mm thick.
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
5. **Hidden wheels.** The third-wheel and escape-wheel positions and per-stage modules (0.29, 0.30, 0.31) are solved so every arbor clears every wheel, the barrel and the pillars. The escape wheel sits 10.2 mm from the balance, per the Rawlings plan.
6. **Collision check.** `tools/dyn.py` with `tools/interference-check.js` checks every closed part at 0.4 mm through a full escapement cycle. Only intended joints remain.
7. **Visual check.** `tools/p3fit.py` renders the model from the top-view photograph's camera. The result is `verification/topview-comparison.png`.

The tools need Playwright with Chromium. Open the page as `index.html?snap&qa`.

## Estimated, not from the manual

- Tooth counts of the centre, third and fourth wheels and pinions. They are chosen to give the half-second train's ratios. The escape wheel (16) is Hamilton's; the 96/14 first stage reproduces the manual's seven key half-turns per 24 h.
- Dimensions and positions, estimated from the figures and a 4-inch dial.
- The fusee profile and the wind indicator ratio.
- The mainspring’s coils, which are drawn schematically.
- The detent geometry, which follows a standard spring detent layout. Hamilton's stop button, two-part detent spring and lengthwise depth adjustment are not modelled. The detent's lift, the wheel's release and the passing spring's bending are solved in `ESC` from the discharge jewel's contact with the passing spring's tip (the spring projects past the horn, so the jewel never touches the horn). Against the manual's figures (Sec. VIII, Ops. 7, 85–87): the jewels on the two rollers are 78° apart (manual: about 90°, adjustable); the discharge jewel meets the spring at −22.4° of balance, releases the wheel at −13.7° (about 8.7° of lock; manual: about 6°) and leaves it at −8.2°; impulse ends at +20.7°, so the balance is in contact for about 43° (manual: overall 26–30°). Depth of lock 0.2 mm, detent lift at the horn 0.5 mm.
- The balance rim diameter (29 mm), measured on the top-view photograph.
- The upper train bridge's outline under the barrel bridge (drawn as a full disc) and its opening round the balance staff (r 9.1 mm).
- The sustaining pawl's position: 21 mm from the fusee axis, where the pawl reaches the sustaining ratchet and its arbor can run from the pillar plate to the train bridge clear of the centre wheel.
