---
name: measure-trace
description: Measure and trace a part's edges, holes, pins, lugs, notches, pillars and side profiles on photographs, video frames or manual figures to the accuracy the image allows, and turn them into the machined geometry (exact lines, arcs, drilled holes, pin stock, turned diameters, their relations) the model is built from. Use it for every refinement of a part's shape or place: whenever an outline, hole, pin, size or place of a Hamilton or Wempe part is measured, re-measured, refined or rebuilt from an image or from the owner's hand trace (tracer.html, .trace.json, .mm.json), and before writing any traced numbers into movement.js.
---

# Measuring and tracing a machined part

The goal is a part's outline, holes and profiles in model millimetres, each with its uncertainty, as the **machine made them**:
straight cuts, turned or milled arcs about a datum, drilled and reamed holes of standard sizes, fillets left by a cutter. That means
no polyline of noisy points and no shape drawn by eye. The project's rules still govern (CLAUDE.md "Build from measured lines",
"Source of truth"; memory `build-from-measured-lines`, `traced-arcs-are-circles`, `manual-shape-then-photo`,
`lower-bridge-two-levels`). This skill is the method; `tools/mfgfit.py` (in the model's `tools/`) is its engine.

## 0. Before you start

- Read the part's rows in `PROVENANCE.md` and its section of `RESOLVED.md`. Check whether the outline in `movement.js` is in the
  photograph's frame (`.map(PTr)`, `PT`, `PTri`; memory `photo-frame-constants`).
- Know the part's **levels**: a machined plate or bridge has few (the face, a step, a pocket floor). Every traced edge belongs to
  one level, and each level is its own plane (its own mapping to mm).
- The owner has no chronometer. Every reading comes from images. Say how sure each one is.

## 1. Choose the image

- **Face-on beats oblique.** A frame where the part lies flat facing the camera, anchored on its own holes (memory
  `oblique-camera-right-side`: one oblique camera put holes 3 mm out near the rim).
- **Sharpest of the neighbours.** Sheet the moment (`video.py sheet --from --to`) and pick by the variance of the Laplacian over
  the part's box, comparing frames of the same view only. Use 4K frames from `$MC_VIDEO/frames`. Never upscale, sharpen or recompress:
  save crops lossless with their offset (`crop_x0`, `crop_y0`).
- **Two frames that agree** (within about 1 mm absolute, 0.1-0.2 mm relative) before a reading is called sure.
- The prepared tasks for the base plates are in `E:\mc-video\oq\measure\NN_part\` (TASK.md, crop, holes JSON, guide).

## 2. Put the image in millimetres (calibration)

The tool order of preference:

1. **A flattened image** (rectified at the edge's level, `px_per_mm`, `x0`, `z0` in its mapping JSON, as `lowerbridge_36-01.json`):
   `mfgfit.py fit --map MAP.json`. One flattened image per level.
2. **A homography on the part's own holes, circle-geometric**: `mfgfit.py fit --calib holes_PART.json --link hole1=h3,hole2=h7,...`.
   The traced holes' *edge points* are held to the model holes' circles. A projected circle's ellipse centre is **not** the image of
   the circle's centre (the bias grows with tilt and hole size: Heikkilä 2000), so never anchor on ellipse centres. Link only holes
   the plate places: arbor bushings (C, T, F, E, Fu, Ba) and pillar screws, spread over the whole part. Use four or more for a
   homography, three for an affine. A homography fitted inside r 25 extrapolates badly to the rim: check a rim feature against a second frame.
3. **The tracer's own calibration** (tracer.html links holes; `derived.H_mm_to_px` in the `.trace.json`) is used when nothing else is given.
4. **A trace at a height h off the face** goes through its own homography from the tracer's px -> mm pairs at that h, done
   automatically. A plane at h maps by a homography too; never use the face's map for it (parallax: 8 mm proud is several % off).

Lens distortion: 4K video frames have some barrel distortion toward the corners. Keep the part in the middle third of the frame;
check a long straight edge for a bow (the line fit's residuals forming one arc). If it bows, the frame needs a camera
(`framecam.py`, `rimfit.py`), not a homography.

## 3. Trace (the owner, or you)

When an outline needs tracing, **ask the owner** (memory `ask-owner-to-trace`): name `tools/tracer.html` (or the Edge Tracer
artifact on the phone), the exact image, the holes JSON to load, the controls to link, and the edges with their names and levels.
Rules to give them:

- Place points **on the top edge where the face meets the wall**, not on the side wall or the shadow. Space them every 20-40 px on
  straight runs and every 10-15 px round tight curves. Press **K** at every sharp corner.
- **Holes as ellipses, 6-10 points round the edge**, not 3. Name each hole after the model hole it is (h7) or `hole_x1` if no model
  hole matches.
- **Say what each edge is**: set the tracer's **Feature** (an ellipse is a hole, pin, boss/pillar/collar, screw head or counterbore;
  a curve is an outline, lug, notch, pocket or side profile), or start its name with the type: `pin_`, `boss_`, `pillar_`,
  `collar_`, `head_`, `bore_`, `lug_`, `notch_`, `pocket_`, `profile_`. A pin is traced as an ellipse round its top edge at its
  level (h above the face). A pillar seen from above is one ellipse per collar, each at its height. A turned part seen side on is
  `profile_a` and `profile_b`, its two silhouettes, every shoulder corner with K. A lug or notch is part of the outline (found
  automatically), or its own open curve `notch_x` from mouth to mouth.
- A smooth hand curve is fine. The tool uses the *clicks* (and the image), never the drawn Catmull-Rom curve, and finds the lines,
  arcs and corners itself.

## 4. Fit: `mfgfit.py`

    python tools/mfgfit.py fit TRACE.json [--map MAP.json | --calib HOLES.json --link a=h1,...] \
        [--image IMAGE] [--centres DATUMS.json|L] [--holes HOLES.json] [--floor 1.0] [--out OUT.mfg.json] [--png OUT.png]

About 5-30 s. `python tools/mfgfit.py demo` (about 6 s) proves it on a synthetic machined plate and exits 1 if it misses.

What it does, and why:

1. **Sub-pixel edges (`--image`)**: the image is sampled along the trace's normals (±6 px). The channel is chosen per edge: luma,
   CIELAB b* (brass against steel), saturation (metal against the blue mat), R, G or B, taking the one whose step stands highest over
   its noise. Each profile is fitted with a blurred step, `a + b·erf((t − t0)/(s√2))` (a Gaussian-blurred edge model, in the spirit of
   Devernay 1995 and Trujillo-Pino 2013), giving t0 to a few hundredths of a pixel on a clean edge. A point is kept only where the step is
   clear (contrast over 4× its noise), single (no second edge in the window) and of the edge's common polarity. Stray finds
   (scratches, the wall's shadow, dust) are dropped by 3 MADs from a sliding local circle. Where the image shows no edge for over
   25 px, the hand's own points carry that stretch. Samples within 7 px of a K corner are left out (the blur rounds a corner), and points
   are thinned to one per two blur widths (closer ones share their errors).
2. **Segmentation into lines and arcs** by dynamic programming on BIC (χ² + k ln n). Arcs come from the hyper-accurate algebraic fit
   (Al-Sharadqah & Chernov 2009), costed in O(1) from prefix moments, and every primitive is then refined by geometric least squares.
   Two **machining priors**: an arc turning under 15° must be concentric with a datum, else it is a straight cut; no arc or fillet
   below two blur widths (the image can't show it). Neighbours that are one primitive are merged; a line with no point of its own gives
   way to the fillet test.
3. **Machining relations, each tested and kept only where BIC allows** (first by the linearised constrained test,
   Δχ² ≈ gᵀ(G C Gᵀ)⁻¹g, then by a full solve, best first):
   - tangency at a join (a fillet's run-out), and a **fillet inserted** at a sharp line-line corner;
   - **concentric**: arc or hole with a named datum (`--centres`), or with each other;
   - **equal radii** (one cutter, one turning setting);
   - **parallel / perpendicular** lines, a line **radial through** a datum;
   - **a hole's diameter a standard drill** (fractional, number, letter, metric), only when the measurement tells it from its
     neighbours (4 sd). Otherwise it lists the drills it is consistent with. Hamilton worked in inches: every size is also printed in
     inches and to the nearest 1/64 and 0.005 in.
4. **Joins**: sharp joins are the primitives' intersections, tangent joins their tangent points. Output is the exact path per object
   (lines and arcs with centre, radius and sweep) and a polyline sampled to 0.002 mm, in `OUT.mfg.json`. `OUT.png` shows the points,
   the fit and the residuals magnified.

**`--floor`** (px, default 1.0) is the edge's shape accuracy on a real frame (compression, demosaicing, the camera's fit, polish): the
statistics never assume the edge better than this. Read the residual plot. If residuals form long runs of one sign, or an edge breaks
into many short pieces, the floor is too low (try 1.5). If a feature you can see clearly on the image is merged away, it is too high.
For a clean synthetic or flattened plan, 0.3-0.5 is right.

**`--centres`**: give only the datums that make sense for the part, as a JSON `{name: [x, z]}`: the arbors it carries, the plate
centre for a rim, its own screw holes. `L` passes every arbor, and then a chance "line through the minute wheel's stud" can be accepted.
Judge every kept relation physically: equal radii between unrelated features, or a radial line through an arbor the part doesn't
touch, is a coincidence to drop (rerun with fewer datums or `--no-snap`, then add back what's real).

### Pins, lugs, notches, pillars

- **Pins** (`pin`): sized against pin stock and drill blanks (fractional, number, letter, metric 0.1). A drill blank is the usual
  steady pin.
- **Turned groups**: every circle and arc about one centre is reported together, e.g. a pillar's foot collar, shaft and top
  collar seen from above, a screw head in its counterbore, or a bushing in its oil sink. Concentricity is tested and kept by BIC.
- **Notches and lugs** are read off the fitted outline: a U of three cuts interrupting a straight run, or an arc doing so. The tool
  gives width between the sides, depth below the run, side lengths and corner angles, and which way it goes from the closed
  outline's orientation (a notch cuts in, a lug stands out). An inside corner's radius is the cutter's, and equal ones across the
  part are kept as equal radii (one cutter).
- **Profiles** (`profile`): a turned part side on. The axis comes from the two silhouettes' mirror symmetry. Each side is then cut
  into cylinders, cones, shoulders and rounds, and every **diameter is taken from both edges at once**: one edge about another
  part's axis misled the fusee cone by 1-1.5 mm (memory `silhouette-both-edges`). Lengths along the axis are as good as the frame's
  scale there.

### `find`: round features without tracing

    python tools/mfgfit.py find IMAGE --map MAP.json [--holes holes_PART.json [--search 0.6]] [--rmin 0.2 --rmax 3]

The tool looks at each model hole's place (`--holes`), or anywhere by Hough circles. Each candidate goes through edge points on
120 rays, a RANSAC circle, the erf refinement, then the blurred-disc model. It reports hole or pin by the contrast (dark or bright
inside), the centre against the model's, the diameter and the drill or stock it is. It writes a `.found.mm.json` that `fit` takes,
so the round features need no hand tracing on a flattened image; trace only the outlines.

### Accuracy, measured (the demo and the bias table)

- **Round features face on** are fitted by the exact Gaussian-blurred disc model, `ncx2.cdf((R/s)^2, 2, (d/s)^2)`: centre, radius,
  blur and the light's tilt in one least squares over the ring's pixels. On exact renders, radius errors were within 1-2 sd
  (under 0.01 px) at every radius from 3 to 40 px and blur 1.2-2 px. An edge found along each normal reads a small circle
  0.1-0.3 px small at R 5-8 px, and the textbook s^2/2R correction would be wrong for it (it over-corrects). So the disc model is
  what holes and pins go through.
- **Straight edges and large arcs** (erf along the normal): about 0.1 px on clean synthetic edges. On real 4K frames the shape
  accuracy is limited by the frame, not the locator: `--floor 1.0` px (0.025 mm at 40 px/mm).
- **The demo plate** (10 lines, 6 arcs, a notch, 3 drilled holes, a pin in a collar, a pillar side on) came back with every radius
  within 0.02 mm, holes and pin to 0.0001-0.0003 mm with the right drill and stock named, the notch 2.997 x 2.000 (drawn 3 x 2),
  the pillar's diameters within 0.004 mm and its axis within 0.005 deg.
- What the tool can't fix: the calibration (the plane's map to mm) and the camera. Those dominate on real frames, typically
  0.05-0.3 mm absolute, which is why two frames are fused (below) and anchors are plate-placed holes.

### `match`: points clicked on hole centres, named and measured

    python tools/mfgfit.py match TRACE.mm.json --holes holes_PART.json --image CROP.png [--arc NAME:i0-i1=x,z,r]

For a trace of unnamed points (each a feature's centre) and no calibration: every pair of points against every pair of model holes
seeds a similarity (mirrored or not), the 25 best each grown by optimal assignment (affine until the matches cover half the part, then a
homography), each matched point snapped to its hole's edge (erf, then the blurred-disc model), and the final map fitted by a Cauchy
M-estimator, so points off the face (a pillar's top, a screw head, a proud bushing) lose their weight without a consensus threshold.
RANSAC/MAGSAC were tried and fail here: with the model itself half a millimetre out in places, they lock onto small degenerate subsets.
`--arc` holds a traced stretch to a known circle (the bridges' rim, r 38.8 about C), which ties a map whose holes cluster on one side:
on 13:03.5 it turned a "right horn 1-2 mm out" into agreement. Prints model against measured for every hole, the points no model hole
explains, and each traced big circle in mm; writes a `.matched.mm.json` that `fit` takes. Click centres only on the face; a feature
standing above it (pillar tops, screw heads, bushings proud of it) needs its level h, or is left out.

### `fuse`: one part on two frames

    python tools/mfgfit.py fuse A.mfg.json B.mfg.json [--tol 0.05]

B is brought onto A by a similarity on their common round features (a scale far from 1 means one frame's scale is off), then each
primitive is compared: circles by centre and radius, lines by angle and offset, against 3 combined sd or `--tol`. Agreeing ones
are averaged by their variances. A reading is **sure** only when two frames agree.

## 5. Read the result critically

- Each primitive's **rms against the floor**, its **sd** (centre, radius) and its **n**. An arc held by 3-5 points has a loose radius:
  report it with its sd.
- **Holes**: centre against the model's hole (`--holes`), diameter and drill reading. A hole off by more than ~0.3 mm on a face-on
  frame, or off in the same direction as its neighbours, means the calibration, not the hole.
- **Fillets and small radii a hand trace can't resolve**: a 3-4 point corner at σ 0.03 mm can't tell r 0.5 from sharp. Say so;
  don't invent the radius. Inside corners of a milled pocket can't be sharp (a cutter's radius). If the image can't show it, keep it as
  an estimate in the README's "Estimated" section, or take it from the manual's figure (memory `manual-shape-then-photo`).
- **Second frame**: fit the same part on another frame and `fuse` the two fits. Agreement within 3 combined sd (or 0.05-0.1 mm)
  makes the reading sure.
- **Bows**: a straight edge reported bowing (its ends against its middle, over 3 sd) is the lens or the camera fit, or a real
  curve. Check it on the other frame before believing either.

## 6. Build it into the model

- Use the exact primitives: `extrude()` outlines made of the arcs (centre, radius, sweep) and lines, with **shared vertices** at
  joins. No polyline through traced points, and no near-coincident points (snap within 0.25 mm; memory `lower-bridge-two-levels`).
- The comment beside the constant names the source (video ID and mm:ss or photograph), the frame's calibration (map or holes linked,
  rms), the tool and floor, and each primitive's numbers: e.g. `// KLUwI2UUCMQ 13:04.4, holes h10,h2,h12,h14 (0.04 mm); mfgfit floor
  1.0 px: rim arc r 38.80 ±0.05 about C (concentric kept), horn line 112.4°, fillet r 1.14 ±0.03 (= the lug corners', one cutter)`.
- Watch for photo-frame constants (`.map(PTr)`): write movement-frame numbers only where the line has no mapping.
- Commit the trace (`tools/traces/NAME.trace.json`) and the `.mfg.json`, so the numbers are reproducible (memory `owner-hand-traces`).
- Update the part's row in `PROVENANCE.md` (outline M, frame, certainty) and the README's "Estimated" section for what stayed estimated.

## 7. Check

- `isolate.py PART --ref FRAME` (or `photocompare.py`) beside the real part, and say what matches and what differs (the stop hook
  insists).
- `solids.py`, `fine.py`, `holecheck.py`, `audit.py`, `exploded.py`, `bom.py` after any geometry change (CLAUDE.md's times);
  `contacts.py --write` if `fine.py`'s tables change.

## Pitfalls seen in this project

- Ellipse centres used as hole centres (biased under tilt); rims held at an assumed radius (stretched 1-3 mm toward the rim).
- One-edge silhouette readings about another part's axis (memory `silhouette-both-edges`).
- Writing movement-frame numbers into a `.map(PTr)` constant (mapped twice).
- A polyline through a hand trace (its wobble becomes the part); hulls and bands in place of machined levels.
- Trusting a statistic over the image: always look at the residual plot and the isolate render.
