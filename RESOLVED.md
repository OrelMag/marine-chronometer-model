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

## Going train and heights

- **Heights estimated wrongly.** Train bridge was 22.1 mm above the plate;
  a side photograph scaled by the pillar plate's 3.86 mm edge gives 16.8 mm.
  Barrel (13.2 mm tall, rising through a cut in the train bridge), train wheels,
  lower balance bridge and cock were re-stacked to match. Keep: heights are the
  named constants in `movement.js` (`TB_U`, `TB_T`, …). Don't reintroduce loose
  numbers. `1340cb6`
- **Seconds and wind-indicator hands too high.** The hour hand swept into
  them. They were lowered. `84a7645`
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

## Rendering

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

## Controls and display

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

These are findings 1–5 of `Review-results.md` (review at `f591611`). They are
fixed in the working tree. Move each entry to its heading, with the hash, when
it is committed.

- **Dial style reverted when parts were see-through, singled out or faded,
  and the plate finish didn't reach faded parts** (findings 1–2). Derived
  materials (see-through, faded) kept an old texture and colour. `syncMat` in
  `core.js` now copies the source's map and colour whenever a copy is used, and
  the dial and finish buttons call `look()`. Keep: change the source material
  (`userData.mat0`), never the copies.
- **Escape upper bridge's screw heads 0.06 mm into the balance's path**
  (finding 3). The heads are now 0.3 mm tall, 0.14 mm clear of the rim and
  timing weights. `dyn.py` works in 0.4 mm cubes and can't see gaps this thin,
  so check them by hand.
- **Model stopped at 56 h, but its chain holds 60 h** (finding 4). `RUN_H`
  (60 h, the fusee's 8¾ turns) now sets the run-down point, the power readouts
  and the fusee chart. The dial's UP–DOWN scale still covers the rated 56 h.
  Keep: use `RUN_H`, not a literal 56 or 60.
- **Fourth wheel and escape pinion 0.045 mm too far apart** (finding 5). The
  stage's module is now 0.3113, fitting the 10.585 mm centre distance that the
  escape wheel's position leaves.
