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
| IND | **Independent**: tests a value against drawn data it was not derived from | **24 / 24 pass** |
| CON | **Consistency**: passes by construction, so it shows feasibility, not evidence | 23 / 23 pass |
| REJ | **Rejected alternatives**: ⌀15 escape wheel; the drawn 9.2 seconds-arbor extension | 2 / 2 fail as expected |

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

**With the rules in §4 and the inferences in §5, the model is kinematically and dynamically correct and keeps time** (§7). It is **not manufacturing-accurate** in the T4 areas listed in §5.5 and §10.3.

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

Scope is the **Federchronometer movement**. The case, gimbal and box are out of scope (their gaps are in §10.1).

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
| Fusee connector | **Steel band, Schneckenband 05 07 03, 730 ±3**, strip **0.8 × 0.22** hardened steel, hooks 05-07_12/13 brazed on | T1/T2 | §6.2. Remainder on the barrel at full wind 42.1 mm |
| Fusee groove | **Left-hand helix, constant lead 1.20**; groove centre z = 1.235 + 1.2·n from the large face; ends at n = 8.85 turns; one root radius per turn, 9.30 → 14.75. A 30°-step r(θ), z(θ) table is in `inf_fusee.md` | T1/T3 | Lead from 0.87 + 0.33; the groove end closes two ways to 4° |
| Groove section | 0.87 wide × **0.6** deep | T1 | 05-06_02-2 |
| Fusee radius at one turn | **10.07 ±0.03** | T3 | |
| Schneckenkörper length | **9.9** | T3 | |
| Full wind | **8.761 fusee turns = 56.3 h** | T1 | Great wheel z90 / Minutentrieb z14; sheet 20 |
| Barrel turns used | **4.92** (sheet 20: "5") | T1 | Band riding radius |
| Fusee arbor (Z) | Lower tip −9.45; journal −6.55 → 0, **finished cylindrical ⌀2.68 (f7) through the 2.70 plate hole**; seat 0 → 8.61; collar 8.61 → 16.51; 6.1 seat 16.51 → 19.61; upper journal 19.61 → 27.61; square to 45.91, **finished 18.3** (≈17.0 flats + dome); end-shake 0.04 | T1/T3, T4 (R2) | Shoulder span **19.61** (drawn 19.7 +0.05, overridden −0.09), forced by the Schneckenfutter end at Z 19.65. The 2.8 journal stays inside the movement; the 1.6 pivot sits 3.2 below the plate, inside the Auf-u-Ab-Trieb |
| Gegenfeder | **Part sheet 05-06_10**: constant 2 × 1.35 | T3 | |
| Ratchets | Gegensperrad z120: root ⌀35.85, radial face, back ≈54°. Schneckensperrad z35: depth 0.75, face undercut 8° | T2/T4 | Depths drawn; flank angles by convention |
| Stop element | **Stellungssteg** (stop bar, cross-section callout 05 06 03-1) on the fusee small end at r ≈ 6.95, phased **−3° ±4° from groove end N** (viewed from the back), giving a stop at 8.76 turns = 56.3 h | T3/T4 | §6.2 |
| Stop lever | 1.94 wide, ≈26 long, from (6.02; 26.38) to (17.20; 2.83); stop face at R6.3–6.8, bearing 263°; stop face trimmed 0.6 so it clears the banking pin | T3 (±5 %) | `inf_planview.md` |
| Banking pin | Hole 7, **R14.000 from the fusee axis** | T1 | |
| Stellfeder | Steel leaf 0.15–0.2 × 1.5 × ≈14, screwed to the upper-plate underside, holding the lever out of the band's path until the top turn | T4 | No sheet |
| Sperrkegel pivot | New table point N17.046 W29.474 (closes the drawn "12") | T1 | |

### 5.3 Escapement and balance

| Parameter | CAD value | Tier | Derivation |
|---|---|---|---|
| Escape wheel | **⌀14.00, z15** | T1 | §6.1. 05-04_23 tooth pitch measures 24.2°; beat closes at 14 400 vph |
| Escape tooth | Tip R7.00 with a 1½° land (0.1834 chord, printed "0,18 34"); straight face tangent to ⌀6.06 (25.65° to radial); root ⌀11.7; back-step ⌀12.1; concave back R3.03 | T1/T3 | 05-04_23 + z15 + 05-04_01 |
| Escape arbor | **22.8 −0.02; endstone span 22.83** | T1 / T4 settings | |
| Detent spring | **26.5 +0.5/−0.3** = horn 4.4 + Kloben 18.8 + half foot 3.3; Federung 4.8, Steg 8.7. Model the main values, not the bracketed alternatives such as "0,25 (0,22)" | T1/T3, T4 | Layout 18.81 at 10:1. The 25.68 / 23.8 point is the Kloben screw, not the bending point |
| Detent anchor | **Kloben screw on plate hole 13; locking stone and horn at the 05-04_01 layout positions.** The Kloben foot outline (no plan dimensions) absorbs the 1.2 mm offset (equivalent to the −3.9° Kloben rotation in `inf_escapement.md`) | T4 | Re-check locking depth once modelled: a 0.3 tangential stone shift at R7 is 2.5°, about the size of the roller window |
| Locking stone | ⌀0.75 | T1 | |
| Discharge (unlocking) roller | Body r 1.37; stone tip r 1.65–1.71; stone width 1.7 | T3 | 05-04_01 |
| Impulse stone | Width 1.7 in the ⌀6.78 Heberolle | T1/T3 | |
| Stone phasing | 79° between impulse and discharge stones; unlocking takes 11°; wheel budget 24° = 1½ + 21 + 1½. Unlocking precedes impulse by 0.15 mm; locking penetration 0.39; roller window 2.35° | T3/T2 | Matches the printed 24° / 21° / 1½° arcs |
| Balance staff | **25.6 −0.02, pivots 0.21**, roller seats 4.1 / 1.6 (05-03_3-2) | T1 | §6.1 |
| Balance jewel span | **25.65** (endstone recesses ≈1.35 each side); end-shake 0.05 | T3 | |
| Hairspring wire | "Bandstahl 0,52 × 0,285 poliert": **steel**, 0.52 × 0.285 | T1 | Pairs with the Guillaume rim |
| Hairspring blank (05-03_6) | 15 turns LH, 11.5 high, outer ⌀12.8, pitch 0.73 (derived, not printed), cut length 603. **This is the blank as wound on its former, not the finished spring** | T1 | R4 |
| Hairspring, finished | **Active length ≈504 = ≈11.77 helical coils + 2 terminal curves of 20.55 each**; coil envelope **9.5** (over the strip edges); 05-03_5: 13.4 = 3.15 + 9.5 + 0.75 | T1 length / T3 envelope | 05-03_7: "vorm biegen der Kurve auf 13 Umgänge −3,5 mm kürzen". 11.77 coils rise 9.11; the 0.39 remainder is taken by the curve transitions (T3) |
| Hairspring position | **Stud arm on the cock top (Z 37.35); collet bottom on the balance-arm top (Z 23.95)**. Stud leg 1.8 g6 in the cock's 1.8 H7 slot; cock underside relieved 0.8 within r 12. Stud hole "bei Montage gebohrt" | T1 | 37.35 − 13.4 = 23.95, closing to 0.00 |
| Terminal curves | **The same drawn curve at both ends**: polar table on 05-03_7 at 10° steps, radii = inner edge 6.12 → 3.37; strip centreline = inner edge + 0.1425; mirrored at the stud end. Stud and collet pins both at r ≈ 3.5 | T3 | Meets Phillips' 1st condition, not the 2nd (§6.1). A Phillips-correct T2 curve is in `inf_escapement.md` for isochronism simulation only |
| Balance rim | Guillaume rim and arm, "Nickelstahl Sonderlegierung u. Messing" (05-03_4); rim mass 2.87 g | T1 | |
| Balance weights | 4 holes used (in the 6°-tick sectors 30° from each cut), 4 spare for temperature adjustment; thread ≈1.0 × 0.16; weights ⌀6.35, **fitted 1.525 g each (≈6.45 long, brass)**; drawn 6.0 long = 1.42 g | T3 / fitted (R5) | §7 |
| Timing nuts | 2 off, ⌀4.23 × 3.26 at r 18.6 (measured on 05-03_1), brass assumed | T3/T4 | They carry ≈12 % of the inertia |
| Jewels | Hole = pivot + 0.01–0.02 (balance 0.22–0.23, escape 0.25–0.26); setting seats 5.2 H7 (balance, escape upper) and 2.50 (escape lower); screwed chatons 2 × M1.2; settings set the endstone spans 22.83 (escape) and 25.65 (balance); thicknesses and endstones by convention | T2/T4 | No sheets for 05 04 06/08 |

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
| Wheel planes | Minutenrad 0.5–1.8; Zwischenrad −1.25 to −0.25 (in the 24.5 through-cut); Sekundenrad 4.12–5.12; Gangrad 17.0–18.5; balance rim 22.85–26.7; Schneckenrad 2.5–3.8; Auf u. Abrad −9.40 → −8.37 | T1 chains, section-confirmed ±0.2 |
| Dial | Faces −10.35 / −11.65 | T3 |
| Hands | Auf u. Ab −11.95 / −12.43; seconds −12.1 / −12.4; hour −13.50 / −14.15 (35 long, sweeps r 23); minute −16.1 / −16.75 | T3 |
| Recesses | Pillar seats 0.3; J-K 0.62 (drawn 0.7); G-H 1.78 | T3 |
| Bushings (Messinglager WN-300/301/302) | OD = plate "kalibr." bore (e.g. 4.59 +0.012); hole = pivot + 0.01–0.02; height = plate thickness | T2 |
| WN screws and pins | Slotted cheese-head, DIN-style proportions; threads as drawn in the plate tables (M2.6 / M1.7 / M1.4 / M1.2) | T4 heads |

### 5.5 Still designed-in (T4), with the recommended design

| Part | Recommended design |
|---|---|
| Cycloidal tooth flanks | §5.1 |
| Jewel and endstone settings 05 04 06/08 etc. | Screwed chatons, 2 × M1.2; hole = pivot + 0.01–0.02; settings set the endstone spans 22.83 and 25.65 |
| Barrel click spring, maintaining-click wire spring | Steel leaf / ⌀0.4 wire, on the drawn screw positions (row 5 Drahtfeder, row 46 Sperrkegel) |
| Stellfeder, stop-lever pivot | §5.2 |
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
| Phillips conditions | — | **Model as drawn** | T1 | 1st condition met (centroid 1.6° off the perpendicular); 2nd not met (y_G 3.00 vs R²/L 1.91). The factory adjusted for isochronism |
| Hairspring material | "Bandstahl 0,52 × 0,285 poliert" | **Steel** | T1 | Pairs correctly with the Guillaume rim (05-03_4) |
| Detent anchor | Layout point (25.68 / 23.8) vs plate hole 13, 1.2 mm apart | **Kloben screw on hole 13; locking stone and horn at the layout positions** | T4 | The machined hole and the functional layout are both kept |
| Detent-spring bracketed values | e.g. "0,25 (0,22)" | **Main values** | T4 | The sheet is scaled to the main values |
| "2400 Schwingungen" (05-03_1) | — | Not used | — | The rate is fixed by the train. 2400 = 14 400 / 6; meaning unresolved |

### 6.2 Power

| Item | Drawn options | Decision | Tier | Evidence |
|---|---|---|---|---|
| Fusee connector | Chain 05-07_14 (780, 1941); band 05-07_11 (730, 1943) | **Steel band 730 ±3, strip 0.8 × 0.22** | T1 / T2 | The 1948 groove is 0.87 × **0.6** deep: it holds the 0.22 band fully, but only 30 % of the chain's 2.0 radial height (the 1941 chain body was 1.2 deep). The 02-2 hook slot (0.8, with a ⌀0.55 cross-pin) fits the 0.8 band hook; the chain hook interferes. The struck note on 02-1 reads "Gangtiefe für Kettenersatzband … auf 0,6" |
| Barrel outer ⌀ | 41.5 (05-07_01/02) vs 41.6 −0.1 (05-07_06) | **41.6 −0.1** | — | R3 |
| Barrel hook height | 7.9 (02); 9.05 ±0.05 (06); 7.85 ±0.05 (04) | **9.05 from the outer bottom = 7.85 from the floor = the spring centreline** | T1 | Cavity from floor 1.25 to seat shoulder 16.9 → 15.65, half 7.825 (R4) |
| Barrel family | A (01/02/09, 1941) vs B (04/06/07/08, 1944–48); hub bore 4.5 vs arbor seat 5 | **B** | T1 | Hub bores 4.5 +0.1 on both 06 and 07; arbor A's ⌀5 seats cannot enter. The Federkern labelled family B (40.2) is drawn with family-A proportions (43.1) |
| Family-B arbor | 08 gives 40.2, "5", "10" only; the part sheet 05 07 02-1 is missing | **40.2 = 5 + 22.25 + 12.95; seats 4.48; core ⌀13.3, length 11.7; pivots 2.88 / 3.88** | T1 closure / T4 | Frame span 22.35, giving 0.10 end-shake. The core length fits the 1948 drum's 11.8 allowance (a 12 core does not) |
| What 22.3 on 05-07_01 spans | Read earlier as "plate gap" | **Lower-plate inner face → barrel-bridge underside = 19.0 + 3.35** | T1 | The upper plate is cut away over the barrel |
| Mainspring | "Zugfeder 15" (05-07_01); "Zugfeder 15 × 0,37", "3/4 Umgang gespannt" (05-06_20) | **15 × 0.37 × 1385, set-up ¾ turn** | T1 / T2 length | §5.2 |
| Fusee lower journal vs hole | 2.8 ±0.02 (05-06_15) vs 2.70 ±0.009 (03a row 10) | **Journal finished to 2.68 through the plate** | T4 (R2) | No bushing drawn |
| Fusee arbor lengths | 05-06_15 between centres; 05-06_01 assembly | **Shoulder span 19.61** (drawn 19.7 +0.05, overridden −0.09); **finished square 18.3** | T1 / T3 | Forced by the Schneckenfutter end at Z 19.65. The earlier 15.4 / 13.7 square readings used wrong datums |
| Stop element | Pin hole A (02-2) or the Steg of section C-D | **Stellungssteg (cross-section callout 05 06 03-1), r ≈ 6.95, phased −3° ±4° from groove end N** | T3 / T4 | Hole A is at r ≈ 17 at the large end, out of the lever's reach (6.3–6.8). Under both viewing readings it falls outside the 50° stop window (8.71–8.85 turns) |
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
| Stop-work | Phased to sheet 20's full-wind point (8.761), between 56 h (8.71) and the groove end (8.85): +0.05 / −0.09 turns | Design choice, not a verification |
| Constant force | Fusee output torque flat to ±3.7 % (sheet 20 Kraftverlauf) | Drawn |
| Balance frequency from drawn geometry | Hairspring L ≈ 504 (cut note), steel. Balance: drawn rim and arm, drawn weights ⌀6.35 × 6.0, timing nuts as drawn on 05-03_1. **Assumed:** brass for weights and nuts; E 195–210 GPa. **Result: 2.042 Hz (+2.1 %) at E 205; range −0.4 … +3.3 %** | Independent |
| Adjusted frequency | Weights 1.525 g each (⌀6.35 × ≈6.45) → **2.000 Hz**. Fine regulation by the 2 timing nuts | Fitted (R5) |
| Temperature compensation | Guillaume rim + steel spring, both drawn | Drawn |
| Isochronism | Fusee ±3.7 %; terminal curves meet Phillips' 1st condition only | Needs adjustment in practice; for simulation, swap in the T2 Phillips curve |
| Escapement safety | 2.35° roller window; locking penetration 0.39; unlocking precedes impulse by 0.15 mm | Derived |
| Fits and clearances | All pivots and journals run in their holes (R2); all end-shakes 0.03–0.10; plan + Z interference pairs clear (min 0.53) | `closure.py` |
| **Not verified** | Amplitude (impulse energy vs balance losses). The balance's quality factor is unknown, so any pass/fail would be false precision; tune it in a dynamic simulation if you run one | — |

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

**Not checked** (they depend on T4 placement): the lower-cock ear around the balance jewel, which must sit below the escape wheel (Z < 17); the stop lever above the fusee top; the Gegensperrkegel vs the Schneckenrad.

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
| Earlier closure tally 27 / 31 and its "seven open decisions" | 24/24, 23/23, 2/2; all decided in §6 | `closure.py` |
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
| **Case & gimbal** | ❌ Insufficient | Gehäusetopf turned profile, Glasrand, Verschlußplatte, key parts | Gimbal ring, Klobens and springs (05 01 00-3…-7) missing; no movement-to-case fixing shown; the layout's "innerer Gehäuse⌀ 100" matches no dimension on the Gehäusetopf |
| **Wooden box** | ⚠️ Gaps | Outer 185 × 185 × 180; tongue complete | Joinery and padding undetailed; dimensions pencil-amended |

### 10.2 Parts referenced but with no drawing

- **Power:** Zugfeder (width "15" only); Federkern 05 07 02-1 and pin 05 07 02-2 (later family); Bandhaken 05 07 01-3; Schneckenband strip 05 07 03-1; ratchet click U23.
- **Fusee:** Stellhebel, Stellfeder, stop-pin, stop pivot; 05 06 04-4; Niet 05 06 02-4; the maintaining-click wire spring; WN-19, WN-21.
- **Train / motion work:** Sekundentrieb and Zwischentrieb tooth data; Viertelrohr; Wechseltrieb 05 02 02-2/-3; Stundenrohr 05 02 03-2; Auf u. Ab hub 05 02 04-2; Minutenrohr 05 05 03-3; Zeigerstelltrieb; Gegensperrkegel arbor 05 05 05-2.
- **Escapement / balance:** Auslöserolle; Auslösestein, Hebestein, Ruhestein; Gangradbutzen 05 04 05-3; compensation masses and timing screws 05 03 01-2/-3/-4; WN-12/12a.
- **Frame:** Zwischenbrücke 05 08 04-1; 05 08 01-1/-4/-5; 05 08 02-2; all chatons, jewels and endstones; Messinglager WN-300/301/302; screws and pins WN-22/34/52/203.
- **Case:** gimbal ring, Klobens, Verschlußfeder (05 01 00-3…-7); Feststeller; movement fixing / Werkring; WN-71/72/78/79/80/400.
- **Missing scan:** 05-04_22 Ankerrad (Anker variant only).

### 10.3 Remaining uncertainty, and what would remove it

| Item | Current basis | Would be settled by |
|---|---|---|
| Cycloidal flank curves | Convention (T4); tooth extents are drawn | Wempe tooth-form standard sheet |
| Jewel and endstone settings, chatons | T2/T4 | Sheets 05 04 06/08, 05 08 xx |
| Stellungssteg phase; Stellfeder; lever pivot | T3/T4 | Stop-work detail sheets |
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
| Scripts | [`_inferred/scripts/`](_inferred/scripts/) (`closure.py` is self-contained; the others hard-code a session scratchpad path) |

The `inf_*.md` files are earlier inference passes; where they differ from this file (see §9), this file wins.