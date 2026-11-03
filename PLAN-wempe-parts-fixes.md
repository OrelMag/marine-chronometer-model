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
