# Batch 5 verification (the centre wheel and arbor with the cannon, the maintaining detent, the escape wheel)

Verifier. Input: `batch05.items.tsv`, the sheets, the measure and page files. Sheets re-read enlarged in `E:/mc-video/wpa-audit/crops/`.

## 1. The hand of the escape wheel's teeth and of the maintaining detent

### The frames
- `placements.json` for `050505-1` (detent) gives local Y = world +y. Its world box fixes the measure-to-page map exactly: measure x is page x, measure z is page y (`z -6.225..-4.225` equals `y -6.225..-4.225`), and measure y is page **−z**. Test: the box's world z minimum -39.024 and maximum -33.598 are reproduced only by y -> -z (-39.00 and -33.594); the other sign gives -39.16. This is a proper rotation, not a mirror.
- So the measure png ("plan from +Z") is the movement seen from the **dial side (+y)**, 3 o'clock to the right, 12 o'clock up.
- The same pipeline gives the escape wheel (`050405-1`; z 0..1.4 is y -18.6..-17.2; the arbor `050405-2` z -20.98..1.8 is y -20.98..1.8). I confirmed the wheel's sign only through this pipeline, not from its own box (the box is a rotated bounding box and cannot show a mirror). Certainty: likely.

### Which side the sheets draw from
- **Maintaining detent.**
  - Sheet 05 05_11's side view has the long arbor end up and the thin tip band up. The long end is on the same side as the thin zone (read off the sheet, no projection convention needed). The sheet's plan is placed below the side view (first angle, as DIN), so it is a view from the side the long end points to.
  - In the model the long end (`dtArbor` y -22.075 against 3.075, i.e. 15.85 below the detent against 7.3 above) and the thin zone (z -6.225..-5.225, lower) are both on the **train side, −y**.
  - So the sheet draws the part from the **train side**. The model seen from the train side is the png turned over: hub left, tip right, concave edge below. That is exactly the sheet, and the section's recess on the far face agrees.
  - **Verdict: the detent is NOT mirrored. 05-4-3 and 05-5-15 are matches.** Certainty: likely (rests on first-angle placement of the plan and on the arbor-end and thin-zone agreement).
- **Escape wheel.**
  - Sheet 05 04_23 and the plan in 05 04_1 (checked for this question only) both draw the teeth with the tip and the straight steep face on the **clockwise** side. In 05 04_1 the Oberplatte is in the section above the plan, so the plan is seen from the top-plate (train) side.
  - Train direction: the centre wheel (hands, minute wheel 90 teeth) turns clockwise seen from the dial. Centre wheel to third, third to fourth, fourth to escape pinion are three meshes, so the escape wheel turns **counter-clockwise from the dial** and clockwise from the train side. The face (steep, locking) leads: on the sheet it is on the clockwise side, as it should be seen from the train side.
  - The model seen from the dial side has the face on the counter-clockwise side, leading for counter-clockwise rotation.
  - **Verdict: the escape wheel's hand is correct, NOT mirrored. 05-8-12 is a match.** Certainty: likely (the train parity is by count; I did not run the page's wheel).
- The reader compared a dial-side png with a train-side sheet and called the difference a mirror; that is the error.

## 2. Escape arbor 05 04_8 against assembly 05 04_7.2 (which is later)
- Part sheet 05 04_8: gez 7.6.40, gepr 12.12.40, N.gepr 4.43. Assembly 05 04_7.2: gez 19.7.43, gepr 3.8.43 (the hand-written 05 04 05-1 and "Rad von uns aufgesetzt" also on it). **The assembly is later and is the revision the model follows.**
- Assembly scaled (17.8 px/mm): upper tip to pinion top 5.3, total 22.8, arbor dia about 1.1-1.2, pinion block about 3.7-3.8 long. Model: 5.3, 22.78, 1.2, 4.0. These match the assembly.
- So 05-7-4, 05-7-5, 05-7-6 and 05-7-7 are real differences from the part sheet, but they are the sheet's older state (5 / 6.5 / 26.5 / 1.6), not model errors. I give "mismatch with the superseded part sheet; match with the assembly". The part sheet was not updated to the assembly's shorter arbor (neither carries a revision mark naming the change).

## 3. Centre arbor top tip and lower pivot
- **Lower pivot.** Part sheet 05 05_10 prints "5.1 -0.2" (tip to chamfer line, point included; I measured 4.8 by scale). Assembly 05 05_8 (22.7.43, later than the part's N.gepr 20.4.43) prints "3", dome-ended. Model 3.0. Model follows the assembly; part sheet disagrees: sheet-versus-sheet conflict, not a model error.
- **Upper tip.** Sheet 05 05_10: 16.7 -0.2 above cone C (z 23) and 39.65 -0.1 overall to a pointed tip. Model arbor top 37.33 (the cannon's top is 37.22). On 05 05_8 the arbor is drawn running up the cannon's bore to the cannon's top (14.3 above its foot, white column 1.7 wide) with no tip above it. So the assembly supports the model (flush), the part sheet shows 2.3 more. Sheets conflict. The reader's mismatch against the part sheet stands; I add that the assembly agrees with the model. Certainty: likely for the assembly reading, since the arbor is not drawn hatched.
- 05-1-7 (cannon 14.3): the printed figure has a small subscript I cannot read. Built 14.19 (14.01 at the outer edge, 14.19 only on the inner lip). Mismatch by 0.11 against ±0.1 is marginal; I hold it as a marginal mismatch, unsure of the printed tolerance.

## 4. The 1.8 against 1.7 bore (05 04_7.2)
- The drawing has "1,8 Ø H7/h6" on a dimension whose arrows span the wheel's hole (scaled about 1.9-2.0, not a decisive size). The hand-written table at lower right (the same hand as "Rad von uns aufgesetzt") reads "H7 1,7 +0,009" and "h6 1,7 -0,007". So the sheet prints both 1.8 and 1.7 for one fit.
- Model: bore 1.808, spigot 1.797, which follows the label. If the table is the later correction (it looks added), the bore should be 1.700..1.709. I cannot settle which governs (can't tell); the reader's "match" cannot stand as a match without saying so. Raised to a finding: the model's bore and spigot could be 0.1 too large. Certainty: unsure.

## 5. Per-sheet tables

Columns: id | reader | my reading (certainty) | built value found | my verdict | agree? | why.

### 05 05_8 (assembly, Minutenrad kompl.)
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-1-1 | match | 25.4 (likely) | pinion top 25.43 | match | yes | |
| 05-1-2 | match | 19 +-0.05 (sure) | 19.03 | match | yes | re-read |
| 05-1-3 | match | 3 (sure; dome end) | 3.0 | match | yes | |
| 05-1-4 | match | 1.2 -0.02 (likely) | 1.19 | match | yes | |
| 05-1-5 | match | 10.8 -0.1 (sure) | 10.8 | match | yes | |
| 05-1-6 | match | 6.3 (sure) | 6.3 | match | yes | |
| 05-1-7 | mismatch | 14.3 with illegible subscript (unsure) | 14.19 | marginal mismatch | partly | 0.11 against a fallback 0.1; tolerance unreadable |
| 05-1-8 | match | 2.6 square r6 (likely) | 2.6154 | match | yes | |
| 05-1-9 | match | 2.2 e8 (likely) | 2.179 | match | yes | |
| 05-1-10 | can't tell | Koerner groove "4 r" (sure it is a 4 mm radius notch) | dimples, no groove in section | mismatch (probable) | disagree | the 4 r figure is legible; the section shows a half-round notch both sides at the 6.3 level; built has none in the y=0 section; not a can't tell. Likely |
| 05-1-11 | match | 10 (sure) | 10.5 | match | yes | part sheet 10.6 -0.2 |
| 05-1-12 | match | about 4 (unsure) | 3.95 | accepted, not re-read | yes | |

### 05 05_9 (centre wheel)
General tolerance is printed here as "nicht eingetr. Toleranz +-0.01" (not the fallback); it applies only to sizes with no printed tolerance, none of the reader's items.
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-2-1 | match | 90 (sure) | 90 | match | yes | tooth-count, re-read |
| 05-2-2 | match | D 33.10 (sure) | 33.0987 | match | yes | against general +-0.01: inside |
| 05-2-3 | match | dg 30.86 (sure) | 30.8594 | match | yes | |
| 05-2-4 | can't tell | 33.8 -0.2 blank (sure) | 33.09 | can't tell | yes | blank size, finished by the cut teeth |
| 05-2-5 | match | 1.3 -0.1 (sure) | 1.25 | match | yes | |
| 05-2-6 | match | 5.4 H7 (sure) | 5.4 | match | yes | at the lower limit |
| 05-2-7 | match | 10.6 -0.2 (sure) | 10.5 | match | yes | |
| 05-2-8 | match | 28.1 +0.2 (likely) | 28.2 | match | yes | |
| 05-2-9 | match | 1.7 -0.2 (sure) | 1.6 | match | yes | |
| 05-2-10 | match | 72 (sure) | 72 | match | yes | |
| 05-2-11 | can't tell | a spoke vertical (up) on the sheet, the teeth cluster beside it (sure) | a spoke on +x | can't tell | yes | no angle given between teeth and spokes |

### 05 05_10 (centre arbor and pinion, Minutentrieb)
Dates: gez 7.6.40, gepr 18.12.40, N.gepr 20.4.43. General tolerance printed: "nicht eingetr. Toleranz +-0.1" (sure).
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-3-1 | match | z 14 (sure) | 14 | match | yes | |
| 05-3-2 | match | 6.79 -0.02 (sure) | 6.78 | match | yes | |
| 05-3-3 | match | dg 4.24 (sure) | 4.2347 | match | yes | |
| 05-3-4 | match | 4 -0.1 (sure) | 3.95 | match | yes | |
| 05-3-5 | match | 17.2 +0.05 (sure) | 17.225 | match | yes | |
| 05-3-6 | mismatch | 5.4 n6 (sure) | 5.4 | mismatch | yes | n6 on 5.4 is +0.016/+0.008, built nominal; a press fit to the wheel's 5.4 H7 |
| 05-3-7 | match | 1.6 -0.1 (likely) | 1.55 | match | yes | I read the sign as minus |
| 05-3-8 | match | 19 +0.05 (sure) | 19.03 | match | yes | |
| 05-3-9 | mismatch | 3.6 dia, arrows across the lip (sure) | 3.2 | mismatch | yes | likely the riveted flare; the unriveted lip is not dimensioned |
| 05-3-10 | match | Kegel 1:30 (likely) | 1:30 | match | yes | |
| 05-3-11 | match | 23 +0.05 (sure) | 23.03 | match | yes | |
| 05-3-12 | match | 1.8 g6 (likely) | 1.795 | match | yes | |
| 05-3-13 | match | Kegel 1:80 (likely) | 1:80 | match | yes | |
| 05-3-14 | mismatch | 16.7 -0.2 (sure) | 14.3 above z 23 | mismatch vs this sheet | yes | but the later assembly (05 05_8) shows the arbor ending at the cannon's top, as built (section 3) |
| 05-3-15 | mismatch | 39.65 -0.1 (sure) | 37.33 | mismatch vs this sheet | yes | same |
| 05-3-16 | match | 1.65 (likely) | 1.62 | match | yes | |
| 05-3-17 | match | 2.5 (sure) | 2.5 | match | yes | |
| 05-3-18 | mismatch | 5.1 -0.2 (sure) | 3.0 | mismatch vs this sheet | yes | later assembly gives 3 (section 3) |
| 05-3-19 | match | 1.2 (sign illegible) | 1.19 | match | yes | |
| 05-3-20 | match | 30 (likely) | 30 | match | yes | |
| 05-3-21 | can't tell | blank dimensions | n/a | can't tell | yes | |

### 05 05_11 (maintaining detent assembly, Gegensperrkegel kompl.)
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-4-1 | match | 6.3 +-0.1 (sure) | 6.2 | match | yes | at the limit (0.1) |
| 05-4-2 | can't tell | 7.5 before upsetting (sure) | n/a | can't tell | yes | |
| 05-4-3 | mismatch | plan hub left, tip right (sure) | hub +x on the dial-side png | **match** | **disagree** | the sheet is drawn from the train side (section 1) |
| 05-4-4 | match | arbor and pivots not dimensioned (unsure) | | accepted, not re-read | yes | |

### 05 05_12 (maintaining detent)
General tolerance printed: "nicht eingetr. Toleranz +-0.1" (sure). Dated 19.7.44 (gez), hardening 310 deg.
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-5-1 | match | 14.2 (sure) | 14.17 | match | yes | |
| 05-5-2 | match | 8.6 (sure) | 8.63 | match | yes | |
| 05-5-3 | match | 5 (sure) | 5.004 | match | yes | |
| 05-5-4 | match | R9 (sure) | 8.986 | match | yes | |
| 05-5-5 | match | R18 (sure) | 18.0 | match | yes | |
| 05-5-6 | mismatch | 9.645 (sure), scales 9.65 | 9.781 | mismatch | yes | +0.136 over +-0.1 |
| 05-5-7 | mismatch | 6.273 (sure), but scales 5.45 on the sheet's own 14.2 | 6.033 | mismatch vs the printed figure | partly | the figure is inconsistent with the drawing's scale and with R9 through the tip and the 2.6 end height (which gives about 6.07); the model sits near the geometric value |
| 05-5-8 | match | 2.6 (sure) | 2.64 | match | yes | |
| 05-5-9 | can't tell | 80 deg between the horizontal datum through the tip's lower corner and the end face (likely) | lean 8.1 deg (81.9 from horizontal) | can't tell | yes | my scaled lean 4+-3 deg does not settle it |
| 05-5-10 | can't tell | 12 r +-0.1 | none | can't tell | yes | |
| 05-5-11 | can't tell | 150 deg | n/a | can't tell | yes | |
| 05-5-12 | match | 2 (sure) | 2.0 | match | yes | |
| 05-5-13 | match | 1 -0.03 (sure) | 1.0 | match | yes | |
| 05-5-14 | match | 2.25 H7, 1:70 (likely) | 2.25/2.2786 | match | yes | |
| 05-5-15 | mismatch | hand: tip right, concave edge below | mirror of the dial-side png | **match** | **disagree** | train-side view; section 1; thin zone placement agrees |

### 05 04_7.2 (escape wheel assembly)
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-6-1 | match | 22.8 -0.2 (sure; the printed tolerance is hard to read) | 22.78 | match | yes | |
| 05-6-2 | match | 19 (sure) | 19.0 | match | yes | |
| 05-6-3 | match | 5.3 (sure) | 5.3 | match | yes | |
| 05-6-4 | match | 4.7 (likely) | 4.7 | match | yes | |
| 05-6-5 | match | 2 (sure) | 1.96 | match | yes | |
| 05-6-6 | match | 0.24 (sure) | 0.24 | match | yes | |
| 05-6-7 | match | label 1.8 H7/h6; table 1.7 H7/h6 (both sure as printed) | 1.808 / 1.797 | can't tell | disagree | two figures on the sheet; model follows 1.8; section 4 |
| 05-6-8 | match | about 1.4 scaled | 1.4 | accepted, not re-read | yes | |
| 05-6-9 | match | dashed recess | 0.7 deep | accepted, not re-read | yes | |
| 05-6-10 | can't tell | collet flange, no figure | | can't tell | yes | |

### 05 04_8 (escape arbor)
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-7-1 | match | z 10 (sure) | 10 | match | yes | |
| 05-7-2 | match | 2.97 -0.01 (sure) | 2.97 | match | yes | |
| 05-7-3 | match | dg 1.6 (sure) | 1.5961 | match | yes | |
| 05-7-4 | mismatch | 5 -0.2 (sure) | 4.0 | mismatch vs superseded sheet | partly | assembly 19.7.43 is later, model follows it (section 2) |
| 05-7-5 | mismatch | 6.5 -0.2 (sure) | 5.3 | same | partly | |
| 05-7-6 | mismatch | 26.5 -0.2 (sure) | 22.78 | same | partly | |
| 05-7-7 | mismatch | 1.6 -0.2 (sure) | 1.2 | same | partly | assembly scales 1.1-1.2 |
| 05-7-8 | can't tell | 3.13 blank | none | can't tell | yes | |
| 05-7-9 | can't tell | 60 deg | pivot built | can't tell | yes | the assembly shows a dome end, not the 60 deg point |

### 05 04_23 (escape wheel tooth form)
Plan view, 25:1.
| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 05-8-1 | match | 14 +0.03 (sure) | 14.0 | match | yes | at the lower limit; re-read |
| 05-8-2 | match | 15 (unsure) | 15 | match | yes | 24 deg pitch |
| 05-8-3 | match | 11.7 (sure) | 11.6994 | match | yes | |
| 05-8-4 | match | 12.1 (likely) | 12.1 | match | yes | |
| 05-8-5 | match | 10.9 (sure) | 10.898 | match | yes | |
| 05-8-6 | match | 0.1834 (sure) | 0.1833 | match | yes | |
| 05-8-7 | match | 1.5 deg (sure) | 1.5 | match | yes | |
| 05-8-8 | match | 25 deg (likely) | 25.05 | match | yes | |
| 05-8-9 | match | about 5.6 deg (unsure) | 5.37 | accepted, not re-read | yes | |
| 05-8-10 | match | R7.9 (likely) | 7.9 | match | yes | |
| 05-8-11 | can't tell | 6.0606 | none | can't tell | yes | |
| 05-8-12 | mismatch | face and tip on the clockwise side | counter-clockwise from the dial side | **match** | **disagree** | train-side view, correct for the train (section 1) |
| 05-8-13 | can't tell | 15 and 50 deg | | can't tell | yes | |
| 05-8-14 | can't tell | 1 | | can't tell | yes | |
| 05-8-15 | match | step at the back foot | 0.2 | match | yes | |
| 05-8-16 | can't tell | spoke count not shown | 3 | can't tell | yes | |
| 05-8-17 | can't tell | stock 1.6 | 1.4 | can't tell | yes | |

Sampling: I re-read enlarged every mismatch and not-built, the tooth form (hand), the pinion's, arbor's and detent's dimensions, the 1.8/1.7 label and table, and the cannon and arbor tip/pivot lengths. The remaining plain outline matches are "accepted, not re-read" where marked.

## 6. Missed by the reader
- **05-5-v1** (05 05_12, general tolerance): "nicht eingetr. Toleranz +-0.1" printed (sure); the reader should quote it for the unprinted sizes.
- **05-2-v1** (05 05_9): the general tolerance there is +-0.01, not the fallback. No item changes.
- **05-3-v1** (05 05_10, 05 04_7.2 and the arbor): the part and assembly sheets disagree (3 against 5.1 for the lower pivot; flush against 39.65 for the top tip; 5.3/22.8 against 6.5/26.5 for the escape arbor). The ledger should record which sheet is the later (the assembly in each case) rather than a mismatch for the model.
- **05-1-v1** (05 05_8): the arbor is drawn running through the cannon's bore to its top (white 1.7 column, not hatched); no arbor tip above the cannon.
- **05-6-v1** (05 04_7.2): the hand-written table 1.7 H7/h6 against the label 1.8 (section 4).

## 7. Summary of the disagreements with the reader
1. Detent hand (05-4-3, 05-5-15): the reader says mirrored. It is not. The sheet is drawn from the train side; the model is correct. Match.
2. Escape wheel hand (05-8-12): the reader says mirrored. It is not. Counter-clockwise from the dial is right for the train; the sheets draw it clockwise from the train side. Match.
3. 05-1-10 (Koerner groove): the "4 r" is legible and the sheet shows a notch; built has none in the section. Probable mismatch, not a can't tell.
4. 05-6-7 (1.8 against 1.7): the sheet prints both; can't tell, possible 0.1 oversize bore.
5. Sheet-versus-sheet conflicts, which the reader had as plain mismatches: 05-3-14, 05-3-15, 05-3-18 and 05-7-4..7. The later assembly (22.7.43; 19.7.43) supports the model in every one.
6. 05-5-7 (6.273): the printed figure disagrees with the sheet's own scale (about 5.45), so the model's 6.03 is not a clean mismatch.
7. 05-1-7: marginal, tolerance unreadable.
