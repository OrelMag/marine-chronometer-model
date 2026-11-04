# Verifier 10: the fusee's parts (sheets 05 06_5 to 05 06_10)

Sheets re-read enlarged (crops in E:/mc-video/wpa-audit/crops/): 05 06_6, _7 (hub, enlarged 4x), _9 (pins, 4x), _10, and _5/_8 at 2x. Frames: the measure frame's +Z is the movement's +y (dial side): the fusee wheel's measure z range (-7.385..-2.385) equals its placements box y range, and the right-handed map puts local Y on 12 o'clock. So a plan seen from +Z is the dial-side view.

## 05 06_5 Staubplatte

Items 10-1-1..8, 10-1-10: sampled 10-1-3, 10-1-6, 10-1-7 on the 2x crop and they agree; the rest accepted, not re-read. 10-1-9 (rotated dimension, "H7 +0,012", so a 3-6 mm diameter): I read it as unreadable too; the only 4.4-4.7 diameter built is the square's diagonal. Can't tell, agreed.

## 05 06_6 Vorreiber

| id | reader | my reading (certainty) | built | my verdict | agree | why |
|---|---|---|---|---|---|---|
| 10-2-1 | mismatch (3.1 -0.2 vs 2.76) | 3.1 -0.2 dimension from boss end to flange face (sure) | size[2] 2.76 (z -3.685..-0.925) | mismatch | yes | boss end to flange face is the dimension; 0.34 short of nominal, 0.14 under the low limit |
| 10-2-2 | mismatch (flange 1.2 -0.2 vs 0.86) | 1.2 -0.2 between flange face and the flange's back step (sure; scale 1.1) | z -3.685..-2.825 = 0.86 | mismatch | yes | the flange is 1.2 thick on the sheet, with its 0.3 chamfer inside it; built 0.86. The 0.34 lost in the flange is the same 0.34 lost in 10-2-1, so the flange is the short part and the boss (1.9, 10-2-3) is right |
| 10-2-3 | match | boss length 3.1-1.2 = 1.9 (likely, scaled) | 1.9 | match | yes | derived, not printed |
| 10-2-4 | match | 7.6 -0.2 (sure) | 7.5 | match | yes | |
| 10-2-5 | match | 14 d11 (sure) | 13.895 | match | yes | d11 limits 13.84..13.95 |
| 10-2-8 | match | 4.4 H7 (sure), (4.36) at boss end, Kegel 1:70 | 4.4106 flange end | match | yes | |
| 10-2-11 | mismatch (0.8 vs 1.15) | 0.8 dia mark beside the cross hole, width scaled 0.7-0.8 (likely) | cylinders[1,2].d 1.15 | mismatch | yes | the dimension is clearly a diameter next to the hole symbol |
| 10-2-12 | match | 1.1 +-0.1 from the boss end to the hole's axis (sure) | cross hole axis z -2.025, boss end -0.925 | match | yes | |
| 10-2-14 | extra (pin 1.16 against 0.8 hole) | no pin on this sheet | page 050600-5 d 1.1588 x 8.3 | extra, and see v1 | yes | |

The cross hole: the sheet's 0.8 is the only hole size printed. In the built movement the Vorreiber's hole (cylinders[1,2]), the fusee arbor's matching hole (fuseeArbor cylinders[0], d 1.15) and the pin 050600-5 (d 1.1588) all agree with each other at about 1.15, so the model is self-consistent and the mismatch is against the sheet only. Nothing on this sheet or on the arbor's sheets that I read gives a 1.15 hole. A 1.16 pin cannot go in a 0.8 hole, so the pin line is wrong against this sheet as well (which size the sheet's pin has is not on any sheet of this batch). Items 10-2-6, 7, 9, 10, 13, 15, 16: accepted (6, 7 and 10 sampled and agree; 15 is a process note, so can't tell).

## 05 06_7 Schneckenrad

| id | reader | my reading (certainty) | built | my verdict | agree | why |
|---|---|---|---|---|---|---|
| 10-3-1..5 | match | Z=90, M 0.4356, t 1.368, D 40.57, d 39.21, dg 37.84, l 0.64 (sure) | 90; tips 40.5691; roots 37.8393; tooth 0.640 | match | yes | |
| 10-3-6 | can't tell | Zykloidenverzahnung, five teeth sketched | polyline | can't tell | yes | |
| 10-3-7 | mismatch (40.65 -0.05 vs tips 40.569) | 40.65 -0.05 (sure); leader "gedreht 41,1" points at it | tips 40.569 | mismatch | yes, with a note | The leader says the rim is turned at 41.1 before the teeth are cut, and the table gives D 40.57 rolled. So the sheet disagrees with itself by 0.08 (the tip circle in the table against the 40.65 in the section); the built value follows the table. The mismatch is real against the printed 40.65 -0.05 (limit 40.60); it is the sheet's own 0.03-0.08 conflict, small |
| 10-3-8 | match | 33.8 -0.2 | 33.8 | match | yes | |
| 10-3-9 | match | 32.3 +0.05 | 32.3 | match | yes | |
| 10-3-16 | can't tell | boss width in the section 175 px of 27 px/mm = 6.5; the text I read as "6,6 +0.1" more than "4,6" (unsure) | 6.49 | can't tell | yes, with a change | I measure 6.5 in the section against the 14 mm (27.1 px/mm) and 16.6 mm (27.4 px/mm) scales, so the reader's 6.4 is about right. The text's first digit is most probably a 6 (6,6 +0.1, which would make 6.49 about 0.1 under) or a 4 (4,6, which is not the section). Nothing settles it. If it is 6,6 +0.1 the part is mismatch by -0.11 |
| 10-3-17 | mismatch (bore 4 +0.1 vs 4.55) | 4 dia +0.1; the bore in the section is 108 px = 4.0 mm; plan circle 4.0 (sure) | cylinders[2].d 4.55, z -7.385..-3.685 | mismatch | yes | What is in it: fuseeArbor section, r 2.25 at z -8.725 narrowing to r 2.19 at -0.025, so d 4.38-4.50 over the wheel's z -7.385..-2.385 (and the Vorreiber's 4.4 H7 bore fits that same arbor). A 4.0 +0.1 bore cannot take a 4.4 shaft. Built 4.55 gives about 0.1-0.17 clearance, so the model chose a fit that the sheet does not give. The sheet's 4.0 is probably a pre-bore finished at assembly (as the Vorreiber's note says "Loch zur Welle passen"), but the sheet says nothing of that here: can't tell about the intent, mismatch about the figure |
| 10-3-18..22 | match | 17 +0.2, 14 +0.1, 1.3 -0.1 at 60 deg, 1.2 H8, 14.2 | as listed | match | yes | 1.2 H8 reading is likely, not sure |
| 10-3-24 | not built | "Kante leicht brechen" leader to the boss's top edge (sure) | sharp corner (3.245,-7.385) | not built | yes | no size, minor |
| 10-3-14 | match (unsure) | 0.4 -0.05: I could not fix what its extension lines attach to, the vertical dimension's arrows sit in the web beside the hub | z -5.005 vs -4.605 | can't tell | no | accepted by the reader on one reading; I could not confirm it |
| others | match | accepted; 10-3-11, 12, 13, 15, 20 sampled and agree | | | yes | |

Hand: the plan shows one pin hole at the bottom and no angle is printed; can't tell, agreed.

## 05 06_8 Deckplatte

All reader items accepted: 21.1 -0.1, 0.8 -0.1, 6.1 H8, 1.85 -0.1, 3.1 +0.1 at 90 deg, 6 +-0.05 (sampled; they agree). 10-4-8: the sheet draws the outer edge as a taper from the top, no figure; accepted, unsure. The screw hole sits above the centre on the plan (12 o'clock), no angle given.

## 05 06_9 Gegenfeder kompl.

| id | reader | my reading (certainty) | built | my verdict | agree | why |
|---|---|---|---|---|---|---|
| 10-5-1..3 | can't tell | pre-turned state with eccentric inner circle; 32.45 +-0.02, 1.4 +-0.01 | 32.25, 1.3 | can't tell | yes | the sheet is the state before opening |
| 10-5-4 | mismatch (pin 1.25 vs 1.16) | text "1,25 dia" twice; but the drawn pin is only about 1.0-1.1 on the 5:1 scale, so the text and the picture disagree (unsure) | d 1.1588 | mismatch, unsure | yes | pin 71 is 2.5 long, 1.3 inside the strip and 1.2 outside: built 2.48 with one end flush with each face and 1.18-1.2 out the other, checked from the world box (y -6.085..-2.405 against the spring's -4.905..-3.605). The length and the stand-out match. The diameter: 1.25 in a 1.2 hole is a press fit, 1.16 is a loose one |
| 10-5-5 | match | hole chord 15.25 | 15.26 | match | yes | |
| 10-5-6 | match (hand) | the 65 deg is read clockwise from 0 down, the hole at the left of the 0 line (sure) | holes (0,-14.2) and (12.87,-6.00): the second is counterclockwise of the eye in the +Z (dial-side) view | match | yes | the spring's frame is the wheel's (same axes, placements 050601-1 and 050600-3), the spring's second hole sits exactly on the wheel's pin hole (12.8696,-6.0012), and the wheel's pocket opens to -y. The sheet is therefore drawn from the -y side, the pocket's open side; clockwise there is counterclockwise from the dial. Agreed |

## 05 06_10 Gegenfeder

Re-read: 32.3 -0.1, thickness 1.35 -0.1 (built 1.3 is inside 1.25-1.35), width 2 at five places, 1.2 H holes, 14.2 r, 65 deg, 15.25 and 1.8 r all agree with the reader. 10-6-9 and 10-6-10 (R 6, width 4) accepted, likely. Hardening notes agree. 10-6-11, 10-6-12 can't tell, agreed. Hand: same drawing view as sheet 9 (65 deg clockwise from the eye at the bottom), match as above.

## Items the reader missed

- 10-2-v1: pin 050600-5 (1.16) against the Vorreiber's 0.8 hole: the whole cross-pin chain (Vorreiber hole, arbor hole, pin) is built at 1.15-1.16 against a sheet figure of 0.8; if the sheet is right all three change. The reader has the Vorreiber's hole and the pin separately; it should be one finding.
- 10-3-v1: the wheel's bore 4.0 +0.1 conflicts with the arbor's d 4.38-4.5 (fuseeArbor.json section): the sheet figure cannot go on the arbor; this is a conflict in the sheets (or an at-assembly pre-bore), not just a model choice.
- 10-3-v2: the boss text's first digit may be 6 (see 10-3-16).
- 10-5-v1 (small): sheet 9's pin diameter text (1.25) against its own drawn width (about 1.0-1.1).
- Not checked: where the eye pin (the end out of the spring's -y face) lands on the movement; which part it enters I did not establish.

## Summary of disagreements

- 10-3-14 (the 0.4 on the hub): reader has match, I can't confirm what it attaches to: can't tell.
- 10-3-7: agree it is a mismatch, but the cause is the sheet's own table (D 40.57) against its section (40.65); I add this.
- 10-3-16: agree can't tell; my scale reading is 6.5, and the text may read 6,6.
- 10-3-17: agree mismatch; I add the arbor's 4.38-4.5 as the cause.
- No other disagreements; the Vorreiber's length, flange and cross hole are confirmed as mismatches.
