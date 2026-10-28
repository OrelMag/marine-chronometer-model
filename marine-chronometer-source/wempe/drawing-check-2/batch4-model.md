# Batch 4, the model against the sheets: barrel, barrel arbor, set-up ratchet, mainspring, chain and band

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch4-read.md`, with its Step 3 corrections; its F1-F22 are settled below).

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit` (main at b134d60e, 3.45.03). Nothing in it was edited.
- **Scratch.** All the files named below are in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b4m\` (written `b4m\` below).
- **Solids.**
  - `b4m\dump.py` (batch 3's, with a connector argument) loads the page (`?snap&qa`, GPU) and freezes it as isolate.py does (n 2.5, running).
  - It writes every visible mesh of `barrel`, `barrelArbor`, `setupRatchet`, `mainspring` and `chain` in all five versions (`dump.json`), the band in `last` after `setConn('band')` (`band.json`), and the pillar plate and barrel bridge in last and first (`ctx.json`).
- **Analysis.**
  - The vertices were measured directly, each mesh put back into its own frame (`inv.py`).
  - The turned profiles were read as (r, y) clusters (`prof.py`).
  - Face levels and face loops were taken, with circles fitted (`a_drum.py`, `b4lib.py`, batch 3's lib).
  - The notches were measured in polar terms, and the arbor's hook in the arbor's frame.
- **Overlays.**
  - `overlay.py` renders a build book page at the sheet's px/mm.
  - `overlay2.py` rasterises the model's own lines: the 1941 section and plan from `mk01.py` and `mk01p.py`, and the chain and band hooks' face loops from the solids.
  - Both register by FFT over mirror, rotation and scale.
  - The output is `b4m\ov\*.png`: sheet red, model blue, both black.
- **Renders.** `isolate.py --model wempe barrel,barrelArbor,setupRatchet`, as last revised and with `setRev('first')`, from four sides and from underneath, are in `b4m\iso\r_iso_last.png`, `r_iso_first.png`, `r_iso_last_under.png` and `r_iso_first_under.png`.
- **Tools.** These were run one at a time:
  - `holecheck.py --model wempe` (`b4m\holecheck.txt`): 1565 holes over 5 states, 0 failing, and no barrel entries.
  - `audit.py --model wempe` (`b4m\audit.txt`): nothing new.
  - `seatcheck.py` isn't on main at b134d60e, so `SEAT_EXPECTED` couldn't be re-judged.
- **Book.** `book/wempe-build-book.pdf` (WBOOK: barrel 282-290, arbor 291-295, ratchet 296-298, mainspring 299-304, chain 305-307, band 308-319) is titled v3.41.00 · 2026-10-27. It shows only the version as last revised.

**Which version carries which sheet** (`fusee.js`; `revShows`: a group listed `first` also shows in 3955 unless `-3955`):

| part | last, 1943 | first, 3955, 6mx |
|---|---|---|
| barrel | the 1948 drum 05 07 01-1 (06), lid 05 07 01-2 (07), hook block, Steg; 04 the assembly | the 1941 ring 020701-3 (10, 02) with two discs (01, 02), the same hook block and a Steg 0.05 further out |
| barrelArbor | the 1943 arbor (08), its diameters fitted to the frame and drum (05 07 02-1 isn't in the set) | the 1941 core (09) 0.21 longer, the same pivots and journals; the square to −35.4 and a point to −37.32 (first, 3955); the 6MX's to −36.6/−38.5 (Kirov photograph) |
| setupRatchet | plain (03): last, first, 1943 | with a turned recess Ø 8.7/7.3 × 0.7 on its outer face: 3955, 6mx (photographs) |
| mainspring | in the middle of the 1948 drum's 15.63 (y −20.215…−5.215) | in the middle of the 1941 drum's 15.8 (−20.3…−5.3) |
| chain or band | the connector is a separate choice (`conn`), in every version. Each drum is cut with its connector's slot. | the same |

The 1943 version carries the 1948 drum, though no barrel sheet of 1943 exists (07 is dated 7.4.41 and was re-checked 30.4.43, 06 and 04 are 1944-48). That is noted here, not found as a fault.

---

## 05-07_06: the drum 05 07 01-1 (2:1, 8.4.47, revised 11.3.48 and 20.4.48); last, 1943

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outside | Ø 41,6 −0,1 | Ø 41.600 | 0 | match (upper limit) | sure |
| bore | Ø 38,5 +0,1 | Ø 38.500 | 0 | match (lower limit) | sure |
| overall | 18,1 −0,15 | 18.080 | −0.02 | within | sure |
| bottom | 1,25 −0,1 | 1.250 | 0 | match | sure |
| boss face | Ø 8 | Ø 8.000 | 0 | match | sure |
| boss foot | Ø 12 | Ø 12.000 | 0 | match | sure |
| boss face from outside | 3,1 −0,1 | 3.100 | 0 | match | sure |
| boss face to seat floor | 13,8 −0,05 | 13.780 | −0.02 | within | sure |
| bore in boss | Ø 4,5 +0,1 | Ø 4.550 | mid | match | sure |
| lid seat | Ø 39,2 s6 (+0,043/+0,059), 5° at its mouth | Ø 39.200 at the rim, widening to Ø 39.390 at 1.20 deep (a 5° undercut matching the lid's cone) | −0.043…−0.059 under s6 | at nominal, not in s6's band (M15); the 5° read as the undercut the lid's cone needs | likely |
| seat depth | (1,2 −0,1), bracketed by revision a | 1.200 | 0 | match | sure |
| outer bottom edge | broken (the blank's corner rounded) | 0.2 × 45° | — | match | likely |
| M 2,6 through the wall | at 45° from the 9 o'clock line, its centre 9,05 ±0,05 from the bottom's outside | plain Ø 2.64 bore at y −12.700 (9.050), 225° from the chain's slot and 45° from the Steg's slot | 0 | place match; **no thread** (M14) | sure |
| slot through the bottom (b) | 2 +0,05 wide, 0,8 +0,05 across, its inner end 0,95 +0,15 from the bore (r 18,3), at 9 o'clock | 2.025 (2.028 at the face) × 0.800, r 18.300-19.100, through the 1.25 bottom, at the Steg's angle | 0 / lower limits | match | sure |
| chain slot | not on this sheet (the 1941 note: cut at the fusee's fitting) | 0.85 along the axis (y −18.085…−17.235), 1.77 across at 45° to the radius, 2.5 round the drum at the rim, at −19.57° (the laid barb's place); the band's drum at −49.73° | — | estimate, recorded (README Estimated, P1c) | sure |

### Step 5, overlay

`ov\s06_sec.png` is book p. 283 on the section (turned 180°, scale 0.96 on 7.09 px/mm).

- The wall, bottom, boss, bore, seat and rim lie on the sheet's lines.
- The book's unpartnered lines are:
  - its chain-slot rectangle (an estimate, above);
  - the M2.6 hole, which it draws as a dashed ellipse on the far wall where the sheet draws it on the near one (same height). This is a projection difference, not a geometry one.
- The sheet's unpartnered lines are dimensions, the hole's thread circle and the whole plan.
- The book has **no plan view** of the drum (M18). So the slot through the bottom, the hole's angle and the 5° seat aren't on it.

## 05-07_07: the lid 05 07 01-2 (2:1, 7.4.41, revised 20.4.48); last, 1943

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 1,3 −0,1 (a) | 1.200 | lower limit | within; recorded (README Readings corrected, 27 Oct: flush with the rim on 05 07 01) | sure |
| rim | Ø 39,2 r6 at the top face, Ø 39,39 at the lower, 5° | Ø 39.200 → Ø 39.390 over the 1.20 (5.0° cone, wider inside) | −0.034…−0.050 under r6 | at nominal (M15) | sure |
| boss from the top face | 3,3 −0,1 (a) | 3.300 | 0 | match | sure |
| boss Ø | 8 −0,2 at its end, 12 −0,2 at its foot | 8.000, 12.000 | upper limits | within | sure |
| boss cone | 45° | 43.6° (2.1 high over 2.0: the lid's 1.2 with the 3.3 leaves 2.1) | 1.4° | within (with the lid at 1.3 it would be 45°) | sure |
| bore | Ø 4,5 +0,1 (a) | Ø 4.550 | mid | match | sure |
| notch, 9 o'clock | 2 +0,05 wide to 18,3 ±0,02 from the centre | 2.025 wide to r 18.300 (at the Steg's angle) | mid / 0 | match | sure |
| notch, 3 o'clock | 2,7 +0,1 wide, 2 +0,2 deep | 2.750 wide to r 17.595 (2.1 from Ø 39.39) | mid / mid | match | sure |
| sharp edge broken | at the rim's lower edge | not modelled (a break) | — | minor | — |

### Step 5

- Book p. 285 is a half section only, with no plan. Neither notch, the Ø 39.2/39.39 rim nor the 5° is drawn or dimensioned (M18).
- No overlay was made: the sheet's own section omits both notches (the reader's F20), and its profile is the measured one above.

## 05-07_04: the barrel with its lid 05 07 01 (2:1, 28.8.44, revised 20.4.48); last, 1943

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 18,1 −0,15 | 18.080 | −0.02 | within | sure |
| arbor's shoulder over the lid | 0,6 −0,1 | 0.590 (shoulder −22.32, lid −21.73) | −0.01 | within | sure |
| barrel's endshake on the arbor | (a) 0,05 +0,06 | 0.100 (bosses 11.68 apart, core 11.58) | within | match | likely (the reading of the figure) |
| hook block height | 3,05 −0,1 (a) | 3.050 | upper limit | within | sure |
| hook block centre | 7,85 ±0,05 from the bottom's inside | 7.800 | lower limit | within | sure |
| wall at the hook | 2,05 −0,1 (a) (code: rim to the block's face) | 2.050 (r 20.80 − 18.75) | 0 | match on that reading | likely |
| riveted | "vernieten" | a plain Ø 2.6 pin in a Ø 2.64 hole | — | M14 | likely |
| rim notches at 3 and 9 | in plan and section | the lid's two notches | — | match | sure |
| no chain slot drawn | — | the estimated slot (06, above) | — | recorded | sure |

### Step 5

- Book p. 282 (the assembly) shows the barrel whole. Its drawing number reads **"05 07 00-1"** (the Steg's) where 05 07 01 belongs (M17).
- No overlay was made: the assembly's lines are the parts' above.

## 05-07_05: the drum's blank R 05 07 01-1 (2:1, 24.8.44)

- **Not modelled**, because it is a raw part.
  - The drum fits inside it: Ø 41.6 < 43.6, 18.08 < 20.5, the bottom 1.25 < 3, and the boss 3.1 within its 3.9.
  - Its Ø 8 (a) recess outside would be faced away unless it were deeper than about 0.8. 06 draws no recess on the bottom's outside, so nothing is owed.
- The book's drum material "Ms. 63 3" is the blank's; 06 says "Ms.". This is a note, not a finding.

---

## 05-07_01 (0207, 5:1, 15.4.41), 05-07_02 (020701, 2:1), 05-07_10 (020701-3, 2:1): the barrel of 1941; first, 3955, 6mx

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| ring outside | Ø 41,5 (01, 02) | Ø 41.500 | 0 | match | sure |
| ring bore | Ø 38,5 (01, 02) | Ø 38.500 | 0 | match | sure |
| ring wall | "1,5" by the rim (01, the reader's unattached figure) | 1.500 | 0 | match (attached: the wall) | likely |
| length | 18 (01, 02) | 18.000 (y −3.7…−21.7) | 0 | match | sure |
| plate-side disc | 1,2 (01); 02's **bottom** 1,2 with its boss 3,1 | 1.200, its boss face 3.100 from outside, tagged **lid** 050701-2 | 0 | sizes match; **name swapped (M1)** | likely |
| bridge-side disc | 1 (01); 02's **lid** 1,1 with its boss 3 | 1.000, its boss face 2.900 from outside, tagged bottom 050701-1 | 0 to 01, −0.1 to 02 | sizes match 01; name swapped (M1) | likely |
| inside | [15,8 ±0,1] (01); 15,7 ±0,05 (02, 8 overwritten) | 15.800 | 0 / +0.05 over 02's limit | match 01; 02 a later figure (M1, note) | sure |
| seats | 01: both discs set into the wall; 10: one recess Ø [39,2] × 1,5 deep, wall [5°]; 02: a 3° lead-in at the lid's end | two plain seats Ø 39.200, 1.20 deep (plate side) and 1.00 (bridge side), 0.35 wide | 1.5 vs 1.2; no 5° or 3° | inconsistent (M11) | possible |
| bosses | Ø 9 face (02, struck 9,5), Ø 12 foot, 22½° | Ø 9.000, Ø 12.000, 22.5° cone (0.62 over 1.5) | 0 | match | sure |
| disc bores | Ø 5 (01); Ø 4,5 (02) | Ø 4.550 | +0.05 / −0.45 | inconsistent sheets (M6) | sure (both figures legible) |
| oil sink | Ø 8 at 10° round the plate-side disc's hole, its outer face (01) | **none** (flat face: profile and `r_iso_first_under.png`) | — | **missing (M2)** | likely |
| D notch | 02's plan: a half-round notch on the rim at 3 o'clock, about 2.6 across × 2.0 deep (scaled at 15.2 px/mm), 135° from the hook and so 180° from the Steg's angle | none: each disc has only a closed slot for the Steg | — | **missing (M3)** | likely |
| Steg (106) | 01: 2 (2,5 overall) × 0,5, 0,4 off the bore, at 12 o'clock; its ends set in both discs | 2.0 × 0.5 at r 18.35-18.85, through closed slots 2.025 × 0.55 in both discs, flush with their outer faces (estimate) | 0 | match (the slots estimated) | likely |
| hook block | 01: 6 long, 0,5 deep, 2 from the rim, 45° from the Steg, M 2,6; 02: 3 axially, centre 7,9 from the bottom's inside, Ø 2,6, vernieten | 6.0 × 0.5 × 3.05, 2.00 from the rim, 45.0° from the Steg; Ø 2.64 hole, a Ø 2.6 pin; centre y −12.700 | −0.10 from 7,9 (−12.80) | M9 (minor); M14 | likely |
| chain slot | 01: 2,5 round at 45° (plan), 0,85 across (section), its middle drawn 4.6-4.7 from the bridge-side face (12.27 px/mm; README 4.66), 180° from the Steg | 0.85, leaning 45°, 2.5 at the rim, 180.0° from the Steg; middle 4.04 from the bridge-side face | +0.6 toward the bridge | undimensioned: estimate (M13) | likely |
| arbor's hook | 01: 3 along the axis, 0,5 high, 9,4 from the plate-side disc's inside to its far edge | head **2.0** along the axis, 0.475 at its face, centre −12.80 (9.40 from −4.9 to the far edge with a 3 head) | −1.0 long | **wrong (M4)** | likely |
| plate / bridge | 3,3 each, 22,3 between | 3.35 / 3.32, 22.35 | — | batch 8/9 | — |
| barrel to bridge | 0,6 | 0.65 | +0.05 | within | sure |
| arbor end past the bridge | 10 (01: square ends 10 past the bridge's outer face, rounded) | square's sides to −35.40, then a point to −37.32: 11.65 past the face | +1.65 | **wrong (M5)** | likely |
| bearings | "Lagerstellen Enger Laufsitz" | pivots 2.88 in 2.90, 3.88 in 3.90 | — | match as a close running fit | sure |

### Step 5, overlay

- **Section** (`ov\s01_sec.png`: the model's 1941 lines at 12.27 px/mm, scale 1.00, no turn).
  - The ring, discs, bosses, core, journals, pivots, Steg and plates lie on the sheet's lines.
  - The unpartnered model lines are:
    - the chain slot, drawn 0.6 toward the bridge (M13);
    - the hook's head, 2 long against the sheet's 3 (M4);
    - the square's point, running 1.65 past the sheet's end (M5).
  - The sheet's unpartnered lines are:
    - the hook block, drawn in projection;
    - the click and its screw (batch 8);
    - the plate-side disc's oil sink (M2);
    - the discs' seats running into the wall at both ends, where the model's seats are plain (M11).
- **Plan** (`ov\s01_plan.png`: the model's ring, block, Steg, rivet hole and slot, registered **mirrored**, scale 1.00).
  - The block lies at 45° on the sheet's block with the M2.6 lines on it.
  - The Steg lies on the 12 o'clock rectangle, about 1.5 mm off tangentially in a residual 2° turn of the fit.
  - The slot lies at 6 o'clock.
  - Because the match is mirrored, the sheet's plan is the model seen from −y, the bridge side, as first-angle projection puts a view to the left of the section. That supports the reader's F1 (M1).
- **No book page** exists for the 1941 barrel. The renders are `iso\r_iso_first.png` (bridge side) and `iso\r_iso_first_under.png` (plate side, no oil sink).

## 05-07_09: the 1941 arbor 127-556.04-093 (2:1, 4.7.41); first, 3955, 6mx

### Step 4

| feature | sheet | model (first) | diff | verdict | sure |
|---|---|---|---|---|---|
| plate pivot | Ø 3 (−0,02?), "Kegel 1:70 poliert"; 7 from its (centred) end to the shoulder | Ø **2.880**, a ball end 4.98 from the shoulder (08's "Kugel", 01's 5 + 0,1) | −0.12 | **wrong against 09 and 01 (M6)**; fitted to the frame's Ø 2.90 hole | sure |
| journals | Ø 5 ±0,02, Ø 5 −0,02 | Ø **4.480** | −0.50 | **wrong against 09 and 01 (M6)** | sure |
| core | Ø 13,3 × 12, ends 22½° over 0,8 to Ø 9 | Ø 13.30 × **11.90** (0.05 off each boss), Ø 9 faces, 22.5°, 0.89 axially | −0.10 (±0,05 general) / +0.09 | outside ±0.05 by 0.05 (the 1941 bosses are 12.0 apart: the core can't be 12 and run); 0.8 against Ø 9 over-determined | sure |
| bridge pivot | Ø 4 −0,02 | Ø **3.880** | −0.10 | **wrong against 09 (M6)**; fitted to the bridge's Ø 3.90 | sure |
| between shoulders | [22,2 +0,1] | 22.290 | +0.09 | match | sure |
| 6,7 / 18,7 / 3,5 / 15,5 | chain of lengths | 6.82 / 18.72 / 3.57 / 15.47 | +0.12 / +0.02 / +0.07 / −0.03 | within the boxed chain (the core shortened) | sure |
| square | 2,7 ±0,02, Kegel 1:100; 15 from the shoulder to the end, 44,2 overall (centres) | 2.700 → 2.603 over 9.7, sides to −35.40 (3955 photograph), point to −37.32 | — | the square matches; the end is M5 | sure |
| hook hole | Ø 2 × 6 radial, drill point, about 5.8 from the core's left face | Ø 2.0 × 6.0 to r 0.65, centre 5.95 from the core's left face | 0 | match | sure |
| lower "2" | unattached (F11) | — | — | n/a | — |
| hardening | härten bei 800, anlassen 270 | in the book's treatment line | — | match | sure |

### Step 5

There is no book page for the 1941 arbor. It is overlaid in `ov\s01_sec.png`, and 09's own elevation agrees with it to the figures above.

## 05-07_08: the arbor 05 07 02 (2:1, 28.1.43); last, 1943

### Step 4

| feature | sheet | model (last) | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 40,2 (±0,1) | 40.200 (ball end +4.95 to the square's point −35.25) | 0 | match | sure |
| ball end | 5, "Kugel poliert" | 4.98 from the shoulder, a ball r 1.44/0.6 | −0.02 | match | sure |
| square | 10, "poliert" | 9.5 tapered 2.700→2.605, plus a 0.5 point | 0 | match | sure |
| diameters | not on 08 (05 07 02-1 isn't in the set) | pivots 2.88/3.88, journals 4.48, core 13.30 with Ø 10 faces and 45° × 1.65 | — | estimate, recorded (README Unresolved) | sure |
| hook pin | through the core (dashed both sides, no point) | Ø 2.0 × 6.0 blind, pin to 0.005 off the floor | — | recorded (README Unresolved, the tools' limits); holds | sure |
| hook head | 0,5 −0,05 high, its face 15° (end view) | 0.475 at a radial face 15° off the pin's line, falling to flush 5° past; 2.0 along the axis; 20° round | 0 | match | likely (end view scaled) |
| hook's height | — | pin centre y −12.59 (the core's middle), the hook block −12.70, the spring −12.715 | 0.11-0.125 | no sheet; within the spring's 15 | — |

### Step 5

`ov\s08_elev.png` is book p. 292 on the elevation (mirrored, turned 90°, scale 1.02; 08 isn't to scale, scaling 40.4).

- The pivot, journals, core, chamfers and square lie on the sheet's lines.
- The sheet's unpartnered lines are the hook pin's head standing over the core (the book draws the hook on its own page) and the ends' polish lines.
- Book p. 292 labels the hook's hole "Ø 1.50". The section plane misses the hole's axis and cuts a chord of the Ø 2 hole (M18).

## 05-07_03: the set-up ratchet 05 07 00-3 (5:1, revised 24.11.47); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | 16 | 16 | 0 | match | sure |
| tips | Ø 14,1 −0,2 | Ø 14.000 | mid | match | sure |
| roots | Ø 11,1 −0,2 | Ø 11.000 | mid | match | sure |
| face | 10°, 1,2 off the radius | each face along a line 1.2 off the radius | 0 | match (overlay) | sure |
| back | Ø 12,5 circle, its centre on Ø 6,4 | arc r 6.25, centre about 3.1 from the axis | 0 | match (overlay) | sure |
| thickness | 2,65 −0,1 (b) | 2.650 | upper limit | within | sure |
| square hole | 2,7 □ H7 +0,009, "Kegel 1:100" | **2.714 across, straight** (corner r 1.9192) | +0.005 over H7; no taper | **wrong (M7)** | sure |
| on the square | a taper fit | the square measures 2.695 at the ratchet's inner face and 2.669 at its outer one: 0.019-0.045 loose | — | **joint fails as drawn (M7)** | sure |
| place | against the bridge (01) | 0.05 off the bridge's outer face | — | match | sure |
| recess (3955, 6mx) | 03 draws the face flat | Ø 8.7 → 7.3 × 0.7 on the outer face | — | version (photographs, README Estimated) | sure |

### Step 5

`ov\s03_plan.png` is book p. 296 on the plan (not mirrored, turned 308°, scale 1.02).

- The sheet's four teeth lie on the book's faces and backs, and the tip and root circles coincide.
- The square stands about 3° off the sheet's. That is undimensioned: it is the model's turn of the ratchet to the click.
- Book p. 296's section A-A runs along the bounding box's lower edge, not through the axis, so it shows neither the square hole nor a hatch (M18).

## The mainspring 05 07 00-6 (no sheet: 01's "Zugfeder 15", 05 06_20's 15 × 0,37)

| feature | source | model | verdict | sure |
|---|---|---|---|---|
| height | 15 (01, 05 06_20) | 15.000 | match | sure |
| thickness | 0,37 (05 06_20) | 0.36 drawn (the packed pitch 0.37) | recorded | sure |
| in its drum | — | last: in the middle of 15.63 (−12.715); first: in the middle of 15.8 (−12.80) | holds | sure |
| length | not drawn | 1,240 (fitted to 05 06_20's force) | recorded (README Estimated) | sure |
| **text** | — | the page's card (app.js line 129) and book p. 300 say "1.39 m, half the room in the barrel" and "estimated by the usual rule": stale since 15 October 2026 (the card's own `sp` says 1.24 m) | **M16** | sure |

The book draws the spring coiled, in pp. 299-304, as about 200 contour elements (M19).

## 05-07_14: the chain 050704 (5:1, 16.7.41); every version (the page's default connector)

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| pitch | [2,05] | 2.05 | 0 | match | sure |
| plate | 4,05 long, [2 −0,03] wide | 4.050 × 1.978 (lobes r 1.0 as 12-gons; 2.000 as drawn) | 0 / −0.02 | within | sure |
| rivet holes | 0,55 (rod Ø 0,6) | Ø 0.56 in the plates, rivets Ø 0.55 × 0.80 flush | — | match; "beweglich vernieten": free | sure |
| across | [0,82 ±0,02] | 0.800 (three plates of 0.26, two gaps of 0.01) | lower limit | within | sure |
| over all | 780 +3 | 781.25 (375 links × 2.05 + the hooks' 5 and 7.5) | +1.25 | within | sure |
| top hook | 3,5 wide, 5 to the crown, 1,8 back, R 0,4 seat 3,5 from the rivet, nose 2, "30°" | 3.55 wide, crown 5.00, back 1.8, seat r 0.4 at 3.5, nose at 2.0, edge 30° to the chain's line | 0 to the figures | match the figures; the drawing scales the seat at about 3.1 (recorded "drawn 3.0") and its edge about 50° to the chain (M20) | likely |
| bottom hook | 7,5, R 0,6, R 0,2 root at 3,5, 5, 50°, R 8, R 20, 1,4 −0,1 | the same (overlay) | 0 | match | sure |
| hooks' thickness | the chain's 0,82 in the edge view; strip 10 × 0,9 | 0.80 (eye 0.26 between the end links' plates) | — | match (recorded) | sure |
| text | — | the card says "374 links"; 375 are drawn | 1 | minor (M16) | possible |

### Step 5

- `ov\s14_top.png` and `ov\s14_bot.png` lay the hooks' solids' face loops on the sheet (scale 0.97/0.96 on 17.7 px/mm). The bottom hook lies on the sheet's line all round. The top hook's crown, back and eye do too, but its throat runs deeper and its nose's inner edge steeper than drawn: the figures against the drawing (M20).
- Book pp. 305-307 draw the chain as laid in the movement: two drums of links, "Thickness 11.34", 3612 contour elements. There is no link or hook sheet (M19).

## 05-07_11, 12, 13: the band 05 07 03 and its hooks (1943); every version (Variants)

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| length | 730 ±3 between the hooks' catching points | 727 + 3 from the round hook's pin | 0 | match | sure |
| band | 0,22 +0,03 thick (the slots), width not given | 0.22 × 0.78 | — | match / estimate (README) | sure |
| hooks' thickness | 0,8 −0,05 | 0.780 | mid | match | sure |
| round hook outline (12) | R 0,4, R 1, R 6 (3,55), nose R 0,4, crown | lies on the sheet's line (overlay score 0.99) | — | match | sure |
| drum hook outline (13) | R 0,2 tip, R 10, R 1, barb R 0,2, R 4, 50°, front | lies on the sheet's line (0.94) | — | match | sure |
| band's slots | 12: 0,22 +0,03 at 5°, its bottom 2,5 below the reference; 13: at 10°, its end 0,2 off the bottom circle's centre, 2,5 down | **not cut**: the band's ribbon ends at a 0.1 notch in each hook's mouth; the "brazed" joint is fine.py's expected overlap | — | **missing (M8)** | sure |

### Step 5

- `ov\s12.png` and `ov\s13.png` lay the hooks' face loops on the sheets. Every outline line has a partner. The unpartnered sheet lines are the band's slot in each hook (M8) and the dimensions.
- Book pp. 316-319: the contour tables don't reproduce the solids' own arcs. They give R 5.80 for the solid's R 5.93 flank and R 3.88 for R 4, and they invent arcs (R 1.48, R 4.84, R 2.81, R 0.36, R 2.33) where the solid has lines. This is the book's arc fitting, not the part (M19).
- Book p. 309 draws the band as laid, as a spiral of R 5.26 arcs (M19).

---

## Step 6, fit list

| # | piece | into/onto | hole or seat (sheet) | holding (sheet) | on the solid | verdict |
|---|---|---|---|---|---|---|
| J1 | arbor's plate pivot | pillar plate | Ø 3, "Enger Laufsitz" (01) | running | Ø 2.88 in Ø 2.90 (0.02); ball end out past the plate | holds (the diameter is M6, 'first') |
| J2 | arbor's bridge pivot | barrel bridge | Ø 4 (01) | running | Ø 3.88 in Ø 3.90 | holds (M6, 'first') |
| J3 | arbor's shoulders | plate and bridge | [22,2 +0,1] between 22,3 | endshake | 22.29 between 22.35: 0.06 | holds |
| J4 | drum / bottom disc | arbor's journal | Ø 4,5 +0,1 (06), Ø 5 (01), Ø 4,5 (02) | running | Ø 4.55 on Ø 4.48 (0.07), 3.1 long | holds (M6 for 'first') |
| J5 | lid | arbor's journal | Ø 4,5 +0,1 (07) | running | Ø 4.55 on Ø 4.48 | holds |
| J6 | barrel on the arbor | between the core's ends | (a) 0,05 +0,06 (04) | endshake | 0.10 | holds |
| J7 | lid (1948) | drum's seat | Ø 39,2 s6 × (1,2), 5° (06); rim r6, Ø 39,39, 5° (07) | "eingesprengt": the 5° cone, not interference (F18) | cone on cone, line to line at nominal Ø 39.2/39.39; face flush with the rim | holds (M15: both at nominal) |
| J8 | discs (1941) | ring | 10: Ø [39,2] × 1,5, [5°], shrunk in hot; 02: 3° lead-in for the lid | shrink / snap | plain Ø 39.2 seats 1.2 and 1.0 deep, line to line | holds as a seat; form M11 |
| J9 | hook block | drum wall at 45° | M 2,6 (06, 01), Ø 2,6 (02), "vernieten" (02, 04) | rivet, or thread and rivet | a Ø 2.6 plain pin through Ø 2.64 holes in the block and wall, no head, its end 0.05 under the 1948 drum's surface (flush on the 1941 ring) | holds as a pin; fastener M14 |
| J10 | Steg (1948) | the bottom's slot and the lid's notch | 2 +0,05 × 0,8 +0,05 (06); 2 +0,05 to r 18,3 (07) | captive | 2.0 × 0.5 in 2.025 × 0.8: 0.0125 each side, its inner face on the notch's floor (r 18.3), 0.3 free outward | holds; the play is M12 |
| J11 | Steg (1941) | both discs | ends set in the discs (01) | captive | through closed slots 2.025 × 0.55 (estimated) | holds; the lid's notch M3 |
| J12 | hook pin | arbor's core | Ø 2 × 6 (09), through (08) | press (not stated) | Ø 2.0 in Ø 2.0, line to line, 6 deep | holds (08's through hole recorded) |
| J13 | set-up ratchet | arbor's square | 2,7 H7, Kegel 1:100 (03) | taper fit | straight 2.714 on 2.695-2.669: 0.019-0.045 loose, held by nothing axially | **no (M7)** |
| J14 | set-up click | barrel bridge, 12 from the axis | Ø 3,1 on a shoulder screw (01) | screw | batch 8 | — |
| J15 | chain's drum hook | drum's slot | 2,5 × 0,85 at 45° (01) | the barb | the hook 0.80 in the slot 0.85 (F19: fits, 0.025 each side), its barb in the slot at run down (fine.py's expected 0.06 mm³) | holds |
| J16 | band's drum hook | drum's slot | no sheet places it | the barb | 0.78 in its own drum's 0.85 slot at −49.73° | holds (estimate) |
| J17 | band | its hooks | slots 0,22 +0,03 (12, 13) | "hart gelötet" | no slot: the ribbon butts on the mouth's notch (expected overlap) | **no (M8)** |
| J18 | chain's plates | rivets | Ø 0,55 holes, Ø 0,6 rod | "beweglich vernieten" | Ø 0.55 in Ø 0.56, flush | holds |
| J19 | chain's hooks | end links | between the end link's plates | rivet | eye 0.26 between the plates, the rivet through it (r 0.28 hole) | holds |
| J20 | chain's / band's round hook | fusee's pin | R 0,4 seat | the pull | seat on the pin (fine.py's expected) | holds (the pin is batch 5's) |
| J21 | mainspring's inner end | arbor's hook | the head 0,5 at 15° (08) | hooked | the eye over the head; the land 0.1 into the next coil (fine.py's expected) | holds (eye estimated) |
| J22 | mainspring's outer end | hook block and Steg | 01, coloured section | hooked, threaded behind the Steg | the strip's last 5.7 on the block, the outer coil between the Steg and the wall | holds (no sheet) |

---

## Extra checks

### (a) Slots, notches and grooves

| described | against the sheet's views | verdict |
|---|---|---|
| 06's slot through the bottom (2 × 0.8) | both views | built; holds |
| 07's 9 and 3 o'clock notches | plan (the half section omits them) | built in the 1948 lid |
| 02's D notch | plan only: 2.6 × 2.0 at 180° from the Steg's angle, the 1941 counterpart of 07's 3 o'clock notch (07 itself is dated 7.4.41) | **not built (M3)** |
| the Steg's closed slots in both 1941 discs (2.025 × 0.55) | not drawn: 01's section sets the Steg's ends in the discs; 07 (1941) draws the lid's as a notch open to the rim | estimate; the lid's form is M3 |
| 01's chain slot | both views | built; its axial place is M13 |
| the chain slot in the 1948 drum | no sheet | recorded estimate |
| the band hooks' 0.22 slots | 12, 13 | **not cut (M8)** |
| 01's oil sink | section ("10°", the cone at the disc's face) | **not built (M2)** |
| T's "wall notch" and "flat" (01, 09) | the reader showed they're not there | not built: right |

### (b) Drawn holes (the reader's table)

| sheet | hole | present? | note |
|---|---|---|---|
| 01 | plate's Ø 3, bridge's Ø 4 | yes | Ø 2.90 and Ø 3.90 (batches 9, 8); the 'first' pivots follow them (M6) |
| 01 | click screw's tapped hole, click's Ø 3.1 | — | batch 8 |
| 01 | plate-side disc Ø 5 with an Ø 8 10° sink | Ø 4.55, no sink | M2, M6 |
| 01 | bridge-side disc Ø 5 | Ø 4.55 | M6 |
| 01, 02 | wall M 2,6 / Ø 2,6 at 45° | Ø 2.64 plain | M14 |
| 01 | chain slot | yes | M13 |
| 01, 09 | core's Ø 2 × 6 | yes | — |
| 01, 03 | ratchet's square 2,7 H7 1:100 | straight 2.714 | M7 |
| 02 | Ø 4,5 in lid and bottom | Ø 4.55 | — |
| 02 | D notch | no | M3 |
| 04 | rivet hole | yes | — |
| 06 | Ø 4,5 +0,1; M 2,6 at 9,05; slot 2 × 0,8 | yes / plain / yes | M14 |
| 07 | Ø 4,5 +0,1; both notches | yes | — |
| 08 | diametral hole | 6 deep | recorded |
| 12, 13 | band slots 0,22 +0,03 | no | M8 |
| 14 | rivet holes Ø 0,55 | Ø 0.56 | — |

### (c) Excuses

| entry | re-judged |
|---|---|
| checks.py EXPECTED ('barrelArbor:Extrude','mainspring:Buffer'): the head's land 0.1 into the next coil | holds (the spring isn't bent round it; the eye has no sheet) |
| ('chain:Extrude','fusee:Cylinder'), ('band:Extrude','fusee:Cylinder'): the round hooks on the pin | hold |
| ('chain:Buffer','chain:Extrude'): the hooks riveted between the end links | holds |
| ('barrel:Buffer','chain:Extrude'): the bottom hook in the leaning slot at run down, 0.06 mm³ | holds (the slot is an estimate placed by the hook) |
| ('band:Buffer','band:Extrude'): "the band's ends brazed to its hooks: the strip's end against its round hook" | **does not hold as worded.** The sheets braze the band into a 0.22 slot 2.5 deep in each hook. The model has no slot, and this entry hides it (M8). |
| ('band:Buffer','fusee:Lathe'/'fusee:Buffer') | batch 5 |
| HOLE_EXPECTED, audit LOOSE | none for these parts; holecheck passes all five versions |
| bom.json `dev` | none on these lines |
| bom.json 050700-3 `round 050702-1 press` | passes with a 0.011 gap (book p. 297): it isn't a press fit (M7) |
| bom.json 050701-3 `on 050701-1` | holds; there is no relation for its rivet through the wall (M14) |
| README Estimated: the 1941 seats' 0.35 width and the boss cone (020701) | the cone holds (22½° is figured on 02); the seats' depth and undercut are M11 |
| README "As first drawn": "the lid on the pillar plate's side ('warm einsprengen' …: sure)", and "020701's 1.2 leaves 15.6 inside" | **doesn't hold** for the drawings (M1). Read with F1, 02 sums 1.2 + 15.7 + 1.1 = 18. The 6MX's "cap underneath" (Altmeppen) is that clock's evidence and can stay for 6mx. |
| README / code: "4.48 in their 4.55: 020704-1's 5 don't pass them" | holds for last and 1943; for 'first' only as an estimate against two of three sheets (M6) |
| README Readings corrected (0207's chain slot: 180° from the Steg, 45° lean) | holds (overlay) |
| README Unresolved: the 1943 hook hole through the core | holds (a tool limit) |
| README Estimated: the chain's hooks' traced arcs, eyes 0.26, 0.80 thick; the band's 0.78 | hold |
| code: "the set-up ratchet … pressed down the taper to 0.05 off the bridge's face, where the square is 2.696 across" | the place holds; the press doesn't (M7) |

### (d) The blind reading's findings settled against the model

- **F1** (the 1941 discs' names): **likely, supported.** Read with the swap, the model's sizes per side match 01 and 02. The plan overlay registers mirrored, so the sheet's plan "Federhausdeckel abgenommen" is the barrel seen from the bridge side, as first-angle projection puts it. That puts the lid on the bridge side (M1).
- **F2, F3, F6-F14:** these were transcription misreadings. The model follows the right readings. For F3, the Steg's section is built and no wall notch is.
- **F4** (the oil sink): confirmed missing (M2).
- **F5** (the "0,5"/"5°" at the lower left and the "1,5"): the "1,5" is the ring's wall (1.5, match). The "5°" is likely the bottom's seat undercut, as 10's boxed [5°] (M11).
- **F15** (the journals): confirmed (M6).
- **F16** (the single undercut seat): M11, possible.
- **F17** (the D notch): confirmed missing. It is likely the 1941 lid's prising notch, 07's 3 o'clock (M3).
- **F18:** the fit holds by the cone (J7, M15).
- **F19:** settled. The hook (0.80, the chain's own width in 14's edge view) goes into the 0.85 slot with 0.025 each side. The 10 × 0.9 strip is stock, finished to 0.82 or under.
- **F20:** the sheet's own omission. The model follows the plan.
- **F21:** kept, recorded.
- **F22:** the Steg, hook block, mainspring and hook pin are built from the assemblies and the coloured section, as README Estimated records.

---

## Findings

Twenty findings in all:

- **Wrong:** M4, M5, M6, M7.
- **Missing:** M2, M3, M8.
- **Version or naming:** M1, M9, M13.
- **Inconsistent or possible:** M11, M12, M20.
- **Fastener:** M14.
- **Tolerance at nominal:** M15.
- **Text:** M16.
- **Build book:** M17, M18, M19.
- **Reserved:** M10 is folded into M1.

None changes the physics as the tools run it, since they run 'last'. M12 would, if a sheet confirmed it.

**M1. Version (naming), 01 and 02: the 1941 barrel's lid is on the bridge side.**
- The sheets:
  - 01's "warm einsprengen" is on the plate side, and 02 heats the ring "vor dem Einsprengen des Bodens".
  - 02's bottom (96) is 1.2 thick with its boss 3.1 from outside: 01's plate side. 02's lid (97) is 1.1 with its boss 3: 01's bridge side, 1.0 and 2.9.
  - The plan "Federhausdeckel abgenommen" registers mirrored on the model, so it is seen from the bridge side.
- The model: the plate-side disc is tagged 050701-2 "lid", the bridge-side disc 050701-1 (sub) "bottom". The code and README say "sure", and the README reads "020701's 1.2 leaves 15.6 inside".
- How sure: likely.
- Correction:
  - Swap the two discs' tags in the 'first'/'3955' group: plate side the bottom, bridge side the lid.
  - Correct the comment and the README sentence, and the Exploded and assembly order if it lifts the lid first.
  - Keep the 6MX's cap underneath only if Altmeppen's list is taken as that clock's evidence.
  - Sizes unchanged; 02's lid 1.1 and inside 15.7 ±0.05 noted against 01's 1.0 and 15.8 as two issues.
- Physics: no.

**M2. Missing, 01 (first, 3955, 6mx), the oil sink round the plate-side disc's hole (F4).**
- The sheet: Ø 8 at "10°" on the disc's outer face.
- The model: a flat face (`iso\r_iso_first_under.png`).
- How sure: likely.
- Correction: a cone from Ø 8 at the face down to the bore. Read the 10° as its wall's slope off the face, about 0.29 deep to Ø 4.55, and confirm on crop s1m.
- Physics: no.

**M3. Missing, 02 (with 07 of 7.4.41), the 1941 lid's notches (F17).**
- The sheets: 02's plan draws a half-round notch about 2.6 × 2.0 on the rim, 180° from the Steg's angle (135° from the hook). That is 07's 3 o'clock prising notch, 2,7 +0,1 × 2 +0,2, which 07 has drawn since 1941. 07's 9 o'clock notch is open to the rim, to r 18.3.
- The model: neither notch. Each 1941 disc has a closed slot 2.025 × 0.55 for the Steg (estimated).
- How sure: likely for the notch, possible for its form and which disc carries it (the lid by its use).
- Correction: on the 1941 lid (bridge side, M1), cut 2.75 × 2.1 from the rim at LS + 180°, and open the Steg's slot to the rim at 2.025 wide to r 18.3 as 07 draws it.
- Physics: no.

**M4. Wrong (version), 01, the 1941 arbor's hook head.**
- The sheet: 3 along the axis and 0.5 high, its far edge 9.4 from the plate-side disc's inside.
- The model: the 1943 head, 2.0 long, in every version. The centre (−12.80) is right.
- How sure: likely.
- Correction: in the 'first' group, the head's slab ±1.5 along the axis. The face and land follow 08's end view, or 01's flat 0.5.
- Physics: no.

**M5. Wrong (version), 01 (first; 3955 keeps its photograph), the arbor's square end.**
- The sheet: 01's section ends the square 10 past the bridge's outer face (y −35.67), rounded, with no point.
- The model: it carries 09's turning centre, a point 1.92 long to −37.32 (09's 44.2 counts both centres, and the model keeps only the right-hand one, the left being the finished ball). It stands 1.65 past the sheet's end in the overlay.
- How sure: likely.
- Correction: for 'first -3955', the square's sides to −35.67 and a small break at the end. 3955's photographed point stays.
- Physics: no.

**M6. Wrong / inconsistent sheets (version), 01, 02, 09: the 1941 arbor's diameters (F15).**
- The sheets: journals Ø 5 (09 ±0,02 and −0,02; 01), disc bores Ø 5 (01) against Ø 4,5 (02), pivots Ø 3 and Ø 4 −0,02 (09, 01).
- The model ('first'): journals 4.48 in bores 4.55 and pivots 2.88/3.88, the 1948 fits and the frame's holes.
- How sure: sure for the figures. Which sheet rules is possible, two sheets to one.
- Correction: if 01 and 09 are taken, the 'first' journals Ø 5 −0,02 in disc bores about Ø 5.03, and the pivots as the 1941 plate's and bridge's holes (batches 8 and 9 to say whether the frame of 1941 had Ø 3/Ø 4). Otherwise record the 4.48/4.55 in README Estimated as an estimate for 'first', not a fact of the 1941 sheets.
- Physics: none for the tools (they run 'last').

**M7. Wrong (joint), 03, the set-up ratchet on its square.**
- The sheet: 2,7 □ H7 +0,009, Kegel 1:100, a taper fit.
- The model: a straight hole 2.714 across (0.005 over H7's top) on a square of 2.695 to 2.669 across its 2.65. It is 0.019-0.045 loose and nothing holds it axially.
  - bom.py's `press` passes it with a 0.011 gap.
  - The code's "pressed down the taper … where the square is 2.696" isn't what is built.
- How sure: sure.
- Correction: taper the hole 1:100 to match the square where the ratchet sits, 2.696 at its bridge-side face to 2.669 at its outer face, line to line (or 0.002 interference).
- Physics: no.

**M8. Missing (joint), 11, 12, 13, the band's slots in its hooks.**
- The sheets: 0,22 +0,03 slots, 12's at 5° to its bottom 2,5 under the reference and 13's at 10°, with the band "hart gelötet" in them.
- The model: the hooks' outlines match the sheets (overlays 0.99 and 0.94), but no slot is cut. The ribbon ends at a 0.1 notch in each mouth, and checks.py's expected overlap ('band:Buffer','band:Extrude') covers the butt.
- How sure: sure.
- Correction: cut each slot (0.235 wide along the band's line from the mouth to the bottom circle's centre: 12 through (1,4; −2,5), 13 from 0,2 left of (1,0; −2,5)). Run the ribbon 2.5 into each, and narrow the expected entry to the slot.
- Physics: no.

**M9. Version (minor), 02, the hook block in the 1941 ring.**
- The sheet: its centre 7,9 from the bottom's inside, −12.80, the 15.8's middle.
- The model: −12.70, the 1948 drum's 9.05, while the 'first' spring and arbor hook are centred at −12.80.
- How sure: likely.
- Correction: the block and its pin at −12.80 in the 'first' group.
- Physics: no.

**M10.** Folded into M1 (02's 1.1, 3 and 15.7 against 01's 1.0, 2.9 and 15.8).

**M11. Inconsistent (sheets), 01, 02, 10, the 1941 discs' seats (F16).**
- The sheets: 10 has one recess Ø [39,2] × 1,5 with a boxed [5°] undercut (the bottom's, shrunk in hot); 02 has a 3° lead-in at the lid's end; 01 draws both discs set into the wall, with "5°" (read "0,5" by the reader) at the plate-side corner.
- The model: two plain cylindrical seats 1.2 and 1.0 deep.
- How sure: possible.
- Proposal: README Unresolved. If 10 is taken, the plate-side (bottom's) seat 1.5 deep with a 5° undercut, the disc then 0.3 inside the ring's end, as 01's "0,5" and 02's "0,5" at that corner may show.
- Physics: no.

**M12. Possible (sheets), 06 revision b, the Steg's thickness from 1948.**
- The sheet: revision b widened the bottom's slot to 0,8 +0,05 from 0,5 +0,03, the 1941 Steg's 0.5.
- The model: the Steg stays 0.5, with 0.3 of play outward and nothing holding it there.
- How sure: possible. No sheet of 05 07 00-1 exists.
- Proposal: README Unresolved. A 0.8 Steg would leave 0.15 to the bore, too little for the outer coil (0.37) behind it as `wempe_mainspring.py`'s STEG solves it.
- Physics: yes, if adopted (the spring's outer end and its solve).

**M13. Version (estimate), 01, the chain slot's axial place.**
- The sheet: drawn (not dimensioned) 4.6-4.7 from the bridge-side face.
- The model: 4.04 in 'first' and 4.07 in last, cut where the laid hook's barb comes.
- How sure: likely, minor.
- Proposal: record the 0.6 in README Estimated. It is the chain's height at the drum against the drawing.
- Physics: no.

**M14. Kind of fastener, 06, 01, 02, 04, the hook block's fixing.**
- The sheets: M 2,6 tapped through the wall (06, 01), and "vernieten" (02, 04).
- The model: a plain Ø 2.6 pin in Ø 2.64 holes, with no thread and no head. Its outer end is 0.05 under the 1948 drum's surface.
- How sure: likely.
- Correction: thread the wall's hole and the block's shank M2.6 (as the frame's tapped holes since 3.35.00), with a riveted head flush outside. Or record it in README Estimated, and give bom.json a relation for the shank.
- Physics: no.

**M15. Tolerance at nominal, 06, 07, the lid's fit (F18).**
- The sheets: the seat Ø 39,2 s6 and the lid Ø 39,2 r6.
- The model: both at 39.200, the seat 0.043-0.059 under s6 and the lid 0.034-0.050 under r6. Cone on cone, line to line.
- How sure: sure.
- Correction: none needed, since the fit holds by the 5°. To show the sheets' bands, use the seat at 39.251 and the lid at 39.242, both cones kept.
- Physics: no.

**M16. Text, the page's cards (app.js lines 129 and 132) and book p. 300.**
- The text:
  - The mainspring's "Its length isn't on any sheet: 1.39 m, half the room in the barrel" and "estimated by the usual rule" are stale. It has been 1,240 mm, fitted to 05 06_20's force, since 15 October 2026, and the card's own `sp` says 1.24 m.
  - The chain's "374 links": 375 are drawn.
- How sure: sure for the first, possible for the second.
- Correction: the text only.

**M17. Build book, p. 282, the barrel assembly's drawing number.**
- The book prints "05 07 00-1" (the Steg's). It should be 05 07 01.
- How sure: sure.

**M18. Build book, turned parts without their off-axis features.**
- The pages:
  - pp. 283 and 285 (drum, lid) are half sections only. The M2.6 hole's angle, the slot through the bottom, the chain slot, the lid's two notches and the Ø 39.2/39.39 5° rim and seat are undimensioned.
  - p. 292 labels the Ø 2 pin hole "Ø 1.50", a chord from a section off its axis.
  - p. 296's section A-A runs along the bounding box's edge and shows no square hole.
- How sure: sure.
- Correction: drawbook should give a plan for a turned part with features off its axis, take section planes through the axis or through the hole, and place A-A through the centre.

**M19. Build book, parts drawn as laid, and contour fits.**
- The pages:
  - The chain (pp. 305-307: the laid chain, "Thickness 11.34", 3612 elements), the band (p. 309: a spiral of R 5.26 arcs) and the mainspring (pp. 299-304: its coils) are drawn as they lie in the movement. A maker wants one link set and the hooks, the strip straight (0.22 × 0.78 × 727), and the spring's strip.
  - The band hooks' contour tables (pp. 317, 319) fit radii and arcs the solids don't have (R 5.80 for 5.93, R 3.88 for 4, R 1.48, 4.84, 2.81, 0.36, 2.33).
  - The hook block (p. 288) merges its pin into its outline and lists zero-length cut-outs, and so does the hook pin's page (p. 295).
- How sure: sure.
- Correction: drawbook, as batch 3's M9.

**M20. Possible (reading), 14, the chain's top hook's "30°".**
- The sheet: the figures (seat 3,5, nose 2, 1,8, R 0,4) make the nose's edge about 30° to the chain's line, as the model has it. The drawing puts the seat at about 3.1 and the edge about 50° to the chain. On the scan the 30° arc is centred on the seat, between the throat's wall and a ray from the seat (`ov\s14_topzoom.png`).
- The model: follows the figures, so in the overlay its throat runs deeper and its nose thinner than drawn.
- How sure: possible.
- Proposal: keep the figures, and add to README Readings corrected that the 30° is taken to the chain's line, with the drawing's 3.1 and 50°.
- Physics: no.
