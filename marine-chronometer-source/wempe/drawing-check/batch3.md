# Batch 3: the balance and hairspring against their sheets

Read-only audit, 26 October 2026, worktree `wempe-artifacts` (HEAD f8fed0d5 at the end; code lines below are `marine-chronometer-source/wempe/js/escapement.js` as it stands).
Scratch: `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b3\` (written `b3\` below).

Method: every assigned sheet viewed whole and cropped/enlarged 2.5-12× (`b3\crops\*.png`); the built solids dumped from the page in all five versions (`b3\dump.py` → `dump_{last,first,1943,6mx,3955}.json`, movement frame, page running, balance at an arbitrary phase) and sliced/circle-fitted (`b3\a1.py`-`a4.py`, `geo.py`); renders by `b3\render.py` (isolate.py's freeze and part filter, one browser for all close-ups: `b3\j1.json`, `j2.json` → `r_*.png`, contact sheets `s_*.png`). Scale of each scan from a written figure on it (05 03_2: 12.07-12.2 px/mm by the rim's 3.8; 05 03_9: 16.9 by its 14.6; 05 04_6: 33.0 by 6.78; 05 04_4: 16.7-17.6 by 6.3/6.1).

**Versions:** last, first, 1943 and 6mx share the rim, masses, timing screws, hairspring, collet, stud, rollers and balance jewels (solids identical); first/6mx/1943 swap the 1946 staff + hub (05 04 02) for the 1941 staff + brass collar (05 04_5) and stand 0.3 higher (SH1); 3955 has plain-topped masses with two poising holes and a steel impulse roller (photographs, not sheets). 6mx's upper endstone setting is steel and its endstone a ruby (photograph).

**Which sheets apply:** 05 03_1 (127-556.04 U09, Unruh kompl.) is the lever chronometer's balance assembly (its cock, double roller with Hebelstein): its balance plan (four masses 30° off the 3-9 line, Ø 6,35 boxed, the timing screws on the 12-6 line) and its stud detail agree with the detent chronometer's, so used only as corroboration. 05 03_3-1 (17 04 01, a 5,73-long staff, "Rundstahl 2") is another instrument's staff: not this model's. 05 03_3-2 (050401, 13.3.65) is a later production staff: the model borrows its pivots and end-to-seat lengths. 05 03_5 (U06) and 05 03_7 (Spiralkurve) carry lever-chronometer numbers but draw this spring (05 03_6's strip, 15 turns) and are used (README holds this). 05 04_5 (040401-1, 1941) is the first-drawn staff, built in first/6mx/1943.

## balance: rim and arm (Unruhreifen 05 03 01-1 = 05-03/Wempe_05-03_4.jpg; Unruh 05 03 01 = 05-03_2)

| feature | sheet (text, where) | model (measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| rim outside | 32,32 −0,04 (05 03_4 side) | r 16.150 → Ø32.30 | middle | match | sure |
| joint steel/brass | 31,29 −0,04 | r 15.635 → 31.27 | middle | match | sure |
| rim inside | 30,48 +0,04 | r 15.250 → 30.50 | middle | match | sure |
| rim height | 3,8 | y −26.60..−22.80 = 3.80 | 0 | match | sure |
| arm thickness | 1,15 (comma low) | y −23.95..−22.80 = 1.15 | 0 | match | likely (reading) |
| arm width at rim | 3,2 | 3.2 at the rim's inside (outline) | 0 | match | sure |
| arm width "4" | 4 | 4.000 at 6.13 out (sliced) | 0 | match | sure |
| hub apex | 6,5 (extension lines at the two points) | 6.500 at the centre (sliced) | 0 | match | sure (crops\04_hub.png) |
| flank arcs | 20 r, centre marked | arcs r 20 (widths 5.215 at 2, 4.431 at 4 out) | — | match | likely |
| arm straight part 3.2→4 | drawn tapering (scaled) | straight taper 3.2 at the rim to 4.0 at 6.13 | — | match | likely |
| centre hole | plan "2 H7 +0,009"; side view leader "1,8 Ø H7" | Ø2.008 (sliced) | — | match to plan (1946 staff's Ø2 h6 shoulder) | sure (conflict on sheet recorded in transcription) |
| hub holes | Ø1 at 2,14 +0,02 either side; left drawn double-ringed (sink), right drawn dark | Ø0.999 at ±2.140, both countersunk 90° Ø1.8 × 0.4 | right's sink a reading | match | likely |
| rim cuts | 1,5 +0,2, at 90° from the arm, drawn as parallel lines | 1.6 at the joint radius, but cut by an **angle** (gap/r1, escapement.js:333, 337): walls radial, 1.56 at the inside, 1.65 at the outside | ±0.05 | within tol., not parallel | sure |
| timing-screw hole through the rim | Ø0,9, 0,16 Steigung, at 2,15 over the lower face (side view, crops\04_side.png) | **no hole**: slices of the steel and brass halves at y −24.95 (the screw's axis) show the rim solid (loops 1445/1414 points, no inner loop); the screw's shank passes through metal | — | **MISSING** | sure |
| graduation | "8 Körner in 60 Teilung" (ticks round the lower half) | none | — | missing (README: no photograph resolves it) | sure |
| arm along 12-6 at rest | 05 03_1 note | yes (update) | — | match | sure |
| RGG decal | not on sheet | on the arm (3955 photo) | — | extra, recorded | holds |

## balance: masses, their screws, timing screws and weights (05 03_2; 05 03_1 for corroboration)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| mass Ø | 05 03_2 scales 6,3; 05 03_1 (lever balance) **6,35 boxed** | Ø6.30 (r 3.15, line 358) | −0.05 | within reading (boxed 6,35 is the lever's) | likely |
| mass place | 05 03_2 scales ≈32°; 3955 30° | 30° from the cuts' line, centres r 15.70 | — | recorded (photo), holds | likely |
| mass height | side view: arm face to 6,33 (crops\02_side_mass.png, 12.2 px/mm) | 0..6.46 over the arm face | +0.13 | within reading (README) | likely |
| mass end chamfer | ≈0.4 drawn at the outer top corner | none | — | missing (recorded, "1 % of a mass") | likely |
| WN-12a tapped hole in the top | double circle at the centre | M1.2 2.0 deep, 90° sink Ø1.85 | — | match | likely |
| **WN-12 radial screw's height** | 05 03_2 side view: head centre **1,85** over the arm face (head Ø1.84 at x 190-325 of 6× crop, face 122, rim 400: 73.2 px/mm; the head 1.6 above the mass's centre line as a radial screw at 30° should be) | yS = FY−2.45 → **2.45** (line 389, "05 03_2's slotted head 2.83") | +0.60 | **WRONG** for the drawings' versions (the comment's 2.83 isn't on the sheet) | likely (poor copy, ±0.1) |
| WN-12 head | rectangle at the outer edge, flush | Ø1.6 flat disc 0.55 deep sunk in the round face | — | match in place; **ARTIFACT** in form (below) | sure |
| WN-12 hole in the jaw | dashed hole radially through the outer jaw | not cut ("drawn without its hole", line 387) | — | missing, recorded | sure |
| timing screws on the arm line | yes, both ends | yes | — | match | sure |
| timing screw height | 2,15 (05 03 01-1) | yS = FY−2.15 | 0 | match | sure |
| screw Ø / tip | Ø0,9; 42,1 over both tips | Ø0.90, tips at r 21.05 (42.1) | 0 | match | sure/likely |
| screw head inside the rim | slotted head 1.54 × 1.29 scaled (crops\02_ts.png) | Ø1.65 × 1.3 | ~0.1 | within reading | likely |
| **weight Ø** | both weights scale **Ø4.2-4.25** × 3.28-3.30 (crops\02_ts.png bottom: 51 px; 02_ts_top.png top: 51 px at 12.07 px/mm) | Ø3.80 × 3.30 (split(1.9, …), line 415; comment: sheet "Ø 3.5 and 4.3", photos 3.0-3.9) | −0.4 | **WRONG** for the drawings' versions (the "3.5" isn't on the sheet: both measure 4.2) | likely |
| weight to tip | 0,8 (tip beyond the weight) | 0.8 | 0 | match | likely |
| weight to rim | ≈0.9-1.1 gap | 0.80 | ~0.2 | within reading | unsure |
| weight saw cuts | from outer end 1.33 deep, inner end 1.62 deep, drawn off-centre | 1.3 / 1.7, across the diameter at right angles | — | match (depths) | likely |

## balance: staff and hub (05 04 02 = 05-04/Wempe_05-04_04.jpg, last; 05 04_5 first/6mx/1943; pivots 05 03_3-2)

| feature | sheet | model (lathe profile, line 422-423; dump) | diff | verdict | sure |
|---|---|---|---|---|---|
| upper arm | Ø(1,1) end, Kegel 1:30 to Ø1,2 ±0,02 at the 1,58 step (the "1,2" written just above the step, crops\0404_top.png, 0404_mid.png) | Ø1.1→1.2 over 3.0, then a **cylinder Ø1.2 × 1.53** to the step | shape | **WRONG (minor)**: one 1:30 taper from Ø1.2 at FY−6.1 up to the cone (Ø1.049 at tipU+2.4) | likely |
| collet seat | 6,1 above the flange top, Ø1,58 → 1,65 s6 on 1:70 | Ø1.58 → 1.645 over FY−6.1..FY−1.1 | s6 middle 1.6685 | line-to-line (model convention for press fits) | sure |
| shoulder | Ø2 h6 × 1,1 | Ø2.0 × 1.1 | 0 | match | sure |
| hub flange | Ø6,3 −0,1 × 1,8, 2 × M1 | Ø6.25 × 1.8, holes Ø1.04 at ±2.14 | middle | match | sure |
| hub neck | Ø2,63 −0,06 to 4,1 +0,05 | Ø2.60 to 4.10 | middles / lower limit | match | sure |
| staff in hub | Kegel 1:70 from Ø2 | 2.0 → 2.059 | 0 | match | sure |
| collar | Ø2,14 +0,01, 4,1 to 5,6 (faint "1,5") | Ø2.14, 4.1-5.6 | 0 | match | sure |
| impulse roller seat | Ø1,65 s6 | Ø1.65, 5.6-7.2 | line-to-line | match | sure |
| discharge roller seat | Ø1,2 r6 | Ø1.2, 7.2-8.8 | line-to-line | match | sure |
| lower arm | Kegel 1:70 to the end (Ø1,1) | Ø1.2 → 1.1 over 1.63 (1:16) to the cone | shape | **WRONG (minor)**: 1:70 gives Ø1.177 at the cone's top | likely |
| pivots | 05 03_3-2: Ø0,21 × 0,4, cone 2 long, **concave** (detail 10:1, a radius "6" from a centre on the pivot's shoulder line, crops\32_piv.png) | Ø0.21 × 0.4, cone 2.0 **straight** (Ø1.1 → 0.21) | form | **WRONG (minor)**: concave cone, tangent to the pivot | likely (the "6" read as R) |
| pivot ends | 05 03_3-2: 13,0 above the seat line, 12,6 −0,02 below (25,6 −0,02 overall) | 13.03 above, **12.83 below** (25.86) — set by the endstones (tipU/tipL, line 278) | +0.23 below | conflict to settle (lower lug/endstone height against the only finished staff); see findings | likely |
| first: collar | 05 04_5: neck Ø2,1 ±0,03 1,3 over the flange, flange Ø6,3 × 1,8 straight 0,4 then 10°, tube Ø2,6 ±0,03 to 4,7 −0,05 boxed | neck Ø2.0 × 1.15 (estimated: arm's 2 H7, flush), flange as drawn, tube Ø2.6 to 4.7 | neck −0.1 Ø, −0.15 high | recorded estimate; the sheet's half section is ambiguous whether 2,1 is the neck or the staff (crops\05_mid.png) | unsure |
| first: hub screws | none on 05 04_5 | arm's two holes empty | — | match, recorded | sure |

## hairspring (05 03_6 Spiralfaden; 05 03_7 Spiralkurve; 05 03_5 heights)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| strip | 0,52 × 0,285 boxed | HB 0.52, HT 0.285 | 0 | match | sure |
| coil Ø | 12,8 ±0,05 boxed (12,23 inside) | RC 6.2575 + 0.1425 = 6.40 at rest (6.31 in the dump: breathing at the dump's phase) | 0 | match | sure |
| pitch | 0,52 + 0,21 = 0,73 | 0.73 | 0 | match | sure |
| hand | "15 Windungen links" | left-hand | — | match | sure |
| turns between curves | 05 03_7: "13 Umgänge −3,5 mm" before bending | 11.80 (whole strip read; README) | — | recorded reading, holds | likely |
| terminal curves | 05 03_7 table every 10°, pinning 220° boxed | TBL identical (line 150), both ends | 0 | match | sure |
| curve end | drawn on to ≈250-255° (3,37 at 230-250) | inner end at TE_L ≈242°, outer ≈235° (line 152) | ~10-20° short | within reading | likely |
| heights | 05 03_5: stud bar underside to collet's lower face 13,4; top curve 3,15 under the bar; lowest coil 0,75 over the collet's face (crops\05_side.png) | collet face 13.35 under the bar (−37.35 → −24.00); spring end 0.75 over it; top curve 3.99 (centre) under the bar | 0.05; top +0.84 | match; top recorded (fewer turns) | sure |
| inner end in the collet | in the collet's hole Ø0,8 at 3,5 | strip end r 3.51 runs **through solid brass** of the collet (258 strip vertices inside the collet's outline over its height, 3.13-3.75 along the bar) | — | consequence of the missing hole (below) | sure |
| outer end in the stud | in the upright's slot with the pin | in the slot, no strip vertex inside the stud | — | match | sure |

## collet (Spiralrolle 05 03 02-2 = 05-03_8)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| length | 9,1 −0,2 | 9.10 (±4.55, ends arcs about the bore) | upper limit | within tol. (middle 9.0) | sure |
| widths | 3,8 −0,2 / 2,7 −0,2 | 3.8 / 2.7 at the ends' corners | upper limits | within tol. | sure |
| height | 3,3 | 3.30 (y −27.30..−24.00) | 0 | match | sure |
| slit | 0,2 +0,1, ends 0,1 +0,05 from the bore | 0.25, 0.125 (middles) | — | match | sure |
| bore | **1,6 H7 +0,009, Kegel 1:70, (1,55) at the other face** | Ø1.648 straight (line 475, rb) | +0.04-0.05 | **WRONG / conflict**: the sheet's bore can't sit at the arm on the 1946 staff's seat (Ø1.649 there); unrecorded | sure (sheet), see findings |
| pin hole | **Ø0,8 +0,01 (0,7 drilled), Kegel 1:90, across the bar's width at 3,5 −0,02 from the bore, 0,75 ±0,05 from the face, centre-punched** | **not cut** ("the hole across isn't drawn", line 473) | — | **MISSING** | sure |
| taper pin (Spiralstift 05 03 02-4) | fills the Ø0,8/0,77 hole beside the spring's end | Ø0.22 × 1.2 at **r 3.20** (line 482), wholly inside the solid bar (hidden) | Ø −0.55, place −0.3 | **WRONG** | sure |

## stud (Klötzchen 05 03 02-3 = 05-03_9)

| feature | sheet | model (sliced in the stud's frame) | diff | verdict | sure |
|---|---|---|---|---|---|
| bar length | 14,6 −0,2 | 14.595 | upper limit | within tol. | sure |
| width at hole / square end | 3,1 −0,2 / 2,5 −0,2 | 3.10 / 2.50 | upper limits | within tol. | sure |
| bar thickness | 1,6 −0,2 (side view) | 1.60 | upper limit | within tol. | sure |
| hole | Ø1,5 H7, 5 ±0,1 from the square end | Ø1.509 at 4.995 | 0 | match | sure |
| V apex | 6,6 −0,2 from the hole | 6.60 | 0 | match | sure |
| point facets / knife edge on the cock face | section: underside of the point bevelled from the apex to the tip on the cock-side face | facets from the V's arms to an edge 0.05 over the cock face | — | match | sure |
| point round | "0,8" at the point (drawn ≈Ø0.4-0.8) | sharp (left out: "facets leave no room", line 487) | — | missing; the reason is weak (the round is a plan feature) | likely |
| upright thickness | 1,8 g6 | 1.79 | g6 middle 1.7935 | match | sure |
| upright across | 1,9 −0,2 | 1.86 | — | within tol. | sure |
| upright to its end | 6,1 −0,2 from the bar's top | 6.10 | upper limit | within tol. | sure |
| lean | 98° | 8.0° (sliced: v shift 0.59 over 4.2) | 0 | match | sure |
| slot | 1,2 −0,1 | 1.15, 2.0 deep (depth estimated: no floor line on the side view) | — | match | sure |
| pin hole | Ø0,7 drilled at assembly, ≈0.69 from the end, tangent to the slot's outer wall (crops\09_upend.png) | pin Ø0.66 × **0.8** in the slot against its outer wall, 0.52 from the end (line 505) | length | within reading; pin 0.8 long in a 1.8-thick upright (estimate) | likely |
| screw WN-11 | coloured section | Ø2.3 head, M1.4 | — | recorded | likely |

## rollers (Heberolle 02 04 02 = 05-04_6; Auslöserolle: no sheet, 05 04_1 dashed)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| Ø | 6,78 ±0,01 | 6.780 (r 3.390) | 0 | match | sure |
| thickness | 1,6 +0,1 | 1.60 (y −17.2..−15.6) | lower limit | within tol. | sure |
| bore | 1,627/1,65 −0,03, Kegel 1:70 aufreiben | Ø1.652 straight | 0.02 taper | within (line-to-line on the seat) | sure |
| recess | corners 1,5 / 2 either side of the face (3,5), bottom 3,5 r (crops\06_stone.png) | corners at −1.5 (stone's side) and +2.0, arc r 3.5, lowest 2.41 from the centre (sheet scales 2.42) | 0 | match | sure |
| stone | 0,5 thick, face on the centre line, 1,55 to its foot, 1,8 long, end bevelled | face offset 0.00006; 1.55-3.35; back to 2.85 (sheet scales 2.80) | 0.05 | match | sure |
| stone width | 1,7 axial | 1.70, 0.05 proud each face | 0 | match | sure |
| hole | Ø1,3 at 1,9 below, 0,7 toward the stone's side | Ø1.299 at 1.900 / 0.700, stone's side | 0 | match | sure |
| first/6mx/1943 heights | 05 04_1 elevation: under the collar, 1,6 each | FY1+4.7..6.3, 6.3..7.9 | — | match (figures over scaling, recorded) | likely |
| discharge roller | 05 04_1 dashed 2.77 × 2.15, 1,6 thick, stone 1,7 | stadium 2.76 × 2.15 × 1.6, stone 1.7 | — | match (no sheet) | likely |

## balanceJewelsUp / balanceJewelsLow (no sheet of their own in the set; U30 = 05-08_06, U31 = 05-08_33 are the lever chronometer's cocks; the coloured section)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| upper settings | U30: 0,1 proud + 1,4 + 1,4 (+0,5), Ø5,2 seats, two screws | endstone setting 1.6 (0.1 proud), hole-jewel setting 1.2, Ø5.2 | split differs, recorded estimate | holds | likely |
| lower settings | U31 Schnitt C-D: 1,4 + 1,4, 0,1 proud, 0,5, screw heads 2,5 | hole-jewel setting 1.77, endstone setting 0.95, flush with the lug | split differs | open reading (U31 is the lever version; not judged as wrong) | unsure |
| stones | coloured section Ø2.9, 0.8 | Ø2.9 × 0.8, endstone Ø2.9 | 0 | match (traced) | likely |

## Ranked findings (WRONG / MISSING / ARTIFACT)

1. **MISSING – collet: the spring's taper-pin hole, and the pin is the wrong size in the wrong place.** 05 03 02-2 (05-03/Wempe_05-03_8.jpg, 10:1): plan "3,5 −0,02" from the bore to a hole drawn dashed right across the bar's width, "0,8 Ø +0,01", "0,7 bohren", "Kegel 1:90", "90°"; elevation: the hole "(0,77 Ø)" end-on "0,75 ±0,05" from the face, "Körner anbringen". Model: no hole (escapement.js:473 "The hole across isn't drawn"); the pin 050302-4.c is Ø0.22 × 1.2 at r 3.20 (escapement.js:482), entirely inside solid brass (invisible, r_col_*.png show no hole), and the spring's inner end (r 3.51) runs 0.6 through solid metal (258 strip vertices inside the collet). Correction: bore the collet across its width (axis `pp`, through the full width, ±1.45 at that place) at `L(3.5,·)` along `ax` from the bore, y = colB − 0.75, Ø0.8 tapering to 0.77 over the width (1:90), with WFUSEE.bore as the frame files do; pin: a taper pin Ø≈0.45→0.40 (filling the hole beside the 0.285 × 0.52 strip; estimated) × 3.0 at r 3.5 on the same axis, beside the strip's end on the side away from the staff.
2. **MISSING – rim: the timing screws' tapped holes.** 05 03 01-1 (05-03/Wempe_05-03_4.jpg) side view: "0,9", "0,16 Steigung", "2,15" over the lower face, the hole drawn through the rim at the arm's end (crops\04_side.png). Model: the comment says "in its tapped hole Ø 0.9, 0.16 pitch" (escapement.js:395) but the steel and brass halves are solid there (slices at y −24.95 have no hole); the screws' Ø0.9 shanks pass through metal. Correction: bore each half radially at the arm's ends (axes `dir(90)`, `dir(270)`, y = FY−2.15) Ø0.9 through r 15.25-16.15 (tapped M0.9 × 0.16, or plain at the minor Ø0.73 with a thread decal as the Wempe's ISO threads are done).
3. **WRONG – timing weights' diameter.** 05 03_2 (05-03/Wempe_05-03_2.jpg, 5:1, 12.07 px/mm): both weights measure Ø4.2-4.25 × 3.3 (crops\02_ts.png, crops\02_ts_top.png: 51 px wide each). Model Ø3.8 (escapement.js:415, `split(1.9,…)`; comment line 400 "05 03_2 scales its two Ø 3.5 and 4.3"): no weight on the sheet scales 3.5. Correction: `split(2.1,…)` (Ø4.2) in the drawings' versions; keep 3.8 (or 3.5, the photographs' 3.0-3.9) for 3955 if the photograph decides there. Check fine.py against the masses and the cock.
4. **WRONG – mass screws (WN-12) height.** 05 03_2 side view (crops\02_side_mass.png): the head's centre 1.85 over the arm face (the rim's face line at 122, its other face at 400 for 3.8; the head 190-325 at 6×), consistent with its 1.6 offset above the mass's centre line in that view (a radial screw at 30°). Model yS = FY−2.45 (escapement.js:389), its comment citing "05 03_2's slotted head 2.83". Correction: FY−1.85 in the drawings' versions (3955 keeps its photographed 2.55 if built separately); re-check that the shank still lands on the rim (it does: 1.85 is inside 0-3.8).
5. **WRONG / conflict – collet bore Ø1.648 straight against 1,6 H7 tapered 1:70 to 1,55.** 05-03_8 elevation "1,6 Ø H7 +0,009", "Kegel 1:70", "(1,55 Ø)". The model's bore (escapement.js:475 rb = 0.8225+0.0015) suits the 1946 staff's seat at the arm (Ø1.649), not the sheet; nothing records the departure. On the staff's 1:70 seat a 1.6 bore stands 3.5 above the seat's foot, so the two sheets (1943 collet, 1946 staff) disagree about where the collet sits; 05 03_5's 13,4 and 0,75 put the collet's face at the arm, as built. Correction: record it in README's Readings corrected/Unresolved (collet bore vs staff seat) and taper the bore 1:70 (Ø1.648 at the arm face to 1.601 at the other) so it at least follows the seat, or keep and record.
6. **ARTIFACT – z-fighting ring where the hub's neck sits on the staff's collar.** The staff's collar top (r 1.0293-1.07 at y = Y.hubB, escapement.js:423) and the hub neck's underside (r 1.0309-1.30 at the same y, escapement.js:429) are coplanar over r 1.031-1.07: a serrated band round the joint (b3\r_hubz_1.png, r_hubz_3.png, r_hubz_4.png, s_hubz.png). Correction: stop the collar's top annulus at the hub bore (end the collar step under the hub, e.g. the collar's shoulder at Y.hubB+0.005, or the hub's underside annulus starting at r 1.07), or join them as batch 2 did for touching faces.
7. **ARTIFACT – WN-12 heads read as two crescents.** The flat Ø1.6 head sits on the mass's round outer face (0.02 under at its middle, 0.08 proud at its sides: escapement.js:384-392), so the render shows the head's face only at two crescents with a slot stub between (b3\r_balt_2.png, r_balm_5.png). 05 03_2 draws the head sunk flush in a counterbore. Correction: counterbore each mass radially (WFUSEE.bore along u, Ø1.62, 0.55 deep from the outer face) and set the head's face on the cylinder's outermost line, or give the head a face curved to the mass's r 3.15.
8. **WRONG (minor) – staff upper arm shape.** 05 04 02 (05-04/Wempe_05-04_04.jpg): "Kegel 1:30" along the whole upper arm from the blank's end Ø(1,1) to "1,2 Ø ±0,02" at the 1,58 step. Model: 1:30 over 3.0 then a Ø1.2 cylinder 1.53 long (escapement.js:422, points [0.55,tipU+2.4]→[0.6,FY−7.63]→[0.6,FY−6.1]). Correction: [0.6,FY−6.1] straight to [0.5245,tipU+2.4] (1:30 over 4.53), the cone from there.
9. **WRONG (minor) – staff lower arm taper.** 05 04 02 "Kegel 1:70" on the lower arm; model Ø1.2→1.1 over 1.63 (1:16) (escapement.js:423, [0.6,Y.dr1]→[0.55,Y.tipL−2.4]). Correction: [0.5884,Y.tipL−2.4] (1:70).
10. **WRONG (minor) – pivot cones straight, sheet concave.** 05 03_3-2 (05-03/Wempe_05-03_3-2.jpg) 10:1 detail: the cone 2 long from Ø≈1.1 to the Ø0,21 pivot is concave, a radius "6" marked from a centre on the pivot's shoulder line (crops\32_piv.png; the "6" read as R, unsure). Model straight (escapement.js:422-423, both ends; r_staff_1.png, r_staff_2.png). Correction: the profile an arc tangent to the pivot (centre on the shoulder line), through the cone's top: R ≈ 4.7 for Ø1.1 at 2.0 (R 6 reaches Ø0.9), 12-16 points.
11. **Conflict – lower pivot 0.23 longer than the only finished staff.** 05 03_3-2: 12,6 −0,02 from the seat line to the lower end (25,6 −0,02 overall; 13,0 above, which the model matches at 13.03). Model: tipL = −9.97, 12.83 below FY (escapement.js:278), set by the lug's endstone (balanceJewelsLow, TI+10). 05 04 02's blank (14,03) doesn't fix the finished length. Not a model error by itself; record in Unresolved and check the lug's height (batch 2's lowerCock, 05 08 00-2) against 12.6 + 0.02.
12. **MISSING (minor) – stud's round point.** 05 03 02-3 plan "0,8" at the point (drawn about Ø0.4-0.8, crops\09_tip.png). Model sharp, the reason (escapement.js:487-488, "facets leave no room") doesn't hold: the round is the plan outline's, the facets can still meet it at its 0.05 edge. Correction: round the outline's tip r 0.4 (if "0,8" is a Ø; r 0.8 if a radius) before the facets cut it.
13. **Minor – rim cut walls radial, sheet parallel.** 1.56 at the inside, 1.65 at the outside (escapement.js:333, 337: an angle gap/r1); 05 03_4 draws two parallel lines 1,5 +0,2. Correction: cut each end with a straight line offset ±0.8 from the cut's centre line.
14. **Minor – the impulse roller's bore and staff seats are straight and line-to-line** (sheet 1:70 tapers, s6/r6 press fits): a deliberate convention so solids don't overlap; not to change.
15. **Minor – stud pin 0.8 long** in the 1.8 upright's slot (escapement.js:505; sheet's Ø0,7 hole runs through the upright's 1.8). Correction: 1.8 long (estimated, the pin through both walls' line, in the slot against its outer wall).

Recorded departures judged: the hairspring's 11.80 turns (05 03_7 reading) and its top curve 3.99 under the stud (holds); the mass Ø6.3 (05 03_2) against the lever balance's boxed 6,35 (holds, within reading); the masses 0-6.46 high (holds); the first collar's neck Ø2.0 × 1.15 (estimate, sheet ambiguous: holds); the rollers' 1941 heights (figures over scaling: holds); upper jewel settings from U30 (holds); WN-12's hole not cut (recorded, but see 7); the staff's pivots borrowed from 05 03_3-2 (holds).

## Renders

`b3\`: s_bal.png (balance plan from both sides, obliques), s_balh.png (hub close-ups), s_balm.png and s_balt.png (masses, WN-12 heads, timing screws and weights, rim cuts), s_hubz.png (the hub/collar z-fight), s_staff.png (staff alone: pivots, steps), s_hs.png (hairspring with stud), s_col.png (collet: no pin hole), s_stud.png, s_stup.png (stud, its upright's slot and pin), s_rol.png (rollers), s_jw.png (balance jewels), s_balF.png (as first drawn: collar, empty arm holes), r_bal3955_*.png (3955's masses). Crops of the sheets in `b3\crops\`.

## Sheets reviewed

- 05-03/Wempe_05-03_1.jpg — 127-556.04 U09 / 0403 Unruh kompl. (lever chronometer) — balance plan (masses at 30°, 6,35 boxed, timing screws on 12-6), stud detail (8,2°, 3,15, 6,0), section (0,75 spring clearances, hub screws countersunk); corroboration only
- 05-03/Wempe_05-03_2.jpg — 05 03 01 Unruh — plan (arm, hub holes, masses, WN-12/12a, timing screws and weights, 42,1, 39) and side view (mass height 6,33, WN-12 head height 1,85, timing screw 2,1) measured against the solids
- 05-03/Wempe_05-03_3-1.jpg — 17 04 01 Unruhwelle — opened; a 5,73-long staff of another instrument, not compared
- 05-03/Wempe_05-03_3-2.jpg — 050401 Unruhwelle kpl. (1965) — pivot detail (0,21 × 0,4, cone 2, concave, "6"), 13,0 / 12,6 / 25,6 against the model's pivot ends
- 05-03/Wempe_05-03_4.jpg — 05 03 01-1 Unruhreifen — every rim and arm figure against the sliced solid; timing-screw hole (missing); hub holes; cuts; graduation note
- 05-03/Wempe_05-03_5.jpg — 127-556.04 U06 Spiralfeder kompl. — heights 13,4 / 3,15 / 0,75 / 9,5 against the spring, collet and stud; pinning points in plan
- 05-03/Wempe_05-03_6.jpg — 127-556.04-021 / 020310 Spiralfaden — strip, Ø, pitch, turns, hand
- 05-03/Wempe_05-03_7.jpg — So. 040310 Spiralkurve — radii table against TBL, pinning 220°, curve end, the 13 turns − 3,5 note
- 05-03/Wempe_05-03_8.jpg — 05 03 02-2 Spiralrolle — outline, widths, length, slit, bore 1,6 H7 1:70, the pin hole Ø0,8 1:90 at 3,5 / 0,75 (missing)
- 05-03/Wempe_05-03_9.jpg — 05 03 02-3 Klötzchen — every figure against the sliced stud; section's bevel; point round; upright's hole and slot
- 05-04/Wempe_05-04_04.jpg — 05 04 02 Unruhwelle kompl. — every diameter, taper and length against the staff's lathe profile and the hub
- 05-04/Wempe_05-04_05.jpg — 040401-1 Unruhwelle (1941) — collar figures against the first-drawn collar
- 05-04/Wempe_05-04_06.jpg — 020402 Heberolle — every figure against the sliced roller and stone
- 05-04/Wempe_05-04_01.jpg — Hemmung für Federchronometer — elevation (rollers 1,6 / 1,6, 4,1 to the seat, first-drawn heights), discharge roller outline, stone widths 1,7
- 05-08/Wempe_05-08_06.jpg — 127-556.04 U30 Unruhkloben oben kompl. — upper jewel settings' split (0,1 + 1,4 + 1,4 + 0,5)
- 05-08/Wempe_05-08_33.jpg — 127-556.04 U31 Unruhkloben unten kompl. — lower settings' split (1,4 / 1,4 / 0,1), against balanceJewelsLow
- Wempe_Einheitschronometer.jpg — coloured section — balance assembly (masses, WN-12a, timing screws, hub screws WN-10, collet, spring, stud WN-11, jewels); its balance heights don't scale to the sheets (rim drawn ≈3.2 high), so used for arrangement only
- 001-002/Wempe_001.jpg — Federchronometer general arrangement — balance in plan (masses, arm, timing weights); arrangement only

## Sheets not reviewed

- 05-04/Wempe_05-04_20.jpg, 05-04/Wempe_05-04_21.jpg — the lever chronometer's escapement and lever (excluded by the ledger; not opened)
- 05-04/Wempe_05-04_02.jpg, _03, _07-1, _07-2, _08, _10-1, _10-2, _23 — batch 4's parts (gold spring, detent block, escape wheel, detent); 05-04_01 was read here only for the balance's rollers and heights
- 001-002/Wempe_002.jpg — the lever chronometer's general arrangement, not opened
- (Index.md's balance-jewel row cites 05-08_06/_33 with derived figures, not a source; Missing_details.md lists the same sheets as above)
