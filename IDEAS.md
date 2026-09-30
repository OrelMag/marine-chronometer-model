# Ideas for improving the model and the application

A working list of ways to take *The Marine Chronometer, working* further: more
faithful to the Hamilton Model 21, more of its physics, new things to do with
it, better rendering, faster, easier to use, easier to maintain, and better
tested. Each idea says what it is, why it's worth doing, where it hooks into
the code, and what to watch out for.

The ideas are grounded in the code as of commit `219e4df` and in the 1948
NAVSHIPS 250-624 manual. Manual references are to its sections, operations and
figures, as elsewhere in this repository. Where an idea would add something the
manual doesn't specify, it is marked **illustrative**, and it would belong in
the model README's "Estimated, not from the manual" section once built.

Contents:
[Key findings](#key-findings) ·
[At a glance](#at-a-glance) ·
[Where things stand](#where-things-stand-measured) ·
[1. Fidelity to the Model 21](#1-fidelity-to-the-model-21) ·
[2. Physics and timekeeping](#2-physics-and-timekeeping) ·
[3. New things to do with it](#3-new-things-to-do-with-it) ·
[4. Rendering](#4-rendering) ·
[5. Performance](#5-performance) ·
[6. Interface and accessibility](#6-interface-and-accessibility) ·
[7. Code structure](#7-code-structure) ·
[8. Testing and verification](#8-testing-and-verification) ·
[9. Build and hosting](#9-build-and-hosting) ·
[10. The essay](#10-the-essay) ·
[11. Roadmap](#11-roadmap) ·
[12. Things to keep](#12-things-to-keep)

Effort: **S** is an evening or two, **M** a week or so, **L** several weeks.

---

## Key findings

What stood out from reading the code and the manual, and from the
measurements.

### Starting and setting don't follow the manual
- **The model starts itself.** A detent escapement isn't self-starting. After winding a run-down chronometer, the manual says to start it with "a single quick twist" of the box (Sec. III). The model just carries on after winding. See [2.1](#21-a-balance-that-can-stop-and-must-be-started). *(Done: the balance's amplitude is state; below the 39.2° the escapement needs, the train stops, and a stopped chronometer needs Twist to start.)*
- **The hands are set at will.** The manual says the hands "are never set except when the instrument is started" (Sec. III, Setting). The error is recorded and allowed for instead. The model's **Set the hands** changes them at any moment. See [3.1](#31-keep-it-on-gmt-and-set-it-as-the-manual-says).
- **The model runs on local time.** Navy chronometers were kept on Greenwich time; the model starts on the viewer's local time. *(Fixed: GMT by default.)* `23e9c58` See [3.1](#31-keep-it-on-gmt-and-set-it-as-the-manual-says).

### Section IX has ready-made features
The manual's Test and Adjustment section gives:
- the navigator's rate record: dial error, daily rate and mean daily rate (Table I);
- a 30-day performance test in six periods at 90, 72½ and 55 °F;
- the Bureau of Ships pass marks, for example 1.55 s/day for regulation.

Together they could become a rate book that turns the rate into an error in
nautical miles ([3.2](#32-the-navigators-rate-book)), and a simulated test that
fills in the manual's test card ([3.4](#34-the-30-day-performance-test)).

### Performance
- **Too many meshes.** The scene has 545 separate meshes, and 541 of them cast shadows. See [5.1](#51-draw-calls-merge-and-instance). *(Partly done: 389 meshes, and parts too small for the shadow map cast none, `347bf5b`; merging the static parts is open.)*
- **Knurling.** 155 of those meshes make up five knurled nuts: a body and 30 separate ridges each. See [5.1](#51-draw-calls-merge-and-instance). *(Done: one mesh per nut, `347bf5b`.)*
- **Slow texture at load.** Building the plates' striped (damascened) texture takes 204 ms of the 322 ms spent on materials. See [5.2](#52-startup-the-stripe-texture). *(Done: 4.4× faster, same pixels, `6c5ed75`.)*
- **Per-frame rebuilds.** The hairspring's geometry is rebuilt every frame whenever it can be seen. See [5.3](#53-dont-rebuild-geometry-every-frame-sm).

### Three copies of the escapement solver
> **Done.** One solver, `makeEsc` in `marine-chronometer-source/shared/escapement.js`, used by the model, the essay and `tools/escapement.js`. See 7.3. `813f7ae`

The escapement solver exists in three places:
- the model (`ESC` in `movement.js`);
- the checking tool, `tools/escapement.js`, which cuts it out of `movement.js`'s source text and runs it with `eval`;
- a hand-copied version in the essay.

Making it one shared function removes the copies. It also allows an in-page
"adjuster's bench": sliders for the escapement's settings, checked live against
the manual's figures. See [7.3](#73-make-esc-a-factory-and-share-it) and
[3.3](#33-adjusters-bench-the-escapement-live).

### No automated checks
- **Nothing runs on its own.** There is no continuous integration, although the checking tools exist. *(Done: see 8.1.)* `7f3668e`
- **The escapement check always reports success.** `node escapement.js` prints `!!` beside a figure out of tolerance, but always exits with success. A CI job would pass even when the escapement fails the manual's figures. *(Fixed: it now exits with 1.)* `813f7ae`

Giving it a failing exit code is the first thing to fix when setting up
automated checks on GitHub. See [8.1](#81-continuous-integration).

---

## At a glance

The fifteen ideas with the best return, roughly in order. Status as of 29 September 2026 (Stage 1 of the [roadmap](#11-roadmap) done).

| # | Idea | Area | Effort | Why | Status |
|---|---|---|---|---|---|
| 1 | [Start it with a twist](#21-a-balance-that-can-stop-and-must-be-started) | Physics | M | A detent escapement isn't self-starting. The manual says to start it with "a single quick twist" of the box; today the model just resumes |  |
| 2 | [Keep it on GMT; set it the manual's way](#31-keep-it-on-gmt-and-set-it-as-the-manual-says) | Features | S | Navy chronometers kept Greenwich time, and the manual says the hands "are never set except when the instrument is started" | Half: GMT by default `23e9c58`; setting the hands waits for 2.1 |
| 3 | [Navigator's rate book and longitude error](#32-the-navigators-rate-book) | Features | M | The chronometer's real job, straight from Sec. IX, Table I. Makes the rate panel mean something |  |
| 4 | [Adjuster's bench for the escapement](#33-adjusters-bench-the-escapement-live) | Features | M | `ESC` is already parametric and `tools/escapement.js` already measures it. Bring both into the page |  |
| 5 | [One parts registry](#71-one-parts-registry) | Code | S | Adding a part touches six tables in `app.js` today | Done `5e8c578` |
| 6 | [Make `ESC` a factory and share it](#73-make-esc-a-factory-and-share-it) | Code | S–M | Enables #4, removes the source-slicing in `tools/escapement.js` and the hand-copied solver in the essay | Done `813f7ae` |
| 7 | [Merge static meshes; stop shadows from tiny parts](#51-draw-calls-merge-and-instance) | Performance | S–M | 545 meshes, each with its own geometry; 541 cast shadows; 124 meshes are knurling on four nuts | Done: knurls, rim holes, tiny shadows `347bf5b`; merging all static parts open |
| 8 | [Stop rebuilding the stripe texture at load](#52-startup-the-stripe-texture) | Performance | S | 204 ms of a 322 ms `mats()` is one per-pixel JavaScript loop | Done `6c5ed75` |
| 9 | [Temperature and the two balances](#23-temperature) | Physics | M | The manual gives the test temperatures and the compensation figure; the split-rim variant could visibly curl |  |
| 10 | [30-day performance test](#34-the-30-day-performance-test) | Features | M | The manual prints the test card and the Bureau of Ships tolerances. A satisfying way to see the physics add up |  |
| 11 | [CI: build, escapement check, browser smoke test](#81-continuous-integration) | Testing | S | No automated checks today; the tools already exist | Done `7f3668e` |
| 12 | [Reduced motion, keyboard orbit](#61-accessibility) | Interface | S | No `prefers-reduced-motion`; the camera can't be turned from the keyboard | Done `c2af700` |
| 13 | [Shareable links](#62-shareable-links-and-remembered-state) | Interface | S | Put view, time, speed and picked part in the URL hash | Done: hash `cf07772`; remembered settings open |
| 14 | [A real fusee comparison](#22-the-fusee-earns-its-keep) | Physics | M | The fusee inset is constant by construction. Show what a going barrel would do |  |
| 15 | [Oiling and overhaul walkthrough](#35-overhaul-walkthrough-and-oiling-chart) | Features | L | Sec. VIII gives the operation order and an oiling chart (red oil and argon oil) |  |

---

## Where things stand (measured)

Measured on 29 September 2026 in headless Chromium (SwiftShader) on the
development machine, with `index.html?snap&qa`. The JavaScript timings are CPU
time and carry over to real browsers; frame rates under SwiftShader don't, so
none are quoted.

**Startup**

| Step | Time |
|---|---|
| `mats()` (all materials and procedural textures) | 322 ms |
| of which `stripeTex()` (1024 × 1024 damascening map and normal map) | 204 ms |
| `buildMovement()` | 82 ms |
| `buildBox()` | 4 ms |
| Navigation to the loading overlay removed | 1.7 s |

**Per frame**

| Step | Time |
|---|---|
| `mv.userData.update()`, plain | 0.46 ms |
| with the hairspring rebuilt (`springOn`) | 1.04 ms |
| with hairspring and mainspring rebuilt | 1.11 ms |
| `springGeo()` alone | 0.94 ms |
| `ESC.state(p)` | 0.06 µs (table lookups) |

**Scene**

- 545 meshes: 285 in the movement, 260 in the box and gimbals.
- 545 distinct geometries (no two meshes share one) and 23 materials.
- About 188,000 triangles.
- 541 meshes cast shadows. With the shadow pass, that's over a thousand draw calls a frame.
- 308 meshes have a bounding radius under 1.5 mm.
- The biggest counts by part: gimbal ring 153 (four knurled nuts at 31 meshes each), balance 89 (60 rim holes plus screws), latch 38.

**Sizes**

| File | Raw | gzip |
|---|---|---|
| `chronometer-working-model.html` | 1,169 KB | 514 KB |
| of which `three.min.js` | 589 KB | 145 KB |
| of which the illustration (WebP, inlined as base64) | 130 KB | about the same |
| of which the five fonts | 120 KB | about the same |
| `marine-chronometer.html` (essay) | 910 KB | 353 KB |

**Escapement** (`node tools/escapement.js`): every figure is within the
manual's tolerances: lock 6.1°, let-off 11.9°, overall 27.8°, drop 2.1°,
roller shake 0.055 mm, horn clearance 0.25 mm.

---

## 1. Fidelity to the Model 21

These close gaps the model README already lists, or add parts the manual
describes that aren't modelled yet.

### 1.1 Re-fit the plan positions with the new heights (M)
The README notes that `L` was fitted before the heights were re-stacked from
the side photograph, and that `bundle.py`, `fit.py` and `unproj.py` still use
the old heights.
- **Do:** update the heights in those tools and re-run the two-camera fit.
- **Decide on a threshold:** re-running `bundle.py` already puts the fusee and barrel within 0.8 mm and the balance within 2 mm, "about the run-to-run spread". Move `L` only if a change stands clear of that spread over several restarts. Record the spread in the README.
- **Then:** `dyn.py`, `audit.py`, `p3fit.py` and `node escapement.js`. The escape wheel's 9.40 mm centre distance is solved from roller shake, so it must stay fixed.

### 1.2 The train-bridge screw with nothing under it (S)
*Still open. Screws now have their shanks, so this one is drawn threaded into the bridge alone. A pillar can't go under it: the fourth wheel is there.*
One train-bridge screw, at (−8.5, 27.7), has no pillar under it ([movement.js:206](marine-chronometer-source/chronometer-working-model/js/movement.js#L206)). Two ways to fix it:
- If the top-view photograph shows a pillar there, add it. The manual gives three screws per bridge, and the model has three train pillars plus one barrel pillar.
- Otherwise, move the screw onto a pillar and note the change.

`audit.py` should then stop flagging it.

### 1.3 Outlines the photographs don't show (M)
- **Balance lower bridge:** a stadium in the model; "stepped and lobed" in Fig. 110. Trace Fig. 110 through the same kind of similarity transform `p3map.json` uses.
- **Upper train bridge under the barrel bridge:** drawn as a full disc, cut round the barrel and with a pocket round the fusee's top (the fusee is open to the barrel bridge, Figs. 24, 77). Figs. 29 and 67 show its whole outline, a crescent; trace it (or an overhaul photo with the barrel bridge off), keeping the pocket's clearances and the top-view photograph's visible edge. *(Partly done: the pocket is now a cut round the fusee open to the rim (r 17.8), which leaves the fusee clear as Fig. 24 shows. The crescent's outer edge and its keyhole opening are still to trace.)* *(Done: the crescent is traced on Fig. 67 through an affine fit (`tools/train_bridge.py`), with its notch round the fusee, the horn and the keyhole; the keyhole's lobes are left out.)*
- **Detent foot and support block:** shortened to clear the train pillar. Once 1.1 is done, check whether the pillar or the block is really the one out of place.

### 1.4 The balance's collet, stud and upper setting (S–M)
- **Collet and stud:** the manual (Sec. II, Fig. 5) says the collet's "curious shape" came from counterpoising experiments to remove position errors, and the stud's attachment to the cock is "unusual". Today the collet is a hexagonal prism. Model both after Fig. 5, with the collet clamp and wedge pin of Fig. 6. *(Done: the slotted collet with its plate, tongue, clamp and wedge pin, and the stud as a bar under the cock on the stud screw and a steady pin (Figs. 19, 84, 85), with its own clamp and wedge pin. The spring's ends reach the clamps, and it is 5.9 mm tall to clear the stud's bar. The collet's counterpoise is not modelled.)* `91dd568`
- **Upper pivot setting:** the setting in the cock is "not drawn: the staff is 0.7 mm from the cock's edge" ([movement.js:346](marine-chronometer-source/chronometer-working-model/js/movement.js#L346)). That suggests the traced cock outline is slightly off near the endstone. Re-check the parallax shift in `cock_outline.json`. *(Done: the setting and its olive-hole jewel are drawn in the cock under the endstone cap, with the staff's pivot in the jewel. Rather than re-fit the tracing, the nose is rounded out to a boss 2.4 mm in radius about the staff, as the photographs show the endstone about 3 mm inside the edge; a re-trace of the nose would replace it.)* `2acc042`

### 1.5 Hand-setting square, balance locking arm, shipping wedges (S each)
*The balance locking arm is done: arm, screw, washer and stop pin, Locked / Unlocked under Stopping and starting, and it stops the balance. The square is drawn too (`ad1762d`); the wedges are still to do.*
- **Hand-setting square:** Fig. 8 shows the key on "the bright, square arbor at the center of the dial", turned by its shank to set the hands. Add the square to the hands' centre stack and use it in [3.1](#31-keep-it-on-gmt-and-set-it-as-the-manual-says). *(Done: the square is drawn on the minute hand's pipe, the fusee square's size so the one key fits both. Using it to set the hands waits for 3.1.)* `ad1762d`
- **Balance locking arm (Fig. 9):** later chronometers have a balance wheel locking arm, with locked and unlocked positions. Model it, with a toggle, as a part of the "Operation when received" story.
- **Shipping wedges:** before the arm, chronometers shipped with folded red plastic wedges between the balance rim and the train bridge (Sec. III). This could be an Easter egg in a "Received from storage" walkthrough step.

### 1.7 Screws, washers and weights from the parts list (S)
- **The manual's masses:** the moment of inertia in `R.timing` now uses the parts list's masses for the three screw sizes and the two weights (931 g·mm²). Still to do:
  - Sec. II gives balance screws "in six weights ranging from 100 mgs. to 300 mgs." and timing washers "in a range of six weights from 4 mgs. to 20 mgs". Map the parts list's three screw head heights onto the six weights.
  - Table II's screw changes imply about 1,100–1,300 g·mm², so the rim's section is probably too light.
  - The drawn screw heads (1.5 mm) are too small for their masses: they should be about 3–4 mm across.
  - Changing any of these moves `R.pitch`, not the rate for a turn. See "The rate panel" in the model's README for the clearance checks.
- **Timing washers:** add them as an option in the rate panel ([2.6](#26-a-fuller-rate-panel-sm)).

### 1.8 Wheel teeth (M–L)
- **Profiles:** `gearGeo` draws a generic trapezoidal tooth. Clock and chronometer trains use cycloidal teeth and pinion leaves with rounded addenda (the BS 978 Part 2 proportions are the usual reference). With true profiles, the close-ups would show real rolling contact, and `dyn.py` could check tooth-to-leaf clearance through a whole tooth pitch, not just in phase.
- **Tooth counts:** the centre, third and fourth counts are estimates. Count teeth on the highest-resolution photographs (the fourth wheel and the centre wheel's outer rim are often visible), or ask on chronometerbook.com. Update `TRAIN` and every place the counts appear as text (see [7.2](#72-derive-every-train-number-from-train)).

### 1.9 Chain and mainspring detail (M)
- **Chain:** the links are alternating instanced boxes. A fusee chain is outer plates and inner plates riveted. Build one link as a small merged geometry with rivet heads. The end fittings (a pin at the fusee's large end, a hook at the barrel) are drawn; make the barrel-end hook visible in the "Stored energy" step.
- *Mainspring: done.* It is drawn 0.0165 in thick, in two packs (arbor and wall) joined by a free turn, with the counts from the barrel and arbor radii (`mainspringGeo`). Its length is still estimated (600 mm, the half-room rule). The parts list gives no length or width; a measured spring would settle the set-up (0.30 turn in the model).

### 1.10 Oil sinks, jewel settings, endstones (S)
*Settings and endstones are done: the escape wheel's upper and lower endstone caps, the balance's lower setting and endstone cap, and the fourth wheel's upper setting. 13 of the 14 jewels are drawn; the balance's upper hole jewel isn't (1.4). Oil sinks are still to do.*
Jewels are a gilt ring plus a ruby ring. Add the oil sink (a shallow cone) on the settings that take oil, and cap jewels where the manual has them. This pairs with the oiling chart in [3.5](#35-overhaul-walkthrough-and-oiling-chart).

---

## 2. Physics and timekeeping

Today everything is kinematic: the balance phase is `frac(tSim/0.5)`, the
amplitude is a constant 255° each side, and the rate changes only through the
timing weights' moment of inertia. That is right for most of what the page
shows. These ideas add the dynamics where they teach something.

### 2.1 A balance that can stop and must be started
*Partly done: the amplitude is state (`H.amp` in `app.js`), not an integrated oscillator. It runs down freely when the train is held, against the balance locking arm at once, and builds up after Twist to start; the escapement needs `ESC.AMIN` (39.2°, worked out by `makeEsc`) to keep going, so the train stops below it and at run down. Still to do: the equation of motion below, with the impulse's torque, and the rate against amplitude that would follow.*

**What.** Treat the balance as a damped torsional oscillator driven by the escapement:

`I·θ″ + c·θ′ + k·θ = τ(θ, θ′, state)`

- `I`: the balance's moment of inertia (930 g·mm², already computed).
- `k = I·(2π/0.5 s)²`: the hairspring's stiffness, about 1.5 × 10⁻⁴ N·m/rad.
- `c`: losses, set so the amplitude settles at the manual's 1⅜–1½ turns.
- `τ`: the impulse torque while `ESC` says a tooth is on the impulse jewel, minus the small unlocking resistance.

The amplitude then emerges from the model instead of being fixed.

**Why.**
- **Running down.** When the power runs out, the balance now snaps to 0° ([app.js:451](marine-chronometer-source/chronometer-working-model/js/app.js#L451)). A real one decays over a few swings until it can no longer unlock the detent, and stops.
- **Starting.** A detent escapement isn't self-starting. After winding a run-down chronometer, the manual says: "grasp the mounting box with both hands … and give the whole unit a single quick twist to the right or the left" (Sec. III). Today the model resumes by itself. A **Twist to start** button (or a quick drag of the box) that kicks the balance would be a memorable, correct detail. It is also how the manual sets a chronometer to the exact second ([3.1](#31-keep-it-on-gmt-and-set-it-as-the-manual-says)).

**How.**
- Integrate in the frame loop with a fixed substep: at 2 Hz, 1 ms substeps with semi-implicit Euler or RK4 is plenty.
- Only at speeds ≤ 1×. Above that, keep today's kinematic path and hold the amplitude at its settled value.
- `ESC.state(p)` is currently indexed by phase. Add a way to query by angle and direction; the `LI`/`PS` tables are already indexed by angle. The escape wheel's progress then comes from `bite(th)` while the tooth is in contact.

**Watch out.**
- Keep the kinematic path as the fallback, and the default for `?snap` screenshots.
- The escapement figures in the README don't change: they are geometric.
- The damping and impulse torque are **illustrative**. Calibrate them to the manual's motion and say so.

### 2.2 The fusee earns its keep
**What.** The fusee inset plots spring pull, chain radius and torque. The torque line is 1 by construction, because the fusee profile `rf(m)` is defined as exactly the inverse of a linear pull ([app.js:394](marine-chronometer-source/chronometer-working-model/js/app.js#L394), [movement.js:461](marine-chronometer-source/chronometer-working-model/js/movement.js#L461)).

**Do instead:**
1. Give the mainspring a plausible torque curve: rising with turns, with coil friction and a set-up of a turn or so. **Illustrative**; say so.
2. Keep the fusee's drawn profile as it is.
3. Plot the resulting torque at the fusee wheel. It will be nearly flat, with the small residual a real fusee has.
4. Add a **Without the fusee** toggle that plots what a going barrel would deliver over 56 h. With [2.1](#21-a-balance-that-can-stop-and-must-be-started), it also shows the balance's amplitude falling off in the last day.

**Why.** It shows why the fusee is there, rather than asserting it.

### 2.3 Temperature
**What.** A temperature slider (the manual's test temperatures are 55, 72½ and 90 °F) with a rate readout and a rate-against-temperature curve.

**The Hamilton uncut balance.** Elinvar hairspring, steel rim on an Invar arm.
- The manual explains the compensation: the rim's diameter at the arm ends "remains almost constant", while "other portions of the rim move outward with increases in temperature". Screws are moved toward or away from the arm to adjust it.
- It can be adjusted "to errors of less than 0.02 seconds per day per degree F" (Sec. II).
- Model the rate as a small linear coefficient that depends on the screws' positions, with a slight curvature (**illustrative**).
- Let the user move a pair of screws along the rim and watch the coefficient change.

**The split bimetallic variant** (already in Variants).
- Animate the rim's free ends curling inward with heat, with an exaggeration factor (×50 or so) clearly labelled.
- Show the parabolic secondary error (the "middle temperature error"): correct at two temperatures, off between them.
- This is the story of why Elinvar and the uncut balance were an advance, told with the model's own two balances.

**Where.**
- `R.balS` bands for the curl.
- `R.timing` (extend it to return the moment at a temperature).
- `rateK` in `app.js`.

### 2.4 Isochronism and escapement error
- **Rate against amplitude.** With [2.1](#21-a-balance-that-can-stop-and-must-be-started), plot rate against amplitude. The manual's isochronism check compares "the 12 hour rate and one-half the 24 hour rate at 72½ °F" (Sec. IX); reproduce that number.
- **Escapement error.** The impulse runs from −20.7° to +20.8°, centred on the dead point, and the unlocking comes before it (−27.4° to −21.3°). Airy's result says a push with the motion before the dead point makes the balance gain and one after makes it lose. A resisting force before it makes it lose.
- **An interactive version.** Offset the impulse jewel's angle (`aI`), and see the rate change and the escapement figures move. This belongs on the adjuster's bench ([3.3](#33-adjusters-bench-the-escapement-live)).

### 2.5 Gimbals with inertia (M)
**What.** Ship motion now counter-rotates the ring and bowl exactly, so the movement stays perfectly level ([app.js:460](marine-chronometer-source/chronometer-working-model/js/app.js#L460)). Model the bowl and ring as two coupled damped pendulums driven by the box's motion instead.
- They then lag, and overshoot at some frequencies.
- A **Latch the gimbals** control (the latch is modelled but only shown released) would lock them. The movement then visibly tilts with the box. *(Done: Gimbals latched, under Display. The lever swings in through a slot in the ring to the keeper on the case (Fig. 106); ring and case are brought level with the box first and then tilt with it.)* `c04e4d9`

**Why.** It shows what the gimbals do, and where they stop working: a roll period near the bowl's own period.

**Watch out.** The bowl's mass distribution and pivot friction are **illustrative**.

### 2.6 A fuller rate panel (S–M)
- **Adjusters' tools.** Add balance screws and timing washers from the parts list (1.7) as further adjustments. The manual's timing operations use them alongside the weights.
- **Dial error against real time.** Show it in the HUD as the hands drift: "+3.5 s since set".

### 2.7 Tripping and setting (M, illustrative)
- **What.** A **Jolt** button, demonstrating the two classic detent faults:
  - *Tripping:* a shock lets the wheel escape an extra tooth, so the hands jump half a second.
  - *Setting:* the balance stops at a low amplitude.
- **Why.** It explains why the detent was kept to gimballed marine instruments and why the manual cares so much about the trip spring's condition (its Fig. 38 shows trip-spring wear).
- **Watch out.** Label it plainly as an illustration of a fault, not as how a sound Model 21 behaves.

### 2.8 Maintaining power under load (S)
While the key turns, only the sustaining spring drives the train, "enough to run the chronometer 5 to 10 minutes" (`INFO.spawl`). With [2.1](#21-a-balance-that-can-stop-and-must-be-started), the amplitude can dip slightly while winding and recover afterwards. The key-winding sequence already knows when winding starts and stops.

---

## 3. New things to do with it

### 3.1 Keep it on GMT, and set it as the manual says
**GMT.** *Done: GMT is the default, with Keep: GMT / Local time under Time, and the HUD names the zone. Setting the hands the manual's way waits for the dynamic balance (2.1).* `23e9c58`
- `tSim` starts at local time (`Date.now()/1000 - getTimezoneOffset()*60`, [app.js:124](marine-chronometer-source/chronometer-working-model/js/app.js#L124)), and **Now** does the same.
- A navy chronometer was kept on Greenwich time.
- Make **GMT** the default, with a Local option, and say which in the HUD.

**Setting.** The manual is emphatic: "the hands of a chronometer are never set except when the instrument is started", because a record of the rate and accumulated error is kept and applied instead (Sec. III, Setting). It gives two methods, and the model could offer both beside today's instant **Set the hands**:
1. **Forward only.** With the key on the square at the centre of the dial (1.5), turn the hands forward to half a minute behind the master time. Then advance the minute hand to the next mark as the master's second hand passes 60. The manual gives the maximum error of this method as 30 seconds.
2. **Stop and restart.** Stop the balance, wait until the master time "overtakes" the dial, and start it with a twist at that instant. Because the escape wheel is locked, "the second hand is exactly upon the second or half second" when stopped. Needs [2.1](#21-a-balance-that-can-stop-and-must-be-started).

### 3.2 The navigator's rate book
**What.** A panel reproducing the manual's "Computation of Rate" (Sec. IX, Table I), after the *Navigational Timepiece Record* (NavShips 3587).
- Each simulated day, a "radio time signal" comparison records the dial error to the nearest half second, because the hands step in half seconds.
- The panel computes the daily rate, the mean daily rate over several days, and the mean deviation of daily rate, exactly as Table I does.
- It adds a Remarks column for "started", "set", "not wound" and "moved".

**The payoff line.** Longitude error, if the navigator used the dial reading uncorrected:
- 4 seconds of time is 1′ of longitude, which is 1 nautical mile at the equator.
- It is `cos(latitude)` nautical miles elsewhere; add a latitude input.

Example: "After 30 days at +1.2 s a day, uncorrected: 36 s, 9′ of longitude, 7.8 nmi at 30° N."

**Why.**
- It connects the rate panel to what chronometers were for.
- It shows why a steady rate matters more than a zero rate. This is the manual's own point.

**How.**
- The model already has `rateK` and `rErr`.
- Add a simulated day counter that runs at 3600× or faster, with observational noise of ±¼ s from reading to the half second.

### 3.3 Adjuster's bench: the escapement, live
**What.** A panel of sliders for the escapement's settings, each redrawn live in the 3D model and the 2-D diagram, with the manual's figures checked as you move them:

| Slider | Constant | Figures it moves |
|---|---|---|
| Trip-spring tip | `rT` | overall, let-off |
| Discharge-jewel reach | `rd` | lock, horn clearance |
| Depth of lock | `dL` | lock, drop |
| Locking-jewel draw | `DRAW` | draw (8–12°) |
| Discharge-jewel angle | `aD` | lock, drop, angle between the jewels |
| Impulse-jewel angle | `aI` | drop, impulse centring |

A results table beside them shows lock, let-off, overall, drop, roller shake and horn clearance against Ops. 84–88 and 97, green or red. This is `tools/escapement.js` `measure()` ported to the page.

**Why.**
- It turns the escapement from a thing to watch into a thing to understand: why lock must be about 6°, what happens to drop when you deepen the lock.
- It exercises the solver the project already built and verified.

**How.** Needs [7.3](#73-make-esc-a-factory-and-share-it) (`makeEsc(params)`). Then:
- Rebuild `ESC` on slider input. The table build is 5,001 steps per swing direction and fast.
- Rebuild the detent's plan outlines (`ESC.pieces`) and the passing spring.
- Keep **Reset to the model's settings**.

**Watch out.** Some combinations make the solver fail: the tip never slides off, or the wheel never releases. Detect this and show "the escapement would not run" rather than drawing nonsense. That is a lesson too.

### 3.4 The 30-day performance test
**What.** A simulated overhaul-station rating test, following Sec. IX:
- A test room at 72½ °F and 40 % relative humidity.
- Six periods of five days, at 90, 72½, 55, 55, 72½ and 90 °F.
- A daily reading on the Hamilton electronic comparator (Fig. 95), whose accuracy "is well under ±0.02 seconds".
- The panel fills in a replica of the **Factory Performance Test Card** (reproduced in the manual) and grades it against the U.S. Bureau of Ships tolerances:

| Criterion | Tolerance |
|---|---|
| Regulation: largest mean daily rate of any period | 1.55 s/day |
| Temperature compensation, 35 °F difference | 1.20 s/day |
| Temperature compensation, 17½ °F difference | 0.75 s/day |
| Recovery: largest difference between mean rates at the same temperature | 0.70 s/day |
| Mean deviation of rates | 0.50 s/day |
| Largest difference between two daily rates in one period | 0.75 s/day |
| Isochronism: 12-hour rate against half the 24-hour rate | 0.50 s/day |

**How.**
- Combine [2.3](#23-temperature) (temperature coefficient from the screws' positions) with [2.4](#24-isochronism-and-escapement-error) (isochronism) and a small random daily variation.
- Let the user adjust the screws between runs to pass the test. That makes it a small puzzle with a real-world answer.

**Watch out.** The daily noise model is **illustrative**. Keep it modest, so that a well-adjusted balance passes comfortably, as the manual says these instruments did.

### 3.5 Overhaul walkthrough and oiling chart
**Overhaul.** A second walkthrough that follows the manual's own sequences to take the movement down (Sec. V, Disassembly) and put it back together (Sec. VIII, Reassembly):
- Each step names the operation number, the part (with its Hamilton number) and the tool (the manual numbers its tools, e.g. "Tool No. 96").
- Each step animates the part lifting away along its arbor.
- The exploded view already has the per-part offsets (`part(name, off)`). The overhaul view would sequence them one at a time in the manual's order, instead of all at once.

**Oiling.** An **Oiling** overlay marks every oiling point with a coloured drop and its oil:
- Hamilton No. 47 Red Oil, or the argon oil.
- As the manual's reassembly steps specify, e.g. Op. 46 "Using argon oil, oil the fusee upper bushing", Op. 47 "Using red oil, oil the fourth upper jewel", Op. 67 "Oil escape upper jewel with red oil".
- Transcribe the manual's oiling diagrams (around Ops. 46–51) into a table of `{part, point, oil, op}`.

**Why.** The manual is an overhaul manual; this is the part of it the model doesn't yet use. It's also what restorers would come to the page for.

### 3.6 Provenance overlay: colour by source (S–M)
**What.** A third colouring mode beside Normal and Colour by part: every part coloured by where its shape and size came from.

| Source | Colour | Examples |
|---|---|---|
| The manual | green | the detent plan, the adjustment figures, the impulse roller |
| Measured on photographs | blue | the bridge outline, the cock, the heights |
| Solved for clearance | amber | the third wheel's position, the modules |
| Estimated | grey | tooth counts, the fusee profile, the mainspring |

Tapping a part adds a "Source" line to its info card.

**Why.** The project is scrupulous about this distinction, and the README maintains it by hand. Making it visible is honest and unusual. It also makes the README's "Estimated" list checkable at a glance.

**How.** A `src` field in the parts registry ([7.1](#71-one-parts-registry)). Some parts need finer grain, such as the detent: its plan is sourced, its thicknesses estimated. Allow a short note.

### 3.7 Compare with the manual's photograph (M)
**What.** Fig. 2 is a U.S. government photograph (public domain), and the project already has a fitted camera for it (`verification/camera-fit.json`, `window.__cam`).
- Add a **Compare with Fig. 2** view that moves the camera to that fit.
- Overlay the scan with an opacity slider, or a split wipe.

**Why.** It shows the measurement method working, in the page, for anyone.

**Watch out.**
- Use only the manual's own figures. The photographs in `References/` are in the repository for the fitting tools, but their rights are unclear, so they shouldn't appear on the published page.
- Check the scan's quality before committing to it.

### 3.8 A watchmaker's loupe (M)
**What.** Hold **L**, or long-press on touch, to show a circular magnifier at the cursor. It renders a second camera with a narrower field of view into a scissored viewport.

**Why.** The escapement is 9 mm across inside a 200 mm box. Today, seeing it means leaving the view you're in.

**How.** `renderer.setScissorTest`, `setViewport`, and a second `PerspectiveCamera` that shares the scene. It costs one extra render of a small viewport, so drop shadows from that pass.

### 3.9 Measure (S)
Click two points to show the distance between them in millimetres and in inches (the manual's unit). Snap to arbor axes and screw centres. This is useful to anyone checking the model against a real movement, and to the project's own fitting work.

### 3.10 Hands-on controls (M)
- **Key:** drag in a circle to wind, half a turn at a time. It stops hard at the winding stop, with the stop-bar animation that already exists.
- **Balance:** with the movement out and stopped, drag the rim to twist it and let go. With [2.1](#21-a-balance-that-can-stop-and-must-be-started), it swings down, or picks up and runs if the escapement engages.
- **Lids and latch:** click the lids to open and close them. Click the gimbal latch to lock the gimbals ([2.5](#25-gimbals-with-inertia-m)).

### 3.11 Sound from the escapement's own events (S–M)
**What.** Today, the tick is filtered noise played once per half-second step, at speeds up to 1× ([app.js:318](marine-chronometer-source/chronometer-working-model/js/app.js#L318)). `ESC` knows the individual events:
- the discharge jewel meeting the trip spring;
- the release;
- the tooth dropping onto the impulse jewel;
- the lock.

Give each its own short synthesised click with a different spectrum, scheduled at its exact time with `AudioContext` timing rather than per frame.

**Why.**
- At 1× they merge into the chronometer's familiar single tick.
- At 1/20×, you hear the escapement come apart into its events, in step with what you see.

**Watch out.**
- Schedule slightly ahead with `ac.currentTime`, so frame jitter doesn't smear the rhythm.
- Keep it opt-in, as now.

### 3.12 At high speed, blur rather than slow down (S)
**Today.** Above 1×, the balance swings at a "viewable rate" unrelated to the model's time, and the detent and trip spring freeze (`s.lift=0; s.psDef=0`, [app.js:453](marine-chronometer-source/chronometer-working-model/js/app.js#L453)).

**Options:**
- Draw the balance as a motion-blurred disc (a few ghost copies spread over its real arc, with decreasing opacity) with the escape wheel stepping. That is truthful about what you'd see.
- Or keep the viewable swing but add a small "shown slowed" badge, so no one mistakes it for the real motion.

The About dialog mentions the slowed swing; the stage should too.

### 3.13 Export video and large stills (S)
- **Record:** a **Record 10 s** button using `canvas.captureStream()` and `MediaRecorder` (WebM), for teachers and for posting.
- **Large stills:** a **Save large** option that renders at 2–4× the current resolution into an offscreen target, for print and posters. **Save** today writes the canvas at screen size.

### 3.14 More walkthroughs (M each)
The walkthrough machinery (`TOUR`, `setInset`, `drawInset`) is general. Candidates:
- **Received from storage:** unpacking, releasing the balance lock, winding 17½ half turns, starting with a twist, setting. Uses 1.5, 2.1 and 3.1.
- **Keeping the rate:** rate book, dial error, longitude. Uses 3.2.
- **Rating at the overhaul station:** the 30-day test. Uses 3.4.
- **What goes wrong:** trip-spring wear (Fig. 38), tripping, setting, thick oil. Uses 2.7.
- **Overhaul:** uses 3.5.

---

## 4. Rendering

### 4.1 Materials the current three.js can already do (S)
- **Jewels:** `MeshPhysicalMaterial` with `transmission`, `ior` 1.76 and `thickness` would make the rubies read as stones rather than red plastic. r128 already supports transmission. Transmission renders an extra pass, so limit it to jewels that are on screen at close range, or only in the escapement view.
- **Crystal:** a `MeshPhysicalMaterial` with `clearcoat`, and a Fresnel-weighted reflection instead of a flat 12 % opacity. The dial view looks through it all the time.
- **Blued steel:** lower roughness and a touch of `sheen` or `clearcoat` gives more of the deep-blue-to-purple shift. True thin-film colour needs `iridescence` (see 4.3).

### 4.2 Ambient occlusion (M)
The movement is a stack of plates a few millimetres apart. Without occlusion, the gaps between them read as flat.
- **Baked:** per-part AO in vertex colours, computed once at load for the static plates only: ray-cast against the scene, or accumulate hemisphere samples in a worker. It costs nothing per frame.
- **Screen-space:** the SAO or SSAO pass from three's examples. That needs `EffectComposer` vendored, and costs a pass every frame. Offer it as a quality setting.

### 4.3 Upgrade three.js (L)
r128 dates from 2021. A current release brings:
- material anisotropy, for the damascening's directional sheen;
- `iridescence`, for blued steel's thin-film colour;
- better PMREM and colour management;
- a path to WebGPU later.

**Costs.**
- r160 removed the `three.min.js` global build, so the classic-script architecture would need either an ES-module build turned into a global once, at vendoring time, by a small Python step, or an import map whose entry is a `data:` URL, which `inline.py` can write.
- API changes:
  - `outputEncoding` becomes `outputColorSpace`, and `texture.encoding` becomes `colorSpace` (r152);
  - colour management is on by default (r152);
  - lights use physically based intensities by default (r155), so every light intensity and the exposure need retuning.
- Re-verify with `?snap` screenshots and `p3fit.py`.

**Advice.** Worth it once the visual features in 4.1–4.2 hit r128's limits. Not before.

### 4.4 A sharper dial up close (S)
The dial texture is 1536 px across a 101.6 mm dial, about 15 px/mm. In close views of the seconds sub-dial it softens.
- Repaint `dialCanvas` at 4096 px, lazily, the first time the camera comes within about 120 mm of the dial.
- Keep the 1536 px version for the default views.

### 4.5 Lighting presets (S)
- **Lighting:** a small choice of **Studio** (today), **Bench lamp** (one warm key light low and to the side, for texture on the damascening) and **Daylight**.
- **Rotate the light:** holding **Shift** while dragging rotates the key light instead of the camera. People often want to see the damascening catch the light.

---

## 5. Performance

The measurements are in [Where things stand](#where-things-stand-measured).
Frame time on phones is dominated by draw calls and shadow rendering, not by
the JavaScript `update()`.

### 5.1 Draw calls: merge and instance
> **Done.** Knurled nuts and the balance rim's holes are merged (`mergeGeo` in `core.js`): 592 meshes down to 389. Rather than a fixed 1.5 mm, a mesh casts a shadow when its radius spans 6 texels of the shadow map, which follows the view (the escapement close-up's texel is 0.06 mm, so its small parts keep their shadows). Draw calls per frame, main and shadow passes: box view 1,239 to 652, dial 1,214 to 706, movement 830 to 612, escapement 571 to 451. Merging static parts and sharing geometries are still open. `347bf5b`

- **Knurling (S):** `knurl()` in [box.js:26](marine-chronometer-source/chronometer-working-model/js/box.js#L26) builds 30 separate box meshes, plus the body, for each knurled nut: 124 meshes for the four on the gimbal ring, 31 more on the latch. Build each nut as one merged geometry (knurled lathe profile or merged boxes). That removes about 150 draw calls, twice over with shadows.
- **Balance rim holes (S):** 60 separate meshes. Merge them into one geometry in the balance's frame; it rotates with the staff anyway.
- **Merge static parts (M):** at load, merge every static mesh of a part that shares a material into one geometry. Pillar plate, bridges, pillars and cock are all static relative to their part group. Keep `userData.part` on the merged mesh; picking, colouring, fading and sections all work per part already. Copy `BufferGeometryUtils.mergeBufferGeometries` from three r128's examples into `vendor/` (MIT), or write a 30-line merge. Expect the movement's 285 meshes to drop to well under 100.
- **Share geometries (S):** 545 meshes, 545 geometries. Identical screws, pins and jewel settings could share one `LatheGeometry` each; cache by parameters in `screw()` and `jewel()`. That saves memory and upload time rather than draw calls.
- **Tiny shadows (S):** 308 meshes are under 1.5 mm in radius, and 541 meshes cast shadows. Set `castShadow=false` on anything under about 1.5 mm. From 2048 px over 340 mm, a shadow texel is about 0.17 mm, so their shadows are a few texels at most.

### 5.2 Startup: the stripe texture
> **Done.** Option 3, with the same pixels: each height is computed once in three rolling rows instead of five times, the wave once per column, and `Math.sqrt` replaces `Math.hypot`. Both maps hash identically to before; in headless Chromium `stripeTex()` went from 540 to 123 ms and `mats()` from 577 to 140 ms. Precomputed images (option 1) were set aside: images loaded from `file://` taint WebGL in Chrome, which would break opening `index.html` directly and the Playwright tools. `6c5ed75`

`stripeTex()` takes 204 ms: a per-pixel JavaScript loop over 1024 × 1024 pixels, computing `sin` and `pow` several times each ([core.js:22](marine-chronometer-source/chronometer-working-model/js/core.js#L22)). Options, best first:
1. **Precompute it.** Generate the two tiles once, save them as WebP or PNG in `vendor/` or `img/` (the map is greyscale; the normal map compresses well), and inline them at build time. Load time drops to a decode.
2. **Compute it on the GPU.** Render the pattern with a one-off full-screen shader into a render target. It takes a few milliseconds, but a render target doesn't survive context loss, so it would join the environment map's rebuild.
3. **Make the loop cheaper.** A 512 px tile with `repeat` doubled looks the same at normal distances and takes a quarter of the time. Or move it to a Web Worker with `OffscreenCanvas`.

The rest of `mats()` (about 120 ms) is mostly the wood texture and the engraving canvases. The same treatment applies to the engraving, which never changes.

### 5.3 Don't rebuild geometry every frame (S–M)
- **Hairspring:** a new `TubeGeometry` from `springGeo()` every frame whenever it's visible ([movement.js:450](marine-chronometer-source/chronometer-working-model/js/movement.js#L450)). That is 0.94 ms of JavaScript plus a fresh vertex buffer upload each frame. The hairspring's "breathing" is a rotation that varies along its length (`a = ang + th·(1 − ang/tot)`), so it can be done in the vertex shader:
  - build the tube once at `th = 0`;
  - store each vertex's normalised position along the spring in an attribute;
  - rotate about the axis by `th·(1 − s)` in `onBeforeCompile`, with `th` as a uniform.
  - The cross-section patch already uses `onBeforeCompile`; chain the two.
- **Trip spring:** a new `TubeGeometry` every frame ([movement.js:453](marine-chronometer-source/chronometer-working-model/js/movement.js#L453)), even though it only moves near the unlocking and passing moments. Rebuild only when `lift` or `psDef` has changed, or bend it in the shader the same way.
- *Mainspring: done.* It is rebuilt only when shown and when the barrel has turned 0.002 turn (0.7°).

### 5.4 Render only when something changes (S)
> **Done.** Each frame compares a signature of everything shown (camera, lids and lift, wheels and balance, wind, ship motion, section plane). With nothing changed, no input for 0.6 s and a draw less than a second ago, it skips the render, the labels and the inset; an off-screen stage (`IntersectionObserver`) isn't drawn. Stopped with a still camera, headless Chromium drew 1 frame a second out of 52. `?snap` still draws every frame for the tools; `?qa` exposes `__renders()`. `4bd930e`

The loop renders every frame even when stopped with the camera still, which costs battery on laptops and phones for a page that is often left open.
- Skip `r.render` when the speed is 0, the camera has settled (its easing deltas are below a threshold), no transition is running, and no input arrived.
- At 1× the second hand moves every half second, but the balance moves continuously, so this only helps when stopped or when the Illustration tab is shown. The loop already skips rendering there; stop scheduling `drawInset` and the HUD too.
- Pause entirely when the stage is scrolled out of view on narrow layouts (`IntersectionObserver`).

### 5.5 Adaptive quality (M)
Phones already get a fixed cap (`PHONE` in `app.js`: pixel ratio 1.5, shadow map 1024 px); this would replace it with one that measures.
- Measure the frame time. When it stays above about 25 ms, step down: pixel ratio from 2 to 1.5 to 1, shadow map from 2048 to 1024, then shadows off.
- Step back up when there's headroom.
- Show the current level in a small **Quality: Auto / High / Low** control under Display.

---

## 6. Interface and accessibility

### 6.1 Accessibility
> **Done.** Reduced motion: instant camera and state moves (as `?snap`), no ship motion from the walkthrough, no smooth scrolling, no CSS fades. Keyboard: the canvas takes focus (with a focus ring); arrows turn the view, +/− zoom, 0 resets; listed in the help card and About. The walkthrough text is a polite live region. Still open: a canvas description that follows the view, and a contrast check of the part colours. `c2af700`

- **Reduced motion (S):** the CSS has no `prefers-reduced-motion` rule. When it's set, snap camera moves (as `?snap` does), keep **Turn slowly** and **Ship motion** off, and don't auto-scroll the walkthrough card into view ([app.js:378](marine-chronometer-source/chronometer-working-model/js/app.js#L378)).
- **Keyboard orbit (S):** arrow keys to orbit, `+`/`−` to zoom, `0` to reset. Only 1–6 and Space work today. Make the canvas focusable (`tabindex="0"`) with a visible focus ring, and list the keys in About.
- **Screen readers (S):**
  - The info card is `aria-live="polite"`; the walkthrough's changing text and the key-winding progress should be too (`kwOut` already is).
  - Give the walkthrough step changes a live region.
  - Give the canvas a description that updates with the view ("Escapement view: detent, escape wheel and balance, seen from the pillar-plate side").
- **Contrast (S):** check the label colours (`--pc` swatches) and muted text against both themes with a contrast checker. Several part colours are mid-tones.

### 6.2 Shareable links and remembered state
> **Done.** The URL hash carries `view`, `tour` (1-based), `speed`, `part`, `drive=1`, `sec=x:-3.5[:f]`, `tz=local` and `t` (only once the hands were set). It is read at load (the opening move goes to the linked view) and on `hashchange`, and written with `replaceState` 0.3 s after any change. Remembering settings in `localStorage` is still open. `cf07772`

- *Done:* **URL hash (S):** `#view=escapement&speed=0.05&part=det&t=12:00:00&sec=x:-3.5`. Read it at load, and update it with `history.replaceState` as things change, throttled. Walkthrough steps: `#tour=6`. Teachers can then link straight to "the detent at 1/20×".
- **Remember (S):** in `localStorage`, alongside the theme already stored there, keep plate finish, dial style, balance and the last view. Always wrap it in `try`, as the theme code does.

### 6.3 Parts list (S)
- **Search:** a search box that filters by name and Hamilton part number (`42087` finds the detent).
- **Figure references:** show each part's manual figure numbers ("Figs. 14, 90, 110") on its info card. The README already records them; move them into the registry.
- **Units:** an **mm / in** toggle for the dimensions on the info cards. The manual works in inches (0.249 in roller, 0.002 in roller shake).

### 6.4 Onboarding and hints (S)
- **Hint:** the hint fades after nine seconds whether or not it was read. Instead, keep it until the first tap or drag.
- **First tap:** add a one-line "Tap any part" pulse on a first-time visitor's first view.

### 6.5 Translations (M)
**Where the text lives:**
- `INFO`, `TOUR`, labels (`addL`), `index.html` and About.

**How:**
- Gather it into one strings table per language, loaded by `?lang=` or `navigator.language`.
- Keep technical terms consistent with period horological usage in each language. German, for instance, has an established chronometer vocabulary (the Roman dial already uses AUF/AB).

### 6.6 Small fixes noticed while reading
- **Keys 1–6:** these call `.click()` on buttons that may be disabled in **Moving parts only**. A disabled button ignores the click, as the comment says, but the key gives no feedback. Flash the button or show a brief HUD message.
- **Walkthrough and user settings:** the walkthrough sets `st.see=false` and `st.rock`, and restores defaults on exit rather than what the user had before. Save and restore the user's settings around a tour.

---

## 7. Code structure

The dense style is deliberate (see CLAUDE.md), and these ideas keep it. They
remove the places where one fact is written in several places.

### 7.1 One parts registry
> **Done.** `PARTS` at the top of `app.js` holds each part's name, description, part numbers, group (`g`, into `PG`), colour (`c`), label priority (`pri`) and flags (`plate`, `dh`). `INFO`, `PCOL`, `PRI`, `PGRP`, `PLATES` and `DRIVE_HIDE` are derived from it (checked identical to the old tables), and `?qa` exposes it as `window.__parts`. The README's "Add a new part" is down to four steps. `5e8c578`

Adding a part today touches `INFO`, `PCOL`, `PGRP`, `PRI`, `PLATES` and `DRIVE_HIDE` in `app.js`, plus its label (the README's "Add a new part" has six steps). Replace these with one table, and derive the six from it:

```js
const PARTS={
  det:{t:'Detent',d:'Beryllium-copper spring detent. …',sp:'Detent 42087, trip spring 42088, block 42086',col:'#e0457b',grp:'train',pri:9,figs:'14, 54–60, 90, 110',src:'manual',srcNote:'plan Fig. 90; thicknesses estimated'},
  pillar:{t:'Pillar plate',…,grp:'plates',plate:true,driveHide:true,src:'photo'},
  …};
const INFO=Object.fromEntries(Object.entries(PARTS).map(([k,p])=>[k,[p.t,p.d,p.sp]])),PCOL=…,PLATES=new Set(Object.keys(PARTS).filter(k=>PARTS[k].plate)),…;
```

The same table carries the provenance (3.6) and figure references (6.3). `geometry-audit.js` and `social.py` can read it through `?qa`.

### 7.2 Derive every train number from `TRAIN`
> **Done.** `TRAIN` now includes the first stage (`fu:96,cp:14`), the motion work is `MW`, and `ESC_PER` (escape turns per turn of each wheel) replaces `RF`/`RT`/`RC`; `FUSEE_PER_HOUR`, the hands' ratios and tooth phasing use them. Labels, part cards, the walkthrough's train and motion tables, their live angles and the tour's wind-indicator text are built from them (identical text today; a planted 76-tooth third wheel changes every figure, and the centre wheel's "1 turn / 1.01 h" shows the fault). `5512fe4`

The README warns that tooth counts appear as text in the labels, `INFO`, the ratio table in `setInset` (hard-coded rows, [app.js:346](marine-chronometer-source/chronometer-working-model/js/app.js#L346)), and the live readout (hard-coded 7.5, 56.25 and 450, [app.js:387](marine-chronometer-source/chronometer-working-model/js/app.js#L387)).
- Compute the table rows, the ratios, the "one turn" times and the label subtitles from `TRAIN`, `UD` and the fusee's 96/14.
- `RF`, `RT` and `RC` already exist inside `buildMovement`; expose them on `mv.userData`.
- Then a change of tooth count, when better counts turn up (1.8), is a one-line edit.

### 7.3 Make `ESC` a factory and share it
> **Done.** `makeEsc(settings)` lives in `marine-chronometer-source/shared/escapement.js` (angles in degrees; unknown settings throw). The model builds `ESC` with the centre distance from `L`, the essay's F7 calls `makeEsc()`, and `tools/escapement.js` `require`s it, reading only `L` from `movement.js`. Its output, the model's views and the essay's figure are unchanged. `813f7ae`

**Today, three copies of one solver:**
- the model's `ESC` is an IIFE with its settings as local constants ([movement.js:45](marine-chronometer-source/chronometer-working-model/js/movement.js#L45));
- `tools/escapement.js` builds it by slicing `movement.js`'s source from the line starting `const L=` to the next `})();`, regex-replacing constants and calling `eval` ([escapement.js:6](marine-chronometer-source/chronometer-working-model/tools/escapement.js#L6));
- the essay carries a hand-made copy with `EX` written out (essay README).

**Instead:**
- Move `ESC` into its own classic script, for example `shared/escapement.js`, as `function makeEsc(o={}){const{EX=…,rT=0.286,rd=0.305,dL=0.019,DRAW=10,aI=181.3,aD=267.5,…}=o; …}`, with `const ESC=makeEsc({EX:…})` in the model.
- `tools/escapement.js` then `require`s it and calls `makeEsc({rT:0.29})`. The command-line overrides keep working, with no source surgery.
- The essay's build inlines the same file (`inline.py` already inlines local scripts), so the copy can't drift.
- The adjuster's bench (3.3) calls `makeEsc` on each slider change.

### 7.4 Split `app.js` by concern (M, optional)
At 62 KB and 484 dense lines, `app.js` holds the part descriptions, the 2-D escapement drawing, the renderer, the camera, picking, visibility, sections, controls, key winding, the rate panel, labels, the walkthrough and the loop.
- **Split** into several classic scripts loaded in order: for example `data.js` (registry, `TOUR`), `ui.js` (controls and panels), `tour.js` and `app.js` (renderer, camera, loop).
- **Keep the style:** globals and the load-order contract stay as they are. `build.py` and `index.html` just list more files.
- **Do it only when a feature needs it.** The rate book or the adjuster's bench would each add a few hundred lines.

### 7.5 Light type checking without npm (S)
- **Annotations:** add `// @ts-check` and a handful of JSDoc types on the public surfaces: `ESC.state`'s return, `mv.userData.update`'s argument, and `part()`/`arbor()`/`screw()`.
- **Where it pays off:** VS Code checks it with no build step, and catches misspelt state fields (`psDef` against `psdef`) as you type.
- **Optional CI step:** `npx tsc --noEmit --allowJs`. It needs Node only, which the tools already use.

---

## 8. Testing and verification

### 8.1 Continuous integration
> **Done.** `.github/workflows/checks.yml`: on every push and pull request, steps 1–4 (the build with the live site's `--site-url`, then `git diff --exit-code` of the built copies; `escapement.js`, which now exits 1 on a failure; and `tools/smoke.py`, which clicks through every control and scrolls the essay), plus `tools/invariants.py` (8.2). Weekly and on demand, `fine.py` and `maintaining.py`, which already fail on anything new; `.gitattributes` keeps the built copies LF on every platform. Step 5's expected-leftovers file for `dyn.py`/`audit.py` is still open. `7f3668e`

A GitHub Actions workflow on every push, in increasing cost:
1. **Build:** `python build.py`. It already fails if a page loads anything from the network.
2. **Escapement:** `node tools/escapement.js`. It prints `!!` for a figure out of tolerance but always exits 0; set `process.exitCode=1` when any row fails. *Done: it now exits with 1 when a figure is out of tolerance.* `813f7ae`
3. **Built copies:** check that the committed root copies match a fresh build (`git diff --exit-code`). CLAUDE.md asks for them to be committed together, and this enforces it.
4. **Smoke test:** Playwright opens `index.html?snap&qa` with SwiftShader and fails on any console error or warning. It clicks every view, every walkthrough step, both variants and every section plane, and checks that `#loading` goes away.
5. **Nightly or manual:** `dyn.py` and `audit.py`, which are slower. Compare their output with a committed expected-leftovers file, so a new collision or loose screw fails rather than scrolling past.

### 8.2 Invariant tests (S)
> **Done.** `tools/invariants.py` checks the hands, the escape wheel, the wind indicator's 60° and 300° ends, the fusee's 60 h, 17½ half turns and 7 half turns a day, the balance's 930 g·mm² (931 before the hub was drawn as Fig. 4 has it), and 40 s / 2.8 s a day for a turn of the weights. A planted 76-tooth third wheel fails eight checks. The pawls are left to `maintaining.py`, which already checks them. `7f3668e`

Small browser or Node checks on the model's arithmetic:
- **Hands:** at `tSim = t`, the hour, minute and second hands point where a clock reading `t` would: centre wheel 1 turn/h, fourth 1 turn/min, escape 16 teeth per 8 s.
- **Wind indicator:** runs from 60° at UP to 300° at 56 h, which is the dial's scale.
- **Fusee:** `FUSEE_TURNS / FUSEE_PER_HOUR` is 60 h of chain, and 17½ half turns wind it fully.
- **Moment of inertia:** `R.timing(0,0)` is 930 g·mm² (catches accidental changes to the balance's geometry), and a full turn of the timing pair is 40 s a day and of the vernier pair 2.8 s, the manual's figures.
- **Pawls:** after `update()` at a spread of states, every pawl's tip sits within a tolerance of its ratchet's profile.

### 8.3 Visual regression (M)
- **Reference images:** render the six views and a few walkthrough steps with `?snap` at a fixed size, and compare them with committed images using a perceptual tolerance.
- **Where it helps:** material and lighting changes (4.x) and the three.js upgrade (4.3) are exactly the kind of change that silently breaks something in a view nobody opened.
- **The renderer:** SwiftShader output is deterministic enough if the Chromium version is pinned.

### 8.4 Size budget (S)
> **Done.** `build.py` fails a page past its `BUDGET` (1.6 MB for the model, 1.1 MB for the essay; they were 1.33 and 0.94 MB) and prints each page's three.js, fonts, images and the rest on every build. The first breakdown showed Instrument Sans inlined three times over (one file under three weights); it is now one face with a weight range.

Fail the build if `chronometer-working-model.html` grows past a set size, say 1.4 MB raw. It's 1.17 MB today. Print a breakdown (three.js, fonts, images, app) on every build, so growth is visible.

---

## 9. Build and hosting

### 9.1 Security headers (S)
`site-assets/_headers` sets `nosniff`, a referrer policy and caching.
- **Add a Content-Security-Policy.** The pages are fully self-contained, so it can be strict: `default-src 'none'; img-src 'self' data: blob:; style-src 'unsafe-inline'; font-src data:; script-src 'sha256-…'` (or `'unsafe-inline'`); `media-src blob:` if video export (3.13) is added.
- **Script hashes:** `build.py` can compute the SHA-256 of each inline script and write them into `_headers`, so no `unsafe-inline` is needed for scripts.
- **Permissions policy:** add `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

### 9.2 Installable offline app (S–M)
- **Install:** a web app manifest and a service worker that caches `index.html` and the essay. On phones the page then installs to the home screen and opens offline.
- **Why it's cheap:** the files are self-contained, so the service worker is a few lines.
- **Where:** `site/` only. The single-file copies stay as they are.

### 9.3 Smaller downloads for the website (S–M)
- **Illustration:** in `site/`, load the illustration as a separate file when the Illustration tab is first opened, instead of inlining 128 KB of base64 into every page load. Keep it inlined in the single-file copy, which must work alone.
- **Fonts:** check that every font weight is used. Spectral 300 might not be; if so, drop it (22 KB).
- **three.js:** a custom build containing only the classes used would cut its 145 KB (gzip) substantially. That's only practical after the upgrade (4.3), with ES modules.

### 9.4 Discoverability (S)
- **Structured data:** `schema.org` markup for both pages: `CreativeWork`, with the manual cited as a source and the licence as `license`.
- **Sitemap:** `sitemap.xml` and `robots.txt` in `site/`, generated by `build.py` when `--site-url` is given.
- **Descriptions:** check that each page's `description` and `og:description` say what someone searching would type: "Hamilton Model 21 chronometer 3D", "detent escapement animation".

---

## 10. The essay

The essay predates the manual and the working model. Hamilton-specific detail
belongs in the model, but the two could work together better.

- **Shared escapement (S):** see 7.3. It also removes the essay README's instruction to copy `ESC` across by hand.
- **Deep links into the model (S):** with [6.2](#62-shareable-links-and-remembered-state), each essay section can end with "See it in the model", opening the matching view: the detent section opens `#view=escapement&speed=0.05`, the fusee section `#tour=3`.
- **A chapter on keeping the rate (M):** the essay opens with longitude ("Time is a position"). A closing chapter on the rate book (3.2) and the performance test (3.4) would bring it back to navigation, with the manual's Table I and test card as its figures.
- **Correct what the manual changed (M):** read the essay against the model README's sources and fix anything the manual contradicts. The "Heat" chapter should mention the Model 21's uncut Invar-armed balance and Elinvar spring as the answer to the split balance's middle temperature error.

---

## 11. Roadmap

A suggested order, so that each stage makes the next easier.

**Stage 1: foundations and quick wins (1–2 weeks)**. *Done, 29 September 2026; the leftovers are noted per item.*
- Parts registry (7.1). Derive train numbers from `TRAIN` (7.2). `ESC` as a factory, shared with the tools and the essay (7.3). *Done: `5e8c578`, `5512fe4`, `813f7ae`.*
- CI: build, escapement check with an exit code, built-copies check, smoke test (8.1). Invariant tests (8.2). *Done: `813f7ae` (exit code), `7f3668e`; the expected-leftovers file for `dyn.py`/`audit.py` is open.*
- Performance: knurls and rim holes merged, tiny meshes out of the shadow pass (5.1). Precomputed stripe texture (5.2). No rendering when idle (5.4). *Done: `347bf5b`, `6c5ed75` (a faster loop, not precomputed images: see 5.2), `4bd930e`.*
- Interface: reduced motion, keyboard orbit (6.1). URL hash state (6.2). *Done: `c2af700`, `cf07772` (with fixes in `650c005`); a view-following canvas description, a contrast check and remembered settings are open.*
- GMT by default (3.1, first half). *Done: `23e9c58`.*

**Stage 2: the chronometer as an instrument (3–5 weeks)**
- Dynamic balance, not self-starting, twist to start (2.1). Manual setting methods (3.1, second half). Hand-setting square and balance locking arm (1.5).
- Rate book and longitude error (3.2).
- Adjuster's bench (3.3).
- Provenance overlay (3.6).

**Stage 3: depth (open-ended)**
- Temperature and the two balances (2.3), isochronism (2.4), then the 30-day test (3.4).
- The fusee comparison (2.2). Gimbals with inertia (2.5).
- Overhaul walkthrough and oiling chart (3.5).
- Fidelity: re-fit (1.1), outlines (1.3), cycloidal teeth (1.8), chain links (1.9).
- Rendering: jewels and crystal (4.1), baked AO (4.2). Then decide on the three.js upgrade (4.3).

---

## 12. Things to keep

What makes the project good, which none of the above should erode:

- **Sourced against estimated.** Every new dimension, coefficient or behaviour goes into the README's "Estimated, not from the manual" section, unless the manual or a measurement gives it. Physics additions (2.x) are mostly illustrative; label them in the page, not just the README.
- **One clock.** New motion is driven from `tSim` and `E` by fixed ratios, or by the balance's dynamics. Never by an independent timer. The dynamic balance (2.1) replaces the source of `E`, not the principle.
- **Offline, single file, no network.** The build fails on any remote reference. Keep it that way: new libraries go in `vendor/` with their licence, and new images are inlined in the single-file build.
- **`L` stays put** unless the fitting tools are re-run (1.1).
- **Rights.** The Illustration tab's drawing is rendered from the model (`tools/illustration.py`), so it is under the model's own licence. The photographs in `References/` are kept in the repository for the tools, not published on the site. Only the manual's own figures (a U.S. government publication) are safe to show in the page (3.7). The maker's name appears only as on photographed Hamiltons (the Hamilton dial and the plate engraving, added at the owner's request); it stays off the Roman, Swiss and Soviet variants.
- **The verification loop.** `dyn.py`, `audit.py`, `p3fit.py` and `escapement.js` are what make the model trustworthy. Every geometric idea above ends with running them; CI (8.1) makes that automatic.
