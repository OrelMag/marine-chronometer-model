# Plan: the Hamilton's parts rebuilt from Hamilton's own drawings (31 October 2026)

The owner received 26 of Hamilton Watch Co.'s engineering drawings for the Model 21 from the NAWCC (`References/Hamilton-original-drawings/`, inventoried in its `INVENTORY.md`). The owner's request: design each drawn part from its drawing, replacing what the model has now. This plan covers how to do that, in what order, and what has to be decided first.

The scans carry "Not to be reproduced without the permission of the NAWCC". They stay out of git (`.gitignore`), off the site and out of the page, the reports and the essay, as the NAWCC Bulletin articles do. Their numbers, cited by drawing number, may go anywhere.

## What the drawings cover

| Group | Drawings | Parts in the model now (PROVENANCE.md rows) |
|---|---|---|
| Going train | 42073 fourth wheel, 42072 fourth pinion | 110-23 |
| Fusee | 42015 fusee wheel, 42022 fusee arbor | 109-9, 109-21 |
| Maintaining and winding work | 42009 sustaining ratchet wheel, 42010 winding pawl, 42007 winding pawl spring, 42013 winding ratchet, 42016 sustaining spring, 42096 sustaining pawl | 109-10 to 109-14 and the sustaining pawl's row |
| Barrel and mainspring | 42168 barrel, 42169 barrel cap, 42170 barrel arbor, 1-WD-265 the mainspring's inner end | 109-1, 109-3, 109-6 and the mainspring (`mainspring.py`) |
| Set-up | 42026 setup ratchet, 42027 setup pawl, 42028 setup pawl spring | 108-37, 108-38, 108-46 |
| Fusee chain | 42001 assembly, 42002 and 42003 hooks, 42004 link pin, 42005 centre link | 109-22 |
| Detent | 42093 assembly (no sizes), 42087-2-51A the blank, 42087-1-52 its machining | the detent (110 rows; `shared/escapement.js`, `DBLK`) |
| Not placed | 42050 helical spring (beryllium copper, 7.4 × 14 mm) | none: find where it goes first |

Not in the set, so not covered here: the plates and bridges, the balance and hairspring, the escape wheel, the centre and third wheels, the cock, the dial and motion work, the case and box, and the detent's block, trip spring, screws and finished outline (42087-3-01).

## Phase 0: the scale conflict (first, before any part)

Every absolute size on the drawings is 11-16 % larger than the model's. It happens in the train as well as in the fusee group, so it is not FK alone:

| | Model (mm) | Drawing (mm) | Drawing / model |
|---|---|---|---|
| Fusee wheel to centre arbor, centre distance (90 : 14 at module 0.44) | 20.38 | 22.88 | 1.123 |
| Third to fourth, centre distance (80 : 10 at 0.28, the same cutter as the third wheel) | 11.30 | 12.60 | 1.115 |
| Fourth to escape, centre distance (75 : 10 at 0.28, if the escape pinion is 0.28 too) | 10.44 | 11.90 | 1.139 |
| Fusee wheel, over the tips | 36.06 | 40.97 | 1.136 |
| Sustaining ratchet, over the tips | 33.10 | 38.10 | 1.151 |
| Winding ratchet, over the tips | 14.80 | 17.02 | 1.150 |
| Setup ratchet, over the tips (the model has 42 teeth, the drawing 40) | 15.28 | 17.02 | 1.114 |
| Barrel wall, outside | 36.60 | 41.91 | 1.145 |
| Fusee square | 2.40 | 2.79 | 1.164 |
| Barrel arbor square | 2.27 | 2.79 | 1.234 |

The ratios between parts agree well: fusee wheel to sustaining ratchet 1.075 on the drawings against 1.09 in the model, and barrel to fusee wheel 1.023 against 1.01. So the shapes are right and the absolute scale is in question. FK (0.882) shrank the fusee group from "the fusee wheel's tips taken as 40.87 mm", which is almost exactly the drawing's 40.97. The train's modules come from the centre distances in `L`, which are scaled to a pillar plate of 87.57 mm (a new-old-stock listing).

There are three explanations, and each leads to a different model:

1. **The model's plan is about 12-13 % too small.** `L`, `PT`/`PHOTO_K`, the plate, the bridges and everything measured "at the plate's 87.57" would scale up, along with the dial, ring, case and box if their scale chains from the plate. FK would become 1.
2. **The drawings are right for their own parts and the model's layout is right too.** Then the drawn parts could not fit: a 41 mm fusee wheel and a 43 mm barrel side by side would collide at the model's Fu-Ba distance of 37.6 mm. This explanation has to be ruled out explicitly.
3. **The drawings are of a design (June 1941 onward) that differs from the production movements the videos show.** Against this: the memos run to 1943-46, and the part numbers are the manual's.

Tasks:

- 0.1 Look for an absolute size no video scale touches, to anchor the model: the manual's own dimensions (endshakes are relative, but any diameter in the text, tables or figures with a scale counts), the published dial and case sizes, the mainspring's 15.0 mm width (1-WD-265) against the barrel's inside height on side-on frames, and the key square (.110 in = 2.79 mm) against the key's own measured socket.
- 0.2 Re-measure, on the clearest face-on frame, the ratio of the fusee wheel's tips to the pillar plate's rim (`mfgfit.py`, measure-trace skill). Do the same for the barrel's outside. A camera-free ratio settles whether the plate or the wheel is out.
- 0.3 Re-read where 87.57 came from, and every size that chains from it (PROVENANCE.md's layout backbone).
- 0.4 Write the result in OPEN-QUESTIONS.md and PROVENANCE.md. Decide with the owner: rescale the whole Hamilton (explanation 1), or keep the layout and rebuild the parts only.

### What Phase 0 found so far (31 October 2026)

- **Three absolute sources agree with the drawings.** The British Museum's measured Model 21 (Randall and Good 1990, cat. 117A; OPEN-QUESTIONS.md 1) gives the barrel 38 mm inside, 15.3 internal height, the mainspring 15.0 high and the arbor 13 mm. The drawings give 38.10 (42168, 1.500 in), the spring .590 = 14.99 (1-WD-265) and the arbor collar .520 = 13.2 (42170). The manual's parts list gives the mainspring 0.0165 in (0.419) thick, which the videos' coil pitch reads as 0.375-0.394 on the plate's scale: the same 1.06-1.12 ratio. The museum's figures were set aside on 12 October 2026 as "excluded on these 1941 movements" only because the plate-scaled videos disagreed. Now the drawings side with the museum.
- **Single frames agree with the model, not the drawings.** On 13:52.0 (oq/wheels/NOTES.md, 12 October 2026) the third wheel's tips measure r 10.23 against the plate's face edge (r 43.785). The drawing's 80 teeth at module 0.28 give r ≈ 11.55: 1.13 again, inside one frame with no camera-chain error. So the video ratios are sound. Every plate-scaled size inherits the one absolute in the chain, the plate's 87.57 (a Cas-Ker sale listing; PROVENANCE.md, "The plate's absolute scale"), and that is what the drawings and the museum put in doubt.
- **The 40.87 mm behind FK is not independent.** It was the model's own fusee wheel in September (96 teeth × 0.4171, commit 7970409d), so its closeness to the drawing's 40.97 is chance.
- **Leading explanation: 1, the model's plan about 1.13 (1.11-1.15) too small.** That puts the plate near 99 mm, about 3.9 in. Against it: the Cas-Ker listing, and the video's Navy dial read as about 4 in on the 87.57 plate (it would become about 116 mm). Both need re-reading.
- **The plate's own size, found (31 October 2026).** The same British Museum entry (References/README.md, Randall and Good cat. 117A) measures the "front plate" at 97.8 mm and the "back plate" at 87.7, the dial ring's flange at 106.6 reduced to 97.7, and the frame 46.6 high. On 12 October 2026 the 87.7 was read as the pillar plate (matching the listing's 87.57). But the catalogue describes the back plate as the one on three pillars with the barrel's and fusee's cut-outs: the upper train bridge. So the pillar plate is 97.8, and 97.8 / 87.57 = **1.117**, the factor the drawings give (fusee wheel to centre 1.123, third to fourth 1.115, the third wheel's tips on 13:52 1.13). The model's train bridge rim, r 38.8 on the plate's scale, × 1.117 is 86.7 across against the museum's 87.7. The Cas-Ker listing's 87.57 × 3.86 is then most likely the upper train bridge, or a mismeasure. Explanation 1 holds: **rescale everything measured on the plate's scale by about 1.117.**
- **What the rescale must leave alone:** sizes that are absolute in their own right. These are the balance (its 29 mm rim read against the manual's 0.249 in impulse roller, and Table II's 1,140 g·mm²), the roller and jewels, anything from the manual's inches, the dial and case if their scale came from elsewhere (check each: the dial's 95 mm was read on the side photograph by the plate's edge, so it scales too, to about 106, beside the museum's 106.6 flange), and the escapement's figures in degrees. Before rescaling, list every constant by the ruler it was read with (PROVENANCE.md's "Frame" column and the rulers in its summary): plate-scaled ones × 1.117, absolute ones kept, and the joints between them checked (the balance against its cock and bridges, the escape wheel against the roller: the escape arbor's 9.40 becomes 10.5 if scaled, while the period text's planting rule gives 9.34 with a 13.16 wheel; the wheel's own size is then the question).
- **The owner's decisions on the rescale (31 October 2026):**
  - **One fitted factor.** Positions and plates scale by one factor fitted over every source. The places give the plate 1.117 (the museum), fusee wheel to centre 1.123 and third to fourth 1.115 (the drawings), the train bridge's rim 1.130 (the museum's back plate) and the flange 1.112 (the museum's 106.6). Their mean is **1.119**. The wheels' and barrel's own sizes read 1.13-1.15, but they are rebuilt from their drawings in Phase 2 anyway. So f = 1.12 is the working figure, to be refined by a least-squares fit over the classified P constants with their uncertainties.
  - **The escape arbor.** E keeps 9.40 from the balance (absolute through the 0.249 in roller) and turns about it until the fourth to escape distance is the drawing's 11.90 (75 : 10 at module 0.28): about 3.6° round. `TB_KEY` and the lower bridge's edge round the wheel are re-centred on it.
  - **The detent.** It scales with the plate. `escgolden.json` is rewritten (the owner's word given), followed by `tripping.js --write`, `bench.js --write` and the build report.
  - `RESCALE-CLASSIFICATION.md` (root) lists every constant's ruler and the joints. Note its FK trap: `literal*FK` sizes grow on their own once `L` scales.
- **Still to do before rescaling:** the balance against the plate in one frame (its rim, 29 mm, is absolute through the manual's 0.249 in impulse roller; PROVENANCE.md's suggested check, 34:08-34:16 or an assembled top view in which both show); the Cas-Ker listing re-read (is 87.57 the pillar plate, or another part?); the dial and case against published sizes; and the factor fitted over every drawn size at once (the train's centre distances, the wheels' tips, the barrel and ratchets), so `L`, `PT` and the heights scale by one number.

Phase 0 decides whether the rest of this plan is "replace the drawn parts" or "rescale the model, then replace the drawn parts". Nothing below starts until it is settled.

## Phase 1: transcription

Following the Wempe's practice (`References/wempe/transcriptions/`):

- 1.1 For each sheet, write `References/Hamilton-original-drawings/transcriptions/NNNNN.md` (committed, text only): every dimension with its tolerance in inches and in mm (×25.4, exact), every coordinate table, every note, the material, the finish, the revisions, and which numbers are hard to read on the scan (crops checked at 300 dpi). Number each item so the code can cite "42015 #7".
- 1.2 Add `js/hdims.js` (`HD`, as the Wempe's `WD`): the drawn sizes in mm, each with its drawing and item number, loaded before `movement.js` (after `core.js`; add it to `jsconfig.json` and `// @ts-check` it). The model reads its sizes from `HD` instead of constants measured on frames.
- 1.3 Coordinate tables are the outline's arc centres and tangent points (2.0000, 2.0000 the part's datum). Convert them into exact arcs (centre, radius, from-to), never a polyline. Write a small helper, `tools/hdraw.py`, that turns a transcription's table and radii into a closed line-and-arc outline, checks each arc's endpoints lie on its radius to 0.0002 in, and plots it beside a crop of the scan (`r_hd_NAME.png`, not committed) for review.

## Phase 2: the parts, group by group

Each part follows the same steps. First, read its PROVENANCE.md row and its RESOLVED.md section. Then build it from `HD`. Isolate it (`isolate.py`) beside a frame of a real Model 21 and the drawing's own plot, and record what agrees and what doesn't. Finally, update the row (source "D", Hamilton's drawing, a new key letter), the README's "Estimated" section (drop what is now drawn) and `bom.json` (material and finish).

When a drawing and a photograph or video disagree on a part the drawing draws, the drawing decides (the owner, 31 October 2026). Record the disagreement in Review-results.md.

Order, from the parts others depend on to the leaves:

1. **Train: fourth wheel and pinion** (42073, 42072). Module 0.28, OD 21.76, five crossings at 72°/75°, the wheel .035 in (0.89) thick, seated .100 up the pinion; the pinion's pivots .0311 (0.79), .0280 at the long end, leaves .1290 (3.28) over the tips, overall .940 (23.88). This sets `MOD.train` and `MOD.fourth` (Phase 0 decides whether `L` moves or the modules stay derived). It also touches `solve.py`, `gearing.js` (`gearing.json`), `traindyn.js`, `hamilton_transmission.js`, `thermal.js`, `fea.py`, and the escapement's centre distance through `L.E` (`escapement.js`, `escgolden.js` only if `L.E` moves).
2. **Fusee wheel and arbor** (42015, 42022). Module 0.44, 90 teeth, the recess and hub from the section, the .053 hole at .6100 radius (the sustaining spring's pin?), the arbor's 2.000 length, its bearings, knurl, collar and square .110. FK goes to 1 (or away). Touches `invariants.py` (the fusee's arithmetic), `maintaining.py`, `strength.js`, `overwind.js` (the fusee wheel's teeth on the wrong-way key) and `mechanisms.py`.
3. **Maintaining and winding work** (42009, 42010, 42007, 42013, 42016, 42096). The sustaining ratchet wheel's hole table puts the winding pawls' rivets (holes 2 and 7) and every hole exactly. The springs, pawls and ratchets are outlines from coordinate tables. Thicknesses: the ratchet wheel .050, the pawls .050, the sustaining spring .050 (the model's 0.96 × FK), the winding ratchet .075. Materials: the pawl springs beryllium copper, not steel, which `ratchets.js`, `sustaining.js` (its stiffness from the drawn section: SPU, MSK), `strength.js` and `wear.js` must take. Then `mechanisms.py --write`, `ratchets.js`, `sustaining.js`, `maintaining.py`, `fine.py`, `contacts.py --write`.
4. **Barrel, cap, arbor and the mainspring's end** (42168, 42169, 42170, 1-WD-265). Barrel bore 38.10, height 17.78, cap spigot and five .0340-130 screws, anchor rivet 42042, arbor 1.59 long with its .520 spiral collar and hook. The mainspring's width (15.0) and inner eye. `mainspring.py` must be re-solved with the drawn barrel (about 20 minutes on 14 processes), then `mainspring_friction.py`, `physics.js`, `drive.js`, `tolerances.js --write`, `bench.js --write` and `makers.py`. `TF` and the budget gap are noted in the memories; the owner keeps TF 67 s.
5. **Set-up** (42026, 42027, 42028). 40 teeth, not the model's 42, which re-opens the 42-tooth count read on 11:58, 12:19 and 38:28 (±2). The square .115 (2.92) is larger than the arbor's .110, since the hole clears the square. The pawl is the winding pawl's outline at .048 thick; the spring is the winding pawl spring's form.
6. **Fusee chain** (42001-42005). Pitch .0940 (2.388; the model's 2.19), 297 spaces (709.2 mm hook to hook, the model's length is solved from the groove), links .0095 (0.24) thick, the centre link's outline (four .0425 R arcs), the pins .024 × .045, and the hooks' outlines from their tables. The chain's length then fixes `ME` and the fusee's groove pitch, so this pairs with step 2 and with the fusee cone (not drawn here: keep its measured profile, scaled by Phase 0). Re-run `invariants.py` (17½ half turns), `maintaining.py`, `exploded.py` and `gltf_check.py` (the chain's links in the export).
7. **Detent** (42087-2-51A, 42087-1-52). Only the blank and its machining are drawn: 1.355 × .140 × .045, milled to .131 wide and ground to .041 thick, with the foot hole, slot, window and blade steps along it. The finished outline (42087-3-01) isn't in the set, so take from the blank the sizes it fixes (length, foot hole to slot .3947, blade steps, thickness .041) and keep the rest. This goes through `shared/escapement.js` (`escgolden.js --write` only with the owner's word, since the Hamilton's escapement fingerprint changes), `detent_overlay.py`, `tripping.js --write` (its pitch from the drawn thickness), `dynamics.js`, `bench.js --write` and the build report.
8. **42050 helical spring**: find its place (the key, the box's latch, the gimbal lock?). Look at Fig. 106's parts, the box and the key's photographs. Build it only when the place is known.

## Phase 3: everything downstream

- `bom.json`: materials and finishes from the drawings (beryllium copper springs, SAE 1095 setup ratchet, cast yellow brass barrel, Scovill #187 cap, 24K gold or nickel plate, oxidized black). Then `bom.py --md`, `makers.py` and `book.py`, and the maker's sheets citing the drawing numbers (`maker.js`), with no scans.
- `deviations.js`: the build's deviations re-read against the drawn materials. The beryllium copper springs may already be what a 1950s build would choose.
- Essay (`hamdata.js` via `essay_hamdata.py --write`), the build-verification report, `PROVENANCE.md`, the model README's Sources, and `References/README.md` (the drawings as a source).
- `CLAUDE.md`'s "Source of truth" line names the manual, photographs and videos. It should name Hamilton's drawings too, with their rank, once the owner decides (below).

## Checks and releases

Batch by group (memory: batch testing). After each group: `fine.py`, `solids.py`, `bom.py`, `holecheck.py`, `audit.py`, `exploded.py`, `overhaul.py`, `isolate.py` beside its references, then the group's physics tools above. Run `ci.py --full --views` once per batch and release a minor version (new geometry), with the README updated. Phase 0's rescale, if chosen, is its own release before any part.

## Decisions for the owner

- Phase 0: rescale the whole Hamilton, or rebuild the drawn parts inside the present layout (after 0.1-0.3 report).
- Rank: decided 31 October 2026. Hamilton's drawings outrank the photographs and videos for the parts they draw (CLAUDE.md, "Source of truth").
- The detent: rebuild from the blank's sizes now, or wait for 42087-3-01 (worth asking the NAWCC for it, and for the other drawings this set refers to; `REQUESTS.md`).
