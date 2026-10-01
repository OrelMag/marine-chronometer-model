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

**Source of truth.** Two things decide what the model should look like and
do: photographs of real Hamilton Model 21 chronometers (in `References/`,
listed in its README) and the manual. Where the model disagrees with them, the
model is wrong. Estimates, clearance fits and the model's own earlier choices
give way to either, and an idea that can't be checked against them is
illustrative.

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
- **The model starts itself.** A detent escapement isn't self-starting. After winding a run-down chronometer, the manual says to start it with "a single quick twist" of the box (Sec. III). The model just carries on after winding. See [2.1](#21-a-balance-that-can-stop-and-must-be-started). *(Done: the balance's amplitude is state; below the 41.1° the escapement needs, the train stops, and a stopped chronometer needs Twist to start.)*
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
- **Per-frame rebuilds.** The hairspring's geometry is rebuilt every frame whenever it can be seen. See [5.3](#53-dont-rebuild-geometry-every-frame-sm). *(Done: written in place, not rebuilt through `closeGeo`; see RESOLVED.md.)*

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
| 1 | [Start it with a twist](#21-a-balance-that-can-stop-and-must-be-started) | Physics | M | A detent escapement isn't self-starting. The manual says to start it with "a single quick twist" of the box; today the model just resumes | Partly done: amplitude as state, the train stops below `ESC.AMIN`, Twist to start; the equation of motion is open |
| 2 | [Keep it on GMT; set it the manual's way](#31-keep-it-on-gmt-and-set-it-as-the-manual-says) | Features | S | Navy chronometers kept Greenwich time, and the manual says the hands "are never set except when the instrument is started" | Done: GMT by default `23e9c58`; setting with the key and when stopped `dc06fae`, `21ea739` |
| 3 | [Navigator's rate book and longitude error](#32-the-navigators-rate-book) | Features | M | The chronometer's real job, straight from Sec. IX, Table I. Makes the rate panel mean something | Done `70baefe` |
| 4 | [Adjuster's bench for the escapement](#33-adjusters-bench-the-escapement-live) | Features | M | `ESC` is already parametric and `tools/escapement.js` already measures it. Bring both into the page | Done `630aa0f` |
| 5 | [One parts registry](#71-one-parts-registry) | Code | S | Adding a part touches six tables in `app.js` today | Done `5e8c578` |
| 6 | [Make `ESC` a factory and share it](#73-make-esc-a-factory-and-share-it) | Code | S–M | Enables #4, removes the source-slicing in `tools/escapement.js` and the hand-copied solver in the essay | Done `813f7ae` |
| 7 | [Merge static meshes; stop shadows from tiny parts](#51-draw-calls-merge-and-instance) | Performance | S–M | 545 meshes, each with its own geometry; 541 cast shadows; 124 meshes are knurling on four nuts | Done: knurls, rim holes, tiny shadows `347bf5b`; merging all static parts open |
| 8 | [Stop rebuilding the stripe texture at load](#52-startup-the-stripe-texture) | Performance | S | 204 ms of a 322 ms `mats()` is one per-pixel JavaScript loop | Done `6c5ed75` |
| 9 | [Temperature and the two balances](#23-temperature) | Physics | M | The manual gives the test temperatures and the compensation figure; the split-rim variant could visibly curl |  |
| 10 | [30-day performance test](#34-the-30-day-performance-test) | Features | M | The manual prints the test card and the Bureau of Ships tolerances. A satisfying way to see the physics add up |  |
| 11 | [CI: build, escapement check, browser smoke test](#81-continuous-integration) | Testing | S | No automated checks today; the tools already exist | Done `7f3668e` |
| 12 | [Reduced motion, keyboard orbit](#61-accessibility) | Interface | S | No `prefers-reduced-motion`; the camera can't be turned from the keyboard | Done `c2af700` |
| 13 | [Shareable links](#62-shareable-links-and-remembered-state) | Interface | S | Put view, time, speed and picked part in the URL hash | Done: hash `cf07772`; remembered settings `8a84df5` |
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
manual's tolerances: lock 6.0°, let-off 10.6°, overall 28.4°, drop 2.1°,
roller shake 0.055 mm, horn clearance 0.25 mm.

---

## 1. Fidelity to the Model 21

These close gaps the model README already lists, or add parts the manual
describes that aren't modelled yet.

**Status (1 October 2026).** Closed: 1.1, 1.3, 1.4, 1.5 (what's left in them is
noted there and left on purpose). Open: 1.8's tooth counts, now counted on a
restoration video (fusee and centre wheels 90, third 80, fourth 75; the centre
pinion still open), to be put into the model; 1.2, whose evidence (the plate
bare in two teardown videos) is found but not yet fitted. Open, small: the rest
of 1.7, 1.9 and 1.10.

### 1.1 Re-fit the plan positions with the new heights (M) — closed
*Done: the tools read the model's heights; re-fitted over eight seeds, every axis stays within the fit's spread of `L` (balance 0.16–1.43 mm, mean about 0.1), so `L` stays. See the model README, step 6.* The escape wheel's 9.40 mm centre distance is solved from roller shake, so it stays fixed whatever a re-fit says.

### 1.2 The train-bridge screw with nothing under it (S) — open
*Examined, still open (`bom.py`'s one known deviation). Fig. 29 draws the upper train bridge with three counterbored screw holes, at its two horns and mid-arc; the top-view photographs show counterbored screws at pillar 0 and at (29.24, -12.28), proud ones at pillar 1, pillar 2 and (-8.5, 27.7). No pillar can stand at (-8.5, 27.7) (the fourth wheel's teeth pass over it) or at (29.24, -12.28) (the fusee wheel's), so which screws are the pillar screws is not settled by these; a photograph of the train bridge off the plate would settle it. Found on the way: the mounting ring's screws go in from the train side, one at the rim at 6 o'clock (fixed, `3c047b0`).*
*Still open. Screws now have their shanks, so this one is drawn threaded into the bridge alone. A pillar can't go under it: the fourth wheel is there.*
*Examined again (1 October 2026), still open. The manual's Figs. 29, 67 and 110, rendered at 150 dpi, draw three train pillars (110-30) and one barrel pillar (110-31), and the upper train bridge with screw holes at its horns and mid-arc, but too loosely to place them. Mapped onto the top-view photograph through the barrel-bridge fit (`tools/topview.py`'s five screws), the model's (−8.5, 27.7) falls about 3 mm from a proud screw on the train bridge, which the photograph's tilt accounts for; it is 9.3 mm from the fourth arbor, inside the wheel's tips (9.65), and 3.5 mm from the balance lower bridge's lobe. The photo-fit's older "backleft pillar screw" (about (−9, 33)) is 11.8 mm from the fourth arbor, where a pillar (r 2.9 at the wheel's height) would still meet the teeth. Also unsettled: the parts list says the barrel bridge's two screws hold it "to the train bridge", while the model threads one of them through the train bridge into train pillar 2.*
*New evidence (1 October 2026): two teardown videos show the pillar plate bare, train side up, with its four pillars standing (BunnSpecial, https://www.youtube.com/watch?v=wcYqdgpyggQ, 21:50–23:20, 720p; C Spinner, https://www.youtube.com/watch?v=KLUwI2UUCMQ, 34:30 and 35:14–36:15, 4K, with the train going in round them), and the upper train bridge off and held to the camera (BunnSpecial 19:30–20:40). Four pillars, as the model has (three train, one barrel). Mapping them onto the plan needs a fit of those frames to the plate's holes; that waits on the tooth counts (1.8), which move the third arbor and so the holes the fit would use.*
One train-bridge screw, at (−8.5, 27.7), has no pillar under it ([movement.js](marine-chronometer-source/chronometer-working-model/js/movement.js), `S.tb` in `buildMovement`); `bom.py` reports it as its one known deviation (`audit.py` doesn't flag it: the head sits on the bridge). Two ways to fix it, once a photograph of the bridge off the plate (or of the plate with the bridge off) shows where the third pillar stands:
- If a pillar stands under this screw, the fourth wheel's size or place is wrong; recheck the layout.
- Otherwise, move the screw onto that pillar and note the change.

### 1.3 Outlines the photographs don't show (M) — closed
- **Balance lower bridge:** *Done:* a stepped block, its upper tier against the train bridge with the two screws from below and two steady pins (Figs. 29, 30, 110; Ops. 12, 50). Fig. 110 fitted like Fig. 67 puts its holes 4–10 mm off, so `tools/lower_bridge.py` lays it out instead, with the drawing's arrangement. Redone 1 October 2026: a frame round the escape wheel in Fig. 30's order, with walls between the tiers; the train-blocking screw, a steady pin and the second screw at holes the top-view photograph shows in the train bridge; the lower tier a bar with lobes under the walls.
- **Upper train bridge under the barrel bridge:** *Done:* the crescent traced on Fig. 67 through an affine fit (`tools/train_bridge.py`), with its notch round the fusee (open to the barrel bridge, Figs. 24, 77), the horn and the keyhole. Left as it is: the keyhole's lobes (one under the detent support block's screw) aren't drawn.
- **Detent foot and support block:** *Checked:* the top-view photographs put pillar 0's counterbored screw where the model has it (within 1 mm) and `L` stays (1.1), so the block stays short.

### 1.4 The balance's collet, stud and upper setting (S–M) — closed
- **Collet and stud:** *Done* `91dd568`, after Figs. 5 and 6 (the manual calls the collet's shape "curious", from counterpoising experiments, and the stud's attachment to the cock "unusual"): the slotted collet with its plate, tongue, clamp and wedge pin, and the stud as a bar under the cock on the stud screw and a steady pin (Figs. 19, 84, 85), with its own clamp and wedge pin. The spring's ends reach the clamps, and it is 5.9 mm tall to clear the stud's bar. Left as it is: Fig. 5 draws the collet larger against the spring, its clamp nearer the coils' radius, which would change the spring's terminal curves; the collet's counterpoise is not modelled.
- **Upper pivot setting:** *Done* `2acc042`: the setting and its olive-hole jewel are drawn in the cock under the endstone cap, with the staff's pivot in the jewel. Rather than re-fit the cock's tracing (`cock_outline.json`), its nose is rounded out to a boss 2.4 mm in radius about the staff, as the photographs show the endstone about 3 mm inside the edge; a re-trace of the nose would replace it.

### 1.5 Hand-setting square, balance locking arm, shipping wedges (S each) — closed
- **Hand-setting square:** *Done* `ad1762d`. Fig. 8 shows the key on "the bright, square arbor at the center of the dial". It is the cannon pinion's squared end, the fusee square's size so the one key fits both, with the minute hand broached square on it (Op. 64: "the minute hand can be broached with a square file"); used by [3.1](#31-keep-it-on-gmt-and-set-it-as-the-manual-says).
- **Balance locking arm (Fig. 9):** *Done* `3655b52`: arm, screw, washer and stop pin, Locked / Unlocked under Stopping and starting; it stops the balance by a timing weight, as Fig. 9 and Sec. X have it.
- **Shipping wedges:** *Not to do.* Before the locking arm, chronometers shipped with folded red plastic wedges between the balance rim and the train bridge (Sec. III); the model has the arm, which replaced them. At most an Easter egg in a "Received from storage" walkthrough step.

### 1.7 Screws, washers and weights from the parts list (S) — open
- **The manual's masses:** *Done:* the moment of inertia is Table II's 1,140 g·mm² (the rim 4.3 mm tall as Fig. 3 draws it, 1.12 wide to fit), the screw heads 2.6 mm across as Fig. 3 draws them. (Before, `R.timing` used the parts list's masses for the three screw sizes and the two weights, 931 g·mm².)
- **Six weights:** *Still to do.* Sec. II gives balance screws "in six weights ranging from 100 mgs. to 300 mgs." and timing washers "in a range of six weights from 4 mgs. to 20 mgs". Map the parts list's three screw head heights onto the six weights. Changing any of these moves `R.pitch`, not the rate for a turn; see "The rate panel" in the model's README for the clearance checks.
- **Timing washers:** *Still to do.* Add them as an option in the rate panel ([2.6](#26-a-fuller-rate-panel-sm)).

### 1.8 Wheel teeth (M–L) — open (tooth counts)
*The train's stack is done: third, centre and fourth wheels from the plate up, with the pinions on the sides and the five spokes that Figs. 13, 29 and 110 give, and the motion work's solid minute and hour wheels and five-spoked wind indicator wheel from photographs of a Model 21's dial side. Profiles are done; the counts are still open.* `22e3984`
- **The wind indicator wheel's size** (settled). The dial-side photographs seemed to show it larger than the model's r 12.4, about r 15–17 mm, and Fig. 13 draws it large. But it meshes the pinion on the fusee arbor, and its centre under the 12 (Fig. 107) lies 12.3 mm from the fusee's: that centre distance holds its pitch radius near 11.4 mm, as the model has it. The photographs' size is perspective.
- *Done:* **Profiles:** cycloidal wheel teeth (epicycloidal addenda rolled for each wheel's pinion) and round-tipped pinion leaves, in BS 978 Part 2's proportions; `fine.py` finds no contact at its 15 train positions. Before: `gearGeo` drew a generic trapezoidal tooth. Clock and chronometer trains use cycloidal teeth and pinion leaves with rounded addenda (the BS 978 Part 2 proportions are the usual reference). With true profiles, the close-ups would show real rolling contact, and `dyn.py` could check tooth-to-leaf clearance through a whole tooth pitch, not just in phase.
- **Tooth counts:** the centre, third and fourth counts are estimates. Count teeth on the highest-resolution photographs (the fourth wheel and the centre wheel's outer rim are often visible), or ask on chronometerbook.com. Update `TRAIN` and every place the counts appear as text (see [7.2](#72-derive-every-train-number-from-train)).
  *Counted (1 October 2026) on a restoration video of a 1941 Model 21 (C Spinner Watch Restorations, "Repairing a World War II Navy Chronometer", https://www.youtube.com/watch?v=KLUwI2UUCMQ, 4K). The model is wrong on every wheel counted:*

  | Wheel | Model (`TRAIN`) | Video | How sure | Where (mm:ss) |
  |---|---|---|---|---|
  | Fusee wheel | 96 | **90** | Certain: lying flat on the mat, all 90 gaps found one by one, none missed | 27:30 |
  | Centre wheel | 80 | **90** | Certain: 90.0 counted by eye segment by segment, 90.2 and 90.7 by fit on two frames | 35:26, 35:30 |
  | Third wheel | 75 | **80** | Measured 80.4–82.8 (partly hidden); 80 is the only count near that which the train's ratios allow | 35:22, 35:30 |
  | Third pinion | 10 | **12** | Counted on the leaves' angles (30° apart) | 35:22 |
  | Fourth wheel | 60 | **75** | Measured 74.9–76.1; fourth wheel ÷ escape pinion must be 7.5 | 35:33, 36:15 |
  | Fourth pinion | 10 | 10 | Inferred: 90/12 × 80/10 = 60, one turn of the fourth wheel a minute | |
  | Escape pinion | 8 | 10 | Inferred: 75/10 = 7.5, an escape turn in 8 s (16 teeth, a tooth a half-second) | |
  | Centre pinion | 14 | **open** | The leaves' angles read 22.3° (16 leaves) on one view, about 25° (14–15) on another | 35:30, 36:15 |

  Which wheel is which follows the reassembly (35:18–35:34): the third wheel goes in first, lowest, its arbor in the lower train bridge's gilt setting in the plate's opening (as the model has it); the centre wheel next, its arbor into the gilt bushing; the fourth last, its arbor in the bar's red jewel. The manual (Sec. IV) gives the order: fusee wheel → centre pinion, centre wheel → third pinion, third wheel → fourth pinion, fourth wheel → escape pinion.
  - *The centre pinion and the manual.* The model's 96/14 came from "Seven half turns are required if the chronometer has been running 24 hours since the last winding" (Sec. III, p. 18). With the real 90-tooth fusee wheel, 7 half turns a day needs a pinion of 13 (6.93); 14 gives 7.47 and 16 gives 8.53. The manual's figure reads as a practical instruction, not a ratio, but 16 is far from it: count the centre pinion on a better view (the centre wheel lying flat, or the BunnSpecial teardown, https://www.youtube.com/watch?v=wcYqdgpyggQ and Part 1, Jd2c3x8VKsE) before changing the fusee's figures (`FUSEE_PER_HOUR`, 17½ half turns, the 8¾ turns of chain, `invariants.py`, the essay).
  - *What changes with the counts.* Bigger wheels on the same arbors need new modules or new centres: `solve.py` again, then `fine.py`, `bom.py` (mesh relations) and the README's "Estimated" section (these counts move out of it). The third arbor's place may move too: in the video's frames the centre bushing sits nearer the fourth wheel's jewel, relative to the third arbor, than the model's `L` has it (ratio about 1.4 against the model's 1.83). Re-fit `L.T` to the train-side photographs of the bare plate (34:30, 35:16) while doing this.
  - Counted with `tools/video.py` (its docstring has the commands): each wheel's rim unrolled along its fitted ellipse, the gaps found one by one, the local pitch fitted round the turn, and every count checked by eye on the enlarged strips. The videos are listed in `References/README.md` ("Videos consulted"); they and their frames stay outside the repository, cited, not copied.

### 1.9 Chain and mainspring detail (M) — open (small)
- **Chain:** *Done:* outer links (two figure-eight plates and their rivets) and inner links (one plate), on edge in a helical groove (Fig. 38); its hook stays in a hole in the barrel's wall over the whole wind (`3655b52`). *Still to do:* make the barrel-end hook visible in the "Stored energy" step.
- **Mainspring:** *Done:* drawn 0.0165 in thick, in two packs (arbor and wall) joined by a free turn, with the counts from the barrel and arbor radii (`mainspringGeo`). *Estimated:* its length (600 mm, the half-room rule): the parts list gives its thickness only, no length or width. A measured spring would settle the length and the set-up (0.30 turn in the model).

### 1.10 Oil sinks, jewel settings, endstones (S) — open (small)
*Done:* all 14 jewels, their settings and endstones, seated by the parts-list work (`ae397f2`): the escape wheel's upper and lower endstone caps, the balance's lower setting and endstone cap, the balance's upper setting and hole jewel in the cock (1.4, `2acc042`), the fourth wheel's upper setting and the lower train bridge's settings pressed through it. The bar-hole jewels (the train's) are cut with their oil sinks (`stoneGeo(…, 'bar')` in `core.js`); the olive-hole jewels under the balance's and escape wheel's endstones, which hold their oil against the endstone, have none.
*Still to do:* oil sinks on the pivot holes that aren't jewelled, where the oiling chart (Sec. VIII) oils them. This pairs with [3.5](#35-overhaul-walkthrough-and-oiling-chart).

---

## 2. Physics and timekeeping

Today everything is kinematic: the balance phase is `frac(tSim/0.5)`, the
amplitude is a constant 255° each side, and the rate changes only through the
timing weights' moment of inertia. That is right for most of what the page
shows. These ideas add the dynamics where they teach something.

### 2.1 A balance that can stop and must be started
*Partly done: the amplitude is state (`H.amp` in `app.js`), not an integrated oscillator. It runs down freely when the train is held, against the balance locking arm at once, and builds up after Twist to start; the escapement needs `ESC.AMIN` (41.1°, worked out by `makeEsc`) to keep going, so the train stops below it and at run down. Still to do: the equation of motion below, with the impulse's torque, and the rate against amplitude that would follow.*

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
**What.** The fusee inset plots spring pull, chain radius and torque. The torque line is 1 by construction: the pull drawn is `rf(0)/rf(n)`, the pull the measured profile (`r0/√(1−a·m)`, a pull falling in step with the barrel's turns) evens out exactly.

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
- **Escapement error.** The impulse runs from −20.7° to +20.8°, centred on the dead point, and the unlocking comes before it (−27.3° to −21.3°). Airy's result says a push with the motion before the dead point makes the balance gain and one after makes it lose. A resisting force before it makes it lose.
- *Done on the adjuster's bench (3.3), for the figures; the rate is still kinematic.* **An interactive version.** Offset the impulse jewel's angle (`aI`), and see the rate change and the escapement figures move. This belongs on the adjuster's bench ([3.3](#33-adjusters-bench-the-escapement-live)).

### 2.5 Gimbals with inertia (M)
**What.** Ship motion now counter-rotates the ring and bowl exactly, so the movement stays perfectly level ([app.js:460](marine-chronometer-source/chronometer-working-model/js/app.js#L460)). Model the bowl and ring as two coupled damped pendulums driven by the box's motion instead.
- They then lag, and overshoot at some frequencies.
- A **Latch the gimbals** control (the latch is modelled but only shown released) would lock them. The movement then visibly tilts with the box. *(Done: Gimbals latched, under Display. The lever swings in through a slot in the ring to the keeper on the case (Fig. 106); ring and case are brought level with the box first and then tilt with it.)* `c04e4d9`

**Why.** It shows what the gimbals do, and where they stop working: a roll period near the bowl's own period.

**Watch out.** The bowl's mass distribution and pivot friction are **illustrative**.

### 2.6 A fuller rate panel (S–M)
- **Adjusters' tools.** Add balance screws and timing washers from the parts list (1.7) as further adjustments. The manual's timing operations use them alongside the weights.
- *Done:* **Dial error against real time.** The HUD shows the dial error against a master time `tM` that runs with the model. `562928a` Before: show it in the HUD as the hands drift: "+3.5 s since set".

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
> **Setting: done.** With the key (Time) follows Sec. III's "Setting While Running": gimbals latched, bezel off, the key on the square, the minute hand on its marker half a minute behind the master and on the next as the master passes 60; the second hand untouched, so up to 30 s remains. Stop to set follows "Setting When Stopped": the arm stops the balance, the Time section counts down to the master overtaking a fast dial (or to the second hands agreeing on a slow one), and a twist starts it at that instant. `dc06fae`, `21ea739`

**GMT.** *Done: GMT is the default, with Keep: GMT / Local time under Time, and the HUD names the zone. Setting the hands the manual's way waits for the dynamic balance (2.1).* `23e9c58`
- `tSim` starts at local time (`Date.now()/1000 - getTimezoneOffset()*60`, [app.js:124](marine-chronometer-source/chronometer-working-model/js/app.js#L124)), and **Now** does the same.
- A navy chronometer was kept on Greenwich time.
- Make **GMT** the default, with a Local option, and say which in the HUD.

**Setting.** The manual is emphatic: "the hands of a chronometer are never set except when the instrument is started", because a record of the rate and accumulated error is kept and applied instead (Sec. III, Setting). It gives two methods, and the model could offer both beside today's instant **Set the hands**:
1. **Forward only.** With the key on the square at the centre of the dial (1.5), turn the hands forward to half a minute behind the master time. Then advance the minute hand to the next mark as the master's second hand passes 60. The manual gives the maximum error of this method as 30 seconds.
2. **Stop and restart.** Stop the balance, wait until the master time "overtakes" the dial, and start it with a twist at that instant. Because the escape wheel is locked, "the second hand is exactly upon the second or half second" when stopped. Needs [2.1](#21-a-balance-that-can-stop-and-must-be-started).

### 3.2 The navigator's rate book
> **Done.** The Rate book section: comparisons at noon master time and on demand, dial error to the half second, daily rate over at least half a day, mean daily rate and mean deviation since the last break, automatic remarks (started, stopped, set, not wound, weights moved), and the longitude error at a chosen latitude, uncorrected and corrected with the mean rate. No noise is added: the half-second reading is the only scatter. `70baefe`

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
> **Done.** The Adjuster's bench section: six sliders, the detent, trip spring screw, roller and jewels rebuilt live (`escSet`), the 2-D plan beside them, the manual's figures from `ESC.checks()` (moved from `tools/escapement.js` into `makeEsc`, which the tool now prints unchanged), and "it would not run" with the reason, keeping the last setting that runs. `AMIN` follows the settings. The hash carries changed settings. `04f95f9`, `2763e9e`, `630aa0f`

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
> **Done.** Every part in `PARTS` has `src` (the manual, measured, solved, estimated), `sn` (what came from where) and `figs`, taken from the README's Sources, layout and Estimated sections; the part card shows them. Colour by source (Display) colours every part by it, with a key; `colr=src` in the hash. `d42027c`, `ce76d8a`

**What.** A third colouring mode beside Normal and Colour by part: every part coloured by where its shape and size came from.

| Source | Colour | Examples |
|---|---|---|
| The manual | green | the detent plan, the adjustment figures, the impulse roller |
| Measured on photographs | blue | the bridge outline, the cock, the heights |
| Solved for clearance | amber | the third wheel's position, the modules |
| Estimated | grey | tooth counts, the stop-bar's nose, the mainspring |

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
> **Partly done.** The balance swings as it really does up to 5× (it switched to its slow display swing above 1×, so at 2× it swung slower than at 1×); above 5× the HUD says "balance swing shown slowed". The motion-blurred disc is still open. `5af0a57`

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

> **Next: fewer triangles** (measured, not started). The whole model is about 720k triangles (1.35M a frame with Edges, 2M with Shadows too), with no level of detail. Three parts carry 64 % of them. This matters most for weak GPUs and the software renderer, where the triangles are the cost, and for the shadow pass, which draws every caster again. Each changes geometry, so `fine.py` (the chain on the fusee cone is an expected contact), `solids.py` and `exploded.py` must be re-run and `EXPECTED` may need its sizes retuned; do it on its own branch.
> - **Fusee lathe, 148k:** its profile is sampled every 0.03 mm (343 points) × 216 segments (`makeFusee` in `movement.js`). Sample the groove's flanks more coarsely or adaptively.
> - **Chain, 188k in 2 draw calls:** 656 links; an outer link is 408 triangles (two plates with `curveSegments:10`, two rivets), an inner one 164. Fewer segments on the plates' round ends; the instance buffers are sized for 900 where 328 are used.
> - **Screws, 133k:** 52 threaded screws, two lathe rings per thread pitch, so the finest screws are the heaviest (the 0.45 mm endstone-cap screws 4,760 each). Identical screws could share one geometry (`screw()` in `movement.js`).
> - Also: every `absarc` gets 2 × `curveSegments` points whatever its radius, so a 0.5 mm hole in `discGeo` (64) or `ringGeo` (48) costs as much as a rim; the escape wheel's web (128) is 10k.

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
> **Done.** The closed-solid rule later put the hairspring through `closeGeo` every frame, 9 ms of it on a desktop CPU. Now `reclose` writes the new tube into the old geometry in place (same vertices, same index; `fine.py` and the others still read what `update()` builds), and only when the balance has turned: the Movement view went from 12.5 to 2.6 ms a frame (`tools/perf.py`). The shader below is no longer needed. `bf503d8`
>
> **Earlier, partly done.** The trip spring is rebuilt only when its lift or deflection changes, so it stands still (and isn't rebuilt) for most of each swing, and above 1× never. The hairspring is left as it is: the balance turns every frame while running, so a change threshold saves nothing, and bending it in a shader would hide its real shape from `fine.py`, `dyn.py`, `solids.py` and `illustration.py`, which read the geometry `update()` builds. `a4e7574`

- **Hairspring:** a new `TubeGeometry` from `springGeo()` every frame whenever it's visible ([movement.js:450](marine-chronometer-source/chronometer-working-model/js/movement.js#L450)). That is 0.94 ms of JavaScript plus a fresh vertex buffer upload each frame. The hairspring's "breathing" is a rotation that varies along its length (`a = ang + th·(1 − ang/tot)`), so it can be done in the vertex shader:
  - build the tube once at `th = 0`;
  - store each vertex's normalised position along the spring in an attribute;
  - rotate about the axis by `th·(1 − s)` in `onBeforeCompile`, with `th` as a uniform.
  - The cross-section patch already uses `onBeforeCompile`; chain the two.
- **Trip spring:** a new `TubeGeometry` every frame ([movement.js:453](marine-chronometer-source/chronometer-working-model/js/movement.js#L453)), even though it only moves near the unlocking and passing moments. Rebuild only when `lift` or `psDef` has changed, or bend it in the shader the same way.
- *Mainspring: done.* It is rebuilt only when shown and when the barrel has turned 0.002 turn (0.7°).

### 5.4 Render only when something changes (S)
> **Done.** Each frame compares a signature of everything shown (camera, lids and lift, wheels and balance, wind, ship motion, section plane). With nothing changed, no input for 0.6 s and a draw less than a second ago, it skips the render, the labels and the inset; an off-screen stage (`IntersectionObserver`) isn't drawn. Stopped with a still camera, headless Chromium drew 1 frame a second out of 52. `?snap` still draws every frame for the tools; `?qa` exposes `__renders()`. `4bd930e`

> **Also done:** the balance's swing is left out of the signature while it can't be seen (the Dial and Box views, movement in its case), so the running model's Dial view draws about 4 frames a second, for the hands' steps, instead of every frame; and without input a frame comes at most every 10 ms, so 120 and 144 Hz displays draw the running model at 60 or 72 Hz.

The loop renders every frame even when stopped with the camera still, which costs battery on laptops and phones for a page that is often left open.
- Skip `r.render` when the speed is 0, the camera has settled (its easing deltas are below a threshold), no transition is running, and no input arrived.
- At 1× the second hand moves every half second, but the balance moves continuously, so this only helps when stopped or when the Essay tab is shown. The loop already skips rendering there; stop scheduling `drawInset` and the HUD too.
- Pause entirely when the stage is scrolled out of view on narrow layouts (`IntersectionObserver`).

### 5.5 Adaptive quality (M)
Phones already get a fixed cap (`PHONE` in `app.js`: pixel ratio 1.5, shadow map 1024 px), and Shadows is now off by default everywhere (a Display switch); this would replace the cap with one that measures. `tools/perf.py` measures what each setting costs.
- Measure the frame time. When it stays above about 25 ms, step down: pixel ratio from 2 to 1.5 to 1, shadow map from 2048 to 1024, then shadows off.
- Step back up when there's headroom.
- Show the current level in a small **Quality: Auto / High / Low** control under Display.

---

## 6. Interface and accessibility

### 6.1 Accessibility
> **Done.** Reduced motion: instant camera and state moves (as `?snap`), no ship motion from the walkthrough, no smooth scrolling, no CSS fades. Keyboard: the canvas takes focus (with a focus ring); arrows turn the view, +/− zoom, 0 resets; listed in the help card and About. The walkthrough text is a polite live region. The canvas description follows the view (`dd2c6df`). Still open: a contrast check of the part colours. `c2af700`

- **Reduced motion (S):** the CSS has no `prefers-reduced-motion` rule. When it's set, snap camera moves (as `?snap` does), keep **Turn slowly** and **Ship motion** off, and don't auto-scroll the walkthrough card into view ([app.js:378](marine-chronometer-source/chronometer-working-model/js/app.js#L378)).
- **Keyboard orbit (S):** arrow keys to orbit, `+`/`−` to zoom, `0` to reset. Only 1–6 and Space work today. Make the canvas focusable (`tabindex="0"`) with a visible focus ring, and list the keys in About.
- **Screen readers (S):**
  - The info card is `aria-live="polite"`; the walkthrough's changing text and the key-winding progress should be too (`kwOut` already is).
  - Give the walkthrough step changes a live region.
  - *Done:* the canvas's `aria-label` names the view or walkthrough step, and Moving parts only. `dd2c6df` Before: give the canvas a description that updates with the view ("Escapement view: detent, escape wheel and balance, seen from the pillar-plate side").
- **Contrast (S):** check the label colours (`--pc` swatches) and muted text against both themes with a contrast checker. Several part colours are mid-tones.

### 6.2 Shareable links and remembered state
> **Done.** The URL hash carries `view`, `tour` (1-based), `speed`, `part`, `drive=1`, `sec=x:-3.5[:f]`, `tz=local` and `t` (only once the hands were set). It is read at load (the opening move goes to the linked view) and on `hashchange`, and written with `replaceState` 0.3 s after any change. Remembering settings in `localStorage`: plate finish, dial style, balance and the last view, `8a84df5`. `cf07772`

- *Done:* **URL hash (S):** `#view=escapement&speed=0.05&part=det&t=12:00:00&sec=x:-3.5`. Read it at load, and update it with `history.replaceState` as things change, throttled. Walkthrough steps: `#tour=6`. Teachers can then link straight to "the detent at 1/20×".
- *Done:* **Remember (S):** `cm-set` keeps plate finish, dial style, balance and the last view; the view opens the page when its link names none. `8a84df5` Before: in `localStorage`, alongside the theme already stored there, keep plate finish, dial style, balance and the last view. Always wrap it in `try`, as the theme code does.

### 6.3 Parts list (S)
- *Done:* **Search:** by name, part number or source note, and `fig 90` by the manual's figure. `d89ee8f` Before: a search box that filters by name and Hamilton part number (`42087` finds the detent).
- *Done:* **Figure references:** on each card, from `figs` in `PARTS`. `d42027c` Before: show each part's manual figure numbers ("Figs. 14, 90, 110") on its info card. The README already records them; move them into the registry.
- *Done:* **Units:** Sizes in mm or inches (Parts), for the cards, remembered. `a0f6d6d` Before: an **mm / in** toggle for the dimensions on the info cards. The manual works in inches (0.249 in roller, 0.002 in roller shake).

### 6.4 Onboarding and hints (S)
- *Done:* **Hint:** it stays until the model is first tapped, dragged, scrolled or given a key, or a part card, help or the walkthrough covers it. `c490811` Before: the hint fades after nine seconds whether or not it was read. Instead, keep it until the first tap or drag.
- **First tap:** add a one-line "Tap any part" pulse on a first-time visitor's first view.

### 6.5 Translations (M)
**Where the text lives:**
- `INFO`, `TOUR`, labels (`addL`), `index.html` and About.

**How:**
- Gather it into one strings table per language, loaded by `?lang=` or `navigator.language`.
- Keep technical terms consistent with period horological usage in each language. German, for instance, has an established chronometer vocabulary (the Roman dial already uses AUF/AB).

### 6.6 Small fixes noticed while reading
- *Done:* **Keys 1–9:** the key for a view that is off flashes its button and says in the HUD to turn off Moving parts only. `8b03099` Before: these call `.click()` on buttons that may be disabled in **Moving parts only**. A disabled button ignores the click, as the comment says, but the key gives no feedback. Flash the button or show a brief HUD message.
- *Done:* **Walkthrough and user settings:** the view, See-through, Ship motion, Gimbals latched, the speed, Moving parts only and the motion work are kept when it starts and given back when it ends. `8ab661e` Before: the walkthrough sets `st.see=false` and `st.rock`, and restores defaults on exit rather than what the user had before. Save and restore the user's settings around a tour.

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
> **Done.** `build.py` fails a page past its `BUDGET` (1.6 MB for the model, 1.1 MB for the essay; they were 1.33 and 0.94 MB) and prints each page's three.js, fonts, images and the rest on every build. The first breakdown showed Instrument Sans inlined three times over (one file under three weights); it is now one face with a weight range. `843d642`, `8f1266b`

Fail the build if `chronometer-working-model.html` grows past a set size, say 1.4 MB raw. It's 1.17 MB today. Print a breakdown (three.js, fonts, images, app) on every build, so growth is visible.

---

## 9. Build and hosting

### 9.1 Security headers (S)
`site-assets/_headers` sets `nosniff`, a referrer policy and caching.
- **Add a Content-Security-Policy.** The pages are fully self-contained, so it can be strict: `default-src 'none'; img-src 'self' data: blob:; style-src 'unsafe-inline'; font-src data:; script-src 'sha256-…'` (or `'unsafe-inline'`); `media-src blob:` if video export (3.13) is added.
- **Script hashes:** `build.py` can compute the SHA-256 of each inline script and write them into `_headers`, so no `unsafe-inline` is needed for scripts.
- **Permissions policy:** add `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

### 9.2 Installable offline app (S–M)
- **Install:** a web app manifest and a service worker that caches `index.html` (the essay is in it). On phones the page then installs to the home screen and opens offline.
- **Why it's cheap:** the files are self-contained, so the service worker is a few lines.
- **Where:** `site/` only. The single-file copies stay as they are.

### 9.3 Smaller downloads for the website (S–M)
- *Dropped:* **Illustration:** load the Illustration tab's drawings on demand. The tab and its images are gone (the Essay tab replaced it), which took the page from 1.33 MB to 1.21 MB.
- **Fonts:** check that every font weight is used. Spectral 300 might not be; if so, drop it (22 KB).
- **three.js:** a custom build containing only the classes used would cut its 145 KB (gzip) substantially. That's only practical after the upgrade (4.3), with ES modules.

### 9.4 Discoverability (S)
> **Done.** With `--site-url`, `build.py` writes `site/sitemap.xml` and `robots.txt` at the addresses the canonical tags name. Both pages carry schema.org JSON-LD (the model a `CreativeWork`/`WebApplication`, the essay an `Article`) citing the manual, under CC BY 4.0. The essay had no `description` or `og:` title and description; it has them now. `75d8b9c`

- **Structured data:** `schema.org` markup for both pages: `CreativeWork`, with the manual cited as a source and the licence as `license`.
- **Sitemap:** `sitemap.xml` and `robots.txt` in `site/`, generated by `build.py` when `--site-url` is given.
- **Descriptions:** check that each page's `description` and `og:description` say what someone searching would type: "Hamilton Model 21 chronometer 3D", "detent escapement animation".

---

## 10. The essay

The essay predates the manual and the working model. Hamilton-specific detail
belongs in the model, but the two could work together better.

- **Shared escapement (S):** see 7.3. It also removes the essay README's instruction to copy `ESC` across by hand.
- *Done:* **Deep links into the model (S):** the balance, heat, fusee, train, detent and gimbals sections end with a link into the model (`#tour=7`, `#view=balance`, `#tour=3`, `#tour=5`, `#view=escapement&speed=0.05`, `#tour=1`); the heat link names the Model 21's uncut Invar-armed balance and Elinvar spring. The build keeps the hash when it points the links at `./` in `site/`. `fb4d2cb` Before: with [6.2](#62-shareable-links-and-remembered-state), each essay section can end with "See it in the model", opening the matching view: the detent section opens `#view=escapement&speed=0.05`, the fusee section `#tour=3`.
> **Done.** The essay is now the model's Essay tab (`js/essay.js`), its figures drawn from the model's code, with chapters on winding and on keeping the rate (a Table I rate book, the 30-day test), and the manual's corrections made throughout. The old page redirects to `/#essay`.

- *Done:* **A chapter on keeping the rate (M):** the essay opens with longitude ("Time is a position"). A closing chapter on the rate book (3.2) and the performance test (3.4) would bring it back to navigation, with the manual's Table I and test card as its figures.
- *Done:* **Correct what the manual changed (M):** read the essay against the model README's sources and fix anything the manual contradicts. The "Heat" chapter should mention the Model 21's uncut Invar-armed balance and Elinvar spring as the answer to the split balance's middle temperature error.

---

## 11. Roadmap

A suggested order, so that each stage makes the next easier.

**Stage 1: foundations and quick wins (1–2 weeks)**. *Done, 29 September 2026; the leftovers are noted per item.*
- Parts registry (7.1). Derive train numbers from `TRAIN` (7.2). `ESC` as a factory, shared with the tools and the essay (7.3). *Done: `5e8c578`, `5512fe4`, `813f7ae`.*
- CI: build, escapement check with an exit code, built-copies check, smoke test (8.1). Invariant tests (8.2). *Done: `813f7ae` (exit code), `7f3668e`; the expected-leftovers file for `dyn.py`/`audit.py` is open.*
- Performance: knurls and rim holes merged, tiny meshes out of the shadow pass (5.1). Precomputed stripe texture (5.2). No rendering when idle (5.4). *Done: `347bf5b`, `6c5ed75` (a faster loop, not precomputed images: see 5.2), `4bd930e`.*
- Interface: reduced motion, keyboard orbit (6.1). URL hash state (6.2). *Done: `c2af700`, `cf07772` (with fixes in `650c005`), a view-following canvas description `dd2c6df` and remembered settings `8a84df5`; a contrast check is open.*
- GMT by default (3.1, first half). *Done: `23e9c58`.*

**Stage 2: the chronometer as an instrument (3–5 weeks)**
- Dynamic balance, not self-starting, twist to start (2.1). Manual setting methods (3.1, second half). Hand-setting square and balance locking arm (1.5). *Done but the equation of motion (2.1) and the shipping wedges (1.5): setting `dc06fae`, `21ea739`.*
- Rate book and longitude error (3.2). *Done: `70baefe`.*
- Adjuster's bench (3.3). *Done: `630aa0f`.*
- Provenance overlay (3.6). *Done: `d42027c`, `ce76d8a`.*

**Stage 3: depth (open-ended)**
- Temperature and the two balances (2.3), isochronism (2.4), then the 30-day test (3.4).
- The fusee comparison (2.2). Gimbals with inertia (2.5).
- Overhaul walkthrough and oiling chart (3.5).
- Fidelity: re-fit (1.1), outlines (1.3), cycloidal teeth (1.8), chain links (1.9).
- Rendering: jewels and crystal (4.1), baked AO (4.2). Then decide on the three.js upgrade (4.3).

---

## 12. Things to keep

What makes the project good, which none of the above should erode:

- **The photographs and the manual are the source of truth.** Photographs of real Model 21s and the 1948 manual decide every shape, size and behaviour; when the model disagrees with them, the model changes. A fit, an estimate or an earlier choice in the code never outranks them.
- **Sourced against estimated.** Every new dimension, coefficient or behaviour goes into the README's "Estimated, not from the manual" section, unless the manual or a measurement gives it. Physics additions (2.x) are mostly illustrative; label them in the page, not just the README.
- **One clock.** New motion is driven from `tSim` and `E` by fixed ratios, or by the balance's dynamics. Never by an independent timer. The dynamic balance (2.1) replaces the source of `E`, not the principle.
- **Offline, single file, no network.** The build fails on any remote reference. Keep it that way: new libraries go in `vendor/` with their licence, and new images are inlined in the single-file build.
- **`L` stays put** unless the fitting tools are re-run (1.1).
- **Rights.** The essay's figures are drawn from the model, so they are under the model's own licence. The photographs in `References/` are kept in the repository for the tools, not published on the site. Only the manual's own figures (a U.S. government publication) are safe to show in the page (3.7). The maker's name appears only as on photographed Hamiltons (the Hamilton dial and the plate engraving, added at the owner's request); it stays off the Roman, Swiss and Soviet variants.
- **The verification loop.** `dyn.py`, `audit.py`, `p3fit.py` and `escapement.js` are what make the model trustworthy. Every geometric idea above ends with running them; CI (8.1) makes that automatic.
