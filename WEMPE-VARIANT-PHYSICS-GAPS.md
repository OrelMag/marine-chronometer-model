# The Wempe's non-sheet versions: what their physics doesn't cover

Written 29 October 2026 alongside the geometry check of the detent, its block and the parts at their heights (`WEMPE-VARIANT-ESCAPEMENT.md`). That check was geometry only, at the owner's choice. This file lists what the physics tools leave unchecked or stale for the three versions built from photographs:
- **3955**: Wempe No. 3955 as photographed.
- **6mx**: the Soviet 6MX.
- **1943**: the escapement of 1943.

Nothing here has been run or changed.

## What exists

| Version | Physics of its own | The page runs |
|---|---|---|
| 6mx | `wempe_6mx.js`: its bodies weighed by `wempe_inertia.py --rev 6mx` into `wempe_inertia_6mx.json`, through makeEsc: swing, rate, and the chatons' shake. `wempe_banking.js`: its banking table. `wempe_essaydata.js`: its swing table and trial (`WEDATA.rev6`). | its own escapement (`WPHYS.rev('6mx')`, `WESC.SET6`) |
| 1943 | `wempe_1943.js`: its bodies (`wempe_inertia_1943.json`) through makeEsc. `dynamics.js` once by hand on the same bodies (300 beats, README). | the drawings' escapement |
| 3955 | none | the drawings' (first-drawn) escapement |

## Gaps

### Made stale by this geometry pass (29 October 2026)

1. **The 1943 escape arbor's inertia.** Its collet is now a straight cone (Ø 3.0 to 1.6 over 5.0) where it had the first-drawn cone and pipe. `wempe_inertia_1943.json`'s escape body, and so `wempe_1943.js`'s JW, swing and rate, still weigh the old collet.
2. **The 6MX escape arbor's inertia.** Its pinion is shorter (3.77 against 3.9) and its collet's end smaller (Ø 1.55 against 1.70). `wempe_inertia_6mx.json`, `WESC.SET6`'s JW, the 6MX's swing table (`WEDATA.rev6`), its banking table and `wempe_6mx.json` still weigh the old ones.
3. **The 6MX and 1943 blocks** are fixed and weighed by nothing. Whether the 6MX's larger banking head (Ø 3.4) moves the place where the pipe banks in the physics wasn't checked: `WESC`'s banking, not these solids, may be what the tools use.
4. **No check notices items 1 and 2.** `wempe_escapement.js` checks only the plain Wempe's bodies against the page's solids. `wempe_6mx.js` and `wempe_1943.js` check their JSON against themselves, not against the solids. Rerunning `wempe_inertia.py --rev 6mx` and `--rev 1943` with `--write`, then `wempe_6mx.js --write`, `wempe_1943.js --write`, `wempe_banking.js --write`, `wempe_essaydata.js --write` and the Wempe report, would bring them up to date (a few minutes, then about 15 for the essay data and banking).

### Never covered

5. **Wempe 3955 has no physics of its own.** Its own bodies are never weighed (no `wempe_inertia.py --rev 3955`):
   - the straight-cone collet;
   - the impulse roller in steel, not beryllium copper;
   - the masses' poising holes and plain tops;
   - the banking screw, drawn turned in.

   No swing or rate is worked out for it, and the page runs the first-drawn escapement's.
6. **The detent as a frame, `tripping.js --model wempe`**, is built from the last revised detent's pieces. It is never run on the 6MX's or 1943's detent (1436's bracketed sections, the first-drawn heights, the banking on a domed screw head). Neither version's ringing against its depth of lock, its blows or its preload floor is checked.
7. **The 1943 version's banking screw** as an adjustment: `wempe_banking.js` tabulates the drawings' escapement and the 6MX's, not the 1943 block's. The page's Banking screw control runs the drawings' table in that version.
8. **`dynamics.js` in time** has never been run for the 6MX (only makeEsc, through `wempe_6mx.js`). It ran once by hand for 1943 and isn't in `ci.py`.
9. **The build checks**, run only on the drawings' version and the two builds:
   - tolerances, bench, Monte Carlo and navigation;
   - the whole transmission;
   - thermal frame, wear, overwind and motion work;
   - strength.

   Each version's own escapement and detent never pass through them.
10. **The 6MX's adjusting slide and stud, and the 1943 block's stud.** How each clamps the block isn't known (README, Unresolved), so nothing tests the block's hold against a knock.
11. **The 6MX's case** hangs 13.2 lower in the gimbals. `massprops.py` and `gimbals.js --model wempe` weigh only the drawings' bowl, so its gimbal periods and stops are unchecked (README, Unresolved).
12. **The 6MX's mainspring.** No 1950s source gives its strip; the drawings' is used (README, Unresolved).
13. **The 6MX's electrical contact's load** on the seconds arbor is in its weighed body, but the contact's drag on the train (the stone lifting the lever every second beat) isn't modelled in the drive.
