# Batch 3, the refuter: maintaining work, maintaining detent, stop work

Second drawing check (PLAN-wempe-drawing-check-2.md), step 7, 28 October 2026. I had only the sheets and the built model (read-only worktree `wempe-check2-audit`, main at 7d9a679c). The verdicts below were written before I read `batch3-model.md`. The last section compares them with it.

## How it was measured

- **Scratch.** Everything named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b3r\` (written `b3r\` below).
- **Sheets.**
  - Crops and enlargements with PIL: `d12_*.png`, `c14_*.png`, `s4_*.png`, `s9_*`, `s10_*`, `s11_*`, `s12_*`, `s13*.png`, `a11_*.png`.
  - Pixel work with numpy/scipy: line positions along rays, circle fits and line slopes.
  - Scales were set from figures on the same view:
    - 05-05_12: 17.5 px/mm, from its 5 and 14,2, the same both ways.
    - 05-06_14: 33.9 px/mm, from its 10,05.
    - 05-06_13: 17.2 ±0.25 px/mm, from its two Ø 2,2 formers fitted as circles.
    - 05-06_11: 12.14 px/mm, from the tips' circle.
    - 05-06_04: 12.3 px/mm, from C-D's 22,5 and A-B's cup.
- **Model.**
  - `b3r\py\probe.py` + `probe.js`. Playwright, GPU, `?snap&qa&start=movement`, frozen as fine.py freezes (`n`, `winding`). It reads:
    - the stop bar's travel (`stopWork.userData.travel`) at several wind states;
    - the click outline in its own frame;
    - the click springs' top-face area / 0.4 (their developed centreline, since the top face has no holes in it);
    - radial extents about the fusee axis;
    - point-in-solid ray tests (three rays, parity) along the two stop-work pins' axes.
  - `b3r\py\probe2.py` + `probe2.js` read the maintaining spring's top-face boundary in 'last' and 'first' (`ms_out.json`, plot `ms_last_0.png`).
  - I also read the code in `wempe/js/fusee.js`.

## Verdicts

| claim | verdict | evidence | sure |
|---|---|---|---|
| **C1** detent step at 30°, model 34.7° | **confirm** | See the C1 notes below. | sure |
| **C2** clicks' base 1.5 under the pivot, model 1.52, nose 5.224 | **confirm** | See the C2 notes below. | likely (the 1.5 is implied, not figured) |
| **C3** stop bar has no hole for pin 05 06 03-2 | **confirm** | See the C3 notes below. | sure |
| **C4** stop spring has no hole for pin 05 06 04-4 | **confirm (model)**, with a wording correction (sheet) | See the C4 notes below. | sure (model); likely (sheet) |
| **C5** click springs' radial place: sheets disagree, model follows neither | **half confirmed, half refuted** | See the C5 notes below. | likely (the 0,2 gap); possible (which face 12,0 is) |
| **C6** 05 06 02-4 are rivets; the model's stand 0.4 proud | **confirm, amended** | See the C6 notes below. | likely |
| **C7** click springs develop 26.65 against the sheet's 27,0 | **confirm** | See the C7 notes below. | sure (number); likely (cause) |
| **C8** maintaining spring outline is a 0.02-grid contour, square end stepped | **confirm** (cosmetic) | See the C8 notes below. | sure |
| **C12** first-drawn spring's Ø 32.25 is outside 020605's boxed [32,3 −0,02] | **confirm** | See the C12 notes below. | sure |
| **C14** detent arbor's chamfered shoulders and 1:70 taper, and the detent's tapered hole, missing | **confirm**, plus one more miss | See the C14 notes below. | sure (code); likely (shoulders, ends) |
| **Travel**: the sheet's 3,2 against the model's 3.6, justified by the chain sliding the bar 3.36 at full wind | **refute the justification** | See the travel notes below. | likely |

### C1: the detent step

- **What the sheet's 150° is.** On 05-05_12 (`d12_150.png`), the 150° arc runs between two things:
  - the down-left leg of the thin construction line through the dashed step;
  - the rightward horizontal through the boss's underside.
  So the step line is at 180 − 150 = **30°** to the horizontal.
- **How the line is drawn.**
  - The dashed step measures **31.2°**: pixels (393,309) to (431,286) at 17.5 px/mm, the same both ways.
  - Its construction line measures **30-31°**.
- **An independent check.**
  - A 30° line from the step's upper end (8.6, 1.403) crosses the pivot's vertical centreline 3.56 under the hole.
  - The sheet's construction line meets that centreline **3.65-3.75 under the hole** (pixel), where the 150° arc's vertex is.
  - At 34.64° the crossing would be 4.54 under.
- **The model.** `fusee.js`: S1 (8.6, 1.403), S2 (5.6, −0.670), which is **34.6°**.
- **The 30° line on the hollow.** It meets the r 9 hollow at (4.86, −0.76). The model has (5.60, −0.67).

### C2: the clicks' base line

- **What the figures mean** (05-06_14, `c14_top.png`, `c14_354.png`):
  - "3,54" is measured from the pivot centre: its upper extension line leaves the hole's centre.
  - "5,2 −0,1" is a radius about the pivot to the nose: a thin r 5.2 arc about the pivot is drawn through the nose foot, measured 535 px on the 3× crop.
- **The geometry.** The nose foot lies on the r 3 hollow about (−2.78, −3.54) and on the base line.
  - With the base 1.50 under the pivot: |nose| = **5.201**.
  - With 1.52: 5.224, past 5.2 −0.1.
- **The model.** Probe: click `noseMax` 5.224, overall 10.029.
- **What the pixels say.** The drawn base scales 1.52. A 10:1 sheet scales to ±0.03, and the figures close only at 1.50.

### C3: the stop bar's pin hole

- **The sheet.** On 05-06_04's C-D (`s4_pins.png`), the pin is drawn in both positions, with dashed lines running right across the bar: a pin in a hole through it.
- **The model.**
  - The bar's `solidGeo` has no hole (`F`) list.
  - Ray test: the pin's axis is inside the bar's solid at **39 of 61** samples, z 3.0-6.0, which is exactly the bar's v 4.01-5.99.

### C4: the stop spring's pin hole

- **The model.**
  - Ray test: the pin's axis is inside the ribbon (`050603-3`) over **0.10** of its length (y 0.93-1.03 of the pin, the ribbon's thickness). That is 26 of 1028 samples.
  - Inside the fusee body: 0 of 206, so the body's 0.5 H7 hole is cut.
- **The sheet** (C-D, `s4_top.png`).
  - It draws the pin (1,5 off the axis line) solid in the recess, running through the spring's line and ending about 0.3 inside it.
  - A hole in a ribbon seen edge-on can't be drawn in that view. The sheet draws the pin passing through the spring, which entails a hole; it doesn't draw a hole outline.

### C5: the click springs' radial place

This has three parts.

- **(a) A-B's figure.** It reads **0,2** (`s4_12.png`: 0, comma, 2). It brackets the cup's inner wall and a faint line 2.5 px (**0.20**) inside it.
  - At 158°, past the spring's end, the ray profile shows lines at r 149.0 and 151.5 px: the spring's outer-face circle and the wall.
  - So the installed spring's outer face is at ≈ 12.025.
- **(b) The model misses it.** Probe: the springs' wall run is r 11.73-**12.20**, so the outer face is 0.025 off the wall. The model follows neither figured reading.
- **(c) The sheets are not shown to disagree.**
  - 05-06_13's "12,0 r" arrow touches the band's inner face (`s13.png`). So does "10,4 r" (`s13_r.png`).
  - Taken literally at the inner face, 12,0 puts the outer face at 12.4, which is outside the cup's 12.225. It can't be installed.
  - Read to the outer face, 12,0 agrees with A-B's 12.025 within 0.025.
  - The sheet's pixels can't separate the readings. A concentric fit (`s13`) gives:
    - faces at 171.9/180.2 px and 203.2/211.7 px;
    - a radial step between the runs of 31.3 px, which is 1.82 mm at the formers' scale against the figured 1.6;
    - so the drawing is off by about 0.2 there.
- **The drawn lines, as against the figures.**
  - 05-06_11 draws the wall run's inner face at 11.7 and the 10.4 run centred at 10.39.
  - A-B draws the inner face at 11.8.
  - Both are near the model's centreline reading. The figures (0,2) say otherwise.

### C6: the click springs' fixings 05 06 02-4

- **The sheet.** On 05-06_11 (`s11_pinsUL.png`, `s11_pinsLR.png`), each pin is drawn with flared or rounded heads at both ends: rivet heads. The section (`s11_sec.png`) shows a domed head on the spring's inner face.
- **Ray profiles along the pins.**
  - The drawn heads reach r ≈ 13.18, about 0.2 past the wall's outer line (12.97).
  - They reach ≈ 11.5 inside, about 0.2 inside the spring's inner face (11.7).
- **The model.** Plain cylinders r 11.80-13.40 (probe):
  - flush with the spring inside;
  - **0.40** proud outside, about 0.2 more than the drawn head;
  - no inner head.

### C7: the click springs' developed length

- **The model.** Probe: top-face area / 0.4 = **26.59 and 26.63**.
- **The sheet, as drawn.** I built its centreline from 05-06_13's own lines, as arcs on r 207.5 and 176.1 px about the fitted centre and the S round the two fitted formers (centreline r = former + 3.45-4.2 px).
  - The S's tangencies with the formers are 15.0° apart, with bends of 51-55° and 36-40°.
  - The ends are at 143.8° and 6.0°.
  - The centreline comes to **462-463 px = 26.9 mm** at 17.2 px/mm (26.5-27.5 over the scale's ±0.3 px/mm). That is consistent with "gestreckt 27,0".
- **The 13,6 chord.** It runs from where the band leaves the second former to the tip, and scales **13.57** (233.4 px).
  - The model's S end (hole + 32.4°) and its tip (hole + 110°) on r ≈ 10.4-10.5 give a chord of about **13.0-13.2**. This is estimated from the model's angles, not probed.
  - So the shortfall lies in the 10.4 run and the S: the model's S spans 8.5° as a cosine ramp, where 02-2 draws 15° between formers.

### C8: the maintaining spring's outline

- **The probe** (`ms_out.json`, `ms_last_0.png`). The square end is 77 points 0.02-0.03 apart. Against a fitted line they zigzag **±0.009** (max 0.0125, rms 0.006).
- **The rest of the outline.** Elsewhere its segments run 0.34 median.
- **'first'.** The same.
- **Size.** Far under any tolerance.

### C12: the first-drawn spring's diameter

- **The sheet.** 020605 (`s9_box.png`) reads boxed **32,3 Ø −0,02**, which is 32.28-32.30.
- **The model.** Probe: 'first' rmax 16.125, so **Ø 32.25**, 0.03 under. 'last' is the same 32.25, inside 05 06 01-1's 32,3 −0,1.

### C14: the detent's arbor and bore

- **The sheets.**
  - 05-05_12 section A-B figures the hole "Kegel 1:70" (`d12_sec.png`).
  - 05-05_11 draws the arbor's shoulders chamfered at both ends (`a11_top.png`, `a11_bot.png`).
  - It also draws the **pivot ends domed**.
- **The model** (`fusee.js` arbor profile):
  - square shoulders;
  - a straight Ø 2.25;
  - **flat** pivot ends;
  - the detent's hole is a plain r 1.125.

### Travel: the stop bar's 3,2 against the model's 3.6

- **What 3,2 is.** On C-D (`s4_32.png`, `s4_barbot.png`), it is measured from the bar's lower point running (solid) up to an extension line through the dashed (wound) lower point. So 3,2 is the displacement between the two drawn positions: the bar's slide at full wind.
- **How the drawing scales.** The two positions themselves scale **3.54** (lower points, 43.5 px) and **3.66** (upper ends, 45 px) at 12.3 px/mm. That is where the model's 3.6 comes from: a scaled value against a figure.
- **The model's travel** (probe, `stopWork.userData.travel`):
  - n 0 running and winding: **3.360**;
  - n 0.05: 3.328;
  - n 0.12: 2.874;
  - n 0.17 winding: 1.992;
  - n 2.5: 0.
  The 3.6 cap is never reached.
- **Why the justification fails.** It is circular. The 3.36 comes from the model's own chain path against its own bar end, so it can't vouch for that geometry.
  - What it shows is that the model's full-wind slide is **0.16 past the sheet's 3,2** (5 %).
  - A cap of 3.2 would make the model jam (`userData.jam`).
  - The discrepancy belongs to the place of the bar's lower end against the chain on the top turn (or the bar's length or oblique end), not to the cap.
  - "Holds within the sheet's scatter" doesn't apply either: the drawn positions are 0.35-0.45 off the figure, not 0.1-0.2, and the figure rules.

## Extra checks (dimensions most likely misread)

| # | dimension | what it could be misread as | what the sheet shows | model | verdict |
|---|---|---|---|---|---|
| 1 | 05-05_12 "12 r 0,1" | radius about another centre | arc about the hole through the end's lower corner | lower corner r 12.00 | match |
| 2 | 05-05_12 "2,6" | height off the A-B line | from the horizontal tangent to the boss's underside (2.5 under the hole) to the end's upper corner | 2.6 from y −2.5 at 80° | match |
| 3 | 05-05_12 "8,6" | a radius (the pre-16 Oct arc) | horizontal from the pivot's vertical to the dashed step's upper end (pixel 431,286 on the 8,6 extension line, x 433) | 8.6 | match |
| 4 | 05-05_12 "9,645 / 6,273" | to the A-B line or the boss | from the hole's centre lines to the hollow's centre (the dot) | (6.273, −9.645) | match |
| 5 | 05-05_11 "6,3 ±0,1" and the thin tip's face | which face is "upper" | from the lower shoulder to the face farther from it; first-angle unfolding puts the section's recess on the face away from the plan viewer (dashed in plan ✓), and 05-05_11 draws the thin part on the half far from the lower shoulder | 6.2 (in tol.), thin part DTU..DTU+1 on that side | match |
| 6 | 05-06_14 "3,54" | from the base line | from the pivot centre (its extension line leaves the hole's centre) | 3.54 from the pivot | match |
| 7 | 05-06_14 "5,2 −0,1" | a chord along the base | radius about the pivot (thin r 5.2 arc drawn through the nose) | used so, but 5.224 (C2) | wrong (C2) |
| 8 | 05-06_13 "10,4 r" | centreline | arrow on the inner face, the same convention as 12,0 | centred on 10.4 | same open question as C5; consistent with the model only if both are read as centrelines |
| 9 | 05-06_13 "13,6" | the tip's radius | chord from where the band leaves the second former to the tip end (scales 13.57) | about 13.0-13.2 (estimated from angles) | supports C7 |
| 10 | 05-06_10 "15,25" | the end's chord or width | chord from the r 14,2 hole to the eye's hole (2·14.2·sin 32.5° = 15.26; scales 15.17) | eye on 0° at r 14.2: 15.26 | match (confirms the eye hole on r 14.2) |
| 11 | 05-06_04 C-D "22,5" | 22,6 | 22,5 at full zoom (`s4_226.png`) | 22.496 | match |
| 12 | 05-06_04 C-D "3,2" | the oblique cut | the slide between the two drawn positions (above) | 3.36 at full wind | 0.16 over |
| 13 | 05-06_04 A-B "0,2" | 1,2 | 0,2 (`s4_12.png`) | 0.025 | C5 |
| 14 | 05-06_12 tips | Ø 37,5 (struck) | 37,25 −0,1 (rev. a) | 37.20 (last), 37.45 (first) | match |
| 15 | 020605 thickness | 1,4 | "1,4 vordrehen" (pre-turned); finished 1,3 | 1.3 | match |

New beyond the claims:

- **The detent arbor's pivot ends are domed on 05-05_11.** The model's are flat. This belongs with C14.
- **The rivet heads stand about 0.2 both sides** on 05-06_11 (C6).
- **The installed spring's 0,2 gap is drawn as a construction circle** past the spring's end (A-B at 158°).

## After reading batch3-model.md: where I disagree, and why

- **Travel (its F2 and Readings corrected, "kept… holds within the sheet's own scatter").** I still disagree after reading its argument.
  - The 3.6 is the drawn positions scaled (3.54/3.66). The figure is 3,2. The sheet's own scatter between figure and drawing is 0.35-0.45, so it can't absorb 0.16 as "scatter". It shows the drawing isn't to scale there, and the figure rules.
  - The 3.36 comes from the model's own chain-on-bar geometry, so it can't confirm that geometry.
  - I'd record it as a 0.16 overshoot of the figured full-wind slide (likely), to be traced to the bar's lower end against the top turn, not "kept".
- **M5 (C5).** I agree with its numbers: the 0,2, the 12.025, and that the inner-face reading is impossible. I disagree with the framing "inconsistent (sheets)".
  - The one physically possible reading of 12,0 (to the outer face) agrees with A-B's 0,2 within 0.025. So the sheets are reconcilable.
  - What is wrong is the model, which takes 12,0 (and 10,4) as centrelines and so sits 0.175 off A-B's figured gap.
  - I'd grade it "model off the assembly's figure, likely", with its correction: centreline 11.825, and 10.2 for the tip run if 10,4 follows the same convention.
  - The drawn lines (05-06_11 inner face 11.7, A-B 11.8) are closer to the model, which is why it is not "sure".
- **M6 (C6).** I agree on the rivets. Its "0.40 proud" understates the case for change in one way and overstates it in another:
  - the sheet does draw the heads proud, about 0.2 outside;
  - it also draws heads about 0.2 inside, on the spring.
  - The correction should be domed heads about 0.2 high both sides, not just removing the 0.4 overhang.
- **M7.** I agree. As further evidence:
  - the drawn centreline itself develops to 26.9 at the formers' scale;
  - the 13,6 chord (13.57 drawn) puts the shortfall in the S and the 10.4 run.
  - The model's S spans 8.5°, where 02-2 draws 15° between the formers' tangencies. The model's 8.5° came from the assembled 05-06_11, where the spring is sprung.
- **Agreed without reservation:**
  - M1: I add the independent check that the 30° line meets the pivot's centreline 3.56 under the hole, where the sheet's 150° vertex is (3.65-3.75 scaled). 34.7° would put it at 4.54.
  - M2, M3, M4, M8 (I measured the end's zigzag at ±0.009), M12a and M14 (with the domed pivot ends).
