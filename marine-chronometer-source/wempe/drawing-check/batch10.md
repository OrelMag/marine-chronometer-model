# Batch 10: the case, gimbals, boxes and keys against their sheets (26 October 2026)

I worked read-only in the `claude/wempe-artifacts` worktree at HEAD 85bd815a. Nothing in the repository was edited or committed.

**How I measured.**
- **The solids.** `b10/dump10.py` clicks the Case view and, for each version (last, first, 1943, 3955, 6mx), dumps every mesh under `__BX.root` in the box's frame, with the gimbals, lid and lock at rest. Output: `b10/dump10.pkl`.
- **The analysis.** `b10/lib10.py` gives turned profiles (r, y) at an azimuth, bounding boxes, and the triangles whose vertex normals stand more than 25° off their face.
- **Sheet readings.** Pixel row and column scans and gridded crops, made by `b10/grid.py` and `b10/crop.py`, are in `b10/crops/`.
- **Renders.** `b10/render10.py` (isolate.py's FREEZE and KEEP, the Case, Box or Transport view, the gimbals zeroed, GPU) wrote `r_*.png`. The contact sheets are `s_*.png`.

All paths are under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\`.

**Frame.** Line numbers are `marine-chronometer-source/wempe/js/case.js`. YB = 6.35 is the seat; YC = YB + 4.7 is the bowl's rim top; YP = 1.05 is the pivots' axis.

---

## bowl: R-05 01 00-1 (`05-01_2`), its machining as on 05 01 (`05-01_1`)

| feature | sheet | model (measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 65 | 65.0 (foot YC−65 to the rim's top) | 0 | match | sure |
| flange | Ø 118 × 12 from the top | r 59 from YC−12 to YB. Above YB the rim is turned down to the thread (TH, r 54.87-55.28) and rebated Ø 106.06 to the seat | machined | recorded departure (24 Oct: bezel screwed on, seat in a rebate) | sure |
| band | Ø 108 to 23,5 | r 54.0 to YC−23.5 | 0 | match | sure |
| body | Ø 106 | r 53.0 | 0 | match | sure |
| cone | 40°, 14,5 high, to the foot Ø 72,5 | (36.25, −65) to (53, −50.5) from YC: 14.5 × 16.75, so 40.9° | 0.9° | within (the sheet's figures are over-determined; the model follows the lengths) | sure |
| bore | Ø 98 | r 49.0 | 0 | match | sure |
| inner depth | 53 | 53.7 from YC (floor YB−49: faced 0.7 for 05 06_01's "49") | +0.7 | recorded departure | sure |
| inner corner | round, not figured | r 7 (13 points) | — | scaled 6-8: match | likely |
| recess under the bottom | Ø 64 × 5,5 | Ø 68.2 × 5.5 (opened for the plate Ø 68) | +4.2 Ø | recorded estimate | sure |
| bottom at the middle | 6,5 (65 − 53 − 5,5) | 5.8 | −0.7 | follows the 49 | sure |
| holes in the bottom | none drawn (a casting) | winding hole Ø 8.2 at H[10]; Ø 3.04 for the closing plate's screw; Ø 1.2 × 1.5 for the spring's end | — | recorded (machined, estimated) | — |
| notch for the ring's pin | not drawn | 1.8 wide at 12 o'clock, down to YB+0.8 | — | recorded (24020's photograph) | — |
| holes for the brackets' screws (WN-78 ×4, the locking bracket's ×1) | screws through the brackets into the bowl's wall (05 01, elevation and A-B) | **not cut**: the shanks stand in solid brass (case.js:262 "not cut: radial") | missing | **MISSING** (M1), recorded | sure |
| bracket slots ("Kloben verstellen bis Gleichgewicht erreicht ist") | the brackets slide to level the bowl | round holes, no slots (case.js:369-370 "the slots not drawn") | — | recorded | — |
| weight | 350 g | about 1.3 kg in brass | — | recorded (README) | sure |
| shading | — | 0 triangles off in the drawn bowl | — | match | sure |
| floor seam | — | a **dotted ring at r 34.1 on the inside floor** (`r_bowl_3.png`): the bottom disc (240-gon, r 34.09) and the turned part (360-gon, r 34.1) are fused into one mesh but their edges don't coincide, so Edges draws dashes along the T-junctions | — | **ARTIFACT** (A1) | sure |
| 3955 | the sheet's shape in Bakelite | the same profile | — | recorded (shape not measured) | — |
| 6MX | photographs | its own profile. Its winding-hole seat (case.js:291) is a raw `THREE.LatheGeometry` of a square section fused into the bowl: 576 triangles off, its square corners shaded round (`r_b6_3.png`) | — | **ARTIFACT** (A3) | sure |

## case brackets 05 01 00-3, locking bracket 05 01 00-4 (05 01 only; no sheet of their own)

I spot-checked these on 05 01 and they agree with the 25 October readings (case.js:353-421):
- The 6 o'clock bracket face on (elevation): its foot from 8.5 to 20 under the axis, the screw 15.5 off the axis and 14.5 under it, the boss edge 4.6 off the axis (so 9.2 wide).
- A-B: the locking bracket at 50°.

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| foot, boss, screws (0 3 00-3) | as above | foot r 53-57.7 at −20.3 to −8.3, boss r 60.3-64.3 to +4.8, 9.0 wide, screws ±15.0 at −14.3, heads Ø 7 | match | likely |
| locking bracket at 50° | 50° | atan2 40° (50° from 6 toward 3) | match | sure |
| screws' threads in the bowl | — | not cut | M1 | sure |
| shading | — | 0 triangles off | match | sure |

## closingPlate: 05 01 00-2 (`05-01_3`, rev. a)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| plate | Ø 68 −0,2 | r 33.95 | mid | match | sure |
| rim | 2,3 | 2.3 (yr to y1) | 0 | match | sure |
| boss | Ø 28 −0,2 on the outer face, 5 overall | r 13.95, 5.0, on the lower (outer) face | 0 | match | sure |
| groove | Ø 10 to Ø 26, 1,5 deep, in the inner face (column scan: floor at y 241.2 = 1.5 under the top face at y 236) | r 5-13, 1.5 deep, top face | 0 | match | sure |
| centre hole | Ø 5,5 +0,1 | Ø 5.55 | mid | match | sure |
| counterbore | Ø 7,5 +0,1, floor 2 −0,05/−0,1 under the inner face | Ø 7.55, 3 from the boss face, so 2 under the top | 0 | match | sure |
| round at the boss's root | drawn, r ≈ 1.2 both sides (`cp_L.png`: 4 px) | r 1.3 | 0.1 | match | likely |
| M2,6 | at 25 | r 1.32 at 25 through the rim | 0 | match | sure |
| Ø 1,2 | at 12,4, blind into the boss | 12.35, tip 0.15 short | −0.05 | within ±0.1 | likely |
| Ø 8 +0,2 | at 22,6, 90° to the line of the other two | Ø 8.1 at 22.6, tk = t8 − 90° | 0 | match (the handedness can't be told from one plan) | likely |
| "3 +0,2" | at the boss's left edge, meaning unread | nothing | — | unresolved (as the transcription says) | unsure |
| shading | — | 0 triangles off (the screws' threads aside) | match | | sure |

## bezel: 05 01 01 (`05-01_4`), R-05 01 01-2 (`05-01_5`)

Reading of 05 01 01's right-hand section:
- Axis at x 468.5, by the widest band's two edges 177 and 760.
- Scale 4.78 px/mm (the code's).
- Bottom line y 268.
- Columns: x 740-745 give the lip at y 204.5-205.5. x 600-720 give the glass at 192.5-193 (top) and 209.5-210 (underside).

`crops/bz_r10.png` (10×, gridded) shows the profile.

| feature | sheet | model (dump, case.js:500-506) | diff | verdict | sure |
|---|---|---|---|---|---|
| casting envelope | Ø 125 / 30° / Ø 116 / 16 high, bores Ø 92 and Ø 106 × 4,5 | everything machined lies inside it | — | consistent | sure |
| underside, outer | r 56.2 (x 737) | r 56.6 | +0.4 | within reading | likely |
| widest band | r 61.0 (axis 468.5; 60.6 with the code's 470.5), from h 7.5 to 9.9 | r 60.6, 7.5 to 9.8 | −0.4 | within the axis reading | likely |
| **knurl on the widest band** | **drawn**: the diagonal hatching across the whole left half at y 214-229 is that band seen from outside, the knurl's symbol | knurled 0.3 deep (taken from photographs) | — | match; the sheet confirms it (upgrade "likely" to "drawn") | likely |
| **ring's top** | **the lip at h 13.2-13.5** above the underside (y 204.5-205.5), at r 57.0-57.4. The bevel runs from the widest band (r 61, h 9.9) to the lip; the lip's inner face falls to r 56.2 at h 12.6. The left (outside) half agrees: lip at h 14.0, r 56.6 | ring to **h 16.0**: bevel from r 60.6 at 9.8 to **r 55.25 at 16.0**, and the ring's metal enclosing the glass's edge to the glass's top | **+2.5 to 2.8** | **WRONG** (W1) | sure (the lines); likely (±0.2 each) |
| glass | 05 01 01-1, the "///" band: underside h 12.2-12.3, top h 15.7-15.8 (3.5 thick). At its underside r 55.8 (x 737); its top edge chamfered to r 54.3 at the top (x 730: about 27° from the axis). It stands **2.3-2.6 proud of the ring's lip** | Ø 110.5 × 3.7, h 12.3-16.0, flush with the ring, square edge, inside the ring to its top | top +0.2, edge | **WRONG** (W1, with the ring) | likely |
| sight cone | from the step (r 46) to the glass's seat (r 55.8 at h 12.3) | r 45.9/46.0 at 5.0 to r 55.25 at 12.3 | −0.5 at the top | within | likely |
| step (lower bore's top) | h 5.0-5.3 (columns 600 and 712) | 5.0 | 0 to −0.3 | within | likely |
| lower bore | r 54.6 (x 729.5, axis 468.5); the thread's symbol drawn | crests r 54.9, roots 55.306, ISO 0.75 | +0.3 | within (recorded thread, 24 Oct) | likely |
| code comment | case.js:483 "Its height comes out 16.0 (y 269 to 192.5), the casting's" | y 192.5 is the **glass's** top, not the ring's | — | misreading behind W1 | sure |
| shading | — | ring and knurl 0 off; dashes along the knurl band's top and bottom rims at grazing view (`r_bezel_2.png`) | — | **ARTIFACT** (A6), minor | sure |
| 6MX bezel's glass | photographs | raw `THREE.LatheGeometry` with a chamfer (case.js:522): 960 of 2,400 triangles, 1,453 mm², off; the chamfer shades as a round | — | **ARTIFACT** (A3) | sure |

## gimbalRing: Kardanring 05 01 00-5, bracket 05 01 00-6, WN-79, WN-400, WN-80 (05 01 only)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| ring | 4.0 × 24, its scaled inside Ø 138 (A-B at 2.46 px/mm) | r 70-74 × 24, centred on the pivots | Ø 140 recorded (clearance for the 1942 bowl turned over; the sheet's 1940 bowl); within drawing accuracy | likely |
| bracket at 3 o'clock | a curved plate on the ring, 58 long (crop k_abR: 142 px), rounded ends, two screws | 57 long, bevelled 2 × 2, flat radial ends, 3.3 thick | length match; the drawn ends are rounded, the model's square (minor) | likely |
| bracket's screws | drawn **through the ring** (their shank ends at its inner face), cheese heads drawn about Ø 6.5 × 4 (scaled, blurry) | M2.5 tapped 2.75 into the ring (to r 71.25), heads Ø 4.8 × 1.6 (case.js:551, 555) | **WRONG**, minor (W5): length; heads unsure | likely (length), unsure (heads) |
| inner pivots WN-79 | head Ø 9.2 × 2.8, M5, tip Ø 3.0 × 4.6 | bbox Ø 9.15; tip r 1.5 | match | likely |
| lock nuts WN-400 | Ø 22 × 2.4 | Ø 22 × 2.4, knurled | match | likely |
| outer pivots WN-80 | head Ø 12 × 3.8, M6, tip Ø 3.1; 93.5 over the box's bottom, 11.5 under the parting line (51 00 10) | head Ø 12 × 3.8, at YP = YF + 93.5 | match | sure |
| bearing discs | Ø 22.7 × 1.9 | Ø 22.7 × 1.9, knurled | match | likely |
| WN-80 head's slot | slotted (05 01 elevation) | barely visible at the box's side: only its two ends show (`r_box_3.png`) | **ARTIFACT** (A7), minor: check KIT's slot on a Ø 12 head | likely |
| shading | — | the pivots' tips (WN-79, WN-80) are raw `LatheGeometry`, 84 of 224 off each: their 0.2 chamfered ends shade round (`r_tip_0.png`) | **ARTIFACT** (A3), minor | sure |

## box: Holzkasten (05 01's note, 51 00 10 `51-00_2`, 127-556 A-1 `51-00_1`)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| outside | 185 × 185 × 180 | 185 × 185, 105 + 75 = 180 | match | sure |
| walls | 12,5 | 12.5 | match | sure |
| parting line | 105 over the bottom (51 00 10) | YL = YF + 105 | match | sure |
| pivot M6 | 11,5 under the line; "Verbohren 4,8, Gew. M 6" | 93.5 over the bottom; thread Ø 6.04 | match | sure |
| handle's middle | 75 | 75 (bbox centre y −17.45) | match | sure |
| handle | 100 × 18, lugs 10 | 100 × 18, lugs 9 flat + 5 slant | match | sure |
| handle's bends | smooth S-bends about 7 long (bottom view, `hd_bot.png`) | straight 54° kinks (case.js:620) | minor shape departure (W6) | likely |
| handle's stand-off | bottom view: the middle's outer face 13.0 off the panel (31 px at 2.38), the lugs 6.3 with their heads; section: outer face 12.2 off, top outer corner rounded r ≈ 4 | middle 7-10 off (outer 10), 3 thick | **WRONG** (W6): the drawn outer face is 2-3 further out | likely (the dimensions "6" and "3" in the section unread) |
| finger recess | 70 × 30; dimension "10" (its depth: arrows at x 735 and 761, the panel's outer face) | depth 10.5 (R = 10.5) | +0.5, **WRONG** minor (W7) | likely |
| finger recess's surface | a cove | built from 10 stepped ring cells: **terraced facets and crease lines** across it (`r_box_3.png`) | **ARTIFACT** (A2) | sure |
| lid, its glass, the piano hinge, the stay, the pins over the pivots, the key's holder | not on any sheet (A-1 draws the holder; 05 01 the pins) | estimated (recorded) | consistent | — |
| 05 33, 05 36 (A-1's items 5 and 6, on the bowl's side) | drawn | not built (the owner's decision, 18 Oct) | recorded | sure |

## lid, maker's plate 00 01 01-9 (`51-00_3`), tongue P. 51 00 02-2 (`51-00_4`)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| plate | 26 × 52, Alu, white, lettering sunk black | 52 × 26 × 1, white, texture lettering | match | sure |
| lettering | CHRONOMETERWERKE 4.0 × 44; WEMPE, monogram, HAMBURG; Type, 3371 | as drawn (`r_front_1.png`) | match | likely |
| holes | Ø 1,2 at 2 from the edges | not cut; pin heads Ø 1.8 at (±24, ±11) | minor (pins estimated) | — |
| tongue | 45 long, 4 −0,1 thick, 10 → 8 wide, Ø 6,2 6 from the round end, M3,5 at 14, 39 to the far end | 45 × 4; hole at 6 from the end (round end r 5 about a point 1 past the hole); M3.5 at 14; far end r 4 at 39 | match | sure |
| tongue's taper | 2°40′ (the edge against a horizontal, over the whole length) | 3.18° (2 over 36: from 1 behind the hole to 35) | 0.5°, about 0.1 in width | within the "Toleranz 0,1" | likely |
| hole's chamfer | 0,5 × 45° | none | **MISSING** (M3), minor | sure |
| thinned end | 0,2 deep over the last 7 | none (case.js:694 "not drawn") | **MISSING** (M3), recorded | sure |
| finish | bonderised, black lacquered | black | match | sure |
| knob WN-zk, pin heads | estimated | raw `LatheGeometry`, 192 of 288 off: the knob's edges shade round (`r_front_3.png`) | **ARTIFACT** (A3), minor | sure |

## overBox, overLid: Überkasten 127-556.01 / 52 00 16 (`51-00_5`)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| body | 157 high, lid 88 | 157, 88 | match | sure |
| plan | 270 (plan scan 325 px against the depth's 298 px: 270 × 248) | 270 × 250 | match | sure |
| base plate | 370 over its ends, 270, 12,5, 10 past the walls | 370 × 270 × 12.5 | match | sure |
| walls, inside at the rim | 12,5; 225 | 12.5; 225 | match | sure |
| rim strip | 13 × 5, 4 proud | 13 × 5, 4 proud | match | sure |
| cushions | 20 | 20 | match | sure |
| strap screws | 80 apart, the lower 60 over the floor | 60 and 140 | match | sure |
| hinges | 32 long, ending 100 from the centre | 32, from 68 to 100 | match | sure |
| eyes | 25 from the walls | 25 | match | sure |
| the eye's plate | a large arc about each eye, r ≈ 40, from the wall nearly to the plate's edge (plan, `ob_plan.png`): a D-shaped strap fitting or a swing line, unlabelled | a disc Ø 23 | unresolved (U1) | unsure |
| shading | — | 0 off (the screws' threads aside) | match | sure |

## key: 51 00 11 (1943: `05-01_7`, 05 01 02-2 `05-01_8`, 05 01 02-3 `05-01_9`); 127-556.02 U 01 (1940: `05-01_6`)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| body | Ø 14,5 −0,2, 1,5 × 45°, 15° cone from 15,1, 25,1 −0,2 | RO 7.25, BT−1.5, cone 2.68/10 (15.0°), 25.1 | 0 | match | sure |
| body's bore and holes | bore Ø 8 +0,1, 22 +0,2, 120°; Ø 6 +0,1; slot 3 H11; cross hole Ø 2,5 +0,05 at 4 −0,05; Ø 35 floor at 6,3 +0,1; Ø 0,9 at 5°, 3,8 | 8.1, 22.0, 120°; 6.1; 3.03; 2.525 at 4; 6.3; 0.9 at 5°, 3.8 | 0 | match | sure |
| paddle | edge-on 3.2 thick (bar x 408-430, 22 px at 6.94); Ø 34.5 | 3 × Ø 34.5 | 0.2 | match (the transcription's "2.3" is wrong) | sure |
| tube | head Ø 8 −0,05 × 2,6 −0,2; Ø 5,95 −0,05; 50,1 −0,2; square 3,1 +0,05 × 19 +2; drilled 23 +2 | 8 × 2.6; 5.95; 50.1; 3.15 × 19; 23 | 0 | match | sure |
| under the head | "0,3 r", a fillet | 0.3 × 45° chamfer | form | minor (W8) | sure |
| socket end | 60° countersink 1 +0,2 deep; relief 2,5 +0,3 long, end Ø ≈ 4.2, about 21° (`tube_end.png`, 9.72 px/mm) | no countersink; relief to Ø 4.6 at 15° over 2.5 | — | **MISSING** (M2, recorded), relief form minor | sure / likely |
| slot floor shading | — | the Ø 35 floor shades in stair-step bands (`r_keyT_0.png`): the 0.3 columns' flat faces | — | **ARTIFACT** (A4) | sure |
| tube's head shading | — | raw `LatheGeometry` (case.js:921): 400 of 720 off, its square corners shaded round | — | **ARTIFACT** (A3) | sure |
| spring 510011-4 | coil, as the section | TubeGeometry, its normals all off by this test (tube normals) | — | not an artifact (round wire) | — |
| 1940 key, overall | 84 | 84.0 | 0 | match | sure |
| **1940 key's stem** | **32** out of the body (sure). The sheet draws 31.74 (215 px at 6.774) | **31.7** (body from y 31.7, case.js:995) | **−0.3** | **WRONG** (W4), minor | sure |
| 1940 key's pear, collar, cone | traced | as traced | — | match | likely |
| 1940 key's shading | — | its lathes (body, stem, screw) are raw LatheGeometry: 336/768, 288/672, 80/160 off; the pear's rim faceted in 1.5 segments (`r_keyF_2.png`) | — | **ARTIFACT** (A3, A5), minor | sure |

## caseLock: Feststeller (15 on 05 01; no sheet)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| knob | Ø 19.6 | Ø 19.6 | match | likely |
| the "17" | the knob's axis from the front wall's inside | z 62.9, wall inside at 80: 17.1 | match | likely |
| the rest | estimated (recorded) | — | — | — |
| shading | — | its lathes (the pin's head, the knob's two plates) are raw LatheGeometry: 200/320 and 80/240 off; the knob's knurl is softKnurl (intended) | **ARTIFACT** (A3), minor | sure |

## Versions

- **last, first, 1943:** one case. Only the key differs: first and 3955 get the 1940 key, the others the 1943 one-way key.
- **3955:** the bowl and the ring are the sheet's shapes in Bakelite (black). The closing plate is grey with two holes through its boss (photograph). The bezel is the drawn one.
- **6MX:** its own bowl, bezel, brackets, box and outer box (photographs, outside these sheets). Its artifacts are A3 (the winding-hole seat, the bezel's glass, the contact sockets 6MX.cfk at 320/320 off).
- **W1 applies to every drawn version** (last, first, 1943, 3955), which share the bezel.

---

## Ranked findings

1. **W1, WRONG: the bezel's ring stands 2.5-2.8 too high and encloses its glass; the sheet's glass stands proud.**
   - Sheet: 05 01 01 (`05-01/Wempe_05-01_4.jpg`), the right-hand section at 4.78 px/mm:
     - the ring's lip at h 13.2-13.5 (y 204.5-205.5 against the underside at 268), r 57.0-57.4;
     - the bevel from the widest band (r 61, h 9.9) up to the lip, and the lip's inner face down to r 56.2 at h 12.6;
     - the glass (05 01 01-1, "///") from h 12.2-12.3 to 15.7-15.8, Ø ≈ 111.6 at its underside, its top edge chamfered to Ø ≈ 108.6, so 2.3-2.6 proud of the lip.
   - The outside half agrees: lip at h 14.0, r 56.6.
   - Model: case.js:500-506. `top=b0+16` and `bev()` run to `[RG,top]` (r 55.25 at h 16). The glass `circ(RG)` runs from b0+12.3 to top, flush. The comment at :483 reads the glass's top (y 192.5) as the ring's.
   - Correction (all heights over the bezel's underside b0):
     - In `pz`, replace `[60.2,bev(60.2)],[RG,top]` with the bevel `[60.6,b0+9.9]` → the lip `[57.2,b0+13.4]` → the lip's inner face `[56.2,b0+12.6]` → the seat `[55.8,b0+12.3]`.
     - Run the cone from r 55.8 at 12.3 to r 46.0 at 5.0.
     - The glass: a disc r 55.8 from b0+12.3 to b0+15.8, its top edge chamfered to r 54.3 (1.5 radial over its upper 2.9).
     - The glass's top drops 0.2, so it lies 1.05 over the hands' highest point (now 1.25). Recheck the hands' clearance and the bezel's weight in `massprops.py --model wempe`.
   - Render: `r_bezel_2.png` (the ring's bevel running up to the glass's top).
2. **A1, ARTIFACT: dotted ring on the bowl's inside floor at r 34.1** (`r_bowl_3.png`). The bottom disc (`circ(34.09)`, 240 points, case.js:283) and the lathT part (360 corners, case.js:295 `[34.1,YB-49]`) are fused (case.js:337) but don't share vertices. Correction: build the bottom disc on the lathe's own 360 corners (`circT(34.1)`, as the bezel's knurl does at :505), or extend the lathe to the axis and cut the three holes in it.
3. **A2, ARTIFACT: the box's finger recesses are terraced.** Ten stepped ring cells with creases (`r_box_3.png`; case.js:580-591, K = 10). Correction: more rings (K ≥ 40), or smooth the cove's normals as smoothRev does, so it reads as the R 10.5 (drawn 10) cove.
4. **W6, WRONG (likely): the handle stands further out than built.**
   - 51 00 10 (`51-00/Wempe_51-00_2.jpg`): the bottom view puts the middle's outer face 13.0 off the panel (31 px at 2.38). The section puts it 12.2 off, with its top outer corner rounded about r 4. The bends are smooth S-curves about 7 long.
   - Model: case.js:620, outer face 10, 54° kinks.
   - Correction: outer face 13 (inner 10, 3 thick), and the bends as arcs r ≈ 4-5 between the lugs and the middle.
5. **W7, WRONG (minor): the finger recess is 10.5 deep; the sheet dimensions "10"** (section, arrows at the hollow's floor x 735 and the panel's face x 761). Correction: R 10.5 → 10 (case.js:580 `R=10.5`), leaving 2.5 of wood.
6. **W4, WRONG (minor): the 1940 key's stem is 31.7 out of its body; the sheet says "32".** The sheet draws 31.74. Model: case.js:995 body from y 31.7. Correction: body and collar from 32.0 (keep the 84 overall: the handle and collar 0.3 shorter, or the stem's end moved), and KEYREST's 33.43 with it.
7. **M1, MISSING (recorded): the bowl's tapped holes for the brackets' five screws.** case.js:262, 379, 421. The shanks stand in solid metal. Correction: tapped holes along the radius (as sweepS does for the gimbals), or record them in holecheck's expected list.
8. **A3, ARTIFACT: raw `THREE.LatheGeometry` with square or chamfered corners shaded round** (computeVertexNormals across the corners):
   - the 1943 key's tube head (case.js:921);
   - the 1940 key's body, stem and screw (:995, :996, :1001);
   - the outer and inner pivots' tips (:557, :570);
   - the case lock's pin head and knob plates (:883, :887-888);
   - the tongue's knob (:702);
   - the box's pins (:615, minor);
   - the 6MX's winding-hole seat (:291), its bezel's glass (:522) and its contact sockets (:352).

   Correction: build them with the cells/solidGeo + smoothRev pattern used elsewhere in case.js, or `KIT` lathe helpers with hard corners.
9. **M2, MISSING (recorded): the key tube's 60° countersink, 1 +0,2 deep** (05 01 02-3). The relief's drawn end is Ø ≈ 4.2 at about 21°, against the model's Ø 4.6 at 15° (case.js:920). The "0,3 r" under the head is built as a chamfer (case.js:921). Correction: add the countersink, the end Ø 4.2, and the fillet r 0.3.
10. **M3, MISSING: the tongue's 0,5 × 45° chamfer on its Ø 6,2 hole and its thinned end** (0,2 over 7). P. 51 00 02-2; case.js:700. The taper is 3.18° against the drawn 2°40′ (within 0.1).
11. **W5, WRONG (minor): the gimbal ring bracket's screws.** A-B draws them through the ring; the model's (case.js:551, 555) are tapped 2.75 into it, and their heads are drawn larger (about Ø 6.5, unsure). The bracket's ends are drawn rounded; the model's are flat.
12. **A4, ARTIFACT: the 1943 key body's slot floor shades in bands** (`r_keyT_0.png`; case.js:952-963, the floor's 0.3-wide flat columns). Correction: smooth normals on the floor (normal of the Ø 35 cylinder).
13. **A5-A7, minor artifacts:**
    - A5: the 1940 key's pear rim is faceted in 1.5 mm segments (case.js:997-1000).
    - A6: dashed Edges lines along the bezel knurl's rims at grazing view.
    - A7: the WN-80 head's slot barely shows on its Ø 12 head (`r_box_3.png`).
14. **Unresolved:**
    - U1: the D-shaped arcs about the outer box's eyes (`51-00_5` plan).
    - The closing plate's "3 +0,2".
    - The Überkasten's pencil "240" against 88 + 157.

Renders: `r_bowl_*.png`, `r_bowlU_*`, `r_bezel_*`, `r_bz6_*`, `r_cp_*`, `r_ring_*`, `r_tip_0`, `r_lock_*`, `r_key*_*`, `r_box_*`, `r_front_*`, `r_over_*`, `r_b6_*`, `r_b39_*`, with the contact sheets `s_*.png`. All are in the b10 folder.

## Sheets reviewed
- 05-01/Wempe_05-01_1.jpg — 05 01 Gehäuse Kardan — the elevation (the bowl in its ring, the outer pivots, the bearing discs, the pins over the pivots, the case bracket face on, the locking bracket), Schnitt C-D (the inner pivots, lock nuts, the closing plate's knob WN-72 and spring 14), Schnitt A-B (the ring, its bracket and screws at 3 o'clock, the 50° locking bracket, the lock's 17), parts list
- 05-01/Wempe_05-01_2.jpg — R-05 01 00-1 Gehäusetopf — every figure against the bowl's turned profile; recorded machining
- 05-01/Wempe_05-01_3.jpg — 05 01 00-2 Verschlußplatte — every figure, the groove, counterbore, round, holes and their places
- 05-01/Wempe_05-01_4.jpg — 05 01 01 Glasrand kompl. — the section's lines by pixel scans: the lip, bevel, widest band (knurl), glass, step, bore (W1)
- 05-01/Wempe_05-01_5.jpg — R-05 01 01-2 Glasrand — the casting's envelope against the machined ring
- 05-01/Wempe_05-01_6.jpg — 127-556.02 U 01 / 51 00 11 Aufzugschlüssel — 84 and 32 against the 1940 key by pixel scans (W4); pear, collar, cone
- 05-01/Wempe_05-01_7.jpg — 51 00 11 Chronometerschlüssel — the paddle's thickness (3.2), the body, the tube's place, the parts
- 05-01/Wempe_05-01_8.jpg — 05 01 02-2 Schlüsselmittelteil — every figure against the body
- 05-01/Wempe_05-01_9.jpg — 05 01 02-3 Schlüsselrohr — every figure; the head, the 0,3 r, the socket end's countersink and relief (M2)
- 51-00/Wempe_51-00_1.jpg — 127-556. A-1 Boden-Chronometer — the arrangement: the box in the outer box, the handles along the long axis, items 5 and 6 (not built), the key's holder
- 51-00/Wempe_51-00_2.jpg — Änderung von 51 00 10 Griff f. Chronometerkasten — 185, 105, 75, 11,5, 12, 3,5, the handle's front view, section and bottom view (W6), the recess's 10 (W7), panel 12,5
- 51-00/Wempe_51-00_3.jpg — 00 01 01-9 / 05 01 02-2 Firmenschild — 26 × 52, holes, the lettering's layout and sizes against the plate's texture
- 51-00/Wempe_51-00_4.jpg — P. 51 00 02-2 Zunge — every figure, the taper, the hole's chamfer and the thinned end (M3)
- 51-00/Wempe_51-00_5.jpg — 127-556.01 / 52 00 16 Überkasten — every figure against the outer box and lid; the plan's proportions; the eyes' arcs (U1)
- Wempe_Einheitschronometer.jpg — Federchronometer 05 (coloured section) — looked for the case: it draws the movement in its ring only (no bowl, bezel, gimbals or box), so nothing of this batch to compare

## Sheets not reviewed
- 001-002/Wempe_001.jpg — its "innerer Gehäuse ⌀ 100" agrees with the bowl's bore (98) and 05 01's scale. The rest of the sheet is the movement's, batch 1's.
- 001-002/Wempe_002.jpg — the lever chronometer's (excluded).
- 05-33/Wempe_05-33.jpg, 05-36/Wempe_05-36.jpg, 05-36/Wempe_05-36_2.jpg — the hand setting and the balance-holding device, A-1's items 5 and 6. Not built (the owner's decision, 18 October 2026; excluded in the ledger).
