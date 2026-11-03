# Wempe parts against their drawings: audit ledger

This ledger compares every part of the Wempe model with Wempe's works drawings, sheet by sheet. It is for anyone deciding what to correct in the model, or checking what a part rests on.

- **Started:** 3 November 2026.
- **Model audited:** `main` at c63141ba (version 3.79.02), the model as last revised.
- **Done afresh:** the agents worked blind to the two earlier drawing checks (`WEMPE-DRAWING-LEDGER.md`, 26-27 October; `WEMPE-DRAWING-LEDGER-2.md`, 27-28 October). The new pass was compared with those only after every verdict was written; see "Against the earlier passes".
- **Nothing in the model was changed** (the owner's choice: an audit and a ledger only). The owner decides each correction.

The sheets are © Johannes Altmeppen and not licensed. No scan or crop of one is in this ledger or its reports, only their figures and words.

## How it was done

The method is the one used for the Hamilton's drawn parts (`HAMILTON-PARTS-LEDGER.md`), with each batch's results checked by a second agent.

1. **Each part measured, not read from the code.**
   - `tools/wempe_measure.py` measures the exact solid each recipe builds (`tools/recipes/wempe*.py`), 187 parts in mm:
     - the faces' levels;
     - every cylinder (holes, bores, pins, turned diameters) and cone;
     - the outline's arcs and lines;
     - the section through the axis;
     - the teeth at every level.
   - `tools/wempe_pagemeasure.py` measures the parts no recipe builds from the page's own meshes (the hairspring and mainspring, the chain, the band, the jewels, bought and box parts): sections, coil and turn counts by rays. It also records where every part-list line stands in the movement, for the assembly sheets.
   - Outputs are in `tools/r_wpa/` (ignored).
2. **The recipes stand for the page.** `recipes.py --model wempe --check` compares each of the 187 recipes' solids with the page's own mesh of its line (volume, box, both surfaces sampled to each other, every round hole measured on the page). All 187 passed; the run is below.
3. **Every sheet covered.** `tools/wempe_parts_ledger.py` holds a row for each of the 125 images in `References/wempe/drawings/`:
   - 111 sheets were audited in 17 batches;
   - 14 were listed but not audited (below);
   - its `--check` fails if an image has no row or a report leaves a sheet out.
4. **Read blind, then compared.** For each batch, a reader agent did the following (the brief is `marine-chronometer-source/wempe/parts-audit/BRIEF.md`):
   - read the sheets without the model's code, the transcriptions, the README or the earlier ledgers, inventorying every view, dimension (and what its extension lines attach to), hole, note and title block;
   - checked the views against each other;
   - then compared each item with the measured part: match, mismatch, not built, extra or can't tell.
   - **"Match" means** inside the printed tolerance. Where none is printed, it means inside the sheet's own general tolerance. Failing both, ±0.05 mm to 6, ±0.1 to 30, ±0.15 to 120 and ±0.2 above. A scaled size counts within what the scan resolves.
   - **Hand is judged as assembled:** the part's frame is mapped into the movement, and the sheet's view side is fixed first.
   - The reader's report is `batchNN.md`, its items `batchNN.items.tsv`.
5. **Checked by a second agent.** A verifier saw only the sheets, the measurements and the reader's item list (not its reasoning), and tried to refute:
   - every mismatch, not built and can't tell;
   - every match on a hole, fit, joint, spring, tooth or timing size;
   - one in five of the plain outline matches.

   It also added the items the reader missed (`verifyNN.md`). The **final verdict** below is the verifier's where it gave one, else the reader's. Both are kept in the batch tables.
6. **The largest claims checked by eye** (below).
7. **Compared with the earlier passes** last (`earlier-passes.md`).

The tables after the marker below are written by `python tools/wempe_parts_ledger.py --build` from the reports. Don't edit them by hand.

## Totals

There are 1,670 items over the 111 audited sheets. By final verdict, as the agents left it (before the one verdict I changed, 06-1-15, below):

| Verdict | Items |
|---|---|
| match | 1,224 |
| mismatch | 150 |
| not built | 22 |
| extra | 12 |
| can't tell | 216 |
| not applicable | 24 |
| notes | 22 |

"Not applicable" covers a casting's blank sizes, another maker's dial and parts not in this version. "Notes" are title blocks, tolerances and revision marks.

**Can't tell.** About one item in eight is "can't tell". The scans are about 1,024 px across, so many small figures are illegible, and the assembly sheets print few sizes.

**Hand.** No part was found built mirrored once hand was judged as assembled. Two claims of a mirrored part were refuted: the escape wheel and the maintaining detent (batch 5). Hand was confirmed for the detent, the ratchets, the set-up ratchet, the maintaining spring, the plates, the ring and the dial.

The click wheel's hand can't be fixed from its sheets alone, which draw it from opposite faces. On the model it is right in function: `maintaining.py --model wempe` checks on the built solids that both clicks sit on its teeth and catch it.

## The main findings

Items are by final verdict, with the batch item ids in brackets. "Sheet against sheet" means two sheets disagree and the model follows one of them; that is for the owner to settle, not an error.

**The escapement (timing):**
- **The escape wheel's place against the detent** (06-1-7, 06-1-12, 06-1-13; checked by eye).
  - The layout 05 04_1 (3.2.40) draws the wheel's centre under the locking stone, the line to it square to the detent, and prints 23.8 from the wheel to the block's M1.7 hole.
  - The model has the balance-to-wheel distance exactly (10.00). But the wheel stands 0.447 mm along the detent from the stone, the detent turned 3.6-4° about its pipe (the verifier's measure), and 23.41 to the hole. My own estimate from the detent's box, rougher since the blade has width, gives about 5° and agrees in direction.
  - No later sheet places the wheel.
- **The gold spring's bending point matches** (06-1-15, overridden; see "Verdicts I changed").
- **The detent's tail tip** is 0.054 wide, against 0.22-0.25 on 05 04_10.1 (06-5-4).
- **The block's** M1.2 cross hole is 0.15 off centre (06-3-13).
- **Superseded, not mismatches:** the layout's stud circle, chamfer and arm thickness are replaced by the later block sheet 05 04_3, which the model follows.

**The balance and hairspring (timing):**
- **The hairspring's pitch** is 0.80, against 0.73 drawn (0.52 strip + 0.21 gap, 15 turns over 11.5 on 05 03_6; checked by eye). The built helix is therefore 9.97 tall against 9.5, and the strip stands 0.25 past the drawn ends at the stud and the collet (08-1-2 to 08-1-4, 08-2-5, 08-1-v1).
- **The hairspring collet's bore** is 0.05 large all along, its taper right.
- **The stud's spring hole** is 1.35 from the leg's end, against about 0.69 drawn. The sheet says it is drilled at assembly.
- **The stud's nose** is sharp; the sheet draws a 0.8 round.
- **The terminal curve can't be compared:** the sheet's angle origin can't be fixed. Its end radius agrees.
- **The staff** follows the 1946 sheet's diameters and the 1965 sheet's length (batch 7).
  - Against the latest sheet (05 03_3.2, 12.3.65) it differs on the pivot (1.2 against 1.25 −0.02), the collars (2.0 against 2.10, 1.5 against 1.6) and the lower shaft.
  - The 1.65 s6 seat is built 0.013 under its limit.
  - Two sheets draw the flange's 10° taper, which is not built.
- **The rim** is one solid. Its nickel-steel and brass layers (Ø 31.29) and the eight "Körner" marks are not drawn.
- **One hub hole** is counterbored Ø 1.8 × 0.4 on 05 03_4, against a countersink at both holes in the model.

**The jewel settings:** the balance's jewel stacks are printed 1.4 + 1.4 on the cock assemblies, built 1.63 + 1.17 (upper) and 1.53 + 1.19 (lower). The lower is printed 0.1 proud, built flush (03-3-18, 03-8-6, 03-8-8).

**The going train:**
- **Pivots (sheet against sheet).** The seconds and intermediate pinions' part sheets (rev. 6.6.46) print pivots of 9.2/4.5 and 4.6/4.6. Their assemblies print 7.2/3 and 3/3. The model follows the assemblies, and only those fit between the plates (batch 4).
- **The centre arbor (sheet against sheet).** The model follows its later assembly 05 05_8 against the part sheet 05 05_10 (batch 5).
- **The escape arbor** follows the later assembly 05 04_7.2 against 05 04_8 (batch 5).
- **The n6 seats** are built at nominal, 6-16 µm under their limits. The tips are domes where the part sheets draw points.

**The fusee and its parts:**
- **The fusee arbor** is 58.125 long against 60.6 on 05 06_15. Its left pivot is 3.6 long against about 6.1, and its tip is flat against a point. The winding square is about 0.07 under at the shoulder, and its taper is 1:110 against 1:100 (09-6-1, 09-6-3, 09-6-10; confirmed again on the section in batch 17).
- **The groove** matches the 1948 body and the curve sheet 05 06_20 in floor radii, pitch, width and depth.
- **The body's 12.6** on 05 06_2.2 is a stale figure: its own revised sizes and the later 05 06_3.2 give 12.3. The chamfer is 29.4 against 29.8 +0.2.
- **The fusee wheel's hub bore** is 4.55 against 4.0 +0.1. The arbor there is 4.38-4.50, so 4.0 can't fit it.
- **The Vorreiber's** flange is 0.86 against 1.2 −0.2 and its length 2.76 against 3.1 −0.2.
- **The cross pin's** hole in the Vorreiber, the arbor's hole and the pin agree at 1.15-1.16, against the sheet's 0.8 (batch 10).
- **The click spring's arm** drifts up to 0.4 mm off its drawn constant R10.4 (11-3-v1).

**The barrel:**
- **The barrel arbor's necks and ball pivot** are 4.48, 3.88 and 2.88, against 5, 4 and 3 drawn on 05 07_9 and repeated on the later 05 07_8. Its chamfer is 45° × 1.65 against about 22.5° × 0.8.
- **The arbor's hook** stands out 0.25 against 0.5 −0.05, its hole at 45° to the square against 15°.
- **Sheet against sheet:** the body length (12 against 11.58) and the spring space (15.8 against 15.63) are 1941-43 sizes. The 1948 drum and lid give the built ones (batch 12).

**The motion work and hands:**
- **The hour wheel's pipe collar** is 3.585 high against 5.2 −0.1 on 05 02_8. As drawn it would reach into the dial, so the model's height is a fit to the dial: a conflict for the owner (14-3-2).
- **The hour hand's bore** is 3.5 µm over H7.
- **The hand stack's gaps** differ by 0.2-0.3 from the hand-annotated assembly (13-1-10, 13-1-11).

**The frame:**
- **Holes and bores:**
  - pillar plate hole 10 is 2.82 against 2.70 ±0.009;
  - hole 30's land is on the wrong face;
  - hole 30 is named "Ankerrad", a lever escapement's wheel, so its jewelled bore may be a leftover of the lever chronometer's plate;
  - the top plate's hole 4 has a countersink not drawn;
  - pillar plate holes 56 and 57 ("nur bei Bedarf") are not built;
  - the barrel bridge's end screw holes are 2.8 against about 3.5.
- **The dust bush:** its flange is 2.1 against 3.1 −0.2, and its neck is waisted where 05 08_9 draws it straight. The waist follows a later assembly sheet.
- **The pillar:** its lead is 6° against 5°; its countersink is 0.01 deep against about 0.35; the relief groove in its shoulder is not built.
- **Holes on no sheet:** three Ø 0.73 holes in the ring, and a Ø 1.075 hole in the upper cock.

**The case:** the bowl's and bezel's sheets (R-…) draw castings, so their blank sizes don't bind the finished parts. The finished bezel on the assembly matches.

**The keys and box:** the 1943 key matches its latest revisions (the socket 19 deep by rev. a, 1947), and its square fits the fusee's. The box's height is 180 on 51 00_1 and 185 on 51 00_2 (sheet against sheet). The cross pin is drawn grooved (Kerbstift), built plain. The DIN 97 wood screws are drawn countersunk, built with cylinder heads.

## What became of each finding (3 November 2026)

The owner asked for every finding to be corrected once shown real and needed, and documented. Each was re-read on the sheet, re-measured on the solid and checked against the parts it meets: `PLAN-wempe-parts-fixes.md` has every case with its reasons.

**Corrected** (branch `claude/wempe-parts-fixes`):
- the detent's horn, its full 0,22 to its tip (06-5-4);
- the detent block's banking-screw hole, centred on the upright, with its estimated head Ø 3.15 to keep clear of the detent (06-3-13);
- the pillar's lead at 5° (02-6-7);
- the set-up ratchet's tip on its square's flat and the arbor's square 15° from its hook (12-2-8, 12-7-5), with the set-up snapped to whole teeth: 0.7125 turn;
- the strap screws, countersunk DIN 97 (16-9-17).

**Not differences.** On a closer look the audit had measured or read something else:
- **The hairspring's ends and pitch:** its figures run to the centrelines (above).
- **The gold spring's bend:** 6.15 from the stone, the sheet's dashed mark.
- **The cannon's 14.3:** the crown's apex, on the arbor's end.
- **The drum's slot reach:** the audit read the flat end's corner.
- **The maintaining detent's hollow:** the same point, turned with the part's frame.
- **The fusee arbor's square taper:** read short of its point.
- **The click spring's arm:** sprung onto its click.
- **The fusee's chamfer:** `wempe_fusee_check.py` measures it exactly.
- **The pillar's groove:** built, and missed by the measurement.
- **The barrel bridge's end holes:** Ø 2.8 on the bridge's own sheet; the 3.5 was scaled on the assembly.
- **The lower cock's 19.75 and 3.3:** read on the 1941 assembly.
- **The stud's screw:** 05 08_6's 5 runs to the slot's far edge.
- **The hook's stand-out:** 0.475 radially; the 0.25 was measured along the pin.
- **The pinions' pointed tips:** the blanks' lathe centres.
- **The ring's and the upper cock's undrawn holes:** the dial's screws' M1 holes and the stud screw's M1.4 hole.

**Kept as they are:**
- **By the owner's choice:** the four clashes (A1, B1, C2, E1 in `parts-audit/FINDINGS-EXPLAINED.md`; the Wempe README, "Kept, the parts audit's four clashes").
- **Settled earlier with reasons:**
  - hole 30's land (its sheet's plan and assembly against its section);
  - the staff's s6 seat (a conflict inside 05 04_4);
  - hole 26's step (unsure: 4,5 or 4,59).
- **Unsure readings:**
  - the round hook's 2,8;
  - the rim's counterbore;
  - the cannon's "Körner";
  - the edge breaks without figures.
- **The staff's 1965 sheet:** found to be the post-war Glashütte production's, not a revision of this chronometer.
- **Below what the tools build:** the collet's 1:90 cross-hole taper.
- **Bought and drawn plain:** the key's grooved pin.

The tables below keep the agents' verdicts as written. This section and `PLAN-wempe-parts-fixes.md` say what each one came to.

## The owner's rule for sheets that disagree

Where two sheets give different sizes for the same feature, **the later-dated sheet decides**: a sheet's revision date counts as its date (the owner, 3 November 2026). Where the later sheet's size cannot be built as drawn (it clashes with a part it meets), that case goes to the owner. Two further rules apply (the owner, 3 November 2026):

- **A later sheet clashes with an unrevised part.** If the later sheet's size, as drawn, clashes with a mating part whose sheet is older or absent, and no later assembly sheet or photograph settles the pair, each case goes to the owner. The model keeps its present fit meanwhile. Examples: the hour pipe's collar against the dial; the 1946 pinion pivots against the plates.
- **Sheets dated after Wempe's war-time production** (05 03_3.2, the staff of 1965) count as later only once a check shows they revise this chronometer, not another version (the 6MX, a later calibre).

`marine-chronometer-source/wempe/parts-audit/FINDINGS-EXPLAINED.md` explains every difference and applies these rules finding by finding.

## Verdicts I changed after checking

The tables below the marker keep the agents' verdicts as they wrote them. These checks of mine override them:

- **06-1-15, the gold spring's bending point: match**, where the reader and verifier had mismatch.
  - **On the sheet.** On the layout 05 04_1 (10:1, 24.6 px/mm), the bending point is marked by a dashed line (labelled "0,04") about 6.2 mm from the locking stone's pipe, above the words "Biegungspunkt der Goldfeder". The curved arrow nearby is the escape wheel's turning arrow, not this mark.
  - **On the model.** The gold spring's solid shares the detent's frame, whose origin is the pipe: Ø 1.15 outside, with the stone's hole Ø 0.754, both at (0, 0) in `detent.json`. Its bend is at x 6.15, so 6.15 mm from the stone.
  - **Why the batch called it a mismatch.** Its "4.43 from the end" is the straight piece from the bend to the fixed foot (6.15 to 10.58), a different datum.
- **06-1-7, 06-1-12, 06-1-13, the escape wheel against the detent: mismatch, confirmed** by my own estimate, above.
- **The hairspring's pitch, 08-2-5: not a difference** (corrected 3 November 2026; I had first called it confirmed). 05 03_6 does print 0.52 + 0.21, a pitch of 0.73. But 05 03_5's 3,15, 9,5 and 0,75 run to the strip's centrelines: the collet's own sheet 05 03_8 (later) puts its pin hole 0.75 from the face, and the spring's end runs in it. The model, with the 11.8 turns the owner chose (the plan draws the two pinning points together), has the ends there and the pitch 9.5/11.8 = 0.80.

## Sheets read as something else than first mapped

- **05 08_33 (Unruhkloben unten kompl., 1941)** draws an earlier lower cock: an arm of another shape, holes not built. The model follows the 1946 revision 05 08_4, which matches.
- **05 07_10 (Federhausring, 1941)** is the ring of the earlier barrel. No built part corresponds.
- **05 02_13** is an A. Lange & Söhne iron dial (1453/A, 1944), not Wempe's. It is not applicable to the built dial.
- **The coloured section "Federchronometer 05"** is a wall drawing, not a works sheet. Where a printed detail sheet gives a size, that decides (batch 17's verifier). Its labels name some parts under other numbers than the model's, for example the mainspring as 05 07 00-2 and the drum's hook as 05 07 06-3. WN-16 and WN-27 could not be matched to built lines.

## The recipe check (what stands behind the measurements)

`recipes.py --model wempe --check` was run on 3 November 2026 (two runs, 71 and 116 recipes; results in `tools/r_wpa/recipes_check*.txt`). It found every one of the 187 solids within its tolerances of the page's mesh.

Its "expected" departures are the page's way of drawing a detail, never a different shape:
- tapped holes the page draws plain at the thread's size, where the recipe draws the tap drill (the drum's and hook block's M2.6, the rim's timing-screw holes, the masses' M0.8, the detent block's banking-screw hole);
- polygon bores across thin strips (the detent, the gold spring, the lock bracket);
- facets of the fusee's sweep, up to 0.39 mm at its flange seam and slot floor;
- the slot floors of WN-19 and WN-21;
- the key's cones built in steps;
- the hook's 24-gon pin;
- the upper cock's slot end wall, 0.13.

So a size measured on a recipe's solid is the page's size, except at those named places.

## Against the earlier passes

This comparison was made after every verdict was written, by an agent reading the earlier ledgers, `drawing-check/`, pass 2's ledger on `claude/wempe-drawing-check-2` and the README's open lists. It read no sheet. The full table, row by row, is `marine-chronometer-source/wempe/parts-audit/earlier-passes.md`.

**How the counts differ.** The comparison groups 207 findings, which is more than the totals above (150 + 22 + 12). It counted from the batch tables, where some items appear under both the reader's and the verifier's ids. Its grouping of the "found by neither pass" items also rests on a keyword search of the earlier ledgers, so a few may have been found after all.

**What the earlier passes did with the new findings:**
- 16 were corrected by an earlier pass; the new pass still finds 1 of these clearly off (12-7-4, the arbor's hook stands out 0.25 against 0.5) and 3 partly off;
- 92 were kept or recorded as departures, each with its reason: blank against finished sizes, 1941 parts against the 1948 build, the R- casting sheets, fits built at the middle of their range, the coloured section's heights;
- 23 were recorded as open;
- 24 were read differently;
- about 52 were found by neither pass.

**New findings that matter, found by neither pass:**
- the detent's tail tip, 0.054 wide against 0.25 (06-5-4);
- the escape wheel 0.45 off the pipe's line and turned about 4° from the layout (06-1-12, 06-1-13);
- the hairspring's pitch, 0.80 against 0.73 (08-2-5);
- the set-up ratchet's square turned 10-13° against its tooth tip (12-2-8);
- the dust bush's flange thickness (02-5-4).

**Corrections that may not have taken:**
- the round hook's arc, its "along" figure still 1.1 off (11-6-9);
- the barrel arbor's hook (12-7-4);
- the hand stack's gaps (13-1-10, 13-1-11);
- possibly the maintaining detent's hollow, matched by pass 1 and now 0.14 and 0.24 off after pass 2 reshaped the detent (05-5-6, 05-5-7).

**Where an earlier pass reads better.** The new pass is weaker on these:
- the escape wheel's bore (05-6-7): pass 2 chose 1.8 where this pass found two figures;
- the chain slot (12-1-17).
- pass 2's joint findings ("nothing holds it", S-1 to S-7): the new pass has no joint test, so it can neither confirm nor refute them;
- the steel and brass boundary in the rim (07-6-2): the comparison thinks the new pass is wrong.

**Where pass 1 matched and the new pass differs:**
- the pillar's relief groove (02-6-12);
- the staff's flange taper (07-2-8, 07-3-19);
- the pillar plate's rim notch (01-4-18).

**The gold spring's bending point** (06-1-15): the earlier passes were right. Pass 2 and the owner's adoption (28 October) put it 6.15-6.22 from the stone, which is what the sheet marks and the model has (see "Verdicts I changed").

**Version scope.** This pass measured the version as last revised, so first-drawn parts appear as mismatches where the earlier passes built them as separate versions: the 1941 barrel ring, the 1941 arbor sheet and the 1940 layout's figures.

## Sheets not audited, and why

These are listed at the end of the generated part:
- earlier revisions of sheets audited here;
- another calibre's staff;
- the lever chronometer's sheets (002, 05 04_20, 05 04_21);
- the hand setting (05 33), balance holding device (05 36) and seconds contact (05 38), which are not in the model;
- the second print of the coloured section, read with batch 17.

<!-- generated by wempe_parts_ledger.py --build: do not edit below -->

## Results by part

Every parts-list line the recipes cover (made and bought), whether it is shown in the version as last revised by default or only in a variant (the outer box, the 1940 key, the band, the 6MX's parts), with the sheets it was compared against, the count of its items by final verdict (the verifier's where it gave one, else the reader's), and every item whose final verdict is mismatch, not built or extra. An item counts for a part when its text names the part's key or line (on a detail sheet, the items naming no part are its subject's, the first part it lists); items about an assembly as a whole are in the batch tables below. A part with no sheet says so.

| Part | Line | Shown | Sheets compared | match | mismatch | not built | extra | can't tell | Findings (id: item (drawn / built)) or why not compared |
|---|---|---|---|---|---|---|---|---|---|
| adjSlide6 | 6MX.gks | variant | none | | | | | | no drawing of its own in the set: Adjusting slide (6MX), the detent block's |
| armScrew | WN-10 | yes | 05 04_4, 05 03_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| badge6 | Firmenschild6 | variant | none | | | | | | bought: no drawing in the set: Factory badge, 1 МЧЗ им. Кирова (6MX) |
| band | 050703-1 | variant | none | | | | | | bought: no drawing in the set: Band (Schneckenband) |
| bandHookDrum | 050703-3 | variant | 05 07_11, 05 07_13 | 12 | 0 | 0 | 0 | 2 |  |
| bandHookRound | 050703-2 | variant | 05 07_11, 05 07_12 | 10 | 2 | 0 | 0 | 4 | 11-6-8: Notch flank 30 deg to the tongue edge (30 / 31.7 deg); 11-6-9: Body arc R6, centre 3.55 across and 2.8 along (printed) (R6, (3.55, 2.8); sure (figures) / R5.93, (3.47, 1.70)) |
| bankScrew43 | WN-gkA43 | yes | none | | | | | | no drawing of its own in the set: Banking screw M1.2 along the 1943 block's slit upright, its domed slotted head ( |
| bankScrew6 | WN-gkA | variant | none | | | | | | no drawing of its own in the set: Banking screw M1.2 across the 6MX block's upright (its WN number not read) |
| barrelArbor | 050702-1 | yes | 05 07_1, 05 07_8, 05 07_9, Federchronometer 05 | 19 | 17 | 0 | 0 | 3 | 12-1-11: arbor body (with chamfers) length "12" (12 / 11.58); 12-1-18: hook on the arbor (05 07 02-2) at 15 deg to the square's flat normal (end view) (15 deg / hole axis along the square diagonal = 45); 12-7-5: hook at 15 deg to the square flat normal (15 deg / 45 deg); 12-7-7: hook pin / hole dia, depth (2 dia, 6 deep (sheet 09) / 2.0, hole through); 12-8-3: body length incl. chamfers (12 / 11.58); 12-8-4: chamfer end dia (9 / 10.0); 12-8-5: chamfer angle and length ("22 1/2 deg", "0,8") (22.5 deg to the end face, 0.8-0.9 axial / 45 deg, 1.65); 12-8-6: cross hole 2 dia x 6 deep, centred (2 x 6 blind, centred / through, centred); 12-8-7: neck dia (ball side), 1:70 polished (5 (tolerance illegible) / 4.48); 12-8-8: neck length (ball side) (6.7 (+-0.05) / 6.77); 12-8-9: ball pivot dia (3 (tolerance illegible) / 2.88); 12-8-11: square-end neck dia and length "3,5" (5 dia, 3.5 long / 4.48, 3.94); 12-8-12: square-end small neck "4" (4 (tolerance illegible), about 3.1 long  / 3.88, 2.92); 17-1-22: barrel arbor: core's cylindrical length, y (-17.70 to -7.76 (+-0.15) / -16.73..-8.45); 17-1-23: barrel arbor: core's end chamfers (1.05 axial by about 2.1 radial (to about / 1.65 x 1.65); 17-1-24: barrel arbor: neck above the core (inside the cover's boss) (D 5.13, y -22.2 to -18.75 (+-0.12) / 4.48); 17-1-25: barrel arbor: neck below the core, down to the pillar plate (D 4.93, y -6.66 to -0.04 / 4.48) |
| barrelBridge | 050805-1 | yes | 05 08_13, 05 08_12, Federchronometer 05 | 21 | 2 | 0 | 0 | 1 | 02-7-20: straight edge's chord 73.5 (arrows parallel to the edge, from the upper arc corner to the  (73.5 / projection of (-14.1814,40.0583)-(-27.72); 03-5-7: screw holes at the bridge ends (top and bottom) (Ø 3.4-3.5 scaled (about as big as 0.8 of / barrelBridge cylinders[2.8 inside] at (-) |
| bezel | 050101-2 | yes | 05 01_4, 05 01_5 | 2 | 0 | 0 | 0 | 0 |  |
| blockScrew | WN-gk | yes | 05 08_1.a, 05 04_3 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| bowl | 050100-1 | yes | 05 01_1, 05 01_2 | 11 | 0 | 0 | 0 | 1 |  |
| box | Holzkasten | yes | none | | | | | | bought: no drawing in the set: Wooden box (Holzkasten) |
| box6 | Kasten6 | variant | none | | | | | | bought: no drawing in the set: Box body (Ящик), the 6MX's |
| boxHandle | 510010 | yes | none | | | | | | bought: no drawing in the set: Box handle (Griff f. Chronometerkasten), two |
| boxHinge | Scharnier | yes | none | | | | | | bought: no drawing in the set: Piano hinge (Scharnier), the box's |
| boxLid | Holzkasten.D | yes | none | | | | | | bought: no drawing in the set: Box lid (Deckel) |
| bracketScrew6 | 6MX.bks | variant | none | | | | | | bought: no drawing in the set: Bracket screws (6MX), six |
| bridgeScrew | WN-55 | yes | 05 08_13, 05 08_12 | 0 | 0 | 0 | 0 | 1 |  |
| bush300t35 | WN-300.t35 | yes | 05 08_2 | 1 | 0 | 0 | 0 | 0 |  |
| bush300t38 | WN-300.t38 | yes | 05 08_2 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| bush300zb | WN-300.zb | yes | 05 08_10 | 0 | 0 | 0 | 0 | 2 |  |
| bush301 | WN-301 | yes | 05 08_2 | 1 | 0 | 0 | 0 | 0 |  |
| bush302 | WN-302 | yes | 05 08_32.1, 05 08_32.2 | 1 | 0 | 0 | 0 | 0 |  |
| bushHs | WN-hs | yes | 05 08_3.a, 05 08_32.1, 05 08_32.2 | 0 | 0 | 0 | 0 | 1 |  |
| cannon | 050503-3 | yes | 05 05_8, 05 02_1, Federchronometer 05 | 5 | 2 | 0 | 0 | 1 | 05-1-7: 14.3 (cannon overall length, foot to top) (14.3 (sure) / 14.19); 05-1-10: Koerner groove "4 r" (notch both sides of the section at the groove) (notch both sides, radius figure illegibl / three cone dimples (cones d 1.26..1.55, ) |
| caseBracket | 050100-3 | yes | 05 01_1 | 1 | 0 | 0 | 0 | 0 |  |
| centreArbor | 050503-2 | yes | 05 05_1, 05 05_8, 05 05_10, Federchronometer 05 | 24 | 5 | 0 | 0 | 2 | 05-3-6: 5.4 n6 (collar, wheel seat; ISO n6 on 5.4: +0.016/+0.008) (5.408..5.416 (likely) / 5.4); 05-3-9: 3.6 dia (rivet lip maximum diameter) (3.6 (likely) / 3.2); 05-3-14: 16.7 -0.2 (top of cone C, z 23, to the upper tip) (16.7 -0.2 (sure) / 14.3 above z 23.03); 05-3-15: 39.65 -0.1 (shoulder to the upper tip) (39.65 -0.1 (sure) / 37.33); 05-3-18: 5.1 -0.2 (lower pivot length, tip to the chamfer line) (5.1 -0.2 (likely; assembly gives 3) / 3.0) |
| centreWheel | 050503-1 | yes | 05 05_1, 05 05_8, 05 05_9 | 10 | 1 | 0 | 0 | 2 | 04-1-3: Oberplatte inner face to top face of Minutenrad (centre wheel) (17 / 17.26) |
| chain | 050704 | yes | none | | | | | | bought: no drawing in the set: Chain (Kette), with its two end hooks |
| chainPin | 050600-6 | yes | none | | | | | | bought: no drawing in the set: Chain's pin (Kettenstift) |
| changePinion | 050202-3 | yes | 05 02_1, 51 02_6 | 3 | 1 | 0 | 0 | 0 | 14-1-13: pinion outside Ø (tips), scaled; no number on this sheet (about 7.2 (outer lines 123 px at 17.05 p / changePinion teeth[0].tips_d 6.8997) |
| changePipe | 050202-2 | yes | 05 02_1, 51 02_6 | 12 | 0 | 0 | 0 | 0 |  |
| changeWheel | 050202-1 | yes | 05 02_1, 51 02_6, 05 02_7 | 14 | 0 | 0 | 1 | 2 | 14-2-10: countersink at the bore on one face (sheet 06 shows the flare; this sheet none) (not drawn / changeWheel cones[0] d 4.2..4.66, z 0..0) |
| chaton35u | 6MX.ch35u | variant | none | | | | | | no drawing of its own in the set: Chaton (6MX), seconds arbor's upper jewel |
| chaton38l | 6MX.ch38l | variant | none | | | | | | no drawing of its own in the set: Chaton (6MX), intermediate arbor's lower jewel |
| chaton38u | 6MX.ch38u | variant | none | | | | | | no drawing of its own in the set: Chaton (6MX), intermediate arbor's upper jewel |
| click | 050805-2 | yes | 05 08_14, 05 08_12 | 15 | 1 | 0 | 0 | 2 | 02-8-10: overall length 17.4 (left corner to nose end) (17.4 / 17.5301 (box x -9.2618..8.2683)) |
| clicks | 050602-3 | yes | 05 06_1, 51 06_4, 05 06_11, 05 06_14 | 16 | 0 | 0 | 0 | 2 |  |
| clickScrew | WN-22 | yes | 05 08_12 | 1 | 0 | 0 | 0 | 0 |  |
| clickSpringRivets | 050602-4 | yes | none | | | | | | bought: no drawing in the set: Click springs' rivets (Niet), four |
| clickSpringStrip | 050602-2 | yes | none | | | | | | bought: no drawing in the set: Click springs' strip (Sperrfeder), two |
| clickWheel | 050604-3 | yes | 05 06_1, 05 06_3.1, 05 06_3.2, 51 06_4, 05 06_16 | 10 | 0 | 0 | 0 | 1 |  |
| closingPlate | 050100-2 | yes | 05 01_3 | 16 | 0 | 0 | 0 | 1 |  |
| closingSpring | 050100-7 | yes | none | | | | | | bought: no drawing in the set: Closing spring (Verschlußfeder, 14 on 05 01) |
| collet | 050201-2 | yes | 05 02_1, 05 02_5 | 1 | 0 | 0 | 0 | 0 |  |
| cone41 | cone41 | variant | 05 04_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| cone41.3955 | cone41 | variant | none | | | | | | no drawing of its own in the set: Banking screw M1.2 of the first-drawn block, domed head and pointed tail (WN-16  |
| corkRing | 050801-4 | yes | 05 08_2 | 1 | 0 | 0 | 0 | 0 |  |
| coverPlate | 050600-4 | yes | 05 06_1, 05 06_8 | 9 | 0 | 0 | 0 | 0 |  |
| ct6Axle | 6MX.ctd | variant | none | | | | | | bought: no drawing in the set: Contact disc axle screw (6MX) |
| ct6Base | 6MX.ct | variant | none | | | | | | no drawing of its own in the set: Contact base (6MX, Romanov's 58) |
| ct6BlockM | 6MX.ctbm | variant | none | | | | | | no drawing of its own in the set: Contact block - (6MX, 57) |
| ct6BlockP | 6MX.ctbp | variant | none | | | | | | no drawing of its own in the set: Contact block + (6MX, 52) |
| ct6Cap | 6MX.ctcc | variant | none | | | | | | no drawing of its own in the set: Cock cap plate (6MX) |
| ct6Clamp | 6MX.ctqs | variant | none | | | | | | bought: no drawing in the set: Spiral stud's clamp screw (6MX) |
| ct6Cock | 6MX.ctc | variant | none | | | | | | no drawing of its own in the set: Contact cock (6MX) |
| ct6Collet | 6MX.cw | variant | none | | | | | | no drawing of its own in the set: Contact wheel collet (6MX) |
| ct6Disc | 6MX.ctd | variant | none | | | | | | no drawing of its own in the set: Contact disc (6MX, 55) |
| ct6DiscBracket | 6MX.ctd | variant | none | | | | | | no drawing of its own in the set: Contact disc bracket (6MX) |
| ct6Lever | 6MX.ctl | variant | none | | | | | | no drawing of its own in the set: Contact lever (6MX, 60) |
| ct6Nut | 6MX.ctn | variant | none | | | | | | bought: no drawing in the set: Contact screw lock nut (6MX) |
| ct6Screw | 6MX.ctk | variant | none | | | | | | no drawing of its own in the set: Contact screw (6MX, 54) |
| ct6Setting | 6MX.ctjs | variant | none | | | | | | no drawing of its own in the set: Staff's upper jewel setting (6MX) |
| ct6Spiral | 6MX.cth | variant | none | | | | | | bought: no drawing in the set: Contact spiral (6MX, 59) with its collet |
| ct6SpringA | 6MX.cf | variant | none | | | | | | no drawing of its own in the set: Contact spring A (+) (6MX, 66) |
| ct6SpringB | 6MX.cf | variant | none | | | | | | no drawing of its own in the set: Contact spring B (-) (6MX, 66) |
| ct6Staff | 6MX.ctst | variant | none | | | | | | no drawing of its own in the set: Contact staff (6MX, 69) |
| ct6Stud | 6MX.ctq | variant | none | | | | | | no drawing of its own in the set: Spiral stud (6MX, 53) |
| ct6Wheel | 6MX.cw | variant | none | | | | | | no drawing of its own in the set: Contact wheel (6MX, 62) |
| detent | 050401-1 | yes | 05 04_1, 05 04_10.1, 05 04_10.2 | 35 | 4 | 0 | 0 | 5 | 06-1-12: escape wheel centre along the detent from the pipe (drawn directly under the pipe) (0 (+-0.1, scaled) / +0.447); 06-1-13: angle at the pipe between detent axis and the balance-to-wheel line (53.6 deg (scaled +-1) / 49.4 deg); 06-1-14: angle labelled 15 deg near the foot/centre line (what it attaches to is unclear) (15 deg / 15.8 deg); 06-5-4: tail width at the tip (0.25 (0.22) (top callout) / 0.054) |
| detentBlock | 050401-4 | yes | 05 04_1, 05 04_3 | 37 | 1 | 0 | 1 | 1 | 06-3-13: M1.2 hole across the arm thickness (centred, scaled +-0.06) (centre of the 3 (z 5.0) / 5.15); 06-3-28: two d0.45 blind holes 1.6 deep in the foot face at x 16.63 and 20.83 (steady pins) (not on this sheet / present) |
| detentBlock.1943 | 050401-4 | yes | none | | | | | | no drawing of its own in the set: Detent block (Gangfederkloben), the escapement of 1943 |
| detentBlock.3955 | 050401-4 | yes | none | | | | | | no drawing of its own in the set: Detent block (Gangfederkloben), as Wempe 3955's is photographed |
| detentBlock.6mx | 050401-4 | yes | none | | | | | | no drawing of its own in the set: Detent block (Gangfederkloben), the Soviet 6MX's |
| detentBlock.first | 050401-4 | yes | none | | | | | | no drawing of its own in the set: Detent block (Gangfederkloben), as first drawn |
| detentWire | 050506-1 | yes | none | | | | | | bought: no drawing in the set: Maintaining detent's wire spring (Feder) |
| dial | 050200-4 | yes | 05 02_1, 05 02_12, 05 02_13, Federchronometer 05 | 27 | 6 | 1 | 1 | 5 | 13-1-10: Gap dial top to hour-hand blade underside: dimension "2" (scaled 1.6) (2 (scaled 1.64) / 1.78); 13-1-v1: a part in the dial's underside, 0,1 clear (unsure which: the up-and-down wheel hub or the  (a part in the dial's underside, 0,1 clea / udWheel top y 9.55 (0.8 under the dial 1); 13-6-14: Dial feet / posts (assembly: block on a post, "Festsitz") (none on the dial (separate posts) / -); 13-7-1: Outside Ø103 (103 / 103.55); 13-7-2: Material thickness 1,5 (1.5 / 1.2); 13-7-5: Seconds hole Ø2,2 (1,5 struck out) (2.2 / 1.7); 13-7-8: This variant as a solid of its own (iron, 1.5, Ø103, 2.2) (a second dial / -); 17-1-39: fusee arbor: dial-side end (about 9.7, hidden in a hub / 10.1) |
| dialPin | dialPin | yes | 05 08_7, 05 02_12 | 0 | 0 | 0 | 1 | 1 | 13-6-14: Dial feet / posts (assembly: block on a post, "Festsitz") (none on the dial (separate posts) / -) |
| dialScrew | WN-10.d | yes | 05 02_12 | 0 | 0 | 0 | 1 | 0 | 13-6-14: Dial feet / posts (assembly: block on a post, "Festsitz") (none on the dial (separate posts) / -) |
| din96 | DIN96 | yes | none | | | | | | bought: no drawing in the set: Wood screw DIN 96, 3 × 15 (the transit lock bracket's) |
| dischargeRoller | 050404-1 | yes | 05 04_1 | 1 | 0 | 0 | 0 | 0 |  |
| dischargeStone | 050404-2 | yes | none | | | | | | bought: no drawing in the set: Discharge stone (Auslösestein) |
| drum | 050701-1 | yes | 05 07_1, 05 07_4, 05 07_5, 51 07_6, Federchronometer 05 | 36 | 2 | 0 | 0 | 2 | 12-5-2: lid seat (rim bore) 39.2 s6 (39.2 s6 (+0.043..+0.059) / 39.2); 12-5-18: slot reach "0,95 +0,15" (new; 18.3 struck) (0.95 +0.15 / 0.92) |
| dtArbor | 050505-2 | yes | 05 05_11 | 2 | 0 | 0 | 0 | 0 |  |
| dustBush | 050801-3 | yes | 05 08_9, 05 08_2 | 15 | 3 | 1 | 0 | 0 | 02-5-4: flange thickness 3.1 -0.2 (arrows span the flange; measured 3.06) (3.1 -0.2 (2.9..3.1) / 13.0..15.1 = 2.1); 02-5-9: body straight at Ø13.1 from the flange's underside down to the foot (straight, no neck / 45° step Ø13.0 to Ø10.5 at z 5.4..6.7, c); 02-5-12: (7.62) reference: bore at the top of the 20° cone ((7.62) / 7.7746 at z 16.3); 02-5-17: small rounds at the flange's outer edges and the boss's top edge (drawn, not dimensioned (about 0.2) / none in the file) |
| dustPlate | 050600-1 | yes | 05 06_1, 05 06_5 | 9 | 0 | 0 | 0 | 1 |  |
| endstoneBalL | 050408-1.bl | yes | none | | | | | | bought: no drawing in the set: Balance's lower endstone (Deckstein) |
| endstoneBalU | 050408-1.bu | yes | none | | | | | | bought: no drawing in the set: Balance's upper endstone (Deckstein) |
| endstoneEscL | 050408-1.el | yes | none | | | | | | bought: no drawing in the set: Escape wheel's lower endstone (Deckstein) |
| endstoneEscU | 050408-1.eu | yes | none | | | | | | bought: no drawing in the set: Escape wheel's upper endstone (Deckstein) |
| escapeArbor | 050405-2 | yes | 05 05_1, 05 04_7.2, 05 04_8, Federchronometer 05 | 11 | 4 | 0 | 0 | 2 | 05-7-5: 6.5 -0.2 (upper tip to the pinion top) (6.3..6.5 (sure) / 5.3); 05-7-6: 26.5 -0.2 (overall) (26.3..26.5 (sure) / 22.78); 05-7-7: 1.6 -0.2 (arbor above and below the pinion) (1.4..1.6 (sure) / 1.2); 17-1-60: escape arbor: top pivot tip, in the jewel (-19.9 (+-0.15) / -20.98) |
| escapeCollet | 050405-3 | yes | 05 04_7.2 | 1 | 0 | 0 | 0 | 2 |  |
| escapeWheel | 050405-1 | yes | 05 05_1, 05 04_7.2, 05 04_23, 05 04_1 | 20 | 1 | 0 | 0 | 6 | 06-1-7: escape wheel centre to M1.7 clamp-hole centre (v. Gangradmitte) (23.8 / 23.41) |
| escScrewL | WN-ec | yes | 05 08_3.b | 1 | 0 | 0 | 0 | 0 |  |
| escScrewU | WN-es | yes | 05 08_1.b | 1 | 0 | 0 | 0 | 0 |  |
| felt6 | Polster6 | variant | none | | | | | | bought: no drawing in the set: Felt (6MX), six |
| feltB | Polster.B | variant | none | | | | | | bought: no drawing in the set: Cushion, floor (Polster) |
| feltE | Polster.E | variant | none | | | | | | bought: no drawing in the set: Cushions, ends (Polster), two |
| feltFB | Polster.S | variant | none | | | | | | bought: no drawing in the set: Cushions, front and back (Polster), two |
| feltLid | Polster.D | variant | none | | | | | | bought: no drawing in the set: Lid cushion (Polster, 16) |
| fibre6_cfi | 6MX.cfi | variant | none | | | | | | bought: no drawing in the set: Contact spring's insulation (6MX, 64), two |
| fibre6_cfw | 6MX.cfw | variant | none | | | | | | bought: no drawing in the set: Terminal washers (6MX, 63), six |
| fibre6_ctf | 6MX.ctf | variant | none | | | | | | bought: no drawing in the set: Insulation (6MX, 68), two |
| fibre6_ctu | 6MX.ctu | variant | none | | | | | | bought: no drawing in the set: Insulating bush (6MX, 67), four |
| footScrew | WN-gf | yes | 05 04_1, 05 04_3 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| fusee | 050604-2 | yes | 05 06_1, 05 06_2.2, 05 06_3.1, 05 06_3.2, 51 06_4, 05 06_20, Federchronometer 05 | 30 | 2 | 0 | 0 | 14 | 09-2-3: 45 deg chamfer from recess to face; chamfer outer dia (29.8 +0.2 (dia) at 45 deg / 29.4); 17-1-39: fusee arbor: dial-side end (about 9.7, hidden in a hub / 10.1) |
| fuseeArbor | 050604-1 | yes | 05 06_1, 05 06_3.1, 05 06_3.2, 05 06_15, Federchronometer 05 | 19 | 4 | 0 | 0 | 1 | 09-6-1: overall length (60.6 -0.2 / 58.125); 09-6-3: left pivot length, tip to the 2.7 shoulder (60.6 - 19.7 - 28.3 - 6.5) (about 6.1 (derived; scaled about 6.6) / 3.625); 09-6-10: right pivot section: 3.17 +0.023/+0.015 tapering 1:100 to 2.92 at the tip, 20.3 long (3.17 to 2.92 / 4.41..4.16); 17-1-39: fusee arbor: dial-side end (about 9.7, hidden in a hub / 10.1) |
| fuseeBush | 050801-2 | yes | 05 08_8, 05 08_2 | 18 | 1 | 1 | 0 | 1 | 02-4-10: bore Ø4.1 +0.2 (4.1 +0.2 (4.1..4.3) / 4.52 inside z 0..5.76); 02-4-19: small edge breaks at the outer top and bottom corners (drawn, size not printed (about 0.1..0.15 / no edge cone on the outside (cones[0] is) |
| fuseeBushScrew | WN-34 | yes | 05 08_2 | 0 | 0 | 0 | 0 | 1 |  |
| fuseeWheel | 050600-3 | yes | 05 06_1, 51 06_4, 05 06_7 | 18 | 2 | 1 | 0 | 4 | 10-3-7: rim outer dia in section (leader 'gedreht 41,1') (40.65 -0.05 (40.60-40.65); unsure / 40.569); 10-3-17: bore dia (section 3.95, plan circle 4.04) (4 dia +0.1 / 4.55); 10-3-24: 'Kante leicht brechen' on boss top edge (edge break, no size / sharp corner) |
| gimbalRing | 050100-5 | yes | 05 01_1 | 4 | 0 | 0 | 0 | 1 |  |
| glass | 050101-1 | yes | none | | | | | | bought: no drawing in the set: Bezel glass (Glas) |
| goldScrew | WN-14 | yes | 05 04_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| goldSpring | 050401-2 | yes | 05 04_1, 05 04_2 | 9 | 2 | 0 | 0 | 1 | 06-1-15: gold spring: bend point (Biegungspunkt der Goldfeder), distance from the spring end (about 6.3 (scaled) / 4.43); 06-2-9: blank drawn straight; the built spring is bent in plan (BSPLINE, sag 0.9) (straight / bent) |
| hairspringStrip | 050302-1 | yes | none | | | | | | bought: no drawing in the set: Hairspring strip (Spiralfaden) |
| handle6 | Griff6 | variant | none | | | | | | bought: no drawing in the set: Ring handle (6MX), two |
| hasp6 | Ueberfall6 | variant | none | | | | | | bought: no drawing in the set: Hasp leaves (6MX), four |
| hinge6 | Scharnier6 | variant | none | | | | | | bought: no drawing in the set: Hinges (6MX), two |
| hook | 050702-2 | yes | 05 07_1, 05 07_8 | 2 | 4 | 0 | 0 | 2 | 12-1-18: hook on the arbor (05 07 02-2) at 15 deg to the square's flat normal (end view) (15 deg / hole axis along the square diagonal = 45); 12-7-4: hook 05 07 02-2 stands out of the body "0,5 -0,05" (0.5 -0.05 (0.45..0.5) / 0.25); 12-7-5: hook at 15 deg to the square flat normal (15 deg / 45 deg); 12-7-7: hook pin / hole dia, depth (2 dia, 6 deep (sheet 09) / 2.0, hole through) |
| hook41 | 050702-2 | yes | none | | | | | | no drawing of its own in the set: Arbor hook (Federhaken) as first drawn |
| hookBlock | 050701-3 | yes | 05 07_1, 05 07_4 | 4 | 0 | 0 | 0 | 0 |  |
| hookBox | Haken | variant | none | | | | | | bought: no drawing in the set: Hook (Haken, 9), commercial |
| hookEye | Hakenoese | variant | none | | | | | | bought: no drawing in the set: Hook eye (Öse, 9), commercial |
| hookPlate | Hakenblech | yes | none | | | | | | bought: no drawing in the set: Hook plate (Hakenblech) |
| hourHand | 050200-2 | yes | 05 02_1, 05 02_3 | 16 | 3 | 0 | 0 | 0 | 13-1-10: Gap dial top to hour-hand blade underside: dimension "2" (scaled 1.6) (2 (scaled 1.64) / 1.78); 13-1-11: Minute-hand boss bottom to hour-hand flange top (label "0,2" near the hands) (0.2? / 0.72); 13-3-5: Bore Ø4,4 H7 +0,012 (4.4 (+0.012) / 4.4155 narrow end) |
| hourPipe | 050203-2 | yes | 05 02_1, 05 02_8 | 8 | 1 | 0 | 0 | 0 | 14-3-2: collar top height above the foot (wheel underside) (5.2 -0.1 (sure; measured 5.1 on the scan / hourPipe cylinders[1] z 1.0..3.585 (coll) |
| hourWheel | 050203-1 | yes | 05 02_1, 05 02_8, 05 02_9, Federchronometer 05 | 14 | 0 | 1 | 0 | 0 | 14-4-v1: blank 20.2 -0.1 gedreht, 1.05 +-0.03 gedreht (blank 20.2 -0.1 gedreht, 1.05 +-0.03 ged / likely) |
| hsCollet | 050302-2 | yes | 51 03_5, 05 03_8 | 13 | 4 | 2 | 0 | 1 | 08-1-3: collet face to the spring face nearest it (0.75) (0.75 / 0.49); 08-4-5: bore 1.6 H7 +0.009 (1.6..1.609 / 1.6029); 08-4-7: bore diameter at the other face (1.55), bracketed reference ((1.55): 1.6 H7 at one face, 1.55 at the  / 1.65); 08-4-11: cross hole diameter 0.8 +0.01 at the entry, (0.77) at the other, Kegel 1:90, drilled 0.7 (0.8..0.81 tapering to 0.77 / 0.805 straight); 08-4-14: Koerner anbringen (centre-punch mark at the hole) (a punch mark where the hole goes / none); 08-4-v2: "0.7 bohren": the hole is drilled 0.7 first, then 0.8 phi +0.01 with the Kegel 1:90 ("0.7 bohren": the hole is drilled 0.7 fi / ) |
| hsCollet.pin | 050302-4.c | yes | none | | | | | | bought: no drawing in the set: Collet's pin for the hairspring (Spiralstift) |
| hsStud | 050302-3 | yes | 51 03_5, 05 03_9 | 20 | 2 | 2 | 0 | 1 | 08-1-2: stud arm inner face to top of spring (3.15) (3.15 (extension line at the terminal cur / 2.89); 08-5-13: spring hole distance from the leg end (scaled off the side view, no printed dimension; hol (about 0.68 centre to end / 1.35); 08-5-15: point rounded (a 0.8 mark at the tip; Phi or R illegible) (small rounding at the tip / sharp point); 08-5-v2: 3.1 -0.2 and the V's opening: the notch (V cut) apex also rounds (small radius at the apex (3.1 -0.2 and the V's opening: the notch  / the V's inner end drawn rounded (enlarge) |
| hsStud.pin | 050302-4.s | yes | none | | | | | | bought: no drawing in the set: Stud's pin for the hairspring (Spiralstift) |
| hub | 050402-2 | yes | 05 04_4, 05 04_5, 05 03_1 | 14 | 3 | 1 | 0 | 2 | 07-1-4: shaft Ø at the hub end of the taper (1,65 s6: +0.015..+0.022 -> 1.665..1.672) (1.65 s6 (sure) / 1.6514); 07-1-16: 14,03 -0,06: hub top face to the lower pivot tip (14.03 -0.06 (sure) / 12.59); 07-2-5: 4,7 -0,05 (framed): flange top to the sleeve end (4.7 (sure) / 4.1); 07-2-8: 10 deg taper on the flange edge (10 deg (sure) / 0 deg) |
| impulseRoller | 050403-1 | yes | 05 04_1, 51 04_6 | 19 | 0 | 0 | 1 | 3 | 06-4-15: cut centre distance 5.927 from the axis (not printed) (not printed / 5.927) |
| impulseStone | 050403-2 | yes | none | | | | | | bought: no drawing in the set: Impulse stone (Hebestein) |
| intermediateArbor | 050502-2 | yes | 05 05_1, 05 05_5, 05 05_7, Federchronometer 05 | 15 | 4 | 0 | 0 | 4 | 04-7-3: Seat dia (4.0 n6 (+0.008..+0.016) / 4.0); 04-7-9: Upper pivot length (4.6 -0.2 / 2.95); 04-7-10: Lower pivot length (4.6 -0.2 / 2.95); 04-7-v1: both tips pointed cones (sure) (both tips pointed cones (sure) / ) |
| intermediateBridge | 050804-1 | yes | 05 08_10, 05 08_32.1, 05 08_32.2, Federchronometer 05 | 4 | 0 | 0 | 0 | 0 |  |
| intermediateBridgeScrew | WN-52 | yes | 05 08_10, 05 08_32.2 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| intermediateWheel | 050502-1 | yes | 05 05_1, 05 05_5, 05 05_6 | 11 | 0 | 0 | 0 | 3 |  |
| jewel35 | 050504-1 | yes | none | | | | | | bought: no drawing in the set: Seconds arbor's lower jewel (Lagerstein f. Sek.) |
| jewel6_35u | 6MX.jw35u | variant | none | | | | | | bought: no drawing in the set: Hole jewel (6MX), seconds arbor, upper |
| jewel6_38l | 6MX.jw38l | variant | none | | | | | | bought: no drawing in the set: Hole jewel (6MX), intermediate arbor, lower |
| jewel6_38u | 6MX.jw38u | variant | none | | | | | | bought: no drawing in the set: Hole jewel (6MX), intermediate arbor, upper |
| jewel6_ctjel | 6MX.ctjel | variant | none | | | | | | bought: no drawing in the set: End jewel (6MX), contact staff, lower |
| jewel6_ctjeu | 6MX.ctjeu | variant | none | | | | | | bought: no drawing in the set: End jewel (6MX), contact staff, upper |
| jewel6_ctjl | 6MX.ctjl | variant | none | | | | | | bought: no drawing in the set: Hole jewel (6MX), contact staff, lower |
| jewel6_ctju | 6MX.ctju | variant | none | | | | | | bought: no drawing in the set: Hole jewel (6MX), contact staff, upper |
| jewelBalL | 050407-1.bl | yes | none | | | | | | bought: no drawing in the set: Balance's lower hole jewel (Lagerstein) |
| jewelBalU | 050407-1.bu | yes | none | | | | | | bought: no drawing in the set: Balance's upper hole jewel (Lagerstein) |
| jewelEscL | 050406-1.el | yes | none | | | | | | bought: no drawing in the set: Escape wheel's lower hole jewel (Lagerstein) |
| jewelEscU | 050406-1.eu | yes | none | | | | | | bought: no drawing in the set: Escape wheel's upper hole jewel (Lagerstein) |
| key40Body | 127556.02-02 | variant | 51 01_6 | 6 | 0 | 0 | 0 | 0 |  |
| key40Cap | 127556.02-01 | variant | 51 01_6 | 8 | 0 | 0 | 0 | 0 |  |
| key40Pipe | 127556.02-03 | variant | 51 01_6 | 5 | 0 | 0 | 0 | 1 |  |
| key40Screw | 127556.02-05 | variant | none | | | | | | bought: no drawing in the set: Countersunk screws, 1940 (Schraube), two |
| key40Spring | 127556.02-04 | variant | none | | | | | | bought: no drawing in the set: Click spring, 1940 (Feder) |
| keyBody | 050102-2 | yes | 05 01_7, 05 01_8 | 23 | 0 | 0 | 0 | 0 |  |
| keyHolder | Schluesselhalter | yes | none | | | | | | bought: no drawing in the set: Key holder (Schlüsselhalter), the shelf |
| keyHolderCup | Schluesselhalter.F | yes | none | | | | | | bought: no drawing in the set: Key holder fitting (Fassung), round |
| keyPaddle | 510011-1 | yes | 51 01_6, 05 01_7 | 1 | 2 | 0 | 0 | 1 | 16-2-4: paddle disc diameter (scaled) (33.8 (likely) / 34.5); 16-2-13: overall length, tube end to paddle top (scaled) (79.9 (likely) / 84.7) |
| keyPin | 510011-6 | yes | none | | | | | | bought: no drawing in the set: Grooved pin K.S. 1 (Kerbstift) |
| keySpring | 510011-4 | yes | none | | | | | | bought: no drawing in the set: Coil spring (Wendelfeder) |
| keyTube | 050102-3 | yes | 05 01_7, 05 01_9 | 14 | 1 | 0 | 0 | 1 | 16-4-5: head-to-shank 0.3 r (a radius) (0.3 r (likely) / 0.3 chamfer) |
| latchKnob | WN-zk | yes | none | | | | | | bought: no drawing in the set: Latch knob (Knopf), in the tongue's M3.5 |
| latchPlate | Schliessblech | yes | none | | | | | | bought: no drawing in the set: Latch plate (Schließblech) |
| latchTongue | P510002-2 | yes | none | | | | | | bought: no drawing in the set: Latch tongue (Zunge) |
| lid | 050701-2 | yes | 05 07_1, 05 07_4, 05 07_7 | 18 | 3 | 0 | 0 | 4 | 12-1-13: lid outer face to arbor body "2,9" (2.9 / 3.35); 12-6-1: lid dia at the face, r6 (39.2 r6 (+0.034..+0.050) / 39.2); 12-6-11: narrow notch bottom from the centre (18.3 +-0.02 / 18.328) |
| lid6 | Kasten6.D | variant | none | | | | | | bought: no drawing in the set: Glazed lid and top lid (6MX) |
| lidGlass | Deckelglas | yes | none | | | | | | bought: no drawing in the set: Lid glass (Deckelglas) |
| lidPin | Kastenstift | yes | none | | | | | | bought: no drawing in the set: Pins over the outer pivots (Kastenstift), two |
| lidStay | Deckelstuetze | yes | none | | | | | | bought: no drawing in the set: Lid stay (Deckelstütze) |
| lockArbor | 050101.F.a | yes | 05 01_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| lockBr | 050101.F.b | yes | 05 01_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| lockBr6 | 050101.F.b | yes | none | | | | | | no drawing of its own in the set: Lock bracket (Feststellerwinkel), the 6MX's |
| lockBracket | 050100-4 | yes | 05 01_1 | 2 | 0 | 0 | 0 | 0 |  |
| lockHub | 050101.F.h | yes | 05 01_1 | 1 | 0 | 0 | 0 | 0 |  |
| lockingStone | 050401-3 | yes | none | | | | | | bought: no drawing in the set: Locking stone (Ruhestein) |
| lockKnob | 050101.F.k | yes | 05 01_1 | 1 | 0 | 0 | 0 | 0 |  |
| lockLever | 050101.F.l | yes | 05 01_1 | 1 | 0 | 0 | 0 | 0 |  |
| lockLever6 | 050101.F.l | yes | none | | | | | | no drawing of its own in the set: Lock lever (Feststellerhebel), the 6MX's |
| lockPin | 050101.F.p | yes | 05 01_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| lockPin6 | 050101.F.p | yes | none | | | | | | no drawing of its own in the set: Lever grip (Hebelzapfen), the 6MX's plain |
| lowerCock | 050800-2 | yes | 05 08_4, 05 08_33, Federchronometer 05 | 21 | 1 | 0 | 0 | 1 | 03-8-2: width in Ansicht A (19.75, from the tall block's left face to the arm end) (19.75 / lowerCock size 20.0 x 17.2: foot 20.0 x ) |
| lowerCockScrew | WN-53 | yes | 05 08_1.b | 1 | 0 | 0 | 0 | 0 |  |
| mainspringStrip | 050700-6 | yes | none | | | | | | bought: no drawing in the set: Mainspring strip (Zugfeder) |
| maintDetent | 050505-1 | yes | 05 05_11, 05 05_12 | 12 | 2 | 0 | 0 | 3 | 05-5-6: 9.645 (hole axis to the R9 centre line, vertical) (9.645 (sure) / 9.781); 05-5-7: 6.273 (hole axis to the R9 centre, horizontal) (6.273 (sure) / 6.033) |
| maintRatchet | 050602-1 | yes | 05 06_1, 51 06_4, 05 06_11, 05 06_12 | 22 | 0 | 0 | 0 | 3 |  |
| maintSpringPins | 050600-8 | yes | none | | | | | | bought: no drawing in the set: Maintaining spring's pins (Stellstift f. Gegenfeder), two |
| makersPlate | 000101-9 | yes | none | | | | | | bought: no drawing in the set: Maker's plate (Firmenschild), Type 3371 |
| masses | 050301-4 | yes | 05 03_1, 05 03_2 | 5 | 0 | 0 | 0 | 1 |  |
| massScrew | WN-12 | yes | 05 03_1, 05 03_2 | 0 | 0 | 0 | 0 | 1 |  |
| minuteHand | 050200-1 | yes | 05 02_1, 05 02_2 | 13 | 1 | 0 | 0 | 0 | 13-1-11: Minute-hand boss bottom to hour-hand flange top (label "0,2" near the hands) (0.2? / 0.72) |
| mspring | 050601-1 | yes | 05 06_1, 51 06_4, 05 06_9, 05 06_10 | 12 | 0 | 0 | 0 | 4 |  |
| number6 | Nummernschild | variant | none | | | | | | bought: no drawing in the set: Number plate 247 (6MX), two |
| nutA | WN-400 | yes | 05 01_1 | 2 | 0 | 0 | 0 | 0 |  |
| nutW | WN-400.w | yes | 05 01_1 | 2 | 0 | 0 | 0 | 0 |  |
| outer6 | Ueberkasten6 | variant | none | | | | | | bought: no drawing in the set: Outer box (6MX), body |
| outerBox | Ueberkasten | variant | none | | | | | | bought: no drawing in the set: Outer box (Überkasten), body and base plate |
| outerHinge | Scharnier.U | variant | none | | | | | | bought: no drawing in the set: Outer box hinges (Scharnier, 7), two |
| outerLid | Ueberkasten.D | variant | none | | | | | | bought: no drawing in the set: Outer box lid (Deckel) |
| outerLid6 | Ueberkasten6.D | variant | none | | | | | | bought: no drawing in the set: Outer box lid (6MX) |
| pillarPlate | 050802-1 | yes | 05 08_3.a, 05 08_3.b, 001, 05 08_32.1, 05 08_32.2, Federchronometer 05 | 47 | 3 | 2 | 2 | 4 | 01-3-7: hole 10 Schnecke (N15.292 E16.708) (drill 2.5, calibre 2.70 +-0.009 / d 2.82 at [16.708,15.292] through); 01-3-29: hole 56 Kontakt Schr. r. (S40.190 E5.000), "nur bei Bedarf" (drill 1.3, M1.7 / no hole at [5.0,-40.19]); 01-3-30: hole 57 Kontakt Schr. l. (S38.184 W13.500), "nur bei Bedarf" (drill 1.3, M1.7 / no hole at [-13.5,-38.184]); 01-4-3: hole 30 section G-H: 4.59 H7 step, land 0.5 -0.05, which face (4.59 H7; land 0.5 -0.05 at the BOTTOM of / d 4.596 z[2.85,3.35]: land at z=3.35 (ob); 01-4-6: hole 26: no recess drawn on the plan or in a section (2.5 only / d 4.6 z[0,0.25] at [11.783,-21.743]); 01-4-17: EXTRA pillar plate: 4.6 dia x 0.25 recess at hole 26 (for the endstone setting flange) (none on sheet / d 4.6 z[0,0.25] at [11.783,-21.743]); 01-4-18: EXTRA pillar plate: 1.0 dia notch (r0.5) at the rim, 6 o'clock (none on sheet / d 1.0 at [0,-42.4945], arc 179 deg, thro) |
| pillars | 050800-1 | yes | 05 08_11, Federchronometer 05 | 9 | 4 | 1 | 0 | 0 | 02-6-7: taper angle 5° (5° / 6.0); 02-6-8: cylindrical part of the spigot 1.4 -0.2 (the taper is the rest) (1.4 -0.2 / 22.4..24.1 = 1.7; cones[0].z 24.1..25.2 ); 02-6-10: 90° countersink at each end of the hole (90° / 45); 02-6-11: countersink width at the face (scaled; not printed) (about Ø2.9 / 2.6..2.62 at the face); 02-6-12: relief groove in the shoulder face around the spigot (oval groove r 2.5..3.5, depth about 0.4 / only a vertex at r 3.25 on the shoulder ) |
| pillarScrew | WN-57 | yes | 001 | 0 | 0 | 0 | 0 | 1 |  |
| pillarScrewD | WN-ps | yes | 001 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| pin6_ctcp | 6MX.ctcp | variant | none | | | | | | bought: no drawing in the set: Contact cock steady pins (6MX), two |
| rim | 050301-1 | yes | 05 03_1, 05 03_2, 05 03_4 | 18 | 1 | 2 | 0 | 1 | 07-6-2: layer boundary Ø (31,29 -0,04): nickel steel against brass (31.29 -0.04 (sure) / -); 07-6-10: 1,8 H7 +0,009 and 0,4: the hole's top form (countersink or counterbore; which hole is unsu (1.8 H7, 0.4 deep (unsure) / 1.8 x 0.4, countersink); 07-6-17: 8 Koerner in 60 Teilung (eight punch marks, 60 divisions) (8 marks (sure) / 0) |
| rimStrip | Randleiste | variant | none | | | | | | bought: no drawing in the set: Rim strip (Leiste, 17, 18) |
| ring | 050800-3 | yes | 05 08_7 | 20 | 0 | 0 | 0 | 4 |  |
| ringBracket | 050100-6 | yes | 05 01_1 | 1 | 0 | 0 | 0 | 0 |  |
| ringScrew | WN-56 | yes | 05 08_7 | 0 | 0 | 0 | 0 | 1 |  |
| screw6_cfs | 6MX.cfs | variant | none | | | | | | bought: no drawing in the set: Contact spring screws (6MX, 65), four |
| screw6_ctccs | 6MX.ctccs | variant | none | | | | | | bought: no drawing in the set: Cap plate screws (6MX), two |
| screw6_ctcs | 6MX.ctcs | variant | none | | | | | | bought: no drawing in the set: Contact cock screw (6MX) |
| screw6_ctm | 6MX.ctm | variant | none | | | | | | bought: no drawing in the set: Contact base screws (6MX, 56), two |
| screw6_cts | 6MX.cts | variant | none | | | | | | bought: no drawing in the set: Contact block screws (6MX), four |
| screw71 | WN-71 | yes | 05 01_1, 05 01_3 | 1 | 0 | 0 | 0 | 0 |  |
| screw71f | WN-71.f | variant | 05 01_3 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| screw72 | WN-72 | yes | 05 01_1, 05 01_3 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| screw72f | WN-72.6 | variant | 05 01_3 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| screw78m25 | WN-78.m25 | yes | 05 01_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| screw78m4 | WN-78.m4 | yes | 05 01_1 | 1 | 0 | 0 | 0 | 0 |  |
| screw79 | WN-79 | yes | 05 01_1 | 1 | 0 | 0 | 0 | 0 |  |
| screw80_3 | WN-80.3 | yes | 05 01_1, 51 00_2 | 3 | 1 | 0 | 0 | 0 | 16-6-17: M6 screw length, head top to pivot tip (scaled) (27.9 +-1 (unsure) / 24.0 / 26.3) |
| screw80_3m | WN-80.3m | variant | none | | | | | | no drawing of its own in the set: Outer pivot screw, 3 o'clock, the 6MX box (WN-80, 11 on 05 01), M6 |
| screw80_9 | WN-80.9 | yes | 05 01_1, 51 00_2 | 1 | 1 | 0 | 0 | 0 | 16-6-17: M6 screw length, head top to pivot tip (scaled) (27.9 +-1 (unsure) / 24.0 / 26.3) |
| screw80_9m | WN-80.9m | variant | none | | | | | | no drawing of its own in the set: Outer pivot screw, 9 o'clock, the 6MX box (WN-80, 11 on 05 01), M6 |
| screwHg | WN-hg | yes | 51 00_2 | 3 | 1 | 0 | 0 | 2 | 16-6-12: panel total height 185 (105 + lid part 80) (185 (sure) / 180) |
| screwKh | WN-kh | yes | 51 00_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| screwKr | WN-kr | yes | 05 01_1 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| screwUr | WN-ur | variant | 51 00_5 | 0 | 1 | 0 | 0 | 0 | 16-9-17: screw 5, 4 x 25 DIN 97 (strap screw) (4 x 25 (sure) / 3.977 / 25.0 / 27.6) |
| screwUr6 | WN-ur.6 | variant | 51 00_5 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| screwZg | WN-zg | yes | 51 00_4 | 5 | 0 | 0 | 0 | 1 |  |
| secondsArbor | 050501-2 | yes | 05 05_1, 05 05_2, 05 05_4, Federchronometer 05 | 19 | 7 | 0 | 0 | 3 | 04-4-1: Upper pivot length, tip to collar top (9.2 / 7.2); 04-4-10: Seat under the leaves, dia (2.6 n6 (+0.013/+0.006) / 2.6); 04-4-15: Lower pivot length (4.5 / 3.0); 04-4-18: Upper tip form (pointed cone about 0.5 long, scaled) (pointed cone / flat 0.47); 04-4-v1: upper tip: a pointed cone, base 0.65, about 0.46 long (scaled, likely) (upper tip: a pointed cone, base 0.65, ab / ); 04-4-v2: lower tip: a pointed cone, base 0.82, about 0.4 long (likely) (lower tip: a pointed cone, base 0.82, ab / ); 04-4-v3: `nicht eingetr. Toleranz ±0,1`: general tolerance on the 7, the 4,5 and others (sure) (`nicht eingetr. Toleranz ±0,1`: general  / ) |
| secondsHand | 050201-1 | yes | 05 02_1, 05 02_5 | 11 | 0 | 0 | 0 | 1 |  |
| secondsWheel | 050501-1 | yes | 05 05_1, 05 05_2, 05 05_3 | 12 | 1 | 0 | 0 | 2 | 04-2-8: Hub dia of the wheel (arrows each side of the wheel) (6 / 6.4) |
| setting35 | 050504-2 | yes | 05 08_10 | 0 | 0 | 0 | 0 | 1 |  |
| settingBL | 050406-2.bl | yes | 05 08_4, 05 08_33 | 3 | 1 | 0 | 0 | 2 | 03-8-6: jewel halves 1.4 + 1.4 (2.8 stack) (1.4 / 1.4 / settingBL size z 1.53, settingCL 1.19 (2) |
| settingBU | 050406-2.bu | yes | 05 08_5, 05 08_6 | 2 | 1 | 0 | 0 | 1 | 03-3-18: jewel stack: two halves 1.4 + 1.4 (hatched blocks, split at 1.4 from the top) (1.4 / 1.4 / settingCU size z 1.63, settingBU 1.17: s) |
| settingCEL | 050408-2.el | yes | 05 08_3.b | 0 | 0 | 0 | 0 | 1 |  |
| settingCEU | 050408-2.eu | yes | 05 08_1.b | 1 | 1 | 0 | 0 | 0 | 01-2-22: escape wheel upper endstone setting (settingCEU) flange in the 4.5 H7 step (4.5 H7 (read; see the P-Q row) / outside d 4.59 over 0.5 (z -22.35..-21.8) |
| settingCL | 050408-2.bl | yes | 05 08_4, 05 08_33 | 2 | 2 | 0 | 0 | 1 | 03-8-6: jewel halves 1.4 + 1.4 (2.8 stack) (1.4 / 1.4 / settingBL size z 1.53, settingCL 1.19 (2); 03-8-8: 0.1 stack proud of the arm face at the other end (0.1 / placements 050408-2.bl ymax -9.0 = cock ) |
| settingCU | 050408-2.bu | yes | 05 08_5, 05 08_6 | 1 | 1 | 0 | 0 | 1 | 03-3-18: jewel stack: two halves 1.4 + 1.4 (hatched blocks, split at 1.4 from the top) (1.4 / 1.4 / settingCU size z 1.63, settingBU 1.17: s) |
| settingEL | 050406-2.el | yes | 05 08_3.b | 1 | 0 | 0 | 0 | 0 |  |
| settingEU | 050406-2.eu | yes | 05 08_1.b | 1 | 0 | 0 | 0 | 0 |  |
| settingScrewL | WN-18 | yes | 05 08_4, 05 08_33 | 2 | 0 | 0 | 0 | 1 |  |
| settingScrewU | WN-55.ck | yes | 05 08_5, 05 08_6 | 0 | 0 | 0 | 0 | 1 |  |
| setupRatchet | 050700-3 | yes | 05 07_1, 05 07_3 | 7 | 2 | 0 | 0 | 2 | 12-2-7: square hole 2.7 H7 (+0.009), taper 1:100 (2.700..2.709, taper 1:100 / 2.6975 at the large end; taper 1:100); 12-2-8: square orientation to the tooth tip: tip on the axis, along a flat normal (0 deg / 9.9 or 12.6 deg off a flat normal) |
| staff | 050402-1 | yes | 05 04_1, 05 04_4, 05 04_5, 05 03_3.2, 05 03_1, Federchronometer 05 | 27 | 13 | 1 | 0 | 10 | 07-1-4: shaft Ø at the hub end of the taper (1,65 s6: +0.015..+0.022 -> 1.665..1.672) (1.65 s6 (sure) / 1.6514); 07-1-16: 14,03 -0,06: hub top face to the lower pivot tip (14.03 -0.06 (sure) / 12.59); 07-2-2: collar above the flange Ø (2,1 ±0,03 -> 2.07..2.13) (2.1 ±0.03 (likely) / 2.0); 07-2-3: length of that collar above the flange (1,3) (1.3 (likely) / 1.1); 07-2-7: 14 ±0,03 (framed): flange top to the lower tip (14 (sure) / 12.59); 07-3-1: upper pivot Ø at its shoulder (1,25 -0,02 -> 1.23..1.25) (1.25 -0.02 (likely) / 1.2); 07-3-3: collar above the hub Ø (2,40 or 2,10, -0,02; digit unsure) (2.40 or 2.10 (unsure) / 2.0); 07-3-5: lower 1,65 collar length (1,6) (1.6 (likely) / 1.5); 07-3-6: 5,7: hub top face to the end of the collar (5.7 (likely) / 5.6); 07-3-10: lower pivot length, collar end to tip (6,9) (6.9 (likely) / 6.99); 07-3-13: lower pivot shaft Ø (1,25 -0,02) (1.25 -0.02 (likely) / 1.2155); 07-3-14: lower collar Ø (1,65 -0,02 -> 1.63..1.65) (1.65 -0.02 (likely) / 1.6685); 07-3-19: 10 deg taper on the hub flange (drawn as a trapezoid, wide at the top) (about 10 deg (likely) / 0 deg); 17-1-66: balance staff: where the thin section widens (y -29.9 (+-0.2) / -28.9) |
| steg | 050700-1 | yes | 05 07_1, 51 07_6, 05 07_7 | 0 | 0 | 0 | 0 | 1 |  |
| stellstift201 | WN-201 | yes | none | | | | | | bought: no drawing in the set: Plate pin (Stellstift WN-201) |
| stellstift201gk | WN-201.gk | yes | none | | | | | | bought: no drawing in the set: Detent block's steady pins (WN-201), two |
| stellstift202 | WN-202 | yes | none | | | | | | bought: no drawing in the set: Case pin (Stellstift WN-202) |
| stellstift203 | WN-203.bb | yes | none | | | | | | bought: no drawing in the set: Steady pin (Stellstift WN-203) |
| stellstift203lc | WN-203.lc | yes | none | | | | | | bought: no drawing in the set: Steady pins, lower balance cock (holes 22, 37) |
| stellstift203uc | WN-203.uc | yes | none | | | | | | bought: no drawing in the set: Steady pins, upper balance cock (holes 6, 9, 50) |
| stellstift203zb | WN-203.zb | yes | none | | | | | | bought: no drawing in the set: Steady pins, intermediate bridge (holes 29, 44) |
| stellstiftgf | WN-205.d | yes | none | | | | | | bought: no drawing in the set: Detent foot's steady pins, two |
| stone6 | 6MX.ctp | variant | none | | | | | | bought: no drawing in the set: Contact lever's stone (6MX, 61) |
| stopBar | 050603-1 | yes | 05 06_1, 05 06_2.2, 51 06_4 | 2 | 0 | 0 | 0 | 1 |  |
| stopBarPin | 050603-2 | yes | none | | | | | | bought: no drawing in the set: Stop bar's pin (Stift) |
| stopBarSpringStrip | 050603-3 | yes | none | | | | | | bought: no drawing in the set: Stop bar's spring strip (Stegfeder) |
| stopPin | 050801-5 | yes | none | | | | | | bought: no drawing in the set: Stop pin (Anschlagstift) |
| stopScrew6 | 6MX.gke | variant | none | | | | | | no drawing of its own in the set: Detent foot's stop screw (6MX), in the block's side |
| stopSpringPin | 050604-4 | yes | none | | | | | | bought: no drawing in the set: Stop bar spring's pin (Stift) |
| strap | Riemen | variant | none | | | | | | bought: no drawing in the set: Strap (Riemen, 10), two |
| strapEye | Riemenoese | variant | none | | | | | | bought: no drawing in the set: Strap eye (Öse, 12), two |
| strips6 | Beschlag6 | variant | none | | | | | | bought: no drawing in the set: Corner strips (6MX) |
| studBush | 050802-2 | yes | 05 08_32.1, 05 08_32.2 | 1 | 0 | 0 | 0 | 0 |  |
| studLong | 050200-6 | yes | 05 08_32.1, 05 08_32.2, 05 02_1 | 3 | 1 | 0 | 0 | 1 | 13-1-12: UD arbor stud: label 12,7 along the stud (length or a diameter?) (12.7 / 12.3) |
| studScrew | WN-11 | yes | 51 03_5, 05 03_9 | 0 | 0 | 0 | 0 | 2 |  |
| studScrew43 | WN-gk | yes | none | | | | | | no drawing of its own in the set: Block stud (WN-gk, the escapement of 1943's) |
| studScrew6 | WN-gk | yes | none | | | | | | no drawing of its own in the set: Block stud (WN-gk, the 6MX's) |
| studShort | 050200-7 | yes | 05 08_32.1, 05 08_32.2, 05 02_1 | 3 | 0 | 0 | 0 | 0 |  |
| terminal6 | 6MX.cfk | variant | none | | | | | | bought: no drawing in the set: Contact terminals (6MX), two |
| timingScrew | 050301-2 | yes | 05 03_1, 05 03_2, 05 03_4 | 2 | 0 | 0 | 0 | 2 |  |
| timingWeight | 050301-3 | yes | 05 03_1, 05 03_2 | 3 | 0 | 0 | 0 | 0 |  |
| topPlate | 050901 | yes | 05 08_1.a, 05 08_1.b, 001, 05 08_2, Federchronometer 05 | 56 | 2 | 0 | 3 | 6 | 01-2-2: hole 4 on plan: plain small circle, no countersink drawn (0.9 only / countersink d 0.9..2.4 and 2.4..4.3 at z); 01-2-7: hole 26 section P-Q: upper 4.5 H7 step (4.5 H7 (+0.012); read "4,5" with no 9 (c / d 4.596 z[2.85,3.35]); 01-2-26: EXTRA top plate: 0.9 hole 4 countersink d 4.3 (and the 0.9..2.4 dimple cone) (none on sheet / d 0.9..2.4 z[2.4,2.8]; 2.4..4.3 z[2.8,3.); 01-2-27: EXTRA top plate: two blind 0.925 holes with countersinks 0.925..1.4, z[0,3.11] (not on the visible sheet (the right part / at [30.6081,-19.922] and [38.4639,-12.55); 01-2-28: EXTRA top plate: two r1.0 rounds at the crescent tips (tips drawn pointed, no radius dimensione / d 2.0 outside arcs at [-40.2797,-9.9671]) |
| udHand | 050200-3 | yes | 05 02_1, 05 02_4 | 7 | 0 | 0 | 0 | 2 |  |
| udHub | 050204-2 | yes | 05 02_1, 05 02_10 | 13 | 0 | 0 | 0 | 1 |  |
| udPinion | 050200-5 | yes | 05 02_1 | 1 | 1 | 0 | 0 | 1 | 13-1-v1: a part in the dial's underside, 0,1 clear (unsure which: the up-and-down wheel hub or the  (a part in the dial's underside, 0,1 clea / udWheel top y 9.55 (0.8 under the dial 1) |
| udWheel | 050204-1 | yes | 05 02_1, 05 02_10, 05 02_11 | 16 | 1 | 0 | 1 | 1 | 13-1-v1: a part in the dial's underside, 0,1 clear (unsure which: the up-and-down wheel hub or the  (a part in the dial's underside, 0,1 clea / udWheel top y 9.55 (0.8 under the dial 1); 14-6-13: countersink on the bore (shown on sheet 05 02_10) (not drawn on this sheet / udWheel cones[0] d 5.2..5.66 z 0..0.4) |
| upperCock | 050803-1 | yes | 05 08_5, 05 08_6, Federchronometer 05 | 32 | 0 | 0 | 0 | 2 |  |
| upperCockScrew | WN-ucs | yes | 05 08_5 | 1 | 0 | 0 | 0 | 1 |  |
| vorreiber | 050600-2 | yes | 05 06_1, 05 06_6 | 11 | 3 | 0 | 0 | 1 | 10-2-1: overall length (3.1 -0.2 (2.9-3.1) / 2.76); 10-2-2: flange thickness incl 0.3 chamfer (scaled 1.16) (1.2 -0.2 (1.0-1.2) / 0.86); 10-2-11: cross hole dia (0.8 (width scaled 0.78) / 1.15) |
| vorreiberPin | 050600-5 | yes | none | | | | | | bought: no drawing in the set: Vorreiber pin (Vorreiberstift) |
| w19 | WN-19 | yes | 05 06_1, 05 06_3.1, 05 06_3.2 | 1 | 0 | 0 | 0 | 0 |  |
| w20 | WN-20 | yes | 05 06_1, 05 06_8 | 0 | 0 | 0 | 1 | 0 | 10-4-9: screw WN-20 (w20) (not drawn; M 1:1 view shows the plate on / fits the 3.1 countersink and 1.8 hole) |
| w21 | WN-21 | yes | 05 06_1, 05 06_11 | 1 | 0 | 0 | 0 | 0 |  |
| wireStud | wireStud | yes | 05 08_1.a, 05 05_11 | 0 | 0 | 0 | 0 | 0 | compared only as part of its sheet (no item names it; see the batch tables) |
| wn12a | WN-12a | variant | none | | | | | | bought: no drawing in the set: Poising screw for the compensation masses' tapped tops (not fitted) |
| woRo | WN-ro | variant | none | | | | | | bought: no drawing in the set: Eye screw 3 × 15 DIN 96 (the carrying case's eyes') |

## Results by batch and sheet

### Batch 1

Reader: 89 match, 6 mismatch, 2 not built, 5 extra, 14 can't tell. After the verifier: 89 match, 6 mismatch, 2 not built, 5 extra, 12 can't tell, 2 not applicable (reports: `batch01.md`, `verify01.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 08_1.a | Oberplatte 05 09 01 (15.6.43), sheet a | 36 | 34 | 0 | 0 | 0 | 0 |
| 05 08_1.b | Oberplatte 05 09 01 (15.6.43), sheet b | 28 | 15 | 3 | 0 | 3 | 7 |
| 05 08_3.a | Unterplatte 05 08 02-1, sheet a | 38 | 29 | 1 | 2 | 0 | 2 |
| 05 08_3.b | Unterplatte 05 08 02-1, sheet b | 18 | 11 | 2 | 0 | 2 | 3 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 01-1-17 | hole 26 Gangrad (S21.743 E11.783), table | drill 2.3, calibre 2.5 +0.009; but section P-Q (sheet b) dra | 5.206 z[0,2.85] and 4.596 z[2.85,3.35] at [11.783,-21.743];  | cant | n/a | Plan and section agree with each other and with the built bore; only the table row differs. Resolved from can't tell. |
| 01-2-2 | hole 4 on plan: plain small circle, no countersink drawn | 0.9 only | countersink d 0.9..2.4 and 2.4..4.3 at z[2.4,3.35] on hole 4 | mismatch | mismatch | not independently re-read |
| 01-2-7 | hole 26 section P-Q: upper 4.5 H7 step | 4.5 H7 (+0.012); read "4,5" with no 9 (compare 4.59 H7 on sh | d 4.596 z[2.85,3.35] | mismatch | mismatch | Agree. A lost digit in the scan cannot be excluded, hence unsure. |
| 01-2-22 | escape wheel upper endstone setting (settingCEU) flange in the 4.5 H7 step | 4.5 H7 (read; see the P-Q row) | outside d 4.59 over 0.5 (z -22.35..-21.85) | mismatch | mismatch | Agree, same figure. |
| 01-3-7 | hole 10 Schnecke (N15.292 E16.708) | drill 2.5, calibre 2.70 +-0.009 | d 2.82 at [16.708,15.292] through | mismatch | mismatch | same figure |
| 01-3-20 | hole 30 Ankerrad (S33.730 E5.028), table | drill 2.3, calibre 2.50 +-0.009; section G-H (sheet b) draws | 5.206 z[0,2.85], 4.596 z[2.85,3.35] at [5.028,-33.73]; no 2. | cant | n/a | Same as 01-1-17. Ankerrad is a lever-escapement name (the Wempe's escape wheel is Gangrad, hole 26), so hole 30 may be a leftover. |
| 01-3-29 | hole 56 Kontakt Schr. r. (S40.190 E5.000), "nur bei Bedarf" | drill 1.3, M1.7 | no hole at [5.0,-40.19] | not built | not built | same figure |
| 01-3-30 | hole 57 Kontakt Schr. l. (S38.184 W13.500), "nur bei Bedarf" | drill 1.3, M1.7 | no hole at [-13.5,-38.184] | not built | not built | same figure |
| 01-4-3 | hole 30 section G-H: 4.59 H7 step, land 0.5 -0.05, which face | 4.59 H7; land 0.5 -0.05 at the BOTTOM of the section; no "ob | d 4.596 z[2.85,3.35]: land at z=3.35 (oben); wide bore opens | mismatch | mismatch | Agree; certainty up from unsure: every section on 3a/3b is drawn the same way up (E-F recess and A-B counterbore both on top = z 3.35 as built). Top plate P-Q ( |
| 01-4-6 | hole 26: no recess drawn on the plan or in a section | 2.5 only | d 4.6 z[0,0.25] at [11.783,-21.743] | mismatch | mismatch | same figure |
| 01-2-26 | EXTRA top plate: 0.9 hole 4 countersink d 4.3 (and the 0.9..2.4 dimple cone) | none on sheet | d 0.9..2.4 z[2.4,2.8]; 2.4..4.3 z[2.8,3.35] | extra | extra | not independently re-read |
| 01-2-27 | EXTRA top plate: two blind 0.925 holes with countersinks 0.925..1.4, z[0,3.11] | not on the visible sheet (the right part of the plan is unde | at [30.6081,-19.922] and [38.4639,-12.554] | extra | extra | not independently re-read |
| 01-2-28 | EXTRA top plate: two r1.0 rounds at the crescent tips | tips drawn pointed, no radius dimensioned | d 2.0 outside arcs at [-40.2797,-9.9671] and [-31.2609,27.28 | extra | extra | not independently re-read |
| 01-4-17 | EXTRA pillar plate: 4.6 dia x 0.25 recess at hole 26 (for the endstone setting flange) | none on sheet | d 4.6 z[0,0.25] at [11.783,-21.743] | extra | extra | not independently re-read |
| 01-4-18 | EXTRA pillar plate: 1.0 dia notch (r0.5) at the rim, 6 o'clock | none on sheet | d 1.0 at [0,-42.4945], arc 179 deg, through | extra | extra | not independently re-read |

### Batch 2

Reader: 137 match, 10 mismatch, 3 not built, 0 extra, 15 can't tell. After the verifier: 137 match, 10 mismatch, 3 not built, 0 extra, 15 can't tell, 0 not applicable (reports: `batch02.md`, `verify02.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 08_4 | Unruhkloben unten 05 08 00-2 (rev. 2.12.46) | 24 | 21 | 0 | 0 | 0 | 3 |
| 05 08_5 | Unruhkloben oben 05 08 03-1 | 33 | 29 | 0 | 0 | 0 | 4 |
| 05 08_7 | Werkring 05 08 00-3 (rev. 6.12.46) | 25 | 20 | 0 | 0 | 0 | 5 |
| 05 08_8 | Schneckenfutter 05 08 01-2 | 19 | 17 | 1 | 1 | 0 | 0 |
| 05 08_9 | Staubfutter 05 08 01-3 | 17 | 13 | 3 | 1 | 0 | 0 |
| 05 08_11 | Pfeiler 05 08 00-1 | 13 | 8 | 4 | 1 | 0 | 0 |
| 05 08_13 | Federhausbrücke 05 08 05-1 | 21 | 18 | 1 | 0 | 0 | 2 |
| 05 08_14 | Sperrkegel 05 08 05-2 | 13 | 11 | 1 | 0 | 0 | 1 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 02-3-12 | '7 -0,1 (a)' vertical dimension (levels it spans unclear) | 7 -0.1 | candidate: rebate floor 10.35 to lip top 3.35 = 7.0 | cant | match | the three stacked dimensions sum to the overall 10.7, so 7 is the middle between lip top and rebate floor; built 7.00 |
| 02-4-10 | bore Ø4.1 +0.2 | 4.1 +0.2 (4.1..4.3) | 4.52 inside z 0..5.76 | mismatch | mismatch | built 0.22 over the upper limit |
| 02-4-19 | small edge breaks at the outer top and bottom corners | drawn, size not printed (about 0.1..0.15) | no edge cone on the outside (cones[0] is the taper) | not built | not built | not dimensioned; cannot size |
| 02-5-4 | flange thickness 3.1 -0.2 (arrows span the flange; measured 3.06) | 3.1 -0.2 (2.9..3.1) | 13.0..15.1 = 2.1 | mismatch | mismatch | built 1.0 thin; the flange underside should be near z 12.0 |
| 02-5-9 | body straight at Ø13.1 from the flange's underside down to the foot | straight, no neck | 45° step Ø13.0 to Ø10.5 at z 5.4..6.7, cylinders[2].d 10.5 n | mismatch | mismatch | the whole 6.3 mm of body under the flange is relieved in the build; the sheet shows none |
| 02-5-12 | (7.62) reference: bore at the top of the 20° cone | (7.62) | 7.7746 at z 16.3 | mismatch | mismatch | a reference size; the sheet's own 1:70 would give 7.77, so the sheet disagrees with itself |
| 02-5-16 | outer chamfer at the foot 0.5 | 0.5 | 12.4..13.0 z 0..0.3 (0.3 x 45°) | mismatch | match | enlarged foot: the 0.5 dimension does not reach the outer edge; built has the 0.5 flat and a 0.3 chamfer |
| 02-5-17 | small rounds at the flange's outer edges and the boss's top edge | drawn, not dimensioned (about 0.2) | none in the file | not built | not built | cannot size |
| 02-6-7 | taper angle 5° | 5° | 6.0 | mismatch | mismatch | taper 1.4 long: 4.5 - 2*1.4*tan5 = 4.26, so 5 deg and the end 4.3 -0.2 agree on the sheet |
| 02-6-8 | cylindrical part of the spigot 1.4 -0.2 (the taper is the rest) | 1.4 -0.2 | 22.4..24.1 = 1.7; cones[0].z 24.1..25.2 = 1.1 | mismatch | mismatch | built moves the step 0.3 |
| 02-6-10 | 90° countersink at each end of the hole | 90° | 45 | match | mismatch | only the 45 deg half angle agrees; the countersink is absent in size |
| 02-6-11 | countersink width at the face (scaled; not printed) | about Ø2.9 | 2.6..2.62 at the face | mismatch | mismatch | same finding as 02-6-10 |
| 02-6-12 | relief groove in the shoulder face around the spigot | oval groove r 2.5..3.5, depth about 0.4 | only a vertex at r 3.25 on the shoulder level, no groove in  | not built | not built | the groove is real on the sheet |
| 02-7-8 | countersink 0.3 deep, 90° on the pin holes | 0.3, 90° | 1.5825..2.1825 z 0..0.3, half angle 45 | match | cant | figure unclear on enlargement |
| 02-7-20 | straight edge's chord 73.5 (arrows parallel to the edge, from the upper arc corner to the lower tip) | 73.5 | projection of (-14.1814,40.0583)-(-27.7282,-32.2014) on the  | mismatch | mismatch | -0.18 against +-0.1; the sheet is over-dimensioned |
| 02-8-10 | overall length 17.4 (left corner to nose end) | 17.4 | 17.5301 (box x -9.2618..8.2683) | mismatch | mismatch | the sheet's 9.7, 7.5 and 1r give 17.5 if 7.5 is to the nose centre; if 7.5 reaches the nose tip they give about 17.4 |

### Batch 3

Reader: 62 match, 10 mismatch, 1 not built, 0 extra, 15 can't tell. After the verifier: 65 match, 7 mismatch, 0 not built, 0 extra, 16 can't tell, 0 not applicable (reports: `batch03.md`, `verify03.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 001 | Federchronometer (plan of both plates with their parts) | 7 | 5 | 0 | 0 | 0 | 2 |
| 05 08_2 | Oberplatte kompl. 05 08 01 (rev. 8.11.46) | 12 | 9 | 0 | 0 | 0 | 3 |
| 05 08_6 | Unruhkloben oben kompl. (U 30) | 22 | 18 | 2 | 0 | 0 | 2 |
| 05 08_10 | Zwischenbrücke kompl. 05 08 04 | 11 | 7 | 0 | 0 | 0 | 4 |
| 05 08_12 | Federhausbrücke kompl. 05 08 05 | 11 | 9 | 1 | 0 | 0 | 1 |
| 05 08_32.1 | Unterplatte kompl. (U 36, 23.10.41) | 4 | 4 | 0 | 0 | 0 | 0 |
| 05 08_32.2 | Unterplatte kompl. 05 08 02 (23.10.41) | 10 | 8 | 0 | 0 | 0 | 2 |
| 05 08_33 | Unruhkloben unten kompl. (U 31) | 11 | 5 | 4 | 0 | 0 | 2 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 03-1-7 | arbor and wheel centres of the train and escapement in plan | faint circles | placements.json origins (e.g. 050301-1 at (-9.1,0,12.11)) | cant | match | the reader's "not pickable to 1 mm" is too pessimistic: wheel circles are fitted to 0.2 mm |
| 03-3-9 | second round hole between foot and setting | Ø 2.7 at 9.53 mm from the axis | cylinders[2.8 inside] at (9.9997,-0.0001), z 12.4..15, arc 3 | mismatch | cant | the foot hole, the pin holes and this hole all read 0.3-0.6 mm short of the built values on the same scale (foot hole 32.6 against 33.0 built, third pin 23.7-24 |
| 03-3-13 | pin hole along the arm from the axis (5) | 5 printed; scaled 5.08 | circles r 0.5376 at (4.1,-4.2): x 4.1 | mismatch | mismatch | the extension line does end on the slit's right edge, which would mean 4.1 + 0.9 = 5.0, but the drawn geometry contradicts it: the pin is 5.1 mm from the axis a |
| 03-3-18 | jewel stack: two halves 1.4 + 1.4 (hatched blocks, split at 1.4 from the top) | 1.4 / 1.4 | settingCU size z 1.63, settingBU 1.17: split at 1.63 from th | mismatch | mismatch | the printed figures decide: 1.63 against 1.4 is 0.23, over the +-0.05 fallback. The scan alone could not reject 1.63 (hatch at 1.5 +-0.15), so the verdict rests |
| 03-3-19 | 0.5 at the arm underside (the setting body stands 0.5 below the arm; the lower rim is wider) | 0.5 below the arm | placements 050406-2.bu ymax -34.65 against the arm underside | mismatch | match | the reader took the 0.5 as setting standing 0.5 below the arm underside. In the section the collar is a boss under the arm with a 45 degree flare (6 to 7.6 over |
| 03-3-20 | setting lower rim Ø 6 (the 6; its extension lines on the setting's lower flange) | 6 | settingBU/CU cylinders[5.2 outside]: no Ø 6 flange; cock con | not built | match | the collar is built; Ø 6.0 at its bottom matches the printed 6. The reader looked for a flange on the setting |
| 03-4-4 | bush WN-300 seat 0.7 +0.02 below the top face | 0.7 +0.02 | placements WN-300.zb ymin 4.06 against bridge ymin 3.35: 0.7 | mismatch | cant | the bush sits at 0.71, inside 0.70-0.72. A 0.01 mm difference on a step is not resolvable at 2:1 and the dimension's attachment to the step or the bush is uncle |
| 03-5-7 | screw holes at the bridge ends (top and bottom) | Ø 3.4-3.5 scaled (about as big as 0.8 of the barrel hole) | barrelBridge cylinders[2.8 inside] at (-17.37,32.668),(-32.0 | mismatch | mismatch | with the arbor hole at the built 3.9 the end holes are 3.5 (3.3-3.7); by scale (6.65-7.3 px/mm) 3.4-3.7. Either way 0.5-0.9 over the built 2.8, which is beyond  |
| 03-8-2 | width in Ansicht A (19.75, from the tall block's left face to the arm end) | 19.75 | lowerCock size 20.0 x 17.2: foot 20.0 x 8.0, arm out to y -1 | mismatch | mismatch | the printed 19.75 and my plan measurement agree, and 17.2 is 2.5 mm short. The 20.0 foot length is a different direction (my reading of the foot's long axis is  |
| 03-8-4 | arm thickness (3.3 printed in C-D; scaled 3.17) | 3.3 | z_levels 6.78 -> 10.0 = 3.22 | mismatch | mismatch | delta 0.08 over the +-0.05 fallback, but the scan alone gives 3.26 +-0.1; the verdict rests on the printed 3.3 |
| 03-8-6 | jewel halves 1.4 + 1.4 (2.8 stack) | 1.4 / 1.4 | settingBL size z 1.53, settingCL 1.19 (2.72 together) | mismatch | mismatch | as 03-3-18 |
| 03-8-8 | 0.1 stack proud of the arm face at the other end | 0.1 | placements 050408-2.bl ymax -9.0 = cock top y -9.0: flush | mismatch | mismatch |  |

### Batch 4

Reader: 59 match, 13 mismatch, 0 not built, 0 extra, 14 can't tell. After the verifier: 61 match, 20 mismatch, 0 not built, 0 extra, 12 can't tell, 0 not applicable (reports: `batch04.md`, `verify04.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 05_1 | Laufwerk (the going train) | 16 | 10 | 4 | 0 | 0 | 2 |
| 05 05_2 | Sekundenrad kompl. 05 05 01 | 11 | 6 | 4 | 0 | 0 | 0 |
| 05 05_3 | Sekundenrad 05 05 01-1 | 13 | 10 | 0 | 0 | 0 | 2 |
| 05 05_4 | Sekundentrieb 05 05 01-2 (rev. 6.6.46) | 22 | 12 | 7 | 0 | 0 | 2 |
| 05 05_5 | Zwischenrad kompl. 05 05 02 | 8 | 5 | 1 | 0 | 0 | 2 |
| 05 05_6 | Zwischenrad 05 05 02-1 | 13 | 10 | 0 | 0 | 0 | 2 |
| 05 05_7 | Zwischentrieb 05 05 02-2 (rev. 6.6.46) | 14 | 8 | 4 | 0 | 0 | 2 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 04-1-3 | Oberplatte inner face to top face of Minutenrad (centre wheel) | 17 | 17.26 | mismatch | mismatch | scaled: 410 px at 24.1 px/mm = 17.0. 0.26 is over the fallback ±0.1 |
| 04-1-7 | Oberplatte thickness | 3.0 | 3.35 | mismatch | mismatch | the printed 3.0 against 3.35 is a mismatch. The drawn proportions (3.3 to 3.5) fit the built 3.35, so the label and the drawing disagree |
| 04-1-8 | Unterplatte thickness (label 3.0 beside a second dim 4; unclear) | 3.0 | 3.35 | mismatch | mismatch | the plate is drawn about 3.5 mm (700 to 790 px at 24 px/mm). Same note as above |
| 04-1-9 | Zwischenbruecke thickness | 4 | 3.8 | mismatch | mismatch | the bridge is drawn 190 px at 50 px/mm = 3.8 mm, i.e. the built value. Printed 4 against built 3.8 is -0.2 against ±0.05; the drawing's proportion disagrees wit |
| 04-1-13 | Seconds pivot standing proud of the Zifferblatt face | 0.5 (tiny figure) | 0.705 | cant | match | 0.5 against 0.7 is 0.2, the scan allows 0.3 (one pixel is 0.02 mm at this scale but the stroke is 5 to 8 px wide). The tip's position against the plate is confi |
| 04-1-14 | Centre arbor end below the Unterplatte: 3.1, 10.9, 12.9, 2 (diagonal dims) | 3.1 / 10.9 / 12.9 / 2 | - | cant | match | the arbor's own sheet is not in this batch. Note the built thread is 7.5 long (`cones[13]` z 29.76..37.22) and the layout's end spigot is drawn 2 long. Can't te |
| 04-2-5 | Lower pivot dia | 0.8 -0.02 (0.78..0.80) | 0.81 at shoulder | mismatch | mismatch | 0.81 is 0.01 over 0.80. The part sheet prints 0.82 -0.02 (0.80..0.82), which includes 0.81, so the sheets disagree with each other |
| 04-2-7 | Taper Kegel 1:90 (both pivots) | 1:90 | 1:90 / 1:83 | match | mismatch | the lower pivot's taper is `cones[6]` 0.7767..0.81 over 2.77 mm = 1:83. Both pivots carry 1:90 on the assembly (and on 05_4). 1:83 is a 7 % departure; the toler |
| 04-2-8 | Hub dia of the wheel (arrows each side of the wheel) | 6 | 6.4 | cant | mismatch | the assembly's 6 (general ±0.05) disagrees with its own part sheet's 6.3..6.5. Built follows the part sheet. Not "can't tell": the figure is clear |
| 04-4-1 | Upper pivot length, tip to collar top | 9.2 | 7.2 | mismatch | mismatch | assembly and layout say 7.2. See "The pivot lengths" |
| 04-4-10 | Seat under the leaves, dia | 2.6 n6 (+0.013/+0.006) | 2.6 | mismatch | mismatch | built 6 to 13 µm under the printed limits. ISO 286 n6 for 1..3 mm is +0.010/+0.004, so the printed values are not ISO's; I used the printed ones |
| 04-4-15 | Lower pivot length | 4.5 | 3.0 | mismatch | mismatch | assembly and layout say 3. The tip would stand 1.1 mm outside the Oberplatte |
| 04-4-18 | Upper tip form (pointed cone about 0.5 long, scaled) | pointed cone | flat 0.47 | mismatch | mismatch | the lower pivot on the sheet is also a pointed cone (0.82 base, about 0.4 long, 4.4 mm scaled). Built: a rounded dome (`cones[0..5]`). See 04-4-v2 |
| 04-5-4 | Pivot dia (both) | 0.82 -0.02 (0.80..0.82) | 0.825 | mismatch | mismatch | 0.005 over the limit. 05_7 prints 0.85 -0.05 (0.80..0.85), which includes 0.825, so the sheets disagree |
| 04-7-3 | Seat dia | 4.0 n6 (+0.008..+0.016) | 4.0 | mismatch | mismatch | built 8 to 16 µm under. ISO 286 n6 for 3..6 mm is +0.016/+0.008, the same as printed |
| 04-7-9 | Upper pivot length | 4.6 -0.2 | 2.95 | mismatch | mismatch | see "The pivot lengths" |
| 04-7-10 | Lower pivot length | 4.6 -0.2 | 2.95 | mismatch | mismatch | same |
| 04-2-v1 | tip forms of the seconds arbor | tip forms of the seconds arbor | both ends rounded (a dome), sure | (new) | mismatch |  |
| 04-4-v1 | upper tip: a pointed cone, base 0.65, about 0.46 long (scaled, likely) | upper tip: a pointed cone, base 0.65, about 0.46 long (scale |  | (new) | mismatch |  |
| 04-4-v2 | lower tip: a pointed cone, base 0.82, about 0.4 long (likely) | lower tip: a pointed cone, base 0.82, about 0.4 long (likely |  | (new) | mismatch |  |
| 04-7-v1 | both tips pointed cones (sure) | both tips pointed cones (sure) |  | (new) | mismatch |  |
| 04-4-v3 | `nicht eingetr. Toleranz ±0,1`: general tolerance on the 7, the 4,5 and others (sure) | `nicht eingetr. Toleranz ±0,1`: general tolerance on the 7,  |  | (new) | mismatch |  |

### Batch 5

Reader: 68 match, 15 mismatch, 0 not built, 0 extra, 16 can't tell. After the verifier: 70 match, 12 mismatch, 0 not built, 0 extra, 16 can't tell, 1 not applicable (reports: `batch05.md`, `verify05.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 05_8 | Minutenrad kompl. 05 05 03 (22.7.43) | 12 | 10 | 2 | 0 | 0 | 0 |
| 05 05_9 | Minutenrad 05 05 03-1 (25.8.46) | 11 | 9 | 0 | 0 | 0 | 2 |
| 05 05_10 | Minutentrieb 05 05 03-2 (rev. 7.6.46) | 21 | 15 | 5 | 0 | 0 | 1 |
| 05 05_11 | Gegensperrkegel kompl. 05 05 05 | 4 | 3 | 0 | 0 | 0 | 1 |
| 05 05_12 | Gegensperrkegel 05 05 05-1 (19.7.44) | 15 | 10 | 2 | 0 | 0 | 3 |
| 05 04_7.2 | Gangrad 05 04 08 bis 10 / 05 04 05-1 (19.7.43) | 10 | 8 | 0 | 0 | 0 | 2 |
| 05 04_8 | Gangtrieb Hz 05 04 05-2 (7.6.40) | 9 | 3 | 3 | 0 | 0 | 2 |
| 05 04_23 | Gangrad Zahnform 02 04 08 (20.1.42) | 17 | 12 | 0 | 0 | 0 | 5 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 05-1-7 | 14.3 (cannon overall length, foot to top) | 14.3 (sure) | 14.19 | mismatch | mismatch | 0.11 against a fallback 0.1; tolerance unreadable |
| 05-1-10 | Koerner groove "4 r" (notch both sides of the section at the groove) | notch both sides, radius figure illegible (unsure) | three cone dimples (cones d 1.26..1.55, 19.7 deg); no groove | cant | mismatch | the 4 r figure is legible; the section shows a half-round notch both sides at the 6.3 level; built has none in the y=0 section; not a can't tell. Likely |
| 05-3-6 | 5.4 n6 (collar, wheel seat; ISO n6 on 5.4: +0.016/+0.008) | 5.408..5.416 (likely) | 5.4 | mismatch | mismatch | n6 on 5.4 is +0.016/+0.008, built nominal; a press fit to the wheel's 5.4 H7 |
| 05-3-9 | 3.6 dia (rivet lip maximum diameter) | 3.6 (likely) | 3.2 | mismatch | mismatch | likely the riveted flare; the unriveted lip is not dimensioned |
| 05-3-14 | 16.7 -0.2 (top of cone C, z 23, to the upper tip) | 16.7 -0.2 (sure) | 14.3 above z 23.03 | mismatch | mismatch | but the later assembly (05 05_8) shows the arbor ending at the cannon's top, as built (section 3) |
| 05-3-15 | 39.65 -0.1 (shoulder to the upper tip) | 39.65 -0.1 (sure) | 37.33 | mismatch | mismatch | same |
| 05-3-18 | 5.1 -0.2 (lower pivot length, tip to the chamfer line) | 5.1 -0.2 (likely; assembly gives 3) | 3.0 | mismatch | mismatch | later assembly gives 3 (section 3) |
| 05-4-3 | plan hand: hub left, tip right, lower edge concave, thin step near the tip | hub left, tip right (sure) | mirrored in x relative to the sheet | mismatch | match | the sheet is drawn from the train side (section 1) |
| 05-5-6 | 9.645 (hole axis to the R9 centre line, vertical) | 9.645 (sure) | 9.781 | mismatch | mismatch | +0.136 over +-0.1 |
| 05-5-7 | 6.273 (hole axis to the R9 centre, horizontal) | 6.273 (sure) | 6.033 | mismatch | mismatch | the figure is inconsistent with the drawing's scale and with R9 through the tip and the 2.6 end height (which gives about 6.07); the model sits near the geometr |
| 05-5-15 | hand of the part (plan and notch side) | tip right, concave edge below, thin zone at the tip, notch o | mirror image about the vertical axis (hub at +x) | mismatch | match | train-side view; section 1; thin zone placement agrees |
| 05-6-7 | 1.8 dia H7/h6 (wheel bore on the collet spigot; table says 1.7, H7 +0.009, h6 -0.007) | 1.8 H7/h6 by the label (likely); table 1.7 | 1.808 / 1.797 | match | cant | two figures on the sheet; model follows 1.8; section 4 |
| 05-7-4 | 5 -0.2 (pinion length) | 4.8..5.0 (sure) | 4.0 | mismatch | n/a | assembly 19.7.43 is later, model follows it (section 2) |
| 05-7-5 | 6.5 -0.2 (upper tip to the pinion top) | 6.3..6.5 (sure) | 5.3 | mismatch | mismatch |  |
| 05-7-6 | 26.5 -0.2 (overall) | 26.3..26.5 (sure) | 22.78 | mismatch | mismatch |  |
| 05-7-7 | 1.6 -0.2 (arbor above and below the pinion) | 1.4..1.6 (sure) | 1.2 | mismatch | mismatch | assembly scales 1.1-1.2 |
| 05-8-12 | hand of the teeth (face and overhanging tip on the clockwise side as drawn) | face on the clockwise side, tip leaning clockwise (likely; t | mirror image of the drawing if both are seen from the same f | mismatch | match | train-side view, correct for the train (section 1) |

### Batch 6

Reader: 81 match, 8 mismatch, 1 not built, 3 extra, 14 can't tell. After the verifier: 105 match, 8 mismatch, 0 not built, 2 extra, 12 can't tell, 3 not applicable (reports: `batch06.md`, `verify06.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 04_1 | Hemmung für Feder-Chronometer, Kaliber 020 (3.2.40) | 33 | 22 | 5 | 0 | 0 | 2 |
| 05 04_2 | Goldfeder 05 04 01-2 (16.9.42) | 10 | 8 | 1 | 0 | 0 | 1 |
| 05 04_3 | Gangfederkloben 05 04 01-4 (8.7.43) | 36 | 32 | 1 | 0 | 1 | 1 |
| 51 04_6 | Heberolle 02 04 02 (11.2.41) | 20 | 15 | 0 | 0 | 1 | 4 |
| 05 04_10.1 | Gangfeder, Rud. Grießbach 1436 (17.2.43), sheet 1 | 30 | 26 | 1 | 0 | 0 | 3 |
| 05 04_10.2 | Gangfeder, Rud. Grießbach 1436 (17.2.43), sheet 2 | 3 | 2 | 0 | 0 | 0 | 1 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 06-1-7 | escape wheel centre to M1.7 clamp-hole centre (v. Gangradmitte) | 23.8 | 23.41 | mismatch | mismatch | confirmed: more than 0.1 (fallback for 6-30 mm). No later part sheet gives E to M1.7 or the wheel's place (05 04_2, _3, _10 give block and detent sizes only), s |
| 06-1-12 | escape wheel centre along the detent from the pipe (drawn directly under the pipe) | 0 (+-0.1, scaled) | +0.447 | mismatch | mismatch | the dimension chain closes: 18.8 along and 14.6 across (7.49 + 7.12) gives sqrt = 23.75 = the printed 23.8; with the built offset it gives 23.41. So the 23.8 mi |
| 06-1-13 | angle at the pipe between detent axis and the balance-to-wheel line | 53.6 deg (scaled +-1) | 49.4 deg | mismatch | mismatch | same rotation of the detent about the pipe (3.6-4°) as the wheel offset above; the B-E-pipe triangle itself matches (98.1° vs 98.0° at the pipe) |
| 06-1-14 | angle labelled 15 deg near the foot/centre line (what it attaches to is unclear) | 15 deg | 15.8 deg | cant | mismatch | the number fits the drawn line, which the reader hadn't tried; fallback +-30' |
| 06-1-15 | gold spring: bend point (Biegungspunkt der Goldfeder), distance from the spring end | about 6.3 (scaled) | 4.43 | mismatch | mismatch | no later sheet: 05 04_2 draws the blank straight. The layout's spring leaves its straight run at 6.2 from the end and runs on bowed to the tip: 15.4 total |
| 06-1-17 | stud/screw circle (d1.3 hole with cone point) from the M1.7 centre along the block | about 3.8 (scaled +-0.15) | 4.50 | mismatch | n/a | the layout is the earlier sheet; the built follows the later |
| 06-1-19 | detent steady pins spacing (two pins either side of the stud) | about 4.0 (scaled +-0.15) | 4.20 | cant | match | nothing printed |
| 06-1-20 | block plan: 45 deg chamfer about 3.8 x 3.8 at the corner far from the foot (arm side) | 3.8 x 3.8 (scaled) | none | not built | n/a | the layout is 3.2.40, the block sheet 8.7.43 |
| 06-1-25 | arm thickness in the layout section (2.8, centre 1.4) | 2.8 | 3.0 | mismatch | n/a |  |
| 06-1-27 | escape wheel tooth count and tooth form | no count printed (24 deg label unclear) | 15 | cant | match | the printed "24°" is the same pitch |
| 06-2-9 | blank drawn straight; the built spring is bent in plan (BSPLINE, sag 0.9) | straight | bent | extra | mismatch |  |
| 06-3-13 | M1.2 hole across the arm thickness (centred, scaled +-0.06) | centre of the 3 (z 5.0) | 5.15 | mismatch | mismatch | general tolerance +-0.1 |
| 06-3-28 | two d0.45 blind holes 1.6 deep in the foot face at x 16.63 and 20.83 (steady pins) | not on this sheet | present | extra | extra |  |
| 06-4-15 | cut centre distance 5.927 from the axis (not printed) | not printed | 5.927 | extra | - |  |
| 06-5-4 | tail width at the tip | 0.25 (0.22) (top callout) | 0.054 | mismatch | mismatch | the callout attaches to the straight blank's two edges, not to the built tip. The built tail tapers along its length to a sliver; the sheet does not draw a tape |
| 06-5-23 | hand: sheet plan equals the part plan seen from +Z; layout and sheet 3 equal it seen from -Z (tail toward the balance in | - | - | cant | match | pipe at the side the sheet's right view puts it, wide side where the world puts it |

### Batch 7

Reader: 61 match, 15 mismatch, 5 not built, 0 extra, 10 can't tell. After the verifier: 60 match, 15 mismatch, 4 not built, 0 extra, 16 can't tell, 0 not applicable (reports: `batch07.md`, `verify07.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 04_4 | Unruhwelle kompl. 05 04 02 | 25 | 17 | 2 | 0 | 0 | 4 |
| 05 04_5 | Unruhwelle 05 04 01-1 (4.4.41) | 9 | 3 | 4 | 1 | 0 | 1 |
| 05 03_3.2 | Unruhwelle 05 04 01 (12.3.65) | 23 | 11 | 7 | 1 | 0 | 3 |
| 05 03_1 | Unruh kompl. (U 09, 20.5.41) | 10 | 5 | 0 | 0 | 0 | 5 |
| 05 03_2 | Unruh (kompl.) 05 03 01 (23.6.41) | 13 | 9 | 1 | 0 | 0 | 2 |
| 05 03_4 | Unruhreifen 05 03 01-1 (31.7.41) | 21 | 15 | 1 | 2 | 0 | 1 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 07-1-2 | top pivot Ø where the cone starts (1,11 Ø, no tolerance: ±0.05) | 1.11 (sure on the figure; which place it attaches to: unsure | 1.05 | mismatch | cant | the reader pinned 1.11 to "where the cone starts". A 1:30 taper from 1.2 gives 1.11 at 2.7 mm from the shoulder; the sheet draws it ~12 mm up on a cut figure. N |
| 07-1-4 | shaft Ø at the hub end of the taper (1,65 s6: +0.015..+0.022 -> 1.665..1.672) | 1.65 s6 (sure) | 1.6514 | mismatch | mismatch | 1.6514 is 0.013 under the printed lower limit, 0.013 under the ISO one as well. The sheet's own taper also does not reach 1.665: 1.58 + 4.5/70 = 1.64 |
| 07-1-16 | 14,03 -0,06: hub top face to the lower pivot tip | 14.03 -0.06 (sure) | 12.59 | mismatch | mismatch | superseded: 3.2 (1965) says 12.6 -0.02, model follows it. The 1941-era lower end is 1.44 longer |
| 07-1-21 | lower pivot Ø at the cone start (1,11) | 1.11 (sure on figure) | 1.16 | match | cant | the 1:70 pivot taper runs 1.2 to 1.11 over ~6.3 mm on the sheet; the model has 1.2 at -15.43 and 1.16 at -12.61 (2.8 mm), so it is thicker at the tip end |
| 07-1-22 | top pivot length, shoulder to tip (not dimensioned; scaled 7.5 ±0.3) | 7.5 scaled (unsure) | 6.9 | mismatch | cant | the reader's 7.5 was read from a figure that is cut off. 3.2 gives 6.9 and the model has 6.9 |
| 07-2-2 | collar above the flange Ø (2,1 ±0,03 -> 2.07..2.13) | 2.1 ±0.03 (likely) | 2.0 | mismatch | mismatch |  |
| 07-2-3 | length of that collar above the flange (1,3) | 1.3 (likely) | 1.1 | mismatch | mismatch |  |
| 07-2-5 | 4,7 -0,05 (framed): flange top to the sleeve end | 4.7 (sure) | 4.1 | mismatch | mismatch | superseded: 4_4 and 3.2 both say 4.1 |
| 07-2-7 | 14 ±0,03 (framed): flange top to the lower tip | 14 (sure) | 12.59 | mismatch | mismatch | superseded by 3.2 (12.6) |
| 07-2-8 | 10 deg taper on the flange edge | 10 deg (sure) | 0 deg | not built | not built | 3.2 (1965) also draws the flange as a trapezoid, so this is not only the 1941 form; 4_4 draws vertical walls |
| 07-3-1 | upper pivot Ø at its shoulder (1,25 -0,02 -> 1.23..1.25) | 1.25 -0.02 (likely) | 1.2 | mismatch | mismatch | larger mismatch at that height |
| 07-3-3 | collar above the hub Ø (2,40 or 2,10, -0,02; digit unsure) | 2.40 or 2.10 (unsure) | 2.0 | mismatch | mismatch | 2.10 -0.02 = 2.08..2.10; -0.08 |
| 07-3-5 | lower 1,65 collar length (1,6) | 1.6 (likely) | 1.5 | mismatch | mismatch | 1.6 = 5.7 - 4.1, consistent |
| 07-3-6 | 5,7: hub top face to the end of the collar | 5.7 (likely) | 5.6 | mismatch | mismatch |  |
| 07-3-10 | lower pivot length, collar end to tip (6,9) | 6.9 (likely) | 6.99 | mismatch | mismatch | the split is wrong, the sum 12.6 is right |
| 07-3-13 | lower pivot shaft Ø (1,25 -0,02) | 1.25 -0.02 (likely) | 1.2155 | mismatch | mismatch | -0.0145 under 1.23 |
| 07-3-14 | lower collar Ø (1,65 -0,02 -> 1.63..1.65) | 1.65 -0.02 (likely) | 1.6685 | mismatch | mismatch | +0.0185 over 1.65 |
| 07-3-19 | 10 deg taper on the hub flange (drawn as a trapezoid, wide at the top) | about 10 deg (likely) | 0 deg | not built | not built |  |
| 07-4-3 | 10 deg taper at the hub flange (section) | 10 deg (likely) | 0 deg | not built | cant | withdraw "not built". Whether 10 mm fits the stack: top plate 050302-1 is 9.97 thick in y (-34.46..-24.49), so plausible (unsure which part it spans) |
| 07-5-5 | timing screw head Ø (scaled 1.6) and its place (r 13.7) | 1.6 at r 13.7 (scaled) | 1.65 at 13.95 | match | cant | I measure the head 0.6 mm wider than the model's; the scan is too coarse at 5:1 to call it |
| 07-5-11 | 39 (unclear: angle or length) | 39 (sure on the figure) | - | cant | mismatch | an angle is ruled out; as a diameter the sheet and model differ by ~1.2 mm, more than the scale error (1 %) |
| 07-6-2 | layer boundary Ø (31,29 -0,04): nickel steel against brass | 31.29 -0.04 (sure) | - | not built | not built | the outline does not change: the boundary is two materials in one wall (inside 30.48..31.29, outside 31.29..32.32, 0.405 and 0.515 mm). It is a matter of how th |
| 07-6-10 | 1,8 H7 +0,009 and 0,4: the hole's top form (countersink or counterbore; which hole is unsure; the plan shows a ring roun | 1.8 H7, 0.4 deep (unsure) | 1.8 x 0.4, countersink | cant | mismatch | a countersink is built at both holes; the sheet has a cylindrical 1.8 x 0.4 counterbore at one. Depth and diameter equal; shape wrong. Certainty likely: the cut |
| 07-6-17 | 8 Koerner in 60 Teilung (eight punch marks, 60 divisions) | 8 marks (sure) | 0 | not built | not built | the model has none |

### Batch 8

Reader: 37 match, 8 mismatch, 2 not built, 0 extra, 10 can't tell. After the verifier: 43 match, 9 mismatch, 4 not built, 0 extra, 7 can't tell, 0 not applicable (reports: `batch08.md`, `verify08.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 51 03_5 | Spiralfeder kompl. (29.10.41) | 11 | 5 | 4 | 0 | 0 | 2 |
| 05 03_6 | Spiralfeder 05 03 02-1 (26.6.41) | 8 | 6 | 1 | 0 | 0 | 1 |
| 05 03_7 | Spiralkurve (6.5.41) | 5 | 3 | 0 | 0 | 0 | 2 |
| 05 03_8 | Spiralrolle 05 03 02-2 (24.2.43) | 18 | 12 | 3 | 2 | 0 | 1 |
| 05 03_9 | Klötzchen 05 03 02-3 (6.6.41) | 22 | 17 | 1 | 2 | 0 | 1 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 08-1-2 | stud arm inner face to top of spring (3.15) | 3.15 (extension line at the terminal curve top) | 2.89 | mismatch | mismatch | the same dotted level is where 9.5 starts |
| 08-1-3 | collet face to the spring face nearest it (0.75) | 0.75 | 0.49 | mismatch | mismatch | as above |
| 08-1-4 | spring height overall (9.5 = 13.4 - 3.15 - 0.75) | 9.5 | 9.97 | mismatch | mismatch | but see v1: the pitch cause is firm; the reader's derivation 13.4-3.15-0.75 is also exactly what the sheet's three dimensions say |
| 08-1-7 | stud hole position from the balance axis (scaled 4.1, 4.2 across, 5.87 radial) | (4.1, 4.2) from axis by scale +-0.1 | (4.1,4.2) in own frame | cant | match | the radial distance agrees within 0.03; the direction depends on how the plan is turned, not fixed by the sheet's view side |
| 08-1-9 | pins 24 (two) holding the spring ends: size and shape (no sheet for item 24 in this batch) | thin vertical dashed pair in each hole | 0.26 x 0.73 section, 3.6 long (c); 0.26 x 0.68, 2.7 long (s) | cant | match | the lengths agree (2.7 vs 2.69; 3.5 vs 3.61) and the heights (0.6 vs 0.68; the pin is a flat section); the pin's own sheet is missing |
| 08-2-5 | coil pitch (0.52 strip + 0.21 gap) | 0.73 (0.52+0.21; 15 turns in 11.5 high) | 0.8003 (gap 0.280) | mismatch | mismatch | three independent readings give 0.73-0.74, none 0.80 |
| 08-2-6 | turns of the raw spring: 15 left, 11.5 high (before the curve is bent, see sheet 7) | 15 turns, 11.5 | 12 turns, 9.97 high | cant | match | the raw 15 is the blank (603 mm long), but 13 turns less 3.5 mm (sheet 7) = 12 helix + the curve; built has 12 crossed |
| 08-3-4 | end of the curve at the pin: r 3.37 inner edge (centre ~3.5) | 3.37 / ~3.5 | 3.5-4.1 | cant | match | I read the page's ray scan at 15 deg steps from its PNG, see below |
| 08-4-5 | bore 1.6 H7 +0.009 | 1.6..1.609 | 1.6029 | match | mismatch | the reader matched 1.6029 at z=0 to 1.6 H7, but z=0 is the face away from the cross hole: that end is the sheet's 1.55 end. The taper runs the right way (large  |
| 08-4-7 | bore diameter at the other face (1.55), bracketed reference | (1.55): 1.6 H7 at one face, 1.55 at the other (1:70 = 0.047  | 1.65 | mismatch | mismatch | the reader took 1.65 (z=3.3) against 1.55; the 1.55 is at z=0, where the built bore is 1.6029. Mismatch stands at +0.05 (a bracketed reference size) |
| 08-4-10 | cross hole axis from bore axis 3.5 -0.02 (arrow to the hole centre) | 3.48..3.5 | 3.578 | mismatch | match | the reader used the entry point; the plan in the PNG shows the hole's edge line leaning 3.5 deg, perpendicular to the edge, which also is the sheet's 90 deg |
| 08-4-11 | cross hole diameter 0.8 +0.01 at the entry, (0.77) at the other, Kegel 1:90, drilled 0.7 | 0.8..0.81 tapering to 0.77 | 0.805 straight | mismatch | mismatch | the taper over the hole's 2.7-3.1 mm length is 0.03 as drawn (1:90) |
| 08-4-14 | Koerner anbringen (centre-punch mark at the hole) | a punch mark where the hole goes | none | not built | not built | a punch mark; no timing effect |
| 08-5-13 | spring hole distance from the leg end (scaled off the side view, no printed dimension; hole drilled at assembly) | about 0.68 centre to end | 1.35 | mismatch | mismatch | the built hole is where the page's strip passes (the strip's centre at 3.15 from the arm's inner face); the drawn hole is 0.66 nearer the end |
| 08-5-15 | point rounded (a 0.8 mark at the tip; Phi or R illegible) | small rounding at the tip | sharp point | not built | not built | raised to likely: the arc is plain on the crop |
| 08-5-18 | plan end dims 1.2 -0.1 and 1.6 -0.2 (attachment unclear) | 1.2 -0.1; 1.6 -0.2 |  | cant | match | the dimensions attach to the centre line, so the reader's "attachment unclear" was resolvable |
| 08-1-v1 | the three heights are one chain: 3.15 + 9.5 + 0.75 = 13.4, and the built chain 2.89 + 9.97 + 0.49 = 13.35 | the three heights are one chain: 3.15 + 9.5 + 0.75 = 13.4, a | by the pitch cause: built 0.80 against 0.73-0.74 | (new) | mismatch |  |
| 08-4-v2 | "0.7 bohren": the hole is drilled 0.7 first, then 0.8 phi +0.01 with the Kegel 1:90 | "0.7 bohren": the hole is drilled 0.7 first, then 0.8 phi +0 |  | (new) | not built |  |
| 08-5-v2 | 3.1 -0.2 and the V's opening: the notch (V cut) apex also rounds (small radius at the apex) | 3.1 -0.2 and the V's opening: the notch (V cut) apex also ro | the V's inner end drawn rounded (enlarged) | (new) | not built |  |

### Batch 9

Reader: 43 match, 5 mismatch, 0 not built, 0 extra, 17 can't tell. After the verifier: 45 match, 4 mismatch, 0 not built, 0 extra, 16 can't tell, 0 not applicable (reports: `batch09.md`, `verify09.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 06_1 | Schnecke kompl. (U 21, 15.3.41) | 4 | 2 | 0 | 0 | 0 | 2 |
| 05 06_2.2 | Schneckenkörper 05 06 04-2 (rev. 27.2.48) | 23 | 15 | 1 | 0 | 0 | 7 |
| 05 06_3.1 | Schnecke (U 17, 24.7.41) | 3 | 1 | 0 | 0 | 0 | 2 |
| 05 06_3.2 | Schnecke 05 06 04 (24.7.41) | 4 | 4 | 0 | 0 | 0 | 0 |
| 51 06_4 | Schnecke Teilansicht 05 06 (8.4.41) | 6 | 4 | 0 | 0 | 0 | 2 |
| 05 06_15 | Schneckenwelle 05 06 04-1 (29.11.40) | 12 | 9 | 3 | 0 | 0 | 0 |
| 05 06_16 | Schneckensperrrad 05 06 04-3 (rev. 6.8.47) | 9 | 8 | 0 | 0 | 0 | 1 |
| 05 06_20 | Schneckenkurve / Kraftverlauf (Herb. Müller, 24.7.41) | 4 | 2 | 0 | 0 | 0 | 2 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 09-2-3 | 45 deg chamfer from recess to face; chamfer outer dia | 29.8 +0.2 (dia) at 45 deg | 29.4 | mismatch | mismatch | -0.4 under 29.8 (limits 29.8-30.0). Also built has a 0.95 straight wall where the drawing shows none (likely, scan). Note the sheet disagrees with itself: 45° f |
| 09-2-5 | overall length face to end of 21 dia boss | 12.6 -0.1 | 12.35 | mismatch | cant | The 12.6 is a stale figure that was never updated, so "mismatch 0.25" is the wrong call. Against the newest figure, 12.35 is 0.05 over the 12.3 limit: report as |
| 09-4-2 | large flange and recess dia (a) | 35.6; 33 +0.1 read here | 33.0..35.6 | cant | match | the 5° and 33 are both on the sheet and both built |
| 09-4-3 | 13.7 (a) dimension | 13.7 (a) | - | cant | match | resolvable |
| 09-6-1 | overall length | 60.6 -0.2 | 58.125 | mismatch | mismatch | -2.475. The lathe-centre explanation fails: the line goes to the pointed pivot end. Check: 60.6 - 19.7 - 28.3 = 12.6 from the 4.38 shoulder to the left tip; bui |
| 09-6-3 | left pivot length, tip to the 2.7 shoulder (60.6 - 19.7 - 28.3 - 6.5) | about 6.1 (derived; scaled about 6.6) | 3.625 | mismatch | mismatch | -1.4 to -3.0 depending on the reading; the 2.5 (reader) is the derived one. Direction certain, size not |
| 09-6-10 | right pivot section: 3.17 +0.023/+0.015 tapering 1:100 to 2.92 at the tip, 20.3 long | 3.17 to 2.92 | 4.41..4.16 | mismatch | mismatch | reader's +1.24 is a corner-versus-flat error. Real difference is -0.07 at the shoulder (likely; the corners may be broken, so the flat may be a little larger th |

### Batch 10

Reader: 61 match, 6 mismatch, 1 not built, 2 extra, 10 can't tell. After the verifier: 60 match, 6 mismatch, 1 not built, 2 extra, 11 can't tell, 0 not applicable (reports: `batch10.md`, `verify10.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 06_5 | Staubplatte 05 06 00-1 | 10 | 9 | 0 | 0 | 0 | 1 |
| 05 06_6 | Vorreiber 05 06 00-2 | 16 | 11 | 3 | 0 | 1 | 1 |
| 05 06_7 | Schneckenrad 05 06 00-3 | 25 | 18 | 2 | 1 | 0 | 4 |
| 05 06_8 | Deckplatte 05 06 00-4 | 10 | 9 | 0 | 0 | 1 | 0 |
| 05 06_9 | Gegenfeder kompl. (U 18) | 6 | 2 | 1 | 0 | 0 | 3 |
| 05 06_10 | Gegenfeder 05 06 01-1 | 13 | 11 | 0 | 0 | 0 | 2 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 10-2-1 | overall length | 3.1 -0.2 (2.9-3.1) | 2.76 | mismatch | mismatch | boss end to flange face is the dimension; 0.34 short of nominal, 0.14 under the low limit |
| 10-2-2 | flange thickness incl 0.3 chamfer (scaled 1.16) | 1.2 -0.2 (1.0-1.2) | 0.86 | mismatch | mismatch | the flange is 1.2 thick on the sheet, with its 0.3 chamfer inside it; built 0.86. The 0.34 lost in the flange is the same 0.34 lost in 10-2-1, so the flange is  |
| 10-2-11 | cross hole dia | 0.8 (width scaled 0.78) | 1.15 | mismatch | mismatch | the dimension is clearly a diameter next to the hole symbol |
| 10-2-14 | pin 050600-5 on this sheet | not drawn here | 1.16 x 8.3 pin for a 0.8 drawn hole | extra | extra |  |
| 10-3-7 | rim outer dia in section (leader 'gedreht 41,1') | 40.65 -0.05 (40.60-40.65); unsure | 40.569 | mismatch | mismatch | The leader says the rim is turned at 41.1 before the teeth are cut, and the table gives D 40.57 rolled. So the sheet disagrees with itself by 0.08 (the tip circ |
| 10-3-14 | hub shoulder below ring top | 0.4 -0.05 | 0.4 | match | cant | accepted by the reader on one reading; I could not confirm it |
| 10-3-17 | bore dia (section 3.95, plan circle 4.04) | 4 dia +0.1 | 4.55 | mismatch | mismatch | What is in it: fuseeArbor section, r 2.25 at z -8.725 narrowing to r 2.19 at -0.025, so d 4.38-4.50 over the wheel's z -7.385..-2.385 (and the Vorreiber's 4.4 H |
| 10-3-24 | 'Kante leicht brechen' on boss top edge | edge break, no size | sharp corner | not built | not built | no size, minor |
| 10-4-9 | screw WN-20 (w20) | not drawn; M 1:1 view shows the plate only | fits the 3.1 countersink and 1.8 hole | extra | - |  |
| 10-5-4 | two pins 71: dia 1.25, 2.5 long, one 1.2 out of each face | 1.25 dia (unsure), 2.5 long | 1.16 x 2.48, one out each face | mismatch | mismatch | pin 71 is 2.5 long, 1.3 inside the strip and 1.2 outside: built 2.48 with one end flush with each face and 1.18-1.2 out the other, checked from the world box (y |

### Batch 11

Reader: 73 match, 5 mismatch, 0 not built, 0 extra, 17 can't tell. After the verifier: 79 match, 3 mismatch, 0 not built, 0 extra, 17 can't tell, 0 not applicable (reports: `batch11.md`, `verify11.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 06_11 | Gegensperrrad kompl. 05 06 02 | 7 | 6 | 0 | 0 | 0 | 1 |
| 05 06_12 | Gegensperrrad 05 06 02-1 | 20 | 19 | 0 | 0 | 0 | 1 |
| 05 06_13 | Sperrfeder 05 06 02-2 | 15 | 10 | 1 | 0 | 0 | 3 |
| 05 06_14 | Sperrkegel 05 06 02-3 | 13 | 13 | 0 | 0 | 0 | 0 |
| 05 07_11 | Schneckenband 05 07 03 (1.3.43) | 7 | 3 | 0 | 0 | 0 | 3 |
| 05 07_12 | Schneckenhaken rund 05 07 03-2 (18.3.43) | 14 | 9 | 2 | 0 | 0 | 3 |
| 05 07_13 | Bandhaken f. Trommel 05 07 03-3 (9.6.44) | 13 | 11 | 0 | 0 | 0 | 2 |
| 05 07_14 | Kette 05 07 04 (16.7.41) | 12 | 8 | 0 | 0 | 0 | 4 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 11-2-6 | 5 deg wedge at 12 o'clock by the tooth sample | 5 deg, what it spans is unclear | 5.6 deg | cant | match | the 5.6 against 5 is within the scan's accuracy (a few tenths of a degree at 2:1 cannot be told); the lean direction agrees |
| 11-3-8 | R12.0 on the hole arm (outer face) | 12.0 | 12.017 | match | cant | If the dimension is to the inner face the built is 0.38 small (past the +-0.1). Against that, the strip lies in the ratchet's recess (R12.225): with the inner f |
| 11-4-9 | Boss round the pivot, dia 3 (the outer thin circle) | 3 +-0.05 | 3.054 | mismatch | match | The arc's two ends are (-0.4,-1.45) and (0.7532,-1.2972), 1.504 and 1.500 from the pivot (0,0), and its lowest point is y -1.5009: the boss is R1.50 about the p |
| 11-6-8 | Notch flank 30 deg to the tongue edge | 30 | 31.7 deg | mismatch | mismatch | The sheet over-dimensions it: the two R0.4 circles with centres 1.25 across and 0.5 along, joined by an internal tangent, give atan(1.25/0.5) - asin(0.8/1.346)  |
| 11-6-9 | Body arc R6, centre 3.55 across and 2.8 along (printed) | R6, (3.55, 2.8); sure (figures) | R5.93, (3.47, 1.70) | mismatch | mismatch | the figure 2.8 does not match the drawn dot (1.7); the built follows the dot. It is also 0.085 short of 3.55 across and 0.07 short of R6, both past +-0.05 |
| 11-7-3 | Slot tilt 10 deg to the straight edge | 10 (scaled 10.6-13) | 5.3 deg | mismatch | match | The built plan is the sheet's rotated 5 deg. The sheet's cap offsets are 1.0 across and 0.3 along (the "1,0" and "0,3"); the built caps differ by (0.38, 0.97),  |
| 11-8-7 | Pin dia (Praez. Rundstahl 0.6; no finished pin size) | 0.6 | 0.54-0.56 | mismatch | match | The 0.55 was missed: two horizontal lines tangent to a pin, 46 px apart where the 2.05 pitch is 173 px, i.e. 0.55. The built 0.55 (hook-end pin 0.559) is inside |
| 11-8-8 | Plates per layer and layer count (riveted loose) | layered stack in the side view | 3 layers | cant | match | the side view shows three strips and the page three layers (-0.4..-0.14, -0.13..0.13, 0.14..0.4) |
| 11-3-v1 | The long arm is one arc about the ratchet axis (the 10,4r, from the kink to its end at 7 deg above the horizontal) | The long arm is one arc about the ratchet axis (the 10,4r, f | the arm's inner and outer edges are at constant radius to wi | (new) | mismatch |  |

### Batch 12

Reader: 69 match, 23 mismatch, 3 not built, 0 extra, 11 can't tell. After the verifier: 74 match, 21 mismatch, 3 not built, 0 extra, 14 can't tell, 1 not applicable (reports: `batch12.md`, `verify12.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 07_1 | Federhaus kompl. (U 24, 13.4.41) | 24 | 15 | 3 | 0 | 0 | 5 |
| 05 07_3 | Sperrrad (rev. 14.11.47) | 11 | 7 | 2 | 0 | 0 | 2 |
| 05 07_4 | Federhaus mit Deckel 05 07 01 (2.8.44, rev. 20.4.48) | 9 | 7 | 0 | 0 | 0 | 2 |
| 05 07_5 | Federhausrohling R 05 07 01-1 (29.8.44, rev. 20.4.48) | 5 | 5 | 0 | 0 | 0 | 0 |
| 51 07_6 | Federhaustrommel 05 07 01-1 (28.2.41) | 18 | 16 | 2 | 0 | 0 | 0 |
| 05 07_7 | Federhausdeckel 05 07 01-2 (rev. 20.4.48) | 16 | 12 | 2 | 0 | 0 | 2 |
| 05 07_8 | Federkern kompl. 05 07 02 (28.1.43) | 8 | 4 | 3 | 0 | 0 | 1 |
| 05 07_9 | Federkern 02 07 04-1 (4.7.41) | 19 | 8 | 9 | 0 | 0 | 2 |
| 05 07_10 | Federhausring 02 07 01-3 (7.4.41): the 1941 barrel ring, superseded by the drawn drum 05 07 01-1 (batch 12 found no built part it draws) | 3 | 0 | 0 | 3 | 0 | 0 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 12-1-6 | spring space between floor and lid, "Zugfeder 15 / 15,8+-0,1" | 15.8 +-0.1 (1941 sheet) | 15.63 | mismatch | n/a | 01 is 1941 (floor 1.2, lid 1). 1948 06/07 give 18.1 - 1.25 - 1.3 = 15.55 (seat 1.2 deep: 15.65), so the built 15.63 follows the later sheets. Ledger should say  |
| 12-1-11 | arbor body (with chamfers) length "12" | 12 | 11.58 | mismatch | mismatch | but see the later-sheet finding above |
| 12-1-13 | lid outer face to arbor body "2,9" | 2.9 | 3.35 | mismatch | mismatch | same cause as 12-1-11; the 1948 lid boss 3.3 + gap 0.05 gives 3.35 |
| 12-1-18 | hook on the arbor (05 07 02-2) at 15 deg to the square's flat normal (end view) | 15 deg | hole axis along the square diagonal = 45 deg to a flat norma | mismatch | mismatch | 15 or 30 deg, never 45 |
| 12-2-7 | square hole 2.7 H7 (+0.009), taper 1:100 | 2.700..2.709, taper 1:100 | 2.6975 at the large end; taper 1:100 | mismatch | mismatch | 2.5 micron under the lower limit at the large end: a miss on the printed fit, of no consequence; the arbor's square is 2.700 +-0.002 |
| 12-2-8 | square orientation to the tooth tip: tip on the axis, along a flat normal | 0 deg | 9.9 or 12.6 deg off a flat normal | mismatch | mismatch | no tip lies on a flat normal; the nearest is 9.87 deg away. Tooth pitch 22.5 x 4 = 90, so every tip has the same offset |
| 12-2-9 | tooth hand as assembled (teeth face the set-up click) | sheet view side not fixable; its face root is CCW of the tip | the click locks CCW rotation and rides the ramp CW: the teet | cant | match | see below |
| 12-5-2 | lid seat (rim bore) 39.2 s6 | 39.2 s6 (+0.043..+0.059) | 39.2 | mismatch | mismatch | the page draws nominal sizes; the fit is 0.043 above the built |
| 12-5-18 | slot reach "0,95 +0,15" (new; 18.3 struck) | 0.95 +0.15 | 0.92 | mismatch | mismatch | 0.03 under the lower limit 0.95; also the pocket's outer edge is 19.13, not the wall at 19.25, so the 0.8 and 0.95 can't both hold as built (0.12 lip). The shee |
| 12-6-1 | lid dia at the face, r6 | 39.2 r6 (+0.034..+0.050) | 39.2 | mismatch | mismatch | as 12-5-2 |
| 12-6-11 | narrow notch bottom from the centre | 18.3 +-0.02 | 18.328 | mismatch | mismatch | 0.008 over; marginal |
| 12-6-13 | wide notch depth from the rim | 2 +0.2 | 1.951 from r 19.6 (2.045 from 19.695) | mismatch | match | the plan is the 39.39 flange (the notch is cut in it), so the depth is taken from r 19.695: 2.045 is inside 2..2.2. The reader measured from r 19.6 (the face's  |
| 12-7-4 | hook 05 07 02-2 stands out of the body "0,5 -0,05" | 0.5 -0.05 (0.45..0.5) | 0.25 | mismatch | mismatch | the end view's 0.5 is the stand-out (an arrow from the body circle to the tab); 01's side section shows 0.5 too. Built is half |
| 12-7-5 | hook at 15 deg to the square flat normal | 15 deg | 45 deg | mismatch | mismatch |  |
| 12-7-7 | hook pin / hole dia, depth | 2 dia, 6 deep (sheet 09) | 2.0, hole through | mismatch | mismatch | the sheets disagree: the later one draws a through hole. The built hook pin is 6.25 long (z 0.655..6.9), so a through hole leaves its lower part empty |
| 12-8-3 | body length incl. chamfers | 12 | 11.58 | mismatch | mismatch | see the later-sheet finding |
| 12-8-4 | chamfer end dia | 9 | 10.0 | mismatch | mismatch | the reader's "sure" rests on 09, where the arrows don't clearly span the end face; 01 and 08 confirm it |
| 12-8-5 | chamfer angle and length ("22 1/2 deg", "0,8") | 22.5 deg to the end face, 0.8-0.9 axial | 45 deg, 1.65 | mismatch | mismatch |  |
| 12-8-6 | cross hole 2 dia x 6 deep, centred | 2 x 6 blind, centred | through, centred | mismatch | mismatch | but see 12-7-7: 08 draws it through |
| 12-8-7 | neck dia (ball side), 1:70 polished | 5 (tolerance illegible) | 4.48 | mismatch | mismatch | scaled 4.8-4.9 on all three sheets; 0.5 under |
| 12-8-8 | neck length (ball side) | 6.7 (+-0.05) | 6.77 | mismatch | mismatch | 0.02 over |
| 12-8-9 | ball pivot dia | 3 (tolerance illegible) | 2.88 | mismatch | mismatch |  |
| 12-8-11 | square-end neck dia and length "3,5" | 5 dia, 3.5 long | 4.48, 3.94 | mismatch | mismatch |  |
| 12-8-12 | square-end small neck "4" | 4 (tolerance illegible), about 3.1 long scaled | 3.88, 2.92 | mismatch | mismatch | the reader's "-0.2 long" is not borne out: 2.92 against 2.9-3.0 scaled |
| 12-9-1 | ring OD x ID x height (Rohmass 42 x 2 x 20) | 42 x 38 x 19 | - | not built | not built | the drum is one deep-drawn piece 41.6 / 38.5 / 18.1 with a floor; no built part is a loose ring. The sheet is the earlier three-part barrel (ring, with a 39.2 c |
| 12-9-2 | counterbore 39.2 | 39.2 | - | not built | not built | the drum has a 39.2 seat but is not this part |
| 12-9-3 | step 7.5 deep, 5 deg | 7.5; 5 deg | - | not built | not built | the drum's seat is 1.2 deep, not 7.5 |

### Batch 13

Reader: 72 match, 4 mismatch, 1 not built, 1 extra, 7 can't tell. After the verifier: 70 match, 9 mismatch, 1 not built, 1 extra, 11 can't tell, 0 not applicable (reports: `batch13.md`, `verify13.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 02_1 | Zeigerwerk, Auf u. Ab. gesamt (28.3.41) | 21 | 10 | 5 | 0 | 0 | 6 |
| 05 02_2 | Minutenzeiger 05 02 00-1 (18.9.42) | 13 | 13 | 0 | 0 | 0 | 0 |
| 05 02_3 | Stundenzeiger 05 02 00-2 (14.6.40) | 16 | 15 | 1 | 0 | 0 | 0 |
| 05 02_4 | Auf- u. Abzeiger 05 02 00-3 (16.1.41) | 9 | 7 | 0 | 0 | 0 | 2 |
| 05 02_5 | Sekundenzeiger 05 02 01-1 (14.6.40) | 11 | 10 | 0 | 0 | 0 | 1 |
| 05 02_12 | Zifferblatt 05 02 00-1 (2.7.40) | 14 | 13 | 0 | 0 | 1 | 0 |
| 05 02_13 | (B-) Chronometerzifferblatt ALS-1453/A (9.6.44) | 8 | 2 | 3 | 1 | 0 | 2 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 13-1-3 | UD axis to up-and-down pinion axis: caption 18,4 | 18.4 | 18.40 | match | cant | The caption sits between two arbor labels, so the pair is not fixed. A match on a number whose ends are not marked is not firm. |
| 13-1-10 | Gap dial top to hour-hand blade underside: dimension "2" (scaled 1.6) | 2 (scaled 1.64) | 1.78 | mismatch | mismatch | -0.22 exceeds the fallback +-0.05 and also +-0.1. The scaled gap agrees with the label, so the drawing is not the cause. |
| 13-1-11 | Minute-hand boss bottom to hour-hand flange top (label "0,2" near the hands) | 0.2? | 0.72 | cant | mismatch | Both the label (0,2 or 0,4) and the scaled gap are well under 0.715. The reader's "can't tell" understates it. |
| 13-1-12 | UD arbor stud: label 12,7 along the stud (length or a diameter?) | 12.7 | 12.3 | cant | mismatch | underline suggests not to scale |
| 13-1-13 | Stud diameter at the UD arbor (scaled about 1.5) | 1.5 (scaled) | 1.5 | match | cant | accuracy of the scan (+-0.2 at this scale) does not support "match" |
| 13-3-5 | Bore Ø4,4 H7 +0,012 | 4.4 (+0.012) | 4.4155 narrow end | match | mismatch | The narrowest Ø on the whole taper, 4.4155, is above the upper limit 4.412 by 0.0035; the mean is 4.4377. For the minute hand the narrow end does land inside it |
| 13-4-3 | Inner ring of the boss (about Ø3.2 scaled) | 3.2 (scaled, +-0.2) | 3.0 | match | cant | -0.2 is the scale accuracy; the sheet prints no size |
| 13-6-12 | Small pin holes diameter | illegible (1,1 or 1?) | 1.0 | cant | match | a "1" is printed with arrows at the upper pin hole; I read it as Ø1 |
| 13-6-14 | Dial feet / posts (assembly: block on a post, "Festsitz") | none on the dial (separate posts) | - | extra | extra |  |
| 13-7-1 | Outside Ø103 | 103 | 103.55 | mismatch | - |  |
| 13-7-2 | Material thickness 1,5 | 1.5 | 1.2 | mismatch | - |  |
| 13-7-5 | Seconds hole Ø2,2 (1,5 struck out) | 2.2 | 1.7 | mismatch | - |  |
| 13-7-6 | Mitte-Auf und Ab 23 (23,5 struck out) | 23 | 23.0 | match | cant | the reader read it as 23,5 struck out and a surviving 23 |
| 13-7-7 | Mitte-Sekunde 23 +-0,05 | 23 +-0.05 | 23.0 | match | cant |  |
| 13-7-8 | This variant as a solid of its own (iron, 1.5, Ø103, 2.2) | a second dial | - | not built | not built | there is only the Wempe dial 050200-4 |
| 13-1-v1 | a part in the dial's underside, 0,1 clear (unsure which: the up-and-down wheel hub or the wheel) | a part in the dial's underside, 0,1 clear (unsure which: the | udWheel top y 9.55 (0.8 under the dial 10.35); udPinion top  | (new) | mismatch |  |
| 13-1-v6 | scaled 0.4-0.5 | scaled 0.4-0.5 | 0.715 | (new) | mismatch |  |

### Batch 14

Reader: 59 match, 2 mismatch, 1 not built, 2 extra, 6 can't tell. After the verifier: 64 match, 2 mismatch, 1 not built, 2 extra, 6 can't tell, 0 not applicable (reports: `batch14.md`, `verify14.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 51 02_6 | Wechselrad kompl. 05 02 02 (28.2.41) | 16 | 14 | 1 | 0 | 0 | 1 |
| 05 02_7 | Wechselrad 05 02 02-1 (19.8.40) | 12 | 8 | 0 | 0 | 1 | 2 |
| 05 02_8 | Stundenrad kompl. 05 02 03 (20.7.40) | 10 | 8 | 1 | 0 | 0 | 1 |
| 05 02_9 | Stundenrad 05 02 04-1 (19.8.40) | 11 | 9 | 0 | 1 | 0 | 0 |
| 05 02_10 | Auf u. Abrad kompl. 05 02 04 (27.2.41) | 14 | 13 | 0 | 0 | 0 | 1 |
| 05 02_11 | Auf u. Abrad 05 02 04-1 (26.2.41) | 15 | 12 | 0 | 0 | 1 | 1 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 14-1-13 | pinion outside Ø (tips), scaled; no number on this sheet | about 7.2 (outer lines 123 px at 17.05 px/mm; 7.1..7.4 by th | changePinion teeth[0].tips_d 6.8997 | mismatch | mismatch | The reader's 7.2 came from one scale (17.05) and the scan's own scale spread is wider than the 0.3 claimed. Two independent horizontal references (wheel tips, p |
| 14-1-15 | small outer chamfer on the pipe top edge | a bevelled top corner, about 0.1 to 0.2 (unsure) | changePipe section_y0 top corner square at (1.525, 6.9) | not built | match | Nothing on the sheet to build. The "chamfer" is the leader's arrowhead and a blot. Remove from the not-built list. |
| 14-2-3 | pitch circle d | 20.16 (sure) | not a field; the tooth thickness below is sampled at r 10.08 | cant | match | Outline lines crossed with the pitch circle (r 10.08) give tooth 0.555, gap 0.576: sums to pi*20.16/56 = 1.1310 |
| 14-2-10 | countersink at the bore on one face (sheet 06 shows the flare; this sheet none) | not drawn | changeWheel cones[0] d 4.2..4.66, z 0..0.4, 30 deg | extra | extra |  |
| 14-3-2 | collar top height above the foot (wheel underside) | 5.2 -0.1 (sure; measured 5.1 on the scan) | hourPipe cylinders[1] z 1.0..3.585 (collar top 3.585) | mismatch | mismatch | Attachment is clear, not a dimension to nothing. |
| 14-4-5 | f = 0.5 (tooth form) | f = 0.5, meaning not stated (unsure) | no field | cant | match | See f/l note |
| 14-6-5 | l = 0.40 | 0.40, meaning not stated (unsure) | no field | cant | match | See f/l note |
| 14-6-13 | countersink on the bore (shown on sheet 05 02_10) | not drawn on this sheet | udWheel cones[0] d 5.2..5.66 z 0..0.4 | extra | extra |  |
| 14-4-v1 | blank 20.2 -0.1 gedreht, 1.05 +-0.03 gedreht | blank 20.2 -0.1 gedreht, 1.05 +-0.03 gedreht | likely | (new) | not built |  |

### Batch 15

Reader: 30 match, 11 mismatch, 0 not built, 5 extra, 10 can't tell. After the verifier: 39 match, 0 mismatch, 0 not built, 0 extra, 7 can't tell, 15 not applicable (reports: `batch15.md`, `verify15.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 05 01_1 | Gehäuse Kardan 05 01 (30.10.40) | 15 | 12 | 0 | 0 | 0 | 3 |
| 05 01_2 | Gehäusetopf R-05 01 00-1 (6.3.42) | 15 | 8 | 0 | 0 | 0 | 1 |
| 05 01_3 | Verschlussplatte 05 01 00-2 (6.12.41) | 17 | 16 | 0 | 0 | 0 | 1 |
| 05 01_4 | Glasrand kompl. 05 01 01 (29.11.41) | 5 | 3 | 0 | 0 | 0 | 2 |
| 05 01_5 | Glasrand R-05 01 01-2 (6.3.42) | 9 | 0 | 0 | 0 | 0 | 0 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 15-1-3 | Wooden box outer height 180 | 180 | 105 (lower box only) | cant | match | The lid is a separate part, but the two together give 180. The reader had both files and didn't add them. |
| 15-1-8 | Locking bracket (3 Feststellkloben) angle from vertical 50 deg | 50 deg | 50.0 deg | cant | match | **hand: match (likely).** In placements `WN-78.m25` sits at x +43.8, z +36.8, so the bracket is on the +x, +z side. The sheet's A-B is a plan from +y with x to  |
| 15-1-9 | Dimension 17 at transit lock 15 (attachment unclear: circle centre to a base line) | 17 | not identified | cant | match | The reader could not identify the part. The `050101.F.h/k/a` pieces are the transit lock. The lock's big circle on the sheet is about 20.5 across against the bu |
| 15-2-2 | Flange height from top 12: flange z 53 to 65 | 12 (z 53 to 65) | 7.3 (z 53-60.3) | mismatch | n/a | The finished flange is cut to 60.3 and a lip stands 60.8..64.5 to keep the 65 overall. 65 - 12 = 53 holds. |
| 15-2-6 | Depth of bore 53 (top at 65 to floor z 12) | 53 (floor z 12) | floor 11.3; depth from 65 = 53.7 | mismatch | n/a | the floor is a casting size; the finished floor is thinner by 0.7 (the holes in it run z 5.5..11.3). The brief's blank rule applies. |
| 15-2-9 | Base recess 64 dia, 5.5 deep | 64, 5.5 | 68.2 dia; depth 5.5 | mismatch | n/a | The blank's 64 is bored out. 05 01_3's plate (68 -0.2) cannot go into 64, so the finished recess is at least 68; 68.2 is consistent with it. The 5.5 depth holds |
| 15-2-12 | Top inner recess 106 dia z60.3-65 (not drawn) | not drawn (bore plain 98) | 106.06 recess | extra | n/a |  |
| 15-2-13 | Lip 110.55 dia z60.8-64.5 with 39 deg cones (not drawn) | not drawn | present | extra | n/a |  |
| 15-2-14 | Pin holes 1.2 x2, 2.46 centre hole, 8.2 hole at r22.65 in floor (on 05 01_3 only) | not drawn here | present | extra | n/a |  |
| 15-3-13 | Hole 1.2 at 12.6 from centre, depth 3 +0.2 | 1.2 at 12.6, depth 3 +0.2 | 1.2 at r 12.35, depth 2.99 | mismatch | match | **The reader misread 12,4 as 12.6; the brief repeated it.** 12.35 vs 12.4 is 0.05, inside ±0.1. Depth 2.99 is 0.01 under the printed 3 +0.2 lower limit, within  |
| 15-3-14 | Angle between the 8 hole and the M2.6 hole 90 deg | 90 | 90.0 | cant | match | hand: the sheet draws the plate seen from the boss side with the 8 hole at the bottom and the M2.6 and 1.2 at the left; as assembled (box frame y -48..-53) the  |
| 15-4-3 | Bezel height in assembly (scaled about 17.8) | ~16-18 | 13.4 | cant | match | The reader's 16-18 is not what I read on the right section. 13.7 against 13.4 is inside the scan. The 16 is the blank's height. |
| 15-5-1 | Outer dia top 125 | 125 | 121.2 | mismatch | n/a |  |
| 15-5-2 | Bottom outer dia 116 (after bevel) | 116 | 113.2 at z0 (116.1 at z 6.07) | mismatch | n/a | the 116.1 is reached at 6.07 on the built bevel |
| 15-5-3 | Outer bevel 30 deg (125 to 116) | 30 deg | profile differs | mismatch | n/a |  |
| 15-5-4 | Bore 92 dia, wall 11.5 high, straight | 92 over 11.5 | 92 at z5 only, then cone to 110.6 | mismatch | n/a |  |
| 15-5-5 | Glass seat recess dia 106 | 106 | 109.8 | mismatch | n/a | the finished recess takes the bowl's 110.55 lip (and the lip's cone to 109.74); the blank leaves 4.5 mm for the boring |
| 15-5-6 | Recess depth 4.5 (16-11.5) | 4.5 | 5.0 | mismatch | n/a | the reader's own table has the 4.5 cylinder inside; only the cone adds 0.5 |
| 15-5-7 | Total height 16 | 16 | 13.4 | mismatch | n/a |  |
| 15-5-8 | Top: plain flat, no chamfer or lip drawn | plain flat top | chamfers and lip to z 13.4 | extra | n/a |  |
| 15-5-9 | Outer cylinder 120.4/121.2 z7.5-9.8 (not drawn) | not drawn | present | extra | n/a |  |

### Batch 16

Reader: 109 match, 7 mismatch, 1 not built, 0 extra, 18 can't tell. After the verifier: 113 match, 9 mismatch, 1 not built, 0 extra, 16 can't tell, 2 not applicable (reports: `batch16.md`, `verify16.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| 51 01_6 | Aufzugschlüssel (U 01, 51 00 11; 12.12.40) | 19 | 16 | 0 | 0 | 0 | 1 |
| 05 01_7 | Chronometerschlüssel 51 00 11 / 51 01 02 (16.7.43) | 19 | 13 | 4 | 0 | 0 | 2 |
| 05 01_8 | Schlüsselmittelteil 05 01 02-2 (16.7.43) | 20 | 20 | 0 | 0 | 0 | 0 |
| 05 01_9 | Schlüsselrohr 05 01 02-3 (16.7.43) | 13 | 11 | 1 | 0 | 0 | 1 |
| 51 00_1 | Boden-Chronometer (the box; 4.3.42) | 12 | 7 | 1 | 0 | 0 | 4 |
| 51 00_2 | Griff f. Chronometerkasten 51 00 10 (14.7.42) | 18 | 14 | 2 | 0 | 0 | 2 |
| 51 00_3 | Firmenschild (22.3.43) | 6 | 4 | 0 | 0 | 0 | 2 |
| 51 00_4 | Zunge P.51 00 02-2 (18.9.42) | 14 | 12 | 0 | 1 | 0 | 1 |
| 51 00_5 | Überkasten (28.2.42) | 20 | 16 | 1 | 0 | 0 | 3 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 16-2-4 | paddle disc diameter (scaled) | 33.8 (likely) | 34.5 | match | mismatch | outside the scan's accuracy by about 2 sigma; the paddle's own sheet (510011-1) is not in this batch to settle it |
| 16-2-12 | tube protruding below the body (scaled) | 30.0 (likely) | 33.0 | mismatch | mismatch | the sheet's drawn tube is 332 px = 46.8 long against its own 50.1 (sheet 9); the printed chain (50.1 long, head top 8.1 below a 25.1 body) gives 50.1 - (25.1 -  |
| 16-2-13 | overall length, tube end to paddle top (scaled) | 79.9 (likely) | 84.7 | mismatch | mismatch | the rest is the paddle's length, which no sheet in this batch prints |
| 16-2-14 | square socket depth (scaled; sheet 9 prints 19 after rev a) | about 28 (unsure) | 19.0 | cant | match | the reader's -9 is a difference from an old drawing, not from the sheet's latest word. Verdict match to rev a |
| 16-3-19 | small hole lean direction and angular place ("Lochstellung beliebig") | any place (sure); lean direction (unsure) | - | cant | match | the lean is readable and the model has it; only the place is free |
| 16-4-5 | head-to-shank 0.3 r (a radius) | 0.3 r (likely) | 0.3 chamfer | mismatch | mismatch | trivial; a radius is drawn |
| 16-4-9 | drill diameter behind the square (not dimensioned; scaled) | about 2.3 (unsure) | 2.9 | mismatch | cant | the bore is not drawn to the sheet's diameter scale (the square drawn 2.28 against its printed 3.1), so a scaled drill is not a measurement. The drill is drawn  |
| 16-5-2 | Holzkasten total height with its lid (scaled) | 171 +-6 (likely) | 180 | cant | match | the assembly supports 180, not 185; the 185 on sheet 51 00_2 is the sheet that disagrees (see 16-6-12) |
| 16-5-6 | corner bracket (Schlüsselhalter), leg of the triangle (scaled) | about 24 (likely) | 59.5 | mismatch | mismatch |  |
| 16-6-12 | panel total height 185 (105 + lid part 80) | 185 (sure) | 180 | mismatch | mismatch | the split line scales at 100.8 (not 105): the sheet's drawing is not exact. Sheet 51 00_1's scale gives 179, so the sheets disagree with each other; the model f |
| 16-6-17 | M6 screw length, head top to pivot tip (scaled) | 27.9 +-1 (unsure) | 24.0 / 26.3 | mismatch | mismatch | the two built screws also differ from each other by 2.3 mm; the sheet draws one |
| 16-8-10 | chamfer 0.5 x 45 deg at the M3.5 hole | 0.5 (likely) | - | not built | not built | and the big hole's drawn ring is about 0.3, built 0.5 (16-8-9 match to a small tolerance) |
| 16-9-16 | hinge length (the 100 and 32 at the top: 200 total?) | 100 + 32 (unsure what they attach to) | 200 | cant | match | **match** |
| 16-9-17 | screw 5, 4 x 25 DIN 97 (strap screw) | 4 x 25 (sure) | 3.977 / 25.0 / 27.6 | cant | mismatch | thread and length match; the head is not a countersunk one. Reader had no ground to judge; the DIN number does |
| 16-2-v1 | likely | likely | 510011-6 a plain 2.5 x 15.3 | (new) | mismatch |  |

### Batch 17

Reader: 41 match, 19 mismatch, 3 not built, 0 extra, 10 can't tell. After the verifier: 50 match, 9 mismatch, 2 not built, 0 extra, 12 can't tell, 0 not applicable (reports: `batch17.md`, `verify17.md`).

| Sheet | Title | Items | match | mismatch | not built | extra | can't tell |
|---|---|---|---|---|---|---|---|
| Federchronometer 05 | the coloured section of the whole movement (Wempe Observatory; Altmeppen 2017) | 73 | 50 | 9 | 2 | 0 | 12 |

| id | item | drawn (reader) | built | reader | verifier | verifier's reason |
|---|---|---|---|---|---|---|
| 17-1-10 | upper cock (Unruhkloben oben 05 08 03-1) top face (hatched cut, over the balance) | -37.74 (+-0.2); an unhatched outline beyond the cut reaches  | -37.35 | mismatch | match | the reader's -37.74 comes from his zero 4.5 px (0.2 mm) too high plus reading; against the true zero it is +0.15, inside the spread |
| 17-1-14 | label of the top plate | Oberplatte 05 08 01-1 (sure, hi-res print) | 050901 | mismatch | match | the sheet's number agrees with the sheet; "050901" is the model's own line number, not a size or shape mismatch |
| 17-1-18 | label Zugfeder (mainspring) | Zugfeder 05 07 00-2 (sure) | none under that number | not built | not built | a mainspring in the drum, same width as the sheet's 15; label difference, not "not built" |
| 17-1-19 | label Bandhaken f. Trommel | 05 07 06-3 (likely) | none under that number | not built | not built | the section's "06-3" differs from the sheet's own 03-3; the part is built |
| 17-1-20 | labels of screws WN-27 (fusee, left), WN-13, WN-15, WN-16 | Schrb. WN-27; Schraube WN-13; Schrb. WN-15; Schrb. WN-16 (su | none | not built | cant | the model's own titles carry the labels. WN-16 points at a slotted round head D about 3.3 mm in the detent block (the blockScrew head is 3.0, so WN-16 may be th |
| 17-1-22 | barrel arbor: core's cylindrical length, y | -17.70 to -7.76 (+-0.15) | -16.73..-8.45 | mismatch | mismatch | the sheet backs the section; the 1.65 chamfer takes the length |
| 17-1-23 | barrel arbor: core's end chamfers | 1.05 axial by about 2.1 radial (to about D 9.3 at the face); | 1.65 x 1.65 | mismatch | mismatch |  |
| 17-1-24 | barrel arbor: neck above the core (inside the cover's boss) | D 5.13, y -22.2 to -18.75 (+-0.12) | 4.48 | mismatch | mismatch | backed by the detail sheet |
| 17-1-25 | barrel arbor: neck below the core, down to the pillar plate | D 4.93, y -6.66 to -0.04 | 4.48 | mismatch | mismatch |  |
| 17-1-28 | barrel arbor: dial-side end (a drawn bullet point) | y +6.3 (dome starts 4.6) | 4.95 | mismatch | match | the model equals the printed dimension; the section is loose (section 2) |
| 17-1-29 | barrel arbor: top end above the bridge (domed) | y -36.45 (dome from -35.0) | -35.25 | mismatch | match | same as 17-1-28. Separate point: the model's end is flat with a 0.5 chamfer where the section shows a 1.5 mm dome; the sheet shows only a slightly rounded edge  |
| 17-1-38 | fusee arbor: top end (square then dome) | dome top y -46.45 (dome from -44.76) | -48.025 | mismatch | match | the model equals the printed length |
| 17-1-39 | fusee arbor: dial-side end | about 9.7, hidden in a hub | 10.1 | cant | mismatch | see new item 17-1-v1 |
| 17-1-50 | intermediate arbor: pinion y span (tips D 4.8 drawn) | -2.95 to -0.3 | -3.02..0.23 | mismatch | match | +0.2 at each end, inside the spread; the reader's right-half zero is 0.2 high |
| 17-1-53 | seconds arbor (Sekundentrieb 05 05 01-2): top pivot tip | -21.5 (+-0.2) | -21.98 | mismatch | match | -0.14 on the section; the reader's -21.5 is not reproduced (and is 0.2 off from his zero) |
| 17-1-57 | seconds arbor: dial-side end (inside the hand's collar) | 13.0 (+-0.25) | 12.28 | mismatch | cant | +0.4 at most and the drawn end belongs to the collar |
| 17-1-58 | escape arbor (Gangtrieb 05 04 05-2): shaft diameter between the wheel's hub and the pinion | 1.38 (63 px at 45.6; +-0.1) | 1.2 / 1.07 | mismatch | match | hatching and line weight inflate the section's width; the sheet is printed and agrees with 1.07 |
| 17-1-59 | escape pinion y span (tips D 2.85 drawn) | -6.4 to -2.35 (+-0.15) | -7.5..-3.5 | mismatch | match | the section arbor measures 22.1 against the sheet's 22.8 |
| 17-1-60 | escape arbor: top pivot tip, in the jewel | -19.9 (+-0.15) | -20.98 | mismatch | mismatch | not from the scale: the lower tip agrees (1.9 against 1.8), so the section arbor is 0.7 short; the arbor length 22.78 equals the sheet's 22.8 |
| 17-1-66 | balance staff: where the thin section widens | y -29.9 (+-0.2) | -28.9 | mismatch | mismatch | the staff's own detail sheet (05 04 02-1) was not found among the sheets I opened (05-04_05 is the lever-escapement staff), so it is not settled against a print |
| 17-1-69 | escape top jewel: hole stone (top plate) | y -19.9 to -18.8, flush with the plate's underside (+-0.15) | -20.94..-20.14 | mismatch | mismatch | outside the spread; the stone is not flush with the underside on the sheet, it is about 0.2 above it |
| 17-1-70 | escape top jewel: cap stone (convex) | y -21.27 to -20.15 | -21.91..-21.01 | mismatch | mismatch |  |
| 17-1-72 | escape lower jewel: cap stone | y 2.05 to 3.15 | 1.83..2.58 | mismatch | cant | the lower tip, the plate faces and the hole stone all agree, so a 0.4 difference on a domed cap is not a finding |

## Sheets not audited

| Sheet | Title | Why |
|---|---|---|
| 002 | Ankerchronometer (the lever chronometer's plan) | not in the model |
| 05 08_30 | Oberplatte (22.9.41) | an earlier revision of a sheet audited here |
| 05 08_31 | Oberplatte kompl. (U 35, 25.9.41) | an earlier revision of a sheet audited here |
| 05 04_7.1 | Gangrad 05 04 08 bis 10 (4.4.41) | an earlier revision of a sheet audited here |
| 05 04_20 | Hemmung für Anker-Chronometer | not in the model |
| 05 04_21 / 05 04_22 | Anker kompl. and Ankerrad (the lever chronometer) | not in the model |
| 05 03_3.1 | Unruhwelle 17 04 01 (7.6.43; another calibre's number) | another calibre's sheet |
| 05 06_2.1 | Schneckenkörper 02 06 13-2 (22.7.41) | an earlier revision of a sheet audited here |
| 05 07_2 | Federhaus 02 07 01 (U 22, 16.7.41) | an earlier revision of a sheet audited here |
| 05 33 | Zeigerstellung kompl. (hand setting, 5.11.41) | not in the model |
| 05 36_1 | Unruhhaltevorrichtung (balance holding device, 26.2.42) | not in the model |
| 05 36_2 | Zangenteil 36 00 01-1 (29.8.41) | not in the model |
| 05 38 | Sekundenkontakt 38 00 (9.12.42) | not in the model |
| Federchronometer 05 (copy) | the same section as printed in Klassik Uhren 3/2006, joined at 2.49 times (read labels on it with batch 17) | another print of a sheet read with batch 17 |
