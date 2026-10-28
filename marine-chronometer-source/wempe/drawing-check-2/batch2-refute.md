# Batch 2, the refuter: the escapement (escape wheel and arbor, both issues; the detent 1436; the gold spring 05 04 01-2; the detent block in each version; the layout 05 04_01; the tooth form 02 04 08 a)

Second drawing check (PLAN-wempe-drawing-check-2.md), step 7, 28 October 2026. The refuter worked from the sheets, the photographs and the built model only. It read the model's code comments for intent, but not `batch2-read.md`, `batch2-model.md`, the transcriptions or the first pass's reports until every verdict below was written. The last section compares with `batch2-model.md`.

## How it was measured

- **Sheets.** Each sheet was cropped and enlarged with PIL (`python -P`), with a pixel grid in the sheet's own coordinates. Lines were located by column and row profiles of the inverted image (the line centre is the profile's centroid). Circles were fitted by least squares to the dark pixels in an annulus, rejecting outliers.
- **Scratch.** Everything is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b2r\`. That holds `crop.py` and the crops named below. `seat.txt` and `seat.json` are seatcheck's output.
- **The scale of 05 04_1's plan.** The plan was scaled five independent ways:

  | from | what it gives |
  |---|---|
  | the 18,8 arrows' tips | x 307.5 to 768.0: 24.49 px/mm |
  | the roller (Heberolle) Ø 6,78 | circle fitted Ø 165.9 px: 24.47 |
  | "Gangrad-Unruh 10,00" | the hub circle's centre (303.7, 650.9) to the roller's centre (157.5, 453.3): 24.57 |
  | "v. Unruhmitte 25,68" | to the block screw's fitted centre (767.3, 294.4): 24.56 |
  | "v. Gangradmitte 23,8" | 24.57 |

  So the plan is 24.47-24.57 px/mm, mean 24.53 (10:1 on an A3 scan: nominal 24.4).
- **The elevation.** Scaled 24.5-25 by its 6,5, 2,8 and 1,3.
- **Other sheets.**
  - 1436 (10-1, 10-2): about 17.3-18 px/mm. Its own figures disagree with each other by several percent.
  - 05 04_7.1 and 7.2: 17.4-17.7 px/mm by their 23 and 22,8.
  - 02 04 08 a: 82.8 px/mm (the code's fit on the tips' Ø 14).
- **The stone's centre on 05 04_1's plan.** (306.3, 475.0), from the pipe's outer circle (x 294.5-318, y 463-487). The inner circle, the stone's Ø 0.75 drawn as 18 px (0.73), is concentric.
- **Model.** The read-only worktree `wempe-check2-audit2` (main 2851343a, 3.46.02), not edited:
  - `seatcheck.py --model wempe -v` over all five states (MC_GL=gpu): 503 pieces, 481 seated, 11 expected, 0 failing.
  - `wempe_load.js` in Node for `WESC` (TP 12.884, PIPE0 1.900, SET.BL × ES 12.875 mm, HORN_L 4.4, the gold path starting at GB 6.7).
  - The builder's code read for each version's settings (`dv(...)` at escapement.js 769-776, the bores at 638 and 721, the blocks at 796-980).

## Verdicts

| claim | verdict | evidence | sure |
|---|---|---|---|
| **C1** pipe from the blade's top edge down 1.9 (2.0 first drawn) to about 4.25 under the plate; the model's 1.90-3.80 (last) and 1.95-3.65 (first, 1943, 6MX) | **confirmed** | See C1 below. | sure (sheet), likely (the built heights) |
| **C2** first drawn: the arm 2.5 wide, set back about 1.07; the model's photographed 3.56 | **confirmed** | See C2 below. | sure |
| **C3** the gold spring's bending point is the dashed marker about 6.2 from the stone; the model's GB 6.7 lies on the glyphs of "0,04" | **confirmed** (I read 6.14, not 6.22) | See C3 below. | sure that it is not 6.7; the marker's place 6.10-6.23 |
| **C4** the detent spring's bending point marked about 12.6; the model's TP 12.88 is the spring's middle | **confirmed** (I read 12.51) | See C4 below. | sure that a marker is there and short of the middle; its place 12.45-12.6 |
| **C5** the escape wheel's fit is 1,8 H7/h6, not the table's 1,7 | **confirmed, likely** | See C5 below. | likely |
| **C6** first drawn and 3955: no M1 and no pin holes in the block, while 05 04_1 draws them going in | **confirmed** | See C6 below. | sure |
| **C7** the 6MX's WN-gkA and 6MX.gke run in solid metal | **confirmed** (the model's own record) | seatcheck: `~~ 6mx detentBlock WN-gkA … OPEN … runs in solid metal, its hole not cut` and `~~ 6mx detentBlock 6MX.gke … OPEN … its tapped hole not cut`. Both are listed in SEAT_EXPECTED as OPEN, so seatcheck passes them. Whether the real 6MX block is tapped there is not on any sheet (photographs only), but a screw needs a hole. | sure |
| **C8** 05 04 01-4 draws only the M1 in the end face; the Ø 0.45 pin holes are an estimate wrongly credited to that sheet; WN-14 is a plain Ø 0.70 bore with a plain Ø 0.66 shank labelled tapped | **confirmed** | See C8 below. | sure |
| **C9** the block's slit lies across the plate on 05 04 01-4; the model's is parallel | **confirmed** for 05 04 01-4 (last and 1943); **not** for the 1941 arm | See C9 below. | sure (05 04 01-4); sure (05 04_1's 1941 arm parallel) |
| **C11** the horn flush with the "oben" edge, with an end bevel 0.75 from the tip | **confirmed** (flush); **likely** (bevel) | See C11 below. | sure (flush); likely (bevel) |
| **C15** the escape arbor about Ø 1.0-1.1 between the wheel and the pinion; the model's Ø 1.2 | **confirmed for 05 04_7.2 (last)**; **refuted for 05 04_7.1 (first)** | See C15 below. | likely |
| **3.41.00** blade flush toward the block (10-2's "linke Seite") | **holds** | See "The 3.41.00 decision" below. | sure |
| "oben" is the dial side; the blade on the detent's lower edge in 05 04_1's elevation | **holds** | See '"oben" is the dial side' below. | sure |

### C1: the pipe

- **05 04_1's elevation** (`pipeE.png`, `pipeZ.png`; plate face at y 71, about 24.8 px/mm):
  - The detent's square spans y 103.75-152.5: 1.32-3.29 under the plate.
  - The blade is flush with its lower edge, y 127.5-152.5 (2.28-3.29).
  - The pipe is a closed dashed outline x 296.5-322.5 (Ø 1.05 drawn), with its bore lines at 300 and 319.5. It runs from y 127.5, exactly the blade's top line, down to a dashed floor at y 176.5.
  - That puts the pipe at 2.28-4.25 under the plate, 2.0 long.
  - The hatched stone (x 306.5-319.5) runs from y 79 (0.32 under the plate, across the teeth) down to the pipe's floor.
- **Not the escape arbor.** The wheel's centre projects to nearly the same x, but the outline is closed top and bottom, and the arbor would run on past it.
- **1436's right view** (`r10top.png`):
  - The pipe band runs x 489.7-523.4 ("2 (1,9)").
  - The blade runs x 489.0-508.0 ("1 (0,9)"), flush with the square's and foot's edge at 507.
  - So the pipe starts at the blade's "unten" edge and runs 1.9 toward "oben", 1.0 past the flush edge.
- **The model** (escapement.js 769-776; `PIPE0` 1.900 in Node):
  - Last revised: pp 1.90, pl 1.9, so 1.90-3.80. The blade is at 2.35-3.25 (d0 1.3, w 1.9 centred in 2), so the pipe stands 0.45 above the blade's top and 0.55 below it.
  - First, 1943 and 6MX: pp 1.95, pl 1.7, so 1.95-3.65. The first-drawn blade is at 2.30-3.30.
- **What the sheets give.**
  - Last: 2.35-4.25.
  - First: 2.30-4.30 (scaled 2.28-4.25).
  - The code's own comment says the elevation "draws pipe and stone over the wheel's arbor and can't be read apart". The profile separates them.

### C2: the first-drawn arm

05 04_1's plan (`arm.png`):

- The arm's outline runs from x 233 (its end) to the base at 676. Its edges are at y 384 and 446: 62 px, 2.53 mm.
- Under it, an empty band reaches the detent's top line and the base's edge at y 472: 26.5 px, 1.08 mm.
- So the arm's far edge is 3.6 behind the base's edge, which is where the photographs put it, but the sheet's arm is 2.5 wide and set back 1.07.
- The model (escapement.js 941: `nA0=nF, nA1=nF-3.56`) builds it 3.56 wide, flush with the base's edge. Its comment knows the sheet's 2.5 and 1.06.
- The setback is what gives the sheet's pipe room. In plan the pipe's top edge (y 461) clears the arm's lower edge (446) by 0.6. In height the arm (3.67-6.5) and the sheet's pipe (to 4.25) overlap by about 0.6. A flush arm and a pipe to 4.25 can't both be built, so C1 and C2 go together for 'first'.

### C3: the gold spring's bending point

05 04_1's plan (`bendA.png`, `bendB.png`, `strip.png`):

- **The marker.** The only mark is a short dashed vertical (column centroid x 457.0; dashes from y 481 down to 497, from the gold spring's line toward the label). Its distance from the stone's centre is 150.7 px: 6.13-6.16 mm over the five scales.
- **With the other reading's numbers.** The stone at 305.4 and 24.38 px/mm give 6.23.
- **Range.** 6.10-6.23. The drawing's own error, at 10:1 by hand, is perhaps ±0.2.
- **The curved arrow.** The arrow ending at x 415 (4.5 from the stone) is the head of the 86° angle's arc, not a leader.
- **The strip itself agrees.** The gold spring lies straight along the square's face line (y 487.5) from the square's start (x 509.6, 8.29 from the stone) to about x 460-470. Leftward it bows away (y 488 at 440, 489 at 400, 491 at 340). So the marker is where the drawn strip leaves the straight.
- **Measured from the square instead.** The marker is 2.15 before the square; in the model's frame (SQ0 8.384) that is 6.23.
- **Either way, not 6.7.** GB 6.7 would be x 470.6. The rotated "0,04" stands at x 462-475 beside the marker, so the model's figure lies on that glyph.
- **The model.** `GB=[6.7,…]` "scaled"; `WESC.GOLD(…)[0]` = [6.7, …].
- **The other "0,04".** There is another beside the detent spring's marker. Neither is explained by the sheet; I did not resolve them.

### C4: the detent spring's bending point

- A dashed vertical crosses the spring line at x 612.6 (y 452-503; `gang.png`). That is 12.48-12.51 from the stone (12.56 with 24.38 px/mm).
- On the plan the spring runs from x 568.6 to 684.7 (10.71-15.45 from the stone). Its middle is 13.08.
- The marker stands 1.8 from the square's end, 38 % along the spring from the square.
- **The model.** `WESC.TP` 12.884, the middle of a spring placed at 10.38-15.38. The marker is 12.5 absolute or 12.3 proportional, 0.4-0.6 short of the model.
- This changes makeEsc's BL (12.875 mm) by about 3 %. That is physics.

### C5: the escape wheel's fit

- **05 04_7.2.** The callout reads "1,8ø H7/h6" (`h72.png`), its arrows on the spigot's dashed lines. Those lines are at x 307.4 and 342.3: 34.9 px, 1.97 mm at 17.7. The table reads "H7 1,7ø +0,009 / h6 1,7ø −0/−0,007" (`fit72.png`).
- **05 04_1.** The hub circle fits to Ø 44.5 px, 1.82 mm.
- **02 04 08 a.** The hub's bore semicircle fits to Ø 151.3 px, 1.83 mm at 82.8 px/mm (`hub23.png`).
- **Three drawings against the table.** All three draw at least 1.8 and none draws 1.7. Only the table says 1,7. Its limits are the same for 1.7 and 1.8 (one band), so they decide nothing.
- **The model.** escapement.js 638: last 1.7, first 1.8.

### C6: the first-drawn block

- **05 04_1's plan** (`foot.png`):
  - The foot (y 472-490) has two pins, x 713-721 and 810-818. They run dashed into the block to y 442 (1.2 deep) and stand out 1.1 beyond the foot.
  - The slotted screw head is at y 490-524. Its shank runs dashed into the block (x 753-778, about Ø 1.0) to y 408, with a drill point meeting the Ø 1.3 circle at (765, 387).
- **The model.** `blkF` gets no `endH(...)` (escapement.js 845 and 893 apply it only to the 6MX and 1943/last blocks).
- **seatcheck.** It reports `~~ first/3955 detent WN-gf … OPEN: … its shank in the block's solid metal, no hole for it` and `WN-205.d … OPEN: … steady pins … lie in the block's solid metal`.

### C8: 05 04 01-4's end face and WN-14

- **The end face.** 05 04 01-4's right view (`blkR.png`) shows only the M1 (at 2,3 ±0,02) in the base's end face. Its plan (`blkP.png`) shows only the M1 dashed from the end face to the Ø 1,3. No pin holes are drawn.
- **The wrong credit.** escapement.js 813-815 credits "its two steady pins' holes Ø 0.45 1.6 deep" to "05 04 01-4".
- **WN-14** (escapement.js 721 and 762):
  - The square's hole is `nBore(..., 0.35)` (Ø 0.70), commented "tapped 0.42 deep … (M0.7)".
  - The shank is lathe r 0.33 (Ø 0.66) with no thread.
  - seatcheck holds WN-14 6/10 by the detent and the gold spring.
- **The gold spring's own Ø 0,7 +0,05 hole** (05 04_02) is rightly plain.

### C9: the slit

- **05 04 01-4's main view is the plan.** The Ø 0,9 pins, the "Ø 1,3 tief 3" and the M1,7 are drawn as circles open toward the viewer, so the view looks at the plate face. It is first-angle, with the right-placed view showing the end face.
- **In that plan** the slit is two lines 0,3 apart along the upright, 7 from its end. The M1,2 crosses the upright.
- **In the right view** the M1,2 is a circle (end-on) and the slit's floor is a dashed line across the upright's full depth at y 180.
- So the slit's plane stands across the plate (it contains the depth), and the screw runs across the slit.
- **The model's last and 1943 blocks.** They put the slit parallel to the plate with the screw in it. escapement.js 864-867 records the sheet's form and says "the photographs win". The 'last' version uses that block too.
- **The 1941 arm.** It differs: 05 04_1's elevation shows its slit edge-on as a band at y 194-199, through the screw circle's centre (y 197). That slit is parallel to the plate, as the model has it.

### C11: the horn

1436's right view (`r10top.png`, profiles):

- **Flush.** The horn's edges are at x 496.2-509.4 (0.75 at about 17.5 px/mm) and the blade's at 489.0-508.0. The horn's "oben" edge sits on the blade's (1.4 px, 0.08 mm, past it). Centred, it would be at 492.4-505.6.
- **The bevel.** A line crosses the horn at y 160.5, 13 px (0.74) below its tip at y 147.5. In the left view (`hornL.png`, `leftV.png`) "Anschrägen"'s leader points into the tip's last 0.5. That view shows a smooth curve with no kink, so the line may be the bevel's start or the bend's tangent edge.
- **The model.** The horn is `hm±wh/2`, centred on the blade (escapement.js 711: "at the blade's middle"), and its end is square.

### C15: the escape arbor

- **05 04_7.2** (row profiles every 10 px):
  - Between the pinion and the collet (y 350-420): lines 317-336, 19 px, 1.07 mm.
  - Above the pinion, toward the pinion end (y 230-270): 22-23 px, 1.24-1.28.
  - Under the wheel to the shoulder (y 530-550): 17 px, 0.96.
- **05 04_7.1.** Between the pinion and the collet (y 380-430): 302.0-322.4, 20.4 px, 1.16-1.17 at 17.4-17.6. It is labelled "1,2ø" there.
- **The model.** escapement.js: Ø 1.2 from the wheel's web to the dial-side pivot in both issues.
- So last revised should be about 1.05-1.1 between the collet and the pinion (1.2 beyond the pinion is fine). First drawn is right at 1.2.

### The 3.41.00 decision

- **1436's left view** (`leftV.png`): the 0,33 blade (x 240-246), the 0,55 thicker part and the square (240-251) are flush on the left (x 240). The horn bends to the left (its tip at x 233). 10-2 labels that side "linke Seite".
- **05 04_1's plan:**
  - The blade (y 472-480) is flush with the square (472-487.5) on the block's side (y 472).
  - The horn runs from the pipe up toward the block (straight lines to its tip at x 198, y 455).
- So both sheets agree that the flush side is the block's.

### "oben" is the dial side

The pipe extends past the blade's "oben" edge (1436). In 05 04_1's elevation it extends downward, away from the Oberplatte, past the detent's lower edge, and the blade lies on that lower edge. Down there is deeper under the top plate, +y toward the dial in the model's frame. The other reading would put the pipe at about 0.35-2.25 under the plate, through the teeth's band. The model's blade (b1 = d0 + 2 − c, the lower edge) is right.

## Ten figures most likely to be misread, against the model

1. **05 04_1 elevation, "2,3"** (`d23.png`):
   - What is drawn: the arrows run from the plate (y 76) to the square's lower line (152.5), which scales 3.3. The figure reads 2,3. A dash-dot centre line at y 128 is exactly 2.33 under the plate.
   - Reading: the figure is the detent's centre height, with the arrow drawn to the edge.
   - Either reading gives 1.3-3.3, 2 wide. The model has 1.3-3.3 (first drawn). **Matches.**
2. **05 04_1 "7,6"** (`blk.png`):
   - What is drawn: it runs from the block screw (y 294.4) to y 481, the spring and foot centre line, not the stone's line (y 475, 7.36).
   - The model has ACR + DOFF = 7.49 + 0.11 = 7.60. **Matches.**
3. **05 04_1 "18,8"**:
   - What is drawn: a horizontal distance along the detent, from the stone's line to the block screw (centre to centre).
   - The model has ALG 18.73-18.74 along t, 0.06 short. Within the drawing.
4. **05 04_1 hub "1,8"**:
   - Diameter or radius: the fitted circle is Ø 1.82, so it is a diameter.
   - The model's last-revised 1.7 is wrong (C5).
5. **05 04_7.2 "1,8ø H7/h6" against the table's "1,7"**: which figure the fit is. See C5.
6. **1436 "5,4 (4,9)" against "4,4"** (`dims10.png`):
   - What is drawn:
     - "4,4" runs from the horn's tip to the pipe's centre line; it scales 5.0-5.2.
     - "5,4 (4,9)" runs to the pipe band's lower edge; it scales 5.5-5.6.
     - 4.4 + 0.575 = 4.975 fits the bracketed 4,9. The unbracketed 5,4 would make a horn of about 4.8 to the centre.
     - 05 04_1's plan draws the horn's tip 4.42 from the stone along the detent (`hornP.png`), 0.8 to the block's side.
   - The model's 4.4 for both versions follows the layout. **Matches.**
   - The 5,4 is a 0.5 pair, unlike every other pair on 1436 (0.03-0.1). The code says "every pair differs by 0.03-0.1", which misses this one.
7. **05 04 01-4 "2,3 ±0,02"**:
   - Which face it is measured from: in the first-angle right view it runs from the plate face (the face the plan sees: its blind Ø 1,3 drawn solid) to the M1.
   - The model has the M1 2.3 under the plate. **Matches.**
8. **05 04 01-4 "1,4 +0,1", "3", "3,75", "18,8 ±0,03", "25"**:
   - What is drawn: the upright 1.4 in from the end face and 3 wide; the screw row 3.75 from the base's far edge; the M1,2 18.8 from the row, so 2.45 from the upright's end.
   - The model has nUl = nE − 1.4 and nUr = nUl − 3; tF = ROW + 3.75; tS = ROW − 18.8, tU = tF − 25. **Matches.**
9. **05 04 01-4 "0,3" × "7"**:
   - What is drawn: the slit's width and its length from the end. The screw is about 2.45 in, so the slit runs 4.55 past it.
   - The model keeps 0.3 × 7 but turns the plane (C9).
10. **1436 left view, the spring "0,09 / 0,07 / 0,09"**:
    - What is drawn: 0,09 at each end and 0,07 at the middle (the leaders sit on the spring, not on the square or foot).
    - The model's spring halves taper 0.09 → 0.07 → 0.09. **Matches.**
    - That middle is 12.88, not the sheet's marked bending point (C4).

Also checked:

- 05 04_1's escape wheel teeth "0,5" and "1,4": the plate to the wheel's top face, and its thickness. The model has first ew0 0.5, ew1 1.9.
- 1436's "1,15" is the pipe's Ø. The model has 1.15.
- 05 04 01-2's "2", "1", "1,2", "2,4", "15,4" and "0,7 +0,05". The model has the head 2 × 2.4, the arm 1 and the hole Ø 0.70 1.2 from the end.

All match.

## After reading batch2-model.md

I agree with the model comparer on every claim. On M1, M2, M5, M6, M7, M8, M9 and the 3.41.00 and "oben" questions the readings are the same, reached independently. Differences of degree:

- **C3 (M3): 6.22 against my 6.14.**
  - The comparer scaled 05 04_1 at 24.38 px/mm from the 18,8, taking the block screw's centre as x 763.8.
  - My fitted circle on that screw puts it at 767.3, which agrees with the 18,8 arrow's tip (768). Four other figures (6,78, 10,00, 25,68, 23,8) give 24.47-24.57.
  - With their stone at 305.4 and my scale the marker is 6.18. The marker is 6.13-6.23 by any of these, and the strip leaves the straight there too.
  - They rate it "likely". I would rate "sure that the drawn bending point is 6.1-6.25 and not 6.7". The remaining doubt is only whether the draughtsman meant a figure the layout doesn't state (±0.2).
- **C4 (M4): 12.60 against my 12.51**, for the same scale reason.
  - They rate it "possible". The dashed marker on the spring is unambiguous, so I would rate "likely".
  - Whether makeEsc's flexure should move there is a physics choice. The marker is not at the spring's middle in any frame (12.3-12.6 against 12.88).
- **C15 (M15).** They give "possible" and note 07-1's "1,2ø".
  - I agree, and add that 07-2 draws the part beyond the pinion at 1.24-1.28. So only the stretch between the collet and the pinion (1.07) is wrong, as last revised.
  - First drawn (07-1, about 1.17, labelled 1,2) is right at 1.2.
- **C11 (M11).** They rate both parts "possible". I measure the flush edge to 0.08 mm, against 0.075 for the centred alternative's offset. The flush edge is clearly what is drawn, so I would rate it "sure". I agree the bevel is "possible to likely".
- **"5,4 (4,9)".** I agree the model's 4.4 is right for the layout. Their attribution of 5.4 to the GUB's old horn is outside what I checked.
- **M2 with M1.** They note the first-drawn arm lies under the pipe's footprint. I reached the same coupling: the sheet's 1.07 setback is what lets its 2.0-long pipe reach 4.25 beside the arm.

No claim is refuted. The one partial refutation is C15 for the first issue (the claim names no issue): 05 04_7.1 draws and writes 1.2.
