# Wempe Federchronometer 05: CAD design, evidence and decision record

**Objective:** a marine-chronometer CAD model that is kinematically and dynamically right (beat, rate, run, stop, fits) and stays as close to the drawings as possible.

This file says **what to build** (§5), **why** each value is what it is (§3, §4, §6), **how sure** we are (tiers), and **what was ruled out** (§9). It replaces four earlier working files: `3D_Model_Feasibility.md`, `Inferred_Values.md`, `Resolved_Design.md` and the uncommitted draft `Federchronometer05_Evidence.md`. The first three are in git history (commit 921ab88).

**Conventions**

- Values use a decimal point. Drawing text quoted in "…" keeps the original German decimal comma.
- Z = 0 at the lower-plate inner face, positive toward the upper plate.
- Plan coordinates: x = O(+)/W(−), y = N(+)/S(−), in mm from the Minutenrad axis (05-08_03a table).
- Every inferred value carries a tier:

| Tier | Meaning | Trust |
|---|---|---|
| **T1** | Closes exactly from drawn values (arithmetic, geometry, gear kinematics) | As good as the drawings |
| **T2** | Engineering rule or standard, with the formula stated | Good; small deviations possible |
| **T3** | Scale-measured from a drawing calibrated on its own printed dimensions | ± as stated (typically 0.2–0.5 mm) |
| **T4** | Convention or fitted value, needed to make the model complete | Visual and kinematic only; replace if a source appears |

Every decision is checked by [`_inferred/scripts/closure.py`](_inferred/scripts/closure.py) (run `python closure.py`; §8):

| Kind | Meaning | Result |
|---|---|---|
| IND | **Independent**: tests a value against drawn data it was not derived from | **34 / 34 pass** |
| CON | **Consistency**: passes by construction, so it shows feasibility, not evidence | 116 / 116 pass |
| REJ | **Rejected alternatives**: ⌀15 escape wheel; the drawn 9.2 seconds-arbor extension; open band; 0.22 band strip; Staubfutter on the plate; 1.5 balance arm. Rev 2.1 adds: full-length balance jewel bores; the drawn pillar tolerance (Ruhestein clearance and fusee end-shake at an 18.93 gap); the ⌀0.6 stud hole; a +8 % tilted spring; the 0.15 Goldfeder and a 0.05 blade; the IE horn overhang; the rev-2 straight-horn unlocking setting; r 1.650 on the B-parallel line; the other Kloben steady-pin pairing | 17 / 17 fail as expected |

**Revision 2 (2026-10-22).** A reconciliation pass closed every open point in [`Federchronometer05_CAD_Spec.md`](Federchronometer05_CAD_Spec.md) (its §7 lists all 40 decisions). The rev-2 rows in §5, §6 and §9 below record the changes that alter the movement:
- the band is **crossed** (reverse fusee; the drum runs CCW from the back), with a 0.08 strip sized for reverse-bending fatigue;
- a stop-work designed to work: self-locking, banked in both positions, strength-checked;
- a closing fusee stack;
- the Staubfutter pressed on the Schneckenfutter;
- the fusee square 3.1 across the flats;
- Phillips-correct terminal curves as the build default;
- an unlocking-lift setting.

**Revision 2.1 (2026-10-22): clockmaker's review.** The CAD spec's header and §7 #41–#54 list the changes; `closure.py` group `review` checks them. The changes that alter parts:
- balance hole jewels with a 0.25 straight bore, so the cone of the 0.4 pivot no longer enters the bore;
- hairspring stud hole ⌀0.7 at r 3.85, with flatted taper pins;
- the barrel cover read as a 5° dovetail snap fit;
- the plate gap fitted: pillars faced as a set to 19.00 +0.01, then the end-shakes fitted to it;
- a mainspring slope criterion;
- the Goldfeder free blade thinned to 0.045, overhanging the horn tip by 0.12, so the return swing never meets the banked horn;
- **the unlocking setting moved to r 1.630 on a set-over horn.** Rev 2's r 1.650 on a straight horn fails when checked along the detent's true motion;
- Kloben steady-pin holes G1/G2;
- an hour-wheel retaining collar;
- the staff defined under the brass collet;
- a lubrication chart, the rim alloy, operating notes, and stale values corrected.

**Contents:** 1 Verdict · 2 Sources · 3 Calibration · 4 Rules · 5 CAD specification · 6 Decision log · 7 Timekeeping · 8 Closure checks · 9 Superseded values · 10 Gaps and recommendations · 11 External references · 12 Detailed derivations

---

## 1. Verdict

**From the drawings alone, a complete and accurate 3D model is not possible.**

The set is strong in two places:

- **Plan layout.** Every arbor position is given by coordinate and is self-consistent to 0.001 mm.
- **Going-train and motion-work wheels.** They are fully specified.

It is not complete for three reasons:

- **More than 40 referenced parts have no sheet**: jewels and settings, stop-work, five pinions, the Zwischenbrücke, the WN hardware, the gimbal. The mainspring has no sheet: only its section (15 × 0.37, on the fusee sheet 05-06_20) and set-up are drawn.
- **The hard geometries are only partly defined**: fusee groove helix, hairspring and terminal curves, escape-wheel and cycloidal tooth forms, detent-spring profile.
- **Several primary values conflict between sheets**, for example the escape-wheel diameter and the barrel's outer diameter and hub bore.

**41 of the 124 sheets are fully dimensioned**, and several of those are keys or box parts.

**With the rules in §4 and the inferences in §5, the model is kinematically correct and its rate closes to 2.000 Hz** (§7). It is **not manufacturing-accurate** in the T4 areas listed in §5.5 and §10.3.

**Rev 2: buildable.** After the reconciliation pass the movement can be built: every part has one governing value, every mechanism closes in plan and Z (closure.py), and the T4 parts (stop-work, settings, sheetless pinions and studs) are fully specified.

**Navigation-grade timekeeping is not shown by any drawing**, and could not be: it is the result of adjustment and rating trials, as it was at the factory.
- The design supports it: fusee torque within ±2.1 % over the daily winding window, a Guillaume balance with a steel spring, Phillips-correct curves, and a self-locking stop.
- What is not yet shown: the balance needs a quality factor of ≈ 670–1 280 to hold 200° amplitude, which can only be measured.
- The spec gives the procedures and acceptance targets (CAD spec §5.11).

---

## 2. Source documents

### 2.1 Drawing set

- 124 JPG scans in `drawings/`, ≤1024 px on the long side except the cross-section. All were read, grouped by Baugruppe, and transcribed verbatim with `?` for anything illegible (per-sheet tables in [`_audit/`](_audit/)). Key values were spot-checked by hand: the lower-plate coordinate table, the Pfeiler, the Gangrad on 05-04_07-1, the Hemmung on 05-04_01, the Zwischenrad on 05-05_06.
- **The master cross-section is `drawings/Wempe_Einheitschronometer.jpg`** (2048 × 828). The index lists it as `001-002/Federchronometer_05.jpg` "missing", but it is present under this name. It is undimensioned, but it calibrates well for plates, wheels, cocks and bridges (§3).
- **05-04_22 Ankerrad** is missing. It is an Anker-variant part, not needed here.
- Anker-variant sheets, not used: 002, 05-04_20, 05-04_21, 05-08_30, 05-08_31, 05-08_32-1. 05-08_03a/b serves both variants.
- **05-03_3-1** (drawing 17 04 01, 5.73 mm staff at 25:1) is from a different, smaller calibre.
- 05-02_13 is an A. Lange & Söhne dial (1453/A), not this calibre.
- **127-556.04 numbers are the 1941 series for both variants.** They appear on clear Feder assemblies (05-02_01, 05-05_01, 05-06_01), so they do not mark a sheet as Anker.
- **Part-number collisions** across 05-01 and 51-00: 05 01 02-2, 51 00 11 and 05 01 01 each appear on two different parts. The 05-02 wheel sheets carry 04-series numbers. The archive mixes Feder, Anker and transitional series.

### 2.2 Sheet-level result

| Group | Sheets | Fully dimensioned (Y) | Partial | Not usable (N) |
|---|---|---|---|---|
| 001-002, 05-01 Gehäuse, 51-00 Kasten, 05-33/36/38 | 20 | 6 | 4 | 10 |
| 05-02 Zeigerwerk + 05-05 Laufwerk | 25 | 9 | 15 | 1 |
| 05-03 Unruh + 05-04 Hemmung | 24 | 4 | 17 | 3 ¹ |
| 05-06 Schnecke | 19 | 7 | 12 | 0 |
| 05-07 Federhaus | 14 | 7 | 5 | 2 |
| 05-08 Gestell | 21 | 8 | 12 ² | 1 |
| Cross-section (root jpg) | 1 | — | layout only, undimensioned | — |
| **Total** | **124** | **41** | **65** | **17** |

¹ 05-03_2 is unusable. 05-04_10-2 has names only. 05-03_3-1 is a different calibre.

² Six of these are assembly views with no dimensions: 05-08_02, _06, _12, _31, _32-1 and _32-2.

### 2.3 Legibility

- Simple part sheets are about 95 % legible.
- Dense assemblies are 55–90 % legible (05-06_03-2 ≈55 %, 05-02_09 ≈60 %). Scan resolution is the main limit.
- Illegible digits were never guessed.

### 2.4 Other notes files in `drawings/` (not evidence)

| File | Actual content | Status |
|---|---|---|
| `Index.md` | "Inferred & Back-Calculated CAD Specifications" | **Unsourced, physically wrong.** Its barrel cavity ⌀43.00 × 12.20 is larger than the drawn drum (outer ⌀41.6, inner height 15.65); its screws M2.5/M1.4 contradict the drawn M2.6/M1.7. Never used |
| `Missing_details.md` | The 115-file drawing index | The file names are swapped with `Index.md`. Useful as a list only |
| `Wempe_Einheitschronometer.md` | Cross-section callout map | Unverified. Its "05 = Feder, 04 = Anker" numbering rule is **wrong** (§2.1) |

---

## 3. Calibration of the scaled sources

| Source | Used for | Calibration | Accuracy |
|---|---|---|---|
| Cross-section | Z heights, wheel planes, cock and bridge heights | 27 drawn features → 9.25 px/mm, SD 1.5 % (features ≥10 mm: 0.9 %); H = V to 0.03 %; left and right halves agree | Plates, wheels, cocks and bridges ±1.5 % + 0.2. **Arbor lengths are not to scale** (SD 4.6 %, range 14.7 %), so arbor lengths come from the part sheets |
| Layout 001 (plan views) | Bridge outlines, Zwischenbrücke, stop-work | Similarity fit to 10–13 plate-table points, rms 0.09–0.13 mm; held-out screws within 0.08–0.17. The back view is unmirrored; the dial-side view is mirrored | ±0.3 (back / Oberplatte view), ±0.4 (dial / Unterplatte view) |
| 05-04_01 escapement layout, 10:1 | Detent, rollers, stones | 24.48 px/mm; 10.00 / 25.68 / 23.8 agree within 0.5 % | ±0.05 at 1:1 |

---

## 4. Rules used to resolve conflicts

These five rules settle most of the conflicts. Each is an interpretation of how the factory drew and made parts, backed by evidence on the sheets themselves.

| # | Rule | Evidence | Alternative rejected |
|---|---|---|---|
| R1 | **Arbor and pinion part sheets show the part as turned between lathe centres.** Finished pivot lengths are fitted to the frame at assembly. Part sheets give the diameters and shoulder-to-shoulder lengths; pivot lengths come from the frame, the kompl. sheets and the section. | 05-05_04 draws both pivot ends with "Kegel 1:90" points. 05-04_07-1: "0,24 Steinlager einpassen". 05-06_15's 60.6 and its 20.3 right end include centre cones; 05-06_01 gives the finished 18.3. The section shows pivots ending flush with the plates | The longer 1946/48 pivots (5.1 / 4.6 / 4.5) would need raised jewel settings, which are not drawn anywhere |
| R2 | **The reamed plate hole governs; the pivot is finished to it** ("Zapfen nach Loch"). | The systematic offset: fusee hole 2.70 and barrel hole 2.90 are both exactly 0.10 under the nominal 2.8 / 3.0 arbors. The ±0.009 tolerance alone does not prove a running bore (row 26, the escape-jewel seat, has the same class) | Enlarging the holes would override the jig-bored plate table, the most precise document in the set |
| R3 | **Latest revision per part, kept consistent with its mating parts** (family-B barrel 1947/48 + band + 1948 fusee body). Where closure contradicts a revision, R1 or R2 decides | — | Mixed families do not fit (e.g. ⌀5 arbor seats in a ⌀4.5 hub bore) |
| R4 | **Check the datum before calling a conflict.** Several "conflicts" were one dimension measured from two different faces | Barrel hook (9.05 vs 7.85), hairspring (blank vs finished), Zwischenrad (pocket vs wheel), the 22.3 span | — |
| R5 | **Timekeeping is closed physically with one fitted parameter**, the balance-weight mass, as a chronometer adjuster would fit it | §7 | — |

---

## 5. CAD specification (what to build)

Scope is the **Federchronometer movement**. The case, gimbal and box interface are specified separately in [Federchronometer05_Case_Gimbal.md](Federchronometer05_Case_Gimbal.md) (checks: `_inferred/scripts/case_closure.py`); their drawing gaps are in §10.1.

### 5.1 Going train and motion work

All wheel data is drawn (D = outside, d = pitch, dg = root; see `_audit/audit_train.md`): Minutenrad z90, Zwischenrad z80, Sekundenrad z80, Gangrad z15; Schneckenrad z90 M 0.4356; Wechselrad z56, Stundenrad z54, Auf u. Abrad z120.

**Inferred pinions** (no sheet gives the leaf counts):

| Pinion | z | Pitch ⌀ | Module | Tier | Derivation |
|---|---|---|---|---|---|
| Zwischentrieb (third), meshes Minutenrad z90 | **12** | 4.264 | 0.355 | T1 | 2 × 18.120 − 31.976 = 4.264; ÷ M0.355 = 12.00 |
| Sekundentrieb (fourth), meshes Zwischenrad z80 | **10** | 2.807 | 0.2807 | T1 | 2 × 12.630 − 22.453 = 2.807; ÷ 0.2807 = 10.00 |
| Viertelrohr (cannon), meshes Wechselrad z56 | **14** | 5.04 | 0.36 | T1 | 2 × 12.600 − 20.16 = 5.04 → 14.0 |
| Wechseltrieb (change), meshes Stundenrad z54 | **18** | 6.30 | 0.35 | T1 | 2 × 12.600 − 18.90 = 6.30 → 18.0 |
| Zeigerstelltrieb (setting) | **16** | 5.76 | 0.36 | T1 | c = 12.96 on 05-02_01 |
| Fusee pinion for Auf u. Ab, meshes z120 | **12** | 3.346 | 0.2788 | T1 | c = 18.4 → 12.0, confirmed independently by the power-reserve dial (§7) |

Every count comes out as an exact integer, which is strong evidence that the counts are right.

**Escape pinion (Gangtrieb) z10:** OD **2.97** (tooth table 05-04_08). Pitch ⌀ 2.634 is fixed by 2 × 11.85 − 21.066 (M 0.2634, equal to the Sekundenrad module); 2.97 gives a 0.64 m addendum, normal for a rounded-leaf cycloidal pinion.

**Tooth profiles**

- **Geometry is T1:** tip, pitch and root diameters, pitch and tooth thickness are fixed by each sheet's D / d / dg / t / l.
- **Curve shape is T4:** sheets say only "Zykloidenverzahnung". Model a standard horological cycloidal form: generating circle = ½ the pinion pitch radius, epicycloidal addendum on the wheel fitted to the drawn D, radial pinion flanks with a rounded leaf head.

**Train arbors (R1)**

| Item | CAD value | Tier |
|---|---|---|
| Pivot diameters | From the 1946/48 part sheets: Sekundentrieb 0.76 / 0.82; Zwischentrieb 0.85; Minutentrieb 1.2 | T1 |
| Shoulder spans | From the 1946/48 sheets: 24.1 / 23.05 / 17.2 + 23 | T1 |
| Back pivots | **3.0** long, tips at Z 22.0, 0.35 under the upper-plate face (oil sink) | R1 |
| Front pivots | To bushings in the Zwischenbrücke (≤4 thick) | R1 |
| Seconds arbor | Extension **cut to 7.84**, tip at Z −12.97 (0.53 above the hour hand) | T3 + R1 |
| Seconds-hand seat | **Zeigerfutter** (hand pipe, named on the cross-section): OD 1.2 (fits the hand's 1.2 +0.05 bore), bore 1:90 taper on the 0.76 → 0.65 arbor end, ≈1.0 long | T1 fits / T4 length |
| Minutentrieb front tip | **Cut flush with the Viertelrohr end, Z −18.23** (the tip carries a 1:80 point between centres) | R1 |

**Sheetless motion-work parts (T4).** Model each as a tube on its drawn mating fit; lengths from the hand Z positions in §5.4.

| Part | Mating fit |
|---|---|
| Minutenrohr 05 05 03-3 | □2.6 r6 for the minute hand |
| Stundenrohr 05 02 03-2 | 4.4 r6, Kegel 1:70 |
| Auf u. Ab hub 05 02 04-2 | 2.2 r6 |

**Auf u. Abrad:** raised 0.25 on its stud, so the wheel sits at **Z −9.40 → −8.37** (full face engagement with its pinion end at −9.45; 0.95 clear of the dial). T4.

### 5.2 Power: mainspring, barrel, band, fusee

| Parameter | CAD value | Tier | Derivation |
|---|---|---|---|
| Mainspring | **15 × 0.37 × 1385, set-up ¾ turn** | T1 width, thickness, set-up / T2 length | "(15,8±0,1) Zugfeder 15" on 05-07_01; "Zugfeder 15 × 0,37" and "3/4 Umgang gespannt" on 05-06_20 (24.7.41). Length by the half-area rule L = π(R² − r²)/(2t) in ⌀38.5 / core ⌀13.3 (r 6.65); must give ≥4.92 barrel turns. Sheet 20's torque rate (≈62 N·mm/turn) implies L ≈ 1320, within 5 % |
| Mainspring ends | Inner eye on the core hook; outer end on the 45° M2.6 hook at 7.85 from the drum floor | T4 | Convention |
| Barrel drum | **Family B**: drum 05-07_06 (⌀41.6 −0.1 × 18.1) + cover 05-07_07. Cavity floor 1.25 → seat shoulder 16.9 = 15.65 high. Hub bores 4.5 +0.1 | T1 | R3 |
| Barrel hook | **9.05 from the drum's outer bottom = 7.85 from the floor = the spring centreline** | T1 | Cavity half-height 7.825 (R4) |
| Barrel-end connector slot | **01's oblique 2.5 slot**, cut at fusee assembly ("Schlitz … erst bei Schneckenmontage einsetzen") | T3/T4 | The "2 +0,05" on 06 is an axial floor slot matching the cover notch on 07 |
| Barrel arbor (05 07 02-1, no sheet) | **40.2 overall** (05-07_08) = 5 + 22.25 shoulders + 12.95. Seats **⌀4.48** (f7 to 4.5); core **⌀13.3, length 11.7**; lower pivot **⌀2.88** in the 2.90 plate hole; upper pivot **⌀3.88** in the 3.9 bridge hole; square 2.7□ 1:100 × 10; end-shake 0.10 | T1 closure / T4 | Frame span lower-plate inner face → barrel-bridge underside = 22.35. The upper pivot is 0.3 short of the 3.32 bridge, so the square starts 0.3 inside the bridge bore (diagonal 3.82 < 3.89, clears) |
| Fusee connector | **Steel band, Schneckenband 05 07 03, 730 ±3, crossed (reverse fusee)**, strip **0.8 × 0.08** hardened steel (rev 2; 0.22 superseded), hooks 05-07_12/13 brazed on with a 0.14 filler | T1/T2 | §6.2. Remainder on the barrel at full wind 56.2 mm; free span 18.8 → 29.9 |
| Fusee groove | **Left-hand helix, constant lead 1.20**; groove centre z = 1.235 + 1.2·n from the large face; ends at n = 8.85 turns; one root radius per turn, 9.30 → 14.75. A 30°-step r(θ), z(θ) table is in `inf_fusee.md` | T1/T3 | Lead from 0.87 + 0.33; the groove end closes two ways to 4° |
| Groove section | 0.87 wide × **0.6** deep | T1 | 05-06_02-2 |
| Fusee radius at one turn | **10.07 ±0.03** | T3 | |
| Schneckenkörper length | **9.9** | T3 | |
| Full wind | **8.761 fusee turns = 56.3 h** | T1 | Great wheel z90 / Minutentrieb z14; sheet 20 |
| Barrel turns used | **5.00** (sheet 20: "5"), crossed band (rev 2; the open band gave 4.92) | T1 | closure.py |
| Drum and click sense | **Drum runs CCW from the back** (opposite to the fusee); the click locks the arbor against CW; set-up CCW (rev 2) | T1/T3 | The click as drawn on 001 (row 46); §6.2 |
| Fusee arbor (Z) | Lower tip −9.45; journal −6.55 → 0, **finished cylindrical ⌀2.68 (f7) through the 2.70 plate hole**; seat 0 → 8.61; collar 8.61 → 16.51; 6.1 seat 16.51 → 19.61; upper journal 19.61 → 27.61; square to 45.91, **finished 18.3**; end-shake 0.04 | T1/T3, T4 (R2) | Shoulder span **19.61** (drawn 19.7 +0.05, overridden −0.09), forced by the Schneckenfutter end at Z 19.65. The 2.8 journal stays inside the movement; the 1.6 pivot sits 3.2 below the plate, inside the Auf-u-Ab-Trieb |
| Fusee square (rev 2) | **3.1□ r6 across the flats at the root → 2.92□**, 1:100, milled from the ⌀4.39 journal end; the Staubplatte has a square hole; the drawn key socket 3.1□ +0.05 fits | T1 | 05-06_15 read at 4× ("3,1□", "2,92□"); 05-01_9 |
| Fusee stack (rev 2) | Vorreiber 0.07 → 3.17; Schneckenrad hub 1.97 → 4.59 (teeth 2.54 → 3.84); Gegenfeder 3.44 → 4.79; Gegensperrad 4.84 → 5.86; body 5.91 → 18.51; Schneckensperrad 6.61 → 8.61; Deckplatte 18.51 → 19.31 | T1 closure / T4 | Body recess floor (5.91 + 2.7) = arbor collar start 8.61; 8.61 + 9.9 = 18.51 |
| Staubfutter (rev 2) | Pressed on the Schneckenfutter's ⌀8 r6 boss; **23.85 → 41.95** | T1 | 05-08_08/09 fits; lug top 38.95 vs Korkring 39.11 |
| Gegenfeder | **Part sheet 05-06_10**: constant 2 × 1.35 | T3 | |
| Ratchets | Gegensperrad z120: root ⌀35.85, radial face, back ≈54°. Schneckensperrad z35: depth 0.75, face undercut 8° | T2/T4 | Depths drawn; flank angles by convention |
| Stop element (rev 2) | **Stop nose (Stellungssteg 05 06 03-1)**, hardened, on the fusee small end r 8.4 → 11.60, Z 18.25 → 18.86, stop face at φ_CAD 78.75° (plate bearing 140.0° at full wind) | T4 | CAD spec §3.5; closure.py |
| Stop lever (rev 2) | **Bell-crank stop iron** pivoted at S1 (−4.000; 20.000), Z 18.20 → 18.95. A chamfered pad is cammed by the band's rising edge from 8.05 turns; the lever swings 6.97° CW onto banking pin B2 (−3.045; 15.920); beak at r 10.90 (engaged) / 12.09 (rest); stop faces inclined 27° so the force passes 3.3 from the pivot (moment-arm ratio 0.12–0.41 over the friction band, always engaging); banks on pin 7 at rest; strength-checked at a 500 N·mm over-wind | T4 | CAD spec §3.5; closure.py |
| Banking pin | Hole 7, **R14.000 from the fusee axis** | T1 | |
| Stellfeder (rev 2) | ⌀0.30 wire under an M1.0 screw at S2 (3.000; 17.600), turning the lever CCW onto pin 7 | T4 | No sheet |
| Sperrkegel pivot | New table point N17.046 W29.474 (closes the drawn "12") | T1 | |

### 5.3 Escapement and balance

| Parameter | CAD value | Tier | Derivation |
|---|---|---|---|
| Escape wheel | **⌀14.00, z15** | T1 | §6.1. 05-04_23 tooth pitch measures 24.2°; beat closes at 14 400 vph |
| Escape tooth | Tip R7.00 with a 1½° land (0.1834 chord, printed "0,18 34"); straight face tangent to ⌀6.06 (25.65° to radial); root ⌀11.7; back-step ⌀12.1; concave back R3.03 | T1/T3 | 05-04_23 + z15 + 05-04_01 |
| Escape arbor | **22.8 −0.02; endstone span 22.83** | T1 / T4 settings | |
| Detent spring | **26.5 +0.5/−0.3** = horn 4.4 + Kloben 18.8 + half foot 3.3; Federung 4.8, Steg 8.7. Model the main values, not the bracketed alternatives such as "0,25 (0,22)" | T1/T3, T4 | Layout 18.81 at 10:1. The 25.68 / 23.8 point is the Kloben screw, not the bending point |
| Detent anchor | **Kloben screw on plate hole 13; locking stone and horn at the 05-04_01 layout positions.** The Kloben's detent end face takes up the 1.2 mm offset: block axis 68.00°, length 13.37, M1 at Z 15.88 (rev 2: one value set, CAD spec §5.3) | T4 | Re-check locking depth once modelled: a 0.3 tangential stone shift at R7 is 2.5°, about the size of the roller window |
| Unlocking setting (rev 2.1) | **Goldfeder acting corner at r 1.630 ±0.005 from the balance axis, 0.05 ±0.02 to the wheel side of the line through B parallel to the detent (bearing ≈336°, the 05-04_01 drawn instant), on a horn set over ≈0.9 toward B; discharge stone tip r 1.71** → lift along the true detent motion 0.485 nominal, ≥ 0.425 worst case, against 0.384 needed | T2 | closure.py `review`; CAD spec §5.3 |
| Goldfeder (rev 2.1) | Drawn 0.15 throughout; **free blade thinned to 0.045**, 0.15 kept at the foot. **Overhang beyond the horn tip 0.12 ±0.01** (horn tip r ≥ 1.735, outside the stone circle). Return-swing loss ≤ 0.65 µJ (5–24 µJ at 0.15) | T1 / T4 | closure.py `review` |
| Locking stone | ⌀0.75 | T1 | |
| Discharge (unlocking) roller | Body r 1.37; stone tip r 1.65–1.71; stone width 1.7 | T3 | 05-04_01 |
| Impulse stone | Width 1.7 in the ⌀6.78 Heberolle | T1/T3 | |
| Stone phasing | 79° between impulse and discharge stones; unlocking takes 11°; wheel budget 24° = 1½ + 21 + 1½. Unlocking precedes impulse by 0.15 mm; locking penetration 0.39; roller window 2.35° | T3/T2 | Matches the printed 24° / 21° / 1½° arcs |
| Balance staff | **25.6 −0.02, pivots 0.21**, roller seats 4.1 / 1.6 (05-03_3-2) | T1 | §6.1 |
| Balance jewel span | **25.65** (endstone recesses ≈1.35 each side); end-shake 0.05 | T3 | |
| Hairspring wire | "Bandstahl 0,52 × 0,285 poliert": **steel**, 0.52 × 0.285 | T1 | Pairs with the Guillaume rim |
| Hairspring blank (05-03_6) | 15 turns LH, 11.5 high, outer ⌀12.8, pitch 0.73 (derived, not printed), cut length 603. **This is the blank as wound on its former, not the finished spring** | T1 | R4 |
| Hairspring, finished | **Active length ≈504 = ≈11.77 helical coils + 2 terminal curves of 20.55 each**; coil envelope **9.5** (over the strip edges); 05-03_5: 13.4 = 3.15 + 9.5 + 0.75 | T1 length / T3 envelope | 05-03_7: "vorm biegen der Kurve auf 13 Umgänge −3,5 mm kürzen". 11.77 coils rise 9.11; the 0.39 remainder is taken by the curve transitions (T3) |
| Hairspring position | **Stud arm on the cock top (Z 37.35); collet bottom on the balance-arm top (Z 23.95)**. Stud leg 1.8 g6 in the cock's 1.8 H7 slot; cock underside relieved 0.8 within r 12. Stud hole "bei Montage gebohrt": ⌀0.7 at r 3.85, strip at r 3.76, flatted taper pin (rev 2.1) | T1 | 37.35 − 13.4 = 23.95, closing to 0.00 |
| Terminal curves | **Rev 2 build default: the Phillips-correct T2 curve at both ends** (L 25.35 each, active length 513.6, weights 1.476 g). The drawn curve (polar table on 05-03_7, inner edge 6.12 → 3.37, centreline = inner edge + 0.1425, mirrored at the stud end) is kept as the historical record | T2 / T3 | The drawn curve meets Phillips' 1st condition but misses the 2nd by 58 % (reproduced in rev 2); §6.1 |
| Balance rim | Guillaume rim and arm, "Nickelstahl Sonderlegierung u. Messing" (05-03_4); rim mass 2.87 g. Rev 2.1: certified Guillaume nickel steel, brass fused on, stabilised before and after cutting (CAD spec §5.6) | T1 / T4 | |
| Balance weights | Start 30° from each cut; drilling positions every 6° over ±18° (the "8 Körner in 60 Teilung" marks) for temperature adjustment; thread ≈1.0 × 0.16; weights ⌀6.35, **fitted 1.476 g (Phillips curves) / 1.525 g (drawn curves)**, made 6.6 long and faced to rate; drawn 6.0 long = 1.42 g | T3 / fitted (R5) | §7 |
| Timing nuts | 2 off, ⌀4.23 × 3.26 at r 18.6 (measured on 05-03_1), brass assumed | T3/T4 | They carry ≈12 % of the inertia |
| Jewels | Hole = pivot + 0.01–0.02 (balance 0.22–0.23, escape 0.25–0.26); balance hole jewels have a 0.25 straight bore at the endstone end, then an oil sink (rev 2.1); setting seats 5.2 H7 (balance, escape upper) and 2.50 (escape lower); screwed chatons 2 × M1.2; settings set the endstone spans 22.83 (escape) and 25.65 (balance); thicknesses and endstones by convention | T2/T4 | No sheets for 05 04 06/08 |

### 5.4 Frame, bridges and axial stack

| Item | CAD value | Tier |
|---|---|---|
| Plates | Lower −3.35 → 0; upper 19.0 → 22.35 | T1 |
| Lower-plate thickness | **3.35** (struck on 03a; legible on 03b Schnitt A-B; section 3.31 ±0.2) | T1/T3 |
| Plate gap | **19.0 clear**: Pfeiler 19.6 ±0.01 between shoulders, seated in 8.6⌀ × 0.3 recesses on the inner faces | T1 |
| Barrel bridge | 3.32 thick; lower-plate inner face → bridge underside = 19.0 + 3.35 = **22.35** (the "22,3" on 05-07_01). The upper plate is cut away over the barrel (⌀42.5 crescent) | T1 |
| Cocks | 15 / 10 | T1 |
| **Zwischenbrücke** (05 08 04-1, no sheet) | **Dial side of the lower plate, Z −3.35 → −7.35, thickness 4** (section 3.95 ±0.25; 05-05_01 "4"). Its screws are in the lower-plate table only | T1/T3 |
| Zwischenbrücke plan | Six holes on one straight line (rows 28/29/35/38/43/44 collinear within 0.0003 mm; axis 141.687°, 18.047 from Minutenrad). Slot shape **10 wide, R5 ends, 47 long**; end centres (−23.30; −4.79) and (+5.89; −27.74) | Holes T1; outline T3 (±0.3) → T4 rounded |
| Wheel planes | Minutenrad 0.5–1.8; Zwischenrad −1.25 to −0.25 (in the 24.5 through-cut); Sekundenrad 4.12–5.12; Gangrad 17.00–18.40; balance rim 22.80–26.60; Schneckenrad 2.54–3.84; Wechselrad −5.40 → −4.40; Stundenrad −7.49 → −6.44; Auf u. Abrad −9.40 → −8.37 | T1 chains, section-confirmed ±0.2 |
| Werkring (05-08_07, 05 08 00-3) | **Has a sheet** (1:1, 1941, rev a 6.12.46): 10.7 −0.1 = 3 +0.1 + 7 −0.1 + 0.7 +0.1; flange underside (the "Werkringauflage" on the case) at Z −6.35, flange face −11.05; radial Stellstift 3 (WN-202) on the 12 o'clock line, 2.8 below the flange face, locating in the case-rim notch | T1 |
| Dial | Faces −10.35 / −11.65 (Werkring 05-08_07: 3 + 7 + 0.7 = 10.7) | T1 |
| Korkring (05 08 01-4, no sheet) | On the Staubfutter lug (38.95), round the ⌀13.1 Staubfutter body, so its bore is **≈13.1**. Thickness ≈3.8 (T3; 1941 "3,9" on 05-06_01). The movement's highest axial contact: a dust seal round the winding hole against the case floor at Z 42.65. As found, the contact is anywhere from 0.10 to 0.35: 38.95 + 3.8 = 42.75, 38.95 + 3.9 = 42.85, section top 43.0. **Face the cork at assembly to 0.1–0.2 contact.** Its reaction loads the upper plate beside the fusee (end-shake 0.04), so check the fusee end-shake with the bezel tightened (case spec §4.3) | T3 / T4 |
| Hands (rev 2) | Auf u. Ab blade −11.80 / −12.30, boss to −13.20 (fully on its seat); seconds −12.1 / −12.4; hour −14.09 / −14.74, seated on the Stundenrohr step (35 long, sweeps r 23); minute −16.1 / −16.75, boss forward | T1 lengths / T3 / T4 |
| Recesses | Pillar seats 0.3; J-K 0.62 (drawn 0.7); G-H 1.78 | T3 |
| Bushings (Messinglager WN-300/301/302) | OD = plate "kalibr." bore (e.g. 4.59 +0.012); hole = pivot + 0.01–0.02; height = plate thickness | T2 |
| WN screws and pins | Slotted cheese-head, DIN-style proportions; threads as drawn in the plate tables (M2.6 / M1.7 / M1.4 / M1.2) | T4 heads |

### 5.5 Still designed-in (T4), with the recommended design

| Part | Recommended design |
|---|---|
| Cycloidal tooth flanks | §5.1 |
| Jewel and endstone settings 05 04 06/08 etc. | Screwed chatons, 2 × M1.2; hole = pivot + 0.01–0.02; settings set the endstone spans 22.83 and 25.65 |
| Barrel click spring, maintaining-click wire spring | Steel leaf on row 46; ⌀0.4 wire coiled on a post screwed into row 5, at the click plane (rev 2) |
| Stop-work: nose, lever, Stellfeder, pivot S1, screw S2 | §5.2; CAD spec §3.5 |
| Gegensperrkegel arbor | Full-length arbor in both holes 4; blade at Z 4.85 (rev 2) |
| Family-B barrel arbor | §5.2 (closure, no sheet) |
| Mainspring end attachments | §5.2 |
| WN screw heads | §5.4 |
| Zwischenbrücke corners | Slot shape 10 × 47, R5 ends (holes T1) |
| Detent anchor offset | Absorbed in the Kloben foot outline (§5.3) |

---

## 6. Decision log

Each row is a conflict between sheets, or a gap, with the decision used in §5.

### 6.1 Escapement and balance

| Item | Drawn options | Decision | Tier | Evidence |
|---|---|---|---|---|
| Escape wheel ⌀ | "D = 15,0" (07-1, titled "05 04 08 bis 10"); "⌀ 14,00" (05-04_01); "14 +0,03" (05-04_23) | **14.00, z15** | T1 | At 15.0 the wheel arc inside the ⌀6.78 roller circle (centre distance 10.00) is 30.4°, more than the 24° pitch, so the roller would always hit a locked tooth. At 14.0 it is 21.65°, leaving a 2.35° window. The wheel is drawn at 14.0 on both sheets. "08 bis 10" is a part-number range, not a size family. The meaning of "D = 15,0" is unresolved |
| Escape pinion OD | 2.97 (tooth table 05-04_08); 3.13 (drawing, 07-1) | **2.97** | T1 | Pitch ⌀ 2.634 is fixed by the 11.85 centre distance; 2.97 gives a 0.64 m addendum (3.13 would be 0.94 m). 3.13 is probably the turned blank |
| Escape arbor vs span | 22.8 −0.02 (part); 22.0 (section) | **22.8; endstone span 22.83** | T1 / T4 | Section arbor lengths are unreliable (±5 %); the jewel settings have no sheets |
| Balance staff | 25.6 −0.02 (05-03_3-2, 1965); ≈14 + undimensioned top (05-04_04/05; 1941 and 1946 differ on 4.7/4.1, 2.1/2.14, 14/14.03) | **25.6, pivots 0.21** | T1 | "Länge der Unruhwelle 25,6" (05-03_1); section tip-to-tip 25.9 ±0.4, roller seats match the layout; 05-04_04 is a pre-form between centres (R1), use it for seat fits only. Exception to R3: a 1965 sheet, whose number 050401 collides with the detent parts' 05 04 01-x |
| Hairspring turns and length | "15 turns, 11,5 high, blank 603" (05-03_6) | **Active ≈504 mm = ≈11.77 helical coils + 2 × 20.55 curves; coil envelope 9.5** | T1 | 05-03_7: "vorm biegen der Kurve auf 13 Umgänge −3,5 mm kürzen". The 13 turns include the curves. 13 coils + 2 curves = 552 (≈−2.5 % rate), which exceeds the cut length by 45. The installed 11.5 would also touch the upper-cock arm (the section draws 9.7) |
| Hairspring position | — | **Stud arm on the cock top (Z 37.35); collet bottom on the balance-arm top (Z 23.95)** | T1 | 37.35 − 13.4 (05-03_5) = 23.95, closing to 0.00 |
| Terminal curves | One polar table (05-03_7), bold inner-edge series + a faint series | **The same curve at both ends** (stud and collet pins both drawn at r ≈ 3.5 on 05-03_5) | T3 | The faint series is not the outer edge: normal offset 0.09–0.25 vs 0.285. Its meaning is unknown |
| Phillips conditions | — | **Rev 2: build with the Phillips-correct T2 curve**; the drawn curve stays as the record | T1 / T2 | 1st condition met (centroid 1.6° off the perpendicular); 2nd not met (y_G 3.00 vs R²/L 1.91), so the rate depends on amplitude. The factory adjusted by hand; a new instrument starts from a correct curve |
| Balance arm | 1.15 (RH) vs 1.5 (AU) | **1.15** | T1 closure | The arm top is fixed at 23.95; a 1.5 arm leaves the rim 0.10 above the plate and drops the impulse stone 0.23 into the detent horn's plane (closure.py REJ) |
| Unlocking | Construction 1.80 vs layout 1.65 | **Rev 2.1: acting corner r 1.630 ±0.005, 0.05 to the wheel side of the B-parallel line, on a set-over horn** | T2 | The straight detent axis passes 0.70 from B on the side away from the wheel. A corner on the straight horn's wheel-side face lies 0.97 off the B-parallel line; the stone pushes it toward B and cannot release (1.5 lift). Rev 2's √(1.71² − r²) holds only on that line, and even there r 1.650 gives 0.33 worst case on the true motion. The chosen point is where 05-04_01's drawn instant puts the stone on the Goldfeder (bearing 336°) |
| Escape arbor Z | Rev 1 frame table (wheel 17.17 → 17.97 × 0.8) vs escapement section (17.00 → 18.40 × 1.40) | **17.00 → 18.40, rim 1.40** | T1 | 07-1 "1,4"; 07-2 chain; the section's 1.45 |
| Hairspring material | "Bandstahl 0,52 × 0,285 poliert" | **Steel** | T1 | Pairs correctly with the Guillaume rim (05-03_4) |
| Detent anchor | Layout point (25.68 / 23.8) vs plate hole 13, 1.2 mm apart | **Kloben screw on hole 13; locking stone and horn at the layout positions** | T4 | The machined hole and the functional layout are both kept |
| Detent-spring bracketed values | e.g. "0,25 (0,22)" | **Main values** | T4 | The sheet is scaled to the main values |
| "2400 Schwingungen" (05-03_1) | — | Not used | — | The rate is fixed by the train. 2400 = 14 400 / 6; meaning unresolved |

### 6.2 Power

| Item | Drawn options | Decision | Tier | Evidence |
|---|---|---|---|---|
| Fusee connector | Chain 05-07_14 (780, 1941); band 05-07_11 (730, 1943) | **Steel band 730 ±3** | T1 / T2 | The 1948 groove is 0.87 × **0.6** deep: it holds a band fully, but only 30 % of the chain's 2.0 radial height (the 1941 chain body was 1.2 deep). The 02-2 hook slot (0.8, with a ⌀0.55 cross-pin) fits the 0.8 band hook; the chain hook interferes. The struck note on 02-1 reads "Gangtiefe für Kettenersatzband … auf 0,6" |
| Band run (rev 2) | Open (rev 1, assumed) vs crossed | **Crossed: reverse fusee, drum CCW from the back** | T1/T3 | (1) An open band runs through the lower balance cock (05-08_04 block, Z 9 → 19, on holes 22/36/37) from 2 to 8.76 turns; the crossed band clears every plate-gap part by ≥ 0.86. (2) The barrel click on 001 (pivot row 46 N of its nose, W of the Sperrad) locks CW, so set-up is CCW and the drum runs CCW. (3) The crossed band gives 5.00 barrel turns, the "5" of sheet 20 (open: 4.92) |
| Band strip (rev 2) | 0.22 (from the hook-slot width) | **0.8 × 0.08**, brazed with a 0.14 filler in the 0.22 slot | T2 | A crossed band is bent one way on the fusee (r 9.34) and the other on the drum (r 20.84), once per wind/run cycle (≈2 × 10⁴ cycles). 0.08: peak 1 428 MPa, alternating 635, mean 793, **Goodman safety 1.22** (S_u 2 000, S_f 1 500); tension safety 3.6. 0.22: 2 390 MPa bending, Goodman 0.63 |
| Stop-work (rev 2) | Rev-1 scaled lever and Steg (r 6.95, under the Deckplatte) | **Bell-crank stop iron on S1, cammed by the band, stop nose on the small end, inclined stop faces, banking pins 7 and B2** | T4 | The rev-1 beak had no free axial plane (body 18.51, Deckplatte 18.61 → 19.61, J-K floor 19.70). Two rev-2 drafts were rejected: radial faces could be forced out, and a 0.68 moment arm overstressed the arm at over-wind. The final design passes 24 checks, including the pass at 7.761 turns, the stop at 8.761, self-locking over the friction band, and arm / pivot / B2 / nose strength at a 500 N·mm over-wind |
| Fusee stack (rev 2) | Section planes that overlapped by 0.04–0.41 | **Closing stack** (§5.2 row) | T1 closure | Body recess floor = arbor collar start |
| Staubfutter (rev 2) | Base on the plate (22.35, rev 1) | **On the Futter's ⌀8 r6 boss, 23.85** | T1 | Drawn H7/r6; the ⌀13.1 body cannot pass the ⌀13.2 flange |
| Fusee square (rev 2) | "3,10 → 2,93" read as corners | **3.1□ → 2.92□ across the flats** | T1 | 05-06_15 at 4×; the key's 3.1□ socket fits (as the parallel case spec also found) |
| Barrel outer ⌀ | 41.5 (05-07_01/02) vs 41.6 −0.1 (05-07_06) | **41.6 −0.1** | — | R3 |
| Barrel hook height | 7.9 (02); 9.05 ±0.05 (06); 7.85 ±0.05 (04) | **9.05 from the outer bottom = 7.85 from the floor = the spring centreline** | T1 | Cavity from floor 1.25 to seat shoulder 16.9 → 15.65, half 7.825 (R4) |
| Barrel family | A (01/02/09, 1941) vs B (04/06/07/08, 1944–48); hub bore 4.5 vs arbor seat 5 | **B** | T1 | Hub bores 4.5 +0.1 on both 06 and 07; arbor A's ⌀5 seats cannot enter. The Federkern labelled family B (40.2) is drawn with family-A proportions (43.1) |
| Family-B arbor | 08 gives 40.2, "5", "10" only; the part sheet 05 07 02-1 is missing | **40.2 = 5 + 22.25 + 12.95; seats 4.48; core ⌀13.3, length 11.7; pivots 2.88 / 3.88** | T1 closure / T4 | Frame span 22.35, giving 0.10 end-shake. The core length fits the 1948 drum's 11.8 allowance (a 12 core does not) |
| What 22.3 on 05-07_01 spans | Read earlier as "plate gap" | **Lower-plate inner face → barrel-bridge underside = 19.0 + 3.35** | T1 | The upper plate is cut away over the barrel |
| Mainspring | "Zugfeder 15" (05-07_01); "Zugfeder 15 × 0,37", "3/4 Umgang gespannt" (05-06_20) | **15 × 0.37 × 1385, set-up ¾ turn** | T1 / T2 length | §5.2 |
| Fusee lower journal vs hole | 2.8 ±0.02 (05-06_15) vs 2.70 ±0.009 (03a row 10) | **Journal finished to 2.68 through the plate** | T4 (R2) | No bushing drawn |
| Fusee arbor lengths | 05-06_15 between centres; 05-06_01 assembly | **Shoulder span 19.61** (drawn 19.7 +0.05, overridden −0.09); **finished square 18.3** | T1 / T3 | Forced by the Schneckenfutter end at Z 19.65. The earlier 15.4 / 13.7 square readings used wrong datums |
| Stop element | Pin hole A (02-2) or the Steg of section C-D | Rev 1: Stellungssteg at r ≈ 6.95, −3° ±4° from N. **Rev 2: superseded by the stop nose (row above)** | T3 / T4 | Hole A is at r ≈ 17 at the large end and is not a stop element |
| Fusee radius at one turn | 10.04 (sheet 20) / 10.07 (02) | **10.07 ±0.03** | T3 | Not resolvable from the scans |
| Schneckenkörper length | change note "8,9 neu" vs drawn 9.9 | **9.9** | T3 | Scale measurement |
| Gegenfeder | 09 (kompl.: width 1.8–3.5, thickness 1.4) vs 10 (part: constant 2 / 1.35) | **Part sheet 10**: 2 × 1.35 | T3 | The part sheet governs the part |

### 6.3 Train, motion work, frame

| Item | Drawn options | Decision | Tier | Evidence |
|---|---|---|---|---|
| Pinion counts (no data on the sheets) | — | 12 / 10 / 14 / 18 / 16 / 12 | T1 | Each count is an exact integer from the centre distance; the power-reserve dial confirms the fusee 12 independently |
| Train pivots | 1940/43 kompl. (0.73/0.76, 0.8/0.82, 0.82/0.85) vs 1946/48 part sheets | **Diameters and spans from 1946/48; back pivots 3.0; fronts to the bridge** | R1 | The 5.1 / 4.6 / 4.5 pivots would stand 1.15–1.75 proud and hit the balance rim |
| Seconds arbor | 9.2 extension (05-05_04) | **Cut to 7.84 (tip Z −12.97)** | T3 + R1 | The 35-long hour hand (05-02_03) sweeps r 23 at Z −13.50 / −14.15; as drawn the tip would collide (−14.33) |
| Seconds-hand bore 1.2 | No seat drawn | **Zeigerfutter (hand pipe), OD 1.2** | T1 fit / T4 length | Named on the cross-section |
| Minutentrieb front tip | 2.4 beyond the Viertelrohr | **Cut flush at Z −18.23** | R1 | — |
| Auf u. Abrad | 0.2 below its pinion end | **Raised 0.25: Z −9.40 → −8.37** | T4 | Full face engagement; 0.95 clear of the dial |
| Plate gap | 19.6 (pillar) vs "19" | **19.0 clear** | T1 | 19.6 − 2 × 0.3 recesses; "19" on 05-05_01 and "innerer Plattenabstand 19 mm" on 001; 19.0 + 3.35 = 22.3 (05-07_01); section ratio 1.0327 vs 1.0316 |
| Lower-plate thickness | Struck on 03a, replacement illegible | **3.35** | T1/T3 | 03b Schnitt A-B; section 3.31 ±0.2 |
| Zwischenbrücke position | "above the upper plate" (an early assumption) | **Dial side of the lower plate, Z −3.35 → −7.35** | T1 / T3 | Its screws are in the lower-plate table only; shown so in the section and on 05-05_01 |
| Zwischenrad ⌀ | 24.5 (05-05_05) vs 24 −0.2 (05-05_06) | 24.5 is the lower-plate pocket ("auf 24,5 fräsen"); wheel blank 24 −0.2, D 23.33 | T1 | R4 |
| Screw sizes in `Index.md` | M2.5 / M1.4 (inferred) vs M2.6 / M1.7 (drawn) | **Drawn values** | T1 | 05-08_03a, 05-08_11 |
| Barrel cavity in `Index.md` | ⌀43.00 × 12.20 vs drawn drum | **`Index.md` not used** | — | §2.4 |

---

## 7. Timekeeping verification

| Function | Result | Kind |
|---|---|---|
| Beat | Drawn 80/10 × 15 teeth × 2 = **14 400 vph** (2 Hz, half-second beat) | Independent |
| Hands | Centre → fourth 90/12 × 80/10 = 60:1 (seconds 1 rpm); minute → hour 56/14 × 54/18 = 12:1 | From the inferred counts |
| Going time | Full wind 8.761 fusee turns × 90/14 = **56.3 h** | Independent |
| Power-reserve dial | 56 h → 313.6° (gear train) vs 315° drawn (7 × 45°) | Independent, 0.5 % |
| Stop-work | Stops at sheet 20's full-wind point (8.761), between 56 h (8.71) and the groove end (8.85). The nose passes the retracted beak 0.51 clear at 7.761 turns; the stop is self-locking (rev 2) | Design, verified in plan and Z (closure.py) |
| Constant force | Fusee output torque 354 → 332 N·mm: **±5.4 % over 56 h, ±2.1 % over the top 24 h** (crossed 0.08 band, sheet-20 spring model). Rev 1's ±3.7 % was on the chain basis. Rev 2.1: holds only for a spring within M(5)/M(0) = 1.725 ±0.07 (≤ ±2.8 %). A +8 % tilt, still inside the ±8 % band, would give ±4.8 % | Indicative (the spring model is inferred) |
| Balance frequency from drawn geometry | Hairspring L ≈ 504 (cut note), steel. Balance: drawn rim and arm, drawn weights ⌀6.35 × 6.0, timing nuts as drawn on 05-03_1. **Assumed:** brass for weights and nuts; E 195–210 GPa. **Result: 2.042 Hz (+2.1 %) at E 205; range −0.4 … +3.3 %** | Independent |
| Adjusted frequency | Phillips curves: weights 1.476 g each (≈6.24 long) → **2.000 Hz**; drawn curves: 1.525 g (≈6.45). Coarse by facing the weights (≈36 s/d per 0.01 mm), fine by the 2 timing nuts (−77 s/d per pitch) | Fitted (R5) |
| Temperature compensation | Guillaume rim + steel spring, both drawn. Set by weight position in 6° steps on a 4 / 18 / 32 °C trial | Drawn; needs trial |
| Isochronism | Phillips-correct curves as the build default (rev 2); fusee ±2.1 % over the daily window | Needs a trial (CAD spec §5.11) |
| Escapement safety | 2.35° roller window; locking penetration 0.39; unlocking precedes impulse by 0.15 mm; **unlocking lift along the true detent motion ≥ 0.425** at the Goldfeder (rev 2.1; 0.384 needed); passing-spring loss ≤ 0.65 µJ; horn tip clear of the stone on the return swing; escapement run dry (CAD spec §6 lubrication chart) | Derived / closure.py |
| Fits and clearances | All pivots and journals run in their holes (R2); all end-shakes 0.03–0.10; plan + Z interference pairs clear (min 0.14 axial: stop lever over the band; min 0.86 in plan: band vs plate-gap parts) | `closure.py` |
| **Amplitude (not verified, quantified)** | Escape torque ≈0.106 N·mm; impulse 12–23 µJ per period. To hold 200° the balance needs **Q ≈ 670–1 280** (225°: 850–1 620), depending on the train × escapement efficiency (0.52–0.28). Measure on the timing machine: aim ≥ 200° at full wind, ≥ 170° at 24 h | closure.py prints the budget |
| **Navigation rating (acceptance, recommended)** | Daily-rate variation ≤ 0.5 s/d over 14 days; ≤ 2 s/d change over 4–32 °C after compensation; isochronism ≤ 0.5 s/d between the first and second 24 h. Run in the case and gimbals (1 s ≈ 0.25 nmi of longitude at the equator) | CAD spec §5.11 |

---

## 8. Closure checks

The script is [`_inferred/scripts/closure.py`](_inferred/scripts/closure.py); run `python closure.py`. Totals are at the top of this file.

The independent checks:

- **Centre distances:** two drawn meshes against the plate coordinates (11.850, 22.654).
- **Escapement layout:** Gangrad–Unruh 10.000.
- **Rate:** beat 14 400; power-reserve sweep 313.6° / 315°.
- **Run:** full wind inside the groove; 56.3 h ≥ 56; band remainder 42 mm; barrel turns 4.92 vs sheet 20's "5".
- **Barrel:** hook datum 7.85; hook on the spring centreline; spring width in the cavity.
- **Escape wheel:** ⌀14 window.
- **Balance:** hairspring stack 23.95; frequency over three E values.
- **Plate gap:** two independent routes (pillar minus recesses; 22.3 on 05-07_01).
- **Interference:** escape wheel vs lower cock (4.64 clear); Zwischenbrücke vs Stundenrad (3.20) and Wechselrad (4.34).
- **Rev 2, band:**
  - the drawn click sense;
  - the crossed band never inside the lower cock;
  - 5.00 barrel turns vs "5";
  - the band remainder.
- **Rev 2, fusee and fits:**
  - the body recess floor equals the collar start, and the recess floor + 9.9 equals the small face;
  - the Staubfutter H7 on the Futter r6;
  - the Staubfutter lug vs the Korkring;
  - the key socket on the 3.1□ square, whose corners equal the journal end.

Rev 2 also adds consistency groups `band`, `stop`, `fusee`, `fits`, `escapement` and `balance`: band reverse-bending fatigue and clearances, 24 stop-work checks (incl. self-locking and over-wind strength), the key path, the closing fusee stack, WN-302, hands, unlocking lift, Hebestein coverage, the balance arm and the Phillips-curve frequency. It also adds four rejected alternatives: open band, 0.22 strip, Staubfutter on the plate, 1.5 arm. The script prints the design values it computes (band tangent, stop-work coordinates, torque curve, amplitude budget).

Rev 2.1 adds the group `review`: one independent check and 49 consistency checks, plus eleven rejected alternatives.
- **Independent check:** the drum's 5° undercut matches the cover's 39.39.
- **Consistency checks:**
  - jewel working lengths at both end-shake extremes;
  - the fitted plate gap, with the four upper-plate clearances it protects, and the end-shake fitting;
  - the cover snap;
  - hairspring pinning;
  - hour-wheel float;
  - spring-slope limits;
  - Goldfeder loss and overhang stiffness;
  - the horn tip clear of the stone on the return swing;
  - the unlocking lift along the true detent motion, a 2D simulation about the hinge;
  - the Kloben steady-pin holes.
- **Rejected alternatives:** eleven, listed at the top of this file.

**Plan-view centre distances** recomputed from the lower-plate coordinates (05-08_03a):

| Mesh / relation | From coordinates | From gear data / drawing |
|---|---|---|
| Schneckenrad z90 → Minutentrieb z14 (M 0.4356) | 22.650 | 22.654 (39.21/2 + 6.098/2) |
| Minutenrad → Zwischentrieb | 18.120 | 18.12 drawn |
| Zwischenrad → Sekundentrieb | 12.630 | 12.63 drawn |
| Sekundenrad → Gangtrieb | 11.850 | 11.85 drawn |
| Gangrad → Unruh | 10.000 | 10.00 on 05-04_01 |
| Minutenrad → Wechselrad | 12.600 | 12.6 drawn |
| Schnecke → Auf u. Abrad | 18.400 | 18.4 drawn |
| Minutenrad → Sekundenrad | 23.000 | 23 ±0.03 on the dial |

**Further interference pairs** (from `inf_axial.md` §4.5 and `inf_planview.md` §3.2, all clear): barrel vs Minutenrad (1.9 axial); Schneckenrad vs Minutenrad (0.74); barrel vs Schneckenrad (1.39 radial); barrel vs Zwischenrad (3.95); Auf u. Abrad vs Stundenrad (1.05); the hand stack (1.07 / 1.95); Gangfederkloben vs escape wheel (+9.7).

**Not checked** (they depend on T4 placement): the lower-cock ear around the balance jewel, which must sit below the escape wheel (Z < 17). The stop lever and the Gegensperrkegel are now checked (rev 2). Still to do in CAD: the full kinematic sweep of the escapement (CAD spec §5.11).

---

## 9. Superseded values (do not use)

These appear in the older working files (and in `_inferred/inf_*.md`) and were later overruled:

| Superseded | Replaced by | Why |
|---|---|---|
| Chain 780 as the connector (on edge, 0.27 × 3 plates per link, working length 773.9) | Band 730 | §6.2 |
| 13 helical coils; L 552 / 562 / 590 | L ≈ 504, ≈11.77 coils + 2 curves | Cut note on 05-03_7 |
| Hairspring height 11.5 installed (and the 11.47 ≈ 11.5 check) | 9.5 envelope (11.5 is the blank) | 05-03_5 |
| Phillips T2 curve as the second terminal curve | The drawn curve, mirrored | §6.1 |
| Mainspring 15 × 0.39 × 1310 / 1355, core ⌀11.7; thickness range 0.37–0.41 | 15 × 0.37 × 1385, core ⌀13.3 × 11.7, set-up ¾ turn | Thickness and set-up are drawn on 05-06_20; 11.7 is the core length, not its ⌀ |
| Barrel turns 5.08 | 4.92 | Band riding radius |
| Escape wheel ⌀15 | ⌀14.00 | §6.1 |
| Clear plate gap 19.6; "22.3 − 3.3 = 19" | 19.0; 22.3 = 19.0 + 3.35 | R4 |
| Fusee hole enlarged to 2.83, or a bushing, or a 1:70 taper journal | Journal finished to 2.68 | R2 |
| Fusee arbor square 18.0 / 15.4 / 13.7 | Length chain in §5.2; 18.3 finished | Datum errors |
| Stop element 35° / pin hole A | Stellungssteg at −3° ±4° | §6.2 |
| Train pivots 5.1 / 4.6 / 4.5 | 3.0 | R1 |
| Seconds extension 9.2 | 7.84 | Collision |
| Weights 1.16 g | Drawn 6.0 long = 1.42 g; fitted 1.525 g | Measured length |
| "04 = Anker" | Withdrawn | §2.1 |
| "The cross-section should not be scaled from" | To scale for plates, wheels, cocks, bridges; not for arbor lengths | §3 |
| Earlier closure tally 27 / 31 and its "seven open decisions"; rev-1 tally 24/24, 23/23, 2/2; rev-2 tally 33/33, 67/67, 6/6 | Rev 2.1: 34/34, 116/116, 17/17 | `closure.py` |
| Open band, drum CW, barrel turns 4.92 (rev 1) | Crossed band, drum CCW, 5.00 | §6.2 |
| Band strip 0.8 × 0.22 (rev 1); 0.8 × 0.10 (rev-2 draft) | 0.8 × 0.08 | Reverse-bending fatigue |
| Key tube stopping at the Staubfutter top | Tube bottoms on the Staubplatte (30.71); 15.2 of square engaged, 0.03 play | Bore 7.62 > tube 5.95 |
| Stellungssteg r 6.95, −3° from N; scaled straight lever; pivot P1 (rev 1) | Stop nose + bell-crank stop iron on S1 | §6.2 |
| Staubfutter 22.35 → 40.45 with a ⌀13.4 base counterbore (rev 1) | Pressed on the Futter boss, 23.85 → 41.95 | Fits |
| Fusee square read as corners 3.10 → 2.93 (rev 1) | 3.1□ → 2.92□ across the flats | 05-06_15 |
| Fusee stack from the section (Gegenfeder 3.84 → 5.08, Gegensperrad 5.08 → 6.32, body 6.49, Deckplatte 18.46 → 19.68) | Closing stack (§5.2) | Overlaps |
| WN-302 bore 3.61–3.62 | 2.2 H7 | Journal 2.2 e8 |
| Drawn terminal curve as the build curve | Phillips T2 curve (drawn curve kept as the record) | Isochronism |
| Goldfeder overlap "≈0.02", horn tip 1.65–1.80; rev 2 "Goldfeder tip r 1.650 ±0.005" on a straight horn | Acting corner r 1.630, 0.05 to the wheel side of the B-parallel line, set-over horn (rev 2.1) | True-motion lift |
| Goldfeder 0.15 throughout (as drawn); IE overhang 0–0.05 | Free blade 0.045; overhang 0.12 ±0.01 (rev 2.1) | Return-swing loss; horn tip inside the stone circle |
| Stud hole ⌀0.6 at r 3.66 with a ⌀0.6 → 0.5 pin (rev 2) | ⌀0.7 at r 3.85, strip r 3.76, flatted pin | No room for the pin |
| Balance hole jewels bored straight through 0.45 (rev 2) | 0.25 straight bore + oil sink | Pivot cone in the bore |
| Barrel drum "5° lead-in"; cover "snap lip" with no mate (rev 2) | 5° dovetail snap fit | 06 / 07 agree |
| Plate gap from the drawn pillar tolerance (18.93–19.01); end-shakes as fixed drawn values (rev 2) | Pillars faced as a set to 19.00 +0.01, then end-shakes fitted | At 18.93 the Ruhestein loses its clearance over the wheel |
| Anything in `Index.md` | — | §2.4 |

---

## 10. Gaps in the drawing set, and recommendations

### 10.1 Assembly-level readiness of the drawings (as drawn, before inference)

| Assembly | Status | What's there | What blocks an accurate model |
|---|---|---|---|
| **Plate layout (plan view)** | ✅ Complete | Coordinate tables on 03a and 01a, fully legible; all centre distances verified (§8) | — |
| **Plates & pillars (Z)** | ⚠️ Gaps | Upper plate 3.35; lower plate 3.35 legible only in 03b Schnitt A-B; Pfeiler 19.6 ±0.01; cocks 15 / 10; Federhausbrücke 3.32 | Lower-plate note on 03a struck; recess depths at pillars 39/49 undimensioned; pocket depths missing; Zwischenbrücke has no sheet |
| **Going train** | ⚠️ Gaps | Wheels z90 / z80 / z80, cycloidal; pivots given | Third and fourth pinion leaf counts missing; cycloid generating radii never defined; 1940–43 and 1946/48 pivot values disagree |
| **Motion work & hands** | ⚠️ Gaps | Hands complete; Wechselrad z56, Stundenrad z54, Auf u. Abrad z120 | Cannon, change and setting pinions, Minutenrohr, Stundenbutzen and Wechselbutzen have no sheet; the seconds-hand bore 1.2 has no mating seat |
| **Fusee** | ⚠️ Gaps | Schneckenrad z90 M 0.4356 fully given; clicks, springs and plates complete; groove root radii 9.30 → 14.75 | No helix definition; arbor segment lengths missing; stop-work only sketched; ratchet tooth forms incomplete |
| **Barrel & connector** | ❌ Insufficient | Drum, cover, ring, blank and hooks complete; "Zugfeder 15" | Mainspring length and ends not given (thickness 0.37 only on 05-06_20); later-family arbor and pin missing; barrel hook 05 07 01-3 missing; chain vs band choice not stated |
| **Escapement** | ❌ Insufficient | Layout 05-04_01 numeric (centres 10.00 / 25.68 / 23.8, roller 6.78); Goldfeder and Gangfederkloben complete | Escape wheel ⌀ conflict; tooth form has no z; detent-spring lengths unnumbered, with bracketed alternatives; no discharge roller, jewels or stones |
| **Balance & hairspring** | ❌ Insufficient | Wire 0.52 × 0.285, ⌀12.8, blank 15 turns LH; one terminal curve as a polar table; rim layers | Pitch not printed (derived 0.73 vs 0.767); second terminal curve missing; rim screw positions, masses and thread missing; two staff families |
| **Jewels & bushings** | ❌ Absent | Plate bore "kalibr." sizes only | No chaton, jewel, endstone or WN-300/301/302 Messinglager sheets |
| **Case & gimbal** | ❌ Insufficient | Gehäusetopf turned profile, Glasrand, Verschlußplatte, key parts | Gimbal ring, Klobens and springs (05 01 00-3…-7) missing; the movement-to-case fixing is only on the Werkring sheet 05-08_07 and the cross-section, not on the case sheets; the layout's "innerer Gehäuse⌀ 100" matches no dimension on the Gehäusetopf |
| **Wooden box** | ⚠️ Gaps | Outer 185 × 185 × 180; tongue complete | Joinery and padding undetailed; dimensions pencil-amended |

### 10.2 Parts referenced but with no drawing

- **Power:** Zugfeder (width "15" only); Federkern 05 07 02-1 and pin 05 07 02-2 (later family); Bandhaken 05 07 01-3; Schneckenband strip 05 07 03-1; ratchet click U23.
- **Fusee:** Stellhebel, Stellfeder, stop-pin, stop pivot; 05 06 04-4; Niet 05 06 02-4; the maintaining-click wire spring; WN-19, WN-21.
- **Train / motion work:** Sekundentrieb and Zwischentrieb tooth data; Viertelrohr; Wechseltrieb 05 02 02-2/-3; Stundenrohr 05 02 03-2; Auf u. Ab hub 05 02 04-2; Minutenrohr 05 05 03-3; Zeigerstelltrieb; Gegensperrkegel arbor 05 05 05-2.
- **Escapement / balance:** Auslöserolle; Auslösestein, Hebestein, Ruhestein; Gangradbutzen 05 04 05-3; compensation masses and timing screws 05 03 01-2/-3/-4; WN-12/12a.
- **Frame:** Zwischenbrücke 05 08 04-1; 05 08 01-1/-4/-5; 05 08 02-2; all chatons, jewels and endstones; Messinglager WN-300/301/302; screws and pins WN-22/34/52/203.
- **Case:** gimbal ring, Klobens, Verschlußfeder (05 01 00-3…-7); Feststeller; WN-71/72/78/79/80/400. (The Werkring is **not** missing: it is 05-08_07, §5.4.) All of these are designed in [Federchronometer05_Case_Gimbal.md](Federchronometer05_Case_Gimbal.md).
- **Missing scan:** 05-04_22 Ankerrad (Anker variant only).

### 10.3 Remaining uncertainty, and what would remove it

| Item | Current basis | Would be settled by |
|---|---|---|
| Cycloidal flank curves | Convention (T4); tooth extents are drawn | Wempe tooth-form standard sheet |
| Jewel and endstone settings, chatons | T2/T4 | Sheets 05 04 06/08, 05 08 xx |
| Stop-work (rev 2 design: nose, bell-crank lever, spring, pivot S1) | T4, verified by closure.py | Stop-work detail sheets; a surviving movement |
| Band run (crossed) | T1/T3 by three independent checks | A photograph of a 1948 Feder movement with its band |
| Balance Q and amplitude | Energy budget only | Measurement on the timing machine |
| Family-B barrel arbor | Closure | Sheet 05 07 02-1 (1948) |
| Mainspring length, material and ends | T2/T4 (thickness 0.37 and ¾-turn set-up are drawn) | Mainspring sheet or a surviving spring |
| Weight and timing-nut material | Brass assumed | Material callout |
| Second terminal curve; meaning of the faint series | Same curve mirrored | Better scan of 05-03_7 |
| Detent-spring bracketed values, e.g. "0,25 (0,22)" | Main values modelled | — |
| Meaning of "D = 15,0" and "2400 Schwingungen" | Not used | — |
| All "?" readings | — | Original high-resolution scans (≥300 dpi) |

### 10.4 Recommendations

1. **Obtain high-resolution originals** (≥300 dpi) from the DGC / Wempe archive. Most "?" values and the struck values (lower-plate thickness, detent-spring lengths) would likely become readable.
2. **Source the missing sheets** in §10.2. In priority order: mainspring, Zwischenbrücke, pinions, jewel settings, stop-work, and the WN-Norm standard sheets.
3. **Where nothing can be sourced**, measure a surviving movement, or keep the documented assumptions of §5 and flag every T4 parameter in the CAD file.
4. A **kinematically and dynamically correct** model is feasible today from §5. A **manufacturing-accurate** model is not.

---

## 11. External references (corroboration only; the drawings stay primary)

- Uhren-Muser auction 96, lot 250, Lange Einheitschronometer No. 5499, c. 1943 (fetched listing text):
  - 56 h reserve;
  - Earnshaw spring detent;
  - "Griesbach" balance "with 4 weights and 2 screws" (matches the 4 used weight holes and 2 timing nuts);
  - 1943+ units with "thinner movement plates and only three pillars" (matches the 3 pillars on R37).
  - The phrase "chain and fusee were used instead of the simple steel band" comes from the same listing via a web-search summary; it was not on the fetched page text, and it concerns Lange units.
  - https://uhren-muser.de/en/archives/96/45443
- Royal Museums Greenwich ZAA0551, Wempe "BC100 Einheits calibre, two-day" movement photo. A later unit, used for qualitative layout only: tall L-shaped upper cock, two-arm bimetallic balance with cylindrical weights, helical spring, barrel bridge with ratchet and click. https://www.rmg.co.uk/collections/objects/rmgc-object-79656
- Dorotheum, Lange No. 5024 (chain and fusee, compensation balance, cylindrical spring, 56 h): https://www.dorotheum.com/en/l/733514/

---

## 12. Where the detailed derivations live

| Topic | File |
|---|---|
| Per-sheet transcriptions | [`_audit/audit_*.md`](_audit/) |
| Axial stack and section calibration | [`_inferred/inf_axial.md`](_inferred/inf_axial.md) |
| Plan-view outlines, 001 calibration, stop-work | [`_inferred/inf_planview.md`](_inferred/inf_planview.md) |
| Escapement, balance, terminal curve | [`_inferred/inf_escapement.md`](_inferred/inf_escapement.md), [`_inferred/res_hairspring.md`](_inferred/res_hairspring.md) |
| Fusee helix, band, arbor | [`_inferred/inf_fusee.md`](_inferred/inf_fusee.md), [`_inferred/res_fusee.md`](_inferred/res_fusee.md) |
| Barrel family B, band vs chain | [`_inferred/res_barrel.md`](_inferred/res_barrel.md) |
| Case, bezel, Werkring seat, gimbal | [`Federchronometer05_Case_Gimbal.md`](Federchronometer05_Case_Gimbal.md) |
| Scripts | [`_inferred/scripts/`](_inferred/scripts/) (`closure.py` and `case_closure.py` are self-contained; the others hard-code a session scratchpad path) |

The `inf_*.md` files are earlier inference passes; where they differ from this file (see §9), this file wins.