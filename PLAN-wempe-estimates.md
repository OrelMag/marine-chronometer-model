# The Wempe's estimated and scaled readings: survey and plan

Branch `claude/wempe-estimates`. Started 16 October 2026.

## Status

- **Built (18 October 2026):** A (most of it) and B.1-B.3, B.6 on main 3.13.01; the rest waits on decisions or other branches: see "Where each item stands" below.
- **Done:** the survey. Six read-only passes over every item of the Wempe README's "Estimated, not from the drawings" section, against the sheets, about 330 photographs, the videos and the literature. The evidence is in the appendices below.
- **Ready to build (16 October 2026, evening).** `main` 3.03.00 (with claude/wempe-audit and claude/wempe-open-ends) is merged into this branch.
- **Don't wait for `claude/wempe-maintaining`.** marine-chronometer-76 stopped it before merging 3.02.00 and 3.03.00, and will reconcile with this branch when it resumes (its PLAN-wempe-maintaining.md). It is pushed (17adb95c) and clean.
- **Keep clear of what maintaining changes:**
  - in fusee.js: the maintaining work's block, update()'s first lines, the click seat (SEAT), fall(), the detent's step sizing;
  - in the README: Physics: energy (the maintaining spring), Motion, Readings corrected, Unresolved.

  A.13's detent arbor body (2.0) is the only item near those; do it last or leave it to maintaining.
- **First step on resuming:** re-read the Estimated section as 3.03.00 has it. Open-ends settled the key holder's height, the click's base 2.85, the upper cock's 3.2 and PHI0 −28°10'. Drop anything it already did, then build A, B, D in order.

dg-chrono's 1024 px scans are the largest that exist (checked 16 October 2026, `/images/…`: there is no larger original). So no "scaled on the sheet" reading improves by a better copy. The improvements come from photographs, video frames, other sheets of the same part and design arithmetic.

## Where each item stands (18 October 2026)

`main` 3.13.01 merged in (bfc51b02). Checked against main first: of A, main had done A.9's chain waist (3.06.01), dust plate recess (3.05.01), drum slot and lid notches (3.06.03); A.10's round lower setting (16 October 2026); A.11's key tube head (3.05.02). B and D were untouched on main. Built on this branch and checked (`--model wempe`: solids, fine, audit movement and box, holecheck, exploded, invariants, bom, tsc; every one passes):

- **A.1 closing plate: left to the claude/wempe-photo-inner session (the user's decision, 18 October 2026).** That branch rebuilds the closing plate's block in case.js for Wempe 3955 on the same photograph (16_Wempe_3955_Gehäusetopf_Kardan.jpg) A.1's mirror is read on.
- **A.2 dial: done.** The two small holes stay in the disc as drawn, under the printed face (Wempe 3955, Lange 5177 and Kirov 247 show none: checked on 1_Wempe_3955_Z.jpg at 9.14 px/mm). The pin stays as it was.
- **A.3 tongue: done, likely.** Traced again on 05 08_1b (circle fitted, 9.81 px/mm): the end's centre at 119.7°, r 7.74 (far point r 9.06); the sides 115.5/111.8° over their length but 118.4-120.5° over their outer halves. Built: axis 113.5°, 0.85 S, end r 9.0, 2.5 wide. The pocket's hull now closes through the tongue to its S corner, its edge meeting the tongue's N side as the sheet's dashed edge does (no sliver; solids pass).
- **A.4 pinions: done, likely**, by the escape pinion's sheet's cutter proportions (05 04_8: tip d + 1.28 m, root d − 3.93 m, head d + 1.89 m): intermediate 4.72/2.87, seconds 3.17/1.70 (the survey's 4.78/2.80 for the intermediate came from another rule). gearing.js --write: the train 0.780 tooth by tooth (0.749's rule kept in escphys.js: B.5). bench, Monte Carlo and wempe_6mx tables rewritten.
- **A.5 oil sinks: done** (Ø 4.55 to the bush's rim). **A.6 cannon square: done** (Ø 3.45; the crown's cells now start 0.6 under the top, since the sphere cuts the corners 0.55 down). **A.7 up-and-down wheel: flange done (7.7); hub not** (the sheet's 10.5 −0.2 excludes Wempe 3955's 10.85, and that version's wheel is being worked on in claude/wempe-photo-inner: recorded in the README). **A.8 hour wheel collar: done** (Ø 8.0).
- **A.9 barrel: hook block deferred to the one physics pass below; band hooks not done.** The sheets' 0.5 × ~6.5 block (and even 0.5 × 3) stands 1.2-4.3 mm³ into the solved mainspring's outer coil at full wind (fine.py): the spring's solve (mainspring.py's wall) has no block, so it needs a re-solve with one (and wempe_mainspring.py, physics, strength, essaydata after it). Recorded in fusee.js and the README. The band hooks (05 07 03-2, -3, fully dimensioned at 10:1) are a tracing job still to do.
- **A.10: done on main.**
- **A.11 case: done but A.1's part.** Outer pivots' heads Ø 12.5 (51 00 10, 05 01; the handle's sheet agrees); the 1940 key's handle and body brass (Wempe 6161); the transit lock brass on the drawings' brass case (6161; the 6MX's stays black on steel); the ring bracket's screws 35.5 apart. The bracket screws' brass on Wempe 3955 left to claude/wempe-photo-inner.
- **A.12 key holder: done (18 October 2026, the user's reading: a round fitting over the shelf's edge).** Measured on 51-00_1 (1.24-1.25 px/mm by the box's 185 and the gimbal ring): the circle Ø 19.5 ±1 (8 rim points, 0.4 px rms), centred 1.1 inside the triangle's long edge, 10.35 from the lines the triangle is drawn against (13.4-14.5 from the inner faces by the box's centre), two dots on the diagonal 11.9 apart; Lange VEB 2285 shows the key in a round black cup over its shelf's front edge. Built: the key's axis 14 from each wall; the shelf's edge 1.1 beyond it (legs 29.6), notched r 6; a black cup Ø 19.5 × 5 (height and finish estimated, Lange 2285's) bored Ø 11 for the key's cone (seat 65 over the floor, the paddle where it was); two screws 14 apart (the dots' 11.9 would put their heads over the bore), the outer ending in the cup. The paddle clears the walls by 0.74 (the 1940 key's by 0.57), measured on the page. bom.json: `Schluesselhalter.F`, `WN-kh`. The 6MX's shelf keeps its own form, its hole moved with KX.
- **A.13: intermediate bridge's sinks done (Ø 4.7); the detent arbor's 2.0 left to claude/wempe-maintaining.**
- **A.14 README: done** (the outline measured, the dust bush's flat, the impulse stone's hollow, the movement ring brass, the pillar's 8.1, face a's stack, the GUB barrel and C's result, the rough readings).
- **B.1 scatter and drift: done.** Calibrated on the eight cards (now transcribed in References/wempe/documents/6MX-figures.md, section 8; 09218, 20027, 22823 re-read): median E 0.225 and |R| 0.26 give 0.313 s a day and ±12.0 ms a day each day (not the survey's 0.28 and 25: those were guesses). The trial then gives median D 0.92, N 16.0, largest period mean 1.79, all within the cards' (a check, not fitted). As adjusted it passes 95.3 % (with the Hamilton's scatter it passed every trial at N 4.8). Voyage: 17.2 s after 30 days.
- **B.2 secondary error: done.** NBS Circular 58's 42-44.4 % quadratics (−3.4 to −2.51 × 10⁻⁹) with Dent's 2 s: S +0.74 to +0.89, inside the five passports' +0.80 ±0.17 (Dent's 3 s would give +1.9 to +2.0). A check in wempe_thermal.js.
- **B.3 masses' setting: done** (±0.45°: C's spread 0.060 against the cards' 0.062).
- **B.4 gold spring: not done, overlaps `claude/wempe-3955-banking`/`claude/wempe-photo-inner`**, which have just reweighed the detent and its gold spring (SET6 ID, wempe_inertia, bench_wempe.json). Density 11.6 and E 98 GPa change the same weights and tripping's frame: do it after they land.
- **B.5 train efficiency: deferred to the one physics pass below.** gearing.js now gives 0.780 with A.4's pinions (0.729 before them). Putting it in escphys.js's ETA moves every Wempe physics output (swing about +2°, essay, report, bench, tolerances, Monte Carlo, transmission) and the maintaining branch's SUS: best done with D, in one physics pass, telling the transmission and maintaining sessions.
- **B.6 regulation band: not adopted.** With ±2.5 s a day the trial fails a fifth on the period means; the cards' largest period means (0.81-1.90, three stated) come from C's residual and S with the regulation at ±0.5, which the model then reproduces (1.79). Kept ±0.5, recorded.
- **D lock re-laid: deferred to the one physics pass below (the user's decision, 18 October 2026).** Its open points (the detent-as-drawn tolerance, 3.85 µm against 3, or the layout's turn re-fitted; the ~8° of swing) are settled there.

## The one physics pass (the user's decision, 18 October 2026)

D, B.5 and A.9's hook block change the Wempe's physics together, so they are built in one pass, **after `claude/wempe-3955-banking` lands on main** (it reweighs the detent and gold spring and changes escapement.js; B.4, the gold spring's 11.6 g/cm³ and 98 GPa, goes in the same pass once it has landed). The coordinator merges main into this branch first (after `claude/wempe-maintaining` lands), so start from that merge. In order:

1. **The hook block (A.9): done on `claude/wempe-unbuilt` (18 October 2026), with the Steg; the spring re-solved there (`wempe_mainspring.py --final`, its fit and friction), so the pass starts at 2.** Was: Draw 05 07 01-3 as the sheets give it (0.5 deep from the bore, about 6.5 long round it, its face curved with the bore, 3.05 high, 9.05 from the bottom's face, 45° from 9 o'clock; 020701's first-drawn barrel the same). Give mainspring.py's wall the block (the spring's outer end hooked on it, its coils over it) and re-solve the Wempe's spring: `wempe_mainspring.py --solve 1240 --set 0.6` (about 12 min on 14 processes), then `--final`, `--friction`, no-option fit; check fine.py shows no overlap of the block and the spring at full wind; the Hamilton's mainspring tables unchanged (run mainspring.py with no env against its own).
2. **B.4 the gold spring** (if 3955-banking has landed): density 11.6, E 98 GPa in wempe-inertia.js, wempe_tripping.js and WESC.SET; `wempe_inertia.py --write` (and the 6MX's table by hand: memory note "Wempe 6MX inertia unchecked").
3. **D the lock.** Work it out in Node first with makeEsc's settings (no edit): P_R 7.14, P_A aB+37.0 (lock 0.235), the detent's lift and the discharge reach together so the detent still unlocks with room; decide the detent-as-drawn tolerance or re-fit the layout's turn, and lower the guard band's floor to 14° under the new reference swing (the user's decision of 16 October), saying why in the README. Then edit escapement.js.
4. **B.5 the train's efficiency.** ETA in escphys.js from gearing.js's tooth-by-tooth result (0.780 with A.4's pinions); keep ETA_LO/ETA_HI as the range.
5. **Rerun, in order:** `wempe_escapement.js`; `dynamics.js --model wempe`; `tripping.js --model wempe` (and `--write` where it writes); `wempe_physics.js`, `wempe_strength.js`; `gearing.js --model wempe --write`; `wempe_tolerances.js --write`, `wempe_bench.js --write`, `wempe_montecarlo.js --write`; `keystone.js --model wempe --write`; `wempe_6mx.js --write`; `wempe_startup.js --json wempe_startup.json` (TF's fit); `wempe_transmission.js` and `wempe_transmission_trace.js`; `wempe_errorbudget.js`, `wempe_essaydata.js --write`; the geometry checks (solids, fine, audit, holecheck, exploded, bom, smoke, `--model wempe`, all five versions); the Wempe report (`reportdata.js`, `geometry.py`, `build_report.py`); `python build.py --site-url https://www.marinechronometermodel.com`.
6. Tell the sessions on `claude/wempe-transmission` and `claude/wempe-maintaining` (if still open) that ETA, the lock and the mainspring changed.

## The user's decisions (16 October 2026)

- **Build all four groups**, A to D below.
- **The detent's level:** keep the 1946 heights. Note in the README that every photographed movement (Wempe 3955, Kirov 92, the 6MX in `1_3_Vergleich…Feder.jpg`) has the escape wheel within about 0.5 mm of the top plate, the 1941-43 level, and that no post-1946 Wempe is photographed.
- **Base:** wait for the other Wempe branches to merge, then build on `main`.
- **The lock (later, 16 October 2026):** adopt 7.14 and 37.0° (lock 0.235). Lower the guard band's floor to 14° under the new reference swing, as it was set before, and say why in the README.
- **Merging:** the user asked me to merge the waiting branches myself if nobody else is. Their owners are doing it:
  - `claude/wempe-audit` is on main (3.01.00).
  - `claude/wempe-maintaining` (marine-chronometer-76) is mid-merge of 3.01.00, then a full ci.py and a patch release. Expected about 1.5 h after 17:00; it will message when it lands.
  - `claude/wempe-open-ends` belongs to marine-chronometer-bf (asked; its worktree, wempe-release3, is mid-merge of 3.01.00).

  Keep out of both worktrees. Build after both land.
- **Rough readings:** record them, don't adopt them. That covers the pillar plate at 3.40, the intermediate bridge's pins at 4.5, the box rim's lining lip, the WN-21 heads, the box floor at 14.5 and the glass at Ø 116. Each goes into the README's Estimated with its evidence; the model keeps today's values.

## Groups, in build order

### A. Geometry, sure or likely

Run `isolate.py` against the reference for each part, then the geometry checks: solids, fine, audit, exploded, bom, holecheck, `--model wempe`.

1. **Closing plate (case.js):** mirrored, and it shuts the wrong way. Change `tk=t8+π/2` and `CPS` to −30°, then check `shutter()`. Mirror sure, angle likely (Case appendix, 1).
2. **Dial (dial.js):** remove the two Ø 1 holes through the printed face at 6° and 185.7° (`PINa`, `SMa`). Keep the pin under the dial as a foot or in a blind hole. Sure (Train/dial appendix, 1).
3. **Balance opening's tongue (frame.js:55-61):**
   - axis 112-114°, 0.6-1.1 south of the centre;
   - width 2.5, tip r 9.0;
   - "50°" read from the pocket's south edge.
   Likely (Frame appendix, 1).
4. **Intermediate and seconds pinions (train.js):**
   - seconds: tip 3.17, root 1.71;
   - intermediate: tip 4.78, root 2.80.
   The sheets' 5.0 and 3.4 are the turned heads (05 04_8). Then `gearing.js --model wempe --write`, `wempe_physics.js`. Likely (Train/dial appendix, 2).
5. **Top plate's oil sinks:** Ø 4.55, running out to the bush with no flat. Sure on the flat, likely on the size.
6. **Cannon tube square:** corners at Ø 3.45.
7. **Up-and-down wheel:** flange 7.7, hub 10.85.
8. **Hour wheel collar:** Ø 8.0.
9. **Barrel (fusee.js):**
   - hook block radial 0.5 (sure) and about 6.5 long (likely);
   - chain plates' waist 1.4 with concave flanks r about 0.9;
   - dust plate's recess on the outer face;
   - band hooks rebuilt from 05 07 03-2 and -3's figures;
   - the drum's spring slot and the lid's notches cut (drawn, not estimates).
10. **Escape wheel's lower jewel (escapement.js):** a round setting Ø 5 with two M1.2 screws 3.5 either side, as the upper. It replaces the oblong cap. Check 05 08 02-1 at hole 26. Likely.
11. **Case:**
    - outer pivots WN-80: heads Ø 12.5;
    - the key's tube head 8.2 under the body's top, its grooved pin across the body;
    - the 1940 key's handle and collar brass (Wempe 6161);
    - the transit lock brass on the brass case (one photograph, likely);
    - the ring bracket's screws 35.5 apart.
12. **Key holder:** the box's plan 51-00_1 draws it, a triangular corner piece with legs 22.5 and the key 12 from each wall. Open-ends' owner (marine-chronometer-bf) agrees the drawing outranks its 16.5. Two checks:
    - **the walls:** at 12, the paddle (Ø 34.5, facing the box's middle) reaches x 80.2 against the inner wall's 80. Turn the paddle, or check whether the drawing's 12 is to another point: its circle Ø ~18.5 is the 1940 key's collar;
    - **the gimbal ring:** at 21 the raised key's body met the ring after 9.5°; 12 is further out. Confirm with `massprops.py --model wempe` (no stop).

    Keep the shelf's top at 65 (the paddle 22.3 over the rim, from Greenwich's photograph).
13. **Smaller:**
    - the maintaining detent's arbor body 2.0 (keeping 2.25 at the click's seat);
    - the intermediate bridge's screw sinks Ø 4.7 (measured).
14. **README:**
    - mark as measured: the intermediate bridge's outline (45.7 × 9.75), the dust bush's flat, the impulse stone's hollow (drawn on 05 04_1's plan), the hour wheel's collar (05 02_1);
    - the movement ring is brass;
    - add the radial pin WN-202 and the pillar's Ø 8.1 to Estimated;
    - correct the dial pin's Ø 1.1 and the glass's 16.7;
    - record the face-a stack;
    - record the GUB barrel video;
    - record what was searched for each kept item.

### B. Physics from the 6MX test cards

There are eight attestats and passports in `References/wempe/photos/dg-chrono-6mx-gallery/bilder-zum-6mx/` (Physics appendix).

1. **`wempe_errorbudget.js`:** scatter σ about 0.28 s a day and drift sd about 0.025 s a day per day, against the Hamilton's 0.042 and 2.66 ms. Check that the TU trial reproduces the cards: E 0.12-0.31, D 0.58-1.29, N 12-16.
2. **The secondary error:** take Guillaume's nickel-steel table (NBS Circular 58, 1923, Tables 5 and 13) into `wempe_thermal.js`, with Dent's error about 2.0 s. Check against the cards' S, +0.76 ± 0.26.
3. **The masses' setting:** ±0.45° (`SET0`), against the cards' adjusted C sd 0.060.
4. **The gold spring:** Au/Ag/Cu 333-333 (Poljot 20027's passport), density 11.6, E about 98 GPa.
5. **The train's efficiency:** gearing.js's tooth-by-tooth 0.729 into `escphys.js` `ETA`. Redo it after A.4's pinions.
6. **The regulation band:** ±2.5 s a day, from the cards' period means.

Then the Wempe physics tools in their order (`wempe_escapement.js`, dynamics and tripping `--model wempe`, the build checks with `--write`), `wempe_essaydata.js --write` and the Wempe verification report.

Tell the session on `claude/wempe-transmission` (marine-chronometer-03 [55745f]) when ETA, the gold spring or the mainspring change.

### C. The mainspring's length

The GUB 12255 barrel, opened and let down (UG44DSWMv3o 0:26 and 5:56, 4K, 19.7-20.8 px/mm on the 38.5 bore), holds about 13 coils on the wall at 0.40 and about 3 free turns, which puts the length at about 1,530 (1,360-1,700, rough). The GUB is post-war, so its spring may be a replacement.

The model's own solves don't support the survey's "1/L closes the gap". The level (measured over solved) is 0.802 at 1,240 mm and 0.824 at 1,360 (both set 0.6-0.7): it moves with the set, hardly with the length. The shape fit gets worse beyond 1,250. Two solves at 1,530 (set 0.6, 0.7) were run on 16 October 2026 to confirm; their result is under C's result below. Adopt a new length only if both the shape and the level are better. Otherwise record the GUB reading and keep 1,240.

The physics survey's second point: `mainspring.py` bends the strip as a beam, where a strip this wide bends as a plate (E/(1−ν²), Searle and Ashwell's criterion). That would widen the gap to 36 %. It is a shared tool, so it would change the Hamilton's too. Verify the citation before anything else; don't change it on this branch.

### D. The lock re-laid

On 05 04_1, against the wheel's tip circle Ø 14.00 (24.47 px/mm, checked by the impulse roller's 6.77 against 6.78), the locking stone is 7.14 ± 0.04 from the wheel and at 37.0 ± 0.3°, against the model's 7.2 and 36.5°. The drawn lock is then 0.235 ± 0.04, and the sheet's 86° check comes out 86.07 (the model's 85.40).

Re-lay the lock, the detent's lift (0.245 now) and the discharge stone's reach (about 1.55-1.6 on the sheet) together, so the detent still unlocks with room. Then rerun everything in B's last paragraph, plus the bench window (0.143-0.188) and `wempe_tolerances.js`. Work it out first in Node with makeEsc's settings, without editing; then build.

**Dry run (16 October 2026).** `wempe_escapement.js` was run on a throwaway copy of `claude/wempe-open-ends`, with `P_R` and `P_A` in the Wempe's escapement.js changed. `RD`, the discharge reach, follows the depth of lock by itself (`DEPTH+0.07`).

| stone | lock (balance) | let-off | swing over the wind | roller shake | result |
|---|---|---|---|---|---|
| 7.2, 36.5° (as built) | 9.9° | 1.9° | 191.9-202.0° | 0.046 | passes |
| 7.2, 37.0° | 9.9° | 1.9° | 192.2-202.3° | 0.011 | passes |
| 7.14, 36.5° | 12.8° | 1.5° | 183.6-194.1° | 0.046 | fails: the 185° floor, and the detent as drawn 3.85 µm against 3 |
| 7.14, 37.0° | 12.9° | 1.5° | 184.1-194.5° | 0.011 | fails, as the row above |

- **The angle** is free, but the roller shake falls to 0.011 mm, so check the teeth's clearance to the impulse roller.
- **The distance** costs about 8° of swing through the deeper lock (0.235 against 0.175). That moves the swing further from the sources' 225-270°, a gap tied to the drive's level (C) and to TF.
- **Building D therefore means also deciding:**
  - the guard band's floor;
  - the detent-as-drawn tolerance, or the layout's turn re-fitted;
  - whether the drawn lock really is that deep. A tooth reaching 0.19-0.24 into the stone on the sheet is a drawing, not a made figure; the bench sets it by the banking.

Put this to the user before building.

**New Soviet sources (16 October 2026, branch `claude/wempe-sources-2`, unmerged; References/wempe/photos/catalogue-2026-10-16.md).**

Belyakov, *Часовые механизмы* (1957), Table 3, p. 104, gives the MX-2's design figures with Lange's MX in brackets:
- the linear lock 0.210 (0.22);
- the discharge circle r 1.54 (1.55);
- the wheel Ø 13.96 (14), its undercut 23° (25°);
- the detent 26.50 (26.8), the gold spring 0.05 (0.06).

Caution: his radii don't fit either model's centre distance yet.

The Navy's 1958 repair book, p. 60, sets the lock at 0.20-0.25 on the stone and the gold spring 0.35-0.40 past the detent's end. So the made lock sits near the 0.235 read on 05 04_1, not the model's 0.175. That supports adopting 7.14 and then dealing with the swing; D's dry-run decision should weigh these.

The same book, p. 58, also gives figures for B and C:
- the barrel's torque fully wound, 103-110 kgf·mm (1.01-1.08 N·m), against the solved spring's 0.935 at full wind;
- the hairspring 502.35 mm;
- the train 90/14, 480 to the escape pinion.

Appendix 4 (pp. 128-129) gives every arbor's side shake and endshake, for A's endshake and the pillar plate's 3.40.

Tarasov (1976) and Romanov (1975) describe a later, redesigned 6MX (16 teeth, 75/10): not this one's sizes. Kirova No. 14100 taken apart (chasy.ru 9985, photos/chasy-ru-9985-kirova-14100/) shows the block with its banking screw and the detent with its gold spring.

## C's result (16 October 2026)

`wempe_mainspring.py --solve 1530 --set 0.6` and `--set 0.7` (7 processes each, about 30 min):

| L, set | shape against 05 06_20 (rms, worst) | measured over solved |
|---|---|---|
| 1,240, 0.6 (the model's) | 1.07 %, 2.00 % | 0.802 |
| 1,530, 0.6 | 3.90 %, 9.73 % | 0.753 |
| 1,530, 0.7 | 3.29 %, 8.27 % | 0.802 |

The longer spring fits the measured curve three times worse and doesn't raise the level. The fit's least rms, with them added, is L 1,222 at set ×0.619 (1.48 %).

**Keep 1,240.** Record in the README that GUB 12255's let-down barrel suggests about 1,530 mm (a post-war movement, perhaps a replacement spring) and that solved at that length it fits 05 06_20 worse. The 25 % gap isn't the length's. The 1958 repair book's 1.01-1.08 N·m fully wound (above) is more than the solved spring's 0.935, so the gap may lie in 05 06_20's lever or rig, not the spring. Weigh that when the sources branch lands.

The two solved tables are not committed: the fit's JSON feeds wempe_physics, strength, bench, essaydata and the report, so committing them is a build step. They sit in the scratchpad (survey/fusee/mainspring_wempe_L1530_s0.6.js, _s0.7.js) and can be re-solved in about 30 min.

## Appendices: the survey's evidence, area by area

### Frame survey (agent report, 16 Oct 2026). img/, scripts/ here.
1. Balance opening's tongue (frame.js:55-61) wrong direction: model axis root r5@122.25 -> end centre r7.35@112.5 (bearing 93 deg, 2.4 S of centre, tip r8.54). 05 08_1b traced (circle 9.80 px/mm): sides 115.5 and 111.8 deg, width 2.3-2.5 ("2,5"), tip r9.0 ~116 deg; "50 deg" = from pocket's dashed S edge (67.8) to slot side (~118). 3955 12_..obere_Platte_oben homography 8 holes (11.43 px/mm, res .1-.3): axis ~110, 1.1 S of centre, 2.85+-.2 wide, tip r9.2. Mouth (105, 140) matches. Propose axis 112-114+-4, 0.6-1.1 S of centre, w 2.5, tip r9.0+-.3. Likely. Change tg0/tgE, re-solve pocket tangent.
2. Pillar plate 3.40 not 3.35 (dims.js:32), rough: seconds arbor 24.1-0.1 (rev 24.3.48 from 24-0.05); jewel 1.7 -> endshake -0.05..+0.05 at 3.35 (binds; model hides with jewel 1.75); at 3.40 0..0.10, jewel back to 1.7. Intermediate 0-.12 / .05-.17. Against: coloured section pillar plate ~0.1 thinner than top (31 vs 32-33 px at 9.26). Plate 0.40 proud of ring.
3. Intermediate bridge steady pins ~4.5 long (1.3 proud, ~3.2 in), blind holes ~3.2 (05 08 04 section) vs 3.0/2.5 (rough); barrel bridge's agrees with 3.0 (~2.65). Screw counterbore 4.35x2.2 vs 4.4x2.0.
4. Intermediate bridge outline confirmed: 3_Wempe_3955_uZ holes 3,12,40,30,18,26 (8.6 px/mm, top face 3.7 higher 1.1% corr): 45.7+-.3 x 9.75+-.15 semicircular; sink edge D4.7+-.1 (model 4.4). README: measured (likely).
5. Dust bush flat confirmed (2_Wempe_3955_A): normal ~256+-5 vs 255: "sure".
6. Movement ring brass (coloured section yellow; GUB gilt; 3955 silver finish). Weighing already 8.45: README wording.
Kept: screw heads (2_A: pillar 6.43, 6.46; barrel bridge 6.39, 6.47; upper cock 6.32; click 4.35; ring ~6.2, inner 1.1 under top plate rim); ring screws bearing unresolved; click beak ~20.3 at ratchet root (in 23.3+-3); upper cock relief, countersinks, grooves, ring lip, finishes, small: nothing better. Cork: 3955 has none (collar + bare neck on 2_A). Bowl seat: GUB ZEc91vwppVk 0:08, 0:46 ring round hole, unfocused; aQmO0UtXs24 9:16-9:25 (2160p, empty bowl) not downloaded - could measure.
Branches: open-ends click base 2.85 ("5,7" a circle), beak end face 85 (main 2.81); upper cock "3,2" stock relieved to 2.4. All branch READMEs predate main's 16 Oct hand-setting entry (6mx, open-ends say 14-18 not built): keep main's on merge.
Not in README: frame.js:146-148 radial pin WN-202 (9.7 long, hole across flange not cut); dims.js:35 pillar D8.1 "likely".
Dials (from train survey): brass radial pin in ring rim near 12 (3955 ~5.3 deg r52.0; 5177 ~0-2).

### Train/dial survey (agent report, 16 Oct 2026). img/, tools/, frames/ here.
Scales: 1_Wempe_3955_Z 9.14 px/mm (minute track outer 45.18 vs 45.156, centre 522.95,490.75); 1_Lange_5177_Z 8.83; 3_Wempe_3955_uZ 8.45+-1% (motion work 3-9 above plate); 12_..obere_Platte_oben 11.52 (bushes 1,38,35 vs 18.12, 23.0, 12.63); 3_1_Auf-_und_Ab_Wempe rectified tips 34.33 (root 32.53-32.62 vs 32.57, rim inside 28.36 vs 28.2+0.2).
1. Dial has no holes at 6 deg and 185.7 deg: dial.js cuts two D1 at r50.5 (PINa, SMa); neither 3955 nor Lange 5177 shows any (screw sinks at same radius ~16 px resolved; D1 would be ~9 px). Sure. Leave face whole; pin as foot/blind hole (likely).
2. Pinions: 05 04_8 (escape pinion 10 leaves) separates turned head 3.13 (1.19 x pd) from cut tip 2.97 (1.129 x pd), root 1.6. Train sheets' scaled 5.0-5.2/3.36-3.57 = 1.17-1.22 x pd = turned heads. Propose seconds tip 3.17+-.07 root 1.71+-.05; intermediate tip 4.78+-.12 root 2.80+-.06 (likely). Meshes ok (recess carries 33.2/36 deg (80/10), 30.1/30 (90/12)); tip-root clearance 0.15-0.19 -> 0.26-0.30. Rerun gearing.js --model wempe --write, wempe_physics.js.
3. Hour wheel collar: keep 3.585; basis: 05 02_1 (1941 arrangement) draws collar 3.7-4.0 over wheel lower face, 0.3-0.4 under dial, wheel 2.44 over plate. Diameter 8.0 (05 02 03 7.95-8.2; uZ 8.01 rms .03) vs 7.9. Transcription "collar ~6.1" misread.
4. Top plate oil sinks: D4.55+-0.15 to bush rim, no flat (12_: 4.69, 4.46, 4.60 at 1, 38, 35) vs 4.0x1.2 (train.js sk.rs ~2.28). Sure no flat; depth estimated.
5. Cannon square corners D3.45+-0.1 (1_Z sides 2.60-2.67, half-diag 1.72-1.77; uZ half-diag .652 of side) vs 3.2. Likely.
6. Up-and-down wheel: flange 7.7+-.15 (uZ 7.71) vs 7.4; hub 10.85+-.1 (uZ 10.77, 3_1 10.92) vs 10.4 (sheet 10.5-0.2). Step 2.97, seat end 2.0-2.1 confirm 2.8, 2.2.
7. README fixes: dial pin "D1.6 in ring" -> code D1.1 since 15 Oct; glass 17.0 superseded by 16.7; open-ends Estimated still old riveting collar (0.2, hub 1.45) though Closed says seat 1.55 collar 0.255; audit rewrites seconds jewel setting form (main README still "closed to D1.1").
Keep: tapers unreadable (05 05_5,_7,_8,_10); pivot lengths; 1.75; bores; WN-302 cup; seconds jewel open recess confirmed (mouth ~3.5-3.8); studs dome 1.29; crown; finishes (8_); change wheel collar 5.43, pipe 2.96 (keep 5.5, 3.05); up-down pinion 4.0/2.4 (measured 4.2/2.6 can't fit 18.4); cannon pinion 5.86 (5.61 if turned head, unclear); hand outlines; dial screw heads 1.76-1.80; hands' heights unresolved (3955 hands 47.3/35.8 vs Lange sheet lengths 46.4/35.1; 3955 minute tip 2.1 past track vs model 0.8); Lange dial keep Wempe blank (Lange 1453/A covers 5635-6250); printing, collet, 10.2 keep.
For frame/case: both dials show brass radial pin in ring rim near 12 (3955 ~5.3 deg r52.0; 5177 ~0-2 deg).
Not downloaded: aQmO0UtXs24 (GUB, dial side).

### Fusee/barrel survey (agent report, 16 Oct 2026)
1. Mainspring length: GUB 12255 UG44DSWMv3o 0:26/5:56 (4K, barrel open, let down, 19.7-20.8 px/mm on the 38.5 bore): ~13+-1.5 coils packed at 0.40+-0.03 pitch + ~3 free turns (r 6.1, 9.6, 12.2) -> L ~1,530 (1,360-1,700), rough-likely, vs model 1,240+-50. 1240/1530=0.81 ~ the 0.802 torque gap. Fits: 56% of annulus, ~7.8 turns room vs 5.85. Caveat: post-war GUB, spring may be replacement. Next: solve L 1450-1600 (wempe_mainspring.py --solve, ~12 min each).
2. Let-down shape: page all-on-wall 11.9 turns; GUB 13 wall + 3 free: check of the x0.6 set.
3. Hook block 05 07 01-3: radial 0.5 (0.4-0.5, sure; 05 07 01 "2,05 -0,1" over wall 1.55; 020701 "2" over 1.5) vs 0.35; length ~6.5+-1 (7.3/6.3/5.9 scaled) vs 3.0 (the "3" is the height on 020701).
4. Chain plate waist 1.4+-0.07 with concave flanks r~0.9 (05 07 04 at 16.6 px/mm, waist/lobe 0.70-0.72) vs flat 1.2.
5. Dust plate 05 06 00-1 recess on the OUTER face (coloured section: 3.1 thick, recess 6.1 x 0.93) vs model toward plates.
6. Band hooks 05 07 03-2/-3 fully dimensioned at 10:1 (35.5 px/mm): rebuild from figures.
7. Drawn features left out: drum spring slot (2+0.05 x 0.95+0.15 at 9 o'clock), lid notches (2+0.05 to r18.3 at 9; 2.7x2 at 3), floor relief 0.8+0.05.
8. WN-21 heads ~2.2+-0.15 x 0.75 (rough) vs 2.6x0.5 (hidden).
9. Maintaining detent arbor body 2.0+-0.1 (coloured section) vs 2.25.
Keep: face a 1.0 (stack: cover plate only 0.085 under J-K recess, so face a <=1.085 - record), tube/bore, height 14.8 (stack 14.80-15.25), band 0.78, stack gaps, stop work, cover screw, Vorreiber pin, set-up teeth, finishes.
Already on branches: audit: pitch 1.2, lands 0.87, chain hooks 0.80 (main has 1.15/0.82). maintaining: pins, eye. open-ends: step, ratchet teeth.
Lead: coloured section steel rod inside drum along left wall (orig px x~210-215, y 335-500) - maybe "Steg 05 07 00-1" + WN-203.
New videos fetched to E:\mc-video: UG44DSWMv3o (GUB Teil 4, 2160p), pbL64JZ-LGM (Teil 3, 1080p).

### Escapement survey (agent report, 16 Oct 2026). Crops c_*.png, py/*.py here.
1. Escape wheel's lower jewel: no oblong cap (model: endstone cap 9.4x3x0.6 dial side). Kirov 422 (3_Kirow_DEC_422_uZ.jpg, 8.81 px/mm): round setting D5.2+-0.2 flush, two slotted M1.2 screws 3.5 either side, heads ~D2.5 over its edge. Wempe 3955 (3_Wempe_3955_uZ.jpg): setting D4.9+-0.3, two holes, no heads. Build as the model's upper setting (likely); seat D~5 at hole 26 dial face; check 05 08 02-1 ("reamed 2.50").
2. Locking stone distance: 05 04_1 re-scaled on tip circle D14.00 (4 tips, 24.47 px/mm; impulse roller 6.77 vs written 6.78 checks): stone 7.14+-0.04 (model 7.2), drawn lock 0.235+-0.04 (likely; tooth overlaps stone 0.19-0.24). Model lift 0.245 then leaves no unlock room; bench window 0.143-0.188. High effort (lock, discharge reach, lift, all physics).
3. Locking stone angle: 37.0+-0.3 (25.68, 23.8, 18.8 with blade square to radius -> 36.98+-0.12; stone fit 37.3; transcription 36.96) vs 36.5. "86 deg" check 86.07 (model 85.40). Run to lock 2.5 vs sheet's 2. With item 2.
4. Detent level: on 6MXs the escape wheel's top within ~0.3-0.8 of top plate inner face (Kirov 92 0.8+-0.3; 1_3_Vergleich...Feder.jpg <0.5); Wempe 3955 (1941) same. Model's 1946 heights put it 1.89 under (would be 26-39 px). All photographed movements at 1941-43 level (first-angle block, 1436, 05 04_1 agree). No post-1946 Wempe photographed. User choice: keep 1946 or raise ~1.4 with first-angle block. Only 05 04 02 and 05 03_5 argue against.
5. Escape collet: photos one cone ~D3.0 to 1.2-1.45 over 5.0-5.3 (3955, Kirov 92, 1_3; +-10%); 05 04_7.2 (1943) stepped D2.8/1.7 to 4.7. Keep sheet, note photos. First-drawn 05 04_7.1: 5.0 length, D3.0 top agree with 3955, its D1.8 pipe doesn't.
6. Impulse stone hollow: drawn on 05 04_1 plan (hollow ~3.7 long, ~2.0 on tooth's side): README "drawn (likely)".
Keep: block turn (18.8 is banking screw's place; 1941 block screw 1.22 from hole 13, block re-placed 1943); gold spring tip 1.62+-0.08; discharge reach ~1.55-1.6 (README says sheet 1.7-1.75); discharge roller round far end, nearly square stone end (3955 1941 roller rectangular rough); impulse roller silver-coloured on 3955 (not BeCu bronze); "5 deg" spans 22d10' to 17d10' before line of centres; hub screws from under supported; masses, weights, curves, stud, staff ends, bevel, 13 turns: nothing new. First-drawn block arm ~2.7 vs 2.5 on 11_ (rough).
Searched without result: discharge stone corner, gold spring tip free, hairspring outer curve, post-1946 side photo, book Figs 5.61-5.62.

### Case/box survey (agent report, 16 Oct 2026). Crops/grids: case/crops (grid.py).
1. Closing plate mirrored + shuts wrong way: 05 01 00-2 plan = inner grooved face (D1.2 solid, blind from groove side). Wempe 3955 upturned bowl (16_Wempe_3955_Gehäusetopf_Kardan.jpg) agrees: knob (M2.6 at 25) 90 deg CW of the D8 seen from dial side (3 o'clock/ring-bracket side). case.js tk=t8-PI/2 (CCW, 9 side). Shut: D8 30+-5 deg CW (toward 12) of winding hole; model CPS 25 deg CCW. Measure: plate ellipse c(520,289) 227.5x186.5, D8 at (462.5,167.5)=248.8 deg; 12-6 line from 6-pivot head (820,792) through (520,475), ratio .84, 12 at 231.5; brackets 50 and 86.5 from 6 pivot (drawn 50, 90). Mirror sure, angle likely. Fix t8+PI/2, CPS -30, check shutter().
2. Key holder IS drawn: 127-556. A-1 (51-00_1 plan), 1.243 px/mm by box 185: triangular corner piece back right, legs 22.5+-1.6, key axis 12+-1.5 from each wall (main: legs 55, hole 21; open-ends 16.5). Circle D~18.5 + dot 5.6 off: 1940 key collar (D20.5) + screw (5.3), rough. Coordinate with open-ends.
3. Outer pivots WN-80: heads D12.5+-0.5 not 9 (51 00 10 front 29 px at 2.31-2.36 px/mm; 05 01 elev 12.7); height 5+-1.5 rough (7.2 w/ slot on 51 00 10, 4.1 on 05 01); end turned to D~4.4 for ~7.6 past collar D~8 at wall inner face (rough); model plain M6.
4. Key tube head 8.2+-0.4 under body top not 6.8 (51 00 11 section 6.93 px/mm; end 33.0 out: 50.1-(25.1+33)=8.0). Spring pitch .94 (0.9 wire ok), ~12.5 turns drawn (model 13.7). Grooved pin spans body width (~14.5-16), ends showing (model 13, hidden). KEYREST/keyAt move 1.4.
5. 1940 key: brass pear handle (D~35.6) and collar w/ screw on Wempe 6161 (antiquorum_208-4 crop 2350-3050 x 2200-2900); model black. Sure brass.
6. Box rim lining lip: Lange 1947 (drouot_33810142_lange1947_2, 4.75 px/mm): wall top two steps, outer 7.4-8, inner strip 4.4-4.6; Wempe 4585 open lid rebate. Height unreadable. Likely, medium.
7. Transit lock brass on brass case (6161: knurled knob, hub, lever brass; neck D~3.7 knob to hub D~9.2). Model black/steel; 5377, 4585 black. Likely, one photo.
8. Ring top level with bowl top: keep, reword basis (1940 bowl top on pivots' line +-1, 54.3 deep; R-05 01 00-1 65 = 53+12 flange -> flange top ~11.5-12 over pivots; A-1 1942 case top 25.7-27.2 over pivots (model 27.5), foot 52-55 under (53.5)).
Others: keep bowl machining; 350 g keep + cite Antiquorum Wempe 8711 "bakelite bowl with weighting ring", Christie's Wempe 4824 "black composition bowl with steel gimbal"; glass keep (6161 rim ~4.6 -> glass ~D116+-2 rough); ring keep (05 01 23.7 high, 3.4-3.8 thick); ring bracket screws 35.5+-0.8 apart (+-13.4 deg) vs 37.2, brass slotted on 3955; inner pivot heads brass on 3955 (D~6.5); discs keep (23.3x2.0); case brackets keep (43.9, screws 30.6 apart); transit lock heights keep main's; closing knob D5.2 keep; 3955 boss hole on knob's line r~11 likely the D1.2 drilled through; floor A-1 ~14.5+-2 rough; lid opening ~144 keep; outer box keep (strap maybe tan, Lange 2285_6); maker's plate keep (4585 ~45+-5); 1943 paddle black keep.

### Physics survey (agent report, 16 Oct 2026)
KEY: eight 6MX test cards (attestats/passports) in References/wempe/photos/dg-chrono-6mx-gallery/bilder-zum-6mx/ unused: 13-16_Kirow_1564_Attestat_*, 1_2/1_3_Kirow_308, 2_2/2_3_Kirow_707, 5_1/5_2_Poljot_09218, 4_1/4_2_Kirow_22823, 6_1/6_2_Poljot_20027, 7_2_Kirow_91, 8_2_Kirow_92.
Cards (s/day, - gaining) | E | R | D | C | S:
1564(1955) .119 -1.66 .67 -.004 +.74 ; 308(1953 old TU 32/18/4) .143 -.78 .58 -.087 +.235(~.31) ; 707(1973) .25 +.02 .78 -.065 +1.06 ; 09218(1984) .21 +.24 .83 +.010 +.83 ; 22823(1986) .2/.30 -.28/-1.64 .73 +.08/+.025 +.79/+.30 ; 20027(1993) .25 +.03 1.29 +.02 +.60 ; 91(1970) .26 -1.31 - +.093 -1.24(outlier) ; 92(1970) .31 -.06 - +.009 ?
1. Scatter/drift: model uses Hamilton No.3390 (wempe_errorbudget.js:48,81: sd 0.042, drift 2.66 ms/d/d -> E .035 D .14 R +-.18). Cards: E .12-.31 (med .23), D .58-1.29 (med .76). Propose sd ~0.28 s/d, drift sd ~0.025 s/d/d (likely) -> N 4.9 -> ~12-17 as cards (12,13,16).
2. S: model +0.46-0.68 (a fifth of ordinary). Cards median +0.76 sd 0.26. Guillaume's quadratics through wempe_thermal.js: anibal 42% +0.73-1.87; 38.6% +0.41-1.55. Propose S +0.72+-0.26 or Dent 2.0 s with Guillaume's b.
3. Nickel steel: NBS Circular 58 (2nd ed 1923) Table 5 p86, Table 13 p90: Ni 39.4: a 5.18e-6, b -4.48e-9, E 148; 42 (interp) 6.85, -3.4, 154; 43.6 7.88, -2.73; 44.4 8.41, -2.51, E160@44.3; 45 8.61, -2.25. Steel 5.23 confirms 5.2. Anibal puts compensating place 16-23 deg; drawn 30 deg needs a~4.4 (~38.6% Ni, b -5.3, E 146).
4. Masses' setting +-0.25 -> cards' adjusted C sd 0.060 vs model 0.033: propose +-0.45 deg (SET0).
5. Gold spring: Poljot 20027 passport (13_Poljot_20027_Pasport_2.jpg) "Сплав Зл СрМ 333-333 0,0180 г" = Au33.3 Ag33.3 Cu33.4: density 11.6 (likely) vs 11.0; E 96-101 (rough) vs 90. 18 mg vs model blank 29.4 mg: keep drawn blank.
6. mainspring.py bends as beam; Searle b^2/(Rt) 32-91 -> plate E/(1-nu^2)=1.092E (likely; Searle 1908, Ashwell 1950 - verify). Gap becomes 0.734 (36%); implied strip 0.348; stress 2.98 GPa. Shared tool -> Hamilton changes too.
7. Train efficiency: gearing.js tooth-by-tooth 0.729 vs ETA 0.749 rule (-2 deg swing).
8. Attestat 1564: "заводка ... от 32 до 8 часов по счетчику завода" confirms trial winding (6MX-figures.md inferred note).
Regulation: cards' period means -3.7..+2.7 -> propose +-2.5 (only TU period mean).
Keep: hairspring E 206, e -240..-270, rim 8.1, brass quad, mu .15, restitution .3, Q 100, preload (open-ends: floor 0.49, window 0.49-1.43), mu/shake, strengths, 05 06_20 +-0.7, TF 108, zeta .05, seas, guard band 185.
Oil: attestats 2-yr service, 1954 instr 3 yr.
No swing figure found anywhere (TU, instructions, 1963 book, cards, Gosreestr 6839-78, 9776-84).
Sources: NBS Circ 58 https://nvlpubs.nist.gov/nistpubs/Legacy/circ/nbscircular58e2.pdf ; Guillaume Nobel lecture 1920 pp469-471 ; vintagewatchstraps temperaturecompensationnickelsteels ; belgim 06839-78, 09776-84.
Scratch: survey/physics/work/thermal_var.js (AN= env).
