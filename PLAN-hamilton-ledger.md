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
| The barrel 0.4 lower (2:22, 2:05.5: 1.95, 1.97 against 2.4) | Would put its lower cap 0.1 into the centre wheel; the centre wheel's level was never read side-on: read it first |
| The winding ratchet's tips r 7.3 (ratio on 18:23.5/.4) | The pawls' spring bed traced on 19:12 has its inner wall at r 7.04 with the ratchet inside: kept at 6.9 |
| The fusee cone 0.4-0.8 slimmer (2:22) | Conflicts with 17:49 (within 0.1-0.25): read on bEWF2ivi1Rg 1:04-1:12 or umslgYaJYUY 0:09-0:21 |
| The hairspring 7.3 tall (its bottom 0.9 lower, 6:49.5) | The hub and collet still not seen side-on (searched KLUwI2UUCMQ 6:43-7:25, 34:00-34:20, 42:50-44:20 and three other videos); 43:35.655 (soft) suggests the collet could sit 0.5 lower, 0.9 only if the cap is lower: rough, not built |
| The dust seal's column | **Built**: r 5.9 holds (39:16, 39:18 side-on: 0.90-0.94 of the packing, no step; 12:33.0's r 5.0 was the mat's reflection); the column 6.25 long, not 3.6 (both seals, the Navy plunger's head raised with it). Open: the flange block 2.6 tall on 39:16 (rough), the packing's colour |
| The escape lower endstone cap | A round recess in the dial face with a cap held by one screw (39:31, 40:05, 40:08); the model a flat cap with two: being measured with the skill (below) |
| The whole detent | **Built** (`claude/hamilton-detent`, merged): flexure to jewel 10.1, spring 3.3, trip spring 5.8 free (0.041 thick to keep its stiffness: estimated), block -8.35..+4.10 with its pins and clamp screw, the Z bracket on the blade; Ops. 84-88 and 97 met (lock 6.1, let-off 7.6, drop 2.2, swing 255), ring 148 Hz, lock floor 5.58. Open: the moving parts 0.35 further along than the frames against the block's pins, the trip spring's tip 0.5 further out (set by rT about the staff); `aD` 269.9 (270 opens a face's triangulation) |
| The escape pinion, third pinion, fourth wheel's thicknesses (42:56, 36:45) | Rough, each on its own arbor's ruler |
| Balance screws' slots, timing nut's slit, the arm's holes | Seen (6:49.5, 6:52.5), sizes rough: to draw next |
| DIAL_T 0.7-0.85, the hands' profile, the crystal, the ring band's height, the straps' slots, the key's length, the end plate, the sustaining ratchet, the chain | No frame settles them |
| The click's pivot and the set-up spring's band; the lower train bridge; the escape bridge; the escape lower endstone cap | Being measured with the measure-trace skill (`tools/mfgfit.py`) in place of hand traces (the owner's word, 20 October 2026); the dial feet hold (`ledger\ring_dial`) |
| Records out of step with the code (ledger summary 8, Fig. 108's stale records) | One pass before the merge |
