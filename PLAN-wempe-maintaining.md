# claude/wempe-maintaining: ready for the user's sign-off (18 October 2026)

## Sign-off summary

**What it changes for visitors (the Wempe page):**
- The maintaining spring is pinned as 05 06_4's Schnitt A-B draws it (the eye's pin up into the ratchet, the other down into the fusee wheel). Running, the drive closes the ring until its ends nearly meet (0.27-0.58 mm apart), and the page draws it bent so, the ratchet 14.4-15.6° ahead of the wheel.
- With the key held, it keeps the balance going 10.7-13.9 minutes (it was 70 seconds, from a pencilled note read as its deflection).
- When winding stops the fusee comes back onto the nearer of its two clicks, and when the key goes on the ratchet falls back only to its detent.
- New in this session: run down, the train runs on what the maintaining spring still holds and stops about 12 minutes later, with the spring spent. Before, it stopped at once and left the spring closed.

**Suggested release:** `minor` (it merges a branch). The lines, for you to decide:
- "The Wempe's maintaining spring is pinned as its drawing shows. Running, it closes until its ends nearly meet, and with the key held it keeps the balance going for about ten minutes (no longer 70 seconds)."
- "The Wempe's fusee comes back onto the nearer of its two clicks when winding stops. When the key goes on, its maintaining ratchet falls back only as far as its detent."
- "Run down, the Wempe keeps going on its maintaining spring for a few minutes before it stops."

**What was checked** on the merged tree (main 3.13.01 merged in, aaefed8a, plus the commits after it). Each browser check ran on its own:
- Passed: maintaining.py --model wempe (twice, the second on the GPU after the run-down change); fine.py --model wempe as last revised, as first drawn and as the 6MX (0 new or grown); solids, audit (nothing new), invariants and holecheck (5 states, 0 failing) with --model wempe; smoke.py --model wempe on the GPU, as ci.py runs it; mechanisms.py --model wempe (rewritten: --write); wempe_ratchets.js; wempe_sustaining.js; wempe_escapement.js; wempe_strength.js; wempe_physics.js; wempe_6mx.js; wempe_tolerances.js; wempe_bench.js (bench_wempe.json rewritten); wempe_montecarlo.js; wempe_transmission.js (exit 0); wempe_essaydata.js (up to date); the Wempe's type check.
- The Wempe report: reportdata.js --only escapement,physics,strength,sustaining,tolerances,bench,montecarlo,transmission (20 runs, 0 failing), wempe_transmission_trace.js, geometry.py and build_report.py. Then the build with the site URL.
- isolate.py maintaining --model wempe, seen from below beside 05 06_4. The eye is at 6 o'clock with its pin, the ring is closed until its ends nearly meet, and the swell runs round the pin at 295°, as before the merge. Only its version groups and its light-blue 310° temper (main's) changed.

**Open, or for you to decide:**
1. Run `python ci.py --full` before merging (not run here; about 41 minutes).
2. Keep or drop the run-down change (above): it is new behaviour, not part of the branch as handed over.
3. Under SwiftShader (MC_GL unset), smoke.py --model wempe fails "Wind from run down did not finish": a wind from run down takes 58 s of its 60 s at SwiftShader's frame rate. main winds at exactly the same rate, so this branch didn't cause it. On the GPU, as ci.py runs it, it passes.
4. audit.py --model wempe reports four expected 6MX entries that no longer appear (ring screws, contact screw). It doesn't fail. Checking whether main does the same is left to ci.py.
5. After the merge, tell marine-chronometer-03 (claude/wempe-estimates, which waits on this branch) that it has landed.

## What the branch did (16 October 2026, marine-chronometer-76)

The Wempe's maintaining spring is rebuilt from its drawn ring: the pins as 05 06_4 A-B draws them, the ring closed by the drive with its ends nearly meeting, 10-13 minutes of maintaining power (now 10.7-13.9 on main's 3.03 escapement), the ratchet falling only to its detent's tooth, the clicks' seat moved back off the face's edge, and mechanisms-wempe.js reading the root on the outer outline. Its tool is tools/wempe_sustaining.js (a quick step in ci.py). See RESOLVED.md (Winding and maintaining work) and the Wempe README (Physics: energy, The maintaining spring; Readings corrected).

## The merge of main 3.13.01 (18 October 2026)

- fusee.js: main's maintaining detent step (the straight hidden edge from 05 05_12, 215bed8) replaces this branch's step sizing. It is 0.52-0.61 clear of the wheel's tips over the whole ride, and the ride doesn't depend on the ratchet's lead. Main's version groups ('last 6mx 1943', 'first') now sit under gMS2 with the bent spring, as PLAN-wempe-6mx.md's note asked. M.blue310 is used for the spring.
- app.js: main's per-version escapement (physRev, PR.ampStep) is kept together with the branch's maintaining-spring state (H.ms, m0, fall).
- escphys.js: main's WPHYS.rev is kept together with the branch's MSK, MSK2, MSB, MBK, susDrv and the rest.
- ci.py: both new quick steps are kept (wempe-sustaining, wempe-6mx).
- checks.py: main's stop-work entries are kept. The branch's ('fusee:Buffer','stopWork:Buffer') entry was dropped: on main's reworked stop slot, fine.py doesn't hit it in any of the three versions.
- wempe_transmission.js now reads the spring from WPHYS. These are the same numbers it already carried.
- The Wempe export (wempe/js/blender.js) now takes its winding drive from WPHYS.susDrv. The copy draws the spring at the running lead. It doesn't rebuild the spring per frame (it passes no `ms`), so the export is unaffected by msBent.
- The README and RESOLVED.md keep both sides' text. The README's maintaining-work and pawls results were rewritten from this run: they still described 70 s and the wind0 bug, which the branch had fixed.

## Handover notes

- Merging into main: main has moved again by then. Fetch, merge main into the branch, and resolve built copies and site/ by rebuilding. Then run `ci.py --full`, merge with --no-ff, and release (above).
- The user deploys (python deploy.py) or says to.
