# The Hamilton's ledger, worked through (from 20 October 2026)

The owner asked for every remaining item of `PROVENANCE.md`'s order of work and top re-derivation candidates, and the handover's
(`E:\mc-video\HANDOFF-hamilton-overhaul.md`), on branch `claude/hamilton-ledger` (from `claude/batch-20oct`). Measurements are
reported in `E:\mc-video\oq\ledger\<item>\REPORT.md` and built into the model one part at a time, each against its frame (isolate.py).

| # | Item | Status |
|---|---|---|
| 1 | The barrel's place (34:30's 0.5-0.8 mm out) | **Holds**: on 13:04.4 the bridge's other holes put the fusee-barrel distance at 36.5-38.2 by map (model 37.56); each bushing left out lands 0.1-0.45 from its place (`tools/holeloo.py`) |
| 2 | The train bridge's holes through the plate-placed map (handover 1) | **Hold**: every hole on the owner's 23:30 trace within 0.6 mm left out of an affine or homography on the rest, most 0.35 (the train-blocking screw's 0.25) |
| 3 | The pillar plate's holes (9:03, 14:43.38) | **Hold** within those oblique frames' 0.3-1.8 mm; nothing to move |
| 4 | The barrel-bridge screw head past the rim (handover 3) | **Closed**: the screw now at (-22.96, 25.82), r 34.55, its head inside r 38.8 |
| 5 | The balance's place (handover 5) | **Closed 19 October**: `L.B` stands (13:44, ±0.6) |
| 6 | The barrel bridge's horn ends and rim (handover 2) | **Done**: the cock-side end a measured circle, r 35.15 about (10.69, 39.43) (13:04.2/.4 at the near face, 0.04 mm rms; `bb_hornend.py`), easing 0.05 clear of the cock over its last 2.5 mm (owner's choice) |
| 7 | The mounting ring's flange, dial feet radius, dial thickness, case rim, bezel, crystal, hands' profile, case bracket | Agent measuring (`ledger\ring_dial`) |
| 8 | The fusee cone and heights side-on, barrel level and cap, end plate, ratchets, chain | Agent measuring (`ledger\fusee_barrel`) |
| 9 | The box and gimbals (Fig. 106) | **Measured** (`E:\mc-video\oq\ledger\box\REPORT.md`): height 196 (base 105, glass lid 71, outer lid 20) not 176, piano hinges, two split hasps, nuts 25 across, pivots 12 mm higher (RY about -8), cup washers, the latch bracket's screws one above the other, a concave key block; being built on `claude/hamilton-box` |
| 10 | The cock's holes on their own camera, hairspring height, trip-spring bracket, train wheels' thicknesses, dust seal, setup cover, balance screws' slots, discharge jewel | Agent measuring (`ledger\balance_small`) |
| 11 | The escape lower endstone cap | **Differs**: on 39:31 the setting sits in a round recess in the dial face (about r 4.8 on 40:08's camera, centred on `L.E` within the frame's 1.5 mm), a small hole beside it; on 40:05/40:08 a steel cap in the recess held by one screw (about 3.9 mm from the centre). The model: a flat cap, two screws ±2.1. Needs its outline traced |
| 12 | The click's pivot (8.95 vs 10.0-11.0) | Owner's task 07 |
| 13 | The lower train bridge, the escape bridge | Owner's tasks 04, 05 |
| 14 | The fourth's upper setting (13:49.5) | Open |
| 15 | Records out of step with the code (ledger summary 8, Fig. 108's stale records) | After the agents' readings, one pass |
