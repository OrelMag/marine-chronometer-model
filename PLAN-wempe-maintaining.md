# Handover: claude/wempe-maintaining (16 October 2026, stopped at the user's sign-off)

The Wempe's maintaining spring rebuilt from its drawn ring: the pins as 05 06_4 A-B draws them, the ring closed by the drive with its ends nearly meeting (0.27-0.58 mm), 10-13 min of maintaining power, the ratchet falling only to its detent's tooth, the clicks' seat off the face's edge, and mechanisms-wempe.js's root read on the outer outline. See RESOLVED.md (Winding and maintaining work) and the Wempe README (Physics: energy, The maintaining spring).

State when stopped:
- main 3.01.00 is merged in and reconciled (84d35438, 3b81c24e). The Wempe checks it touches pass: maintaining.py, mechanisms.py, wempe_ratchets.js, holecheck, invariants, audits, exploded, solids, fine.py and bom.py (geometry.py), smoke and stopwork.
- ci.py --full had passed 8 steps of 94, no failures, when it was stopped. It hasn't run to the end on this tree.
- main has moved since: 3.02.00 (claude/wempe-export: STL and glTF downloads) and 3.03.00 (claude/wempe-open-ends, released by marine-chronometer-bf).

To finish:
1. git fetch; merge origin/main --no-ff. Take main's generated files (dist, site/, the Wempe report's assets and index.html, audit-expected.json) and regenerate them.
2. From wempe-open-ends, take the maintaining detent's straight hidden edge (05 05 05-1). It replaces this branch's step sizing in fusee.js ("let s=8.6 ... near(x,y)"). Then check its clearance over the detent's whole ride with fine.py --model wempe: the ratchet now stands about 15° ahead of the wheel.
3. From wempe-export, check that its part export copes with the maintaining spring's geometry being rebuilt as the lead changes (msBent[].geo, gEP). Run its export check, if ci.py has one.
4. python ci.py --only for the Wempe's steps, then python ci.py --full (about 40 min). Then audit.py --model wempe [--rev first] --update if only the clicks' cup-floor count changed, and wempe/verification: node reportdata.js --only escapement,strength,sustaining,bench,montecarlo,physics, python geometry.py, python build_report.py; then python build.py --site-url https://www.marinechronometermodel.com.
5. Check main is clean and pushed, then merge --no-ff into main and release with the next free version (a patch). The lines for visitors:
   - "The Wempe's maintaining spring is pinned as its drawing shows; in running it closes until its ends nearly meet, and with the key held it keeps the balance going about ten minutes (no longer 70 seconds)."
   - "The Wempe's fusee comes back onto the nearer of its two clicks when winding stops, and its ratchet falls back only to its detent as the key goes on."
6. The user deploys (python deploy.py) or says to. Then tell marine-chronometer-03 [e8ecaf] (claude/wempe-estimates, which waits on this) that it has landed.
