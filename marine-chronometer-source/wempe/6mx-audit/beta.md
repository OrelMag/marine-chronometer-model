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
| Pillar 39's screw (WN-57 head, top plate) | A247 | A camera (rim, 49, 11, barrel bridge screws); checks 0.1-0.29 | (6.69, 36.14) ±0.3 → **r 36.77 at 190.5°** (N toward O), head Ø 6.39. Read twice (edge locator and rim search): (6.73, 36.16) and (6.69, 36.14) | WD.P39_6MX: 190°, **r 37.3** → (6.477, 36.733) | **mismatch in r** (−0.5 mm); angle matches | likely. The 49 check reads its r 0.29 *large*, so the true r is if anything under 36.8. dims.js's own earlier readings were r 36.45 (A) and 37.47 (uZ). r 37.3 was chosen to clear the drawn seconds wheel's tips, not read. A second plan photograph of another Kirov is wanted before changing it |
| Pillar 39's screw, dial side | uZ247 | uZ camera (weak) | (8.30, 36.26), r 37.2. The locator took a slot edge (Ø 3.67), so this is not a rim reading | r 37.3 | can't tell | uZ ±0.5-1 |
| Hole 3 (N 37) | A247 | A camera | open, (−0.01, −37.27) Ø 3.72-3.76 | H[3] (0, −37), Ø 3.5 (rH35), drilled in the 6MX top plate | match (place); Ø 3.7 against 3.5 is within 2 px | sure (present); Ø can't tell |
| Hole 3, dial side | uZ247 | uZ camera | open, (−0.16, −37.01) Ø 3.40 | (0, −37) | match | likely |
| Hole 12 | A247 | A camera | open with a brass rim, (−36.11, 9.65) Ø 3.71 | H[12] (−35.739, 9.576) | match (0.37, at the edge of ±0.3) | likely |
| Hole 12, dial side | uZ247 | uZ camera | open, (−36.43, 9.90) Ø 3.54 | same | match | likely |
| Hole 40 | A247 | A camera | a round feature Ø 3.53 at (26.10, 26.45), half under the barrel bridge's edge; a dark crescent on its left half | H[40] (26.163, 26.163) Ø 3.5 open | match (place) | likely. Whether it is open or filled flush can't be told at 9 px/mm (README: "filled flush with gilt") |
| Hole 40, dial side | uZ247 | uZ camera | a brass-ringed disc Ø 3.88 at (26.78, 26.63) | same | match (place) | uZ ±0.8 |
| Hole 53 (Stift f. Wendelfeder, (−15, 37)) | A247 | A camera | **none**: bare striped plate for several mm round the place | left out of the 6MX top plate | match | sure |
| Contact access hole at 219° | A247 | A camera | open, a slotted screw head deep in it: (23.85, 29.28) Ø 3.66 → r 37.77 at 219.2° | CONTACT6.access (23.6, 29.14) Ø 3.5 → r 37.5 at 219.0° | match (0.29) | likely |
| Contact access hole at 180° | A247 | A camera | open, brass below: (−0.05, 38.77) Ø 3.64 → r 38.77 at **180.0°** (read twice: −0.09, 38.81) | (**−0.61**, 38.6) → 179.1° | **mismatch in x, 0.55 mm** | likely. The plan's x near 12 and 6 checks to 0.01 (hole 3 at −0.006). Kirov 1564's plan would settle it |
| Small hole "S 20.6 O 30.2" (README: on no sheet, not built) / the block's near steady pin | A247 | A camera | one brass pin end Ø ≈ 1.0 at **(−29.08, 22.49)** (rim search; cameras spread 0.29). No hole at (−30.2, 20.6): bare plate. Dial side: a dark speck at about (−29.7, 22.6) | HOLES.block6.pins[0] **(−30.0, 21.55)** | **mismatch, 1.3 mm** (0.92 in x, 0.94 in z) | likely. Both faces agree in z, and Alpha's photocompare missed this pin by 46 px (1.29 mm) where the stud fits. The README's "S 20.6 O 30.2" seems to be the same dot read 2.2 mm off |
| The block's far steady pin | A247 | A camera | brass pin end at **(−36.66, 14.46)**; its rim too small to size | HOLES.block6.pins[1] (−36.7, 14.15) | match (0.31) | likely |
| The detent block's fixing stud/screw (WN-gk) | A247 | A camera | dark slotted head **(−34.32, 18.67)**, Ø 3.38, at y −24.6 | HOLES.block6.stud (−34.3, 18.5), head r 1.7 (Ø 3.4) | match (0.17; Ø 3.38 against 3.4) | likely |
| Intermediate arbor's chaton (top plate) | A247 | A camera | centre (9.84, 15.68) / (9.77, 15.30); **outer ring Ø 4.41**, oil sink Ø 3.42 | at H[38]; chaton fills rJ Ø 4.596; sink rs 1.7 (Ø 3.4) | sink matches. Outer Ø 4.41 against 4.60: can't tell (2 px) | place sure; Ø ±0.2 |
| Seconds arbor's upper chaton | A247 | A camera | centre (−0.07, 23.18); **outer ring Ø 4.83**, oil sink Ø 3.63 | at H[35]; rJ Ø 4.596, sink Ø 3.4 | can't tell. It reads 0.2 large, the intermediate's 0.2 small, so the two chatons differ by 0.4 on one photograph | open. Worth a second photograph (Kirov 1564's top plate) |
| Intermediate's lower chaton / jewel (intermediate bridge, dial side) | uZ247 | uZ camera | used as a calibration point; the jewel is centred on the arbor within 0.4 px | SM6.rb 2.15 | not sized (uZ too coarse) | — |
| Escape arbor's place | A247, uZ247 | both | upper endstone setting (−11.88, 21.98) Ø 5.17 at y −22.65; lower jewel setting (−11.72, 21.71) | drawn (−11.78, 21.74) | match | likely |
| Upper cock: no hole 20 ((−6.51, 2.45)) | A247 | A camera | plain striped cock surface there | left out for the 6MX | match | sure |
| Geneva stripes, top plate | A247 | flattened at y −22.35 (3 cameras) | pitch **3.86-3.94 mm** over 3-4 periods in the cleanest run (smaller patches 3.6-3.9, cut by parts); direction 126-131° from +x toward +z, i.e. along (−0.6, 0.8) in plan | 3.95 mm along (−0.643, 0.766) (130°) | match | likely |

## Still to read (this session)

- The detent block on the loose block photograph (`8_Gangfeder_mit_Kloben_Rus_einfach.jpg`): the pins' layout against the stud, the base, the upright and its slit, the
  banking screw head (Ø 3.4; does 3.81.00's centring or Ø 3.15 reach the 6MX?), the adjusting slide and the stop screw.
- Heights and sections from the side views (`8_Kirow_247_F.jpg`, `4-7_Kirow_247_N/O/S/W`): the detent, the escape wheel's height, the collet, pinion 3.77, the lower
  cock's step.
- The lower cock's plan, the barrel and its cap.
- A second plan photograph (Kirov 1564, 2973 or 009 A) for pillar 39's r, the access hole at 180° and the seconds chaton.

## How blind

Before measuring, Beta saw the model's coordinates of the calibration features in photocompare's `--labels` output, which includes the 6MX's WN-gk stud and pillar
39's screw. Beta also glimpsed dims.js's pillar 39 comment and the access holes' angles while looking for the hole table. The plan readings of those three were taken
by an edge or rim fit from a rough pick on the photograph, never seeded from the model's place.
