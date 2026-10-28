# Batch 8, the refuter: the balance cocks, the fusee and dust bushes, the intermediate bridge, the barrel bridge and its click

Second drawing check (PLAN-wempe-drawing-check-2.md), step 7, 28 October 2026. I worked from the sheets, the photographs and the built model only. I didn't read batch8-read.md, the transcriptions or the first pass's reports, and I read batch8-model.md only after every verdict below was written.

## How it was checked

- **Sheets.** 05 08_4, _5, _6 (U30), _8, _9, _10, _12, _13, _14, 05 03_9 (the stud, for C3 and C7) and Wempe_Einheitschronometer.jpg. Each was cropped with PIL at 3-8x, and the key lines were located by pixel column and row profiles (threshold 120-170 on grey).
- **Crops.** All in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b8r\`:
  - U30 and the stud: `u30_stud.png`, `u30_right.png`, `u30_H7.png`, `stud_end.png`, `stud_side.png`, `stud_g6.png`;
  - the upper cock: `c05_plan.png`, `c05_right.png`, `c05_H7.png`;
  - the fusee bush: `fb_T6.png`, `fb_sec.png`;
  - the dust bush: `db_top.png`, `db_bot.png`;
  - the lower cock: `lc_secCD.png`, `lc_rev.png`, `lc_cd_bar.png`, `lc_plan.png`;
  - the click: `click_top.png`;
  - the coloured section: `cs_*.png`;
  - Wempe 3955: `w3955_stud.png`.
- **Model.** `py\probe.py` (Playwright, `?snap&qa`, MC_GL=gpu, one browser) ran on the read-only worktree wempe-check2-audit2 at efbf63c5. It wrote `probe.json`, which holds:
  - `WESC.HOLES.studScrew`;
  - the stud's vertices, and the upper cock's within 7.5 of hole 23, put in the cock's (u along the axis toward the foot, v toward O) frame;
  - the click's vertices in its own frame;
  - the bounds of the jewel settings, the bushes and WN-300.zb.
- **Code.** frame.js, escapement.js, train.js and bom.json were read for intent and the built numbers.

## Verdicts

| claim | verdict | evidence | sure |
|---|---|---|---|
| C3: the stud's screw hole, M1.4 at 4.10 along, 4.35 across | **Along confirmed. Across: the claim's grounds refuted, its value undecidable between 4.2 and 4.35** | See "C3 in detail" below | along sure; across likely (that 05 03_9 doesn't fix 4.35), undecidable (which value) |
| C4: the fusee bush's fit is r6, not T6; its g6 part slides in hole 10 | **Confirmed** | `fb_T6.png`: a lower-case r whose stem is crossed by the dash-dot centre line, so it looks like a T. Its "+0,028 / +0,019" is exactly ISO 286 r6 for 6-10 mm, and there is no shaft fit T6. The 8 r6 dimension line crosses the part above the flange, under the Kegel 1:70 leader, and the 8 g6's extension lines run down from the walls below it (`fb_sec.png`). g6 (−0,005/−0,014) in hole 10's 8.0 +0.015 is 0.005-0.029 clear, a slide. The model builds Ø 7.9905 in 8.0075: 0.017 clear | sure |
| C5: lower cock revision (a) is over the M1.2's "3,5 +0,1", widened from +0,05 | **Confirmed** | `lc_secCD.png`: the "(a)" stands right over the "+0,1" of "3,5", left of the vertical "0,5 +0,03". `lc_rev.png`: "(a) 1x Toleranz war +0,05, 2.12.46". The upper cock (05 08_5: "3,5 +0,05", not revised) draws the same holes at +0,05, so the widening is the likely reading. A tightening of the 0,5 from +0,05 to +0,03 can't be ruled out entirely | likely |
| C6: the dust bush's (7,62) can't come from Ø 8 at 1:70 over 16.3; the solid reaches 7.775 | **Confirmed** | `db_top.png`: (7,62) is the bore at the mouth's foot, 1.8 under the top. 18.1 − 1.8 = 16.3 of 1:70 taper takes 8.000-8.015 to 7.767-7.782. 7.62 needs 1:43, or 26.6 of length at 1:70. On the radius (2:70) it would be 7.53, which doesn't fit either. Built: rr(Yt+1.8) = 3.8873, so Ø 7.775. The comment "its top Ø 7.62" contradicts the solid | sure |
| C7: the stud's upright 1.790 (0.002 under g6's least) in the slot's 1.800: 0.010 clear | **Clearance confirmed, "0.002 under g6's least" refuted** | `stud_g6.png`: the stud's sheet writes its own limits, "1,8 g6 −0,003 / −0,010", so its least is 1.790. That is not ISO's −0.002/−0.008 for 1-3 mm. The model's 1.790 is exactly the sheet's least, not under it. The slot is "1,8 H7 +0,009" (`c05_H7.png`): the model's 1.800 is its least. Probe: the upright spans u ±0.8950 and the slot's walls are at ±0.900, so 0.010 clear. The sheets' fit is 0.003-0.019 clear (middle 0.011) | sure |
| C8: the set-up click swings with 0.13 of play on WN-22 | **Confirmed as built** | Probe: the click's hole is r 1.6150 (Ø 3.230, the top of 3,2 +0,03; the middle is 3.215). The shoulder Ø 3.10 is estimated from the coloured section. 3.23 − 3.10 = 0.13. The revised close tolerance ("(a) Änderung vom 25.5.48" against the "3,2 +0,03") points to a close running fit, so 0.13 is loose | sure (as built), likely (that it's too loose) |
| C9: the balance settings sit 0.006 clear in their seats, which bom.json calls press, each held by two screws | **Confirmed** | Probe: 050406-2 and 050408-2 (.bu and .bl) are each 5.200 across, and the seats are 5.206 (the 5,2 H7's middle). bom.json gives `in 050803-1 press` and `in 050800-2 press`. Upper: two WN-55.ck at ±3.525 over the endstone setting's edge, which holds the hole jewel's setting under it. Lower: two WN-10.bl at ±3.5. Also stale: bom.json 050406-2.bu's fn says "its flange in the sink below", but that flange was gone in October 2026 | sure |
| C10: the click is 17.53 long against 17,4; the 9,7, r 6 and 7,5 don't close on 17,4 | **Confirmed** | Probe: the click runs x −9.2618 to +8.2681 along its base, 17.530. Worked from the figures: with the base 2.85 under the hole (the Ø 5,7 circle tangent to it), the 9,7 radial to the beak's foot puts the foot 9.27 back. The r 6 about (5.142, 7.212) meets the base at the same 9.26. Then the nose r 1 at 7,5 radial ends at 8.27, so the total is 17.53. Taken from the beak's top corner instead (85°) it is 17.22. 17,4 lies between the two and matches neither. Drawn at 17.24 px/mm, the sheet puts the hole 9.16 from the left end and 8.24 from the right | sure (figures don't close) |
| C11: the intermediate bridge's WN-300 bush and the seconds jewel's setting are line to line | **Confirmed** | train.js: `bushGeo(4.3/2, …)` in the bridge's `C(H[38],4.3/2)`, and 050504-2's `ringT` out to 5.2/2 in `T(H[35],5.2/2)`. Probe: 050504-2 is 5.200 across and WN-300.zb 4.300. 05 08_10 hatches the bush as a pressed part but gives no sizes. bom.json says press. The top plate's WN-300/301 are line to line too (rJ in rJ) | sure |
| C13: the upper cock's lip hole is 4.590 against 4.596 elsewhere; the lower cock's M1.2 are at 3.500 | **Confirmed** | frame.js: the upper boss has `C(c,4.59/2)` (05 08_5's table: "4,59 +0,012", so the middle is 4.596), while the lower cock's lug uses `rJ` = 4.596/2. The lower M1.2 are `add(H[23],nv,±3.5)`: the least of 3,5 +0,1, against the upper's middle of 3.525 | sure |
| C14: the coloured section labels the upper cock's and the barrel bridge's screws WN-55, and the setting screws' label is more like WN-56 | **Upper cock and barrel bridge: confirmed (likely). The setting screws: undecidable** | The scan's digits are 5-6 px tall (`cs_digits.png`). The barrel bridge's label (x ≈ 318, y 218) and the upper cock's (x ≈ 1010, y 218) both read "Schraube WN-55", or WN-56 at worst. The setting screws' label at x ≈ 1572, y 178 can't be told 5 from 6: the difference is about 1 px. One WN number for an M2.6 and an M1.2 screw is implausible, so some label differs, but this scan can't say which | likely / undecidable |
| F1: the upper cock's slot is 1,8 H7 in every version, on the sheet's lines | **Confirmed** | 05 08_5's plan and Schnitt C-D: "1,8 H7 +0,009", "0,9" from C-D to the wall (so centred on 23), "3,4" from the axis to its end, C-D's 82°. U30 draws it in the same place (U30 pixels: walls 774.5/797.5, centre 786, jewel 785.3). The model uses one `cellsV` for every version; probe: walls at u ±0.900, the end at v 3.400 on the top and 3.063 at 2.4 down (8°) | sure |
| F3: Schnitt C-D's hole is pin 22's | **Confirmed (a steady pin's hole)** | `lc_cd_bar.png`: dashed, blind about 2.4 deep with a drill point, on the bar's middle, from the plate-side face. 36 is M2,6 through the full 10, so it isn't 36. C-D passes 2 mm from 22 (12 from 37). Seen along the bar, 22 and 37 project to the same spot, and 22 is the near one | likely |
| F10: "8,5" is the 85° itself | **Confirmed** | `click_top.png`: one rotated "85" with a degree circle, on an arc about the beak's foot from the face's extension line. No comma between the 8 and the 5. 85° fits the drawn face: 3.5·cot 85° = 0.31 mm, drawn about 5 px | sure |

### C3 in detail

- **Along.** U30's "5" (`u30_stud.png`; pixel rows y 355-371 on the sheet) runs from the hole's centre line (x 722) to a line at x 796-797. That line is the slot's far wall: the wall stands at x 797 for y 380-405, and the slot's centre is at 786. So the hole is 5 − 0.9 = 4.1 from the slot's middle, which is 23's line. The stud's own sheet agrees independently: the hole is 5 ±0,1 from the square end, and the upright is 1,8 thick and flush with that end, so 4.1 to the upright's middle. The model's 4.10 holds. Sure.
- **Across, the sheet.** U30's "4,2" runs from the hole's centre line (sheet y 402) to 23's centre line (y 453). The slot's end, the "3,4", is at y 411. Drawn, the hole is 51 px out against 3,4's 42 px, which scales 4.13. So U30 gives 4.2 across, directly. That is the only figure in the set that places this hole.
- **Across, the stud's sheet doesn't fix 4.35.** On 05 03 02-3's plan at 17.1 px/mm (by its 14,6), measured at x 620 (`stud_end.png`):
  - the bar's edges at the square end are 196.5 and 238.5 about the hole line at 217: 1.20 ("1,2 −0,1") and 1.26 (2,5 − 1,2 = 1,3);
  - the upright's hidden sides are dashed at 200.5 and 231: 0.96 and 0.82 from the hole line;
  - the end's far edge, beyond the bar, is at 244.5: 1.61 ("1,6 −0,2").
  So the sheet draws the upright off-centre, its inner (lean) face 0.82 from the hole line, not 0.93. The figures say the same:
  - the inner face's distance d_in = (1,6 −0,2) − (height under the bar)·tan 8°;
  - at nominal (1.6, 6.1 − 1.5 = 4.6): 0.954, so the hole is at 4.35;
  - at the middles (1.5, 4.5): 0.868, so the hole is at 4.28;
  - at the least (1.4, 4.4): 0.78, so the hole is at 4.19.
  4.35 needs every figure at its top limit and the upright drawn symmetric. The model builds the upright 1.86 wide and centred on the hole line, "so its inner face clears the cock's slot by 0.01". That width was chosen to fit the hole, so the reasoning is circular. U30's 4.2 closes with the stud as its sheet draws it: 3.40 + 0.82 = 4.22, the face on the slot's end.
- **Across, Wempe 3955** (`w3955_stud.png`, 2_Wempe_3955_A.jpg, 9.34 px/mm by the setting screws' 7.0):
  - the stud screw's head reads (626.4, 567.6) against the setting's centre (597.8, 616.5): 4.22 along and 4.36 across, uncorrected;
  - the head's top stands about 1.7 above the setting screws' heads. With the camera about 290 mm off the plate (the cock's top scales 1.055 times the plate's 8.85 px/mm), the parallax for a principal point at the image centre gives about 4.28-4.33 along and 4.25-4.30 across;
  - at ±0.15 it can't separate 4.2 from 4.35.
- **Verdict.** "4.35 fixed by 05 03_9 and the slot" doesn't hold: 05 03_9 allows 4.19-4.36, and U30 figures 4.2. The model's 4.35 departs from the one direct figure by 0.15. Keep it only as a choice, with the 4.2 and the stud's drawn asymmetry recorded. Or build 4.2 with the upright's inner face at 0.80-0.82 from the hole line (outer at about 1.0), which also brings the stud's plan into line. Its far edge then comes 0.80 + 0.632 = 1.43 from the hole line, inside 1,6 −0,2.

## Extra checks: the ten figures most likely misread

| # | figure | the trap | model | verdict |
|---|---|---|---|---|
| 1 | U30 "4,2" (the stud hole across) | which line it ends on | 4.35 | the only direct figure. See C3 |
| 2 | 05 03_9 "1,2 −0,1" and "1,6 −0,2" (the stud's plan) | the middle to an edge, not a width. The square end is 1,2 one side and 1,3 the other | the bar's square end is symmetric, c ± 1.25 (probe: v 3.10-5.60 about 4.35); the upright symmetric ±0.93 | **new, small (0.05 and 0.11)**: the sheet draws the square end 1.20/1.26 and the upright 0.96/0.82 about the hole line, offset away from the lean |
| 3 | U30 "1,8 -47"? (the slot) | its tolerance glyph | — | reads as "H7", written small (`u30_H7.png`; no comma, so not "−0,1"). The same as 05 08_5's 1,8 H7 |
| 4 | 05 08_5 / U30 "3,4" | the slot's end from the axis, or a half-width | v 3.400 on the top | right: from 23's line to the slot's end (`u30_right.png`, `c05_right.png`) |
| 5 | 05 08_5 "22 ±0,1", "4,5", "≈5,5", "26,5" | radius or straight distance | arc r 22 about 23, the web 4.5 on the axis | right: 22 + 4.5 = 26.5 closes. ≈5.5 at the sides follows from the arc |
| 6 | 05 08_5 table, the second coordinate column's dittos | O or W carried down | 8 O 0.559, 20 O 6.512, 9 O 2.760, 50 W 6.083 | right. Checks: 6 to 50 is 10.00 ("5-5"); 8 to 23 is 33.00; 20 to 23 is 10.00; 9 to 23 is 24.50; the axis is 15.0° W of N |
| 7 | 05 08_4 "8,2", "5", "17,2", "10", "5r" | across or along the bar | 23 at u −5, w 8.2; the lug r 5, the total 17.2 | right: √(5² + 8.2²) = 9.604 is the table's 23-to-36 distance |
| 8 | 05 08_4 "3,22 −0,04", "0,5 +0,03", "10 −0,1" | taken at the limits | 3.22, 0.50, 10.0 (all at the top or least) | in tolerance, not at the middles (as C13) |
| 9 | 05 08_13 table (45-48, 41, 47) and its radii | ditto columns; 37r, 39r, 42,5r | WD.H to 0.001 | right: 42 and 48 at r 37.00 (30°, 62°), 41 and 47 at r 39.00 (38°, 54°), 45 to 46 is 12.00, 42,5 the rim |
| 10 | 05 08_8 / _9 heights: 2,9 +0,2, 1,5 −0,1, 7,1 −0,2; 18,1, 15,1, 3,1, 1,8 | which end each starts from | the fusee bush 2.9 + 1.5 + 2.6 (7.0); the dust bush's collar top 15.1 from the bottom, 3.1 deep, the neck 3.0 | right. The spigot's 2.6 against 2.7 is the code's recorded departure |

Also checked, with no disagreement:
- The fusee bush's holes (1,5 +0,1 at 1.55; the sink 2,2 H8 at 2.207 × 0.5; 10,4 ±0,05 at r 5.2; the 45° sink to Ø 7).
- The dust bush's 13,1, 9,7 and 15,1 with the 14,1 flat (6.55 from the axis).
- The upper cock's pins (1.7 into the cock and 1.3 proud, as U30 has them).
- Hole 20 (Ø 2.8 at 10).
- The lower cock's M1.2 holes, which lie across the bar on C-D.

Every hole round the stud and the cocks was looked at:
- 23's seat and lip in both cocks;
- the four M1.2;
- 36, 22, 37, 8, 20, 6, 9, 50;
- the slot;
- the stud's M1.4, its only open question being C3.

## After reading batch8-model.md: where I disagree

- **M3 (C3).**
  - It says the stud's upright is "1.9 −0.2 across, centred on the bar", so U30's 4.2 would put the face 0.13 into the slot's end. Not on 05 03_9's plan: the hidden sides are drawn 0.96 and 0.82 from the hole line, and the "1,6 −0,2" far-edge figure with the 8° lean gives an inner face 0.78-0.95 from it, not 0.93 fixed. At the drawn 0.82, U30's 4.2 leaves the face 0.02 clear of the slot's end.
  - It also says U30's slot is "1,8 −0,1, not H7" and that U30's 4.2 "belongs to the lever chronometer's stud". The glyph reads as a small "H7" (no comma), and the set has no lever stud sheet to support a different stud. U30 is the same cock (the coloured section and U30 draw one form).
  - So I hold: along 4.1 sure; across, U30's 4.2 is the figure, and 4.35 is a top-limit, symmetric-upright choice. Wempe 3955 doesn't decide it.
- **M7 (C7).** Its "1,8 g6 (1.792-1.798)" is ISO 286's g6. The stud's sheet writes its own limits, −0,003/−0,010 (`stud_g6.png`), so the range is 1.790-1.797 and the model's 1.790 sits on the least, not 0.002 under it. The sheet's fit is 0.003-0.019 clear. Its proposed correction (the upright at 1.795) would be the sheet's middle, 1.7935, not 1.795.
- **M14 (C14).** It reads the setting screws' last digit as "nearer 6". At this scan's 5-6 px digits I can't tell 5 from 6, so I'd call it undecidable rather than leaning either way. I agree that one WN number for an M2.6 and an M1.2 is implausible.
- **Everything else agrees:** M4/C4, M5/C5 (it also points out the card's "the setting's seat +0.05"), M6/C6, M8/C8, M9/C9, M10/C10, M11/C11, M13/C13, F1, F3, F10.
- **Two additions:**
  - the stud's square end and upright drawn asymmetric about the hole line (extra check 2);
  - bom.json 050406-2.bu's stale "its flange in the sink below" (C9).
