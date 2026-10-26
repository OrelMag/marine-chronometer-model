# Batch 7: the barrel group against its sheets (26 October 2026)

I worked read-only in the `claude/wempe-artifacts` worktree, at HEAD 6a3bdc15. Nothing in the repository was edited.

**How I measured.**
- **The solids.** `b7/dump7.py` dumps every mesh of `barrel`, `barrelArbor`, `setupRatchet`, `mainspring`, `chain` and `band` from the page (`?snap&qa`) in all five versions, in the movement frame, with vertex normals. It forces the part's root visible (the mainspring is built and shown in the default view, so nothing hidden was missed) and freezes the state as isolate.py does (n 2.5). The output is `d7_<rev>.json`, plus `d7_last_band.json` with the band connector.
- **The geometry analysis** (`b7/g7.py`):
  - face levels with their radius ranges about the barrel's axis BX (24.784, −6.0);
  - cylinders and cones;
  - open edges (none anywhere);
  - each triangle's vertex normals against its face normal.
- **Renders.** `b7/render.py` uses isolate.py's FREEZE and KEEP (GPU, Edges on). I also ran `isolate.py barrel` and `barrelArbor` with `--ref` against 05 07 01 and 05 07 02 (`r_iso_barrel.png`, `r_iso_barrelArbor.png`).
- **Sheet crops.** Crops of every view are in `b7/crops/`, enlarged 2.2× to 12×. I took ASCII pixel dumps of the lid region on 05 07 01, the drum's seat on 05 07 01-1, and the 9 o'clock slot in 05 07 01-1's plan, and a column scan of 05 07 02's side view (9.70 px/mm by the core's Ø 13.3).
- **Hook overlays.** The chain's and the band's hook outlines, taken from the code's own points, are drawn over the sheets at their scales: `ov_chain.png` (17.1 px/mm) and `ov_band.png` (34.6 px/mm).

Every path below is under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b7\`.

**Versions.**
- `last` and `1943` are identical for every part here.
- `first`, `3955` and `6mx` share the 1941 barrel (ring, lid on the plate side, bottom), the 1941 arbor and the same mainspring, lowered 0.44.
- The arbor's square differs: `first` and `3955` end it at −35.4 with the point at −37.32; `6mx` ends it at −36.6 with the point at −38.5.
- The set-up ratchet's turned recess is on `3955` and `6mx` only.
- The chain and the band are the same in every version.

Coordinates are y up toward the dial. The levels below (last):

| name | y | what it is |
|---|---|---|
| BB | −3.65 | the drum bottom's outer face, toward the pillar plate |
| BI | −4.90 | the bottom's inner face |
| BBF | −6.75 | the drum boss's face |
| BR | −21.73 | the rim |
| BLT | −21.13 | the lid's outer face |
| BLU | −19.83 | the lid's underside |
| BLF | −17.83 | the lid boss's face |
| BA0, BA1 | −0.03, −22.32 | the arbor's shoulders |

---

## barrel, drum 05 07 01-1 Federhaustrommel (`_06.jpg`, 2:1, 1947, rev. a 11.3.48 and b 20.4.48), with 05 07 01 (`_04.jpg`) and the blank R 05 07 01-1 (`_05.jpg`)

| feature | sheet | model (how measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| outside Ø | 41,6 −0,1 | r 20.800 (cylinder) | 0 | match (upper limit) | sure |
| inside Ø | 38,5 +0,1 | r 19.250 | 0 | match (lower limit) | sure |
| overall height | 18,1 −0,15 | 18.08 (BB to BR) | −0.02 | within tolerance | sure |
| bottom | 1,25 −0,1 | 1.25 | 0 | match | sure |
| boss face | 3,1 −0,1 from the outside, Ø 8 | y −6.75, r 4.0 | 0 | match | sure |
| boss cone | Ø 12 at the bottom's inner face to Ø 8, about 45° (scaled 37° on the section) | r 6.0 at BI to r 4.0 over 1.85: 42.8° | — | match (undimensioned; the 1,25 and 3,1 fix it) | sure |
| bore | 4,5 +0,1 | r 2.275 (Ø 4.55) | 0 | match | sure |
| 13,8 −0,05 | from the seat's floor to the boss face (18.1 − 1.2 − 3.1) | 20.53 − 6.75 = 13.78 | −0.02 | match | sure |
| lid seat | Ø 39,2 s6 (+0,043/+0,059), (1,2) bracketed | r 19.600, 1.200 deep | s6 not added | match (the press fit drawn as a line, the lid r 19.6 too: coincident faces) | sure |
| seat's 5° | "5°" at the seat's mouth (`crops/a06_seatL.png`). The wall's lean can't be resolved at 2:1 (0.1 mm = 0.7 px). It pairs with the lid's 5° edge (below), the lid "eingesprengt" | a plain cylinder, square mouth | — | **missing** (minor) | likely |
| M2,6 hole | 9,05 ±0,05 from the outer face, 45° from the 9 o'clock slot | Ø 2.64 at y −12.70; 44.7° from the Steg (hook block at 125.26°, Steg at 80.57°) | 0 | match | sure |
| slot at 9 o'clock | 2 +0,05 wide, its end 0,95 +0,15 from the bore (r 18.3), 0,8 +0,05 across, through the bottom (rev. b). The section (`crops/a06_sec.png`) and 05 07 01 (`crops/a04_cornerL.png`) draw it 0.45-0.7 in from the bore; the plan's 0,95 is not to scale (drawn 1.45) | `facePocket` 2.025 wide, r 18.3-19.1, 1.6 deep: through the bottom and 0.35 into the cavity | inside reading | match. The transcription's "0,8 step at the bottom's outer edge" is this slot, as the code reads it | likely |
| inner corner, wall to bottom | small fillet drawn (scaled about 0.25, `crops/a06_R.png`). The blank's inside radius is about 1.5 (R 05 07 01-1), and the floor isn't faced (blank floor 3.0 = 1.25 + 1.75 faced off the outside), so up to about 1.3 of it could remain | square | — | **missing** (minor; it touches the mainspring's lower edge at the wall) | likely |
| outer bottom edge | square on 05 07 01-1. 05 07 01 draws it about R 1.2-1.3, but facing 1.75 off the blank's outside cuts the blank's R 3 away (the corner point lies 2.36 from its centre), so the assembly's round is pictorial | 0.2 × 45° | — | match ("broken") | likely |
| chain slot | 0207's note (cut at the fusee's assembly): 2,5 wide round the rim, 45° lean, 0,85 along the axis | 0.85 between y −18.085 and −17.235, centred −17.66; walls 2.5 apart at the rim, 45° lean (r_blc_2.png) | — | match (its height is the chain's, set by the fusee) | sure |
| the blank R 05 07 01-1 | Ø 43,6 / 38,2 × 20,5, bottom 3, boss Ø 14 at 3,9, (a) Ø 8 recess in the outside | finished part only | — | consistent: every finished size cuts from it. The Ø 8 recess is faced away with the 1.75 | sure |
| shading | — | `ringT` LatheGeometry with facePocket and bore: **12,012 of 22,867 triangles, 3,282 of 7,153 mm² (46 %)**, normals more than 25° off. The worst is the whole bore wall (1,726 mm²) and the bottom's inner face (935 mm²) | — | **ARTIFACT A1**: the inside shades as a bowl, the wall-to-bottom corner looks heavily rounded, the boss is a soft donut (`r_bo_0..4.png`, `r_bo_1.png`); the rim's seat is a rounded bead (`r_blc_0/1.png`); a dark radial **lathe seam** runs across the bottom's outer face (`r_bl_1.png`, `r_bl_3.png`, `r_bo_4.png`); the bore's mouth looks domed and has the seam (`r_blc_3.png`) | sure |

## barrel, lid 05 07 01-2 Federhausdeckel (`_07.jpg`, 2:1, rev. a 20.4.48)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| **where it sits** | 05 07 01's section draws the lid's outer face **flush with the rim** on both sides (pixel rows 207-208 at the left wall, 210-211 at the right, the scan turned 1.6°; `crops/a04_top.png`, `a04_lidR.png`). The coloured section also draws it flush (`crops/col_rimL.png`). The "0,6 −0,1" runs from the extension line of the **arbor's shoulder** (row 201-202, continuous with the shoulder step across the journal) to the lid. The transcription's "lid recess below the rim" is a misreading | the face 0.6 below the rim (BLT = BR + 0.6, fusee.js:55) | +0.6 deep | **WRONG (W1)** | likely to sure |
| check | with the lid flush, the arbor's shoulder (BA1 −22.32) stands 0.59 above it: the 0,6 −0,1 exactly. With the model's lid it stands 1.19 above | — | — | supports W1 | sure |
| check | the hook block (9,05 ±0,05 from the outer face, y −12.70) is centred in the spring's space when the lid is flush ((−4.9 − 20.43)/2 = −12.665, 0.035 off). With the model's lid it is 0.34 off (−12.365) | — | — | supports W1 | sure |
| thickness | 1,3 −0,1 | 1.300 | 0 | match | sure |
| edge | one face edge across the 1,3: Ø 39,2 r6 at the outer face, a 5° (a) lean, Ø 39,39 at the inner face; "Scharfe Kante leicht brechen" (`crops/a07_sec.png`, `a07_edge.png`) | Ø 39.2 over 0.6 in the seat, then **stepped in to Ø 38.4** under it (r 19.2, 0.05 off the bore) | — | **WRONG (W1)**: the step isn't on the sheet. It exists only because the lid is sunk below the seat. The 5° and the edge break are **missing** | sure |
| boss | 3,3 −0,1 from the outer face; face Ø 8 −0,2; cone 45° to Ø 12 −0,2 | 3.3; r 4.0; 45° to r 6.0 | 0 | match | sure |
| bore | 4,5 +0,1 | Ø 4.55 | 0 | match | sure |
| 9 o'clock notch | 2 +0,05 wide, its bottom 18,3 ±0,02 from the centre | 2.025 wide, flat at 18.3 (corners r 18.328) | 0 | match | sure |
| 3 o'clock notch | 2,7 +0,1 wide, 2 +0,2 deep from the 39,39 | 2.75 × 2.1 (to r 17.595) | 0 | match | sure |
| plan's middle circle | the plan draws circles of Ø 12.3, **Ø 6.4** and Ø 4.5 at the centre (`crops/a07_plan.png`). The boss face is 8 on the section; the section draws no counterbore | none | — | unresolved (a drawing slip for the 8, or an undimensioned sink); no change | unsure |
| shading | — | ringT lathe: 348 mm² off by more than 25° (the boss's cone, its bore, the seat step) | — | **ARTIFACT A1** | sure |

## barrel, Steg 05 07 00-1 (no sheet; 0207 part 106) and hook block 05 07 01-3 (no sheet; on 05 07 01, 020701, 0207)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| Steg section | 2 wide, 0,5 (0207's plan); in the bottom's 0,8 slot and the lid's notch | box 2.0 × 0.5, r 18.3-18.8 (corners 18.327-18.827), at 45° back from the rivet | match. 05 07 01's plan (`crops/a04_p9.png`) puts the strip about 0.3 nearer the wall inside the notch. That is within its 2:1 drawing; I suggest no change | likely |
| Steg ends | flush with the bottom's and the lid's outer faces (0207) | −3.65 to −21.13 | match; it moves to the rim with W1 | likely |
| block height | 3,05 −0,1 (05 07 01, rev. a) | 3.05 (−14.225 to −11.175) | match | sure |
| block place | 7,85 ±0,05 from the bottom's inner face (05 07 01); 9,05 ±0,05 from the outside (05 07 01-1) | centre −12.70 (9.05; 7.80 from BI) | match (the sheets themselves differ by 0.05) | sure |
| block depth | wall at the block 2,05 −0,1 (05 07 01), so 0.5 | 0.5 (r 18.75-19.25) | match | sure |
| block length | 0207's flat "6" | 6.0 round the bore (4.6 + 1.4 from the hole) | match | sure |
| block's ends | 05 07 01's section draws the block on the far wall with **convex arc ends** (`crops/a04_sec.png`; about R 2.5 in the wall's development) | radial flat ends | differs, minor (unsure what the arcs mean: perhaps filed round ends) | unsure |
| rivet | "vernieten" through the M2,6 | Ø 2.6 steel cylinder from r 18.75 to 20.75, flush both ends; it reads as a grey disc on the outside (`r_bl_7.png`), which is plausible for a steel rivet in gilt brass | match | likely |
| shading | — | the block slab: 0.71 mm² off; flat elsewhere | clean | sure |

## barrel as first drawn (1941): 0207 (`_01.jpg`, 5:1), 020701 (`_02.jpg`, 2:1), ring 020701-3 (`_10.jpg`, 2:1); versions `first`, `3955`, `6mx`

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| ring | Ø 41,5 / 38,5 × 18 (0207); the ring blank 42 / 38 × 19 (020701-3, before finishing) | r 20.75 / 19.25, −3.7 to −21.7 | match | sure |
| lid / bottom | 1,2 / 1,0 thick, their faces flush with the ring's ends (0207, `crops/a01_bot.png`); 15,8 ±0,1 between | 1.2 / 1.0, flush, 15.8 | match. 020701 draws 1,1 / 1,2 and 15,7/15,8 overwritten; 0207, the assembly, is followed | sure |
| seats | Ø 39,2 (framed, −0,01) with a 5° (framed), 1,5 deep, at **one end** on 020701-3. 0207 draws both members seated through their own thickness, about 0.4 radial | r 19.6 seats, 1.2 and 1.0 deep, both ends, square | the 5° is **missing** (minor); the depth and the two-ended seat follow 0207 (recorded) | likely |
| bosses | lid face 3,1 from its outside, bottom 2,9; Ø 9 with a 22½° cone to Ø 12 (020701); 0207's section scales a 1.0 cylinder of Ø 12.5, then a 23° cone to Ø 8.6 | Ø 12 for 1.28, 22.5° (0.62) to a Ø 9 face; 1.9 inward | match | likely |
| Steg | 2 × 0,5, 0,4 off the bore (r 18.35-18.85), ends through the lid and bottom | so; the slots 2.025 × 0.55 estimated | match (recorded) | likely |
| hook block | 020701: a block "98" 3 high at 7,9 (rev. a, was 9,7), riveted at 45°; 0207 draws it 3 wide along the axis | the 1948 block (3.05 × 6 × 0.5) | recorded ("the hook block and the slots are the later drum's"); holds | likely |
| chain slot | 0207: 0,85 wide, its middle 4.66 (scaled) from the bottom's outer face, 2,5, 45° lean | cut where the chain's barb lies | match (recorded) | sure |
| shading | — | ring 648 mm², lid 318 mm², bottom 293 mm² off by more than 25° | **ARTIFACT A1**: the bosses are soft donuts and the ring's end faces are beads (`r_bfo_0..3.png`, `r_bf_*.png`) | sure |

## barrelArbor: 05 07 02 Federkern kompl. (`_08.jpg`, 2:1, 1943; 05 07 02-1 itself isn't in the set), with 05 07 01 (rev. a adds "05 07 02-1") and the coloured section

The model's profile (fusee.js:851) runs from the ball's tip at +4.95, through the pivot (Ø 2.88) to the shoulder at −0.03, the journal (Ø 4.48) to −6.80, the core (Ø 13.3) from −6.80 to −17.78 with 45° × 2.15 chamfers to Ø 9 faces, the journal to −22.32, and the bridge pivot (Ø 3.88) to −25.70. The square runs to −35.20 and its point to −35.70.

The sheet's column scan of 05 07 02 at 9.70 px/mm gives:
- the ball pivot Ø 2.9, 5.15 long;
- the plate-side journal Ø 5.0, 6.5 long;
- the core 12.4 overall, end faces Ø 10.1, chamfers about 1.0 axial × 1.6 radial;
- the bridge-side journal Ø 4.5, 3.1 long;
- the bridge pivot Ø 3.5, 3.3 long;
- the square 10.0 long;
- 40.4 in all (the dimension says 40,2).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 40,2 (±0,1, "nicht eingetr. Toleranz") | 40.65 | **+0.45** | **WRONG (W3)** | likely |
| ball pivot | 5 to the shoulder, "Kugel poliert"; Ø 3 (0207, 020704-1) | 4.98, Ø 2.88 (the plate's 2.90) | — | match (Ø recorded) | sure |
| shoulders | 22,2 +0,1 framed (020704-1); 05 07 01: the shoulder 0,6 −0,1 above the lid's face | 22.29 | 0 | match; the 0.6 holds only once the lid is flush (W1) | sure |
| journals | Ø 5 ±0,02, Kegel 1:70 (1941); 05 07 02 draws 5.0 and 4.5 | Ø 4.48 straight, both | — | recorded (the 4.5 +0.1 bores); the taper is missing (0.1 over the length) | likely |
| **core** | Ø 13,3; 05 07 01 (rev. a): 45° chamfers, end faces scaled Ø 10.1, chamfers 1.45 radial × 1.27 axial, the cylinder 8.7, the core 11.2. 05 07 02: Ø 10.1 faces, cylinder 10.4, core 12.4. Coloured section: Ø 9.4 faces, chamfers 2.0 × 1.2, core 12.0 (`r_iso_barrelArbor.png`, `crops/a08_side.png`, `crops/col_barrel.png`) | Ø 13.3; end faces **Ø 9.0** (the 1941 core's), 45° × **2.15**, cylinder **6.68**, core **10.98** | cylinder −2.0 to −3.7; core −0.2 to −1.4 | **WRONG (W2)** | likely |
| bridge-side journal | 3,5 on 020704-1 (its "18,7 + 3,5 = 22,2": the journal between the core and the bridge pivot's shoulder, not the bridge pivot as the transcription reads); 05 07 02 draws 3.1 | 4.54 (−17.78 to −22.32) | +1.0 | follows from W1/W2: it becomes 3.9 with the core 11.58 | likely |
| bridge pivot | Ø 4 (020704-1); 05 07 02 draws Ø 3.5 × 3.3 | Ø 3.88 × 3.38 | — | Ø recorded (the bridge's 3.9 ±0.01 hole); the length holds against the drawn 3.3, but see W3 | likely |
| square | 2,7 ±0,02, 1:100, 10 long, "poliert", ends in a point | 2.7 → 2.605 over 9.5, then a 0.5 point | 0 | match | sure |
| hook 05 07 02-2 | a pin Ø 2 (side view: 2.09 wide, standing out about 0.75 drawn). End view (`crops/a08_end.png`): a radial face **15° from the vertical centre line** (the pin's), 0,5 −0,05 high, the land then running down to the core about 9° past the centre line | a Ø 2 pin whose end is one plane: at the face 0.475 over the pin's axis, so **0.545 over the core at its sides**; at the back 0.08 over, not flush; the face is the pin's own flat side (8.3° from the centre line, parallel to the radius) | face 6.7° off; +0.045 over the limit | **differs (W5)** | likely |
| pin's hole | 05 07 02 dashes the hole **right through the core** (both lines run to the far side, no drill point); 0207/020704-1 (1941): Ø 2, 6 deep with a drill point | 6 deep with a point in every version | — | **wrong for last/1943** (hidden inside, minor) | likely |
| 1941 arbor (020704-1) | 44,2 with its centres: 7 + 22,2 + 15; the core 12 with 22½° ends to Ø 9 ("0,8" axial); its hook a block **3 wide × 0,5** over a Ø 2 hole (0207, `crops/a01_core.png`), at the core's middle (its "9,4" runs to the block's far edge: 7.9 + 1.5) | core 11.9 (recorded), 22.5° (0.89 axial) to Ø 9; journal 6.82 + 3.57; square to the tip 15.0; the hook the 1943 Ø 2 ramp pin, at the core's middle | — | match, except the hook's head is 2 against 3 wide (minor, unrecorded) | likely |
| 6mx | Kirov 247's photograph (recorded): its square to −36.6, its point to −38.5 | so | recorded | likely |
| shading | — | the turned profile: 400 mm² off by more than 25° (both chamfers, the journals, the shoulders). The square (fusee.js:855, 863) is a 4-sided CylinderGeometry with smooth radial normals: **101 of 115 mm²** off | **ARTIFACT A1/A2**: the core looks pillowed (`r_ar_0..5.png`, `r_iso_barrelArbor.png`), and the square shades as a round rod with no corner lines (`r_ar_6.png`, `r_arf_1.png`, as batch 5's A7) | sure |

## setupRatchet: 05 07 00-3 Sperrad (`_03.jpg`, 5:1, rev. b 24.11.47; was 05 05 00-1)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | 16 | 16 | 0 | match | sure |
| tips / roots | Ø 14,1 −0,2 / 11,1 −0,2 | 14.0 / 11.0 | −0.1 | within tolerance | sure |
| faces | along a line 1,2 off the radius (10° at the tip: asin(1.2/7.05) = 9.8°) | so | 0 | match | sure |
| backs | arcs Ø 12,5 (r 6.25), centred on the Ø 6,4 circle (r 3.2), convex (`crops/a03_teeth.png`) | r 6.25 through each tip and the next root, centre 3.12 from the axis | 0.08 | match (recorded) | sure |
| thickness | 2,65 −0,1 | 2.65 (−25.72 to −28.37) | 0 | match | sure |
| square hole | 2,7 H7 (+0,009), Kegel 1:100 | 2.714 across flats, straight | +0.005 over H7; no taper (0.027 over 2.65) | minor | sure |
| faces | plain both sides | plain (`last`, `first`, `1943`) | — | match | sure |
| 3955 / 6mx | photographs: a turned recess Ø 8.7 → 7.3 × 0.7 (recorded) | so | — | recorded | likely |
| direction | — | mirrored to fit the click (README, Unresolved) | — | recorded | — |
| render | — | solidGeo, flat normals: each back's 8 flats show as bands (`r_sr_2.png`, `r_sr_4.png`); the 3955 recess's 96 facets (`r_sr3_0.png`) | **ARTIFACT A4** (minor) | sure |

## mainspring: 05 07 00-6 Zugfeder (no sheet; "Zugfeder 15 × 0,37" on 05 06_20, "Zugfeder 15" and "(15,8 ±0,1)" on 0207)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| section | 15 × 0,37 | drawn 14.8 × 0.36, packed at the 0.37 pitch | the 0.36 holds (packing). The **14.8 rests on W1**: the code clears "the 1948 drum's 14.95 inside (its lid 1.3 under the seat)". With the lid flush, the inside is 15.53, and the drawn 15 fits with 0.26 each side | sure |
| place | — | MS0 −4.965, MS1 −19.765, middle −12.365 (0.34 off the hook block); the first versions 0.44 lower in the 15.8 | moves with W1 to the block's middle | sure |
| length, ends, free curve | not on any sheet | 1,240 (fitted to 05 06_20), the Hamilton's eye, two packs | recorded (README Estimated) | — |
| render | — | ribbon with flat normals; 0.17 mm² off | the packs' end faces show a grey stipple of broken Edges lines, one per coil at the 0.37 pitch (`z_ms2.png`, `r_ms_1..3.png`): **ARTIFACT A3** (minor) | sure |

## chain: 05 07 04 Kette (`_14.jpg`, 5:1, 1941)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| pitch | 2,05 (framed) | 2.05 | match | sure |
| plate | 4,05 over the lobes, 2 −0,03 across (framed), figure of eight | lobes r 1.0 at ±1.025, waist 1.41, sides r 0.93 arcs (traced) | match (2.0 is the upper limit) | sure |
| thickness | 0,82 ±0,02 (framed), three layers | 3 × 0.26 at ±0.27: 0.80 | within tolerance (lower limit) | sure |
| rivets | 0,55; stock 0,6 | holes Ø 0.56, rivets Ø 0.55 × 0.80, flush | match | sure |
| length | 780 +3 over the hooks | 375 pitches + 12.5 = 781.25 | within tolerance | sure |
| links | not printed | 375 (188 outer, 187 inner), outer at both ends | match (recorded) | sure |
| top hook | 3,5 wide, 5 to the crown, throat 1,8 from the shank, seat r 0,4 3,5 from the rivet, nose 2 from it, 30° | overlay `ov_chain.png`: on the drawn outline everywhere but the seat, which the model puts at the dimensioned 3.5 (drawn 3.3) | match | sure |
| bottom hook | barb root 3,5, barb 5, tip 7,5, 50°, 1,4 −0,1 reach, r 0,2, 0,6, back 8r, front 20r | overlay: on the drawn outline throughout | match | sure |
| edge view | the hook one solid bar, the full width | body 0.80, eye 0.26 between the end link's plates | match (recorded) | likely |
| material | strip 5 × 0,3 (the plates), 10 × 0,9 (the hooks) | 0.26 plates, 0.80 hooks, to keep the framed 0,82 | recorded | likely |
| render | — | lobes 12-gons (20° segments), flat side walls (`r_ch_0.png`, `r_ch_6.png`: polygonal lobes, banded walls) | **ARTIFACT A4**, recorded on purpose ("375 links drawn in software must stay cheap"); no change asked | sure |

## band: 05 07 03 Schneckenband (`_11.jpg`), hooks 05 07 03-2 Bandhaken rund (`_12.jpg`, 10:1) and 05 07 03-3 Bandhaken f. Trommel (`_13.jpg`, 10:1), 1943; shown with the band connector (`setConn('band')`)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| band | 0,22 +0,03; 730 ±3 from the round hook's shoulder to the drum hook's barb | 0.22 × 0.78 (the width estimated), 727 + 3 | match (recorded) | likely |
| round hook | 0,8 thick; back 6r centred 3,55 left and 2,8 below the slot's top; crown (1,5r) 1 above it; nose r 0,4 with its centre 1,25 left and 0,5 below the slot's top, 1,7 wide, 30°; a slot 0,6 wide, its top r 0,4, the band brazed in it at 5°; right flank 7r, 2,5 long, 1,4 from the slot; "Kante brechen". Its extent scales about **4.3 across × 5.7 along** | a 12-point polygon 3.2 × 2.2, 0.76 thick, no slot, no crown or nose arcs (fusee.js:1012) | **WRONG (W4)**: about half size, a different shape (`ov_band.png` left; red and blue are the two mirror readings) | sure |
| drum hook | 0,8 −0,05 thick; back 10r, front 20r (centres 1,2 below the barb's line); tip r 0,2, 4,5 above the barb's line; barb r 0,2 reaching 1,4 from the slot, 0,3 below the slot's top, 50° flank; 0,9 wide at the barb; bottom 7r; the band at 10° in a slot with an r 0,2 bottom. Its extent scales about **3.3 across × 8.2 along** | a 10-point polygon 7.0 × 1.75, 0.76 thick, no barb, no slot (fusee.js:1013) | **WRONG (W4)** (`ov_band.png` right) | sure |
| render | — | `r_bd_*.png` | the hooks read as thin slivers | sure |

---

## Ranked findings

1. **W1, WRONG: the lid is sunk 0.6 below the rim. The sheets draw it flush.**
   - Sheets:
     - 05 07 01's section draws the lid's outer face on the rim's line at both walls (`crops/a04_top.png`, `a04_lidR.png`; pixel rows 207/210 against the rim's 207/210). Its "0,6 −0,1" runs from the extension of the arbor's shoulder (pixel row 201-202) down to the lid.
     - The coloured section also draws the lid flush (`crops/col_rimL.png`).
     - 05 07 01-2 draws the lid's edge as one 5° face across its whole 1,3 (Ø 39,2 at the outer face to Ø 39,39 at the inner face), with no step.
   - Model (fusee.js:55 `BLT=BR+0.6`; fusee.js:812 the lid ring): the face 0.6 down, the edge Ø 39.2 for 0.6, then stepped to Ø 38.4.
   - Two independent checks agree:
     - With the lid flush, the shoulder stands 0.59 above it (the 0,6 −0,1), against 1.19 now.
     - The hook block (9,05 ±0,05) falls in the spring space's middle to 0.035, against 0.34 now.
   - Correction:
     - `BLT=BR` (the lid 1.3 flush, on a 1.3-deep seat; or BR − 0.1 on the drawn (1,2) seat, 0.1 proud).
     - The lid's ring as `[[2.275,BLT],[19.6,BLT],[19.695,BLT+1.3],[19.6...]]`: one 5° cone from r 19.6 at BLT to r 19.695 at BLU, with no r 19.2 step and a 0.05 edge break. The drum's seat gets its 5° to match.
     - `BLU=BLT+1.3` and `BLF=BLT+3.3` (−18.43).
     - The Steg to BLT.
     - The core per W2.
     - The mainspring 15 high (`MS1=BLU+0.265`, `MS0=BI-0.265`; inside 15.53). Correct the code's comment at fusee.js:903 ("14.95 inside").
   - Rerun:
     - fine.py, solids.py, bom.py, holecheck.py, audit.py, exploded.py and assembly.py (`--model wempe`);
     - `wempe_inertia.py` (the drum's and arbor's inertia);
     - the mainspring tools if they use the drawn height (MC_MS_B 15 is the physics' width: check).
   - Correct the transcription's "lid recess below the rim 0.6 −0.1" to "the arbor's shoulder 0.6 −0.1 above the lid's face".
   - Renders: `r_bl_0.png` (the sunk lid inside the rim), `r_iso_barrel.png` beside 05 07 01.
2. **W2, WRONG: the 1948 arbor's core is too short in its cylinder, with chamfers too big.**
   - Sheets:
     - 05 07 01 (rev. a): 45°, end faces about Ø 10, chamfers about 1.45 × 1.27, cylinder 8.7.
     - 05 07 02: end faces Ø 10.1, chamfers about 1.6 × 1.0, cylinder 10.4, core 12.4.
     - Coloured section: end faces Ø 9.4, core 12.0.
   - Model (fusee.js:851, `[4.5,BC1],[6.65,BC1+2.15],[6.65,BC0-2.15],[4.5,BC0]`): Ø 9 faces (the 1941 core's), 45° × 2.15, cylinder 6.68, core 10.98.
   - Correction: after W1, `BC1=BLF+0.05=-18.38` (core 11.58, endshake 0.05 + 0.06 per 05 07 01's "(a) 0,05 +0,06"). End faces Ø 10, 45° chamfers of 1.65: `[5.0,BC1],[6.65,BC1+1.65],[6.65,BC0-1.65],[5.0,BC0]` (cylinder 8.28, as 05 07 01 draws it).
   - The mainspring's inner coil lies on the cylinder: check the solve's core (MC_MS's core length) and the eye's place.
   - The bridge-side journal becomes 3.94.
   - Render: `r_iso_barrelArbor.png` (sheet left, model right).
3. **W3, WRONG (likely): the 1943/48 arbor is 0.45 too long overall.**
   - 05 07 02 gives 40,2 (±0,1) over all, with its own 5 and 10. That leaves 25.2 between the ball's shoulder and the square, against 22.29 + 3.38 = 25.67.
   - The column scan of the sheet makes the bridge pivot 3.3 and the shoulders 21.96 apart (40.4 in all, scaled).
   - Model: 40.65 (fusee.js:851, the pivot −22.32 to −25.70).
   - Correction:
     - Shorten the bridge pivot to 2.9-3.0, so the square starts at −25.27 to −25.32, 0.35-0.4 inside the bridge's Ø 3.9 hole. The square's 3.82 diagonal clears that hole, and the ratchet seats on the 1:100 taper, not on the bridge's face.
     - Or record the departure with that reason if the stack can't move.
   - The 1941 arbor (020704-1: 7 + 22,2 + 15 = 44,2) agrees with the model.
4. **W4, WRONG: the band's two hooks are placeholders.**
   - Model (fusee.js:1012-1013): `BHT` (12 points, 3.2 × 2.2) and `BHB` (10 points, 7.0 × 1.75).
   - Sheets: the hooks scale about 5.7 × 4.3 (05 07 03-2) and 8.2 × 3.3 (05 07 03-3). Each has a 0,6 slot for the band, crown or tip arcs, a nose or barb, and the dimensioned radii (tables above).
   - Correction: build each outline from its sheet's arcs, as the chain's hooks were built: lines and arcs to the figures in the table above, traced with `mfgfit.py` on `_12.jpg` and `_13.jpg` at 34.6 px/mm where a line isn't dimensioned. Add the brazed band in its slot (5° and 10°), and break the edges.
   - Shown only with the band connector, so the rank is below W1-W3.
   - Overlay: `ov_band.png`.
5. **W5, differs (likely): the barrel arbor's hook ramp.**
   - Model (fusee.js:877): the pin's top is one plane; its face is the pin's flat side (8.3° from the centre line); 0.545 proud at the face's edges (over the 0,5 −0,05) and 0.08 proud at the back.
   - Sheet (05 07 02's end view, `crops/a08_end.png`): a radial face 15° from the centre line, 0,5 −0,05, and a land falling to flush about 9° past the centre line.
   - Correction: make the pin's end follow the core's radius, r = 6.65 + 0.475·(ramp) measured radially (not along the pin's own y), so it is flush at the back. Put the face on the radius at HKA − 15°, as the end view draws it (the raised land then spans about 24°, wider than the Ø 2 pin's own 17°: a head ground to the land). Or record the pin's-width ramp as an estimate.
   - Also for `last`: the pin's hole through the core (05 07 02), not 6 deep.
6. **A1, ARTIFACT: raw LatheGeometry smoothing** (fusee.js:102-103 `turned`/`ringT`; the drum fusee.js:806, the lid :812, the 1941 ring, lid and bottom :825-827, the arbor :851/:854).
   - The drum: 46 % of its area more than 25° off. The inside shades as a bowl, the boss as a donut (`r_bo_1.png`), and the rim's seat as a bead (`r_blc_0.png`). A radial **seam line** runs across the bottom's outer face and the bore (`r_bl_1.png`, `r_blc_3.png`).
   - The lid: 348 mm². The 1941 pieces: donut bosses (`r_bfo_*.png`).
   - The arbor's core: pillowed (`r_ar_*.png`).
   - Fix as batches 2 and 5 propose: corner points repeated, or normals flat per profile segment, with the seam averaged.
7. **A2, ARTIFACT: the arbor's square shades as a cylinder** (fusee.js:855 and 863, `CylinderGeometry(…,4,1)` with smooth normals; 101 of 115 mm²; `r_ar_6.png`). The 4-sided points are smooth-shaded the same way. Fix: flat normals per side (`toNonIndexed()` then `computeVertexNormals()`), as batch 5's A7.
8. **A3, ARTIFACT: the mainspring's packs show a stipple of broken Edges lines** on their end faces, one per coil at the 0.37 pitch (`z_ms2.png`). Fix: leave the ink off between coils (mark the ribbon's side faces so `makeInk` skips edges under the pitch), or draw each pack's outline only.
9. **A4, ARTIFACT (minor):**
   - the set-up ratchet's backs: 8 flat facets each (`r_sr_2.png`);
   - the 3955 recess: 96 facets;
   - the chain's 12-gon lobes and banded walls (recorded on purpose).
10. **Minor, missing:**
    - the drum seat's 5° and the lid edge's 5° with its "Scharfe Kante leicht brechen" (both go in with W1);
    - the drum's inside wall-to-bottom fillet (05 07 01-1 draws about 0.25; the blank could leave up to about 1.3);
    - the 1941 journals' 1:70 taper;
    - the 1941 ring's 5° seat lead;
    - the ratchet's 1:100 taper (and 2.714 against 2,7 H7, +0.005);
    - the 1941 arbor's hook head, 3 wide (0207), against the Ø 2 pin.
11. **Transcription corrections** (05-06-05-07-fusee-barrel.md):
    - 05 07 01's "lid recess below the rim 0,6 −0,1" is the arbor's shoulder above the lid's face (W1).
    - 020704-1's "bridge pivot length 3,5" is the bridge-side journal (18,7 + 3,5 = 22,2).
    - 05 07 01-1's "(a) 0,8 step at the bottom's outer edge" is the Steg's slot through the bottom.
    - 05 07 01-2's 5° is the lid's edge face (39,2 → 39,39 across the 1,3), not a lead-in.

Matches confirmed, apart from the findings above:
- the drum's diameters, height, bottom, boss, bore, M2,6, 13,8 and slot;
- the lid's thickness, boss, bore and both notches;
- the Steg and the hook block (height, place, depth, length);
- the 1941 ring, lid, bottom and bosses;
- the arbor's diameters, shoulders and square;
- the ratchet's teeth, faces, backs and thickness;
- the chain's pitch, plates, thickness, rivets, length and both hooks.

## Sheets reviewed
- 05-07/Wempe_05-07_01.jpg — 0207 (127-556.04 U24) Federhaus, 1941 — the 1941 barrel's ring, lid, bottom, bosses, Steg (106), hook block, chain slot (0,85, 2,5, 45°), the arbor's 9,4/3/0,5 hook block and 6-deep hole, the 22,3/15,8/7,9 stack; against the `first` version
- 05-07/Wempe_05-07_02.jpg — 020701 (127-556.04 U22) Federhaus, 1941 — the 1941 drum sub-assembly (lid 1,1, bottom 1,2, bosses 3 and 3,7, Ø 9/12, 22½°, hook block 98 at 7,9, rev. a 9,7 → 7,9); it differs from 0207, which the model follows
- 05-07/Wempe_05-07_03.jpg — 05 07 00-3 Sperrad, rev. b 24.11.47 — teeth, tips and roots, the 1,2/10° face, the 12,5 back on the 6,4 circle, the thickness, the 2,7 H7 1:100 hole (pixel-level crops of the teeth)
- 05-07/Wempe_05-07_04.jpg — 05 07 01 Federhaus mit Deckel, rev. a 20.4.48 — pixel dumps of the lid against the rim (W1), the 0,6 −0,1 and 0,05 +0,06, the core's 45° chamfers and proportions (W2), the hook block's 3,05/7,85 and its arc ends, the bottom's Steg slot, the plan's 9 and 3 o'clock features, the corner radii
- 05-07/Wempe_05-07_05.jpg — R 05 0701-1 Federhausrohling, rev. a 20.4.48 — the blank's sizes against the finished drum, the corner radii it leaves, the Ø 8 recess (faced away)
- 05-07/Wempe_05-07_06.jpg — 05 07 01-1 Federhaustrommel, 1947, rev. a and b — every figure: Ø 41,6/39,2 s6/38,5, 18,1, 1,25, 3,1, 12/8, 4,5, 13,8, M2,6 at 9,05 and 45°, the 9 o'clock slot (2/0,95/0,8; pixel scan of the plan), the 5° seat (pixel dump), the inner fillet and outer corner
- 05-07/Wempe_05-07_07.jpg — 05 07 01-2 Federhausdeckel, rev. a 20.4.48 — every figure: 39,2 r6, 39,39, the 5° edge face, 1,3, 3,3, 8/12/45°, 4,5, both notches, the plan's Ø 6.4 circle
- 05-07/Wempe_05-07_08.jpg — 05 07 02 Federkern kompl., 1943 — the 40,2, 5 and 10, a column scan of every diameter and length, the end view's hook (0,5 −0,05, 15°), the pin's hole through the core
- 05-07/Wempe_05-07_09.jpg — 020704-1 (127-556.04-093) Federkern, 1941 — every diameter and length (7/22,2/15/44,2, 6,7/15,5/18,7/3,5, 9, 22½°, 0,8, Ø 2 × 6 hole), the tapers; against the `first` arbor
- 05-07/Wempe_05-07_10.jpg — 020701-3 (127-556.04-088) Federhausring, 1941 — the ring blank (42/38 × 19, 39,2 seat 1,5 with 5° at one end) against the `first` ring
- 05-07/Wempe_05-07_11.jpg — 05 07 03 Schneckenband, 1943 — the 730 ±3, the brazed hooks, the band against the model's band
- 05-07/Wempe_05-07_12.jpg — 05 07 03-2 Bandhaken rund, 1943 — every radius and offset, overlaid with the model's `BHT` (W4)
- 05-07/Wempe_05-07_13.jpg — 05 07 03-3 Bandhaken f. Trommel, 1943 — every radius and offset, overlaid with the model's `BHB` (W4)
- 05-07/Wempe_05-07_14.jpg — 05 07 04 Kette, 1941 — pitch, plates, 0,82, rivets, 780 +3, the edge view's layers, both hooks overlaid with the model's `HKT`/`HKB`
- 05-06/Wempe_05-06_20.jpg — Schneckenkurve / Kraftverlauf, 24.7.41 — the "Zugfeder 15 × 0,37" section and Ø 41,5/38,5 against the mainspring and the drum
- Wempe_Einheitschronometer.jpg — coloured section — the lid flush with the rim (W1), the core's proportions (W2), the drum's heights, the Steg through the lid
- 001-002/Wempe_001.jpg — Federchronometer layout (2:1) — opened: it draws the barrel only as a circle in plan (its place is batch 1's); nothing compared on the barrel's form
- 001-002/Wempe_002.jpg — Ankerchronometer layout (2:1) — opened: as 001, a lever chronometer's layout; nothing for these parts
- 05-08/Wempe_05-08_12.jpg — 05 08 05 Federhausbrücke kompl. — opened for the set-up click's place by the ratchet (batch 2's part); nothing further for these parts

## Sheets not reviewed
- 05-08/Wempe_05-08_13.jpg (05 08 05-1 Federhausbrücke) and Wempe_05-08_14.jpg (05 08 05-2 the click): batch 2's parts. I didn't compare the bridge's pivot hole and thickness, which set where the arbor's square starts (W3); batch 2's report has them.
- 05-06/Wempe_05-06_01.jpg to _16.jpg: the fusee group, batch 5's, except _20 above. The chain's pin and the flange's slot, which the chain's top hook meets, are batch 5's.
- No sheet of 05 07 00-1 (Steg), 05 07 00-6 (Zugfeder), 05 07 01-3 (hook block), 05 07 02-1 (the 1948 arbor) or 05 07 02-2 (the hook) is in the set. I searched every folder of References/wempe/drawings, and Index.md, Missing_details.md and Wempe_Einheitschronometer.md. These parts are compared on the assemblies (05 07 01, 05 07 02, 0207, 020701) and the coloured section.
