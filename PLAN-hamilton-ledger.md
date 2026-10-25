# The Hamilton's ledger, worked through (from 20 October 2026)

The owner asked for every remaining item of `PROVENANCE.md`'s order of work and top re-derivation candidates, and the handover's
(`E:\mc-video\HANDOFF-hamilton-overhaul.md`), on branch `claude/hamilton-ledger` (from `claude/batch-20oct`). Measurements are
reported in `E:\mc-video\oq\ledger\<item>\REPORT.md` and built into the model one part at a time, each against its frame (isolate.py).

## Settled: holds as drawn

| Item | Result |
|---|---|
| The barrel's place (34:30's 0.5-0.8 mm out) | Holds: on 13:04.4 the bridge's other holes put the fusee-barrel distance at 36.5-38.2 by map (model 37.56); each bushing left out lands 0.1-0.45 from its place (`tools/holeloo.py`) |
| The train bridge's holes through the plate-placed map (handover 1) | Hold: every hole on the owner's 23:30 trace within 0.6 mm left out of an affine or homography on the rest, most 0.35 |
| The pillar plate's holes (9:03, 14:43.38) | Hold within those oblique frames' 0.3-1.8 mm |
| The barrel-bridge screw head past the rim (handover 3) | Closed: the screw at (-22.96, 25.82), r 34.55, its head inside r 38.8 |
| The balance's place (handover 5) | Closed 19 October: `L.B` stands (13:44, ±0.6) |
| The mounting ring's flange `MR_RO`, bore, dial feet radius, bezel radius | Hold: ratios to the bore agree to 0.5 %; absolute 47.4 ±0.6 against 47.95 (`ledger\ring_dial`) |
| The fusee's turn pitch, the fusee wheel's level, the barrel's height | Hold (`ledger\fusee_barrel`) |
| The cap screws' spacing, the counterbore's radius, the hairspring's top | Hold (`ledger\balance_small`) |

## Built (with their checks)

| Item | Change |
|---|---|
| The barrel bridge's cock-side horn end | A measured circle, r 35.15 about (10.69, 39.43) (13:04.2/.4 at the near face, 0.04 mm rms; `bb_hornend.py`), easing 0.05 clear of the cock over its last 2.5 mm (owner's choice) |
| The hairspring stud's holes | 5.0 / 8.4 / 12.3 from the staff (42:08, 41:58; sure); the clamp 3.83; the outer curve re-solved; the essay's figures |
| The trip spring's bracket | 1.05 tall, measured on 11:08-11:26 (BM 117A's 2.4 is its leg across); the detent's inertia 3.002; the lock Op. 85's 6.0° (5.5° left no room for wear), the chain of tables rewritten. Open: it stands 2.1 mm further along the detent than drawn |
| The box and gimbals | Rebuilt from Jones-Horan 63662 and 38240 (`claude/hamilton-box`, merged here): heights 105/71/20, piano hinges, hasps, 25 mm nuts, pivots at 92.9, cup washers, the latch bracket, the concave key block, the lid stay; the case can now turn over in the ring (Sec. III) |
| The fusee's winding ratchet | 40 teeth (18:23.5 and three more readings), 36 before |
| The bezel's knurl band | 3.4 tall (48:27.61), 5.1 before |
| The case support brackets (42105) | Bent straps with slotted wings and a tab holding the bushing (`claude/hamilton-casebracket`, merged). Open: the bushing larger and about 4 mm nearer the bezel on 47:22.5 |

## Open: readings that conflict or can't be built yet

| Item | Why |
|---|---|
| The barrel 0.4 lower; the train's levels | **Built**: the centre wheel identified (90 teeth by its tooth period; a camera on 36:46) and its faces read on the plate's mirror, h 0.24-1.18, 0.94 thick (1.15-1.85, 0.7); the barrel's lower face h 2.0 (two movements), the whole barrel 0.4 lower; the third wheel under the centre wheel, sunk in the plate's r 11.3 opening (inferred), its pinion 2.5 long, the fourth pinion down to it; the centre wheel's collet on its upper side; the posts' screw heads flush in counterbores (34:30). bom's meshes and fine pass. Open: the third wheel's exact level (hidden on 36:46), the fourth wheel 2.9-3.7 rough (kept 3.15-4.05) |
| The winding ratchet's tips r 7.3 (ratio on 18:23.5/.4) | **Closed** (inner parts, 20 Oct 2026): the tips r 7.4 (26:40); the "spring bed"'s r 7.04 is the face's reading before WFS (x1.139), 8.02, the pawls' springs' foot (r 8.04) |
| The fusee cone 0.4-0.8 slimmer (2:22) | Conflicts with 17:49 (within 0.1-0.25): read on bEWF2ivi1Rg 1:04-1:12 or umslgYaJYUY 0:09-0:21 |
| The hairspring 7.3 tall (its bottom 0.9 lower, 6:49.5) | The hub and collet still not seen side-on (searched KLUwI2UUCMQ 6:43-7:25, 34:00-34:20, 42:50-44:20 and three other videos); 43:35.655 (soft) suggests the collet could sit 0.5 lower, 0.9 only if the cap is lower: rough, not built |
| The dust seal's column | **Built**: r 5.9 holds (39:16, 39:18 side-on: 0.90-0.94 of the packing, no step; 12:33.0's r 5.0 was the mat's reflection); the column 6.25 long, not 3.6 (both seals, the Navy plunger's head raised with it). Open: the flange block 2.6 tall on 39:16 (rough), the packing's colour |
| The escape lower endstone cap | A round recess in the dial face with a cap held by one screw (39:31, 40:05, 40:08); the model a flat cap with two: being measured with the skill (below) |
| The whole detent | **Built** (`claude/hamilton-detent`, merged): flexure to jewel 10.1, spring 3.3, trip spring 5.8 free (0.041 thick to keep its stiffness: estimated), block -8.35..+4.10 with its pins and clamp screw, the Z bracket on the blade; Ops. 84-88 and 97 met (lock 6.1, let-off 7.6, drop 2.2, swing 255), ring 148 Hz, lock floor 5.58. Open: the moving parts 0.35 further along than the frames against the block's pins, the trip spring's tip 0.5 further out (set by rT about the staff); `aD` 269.9 (270 opens a face's triangulation) |
| The escape pinion, third pinion, fourth wheel's thicknesses (42:56, 36:45) | Rough, each on its own arbor's ruler |
| Balance screws' slots, timing nut's slit, the arm's holes | **Built** (`claude/balance-details`, `tools/balance_details.py`): slots 0.38 wide, 0.75 deep, along the staff (6:50.0, 6:52.6, 6:53.1); the nut's slit from its inner end, 0.63 of its length, 0.10 wide (6:52.6, 6:53.1). The arm has no holes: those were the hairspring stud's. Open: each slot's heading (it follows the screw's turn), the shorter heads' slot depth, the dark openings beside the hub along the arm (6:53.1, under the collet) |
| DIAL_T 0.7-0.85, the hands' profile, the crystal, the ring band's height, the straps' slots, the key's length, the end plate, the sustaining ratchet, the chain | No frame settles them |
| The escape upper bridge | **Built** with the skill (10:26.54, 10:00): the bar 5.45 wide (5.6), its round ends on the screws (22.05 long), the cap's flats 5.73 apart standing proud of the bar, its screws 6.46 apart (6.2), its window r 1.73 (1.55). Its direction **built** 24 Oct: 68.7 deg (10:00 69.0, 6:49.0 68.3 by the screws, 67.9-69.4 by the edges; each camera from the train bridge's holes), the seats (grown from the bar by `train_bridge.py`, never traced across) turned with it. Open: the jewel's place against L.E (0.7 mm either way on the two frames) |
| The lower train bridge | Measured with the skill (40:05, 9:03, 14:40): length, ends, counterbores (r 2.5), sinks (r 3.0) and centre line agree with the model; its top 4.31 (4.4). **Built** 24 Oct: 10.65 wide (40:05 10.62, 9:03 10.86, 14:40 10.65 against the settings' spacing), its end 10.0 past the fourth (frames 10.22-10.32), 0.2 clear of the model's pillar 1 screw at 169.2 deg; the real head is 1.5-1.9 clear at 166.3-167.7 deg (40:05, 9:03). Open: pillar 1's train-side 169.2 against its dial-side 166.3-167.7 |
| The set-up click and cover | **Built** with the skill: the click's pivot 10.12 from the barrel arbor (13:04.4 from below 10.08, 12:19 from above 10.25; 8.95 before, read through misidentified holes); the cover's screws through the bridge at (-28.64, 5.72) and (-15.19, -16.58) (13:04.4; the survey's two 'unknown' holes), the cover's outline as traced with bosses round them and the pivot (estimated), the Navy seal's flange bitten round the far one. Open: the cover's ends face-on; the band's section (flat or on edge) and a possible screw at h1; the set-up ratchet's tips r 7.56 (tentative, model 7.05) |
| The escape lower endstone cap | **Built** with the skill (9:03, 39:31, 40:05/08): a recess r 4.45 in the dial face breaking into the opening under the lower train bridge, the setting in its floor, a cap with two flats, window r 1.86, two screws +-2.98 along 328 deg (one seen plainly). Estimated: the recess 0.6 deep, the cap 0.4 thick, its round edge r 4.3 |
| Records out of step with the code (ledger summary 8, Fig. 108's stale records) | One pass before the merge |

## The inner parts (from 20 October 2026, branch `claude/hamilton-inner`)

Measured by five agents with the skill (reports in `E:\mc-video\oq\ledger\inner_fusee`, `inner_train`, `inner_motion`, `inner_barrel\{setup,barrel,chain}`, `fusee_profile\{,anchoring,stopbar}`), each reading checked against its overlay before it was built.

| Item | Built | Open |
|---|---|---|
| Winding pawls' springs, the sustaining ratchet's face | Flat gilt crescents (foot r 8.04-10.475, blade 0.78, two screws at r 9.25, a pin), the face's 19:12/28:35 readings x1.139 (studs r 9.84, bore 3.34, hub pipe 3.2), the pawls set by the pin (58.5 deg); `tools/fusee_face_overlay.py` lays it on 27:00 | The springs' thickness and metal (0.47, steel: estimated); the ratchet's tips 16.55 or 16.71 |
| Winding ratchet | Tips r 7.4, screws at 4.85, counterbores r 1.62 (26:40) | |
| Going train | Centre pinion 3.77 from its wheel, no collet; third pinion 2.86; escape arbor's original shaft r 0.5, body 0.57, collet in two steps | Third pinion read 3.1-3.25 against the fourth wheel's level (read 1.8-3.0 and 2.93-3.73, under the drawn 3.15-4.05): a camera on 42:51. Escape pinion's tips 2.97-3.19 against 2.715 (its addendum: gearing). The escape teeth 1.0-1.15 thick against 1.3 |
| Motion work | Posts' flanges, the indicator post r 0.74; the indicator wheel at h 5.0 with its stepped hub, the indicator pinion h 3.0-6.0; the minute pinion's disc at 5.05 | Hour wheel's tips r 8.5 against 8.79 (the counts against the module); the cannon pinion's leaves to 5.6-6.0; the dial's face 6.5 against 7.14; the indicator pinion's r 2.2 against 12 leaves |
| Set-up work | Ratchet tips 7.64 on its seat; click eye r 1.48; the spring a flat C plate on pins at G and h1; the cover on pads; its hole r 3.08; the square 2.265 | The click's arm and nose; the spring's thickness and free end; the cover's pads' height and the pocket |
| Stop work | Step 0.475 from the chain end, side hole from the inner corner, recess r 5.27, the hard stop derived | The slot floor's step on the stop side (drawn flat) |
| Fusee profile | Holds: the cone matches the side photograph to 0.07 mm | The grooves 0.9 mm lower on the arbor than drawn (fewer turns at the bottom, or a taller top layer); the torque's 3.7 % hump is the solved spring's curve (the fusee is cut for a nearly linear spring) |
| Fusee grooves (20 Oct 2026, `E:\mc-video\oq\ledgerusee_grooves`) | Built: groove depth 1.13 (1.25), pitch along the arbor 0.999 (0.985), the groove ended 13 deg past the chain's end pin at its hole (it ran about 90 deg on); the chain rides on the floor (plates 1.95 over a 1.13 groove), floors as drawn | Open (owner's choice, one photograph): the grooves 0.7-0.8 lower and the top layer about 1.3 lower (its face -18.55 against -19.85), which leaves room for only about 8-8.5 full turns against the manual's 8 3/4: a second side-on frame (bEWF2ivi1Rg run down, umslgYaJYUY 0:09-0:21) first. The fusee end's crook plate (about 2.7 x 2.2, throat 0.9, rough, 17:48) and its hole r 0.28 (17:43) not drawn; the hole's angle against the stop-bar (74 or 286 deg) unsettled |
| Mainspring and core (20 Oct 2026, `E:/mc-video/oq/ledger/mainspring_strip`) | The strip re-measured: 0.388 x 1,060 (the model's 0.394 x 1,064 within it); the chain's figures re-read off the page (`tools/fusee_table.py`): INT 4.62, RHO0 0.526, rB 19.32; the spring set up 1.25 turns, fully wound 19.11, 0.24 turn short of coil-bound (0.60 before the chain) | Open (owner's choice: the core kept at r 4.9): on the measured core r 5.65 the solver can't set the measured strip up (short 0.3-0.5 turn: `mainspring_t388r565`, `..tm`), where the frames show the real spring fits (slack 12.65 against the solver's 13.0-13.25). Look into the solver's slack, or solve 0.374 on r 5.65 |
| Next | | The barrel: core r 5.65 (4.84), bearings r 2.5, end hole 2.65, hook a 3 x 3.1 block, the outer end's stud D 4.4, the cap's ring r 3.9 (the mainspring re-solved on the new core). The chain (settled 20 Oct 2026, `E:\mc-video\oq\ledger\chain_size`): pitch 2.19 +-0.05 (sure: 23:30 against the indicator wheel, 17:19 against the fusee wheel, R-DrJz1DYOY 2:09 at about 55 links a barrel turn), plates 1.95 +-0.1 wide (likely), width/pitch 0.89 in three frames; drawn 0.9 on 1.7. Its pitch line then about 1.02 off the floor, rB 18.79 to 19.32, RHO0 0.527, the fully wound torque +4 %, so it goes in before the mainspring's re-solve; the lowest turn's outer edge 16.4 asks a floor about 14.45 there or a chain not seated (open), its fusee end a crook into a hole at the groove's end (the groove 92 deg too long past it) |
