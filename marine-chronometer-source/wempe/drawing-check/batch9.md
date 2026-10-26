# Batch 9: the motion work, up-and-down work, hands and dial against their sheets (26 October 2026)

I worked read-only in the `claude/wempe-artifacts` worktree at HEAD 1547fa60. Nothing in the repository was edited.

**How I measured.** Every path below is under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b9\`.

- **The solids.** `dump7.py` (batch 7's script) dumped every mesh of `cannon`, `changeWheel`, `hourWheel`, `udWheel`, `udPinion`, `hands` and `dial` in the movement frame, with their normals, in all five versions (`d7_<rev>.json`). It uses isolate.py's freeze.
- **Analysis scripts:**
  - `an9.py`: boxes and heights.
  - `prof9.py`: the turned parts' (r, y) profiles.
  - `loop9.py`: the gears' top-face boundary loops, giving tip and root diameters and tooth thickness on the pitch circle.
  - `hands9.py`: each hand's width and thickness at the sheet's stations.
  - `dial9.py`: every hole in the dial, its diameter, radius and angle, at each level.
  - `nrm9.py`: vertex normals against face normals.
- **Renders** come from `render.py` (GPU, Edges on):
  - `r_cn_*` (cannon), `r_ch_*` (change wheel), `r_hw_*` (hour wheel), `r_ud_*` (up-and-down wheel and pinion), `r_hd_*` (hands), `r_dl_*` (dial);
  - side views `r_hws_*`, `r_chs_*`, `r_uds_*`, `r_hds_*`;
  - close-ups `r_hwb_*`, `r_chb_*`, `r_dlp_*`, `r_cnc_*`;
  - contact sheets `sheet_*.png`;
  - `isolate.py` runs with `--ref`: `r_iso_hourWheel.png` and `r_iso_changeWheel.png`.
- **Sheet crops** are in `crops/`, enlarged 2.4× to 10×, with pixel-row scans where a width mattered. The scales are:

| sheet | px/mm | calibrated on |
|---|---|---|
| 05 02 03 | 16.6 | its 8.2 |
| 05 02 02 | 16.7 | its 7 and 3.05 |
| 05 02 04 | 17.4-17.5 | its 5.2 and 3.4 |
| 05 05 03 | 16.9 | its 19 |
| 05 02 00-4 | 4.9 | |

**Heights** are given over the pillar plate's dial face, PPT. That face lies at y 3.35, and the dial at DY0 7.00 to DY1 8.30 over it (absolute y 10.35-11.65).

**Versions.** `last`, `first`, `1943` and `3955` are identical for every part in this batch: same meshes, same vertices.

`6mx` differs in three places:
- the change pinion is steel;
- the up-and-down wheel's spokes taper 1.865 to 1.176 (measured at r 5.3 and r 14.1);
- the dial's three screws sit at 354°, 114° and 234° on r 49.9, against the German 354°, 120° and 240° on r 50.5.

The Lange and Kirov dials change only the printed texture (`R.setDial`). The disc, holes and screws stay the same (finding W1).

---

## cannon: Minutenrohr 05 05 03-3 on 05 05 03 (`05-05/_08.jpg`, 1943), with 05 02_1 (`_01`, 1941)

| feature | sheet | model (how measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| pinion block height | 25,4 − 23 = 2,4 (on journal C) | 0 to 2.400 over its foot (profile) | 0 | match | sure |
| pinion tip | scaled 98 px = 5.80 (my scan; 5.86 code) | D 5.860 (loop) | +0.06 | match (undimensioned) | likely |
| pinion leaves | none drawn; 14 inferred from 12.6 = (5.04+20.16)/2 | 14, m 0.36, root Ø 3.506, leaf 0.378 on the pitch circle | — | match (inferred) | likely |
| tube Ø (lower) | scaled 63 px = 3.73 less line ≈ 3.6 | r 1.800 | 0 | match | likely |
| groove centre | 6,3 | 6.300 | 0 | match | sure |
| groove radius | "4r" (0,4 r) | r 0.400 half-round | 0 | match | likely |
| step | 10,8 −0,1 | 10.800 | 0 | match (upper limit) | sure |
| square | 2,6 □ r6 | 2.6 across flats, corners turned Ø 3.45 (recorded, from Wempe 3955's photograph) | — | match; departure holds | sure / likely |
| upper part in elevation | scaled 48 px = 2.84 incl. line ≈ 2.7 | 2.6-3.45 depending on view | — | consistent | likely |
| top | 14,3 | crown apex 14.30 (bore edge 14.19, sphere r 3.1) | 0 | match | sure |
| bore | on the 1:80 shank | rSh + 0.01 | — | match | sure |
| shading | — | 384 of 3,880 triangles with vertex normals 60-82° off the face (the lathe part) | — | **ARTIFACT A1** (`r_cn_0`, `r_cn_3`, `r_cnc_1`: the tube's foot on the pinion face and the step at 10.8 shade as fillets) | sure |

---

## changeWheel: Wechselrad kompl. 05 02 02 (`_06`, 1941), wheel 040202-1 (`_07`, 1940)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| z, module | 56, d 20,16 (m 0.36) | 56, m 0.36 | 0 | match | sure |
| tip D | 21,05 ±0,02 (pencil; 21,30 struck) | 21.050 | 0 | match | sure |
| root dg | 19,03 | 19.030 | 0 | match | sure |
| tooth on the pitch circle | f 0,52; pencil "Zahnstärke 0,55-0,56" | 0.555 (loop) | 0 | match (pencil) | likely |
| wheel thickness | fertig 1,0; 1 on 05 02 02 | 1.000 | 0 | match | sure |
| centre hole | 4,2 +0/−0,1 | r 2.100, a **24-gon** (gear(), train.js:38 `curveSegments:24`) | 0 | match; see A2 | sure |
| plain disc | no spokes | plain | — | match | sure |
| pipe overall | 7 −0,1 | 6.900 | −0.1 | match (lower limit) | sure |
| pipe Ø | 3,05 −0,04 | r 1.525 | 0 | match | sure |
| foot under the wheel | 0,9 +0,2 | 1.000 | +0.1 | within tolerance | sure |
| top to the pinion's lower face (the collar top) | 4,3 +0,1 (read on the section: its lower arrow on the collar or pinion line at y 310, the wheel face at 337) | 6.9 − 2.6 = 4.300 | 0 | match | sure |
| collar over the wheel | scaled 0.67 high, Ø 5.5-5.7 | 0.6 high, Ø 5.5 | ≈0.07 | match (undimensioned) | likely |
| pinion length | 2,5 (05 02_1); scaled 2.62 on 05 02 02 | 2.500 | — | match | sure |
| pinion tip | scaled 7.36 on 05 02 02 | 6.9 (Wempe 3955's photograph, recorded: Readings corrected 806, Estimated) | −0.46 | recorded departure; holds (7.3 would touch the hour wheel's roots: 12.6 − 3.65 − 8.945 = 0.005) | likely |
| pinion leaves | 18 inferred | 18, m 0.35, tip 6.9, root 5.4, 0.55 on the pitch | — | match (inferred) | likely |
| bore | scaled 1.50 | r 0.760 (Ø 1.52) on the stud Ø 1.5 | — | match | likely |
| riveting | "vernietet": the section shows a small chamfer at the wheel's hole on its underside, the pipe flared into it | square | — | **missing** (minor, M2) | unsure |
| shading | — | pipe (lathe): 849 of 960 triangles over 20° off, 382 over 60° | — | **ARTIFACT A1** (`r_ch_2.png`: the pipe's end face a rounded bead with a sawtooth bright ring at the bore; `r_ch_3`, `r_chb_1`: the foot's step a soft fillet) | sure |

---

## hourWheel: Stundenrad kompl. 05 02 03 (`_08`, 1940), wheel 040204-1 (`_09`, 1940)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| z, module | 54, d 18,90 (m 0.35) | 54, m 0.35 | 0 | match | sure |
| tip D | 19,7 (pencil; 20,0 struck) | 19.699 | 0 | match | sure |
| root dg | 17,89 | 17.890 | 0 | match | sure |
| tooth on the pitch circle | f 0,5 | 0.500 | 0 | match | sure |
| thickness | 1 −0,1 (05 02 03); pencil "1,05 −0,03 gedreht" on 040204-1 | 1.000 | — | between the two | likely |
| centre hole | 6 +0/−0,1 | r 3.000, a 24-gon | 0 | match; see A2 | sure |
| **hole's riveting sink** | 040204-1's edge view: "0,4" and "30°" at the hole, a sink 0.4 deep on one face whose end circle shows as a line through the hole (`crops/a09_edge.png`) | none: a straight bore | — | **MISSING (M1)** | likely |
| overall | 8,2 −0,1 | 8.200 (y 3.265-11.465) | 0 | match | sure |
| collar top from the wheel's lower face | 5,2 −0,1 | 3.585 (collar top 0.15 under the dial, in the middle of its 0.3 of play) | −1.6 | recorded departure (README Estimated, dial.js:66-73). Holds: 5.2 puts the Ø 8 collar 1.47 into the dial's Ø 6 hole | sure |
| collar Ø | scaled 136-137 px = 8.2-8.25 (my row scan) | 8.0 (Wempe 3955's photograph 8.01) | −0.2 | undimensioned; within reading | likely |
| seat | 4,4 r6 at Kegel 1:70 | r 2.2 at the top, widening 1:70 down (2.233 at the collar) | 0 | match | sure |
| bore | scaled 3.3-3.6 | r 1.810 (Ø 3.62 on the tube's 3.6) | — | match | likely |
| shading | — | pipe: 896 of 1,024 triangles off, 384 over 60° | — | **ARTIFACT A1, the worst in the batch**: the Ø 8 collar renders as a mushroom dome, its top and edge as one round (`r_hw_2.png`, `r_hw_3.png`, `sheet_hw.png`); the foot face a sunk-looking ring (`r_hwb_2.png`) | sure |

---

## udWheel and udPinion: Auf u. Abrad kompl. 05 02 04 (`_10`), wheel 05 02 04-1 (`_11`), pinion 05 02 00-5 (no sheet)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| z | 120 | 120 | 0 | match | sure |
| d | 33,454 | m 0.2788 | 0 | match | sure |
| tip D | 34,33 | 34.328 | 0 | match | sure |
| root dg | 32,57 | 32.570 | 0 | match | sure |
| l (tooth) | 0,40 | 0.400 | 0 | match | sure |
| Radstärke | 1,0 (1 −0,1 on 05 02 04) | 1.000 | 0 | match | sure |
| spokes | 5 at 72°, 1,7 −0,2 | 5, straight-edged, 1.60 (1.637 at r 5.3, 1.595 at r 14.1) | — | within tolerance | sure |
| hub Ø | 10,5 −0,2 | 10.4 | −0.1 | within tolerance | sure |
| rim inside | 28,2 +0,2 | 28.3 | +0.1 | within tolerance | sure |
| hole | 5,2 H7 | r 2.600 | 0 | match | sure |
| outside blank | 35,3 −0,2 | 34.33 cut | — | n/a (blank) | sure |
| pipe below the wheel | 5,2 | 0 to 5.200 | 0 | match | sure |
| rivet flange | 0,7 high, Ø scaled 135 px = 7.75 (my scan) | 0.7 high, Ø 7.70 | −0.05 | match (README says the sheet scales 7.4; my row scan reads 7.75, which agrees with the photograph) | likely |
| step | scaled 49 px = 2.8 | Ø 2.8, to 7.6 | 0 | match | likely |
| hand seat | 2,2 r6 × 1,4 | Ø 2.2, 7.6 to 9.0 | 0 | match | sure |
| top to the wheel's upper face | 2,8 | 9.0 − 6.2 = 2.8 | 0 | match | sure |
| pipe Ø below | scaled 59 px = 3.4 | 3.4 | 0 | match | likely |
| bore | scaled 1.43-1.65 | 1.52 | — | match | likely |
| wheel to the dial | 0,8 (05 02_1) | 7.0 − 6.2 = 0.8 | 0 | match | likely |
| the pipe's top over the stud's end | 05 08 02's 12,3 | 0.05 | — | match | sure |
| pinion | 12 leaves (inferred); 05 02_1 gives 3 long, 0,3 under the dial, on "1,6 Festsitz" | 12, m 0.2788, tip 4.0, root 2.4, 3.000 long (3.7-6.7 over PPT), 0.3 under the dial, bore 1.6 | 0 | match (recorded estimates) | likely |
| meshing | 18,4 | (3.346 + 33.454)/2 = 18.4; tip clearance 0.115 | — | match | sure |
| 6MX spokes | — | 1.865 to 1.176 taper (Kirov photographs, recorded) | — | recorded | likely |
| shading | — | hub (lathe): 771 of 1,152 triangles off | — | **ARTIFACT A1**: the riveted flange domed, the shoulders filleted (`r_ud_2.png`, `r_ud_3.png`) | sure |

---

## hands: minute 05 02 00-1 (`_02`), hour 05 02 00-2 (`_03`), up-and-down 05 02 00-3 (`_04`), seconds 05 02 01-1 (`_05`), collet 05 02 01-2 (no sheet)

Widths are measured across each hand at the sheet's stations along its own axis (`hands9.py`).

### Minute hand 05 02 00-1

| feature | sheet | model | verdict |
|---|---|---|---|
| length | 46 | 46.000 | match, sure |
| width at the boss | 1,2 | 1.200 | match, sure |
| width at 13 | 2 | 2.000 | match, sure |
| width at 25 | 0,7 | 0.700 | match, sure |
| width at 36 | 1,7 | 1.700 | match, sure |
| width at the tip | 0,4 (square end) | 0.4 (hw 0.2) | match, sure |
| boss | 2 overall, 1,2 from the top to the flange's underside, collar Ø 4,2, flange Ø 6 | 2.0, 1.2, Ø 4.2, Ø 6.0 | match, sure |
| flange top edge rounded | drawn about 0.45 | r 0.4 | match, likely |
| hole | 2,6 □ H7, Kegel 1:70 | square 2.6 + 0.01, widening 1:70 | match, sure |
| blade thickness | 0,7 / 0,6 / 0,4 | 0.70 to 21, 0.606 at 36, 0.444 at 44 to 0.4 at 46 | match, sure |
| blade top | 0.5 under the flange's top; underside flush | same | match, sure |

### Hour hand 05 02 00-2

| feature | sheet | model | verdict |
|---|---|---|---|
| length | 35 | 35.001 | match |
| width at the boss | 1,7 | 1.756 | match (±0.1) |
| width at 9 | 2,4 | 2.400 | match |
| neck at 19,5 | 0,8 | 0.800 | match |
| ball | Ø 5,2 at 22,5 | 5.200 at 22.5 | match |
| width at 30 | 0,6 | 0.600 | match |
| width at the tip | 0,5 | 0.501 | match |
| boss | 3,1 overall, flange 0,8 bevelled from Ø 8,2 to Ø 6,8 | 3.1, flange 0.8, cone 8.2 to 6.8, wide edge toward the dial (as the side view draws it, `crops/a03_side.png`) | match, sure |
| pipe | Ø 5 −0,2 | 4.8 | within tolerance |
| hole | 4,4 H7, 1:70 | on its seat's 1:70, 0.01 clear | match |
| blade thickness | 0,5 at the root, then 0,6 / 0,4 / 0,7 / 0,6 / 0,3 | 0.506, 0.42 at 19.5, 0.697 at 21, 0.60 at 30, 0.30 at 34.9 | match, sure |

### Up-and-down hand 05 02 00-3

| feature | sheet | model | verdict |
|---|---|---|---|
| boss | Ø 4,4, 1,4 overall, flange 0,5 | the same | match, sure |
| hole | 2,2 H7 | 2.22 | match |
| pipe | Ø 3.0 (scaled) | Ø 3.0, down to the wheel's step through the dial's Ø 3.2 | match, likely |
| blade | 0,9 at the boss, inked to 9,5, fine tip 0,25 | 0.9 to 0.344 at 9.5, tip 0.25 | match |
| length | the plan isn't to scale (9.5 and 11.7 disagree with the boss's 4.4) | 10.2, from Wempe 3955's dial (recorded) | recorded departure; holds, likely |
| thickness | 0,5 / 0,3 | 0.5 to 0.318 at 9.5, 0.3 at the tip | match |
| flange over the dial | 0,2 (05 02_1) | 11.85 − 11.65 = 0.20 | match |

### Seconds hand 05 02 01-1

| feature | sheet | model | verdict |
|---|---|---|---|
| pointer | 19,5 (29,5 − 10), 0,6 at the boss, 0,2 at the tip | 19.5, 0.6, 0.203 | match, sure |
| tail | 10 | 10.0 | match, sure |
| tail arm | 0,3 wide | 0.3 | match, sure |
| drop | 1,7, from 6,5 to 10, round inward, pointed outward | 1.700 at 7.35, 6.5 to 10 | match, sure |
| boss | Ø 3,2, raised Ø 2,5 | Ø 3.2 × 0.4 plus Ø 2.5 × 0.2 = 0.6 (the side view reads about 0.6 less its line weight, `crops/a05_side2.png`) | match, likely |
| hole | 1,2 +0,05 | 1.2 | match |
| thickness | drop 0,5, arm 0,3, pointer 0,4 to 0,3 | 0.50, 0.30, 0.40 to 0.301 | match, sure |
| collet | no sheet | Ø 1.5 × 4.6, end Ø 1.2 (recorded estimate) | recorded |

### Heights

The seconds hand is 1.9 over the dial, the hour hand's blade 0.125 over the seconds post, and the minute hand 0.5 over the hour boss. These are 2 mm over 05 02_1's, on the 1946 seconds post. This is recorded in README 147 and 675 and in the Estimated section; the reason holds (the post is 14.275 in every version). The minute hand's top is 2.65 under the glass at PPT + 17.

### Shading

The bosses' lathe pieces have 576-864 triangles more than 20° off their faces in every hand.

**ARTIFACT A1:**
- the hour hand's pipe and flange render as a donut;
- the up-and-down boss renders as a cushion, and its pipe's foot as a ball (`r_hd_4`);
- the seconds boss and the collet's end show a jagged bright ring (`r_hd_5`, `r_hd_6`);
- the minute hand's square-cornered collar and flange underside are also smoothed. Its r 0.4 round is meant smooth.

The blades (solidGeo) are clean.

---

## dial: Zifferblatt 127-556.04-162 / 05 02 00-4 (`_12`), Lange 1453/A (`_13`)

| feature | sheet | model (`dial9.py` loops) | diff | verdict | sure |
|---|---|---|---|---|---|
| Ø | fertig 103,6 −0,1 | 103.550 (720-gon) | −0.05 | within tolerance | sure |
| thickness | Stärke 1,3 (pencil 1,2; "Eisenblech 1,3") | 1.300 | 0 | match | likely |
| centre hole | 6 (05 02_1 "Loch 6,0") | 6.000 | 0 | match | sure |
| up-and-down hole | 3,2 | 3.200 at (0, −23) | 0 | match | sure |
| seconds hole | 1,7 | 1.700 at (0, +23) | 0 | match | sure |
| sub-dial centres | 23 ±0,03 | 23.000 both | 0 | match | sure |
| hole circle | 101 | r 50.500 | 0 | match | sure |
| screw holes | 1,1 at 354° (the 6°), about 120.6° and 240.2° | Ø 1.1 at 354.0°, 120.0° and 240.0° | −0.6° | match (the scaled angles' 0.2-0.6° is within scaling at 4.9 px/mm) | likely |
| screw sinks | Ø 1,8 H7, "Senkung 1,0 tief" (flat: an H7 diameter) | Ø 1.8 counterbore, floor at 1.0 deep (10.65) | 0 | match | likely |
| pin hole | Ø 1 at 6° | Ø 1.0 at 6.0° | 0 | match | sure |
| small hole | Ø 1 at 185.7° (I found it: `crops/a12_bot.png`) | Ø 1.0 at 185.7° | 0 | match | sure |
| "1,1" at the 4 o'clock hole | the hole's Ø, or its centre 1.1 from the edge (that would be r 50.7) | taken as the hole's Ø | — | unsure, as recorded | unsure |
| minute track | Ø 85 / 90 | 85.44 / 89.94 (printing, from the photograph) | +0.4 / −0.06 | match | sure |
| up-and-down sub-dial | 26; band 15/18; 0-56 in 7 × 45° with a 45° gap at the top (`crops/a12_ud.png`) | 26.08, 15.19/18.02, ua(h) = 22.5 + 45h/8; the hand at 0 at 22.5°, running clockwise | — | match | sure |
| seconds sub-dial | 37/33/23 | 37.08/33.06/23.01 | — | match | sure |
| hour numerals | 9 high, centres r 37-38 | 8.85-9.30 high, centres r 35.9-37.7 (dialface.js bounds) | — | match | sure |
| up-and-down figures | 2 high | about 2.0-2.2 | — | match | likely |
| seconds figures | 2,7 high | the upright 60 is 3.3 | +0.6 | differs: Wempe 3955's printing (recorded: "the printing is the dial as made") | likely |
| serial | 2367, 2,2 high | 3955, 2.65 high | — | recorded (photograph) | sure |
| anchor | about 6.9 high, 29.6 below the centre | 7.1, 29.1 | — | match | likely |
| stroke widths | 0,3; hour blocks 1,5; seconds 0,2 / 0,5 | 0.42 / 1.68 / 0.39 / 0.67 (photograph) | — | recorded departure (README 150) | sure |
| "Made in Germany" | drawn at 7-5 | absent (not on 3955) | — | recorded | sure |
| screws | WN-10, M1 (estimated) | head Ø 1.7 × 0.8, 0.1 under the face | — | recorded estimate | — |
| dial pin | Ø 1 | Ø 0.98 in the dial, Ø 1.09 in the ring, 3.7 deep (recorded) | — | match | likely |
| shading | — | the disc is clean (solidGeo); the pin (lathe, 20 segments) has 80 of 160 triangles off by up to 89° | — | **ARTIFACT A1**: the pin's flat foot renders as a faceted ball (`r_dl_5.png`) | sure |
| Lange 1453/A disc | Außen Ø 103; Materialstärke 1,5; Sekunden-Loch 2,2 (1,5 struck); Mittel-Loch 6,0 (4,5 struck); Auf und Ab 3,2; centres 23 (struck, pencil 22,5 / 24?); **no screw holes drawn** | the Wempe disc (Ø 103.55 × 1.3, seconds hole 1.7, Wempe's screws) | −0.55 / +0.2 / +0.5 | **WRONG, unrecorded (W1)**: README 151 says "the sheet (05 02 00-4) is one dial for both makers", but 1453/A is Lange's own sheet with other figures | sure (figures) |

---

## Studs 05 02 00-6 / -7 in bushes 05 08 02-2 (05 08 02, `05-08/_32-2.jpg`; 05 02_1)

| feature | sheet | model (train.js:321-330) | verdict | sure |
|---|---|---|---|---|
| long stud | 12,3 from its tip to the plate's inner face (the extension line on the inner face, `crops/s32_studs.png`) | 12.3 from y 0 | match | sure |
| short stud | 6,8 from its tip to the dial face | PPT + 6.8 | match | sure |
| ends | domed (05 02_1, 05 08 02) | dome rising 0.3 | match | likely |
| Ø | 1.52 scaled (05 02_1) | 1.5 | match | likely |
| 05 02_1's 12,7 | the 1941 stud | 12.3 (05 08 02, later) | the later sheet taken | sure |

---

## Ranked findings

### 1. A1, ARTIFACT: raw THREE.LatheGeometry smoothing on every turned piece in dial.js

**Where.** The helper `lathe` (dial.js:22) returns `new THREE.LatheGeometry(...)`. r128 computes its normals with computeVertexNormals over the shared profile vertices, so every square corner of a profile is averaged to about 45°. `nrm9.py` measured vertex normals 60-91° off their faces on every lathe piece.

The pieces and their lines:
- the cannon tube's body (:273);
- the change wheel's pipe (:282);
- the hour wheel's pipe and collar (:289, the worst);
- the up-and-down wheel's hub (:294);
- the minute hand's flange ring (:317);
- the hour hand's boss (:322);
- the up-and-down hand's boss (:327);
- the seconds hand's boss (:333);
- the seconds collet (:336);
- the dial pin (:370).

These are fused into the hands' and the cannon's single meshes, and keep the bad normals there.

**What it looks like:**
- the hour wheel's flat-topped Ø 8 collar reads as a dome (`r_hw_2.png`, `r_hw_3.png`, `r_iso_hourWheel.png`);
- the change pipe's end face is a rounded bead with a sawtooth ring (`r_ch_2.png`);
- the up-and-down flange is domed (`r_ud_2.png`);
- the hand bosses look like donuts (`r_hd_3.png`, `r_hd_4.png`);
- the jagged rings on the collet ends (`r_hd_6.png`);
- the dial pin's foot is a ball (`r_dl_5.png`);
- the cannon's shoulders read as fillets (`r_cnc_1.png`).

**Correction.** Build these with flat-shaded faces per profile segment: split the profile at every corner, as batch 7 and batch 8 ask for `turned`/`ringT`/`bushGeo`. Two ways:
- a lathe that duplicates each corner vertex, with each segment's normal its own, smooth only around the axis;
- or convert to non-indexed, then recompute the normals per profile segment from the segment's direction.

Keep smoothing only along the round edge that is meant to be round: the minute hand's r 0.4, and the cannon's crown and groove. The same fix covers every `lathe` in dial.js (one helper).

### 2. W1, WRONG (unrecorded): the Lange dial variant keeps the Wempe disc

**What the sheet gives.** 1453/A (`_13`): Außen Ø 103, Materialstärke 1,5, Sekunden-Loch 2,2, Mittel 6,0, Auf und Ab 3,2, and no screw holes on its plan.

**What the model does.** With `#dial=lange`, the disc stays Ø 103.55 × 1.3 with the Ø 1.7 seconds hole and Wempe's three sunk screws (dial.js:347-366; `R.setDial` swaps only the texture). README 151 states the sheet 05 02 00-4 is "one dial for both makers", which 1453/A contradicts.

**Correction.**
- Either record it in the README (Estimated or Readings corrected): the Lange variant is a printing variant only, and 1453/A's disc is Ø 103 × 1.5 with a Ø 2.2 seconds hole.
- Or build a Lange disc for the variant: r 51.5, DT 1.5 (the face 0.2 higher, leaving the seconds hand 1.7 over it), the seconds hole r 1.1, the centre and up-and-down holes unchanged. How 1453/A's dial was held isn't drawn, so keep the screws as an estimate and say so.

Check the Lange 5177 photograph (`1_Lange_5177_Z.jpg`) for screw heads before choosing.

### 3. M1, MISSING (minor): the hour wheel's riveting sink

**What the sheet gives.** 040204-1's edge view (`_09`, `crops/a09_edge.png`) gives "0,4" and "30°" at the Ø 6 hole: a chamfer or sink 0.4 deep on one face. Its end circle is drawn as a line through the hole 0.4 from that face. It is the seat for 05 02 03's "vernietet" foot.

**What the model does.** A plain Ø 6.0 bore (dial.js:290, gear() with `bore:c.rs`), and the pipe's foot flush and square (dial.js:289).

**Correction.** Sink the wheel's hole on its lower face, the face the rivet is closed on (05 02 03 draws the pipe's foot flush with the wheel's lower face). Make it a 30° countersink (half-angle 30° to the axis is the usual riveting sink) 0.4 deep, Ø 6.0 + 2 × 0.4 × tan 30° = Ø 6.46 at the face. Flare the pipe's foot into it.

Which way the 30° is measured isn't dimensioned, so record it as likely.

### 4. M2, MISSING (minor, unsure): the change wheel's rivet

05 02 02's section (`crops/a06_sec.png`) shows the wheel's hole relieved on its underside where the pipe is "vernietet", as the hour wheel's. The model is square (dial.js:282-283). Treat it as for M1, if a closer crop confirms it. At 5:1 the relief is about 2 px, so it stays unsure.

### 5. A2, ARTIFACT (small): wheel bores as 24-gons under 48- and 64-segment pipes

gear()'s holes are polygonised at `curveSegments:24` (train.js:38). The wheels' bores (change wheel r 2.1, hour wheel r 3.0, cannon pinion, up-and-down pinion) are therefore 24-gons. The pipes' seats are lathes of 48 segments (change wheel) and 64 (hour wheel).

The pipes' vertices stand 0.018 mm (change wheel) and 0.026 mm (hour wheel) into the bores' flats. The pipe's step faces are also coplanar with the wheel's faces there.

This is not visible in my renders (`r_hwb_2`, `r_chb_1`), but it is an overlap fine.py's 0.05 grid can't see.

**Correction.** Pass a bore segment count matching the seat: `curveSegments` 48/64 for the bore, or a `boreSeg` option.

### 6. Recorded departures re-judged: all hold

- the hour wheel's collar 3.585 for 5.2 −0,1 (the collar would sit 1.47 into the dial's Ø 6 hole);
- the hands 2 mm over 05 02_1 (the 1946 seconds post);
- the up-and-down hand 10.2 (the plan isn't to scale);
- the change pinion's tip 6.9 against the scaled 7.36 (7.3 leaves 0.005 to the hour wheel's roots);
- the cannon square's corners Ø 3.45;
- the dial's printing from Wempe 3955 (stroke widths, serial, seconds figures 3.3 for 2.7, no "Made in Germany");
- the up-and-down pinion of steel.

The README's "7.4 scaled" for the up-and-down flange should read about 7.75: my row scan of 05 02 04 at 17.5 px/mm reads it, and it agrees with the photograph's 7.71. That is a wording correction only (README Estimated line 677, dial.js:77).

### 7. Not built (recorded)

05 02_1's hand-setting pinion (Zeigerstelltrieb, 05 33) and its 1941 arrangement: the minute hand held by a nut or collet, the centre arbor's nut under the plate with "0,1 Luft", and the cannon bored 2,3. The `first` version uses the 1943 tube (05 05 03) and the 1946 post like the others. No sheet of the 1941 cannon exists, so this is consistent with the README.

---

## Sheets reviewed

- 05-02/Wempe_05-02_01.jpg — So 127 556 04 / 0402 Zeigerwerk, Auf u. Ab gesamt — the centre distances 12,96 / 12,6 / 23 / 18,4; the plate-to-dial 7 and dial 1,3; 0,2 Luft at the change wheel; the change pinion 2,5; the hour wheel's 0,3 to the dial; Loch 6,0 and 3,2; the up-and-down wheel 0,8 under the dial and the hand 0,2 over it; the up-and-down pinion 3 long, 0,3 under the dial, on "1,6 Festsitz"; the studs' 12,7 (1941) and domed ends; the hand heights (recorded 2 mm lower); the 1941 cannon, nut and hand-setting pinion
- 05-02/Wempe_05-02_02.jpg — 05 02 00-1 Minutenzeiger — the length 46; widths 1,2 / 2 / 0,7 / 1,7 / 0,4 at the boss, 13, 25, 36 and 46; the boss 2 and 1,2, Ø 6 and Ø 4,2; the square hole 2,6 □ H7, Kegel 1:70; the flange's rounded edge; thicknesses 0,7 / 0,6 / 0,4; the blade flush underneath and 0.5 under the flange's top
- 05-02/Wempe_05-02_03.jpg — 05 02 00-2 Stundenzeiger — the length 35; widths 1,7 / 2,4 / 0,8 / ball 5,2 at 22,5 / 0,6 / 0,5; the boss 3,1, the flange 0,8 bevelled 8,2 to 6,8 (which way), the pipe Ø 5 −0,2, the hole 4,4 H7 1:70; the blade thicknesses
- 05-02/Wempe_05-02_04.jpg — 05 02 00-3 Auf u. Abzeiger — the boss 4,4 × 1,4, the flange 0,5, the hole 2,2 H7; the widths 0,9 and 0,25; the 9,5 and 11,7 (the plan not to scale); thicknesses 0,5 and 0,3
- 05-02/Wempe_05-02_05.jpg — 05 02 01-1 Sekundenzeiger — 29,5, 10, 6,5, 1,7, 0,3, 0,6, 0,2; the boss 3,2 and the raised 2,5; the hole 1,2 +0,05; the side view's thicknesses 0,5 / 0,3 / 0,4 / 0,3 and the boss height
- 05-02/Wempe_05-02_06.jpg — 05 02 02 Wechselrad kompl. — 7 −0,1, 4,3 +0,1 (to the pinion's lower face), 1, 0,9 +0,2, 3,05 −0,04; the scaled collar, pinion and bore; the rivet's relief
- 05-02/Wempe_05-02_07.jpg — 127-556.04-004 / 040202-1 Wechselrad — z 56, D 21,05, d 20,16, dg 19,03, f 0,52 with the pencil 0,55-0,56, the hole 4,2, fertig 1,0, a plain disc
- 05-02/Wempe_05-02_08.jpg — 05 02 03 Stundenrad kompl. — 8,2 −0,1, 5,2 −0,1 (the collar), 1 −0,1, 4,4 r6 at Kegel 1:70; the collar Ø and bore by row scans
- 05-02/Wempe_05-02_09.jpg — 127-556.04-008 / 040204-1 Stundenrad — z 54, D 19,7, d 18,90, dg 17,89, f 0,5, the hole 6, 1,05 / 1,0; the edge view's 0,4 and 30° riveting sink (missing)
- 05-02/Wempe_05-02_10.jpg — 05 02 04 Auf u. Abrad kompl. — 2,2 r6, 1,4, 2,8, 0,7, 1 −0,1, 5,2; the flange, step, pipe and bore by row scans
- 05-02/Wempe_05-02_11.jpg — 05 02 04-1 Auf u. Abrad — z 120, D 34,33, d 33,454, dg 32,57, l 0,40, 5 spokes at 72° 1,7 −0,2, the hub 10,5 −0,2, the rim 28,2 +0,2, the hole 5,2 H7, Radstärke 1,0
- 05-02/Wempe_05-02_12.jpg — 127-556.04-162 / 05 02 00-4 Zifferblatt — 103,6 −0,1, 1,3, the holes 6 / 3,2 / 1,7; 23 ±0,03; Ø 101 with five holes at 354°, 6°, about 120°, about 240° and 185.7°; the sink Ø 1,8 H7 1,0 deep; the printing's layout (85/90, 26 with 15/18 and 45° divisions, 37/33/23, the numerals 9, the figures 2 and 2,7, the serial, the anchor)
- 05-02/Wempe_05-02_13.jpg — 1453/A Lange B-Chronometer Zifferblatt — Ø 103, 1,5 thick, the holes 3,2 / 6,0 / 2,2, 23 / 23, the sub-dials 26 and 37, no screw holes (W1)
- 05-05/Wempe_05-05_08.jpg — 050503 Minutenrad kompl. — the cannon tube 05 05 03-3: 2,6 □ r6, 4r, 6,3, 10,8 −0,1, 14,3, the pinion block 2,4 and its scaled Ø, the tube's and upper part's scaled widths
- 05-08/Wempe_05-08_32-2.jpg — 05 08 02 Unterplatte kompl. — the studs' 12,3 (to the inner face) and 6,8 (to the dial face), the bushes 05 08 02-2, the domed ends
- Wempe_Einheitschronometer.jpg — the coloured section — the motion work's order and names (Minutenrohr 05 05 03-3, Stundenbutzen 05 02 03-2, Wechseltrieb 05 02 02-3, Wechselbutzen 05 02 02-2, Anrichtstift kurz 05 02 00-7, Zeigerfutter 05 02 01-2, Auf u. Abtrieb 05 02 00-5); heights pictorial (the collar to the dial, the hands on the 1940 post)

## Sheets not reviewed

- 05-33/Wempe_05-33.jpg (Zeigerstellung kompl., 05 33): the hand setting is not built (README Unresolved). Only its pinion appears on 05 02_1, compared there.
- 05-38/Wempe_05-38.jpg (Sekundenkontakt): not built, and not one of this batch's parts.
- No sheet exists in the drawings folder for the cannon tube alone (05 05 03-3), the change pinion 05 02 02-3, the pipes 05 02 02-2, 05 02 03-2 and 05 02 04-2, the up-and-down pinion 05 02 00-5, the collet 05 02 01-2, the studs 05 02 00-6/-7 or the bush 05 08 02-2. I searched `Missing_details.md` and the transcriptions.
- `References/wempe/drawings/Index.md` lists a "Cannon Pinion 05 02 03-1, z 14, m 0.45" and similar. That table disagrees with every sheet (05 02 03-1 is the hour wheel, z 54, m 0.35) and is not a drawing, so it was not used.
