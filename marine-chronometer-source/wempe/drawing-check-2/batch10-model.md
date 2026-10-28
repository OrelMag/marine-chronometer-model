# Batch 10, the model against the sheets: the case with its gimbals (05 01 Gehäuse Kardan), the bowl (R-05 01 00-1), the closing plate (05 01 00-2), the bezel and its glass (05 01 01, R-05 01 01-2), the two winding keys (127-556.02 U 01 of 1940, 51 00 11 of 1943 with 05 01 02-2 and -3), the Boden-Chronometer's arrangement and outer box (127-556. A-1, 127-556.01 / 52 00 16), the handle (Änderung von 51 00 10), the maker's plate (00 01 01-9) and the tongue (P. 51 00 02-2)

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch10-read.md`, with its Step 3 corrections). Its F1-F17 are settled below, and so are the ledger's 5-M17 (the 1940 key's socket) and 7-M10 (the glass).

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit3`, detached at d178fd63 (main, 3.48.00). Nothing in it was edited.
- **Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b10m\` (written `b10m\` below).
- **Solids.**
  - `b10m\dump.py` loads the page (`?snap&qa#view=case`, GPU, frozen as holecheck.py freezes it, `__BX.showOver(1)` so the outer box is counted). For each version (`setRev` last, first, 3955, 6mx, 1943) it writes every mesh under `__BX.root` that is not the movement's and whose version groups are shown, in the box's frame (the movement's at rest), to `dump.json`: 161, 159, 159, 193 and 161 meshes. `inv.txt` lists them by part and line with their bounds.
  - `b10m\sl.py` (batch 8's) and `prof.py` slice a dumped mesh by a plane y = const and fit each loop with a circle. `inside.py` tests points against a solid by ray parity. `brkscrew.py` and `misc.py` probe the screws' axes through the brackets, the ring and the bowl. Every row below is a slice or a probe of the solid, not a render, unless it says "code".
  - Where a row gives only the code's number, the solid's bounds agree with it (`inv.txt`).
- **Sheets.** Re-cropped where a reading mattered (`b10m\c*.png`). Pixel profiles on the scans for the bowl's inner round, the closing plate's "3 +0,2", the bezel's glass, the wall-top fitting and the tongue's outline.
- **Tools.** At d178fd63, `--model wempe`, MC_GL=gpu, one browser at a time:
  - `audit.py box` in three versions (`b10m\audit_box.txt`). Last: 8 float screws, all expected, nothing new. First: the same, and one zfight `key:Extrude`/`key:Buffer` (the 1940 grip on its collar), expected under `box.first`. 6mx: nothing new, but 4 expected FLOAT_BOX entries "no longer found" there (M16).
  - `seatcheck.py` and `holecheck.py` walk `__mv` only, so neither sees the case, the box or the keys. The fit list's rows are this report's probes.
  - `isolate.py --view case`: the closing plate from below and from above beside 05 01 00-2's plan (`b10m\iso\r_iso_closingPlate.png`), the 1940 key beside 05 01_6 (`r_iso_key1940.png`), and the 1943 key beside 05 01_7 and _8 (`r_iso_key1943.png`).
  - `massprops.py` not run (no `--write` allowed, and nothing here has been changed yet). The physics notes give what would move.
- **Book.** `wempe/book/wempe-build-book.pdf` (WBOOK), titled v3.41.00 (27 October). Pages 373-511 extracted to `b10m\book\p*.txt`, and the bowl, closing plate, bezel, glass, ring, bracket, box, handles, plate, tongue and key pages rendered to `p*.png`.
- **Overlay.** `b10m\ov\bowl.png`: the bowl's slices (every 0.25 mm, circle fits) drawn on R-05 01 00-1's scan at its scale (3.46 px/mm by the 118 and the 65), on the axis and the cast top.

**Frame.** The movement's: dial side +y, 12 o'clock −z, 3 o'clock +x. YB 6.35 is the seat in the bowl's rim, YP 1.05 the gimbals' pivots, YC 11.05 the bowl's cast top, YL 12.55 the box's parting line and YF −92.45 its bottom. The pillar plate's dial face is y 3.35.

**Which version carries which sheet.**

| part | last | first | 1943 | 6mx | 3955 |
|---|---|---|---|---|---|
| bowl R-05 01 00-1, rim threaded and notched | brass | brass | brass | its own profile (Kirov 247, 2973, 422) | Bakelite, the sheet's profile |
| case brackets 05 01 00-3, locking bracket -4 | as 05 01 | as 05 01 | as 05 01 | the high form (Kirov 247) | as 05 01 |
| closing plate 05 01 00-2, WN-71, WN-72, spring -7 | yes | yes | yes | a flat disc, knob at r 19 | grey, two holes in its boss |
| bezel 05 01 01 / R-05 01 01-2, glass | yes | yes | yes | knurled, screwed (Kirov 422) | yes (the drawings') |
| gimbal ring -5, bracket -6, WN-79, WN-400 | brass, slotted | brass, slotted | brass, slotted | brass, no slot | Bakelite, slotted |
| wooden box, WN-80, discs, handles 51 00 10, pins, key holder, lid, maker's plate, tongue | yes | yes | yes | Kirov 247's box (no sheet) | yes |
| outer box 127-556.01 | yes | yes | yes | its own (no sheet) | yes |
| transit lock (05 01's 15) | yes | yes | yes | over the ring | yes |
| key | 1943 (51 00 11) | 1940 (127-556.02 U 01) | 1943 | 1943 | 1940 |

---

## R-05 01 00-1: the bowl (every version but the 6MX's outside)

Slices at y 10.5, 8, 6.6, 6, 3, −0.5, −1.5, −12, −13, −30, −39, −40, −42, −42.5, −43, −46, −48, −50 and −53.5 ("last"). The overlay is `ov\bowl.png`.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 65 | 11.05 to −53.95 | 0 | match | sure |
| flange | Ø 118 for 12 | r 59.0 from YB down to −0.95, 12.0 under the cast top | 0 | match; its top 4.7 is turned to the thread (estimated, below) | sure |
| band | Ø 108 to 23,5 | r 54.0 to −12.45 | 0 | match | sure |
| body | Ø 106 | r 53.0 to −39.45 | 0 | match | sure |
| cone | 40° over 14,5 to Ø 72,5 | r 53 at −39.45 to 36.25 at −53.95; 40.9° from the bottom plane | 0 (the figures give 40.9°) | match. The scan draws the foot about Ø 77.5 and the cone about 44°, so it is drawn out of scale. The figures agree with each other, and the model follows them | sure |
| bore | Ø 98 | r 49.0 | 0 | match | sure |
| floor | 53 under the top | 53.7 (YB − 49: faced to 05 06_01's "49 von Werkring-auflage") | +0.7 | recorded (README, The bowl) | sure |
| inner round | drawn, not figured: r 6.3 (6.2-6.5, circle fitted to the line's centres on the scan, 0.6 px residual) | r 7.0 | +0.7 | wrong, small (M4); the README's "scaled 6-8" is loose | possible |
| recess | Ø 64 × 5,5 | Ø 68.2 × 5.5 (−53.95 to −48.45) | +4.2 | recorded: the plate is Ø 68 −0,2 (F7) | sure |
| bottom | 65 − 53 − 5,5 = 6,5 | 5.8 (faced, above) | −0.7 | follows the floor | sure |
| holes | none drawn | winding hole Ø 8.2 at (−16.708, −15.292), r 22.65; WN-71's Ø 3.04 at the centre; the spring's Ø 1.2 × 1.5 at r 6.5 | — | all estimated, in the README (F8) | sure |
| rim | none drawn (a casting) | the flange's top 4.7 turned to a thread r 54.87-55.28 (ISO 0.75 pitch), a rebate r 53.03 to the seat at YB, a notch 1.8 wide at 12 o'clock | — | estimated, in the README ("The bowl's thread, rebate and notch") | sure that it isn't drawn |
| the brackets' tapped holes | not drawn on the casting (05 01 draws the screws) | not cut: the WN-78 shanks are solid brass inside the bowl's wall (probed at r 49.5-52, y −13.25) | — | recorded excuse (a turned part's radial holes): holds for the bowl | sure |
| material | Ms-Sandguß (Kokillenguß), "Gewicht 350 gr." | brass, 1.195 kg | — | recorded (README Unresolved) | sure |

**F7, F8: settled.** Every machined feature of the bowl is an estimate, and each is in the README's Estimated ("the bowl's machining", "The bowl's thread, rebate and notch", the closing spring's hole). The 64/68 conflict is recorded, and the recess is opened to 68.2. The excuses hold.

## 05 01 00-2: the closing plate (every version; the 6MX's own plate as recorded)

Slices at y −48.6 (in the groove), −50.3, −51.5, −53.0 and −53.35. The plate is shut, turned 25°: the angles below are the plate's own, measured from each other.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| disc | Ø 68 −0,2 × 2,3 | r 33.95 (Ø 67.90), −50.75 to −48.45 | 0 (the middle) | match | sure |
| boss | Ø 28 −0,2, 5 overall | r 13.95 (Ø 27.90), to −53.45; round r 1.3 under the rim (drawn, scaled) | 0 | match | sure |
| groove | Ø 10 to Ø 26, 1,5 deep, in the inner face | r 5.0-13.0, 1.5 deep | 0 | match | sure |
| bore | Ø 5,5 +0,1 | r 2.774 (Ø 5.55) | 0 (the middle) | match | sure |
| counterbore | Ø 7,5 +0,1 from the boss's face; the web 2 −0,05/−0,1 to the inner face | Ø 7.55, 3.00 deep; web 2.00 | web +0.05 over its largest (1.95) | wrong (M2) | sure |
| M 2,6 | at 25 on the line through the Ø 1,2 | r 1.32 at r 25.00 | 0 | match | sure |
| Ø 1,2 | at 12,4, tangent to the groove's wall | r 0.60 at r 12.35, 0.05 inside the wall | −0.05 (within ±0,1) | match | sure |
| its depth | "3 +0,2" (F5) | full diameter 2.99 under the groove's floor, the 118° point's tip 3.35 under | −0.01 | match (at the least of its tolerance) | likely |
| window | Ø 8 +0,2 (a) at 22,6 (a), 90° from the M 2,6 | r 4.05 (Ø 8.1) at r 22.60 | 0 | match | sure |
| the window's side | the plan, the inner face (its circles are the groove's Ø 26 and Ø 10 and the bore's Ø 5.5): the M 2,6 and Ø 1,2 lie 90° **clockwise** from the window | 90° **counterclockwise** from it, seen on the inner face (atan2: window 197.5°, knob 107.5°; `iso\r_iso_closingPlate.png`, top row from below, bottom row from above) | mirrored | wrong (M1). Wempe 3955's plate, seen from below (`16_Wempe_3955_Gehäusetopf_Kardan.jpg`), puts its knob about 80° counterclockwise from its window, which is the sheet's layout seen from that side | sure |
| finish | ▽▽, untoleranced ±0,1 | — | — | — | — |

**F5, settled.** On the scan's pixel columns (x 229-235, 250-255, 275) the "3 +0,2" runs from the groove floor's level (row 241.5) to a short extension line at row 251.5 that leads out from the bottom of the Ø 1.2's drill point. That is 10 px, 2.9 mm at 3.45 px/mm. It is not 4.6 from the top face, and not the boss's 2.7. So it is the blind hole's depth from the groove's floor, and the model's 2.99 to the point's foot meets it. The code comment doesn't name the figure (M13 g).

**The joint the bore and web imply (M3).** The plate turns on WN-71. A Ø 5.5 +0.1 bore under a Ø 7.5 +0.1 counterbore, with its web held to 1.90-1.95, is a shoulder screw's seat: the shoulder a little longer than the web clamps on the bowl's bottom and leaves the plate free on it. The model's WN-71 is a plain M3 under a Ø 7.2 head, so the plate has 1.27 mm of radial play on it. Nothing locates the plate, and its window comes over the winding hole only by luck. No WN sheet is in the set.

## 05 01 01 and R-05 01 01-2: the bezel and its glass (every version but the 6MX's)

Slices at y 6.7, 9, 11.8, 13, 14.5, 15.5, 17, 18.8, 19.1 and 19.5. Pixel columns on 05 01 01 at x 250-690 (4.78 px/mm; the scan turned 0.7°, about 1 px in 100).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| the casting | Ø 125 for 8,2, 30° to Ø 116, 16 high; bores Ø 92 to 11,5, Ø 106 × 4,5 | the finished ring lies inside it everywhere: Ø 121.2 at its widest, r 56.6 at the underside against the casting's r 58, 13.4 high (the casting's top faced 2.6), the lower bore cut out to the thread (r 55.08-55.31) | — | consistent (README Readings corrected: 05 01 01 is the 1941 finished ring) | likely |
| the finished section | 05 01 01, traced (no figures) | the code's traced profile: underside YB + 0.3, step 5.0 up (on the dial), the thread to the step, the widest band r 60.2-60.45 knurled at b0 + 7.5-9.8, the seat 12.3, the lip to 13.4 | — | match to the trace (±0.2) | likely |
| thread | the hidden zig-zag up the lower bore (05 01 01's left end) | ISO 0.75 pitch, crests r 54.9, on the bowl's rim | — | estimated (README; its size and pitch from a 6MX); the reader's M14 agrees it is a thread | likely |
| the glass | 05 01 01's right half: on the ring, its top at row 191.5 and underside at 208.5 (17 px, 3.56 mm), its top 15.8 over the ring's underside (75.5 px) | Ø 111.6 × 3.5, from 18.95 to 22.45, top 15.80 over the bezel's underside, its edge chamfered to r 54.3 | thickness −0.06 | match to 05 01 01 | likely |
| the glass's holding | the lip rises about 1.2 beside the glass's edge (05 01 01's right half); nothing is turned over it | lip 1.1 over the seat (13.4 − 12.3), the glass loose in it | — | holds as drawn: what keeps the glass in (cement, burnishing) isn't drawn (estimated) | likely |
| the 1:1 left half | the knurled band in view (diagonal lines across the half from the outer edge, rows 219-228.5, 7.85-9.8 over the underside), the glass in view over it | knurl at 7.5-9.8 | 0 | match. The reader's "glass cut (a hatched strip)" is the knurl drawn in view | likely |

**7-M10, judged.** 05 02_1 draws "Glas 3" and puts its underside 15,8 over the plate (17,0 in pencil). Its title block is "So 127 556 04 / 0402": the lever chronometer's Werk number. That is the Boden-Chronometer of 51-00_1, whose case is the Buna case 127-556.03. Its glass belongs to another case. 05 01 01 is the Einheits case's own bezel: it draws the glass 3.56 thick, its top 15.8 over the bezel's underside. The model holds 05 01 01: 3.5 thick, its underside 15.60 over the pillar plate's dial face and 1.25 over the hands. Kept (M15). Record it in Readings corrected.

## 05 01: the gimbals, brackets, box fittings and the transit lock (every drawn version)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| ring | 05 01 measured 25 October (Ø 140 inside, 4.0, 24.0) | r 70.00-74.00, −10.95 to 13.05 (24, centred on YP) | 0 | match (the first pass's line centres) | likely |
| ring bracket (5) at 3 o'clock | 3.3 thick, 15.4 high (scaled); its screws "verstellen" | r 74-77.3, −6.65 to 8.75, 58 long; two WN-kr M2.5 through Ø 2.82, tapped through the ring | — | match; the slots aren't drawn, so round holes are recorded | likely |
| case brackets (2) at 12 and 6 | the boss's face 5.8 inside the ring; two screws 13 radial each (plan, elevation) | boss face r 64.3, −19.25 to 5.85, the pivot hole Ø 3.2 through the boss | 0 | match | likely |
| their two screw holes each | drawn: screws 13 through the bracket's foot into the bowl | not cut in the bracket: the shanks lie in solid brass from r 53.5 to 57.5 (probed, both brackets, both screws) | — | missing (M10) | sure |
| locking bracket (3) at 50° | its screw through the foot (elevation) | its WN-78 at r 57.2-49.7 in solid brass (probed at r 54-57) | — | missing (M10) | sure |
| F9: Schnitt C-D's screw 13 head-on | the plan and the elevation make the case bracket's screws radial; C-D's view half draws a slotted head as an ellipse at the crank's foot, with a block beside it (`c1_cdl2.png`) | radial, 15.0 either side | — | the plan and the elevation agree with each other; C-D is drawn inconsistent; the model's reading holds | likely |
| inner pivots WN-79 (12) | M5 (scaled), tip into the pocket b, "leicht spielend" | M5 tapped through the ring; tip Ø 3.0 × 4.6 in the bracket's Ø 3.2; head 74.0-76.8 | — | match | likely |
| lock nuts WN-400 (10) at b | inside the ring against its face, about Ø 23 × 2 in C-D's section (the drawn strip, 5 px × 57 px at 2.45 px/mm) | knurled Ø 22 × 2.4, its face at r 69.13 | — | match | likely |
| outer pivots WN-80 (11) | M6 through the side wall (51 00 10's M6); the tip in the ring at 9 and through the bracket at 3 | M6 tapped in the wall (r 3.02); tip Ø 3.1 in the ring's Ø 3.2; head Ø 12 × 3.8 | — | match | likely |
| the disc at a (F17) | a flat disc about Ø 23 × 2 against each wall's inside, round the M6; no list line; row 9 blank | `Lagerscheibe`, knurled Ø 22.7 × 1.9, bore Ø 6 on the M6 | — | M12: likely the lock nut 10 | likely |
| F13: the fitting in each wall's top over the pivot | the elevation: a round-headed fitting drawn in coils, 2.3-2.4 proud and about 3.5 into the wall (14× crop, `c1_pin.png`), on the wall's middle line; **the leader "10" ends at it** (the right wall, `c1_lead.png`: the leader's end at (491, 115) px, the fitting at x 488-493) | `Kastenstift`, Ø 2.5, 2.3 proud, 3.3 into the wall; the lid bored Ø 2.7 × 2.6 | — | its size and place hold. What it is stays open: the elevation numbers it 10, the list's Kontermutter, which can't be a nut on a wall's top. The "V" under it the reader saw is the wood's grain, not a drill point. Keep it estimated (M12) | possible |
| "11,5" | the pivots to the wall's top (the parting line) | YL − YP = 11.50 | 0 | match | sure |
| "160" | between the walls' inner faces | ±80.0 | 0 | match | sure |
| box | 185 × 185 × 180 outside | ±92.5, YF to YF + 180 | 0 | match; 51 00 10's 185 high recorded (F12) | sure |
| transit lock (15) | knob in the front right corner, "17" from the front wall's inside | knob's axis at z 62.9, 17.1 from the wall's inner face (80) | +0.1 | match | likely |
| ring's slot for the lever | Schnitt A-B leaves the band unhatched between 20.6° and 52.4° (the first pass's reading) | the slot, its height estimated (0.5 over and under the lever) | — | holds (possible, as the reader says) | possible |

## 05-01_6: the key of 1940 (127-556.02 U 01 = 51 00 11; versions "first" and "3955")

Measured on the code's lathes (the parts are turned) and on the scan at 6.79 px/mm by its 84 (`c6_sec.png`, `c6_view.png`, `c6_pipe.png`).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 84 | 0 to 84.0 | 0 | match | sure |
| pipe out of the body | 32 | the body from 32.0 | 0 | match | sure |
| grip (1) | a flat pear, 3.2 thick, its blade standing in the cap | traced plate, 3.2 thick, standing on the collar's top at 54.0 | — | the outline matches; it is held by nothing (M7) | sure |
| collar / cap | the section hatches the cap apart from the body: a collar 2.8 high over a spigot about 2 into the body's top (its joint 48.8 from the pipe's tip) | the collar Ø 20.5 × 2.9, one piece with the body | — | the cap is a part of its own (M7) | likely |
| screw (5) | countersunk, flush in the cap, head about Ø 2.9, shank about Ø 1.8 × 6.8, 5.7 off the axis, into a hole tapped in the body and drilled about 11.3 deep with its point | a disc Ø 3 × 1 standing on the collar, 5.3 off the axis, with no shank and no hole | — | missing (M7) | sure |
| spring (4), F4 | coaxial in both views: in the outside view a coil drawn as a zig-zag across a hidden bore about Ø 8.3 (56 px), under a crossed block 3.7 high; in the section, wire sections at r 3.75 (≈ 0.6-0.8 wire), about 5 coils over about 6 mm, beside the pipe | none | — | missing (M5) | likely |
| pipe (3) | runs up inside the body to the cap's spigot (48.8 from its tip, scaled), Ø 6 | Ø 6.0 × 45, pressed 13.0 into the body's Ø 6.0 bore (line to line; bom `press`) | −3.8 | wrong (M5): it is free in the body, a one-way key as the 1943 key is (likely) | likely |
| socket (5-M17) | from the tip, its wall 1.47 off the axis, 28.7 deep to the point's foot (±0.5), its mouth chamfered; the section can't tell round from square | round Ø 3.1 × 28, its mouth sunk to Ø 4.2 | — | wrong: a round Ø 3.1 can't take the fusee's square, 3.1 r6 (its diagonal 4.4). M6 | sure |
| the crossed block | a rectangle with an X, the width of the bore, between the collar and the spring | — | — | unread (the pipe's head, or a square drive): an estimate either way | — |

## 05-01_7, _8, _9: the key of 1943 (51 00 11; versions last, 1943, 6mx)

On the code's numbers. The bounds agree (`inv.txt`), and `iso\r_iso_key1943.png` matches the outside view.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| body 05 01 02-2 | Ø 14,5 −0,2; 25,1 −0,2; 15° from 15,1; chamfer 1,5 +0,3 × 45° | Ø 14.5, 25.1; as drawn | at the tops of their tolerances | match | sure |
| bore | Ø 8 +0,1 × 22 +0,2, 120° | Ø 8.10; full diameter to 22.0 | 8.1 at its top (the comment says "the middles": M13 f); 22.0 at its least | match | sure |
| through hole | Ø 6 +0,1 | Ø 6.10 | at its top (M13 f) | match | sure |
| slot | 3 H11 (+0,060), the Ø 35 saw's floor 6,3 +0,1 under the top at the outside | 3.03; 6.3 at the outside (7.40 at the bore) | 0 (the middle); 6.3 at its least | match (F1: the paddle, not a ball) | sure |
| cross hole | Ø 2,5 +0,05, its centre 4 −0,05 under the top | Ø 2.525 at 4.0 | 0; 4.0 at its top | match | sure |
| spring's hole | Ø 0,9 +0,1 at 3,8 +0,1, 5°, from below (rev. a: was a slot) | Ø 0.9 at 3.8, 5° | at the least | match (F2) | sure |
| paddle 51 00 11-1 | a flat round grip, 3 thick in the slot (scaled Ø 34.5), holed for the pin | Ø 34.5 × 3, pin hole Ø 2.525 | — | match | likely |
| pin 51 00 11-6 | Kerbstift K.S. 1 (grooved) | plain Ø 2.5 × 15.3 in Ø 2.525 holes | — | holds by its grooves, which aren't modelled (fit list) | likely |
| tube 05 01 02-3 | Ø 8 −0,05 × 2,6 head, r 0,3 under it; Ø 5,95 −0,05; 50,1 −0,2 | Ø 8.0 × 2.6 (a 0.3 × 45° chamfer under the head, not r 0.3); Ø 5.95; 50.1 | at the tops; the round drawn as a chamfer | match | sure |
| square | 3,1 □ +0,05, 19 +2 deep, drilled 23 +2, sunk 60° × 1 +0,2 | 3.15 across, 19, the hole to 23, the sink 1.1 | at the top; at the least; 0; middle | match. On the fusee's 3.1 r6 square (3.12 at its root) 0.03 clear | sure |
| end | relieved over 2,5 +0,3 | 2.5 to Ø 4.6 (estimated) | at the least | match (recorded) | likely |
| finish | the tube ▽▽▽ (`c9_tr.png`) | — | — | the transcription, makers.js and the book say ▽▽ (F14, M13 e) | sure |
| spring 51 00 11-4 | round the tube, its end in the Ø 0.9 | 12 coils of 0.6 at a pitch of 0.95, its end down the hole | — | match (scaled, recorded) | likely |

## 51-00_2, _3, _4, _5 and 51-00_1: the handle, maker's plate, tongue, outer box, the arrangement

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| handle 51 00 10 | 100 × 18; ends 6 off, middle 12,5 off, strip 3; screws 5 from its ends; 75 over the bottom; 3,5 under the pivot screw's head | 100 (z ±50), 18 (−26.45 to −8.45), x to 92.5 + 12.5; screws at ±45; middle 75.0 over YF; its top 3.5 under the head's edge (1.05 − 6) | 0 | match | sure |
| finger recess | 70 × 30 hollow, 10 deep | as built 27 October | 0 | match | likely |
| M 6 | "Vorbohren 4,8 Gew. M 6", 11,5 under the line 105 over the bottom | at 93.5 over the bottom, tapped | 0 | match | sure |
| maker's plate 00 01 01-9 | 26 × 52, "Alu 10", white, four Ø 1,2 at 2 from the edges | a box 52 × 26 × 1, the lettering a texture, four discs Ø 1.8 × 0.6 standing on its face at 2 from the edges | — | the holes aren't cut, and the pins have no shanks (M8) | sure |
| tongue P. 51 00 02-2 | 45, 39, 14, 10, 8, 4 −0,1, Ø 6,2 sunk 0,5 × 45°, M 3,5, 0,2 over 7, "2°40'" | 45, 39, 14, 10, 8, 4, both holes, the sink and the step built | 0 | match for every figure | sure |
| its outline | both edges taper (about 1°20' each, 2°40' between them), the narrow end centred on the holes' line, a shallow convex arc (sagitta about 1.2, R ≈ 7 scaled, `c_tz.png`) | one edge straight and the other tapering 3.2° (2 over 36), the narrow end 1.0 off the holes' line, a semicircle r 4 | — | wrong (M9) | likely |
| outer box 127-556.01 | 157 + 88; 250 / 225; 270, 370; walls and plate 12,5; cushions 20; the strip 13 high, 5 thick, **4 over the walls** (`c5_rim.png`) | 157, 88, 250/225, 270, 370 (the plate's arcs); the strip 13 × 5 standing **2.0** over the walls (21.05 to 34.05 against 32.05) | −2.0 | wrong (M11); the code's own comment says 4 | sure |
| 51-00_1 (F11) | the Boden-Chronometer: small seconds at 6, no up-and-down dial, a Buna case, a hand setting and a balance holding device; the key holder a triangle in the back right corner | the key holder's place and the outer box taken from it | — | borrowed from another clock's arrangement (the lever chronometer BC 1010, as the README's line 939 says): the README should say so where it uses it (M13 i) | likely |

---

## Overlay, the build book (pp. 373-511, v3.41.00) and the bowl

- **The bowl on R-05 01 00-1** (`ov\bowl.png`, at the sheet's scale on its axis and cast top). The flange's steps at 12 and 23.5, the body, the bore, the cone and the recess's ceiling lie on the sheet's lines. Every unpartnered line is explained:
  - the flange's top 4.7 turned to the thread: estimated, recorded;
  - the floor 0.7 deeper: the 49, recorded;
  - the recess's wall 2.1 out: the 68.2, recorded;
  - the inner round about 7 px (0.7 mm) longer on both legs: M4;
  - the foot: the sheet's corner lies about 2.6 out of the model's on the scan, where its 72,5 is drawn about 77.5: the figures decide.
- **The book's pages** (WBOOK: bowl 374-382, closing plate 383-392, bezel 393-397, ring 398-411, box 412-437, lid 438-456, outer box 457-488, transit lock 489-498, key 499-511):
  - p. 375, the bowl: every figure there agrees with the sheet's where the sheet has one (12 as 7.30 + 0.80 + 3.90, 23.5 as 12 + 11.50, 14.5 as 5.50 + 5.80 + 3.20, Ø 118, 108, 106, 98, the recess 68.20). But:
    - the inner round is drawn as a long curve down through the hatched wall;
    - the thread is drawn in the view half as dense hatching;
    - the foot's Ø 72.5, the cone's 40°, the round's radius, the thread's designation and the notch are not given.
  - p. 384, the closing plate: no M2.6, Ø 1.2 or Ø 8, none of their places (25, 12.4, 22.6), and not the web's 2 −0,05/−0,1.
  - p. 394, the bezel: the thread's flanks are listed as dimensions (0.19, 0.56 repeated).
  - p. 396, the glass: Ø 111.60 × 3.50, which agrees.
  - p. 399, the ring: Ø 140 / 148, 24.00; no holes listed.
  - p. 413, the box: 185 × 185, 105.
  - p. 421, the handles: 100, 18, 12.5.
  - p. 447, the maker's plate: 26 × 52 × 1.60 (the pin heads counted in its thickness), no holes.
  - p. 449, the tongue: only 10 and 4; none of 45, 39, 14, Ø 6.2, M 3.5, 2°40', 0.2 × 7.
  - p. 502, the key's body: Ø 8.10 bore and Ø 14.50, 25.10; no slot 3 H11, cross hole Ø 2.5, Ø 0.9 hole, Ø 6 hole, 22 depth or 15°.
  - p. 504, the tube: the square socket given as "Ø 3.15 bore", the finish ▽▽ (the sheet's ▽▽▽).
  - The 1940 key has no sheet: the book draws only the 1943 key (pp. 499-511).

  All of this is M14.
- **isolate.py renders:**
  - The closing plate from above and from below, beside 05 01 00-2's plan: the mirror (M1) shows directly. Turned so the knob is at 9 o'clock, the model's window stands at 12 on the inner face where the sheet's is at 6.
  - The 1940 key beside 05 01_6: the outline matches. The spring, the pipe's run up to the cap and the countersunk screw (M5, M6, M7) are inside and don't show.
  - The 1943 key beside 05 01_7, _8: the paddle, cross pin, body and tube match. A ring line round the tube at 19 from its mouth is the seam between its two solids (cosmetic).

## Fit list (step 6)

Probed on the solids (`inside.py`) and read off the code where they are turned parts. Tolerances are the sheets'. bom.py's press passes ≤ 0.02 and its tap ≤ 0.1. seatcheck.py doesn't walk the case.

| # | piece | into | seat on the solid | sheet's fit | model's fit | held by | verdict |
|---|---|---|---|---|---|---|---|
| J1 | bowl, through its brackets 2 | gimbal ring | WN-79's tip Ø 3.0 × 4.6 in the bracket's boss hole Ø 3.2 | "leicht spielend" | 0.1 radial; the shank's end 0.1 off the boss | WN-79 M5 tapped in the ring (cut), locked by WN-400 against the ring's inside | holds |
| J2 | case brackets 2 (×2) | the bowl's wall, at 12 and 6 | the foot on the band and body (r 54 / 53) | two screws 13 each, radial; slots by the note (not drawn) | two WN-78 (M4, head Ø 7 × 2.6, 8 long) through **solid** bracket and bowl | the screws (no holes cut) | M10 for the bracket's holes; the bowl's tapped holes are the recorded excuse |
| J3 | locking bracket 3 | the bowl at 50° | its foot on the body | one screw 13 (elevation) | WN-78 M2.5 × 7.5 through solid brass | — | M10 |
| J4 | gimbal ring | box walls | WN-80's tip Ø 3.1 in the ring's Ø 3.2 at 9, through the bracket's Ø 3.2 and 1.75 into the ring at 3 | "leicht spielend" | 0.05 radial | WN-80 M6 tapped in the wall (cut) | holds; the wall's disc likely the lock nut (M12) |
| J5 | ring bracket 5 | the ring's outside at 3 | Ø 2.82 holes over the ring's M2.5 (cut) | screws, slots by the note | two WN-kr M2.5 to 0.05 inside the ring's face | the screws | holds (round holes recorded) |
| J6 | closing plate 6 | the bowl's recess | its inner face on the recess's ceiling (−48.45), the boss 0.5 inside the foot | turning on screw 7 | the plate's Ø 5.55 bore on a plain M3 shank: 1.27 radial play | WN-71 (head Ø 7.2 × 2.5 in the Ø 7.55 counterbore, M3 into the bowl's Ø 3.04) | M3 (a shoulder screw by the bore and web), M2 (the web) |
| J7 | knob WN-72 | the plate's M 2,6 at 25 | tapped | thread | Ø 5.2 × 2.4 head, its stub in the M2.6 | thread | holds; its side of the window is mirrored (M1) |
| J8 | closing spring 14 | the plate's groove; the Ø 1,2 × 3 +0,2 | outer end 2 down the Ø 1.2; inner end 1.2 up a Ø 1.2 × 1.5 in the bowl | no sheet | free in both | its own wind (estimated) | holds as estimated |
| J9 | movement ring's flange | the bowl's rebate (r 53.03) on the seat YB | 0.05 clear (the first pass) | no sheet (the casting draws none) | — | the bezel's step on the dial | holds as estimated (batch 9 for the ring) |
| J10 | ring's pin WN-202 | the bowl's notch, 1.8 wide | its end free inside the bezel's crests | no sheet | — | LOOSE's entry | holds (F16) |
| J11 | bezel | the bowl's rim | the ISO 0.75 thread, 0.03 radial | 05 01 01's thread symbol | screwed until its step bears on the dial (the step at 11.65 = the dial's top) | thread | holds as estimated |
| J12 | glass 05 01 01-1 | the bezel's seat (12.3) | its edge r 55.8 in the lip r 56.2 | on the ring, the lip 1.2 up its edge | 0.4 radial, loose | not drawn (cement or burnishing) | holds as drawn; its fixing estimated |
| J13 | 1943 paddle | the body's slot 3 H11 | 3.0 in 3.03 | H11 | 0.03 clear | grooved pin through both (Ø 2.5 in Ø 2.525) | holds (the pin's grooves not modelled) |
| J14 | 1943 tube | the body's bores | head Ø 8.0 in 8.1; shank 5.95 in 6.1 | head 8 −0,05 in 8 +0,1 (0-0.15); shank 5,95 −0,05 in 6 +0,1 (0.05-0.2) | 0.1; 0.15 | the paddle's rim over its head; the spring | holds |
| J15 | 1943 spring | the tube; the body's Ø 0.9 | wound on the tube, its end down the hole | — | — | its wrap | holds |
| J16 | 1940 pipe | the body | Ø 6.0 in Ø 6.0, pressed 13 (bom `press`) | free in a bore, the spring round it, up to the cap (drawn) | line to line | — | M5 |
| J17 | 1940 grip and cap | the body | the plate stands on the collar's top face to face (audit's expected zfight) | the cap screwed to the body by 5 | nothing | — | M7 |
| J18 | 1940 screw 5 | the body's tapped hole | a disc on the collar, no shank | countersunk M2 (about), tapped hole drilled 11.3 | — | — | M7 |
| J19 | 1940 socket | the fusee's square 3.1 r6 | round Ø 3.1 | a socket 28.7 deep (scaled) | can't go on | — | M6 (5-M17) |
| J20 | handles 51 00 10 | the side walls | two wood screws Ø 3.5 × 10.5 each | two screws (bottom view) | in wood (no holes: wood screws) | screws | holds |
| J21 | maker's plate | the lid's front | four disc "heads" on its face | four Ø 1,2 holes, pins or nails | no holes, no shanks | nothing | M8 |
| J22 | tongue | the lid's front | WN-zg (M6, head Ø 9) through the Ø 6.2; knob WN-zk's Ø 3.5 stub 1.5 into the M3.5 | a pivot in Ø 6,2; M 3,5 tapped | 0.1 radial on the pivot | screw (estimated), knob (estimated) | holds as estimated |
| J23 | the wall-top fittings | each side wall's top | Ø 2.5 × 3.3 in the wood, no bore; the lid's Ø 2.7 × 2.6 over it | drawn, numbered 10 by the elevation's leader | embed (bom), lid 0.1 clear | the wood | holds as estimated (M12) |

## Extra checks

### (a) Slots, notches and grooves

| feature | views | model | verdict |
|---|---|---|---|
| the key body's slot 3 H11 | 05 01 02-2's section (its far wall) and side view (the Ø 35 floor's arcs); 51 00 11's section | built, 3.03, its floor the Ø 35 arc | holds |
| the "spherical seat Ø 35" (transcription) | none: it is the slot's floor (F1) | not built | right |
| the key body's Ø 0.9 (rev. a "war Schlitz 0,9") | end view and side view | a hole | holds |
| the closing plate's groove Ø 10-26 × 1,5 | section and plan agree | built | holds |
| "a small groove at the boss's edge" (transcription) | it is the Ø 1.2 cut by the section (F3) | not built | right |
| the bowl's notch for WN-202 | no sheet in the set (F16) | 1.8 wide at 12 o'clock, from the 6MX's photograph | estimated, recorded |
| the ring's slot for the transit lock's lever | Schnitt A-B's unhatched band, 20.6°-52.4° | built in the drawn versions | holds (possible) |
| the brackets' slots ("Kloben verstellen") | the note; no view draws them | round holes on the ring bracket; none cut on the case brackets (M10) | the note holds; recorded |
| the tongue's step 0,2 over 7 | section and plan | built on the outer face | holds |
| the handle's finger recess | the section's hollow | built | holds |

### (b) Drawn holes

Present: the closing plate's six (bore, counterbore, M 2,6, Ø 1,2 blind, Ø 8, and its groove); the ring's (WN-79's M5 at 12 and 6, the tips' Ø 3.2 at 9 and under the bracket at 3, the bracket's two M2.5); the ring bracket's pivot hole and two screw holes; the case brackets' pivot holes; the box walls' M6; the key body's bore, through hole, cross hole, slot and Ø 0.9; the tube's square, pilot and sink; the paddle's pin hole; the tongue's Ø 6.2 and M 3.5.

Missing where a sheet draws them:
- the case brackets' two screw holes each and the locking bracket's one (05 01's screws 13 through them: M10);
- the maker's plate's four Ø 1,2 (M8);
- the 1940 key's tapped hole for screw 5, and its square socket, where a round one is built (M6, M7).

The bowl's tapped holes for the brackets are the recorded excuse (radial holes across a turned part aren't cut). The casting itself draws none (F8).

### (c) Excuses

| entry | re-judged |
|---|---|
| checks.py LOOSE, `ring:Cylinder` WN-202 "its end is free" | holds (J10) |
| checks.py FLOAT_BOX, the closing plate's screw "its head bears on the counterbore's floor" | holds as built. If WN-71 becomes a shoulder screw (M3), its head bears on the shoulder's top and the entry is rewritten |
| FLOAT_BOX, the ring bracket's screws, WN-79, WN-80 | hold (J1, J4, J5) |
| FLOAT_BOX, the tongue's pivot screw (lid) | holds as estimated (J22) |
| FLOAT_BOX in the 6MX's box (`audit.py box --rev 6mx`) | 4 entries "no longer found": they are the drawings' box's, and the 6MX's has another plate, box and no tongue. Limit them to the drawn versions (M16) |
| audit-expected `box.first`, zfight `key:Extrude`/`key:Buffer` | the 1940 grip on its collar face to face: it records the joint M7 rather than excusing a fit |
| bom.json `WN-78` `in 050100-1 embed` | holds for the bowl (a turned part). It doesn't cover the brackets, whose holes can be cut (M10) |
| bom.json `127556.02-03` `in 127556.02-02 press` | the 1940 pipe isn't pressed (M5) |
| bom.json `127556.02-05` fn "its click spring 127-556.02-04 not drawn" | the spring is drawn (M5) |
| bom.json `050101-1` fn "In the bezel's top, flush with it" | stale: on the ring, 2.4 proud of its lip (M13 a) |
| bom.json `Kastenstift` `in Holzkasten embed` | holds as estimated (J23) |
| bom.json `050102-3` `in 050102-2 free` | holds (J14) |
| bom.json `WN-71` `in 050100-1 tap`, `WN-72` `in 050100-2 tap` | hold as threads. WN-71's shoulder is the joint's open question (M3) |
| bom.json devs | none on these lines |
| README Estimated / Readings corrected / Unresolved for these parts | re-read in full. The stale ones are M13 (a-d, h-j). The rest hold: the bowl's machining, the 68.2, the box's 180, the 350 g, the brackets' slots, the pins over the pivots, the key holder's place, the outer box's undrawn parts |

---

## The reader's F1-F17, 5-M17 and 7-M10

| # | outcome |
|---|---|
| F1 | settled: the paddle is flat, 3 thick in the slot. The model is right; the transcription is wrong (M13 k) |
| F2 | settled: the end view is from below, and "4" runs to the cross hole's centre. The model is right (M13 k) |
| F3 | settled: the web is 2 −0,05/−0,1, and the "groove at the boss's edge" is the Ø 1.2. The model's counterbore is 3.00 deep, so the web is 0.05 over its tolerance (M2) |
| F4 | confirmed: the spring is drawn coaxial and the pipe runs free up to the cap (M5) |
| F5 | settled: "3 +0,2" is the Ø 1.2's depth from the groove's floor. The model's 2.99 matches (M13 g) |
| F6 | settled: the bezel's lower bore goes over the movement ring's flange on the bowl's rim. The model is right (M13 k) |
| F7 | recorded excuse holds |
| F8 | recorded excuse holds: every machined feature of the bowl is in the README's Estimated |
| F9 | the model follows the plan and the elevation, which agree; C-D is drawn inconsistent. Holds (likely) |
| F10 | numbering conflicts recorded in bom.json's `dwg` fields; nothing to change |
| F11 | likely: the README should name 127-556 as the lever chronometer's arrangement where it uses it (M13 i) |
| F12 | recorded in Unresolved; holds |
| F13 | the elevation's leader 10 ends at the fitting; its purpose stays open, its size holds (M12) |
| F14 | confirmed ▽▽▽ (M13 e) |
| F15 | settled: the model is right (M13 k) |
| F16 | recorded estimate holds |
| F17 | likely: the disc is the lock nut 10 (M12) |
| 5-M17 | confirmed: sure (M6) |
| 7-M10 | kept: 05 02_1 is a 127-556.04 sheet, and 05 01 01 draws the model's 3.5 glass, its top 15.8 over the bezel's underside (M15) |

## Findings

**M1. Wrong, sure. 05 01 00-2, the closing plate (every version: last, first, 1943, 3955, and the 6MX's plate built on the same layout): mirrored.**
- The sheet's plan is the inner face: its circles are the groove's Ø 26 and Ø 10 and the bore's Ø 5.5, not the boss's Ø 28 or the counterbore's Ø 7.5. On it, the M 2,6 and the Ø 1,2 lie 90° clockwise from the window.
- The model's lie 90° counterclockwise from it on the inner face (window at 197.5°, knob at 107.5°; `iso\r_iso_closingPlate.png`).
- Wempe 3955, seen from below, has its knob about 80° counterclockwise from its window: the sheet's layout seen from that side. The model's 3955 version is mirrored against its own photograph too.
- Correction: the knob and the Ø 1.2 (with the spring's outer end, its inner end's hole CSI in the bowl, and Wempe 3955's two holes) on the other side of the window, `tk = t8 + π/2`. Check the shut turn's sense (CPS) and the spring's hand with it. The 6MX's knob, at r 19, is unchecked against Kirov 14917's foot.
- Physics: yes, small. The knob and the plate's mass move about 50 mm across, so the bowl's centre of gravity moves about 0.03-0.04, over massprops.py's 0.01 check. Run massprops.py --model wempe --write, then gimbals.js --model wempe and the Wempe report's gimbals section.

**M2. Wrong, sure. 05 01 00-2 (every version): the web over its tolerance.**
- The sheet's web is 2 −0,05/−0,1 (1.90-1.95), from the inner face to the counterbore's ceiling. The model's is 2.00: the counterbore is 3.00 deep from the boss's face.
- Correction: the counterbore 3.075 deep (the web 1.925).
- Physics: negligible (with M1's massprops run).

**M3. Joint, likely. WN-71 in the closing plate's bore (every version): the plate has 1.27 of play.**
- The sheet's Ø 5,5 +0,1 bore, under a Ø 7,5 +0,1 counterbore and over a web held to 1.90-1.95, is a shoulder screw's seat. The plate turns on the shoulder, which is a little longer than the web and clamps on the bowl's bottom.
- The model's WN-71 is a plain M3: the plate floats 1.27 radially, and its window comes over the winding hole only by its spring.
- Correction: WN-71 with a shoulder Ø 5.45 × 2.0 under its Ø 7.2 head (0.05 clear on the bore, 0.075 over the web), M3 into the bowl's bottom (estimated: no WN sheet in the set). Rewrite FLOAT_BOX's first entry.
- Physics: negligible (massprops with M1).

**M4. Wrong (small), possible. R-05 01 00-1, the bowl (every drawn version and 3955): the inner round.**
- The sheet's round, between the bore and the floor, fits a circle of r 6.3 (6.2-6.5) through its line's centres (3.45 px/mm, 0.6 px residual). The model's is r 7.0; the README says "scaled 6-8".
- Correction: r 6.3, recorded as scaled.
- Physics: yes, small. About 0.58 cm³ less brass (about 4.9 g, 0.4 % of the bowl), over massprops.py's 0.1 % check: massprops → `gimbals_wempe.json` → gimbals.js --model wempe (with M1).

**M5. Missing / wrong, likely. 05-01_6, the key of 1940 (versions first and 3955): a one-way key with its spring.**
- The sheet draws spring 4 in both views, coaxial: a coil across a hidden bore about Ø 8.3 under a crossed block in the outside view, and about 5 wire sections at r 3.75 beside the pipe in the section.
- The pipe runs up inside the body to the cap's spigot, 48.8 from its tip (scaled at 6.79 px/mm). The key is a wrap-spring one-way key, as the 1943 key is.
- The model has no spring. It presses a 45-long stem 13 into the body's bore, line to line (bom `press`), and the README says "the click spring in the body (4) isn't drawn".
- Correction:
  - the pipe free in a bore Ø 6 under the body's Ø 8.3, up to the cap;
  - the spring as drawn: about 5 coils of 0.6-0.8 wire on r 3.75, about 6 long, its ends unread (estimated);
  - bom's relation `free`; the README and bom text corrected.
  - The crossed block stays unread (the pipe's head or a square drive).
- Physics: yes. wempe_overwind.js forces the 1940 key "the wrong way" as a plain key. As a one-way key it slips, so its result and the report's section change. Rerun wempe_overwind.js --model wempe (its report's section).

**M6. Joint, sure (5-M17). 05-01_6, the 1940 key's socket (first, 3955).**
- The model's round Ø 3.1 × 28 socket can't take the fusee's 3.1 r6 square, whose diagonal is 4.4.
- The section draws the socket's wall 1.47 off the axis and 28.7 deep to the point's foot (±0.5), its mouth chamfered. A section can't tell round from square.
- Correction: a square 3.1 +0.05 across, as the 1943 tube's 3,1 □ (estimated), 28.7 deep, on a drilled point, its mouth sunk.
- Physics: no, beyond M5's overwind run.

**M7. Missing / joint, sure for the screw, likely for the cap. 05-01_6 (first, 3955): the cap and screw 5.**
- The section hatches the cap apart from the body (a collar 2.8 high over a spigot about 2 into the body). It holds the grip's blade, and screw 5 holds it to the body: the screw is countersunk flush, about Ø 2.9 head, shank about Ø 1.8 × 6.8, 5.7 off the axis, in a hole tapped in the body and drilled about 11.3 deep.
- The model's collar is the body's. The grip plate stands on it face to face (audit's expected zfight `box.first`), held by nothing. Screw 5 is a disc Ø 3 × 1 standing on the collar, with no shank and no hole.
- Correction: the cap a piece of its own with the blade let into it (how isn't drawn: estimated); screw 5 as drawn (about M2 countersunk) in a tapped hole in the body; the zfight entry dropped.
- Physics: no.

**M8. Missing, sure. 00 01 01-9, the maker's plate (last, first, 1943, 3955).**
- The sheet's four Ø 1,2 at 2 from the edges aren't cut. The plate is a plain box 52 × 26 × 1, with four discs Ø 1.8 × 0.6 standing on its face and no shanks.
- Correction: the four holes through, and four pins or nails Ø 1.2 (heads estimated) into the lid's front.
- Physics: no.

**M9. Wrong, likely. P. 51 00 02-2, the tongue (last, first, 1943, 3955): its outline.**
- The sheet's plan tapers both edges (about 1°20' each; its "2°40'" is the angle between them, or the one edge's against the holes' line, and both give 10 to 8 over about 43). The narrow end is centred on the holes' line and ends in a shallow convex arc: sagitta about 1.2, R ≈ 7 (scaled).
- The model tapers one edge only, 3.2° (2 over 36), so the narrow end stands 1.0 off the holes' line. It ends in a semicircle r 4.
- Correction: both edges symmetric about the holes' line, from 10 at the round end's tangent to 8 at the end; the end an arc R 7 (scaled) through the tip at 39; the step 0.2 over 7 kept.
- Physics: no.

**M10. Missing, sure. 05 01 00-3 and -4, the case brackets and the locking bracket (last, first, 1943, 3955): their screw holes.**
- The WN-78 shanks run through solid brass in each bracket, probed at r 53.5-57.5 in both case brackets and at r 54-57 in the locking bracket. 05 01 draws the screws through them.
- The bowl's tapped holes are the recorded excuse (a turned part). The brackets are `sweepS` and solid outlines that can take holes, as the ring bracket's are cut.
- Correction: clearance holes along each screw's axis (M4: Ø 4.5; M2.5: Ø 2.9, estimated; round, the slots of "Kloben verstellen" not drawn).
- Physics: negligible (about 0.5 g; with M1's massprops run).

**M11. Wrong (small), sure as built. 127-556.01-13/-14, the outer box's rim strip (last, first, 1943, 3955).**
- Its top should stand 4 over the walls: 51-00_5's "4", and the code's own comment. It stands 2.0 over them (21.05 to 34.05 against 32.05).
- Correction: the strip's centre at OT − 2.5 (its top OT + 4).
- Physics: no.

**M12. Text / part, likely. 05 01 items 10 and the discs at a (last, first, 1943, 3955; the 6MX's box borrows them).**
- The parts list has one lock-nut line (10, Kontermutter WN-400) and no washer or disc. Row 9 is blank. At b the nut is the knurled Ø 22 × 2.4 disc inside the ring.
- At a the same kind of disc, about Ø 23 × 2, lies against each wall's inside round WN-80's M6. Nothing else stops WN-80 from turning. So the "Lagerscheibe" is most likely the lock nut 10 too (F17).
- The elevation's leader 10 ends at the wall-top fitting instead (F13). A nut there makes no sense, so the fitting's purpose stays open and its estimate holds.
- Correction: rename `Lagerscheibe` to WN-400 (threaded M6 against the wall, as drawn: Ø 22.7 × 1.9 measured, knurled); bom.json's WN-400 four in all; README (the gimbals, Estimated) to match.
- Physics: no (not in the bowl or ring).

**M13. Text, sure. Stale or wrong text for these parts.**
- (a) README, The bezel and glass, gives "the glass Ø 110.5 × 3.7 in the seat, flush with the ring's edge". It is Ø 111.6 × 3.5 on the ring, 2.4 proud of the lip, its top 15.8 over the bezel's underside. bom.json `050101-1`'s fn ("flush with it") is stale the same way.
- (b) README Unresolved, the case, the bezel ("The thread isn't sized ... not built"): built since 24 October 2026.
- (c) README Unresolved, the case: "the 1943 key is its assembly's (127-556.02 U 01, parts -01 to -05 on 05 01_6)". 127-556.02 U 01 is the 1940 key (05-01_6). The 1943 key is 51 00 11 (05-01_7), its parts 51 00 11-1 to -6 and 05 01 02-2, -3.
- (d) README Estimated: "the square's 60° sink left out" (built 27 October) and the tongue's "thinned end not drawn" (built 27 October).
- (e) The tube's finish is ▽▽▽, not ▽▽: in the transcription, makers.js (`050102-3`'s treat) and the book's p. 504 (F14).
- (f) case.js on the key's body says "Fits: the bore Ø 8.1, the hole Ø 6.1 ... (the middles of their tolerances)". For 8 +0,1 and 6 +0,1 the middles are 8.05 and 6.05; the model's are at their tops. Correct the text, or the sizes (the tube's head and shank are then 0.075 and 0.125 clear, inside the sheet's).
- (g) case.js and the README on the closing plate: name the "3 +0,2" as the Ø 1.2's depth from the groove's floor (F5).
- (h) README, The key of 1940 ("The click spring in the body (4) isn't drawn") and bom.json `127556.02-05`'s fn (M5).
- (i) README, The outer box and the key holder (and Estimated's key holder): say that 127-556. A-1 and 127-556.01 are the lever chronometer BC 1010's arrangement and outer box (as line 939 says), from which the key holder's place and the outer box are borrowed (F11).
- (j) README Readings corrected: 05 02_1 is a 127-556.04 sheet, and its "Glas 3", 15,8 are that clock's case's (7-M10, M15).
- (k) The transcription (`05-01-51-00-case-box-overview.md`): the reader's M1-M6, M8, M9, M11 and M12 (F1, F2, F3, F6, F15). The model is right in each.
- Physics: no.

**M14. Build book, sure. Pp. 373-511 (v3.41.00).**
- (a) The bowl: the inner round is drawn as a curve through the hatched wall and the thread as dense hatching in the view; the foot's Ø 72.5, the 40°, the round's radius, the thread's designation and the notch are missing.
- (b) The closing plate: the M2.6, Ø 1.2 and Ø 8 and their places are missing, and the web's tolerance.
- (c) The bezel: the thread's flanks are listed as dimensions.
- (d) The key's tube: the square socket is written "Ø 3.15 bore", and the finish ▽▽.
- (e) The key's body: the slot, cross hole, Ø 0.9, Ø 6 hole, 22 depth and 15° are missing.
- (f) The tongue: only 10 and 4.
- (g) The maker's plate: 1.6 thick, no holes.
- (h) No sheet for the 1940 key.
- Correction: drawbook.py (threads by their designation, holes and squares in the hole tables, turned parts' rounds kept on their own lines), then the redraw at the end.
- Physics: no.

**M15. Kept, likely (7-M10). The glass's thickness and height (last, first, 1943, 3955).**
- 05 02_1's "Glas 3" and "15,8" (17,0 in pencil) are the lever chronometer's (So 127 556 04, 0402). 05 01 01, the Einheits bezel's own sheet, draws the glass 3.56 thick on the ring, its top 15.8 over the bezel's underside.
- The model's glass is 3.5 thick, its underside 15.60 over the pillar plate's dial face.
- Correction: none; record it (M13 j). If the owner prefers 05 02_1's figures: the glass 3.0 thick, its underside raised 0.2 (top 22.15), the bezel's seat with it.
- Physics: no.

**M16. Excuse, possible. checks.py FLOAT_BOX (version 6mx).**
- `audit.py box --rev 6mx` reports four FLOAT_BOX entries as "no longer found": the closing plate's screw, both WN-80, and the tongue's screw. They are the drawings' box's, and the 6MX's has its own.
- Correction: give the entries the drawn versions only, or leave them (the audit passes).
- Physics: no.

**Physics, in all.**
- M1, M4 (and with them M2, M3, M10) change the bowl's mass and centre of gravity: massprops.py --model wempe --write → `tools/gimbals_wempe.json` → gimbals.js --model wempe → the Wempe report's gimbals section.
- M5 changes wempe_overwind.js's 1940 key (and its report section).
- Nothing else here feeds the physics.
