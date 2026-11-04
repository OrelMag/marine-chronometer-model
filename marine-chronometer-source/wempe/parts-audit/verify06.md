# Batch 6 (the escapement): the verifier's reading

Verifier for batch 6. I read the sheets again, enlarged (crops in `E:/mc-video/wpa-audit/crops/`, outside the repository), and the measurement files in `r_wpa/measure` and `r_wpa/page`. I did not read `batch06.md`, the ledgers, the code or git.

**Scales used.** On 05 04_1 the scan is 24.6 px/mm. I got it from two printed sizes: the pipe to the M1.7 axis, 18.8 (462 px), and the balance to the escape wheel, 10.00 (246 px); both agree to 0.3 %. The detent's top edge and the block's edges are square on the scan to 0.3-0.5°, so angles can be taken from it. On 05 04_10.1 the scan is 17.4 px/mm (foot 6.6 = 115 px, foot width 0.65, pipe 1.15).

**Dates.** The layout 05 04_1 is dated 3.2.40 (checked 2.41) and its revision block is empty. The block sheet 05 04_3 is dated 8.7.43 (checked 19.7.43, 21.7.43). The gold spring 05 04_2 is 16.9.42 (21.7.43 entered). The detent 05 04_10 is 17.2.43. The roller 51 04_6 is 11.2.41 with "6 Eintragungen" on 10.9.41. So the block's later sheet (1943) is younger than the layout by three years, and it has no chamfer, a 3 mm arm and the stud at 2.8.

**Hand, settled as assembled.** `r_wpa/page/placements.json` gives the stone, 050401-3, its sections in world Y: the pipe-held part is at y -16.65..-14.75 (a circle of d 0.75) and the working part at -18.66..-16.65, sticking out of the pipe's lower end. The detent's own y range is -17.65..-14.75, and its pipe is 1.9 long (z 2.35..4.25). The pipe's z range fits y -16.65..-14.75 only if the part's +Z is world +y (dial side). So the detent's measure frame has +Z = +y, is right-handed against the world, and is **not built mirrored**. The same holds for the impulse roller (its z levels -18.68..-17.03 are its world y levels).

- The measure plan from +Z is the movement seen from the dial side.
- The layout plan sits under its section, so it is first-angle (DIN), seen from the Oberplatte side, -y. It is the mirror of the measure plan. I checked this by the layout's positions: the balance to pipe and wheel vectors have the x sign flipped against the world.
- On the layout, with the tip pointing left, the gold spring and the wheel lie below the arm. In the world, the gold spring (y 0.36..0.51) and the wheel are on the detent's +y side, the wide side of the arm. Same side: built = layout.
- Sheet 10.1 (first-angle, side view to the right, which is the left-side view, so the pipe stands toward the plan's viewer): tip up, wide side right, pipe toward the viewer. That is the measure plan from +Z (tip up, foot down: x down; wide: y right; x down × y right = toward the viewer). **Built = 10.1, hand match.** This holds if the sheet is first-angle, as the layout shows the office uses it.
- Sheet 05 04_3 and the layout show the block from -Z (the measure frame seen from the opposite face). The built near hole (x 16.73) sits on the arm side of the hole row and the far hole (20.73) on the other side. In the layout the near hole is left (toward the pipe) and the far one right, and the 05 04_3 plan agrees. **Match.**
- Roller sheet 51 04_6: from the stone to the small hole the sheet turns +152° (counter-clockwise); the built plan from +Z turns -152° (clockwise). So the sheet is drawn from the plate side (-y) as the layout is. Both the stone and the hole flip together. **Match.**

## Sheet 05 04_1, layout (Hemmung für Feder-Chronometer, Kaliber 020, 3.2.40)

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 06-1-1 | 10.00 match | 10.00 printed, drawn 246 px = 10.0 (sure) | 9.9997 | match | yes | |
| 06-1-2 | 14.00 match | 14.00 printed (sure); 15 tooth tips span 14 | tips_d 14.0 | match | yes | |
| 06-1-3 | 6.78 match | 6.78 printed (sure); drawn 6.8 | 6.78 | match | yes | |
| 06-1-4 | 1.8 match | "1,8" printed; bore circle r 23 px = 0.93 (likely) | 1.808 | match | yes | |
| 06-1-5 | 0.75 match | Ruhestein ⌀0.75 printed (sure) | 0.754 | match | yes | |
| 06-1-6 | 25.68 match | 25.68, balance to M1.7: I measure 629.6 px = 25.59 +-0.1 (sure) | 25.77 | match (+0.09; borderline of the +-0.1 fallback) | yes | the arrow ends on the M1.7 circle (766.5, 293.5), Hough fit |
| 06-1-7 | 23.8 mismatch | 23.8 printed; I measure E to M1.7 583.8 px = 23.73 +-0.1 (sure). The label sits on the slanted line from the wheel centre; its angle (37°) is that line's | 23.41 | **mismatch, -0.39** | yes | confirmed: more than 0.1 (fallback for 6-30 mm). No later part sheet gives E to M1.7 or the wheel's place (05 04_2, _3, _10 give block and detent sizes only), so nothing supersedes. |
| 06-1-8 | 18.8 match | 18.8 printed, pipe axis to M1.7 axis (extension line starts 0.2 right of the pipe axis, i.e. the M1.2 cross hole; 05 04_3 gives 18.8 +-0.03 from that hole) (sure) | 18.73 / M1.2 at -0.0659: 18.800 | match | yes | |
| 06-1-9 | 7.6 match | 7.6 printed, M1.7 to the foot centre line; I measure 187 px = 7.6 (sure) | 7.60 | match | yes | |
| 06-1-10 | 7.2 match | pipe centre to wheel centre: 177 px = 7.2 (likely) | 7.14 | match | yes | |
| 06-1-11 | 5.99 match | pipe to balance 148.2 px = 6.03 (likely) | 6.08 | match | yes | |
| 06-1-12 | wheel along the detent from the pipe 0, mismatch +0.447 | wheel bore centre x 304.5, pipe centre x 304.5 (Hough fit both): offset 0.0 +-0.05; detent axis horizontal to 0.2° (likely to sure) | +0.447 toward the foot (derived from the placed pipe and wheel, detent axis (-0.906, 0.423)) | **mismatch, +0.45** | yes | the dimension chain closes: 18.8 along and 14.6 across (7.49 + 7.12) gives sqrt = 23.75 = the printed 23.8; with the built offset it gives 23.41. So the 23.8 mismatch IS this offset. |
| 06-1-13 | angle 53.6 vs 49.4 mismatch | B-E line against the detent axis: 53.3 +-0.7° (sure); built 49.4 (from the placed B, E and the detent axis) | 49.4 | **mismatch, -3.9°** | yes | same rotation of the detent about the pipe (3.6-4°) as the wheel offset above; the B-E-pipe triangle itself matches (98.1° vs 98.0° at the pipe) |
| 06-1-14 | 15° unattached, built 15.8, can't tell | the 25.68 line makes 14.7 +-0.5° with the detent axis (159.8 px over 609 px); the label 15° (small arrow pair near the wheel's lower right) most likely repeats it (unsure) | 15.8 | **mismatch about -1° if so** (can't tell what it attaches to) | disagree in part | the number fits the drawn line, which the reader hadn't tried; fallback +-30' |
| 06-1-15 | bend point 6.3 vs 4.43, mismatch | the arrow of "Biegungspunkt der Goldfeder" touches the spring at orig x 415; the end block's right end is at 567.5 (block 511-567: 2.3 = 2.4 printed): 6.2 from the end (likely; +-0.2) | 4.43 (x 6.15, end 10.5841) | **mismatch, -1.8** | yes | no later sheet: 05 04_2 draws the blank straight. The layout's spring leaves its straight run at 6.2 from the end and runs on bowed to the tip: 15.4 total |
| 06-1-16 | 1.23 match | screw 28.7 px from the end = 1.17 (likely) | 1.20 | match | yes | |
| 06-1-17 | stud 3.8 vs 4.5 mismatch | stud circle 94 px below M1.7 = 3.82 (likely) | 4.50 | **superseded**: later sheet 05 04_3 (8.7.43) gives the 1.3 hole 2.8 and M1.7 7.3 from the edge = 4.5 | disagree on the class | the layout is the earlier sheet; the built follows the later |
| 06-1-18 | 0.9 holes match | small circles at (+1.97, -4.9) and (-2.0, +5.1) from M1.7: 2.0 and 5.0 (likely) | +-2.0 / 5.0 | match | yes | hand: near hole left, far right, as built (above) |
| 06-1-19 | pins 4.0 vs 4.2 can't tell | in the layout 3.92 between the pin axes (193 px); on 10.1 the pins are 2.0 above and 2.2 below the hole by scale (71 px of 5x crop = 4.1 across, +-0.1) (unsure) | 4.2 | match within the scaling (3.9-4.1 against 4.2, +-0.15) | partly: I say match, not can't tell | nothing printed |
| 06-1-20 | chamfer not built | 45° chamfer at the block's far-end corner in the layout (likely) | plain rectangle | **superseded**: 05 04_3, the later sheet, shows the base as a plain rectangle (I read its corner at the arm side of the far end as square) | disagree on the class | the layout is 3.2.40, the block sheet 8.7.43 |
| 06-1-21 | block 7.55 x 14.7 match | accepted by sample: the polygon 7.5 x 14.7 by scale; 05 04_3 gives 14.6 and 7.5 | 7.5 x 14.6 | match | yes | |
| 06-1-22/23 | 1.7 / 1.7 match | printed "Hebesteinbreite 1,7", "Auslösesteinbreite 1,7" (sure) | 1.70/1.70 | match | yes | |
| 06-1-24 | 1.6 each match | printed 1.6 twice on the section (likely) | 1.65 / 1.60 | match | yes | roller sheet gives 1.6 +0.1 |
| 06-1-25 | arm 2.8 vs 3.0 mismatch | 2.8 and 1.4 printed on the layout section (likely) | 3.0 | **superseded**: 05 04_3 (8.7.43) prints the arm 3 (sure), with 1.4 +0.1 | disagree on the class | |
| 06-1-26 | banking, stone angle, jewel angles can't tell | see "tried harder" below | - | can't tell | yes | |
| 06-1-27 | tooth count can't tell | successive tips of the wheel at 42.5°, 18.5°, -5.4° from the centre: pitch 24.0° (and 49.6° over two); 360 / 24 = 15 (likely) | 15 teeth, 24° | **match** | disagree | the printed "24°" is the same pitch |
| 06-1-28 | heights can't tell | not tried further; accepted, not re-read | - | can't tell | yes | |

**Tried harder.**

- Banking and the locking stone's angle: the layout prints "12°" beside a thin spire on the pipe axis (a cone with a 12° mark, 7.6 mm long on the sheet). That is longer than the 3.9 mm stone, so it is not the stone in plan; I cannot attach it. The balance's angles 24°, 21°, 11½°, 2°, 1°, ½° hang on dashed arcs whose lines I cannot tie to the roller or the discharge jewel. 86°, 22°10', 6° 5° and 20° are on the wheel's spokes and teeth, with no lines to tie them to. All stay "can't tell", not "mismatch".
- The 0.04 gaps, one beside the gold spring and one at the block's foot, are legible but not mappable to a built gap.
- The "Biegungspunkt der Gangfeder" arrow is at the foot-to-spring junction, x about 15.4 (block edge 14.98). Built spring ends at 15.384. Match (likely). The reader missed this item.

## Sheet 05 04_2, gold spring 05 04 01-2 (16.9.42, 21.7.43), Goldblech 333 federhart, 5:1

Scale from the 15.4 (772 px of a 2x view = 50 px/mm).

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 06-2-1 | 15.4 match | 15.4, left end to right end, printed (sure) | 15.33 developed (bent) | match (-0.07) | yes | |
| 06-2-2 | width 1 | 1 (sure) | 1.0 | match | yes | |
| 06-2-3 | 0.15 | 0.15 (sure); in the 3.2.40 layout the thinned build is not drawn | 0.15 | match | yes | |
| 06-2-4 | block 2.4 | 2.4 (sure) | 2.4 | match | yes | |
| 06-2-5 | block height 2 | 2 (sure) | 2.0 | match | yes | |
| 06-2-6 | hole 0.7 +0.05 | 0.7 +0.05 printed (sure) | 0.7 | match, at the lower limit | yes | the same on the thread of a 0.7 pin fit |
| 06-2-7 | 1.2 | 1.2 printed; I measure 1.14 (sure) | 1.2 | match | yes | |
| 06-2-8 | 1.0 across | hole 1.0 from the strip edge by scale (50 px) (likely) | 0.95 | match | yes | |
| 06-2-9 | straight blank, built bent: extra | the sheet draws it straight (blank); the layout draws it bowed with a bend point at 6.2 (see 06-1-15) | bent | extra, and the bend point is the mismatch above | yes | |
| 06-2-10 | gold 333 federhart | printed (sure) | - | can't tell (material) | yes | |

## Sheet 05 04_3, Gangfederkloben 05 04 01-4 (8.7.43), 5:1, general tolerance "nicht eingetr. Toleranz +-0.1"

I re-read all printed sizes on the sheet. Index note: the reader's field citations for the two holes in the row are swapped. `detentBlock.cylinders[1]` is the M1.7 (d 1.3211 at y -7.49) and `cylinders[2]` is the 1.3 hole (y -2.99). The values the reader gave are right; only the index is off (06-3-17, 06-3-18, 06-3-19).

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 06-3-1/2 | 25 / 14.6 | 25, 14.6 printed | 25.0 / 14.6 | match | yes | |
| 06-3-3 | 7.5 | 7.5 (3.75 each side of the row, printed 3.75) | 7.5 | match | yes | |
| 06-3-4/5/6/7 | arm 3, 1.4 +0.1, 17.5, 15 | all printed (sure) | 3.0, 1.40, 17.5, 15.0 | match | yes | |
| 06-3-8/9 | 3 r, 0.4 | printed | r 3.0, 0.4 | match | yes | |
| 06-3-10 | slit 0.3 x 7 | printed | 0.3 / 7.0 | match | yes | |
| 06-3-11 | M1.2 18.8 +-0.03 | 18.8 +-0.03 (sure) | 18.800 | match | yes | |
| 06-3-12 | M1.2 core | M1.2 printed; core 0.93 | 0.9294 | match | yes | |
| 06-3-13 | M1.2 across the arm: built 5.15 vs centred 5.0, "unsure" | in the right view the hole is centred in the 3 mm arm: arm edges at x 140 and 660 (10x crop), hole centre 400 and the vertical centre dash 395: centred within 0.03 mm (sure) | z 5.15 with the arm z 3.5..6.5 (centre 5.0) | **mismatch, +0.15** | agree on the class, but it is "sure" not "unsure" | general tolerance +-0.1 |
| 06-3-14/15 | base 3, 6.5 +0.05 | printed | 3.0, 6.5 | match | yes | |
| 06-3-16 | step 6.5, scaled 6.44 | 6.5 along the base edge (6.5 printed bottom view) | 6.4 (y -0.19..-6.59) | match | yes | |
| 06-3-17 | M1.7 at 7.3 +0.04 | printed | 7.30 | match | yes | |
| 06-3-18 | M1.7 core | printed | 1.3211 | match | yes | |
| 06-3-19/20 | 1.3 hole 2.8, tief 3 | printed | 2.80, 3.0 | match | yes | |
| 06-3-21/22 | 0.9 holes at 2.3 and 12.3, 2 off the row | printed; I re-read the 2, 2.3 and 12.3 | matched | match | yes | hand: above |
| 06-3-23/24 | M1 at 2.3 +0.02, core | printed | 2.3, 0.7294 | match | yes | |
| 06-3-25 | 90° +-0.5 | printed | 90° | match | yes | |
| 06-3-26 | hand match | settled above, from the layout and this sheet | - | match | yes | |
| 06-3-27 | tolerance note | +-0.1 printed (sure) | - | can't tell | yes | |
| 06-3-28 | steady-pin holes extra | not on this sheet (sure); on 05 04_10 the pins are in the foot (about 2 mm each side of the hole) | present | extra (the pin holes come from the detent sheet) | yes | |

## Sheet 51 04_6, Heberolle 02 04 02 (11.2.41, "6 Eintragungen" 10.9.41), Kupfer-Beryllium, Saphir, 10:1

I checked the geometry as a whole, with the centre line of the sheet found from the 0.7/1.9 small hole. The built small hole is at angle 122.8° and the stone pocket at -85°. The centre line through the main hole that makes the hole 0.7 across and 1.9 along is at -77.4°, and then the pocket centre is 8° off it, which is the sheet's 0.34 mm. The sheet also draws the stone off that line by 0.34 mm.

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 06-4-1/2 | 6.78 +-0.01; 1.6 +0.1 | printed | 6.78; 1.65 | match | yes | |
| 06-4-3 | taper 1:70, 1.65 -0.03 / 1.627 | "Kegel 1:70 aufreiben", 1.65 -0.03, 1.627 printed | 1.6264..1.65 | match | yes | |
| 06-4-4/5 | 1.3 hole at 0.7 / 1.9 | printed; hole drawn 88 px = 1.24 across | 1.3; radius 2.025 = sqrt(0.7²+1.9²) | match | yes | |
| 06-4-6/7 | slot 0.5; inner end 1.55 | 0.5 and 1.55 printed | 0.506, 1.50..1.58 | match | yes | |
| 06-4-8 | stone length 1.8 can't tell | "1,8" printed beside the stone, from the slot's inner end to the stone's tip | pocket depth 1.0, stone is 050403-2 | can't tell | yes | |
| 06-4-9/10 | cut 3.5 r; chord 3.5 | printed; chord 3.5 spans left end to right end (extension lines at the two ends of the cut), 2 from the centre line to the right end, so 1.5 to the left end | arcs r 3.5; the tips are 1.50 and 2.00 from the centre line I found, and 3.04 and 2.74 along it (the sheet by scale 3.04 and 2.70) | match | yes | the ends confirm the built cut's place along the axis to 0.05 |
| 06-4-11 | "2" and 9.005 can't tell | the "2" is from the centre line to the cut's right end (matched above). "9,005" is a slanted leader between two arrows pointing at the centre line, at two levels 1.8 mm apart on the sheet: I cannot attach it; if it were the rim to the cut circle's centre it would be 5.62 from the axis against built 5.93, but the ends above argue against that | cut centre 5.927 | can't tell | yes | |
| 06-4-12 | hand match | sheet is drawn from the plate side (above) | - | match | yes | |
| 06-4-13 | 1.7 | printed | 1.70 | match | yes | |
| 06-4-14/15 | material; extra | printed; not printed | - | can't tell / extra | yes | |

## Sheet 05 04_10.1, Gangfeder, Rud. Grießbach 1436 (17.2.43), Stahl, 5:1, sheet 1

Dates: drawn 17.2.43 by Ruth(?) Grießbach; no revisions. The handwritten brackets read as a later correction of the typed first draft (they are all in pencil, beside the typed figures).

**What the sheet's drawn tail is.** The tail in the plan is drawn about 5.2 mm from tip to pipe centre (91 px at 17.4 px/mm) while its printed figure is 4.4 (dimension line from the tip to the pipe centre line). The right view's "5 1/4 (4.9)" is the same: 5.6 drawn. So the tail was shortened by about 0.8 mm in the correction and not redrawn. **Scaled readings of the tail's length are therefore the first draft's**; sizes across the tail (lateral) keep their scale (the pipe 1.15 and foot width 0.65 are drawn true).

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 06-5-1 | tip to pipe 4.4 | 4.4 printed, from the tip line to the pipe's centre dash line (sure) | 4.4 | match | yes | drawn longer, see above |
| 06-5-2 | 4.9 bracket | "5 1/4 (4.9)" tip to the pipe's far side | 4.975 | match (+0.075, +-0.1) | yes | |
| 06-5-3 | tail width at the pipe 0.25 (0.22) | printed at the pipe level (arrows 0.24 apart at 17.4 px/mm) | 0.22 | match | yes | |
| 06-5-4 | tail width at the tip 0.25 (0.22): 0.054 mismatch | the top callout is a second "0,25 (0,22)", the same figure as at the pipe. Its two arrows meet two vertical lines 0.24 mm apart (5 px at 17.4) that run straight up from the tail, as the unbent blank's edges (the bent tail leaves them toward the left: the "Anschrägen" leader points at the tip). So it gives the blank's width at tip level, the same as at the pipe: a tail of constant 0.25 (0.22) width. The tip drawn end (two edges) is 0.25-0.5 across. I measure the drawn tip as at least 0.25 wide (likely) | tail 0.22 at the pipe, narrowing to a 0.054 end (x -4.4, y -0.5418..-0.5954; the edges meet) | **mismatch, tip 0.054 against about 0.22-0.25 (-0.17)** | yes | the callout attaches to the straight blank's two edges, not to the built tip. The built tail tapers along its length to a sliver; the sheet does not draw a taper |
| 06-5-5 | bend offset 0.54 | left edge of the tip 9 px (0.52 mm) left of the blank's left edge (likely) | 0.57 | match | yes | |
| 06-5-6/7 | 0.33 (0.28); 0.55 (0.50) | printed, bracket read as the correction | 0.28; 0.50 | match | yes | |
| 06-5-8/9 | 0.09; 0.07 | printed (the 0.09 is the spring at both ends, 0.07 the middle) | 0.09; 0.07 | match | yes | |
| 06-5-10/11 | spring 5.0; Viereck 2 x 2 (1.9) | spring scaled 5.0; "2" and "(1,9)" printed | 5.0; 2.0 x 1.9 | match | yes | |
| 06-5-12/13 | foot 6.6; 2 (1.9) | printed (6.6: 115 px) | 6.6; 1.9 | match | yes | |
| 06-5-14/15/16 | arm z 1 (0.9); tail z 0.8 (0.75); foot width 0.65 (0.60) | printed | 0.9; 0.75; 0.6 | match | yes | |
| 06-5-17 | foot hole 1.0 scaled | circle 18 px = 1.03 (unsure); 3.28 from the foot end by scale | 1.1 at 3.25 from the end | match within the scale (the 0.07-0.1 is at the limit) | yes | |
| 06-5-18 | pins 2.0 | by scale 1.95 above and 2.16 below the hole (see 06-1-19) | 2.1 | match | yes | |
| 06-5-19 | overall 26.7 scaled | drawn 27.1; with the tail's 0.8 first-draft excess it is about 26.3 | 26.38 | match | yes | |
| 06-5-20 | pipe length 1.9 | 1.9 by scale (2.0 and (1.9) on the right view: foot 2 (1.9), pipe stands 1.0 past the arm) | 1.9 | match | yes | |
| 06-5-21 | pipe OD 1.0, can't tell | the plan prints "1,15" with extension lines around the pipe ring, and the ring draws 20 px = 1.15 (likely) | 1.15 | **match**, not can't tell | disagree on the class | the reader scaled it; it is printed |
| 06-5-22 | brackets | the brackets are written by hand beside the typed figures; I read them as the later correction and built agrees with them throughout | - | can't tell (which is later is not stated), consistent with built | yes | |
| 06-5-23 | hand can't tell | **settled: match**, see the hand section | - | match (likely) | disagree on the class | pipe at the side the sheet's right view puts it, wide side where the world puts it |

## Sheet 05 04_10.2 (sheet 2)

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 06-6-1 | the names exist | accepted, not re-read (labels only) | - | match | yes | |
| 06-6-2 | pipe stands on the arm's flush side | the pipe is "oben" and the arm face is flush with the foot's top (3.25), the pipe 1.0 past it | pipe z 2.35..4.25, arm 2.35..3.25 | match | yes | as assembled the pipe is on the dial side (hand section) |
| 06-6-3 | linke/rechte Seite can't tell | not re-read | - | can't tell | yes | |

## Missed by the reader

| id | sheet | item | my reading (certainty) | built | verdict |
|---|---|---|---|---|---|
| 06-1-v1 | 05 04_1 | "6,0" with a leader to the wheel's left rim, at the tooth roots | 6.0 radius to the tooth root; the rim's outer face (the root circle) draws at 5.83-5.94 (unsure) | roots_d 11.699 (r 5.85); rim 5.93 | match within 0.15 (can't be better: a hand leader, no extension lines) |
| 06-1-v2 | 05 04_1 | the detent's spring ends at the block face: "Biegungspunkt der Gangfeder" | at the foot-spring junction, x about 15.4 (likely) | thin spring to 15.384; base edge 14.98 | match |
| 06-1-v3 | 05 04_1 | detent layout across the foot: Viereck at 1020-1135, spring 1135-1370, foot 1370-1695 in the 2x view | 8.3, 4.8, 6.6 from the pipe (likely) | 8.384, 5.0, 6.6 | match |
| 06-5-v1 | 05 04_10.1 | "0,18 u.d.f." beside the 0.07 spring section (the word after 0.18 is not readable as an abbreviation) | illegible | - | can't tell |
| 06-5-v2 | 05 04_10.1 | pipe-to-foot-hole length, drawn between two dimension lines at x 690 and 770 of the 2x view: 651 px = 18.7 | 18.7 (likely) | 18.7341 | match |
| 06-1-v4 | 05 04_1 | detent angle against the wheel: the wheel is drawn directly under the pipe on the perpendicular to the detent, the built wheel is 3.6° off | measured, sure | 3.6° | part of 06-1-12/13 (same rotation) |
| 06-3-v1 | 05 04_3 | arm 3 against the layout's 2.8: the later sheet gives 3 | sure | 3.0 | supersedes the layout (06-1-25) |

## Summary of disagreements with the reader

1. **06-1-7, 06-1-12, 06-1-13: all three confirmed, and they are one fault.** The built detent is turned about 3.6-4° about the pipe against the layout's balance-wheel pair. The layout puts the wheel directly under the pipe (0.0 +-0.05) at 10.00 from the balance, E to M1.7 = 23.8, B to M1.7 = 25.68, B-E line at 53.3° to the detent axis. The built has the wheel 0.447 toward the foot, 23.41, 25.77, 49.4°. The printed distances, measured on two known sizes (18.8 and 10.00), make a closed chain (18.8 along, 14.6 across: 23.75). Nothing later (05 04_2, _3, _10) gives the wheel's place.
2. **06-1-17, 06-1-20 and 06-1-25 are superseded, not mismatches.** The later block sheet (05 04_3, 8.7.43) gives the stud at 2.8, a plain base, and the arm 3; the built follows it.
3. **06-1-14:** the 15° most likely attaches to the 25.68 line against the detent axis (I measure 14.7 +-0.5°); built 15.8, about 1° out (fallback +-30'). Unsure.
4. **06-1-15:** bend point 6.2 from the end against the built 4.43 confirmed (likely).
5. **06-1-27:** the tooth count is readable: successive tips are 24.0° apart, so 15 teeth. Match, not can't tell.
6. **06-5-4:** the 0.25 (0.22) at the tail tip attaches to the blank's two straight edges at tip level, the same width as at the pipe. The built tail narrows to a 0.054 sliver. Mismatch confirmed (likely).
7. **06-5-21:** the pipe's 1.15 is printed; match.
8. **06-5-23 and the hand:** settled as match. The stone's sections fix the detent's frame as +Z = dial side, not mirrored; 10.1 (first-angle) agrees with the measure plan; the layout and the roller sheet are drawn from the plate side.
9. **06-3-13** is a sure mismatch (+0.15; sheet centred to 0.03), not unsure. Field indices in 06-3-17/18/19 are swapped (`cylinders[1]` is M1.7, `[2]` the 1.3 hole).
10. 06-1-19 (pins) I read as match within the scale, not can't tell. 06-4-11's "9,005" I could not attach either. The scaled readings off the tail on 10.1 are the first draft's (about 0.8 mm too long against the printed 4.4).
