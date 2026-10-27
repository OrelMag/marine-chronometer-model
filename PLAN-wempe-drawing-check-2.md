# The Wempe's drawings, checked a second time

Planned 27 October 2026, after the owner found the hairspring stud wrong (fixed in 3.45.01) when the first drawing check (PLAN-wempe-drawing-check.md, 26-27 October, live 3.38.00) had passed it. The ledger for this pass is `WEMPE-DRAWING-LEDGER-2.md`. The first pass's ledger, `WEMPE-DRAWING-LEDGER.md`, and its reports stay as they are.

## Why the first pass missed the stud

05 03 02-3's "1,2 −0,1" (from the bar's middle to its edge at the square end) had been read as a slot 1.2 wide. The model drew the upright with a slit and a pin lying in it, in no hole, beside the spring. The audit read the sheet with the model's comments and transcription in hand, and its row "outer end in the stud: in the upright's slot with the pin: match" ([batch3.md](marine-chronometer-source/wempe/drawing-check/batch3.md), line 87) confirmed the misreading. Three gaps let it through:

1. **The sheet was not read independently.** The audit checked the model against the model's own reading of the sheet.
2. **The views were not checked against each other.** The end view draws the end unbroken with one Ø 0.7 hole, and a slot would show in it.
3. **No check asked how the parts join.** A pin lying in a slot touches something and overlaps nothing, so `fine.py`, `audit.py` and `holecheck.py` all pass it.

## The method, for every sheet

Each step writes its results into the sheet's row of the ledger and into the batch's report, `marine-chronometer-source/wempe/drawing-check-2/batchN.md`.

1. **Blind inventory.** The reading agent gets the sheet image and nothing else from the model: no `wempe/js/` code, no README, no transcription, no first-pass report. At full resolution, cropping every view, it lists:
   - every view (plan, sections and their cutting lines, end views, details, with their scales);
   - every line, solid, dashed or chain, and which feature it is an edge of;
   - every dimension text with its tolerance, and what its extension and leader lines touch (from which edge to which edge);
   - every hole: its size, depth, thread or fit, and what it is for (what goes into it);
   - notes, materials, finishes, revisions and struck figures.

   It writes its own interpretation of the part as a few sentences: its shape, and what joins it, where and how.
2. **Views checked against each other.** Every feature must appear consistently in each view that would show it, so a slot in plan must show in the end view and a hole in a section must show in plan. A dimension the inventory can't attach to an edge in some view is flagged as **unattached**, never passed. A feature in one view that is missing from another is flagged as **inconsistent**.
3. **Inventory against the transcription.** Only now the agent opens `References/wempe/transcriptions/` and the model's code comments. Every place where its blind reading and the transcription differ is a finding of its own (**misread**), whatever the model does.
4. **The solid.** As in the first pass: measured in the page (`?snap&qa`, `__mv`), with holes from `tools/holes.py --model wempe`, heights from the vertices and arcs fitted, then compared row by row with the inventory (sheet value, model value, difference, verdict, how sure). It is never judged from a render alone.
5. **Overlay.** The part's sheet from `tools/drawbook.py --model wempe` (the model drawn in first-angle projection, turned parts in half section) is laid on the original, rectified to the same scale and views. Every line on either that has no partner on the other is explained (a recorded version difference or estimate) or becomes a finding. Where drawbook has no sheet for the part, the overlay is made from `tools/isolate.py` renders in the sheet's projections.
6. **Fit list.** Every joint the part takes part in gets a row in the ledger's Joints table: what goes into what, the hole or seat, what holds it (a press fit, thread, screw, pin, riveting or spring), and the sheet or photograph that says so. Each row is then checked on the solid: the piece inside the named hole, the hole really there, the holding means present. Assembly sheets (`kompl.`, `gesamt`, the coloured section, 001) are read for joints first.
7. **Refutation.** A second agent gets only the sheet image and the built part (renders, `holes.py`, the page). It sees neither the first agent's report nor the code, and tries to disprove every row marked "match" and every joint marked "holds". A row it can't break stays. A row it breaks goes to the owner's review if the two agents still disagree after each has seen the other's argument. Where a sheet allows two readings, both are recorded with their evidence, and photographs (`References/wempe/photos/`) and videos (`References/wempe/VIDEOS.md`) decide.
8. **Every version.** Each part is checked in every version that carries it (as last revised, as first drawn, 1943, the 6MX and Wempe 3955), with `setRev` as the page sets it. A photograph that differs from a sheet shows that clock's version, not a fault.

## The permanent fit check (batch 0)

Session marine-chronometer-c9 built this on its own branch, `claude/wempe-seat-audit`, at the same time as this plan (27 October 2026), and this pass adopts it instead of building another. `tools/seatcheck.py` (with `seatcheck.js`, `--model wempe`, and `ci.py`'s `wempe-seatcheck` step) follows every pin, screw, pipe, bush and hook along its own axis. It fails unless some other part is round it (a hole, not a slot and not nothing), or unless `SEAT_EXPECTED` in `wempe/checks.py` gives the reason it is held another way. It passes all five versions (503 pieces). Its expected entries are the stud, the movement ring's screws, and the 6MX contact's lock nut and stud. It found the collet's pin loose (now half round and brass, like the stud's) and the 6MX cap plate's screws in plain holes (now tapped).

Once it is on `main`, this pass:

- seeds the Joints table from `seatcheck.py -v` (every piece and what holds it);
- re-checks each `SEAT_EXPECTED` entry against its sheet as part of the fit list.

`seatcheck.py` can't see a hole the sheet draws that the model never built. Step 6 and the extra checks below cover that.

## Extra checks across the transcriptions (handed over by marine-chronometer-c9)

Every batch also does these for its sheets:

- **Slots, notches and grooves.** Every slot, notch or groove in a transcription or code comment is re-read against every view of the sheet. The stud's slot came from a lone "1,2 −0,1".
- **Drawn holes.** Every hole a sheet or transcription draws must be in the model. The stud's Ø 0.7 was never built, so `holecheck.py` couldn't see it missing.
- **Excuses.** Every `dev` entry in `bom.json` and every expected entry for the batch's parts is re-checked against the sheet: `fine.py`'s and checks.py's `EXPECTED`, `HOLE_EXPECTED`, `SEAT_EXPECTED`, `audit.py`'s `LOOSE`. Each excuse must still hold.
- **bom.py's tolerances.** `bom.py`'s `in` relations pass a press fit with a 0.05 mm gap and a tapped hole with 0.35 mm, and that is how the collet's pin passed. marine-chronometer-c9 is asking the owner whether to tighten them. The fit list judges each fit against the sheet's own tolerance whatever `bom.py` allows.

## Batches (two agents at a time: a reader and a refuter)

Small parts and joints first, plates and the case last (the owner, 27 October 2026). Which sheet belongs to which batch is in the ledger.

| # | Parts | Sheets |
|---|---|---|
| 0 | the permanent fit check (`seatcheck.py`, marine-chronometer-c9's `claude/wempe-seat-audit`), and the Joints table's first rows | — |
| 1 | balance (rim, arm, masses, timing screws, staff, hub), hairspring, stud and its pin, collet, rollers, balance jewels | 13 |
| 2 | escape wheel (arbor, collet), detent and its springs, detent block in each version, escape jewels and endstones | 9 |
| 3 | maintaining work (ratchet, clicks, springs, spring), maintaining detent and its wire spring, stop work | 9 |
| 4 | barrel (drum, lid, hook block), barrel arbor, set-up ratchet, mainspring, chain and its hooks | 14 |
| 5 | fusee (body, arbor, click wheel), fusee wheel, cover plate, vorreiber, dust plate | 12 |
| 6 | going train (wheels, arbors, pinions, bushes, settings) | 10 |
| 7 | motion work, up-and-down work, hands, dial | 13 |
| 8 | bridges, bushes, cocks, set-up click, intermediate bridge | 9 |
| 9 | top plate, pillar plate, pillars, movement ring | 8 |
| 10 | case, gimbals, boxes, keys, handles, maker's plate | 14 |
| 11 | whole-movement arrangements (001, the coloured section), and the sheets the first pass left out (the lever chronometer's, 05-33, 05-36, 05-38): each confirmed as not this model's or read for what it fixes | 13 |

## How the work runs

- The audits are read-only, in a worktree of their own made from `main` at the start of each batch. Corrections are made in another worktree (`claude/wempe-drawing-fixes-2`) and never in the one being measured.
- At most two agents run at a time.
- After each batch, its corrections are made together. Each is built from the sheet's own figures and isolated against the sheet. A correction that moves a part others are fitted to (a hole, a height) is checked against those parts first.
- A correction that changes the physics (the balance, escapement, fusee or train) is re-measured on its sheet first. Once confirmed, it is made and every Wempe physics tool and golden file is rerun.
- A reading a sheet doesn't settle goes to the Wempe README's Estimated section, not into the model.
- The geometry checks run once per batch: `solids.py`, `fine.py`, `holecheck.py`, `audit.py`, `exploded.py`, `assembly.py` and `bom.py`, all with `--model wempe`.
- There is one release at the end, after every batch is corrected and checked. The build book (`drawbook.py`, then `book.py --model wempe`) is redrawn then too.
- Every fixed bug gets a `RESOLVED.md` entry in the same commit.

## Done when

- Every one of the 124 sheets has its inventory, views, overlay and refutation marked done in the ledger.
- Every joint in the Joints table holds, or is recorded as kept with its reason.
- Every finding is corrected or kept with its reason.
- `bom.py --model wempe` passes with the fit check.
- The release is live.
