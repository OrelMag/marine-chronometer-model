# The Wempe parts audit: the agents' brief

This audit compares every part of the Wempe model with Wempe's works drawings, sheet by sheet. It started on 3 November 2026 and is done afresh: nothing from the two earlier drawing checks is used until every verdict here is written. Each batch has two agents:

- a **reader**, who reads the sheets blind and compares them with the measured parts;
- a **verifier**, who tries to refute the reader's verdicts.

The ledger is `WEMPE-PARTS-LEDGER.md` at the repository root. The sheets for each batch are listed by `python marine-chronometer-source/chronometer-working-model/tools/wempe_parts_ledger.py --batch N`.

Paths below are relative to the worktree root, `E:/Marine-Chronometer/.claude/worktrees/wempe-parts-audit`. `TOOLS` is `marine-chronometer-source/chronometer-working-model/tools`.

## Do not read (blind)

Until your verdicts are written, read none of these. All of them hold an earlier reading of the sheets:

- `WEMPE-DRAWING-LEDGER*.md`, `WEMPE-PROVENANCE.md`, `WEMPE-VARIANT-*.md`, `PLAN-wempe-*.md`, `PLAN-recipes.md`;
- `marine-chronometer-source/wempe/drawing-check/`;
- `References/wempe/transcriptions/`, `References/wempe/drawings/*.md`, `References/wempe/README.md`, `References/wempe/CAD*.md`;
- `marine-chronometer-source/wempe/README.md`, `marine-chronometer-source/wempe/bom.json`, `marine-chronometer-source/wempe/BOM.md`;
- the model's code: `marine-chronometer-source/wempe/js/` and `TOOLS/recipes/`.

**Do not run git commands either.** Commit messages quote earlier readings.

You may read:

- the sheet images;
- the measurement files below;
- this brief.

## Inputs

- **The sheet.** `References/wempe/drawings/GROUP/NAME.jpg` is a scan about 1024 px across. These are © Johannes Altmeppen and not licensed:
  - never copy a sheet or a crop of one into the repository;
  - put crops in `E:/mc-video/wpa-audit/crops/` (outside the repository) and nowhere else.

  To read small figures, crop a region and enlarge it 3-4× with Lanczos (Python PIL), then read the crop. A figure you can't make out is "illegible", never a guess. Give each reading's certainty: **sure**, **likely** or **unsure**.

- **The parts as built, from exact solids:** `TOOLS/r_wpa/measure/KEY.json` and `KEY.png`, written by `wempe_measure.py`, in mm. The frame is the part's own: Z is its thickness or turning axis, and the plan is seen from +Z.
  - **Fields:**
    - `box` and `size`;
    - `z_levels`: the levels of its faces square to Z;
    - `cylinders`: each with `d`, `kind` (inside is a hole or bore, outside is a boss, pin or turned diameter), `at` (the centre in the plan), `from_origin`, `z` (its span) and `arc_deg` (360 is a full hole; less is an arc of an outline);
    - `cones`: countersinks and chamfers, as diameters, span and half angle;
    - `outlines_by_level`: the arcs (centre, radius) and lines on each level's face;
    - `section_y0`: the section through the axis as (r, z) corners;
    - `teeth`: count, tips, roots and depth at each level.
  - **Orientation.** The part's frame need not be the sheet's. A sheet may draw the part from its other face, mirrored, or turned. Establish the correspondence first, from the datums: the centre, two holes or a straight edge. Say which face you take as which. **A part built mirrored is a finding**: check the hand of every asymmetric feature (teeth, ratchets, slots, cranked arms, hole patterns).

- **Parts with no exact solid** (strips, the chain, the band, bought and box parts): `TOOLS/r_wpa/page/HN.json` and `HN.png`, written by `wempe_pagemeasure.py`. These are the page's own meshes in the part's root frame on the page, with Y as its axis.
  - **Fields:**
    - `box`, `size`, `volume_mm3`;
    - `y_levels`;
    - `sections_square_to_Y`: loops at each level; a loop that is a circle is given as centre and diameter;
    - `rays_from_axis_at_mid_height`: the surfaces each of eight rays crosses, with the strip's thickness and the coils' pitch read off them.
  - The page draws turned faces as polygons, 72 a turn, so a diameter can read up to 0.1 % small.

- **Assembly and layout sheets:** `TOOLS/r_wpa/page/placements.json`. Every part-list line shown is listed by `hn`, frozen in one pose, with:
  - its origin and its local axes in the movement frame (dial side +y, 12 o'clock −z, 3 o'clock +x; the case parts in the box's frame);
  - its world box (`[xmin, ymin, zmin, xmax, ymax, zmax]`).

  The parts named for an assembly sheet also have their `measure/` files. `KEY.json`'s `hn` field gives each part's line, which you can look up in `placements.json`.
  - From these, read the sheet's stack: heights, end shakes, gaps, centre distances, and which part sits on which.
  - Name the `hn` behind each number you use.

## What "match" means

- **Printed tolerance.** Where the sheet prints a tolerance on a size (for example `+0,02`, `−0,1`, `h7` or `±0,05`), the size matches if the measurement is inside it. For a fit symbol, give the ISO limits you used.
- **General tolerance.** Where no tolerance is printed on a size, use the sheet's general tolerance as you read it from its title block or notes (Freimaßtoleranz, or a DIN 7168 class). Quote what you read.
- **Fallback.** Where none is legible, use:
  - ±0.05 mm up to 6 mm;
  - ±0.1 mm over 6 to 30 mm;
  - ±0.15 mm over 30 to 120 mm;
  - ±0.2 mm above that;
  - ±30′ for an angle.
- **Scaled sizes.** A size the sheet doesn't print but draws to scale may be scaled off it. Say so, and say how accurately the scan allows (at about 1024 px, rarely better than ±0.1 mm at 10:1 or ±0.5 mm at 2:1). It matches within that accuracy.

## Reader: the four steps

1. **Read the sheet blind.** Write an inventory before you look at any measurement:
   - the title block: name, number, scale, material (Werkstoff), treatment, surface, general tolerance, date, revisions, and which chronometer it is for;
   - every view and section, and what it shows;
   - every dimension: its figure, its tolerance, and **what its extension lines attach to**. Flag a dimension whose lines attach to nothing clear;
   - every hole: number (the plates number their holes), diameter, depth, thread, countersink, and position by its coordinates or dimensions;
   - every note;
   - every tooth count, module or tooth form.
2. **Check the views against each other.** Does the plan agree with the section? Does each dimension appear once? A hole in one view with no trace in the other is a finding about the sheet itself.
3. **Compare.** Compare each item with the measured part. The verdict is one of:
   - **match**;
   - **mismatch**: give drawn, measured and the difference;
   - **not built**: the sheet has it and the part doesn't;
   - **extra**: the part has it and the sheet doesn't, which you list after the items;
   - **can't tell**: say why.

   Quote the measurement's field, for example `cylinders[3].d 1.2004`, so the verifier can find it.
4. **Only after your verdicts are written** may you read the code that builds the part, to explain a mismatch: the part's recipe in `TOOLS/recipes/wempe*.py`, found by its key. Write what it says in a separate section headed "After the verdicts". **Never change a verdict there.** If the code shows that you misread the sheet, say so in that section and leave the verdict for the verifier.

## Reader: what you write

Write `marine-chronometer-source/wempe/parts-audit/batchNN.md` (NN is the batch number, two digits). For each sheet:

- a heading with the sheet number and title;
- the title block as read;
- the views, and any finding from step 2;
- the item table: `| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |`, with items numbered `NN-S-i` (NN the batch, S the sheet's place in the batch, i the item);
- the extras;
- "After the verdicts".

End the file with a summary:

- every mismatch and not built, each in one line;
- what you could not read.

Also write `batchNN.items.tsv`, one row per item, tab-separated with a header: `id`, `sheet`, `item`, `drawn`, `certainty`, `field`, `built`, `delta`, `verdict`. This is all the verifier sees of your work.

**Do not edit anything else.** Don't change the model. This audit is a ledger only (the owner's choice).

## Verifier

You get the sheets, the measurement files and `batchNN.items.tsv`, never `batchNN.md`. Read the same "Do not read" list, and don't read `batchNN.md` either.

For each item:

1. Find the size on the sheet yourself and read it again (crop and enlarge).
2. Find the built value in the field named, and check it is the right feature: the same hole, face or end, in the right orientation and hand.
3. Give your own verdict: match, mismatch, not built, extra or can't tell.

Try hardest to refute:

- every **mismatch** and **not built**;
- every **match** on a hole, a pin's fit, a joint, a spring, a tooth count or tooth form, an angle that sets timing, and the escapement's and balance's sizes.

Re-read every item in those classes on an enlarged crop. You may not mark one "accepted" unread. Check simple outline matches by sampling at least one in five (re-read enlarged), and mark the others "accepted, not re-read". Then look at each sheet for any size the reader missed, and add those items as `NN-S-vK`.

Write `verifyNN.md`. It has one table per sheet: `| id | reader's verdict | your reading of the sheet (certainty) | the built value you found | your verdict | agree? | why |`, then the items the reader missed, then a summary of the disagreements.

**Do not edit anything else.**
