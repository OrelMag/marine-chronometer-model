# Resolved issues

Bugs and mistakes that have been found and fixed in this repository, gathered
from the commit history. It is kept so they aren't brought back. Before changing
a part, a control or a build step, look for it here. Each entry says what was
wrong, what the fix was, and what to keep true from now on. The commit hash
leads to the full change.

**Keeping it up to date:** when a commit fixes a bug, add an entry under the
right heading in the same commit, with the hash filled in once it exists. When
a fix isn't committed yet, list it under
[Fixed, not yet committed](#fixed-not-yet-committed) and move it into place when
it is committed. Features and ideas don't go here. Ideas belong in `IDEAS.md`,
open review findings in `Review-results.md`.

Contents:
[Escapement](#escapement) ·
[Going train and heights](#going-train-and-heights) ·
[Winding and maintaining work](#winding-and-maintaining-work) ·
[Plates, bridges, screws and arbors](#plates-bridges-screws-and-arbors) ·
[Setup, case and gimbals](#setup-case-and-gimbals) ·
[Accuracy to the manual](#accuracy-to-the-manual) ·
[Rate panel](#rate-panel) ·
[Rendering](#rendering) ·
[Controls and display](#controls-and-display) ·
[Build, tools and docs](#build-tools-and-docs) ·
[Essay](#essay) ·
[Fixed, not yet committed](#fixed-not-yet-committed)

- **The up-and-down indicator's wheel followed the fusee's pinion both ways on
  one flank** (the kinematics audit, 11 October 2026). With the drive flanks in
  contact (`gearLash`), winding turned the pinion back into the wheel. The
  wheel now stands while the pinion crosses its backlash (`UD_LASH`, from
  `gearLash` both ways, 0.107 rad of the fusee) and follows on the other flank;
  after winding it waits for the pinion to come round again. Keep: a mesh whose
  driver reverses crosses its backlash before the driven wheel moves. `bf75917`

- **The run down's taper said "Stopping: twist to start"** once the drive fell
  under what keeps the balance unlocking, a few minutes before `RUN_H`. The HUD
  and the stop panel now say Run down there (`spentNow`). Keep: the stop
  messages follow the drive, not the hours. `bf75917`
- **The export's drive and wind lagged the page's** after the maintaining work's
  state machine: its `sim` took the fusee's drive or a 0.8 spring, not the
  greater of the fusee and the sustaining spring (`R.ssF`), and didn't add the
  catch's and reload's hours when the key let go (`R.release`). Keep: blender.js's
  `sim` mirrors app.js's drive, go and windEnd. `bf75917`

- **The loop's never-back clamp hid the escape wheel's recoil.** Once the
  escapement drew the recoil (progress under 0 while the stone is drawn out),
  `E = max(q.E, lastE)` held the wheel still through it. The clamp now lets
  that dip through, in the page and the export. Keep: the only turn back the
  train makes is the unlocking's recoil, a few hundredths of a tooth. `9a7e7db`
- **The adjuster's bench left the hand landing off its mark.** `PL`, the phase
  at which the next tooth locks, was worked out once at load; a bench setting
  moves the lock. It is recomputed when the escapement is rebuilt, the
  balance's phase kept. Keep: `PL` follows ESC. `e66cced`

---

## Escapement

- **The Wempe's impulse face stood 24° before the line of centres at rest, where 05 04_1 draws it 28°10'.** The sheet's "24°" is the
  escape wheel's pitch (its arc lies about the wheel's centre), and its 1°, 21° and 2° the wheel's too; the face's angle is the "6°" on from
  the "22°10'" where the impulse begins, both about the balance. Built so, the stone comes into the teeth's path at +6.1°, and a discharge
  stone leaving the gold spring at rest (the model's assumption) let the wheel go so early that the tooth got to the path first: makeEsc
  and dynamics.js snapped it onto the stone's corner, and the detent frame (wempe_tripping.js), which had no such strike, threw the balance
  to 247°. The discharge stone is now 5° later on the staff (`DSB`, estimated: from 4° the tooth lands on the face, from 8° it doesn't run),
  and the frame strikes as dynamics.js does where the impulse table begins. Keep: PHI0 −28°10' and PHI_C −22°10' from 05 04_1; the tooth
  landing on the face after the stone has come in (`wempe_escapement.js`'s chase, dynamics.js's landing); TF where the 6MX video's fit at the
  model's own swing gives it back (108 s). `c088b73`
- **The Wempe's page moved its escapement as the layout draws it, not as it is solved.** Its 3D escapement was kinematic, timed from
  05 04_1: the tooth on the impulse stone the moment it was let go (21° before the line of centres), the detent let fall as the gold
  spring slipped off; makeEsc, solving the same parts in time, has the wheel chase the stone from rest and strike it 16° of swing later
  (10° before the line), the detent flung off the discharge stone and riding the tooth it let go. Now `ESC.state` is makeEsc's state at
  the live swing and drive (`WESC.adapt`), the layout's kept as `ESC.layout`; its contacts drawn 0.01 apart as the layout kept them,
  the ride taken where the tooth is drawn (makeEsc's own, with the wheel drawn 0.01 behind, put the stone 6.6 µm into the tooth).
  Keep: the page and the tools move the escapement through the one solved state; `tools/wempe_escapement.js` holds the drawn stone out
  of the drawn tooth, and `checks.py`'s phases follow the solved events. `930a8e4`
- **The Wempe's hairspring stud was drawn the wrong shape** (15 October 2026, the user's screenshot). Its point had a V cut through it 2.1
  deep, where 05 03 02-3 draws two facets ground from the V's arms to a knife edge, meeting along the middle (the section; Wempe 3955's
  photograph shows them lit and dark); its hole was 5.9 from the square end (drawn 5 ±0.1; the photograph 4.9), the bar 3.1 wide to that
  end (drawn 2.5) and 1.4 thick (drawn 1.6 −0.2), and its upright stood square to the bar where the side view draws it leaning 8° (98°)
  toward the axis, along the cock's slot's 82° inner wall (05 08 03-1, Schnitt C-D), which the cock left out. Keep: the stud's every
  figure from 05 03 02-3, its upright leaning with the cock's slot wall, the screw's hole (`HOLES.studScrew`) 5 from the stud's square end. `480bb6f`
- **The Wempe's hairspring's outer curve was drawn to the wrong radius.** It was drawn in proportion (kU 0.883) to end 3.87 from the staff,
  where an upright square to the stud's bar let it stand; the stud's upright leans 8° (05 03 02-3) and so brings its slot in to 3.55, where
  05 03_7's table pins the inner end in the collet: both curves are now the table's (kU 1), the slot in the upright's middle with the spring
  and its pin side by side in it. The spring's isochronism, `WESC.SET.HS`, went from −0.659 to −0.543 s a day per 10° (−0.499 once the balance was re-weighed and TF taken from the 6MX video, the same day), the rate over the wind
  from ±0.08 to −0.02/+0.01 s a day. Keep: `RSTUD` is the table's radius at 220°; `HS` what `tools/wempe_hairspring.js` finds.
- **The Wempe's escape wheel's teeth and openings were read off the wrong lines of 05 04_23.** Its "11,7" was taken for a recess and its
  "12,1" for the roots: the gaps' floor is Ø 11.7, the locking face running straight down to it, leaning 25° from the radius (the sheet's
  "25°"; built 15°), and the back's ∅ 6 arc ends at Ø 12.1 15° behind the tip (the "15°"; built 11.9°), where a 0.2 step falls to the
  floor (built 0.15 up to Ø 12.4). Each opening is bounded by one arc r 7.9 centred 9.43 out, coming within 1.53 of the centre (05 04_1
  the same), not two arcs meeting 1.4 from it. Keep: the tooth and openings as traced and fitted on 05 04_23 (82.8 px/mm, rms 0.25 px);
  makeEsc's tooth is the drawn one down to the back's foot (`SET.r0` Ø 12.1, `U` the 25° face there, `B` 15°; the swing moved 0.1°). `3544d3d`
- **The Wempe's escape wheel stood 0.38 too near the top plate, on a cone.** 05 04_7.2's "2" at the top-plate end runs to the arbor's
  shoulder, 0.4 under the wheel; its "19" from the pinion end places the wheel, its face 2.38 from that end (built 2.0, its teeth half out of
  the impulse roller's thickness). Its collet 05 04 10 is Ø 2.8 for 1.6 and Ø 1.7 to 4.7, chamfered, not a cone Ø 2.6 to 1.5. Keep: the
  teeth inside the impulse roller's 1.6; the detent's pipe 0.1 under them (`WESC.PIPE0`, which tools/wempe_tripping.js reads). `3544d3d`
- **The Wempe's balance arm swelled the wrong way.** 05 03_4's arcs r 20 are hollow, their centres outside the arm (the sheet marks one),
  meeting in a point 6.5 across at the hub ("6,5"); it was built convex to 6.17, "6,5" taken for where the arm is 4 wide. Keep: the hollow
  flanks Wempe 3955's arm shows, tangent to the straight flanks where the arm is 4 wide. `3544d3d`
- **The Wempe's hairspring collet had straight ends and its slit ran into the bore.** 05 03 02-2 draws both ends as arcs about the bore,
  the bore in the middle of the length (built 4.25 and 4.85 from the ends) and the slit stopping 0.1 +0.05 short of it. Keep: the spring's
  inner end pinned 3.5 from the bore. `3544d3d`
- **The Wempe's detent block was 6.5 deep along its whole base.** 05 04 01-4's lower view draws it 6.5 deep only for 6.4 from its end and
  3 deep beyond, on the plate, where the fixing screw and far steady pin are. Keep: the boss at the end the detent is clamped to; the far
  pin 3 long in the block. (The sheet is first-angle throughout, which would put the upright at the free face and the detent 1.9 nearer
  the plate than the 1946 rollers allow: not adopted, README Unresolved.) `3544d3d`
- **The Wempe's impulse stone's back ran out too far.** 02 04 02 bevels its end 45°: the back 1.3 long to r 2.85 (built 3.2), the face
  1.8 to r 3.35, all makeEsc takes. `3544d3d`
- **The Wempe's balance screws stood out where the sheet and the photograph show none.** The masses' screws' heads stood 0.55 out of the
  masses and their nuts as much inside (Wempe 3955: the heads flush, nothing inside); the timing screws' heads stood outside the weights,
  which 05 03_2 draws inside the rim on its inner face, the weights split by two cuts (Wempe 3955's: no head outside, a cut across the
  end face). The weights Ø 3.8 × 3.3 for Ø 3.0 × 4.0 (unsure, ±0.4), their tips 42.1 apart. Keep: the air-damping parts lists in
  tools/wempe_escapement.js and wempe_physics.js follow these sizes. The discharge roller is brass, as Wempe 3955's (steel before). `3544d3d`
- **tools/wempe_inertia.py weighed the Wempe's escapement's bodies twice where a part has two revisions.** wempe-inertia.js integrated
  every mesh under each turning group, the hidden "as first drawn" pieces too, so the rollers, staff and hub, detent and escape arbor
  came out about double (its json, written before the revisions, still held the single values). Now it weighs the shown revision only.
  Keep: a tool weighing the model skips what movement.js's setRev hides. `3544d3d`
- **The Wempe's discharge stone was drawn square-ended.** The layout's corners and makeEsc (`BEV`) take its end bevelled back 0.3 from
  the acting corner, 05 04_1 draws it bevelled, but the mesh ended square at full reach. Now drawn with the bevel (`DS`). Keep: the drawn
  stone's outline is the one the escapement's motion is worked out on. (05 04_1 measured again scales 0.15-0.2: README, Estimated.) `462a1a3`
- **makeEsc's Wempe detent fell off its stone too soon.** At the discharge stone's square acting corner the Wempe's square-ended gold
  spring leaves with the speed it came up with (the lift turns within a cell of the table); `depart` took the detent's speed by a central
  difference across the corner, −0.39 rad/s (falling) for +4.2, so its fall began 1.2° early. `tools/dynamics.js --model wempe` found it.
  Now a square-ended spring (`TSQ`) leaves with the slope it came up. Keep: a contact with a corner hands on the speed of its approach side. `ea4b115`
- **makeEsc counted the Wempe's detent's work over the stone's whole lift.** Its sums ran over the jewel's table to its end, so the
  preload's and spring's energy came back to the balance down the stone's bevel, as a massless detent rides it; the drawn detent, flung off
  the corner, never touches the bevel, and that energy (and its speed) is lost: 3.2° of swing. Now `DEP` counts it to where the detent
  leaves the stone (the Wempe's; 0 the Hamilton's). Keep: the averaged model counts the detent's work over the path the integrated detent takes. `ea4b115`
- **makeEsc's Wempe wheel chased the impulse stone free.** Let go from rest, it is too slow to get its tooth out from under the stone before
  the detent falls back, so the stone rides that tooth's land and back (makeEsc drew the ride but left it out of the chase): its friction and
  the back's push moved the swing 1.4°. Now `RW` runs the chase with it (quasi-static, the detent's inertia in its contact). Keep: whatever
  touches the wheel between its release and the impulse is in the chase; `dynamics.js --model wempe` and makeEsc within 3° and 0.3 s a day. `ea4b115`
- **makeEsc counted any other escapement from the Hamilton's.** An instance whose settings weren't the reference's
  rebuilt its reference from the calibration keys alone (`CAL`) on the Hamilton's defaults, so a second chronometer's escapement
  with a setting changed would have been calibrated, and its rate counted, against the Hamilton's geometry (on a Wempe-like set,
  rT changed: −0.76 s a day instead of −0.05). Now `makeEsc(o, base)` takes the chronometer's own settings as `base`: the
  reference is `base` at the instance's `CAL`, its cache keyed by `base` as well. Keep: another chronometer passes its `base`
  everywhere it calls `makeEsc`; the Hamilton passes none, and `tools/escgolden.js` holds its results bit for bit. `fc61562`
- **A second unlocking in one swing counted as a beat.** Past makeEsc's `TRIP` (a swing of 333° and more)
  the discharge jewel comes round to the trip spring again and, from about 337°, lifts the detent and lets a second
  tooth go in the same active swing: the chronometer gains a tooth every swing. `tools/dynamics.js` booked it as a
  normal beat (the jewel was on the detent), so its runs reported no trips even at 350°; `tools/tripping.js`, its frame
  of the detent, found it. Now a release after the first in an active swing counts as a trip in both. Keep: a trip is
  any tooth let go that the swing's one unlocking didn't, whether a knock, the stone rung off or the jewel come round. `7417bba`
- **The held run-down left out the detent's own inertia.** `ESC.freeStep` (the page's run-down with the train held, and the
  export's) took the springs' energy where the jewel releases a massless detent (`EH`); the drawn detent (2.67 g·mm²) leaves
  the jewel earlier, where its end runs away faster than it can follow (`depart`), still moving, and loses its springs' and its
  own kinetic energy there, about 9 % more. With `TF` 68 s the run-down ran 2.8° behind `tools/dynamics.js`'s integration at
  30 s (2.5° at 28 s with 52 s, between the check's samples). `EHd(a)` now takes it from `depart`, stepped a second at a time:
  within 0.7°. Keep: the averaged model's losses come from the same detent the integration moves. `9637b0e`
- **The discharge jewel's end was a half round** (`rnd`, both corners stoned round; estimated, no source then).
  The British Museum's Model 21 (*Catalogue of Watches* VI, 1990, no. 117A) is "set with a jewel with a radius to
  the back of the acting part of the tip", and KLUwI2UUCMQ 6:58.17-6:58.33 shows the acting face flat to a sharp
  corner. Now the acting corner is square and the back radiused. The square corner holds the trip spring's tip
  on the return, so overall wants less overlap and leaves less lift past the release: `rB` and `rT` (both
  estimates) were searched together with `rd` inside the frames' 0.4-0.5 mm proud (OPEN-QUESTIONS.md has the
  table). `rB` 0.024 (0.158 mm, half the width), `rT` 0.2894, `rd` 0.296 (0.50 mm proud), `aD` 269.1°: lock
  5.5°, let-off 8.7°, overall 28.0°, drop 2.0°; 81 % of escapements made to a maker's tolerances run (92 % with
  the half round; the first choice, `rB` 0.010 and `rT` 0.290, gave overall 29.7° at the band's edge and 77 %).
  With the square corner the detent leaves the jewel at the corner first and falls back onto its end
  (dynamics.js found makeEsc's fall 7° early); makeEsc's `depart` now catches it there. Keep: the acting corner
  square; makeEsc's contacts, dynamics.js's own, the plan (escplan.js) and the 3D jewel (movement.js) have the
  same end; a detent that falls onto the jewel's end is carried on by it. `44caeee`, `a726d8a`
- **The escape wheel moved as a kinematic gear** (makeEsc's `G` 3.5: from the release its angle ran 3.5 times the
  balance's), so the tooth landed on the impulse jewel 0.6° after the release. A wheel released from rest has to catch a
  jewel already running away from it: with the drawn inertias (the escape wheel's 4.80 g·mm² and the fourth wheel's,
  reflected) it lands about 16° later and strikes it at more than twice its speed. `tools/dynamics.js`, integrating the
  escapement beat by beat, found the swing 23° short of the model's and the escapement's own rate 3 s a day off.
  `makeEsc` now chases from rest (`JW`), counts the strike and the wheel's speed lost at each lock. Keep: the
  escapement's work and timing come from the wheel's motion under its torque and inertia, and `dynamics.js` agrees with
  `makeEsc` (it fails if the swing, landing, fall or rate part). `4988099`
- **The detent fell back through the discharge jewel's end** (makeEsc let it fall over 1.5° once the passing spring's tip
  slid off the jewel's face; the square end, 0.32 mm across, holds it until the jewel has swept past, which put overall at
  about 38°, past Op. 87's 26-30°). The contacts are now solved from the shapes, the jewel's end a half round (`rnd`),
  and the settings re-chosen to the manual's figures (rd 0.300, rT 0.290, aD 271°, dL 0.017: lock 6.4°, let-off 8.9°,
  overall 27.8°, drop 2.0°). Keep: no tip passes through a jewel; the tables are the shapes' (`span`), not a fall. `4988099`
- **The detent's and trip spring's work was a fitted share** (`fD` 0.057, from Op. 78's preload over the lift at
  release only; `fP` 0.005, estimated). The jewel carries the detent on past the release, to 1.8 times that lift; the
  springs are now their own (Op. 78's weight, the drawn sections and moduli: `W78`, `hD`, `EB`, `tsH`, `ET`), and
  `TF` 52 s (Q 327; it was 34) so that 255° comes at a torque the train gives, inside the budget's and the parts' Q
  (`tools/physics.js`). Keep: only the wheel's torque is fitted. `4988099`
- **Four overlaps from this batch's measured sizes** (fine.py, 5 October 2026): the impulse roller at
  its measured 1.47 met the hub's sleeve, sized to the old 1.3; the escape bridge at 5.6 wide overhung
  its seats, grown from the old 5.2; the detent block's pins at r 0.53 stood in holes r 0.42; the block
  at its measured 3.1 width met the second train pillar's top collar by 0.28 (the pillar moved 0.33,
  inside its reading). Keep: a size measured on one part goes to every part sized from it (the sleeve
  from `RIT`, the seats from the bar's width in `tools/train_bridge.py`, the holes from the pins).
  `0b4dab2`
- **Escape wheel had 15 teeth** while the timing stepped 1/16 turn, so a tooth
  didn't rest on the locking stone every beat. It now has 16, Hamilton's count.
  Keep: the mesh's tooth count and the timing's step must agree. `5aab9f7`
- **Discharge jewel cut through the horn and arm** on the return swing (reach
  2.63 mm). Cut to 2.01 mm so it meets only the passing spring's tip.
  `5aab9f7`
- **Scripted detent motion.** Detent lift, wheel release and passing-spring
  bending were scripted bumps. They are now solved from the jewel/spring-tip
  contact, and release waits until the stone clears the tooth path. Keep: derive
  motion from contact. Don't script it. `5aab9f7`
- **Passing spring floated.** It now sits on an angle bracket from the blade.
  `5aab9f7`
- **Roller hollow on the wrong side.** The hollow was opposite the impulse
  jewel; it is now beside it. The impulse jewel's driven face was also moved onto
  the kinematic contact line. `5aab9f7`
- **Escape wheel too far from the balance** (10.2 mm). At 9.40 mm the 0.249 in
  impulse roller leaves the manual's 0.002 in roller shake (Op. 84), and the teeth
  drop into its crescent (Ops. 76, 83). Keep: `node tools/escapement.js` must stay
  within the manual's figures for lock, let-off, overall, drop, roller shake and
  horn clearance. `7328e67`
- **Detent not Hamilton's.** It is now laid out from the Fig. 90 plan view:
  two-strip spring, round locking jewel with a flat at 10° of draw, Elinvar trip
  spring on a Z bracket, and support block with stop button. `7328e67`
- **Essay's detent figure drifted from the model.** It now carries a copy of the
  model's `ESC` solver. `219e4df` Since then the solver became one `makeEsc`
  (`813f7ae`), and the essay became the model's Essay tab (`9ffe479`), whose figure uses the
  model's own `ESC` and the same plan drawing as the inset (`drawEscPlan`,
  `shared/escplan.js`). Keep: one solver and one plan drawing; nothing to copy.
- **Balance arm drawn from the hub to one side only.** `subtractCircle` keeps
  one run of the outline, and the 2.2 mm circle round the hub cut the 2.4 mm
  bar into two; the arm is now drawn outright. The moment of inertia already
  counted the whole arm. Keep: `subtractCircle` only where its circle crosses
  the outline once. `8956085`
- **Let-off and overall measured at the push's peak.** The detent's fall and the
  trip spring's return were taken where the push peaks, as the spring's tip
  slides off the jewel's side. The tip then rides on the jewel's end for about
  another degree. Measured at the fall, as the manual's gauge reads it (Ops. 86,
  87), overall was 29.9°, at the edge of 26–30°. The trip spring is now 0.013 mm
  shorter (`rT` 0.288, as Op. 91 stones a long one), giving overall 28.3° and
  let-off 12.4°. Keep: release is where the tip leaves the jewel (`thOff`,
  `thPass` in `makeEsc`), not the peak. `89a949d`
- **A swing too small to pass the trip spring lifted the detent.** Below 37.2°
  of amplitude the discharge jewel never gets back past the trip spring's tip,
  yet `ESC.state` lifted the detent on the next swing (even at 25°, which never
  reaches it from that side) and snapped the bent spring straight at each turn;
  `app.js` faded the lift by amplitude. Now the spring stays bent against the
  jewel and follows it back, and the detent stays on its stop. Keep: `state`
  decides it from `thPass`; no fade in `app.js`. `89a949d`
- **Escape teeth leaned the wrong way, drawn three ways.** The mesh's locking
  face leaned back (the root ahead of the tip), where Fig. 90 and an original
  wheel (chronometerbook post 30) have it undercut, the tip leading; the teeth
  were broad sawteeth rather than slender points, and the solver, the mesh and
  the 2D inset each had their own outline. Now one outline, `ESC.toothPts`
  (land 0.13 mm, root at 5.5 mm, face undercut 0.1 pitch, hollow back), is
  drawn by all three and `bite()` follows the undercut face. Keep: change the
  teeth in `makeEsc` only; the wheel's tips lie at k·P in its own frame, so
  `R.esc.rotation.y` is `-t0 + E·P` with no other offset (and the fourth
  wheel's phasing and `invariants.py` agree). `c4032e4`
- **Escape wheel's rim the teeth's full thickness, flickering inside.**
  The teeth and rim were one 1.3 mm extrusion, where Fig. 14's cut-away has tall
  teeth standing on a thin rim, the rim as thin as the spokes; and the spoke
  web's windows ended exactly on the rim's inner wall, its top flush with the
  rim's, so the coincident faces z-fought (dashes on the rim's inner wall). The
  tooth outline also differed from Fig. 90 (traced in polar coordinates): the
  undercut was 0.1 of a pitch where the drawing has 0.14, and the back met the
  root circle at an angle where the drawing's meets it tangentially. Now the
  rim, spokes and collet are one 0.5 mm plate to the root circle, and each tooth
  is its own 1.3 mm solid closed along that circle, the two meeting edge to
  edge; `toothPts` has U 0.14 and a back 1-(1-f)^1.6 deep (16 segments, so its
  walls shade smoothly). Lock, let-off, overall and drop are unchanged. Keep:
  no face of the plate on a face of a tooth; the teeth's outline only in
  `makeEsc`. `1f8f083`
- **Kink in the detent where the trip spring's bracket leaves it.**
  The Z bracket's leg (t 0.62–0.72 of the escape wheel's radius) was set 0.26 mm
  along the detent from the cross-piece it stands on (t 0.58–0.68), so the two
  met end to end with a step on either side, in the model and in both 2D
  figures. The leg now spans the cross-piece's t exactly. Keep: the bracket's leg
  on the cross-piece's t in `makeEsc`'s `pieces`. `4a660ab`
- **Detent's arm ended askew on its horn.** The arm ran
  diagonally into the horn and stopped square to its own slant, on a horn block
  wider than the arm and aligned with the trip spring, so the two read as
  separate pieces stuck together. The arm now turns along n for its last
  stretch and ends square over the horn, which is the arm's width (0.05 of the
  wheel's radius, from tH in): the horn is the arm's end bent down to the trip
  spring. Its inner face stays at tH, so horn clearance is unchanged (0.25 mm).
  Keep: the arm's end and the horn one outline in plan. `4a660ab`
- **The balance lower endstone cap a bar** (Review-results.md, Elsewhere
  17). On the restoration video (13:49.5) it is round with one flat, parallel
  to its two screws, on the side away from the escape arbor; Fig. 30 draws it
  round. Now R 2.7, the flat 0.65 R out. Keep: `endCap`'s `fl`.
- **Detent support block without its positioning pins.** Sec. II fastens
  the block to the train bridge "by means of one screw and two positioning
  pins" (Figs. 14, 22, 90; the restoration video, 11:08); the model had the
  screw only, 7.9 mm from the point of flexure. The block's top is now laid
  out from Fig. 90: the screw 3.7 mm from the point of flexure, a pin either
  side of it, standing into the train bridge. Keep: the top face's layout in
  `DBLK` (movement.js), the pins' holes in the train bridge (`S.dpin`).
  `8acac25`
- **Trip spring's screw upright, in a 0.23 mm leg.** It now lies across the
  spring, through the hole in its foot into the bracket's upright leg, as
  Figs. 14 and 54, the detent's reassembly (Op. 8) and the video (11:08)
  have it; the bracket's upright leg is 0.36 mm thick to take its thread.
  Keep: the screw across the spring, rebuilt with the detent; no hole in the
  bracket's top. `8acac25`
- **Detent-adjusting screw touching nothing.** Its head stood 0.64 mm beside
  the detent's foot, where Op. 93 has it "screwed in against the detent".
  The foot now runs on past the block's end, slotted, and the screw's head
  stands in the slot (Fig. 90). Keep: the slot and the head's place from
  `ESC.adj` (shared/escapement.js), so the plans draw the same foot. `8acac25`
- **Locking jewel's wedge pin proud of the block** by 0.04 mm at each end;
  flush now, as the re-jewelling (8-9) leaves it. `8acac25`
- **Lock-adjusting screw short of the stop button** by 0.24 mm, ending inside
  a solid block (`Review-results.md` 20.5). Fig. 90 splits the block's front
  along its length by a slot, open at the stop button's end, so the button
  stands on a strip sprung from the block's root: the lock-adjusting screw,
  threaded in the outer part, bears on the strip ("working through the
  locking jewel button", Sec. IV; Op. 85 turns it after loosening the clamp
  screw), and the clamp screw crosses the slot into the strip. Keep: the slot
  in `ESC.fixed.blockFront` (shared/escapement.js), the lock screw's point on
  the strip, the clamp screw into it. `3c9608c`
- **Split-balance variant through the bridges** (`Review-results.md` finding
  9). Its compensation weights (r 2.3, 4.2 long, out to 18.5 mm) stood 1.1 mm
  proud of the band each side and reached into the barrel bridge's cut round
  the balance (17.7) and the escape upper bridge; its arm and hub were solid
  round the staff. The weights are now within the band's height (r 1.1, out to
  16.8 mm, inside the timing weights' path), the arm and hub bored for the
  staff; `fine.py --split` passes. Keep: anything on the balance stays inside
  17.7 mm and above the escape upper bridge's screw heads, as the uncut rim's
  parts do. `3c9608c`
- **The locked tooth didn't recoil as the stone was drawn out.** `ESC.state` held the wheel at its
  locked place (progress 0) while the detent lifted, so the stone, its flat set at 10° of draw,
  passed about 0.01 mm into the tooth's tip from −26° to −22.8° of the balance (the work already
  counted the recoil, `cdr`). Now the tooth is pushed back along the flat as the shapes require
  (`ESC.recoil`, at most 0.18° of the wheel), the progress just under 0. Keep: the locked tooth
  where the stone's outline lets it be at every lift; `tools/escapement.js` checks the stone is
  never inside a tooth. `2fee3fe`
- **The next tooth reached the stone in one step after the impulse.** Where the impulse jewel let
  the tooth go (+20.7°, 0.96 of a pitch) the wheel's place fell back to the free chase from the
  release, far ahead, and the progress went to 1 at once. Now the tooth runs on from the jewel's
  place and speed under the wheel's torque (`thE`, `phE`, `gE`), locking about 1.4° of the
  balance later (`run` in the state: the stage "relock"). Keep: the wheel's place continuous
  through the let-go. `2fee3fe`
- **The train a tooth ahead at the phase's start.** `ESC.state(0)` took sin(2πp) > 0 for the
  active swing, so at p = 0 exactly (whenever tSim/0.5 + bOff is a whole number) it reported the
  return swing's progress 1, and the hands stood a beat ahead for that frame (blender.js worked
  round it). Now p is taken mod 1 and [0, ½) is the active swing. Keep: p 0 the active swing's
  start, progress 0. `2fee3fe`
- **The detent snapped home.** `ESC.state` took the lift from the jewel's table, which drops from
  0.3 mm to 0 in one 0.02° step where the passing spring's tip leaves the jewel (−12.4°), with the
  escaping tooth only an eighth of a pitch on: the stone stood up to 0.07 mm in its way for about
  0.6 ms (visible at 0.002×). The detent is a body (Op. 78's preload, the drawn spring, its drawn
  inertia `ID`): it now leaves the jewel where the jewel's end runs away faster than it can follow,
  falls in closed form, lands at −9.75° (dynamics.js −9.76°) and hops on its stop (`eS`); a detent
  back before the escaping tooth has passed rides its back (`ride`). Keep: the stone never inside a
  tooth at any phase and swing (`tools/escapement.js`'s `stoneClash`, which fails past 1 µm: it read
  0.08 mm on the old state); the fall's place is dynamics.js's; fine.py's `PH` has phases through
  the fall (0.2425-0.2445) and the run to the stone. `6923ac5`
- **`AMIN` 2° above where the escapement works.** It was the least swing that passes the trip
  spring (−40.2°), unlocks and sees the impulse through, plus 2° to spare; between 40.2° and 42.3°
  `app.js` held the train while `ESC.state` drew the detent unlocking it on every swing. Now
  `AMIN` is that least swing exactly (40.2° at the model's settings, refined by bisection when a
  setting moves it). Keep: `AMIN` where `state`'s own `pass` begins, so the train holds only
  when the escapement can't work. `d8e896a`
- **A held balance ran down as if nothing touched it.** `ampStep` let the swing fall as
  exp(−t/TF) whenever the train was held, but while the swing still carries the discharge jewel
  back past the trip spring, the jewel bends the trip spring on every return and lifts the detent
  on every active swing, the wheel unable to turn: 0.033 of k an oscillation, 17 % of the air and
  pivots' loss at 255° and five times it at 45°. Now `ESC.freeStep` (closed form, any step) takes
  both; from 255° the swing reaches 40.2° in 47 s, not 96. Keep: the held run-down is
  `ESC.freeStep` (app.js's `ampStep`, and blender.js's copy of the loop), checked against
  `tools/dynamics.js`'s integration of a held train. `9f1ed20`
- **The hairspring didn't breathe.** `R.spPath` turned each point of the coil rigidly by θ(1 − s/L)
  about the staff, keeping every radius, where a spring of 11.86 turns swung 255° changes its
  coils' radii by θ/(2πN), about 6 % each way. Now every part of the free length changes its
  curvature by θ/L (the pure couple Phillips' conditions give), drawn from the stud's end back
  (movement.js); against the elastica (`HSPR.large`) within 0.025 mm at 255° (the rigid turn was
  0.28 off). Keep: the shape the couple gives, the length kept, the clamped ends exact; it is
  rebuilt only when θ changes (ribbonGeo in place, 0.1 ms). It brought out that the inner curve
  passes 0.04 mm from the collet at rest (OPEN-QUESTIONS.md). `9714a9d`
- **The breathing hairspring ran into its collet.** Wound past about 50°, the inner curve, curling inward near the
  clamp, met the corner of the collet's body (0.09-0.13 mm at 255°), whose hidden side had been taken back to the
  plate's corner; no inner curve meeting Phillips' conditions from the collet's end clears that corner. The hidden
  side, which no source shows, now stops 0.9 of the way to it: the strip clears the collet by 0.063 mm at 347°, the
  widest swing the model allows. Keep: a real spring never touches its collet; the strip at least 0.05 mm off it
  beyond the clamp's edge at every swing up to TRIP + 15°. `43260af`
- **The Wempe's hairspring didn't breathe.** `hsRA(tw)` turned each coil rigidly by θ(1 − u) at its radius (u its
  height up the helix), as the Hamilton's did before `9714a9d`: the coils never opened or closed, the strip grew or
  shrank 4.5 % at the model's 207° swing, and the shape lay 1.2 mm off the elastica. Now `WESC.HSP.bend` bends it
  as `R.spPath` bends the Hamilton's (each part's curvature changed by θ/L, from the stud's end back, the length
  kept): within 0.010 mm of the elastica from −300° to 300° (`HSPR.shape`), the coils 4.9 % in and out at 207°.
  Keep: the page draws from `WESC.HSP.bend`, `wempe_hairspring.js` fails past 0.03 mm; `fine.py --model wempe`
  clear. `ee5c196`

- **Op. 78's preload was the whole 0.770 g** (p. 61's clause missed). Op. 78 runs on over the page: the weight "should separate the detent
  spring from the stopbutton by approximately 0.005 in" (p. 61; Fig. 88, "(.005 in. clearance)"), so the preload is the weight's
  moment less the spring's stiffness over that bend: 0.63 g at the jewel with the drawn spring (`G78` 0.127 mm at the button's
  middle, `th78`), and a stiffer spring is set up with less. makeEsc, dynamics.js (`MW78`, its `kD` variants set up by the
  test), tripping.js's frame (the weight lifts the button's middle `G78`), physics.js and tolerances.js (the detent spring
  bounded at 0.137 mm, where no preload is left) follow it; `TF` 67 s (Q 421) so the calibrated torque is the spring's again.
  Keep: the preload is `W78`'s moment less `KD`·`th78`, never the weight alone; a spring's stiffness and its preload move
  together. `9b55881`

## Going train and heights

- **The Wempe's hour hand's blade lay at the top of its boss, and the minute hand 1.2 over the hour hand** (15 October 2026, the drawings
  survey). 05 02 00-2's side view lays the 0.5 blade with its underside flush with the 0.8 flange's and its top 0.3 under; the model put the
  tops flush. And 05 02_1's "1,2" over the hands is the minute hand's own (its top to its flange's underside), not the gap to the hour hand,
  which scales 0.5. Keep: every hand's blade underside on its flange's underside; the hour hand's blade 0.125 over the seconds post's end,
  the minute hand 0.5 over the hour hand's boss and under the cannon tube's crown. `60ebbc3`
- **The Wempe's motion-work studs were Ø 1.3, and their pipes bored 1.32.** Scaled at 2:1 on 05 08 02 (4.7 px/mm); 05 02_1 at 5:1 draws
  both 1.52 and the pipes' bores scale 1.50-1.56 against their figured outsides (05 02 02, 05 02 04); both ends domed, not chamfered.
  Keep: studs Ø 1.5 domed, their bushes bored to them, the pipes 1.52. `60ebbc3`
- **The Wempe's centre arbor: journal C straight, riveting collar plain, no punch groove, end chamfered; WN-302 a cone sink.** 05 05 03
  and 05 05 03-2 write "Kegel 1:30" along C, draw the collar flared from Ø 3.0 over a groove in the seat, the 1943 sheet a groove in the
  shank under the cannon tube's punch and one crown over the shank's and tube's ends; 05 08 02 draws WN-302's sink a spherical cup.
  Keep: C on 1:30 (Ø 2.2 at the collar) with WN-302 bored to it, the collar and groove, the shank's groove, the crown on the arbor
  (`A.cw.crown`) and the tube alike, the hands' and hour wheel's 1:70 fits. `60ebbc3`
- **The fourth, third and escape arbors off the video's places, the seconds
  sub-dial off its arbor** (Review-results.md, Elsewhere 24, 14, 18). The fourth
  was 23.9 mm out (video 21.4-21.75 at the plate's 87.57), the third 16.0 at
  157 deg (video 16.55 at 149), the escape arbor 1.9 mm from the jewel seen from
  above; the dial printed the seconds at a fixed 0.472 of its radius (right for a
  50.8 mm dial, 1.5 mm off on the 47.5). Now F (0, 21.6), T and E as measured,
  E 9.40 from the balance; the wheels' size ratios come out as counted. Keep:
  `tools/solve.py`'s FE 11.107 (10.444 since the escape arbor was measured, below); the dial's `k` from `L.F` and `DIAL_R`;
  `SEC_L` (the seconds hand clears the hour wheel's pipe); the train bridge's
  escape opening r 6.9 about `L.E`; the lower bridge from `tools/lower_bridge.py`
  with the model's arbors; the balance locking arm's screw 30 deg from its
  weight (on the weight's other side, or at 18 deg, it stands in the cock's foot). `7291b20`
- **The detent block and foot short of Fig. 90's, its far pin 2.9 mm short**
  (Review-results.md, Elsewhere 20.2). Shortened to clear a train pillar that
  has since moved out; now 15 and 16.4 mm from the point of flexure, the pins
  symmetric about the screw. Keep: `BE` in `shared/escapement.js`; `DBLK.p`
  symmetric about `DBLK.s`. `7291b20`
- **The escape upper bridge a thin bar with a plan boss and a 0.3 mm cap**
  (Review-results.md, Elsewhere 17). Rebuilt as the video shows it (10:00-10:50).
  Keep: the arbor's top pivot and its jewels moved down 0.9 together (endshake
  unchanged); the end screws at 8.3, `ebu` 72 deg. `7291b20`
- **Heights estimated wrongly.** Train bridge was 22.1 mm above the plate;
  a side photograph scaled by the pillar plate's 3.86 mm edge gives 16.8 mm.
  Barrel (13.2 mm tall, rising through a cut in the train bridge), train wheels,
  lower balance bridge and cock were re-stacked to match. Keep: heights are the
  named constants in `movement.js` (`TB_U`, `TB_T`, …). Don't reintroduce loose
  numbers. `1340cb6`
- **Seconds and wind-indicator hands too high.** The hour hand swept into
  them. They were lowered. `84a7645`
- **Minute hand floating over the cannon pinion; hour hand without a hole;
  the square on the minute hand** (Review-results.md, "Floating minute hand").
  The cannon pinion's pipe ended at y 4.9, and the minute hand sat in a static
  hub from 5.7 that didn't turn. The hour hand was a solid blade across the
  pipe's path. The key's round socket cut into the square's corners, and only
  the Hamilton dial had a square. Now stacked as Ops. 58, 59 and 64 describe:
  the cannon pinion's pipe (r 1.7) runs to a shoulder at 5.75 and ends in the
  square (the one the key turns, on every dial style); the hour wheel (bore
  1.75) is free on the pipe; the hour hand's round collet sits on the hour
  wheel's pipe; the minute hand, broached square, sits on the shoulder with its
  collet over it; both keys have square sockets. Keep: each collet turns with
  its hand (one `dk` group); the hour wheel's bore clears the square's corners
  (r 1.70), since it goes on over them; the hands stay above the sub-dial
  collets (5.05); `fine.py` run with the keys shown (`hkeyOn`, `keyOn`) finds
  nothing between a socket and its square. `4bd8888`
- **Hamilton dial's hands short of their tracks** (Review-results.md, "Short
  hands"). Measured on the photographed dial against its own tracks (the
  track's inner/outer 0.945 there, 0.948 in the model): the minute hand
  reaches the minute track's outer edge (the model's stopped mid-track,
  44.4 mm against 45.4), the seconds hand 0.99 of its track's outer circle
  (0.955), the wind hand 0.95 of its scale's (0.85, short of the inner arc);
  the hour hand, 0.84 of the minute track, agreed. Keep: the hands' lengths
  are the photograph's proportions of the tracks they read; the essay draws
  the same hands (`hands()` in essay.js). `3c9608c`
- **Every count in the motion work wrong** (IDEAS.md 1.8). The model had
  cannon pinion 12 : minute wheel 36, minute pinion 10 : hour wheel 40, chosen
  for the ratio of 12; C Spinner's video has 14 : 56 and 18 : 54 (the wheels
  whole on the mat, 23:45-23:46; the pinion's 18 leaf ends, 9:06). Now so, the
  modules from the minute wheel's place, 10.5 mm out as the dial-side
  photograph has it (it was 9.6, the old counts' distance). Keep: `MW` the
  counts, `MWM` their modules from `L.Mw`. `aba5fcf`
- **Every tooth count in the going train wrong, and the up–down scale on 240°.**
  The counts were chosen for the ratios (fusee wheel 96, centre 80, third 75,
  fourth 60, pinions 10, 10, 8; wind indicator 98 : 8), and the dial's UP–DOWN
  scale was drawn on the 240° that ratio gave, where a photographed Model 21's
  spans about 315°. Counted on a restoration video of a 1941 Model 21
  (`References/README.md`, "Videos consulted"; `tools/video.py`): fusee wheel
  90, centre 90, third 80 with a pinion of 12, fourth 75, wind indicator wheel
  120; the fourth and escape pinions (10, 10) follow. The centre pinion (14) and
  the fusee arbor's pinion (12) are inferred: 17½ half turns then hold 56¼ h,
  the manual's maximum of 56, and the hand sweeps 313.6° (dial 315.7°). Keep:
  `MOD` is worked out from the centre distances in `L`, so a count changes a
  module, not a place; the hand and every dial's scale use `UDA` (movement.js),
  never a fixed angle; `invariants.py` checks the sweep against the
  photographed dial and the run against the manual's 56 h. `49a402d`
- **Seconds hand's tip on the hour hand's collet.**
  The collet added in `4bd8888` filled r 2.9 from the centre down to y 4.6, and
  the Hamilton seconds hand's tip, at y 4.35 to 4.7, reaches r 2.9 as it passes
  :00, so they touched once a minute. The collet is r 2.7, inside the hand's
  boss. Keep: the contact has no volume and `fine.py` never sets the seconds
  hand at :00; check the sub-dial hands' reach against anything new at the
  centre by hand. `9f9118f`
- **Escape pinion 0.3 mm into the third wheel's teeth** (seen in the model,
  not a review finding). The 2 mm pinion was centred on the fourth wheel, so
  its upper end reached the third wheel's height, 0.37 mm inside its tips. It
  now runs from the fourth wheel toward the plate (y −7.96 to −5.96), 0.19 mm
  below the third wheel. Keep: `dyn.py` works in 0.4 mm cubes and can't see
  this; check pinion and collet lengths against neighbouring wheels by hand. `329e77e`
- **Fourth wheel's collet 0.38 mm into the third wheel's teeth.** The collet
  stood 0.6 mm proud of both faces, so its upper end reached the third wheel,
  whose teeth come within 1.21 mm of the fourth arbor to mesh with its pinion.
  `arbor()` now takes `cside` (collet on one side only, 0.05 mm proud of the
  other face so the faces don't z-fight); the fourth wheel's is on the plate
  side. Keep: a collet must stay inside the radius a meshing wheel leaves free. `329e77e`
- **Fourth wheel and escape pinion 0.045 mm too far apart** (finding 5). The
  stage's module is now 0.3113, fitting the 10.585 mm centre distance that the
  escape wheel's position leaves. `c2adc92`
- **Pinions inside their wheels; the train stacked
  upside down.** The fourth pinion's leaves (tips r 1.785) ran 0.21 mm into its
  collet and 0.16 mm into its wheel, standing out of the collet (r 1.6) and hub
  as small steel notches on the brass; the centre pinion ran 0.5 mm into its
  wheel's spoke windows. `fine.py` couldn't see either: wheel and pinion are one
  part. Figs. 13, 29 and 110 stack the train third / centre / fourth from the
  plate, the third and centre pinions above their wheels, the fourth pinion
  below its wheel, and five spokes on each wheel. The model had centre /
  fourth / third, the third and fourth pinions on the wrong sides and 4 spokes
  on the third and fourth wheels, from reading the side photograph's lowest
  band (0.4–1.6 mm) as the centre wheel. Now as the figures: third wheel
  0.35–1.0 mm above the plate, centre wheel 1.15–1.85, fourth wheel unchanged;
  the minute and hour wheels solid and the wind indicator wheel five-spoked, as
  photographs of a Model 21's dial side show them. Keep: each pinion ends at
  its wheel's boss (`arbor()` reports a pinion inside its wheel or collet with
  `console.error`, which `smoke.py` fails on); a boss stays inside the radius a
  neighbouring wheel leaves free (the centre boss r 1.3, 0.215 mm inside the
  third wheel's tips); the train-blocking screw takes its spoke count from the
  wheel's (`FW_SP`). `22e3984`

- **Third arbor 3 mm too near the centre; centre and third wheels the same
  size.** The third arbor was solved for clearances at 13.05 mm from the
  centre, and the modules, which follow from the arbors' spacing, gave the
  centre and third wheels tip radii of 11.8 and 11.6 mm. A restoration video
  (`References/VIDEOS.md`, KLUwI2UUCMQ 13:49.5 and 14:45) puts the third
  bushing 16.0 mm out (anchored on five train-bridge holes matching the
  model's to 0.2–0.6 mm), and the counted wheels' size ratios are centre ÷
  third 1.36–1.39 and centre ÷ fourth 1.48–1.50. The third arbor is now at
  (−6.18, 14.75): tip radii 14.4, 10.1 and 9.6 mm (ratios 1.43, 1.50). The
  detent's support block is notched round the arbor, provisional until its
  own place is measured. Keep: the third arbor where the video puts it; the
  wheel sizes from `MOD`, not set by hand. `a237869`
- **Train pillars' profile drawn, not measured.** The model had a foot r 3.4
  over 1.3 mm, a neck r 2.3 under a top r 2.9. The video (42:56) shows a
  straight shaft r 2.7 with a foot collar r 2.9 over 3.3 mm and a top collar r
  3.3 over 3.4 mm; with the old foot the corrected third wheel would hit it.
  The detent's support block is 0.66 mm shorter at its foot end, and its
  adjusting screw follows, to clear the thicker top collar. Keep: the pillars'
  measured profile. `a237869`
- **The photographed group's size and place.** The
  balance, fusee and barrel were triangulated on two photographs, which fix
  their layout but not its size: the size came from making the fusee wheel,
  assumed 40.87 mm across, fit the plate (×0.955), and the place from a 14°
  turn about the centre. Measured on real movements, the fusee stands 20.4 mm
  from the centre, not 22.9 (the bare plate at 34:30 and 36:15, the side
  photograph's wheel read at the plate's own scale, the train bridge's
  notch), the barrel 22.6, not 18.6 (the plate; the train bridge's cut round
  it), and the balance on its lower cap, 4.9 mm from where it was (13:49.5,
  `framecam.py`). The three fit the photographs' own triangle ×1.039 to
  0.23–0.31 mm. Everything traced on the top-view photograph now goes through
  that similarity (`PT`: ×1.039, 19.42°, shifted (−3.891, 0.879)); outlines to
  the rim through `PTr`; what the video measured in the train bridge's own
  frame through the 14° turn alone (`PR`). The escape arbor is solved again
  (9.40 from the balance, 10.585 from the fourth), the detent turning with
  it; the lower bridge laid out again; the train-blocking screw moved to
  (3.9, 26.15), the locking arm swinging back over its screw (`ARM_U`),
  pillar 1 pushed 2.3 mm out of the fourth wheel. Keep: a constant traced on
  the photograph goes through `PT`, one measured on the train bridge through
  `PR`, one placed from the dial or train through neither; angles read on
  the photograph take `PHOTO_TURN`, radii `PHOTO_K`. `6d1bd37`
- **The minute wheel's stud 10.5 mm out** (Review-results.md, Elsewhere 24): from
  the 404 px dial-side photograph mapped through anchors that have since moved; the
  video at the plate's scale has 11.3. Now 11.3, the motion work's modules from it. `162dfe5`
- **The Hamilton dial's print 9 % too large** (Review-results.md, Elsewhere 24): its
  minute track at r 43.0-45.4, so with the fourth at its measured 21.6 the seconds
  sub-dial couldn't meet it at 6 as on the photographed dial. Measured on that
  photograph face-on, scaled by the seconds' centre: the track r 40.4-42.2, the seconds
  track 17.9, the UP-DOWN ring 11.2, the opening 45.9 (the bezel's own). Now printed so,
  the hands to the photograph's lengths (and the essay's copy of them). Keep: the dial
  95 mm; `r1`, `r2`, `ru` in `dialCanvas` in mm over `DIAL_R`. `162dfe5`

- **The train wheels' rims, spokes and hubs were stock proportions**. Measured on the restoration video's flat wheels (23:45): the centre
  wheel's hub 0.30 of its tip radius, rim from 0.79, spokes 0.10; the fourth's
  0.36, 0.83, 0.07 (they were 0.18, about 0.86, 0.08). The third takes the
  fourth's, estimated. Keep them measured (`WHEEL_PROP`; SHAPE-PASS.md, 3). `7ea6a5a`
- **Every mesh drawn with its backlash centred** (kinematics audit, 11 October
  2026). Each pair was phased with the driver's tooth on the line of centres and
  the driven gap centred on it, so the driving flank stood 0.04-0.06 mm off its
  leaf at the closest, and as far on the other side; a loaded train runs with
  the driving flanks touching and all the backlash behind. `gearLash` (core.js)
  now turns each driven member back onto the driver's driving flank, to 0.005 mm
  where the two outlines come closest over a whole tooth (the cycloidal profiles
  aren't conjugate, so the gap varies as they turn): the fusee wheel onto the
  centre pinion, the centre, third and fourth wheels onto the third, fourth and
  escape pinions, the cannon pinion onto the minute wheel, the minute pinion
  onto the hour wheel, the fusee arbor's pinion onto the indicator wheel; the
  laid-out view keeps it. Keep: `ph()` passes the way each driver turns as
  `update()` turns it (if a driver's sense changes there, its `s` changes too);
  the gap measured on the outlines as drawn (`pl`), never on pitch circles; at
  the audit's E values and over a dense sweep of a tooth of each driver no
  outline overlaps and the closest gap is 0.005 mm, on the driving flank. `d81364f`
- **Comments and the README quoting the escape pinion's old mesh** (kinematics
  audit, 11 October 2026). Two comments in `movement.js` (the photographed
  group's, and `MOD`'s) and two places in the model README still put the escape
  pinion 10.585 mm from the fourth, the module 0.3113 or 0.249; the fourth's
  measured place makes it 11.107 mm and 0.2614 (`tools/solve.py`). Keep: a
  figure that follows from `L` quoted as `solve.py` prints it, the old value
  only as history. `05b2ef2`

- **The escape arbor 0.74 mm off its measured place, the fourth wheel too
  large** (OPEN-QUESTIONS.md, the fourth wheel's size). It was solved 9.40 mm
  from the balance toward the escape jewel as 10:00 was then anchored (on the
  third arbor's old place), 11.107 mm from the fourth, which made the fourth
  stage's module 0.2614 and the fourth's tips r 10.10 (third ÷ fourth 1.02,
  measured 1.05-1.10 on two movements). Its lower setting on the bare plate
  (KLUwI2UUCMQ 34:30, 14:45, 13:52.0, 40:08; `rimfit.py`'s camera on the face
  edge, a rigid fit on the centre, fusee and barrel bushings) lies 4.3° further
  round the balance. Now 9.40 from the balance at the four frames' mean
  direction, (8.926, 16.178), 10.444 from the fourth: module 0.2457, tips
  r 9.50. The escapement turns with it about the balance (the detent, its
  block and pins, the locking arm, the balance at rest), the escape upper
  bridge, its seats and the train bridge's escape passage (`train_bridge.py`),
  and the balance lower bridge's lugs (`lower_bridge.py`, the detent's plan
  turned with it); `JW` 5.9 (the smaller fourth's inertia reflected). Keep:
  `L.E` measured, 9.40 from `L.B`; `tools/solve.py`'s FE the distance it
  gives (10.444); the hard-coded copies of it (`train_bridge.py`'s `ESC_B`,
  `EBU_B`; `lower_bridge.py`'s `E`, `ARM`; `physics.js`'s and `dynamics.js`'s
  fourth module; `audit.py`'s detent pins) follow it. `8fcc1e5`

- **The hairspring stud's holes and the cock's arm step stood where an old
  scale put them.** The stud's three holes were read through a homography whose
  every size on the cock's top came out about 0.83 of the video's: drawn 3.9, 7.0
  and 10.5 mm from the staff where KLUwI2UUCMQ 6:29 (through the camera fitted
  on 6:49.0) measures 5.49, 9.00 and 12.75, the row 1.7-2.4 mm further out. They
  are now drawn there; the clamp is 4.34 mm from the staff (2.65 before) and the
  outer terminal curve is re-solved to Phillips' conditions for it (the smoothest
  of the four that meet them: 14.6 mm, its tightest bend r 1.24). The arm's step,
  placed along the same row, moved with it: re-mapped on 44:02 with the holes'
  pixels (1780, 1997, 2207) and their measured spacing, 14.6 mm from the staff
  (the old spacing gives the 8.70 mm recorded); left where it was, the stud
  bar's outer end stood 0.85 mm into the cock's thick part. Keep: the stud's
  holes (SPHa-c) and the step (CK_SP) read through the same scale as the cock's
  outline (CK_TR); the essay's hairspring figures (data-hs) from hairspring.js. `bf4d681`

## Winding and maintaining work

- **The Wempe's barrel arbor hook faced the wrong way, and the maintaining detent's step was an arc.** The hook's square face was on
  the side the spring's pull leaves it, the strip's tip abutting it from there, which holds nothing; 05 07 02's end view, first-angle and
  so from the square's end, puts the face on the side the arbor turns from, the spring's eye over the pin. The maintaining detent's step
  (05 05 05-1) is a dashed straight edge from 8.6 at the back to the hollow, not an arc at 8.6 about the hole (which ran into the fusee
  wheel's tips and was cut back to 7.55). Keep: the hook in the spring's eye, its tip behind the pin; the step the sheet's line, 0.52-0.61
  clear of the tips. `215bed8`
- **Every wind stopped the Wempe's train.** app.js's `wind0()` set `winding` before reading `drvNow()`,
  which while winding returns the maintaining spring's own last drive (nothing on the first wind), so the
  spring carried no drive and the balance held. Found by `maintaining.py --model wempe`. Keep: read the
  drive, then set `winding`. The Winding slider's last step now sets run down (HRUN 55.91 is past its
  0.1 steps). `7c6bb74`
- **The Wempe's fusee groove was cut at the superseded issue's pencilled pitch, and its chain's hooks
  were drawn a third their thickness** (16 October 2026, the audit of 3.00.00). The groove had 02-1's
  pencilled 1.15 and lands 0.82, the chain's own nominal width, which squeezed the flange to ribs 0.6
  and 0.14 round a 0.8 slot; 05 06 04-2's section, the issue built, gives the slot 0.87 +0.01, the
  ribs 0.8 and 0.37 (summing to its 2 ±0.02) and the pitch 1.2 ±0.01, a land and its rib: lands 0.87,
  the chain 0.03-0.07 clear, the 8¾th turn 0.08 short of point N. The hooks were the links' middle
  layer, 0.26; 05 07 04's side views draw them the chain's full width (strip 10 × 0.9): 0.80, their
  eyes 0.26 between the end links' outer plates. The chain leaves the slot level and the top hook lies
  level in it (tilted with its end link it reached into the first rib). Keep: the groove's pitch and
  lands are 02-2's, the flange's three widths sum to its 2; the chain doesn't touch the fusee in fine.py
  (no allowance for it). `b9dc7f9`
- **The Wempe's fusee groove ran on past its end N, under a hub 0.3 thick all round** (17 October 2026, the user's
  screenshot: the stop bar's slot "looks weird and unrealistic"). `rBody` cut the top turn's land and rib at every angle,
  past "Gangende Punkt N", the hub (Ø 21) only the last 0.3; the slot, 1.5 deep, then sliced a thin loose flange and the
  ribs under it, leaving knife edges and slivers. 05 06 04-2's Schnitt A-B draws the end uncut past N: the last land
  against a block at Ø 21, 0.3 thick at D (N's side) and about 1.3 at C, no rib between. Now the groove ends at N (`MN`,
  the turn whose land's edge is 0.3 from the small end, 8.817) and the end beyond it and the last land's rib are the hub's
  Ø 21: the slot is a plain channel through solid metal, opening into the top turn's groove at the bar's lower end (the
  end 0.62 thick there, the land under it to 1.49) and, 1.1 deep at its upper end past N, leaving 0.3 of metal over the
  turn below (why the drawing makes it shallower there). The spring's pin, which ended flush with the old top land, now
  ends with its outer corner 0.02 inside the Ø 21. Keep: a fusee's groove ends where its sheet puts N, and the end past it
  is the uncut blank. `d33de400`
- **The mainspring's torque was the linear strip's, a fifth under the solved spring's** (16 October 2026, a review of
  the mainspring). `physics.js` (and `tolerances.js` beside it) took the fully wound moment from a linear strip,
  E b t³/12 L over the whole 1,064 mm, falling by the fusee's ratio over the barrel's turns: 0.78 N·m, 2.22 GPa. The
  spring the page draws, solved coil by coil (`mainspring.py`), pulls 0.96 N·m (its packed coils don't bend, so less of
  the strip works), and `mainspring_friction.json`'s own torques already said so. Now `mainspring.py` writes the table's
  absolute torque (`M1`) for the Hamilton too, `physics.js` takes the moment from it at the page's full wind, and
  `strength.js`, `tolerances.js`, `bench.js`, `deviations.js` and the essay follow; the steel's limit is a set strip's,
  1.5 times its elastic limit (2.55-2.85 GPa, reasoned in `physics.js`), not an unsourced 2.5-2.6. The energy budget's
  gap that opens is reported, not failed (OPEN-QUESTIONS.md, "Open since 16 October 2026"). The sustaining spring's
  band, sized to push 0.88 of the linear strip's drive, pushed 0.71 of the solved one: drawn 1.45 mm high (1.25), as high as clears the sustaining ratchet, it pushes 0.82.
  Keep: the spring's torque, wherever a tool needs it, comes from the solved table, never E b t³/12 L; anything sized
  against the drive (the sustaining spring, the bench's bands) is sized against that. `d190fa1`
- **The Wempe's maintaining detent had no spring.** fusee.js left its wire spring (Feder 05 05 06-1,
  the coloured section's) out as having no sheet and no hole, but the top plate's table (05 08_1a)
  has hole 5, "Drahtfeder", M1.7, 4.73 from the detent's hole 4, and the north-side photographs
  show a slotted stud there with a steel wire hanging past the detent's back. Now drawn: the stud
  (Ø 3.0 × 1.9, its slot, its shank 0.4 out under the plate) and the wire (Ø 0.25, to 1.8 over the
  pillar plate), measured on 4_Wempe_3955_N, 4_Kirow_247_N, 4_Lange_5177_N and 2_*_A scaled by the
  hole table's spacing, bent by the detent's back and rebuilt as it rides. Keep: a part with no
  sheet is looked for in the hole tables and the photographs before it is called undrawable; the
  wire bears on the detent's upper corner alone, its axis on the stud's. `860233a`
- **The Wempe's stop bar stood 40° off its slot's drawn line, and full wind was taken at the
  groove's end.** The model set the bar's turn so the stop pin met it with the chain lying to
  the groove's end N (8.75 turns); 02-2 dimensions the slot from the line through the chain's
  pin A ("4", no angle), so along it. With the slot along A the stop pin (hole 7) decides full
  wind: 0.112 turn short of N, 8.70 turns and 55.9 h to run down (05 06_20's 8.75 working
  turns, the dial's 56), the groove's last tenth empty. escphys.js's MF is the stop's turn,
  8.638, and the page warns if it parts from the fusee's. Keep: full wind is where the stop
  holds the fusee, never assumed at the groove's end; a part a sheet dimensions from a line
  lies along it. `745cc13`
- **The Wempe's fusee, maintaining work and barrel parts differed from their works drawings** (15 October 2026, a survey against the
  sheets). The set-up ratchet's backs were arcs r 12.5, nearly flat: 05 07_3's "12,5" is a diameter, each back an arc r 6.25 centred on
  the "6,4" circle. The click wheel's faces leaned back 8°, where 05 06_16 undercuts them (each tip over its gap). The maintaining detent's
  tip ended in an arc on r 12, 1.98 tall and leaning out; 05 05_12 draws it straight, 2.6 tall at 80°, leaning back toward the hole. The
  maintaining ratchet was 1.02 thick inside its cup (05 06_12: 1.3; 1.02 only at the teeth) with its chamfer on the cup's inner edge (the
  outer). The fusee wheel's recess mouth was a 0.3 chamfer (05 06_7: 60° from Ø 17). The cover plate had a recess round its hole (05 06_8's
  0.4 is the bore's land under a 60° chamfer). The
  clicks' noses leaned out and their base line lay 1.68 under the hole (05 06_14: 85° leaning back, 1.52, the r 3 hollow's chord). The
  Vorreiber's chamfer was on face a (05 06_6: the hub's side). The barrel arbor's hook was a flat-topped pin (05 07_8: a ramp to 0.5 at a
  face, the face where the spring pulls). The chain's top hook was 3.95 long and 2.8 wide against its own figures (05 07_14: 5 and 3.5, the
  nose turned back toward the chain), and the bottom hook's barb hooked forward and outward (its tip points back toward the rivet, into the
  drum). The maintaining spring's swell was estimated (traced on 05 06_10). Keep: every outline in `wempe/js/fusee.js` from its sheet's
  figures and traced lines, each comment naming them; the chain's first rivet where the top hook's seat reaches the pin (`HK0`), the hooks
  laid in their end links' planes; the bottom hook's barb in the drum's wall is expected (`checks.py`), as the band's. `e709c07`

- **The winding-pawl springs' feet were placed apart, and nothing showed the
  holes beside the pawls.** The beds, pockets and screw holes were read on
  KLUwI2UUCMQ 19:12 as angles from the pawls' studs as that frame shows them,
  172.6° apart; the model sets the studs opposite, so each foot's screws came
  out 7-9° off and the two feet 16° apart, though the springs are one part
  (42007, two off). The underside face-on (28:35) has the studs opposite and
  the two feet's screws alike, and on 19:12 the four screw holes are symmetric
  about the studs' centre, 0.56 mm from the bore's edge the angles were read
  about. The angles are now counted from the true studs (+3.9° and -3.5°), both
  feet's screws at 132.0° and 161.8° from their own pawl, r 8.15, the pockets'
  estimated far ends past them; a hole through the wheel beside each pawl's arm
  (r 0.66 at r 6.8, 13.6° toward its tip), seen through from both faces, is
  cut. Keep: the springs' beds, feet and screws counted from the studs where
  they stand (opposite), the two feet's screws the same; any frame's angles
  re-centred on symmetric pairs before they are read (`References/VIDEOS.md`,
  "The sustaining ratchet's holes, studs and pawls"). `4f0100d`
- **The winding pawls were bright, their springs and the setup pawl's spring
  blued, and the pawls' studs thinner than their holes.** No source had blued
  springs: the one flat spring of the movement the video shows, the setup
  pawl's (11:58), is polished steel, and the pawls are grey steel, about as
  light as the gilt beside them (28:19.1, 19:12, 18:40). The studs were r 0.22
  in the pawls' r 0.403 holes, a ring of daylight round each; 19:12 shows a
  stud's end r 0.38-0.46 filling the eye. Now the pawls `M.steelD`, the springs
  and feet and the setup pawl's spring `M.steel`, the studs r 0.385 (inside the
  holes' 12-sided outline). Keep: a part's finish from a frame of it, or from
  the movement's nearest like part, said so in its comment. `4f0100d`

- **Wound straight from a set, the sustaining ratchet stood while the fusee
  turned back most of a turn, then dropped past a tooth.** Wind with the key
  with From run down sets the wind to run down and starts winding in the same
  frame; `update()` took the winding pawls' lock from the fusee's old place, so
  the ratchet didn't go back with the fusee (its winding pawls off their faces)
  and its pawl caught it only after about 0.8 turn, 2.7° back where a tooth is
  3°. The fusee is now carried to its new turns first, its pawls on the nearest
  tooth, and the lock taken from there: the pawl holds on the first step.
  Keep: a wind started in the frame of a set goes back with the fusee and is
  held within a tooth; `tools/maintaining.py` checks it ("wound from a set").
  Its hold depth now counts only holds the spring pushes on (a spent spring
  leaves the pawl anywhere on a tooth's back). `6824826`
- **The mainspring packed its coils coarser than the video it came from.** The strip's 0.394 mm is the packed coils'
  pitch on KLUwI2UUCMQ (1/41.4 of the barrel's inside radius), the strip and whatever lies between them; `mainspring.py`
  took it as the bare strip and kept its coils a further 0.01 apart, so the model packed at 0.404, 1/40.3 of the inside
  radius, coarser than every source (1/41.0-1/43.7), had 0.33 turn from full wind to coil-bound and swung 225° fully
  wound, under the manual's band for about six hours. The film is now 0 (`MC_MS_GAP`; no source gives one), the strip
  still 0.394: set up 0.89 turn, 0.60 turn of room, the swing 248° fully wound and in the band all through the wind; let
  down with the arbor out it packs 11.2 coils on the wall (10.4 before) against the video's 12 ± 1. The old table is
  `tools/mainspring_film01.js`. And `write()` drops trailing states at coil-bound whose energy jumps (over three times
  the median step), which had bent the smoothed pull over the whole wind on the Nivaflex strip packed the same way.
  Keep: the solver's pitch is what the videos measure; a thickness read off a pitch is the pitch less a film, and the
  film is the solver's only to add when a source gives one. `ec0fdba`
- **Stop-bar spring hooked into the bar from below, top turn 0.34 mm high, slot cut deeper than the bar's band.** Read again on
  KLUwI2UUCMQ: the spring's end goes sideways into a hole in the bar's inner side face (25:14-25:17) and its fixed end down into a
  tapped hole in the recess floor (the "balls" of 20:01.23 are the holes); the step is on the bar's underside, 0.52 of its length
  from the chain end; the chain end's lower face is level with the band under the top plate and with the top of the chain's links
  on the top turn (37:22-37:26), so the band is as deep as the chain end, its slot's floor flat, and the top turn lower. Drawn so,
  the recess r 5.1 with a floor plate carrying the two holes, the wire 0.30. The groove's start moved 0.34 lower (`yS`, `cT`), the
  top plate where the collar puts it (`cap` 0.98). Keep: the slot's floor flat, the band as deep as the chain end; the bar's top
  face whole (it is built in bands down from its top). `c5eefb5`

- **Stop-bar and winding stop drawn from estimates: the stud in the wrong place and too small, the bar too narrow, square-ended, on
  the wrong side, pushed by a nose no source shows.** Measured on KLUwI2UUCMQ (OPEN-QUESTIONS.md, model README "Estimated"): the
  stud 2.3 across and 5.5 long with three grooves across its end, its base 11.6 mm from the fusee's axis, about 108 deg round from
  where it was (an estimate radially out from the plate's centre, r 0.9, 3.2 long); the bar 15.0 x 1.8, both ends slanted the same
  way, 0.7 thick at its stop end and 1.1 at its chain end, on the side of the arbor where, winding counterclockwise from the key's
  end, the stop end leads with the corner that stands out (it was 14.6 x 1.0 x 0.45 with an estimated nose hanging into the groove);
  the spring a wire C round the collar hooked into the bar (it was in a groove round the hub, on a tab). The motion now follows the
  measured parts: the chain pushes the chain end in 1.97 mm, the bar's turn is solved so its stop end's corner first touches the stud
  at full wind (0.47 mm into its path), every other pass 0.6 mm or more clear. The fusee's top carries the slot: the recess 1.44
  deep, the slot under the chain half to the slot's floor and out through the rim, no turned flange over the top turn (a lathe can't
  take a straight slot: carving it radially or folding the flange onto the floor left material in the bar and a double sheet that
  `fine.py` read as solid). Keep: `fs.stud` is the measured place (`WSP`), not a function of the bar; the bar's ends and sides as the
  frames show them (which end is which from 25:40 and 26:05-26:23); `tools/maintaining.py` must pass, its sweep included; the groove's phase (`phi0`, `rotT`: `MG`) fixed, not taken from the bar (taken from it, the redrawn bar turned the groove 0.003 rad and moved the fusee's torque past `invariants.py`'s 0.0002). `f196703`

- **The stop-bar's nose passed under the winding stop with only the fusee's endshake to spare.** On every turn but the last,
  with the bar back, its nose stands out past the fusee's rim and passed 0.05 mm under the stud's end (−20.40 against −20.45):
  the whole drawn endshake (the collar 0.05 under the barrel bridge's bushing), which dial up the fusee's weight takes toward the
  stud, so at the manual's widest (0.003 in, 0.076 mm) the nose would meet the stud's side and stop the key a turn or more early.
  The stud now ends at −20.60, 0.20 mm over the nose, still covering 0.375 of the bar's 0.45 mm. Found by sweeping the fusee
  from full wind to run down every 0.001 turn; `tools/maintaining.py` now does so (every 0.002 turn) and fails on any pass of the
  bar, nose or tab within 0.1 mm of the stud. Keep: what passes the winding stop clears it by more than the fusee's widest
  endshake. `ba2bd04` (The stud and bar were then measured and redrawn, the entry above; the nose is gone.)

- **The chain counted its links afresh every frame.** `setWind` laid as many whole pitches as fit along the pitch line, a
  polyline sampled in 0.01-turn steps whose length is constant only to its sampling; with the measured mainspring core (12 October
  2026) that length sat within a few hundredths of a whole number of pitches, so a link came and went as the chain moved and the
  hook's plate jumped between 1.36 and 3.06 mm (the page's live loop and the export's Run down flipping at different winds:
  `blender_check.py` found the rig 0.88 mm off at 29.98 s of Running; before, the same flip fell at 37 s, outside its sample). The
  links are now counted once, at full wind (`NJ`), and a line a hair short of them carries its last joints on round the barrel's
  pitch circle (its step's sign taken across ±π). Keep: a chain's link count is fixed; nothing it draws may be counted from a
  sampled length each frame. `eaccab2`
- **Winding-pawl spring's foot 0.35 into the winding ratchet's tips** (found by `fine.py` on the branch that cut the springs' beds, before it was merged). The traced r 7.04 line was taken as the bed's centre and the foot's pocket run in to r 6.8, inside the fusee's winding ratchet (tips r 6.9), which turns at the springs' height. The line is the pocket's inner wall (r 7.0); the feet and springs lie outside it. Keep: nothing on the sustaining ratchet's face toward the fusee comes inside r 6.9 + clearance; run `fine.py` after touching the beds. `703a20a`
- **Sustaining spring ran forward from its pin,** so the sustaining ratchet
  couldn't drive the fusee wheel through it. It now curves back to a free end
  pressed by a pin on the ratchet. `967570c`
- **Winding pawls cut 0.37 mm² into the fusee's winding ratchet.** The fusee
  and sustaining ratchet had no phase relation. They are now locked in running
  and held while winding. `967570c`
- **Pawls fixed while their ratchets turned under them.** The sustaining and
  winding pawls are now seated on their teeth each frame (`seatPawl`).
  `967570c`
- **Pawls pointing away from their ratchets, and ratchet teeth facing the
  wrong way.** The sustaining pawl now engages its ratchet, the winding pawls
  reach the fusee winding ratchet, and the teeth face so the pawls hold.
  `84a7645`
- **Setup click 0.8 mm² deep in the setup ratchet.** The ratchet is phased so a
  steep face bears on the seated click. `967570c`
- **Stop-bar missed the winding stop.** It was aimed 26° off (`84a7645`), then
  hit the pin end-on 0.8 mm deep. It now meets the pin side-on at full wind.
  `967570c`
- **Sustaining pawl's pivot 0.12 mm into the fusee wheel's teeth.** At 21 mm
  from the fusee axis the 0.7 mm arbor reached inside the wheel's 20.42 mm
  tips; it is now at 21.35 mm (0.23 mm clear), and the pawl still seats in the
  sustaining ratchet. `329e77e`
- **Stop-bar ran through the fusee arbor at full wind.** It was two blocks
  either side of the axis with a 2.2 mm gap; sliding 3.2 mm out, the inner one
  crossed the 2 mm arbor (1 mm³). It is now one bar in a groove beside the
  arbor (1.8 mm off the axis, 0.1 mm clear at full travel), re-aimed so its
  side still meets the winding stop pin at full wind (checked every 0.005
  turn over the last 0.3 turn: touching at full wind, clear before).
  `b39086a`
- **Stop-bar slid out through the chain's top turn, 0.18 mm.** The links are
  1 mm tall and centred on the cone's top edge, so at full wind the top turn
  stood 0.3 mm above the fusee's top face, where the bar lay. The fusee's top
  cap (inside the chain) is now 0.55 mm above the cone and the bar, 0.22 mm
  thick, sits on it: 0.03 mm above the chain and 0.03 mm under the train
  bridge, still level with the winding stop pin. Keep: the bar has only the
  0.6 mm between the cone's top and the train bridge; run `tools/fine.py`
  after touching the fusee, chain or bridge heights. `0371c16`
- **Chain's straight run cut into the barrel, up to 0.24 mm.** It joined the
  drums' lowest points, a true tangent only when their radii are equal; with
  the fusee smaller (most of the run) the line entered the barrel just past
  that point. It is now the drums' common tangent, leaving both `dl` past their
  lowest point, and the chain lies 0.013 mm off the barrel. The winding-stop
  pin, which the turned fusee wrap then brushed at full wind, now ends at
  −20.40 (was −20.2), still covering the stop-bar's thickness. Found by the
  barrel check in `tools/fine.py`. Keep: `fine.py` must report 0 barrel
  problems. `ba9634f`
- **Sustaining ratchet turned back when winding stopped, and the sustaining
  spring had no steady load.** In running the ratchet was put on the winding
  pawls' engagement nearest the fusee wheel, so the spring's deflection was
  whatever the fusee's phase left (−4.5° to +4.3°, stretched as often as
  loaded). When winding stopped the ratchet jumped to that engagement, backward
  past its pawl in about half the windings (up to 5°). Now the spring is at its
  loaded deflection in running (ratchet and fusee wheel turn together), the
  fusee sits `eps` past its `n` turns so its ratchet bears on the pawls, and
  when the key lets go the fusee turns forward to catch the pawls and the
  ratchet forward to reload the spring. The fusee also lagged its own square by
  up to 0.29° (it turned only when `setWind` ran); it now turns every frame.
  Keep: nothing in the maintaining work turns back except the sustaining
  ratchet's fall to its pawl as winding starts; `tools/maintaining.py` must
  pass. `da90e53`
- **Sustaining spring 0.05 mm into the fusee wheel's web.** It went unseen
  while both were one part. The spring is now its own part and 0.02 mm under
  the web. `da90e53`
- **Winding pawls cut up to 0.16 mm into their flat springs while winding.**
  The springs (42007) were built once, for the pawls' design angle, and stood
  still while the pawls swung out about 5° over the winding ratchet's teeth. `wpsGeo` in `movement.js` now rebuilds
  each spring from its pawl's angle in `update()`, its end 0.01 mm or less
  off the arm in every state. Keep: a spring that bears on a moving part
  follows it. `fine.py` can't see this, because a pawl and its spring are
  one part (`sratchet`), so measure it directly. `161b79b`
- **Mainspring drawn 0.1 mm thick and floating free in mid-wind; its inner end
  11° off the arbor's hook.** The parts list gives 0.0165 in (0.419 mm). Every
  coil's radius was interpolated at once between a wall pack and an arbor pack,
  so at half wind the whole spring hung as a loose spiral between r 6.5 and
  9.1 mm, touching neither arbor nor wall. The full-wind turn count (12.03) wasn't
  a whole number, so the inner end missed the hook by 0.03 turn. `mainspringGeo`
  now lays a 600 mm strip in two packs joined by one free turn, and running
  peels coils from the arbor pack onto the wall pack. The hook stands in an eye
  in the strip (`fs.MS.hookA`), and an anchor pin at the outer end bears on the
  brace. The spring is rebuilt only when the barrel has turned 0.002 turn. This
  replaces the "strip 0.1 mm thick" of the solid-parts entry. Keep: the turns
  fall by exactly the barrel's turns (`Tup - I(n)`); the hook and pin follow
  from `fs.MS`, not fixed angles; the strip stays 0.05 mm or more off the core. `e3ad654`
- **Model stopped at 56 h, but its chain holds 60 h** (finding 4). `RUN_H`
  (60 h, the fusee's 8¾ turns) now sets the run-down point, the power readouts
  and the fusee chart. The dial's UP–DOWN scale still covers the rated 56 h.
  Keep: use `RUN_H`, not a literal 56 or 60. `c2adc92`
- **Stop-bar moved by the wind count, not by the chain.** Sec. IV: the chain,
  wrapping onto the fusee, "bears against one end of the spring-activated
  winding stop-bar, the opposite end of which moves out". The bar slid out over
  the last quarter turn from `n`, lying clear above the chain with both ends
  inside the fusee's top, while the key walkthrough said the chain pushed it.
  The bar now crosses the top in a slot open to the rim, its nose down in the
  groove's top turn; the chain winding over the nose slides it
  (`barTravel`, from where the chain leaves the fusee), and its far end stands
  out past the rim to the winding stop, placed where that end is at full wind.
  Keep: the travel comes from the chain's path (`setWind(n, eps)`), not from
  `n` alone; the stop's place comes from `fs.stud`. `7970409`
- **Stop-bar slid in with nothing touching it.** Its chain end, 1.1 thick and
  level with the fusee's top band as the video reads it, stood 0.22 mm over
  the links where the chain meets it (the top turn 0.13 lower there than at its
  start), and the band covered the chain all round, so no link could reach it;
  `barTravel` slid it by a formula (the run's inner face taken rN / cos(a) out
  at the corner's resting angle), 0.1-0.2 mm off the incoming run as it moved.
  The chain end is now 1.5 thick (an estimate, against 1.1 ± 0.2 read; Sec. IV
  has the chain bear on it), its lower face 0.4 under the band's, the slot's
  floor and the recess cut to it (1.55 deep, inside the readings), and the
  travel keeps both end corners just outside the drawn chain (the incoming
  run's inner face ahead of where it leaves the fusee, the wound turn's
  behind), found by bisection; the bar's turn `al` is solved at the pushed
  corner's radius, so the stop is still first touched at full wind. Keep: the
  chain end reaches into the links' upper plates where the chain meets it; the
  band stays clear of the chain; the travel comes from the chain's drawn
  geometry, not an approximation of it. `f3e3c60`
- **Fusee too thin at the small end, its top too small.** The profile was
  illustrative (r 6.5 to 14, top plate r 5.4). The side photograph, scaled by
  the fusee wheel, gives the groove's floor 8.3 to 13.8 on the upper turns and
  a top of r 9.3; Fig. 28 draws the same proportions. The profile is now
  `r0/√(1−a·m)` fitted to those turns (7.95 to 16.8, 0.085 mm rms), and the
  top plate r 9.15. The chain grew to 656 links, 7.07 barrel turns, more than
  the mainspring took on its r 2.4 core, so the core is r 1.74 (7.64 turns).
  Keep: `app.js` takes radii and pull from `R.fs.rf`, never literals. `7970409`
- **Groove turned in rings, chain links lying flat.** The groove was a 0.4 mm
  ripple of a lathe profile, concentric rings the helical chain crossed, and
  the links were boxes 1.0 along the arbor by 0.34 radially, as if they bent
  about radial rivets. The fusee is now a lathe pushed out to a helical groove
  between thin flanges, as photographed, and the chain is figure-eight plates
  on edge, three deep, riveted parallel to the arbor (Fig. 38), its pitch line
  locked to the groove, so it can't sink into the floor as the tangent point
  drifts (up to 14°) or the fusee sits `eps` past its turns. The end pin runs
  parallel to the arbor (Fig. 28). Keep: the chain and the groove share `phi0`
  and `m`; the groove runs 0.12 turn past the chain's start and 0.04 past its
  end, or the run leaving the fusee cuts the top rim. `7970409`
- **Dashed ring round the barrel's caps.** The wall ran the barrel's full
  height, so its two ends lay in the caps' outer faces and z-fought them (a
  dashed ring on each cap with Edges on, 0.2 mm inside the drum's radius;
  `audit.py` listed both as z-fights), and the caps' flanges passed through it.
  The wall now runs between the caps' inner faces, and `barrel-clearance.js`
  finds the caps by their inner faces on its ends. Keep: no face of the wall in
  a cap's outer face. `0538794`
- **The chain's barrel end slid round the barrel.** The barrel was turned by
  the fusee's turns (`I(n)`), not by the chain wound on it from where it meets
  the barrel, so the chain's hook moved 8 mm round the drum over a wind, and its
  nose sat on the wall's outside with nothing to take it. `Ib(n, eps)` turns
  the barrel, the mainspring's turns and the power inset; the hook's end stays
  at `HKA` in the barrel's frame, its nose through a hole in the wall (Figs. 17,
  75). A link also dipped 0.013 mm into the drum at some train positions: the
  pitch line is 0.04 off it and the hook plate's middle on the pitch circle.
  Keep: whatever turns the barrel uses `Ib`; the hook stays in its hole over the
  whole wind. `3655b52`
- **Setup pawl's pivot screw from the wrong side.** It was drawn from the top,
  its head on the cover; the manual screws it into the barrel bridge before
  the bridge goes on (Op. 41, Fig. 80), and the top-view photograph shows only
  its small round end in the cover. Now from under the bridge; the pawl's
  spring is the long arc Fig. 80 draws. Keep: the pivot screw from below, its
  end flush in the cover. `8555124`
- **The sustaining spring drove the train for hours while winding at high
  speed.** A wind takes about 4 s on screen (17 s with the key) whatever the
  speed, so at 3600× the train ran on the sustaining spring for hours of model
  time, where Sec. IV gives it 5 to 10 minutes; the spring was drawn spent
  (`SMAX`) and went on driving. Model time now runs at most 10× while winding
  (`WIND_X` in `app.js`), so a wind is at most about 3 minutes of it, and the
  HUD says so. `SMAX` is the fusee wheel's turn in 10 minutes (9.3°), from the
  train, not a literal 10° figured for the old 60 h fusee. Keep: no wind
  outlasts the sustaining spring. `5fd993d`
- **Sustaining spring and the fusee wheel's recess not as on a real Model 21.**
  The spring was a 0.7 mm band round 250° at r 13.2–13.9, its free end pushed
  open by a pin on the sustaining ratchet, in a recess walled at r 15.2. The
  restoration video (27:26) shows a flat blued band 2.1 mm wide round about
  335°, against a wall at r 18.0, its fixed end a lobe pinned to the wheel and
  its working end, across a small gap, pinned to the ratchet (as the manual
  has it), and a raised disc and hub on the floor (Op. 26's two elevations).
  Now so: the ratchet's pin pushes the working end across the gap toward the
  fixed end, closing the ring (17° relaxed, 7.7° loaded), and the band bows in
  from the wall as it closes, keeping its length. Keep: each end pinned, the
  fixed one in the wheel's frame, the working one in the ratchet's; the gap
  closes under load. `65aff17`
- **Fusee wheel and sustaining ratchet hung on the bare arbor.** Both had
  r 1.05 bores on the 2 mm fusee arbor. The restoration video shows a steel
  collar r 2.7 on the arbor below the fusee (28:08–28:35) and the fusee wheel's
  bore r 2.7 (27:26); Fig. 69 has it greased "above ratchet wheel". Now the
  collar runs from the fusee's large end to the end plate, 0.02 past the wheel
  so the plate bears on it, and the winding ratchet, the sustaining ratchet's
  web and the fusee wheel have r 2.75 bores round it. Keep: the wheels free on
  the collar, not on the arbor. `ec2e80d`
- **Fusee top plate's screws beside the arbor, and no collar over it.** The
  screws stood at r 3.2. The restoration video, face-on at 13:30, shows them
  opposite each other near the plate's rim (r 7.0) and a steel collar r 2.9 on
  the arbor at its centre. Now so; the screws go into the slotted layer's rim
  either side of the slot. The collar's height (1.0) is estimated. Keep: the
  screws clear of the stop-bar's slot and of its spring. `2aa6e7a`
- **Sustaining ratchet drawn steel, its springs' screws from the pawl side.**
  The restoration video (28:32–29:14) shows the wheel gilt brass, with the
  winding-pawl spring screws' slotted heads on its underside; Fig. 28 draws
  one put in from below. Now so: the screws pass through the ratchet (clear)
  into the springs' feet (tapped, 0.47 thick, 0.03 under the fusee's face that
  turns over them while winding). Keep: the screws from the underside; the
  feet thick enough for 0.4 mm of thread (`bom.py`). `69b2e97`
- **Fusee end plate a plain washer, the taper pin under it, and (after the
  arbor's collar) too small to hold the wheel on.** Ops. 27–29 give the plate
  notches that the taper pin lies in; Figs. 28 and 69 draw it about 0.37 of the
  fusee wheel across. It was r 2.6 with the pin below it, and once the wheel's
  bore became r 2.75 nothing held the wheel. Now r 7.0 (1.5 clear of the centre
  wheel), against the collar's end, with a slot across its outer face in which
  the pin (9.6 long, as Fig. 28 draws it) lies. Keep: the end plate larger than
  the wheel's bore. `bb3086e`
- **The fusee assembly 12 % too large.** The
  side photograph's fusee profile and the restoration video's wheel recess,
  sustaining spring, ratchets and pawls were all read against the fusee
  wheel's tips taken as 40.87 mm; at the plate's scale the wheel is 36.0–36.9
  (the model's now 36.1, module 0.392). They are scaled by `FK` (0.882):
  the cone 7.01–14.82. The chain, barrel and arbor keep theirs. Keep: a size
  read against the fusee wheel scales with `FK`; `tools/maintaining.py`
  reads the ratchets from `WRT`/`SRT`. `6d1bd37`

- **Setup ratchet with 52 teeth and a short click spring** (Review-results.md,
  BOM comparison, still open 2; `Orel_comments.md`: "Does the setup ratchet
  modelled correctly?"). On C Spinner's video (11:46-12:22, 38:28) the ratchet
  has about 42 teeth (pitch 8.3-8.8 deg; certain it is well under 52) and the
  click's spring wraps about half a turn round it from two steady pins to the
  click's back, as Fig. 108 draws it; the model's ran about 120 deg, and the
  cover's feet, rings round its screws, stood where a longer spring passes.
  Now 42 teeth on the same pitch radius (the click's tip where the
  photograph has it), the spring a band on edge on the bridge, up to the
  click's height, round half a turn at r 10, and the feet steps under the
  cover's ends, 0.5 mm further out than its screws. The click itself (its
  pivot, length, and the way it holds) agreed with the video. Keep: the
  spring's end on the click's back at the click's height (bom.py's `on`). `07b8a00`

- **Fusee's stop-bar slot across the hub, its end plate steel and flat, its
  winding ratchet 40 teeth** (Review-results.md, the fusee assembly, 3, 5, 6).
  On C Spinner's video (17:50-20:27, the fusee taken apart) and in Figs. 28
  and 69: the slot runs beside the hub 3.5-5 mm off the axis (it was 2.0, cut
  through the hub), the stop-bar's spring a round wire in an open C of about
  270 deg round the hub; the end plate gilt brass with a raised boss round its
  hole, the taper pin's slot across the boss; the winding ratchet about 36
  teeth. Now so: the slot 3.6 mm off the axis, the hub r 2.4 with the
  spring's groove round it, the spring out of the groove where the slot opens
  it and along to the bar's tab; the nose's face set where the chain meets its
  outer corner (the chain met that corner first once the slot moved out);
  the plate gilt with an r 2.2 boss; 36 teeth on the old pitch radius. Keep:
  the spring leaves the groove past the tab's reach at full travel; the nose
  set by its outer corner (`xf`). `daa45cb`

- **Winding-pawl springs short bent strips** (Review-results.md, the fusee
  assembly, 7). Figs. 28 and 69 draw them as long arcs, and C Spinner's video
  (19:12, 18:40, 19:15) shows each a thin arc of about 150-170 deg round the
  sustaining ratchet's middle, held at its far end by two screws, the two
  nearly round it. Now so: each from a foot about 150 deg round (toward the
  side its pawl's tip points) back along r 12.1 FK to the arm, its last
  stretch rebuilt as the pawl rides the teeth; the strip starts at the
  foot's inner end, clear of the foot's screws. The pawls agreed with the
  video. Keep: the springs' feet and screws at `WPS` (the wheel's holes are
  cut there). `69992a0`

- **Barrel 13.2 mm tall and the train bridge's cut round it r 19.2**
  (Review-results.md, Elsewhere 23). Side-on on C Spinner's video
  (33:09.5-33:35) the barrel's height to radius is 0.95, camera-free: about
  16.5 mm tall. The cut, fitted with its centre and radius free (23:30,
  13:49.5), is r 21.0-22.0, centred about 2 mm further out than the barrel.
  Now the barrel 16.5 mm tall from 2.4 mm over the plate (0.28 over the
  centre wheel), the cut r 21.0 centred 24.8 mm out (its low end, where the
  bridge keeps 0.7 mm round pillar 0's screw). Keep: `BB_LO`, `TB_CUT`,
  `TB_CR`; fine.py's barrel-arbor entry sized for the taller barrel. `919cc84`
- **Barrel a third too small** (Review-results.md, Elsewhere 23). It was r 13.5;
  on C Spinner's video its top lip fits r 18.3 (23:30; 17.4-19.6 over the
  focal lengths the frame allows, certain above 14.5), as the train bridge's
  cut round it (r 19.2) and the mainspring's coil spacing had suggested. Now
  r 17.6 under a 0.7 mm lip, its cap 0.7 wider, its lip, brace and pin
  inside following its radius; the mainspring 1,064 mm by the half-room rule
  (the video gives about 1.1 m); the chain 4.85 barrel turns, the set-up
  held at 0.37 turn (it was pinned to the spring's most, which the longer
  spring made 6.4 turns). Keep: the barrel's inner parts follow `c.Rb`; the
  set-up a turn fraction, not the spring's range. `2e0db4f`
- **The barrel's wall 0.2 mm thick and its brace a 40° strip** (SHAPE-PASS.md, 109-5, 109-6).
  Both estimates, against the video: the end face's inner edge is 0.874-0.905 of
  its outer on three frames of two movements, and the inside is plain to the
  floor (KLUwI2UUCMQ 16:54), so the wall is 1.95 (0.11 of r 17.6) all the way;
  the cap's screws go into its edge, and the brace runs about three quarters
  round (Royal Museums Greenwich's catalogue). Now drawn so, the spring's pin in
  a window through the brace, the barrel's hook at its end; the mainspring
  re-solved in the smaller room (`tools/mainspring.py`) and 13.55 wide (15:54).
  Keep: the spring's room follows the wall (`MSPRING.Rw` in core.js and
  `tools/mainspring.py` together; regenerate `js/mainspring.js` after either);
  its length 1,064, not half the room (857 would overstress it: `physics.js`).
  `f29d657`
- **The winding ratchet's screws at r 3.0, standing proud in the sustaining ratchet's open centre** (SHAPE-PASS.md,
  109-11, 109-14). The video has them at r 4.6, flush in counterbores (23:30;
  another movement 4.86, SNLqsS9wrrM 7:11), and the sustaining ratchet solid
  from its bore r 2.92. Now drawn so, the fusee's boss widened for the threads
  and the collar stepped under the sustaining ratchet (inferred). Keep: the
  counterbores inside the teeth's roots (r 6.08); nothing of the winding ratchet
  stands above its face. `f2c5053`
- **The setup click's tip 0.1 mm in the ratchet's teeth** (Review-results.md, BOM
  comparison 3): its pivot 9.25 mm out, from the top-view photograph. At the video's
  10.25 (11:58), its tip at the teeth's root 32 deg round, it seats 0.52 mm. Keep:
  bom.py's setup click check wants it seated over 0.3. `12badbb`
- **The fusee's large end flat, the dust seal's flange round** (Review-results.md, the
  fusee assembly 5; BOM comparison 2): the large end now has its rim round the recess
  that holds the winding ratchet (18:20), 0.4 tall so it clears the sustaining ratchet
  and its pawl by 0.1 (fine.py found 0.75 in both); the seal's flange its shallow bite
  between the screws (6:29). `12badbb`
- **The fusee's top plate holed only for the arbor, its collar sitting on it**
  (Review-results.md, the fusee assembly 3; Fig. 28): on the restoration video the
  plate comes off over the collar, which stays on the arbor (19:58-20:00), so the
  collar, r 3.0, now rises from the hub through a hole of r 3.05 and 1.0 past it.
  Keep: the collar inside the stop-bar slot's edge (zHi) and clear of the spring in
  the groove under it. `d135f96`
- **The fusee's collar 1.0 mm over the top plate** (Review-results.md, Figs. 21, 22, 28 and
  29): side-on at 20:00, against the groove's pitch, it stands 2.8 mm over the top
  layer; now up to 0.05 under the barrel bridge (`collarT`), the arbor's shoulder
  under its bushing. Keep: read lengths along an arbor against the fusee's pitch, not
  against a polished part's silhouette on the blue mat, which reads narrow. `7f994a6`
- **Sustaining pawl's spring invented, and its arbor 2.7 mm round from the
  real one.** The spring was a collet near the arbor's top with a wire across
  to a steady pin in the train bridge; C Spinner's video (35:37.5-36:29) shows a
  straight wire set upright in the pawl beside the arbor, rising under the
  bridge, and a hub at the arbor's foot. The arbor stood at 21.35 mm and 74°
  round the fusee; the video puts it at 21.8 mm and 67°. Keep the spring the
  upright wire (bent by the pawl, `R.spWire`) and the arbor where 36:15 puts it;
  its hub needs the 21.8 mm to clear the fusee wheel's tips. Its pivot hole in
  the train bridge was r 0.70 between the faces (`polyGeo`'s bevel widens a
  flagged hole there); it is lined to r 0.52 straight through, as `bom.py`'s
  running fit wants (it had passed on 0.12 mm of the face). `4ab4b46`
- **Sustaining pawl a straight bar where the real one is a curved blade.**
  C Spinner's video (36:15, its two edges put through the fitted camera) shows a
  blade about 10 mm long, up to 3 mm wide, bowed away from the ratchet, with a
  short straight end face; the model's was a 1.2 mm bar. Its outline is now one
  smooth curve through those measured edges (`SPN`, `SPE`), the tip's corner on
  the ratchet, the spring wire in its root on the bowed side; the arbor at 69°
  (a second reading of its foot, 14:06 overhead, gives 21.7 mm at 71°). A first
  try that widened the old bar at a few points looked wrong; draw the blade from
  the measured edges, not by reshaping `pawlPts`. `88648e5`

- **The fusee chain's pitch and the winding pawls estimated.** The chain's
  pitch 1.7 mm (side photograph and 23:45; was 1.0), the winding pawls 2.0 wide
  (19:12; were 0.9). The sustaining ratchet's 120 teeth and the barrel
  arbor's square checked, unchanged. Keep them measured (SHAPE-PASS.md, 6). `9cd255c`
- **Mainspring didn't coil and uncoil as a real one does.** It was drawn
  as two packs, on the arbor and on the wall, joined by one free turn of a stock shape: fully wound, ten
  coils still lay on the wall and four on the arbor, and the coils never spread across the barrel. Its
  shape is now solved (`tools/mainspring.py`, `js/mainspring.js`): the strip's least bending energy from
  its natural curve, measured on the free spring (KLUwI2UUCMQ 32:18), its coils pressing on each other,
  its inner end on the hook and its outer along the brace; the page blends the solved states a quarter
  turn apart, each piece of steel between its places in them. Its turns now count from the solved
  slack (12.5), not from the two packs' fewest, and it is set up where its solved pull falls over the
  wind as the fusee's measured profile evens out (1.62 turns; the 0.37 guessed before let it fall to
  about 0.2 of full wind against the fusee's 0.473). Keep: the spring's shape comes from the solve, not a
  drawn law; after changing its length, thickness, core, barrel or free curve, rerun the tool; states
  half a turn apart blend 3 mm out and let the coils touch. `04ff466`
- **The chain grew 1.6 mm over the wind** (kinematics audit, 11 October 2026). `Ib` turned
  the barrel by the chain's arc paid off the fusee, but the straight run between the drums,
  their common tangent, lengthens from 35.85 to 37.42 mm as the fusee's radius grows, so the
  barrel over-turned 0.013 turn (4.8°) by run down, the links crept round it and the hook's
  plate stretched and shrank. The barrel now takes the arc less the tangent's gain (`Iw`, now `wrapB`), and
  the chain keeps its length to 0.03 mm (586.40 mm, end pin to hook) over the wind; the
  chain's barrel turns over the run are 4.656 (were 4.670). Keep: whatever turns the barrel
  uses `Ib`; `tools/invariants.py` checks the length (`chainLen`). `273f317`
- **The fusee's torque taken on the groove's floor, and two different mainsprings**
  (kinematics audit, 11 October 2026). The torque was the pull times the groove's floor
  radius, though the chain pulls along its pitch line, 0.49 mm further out (7.51 to 15.22
  where it leaves the fusee, not 7.0 to 14.8), and the set-up was matched to the floor's
  ratio (0.473, not 0.490); `tools/physics.js` mixed the two (the floor on the fusee, the
  pitch line on the barrel). And the drive (amplitude and rate) came from an illustrative
  pull, linear and 3 % steeper at each end, while the spring drawn and its set-up came from
  the solved one (`msPull`). The drive is now the solved spring's pull at the barrel's turns
  on the chain's lever where it leaves the fusee (`fs.pull`, `fs.lever`, `fs.torque`), the
  set-up matched to the levers' ratio (1.25 turns past the slack, was 0.99); the torque is
  level within about 2 % (0.986-1.021 of its mean). `pullB`, the going barrel for
  comparison, is the same spring. `physics.js` takes the pitch line: 0.93 N·m fully wound
  (was 0.90), 2.36 GPa, 64-100 µN·m at the escape wheel. Keep: one spring, `msPull`, for
  the drawing, the set-up and the drive; levers on the chain's pitch line (`rc`). `c519c71`
- **The drive stopped dead at run down with chain still on the fusee** (kinematics audit,
  11 October 2026). At `RUN_H` the chain still wrapped 0.032 turn of the fusee (the tangent
  point drifts round as the fusee's radius grows), yet the drive fell from full to nothing
  at once. Past the tangent the chain's end pin swings on toward the barrel and the chain
  runs straight from it, so the lever falls to nothing where its line passes through the
  arbor (`geo` in `makeFusee`: 65°, 1.2 h). The pin (`ME`) is now 8.54 turns down the groove,
  placed so that rest is at `RUN_H`, the manual's 17½ half turns from full wind; the drive
  tapers with the lever from 55.1 h, and the train stops about 5 minutes before `RUN_H`,
  under the 0.14 of the drive that keeps the balance above `ESC.AMIN`. The chain is 566 mm
  (was 586) and the set-up matches the levers over the 4.51 barrel turns the chain takes to
  leave the fusee. Keep: the drive's end comes from the chain's geometry, at `RUN_H`. `9d9da23`
- **Winding pawls never touched their teeth in running, and the pawl seat could pass
  through a tooth** (kinematics audit, 11 October 2026). `phaseAgainst` found the winding
  pawls' rest by the radius of their tip corner, which on those pawls stood 0.6-1.0 mm
  outside the teeth: at `WPH` they sat 0.11-0.16 mm into a 0.29 seat, and fully seated
  their end reached 0.30 mm into 0.82 mm teeth. `seatPawl`'s bisection over its whole
  range could return a seat on the far side of a tooth the pawl would have met first
  (0.25 mm deep where the reachable seat was 0.01), and in about 8 % of winds the sustaining
  pawl held on the top of a face (0.08-0.17 mm) for it. The winding pawls are now traced on
  C Spinner's video (19:12: a lever with an eye r 1.1 and a square end 2.1 long that lies
  along a radius of the ratchet), `phaseAgainst` takes the outline's nearest point (`deep`),
  and `seatPawl` turns the pawl in from outside to its first touch, keeping the teeth's tips
  out of its outline too (they stood up to 0.05 mm in between its test points). The pawls
  now go 0.48 mm into the winding ratchet's teeth at `WPH`; the sustaining pawl 0.33 of 0.54.
  The setup click's seat moved 0.14° out with the tips kept out. Keep: a pawl's seat is the
  first touch from outside; `tools/maintaining.py` measures the gap with the tips. `5489422`
- **Ratchet locking faces leaned back** (kinematics audit, 11 October 2026). The ratchets
  dropped from tip to root over 0.07 of a pitch, so a pawl's load pushed it outward (1:10)
  and only friction held it. The winding and sustaining ratchets' faces are now radial
  (`ratchetProf(…, radial)`, gearGeo's `ratchet:'radial'`, the back the exact chord gearGeo
  draws), as the winding ratchet looks at 18:20 and the winding pawls' square ends lie at
  19:12; the load on each pawl now draws it in. The setup ratchet keeps its leaning faces
  (not changed here). Keep: the maintaining work's profiles radial and drawn as computed. `5489422`
- **Winding began by dragging the winding pawls back over their faces** (kinematics audit,
  11 October 2026). As the key started, `holdBack` dropped the sustaining ratchet back to its
  pawl (up to 2.6°) in one frame while the fusee had not moved, so the winding pawls on the
  ratchet were pulled back over the winding ratchet's locking faces (their depth 0.159 to
  0.01-0.04 mm in 33 of 40 winds). The spring now pushes the ratchet back with the fusee,
  the pawls still on their faces, until the sustaining pawl catches it; only then do the
  winding pawls ride over the teeth. `holdBack` is now the next place a face meets the pawl,
  every tooth from `phaseAgainst`'s (its walk stopped on a tooth's crest in about one hold
  in ten). Keep: `tools/maintaining.py`'s `lift` check. `240a80a`
- **The catch when the key let go took (motion) mod one tooth, and its hours were never
  spent** (kinematics audit, 11 October 2026). `eps += wrap(target - eps)` turned the fusee
  forward by the motion modulo a winding tooth, and by a whole tooth when nothing had moved;
  and the fusee's turn to catch the pawls and reload the spring came off no mainspring, so
  `eps` grew without bound over partial winds. The catch (`catchAt`) is now the gap to the
  pawls (none if on them) plus the reload to the drive's balance, exactly; `R.release`
  foretells it and `app.js` (`windEnd`, where the key lets go) adds its hours, so over 40
  partial winds `eps` stays within 6.5°. Keep: `windEnd` wherever winding stops. `240a80a`
- **The sustaining spring dropped the drive to 0.8 the moment winding started** (kinematics
  audit, 11 October 2026). Running at its loaded mark it carried the whole drive, nothing
  banking it (the parts drawn have none, and the manual has it "under load during the entire
  running cycle"), yet `driveNow` gave 0.8 of the drive (`SUS`, estimated) as the key turned.
  The spring now pushes 1 - d / SMAX of the 12-hour drive (`R.ssF`), so it starts with what it
  carried and falls as it relaxes; running, it sits where it balances the fusee's drive
  (`R.drvN`, the set included). Keep: the drive while winding is the spring's push. `240a80a`
- **Run down, the spring stayed loaded while the drive vanished** (kinematics audit,
  11 October 2026). At run down `driveNow` gave 0 while `update()` kept the sustaining spring
  at full load. Now the spring follows the fusee's drive down the run-down taper (1.2 h,
  slower than its 10 minutes, so its pawl never holds); a sudden fall of the drive (the
  slider set to run down, a set taken) lets the spring push the ratchet back to its pawl and
  drive the train alone, the fusee standing (`canDrive` holds the train only when neither
  drives); winding a run-down movement starts from the spring's state. Keep: `canDrive`
  from `driveNow`. `240a80a`
- **Setting the hands dragged the maintaining work through its teeth** (kinematics audit,
  11 October 2026). Setting the time (the field, Now) jumps the train, so the sustaining
  ratchet (`srA = gA`) and `eps` jumped with it, backward too. `update()` now takes a jump of
  the fusee wheel (back, or more than 0.25 rad in a frame, or `s.reset`) as a set: the
  ratchet moves with the wheel, the spring as it was (a held ratchet on its pawl's tooth),
  and the fusee stays on its turns on the nearest tooth. Keep: `maintaining.py`'s set case. `240a80a`
- **The key walkthrough let the mainspring down at once when under 0.2 h had run**
  (kinematics audit, 11 October 2026): `kwStart` set `hrs` to `RUN_H` to have something to
  wind, a run down that no chronometer does. With *From run down* unticked it now says the
  chronometer is already fully wound (less than a tenth of a half turn to go); ticked, the
  walkthrough still starts from run down, as asked. `240a80a`
- **The mainspring the parts list's 0.419 mm on an estimated core r 1.74, against the videos' coils and core**
  (OPEN-QUESTIONS.md 1, the owner's decision of 12 October 2026). The coils' pitch read round the whole turn on
  KLUwI2UUCMQ's let-down spring (1/41.0-1/41.8 of the measured barrel's inside radius, 15:54, 33:06) puts the strip at
  most 0.394 mm in the measured barrel, its L/t about 2,700; the core reads r 4.8-5.7 on two 1941 movements (33:20.5,
  33:06, TN24H 0:16), on which the parts list's strip is coil-bound short of the fusee's turns. Now the strip 0.394 ×
  1,064 on the core r 4.9 (`MSPRING`, `tools/mainspring.py`), the eye as 15:54 reads it (7.2 × 5.2, 2.2 off the end)
  with the hook against its end; re-solved: slack 13.25 turns, set up 1.01 (Op. 53: about one), fully wound 18.87,
  coil-bound past 19.0; `write()` leaves out states past coil-bound. Keep: `MSPRING`, `mainspring.py`'s constants and
  `fine.py`'s `CORE` together; the set-up from the fusee's rule (`fs.MS`), not a number; the parts list's 0.0165 in
  stays named as the open conflict wherever the thickness is stated. `8e95032`
- **The catch when the key let go foretold at the wrong drive** (maintaining.py, 12 October 2026). `R.release` reloaded
  the sustaining spring to the drive at the fusee's turns before the catch, `update()` to the drive at the turns after
  it (the catch's hours spent), so in the run-down taper it foretold the catch up to 0.02° long, past `maintaining.py`'s
  2e-4 rad once the new mainspring's pull moved it. It now finds the catch at the drive where its hours leave the fusee.
  Keep: `R.release` and `update()`'s let-go take the drive at the same turns. `9fa5f35`

- **The setup ratchet sat on a round bore under a collar, its faces radial.**
  It was pressed on the barrel arbor's round body (r 1.4) with an unsourced
  collar r 2.3 over it and the square starting above that: a pressed fit that
  would have to hold the mainspring's 0.78 N·m and couldn't come off to let it
  down. KLUwI2UUCMQ shows a square hole (23:30, the mat through it) and the
  square rising straight from the ratchet's face (11:58, 38:25). The ratchet now
  rides on the arbor's square (2.2 across the flats), which turns with it, and
  the collar is gone. Its locking faces are drawn undercut 4.5°, the middle of
  the 3-6° measured (38:26, `ratchetface.py`): the click's draw rose from 4.2° to
  8.7°, past oiled steel's friction angle, so the load seats it (`ratchets.js`).
  Keep: the setup ratchet on the square; its faces undercut (`SRU`, gearGeo's
  `uc`, mechanisms-check.js's tilted normal). `ca79d00`

- **The sustaining spring ran as one thing and was drawn as another.** The
  model ran it linear, carrying the whole drive unbanked and spent after ten
  minutes, while its drawn section (an estimated 1.13 mm band, 17° gap) was a
  third as stiff: made so, it would have closed solid and pushed 67 % of the
  drive; and no band the 1.8 mm recess holds is stiff enough to carry the drive
  unbanked. The period's chronometers make it a split ring weaker than the
  drive, held closed on its banking in running (Gould 1923, pp. 47-48, 238;
  Glasgow 1885, pp. 65, 106), and so it is now: its gap 20° as measured (27:26;
  17° estimated before), banked with its lobes 0.5° apart, pushing 0.88 of the
  drive (`SPU`) from a 1.25 mm band (`SSH_B`), which `sustaining.js` checks by
  Castigliano; it keeps the balance over a turn 8.3 minutes (the manual's five
  to ten) and runs the train 18. Keep: `SPU` what the section gives; the spring
  weaker than the drive; `R.ssF` = `SPU` (1 - d / `SMAX`); app.js, essay.js,
  maintaining.py and montecarlo.js take the push and travel from movement.js. `d43106a`

- **The sustaining pawl, as traced, was pushed out by its load.** Its end
  face (KLUwI2UUCMQ 36:15) lay across the next tooth's tip, 42.7° off the
  locking face, so the tooth's tip corner met it and the load's line ran
  outside the pivot: held only by friction above μ 0.19, more than oil gives.
  The end is now drawn fitted, as a maker stones it: cut along the tooth's face
  through its tip corner with 4° of relief above it, so the corner bears on the
  face 0.38 mm into the teeth and the load draws it in at 36°
  (`fitEnd`, `SPF`). Seated from where it was, the filed point could stop on
  the tooth it rode over when the ratchet comes back a tooth in one frame, so
  while it holds it is seated afresh. Keep: the pawl's end fitted; it holds
  0.38 mm deep at every hold (`maintaining.py`). `ee7143d`
- **Stop-bar stepped like two bars.** Its stop end was drawn 0.7 thick against
  the chain end's 1.5 (the chain end deepened to an estimate so the chain bears
  on it, the stop end left at its absolute reading), a step of 0.8 that made it
  look like two levels where Fig. 28 draws a plain bar. The frames give the
  step as a ratio within one image: the stop end 0.8 of the chain end
  (20:04.27, 26:23.75). Now 1.2 against 1.5. It was also four stacked
  bands and a block for the spring's hole, whose seams drew it as pieces glued
  together; now one solid (its side profile carried across, the ends slanted,
  the hole blind). Keep: the stop end 0.8 of the
  chain end (`TS` 1.2, `TC` 1.5 in `movement.js`): change them together;
  the chain still bears on the chain end at full wind (`maintaining.py`) and
  the stop end clears the chain (`fine.py`); the bar stays one mesh. `87fe19a`
- **The seal ring and its spring were shut inside the dust seal.** They sat in a groove round the seal's bore, where they
  could neither come out (Op. 30) nor go in (the reassembly's Op. 52). KLUwI2UUCMQ 12:33.0-12:39.0: the seal's chamber opens underneath, the ring a
  washer r 4.7 on the arbor's shaft, the spring standing on the barrel bridge round the bushing; the overhaul's host for both is the barrel bridge.
  Keep: the seal lifts off them; bom.json has the spring on the barrel bridge (42061). `facea7a`
- **The winding ratchet wheel couldn't come off the fusee.** The sustaining ratchet rode a step r 2.87 on the collar,
  inferred from its bore, under the winding ratchet (bore 2.43), which had to come off over it (Op. 43). The step is gone: the sustaining ratchet rides
  the fusee wheel's hub, a pipe r 2.87 (Op. 20 greases "the outside of the hub"; Fig. 71 assembles them together), and the winding ratchet's bore,
  confirmed at 23:30 (r 2.31, no hub), comes off the straight collar's lower end, its screws ahead of it (`UP` in overhaul.js). Keep: nothing on the
  arbor below the winding ratchet wider than its bore. `79cfc2f`

## Plates, bridges, screws and arbors

- **The Wempe's set-up click and centre arbor read two figures wrongly.** The click's "5,7" is the thin circle about its hole, tangent
  to the base (the base 2.85 under the hole, not 2.81 scaled), and its "85" the beak's end face at 85° (82.4° built); the centre arbor's
  "1,6 −0,1" (05 05 03-2) is the wheel's seat alone, not seat and riveting collar, so the seat is 1.55 and the collar 0.255 (1.45 and 0.355).
  Keep: the click from 05 08 05-2's figures (the hollow meets the base 9.69 from the hole, the "9,7"); the seat inside 1.5-1.6. `9b187fc`, `5d4f671`
- **The Wempe's escape endstones and plates differed from Wempe 3955's** (16 October 2026, the audit of
  3.00.00). The upper escape endstone's setting was closed under the plate's lip with its screws in from
  inside, and the lower was a stadium cap screwed over the stone; 3955 shows round gilt settings with the
  stones in them, the upper's spigot through the lip's Ø 4.5 H7 (its fit's purpose), its screws in from
  outside, the lower flush in a seat with the screws' heads lapping it. The cock's endstone showed no
  stone. The hand setting's holes 14-18 and window, which the sheet strikes through, are drilled in 3955's
  plate; the detent block's pin holes go through and are countersunk; hole 4 has an oil sink; the plate is
  engraved and the balance arm stamped RGG. Keep: the upper screws' heads stay low (0.3) under the balance's
  rim, which passes 0.47 over the plate, and they lift with the plate in the Exploded view (headOn); a
  countersink or sink shares its circle with the hole under it (stacked features), or solidGeo leaves it
  open. `4e06f34`, `7a4bd48`
- **The Wempe's frame read off its sheets wrongly in four places** (15 October 2026, a survey of the parts against their works drawings). The
  barrel bridge's chord was drawn square to hole 45's line, its "7,7" read along the chord to pin 41 and its "5" as the top corner's offset,
  where both figures' extension lines run parallel to an edge: 42 is 7.7 from the chord (with 45's 7 that gives the sheet's 24 to 0.002) and
  48 is 5 from the short edge (it was 8.29 and 4.5). The top plate's pocket N-O was a constant 8 wide where its dashed edges are the common
  tangents of the opening's r 5 and 51's r 4 (10 narrowing to 8). The fusee bush's fits were swapped: T6 is the taper above the flange, which
  the dust bush is pressed on, g6 the spigot that slides into the plate. The intermediate bridge had Ø 6.2 sinks at 38 and 35 the section
  doesn't draw: a 45° mouth down to the bush at 38, and at 35 the seconds jewel's setting fills the bridge's hole (bore 3.7, open below the
  jewel). Keep: each figure on the edge its extension lines run along; fusee bush g6 in the plate, T6 under the dust bush (fine.py's
  dustBush x fuseeBush); the pocket tapering; no counterbores at 38 and 35. `b4450e1`
- **Lower train bridge on the wrong side.** It belongs on the dial side of the
  pillar plate (Figs. 29, 67, 110). `7a91d18`
- **Arbors ending in nothing.** Every arbor now ends in a bushing or jewel. The
  fusee arbor reaches the wind-indicator pinion, and the winding square joins the
  arbor through the dust seal. Keep: `tools/audit.py` should report no new loose
  arbor ends. `cc70482`
- **Balance cock: two overlapping screws.** The parts list (42192) has one.
  The cock foot also shared its top face with the cock (z-fighting). `cc70482`
- **Balance cock foot overhung.** It now stands on the train bridge beside the
  barrel bridge, with its screw at the photographed position. `84a7645`
- **Balance upper endstone cap overhung the cock's nose, one screw in the
  air.** The traced nose passed 0.7 mm from the staff (a 2.4 mm boss had been
  added round the setting), and the cap, a 7.4 mm plate running toward the
  nose's tip with its screws 3.6 and 2.2 mm off the staff, stood past the edge;
  its outer screw's thread hung below it over the hairspring. The cap is now as
  the top-view photograph shows it: a plate 7.6 × 4.6 mm along the cock's
  straight edge, round at the nose's end, its endstone in a gilt setting at the
  centre and its screws 2.75 mm either side; the nose is the hull round it,
  0.9 mm clear (`hullSplice`). Keep: the cap and both its screws on the cock,
  with metal all round. `polyGeo` warns about holes crossing the outline, not
  holes wholly outside it, so check a moved screw against the outline by hand.
  `5ac87a7`
- **Balance upper endstone cap a flat D-shaped plate.** Round at the nose's
  end, square at the foot's and off centre, with a small flush jewel in a gilt
  ring and its screws' heads standing 0.4 mm proud. C Spinner's video (5:51,
  41:58, 42:03, 42:08) shows a plate symmetric about the staff, 7.2 × 4.6 mm,
  its corners rounded more at the nose's end, a polished conical oil sink 3.1 mm
  across in the setting down to the endstone, and the screws' heads sunk flush
  in counterbores. The cap is now that, one closed solid (`cbGeo`, a plate
  with counterbored holes). Keep: the cone and the flush heads; the screws'
  counterbores 0.1 mm inside the plate's ends.
  `52d4598`
- **Balance cock a thin plate on a small post; the barrel bridge under it.**
  The cock was a 2.6 mm crescent plate held 11 mm up on a foot under one
  sector, with the barrel bridge running on under its outer half. In C
  Spinner's restoration video (41:58, 23:45, 2:36; `References/VIDEOS.md`) it
  is one solid block: its polished outer wall follows the rim the full 14.2 mm
  down to the train bridge, and only the nose is an arm over the balance. With
  the cock off (6:47), and on the bridge laid flat (23:30), the barrel bridge's
  horn ends at the cock's straight edge. The cock is now that block
  (`stepGeo`: the outline at the top, the body outside the 17.7 mm circle round
  the staff), with its screw's head in a counterbore and two steady pins in the
  train bridge, and the barrel bridge's horn ends just short of it. Keep:
  the cock stands on the train bridge, in the barrel bridge's opening; its body
  clears the balance's sweep (`fine.py`). `3312b3b`
- **Barrel bridge without its far horn; its screw drawn as the train
  bridge's.** The model cut the barrel bridge on a chord at the 6 o'clock
  side and drew a train-bridge screw "with no pillar" at (−8.5, 27.7). The
  real bridge runs on past the balance to about 100° (the top-view
  photograph, C Spinner 23:30), and that screw is proud of it: the barrel
  bridge's screw into the train bridge (gone with the bridge off, BunnSpecial
  12:05). The horn is drawn with that screw at (−11.07, 26.46) and clearance
  holes over the train bridge's screws at pillar 0 and (29.24, −12.28),
  which is now the train bridge's third screw (the one without a pillar). The
  detent support block's screw, which the horn now covers, goes in from below
  (Op. 81), and the locking arm's screw moves 5° to clear the horn. Keep:
  sunk screw heads in the photograph are the train bridge's, proud ones the
  barrel bridge's. `e1244db`
- **A corner in the balance cock's concave edge.** Where the nose, widened
  round the endstone cap, met the traced edge, the concave edge turned 50° at
  a point; at 41:58 and 6:29 it is one smooth curve from the nose to the
  horn. It is now a cubic tangent to both, within 0.43 mm of the traced points,
  and the arm's underside sweeps down into the body in a cove instead of a
  step. Keep: the cove stays above the balance's sweep (`fine.py`) and the
  hairspring keeps under the flat part. `45f9515`
- **Train bridge opening round the balance too big.** The centre and escape
  pivots fell in the hole. The opening was reduced; it is r 8.0 after the
  escapement change. `84a7645`, `7328e67`
- **Sustaining pawl arbor didn't span plate to bridge.** It was moved 6° and
  its pivot put in solid train bridge. `cc70482`, `84a7645`
- **Holes crossing outlines went unnoticed.** `polyGeo` / `discGeo` now warn
  when a hole crosses an outline or another hole. `84a7645`
- **Train bridge covered the fusee.** It was a full disc, so the winding stop
  was a pin through a hole in the train bridge and the stop-bar lay in 0.6 mm
  on a turned cap. Figs. 24, 29, 67 and 77 show the fusee open to the barrel
  bridge, which holds its upper bushing. The train bridge now has a pocket round
  the fusee's top (under the barrel bridge, where the top-view photograph shows
  the train bridge), the winding stop is a stud from the barrel bridge, and the
  fusee's top has its slotted layer, stop-bar spring and top plate. This
  replaces the "0.6 mm" note in the stop-bar entry above. Keep: the stop-bar
  sweeps the pocket over the last quarter turn; if the bar, its travel or the
  pocket changes, `tools/fine.py` must still report no train-bridge contact. `da90e53`
- **Train bridge's notch and horn traced on a loose drawing.** The edge came
  from Fig. 67 through an affine fit, then was pushed off every hole and
  smoothed 60 times: the horn ended in a round bulb 7.5 mm from the centre,
  the notch round the fusee was wavy and its mouth a spike to the rim at −40°.
  C Spinner's video (23:30 flat, 13:49.5 turned over, each put on the face by
  `video.py anchor`) shows the notch one circle, the horn its cusp with the
  barrel's cut ending in a straight cut with sharp corners 12.4 mm out, and
  the mouth a sharp corner with a straight edge to the rim at −23°.
  `tools/train_bridge.py` now builds `TB_EDGE` from those readings, and the
  keyhole stops 1 mm short of the notch. Keep: the edge is neither smoothed
  nor pushed off holes (that rounded the horn); the tool prints the metal left
  round each instead. `8a48535`
- **Train bridge's third screw overhung the notch.** At (29.24, −12.28),
  from the top-view photograph's five-screw map (fitted to the model's own
  screws), its head hung about 1 mm over the notch round the fusee, and the
  real bridge has no hole there. It is now at the end of the tongue beside
  the notch's mouth, (32.25, −10.81), its head sunk flush in the 5.3 mm
  counterbore C Spinner's video shows (23:30, 36:26, 36:34), and the barrel
  bridge's access hole moved with it. The mouth's edge now turns into the
  rim through a round corner (r 6) instead of a sharp one. Keep: no screw
  head over an edge; the pillar under this screw (the manual's and the
  video's) waits on the fusee's place (`Review-results.md` 21). `b58bd58`
- **Screws were heads with nothing under them, and no part had a hole for
  one.** The Exploded view showed it: every bridge lifted away with bare heads.
  `screw()` now draws a threaded shank (`len`, toward +y), and every part a
  shank passes through has a clearance hole (`hC`) and the part it holds a
  tapped hole (`hT`), from positions worked out once (`S` in `buildMovement`).
  The Exploded view lifts each screw out of its holes (`SCREWS`). Keep: a new
  screw gets its shank and its holes; `tools/fine.py` shows a shank without its
  hole as a new overlap. `63c5dce`
- **`polyGeo`'s bevel narrows every hole at both faces**, by 0.8 × the bevel
  (0.18 mm on the train bridge), so a thread that fits its tapped hole grazed
  it there, 0.1–0.2 mm deep, in eight places. Screw holes (`hC`/`hT`, whose
  fourth element is set) are cut that much larger. Keep: pass screw holes
  through `hC`/`hT`, never as bare `[x, z, r]`. `63c5dce`
- **The setup cover's feet stopped 0.35 mm above the barrel bridge.** They now
  stand on it, with the cover screws through them. `63c5dce`
- **The winding-pawl spring screws stood on nothing**: 0.8 mm heads on a
  spring 0.3 mm wide (`audit.py`'s floating screws). Each spring now has a foot
  under its two screws. `63c5dce`
- **Pivots ended in bare holes**: the balance's lower pivot (no setting, no
  endstone), the escape arbor's (a gilt ring, no jewel, a stone floating over
  the bridge, two pins for the cap's screws), and the fourth wheel's upper one.
  They now run in settings with their jewels, up to endstone caps held by
  screws (Figs. 108, 110). `63c5dce`

- **The barrel hardly showed from above.** In the top-view photograph a wide
  window in the barrel bridge shows the barrel's cap and the fusee's large end
  beside the balance. The model's cut was the balance's clearance circle only
  (r 17.7), which left a 3.8 mm crescent of barrel, and the train bridge,
  drawn as a full disc with a pocket round the fusee's top, covered the rest.
  The cut is now traced on the photograph (r 17.6 about a centre 2.8 mm off
  the staff toward the barrel, joined with the clearance circle), and the
  train bridge is cut round the fusee (r 17.8, open to the rim) as it is cut
  round the barrel. `tools/topview.py` warps the model onto the photograph to
  compare them. Keep: an outline the photographs show is traced, not a
  clearance circle; check it with `topview.py`. `aa9d525`
- **Plates hollow round their holes and cut-outs: a screw taken out showed
  only the hole's two rims, and a section showed the hole's wall instead of
  the cut.** r128's `ExtrudeGeometry` turns a shape's holes round only when it
  reverses a counterclockwise outline, so `polyGeo`'s clockwise outline with
  clockwise holes got every hole wall wound into the metal (culled; seen from
  inside the cut). `extrude()` in `core.js` builds every extrusion and turns
  those walls over, the shape unchanged. The balance cock's setting was an
  inside-out lathe (`.reverse()` on its profile). Keep: build extrusions with
  `extrude()`; a closed part has no edge used once, nor twice the same way, and
  a positive signed volume. `8956085`
- **Parts drawn as surfaces, not solids** (the rest, after `8956085`). Every
  part is now a closed, outward-facing solid, except the decals (engravings,
  the dial's printed face) and the ground's shadow: lathes run to the axis
  (the screws, pillars, posts and dial feet had a 0.01 mm hole down it);
  `closeGeo()` in `core.js` caps the springs' tubes, the box handles' half tori
  and the gimbal ring's part-turned lathes; the barrel wall is 0.2 mm thick
  inside its 13.5 mm drum radius (the brace, 0.25 mm, lines it), the mainspring
  a strip 0.1 mm thick, the case's bowl one lathe 1 mm thick outward of its
  inside face on a 1 mm floor with its key hole, and the glasses 0.8 mm slabs
  (a one-sided plane vanished from below). The pivot blocks and latch keeper
  sit on the bowl's new outside face. The checks find the barrel wall by
  `userData.barrelWall`. Keep: no `DoubleSide`, `noCap` or open geometry for a
  new part; a closed part has no edge used once, nor twice the same way, and a
  positive signed volume. `eb37b95`
- **Train-blocking screw hung in the air between the bridges.** Its head sat
  under the train bridge and its thread ran 5 mm bare down to a thin lobe of
  the balance lower bridge. Fig. 110's section shows the screw's part of the
  bridge rising to the train bridge's underside, bored for the head down to
  the seat and tapped below. The lobe now rises in a column (r 1.9) to the
  train bridge, bored r 0.95 to the seat 0.6 mm into the bridge's top. The
  screw's travel and `blockRoom` are unchanged. Keep: the screw is enclosed
  from the train bridge down to the lobe's underside; the column stays clear
  of the fourth wheel's upper setting. `7267536`
- **Escape upper bridge's screw heads 0.06 mm into the balance's path**
  (finding 3). The heads are now 0.3 mm tall, 0.14 mm clear of the rim and
  timing weights. `dyn.py` works in 0.4 mm cubes and can't see gaps this thin,
  so check them by hand. `c2adc92`
- **Balance lower bridge screwed from the wrong side, with the wrong screws,
  and drawn as a flat bar.** Two small screws came down from the train
  bridge's top into a boss, and the bar's balance end hung free. The manual
  draws the two screws (42055, the pillar screws) head down under the bridge,
  going up into the train bridge (Figs. 29, 67, 110); Op. 12 screws the bridge
  to the upturned train bridge and Op. 50 takes the screws out once that
  bridge is off. The bridge is now a stepped block: an upper tier against the
  train bridge (an arm round the escape wheel, `LB_UP` from
  `tools/lower_bridge.py`) with the screws from below and two steady pins
  ("complete with pins"), and the lower tier, boss and column below it. The
  screw at the arm's end is outside every wheel, over a hole in the pillar
  plate that reaches it (RMG No. 4E019). Keep: no screw heads on the train
  bridge's top for this bridge; each screw's way out downward clear of the
  lower tier (it goes in from below); the arm 0.39 mm or more off the escape
  wheel's tips. `7cbbfaf`
- **Train-blocking screw's slot under the train bridge, behind a hole
  smaller than its head.** Fig. 110's section shows the raised screw's
  slotted top standing in the train bridge's access hole, the collar below it
  seated against the hole's edge. The screw now has a slotted spigot (r 0.5,
  1.5 mm) above the head, and the hole keeps its 0.72 mm radius at both faces.
  Keep: raised, the spigot is in the hole and the collar under it. `fd944c1`
- **Balance lower bridge drawn as a thin arm on a post, its screws off the
  photograph's holes.** The upper tier was a 3 mm strip round the escape
  wheel's 6 o'clock side, from the lug at 3 o'clock to a lobe at (−5.3, 26.2),
  and the lower tier a bar joined to it only by a small boss and the
  train-blocking screw's column. Figs. 29 and 110 draw a stout stepped block
  with solid walls between the tiers. Fig. 30 gives the order along it: an ear
  with a screw, the train-blocking screw, the fourth's setting, the balance's
  cap, then the arm. The top-view photograph shows the train-blocking screw's
  countersunk access hole, a pin's hole and the second screw's tapped hole
  beside the fourth arbor, 2–8 mm from where the model had them. The bridge is
  now a frame round the escape wheel (`LB_UP`, `LB_WALL`, `LB_LO` from
  `tools/lower_bridge.py`). Walls stand at both ends: at the fourth end round
  the train-blocking screw (now 5.0 mm from the arbor), with the ear's screw at
  the photographed hole. The arm runs from the balance end round the escape
  wheel's 3 o'clock side to the lug. Keep: the train-blocking screw, the pin
  and the ear's screw at the photographed holes; solid walls between the tiers,
  not posts; the upper tier and walls clear of the escape wheel's tips
  (0.70 mm) and the rollers' sweep (0.56 mm); the screws put in from below. `01f2eea`
  (The frame and the photographed holes are superseded by the L-shaped slab
  below; the walls, the clearances and the screws from below stand.)
- **Balance lower bridge's lower tier a thin bar, 0.39 mm from the escape
  arbor.** The lower tier ran as a bar from the balance's setting to the
  fourth's, its edge passing the escape arbor by 0.39 mm. A restoration video
  of a 1941 Model 21 (`References/VIDEOS.md`) shows it a broad slab, side-on
  unbroken from end to end, the escape wheel turning between it and the train
  bridge and its arbor passing through it; the escape wheel is lifted out from
  above with the bridge in place. The slab now covers the hull of the two
  settings, the balance-end wall and the train-blocking screw's boss
  (`tools/lower_bridge.py`, `SLAB`), bored r 3.0 round the escape arbor. Keep:
  the lower tier a slab, not a bar; the escape arbor's hole wide enough for its
  pinion (r 1.9) to pass; the slab's heights from the side photograph (the
  video's are within 1 mm). `e8e76e4` (The bore is superseded: the escape
  arbor now passes through the L's inside corner, below.)
- **Balance lower bridge nothing like the real one.** The model drew a frame
  of lobes round the escape wheel, both screws 13.3 mm apart at the fourth's
  end, after three holes on the top-view photograph. A restoration video
  (`KLUwI2UUCMQ` 36:01, 13:49.5; Boulder Horological Society 43:13) shows one
  slab shaped as an L, the cap in a round counterbore at its corner, the
  fourth's large gilt setting up its body, an arm to a lug at one end and a
  lug beside the train-blocking screw at the other, the screws 34 mm apart,
  and the escape arbor through the L's inside corner. Measured at 36:01
  through a camera fitted to the train bridge's rim (`tools/rimfit.py`), the
  bridge is now that L round the model's arbors (`tools/lower_bridge.py`):
  the 3 o'clock lug and screw where the video has them (the plate's access
  hole under it), the other lug off the pillar, detent support block and
  barrel-bridge screw beside it, the train-blocking screw 5.0 mm from the
  fourth arbor at 230° (its access hole off the locking arm's screw and pin),
  the cap's counterbore (r 4.3) and the fourth's sink (r 2.7) 0.4 deep. Keep:
  the L, the escape arbor outside the slab in its corner (3.6 mm), a lug and
  screw at each end of the long axis, the cap in its counterbore; the slab
  1 mm off the third arbor, the lugs off the escape wheel's tips (1.2 mm) and
  the pillar (0.7 mm). The outlines are simplified so no three points are in
  a line: three.js's triangulation joins a hole wrongly to such an outline
  (116 open edges). `3953b0c`
- **The photographed group 14° off the dial.** The arbors' layout was fitted
  to the top-view photograph with the dial's 12 o'clock taken as the
  photograph's; measured against the restoration video's dial side and the
  photographed dial (the seconds and indicator sub-dials against the balance
  and fusee), the balance, fusee, barrel, pillars, bridges, cock, their screws
  and pins, the engraving and the damascening stood 14° round from the dial
  and train. They are now turned together (`PHOTO_TURN`, `PT`/`PTi` in
  `movement.js`; the damascening's stripe and the decals' UVs with them), the
  escape arbor solved again from the balance (9.40) and the fourth (10.585),
  the lower bridge laid out again round it (`tools/lower_bridge.py`) and the
  indicator wheel brought in to 23.6 mm (module 0.266, 32.5 mm across, at
  y 1.94) inside the mounting ring's bore. Keep: anything placed from the
  photograph goes through `PT`, anything placed from the dial or the train
  doesn't; angles read on the photograph (screws, pawls, the setup spring)
  get `PHOTO_TURN` added or taken off in the same frame. Three checks were
  made robust by the move: `seatPawl` lays the pawls on a densified tooth
  outline (0.1 mm; the fusee met the sustaining ratchet in a sliver between
  vertices), `geometry-audit.js` probes a screw's seat in the screw's own
  frame and eight directions (a turned detent screw read as floating), and
  `invariants.py` runs the train with the fusee for its 56 h indicator test.
  `8cbb259`
- **Balance lower bridge's far lug past the body's end.** After the 14° turn
  the detent stood where the video has the far lug (`KLUwI2UUCMQ` 36:01:
  beside the fourth's setting on the 9 o'clock side), so the lug was moved
  past the body's end, 11.3 mm from the video's, and the bridge lost the
  L that main's had. The lug is back beside the fourth (−13.9, 18.8), 3.8 mm
  from the video's, on the detent's 12 o'clock side, joined to the body by
  a tongue of the slab under the detent; the train-blocking screw has a
  column of its own on the detent's other side (`tools/lower_bridge.py`,
  three upper-tier pieces in `LB_UP`/`LB_WALL`; `BLOCK` the detent's real
  footprint from the page). Keep: the far lug beside the fourth, not past
  the body. `c1f9696`
- **Detent support block's screw put in from below.** The manual (Sec. II;
  Figs. 14, 22, 84; Op. 81) and the video (`KLUwI2UUCMQ` 10:45, 11:08) put
  it in from above, through the train bridge into a tapped hole in the
  block's top; the model had it from below because the barrel bridge's horn
  covered its place. Merging main's detent fixings into the 14° turn put the
  screw over the balance lower bridge's slab, which it then passed through
  in the Exploded view (`exploded.py`); with the group turned nothing stands
  over it, so it goes in from above (`hC` in the train bridge, `hT` in the
  block; `bom.json` 42056.blk). Keep: the screw in from above, on the train
  bridge. `d0d563d`
- **Balance lower bridge drawn as an L, not the real lens.** The outline was
  read on 36:01 through a camera turned onto the model by its centre, third
  and fourth arbors, then laid round the model's balance, escape and fourth
  arbors, which stand 4–5 mm off the real ones: that bent it into a
  straight-sided L with an arm. Measured face-on at 13:49.5 through the camera
  the train bridge's own rim, barrel cut and centre bushing give
  (`tools/framecam.py`, the picks back at their heights), the slab is a lens
  (two convex edges, r 20.8 and 25.7, a straight end, a concave edge on the
  escape lobe's circle, r 7.14) with a chamfer round its convex edges, and a
  lug at each end of the upper level; the screws are at (20.70, 7.23) and
  (−9.18, 21.87). The model draws that, changed only round its own arbors.
  Keep: the outline in the train bridge's frame as measured, its two levels
  and chamfer; anything turned onto the model by the model's own arbors
  carries their error into the part. `c2f11a6`
- **The measured lower bridge in the turned layout.** Merging main's lower
  bridge (measured at 13:49.5 in the train bridge's frame) into the 14° turn:
  the outline, its circles and the lugs and screws go through `PT` with the
  train bridge, the arbors stay the model's. The turned detent then crosses
  the slab beside the fourth arbor, so the train-blocking screw keeps a column
  of its own at (−3.70, 26.50), with a boss of the slab round it; the third
  arbor, which doesn't turn, stands inside the turned slab and gets a slot to
  its edge (a hole there was lost by the outline's tracer, which keeps the
  outer boundary only: `fine.py` found the slab through the arbor); the
  3 o'clock lug keeps 1 mm off the escape wheel. Keep: a clearance round an
  arbor inside a traced outline must reach its edge. `5e84cfd`
- **Balance hub solid round the staff; spring screws rubbing the fusee.** When
  the staff was turned with shoulders, the hub's boss (42186) stayed a solid
  cylinder with the staff inside it; it is now bored r 0.45, as its flange is,
  a press fit. The winding-pawl springs' screws (42012) were 0.2 mm tall, the
  whole gap between the springs' foot and the fusee's underside, which turns
  over them while winding; their slots stood 0.02 mm into it. The heads are
  0.15 tall. Keep: a part on a shaft is bored for it; a screw head under a part
  that turns over it keeps clear of it. Found by `fine.py` after the parts-list
  changes, which also retired 15 `EXPECTED` entries nothing matches any more. `5709d7b`
- **Mounting ring screws from the wrong side.** The three screws (42055)
  were drawn from the dial side, through the ring's lip into the plate. The
  manual lays the plate on the ring and screws them in from above (reassembly
  Op. 1; Fig. 29 draws them over the plate), and the top-view photographs show
  one on the plate at the rim at 6 o'clock. Keep: the mounting ring screws go
  in from the train side, through the plate into the ring. `3c047b0`
- **Locking arm under the rim.** The balance locking arm held a pad under the
  rim, which no part of Fig. 9 shows. Fig. 9 draws the arm curved, its screw
  outside the rim and its end at a timing weight, and Sec. X places it "over the
  timing weight": the finger at its end now stands beside the timing weight on
  the 6 o'clock side, and a balance screw stops the balance the other way.
  `fine.py --hold` held the arm locked while the balance still swung through its
  phases; it now holds the balance at rest and the escape wheel locked. Keep: the
  arm stops the balance through a timing weight; unlocked, it is clear of
  everything the balance carries. `3655b52`
- **The Navy's Y-arm ugly and not as photographed** (Variants, Balance stop). It
  was three strips laid over each other at one height, plus a ring for its eye:
  coplanar faces that fought at the fork, bends pinched where the strips turned,
  and branches 1.5 mm wide that ran in to the staff and back out. Its post was a
  bare rod under three brass rings. A first rebuild from 2E11795's photograph
  alone made it a broad wishbone that stopped inside the post, which still didn't
  look like the arm. Photographs from straight above (Delaney No. 8854 and
  another) show a lever: its root is screwed on a shouldered stud near the
  bridge's rim (in the pillar screw's place), and it runs under the cap to a
  crossbar round the cock's end with an eye and a pin at each end. It is now
  that lever, the crossbar symmetric about it (an arch with straight legs, level
  arms out to the eyes over the rim), its widths from Delaney's photograph, the
  outline the boundary of bars joined with round fillets (`sdfOutline`). Its
  post is a second dust seal like the fusee's, slotted for the lever, with a
  plunger that presses it down. Keep: the lever one closed plate (no strips laid
  together), run to its pivot screw; the barrel bridge's pillar screw hidden while
  it is fitted (`R.navyBB`); symmetric about the stem; the arch's inner edge
  6.6 mm or more from the staff (the hairspring); both pins over the rim; the flange bitten round the setup cover
  (`fine.py --eval "__mv.userData.stop('navy')"`, with and without `--hold`;
  `exploded.py` and `audit.py` take the same `--eval`). `17fa7d4`, `f7bfddd`
- **The Navy's balance brake's arch too tall, and pressed instead of screwed**
  (Plates, bridges, screws and arbors; Variants, Balance stop). The crossbar's
  arch stood on straight legs 4.5 mm long, its top 12.3 mm from the staff (after a
  sketch). Traced on Delaney No. 8854's photograph from straight above, the arch
  runs about 7.9 mm round the staff with its top 8.3 out and the arms nearly level
  with the staff; 2E11795, the omegaforums movement and 2E8489 (the restoration
  video) have the same shape. The legs are now 0.5. Two descriptions of the stop
  have it screwed down with an Allen key through the case's bottom, which fits
  the hex socket in its plunger: the text now says so, not a pressed cap. Keep: the
  arch's top about 8.3 mm out, its inner edge 6.6 mm or more from the staff (the
  hairspring); the arms out to the eyes nearly level with the staff. `f9ae355`
- **The Navy's balance brake locked in mid-air** (Plates, bridges, screws and
  arbors; Variants, Balance stop). Its pins' length was set for the 4.3 mm rim
  (`2*2.15` in their end, `PE`), and the rim was cut to the video's 3.5 mm
  without it: free, the pins stood 1.3 mm over the rim's top edge, and locked they
  stopped 0.8 mm short of it, so nothing held the balance but the stop's state.
  It also tipped the lever along its own line, so one pin came down further than
  the other, and only to 0.02 mm over the rim. The rim's height is now one
  constant (`BAL_RH`) that the pins' end is taken from, 0.5 mm over the rim's top,
  and locked the lever turns about the horizontal through its pivot along the
  crossbar, so both pins come down the same 0.5 mm onto the rim's top edge, as the
  sources describe it working. Keep: the pins' end from `BAL_RH`, never a copy of
  the rim's height; locked, both pins on the rim's top edge (their lowest edge
  0.005 mm into it, under `fine.py`'s grid, so `--hold --eval
  "__mv.userData.stop('navy')"` passes with nothing new); free, 0.5 mm clear. `29cecd9`
- **The Navy's balance brake through the hairspring in the Exploded view**
  (Plates, bridges, screws and arbors; Variants, Balance stop). Lifted 22 past its
  part, it rose 84 against the balance's and hairspring's (`spr`) 80, and passed
  up through a piece of the hairspring's part standing 3.1 mm over it on the
  slider's way, ending in it; the checks ran on the manual's arm, so nothing showed
  until the Y-arm became the default. It now rises 19: above the balance under its
  pins, below the hairspring's piece over it (`exploded.py` allows 18 to 20.6).
  Keep: the brake's lift between the balance's and the hairspring's; with the Y-arm the default,
  run `exploded.py` and `audit.py` as they are and with `--eval
  "__mv.userData.stop('arm')"` for the manual's arm, and `bom.py` fits the arm
  itself (the parts list's). `73594b5`
- **Mounting ring drawn as a flange round the plate's edge.** Figs. 29, 67
  and 110 draw it as a deep ring under the plate, and the side and dial-side
  photographs show it: a band as wide as the plate, then a flange 95.9 mm
  across, 6.5 mm out from the plate's dial face, lacquered brass (Sec. VI); the
  plate's dial face lies sunk in it. Now that, carrying the dial (the note at
  Op. 98), with its alignment pin (Sec. III). The dial (95 mm, the side
  photograph; the dial photograph's proportions agree) moved 3.24 mm further
  from the plate, and everything above it with it: the hands, the cannon pinion's
  and hour wheel's pipes, the wind indicator's pipe, the centre and fourth
  arbors' dial ends, the setting key. Its feet and screws moved from the plate
  (r 39) to the flange (r 45.9), where the top-view photographs show two. Keep:
  the dial on the ring (`MR_Y`), heights above it written `+DD`; the hands
  scaled by `DK`; the dial canvas's sub-dials at `L.F[1]/DIAL_R`, on their
  arbors. `8ec1d92`
- **Escape upper bridge drawn the wrong shape, along the wrong line.** It
  was a short stadium running from the escape arbor away from the balance,
  with both screws beyond the arbor and a small bar-shaped endstone cap. The
  real bridge (`KLUwI2UUCMQ` 10:00; Figs. 84, 110) is a long bar across the
  keyhole, symmetric about the setting, with a screw near each end and a large
  round cap on a boss in the middle. It is now built that way
  (`barBossPts`, `endCap(..., rc)` in `movement.js`), its screws moved with
  it (the train bridge's tapped holes follow `S.eb`). Keep: the bar runs
  across the balance–escape line (68° round), its end screws 8.0 mm either
  side of the jewel; the end screws' heads stay 0.3 mm tall for the balance
  rim. `0dade8c`
- **The upper train bridge's middle and
  its end.** The middle was two circles about the model's balance and escape
  arbors (r 8.0 and 3.0); the real bridge (C Spinner 23:30, BunnSpecial
  20:20) has one opening of two lobes, over the balance (r 4.6, centred 0.6
  mm from the staff) and over the fourth's setting on the lower bridge
  (r 4.3), and the escape passage (r 4.7), through which the lower bridge
  shows; the light pockets either side are seats for the escape upper
  bridge's ends, not openings. The bridge's end past the barrel ran on round
  the rim as a sliver 23° further than the real one's straight cut. Both
  traced on 23:30 through its anchor (`tools/train_bridge.py`: `TB_KEY`,
  `TB_END`, through `PR`), checked on the frame rectified to the model's plan.
  Keep: the bridge's outline, opening and end are the video's, in the bridge's
  frame. `6d1bd37`
- **The train bridge's third screw in
  its pillar.** The manual and the video put all three train-bridge screws in
  pillars (Op. 14; 36:34); the third was threaded into the bridge alone, as
  a pillar there would have stood in the fusee wheel. With the fusee where
  the plate has it, pillar 2 stands under it, and the barrel bridge's screw
  where pillar 2 stood goes into the train bridge (`bom.py`'s 42055.tb
  deviation removed). `6d1bd37`
- **The lower train bridge a thin bar** (Review-results.md, Elsewhere 24): 1.2 mm
  thick and 6 wide, against the video's 4.4 and 10 (40:08, fitted at the plate's
  scale). Now so, its screws' heads and the settings in counterbores at its top, the
  third and fourth arbors' lower pivots up to the settings. Keep: `LT_H`; its end 9.2
  past the fourth, clear of pillar 1's dial-side screw (the video's 10.3 would stand on
  it at the model's 170.8 deg). `162dfe5`
- **The escape upper bridge's ends on the train bridge's face, its cap's window a plain
  hole, the caps' screws small** (Review-results.md, Elsewhere 17). The ends now lie in
  seats sunk `SEAT_D` (`TB_SEAT`, `tools/train_bridge.py`), the bar and the escape
  arbor's top pivot lowered with them (endshake unchanged); the escape cap's window a
  90 deg cone r 1.55, its screws' heads r 0.75; the balance lower cap's window a
  straight bore r 1.1 over a wider endstone, its heads r 0.5 (10:00, 13:49.5). Keep:
  the main bridge's opening (`TB_KEY`) takes the seats with it, the screw and pin holes
  only in the seats' floors (a hole inside a hole breaks the extrusion); the caps'
  seat layers tagged with the cap's line (bom.py reads the endstone as set in what
  holds it). `162dfe5`
- **No dial take-off slot** (Fig. 21; Review-results.md, Figs. 21, 22, 28 and 29):
  the mounting ring's flange was a plain circle. Now a notch in its rim, 167° from
  12, 1.4 wide and 2.2 in, through the flange's top layer, where the restoration
  video lifts the dial (8:46, 9:03). Keep: it under the dial's edge and clear of
  the dial screws' holes. `836ad13`
- **The plate's opening under the lower train bridge a small round hole**: r 6 about
  the third, estimated, and the fourth's pivot in a plain hole r 1.2. Measured on 34:30 and 40:08 it is a keyhole: a circle r 11.3 about the third, a lobe r 4.85 toward the
  balance and a bore r 3.2 about the fourth (`PP_KEY`, drawn by `lobedCircle`; `discGeo` now takes
  an outline hole). The bar's settings run through it, gilt at its train-side face as 34:30 shows,
  and the steady pin that stood in the opening moved past the screw. Keep: no hole or pin of the
  plate inside `PP_KEY` (`checkHoles` doesn't test an outline hole). `b6b61b3`
- **The third's lower jewel red**: it is colourless on the restoration video, the fourth's red
  beside it (40:08 from the dial side, the third's pinion seen through it; 34:30 from the train
  side, the blue mat). Now `M.clear` (`jewel()`'s `jm`). Keep: only the fourth's of the lower train
  bridge's two stones red. `98b48be`

- **Pillars and screws estimated**. The
  pillar screws' heads r 2.77 and 2.0 tall (side photograph; were r 2.9, 1.6);
  the barrel pillar a cone from a wide foot to r 2.25 under a groove at 14.0 mm
  (13:08; it was pinched at 6.3 mm, by eye); the detent block's screw flush in
  a counterbore r 1.4 (10:46; it stood proud); the balance's timing screws end
  2.7 mm outside the rim (6:50.0: 3.3 from its inner face). Keep them traced (SHAPE-PASS.md, 5). `fd368d4`

- **The balance lower cap and setting 40 % too small**.
  The cap was R 2.7 with its screws 1.9 out and a window r 1.1: the ratios read on 13:49.5,
  scaled by an estimated screw spacing; the setting in the slab r 1.2, estimated. Measured
  through `framecam.py` (13:49.5 from below, 13:44 from above): the cap R 4.46, its screws
  3.25 either side of the jewel, its flat 2.78 out, its window r 1.87, the screws' heads r
  0.85; the setting r 2.52; the slab's counterbore r 4.56 round the cap. Keep: the cap's sizes
  and the setting's measured (`tools/anchors/cap_13-49.5.json`, `setting_13-44.json`), not
  scaled from an estimate. `d0f0cb3`
- **Barrel bridge's horn ends cut straight.** Both ends of the barrel
  bridge's opening were straight cuts: the far horn's from the cut round
  the balance to the rim (with a kink where `PTr` bent it near the rim), and
  the cock's side along a line fitted to the cock's straight edge, which its
  five traced points also left straight. The flat bridge (C Spinner 23:45,
  through a homography on its rim and bushings) and the top-view photograph
  show both curved: the far horn's 0.46-0.59 mm off its chord, the cock's
  side bowed into the bridge 0.7-1.0 mm, steepest near the rim, and the
  cock's top edge with it. Keep: both cuts traced (`FH`; on the cock's side
  the bridge now follows the cock's traced edge, `CK_TR`, below, which bows
  the same way), and a curved cut drawn along its curve (`clipUnder`), not
  `clipPoly`, which draws it as its chord. `d463348`
- **The balance cock's endstone cap, settings and screw counterbore about
  20 % small.** The cap was 7.2 × 4.6 mm with its screws 2.75 mm either side
  of the staff, its setting r 1.6, the cock's setting r 1.5, and the cock
  screw's counterbore r 3.05 with a head r 2.75: the photographs scaled by
  the top-view photograph's cap screws, which read every size on the cock's
  top about 0.83 of the video's. Through the camera fitted on C Spinner's
  6:49.0 (the same camera as 6:29, the cap on), the cap's screws are 6.66 mm
  apart, the plate 8.9 × 5.5, its setting 3.85 across, the counterbore 7.4;
  the cock's setting r 2.2 (41:58). Now so, the head 0.90 of the counterbore
  (r 3.33) and 1.5 times its width long, as the photographs and 5:59 have
  it. Keep: sizes on the cock's top from the video's camera, not scaled by
  the top-view photograph; the cap on metal all round (`hullSplice`). `a88cd81`, `78880fd`
- **The balance cock's top face traced through its holes at the old
  scale.** `CK_TR` went through homographies on the cock's holes as the model
  placed them: the cap's screws 2.75 either side of the staff and the stud's
  row read through them, both about 0.83 of their real size, so the straight
  edge lay 1.9-3.5 mm and the concave edge 1.4-3.3 mm inside the real cock
  (and the barrel bridge's horn, which follows that edge, as far off the
  bridge's own edge at 6:49.0). Traced again on 41:58 through the holes as
  6:29 measures them, with the rim held to r 40.1: the straight edge within
  0.25 mm of 6:29's, the horn's measured edge within 0.6 mm of it at f 5,000.
  Keep: the cock's top traced through holes measured on the video, its rim
  as a constraint; the horn 0.15 mm off the straight edge. `eb65570`
- **The barrel bridge's cut round the balance too small between the horn and
  the fusee.** The cut was the balance's clearance circle (r 17.7) and the
  top-view photograph's circle, so the horn on the cock's side met it at
  (19.5, 9.87). On C Spinner's 6:49.0 (the cock out) through the camera
  fitted there, the bridge's edge runs from the horn's inner corner at
  (23.7, 8.4) toward the fusee 21.6-22.3 mm from the staff. A circle through
  those 9 points is now cut too, run on behind the fusee's dust cap. Keep:
  the cut traced on the video there, not the photograph's edge in the cock's
  shadow (16.7-18 mm, plain train bridge on 6:49.0). `f290f01`
- **The barrel bridge's two screws into the train bridge 3-6 mm too near
  the centre.** They were placed through `PT` from the top-view photograph's
  five-screw map, which is about 10 % small near the rim: (28.99, 7.95) and
  (−23.88, 22.98), r 30.1 and 33.1. On 6:49.0 through its fitted camera (and
  6:29) their heads stand at (35.18, 8.06) and (−24.85, 26.27), r 36.1-36.2,
  and the photograph has them 4.5-4.9 mm inside its rim; now so. Keep: a
  screw near the rim measured against the rim, not through `PT`. `ee8b601`

- **The balance cock's top face a straight edge, a widened nose and a bulging
  concave edge; its arm one thickness.** Seen from above, the cock's straight
  edge was one line to a corner at the nose (the nose widened round the cap)
  and its concave edge a cubic bulging about 1 mm into the opening. A real
  cock (the restoration video's 41:58, and a photograph from above, the
  concave edge as the user marked it) has the straight edge level with the
  stud's holes from the nose, bending about 23 deg toward the rim, up to
  2.6 mm outside the old line; a round nose with no corner; and the concave
  edge `CK_TR` traces. And the arm is in two thicknesses (44:02, 41:58): 2.6 mm
  from the nose, a square step down to 6.0 mm on a line 12.1-13.7 mm from the
  staff, then the body. The barrel bridge's horn now follows the new straight
  edge (`clipUnder`). Keep: the cap on metal all round (0.3 mm), the stud's
  bar under the thin part, the horn 0.15 mm off the straight edge. `8cce550`

- **The balance cock's body wall stood 4.9 mm too near the staff.** The body
  was all of the cock more than 17.7 mm from the staff (the barrel bridge's
  circle round the balance), its wall read at 18.6 along the stud's holes at
  their old scale. On KLUwI2UUCMQ 44:02 (and 44:20) the open space under the
  arm's thick part runs on to the wall's corner with the straight edge's side,
  which a camera fitted on the cock's top (the cap, the stud's holes and the
  counterbore at their measured places) puts 22.6 mm from the staff (22.5-23.0
  over focal lengths and methods); drawn there, the model's lines fall on the
  frame's. Keep: the wall (`CK_RP`) read through a camera, not the 1-D map on
  the stud's holes, which extrapolates (21.3); 0.48 mm of metal round the cock
  screw's counterbore. `951627b`
- **Mounting ring screws and two dial screws 20-37° from the real ones.** The
  ring screws' places (`S.ring`) were fixed angles, 70°, 190° and 300° from 12:
  one read on the top-view photograph before the photographed group's 19.4° turn
  (12 October 2026) and not turned with it, the other two estimated; the band's
  tabs under them repeated the angles (`RA`). Two dial screws (38.0°, 152.6°)
  were an estimate and the other movement's photograph. On KLUwI2UUCMQ, through
  fitted cameras (`rimfit.py` on 9:03, 40:08 and 34:30, both sides), the ring
  screws stand at 91°, 214° and 336° (their heads on the plate's rim from the
  train side, their ends in the ring's threaded holes from the dial side; the
  photograph's head at 215° agrees) and the dial feet's four plain holes at 2.3°,
  132.9°, 226.0° and 318.5° (the 2.3° one had been taken for a steady pin's). Now
  91.5°, 214°, 336.5° and 2.6°, 132.9°, 226.0°, 318.9°. Keep: the band's tabs
  follow `S.ring` (`RA` is read from it), and any place read on the top-view
  photograph goes through `PT`. `ea4fb43`
- **Ring screws ending under the flange, 1.4 mm too far in; a dial foot where
  the video has none.** The three ring screws stood at r 40.6 and ended in the
  band, so the flange had no holes over them, where the video shows their ends
  in threaded holes through its dial face; read camera-free (radial strips:
  each hole's place between the bore and the flange's rim) they stand at
  41.8-42.2. The dial's fourth foot had been put at 2.6° for a plain hole of the
  feet's size there, which the strips put inside the feet's circle, among the
  ring screws. Now the screws at r 42.0, tapped through the band and the flange,
  their ends 2.0 below its face (the band's tabs, which held them at 40.6,
  gone); the fourth foot at 178.7°, a filled hole of the feet's size; the 2.3°
  hole drawn plain. Keep: a hole's radius read on a face as a fraction of the
  way between two of its edges, not through a camera scaled by an uncertain
  bore. `2394368`
- **The fusee and barrel arbors couldn't pass their own holes.** The barrel bridge's bushings were bored r 1.02
  (fusee) and 1.42 (barrel), the plate's 0.58 and 1.43, all without a source, though the parts list gives the four one number (42164); the squares,
  3.4 and 3.1 across their corners, couldn't pass them, so the bridge couldn't come off over the arbors (Op. 31), the dust seal off the square (Op. 29),
  nor the barrel arbor out of the barrel's end hole (r 1.43; Op. 36), and the wind indicator pinion (tips r 1.76) couldn't leave the fusee's lower
  bushing. The bushings are now one part, r 3.4 bored 1.85, the pivots r 1.82 (KLUwI2UUCMQ 13:04.4, 12:39.0, 37:59, 40:05; Fig. 75); the fusee arbor a
  shaft to a step at y -31.5 and the square to its end, a shoulder r 2.2 under the collar, the end plate bored 2.25; the barrel arbor Fig. 75's pivots
  and bearings (r 2.35 in the barrel's end holes, r 2.38). Keep: every arbor's pivot inside its bushing's bore and every square's half diagonal under the
  holes it passes; `tools/overhaul.py` passes with no expected entry for them; `strength.js` reads the fusee bushing off its `bushR(...)` call's literals. `facea7a`
- **The dust seal's screw holes about 62° round from the real ones.** Traced on the top-view photograph through
  `PT`, the pair stood at 145.5° and -37.9° about the fusee, so the barrel bridge showed a hole where the real one is plain beside the arbor (12:39.0).
  KLUwI2UUCMQ 13:04.4, the bridge underside up, puts them at 26.8° and -154.9°, 7.97 and 7.67 out (drawn 7.8); the flange's bite between them turns with
  them. Keep: `S.seal` in the movement's frame, not through `PT`. `f06ed2f`
- **The winding stop's tapped hole went through the barrel bridge.** The stud screws 2 mm into the bridge's 3.4 from
  underneath, but the extrusion's holes all go through, so its hole showed on the bridge's top beside the dust seal, where the real one is plain (KLUwI2UUCMQ
  12:39.0). `blindHoles()` (core.js) now cuts it 2.0 deep from the underside, re-triangulating only the face's triangles that meet it (a fresh triangulation of
  the whole face fails where the bevel's inset outline crosses itself at a sharp corner). Keep: blind holes through `blindHoles()`, not stacked layers that
  leave a seam; `tools/holecheck.py` finds a hole with nothing in it. `09cf387`
- **The barrel bridge lacked holes the real one has.** Surveyed on KLUwI2UUCMQ 13:04.4 (its underside, 4K) with
  `tools/holemap.py` (the frame warped onto the bridge's plan by a homography on known holes, the model's holes drawn over it): the Navy seal's two screw
  holes (its screws had stood on the bridge's face), the setup pawl spring's steady pins through the bridge (they had stopped on its top), the setup cover's
  screws' tapped holes made blind (nothing under them), and six through holes whose use no source gives. `blindHoles()` now closes a through hole's far end
  rather than re-triangulating a face, and `holecheck` finds holes from circle fits as well as closed loops, its faces grouped by plane. Keep: a part's holes
  compared with a face-on frame of it through `holemap.py`; `holecheck` passes. `e44d936`
- **The upper train bridge and the pillar plate lacked holes the real ones have.** Surveyed with `tools/holemap.py`: on the
  train bridge a countersunk hole between pillar 0's screw and the lower bridge's (13:49.5 and 23:30 within 1 mm); on the pillar plate three through holes, at 12
  o'clock past the wind indicator's post, past the access hole at 4 o'clock (9:03 and 40:05), and over the barrel (9:03). None has a known use; each is in
  `holecheck`'s expected empty with its source. Keep: the train bridge's other readings (Review-results.md) are too loose to move holes measured on 6:49.0. `d33651a`
- **The barrel bridge's cut round the balance had a step under the fusee's dust cap** (seen by the user on the page, 15 October 2026). It was three circles joined: the balance's clearance and a circle fitted on the top-view photograph, both 1-1.7 mm outside the real edge past the balance, and a circle traced on 6:49.0 from the cock's horn toward the fusee, 1.5-1.9 mm outside it (that frame's camera is out by as much on the bridges' right side); where the last met the others, behind the dust cap, it left a step. KLUwI2UUCMQ 13:04.4 shows the whole cut face-on: one circle, r 20.06 about (2.03, 9.96), 0.11 mm rms over 196 deg. Keep it the one measured circle (`BB_CUT`); don't join circles from frames that see only part of it. `1ec6538`
- **The cock's steady pins were 2-4 mm out and 0.84 mm across** (placed by eye on 6:47 to about 2 mm). Measured from the cock screw's hole, 6:47 and 23:30 agree within 0.4 mm; their holes are r 1.07, as wide as the screw's (r 0.42 drawn). Keep `S.ckp` relative to the cock screw: the screw's own place is open (Review-results.md). `2ffb801`
- **The barrel bridge had no steady pins, and two "holes" in it were those pins** ("Bridge - Barrel, complete with pins"; 13:04.4 shows one standing out of each horn). The 15 October hole survey read them end on as holes (30.07, 1.61) and (-18.55, 19.90); the train bridge's hole at (-23.3, 20.4), "its use unknown", is the far pin's. Now pins (`S.bbp`) in train-bridge holes, the cock side's new. Keep a round mark on a frame of a part's underside checked for a pin before it is drawn as a hole. `2ffb801`
- **The barrel bridge's near screw was 2.4 mm out** at (35.18, 8.06), moved there on 12 October through 6:49.0's camera, which reads the third pillar screw's counterbore beside it 3 mm off. 23:30 (its tapped hole) and 13:04.4 (its clearance hole) agree within 0.9 mm: now (32.90, 6.60). Keep a single oblique camera from moving a hole near the rim against frames that see the part face-on. `2ffb801`
- **A plain hole in the upper train bridge was missing**, 4 mm beyond the train-blocking screw's: (-8.70, 22.00), r 0.75, on 23:30 and 6:49.0 within 1 mm; its use unknown (holecheck.py's `EXPECTED`). `2ffb801`
- **The fusee's dust seal's flange hung 1.3 mm over the barrel bridge's cut round the balance** (seen by the user on the page, 15 October 2026). The flange, a disc r 8.6, was drawn before the cut was measured as one circle (`1ec6538`), which brought the cut to 7.33 mm from the fusee: the disc ran 1.27 mm past the edge across 7.7 mm, over the opening with nothing under it. The photographs of 2E12055 and 2E11795 (top view) show the flange's edge ending at the cut's. Now the flange is trimmed along `BB_CUT`. Keep anything sitting on the barrel bridge inside its outline when the cut or the outline moves `fea724b`
- **The barrel bridge had a round hole at 3 o'clock that is really a pry slot** (the 15 October hole survey read it as "a second hole beside the opening"). 13:04.4 shows a rectangular slot in the underside, 2.1 mm wide from r 35.2 out through the rim; 6:47 and 6:49.0 show the face whole above it, so it is blind (1.0 mm deep, estimated). Now cut by `facePocket` (`S.bbN`), the r 0.9 hole and its holecheck entry gone. Keep a mark at a part's edge checked from both faces and the rim before it is drawn as a hole. `98224e7`
- **The balance cock's screw was 2.2 mm toward 3 o'clock from where three frames put it** (handed over as open, 15 October 2026). It stood where the top-view photograph's similarity placed it; its tapped hole in the train bridge reads (21.81, 24.96) on 23:30, (21.95, 25.66) on 13:49.5 and (22.26, 24.00) on Jd2c3x8VKsE 26:00 (another movement, through a camera fitted on nine named points). Now `S.cock` the mean, the pins with it (measured from the hole), the stud's frame left on the old place (`CK_Q0`), and the body's estimated wall moved the least that keeps 0.48 mm round the counterbore. Keep the screw where the train bridge's hole is measured, and the stud's frame apart from it. `5a3411b`
- **The Wempe against its coloured section** (17 October 2026, 1b75b90f): the model cut through each pair of arbors and set beside `Wempe_Einheitschronometer.jpg` at its scale (9.37 px/mm: its arbor spacings agree with the plan to 0.1 mm) found these wrong. The balance's hub screws (WN-10) went in from under the flange; the section draws them countersunk flush in the arm's top, down into the flange's M1 (05 03 01-1's "0,4", the countersink). The dust plate's recess faced the plates (estimated); the section has it toward the key, as the sheet's tapered hole does. The balance's setting screws' heads were Ø 2.0 × 0.6 (Ø 2.5 × 1.3 and 1.4 on the section, Ø 2.5 on Wempe 3955), the movement ring screws' 2.25 high (3.05), the stud's screw blind in the cock with a 0.8 head (through it, 1.6), the dial's pin 2.0 deep in the ring (3.7). The numbers: the lower setting screws carried WN-16, the banking screw's label (theirs reads WN-10); the detent foot's and block's steady pins had WN-201 and WN-205 the wrong way round; the stop bar spring's pin was 05 06 03-2 (05 06 04-4); WN-13, WN-15, WN-27 and the upper cock's WN-55 were unrecorded. Keep: a reading taken off the coloured section measured on it in drawing pixels and said where; the dimensioned sheets still decide where they give a figure.

## Setup, case and gimbals

- **The Wempe's box had two short hinges, no lid stay, and hex steel nuts on its gimbals** (16 October
  2026, the audit of 3.00.00). Every photographed box (Greenwich's wartime Wempe, Wempe 5377 and 6161,
  Lange 1947) has one piano hinge across the back (148 long on Lange 1947's) and a lid stay (6161's a
  slotted brass bar on the left); the README said the photographs showed two hinges. Wempe 3955's
  inner pivots are locked by knurled brass discs inside the ring, where the model had hex steel nuts
  outside it under the screws' heads; the bearing discs, the bezel's lower band and the transit lock's
  knob are knurled on every photographed one. Keep: the hinge's leaves meet its knuckles at their
  tangent (leaves under the other half's knuckles overlap them); the stay's pivot and pin are placed
  so the bar crosses the parting line in front of the back wall at every angle of the lid (`CS.stay`
  turns it; app.js and the essay call it after setting the lid). `c3b0ab7`
- **The Wempe's transit lock stood too low, and its box flickered on the handles and the lock's lever** (16 October 2026, the
  user's screenshots). The lever was drawn at the gimbal pivots' height, 16 under the box's rim, its knob 10 thick on a Ø 4 stem
  barely clearing the rim; Wempe 5377 and Greenwich's wartime Wempe show the lever at the rim over the ring's top, a hub about
  Ø 10 standing 10.8 under a knob 4.3 thick, the knob's top about 18 over the rim, and the pin Ø 4 standing 16.7 over the lever
  (read against the knob's Ø 19.6): rebuilt so. The pin's top had been flush with the lever's top face, and the bracket's two
  blocks shared their bottom and end faces; each handle's grip (the oval, 7 to 10 off the side) overlapped the strip's middle in
  the same two planes, so both flickered (z-fighting). Keep: no two solids of the box share a face where both show; the grip
  hangs below the strip only. `fec5eb3`
- **The Wempe's winding key lay on the box's floor, where no box keeps it.** It lay flat in the
  back left corner, a place no source gave. Every photographed box (Greenwich's wartime Wempe,
  Wempe 5377, Lange 2285 and 5510, a 6MX Kirova) stands the key upright in the back right corner,
  its stem down through a hole in a shelf across the corner, its paddle up. Now a shelf (the
  key holder, `Schluesselhalter`: legs 55, 10 thick, its top 40 over the floor, the hole Ø 11 21
  from each wall, estimated from those photographs) holds it so, the body's cone seated on the
  hole's edge, the paddle facing the box's middle (its plane 83.4 from the gimbals' centre, beyond
  the swinging case's and ring's 79.4); the 1940 key, as first drawn, stands there too. Keep: the
  key rests in its holder (`KEYREST`), and nothing that swings in the gimbals reaches the corner. `1614776`
- **The Wempe's movement ring pinned to the case at 6 o'clock.** 05 08 00-3's plan, drawn from the dial side, draws the radial hole at 12 (a
  dashed pair figured "1,6"; the section shows it end on, 2.8 under the top face), and Wempe 3955 shows its end on the ring's cone at 12; the
  pin WN-202 was Ø 1.1 at 6, the "1,1 Ø" (the dial's pin hole's) and the "1,6" read the other way round, the bezel's notch with it. The closing
  plate's Ø 1.2 was drilled through where 05 01 00-2 draws it blind from the groove's floor, and the rim met the boss in a sharp corner where
  the sheet draws a round. Keep: the radial pin Ø 1.6 at 12 o'clock (-z) and the bezel's notch over it; the closing plate's hole blind, its
  round r 1.3. `b4450e1`
- **The Wempe's bowl had cracks along its cone.** Built as plan cells of rings, the narrow sloped
  rings under the inside round left hairline gaps along the 40° cone, dashed rows seen through to
  the inside (and drawn as dashes by Edges); the cone faced down, out of sight, until the bowl was
  turned over to wind. Now the bottom inside r 34.1 is one cell with its two holes, and the rest is
  turned from its profile, un-indexed and smoothed round the axis only, so the profile's corners
  stay sharp. Keep: a turned part nothing crosses is turned from its profile, not built of rings. `4fd36fb`
- **The Wempe's key: its grooved pin lay in the paddle's plane, the paddle sank into the slot's
  floor, and its square socket was round.** The pin (51 00 11-6) ran along the paddle, inside it,
  pinning nothing: 05 01 02-2's cross hole crosses the 3 mm slot, so the pin goes through the
  paddle's thickness (it shows end-on where the paddle shows its face on 51 00 11), 4 −0.05 under
  the body's top (drawn 3.2). The paddle's centre was 10.6 over the body (scaled), its rim 0.35
  below the slot's floor, the Ø 35 arc 6.3 deep (sure): now 10.95. The socket was a round bore Ø 3.1,
  which the 3.1 square's corners (r 2.19) couldn't enter: now the square cut, 3.1 +0.05 × 19, its
  corners as the arbor's square has them. Keep: the pin across the slot; the paddle on the slot's
  floor; the socket square, so the key can go on the square (`fine.py --model wempe --eval` with it
  there finds nothing new). `a422612`
- **The setup ratchet's teeth 0.72 deep with faces leaning back** (OPEN-QUESTIONS.md). Measured on the wheel held loose at KLUwI2UUCMQ 38:25.8 and 38:26.0
  (`tools/ratchetface.py`, calibrated on synthetic frames blurred as the video): 0.48 mm deep
  (0.42-0.53), the faces undercut 3-6°; a lean back is ruled out. Now 0.48 (`SRD`, gearGeo's
  `rd`, `ratchetProf`'s `rd`) with radial faces, and the click seated on its outline
  (`phaseAgainst`'s `deep`), 0.43 inside the tips; bom-fn.js's setup-click check asks that the
  free turn bring only a back under the click (under half the face's rise), not that the gap
  open, which only a leaning face gives. Keep: the click's seating, the clearance bisection's
  `RT` and the drawn teeth all from one depth and profile. `4918893`
- **The winding key's copies stayed a T bar with balls** after the box's key was redrawn from
  KLUwI2UUCMQ 0:45 (pipe, neck, cone, collar, paddle; `3d75292`): the key shown on the fusee's
  square while winding and on the hands' square while setting kept the old form, and the hand-setting
  copy carried the cannon pinion's line, so that piece's sheet measured the key too. One key
  (`windingKey`, core.js) now serves all three, the copies tagged with its own line (42044).
  Keep: a part drawn in more than one place is built by one function. `91ea7d2`
- **Setup cover shaped as a 220° fan.** The photos show a bow-shaped plate
  straddling the barrel arbor, with a curved slot showing the ratchet and click,
  and screws inside the outline. `9606cc3`, `cc70482`
- **Setup cover's rim side wrong.** Its rim-side edge ran at 8.7 mm from
  the arbor with a curved slot cut in the plate to show the teeth and click.
  The top-view photograph, the 2E12055 photograph and Fig. 24 show no slot:
  the plate is waisted on both sides, and on the rim side its concave edge
  comes to 5.9 mm from the arbor, uncovering the teeth and the click's tip.
  Traced through a fit to the cover's two screws and the arbor; the edge is an
  arc within 0.5 mm of the tracing. Keep: check the cover against the
  photograph with `tools/topview.py`. `54fdbfb`
- **Setup cover lopsided.** Its centre-side edge came to 6.4 mm from the arbor
  and bowed in 0.07 of its chord against the rim side's 5.9 mm and 0.105, and
  its four corners stood at 12.6-13.1 mm, one end an arc through three points,
  the other a spiral. Both photographs show a plate symmetric about its long
  axis and across it, both sides bowed alike (about 0.1 of the chord). Now two
  end arcs round the arbor (r 12.87, 76.5°) and two like concave sides to
  5.95 mm; the click's tip is still 0.5 mm clear in the rim-side gap. Keep:
  the outline built symmetric (`CA`, `CH`, `CR`, `CW`). `d4f788a`
- **Setup cover centred on the arbor, its waist too wide.** The symmetric
  outline was centred on the arbor with its sides 5.95 mm from it. Its edge,
  traced along the outline on both photographs, shows a symmetric plate whose
  centre is 0.4-0.6 mm off the arbor toward the movement's centre, its sides
  5.4-5.6 mm from that centre: the rim side's edge was 0.8 mm short of the real
  one on both. Now fitted to both traces (centre 0.53 off, sides 5.58, ends
  r 12.69 and 75.6° wide); every side and end within 0.2 mm (median) on the
  top-view photograph, 0.5 mm on 2E12055. Keep: the outline symmetric about
  its own centre `Q0`, not the arbor. `fc29280`
- **Setup ratchet 1.1 mm too large, the click's pivot 1.3 mm too far out.**
  The ratchet's tips stood at 8.16 mm from the arbor and the pivot at 10.25.
  The pivot's end shows in the cover 8.95 mm out on both photographs; the
  video, measured against the cover screws' tapped holes (23.6 mm apart),
  puts the tips at 7.04 and the pivot 1.34 tip radii out, and the top-view
  photograph the tips at 7.0-7.3. The earlier 10.25 was read by eye with the
  model's ratchet as the scale. Now the tips at 7.05 (`SUT`; 42 teeth), the
  pivot at 8.95, the click's tip at the new root and its spring at 1.273 tip
  radii. Keep: read sizes on the video against a part whose size is known
  from elsewhere, not against the model's. `c603feb`
- **Engraving under the dust seal.** "MARINE CHRONOMETER" and "TWO-DAY, 56
  HOURS" were shortened so the flange no longer covers them. `9606cc3` The
  photographed text that replaced them runs full length; the block moved
  2.5 mm toward the rim instead. Keep: every line clear of the flange (r 8.6
  round the fusee) and the barrel pillar screw's head.
- **Case 13 mm too wide, holding nothing.** The movement was added at the
  bowl's origin and nothing touched it: the bowl's bore was r 64 round a
  mounting ring of r 47 and a dial of r 50.8, its lip at r 62 three millimetres
  above the dial, the gimbal ring at r 80. The manual's case holds the movement
  by the movement's own parts (Sec. III: the dial in "the shoulder recess around
  the top edge of the case" when the movement is put on it upside down, the
  alignment pin in its slot; the case parts list, Fig. 107, has nothing between
  them). The case is now built from the movement: the mounting ring's flange
  sits in a recess round the top on a shoulder, the pin in a slot down to it,
  the bezel screwed on round the 105 mm rim (top-view photographs); the gimbal
  ring (r 66–68), the brackets, keeper, latch lever and pivot screws follow.
  Keep: the case's sizes derived from the movement's constants (`DB`, `SH`,
  `CR`, `TR` in `box.js` from `MR_RO`, `MR_Y`, `DIAL_R`), not literals;
  `bom.py`'s "42057 on 42101"; after a change to either, the movement checked
  against the case with `fine.py --eval` attaching the bowl's meshes to
  `__mv` (0 new or grown). `8ec1d92`
- **Shield plate's screws in the box's felt.** With the case level, their
  heads reached 0.75 mm into the felt. The floor is 2 mm shallower (`FD` 64)
  and the winding key's handle 2 mm higher. Keep: the case's lowest point
  above the felt (y −89). `8ec1d92`
- **Gimbals as blank blocks.** Replaced by a flat ring on pivot screws, with
  washers, lock nuts, case support brackets and straps (Figs. 1, 94, 106). The
  ring was raised so the case clears the box floor. `eae5358`
- **Case's winding hole open at rest, and the shield plate showing through
  the floor.** The shield plate turned 1.1 rad away from its open position and
  was too narrow to cover the case's hole there. Its top face lay in the
  floor's plane, so from inside the bowl its outline flickered through the
  floor, and so did the stop screw's end. Its return spring was buried in the
  plate. The shoulder screw's head was smaller than its shoulder and never
  reached the case. The new flat bottom (48 curve segments against the wall's
  120) left a dotted ring open at r 44.
  - The fix:
    - The plate is a rounded triangle that covers the hole at rest and turns
      0.75 rad to open it. The stop screw runs in an arc slot whose ends set
      both positions.
    - A torsion coil sits between the plate and a slotted head wider than
      the coil.
    - The bottom is 1 mm thick, and the plate hangs under it.
    - The bottom's rim has the wall's 120 points.
    - The winding key's handle is 3 mm lower, clear of the plate and its
      screws.
  - Keep:
    - Nothing hangs under the case bottom within 1 mm of its inside face: at
      0.05 mm, depth precision let the edges through.
    - The plate covers the hole whenever it isn't open.
    - A shape joining the lathe has the lathe's vertices round its rim.
  `c0a7531`
- **Shield plate not as Fig. 107 draws it** (`Review-results.md`, BOM
  comparison, still open 2). It was a rounded triangle on a shoulder screw
  beside the key hole, its return spring a torsion coil hanging under it.
  Fig. 107 draws a disc nearly the size of the case's bottom, its three holes
  (the shoulder screw's at its centre, the key's, the stop screw's opposite),
  and the spring an open ring between the plate and the bottom, hooked on the
  stop screw. Now so: the disc turns on its shoulder screw at the case's
  centre, the ring runs from the stop screw round to a pin in the plate and
  is rebuilt as the plate turns (`shield.userData.turn`, which app.js calls:
  the page's picking pass takes every mesh's `onBeforeRender`). Keep: the
  plate turned only through `turn()`, so the spring keeps its hook on the
  screw and its end on the pin; nothing under the bottom within 0.5 mm of it. `cce56d7`

- **The case's bottom, the winding key and the box's handles drawn by eye.**
  The case's bottom has the raised ring round the shield plate (47:35; the
  plate r 33.3); the key is a pipe, cone, collar and flat paddle (0:45; it was
  a T bar with balls); the side handles are a bail between two rosettes at the
  gimbal pivot's height (0:45). Keep them traced (SHAPE-PASS.md, 7-8). `3d75292`

- **The gimbals' lock nuts, the latch's head and the box's brass corners drawn
  by eye.** The four lock nuts r 8.5 (were 4.2-5) and the latch's clamping head
  r 8.5 (was 2.0), from 1:15 against the bezel and Figs. 1, 11 and 106; the
  brass corners short caps near the top and at the foot of each edge (Fig. 1;
  were full-height strips). The box's size checked against sale listings
  (190-197 mm): unchanged. Keep them measured (SHAPE-PASS.md, gaps 1). `7bb49ad`

- **The gimbals kept the case level at sea.** The case hung as a pendulum on pivots fixed in space,
  so as the box rolled it stayed within 0.14° of level. At sea the box rolls about the ship's axis,
  metres below it, so the pivots accelerate and the case hangs along the apparent vertical, gravity
  less their acceleration, which leans it several degrees at the ends of a roll. The pendulum now
  takes the pivots' acceleration from the ship's roll and pitch about axes 5 m below (`gimStep`,
  `GIM` in `box.js`, estimated), one function for the page and the export: 5.4° at 7 s and 14°,
  within 0.2° of the apparent vertical; faster than a ship rolls the box stands for one rocked about
  its pivots. Rocking now eases in as it eases out. Keep: the page and the export call the one
  `gimStep`; the ship's motion comes with its rates (`GIM.sea`). `1fb1c1d`
- **The export's At sea jumped where it looped.** The pitch ran at 0.7 of the roll's rate, so the
  clip's six rolls held 4.2 pitches and a looping clip jumped 1.4° of pitch at its seam (5.45° to
  6.88°), and the case started level, its own swing still settling. The pitch now runs at two thirds
  of the roll's rate on the page and in the export (`GIM.PR`), so the motion repeats every three
  rolls and the six loop, and the clip lets the case settle over whole repeats (30 s and more)
  before it starts: the seam is under 1e-5°. Keep: a looping clip's motions in whole cycles of it,
  started from their steady state. `b8ba747`
- **The Wempe's 1943 key: its paddle 1.6 too high, its spring loose round the tube.** 05 01 02-2's
  6.3 +0.1 for the slot's Ø 35 floor was taken as its depth at the axis; its extension line leaves
  the arc where it meets the body's outside, so the floor is 7.40 under the top at the bore's edge,
  where the paddle rests, and its centre 9.37 over the top (10.95 before; 51 00 11 scales 9.37).
  The tube's head stood 6.8 under the top (estimated) and would have cut the lowered paddle: 51 00
  11's section draws it 8.0 under. The coil spring was a 0.9 wire standing 0.08 clear of the tube,
  its end not drawn, so nothing could grip: now as the section draws it, about 12 coils of 0.6 wire
  on the tube, its end turned down into the body's Ø 0.9 hole, and the grooved pin 15.3 long, its
  ends showing (13, hidden, before). Keep: the paddle rests on the seat's edge at the bore, the
  tube's head under it, the spring on the tube with its end in the body (*The Mariner's
  Chronometer*, Fig. 2.35, shows a 1943 key taken apart so). `d125c5a`
- **The Wempe key's body was a plain turned solid, the paddle, pin and spring's end in its metal.**
  Now cut as 05 01 02-2 draws it: the slot and its Ø 35 floor, the cross hole through both jaws
  and the paddle, the spring's slanted Ø 0.9 hole. Built as four solids joined into one closed
  surface, the faces where they meet dropped: kept as separate meshes, those faces met the
  surface's edge at its own depth and drew a dashed line round the body. Keep: the joints' outlines
  the same points on both sides (the solid under the jaws takes the jaws' column points), and no
  sloped face with an edge in a joint's plane (the drill point's foot 0.12 above the lower joint). `4d54002`

## Accuracy to the manual

- **UP/DOWN scale laid out wrong.** It follows Fig. 107: UP at upper right,
  running clockwise round the bottom. `7a91d18`
- **Balance screws.** Per the parts list: 10, in pairs, three head heights.
  `7a91d18`
- **Part numbers and descriptions** corrected, for example stop-bar 42024 and
  winding stop 42099. `7a91d18`
- **Escapement views looked from the wrong side.** They now look from the
  pillar-plate side. `7a91d18`
- **The model started itself.** Wound after running down, it simply ran again;
  a detent chronometer is started with "a single quick twist" of its box
  (Sec. III). The balance's amplitude is now state: the train stops below
  `ESC.AMIN` (39.2°: the swing must pass the trip spring, unlock the wheel and
  finish the impulse), at run down, against the balance locking arm or at the
  train-blocking screw's dog point, and a stopped chronometer needs Twist to
  start. Keep: the hands and `tSim` stand while the train is held, and nothing
  jumps when it starts again (`H.bOff`, `H.eOff`). `63c5dce`
- **The minute wheel and the wind indicator wheel turned on arbors of their
  own**, the wind indicator's running through the pillar plate. The parts list
  has posts (42085, 42084) screwed to the plate (35779); the wheels turn on
  them. `63c5dce`
- **Parts in the parts list were missing**: pillar screws from the dial side,
  the mounting ring's screws, dial screws, the posts, the barrel and fusee upper
  bushings, the endstone caps and settings, the setup pawl pivot screw, the
  balance's cap and hold-down screws, the balance locking arm and the
  train-blocking screw. See `Review-results.md`, "Every part against the
  manual". `63c5dce`
- **The hairspring collet was a stand-in.** A flat 130° sector with a short
  radial bar and a solid block for its clamp, the hub slotted on the far side
  and the spring's end inside the block 4.6 mm out. Figs. 5, 6 and 49 draw a
  stepped block: the hub on a plate slit from the bore to a relief hole, a
  ledge cut back (straight, then round) over a tongue at its foot, a notch in
  the tongue for the wedge pin, and a C-shaped clamp slid over the tongue's
  end that pinches the spring's end against it. It is now measured on Fig. 6's
  two drawings (README, "Estimated, not from the manual"), and the spring's
  inner end runs straight along the end face into the clamp, 4.43 mm out (the
  collet sized against the coil the restoration video measures, r 6.3).
  The clamp closes over the spring above and below, so the hairspring now
  comes off with the balance in the Exploded view (the spring had to pass
  through the upper jaw). Keep: the collet's shape is Fig. 6's; the spring's
  inner end is where the end face and clamp hold it. `6839be8`

**The parts list against the model: parts missing, parts holding nothing,
pivots without shoulders, jewels floating or buried** (`ae397f2`). Checked
line by line against the manual's parts list (Sec. XI, Figs. 106-110) by the new
`tools/bom.py`, which measures how each part is held and runs:
- *Missing or short:* a dial screw and foot (the manual has 4, the model had
  3); the second 1770 screw (the trip spring bracket's); the dust seal's seal
  ring and helical spring; the latch's clamping bracket, clamping screw,
  take-up spring and its two screws, and the washers under the bracket's
  screws; the keeper's screw and separating washer; the four pivot-screw
  bushings (42214). All added.
- *Holding nothing:* the barrel cap's five screws were heads on the cap; the
  hairspring stud screw stopped at the stud; the winding stop wasn't screwed
  into the barrel bridge (a block sat inside the bridge); the locking arm's
  stop pin stood on the bridge's face; the balance screws had no threads; the
  timing and vernier weights were solid, not nuts on their screws; the latch
  bracket's screws were 2.5 mm long in a 10 mm wall; the sustaining ratchet had
  a 5 mm bore round a 1 mm arbor, nothing locating it. Each now goes into its
  part.
- *Pivots and endshake:* the train's arbors were plain cylinders through their
  jewels and bushings, with nothing to stop them along their axes (the fourth
  wheel could move 2.7 mm, the third 0.74); the balance's 0.17 mm. All are now
  turned to pivots with shoulders, 0.05 mm endshake each (Ops. 15, 69, 74).
- *Jewels:* the third arbor ended 0.47 mm short of its lower jewel; the lower
  train bridge's settings stood proud of the bridge with the stones floating
  in them; the endstones were larger than their caps' holes (buried in the
  metal); the escape lower jewel was 1.2 mm thick; the impulse jewel had no
  slot in its roller and the locking jewel no seat in the detent's block.
  Settings now go into their bridges, stones sit in their settings, endstones
  in their caps, pallet stones in their slots; olive-hole jewels for the
  balance and escape arbor, bar-hole for the third and fourth (Sec. II).
- *Fits:* the cannon pinion had 0.10 mm play on the centre arbor (a friction
  fit, Op. 58); the hour wheel lay face to face on the cannon pinion's leaves;
  the second and wind indicator hands were solid bosses through which their
  arbors passed; the barrel's caps had 0.10 mm shake; the bushings and the
  sustaining pawl's arbor overlapped the bevel of their holes; the winding
  ratchet hung 0.1 mm below the fusee; the setup click stood 0.08 mm off its
  tooth; the trip spring's foot sat 0.05 mm under its screw's head.
- *Gimbals and case (Fig. 106):* the ring pivot screws had the washer inside
  and the lock nut outside the box (the figure has them the other way); the
  pivot screws' points didn't enter the ring or brackets; the latch lever
  turned on a plain pin (it turns on the clamping screw); the straps were
  flat boxes on the curved ring.
Keep: every piece carries its parts-list line (`hn()`), and `bom.py` passes
after any geometry change (`BOM.md` regenerated). A thread or pin needs its
hole in the part it holds (tapped) and the parts it passes (clear), or, where a
hole across an extrusion or turned part can't be cut, the `embed` relation.
An arbor needs pivots and shoulders; a stone its seat.

- **The hands' outlines generic**. They were stock
  shapes drawn for a 4 in dial and scaled; they are now traced on the
  photographed Hamilton dial (`HAND_W`, core.js): the hour hand's swelling stem,
  round-backed bulb and needle, 0.8 mm longer; the minute hand a long leaf, not a
  parallel blade; the seconds hand a needle with an arrowhead counterpoise; the
  UP-DOWN hand's boss r 1.86, not 0.9. Keep them traced, never redrawn by eye
  (SHAPE-PASS.md, 1). `1589a10`

- **The balance's hairspring, stud, arm and timing nuts estimated.** On the
  restoration video (6:49.8-6:53, 41:58): the hairspring's coils r 6.3 and 9
  turns (were r 5.5, 14); the stud's bar along a row of three measured holes in
  the cock, 3.8, 6.9 and 10.4 mm from the staff, held by its screw in the middle
  one and a steady pin at each end (was one pin, the screw 7.6 out along the
  line to the cock screw), the cock's underside flat out past it (its cove from
  11.3, was 9); the arm 1.9 wide (2.4); the timing nuts 2.3 long and 2.1 across
  (1.7 and 2.4), so their travel is 2 turns either way, all the room the barrel
  bridge's measured cut leaves (was 3); the balance upper setting gilt (41:58,
  the cap off; the cap itself steel, as the top-view photograph shows). Keep
  them measured (SHAPE-PASS.md, 2). `a06b0fe`

- **The balance cock's arm swept into the body in an estimated cove.** On the
  restoration video (44:02, the cock in place from its straight edge; 23:45)
  the arm is flat underneath out to the body's wall, a square step, and its
  underside and walls polished; the cove is gone. On the way: the stud's three
  holes in the cock (the balance's entry) needed counterbores in the arm, which
  stepGeo now cuts there as in the body. Keep the arm's underside traced
  (SHAPE-PASS.md, 2). `65f770a`

- **The hairspring drawn a fifth too large** (the balance; Review-results.md,
  25). Its coils were r 6.3, read on the restoration video side-on against the
  rim "between its ends", which the gloves and a timing weight hide, and against a
  disc taken for the impulse roller. Against the rim in one picture each, the
  video side-on (the rim's edge where it turns, behind the weight) and face-on,
  the manual's Fig. 2 and two photographs give the coils' outer edge 4.7-5.8,
  median 5.26. Now r 5.1, the collet scaled with it (a reading of r 4.8 the same
  day fitted the rim to its near side's holes, which perspective spreads). With
  the Navy's brake fitted, its arch, which the coils ran into at full swing, now
  clears them by about 1 mm. Keep: the radius read against the rim's turning
  edge or its fitted ellipse, never against ends a glove or weight may hide; the collet scaled with the coil (CKS). Its turns were 9, from
  wires counted 26 px apart on the video, every second one: 13 wires down each
  side, so 12 turns. Keep: count the wires by their period over the whole stack.
  And it stood 5.9 from the rim's top edge up; the video side-on has it running
  down behind the rim, 7.15 or more: it now starts 1.1 below the rim's top, as low
  as the hub lets the collet go, and stands 6.7. `9c8fdc3`

- **The hairspring stud's clamp was in the wrong place.** It was a block on
  the bar between the inner steady pin and the stud screw, 4.6 mm from the
  staff, the bar ending 0.8 mm past the pin. Fig. 5, Hamilton's patent
  US 2,379,780 (Fig. 10) and the restoration video (6:47.5, 6:47.75, the
  stud seen from the cock side) put it under the bar's inner end, past the
  pin: the bar ends 2.2 mm inside the pin, the clamp drops from its
  underside from there to 1.1 inside, the wedge pin's end shows in the
  bar's top face 1.7 inside, and the spring's upper end is 2.65 mm from the
  staff. Keep the clamp at the bar's end (`SP_E`, `SP_ST`, `SP_CL` in
  `movement.js`, `HS_R` computed from them, `essay.js`'s `HS` to match). `e37f857`
- **The balance's damping rested on an endstone friction worked out ten to twenty times too large, and `TF` 52 s on
  the parts list's spring** (OPEN-QUESTIONS.md, "The balance's free run-down", 12 October 2026). physics.js gave the
  staff's flat end on its endstone 49-53 % of the loss at 255° (μ 0.10-0.15 across its whole face, Q 378-793); a real
  Model 21's small free swings (BunnSpecial's No. 2182, `Jd2c3x8VKsE` 14:04 and 16:10) fall in a straight line at
  0.16-0.238° a second, a constant torque k c T / 4 of 32-47 nN·m, Q 6,760-10,050, 4-6 % of the loss. Now the
  measured friction (the parts' Q 406-712, 65-113 s), and with the videos' mainspring (0.78 N·m fully wound, 0.83 of the
  old) `TF` 68 s (Q 427), so the calibrated torque, 62.6 µN·m, is the new spring's through the same train and losses
  as the old calibration took; the overlap of the parts' Q with the budget counts the mainspring's own losses (278-463),
  without which the parts would swing a loss-free spring's balance past 1½ turns. Keep: physics.js's endstone term
  from the measured swings, not a μ; `TF` re-derived whenever the mainspring's stiffness changes; the essay's
  `data-phys` figures physics.js's. `6a918d8`
- **The timing weights had 2 turns either way, set by a cut that had moved** (handed over from the barrel bridge's cut, 15 October 2026). Their travel was all the room the barrel bridge's cut round the balance left when it was drawn at r 17.6; measured on 13:04.4 it is 19.5 from the staff at its nearest. The manual wants 3 turns at about 40 s a day: Op. 5 leaves the rate within 2 minutes a day by screws and washers, and Op. 6 regulates with the timing weights alone (p. 81). Now 3 turns either way of a mid-travel 3 turns off the rim (`TG` 0.534, three of `R.pitch.t`), the panel's slider ±24 eighths. Keep `TG` three pitches, so turned fully in the nut meets the rim, and recheck the travel against the cut when either moves. `45678d2`

## Rate panel

- **Balance far too light.** The screws and weights were drawn as cylinders
  (19–39 mg instead of 125–255 mg), giving 576 g·mm². With the parts list's
  masses (p. 82) it is 931 g·mm². `78ffd0f`
- **Rate per turn didn't match the manual.** It was 59 s and 12.5 s a day.
  Thread pitches were fitted so a full turn of a pair gives the manual's figures
  (p. 70): about 40 s for the timing weights and 2.8 s for the verniers.
  `78ffd0f`
- **Weights sank into the rim** when turned in. They are now nuts on screws at
  mid-travel (Fig. 3). `78ffd0f`
- **Wording:** turning a weight out raises the moment of inertia, not the mass.
  `78ffd0f`
- **Rate book: a comparison between noons restarted the mean daily rate.** A
  row too soon after the last to give a rate stopped the run the mean is taken
  over, as a break would. Such rows are now skipped; only a break (started,
  stopped, set, not wound) starts a new run. Keep: the mean's run ends at a
  break, not at a row without a rate. `e7b1398`
- **Balance lighter than the manual's.** The moment of inertia was 930
  g·mm²; the manual's Table II (screw changes and the rates they make) fits
  1,140 g·mm² with the parts list's masses, and Fig. 3 draws the rim as a band
  about 4.3 mm tall where the model's was 2.4. The rim is now 4.3 tall and 1.12
  wide (fitted to 1,140), the screws and weights at its mid-height with heads
  2.6 mm across as Fig. 3 draws them. Keep: `invariants.py` checks 1,140; a
  change to the balance keeps Table II's moment (the pitches follow). `ff40402`

- **The balance screws stood off the rim's holes.** The rim was
  drilled with 60 holes 6° apart and the 10 screws stood 14.3° apart about the
  quarters, off that grid, with the holes under their heads left out; the timing
  weights stood 12° from the arm's ends and the verniers outside the rim. The
  manual's numbered block (Fig. 99) and Table IV number the holes 1–13 round
  each half with 7 on the quarter, and the restoration video (KLUwI2UUCMQ
  6:47.5–6:53) shows 24 holes 15° apart, the timing weights at the arm's ends,
  the verniers inside the rim one hole on, and four pairs of screws in holes 3,
  5, 9 and 12. The rim now has those 24 places, the screws and weights stand in
  them, the rim is 3.5 tall (the video) and 1.578 wide (refitted to 1,140) and
  the heads 3.3 across. Keep: every screw and weight stands in a numbered hole,
  hole 1 at the arm's end and 7 on the quarter, a pair in the same hole of each
  half; `invariants.py` checks 1,140, Table IV and that a moved pair keeps it. `7624339`

- **The balance's rim drawn 2.6 times too thick; the screws without their points.**
  The rim was 1.578 mm thick and 3.5 tall, sized so that the drawn balance
  made Table II's 1,140 g·mm², and the screws stopped at its inner face. The video
  measures the rim 0.6 thick (three frames, edge-on, scaled by the rim's 29 mm
  and the impulse roller's 0.249 in) and about 3.5 tall, the heads 2.9–3.2
  across (face-on; a side-on 4.1 was a near and a far head overlapping), each
  screw running through the rim to a brass point inside it, and the verniers'
  screws standing 1.6 outside the rim. Now drawn so, with the 410 g·mm² the
  drawing doesn't make added as `I_REST`. Keep: draw the balance as measured
  and keep the moment Table II's (`invariants.py` checks 1,140). `fa37969`

- **The balance's moment of inertia 37 % more than the drawing carries (`I_REST` 410 g·mm²).**
  Table II's screw changes, worked with the parts list's masses as each screw's,
  need 1,157 g·mm²; the balance drawn as the video measures it made 731. The
  masses are now read as a matched pair's (`PM` in `movement.js`): Table II then
  needs 578 and the drawing makes 534 (`I_REST` 44, 8 %), the steel timing nut as
  measured weighs what a pair's 93 mg gives it (about 47-53 mg; 93 is impossible
  at its size), and the screws' heads come out near brass, not gold. The rates the
  panel gives are unchanged (they follow Table II and the manual's 40 s and 2.8 s a
  turn); the hairspring's stiffness halves, to about 91 µN·m a radian. Keep:
  `invariants.py` checks 578 and `I_REST` under 10 %; a balance part redrawn
  must keep the drawing near Table II's moment, not grow `I_REST`. `3d33ca5`

- **The hairspring drawn as round wire with sine-ramp ends, its pull on the pivots unchecked.** Its terminal curves were a sine ramp in from the coil to
  each end, which leaves 2.4 % of couple / R on the pivots, and its wire was round (0.34 mm). It is now the spring `HSPR` designs: both terminal curves
  solved to Phillips' conditions (the outer from the coil to the stud's clamp along the bar, 14.8 mm; the inner to the collet's end, 21.8 mm), 2.5e-5 of
  couple / R on the pivots; a strip 0.23 by 0.221 mm (the video's width; the thickness from the stiffness Table II's balance needs); the collet's end at
  3.2 from the staff (the video 2.8-3.9; a short inner curve meets the conditions only at 2.9-3.3), the collet scaled from it. Keep: `invariants.py`
  checks the strip against the stiffness, both curves' residuals and the force; `tools/hairspring.js` the design from movement.js's numbers; the
  spring mesh keeps hn 42188, the stud clamp 42191.st and the pin 42147.st (the stud check counts the strip in the clamp). `3824b8b`

- **The balance's free decay and the detent spring's share estimated, the energy unbudgeted.** `TF` was 25 s and `fD` 0.03, both guesses, and with the
  parts list's spring and the train the balance could not have held 255° (the damping asked 4-7 times what the spring gives). `tools/physics.js` now
  budgets it: `TF` 34 s (the Q the mainspring, fusee, train and escapement allow at 255°), `fD` 0.057 (Op. 78's 0.770 g preload over the release's lift),
  the escape wheel's inertia measured on its solid. Keep: `physics.js` fails if the model's `TF` or `fD` leave what the budget and the test allow, and if
  the essay's quoted figures differ from it. `203b2a6`

## Rendering

- **The Wempe's hands showed a broken line down their middle.** Each blade (`blade()` in `wempe/js/dial.js`)
  was one solidGeo cell whose top follows the thickness along the hand, and earcut triangulated it whole: long
  slivers from a point on one edge to a point far along the other, tilted to either side (|nx| up to 0.70 on the
  hour hand, 0.58 on the minute hand, 0.33 on the seconds hand's tail), which shaded as a dashed line where the
  slivers crossed the middle, and Edges inked their creases. The blade is now a strip of cells, one per station,
  so each top triangle spans one station's step (|nx| ≤ 0.007). Keep: a sloped face (a solidGeo cell with a
  function for y) is cut into cells along its slope, never triangulated whole. `3c7fe98`
- **The Wempe's stop bar flickered through the fusee's small end.** The slot the bar slides in
  wasn't cut in the turned body, and the bar, drawn flush with the small end's face, shared that
  face: wherever the cover plate wasn't drawn (hidden, faded, see-through, a phone zoomed in on
  it) the white bar and the brass speckled through each other. Moving the bar 0.05 onto the
  slot's floor (`00a5ab6`) hid it but was wrong: dial up the small end faces down, so the bar
  lies on the cover plate. Now the slot is cut (05 06 04-2: the turned body stops at its floor,
  the small end's last 1.5 built ray by ray in the pieces the slot leaves) and the bar lies on
  the cover plate in it. Keep: a part lying in a cut has the cut drawn round it; never a part
  sharing the face of a solid it lies in.
  The bar was drawn 2.00 wide in the slot's 2.00, its sides in the slot's walls, so where its upper end stands out
  of the slot the two flickered through each other (18 October 2026, seen beside the fusee's end made solid past N).
  Now 1.98, a sliding fit in the 2 H8 (estimated), the stop's 0.02 to the pin kept. Keep: a part sliding in a slot is
  drawn narrower than it, never its walls' width. Fixed, not yet committed.
  Keep (Winding and maintaining work, the same change): the Wempe's 05 06_4 is seen from the
  fusee's large end, its C-D as its A-B, mirrored in the model; unmirrored, the stop bar met the
  stop pin with its near side, where C-D draws the pin against its far side. And the slot is 1.1
  deep toward the bar's upper end, which is thinner: at full thickness there the bar stood 0.26
  into the chain on the turn below (fine.py). `4211e27`
- **The Wempe's Box view showed an empty box, and the bezel glass's outline through its wood.**
  From 24° the lid's front wall hid everything inside (the dial lies 59 under the lid's glass);
  and Edges drew the bezel's and the lid's glass as ghosts, whose outlines the line pass lays over
  the frame unoccluded, so an ellipse crossed the shut lid's front. The view now looks from 62°,
  reading the dial through the glass, and both glasses are `inkBox` (no lines), as the Hamilton's
  crystal and box glass are. Keep: a see-through part outside the movement draws no Edges lines. `a422612`
- **The Wempe's dial printing overlapped and didn't look like the dial.** Its
  hours were typeset in the vendored Instrument Sans (600 faked by stroking),
  all 9 high on one circle, so the 12 ran into the up-and-down sub-dial and the
  7 and 5 into the seconds sub-dial in ways the real dial doesn't, and the
  tracks were ruled lines. The printing is now Wempe 3955's: every glyph traced
  off its photograph (`tools/dialtrace.py` into `wempe/js/dialface.js`), the
  tracks, circles and band drawn from widths and radii measured on it, the 7
  and 5 under the seconds track as printed. Keep: the dial's glyphs are traced,
  never typeset; the geometric printing's numbers come from `dialtrace.py --geo`,
  and `dialtrace.py --compare` shows the canvas on the photograph. `05babc5`
- **The hairspring collet's clamp flickered.** The collet's tongue ended at
  5.1 mm from the staff, exactly in the clamp's outer face, and the clamp's
  lower face lay in the plate's face toward the balance, as did the hub's: the
  coplanar faces z-fought, showing as a patch on the clamp's outside (with the
  balance picked, its edges drawn through the ghosted hairspring). The tongue
  now ends 0.1 mm inside the clamp, the clamp's lower jaw runs 0.1 mm under the
  tongue and the hub stands 0.05 mm proud of the plate. Keep: a piece set into
  another ends inside it or stands proud of it, never flush with one of its
  faces (`audit.py` doesn't see this within one part). `e701c2f`
- **Lifted views at 80 fps on a fast desktop, 15 on a phone.** Once
  every open tube went through `closeGeo` (every part a closed solid), the
  hairspring, rebuilt every frame the balance turns, paid for it: `closeGeo`
  string-hashes all 4,500 vertices and 23,000 edges and triangulates the caps,
  about 9 ms a frame on a desktop CPU (63 % of the frame) and 50 ms with the
  CPU throttled 4×, plus a new vertex buffer each frame. `reclose(old, g)` in
  `core.js` now writes the new tube's positions and normals into the old
  closed geometry, keeping its weld and caps (`closeGeo` records which vertex
  each cap vertex copies, `userData.capOf`), and the hairspring is rebuilt only
  when the balance has turned. Same vertices and index as before; the Movement
  view went from 12.5 to 2.6 ms a frame. Keep: a geometry rebuilt as the model
  moves goes through `reclose` (the stop-bar spring does too), never
  `closeGeo` each frame; check a new one with `tools/perf.py` in a lifted
  view. `bf503d8`
- **The pawls' seating doubled in cost every frame.** When the pawls'
  outlines were resampled every 0.1 mm (`dense()`, so a tooth's tip can't
  pass between two vertices; `8cbb259`), `seatPawl`, which runs every frame
  for the two winding pawls and the sustaining pawl and tests every outline
  point about 30 times, went from 87 points to 173 and 221: 0.30 to 0.63 ms
  of each frame's `update()`. A point d from the pivot never comes nearer
  the ratchet's centre than |q|−d, so it now tests only the points that can
  come within ro+0.5 of it (`near()`, the dense outline sorted by distance
  from the pivot; 96 and 92 of them): bit for bit the same angles over 27,000
  positions round the ratchets, about a third less time. Keep: anything run
  every frame over a resampled outline tests only the points that can reach;
  `dense()` keeps its order for `maintaining.py`. `748c819`
- **Metals flat and dark after a lost WebGL context.** A restored context
  loses its PMREM render targets. The environment map is now rebuilt on
  `webglcontextrestored`. Keep that handler. `fcedc94`
- **Gold streaks across the dial when zoomed out.** The silvered face is
  0.02 mm above the brass disc, less than a depth-buffer step beyond about
  600 mm. It is fixed with polygon offset on the face material. Keep: don't
  close the gap by moving the geometry, and use polygon offset for any other
  near-coplanar faces. `e036cf8`

- **Dial and engraving drawn in the fallback font.** `document.fonts.ready`
  doesn't fetch faces used only on canvases, so Spectral 600 could be missing
  when the dial was painted; numerals sized from its figure height came out
  in Georgia, whose old-style figures made them overlap. `app.js` now loads the
  canvas faces explicitly, and the size is measured over all ten figures.
  Keep: add any new canvas-only face to that list. `274d2cb`
- **Speckled floor inside the bowl** (shadow acne). The bowl was one
  double-sided lathe, so its inside faces were back faces, and the shadow
  `normalBias` pushes back faces' lookups the wrong way. It is now two
  front-facing shells (outer, and the reversed profile for the inner). Keep: a
  surface that receives shadows on its inside gets its own front-facing shell,
  not `DoubleSide`. `4be54e9`
- **Grey streaks across the dial with Edges on, zoomed out.** Edges gives
  every mesh its own id and draws a line where the id changes. The id pass
  draws with one override material, which had no polygon offset, so the face
  and the brass disc 0.02 mm under it fought again, and each patch of disc that
  won got outlined. `makeInk` in `core.js` now copies each mesh's polygon offset
  onto the override as the mesh is drawn. Keep: a pass with an override material
  takes each mesh's polygon offset (the offset on the face material from the
  gold-streaks fix above). `c039a73`
- **Sections: cut faces patchy where a part lies on the cut one** (the barrel
  bridge on the train bridge, in a cut through the train bridge), and the
  mounting ring cut hollow. The cut face (a back face) was at the depth of the
  face under it; `SEC_DEPTH` now draws it 0.015 mm nearer, in the visible pass
  and in Edges' id pass, compiled only while a section is on. The ring started
  0.1 mm inside the plate's edge; it now starts 0.02 mm outside. Keep: a pass
  with an override material (`nid`) takes the section's depth too; overlapping
  solids show each other through a cut. `8956085`
- **Faded parts drawn solid in the ink drawing.** The ink drawing inked every
  transparent material under its alpha, as it should the engravings, so a part
  faded to 50–99 % (fades under 50 % are ghosts, in outline) became a dark
  shape: the barrel bridge at 75 %, the hands. Only materials flagged
  `userData.inkDecal` (the engravings, set in `eng()`, carried by `fadeOf`)
  are inked so now; other transparent parts are paper at their opacity. Keep:
  transparent means faded or glass as well as decal; key decal treatment on the
  flag. `ae670d5`

## Controls and display

- **The Wempe opened on its movement, its dial stayed solid in the Escapement view, and its balance stood still at 60× and
  3600×** (16 October 2026, the user's reports). It now opens as the Hamilton does: the box shut, seen from the Hamilton's
  opening camera (`openCam` in `shared/viewer.js`, `st.opening` holding the lid shut until then), easing to the Dial view as the
  lid opens, the Dial view at the Hamilton's yaw and pitch. The dial is a plate (`plate:1`), so See-through ghosts it as the
  Hamilton's. Above 5× (`REAL_X`) the balance was drawn at rest; it is now drawn swinging at its swing at 0.9 Hz of the wall
  clock, the detent still, and the HUD says "balance swing shown slowed", as the Hamilton's. The tools open the Wempe with
  `&start=movement` (`model.py`), the page opening on that view at once, as they saw it before. Keep: both pages open alike; the
  dial is see-through with the plates; a fast speed never freezes the balance. `fec5eb3`
- **The Wempe's winding in its case played several times too slowly on a slow renderer, and held
  the maintaining spring's drive.** Its steps (lid, turn, plate, key) advanced by the viewer's frame
  step, held to 0.05 s a frame, so at three frames a second the key took 13 s to come on, not 2.4: they
  now go by the wall clock (`dw`, up to 0.25 s a frame), the key on at 2.9 s there. And `wind0()` ran
  on every frame the key was on, restarting the maintaining spring's clock, so its drive never fell
  while the key turned: it now runs once. Keep: what is shown as a person's actions goes by the wall
  clock; a wind starts once. `6da89da`
- **The Wempe wound with no key to show it.** Wind turned the fusee back while its key lay in
  the box. Now, in the movement's views (the movement out of its case), the key goes from the box
  onto the fusee's square, its mouth on the dust plate, turning with it, and goes back when it lets
  go, as the Hamilton's key does (`keyOn`); it rides with the dust plate, so in the Exploded view it
  stays outside the dust bush. In the case (Dial, Box, Case), the bowl turns over in its gimbals, the
  closing plate opens and the key comes down onto the square first, as the 6MX's instruction and two
  videos show it (app.js `cw`). Keep: one key, moved (`WCASE.keyAt`, fusee.js `keySeat`), never a copy;
  a view out of the case sets the bowl back before the movement lifts. `4fd36fb`, `f3ed550` `a422612`
- **Setting the time turned the train, backward as often as forward** (kinematics handoff 7). The time field, Now and Local/GMT moved `tSim`, the model's own clock,
  so the whole train jumped to the time and `update()` re-seated the maintaining work. Now
  (`setHands`, app.js) the hour and minute hands go round by the cannon pinion's slip, as the
  key turns them, and the second hand is put right as Stop to set does it: the locking arm
  stops the balance, comes off once it has stopped, and a twist starts it as the time comes
  round (early by the twist's length and two frames' model time); a moment missed while the
  arm swings off waits for the next minute, the minute then taken out by the slip; the zone
  moves the master and the hands by the slip alone. Keep: the escape wheel's count never goes
  down when the time is set (smoke.py's Now check); a time in the page's address is still set
  directly as it loads (social.py passes its ten past ten so). `143ff32`
- **The twist started the balance at the click, not through the box's turn** (kinematics handoff 7). The swing the integration gives at the twist's end was eased
  in from the click while the box was still turning. Now the balance is drawn along the
  integrated path (`TWIST.path`, box.js) as the box turns and takes the end state as the turn
  ends, the twist on the model's time (the master's), so it slows and speeds with everything
  else; the export's Stop and start clip does the same (blender.js). Keep: reduced motion,
  which doesn't turn the box, applies the end state at once, eased. `143ff32`
- **Train-blocking screw down, the train held a frame and freed the next.**
  The train halts when its next whole beat would bring a spoke to the dog
  point (`Eb+1 > floor(Eb+blockRoom)`), but it restarted whenever
  `blockRoom >= 1`. At speed the beat count is fractional, so with a room
  of 1.08 at beat …719.83 the two disagreed and the train toggled every
  frame; the HUD (`smoke.py`, "screw down") rarely caught it held. It showed
  when the screw moved 0.5 mm. The restart test is now the hold test's
  negation. Keep: hold and release decided by the same test. `c1f9696`
- **Hidden parts took clicks and hid labels.** r128's
  raycaster ignores visibility, and picking, the right-click menu and label
  occlusion tested only the mesh's own `visible`, so meshes in a hidden group
  (the hand-setting key, the other dial styles' hands) still caught the ray:
  clicks near the dial's centre opened Hands or Motion work instead of the
  part shown. They test the mesh and its ancestors (`shown()` in `app.js`).
  Keep: filter ray hits with `shown()`, never `object.visible` alone. `9f9118f`
- **Mainspring invisible outside drive-train mode.** It is now drawn when a
  cross-section is on, when the barrel or mainspring is picked
  (`16119fc`), and when the barrel is faded or hidden (`336aad3`).
- **Hairspring missing when seen through faded, hidden or sectioned parts.**
  It is now built whenever it can be seen. Keep: anything hidden by default
  must be built when a view can reveal it. `ec55b98`
- **Right-click triggered left-click picking.** It no longer does, and a
  right-click passes through a faded part to the one behind. `16119fc`
- **Fade/hide menu unreachable on iPhones.** It opened only on `contextmenu`,
  which iOS Safari never fires for a long press. A touch held 500 ms without
  moving now opens it (`openOpm` in `app.js`). Android's own long-press
  `contextmenu` and the timer open it once between them. Keep: a long press
  never picks (`down.lp`), and a second finger or a drag cancels it. `65fd5d6`
- **Walkthrough scrolled the page wrongly beside the stage.** It assumed the
  stage sits above the panel whenever the window is under 960 px wide, which
  is untrue in the landscape phone layout. It now checks whether the card is
  below the stage or beside it. Keep: test the layout, not the width. `65fd5d6`
- **Tools turned the labels on.** `fit.py`, `unproj.py` and `p3fit.py` clicked
  the Labels box to hide them; labels are now off by default, so the click was
  removed. Keep: tools that need a clean render hide `.labels` with CSS
  (`social.py`, `views.py`) or leave the box alone. `65fd5d6`
- **Links naming an inherited property broke the page.** `#part=constructor`
  or `#view=toString` passed the lookups (`INFO[p]`, `VIEWS[v]` inherit from
  `Object.prototype`) and threw at load. The hash is now matched against own
  keys only (`hasOwnProperty`, not `Object.hasOwn`, which older iOS Safari
  lacks); an unknown value falls back to the default. Keep: never index a
  table with URL text without an own-key check. `650c005`
- **A hash rewrite could overwrite a newer hash.** The page rewrites the hash
  0.3 s after a change; if the hash was changed meanwhile (a link followed,
  an edit), the pending rewrite could put the old state back before
  `hashchange` applied the new one. `smoke.py` hit it once under load; it
  wasn't reproduced on demand. The writer now stands down when the hash
  differs from the one it last wrote or applied. `650c005`
- **Zoom keys matched an empty key name.** `'+=-_'.includes(e.key)` is true
  for `''`; it is now an exact match. `650c005`
- **Exploded view: parts through each other.** Each part rose by a hand-set
  offset with no regard to what lay over it: the centre wheel (under the fusee
  wheel, the maintaining work and the barrel) rose 10 mm past the barrel and
  ended inside it, the third and fourth wheels passed through each other and
  the escape wheel, the fusee rose through its own end plate, and screws put
  in through the train bridge stayed under it. Offsets now follow the stacking
  (centre wheel 8, fusee wheel 14 ... fusee and barrel 50); the escapement's
  nested parts rise within 1–2 mm of each other; the fusee's end plate and the
  barrel arbor come off on their own (`loose`), screws through another part
  leave with it (`headOn`), and the balance hub's screws stay in. Keep:
  `tools/exploded.py` reports 0 failing (it runs in CI); where parts overlap
  seen along the arbors, the upper one rises more. `d59c0ad`
- **Dial style reverted when parts were see-through, singled out or faded,
  and the plate finish didn't reach faded parts** (findings 1–2). Derived
  materials (see-through, faded) kept an old texture and colour. `syncMat` in
  `core.js` now copies the source's map and colour whenever a copy is used, and
  the dial and finish buttons call `look()`. Keep: change the source material
  (`userData.mat0`), never the copies. `c2adc92`
- **The balance swung slower at 2× than at 1×** (Review-results, smaller
  issues). Above 1× it switched to its 0.9 Hz display swing. It now swings as
  it really does, and the escape wheel steps, up to 5× (`REAL_X` in
  `app.js`); above that the HUD says the swing is shown slowed. Keep: the
  real-motion path and the hold/restart logic share the one threshold. `5af0a57`
- **The first frame stepped time back.** Its `requestAnimationFrame` time can
  come before the loop's start time, so `dt` was negative once (about
  −0.26 s): the easing overshot slightly, and the master time (`tM`), which
  takes every step, fell a quarter second behind the model clock, showing a
  dial error at load. `dt` is now clamped to 0–0.05 s. Keep: nothing that
  advances with `dt` may assume it is positive unless it is clamped. `562928a`
- **Starting the walkthrough left a key setting in hand.** With the key on the
  square, the walkthrough's steps ran with the bezel off, the key on and the
  gimbals latched. The walkthrough now ends the setting first (the latch goes
  back as it was) and drops a stop-to-set under way. Keep: anything that takes
  over the view ends the setting, as `ksStart` ends the walkthrough. `d8acf54`
- **The hand-setting key hung off the movement in other views.** Changing view
  while setting with the key lifted the movement out with the key still on
  its square. Leaving the Dial view now ends the setting. Keep: the key and
  the missing bezel belong to the Dial view only. `3fcfcb9`
- **Escapement inset ignored the train's state.** `drawEsc2D` recomputed the
  balance at 255° with a running escapement's progress, so with the train held
  (run down, arm, screw, too small a swing) it showed the wheel turning. It now
  draws the state and wheel position the model shows. Its captions come from the
  contacts: "drops onto the impulse jewel" only during the drop, "Stopped" while
  held. Its teeth are the mesh's, and it says it is seen from the cock side, as
  Fig. 90, which is the 3D Escapement view mirrored. Keep: `drawEsc2D(ctx, w, h,
  s, E, dark)` takes the state the model shows (it now calls `drawEscPlan` in
  `shared/escplan.js`, which the essay's detent figure shares). `89a949d`
- **The camera couldn't look up at the underside.** Dragging and the arrow
  keys clamped the pitch to −1.3 rad (74.5°) below, against 1.52 (87°) above,
  so a lifted movement couldn't be seen from straight under it. Both limits
  are now ±1.52. Keep: stop short of ±90°, where `lookAt` has no up and the
  view spins. `fada89a`
- **Camera targets left at the photographed group's old places.** The
  Escapement view, Stopping and starting's view and the walkthrough's Stored
  energy, Constant force, Winding without stopping, detent and balance steps
  aimed at numbers (the balance at (8.0, 6.8), the barrel at (-18.6, 0.2), the
  fusee at (11.6, -19.8)) that the photo fits gave before the group turned
  14°, about 3 mm off. They are now the arbors' places in `L` (the escapement
  views between the balance and the escape arbor). Keep: a camera target on a
  part is written from `L`, so it follows a change of the layout. `cce56d7`
- **The Navy's Y-arm showed the locking arm's card** (Variants, Balance stop). Both
  stops are the part `lockArm`, whose card, parts-list name and source were the
  manual's arm (Fig. 9, "loosen its screw, turn the arm") whichever was fitted;
  with the Y-arm the default, every visitor saw it. The card, name, source note,
  spec and search text now follow the stop fitted (`STOP_INFO`, `stopFit` in
  `app.js`). Keep: fit a stop through `stopFit` or its button, never
  `mv.userData.stop` alone in the page, and `bom.py` fits the arm by its button,
  so the card's numbers it checks are the arm's. `db5d5dd`
- **GMT or local changed while the train stood was lost.** `setTz` moved `tSim` and the master by the
  zone's difference, but with the train held the hands stand at `H.Eh`, which it left alone (setting the
  time and Now reset it): on restarting the hands carried on from where they stood and the dial read
  the difference slow (3 h for a zone 3 h off). Held, the beats the hands stand at now move with it
  (`H.Eh += 2d`). Keep: whatever moves `tSim` while the train is held moves `H.Eh` with it. `ef53013`
- **Above 5× the escape wheel ran smoothly, held off its stone and stepped back on a change of speed.**
  Faster than `REAL_X` the beats were `2t` plus offsets, continuous, so a hold there stored a fraction
  of a tooth and the restart a fractional `eOff`: back at 1× every locked beat stood off the locking
  stone, the second hand between its marks, until Now (a run-down at 3600× held at E = 2360.25). The
  two formulas also differed by up to 0.74 of a tooth, so crossing 5× stepped the wheel back. The train
  now goes by the balance's real phase at every speed (`at()` in `app.js`; above `REAL_X` only the
  drawn balance swings at 0.9 Hz), so it stops and starts on whole beats, a change of speed moves
  nothing, and the wheel never turns back (`Eb`: the progress `ESC.state` gives at a phase changes
  with the swing, which a frame of the arm's braking at 10× cut from 255° to 21°). Keep: the
  train's beats from the real phase whatever the speed; `REAL_X` chooses only how the balance is drawn. `3b564e3`
- **The second hand landed on its mark 0.37 s before the time it stood for.** The beats were
  counted from the balance's far turn, so the wheel escaped and the hand landed a quarter of a
  swing after the half second (`PL`, 0.263 of an oscillation, at 255°), while the dial was read
  as `tSim` itself: the dial error left out the 0.12 s the hands were ahead on average, and Now set
  them so. The balance's phase now runs `PL` ahead, so the hand comes to rest on the mark k/2 s at
  `tSim + (bOff + eOff)/2 = k/2`, as on a chronometer set to a signal, and `dialRead()` reads what the
  hands show (the train standing, the mark the second hand stands on: `handT`); Now puts the balance's
  phase on the master's too. Keep: the hands land on the mark at
  the time `dialRead()` gives for it. `3b564e3`, `bc5638e`
- **The export's train could step back on restarting.** `blender.js`'s copy of the loop counted a
  beat's progress as 0 at a whole phase in `at()` but took `ESC.state`'s 1 there on restarting, so on
  its 1/120 s grid the escape wheel stepped back a tooth (40 to 39) for 4 of 240 times the screw was
  raised. Its `sim` is now the page's loop line for line (the phase with `PL`, the wheel never back,
  the restart's count from `at()` itself), started so Running is as before. Keep: `sim` in
  `blender.js` and the train in `app.js`'s `frame` change together. `24908fc`
- **The drawn escape wheel chased the impulse jewel at the calibrated torque whatever the drive.**
  The swing and the rate took the drive (`ESC.ampAt`, `ESC.rateAt` with `driveNow()`), but the loop,
  the balance inset and the export called `ESC.state(p, amp)` without it, so after the unlocking the
  wheel ran to the jewel as at full torque: the tooth landed 2.6° of the balance early at 0.8 of the
  torque, 7° at 0.3 (run nearly down, or on the sustaining spring). They pass the drive now (the
  export its Running's, `drvF(h0)`, in the beat it samples and the rig's beat too). Keep: every
  `ESC.state` call that draws the train passes the drive the swing is worked out at. `59a4c5b`
- **The fusee ran on the master's time and past its chain.** The hours since winding (`hrs`) went
  with the frame's master time while the train went with it times the rate, so a fast or slow
  chronometer's fusee and wind indicator drifted from its own train; and the frame that ran it down
  ran the train its whole length, up to 500 s past the chain's end at 10,000×. The fusee's hours now
  go with the train's own time, and a frame runs the train no further than the chain has left (then,
  stopping, only to the end of the beat under way). Keep: `hrs` advances with `tSim`, never past
  `RUN_H`, and what may drive the train after it (`canDrive`) carries it on without moving `hrs`. `df4abfd`
- **The train-blocking screw held the train at the last lock before the spoke.** The train stopped
  at the last whole beat before a spoke would meet the dog point. In a real one the next unlocking
  lets the wheel go until the spoke meets it, a fraction of a tooth (Op. 6: the escapement works
  "until the train is stopped by the blocking screw bearing against one of the arms of the fourth
  wheel"), the detent back on its stop with no tooth on it. Now so: held at the spoke, the tooth
  it holds stands in the impulse jewel's path (unless within 0.04 of a tooth of a lock), the jewel
  strikes it each return swing and the balance swings only on its side of it, stopped about as
  quickly as by the arm (`bankAt`, `bankState` in `box.js`); raised, the wheel runs on to the next
  lock and the train goes again only from a whole beat. Keep: hold and release by the same spoke
  (`blockRoom` read from 1e-4 of a beat before, so a spoke against the point reads 0, not a
  spacing); nothing restarts the train off its stone. `ea286e9`
- **A jolt kept the balance's phase.** From where the balance was in its swing (θ, θ′) a jolt worked
  out the new swing, √(θ² + (θ′/ω)²), but kept the old phase, so the train stayed on its half second as
  if the knock had cost no time. A knock changes the phase too: the balance now goes on at the phase
  θ and θ′/ω give, the escape wheel staying on its stone (`knock` in `app.js`), so the next unlocking
  comes sooner or later and the dial error shows the knock's time error (a phase landing between the
  unlocking and the lock waits for the next swing; a trip adds its tooth). Keep: a knock moves the
  beat by the phase it gives, the escape wheel's count unbroken. `70f7f3e`
- **The twist turned the box 7° and gave the balance 160°.** The box's twist was drawn as a turn of
  at most 0.12 rad out and back over half a second, while the balance was set to 160°. A twist can give
  the balance only what the box turns under it: the balance stays where it is in space, so relative
  to the movement θ″ = −ω²θ − α″, at most about twice the box's turn, and the drawn one would have left
  it 7°. The box now turns 35° in 0.1 s and back a quarter of a second later (`TWIST` in `box.js`),
  which leaves a balance at rest swinging 67° (a real start by hand: 62-66°), worked out from where the
  balance is (`TWIST.run`; with the train going, a twist is a knock, as a jolt is); the build-up
  from it follows the video's start within its readings. The export's Stop and start plays the same
  twist. Keep: the balance's kick from the box's own turn, never set apart from it. `e237416`
- **The Wempe was linked twice on the Hamilton's page.** A "Wempe model" link beside the 3D model
  and Essay tabs (`f011119`) repeated the header's switch between the models (`nav.models`). The tab
  link is gone; the tabs are only the page's two views again. Keep: one way between the models, the
  header's `nav.models`, on both pages, the current model marked.

## Build, tools and docs

- **The Wempe's bench took its preload's floor from the frame as it was before the banking moved.** `wempe_tolerances.js` first
  took 0.72 g at the stone (1.1 times the estimate) as the least preload, `wempe_tripping.js`'s figure while the banking stood
  under the blade; with the banking on the pipe the frame finds a held tooth's stone ringing 41 % of the depth of lock at the
  estimate itself, 0.63 g, and doesn't run between that and none. Keep: a figure quoted from another tool's run is the one its
  present configuration gives, with the date and the tool named beside it. `350728d`

- **`smoke.py` failed "winding with the key" whenever the machine was busy.** The model's clock goes at most 0.05 s a
  frame, and a headless page under load drew about 2 frames a second, so the sustaining spring's relaxing, about 2.5 s
  of model time after the key goes on, came about 25 s later; the check waited 5 s and failed every run (ssD still
  -0.0012), on main too, while a quiet machine passed. It looked like the time of day; it isn't (the same at 08:30 and
  11:30 GMT on a fresh page). Keep: a smoke step that waits on the model's motion waits on its frames (30 s here,
  returning as soon as it holds), and its message gives the frames drawn and the model's time. `25934e0`

- **`massprops.py` failed at some hours of the day and not others.** The model's clock starts at the time of day
  (`app.js`: `tSim` from `Date.now()`), and the hands turning with it moved the bowl's centre of gravity 0.016 mm between
  runs, past the check's 0.01 mm, with no geometry changed (48e82e1 had rewritten `gimbals.json` for one such drift).
  Keep: the check loads the page at one instant (`CLOCK` in `massprops.py`, 13 October 2026 06:50 GMT); a measurement off
  the model that compares with a committed file pins the page's clock the same way. `a5ca864`
- **The Wempe's gimbal stops met another version's lid.** `massprops-check.js` skipped another version's hidden
  pieces when weighing but not when finding the stops: with the 6MX's box built (its lids and bowl hidden as last
  revised), the case and ring "met the lid" at 35.5° where nothing stops them. Keep: every list the check builds (the
  weighed parts, the obstacles, the moving meshes) leaves out the hidden version groups (`offRev`). `ad31c17`

- **The real-chronometers report ran off a phone's screen.** Its three wide tables and its contents' last link pushed
  the page to 471 px on a 390 px screen, so the whole report scrolled sideways (found when the reports went on the site).
  Keep: on screens under 760 px its tables scroll in place (`table{display:block;overflow-x:auto}`, as the
  build-verification report's `.tw`), and `.toc a` is an inline block; a report on the site has no horizontal page
  scroll at 390 px. `6dbd537`

- **The Monte Carlo's "after the bench's adjustments" left out the bench's pawls test.** `montecarlo.js` turned the
  set-up and nothing else, so the two movements in 2,000 whose winding pawl's spring came out under its 0.08 mm of set
  stayed failed (99.9 %), though `bench.js`'s pawls test tells the maker to find and re-bend exactly those. It also
  judged both winding pawls by one draw against the larger need, and the sustaining pawl's wire against an unsourced
  0.03 rad. Now every movement is judged as made, then after each bench test as a maker applies it, by `bench.json`'s
  own figures (depths re-bushed, pawls' springs re-bent, the set-up turned where the swing is out of the band, the
  maintaining work timed), each pawl against its own need (`ratchets.js`), and it fails if a movement still failing was
  caught by no test. Keep: "after the bench" means after every bench test the analysis models, with the bench's own
  figures; a test that can't mend what it catches leaves the movement failed but caught. `a01e1ce`
- **The build's one-piece Glucydur balance left its temperature error untrimmable.** `deviations.js` paired a
  monometallic beryllium-bronze balance with a Nivarox spring and said the error was "trimmed on the bench", but such a
  balance has nothing to trim: the spring's thermoelastic coefficient had to be held within ±1.43 × 10⁻⁶ a °C for the
  Navy's 1.20 s a day over 55-90 °F, a seventh of the ±10 a bought spring holds (EP3502288A1). The build now keeps the
  Model 21's stainless rim on its Invar arm and takes only the spring in Nivarox: Table IV's figures, read as the rim's
  bending (fitted to 0.20 s a day rms), give the balance's expansion (15.1-17.0 × 10⁻⁶ a °C, so the spring wants +0.1 to
  +13.0) and the trim its screw moves reach (−6.45 to +4.61 s a day, steps of 0.42 s or less: a spring −5.5 to +7.7 off
  its mark), which `bench.js`'s rate test now gives the maker. The deviation's id is `hairspring` (`orig=hairspring`).
  Keep: a build deviation that changes a compensated part must leave a way to trim it, and its tolerance must be one a
  bought part holds. `fe55300`
- **`maintaining.py` foretold a catch wrong where the spring's reload begins.** It checked `R.release` by adding the
  frame's whole running to the catch it foretold, but the reload is `max(0, …)`: with the spring held as the key lets go
  and the train's running starting the reload within the frame, only part of it adds (frame 212 at full wind: foretold
  2.351 + 0.039, took 2.371, the reload 0.020). The packed-at-the-pitch spring's drive (0.993 of the 12-hour drive fully
  wound) put a catch there. It now adds what the running adds to the reload at the drive `R.release` took. Keep: a
  check's own arithmetic follows the kinks of what it checks. `61cbe04`
- **The mainspring's room to coil-bound read a quarter turn short.** `bench.js` took it as the last state in the
  quarter-turn table (`js/mainspring.js`, 19.0) less full wind, 0.13 turn, and the build book's mainspring test and
  the report said so; the coils are solid only past 19.20 (`mainspring.py --bound`, the states past the table's last
  solved warm to 0.05 turn), 0.33 turn. `bench.js` now reads `mainspring_friction.json`'s `room`, from
  `mainspring_bound.json`. The friction figures were right (they come from the solved states either side of full wind).
  Keep: a limit found where a sampled table stops is a bound to its step, not the limit; solve it finer before quoting it. `8d3f5ce`
- **The mainspring's maker's sheet measured only its anchor pin** (0.5 × 0.6 × 0.65 mm): its coils
  are built only when they can be seen, so the sheet, drawing and book had none. `R.springReady`
  builds it fully wound for the maker, as it does the hairspring. `7848915`
- **The Blender rig put the barrel 0.03 mm off.** `rig.py`'s `deltas()` turns each clip into the change from
  the part's rest, keyed where the clip is and interpolated straight; for a part turning about its own origin, off its parent's
  (the barrel, 18.8 mm from the fusee group's), the change's location cuts the chord between keys, 0.03 mm in at mid-span of
  Run down's 6.7 deg keys, past `blender_check.py`'s 0.02 (shown when the barrel was measured larger and its keys moved). Each
  span is now keyed in four (0.002 mm). Keep: after changing `rig.py`, run `tools/rigpy.py` and `blender_check.py`. `ffe9ad6`
- **The build book left out the box, the gimbals and the hairspring.** The maker's tools were given
  the movement's meshes only, so the mounting box, the winding key, the gimbal ring, its straps and
  pivots and the latch had no sheet; the hairspring, built only when it can be seen, had no geometry
  when the book was made. book.py checked each section as paper, not what was missing. Keep: book.py
  checks that every parts-list line on a part of the model is on some sheet (`R.springReady` builds the
  hairspring for the maker). `ccf4075`
- **Root copy of the model was stale.** It is refreshed from `dist/`, and the
  root build now does this. Keep: commit the regenerated root copies and `site/`
  with source changes. `a3b22fc`, `f591611`
- **Tools used hardcoded `/home/claude` paths.** They now resolve
  `../index.html?snap&qa` from their own location. `a3b22fc`
- **`build.py` failed on Windows.** It now reads and writes UTF-8 explicitly.
  `a3b22fc`
- **`escapement.js` failed on CRLF files.** It now reads `movement.js` with
  CRLF line endings too. `219e4df`
- **Pages loaded from the network.** three.js and fonts are vendored, and the
  build fails if any page still loads a script, stylesheet, font or image from
  the network. Local `<img>` files are inlined too (`d778beb`). `fcedc94`
- **Link-preview URLs ended in `.html`,** which Cloudflare redirects. They now
  don't, and `--keep-html` covers other hosts. `2c0f236`
- **Essay linked to the wrong page for the model.** It now links to the site's
  home page. `219e4df` (The essay is now the model's Essay tab, and its links
  into the model are in-page: `#tour=3`, `#view=…`, `#open=…`.)
- **About dialog claimed more collision testing than was done** (finding 7).
  "Every part was tested for collisions through a full escapement cycle" is
  now what the checks cover: 0.05 mm, through the escapement cycle, round the
  train and over the wind, with the chain, springs and barrel; it names the
  dial face as untested and the split-balance variant as not yet clear. Keep:
  change that sentence when `fine.py`'s coverage or finding 9 changes.
  `346299c`
- **`views.py` diffs depended on the time of day.** Before freezing, the page
  runs live for a few seconds, and the fusee's ratchet settles to the nearest
  tooth of wherever the train stood then, so renders made minutes apart showed
  the fusee and its square a ratchet pitch (9°) apart: hundreds of "changed"
  pixels from an unchanged model. The freeze now passes through a moment of
  winding first, which resets that history. Keep: a frozen state must not
  depend on the page's history. `d71d757`
- **`views.py` failed to load the page.** It waited a fixed 5 s and used
  headless Chromium's first WebGL context, which is lost a moment after it's
  created, so `window.__mv` was often missing when it
  froze the model. It now spends that context on a blank page, as `smoke.py`
  does, and waits for the loading screen to go. Keep: every browser tool
  warms up WebGL first and waits for the page, not for a fixed time. `ea04355`
- **`illustration.py` failed at its first view** (the tool and its Illustration
  tab have since been removed; the lesson stands). Its render hook keeps the
  last scene drawn, for the passes to redraw. With Edges on (the default except
  on phones), the last scene drawn each frame is the Edges overlay's, two
  objects with no parts in it, so the first label anchor on a part threw
  (`localToWorld` of null). It now turns Edges off before each view, as the
  sheet was drawn. Keep: a tool that hooks `render` must get the model's scene,
  so switch off any overlay pass drawn after it. `91dd568`

- **Floating screws with Moving parts only.** The setup cover's two screws and
  the click's pivot screw stood in the air over the hidden barrel bridge: their
  `driveHide` flag was set on each screw's group, and `look()` tests meshes. The
  detent support block's screw (its head on the hidden train bridge), the
  balance locking arm and the train-blocking screw (mounted on hidden plates)
  floated too. The flags are now set on every mesh, and the arm and the screw
  are `dh` parts, hidden with the plates. Keep: flag meshes, not groups; a part
  mounted on a plate hides with the plates. `41e99e0`
- **Cock's screw holes wider than their heads.** `polyGeo` bevels a hole
  inward (0.8·bev narrower at the faces, which screw holes allow for) only when
  the hole is wound like the outline after ExtrudeGeometry's own correction; the
  cock, traced counterclockwise, was reversed and its holes bevelled outward, so
  the hairspring stud screw's hole was 0.93 mm across at the face under a
  0.8 mm head (`audit.py`: nothing under its seat). `polyGeo` now passes the
  outline and every hole clockwise. Keep: measure a hole's size at the faces
  when a screw seems to float. `41e99e0`
- **`deploy.py` saw the live page as changed when it wasn't.** Cloudflare's Web
  Analytics adds its beacon script (`static.cloudflareinsights.com`) to the page
  it serves to some clients (Python's request got it, curl's didn't), so a
  same-version redeploy was refused. The check now removes that script before
  comparing. Keep: compare the live page with `site/index.html` only after
  taking out what the host adds. `d49eb8c`
- **`solve.py` solved a layout the model no longer had** (Review-results.md,
  finding 6). Its inputs were Fig. 2's positions before the photo fits (the
  fusee at (12.0, -17.8), an 18 mm balance), and its modules and third arbor
  matched neither `MOD` nor `L`. It now reads `L` and `TRAIN` from
  `movement.js`, takes the measured arbors as they stand, solves the escape
  arbor (9.40 mm from the balance, the fourth's mesh distance from the
  fourth) against `L.E`, gives the modules as `MOD` does and checks the
  through arbors clear the wheels' tips in plan; exit code 1 otherwise. Keep:
  no positions or counts written into the tool. `66edc05`

- **smoke.py failed under load on leaving the essay.** It clicked the 3D model
  tab and checked after a fixed 2 s; the address is written 300 ms after a
  change (writeHash), later when the machine is busy with other browser checks,
  so it failed twice on 4 October 2026 though the switch is right (the hash
  clears within 0.5 s, three trials). It now waits for the essay to close and
  the hash to clear, up to 10 s. Wait on conditions, not fixed times, in the
  browser checks. `4112b41`
- **Two smoke-test checks failed now and then.** The key-winding check (close-up
  shown, sustaining spring relaxing) looked once, 2.5 s after the click, and the
  Model tab's (essay closed, hash rewritten) once, 2 s after it; on page time,
  slow in a headless browser, they failed 2 runs in 11 and 1 in 4 on `main`,
  never reproduced on demand. Both now poll up to 5 s and print the state they
  saw when they fail. Keep: a smoke check on something that happens on page
  time polls (`wait_for_function`, or `expect(…, wait=)`), never looks once
  after a fixed wait. `9b49228`
- **The build book's drawings were no use on paper.** Each part's drawing was
  an SVG at 1:1 in millimetres: a screw printed 3 mm wide, its hole labels
  0.6 mm high and its lines 0.004-0.02 mm, and print's `max-width` shrank the
  large ones to an unknown scale; 21 sheet lines had no fit (jewels, plates,
  the case: their fits are measured from the parts in them) and the fusee
  arbor's square no line. `tools/book.py`, the book laid out as A4 print,
  found 116. Now each drawing picks a standard scale (20:1 to 1:4) that fits
  the column and page, states it in its title, and sizes its lines and text
  in printed millimetres; a line shows the other side of the fits that name
  it, or says it isn't measured. Keep: a drawing for paper states its scale
  and prints at it; `book.py` (in `ci.py`) passes. `390218e`
- **The endshake check could miss a pivot's end.** `bom-check.js` measured a
  part's free travel along its axis from a sample of 6,000 of its vertices;
  when the balance hub gained its sleeve, the sample skipped the staff's lower
  pivot end, and the travel toward the dial read 0.093 mm to the hairspring
  instead of 0.025 to the endstone. Now it always takes the 3,000 vertices
  furthest along each way, and a sample of the rest. Keep: a clearance along an
  axis is measured from the extreme vertices along it. `746f25a`
- **`OPEN-QUESTIONS.md` carried a merge's conflict markers.** Merging `main`
  into `claude/ratchets` (`0fdbb46`) left both sides of its last section in the
  file between `<<<<<<<` and `>>>>>>>`, released with 2.23.00 and 2.24.00: the
  set-up ratchet's older reading (a 5° lean) beside its newer one (0.48 mm
  teeth, undercut faces), with the winding-pawl springs' section inside the
  conflict. Kept main's set-up ratchet and the springs' section. Keep: after a
  merge, `git grep -n '^<<<<<<<\|^>>>>>>>'` finds nothing before committing. `52fd85c`
- **The rig off its clips for an export made between round hours** (4104d411; the export to Blender): `blender.js` wrote the start hours as the page had them (20.000166 h, the page having run 0.6 s), but the rig reads its hours control through a driver variable, which Blender holds in single precision: 7e-7 h short, so the train and hands stood 0.005 teeth back, the escape wheel 0.12° off its clips (2e-6 h and 0.3° at 30 h). `ci.py`'s export passed only because its page exported near 20 h exactly; it ran the export in SwiftShader always because the GPU page, running faster, put the escape wheel 0.105° off. Fixed by taking the start hours in single precision (`Math.fround`) in both models' exports. Keep: any number the rig reads through a driver variable written so Blender's float holds it exactly.

## Essay

- **The essay contradicted the model and itself.** Its last figure, "The whole
  instrument", had a 15-tooth escape wheel turning in 7.5 s and a 90/80 train,
  where its text and train figure said 16 teeth and 8 s; its fusee made 8 turns
  on a 0–56 h axis (the model's makes 8¾ and runs 60 h, rated 56); its balance
  swung 220° in two figures and "some 250°" in the text, against the solver's
  255°; its dial was a Roman "No. 1761"; its balance was a split bimetallic one,
  labelled as the instrument's; and it used the older names (passing spring,
  discharging and impulse pallets, locking stone) for the trip spring and the
  unlocking, impulse and locking jewels. It is now the model's Essay tab, its
  figures drawn from the model's code (`dialCanvas`, `handShape`, `ESC` and
  `drawEscPlan`, `TRAIN` and `MOD`, `arbor`, `escapeWheel`, `R.fs`, `buildBox`),
  the split balance shown as history beside the Model 21's, and its terms the
  model's. Keep: the essay's figures use the model's functions and constants,
  not copies; a number the model computes goes in a `data-live` span, set by
  `fillLive()`. `9ffe479`
- **The escapement's figures were typed into the essay's text** (lock 6.0°,
  drop 2.1°, overall 28.4°), so a change to the solver would have left them
  stale. They are now read from `ESC.measure()` as the essay shows, with the
  let-off, roller shake, horn clearance, roller, centre distance, swing and the
  least swing that keeps it going. Keep: no figure the model computes typed in. `9ffe479`
- **The essay made a WebGL context for each 3D figure** (seven, beside the
  model's own on the page that links to it). Its 3D figures now share one
  renderer off screen, each copied onto its own 2D canvas, and are built only
  when first near the view. Keep: at most two WebGL contexts on the page
  (`smoke.py` counts them). `9ffe479`
- **The counting figure's teeth inside each other** (kinematics audit, 11 October
  2026). "Counting" built the centre, third, fourth and escape arbors with
  `arbor()` on its own layout and never phased the meshes, so at every beat
  each wheel's teeth stood inside its pinion's leaves (an outline check found
  93-194 points of one inside the other, against none for the model's own
  train); the centre wheel's addenda were also rolled for a 10-leaf pinion, not
  its 12. Each pinion is now phased on its wheel by `gearLash`, as the model's
  are (the backlash behind, the escape pinion's frame at -t0), and each wheel
  takes its pinion as `mate`. Keep: an essay figure that meshes gears phases
  them with `gearLash` and the way the model turns its wheels. `96fba58`
- **The Wempe essay's gimbals figure showed the transport box** (the user's
  phone screenshot, 15 October 2026). `WCASE.build` builds the padded outer box
  (bleached birch) with the wooden box since the Transport box view came in, and
  the page hides it in every other view; the essay's figure, which calls the
  same builder, never did, so the outer box stood round the whole case and hid
  the mahogany box, the ring and the bowl (its labels pointed at birch). It also
  drew both keys, the 1943 and the 1940 one, in the box at once. Now the figure
  hides the outer box and the first-drawn pieces. Keep: a figure that builds
  from `WCASE.build` (or any shared builder) hides what the page's views hide:
  `CS.over` and every `userData.rev==='first'` group. `f170e7a`

---

## Fixed, not yet committed

- **holecheck.py failing now and then on the fusee's hole 42021** (Build, tools and docs): the hole turns with the fusee, which stood where the page's clock put it as it loaded, so between runs it wandered 0.6 mm round (x 16.95-17.45), past its EXPECTED entry's 0.4: a run failed or passed by when it loaded (seen on 3.03.00's main, 16 October 2026). Frozen as audit.py freezes the model (placements.py's first state), it still stood in one of two places 0.74 mm apart: the fusee's catch on its ratchet is state `update()` keeps from call to call. Fixed: holecheck.py freezes the model first, and the entry gives the hole by its distance from the fusee's axis (`L.Fu`, 4.264 mm) and its height, at any angle; such an entry must be found empty (its twin at the same radius, the first tapped hole, holds the stop-bar spring's end). Keep: an EXPECTED entry on a part that turns says where it is about its axis, not in the movement's frame.
