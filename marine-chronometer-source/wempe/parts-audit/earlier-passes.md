# The new pass against the two earlier passes

Written 3 November 2026 from the finished ledger (`WEMPE-PARTS-LEDGER.md`: final verdict = the verifier's where it gave one, else the reader's), the new pass's batch reports and items files, pass 1 (`WEMPE-DRAWING-LEDGER.md`, `drawing-check/` batch1-10.md and changes.md), pass 2 (`WEMPE-DRAWING-LEDGER-2.md` and its plan on `origin/claude/wempe-drawing-check-2`) and the Wempe README (Estimated, Readings corrected, Unresolved, 'Left open by the drawings check'). No verdict was changed and no sheet re-read for this comparison; a verdict here is a reading of the records, not of the drawing. Abbreviations: P1 B1.. = pass 1's batch reports (their tables give drawn / built / verdict row by row), CH = pass 1's changes.md, P2 n-Mk = pass 2's findings, O-k = its owner questions, README = marine-chronometer-source/wempe/README.md.

Caveats that apply to every row: (a) pass 2's ledger is the state of its branch, and its 'open' rows were partly corrected after (the new pass measured the merged model); (b) the new pass measured the 'last' version unless it says otherwise, the earlier passes built and judged first / 1943 / 3955 / 6MX versions as well; (c) 'built' in the new pass is read from exact solids, so a feature like a square's diagonal can read differently.

## 1. Findings the new pass ends as mismatch, not built or extra

207 items (168 mismatch, 22 not built, 17 extra). Each row lists the new ids it covers. Category: C = corrected by an earlier pass; K = kept or recorded as a departure (reason quoted or cited); O = recorded as open; R = read differently by the earlier pass; N = not found by either earlier pass.

### C: Corrected by an earlier pass (check whether the model still differs) (16 items, 10 rows)

| New ids | Item (drawn / built) | What the earlier pass decided | Cite |
|---|---|---|---|
| 06-1-15, 06-2-9 | gold spring bend point (about 6.3 from the end) and blank straight vs bent | pass 2 2-M3: bend 6.22 from the STONE, model 6.7; owner 28 Oct adopted 6.15. The new reader gets 6.2 from the spring END and the built bend is 4.43 from the end: the datums disagree **Model now:** took by pass 2's reading (6.15 from the stone); the new reader measures from the spring's end: a datum dispute, see part 2. | P2 2-M3, O-6; README |
| 09-6-10 | right pivot/square 3.17 to 2.92 vs built 4.41..4.16 | pass 2 5-M1 corrected the square to 3.12, 1:100 to 2.92 (62ed7032); 4.41..4.16 is 3.12..2.94 times root 2 (across corners), so the measure probably reads the diagonal **Model now:** took (likely an across-corners artefact of the measure). | P2 5-M1 |
| 10-2-11, 10-2-14 | Vorreiber cross hole 0.8 vs 1.15; pin 050600-5 1.16 x 8.3 | pass 2 5-M16 / 5-M3: pin 0.8 in the hub, 1.1 taper-reamed in the arbor, 1.2 on 05 06_1; corrected 62ed7032 **Model now:** took in part: the pin now 1.16 x 8.3 for a 1.1 reamed hole; the new reader sees no pin on this sheet and 0.8 in the hub vs 1.15 built. | P2 5-M3, 5-M16 |
| 10-5-4 | pins 71: 1.25 x 2.5 vs 1.16 x 2.48 | pass 2 3-M6: rivets ('Niet'), standing 0.4 proud; corrected 8e04c305 **Model now:** took; residual 0.09 in diameter, 'Niet' diameter unsure. | P2 3-M6 |
| 11-6-9 | round hook body arc R6 centre (3.55, 2.8) vs R5.93 (3.47, 1.70) | pass 1 corrected the hooks from their 10:1 sheets (0fd2ddad) and its table had read the same 3,55 / 2,8; the model still follows the drawn dot (1.7), not the printed 2.8 **Model now:** took in part: arc radius and across within 0.09, but 'along' still follows the dot (1.7), not the printed 2.8. | CH batch 7 last line; P1 B7 round-hook row |
| 12-2-7 | ratchet square hole 2.700-2.709 taper 1:100 vs 2.6975 large end | pass 2 4-M7 corrected it to a 1:100 taper (8ac67744); residual 0.002-0.011 **Model now:** took (0.002-0.011 left). | P2 4-M7 |
| 12-6-11 | lid narrow notch bottom 18.3 vs 18.328 | pass 2 4-M3 added the prising notch to the lid (62e87453); residual 0.03 **Model now:** took (0.03 left). | P2 4-M3 |
| 12-7-4 | hook stands out 0.5 -0.05 vs 0.25 | pass 2 4-M4 corrected the hook head (b7e97813, a3fa95e3); pass 1 B7 read the same 0,5 -0,05; built 0.25 still differs **Model now:** did not take, or went the other way: built 0.25 vs 0.5 -0.05 that both passes read. | P2 4-M4; P1 B7 |
| 13-1-10, 13-1-11, 13-1-v1, 13-1-v6 | hands' heights: dial to hour blade 2 vs 1.78; boss to flange 0.2? vs 0.72; scaled 0.4-0.5 vs 0.715 | pass 2 7-M5 / 11-M14 lowered the hands about 0.95 to 05 02_1's boxed figures; the gap is now within the sheet's scale but not equal, and '0,2' is unsure **Model now:** took in part: the hands were lowered about 0.95; the gap is 1.78 against 2 (scaled 1.64). | P2 7-M5, 11-M14; README |
| 14-2-10, 14-6-13 | countersink on the bore built, not drawn on these sheets | pass 1 built the hour/change wheels' riveting sink 0,4 x 30 deg because 05 02 02 / 05 02 09 draw it (eaf9b16c); these two sheets omit it **Model now:** took as intended: the sink is built because the other sheets draw it. | CH batch 9 (open) line 2 |

### K: Kept by the owner's choice or recorded as a departure (92 items, 36 rows)

| New ids | Item (drawn / built) | What the earlier pass decided | Cite |
|---|---|---|---|
| 01-2-2, 01-2-26 | hole 4: plain 0.9 on the sheet, built with a 4.3 oil sink | pass 1 recorded 'extra, recorded (3955 photo) - holds'; pass 2 added that the README has no Estimated entry for the sink (open) | P1 B1 hole-4 row; P2 9-M11 |
| 01-2-27 | two blind 0.925 holes with 1.4 countersinks (detent block pins) | pass 1: 'not on sheet ... extra, recorded (3955 photo) - holds' | P1 B1 detent block pins row |
| 01-2-28 | r1.0 rounds at the horn tips; sheet 01b draws them pointed | pass 1 made the tips a version each by the owner's choice (sharp 1943, r1 as 05 08 01 1946 in 'last', r0.3 on 3955); pass 2 added that 'last' mixes 1946 tips with 1943 holes (open, O-9) | CH batch 1 line 8; P2 9-M3, O-9 |
| 01-3-7 | hole 10 Schnecke: sheet 2.70 +-0.009, built 2.82 | pass 1: 'WRONG vs sheet, recorded departure (fusee pivot 2.8 at its shoulder on 05 06 04-1; README Unresolved) - holds' | P1 B1 hole-10 row |
| 01-3-29, 01-3-30 | holes 56, 57 (contact screws, 'nur bei Bedarf') not built | owner, 28 Oct (pass 2 O-10 / 11-M10): left out, 'Wempe 3955's plate has none', recorded in the README (Not built) | P2 11-M10, O-10; README |
| 02-4-10 | fusee bush bore 4.1 +0.2, built 4.52 | pass 1: '+0.22 over the limit, recorded departure (arbor journal O 4.5, README Unresolved); holds' | P1 B2 bore row |
| 02-5-9 | dust bush body drawn straight O13.1, built waisted (45 deg step to 10.5) | pass 1 found the conflict between sheets and the owner chose both ways: waisted as 05 08 01 (1946) in 'last', straight as 05 08 01-3 in first/1943 | CH batch 2 line 9; P1 B2 item 6 |
| 02-8-10 | set-up click 17.4 overall vs 17.53 built | pass 1 kept: '17,4 overall against 17.53 from 9,7, 7,5, r 1, 3,5, 85 deg: the figures that place the beak and nose kept; ... a photograph can't resolve 0.13'; pass 2 8-M10 confirmed the figures close on 17.53 (open); README Kept | CH batch 2 line 7; P2 8-M10 |
| 03-3-18, 03-8-6 | jewel stack: two halves 1.4 + 1.4, built 1.63/1.17 and 1.53/1.19 | pass 1: 'split differs, recorded estimate - holds' (lower U31 'open reading, unsure'); README Estimated (stones scaled on the coloured section) | P1 B3 settings rows |
| 03-8-8 | 0.1 stack proud of the arm face, lower cock | pass 1 U31 row: '0,1 proud ... open reading, unsure' | P1 B3 lower settings row |
| 04-1-3, 04-1-7, 04-1-8, 04-1-9 | layout 05 05_1 figures: 17 to centre wheel, plates 3.0, Zwischenbruecke 4 | pass 1 read the layout's 17, 3,0 and 4 and built the detail sheets' figures (plates 3.35, bridge 3.8); pass 2 6-M12 and README Unresolved: '05 05_1's layout's lesser figures beside the detail sheets that supersede them' | P1 B8 layout row; P2 6-M12; README |
| 04-4-10, 04-7-3 | seat 2.6 n6 / 4.0 n6 built at nominal | the model draws fits at the middle of their range; pass 1 listed sizes 'at their tolerances' limits' and the README 'now at their middles' | P1 B1 item 10; README |
| 04-4-15, 04-7-9, 04-7-10 | lower pivot length 4.5 / 4.6 vs 3.0 / 2.95 (blank, to the centre) | pass 1 took the kompl. sheet's finished 3: 'match (taking the kompl.'s 3, as recorded)', the 5,1 -0,2 being the blank with its centre | P1 B8 lines 25, 53 |
| 05-3-6 | centre pinion collar 5.4 n6 built 5.4 | fits at the middle (as above) | README |
| 05-3-14, 05-3-18 | centre pinion tip lengths 16.7 / 5.1 vs 14.3 / 3.0 | pass 1 B8: '16,7 -0,2 with a centre point (the blank) ... 14.30: match / recorded' | P1 B8 line 25 |
| 05-3-15 | centre pinion overall 39.65 vs 37.33 | pass 1: 'overall 39,65 -0,1 (1940) vs 37.33: recorded departure'; pass 2 6-M5 added that 39.65 is not a blank length (README stale) | P1 B8; P2 6-M5 |
| 05-7-4, 05-7-5, 05-7-6, 05-7-7 | escape pinion 05 04_8: length 5, 6.5, overall 26.5, arbor 1.6 vs built 4.0, 5.3, 22.78, 1.2 (blank sizes) | pass 1 listed 'the blank 3,13 / 1,6 / 5 / 26,5' and took the length from 07-2: '4.0 (71 px) match (length recorded as scaled)' | P1 B4 lines 42-49, 230 |
| 06-1-7 | block screw to wheel 23.8 vs 23.41 | kept: 'the block screw on hole 13 at 23.41 from the wheel: Wempe 3955, carrying the 1941 block, measures 23.36 +-0.15'; README Kept | CH batch 4 last line; README |
| 07-1-16, 07-2-7 | 14.03 / 14 from hub to lower tip vs 12.59 | README Readings corrected: 14.03 runs to the lower centre's apex on the stock; a finished staff that long would put the pivot 0.23 past the lower cock; pass 1 corrected the lower pivot to 12.59 (12,6 -0,02) | CH batch 3 line 9; P1 B3 item 11 |
| 08-4-5 | collet bore 1.6 H7 vs 1.6029 | tolerance-middle rule; pass 1 bbaf4a2b opened the bore on its 1:70 | CH batch 3 line 8 |
| 08-4-7 | collet other-face bore (1.55) vs 1.65 | pass 1 corrected the bore to 1.604-1.647 on the sheet's 1:70 on purpose: 'the sheet's 1,6 would stand 3.15 over the arm, against 05 03_5's 13,4 and 0,75'; pass 2 1-M7: the seat tapers 1:77 | CH batch 3 line 8; P2 1-M7 |
| 08-5-15 | stud point rounded vs sharp | pass 1 kept: 'the round point O 0.8 the blank's: the facets ground to the knife edge leave no metal for it' | CH batch 3 last line |
| 09-6-1, 09-6-3 | fusee arbor 60.6 overall, left pivot about 6.1 vs 58.125, 3.625 | pass 1 B5: '60,6 -0,2 overall ... recorded departure (the centre cut off under the dial); holds' | P1 B5 stub row |
| 10-3-7 | fusee wheel rim 40.65 vs 40.569 | pass 1 B5: 'blank 40,65 -0,05 (hobbed to 40,57): 40.57 match' | P1 B5 blank row |
| 10-3-17 | fusee wheel bore 4 +0.1 vs 4.55 | pass 1 B5: '+0.45, recorded departure (can't pass the arbor's seat 4.38-4.5); holds'; pass 2 5-M15 kept as an estimate (a 4,45 H7 bore would wedge on the 1:70 seat) | P1 B5; P2 5-M15 |
| 11-6-8 | round hook flank 30 deg vs 31.7 | the sheet is over-dimensioned: its own centres give 31.7 (verifier); pass 1 built the hook 'figures as written, the rest traced' | CH batch 7 last line |
| 12-1-11, 12-8-3 | 1941 arbor body length 12 vs 11.58 | pass 1 B7: 'core 12 ... core 11.9 (recorded)'; the model builds the 1948 core | P1 B7 1941 arbor row |
| 12-5-2, 12-6-1 | lid seat 39.2 s6 / r6 built 39.2 | pass 2 4-M15 kept: 'the lid's fit at nominal; holds by its 5 deg cone'; pass 1 built the lid edge as one 5 deg face | P2 4-M15; CH batch 7 line 1 |
| 12-7-7, 12-8-6 | hook pin hole 2 dia x 6 deep, blind vs through | README Unresolved: bore()/holeCut end a hole flat; the 1943 arbor's hole built right through its core 'as 05 07 02 dashes it' (closed 1 Nov) | README Unresolved |
| 12-8-4, 12-8-5 | 1941 arbor chamfer end O9, 22.5 deg x 0.8 vs 10.0, 45 deg x 1.65 | pass 1 built the 1948 core on purpose: 'core faces O 10 with 1.65 x 45 deg chamfers (O 9 and 2.15, the 1941 core's)' | CH batch 7 line 2 |
| 12-8-7, 12-8-8, 12-8-9, 12-8-11, 12-8-12 | 1941 arbor necks and pivots 5, 6.7, 3, 5/3.5, 4 vs 4.48, 6.77, 2.88, 4.48/3.94, 3.88/2.92 | pass 2 4-M6: 'the sheets disagree among themselves ... kept as an estimate (README)' | P2 4-M6 |
| 13-7-1, 13-7-2, 13-7-5, 13-7-8 | Lange dial 1453/A: O103 x 1.5 Eisen, hole 2.2 vs the Wempe disc 103.55, 1.2, 1.7 | pass 1 kept: 'the Lange variant keeps the Wempe disc, only the printing swapped: 1453/A's O 103 x 1,5 (Eisen), O 2,2 seconds hole recorded in the README'; pass 2 7-M11 (dial thickness) | CH batch 9 (open) line 1 |
| 15-2-2, 15-2-6, 15-2-9, 15-2-12, 15-2-13, 15-2-14, 15-5-1, 15-5-2, 15-5-3, 15-5-4, 15-5-5, 15-5-6, 15-5-7, 15-5-8, 15-5-9 | R- casting sheets (bowl 05 01_2, bezel 05 01_5): flange, bore, recess, heights vs the finished machined parts | the new verifier says both R- sheets are castings (blank sizes bind nothing); pass 1 built the bezel from its finished section 05 01_4 re-read at 6x (5c49513b) and recorded 'flange O 118 x 12 ... recorded departure (24 Oct: bezel screwed on, seat in a rebate)' | CH batch 10 line 1; P1 B10 |
| 16-5-6 | corner bracket triangle 24 vs 59.5 | README (key holder): 51-00_1 is the Boden-Chronometer's arrangement, 'a lever chronometer's, borrowed for the Einheits box' | README Unresolved (key holder) |
| 16-6-12 | box panel height 185 vs 180 | README 'The box's height (25 October 2026, decided, nothing changed)': 05 01 note 180 vs 51 00 10 185; pass 1 B10 matched '185 x 185 x 180' | README; P1 B10 |
| 17-1-10, 17-1-22, 17-1-23, 17-1-24, 17-1-25, 17-1-28, 17-1-29, 17-1-38, 17-1-50, 17-1-53, 17-1-57, 17-1-59, 17-1-60, 17-1-66, 17-1-69, 17-1-70, 17-1-72 | coloured section 001: heights of arbor ends, jewels, necks, within +-0.2-0.3 | pass 2 11-M3: 'heights past +-0.3 at the arbors' domed ends, the drum floor, ...: each part's own sheet decides - kept'; README Estimated: stones 'scaled on the coloured section (a pictorial section ... likely, +-0.1)' | P2 11-M3; README Estimated |

### O: Recorded as open (23 items, 17 rows)

| New ids | Item (drawn / built) | What the earlier pass decided | Cite |
|---|---|---|---|
| 01-4-3 | hole 30 land: 4.59 H7 step on which face | pass 2 9-M2: the 5.2 H7 seat is on the wrong face (03b plan vs 32-2), open; pass 1 corrected only the diameters | P2 9-M2; CH batch 1 line 14 |
| 02-6-7 | pillar end taper 5 deg vs 6.0 built | pass 2 9-M8: lead-in 4.8 deg against the drawn 6 deg, open (pass 1 matched the '6 deg ends') | P2 9-M8; P1 B1 pillar row |
| 03-3-13 | stud screw/pin hole 5 along the arm vs 4.1 built | pass 1: U30 draws 5 back and 4,2 across, model M1.4 at (4.1, 4.35); pass 2 8-M3 / O-8: keep or adopt U30's 4,2 (question for the owner) | P1 B2 stud screw hole row; P2 8-M3, O-8 |
| 04-2-8 | seconds-wheel hub O6 vs 6.4 built | pass 1 W2: hub boss not drawn (built 0.2 proud), corrected to flush; pass 2 6-M1 / 6-M9 hubs three ways (open); README Unresolved: 3955 shows a O 6.4 ring | CH batch 8 line 2; P2 6-M1, 6-M9 |
| 04-4-1 | seconds pinion upper pivot/post 9.2 vs 7.2 built | pass 1 W4 (post built 9.1, flat 0.45 end, minor); pass 2 6-M3: 1946 sheet 9.2 vs 1940 kompl./coloured section 7.2, open; README Unresolved (post height) | P1 B8 dial-pivot row; P2 6-M3 |
| 04-4-18 | seconds post tip: pointed cone drawn, flat 0.47 built | pass 1 W4 'minor', not in changes.md as corrected (so left) | P1 B8 dial-pivot row |
| 05-1-10 | cannon Koerner groove (notch both sides) vs three cone dimples | pass 2 6-M6: the punched dents not built; cannon 0.01 clear of its shank (open) | P2 6-M6 |
| 05-3-9 | rivet lip O3.6 vs 3.2 | pass 2 6-M9: wheel seats riveted three ways, the centre one as turned (open) | P2 6-M9 |
| 06-3-13, 06-3-28 | block M1.2 hole 5.15 vs 5.0; two O0.45 steady-pin holes built, not on the sheet | pass 2 2-M6 / 2-M8: no M1 or pin holes drawn on 05 04_3, the O0.45 holes an estimate credited to the sheet (open) | P2 2-M6, 2-M8 |
| 07-5-11, 07-6-10, 07-6-17 | rim: '39', hole top form, 8 Koerner in 60 Teilung (0 built) | pass 1 B3: graduation 'missing (README: no photograph resolves it)'; pass 2 1-M11, 1-M16 open | P1 B3 graduation row; P2 1-M11, 1-M16 |
| 08-1-2, 08-1-3, 08-1-4 | hairspring heights: top curve 3.15, collet face 0.75, spring 9.5 vs 2.89, 0.49, 9.97 | pass 1 B3 saw 'top curve 3,15 ... built 3.99 centre (+0.8)'; pass 2 1-M14 open (13.4 closes on the sheet's figures) | P1 B3 line 85; P2 1-M14 |
| 08-4-11, 08-4-14 | collet cross hole 0.8 taper 1:90 built straight 0.805; punch mark none | pass 2 1-M11: the collet hole's 1:90 taper left out (open); pass 1 corrected the hole's size only | P2 1-M11 |
| 08-5-13 | stud spring hole 0.68 from the leg end vs 1.35 | pass 2 8-M15 / O-8: the sheet draws the stud off-centre, the model symmetric (open) | P2 8-M15 |
| 10-4-9 | cover plate screw WN-20 not drawn, built | pass 2 S-6: WN-20 goes into plain holes (open) | P2 S-6 |
| 12-1-6 | spring space 15.8 +-0.1 vs 15.63 | README Unresolved: 'the barrel's 15.8 framed spring space (0207, 1941) against the 1948 drum's 14.95'; pass 1 matched 15.8 for the 1941 barrel | README Unresolved; P1 B7 lid/bottom row |
| 14-3-2 | hour wheel collar top 5.2 vs 3.585 | README Unresolved: 'the hour wheel's collar (05 02 03's 5.2 against the 1943 cannon tube)' | README Unresolved |
| 17-1-58 | escape arbor O between wheel and pinion 1.38 vs 1.2/1.07 | pass 2 2-M15: drawn about O 1.0-1.1, model 1.2 (open); pass 1 B4: 07-2 draws 1.04, 07-1 '1,2': 'follows the figure' | P2 2-M15; P1 B4 line 56 |

### R: Read differently (24 items, 12 rows)

| New ids | Item (drawn / built) | What the earlier pass decided | Cite |
|---|---|---|---|
| 01-2-7, 01-2-22 | hole 26 upper step 4.5 H7 (reader: '4,5', no 9) vs built 4.596 / setting 4.59 | pass 1 read the same figure as '4,5 in 4,59' and built 4.596 / 4.59 on purpose (a06819b9); the new reader is unsure of the 9 | CH batch 1 line 13 |
| 01-4-18 | 1.0 notch at the plate rim, 6 o'clock (built, 'extra') | pass 1 read the sheet's '1' at 6 o'clock across the ring joint as 'band hole + plate notch, pin WN-201: match'; the new reader finds nothing drawn on the plate sheet | P1 B1 plate pin hole row |
| 02-6-10, 02-6-11 | pillar countersink 90 deg / O about 2.9 vs built 45 / 2.6 | pass 1 corrected the countersinks to O 2.6 at the face, 90 deg (2.59 scaled) on purpose (a06819b9); the new reader scales 2.9 and the 45 is likely a half-angle in the measure | CH batch 1 line 11 |
| 04-2-5, 04-5-4, 04-2-7 | train pivot diameters (0.8/0.82 -0.02) and taper 1:90 vs 1:83 | pass 1 matched the same pivots (0.81 to 0.777 etc.) and recorded the taper 're-inked as 1:90'; the new deltas are 0.005-0.03 | P1 B8 pivot rows |
| 05-1-7 | cannon pinion length 14.3 vs 14.19 built | pass 1 matched 'shank 14,3 over C ... 14.30' for the centre pinion; the cannon tube is another part | P1 B8 line 25 |
| 05-5-6, 05-5-7 | maintaining detent: R9 hollow centre (9.645, 6.273) vs built (9.781, 6.033) | pass 1 B6 matched 'r 9 about (6,273; -9,645), tangent to the boss'; pass 2 3-M1 then reshaped the detent (8498ff0a); the model now differs 0.14 / 0.24: the correction moved it or the datum differs | P1 B6 hollow row; P2 3-M1 |
| 07-1-4, 07-3-14, 07-3-13, 07-3-1 | staff shaft/collar/pivot diameters 1.65 s6, 1.25 -0.02 vs built 1.6514, 1.2155, 1.2 | pass 1 matched staff diameters at the middle; pass 2 1-M15: built at a limit, not the middle (open) | P2 1-M15 |
| 07-2-8, 07-3-19 | 10 deg taper on the hub flange not built | pass 1 B3 read 'flange O6,3 x 1,8 straight 0,4 then 10 deg' and recorded the built flange 'as drawn'; the new pass finds 0 deg built | P1 B3 line 71 |
| 07-6-2 | layer boundary O31.29 (steel/brass) 'not built' | pass 1 B3 matched 'joint steel/brass 31,29 -0,04: r 15.635 to 31.27'; the new pass found no item to measure | P1 B3 line 17 |
| 12-1-18, 12-7-5 | hook at 15 deg to the square flat normal vs 45 | pass 1 B7 reads the 15 deg as the hook's RADIAL FACE from the vertical centre line and corrected the head (0fd2ddad); the new pass takes it as the hook's place round the arbor | P1 B7 hook row; CH batch 7 line 6 |
| 12-9-1, 12-9-2, 12-9-3 | barrel ring 05 07_10 (42 x 38 x 19, counterbore, step) 'not built' | pass 2 4-M11 corrected the 1941 ring (seat 1.5 deep, 5 deg undercut; 804ee63c); the ring exists in the first-drawn version, the new pass measured 'last' only | P2 4-M11; README As first drawn |
| 02-6-12 | pillar relief groove round the spigot root: drawn (about 1.0 x 0.4), not built | pass 1 B1 matched it: 'relief groove ... r 2.242-3.25, 0.35 deep: match'; the new measure finds only a vertex at r 3.25 on the shoulder (the groove may be merged into the cove), so the passes read the model differently | P1 B1 relief row |

### N: Not found by either earlier pass (52 items, 20 rows)

| New ids | Item (drawn / built) | What the earlier pass decided | Cite |
|---|---|---|---|
| 01-4-6, 01-4-17 | pillar plate: 4.6 x 0.25 recess at hole 26 for the endstone setting flange | nothing found in either pass (pass 1 matched hole 26 as 4.596 through; no recess mentioned) |  |
| 02-4-19, 02-5-17 | small edge breaks / rounds drawn, not built (bush, dust bush) | not found in either pass for these parts (pass 1 batch 5 notes only the fusee wheel tube's break) |  |
| 02-5-4, 02-5-12 | dust bush flange 3.1 -0.2 vs 2.1 built; (7.62) reference vs 7.77 | not found; pass 1 matched the body (O13.1) and the sink, not the flange thickness |  |
| 02-6-8 | pillar spigot cylindrical part 1.4 -0.2 vs 1.7 | pass 1 matched the spigot as 2.80 long overall; the cylindrical/taper split was not read |  |
| 02-7-20 | barrel bridge straight edge chord 73.5 | pass 1 matched the bridge outline; pass 2 8-M12 only notes that the book draws an R 73.52 arc |  |
| 03-5-7, 03-8-2, 03-8-4 | barrel-bridge screw holes O3.4 vs 2.8; lower cock width 19.75 vs 20.0; arm 3.3 vs 3.22 | not found as such (pass 2 8-M13 has only the lower cock's M1.2 at 3.500) |  |
| 04-4-v3 | general tolerance +-0.1 on the 7 and 4,5 | not found |  |
| 06-1-12, 06-1-13, 06-1-14, 06-1-17, 06-1-20, 06-1-25 | 05 04_1 layout: wheel centre along detent, angle 53.6, 15 deg, stud circle 3.8, 45 deg chamfer, arm 2.8 | not found in either pass (README Unresolved lists 05 04_1's 5, 20, 1 deg figures as unidentified, not these) | README Unresolved |
| 06-4-15, 06-5-4 | 51 04_6 cut centre distance; 1436 tail width 0.25 vs 0.054 sliver | not found (pass 1 corrected the gold spring head 2 high, pass 2 2-M10 the head) |  |
| 07-2-2, 07-2-3, 07-2-5, 07-3-3, 07-3-5, 07-3-6, 07-3-10 | first-drawn staff collar: neck O/length 2.1, 1.3, 4.7; later staff collar 2.40/2.10, 1.6, 5.7, 6.9 | pass 1 B3 'first: collar' row noted the neck as estimated; no pass listed these lengths | P1 B3 line 71 |
| 08-2-5 | hairspring pitch 0.73 (0.52+0.21) vs 0.8003 (gap 0.280) | not flagged; the README states 0.21 between coils while the build has 0.280 (solved length): no pass compared | README Files/hairspring line |
| 09-2-3 | fusee body 45 deg chamfer outer O 29.8 vs 29.4 | not found (pass 1 batch 5 matched the body's other figures) |  |
| 10-2-1, 10-2-2 | Vorreiber overall 3.1 -0.2 and flange 1.2 vs 2.76, 0.86 | not found as figures (pass 2 5-M3, 5-M6 treat its seating and relief) |  |
| 10-3-24 | Kante leicht brechen on the boss top edge | pass 1 B5 lists the tube's break; this boss edge not |  |
| 12-1-13, 12-2-8, 12-5-18 | lid face to body 2.9; square orientation to tooth tip; slot reach 0.95 | not found |  |
| 13-1-12 | UD arbor stud 12.7 vs 12.3 | README Unresolved: the long stud built 'to the face' (0.4 uncertain); no pass compares 12.7 | README Unresolved |
| 13-3-5, 13-6-14 | bore 4.4 H7 vs 4.4155 (narrow end); dial feet absent | not found (pass 2 7-M3 treats the dial screws only) |  |
| 14-1-13, 14-4-v1 | change pinion tip O 7.2 vs 6.90; blank sizes | not found |  |
| 16-2-4, 16-2-12, 16-2-13, 16-4-5, 16-6-17, 16-8-10, 16-9-17, 16-2-v1 | 1943 key (51 00 11) and box screw sizes, scaled | not found as such (pass 2 10-M13 only: the 1943 key carries the 1940's number) |  |
| 17-1-14, 17-1-18, 17-1-19, 17-1-20 | section labels: 050901, Zugfeder 05 07 00-2, 05 07 06-3, WN-27/13/15/16 | not found (pass 2 11-M1 renames the lower balance screws WN-18, kept undecidable) |  |

### The corrected rows: did the model still differ?

All 16 corrected-category items still differ in the new pass by construction. By my reading: 06-1-15 / 06-2-9 (datum dispute), 09-6-10 (measure artefact), 14-2-10 / 14-6-13 (as intended) and 12-2-7 / 12-6-11 (a few hundredths) are not failures of the correction. 11-6-9, 10-2-11 / 10-2-14, 13-1-10 / 13-1-11 are partial. 12-7-4 (hook stands out 0.25 against 0.5, a figure both passes read) is the one where the correction did not take or went the other way; 05-5-6 / 05-5-7 (pass 1 matched, pass 2 then reshaped the detent, new pass finds 0.14 / 0.24 off) is a possible regression and is listed under R.

## 2. Earlier recorded mismatch or open items that the new pass judged match or can't tell

| Earlier item | Earlier reading | New pass | Which is wrong, and why |
|---|---|---|---|
| P2 1-M1 balance mass | Ø 6.35 boxed on 05 03_1, model 6.3 | 07-4-2 match (6.35 / 6.35) | Neither: the model was corrected after pass 2's ledger; both read 6.35. |
| P2 1-M6 staff length | 25.62 over 25.6 -0.02 | 07-3-12 match (25.59) | Neither: corrected since. |
| P2 6-M7 centre pinion shank | model 1.800 against 1,8 g6 (1.792-1.798) | 05-3-12 match (1.795) | Neither: both read the g6 limits; the model moved to 1.795. |
| P2 7-M11 dial thickness | 1,3 struck, 1,2 written over; model 1.3 | 13-1-6 match (1.2 / 1.2) | Agree on the sheet; the model now 1.2. |
| P2 10-M2 closing plate web | drawn 2 -0,05/-0,1 (1.90-1.95), model 2.00 | 15-3-8 match (1.925) | Neither: corrected since. |
| P2 2-M5 escape wheel bore | callout 1,8 H7/h6 against table 1.7, model 1.7 | 05-6-7 can't tell (callout 1.8 vs table 1.7); built 1.797-1.808 | Pass 2 is the firmer reading (it also used 05 04_1 and the collet scale); the new reader could not choose. The model now follows 1.8. Weaker in the new pass, not wrong. |
| P2 4-M13 barrel chain slot | drawn 4.6-4.7, built 4.04 (0.6 off) | 12-1-17 can't tell ('unclear') | Pass 2 measured the plan at 12.27 px/mm with fitted circles (README: read 25 Oct); the new reader's 'unclear' is a weaker reading. I think pass 2 is right. |
| P2 2-M16 escape wheel rim recess | recess over the whole rim to the roots | 05-6-9 match (0.7 deep) | Not a conflict: the new pass checked the depth only, pass 2 the extent (O-7 is an owner question). |
| P2 1-M2 / O-4 mass screws | nothing holds a mass; WN-12a fitted in one mass | 07-5-12 can't tell (no size printed) | Not comparable: the new pass has no joint test; pass 2's seatcheck finding stands. |
| P2 7-M3 / 9-M5 dial screws | plain Ø 1.04 holes under threaded screws | 13-1-15 can't tell (1.6/1.7 vs 0.98) | The new pass reads a different dimension; pass 2's stands. |
| P2 6-M8 bush WN-300.zb | bored 0.86, 0.035 over its pivot | 03-4-4 can't tell (seat 0.7 +0.02) | Different dimension; no conflict. |
| P1 B1 pillar relief groove, 05-5-6/7 hollow, steel/brass boundary, flange taper, plate notch | pass 1 'match' | 02-6-12 not built, 05-5-6/7 mismatch, 07-6-2 not built, 07-2-8 / 07-3-19 not built, 01-4-18 extra | Reverse cases (pass 1 right, or the new measure differs): see the R rows above. I think the new pass is wrong for 07-6-2 (a steel/brass boundary inside a fused solid is not measurable) and probably 12-9; unsure for the groove, the taper and the hollow. |
| P2 3-M15 stop slide / 2-M9 split upright / 4-M12 Steg width | open or kept as estimates | not covered (no item) | The new pass has no item for them: a gap in its coverage, not a disagreement. |

In short: where pass 2 left a number open, the new pass mostly agrees with pass 2's reading and finds the model fixed; the three real disagreements are the escape wheel bore (new: can't tell), the chain slot (new: can't tell) and the gold spring's bend point (datum, part 1 C). None of the earlier passes' joint findings (pass 2's S-1 to S-7 and the 'nothing holds it' rows) can be confirmed or refuted by the new pass, which measures sizes only.

## 3. What the new pass found that neither earlier pass did

The 52 items of category N. The most substantive, with the verifier's confidence where it gave one:

- 01-4-6, 01-4-17: pillar plate: 4.6 x 0.25 recess at hole 26 for the endstone setting flange.
- 02-4-19, 02-5-17: small edge breaks / rounds drawn, not built (bush, dust bush).
- 02-5-4, 02-5-12: dust bush flange 3.1 -0.2 vs 2.1 built; (7.62) reference vs 7.77.
- 02-6-8: pillar spigot cylindrical part 1.4 -0.2 vs 1.7.
- 02-7-20: barrel bridge straight edge chord 73.5.
- 03-5-7, 03-8-2, 03-8-4: barrel-bridge screw holes O3.4 vs 2.8; lower cock width 19.75 vs 20.0; arm 3.3 vs 3.22.
- 04-4-v3: general tolerance +-0.1 on the 7 and 4,5.
- 06-1-12, 06-1-13, 06-1-14, 06-1-17, 06-1-20, 06-1-25: 05 04_1 layout: wheel centre along detent, angle 53.6, 15 deg, stud circle 3.8, 45 deg chamfer, arm 2.8.
- 06-4-15, 06-5-4: 51 04_6 cut centre distance; 1436 tail width 0.25 vs 0.054 sliver.
- 07-2-2, 07-2-3, 07-2-5, 07-3-3, 07-3-5, 07-3-6, 07-3-10: first-drawn staff collar: neck O/length 2.1, 1.3, 4.7; later staff collar 2.40/2.10, 1.6, 5.7, 6.9.
- 08-2-5: hairspring pitch 0.73 (0.52+0.21) vs 0.8003 (gap 0.280).
- 09-2-3: fusee body 45 deg chamfer outer O 29.8 vs 29.4.
- 10-2-1, 10-2-2: Vorreiber overall 3.1 -0.2 and flange 1.2 vs 2.76, 0.86.
- 10-3-24: Kante leicht brechen on the boss top edge.
- 12-1-13, 12-2-8, 12-5-18: lid face to body 2.9; square orientation to tooth tip; slot reach 0.95.
- 13-1-12: UD arbor stud 12.7 vs 12.3.
- 13-3-5, 13-6-14: bore 4.4 H7 vs 4.4155 (narrow end); dial feet absent.
- 14-1-13, 14-4-v1: change pinion tip O 7.2 vs 6.90; blank sizes.
- 16-2-4, 16-2-12, 16-2-13, 16-4-5, 16-6-17, 16-8-10, 16-9-17, 16-2-v1: 1943 key (51 00 11) and box screw sizes, scaled.
- 17-1-14, 17-1-18, 17-1-19, 17-1-20: section labels: 050901, Zugfeder 05 07 00-2, 05 07 06-3, WN-27/13/15/16.

Beyond the mismatches, the new pass's 1,593 items are one-by-one comparisons with a stated certainty, so it also gives a count of what holds (about 1,400 matches) that the earlier passes did not tabulate. Its batches 15-17 (the case, the R- castings, the section 001) are the least covered by the earlier ledgers.

## 4. Summary

Part 1: 207 findings: 16 corrected earlier, 92 kept or recorded, 23 open, 24 read differently (all by pass 1 or 2), 52 found by neither. Part 2: 13 rows: 5 where the model was since corrected and the passes agree, 2 where the new pass is the weaker reading (escape wheel bore, chain slot), 5 where the new pass does not test the point (joints, extent, other dimension), and 1 row of reverse cases (pass 1 matched, new pass mismatch). Part 3: 52 items.

The five most important differences between the passes:

1. Method. The new pass measures sizes on exact solids and ends 207 items as mismatch, not built or extra; 92 of them (44 %) are departures an earlier pass had already kept or recorded (blank against finished lengths, 1941 parts against the 1948 build, R- casting sheets, fits at the middle of their range, coloured-section heights). The earlier passes found joints (seatcheck, 'nothing holds it') and stale text; the new pass cannot test either.
2. 52 items neither earlier pass found. Most are small or scaled, but a few matter: the gold spring/detent tail narrowing to a 0.054 sliver where the sheet keeps 0.25 (06-5-4), the escape wheel centre 0.447 off the pipe line and 4.2 deg off the drawn angle (06-1-12, 06-1-13), the ratchet square's turn of 10-13 deg against the tooth tip (12-2-8), the hairspring pitch 0.80 against 0.73 (08-2-5), the dust bush flange (02-5-4).
3. Corrections that did not fully take: the round hook's 'along' figure (11-6-9), the hook's height 0.25 against 0.5 (12-7-4, both passes read 0.5), the hands' gaps (13-1-10 / 13-1-11), and a possible regression of the maintaining detent's hollow (05-5-6 / 05-5-7: pass 1 matched, now 0.14 / 0.24 off after pass 2's reshaping).
4. The gold spring's bend point is a datum dispute: pass 2 (and the owner's 28 Oct adoption) put it 6.15 from the stone; the new reader finds 6.2 from the spring end (built 4.43 from it). They cannot both be right; the sheet's arrow needs one more look (06-1-15).
5. Version scoping. The new pass measured the 'last' version, so first-drawn parts (the 1941 barrel ring 12-9, the 1941 arbor 12-8, the layout's lesser figures 04-1) appear as mismatches that pass 1 and pass 2 built as separate versions. Reverse cases where pass 1 matched and the new pass differs: the pillar relief groove (02-6-12), the flange taper (07-2-8 / 07-3-19), the steel/brass boundary (07-6-2).
