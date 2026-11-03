# Verifier, batch 17: Federchronometer 05 (the coloured section of the whole movement)

Method: hi-res print (5099 x 2061), read at native pixels with row/column profiles and enlarged crops (kept in E:/mc-video/wpa-audit/crops/). Not read: batch17.md, the do-not-read list, git. Detail sheets consulted: 05-06/Wempe_05-06_15 (fusee arbor, "Schneckenwelle" 05 06 04-1), 05-07/Wempe_05-07_08 (Federkern kompl. 05 07 02), 05-07_03/_09 (drum, sheet list), 05-04/Wempe_05-04_07-2 (Gangrad with arbor) and _08 (Gangtrieb blank).

## 1. The scale and its spread

The print is two halves pasted together. Their datums differ, and the left half is tilted about 4 px per 1000 px.

| datum | right half (escapement, plates) | left half (barrel, fusee) |
|---|---|---|
| top plate top face | row 806.5 | row 813.5 (x 1100-1400), 817.5 (x 2100-2330) |
| pillar plate top face | row 1317.5-1318 | row 1327.5 (x 1100-1400), 1331 (x 2100-2330) |
| pillar plate underside | row 1393.5 | row 1403.5-1407.5 |

- **Reader's right-half zero.** The reader's right-half zero (pillar plate top, row 1313) is about 4.5 px (0.2 mm) above the plate's top line at 1317.5-1318. Every right-half y the reader quotes is therefore shifted by about 0.2 mm (toward -y). I used 1317.5 on the right and 1329.5 at the fusee, 1328.5 at the barrel arbor, on the left.
- **Scale 1** (the reader's pair, repeated): top plate top to pillar plate underside is 587 px (right) and 590 px (left) for 25.7 mm. That gives 22.84 and 22.96 px/mm. These use the model's plate and gap sizes, so they are not independent of the model.
- **Scale 2** (independent, from a printed sheet): the fusee arbor's printed collar, step and neck (05 06_15: 8 + 3.1 + 7.9 = 19.0 mm) span rows 692.5 to 1129.5 in the section, 437.5 px. That gives 23.03 px/mm. The widths agree: collar D 7.04 is 157 px (22.3), the 4.4 neck 97-100 px (22.2-22.7), the square about 3.05 mm is 70 px (23.0).
- **Difference between the scales:** 0.2 px/mm, 0.9 %, so 22.9 +-0.15. On a 20 mm length that is +-0.15 mm, and with edge error (2 px = 0.09 mm) about +-0.3 mm.
- The reader's "36.5 px/mm" and "45.6 px/mm" are crop zoom factors (1.6x, 2x), not other scales. The sections are all at one scale. The "160 px" the reader quotes for D 4.38 is really the 7.04 collar.
- **Judging mismatches:** any difference under about 0.3 mm in a section reading is inside the spread. The section also disagrees with the printed detail sheets by up to 2.5 mm at the free ends of the arbors (section 2), so a section-only difference of 1-1.7 mm there says the section is loose, not the model wrong.

## 2. Section against detail sheet, arbors

Here the detail sheet decides, since it is a dimensioned works sheet.

- **Barrel arbor (05-07_08, 05 07 02).**
  - Total 40.2; model 40.2 (-35.25 to 4.95). The dial journal is 5 long (model 4.98). The square end is 10 long (model 10.0).
  - Core ends at 11.7 and 23.6 mm from the dial tip; model 11.75 and 23.33.
  - Neck D: both necks about 4.9-5.0 mm, measured by columns (rows 142.5-189.5 and 144.5-193 at 9.66 px/mm). The model has 4.48 on both.
  - Core D 13.4; model 13.3.
  - Core flat 10.35 long with a chamfer about 0.8 axial; overall 11.9. The model has a flat of 8.28 and a 1.65 x 1.65 (45 deg) chamfer, 11.58 overall.
  - The section agrees with the sheet on neck D (5.1 / 5.0) and chamfer (1.0 axial x 2.2 radial). It is longer than the sheet at both free ends: total 42.7 against 40.2. The section dome is a hemisphere about 1.5 mm high; the sheet and the model have a nearly flat end.
- **Fusee arbor (05-06_15).**
  - The printed collar 7.9, step 3.1, 4.5 section 8 and neck 8.7 all agree with the model and the section.
  - Square 20.3 (28.3 - 8): model 20.3; section 18.6. The section is 1.7 short.
  - **Model against sheet, new finding:** sheet total is 60.6 mm; model is 58.125 (-48.025 to 10.1). The difference is the dial-side pivot. The sheet has a 1.6 pivot section from the end of the 2.7/2.8 taper to the tip, about 6.1 mm. The model has 3.6 mm (z 6.475 to 10.1). The model is about 2.5 mm short.
  - The section cannot show that end: the arbor runs into a hub, and the cup ends at +9.7.
- **Escape arbor (05-04_07-2 and _08).**
  - Total 22.8; model 22.78.
  - The pinion lies 5.5-9.4 mm from the dial tip (a 3.9 mm cut) and the model has 5.3-9.3. The model agrees with the sheet.
  - Shaft between the hub and the pinion is 1.1 mm (19.5 px at 17.6 px/mm); model 1.07, section reading 1.38.
  - Shaft above the pinion is 1.3; model 1.2 (+0.1, about the pixel scatter).
  - Pinion tips D 2.8 (sheet, 49.5 px); model 2.97 on the Gangtrieb sheet's 2.97. The pinion has Z 10, dg 1.6; the model has root D 1.6.
  - In the section the pinion lies about 1 mm closer to the dial than on the sheet, and the upper tip is 0.7 higher: the section arbor measures 22.1 against 22.8.

## 3. Sheet "Federchronometer 05"

Rows without a number in "my reading" were accepted without re-reading; they are simple outline matches (about one in five re-read).

| id | reader | my reading of the sheet | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 17-1-1 | match | 587 px (right), 590 px (left) for 25.7 = 22.84 / 22.96; independent scale 23.03 (sure) | 25.70 | match | yes | spread 0.9 % (section 1) |
| 17-1-2 | match | top plate 806.5 to 887.5 = 81 px = 3.55 at 22.84 (likely, +-0.1) | 3.35 | match | yes | +0.2, about 2 px |
| 17-1-3 | match | 1318 to 1393.5 = 75.5 px = 3.31 (likely) | 3.35 | match | yes | |
| 17-1-4 | match | 887.5 to 1318 = 430.5 px = 18.85 (sure) | 19.0 | match | yes | |
| 17-1-5 | match | dial top line at row 1551.5-1553, 10.26 below the plate top (likely) | 10.35 | match | yes | |
| 17-1-6 | match | accepted, not re-read | 1.2 | match | yes | |
| 17-1-7 | match | 1393.5 to 1552 = 6.95 (likely) | 7.0 | match | yes | |
| 17-1-8 | match | accepted, not re-read | | match | yes | |
| 17-1-9 | match | accepted, not re-read | | match | yes | |
| 17-1-10 | mismatch (-0.39) | hatched top at row 462 (3x crop), y -37.5 with plate-top row 1318 (likely); unhatched outline above reaches -39.3 | -37.35 | **match** | **no** | the reader's -37.74 comes from his zero 4.5 px (0.2 mm) too high plus reading; against the true zero it is +0.15, inside the spread |
| 17-1-11 | match | accepted, not re-read | | match | yes | |
| 17-1-12 | can't tell | not re-read | | can't tell | yes | |
| 17-1-13 | match | accepted, not re-read | | match | yes | |
| 17-1-14 | mismatch | label "Oberplatte 05 08 01-1" (sure); the 05-08 sheets are titled "Oberplatte kompl. 05 08 01" | hn 050901, title "Top plate (Oberplatte)" | **label difference, part present** (match as a part) | **no** | the sheet's number agrees with the sheet; "050901" is the model's own line number, not a size or shape mismatch |
| 17-1-15 | match | labels re-read at 3x crops: Unterplatte 05 08 02-1, Pfeiler 05 08 00-1 (sure) | | match | yes | |
| 17-1-16 | match | accepted, not re-read | | match | yes | |
| 17-1-17 | match | Sekundentrieb 05 05 01-2, Zwischentrieb 05 05 02-2, Gangtrieb 05 04 05-2 re-read (sure) | | match | yes | |
| 17-1-18 | not built | label "Zugfeder 05 07 00-2" read (sure); a coiled strip in the drum | page/050700-6.json: one body 38.0 x 15.0, volume 6671 mm3, y -20.2 to -5.2, inside the drum bore (D 38.5, y -21.7 to -3.7) | **built under another number** (050700-6) | **no** | a mainspring in the drum, same width as the sheet's 15; label difference, not "not built" |
| 17-1-19 | not built | label reads "Bandhaken f. Trommel 05 07 06-3" (sure on the text) | measure/bandHookDrum.json: hn 050703-3, "Band's drum hook (Bandhaken f. Trommel)", 8.1 x 3.3 x 0.78; sheet 05-07_14 has the title "Bandhaken f. Trommel", numbered 05 07 03-3 | **built under another number** (050703-3) | **no** | the section's "06-3" differs from the sheet's own 03-3; the part is built |
| 17-1-20 | not built | labels WN-27, WN-13, WN-15, WN-16 read (sure) | WN-gf "Detent foot's screw M1 (WN-13 by the coloured section's label, likely)"; WN-gk "Detent block screw (WN-15 by the coloured section)". WN-16 and WN-27 not mapped | WN-13, WN-15: **built under another key**; WN-16, WN-27: can't tell | **partly** | the model's own titles carry the labels. WN-16 points at a slotted round head D about 3.3 mm in the detent block (the blockScrew head is 3.0, so WN-16 may be that screw and WN-15 the foot screw). WN-27's leader ends at a slender vertical stud beside "Feder 05 05 06-1" (page/050506-1.json exists); I could not map it to a built line |
| 17-1-21 | match | core D 13.4 (sheet 05-07_08 129.5 px / 9.66); section 13.5 (unsure) | 13.3 | match | yes | |
| 17-1-22 | mismatch | sheet 05-07_08: flat 10.35, overall 11.9; section 9.9 / 12.1 | flat 8.28, overall 11.58 | mismatch (flat 2.1 short) | yes | the sheet backs the section; the 1.65 chamfer takes the length |
| 17-1-23 | mismatch | chamfer about 0.8 axial (sheet), 1.0 x 2.2 (section) | 1.65 x 1.65, 45 deg | mismatch | yes | |
| 17-1-24 | mismatch | top neck D 5.0 on the sheet (rows 144.5-193), 5.1 on the section | 4.48 | mismatch (-0.5) | yes | backed by the detail sheet |
| 17-1-25 | mismatch | lower neck D 4.9 (sheet), 5.0 (section) | 4.48 | mismatch (-0.45) | yes | |
| 17-1-26 | match | accepted, not re-read | 3.88 | match | yes | |
| 17-1-27 | match | section 3.0; sheet journal 2.85 (unsure) | 2.88 | match | yes | |
| 17-1-28 | mismatch | section tip +6.2 (row 1469); sheet 5.0 long | 4.95 | **match to the sheet**; the section is 1.2 long | **no** | the model equals the printed dimension; the section is loose (section 2) |
| 17-1-29 | mismatch | section top -36.9 (dome top, row 487.5); sheet total 40.2, square 10 | -35.25 | **match to the sheet**; the section is long (square 11.3 against 10) | **no** | same as 17-1-28. Separate point: the model's end is flat with a 0.5 chamfer where the section shows a 1.5 mm dome; the sheet shows only a slightly rounded edge (unsure) |
| 17-1-30 | match | square 63 px = 2.76 (sure) | 2.7 | match | yes | |
| 17-1-31 | match | accepted, not re-read | | match | yes | |
| 17-1-32 | match | collar rows 947.5-1129.5, D 157 px = 7.0; y -16.75 to -8.8 with the left-half zero (sure) | 7.04, -16.625..-8.725 | match | yes | printed 7.04 and 7.9 |
| 17-1-33 | match | accepted, not re-read; sheet 6.1 / 3.1 | 6.1 | match | yes | |
| 17-1-34 | match | sheet 4.5 and 8 | 4.39-4.5 | match | yes | |
| 17-1-35 | match | 97-100 px = 4.3-4.4 (sure) | 4.38-4.5 | match | yes | |
| 17-1-36 | match | 65 px = 2.85 (section); sheet 2.7 to 2.8 over 6.5 | 2.7072-2.8 | match | yes | |
| 17-1-37 | match | square 70 px = 3.07; sheet 3.19 to 2.92 | 3.09 | match | yes | the lower end at -28.05 (section) |
| 17-1-38 | mismatch | section square plus dome: top at -46.7; lower end -28.05, 18.6 long. Sheet 05-06_15: 28.3 - 8 = 20.3 | 20.3 (box -48.025) | **match to the sheet**; the section is 1.7 short | **no** | the model equals the printed length |
| 17-1-39 | can't tell | not re-read (the sheet's 1.6 pivot runs to about +12.6, the section stops at +9.7 in the hub) | 10.1 | can't tell; **but model against 05-06_15 mismatches** | partly | see new item 17-1-v1 |
| 17-1-40 | match | accepted, not re-read | | match | yes | |
| 17-1-41 | can't tell | not re-read | | can't tell | yes | |
| 17-1-42 | match | accepted, not re-read (sheet 05-07_03 drum 18.1; model 18.08) | | match | yes | |
| 17-1-43 | match | sheet 05-07_03 outer D 41.6 (-0.1); model 41.6 | | match | yes | the section's 41.9 is inside the spread |
| 17-1-44 | match | sheet 38.5 (+0.1) | 38.5 | match | yes | |
| 17-1-45 | can't tell | pasted strip | | can't tell | yes | |
| 17-1-46 | can't tell | pasted strip | | can't tell | yes | |
| 17-1-47 | match | accepted, not re-read | | match | yes | |
| 17-1-48 | match | top pivot cap at row 817.5-818, y -21.9 (sure) | -21.92 | match | yes | |
| 17-1-49 | can't tell | not re-read | | can't tell | yes | |
| 17-1-50 | mismatch (-0.53) | pinion block rows 1245 to 1317.5, y -3.2 to 0.0 (likely) | -3.02..0.23 | **match** | **no** | +0.2 at each end, inside the spread; the reader's right-half zero is 0.2 high |
| 17-1-51 | match | accepted, not re-read | | match | yes | |
| 17-1-52 | can't tell | not re-read | | can't tell | yes | |
| 17-1-53 | mismatch (+0.48) | seconds arbor top cap at row 819-821, y -21.84 (likely) | -21.98 | **match** | **no** | -0.14 on the section; the reader's -21.5 is not reproduced (and is 0.2 off from his zero) |
| 17-1-54 | match | accepted, not re-read | 1.5 | match | yes | |
| 17-1-55 | match | accepted, not re-read | | match | yes | |
| 17-1-56 | match | accepted, not re-read | | match | yes | |
| 17-1-57 | mismatch (+0.7) | tube and arbor end together at row 1608, y +12.7 (unsure); the arbor's own end is not separable from the collar | 12.28 | **can't tell** | **no** | +0.4 at most and the drawn end belongs to the collar |
| 17-1-58 | mismatch | section 1.38; sheet 05-04_07-2 1.1 (19.5 px at 17.6 px/mm; likely) | 1.2 and 1.07 | **match to the sheet** (section reading unreliable) | **no** | hatching and line weight inflate the section's width; the sheet is printed and agrees with 1.07 |
| 17-1-59 | mismatch (+1.1) | section pinion y -6.7 to -2.5; sheet: 5.5-9.4 mm from the dial tip, 3.9 long | -7.5..-3.5 (4.0 long); dial tip 1.8, so 5.3-9.3 below it | **match to the sheet**; the section is 1 mm toward the dial | **no** | the section arbor measures 22.1 against the sheet's 22.8 |
| 17-1-60 | mismatch (+1.08) | tip row 857.5, y -20.2 (likely); plate underside -18.97 | -20.98 | mismatch (+0.8) against the section | yes | not from the scale: the lower tip agrees (1.9 against 1.8), so the section arbor is 0.7 short; the arbor length 22.78 equals the sheet's 22.8 |
| 17-1-61 | match | lower tip row 1361, y +1.9 | 1.8 | match | yes | |
| 17-1-62 | match | accepted, not re-read | | match | yes | |
| 17-1-63 | can't tell | not re-read | | can't tell | yes | |
| 17-1-64 | match | thin 28 px = 1.23 (3712.5-3740.5), likely | 1.05-1.2 | match | yes | |
| 17-1-65 | match | thick 38 px = 1.67 (3706.5-3744.5) | 1.58-1.65 | match | yes | |
| 17-1-66 | mismatch (-1.0) | the thin section widens at row 631.5, y -30.1 (likely) | -28.9 | mismatch (+1.2) | yes | the staff's own detail sheet (05 04 02-1) was not found among the sheets I opened (05-04_05 is the lever-escapement staff), so it is not settled against a printed size |
| 17-1-67 | can't tell | not re-read | | can't tell | yes | |
| 17-1-68 | can't tell | not re-read | | can't tell | yes | |
| 17-1-69 | mismatch | upper hole stone rows 857.5 to 880.5 (4x crop), y -20.4 to -19.2 (likely); plate underside -18.97; tip -20.2 | -20.94..-20.14 | mismatch (model 0.5 at the top, 0.9 at the bottom higher; stone 1.0-1.2 thick against 0.8) | yes | outside the spread; the stone is not flush with the underside on the sheet, it is about 0.2 above it |
| 17-1-70 | mismatch | cap stone rows 827.5 to 852.5, y -21.5 to -20.4 | -21.91..-21.01 | mismatch (0.4 to 0.6 high; 1.1 thick against 0.9) | yes | |
| 17-1-71 | match | hole stone rows 1331.25-1355, y +0.6 to +1.64 (likely) | 0.99..1.78 | match | yes | thickness 1.0 against 0.8; edges inside the spread |
| 17-1-72 | mismatch | cap stone rows 1362.5-1385, y +1.97 to +2.96 (unsure; stone is a lens in a setting) | 1.83..2.58 | **can't tell** (within the spread, +0.14 / +0.38) | **no** | the lower tip, the plate faces and the hole stone all agree, so a 0.4 difference on a domed cap is not a finding |
| 17-1-73 | match | accepted, not re-read | | match | yes | |

## 4. Items the reader missed

- **17-1-v1.** Fusee arbor, dial-side pivot, against its own sheet 05-06_15: sheet total 60.6 (-0.2); the model's total is 58.125. The sheet shows a 1.6 section about 6.1 mm long beyond the 2.7/2.8 section (6.5); the model has 3.6 mm (z 6.475 to 10.1). Mismatch about -2.5 mm (certainty: likely; read at 3x). This is a model-against-detail-sheet finding, for the 05 06 04-1 batch to settle.
- **17-1-v2.** The section's printed barrel-arbor label says "Federkern 05 07 02-1" and the core's own sheet (05-07_08) is "Federkern kompl. 05 07 02" with 05 07 02-2 (core) and 05 07 02-1 (arbor); the earlier Federkern sheet 05-07_09 (127-556.04-093) is 44.2 long with a 14 mm core. The section's 42.7 total lies between the two. The section may be drawn from a third revision, which would explain why its arbor ends differ from the sheet and model by 1.2-1.7 mm in both directions.
- **17-1-v3.** Chamfer shape on the core: the sheet and the section agree on a steep chamfer (0.8-1.0 axial by 1.8-2.2 radial, about 66 deg from the axis); the model has 45 deg. This extends 17-1-23.
- **17-1-v4.** The two halves of the print have separate datums (plate top 806.5 right, 813.5 left; pillar top 1318 right, 1327.5-1331 left) and a 4 px/1000 px tilt on the left. Any left-half reading needs the left datum. This is a property of the sheet, not a model finding.
- **17-1-v5.** The barrel and fusee arbor's top ends are drawn as bullets (domes) in the section. The model has flat chamfered ends (barrel) and a conical tip to 2.08 (fusee). Neither detail sheet shows a bullet, so this is the section's own form (unsure).
- **17-1-v6.** The mainspring on the section is drawn as separate coils (a spring of about 38 mm outer D and 15 wide). The page's 050700-6 is a single body of 6671 mm3; its rays at mid-height cross one turn. As a mainspring in the section's sense it matches in outer D and width; its coil count and strip are not checked here.

## 5. Summary of disagreements with the reader

- **Scale.** Spread 0.9 %, so 22.9 +-0.15 px/mm. The two halves have separate datums. The reader's right-half zero is 0.2 mm too high, and his "36.5" and "45.6" px/mm are crop zoom factors.
- **Reader's mismatches I overturn:** 17-1-10 (upper cock top: match), 17-1-50 (intermediate pinion: match), 17-1-53 (seconds tip: match), 17-1-57 (seconds dial end: can't tell), 17-1-72 (lower cap stone: can't tell), 17-1-58, -59 (escape shaft and pinion: they match the printed sheet 05-04_07-2; the section is loose), 17-1-28, -29, -38 (arbor free ends: they match the printed lengths in 05-07_08 and 05-06_15; the section is 1.2-1.7 mm off in either direction), 17-1-14 (label difference only).
- **Reader's not built overturned:** the mainspring is present as 050700-6, the drum band hook as 050703-3 (the section's "05 07 06-3" is a different printing of 05 07 03-3), WN-13 and WN-15 as WN-gf and WN-gk. WN-16 and WN-27 stay unmapped (can't tell).
- **Reader's mismatches I confirm:** the barrel arbor's necks (4.48 against about 5.0, both necks, backed by sheet 05-07_08), the core's flat length and chamfer, the escape arbor's top tip and both upper jewels against the section (0.4-0.9 mm; stone 1.0-1.2 thick against 0.8), the staff's step (-30.1 against -28.9, no printed size found).
- **Added:** fusee arbor 58.1 against 60.6 mm on its own sheet (the dial-side 1.6 pivot is about 2.5 mm short); the core chamfer's angle; the section's likely different revision of the arbors.
