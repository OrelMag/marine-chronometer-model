# Batch 7, the model against the sheets: the motion work and up-and-down work (change wheel, hour wheel, up-and-down wheel and pinion, the cannon tube, the studs and their bushes), the four hands, the dial (Wempe's 05 02 00-4 and Lange's 1453/A), the arrangement 05 02_01

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch7-read.md`, with its Step 3 corrections). Its F1-F11 are settled below, and the ledger's 6-M3 and 6-M6 are re-checked.

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit2`, detached at efbf63c5 (main 3.47.00 with the geometry of batches 1, 2 and 6, among them 6-M3's 7.2 seconds post with the seconds hand lowered, and 6-M6's dents on the cannon tube). Nothing in it was edited.
- **Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b7m\` (written `b7m\` below).
- **Solids.**
  - `b7m\dump.py` (batch 6's, its prefixes changed) loads the page (`?snap&qa`, GPU) and freezes it as isolate.py does. It writes every visible mesh of these lines in all five versions to `dump.json`: 0502…, 050503-3/-2, 050501-2, 0508 02 (the plate and the stud bushes), WN-10 (the dial screws), the dial pin, WN-hs, 050604-1 (the fusee arbor's stub) and 050800-3 (the ring under the dial). `inv.txt` lists the meshes and their bounds per version.
  - Measured on the dump with `prof.py` (each turned part's (r, y) rings about its arbor) and inline scripts: the gears' tips, roots, counts and bores; the up-and-down wheel's spokes at hub and rim; each hand's widths and thicknesses at the sheets' stations; the dial's and the ring's holes; the bores against their seats.
- **Versions.** The motion work, hands and dial are the same meshes in "last", "first", "1943" and "3955". The 6MX differs only in three ways: the change pinion is steel (same geometry); the up-and-down wheel's spokes taper 1.83 → 1.18 (photographs); and the dial's screws sit at 354/114/234° on r 49.9 (Kirov 247), in the disc and in the ring. The seconds post, which carries the seconds hand, is the 1940 arbor in "first" and "1943" (6-M4): it ends at y 12.200, against 12.275 in the others.
- **Tools.** All at efbf63c5, `--model wempe`, MC_GL=gpu, one at a time:
  - `seatcheck.py -v` (`b7m\seat.txt`, 5.5 min): 498 pieces over 5 states, 476 seated, 5 expected, 0 failing.
  - `holecheck.py` (`holecheck.txt`): 1620 holes, 1472 populated, 31 expected empty, 0 failing.
  - `audit.py` (`audit.txt`): nothing new. Its three "no longer found" floatScrews are the movement ring's, batch 9's.
  - `dialsvg.py --verify` (`dialsvg.txt`): exit 1, M9. The stale check passes.
  - `dialtrace.py --compare` (`b7m\dt\r_dial_side.png`, `r_dial_diff.png`): photo ink 1258.1 mm², canvas 1067.5 mm². Only in the photo: 241.9 (the hands). Only in the canvas: 51.3.
  - `isolate.py` on the motion work from four sides (`b7m\iso\r_iso_cannon_changeWheel_hourWheel_udWheel_udPinion.png`), on the hands (`r_iso_hands.png`), and on the dial in plan beside 05 02_12 (`r_iso_dial.png`).
- **Sheets.** Re-cropped where a reading mattered: `s08z.png` (05 02_8's 5,2), `s01c1.png`, `s01cen.png` and `s01st.png` (05 02_1's centre stack and hand stack, 59 px/mm at 5×), `s10z.png` (05 02_10's section), `s12sec.png` (the seconds hole's 1,7), `s03b.png` and `s03c.png` (the hour hand's boss), `s04s.png`, `s04p.png` and `s04m.png` (the up-and-down hand's side view, plan and 1:1 outline).
- **Book.** `book/wempe-build-book.pdf` (WBOOK), titled v3.41.00 (27 October), so it predates batch 6's fixes. Its pages are rendered and their text pulled to `b7m\book\p*.png`, `*.txt` and `sheet2.txt`:
  - the cannon 320;
  - the change wheel 322-333, the hour wheel 336-345, the up-and-down wheel 346-350 and its pinion 351;
  - the hands 354-365;
  - the dial 367-373;
  - the stud bushes 12 and the studs 16.
- **Overlays.** `b7m\ov\`: sheet red, book blue, both black.
  - `overlay.py` (batch 6's, FFT registration over turn, mirror and scale): `min.png`, `hour.png`, `sec.png`.
  - `ovc.py` (new: the book view rendered at the sheet's px/mm, centred on the sheet's centre, turn and mirror searched): `udw.png`.

**Frame.** The movement's y, dial side +y. The pillar plate's inner face is at y 0 and its dial face at 3.35. The dial runs from 10.35 to 11.65, 7.0 over the dial face. The cannon's foot, the centre arbor's journal "C", is at 4.065 (0.715 over the dial face). Hole 1 is at (0, 0), 2 at (0, −23), 19 at (−10.912, 6.3), 10 at (−16.708, −15.292), 35 at (0, 23) and 18 at (−22.136, 12.78).

**Which version carries which sheet.**

| part | last | first | 1943 | 6mx | 3955 |
|---|---|---|---|---|---|
| change, hour, up-and-down wheels and pipes, cannon tube, studs and bushes (05 02 02-04, 1940-41; 05 05 03 of 1943) | yes | yes | yes | yes (change pinion steel; up-and-down spokes tapered, photographs) | yes |
| hands 05 02 00-1/-2/-3, 05 02 01-1 (1940-42) | yes | yes | yes | yes | yes |
| dial 05 02 00-4 (1940, the iron revision) | yes | yes | yes | its disc, screws at 354/114/234° on r 49.9 (Kirov 247) | yes |
| dial printing | Wempe 3955's (the Variants: Lange 5177, Kirov 247: printing only) | same | same | Kirov 247's | Wempe 3955's |
| seconds post under the seconds hand (batch 6) | 1946/48 arbor, finished 7.2 | 1940 arbor (Ø 0.73, 24 −0.05) | 1940 arbor | 1946/48 | 1946/48 |

---

## 05 02_01: the arrangement "Zeigerwerk, Auf u. Ab gesamt" (22.3.41, 5:1; plates then 3.9); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| centre distances | 12,96 (18 to 19), 12,6 (19 to 1), 23 (1 to 2), 18,4 (2 to 10) | 12.960, 12.600, 23.000, 18.400 (hole table) | 0 | match | sure |
| pillar plate | 3,9 | 3.35 (the later plates) | −0.55 | superseded, recorded (README P1e: "drawn with plates 3.9 thick") | sure |
| dial over the plate | 7 | 7.00 (10.35 − 3.35) | 0 | match | sure |
| dial thickness | 1,3 or 1,5 | 1.30 | — | match (05 02_12's "Stärke 1,3") | sure |
| dial holes | Loch Ø 6,0, Loch Ø 3,2 | Ø 6.000, Ø 3.200 | 0 | match | sure |
| fusee arbor in the plate | Ø 2,8 (the reader's F1) | the plate's hole at 10, Ø 2.82 | +0.02 | match; F1 confirmed by the model's own hole | sure |
| up-and-down pinion | on Ø 1,6 "Festsitz", 3 high, 0,3 under the dial | on the 1:70 stub (1.675 mid), 7.05-10.05, 0.30 under the dial | 0 | match | sure |
| up-and-down wheel | 6,2 plate to its top (Step 3 correction 1); 0,8 under the dial; 0,1 Luft over the pipe's flange | top 9.55 (6.20 over the dial face), 0.80 under the dial, flange top 10.25 (0.10 under) | 0 | match | sure |
| long stud | 12,7 overall, through a 3.9 plate | 12.30 from the plate's inner face, domed both ends (05 08 02's 12,3) | −0.4 | the later sheet's; recorded (README Readings corrected, 05 08_32.2) | sure |
| short stud | 0,2 Luft under the dial | top 10.15, 0.20 under the dial (6.80 out of the dial face, 05 08 02) | 0 | match | sure |
| change wheel | 0,6 (the collar, Step 3 correction 2), the pinion 2,5 | collar Ø 5.5 × 0.60 (5.35-5.95), pinion 5.95-8.45 (2.50) | 0 | match | sure |
| change pipe's top | (7 −0,1 on 05 02_06) | 10.25, 0.10 under the dial | — | match | sure |
| hour wheel | 2,4 from the plate's top face to its underside; 0,3 from its collar to the dial; collar scaled 3.7-3.8 over the wheel's lower face (`s01cen.png`, 69-71 px/mm; README's reading 4.0) | wheel's underside 3.265 over the dial face (on the cannon pinion, the 1943 tube's foot on C at 0.715); the collar 3.585 over it, 0.15 under the dial (mid-play; 0.30 with the wheel down) | +0.87 / −0.1 to −0.4 | F8: the 1943 tube's stack, recorded (Estimated); 05 02_1's own drawn collar (~3.7) supports the fitted 3.585 against 05 02 03's 5,2 | likely |
| hour hand's top (boxed 2,6 from the dial's top face, `s01st.png`) | 2.58 | 3.55 (15.2 − 11.65) | +0.97 | recorded departure: 05 05 03's tube and square (1943) carry the minute hand higher. The README's "about 2 lower" is about 1 (M5) | likely |
| minute hand's underside (the 2/1,8/1,2 chain) | 3.14 over the dial's face | 4.05 (15.70) | +0.91 | as above (M5) | likely |
| the up-and-down hand over the dial | 0,2 | flange's underside 11.85, 0.20 over the face | 0 | match | sure |
| glass | "Glas 3"; 15,8 struck, pencil 17,0 (plate face to glass) | glass 3.7 (05 01 01, case.js); its underside about 15.0 over the plate face (case.js: "0.65 over the hands"; not measured here) | — | batch 10's (M10) | possible |
| setting pinion (Zeigerstelltrieb) | struck out by a diagonal (F11, possible) | not built; its bush at 18 empty (WN-hs, Wempe 3955) | — | consistent; HOLE_EXPECTED holds (below) | possible |
| "Laufstellen: Enger Laufsitz" | close running fits | stud bores 1.52 on Ø 1.50; hour pipe 3.62 on the tube's 3.60 (0.01 on the radius) | — | match | sure |

## 05 02_02, _03, _04, _05: the hands; every version

Each hand's widths and thicknesses were measured on its mesh at the sheet's stations, along the hand's own axis (the tip's direction).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| **minute hand** 05 02 00-1, Goldin: length | 46 from the centre | 46.000 | 0 | match | sure |
| widths | 1,2 root; 2 at 13; 0,7 at 25; 1,7 at 36; 0,4 tip | 1.200, 2.000, 0.700, 1.700, 0.400 | 0 | match | sure |
| thickness | 0,7 / 0,6 / 0,4 (25, 36, 46) | 0.700 (13), 0.675 (25), 0.606 (36), 0.400 | ≤0.03 | match | likely (stations unattached) |
| boss | flange Ø 6, collar Ø 4,2, 2 overall, 1,2 top to flange's underside | Ø 6.0, Ø 4.2, 15.7-17.7 (2.00), 1.20 | 0 | match | sure |
| hole | □ 2,6 H7 +0,009, Kegel 1:70 | □ 2.62 across flats at the top, widening 1:70 down | +0.011 over H7 | **M1** | sure |
| **hour hand** 05 02 00-2, Goldin: length | 35 | 35.001 | 0 | match | sure |
| widths | 1,7; 2,4 at 9; 0,8 at 19,5; ball Ø 5,2 at 22,5; 0,6 at 30; 0,5 tip | 2.400, 0.800, 5.200, 0.600, 0.500 (the root's 1.7 by the table) | 0 | match | sure |
| thickness | 0,5 / 0,6 / 0,4 / 0,7 / 0,6 / 0,3 | 0.50 (3.6), 0.55 (9), 0.42 (19.5), 0.68 (22.5), 0.60 (30), 0.30 (35) | ≤0.05 | match | likely |
| boss | ring Ø 8,2 bevelled to 6,8, 0,8; pipe Ø 5 −0,2; 3,1 overall | Ø 8.2/6.8, 0.80, pipe Ø 4.80, 12.1-15.2 (3.10) | pipe at the low limit | match (pipe Ø 4.8 the band's lowest; mid 4.9) | sure |
| bore | Ø 4,4 H7 +0,012, Kegel 1:70 (not drawn in plan: F9) | 4.42 at the top on 1:70, 0.01 over its seat on the radius | +0.008 over H7 | **M1** | sure |
| **up-and-down hand** 05 02 00-3, Bandstahl 0,6, blued: boss | Ø 4,4; 1,4 overall; flange 0,5; walls thin round the bore (`s04s.png`: about 0.3, OD about 2.7-2.9; the plan's middle circle 3.4, likely the flange's rounded edge) | flange Ø 4.4 × 0.5, pipe Ø 3.0 × 0.9 (bore 2.22, wall 0.39), 10.95-12.35 | wall +0.1, OD +0.1 to +0.3 | F10, possible (M4) | possible |
| bore | Ø 2,2 H7 +0,009 | Ø 2.22 on its seat's 2.20 | +0.011 over H7 | **M1** | sure |
| blade | 0,9 root, 0,25 tip; inked to 9,5, a fine tip beyond (not to scale in plan); 1:1 outline about 10.8 from the centre (`s04m.png`, the boss's 4.4 as scale) | 0.9 root, 0.250 at 10.2 (Wempe 3955's dial) | −0.5 against the 1:1 outline | match to the photograph (recorded, Estimated); the 1:1 outline reads 10.8 ±0.5 | possible |
| blade thickness | 0,3 along (the side view draws it even, its top about 0.2-0.3 under the flange's top) | 0.50 at the boss → 0.32 at 9.5 → 0.30 at 10.2, its top flush with the flange at the root | +0.2 at the root | **M4** | likely |
| **seconds hand** 05 02 01-1, Bandstahl 0,6, blued: length | 29,5 overall, 19,5 + 10 | 19.50 + 10.00 | 0 | match | sure |
| widths | 0,6 root, 0,2 tip; tail neck 0,3, drop 1,7 from 6,5 to 10 | 0.6, 0.200, 0.30, 1.70 at 7.35, ends at 10.0 | 0 | match | sure |
| thickness | 0,4 by the boss, 0,3 tip, tail 0,5, neck 0,3 | 0.40, 0.30, 0.50, 0.46 at 6.5 (the neck's 0.3 then the drop) | 0 | match | sure |
| boss | Ø 3,2, raised collar Ø 2,5 on the top face; the "0,5" unattached | disc Ø 3.2 × 0.4, collar Ø 2.5 × 0.2 on top (0.6, the strip) | — | match | likely |
| hole | Ø 1,2 +0,05 | Ø 1.20 on the collet's end Ø 1.20, line to line | 0 | holds (bottom of the band) | sure |
| **heights (6-M3)** | the coloured section: the seconds hand about 0.1 off the dial, the post's and collet's ends about 1.0 over it; 05 05_01 puts the post's tip 0,5 beyond the dial | the seconds hand's underside 11.75 (0.10 over the face), its top 12.35, the collet's top flush with it; the post's end at 12.275 (0.625 over the face; "first"/"1943" 12.200, 0.55); the collet bored on the post's 1:90, 0.005 clear, engaged 4.5 | — | 6-M3 holds: the seat and height are as the sheets put them. In plan the seconds tip reaches 3.5 from the centre, 1.1 outside the hour hand's pipe (r 2.4); the hour blade is 2.05 over it | likely |
| collet 05 02 01-2 (no sheet) | — | Ø 1.5 × 4.6 (7.75-12.35), in the dial's Ø 1.7 (0.1 clear) | — | recorded estimate (README Estimated) | — |

## 05 02_06 to _09: the change wheel and the hour wheel; every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| change wheel 040202-1 | z 56; D 21,05 (21,30 struck); d 20,16; dg 19,03; t 1,131; Zahnstärke 0,55-0,56; bore Ø 4,2; fertig 1,0 | z 56, m 0.36; tip Ø 21.050; root Ø 19.03 (r 9.515); bore Ø 4.200 with a sink 0.4 × 30° (Ø 4.66 at the face); tooth 0.555; 1.000 thick | 0 | match | sure |
| change pipe 05 02 02-2 | Ø 3,05 −0,04 above; 4,3 +0,1 top to the pinion's underside; 0,9 +0,2 wheel to the foot; 7 −0,1 | Ø 3.050; 4.30; 1.00; 6.90 | in band | match (Ø 3.05 at the band's top) | sure |
| change pinion 05 02 02-3 (no sheet) | 2,5 high (05 02_1) | z 18, m 0.35, tip Ø 6.9, root Ø 5.4 (Wempe 3955), 2.50, bore Ø 3.05 | — | recorded estimate | — |
| hour wheel 040204-1 | z 54; D 19,7 (20,0 struck); d 18,90; dg 17,89; t 1,099; bore Ø 6 −0,1; 0,4 and 30° at the bore; 1,05 −0,03 / fertig 1,0 | z 54, m 0.35; tip Ø 19.699; root Ø 17.89; bore Ø 6.000 with a sink 0.40 at 30° (Ø 6.46); 1.000 | 0 | match | sure |
| hour pipe 05 02 03-2 | 8,2 −0,1; 5,2 −0,1 from the step to the lower end (`s08z.png`: the arrows on the step's line and the foot's, 5.02 by the sheet's own 8,2); seat Ø 4,4 r6 Kegel 1:70; collar scaled Ø 8.3, bore 3.7 | 8.200 (6.615-14.815); 3.585; seat Ø 4.400 at its top on 1:70 (Ø 4.466 at its foot), 4.615 long; collar Ø 8.0; bore Ø 3.62 | 0; −1.615 | F8: the 5,2 is the sheet's own figure for the collar. The 1943 tube leaves it no room, recorded (Estimated); the seat's r6 is M1 | sure (conflict) |
| riveting | "vernietet", the chamfer on the lower face | both wheels' sinks filled by their pipes' feet | — | match (since 27 October 2026) | likely |

## 05 02_10, _11: the up-and-down wheel; every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | Z 120; D 34,33; d 33,454; dg 32,57; l 0,40 | z 120, m 0.27878; tip Ø 34.328; root Ø 32.57 (r 16.285); tooth 0.40 | 0 | match | sure |
| "35,3 −0,2" (F3) | its arrows on the outermost circle | that circle is the tip circle: its ratio to the rim's inside is 1.206 (D/28.2 = 1.217, 35.3/28.2 = 1.252; on the sheet's rays r 294.8 and 244.5 px, bore 46.5 and hub 93 px; ±1 px) and the overlay (`ov\udw.png`, 17.2 px/mm) lays the model's tips on it | — | F3 settled: the circle is D, the figure the blank's (as the train sheets' 22,5/24, batch 6 F10); the reader's "drawn Ø 35.2" was a scale error. A 35.3 tip would cut 0.45 into the pinion's root at 18.4 | sure (model), likely (meaning) |
| rim, hub, bore | rim inside 28,2 +0,2; hub Ø 10,5 −0,2; bore 5,2 H7 +0,012 | 28.30; 10.40; 5.200 | mid; mid; bottom of H7 | match | sure |
| spokes | 5 at 72°, 1,7 −0,2 | 5 at 72°, 1.606 at the hub, 1.600 at the rim; 6MX 1.83 → 1.18 (3_3_Auf-_und_Ab_rus.jpg) | mid | match; the 6MX's from its photographs | sure |
| pipe 05 02 04-2 | top Ø 2,2 r6 × 1,4; 2,8 top to the wheel's top; 0,7 wheel's top to the collar's top; wheel 1 −0,1; 5,2 below | Ø 2.200 × 1.40; 2.80; 0.70 (flange Ø 7.7, 3955); 1.00; 5.20; 9.00 overall; step Ø 2.8; body Ø 3.4; bore Ø 1.52 | 0 | match; the seat's r6 is M1 | sure |
| riveting | "vernietet", its leader to the bore's lower corner, a rounded flare drawn there (`s10z.png`) | the bore on its seat line to line; nothing under the wheel (the body Ø 3.4 inside its 5.2 bore); no sink, no flare | — | **M2** | likely |
| pinion 05 02 00-5 (no sheet) | Festsitz on Ø 1,6 (05 02_1) | z 12, tip 4.0, root 2.4; bore on the stub's 1:70, 0.023-0.028 tight on the radius (the sheets' least is 0.025) | — | match; fine.py's EXPECTED entry holds | sure |

## 05 02_12: the dial 05 02 00-4 (2:1); every version; and 05 02_13, Lange's 1453/A

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outside | fertig 103,6 −0,1 | Ø 103.55 | mid | match | sure |
| thickness, material | Stärke 1,3 (1,2 pencilled); Messing 1,3 / "Eisenblech 1,3 gebondert" | 1.30, brass's density (8.45) | — | match (the iron revision 1.3, README) | likely |
| holes | centre Ø 6 (05 02_1), up-and-down Ø 3,2, seconds Ø 1,7 | Ø 6.000, 3.200, 1.700 | 0 | match; F7 settled: the "17"'s arrows are drawn outside, pointing in to extension lines tangent to the hole (`s12sec.png`: extension lines 10.3 px apart at 6.9 px/mm, 1.5 drawn), the small-hole convention | sure |
| subdial centres | 23 ±0,03 each side | holes 2 and 35 at 23.000 | 0 | match | sure |
| screw holes on Ø 101 | three sunk at about −6°, 121°, 240°: Ø 1,1 under Ø 1,8 H7, Senkung 1,0 tief | at 354°, 120°, 240° on r 50.5: Ø 1.10 through, a counterbore Ø 1.80 × 1.00 (10.65-11.65); the 6MX at 354/114/234 on r 49.9 | 0 | match | sure |
| small holes | Ø about 1 at +6° ("1") and about 186° | Ø 1.00 at 6° (the pin), Ø 1.00 at 185.7°, both under the printed face | 0 | match; HOLE_EXPECTED's 185.7° holds | likely |
| printing | 85/90 track; subdials 15/18/26 and 23/33/37; the 45° steps; widths 0,2/0,5/0,3/1,5; figures 2,7; serial 2,2 (M11 of the reading: "22" read beside 2367) | Wempe 3955's as made: centres Ø 85.44/89.94, 15.19/18.02/26.08, 23.01/33.06/37.08; up-and-down 0 at 22.5°, 45° per 8 h; dialtrace --compare canvas on the photo, only the hands apart | ≤0.44 | match the layout; the widths are the dial as made (README P1e) | sure |
| etching | geätzt 0,2 tief, schwarz ausgelegt | a texture on the flush face (filled flush on the real dial) | — | no geometric consequence | — |
| Lange 1453/A (F6) | Ø 103 × 1,5, Eisen; centre 6,0, seconds 2,2, up-and-down 3,2; no screw holes | the Variants swap only the printing (Lange 5177's) on the Wempe disc | — | F6: recorded and kept (README P1e, "The Lange dial", 27 October 2026; dial.js setDial); holds | sure |

## The studs, bushes and the fusee stub (05 08_32-2 with 05 02_1); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| bushes 05 08 02-2 at 2 and 19 | holes 3,50 +0,012, pressed "an dieser Seite" | holes Ø 3.506, bush OD 3.506, bore 1.50, flush both faces (0-3.35) | 0 | match (19's estimated, README) | sure |
| studs 05 02 00-6/-7 | 12,3 (long); 6,8 out (short); Ø not given (05 02_1 scales 1.52) | Ø 1.50, domed 0.3 both ends; 12.30 and 10.15 | 0 | match | likely (Ø) |
| hand-setting bush (18) | the pinion struck (05 02_1) | WN-hs, bore 1.30 with sink 1.64, empty | — | holds (Wempe 3955) | likely |

---

## Step 5, overlay

- **Minute hand** (`ov\min.png`, 7.3 px/mm, scale 1.00, turn 2.5°). The blade's two swells and waist, the square hole and both boss circles lie on the sheet's lines. Unpartnered:
  - the sheet's dimension and extension lines;
  - the book's dashed collar circle (Ø 4.2, hidden) is the sheet's inner circle.
- **Hour hand** (`ov\hour.png`, 6.89 px/mm, scale 0.99). The outline, ball and ring circles are on the sheet's lines. Unpartnered: the book's bore circle Ø 4.4, which the sheet's plan leaves out (F9: the sheet's omission).
- **Seconds hand** (`ov\sec.png`, 9.8 px/mm, scale 0.99). The tail, pointer and boss circles are on the sheet's lines. The book's chain axis runs off the blade (M8).
- **Up-and-down wheel** (`ov\udw.png`, 17.2 px/mm by the rim's 28.2, centred). Spokes, rim, hub, bore and tips lie on the sheet's lines; F3 is settled above. Unpartnered:
  - on the sheet: the dashed pitch circle, the 72° arc, the dimensions;
  - in the book: 111 teeth the sheet leaves undrawn (it draws 9).
- **Change and hour wheels** (p. 323, 337 against 05 02_07, _09: by eye). Plain discs, the bore's sink and the tip circle as the sheets give them.
- **Up-and-down hand** (p. 362 against 05 02_04): not overlaid. The sheet's plan isn't to scale along the blade (Step 1), and the book draws the blade 13° off its axis (M8).
- **Dial** (p. 368): the book gives no plan (M8). The isolate.py plan (`iso\r_iso_dial.png`, seen from the plate side, so mirrored) has every hole where 05 02_12 puts it.
- **Pages** (`b7m\book\sheet2.txt`): M8.

---

## Step 6, fit list

| # | piece | into/onto | hole or seat (sheet) | holding (sheet) | on the solid | verdict |
|---|---|---|---|---|---|---|
| J1 | long stud 05 02 00-6 | bush 05 08 02-2 at 2 | bush bore (Ø 1.5 scaled) | press | Ø 1.50 in Ø 1.50, line to line; seatcheck: held 117/123 by the bush and the up-and-down pipe | holds |
| J2 | short stud 05 02 00-7 | bush at 19 | same | press | the same; held 95/101 | holds |
| J3 | bushes 05 08 02-2 | pillar plate, 2 and 19 | 3,50 +0,012 | pressed from the inner face | OD 3.506 in 3.506, flush; held 33/33 | holds |
| J4 | change pipe 05 02 02-2 | short stud | Laufsitz | runs; foot on the bush | Ø 1.52 on 1.50 (0.01 on the radius); foot on the bush's face (3.35) | holds |
| J5 | change pinion 05 02 02-3 | change pipe | Ø 3,05 −0,04 | "aufschlagen zum Festsitz" | bore = pipe Ø 3.050, line to line; its lower face on the collar | holds (the model's press convention) |
| J6 | change wheel 05 02 02-1 | pipe's seat | Ø 4,2 | vernietet | line to line, the pipe's foot flared into the 0.4 × 30° sink | holds |
| J7 | hour wheel 05 02 03-1 | hour pipe's foot | Ø 6 −0,1, 0,4, 30° | vernietet | the same, Ø 6.00, sink Ø 6.46 | holds |
| J8 | hour pipe 05 02 03-2 | cannon tube | not dimensioned | runs | Ø 3.62 on 3.60; 0.15 over the cannon pinion, 0.15 under the dial | holds |
| J9 | up-and-down wheel 05 02 04-1 | its pipe's seat | 5,2 H7 +0,012 | vernietet | line to line; under it nothing, no flare | **no (M2)**: only the line-to-line seat holds it |
| J10 | up-and-down pipe 05 02 04-2 | long stud | Laufsitz | runs; foot on the bush | Ø 1.52 on 1.50; its top 0.05 over the stud's end | holds |
| J11 | up-and-down pinion 05 02 00-5 | fusee arbor's stub, 1:70 | Ø 1,6 (+0,05/+0,1 on the stub) | Festsitz | 0.023-0.028 tight on the radius (the least 0.025) | holds |
| J12 | cannon tube 05 05 03-3 (6-M6) | centre shank 1:80 | its bore; foot on C | "Körner": the punched groove | bore 0.01 clear; three dents (120°, 20°, 0.4 high, 10.165-10.565) line to line on the shank's groove cone, their lower faces 0.03 over its square shoulder; the foot on C | holds as the estimate batch 6 built (README Estimated); seatcheck doesn't follow the tube (M6) |
| J13 | minute hand 05 02 00-1 | tube's square | □ 2,6 H7 +0,009 on 2,6 □ r6 +0,019/+0,012 (05 05_08), 1:70 | press on the taper | hole 2.62 at its top on a 2.600 square, 0.01 clear each side, 0.024 at its foot; no bom relation | **no (M1)** |
| J14 | hour hand 05 02 00-2 | hour pipe's seat | 4,4 H7 +0,012 on 4,4 r6 +0,023/+0,015, both 1:70 | press | 0.01 clear on the radius along the taper; its top 0.385 over the seat's top; bom's press passes the 0.0111 gap | **no (M1)** |
| J15 | up-and-down hand 05 02 00-3 | its pipe's top | 2,2 H7 +0,009 on 2,2 r6 +0,019/+0,012 | press; down on the step | 2.22 on 2.20; on the step (0 mm) | **no (M1)** for the press; the shoulder holds it down |
| J16 | seconds hand 05 02 01-1 | collet 05 02 01-2 | Ø 1,2 +0,05 | press ("the hand riveted on its end", estimated) | line to line, flush tops | holds |
| J17 | collet 05 02 01-2 (no sheet) | seconds post, 1:90 | — | press | 0.005 clear on the radius, engaged 4.5 | holds as an estimate (M1's note) |
| J18 | dial 05 02 00-4 | the ring's recess floor, 7 over the plate | — | rests | on 10.35, 0 mm; the recess 0.7 deep | holds |
| J19 | dial screws WN-10.d (M1 × 2.3) | dial's sinks; the ring's flange | Ø 1,1 under 1,8 H7 × 1,0 | thread into the ring | heads Ø 1.7 × 0.8 in the sinks, 0.1 under the face; shanks threaded, the ring's holes plain Ø 1.04 through the flange (6.35-11.05), no thread; bom's tap passes on 0.0338 | **no (M3)**: a threaded screw in an untapped hole |
| J20 | dial pin | ring (Ø 1,1, 05 08 00-3), dial (Ø 1) | — | press (estimated) | Ø 1.09 in 1.10 (0.005 on the radius) and Ø 0.98 in 1.00 (0.01); held 49/49 | holds as recorded |

With bom.py's press at ≤ 0.02 and tap at ≤ 0.1, J13-J15, J17, J19 and J20 all pass as they are, although none of J13-J15 or J19 is held.

---

## Extra checks

### (a) Slots, notches and grooves

| described | against the sheet's views | verdict |
|---|---|---|
| the cannon tube's groove r 0,4 at 6,3 over C and the punched dents (05 05_08, batch 6) | the section's round notch; the mark "Körner"; 05 02_1 draws two bulges at that height (`s01d`) | built (groove 10.165-10.565 at r 1.4; dents inside it): holds as an estimate |
| the hour wheel's riveting recess 0,4 / 30° (040204-1's edge view) | edge view only; 05 02 03's section draws the chamfer | built: holds |
| the change wheel's riveting sink | 05 02 02's section, undimensioned | built as the hour wheel's: holds (estimated) |
| the up-and-down wheel's rivet | 05 02 04's section: a round flare at the bore's lower corner | **not built (M2)** |
| the minute hand's square hole | plan and side view agree, □ | built square: holds |
| slots or notches elsewhere in 05 02 | none drawn | none built: right |

### (b) Drawn holes (H1-H21)

All present:
- H1-H4, the hands' holes: M1 for their size.
- H5 (Ø 4.2) and H7 (Ø 6 with its recess).
- H6, H8, H10, the pipes' bores: 1.52, 3.62, 1.52.
- H9 (5.2).
- H11-H18, the dial's: Ø 6.0, 3.2, 1.7; three Ø 1.1 with Ø 1.8 × 1.0 counterbores; Ø 1.0 at 6° and 185.7°.
- H19, the stud bushes' holes Ø 3.506.
- H20, Ø 2.82 at 10.
- H21, Lange's: not built, recorded (F6).

### (c) Excuses

| entry | re-judged |
|---|---|
| bom.json `050200-1` (minute hand) `rel: []`, the book's "as the Hamilton's hands, so the centre arbor's endshake isn't sampled through it" | the excuse holds for endshake, but it leaves the hand's seat unchecked by any tool, and the hand is in fact loose (M1). A `round 050503-3 press` relation, endshake left out, would catch it |
| bom.json `050200-2`, `050200-3`, `050201-2`, `050503-3` `round … press` | pass on 0.009-0.011 gaps; not presses (M1); the tube by its dents (J12) |
| bom.json `WN-10.d in 050800-3 tap` | passes on 0.034; the hole isn't tapped (M3) |
| bom.json `dialPin in … press` (both) | 0.005 and 0.01 gaps; estimated pin; holds as recorded |
| bom.json devs | none for these lines |
| checks.py EXPECTED `('fusee:Buffer','udPinion:Extrude')` | holds: the Festsitz at the sheets' least (J11) |
| HOLE_EXPECTED, the dial's Ø 1 at 185.7° | holds: 05 02_12 draws it (a single circle near 186°); its use is not given; no photographed dial shows it |
| HOLE_EXPECTED, 18's bush bore (WN-hs) | holds: Wempe 3955 has it empty, and 05 02_1 strikes the setting pinion (F11) |
| SEAT_EXPECTED, LOOSE, FLOAT | none for these parts |
| seatcheck.py's SEAT_NAME (`\b(…rohr…futter…)\b`) | doesn't match the compound names "Minutenrohr" or "Zeigerfutter", so the cannon tube and the collet are never followed (M6) |
| README P1e "The hands' heights" and dial.js lines 96-99 and 129-136: "05 02_1 (1941) and the coloured section draw these two about 2 lower" | 05 02_1 draws them about 0.95 lower (M5) |
| README Estimated, P1e item: "the hands' heights over the dial (above: from the 1946 seconds post; … 2 mm lower, on the 1940 post)" | stale since 6-M3 (M5) |
| README P1e "Frame": "tapped M1 2.5 deep" | stale: the holes run through the flange (frame.js), and they aren't threaded (M3) |
| README Estimated "the hour wheel's collar, 3.585 … its overall 8.2 kept" | holds; 05 02_1 itself draws the collar about 3.7-4.0 over the wheel (F8) |

### (d) The blind reading's findings settled against the model

- **F1** confirmed by the model: the plate's hole at 10 is Ø 2.82. Transcription only.
- **F2:** the code is right (pinion's lower face 4.30 under the top). Transcription only.
- **F3** settled. The 35,3's circle is the tip circle D (ratios and overlay), and 35,3 −0,2 is the blank's figure. The model's 34.33 is right (sure). To be recorded in Readings corrected (M7).
- **F4** (the collar 0.6) and **F5** (boxed 2,6 and 3,2): transcription only. The model doesn't take 2,6 or 3,2; both bear on M5's heights.
- **F6:** recorded and kept (README, 27 October 2026). Holds.
- **F7** settled. The arrows are the small-hole convention, and the hole is 1.7 as built (the collet's 1.5 in it, 0.1 clear). Record (M7).
- **F8:** the sheet's own conflict, confirmed. The model's fit holds and is supported by 05 02_1's drawn collar.
- **F9:** the sheet's plan omits the bore; the book draws it. No action.
- **F10:** possible, as M4.
- **F11:** consistent with the model (bush only).
- **Ledger 6-M3** (re-checked): the seconds hand's seat and height are now as the coloured section and 05 05_01 put them (table above). The hour and minute hands stay where the 1943 tube puts them (M5).
- **Ledger 6-M6** (re-checked): the dents are built line to line in the shank's groove (J12). The tube is held as estimated. No tool follows it (M6).

---

## Findings

Ten findings in all:

- **Joint:** M1, M2, M3.
- **Possible (sheet):** M4.
- **Text or record:** M5, M7.
- **Tool:** M6, M9.
- **Build book:** M8.
- **Cross-reference to batch 10:** M10.

None changes the motion work's ratios, centres or tooth outlines, the escapement or the train.
- M1 and M3 change only fits: fine.py would need entries for the new presses and threads.
- M2 and M4 change masses by milligrams on parts that turn once in 12 hours or slower: the inertia tables (wempe_inertia.py) are untouched, since none of these parts sits behind the escape wheel's train except through the cannon pinion's friction window (wempe_motionwork.js, unaffected).
- Geometry checks after correcting: solids, fine, holecheck, audit, seatcheck, bom with `--model wempe`.

**M1. Joint, sure. 05 02 00-1, -2, -3 with 05 05_08, 05 02 03, 05 02 04 (every version): the hands' press fits are drawn as clearances.**
- The sheets: the minute hand's □ 2,6 H7 +0,009 on the tube's 2,6 □ r6 +0,019/+0,012; the hour hand's Ø 4,4 H7 +0,012 on 4,4 r6 +0,023/+0,015, both tapered 1:70; the up-and-down hand's Ø 2,2 H7 +0,009 on 2,2 r6 +0,019/+0,012. Each is 0.003-0.023 interference.
- The model:
  - every seat at its nominal (□ 2.600, Ø 4.400 at the seat's top, Ø 2.200), 0.012-0.019 under r6;
  - every hole 0.02 over its nominal (□ 2.62 at the top, Ø 4.42, Ø 2.22), 0.008-0.011 over H7;
  - so 0.01 clear on the radius: nothing on the solid holds any of the three hands.
- How the tools see it: bom.py's press (≤ 0.02) passes the hour and up-and-down hands; the minute hand has no relation at all; seatcheck doesn't follow hands.
- The seconds hand's collet (no sheet) is also 0.005 clear on its 1:90 post.
- How sure: sure.
- Correction from the sheets' figures: each seat at the middle of r6 (□ 2.6155, Ø 4.419 at the seat's top on its 1:70, Ø 2.2155) and each hole at the middle of H7 (□ 2.6045, Ø 4.406 on 1:70, Ø 2.2045). That gives 0.011, 0.013 and 0.011 of interference on the diameter. Add fine.py EXPECTED entries as for the up-and-down pinion's. Add a `round 050503-3 press` relation for the minute hand. The collet line to line on its taper (estimated).
- Physics: no.

**M2. Joint, likely. 05 02_10 (every version): the up-and-down wheel isn't riveted on the solid.**
- The sheet: "vernietet", its leader on the wheel's bore at its lower face, where the section draws a small rounded flare (`s10z.png`). Under the wheel the pipe's body is narrower than the bore.
- The model: the wheel's 5.2 bore on the seat, line to line, the flange (Ø 7.7 × 0.7) above it and nothing below (the body Ø 3.4). This is unlike the change and hour wheels, whose pipes fill riveting sinks (27 October 2026).
- How sure: likely (the flare is drawn, not sized).
- Correction: a riveting sink at the bore's lower face with the seat's foot flared into it, as on the other two wheels (0.4 × 30°, 040204-1's figures, estimated here). Record it in Estimated.
- Physics: no.

**M3. Joint, sure. 05 02_12 with 05 08 00-3 (every version, both screw circles): the dial screws' holes in the ring aren't tapped.**
- The sheets: the dial's three screws (Ø 1,1 under the 1,8 H7 sinks). The ring's sheet doesn't draw their holes ("drilled at assembly"), and the model takes them as M1, tapped.
- The model:
  - the screws' shanks carry an M1 thread (r 0.355-0.492);
  - the ring's holes are plain Ø 1.04 through the flange (6.35-11.05), the old "thread's size and 0.02" convention, with no inside thread, where every other tapped Wempe hole has had one since 3.35.00;
  - bom.py's tap (≤ 0.1) passes on the 0.034 gap.
- README P1e and Estimated still say "tapped M1 2.5 deep".
- How sure: sure (the hole's wall has no helix).
- Correction: KIT's threadWall M1 in the six holes (r 50.5 at 354/120/240°; the 6MX's r 49.9 at 354/114/234°), through the flange as frame.js now draws them; the README lines brought up to date. This is the ring's (batch 9) to make.
- Physics: no.

**M4. Possible to likely (sheet). 05 02_04 (every version): the up-and-down hand's blade and boss.**
- The sheet's side view (`s04s.png`):
  - the blade is about 0.3 thick along its whole length, with only "0,3" at its tip; its underside lies on the flange's underside and its top about 0.2-0.3 under the flange's top; the "0,5" is the flange's own thickness (the reader's inventory too);
  - the boss is a top hat with thin walls (about 0.3) round the bore, OD about 2.7-2.9: a collar drawn up from the 0.6 strip (F10). The plan's middle circle, Ø 3.4 at the boss's scale, is likely the flange's rounded top edge.
- The model:
  - the blade is 0.50 thick at the boss, tapering to 0.30 at its tip, its top flush with the flange at the root (the code: "sure");
  - the pipe is Ø 3.0 with a bore of 2.22 (a wall of 0.39).
- How sure: likely for the blade; possible for the collar (its walls are 3-4 px on the scan).
- Correction: the blade 0.3 throughout, its underside on the flange's. The collar kept at Ø 3.0 (within the side view's ±0.2) and recorded in Estimated as drawn up from the strip.
- Physics: no (−0.5 mg).

**M5. Text, likely. README P1e "The hands' heights" and Estimated (P1e item); dial.js's comments on the hands' heights (every version).**
- The text says 05 02_1 (1941) and the coloured section draw the hour and minute hands "about 2 lower".
- On 05 02_1 (`s01st.png`, 59 px/mm by the boxed 3,2):
  - the hour hand's ring top is 2.58 over the dial's face (model 3.55);
  - the minute hand's underside is 3.14 (model 4.05);
  - both are about 0.95 lower, not 2. The 2 mm was the 9.2 post's, gone since 6-M3.
- The Estimated item still says "from the 1946 seconds post".
- The model's place is bounded by the 1943 tube: the hour pipe's 8.2 from the cannon pinion on C, and the square from 14.865. The hour hand can come down 0.385 at most (its top flush with its seat), and the minute hand then only to 0.05 over it. So the model's heights stand as the 1943 parts allow (likely), and only the text is wrong.
- Correction: the text.
- Physics: no.

**M6. Tool, sure. seatcheck.py (`SEAT_NAME`; every version).**
- The regex's leading `\b` misses the compound names, so "Minutenrohr" (050503-3) and "Zeigerfutter" (050201-2) have no row in `-v`. The cannon tube's dents (6-M6) and the collet's seat are followed by no tool. (The pipes "Wechselbutzen" and the rest are matched through their English "pipe".)
- Correction: match `rohr|futter|butzen` inside words, or name the two lines in English too.
- Physics: no.

**M7. Record, likely. README Readings corrected (05 02_11, 05 02_12; every version).**
- F3: 35,3 −0,2 on 05 02_11 is written on the tip circle (D 34,33 by the ratios and the overlay), so it is the blank's figure.
- F7: the seconds hole's "17" is drawn with its arrows outside the extension lines, which are tangent to the hole, so it is the hole's Ø 1,7.
- F1 (Ø 2,8, not 28°) and F2 for the transcription.
- The model needs no change.
- Correction: the README lines and the transcription.

**M8. Build book, sure. Pp. 320-373, 12, 16 (v3.41.00).**
- (a) **The hands are drawn skewed in plan.** The minute hand is 2.5° and the seconds hand 4° off its axis, the up-and-down hand about 13°, and their A-A sections run off the blade.
  - The overall figures are the skewed boxes' (48.93, 39.04, 29.42, 12.21), not the sheets' lengths from the centre (46, 35, 19.5 + 10, 10.2).
  - Neither the station widths nor the holes' fits are given (□ 2,6 H7 1:70, Ø 4,4 H7 1:70, Ø 2,2 H7, Ø 1,2 +0,05).
- (b) **The dial's sheet is a half section only, as a turned part.** It has no plan, so none of the off-axis holes appears: Ø 3.2, Ø 1.7, the three Ø 1.1 with their 1.8 H7 × 1.0 counterbores, and the two Ø 1. Nor do the Ø 101 circle, the angles or the 23 ±0,03 centres.
- (c) **Tapered bores are read as "hole + sink".**
  - The hour hand comes out as "Ø 4.41 through … sink Ø 4.46 × 1.86" and the collet as "Ø 0.66 … sink Ø 0.71 × 2.57".
  - The hour pipe's seat (Ø 4,4 r6, Kegel 1:70) isn't dimensioned.
- (d) **The up-and-down wheel's page.** Its module is printed as 0.2787833333333333, and its rim 28,2, hub 10,5 and spokes 1,7 at 72° aren't dimensioned.
- (e) **The cannon's half section** is hatched as a thin wedge, not its wall (Ø 3.6 over the bore).
- (f) **The book predates batch 6:** the 7.2 post, the seconds hand at 0.1 over the dial, the tube's dents.
- Correction: drawbook.py fixes (align a hand on its tip's direction through its hole; plan views for flat parts with holes off the axis; tapered holes as 1:70/1:90 cones; the module rounded) and the redraw at the end.
- Physics: no.

**M9. Tool, sure. dialsvg.py --verify (the 6MX's Kirov dial; the other two pass).**
- It exits 1: the Kirov dial's red serial is 10.62 mm² in the SVG against 10.54 mm² on the page's canvas, 0.75 % against its limit of 0.5 %. Every shape agrees (0 px differing 3 px across), and the black ink is +0.12 %.
- ci.py runs only the stale check, which passes.
- Not a drawing matter.
- Correction: re-trace or re-export the serial's polygons (dialsvg.py --write after checking dialface_kirov.js), or let a red area this small pass on an absolute limit.
- Physics: no.

**M10. Cross-reference for batch 10, possible. 05 02_01 with 05 01 01: the glass.**
- 05 02_1 draws the glass 3 thick. Its underside is 15,8 (struck; pencil 17,0) over the plate's dial face.
- The model's glass is 3.7 thick (05 01 01's band, case.js), its underside about 15.0 over the plate face. That figure is from case.js's comment ("0.65 over the hands"), not measured here.
- For batch 10 to measure against 05 01 01 and the 1941 arrangement.
- Physics: no.
