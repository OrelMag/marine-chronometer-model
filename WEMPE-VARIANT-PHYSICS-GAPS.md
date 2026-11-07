# The Wempe's non-sheet versions: what their physics doesn't cover

Written 29 October 2026 alongside the geometry check of the detent, its block and the parts at their heights (`WEMPE-VARIANT-ESCAPEMENT.md`). That check was geometry only, at the owner's choice. This file lists what the physics tools leave unchecked or stale for the three versions built from photographs:
- **3955**: Wempe No. 3955 as photographed.
- **6mx**: the Soviet 6MX.
- **1943**: the escapement of 1943.

Nothing here had been run or changed when it was written. Gaps 3, 6, 8, 11 and 13 were run for the 6MX on 7 November 2026 (Session Delta: `marine-chronometer-source/wempe/6mx-audit/delta.md`), each marked below.

## What exists

| Version | Physics of its own | The page runs |
|---|---|---|
| 6mx | `wempe_6mx.js`: its bodies weighed by `wempe_inertia.py --rev 6mx` into `wempe_inertia_6mx.json`, through makeEsc: swing, rate, and the chatons' shake. `wempe_banking.js`: its banking table. `wempe_essaydata.js`: its swing table and trial (`WEDATA.rev6`). | its own escapement (`WPHYS.rev('6mx')`, `WESC.SET6`) |
| 1943 | `wempe_1943.js`: its bodies (`wempe_inertia_1943.json`) through makeEsc. `dynamics.js` once by hand on the same bodies (300 beats, README). | the drawings' escapement |
| 3955 | none | the drawings' (first-drawn) escapement |

## Gaps

### Made stale by the geometry pass, closed 29 October 2026

1. **The 1943 escape arbor:** re-weighed with its straight-cone collet. Its escape body is 8.05 g·mm² (was 8.04) and its JW 9.30 (9.28 as last revised). `wempe_1943.json` is rewritten: the swing is 191.0-200.5° over the wind, as last revised within 0.1°.
2. **The 6MX escape arbor:** re-weighed with its shorter pinion and narrower collet end. Its escape body is 8.03 g·mm² (was 8.05), and `WESC.SET6`'s JW is 10.19 (was 10.21). These are rewritten from it: `wempe_6mx.json` (the swing 190.2-200.2° over the wind), its banking table (`wempe/js/bankdata.js`) and its essay data (`WEDATA.rev6`). `ci.py`'s `wempe-inertia-6mx`, released failing in 3.58.01, passes again.
3. **The 6MX and 1943 blocks** are fixed and weighed by nothing. Whether the 6MX's larger banking head (Ø 3.4) moves the place where the pipe banks in the physics wasn't checked: `WESC`'s banking, not these solids, may be what the tools use.
   - **Run 7 November 2026, closed** (`marine-chronometer-source/wempe/6mx-audit/delta.md` §3; `tools/wempe_banking_gap.py`): the 6MX's pipe banks on its own head at the drawn 0.005, with the same normal as every version's banking. `wempe_banking.js`'s 6MX table follows it.
4. **No check weighs the 1943 bodies against the solids.** `ci.py` has a `wempe-inertia-6mx` step but none for 1943, and `wempe_1943.js` checks its JSON against itself. A change to the 1943 escapement's parts can leave `wempe_inertia_1943.json` stale unnoticed.

### Never covered

5. **Wempe 3955 has no physics of its own.** Its own bodies are never weighed (no `wempe_inertia.py --rev 3955`):
   - the straight-cone collet;
   - the impulse roller in steel, not beryllium copper;
   - the masses' poising holes and plain tops;
   - the banking screw, drawn turned in.

   No swing or rate is worked out for it, and the page runs the first-drawn escapement's.
6. **The detent as a frame, `tripping.js --model wempe`**, is built from the last revised detent's pieces. It is never run on the 6MX's or 1943's detent (1436's bracketed sections, the first-drawn heights, the banking on a domed screw head). Neither version's ringing against its depth of lock, its blows or its preload floor is checked.
   - **Run 7 November 2026 for the 6MX** (delta.md §2): its detent's sections are the last revised's (`DETV.late` = `DETV.last`), so the frame is the same. `MC_WREV=6mx tripping.js --model wempe` passes. The 1943's isn't run.
7. **The 1943 version's banking screw** as an adjustment: `wempe_banking.js` tabulates the drawings' escapement and the 6MX's, not the 1943 block's. The page's Banking screw control runs the drawings' table in that version.
8. **`dynamics.js` in time** has never been run for the 6MX (only makeEsc, through `wempe_6mx.js`). It ran once by hand for 1943 and isn't in `ci.py`.
   - **Run 7 November 2026 for the 6MX** (delta.md §2): `MC_WREV=6mx dynamics.js --model wempe` (it now reads `wempe_inertia_6mx.json`) passes.
9. **The build checks**, run only on the drawings' version and the two builds:
   - tolerances, bench, Monte Carlo and navigation;
   - the whole transmission;
   - thermal frame, wear, overwind and motion work;
   - strength.

   Each version's own escapement and detent never pass through them.
10. **The 6MX's adjusting slide and stud, and the 1943 block's stud.** How each clamps the block isn't known (README, Unresolved), so nothing tests the block's hold against a knock.
11. **The 6MX's case** hangs 13.2 lower in the gimbals. `massprops.py` and `gimbals.js --model wempe` weigh only the drawings' bowl, so its gimbal periods and stops are unchecked (README, Unresolved).
   - **Run 7 November 2026** (delta.md §1): `massprops.py --model wempe --rev 6mx` writes `gimbals_wempe_6mx.json`, and `MC_WREV=6mx gimbals.js --model wempe` passes. The case's period is 0.578 s against 0.55; the 6MX hangs 7.0 lower, not 13.2. `wempe_gimbals.js` now uses gimbals.js's 10 % beat clearance.
12. **The 6MX's mainspring.** No 1950s source gives its strip; the drawings' is used (README, Unresolved).
13. **The 6MX's electrical contact's load** on the seconds arbor is in its weighed body, but the contact's drag on the train (the stone lifting the lever every second beat) isn't modelled in the drive.
   - **Worked 7 November 2026, doubtful** (delta.md §4; `tools/wempe_6mx_contact.js`): the drag costs about 4° of swing at a middle estimate of the spiral (0.14 gf), −1.4° to −30° over plausible spirals. The TU's common requirements rule out the stiff end. Not in the page's physics: the owner's choice.
