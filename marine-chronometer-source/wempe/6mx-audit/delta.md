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
