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

## 4. The contact's drag on the train (gap 13)

**Method.** `node wempe_6mx_contact.js [--json OUT]` (new; under a second; reports, never fails) works the load from the page's own geometry through the 6MX's own makeEsc:
- **The geometry** (`WD.CONTACT6`, train.js's `c6r` and `C6K`): the contact wheel's teeth rise r 9.3 to 10.2 over 55 % of the 6° pitch. The stone rests 0.4 over the root and is carried 0.58 out (0.08 clear at the tip). The lever turns 4.6° (C6K 7.25 mm a radian) against the spiral 59, its screw's point 14.4 from the staff.
- **The friction:** the flank stands 58° to the tangent, so the stone's friction (μ 0.15, estimated) adds 44 % to the work.
- **When the load acts:** the seconds arbor moves only with the escape wheel (80/10), so a lift takes its work out of one impulse in two. Its share of that beat's work (86.1 µN·m over a tooth's 24°, 36.1 µJ) lowers that beat's drive. The swing is makeEsc's `ampAt` at the two beats' mean drive; the rate is the mean of their `rateAt`.

**The unknown.** No source gives the spiral's section or the contact's force:
- Romanov 1975, p. 208, says only that the spiral (волосок, "hairspring") makes the contact and returns the lever.
- The TU and the user instruction give the current only: at most 5 mA at 1.5-6 V, normally 2-3 mA.

So the force at the screw is swept. It is bracketed by hairspring-like copper-alloy spirals of the measured size (7 turns, Ø 8.9, 120 mm of strip, E 120 GPa), sections 0.03 × 0.2 to 0.08 × 0.5, preloaded half a turn to one and a half: 0.01-1.4 gf, the middle one (0.05 × 0.3, one turn) 0.14 gf.

**Figures** (at the reference drive, 12 h; the spiral's stiffness over the lift 3.1 µN·m a radian):

| Force at the screw | Share of a lift beat's drive | Escape torque at the slope's steepest | Swing | Rate |
|---|---|---|---|---|
| 0.05 gf | 2.3 % | −3.3 % | 194.4° (−1.4°) | −0.04 s a day |
| 0.1 gf | 4.6 % | −6.5 % | 193.0° (−2.8°) | −0.10 |
| 0.2 gf | 9.1 % | −12.9 % | 190.2° (−5.6°) | −0.22 |
| 0.5 gf | 22.7 % | −32 % | 181.4° (−14.4°) | −0.66 |
| 1 gf | 45 % | −64 % | 165.7° (−30.1°) | −1.8 |
| 2 gf and up | over 90 % | more than the drive | a lift beat under the least drive (26 %): it stops | |

The rate is the escapement's, makeEsc's steady at the mean drive. A first version paired `rateAt(A, s)` with a swing that wasn't drive s's own, which scattered it ±0.1 s a day. It leaves out the hairspring's isochronism.

**Two estimates under every row.**
- **The force's arm** is taken whole, the screw's point 14.4 from the staff: each row is an upper bound for its force.
- **The screw's travel off the disc** (14.4 × the lever's 4.6°, about 1.15 mm) is unmeasured. The work, and so every figure, scales linearly with it. It rests on three estimates: the contact wheel's root (Ø 18.6), the stone's 0.4 rest over it, and Fig. 100's arms, put on photographs that don't show the stone. A smaller open gap on a photograph would shrink every row with it.

**A bound from the sources.** The TU makes the contact 6MX and the contactless one alike but for the jewels (20 against 15, Table 1) and the contact's rating (1.2.10). Both are held to the same metrological requirements and 35-day trial, and the 1954 instruction gives one swing band, 225-270°, for both. A contact that took 30° of swing, or stopped the chronometer on its lift beats, couldn't pass them. So the stiff end of the bracket (about 1 gf and up) is ruled out, and a real contact costs a few degrees at most.

**Verdict: doubtful, for the owner.** The contact is not a negligible load. A beat brings the escape wheel only 36 µJ, and the lever must be turned 4.6° up a 58° flank against the contact's force.
- **The middle spiral** (about 0.14 gf) costs about 4° of swing as bounded above: the 6MX with its contact would swing about 186-196° over the wind, not the page's 190-200°.
- **The light end** (0.01-0.05 gf) costs under 1.4°.
- **The rate** moves under 0.25 s a day to 0.2 gf.

So the effect is on the swing, the margin to the 225-270° band (which the model is already under) and the least drive. Romanov's "hairspring" is consistent with a contact well under 1 gf.

What would settle it is either of two measurements, neither in any source we hold: the spiral's section and preload, or the screw's open gap on a photograph.

The page's physics (`WPHYS.rev('6mx')`) leaves the drag out. Whether to put it in, and at what force, is the owner's choice, since no source gives the force. **Recommended:** keep the page as it is and record the drag in the README's "Estimated" and in the Wempe report's 6MX section, as a range: about −4° at the middle spiral, −1.4° to −30° over the bracket.

**A note for Beta and Gamma (no action here).** Romanov's worked example 5 (p. 209) gives the escape wheel 16 teeth "for the contact chronometer" and 15 without. `References/wempe/documents/6MX-figures.md` already records the 16-tooth wheel and its 75/10 seconds stage as the later, redesigned 6MX (Tarasov 1976), not Kirov 247's first generation. Romanov's line ties the 16 teeth to the contact version too, so it is worth a glance when Kirov 247's own count is next checked.
