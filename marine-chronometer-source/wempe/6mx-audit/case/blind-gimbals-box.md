# 6MX case, gimbals and box: blind photo read

Written blind: I did not open `case.js`, `frame.js`, `dims.js`, `app.js`, the Wempe README, `6mx-audit/` (other than this folder), `WEMPE-PROVENANCE.md`, `PLAN-wempe-6mx.md` or the photocompare specs, and I did not run the page. No model value was seen. (I did read `References/wempe/VIDEOS.md` lines about the videos, which are source text, not model values.)

## Method

- Photographs and video frames were looked at directly; frames in `E:\mc-video\oq\6mx-case\` and `E:\mc-video\frames\`, contact sheets in `E:\mc-video\sheets\`, none committed. Picks are by eye (about +-8 px on a 1024 px photo), tabulated and turned into mm and angles by `case_readings.py` (this folder; `montage.py` made the contact sheets).
- **Scale is the weak link.** No photograph carries a ruler. Chain used: the movement ring's gilt flange (105.95 mm) sits in the bowl bore; on Kirova 14100 `9C22A7DC` (bowl face-on) the flange reads about 805 px against the knurled bezel's 920 px, so bezel outer about 121 mm; on `11_Kirow_DEC_422_Gehaeuse` the cylindrical wall is 890 px against the bezel's 978 px, so **wall about 110 mm, bezel about 121 mm, each +-6 %**. Everything in mm on the bowl and bracket below is that scale (a second chronometer, 247 and 2973, agrees with 422 on every size to within 10 %, which cross-checks the relative sizes but not the absolute scale). Box sizes assume the closed box's front face is 190 mm wide (TU of 1984); the photo itself only shows the front face is about square (width : height = 775 : 800 px on 22823, 0.97).
- Photos are orthographic enough for the side-on bowl views (long lenses, Altmeppen's studio set); angles round the bowl are taken as asin(x/R) about the bowl's centre line, valid to a few degrees.
- Ranking used: Kirov 247 first, 2973, other 1950s Kirovs, then Kirov-Poljot/Poljot, DEC 422 and 479 last (they differ: see "Surprises").

## Photos looked at

Used for readings: `leben-des-6mx/12_Kirow_247_E-Kontakt_3`, `11_Kirow247_E-Kontakt_2`, `10_Kirow_247_E-Kontakt_1`, `13_/14_Kirow_247_Kasten_*`, `1_Kirow_247` (identical to `14_Kasten_2`), `15_KirPol_24020_Kasten`, `11_Poljot_20027_komplett`; `bilder-zum-6mx/13_Kirow_2973_E-Kontakt4`, `14_Kirow_2973_Kasten`, `10_Kirow_22823_Kasten`, `10_Kirow_23239_Kasten`, `14_Poljot_08479_Kasten_komplett`, `10_Poljot_*_Kasten`, `11_Kirow_1564_Zu`; `dg-chrono-dec/11_Kirow_DEC_422_Gehaeuse`, `12_Kirow_DEC_422_Kasten_1`, `10_Kirow_DEC_479_Kasten_1`; Kirova 14100 (`chasy-ru-9985-kirova-14100`, 24 images: see below). Not useful for this job (papers, movement parts): 308, 707, 1564 sets, 5_*/6_* 09218/20027 movement close-ups.

Kirova 14100 (24 jpeg, a worn, un-lacquered early set; never opened by the project before): `37E5A7C1` bowl from the foot with the gimbal ring round it (best view of the bowl bottom, ring pads, pivot stud); `56956DF5` the same from the side (ring pads and slots, the bowl brackets); `9C22A7DC` bowl face-on with the dial and the ring lying beside it (the bowl brackets seen end-on, the ring's pad with its pivot stud); `EFF56BA1` bowl from the bezel side on grass (bracket with its pivot screw, ring pad with three screws, glass bezel, knurl); `D2075E88` bowl from the foot, tilted; `021C276E, 023222B5, 202D916B, 5BBB6BDB, 80EDF7B0, 77E911CC` close-ups of the movement in the bowl (fusee side, barrel, chain, dial ring); `1E7A2D09` ~28 small screws and a pin on white; `4D47F0A7/B95A3474` and `604E0CB3` movement top; the two plates, ring, dial, hands laid out (`6A3B20D1`, `75A36D97`); a wheel set, small parts, two photos of a thin strip part (a spring). None shows the box, the key or a transit lock.

Videos: `moMvyx8eXfo` 0:54-3:40 (outer box, inner box opened, bowl lifted out), 7:10-7:44 (bowl bottom in the ring, key put in); `Uy8A88_j-cA` 5:14-5:28; `DIxob2Rl4dc` 0:50-2:10, 5:20-6:00, 6:55-7:24; `rAw2zmulpk8` 0:05-2:10. Note `moMvyx8eXfo` is a recent, lacquered, brass-fitted box (maker's own show-piece), so its box details are that box's; 11:17 in it is a factory montage (no transit damper there).

## Ledger

Units mm. "+-" is my estimate of the reading's error, not the scatter. How sure: sure / likely / doubtful / can't tell.

### 1. Case brackets (on the bowl, carry the inner pivots)

| item | photo / frame | scale and source | reading +- | how sure | notes |
|---|---|---|---|---|---|
| Shape | 247 E-Kontakt_3; 2973 E-Kontakt4; DEC 422 Gehaeuse; 14100 `9C22A7DC` | wall 110 | A T-shaped brass strap: a flat **strap** lying round the bowl wall just under the bezel, with a **vertical upright** (a flat bar standing at the strap's middle, running up toward the rim) carrying the pivot hole at its free end. On 247 and 2973 the upright's top stands level with or just proud of the rim's top thread edge (~0-3 mm above); on DEC 422 (foot up) it runs from the strap down to the bezel and the hole sits 8.7 mm inside the knurled band's upper edge. 247 and 2973 agree in shape; so does 422. | sure | The strap is symmetric about the upright: on 422 it spans -32.6 deg .. +32.6 deg (arc 63 mm, chord 59 mm); on 247 the right arm runs 41 deg past the hole and the left foot at least 29 deg (it goes round out of sight). So strap total about 65-80 deg of arc, **65-75 mm long (+-8)**, likely. |
| Strap height | 422 | wall 110 | 14.0 +-1.5 | likely | 247: arm 11.0 +-1.5 (this view is slightly oblique); 2973 similar. Use 11-14. |
| Strap thickness | 247 E-Kontakt_3 (top edge), 422 | wall 110 | about 2 +-0.7 (edge on, 15-20 px) | doubtful | not resolvable; the strap reads as a thin flat plate. |
| Upright | 247, 2973, 422 | wall 110 | width 11.6 (247), 12.3 (2973), 12.4 (422): **12 +-1**; length from strap edge to hole centre about 20-22; whole length strap to tip 25 (422) | likely | rectangular block, its end square-cut; thickness similar to strap or a little thicker (looks ~3-4 mm on 2973 from the shadow, doubtful). |
| Pivot hole | 247 (192,128) Ø40 px; 2973 Ø38; 422 Ø44 px | wall 110 | **Ø 4.4 (247), 4.2 (2973), 5.4 (422): 4.5 +-0.6**, round, plain, at the upright's tip | likely | on 14100 `9C22A7DC` the block with its hole is seen end-on: the hole axis points radially (toward the ring), so the pivot enters it radially. |
| Pivot height | 247, 2973, 422 | wall 110 | on 247 the hole centre is **~3 +-2 mm below the rim's top thread edge**; on 422 it is 8.7 mm below the top of the knurled bezel band (the band is 22 mm tall); so the pivot axis lies **in the upper part of the bezel ring, about 3-9 mm under the bowl's top face** | doubtful (the "rim top" is a judgement between a thread, a bezel and the glass) | reading depends on what is counted as rim. 247/2973 and 422 differ by about 5 mm, which is within that judgement. |
| Screws in the strap | 247, 2973, 422, 14100 | wall 110 | two screws per strap, one each side of the upright, ~25-30 mm apart (centre to centre ~ 28-32), **heads Ø 9.6-10.1 (422), 9.9 (247), 9.8 (2973)**, slotted heads (single screwdriver slot), domed or flat-cheese heads | sure | |
| Strap screws: holes or slots? | all four | | **Elongated slots, horizontal (along the circumference)**: a slot about 5.0 +-1 mm high (247 slot_h 45 px) and about 14-15 mm long, visible as a dark gap beside each head. On 422 both strap slots visible as ellipse-ended gaps, horizontal. The strap can therefore slide round the bowl (that is how the pivot is set to the centre of gravity / level). | sure | |
| Two screws at the foot of 247's strap (left) | 247 E-Kontakt_3 | | the left foot piece has its own screw (head Ø 85 px ~ 9.4 mm) in a short horizontal slot | likely | on 14100 `9C22A7DC` the bowl wall below the bracket carries two slotted screws about 30 mm each side of the block (x 495 and 765 of 1250): same arrangement as 422's two screws, i.e. the strap's two. |
| Material / finish | 14100, 247, 422 | | brass strap; on 14100 the upright blocks look dark/steel-grey (blackened or steel, or old brown patina), on 247, 2973 and 422 they are bare brass, same colour as the bowl | likely | |
| Number of brackets | all | | two, 180 deg apart (14100 `9C22A7DC`: one at the bottom of the bowl, one at the right, both with the block-and-hole; 2022 video 3:18: one visible at each side of the bowl) | likely | not seen both on the same photograph with the angle read. |

### 2. Locking bracket (the plate with the hook)

| item | photo | scale | reading +- | how sure | notes |
|---|---|---|---|---|---|
| Angle round the bowl from the case bracket | 247: hole -39.1 deg, plate +17.6 deg; 2973: -45.7 / +14.7; 422 (foot up): upright +1.3 deg, plate -51.2 deg | angles from silhouette | **separation 56.7 (247), 60.4 (2973), 52.5 (422): 55 +-5 deg**, measured to the plate's middle | likely | on 247 and 2973 the locking bracket is to the **right** of the case bracket, viewed with the bezel up; on 422 (viewed foot-up, i.e. mirrored) to the left: the same side seen the other way, so consistent. The contact sockets lie below both brackets (on 247 from about -37 deg to +37 deg, in two groups of three), so they do not mark which side the locking bracket is on. |
| Outline | 247, 2973, 422 | wall 110 | a flat plate 13.8 +-1.5 wide x 22 +-2 tall on 247 (422: 11.7 x 16.7, its hook foot below), running parallel to the axis; at the rim end it is **bent out and over into a hook** | likely | plate width 12-14, height 17-22. |
| Hook | 247 E-Kontakt_3; 2973 E-Kontakt4; 422 | | at the top (rim end) the plate stands **~8 mm (247) / ~4 mm (2973) above the rim's top edge** and carries a square-section hook: a block with a **slot cut horizontally through its top, open on the side toward the case bracket** (on 247 it opens to the left, toward the bracket; on 2973 the same; on 422 an L-lug with a notch opening toward the bracket) and closed on the far side, giving a "C"/"Г" shape seen from outside; the slot is about 3.5 mm wide and about 9 mm deep (247: 32 x 82 px) | likely (shape sure, slot sizes +-1.5 mm) | 247 and 2973 differ in how far the hook rises (7.7 vs 3.9 mm), the angle of view could explain it; same shape. On 422 the bracket's foot/lug (7.4 x 8.3 mm) is a shorter L, a variation. |
| Screws and slot | all three | wall 110 | **two screws one above the other, heads Ø 6.8-6.9 (all three), slotted heads, in one vertical slot** (slot visible above the top screw on 247, about 20+ mm long), centres ~ 8.5 mm apart (247: 65 px / 1000 *110 = 7.2; 422: 68 px = 8.4) | sure | the plate slides up and down: height adjustable. |
| Finish | | | brass, same as the bowl | likely | |

### 3. Gimbal ring, its pads and the pivot screws

| item | photo | scale | reading +- | how sure | notes |
|---|---|---|---|---|---|
| Diameters | 14100 `9C22A7DC` (face-on, ring beside bowl), `37E5A7C1`, `56956DF5`; DIxob frame 1:55; moMvyx8eXfo 2:00 | bezel 121 / wall 110 | **ring outer about 130 +- 9**; inside about 124 +- 9; radial gap to the bowl wall (110) about 6-9 mm, filled by the bracket uprights and the pivot screws' points | doubtful (ratio 1.07 of the bezel; two views gave 127-135) | |
| Band | 14100 `56956DF5`; `EFF56BA1`; moMvyx8eXfo 7:40 | | a **plain flat band, rectangular section**, height about 9-11 (+-2) mm, thickness about 2.5 (+-1) mm; no flange or bead | likely | the band is lower than the bowl wall; in the 2022 video the band is clearly short and thin. |
| Finish | 14100 / 247 / 2022 video | | brass or gilt-lacquer. 14100: gold lacquer worn to brass; 2022 video: brushed/satin gold anodised look; 247-era sets: lacquered brass, bright | likely | |
| Slot for a transit lever? | 14100 `56956DF5` | scale as above | **a long thin horizontal slot in the band beside the front pad, ~30 +-4 mm long x ~2 mm wide** (x 840-1080, y 1200-1230 in the 1267 px photo), no rounded-knob lever seen to engage it; on `9C22A7DC` the band beside the right pad has **two small round holes** (Ø ~3 mm) and a larger hole | doubtful (what they are for, can't tell) | the slot could be a tolerance for the pad's screws, or a locating slot. No photo shows a lever going through it. |
| Pads (pivot brackets) on the ring | 14100 `37E5A7C1`, `56956DF5`, `9C22A7DC`; 2022 video 3:24 (the bowl's bracket) | | at each pivot there is a **rectangular pad** (about 40 +-5 long x 12 +-2 tall x 3-4 thick) lying on the **outside** of the ring, with **three screws in a row**: the two outer ones (heads Ø ~9) sit in short horizontal slots in the ring; the **middle screw is larger-headed (Ø ~11-12), slotted, and is the pivot screw** whose threaded shank passes through the band and **projects inward** a few mm with a pointed or domed tip; a nut or collar sits on the shank inside the ring (visible on `9C22A7DC`: a short stud with a flange) | likely (shape), doubtful (the nut: a plain hex or round collar, lock nut can't be separated) | on 14100 only one pad has the three-screw layout; the opposite pad at the right looks like a plain pad with two screws and a gap (`9C22A7DC`: pad with two screws at the right). So the two pads differ: **one adjustable (slotted holes), one fixed?**: can't tell. |
| Knurled lock nuts | | | **none seen** on the ring pivots of 14100 or 247; knurled thumb screws appear only on the box catches and the contact sockets (2973) | doubtful | not excluded: the stud collar on 14100 could be a plain round nut. |
| Which pivots in the ring/box | moMvyx8eXfo 2:00-2:48, 3:18-3:24 | | the ring's other axis goes into the box walls: **front outside** a slotted pivot screw in a collar, above the handle (at ~20 % of the base wall's height below the rim: about 20 +-8 mm below the base's top edge if the base is 106 mm tall); **inside the back wall** a flat disc on a short pin at the same height (a bearing washer on a pin) and another disc on a post at the lower left; on the **left wall** a narrow vertical brass strap; on the right the key in its holder (see 6) | likely (the screw outside and the disc inside are seen; that the ring's pivots land on them is an inference) | in 247's own photos the left wall shows a brass pivot block (Kasten_1 at (118-175, 470-575)); outer pivot heads outside the box walls: seen on 2022 box (front), can't tell on 247 (Kasten_2 shows the wall without one: the front there is the lid and catch face). |

### 4. Transit lock

| item | photo | reading | how sure | notes |
|---|---|---|---|---|
| On the bowl or ring | 14100, 247, 2973 | **nothing visible on the bowl or ring** for a lock: no lever, no knob, no ring slot with a lever in it | likely | the ring slot in 14100 (item 3) is the only candidate. |
| In the box | moMvyx8eXfo 1:54, 2:36, 2:42, 3:18; 23239 (right of the bowl); 247 Kasten_1 (left wall) | the 2022 box carries inside: (a) a **long flat brass strip with a long slot, hinged by a two-leaf brass hinge at the top of the back wall**, free end swinging up and out (about 60 x 8 mm, estimated against the box's 190 width +-25 %); (b) a **post with a flat disc head**, standing on a small L bracket on the floor at the front-left corner; (c) a disc on a pin on the back wall; (d) the key in its holder at the right. A foam cushion sits over the bowl. | doubtful (function of (a) and (b) is my inference; nothing shows a lock engaging) | 23239 shows a disc on a stalk at the right edge of the base with a similar bracket. |
| Outer box latch (not a gimbal lock) | 247 Kasten_1; 08479 Kasten_komplett; moMvyx8eXfo 1:00-1:06 | the outer (carry) box's lid has a **scalloped tongue at its front** and a **hooked flat lever on a round turned boss** on that tongue (lever about 25 mm long, doubtful), engaging a **round plate with a central screw (247, 08479) or a knurled brass boss (2022)** on the base's front under the scallop | sure | |

### 5. Closing plate / winding hole on the bowl's bottom

| item | photo | scale | reading +- | how sure | notes |
|---|---|---|---|---|---|
| Bowl bottom shape | DEC 422 Gehaeuse; 14100 `37E5A7C1`, `56956DF5`; Uy8A88 5:19-5:27; DIxob 7:09-7:22 | wall 110 | a **stepped foot**: the wall (Ø 110) narrows through a **conical shoulder** (half-angle about 51 deg from the axis, height ~13 mm) to a **cylindrical boss about 8 mm high, Ø 78 on 422** (0.71 of the wall: 14100 gives 0.70-0.72, so **boss Ø 77 +-5**), with a **second ring step (about 11 mm) lower down between wall and bezel** | sure | the foot is a boss with a slightly raised rim and a flat or very slightly dished face with fine concentric turning lines. |
| What turns or slides | Uy8A88 5:19.4-5:27.5; DIxob 7:11-7:22 | | **no turning plate with a knob.** On Poljot (Uy8A88) a small pin is slid along a short radial slot near the middle of the foot: the hole opens near the rim (5:21-5:25); the key is then put into that hole (5:26). DIxob 7:11-7:16 shows a hole and a slotted screw. | sure for the pin-in-slot (Poljot); can't tell for the 1950s Kirovs whether their hole is closed at all: 14100's hole is simply open (no cover seen) | the central slotted screw on 14100 (head Ø ~8 mm) is the shutter's hinge or the cover's screw, can't tell. |
| Key hole | 14100 `37E5A7C1`; 2022 video 7:25-7:40 | scale as above | hole Ø **~7 +-1.5** mm, centre **~22 +-3 mm from the axis** (0.31 of the foot's Ø; 0.61 of its radius), plain round (the 2022 video shows a hole with a small collar/bush edge) | likely | the hole's angle: at 3 o'clock in 14100's photo; absolute orientation relative to the dial's 12 can't be taken (the bowl is lying at an unknown turn). |
| Centre screw | 14100, 2022 7:25, 7:40 | | one slotted screw at the foot's centre (Ø ~8 mm head) | sure | |
| Plate flat or bossed? | 2022 7:25, 7:40, 422 | | the foot's face is flat; the boss is the step | sure | |

### 6. Key

| item | photo | reading +- | how sure |
|---|---|---|---|
| Form | moMvyx8eXfo 3:18, 3:24, 11:10; DIxob 7:00; Uy8A88 5:23.9-5:26; box photos 23239, 247 (right of the bowl) | a **flat round "bow" (disc paddle, Ø about 17-22 mm: 17 on 2022 at 3:18, 22 on 23239), a short fat cylindrical grip, then a thin round shank ending in a tube with a square socket** (5:23.9: the end of the key shows a ferrule with a square hole); about **80-85 +-20 mm long** overall (2022 3:18, scaled from the bowl 110 mm = 380 px: 290 px; the tube about 23 mm, shank about 40 mm, Ø 4) | likely for the form; **doubtful for the sizes (+-25 %)** |
| Colour | | brass, bright or gilt-lacquered; the 2022 key matches its gold box fittings | sure |
| Where kept | 2022 video 1:54, 2:36, 2:48; 23239 | **stood upright in the box's right-hand rear corner, bow up, held on a small bracket on the right wall** (1:54: a stem with a disc at the top, and a tube, at the right of the ring; 2:48: the same place empty-ish with the disc seen edge-on): the 23239 photo shows the same disc-on-stem at the right edge | likely |

### 7. Box

| item | photo | scale | reading +- | how sure | notes |
|---|---|---|---|---|---|
| Outside size | 22823 Kasten (front straight on) | front width 775 px = 190 (assumed) | front 775 x 800 px = **190 x ~196** (ratio 0.97): **about a cube, +-4 %**; the photo supports "cube", not the absolute 190 (no scale in it) | likely | |
| Tiers | 22823; 247 Kasten_2; 20027 komplett; 23239; 2022 video 1:36, 3:18 | | the closed front shows **three tiers separated by two joints**: top band 24 +-5 (12 % of the height, with the upper catch plate), middle band about 60 (the plaque), base about 105 (the lowest, with the lower catch and, on 247, the numbered disc). 23239 (open): the upper (lid) block tilts back about a hinge at the back; the lid's own face carries the plaque and one catch half; the base the other half. In the 2022 box the lid has a glass pane in a frame, plus a wooden outer shell over it | doubtful (which tier hinges to which: 22823 closed gives the joints, the open views show only one lid motion each) | in 20027 (open) one sees base + a middle tier with a plaque and an upper hinged lid; the 2022 box's inner box has a **glazed lid** (a clear pane in a wooden frame hinged at the back) under a solid lid. |
| Glass lid frame | 2022 video 1:54-2:00; 422 Kasten_1 | | 422: frame stiles about 12 % of the lid width (about 22 +-4), pane about 78 % of the width; 2022: pane inside a stepped frame of about 15-20 mm | doubtful | the 22823/247 boxes have no glass in the lid seen: the dial is seen through the middle tier only in 20027. |
| Hinges | 2022 1:06, 2:00, 23239 | | **two small brass butt hinges** at the back (2022: 4 screws each, about 20 x 12 mm); a long piano hinge on 23239 | likely | |
| Handles | 22823 (left wall), 247 Kasten_1, 479, 2022 | | a **brass bail (U-shaped wire/strap, Ø ~5) pivoting on two posts** on the side wall of the base, near the top; on 22823 on the left wall below joint 2; hangs down when not carried | sure | wall plate about 17 mm square. |
| Plaque | 22823 | front 190 | rectangular **47 x 27** (+-3) dark/brass plate, 2 screws, between the two catches; 247/Poljot: a diamond or black/gold plate, 247 diamond about 50 x 28; 24020: black with gold border (Russian text, GOST 8916-70); 2022 gold plate on the lid | sure | |
| Catches | 22823, 247, 24020 | | two **hasp plates, each ~53 x 28** (two-leaf, a knurled brass knob Ø ~12 on a screw): one at each joint, central | sure | 4 screws each. |
| Corner straps | 22823, 2022 | | brass **L straps (each leg about 25 x 12-14 mm)** on all eight corners and on the edges of the lid | sure | |
| Wood / finish | | | 247: orange-red lacquered (beech-looking); 24020/22823/2973: deep red mahogany lacquer; 422 light birch/beech, natural; 479 dark mahogany; 2022 glossy red-brown | sure | |
| Lining | 2022 1:06, 20027, 247 Kasten_1 | | outer box: red velvet; inner box: bare wood plus white foam (2022) or red felt (20027) | likely | |
| Outer pivots in the walls | 2022 box (2:48) | | at the front wall outside a slotted screw above the handle; height about 20 mm below the base's rim | doubtful | as item 3. |
| Outer (transport) box | 247 Kasten_1; 08479 Kasten_komplett; 2022 video 0:54-1:12 | | a **tall box with a scalloped front (a semicircular tongue/notch)**, lid with a matching tongue, a **hooked lever** (flat, about 25 mm long, round boss Ø ~15) and a round base plate; a **red velvet bag with a leather strap** round it; inside, the chronometer box sits in a felt-lined scallop | sure | |

### 8. Anything else

| item | photo | reading | how sure |
|---|---|---|---|
| Contact sockets | 247 E-Kontakt_3, 2973 E-Kontakt4 | six items on the bowl's wall in two groups of three, **below the case bracket and the locking bracket**: on 247 two slotted screws + a black-rubber-ringed socket per group; on 2973 two screws + a knurled steel cap per group. Inside (247 E-Kontakt_2): two three-tine comb contacts (flat springs) on brass tongues over black insulating pads. | sure |
| Cushions / foam | 2022 video 1:54, 2:36 | a white foam cushion fills the base round the ring; a second foam sheet in the lid | sure |
| Box terminals | 479 right wall; 2022 front wall | two small round-headed screws near the handle (479: two below the bail; 2022: two at the left of the front wall): could be the contact terminals of the electric version, can't tell | can't tell |
| Locking keyhole | 479 | a brass-edged keyhole escutcheon on the front of the base of 479 | sure |
| Numbered discs | 247 Kasten_1/2, 479 | a round brass/steel disc with the number on the box front or outer box | sure |

## Surprises

1. **The case bracket is not the arm-and-upright I expected from a simple lug; it is a T**: a symmetric curved strap (65-75 mm) with two slotted screws and a central upright at the free end of which the pivot hole sits. The upright's tip is near the rim's top edge.
2. The **locking bracket is a separate plate** 55 deg round from the bracket, with a vertical-slot adjustment, and a hook open toward the bracket.
3. The 14100 **gimbal ring has a long slot** in its band and two different pads (one with slots).
4. **No lever transit lock on the ring or bowl**; the "lock" is the hinged slotted strip and disc-head posts inside the 2022 box, and the bowl's own locking-bracket hook (the hook presumably catches the ring), which is why it hooks toward the case bracket. I could not see the hook engaging anything.
5. **Chronometers differ**: the 247 and 2973 bowls match; the DEC 422's locking bracket is an L with a short lug; the 2022 box is a different design (glazed lid, handle, no number disc) from 247/22823 (three-tier front, two catches).
6. A **pin-in-slot shutter** (Poljot) vs an open hole (14100).

## Not found

A knurled lock nut on a pivot screw; an obvious transit-lock lever on the ring or the bowl; photographs of the opposite case bracket together with the angle; a ruler or scale in any photograph; what the ring slot on 14100 is for; the box's inside dimensions.
