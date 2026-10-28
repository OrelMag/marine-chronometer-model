# Batch 2, the model against the sheets: the escape wheel, its arbor, pinion and collet (both issues), the spring detent 1436 with its foot, spring, square, blade, pipe, horn and locking stone, the gold spring 05 04 01-2 and WN-14, the detent block 05 04 01-4 in each version, the escape jewels and endstones, the layout 05 04_01 and the tooth form 02 04 08 a

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch2-read.md`, with its Step 3 corrections). Its findings 1-25 and the questions the plan hands this step are settled below (section (d)). The ledger's S-2, S-3 and S-4 are confirmed (M6, M7). The 3.41.00 detent-blade decision holds. The reader's other blade question (which edge is "oben") is refuted for the blade, but the pipe's place along its own axis is wrong in every version (M1).

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit2`, detached at origin/main 2851343a (3.46.02). Nothing in it was edited.
- **Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b2m\` (written `b2m\` below).
- **Fit check.** `seatcheck.py --model wempe -v --json` over all five states (`b2m\seat.txt`, `seat.json`): 503 pieces, 481 seated, 11 expected, 0 failing. Its rows for this batch's pieces are in the fit list (step 6).
- **Solids.**
  - `b2m\dump.py` (batch 1's, with this batch's parts) loads the page (`?snap&qa`, GPU) and freezes it at phase 0, n 2.5. It writes every visible mesh of `escapeWheel`, `detent`, `detentBlock`, `escJewelUp`, `escJewelLow`, `escEndstoneUp` and `escEndstoneLow` in all five versions to `dump.json`, with `WESC.Y`, `W`, `B`, `P`, `DPIV` and `PIPE0`.
  - `b2m\lib.py` puts every vertex in the detent's own frame: t along the detent from the stone's centre P toward the foot, n across toward the wheel, d under the top plate's inner face (TI = −19.00). The t axis was taken from the two foot pins (4.205 apart, as built 4.2). Sections were cut with trimesh; lathe profiles were read as (r, y) rings about the escape arbor.
  - The block's end face was sectioned 0.3, 1.0, 1.55 and 2.5 into the metal to find its holes.
  - Hole 13 (the block's fixing screw) was taken from seatcheck's WN-gk centre.
- **Sheets.** Measured on the scans with column and row profiles and pixel zooms.
  - 05-04_01: 24.38 px/mm by its 18,8 (stone centroid x 305.4 to the block screw's ring 763.8). Its plan and the elevation (view A) were profiled at the pipe (x 296-323), the bending points (x 457, 612) and the gold spring's head (x 510-569).
  - 05-04_07-2 at 17.7 px/mm (the code's 17.6-17.76 by its 22.8). 05 04 01-4 at 17.1. 1436 at 17.3; 1436's right view was zoomed at the pipe and tip.
  - Crops: `s01_A.png`, `s01_pipe.png`, `s01_23.png` (view A), `s01_arm.png`, `s01_sq.png`, `s01_gb.png`, `s01_gb2.png` (plan), `s07b_collet.png`, `s10_right_top.png`, `s10_left.png`, `s10_tip.png`.
- **Photographs and video.**
  - Wempe 3955: `10_Wempe_3955_Feder_plus.jpg` (`p10f_det.png`, `p10f_blade.png`), `11_Wempe_3955_Gangfeder_plus.jpg`, `10_Vergleich_CWW-6MX_Gangfeder_mit_Kloben.jpg` and `8_Gangfeder_mit_Kloben_Rus_einfach.jpg`.
  - The GUB restoration Ldzmn4kuKMA (`E:\mc-video\Ldzmn4kuKMA_hd.mp4`): frames at 2:08, 2:11, 2:43-3:05 in `b2m\gub\`. The frames stay in the scratchpad.
- **Overlays.** `b2m\overlay.py` (batch 1's), output in `b2m\ov\`: sheet red, book blue, both black.
- **Renders.** `isolate.py --model wempe` (`b2m\iso\`): the detent, block and wheel from four sides, as last revised and as first drawn. Also two views along the detent's thickness (yaw 0.437 and 3.58, pitch 0.02), as last revised and as first drawn (`iso\last\`, `iso\first\`).
- **Book.** `book/wempe-build-book.pdf` (WBOOK), titled v3.41.00. That is before 798009c4 ("the escapement at the heights every source agrees on") and before 3.46.x. Pages:

  | Pages | Part |
  |---|---|
  | 153-161 | wheel 154, pinion and arbor 158, collet 160 |
  | 162-171 | detent 163, gold spring 167, foot screw and pins 170 |
  | 172-177 | block 173, screws 176 |

  The pages were rendered with their text (`b2m\book\`).

**Frame of reference.** The movement's y (dial side +y); the top plate's inner face TI −19.00. Depths d are given under TI. Escape wheel centre W (−11.783, 21.743), balance B (−9.10, 12.11), stone P (−14.392, 15.097).

- **As last revised** (Y): the wheel's teeth d 0.40-1.80 (y −18.6 to −17.2), its web d 1.10-1.80. The arbor runs from −20.98 to 1.80.
- **As first drawn, 1943, the 6MX and 3955** (Y1): the wheel 0.1 lower (teeth d 0.50-1.90). The arbor runs from −21.00 to 1.96.
- **The detent in every version**: its foot is clamped to the block's end face (n −0.19; −0.215 as first drawn and 3955). Its flexure is 0.11 off the stone's line (DOFF). Along t: the spring's middle TP 12.884, the square 8.384-10.384, the foot 15.384-21.984. Hole 13's row lies 18.738 along t and 7.492 across.

**Which version carries which sheet.**

| part | last | first | 1943 | 6mx | 3955 |
|---|---|---|---|---|---|
| wheel 05 04 05-1 (05 04_7.2, 1943; tooth form 02 04 08 a, 1942) | yes, bore 1.7 | 05 04_7.1's (1941), bore 1.8 | as first | as first | as first, collet a cone (photo) |
| arbor and pinion 05 04 05-2 (pinion 4.0 long, 22.78) | yes | 05 04_7.1's (pinion 3, 22.96) | as first | pinion 3.9 lower (photo) | as first |
| collet 05 04 05-3 (05 04 10) | 07-2's | 07-1's cone and pipe | 07-1's | a cone (photo) | a cone (photo) |
| detent 1436 | bracketed sizes, pipe 1.9 | unbracketed, pipe 1.7 (estimated) | bracketed, pipe 1.7 | bracketed, pipe 1.7 | as first |
| gold spring 05 04 01-2, WN-14 | yes | yes (on the square 0.025 further out) | yes | yes (WN-14 steel) | yes |
| block | 05 04 01-4 (shared mesh with 1943) | 05 04_1's arm block | 05 04 01-4 | 6MX block (photographs) | 05 04_1's block as photographed |
| banking screw | WN-gkA43 (photographed head) | cone41 (05 04_1) | WN-gkA43 | WN-gkA (photo) | cone41, 0.55 longer |
| jewels (no sheet; coloured section) | yes | yes | yes | settings steel | yes |

---

## 05-04_01 (Hemmung für Federchronometer, 10:1, 3.2.40, gepr. 11.2.41): the layout; as first drawn and Wempe 3955, and the figures every later version keeps

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| balance to escape wheel | 10,00 | 9.9997 | 0 | match | sure |
| wheel Ø | 14,00 | tips r 7.000 | 0 | match | sure |
| stone Ø | Ruhestein ø 0,75 | 0.750, half-round, flat on the wheel's radius | 0 | match | sure |
| stone from the wheel's centre | (scaled) | 7.14, 37.0° on (code, scaled) | — | as recorded | — |
| block screw from the balance | 25,68 | 25.773 (hole 13) | +0.09 | follows hole 13 (the plate's table: batch 9) | sure |
| block screw from the wheel | 23,8 | 23.413 | −0.39 | recorded (README Readings corrected: the plate's table is the plate as drilled; Wempe 3955 23.36) | sure |
| stone to the block screw's row | 18,8 | 18.738 (ACR 7.492) | −0.06 | the 1943 block's M1.2 is exactly 18.80 from the row, so its axis lies 0.06 past the stone. README 769 and escapement.js 52 say "18.77" (M12) | sure |
| block screw's row to the foot's middle | 7,6 | 7.600 (7.49 + 0.11) | 0 | match | sure |
| plate to the detent's top | 1,3 | 1.30 first, 1.35 last (centred in 2) | 0 | match | sure |
| plate to the foot screw's axis | "2,3" (its arrows end on the plate and on the screw's chain line, `s01_23.png`; the reader read it as a height) | 2.300 | 0 | match (this also settles 05 04 01-4's 2,3 ±0,02) | sure |
| detent width in view A | drawn 1.95-1.97 | 2.0 first, 1.9 last | — | match | sure |
| blade in view A | flush with the detent's **lower** edge: 2.26-3.30 under the plate (`s01_A.png`, profile at x 400-460: lines at y 127.5 and 152) | 2.30-3.30 first, 2.35-3.25 last | 0 | match | sure |
| pipe in view A | dashed from the blade's top (y 127, 2.24) to y 176.7 (4.23), 2.0 long, through the arm's top (3.64) | first 1.95-3.65 (1.7) | top 0.29 high, bottom 0.58 short | **M1** | likely |
| stone in view A | hatched from 0.34 under the plate (over the teeth) down to the pipe's bottom | 0.44 to the pipe's bottom 3.65 | — | follows M1 | likely |
| teeth | 0,5 under the plate, 1,4 thick (the reader's "0,5", likely; profile: teeth top 0.48) | first 0.50-1.90; last 0.40-1.80 | 0 / −0.1 | match (last: Y, recorded) | sure |
| the arm (view B is the arm in the same elevation) | 2,8 high to 6,5, the banking screw end-on 1,4 over its face (5.1) | 3.7-6.5, screw at 5.1 | 0 | match | sure |
| arm in plan | 2.5 wide (61.7 px), its near face 1.07 behind the stone's line (`s01_arm.png`) | 3.56 wide flush with the base's edge (photographs), near face n −0.215 | — | **M2** (as first drawn only; 3955 keeps the photographs) | sure |
| arm's slit | 6.1 from the end, 0.2, 1.39 over its lower face | as drawn | 0 | match | sure |
| banking screw tail ("pointed" figure, 12°) | cone 12° to a point | cone41, 12° written (10.8° scaled) | — | match | sure |
| banking screw head | Ø 3.29 (plan) | Ø 3.3 dome | 0 | match | likely |
| gold spring's head and screw | the head 8.40-10.77 from the stone (2.37: the 2.4 head), its screw at 9.57 (`s01_sq.png`) | head 8.18-10.58, screw 9.38 (centred on the square) | +0.19 | **M10** | possible |
| gold spring's bending point | dashed marker across the strip at x 457.2 (`s01_gb2.png`), 6.22 from the stone, a small dimension "0,0?" beside it | GB 6.70 ("scaled") | −0.48 | **M3** | likely |
| detent spring's bending point | dashed marker at x 612.5, 12.60 from the stone, "0,04" beside it | TP 12.884, the spring's middle (spring 10.38-15.38 here; 05 04_1 draws it 10.77-15.37) | −0.28 | **M4** | possible |
| "0,04" / "0,0?" at the two bending points | thickness at each bending point (likely), against 1436's 0.07-0.09 and 05 04 01-2's 0.15; the gold figure's last digit unread | not built (the 1950s build's gold spring is thinned to 0.06: BUILD) | — | recorded, no change (the drawings' versions build their part sheets) | possible |
| foot's pins and screw, side-on into the block | drawn into the block's end face, the screw's point in the cross hole | first: no holes in the block (S-2) | — | **M6** | sure |
| block holes in plan | (718,412) pin, (765,293) screw, (765,395) cross hole, (812,165) pin = 05 04 01-4's pattern | the same (code "sure") | ≤0.1 | match | sure |
| cross hole from the end face | 3.1 by scale | 2.8 (05 04 01-4's) | −0.3 | version difference, untoleranced layout; kept | possible |
| crossings, angles (22°10', 6°, 24°, 21°, 2°, 1°, 86°, 15°, 20°, "6,0") | — | README Readings corrected (PHI0, PHI_C) | — | as recorded | — |

## 05-04_02 (Goldfeder 05 04 01-2, 5:1, 16.9.42): every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 0,15 | 0.150 (n 0.359-0.509 last) | 0 | match | sure |
| arm width | 1 | 1.00 (d 2.25-3.25), flush with the head's lower edge | 0 | match (which edge faces the dial isn't on the sheet) | sure |
| head | 2 × 2,4 | 2.00 (d 1.25-3.25) × 2.40 (t 8.184-10.584) | 0 | match | sure |
| hole | Ø 0,7 +0,05, 1,2 from the end | Ø 0.700 (lower limit) at 1.2; across: d 2.30, 1.05 over the head's lower edge (drawn mid-height) | 0 | match | sure |
| length | 15,4 | 15.31 along the bow (the free part's outline 11.42 + 3.88) | −0.09 | within ±0.1; README 107's "about 15 here" understates (M12) | sure |
| material | Goldblech 333 federhart | gilt, density 11.6 | — | match | sure |
| surface ▽▽▽ | — | the book shows ∇∇∇ | — | carried | sure |

## 05-04_03 (Gangfederkloben 05 04 01-4, 5:1, 8.7.43): as last revised and 1943 (one mesh); the 6MX's block is its form from photographs

| feature | sheet | model (last, 1943) | diff | verdict | sure |
|---|---|---|---|---|---|
| base length | 14,6 | 14.60 (n −0.19 to −14.79) | 0 | match | sure |
| base depth (in the main view) | 25 − 17,5 = 7,5 | 7.50 (t 14.98-22.48) | 0 | match | sure |
| base thickness | 6,5 +0,05 near the end, 3 beyond ("6,5", drawn 6.4) | 6.5 for 6.4, then 3 | −0.1 in length | recorded (README: the 6,5 would cut the M1.7's thread) | sure |
| upright | 3 × 3, 1,4 +0,1 from the end, 25 overall | 3.00 × 3.00, 1.40 from the end, t −2.52 to 22.48 | 0 | match | sure |
| upright's foot | step 0.35 at 15 (2.5 over the base), cove "3r" to 0,4 over the base | as drawn (JC: r 3 through both ends) | 0 | match (overlay `ov\blk_main.png`: book unmatched 14 %) | sure |
| upright's depth | 3, at the free face (first angle) | d 3.5-6.5 | — | match (README) | sure |
| slit | 0,3 × 7 from the end, its plane across the plate (main view: two lines along the upright; right view: its floor dashed) | 0.3 × 7 **parallel to the plate**, round the screw (the photographs of DEC 422, DEC 479, Lange 5177) | orientation | **M9** (as last revised) | sure that they differ |
| M1,2 | 18,8 ±0,03 from the row | 18.800 (t −0.066), d 5.15 | 0 | match | sure |
| M1,7 | 7,3 +0,04 from the end, on the row | hole 13 at 7.30 (n −7.49) | 0 | match | sure |
| Ø 1,3 tief 3 | 2,8 from the end, from the plate face | Ø 1.30 at 2.8, d 0-3.0 | 0 | match | sure |
| M1 from the end face | 2,3 ±0,02 from the plate face | bore Ø 0.729 (the M1's minor), axis d 2.30 | 0 | match (thread drawn as the shank's crests in the metal: bom embed) | sure |
| steady pins Ø 0,9 | (2,3; +2) and (12,3; −2) | Ø 0.90 at (2.3, +2), (12.3, −2) | 0 | match | sure |
| end-face pin holes | **none drawn** (right view: M1 only) | Ø 0.45 × 1.6 at ±2.1 (t 16.64, 20.85; d 2.31), credited to "05 04 01-4" | — | the holes are needed (1436's pins) but are an estimate: **M8** | sure |
| 0,4 step, 90° +0,5° end | drawn | the 0.4 is the cove's end; the end square | 0 | match. Code 794-795 says "left out" (M12) | sure |
| surface ▽▽▽, ±0,1 | — | the book shows none | — | M13 | sure |

## 05-04_07-1 (Gangrad 05 04 08 bis 10, 5:1, 4.4.41) and 05-04_07-2 (05 04 05-1, 19.7.43): the wheel, arbor and collet

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 07-2: 22,8 −0,02; 07-1: 23 −0,2 | last 22.780; first 22.960 | lower limits | within | sure |
| pivots | 0,24 framed, ×0,5 (lower); upper not given | Ø 0.240 × 0.50 both ends | — | the upper's Ø is an estimate; README says "pivots Ø 0.24 × 0.5 (sure)" (M12) | sure |
| shoulder to the end | "2" | 1.96 (Ø 1.0 ends at −19.02) | −0.04 | match (arc r 3: the Ø 6 circle) | sure |
| Ø 6 circle | tangent to the pivot's cone (07-1 lower, 07-2 upper) | concave arcs r 3 at both ends | — | match | sure |
| pinion's face from the end | 5,3 (07-2); 5,? (07-1) | 5.30 last; 5.26 first | 0 | match | sure |
| end to the wheel's face | 19 (07-2); 13,8 from the pinion (07-1) | 19.00; 13.80 | 0 | match | sure |
| pinion length | 07-1: 3; 07-2: scaled 4.0 | 4.0 last, 3.0 first, 3.9 6MX (photo) | — | as recorded (README) | likely |
| pinion | 08: z 10, m 0,263, tips 2,97, root 1,6 | the same | 0 | match | sure |
| arbor Ø between the wheel and the pinion | 07-1 "1,2ø" (the neck); 07-2 draws 0.99-1.09 inside the collet and above it (`s07b_collet.png`) | Ø 1.20 throughout | +0.1-0.2 | **M15** | possible |
| arbor Ø on the plate side | (scaled 1.0-1.08) | Ø 1.00 | 0 | match | likely |
| collet length | 4,7 (07-2); 5 (07-1) | 4.70 last; 5.00 first | 0 | match | sure |
| collet (07-2) | Ø 2.79 for 1.6 (drawn 49.4 px), then the pipe 1.66 (29.4 px), bevels | Ø 2.80 / 1.70, chamfers 0.15 | 0.01-0.04 | match | likely |
| collet (07-1) | cone Ø 3,0 to 2.7 at 1,8, pipe 1,8ø to 5 | the same | 0 | match | sure |
| wheel's bore and spigot | callout "1,8ø H7/h6"; table 1,7 (+0,009 / −0,007); the spigot drawn 1.91-2.05 wide, **wider than the collet's pipe** (1.66) | last: bore Ø 1.708 on a spigot Ø 1.700; first: 1.808 on 1.800 | −0.1 | **M5** | likely |
| wheel thickness | 1,4 at the rim; web 0,7 (0,8 struck) | 1.40 / 0.70 | 0 | match. README 105 says "0.8 in the web" and checks.py DFM says "0.6 deep" (M12) | sure |
| recess | 07-2 dashed Ø 11.65 on the plate side; 07-1 12,4 (11,9 struck) on the pinion side | Ø 11.62 on the plate side, 0.7 deep | — | as recorded (README, As first drawn) | likely |
| "D = 15,0" (07-1) | — | tips Ø 14.000 | — | a slip (05 04_1, 02 04 08 a: 14) | sure |
| "D = 3,13" (07-1) | 08's turned blank | tips 2.97 | — | match | sure |
| "Rad von uns aufgesetzt" | note | — | — | the book doesn't carry it (M13) | sure |
| surface ▽▽▽ (07-2) | — | the book says "none on the drawing" | — | M13 | sure |

## 05-04_08 (Gangtrieb Hz 05 04 05-2, 5:1): every version

The leaves are as drawn: z 10, m 0.263, tips 2.97, root 1.6, pitch Ø 2.63. The blank's 26.5, 6.5 and 5 and the 60° centres are turned off. Material: the book gives "Präz. Rundstahl 3,4". Surface "(▽▽▽▽) ▽▽▽" (the transcription has "(∇∇∇) ∇∇"): the book says "none on the drawing" (M13).

## 05-04_10-1 and 10-2 (Gangfeder 1436, Grießbach 17.2.43, 5:1): every version

As last revised, 1943 and the 6MX build the bracketed sizes. As first drawn and Wempe 3955 build the unbracketed.

| feature | sheet | model (last / first) | diff | verdict | sure |
|---|---|---|---|---|---|
| foot | 0,65 (0,60) × 2 (1,9) × 6,6 | 0.600 / 0.650 × 1.900 / 2.000 × 6.600 | 0 | match | sure |
| foot's holes | two small and a large, no figures; pins through it on both sides | pins Ø 0.45 at ±2.1 (1.25 and 1.15 from the ends); screw clearance Ø 1.1 at 3.35 | — | scaled; the GUB's old foot measures 1.30 and 1.18 (Ldzmn4kuKMA 3:05.5, likely) | likely |
| spring | 0,09 at both ends, 0,07 in the middle, 2 (1,9) wide | 0.087 / 0.070 / 0.088 at t 15.0 / 12.88 / 10.6; 1.90 / 2.00 | 0 | match | sure |
| spring length | no figure (scaled 5.0) | 5.00 | — | as recorded | likely |
| square | 2 long; 0,55 (0,50) with the blade's thicker part | 2.00; 0.500 / 0.550 | 0 | match | sure |
| blade's thicker part | 0,55 (0,50), no length (scaled 2.9) | 2.9 | — | as recorded | likely |
| blade | 0,33 (0,28) × 1 (0,9) | 0.280 / 0.330 × 0.900 / 1.000 | 0 | match | sure |
| left view: blade, thicker part and square flush on one side ("linke Seite") | the horn bends to that side ("Anschrägen") | blade flush on −n (the block's side); horn bends to −n (n −0.50 to −0.74 at its end) | 0 | match: **the 3.41.00 decision holds** | sure |
| right view: blade flush with the "oben" edge | flush with the foot's and spring's "oben" edge (`s10_right_top.png`, x 435 against 435) | flush with their lower edge (d 3.25): "oben" is the dial side, as 05 04_1's view A draws the blade (above) | 0 | match (finding 3 refuted for the blade) | sure |
| pipe, "Röhrchen, oben" | band from the blade's "unten" edge, 2 (1,9) toward "oben" (1.0 past the blade's flush edge) | last d 1.90-3.80 (0.45 above the blade, 0.55 below); first, 1943, 6MX d 1.95-3.65, **1.7 long** | 0.45 / 0.35 toward the plate | **M1** | sure (sheet), likely (movement) |
| pipe Ø | 1,15 (superscript ø) | 1.150 | 0 | match | likely |
| horn | 0,25 (0,22) thick, 0,8 (0,75) wide | 0.220-0.235 / 0.25-0.27 × 0.750 / 0.800 | 0 | match | sure |
| horn across the width | flush with the "oben" edge in the right view | centred on the blade (d 2.425-3.175 for the blade's 2.35-3.25) | 0.075 | **M11** | possible |
| horn's length | 4,4 (left view, to the pipe's centre, drawn 5.2); 5,4 (4,9) to the pipe's far edge | 4.40 | — | 4.9 − 0.575 = 4.33 fits 4.4; 5.4 − 0.575 = 4.83 is the GUB's old horn (4.8, its own blade 1 mm longer) and won't fit 05 04_1's layout: the horn's end would come 0.4 inside the discharge stone's reach. Model right | likely |
| a line across the tip 0.75 from its end (right view) | "Anschrägen" (bevel) | the horn's end square | — | **M11** | possible |
| "0,18 u.d.f." | unread | — | — | unread (finding 9) | — |
| hole for WN-14 in the square | **none drawn** | Ø 0.70 plain bore 0.42 deep at the square's middle, "tapped" | — | needed; an estimate: **M8**. The GUB's remade detent shows a hole in its square (Ldzmn4kuKMA 2:46, 2:58) | sure |
| material | Stahl | steel | — | match | sure |

## 05-04_23 (Gangrad, Zahnform, 02 04 08 a, 25:1, 20.1.42): every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| tips | Ø 14 +0,03 | r 7.000 | lower limit | within | sure |
| floor | 11,7 | r 5.850 | 0 | match | sure |
| step top | 12,1 | r 6.050 | 0 | match | sure |
| rim inside | 10,9 | r 5.450 | 0 | match | sure |
| face lean, step place | 25° / 15° (the code's trace, rms 0.25 px) | FL 25, BK 15.0, BF 15.6 | 0 | match (Step 3 row 25: the transcription is out of date) | likely |
| back | ∅ 6 cutter, r 3.02 fitted | r 3.00 | 0 | match | sure |
| tip land | 0,1834 (1½°) | 1.5° | 0 | match | sure |
| crossings | 7,9 r from Ø 6.06 | r 7.9, centres 9.43 out, 1.53 from the centre | 0 | match | sure |
| hub | semicircle ≈Ø 1.8, no figure | bore 1.708 (last) / 1.808 | — | supports 1.8 (M5) | possible |
| material | Messingblech 1,6 Ms 63 federhart | brass, faced to 1.4 | — | match | sure |

## Jewels and endstones (no sheet; the coloured section): every version

| feature | source | model | verdict | sure |
|---|---|---|---|---|
| pivot in the hole jewels | Ø 0.24 "einpassen" | holes Ø 0.26 (0.01 radial), the crown 0.25 long | holds | estimate |
| endshake | the 1958 book 0.05-0.07 | 0.030 + 0.030 = 0.060 (last −21.01/1.83 against −20.98/1.80; first −21.03/1.99 against −21.00/1.96) | match | likely |
| upper settings | top plate seat 26: Ø 5.2 H7, lip 4.59 H7 | hole jewel's setting r 2.600 flush with the inner face; endstone's spigot r 2.295 flush outside; WN-es ×2 M1.2 held 31/37 by the plate | holds | sure |
| lower | pillar plate's 26 (2.50) | bush r 1.250 (held 6/6); endstone's setting Ø 4.6 in a 0.25 seat; window Ø 1.9 (HOLE_EXPECTED); WN-ec held 22/30 | holds | likely |
| stones | Ø 2.9 (section), lower Ø 1.6 (the 2.50 bore) | as stated in the code | as recorded | likely |

---

## Step 5, overlay

| page (v3.41.00) | sheet | result |
|---|---|---|
| 173 block | 05-04_03 main view (17.1 px/mm) | `ov\blk_main.png` (turned 270°, scale 1.00, book unmatched 14 %, sheet 52 %; most of the sheet's unmatched pixels are text and dimension lines). Base, upright, step, cove, 0,4, both pins, Ø 1,3 and M1,7 coincide. Unpartnered: the sheet's two slit lines along the upright, where the book draws the slit's hidden edges across it (the photographs' slit: M9). The sheet's dashed M1 from the end face to the Ø 1,3 has no book line in plan (the book has it in its left view). |
| 163 detent | 1436 right view (17.3 px/mm) | `ov\det_right.png` (mirrored, turned 89°, scale 1.00, book unmatched 21 %). Foot, three holes, spring, square, blade flush on the "oben" edge and the horn coincide. Unpartnered: **the pipe.** The sheet's band runs from the blade's "unten" edge to 1.0 past its "oben" edge. The book's runs about 0.25 past the "unten" edge and 0.75 past the "oben" edge (M1; the book is v3.41, before 798009c4, but the current solid has the same shape). The book has no section figures (M13). |
| 158 arbor | 05-04_07-2 (17.7 px/mm) | `ov\arbor.png` (mirrored, scale 0.98, book unmatched 39 %). The ends, pinion and shoulders line up. Unpartnered: the wheel and collet (other pages), and the arbor's width: the book's Ø 1.19 against the sheet's drawn 1.0-1.1 (M15). |
| 154 wheel | 05-04_23 (25:1) | not overlaid (different scale, one tooth). The book's 13.92/13.93 across the tips is the odd-count chord of Ø 14. Its contour table gives the floor arcs r 5.85 and the back arcs r 3.00, as the model. |
| 160 collet | 07-2 | by figures: Ø 1.70, 2.79, bore 1.20, length 5.40 (with the spigot 0.70): as the model. No H7/h6 (M13). |
| 167 gold spring, 170 foot screw and pins, 176 block screws | 05-04_02; no sheets | by the pages' tables. The gold spring is drawn as the solid's bow (15.15 between its ends). The pins and screws are as the solids. |
| renders | — | `iso\r_iso_detent_detentBlock_escapeWheel.png`, `iso\r_iso_detent_detentBlock.png` (first), `iso\last\…`, `iso\first\…`: along the detent's thickness the pipe stands 0.45 above the blade and 0.55 below it, the stone up from it to the teeth, the domed banking head beside the pipe's bottom. As first drawn the arm's near face lies under the pipe's footprint (M2). |

---

## Step 6, fit list

Seatcheck's rows are from `b2m\seat.txt` ("held a/b": steps held by the named part out of the piece's length).

| J | piece | into / onto | seat (sheet) | held by (sheet) | on the solid | verdict |
|---|---|---|---|---|---|---|
| J1 | block | top plate's underside | the M1.7 tapped 7,3 +0,04 (05 04 01-4) | WN-gk from the plate's outer face through hole 13 | WN-gk held 25/88 by the block (tapped, `th rs 0.85`, 3.0 in); the plate's hole a clearance | holds |
| J2 | block's steady pins WN-201.gk ×2 | block and plate | Ø 0,9 at (2,3; +2), (12,3; −2) | press | held 43/43 and 78/78 by the plate and block (last, 1943); first and 3955 78/78; 6MX at Kirov 247's places 25/25, 43/43 | holds |
| J3 | detent foot | block's end face | M1 2,3 ±0,02 from the plate face into the Ø 1,3 | one screw WN-gf (05 04_1 side-on) | last and 1943: shank Ø 1.0 in the Ø 0.729 bore (thread as embed), held 22/38; 6MX: plain Ø 1.0 bore, 28/38; **first and 3955: no hole, the shank in solid brass** (S-2) | holds (last, 1943, 6MX); **M6** (first, 3955) |
| J4 | foot pins WN-205.d ×2 | foot and block | 1436's two pins; **no holes on 05 04 01-4** | press | last, 1943, 6MX: Ø 0.45 in Ø 0.45 holes 1.6 deep, held 22/32 by the block and foot (book: least gap −0.0047); **first and 3955: in solid metal** (S-2) | holds as an estimate (M8); **M6** |
| J5 | gold spring | the square's face (Viereckfläche, 10-2) | Ø 0,7 +0,05, 1,2 from its end | WN-14 | the hole Ø 0.700 on the shank Ø 0.66 (0.02 radial). WN-14 held 6/10 by the square and gold spring. The root's contact with the square is an EXPECTED contact (3.46.02) | holds |
| J6 | WN-14 | square | **no hole drawn** (1436) | thread (M0.7 estimated) | plain Ø 0.70 bore 0.42 deep, plain Ø 0.66 shank 0.40 in (0.02 short of the bottom); bom `tap` dev "0.39 of 0.4" | holds by fit; thread not drawn (M8, M14) |
| J7 | gold spring's tip | horn | rests on it (05 04_1) | its own spring | 0.005 off (GNB) | holds |
| J8 | locking stone | pipe | Ø 0,75 in the Röhrchen | set (not given) | Ø 0.750 in a 0.754 bore over the pipe's length; the half-round below up to 0.06 over the teeth | holds (bom: no relation, M14) |
| J9 | wheel | collet's spigot | "1,8ø H7/h6" (table 1,7: +0,009/0, 0/−0,007); "Rad von uns aufgesetzt" | press or staked | last: 1.708 on 1.700 (0.004 radial, inside the table's 0-0.016); first: 1.808 on 1.800 | holds as a fit; the size is M5 |
| J10 | collet | arbor | 07-1: Kegel 1:70; 07-2 not given | press | bore r 0.6015 on r 0.600 (0.0015) | holds as the model's convention |
| J11 | upper pivot | hole jewel 050406-1.eu | Ø 0.24 (estimated above) | the settings | in Ø 0.26, 0.03 off the endstone | holds (estimate) |
| J12 | lower pivot | 050406-1.el | Ø 0,24 framed "einpassen" | the bush | in Ø 0.26, 0.03 off the endstone | holds |
| J13 | upper settings | top plate 26 | Ø 5.2 H7 / 4.59 H7 | WN-es ×2 M1.2 | r 2.600 / 2.295; WN-es 31/37 | holds |
| J14 | lower bush and endstone setting | pillar plate 26 | 2.50; seat 0.25 | press; WN-ec ×2 | bush 6/6; WN-ec 22/30 | holds |
| J15 | banking screw (last, 1943) WN-gkA43 | the upright's slit end | M1,2 at 18,8 ±0,03 | the slit's grip | held 11/97 (its threaded leaves); the slit parallel to the plate | holds; its slit's direction is M9 |
| J16 | banking screw (first, 3955) cone41 | the arm's slit end | 05 04_1 | the slit's grip | held 28/83 (first), 34/89 (3955) | holds |
| J17 | 6MX banking screw WN-gkA | upright | photographs | thread | **no hole** (S-3) | **M7** |
| J18 | 6MX foot stop screw 6MX.gke | base's free side | photographs | thread | **no hole** (S-4) | **M7** |
| J19 | 6MX stud WN-gk | the slide and block | photographs | thread | held 41/114 by the slide and block | holds |
| J20 | pipe's side | banking screw's head | 05 04_1, the 1954 instruction | the detent's preload | last: the pipe (d to 3.80) laps the head (d 3.45-6.85) by 0.35 at its edge; the sheets' pipe (to 4.25) would lap it by 0.8 | holds; better with M1 |

---

## Extra checks

### (a) Slots, notches and grooves

| described | against every view | verdict |
|---|---|---|
| the 1943 block's slit (05 04 01-4) | Main view: two lines 0.3 apart along the upright, 7 from its end, so the slit's plane contains the depth and its width runs along the M1,2's axis. Right view: its floor dashed. Lower view: not drawn (finding 6: the lower view leaves it out) | built parallel to the plate from the photographs (README Unresolved): **M9** |
| the 1941 arm's slit (05 04_1 elevation) | 6.1 long, 0.2, on the screw's axis; 3955's 5.1/0.14 (photographs) | built so: right |
| the 6MX upright's slit | none on the loose 6MX block (photograph) | built without: right (S-3's hole is M7) |
| the wheel's recess | 07-2 dashed on the plate side; 07-1 on the pinion side | built on the plate side (recorded) |
| the screws' slots (WN-14, banking heads, gke) | photographs | built: right |
| the detent | no slot on 1436; "Anschrägen" at the tip | M11 |

### (b) Drawn holes

Every hole the reading lists is in the model:
- the block's M1,7, Ø 1,3 tief 3, M1, two Ø 0,9 and M1,2;
- the gold spring's Ø 0,7;
- the foot's three;
- the wheel's bore;
- the pipe's bore;
- the jewels' and settings' seats.

Three holes the parts need are drawn on no sheet:
- the end face's two pin holes (M8);
- the square's hole for WN-14 (M8);
- the first-drawn block's M1 and pin holes, which 05 04_1 draws side-on into the block (M6).

The 6MX's two screws have no holes (M7).

### (c) Excuses

| entry | re-judged |
|---|---|
| SEAT_EXPECTED detent WN-205.d "OPEN" (first, 3955) | confirmed: no hole in the 1941 block's end face (sections at 0.3-2.5 into it find none). 05 04_1 draws the pins into it, and the GUB's old detent carries them. Remove by cutting (M6) |
| SEAT_EXPECTED detent WN-gf "OPEN" (first, 3955) | the same (M6) |
| SEAT_EXPECTED detentBlock WN-gkA "OPEN" (6mx) | confirmed (M7) |
| SEAT_EXPECTED detentBlock 6MX.gke "OPEN" (6mx) | confirmed (M7) |
| EXPECTED ('detent:Buffer','detent:Buffer') the gold spring's root on the square's face | holds (a contact by design) |
| EXPECTED ('detent:Buffer','detentBlock:Buffer') "a block of vertical walls drawn without holes across … (05 04 01-4, 1436)" | true now only as first drawn and in 3955. 05 04 01-4 draws no pin holes. After M6 the entry should go or shrink to the thread's embed |
| EXPECTED ('detentBlock:Buffer','detentBlock:Buffer') 6MX screws without holes | holds until M7 |
| HOLE_EXPECTED escEndstoneLow window Ø 1.9 | holds (Wempe 3955's dial side) |
| bom.json WN-14 dev (engages 0.39 of 0.42) | holds: the square is 0.50 thick. Its `tap` names a plain bore (M14) |
| bom.json WN-205.d dev (rev first: the block not bored) | the excuse M6 removes |
| bom.json WN-gf `in 050401-4 embed` | holds as last revised and 1943 (thread drawn as the shank in a minor-diameter bore) |
| bom.json WN-gkA, 6MX.gke `embed` | the holes are missing (M7) |
| bom.json 050401-3 (stone) `rel: []` | relation missing (M14) |
| escapement.js 813-815 "two steady pins' holes Ø 0.45 1.6 deep (05 04 01-4 …)" | wrong attribution (M8) |
| escapement.js 721 "the square, tapped 0.42 deep … (M0.7 …)" | a plain bore (M8, M14) |
| escapement.js 794-795 "The 0.4 step at the base's top and the 90 +0.5 deg end are left out" | stale: the 0.4 is built (M12) |
| escapement.js 52-53, README 769 "the stone lands 18.77 from the screw's row (18.73 centred)" | measured 18.738 (ACR 7.492, LS 20.180) (M12) |
| README 626 "1436's right view draws the pipe extending on the side away from the foot's wider part; it is drawn on the same side here" | only half: it extends both ways (M1) |
| README 105 "1.4 thick at the teeth and 0.8 in the web"; checks.py DFM 050405-1 "0.6 deep" | stale: 0.7 (M12) |
| README 107 the gold spring "about 15 here" | 15.31 (M12) |
| README 105 "pivots Ø 0.24 × 0.5 (sure)" | the upper's Ø is on neither sheet (M12) |

### (d) The reading's findings and the plan's questions settled against the model

1. **The end face's pin holes** (finding 2; the plan's item 1): the reader is right, and so is S-2's premise.
   - 05 04 01-4's right view draws only the M1 in the end face, and its main view only the Ø 1,3, M1,7 and two Ø 0,9.
   - The model's Ø 0.45 holes at ±2.1, 1.6 deep (as last revised, 1943 and the 6MX), are needed for 1436's pins, which stand out on both sides of the foot. The GUB's old foot has them too. But they are an estimate: scaled pins, drilled through the foot at assembly.
   - The code credits them to 05 04 01-4 (M8). In the first-drawn and 3955 block they are missing altogether (M6).
2. **The blade's edge and the pipe** (finding 3; the plan's item 2):
   - **The 3.41.00 decision holds.** 10-2's "linke Seite" is the left view's flush side, where the horn bends to, and the model puts both toward the block. That is the thickness direction, in plan.
   - The reader's question is about the other direction, the width (heights in the movement). There 1436 draws the blade flush with the "oben" edge and the pipe from the blade's "unten" edge out 2 (1,9) past the "oben" side.
   - **"oben" is the dial side.**
     - 05 04_1's elevation draws the detent from 1.3 under the plate with the blade flush with its lower edge, 2.26-3.30 (sure), and the pipe dashed from the blade's top, 2.24, down 2.0 to 4.23, beside the arm.
     - The other reading cannot be built. With the foot at 1.3-3.3, as 05 04_1's "1,3" and 05 04 01-4's 2,3 ±0,02 put it, a pipe on the plate side would stand at 0.35-2.25. That is in the teeth's band (0.4-1.8), and the pipe's wall reaches r 6.57, inside the tips' 7.0.
     - The GUB's remade detent (Ldzmn4kuKMA 2:46) has the pipe standing out past its flush edge, on the blade's side, as 1436 draws it.
     - The movement in its bowl lies dial up, which fits "oben" for the dial side.
   - So the reader's correction (the blade along the plate side) is **refuted (sure)**.
   - But the model's pipe is not where 1436 and 05 04_1 put it. It starts 0.45 (last) and 0.35 (first, 1943, 6MX) above the blade's top edge, and it reaches only 0.55 (0.4) past the lower edge instead of 1.0. In three versions it is 1.7 long, not 2 (1,9) (M1).
3. **The fit 1,8 against 1,7** (finding 1; item 3): likely 1.8 (M5).
   - The callout reads 1,8.
   - 07-2 draws the spigot 1.9-2.05 wide, wider than the collet's pipe (1.66, the model's 1.7).
   - 05 04_1's centre hole is 1,8, and 02 04 08 a's hub scales about 1.8.
   - The table's 1,7 carries ISO H7/h6 limits, which are the same for 1.7 and 1.8, so its figure decides nothing.
4. **The gold spring's screw with no hole** (finding 4; item 4): no sheet draws the hole, so the model's hole is an estimate. It is a plain Ø 0.70 bore 0.42 deep with a plain Ø 0.66 shank (M8, M14). 05 04_1 draws the screw. The coloured section names WN-14. The GUB's remade detent has a hole in its square.
5. **The block's split upright clamping nothing** (finding 5; item 5):
   - It clamps the M1,2, the banking screw: the 1954 instruction's п. 11 and the 6MX book (README). 05 04_1's arm does the same with its slit along the screw. Settled as the model has it.
   - The direction differs: 05 04 01-4's slit plane is across the plate, cutting the screw's thread across its axis (a split-thread lock). The model's is parallel to the plate, from photographs of other clocks (M9, as last revised).
6. **05-04_07-1's D = 15,0 against 14**: a slip, as recorded. The model is right (05 04_1's 14,00; 02 04 08 a's 14 +0,03; 07-1's own drawing scales 14.1).
7. **The pinion's 3,13**: 08's blank, turned before the leaves are cut. The model is right (2.97).
8. **Surface signs**: ▽▽▽ on 05 04 01-4 and 07-2, and (▽▽▽▽) ▽▽▽ on 08, as the reader re-read them. The transcription misreads them (∇∇; (∇∇∇) ∇∇). makers.js and the book carry none for these parts (M13). The gold spring's ∇∇∇ is carried.
9. **The 1940 layout's figures against the 1943 parts**: the table under 05-04_01.
   - 10,00, 14,00, 0,75, 7,6, 1,3, 2,3, 0,5, 1,4, 2,8, 6,5 and the arm's 1,4 hold in every version.
   - 23,8 and 25,68 follow the plate's hole 13: −0.39 and +0.09 (batch 9; recorded).
   - 18,8: the stone is 18.738 from the row, and the 1943 block's M1,2 exactly 18.8.
   - The two bending points: M3 and M4.
   - The gold spring's head: M10.
   - The arm's plan: M2 (first only).
10. Findings 7, 12 and 13 (lengths, the upper pivot, the hole's place across): the model scales them; recorded. The upper pivot's "sure" is M12.
11. Finding 8 (4,4 against 5,4): explained above under 1436 (horn's length). The model is right.
12. Finding 9 ("0,18 u.d.f."): unread by everyone; no model feature depends on it.
13. Findings 14 and 15 (0,0? and 0,04): the thicknesses at 05 04_1's two bending points (likely). Their markers are M3 and M4.
14. Finding 16 (the pointed figure): the 1941 banking screw's tail. Sure: Wempe 3955's photographs, 10_ and 11_, show the brass cone through the arm.
15. Finding 17 (view B): the arm in the same elevation, not a separate view. Its 2,8, 6,5 and 1,4, and the banking head end-on at 5.1, are all built so.
16. Findings 10-11 and 18-25: as the reader's Step 3 settled them. The tooth form's 25° is the code's traced figure.

---

## Findings

Fifteen findings in all:

- **Dimension or place:** M1, M3, M4, M5, M10, M15.
- **Version:** M2, M9.
- **Joint:** M6, M7.
- **Estimate mis-credited:** M8.
- **Feature, possible:** M11.
- **Text:** M12.
- **Build book and makers:** M13.
- **bom.json:** M14.

**Physics.**
- **M3** (the gold spring's bending point) changes the escapement's figures: the gold spring's free length, so its stiffness and the lock's window. It needs the whole Wempe chain:
  - makeEsc's adapter (the gold spring's bending point, `Gb`, in `toKin`/`adapt`) and `wempe_tripping.js`'s gold spring path (`WESC.GOLD`);
  - then `wempe_escapement.js`, `dynamics.js` and `tripping.js --model wempe`, and `wempe_detent_study.js`;
  - `wempe_banking.js --write`;
  - `wempe_build.js --write`, then `wempe_tolerances.js`, `wempe_bench.js` and `wempe_montecarlo.js --write` under each `MC_WREV`;
  - `wempe_transmission.js` (and its trace), `wempe_navigation.js --write`, `wempe_1943.js` and `wempe_6mx.js`;
  - `wempe_essaydata.js --write`, and the Wempe report (`reportdata.js`, `build_report.py`).
  - `escgolden.js` must stay unchanged (the Hamilton's).
- **M1** lengthens the stone (and the pipe in three versions), which raises the detent's inertia about its flexure (estimate: +0.07 g·mm² as last revised, +0.8 % of ID 8.23; about +0.21, +2.6 %, for the 1943 version and the 6MX).
  - It moves `WESC.PIPE0`, which `wempe_tripping.js` reads (STONE_LO).
  - It needs `wempe_inertia.py --write` and the `--rev 6mx` and `--rev 1943` tables (ci.py checks only the plain one), then `WESC.SET.ID`, `SET6.ID` and the 1943 set, and the chain above.
  - `fine.py` for the pipe's contact on the banking head.
- **M4**, if adopted, moves the detent's flexure (DPIV, makeEsc's DA and DRAW, ID about the flexure): the chain above.
- **M2** changes only the first-drawn version's geometry (its physics only if `wempe_inertia.py --rev first` is kept).
- The rest change no physics: M5 (a few µg of brass), M6-M15.
- Every geometry finding needs `solids.py`, `fine.py`, `holecheck.py`, `audit.py`, `exploded.py`, `assembly.py`, `seatcheck.py`, `bom.py` and `contacts.py --write` (if EXPECTED changes), all with `--model wempe`.

**M1. Dimension (place along its axis), sure on the sheets, likely in the movement: 1436 (05-04_10-1, 10-2) and 05-04_01's elevation, the detent's pipe (Röhrchen) and stone (every version).**
- The sheets:
  - 1436's right view draws the pipe's band from the blade's "unten" edge 2 (1,9) toward "oben", standing 1.0 past the blade's "oben" edge. The blade's "oben" edge is flush with the foot's and spring's "oben" edge.
  - 05 04_1's elevation (sure) puts the blade on the detent's lower (dial-side) edge, 2.26-3.30 under the plate, and dashes the pipe from 2.24 to 4.23 (2.0, the unbracketed figure), the stone from 0.34 down to its bottom.
  - "oben" is therefore the dial side, and the pipe runs from the blade's top edge down past the detent's lower edge.
- The model:
  - As last revised: pipe d 1.90-3.80 (PIPE0 = 0.1 under the teeth), the blade 2.35-3.25. The pipe stands 0.45 above the blade's top and 0.55 below its lower edge.
  - As first drawn, 1943, the 6MX and 3955: d 1.95-3.65, 1.7 long, against 2 (first) and 1,9 (1943, the 6MX).
  - README 626 claims the pipe extends on 1436's side; only half of it does.
- How sure: sure that the sheets draw it so. Likely for the movement: the GUB's remade detent stands its pipe out past the flush edge as 1436 does (Ldzmn4kuKMA 2:46). Wempe 3955's photographs don't show the pipe's ends.
- Correction:
  - Pipe from the blade's top edge, 1.9 long: d 2.35-4.25 as last revised, 1943 and the 6MX; 2.0 long, d 2.30-4.30, as first drawn.
  - The stone's full round inside it, and its half-round from the pipe's top up to 0.06 over the teeth, as now. PIPE0 becomes the blade's top.
  - As first drawn this needs M2's arm, set back 1.07, since the photographed arm (near face n −0.215) lies under the pipe's footprint below 3.7. Wempe 3955 keeps the short pipe its photographed arm forces (record it in README As photographed).
  - Check the pipe's side against the banking heads (it laps WN-gkA43's by 0.8 instead of 0.35) and against the 1943 upright (1.0 clear in plan).
- Physics: the detent's inertia and PIPE0 (above).

**M2. Version, sure: 05-04_01's plan, the first-drawn block's arm (as first drawn only).**
- The sheet: the arm is 2.5 wide (61.7 px at 24.4 px/mm), its near face 1.07 behind the stone's line (`s01_arm.png`). The code reads the same ("05 04_1 sets it back 1.06 and draws it 2.5 wide").
- The model: as first drawn takes Wempe 3955's photographed arm, 3.56 wide and flush with the base's edge, its near face n −0.215, which cuts the pipe short at 3.65.
- How sure: sure.
- Correction: in the 'first' state, the arm 2.5 wide, its near face 1.07 off the stone's line (n −1.07), its far face where it is (n −3.56); the slit and banking screw as now (the head on the wheel's side of the pipe). 3955 keeps the photographs' arm.
- Physics: none for the drawings' later versions; the first-drawn inertia table only if kept.

**M3. Dimension, likely: 05-04_01's plan, the gold spring's bending point (every version: GB is shared).**
- The sheet: "Biegungspunkt der Goldfeder" is marked by a dashed line across the strip at x 457.2 (5 px dark over 481-495; `s01_gb2.png`), with a small "0,0?" figure beside it. That is 6.22 from the stone's centre (24.38 px/mm by the 18,8; the stone's ring centroid at x 305.4). The detent spring's marker on the same plan is drawn the same way (M4).
- The model: GB = [6.7, …], "scaled" on 05 04_1. 6.7 falls on the "0,0?" figure's glyphs (x 468-471), not on the dashed line.
- How sure: likely (±0.1 from the scan). The model's bend also lies on the blade's thicker part's face (5.48-8.38), where the strip still rests, so the sheet's 6.22 is physically possible.
- Correction: re-measure on the sheet first (the plan's physics rule), then GB[0] 6.2 (the free bow pinned there; GBZ's line taken off from it, `goldPath`).
- Physics: the free length from the bend to the tip goes from 11.24 to 10.77 (straight), the strip about 14 % stiffer. That changes the lock's window and the release (tools above).

**M4. Dimension, possible: 05-04_01's plan, the detent spring's bending point (every version).**
- The sheet: "Biegungspunkt der Gangfeder" is marked by a dashed line at x 612.5, 12.60 from the stone, with "0,04" beside it. On that plan the spring runs from the gold spring's head end (10.77) to the foot's face (15.37).
- The model: TP 12.884, the middle of the 5.0 spring 1436 scales (10.384-15.384).
- How sure: possible. The marker may be a layout's indication, not the flexure's effective place; 1436 marks none.
- Correction: the owner's choice. Either keep TP at the spring's middle and record 05 04_1's 12.60 in README Estimated, or move the flexure 0.28 toward the square.
- Physics: if moved, the detent's pivot (DPIV), makeEsc's DA, DRAW and ID (the chain above).

**M5. Dimension, likely: 05-04_07-2, the escape wheel's bore and the collet's spigot (as last revised).**
- The sheet: the callout reads "1,8ø H7/h6". The spigot is drawn 1.91-2.05 wide between the callout's extension lines, wider than the collet's pipe (1.66). The table reads 1,7, but its H7 (+0,009) and h6 (−0,007) are the same for 1.7 and 1.8. 05 04_1's centre hole is 1,8, and 02 04 08 a's hub scales about 1.8.
- The model: bore Ø 1.708 on a spigot Ø 1.700, the pipe Ø 1.70 (the table's 1.7).
- How sure: likely.
- Correction: bore 1.8 H7 (1.800-1.809, built 1.808), spigot 1.8 h6 (1.793-1.800); the collet's pipe stays 1.7. Record the table's 1,7 in README Readings corrected.
- Physics: negligible.

**M6. Joint, sure: 05-04_01's plan (and 1436), the first-drawn block's end face (as first drawn and Wempe 3955; S-2).**
- The sheets: 05 04_1 draws the foot's two pins and its screw side-on into the block, the screw's point in the cross hole. 1436 draws the pins through the foot. The GUB's old detent has them (Ldzmn4kuKMA 3:05.5).
- The model: the 1941 block's end face (n −0.215) has neither the M1 nor the pin holes. Sections 0.3-2.5 into it find no hole, and seatcheck finds WN-gf and both WN-205.d in solid brass. This is excused by SEAT_EXPECTED (OPEN), bom's WN-205.d dev (rev first) and EXPECTED ('detent:Buffer','detentBlock:Buffer').
- How sure: sure.
- Correction:
  - Bore the first-drawn block's end face as the 1943 block's (`endH`): the M1 at the minor diameter (0.729) along t on the row into the existing Ø 1.3, and the pins' holes Ø 0.45, 1.6 deep, at ±2.1, at d 2.3 (the foot's middle as first drawn, d0 1.3 + 1).
  - Then delete the two SEAT_EXPECTED entries and the WN-205.d dev, and reword or remove the EXPECTED entry.
- Physics: none.

**M7. Joint, sure: the 6MX's block (photographs; S-3, S-4).**
- The model: the banking screw WN-gkA runs through the slitless upright with no hole, and the foot's stop screw 6MX.gke (M1.4, 2.5 into the base's free side) has no tapped hole. Both are `embed` in bom.json and EXPECTED ('detentBlock:Buffer','detentBlock:Buffer').
- How sure: sure.
- Correction: tap the upright M1.2 on the screw's axis (r 0.62 round its 0.6 shank, as the 1943 upright's), and tap the base's free side M1.4 2.5 deep (`blindHoles`/`nBore`). Then delete both SEAT_EXPECTED entries and the EXPECTED entry, and make the relations `tap`.
- Physics: none.

**M8. Estimate credited to a sheet, sure: 05 04 01-4 and 1436, the end face's pin holes and the square's hole (every version but first and 3955).**
- The sheets: 05 04 01-4 draws no pin holes in the end face, and 1436 draws no hole in the square.
- The model: escapement.js 813-815 says "its two steady pins' holes Ø 0.45 1.6 deep (05 04 01-4 …)". EXPECTED cites "(05 04 01-4, 1436)". Line 721 calls the square's Ø 0.70 × 0.42 bore "tapped … M0.7".
- How sure: sure.
- Correction: keep both holes (they are needed). Re-credit them as estimates (the pins' holes from 1436's pins and the GUB's foot, drilled at assembly; the square's hole for WN-14, which 05 04_1 draws and the GUB's remade detent shows), and list them in README Estimated. Either thread WN-14 and its hole (KIT `threadGeo`, `threadWall`, `matchThreads`) or call the bore plain.
- Physics: none.

**M9. Version, sure that they differ: 05 04 01-4, the upright's slit (as last revised; the 1943 version keeps the photographs).**
- The sheet: the main view draws the slit as two lines 0.3 apart along the upright, 7 deep, and its floor is dashed across the right view. Its plane lies across the plate, cutting the M1,2's thread across its axis.
- The model: the slit is parallel to the plate, gripping the thread from above and below (the photographs of Kirow DEC 422 and 479 and Lange 5177, README Unresolved). It is one mesh for 'last' and '1943'.
- How sure: sure that they differ; the owner's choice for the drawings' version.
- Correction: as last revised, cut the slit as drawn (across the plate, 0.3 × 7, the M1,2 through both leaves); keep the photographs' slit in 1943. This needs the two versions' upright split into two meshes.
- Physics: none.

**M10. Place, possible: 05-04_01's plan, the gold spring's head and screw (as first drawn; the later versions have no sheet for it).**
- The sheet: the head is drawn 8.40-10.77 from the stone, its near end at the square's start, and the screw at 9.57 (1.2 from the head's far end).
- The model: the head is centred on the square, 8.18-10.58, with the screw at 9.38. That is 0.19 nearer the stone, and the head overhangs 0.2 at each end.
- How sure: possible (±0.1 from the scan).
- Correction: as first drawn, the head from the square's start (SQ0) to SQ0 + 2.4, the screw at SQ0 + 1.2. Or record the difference as within the layout's precision.
- Physics: none (GB is unchanged).

**M11. Feature, possible: 1436's tip (Spitze) (every version).**
- The sheet: the right view draws the tip flush with the "oben" edge, and a line across it 0.75 from its end. "Anschrägen" is written at the left view's bend.
- The model: the horn is centred on the blade's width (0.075 off the flush edge), its end square. The code reads "Anschrägen" as the bend toward the block.
- How sure: possible.
- Correction: the horn flush with the blade's lower edge (d 2.50-3.25 as last revised). The 0.75 line, if read as a bevel of the end, is the owner's choice; otherwise record it in README Estimated.
- Physics: none, unless the bevel is on the face the gold spring's tip rests on (then `wempe_tripping.js`'s horn).

**M12. Text, sure (every version).**
- escapement.js:
  - 52-53 and README 769: "the stone lands 18.77 along from the screw's row (18.73 with the blade centred)". The solid gives 18.738 (LS 20.180, ACR 7.492).
  - 794-795: "The 0.4 step at the base's top and the 90 +0.5 deg end are left out" (the 0.4 is the cove's built end).
- README:
  - 105: "1.4 thick at the teeth and 0.8 in the web" (0.7), and "pivots Ø 0.24 × 0.5 (sure)", where the upper's Ø is on neither sheet.
  - 107: the gold spring "about 15 here" (15.31).
  - 626: the pipe "drawn on the same side here" (M1).
- checks.py DFM note on 050405-1: "0.6 deep" (0.7 since 26 October 2026). EXPECTED ('detent:Buffer','detentBlock:Buffer'): "a block of vertical walls drawn without holes across" (true as first drawn and in 3955 only; M6).
- How sure: sure.
- Correction: the lines only.
- Physics: no.

**M13. Build book and makers.js (v3.41.00; redrawn at the release).**
- p. 163, the detent: only 26.40 and 1.25. None of 1436's sizes is given: the spring's 0.07 and 0.09, the blade, the square, the foot, the pipe's Ø and place, the horn.
- p. 154 and 160, the wheel and collet: the bore is "Ø 1.71" with no H7/h6 and without "Rad von uns aufgesetzt".
- p. 158, the arbor: "Ø 1.19" (M15).
- p. 173, the block: the slit is drawn as the photographs' (M9).
- Surface signs: ▽▽▽ (05 04 01-4, 05 04 05-1) and (▽▽▽▽) ▽▽▽ (05 04 05-2) appear as "none on the drawing". makers.js reads the transcription's misread signs.
- makers.js's `msrc` for 05 04 05-1 cites `Wempe_05-04_23.jpg`, which is 02 04 08 a. 05 04_7.2 is 05 04 05-1's own sheet.
- The book predates 798009c4 (the detent's heights).
- Correction: correct the transcription's surface signs (Step 3 rows 10 and 18) and rerun `wempe_makers.py`. Redraw the book at the release with each detent figure, fit and surface sign.
- Physics: no.

**M14. bom.json (every version).**
- No relation: the locking stone 050401-3 in the pipe (`in 050401-1 press`), the jewels' stones in their settings (as batch 1's M13).
- WN-14 is `tap` into a plain bore (M8).
- WN-gkA and 6MX.gke are `embed` (M7). WN-205.d's dev is M6's.
- 050405-1 is `round 050405-3 press`. The sheet's H7/h6 is a transition fit (0 to 0.016), which the model's 0.008 meets. Write it as the fit the sheet names, or say so.
- How sure: sure.
- Correction: as listed.
- Physics: no.

**M15. Dimension, possible: 05-04_07-2, the arbor between the wheel and the pinion (as last revised).**
- The sheet: 07-2 draws the arbor 0.99 wide inside the collet and about 1.09 above it. 07-1's "1,2ø" is the neck under the pinion.
- The model: Ø 1.20 from the web to the pinion (the book's Ø 1.19).
- How sure: possible (5:1 scan, ±0.06).
- Correction: the owner's choice. Ø 1.1 from the collet to the neck, or record it as scaled.
- Physics: negligible (the escape arbor's inertia).
