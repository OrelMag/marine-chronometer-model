# The Soviet 6MX re-audited blind: Beta's parts (7 November 2026)

Session Alpha directs. Beta measures the frame, escapement, barrel and cocks of the 6MX version against Kirov No. 247's photographs. Each feature was read
on the photograph first, and the model's figure was looked up only after the reading was written down (see "How blind" at the end).

## Method

- **Plan view, `2_Kirow_247_A.jpg`** (1024 × 1015, about 8.8 px/mm). Its camera was fitted with `tools/m6cam.py` on features no 6MX reading moves:
  - the top plate's rim (drawn r 42.494, 55 edge points over 260°);
  - the WN-57 pillar screws at holes 49 and 11;
  - the barrel bridge's two WN-55 screws.

  Each round edge's points were held to its circle on its own plane, never to an ellipse's centre.
- **Fit quality.** The camera's distance is loosely determined. The free fit (303 mm) has rms 0.5-1.1 px, and holding it at 250 or 500 mm costs little. Every reading was
  taken through all three cameras, and the spread between them is quoted. Checks not used in the fit came back within 0.03-0.29 mm:
  - the upper cock's screw at hole 8: (−0.41, −19.71) against the drawn (−0.559, −19.765);
  - the WN-57 heads at 49 and 11, read again: (6.44, −36.73) and (−36.96, 3.24) against (6.425, −36.437) and (−36.858, 3.225);
  - the escape arbor's endstone setting: (−11.88, 21.98) against the drawn arbor (−11.78, 21.74).

  **The plan's absolute accuracy is ±0.3 mm near the rim (r 35-42) and ±0.15 mm inside r 25.**
- **Readings.** Each feature was read at its own height by `tools/m6meas.py`: the photograph flattened at 12 px/mm round it, and either mfgfit.py's `locate_circle`
  (holes) or a rim search in a ±12-30 % band (screw heads, chatons) followed by a RANSAC circle in mm.
- **Dial side, `3_Kirow_247_uZ.jpg`.** Calibrated on the centre, up-and-down, change wheel, fusee, intermediate and seconds arbors, hole 45's screw and pillar 11's head. It is
  weaker: residuals 0.5-5 px, and the cameras spread 0.3-1.4 mm. It is used for presence and as a second witness only.
- Specs, cameras and every result are in `6mx-audit/work/`: `A247*.json`, `U247*.json`, `feat*.json`, `*.res.json`.

## Ledger

| part | photo | scale and its source | reading ± | model value | verdict | how sure |
|---|---|---|---|---|---|---|
| Pillar 39's screw (WN-57 head, top plate) | A247 and A1564 (Kirov 1564's plan, its own camera on the same features: rim rms 0.36 px, checks 0.09-0.12) | A cameras | **247: (6.69, 36.14) r 36.77; 1564: (6.73, 36.18) r 36.80**, both at 190.5° (N toward O), head Ø 6.36-6.39. On 247 it was read twice (edge locator and rim search: (6.73, 36.16) and (6.69, 36.14)) | WD.P39_6MX: 190°, **r 37.3** → (6.477, 36.733) | **mismatch in r, −0.5 mm**; angle matches | **sure** on two photographs. Hole 49's check reads r 37.29 on 247 and 37.03 on 1564 (drawn 37.00), so on 1564 the scale is right at that radius. r 37.3 was chosen to clear the drawn seconds wheel's tips (dims.js), not read; at r 36.8 the drawn Ø 8.1 pillar would stand into those tips, which the 6MX's seconds wheel must clear another way (Delta or Alpha to check the 6MX's seconds wheel) |
| Pillar 39's screw, dial side | uZ247 | uZ camera (weak) | (8.30, 36.26), r 37.2. The locator took a slot edge (Ø 3.67), so this is not a rim reading | r 37.3 | can't tell | uZ ±0.5-1 |
| Hole 3 (N 37) | A247 | A camera | open, (−0.01, −37.27) Ø 3.72-3.76 | H[3] (0, −37), Ø 3.5 (rH35), drilled in the 6MX top plate | match (place); Ø 3.7 against 3.5 is within 2 px | sure (present); Ø can't tell |
| Hole 3, dial side | uZ247 | uZ camera | open, (−0.16, −37.01) Ø 3.40 | (0, −37) | match | likely |
| Hole 12 | A247 | A camera | open with a brass rim, (−36.11, 9.65) Ø 3.71 | H[12] (−35.739, 9.576) | match (0.37, at the edge of ±0.3) | likely |
| Hole 12, dial side | uZ247 | uZ camera | open, (−36.43, 9.90) Ø 3.54 | same | match | likely |
| Hole 40 | A247 | A camera | a round feature Ø 3.53 at (26.10, 26.45), half under the barrel bridge's edge; a dark crescent on its left half | H[40] (26.163, 26.163) Ø 3.5 open | match (place) | likely. Whether it is open or filled flush can't be told at 9 px/mm (README: "filled flush with gilt") |
| Hole 40, dial side | uZ247 | uZ camera | a brass-ringed disc Ø 3.88 at (26.78, 26.63) | same | match (place) | uZ ±0.8 |
| Hole 53 (Stift f. Wendelfeder, (−15, 37)) | A247 | A camera | **none**: bare striped plate for several mm round the place | left out of the 6MX top plate | match | sure |
| Contact access hole at 219° | A247 | A camera | open, a slotted screw head deep in it: (23.85, 29.28) Ø 3.66 → r 37.77 at 219.2° | CONTACT6.access (23.6, 29.14) Ø 3.5 → r 37.5 at 219.0° | match (0.29) | likely |
| Contact access hole at 180° | A247 and A1564 | A cameras | 247: (−0.05, 38.77) Ø 3.64 (read twice: −0.09, 38.81); **1564: (−0.19, 38.66) Ø 3.54**, open to the pillar plate. → r 38.7 at 180.1-180.3° | (**−0.61**, 38.6) → 179.1° | **mismatch in x, 0.4-0.55 mm** | likely-sure: two photographs agree within 0.15. The plan's x near 12 and 6 checks to 0.01 (hole 3 at −0.006) |
| Small hole "S 20.6 O 30.2" (README: on no sheet, not built) / the block's near steady pin | A247 and A1564 | A cameras | 247: a brass pin end in a dark ring, rim Ø 1.36, at **(−30.17, 22.06)** (rim search), (−30.10, 22.20) from its centre picked at 12× zoom. 1564: an open hole Ø 1.11 at **(−30.22, 22.02)**. No other hole near (−30.2, 20.6) on either plate. (The first entry here, (−29.08, 22.49), was a mispick 7 px off the pin and is withdrawn) | HOLES.block6.pins[0] **(−30.0, 21.55)**, Ø 0.9 pin | **small mismatch, +0.33 in z.** Raw readings put it 0.5 off; held to a local similarity on holes 11 and 12 and the escape arbor (drawn), which read 0.3 radially out on both photographs, it is **(−29.92, 21.88) on 247 and (−30.05, 21.88) on 1564** | likely: two photographs agree to 0.13 after the same correction; ±0.15. The README's "S 20.6 O 30.2" is this pin hole read 1.4 mm off in z. Alpha's photocompare missed this pin by 1.29 mm, but its camera on the loose block was degenerate |
| The block's far steady pin | A247 and A1564 | A cameras | 247: brass pin end, rim Ø 1.34, at **(−37.04, 14.38)**; 1564: open hole Ø 1.14 at **(−37.04, 14.37)** | HOLES.block6.pins[1] (−36.7, 14.15) | raw 0.4 off; locally corrected (as the near pin) **(−36.77, 14.29) on 247, (−36.90, 14.30) on 1564**: match (0.15-0.25) | likely. **The pins stand 10.22 apart on both photographs after the correction (10.28 raw), against the model's 9.98: +0.24, likely.** The stud, corrected the same way, is (−34.05, 18.54) and (−34.28, 18.44) against (−34.3, 18.5): match |
| The detent block's fixing stud/screw (WN-gk) | A247 and A1564 | A cameras | 247: dark slotted head **(−34.32, 18.67)**, Ø 3.38; 1564: steel head (−34.44, 18.54), Ø 3.56; at y −24.6 | HOLES.block6.stud (−34.3, 18.5), head r 1.7 (Ø 3.4) | match (0.17, 0.14) | sure |
| Intermediate arbor's chaton (top plate) | A247 | A camera | centre (9.84, 15.68) / (9.77, 15.30); **outer ring Ø 4.41**, oil sink Ø 3.42 | at H[38]; chaton fills rJ Ø 4.596; sink rs 1.7 (Ø 3.4) | sink matches. Outer Ø 4.41 against 4.60: can't tell (2 px) | place sure; Ø ±0.2 |
| Seconds arbor's upper chaton | A247 | A camera | centre (−0.07, 23.18); **outer ring Ø 4.83**, oil sink Ø 3.63 | at H[35]; rJ Ø 4.596, sink Ø 3.4 | can't tell. It reads 0.2 large, the intermediate's 0.2 small, so the two chatons differ by 0.4 on one photograph | open. Worth a second photograph (Kirov 1564's top plate) |
| Intermediate's lower chaton / jewel (intermediate bridge, dial side) | uZ247 | uZ camera | used as a calibration point; the jewel is centred on the arbor within 0.4 px | SM6.rb 2.15 | not sized (uZ too coarse) | — |
| Escape arbor's place | A247, uZ247 | both | upper endstone setting (−11.88, 21.98) Ø 5.17 at y −22.65; lower jewel setting (−11.72, 21.71) | drawn (−11.78, 21.74) | match | likely |
| Upper cock: no hole 20 ((−6.51, 2.45)) | A247 | A camera | plain striped cock surface there | left out for the 6MX | match | sure |
| Geneva stripes, top plate | A247 | flattened at y −22.35 (3 cameras) | pitch **3.86-3.94 mm** over 3-4 periods in the cleanest run (smaller patches 3.6-3.9, cut by parts); direction 126-131° from +x toward +z, i.e. along (−0.6, 0.8) in plan | 3.95 mm along (−0.643, 0.766) (130°) | match | likely |

| Escape wheel's height | F247 (8_Kirow_247_F.jpg, side view) | the wheel's own tips, Ø 14.00 drawn (shared), spanning 255 px edge-on: **18.3 px/mm** at the arbor's depth (if a gap rather than a tip stands at an extreme, up to 18.6) | the wheel's underside 315 px over the pillar plate's train face (its front edge, level in the image, v 596): **17.2 ±0.3** over it; its top 18.5 | the wheel's band middle at y −17.8 (about −17.15 to −18.45) | match | likely |
| Escape collet (cone) | F247 | 18.3 px/mm (the tips) | one gilt cone from the wheel's underside (v 280) to v 372: **5.03 ±0.15 long**; Ø about 2.5 at the wheel, 1.75 at its end, the arbor Ø 1.2 below | 5.08 long (y −17.1 to −12.02) | match | likely |
| Escape pinion | F247 | 18.3 px/mm | leaves from v 481 to 552: **3.88 ±0.12 long**, **10.9 to 14.8** under the wheel's underside; its foot 2.4 over the pillar plate | 3.77, from 11.15 to 14.92 under the wheel; foot about 2.2 over the plate | match (0.11 long, 0.1-0.2 in place) | likely |
| Escape arbor's place in plan ("along the detent") | A247, uZ247 | A and uZ cameras | (−11.88, 21.98) and (−11.72, 21.71) | drawn (−11.78, 21.74) | match | likely |
| Banking screw's head (WN-gkA) | F247 | 18.3-18.8 px/mm (the tips; the head may stand a few mm nearer) | the domed brass head end-on: an ellipse 48.6 × 63.0 px, its unforeshortened axis **63 px → Ø 3.35-3.44** | BLK.m6.bk rH 1.7 (**Ø 3.4**); 3.81.00's Ø 3.15 is the drawings' and Lange's, not the 6MX's | **match: keep Ø 3.4. 3.81.00's Ø 3.15 should not reach the 6MX** | likely (the earlier reading 3.45 on the same photograph and 3.43 on Kirov-Poljot 24020's agree) |
| Banking screw's axis under the top plate | F247 | 18.3 px/mm from the pillar plate's face line (v 596) | the head's centre at v 348: 13.55 over the pillar plate, so **5.45 ±0.35 under the top plate's inner face** (19.0 between them) | BLK.m6.s 5.0 (3.81.00's centring, 5.0, is the drawings' and is the same number) | can't tell (0.45, about 1.3 sd) | the face line's height at the screw's depth is the weak link |
| Stop screw (6MX.gke) | F247 | about 18.8 px/mm (the block's end stands nearer than the escape arbor; the camera is 420-450 mm off) | slotted steel head, ellipse 70.9 × 81.3 px: **Ø 4.3 ±0.15** | gke r 2.1 (Ø 4.2) | match | likely |
## Still to read (this session)

- The detent block on the loose block photograph (`8_Gangfeder_mit_Kloben_Rus_einfach.jpg`): the pins' layout against the stud, the base, the upright and its slit, the
  banking screw head (Ø 3.4; does 3.81.00's centring or Ø 3.15 reach the 6MX?), the adjusting slide and the stop screw.
- The detent's heights and sections, and the lower cock's step, from the side views (`8_Kirow_247_F.jpg`, `4-7_Kirow_247_N/O/S/W`).
- The lower cock's plan, the barrel and its cap.
- The seconds chaton on a second photograph.

## How blind

Before measuring, Beta saw the model's coordinates of the calibration features in photocompare's `--labels` output, which includes the 6MX's WN-gk stud and pillar
39's screw. Beta also glimpsed dims.js's pillar 39 comment and the access holes' angles while looking for the hole table. The plan readings of those three were taken
by an edge or rim fit from a rough pick on the photograph, never seeded from the model's place.
