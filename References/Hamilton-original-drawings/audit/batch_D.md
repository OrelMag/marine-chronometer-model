# Batch D audit (42026, 42027, 42028, 42050, 42087-2-51A and -1-52, 42093)

Method: blind read of each sheet (crops in crops/D/, 300 dpi, scale from the sheet's stated scale plus pixel checks), then the built-part JSON, then the transcription and recipe. Inches unless stated.

## 42026-1-01 Set-up ratchet wheel -> setupRatchet

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | 40 teeth | sure | 40 | MATCH | |
| 2 | tip dia .670 +-.002 | sure | .670 | MATCH | |
| 3 | root dia .621 | sure | .621 (root r .3105) | MATCH | |
| 4 | thickness .048 +0/-.002 | sure | .048 | MATCH | nominal at the top of the tolerance |
| 5 | square .115 +.001/-0 on the diamond, measured along a side (extension lines normal to the side) | sure | side .115, corners at (0,+-.0813),(+-.0813,0) | MATCH | |
| 6 | .155 MINIMUM across the corners | sure | diagonal .1626 | MATCH | |
| 7 | 65 deg, drawn from the sloping tooth line to the vertical (radial) line | likely | face-to-ramp included angle 73 deg; ramp to the radial at its outer tip 59 deg; at its root end 67.5 deg | MISMATCH / CAN'T TELL | Pixels on the sheet give about 66 deg at the tip the ramp starts from. The sheet is over-determined (.670, .621, 40 teeth, 65 deg, .030) and not to scale; no built angle is 65. |
| 8 | .030 offset of the leaning locking-face line from the centre line | likely | face leans 5.1 deg (tip (.335,0) to root (.3105,-.0022)); asin(.030/.3225)=5.3 deg | MATCH | |
| 9 | Hand of the teeth: going clockwise from a tip at the top of the wheel the long ramp falls inward, then the short face rises outward to the next tip (5 teeth in the crop) | sure | going clockwise from a tip the short face goes inward first, then the ramp climbs outward | MISMATCH, mirror image | Built wheel has the opposite hand. |
| 10 | .235 from the left finish-line end to the centre line | unsure | not built | CAN'T TELL | arrow is about .295 at the sheet's scale; a surface-mark dimension |
| 11 | APPROX .220 R finish lines; RAY FINISH | sure | text only | NOT BUILT (surface finish) | fine |
| 12 | nickel plate; steel SAE 1095; 6-30-41, memo 3-8-45; 8:1 | sure | stated | MATCH | |

## 42027-1-01 Set-up pawl -> setupPawl

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | bore .042 +0/-.001, straight (section shows no chamfer) | sure | bore .042 to z .029, then a 45 deg cone .042 to .080 | EXTRA (countersink) | The cone is 42010's (.080 across, 45 deg). 42027's section draws a plain bore; the sheet doesn't say whether 42010's chamfer carries over. |
| 2 | thickness .048 +0/-.002 | sure | .048 | MATCH | |
| 3 | Outline = 42010's, but pointing RIGHT: a mirror image. Pixels: boss r .0507, tip .230 out, upper tip corner (.184,.091); 42010's table gives (.182,.09), tip .228 | sure | tip at x -.228, corner (-.182,.09): 42010's hand | MISMATCH, hand | Mirror x. Sizes agree: arcs .05, .3516 (sheet .35), .1799 (.18). |
| 4 | POLISH on the top face | sure | text | n/a | |
| 5 | material 1.00 CARBON STEEL in 42027's own title block | sure | note says "not given on 42027" | MISMATCH in the note | |

## 42028-2-01 Set-up pawl spring (complete with pins) -> setupPawlSpring

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Plan is the x-mirror of 42007-2-01 (curled bulb upper left). Table: 1 (2,2); 3 (1.5924,1.9220); 17 (1.8987,1.6420); 2-(2.4076-2)=1.5924, 2-(2.1013-2)=1.8987 | sure | arcs centred (-.4076,-.078); hole 17 at (-.1013,-.358) | MATCH | |
| 2 | thickness .050 +0/-.002 | sure | .050 | MATCH | |
| 3 | hole 1: press fit for .0498 pin 35794, flush with top | sure | dia .0498 | MATCH | |
| 4 | hole 17 plan circle the same size as hole 1; the lower pin in the section is drawn like the upper | likely | dia .044 (42007's tapped hole) | MISMATCH | Both holes take the .0498 pin; built is .0058 (0.15 mm) small. 42007's hole 16 is absent on 42028; built also has none. |
| 5 | NICKEL PLATE, #1 emery finish, beryllium copper | sure | treatment "24K gold plate (as 42007)" | MISMATCH in the note | |
| 6 | outline radii (.47, .455, .36, .15, .03, .01) not restated; "see 42007" | CAN'T TELL | as 42007 mirrored | CAN'T TELL | the shape looks the same mirrored |
| 7 | the two pins (.0498, projecting about .09 below the strip) | sure | not built | NOT BUILT | bought part 35794 |

## 42050-1-01 Helical spring -> helicalSpring

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | free length .550 +.050/-0 | sure | .550 | MATCH | |
| 2 | outside dia .290 +-.005 (218 px at 5:1 = .291) | sure | .290 | MATCH | |
| 3 | wire .025 +-.001 | sure | .025 (inner .240) | MATCH | |
| 4 | 6 +-1/4 turns | sure | 6 (recipe) | CAN'T TELL from JSON | |
| 5 | closed turns per end 1 +1/4/-0 | sure | 1 each end (recipe) | CAN'T TELL | |
| 6 | solid length .185 max | sure | not measured | CAN'T TELL | |
| 7 | direction of coiling optional; BeCu; nickel plate; memo 2-17-43; 5:1 | sure | one hand | MATCH | |
| 8 | ends drawn flat (ground) | likely | wire cut flat at z 0 and .55 | MATCH | |

## 42087-2-51A (blank and pierce, op 61, 7-4-44) and 42087-1-52 -> detentBlank

Built y runs .0045 to .1355: the finished bar, after .0045 milled off each edge; z .002 to .043.

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | length 1.355 +-.002 | sure | 1.355 | MATCH | |
| 2 | width .140 +.002/-0; finished .131 (-1-52) | sure | .131 | MATCH | |
| 3 | thickness .045 +-.001; ground to .041 +0/-.001 (op 65) | sure | .041 centred | MATCH | |
| 4 | foot hole .0501 +.0002/-0, centre .070 +.002/-0 from the end and .070 +.001/-0 from the bottom | sure | .0501 at (.07,.07) | MATCH | "work hole", cornered at op 63 (size not printed) |
| 5 | slot .082 x .052 +0/-.001, round ends, centre .3947 +.002/-0 from the end (.070+.3247) | sure | r .026 ends, centre .3947 | MATCH | |
| 6 | window .143 +.001/-0 long, right end .3535 from the slot centre | sure | x .6052 to .7482 | MATCH | |
| 7 | window HEIGHT .072 +.001/-0; its bottom .0360 +.0005/-0 above the blank's bottom edge; top web .032. Pixels: window 177 px at 2414 px/in = .073, bottom web 81 px = .034, top web 78 px = .032. On -1-52 the window is 40 px of an 85 px bar. The assembly 42093 shows a tall window between thin webs. | sure | window y .032 to .068 (height .036) | MISMATCH | Built is half the height and too low: built .032-.068, drawn .036-.108 (pre-milling y). Top edge off by .040 (1.0 mm), height by .036 (0.9 mm). The arrows for .072 span the window's top and bottom lines; .0360 spans from the window's bottom line to the blank's bottom edge. |
| 8 | top notch starts .040 right of the window's right end (x .7882), floor .064 +.002/-0, to the bump at x 1.0082 (.260 +0/-.002 from the window's right end) | sure | same | MATCH | |
| 9 | bump 1.0082 to 1.0732 (.065), top ".079 +-.001" above the bottom edge; scale gives about .074 | printed sure, scale disagrees | .079 | MATCH to the printed figure | |
| 10 | floor .064 again 1.0732 to 1.2482 (.1750 +.0005/-0); block to 1.355 (.107 +.002/-0) | sure | same | MATCH | |
| 11 | end slot .0500 +.0002/-0 wide on the centre line, floor at the slot centre + .8985 = 1.2932 | sure | y .045-.095, floor 1.2932 | MATCH | |
| 12 | bottom cut 1 .165 +0/-.002, x .8432-1.0082; .038 +.002/-0 is the web between its top and the notch floor | sure | to y .026, x .8432-1.0082 | MATCH | |
| 13 | bottom cut 2 .115 +0/-.002 after a .065 gap (x 1.0732-1.1882), drawn at cut 1's height | sure for widths | y .026 | MATCH | depth not dimensioned |
| 14 | -1-52: op 63 corner work hole, op 66 mill each edge to .131 | sure | hole not cornered | NOT BUILT (no size printed) | |
| 15 | assembly sheet shows a second pin on the foot and a small notch at the foot's top-left corner | likely | not built | CAN'T TELL | belongs to the finished 42087-3-01, not in the set |

## 42093-2-01 Detent assembly (blind read; no part built)

Exploded isometric plus put-together view, date 5-3-44, no dimensions. Callouts, one each: 20756 detent adjusting screw; 42086 detent support block; 42091 lock adjusting screw; 42091 clamp screw; 42087 detent, complete with jewel; 42092 trip spring support bracket; 42088 trip spring; 1770 support bracket screw; 1770 trip spring screw; 42251 washer; 37204 detent clamp screw.

- The detent is one long bar: a thick foot with a round hole, an oval slot and two plain standing pins, then a long open window framed by two thin webs (clearly taller than each web, supporting .072 high between .036 and .032 webs), a thicker post with a shoulder, a thin blade, a cross-piece and the jewel block with its upright pin and the jewel arm.
- The foot lies against the support block 42086. The large slotted screw 37204 and washer 42251 go through the foot's slot into the block; the foot's pins go into the block's holes; the block has two standing pins on top, a tapped hole between them, an end hole for 20756 and a front slot crossed by the two 42091 screws.
- The jewel-block end carries the Z-bent bracket 42092 and the tapered trip spring 42088, held by two 1770 screws.
- Not settled by the sheet: which blank hole takes which pin (51A has one hole, the assembly two pins), what the notches, bump and cuts are for beyond leaving thin webs (.038 and .064) that make the blade's flexing section.

## Disagreements with the transcription

| item | transcription / recipe | blind reading | who is right |
|---|---|---|---|
| 42087 window | .0360 high, .072 below the top edge | .072 high, bottom .036 up, top .032 below the top | blind reading, sure |
| 42026 tooth hand | built face first, then ramp, clockwise | ramp first, then face (mirror) | blind reading, sure |
| 42026 65 deg | included angle between face and ramp | drawn from the sloping line to the radial line | unsure; built face-ramp 73 deg, ramp-radial 59 deg, neither 65 |
| 42027 outline hand | 42010's pawl as it stands | mirror of 42010 | blind reading, sure |
| 42027 countersink | cone copied from 42010 | none on 42027's section | blind reading, likely |
| 42027 material | "not given on 42027" | 1.00 carbon steel in its title block | blind reading, sure |
| 42028 hole 17 | .044 | same as hole 1 (.0498 pin) | blind reading, likely |
| 42028 plating | 24K gold plate as 42007 | nickel plate | blind reading, sure |
| 42026 .115 | "across flats" | side of the diamond | same number, harmless |

## Builder estimates the sheet settles

- 42087 bump .079 vs .075: unsettled; the printed digits are .079, the drawn scale .074.
- 42087 bottom cut depth .026 from the .038 web: settled, sure (arrows on the cut's top and the notch floor).
- 42087 cut 2 depth equal to cut 1: drawn at the same height; likely.
- 42026 .030 as the leaning-face offset: consistent (5.3 vs built 5.1 deg); likely.
- 42050 ground ends: drawn flat; likely.

## Joints and fits

- Set-up ratchet: square .115 +.001/-0 (diagonal .163, minimum .155) on its arbor's square; 40 teeth .670 over, .621 root, .048 thick (+0/-.002). The teeth's hand sets which way the pawl pushes.
- Set-up pawl: pivot bore .042 +0/-.001 (a .042 pin or post); thickness .048 +0/-.002; tip meets the ratchet's tip circle.
- Set-up pawl spring: .050 +0/-.002 thick; holes 1 and 17 press fit for .0498 pins (35794), flush with the top, projecting about .09 below. The pins' .0498 is not the pawl's .042 bore, so spring hole 1 and the pawl's pivot are different pins. Datum 1 (2,2) is the spring's hole 1; table 3 is the arc centre.
- Detent: foot hole .0501 (work hole); slot .052 wide, .082 long, centre .3947 from the foot end (clamp screw 37204 with washer 42251); window .143 x .072 between webs .036 and .032; notch floor .064 and bottom cuts to .026 leave a .038 web; the end slot .0500 wide takes a .050 tongue (not on these sheets).
- 42093: two 1770 screws hold 42092 and 42088 to the jewel block; 20756 into the block's end; two 42091 screws across the block's front slot.

## Recommended fixes, most important first

1. detentBlank: window .072 high, bottom at y .036, top at y .108 (pre-milling y; subtract .0045 after milling); fix the recipe's `window` entry and the transcription's item 11.
2. setupRatchet: mirror the tooth profile (opposite hand).
3. setupPawl: mirror the outline in x (the 42027 pawl points right); remove or flag the 42010 countersink (42027 draws a plain bore).
4. setupPawlSpring: hole 17 to dia .0498; treatment to nickel plate, #1 emery finish.
5. setupPawl: material note should read 1.00 carbon steel.
6. setupRatchet: record that 65 deg does not reconcile with .670/.621/40/.030 (built face-ramp 73, ramp-radial 59).
7. Leave open: the bump .079 vs .075, the foot's second pin and top-left notch on 42093.
