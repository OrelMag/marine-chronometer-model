# Correcting the Wempe parts found to differ from their drawings

The owner's instruction, 3 November 2026: correct every difference that the parts audit (`WEMPE-PARTS-LEDGER.md`, explained in `marine-chronometer-source/wempe/parts-audit/FINDINGS-EXPLAINED.md`) found, once each is shown to be real and needed. Each correction is documented afterwards. The four clashes keep their fits and are recorded as departures.

## The rules for each correction

1. **Real.** The figure is re-read on the sheet (a crop enlarged 4x, kept outside the repository in `E:/mc-video/wpa-audit/crops/`) and what its extension lines attach to is confirmed. The model's value is re-measured on the solid (`wempe_measure.py`), not taken from the report.
2. **Needed.** The corrected size is checked against every part it meets: its fit, its clearance, and its hole or pin. It must break no sheet that is later than the one it follows (the owner's rule, the later-dated sheet decides), and it must contradict no earlier decision of the owner. A correction that would clash goes back to the owner instead.
3. **Corrected** in the place the model takes the size from (`wempe/js/dims.js`, the part's builder, and its recipe in `tools/recipes/wempe*.py`), never as a patch on the mesh.
4. **Checked.** These run for every correction:
   - `recipes.py --model wempe --check --only KEY`;
   - `isolate.py` against the sheet and photographs;
   - `solids.py`, `fine.py`, `holecheck.py` and `seatcheck.py --model wempe` for geometry;
   - `bom.py --model wempe` per batch;
   - the physics tools for any part that sets timing or carries load (the escapement chain: `wempe_escapement.js`, `dynamics.js` and `tripping.js --model wempe`, `wempe_banking.js`, the build tools, `wempe_essaydata.js`; the hairspring: `wempe_hairspring.js`).
5. **Documented.**
   - The ledger's row is marked "corrected".
   - The README's "Readings corrected against the sheets" gets an entry with the sheet, the figure and the commit.
   - `RESOLVED.md` gets an entry where a correction fixes a bug.
   - `WEMPE-PROVENANCE.md` updates the part's row.
6. **Released** once per batch, after its checks pass (the owner's rule: release and deploy each finished change).

## Kept by the owner's decisions (recorded, not changed)

- **A1, the escape wheel's place:** the plate table's 23.41, which Wempe 3955 confirms, against the 1940 layout's 23.8. The wheel is 0.447 along the detent.
- **B1, the 1946 pinion pivots:** 9.2/4.5 and 4.6/4.6 would stand out of the plates. The model keeps the assemblies' 7.2/3 and 3/3.
- **C2, the fusee arbor's journals:** the arbor's 2.8 and 4.5 against the plate's, bush's and wheel's 2.70, 4.1 and 4.0.
- **E1, the hour wheel's collar:** 5.2 would reach into the dial. The model keeps 3.585.
- **Earlier decisions:**
  - holes 56 and 57 are not built (28 October);
  - the top plate's horn tips are a version each (26 October);
  - the box is 180 high (the 1946/47 reissue of 05 01);
  - the oil sink on hole 4 (Wempe 3955);
  - the Vorreiber's 2.76 (its sheet's own note);
  - fits are drawn at the middle of their range.

## The corrections, by batch

### Batch 1: timing (the escapement and hairspring)

| # | Part | Correction | Re-check first |
|---|---|---|---|
| T1 | Hairspring | pitch 0.73, height 9.5, ends 3.15 under the stud's arm and 0.75 over the collet; settle the turn count against 05 03_5, 05 03_6 and 05 03_7 | the sheets' turn counts; the terminal curves' join |
| T2 | Detent | the tail 0.22 wide to its tip (05 04_10.1) | what the callout attaches to; the tail's contact with the gold spring |
| T3 | Detent block | the M1.2 cross hole centred on the 3 mm arm (z 5.0) | the banking screw's line against the detent |
| T4 | Staff | the version check of 05 03_3.2 (1965); the s6 seat 1.665-1.672 and the lower collar within its limits | which sheet governs; jewel and roller fits |

### Batch 2: the fusee and barrel

| # | Part | Correction |
|---|---|---|
| F1 | Set-up ratchet | its square turned so a tooth tip lies on a flat's normal (05 07_3) |
| F2 | Barrel arbor's hook | re-measure (0.25 or 0.475; 15° or 45°); stand-out 0.5 −0.05, face at 15° |
| F3 | Fusee body | the chamfer to Ø 29.8 +0.2, with no straight wall (05 06_2.2) |
| F4 | Maintaining detent | the R9 hollow's centre 9.645 / 6.273 (05 05_12), checked against the sheet's own scale |
| F5 | Fusee arbor | the square's taper 1:100 (05 06_15) |
| F6 | Click spring | the arm one arc R10.4 about the ratchet's axis (05 06_13) |
| F7 | Round band hook | the body arc R6 at 3.55 across; 2.8 or 1.7 along, settled on the sheet (05 07_12) |
| F8 | Cannon pinion | length 14.3 (05 05_8) |
| F9 | Drum | the slot's reach 0.95 +0.15 (05 07_6) |

### Batch 3: the frame and case

| # | Part | Correction |
|---|---|---|
| R1 | Pillar plate | hole 30's land on the drawn face (05 08_3.b) |
| R2 | Pillar | lead 5° over 1.4, the step 1.4 −0.2, the shoulder's relief groove, the countersink's depth (05 08_11) |
| R3 | Barrel bridge | the end screw holes about Ø 3.5 (05 08_12/13), with their screws |
| R4 | Lower cock | width 19.75, arm 3.3 (05 08_33 against 05 08_4: check which applies) |
| R5 | Plates | hole 26's step 4.5 or 4.59 (05 08_1.b), and the pillar plate's undrawn recess at hole 26 |
| R6 | Ring and upper cock | the three Ø 0.73 holes in the ring and the Ø 1.075 hole in the upper cock that no sheet draws: find their source, or remove them |
| R7 | Box screws | the DIN 97 wood screws countersunk; the M6 pivot screws one length |

### Batch 4: small forms, each checked as real first

These are each item in `FINDINGS-EXPLAINED.md` marked "correct" or "optional" that a sheet draws clearly:
- the balance hub's counterbore 1.8 × 0.4 at one hole;
- pivot tips as cones where the later sheet draws them;
- the cannon's Körner groove;
- the drawn edge breaks;
- the key's grooved pin;
- the collet's 1:90 cross-hole taper and its punch mark;
- the stud's notch round;
- the tongue's chamfer.

Unsure readings stay as they are and are recorded.

## Progress

(Updated as each correction is made: re-checked, corrected, checks run, documented, released.)

The owner, 3 November 2026: apply every correction first, then run the checks and physics once at the end.

- **T1, the hairspring: checked, not a difference; nothing changed.**
  - The owner chose 11.8 turns: the plan of 05 03_5 draws the two pinning points together, which needs a fraction of .8 turn.
  - 05 03_5's 3.15, 9.5 and 0.75 run to the strip's centrelines, not its faces. The collet's sheet 05 03_8 (24.2.43, later) prints its pin hole 0.75 from the face, and the built hole's centre is 0.75 from it (z 2.15-2.95 of 3.3). The spring's end runs in that hole.
  - So the ends are as drawn, and the pitch is 9.5/11.8 = 0.80 as built.
  - The audit's 08-1-2 to 08-1-4, 08-1-v1 and 08-2-5 (and my own check of the 0.73) took the arrows to the faces.
- **T2, the detent's horn tip: corrected (not yet checked).**
  - 1436 (17.2.43) prints 0,25 (0,22) at the tail's tip itself.
  - The horn was ground in to 0.05 at the tip, drawing check 2's estimate of the bevel (2-M11). It now keeps its full thickness to the end, bevelled in plan over its last 0.74 as before.
  - Changed in `escapement.js` (`DETK.tip` null, `HB`) and the recipe (`wempe.py`'s detent). The gold spring rests on the horn's face, not its back, so no contact moves.
  - Pending: isolate and compare, then the escapement chain.
- **T3, the detent block's banking-screw hole: corrected (not yet checked).**
  - 05 04 01-4 (8.7.43) draws it centred on the upright's 3. It was 0.15 under, after photographs of Kirov and Lange blocks that disagree among themselves (0 to 0.25). It is now `BLK.up.s` 5.0.
  - Centred, the estimated Ø 3.4 head would reach the detent's and gold spring's lower faces. The head is now Ø 3.15 (`BLK.s43.rH` 1.575), Lange 5177's reading and the photographs' smallest, so it keeps 0.125 under them.
  - Applies to the block as last revised and the 1943 block.
  - Pending: isolate, `fine.py` and the escapement chain (the banking contact on the dome moves slightly; the depth of lock is set by turning this screw).
- **T4, the staff: checked, nothing to correct.**
  - **The version check: 05 03_3.2 is not Wempe's.** It has no Gerhard D. Wempe title block. Its format (Stückzahl, Teil, Werkstoff und Rohmaße, surface symbols) and date (12.3.65) are the post-war Glashütte production's. It tempers at 210° against 05 04_4's 240° and is numbered 050401. So under the owner's rule it doesn't count as a later revision of this chronometer, and its pivots 1,25 and collar 2,40 are no correction. The model keeps 05 04_4's (1946) diameters.
  - **Lengths.** The model's lengths (25.6, the pivots 6.9 and 6.1) come from it only because 05 04_4's top is cut off and no Wempe sheet gives them. They are recorded as an estimate.
  - **The 1.65 s6 seat** that "misses its limits" is the collet's 1:70 taper from Ø 1.58 over 5.0. That reaches 1.651, so 05 04_4's own figures can't give 1.665-1.672 there. Drawing check 2 kept the taper and the small end (the collet grips by its slit). It is a conflict inside the sheet, already settled with its reason.
  - The impulse roller's 1.65 s6 is built at 1.6685, the middle of its fit, so it matches.
- **F1 and F2, the set-up ratchet and the barrel arbor's hook: real, done together last in batch 2.**
  - **The ratchet (05 07_3).** It draws a tooth's tip on the normal to the square's top flat. The page turns the teeth (`rho`, `fusee.js` 1134-1152) to meet the click and turns the square back by `rho`, so the part's own tooth-to-square relation is arbitrary: 9.9° or 12.6° off.
  - **The hook.** The arbor's hook angle `HKA` (`fusee.js` 1182) follows from the mainspring's set-up, and the hook's relation to the square is F2 (drawn 15°, built 45°).
  - **So the correction is one.** With the tooth fixed to the square and the square to the hook as drawn, the click meets a face only when the set-up falls on a whole tooth, which is how a set-up is made. The set-up then moves by at most half a tooth (1/32 turn), and the physics rerun at the end takes it.
- **F8, the cannon pinion's length: checked, not a difference.**
  - The 14.3 (05 05_8) runs to the crown's apex. 05 05 03 draws one arc across the cannon's end and the centre arbor's end inside it, and that apex lies on the arbor's end.
  - The cannon is a tube, so its highest metal is the crown at the bore's edge, 14.17-14.19. The recipe faces the blank to 14.3 and turns the crown about R 3.1 from there.
- **F9, the drum's slot: checked, not a difference.**
  - The slot ends in a flat at r 18.3 on its centreline (`dims.js` `dr.sl.r0`): 0.95 from the wall's 19.25, the revised "0,95 +0,15" (05 07 01-1).
  - The audit's 18.33 is the flat's corner across the slot's 2.025.
  - 18.3 is also the lid's notch (05 07 01-2, 18.3 ±0.02), which 05 07 01 draws as one with the slot, with the Steg bearing on both, so it stays.
- **F7, the round band hook: checked, kept.**
  - The flank is traced on 05 07_12 at 10:1 (r 5.90 ±0.07 about (−3.47, −1.70), 0.007 rms).
  - The printed "2,8" puts its centre 1.1 lower, 11 mm on the paper, which is not a drafting slip. Both arcs are tangent to the bottom circle.
  - The figure's attachment is unsure, so the drawn line stays (as `fusee.js` records). Not built in the version as last revised (the band is a variant).
- **F4, the maintaining detent's hollow: checked, not a difference.**
  - `dims.js`' DT has the R9 hollow's centre at exactly the sheet's 6.273 and 9.645 from the hole (05 05_12), in the sheet's frame.
  - The audit's 6.033 and 9.781 are the same point, 11.49 from the hole against 11.51, turned 1.6° with the part's frame onto the fusee.
- **F5, the fusee arbor's square: checked, not a difference.** `fusee.js` (492) builds it at 3.12, tapering 1:100 to the sheet's 2.92 over 20.3. The audit's "1:110" was read short of the end: the last 0.5 is the square's point.
- **F6, the click spring's arm: checked, not a difference.**
  - 05 06_13 draws the spring free, its arm on R10.4. On the page it is sprung onto the click's back and rebuilt as the click rides (`fusee.js`, 692-704), as the assembly 05 06_11 draws it reaching the click.
  - The audit's 10.0-10.8 is the arm under load.
- **F3, the fusee body's chamfer: checked, not a difference.** `wempe_fusee_check.py` (5 s, the body's own check against 05 06 04-2) measures the 45° from Ø 29.8 at the blank's face exactly: r 14.6 at 0.3 under, 13.9 at 1.0 and 13.3 at 1.6, each within 0.001. The audit read the outline at another level.
- **R1, hole 30's land: checked, kept.**
  - 05 08_3.b contradicts itself. Its section G-H draws the land at the bottom; its plan, which shows the inner face, draws the 4.59 solid and the 5.2 dashed, so the land is on the inner face.
  - 05 08 02 (32-2) dashes the setting's screws to match. Drawing check 2 (9-M2) settled it by the plan and the assembly, which the model follows (`frame.js`, 178-186). The audit's agents read the section alone.
- **R2, the pillar: lead corrected to 5° (not yet checked); the rest not differences.**
  - 05 08_11 prints "5°". The audit's reader and verifier and my crop all read it, and it is the only angle that agrees with the lead's 1,1 −0,2 and the end's Ø 4,3 −0,2 (4.484 to 4.3 over 1.1 is 4.8°).
  - Drawing check 2's "6°" (9-M8) over-determined them. Now `dims.js` `PIL.tip`/`ta`, which the page and the recipe both read: the end Ø 4.29.
  - **The relief groove is built** (`grv` [3.25, 0.35], the recipe's `FaceGroove`); the audit's measurement missed it.
  - **The countersink's Ø 2.6** was scaled at 2.59 on the sheet, so it stays.
- **R4, the lower cock's 19.75 and 3.3: not differences.** Both were read on 05 08_33, the 1941 assembly that draws an earlier cock. The model follows the 1946 revision 05 08_4, which matched.
- **R3, the barrel bridge's end screw holes: not a difference.** The bridge's own sheet 05 08_13 (checked again 31.4.43, later than the assembly 05 08_12 of 21.7.41) prints holes 42 and 48 at Ø 2.8, as built, and batch 2 matched them. The 3.4-3.5 was scaled off circles on the assembly.
- **R5, hole 26's step: kept, unsure.** Drawing check 1 read "4,59"; this pass's reader and verifier read "4,5", not excluding a digit lost in the scan. The escape wheel's setting fits the built 4.596.
- **R6, the undrawn holes: needed, kept.**
  - **The ring's three Ø 0.729 holes** at r 50.5, 120° apart, are M1 tapped holes for the dial's three screws. The dial's sheet 05 02_12 places its Ø 1.8 holes there (batch 13 matched them); the ring's own sheet omits them.
  - **The upper cock's Ø 1.075 hole** is the M1.4 tapped hole for the hairspring stud's screw (WN-11, M1.4).
  - **Its place goes to the owner.** The hole is 4.1 along the arm; the cock's assembly 05 08_6 (18.7.41) dimensions the screw at 5 (batch 3, confirmed). Moving it would move the stud, which holds the spring's outer end where 05 03_7's curve and 05 03_9 put it, so this is a clash between a later assembly and unrevised parts.
- **R7, the box's strap screws: real, with the small forms.** 51 00_5 prints "4 x 25 Din 97" (sure), a slotted countersunk wood screw; the model draws a cylinder head. It needs a countersink in the strap eye (a plain bought disc on the page). The M6 screws' lengths and the tongue's chamfer rest on unsure readings and stay.
- **The owner's decisions (3 November 2026):** F1+F2 corrected: the tooth on the square's flat, the hook at 15° to the square, the set-up snapped to the nearest whole tooth, the mainspring physics rerun with the rest. The stud's screw (05 08_6's 5 against 4.1) is investigated first.
- **R6b, the stud's screw on the upper cock: investigated, not a difference.**
  - On 05 08_6, enlarged, the "5" runs from the hole's centre to the slot's far edge and the "4,2" to the arm's centre line.
  - The model has the hole 4.1 from the slot's centre plus its half-width 0.9, so 5.0 from that edge and 4.2 across: the printed figures. That is the stud's own "5 ±0.1 from the end" (05 03_9) with its upright flush in the slot.
  - The sheet's lines aren't to scale there: the hole is drawn about 6.3 from the edge. The verifier's 5.1 from the axis was scaled.
- **F1+F2, the set-up ratchet, the arbor's square and its hook: corrected (not yet checked).**
  - **The relations, as drawn:**
    - The ratchet's square hole has a flat's normal through a tooth's tip (05 07 00-3).
    - The arbor's square has its flat's normal 15° from the hook, counterclockwise seen from the square's end (05 07 02's end view, first-angle, likely); in the page's angles the normal is at HKA + 15°.
    - These make the arbor, square, ratchet and hook one unit.
  - **The set-up snaps.** 05 06_20's "3/4 Umgang gespannt" (12 teeth) from the spring lying on the wall now falls back to the first place where the click holds a face. HKA rises by `SU_S` (under a tooth), so the set-up is `SU` = 0.75 − SU_S/2π turns (`fusee.js`, exported as `SU`).
  - **Where it changed:** `fusee.js` (the hole's fixed turn `fL`, the squares `SQM` and ratchets `SRM` turned at HKA, `srTurn`/`sqTurn` in userData). The recipes `setupRatchet` (the hole on the tip's normal, the whole turned by `srTurn`; no `free_spin`) and `barrelArbor` (the square turned by `sqTurn`).
  - **Pending, at the runs:**
    - read `SU` off the page;
    - set the physics' set-up to it (`wempe_mainspring.py`'s `setup` 0.75, and wherever the drive's set-up is taken), then the mainspring, drive and escapement chain;
    - recipes, solids, `fine.py`, `maintaining.py --model wempe`;
    - isolate.
  - **Its stand-out is not a difference.** It is 0.475 from the core's r 6.65 at the face, radially from the arbor's axis, inside 05 07 02's "0,5 −0,05" (drawn radially at the hook's tip). The audit's 0.25 is the head's extent along the pin's own axis (6.90), which runs 15° off the face (7.125 × cos 15° ≈ 6.88).
