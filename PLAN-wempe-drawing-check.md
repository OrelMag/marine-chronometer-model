# The Wempe's parts, each against its drawing

Started 26 October 2026, after the owner found two parts the fidelity audit (WEMPE-PROVENANCE.md, 25-26 October) had passed: the upper cock (05 08 03-1), its boss faceted and its relief step 0.8 mm too far out, and the set-up click (05 08 05-2), a sliver at its beak and a nick at its nose. Both were found by looking at the part alone, close up and from underneath, beside its sheet. That audit compared parts mostly on photographs and by verdict; this pass compares every part that has a drawing with that drawing, feature by feature and dimension by dimension, on the built solid.

## The method, for every part

1. **The sheet.** Find every sheet for the part (`References/wempe/drawings/`, the transcription in `References/wempe/transcriptions/`, the part's comment in `wempe/js/*.js`, the Wempe README). View each sheet at full resolution, cropping and zooming every view (plan, sections, details). List every feature the sheet draws (outlines, arcs and their radii, holes, sinks, chamfers, steps, slots, threads, teeth) and every dimension text, with its tolerance.
2. **The solid.** Measure the built part in the page (`?snap&qa`, `__mv`): its outline points, holes (`tools/holes.py --model wempe PART`), heights and thicknesses from its vertices, radii fitted to its arcs. Don't judge from a render alone.
3. **Compare, line by line.** One table row per feature and dimension: the sheet's value, the model's, the difference, the verdict (match, within tolerance, wrong, missing, extra) and how sure. The sheet decides; where the model departs on purpose (a recorded estimate or reading in the code comment or the README's Estimated or Readings corrected sections), say so and judge whether the reason still holds.
4. **Look at it.** Render the part alone (`tools/isolate.py PART --model wempe`) from every side, underneath included, and close up on every feature: facets on cones and chamfers, slivers at corners, nicks, open seams, missing holes or sinks, wrong-way features. Beside its sheet (`--ref SHEET --crop`).
5. **Every version** the sheets draw (as last revised, as first drawn, 1943; the 6MX's and Wempe 3955's where they differ from the sheets), as `setRev` in the page sets them.

## Batches (two agents at a time)

| # | Parts (`part()` names) | Sheets (start) | Status |
|---|---|---|---|
| 1 | topPlate, pillarPlate, pillars, ring | 05 08 00-1, 05 09 01, 05 08 02-1, 05 08 00-3, 05 08_01a/b | |
| 2 | barrelBridge (and its click), fuseeBush, dustBush, corkRing, upperCock, lowerCock, intermediateBridge | 05 08 05, 05 08 05-2, 05 08 01-2/-3, 05 08 03-1, U30, 05 08 00-2, 05 08 04 | |
| 3 | balance (rim, arm, masses, timing screws, staff, hub), hairspring, stud, rollers, balanceJewelsUp/Low | 05 03, 05 04 | |
| 4 | escapeWheel (arbor, collet), detent, detentBlock (each version's), escape jewels and endstones | 05 04, 1436, 05 04 01-x | |
| 5 | fusee (body, arbor, click wheel), fuseeWheel, coverPlate, vorreiber, dustPlate | 05 06 | |
| 6 | maintaining (ratchet, clicks, springs, spring), maintDetent (and its wire spring), stopWork | 05 06 01, 05 06 02, 05 05 05, 05 06_4 | |
| 7 | barrel (drum, lid, hook block), barrelArbor, setupRatchet, mainspring, chain | 05 07 | |
| 8 | centreWheel, intermediateWheel, secondsWheel (their arbors, pinions, bushes, settings) | 05 05 | |
| 9 | cannon, changeWheel, hourWheel, udWheel, udPinion, hands, dial | 05 02, 05 05 03 | |
| 10 | bowl, bezel, closingPlate, gimbalRing, box, lid, overLid, overBox, caseLock, key | 05 01, 51 00 | |

Each agent reads only and writes its findings to `oq/drawing-check/batchN.md` in the scratchpad. After each pair, the corrections it calls for are made together in one batch on `claude/wempe-artifacts` (or a branch of their own), each built from the sheet's own figures, then isolated against the sheet; the geometry checks (`solids.py`, `fine.py`, `holecheck.py`, `audit.py`, `exploded.py`, `bom.py`, all `--model wempe`) run once a batch, and a release follows. A correction that moves a part others are fitted to (a hole, a height) is checked against those parts before it goes in. Readings a sheet doesn't settle go to the README's Estimated section, not into the model.

The build book's drawings (`tools/drawbook.py`, `wempe/book/wempe-build-book.pdf`) are regenerated once, after every batch has been reviewed and corrected (the owner, 26 October 2026), not per batch.

## The owner's decisions (26 October 2026)

- Corrections that change the physics (the balance's timing weights and mass screws, the escape wheel's web, the detent's offset): re-measured on their sheets first; where confirmed, corrected and every Wempe physics tool and golden file rerun.
- The dust bush in both forms: the main model (as last revised) waisted as the 1946 assembly 05 08 01 and the photographs draw it; the earlier versions straight as its own sheet 05 08 01-3 (1942).
- The top plate's horn tips all three ways, one to a version: sharp as the part sheet (1943), r 1 as the 1946 assembly, r 0.3 on Wempe 3955 (its photograph).
- One release at the end, after every batch is corrected and checked; the build book regenerated then too.

## Results

(each batch's findings and what was corrected, as they come in)
