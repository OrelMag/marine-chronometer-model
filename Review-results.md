# Review results: the working model

A review of *The Marine Chronometer, working*
(`marine-chronometer-source/chronometer-working-model/`) at commit `f591611`,
29 September 2026. Line numbers in the findings refer to that commit.

Ideas already listed in `IDEAS.md` are left out: the model starting itself,
setting the hands at will, local time instead of GMT, performance, the three
copies of the escapement solver, and the escapement check's exit code.

Status: findings 1–5 were fixed after the review; see
[Fixes for findings 1–5](#fixes-for-findings-15). Checking the fixes turned up
finding 9 (the split-balance variant runs through the barrel bridge), which is
not fixed yet. Findings 6, 8 and 9 and the smaller issues are open; finding 7
was resolved by the fine interference pass.

A later pass with a finer collision check found and fixed six more overlaps,
and added a check for the barrel wall; see
[Fine interference pass](#fine-interference-pass).

A review of the barrel and fusee against the manual found the maintaining
work's state handling wrong, the train bridge covering the fusee, and 13 parts
missing; all are fixed. See
[Barrel and fusee against the manual](#barrel-and-fusee-against-the-manual).

A third review took every part in the manual's parts lists (Figs. 106–110)
and the manual's account of how it works: screws had no shanks and parts no
holes for them, pivots ended in bare holes, more than 30 listed parts were missing,
and the model started itself where the manual has it twisted into motion. All
are fixed; a few parts are drawn differently from the figures and a few small
ones are not drawn, as listed. See
[Every part against the manual](#every-part-against-the-manual).

A fifth review set the fusee assembly against the manual's exploded drawing
(Fig. 28) and the restoration video: every part is there and works, but six
differ in shape, and a wind at high speed outlasted the sustaining spring
(fixed). See [The fusee assembly against Fig. 28 and the video](#the-fusee-assembly-against-fig-28-and-the-video).

A fourth review checked the fusee and chain against the manual and the
photographs: the fusee was too thin at its small end, its groove turned in
rings, the chain's links lay flat, and the stop-bar moved with the wind count
instead of being pushed by the chain. All are fixed. See
[Fusee and chain against the manual and photographs](#fusee-and-chain-against-the-manual-and-photographs).

## Summary

No part of the model is broken. The mechanics hold up: ratios, directions of
rotation, the escapement figures and the maintaining work are consistent, and the
committed builds match their sources. The review found:

- three confirmed bugs: two in the controls (dial style, plate finish) and one
  small collision (escape-bridge screw heads in the balance's path);
- one inconsistency in how the model runs down and winds (56 h against 60 h);
- smaller accuracy and tooling issues;
- found while checking the fixes: the split-balance variant's weights run
  through the barrel bridge and the escape upper bridge (finding 9).

## What was checked

### Escapement

`node tools/escapement.js`: all nine figures are within the manual's limits.

```
  ok  centre distance                                  9.40 mm
  ok  roller shake (Op. 84)                           0.055 mm   about 0.002 in (0.051 mm)
  ok  teeth dip into the roller's crescent (Op. 76)    0.34 mm   > 0
  ok  lock (Op. 85)                                       6.0°   about 6°
  ok  let-off (Op. 86)                                   10.6°   at least 6°
  ok  overall (Op. 87)                                   28.4°   26-30°
  ok  drop (Op. 97)                                       2.1°   about 2°
  ok  horn clearance to the unlocking jewel (Op. 88)   0.25 mm   about 0.010 in (0.25 mm)
  ok  angle between the jewels                           88.3°   about 90° (Fig. 90)

  balance angle: jewel meets trip spring -27.3°, wheel released -21.3°, detent falls back -10.7°;
  impulse ends 20.8°; on the return swing the trip spring falls off at -39.1°. Lift at release 0.20 mm.
```

### Collision check

`python tools/dyn.py`, once as committed (weights at mid-travel) and once each
with `R.timing(3,3)` and `R.timing(-3,-3)` applied after loading, as the README
asks after any change to the balance. All three runs gave the same output:

```
ph 0.0:    1.7 mm3 hands:ExtrudeGeometry              x hands:CylinderGeometry             @ 0.0,6.2,0.0
ph 0.0:    1.5 mm3 bal:CylinderGeometry               x bal:CylinderGeometry               @ 8.0,-26.3,6.8
ph 0.0:    0.8 mm3 escBridge:ExtrudeGeometry          x escW:CylinderGeometry              @ 7.2,-24.0,16.1
ph 0.0:    0.8 mm3 bal:CylinderGeometry               x bal:BoxGeometry                    @ 8.0,-26.3,6.8
ph 0.0:    0.5 mm3 spawl:CylinderGeometry             x spawl:ExtrudeGeometry              @ 22.1,-9.4,-1.6
ph 0.0:    0.4 mm3 hands:ExtrudeGeometry              x hands:CylinderGeometry             @ 0.0,4.5,23.9
ph 0.0:    0.4 mm3 hands:ExtrudeGeometry              x hands:CylinderGeometry             @ 0.0,4.5,-23.9
```

Every pair is inside one part (hand collets, the balance hub, the sustaining
pawl's arbor in its pivot hole) or is the escape wheel's upper pivot in its
bridge. These are intended joints.

### Geometry audit

`python tools/audit.py` (movement):

- `dupScrews` 0, `floatScrews` 0, `isolated` 0.
- `looseEnds` 6: the winding-stop pin and five balance-screw and weight-screw
  ends. These are the expected leftovers.
- `zfight` 45: faces in contact, as documented.

`python tools/audit.py box`: `dupScrews`, `floatScrews`, `looseEnds` and
`isolated` 0; `zfight` 8 (the lids resting on the box, the ring on the bowl's
brackets, the latch's parts).

### Builds

- `dist/chronometer-working-model.html`, the root copy and `site/index.html`
  (built without `--site-url`) are identical to a fresh inline of the sources.
  The essay is too.
- The essay's copy of the escapement solver (F7 in `src/p4.js`) runs the same
  code as `ESC` in `movement.js`. The only differences are the intended ones:
  `EX` written out as 9.3997 mm, and a different set of returned fields.
  *Superseded: the essay is now the model's Essay tab and uses the model's own
  `ESC`.*

### Gear meshes

Centre distances from `L`, against the sum of the pitch radii
(module × teeth ÷ 2):

| Mesh | Centre distance | Pitch sum | Error |
|---|---|---|---|
| Fusee wheel 96 / centre pinion 14 | 22.943 | 22.941 | +0.002 mm |
| Centre 80 / third pinion 10 | 13.049 | 13.050 | −0.001 mm |
| Third 75 / fourth pinion 10 | 12.752 | 12.750 | +0.002 mm |
| **Fourth 60 / escape pinion 8** | **10.585** | **10.540** | **+0.045 mm (0.14 module)** |
| Cannon 12 / minute wheel 36 | 9.600 | 9.600 | 0.000 mm |
| Minute pinion 10 / hour wheel 40 | 9.600 | 9.600 | 0.000 mm |
| Fusee pinion 8 / wind-indicator wheel 98 | 12.294 | 12.291 | +0.003 mm |

The escape wheel is 9.3997 mm from the balance, as the README says.

### Mechanics, by hand

- **Train.** 80/10 × 75/10 × 60/8 = 450 escape-wheel turns an hour. With 16
  teeth that is 7,200 teeth an hour, one each half second. The fusee wheel's
  96/14 gives one fusee turn per 6.86 h, and its 8¾ turns hold 60 h of chain.
- **Hands.** The minute hand turns with the centre wheel. The hour hand turns at
  a twelfth of that, through 12/36 and 10/40. The seconds hand is on the fourth
  wheel, one turn a minute. All three turn clockwise seen from the dial.
- **Directions.** Every mesh alternates direction. The fusee and barrel turn the
  same way, as the uncrossed chain requires. When fully wound, the chain leaves
  the fusee at its small end; when run down, at its large end.
- **Wind indicator.** 14/96 × 8/98 gives 4.286° an hour, which is the dial's
  240° over 56 h. The hand starts at UP (60°) and turns clockwise to DOWN (300°).
- **Maintaining work.**
  - The fusee's winding ratchet drives the winding pawls in the running
    direction and slips under them when winding.
  - The sustaining ratchet's steep faces meet the sustaining pawl against the
    sustaining spring.
  - The setup click holds the barrel arbor against the mainspring's pull.
- **Winding stop.** The stop-bar approaches the stop pin from its free side and
  meets it at full wind.
- **Escapement.** At contact, the escape tooth and the impulse jewel move the
  same way. The walkthrough's 2-D diagram draws the impulse roller's crescent
  exactly as the 3-D part.
- **Balance.** 2 Hz (14,400 beats an hour). An amplitude of 255° gives 1.42 turns
  of motion; the manual says 1⅜–1½. The screws are in diametric pairs, and the
  moment-of-inertia formulae are correct.
- **Gimbals.** The box turns Rz(roll)·Rx(pitch), the ring turns Rx(−pitch)
  relative to the box, and the bowl turns Rz(−roll) relative to the ring. The
  product is the identity, so the bowl stays level.
- **Barrel.** Its wall is never collision-tested (see finding 7), so its
  clearances were checked by hand. The tightest is 0.15 mm, between its cap
  screws and the third wheel. It clears the train bridge's cutout by 1.7 mm,
  and the centre arbor and the third wheel's arbor by about 4 mm.

### Views

Screenshots of all six views (Box, Dial, Exploded, Movement, Train,
Escapement) render correctly, and the hands read the right time.

## Findings, most serious first

### 1. The dial style reverts when parts are see-through, singled out or faded

`mv.userData.dial(kind)` ([movement.js:240-241](marine-chronometer-source/chronometer-working-model/js/movement.js#L240-L241))
writes the new face texture onto `dface.material`. That is whatever material
`look()` in `app.js` has currently assigned to the dial face: often a
see-through (ghost) or faded copy, not the dial's own material
(`userData.mat0`). When `look()` next puts the dial's own material back, the
old face returns.

- Reproduced in headless Chromium: tick See-through plates, choose the Roman
  dial, untick. The Hamilton face comes back under Roman hands.
- The same happens when a part is singled out, which makes the dial
  see-through, or when the dial has been faded.
- Suggested fix: set the texture on the dial's own material, and have
  `fadeOf` and `ghostOf` copy `map` and `color` from their source each time
  they are used.

### 2. The plate finish doesn't reach faded parts

`M.setPlateFinish` ([core.js:76](marine-chronometer-source/chronometer-working-model/js/core.js#L76))
updates `M.plate`, `M.plateSolid` and their see-through copies, but not the
faded copies that `fadeOf` makes
([app.js:137](marine-chronometer-source/chronometer-working-model/js/app.js#L137)).

- Reproduced: fade the barrel bridge to 50% (right-click), then choose Gilt.
  The bridge stays nickel (#d5dad1, against #be812c for gilt).
- The fix for finding 1 covers this too.

### 3. The escape upper bridge's screw heads reach 0.06 mm into the balance's path

The bridge's two screws
([movement.js:212](marine-chronometer-source/chronometer-working-model/js/movement.js#L212))
sit on its top face at y −24.66 with 0.5 mm heads, so the heads reach −25.16.
The balance rim and the timing weights reach −25.10.

Measured in the page:

| Screw | Distance from the balance staff | Head covers | Passes under |
|---|---|---|---|
| First | 13.7 mm | 12.8–14.6 mm | the rim (13.1–14.5 mm), on every swing |
| Second | 16.0 mm | 15.1–16.9 mm | the timing weights' path (15.05–16.75 mm) |

- `dyn.py` can't see this: it works in 0.4 mm cubes and ignores overlaps under
  0.3 mm³.
- The README's "rim 0.4 mm clear of the escape upper bridge" is true of the
  bridge, not its screws.
- Suggested fix: make the heads 0.35 mm tall or less, or raise `BAL_Y` by
  0.1 mm (the rim's height is fitted, not measured).

### 4. The model stops at 56 h, but its chain holds 60 h

- The run test is `run=hrs<56`
  ([app.js:449](marine-chronometer-source/chronometer-working-model/js/app.js#L449)),
  and the Since winding slider stops at 56
  ([index.html:69](marine-chronometer-source/chronometer-working-model/index.html#L69)).
- Winding with the key "From run down" starts at 60 h
  ([app.js:306](marine-chronometer-source/chronometer-working-model/js/app.js#L306)).
  That is the fusee's 8¾ turns, and matches the manual's 17½ half turns to wind
  a run-down chronometer.

Consequences:

- After the model runs down by itself, 0.58 of a fusee turn of chain is still
  on the fusee.
- Pressing Wind with the key then jumps the fusee, chain, barrel and wind
  indicator back 4 h at once, before the first half turn.
- For the first ~1.2 half turns the clock is frozen (`hrs` ≥ 56). Meanwhile the
  readout says both "Run down. Wind it to restart." and "Winding, maintaining
  power driving the train", and the key panel says the sustaining spring drives
  the train.
- With From run down unticked, winding a model that ran down by itself takes
  16⅓ half turns, not the 17½ that the Wind button's tooltip gives.

Suggested fix: run down at `FUSEE_TURNS/FUSEE_PER_HOUR` (60 h), and keep 56 h
as the dial's rated run.

### 5. The fourth wheel and escape pinion are 0.045 mm too far apart

This is 0.14 of a tooth module, a shallow mesh. Every other mesh is within
0.003 mm (see [Gear meshes](#gear-meshes)). The escape wheel's position is
fixed by its 9.40 mm distance from the balance. The simplest fix is therefore
the fourth stage's module: `MOD.fourth=0.3113` gives (60 + 8) × 0.3113 ÷ 2 =
10.584 mm. Then rerun `dyn.py`.

### 6. `solve.py` no longer reproduces the layout

- Its measured inputs predate the two-photo fit: fusee (12.0, −17.8), barrel
  (−20.1, 4.9), balance (7.9, 8.6), and an 18 mm balance radius.
- Its best answers (modules 0.32/0.32/0.33, third wheel at (−7.29, 12.42))
  match neither `MOD` (0.29/0.30/0.31) nor `L.T` (−4.86, 12.11).
- `L.T` is exactly the two-circle solution for modules 0.29/0.30 with the
  current centre and fourth wheels: (−4.858, 12.112).
- CLAUDE.md and the README say to rerun it after changing a tooth count.
  Today that would give wrong positions.

### 7. The collision claim is broader than the check

The About dialog
([index.html:149](marine-chronometer-source/chronometer-working-model/index.html#L149))
says "Every part was tested for collisions through a full escapement cycle".
But:

- `interference-check.js` skips double-sided, transparent, tube and instanced
  meshes, and meshes marked `noCap` or `noShadow`. The barrel wall, mainspring,
  chain, hairspring, trip spring and dial face are therefore never tested.
- It skips hidden meshes, so the split-balance variant is never tested (see
  [finding 9](#9-the-split-balance-variant-runs-through-the-barrel-bridge)).
- It can't resolve overlaps as thin as finding 3's.

The barrel was checked by hand and is clear (see
[Mechanics, by hand](#mechanics-by-hand)). Suggested fix: narrow the wording,
or add analytic clearance checks for thin gaps and for the hidden variant.

**Status (fine interference pass):** mostly addressed by `tools/fine.py`,
which resolves 0.05 mm and tests the chain, the hairspring, the trip spring,
the barrel wall (as a solid, with its margins) and the mainspring, and with
`--split` the hidden split-balance variant (it fails there: finding 9 is still
open). Still untested: the dial face. The About dialog now says what the
checks cover, names the dial face as untested and the split-balance variant as
not yet clear, so the finding is resolved. See
[Fine interference pass](#fine-interference-pass).

### 8. The dial looks small in its case (worth checking, not confirmed wrong)

*Fixed (RESOLVED.md, Setup, case and gimbals): the case was 13 mm too wide all
round and held nothing. It is now built from the movement it holds: the mounting
ring's flange in a recess round its top on a shoulder, the dial (95 mm, the side
photograph) inside it, the bezel screwed on round the rim.*

- The dial is 50.8 mm in radius, the estimated 4 in.
- The bezel's inner edge is at about 60.9 mm (the torus at 63.5 mm less its
  2.6 mm tube), and the glass is 62 mm.
- That leaves a 10 mm ring through which the default Dial view shows the inside
  of the case, and the movement's striped plate below 4–5 o'clock.
- The top-view photograph shows the case fitting close around the movement. The
  dial's size is worth comparing with the manual's Fig. 1 or Fig. 107.

### 9. The split-balance variant runs through the barrel bridge

Found while checking the fixes; the geometry is unchanged since `f591611`.
Variants → Balance → Split bimetallic rim shows `R.balS`
([movement.js:340-345](marine-chronometer-source/chronometer-working-model/js/movement.js#L340-L345)).
Its two compensation weights are `cylY(2.3, 4.2)` set radially at `BR + 1.9`:

| | Weights | Barrel bridge | Escape upper bridge |
|---|---|---|---|
| Distance from the balance staff | 14.3–18.5 mm | cut round the balance at 17.7 mm | 5.9–18.9 mm |
| Height (y) | −28.6 to −24.0 | −27.16 to −23.76 | −24.66 to −23.76 |

So the weights stand 1.1 mm proud of the rim on each side, and reach 0.8 mm
into the barrel bridge's cutout.

`dyn.py` with the split balance shown, and 40 extra balance phases (every
0.025 of an oscillation) added to its own:

- **Barrel bridge:** about 10 mm³ of overlap at almost every phase.
- **Escape upper bridge:** up to 7.8 mm³ (phases 0, 0.025 and 0.2).
- **Dust seal** (`post`): up to 0.8 mm³.
- **A balance-lower-bridge screw:** 0.4 mm³ (phase 0.05).

`dyn.py` as committed never sees this, because the variant is hidden when the
page loads and the check skips hidden meshes.

Suggested fix: smaller weights (a radius of about 1.1 mm keeps them within
the rim's 2.4 mm height), set no further out than the timing weights (17.35 mm).
Then run `dyn.py` with the variant shown.

## Smaller issues

- **The balance slows down above 1×.** Between 1× and about 10×, the balance
  switches to its slow display swing (0.9 Hz), and the escape wheel moves
  continuously instead of stepping. At 2× the balance therefore swings slower
  than at 1×
  ([app.js:456](marine-chronometer-source/chronometer-working-model/js/app.js#L456)).
  Raising the threshold to about 5× would keep the true motion there.
  *Fixed: the true motion is kept up to 5× (`REAL_X`), and above it the HUD
  says the swing is shown slowed.*
- **Short hands.**
  - Hamilton dial: the minute hand stops 2 mm short of the minute track (tip at
    44 mm radius, track from 46 mm).
  - Roman dial: the minute hand's tip is at 45 mm and the track starts at 47 mm.
  - The wind-indicator hand is 0.5 mm short of its marks.
- **Floating minute hand.** The minute hand and its hub float 0.8 mm above the
  top of the cannon pinion: the pipe ends at y 4.9 and the hub starts at 5.7.
  This is only visible in the 12–6 cross-section.
  *Fixed: the cannon pinion's pipe runs to a shoulder at 5.75 and ends in the
  square; the minute hand, broached square, sits on it, and the hour hand has
  a round collet on the hour wheel's pipe (Ops. 58, 59, 64).*
- **Committed tool outputs.** `tools/r_p3.png` (456 KB) and `tools/p3fit.json`
  are outputs of `p3fit.py`, committed by mistake in `1340cb6`. `.gitignore`
  doesn't cover the tools' outputs, so running them from `tools/` dirties the
  working tree.
  *Fixed: both are untracked, and `.gitignore` covers every file the tools
  write (`r_*.png`, `r_ill/`, `fit.json`, `p3fit.json`, `unproj.json`,
  `bundle.npy`).*

## Not covered

- The essay, beyond its copy of the escapement solver. *(It has since been
  rewritten as the model's Essay tab.)*
- The photo-fitting tools (`fit.py`, `bundle.py`, `unproj.py`), which were not
  rerun.
- Phone layout and the CSS.
- Anything `IDEAS.md` already lists.

## Fixes for findings 1–5

### Changes

| Finding | Change |
|---|---|
| 1, 2 | `core.js`: a new `syncMat(d, s)` copies a source material's texture and colour into a copy derived from it. `ghostOf` and `fadeOf` (`app.js`) now return synced copies. `mv.userData.dial(kind)` in `movement.js` sets the texture on the face's own material (`userData.mat0`). `setPlateFinish` sets only the two plate materials. `app.js` calls `look()` after a dial style or finish is chosen, so the parts on screen follow at once. |
| 3 | `movement.js`: the escape upper bridge's two screw heads are 0.3 mm tall (were 0.5). |
| 4 | `movement.js`: `RUN_H = FUSEE_TURNS/FUSEE_PER_HOUR`, 60 h. `app.js`: the model runs down at `RUN_H` (was 56 h). "Power left", "running stored" and the Power diagram count from it, and the Fusee diagram's axis runs 0–60 h. Key winding "From run down" starts at `RUN_H`, and the status line mentions maintaining power only while the model runs. `index.html`: the Since winding slider goes to 60. |
| 5 | `movement.js`: `MOD.fourth` is 0.3113 (was 0.31); the comments quoting the modules are updated. |
| Docs | The model's README records the 60 h run-down, the fourth stage's module and the escape-bridge screws' clearance. |

`python build.py` regenerated `dist/chronometer-working-model.html`, the root
`chronometer-working-model.html` and `site/index.html`. The essay's outputs did
not change.

### Checks after the fixes

- **Finding 1**, in headless Chromium:
  - See-through on, Roman, see-through off: Roman face and Roman hands, and the
    face's own material carries the Roman texture.
  - Hands singled out, Roman, hands released: Roman face.
  - Back to Hamilton: Hamilton face and hands.
- **Finding 2**: a barrel bridge faded to 50% turns gilt (#be812c) when Gilt is
  chosen, with see-through on too, and back to nickel (#d5dad1) with Nickel.
- **Finding 3**: the heads now end at y −24.96. The rim and timing weights reach
  −25.10, so the heads are 0.14 mm clear.
- **Finding 4**:
  - From 59.9 h at 3600×, the model runs down at 60.0 h with the fusee at 8.75
    turns.
  - Winding with the key (From run down unticked) starts at "Half turn 1 of
    17½" with the fusee still at 8.75 turns, so nothing jumps.
  - While winding, the status line reads "Winding, maintaining power driving
    the train" once the model runs.
  - It ends "Fully wound after 17½ half turns."
- **Finding 5**: fourth wheel and escape pinion, centre distance 10.5846 mm
  against a pitch sum of 10.5842 mm, an error of +0.0004 mm.
- **`escapement.js`**: unchanged; all nine figures ok.
- **`dyn.py`**, at mid-travel and with the weights at +3 and −3 turns: the same
  seven intended overlaps as before the fixes.
- **`audit.py`**:
  - `dupScrews`, `floatScrews` and `isolated` are 0; `zfight` is 45.
  - `looseEnds` is 5: the winding-stop pin and balance-screw and weight-screw
    ends. The count depends on the balance's angle when the page loads.
- **`audit.py box`**: unchanged.
- **Rebuilt pages**: the root copy and `site/index.html` load with no page
  errors and make no network requests.
- **Link-preview images**: not regenerated; the changes aren't visible at that
  size.

## Fine interference pass

29 September 2026, after `245442c`. It started from an escape pinion seen
touching the third wheel, then reviewed every stage of the power train and the
timekeeping parts.

### The check

`tools/fine.py` with `tools/fine-interference.js` (new). For every pair of
meshes whose boxes meet, it casts vertical rays through only the shared box, on
a 0.05 mm grid, and measures where both are solid. It runs:

- the 18 escapement phases `dyn.py` uses;
- 15 train positions, whole teeth apart, with wind states from run down to full
  wind, and winding;
- with `--dense`, 101 phases across a full balance swing.

Unlike `dyn.py` it tests each link of the chain and the tube springs
(hairspring, trip spring). Its `EXPECTED` table lists the intended contacts with
their reasons and size limits; anything else fails. Planting the old escape
pinion back makes it fail (0.31 mm, `escW × tw`), and `--split` reproduces
finding 9.

### Fixed

| Overlap | Size | Fix | Commit |
|---|---|---|---|
| Escape pinion into the third wheel's teeth | 0.31 mm high, 0.37 mm deep | Pinion runs from the fourth wheel toward the plate | `329e77e` |
| Fourth wheel's collet into the third wheel's teeth | 0.38 mm | Collet on the plate side only (`cside`) | `329e77e` |
| Sustaining pawl's arbor into the fusee wheel's teeth | 0.12 mm | Pivot 21.35 mm from the fusee axis (was 21) | `329e77e` |
| Stop-bar through the fusee arbor at full wind | 1 mm³ | One bar beside the arbor, re-aimed at the stop pin | `b39086a` |
| Stop-bar through the chain's top turn at full wind | 0.18 mm | Raised top cap, thinner bar above the chain | `0371c16` |
| Chain's straight run into the barrel (found by the barrel check) | 0.24 mm | Common tangent of the two drums; winding-stop pin 0.2 mm shorter | `ba9634f` |

All were thinner than `dyn.py`'s 0.4 mm cubes, and the barrel wall was never tested before.

Each fix was also checked with before/after renders of every view button,
with and without "Moving parts only", in a frozen state, and a pixel diff
(now `tools/views.py`): the only changed pixels were on the parts fixed. Each
also left `dyn.py`, `audit.py` and `escapement.js` as they were, apart from
the moved parts' own entries.

### Stage by stage

Every mesh's centre distance equals its pitch sum (see [Gear meshes](#gear-meshes)),
and each wheel's face lies wholly within its pinion. After the fixes, no wheel
or pinion touches anything but its partner at any position tested:
barrel → chain → fusee, the maintaining work, fusee wheel 96/14, centre 80/10,
third 75/10, fourth 60/8, the motion work and the wind indicator.

Timekeeping parts, over 101 balance phases: the escape wheel, rollers, detent,
trip spring and balance touch nothing but their pivots. The hairspring's upper
end sits 0.1 mm into the cock, pinned in its stud. `escapement.js`: all nine
figures ok, unchanged.

### Documented, not changed

These are intended contacts, in `fine.py`'s `EXPECTED` table with their limits:

- **Two pins graze the bevel of their train-bridge holes.** `polyGeo`'s bevel
  narrows the train bridge's holes near one face. The sustaining pawl's arbor
  (r 0.7 in a 0.72 hole) overlaps it by 0.058 mm³ over 0.18 mm of depth, and the
  winding-stop pin (r 0.9 in a 1.0 hole) by 0.034 mm³ over 0.16 mm. Both are
  inside the bridge and not visible. To remove them, widen the two holes by
  0.2 mm, or leave the bevel off holes.
- **Chain links on the fusee cone,** up to 0.5 mm. The groove is turned rings,
  not a helix, and each link is an upright box on a slope of up to 60°, so its
  lower edge dips into the cone. This stands for the chain lying in its groove.

### The barrel wall

The barrel's wall is an open, double-sided cylinder (`noCap`, r 13.5 mm), and
ray parity needs closed meshes, so neither check could test it. The plan was
carried out as follows.

- **Solid stand-in.** `fine-interference.js` tests any open cylinder marked
  `noCap` as the solid it encloses. The barrel arbor on its axis is expected.
- **Margins.** `barrel-clearance.js` measures how close every other part comes
  to the solid the whole barrel sweeps as it turns: wall, caps, cap screws,
  hook and boss. Signed distance to each piece is convex, so a branch and bound
  with tangent-plane bounds gives margins to about 0.002 mm in 0.5 s a state.
  `fine.py` runs it at its 15 wind states and fails on anything closer than
  0.05 mm that isn't in `BARREL`.
- **Mainspring.** Its drawn coils, over the wind, against the arbor, wall and
  caps.
- **Proved.** Three planted faults fail as they should, with no source edits
  (`--eval`):
  - the wall scaled 1.2×: it hits the train bridge, the detent and the chain;
  - the barrel moved 0.2 mm toward the plate: the third wheel is 0.050 mm
    inside, exactly the 0.2 less its 0.15 mm gap;
  - the mainspring scaled 1.1×: its outer coil is 0.69 mm through the wall.

Results, over the wind:

| Part | Closest to | Margin |
|---|---|---|
| Chain (wound on the drum) | wall | 0.013 mm, expected (0–0.1 mm) |
| Third wheel | cap screws, below them | 0.150 mm |
| Barrel bridge | boss on the upper cap | 0.550 mm |
| Detent foot | wall | 0.983 mm |
| Train bridge's cutout | rim of the upper cap | 0.998 mm |
| Centre wheel | rim of the lower cap | 2.08 mm |
| Balance | rim of the upper cap | 2.34 mm |
| Mainspring | arbor / wall / caps | 1.2 / 0.6 / 0.3 and 0.2 mm |

These agree with the review's hand check except the cutout: its 1.7 mm is
measured to the wall, and the caps' rim, 0.7 mm wider, is 1.0 mm from it.

The check found one fault. The chain's straight run joined the two drums'
lowest points, which is a true tangent only when their radii are equal; with
the fusee smaller, the run cut up to 0.24 mm into the barrel. It is now the
common tangent. The winding-stop pin, which the fusee's turned wrap then
brushed at full wind, ends 0.2 mm higher, still covering the stop-bar.

The dial face (a flat, open ring) is the one open surface still untested.

## Barrel and fusee against the manual

A second review, of the power side only: is every part of the barrel and fusee
modelled, and is each one right? Sources: the manual's Sec. II and IV,
disassembly Ops. 7–9 and 27–45, reassembly Ops. 16–54, Figs. 12, 17–18, 24–29,
67–80 and 109, and the parts lists for Figs. 108–110. Checked against
`movement.js` and `app.js` in the working tree, 29 September 2026.

### The parts

Every part number in the model's descriptions matches the parts list. Parts
marked "added" were missing; the model's shapes for them are estimated from the
figures (listed in the README's "Estimated, not from the manual").

| Part (Hamilton no.) | Before | Now |
|---|---|---|
| Fusee with arbor and wind-indicator pinion (42021, 42022) | modelled | the fusee turns every frame (it lagged its square by up to 0.29°) |
| Fusee chain (42001) | links only | added: a pin at the fusee's large end, a hook at the barrel |
| Winding ratchet wheel (42013) | modelled | unchanged |
| Winding ratchet wheel screws (42014, 2) | missing | added, heads in the sustaining ratchet's open centre |
| Sustaining ratchet wheel with pawls (42009) | modelled, as part of the fusee wheel | its own part, with its own description, exploded apart as in Fig. 28 |
| Winding pawl springs (42007, 2) and screws (42012, 4) | missing | added: flat springs bearing on the pawls |
| Sustaining spring (42016) | modelled, inside the fusee wheel part, 0.05 mm into its web | its own part, clear of the web |
| Fusee wheel (42015) | modelled | unchanged |
| Fusee end plate (42019) and taper pin (42020) | missing | added |
| Winding stop-bar (42024) | a 0.22 mm bar on a turned cap, 0.6 mm under the train bridge | in a slot in the fusee's top, under the top plate |
| Winding stop-bar spring (42025) | missing | added: a wire in a groove, bearing on the bar's inner end and following it |
| Fusee top plate (42008) and screws (27760, 2) | missing | added |
| Winding stop (42099) | a pin down through a hole in the train bridge | a stud from the barrel bridge, through the train bridge's pocket |
| Sustaining pawl with arbor and springs (42096) | pawl and arbor | added: its spring, round a steady pin in the train bridge |
| Barrel (42168), cap (42169) and 5 screws (37023) | modelled | unchanged |
| Barrel arbor (42170) | shaft and squares; the mainspring's inner coil floated 1.2 mm off it | added: the core and the hook for the spring's inner end |
| Mainspring brace (42037) | a small block | a strip lining 40° of the wall |
| Mainspring (42038) | schematic | unchanged |
| Setup ratchet (42026), pawl (42027), cover plate (42029) and screws | modelled | unchanged |
| Setup pawl spring (42028) | missing | added |
| Dust seal (42051), its screws and packing rings (42054) | modelled | unchanged (seal ring and helical spring are inside it, not drawn) |

Right as they were: the directions (fusee and barrel clockwise from the train
side in running, the key counterclockwise), the stack order of Fig. 28, and
the stop-bar reaching the stop at full wind.

### Findings

1. **The sustaining ratchet turned back when winding stopped.** `update()` put
   the ratchet on the winding-pawl engagement nearest the fusee wheel
   (`Math.round`). A probe of 12 windings: 6 ended with the ratchet jumping
   0.8–5° backward past the sustaining pawl, which the pawl makes impossible.
   Physically the fusee turns forward (less than one winding tooth) until its
   ratchet catches the pawls, and then drives the sustaining ratchet forward.
2. **The sustaining spring had no steady load.** In running its deflection was
   whatever the fusee's phase left, from −4.5° to +4.3° (negative: stretched).
   It should hold one loaded deflection in running, relax while winding, and be
   reloaded when the key lets go.
3. **The fusee lagged its square by up to 0.29°.** It turned only when
   `setWind` ran (every 0.0008 turn), while the square turned every frame.
4. **The upper train bridge covered the fusee.** Figs. 24, 29, 67 and 77 show
   the fusee open to the barrel bridge, which holds its upper bushing (parts
   list 108-45, Op. 46). Covering it made the winding stop a pin through the
   train bridge and left no room for the top plate or the stop-bar spring.
5. **Thirteen parts were missing** and two were the wrong shape (the table
   above: the brace and the winding stop), and the sustaining
   ratchet, its pawls and the spring couldn't be picked, named or exploded
   apart.

### Fixes

- **Maintaining work** (`update()` in `movement.js`):
  - running: the sustaining ratchet turns with the fusee wheel (spring loaded);
  - the fusee sits `eps` past its `n` turns, where its ratchet bears on the
    pawls, and the arbor, square and wind-indicator pinion turn with it;
  - winding: the ratchet falls back to its pawl, then holds while the spring
    relaxes (drawn up to 10°, `SMAX`); `eps` runs down with `n`;
  - key let go: the fusee catches forward, the ratchet reloads the spring.
- **Train bridge:** a pocket round the fusee's top, the winding stop and the
  stop-bar's sweep over the last quarter turn. The plan was a cut open to the
  rim like the barrel's. That would uncover the fusee wheel just past the
  barrel bridge's straight edge (6.4 mm from the fusee axis), where the
  top-view photograph shows the train bridge. So the pocket stays 0.5 mm under
  that edge, and is smaller than the manual's opening.
- **Parts:** as in the table. The sustaining ratchet (`sratchet`) and spring
  (`sspring`) are their own parts, with descriptions, colours, a label, and
  places in the parts list, the key-winding focus and the "Winding without
  stopping" step. The sustaining pawl explodes level with its ratchet.
- **Checks:**
  - `tools/maintaining.py` (new) drives run and wind cycles and fails on any
    of the faults above. On the old code it failed (351 frames: spring load,
    arbor lag, ratchet turned back); now it passes.
  - `tools/fine.py`: the winding pawls' entry is renamed to `sratchet`, and the
    winding-stop pin's bevel entry is gone. New entries, each an intended
    contact: the spring's pin in the fusee wheel, the pawl spring on its pin,
    the chain's end pin and hook, and the arbor's core and hook in the barrel.
    The mainspring's inner coil is checked against the core (r 2.4).

### Checks after the fixes

- `maintaining.py`: ok, 311 frames. The stop-bar touches the stop at full wind
  (0.000 mm), is 2.34 mm clear half a turn before, and 0.66 mm clear after the
  key lets go.
- `fine.py`: 33 states, 23 pairs, 0 new or grown; 0 barrel problems. The
  mainspring's inner coil is 0.2 mm off the core.
- `audit.py`: no overlapping or floating screws. The loose ends are the
  expected ones: the winding stop's free end (listed or not, depending on the
  wind state at the time) and the balance's screw and weight tips. The new coplanar hits are faces in contact:
  the sustaining ratchet under the winding ratchet and pawls, and the pawl
  springs on the ratchet.
- `views.py --diff`: changed pixels only on the fusee stack, the barrel and
  setup area, the sustaining pawl, and the train bridge round the fusee. The
  dial view changes by 19 px: the wind-indicator hand, which now includes the
  fusee's `eps`.

### Not changed

- The stop-bar is still driven from the wind over the last quarter turn, not
  pushed by the chain. The chain's top turn passes under it.
- The model does not stop the train if a wind outlasts the sustaining
  spring's 5–10 minutes; that only happens at high speed.
- The rest of the upper train bridge's outline (Figs. 29, 67: a crescent) is
  still to trace (`IDEAS.md` 1.3). The chain's links are still boxes (1.9).

## Every part against the manual

A third review, of the whole movement and its case against the manual's parts
lists (Figs. 106–110, pp. 78–88), its description and principles of operation
(Secs. II–IV) and its handling instructions (Sec. III, Figs. 7–11), with the
Figs. 4, 9, 107, 108 and 110 drawings. It started from one complaint: every
screw was a head with nothing under it, which the Exploded view made plain,
and no part had a hole where a screw goes. Checked against `movement.js`,
`box.js` and `app.js` in the working tree, 29 September 2026.

### Screws and holes

- **Every screw has its shank.** `screw()` draws a fillister head and a
  threaded shank (turned rings of thread, a chamfered tip) of half the head's
  diameter, as long as the parts it passes through and about 3 mm into the part
  it holds. Each length is set where the screw is placed. There are 51, plus
  the train-blocking screw, which is drawn on its own because it moves.
- **Every screw has its holes.** The parts a screw passes through have a
  clearance hole (`hC`) and the part it screws into a tapped hole (`hT`): the
  pillar plate, lower train bridge, pillars (tapped at both ends), upper train
  bridge, escape upper bridge, barrel bridge, balance lower bridge,
  cock and cock foot, the endstone caps, setup cover and its feet, dust-seal
  flange, sustaining ratchet wheel, winding ratchet and a tapped disc in the
  fusee's large end, the fusee's top layers, top plate and boss, the detent
  support block and trip-spring bracket, and the balance's arm, hub and cap.
- **The Exploded view lifts each screw out of its holes** along its own axis,
  as Figs. 108–110 draw them, so the threads and the holes both show.
- **Screws in the case and gimbals** (`sHead` in `box.js`) have shanks too.
  Those parts never come apart in the model, so they have no holes.
- **Not holed:** the detent's clamp, detent-adjusting and lock-adjusting screws
  go across pieces that are drawn as vertical extrusions, so their shanks lie
  inside the foot and support block (`fine.py` lists this with its reason).

### The parts

Every Hamilton number in the Figs. 108–110 lists, and the case and box parts
of Figs. 106–107. "Added" parts were missing; their shapes are estimated from
the figures and listed in the model README's "Estimated, not from the manual".

| Part (Hamilton no.) | Before | Now |
|---|---|---|
| **Fig. 108: balance, cock, setup cover** | | |
| Balance cock (42066) and screw (42192) | cock and screw head | the screw goes through cock and foot into the train bridge; it sits 0.3 mm off its traced place, inside the tracing's 0.4 mm, so its thread clears the foot's edge |
| Balance upper endstone cap (42160), its setting (42155) and screws (20762, 2) | plate, stone, screw heads | screws threaded into the cock; the setting is drawn as the stone in the cap. Later reshaped to the top-view photograph (a 7.6 × 4.6 mm plate, stone in a gilt setting, screws 2.75 mm either side), with the cock's nose widened under it: it had overhung the nose with one screw in the air (RESOLVED.md). Then rebuilt to C Spinner's video (5:51, 41:58, 42:03, 42:08): a 7.2 × 4.6 mm plate symmetric about the staff, its corners rounded more at the nose's end, a polished conical oil sink 3.1 mm across in the setting down to the endstone, the screws' heads sunk flush (RESOLVED.md). Still open: the real cap ends at the nose's end, where the model's nose runs on about 1.2 mm past it |
| Balance upper setting (42162) | not drawn | not drawn: the staff is 0.7 mm from the traced cock's edge (IDEAS 1.4) |
| Balance and hairspring assembly (42193), wheel (42178) | modelled | unchanged |
| Hairspring (42188) | modelled | unchanged |
| Hairspring stud (42189), stud screw (27760), clamps (42191) and wedge pins (42147); collet (42190) | a block and a hexagonal collet | unchanged: Fig. 5's shapes are not drawn (IDEAS 1.4) |
| Balance screws (42171, 42173, 42174), timing weights and screws (42176, 42177), vernier weights and screws (37115, 42197) | modelled | unchanged |
| Timing washers (42181) | not modelled | not modelled: "as required" |
| Impulse roller (42263) and jewel (286), unlocking roller (42252) and jewel (287) | modelled | unchanged |
| Hub with staff (42186), cap (42248), hold-down screws (42249, 2) | a solid Invar cylinder through the arm | added after Fig. 4: the hub's flange under the arm and its boss through the arm's clearance hole, the cap over the arm, two hold-down screws into the flange |
| Balance wheel locking arm (42299), screw (37204), washer (42251), stop pin (42300) | missing | added, and it works (see below) |
| Setup cover plate (42029) and screws (42056, 2) | its feet stopped 0.35 mm short of the barrel bridge | the feet stand on the bridge; screws threaded into it |
| **Fig. 109: barrel, fusee, setup** | | |
| Setup ratchet (42026), pawl (42027), pawl spring (42028) | modelled | unchanged |
| Setup pawl pivot screw (42036) | a pin on the cover | a screw through the cover and the pawl's pivot into the barrel bridge |
| Dust seal (42051), screws (42056, 2), packing rings (42054) | modelled | screws threaded into the barrel bridge; the flange has their holes |
| Seal ring (42052), helical seal spring (42053) | inside the seal, not drawn | unchanged |
| Barrel bridge (42061), pillar screw and screws (42055, 1 + 2) | modelled | threaded: into the barrel pillar, through the train bridge into its pillar, into the train bridge |
| Barrel and fusee upper bushings (42164) | missing | added, in the barrel bridge |
| Winding stop (42099) | modelled | unchanged |
| Barrel (42168), cap (42169), cap screws (37023, 5), arbor (42170), mainspring (42038), brace (42037) | modelled | unchanged (the cap screws are heads on the cap) |
| Fusee and its parts (42006, 42015, 42016, 42019–42022, 42024, 42025, 42008), chain (42001) | modelled | unchanged |
| Sustaining ratchet wheel with pawls (42009), winding pawl springs (42007, 2) and screws (42012, 4) | the springs were strips 0.3 mm wide under 0.8 mm screw heads; `audit.py` found the screws standing on nothing | each spring has a foot under its two screws; screws threaded into the wheel |
| Winding ratchet (42013) and screws (42014, 2); fusee top plate (42008) and screws (27760, 2) | screw heads | threaded into a tapped disc in the fusee's large end and into the fusee's boss |
| **Fig. 110: train, escapement, plates** | | |
| Escape upper bridge (42064A) and screws (20762, 2) | modelled | screws threaded into the train bridge |
| Escape upper setting (42162) and endstone cap (42159) with screws (20762, 2) | a ring on the bridge, a stone above it and two plain pins | the setting and its jewel pressed into the bridge, a cap over it with the stone, two screws |
| Detent (42087), jewel (285), bracket (42092), trip spring (42088), support block (42086), lock-adjusting and clamp screws (42091), detent-adjusting screw (20756), clamp screw (37024) and washer (42251) | modelled | the adjusting and clamp screws have shanks; the trip-spring screw (1770) a fine thread in the bracket |
| Detent support block screw (42056) | a head | threaded through the train bridge into the block |
| Locking jewel wedge pin (42089), trip-spring bracket screw (1770) | not drawn | unchanged |
| Escape wheel (42076), centre (42068), third (42071) and fourth (42073) wheels | modelled | unchanged |
| Upper train bridge (42062), pillar screws (42055, 3), bushings (42166, 42167) | modelled | screws threaded: two into their pillars; the third, where the top-view photograph shows it, has no pillar under it in the model (IDEAS 1.2), so it is drawn threaded into the bridge alone |
| Sustaining pawl with arbor and springs (42096) | modelled | unchanged |
| Balance lower bridge (42065) and screws (42055, 2) | a stadium, a boss, screw heads | a lobe for the train-blocking screw; later a stepped block: upper tier against the train bridge, the screws (pillar-screw size) from below into the train bridge (Figs. 29, 110; Ops. 12, 50), steady pins, the pillar plate's access hole (RMG No. 4E019); later a frame round the escape wheel in Fig. 30's order, the train-blocking screw, a pin and the second screw at holes on the top-view photograph |
| Balance lower setting (42162), lower endstone cap (42159) and screws (20762, 2) | a 0.5 mm hole the staff ended in | added: setting and jewel, and a cap under the bridge; the staff's pivot reaches the endstone |
| Fourth wheel upper setting (42161) | a hole | added: setting and jewel |
| Train-blocking screw (42247) | missing | added, and it works (see below) |
| Train bridge pillars (42059, 3), barrel bridge pillar (42058) | modelled | tapped at both ends |
| Pillar screws (42055, 3 + 1) from the dial side | missing | added, through the pillar plate into the pillars |
| Lower train bridge (42063), screws (42163, 2), third and fourth lower settings (42161) | modelled | screws threaded into the pillar plate |
| Pillar plate (42060), centre, barrel and fusee lower bushings (42165, 42164) | modelled | unchanged |
| Escape lower setting (42162) | a gilt ring | its jewel added |
| Escape lower endstone cap (42159) and screws (20762, 2) | missing | added, on the dial side |
| Minute wheel post (42085) and wind indicator wheel post (42084), with their screws (35779) | the two wheels turned on arbors of their own | fixed posts screwed to the plate from its train side; the wheels turn on them, the wind indicator wheel's hand on its pipe |
| Mounting ring (42057) and screws (42055, 3) | a ring beside the plate, no screws | a lip under the plate's dial side, held by three screws; since, the deep ring under the plate that Figs. 29, 67 and 110 draw, carrying the dial, with its alignment pin |
| **Fig. 107: case, dial, motion work** | | |
| Dial (42030) and dial screws (35756) | three feet on the plate, no screws | each foot held by a screw from the train side of the plate; since, four feet in the mounting ring's flange, screwed from its train side, where the top-view photographs show the screws |
| Hands (42032–42035), cannon pinion (42077), minute wheel (42078), hour wheel (42080), wind indicator wheel (42081) | modelled | unchanged |
| Case (42101), bezel (42102), crystal (42103), case support brackets (42105) and screws (42117) | modelled | the bracket screws have shanks |
| Latch keeper (42113) and its screw (42116); separating washer (42128) | the keeper only | unchanged |
| Shield plate (42104), shoulder screw (42124), stop screw (42125), return spring (42126) | modelled | unchanged. Fig. 107 draws the plate as a disc and the spring as an open ring. A disc that size, turning beside the key hole, would overhang the case's flat bottom, so the model keeps its lobed plate and coiled spring (estimated) |
| **Fig. 106: box and gimbals** | | |
| Mounting box (42201), key (42044), gimbal ring (42106), gimbal and case support straps (42107, 42108) and screws (42116), pivot screws (42118–42120), washers (42122), lock nuts (42121) | modelled | strap screws have shanks |
| Latch: support bracket (42109), lever (42111), handle (42112), bracket screws (42115) | modelled, shown released | unchanged |
| Latch clamping bracket (42110), take-up spring (42277) and screw (42276), clamping screw (42114), washer (42123) | not modelled | unchanged |

### Jewels

The manual counts 14 (Sec. II). The model draws 13: impulse, unlocking and
locking; both of the escape wheel's hole jewels and endstones (three added);
the balance's lower hole jewel and both endstones (two added); both of the
fourth wheel's bar-hole jewels (one added) and the third wheel's dial-end one.
The fourteenth, the balance's upper hole jewel, is not drawn (above).

### Function

Checked against Secs. II–IV and the handling instructions:

- **Already right:** the directions of turning (the fusee wound
  counterclockwise, the barrel clockwise in running), 7 half turns a day and
  17½ from run down, the maintaining work (Sec. IV, `maintaining.py`), the
  detent's five steps and the adjustment figures (Ops. 84–88, 97,
  `escapement.js`), the hands in half-second steps, the winding stop at full
  wind, the balance's 1⅜–1½ turns.
- **Wrong before: the model started by itself.** Wound after running down, it
  simply ran again. A detent chronometer isn't self-starting. It stops when its
  balance no longer swings far enough to unlock the wheel, and the manual has
  it started with "a single quick twist" of the box (Sec. III). The model now
  keeps the balance's amplitude:
  - It needs `ESC.AMIN`, 41.1°, to keep going: the swing has to carry the
    discharge jewel past the trip spring on the return (it falls off at
    −39.1°), unlock the wheel (−21.3°) and see the impulse through (+20.8°).
    `makeEsc` works it out from the escapement's own tables.
  - Below that the train stops at a locked beat and the balance swings down
    freely, the detent still lifting while the swing carries the jewel back past
    the trip spring's tip (above 39.1°). Below that the jewel stays on the near
    side of the tip: the trip spring stays bent against it and follows it back,
    and the detent stays on its stop.
  - Twist to start sets it swinging again (160°), after which it builds up to
    its running 255°.
  - The same holds at run down: the train stops, the balance runs down, and a
    wound chronometer needs its twist.
- **Added: the balance locking arm** (Fig. 9). Locked, its end lies under the
  rim, its pad bears on the rim, and the balance stops within a swing or two.
  Unlocked, the arm lies against its stop pin, and the balance needs a twist.
- **Added: the train-blocking screw** (Sec. II, Fig. 110).
  - Screwed down, its dog point stands between the fourth wheel's spokes. The
    train runs on until a spoke meets it, at most about 22 beats (11 s at 1×), and stops at
    the last whole beat before contact; the balance then swings down, unlocking
    a wheel that can't turn.
  - It waits above the wheel while a spoke is under it.
  - Raised within a minute or two, before the balance drops below 39°, the
    chronometer carries on by itself.
  - It sits in the balance lower bridge beside the fourth's setting, toward
    the lug at that end, 5.0 mm from the arbor, as the restoration video has
    it ("The balance lower bridge", 7).
- **Not modelled:** setting the hands with the key on the centre square
  (Fig. 8; the Time panel sets them), the gimbal latch (shown released), and
  the hairspring's stud and collet as Fig. 5 draws them.

### Found along the way

- **`polyGeo`'s bevel narrows every hole** by 0.8 × the bevel (0.18 mm on the
  train bridge) at both faces. A screw that fits its tapped hole grazed it
  there, 0.1–0.2 mm deep, in eight places. Screw holes are now cut that much
  larger, so they have their size at the faces (wider inside the plate, where
  it can't be seen); arbor holes are unchanged.
- **The minute wheel and the wind indicator wheel turned on arbors of their
  own**, the wind indicator's running through the pillar plate. The parts list
  has fixed posts screwed to the plate (above).
- **The balance's lower pivot and the escape arbor's pivots ended in nothing
  or in bare holes**: no jewels, no endstones. They now run in their settings
  up to the endstones.

## Fusee and chain against the manual and photographs

Checked against Secs. I, III and IV, Figs. 12, 26, 28, 38 and 70–75, and the
side and oblique photographs (`References/photo-side-view.jpg`,
`photo-oblique-balance-side.jpg`). The side photograph is scaled by the fusee
wheel's tips (96 teeth, module 0.4171: 40.87 mm, 694 px) about its axis.

### Right as they were

- Directions: fusee and barrel clockwise seen from the key while running, the
  key counterclockwise (Secs. III, IV); an open chain run on the drums' common
  tangent, leaving the fusee's small end at full wind and its large end run down.
- The chain pinned at the fusee's large end and hooked near the top of the
  barrel (Figs. 26, 28, 75).
- 17½ half turns for a full wind, 7 a day (96/14); the maintaining work.
- The chain's coils on the barrel: widely spaced near its top, closer toward
  the plate, as both photographs show. The run stays level, so on a plain drum
  each coil lies where the fusee's groove was when it came off.

### Findings, all fixed

1. **The fusee was too thin at its small end, its top too small.** Groove floor
   on the photograph 8.33 to 13.81 over the eight upper turns, flanges about
   1.25 over the floor of the turn below, top 9.3, base flange 18.3; the model
   had r 6.5 to 14 and a top plate of r 5.4. Fig. 28 draws the photograph's
   proportions (the top about 0.6 of the largest turn). The measured floors fit
   `r0/√(1−a·m)` (the fusee for a pull falling with the barrel's turns) to
   0.085 mm rms: 7.95 to 16.8.
2. **The groove was turned in rings,** a 0.4 mm ripple of the lathe profile, not
   the helix of thin flanges photographed.
3. **The links lay flat.** A fusee chain bends about rivets parallel to the
   arbor; its figure-eight plates (Fig. 38) stand on edge, three deep. The
   model's boxes were 1.0 along the arbor by 0.34 radially. The end pin was
   radial; Fig. 28 draws it parallel to the arbor.
4. **The chain didn't work the stop-work.** Sec. IV: the chain "bears against
   one end of the spring-activated winding stop-bar, the opposite end of which
   moves out to engage the winding stop". The bar slid out over the last
   quarter turn from the wind count, clear above the chain, both ends inside
   the fusee's top; the key walkthrough's text said the chain pushed it.
5. **The fusee chart and power readout used literals** (6.5, 14) for the
   profile.

Knock-on: the fatter fusee takes 656 links of chain (about 26 in with its run,
against 22; one sale listing gives 28.5 in for the Hamilton's), 7.07 barrel
turns. The model's mainspring took 6.53 on its r 2.4 core; on r 1.74 it takes
7.64, leaving a set-up of 0.37 turn.

### Noted, not changed

- The side photograph's barrel coils are about 1.4× further apart than a
  13.5 mm barrel predicts; the top-view comparison agrees with 13.5, so the
  barrel stays.
- On the side photograph the sustaining ratchet's teeth reach r 18.7; the
  model's (120 teeth, module 0.27) reach about 16.5.
- 17½ half turns at 96/14 hold 60 h of chain; the manual rates the chronometer
  at 56 h. A 96/15 first stage would give 56 h, but 7½ half turns a day, not
  the manual's 7. The model keeps 96/14 (finding 4 above).

### Checks after the fixes

`solids.py`, `fine.py` (0 new or grown; the chain's links no longer enter the
fusee, the groove replacing that expected entry), `fine.py --hold`,
`maintaining.py` (the stop-bar meets the stop at full wind, 2.6 mm clear half
a turn earlier), `exploded.py`, `invariants.py`, `audit.py`, `smoke.py` and
`node escapement.js`.

## BOM comparison (Sec. XI), 30 September 2026

Every line of the manual's parts list (Sec. XI, Figs. 106-110, pp. 78-88;
totals checked against the Sec. XII numerical list, p. 89) against the model,
by count, by how the part is held and runs, by what it meshes with, and, for the
jewels, by how each is seated. The comparison above ("Every part against the
manual", 29 September) is superseded by **`BOM.md`** at the repository root,
generated by `tools/bom.py --md` from `bom.json` and measurements of the built
model; several of its "not drawn" items were out of date (the balance upper
setting and jewel, the wedge pin 42089 and the trip spring screw 1770 were
drawn; the model has all 14 jewels, not 13).

### How it is checked

- `bom.json` holds 219 lines: 187 parts and jewels, and the assembly, reference
  (superseded), variant (p. 88's other sizes) and omitted (timing washers, "as
  required") lines, each with what the part does, its source, and its relations.
- Every piece of the model carries its line as `userData.hn`. `bom.py` counts
  them against the units per assembly, fails on any mesh without a line, and
  measures 319 relations on the built meshes in world space: rays out from each
  part's axis for threads, pivots, pins and settings (the gap and over what
  length), least surface distance for parts resting on others, centre distance,
  modules, face overlap and turning ratio for the gears, and axial freedom for
  endshake.
- Current result: 187 lines, 319 relations, 14 jewels, **no failures**, one
  known deviation (below).

### What it found (fixed; RESOLVED.md, Accuracy to the manual)

Missing parts, parts holding nothing, arbors without pivots or endshake, jewels
floating, buried or short of their pivots, loose or over-tight fits, and the
gimbal pivots and latch against Fig. 106: see the RESOLVED.md entry. The
gears were already right: every centre distance within 0.003 mm of
m(z1+z2)/2, modules matching, ratios and senses right (table in BOM.md).

### Still open

1. **The upper train bridge's third screw** (known deviation, `bom.json`
   `dev` on 42055.tb). The manual has all three in pillars (reassembly Op. 14; disassembly Ops. 47, 48);
   the model's third is where the top-view photographs (and serial 623's) show
   a screw, at (-8.5, 27.7), where a pillar would stand in the fourth wheel.
   What it holds in the real movement is not settled (IDEAS.md 1.2; examined
   again against Figs. 29, 67 and 110 on 1 October 2026, still open).
2. **Shape against the drawings and photographs**, part by part, not yet
   done. 44 web photographs were gathered (mostly all rights reserved: to be
   cited by URL, not committed). Candidates: the shield plate (Fig. 107 draws
   a disc and an open-ring spring; the model keeps its lobed plate), the setup
   ratchet and click (asked in Orel_comments.md), the dust seal, the detent's
   trip-spring bracket.
3. **Function checks** not yet in `bom.py` (the locking arm, train-blocking
   screw, twist to start, the setup click's direction, shield plate and latch):
   `maintaining.py`, `escapement.js` and `invariants.py` cover the maintaining
   work, the escapement and the train's arithmetic.
4. *Done:* **The other checks after these geometry changes.** `fine.py`
   (also `--hold`, `--dense` and the timing weights at ±3 turns),
   `maintaining.py`, `audit.py`, `solids.py` and `bom.py` pass. `fine.py` found
   three new contacts: the balance hub's boss was solid round the turned staff
   (now bored r 0.45, a press fit), the winding-pawl springs' screw heads
   touched the fusee's underside that turns over them (now 0.15 tall), and the
   barrel cap's screws stand in the lip inside the rim (an intended contact,
   added to `EXPECTED`). The 15 `EXPECTED` entries nothing matches any more
   (the hands on their arbors, the impulse jewel in its roller, pivots in their
   holes, the stud's steady pin, the sustaining spring's pin and others) are
   removed.
5. `bom.py` in CI: about 5 minutes a run.
6. **The third arbor's place** (fidelity, open). Mapped through the centre,
   the fusee arbor and the wind indicator wheel (which land within 0.8 mm of
   the model), a photograph of a Model 21's dial side puts the third lower
   setting at about (-8.0, 18.6), 7 mm from the model's T (-4.86, 12.11), and
   the lower train bridge at about 34 deg against the model's T-F line at 68.
   T is solved for clearance (README, step 5), and Fig. 67's fit lands a hole
   within 1-2 mm of it, so it is left; a clearer photograph of the dial side
   or of the train would settle it (moving T changes the centre and third
   stages' modules).
7. **The train-blocking screw's place** (fidelity, narrowed 1 October 2026).
   A side photograph (omegaforums, "Incoming Hamilton Model 21") shows its dog
   point entering the fourth wheel at about 0.7 of its radius (about 7 mm from
   the arbor), and the restoration video's bridge (36:01) has it 6.9 mm out,
   between the fourth's setting and the lug at that end. The model has it
   5.0 mm out, toward that lug, where its access hole clears the balance
   locking arm's screw and pin ("The balance lower bridge", 7 and 8); no
   longer at either countersunk hole of the top-view photograph. Still open:
   the 7 mm.
8. **A second capped post and a Y-shaped arm** (fidelity, noted). The top-view
   photograph's movement (2E11795) and others (omegaforums, Delaney No. 8854)
   have a second post with a cap near the fusee's, carrying a long Y-shaped
   arm over the balance whose tips reach the rim: probably the Navy's "balance
   stop" (Sec. I: "Certain instruments have been modified by the Navy to include
   a balance stop"). 2E12055 and the manual's figures have none; the model has
   the manual's locking arm (Fig. 9) instead, and leaves the stop out.

## Open questions, to settle from video (1 October 2026)

What the manual and the photographs so far leave open, gathered in one place so
videos of a Model 21 (taken apart, or turning) can settle them. Each says what
the model does now, why, and what a video would have to show. Plan positions
are in the movement frame (mm; 12 o'clock −z, 3 o'clock +x). When one is
settled, change the model, record the fix in `RESOLVED.md` and strike it here.

### The balance lower bridge (42065)

Rebuilt on 1 October 2026 after the restoration video (`References/VIDEOS.md`,
`KLUwI2UUCMQ`): at 36:01 the bridge on the upturned train bridge, put in
millimetres through a camera fitted to the train bridge's rim and its round
settings, and turned onto the model by the centre, third and fourth settings
(`tools/lower_bridge.py`, `verification/lower-bridge-comparison.png`). The
lower tier is one slab shaped as an L round the escape arbor, with a lug and
screw at each end of the bridge's long axis. The earlier model (a frame of
lobes round the escape wheel, both screws at the fourth end, after three holes
on the top-view photograph) had the right parts in the wrong arrangement.

1. **Its outline.** Settled against the model, in form; estimated in size. On
   the video the slab is an L: a body with the fourth's setting (a large gilt
   setting in a sink) and the cap (in a round counterbore, near the L's
   corner), the train-blocking screw's dog point near the body's far side, and
   an arm from the cap's end to a lug. The escape arbor passes up through the
   L's inside corner, under the train bridge's escape lobe; Fig. 110 draws the
   bridge as a C round that opening. The model now draws that L, but round its
   own arbors, which 14 puts farther apart than the video's: the body is
   stretched from the balance to the fourth arbor and narrowed between the
   escape and third arbors, so it is longer and slimmer than the video's, and
   the arm shorter. Its outline waits on 14.
2. **Whether the upper tier is one piece.** Settled: two. Side-on (42:56)
   the escape wheel shows between the slab and the train bridge, with stepped
   lugs rising to the train bridge at both ends and nothing against the train
   bridge between them.
3. **The arm's route.** Settled: there is no separate thin arm. The "arm" of
   Fig. 30 is the L's arm, running from the cap to the lug at that end, past
   the escape arbor's passage on its outer side. The model draws it so.
4. **The heights.** Settled to about 1 mm. By the pillars (16.8 mm) on three
   side views the slab stands at 8.8–11.9 mm above the plate (its underside
   8.4–9.4), the model's at 7.9–10.9; the escape wheel at 15.6, the model's at
   15.1. Kept.
5. **The screws.** Settled. The real bridge's two screws are at the ends of
   its long axis, 33.9 mm apart on 36:01 (31–36 on the other frames). The
   model has the 3 o'clock one where the video has it, (20.58, 11.88), with the
   pillar plate's access hole (RMG No. 4E019) under it, and the other at the
   fourth end, (−9.6, 21.6), moved off the pillar, the detent support block
   and a barrel-bridge screw that stand where the video's lug is (31.7 mm
   apart). The tapped hole the top-view photograph shows at (11.24, 29.51)
   isn't this bridge's; what screws into it is still open.
6. **The steady pins.** Open. None show on the bridge's faces; pins between
   the bridge and the train bridge would be hidden in the joint. The model
   puts one in each lug.
14. **The settings' spacing** (new). The face-on underside gives the
   bridge's own proportions, without naming any train-bridge hole. Cap to
   escape passage, cap to fourth's setting and escape passage to fourth's
   setting are 8.6 : 10.8 : 11.6, with the angle at the cap about 73°. The
   model's balance, escape and fourth arbors are 9.4 : 18.9 : 10.6, nearly in
   a line. Two independent rulers give the same millimetres. The train
   bridge's rim and barrel cut give 35–39 px/mm, and the escapement's 9.4 mm
   from balance to escape gives 37.8. The balance-to-fourth distance is
   10.8–11.8 mm against the model's 18.9. Two other readings agree with a
   train laid out differently from the model's:
   - the third bushing lands 16.8 mm from the centre on this frame and
     16–19.7 on the bare plate (finding 12; model 13.05);
   - the counted wheels' size ratios (centre ÷ fourth 1.48–1.5, VIDEOS.md)
     with the third at 16.8 make the escape-to-fourth distance about 11.2 mm,
     as the bridge shows (model 10.6).

   The model's balance (triangulated from two photographs) and fourth arbor
   (under the seconds hand) are its best-founded positions, so a balance only
   11 mm from the fourth is hard to reconcile with them. Something in that
   chain is wrong, and it is bigger than this bridge: settling it would move
   arbors (`L`), the modules and the escapement's direction. A video should
   show: a face-on underside with a part of known size beside it, or the
   seconds hand and balance in one top view.

   A third reading (1 October 2026, `tools/rimfit.py rimfit_36-01.json`):
   36:01, the bridge on the upturned train bridge, through a perspective
   camera fitted to the rim with the gilt settings made circular, the slab's
   points put back at their height (8.9 mm). The centre arbor's setting
   lands 1.0 mm from the rim's centre; turned by the centre, third and
   fourth settings (1.0, 1.8, 1.5 mm off), the cap is at (3.8, 11.5), 12.0 mm
   from the fourth's setting, and the escape opening's centre at (11.5,
   16.3), steady over focal lengths of 5000-8000 px. It agrees with 18's
   train-side fits (balance lobe about (5.4, 10.4)), and shares their
   assumption, the rim a 40.5 mm circle about the centre arbor; 18 sets them
   against the top-view comparison and the dial side, which agree with the
   model. The bridge is drawn round the model's arbors meanwhile.

   A fourth reading, from the other side (1 October 2026,
   `tools/anchors/KLUwI2UUCMQ_6-29.json`, `video.py fit` then `unproj`):
   6:29, the same movement from above with the cock on, its camera fitted
   to the barrel bridge's screws that `topview.py` maps the top-view
   photograph by (the setup cover's two, the train-bridge screw sunk through
   the bridge and the one beside it, the barrel pillar screw's empty hole),
   the cock's screw hole and the bridge's near rim. Rms 38 px (about 1.5 mm).
   The balance's endstone, put back at the cap's height, lands at (7.0,
   6.8), 1.0 mm from the model's balance; leaving out any one point or the
   rim keeps it within (5.9-9.2, 6.1-7.5). The fusee's winding post lands
   about 2.6 mm from the model's arbor. So this movement's balance sits
   where the photographed movement's does, relative to the barrel bridge,
   the fusee and the cock. That doesn't contradict 36:01: the model's
   balance, fusee, barrel and barrel-bridge screws all come from the same
   two photographs, and this fit can't see an error in where that group
   stands relative to the train (the centre, third and fourth arbors), which
   is what 36:01 and 18's fits measure the balance against. What would
   settle it: one frame with a train arbor and the balance (or the barrel
   bridge's screws) in it, such as 12:40-12:46 (the barrel bridge on, the
   balance's lower jewel and the escape teeth through the keyhole, the
   fusee and barrel arbors standing), fitted on the barrel bridge's screws
   and read at the slab's height. A turn of the photographed group about
   the centre would also move the fusee relative to the up-and-down
   indicator under the 12, so the indicator's gearing is a further check.
15. **The keyhole** (new). From below (13:49.5) the escape lobe is the oval
   passage above, through both bridges. The balance lobe is closed underneath
   by the lower bridge, with the cap at its bottom. The lobes' plan sizes wait
   on 14. A top-view reading (13:44) of two 5 mm lobes is withdrawn: its
   four-point fit had the handedness of a dial-side view, which a train-side
   frame can't have (VIDEOS.md, "Which part is which").

### The train-blocking screw (42247)

7. **Where it stands.** Settled in arrangement: on the restoration video
   (36:01) its dog point is on the bridge's body between the fourth's setting
   and the lug at that end, 6.9 mm from the setting, not at either countersunk
   hole beside the fourth arbor on the top-view photograph. The model puts it
   5.0 mm out at 230° round the fourth arbor, 2 mm from the video's place,
   where its access hole clears the balance locking arm's screw and stop pin
   (finding 7 under BOM comparison is overtaken).
8. **How far out it stands.** The video's 6.9 mm agrees with a forum side
   photograph (omegaforums, "Incoming Hamilton Model 21"), about 0.7 of the
   fourth wheel's radius, about 7 mm. The model keeps 5.0: at 6.9 mm its head
   bore would break through the lug's edge, which the detent support block
   holds 1 mm away. Open with 14.
9. **A dark hole near the escape wheel.** About 2.5 mm across, at about
   (2.7, 18.1) on the top-view photograph, partly under the balance locking
   arm: 4.9 mm from the escape arbor, over the escape wheel's teeth, so not
   the train-blocking screw's (its wall would stand in the wheel). The model
   has no hole there. A video should show: what lies under it, or what goes
   through it.

### Elsewhere

10. **The escape wheel's place.** Through the train bridge's keyhole, under the
    balance rim, the top-view photograph shows a steel plate with a jewel and
    a screw hole a few millimetres from where the model has the escape wheel's
    upper jewel (its comparison, `verification/topview-comparison.png`, puts
    the model's jewel in the keyhole's dark part). It may be the escape upper
    bridge seen at an angle, or the model's escape arbor may be off. The
    escape wheel is 9.40 mm from the balance by the escapement's figures
    (README, step 5); only its direction is fitted. A video should show: the
    escape upper bridge and its jewel from straight above, with the balance
    off.
11. **The upper train bridge's third screw** (finding 1 under BOM
    comparison; IDEAS.md 1.2): at (−8.5, 27.7), with no pillar under it in the
    model. A video should show: the train bridge coming off, and what the
    screw holds.
12. **The third arbor's place and the wheels' sizes** (finding 6 under BOM
    comparison). **Settled for the arbor, the wheels and the pillars** (the
    model now has the third arbor at (−6.18, 14.75) and the measured pillar
    profile; RESOLVED.md). Still open: the detent's support block, which the
    model notches round the arbor and shortens to clear the pillar, in the
    escapement plan's place. Measured on the video (`KLUwI2UUCMQ`, 1 October 2026):
    - On the train bridge's underside (13:49.5), anchored by a homography on
      five real holes that match model holes to 0.2–0.6 mm (the centre
      bushing, two pillar screws, the tapped hole at (11.24, 29.51) and the
      sustaining pawl's pivot), the third arbor's upper bushing is at
      (−6.18, 14.75): **16.0 mm from the centre**, in the model's direction
      (22.7° from the 6 o'clock line against 21.9°) but 3 mm farther out.
      On the bare plate (14:45, rectified by the rim and the centre bushing)
      15.7 mm; the rough affine fit gave 16–19.7, the dial-side photograph
      about 7 mm off.
    - The model's wheels don't match the counted wheels' size ratios
      (VIDEOS.md: centre ÷ third 1.36–1.39, centre ÷ fourth 1.48–1.50). The
      model's are 1.01 and 1.23, because `MOD` follows the arbor spacing and
      the third arbor is too near the centre.
    - With the third arbor at 16.0 mm and the fourth at the seconds
      (0, 23.9), those ratios put it at 24.8° from the 6 o'clock line
      (measured 22.7°): (−6.71, 14.52). The modules become 0.314 / 0.256 /
      0.249 and the tip radii 14.4 (centre) / 10.5 (third) / 9.6 (fourth),
      against 11.8 / 11.6 / 9.6. The fourth wheel and the escape spacing are
      unchanged (0.1 mm).

    Tried in the model: only `L.T` changes, and `MOD` gives the video's
    ratios. `solids.py` passes. `fine.py` finds two new overlaps, both with
    estimated parts: the third arbor 3.2 mm into the detent's support block
    under the train bridge (its screw matches a real hole, its outline is
    drawn), and the third wheel's teeth 0.65 mm into the foot (r 3.4,
    estimated) of the train pillar at (−16.63, 22.48). Not committed.

    Then measured:
    - **The pillar** (42:56, side-on, scaled by its 16.8 mm height; ±0.15
      mm): a straight shaft r 2.7 with a collar at each end, the foot r 2.9
      over its bottom 3.3 mm and the top r 3.3 over its top 3.4 mm. The model
      has the foot r 3.4 over 1.3 mm, a neck r 2.3 under the top, and the top
      r 2.9. With the real foot, the third wheel clears the pillar with the
      third arbor at the measured (−6.18, 14.75) (0.05 mm) but not at the
      ratio-implied (−6.71, 14.52) (−0.68 mm). The pillar's place is right:
      the anchored frame puts it on a real pillar-screw hole.
    - **The detent's support block.** **Set aside (1 October 2026): the
      reading below rests on the five-hole fit of 13:49.5, which three
      searches showed can't be trusted (18), so nothing reliable puts the
      block anywhere but Fig. 90's place; it stays there. Low priority: the
      block is hidden under the train bridge and changes nothing in the
      running.** On the anchored underside (13:49.5,
      the detent off) the model's block lies across the real lower bridge's
      second lug and its screw, and there is no hole at the model's block
      screw (−13.67, 18.21). So the real block is elsewhere. The block's
      place comes from the escapement plan (Fig. 90 as Rawlings redrew it,
      `shared/escapement.js`: the detent at 68° in the escapement's frame,
      the block 1.5–0.9 escape radii along it), turned to the balance–escape
      line, which puts it toward 9 o'clock. The only unexplained hole near
      the keyhole on the underside is on the other side of that line, at
      (9.24, 20.86), 5 mm from the escape arbor, with a curved slot beside
      it. (That fit was on five holes only, and the model's holes are about
      10 % too near the centre. Refitted on the rim and the barrel cut, the
      hole is at (11.79, 22.41), and it is an escape upper bridge screw's,
      17 and 18.) From above (10:45–10:48) the block's screw is taken out at the
      train bridge's edge below the keyhole. ~~If that is the block's screw,
      the plan is mirrored about the balance–escape line.~~ It isn't (16):
      the plan can't be mirrored, and the hole is not where any part of the
      block could be, in either handedness. Where the block's screw is could
      still be read on the top view (10:47), with a fit that can be trusted.
16. **The escapement plan's orientation** (started 1 October 2026, branch
    `claude/escapement-plan`). **Settled: not mirrored.** The model's plan is
    right as it is, and nothing in `shared/escapement.js`, the detent or the
    essay changes. Three things fix its handedness, none of them from a video:
    - **The train.** The fourth wheel carries the seconds hand (clockwise on
      the dial) and drives the escape pinion directly, so the escape wheel
      turns anticlockwise seen from the dial, clockwise seen from the train
      side. The model does (`update()`: centre −, third +, fourth −, escape +
      in `rotation.y`, about +y toward the dial).
    - **Fig. 90.** Its teeth lead clockwise all round, and the locking jewel
      holds a tooth two pitches downstream of the pair at the roller, so the
      locked tooth pushes the detent toward its foot and support block. A
      plan mirrored about the balance–escape line keeps the train's direction
      only with the wheel running backwards against its teeth. The solver has
      Fig. 90's arrangement: the wheel turns to −angle, the locking tooth at
      t0 − 2P, and the tooth's motion there is along −dirB, toward Ft (cosine
      −0.98). Its unit frame maps (x, y) to the movement's (x, z), which seen
      from the train side is a half turn, not a mirror.
    - **Ops. 85–86.** The balance is read against a sector on the upper
      train bridge, so seen from above, and turning it anticlockwise lifts the
      detent off its stop button. In the model the unlocking swing is
      anticlockwise seen from the train side, as in Fig. 90.

    The evidence for a mirror was the hole at (9.24, 20.86) (item 12). It is
    in the train bridge itself, just past the slab's corner (checked on the
    full 4K frame 13:49.5), so the homography on the bridge's holes places it
    well: 5.2 mm from the model's escape arbor and 14.1 mm from the balance.
    A mirror about the balance–escape line keeps every point's distance from
    both arbors. Those two distances put the hole almost on that line,
    beyond the escape arbor (31° off it), over the wheel's spokes. In Fig. 90
    nothing of the detent is there in either handedness: the block runs off
    to the side, below the wheel's centre. So the hole is not the block's
    screw, mirrored or not. More likely it is a screw of the escape upper
    bridge (17).

    Tried before this was settled:
    - the detent held up to the camera (11:04–11:30): too overexposed and
      oblique to read which side of the blade the locking jewel and horn lie;
    - the dial side face-on (40:08): a search matching the model's dial-side
      features (centre, fusee pinion, studs, pillar screws, the bar's settings
      and screws, the escape jewel) to the frame's finds no consistent fit
      (6 of 14 at best, pairings that make no sense). The ring's inner edge
      fits a circle centred near the bar's middle, not on the tall arbor the
      motion work goes on. The features need naming first, by following the
      motion work going on (40:14–40:44) and the bar going on (34:52–35:12).

    What stays open is where the plan sits, not which way round it is: the
    direction of the escape arbor from the balance (only fitted; 10) and the
    balance-to-fourth distance (14). The plan turns with them, and the block
    is about 20 mm from the balance, so a few degrees move it millimetres.
    The detent's block (12) is placed once those are settled.
17. **The escape upper bridge (42064)** (new, 1 October 2026). **Rebuilt
    (1 October 2026, branch `claude/escape-arbor`; RESOLVED.md)**: a bar
    across the keyhole, symmetric about the jewel, a screw near each end, a
    round cap. Still open: its thickness and the boss under the cap, its
    steady pins, the end screws' countersunk heads, the cap's edge on the
    keyhole side (cut straight, parallel to the bar, and stepped down on
    the frame; the model's cap is a plain disc), and the two other
    endstone caps of the same part (42159), which look round too. From above
    with the bridge on (`KLUwI2UUCMQ` 10:00), it is a long straight plate,
    rounded at both ends, with the jewel and its two-screw endstone cap in
    the middle and a screw near each end, symmetric about the jewel. It spans
    the keyhole's escape lobe. The model's bridge is a stadium from 1.5 mm
    behind the escape arbor to 7.5 mm beyond it, with both screws beyond it
    (4.3 and 6.6 mm along the balance–escape line). Certain for the form, by
    eye. The end screws are about 2.5 times as far from the jewel as the
    cap's screws (about 5 mm if those are the model's 2.1 mm, which is
    estimated). That would fit the hole at (9.24, 20.86), 5.2 mm from the
    escape arbor, as one of them. Its partner would then be about as far on
    the other side of the arbor, which is inside the model's keyhole if the
    model's escape arbor is right: one more sign that the arbor's direction
    (10) is off. Not changed: the bridge's direction and length wait on 10
    and 14. A video should show: the bridge's screw holes on the bare train
    bridge from above (13:44, once anchored on matched holes).

    Measured (18): the end screws are 8.3 and 8.6 mm from the jewel, not 5,
    on a line about 3° off the 6 o'clock line, and the cap's screws 3.3 mm.
    The hole at item 12's (9.24, 20.86), re-placed at (11.79, 22.41) by a
    better fit, is 1.1 mm from the end screw at (12.49, 21.54) found from
    above on another frame, so it is that screw's hole.
18. **The escape arbor's place.** **Settled: the model's stands; the
    40–45° reading below is withdrawn.** The escape arbor isn't free: it
    must be 9.40 mm from the balance (the escapement) and about 10.6 mm
    from the fourth (their mesh), and the fourth is under the seconds hand
    (manual, p. 15). Given the balance and the fourth, that leaves one place
    for it, which is where the model has it. The balance is the model's
    best-founded position: triangulated in two independent photographs, the
    axes within 0.16–1.43 mm over eight seeds (README, "How the layout was
    measured", 1, 6). It is also checked independently by
    `verification/topview-comparison.png`, which warps the model onto the
    top-view photograph through five barrel-bridge screws, not the balance.
    There the photograph's endstone lands 2.7 mm from the model's, the
    photograph's tilt for a part on top of the cock, and the hairspring
    below it lies the other way, so the staff passes through the model's.
    A balance 11–12 mm from the fourth (14) would put it about 7 mm off,
    plain on that comparison. So the train-side fits below share an error,
    most likely their assumptions (the train bridge's rim a 40.5 mm circle
    about the centre arbor, the rotation from the third bushing). And 14's
    reading of the lower bridge's underside misnames or misscales a setting.
    The dial side (40:08, below) agrees with the model unrectified. What
    stands from the fits: the escape upper bridge's form and its end screws'
    spacing about the jewel (17), and the hole being one of them.

    The measurement, as made (1 October 2026, branch `claude/escape-arbor`). Three frames of `KLUwI2UUCMQ` were fitted with
    `video.py anchor` on the train bridge's rim (r 40.5 about the centre),
    its cut round the barrel and the centre bushing. The other holes are
    independent checks (fit specs in `tools/anchors/`).
    - **10:00, from above, the escape upper bridge on.** Rim 0.28 mm rms,
      centre and third bushings 0.17 and 0.16 mm. The escape jewel is at
      **(12.90, 12.90)**, the bridge's end screws at (13.25, 4.64) and
      (12.49, 21.54), the cap's screws at (12.95, 9.63) and (12.65, 16.19).
    - **13:44, from above, bare.** Rim 0.44 mm, the barrel cut 0.50. The
      10:00 points mapped onto it land on the two raised lugs flanking the
      keyhole's left pocket (the end screws) and at that pocket's centre
      (the jewel). The left pocket is the escape lobe, centred about
      (12.6, 15.4) with r about 7.0, room for the 13.16 mm wheel to come out.
      The right pocket, the balance's jewel at its bottom, is the balance
      lobe, centred about (5.4, 10.4) with r 4.9. Fitted without the third
      bushing (the barrel cut giving the rotation), the jewel stays at
      (12.92, 13.32) and the third bushing lands 2.85 mm from the model's,
      6° round and 18.25 mm out.
    - **13:49.5, from below.** Rim 0.22, the cut 0.24, the third bushing
      1.09 mm from the model's as a check.

    (Withdrawn, above.) So the escape arbor is about 18 mm from the centre, as the model has it
    (17.7), but 40–45° round from the 6 o'clock line toward 3, not the
    model's 24°: about 6 mm from the model's (7.19, 16.14). The scale rests
    on the rim's 40.5 mm (the third bushing reads 16.9–18.3 mm on these
    fits against 15.7–16.0 by other methods, so up to 10 % large). The angle
    doesn't depend on the scale, and every fit gives it.

    **It contradicts the train.** The escape pinion meshes the fourth wheel,
    about 10.9 mm apart. With the fourth arbor under the seconds hand at
    (0, 23.9), the escape arbor can be at most 27° from the 6 o'clock line.
    At 44° it would be 16.6–17 mm from the fourth. The jewel to the balance
    lobe's centre is 7.9 mm, against the escapement's 9.4. If the escape
    jewel and the third bushing are right, the meshes put the fourth arbor
    near (4.1, 19.3), 6 mm from where the seconds hand puts it. Either the
    model's fourth arbor (and with it the seconds hand's place on the dial)
    is off, or these fits share an error that the frames can't show: they
    all assume the rim is a circle about the centre arbor, and the cut's
    centre where the model has it. **Not changed in the model.** Next: a
    frame with a ruler from the manual (the plate's 87.57 mm rim) and the
    fourth arbor in view, from above with the train in (13:51–13:54), or
    the bare plate (14:36–14:45), where the fourth's jewel and the escape
    arbor's lower jewel are both in the plate's own face.

    **What the manual fixes** (no positions, but the identities). The fourth
    wheel's "long arbor … projects through the dial to receive the second
    hand" (p. 15), so the fourth arbor is under the seconds hand, at 6 (p.
    14; the seconds dial's centre about half the dial's radius out, so 23.9
    mm stands). The balance lower bridge carries the balance's lower cap
    jewel and the fourth's upper setting, and the lower train bridge the
    third's and fourth's lower settings (p. 14; bar-hole jewels, p. 17).
    Figs. 29 and 67 put the escape lower setting and endstone cap in the
    plate, beside the bar's fourth end.

    **The dial side, 40:08** (`KLUwI2UUCMQ`). Named by those figures and by
    the fusee's 12-leaf indicator pinion: centre bushing (2129, 1329), the
    third's setting at the bar's left end (2314, 1800), the fourth's (red
    jewel) at its right (2793, 1786), and the escape's capped lower jewel in
    a round recess above the bar's right end (about 2843, 1486). Unrectified
    (the plate tilted about 40°), the escape jewel is 26° round from the
    centre-to-fourth line, and 0.44 of that distance from the fourth. That
    is the model's 24° and 0.44, and it agrees with the train's mesh, not
    with the 40–45° of the train-side fits above. Foreshortening can bend
    angles by this much, so it settles nothing yet. Rectifying it on the
    plate's rim failed: the picks mix the plate's edge with the mounting
    ring's inner step (a free fit ran to a 1000 px focal length). Next: trace
    the plate's edge alone, on 40:05–40:20, and fit two frames together.
19. **The dial's 12-6 axis against the photographed group** (new, 1 October
    2026, branch `claude/balance-train`). **Measured: the fusee (and the
    barrel) stand about 13° further round from the 12 than the model has
    them.** Two independent readings:
    - **The dial side, rectified** (`tools/rimfit.py rimfit_40-08.json`;
      40:08, the motion work off). A perspective camera fitted to the
      mounting ring's bore (r 40.2) about the centre arbor's bushing: rim rms
      0.15-0.21 mm over focal lengths of 4000-8000 px, the centre arbor
      within 0.1 mm. About the centre, from the indicator's stud (at 12): the
      fourth's jewel (the seconds) 176° (model 180), the minute wheel's stud
      86-91° (model 90), **the fusee's bushing 43-45° (model 30.3)**, the
      bushing taken for the barrel's -77 to -81° (model -89.4). The fusee
      at r 21.8-22.7 (model 22.9). This rectifies what 18's last paragraph
      read unrectified.
    - **The indicator wheel's size** (23:30, laid flat; the 120-tooth wheel
      counted there): its tips about 35-38 mm across against the train
      bridge's rim beside it (r 40.5), perhaps 5-10 % less for its being
      nearer the camera; the model's is 22.4 mm (module 0.186, from the
      fusee's 12.3 mm from the indicator). With the fusee's 12-leaf pinion,
      a wheel that size needs the fusee 18-20 mm from the indicator's
      centre, 45-52° round from the 12: the dial side's 43-45°.

    So the model's photographed group (balance, fusee, barrel, the bridges,
    the cock) is turned about 13° from the dial and the train, or the dial
    and the train about -13° from it. The group's own internal layout stands
    (6:29 and 14). Turning it brings the balance 16.7 mm from the fourth
    (model 18.9), toward 36:01's 12.0; that reading's remaining 18° is open.
    The fix (not made): the dial, the fourth, third, escape and indicator
    arbors, the minute wheel and the lower train bridge turned about the
    centre against the group, the indicator's gearing sized to its wheel,
    the escapement's direction and the lower bridge's outline redone, and
    every check and the essay's figures rerun.
20. **The detent against the manual and the video** (new, 1 October 2026;
    branch `claude/detent-fixings`). The escapement works as the manual has
    it: lock 6.0°, let-off 10.6°, overall 28.4°, drop 2.1°, roller shake
    0.055 mm and horn clearance 0.25 mm (`tools/escapement.js`). The tooth
    leaves the impulse jewel at 96 % of a pitch and drops onto the locking
    jewel, and the detent is back on its stop by 0.31 of a pitch. The
    detent's parts are Fig. 14's and the video's (`KLUwI2UUCMQ` 11:08–11:13,
    the detent held up, sharp): the long block stepped down toward the
    jewel, the foot with its clamp screw, washer and cross pins, the
    two-strip spring, cross-piece and angle bracket, the jewel standing in
    its block, the arm whose end bends down as the horn. The fixings were
    not:
    1. **The block's screw goes in from above.** Sec. II: the block "is
       fastened to the underside of the upper train bridge by means of one
       screw and two positioning pins". Fig. 14 draws a tapped hole in the
       block's top face, between the pins, and Figs. 22 and 84 the screw
       above the train bridge. On the video the screw comes out from above
       beside the keyhole (10:45), and the block's top shows the tapped hole
       (11:08). Op. 81's "Turn movement over. Install detent support block
       screw" follows Op. 80, done with the movement upside down (Fig. 89),
       so it brings the train side up. The model puts the screw in from
       below (`e1244db`), because in its place for the block the barrel
       bridge's horn covers it. **Open**: it turns round with the block's
       place (12). Sure: high.
    2. **The two positioning pins were missing.** Sec. II, Figs. 14, 22 and
       90, Op. 26 ("pushing nickel wire against steady pins"), the video
       (11:08). **Fixed on the branch**: two pins in the block's top, into
       the train bridge, and the screw between them, laid out from Fig. 90
       (scaled by the 11.3 mm from the point of flexure to the locking
       jewel): the screw 3.7 mm toward the foot from the point of flexure
       (it was 7.9), a pin 2.0 mm the other way. Fig. 90's other pin, 9.5 mm
       toward the foot, would stand past the train bridge's cut round the
       barrel in the model's place for the block; it is drawn 2.9 mm nearer
       the screw. One more sign that the block is not where the model puts
       it (12, 16, 18), as is the third arbor 1.2 mm from the point of
       flexure, through a notch in the block. Sure: high on the pins; their
       spacing to about 0.3 mm on Fig. 90.
    3. **The trip spring's screw was upright**, a fine thread in the
       bracket's 0.23 mm leg with the spring held under its head. Op. 8 of
       the detent's reassembly: "place trip spring screw in the hole of the
       trip spring"; Fig. 14 and Fig. 54 (driven like the clamp screw) put
       it across the spring into the bracket's upright leg, and the video
       shows its head face-on (11:08). **Fixed on the branch**, the
       bracket's upright leg thickened to 0.36 mm to take the thread (its
       size estimated; on the video the bracket looks taller than the
       model's 0.4 mm). Sure: high.
    4. **The detent-adjusting screw didn't touch the detent**: its head
       stood 0.64 mm beside the foot. Op. 93 has it "screwed in against the
       detent" and Op. 84 turns it to slide the detent along. Fig. 90 draws
       it threaded into the block's end, its head standing in a slot across
       the foot, which runs on past it. **Fixed on the branch**: the foot
       runs 1.06 mm further (away from the barrel), slotted for the head.
       Sure: high that it bears on the detent; medium on the slot (one
       drawing).
    5. **The lock-adjusting screw stops 0.24 mm short of the stop button**,
       inside the block. Fig. 90 shows the block's front split by a long
       slot that this screw and its clamp screw cross, so the screw moves
       the button by spreading the slot ("working through the locking jewel
       button", Sec. IV). **Open.** Sure: medium (the slot is read from one
       drawing).
    6. **The wedge pin stood 0.04 mm proud** of the block at both ends. The
       manual pushes it flush on top and stones it flush below (re-jewelling
       the detent, 8–9). **Fixed on the branch.**

    Not modelled, and not needed by a kinematic model: the detent spring's
    0.770 g test (Op. 78) and the trip spring resting lightly on the arm
    (Op. 79).
13. **The balance stop** (finding 8 under BOM comparison): the Navy's
    modification on some movements; the model has the manual's locking arm. A
    video of a modified movement would show its shape and how it works.
21. **The upper train bridge's notch, horn and mouth** (new, 1 October 2026,
    branch `claude/train-bridge-outline`). **Rebuilt from the video**
    (`tools/train_bridge.py`; 23:30 flat and 13:49.5 turned over, each put on
    the face through the rim, the barrel's cut and the centre bushing, 0.2-0.3
    mm rms). The notch is one circle, r 16.57 about (11.46, -17.47), 0.12 mm
    rms; the horn its cusp with the barrel's cut, cut off straight 12.4 mm
    from the centre; the mouth a sharp corner at (28.0, -18.7) and a straight
    edge turning into the rim through a round corner (it was a spike to
    -40°). Still open:
    - **The third screw: moved, its pillar still open** (2 October 2026,
      branch `claude/train-bridge-screw`). At (29.24, -12.28) it kept 0.5 mm
      of metal to the notch and its head overhung the edge by about 1 mm, and
      the bridge laid flat (23:30) has no hole there. The hole is a 5.3 mm
      counterbore at the end of the tongue, (32.25, -10.81); at 36:26 the
      bridge goes on with it, and at 36:34 the screw is driven into it with a
      fluted pillar under it. The manual has the same: four pillars, three
      for the train bridge, and all three of its screws in them (Ops. 5, 14;
      parts list 42059 x3, 42055 "Pillar upper train bridge" x3); the barrel
      bridge has its pillar's screw and two plain screws. The model's
      (29.24, -12.28) came from the top-view photograph's five-screw map,
      which is fitted to the model's own screws. The screw is now at the
      video's hole, its head (r 2.5) sunk flush, threaded into the bridge
      alone. **Still open:** the pillar. On the manual and video's reading the
      model's pillar 2 (32.11, -4.1) belongs under this screw, 6.7 mm away,
      and the barrel-bridge screw now in it goes into the train bridge. But
      the fusee wheel's tips reach 20.4 mm from the fusee arbor, and a pillar
      (r 2.7) at the hole stands 22.5 mm away: 0.6 mm in the wheel. The real
      one clears, so the model's fusee is placed or sized wrong: the notch's
      centre (below) puts the fusee 20.9 mm from the centre, which with the
      train's 90 and 14 makes the wheel's tips about 18.5 mm and leaves the
      pillar 0.6 mm clear. Next, on its own branch.
    - **The notch's centre** is 2.3 mm from the model's fusee arbor, at 33°
      from the 12 and 20.9 mm out (the arbor at 30.3° and 22.9 mm). If the
      notch is concentric with the fusee, that is a reading of the fusee's
      place on the bridge itself, beside finding 19's 43-45° on the dial side.
    - **The keyhole**: the video's opening has three lobes and a round hole,
      and leaves 3 mm or more of metal below the notch. The model's is still the
      two circles about the balance and escape arbors, now kept 1 mm off the
      notch.

## The fusee assembly against Fig. 28 and the video

1 October 2026. The seventeen parts of Fig. 28 (the manual's exploded fusee)
against `movement.js`, Figs. 12 and 69–73, Sec. II and IV, Ops. 16–45, and the
restoration video `KLUwI2UUCMQ` at 13:30, 17:23 and 27:20–29:20 (readings in
`References/VIDEOS.md`, Measurements).

Every part is modelled and moves: the top plate, its screws, the winding
ratchet, its screws, the taper pin and the end plate turn with the fusee; the
stop-bar slides as the chain winds over its nose, and its spring follows it;
the chain is laid along its path at every wind; the winding pawls ride the
winding ratchet's teeth, their springs following them; the sustaining ratchet
turns with the fusee wheel in running and stands while winding; the sustaining
spring is drawn loaded in running and relaxing while winding. The model is
kinematic: positions follow the time and the wind; no force is computed.

Fixed: a wind lasts seconds on screen whatever the speed, so at high speed the
sustaining spring drove the train for hours of model time (RESOLVED.md,
Winding and maintaining work).

### Open, most certain first

1. **Sustaining spring** (27:26; Figs. 69, 71). *Fixed (RESOLVED.md, Winding and maintaining work).* A flat blued band about
   2.1 mm wide, r 15.8–18.0, against the recess wall, round about 335° (its
   fixed end widened inward, with two holes; a lighter working end with an
   upright pin). The model: 0.7 mm wide, r 13.2–13.9, 250°, its free end
   pushed by a pin on the ratchet (the manual pins both ends).
2. **Fusee wheel** (27:26; Figs. 71, 72; Ops. 20, 26). *Fixed: the recess and its elevations with the spring, the bore with the collar (5).* Its recess reaches
   r ≈ 18.0 (model 15.2), its bore is r ≈ 2.6–2.9 (model 1.05), and the
   recess floor has a raised disc to r ≈ 9.3 and a hub round the bore. The
   model's web is flat.
3. **Fusee's top** (13:30, 17:23; Fig. 28). *Fixed: the screws at r 7.0 and the collar on the plate. Open: Fig. 28 draws the hub rising through a large hole in the plate, with the stop-bar's slot beside it (the bar would then run about 3.6 mm off the axis, not 2.0); and the arbor above the collar looks thicker on the video (r 1.4–2.3) than the model's r 1. Neither is measured.* A steel collar r ≈ 2.9 round the
   arbor over the top plate, and the plate's two screws at r ≈ 7.0. The model
   has no collar, a plate hole of r 1.02 and its screws at r 3.2.
4. **Sustaining ratchet** (28:32–29:14; Fig. 28). *Fixed. Open: the video shows six slotted heads and about five holes on its underside; four are the springs' screws, the other two perhaps the pawls' pivots, not drawn.* Gilt brass, not steel; the
   winding-pawl spring screws go in from the fusee wheel's side (slotted heads
   there). The model has the heads on the pawl side.
5. **Arbor collar and the fusee's large end** (28:08, 28:17; Fig. 69 arrow 5;
   Op. 23). *The collar fixed; the large end's rim and the ratchet's size open.* A steel collar r ≈ 2.7 on the arbor below the fusee carries the
   sustaining ratchet and the fusee wheel (the model hangs both on the 2 mm
   arbor); the large end has a raised outer rim round the winding ratchet,
   whose tips read r ≈ 8.5 (model 9.85; rough, oblique).
6. **Fusee end plate** (Ops. 27–29; Figs. 28, 69). *Fixed: r 7.0 with the slot and a 9.6 mm pin. Open: Fig. 69 draws a raised boss round its hole; not seen on video.* Notches in its face that
   the taper pin lies in; the model's is a plain washer with the pin under it.
   Figs. 28 and 69 both draw it about 0.37 of the fusee wheel across (r ≈ 7.5;
   model 2.6), not yet seen on video.
7. **Winding pawl springs** (Figs. 28, 69). Drawn as long arcs round a raised
   ring about the ratchet's centre; the model's are short bent strips. Not yet
   seen on video (hidden in the stack).

Not seen on video yet: the end plate, the winding pawls and their springs, the
stop-bar and its spring.
