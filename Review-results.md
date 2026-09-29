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
not fixed yet. Findings 6–9 and the smaller issues are open.

A later pass with a finer collision check found and fixed six more overlaps,
and added a check for the barrel wall; see
[Fine interference pass](#fine-interference-pass).

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
  ok  lock (Op. 85)                                       6.1°   about 6°
  ok  let-off (Op. 86)                                   11.9°   at least 6°
  ok  overall (Op. 87)                                   27.8°   26-30°
  ok  drop (Op. 97)                                       2.1°   about 2°
  ok  horn clearance to the unlocking jewel (Op. 88)   0.25 mm   about 0.010 in (0.25 mm)
  ok  angle between the jewels                           86.2°   about 90° (Fig. 90)

  balance angle: jewel meets trip spring -27.4°, wheel released -21.3°, detent falls back -9.4°;
  impulse ends 20.8°; on the return swing the trip spring falls off at -37.2°. Lift at release 0.20 mm.
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

### 8. The dial looks small in its case (worth checking, not confirmed wrong)

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
- **Short hands.**
  - Hamilton dial: the minute hand stops 2 mm short of the minute track (tip at
    44 mm radius, track from 46 mm).
  - Roman dial: the minute hand's tip is at 45 mm and the track starts at 47 mm.
  - The wind-indicator hand is 0.5 mm short of its marks.
- **Floating minute hand.** The minute hand and its hub float 0.8 mm above the
  top of the cannon pinion: the pipe ends at y 4.9 and the hub starts at 5.7.
  This is only visible in the 12–6 cross-section.
- **Committed tool outputs.** `tools/r_p3.png` (456 KB) and `tools/p3fit.json`
  are outputs of `p3fit.py`, committed by mistake in `1340cb6`. `.gitignore`
  doesn't cover the tools' outputs, so running them from `tools/` dirties the
  working tree.

## Not covered

- The essay, beyond its copy of the escapement solver.
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
| Chain's straight run into the barrel (found by the barrel check) | 0.24 mm | Common tangent of the two drums; winding-stop pin 0.2 mm shorter | this pass |

All were thinner than `dyn.py`'s 0.4 mm cubes, and the barrel wall was never tested before.

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
