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
| `index.html` | Page markup: stage, walkthrough card, controls, source notes |
| `css/style.css` | Layout, theme tokens (light and dark), controls, labels |
| `js/core.js` | Math helpers, materials and procedural textures (plate striping, wood grain, engraving), gear / hairspring / hand / mainspring geometry, dial artwork, cross-section shader patch |
| `js/movement.js` | The movement: layout constants, detent-escapement kinematics (`ESC.state`), pillar plate and bridges, going train with tooth phasing, fusee wheel and maintaining work, fusee, chain (instanced links) and barrel, balance, hairspring, detent, motion work, and the per-frame `update()` |
| `js/box.js` | Mounting box, lids, gimbal ring, chronometer case (bowl, bezel, crystal, shield plate), winding key |
| `js/app.js` | Renderer and shadows, camera and gestures, visibility/focus system, cross-sections, part picking and descriptions, labels, the eight-step walkthrough with its live diagrams, and the animation loop |
| `build.py` | Inlines CSS and JS into `dist/` |
| `tools/interference-check.js` | Voxel collision test used to find and remove overlapping parts |

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

## Sources

- *Manual for Overhaul, Repair and Handling of Hamilton Ship Chronometer*, NAVSHIPS 250-624, Bureau of Ships, 1948. Used for:
  - the structure: pillar plate, barrel bridge, upper and lower train bridges, balance lower bridge, escape upper bridge. The lower train bridge is screwed to the dial side of the pillar plate (Figs. 29, 67, 110);
  - the maintaining work and the winding stop-bar;
  - the detent, the balance and hairspring. The balance carries 10 screws in diametric pairs, 6 of 0.049 in, 2 of 0.080 in and 2 of 0.101 in head height, plus 2 timing and 2 vernier weights (parts list, p. 82). The impulse roller is 0.249 in (6.32 mm) across, as modelled;
  - the barrel cap with its five screws on the pillar-plate end (Figs. 26, 109), and the dust seal with three packing rings around the fusee arbor (Fig. 24);
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
- The detent geometry, which follows a standard spring detent layout. Two of its settings are simplified against the manual's figures (Sec. VIII, Ops. 7, 85–87): the jewels on the two rollers are 75° apart (manual: about 90°, adjustable), and the unlocking jewel lifts the detent over about 8° of balance arc (manual: overall 26–30°, lock about 6°).
- The balance rim diameter (29 mm), measured on the top-view photograph.
