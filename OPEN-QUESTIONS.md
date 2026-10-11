# Open questions: what no source has settled

As of 5 October 2026 (release 2.19.00). The model is built from the 1948 overhaul manual (NAVSHIPS 250-624), photographs of real Model 21s and videos of real Model 21s; where they disagree with the model, the model is wrong (CLAUDE.md, "Source of truth"). These are the readings that every source found so far leaves open. Each is drawn as an estimate meanwhile and listed in the model README's "Estimated, not from the manual". The full working record of each is its row in `SHAPE-PASS.md` (row numbers below); the sources are in `References/README.md` and `References/VIDEOS.md`.

The goal they are judged against: someone with only the site can make a Model 21 that keeps time. Two questions matter for that; the rest are appearance.

## Critical

### 1. The mainspring's thickness, and with it the arbor's core

**What is known.** The barrel is measured: r 18.3 ± 0.5 outside, its wall 2.0 thick (SHAPE-PASS 109-6). The spring is 13.55 mm wide (measured, 109-4) and 0.0165 in (0.419 mm) thick by the parts list. Its length, 1,064 mm, is estimated (the half-room rule; the videos give 0.9-1.25 m).

**The conflict.** On two movements (KLUwI2UUCMQ 15:54; TN24H `3SFDplGq6vs` 0:16) the let-down spring's packed coils are 0.375 mm apart, which a 0.419 mm strip can't pack to. And the barrel arbor's core reads r 4.9-5.6 on two movements (KLUwI2UUCMQ 33:20.5, TN24H 0:16), against the model's estimated r 1.8. On a core of r 5.2 the parts list's strip is coil-bound 4.75 turns past its slack, short of the fusee's 4.67 turns and a set-up of about 1: it can't be wound fully. A strip as thin as the measured pitch would fit. So either those two springs are thinner than the parts list's (replacements), or the coils counted were not one a peak, or the core reading is off.

**Why it matters.** The spring's thickness sets its torque (as its cube), the fusee's pull, the train's energy budget and so the balance's amplitude (`tools/physics.js`). The core sets how many turns the barrel holds.

**Searched without result.** Hamilton's material catalogues of 1947-1953 ("materials for all war timepieces ... require separate inquiry direct to the Material Sales Department"; their mainspring chart lists watch sizes only); supplier and cross-reference tables; Google Patents; museum catalogues (RMG, Smithsonian NMAH, Ingenium).

**What would settle it.** A micrometer reading of a Model 21 mainspring's thickness (and its length and width), or of the arbor's core diameter; or Doug Sinclair's article (below).

**In the model meanwhile.** The parts list's 0.419 strip, 1,064 long, on the estimated core r 1.8; the spring's lie solved in the measured barrel (`tools/mainspring.py`): slack at 13.5 turns, set up 1.0, let down it packs about 10½ turns against the videos' 12 ± 1.

### 2. The detent's and the trip spring's sections

**What is known.** Their plan and form follow the manual's Fig. 90 and the photographs, confirmed by the Royal Museums Greenwich catalogue (ZBA7849: "a beryllium-copper (?) detent mounted on a nickel block ... a bifurcated spring and a screwed-on, Elinvar passing spring cranked out to run parallel to the detent blade"). Their thicknesses and heights are not known (110-7).

**Why it matters.** The detent spring's and the trip spring's thicknesses set their stiffness, and so the force and work of unlocking; without them a maker can't cut a detent that works. The model's escapement meets the manual's adjustment figures (`tools/escapement.js`), and its detent spring's share comes from Op. 78's test, but the sections themselves are estimated.

**A related conflict (110-10).** One reading puts the trip spring's bracket leg about 2 mm further along the detent (KLUwI2UUCMQ 11:08-11:13, and Fig. 90 agrees), but the trip spring it holds measures 8.6 ± 0.6 mm from clamp to tip (11:26) against the model's 7.9; moving the leg 2 mm would cut it to 5.9. Both readings are rough; the bracket stays as drawn.

**Searched without result.** Every frame of the restoration video near the escapement (10:27-11:33); TN24H 0:11-0:12 (the assembly flat, 8.6 px/mm: the blades under a pixel); Deafboy's and pefkipefki's running videos (blurred there); bunnspecial's `bEWF2ivi1Rg` and `wuobTVulVGY`; Google Patents (no Hamilton detent patent); Dewey Clark's NAWCC post (one screw holds the trip spring on its Z-shaped bracket; no sizes); chronometerbook's "typically about 0.04 mm thick by 2 mm wide", which is for chronometers in general, not the Model 21.

**What would settle it.** A close side-on photograph of a Model 21 detent out of its movement with a scale beside it, or measured thicknesses; or the sources below.

## Meanwhile: how closely they must be made

`tools/tolerances.js` works out, from the model's own escapement, how far each of these can be off before the balance leaves the manual's running swing (1⅜-1½ turns, 247.5-270°), and the maker's sheets of the three lines (and so the build book) say so:

- **The mainspring:** its stiffness E b t³/12 L within −5 % to +11 % of the drawn spring's: 0.412-0.433 mm thick at the drawn 13.55 width and 1,064 length, about 0.89-1.03 N·m fully wound (0.85-1.00 until 11 October 2026, the fusee's torque then on the groove's floor). A 0.375 mm strip of the same length swings the balance only 210°: it runs, below the manual's figure. So the manual's swing, with the model's train and balance, favours the parts list's 0.0165 in over the coils' measured pitch (the balance's damping and the train's efficiency are estimated: physics.js gives their ranges).
- **The detent spring:** up to about 5 times the drawn stiffness (0.139 mm thick; the drawn 0.079) the balance keeps 247.5°; there is no lower limit from its work. Its preload is set by Op. 78's test. A thinner spring still returns the detent in time (`tools/dynamics.js`, 11 October 2026): from half to twice the drawn stiffness, and with no preload at all, the detent is back on its stop about 10 ms before the next tooth reaches the stone.
- **The trip spring:** up to about 2.6 times the drawn stiffness (0.082 mm; the drawn 0.06): it is bent far, round the discharge jewel's end, on every return swing.

## Found by integrating the escapement in time (11 October 2026)

`tools/dynamics.js` integrates the escapement beat by beat (model README, "Checked in time"). What it found is now in the model; two readings it rests on stay open:

- **The discharge jewel's end.** Drawn square, its 0.32 mm end held both springs' tips across its whole width and overall came to about 38°, past Op. 87's 26-30°. The model now stones it to a half round (`rnd`) and its settings (reach, trip spring's tip, angle, depth of lock) were re-chosen to the manual's figures: overall 27.8°. No source shows the end. Real recordings (11 October 2026, `tools/acoustic.py`) hear the return swing's trip-spring clicks, but where they fall against the active swing's depends on each movement's beat error (5-12° in the fits), so they don't test the end's shape. **What would settle it:** a close photograph of a Model 21's discharge jewel in its roller, side-on and end-on.
- **The balance's free run-down.** With the wheel's chase onto the impulse jewel and the detent's whole lift counted, the model's 255° at a torque the train gives wants a balance running down freely in about 52 s (Q 327; `TF` was 34): inside what the budget needs (225-370 with the mainspring's own losses; 210-291 without them, the fusee's torque on the chain's pitch line since 11 October 2026) and what the balance's parts give (202-390), but resting on both. **A real start disagrees** (11 October 2026): `We1dLNXiBj0`'s balance, let go from a twist at 0:55 and its swing read frame by frame (`tools/swing.py`, 66° to 244-267° at 2:03, still rising), builds up far more slowly than a 52 s run-down allows. Run in `dynamics.js` (`tools/startup.js`), 52 s misses the build-up by 15-16° rms at any drive; it fits within 3-6° only from about 120-160 s up (Q 750-1,000), the drive then 55-65 % of the calibrated torque, and the fit sets no upper bound. The sound of the same start (`tools/acoustic.py --every`) fits a slow build-up better too (rms 18° against 34° at 52 s), though it reads higher. One movement, started by hand, its absolute swing known only to a screw hole: not enough to change `TF`, but the budget's Q (202-390, from the pivots' friction and the air) is the reading most at risk. **What would settle it:** the free run-down of a real Model 21's balance (the train held by the blocking screw, its swing timed on video), and its running swing on a timegrapher; a steady swing on video with one feature in view (a timing weight), without the screw comb's aliases.

## Found by drawing the hairspring breathing (11 October 2026)

- **The collet's hidden side against the inner terminal curve (42190, 42188; 108-13).** Drawn as the couple bends it, the inner curve curls
  inward by about θs²/2L near the collet's clamp (0.39 mm, 7 mm out, at the 347° the model allows). With the collet's body taken back to the
  plate's corner (its hidden side: Fig. 6 draws only the front), the corner stood 0.02 mm off the strip at rest and in its way wound past about
  50°. No inner curve that meets Phillips' conditions from the collet's end clears it (searched with two more terms in its curvature: the
  farthest out of 3,000 passes the corner at r 3.64 where 4.0 is needed), so the hidden side is now drawn stopping 0.9 of the way to the corner:
  0.063 mm clear at 347°, 0.35 at rest. Searched for a source (11 October 2026): the manual gives no collet sizes (parts list 42190, Figs. 5,
  6, 49); Hamilton's patents US 2,391,816 (a counterpoised collet: a round hub under a thin sector plate, the spring on the plate's arc) and
  US 2,457,631 show the form, not the Model 21's sizes; KLUwI2UUCMQ 6:52.5-6:53.5 (the balance arm to the camera) show the sector plate
  reaching about 3.9 mm out but not the body under it, nor the inner curve's path clearly (`$MC_VIDEO/balance/c6-53.5.png`). What would settle
  it: a photograph of a Model 21 collet off its staff, or of the spring's inner end from below the balance.

## The likeliest sources (both behind NAWCC membership)

- Doug Sinclair, "From the Workshop: The Hamilton Series XXI Marine Chronometer", *NAWCC Bulletin* No. 365 (December 2006), p. 707: a teardown with about 25 photographs.
- NAWCC Library: "Notes on Hamilton Chronometer, 1941-1950" (Box 13, Folder 10), which may hold Hamilton's drawings.

The NAWCC forum and the pocketwatch database sit behind a Cloudflare challenge that the automated searches couldn't pass; eBay blocks automated fetches.

## Not critical: appearance only

Each is drawn from the manual's figure or a rough reading; none changes how the chronometer runs.

- **The latch's clamping bracket and the support bracket's screws (106-17, 106-19).** From above (TN24H 4:21; RMG Nos. 333 and 5674) the knurled head stands on a plate about 19 mm out from the box's right wall; which bracket that plate is, and where the support bracket's two screws sit on the box's outside, no view shows (the manual's Fig. 106 is the only drawing).
- **The balance cock's screw against the staff.** Put on the cock's top through its holes as the model places them, the pictures of a real cock read the cock screw about 22 mm from the balance staff when scaled by the endstone cap's screws and the stud's holes (`References/photo-cock-top.png` 21.7-23.1, the top-view photograph 21.3-23; on the restoration video at 41:58 no pinhole camera fits the holes as the model places them); the model has 26.8. The cock's outline is traced through those holes (`CK_TR`), so its far end (the straight edge past x 23) carries that strain, ±0.8 mm. A camera fitted on the train bridge in a frame from above (6:29 refitted to the present layout) would say whether the screw, the cap or the staff is out; it ties in with where the balance is (model README, "Estimated"; Review-results.md 14).
- **The hairspring collet's outline (108-13).** Hidden under the balance cock and the coils on every frame; what shows (a sector plate reaching about 3.9 mm from the staff) agrees with the model's 4.0, drawn after Figs. 5 and 6.
- **The winding stop-bar (109-19).** Its length is the fusee top's chord, 14.4-16.9 mm (the model's 14.6 lies in it); a hole 0.27 of its length from one end, which end not seen; its thickness, nose and travel not seen.
- **Two single-source readings on TN24H's box, noted, not drawn:** the gimbal pivot's lock nut about 26 mm across (the model 17) and the gimbal strap about 3 mm thick in plan (the model 1.2). Rough, from one frame (4:21).
- **Where the barrel bridge's horn on the cock's side ends (42061).** The model has it along the cock's straight edge, ending 2-9° round the rim from 3 o'clock (the top-view photograph, 23:30, 6:47). The flat bridge at 23:45, mapped by a homography on its rim and its fusee and barrel bushings, draws that end about 4-5 mm further toward 12 o'clock and turned about 7°, with the small hole beside it 6 mm from the model's; but the same map misses the bridge's other holes by 1.3-3.5 mm, so it settles the edge's bow (drawn), not its place. A camera fitted to 6:29/6:47 (the cock on and off, the same view) would settle it; three earlier fits of 6:29 disagree (focal length 900-7000 px).
- **The third and fourth stages' modules: the third finer than the fourth** (11 October 2026). The modules follow from the measured centre distances and the counted teeth (`MOD` in movement.js, `tools/solve.py`): the third stage 0.2510 (third wheel 80 : fourth pinion 10 at 11.297 mm), the fourth 0.2614 (fourth wheel 75 : escape pinion 10 at 11.107 mm), so the model's train coarsens toward the escapement, which trains seldom do. No source gives either wheel's size in millimetres. The restoration video gives their sizes against the centre wheel's on one frame (`References/VIDEOS.md`, "Wheel size ratios": KLUwI2UUCMQ 35:30, 35:33, 36:15, ±3 %): centre ÷ fourth 1.48-1.50, where the model has 1.48 (its fourth's tips at r 10.10 agree); centre ÷ third 1.36-1.39, where the model has 1.45 (its third wheel 4-7 % small). At the model's centre wheel (tips r 14.98) those put the third's tips at r 10.8-11.0 and its module at 0.262-0.268, as coarse as the fourth's or a little more, which wants the third and fourth arbors 11.8-12.0 mm apart, not the 11.30 their measured places give (the third 16.55 mm out at 149°, 34:30; the fourth 21.6 under the seconds). So the third's place and the ratio disagree by 0.5-0.7 mm; one of them, or the centre wheel's size (from the measured 16.55 mm to the third), is off. A second reading points the other way for the fourth: the train wheels' proportions row (23:45) takes a wheel 1.63 times the fourth's size for the wind indicator wheel (the model 1.52, which would want the fourth's module about 0.244), but it counts that wheel "about 97 teeth" against the 120 counted at 23:30, so which wheel it is is doubtful. Would settle it: the third and fourth wheels measured across in millimetres on a frame where they lie flat beside a known size (23:45, 35:30; rectified by `video.py count`'s tip ellipse against the plate's 87.57 or the fusee wheel's 90 teeth), or the third-to-fourth distance read again on the bare plate. Meanwhile the wheels are drawn from the centre distances; a maker cutting them to those distances gets a train that meshes, only perhaps not the real wheels' sizes.
- **Rough readings.** 22 rows in `SHAPE-PASS.md` are measured but rough (mostly on the box: the latch's place, the gimbal pivot heads, the keeper); a clear photograph of a box from each side would firm them up.

## Estimated by design

The manual gives no tooth profiles, threads or most pivot sizes. The site tells a maker to use standard practice for these (BS 978 cycloidal teeth; the nearest ISO metric thread; the maker's sheets' fits as measured on the model), as a maker would; they are not open questions.

## The set-up ratchet's locking faces (11 October 2026)

- **Known:** KLUwI2UUCMQ 38:28 shows the set-up ratchet (42026) whole: about 42 saw teeth, each a short steep face and a long back. The model draws the face leaning back over 0.07 of a pitch (about 5° at r 7), as the maintaining work's ratchets were drawn until 11 October 2026, when theirs were made radial (the load then draws the click home; the winding pawls' trace at 19:12 shows a square end bearing on a radial face).
- **Conflict:** at a few pixels a face, the frame can't tell radial from a 5° lean. A radial face was tried; the click (seated by `phaseAgainst` on the profile as a function of angle) then sat 0.3 mm into the tooth's corner (bom.py's setup-click check), so it was put back until the click is seated on the outline as the winding pawls are (`deep`).
- **What would settle it:** a face-on close-up of the set-up ratchet (the barrel bridge off), or of the click on its tooth.

