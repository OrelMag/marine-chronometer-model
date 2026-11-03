# The Wempe model against the works drawings: the findings explained

For the owner, 3 November 2026. Nothing in the model was changed. This only explains `WEMPE-PARTS-LEDGER.md`. No scan or crop of a sheet is in it, only figures and words. It was written from the ledger, the readers' and verifiers' reports, `earlier-passes.md` and the Wempe README, without re-reading the sheets. Where a reason is not recorded, it says so.

## 0. What this covers and how to read it

- The audit compared 187 parts of the model, as last revised, with 111 works sheets (1,670 items). The agents ended with 150 mismatch, 22 not built and 12 extra. Counting each reader/verifier pair once, and the gold spring's bending point as a match (the ledger's own override), about 184 items remain. This text groups them into **45 findings**, plus a list of what is not a difference (section 9).
- **Drawn** is what the sheet prints, with its tolerance where printed. **Built** is what the exact solid of the model measures.
- "Match" in the ledger means inside the sheet's tolerance. Where none is printed, it means inside the sheet's general tolerance, or the fallback: ±0.05 to 6 mm, ±0.1 to 30, ±0.15 to 120.
- A sheet's date is its latest revision date. Certainty words (sure, likely, unsure) are the readers' and verifiers'. The scans are about 1,024 px across, so scaled figures carry ±0.1 to 0.3 mm.
- Counts: A timing 10, B train 7, C fusee 7, D barrel 5, E motion work, hands, dial 5, F frame 9, G case, keys, box 2.

### The owner's rules as applied

1. **Two sheets disagree: the later-dated sheet decides.** A revision date counts as the sheet's date.
2. **The later sheet's size clashes with a mating part whose sheet is older or absent, and no later assembly sheet or photograph settles the pair: "your decision".**
   - Options: (a) the later sheet's size, changing the neighbour as little as possible; (b) keep the present fit and record the departure.
   - Each case says whether an assembly sheet or photograph bears on it. The model keeps its present fit meanwhile.
3. **A sheet dated after war-time production counts as "later" only after a check that it revises this chronometer.**
   - 05 05_4, 05 05_7 (6.6.46), 05 05_9, 05 05_10 and the 1948 barrel and fusee revisions carry the same drawing numbers as the parts lists of the 1940/43 assemblies (05 05 01-2, 05 05 02-2, 05 07 01-1, 05 06 04-2). They revise this chronometer and count as later.
   - 05 04_4 (staff kompl., "29.5.", year read as 1946, likely) carries the number 05 04 02 that the older 05 04_5 (4.4.41) only has by hand. It counts as later than 05 04_5.
   - **05 03_3.2 (staff, "Unruhwelle Kpl.", number 050401, tempered 210°, 12.3.65): needs the version check.**
     - The number 05 04 01 is the Wempe family's number for the staff, but this chronometer's staff kompl. is 05 04 02 (05 04_4), tempered 240°.
     - A neighbouring sheet, 05 03_3.1 (17 04 01, 7.6.43), is another calibre's staff.
     - The title block does not say which chronometer it belongs to, so it can't be settled here.
     - The model already takes its lengths (25.6 total, 12.6 lower pivot) from it. Nothing should be changed on its authority until the check is done.

---

## A. Timing: the escapement, balance and hairspring (10 findings)

### A1. The escape wheel's place against the detent (06-1-7, 06-1-12, 06-1-13, 06-1-14)
- **Sheet:** the layout 05 04_1, Hemmung für Feder-Chronometer (3.2.40). The 23.8 is sure; the 0 and 53.6 are likely (scaled).
- **Drawn:**
  - the wheel's centre lies directly under the locking stone's pipe, the line to it square to the detent (0 ±0.1 along the detent);
  - the angle at the pipe between the detent axis and the balance-to-wheel line is 53.6° (scaled ±1);
  - wheel centre to the M1.7 block-screw hole is 23.8.
- **Built:**
  - the wheel stands 0.447 mm along the detent from the pipe;
  - the angle is 49.4°;
  - the distance to the hole is 23.41;
  - balance to wheel is 10.00, as drawn.
  - The verifier measured the detent as turned 3.6–4° about its pipe; a rougher estimate from the detent's box gives about 5°, in the same direction.
  - The layout's chain (18.8 along, 14.6 across) closes on 23.75 with the wheel under the pipe, and on 23.41 with the built offset.
- **Affects:** timing (lock, let-off, drop), because the detent's turn moves where the stone meets the teeth.
- **Why:** the top plate's table (05 08_1, 15.6.43, later than the layout) puts hole 13 at 23.41 from the wheel.
  - README, Kept: "the block screw on the plate table's hole 13 (23.41, Wempe 3955 23.36) against 05 04_1's 23,8".
  - Wempe 3955's photograph measures 23.36 ±0.15. So a photograph agrees with the plate.
  - Nobody had noted the 0.447 offset and the turn; they follow from taking 23.41.
- **Under the rule:** the later plate table decides the 23.41, and the model follows it. No later sheet places the wheel itself (05 04_2, _3 and _10 give block and detent sizes only). The layout's other lines (wheel under the pipe, 53.6°) cannot all be kept with 23.41.
- **Action: your decision.**
  - (a) Keep 23.41, the wheel 0.447 off the pipe line, the detent turned about 4°. The escapement tools were solved on this geometry.
  - (b) Put the wheel under the pipe at 53.6° and move plate hole 13 by 0.39 to 23.8. That departs from the plate's table, and every escapement tool must be rerun.
  - Recommended: (a).
- 06-1-14 (15° label, built 15.8°): the number fits a drawn line; unsure what it attaches to; skip.

### A2. The hairspring's pitch and heights (08-2-5, 08-1-2, 08-1-3, 08-1-4, 08-1-v1)
- **Sheets:** 05 03_6 (26.6.41) and 51 03_5 (29.10.41). They agree with each other. The pitch is sure (three readings 0.73–0.74, none 0.80); the heights are likely.
- **Drawn:** strip 0.52 + gap 0.21 = pitch 0.73; 15 turns over 11.5. On the assembly: stud arm's inner face to spring top 3.15; collet face to the spring 0.75; spring overall 9.5; 3.15 + 9.5 + 0.75 = 13.4.
- **Built:** pitch 0.8003 (gap 0.280), so the helix is 9.97 tall; 2.89 + 9.97 + 0.49 = 13.35. The strip stands about 0.25 past the drawn ends.
- **Affects:** appearance and the ends in stud and collet. The period is not affected: the physics keeps the wound pitch.
- **Why:** README: "the drawn helix opened between them to a pitch of 0.80 (the 11.8 turns of helix this model reads; 05 03_5 draws 13 pitches of the wound 0.73), the physics keeping the wound pitch". The ends were put in their holes and the helix opened to fill the gap.
- **Under the rule:** both sheets say 0.73 and 9.5; no later sheet disagrees. The model should be 0.73 and 9.5.
- **Action: correct.** Use pitch 0.73, height 9.5 and the ends 3.15 and 0.75. Fifteen turns at 0.73 would be 10.95 tall, so the turn count must also be settled (the drawn counts run 11.5–13). Rerun `hairspring.js` and `wempe_hairspring.js`.

### A3. The collet's bore and cross hole (08-4-5, 08-4-7, 08-4-11, 08-4-14, 08-4-v2)
- **Sheet:** 05 03_8 Spiralrolle (24.2.43).
- **Drawn:** bore 1.6 H7 (+0.009), taper 1:70, (1.55) at the other face (bracketed reference). Cross hole 0.8 +0.01 at the entry, (0.77) at the other end, taper 1:90, drilled 0.7 first. A centre-punch mark.
- **Built:** bore 1.6029 at the first face (inside the limit), 1.65 at the other. Cross hole 0.805 straight. No punch mark.
- **Affects:** fit only.
- **Why:** pass 1 opened the bore on purpose: "the sheet's 1,6 would stand 3.15 over the arm, against 05 03_5's 13,4 and 0,75". The hole's taper was left out (pass 2, open).
- **Under the rule:** 05 03_8 (1943) is later than the assembly 51 03_5 (1941), and its bore clashes with the assembly's heights. No later assembly or photograph settles it. Rule 2 applies.
- **Action: your decision (small).**
  - (a) Taper 1.6 to 1.55 and accept the collet standing 0.10 higher.
  - (b) Keep.
  - Recommended: (b). The 1:90 hole taper and the punch mark are optional.

### A4. The hairspring stud (08-5-13, 08-5-15, 08-5-v2)
- **Sheet:** 05 03_9 Klötzchen (6.6.41).
- **Drawn:** spring hole about 0.68 from the leg's end (scaled, unsure; "drilled at assembly"). A rounded point (a 0.8 mark; the arc is plain on the crop). The notch apex rounded.
- **Built:** hole 1.35 from the end; sharp point; apex not rounded.
- **Why:** README: the round point is the blank's, and the facets ground to the knife edge leave no metal for it, so it is kept. The built hole is where the page's strip passes.
- **Affects:** appearance, and where the strip is clamped.
- **Action:** keep the point. The hole is your decision; recommended keep, since the sheet says it is drilled at assembly.

### A5. The detent spring's tail tip (06-5-4)
- **Sheet:** 05 04_10.1 Gangfeder 1436 (Rud. Grießbach, 12.2.43). Likely.
- **Drawn:** tail width at the tip 0.25 (0.22), the same as at the pipe. The callout meets the blank's straight edges.
- **Built:** 0.22 at the pipe, narrowing to a 0.054 sliver at the tip.
- **Affects:** a little stiffness, and appearance.
- **Why:** not recorded; neither earlier pass found it.
- **Action: correct** to a constant 0.22 to the tip, unless the taper was meant. Rerun `tripping.js`.

### A6. The detent block (06-3-13, 06-3-28)
- **Sheet:** 05 04_3 Gangfederkloben (8.7.43).
- **Drawn:** the M1.2 cross hole centred on the 3 mm (z 5.0, scaled ±0.06). The two Ø 0.45 steady-pin holes are not on the sheet.
- **Built:** hole at 5.15 (+0.15; general tolerance ±0.1). Both pin holes present.
- **Why:** pass 2 (2-M6, 2-M8): no pin holes drawn, the Ø 0.45 an estimate, open.
- **Action:** correct the M1.2 hole to 5.0. Keep the pin holes as an estimate.

### A7. Layout items the later block sheet replaced (06-1-17, 06-1-20, 06-1-25, 06-2-9, 06-4-15)
- **Sheets:** 05 04_1 (3.2.40) against 05 04_3 (8.7.43), 05 04_2 Goldfeder (16.9.42) and 51 04_6 Heberolle (11.2.41).
- **Differences:**
  - stud circle from the M1.7 centre: drawn about 3.8, built 4.50;
  - the 45° chamfer of about 3.8 × 3.8 on the arm-side corner: not built;
  - arm thickness: layout section 2.8, built 3.0;
  - the gold spring blank is drawn straight on 05 04_2, and the built spring is bent in plan;
  - the Heberolle cut centre 5.927 is not printed: extra.
- **Under the rule:** the block sheet (1943) is later, so 4.50, 3.0 and no chamfer are right. The straight blank is a blank. **Keep all.** The gold spring's bending point (06-1-15) is a **match**: the sheet marks it about 6.2 from the stone's pipe with a dashed line, and the model has 6.15.

### A8. The balance staff (07-1-4, 07-1-16, 07-2-2, 07-2-3, 07-2-5, 07-2-7, 07-2-8, 07-3-1, 07-3-3, 07-3-5, 07-3-6, 07-3-10, 07-3-13, 07-3-14, 07-3-19) — NEEDS THE VERSION CHECK
- **Sheets, oldest first:** 05 04_5 (4.4.41, rechecked 1943), 05 04_4 (29.5.46, likely), 05 03_3.2 (12.3.65, see rule 3).
- **The model mixes them:** lengths from the 1965 sheet, fits and the straight flange from the 1946 sheet.
- **Against 05 03_3.2 (all likely):**
  - upper pivot 1.25 −0.02 (1.23–1.25), built 1.2 (−0.03);
  - lower pivot shaft 1.25 −0.02, built 1.2155 (−0.0145 under);
  - lower collar 1.65 −0.02 (1.63–1.65), built 1.6685 (+0.0185 over);
  - collar above the hub 2.10 −0.02 (digit unsure; 2.40 or 2.10), built 2.0;
  - lower collar length 1.6, built 1.5; hub top to collar end 5.7, built 5.6;
  - lower pivot collar to tip 6.9, built 6.99 (the split is wrong, the sum 12.6 is right);
  - a 10° taper on the hub flange (wide at the top), built vertical.
- **Against 05 04_4 (1946):** the 1.65 s6 shaft at the hub end of the taper should be 1.665–1.672, built 1.6514 (−0.0136). The sheet's own taper does not reach 1.665 either.
- **Against 05 04_5 (1941):** collar 2.1 ±0.03 (built 2.0), its length 1.3 (built 1.1), flange top to sleeve end 4.7 (built 4.1), flange top to lower tip 14 / 14.03 (built 12.59), and the 10° flange taper.
- **Affects:** the pivots and collars set the jewel fit and the seats for the collet and roller. The inertia changes only at about 0.001 mm.
- **Why:** README: 14.03 runs to the lower centre's apex on the stock. A finished staff that long would put the pivot 0.23 past the lower cock. The pivot's 6.9 + 6.1 top lengths come from the 1965 sheet.
- **Under the rule:** the 1941 figures (14, 4.7) lose to the later sheets, so the model is right on those. For 1.25, 1.65, 2.10, 1.6 and 5.7 the 1965 sheet would win, but it needs the version check.
- **Action: your decision, after the check.**
  - (a) If the sheet is confirmed for this chronometer: pivots 1.25 −0.02, collars 1.65 −0.02 and 2.10 −0.02, 1.6/5.7, the 10° taper. The jewel holes must then be widened to keep 0.02 clearance.
  - (b) Keep the 1946 sizes.
  - Recommended: wait for the check. The 1.2155 and 1.6685 are real misses of the limits that apply today; fix them whatever the answer.

### A9. The balance rim and hub (07-5-11, 07-6-2, 07-6-10, 07-6-17)
- **Sheets:** 05 03_2 (23.6.41) and 05 03_4 (31.7.41).
- **Differences:**
  - the nickel-steel / brass boundary at Ø 31.29 −0.04 (sure) is not built: the rim is one solid;
  - the hub hole 1.8 H7 × 0.4 is a flat counterbore at one hole on the sheet, and a countersink at both holes in the model (unsure which hole);
  - the eight "Körner in 60 Teilung" punch marks are not built;
  - an unclear "39" on 05 03_2; read as a diameter, the sheet and model differ by about 1.2.
- **Affects:** the boundary is a material split, not a shape. The physics already treats the rim as a cut bimetal. The rest is appearance.
- **Note:** the ledger's own comparison with the earlier passes thinks the new pass is wrong to count 07-6-2.
- **Action:** keep the boundary and the marks. Correct the counterbore if you want it exact. The 39 is unread: leave.

### A10. The balance's jewel stacks and the cocks (03-3-13, 03-3-18, 03-8-2, 03-8-4, 03-8-6, 03-8-8)
- **Sheets:** 05 08_6 (U 30, 1941), 05 08_33 (U 31, 1941, a copy), 05 08_4 (19.4.41, rev. 2.12.46).
- **Jewel stacks:** printed 1.4 + 1.4 (likely). Built 1.63 + 1.17 (upper) and 1.53 + 1.19 (lower). The lower stack is printed 0.1 proud, built flush.
- **Upper cock:** pin hole along the arm: 5 printed; built 4.1 to the axis (the verifier found the drawn pin 5.1 from the axis).
- **Lower cock:** width in Ansicht A drawn 19.75, built 20.0 (+0.25, over 0.15); arm thickness 3.3 printed, built 3.22.
- **Affects:** the stacks set the endshake and oil gap of the balance's pivots (checked in `bom.py`); the pin hole sets the stud's pin.
- **Why:** README, Estimated: every jewel and setting has "no sheet"; the sizes are scaled on the coloured section (pictorial, ±0.1). Pass 1: "split differs, recorded estimate".
- **Action: your decision.**
  - Stack: keep, unless the printed 1.4 + 1.4 can still give the endshake band.
  - Lower cock's width: correct to 19.75.
  - Arm 3.3: correct (0.08 over the fallback).
  - Pin hole: unsure, leave.
- Note: 05 08_33 draws an earlier lower cock of another shape; the model follows 05 08_4, which matches.

**Small items in A**

| id | Part | Drawn | Built | Action |
|---|---|---|---|---|
| 08-4-14 | collet | punch mark | none | optional |
| 08-5-15 | stud point | round 0.8 | sharp | keep (README) |
| 08-5-v2 | stud notch | rounded apex | sharp | appearance |
| 07-1-4 | staff shaft | 1.665–1.672 | 1.6514 | A8 |
| 06-3-28 | block | no pin holes | two Ø 0.45 | keep, estimate |
| 06-4-15 | Heberolle | cut not printed | 5.927 | keep |
| 06-1-14 | layout | 15° | 15.8° | skip |

---

## B. The going train (7 findings)

### B1. The 1946 pinion pivots (04-4-1, 04-4-15, 04-7-9, 04-7-10, 04-4-18, 04-4-v1, 04-4-v2, 04-7-v1, 04-2-v1)
- **Sheets:**
  - 05 05_4, the seconds pinion (drawn 4.6.46, checked 12.6.46, revised 24.3.48): upper pivot 9.2 (sure, tip to collar top), lower 4.5;
  - 05 05_7, the intermediate pinion (6.6.46): both pivots 4.6 −0.2;
  - the assemblies 05 05_2 and 05 05_5 (27.7.40, N.gepr. 20.4.43): 7.2 / 3 and 3 / 3;
  - the layout 05 05_1 (undated) also fits 7.2.
- **Built:** 7.2 / 3 (seconds), 2.95 (intermediate). Tips are flat or domed where the part sheets draw pointed cones (base 0.65 / 0.82).
- **Affects:** assembly. With the part sheets' lengths:
  - the lower pivots would stand 1.1–1.2 mm outside the Oberplatte;
  - the intermediate's upper pivot 1.5 mm outside the Zwischenbrücke;
  - the seconds post 2 mm further past the dial.
  - Friction is unchanged.
- **Why:** README: the pinion sheets' 4.5–5.1 are "the turned blanks', each with its 60° centre, which the kompl. sheets show cut to 3 and rounded". The 1946 sheets' revision notes do not list the pivot lengths as changed.
- **Under the rule:** the part sheets are later and revise this chronometer, but their lengths clash with the plates, bridge and dial, whose sheets (1943) are older. No later assembly sheet, and no photograph shows the pivot ends. Rule 2 applies.
- **Action: your decision.**
  - (a) Pivots 9.2/4.5 and 4.6/4.6, with the plates, bridge and dial changed as little as possible. That means pockets or thicker plates and a longer dial post, and no minimal change keeps every other sheet.
  - (b) Keep 7.2/3 and 3/3 and record the departure on the lathe-centre reading.
  - Recommended: (b). The tips (pointed cones against domes) are an optional correction.

### B2. The centre pinion and arbor (05-3-6, 05-3-9, 05-3-14, 05-3-15, 05-3-18)
- **Sheets:** 05 05_10 (7.6.40, revised 20.4.43) against 05 05_8, the assembly (22.7.43, checked 7.9.45).
- **Drawn / built:** top of cone C to upper tip 16.7 (built 14.3); shoulder to upper tip 39.65 (37.33); lower pivot 5.1 (3.0); collar 5.4 n6 = 5.408–5.416 (5.4); rivet lip 3.6 (3.2).
- **Under the rule:** the later assembly shows the arbor ending at the cannon's top and a lower pivot of 3, so the model follows the later sheet. **Keep.**
- The n6 collar is built at nominal, 8 µm under its limit: the model draws fits at the middle of their range (README), so keep. The rivet lip 3.6 is the riveted flare; the model draws it unriveted, so keep.

### B3. The escape arbor and pinion (05-7-4 to 05-7-7)
- **Sheets:** 05 04_8 (7.6.40) against the assembly 05 04_7.2 (19.7.43).
- **Drawn / built:** pinion 5 (built 4.0); tip to pinion top 6.5 (5.3); overall 26.5 (22.78); arbor above and below the pinion 1.6 (1.2).
- **Under the rule:** the later assembly gives the shorter arbor with the collet. The model follows it. **Keep.**

### B4. Plate figures on the train layout (04-1-3, 04-1-7, 04-1-8, 04-1-9)
- **Sheet:** 05 05_1 (undated, the oldest numbering).
- **Drawn / built:** Oberplatte face to centre wheel top 17 (17.26); plates 3.0 (3.35); Zwischenbrücke 4 (3.8). The drawing's proportions fit the built values; only the labels disagree.
- **Under the rule:** the plate sheets (1943) give 3.35 and 3.8 and are later. **Keep.**

### B5. Tolerances and tapers

| id | Part | Drawn | Built | Action |
|---|---|---|---|---|
| 04-2-8 | seconds wheel hub | 6 (assembly) | 6.4 (part sheet 6.3–6.5; Wempe 3955 shows a Ø 6.4 ring) | keep |
| 04-2-5 | seconds lower pivot Ø | 0.8 −0.02 | 0.81 | keep; the part sheet prints 0.82 −0.02, which contains it |
| 04-5-4 | intermediate pivot Ø | 0.82 −0.02 | 0.825 | keep; 05_7 prints 0.85 −0.05 |
| 04-2-7 | pivot taper | 1:90 | 1:83 (lower pivot) | optional, no timing effect |
| 04-4-10 | seat under leaves | 2.6 n6 | 2.6 | keep, middle-of-range rule |
| 04-7-3 | seat | 4.0 n6 | 4.0 | keep |
| 04-4-v3 | general tolerance | ±0.1 on the 7 and 4.5 | - | note only |

### B6. The maintaining detent's hollow (05-5-6, 05-5-7)
- **Sheet:** 05 05_12 (19.7.44), sure.
- **Drawn / built:** R9 hollow centre 9.645 / 6.273; built 9.781 / 6.033 (+0.136, −0.24, tolerance ±0.1).
- **Why:** pass 1 matched it, then pass 2 reshaped the detent and it may have moved. The verifier notes 6.273 conflicts with the sheet's own scale (about 6.07 from R9 through the tip).
- **Action: correct** to 9.645, then run `maintaining.py --model wempe`. If that fails, keep and note the sheet's inconsistency.

### B7. The cannon (05-1-7, 05-1-10)
- **Sheet:** 05 05_8 gives length 14.3 (sure), built 14.19 (−0.11, over the ±0.1 fallback). It also draws a half-round Körner groove "4 r" that the section lacks; the model has three cone dimples.
- **Action: correct** the length; the groove is optional (fit and appearance).

---

## C. The fusee and its maintaining work (7 findings)

### C1. The fusee arbor (09-6-1, 09-6-3, 09-6-10)
- **Sheet:** 05 06_15 (29.11.40). The length is likely.
- **Drawn:** overall 60.6 −0.2; left pivot about 6.1 (derived); square 3.17 tapering 1:100 to 2.92, 20.3 long.
- **Built:** 58.125; left pivot 3.625; the tip flat.
  - The square measures 4.41–4.16 across corners, which is 3.12–2.94 across flats. The "+1.24" is a corner-against-flat artefact; the real difference is about 0.07 under at the shoulder (likely).
  - The square's taper is built 1:110 against 1:100.
- **Why:** README: "Its 60.6 overall counts two lathe centres: the dial end's is cut off (its end 0.25 under the dial), the square's end is that centre's point". Pass 2's 5-M1 corrected the square to 3.12.
- **Under the rule:** one sheet, so there is no conflict.
- **Action:** keep the length and the pivot (owner's reading). **Correct** the taper to 1:100.

### C2. The fusee arbor's journals against plate, bush and wheel (01-3-7, 02-4-10, 10-3-17)
- **Sheets, with dates:**
  - the arbor 05 06_15 (29.11.40): pivot Ø 2.8 ±0.02 tapering to 2.7 in the pillar plate; Vorreiber seat 4.38–4.5; bush journal 4.5–4.39 (1:70);
  - pillar plate 05 08_3 (23.4.43): hole 10 calibre **2.70 ±0.009**;
  - fusee bush 05 08_8 (14.1.41, N.gepr. 30.4.43): bore **4.1 +0.2**;
  - fusee wheel 05 06_7 (29.11.40): bore **4 +0.1**; its assembly 05 06_1 (15.3.41): fits 4.45 H7/g6 and 6.5 H7/g6.
- **Built:** hole 10 Ø 2.82; bush bore 4.52 ("the sheet's 4.1 +0.2 opened to the arbor's 4.5"); wheel bore 4.55.
- **Affects:** fit only. The arbor cannot enter a 4.1–4.3 or 4.0 bore, and a 2.70 hole cannot take a 2.8 pivot. Pass 2: a 4.45 H7 bore would wedge on the 1:70 seat.
- **Under the rule:** the plate and bush sheets are later than the arbor but clash with it, and the 05 06_1 assembly (earlier than the plate) does not settle it. No photograph gives these diameters. Rule 2 applies.
- **Action: your decision.**
  - (a) Narrow the arbor to the later sheets: pivot 2.70, journals about 4.1–4.3, wheel seat 4.45. That departs from the arbor's own sheet and thins the journals; check `wempe_strength.js`.
  - (b) Keep the present fit and record the departure.
  - Recommended: (b).

### C3. The fusee body (09-2-3, 09-2-5)
- **Sheet:** 05 06_2.2 (22.9.41, revised 27.2.48), likely.
- **Chamfer:** drawn 45° from recess to face, outer Ø 29.8 +0.2; built 29.4 (−0.4), with a 0.95 straight wall the drawing does not show. The sheet disagrees with itself.
- **Length:** the 12.6 −0.1 is stale. Its own revised sizes and the later 05 06_3.2 (31.3.48) give 12.3 −0.1; built 12.35, marginal.
- **Action: correct** the chamfer to 29.8 and remove the straight wall; check the clearance to the ratchet plate. The groove's floor radii, pitch, width and depth match.

### C4. The Vorreiber (10-2-1, 10-2-2, 10-2-11, 10-2-14)
- **Sheet:** 05 06_6 (15.4.41).
- **Drawn:** length 3.1 −0.2 (sure); flange 1.2 −0.2 with a 0.3 chamfer; cross hole 0.8 through.
- **Built:** 2.76 (−0.14 under the limit); flange 0.86; hole 1.15 with a 1.16 × 8.3 pin.
- **Why:** README: "the Vorreiber's face a re-turned to 2.76", the sheet's own assembly note, "its flange 0.86". The pin: three sheets give three sizes (hub 0.8; arbor 1.1 taper-reamed; 05 06_1 1.2), and the parts are reamed through together at assembly.
- **Under the rule:** the sheet's own note gives 2.76 as the finished size. **Keep.** The pin size is your decision only if you want a standard size; recommended keep.

### C5. The fusee wheel's rim and edges (10-3-7, 10-3-24)
- **Sheet:** 05 06_7. The section prints 40.65 −0.05 ("gedreht 41,1"), while its table gives D 40.57 rolled; built 40.569 follows the table. The sheet disagrees with itself. The boss top "Kante leicht brechen" has no size; built sharp.
- **Action:** keep; the edge break is optional.

### C6. The cover plate's screw and the pins 71 (10-4-9, 10-5-4)
- **Sheets:** 05 06_8 (15.4.41) and 05 06_9.
- **Differences:**
  - WN-20 is not drawn on the cover plate sheet; the model has it, filling the 3.1 countersink and 1.8 hole;
  - two rivets 1.25 × 2.5, drawn unsure; built 1.16 × 2.48.
- **Action:** keep WN-20 (the sheet has holes for it); correct the rivet diameter if you want.

### C7. The click spring's arm and the round hook (11-3-v1, 11-6-8, 11-6-9)
- **Sheets:** 05 06_13 (6.5.41) and 05 07_12 (18.3.43).
- **Click spring:** the arm is drawn as one arc R10.4 about the ratchet axis; the built arm drifts up to 0.4 off it. **Correct.**
- **Round hook:**
  - Flank 30° (built 31.7°): the sheet is over-dimensioned; its own two R0.4 circles give 31.7. **Keep.**
  - Body arc R6, centre 3.55 across and 2.8 along (printed); built R5.93, (3.47, 1.70). The model follows the drawn dot at 1.7, not the printed 2.8.
  - **Action: correct** R6 and 3.55. Check 2.8 against 1.7 on the sheet first (the sheet contradicts itself).

**Small items in C**

| id | Part | Drawn | Built | Action |
|---|---|---|---|---|
| 09-6-10 | arbor square | 3.17–2.92 | 4.41–4.16 | measure artefact |
| 10-2-14 | pin 050600-5 | not drawn | 1.16 × 8.3 | keep |
| 10-3-24 | boss edge | edge break | sharp | optional |

---

## D. The barrel (5 findings)

### D1. The arbor's necks, pivots and chamfers (12-8-7, 12-8-8, 12-8-9, 12-8-11, 12-8-12, 12-8-4, 12-8-5, 17-1-24, 17-1-25)
- **Sheets:** 05 07_9 (4.7.41) and the assembly 05 07_8 (28.1.43), which repeats the same sizes.

| Feature | Drawn | Built |
|---|---|---|
| ball-side neck Ø | 5 (scaled 4.8–4.9) | 4.48 |
| neck length | 6.7 ±0.05 | 6.77 |
| ball pivot Ø | 3 | 2.88 |
| square-end neck | 5 × 3.5 | 4.48 × 3.94 |
| small neck | 4 (about 3.1 long) | 3.88 × 2.92 |
| chamfer end Ø | 9 | 10.0 |
| chamfer | 22.5° × 0.8 | 45° × 1.65 |

- **Why:** README: "each drawn to the later parts it runs in". The pivots 2.88 and 3.88 sit in the plate's 2.90 and the bridge's 3.9 (the sheet's 3 and 4 cannot enter them). The journals 4.48 go in the drum's 4.55 (a 5 cannot). The chamfers follow the 1948 drum's boss gaps (0.05).
- **Under the rule:** the plate (23.4.43), the bridge and the drum (rev. 20.4.48) are all later than the arbor, and the model follows them. **Keep.** The arbor's sheet is the older one.

### D2. The hook on the arbor (12-1-18, 12-7-4, 12-7-5, 12-7-7, 12-8-6)
- **Sheets:** 05 07_8 (28.1.43), 05 07_9, 05 07_1.
- **Drawn:** hook stands 0.5 −0.05 out of the body (unsure), at 15° to the square's flat normal (likely), on a Ø 2 pin. The hole is blind 6 deep on 05 07_9 and 05 07_1, and through (dashed) on the later 05 07_8.
- **Built:** the hook stands 0.25 (the verifiers say "built is half"), the hole axis at 45°, the hole through.
- **Why:**
  - The hole through follows 05 07_8, the later sheet, so that is right.
  - The angle: pass 1 read the 15° as the hook's radial face from the vertical centre line.
  - The README says the head is built "0,5 −0,05 high (drawn 0.475)", with the face at 15.5°. That doesn't match the audit's measure of 0.25 and 45° for the hole axis. One of the two is wrong, so this needs a re-measure on the solid.
- **Affects:** where the spring's eye bears; the mainspring's start. Not timing directly.
- **Action: correct after the re-measure.** Target stand-out 0.5 −0.05 and the face at 15° from the vertical. Keep the through hole.

### D3. The body length, the spring space and the lid gap (12-1-6, 12-1-11, 12-1-13, 12-8-3)
- **Sheets:** 05 07_1 (13.4.41) and the arbor sheets (1941/43) against the drum and lid revisions 05 07_6 and _7 (rev. 20.4.48) and 05 07_4 (rev. 20.4.48).
- **Drawn / built:** body 12 (11.58); lid outer face to body 2.9 (3.35); spring space 15.8 ±0.1 (15.63).
- **Under the rule:** the 1948 revisions are later and give 18.1 − 3.1 − 3.3 − 0.1 = 11.6 for the body. The model follows them. **Keep.**

### D4. The set-up ratchet (12-2-7, 12-2-8)
- **Sheet:** 05 07_3 Sperrrad (9.4.41, rev. 14.11.47).
- **Differences:**
  - Square hole 2.7 H7 (2.700–2.709), 1:100; built 2.6975 at the large end, 2.5 µm under. Keep.
  - Square orientation: the drawing puts the tooth tip on the axis along a flat normal; built it is turned 9.9° or 12.6° off, and no tip lies on a flat normal. Neither earlier pass found it. Likely.
- **Affects:** where the tooth sits against the set-up click.
- **Action: correct** the turn of the square to the tip, then rerun `wempe_ratchets.js`.

### D5. The lid and drum (12-5-2, 12-5-18, 12-6-1, 12-6-11)
- **Sheets:** 05 07_6 (title block 51 07_6, 28.2.41, rev. 20.4.48) and 05 07_7.
- **Differences:**
  - Lid seat 39.2 s6 (+0.043 to +0.059), built 39.2: an interference fit drawn at nominal. Keep.
  - Slot reach 0.95 +0.15, built 0.92. The pocket's outer edge is 19.13, not the wall at 19.25, so the 0.8 and 0.95 cannot both hold as built (a 0.12 lip). Correct to 0.95.
  - Narrow notch bottom 18.3 ±0.02, built 18.328: marginal, keep.

---

## E. The motion work, hands and dial (5 findings)

### E1. The hour wheel's collar (14-3-2). Your decision, rule 2.
- **Sheet:** 05 02_8 Stundenrad kompl. (20.7.40, N.gepr. 27.4.43).
- **Drawn:** collar top 5.2 −0.1 above the foot (sure; the arrows are clear).
- **Built:** 3.585 (1.615 less).
- **Why:** README: "fitted to end 0.3 under the dial with the wheel on the cannon pinion: its sheet (05 02 03, 1940) gives 5.2 −0.1, which with 05 05 03's tube (1943) would put the Ø 8.0 collar 1.4 into the dial's Ø 6 hole; its overall 8.2 kept".
- **Under the rule:** the tube sheet 05 05_8 (22.7.43) is later than the collar's sheet, and the dial (05 02_12, 2.7.40) is older. The collar as drawn clashes with the dial and the tube.
  - Bearing on it: 05 02_1 (28.3.41), the hands assembly, shows boxed heights and about 0.3 of play to the dial, and it is older than the tube. Wempe 3955's dial photograph gives the collar's diameter (8.01) but no height.
  - No later assembly sheet settles it.
- **Action: your decision.**
  - (a) Follow the 5.2, with the dial and the cannon changed as little as possible (for example a longer cannon tube or a dial recess). That departs from the dial and tube sheets.
  - (b) Keep 3.585.
  - Recommended: (b).

### E2. The hand stack's gaps (13-1-10, 13-1-11, 13-1-12, 13-1-v1, 13-1-v6)
- **Sheet:** 05 02_1 (28.3.41). All unsure.
- **Differences:**
  - dial top to hour hand blade drawn 2 (scaled 1.64), built 1.78;
  - minute boss to hour flange "0,2?" (or 0,4), built 0.72;
  - the up-and-down stud "12,7" (length or diameter), built 12.3;
  - a part under the dial 0.1 clear, built 0.8.
- **Why:** pass 2 lowered the hands by about 0.95 to the boxed figures. The README says the hour hand's height is "set by how far it is pressed".
- **Action: your decision, low priority.** Appearance and play. The sheet's figures are unsure, so leave the 0.72 unless the sheet is re-read.

### E3. The hour hand's bore (13-3-5)
- 05 02_3 (14.6.40): 4.4 H7 (+0.012). The narrowest diameter is 4.4155, 3.5 µm over; the mean is 4.4377. For the minute hand the narrow end lands inside. Keep (a taper artefact).

### E4. Dial feet (13-6-14)
- 05 02_12 (2.7.40): the assembly shows the dial on posts ("Festsitz"); the model's dial has none. Extra/absent, appearance only. Keep; the dial rests on the ring.

### E5. The change and up-and-down wheels (14-1-13, 14-2-10, 14-6-13, 14-4-v1)

| id | Part | Drawn | Built | Action |
|---|---|---|---|---|
| 14-1-13 | change pinion tips | about 7.2 (scaled, unsure) | 6.90 | keep; the scale is too loose |
| 14-2-10, 14-6-13 | riveting sink on the change wheel and up-and-down wheel bores | not on 05 02_7 and 05 02_11 | 0.4 × 30° | keep; 05 02_6 and 05 02_9 draw it |
| 14-4-v1 | blank 20.2 / 1.05 | blank sizes | - | not a difference |

---

## F. The frame: plates, cocks, bridges, bushes, pillars (9 findings)

### F1. Hole 26, the escape wheel's seat in the plates (01-2-7, 01-2-22, 01-4-6, 01-4-17)
- **Sheets:** 05 08_1.b (top plate, 15.6.43) and 05 08_3.b (pillar plate, 23.4.43). Pass 1 read the same figure as "4,5 in 4,59" and built 4.596 on purpose (a06819b9).
- **Differences:**
  - upper step drawn 4.5 H7 (+0.012), built 4.596; a lost digit in the scan cannot be excluded (likely/unsure);
  - the endstone setting's flange built 4.59, which fits the 4.596 bore;
  - the pillar plate has a 4.6 × 0.25 recess at hole 26 that the sheet does not show.
- **Action: your decision.** If the 4.5 is right, the setting's flange and the bore both shrink by 0.09; if the sheet's "4,59" is the true figure, nothing changes. Check the sheet. The recess: remove it unless a photograph shows it.

### F2. Hole 30 (01-4-3, plus the Ankerrad note)
- **Sheets:** 05 08_3.b and 05 08_32.2 (23.10.41).
- **Difference:** the 4.59 H7 step with a 0.5 −0.05 land is at the bottom of the section, but built with the land on the other face (oben). Pass 2 (9-M2) corrected the 5.2 seat to the dial face; the ledger says the 4.59 land is still on the wrong face (certainty raised from unsure by the verifier).
- **Also:** the table calls it "Ankerrad", a lever escapement's wheel, so the hole may be a leftover of the lever chronometer's plate.
- **Affects:** the face on which the jewel sits; assembly.
- **Action: correct** the land to the drawn face, then run `holecheck.py --model wempe`. Hole 30 is already listed as expected empty.

### F3. Extras on the top plate (01-2-2, 01-2-26, 01-2-27, 01-2-28)
- **Sheet:** 05 08_1.b.
- **Differences:** a countersink on hole 4 (Ø 0.9 to 4.3); two blind Ø 0.925 holes at the detent block; r1.0 rounds at the crescent's tips (the sheet draws them pointed).
- **Why:**
  - The oil sink follows Wempe 3955's plate; pass 1: "extra, recorded (3955 photo)".
  - The tips are a version each, by the owner's choice: sharp in 1943, r1 as 05 08 01 of 1946 in the last version, r0.3 on 3955.
  - Pass 2 notes that "last" mixes 1946 tips with 1943 holes (O-9, open).
- **Action: keep** all; record the sink as Estimated in the README.

### F4. Holes 56 and 57 (01-3-29, 01-3-30). Not built.
- **Sheet:** 05 08_3.a. M1.7 contact screws, "nur bei Bedarf" (only if needed).
- **Why:** the owner, 28 October: left out, "Wempe 3955's plate has none".
- **Action: keep.**

### F5. The pillar plate's rim notch (01-4-18). Extra.
- A Ø 1.0 notch at 6 o'clock on the rim. Pass 1 read the sheet's "1" there as the band hole and plate notch (pin WN-201); the new reader finds nothing drawn. **Keep** as an unsure reading.

### F6. The dust bush (02-5-4, 02-5-9, 02-5-12, 02-5-17)
- **Sheets:** 05 08_9 (2.7.42, N.gepr. 30.4.43) against the assembly 05 08_2 (rev. 8.11.46).
- **Drawn:** flange 3.1 −0.2 (sure); body straight at Ø 13.1 from the flange to the foot; reference (7.62) at the top of the 20° cone; small rounds not dimensioned.
- **Built:** flange 2.1 (0.8 under the lower limit); a waist Ø 10.5 over 6.3 mm; 7.77 at the cone; no rounds.
- **Why:** the waist comes from the later assembly 05 08_2, and the flange of 2.1 follows from the collar standing on the waist's top. README: "waisted as the assembly 05 08 01 (1946)".
- **Under the rule:** the 1946 assembly is later, so the waist is right. Whether it also shortens the flange is not drawn: the flange is 1.0 thin against the older part sheet, and nothing in the assembly says 2.1.
- **Action: your decision, small.** Keep the waist. For the flange, 2.1 against 3.1 −0.2:
  - (a) 3.1, with the collar on the waist's top lifted 1.0;
  - (b) keep 2.1.
  - Recommended: (a) only if the flange stands inside the plate; otherwise keep.
- The (7.62) is a reference the sheet contradicts with its own 1:70.

### F7. The pillar (02-6-7, 02-6-8, 02-6-10, 02-6-11, 02-6-12)
- **Sheet:** 05 08_11 (2.6.40, N.gepr. 30.4.43).
- **Differences:**
  - Lead-in taper 5° (sure), built 6.0°. The taper is 1.4 long: 4.5 − 2 × 1.4 × tan 5° = 4.26, so 5° and the end 4.3 −0.2 agree on the sheet. Pass 2: "4.8 against the drawn 6" (open).
  - Cylindrical part of the spigot 1.4 −0.2, built 1.7 (taper 1.1): the step is 0.3 off.
  - Countersink 90° (sure), Ø 2.9 scaled; built 45° (probably a half-angle in the measure) and Ø 2.6, only 0.01 deep against about 0.35. Pass 1 corrected the countersinks to Ø 2.6 at the face, 90°, on purpose.
  - Relief groove in the shoulder face, r 2.5–3.5, about 0.4 deep: not built. Pass 1 had matched it, so the passes read the solid differently.
- **Affects:** assembly and thread entry.
- **Action: correct** the taper to 5° and the step to 1.4; build the groove; check the countersink depth.

### F8. The barrel bridge and the click (02-7-20, 03-5-7, 02-8-10)
- **Sheets:** 05 08_13 (19.4.41, N.gepr. 5.5.41 and 31.4.43), 05 08_12 (21.7.41) and 05 08_14 Sperrkegel (20.9.41, rev. a, 25.5.48).
- **Differences:**
  - Straight edge's chord 73.5 (sure), built 73.31 along the edge (73.52 corner to corner): the sheet is over-dimensioned, and the built is 0.19 short against ±0.1.
  - End screw holes drawn about Ø 3.4–3.5 (scaled, likely) against 2.8 built: 0.5–0.9 over, either way.
  - Click overall length 17.4, built 17.53 (+0.13). The sheet's own 9.7, 7.5 and 1r give 17.53, or 17.4 if 7.5 runs to the nose tip.
- **Why:** pass 1 kept the click: "17,4 against 17.53 from 9,7, 7,5, r 1, 3,5, 85°: the figures that place the beak and nose kept". The bridge holes were not found by an earlier pass.
- **Action:** correct the bridge holes to about 3.5 (check the screws and the bridge's lip, since the screws are now 2.8). Keep the click. Keep the chord, since the sheet is over-dimensioned.

### F9. The lower cock and the fusee bush (03-3-13, 03-8-2, 03-8-4, 02-4-19)
- The cock figures are under A10 (they come from the cock sheets).
- 02-4-19, the fusee bush's small edge breaks (size not printed), is not built: appearance only. **Keep.**

**Small items in F**

| id | Part | Drawn | Built | Action |
|---|---|---|---|---|
| 01-3-7 | hole 10 | 2.70 ±0.009 | 2.82 | C2 |
| 01-4-17 | pillar plate recess | none | Ø 4.6 × 0.25 | see F1 |
| 02-5-17 | dust bush rounds | not dimensioned | none | appearance |
| 02-6-12 | pillar relief groove | 0.4 deep | not built | F7 |
| 02-7-20 | bridge chord | 73.5 | 73.31 | keep |

---

## G. The case, keys and box (2 findings)

### G1. The 1943 key (16-2-4, 16-2-12, 16-2-13, 16-4-5, 16-2-v1)
- **Sheet:** 05 01_7 Chronometerschlüssel (16.7.43, checked 19.7.43). All figures are scaled and likely.
- **Differences:**
  - paddle disc Ø 33.8 (built 34.5);
  - tube protruding below the body 30.0 (built 33.0);
  - overall 79.9 (built 84.7);
  - the head-to-shank joint a 0.3 r (built a 0.3 chamfer, about 0.09 at most);
  - the cross pin drawn as a Kerbstift (grooved), built plain 2.5 × 15.3.
- **Affects:** appearance. The socket and the square fit the fusee's; the 1943 key matches its latest revisions.
- **Action:** keep, optional. For the tube's 30 against 33: the printed chain (50.1 long, head top 8.1 below a 25.1 body) gives 33, so the scaled 30 is the weaker reading.

### G2. The box and its fittings (16-5-6, 16-6-12, 16-6-17, 16-8-10, 16-9-17)
- **Sheets:** 51 00_1 Boden-Chronometer (4.3.42), 51 00_2 Griff (14.7.42), 51 00_4 Zunge (18.9.42), 51 00_5 Überkasten (28.2.42).
- **Box height:**
  - 185 on 51 00_2 (sure); 180 built; 51 00_1 scales to about 179.
  - README (25 October, decided): 05 01's note "Holzgehäuse 185 × 185 × 180 mm außen" was drawn 30.10.40 and reissued unchanged as working copy 4 (28.6.46, stamped 31.3.47).
  - Under the rule, a revision date counts as the sheet's date, so 05 01's 180 (1946/47) is later than the handle sheet's 185 (14.7.42). **180 is right. Keep.** The 185 would make the lid 5 taller.
- **Corner bracket:** the triangle's leg is about 24 on the sheet, 59.5 built. README: 51 00_1 is the Boden-Chronometer's arrangement, "a lever chronometer's, borrowed for the Einheits box". **Keep.**
- **M6 pivot screw:** 27.9 ±1 scaled (unsure); built 24.0 and 26.3, which differ from each other. Appearance; make them equal.
- **Tongue chamfer:** 0.5 × 45° at the M3.5 hole, not built (51 00_4). Optional.
- **Strap screw 5:** 4 × 25 DIN 97 means countersunk, but it is built with a cylinder head (thread and length match). Correct the head form.

---

## 8. Sheet against sheet: every case

| # | Feature | Sheets (dates) | Figures | The rule picks | The model now |
|---|---|---|---|---|---|
| 1 | Seconds pinion pivots | 05 05_4 (4.6.46, rev. 24.3.48) vs 05 05_2 (27.7.40, N.gepr. 20.4.43) | 9.2/4.5 vs 7.2/3 | the part sheet, but it clashes with plates, bridge and dial: **your decision** | follows the assembly |
| 2 | Intermediate pivots | 05 05_7 (6.6.46) vs 05 05_5 (27.7.40/20.4.43) | 4.6/4.6 vs 3/3 | the same: **your decision** | follows the assembly |
| 3 | Centre arbor | 05 05_10 (7.6.40, rev. 20.4.43) vs 05 05_8 (22.7.43) | 16.7/39.65/5.1 vs ends at the cannon top / 3 | 05 05_8 | follows |
| 4 | Escape arbor | 05 04_8 (7.6.40) vs 05 04_7.2 (19.7.43) | 26.5 vs 22.8 | 05 04_7.2 | follows |
| 5 | Staff | 05 04_5 (4.4.41), 05 04_4 (1946), 05 03_3.2 (12.3.65) | see A8 | 05 03_3.2, **needs the version check** | mixed |
| 6 | Barrel body and space | 05 07_1 (13.4.41) vs 05 07_4/_6/_7 (rev. 20.4.48) | 12/15.8 vs 11.6/15.65 | the 1948 sheets | follows |
| 7 | Barrel arbor necks | 05 07_9 (4.7.41), 05 07_8 (28.1.43) vs plate (23.4.43), bridge, drum (1948) | 5/4/3 vs holes 2.90, 3.9, 4.55 | the later neighbours | follows |
| 8 | Hook hole | 05 07_9/_1 (1941) vs 05 07_8 (28.1.43) | blind 6 vs through | 05 07_8 | follows |
| 9 | Dust bush waist | 05 08_9 (2.7.42) vs 05 08_2 (8.11.46) | straight vs waisted | 05 08_2 | follows |
| 10 | Fusee body length | 05 06_2.2 (orig. 22.9.41) vs its revision and 05 06_3.2 (31.3.48) | 12.6 vs 12.3 | 12.3 | 12.35 |
| 11 | Fusee arbor and the plate, bush and wheel | 05 06_15 (29.11.40) vs 05 08_3 (23.4.43), 05 08_8 (1941/43), 05 06_7 (29.11.40) | 2.8 / 4.4–4.5 vs 2.70 / 4.1–4.3 / 4.0 | the later sheets, clashing with the arbor: **your decision** | follows the arbor |
| 12 | Vorreiber cross pin | 05 06_6 (15.4.41), 05 06_15 (29.11.40), 05 06_1 (15.3.41) | 0.8 / 1.1 / 1.2 | 05 06_6, whose hole is reamed with the arbor's: small **your decision** | 1.15 reamed |
| 13 | Layout against plate table and block | 05 04_1 (3.2.40) vs 05 08_1 (15.6.43), 05 04_3 (8.7.43) | 23.8, 3.8 vs 23.41, 4.50 | the later | follows (the offset in A1: **your decision**) |
| 14 | Plate thicknesses | 05 05_1 (undated) vs 05 08_1/_3 (1943) | 3.0 vs 3.35 | 1943 | follows |
| 15 | Hour wheel collar | 05 02_8 (20.7.40) vs 05 05_8 (22.7.43), dial 05 02_12 (2.7.40) | 5.2 vs 3.585 | clash: **your decision** | 3.585 |
| 16 | Collet bore | 05 03_8 (24.2.43) vs 51 03_5 (29.10.41) | 1.6 vs heights 13.4 | clash: **your decision** (small) | opened 1.65 |
| 17 | Box height | 51 00_2 (14.7.42) vs 05 01 (reissued 28.6.46/31.3.47) | 185 vs 180 | 05 01 (180) | follows |
| 18 | Hairspring | 05 03_6 (26.6.41) vs 51 03_5 (29.10.41) | both 0.73 / 9.5 | no conflict | the model differs from both (A2) |

---

## 9. Not differences: the ledger counts these, do not act on them

- **Casting blank sizes (15-2-2, 15-2-6, 15-2-9, 15-2-12, 15-2-13, 15-2-14, 15-5-1 to 15-5-9).**
  - The bowl sheet 05 01_2 (R-05 01 00-1, 6.3.42) and the bezel blank 05 01_5 (R-05 01 01-2, 6.3.42) draw castings.
  - The finished bezel on the assembly 05 01_4 (29.11.41) matches.
  - The bowl's finished recess is 68.2 because the plate is 68 −0.2 (it cannot go into the blank's 64). The other bore and lip differences are the finishing cuts.
- **Another maker's dial (13-7-1, 13-7-2, 13-7-5, 13-7-8).** 05 02_13 is an A. Lange & Söhne iron dial (1453/A, 9.6.44): Ø 103 × 1.5, hole 2.2. The Lange variant keeps the Wempe disc and swaps only the printing (pass 1).
- **Superseded 1941 sheets (12-9-1, 12-9-2, 12-9-3, 03-8-v, 05 08_33).**
  - The barrel ring 05 07_10 (7.4.41) is the earlier three-part barrel; no built part corresponds, though the ring exists in the first-drawn version.
  - 05 08_33's earlier lower cock is a different shape.
  - 05 05_10, 05 04_8, 05 07_1, 05 07_9 and 05 04_5 hold the earlier state of what a later sheet redrew (B2, B3, D1, D3).
- **The coloured section "Federchronometer 05" (17-1-18, 17-1-19, 17-1-22 to 17-1-25, 17-1-39, 17-1-60, 17-1-66, 17-1-69, 17-1-70).**
  - It is a wall drawing, not a works sheet; where a printed detail sheet gives a size, that decides.
  - Its heights are pictorial (±0.2–0.3), and its labels name parts under other numbers (the mainspring as 05 07 00-2, the hook as 05 07 06-3).
  - The arbor-end and jewel heights are kept as estimates (pass 2, README Estimated).
- **Measurement artefacts.**
  - 09-6-10: the fusee square read across corners (4.41–4.16) against flats (3.12–2.94).
  - 02-6-10: the countersink's 45° is a half-angle.
  - 13-3-5: the hour hand's bore on a taper, 3.5 µm.
- **Fits built at the middle of their range, not the limit (04-4-10, 04-7-3, 05-3-6, 12-5-2, 12-6-1).** A policy of the model.
- **The ledger's counts overstate the real errors.**
  - The sheets disagree with themselves in 02-5-12 (1:70 gives 7.77, not 7.62) and 10-3-7 (the table gives 40.57, not 40.65).
  - 08-4-7, 06-1-14 and 12-8-11 attach to references or labels.
  - Some pairs are counted twice, under the reader's and the verifier's ids (02-6-7/8, 11-6-8, 12-8-3, 12-8-6 and 12-7-7, among others).

---

## What to correct first (recommended)

1. **A2: the hairspring's pitch and ends (0.73, 9.5).** Both sheets agree, the physics is unchanged, and the strip stands 0.25 past the drawn ends.
2. **D2: the barrel arbor's hook.** The audit says 0.25 and 45°; the README says 0.475 and 15.5°. Re-measure the solid first.
3. **D4: the set-up ratchet's square, turned 10–13° against its tooth tip.** Neither earlier pass found it.
4. **A5: the detent spring's tail tip (0.054 against 0.22).** It affects the detent's stiffness.
5. **C3, B6, F2 and F7:** the fusee chamfer 29.8, the maintaining detent's hollow 9.645, hole 30's land face, and the pillar's taper and step.
6. **A8, the staff: do the version check first.** Whatever the answer, fix the two real limit misses (1.2155 and 1.6685).
7. **Your decision before any other change:** A1, B1, C2 and E1. Each changes plates or bridges; the advice is to keep the present fit and record the departure.
8. **Keep, with a note in the README:** G2's box height (the later reissue says 180), all the superseded-sheet cases, and the fits at the middle.

## Where the ledger itself may be wrong

- **12-7-4 (the hook).** The ledger and the README disagree on the hook's stand-out (0.25 against 0.475). One of them is wrong.
- **The 1946 pinion sheets.** The ledger calls 05 05_8 the "later assembly" for the centre arbor; by dates that is right (22.7.43 against the part's rev. 20.4.43). But the README's phrasing, and pass 2's claim that the 1946 pinion sheets are blanks, rest on the owner's reading, not on a note on the sheet. The 1946 sheets are later than the 1940/43 assemblies, so the rule makes them your decision (B1), not a plain "keep".
- **07-6-2 (the steel and brass boundary)** is not a shape and should not count as "not built". The ledger's own comparison already says so.
- **The 1965 staff sheet (05 03_3.2).** The ledger treats it as the latest authority for the staff. Its number and tempering differ from this chronometer's staff kompl., so the readers' claim that the model should follow 3.2 is not yet safe.
- **06-1-15** is correctly overridden to a match.
