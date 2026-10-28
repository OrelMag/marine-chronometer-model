# Batch 11, the model against the arrangements: 001 (Federchronometer, plan views), the coloured full section (Wempe_Einheitschronometer.jpg), and the sheets the first pass left out (05-33, 05-36, 05-36_2, 05-38; the lever chronometer's 002, 05-04_20/21, 05-08_30/31/32-1/33)

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The joints J1-J74 and F1-F11 come from the blind reading (`batch11-read.md`, with its Step 3 corrections). This report judges the joints and heights between parts as the two arrangements draw them. It doesn't re-judge a part's own sheet: batches 1-10 did that, and where a part's sheet and the pictorial section disagree, the sheet's figure stands and the difference is recorded here.

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit4`, detached at d178fd63 (main, 3.48.00: the geometry of batches 1, 2 and 6). Nothing in it was edited.
- **Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b11m\` (written `b11m\` below).
- **Solids.**
  - `b11m\dump.py` loads the page (`?snap&qa`, GPU) and freezes it as holecheck.py does. It writes every visible mesh's line, part and bounds in all five versions to `dump.json`, and `inv.py` turns that into `inv.txt` (per part and line).
  - `b11m\slice.py` cuts every visible mesh with the vertical planes of the coloured section's development. The planes run from the rim through the barrel (45), fusee (10), centre (1), intermediate (38), seconds (35), escape (26) and balance (23) arbors to pillar 11 and on to the rim. The result is `slice.json`, 20,176 cut segments in "last", 20,418 in "first" and 20,730 in "6mx".
  - `b11m\plan.py` and `planc.py` render the movement orthographically from the train side and from the dial side (dial and hands hidden) at 10 px/mm. `planc` gives every part and line its own flat colour, so the edges between parts show.
- **Tools.** All at d178fd63, `--model wempe`, MC_GL=gpu, one at a time:
  - `seatcheck.py -v` (`b11m\seat.txt`, about 6 min): 498 pieces over 5 states, 476 seated, 5 expected, 0 failing.
  - `holecheck.py` (`b11m\holecheck.txt`) and `audit.py` (`b11m\audit.txt`): see "Tools' results" below.
- **Sheets.**
  - The section's heights were read by colour-run profiles down columns and across rows (`b11m\prof.py`) and on gridded zooms (`b11m\gcrop.py`: `a_bt.png`, `a_ft.png`, `a_fb.png`, `a_udp.png`, `a_det.png`, `a_left.png`, `a_ring.png`, `a_bal.png`, `a_12a.png`, `a_mlab.png`, `f3_dig.png`, `hub_dig.png`).
  - 001's screw heads and circles were found by a Hough transform, and radial ink profiles were taken about named arbors (`b11m\radial.py`).
- **Scales.** All heights use 001's "innerer Plattenabstand 19 mm".
  - **Section rows to model y.** The section's plates' inner faces are at rows 360 and 537, so 9.316 px/mm, and y = −19 + (row − 360)/9.316. The same scale holds across: the drum's outside, 387 px, is the model's Ø 41.6 (9.30 px/mm). It holds along the development too: barrel to fusee 400.5 px against 42.5 mm, and balance to pillar 11 273.5 px against 29.1 mm. So the section is drawn close to scale, about ±1 px (0.1 mm) on the plates, bridge and drum, but the arbors' spacing along the development is not exact (9.4, 9.9, 8.9, 9.5, 9.3, 9.3 px/mm segment by segment).
  - **001's similarity.** 001's two views were fitted to the model's own hole table by a similarity, mirrored for the train side (`b11m\fit001.py`, `fit001.json`). The fit used seven drilled places for the right view (pillar screws 11, 49 and 39, barrel bridge screws 42 and 48, cock screw 8, the balance's centre from its four masses) and four for the left (pillar screws 11, 49, 39 and the intermediate bridge's 43). The right view gives 4.883 px/mm, turned 0.48°, rms 0.94 px (0.19 mm); the left 4.900 px/mm, 0.78°, rms 0.64 px (0.13 mm). 2:1 on paper at this scan is 2.44 px per paper mm, so 001 is drawn to its 2:1 within the scan's resolution.

**Frame.** The movement's y, dial side +y. The top plate (TP) runs from TT = −22.35 (its outer face) to TI = −19.0, the pillar plate (PP) from 0 to 3.35. Plan x is W and z is S.

**What the arrangements are.** 001 (19.3.41) is the 1941 layout: it shows the drum, ring, chain and the plates' first holes. The coloured section ("Federchronometer 05", undated) draws the band (Band 05 07 03-1) rather than the chain, the straight dust bush and the fixed-wheel parts. Both are the drawn versions' ("last", "first", "1943"). The 6MX and Wempe 3955 versions differ from them only where batches 1-10 recorded it. For each joint below, "every version" means the five unless it says otherwise.

---

## Step 4 and 6: the master fit list, J1-J74, on the solid

"Section" means the coloured section, and heights are given as its rows and as mm by the scale above. Each row's model value is from `inv.txt` and `seat.txt`. The reader's rows for the fusee and the escapement were taken off 2× crops and are off by 50-80 px. Mine are re-read on the full scan and marked "(re-read)".

| # | joint | arrangement | model | verdict | sure |
|---|---|---|---|---|---|
| J1 | Pfeiler 05 08 00-1 ×3 between the plates, stepped ends in both | section: rows 360-537, shoulders inside both plates, tapped blind from both ends; 001: three pillar-screw heads at 11, 49, 39 | three pillars at 11, 49, 39 (6MX: P39_6MX), y −22.05..3.05, their steps in the plates' 4,5 seats, tapped from both ends; `in 050802-1 run`, `in 050901 run` | holds; the overlay puts the model's pillar, steps and threads on the section's to 1-2 px (`ovsec_last_R.png`) | sure |
| J2 | WN-57 down through TP into the pillar | head on TP's top, rows 300-328 (−25.4..−22.4) | heads −25.35..−22.35, held 69/107 by the pillar | holds | sure |
| J3 | WN-56 up through PP into the pillar's foot | head under PP, rows 568-596 (3.3..6.3; reader 568-592) | heads 3.35..6.35, held 68/107 | holds | sure |
| J4 | Werkring 05 08 00-3 under PP's rim, its screws over the rim | section: PP's rim on the ring's inner step, the ring screw's head on PP's inner face at rows 509-538 (−3.0..0.1), its shank tapped into the ring to row 596 (6.3); 001: three heads straddling the plate's edge | ring y 0.35..11.05; WN-rs ×3 at r 44.5, 120° apart, heads −3.05..0, shank 6.3, tapped in the ring; on 001 the three model heads fall within 2 px (0.4 mm) of the drawn ones (687/108, 974/352, 619/478 against 686/107, 974/355, 617/478) | holds; SEAT_EXPECTED's "open into the cone" is consistent: the section's hole tip meets the cone line (x 1836 at row 603) | sure |
| J5 | Stellstift 3 WN-202 | radial pin in the ring's outer flange, standing out to the case, rows 607-625 (7.5..9.4), 9.3 long | radial at N, r 45.3-54.75, y 7.45..9.05, 9.45 long, held 76/94 by the ring | holds. The section draws it standing 3.7 out of the ring (its radial scale near the rim is about 1 mm loose), the model 1.8: the ring's own sheet decides (batch 9) | likely |
| J6 | Stellstift WN-201, PP to ring | section's left end: through PP's rim into the ring, rows 537-604 (0..7.2) | Ø 0.98 at (0, 42.5), y 0.1..5.35 (5.25 long), held 50/53 by PP and ring; bom.json gives only `in 050800-3 press` | holds as a joint; **length 5.25 against the section's 7.2** (the code says "estimated"); bom.json lacks `in 050802-1` (M6) | possible (length), sure (relation) |
| J6b | the dial's pin, also labelled Stellstift WN-201 (the label's second leader) | through the ring's lower flange and the dial, rows 594-640 (5.7..10.6, ending inside the dial) | dialPin y 6.65..11.55, 4.9 long, in the ring and the dial (49/49) | holds: the section's pin is 4.9 long (46 px), as the model's. The model names it "dialPin" without the section's WN-201 (M7) | likely |
| J7 | Zifferblatt 05 02 00-4 under the ring's foot, WN-10 countersunk from the face | dial rows 633-645 (10.3..11.6); the screw from the dial's face into the ring's flange, rows 608-645 | dial y 10.35..11.67; WN-10.d ×3, heads at 11.45, tapped in the ring (16/31) | holds | sure |
| J8 | Federhausbrücke 05 08 05-1 on TP's level | rows 298-326 (−25.66..−22.65), the bridge's underside on TP's outer face, TP cut away over the barrel; 001: the straight edge from 12:30 to 7:30 | y −25.67..−22.35, `on 050901`; WN-55 ×2 clear in it, tapped in TP (22/92); WN-203.bb in both | holds (the reader's "read 2", bridge at TP's own level, is wrong: its underside is TP's outer face); 001's edge falls on the model's chord within 1-2 px | sure |
| J9 | Sperrad 05 07 00-3 on the arbor's square above the bridge | rows 273-296 (−28.3..−25.9) | y −28.37..−25.72; on 001 the model's ratchet sits in 001's circle (its tips Ø 12.6 against 001's 12.9) | holds; batch 4's M7 (the taper fit) is that batch's | sure |
| J10 | Sperrkegel 05 08 05-2 on the bridge, WN-22 | WN-22's head top row 254 (−30.4), the click rows 274-298 | WN-22 −30.38..−22.47 tapped in the bridge (25/79); click −28.23..−25.67; on 001 the model's WN-22 (616.7, 228.4) is on 001's click screw | holds | sure |
| J11 | Federkern: top pivot in the bridge, bottom in PP (45) | the arbor rows 194-590; the square ends at row 208 (−35.3) with a **dome to row 194 (−36.8)**; the lower end domed to row ≈ 590 (5.7) | barrelArbor y −35.25..4.95: the square's end flat at −35.25, no dome; the lower end 4.95 | holds as a joint; the ends differ (1.5 dome on top, 0.75 below). Batch 4's sheets decide (its M5: 01's "10 past the bridge, rounded"). Recorded, M3 | likely |
| J12 | Federhaustrommel + Federhausdeckel on the arbor | the lid's top row 334 (−21.8), the floor rows 489-499 (−5.2..−4.1) | barrel −21.73..−3.65 (the floor's underside 0.45 lower than drawn) | holds; the drum's height is its sheet's (05 07 01-1, batch 4); 0.45 recorded (M3) | possible |
| J13 | Federhaushaken 05 07 01-3 in the drum wall | a riveted pin through the wall, rows ≈ 400-430 (−14.7..−11.5) | 050701-3 y −14.23..−11.18, held 4/25 by the drum (batch 4's J9) | holds | likely |
| J14 | Federhaken on the core | in the core's block | 050702-2 in the core, 60/65 | holds | likely |
| J15 | Steg 05 07 00-1 | its leader in the drum (F8) | built: 2 × 0.5 inside the wall, r 18.3-18.8, through the bottom's slot and the lid's notch (0207's part 106: README line 130) | holds, F8 settled by 0207 | likely |
| J16 | Zugfeder on both hooks | coils at the core and the wall | 050700-6 y −20.2..−5.2 in the drum | holds | sure |
| J17 | Bandhaken f. Trommel 05 07 03-3 | on the drum's rim, the band's end | the band's drum hook, in the band variant (`conn=band`) | holds as a variant: the section draws the band, the model's default is the chain (M8) | sure |
| J18 | Band 05 07 03-1 / Kettenstift 05 06 00-6 | drum to fusee, ≈ row 435 (−11.0), the chain pin at the fusee | the chain 05 07 04 by default (band under Variants); 050600-6 held 8/18 by the fusee | holds | sure |
| J19 | Schneckenfutter 05 08 01-2 on TP over hole 10, three WN-34 | section: the bush on TP, one countersunk WN-34 cut; 001: the flange circle r 6.35 (Ø 12.7), three heads at r 5.3-5.8 | bush y −26.75..−19.75, flange Ø 13.2; WN-34 ×3 at r 5.2 (842/214, 864/252, 820/251 on 001), tapped in TP (18/37) | holds; 001's flange 0.5 smaller than the model's 13.2 is within 001's 0.2-0.4 mm reading (the bush's own sheet, batch 8, stands) | likely |
| J20 | Staubfutter 05 08 01-3 on the bush's top | sleeved over the bush's top (rows ≈ 230-325 re-read) | `round 050801-2 press`, y −41.95..−23.85, held 25/187 | holds; the section's straight tube is the first-drawn 05 08 01-3 (batch 8) | sure |
| J21 | Korkring in the tube's top | rows 140-172 (−42.6..−39.2) (re-read) | −42.65..−38.95 | holds | sure |
| J22 | Schneckenwelle: journal in the bush, pivot in PP (10) | the top domed at row 104 (−46.5), the square's end at row 120 (−44.8); the dial end at row 621 (9.0) inside the up-and-down pinion | 050604-1 −48.03..10.10 (pointed square end; the dial end cut at 10.1) | holds as a joint; the ends differ (1.5 longer on top, 1.1 below); batch 5 matched the arbor to its sheet (28,3 to the point; 60,6 overall). The section is pictorial here (M3) | likely |
| J23 | Schneckenkörper on the arbor | the stepped cone rows 360-460 (re-read), its steps | 050604-2 −18.48..−6.13; the overlay puts the model's steps on the section's | holds | sure |
| J24 | Schneckensperrad 05 06 04-3 with WN-19 | at the cone's base, rows ≈ 450-470 (re-read; the reader's "inside the cone's top" is the label's place) | 050604-3 −8.63..−6.68; WN-19 press in it, tapped in the cone (53/58) | holds | likely |
| J25 | Stift 05 06 04-4 in the body | a pin in the fusee body | 050604-4 held 30/41 by the fusee (the stop spring's pin) | holds | likely |
| J26 | Deckplatte 05 06 00-4 with WN-20 | rows 355-365 (−19.5..−18.5) (re-read) | 050600-4 −19.28..−18.48; WN-20 held 38/59 by plate and cone | holds; S-6's untapped hole is batch 5's | sure |
| J27 | Stellungssteg 05 06 03-1, Stift -2, Stegfeder -3 | in the cone's top | 050603-1/-2/-3 at −18.48..−17.0, the pin 20/29 | holds | sure |
| J28 | Schneckenrad with WN-21 | WN-21 at the clicks' pivots on the wheel, rows ≈ 462-500 | WN-21 −7.9..−4.1, tapped in the ratchet (21/38) | holds | likely |
| J29-J31 | Gegensperrad, Sperrkegel + Sperrfeder on Niet, Gegenfeder with its pin | under the cone, rows ≈ 460-515 | 050602-1/-3/-2/-4, 050601-1, 050600-8 (23/25) at −8.2..−2.4 | holds (the overlay) | sure |
| J32 | Vorreiber + Vorreiberstift | between the fusee wheel and PP (the blue piece at rows ≈ 495-515); the labels below PP lead up to it | 050600-2 −3.69..−0.93; the pin through the hub and arbor (75/83) | holds (the reader's "below PP" is the labels' place) | likely |
| J33 | Staubplatte 05 06 00-1 | in the dust tube on the square, rows ≈ 227-252 (−33.3..−30.6) (re-read) | 050600-1 −31.73..−28.73, 1.5-2.0 lower than drawn | **no**, as batch 5's M2 already found (its place re-set by the taper): not a new finding | likely |
| J34 | Gegensperrkegel on Gegensperrwelle (hole 4), Feder 05 05 06-1, Schrb. WN-27 | the arbor between the plates; the wire from TP; WN-27's head on TP's top (rows 307-330), its end ≈ row 370 (−17.9); 001: the dashed detent and its hook at 1-2 o'clock, a small circle at 5 | 050505-1/-2 (arbor −22.08..3.08), wireStud = WN-27 (−24.25..−18.6, 31/57 in TP), wire 050506-1; on 001 hole 4 at (791, 135) and 5 at (812, 125) fall on 001's detent and small circle | holds; the reader's "the holding device's tong, possible" on 001 is the maintaining detent (sure) | sure |
| J35 | Anschlagstift 05 08 01-5, TP hole 7, standing out below | — | −22.35..−17.15 (1.85 below TP), 33/52 | holds | sure |
| J36-J38 | Messinglager WN-301 (TP 1), WN-300 (TP 38, 35), WN-302 (PP 1) | brass bushes pressed in the plates | all four, 23/45, 34/34, 31/35, 33/33 | holds | sure |
| J39 | Minutenrad + Minutentrieb | the wheel rows 520-530 (−1.8..−0.7) | 050503-1 −1.74..−0.49 | holds | sure |
| J40 | Minutenrohr on the arbor below PP | — | 050503-3 4.07..18.26 | holds (batch 7's fit) | sure |
| J41 | Stundenrad + Stundenbutzen on the pipe | the wheel rows 597-605 (6.4..7.3) (re-read: the reader's "590-605" includes the change wheel) | 050203-1 6.62..7.62 | holds | likely |
| J42 | the hands under the dial | the hour hand's blade rows 660-667 (13.2..14.0), the minute's 682-687 (15.6..16.1) | hour 12.1..15.2 (with its boss), minute 15.7..17.7 | holds (batch 7) | likely |
| J43 | Zwischenrad + Zwischentrieb on the third arbor | **the arbor's lower pivot in the Zwischenbrücke under PP** (rows 565-594 at x 1167; PP is cut away there, its window) | 050502-2 −21.92..6.98, its bush WN-300.zb in the bridge (31/31); the wheel 0.23..1.18 in PP's window, the section's rows 532-547 | holds. The reader's "PP's bearing" (its Step 2 correction) is wrong | sure |
| J44 | Zwischenbrücke 05 08 04-1 under PP, WN-52 ×2, pins | rows 567-602 (3.2..7.0); 001: the obround bar with two screws | y 3.35..7.15; WN-52 tapped in PP (22/66), pins WN-203.zb (28/30); 001's bar outline lies on the model's to 1-2 px (`ovc001_last_L_s.png`) | holds | sure |
| J45 | Wechselrad + Wechseltrieb on Wechselbutzen on its stud (19) | the change wheel rows 575-585 (4.1..5.2) | 050202-1 4.35..5.35 on 050202-2 (35/69) on 050200-7 | holds | sure |
| J46 | Anrichtstift kurz in PP's bush 05 08 02-2 | — | 050200-7 in 050802-2 (95/101) | holds (its number, 05 02 00-7 or -9, stays M3 of the reading) | sure |
| J47 | Anrichtstift lg. through 05 08 02-2 | from PP to the dial | 050200-6 0..12.30 (117/123) | holds | sure |
| J48 | Auf- und Abrad + butzen on the long stud | the wheel rows 615-624 (8.4..9.4) | 050204-1 8.55..9.55 on 050204-2 | holds | sure |
| J49 | Auf- u. Ab-zeiger on the pipe | — | 050200-3 10.95..12.35 on 050204-2 | holds | likely |
| J50 | Auf- u. Abtrieb 05 02 00-5 on the arbor's stub | rows 595-624 (6.2..9.3), flush with the wheel's underside | 050200-5 7.05..10.05, its underside 0.5 past the wheel's | holds as a joint; it is drawn 0.8 higher on the section. Batch 7 matched it to the sheet (3 high, 0.3 under the dial), so the sheet stands (M3) | likely |
| J51 | Sekundenrad + trieb | the wheel rows 488-496 (−5.3..−4.4) | 050501-1 −5.13..−4.13 | holds | sure |
| J52 | Lagerstein f. Sek. in Fassung | **in the Zwischenbrücke**, the red stone at rows 581-594 (4.7..6.1) (re-read; the reader's "PP (hole 35)" is wrong) | 050504-2 3.55..7.15 in the bridge (press), the stone 5.1..6.2 | holds; bom.json's 050504-1 has no relation (M9) | sure |
| J53 | Zeigerfutter + Sek.-Zeiger on the post | below the dial | 050201-2 7.75..12.35, 050201-1 11.75..12.35 | holds | likely |
| J54 | Stellstift 4 WN-203 by the seconds jewel | its leader to the bridge's pin or the setting's | WN-203.zb in PP and the bridge | holds as the bridge's pin | possible |
| J55 | Gangfederkloben 05 04 01-4 **under TP** (the reader's "on PP" is corrected) | the block drawn thin from row 360 to ≈ 428 (−19..−11.7); Schrb. WN-15 its screw, Stellstift 2 WN-201 dashed up through TP | 050401-4 −19.0..−12.5 (6.5 deep, the sheet's 6,5 +0,05: sure); WN-gk (M1.7, "WN-15 by the coloured section's label") clear in TP, tapped in the block (25/88); WN-201.gk in both (43/43); on 001 the screw at 13 (928/394) lies on 001's slotted head in the dashed block | holds; the section's 7.3 deep is pictorial (M3) | sure |
| J56 | Gangfeder's foot on the block, Schrb. WN-13 | — | WN-gf ("WN-13 by the coloured section's label") clear in the foot, in the block (22/38); WN-205.d (22/32) | holds (batch 2's) | sure |
| J57 | Goldfeder on the detent, WN-14 | — | WN-14 tapped in the detent (2/10; bom dev for its 0.39 engagement) | holds (batch 2's) | sure |
| J58 | Ruhestein in the detent's pipe | — | 050401-3 in the pipe | holds | sure |
| J59 | Schrb. WN-16, the banking screw | its leader to the slotted head on the block's arm | WN-gkA43 / WN-gkA, "its WN number not read" (tapped in the block) | holds; the name WN-16 is on the section (README 872) but not on the lines (M7) | likely |
| J60 | Gangrad + Gangtrieb + Gangradbutzen on the escape arbor, jewelled in TP and PP | the wheel rows 371-381 (−17.8..−16.75) (re-read); the collet 375-425 | wheel −18.6..−17.2 (05 04_1's teeth 0.5 under the plate, 1.4 thick, batch 2: sure); collet −17.9..−12.5 | holds; the section draws the wheel about 0.7 lower than 05 04_1 (pictorial, M3) | sure |
| J61 | Unruhkloben oben 05 08 03-1 on TP, WN-55 + Stellstift 4 WN-203 | an L rising from TP, its top at row ≈ 190 (−37.2); 001: the tapered cock, one screw and two holes at its wide end | 050803-1 −37.35..−22.35; WN-ucs tapped in TP (23/92), WN-203.uc (28/30); 001's cock outline lies on the model's (`ovc001_last_R_s.png`) | holds | sure |
| J62 | the upper settings in the cock's boss, two screws | heads on the cock's top, rows 175-200 | 050406-2.bu / 050408-2.bu, WN-55.ck tapped in the cock (17/34) | holds (batch 8's M9 and M14 stand) | sure |
| J63 | Klötzchen 05 03 02-3 on the cock's top, WN-11 | the bar rows 175-188 (−38.9..−37.5), WN-11 through it; WN-11's end shows under the arm (the blue dome at rows 210-218) | 050302-3 −38.85..−32.85 (the bar 1.5 thick on the top, its upright down the slot); WN-11 −40.45..−34.35, tapped in the cock (24/61); SEAT_EXPECTED's stud entry | holds | sure |
| J64 | Spiralfeder: inner end in the collet (Spiralstift), outer in the stud | the helix rows 215-300 | 050302-1 −34.46..−24.49; 050302-4.c (26/36), 050302-4.s (17/27) | holds | sure |
| J65 | Spiralrolle on the staff above the arm | ≈ row 290 | 050302-2 −27.3..−24.0 | holds | likely |
| J66 | Unruhbutzen 05 04 02-2 (the hub), WN-10 | the hub under the arm, WN-10 its screws (reader's correction 2) | 050402-2 −22.8..−18.7; WN-10 ×2 held by the arm and hub (26/29) | holds | sure |
| J67 | the masses on the rim, WN-12 (12a); Zeitmasse on Zeitschraube | "Schraube WN-12 (12a)" beside "Masse 05 03 01-4" (`a_mlab.png`); **"Schraube WN-12a": a brass cheese-head screw standing in a mass's top, its thread dashed 3 deep** (`a_12a.png`, the leader followed down to it) | WN-12 tapped through the outer jaw (24/27); the masses' M1.2 top holes left empty (HOLE_EXPECTED, the photographs) | holds as a decision; F7 settled (M2) | sure (reading) |
| J68 | Heberolle, Auslöserolle on the staff | below the arm | 050403-1 −18.68..−17.03, 050404-1 −17.03..−15.43 | holds (batch 1's) | sure |
| J69 | Unruhkloben unten 05 08 00-2 under TP, WN-53 from TP's outer face, pins 22, 37 | the block rows 360-455 (10.2 under TP), WN-53's head in TP's counterbore | 050800-2 −19.0..−9.0 (10.0, the sheet's 10 −0,1); WN-53 clear in TP, tapped in the cock (28/67), head −22.25..−20.55 in its sink; WN-203.lc (28/30) | holds; F11 settled | sure |
| J70 | the lower settings in the lug, two screws, heads below | heads rows 452-468 (−9.1..−7.4) | WN-10.bl ×2, heads to −7.6, tapped in the lug (17/34) | holds; their label reads WN-18 (or WN-16), not WN-10 (F3, M1) | likely |
| J71 | stop work's lever (Index.md) | on no arrangement | nothing built from Index.md (F1) | no joint | sure |
| J72 | seconds contact 3800 (option) | 05-38 | not built (B) | kept, as an option | sure |
| J73 | hand setting 3300 (option) | 05-33; 001's left view draws its block (below) | the holes 14-18 and the window cut, nothing fitted | kept (B) | sure |
| J74 | balance holding device (option) | 05-36, 05-36_2 | 51-53 drilled, the pocket cut, nothing fitted | kept (B) | sure |

Two places the section draws that the joint list didn't number:

- **The plate's hole 23 under the balance.** The section draws PP open below the balance, about Ø 7.1 (x 1462-1528), with nothing in it. The model's PP has 23 punched (Ø 7 on the plan), and HOLE_EXPECTED's entry ("nothing on the sheets or the coloured section stands in it") holds, sure.
- **The intermediate wheel in PP's window.** The section draws it at rows 532-547 inside the plate's thickness. The model puts it at 0.23..1.18 in the window. Holds.

## F1-F11, settled

**F1, Index.md (sure).** No value from it is used in the model. The searches covered `marine-chronometer-source/wempe/js`, README.md, bom.json, checks.py, the tools and `References/wempe/README.md`, for "Index.md", "Inferred & Back-Calculated", 1080, 0.48 (as a strip), M2.5/M2,5 (as a pillar screw), Stellkloben, Stellhebel, Stellfeder, back-rake, Viertelrohr, 43.00, 12.20, 11.80, 24.50 and M1.0.
- The model's strip is 05 06_20's 15 × 0.37 (and the build's 0.393).
- The pillar screws are M2.6 (WN-56/57, head Ø 6.4 × 3.0).
- The stop work is 05 06_4's Stellungssteg in the fusee, not Index.md's lever.
- The only M2.5 in the Wempe is the bowl's bracket screws (WN-78, "estimated", case.js). They are not Index.md's pillar screws.
- The fusee bush's M1.4 (WN-34) is 05-08_30's revision a ("3 Löcher M1,4 nachgetragen") and 05 08 01b's flange, not Index.md (CAD Build Spec line 684 says so).
- `References/wempe/CAD Build Spec.md` (lines 43, 684, 2861) and `CAD Model design.md` (lines 123, 359-360, 485) already mark Index.md unsourced and not used.
- No action needed.

**F2, the callout map `Wempe_Einheitschronometer.md` (sure).** The model cites none of its wrong numbers.
- The set-up ratchet is 050700-3, as the section reads ("Sperrad 05 07 00-3"). The map's "Sperrrad 05 07 03-3" is the band's drum hook's sheet number (05 07_13), which the model uses for that hook.
- The dial is 050200-4. 05 02 00-1 is the minute hand in the model, as the section has it.
- The Zwischenbrücke is under PP, not "above the upper plate".
- The train's bearings are WN-300/301/302.
- "02 04 02", which the model cites for the impulse roller, is that roller's own drawing number (Heberolle 02 04 02, revised 10.9.41), not the map's misreading.
- "Federhausring" names the 1941 three-piece barrel's ring (0207, 127-556.04-088 / 05 07_10). It is not 05 07 01-3, which the model calls the hook block, as the section has it.
- "Kette 05 07 04" is the chain's own sheet number (05 07_14). That is right in the model, and coincides with the map.
- **But the catalogue carries the index's wrong numbers and dates.** `References/wempe/README.md`'s catalogue rows 66-67, 116-118, 179-187 hold several of the dates and numbers F5 lists as not the sheets', and `wempe_essaydata.js` puts them in the essay's sheet chart (WEDATA.sheets):
  - 001 and 002 dated "10.03.41" (the sheets read 17-19.3.41);
  - 05 04_21 "16.09.42" (12.6.41);
  - 05 08_30 "22.04.41" (22.9.41);
  - 05 08_31 "25.07.41" (25.9.41);
  - 05 08_33 "18.07.41" (unsettled);
  - 05 33 "12 05_33" (05 33, 127-556.05 / 3300);
  - 05 36_2 "127-566.06" (127-556.06-06);
  - 05 38 "05 30_00" (3800).

  That is M4.

**F3, the lower balance settings' screws (likely).**
- At 24× on the full scan (`f3_dig.png`), the label at px 1500-1530 × 500-512 reads "WN-1" followed by a digit with a closed lower loop and a waist. It is 8 (or 6), unlike the open oval "0" of the hub's "WN-10" at px 1335-1365 × 222-234 (`hub_dig.png`).
- The model names these screws WN-10.bl (bom.json "WN-10 by the coloured section's label"; README line 872).
- The model's own sizes argue against one number for both: the hub's and the dial's WN-10 are M1, and the lower settings' screws are M1.2 (05 08 00-2's two M1.2). One WN number can't name two threads, as batch 8's M14 argued for WN-55.
- Correction: name them WN-18 (likely; WN-16 is the banking screw's own label nearby), in bom.json, app.js's card and README 872.
- No shape change (M1).

**F4.** That is the reader's, and needs no model work.

**F7, WN-12a (sure as a reading).**
- The left-hand "Schraube WN-12a" label's leader runs straight down (`a_12a.png`, 7×, px 1428-1430 from row 230 to 252) to a yellow, brass, slotted cheese head standing on a mass's top (px 1413-1435 × 252-263, about Ø 2.4 × 1.2 above the mass), its thread dashed about 3 deep into the mass.
- The right-hand label beside "Masse 05 03 01-4" reads "Schraube WN-12 (12a)": the masses' screws are WN-12, with 12a as their alternative.
- So the section draws a WN-12a fitted in one mass's top tapped hole. The reader's "leader ends under the cock's arm" is wrong. The blue dome there is WN-11's end.
- The model has the M1.2 tapped holes in the masses' tops and leaves them empty. HOLE_EXPECTED cites Wempe's lever 2965 and 2493, and the photographed tops are plain.
- That is a reasonable version choice, but the README should say the coloured section draws one fitted (brass, cheese head, about 1.2 proud). HOLE_EXPECTED's "countersunk" against the section's cheese head standing on the top should be checked against 05 03_2 (batch 1's sheet) (M2).

**F8, the Steg (likely).** The barrel's assembly sheet 0207 draws it as its part 106 (127-556.04-097, 2 × 0.5, 0,4 off the bore), and the model builds it so (README line 130, since 18 October 2026). The section's leader, which can't be followed through the wash, is consistent with a strip at the wall.
- The README's "Superseded, left out or for later" (line 752) still says "Not built: the barrel's Steg 05 07 00-1 (coloured section, no sheet) …".
- That sentence is stale against line 130 and the model (M5).

**F10, holes 56 and 57 (for the owner).**
- 05 08 02-1 gives them as "Kontakt Schr. r./l.", S 40,190 O 5,000 and (S) 38,184 W 13,500, Ø 1,3 for M 1,7, with "nur bei Bedarf" (only when needed).
- The model builds them in no version, and nothing in HOLE_EXPECTED mentions them, since an unbuilt hole can't be checked.
- Two readings:
  - (a) "nur bei Bedarf" means not drilled unless the contact is fitted. Then a plate without it has no holes, as Wempe 3955's plate has none. This is the model's present rule.
  - (b) They are part of the drawn plate. Then they belong in "last", "first" and "1943", empty, with a HOLE_EXPECTED reason.
- The model's rule for 14-18 is the same evidence rule (drilled because Wempe 3955's plate is), so (a) is consistent with it.
- Recommended: keep them out and say so in HOLE_EXPECTED's comment and in README 751 and 756, with the table's figures (M10, owner).

**F11, the lower cock under the top plate (sure).**
- The model's cock is 10.0 deep (−19.0 to −9.0), 05 08 00-2's "10 −0,1".
- The section's block runs from row 360 to 455, 10.2 (±0.3), and the lever version's 05-08_33 is "10 high".
- The "9.7" is the case-box transcription's scaled reading (line 195), not the README's.
- Holds. The transcription's 9.7 could be corrected to 10.2 (M3's record).

## (B) The options and the lever chronometer's sheets

- **The hand setting, 05-33 (holes 14-18).** HOLE_EXPECTED gives 14-17 the `_HS` reason (struck through, "nur wenn Zeigerstellung eingebaut wird", drilled and empty as on Wempe 3955's and Greenwich's wartime Wempe's plates). It gives 18's bush the reason that it stands empty as on Wempe 3955, and the Ø 2 bore (three entries) the reason that the work isn't fitted. All hold.
  - **New evidence.** 001's left view (1941) draws the hand setting's block as a solid rectangle at 9 o'clock, over the model's 14-17 (they fall inside it, `z_hs.png`), and the dashed square beside it over the model's window.
  - So the 1941 layout had the work on this calibre's plate. That is consistent with the option, and with F9 (not "another chronometer's sheet").
  - The README's reason (lines 756, 939: "127-556 is the Luftwaffe's lever chronometer BC 1010") should be worded as F9 asks (M5).
- **The balance holding device, 05-36, 05-36_2 (51-53).** HOLE_EXPECTED gives 51 (from the pocket's floor), 52 and 53 the `_HD` reason, in every version, and the 6MX leaves out 53 (Kirov 247).
  - The section's plane from 23 to 11 passes through hole 51, and the model's top plate shows the pocket there in "last" (its floor 1.35 up from the inner face). That is consistent with the reason ("the 1943 plate keeps its pocket and holes"), as the pocket is cut in the drawn versions.
  - 001 shows nothing at 51-53 (they map to 874/350, 862/430 and 833/494 on it).
  - The reader's "possible tong at 1-2 o'clock" on 001 is the maintaining detent at 4 and its wire spring's stud at 5, which map onto it within 2 px (J34).
  - The exclusion holds as the owner's decision of 18 October 2026.
- **The seconds contact, 05-38 (56-57).** It is not built (F10).
  - 05-38 is Wempe's own contact. It is a unit of two plates on pillars (38 00 04-1/-2/-3, Din 84 screws), between the plates by "Unruhkloben unten 04". A contact wheel on an arbor between the plates, 13,35 ±0,05 from the top plate's inner face (y −5.65), lifts two jewelled levers to close platinum-silver contacts. The leads go out through a fibre-insulated case bush, rated 24 V, 0.4 A. The sheet carries the later Steinstrasse 23 address.
  - **The 6MX's contact is a different design**, the Soviet one built from Kirov 247 and Romanov 1975: a gilt base on the PP's inner face, fibre, two blocks, a knurled disc, a lever on a jewelled staff with a spiral as its lead, and a contact wheel on the seconds arbor (6MX.cw, y −10.65..−6.1).
  - None of 05-38's parts or places is the 6MX's. The 6MX base's two screws (6MX.ctm, M1.7, held 30/66 by PP) stand at (0, 38.2) and (24.36, 29.03), 5.4 and 14.1 mm from 05-08-02-1's 56 (−5.0, 40.19) and 57 (13.5, 38.18).
  - Only the idea (a toothed contact wheel on a train arbor between the plates, its leads out through the case) is shared, so 05-38 neither confirms nor contradicts the 6MX's contact. Its M1.7 size for the base screws agrees with the 6MX's M1.7 (estimated from Kirov 247).
- **S-5, the 6MX contact screw 6MX.ctk and its lock nut 6MX.ctn (sure, as the ledger has it).**
  - The screw (Ø 1.0 at y −5.85, tangential at r 45.5) runs through its holder on the lever's end, and the nut sits on it, both in solid metal: SEAT_EXPECTED's OPEN entry.
  - 10_Kirow_247 shows the thread (README, the contact).
  - Correction: a tapped M1.0 hole through the holder along the screw's axis, and the nut's M1.0 thread matched to the screw's (fuse threads as elsewhere). Then remove the OPEN entry. The nut's own entry ("on its screw, not in a hole") stays.
  - No physics change (M11).
- **The lever chronometer's sheets (002, 05-04_20/21, 05-08_30/31/32-1/33).** Each confirms the frame and adds nothing:
  - 05-08_30's frame rows (1, 3-13, 22, 23, 35-50) are the model's `WD.H` to 0.001 wherever both have them (the reader's Step 3; `WD.H` printed from dims.js).
  - Its "Unruhhaltung" 53 at O 13,0 is the lever plate's. The model's O 15,0 is the detent plate's (F6).
  - 05-08_31's crescent top plate, fusee bush and dust tube match the model's top plate, cut away over the barrel under the D-shaped bridge (`planc_last_top.png`).
  - 05-08_33's lower cock, 10 high with a pin on its top end, matches the model's 10.0 cock pinned at 22 and 37 (J69).
  - Nothing is to change.

## Step 5, overlays

- **The coloured section** (`ovsec_last.png`, crops `ovsec_last_L/F/M/R.png`; `ovsec_first_*`, `ovsec_6mx_*`). The model's cut segments are drawn on the section at its 9.316 px/mm, each arbor at the x where the section draws it and the parts round it at true scale. These line up to 1-2 px (0.1-0.2 mm):
  - the plates and pillar, and both pillar screws with their threads;
  - the barrel, its lid, floor, arbor, ratchet and bridge;
  - the fusee cone's steps, its cover plate, the maintaining work, the fusee wheel and the bush with its tube and cork;
  - the centre, intermediate and seconds wheels;
  - the intermediate bridge, the seconds jewel in it and the intermediate arbor's pivot in it;
  - the escape arbor's jewels;
  - the balance staff, both settings, the hairspring's helix and the stud's bar;
  - the ring screw's head and the dial with its screw and pin.

  What has no partner, and why:
  1. **The section is developed, not cut on planes.**
     - Its upper cock foot (x 1120-1300) is drawn on the plane away from its hole 8.
     - Its lower cock (x 1530-1610) is drawn on the pillar side of the balance, though the model's cock runs from 23 toward 37, away from pillar 11.
     - Its barrel bridge screw and click are drawn at the barrel's left.
     - The detent block is dashed at x 1185-1265.

     The model's cut puts each of these where its own plane meets it: the cock foot on the centre-to-38 plane, the lower cock on the 35-to-26 plane, the pocket at 51 on the 23-to-11 plane. These are the drawing's convention, not findings.
  2. **Heights where the section and a part's own sheet differ by more than its ±0.3.** The sheet decides each time, so there is no correction (M3):
     - the barrel arbor's ends (domed 1.5 above the square, 0.75 longer below);
     - the fusee arbor's ends (the dome 1.5 lower on top than the model's point, the dial end 1.1 short);
     - the drum's floor (0.45);
     - the dust plate (1.5-2.0, already batch 5's M2);
     - the escape wheel (0.7 lower than 05 04_1);
     - the detent block (7.3 against 05 04 01-4's 6,5 +0,05);
     - the up-and-down pinion (0.8 higher than batch 7's sheet reading);
     - the ring's steady pin WN-201 (7.2 against the model's estimated 5.25, M6).
  3. **The section's band against the model's default chain** (M8).
  4. **The section's WN-12a fitted on a mass** against the model's empty hole (M2).
  5. **The section's ring at its left end** stands to PP's inner face (row 535). At its right end it stands 0.3 under it (row 540), as the model's 0.35. The drawing is inconsistent with itself there, so the right end, which matches the ring's sheet, is taken.
- **001, the train side** (`ovc001_last_R_s.png`; the screw centres in `b11m\` from `dump.json`). The part-boundary edges of the flat-coloured render, put on 001 by the fitted similarity, lie on 001's lines to 1-3 px (0.2-0.6 mm):
  - the plate's rim and the barrel bridge's chord;
  - the upper cock's whole tapered outline;
  - the set-up ratchet in 001's circle;
  - the balance rim's ring with the four masses at its corners;
  - the fusee's square;
  - the chain on the barrel;
  - every slotted head 001 draws: pillar 11/49/39, bridge 42/48, cock 8, the click's WN-22, the ring's three, the detent block's 13 and its second head, and the three WN-34 on the bush's flange.

  001 shows the fusee bush's flange (Ø 12.7, the model's 13.2) and an inner circle Ø 8 (hole 10's spigot), not the later dust bush's head and cork ring Ø 16.1, which 001 (1941) predates. It shows the maintaining detent and its spring's stud at 4 and 5. Dashed lines under the plate (barrel, fusee, wheels, detent, lower cock) aren't in a top render and weren't compared.
- **001, the dial side** (`ovc001_last_L_s.png`). These lie on 001's lines to 1-2 px:
  - the up-and-down wheel (001's large solid circle at the top);
  - the change and hour wheels;
  - the intermediate bridge (001's obround bar, both screws and its pin);
  - the pillar screws' heads;
  - the hand-setting holes inside 001's block;
  - the window beside it;
  - the small circles at 1-2 and 4 o'clock.

  Nothing on 001's dial view lacks a partner except the hand setting's block (the option, B) and the dashed outlines of what lies between the plates.

## Extra checks

**(a) Slots, notches and grooves.** The arrangements draw no slot the model lacks or misreads:
- The stud's slot is batch 8's, the cock's 1,8 H7, and the section draws the stud's bar over it with WN-11.
- The drum's 2 × 0.5 slot is 05 07 01-1's revision (a). The section's plane misses it.
- The ring's cone, at the left end and the right, is drawn as the model's.

**(b) Drawn holes.**
- The arrangements' holes are all in the model: 23 under the balance, 13, 4, 5, 7, 8, 10, 11/39/49, 42/48, 28/43, 36, the bushes' and settings' seats, the dial's three screws and pin, the ring's three screws and radial pin.
- Holes 56-57 are left out (F10, owner).
- The masses' top holes are built and left empty (F7).

**(c) Excuses and relations naming a joint between parts.** Re-judged against the arrangements:
- **bom.json (none of these lines carries a `dev`).** These relations hold as the section draws them: pillars `in … run` / `on`; WN-56/57 `in 050800-1 tap`; WN-rs `in 050800-3 tap`, `on 050802-1`; the ring `on 050802-1`; the barrel bridge `on 050901` (on TP's outer face); WN-55 `clear`/`tap`; WN-203.bb; the click `round WN-22 free`; WN-22 `tap`; the fusee bush `in/on 050901`; WN-34 `clear`/`tap`; the dust bush `round 050801-2 press`; the cork `round … press`; the upper cock `on 050901` with WN-ucs and WN-203.uc; the lower cock `on 050901` (hanging under TP) with WN-53 `clear` in TP and `tap` in the cock, and WN-203.lc; the intermediate bridge `on 050802-1` with WN-52 and WN-203.zb; WN-300/301/302 `press`; WN-300.zb `in 050804-1 press` (the intermediate arbor's lower bearing in the bridge, J43); 050504-2 `in 050804-1 press` (the seconds setting in the bridge, J52); the studs and their bush; the stop pin; WN-gk and WN-201.gk; WN-11 / the stud `on 050803-1`; the dial `on 050800-3`; WN-10.d; dialPin; WN-202.
  - **WN-201** (the ring's pin) has only `in 050800-3 press`. The section draws it through the plate's rim too, and seatcheck finds it held by both, so `in 050802-1` is missing (M6).
  - **050504-1** (the seconds jewel) has no relation at all. It should have `in 050504-2 press` (M9).
  - **WN-12a** has no relation, consistent with "not fitted".
- **SEAT_EXPECTED.**
  - The stud's entry holds: J63, the section's WN-11 through the bar.
  - The ring screws' entry ("open into the flange's cone") holds. The section's hole tip meets the cone line, and Wempe 3955 decides (sure).
  - The 6MX nut's and stud's entries hold.
  - The OPEN 6MX.ctk entry is S-5 (M11).
- **HOLE_EXPECTED.**
  - 23: the section draws it empty (holds).
  - 14-18 and the Ø 2 bore: hold, and 001 draws the block (B).
  - 51-53: hold.
  - The masses' M1.2: holds as a decision, with "countersunk" to check (M2).
  - The auxiliary 3, 12, 40: not on the arrangements, so not judged here.
- **fine.py's EXPECTED and audit.py's LOOSE.** No entry in either concerns a joint the arrangements draw differently from the model.

## Tools' results

- seatcheck.py -v: 498 pieces over 5 states, 476 seated, 5 expected (the stud, the ring screws, the 6MX nut, the 6MX spiral's stud, and the OPEN 6MX.ctk), 0 failing.
- holecheck.py (`b11m\holecheck.txt`, about 8 min with the other agents' browsers): 1620 holes over 5 states, 1472 populated, 31 expected empty, 0 failing. Among them are this batch's 23, 14-18 and the Ø 2 bore, 51-53, and the masses' tops.
- audit.py (`b11m\audit.txt`): nothing new. Three expected entries are no longer found: audit-expected's `floatScrews` for the movement ring's three screws in the 6MX (13.6/−42.37, −43.5/9.4, 40.78/17.82), "its head bears on the pillar plate's rim … (the coloured section)". Their reason agrees with the section: the head over the rim, the ring 0.3 under the plate's face at the section's right end. But the entries are stale, as batch 8 also found (M13).

---

## Findings

**M1. Text (name), likely. Coloured section, the lower balance settings' screws (every version).**
- The arrangement: their label reads "WN-18" (or "WN-16"), its second digit a closed lower loop with a waist (`f3_dig.png`, 24×), unlike the hub's open "WN-10" (`hub_dig.png`).
- The model: the line WN-10.bl, "WN-10 by the coloured section's label", README 872.
- The model's own sizes differ (the hub's and dial's WN-10 are M1, the settings' screws M1.2), and one WN number can't name two threads.
- Correction: rename the line WN-18 (likely) in bom.json, app.js's card and README 872. Record the reading's doubt (8 or 6) in the README's Readings corrected.
- Physics: no.

**M2. Record, sure (reading); the model kept as a decision. Coloured section, WN-12a (drawn versions).**
- The arrangement: the section draws a brass slotted cheese-head screw (about Ø 2.4 × 1.2 proud) fitted in a mass's top tapped hole, its thread dashed about 3 deep (`a_12a.png`). It labels the masses' screws "WN-12 (12a)" (`a_mlab.png`).
- The model: the tapped M1.2 holes in the masses' tops, left empty (HOLE_EXPECTED: Wempe 2965 and 2493, plain tops photographed). HOLE_EXPECTED calls the hole countersunk.
- Correction:
  - the README (and HOLE_EXPECTED's text) should say the coloured section draws one WN-12a fitted, a brass cheese head standing on the top;
  - check "countersunk" against 05 03_2 (batch 1's sheet), since the section draws the head standing on a plain top;
  - whether to fit one is the owner's call, but the photographs favour leaving them empty.
- Physics: no (it would move the masses' moment slightly if fitted).

**M3. Record, likely. Coloured section, heights more than ±0.3 off parts whose own sheets were matched (every version).**
- The section against the model (and the governing sheet):
  - barrel arbor: the top domed to −36.8 against a flat square end at −35.25; the lower end 5.7 against 4.95 (batch 4's sheets, its M5);
  - fusee arbor: domed to −46.5 against the point at −48.03; the dial end 9.0 against 10.1 (batch 5: 28,3 and 60,6);
  - drum floor: −4.1 against −3.65 (05 07 01-1);
  - escape wheel: −17.8..−16.75 against −18.6..−17.2 (05 04_1);
  - detent block: 7.3 deep against 6.5 (05 04 01-4's 6,5 +0,05);
  - up-and-down pinion: 6.2..9.3 against 7.05..10.05 (batch 7's sheet reading);
  - lower cock: 10.2 against 10.0 (inside ±0.3).
- The section is pictorial at these places, and the sheets decide.
- Correction: none to the model. Record them in the README's Readings corrected ("the coloured section scaled", with these rows), and correct the case-box transcription's 9.7 (line 195) to the 10.2 the rows give.
- Physics: no.

**M4. Text, sure. `References/wempe/README.md`'s catalogue and the essay's sheet chart (WEDATA.sheets).**
- The arrangement: the sheets' own title blocks give 001/002 19.3.41 (the year's digit smudged; 17-19.3), 05 04_21 12.6.41, 05 08_30 22.9.41, 05 08_31 25.9.41, 05 33 127-556.05 / 3300, 05 36_2 127-556.06-06, and 05 38 3800.
- The model: the catalogue rows 66-67, 117, 179, 180, 183-187 carry 10.03.41, 16.09.42, 22.04.41, 25.07.41, 18.07.41, "12 05_33", "127-566.06", "05 30_00". These are the index's (F5). `tools/wempe_essaydata.js` copies them into `wempe/js/essaydata.js`, so the essay's chart shows them.
- Correction:
  - put the sheets' readings in the catalogue (keeping the index's as "the index has …" if wanted);
  - then `node tools/wempe_essaydata.js --write`, about 9 min;
  - 05 08_33's date stays unsettled (say so).
- Physics: no.

**M5. Text, sure. The Wempe README's "Superseded, left out or for later" (line 752) and its exclusion reasons (lines 756, 939).**
- The arrangement: the Steg 05 07 00-1 is 0207's part 106, built since 18 October 2026 (README line 130).
- The model: built. The Superseded list still says "Not built: the barrel's Steg 05 07 00-1 (coloured section, no sheet) …".
- Lines 756 and 939 give "127-556 is the Luftwaffe's lever chronometer BC 1010" as the reason for 05-33 and 05-36 (and the lever's sheets), though this calibre's own plates are drilled for all three options (F9). 001's left view even draws the hand setting's block.
- Correction:
  - strike the stale Steg sentence (pointing to line 130);
  - word 05-33, 05-36 and 05-38 as options of this calibre's plates (05 08 02-1's 14-18 and 56-57, 05 09 01's 51-53), with 001's block as evidence for the hand setting.
- Physics: no.

**M6. Relation and estimate, sure (relation), possible (length). Coloured section, the ring's steady pin WN-201 (every version).**
- The arrangement: through the plate's rim into the ring, rows 537-604 (0..7.2).
- The model: Ø 0.98, y 0.1..5.35 (5.25 long, "estimated" in frame.js), held 50/53 by PP and ring. bom.json has only `in 050800-3 press`.
- Correction:
  - add `in 050802-1` (press or clear, as the sheets give the plate's pin hole) to WN-201;
  - lengthen the pin to the section's about 7 (and its hole in the ring), if the ring's sheet (batch 9) leaves room under the plate's rim, recorded in Estimated;
  - fine.py and holecheck to confirm.
- Physics: no.

**M7. Text (names), likely. Coloured section, labels the lines don't carry (every version).**
- The arrangement:
  - the dial's pin is labelled "Stellstift WN-201" (the second leader from the left-hand label, `a_left.png`);
  - the banking screw is "Schrb. WN-16" (README 872's own reading);
  - the setting screws' (M1) and the cock's screw (batch 8's M14) labels are as batch 8 found.
- The model:
  - `dialPin` has no WN number, though its sizes match the section's (4.9 long);
  - WN-gkA / WN-gkA43 is "its WN number not read".
- Correction: name the dial pin WN-201 (dial) and the banking screw WN-16 on their bom lines and cards. The README already reads them.
- Physics: no.

**M8. Owner, sure. Coloured section and 001, the band against the chain (drawn versions).**
- The arrangement: the section draws and labels the band (Band 05 07 03-1, Bandhaken f. Trommel 05 07 03-3) with the chain pin (Kettenstift 05 06 00-6). 001 (1941) draws chain links on the barrel.
- The model: the chain by default, the band under Variants (`conn=band`); both built.
- Both are drawn, so there is no fault. If the coloured section is taken as the movement as last revised (its band of 1.3.43), the default could be the band for "last" and the chain for "first".
- Correction: the owner's choice. Record it in the README's Variants paragraph either way.
- Physics: the band and chain have their own drive tables (wempe_mainspring.py) only if the default changes.

**M9. Relation, sure (minor). bom.json, 050504-1, the seconds arbor's jewel (every version but where the 6MX differs).**
- The arrangement: the stone in its setting 050504-2, in the intermediate bridge.
- The model: the setting `in 050804-1 press`, the stone no relation at all.
- Correction: `in 050504-2 press` (or `round`, as its fit is read: no sheet).
- Physics: no.

**M10. Owner, possible. 05 08 02-1's holes 56 and 57 (Kontakt Schr., "nur bei Bedarf") (last, first, 1943).**
- The arrangement: M1.7 at (−5.0, 40.19) and (13.5, 38.18), for 05-38's unit.
- The model: built in no version. README 751 records them.
- Correction:
  - Recommended (reading a): keep them out, and add a comment in HOLE_EXPECTED and README 751 that they are drilled only when the contact is fitted ("nur bei Bedarf"), as Wempe 3955's plate has none.
  - Otherwise (reading b): drill them in the drawn versions with a HOLE_EXPECTED entry each.
  - Either way, note that the 6MX's base screws aren't these holes (5.4 and 14.1 mm off).
- Physics: no.

**M11. Joint, sure. 6MX, the contact screw 6MX.ctk and its lock nut 6MX.ctn (S-5).**
- The arrangement: no sheet. Kirov 247's photographs (10_Kirow_247, the thread) show the screw threaded through its holder on the lever's end, locked by the nut.
- The model: the screw (Ø 1.0 at y −5.85) passes through solid metal in the holder, and the nut through solid metal on it: SEAT_EXPECTED's OPEN entry.
- Correction:
  - an M1.0 tapped hole through the holder along the screw's axis, and the nut's bore M1.0 with matched threads;
  - remove the OPEN entry; the nut's own entry stays;
  - seatcheck, fine.py (`--model wempe` with `setRev('6mx')`) and holecheck to confirm.
- Physics: no.

**M12. Reading corrected, sure. batch11-read.md's Joints table.**
- The comparison corrected these rows of the reading:
  - J8: the barrel bridge's underside is on TP's outer face, not at TP's own level;
  - J24: the click wheel is at the cone's base;
  - J32: the Vorreiber is above PP, between the fusee wheel and the plate;
  - J43: the intermediate arbor's lower pivot is in the Zwischenbrücke, in WN-300.zb, not PP;
  - J52: the seconds jewel's setting is in the Zwischenbrücke, not PP;
  - J55: the detent block hangs under TP;
  - F7: WN-12a's leader goes down to a screw on a mass, not to a place under the cock;
  - 001's "possible holding-device tong" at 1-2 o'clock is the maintaining detent at 4 and its spring's stud at 5;
  - the rows of the fusee and escapement groups (J22-J33, J55-J60) are re-read above.
- In each case the model was right.
- Correction: none to the model; the ledger's Joints rows should take these readings.
- Physics: no.

**M13. Excuse, sure (small). audit-expected.json (`floatScrews`), the 6MX's movement ring screws.**
- The arrangement: the screw's head on the plate's rim, over the ring, as the coloured section's right end draws it.
- The model: seated (seatcheck: SEAT_EXPECTED's ring entry). audit.py reports the three `floatScrews` entries as "no longer found (take it out)".
- Correction: `audit.py --model wempe --update`, or remove the three entries by hand, keeping their reason in SEAT_EXPECTED's ring entry.
- Physics: no.
