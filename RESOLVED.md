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

---

## Escapement

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

## Going train and heights

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

## Winding and maintaining work

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

## Plates, bridges, screws and arbors

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

## Setup, case and gimbals

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

## Rendering

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

## Build, tools and docs

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

---

## Fixed, not yet committed

None at the moment.
