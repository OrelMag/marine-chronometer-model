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
  model's `ESC` solver. Keep: after changing `ESC` in `movement.js`, copy it into
  the essay's `src/p4.js` and rebuild (see CLAUDE.md). `219e4df`
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
  s, E, dark)` takes the state the model shows. `89a949d`

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
  home page. `219e4df`
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
- **`illustration.py` failed at its first view.** Its render hook keeps the
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

---

## Fixed, not yet committed

None at the moment.
