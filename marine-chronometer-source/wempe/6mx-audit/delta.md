# The Soviet 6MX's physics: Session Delta's checks

Session Delta, 7 November 2026, for Session Alpha's audit of the 6MX (the owner's request). Branch `claude/wempe-6mx-physics`. It covers the gaps in `WEMPE-VARIANT-PHYSICS-GAPS.md` that were never run: 11 (the gimbals), 6 and 8 (the detent as a frame, the escapement in time), 3 (the banking head) and 13 (the contact's drag). The drawings' versions are untouched: `gimbals_wempe.json` is still what `massprops.py --model wempe` finds.

## 1. The gimbals (gap 11)

**Method.** `massprops.py --model wempe --rev 6mx --write` (new option) loads the page at `#view=case&rev=6mx`. The 6MX's own bowl, brackets, bezel, contact, box and movement are weighed solid by solid at their densities into `tools/gimbals_wempe_6mx.json`. The 6MX's frosted plates use `M.gilt6`, clones of the gilt that the density table didn't list. Without them they went unweighed (the pillar plate came out at 20 g), so `wempe/checks.py`'s `MASSPROPS` now weighs them as the gilt's brass (8.45). `MC_WREV=6mx node gimbals.js --model wempe` then runs gimbals.js's bodies, seas and stops on that file, and the escapement's response through the 6MX's makeEsc (`WESC.SET6`, `wempe_inertia_6mx.json`). `MC_WREV=6mx node wempe_6mx_gimbal_sweep.js` sweeps the pivots' height on the bowl.

**Figures.**
- **The case with its movement:** 2145.6 g, against 2467 g for the drawings' case. The bowl alone is 907.9 g, the gimbal ring 408.4 g. In its gimbals it weighs 2.55 kg.
- **Hang:** levelled, the centre of gravity is 21.32 mm under the case pivots, against 14.27 mm for the drawings' case. That is 7.0 mm lower, as case.js's `DY6` says (not 13.2).
- **Own periods:** the case on its pivots (12-6) 0.578 s; the ring with the case (3-9) 0.661 s.
- **Stops:** the box meets the bowl at 60.5° and 59.5°. The bowl meets the ring at the locking bracket at 52.5° each way.
- **In the working seas** (up to NORDFORSK's limit):
  - the case keeps within 0.31° of the apparent vertical;
  - it never reaches the pad or the box;
  - at most 3.4 mg acts across the staff, against 13.8 g that would trip the detent;
  - the rate moves at most 0.0095 s a day.
- **Beyond the working seas:** a storm (fore and aft) takes the case onto the pad once, passing on 0.0 g. A small vessel in a rough sea gives 100 mg across the staff and 0.088 s a day.

**Criteria and verdict.** Every gimbals.js criterion passes (exit 0):

| Criterion | 6MX | Pass |
|---|---|---|
| own periods clear of the beat (by 10 %) and a ship's roll: 0.55-1.5 s | 0.578, 0.661 s | ok, by 5 % (15.6 % over the beat) |
| limiting sea is NORDFORSK's (0.12 g) | 0.117 g | ok |
| working sea within 2° of the apparent vertical | 0.31° | ok |
| working sea meets neither pad nor box | clear | ok |
| what reaches the escapement under half its trip | 3.4 mg against 13.8 g | ok |
| rate moved under 0.05 s a day | 0.0095 | ok |

**The pivots' height.** `DY6` rests on Kirov 247's brackets, measured ±2 mm on two photographs. The sweep shows the verdict holds over that whole range:

| Pivots higher on the bowl | −2 | −0.7 (Kirov 2973's 3.7 under) | 0 (Kirov 247) | +0.5 | +1 | +2 mm |
|---|---|---|---|---|---|---|
| case period, s | 0.593 | 0.583 | 0.578 | 0.575 | 0.572 | 0.567 |
| against 0.55 s | ok | ok | ok | ok | ok | ok |

The ring's period is 0.683 s at −2 mm and 0.644 s at +2 mm. The beat itself moves the case 0.54″ at 2 Hz.

**The criterion corrected.** gimbals.js has judged the beat clearance at 10 % since 25 October 2026: the owner lowered it from 15 % when the Hamilton's measured pivots put its case at 0.575 s. `wempe_gimbals.js`, the Wempe's report that `gimbals.js --model wempe` runs, still tested 15 % while citing gimbals.js's criterion. It now tests 10 % (0.55 s). Both versions pass under either limit except the 6MX's case: under the old 15 % it would have failed from +0.4 mm up. The drawings' case is 0.67 s and 0.76 s. Not doubtful, nothing for the owner.

## 2. The escapement in time and the detent as a frame (gaps 8 and 6)

**Method.** Both tools already took the 6MX's escapement through `wempe_load.js` (`MC_WREV=6mx`: `WESC.SET` with `WESC.SET6`'s I 2513.3, JW 10.19, ID 7.72), but `dynamics.js` read the drawings' bodies always. Now `MC_WREV=6mx` reads `wempe_inertia_6mx.json` (it changes `dynamics.js`'s `WJ`; `wempe_tripping.js` takes it from there).

The 6MX's detent needs no pieces of its own in the frame:
- The page draws it with `escapement.js`'s `DETV.late`, whose sections are `DETV.last`'s exactly: the spring 1.9 wide, blade 0.50 then 0.28 × 0.9, horn 0.22 × 0.75, pipe Ø 1.15. Only its heights (`ew0`) and its gold spring's screw (WN-14, steel) differ, and a plan frame sees neither.
- Its weighed detent is 90.4 mg and 7.72 g·mm² (the drawings' 7.74).

Runs, both exit 0. The drawings' `dynamics.js --model wempe --quick` is unchanged (exit 0, its swing 196.0° as before).
- `MC_WREV=6mx node dynamics.js --model wempe`: about 4 min.
- `MC_WREV=6mx MC_PROCS=6 node tripping.js --model wempe`: about 5 min.

**Figures: `dynamics.js` (in time against makeEsc).**

| Check | 6MX | Criterion | |
|---|---|---|---|
| bodies are makeEsc's | balance 2511 g·mm², train at the escape wheel 10.218 (JW 10.19 + 0.028), detent 7.720 | as weighed | ok |
| swing, beat by beat | 195.8° (makeEsc 195.8°) | within 3° | ok |
| own rate | −11.81 s a day (makeEsc −11.85; the drawings' −11.57) | Airy's within 0.3 | ok |
| tooth lands | 10.2° after release (the drawings' 9.0°: the heavier train) | within 1.5° | ok |
| detent's fall | off the stone 2.74°, onto the escaping tooth 4.48°, home 13.48° | within 0.5-1° of makeEsc | ok |
| 300 beats | no tooth lost or gained; detent home 16.6 ms before the next tooth | | ok |
| over spring, preload, inertia, stop and train ×1.5 varied | home every time | | ok |
| isochronism over the wind | 190 → 201°, +0.90 s a day (makeEsc +0.75) | within 0.2 of makeEsc; under 0.5 per 10° | ok |
| least drive | 26 % of the calibrated torque (about 49°) | | |
| driven to 334° / 363° | one unlocking a swing / trips past TRIP 349° | | ok |
| blows across the plate | 109 g (0.5 ms), 30 g (3 ms); no preload 55 g, 11 g | | |
| at sea (yaw ±10°, 0.3 g sideways) | under 0.012 s a day, no trips | under 0.2 | ok |

**Figures: `tripping.js` (the detent as a frame).**

| Check | 6MX | Criterion | |
|---|---|---|---|
| frame weighed | 92.58 mg, 7.814 g·mm² (solids 90.40, 7.720) | within 3 % | ok |
| rigid on a hinge against `dynamics.js` | 195.45° against 196.04°, rate −11.91 against −11.79, release 2.13°, home 13.72° against 13.48° | 1.25°, 0.3 s a day, 0.2°, 0.3°, 0.6° | ok |
| first mode, clamped | 98 Hz (the spring); the gold spring 698 Hz | | |
| as drawn, running | no tooth past in 12 beats | | ok |
| a held tooth's stone | at most 53.1 % of the 236 µm depth of lock (125 µm), at −22° on the return swing: the gold spring slamming back onto the horn | under half | `~~` |
| over the other estimates (Q, restitutions, gold spring 83-110 GPa, μ, spring 0.09) | no tooth past, at most 68.1 % | | ok |
| contact stiffness 4× (penalties) | 6 teeth past | | `~~` |
| preload floor, ringing | 0.5× (0.40 g) and up no tooth past; 0.2× and under, 6 past | | |
| pushed by the drive | no trip to 360° | none under 300° | ok |
| blows, the frame against the rigid detent | 76 g against 107 g (0.5 ms), 27 g against 30 g (3 ms), twist 4.5 rad/s both | preloaded ≥ 20 g | ok |
| preload floor, knocks | 20 g needs 0.64 g (0.80×) or more | | |

**Verdict.** The 6MX's escapement runs in time as makeEsc has it, and its detent holds every tooth at the model's settings. The heavier seconds arbor (the contact's cam: 135 g·mm² against 77) makes the tooth land 1.2° later and the rate 0.24 s a day slower than the drawings' escapement.

The two `~~` lines are not the 6MX's own: its frame is the drawings' frame. Both are the frame's known sensitivities, and the Wempe report's run on the drawings' escapement prints both:
- the gold spring's blow takes the held stone to 53.1 % on the return swing (the drawings' 53.9 %); over the other estimates at most 68.1 % (the drawings' 77.9 %);
- the penalties' stiffness.

The ringing floor is 0.40 g, the drawings' too (0.5×). The knock floor is 0.64 g; the report's data doesn't print the drawings' for comparison. The 6MX, like the drawings' detent, has no source for its preload (0.8 g, estimated).

## 3. The 6MX's banking head and the banking table (gap 3)

**Question.** The physics banks the detent where it is drawn: the pipe's side on the banking, 0.8 g of preload as a moment. The 6MX's banking is the domed brass head of the cross screw WN-gkA, Ø 3.4 and 1.4 high. A dome recedes fast off its apex: 0.07 mm at 0.5 off, against a 0.236 depth of lock. If the pipe met it off the apex, the 6MX would bank somewhere the physics doesn't put it.

**Method.** `wempe_banking_gap.py --model wempe --rev last,6mx,1943,first,3955` (new; about a minute) works on the page's own solids, the detent at rest as drawn. Rays go out from the pipe's axis every 1° at 41 heights over its length, against every shown solid within 1.5 mm that isn't the detent's. The pipe's axis is taken from the locking stone, since the pipe is fused with the blade and horn into one mesh. The least hit less the pipe's 0.575 radius is the gap, with the solid, the band of contact and the normal.

**Figures.**

| Version | Banks on | Gap | Contact band (pipe height from its foot; round it) | Normal in plan |
|---|---|---|---|---|
| 6MX | its head WN-gkA (Ø 3.4) | 0.005 | 0-0.9 mm of 1.9; 288-302° | (−0.423, 0, 0.906), 295° |
| 1943 | its head WN-gkA43 | 0.005 | 0-0.81; 288-302° | the same |
| first drawn | cone41 | 0 | 0-0.8; 288-302° | the same |
| Wempe 3955 | cone41 | 0 | 0-0.17; 288-302° | the same |
| last revised | nothing within 0.05 (nearest 0.22) | | | |

The last revised version has no banking drawn: README, Unresolved. The physics puts one where the detent is drawn.

**Verdict: closed.** The 6MX's head stands at the drawn gap, 0.005 (escapement.js's `bk.nH` 0.575 + 0.005). It meets the pipe over its lower half, with the same normal as every other version's banking. So the Ø 3.4 head doesn't move where the pipe banks: the detent rests where makeEsc, dynamics.js and tripping.js take it.

`wempe_banking.js` (about 5 min) is up to date (exit 0). Its 6MX table is built as follows:
- makeEsc for the 6MX (`MC_WREV=6mx`), rebuilt at each depth of lock 0.150-0.250, zeroed at the drawn 0.235;
- 195.78° at the reference drive, falling away from 0.244, no unlocking from 0.248;
- a turn moves the stone 0.25, the 6MX screw's own pitch (M1.2, `bk.pt` 0.25).

So the table follows the head. Its bench window is the drawings' (`tolerances_wempe.json`: no tolerances run is made for the 6MX). Step 2 supports that: the 6MX's frame rings to 53.1 % of the depth of lock against the drawings' 53.9 %, and its ringing floor is the same 0.40 g.
