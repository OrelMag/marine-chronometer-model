# The Wempe's parts against their drawings and photographs

Started 25 October 2026: every part of the Wempe Einheits-Chronometer model, as last revised, compared with its works drawing (`References/wempe/drawings/`, read off in `References/wempe/transcriptions/`) and checked against photographs of real ones (`References/wempe/photos/`, chiefly Wempe 3955; `tools/photocompare/`). It follows the sheet-by-sheet pass of 15 October 2026 (RESOLVED.md, the Wempe's entries) and the photographs of 18 October (README, "Wempe 3955 as photographed"), after the changes since (the physics pass, the builds, the Steg, the jewels, the transit lock). Nothing that pass settled was found to have drifted.

The drawings decide the geometry; a photograph shows one clock, so where it differs from a sheet the difference is recorded as that clock's, not the model's error. Parts are taken in order of their effect on the timekeeping. Fixes go in in batches of five or six, each batch checked and released; each fix has its entry in RESOLVED.md.

Columns: the part (its `hn`), its sheets, the photographs it was checked on (photocompare.py's fitted views: `w3955_hem_1`, `hem_2`, `detentBlock`, `train`, `W`, `A`, `uZ`, `topIn`), the verdict, how sure, and what was done or is left. Batch 1 (the escapement) was released as 3.28.03 on 25 October 2026; batch 2 (the train's fits, the case and gimbals) follows.

## Escapement, balance and hairspring (05 03, 05 04)

| Part | hn | Sheets | Photographs | Verdict | How sure | Done / left |
|---|---|---|---|---|---|---|
| Rim and arm | 050301-1 | 05 03_4 | hem_2 (rms 6 px, 0.07 mm/px) | matches; the cut was 1.5, the fit's middle 1.6 | sure | cut 1.6 (batch 1) |
| Masses (WN-12), timing screws and weights | 050301-2/-3/-4 | 05 03_2, _4 | hem_2 | match | likely | — |
| Staff and hub | 050402-1/-2 | 05 04 02, 05 03_3.2 | hem_2 (pivot within 0.15) | match; the lower arm's taper 1:16 against 1:70, the blank's turning (the 1:70 can't fit the length) | sure | note only |
| Hairspring | 050302-1 | 05 03_5, _6, _7 | hem_2 | section matches; its length against its period open (0.494 s; 05 03_5's 13.0 turns of helix) | sure / open | README Unresolved (batch 1) |
| Collet | 050302-2 | 05 03_8, 05 03 02-2 | — | bore 1.648 against the sheet's 1.6 H7, to sit on the 1946 staff's seat | sure | README Estimated (batch 1) |
| Stud | 050302-3 | 05 03_9 | recorded | matches | likely | — |
| Impulse roller and stone | 050403-1/-2 | 02 04 02, 05 04_6 | hem_2 | matches; the layout's stone end 3.33 against 3.35 | sure | `SIMP` 3.35 (batch 1) |
| Discharge roller | 050404-1/-2 | 05 04_1 (scaled) | — | the recorded estimate | estimate | — |
| Escape wheel | 050405-1 | 05 04_23, _7.2, _1 | hem_1 (tips 0.38 mm rms) | matches | sure | — |
| Escape arbor and pinion | 050405-2 | 05 04_7.2 | hem_1, the arbor's crop | pinion built 3 (05 04_7.1's), 05 04_7.2 draws 4.0, Wempe 3955 4.3 | likely | 4.0, and its mesh relation in bom.json (batch 1) |
| Escape collet | 050405-3 | 05 04_7.2 | hem_1 | matches | likely | — |
| Detent | 050401-1 | 1436 | detentBlock (rms 3.8 px, 0.03 mm/px) | spring 0.07 throughout where 1436 draws 0.09 at its ends; foot, blade, horn at the unbracketed heights | sure | tapered, heights 1.9/0.9/0.75 (batch 1) |
| Locking stone | 050401-3 | 05 04_1 | detentBlock (0.13 mm) | matches | likely | — |
| Gold spring | 050401-2 | 05 04 01-2 | detentBlock | matches | sure | — |
| Detent block (1943) | 050401-4 | 05 04 01-4 | detentBlock (Wempe 3955 has the 1941 block: its version) | matches the figures; projection still Unresolved | likely | — |
| Balance jewels | 050406/7/8 .bu .bl | none (coloured section) | — | holes 0.04 over the pivot against the stated 0.02 | estimate | 0.02 (batch 1) |
| Escape jewels | .eu .el | 05 09 01, 05 08 02-1 | — | holes 0.03 over; endshake 0.04 against the 1958 Soviet repair book's 0.05-0.07 | estimate | holes 0.02 (batch 1); endshake: batch 2 |

## Fusee, mainspring, chain and maintaining work (05 06, 05 07)

| Part | hn | Sheets | Photographs | Verdict | How sure | Done / left |
|---|---|---|---|---|---|---|
| Fusee body | 050604-2 | 05 06 04-2, 05 06 04 (rev. a, 1948), 05 06_20 | train (rms 2.4 px, 0.11 mm/px) | every figure matches; the groove's floor measured off the built solid (`tools/wempe_fusee_profile.py`): each whole turn within +0.002 to +0.021 of the sheets' radii, the working lands within 0.016 of 05 06_20's curve (rms 0.010, the sheet's ±0.05), the pitch 1.1991 (1,2 ±0,01); its place on the arbor: 05 06 04's 13.7 −0.1 from the large end to the top shoulder and 0.5 +0.05 to the click wheel against the model's 13.46 and 0.75; the 3 M2, M1.7, the 0.5 H7 and the chain pin's holes not cut | likely (place), sure (holes) | place: README Unresolved (two readings; the one that fits every figure needs the ratchet's rim checked); holes: batch 4 |
| Fusee arbor | 050604-1 | 05 06 04-1 | — | matches; its Ø 1.1 cross hole not cut | sure | batch 3 |
| Vorreiber | 050600-2 | 05 06 00-2 | not visible | matches; its Ø 0.8 pin hole not cut | sure | batch 3 |
| Dust plate | 050600-1 | 05 06 00-1 | — | matches, less its 0.5 × 45° | sure | batch 3 |
| Fusee wheel | 050600-3 | 05 06 00-3 | train (teeth) | matches; the tube's counterbore 0.4 deep and the far face's groove not built | unsure (the bore's figure overwritten) | batch 3 |
| Cover plate | 050600-4 | 05 06 00-4 | train | matches, less its outer 45° edge; its screw hole drawn 1.75 where the fit's middle is 1.80; its screw head looks smaller on Wempe 3955 (its version, unsure) | sure | hole 1.80 (batch 2); edge: batch 4 |
| Click wheel | 050604-3 | 05 06 04-3 | not visible | matches; its depth in the recess follows the body's place; bore 0.3 × 45° not cut | sure | batch 2 |
| Maintaining ratchet, spring, detent | 050601, 050601-1, 050505 | 05 06 01, 05 05 05 | not visible | match | sure | — |
| Maintaining clicks and springs | 050602-3, 050602-2 | 05 06 02-3, -2 | not visible | outline matches; the pivot hole's 1.7 × 45° sink and Ø 2.2 opening not built; the springs' developed length against 27.0 unverified | sure / unsure | batch 3 |
| Stop work (Steg, bar, pin, spring) | 050603 | 05 06_4 C-D, 05 06 04-2 | train (the bar's ends) | matches its trace; heights follow the body's place (the stop pin about 0.5 short then) | likely | with the body's place |
| Chain | 050704 | 05 07 04 | W (rms 2.9 px), train | matches | sure | — |
| Barrel drum and lid | 050701, 050703 | 05 07 01, 05 07_6 | W | match; the hook block's M2.6 rivet hole and the chain's 2.5 slot not cut | sure | batch 3 |
| Barrel arbor | 050702-1 | (as revised not in the set) | W (its square) | fitted to the drum and plates, as recorded; the hook pin's Ø 2 × 6 hole not cut | known | batch 3 |
| Hook block, set-up ratchet and click | 050705, 050805-2 | 05 07, 05 08 05-2 | W | match | sure | — |
| Mainspring | 050706 | 05 07 06 | — | estimated, as recorded (its torque 23 % over 05 06_20's) | known | — |

## Going train and motion work (05 05, 05 02)

All the going train's figures match the sheets as last revised at the middle of their fits: counts, modules, tips and roots, tooth thicknesses (the centre pinion's leaf 1.08 m measured, 1.05 m built), spokes and hubs, pivot diameters, shoulders 19.03, 23.0 and 24.05, centre distances 18.120, 12.630 and 11.850 (theory), endshakes 0.07, 0.06, 0.05. `gearing.js --model wempe --quick` and `invariants.py --model wempe` pass. Photographs: train (rms 2.4 px) and uZ (2.6 px): spokes, hubs, pinions and pivots' steps all as photographed, nothing missing.

| Part | hn | Sheets | Photographs | Verdict | How sure | Done / left |
|---|---|---|---|---|---|---|
| Centre arbor and pinion | 050503-2 | 05 05 03, 05 05 03-2 | train, uZ | its train-side pivot tapered 1:30; 05 05 03-2's figure reads 1:90 (re-inked, as the seconds pinion's 1:90) | likely | 1:90 (batch 2) |
| Centre wheel | 050503-1 | 05 05 03-1 | train | rim 1.3, the fit's middle 1.25 | sure | 1.25 (batch 2) |
| Intermediate and seconds arbors and wheels | 050502, 050501 | 05 05 02, 05 05 01 (rev. 24.3.48) | train, uZ | match | sure | — |
| Top-plate bushes and settings | WN-300, WN-301 | 05 08 01, 05 09 01, 05 05_1 | topIn | the seconds bush bored 0.86 (0.05 over its pivot) against the sheet's close running fit; the settings' 0.02 "under their holes" is a 31-sided lathe's flats, not a fit | sure (fit) / estimate (size) | 0.83 and 0.845 (batch 2) |
| Bridge bush and seconds jewel | WN-300.zb, 050504 | 05 08 04 | uZ | match (the transcription has their labels swapped) | sure | transcription: batch 2 |
| Cannon tube and pinion, studs | 050503-3, 050200-6/-7 | 05 05 03, 05 08 02 | uZ, Z | match | sure | — |
| Change wheel and pinion | 050202 | 05 02 02 | uZ | match; the pinion's root 0.05 under the hour wheel's tips (its root taken off the photograph, ±0.1; the proposed 5.2 lies outside that) | medium | README Estimated: a depth to watch (batch 2) |
| Hour wheel | 050203 | 05 02 03 | uZ | collar 3.585 high against 5.2 −0.1, recorded (else it meets the dial); the transcription's Ø 6.1 is 8.2 | sure | transcription: batch 2 |
| Up-and-down wheel and pinion | 050204, 050200-5 | 05 02 04 | uZ | match; the pinion's root 0.035 clear, as the sheets leave it (no effect on the rate) | sure | README Estimated: batch 2 |
| Hands, dial | 050200-1/-2/-3/-4, 050201 | 05 02 00, 05 02 01-1 | Z | match | sure | — |

## Frame (05 08, hole tables 05 09 01 and 05 08 02-1)

Every hole of both plates, both balance cocks, the barrel bridge and the intermediate bridge is at its table's place to under 0.002 mm, at its fit's middle; every section's counterbores and sinks match (A-B, C-D, G-H, L-M/E-F, P-Q, J-K, N-O). Photographs: A (rms 1.4 px, 0.15 mm), uZ (2.6 px), topIn (2.5 px): outlines within 0.2-0.4 mm.

| Part | hn | Sheets | Photographs | Verdict | How sure | Done / left |
|---|---|---|---|---|---|---|
| Top plate, pillar plate, pillars | 050901, 050802-1, 050800-1 | 05 09 01, 05 08 02-1, 05 08 00-1 | A, uZ, topIn | match; the pillar plate's C-D bore Ø 2 across, not cut (recorded) | sure | — |
| Plates' distance | dims.js `INNER` | 05 08 00-1 (19.6 ±0.01), seats 0.3 +0.03 | — | drawn at the seats' nominal 0.3: 19.0 between the inner faces where the seats' middle gives 18.97; the endshakes are 0.03 more than at the middle of the fits | sure (arithmetic) | recorded: a convention, every hole and height measured from it |
| Balance cocks | 050803-1, 050800-2 | 05 08 03-1 (15 −0.1), 05 08 00-2 | A, topIn | match, at their nominal heights (the balance's endshake 0.08 more than at the fits' middles) | likely | recorded |
| Barrel bridge, click, fusee bush, dust bush, intermediate bridge | 050805, 050801-2/-3, 050804-1 | their sheets | A, N, uZ | match (the bush's opened bore recorded) | sure | — |
| Movement ring | 050800-3 | 05 08 00-3 | A, uZ | its M2.6 holes don't open through the cone (uZ shows them open): recorded | sure | open |
| Wempe 3955's screw under hole 12 | — | — | A | a slotted head seen through the access hole where the model shows the detent block's face | low | to look at with the detent block |

## Case, box and gimbals (05 01, 51 00)

05 01_1 read at 2.45 px/mm, line centres on pixel profiles (±0.4 a reading). None of these moves the rate measurably: both gimbal periods stay far from a ship's roll (10-30 s) and the beat.

| Part | hn | Sheets | Photographs | Verdict | How sure | Done / left |
|---|---|---|---|---|---|---|
| Bowl, closing plate | 050100-1, -2 | R-05 01 00-1, 05 01 00-2 | Wempe 6161, Kirow 422, 3955 (Bakelite: its version) | match every figure; "Gewicht 350 gr." against 1.19 kg built still open | sure | — |
| Bezel and glass | 050101-2, -1 | 05 01 01 | 6161, 5377 | match (thread settled 24 October) | likely | — |
| Gimbal ring | 050100-5 | 05 01 A-B, C-D, elevation | 6161, 3955 | 3.3 × 23.2 built; the sheet 4.0 × 24.0 | likely | 4.0 × 24.0, the transit lock's pin moved to clear it (batch 2) |
| Ring bracket | 050100-6 | 05 01 | 3955 (screws 35.5) | 16.7 high, square; drawn 15.4 with bevelled ends | likely | as drawn (batch 2) |
| Case brackets | 050100-3 | 05 01 C-D, elevation, A-B | Kirow 422 (another maker's) | 8-10 too low; their blocks met the ring's band at 55.5°, so the bowl could not turn over to be wound | likely | as C-D (batch 2): the bowl turns over freely; the boss's width (A-B 12.4, the elevation 8.0) Unresolved |
| Inner pivots and lock nuts | WN-79, WN-400 | 05 01 C-D | 3955, Lange 1947 | M4, Ø 7 head, no tip, nut Ø 19 (3955's); drawn M5, Ø 9.2 head, Ø 3 tip into the boss, nut Ø 22 | likely | as drawn (batch 2) |
| Outer pivots and discs | WN-80 | 05 01 elevation; 51 00 10 | 6161, Lange 1947 | no reduced tip; drawn Ø 3.1 tips | likely | as 05 01 (batch 2); 51 00 10's other form Unresolved |
| Wooden box | Holzkasten | 05 01 note, 51 00 10 | 6161 | 185 × 185 × 180 as 05 01; 51 00 10's side 185 high (a version: open); a small pin over each pivot not built | medium | open |
| Handles | 510010 | 51 00 10 | — | the oval built as a metal plate; the sheet draws a finger recess in the wood | likely | batch 3 |
| Keys, key holder, transit lock, maker's plate | 050102, 510011, 050101.F | 51 00 11, 05 01 02, 05 01 A-B | Fig. 2.35, 6161, 3044 | match | high | — |

## Dial and hands (05 02)

In the train's table above: all match.
