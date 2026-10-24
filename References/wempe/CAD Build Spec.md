# Wempe Federchronometer 05: CAD build specification

**Movement:** Wempe Einheits-Chronometer, *Federchronometer 05*. Two-day marine chronometer with spring-detent (Earnshaw) escapement, reverse fusee (crossed steel band), 14 400 vph, 56 h.

**Revision 2 (2026-10-22): reconciliation pass.** Every open point is now closed with one governing value (the full list is §7). What can only be settled by CAD motion studies, measurement or trials is listed as a to-do in **§8**. Where an earlier section and a later one disagreed, the value given here governs. Every rev-2 decision is checked by `_inferred/scripts/closure.py` (Appendix C). The changes that alter the movement are:

- **The band is crossed (reverse fusee).** The barrel drum runs **CCW** seen from the back, the opposite way to the fusee. An open band would pass through the lower balance cock (Z 9–19) from 2 to 8.76 turns. The barrel click drawn on 001 locks the arbor against CW, and a crossed band gives 5.00 barrel turns against the "5" on sheet 20.
- **Band strip 0.8 × 0.08**, not 0.22. A crossed band is bent one way on the fusee and the other way on the drum, so fatigue governs. A 0.22 strip would see 2.4 GPa on the fusee small end (Goodman safety 0.63); 0.08 gives 1.22.
- **A working stop-work** (§3.5):
  - a bell-crank stop iron cammed by the band's rising edge, and a steel stop nose on the fusee small end;
  - inclined stop faces that keep it engaged under load, and a banking pin for the engaged position;
  - strength checked at a 500 N·mm over-wind;
  - it replaces the scaled lever, which had no free axial plane.
- **The fusee stack closes**, the Staubfutter is pressed onto the Schneckenfutter boss, and the fusee square is **3.1 across the flats**, which fits the drawn key.
- **One value per part** for the escape arbor, the Gangfederkloben, the motion work, the centre-arbor front bush (2.2 H7) and the hands.
- **Timekeeping defaults for a working instrument:** Phillips-correct terminal curves, an unlocking-lift setting, and rating and acceptance procedures (§5.11).

**Revision 2.1 (2026-10-22): clockmaker's review.** These changes make the movement buildable and keep its rate stable. Each is listed in §7 (#7, #36, #37 and #41–#54), and each new value has a matching check in `closure.py` (group `review`):

- **Unlocking setting:** the Goldfeder's acting corner moves to r 1.630, 0.05 to the wheel side of the line through the balance axis parallel to the detent, on a set-over horn. Checked along the detent's true motion, the rev-2 setting (r 1.650 on a straight horn) could not release the stone (§5.3).
- **Goldfeder:**
  - its free blade is thinned to 0.045; at the drawn 0.15 the return swing would cost 5–24 µJ of a 12–23 µJ budget;
  - it overhangs the horn tip by 0.12, so on the return swing the stone never meets the banked horn (§5.3).
- **Gangfederkloben steady-pin holes** G1 and G2 are added to the Oberplatte (§2.2).

- **Balance hole jewels:** 0.25 straight working bore, then an oil sink. A bore through the full 0.45 jewel would grip the cone of the 0.4 pivot (§5.10).
- **Hairspring pinning:** the stud hole goes back to the drawn ⌀0.7 at r 3.85. The strip lies on the hole's inner side and each taper pin has a flat beside it. The rev-2 ⌀0.6 hole left no room for a pin (§5.9).
- **Barrel cover:** it is a 5° dovetail snap fit. The drum seat is an undercut, not a lead-in (§3.2).
- **The plate gap is fitted.** The pillars are faced as a set to 19.00 +0.01, then the end-shakes are fitted to it (§2.3, §2.9). The drawn pillar tolerances allow 18.93–19.01, and at 18.93 the Ruhestein would lose its clearance over the escape wheel.
- **Mainspring acceptance also limits the slope** of the torque curve. The fusee test also checks the daily spread (§3.1, §3.6, §8).
- **Rate-stability rules:**
  - a lubrication chart states which escapement surfaces must stay dry (§6);
  - the Guillaume rim alloy and its manufacture are specified (§5.6).
- **Assembly and use:**
  - an hour-wheel collar holds the hour wheel axially (§4.3);
  - the escapement is pre-set before the plates are closed (§6);
  - the staff under the brass collet is defined (§5.5);
  - operating notes are added for use at sea (§6).
- **Stale rev-1 values removed** (§1.6, §4.2, §4.7), and the legible but unexplained marks are recorded as unused (§7 #54).

**This file is self-contained.** Every value needed to model the movement, part by part, is here. The reasons, the alternatives ruled out, the timekeeping verification and the confidence of each value are in the companion **[Federchronometer05.md](Federchronometer05.md)** (evidence and decision record; its §5 is a summary of this spec).

Do **not** use `Index.md` or `Missing_details.md`: they are unsourced, and their file names are swapped.

---

## 1. Conventions and overview

### 1.1 Scope

| In scope | Partial (Appendix A) | Out of scope |
|---|---|---|
| The complete movement: frame, power (mainspring, barrel, band, fusee, maintaining power, stop-work), going train, escapement, balance and hairspring, motion work, power-reserve work, hands, dial | Case pot, bezel, closing plate, key, gimbal: specified separately in `Federchronometer05_Case_Gimbal.md` (Appendix A) | Ankerchronometer variant; Zeigerstellung (05-33, conditional); Unruhhaltevorrichtung (05-36); Sekundenkontakt (05-38); wooden box (51-00) |

### 1.2 Units and numbers

- All dimensions are in **mm**. Angles are in degrees.
- Values use a **decimal point**. Drawing text quoted in "…" keeps the original German decimal comma (e.g. "0,24 Steinlager einpassen").
- Tolerances are written as on the drawings: `19.6 ±0.01`, `4.5 +0.1`, `2.6 H7`.

### 1.3 Coordinate system

| Axis | Definition |
|---|---|
| Origin | Centre of the Minutenrad (centre-wheel) arbor = centre of both plates (plate-table hole 1) |
| **x** | Toward **O** (Ost) is positive, toward W is negative, as in the plate coordinate tables |
| **y** | Toward **N** is positive, toward S is negative |
| **Viewing side** | All plan coordinates and angles are **viewed from the back**, i.e. from the upper-plate (Oberplatte) side, looking toward the dial. This is the frame of the drawn coordinate tables |
| Plan angles | Counter-clockwise from +x, viewed from the back |
| **Z** | **Z = 0 at the inner face of the lower plate (Unterplatte)**, positive toward the upper plate. The dial side is negative Z |

Key planes:

| Plane | Z |
|---|---|
| Lower plate, dial-side face | −3.35 |
| Lower plate, inner face | 0 |
| Upper plate, inner face | 19.00 |
| Upper plate, outer face | 22.35 |
| Upper balance cock top | 37.35 |
| Dial, front face | −11.65 |

**Rotation senses while running, viewed from the back:**

| Arbor | Sense from the back | Speed |
|---|---|---|
| Fusee (Schnecke) | CW | 1 turn / 6.43 h |
| Centre wheel (Minutenrad) | CCW (hands therefore run CW seen from the dial) | 1 rph |
| Third wheel (Zwischenrad) | CW | 7.5 rph |
| Fourth wheel (Sekundenrad) | CCW | 1 rpm |
| Escape wheel (Gangrad) | CW | 8 rpm |
| Barrel drum (Federhaus) | **CCW** (crossed band: opposite to the fusee) | 5.00 turns per full run |

Each sense alternates along the train. While winding, the fusee turns CCW from the back and the drum CW. The barrel arbor stays still; set-up turns it CCW.

**Running position.** In use the movement lies dial up in its gimbals, so +Z points down. Every arbor then rests on its back (upper-Z) shoulder or endstone; the diamond endstone in the upper balance cock carries the balance. The positions listed in this spec are the opposite extreme (dial down), so check clearances at both extremes by adding the end-shake.

### 1.4 Tier codes (how sure a value is)

| Tier | Meaning |
|---|---|
| **T1** | Drawn, or closes exactly from drawn values |
| **T2** | Engineering rule (the formula is stated) |
| **T3** | Scale-measured from a calibrated drawing |
| **T4** | Convention or fitted value, needed to complete the model |

A value marked **OVERRIDDEN (drawn: x)** deliberately replaces a drawn value so that the movement fits and runs. The reason is in the evidence file.

### 1.5 Three modelling rules that apply everywhere

1. **Model the finished part.** Arbor and pinion sheets show the part as turned between lathe centres. Finished pivot lengths in this spec are the fitted lengths, so do not add the drawn centre cones or points.
2. **Holes are as drawn; pivots are made to fit them.** Running pivots are one H7/f7-class running fit under their hole or jewel.
3. **Tooth form.** Every wheel and pinion takes its z, tip ⌀ (D), pitch ⌀ (d), root ⌀ (dg), pitch (t) and tooth thickness from the drawings. Only the flank curve is a convention: cycloidal, with the generating circle = ½ the pinion pitch radius, an epicycloid addendum fitted to D, radial pinion flanks and a rounded leaf head (T4).

### 1.6 The movement at a glance

| Function | Value |
|---|---|
| Plates | ⌀85 h6 × 3.35, clear gap 19.0, 3 pillars on R37 |
| Beat | 14 400 vph (balance 2.000 Hz, half-second beat) |
| Going time | 56.3 h at full wind (8.761 fusee turns); power-reserve dial 0–56 h |

The train, from fusee to escape wheel:

| Mesh | Wheel → pinion | Ratio | Centre distance |
|---|---|---|---|
| Fusee wheel → centre pinion | Schneckenrad z90 → Minutentrieb z14 | 6.43 | 22.650 |
| Centre → third | Minutenrad z90 → Zwischentrieb z12 | 7.5 | 18.120 |
| Third → fourth | Zwischenrad z80 → Sekundentrieb z10 | 8 | 12.630 |
| Fourth → escape | Sekundenrad z80 → Gangtrieb z10 | 8 | 11.850 |

Motion work and power-reserve work:

| Mesh | Teeth | Ratio | Centre distance |
|---|---|---|---|
| Cannon pinion → change wheel | Viertelrohr z14 → Wechselrad z56 | 4 | 12.600 |
| Change pinion → hour wheel | Wechseltrieb z18 → Stundenrad z54 | 3 (total 12:1) | coaxial with the change wheel |
| Fusee pinion → power-reserve wheel | Auf-u-Ab-Trieb z12 → Auf u. Abrad z120 | 10 | 18.4 |

Escapement and balance:

| Item | Value |
|---|---|
| Escape wheel | ⌀14.00, z15 |
| Impulse roller | ⌀6.78 |
| Balance staff | 25.6 |
| Hairspring | Steel, helical, active length ≈513.6 with the Phillips terminal curves (build default); ≈504 with the drawn curves |
| Balance | Guillaume rim + 4 weights of 1.476 g (Phillips curves; 1.525 g with the drawn curves) |
| Mainspring | 15 × 0.37 (drawn) × 1385 in a ⌀38.5 barrel, core ⌀13.3; set-up ¾ turn (drawn) |
| Fusee connector | Steel band 730, 0.8 × 0.08, **crossed** (reverse fusee); 5.00 barrel turns |
| Stop-work | Bell-crank stop iron on the upper plate, cammed by the band on the last turn, against a stop nose on the fusee small end; stops at 8.761 turns |


### 1.7 Source keys used in the "Source" columns

| Key | File | Where it is now |
|---|---|---|
| RD | `Resolved_Design.md` (expert conflict resolution) | Git history, commit 921ab88. Its content is merged into [Federchronometer05.md](Federchronometer05.md) §4–§9 |
| IV | `Inferred_Values.md` | Git history, commit 921ab88. Merged into Federchronometer05.md |
| CL | `_inferred/scripts/closure.py` (closure checks) | In the repo |
| RH / res_hairspring | `_inferred/res_hairspring.md` | In the repo |
| res_fusee / res_barrel | `_inferred/res_fusee.md`, `_inferred/res_barrel.md` | In the repo |
| IE / inf_escapement | `_inferred/inf_escapement.md` | In the repo |
| IA / inf_axial | `_inferred/inf_axial.md` | In the repo |
| IP / inf_planview | `_inferred/inf_planview.md` | In the repo |
| inf_fusee | `_inferred/inf_fusee.md` | In the repo |
| AF / audit_* | `_audit/audit_frame.md` and the other per-sheet transcriptions | In the repo |
| `0x-yy/Wempe_….jpg` | Drawing scan | `drawings/` |

Where this spec differs from a cited source, **this spec governs**. Two corrections were made during compilation:

- **Barrel core:** ⌀13.3, length 11.7. RD wrongly gave "⌀11.7".
- **Mainspring:** 15 × 0.37 × 1385. The thickness 0.37 and the ¾ turn set-up are drawn on 05-06_20; the length 1385 comes from the half-area rule (T2). RD had an inferred 15 × 0.39 × 1355.

---

## 2. Frame and axial stack

This section covers Baugruppe 05 08 (Gestell): the plates, pillars, cocks, bridges, Werkring and fusee bushes. It also covers the bearings (bushes, jewels and settings) at every arbor, the standard WN hardware and the master Z table for the whole movement.

### 2.0 Conventions used in this section

| Item | Convention |
|---|---|
| Units | mm, degrees |
| Decimals | **Decimal point** in every value. Drawing text quoted verbatim inside quotation marks keeps its German commas, for example "3,35 ±0,02 stark" |
| Plan frame | x = O (+) / W (−), y = N (+) / S (−). Origin at the Minutenrad axis (hole 1, the plate centre). **Viewed from the back**, i.e. from the upper-plate (Oberplatte) side, which is the frame of the factory coordinate tables. Angles are counter-clockwise from +x, viewed from the back |
| Mirrored source | `001-002/Wempe_001.jpg`, left view (Unterplatte), is drawn **from the dial side** and is mirrored relative to this frame. Every coordinate this section takes from it (Zwischenbrücke, Zeigerstellung cut-outs) was already converted into the back-view frame by `inf_planview.md`. Do not mirror them again. The right view of 001 (Oberplatte) is already a back view. The coordinate tables (05-08_01a, 05-08_03a) and the part plans of 05-08_04, _05 and _13 are in the back-view frame (W on the left, N up) |
| Axial frame | Z = 0 at the **lower-plate (Unterplatte) inner face**; + toward the upper plate. The dial side is negative Z |
| Arbor positions | Train arbors are listed with the back shoulder against the upper bearing (Z 19.00). Barrel and fusee are listed in the **down position** (lower shoulder on Z 0). The balance staff and escape arbor are listed resting on the lower endstone. For the other extreme add the end-shake |
| Tiers | **T1** drawn, or closes exactly from drawn values. **T2** engineering rule. **T3** scaled from a drawing. **T4** convention or fitted value |
| Overrides | A value that replaces a drawn value is marked **OVERRIDDEN (drawn: x)** |
| Source names | `Resolved_Design.md` (RD), `_inferred/res_*.md`, `Inferred_Values.md` (IV), `_inferred/inf_*.md`, `_audit/audit_*.md`. Sheet files are given relative to `drawings/` |

### 2.1 Frame summary

| Quantity | Value | Tier | Source |
|---|---|---|---|
| Lower plate | Z −3.35 → 0.00 | T1 | 05-08_03b section A-B "3,35"; IV §2 |
| Clear plate gap (inner face to inner face) | **19.00** | T1 | Pillar 19.6 between shoulders − 2 × 0.3 recesses; "19" on 05-05_01; RD §2 |
| Upper plate | Z 19.00 → 22.35 | T1 | 05-08_01a "Fertigmaß 3,35 × 85ø h6" |
| Lower-plate inner face → Federhausbrücke underside | 22.35 (= 19.00 + 3.35). The "22,3" on 05-07_01 is this distance | T1 | RD §2; res_barrel §3a |
| Pillar pitch circle | R 37.000, 3 pillars (holes 11, 39, 49) | T1 | audit_frame §4 |
| Plate outside diameter | ⌀85 h6 (85.000 / 84.978) | T1 | 05-08_01a, 05-08_03a |

Superseded, for information only: a clear gap of 19.6 (superseded; 19.6 is the pillar length between shoulders, which sit in 0.3 recesses).

---

### 2.2 Plates

### Unterplatte (lower plate, pillar plate) — 05 08 02-1

- **Source sheet(s):** `05-08/Wempe_05-08_03a.jpg` (coordinate table, sections E-F and C-D), `05-08/Wempe_05-08_03b.jpg` (plan, sections A-B and G-H), `05-08/Wempe_05-08_32-2.jpg` (Unterplatte kompl. 05 08 02, Feder), `05-08/Wempe_05-08_32-1.jpg` (Anker kompl., reference only), `001-002/Wempe_001.jpg` (left view, dial side, mirrored).
- **Material/stock:** "Messingblech 4, Sonder Ms α-β Gef."; Rondelle 4 × ⌀90, turned 3.5 × ⌀90, finished ⌀85 h6 × 3.35. The plate is drawn for both variants (it carries 26 Gangrad and 30 Ankerrad).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thickness | **3.35** (Z −3.35 → 0.00). The note "3,35 ±0,02 stark" on 03a is struck through and its replacement is illegible; 3.35 is the only legible value | T1 | 03b section A-B; IV §2; section T3 3.31 ±0.2 |
| Outside diameter | ⌀85 h6 | T1 | 03a |
| Hole table | See table U-1 below (every row, converted to the back-view frame) | T1 | 03a via audit_frame §2 |
| Pillar recesses (11, 39, 49) | ⌀8.6 × 0.3 +0.03 deep, **on the inner face** (floor at Z −0.30). Sectioned only at pillar 11 (E-F); the same recess is drawn but undimensioned at 39 and 49, so apply it there too | T1 (11) / T2 (39, 49) | 03a E-F; inf_axial §3.2 (scale-free ratio 1.0327 against 19.6/19.0 = 1.0316) |
| Zwischenrad cut-out at 38 | **⌀24.5 through-cut** about hole 38 ("vor dem kalibrieren auf 24,5 fräsen"). The Zwischenrad runs inside it at Z −1.25 → −0.25. It is closed on the dial side by the Zwischenbrücke | T1 (⌀) / T1 (through, from the wheel Z) | 03b; IV §6; inf_axial §3.4 |
| Steady-pin holes 29, 44 | 1.6025 reamed with a ⌀2.5 counterbore 1.6 deep (section A-B, "3,35" "oben"). Counterbore from the inner face (the face opposite the Zwischenbrücke) | T1 (sizes) / T4 (face) | 03b A-B |
| Escape lower setting at 26 | ⌀2.50 ±0.009 bore + 2 × M1.2 at "3,5 +0,05" | T1 | 03a row 26; 03b |
| Anker hole 30 (G-H) | ⌀5.2 H7 +0.012 × "0,5 −0,05"(?) seat, through ⌀4.59 H7, 2 × M1.2 at 3.5 +0.05. **Anker-variant feature**; it is on the both-variant plate, so model it as drawn but it carries nothing in the Feder | T1 | 03b G-H |
| Hole 23 | Körner/stanzen 4.4 only. 03b also draws "7" (a radius) at hole 23; the feature it belongs to is not identified. **Model ⌀4.4 through; the "7" is not used (§7 #22)** | T1 / T4 (decision) | 03a; audit_frame §1 |
| Zeigerstellung cut-out A (**conditional**) | Rectangle 6.34 × 10.10, long axis ≈60°, corners (38.15; −16.46), (32.67; −13.28), (27.54; −22.04), (33.08; −25.15). Dashed in the dial-side view; depth not given | T3 ±0.4 | inf_planview §2 (001 L view, converted) |
| Zeigerstellung cut-out B (**conditional**) | Rectangle 6.46 × 7.06, axis ≈60°, corners (31.17; −14.17), (25.61; −10.83), (22.15; −16.97), (27.66; −20.30). Solid line; depth not given | T3 ±0.4 | inf_planview §2 |
| Zeigerstellung slot section C-D (**conditional**) | Verbatim "14ø", "12 +0,2", "1,68", "2", "9,3 −0,1", "8,5". Assignment to features not decoded | T1 (values) | 03a C-D; audit_frame §1 |
| Bush WN-302 at hole 1 | Pressed into the 4.59 +0.012 bore. 05-08_32-2 prints "0,1 +0,02" at the bush face on the inner side (see §2.6) | T1 (callout) | 05-08_32-2 |
| Futter 05 08 02-2 at hole 2 | Auf-u-Ab stud, "Futter an dieser Seite eindrücken", projecting "12,3" on the dial side | T1 (callout) / T3 (datum) | 05-08_32-2 |
| Stud at hole 19 | A second stud in section A-B of 05-08_32-2, projecting "6,8" on the dial side; by position it is the Wechselrad Anrichtstift | T3 (identity) | 05-08_32-2 |
| WN-52 | Called out at the NW end of the dashed Zwischenbrücke outline (holes 43/44). Identity not stated | T1 (callout) | 05-08_32-2 |

**Table U-1. Unterplatte hole coordinates** (back-view frame; x = O+, y = N+). "Körner/stanzen" is the pilot (punched) size or centre-punch; "bohren" is the drill; "kalibr." is the reamed finish. Conditional rows are marked.

| Nr | Benennung | x | y | Körner/stanzen | bohren | kalibr. | Finished hole for CAD | Status / note |
|---|---|---|---|---|---|---|---|---|
| 1 | Minutenrad | 0.000 | 0.000 | 4.4 | — | 4.59 +0.012 | 4.59, WN-302 bush seat |  |
| 2 | Auf u. Ab | 0.000 | 23.000 | 3.3 | — | 3.50 +0.012 | 3.50, Futter 05 08 02-2 pressed in |  |
| 3 | Hilfsloch | 0.000 | 37.000 | 3.3 | — | 3.50 +0.012 | 3.50 (jig hole) |  |
| 4 | Gegensperrkegel | 6.425 | 36.437 | Körner | 0.9 | — | 0.9 pivot hole |  |
| 10 | Schnecke | 16.708 | 15.292 | Körner | 2.5 | 2.70 ±0.009 | 2.70, fusee journal runs here |  |
| 11 | Pfeiler | 36.858 | −3.225 | 4.3 | — | 4.50 +0.012 | 4.50 + ⌀8.6 × 0.3 recess, inner face |  |
| 12 | Hilfsloch | 35.739 | −9.576 | 3.3 | — | 3.50 +0.012 | 3.50 (jig hole) |  |
| 14 | Stellstift f. Zeigerst. Kl. ob. | 36.411 | −17.229 | Körner | 1.45 | — | 1.45 | **Conditional**: Nr struck/overwritten; bracket "nur wenn Zeigerstellung eingebaut wird" |
| 15 | Stellstift f. Zeigerst. Kl. unt. | 33.211 | −22.871 | Körner | 1.45 | — | 1.45 | **Conditional** (as 14) |
| 16 | Zeigerstellkl. Schr. unt. | 30.789 | −21.471 | Körner | 2.8 | — | 2.8 | **Conditional** (as 14) |
| 17 | Zeigerstellkl. Schr. ob. | 33.989 | −15.929 | Körner | 2.8 | — | 2.8 | **Conditional** (as 14) |
| 18 | Zeigerstelltrieb | 22.136 | −12.780 | 3.3 (printed "33") | — | 3.50 +0.012 | 3.50 | **Conditional**: Nr struck |
| 19 | Wechselrad | 10.912 | −6.300 | 3.3 | — | 3.50 +0.012 | 3.50, Wechselrad stud pressed in |  |
| 23 | Unruh | 9.100 | −12.110 | 4.4 | — | — | 4.4 (see the "7" note) |  |
| 26 | Gangrad | 11.783 | −21.743 | Körner | 2.3 | 2.50 ±0.009 | 2.50, escape lower jewel + 2 × M1.2 |  |
| 28 | Zwischenbr. Schr. | 4.315 | −26.410 | Körner | 2.1 | M2.6 | M2.6 tapped |  |
| 29 | Stellstift f. Zw. Br. | 7.062 | −28.580 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 30 | Ankerrad | 5.028 | −33.730 | Körner | 2.3 | 2.50 ±0.009 | as drawn (G-H) | **Anker-variant hole**, unused in the Feder |
| 35 | Sekundenrad | 0.000 | −23.000 | 6.0 | — | — | 6.0 clearance for the fourth arbor |  |
| 38 | Zwischenrad | −9.910 | −15.170 | 4.4 | — | — | ⌀24.5 through-cut |  |
| 39 | Pfeiler | −18.500 | −32.043 | 4.3 | — | "4,50 +0,?" (tolerance struck) | 4.50 + ⌀8.6 × 0.3 recess | Tolerance struck by a diagonal stroke; use +0.012 as at 11/49 (T4) |
| 40 | Hilfsloch | −26.163 | −26.163 | 3.3 | — | 3.50 +0.012 | 3.50 (jig hole) |  |
| 43 | Zwischenbr. Schr. | −22.464 | −5.251 | Körner | 2.1 | M2.6 | M2.6 tapped |  |
| 44 | Stellstift f. Zw. Br. | −25.210 | −3.081 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 45 | Federhaus | −24.784 | 6.000 | Körner | 2.7 | 2.90 ±0.009 | 2.90, barrel lower pivot runs here |  |
| 49 | Pfeiler | −6.425 | 36.437 | 4.3 | — | 4.50 +0.012 | 4.50 + ⌀8.6 × 0.3 recess |  |
| 56 | Kontakt Schr. r. | 5.000 | −40.190 | "nur bei Bedarf" | 1.3 | M1.7 | M1.7 tapped | **Conditional**: "nur bei Bedarf" |
| 57 | Kontakt Schr. l. | −13.500 | −38.184 | "nur bei Bedarf" | 1.3 | M1.7 (printed "M 17") | M1.7 tapped | **Conditional**: "nur bei Bedarf"; N/S letter missing, S by position |

Rows 2 (Auf u. Ab) and 19 (Wechselrad) are lower-plate only; they are not in either Oberplatte table. Cross-check: every drawn distance on 03b (23.0, 22.65, 18.12, 12.63, 11.85, 11.85, 10.0) matches the table to 0.001 (audit_frame §4).

- **Mates with:** pillars (spigots in 11/39/49), WN-302, Futter 05 08 02-2, Wechselrad stud (19), Zwischenbrücke (28/29/43/44 on the dial face), escape lower jewel and cap (26), barrel arbor lower pivot (45), fusee journal (10), Werkring (⌀85 h6 in ⌀85 H9, outer face on the Werkring ledge), Gegensperrkegel arbor (4).
- **CAD notes:** Model the plate as a ⌀85 × 3.35 disc from Z −3.35 to 0. Cut the pillar recesses on the **inner** face. The ⌀24.5 cut at 38 is through. Leave out the conditional Zeigerstellung features (rows 14–18 and cut-outs A/B) and the contact screws 56/57 in the default build; put them in a suppressed feature group. Hole 30 and its G-H seat are Anker features; include them only if you want the plate exactly as drawn.

### Oberplatte (upper plate, top plate) — 05 08 01-1 (printed "050901" on 01a)

- **Source sheet(s):** `05-08/Wempe_05-08_01a.jpg` (coordinate table, sections J-K and L-M; title number printed "050901", while 05-08_02 calls the plate 05 08 01-1), `05-08/Wempe_05-08_01b.jpg` (plan, sections A-B, C-D, G-H, N-O, P-Q), `05-08/Wempe_05-08_02.jpg` (Oberplatte kompl. 05 08 01, rev a "zeichnerisch geändert" 2.11.46). The Anker plate `05-08/Wempe_05-08_30.jpg` (127-556.04-137) is **not** used except to note differences.
- **Material/stock:** "Messingblech 4, Sonder Ms α-β Gef."; Rondelle 4 × ⌀90, turned 3.5 × ⌀90, "Fertigmaß 3,35 × 85ø h6".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thickness | **3.35** (Z 19.00 → 22.35) | T1 | 01a "Fertigmaß 3,35"; 01b A-B, C-D |
| Outside diameter | ⌀85 h6 | T1 | 01a |
| Hole table | See table O-1 below (every row; Feder table 01a only) | T1 | 01a via audit_frame §3a |
| Barrel cut-out ("crescent") | ⌀42.5 circle about hole 45 (−24.784; 6.000), cut **through** and open to the plate rim ("vor dem Kalibrieren auf 42,5ø fräsen"). The barrel (drum to Z 21.70) rises into the plate's thickness band, so the plate must be absent there. The Federhausbrücke spans the opening on the outer face; its outer edge is turned with the plate | T1 | 01b; inf_planview §2; inf_axial §3.4 |
| Pillar recesses (11, 39, 49) | ⌀8.6 × 0.3 +0.03 on the **inner** face (floor at Z 19.30). Sectioned at 11 (L-M) only | T1 (11) / T2 (39, 49) | 01a L-M |
| J-K recess at the fusee (10) | ⌀22 × **0.7** deep on the **inner** face (floor Z 19.70), 45° chamfer at its edge. The "0,7" reading is marked uncertain on the scan | T1 (⌀) / T1(?) (depth) | 01a J-K; inf_axial §2.3 (T3 0.62 ±0.2); res_fusee §2 |
| Fusee bush seat at 10 | ⌀8.0 +0.015 reamed (pilot 7.8). Schneckenfutter 05 08 01-2 fitted from the outer face | T1 | 01a row 10 |
| Futter screws at 10 | 3 × M1.4 on R 5.2 ±0.05 (bolt circle ⌀10.4, matching the Futter flange holes), 120° apart. Phase not dimensioned; drawn approximately at 90°/210°/330° (T3 ±10°). These M1.4 are **drawn on 01b** (WN-34 on 05-08_02) | T1 (size, R) / T3 (phase) | 01b; 05-08_08 "10,4 ±0,05" |
| Balance hole 23 | ⌀10.0 (stanzen 10.0), the staff and rollers pass through | T1 | 01a; 01b |
| Keyhole tail at 23 | Tail 2.5 wide leaving the ⌀10 hole, drawn toward the lower right in the back view: centreline ≈330° (≈ −30°) from the 23 axis, tail-end centre ≈8.7 from the 23 axis, full-radius end. 01b prints "5r", "10,0", "2,5", "50°"; the datum of "50°" is not identified. Marked (a) on 05-08_02 | T1 (2.5) / T3 ±1 (direction, length) | 01b; 05-08_02 |
| Escape upper setting at 26 (P-Q) | ⌀4.5 H7 through + ⌀5.2 H7 +0.012 seat × 0.5 +0.03 deep **on the outer face** (seat floor Z 21.85). 2 × M1.2 at 3.5 +0.05 from the 26 axis, on the E-W line through 26 (as drawn on 01b). The table's "25 +0,009" (= 2.5) is **OVERRIDDEN (drawn: 2.5 +0.009 kalibr.)** by the section; read it as a pre-bore | T1 (section) / T3 (face, screw line) | 01b P-Q; inf_escapement §9 |
| Recess G-H at hole 36 | ⌀6 H7 +0.012 × 1.8 deep, on the **outer** face (Z 20.55 → 22.35). It sinks the head of the M2.6 screw that holds the lower balance cock. **OVERRIDDEN (inf_axial: inner face, Z 19.0 → 20.8, as a cock spigot seat)**. Reasons: 05-08_04 draws no spigot on the cock; on 01b the sections A-B, C-D and P-Q all put the outer face ("oben") at the top, and G-H draws the recess at the top; screw 36 lies 9.6 from the balance axis, under the balance arm, which is only 0.45 above the plate outer face, so its head must be sunk | T3 / T4 | 01b G-H; 05-08_04 |
| Steady-pin holes | 1.6025 reamed with a ⌀2.5 counterbore 1.6 deep. The counterbore is on the face **opposite** the part the pin locates: section A-B (pins 6, 9, 41, 47, 50 for parts on the outer face) counterbores from the inner face; section C-D (pins 22, 37 for the lower cock on the inner face) counterbores from the outer face ("oben" at the top) | T1 (sizes) / T3 (faces) | 01b A-B, C-D |
| Rebate N-O | Section N-O shows a step leaving **1.35 −0.05** of plate. Location and function are not identified. It is **not** the barrel-bridge seat: a bridge seated on it would have its underside at Z 20.35, which contradicts the adopted 22.35. **Not modelled (§7 #21)**: no Feder part needs it | T1 (value) / T4 (decision) | 01b N-O; audit_frame §3a; inf_axial §2.1 |
| Stop pin 05 08 01-5 at 7 | ⌀1.6 in 1.6 +0.009, "unten vorstehend" (projects below the inner face) | T1 | 05-08_02 |
| Bushes | WN-301 at hole 1; WN-300 at holes 35 and 38 | T1 (callouts) | 05-08_02 |
| Differences on the Anker plate (sheet 30), **not used** | Extra rows 27 (Anker), 30 (Ankerrad), 31–34 (Ankerbrücke); row 53 at O 13.0 instead of O 15.0; a different balance keyhole cut-out | T1 | audit_frame §3b |

**Table O-1. Oberplatte hole coordinates** (back-view frame).

| Nr | Benennung | x | y | Körner/stanzen | bohren | kalibr. | Finished hole for CAD | Status / note |
|---|---|---|---|---|---|---|---|---|
| 1 | Minutenrad | 0.000 | 0.000 | 4.4 | — | 4.59 +0.012 | 4.59, WN-301 bush seat |  |
| 3 | Hilfsloch | 0.000 | 37.000 | 3.3 | — | 3.50 +0.012 | 3.50 (jig hole) |  |
| 4 | Gegensperrkegel | 6.425 | 36.437 | Körner | 0.9 | — | 0.9 pivot hole |  |
| 5 | Drahtfeder | 10.684 | 38.507 | Körner | 1.3 | M1.7 | M1.7 tapped |  |
| 6 | Stellstift Unruh Kl. ob. | 3.577 | 27.821 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 7 | Anschlagstift | 5.676 | 23.911 | Körner | 1.45 | 1.6 +0.009 | 1.6, stop pin 05 08 01-5 | Pin hole R 14.000 from the fusee axis |
| 8 | Unruhkl. Schr. oben | 0.559 | 19.765 | Körner | 2.1 | M2.6 | M2.6 tapped |  |
| 9 | Stellstift Unruhkl. oben | 2.760 | 11.555 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 10 | Schnecke | 16.708 | 15.292 | 7.8 | — | 8.0 +0.015 | 8.0 Schneckenfutter seat + J-K recess + 3 × M1.4 |  |
| 11 | Pfeiler | 36.858 | −3.225 | 4.3 | — | 4.5 +0.012 | 4.50 + ⌀8.6 × 0.3 recess, inner face |  |
| 12 | Hilfsloch | 35.739 | −9.576 | 3.3 | — | 3.50 +0.012 | 3.50 (jig hole) |  |
| 13 | Gangfederkl. Schr. | 34.536 | −16.238 | Körner | 1.8 | — | 1.8 clearance (the Kloben carries the M1.7 thread) | Both coordinates printed "+0,01" |
| 22 | Stellstift Unruhkl. unten | 3.259 | −6.018 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 23 | Unruh | 9.100 | −12.110 | 10.0 | — | — | ⌀10.0 + keyhole tail |  |
| 26 | Gangrad | 11.783 | −21.743 | Körner | 2.3 | 2.5 +0.009 (printed "25") | ⌀4.5 H7 through + ⌀5.2 H7 × 0.5 seat + 2 × M1.2 (section P-Q) | Table vs section: section adopted |
| 35 | Sekundenrad | 0.000 | −23.000 | 4.4 | — | 4.59 +0.012 | 4.59, WN-300 bush seat |  |
| 36 | Unruhkl. Schr. unten | −0.502 | −11.922 | Körner | 2.8 | — | 2.8 clearance + ⌀6 H7 × 1.8 recess (G-H, outer face) |  |
| 37 | Stellstift Unruhkl. unten | −4.263 | −17.826 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 38 | Zwischenrad | −9.910 | −15.170 | 4.4 | — | 4.59 +0.012 | 4.59, WN-300 bush seat |  |
| 39 | Pfeiler | −18.500 | −32.043 | 4.3 | — | 4.50 +0.012 | 4.50 + ⌀8.6 × 0.3 recess |  |
| 40 | Hilfsloch | −26.163 | −26.163 | 3.3 | — | 3.50 +0.012 | 3.50 (jig hole) |  |
| 41 | Stellstift Federhausbr. | −30.732 | −24.010 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 42 | Federhausbr. Schr. | −32.043 | −18.500 | Körner | 2.1 | M2.6 | M2.6 tapped |  |
| 45 | Federhaus | −24.784 | 6.000 | 4.4 | — | — | none: centre of the ⌀42.5 cut-out only (the running bore is in the bridge) |  |
| 47 | Stellstift Federhausbr. | −22.924 | 31.551 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 48 | Federhausbr. Schr. | −17.370 | 32.668 | Körner | 2.1 | M2.6 | M2.6 tapped |  |
| 49 | Pfeiler | −6.425 | 36.437 | 4.3 | — | 4.5 +0.012 | 4.50 + ⌀8.6 × 0.3 recess |  |
| 50 | Stellstift Unruhkl. oben | −6.083 | 25.233 | Körner | 1.45 | 1.6025 | 1.6025 + ⌀2.5 cbore 1.6 |  |
| 51 | Zangenschraube | 23.386 | −7.537 | Körner | 1.55 | M2 | M2 tapped | Unruhhaltung (balance stop); its parts are not in the set |
| 52 | Winkelhebelschr. | 20.836 | −24.094 | Körner | 1.55 | M2 | M2 tapped | Unruhhaltung |
| 53 | Stift f. Wendelfeder | 15.000 | −37.000 | " (Körner) | 1.5 H7 | — | 1.5 H7 +0.009 | Unruhhaltung. Feder value O 15.0 (the Anker sheet 30 gives O 13.0) |
| S1 | Stellhebelschraube (rev 2) | −4.000 | 20.000 | Körner | 1.1 | M1.4 | M1.4 blind, 2.0 deep from the **inner** face | **Added (T4)**, not in the drawn table: stop-lever pivot (§3.5). 4.56 from hole 8, 5.63 from hole 50, 25.1 from the barrel axis (plate material; crescent edge at 21.25) |
| S2 | Stellfederschraube (rev 2) | 3.000 | 17.600 | Körner | 0.8 | M1.0 | M1.0 blind, 1.5 deep from the inner face, + ⌀0.6 pin hole 1.0 W of it | **Added (T4)**: stop-lever spring (§3.5). 3.26 from hole 8 |
| S3 | Fangstift B2 (rev 2) | −3.045 | 15.920 | Körner | 0.95 | 1.0 H7 | 1.0 H7 blind, 2.0 deep from the inner face; ⌀1.0 m6 steel pin projecting 0.7 (tip Z 18.30) | **Added (T4)**: engaged-position banking for the stop lever (§3.5). 7.3 from hole 9, 4.9 from hole 8 |
| G1 | Stellstift Gangfederkl. (rev 2.1) | 38.263 | −12.351 | Körner | 0.85 | 0.9 H7 | 0.9 H7 blind, 1.6 deep from the **inner** face, for a ⌀0.9 m6 steady pin projecting 1.3 from the Gangfederkloben | **Added (T4)**: hole 13 + 5.0 along the block's 68.00° axis, 2.0 toward 338° (§5.3). 1.55 wall to jig hole 12; 2.3 from the plate rim. May be spot-drilled through the positioned block instead |
| G2 | Stellstift Gangfederkl. (rev 2.1) | 30.808 | −20.125 | Körner | 0.85 | 0.9 H7 | as G1 | **Added (T4)**: hole 13 − 5.0 along the axis, 2.0 toward 158° (§5.3); 1.07 from the block's detent end face |

- **Mates with:** pillars (spigots in 11/39/49), WN-300 (35, 38), WN-301 (1), Schneckenfutter (10) and its 3 × M1.4, upper balance cock (outer face; 6, 8, 9, 50), lower balance cock (inner face; 22, 36, 37), Gangfederkloben (inner face; 13, steady pins G1/G2), Federhausbrücke (outer face; 41, 42, 47, 48), escape upper chaton (26), stop pin 05 08 01-5 (7), Drahtfeder post (5), Gegensperrkegel arbor (4), stop lever and its spring (S1, S2). The Staubfutter does not touch the plate: it is pressed on the Schneckenfutter boss.
- **CAD notes:**
  - Model a ⌀85 × 3.35 disc from Z 19.00 to 22.35, then cut the ⌀42.5 opening about 45 through the plate.
  - Pillar recesses and J-K are on the **inner** face. The P-Q seat and the G-H recess are on the **outer** face.
  - Everything on the outer face within R 16.2 of hole 23 lies under the balance, whose lowest point is Z 22.80, so it must stand no more than 0.45 proud. This affects the escape chaton screws at 26 (countersink them flush, T4) and screw 36 (head sunk in G-H). The Unruhhaltung parts at 51–53 are outside this rule by design (they clamp the rim) and have no sheet.

---

### 2.3 Pillars

### Pfeiler (pillar) — 05 08 00-1 (× 3)

- **Source sheet(s):** `05-08/Wempe_05-08_11.jpg`.
- **Material/stock:** "Rundmessing 8,5 Din 1758 Ms 58" ("hart" struck).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Positions (hole, x, y, polar) | 11: (36.858; −3.225), R 36.999 at 355.0°. 39: (−18.500; −32.043), R 37.000 at 240.0°. 49: (−6.425; 36.437), R 36.999 at 100.0° | T1 | 03a / 01a tables |
| Body | ⌀8.14 −0.2 (printed "8,1?" / "8,14") | T1 | 05-08_11 |
| Length between shoulders | Drawn 19.6 ±0.01. **Build (rev 2.1): make the three pillars 19.67 between shoulders. Face them as a set, all within 0.005 of each other, until the measured plate gap is 19.00 +0.01**; the facing target is 19.60–19.67 over the 0.30–0.33 recesses. **OVERRIDDEN (drawn: 19.6 ±0.01)** | T1 (drawn) / T4 (fitting) | 05-08_11; closure.py `review` |
| Spigots (both ends, "wie oben") | ⌀4.5 f7 (−0.010 / −0.022) × 2.8 −0.1 long; lead-in "4,3ø −0,2" with "5°" at the spigot end | T1 | 05-08_11 |
| Overall length | 25.3 −0.2 printed. 19.6 + 2 × 2.8 = 25.2, which lies **inside** 25.3 −0.2, so model 25.2. This is not an override | T1 | 05-08_11; audit_frame §1 |
| Thread | M2.6 through ("Gewinde von beiden Seiten einschneiden"), 90° countersink at each mouth, "1,1 −0,2" (countersink depth, reading T3) | T1 / T3 | 05-08_11 |
| Shoulder groove | Small undercut drawn at the body/spigot junction; not dimensioned | T3 | 05-08_11 |
| Z position | Lower spigot Z −0.30 → −3.10 (end 0.25 inside the lower-plate outer face). Body −0.30 → 19.30 (shoulders on the 0.3 recess floors). Upper spigot 19.30 → 22.10 | T1 | Frame chain |
| Plate gap produced | **19.00 +0.01, fitted** (rev 2.1). As drawn, 19.6 ±0.01 − 2 × (0.30…0.33) = 18.93…19.01. At 18.93 the parts hung from the upper plate drop 0.07, and that cannot be put back by fitting bearings: Ruhestein over the wheel rim 0.07 → 0.00, stop nose under the plate 0.10 → 0.03, stop lever over the band 0.14 → 0.07, Deckplatte under J-K 0.35 → 0.28 (closure.py REJ) | T1 / T4 | §2.9 |

- **Mates with:** Unterplatte and Oberplatte holes 11/39/49 (4.50 +0.012, f7 spigot) and their ⌀8.6 × 0.3 recesses; 2 pillar screws M2.6 each (§2.7).
- **CAD notes:** Each spigot stops 0.25 short of the plate outer face, so the screw head clamps the plate onto the shoulder. Pillar screw heads sit on the plate outer faces; none of the three is under the barrel bridge or the balance.

---

### 2.4 Cocks, bridges and fittings

### Unruhkloben oben (upper balance cock) — 05 08 03-1

- **Source sheet(s):** `05-08/Wempe_05-08_05.jpg` (part, hole table), `05-08/Wempe_05-08_06.jpg` (Unruhkloben oben kompl., 127-556.04 U30).
- **Material/stock:** "Profilmessing 50×15×3,3×5,5 Ms58"; Rohmaß Profil × 18; general tolerance ±0.1.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Hole table (back-view frame) | 23 Unruh (9.100; −12.110): Körner 4.4, kalibr. 4.59 +0.012 (pre-bore for the jewel seat). 8 Schraube (0.559; 19.765): 2.8 clearance. 20 Hilfsloch (6.512; −2.451): 2.8. 6 Stellstift (3.577; 27.821), 9 Stellstift (2.760; 11.555), 50 Stellstift (−6.083; 25.233): 1.45, 2.5 deep, 1.585 −0.005 | T1 | 05-08_05 table |
| Arm axis | Through 23, 20 and 8 at **105.0°** (sheet "15°" from N). Stations from 23 along the axis: 20 at s 10, 9 at s 24.5, 8 at s 33, pins 6 and 50 at s 40 and ±5 across | T1 | inf_planview §2 |
| Plan outline | R6 end about 23. Straight taper edges tangent to R6 at (14.976; −10.895) and (3.404; −13.995), ending at the foot-end corners (6.181; 31.625) and (−10.240; 27.225). Foot end square to the axis at s 43; width 17. Overall 49 (= 6 + 43) | T1 | 05-08_05 (17, 49, 16.5, 26.5, 6r); inf_planview §2 |
| Elevation | Foot 3.2 thick on the plate outer face (Z 22.35 → 25.55), from s 26.5 to s 43. Wall 4.5 thick from s 22 ±0.1 to s 26.5, Z 22.35 → 37.35. Arm 3.2 ±0.02 thick at the root, Z 34.15 → 37.35, from s 22 to the R6 end. Overall height 15 −0.1 | T1 | 05-08_05 "15 −0,1", "3,2", "3,2 ±0,02", "22 ±0,1", "4,5"; 05-08_06 (11.8 clear under the arm) |
| Arm relief | Underside relieved **0.8** within **r 12** of the balance axis, leaving 2.4: underside Z 34.95 there | T1 | res_hairspring §5 (05-08_06 "0,8–2,4", "12"); 05-03_1 |
| Jewel seat at 23 | ⌀5.2 H7 +0.012 from the top; "6ø" counterbore; 2 × M1.2 for the chaton at 3.5 +0.05 from the 23 axis, on the arm axis, 82° countersinks (section C-D) | T1 / T3 (screw line) | 05-08_05; 05-08_06 |
| Stud slot | 1.8 H7 +0.009, open to the edge, 0.9 each side of the slot line, bottom 3.4 from the balance axis | T1 | 05-08_05; res_hairspring §5 |
| Stud fixing hole | ⌀≈1.3 drawn, 4.2 off the axis line, "5" from the slot (only on 05-08_06) | T3 | res_hairspring §5 |
| Steady pins | WN pins ⌀1.6 protrude **1.3** below the foot (05-08_06 "1,3", "1,7", "3") | T1 | 05-08_06 |
| Swept-circle clearance | Dashed "22r" on 05-08_06: the wall inner face at s 22 clears the timing-screw circle (r 20.97) by ≈1.0 | T1 / T3 | 05-08_06; res_hairspring §6 |

- **Mates with:** Oberplatte outer face (pins 6/9/50, screw 8, M2.6); balance upper chaton with Diamantdecke; hairspring stud (Klötzchen 05 03 02-3), whose arm rests on the cock top at Z 37.35 and whose 1.8 g6 leg passes through the slot.
- **CAD notes:** Build the cock as one L-shaped body: foot plate, wall, arm. Apply the 0.8 relief as a ⌀24 pocket in the arm underside about the 23 axis. The cock top (Z 37.35) is the datum for the hairspring stud.

### Unruhkloben unten (lower balance cock) — 05 08 00-2

- **Source sheet(s):** `05-08/Wempe_05-08_04.jpg` (part; rev (a) "1x Toleranz war +0,05" 2.12.46), `05-08/Wempe_05-08_33.jpg` (127-556.04 U31 kompl., a different 127-series cock; corroboration only).
- **Material/stock:** "Profilmessing 20×10×8×3,3 Ms 58"; Rohmaß Profil × 18.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Hole table | 23 Unruh (9.100; −12.110): 4.4, kalibr. 4.59 +0.012. 36 Schraube (−0.502; −11.922): bohren 2.1, **M2.6** tapped. 22 Stellstift (3.259; −6.018) and 37 Stellstift (−4.263; −17.826): 1.45, 1.585 −0.005, 2.5 deep | T1 | 05-08_04 table |
| Block | 8 × 20 × 10 −0.1 high, centred on 36; long axis **57.5°** (sheet "32°30′" from S); 22 and 37 at ±7 along the axis. Corners (8.245; −5.637), (1.497; −1.339), (−9.249; −18.207), (−2.501; −22.505) | T1 | inf_planview §2 |
| Ear | s 0 … 10 along the axis, p 4 → 8.2 across, then R5 about 23 (17.2 = 4 + 8.2 + 5). Points (11.787; −7.894) and (6.414; −16.328) | T1 | inf_planview §2 |
| Ear thickness | 3.22 (tolerance digit illegible), at the free (low) end of the block | T1 | 05-08_04 section C-D |
| Z | Block top on the Oberplatte inner face, Z 19.00. Bottom face Z 9.00. Ear Z 9.00 → 12.22 | T1 | inf_axial §2.1 |
| Jewel seat at 23 | ⌀5.2 H7 +0.012, recess 0.5 +0.03, 2 × M1.2 at "3,5 +0,1 (a)" from the axis, on the line square to the block axis through 23 | T1 / T3 (screw line) | 05-08_04 |

- **Mates with:** Oberplatte inner face (pins 22/37; screw 36 from the outer face, head in the G-H recess); balance lower chaton and endstone.
- **CAD notes:** The ear's top face (Z 12.22) is 3.28 below the discharge roller (Z 15.50). The escape-wheel tip circle (R7.0) clears the block by 4.64 in plan (closure.py).

### Gangfederkloben (detent block) — 05 04 01-4, footprint on the Oberplatte

- **Source sheet(s):** `05-04/Wempe_05-04_03.jpg`; `05-04/Wempe_05-04_01.jpg` (escapement layout).
- **Material/stock:** blank on the sheet (brass assumed, T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| **Governing rule for hole 13** | **The Kloben screw sits on plate hole 13 (34.536; −16.238). The locking stone and the horn sit at the 05-04_01 layout positions.** The 1.2 offset between them is taken up by the Kloben's detent end face, not by rotating the block. **§5.3 governs every Kloben value**: the rows below repeat it. The earlier "rotate −3.9° about hole 13" (rev 1) is superseded | T4 | RD §2; §5.3 |
| Foot block (plan) | 7.5 wide; long axis at **68.00°** (square to the detent); screw 7.30 from the far end; detent end face **6.07** from the hole-13 axis toward bearing 248.00°. Block length 13.37. **OVERRIDDEN (drawn: 14.6 long, screw 7.3 +0.04 from the detent end, centred 3.75)** | T1 (width) / T4 | 05-04_03; §5.3 |
| Foot footprint, placed | Corners: far end (33.794; −8.064) and (40.748; −10.874); detent end (28.785; −20.461) and (35.739; −23.271). Long axis 68.00° through hole 13 (far end at +7.30, detent end face at −6.07 along the axis, ±3.75 across) | T4 | Derived from §5.3 |
| Screw | M1.7, tapped in the Kloben ("1,3 tief 3"), inserted from the Oberplatte outer face through the 1.8 clearance hole 13 | T1 | 05-04_03; 01a |
| Locating pins | 2 × ⌀0.9 at 2.3 and 12.3 from one end of the drawn 14.6 block, ±2 across, on opposite sides; that is ±5.0 along the axis from the screw. They engage plate holes **G1 (38.263; −12.351)** and **G2 (30.808; −20.125)** in Table O-1 (rev 2.1; pairing chosen to clear jig hole 12, §5.3) | T1 (sheet) / T4 (pairing) | 05-04_03; inf_planview §2; §5.3 |
| Arm | 3 × 3, rising 17.5 beyond the block, carrying the M1.2 banking screw 7 from its end; banking screw 18.8 ±0.03 from the M1.7 line. Its plan direction is set by the escapement layout | T1 (sizes) / T4 (direction) | 05-04_03; inf_escapement §4 |
| Z | Hangs from the Oberplatte inner face: block Z 19.00 → 12.50 (side-view 6.5 +0.05 read as the height). Detent foot screw M1, axis parallel to the plate at **Z 15.88**, the mid-width of the 2-wide detent foot (Z 14.88 → 16.88). **OVERRIDDEN (rev 1: Z 16.70 from "2,3 +0,02", datum not established)** | T4 | 05-04_03 side view; §5.3 |
| Drawn position on 001 | Screw 13 is drawn 1.19 N of row 13; the table governs | T3 | inf_planview §1.2 |

- **Mates with:** Oberplatte inner face (hole 13); Gangfeder (detent) foot (M1); Goldfeder.
- **CAD notes:** The footprint above is the foot block only. Model the banking arm per §5.3.

### Federhausbrücke (barrel bridge) — 05 08 05-1

- **Source sheet(s):** `05-08/Wempe_05-08_13.jpg` (part, hole table), `05-08/Wempe_05-08_12.jpg` (kompl. 05 08 05: WN-203, WN-22, 05 08 05-1, 05 08 05-2).
- **Material/stock:** "Messing blech 3,5 Din1751 Ms 58"; general tolerance ±0.1.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thickness | **3.32 −0.04**; Z 22.35 → 25.67, resting on the Oberplatte outer face | T1 | 05-08_13; RD §2 (22.35) |
| Hole table (back-view frame) | 45 Federhaus (−24.784; 6.000): stanzen 3.7, kalibr. **3.9 ±0.01** (barrel upper pivot runs here). 46 Sperrkegel (−29.474; 17.046): Körner, 2.1, **M2.6**. 42 Schr. (−32.043; −18.500) and 48 Schr. (−17.370; 32.668): Körner, 2.8 clearance. 41 Stellstift (−30.732; −24.010) and 47 Stellstift (−22.924; 31.551): 1.45, "2,5 tief", 1.585 | T1 | 05-08_13 table (viewed) |
| Hole circles | 42, 48 on R37; 41, 47 on R39; 46 is 12.000 from 45 ("12") | T1 | 05-08_13 |
| Outer edge | R42.5 about the origin, "mit der Oberplatte überdrehen" | T1 | 05-08_13; inf_planview |
| Chord edge | Line n·p = 18.5 with the normal n at 165.08° (the bridge lies on the W side) | T1 | inf_planview §2 (24 = 42.5 − 18.5; "7,7" from screw 42) |
| Vertices | B (S tip) (−27.727; −32.210); K (kink) (−11.312; 29.402); T (N tip) (−14.184; 40.063); short edge K–T 11.04 (150°, "5" from screw 48) | T1 | inf_planview §2 |
| Edge treatment | Side view: "0,2", "90°", "2,5" at the screw holes (countersink/chamfer, reading T3) | T3 | 05-08_13 |

- **Mates with:** Oberplatte outer face (screws 42/48 M2.6 into the plate, pins 41/47); barrel arbor upper pivot (45); Sperrad on its outer face; Sperrkegel pivot screw at 46.
- **CAD notes:** Bridge outline = arc R42.5 from B to T through the W side, chord B→K, short edge K→T. Over-dimensioned: the drawn "73,5" gives B→T 73.32 under the "5" closure. The "5" closure is adopted because 001 supports it; "73,5" would move K 0.63 N. **OVERRIDDEN (drawn: "73,5" B→T, modelled 73.32)**.

### Sperrkegel (barrel click) — 05 08 05-2

- **Source sheet(s):** `05-08/Wempe_05-08_14.jpg` (rev a "1x Änderung vom 25.5.48"), `05-08/Wempe_05-08_12.jpg`.
- **Material/stock:** "Messingblech 3 Din 1751 Ms 58 federhart"; general tolerance ±0.1.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thickness | 2.6 −0.03/−0.05 (model 2.56) | T1 | 05-08_14 |
| Pivot bore | ⌀3.2 +0.03 (a) | T1 | 05-08_14 |
| Outline dimensions | 17.4 overall; "5,142", "7,212" (pivot to the arc centres); "12,5r", "6r", "1r"; "9,7", "5,7", "7,5", "8,5", "3,5" (verbatim) | T1 | 05-08_14 |
| Plan placement | Pivot on bridge hole 46 (−29.474; 17.046). Nose (−30.44; 7.68), 9.42 from 46 at 264.1°, 5.90 from the barrel axis, inside the Sperrad tooth band (R5.55 … 7.05). Tail (−25.10; 23.95) | T1 (46) / T3 ±0.3 | inf_planview §2 |
| Z | On the bridge outer face, Z 25.67 → 28.23, in the Sperrad plane (25.67 → 28.32) | T1 | 05-08_13; 05-07_03 |
| Click spring | Not drawn; steel leaf. WN-22 on 05-08_12 is the candidate | T4 | RD §4; inf_planview §2 |

- **Mates with:** Federhausbrücke (pivot screw M2.6 at 46); Sperrad 05 07 00-3 (z16).
- **CAD notes:** The pivot screw is a shouldered M2.6 through the 3.2 bore (shoulder ⌀3.18 × 2.65, T4; the same screw as in §3.2).

### Zwischenbrücke (train bridge, dial side) — 05 08 04-1 (no part sheet)

- **Source sheet(s):** none for 05 08 04-1. `05-08/Wempe_05-08_10.jpg` (Zwischenbrücke kompl. 05 08 04: WN-203, WN-300) gives section only; `001-002/Wempe_001.jpg` left view (mirrored dial-side view; values below are already converted).
- **Material/stock:** brass plate 4 (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Location | On the **dial side** of the Unterplatte: Z **−3.35 → −7.35** (bridge face on the plate outer face) | T1 (top) / T3 (thickness) | inf_axial §3.1; IV §6 |
| Thickness | **4** (section 3.95 ±0.25; "4" on 05-05_01) | T1/T3 | inf_axial §2.1 |
| Hole axis | Through hole 35 (0.000; −23.000), direction 141.687° (unit −0.78463; 0.61996). Rows 28, 29, 35, 38, 43, 44 are collinear within 0.0005; axis 18.047 from the Minutenrad axis | T1 | inf_planview §2 (checked) |
| Holes (station s from 35 along the axis; coordinates = plate rows) | 29 pin, s −9.000 (7.062; −28.580). 28 screw, s −5.500 (4.315; −26.410). 35 fourth-wheel jewel, s 0 (0.000; −23.000). 38 third-wheel bush, s +12.630 (−9.910; −15.170). 43 screw, s +28.630 (−22.464; −5.251). 44 pin, s +32.130 (−25.210; −3.081) | T1 | 03a; inf_planview §2 |
| Outline (design) | Obround **10 wide × 47 long, R5 ends**, centred on the hole axis. End-arc centres on the axis at s +29.505 → **(−23.151; −4.708)** and s −7.495 → **(5.881; −27.647)** (spacing 37.0, centred on the measured mid-station) | T4 | inf_planview §2 (rounded design values); RD §4 |
| Outline (measured, reference) | Width 9.96; end radii 4.947 / 4.925; end centres (−23.30; −4.79) and (5.89; −27.74); 0.11 offset from the axis | T3 ±0.3–0.4 | inf_planview §2 |
| Screw holes 28, 43 | M2.6 clearance 2.8 (T4), counterbored on the dial face for the heads (drawn on 05-08_10, undimensioned) | T4 / T3 | 05-08_10 |
| Pin holes 29, 44 | 1.585 −0.005 (as on the other cocks/bridges, T4); WN-203 pins protrude **1.3** toward the plate | T4 / T1 | 05-08_10 "1,3" |
| Third-wheel bush at 38 | WN-300 (same part as in the Oberplatte), seat 4.59 +0.012 (T4: same bush, same seat; the drawn circle on 001 measures ⌀4.94 ±0.3). Bush inner face **0.7 +0.02** below the bridge's plate face (05-08_10). Adopted at the tolerance maximum, Z **−4.07**: 0.02 end-shake against the −4.05 shoulder (inf_axial's chain gives −4.08) | T1 / T4 | 05-08_10; inf_axial §2.1 |
| Fourth-wheel jewel at 35 | Hole jewel ⌀2.0 × 0.4 (Z −5.13 → −5.53) in a brass setting ⌀5.2, pressed into a **5.2 H7** seat in the bridge (§7 #13, the same convention as the escape setting). The ⌀3.27 drawn on 001 (T3) is read as the setting's front opening; 05-05_01 (127-series) draws a ⌀5.5 setting. Jewel face at Z **−5.13** (T1 chain: 19.00 − 24.1 − 0.03 end-shake), recess 1.78 below the bridge's plate face. **OVERRIDDEN (drawn: "1,7"(?) recess on 05-08_10, i.e. Z −5.05, which would bind the −5.10 shoulder)** | T3 / T1 | 05-08_10; inf_planview; inf_axial §2.6 |

- **Mates with:** Unterplatte outer face (screws 28/43 into M2.6, pins 29/44); Zwischentrieb front pivot (WN-300); Sekundentrieb front pivot and seconds extension (jewel).
- **CAD notes:** Plan clearances in the same Z band: Stundenrad +3.20, Wechselrad +4.34 (closure.py). The bridge does not reach the dial (3.00 clear).

### Werkring (movement ring) — 05 08 00-3

- **Source sheet(s):** `05-08/Wempe_05-08_07.jpg` (rev a, 7 changes, 6.12.46).
- **Material/stock:** blank on the sheet (brass assumed, T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Diameters | OD ⌀105.95 −0.1 (a); ⌀104 +0.1 (dial recess); ⌀96 −0.3(?); ⌀93 +1.3(?); **⌀85 H9 +0.035** (plate bore); ⌀83 (ledge inner edge, tolerance illegible) | T1 | 05-08_07 |
| Heights | Overall 10.7 −0.1 (a); 3 +0.1 (a); 7 −0.1 (a); 0.7 +0.1 (a); also "4,7", "2,8", 45° chamfer | T1 | 05-08_07 |
| Axial reading | 3 + 7 + 0.7 = 10.7 closes. Reading: 3 = ring top face → plate ledge (the lower plate sits in the ⌀85 H9 bore on the ⌀83 ledge); 7 = ledge → dial seat (the "7" dial-foot distance); 0.7 = dial recess ⌀104 +0.1 (the ⌀103.6 dial) | T1 | 05-08_07; inf_axial §2.1 (dial −10.35); case spec §3.1 |
| Z | Top face −0.35; ledge (lower-plate outer face) −3.35; **flange underside −6.35** (the "Werkringauflage" on the case: "4,7" up from the bottom face, and 3.0 from the plate's dial face, as 05-06_01's "3 ±0,05"); dial seat floor −10.35; bottom / flange face −11.05. Section T3: top −0.3, bottom −10.8 | T1 (05-08_07, 05-06_01) / T3 check | 05-08_07; `Federchronometer05_Case_Gimbal.md` §3.1 |
| Tapped holes | 3 × M2.6 on ⌀89 at 120°, "20°" offset. Screw heads seen on 001 at R44.7/44.7/44.4 at 109.9°/229.6°/349.8°, head ⌀6.6; model at R44.5, 110°/230°/350° | T1 (M2.6, ⌀89) / T3 (phase) | 05-08_07; inf_planview §2 |
| Assembly-drilled holes | ⌀1.1 "wird bei Montage des Zifferblattes gebohrt" (at 6°, "50,5", "1,6"); one more "wird bei Montage der Unterplatte gebohrt" | T1 | 05-08_07 |

- **Mates with:** Unterplatte (⌀85 h6 in ⌀85 H9, outer face on the ledge); Zifferblatt (in the ⌀104 recess); case (not in this section).
- **CAD notes:** The M2.6 heads at R44.5 overlap the plate rim (R42.5) by about 1.3, so they clamp the lower plate onto the ledge (T4 reading). They lie at Z 0 → ≈1.8, in plan clear of the barrel.

### Schneckenfutter (fusee upper bush) — 05 08 01-2

- **Source sheet(s):** `05-08/Wempe_05-08_08.jpg`, `05-08/Wempe_05-08_02.jpg` (assembly, with WN-34).
- **Material/stock:** "Rundmessing 13,5 Din 1758 Ms 58".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Overall | 7.1 −0.2; flange 1.5 −0.1 thick, ⌀13.2 −0.2; boss above the flange 2.9 +0.2 | T1 | 05-08_08 |
| Flange holes | 3 × ⌀1.5 +0.1 on ⌀10.4 ±0.05, 120°; "2,2ø H8 +0,014" × "0,5 +0,05" at the holes (head counterbore, reading T3) | T1 / T3 | 05-08_08 |
| Outside fits | Lower spigot **⌀8 g6** (−0.005/−0.014) in the plate's 8.0 +0.015 seat. Boss above the flange **⌀8 r6** (+0.028/+0.019), 45° chamfer to ⌀7 ±0.1 at the top ("(7,96ø)" reference): this is the press seat for the Staubfutter's ⌀8 H7 bore | T1 (values) / T1 (assignment: r6 is a shaft tolerance, and the only ⌀8 H7 in the set is the Staubfutter bottom bore) | 05-08_08 (viewed); 05-08_09 |
| Bore | Drawn "4,1ø +0,2" (pre-bore) and "Kegel 1:70". **Finished bore: 1:70 taper reamed to the journal, ⌀4.512 at Z 19.65 → ⌀4.410 at Z 26.75**, i.e. 0.010–0.014 diametral clearance on the 4.5 → 4.39 journal. Its mean is the "4,45 H7/g6" of the 05-06_01 fit table. Ream with the journal's own 1:70 reamer and fit at assembly. **OVERRIDDEN (drawn: "4,1ø +0,2", read as the pre-bore)** | T1 (taper, fit) / T4 (finish) | 05-08_08; 05-06_01 fit table; RD §2 |
| Z | Flange on the Oberplatte outer face, Z 22.35 → 23.85; boss to **26.75**; lower spigot down to **19.65** (0.05 proud of the J-K floor at 19.70) | T1 | res_fusee §2; inf_axial §2.3 |

- **Mates with:** Oberplatte hole 10 (8.0 +0.015) and 3 × M1.4 (WN-34) on R5.2; fusee upper journal (Z 19.61 → 27.61); Staubfutter.
- **CAD notes:** The Futter's lower end (19.65) is the fusee's upper thrust face: fusee end-shake 0.04 against the 6.1 step at 19.61.

### Staubfutter (dust tube over the fusee square) — 05 08 01-3

- **Source sheet(s):** `05-08/Wempe_05-08_09.jpg`, `05-08/Wempe_05-08_02.jpg` (05 08 01-3 with 05 08 01-4, no sheet).
- **Material/stock:** "Rundms. 15 Din 1758 Ms58".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Length | 18.1 −0.2 | T1 | 05-08_09 |
| Body | ⌀13.1 −0.2; top neck ⌀9.7 −0.2 × 1.8 +0.2; "(7,62ø)" inner chamfer at the top, 20° | T1 | 05-08_09 |
| Lug | 3.1 −0.2 thick; plan ⌀15.1 −0.2 with a flat at 14.1 −0.2; its upper face 15.1 −0.2 from the bottom | T1 | 05-08_09 |
| Bore | ⌀8 H7 +0.015 at the bottom (0.5 × 5° lead-in), pressed on the Schneckenfutter's ⌀8 r6 boss over its 2.9 height (Z 23.85 → 26.75). Above it, Kegel 1:70 closing to (⌀7.62) at the top. The Staubplatte (⌀7.6) turns inside this bore with ≈0.1 radial gap, as the dust seal | T1 | 05-08_09; 05-08_08 |
| Z | **23.85 → 41.95**, base on the Schneckenfutter flange top. Lug upper face at **38.95**, which carries the Korkring (section T3 underside 39.11). **OVERRIDDEN (rev 1: 22.35 → 40.45; section T3 top 40.46)**. Reason: the ⌀13.1 body cannot pass over the ⌀13.2 flange, and the drawn H7/r6 pair makes it a press fit on the boss | T1 (fits, length) / T3 (check) | 05-08_08; 05-08_09; closure.py |

- **Mates with:** Schneckenfutter boss (⌀8 r6) and flange top; fusee square and Staubplatte (inside); Korkring 05 08 01-4 (no sheet; on the lug, T3 39.11 → 43.0, bore ≈13.1 round the body, faced at assembly to 0.1–0.2 contact with the case floor 42.65); case.
- **CAD notes:** Do not let the base touch the Oberplatte.
- **Key path:** the key tube (⌀5.95 in the case spec) passes the Staubfutter's ⌀7.62 top bore and bottoms on the Staubplatte at Z 30.71. The drawn socket (3.1□ +0.05, depth "19 +2") then takes the whole 15.2 of square above it, with 0.03 play at the mouth (closure.py).
- **Cross-file:** `Federchronometer05_Case_Gimbal.md` §6.2–6.3 uses these values: top 41.95 (0.70 below the case floor), tube stopping on the Staubplatte at 30.71, reach 22.68 against the tube's 44.4. Case rev 2 moves the pot foot 0.02 (bezel on the flange; P0 −11.01), which is why the reach is now 22.68.

---

### 2.5 Bearings: bushes, jewels and settings

All plate seats are from the tables in §2.2. Bush OD = the plate's kalibr. bore. Bore = pivot + 0.01–0.02 (T2), except where the plate hole itself is the bearing (R2: the reamed hole governs and the pivot is finished to it).

| Position | Where | Bearing bore (pivot) | OD / seat | Height (Z) | Endstone | Tier | Source |
|---|---|---|---|---|---|---|---|
| Barrel, lower | Unterplatte 45, plain hole | 2.90 ±0.009 (pivot ⌀2.88) | — | plate, −3.35 → 0 | none (ball end) | T1 / T4 | RD §2; res_barrel |
| Barrel, upper | Federhausbrücke 45, plain hole | 3.9 ±0.01 (pivot ⌀3.88) | — | bridge, 22.35 → 25.67 | none | T1 / T4 | 05-08_13; RD §2 |
| Fusee, lower | Unterplatte 10, plain hole | 2.70 ±0.009 (journal ⌀2.68 f7) | — | −3.35 → 0 | none | T1 / T4 | RD §2 (R2) |
| Fusee, upper | Schneckenfutter 05 08 01-2 | 1:70 taper, ⌀4.51 → 4.41 (journal 4.5 → 4.39) | ⌀8 in 8.0 +0.015 | 19.65 → 26.75 | none | T4 / T1 | §2.4 |
| Centre, back | WN-301 in Oberplatte 1 | 1.21–1.22 (pivot ⌀1.2) | 4.59 +0.012 | 19.00 → 22.35 | none (oil sink) | T2 | 05-08_02; IV §6 |
| Centre, front | WN-302 in Unterplatte 1 | **⌀2.2 H7 (2.200–2.210)** on the drawn **⌀2.2 e8** journal (2.172–2.186): diametral clearance 0.014–0.038. The ⌀3.6 collar at Z 0.0 is the front shoulder; it bears on the bush's inner face. **OVERRIDDEN (rev 1: bore 3.61–3.62 on the ⌀3.6 collar)** | 4.59 +0.012 | −3.35 → −0.10 (inner face 0.1 +0.02 below Z 0, reading of 05-08_32-2) | none | T1 (journal fit) / T4 | 05-05_10 "2,2 e8"; 05-08_32-2 |
| Third, back | WN-300 in Oberplatte 38 | 0.86–0.87 (pivot ⌀0.85) | 4.59 +0.012 | 19.00 → 22.35 | none | T2 | 05-08_02 |
| Third, front | WN-300 in Zwischenbrücke 38 | 0.86–0.87 | 4.59 +0.012 (T4) | −4.07 → −7.35 | none | T1 (face) / T4 | 05-08_10 |
| Fourth, back | WN-300 in Oberplatte 35 | 0.83–0.84 (pivot ⌀0.82) | 4.59 +0.012 | 19.00 → 22.35 | none | T2 | 05-08_02 |
| Fourth, front | Hole jewel in Zwischenbrücke 35 | 0.77–0.78 (pivot ⌀0.76); the seconds extension passes through | setting ⌀5.2 in a 5.2 H7 seat (§7 #13); front opening ⌀3.27 (T3) | jewel −5.13 → −5.53 (face −5.13; thickness 0.4, T4) | none | T1 (face) / T3 / T4 | inf_axial §2.6 |
| Escape, upper | Chaton in Oberplatte 26 | hole jewel 0.25–0.26 (pivot ⌀0.24 "Steinlager einpassen"), Z 20.38 → 20.78 | flange ⌀5.2 × 0.5 in the 5.2 H7 seat, body ⌀4.5 in the 4.5 H7 bore; 2 × M1.2 at 3.5, countersunk flush | chaton 19.00 → 22.35; endstone face **20.83** | flat endstone ⌀2.0 × 0.3, Z 20.83 → 21.13 | T1 (seats) / T4 | 01b P-Q; §5.10 |
| Escape, lower | Unterplatte 26 | hole jewel 0.25–0.26, pressed ⌀2.50 × 0.40 at Z −1.95 → −1.55 | jewel in 2.50 ±0.009. Endstone in a **screwed cap** (removable for oiling): flange ⌀5.2 × 0.5 on the dial face (Z −3.35 → −3.85), 2 × M1.2 at 3.5; spigot ⌀2.50 g6 up the bore to Z −2.00 | endstone face **−2.00** | flat endstone ⌀2.0 × 0.3 set in the spigot end | T1 (bore) / T4 | 03a; §5.10 |
| Balance, upper | Unruhkloben oben | hole jewel 0.22–0.23 (pivot ⌀0.21), straight working length 0.25 at the endstone end, then an oil sink (§5.10) | chaton ⌀5.2 in 5.2 H7; 2 × M1.2 at 3.5 on the arm axis, 82° csk | in the arm, 34.95 → 37.35 | Diamantdecke ⌀2.2 × 0.35, face **35.85** (1.50 below the cock top) | T1 (seat) / T4 | 05-08_05; 05-03_1 "Diamantdecke" |
| Balance, lower | Unruhkloben unten ear | hole jewel 0.22–0.23, straight working length 0.25 at the endstone end, then an oil sink (§5.10) | chaton ⌀5.2 in 5.2 H7, recess 0.5 +0.03; 2 × M1.2 at 3.5 +0.1 | in the ear, 9.00 → 12.22 | endstone ⌀2.2 × 0.35, face **10.20** (1.20 above the cock bottom) | T1 (seat) / T4 | 05-08_04 |
| Auf u. Ab | Futter 05 08 02-2 in Unterplatte 2 | the Auf-u-Ab hub runs on the stud ("Laufsitz auf Anrichtstift") | 3.50 +0.012 press | Z 0 → −12.3 (tip) | — | T1 / T3 | 05-08_32-2; 05-02_10 |
| Wechselrad | Stud (Anrichtstift) in Unterplatte 19 | hub runs on it ("Laufsitz auf Anrichtstift") | 3.50 +0.012 press | Z 0 → −10.15 (tip; "6,8" from the outer face, T3) | — | T1 / T3 | 05-08_32-2; 05-02_06 |
| Gegensperrkegel | Plain holes 4 in both plates | 0.9 drilled (pivots ⌀0.88, T4) | — | both plates | — | T1 / T4 | 03a; 01a |
| Zeigerstelltrieb (**conditional**) | Unterplatte 18 | — | 3.50 +0.012 | — | — | T1 | 03a |

Setting heights for the escape and balance have no sheets (RD §4: "screwed chatons, 2 × M1,2"). They are set to give the adopted endstone spans: escape **22.83**, balance **25.65**. The 127-series kompl. sheets 05-08_06 and 05-08_33 print a jewel stack of "1,4", "1,4", "0,5", "0,1" in a 3.3 ear; that suggests about 1.4 per endstone recess (corroboration only).

### Messinglager WN-300 (brass bush) — WN-300 (no sheet)

- **Source sheet(s):** callouts on `05-08/Wempe_05-08_02.jpg` (Oberplatte 35, 38) and `05-08/Wempe_05-08_10.jpg` (Zwischenbrücke 38). No part sheet.
- **Material/stock:** brass (Messing), T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| OD | 4.59, press in 4.59 +0.012 (+0.005 interference) | T2 | IV §6 |
| Bore | pivot + 0.01–0.02: 0.86–0.87 (third), 0.83–0.84 (fourth) | T2 | IV §6 |
| Length | Oberplatte: 3.35 (flush both faces). Zwischenbrücke: 3.28 (inner face 0.72 below the bridge's plate face, i.e. "0,7 +0,02" at its maximum) | T2 / T1 | 05-08_10 |
| Oil sink | ⌀1.6 × 90° on the outer end (T4) | T4 | — |

- **Mates with:** Oberplatte holes 35, 38; Zwischenbrücke hole 38; train pivots.
- **CAD notes:** The bush face is the thrust face for the arbor shoulder.

### Messinglager WN-301 (brass bush) — WN-301 (no sheet)

- **Source sheet(s):** callout on `05-08/Wempe_05-08_02.jpg` (Oberplatte hole 1).
- **Material/stock:** brass, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| OD / bore / length | 4.59 / 1.21–1.22 / 3.35 | T2 | IV §6 |

- **Mates with:** Oberplatte hole 1; Minutentrieb back pivot ⌀1.2.
- **CAD notes:** Back shoulder of the Minutentrieb bears on its inner face at Z 19.00.

### Messinglager WN-302 (brass bush) — WN-302 (no sheet)

- **Source sheet(s):** callout on `05-08/Wempe_05-08_32-2.jpg` (Unterplatte hole 1, with "0,1 +0,02").
- **Material/stock:** brass, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| OD | 4.59 | T2 | IV §6 |
| Bore | **⌀2.2 H7** on the Minutentrieb's ⌀2.2 e8 journal (rev 2; rev 1 had 3.61–3.62) | T1 fit / T4 | 05-05_10 |
| Length / position | 3.25: outer face flush at −3.35, inner face at −0.10 (the "0,1 +0,02" read as a recess; a proud bush would bind the "(19 +0,05)" Minutentrieb chain) | T4 | 05-08_32-2 |

- **Mates with:** Unterplatte hole 1; Minutentrieb front journal.
- **CAD notes:** This face sets the centre-arbor end-shake (§2.9).

### Futter (Auf-u-Ab stud) — 05 08 02-2 (no sheet)

- **Source sheet(s):** `05-08/Wempe_05-08_32-2.jpg`.
- **Material/stock:** steel or brass, not stated (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Seat | ⌀3.50 press in hole 2, inserted from the inner side ("Futter an dieser Seite eindrücken"), top flush with Z 0 (section T3 −0.16) | T1 / T3 | 05-08_32-2; inf_axial §2.8 |
| Projection | "12,3" on the dial side; the extension line runs to the plate's inner face, so the tip is at Z −12.3, inside the Auf-u-Ab hand boss (−12.43 … −11.95) | T3 | 05-08_32-2 |
| Running diameter | not given; 05-02_01 prints "Festsitz 1,6ø", "2,8ø", "3" in the up-and-down area (assignment T4) | T4 | 05-02_01 |

- **Mates with:** Unterplatte hole 2; Auf-u-Ab hub 05 02 04-2 (runs on it).
- **CAD notes:** Passes the dial through its ⌀3.2 Auf-u-Ab hole.

### Anrichtstift (Wechselrad stud) — no part number given

- **Source sheet(s):** `05-08/Wempe_05-08_32-2.jpg` (drawn in section A-B, "6,8"); `05-02/Wempe_05-02_06.jpg` ("Laufsitz auf Anrichtstift").
- **Material/stock:** steel (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Seat / tip | ⌀3.50 press in hole 19; tip "6,8" beyond the outer face → Z −10.15 | T1 / T3 | 05-08_32-2 |

- **Mates with:** Unterplatte hole 19; Wechselrad hub 05 02 02-2.
- **CAD notes:** Running diameter not given; use the hub bore (T4).

### Steinfassungen und Decksteine (escape and balance jewel settings and endstones) — 05 04 06/08 (escape, no sheets); balance cock items 129–131 (127-556.04 U27, U20, -120)

- **Source sheet(s):** `05-08/Wempe_05-08_05.jpg`, `05-08/Wempe_05-08_04.jpg`, `05-08/Wempe_05-08_06.jpg`, `05-08/Wempe_05-08_33.jpg`, `05-08/Wempe_05-08_01b.jpg` (P-Q), `05-08/Wempe_05-08_03b.jpg`.
- **Material/stock:** brass chatons, ruby hole jewels, diamond upper balance endstone ("Diamantdecke", 05-03_1), sapphire/ruby other endstones (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Chaton OD | 5.2 (balance both, escape upper flange); escape upper body ⌀4.5 | T1 | seats on 05-08_04, _05, 01b |
| Hole jewel | balance 0.22–0.23 bore × 0.45 thick, ⌀2.0 OD. **The straight bore is 0.25 long, at the endstone end; the remaining 0.20 is a 90° oil sink toward the staff.** The 0.4 cylindrical pivot then covers the working bore at both end-shake extremes, with 0.10 to spare before its cone (rev 2.1, §5.10). Escape 0.25–0.26 × 0.4, ⌀2.0 OD (escape lower OD 2.50 in the plate) | T2 / T4 | inf_escapement §9 |
| Endstone | balance ⌀2.2 × 0.35; escape ⌀2.0 × 0.3 | T4 | inf_escapement §9 |
| Endstone faces | balance 10.20 / 35.85 (span 25.65); escape −2.00 / 20.83 (span 22.83) | T1 (spans) / T4 (split) | RD §2; §5.2 |
| Screws | 2 × M1.2 per setting at 3.5 from the axis, countersunk 82° | T1 / T3 | 05-08_05 C-D; 05-08_04; 01b; 03b |

- **Mates with:** cocks and plates as in the table above; balance staff pivots ⌀0.21; escape pivots ⌀0.24.
- **CAD notes:** The lower balance endstone sits 1.20 above the ear's bottom face and the upper 1.50 below the cock top. These come from the collet override (§2.8.8); the 127-series stack suggests ≈1.4 each.

---

### 2.6 Bearing and fit notes that the plates force

- **R2 (RD §1):** the reamed plate hole governs, and the pivot is finished to it. Barrel 2.90 → pivot 2.88; fusee 2.70 → journal 2.68.
- The fusee hole stays **2.70**. Superseded, for information only: a fusee plate hole of 2.83 (superseded).
- Cock and bridge pin holes are 1.585 −0.005 (press) and plate pin holes are 1.6025 (slide). This is deliberate (audit_frame).

---

### 2.7 Standard hardware (WN screws and pins)

Head form for all screws: slotted cheese head (RD §4). Head proportions are T4 conventions sized to fit the drawn recesses.

| Thread | Positions (part / hole) | Tap drill (drawn) | Head ⌀ × height, slot (T4) | Length under head (T4) | Tier | Source |
|---|---|---|---|---|---|---|
| M2.6 | Pillar screws × 6 (11/39/49, both plates, into the pillar); upper cock 8 (into plate); lower cock 36 (from the plate outer face into the cock; head sunk in G-H ⌀6 × 1.8); Federhausbrücke 42, 48 (into plate); Sperrkegel pivot 46 (into bridge, shouldered); Zwischenbrücke 28, 43 (into plate); Werkring × 3 on ⌀89 | 2.1 | ⌀5.0 × 1.8, slot 0.6. The head must exceed the ⌀4.50 pillar hole to clamp the plate, and fits the ⌀6 G-H recess at 36. Werkring screws: head ⌀6.6 (T3, measured on 001) | pillar 4.0; cock/bridge 6.0; 36: 7.0; ZwBr 6.5 | T1 thread / T4 head | 01a, 03a, 05-08_04, _05, _07, _11, _13 |
| M2 | Unruhhaltung 51, 52 | 1.55 | ⌀3.8 × 1.3, slot 0.5 | 4.0 | T1 / T4 | 01a |
| M1.7 | Drahtfeder post at 5 (threaded end of the post, screwed in from the inner face; §3.4); Gangfederkloben screw at 13 (into the Kloben, "1,3 tief 3"); contact screws 56, 57 (**conditional**) | 1.3 | ⌀3.2 × 1.1, slot 0.4 (13); the post has a ⌀2.4 × 0.5 collar on the plate face instead of a head | 13: 5.5 (3.35 plate + 2.5 in the Kloben); 5: thread 3.0 | T1 / T4 | 01a, 03a, 05-04_03 |
| M1.4 (WN-34) | Schneckenfutter flange × 3 on R5.2 | 1.1 (T4) | ⌀2.1 × 0.5 (in the "2,2ø H8 × 0,5" counterbore) | 3.0 | T1 (01b, 05-08_02) / T4 | 01b; 05-08_08 |
| M1.4 shouldered (rev 2) | Stellhebelschraube at S1, from the inner face: thread 2.0 into the plate, **shoulder ⌀1.5 h6 × 0.80** (Z 19.00 → 18.20), head ⌀2.6 × 0.35 below the lever (Z 18.20 → 17.85). The 0.75 lever floats on it with 0.05 end-shake (Z 18.20 → 18.95 dial down, 18.25 → 19.00 dial up) | 1.1 | ⌀2.6 × 0.35, slot 0.35 | 2.0 thread | T4 | §3.5 |
| M1.2 | Chaton screws: Oberplatte 26 × 2, Unterplatte 26 × 2 (cap), upper cock × 2, lower cock × 2; stop-nose screw on the fusee small face (rev 2) | 0.95 (T4) | 82° countersunk, head ⌀2.0 (flush where under the balance) | 2.0 | T1 / T4 | 01b, 03b, 05-08_04, _05 |
| M1 | Detent foot on the Gangfederkloben (escapement section) | — | ⌀1.8 × 0.6 | 2.0 | T1 / T4 | 05-04_03 |
| M1.0 (rev 2) | Stellfeder screw at S2, from the inner face | 0.75 | ⌀1.8 × 0.4 | 1.5 | T4 | §3.5 |

| Pin | Size | Positions | Tier | Source |
|---|---|---|---|---|
| Steady pin WN-203 | ⌀1.6 × 3.0, chamfered both ends; pressed into the part's 1.585 hole, protruding **1.3** into the plate's 1.6025 hole | Upper cock 6, 9, 50; lower cock 22, 37; Federhausbrücke 41, 47; Zwischenbrücke 29, 44 | T1 (1.3 protrusion, holes) / T2 (⌀) / T4 (length) | 05-08_06, 05-08_10, 05-08_12 |
| Stop pin 05 08 01-5 | ⌀1.6 in 1.6 +0.009, projecting below the Oberplatte inner face ("unten vorstehend"); length to suit the stop lever (T4) | Oberplatte 7 | T1 / T4 | 05-08_02 |
| Wendelfeder pin | ⌀1.5 in 1.5 H7 | Oberplatte 53 | T1 | 01a |
| Fangstift B2 (rev 2) | ⌀1.0 m6 × 2.7 (2.0 in the plate, 0.7 proud), hardened | Oberplatte S3 (−3.045; 15.920): engaged banking of the stop lever | T4 | §3.5 |
| WN-52 | Identity not stated; at the Zwischenbrücke NW end on the plate | Unterplatte 43/44 area | — | 05-08_32-2 |
| WN-22 | Identity not stated; on the Federhausbrücke kompl. (candidate: click spring or its screw) | Federhausbrücke | T4 | 05-08_12 |

Superseded, for information only: every value from Index.md ("43,00", "12,20", "M2,5", "M1,4") is superseded and not used. The M1.4 above is a different source: it is drawn on 01b for the Futter flange.

### Schrauben (frame screws, slotted cheese head) — WN numbers not given on the sheets

- **Source sheet(s):** `05-08/Wempe_05-08_01a.jpg`, `05-08/Wempe_05-08_01b.jpg`, `05-08/Wempe_05-08_03a.jpg`, `05-08/Wempe_05-08_04.jpg`, `05-08/Wempe_05-08_07.jpg`, `05-08/Wempe_05-08_11.jpg`, `05-08/Wempe_05-08_13.jpg`, `05-04/Wempe_05-04_03.jpg` (thread sizes only; no screw sheets in the set).
- **Material/stock:** steel, blued (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | Slotted cheese head | T4 | RD §4 |
| Threads and positions | As in the screw table above (M2.6, M2, M1.7, M1.4, M1.2, M1) | T1 | plate and part tables |
| Heads (⌀ × height, slot width) | M2.6 ⌀5.0 × 1.8, 0.6 (Werkring ⌀6.6); M2 ⌀3.8 × 1.3, 0.5; M1.7 ⌀3.2 × 1.1, 0.4; M1.4 ⌀2.1 × 0.5; M1.2 82° countersunk ⌀2.0; M1 ⌀1.8 × 0.6 | T4 | — |
| Lengths under head | As in the screw table above | T4 | — |

- **Mates with:** the tapped holes listed in Tables U-1 and O-1 and in the part tables.
- **CAD notes:** Under the balance (within R 16.2 of hole 23 on the Oberplatte outer face) every head must be sunk or countersunk flush: screw 36 in G-H, the M1.2 chaton screws at 26.

### Stellstift (steady pin) — WN-203

- **Source sheet(s):** `05-08/Wempe_05-08_10.jpg`, `05-08/Wempe_05-08_12.jpg`, `05-08/Wempe_05-08_06.jpg` (item 128, 127-556.04-119).
- **Material/stock:** steel pin (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Diameter | 1.6 (press in 1.585 −0.005, slide in 1.6025) | T2 | 05-08_04, _05, _13 (1.585); 01a, 03a (1.6025) |
| Length | 3.0 ("3" on 05-08_06), ends chamfered | T1 / T4 | 05-08_06 |
| Protrusion from the part | 1.3 | T1 | 05-08_06, 05-08_10 |

- **Mates with:** upper cock 6/9/50, lower cock 22/37, Federhausbrücke 41/47, Zwischenbrücke 29/44 and the matching plate holes.
- **CAD notes:** The plate pin holes have a ⌀2.5 × 1.6 counterbore on the far face, so the 1.3 protrusion engages the 1.75 reamed length.

### Futterschraube (Schneckenfutter screw, M1.4) — WN-34

- **Source sheet(s):** `05-08/Wempe_05-08_02.jpg` (WN-34 callout), `05-08/Wempe_05-08_01b.jpg` (3 × M1.4 on R5.2), `05-08/Wempe_05-08_08.jpg` (flange holes ⌀1.5 +0.1 on ⌀10.4).
- **Material/stock:** steel (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thread / quantity | M1.4 × 3, on R5.2 ±0.05 at 120° | T1 | 01b; 05-08_08 |
| Head | ⌀2.1 × 0.5 cheese head, in the "2,2ø H8 +0,014" × "0,5 +0,05" counterbore | T3 / T4 | 05-08_08 |
| Length under head | 3.0 (1.5 flange + 1.5 in the plate) | T4 | — |

- **Mates with:** Schneckenfutter flange; Oberplatte tapped holes around hole 10.
- **CAD notes:** Phase of the three holes is not dimensioned; use 90°/210°/330° about hole 10 (T3).

### Anschlagstift (stop pin) — 05 08 01-5

- **Source sheet(s):** `05-08/Wempe_05-08_02.jpg` ("Anschlagstift unten vorstehend").
- **Material/stock:** steel (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Position | Oberplatte hole 7 (5.676; 23.911), R 14.000 from the fusee axis | T1 | 01a; inf_planview §2 |
| Diameter | 1.6 in 1.6 +0.009 (light press) | T1 / T2 | 01a |
| Length | 3.35 in the plate + 0.7 projecting below the inner face (tip at Z 18.30), overall 4.05. The stop lever (Z 18.20 → 19.00) banks on it over 18.30 → 18.95 | T4 | §3.5 |

- **Mates with:** Oberplatte hole 7; stop-lever tail (banking, §3.5).
- **CAD notes:** The stop lever's beak arm lies just south of the pin; its north edge rests on the pin in the disengaged position (§3.5). The engaged position is banked by a second pin, B2 (Oberplatte S3).

---

### 2.8 Master Z table

Z = 0 at the lower-plate inner face, + toward the upper plate. Rebuilt from `inf_axial.md`, then the overrides required by RD and the res_* files are applied. Ranges run low → high Z.

#### 2.8.1 Frame, bridges, cocks, dial

| Item | Z | Tier | Source |
|---|---|---|---|
| Zifferblatt outer face / inner face | −11.65 / −10.35 | T1 (corroborated) | inf_axial §2.1 ("7" + 1.3, 127-series; T3 −11.72 / −10.42) |
| Werkring bottom / dial seat / flange underside (case seat) / ledge / top | −11.05 / −10.35 / −6.35 / −3.35 / −0.35 | T1 (T3 check −10.8 / −0.3) | §2.4; 05-08_07 |
| Zwischenbrücke | −7.35 → −3.35 | T1/T3 | inf_axial §3.1 |
| Unterplatte | −3.35 → 0.00 | T1 | — |
| Pillar recess floors | −0.30 and 19.30 | T1 | — |
| Lower balance cock | 9.00 → 19.00 (ear 9.00 → 12.22) | T1 | 05-08_04 |
| Gangfederkloben block | 12.50 → 19.00 | T4 | §2.4 |
| Oberplatte | 19.00 → 22.35 | T1 | — |
| J-K recess floor | 19.70 | T1(?) | 01a |
| G-H recess (outer face, hole 36) | 20.55 → 22.35 | T3/T4 | §2.2 |
| Escape seat floor (P-Q) | 21.85 | T1 | 01b |
| Federhausbrücke | 22.35 → 25.67 | T1 | 05-08_13 |
| Upper cock foot | 22.35 → 25.55 | T1 | 05-08_05 |
| Upper cock arm | 34.15 → 37.35 (34.95 → 37.35 within r 12 of the balance axis) | T1 | 05-08_05/06; res_hairspring |
| Schneckenfutter | 19.65 → 26.75 (flange 22.35 → 23.85; boss ⌀8 r6 23.85 → 26.75) | T1 | res_fusee; 05-08_08 |
| Staubfutter | **23.85 → 41.95** (pressed on the Futter boss; lug top 38.95) | T1 | 05-08_08/09; rev 2 |
| Korkring 05 08 01-4 (case side, no sheet) | ≈38.95 → 43.0, on the Staubfutter lug | T3 | section |
| Stop lever (Stellhebel, rev 2) | 18.20 → 18.95 (dial down); pad down to 16.90; pivot head 17.85 → 18.20 | T4 | §3.5 |

#### 2.8.2 Barrel (family B; arbor 05 07 02-1 has no sheet) — down position, end-shake 0.10

| Item | Z | Tier | Source |
|---|---|---|---|
| Arbor lower tip ("Kugel poliert") | −5.00 | T1 | RD §2 (5 lower pivot) |
| Lower pivot ⌀2.88 in hole 45 (2.90) | −5.00 → 0.00; projects 1.65 below the outer face | T1 / T4 | RD §2; res_barrel §3b |
| Lower shoulder (bears on the Unterplatte inner face) | 0.00 | T1 | — |
| Lower seat ⌀4.48 (drum hub runs on it) | 0.00 → 6.60 | T1 closure / T4 | res_barrel §3b |
| Core ⌀13.3 | 6.60 → 18.32 (length 11.72) | T1 closure | res_barrel (⌀13.3, length 11.69–11.75) |
| Upper seat ⌀4.48 (cover hub) | 18.32 → 22.25 | T1 closure | — |
| Upper shoulder | 22.25 (22.35 in the up position: on the bridge underside) | T1 | RD §2 (5 + 22.25 + 12.95 = 40.2) |
| Upper pivot ⌀3.88 in bridge hole 3.9 | 22.25 → 25.20 | T1 / T4 | RD §2 |
| Square 2.7□ 1:100 × 10 | 25.20 → 35.20. It starts 0.47 inside the bridge bore (0.37 in the up position; RD says "0,3"); diagonal 3.82 < 3.89 clears | T1 | RD §2; res_barrel §3b |
| Sperrad (2.65 −0.1) on the bridge outer face | 25.67 → 28.32 | T1 | 05-07_03 |
| Drum outer bottom | 3.50 (floor-hub top on the core's lower face; section T3 3.70) | T1 chain / T4 placement | 05-07_06 (3.1 hub) |
| Drum floor inner face | 4.75 (floor 1.25) | T1 | 05-07_06 |
| Mainspring (15 wide), centred on the hook | 5.05 → 20.05 | T1 | RD §2 |
| Mainspring hook (M2.6 at 45°) | 12.55 (9.05 from the outer bottom = 7.85 from the floor) | T1 | RD §2 |
| Cover seat shoulder (cavity top) | 20.40 (floor-hub top + 13.8) | T1 | 05-07_06 |
| Cover plate | 20.40 → 21.70 (1.3); cover hub 18.40 → 21.70 (3.3); drum end-shake on the core 0.08 | T1 | 05-07_07; res_barrel §3a |
| Drum rim top | 21.60 (18.1 high) | T1 | 05-07_06 |
| Clearance drum → bridge underside | 0.65 | T1 | — |

#### 2.8.3 Fusee — down position, end-shake 0.04 (segments from res_fusee.md)

| Item | Z | Tier | Source |
|---|---|---|---|
| Lower tip (flush with the Auf-u-Ab-Trieb) | −9.45 | T3 | res_fusee §2 |
| Auf-u-Ab-Trieb (z12), pressed on the 1.6 pivot | −9.45 → −6.55 | T3 | res_fusee §2 |
| 1.6 pivot, finished 2.90 long | −9.45 → −6.55 | T3 | res_fusee §2. **OVERRIDDEN (drawn: left end "6,1" on 05-06_15, which includes the lathe centre; 3.2 is cut off after the pinion is pressed on)** |
| Lower journal, finished **⌀2.68 cylindrical** through hole 10 (2.70) | −6.55 → 0.00 | T4 | RD §2. **OVERRIDDEN (drawn: 2.7 → 2.8 ±0.02, Kegel 1:70)** |
| Lower shoulder 4.38 / journal (bears on the Unterplatte inner face) | 0.00 | T1 | — |
| Seat ⌀4.38 → 4.5 (1:70) | 0.00 → 8.61; Vorreiber cross hole ⌀1.1 at 1.96 | T4 | res_fusee §2 (shortened from 8.7) |
| Collar ⌀7.04 | 8.61 → 16.51 | T1 | res_fusee §2 |
| ⌀6.1 seat | 16.51 → **19.61** | T1 / T4 | res_fusee §2. **OVERRIDDEN (drawn: shoulder span 19.7 +0.05)** |
| Upper journal ⌀4.5 → 4.39 (1:70), in the Schneckenfutter | 19.61 → 27.61 | T1 | res_fusee §2 |
| Square 1:100, **3.1□ r6 across the flats at the root → 2.92□**, milled from the ⌀4.39 journal end (corners 4.38 → 4.13); finished 18.3 = Staubplatte seat 3.1 + flats ≈13.9 + dome ≈1.3 | 27.61 → **45.91** (tip) | T1 | 05-06_15 "3,1□ r6", "2,92□"; 05-06_01 "18,3 −0,1". **OVERRIDDEN (drawn: right end "20,3" on 05-06_15, which includes the 2.3 centre cone)**. Rev 1 read 3.10 → 2.93 as corners; superseded |
| Vorreiber (05 06 00-2) | **0.07 → 3.17**: hub ⌀7.6 0.07 → 1.97 (cross hole ⌀1.1 at 1.96), flange ⌀14 d11 1.97 → 3.17. The flange overlaps the Minutenrad in plan, so it must stay above its top (1.80): clear by 0.17 | T4 (closure) / T1 (sizes) | 05-06_06 (3.1 overall, 1.2 flange) |
| Schneckenrad (great wheel) | Teeth/rim **2.54 → 3.84** (1.3). Hub ⌀16.6, **1.97 → 4.59** (2.62 drawn), clear of the Minutenrad top by 0.17. ⌀14 +0.1 recess 1.22 deep in the hub's lower face (1.97 → 3.19), running on the Vorreiber flange (0.02 axial). ⌀32.3 +0.05 recess 0.4 deep in the rim's upper face (3.44 → 3.84) for the Gegenfeder. **⌀6.5 g6 spigot on the hub top, 4.59 → 5.86**, carries the Gegensperrad (the "6,5 H7/g6" pair of the 05-06_01 fit table; not on the 1948 wheel sheet, T4) | T3 (teeth) / T1 (2.62, 1.22, ⌀32.3, 0.4) / T4 (assignment, spigot) | inf_axial §2.3; 05-06_07; 05-06_01 |
| Gegenfeder | **3.44 → 4.79** (1.35 drawn; 0.40 of it in the wheel recess) | T1 thickness / T4 | 05-06_10 |
| Gegensperrad plate (teeth z120) | **4.84 → 5.86** (1.02 drawn), 6.5 H7 bore on the wheel spigot; ring ⌀26.1/⌀24.45 rises to 7.94 inside the body's ⌀26.3 recess | T1 thicknesses / T4 | 05-06_12 |
| Sperrkegel × 2 (on riveted pivots in the Gegensperrad plate) | 6.61 → 8.61, in the Schneckensperrad plane; spacer collar on each pivot rivet 5.86 → 6.61 | T4 | 05-06_04 A-B |
| Schneckenkörper (cone) | **5.91 → 18.51** (12.6). Large-end recess ⌀26.3 × 2.7 (5.91 → 8.61); its floor is exactly the arbor collar start (8.61), where the 7 H7 bore begins | T1 (closes) | 03-2 "13,7"; 02-2 "12,6", "9,9"; closure.py |
| Schneckensperrad | **6.61 → 8.61**, on the recess floor (3 pins on ⌀11.5) | T1 (2 thick) / T4 | 05-06_16; 05-06_04 A-B |
| Small-end counterbore (cavity, closed by the Deckplatte) | 16.91 → 18.51, ⌀15 | T1 | 02-2 |
| Deckplatte (05-06_08, 0.8 thick, ⌀21.1) | **18.51 → 19.31**, on the body small face and the ⌀6.1 seat; one countersunk M1.7 at r 6. A rim notch 1.7 wide takes the stop nose | T1 (0.8) / T4 | 05-06_08 |
| Stop nose (Stellungssteg 05 06 03-1, rev 2) | 18.25 → 18.86 beyond r 10.55; 18.51 → 18.86 inside | T4 | §3.5 |
| Staubplatte | 27.61 → 30.71 on the square root (square hole 3.1□ 1:100) | T1 (3.1 thick) / T4 | 05-06_05 |
| Korkring (case) | ≈38.95 → 43.0 | T3 | inf_axial §2.3 |

Frame limits on the fusee: nothing within r ≤ 4.0 of the axis above Z 19.61 (Futter end 19.65), and nothing within r ≤ 11 above Z 19.70 (J-K floor). The Deckplatte top (19.31, 19.35 dial up) clears the J-K floor by 0.35.

**The stack closes (rev 2).** The body's large face at 5.91 follows from 03-2's "13,7 −0,1" to the 6.1 shoulder. Its recess floor (5.91 + 2.7 = 8.61) then coincides with the arbor collar start, and 8.61 + 9.9 = 18.51 is its small face: two drawn lengths closing on a third. The wheel stack below the body then fits once the Gegenfeder sits 0.4 in the Schneckenrad's drawn ⌀32.3 recess. Gaps: Gegenfeder → Gegensperrad 0.05, Gegensperrad → body 0.05. The section's 6.49 body face is outside its tolerance and is not used.

#### 2.8.4 Centre arbor (Minutentrieb 05 05 03-2) and motion work — back shoulder at 19.00

| Item | Z | Tier | Source |
|---|---|---|---|
| Back pivot ⌀1.2, tip | 19.00 → **22.00** (0.35 below the plate face, oil sink) | T1 + R1 | RD §2. **OVERRIDDEN (drawn: 5.1 −0.2, superseded)** |
| Back shoulder (on WN-301) | 19.00 | T1 | inf_axial §2.4 |
| Minutentrieb pinion (z14) | 1.80 → 5.80 | T1 | 05-05_10 (4 −0.1) |
| Minutenrad | 0.50 → 1.80 | T1 | 05-05_10 (17.2 +0.05; 1.3) |
| Wheel-seat end ("(19 +0,05)") | 0.00 … −0.05 | T1 | 05-05_10 |
| Front journal in WN-302 | −3.35 → −0.10 | T4 | §2.5 |
| Viertelrohr (cannon pinion, z14) collar | −6.40 → −3.93 | T1 | inf_axial §2.4 (05-05_08 25.4) |
| Minute-hand square 2.6□ r6 | −18.23 → −14.73 (3.5 long, §4.3) | T1 | 05-05_08; inf_axial §2.4 |
| Viertelrohr front end | −18.23 | T1 | inf_axial §2.4 |
| Minutentrieb front tip, cut flush | **−18.23** | R1 | RD §2. **OVERRIDDEN (drawn: −20.65 from 39.65)** |
| Wechselrad (z56) | **−5.40 → −4.40** (inside the Viertelrohr pinion span −6.40 → −3.93) | T4 (fitted chain, §4.3) | §4.3. Section T3 −5.23 → −4.21 |
| Wechselrad hub (7 −0.1), between the plate outer face (−3.35) and the dial inner face (−10.35) | −10.35 → −3.40 (model 6.95, shown resting on the dial; end-shake 0.05) | T1 / T4 | 05-02_06; frame |
| Wechselrad stud (Anrichtstift) tip | −10.15 ("6,8" from the plate outer face) | T3 | 05-08_32-2 |
| Wechseltrieb (z18) on the hub | **−8.60 → −6.00** (covers the Stundenrad) | T3 | §4.3 |
| Stundenrad | **−7.49 → −6.44** (1.05) | T4 (fitted chain) | §4.3. Section T3 −7.57 → −6.64 |
| Stundenrohr: ⌀5.0 pipe from the wheel to the step / ⌀4.4 r6 hand seat / tip | −6.44 → −11.64 / −11.64 → −14.64 / −14.64 | T1 lengths / T3 tip | §4.3 |
| Stundenrohr retaining collar (rev 2.1) | ⌀7.0, −7.04 → **−10.15**. Its front face runs against the dial inner face (−10.35; −10.25 at the Werkring "7 −0.1" minimum). Hour-wheel float: 0.04 to the Viertelrohr pinion + 0.10–0.20 to the dial | T4 | §4.3 |

#### 2.8.5 Third (Zwischenrad / Zwischentrieb 05 05 02) — back shoulder at 19.00

| Item | Z | Tier | Source |
|---|---|---|---|
| Back pivot ⌀0.85, tip | 19.00 → **22.00** | T1 + R1 | RD §2. **OVERRIDDEN (drawn: 4.6 −0.2, superseded)** |
| Back shoulder (on WN-300) | 19.00 | T1 | — |
| Zwischentrieb pinion (z12) | −0.25 → 4.35 | T1 | 05-05_07 |
| Zwischenrad | −1.25 → −0.25 (in the ⌀24.5 through-cut) | T1 | 05-05_07 (19.25 −0.1) |
| Front shoulder | −4.05 (span 23.05) | T1 | 05-05_07 |
| Zwischenbrücke bush face (WN-300) | −4.07 (end-shake 0.02; drawn recess "0,7 +0,02" at its maximum) | T1 | 05-08_10; inf_axial §2.5 (−4.08) |
| Front pivot ⌀0.85, tip | **−7.05** (3.0 pivot, 0.30 inside the bridge face) | T1 (05-05_05 kompl. "3") + R1 | RD §2. **OVERRIDDEN (drawn: 4.6 −0.2 on 05-05_07, superseded; section T3 −7.69)** |

#### 2.8.6 Fourth (Sekundenrad / Sekundentrieb 05 05 01) — back shoulder at 19.00

| Item | Z | Tier | Source |
|---|---|---|---|
| Back pivot ⌀0.82, tip | 19.00 → **22.00** | T1 + R1 | RD §2. **OVERRIDDEN (drawn: 4.5 long, superseded)** |
| Back shoulder (on WN-300) | 19.00 | T1 | — |
| Sekundenrad | 4.12 → 5.12 | T1 | 05-05_04 (9.25 −0.1) |
| Sekundentrieb pinion (z10) | −2.88 → 4.12 | T1 | 05-05_04 (7) |
| Front shoulder | −5.10 (span 24.1) | T1 | 05-05_04 |
| Zwischenbrücke jewel face | −5.13 (end-shake 0.03) | T1 | inf_axial §2.6. **OVERRIDDEN (drawn: "1,7"(?) recess on 05-08_10 → −5.05)** |
| Seconds extension 0.76 → 0.65 (Kegel 1:90), tip | **−12.97** (7.84 from −5.13; 1.12 behind the hour hand's rear face −14.09) | T3 + R1 | RD §2. **OVERRIDDEN (drawn: 9.2 extension, superseded; tip −14.33)** |
| Zeigerfutter (seconds hand pipe), OD 1.2, ≈1.0 long | −12.97 → −11.97 | T1 fit / T4 length | RD §2 |
| Sekundenzeiger blade / boss | blade −12.42 → −12.08; boss on the Zeigerfutter, no further out than the arbor tip −12.97 | T3 / T4 | inf_axial §2.6 |

#### 2.8.7 Escape arbor (Gangrad 05 04 05-1, 22.8 −0.02) — resting on the lower endstone

**Rev 2: §5.2 governs this arbor.** The rev-1 rows (tip −1.83, wheel 17.17 → 17.97 at 0.8, endstone 21.00) are superseded.

| Item | Z | Tier | Source |
|---|---|---|---|
| Lower endstone face / arbor lower tip | **−2.00** (inside the Unterplatte; lower pivot shoulder at 0.00, pivot zone 2.0) | T1 chain | 05-04_07-2; §5.2 |
| Gangtrieb (z10) leaves | **3.30 → 8.30** (contain the Sekundenrad 4.12 → 5.12) | T1 | 05-04_08 "5 −0,2"; 07-2 "5,3" |
| Gangradbutzen | 12.30 → 17.00 | T1 | 07-2 "4,7" |
| Gangrad (escape wheel, ⌀14.00) | **17.00 → 18.40**, rim and teeth 1.40; crossings 0.80 (17.00 → 17.80) | T1 (07-1 "1,4") / T3 (web) | §5.2; section envelope 17.04 → 18.49 ✓ |
| Arbor upper tip | 20.80 | T1 (22.8) | — |
| Upper endstone face | **20.83** (span **22.83**, end-shake 0.03) | T1 span / T4 split | RD §2; §5.10 |

#### 2.8.8 Balance — staff resting on the lower endstone

Anchors: collet bottom on the balance-arm top at **Z 23.95** and stud arm on the cock top at **Z 37.35** (RD §2; res_hairspring §5). Arm thickness **1.15** (res_hairspring §6; the section measures 1.10). Staff 25.6 −0.02: lower part 12.6, upper part 13.0 from the Unruhauflage (05-03_3-2).

| Item | Z | Tier | Source |
|---|---|---|---|
| Lower balance cock bottom face | 9.00 | T1 | — |
| Lower endstone face / staff lower tip | **10.20** (recess 1.20) | T1 chain / T4 setting | derived: 22.80 − 12.6 |
| Discharge roller (Auslöserolle) | 15.50 → 17.10 | T3/T4 | inf_axial §2.7; inf_escapement §6 |
| Gangfeder (detent), drawn | 15.76 → 16.88 | T3 | inf_axial §2.7 |
| Impulse roller (Heberolle, 1.6 +0.1) | 17.10 → 18.70 (shoulder 4.1 −0.05 below the Unruhauflage; section 16.97 → 18.70) | T1 | 05-04_01 "4,1 bis Unruhauflage"; 05-03_3-2 |
| Unruhauflage = arm underside | **22.80** | T1 chain | 23.95 − 1.15 |
| Balance arm | 22.80 → 23.95 | T3 (thickness) / T1 (top) | res_hairspring |
| Balance rim (3.8), flush with the arm underside | 22.80 → 26.60 (0.45 above the plate) | T1 / T3 | 05-03_4; inf_axial §2.7 |
| Hairspring collet (Spiralrolle) bottom | **23.95** | T1 | RD §2 |
| Hairspring, lower strip bottom → upper strip top | 24.70 → 34.20 (0.75 + 9.5) | T1 | res_hairspring §5 (05-03_5) |
| Staff upper tip | 35.80 | T1 | 22.80 + 13.0 |
| Upper endstone (Diamantdecke) face | **35.85** (span **25.65**, end-shake 0.05; 1.50 below the cock top) | T1 span / T4 split | RD §2. **OVERRIDDEN (section: endstones 9.84 / 35.86, span 25.95–26.27 with no end-shake)** |
| Upper cock arm, relieved underside / top | 34.95 / 37.35 | T1 | res_hairspring §5 |
| Hairspring stud arm underside / stud top / leg tip | 37.35 / 38.95 / 32.85 | T1 | res_hairspring §5 |

Check: impulse roller 17.10 → 18.70 matches the section's 16.97 → 18.70; staff tips 10.20 / 35.80 against the section's 9.89 / 35.84 (within ±0.35).

#### 2.8.9 Up-and-down work, hands, other

| Item | Z | Tier | Source |
|---|---|---|---|
| Auf-u-Ab stud (= Futter 05 08 02-2, one part) | 0.00 → **−12.30** ("12,3"), running ⌀1.5 | T3 | 05-08_32-2 |
| Auf-u-Ab hub 05 02 04-2 (runs on the stud; carries the wheel and the 2.2 r6 hand seat) | **−3.42 → −13.20**: plate side 4.95, wheel 1.0, dial side **3.80** with the hand seat ⌀2.2 r6 at −11.80 → −13.20 | T1 (seat) / T4 (lengths) | 05-02_10; §4.4. **OVERRIDDEN (drawn: 5.2 / 2.8)** |
| Auf u. Abrad (z120, raised 0.25 on its stud) | **−9.40 → −8.37** (0.05 above the pinion end −9.45; 0.95 clear of the dial) | T4 | RD §2. **OVERRIDDEN (section: −9.65 → −8.62)** |
| Auf-u-Ab-Zeiger boss / blade | boss −11.80 → −13.20 (1.4, fully on the seat); blade −11.80 → −12.30 | T1 (boss) / T4 | §4.5 |
| Stundenzeiger: pipe end on the Stundenrohr step / blade | −11.64 / **−14.09 → −14.74** (overall 3.1) | T1 (3.1, 3.0 seat) / T4 | §4.5. Section T3 −13.50 → −14.15 |
| Minutenzeiger blade / boss | blade −16.75 → −16.10; boss forward on the square, −16.10 → −18.10 | T3 / T4 | inf_axial §3.7; §4.5 |
| Gegensperrkegel blade (05-05_12, 2 / 1 −0.03), in the Gegensperrad plane | **4.85 → 5.85** (blade 1.0; boss 2.0, 4.35 → 6.35) | T1 ("6,3" from the pivot tip) / T4 | 05-05_11; §3.4 |
| Stop lever (Stellhebel), Stellfeder | **18.20 → 18.95** (dial down; 18.25 → 19.00 dial up); pad 16.90 → 18.20; Stellfeder 18.30 → 18.90 | T4 | §3.5 |

Interference summary (all clear): barrel bottom 3.50 / Minutenrad top 1.80 = 1.70; Schneckenrad teeth 2.54 and Vorreiber/hub 1.97 / Minutenrad 1.80 = 0.74 and 0.17; Auf u. Abrad −8.37 / Stundenrad −7.49 = 0.88; seconds tip −12.97 / hour hand −14.09 = 1.12; Auf-u-Ab hand boss −13.20 / hour hand −14.09 = 0.89; hour hand −14.74 / minute hand −16.10 = 1.36; balance rim 22.80 / plate 22.35 = 0.45; hairspring top 34.20 / cock relief 34.95 = 0.75; back pivot tips 22.00 / plate face 22.35 = 0.35; band top 18.06 / stop lever 18.20 = 0.14; crossed band ≥ 0.86 in plan from every plate-gap obstacle in its Z band (closest: the stop-lever pivot head; closure.py).

---

### 2.9 Frame assembly and adjustment

| Step / end-shake | How it is set | Value |
|---|---|---|
| Plate gap | Set by the pillars: shoulders in the 0.3 +0.03 recesses; spigots f7 in the 4.50 holes; M2.6 screws from both outer faces. **Fitted (rev 2.1):** pillars made 19.67 and faced as a set to a measured gap of 19.00 +0.01 (§2.3; see "Fitting the plate gap and the end-shakes" below) | 19.00 … 19.01 |
| Barrel arbor | Fixed: Federhausbrücke underside (22.35) − shoulder span 22.25. Adjust by facing the upper shoulder | 0.10 |
| Barrel drum on the core | Hub space 11.8 − core 11.72 (05-07_04 (a) "0,05 +0,06") | 0.08 |
| Fusee | Schneckenfutter end (19.65) − 6.1 step (19.61); 0.04–0.05 over the fitted gap. Face the Futter spigot end only if needed (see below). Shop alternative: keep the drawn 19.7 span and face the Futter to 7.01 (within 7.1 −0.2); that needs the J-K recess ≥ 0.8 deep | 0.04 |
| Centre arbor | Back shoulder on WN-301 (19.00); front by the WN-302 inner face, pressed to 0.10 +0.02 below Z 0 | 0.05 … 0.12 (T4) |
| Third | Press the Zwischenbrücke WN-300 bush to its face at −4.07 (drawn "0,7 +0,02" recess, at its maximum) | 0.02 (0.02–0.12 over the 23.05 −0.1 tolerance) |
| Fourth | Set the Zwischenbrücke jewel face to −5.13 (the drawn "1,7"(?) recess would give −5.05, i.e. bind; set at assembly) | 0.03 |
| Escape | Endstone span 22.83 set by the height of the screwed upper chaton (Oberplatte 26) | 0.03 |
| Balance | Endstone span 25.65 set by the chaton heights in the two cocks (lower 1.20, upper 1.50 recess) | 0.05 |
| Wechselrad | Hub 7 −0.1 between the plate outer face (−3.35) and the dial inner face (−10.35) | 0 … 0.10 (model 0.05) |
| Auf u. Abrad | Wheel raised 0.25 on its hub/stud to −9.40; retained by the dial | T4 |
| Stop lever | Shouldered screw S1: lever end-shake 0.05 on the 0.80 shoulder | 0.05 |
| Hour wheel (rev 2.1) | Stundenrohr collar front face −10.15 against the dial inner face; rear face against the Viertelrohr pinion | 0.14 … 0.24 total |

**Fitting the plate gap and the end-shakes (rev 2.1).** The values in the table assume a 19.00 plate gap.
- **The problem.** The drawn pillar and recess tolerances let the gap range from 18.93 to 19.01.
  - Every end-shake that spans both plates changes one-for-one with the gap. At 18.93 the nominal parts bind: fusee −0.03, centre arbor −0.02, third −0.05, fourth −0.04, escape −0.04.
  - Worse, everything hung from the upper plate drops with it: the Gangfederkloben and Ruhestein, the stop lever on S1, and the J-K floor. Their clearances to lower-plate parts (§2.3, "Plate gap produced") cannot be restored by fitting bearings.
- **The rule: fit the gap first, then the bearings.** That is the normal chronometer practice:
  1. **Fit the gap.** Make the three pillars 19.67 between shoulders. Assemble the bare frame with all six screws tight and no arbors. Measure the gap at each pillar: overall frame height minus the two measured plate thicknesses. Face the pillar shoulders as a set until every reading is 19.00 +0.01 and the three agree within 0.005. Then open the frame.
  2. **Measure each arbor.** Take its shoulder span S, or its tip-to-tip length for the escape arbor.
  3. **Fusee.** With the drawn Futter the end-shake is 0.04–0.05 over the fitted gap. Face the spigot end only to open it, if the arbor's 19.61 span comes out long.
  4. **Centre arbor.** Press WN-302 with a micrometer-stop bush press, its inner face S + 0.05 − G below Z 0 (nominal 0.10; range 0.04–0.10).
  5. **Third.** Press the Zwischenbrücke WN-300 the same way, face to Z = G − S − 0.03 (nominal −4.07).
  6. **Fourth.** Set the jewel setting's seat depth so the jewel face is at Z = G − S − 0.03 (nominal −5.13).
  7. **Escape.** Make the upper chaton's flange 0.55 thick, 0.05 over its 0.5 seat. Face its underside until the endstone span is the arbor length + 0.03 (0.02–0.04). The finished flange is 0.46–0.51, so it stands at most 0.01 proud.
  8. **Barrel arbor.** 0.10 over the fitted gap; no fitting needed.
  9. **Balance.** It does not depend on the gap: both cocks sit on the upper plate.
  10. **Dial side.** Face the Wechselrad hub to give 0.05 against the actual dial seat, because the Werkring "7 −0.1" moves the dial by up to 0.10. Check the hour-wheel collar (0.10–0.20) at the same time.
- **Record.** Write the gap and every fitted end-shake into the §8 B6 record. `closure.py` (group `review`) checks the clearances at the fitted gap, the drawn-tolerance extreme (REJ), and that each adjustment covers its tolerance.

Assembly order (T4): fit the bushes, studs and pins into the plates. Mount on the Oberplatte inner face the lower cock, the Gangfederkloben (with the detent, Goldfeder and banking screw **pre-set**, §6 step 5: the banking screw cannot be reached once the plates are closed), the stop lever with its spring, and the Drahtfeder post. Set the barrel, fusee and train between the plates, then close with the Oberplatte and the 6 pillar screws. Fit the Schneckenfutter (3 × M1.4), press the Staubfutter onto its boss, and fit the Federhausbrücke with Sperrad and Sperrkegel, the escape chatons, the balance and the upper cock. On the dial side fit the Zwischenbrücke (2 × M2.6, 2 pins), the escape endstone cap, the motion work, Werkring, dial and hands.

---

### 2.10 Values superseded in this area (do not model)

Listed only so that a reader who meets them elsewhere knows they were overruled. Each is **superseded**:

- clear plate gap 19.6 (superseded; adopted 19.0);
- the reading "22,3 − 3,3 = 19" (superseded; 22.3 is the lower-plate inner face → barrel-bridge underside = 19.0 + 3.35);
- fusee plate hole 2.83 (superseded; the hole stays 2.70, the journal is finished to 2.68);
- train back pivots 5.1 / 4.6 / 4.5 (superseded; adopted 3.0);
- seconds extension 9.2 (superseded; adopted 7.84);
- fusee square 15.4 or 13.7 (superseded; adopted finished 18.3);
- barrel core "⌀11.7" (a misreading; the core is ⌀13.3 and 11.7 long);
- escape wheel ⌀15 (superseded; ⌀14.00);
- **rev 2:** WN-302 bore 3.61–3.62 (now 2.2 H7); escape arbor tip −1.83, wheel 17.17 → 17.97 × 0.8, endstone 21.00 (now §5.2); Gangfederkloben rotated −3.9° at 69.5° with M1 at Z 16.70 (now §5.3); Staubfutter at 22.35 → 40.45 and its ⌀13.4 base counterbore (now pressed on the Futter, 23.85 → 41.95); Deckplatte 18.61 → 19.61 "1 thick" (now 0.8, 18.51 → 19.31); motion-work Z from the section (now the §4.3 chains).

### 2.11 Points that were open in this section: all closed in rev 2 (defaults in §7)

1. **G-H recess face (hole 36):** outer face (§7 #4).
2. **Oberplatte N-O rebate (1.35 −0.05):** not modelled. It carries no part in the Feder movement, and nothing in the frame needs it (§7 #21).
3. **Schneckenfutter bore:** 1:70 taper reamed to the journal, mean 4.45 H7/g6 (§2.4, §7 #2).
4. **Staubfutter base:** pressed on the Futter's ⌀8 r6 boss, base 23.85 (§2.4, §7 #3).
5. **Federhausbrücke "73,5" against "5":** "5" adopted (§2.4).
6. **Lower-plate thickness:** 3.35 (the only legible value; plate-gap closures use it).
7. **Escape wheel thickness and Z:** 1.40 rim, 0.80 web, Z 17.00 → 18.40 (§5.2, §7 #5).
8. **Balance setting split:** 1.20 / 1.50 (§7 #8).
9. **Fourth-wheel jewel face:** −5.13 (§7 #20).
10. **Zwischenbrücke seats:** §7 #13.
11. **Barrel square start inside the bridge bore:** 0.47 (§7 #12).
12. **Barrel core:** ⌀13.3 × 11.7.
13. **Minutentrieb front bearing:** ⌀2.2 e8 journal in WN-302 bored 2.2 H7 (§2.5).
14. **Lower-plate hole 23 "7":** model ⌀4.4 through. The "7" is not a feature of the Feder movement (§7 #22).
15. **Stop lever Z:** 18.20 → 18.95 (§3.5).
16. **Fusee wheel/body stack:** closes (§2.8.3).

---

## 3. Power: mainspring, barrel, band, fusee, stop-work

Baugruppen 05 07 (Federhaus, barrel) and 05 06 (Schnecke, fusee), plus the power-side parts that sit in 05 05 (Gegensperrkegel) and 05 08 (barrel click).

### 3.0 Conventions for this section

- **Units:** mm and degrees. Every value uses a decimal **point**. Text quoted from a drawing keeps its original commas.
- **Plan frame:**
  - x = O(+)/W(−), y = N(+)/S(−).
  - Origin at the Minutenrad axis (plate hole 1).
  - Viewed **from the back** (the upper-plate side; the fusee small end faces the back).
  - Angles are CCW from +x, viewed from the back.
- **Z:** Z = 0 at the lower-plate (Unterplatte) inner face, + toward the upper plate.
  - Frame values used here: lower plate −3.35 → 0; upper plate 19.0 → 22.35; Federhausbrücke 22.35 → 25.67.
  - Unless stated otherwise, arbors are given in their **down** position (lower shoulder on Z 0). In the up position add the end-shake: fusee +0.04, barrel arbor +0.10.
- **Rotation senses (state these in the model):**

  | Motion | Sense, viewed from the back |
  |---|---|
  | Fusee, running | **CW** |
  | Fusee, winding | **CCW** (opposite to running) |
  | Barrel drum, running | **CCW**: crossed band (reverse fusee), so the opposite sense to the fusee |
  | Barrel drum, winding | **CW** |
  | Barrel arbor | Stationary in use. It is held by the Sperrad and click against **CW**, and turned **CCW** only at set-up |
  | Fusee groove helix | **Left-hand** |
  **Why the band is crossed (rev 2, T1/T3).** Three independent drawn facts agree, and none of them supports an open band:
  1. **Clearance.** An open band would run through the lower balance cock (05-08_04 block 8 × 20 × 10, Z 9 → 19, on table holes 22/36/37) whenever its Z is above 9, i.e. from 2 turns to full wind. The crossed band clears every plate-gap part in its Z band by ≥ 0.86 (closest: the stop-lever pivot head).
  2. **Click sense.** The barrel click drawn on 001 has its pivot (row 46) north of its nose on the west side of the Sperrad, so it is pushed onto its pivot if the arbor turns CW from the back. It therefore locks CW, which means the spring is set up CCW and the drum runs CCW, opposite to the fusee.
  3. **Turn count.** The crossed span grows from 18.8 to 29.9 as the fusee winds, which gives **5.00 barrel turns**: the "5" of sheet 20. An open band gives 4.92.

  The 05-06_04 C-D view is a schematic and was the only basis for the open band in rev 1 (via the scaled lever); it is not used for the band path.

- **Tiers:**

  | Tier | Meaning |
  |---|---|
  | T1 | Drawn, or closes exactly from drawn values |
  | T2 | Engineering rule |
  | T3 | Scaled from a drawing |
  | T4 | Convention or fitted value |

- **OVERRIDDEN (drawn: x)** marks a value that replaces a drawn dimension.
- **Plate axes used here** (05-08_03a / 01a tables):

  | Axis | Plate hole | Position |
  |---|---|---|
  | Fusee | 10 | (16.708; 15.292) |
  | Barrel | 45 | (−24.784; 6.0) |
  | Auf u. Ab | 2 | (0.0; 23.0) |

  The fusee-to-barrel centre distance is 42.520.

**Superseded values. Do not model these:**

| Superseded | Adopted |
|---|---|
| Chain 05 07 04, 780 | Steel band 05 07 03, 730 ±3 |
| Mainspring 15 × 0.39 × 1310 / 1355 (inferred) | 15 × **0.37** (drawn, 05-06_20) × 1385 |
| Barrel core "⌀11.7" (a misreading) | Core ⌀13.3, length 11.7 (family B) |
| Family-A arbor seats ⌀5 | ⌀4.48 in 4.5 +0.1 |
| Fusee plate hole 2.83 | Hole stays 2.70 ±0.009; journal finished to 2.68 |
| Stop element at 35° from N, or in pin hole A; rev 1 Stellungssteg at r ≈ 6.95, −3° from N, and the scaled straight lever | Rev 2 stop nose at r 8.4 → 11.6 and bell-crank stop iron (§3.5) |
| Fusee square 15.4 or 13.7; rev 1 "corners 3.10 → 2.93" | Finished 18.3; **3.1□ → 2.92□ across the flats** |
| Fusee shoulder span 19.7 | 19.61 |
| Barrel turns 5.08 (chain), 4.93 (open band) | **5.00** (crossed band 0.8 × 0.08) |
| Open band, drum CW; band strip 0.22 thick | Crossed band, drum CCW; strip **0.08** thick |

---

### 3.1 Mainspring

### Zugfeder (mainspring) — none (no sheet)

- **Source sheet(s):** No part sheet; width from `05-07/Wempe_05-07_01.jpg` ("Zugfeder 15", cavity [15.8 ±0.1], family A); thickness drawn on `05-06/Wempe_05-06_20.jpg` ("Zugfeder 15 × 0,37"); hook position from `05-07/Wempe_05-07_04.jpg` and `05-07/Wempe_05-07_06.jpg`.
- **Material/stock (rev 2):** The peak bending stress at full wind is ≈ 2 100–2 200 N/mm², at the limit for plain carbon spring steel (it takes a set and loses torque). **Use a modern Co-Ni-Cr mainspring alloy (Nivaflex type, UTS ≥ 2 400 N/mm²)**, 15 × 0.37, or a premium hardened carbon strip only if it is torque-tested as below. The spring is specified by its **torque**, not its free form: on a mainspring torque meter in the drum, it must give **M = 427 + 61.9·n N·mm ±8 % (n = barrel turns from run-down, n = 0 … 5.0), measured after 50 full wind/let-down cycles**, and **its slope must satisfy M(5.0) / M(0) = 1.725 ±0.07 (1.655 … 1.795)** (rev 2.1).
  - The fusee corrects only the shape of the curve, not a tilt in it. A spring tilted +8 % end to end still passes a ±8 % band, but it doubles the daily torque spread, from ±2.1 % to ±4.8 %. The slope limit holds the spread over the top 24 h to ±2.8 % or less (closure.py `review`).
  - The spring maker chooses the free form (S-curve) to meet both criteria. This curve is what the fusee was drawn for (sheet 20).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Width | **15.0** | T1 | 05-07_01 "Zugfeder 15"; cavity 15.65 leaves ≥ 0.3 shake each side (closure.py) |
| Thickness | **0.37** | T1 | 05-06_20 "Zugfeder 15 × 0,37" |
| Length | **1385** | T2 | Half-area rule L = π(R² − r²)/(2t), with R 19.25 (⌀38.5 bore), r 6.65 (⌀13.3 core), t 0.37. Cross-check: the torque rate implied by sheet 20 gives ≈1320 (within 5 %) |
| Inner end | Eye hooked on the Federkern pin 05 07 02-2 (⌀0.5) | T4 | Resolved_Design; 05-07_08 |
| Outer end | Hole or eye engaging the 45° M2.6 hook 05 07 01-3 | T4 (form) / T1 (position) | Resolved_Design |
| Hook height | Hook centre **7.85 above the drum floor (inner face)** = 9.05 from the drum's outer bottom = the spring centreline | T1 | 05-07_04 "7,85 ±0,05"; 05-07_06 "9,05 ±0,05"; res_barrel §2 |
| Z in the movement (barrel arbor down) | Strip edges Z 5.05 → 20.05; centreline Z 12.55 | T1/T4 | Drum position in §3.2.1 |
| Set-up | **¾ turn** | T1 | 05-06_20 "3/4 Umgang gespannt" |
| Turns available | Usable turns (85 % of theoretical, T4) − ¾ set-up = 5.92 ≥ 5.00 needed (crossed band) | T2 | closure.py |
| Let-down inner radius | 14.4 (> core r 6.65 + 0.5) | T2 | closure.py |

- **Mates with:** Federkern pin 05 07 02-2; hook 05 07 01-3 in the drum wall; drum cavity (⌀38.5, floor-to-seat height 15.65).
- **CAD notes:**
  - Model the spring as wound in the let-down state, or as a simple annular solid for the assembly.
  - The 15-wide spring overhangs the 11.7-long core by about 1.65 at each end. The inner turn sits at r 6.65 (core ⌀13.3), outside the ⌀12 hub bosses, so it clears them.
  - Spring torque implied by sheet 20: M ≈ 427 + 61.9·n N·mm, where n = barrel turns wound from run-down. It was derived on the chain basis (inf_fusee §4). It is now also the **acceptance curve** for the spring (above). With the crossed 0.08 band the fusee output is 354 N·mm at run-down and 332 at full wind: ±5.4 % over the whole run, **±2.1 % over the top 24 h** (closure.py). This curve is already close to the best choice for daily winding. Lowering its offset would flatten the whole run (±2.9 %) but worsen the top 24 h (±2.9 %), so keep it. What matters is that a delivered spring keeps the slope (above).

---

### 3.2 Barrel, family B (Federhaus mit Deckel 05 07 01)

**Family choice.** The barrel is family B throughout:
- drum 05-07_06;
- cover 05-07_07;
- an arbor built to mate with them (05 07 02-1, no sheet).

Family A, the built-up barrel on 05-07_01/02/09/10, is **not** modelled. Its ⌀5 seats are superseded (Resolved_Design R3). The core diameter ⌀13.3 is common to both families.

#### 3.2.1 Barrel axial stack (summary, barrel arbor down)

| Item | Z from → to |
|---|---|
| Arbor lower pivot tip ("Kugel poliert") | −5.00 |
| Arbor lower shoulder (bears on the lower-plate inner face) | 0 |
| Drum outer bottom face | 3.50 |
| Drum floor inner face | 4.75 (4.65–4.75 over the floor tolerance) |
| Drum hub-boss top = core lower end | 6.60 |
| Mainspring hook centre | 12.55 |
| Core upper end / cover hub inner end | 18.30 / ≈ 18.40 |
| Drum seat shoulder (cover rim seats here) | 20.40 |
| Drum rim top / cover outer face | 21.60 / 21.70 |
| Arbor upper shoulder (bears on the bridge underside) | 22.25 |
| Federhausbrücke | 22.35 → 25.67 |
| Square start / end | 25.20 / 35.20 |
| Sperrad | 25.67 → 28.32 |

- **Basis:** arbor lower seat ≈ 6.6 and core length 11.7 (res_barrel §3b); drum dimensions from 05-07_06.
- **Checks:**
  - Cover outer face → upper shoulder = 0.55, against 05-07_04 "0,6 −0,1" ✓.
  - Section cross-check: drum bottom 3.70 ±0.26 and top 21.75 ±0.5 (inf_axial §2.2, T3) ✓.
  - Drum top to bridge underside clearance: 0.65.

### Federhaustrommel (barrel drum) — 05 07 01-1

- **Source sheet(s):** `05-07/Wempe_05-07_06.jpg` (re-issued 8.4.47; changes (a) and (b) 1948). Blank: `05-07/Wempe_05-07_05.jpg`. Sub-assembly: `05-07/Wempe_05-07_04.jpg`.
- **Material/stock:** Ms (brass). Blank R 05 0701-1: ⌀43.6 drawn tube, ⌀38.2 bore, ⌀14, 3, 3.9, 20.5, ⌀8 (a), "Toleranz ±0,1".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outside ⌀ | 41.6 −0.1 | T1 | 06 |
| Overall height | 18.1 −0.15 | T1 | 06, 04 |
| Spring bore | ⌀38.5 +0.1 | T1 | 06 |
| Cover seat (rev 2.1 reading) | **5° undercut (dovetail)**: ⌀39.2 s6 (+0.059 / +0.043) at the rim mouth (Z 21.60), widening at 5° to **≈ ⌀39.41** at the seat shoulder 1.2 below (Z 20.40). The "5°" on 06 is this undercut, not a lead-in: it matches the cover's 5° edge, which widens from ⌀39.2 to 39.39 toward its inner face (07). **OVERRIDDEN (rev 2 reading: "5° lead-in at the rim")** | T1 (values) / T3 (reading) | 06; 07; closure.py `review` |
| Cover-seat depth (rim top → seat shoulder) | (1.2 −0.1), bracketed reference | T1 | 06 change (a); res_barrel §2 |
| Floor thickness | 1.25 −0.1 (b) | T1 | 06 |
| Floor-hub top → seat shoulder | 13.8 −0.05 | T1 | 06 |
| Hub-boss top above the outer bottom | 3.1 −0.1 | T1 | 06 |
| Hub boss | ⌀8 (b) at its top, flaring to ⌀12 where it meets the floor | T1 (⌀) / T3 (flank) | 06 |
| Hub bore | ⌀4.5 +0.1 (b) | T1 | 06 |
| Spring cavity (floor top → seat shoulder) | 15.65 (15.5–15.75); half 7.825 | T1 | res_barrel §2 |
| Mainspring hook hole | M2.6 tapped radially through the wall at **45°** (in the 06 plan view), centre **9.05 ±0.05 (a) from the outer bottom face** | T1 | 06; res_barrel §2 |
| Axial floor slot | Through the floor at 9 o'clock in the 06 plan (45° from the hook, on the same side): 2 +0.05 tangential × 0.8 +0.05 radial (a). Radial position: inner edge 0.95 +0.15 (a) inboard of the bore, so the slot spans **r 18.30 … 19.10** (0.15 land to the bore wall) | T1 | 06; res_barrel §1a |
| Barrel-end band slot | See the separate entry below (01's oblique 2.5 slot) | T3/T4 | Resolved_Design |

- **Mates with:**
  - Cover 05 07 01-2 (5° dovetail snap fit in the undercut seat; notch aligned with the floor slot).
  - Arbor seats ⌀4.48 (running).
  - Mainspring and hook 05 07 01-3.
  - Band hook 05 07 03-3.
- **CAD notes:**
  - The floor slot and the cover notch together are **not** a connector feature (res_barrel §1c). Their purpose is unknown, so model them as drawn.
  - Struck on 06: "18,3 +0,02". That is the same radius as the cover notch bottom.

### Federhausdeckel (barrel cover) — 05 07 01-2

- **Source sheet(s):** `05-07/Wempe_05-07_07.jpg` (1941; change (a) 20.4.48).
- **Material/stock:** Ms 58 DIN 1751, "Rondell 40×3,5".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Seat ⌀ | 39.2 r6 (+0.050 / +0.034) | T1 | 07 |
| Snap edge | 5° taper (a) from ⌀39.2 r6 at the outer face to **⌀39.39 at the inner face**; "Scharfe Kante leicht brechen". It snaps past the ⌀39.2 drum mouth (≈0.07 radial interference) and locks under the drum's 5° undercut, with ≈0.03 radial clearance when seated | T1 | 07; 06 |
| Plate thickness | 1.3 −0.1 (a) | T1 | 07 |
| Hub overall length | 3.3 −0.1 (a). The hub projects 2.0 inward from the plate's inner face | T1 | 07; res_barrel §3a |
| Hub | ⌀8 −0.2 (a) at its inner end, flaring at 45° to ⌀12 −0.2 (a) at the plate | T1 | 07 |
| Bore | ⌀4.5 +0.1 (a) | T1 | 07 |
| Notch 1 (9 o'clock in the 07 plan) | 2 +0.05 wide; bottom at **r 18.3 ±0.02** (1.3 deep from ⌀39.2). Matches the drum floor slot | T1 | 07; res_barrel §1a |
| Notch 2 (3 o'clock) | 2.7 +0.1 wide × 2 +0.2 deep. Purpose not stated (probably a lever-off notch, T4) | T1 | 07 |

- **Mates with:** Drum seat (5° dovetail, rev 2.1); arbor upper seat ⌀4.48 (running).
- **CAD notes:**
  - The space between the hubs is 13.8 − (3.3 − 1.3) = **11.8**, which sets the core length (§ Federkern).
  - **Fit (rev 2.1).** Model both the drum seat and the cover edge as 5° cones that meet at the seat shoulder. Snap the cover in with a barrel-cover press (support the drum floor), and remove it by levering at notch 2.
  - Trial-fit the first cover. If it shaves brass at the mouth instead of snapping, ease the 39.39 edge on the lathe to 39.33–39.35.

### Federhausring (barrel ring, family A) — 127-556.04-088

- **Source sheet(s):** `05-07/Wempe_05-07_10.jpg` (1941, "KOPIE").
- **Material/stock:** Messingrohr 42×2 Din 1755 Ms58, Rohmaß ⌀42 × 2 × 20.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Dimensions as drawn | 42, 38, 2, 19, [⌀39.2 −0.1 (?)], 1.5, [5°]; "Toleranz ±0,1" | T1 | audit_barrel row 10 |
| Status | **Family A. Not used in the adopted family-B barrel**; listed for completeness only | — | Resolved_Design R3 |

- **Mates with:** Family A only (bottom -089, cover -090, hook -091; none of these has a sheet).
- **CAD notes:** Do not model.

### Haken im Federhaus (mainspring hook) — 05 07 01-3

- **Source sheet(s):** No sheet. Called out on `05-07/Wempe_05-07_04.jpg`; tapped hole on `05-07/Wempe_05-07_06.jpg`.
- **Material/stock:** Steel, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thread | M2.6, screwed radially through the 1.55 drum wall at 45° | T1 | 06 |
| Height | Centre 9.05 ±0.05 from the outer bottom = **7.85 ±0.05 above the floor** (7.75–7.95 over tolerances) | T1 | 04, 06; res_barrel §2 |
| Projection into the cavity | 3.05 −0.1 (a) | T1 | 04 |
| Projecting-portion ⌀ | 2.05 −0.1 (a), dimensioned across the hook on 04 | T3 | res_barrel §1a |
| Head form | Plain cylinder ⌀2.05, square end, no undercut | T4 | — |

- **Mates with:** Drum M2.6 hole; mainspring outer end.
- **CAD notes:** The "2,05 −0,1" may instead be the M2.6 tap-drill core (res_barrel). Either reading gives the same model.

### Schlitz für Bandhaken im Federhaus (barrel-end band slot) — none (no sheet)

- **Source sheet(s):** Form from `05-07/Wempe_05-07_01.jpg` (family A plan). No B-family sheet dimensions it.
- **Material/stock:** Feature cut in the drum wall.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | Oblique slot through the drum wall, **2.5 tangential at the OD** | T3 | 01; Resolved_Design |
| Axial width | Hook thickness + 0.05 ≈ **0.85** (band hook 0.75–0.80) | T4 | res_barrel §1a |
| Axial position | Centre at the band's Z at full wind: **Z ≈ 17.7** (= 5.91 + z_c(8.761) = 5.91 + 11.75). There the band leaves the barrel and the hook end sits | T4 | Band lay (inf_fusee §2: ≈ 2 mm per barrel turn, from Z ≈ 7.1 at run-down to ≈ 17.7) |
| Angular position | Free. "Schlitz für Kette erst bei Schneckenmontage einsetzen": the slot is cut at fusee assembly | T4 | 01 note |
| Obliquity | Leans so that the barb of hook 05 07 03-3 lodges against the slot wall under band tension. The band pulls the hook tangentially toward the fusee; when running, the spring turns the drum **CCW** from the back against that pull, and the band arrives on the drum's NE side (crossed band, bearing ≈57° from the barrel axis at full wind) | T4 | — |

- **Mates with:** Bandhaken f. Trommel 05 07 03-3.
- **CAD notes:** Keep it clear of the 45° spring-hook hole (Z 12.55) and the floor slot.

### Federkern (barrel arbor, family B) — 05 07 02-1 (kompl. 05 07 02)

- **Source sheet(s):** Part sheet missing. `05-07/Wempe_05-07_08.jpg` (Federkern kompl., 1943) gives only 40.2, 5, 10, the pin "0,5 −0,05" at 15°, "Kugel poliert" and "poliert". Frame from `05-08/Wempe_05-08_03a.jpg` (hole 45) and `05-08/Wempe_05-08_13.jpg` (bridge hole 45).
- **Material/stock:** Hardened steel (family A 09: Präz. Rundstahl 14 Din 175, "härten … anlassen 270"), T4 for B.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Overall length | **40.2** = 5 (lower pivot) + 22.25 (shoulder span) + 12.95 (upper pivot 2.95 + square 10) | T1 | 08; Resolved_Design |
| Lower pivot | **⌀2.88**, 5.0 long from the "Kugel poliert" tip to the shoulder. Runs in the lower-plate hole 45 **⌀2.90 ±0.009**. Z −5.00 → 0; projects ≈ 1.65 beyond the plate's outer face | T1 (5, hole) / T4 (⌀, R2) | Resolved_Design; res_barrel §3b. Family-A "3⌀" (01/09) does not apply |
| Lower seat | **⌀4.48** (f7 to the 4.5 +0.1 hub bore), ≈ 6.6 long (6.55–6.65). Z 0 → 6.60 | T1/T4 | Resolved_Design; res_barrel §3b. ⌀5 seats are **superseded** |
| Core | **⌀13.3**, length **11.7** (11.69–11.75 = 11.8 between the hubs − drum shake). Z 6.60 → 18.30 | T1 (⌀, 05-07_01/09) / T1 closure (length) | res_barrel §3b. An earlier "⌀11.7" misread the length as a diameter |
| Upper seat | ⌀4.48, ≈ 3.95. Z 18.30 → 22.25 | T1/T4 | 22.25 − 18.30 |
| Shoulder span | **22.25** (mid of family A's [22.2 +0.1]) | T1 | Resolved_Design; closure.py |
| Upper pivot | **⌀3.88**, 2.95 long, Z 22.25 → 25.20. Runs in bridge hole 45 **⌀3.9 ±0.01** (bridge 3.32 −0.04) | T1/T4 | Resolved_Design; res_barrel §3b |
| Square | **2.7□, Kegel 1:100, length 10**. Z 25.20 → 35.20. It starts ≈ 0.3–0.47 inside the bridge bore (diagonal 3.82 < 3.89, clears) | T1 | 08 "10"; 09 "2,7□ ±0,02, Kegel 1:100"; Resolved_Design |
| Spring pin | 05 07 02-2: ⌀0.5 −0.05, through the core at 15° (08). Place it on the spring centreline, Z ≈ 12.55 | T1 (⌀, angle) / T4 (Z) | 08 |
| End-shake in the frame | **0.10** (22.35 − 22.25) | T1 closure | closure.py |
| Drum shake on the core | 0.05 +0.06 (04 (a), read as the drum end-shake on the core; inferred) | T1 (?) | 05-07_04; res_barrel open point 2 |

- **Mates with:**
  - Lower plate hole 45 (2.90).
  - Drum hub and cover hub (4.5 +0.1).
  - Bridge hole 45 (3.9).
  - Sperrad (square).
  - Mainspring inner eye via pin 05 07 02-2.
- **CAD notes:** Keep the two shakes separate: arbor-in-frame 0.10, and drum-on-core 0.05–0.11.

### Sperrad (barrel ratchet / set-up wheel) — 05 07 00-3

- **Source sheet(s):** `05-07/Wempe_05-07_03.jpg`, title "Zeichnung Nr 050700-3", note "a.) Zeichnungs-Nr. war 05 05 00-1". The brief's "05 07 03-3" is the Bandhaken f. Trommel number.
- **Material/stock:** Messingblech 3 Din 1751 Ms58.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Teeth | **z 16** ("Zähnezahl: 16"); pitch 22.5° | T1 | 03 |
| Tip ⌀ | 14.1 −0.2 | T1 | 03 |
| Root ⌀ | 11.1 −0.2; tooth depth 1.5 | T1 | 03 |
| Tooth form | Construction values drawn: "1,2" (face offset from a radial line), "6,4" (construction circle), "10°", "12,5" (tooth-back construction arc). They carry no r/⌀ symbol, so their meaning is uncertain | T3 | 03; audit_barrel row 3 |
| Tooth form to model | Hook tooth. The face is a straight line offset 1.2 from the radial through the tip, so the tip leans toward the locking direction. The back is a convex arc from the tip to the next root (fit through the 12.5 construction circle). Root radius 0.1 | T4 | — |
| Bore | 2.7□ H7 +0.009, Kegel 1:100 | T1 | 03 |
| Thickness | 2.65 −0.1 (b) (was 2.63 −0.03) | T1 | 03 change (b) 24.11.47 |
| Z | Seated on the bridge outer face: **25.67 → 28.32** | T1 | inf_axial §2.1 |
| Locking sense | The click stops the arbor turning **CW (from the back)**; set-up is **CCW**. This is the sense of the click as drawn on 001 (pivot 46 north of the nose), and it makes the drum run CCW: crossed band. Cut the hook teeth so their faces catch a CW-turning arbor. **OVERRIDDEN (rev 1: locks CCW, from an assumed open band)** | T1 (click placement) / T2 | 001; 05-08_13 row 46; closure.py |

- **Mates with:** Federkern square; barrel click 05 08 05-2 (nose inside the tooth band R 5.55–7.05).
- **CAD notes:** Measured on layout 001: ⌀13.88 (inf_planview §1.1).

### Sperrkegel (barrel click) — 05 08 05-2

- **Source sheet(s):** `05-08/Wempe_05-08_14.jpg` (1941; change (a) 25.5.48). Assembly: `05-08/Wempe_05-08_12.jpg` (Federhausbrücke kompl.). Pivot from the Federhausbrücke hole table on `05-08/Wempe_05-08_13.jpg`, row 46.
- **Material/stock:** Messingblech 3 Din 1751 Ms 58 federhart; "nicht eingetr. Toleranz ±0,1".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thickness | 2.6 −0.03 / −0.05 | T1 | 05-08_14 |
| Pivot bore | ⌀3.2 +0.03 (a) | T1 | 05-08_14 |
| Outline | Overall 17.4; height 3.5 at the nose end; R12.5 underside arc; R8.5 upper arc; R6 reference arc centred 5.142 / 7.212 from the bore; 9.7 (bore → nose, T4 reading); 5.7; 7.5; R1 tail tip | T1 (values) / T4 (meaning of 9.7) | 05-08_14; inf_planview §2 (Clicks) |
| Pivot position | Row 46: verbatim "• 17,046 / » 29,474, Körner, 2,1, — M2,6", i.e. plate **(−29.474; 17.046)**, M2.6 tapped in the Federhausbrücke. \|45 − 46\| = 12.000 = drawn "12" | T1 | 05-08_13 table |
| Nose | (−30.44; 7.68): 9.42 from row 46 and 5.90 from the barrel axis, inside the tooth band | T3 | inf_planview (001) |
| Tail | (−25.10; 23.95) | T3 | inf_planview (001) |
| Z | On the bridge outer face: 25.67 → 28.23 (model thickness 2.56, §2.4) | T1 | — |
| Pivot screw | Shouldered screw M2.6, shoulder ⌀3.18 × 2.65 (WN-22 on 05-08_12 is the candidate; not in the set) | T4 | inf_planview |

- **Mates with:** Sperrad z16; Federhausbrücke (row 46); click spring.
- **CAD notes:** Rotate the click about row 46 until the nose seats in a Sperrad tooth root.

### Sperrkegelfeder (barrel click spring) — none (no sheet)

- **Source sheet(s):** None. Not drawn on 001 either.
- **Material/stock:** Hardened steel leaf, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | Straight steel leaf **0.25 × 2.0 × ≈ 10**. One end is held under a screw on the Federhausbrücke outer face; the free end presses the click's tail side toward the Sperrad | T4 | Resolved_Design §4 ("steel leaf, on the drawn screw positions (… row 46 Sperrkegel)") |
| Fixing | Under the row-46 pivot screw head, or under a separate M1.4 screw on the bridge (choose one) | T4 | — |
| Z | 25.67 → ≈ 27.7 | T4 | — |

- **Mates with:** Barrel click 05 08 05-2.
- **CAD notes:** This part is designed, not drawn. Replace it if a WN-22 or spring sheet appears.

---

### 3.3 Steel band (adopted connector)

### Schneckenband (fusee band assembly) — 05 07 03

- **Source sheet(s):** `05-07/Wempe_05-07_11.jpg` (1943).
- **Material/stock:** Strip 05 07 03-1 (no sheet): **hardened and tempered spring-steel strip 0.8 × 0.08, UTS ≥ 2 000 N/mm²** (carbon spring steel or hardened stainless 1.4310), edges rounded and polished (T2, rev 2); hooks: Bandstahl 10×0.8 Din 1016.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Length | **730 ±3**, measured between the working points: the bight of fusee hook 05 07 03-2 to the barb of barrel hook 05 07 03-3 | T1 | 11; inf_fusee §2 |
| Strip section | **0.8 wide × 0.08 thick**. The crossed run bends each element one way on the fusee and the other way on the drum (reverse bending), once per wind/run cycle (≈2 × 10⁴ cycles in 50 years of daily winding). Worst fibre: **1 428 N/mm² peak** (878 bending on the r 9.34 small end + 552 tension), **alternating 635, mean 793**. **Goodman safety 1.22** (S_u 2 000, S_f 1 500 at 2 × 10⁴ cycles); static safety on tension 3.6. **OVERRIDDEN (rev 1: 0.22, read from the hook-slot width: 2 390 bending, Goodman 0.63, so it takes a set and cracks)** | T2 | closure.py |
| Joints | "hart gelötet" (hard-brazed) at both hooks. The strip end, backed by a **0.14 steel filler shim**, fills each hook's 0.22 +0.03 slot through the full 0.8 hook thickness. Braze with a silver brazing alloy and keep the heat local; the strip within 3 of the joint is soft and stays straight (it lies in the hook) | T1 (slot) / T4 (shim) | 11, 12, 13 |
| Orientation | The 0.08 thickness lies in the hook plane, and the 0.8 strip width runs along the hook thickness (axially on fusee and barrel) | T1 | res_barrel §1b |
| Riding radius | Fusee: groove root + **0.04**. Barrel: R 20.80 + 0.04 = **20.84** | T2 | — |
| Run | **Crossed (reverse fusee)**: from the fusee's SW side (tangent bearing 237.3° at full wind) to the drum's NE side, crossing the fusee–barrel line between them. Full-wind tangent points (11.6; 7.4) on the fusee and (−13.4; 23.6) on the drum | T1/T3 | §3.0; closure.py |
| Length budget at full wind | On fusee (t 0 → 8.761) 643.9; free span 29.9; remainder on barrel 56.2 ≈ 0.43 barrel turn | T1 | closure.py |
| Barrel turns used | **5.00** (sheet 20: "5"). 5.08 (chain) and 4.93 (open band) are **superseded** | T1 | closure.py |
| Free span | 18.8 (run-down) → 29.9 (full wind), crossed, C = 42.52 | T1 | closure.py |

- **Mates with:** Fusee hook slot and ⌀0.55 cross-pin (02-2); fusee groove (0.87 × 0.6); drum OD and barrel-end slot; stop-lever pad (last turn only, §3.5).
- **CAD notes:**
  - Model the strip as a swept 0.8 × 0.08 rectangle: along the r_band(t) helix (§3.4 table) from t = 0 to the current wind state, then the straight **crossed** tangent to the drum, then a ≈ 2 mm/turn spiral on the drum.
  - The crossed span passes 5.2 from the centre arbor at run-down (Z ≈ 7.1, above the Minutentrieb leaves at 5.8) and well clear of the lower balance cock at every state.
  - Cut the strip so that 730 ±3 results between working points after brazing (T4).

### Bandhaken rund (band hook, fusee end) — 05 07 03-2

- **Source sheet(s):** `05-07/Wempe_05-07_12.jpg` (10:1).
- **Material/stock:** Bandstahl 10×0.8 Din 1016; "nicht eingetr. Toleranz ±0,05"; "Kante brechen".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thickness | 0.8 −0.05 (0.75–0.80) | T1 | 12 |
| Throat (bight) | R0.4 (⌀0.8 seat on the fusee's ⌀0.55 cross-pin; radial play 0.12) | T1 | 12; res_barrel §1c |
| Beak tip | R0.4, located 1.25 / 0.5 from the throat centre | T1 | 12 |
| Outer back | R6 arc (dashed (R1.5) reference blend), belly 2.5 + 1 | T1 | 12 |
| Other drawn values | 1.7 −0.1 (?) (beak opening), 2.8 (throat to the lower construction point), 0.6, 1 (throat to the top of the slot), 1.4 (throat → band slot), 3.55, 30°, R7 lower blend, 5° slot inclination | T1 | 12 |
| Band slot | 0.22 +0.03 wide, through the full 0.8, inclined 5° in the hook plane | T1 | 12 |
| Working point | The throat (bight) | T1 | inf_fusee §2 |

- **Mates with:**
  - Fusee hook slot at A: 0.8 wide (0.75–0.85; clearance 0…0.05).
  - Cross-pin ⌀0.55 +0.01, 1 below the OD (r ≈ 16.8).
  - Band strip.
- **CAD notes:** Build the outline from the 10:1 sheet. The listed values fix the throat, tip and slot; the arcs between them are as drawn.

### Bandhaken f. Trommel (band hook, barrel end) — 05 07 03-3

- **Source sheet(s):** `05-07/Wempe_05-07_13.jpg` (10:1).
- **Material/stock:** Bandstahl 10×0.8 Din 1016; "nicht eingetr. Toleranz ±0,05"; "Kante brechen".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Thickness | 0.8 −0.05 | T1 | 13 |
| Height | 4.5 (barb line → top) + 2.5 (barb line → bottom) | T1 | 13 |
| Back | R10 and R20 arcs (construction centres 1.2 below the barb line) | T1 | 13 |
| Barb | 50° barb; projection 1.4 / 0.9 / "4" construction; R0.2 ×4 at the corners; 0.3 / 0.35 offsets of the barb line | T1 | 13 |
| Slot | 0.22 +0.03 at 10° in the hook plane; 2.8 and 1.0 locate it; R7 lower blend; R0.2 at the slot root | T1 | 13 |
| Working point | The barb | T1 | inf_fusee §2 |

- **Mates with:** Barrel-end band slot (oblique 2.5 at the OD, axial width ≈ 0.85); band strip.
- **CAD notes:** The hook plane is radial-tangential on the drum, and the hook thickness lies axially.

### Kette (fusee chain) — 05 07 04, **superseded alternative**

- **Source sheet(s):** `05-07/Wempe_05-07_14.jpg` (1941).
- **Material/stock:** Bandstahl 5×0.3 and 10×0.9; Präz. Rundstahl 0.6.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Status | **Superseded. Do not model.** Length 780 +3 (superseded), pitch [2.05], width [2 −0.03], thickness [0.82 ±0.02] | T1 (drawn) | 14; Resolved_Design |
| Why rejected | The 1948 groove (0.6 deep) holds only 30 % of the chain's 2.0 plate height. The chain hook (0.82–0.9) interferes in the 0.8 fusee slot | T1 | res_barrel §1c |

- **Mates with:** —
- **CAD notes:** —

---

### 3.4 Fusee

#### 3.4.1 Fusee axial stack (summary, fusee arbor down, e = 0.04)

| Item | Z from → to | Tier |
|---|---|---|
| Arbor lower tip (flush with the Trieb outer face) | −9.45 | T3 |
| Auf-u-Ab-Trieb z12 | −9.45 → −6.55 | T3 |
| Lower journal (⌀2.68) | −6.55 → 0 (in the lower plate −3.35 → 0) | T1/T4 |
| Vorreiber (pinned at 1.96) | 0.07 → 3.17 | T4 closure |
| Schneckenrad (great wheel): hub / teeth | 1.97 → 4.59 / 2.54 → 3.84 (spigot ⌀6.5 g6 to 5.86) | T1 thicknesses / T3 teeth |
| Gegenfeder | 3.44 → 4.79 | T1 / T4 |
| Gegensperrad plate (ring to 7.94) | 4.84 → 5.86 | T1 / T4 |
| **Schneckenkörper** large face → small face | **5.91 → 18.51** (recess floor 8.61 = collar start) | T1 closure |
| Schneckensperrad and the two Sperrkegel | 6.61 → 8.61 | T1 / T4 |
| Deckplatte | 18.51 → 19.31 | T1 |
| Stop nose (Stellungssteg) | 18.25 → 18.86 | T4 |
| J-K recess in the upper plate (⌀22) | 19.0 → 19.70 | T1/T3 |
| Schneckenfutter (in plate hole 10) | 19.65 → 26.75 | T1 |
| Staubplatte (square hole, on the square root) | 27.61 → 30.71 | T1 / T4 |
| Staubfutter (on the Futter boss) | 23.85 → 41.95 | T1 |
| Arbor upper tip (finished) | 45.91 | T1 |

Groove centreline in the movement: **Z = 5.91 + z_c** (fusee-local z_c from the table in §3.4.2). Add 0.04 in the up position.

### Schneckenkörper (fusee body) — 05 06 04-2

- **Source sheet(s):** `05-06/Wempe_05-06_02-2.jpg` (authoritative; N.gepr 20.4.43; change (a) 27.2.48). The older issue `05-06/Wempe_05-06_02-1.jpg` (127-556.04-060) is superseded. Profile plot: `05-06/Wempe_05-06_20.jpg`.
- **Material/stock:** Rundmessing 36 Din 1758 Ms 58; "nicht eingetr. Toleranz ±0,05".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outside ⌀ (large end) | 35.6 −0.1 (a) (was 36) | T1 | 02-2 |
| Length | **12.6 −0.1** (03-2 brackets a reference (12.3 −0.1); model 12.6) | T1 | 02-2; inf_fusee §1 |
| Large-end recess | ⌀26.3 +0.2 (a); recess floor → small face **9.9 −0.1** (a), so the recess is 2.7 deep. The revision text "8,9 −0,1 neu" is **not** used; the drawn 9.9 governs | T1/T3 | 02-2; Resolved_Design |
| Mouth chamfer | 45° (a) to ⌀29.8 +0.2 (a) | T1 | 02-2 |
| Bore | ⌀7 H7 +0.012 (press on the ⌀7.04 −0.01 arbor collar) | T1 | 02-2 |
| Small-end shoulder | ⌀21 −0.05, land 0.8 wide (z 11.8 → 12.6) | T1 | 02-2 |
| Small-end counterbore | ⌀15 × 1.6 +0.1 deep | T1 | 02-2 |
| Tapped holes | M2 from the recess floor, 6 +0.5 (a) deep; M1.7 from the counterbore floor, 6 deep; on "6r" / "5.75r", 120° spacing | T1 | 02-2 |
| Small holes | ⌀0.5 H7 +0.009; depths 1.1 +0.05 (a) and 1.5 +0.05 (a) | T1 | 02-2 |
| Root radii, one per turn (r_k at t = k, at point A) | t0 **17.25**, t1 **14.75**, t2 **13.32**, t3 **12.17**, t4 **11.24**, t5 **10.55**, t6 **10.07** (adopted; sheet 20 reads 10.04, ±0.03 covers both), t7 **9.71**, t8 **9.47**, t9 **9.30** (never cut; the ⌀21 shoulder is there) | T1 (drawn) / T3 (10.07 reading) | 02-2 "Grund"; inf_fusee §1, §3 |
| Root interpolation | PCHIP (monotone cubic) through (k, r_k). ±0.03 at the knots; ±0.05 between; **±0.2 for t ∈ [0; 1]** | T3 | inf_fusee §3 |
| Groove section | Rectangular, **0.87 +0.01 wide (axial) × 0.6 deep** (land = root + 0.6, "alle Maße: +0,6"). It is drawn at ≈ 1.15 depth, a copy of the 1941 1.2; the 0.6 dimension governs | T1 | 02-2; inf_fusee §3 |
| Land | 0.33 wide; first wall (hook slot → groove 1) 0.37 | T1 | 02-2 |
| Lead | **1.20 ±0.01 per turn**, constant | T1 | 02-2 "1,2 ±0,01" = 0.87 + 0.33 |
| First groove | Large face → large-side wall of groove 1 = 2 ±0.02; groove-1 centre z = 2.435 | T1 | 02-2 |
| Helix centreline | **z_c(t) = 1.235 + 1.200·t** (z from the large face) | T1 | inf_fusee §1 |
| Hand | **Left-hand** | T1/T2 | inf_fusee §3 |
| Groove end N | **t_N = 8.85** ("Gangende Punkt N"; the small-side wall is 0.3 from the small face, at z 12.3). φ_CAD(N) = 144°. r_root(N) ≈ 9.32 | T1 | 02-2; inf_fusee §1; res_fusee §3 |
| Full wind | **t = 8.761** (sheet 20 barrel tick "0", "¾ Umgang gespannt") = 56.3 h | T1/T3 | inf_fusee §1; closure.py |
| Band riding radius | **r_band = r_root + 0.04** (0.08 strip) | T2 | §3.3 |
| Hook slot at A (t = 0) | 0.8 wide (±0.05 general), centre z 1.235. Plunge-cut with a ⌀13.5 cutter, 2.9 +0.1 deep at A; floor r ≈ 15.2 (T3) / 14.9 (T1) | T1/T3 | 02-2; res_barrel §1c |
| Hook cross-pin | ⌀0.55 +0.01 across the slot, 1 below the OD (r ≈ 16.8) | T1/T3 | 02-2 |
| Pin hole A | 2 H8 +0.014, 1 from the OD edge (r ≈ 16.8–17.0); "4", "15" locate it. **Not the stop element** | T1/T3 | 02-2; Resolved_Design |
| Groove run-out | At N the groove exits through the ⌀21 shoulder (land 0.8, z 11.8 → 12.6) | T3 | inf_fusee §3 |

**Fusee-local frame.**
- z = 0 at the large face; +z toward the small end (toward the back).
- t = turns along the groove from the hook slot at A.
- θ = 360·t.
- **φ_CAD** is measured in the view from the small end (= from the back), CCW positive, with **90° = point A**: φ_CAD = 90° − 360°·t (mod 360). The groove advances clockwise seen from the back (left-hand helix).
- Parametrisation: x_f = r·cos φ, y_f = r·sin φ, z = z_c.

**Conversion to the plate frame.**
- **Rule (rev 2, crossed band).** A point fixed in the body at φ_CAD lies at plate bearing **α = φ_CAD + 61.29° − 360°·(8.761 − w)** (mod 360) about the fusee axis.
  - w is the current wind state in fusee turns: 8.761 at full wind, decreasing as the fusee runs CW from the back.
  - Plate coordinates: x = 16.708 + r·cos α, y = 15.292 + r·sin α.
  - Z = 5.91 + z_c.
- **Basis.** At wind state w, groove point t = w sits on the crossed band's tangent point, at plate bearing **237.33°** at full wind (root + 0.04). Over the last two turns the bearing moves by less than 0.5°. **OVERRIDDEN (rev 1: open band, 298.3°, offset 122.26°)**.
- **Full-wind pose (w = 8.761).** α = φ_CAD + 61.29°. This is the last column of the table below.
- **The 05-06_04 C-D view is not mapped to the plate in rev 2.** Its lever and Steg are a schematic of the stop principle; the rev-2 stop-work (§3.5) is placed by function and checked by closure.py.

#### 3.4.2 Groove-centreline table, 30° steps (copied in full from inf_fusee.md §3b; r_root uses 10.07)

- **Use r_band** (bold, = r_root + 0.04 for the 0.08 strip; rev 2) for the band path. The chain column of the source is omitted because the chain is superseded.
- α_plate is the plate bearing at full wind (w = 8.761), computed as φ_CAD + 61.29° (crossed band; rev 2).
- The last row (t 8.858) is copied verbatim from the source. The groove end that governs the phasing is **t_N = 8.85 (φ_CAD 144°)**.
| t [turn] | θ [deg from A] | φ_CAD [deg, view from back] | r_root | **r_band (+0.04), USE** | z_c [mm from large face] | α_plate at full wind [deg] |
|---|---|---|---|---|---|---|
| 0.000 | 0 | 90.0 | 17.250 | **17.290** | 1.235 | 151.3 |
| 0.083 | 30 | 60.0 | 17.000 | **17.040** | 1.335 | 121.3 |
| 0.167 | 60 | 30.0 | 16.756 | **16.796** | 1.435 | 91.3 |
| 0.250 | 90 | 0.0 | 16.518 | **16.558** | 1.535 | 61.3 |
| 0.333 | 120 | 330.0 | 16.287 | **16.327** | 1.635 | 31.3 |
| 0.417 | 150 | 300.0 | 16.064 | **16.104** | 1.735 | 1.3 |
| 0.500 | 180 | 270.0 | 15.848 | **15.888** | 1.835 | 331.3 |
| 0.583 | 210 | 240.0 | 15.641 | **15.681** | 1.935 | 301.3 |
| 0.667 | 240 | 210.0 | 15.443 | **15.483** | 2.035 | 271.3 |
| 0.750 | 270 | 180.0 | 15.254 | **15.294** | 2.135 | 241.3 |
| 0.833 | 300 | 150.0 | 15.076 | **15.116** | 2.235 | 211.3 |
| 0.917 | 330 | 120.0 | 14.907 | **14.947** | 2.335 | 181.3 |
| 1.000 | 360 | 90.0 | 14.750 | **14.790** | 2.435 | 151.3 |
| 1.083 | 390 | 60.0 | 14.603 | **14.643** | 2.535 | 121.3 |
| 1.167 | 420 | 30.0 | 14.463 | **14.503** | 2.635 | 91.3 |
| 1.250 | 450 | 0.0 | 14.330 | **14.370** | 2.735 | 61.3 |
| 1.333 | 480 | 330.0 | 14.204 | **14.244** | 2.835 | 31.3 |
| 1.417 | 510 | 300.0 | 14.083 | **14.123** | 2.935 | 1.3 |
| 1.500 | 540 | 270.0 | 13.967 | **14.007** | 3.035 | 331.3 |
| 1.583 | 570 | 240.0 | 13.854 | **13.894** | 3.135 | 301.3 |
| 1.667 | 600 | 210.0 | 13.745 | **13.785** | 3.235 | 271.3 |
| 1.750 | 630 | 180.0 | 13.637 | **13.677** | 3.335 | 241.3 |
| 1.833 | 660 | 150.0 | 13.531 | **13.571** | 3.435 | 211.3 |
| 1.917 | 690 | 120.0 | 13.426 | **13.466** | 3.535 | 181.3 |
| 2.000 | 720 | 90.0 | 13.320 | **13.360** | 3.635 | 151.3 |
| 2.083 | 750 | 60.0 | 13.215 | **13.255** | 3.735 | 121.3 |
| 2.167 | 780 | 30.0 | 13.111 | **13.151** | 3.835 | 91.3 |
| 2.250 | 810 | 0.0 | 13.009 | **13.049** | 3.935 | 61.3 |
| 2.333 | 840 | 330.0 | 12.909 | **12.949** | 4.035 | 31.3 |
| 2.417 | 870 | 300.0 | 12.811 | **12.851** | 4.135 | 1.3 |
| 2.500 | 900 | 270.0 | 12.714 | **12.754** | 4.235 | 331.3 |
| 2.583 | 930 | 240.0 | 12.619 | **12.659** | 4.335 | 301.3 |
| 2.667 | 960 | 210.0 | 12.526 | **12.566** | 4.435 | 271.3 |
| 2.750 | 990 | 180.0 | 12.435 | **12.475** | 4.535 | 241.3 |
| 2.833 | 1020 | 150.0 | 12.345 | **12.385** | 4.635 | 211.3 |
| 2.917 | 1050 | 120.0 | 12.257 | **12.297** | 4.735 | 181.3 |
| 3.000 | 1080 | 90.0 | 12.170 | **12.210** | 4.835 | 151.3 |
| 3.083 | 1110 | 60.0 | 12.085 | **12.125** | 4.935 | 121.3 |
| 3.167 | 1140 | 30.0 | 12.000 | **12.040** | 5.035 | 91.3 |
| 3.250 | 1170 | 0.0 | 11.917 | **11.957** | 5.135 | 61.3 |
| 3.333 | 1200 | 330.0 | 11.835 | **11.875** | 5.235 | 31.3 |
| 3.417 | 1230 | 300.0 | 11.755 | **11.795** | 5.335 | 1.3 |
| 3.500 | 1260 | 270.0 | 11.675 | **11.715** | 5.435 | 331.3 |
| 3.583 | 1290 | 240.0 | 11.598 | **11.638** | 5.535 | 301.3 |
| 3.667 | 1320 | 210.0 | 11.522 | **11.562** | 5.635 | 271.3 |
| 3.750 | 1350 | 180.0 | 11.449 | **11.489** | 5.735 | 241.3 |
| 3.833 | 1380 | 150.0 | 11.377 | **11.417** | 5.835 | 211.3 |
| 3.917 | 1410 | 120.0 | 11.307 | **11.347** | 5.935 | 181.3 |
| 4.000 | 1440 | 90.0 | 11.240 | **11.280** | 6.035 | 151.3 |
| 4.083 | 1470 | 60.0 | 11.175 | **11.215** | 6.135 | 121.3 |
| 4.167 | 1500 | 30.0 | 11.110 | **11.150** | 6.235 | 91.3 |
| 4.250 | 1530 | 0.0 | 11.047 | **11.087** | 6.335 | 61.3 |
| 4.333 | 1560 | 330.0 | 10.986 | **11.026** | 6.435 | 31.3 |
| 4.417 | 1590 | 300.0 | 10.925 | **10.965** | 6.535 | 1.3 |
| 4.500 | 1620 | 270.0 | 10.867 | **10.907** | 6.635 | 331.3 |
| 4.583 | 1650 | 240.0 | 10.810 | **10.850** | 6.735 | 301.3 |
| 4.667 | 1680 | 210.0 | 10.754 | **10.794** | 6.835 | 271.3 |
| 4.750 | 1710 | 180.0 | 10.700 | **10.740** | 6.935 | 241.3 |
| 4.833 | 1740 | 150.0 | 10.648 | **10.688** | 7.035 | 211.3 |
| 4.917 | 1770 | 120.0 | 10.598 | **10.638** | 7.135 | 181.3 |
| 5.000 | 1800 | 90.0 | 10.550 | **10.590** | 7.235 | 151.3 |
| 5.083 | 1830 | 60.0 | 10.504 | **10.544** | 7.335 | 121.3 |
| 5.167 | 1860 | 30.0 | 10.458 | **10.498** | 7.435 | 91.3 |
| 5.250 | 1890 | 0.0 | 10.415 | **10.455** | 7.535 | 61.3 |
| 5.333 | 1920 | 330.0 | 10.372 | **10.412** | 7.635 | 31.3 |
| 5.417 | 1950 | 300.0 | 10.331 | **10.371** | 7.735 | 1.3 |
| 5.500 | 1980 | 270.0 | 10.291 | **10.331** | 7.835 | 331.3 |
| 5.583 | 2010 | 240.0 | 10.252 | **10.292** | 7.935 | 301.3 |
| 5.667 | 2040 | 210.0 | 10.213 | **10.253** | 8.035 | 271.3 |
| 5.750 | 2070 | 180.0 | 10.176 | **10.216** | 8.135 | 241.3 |
| 5.833 | 2100 | 150.0 | 10.140 | **10.180** | 8.235 | 211.3 |
| 5.917 | 2130 | 120.0 | 10.105 | **10.145** | 8.335 | 181.3 |
| 6.000 | 2160 | 90.0 | 10.070 | **10.110** | 8.435 | 151.3 |
| 6.083 | 2190 | 60.0 | 10.036 | **10.076** | 8.535 | 121.3 |
| 6.167 | 2220 | 30.0 | 10.002 | **10.042** | 8.635 | 91.3 |
| 6.250 | 2250 | 0.0 | 9.969 | **10.009** | 8.735 | 61.3 |
| 6.333 | 2280 | 330.0 | 9.937 | **9.977** | 8.835 | 31.3 |
| 6.417 | 2310 | 300.0 | 9.905 | **9.945** | 8.935 | 1.3 |
| 6.500 | 2340 | 270.0 | 9.875 | **9.915** | 9.035 | 331.3 |
| 6.583 | 2370 | 240.0 | 9.845 | **9.885** | 9.135 | 301.3 |
| 6.667 | 2400 | 210.0 | 9.816 | **9.856** | 9.235 | 271.3 |
| 6.750 | 2430 | 180.0 | 9.787 | **9.827** | 9.335 | 241.3 |
| 6.833 | 2460 | 150.0 | 9.760 | **9.800** | 9.435 | 211.3 |
| 6.917 | 2490 | 120.0 | 9.735 | **9.775** | 9.535 | 181.3 |
| 7.000 | 2520 | 90.0 | 9.710 | **9.750** | 9.635 | 151.3 |
| 7.083 | 2550 | 60.0 | 9.686 | **9.726** | 9.735 | 121.3 |
| 7.167 | 2580 | 30.0 | 9.663 | **9.703** | 9.835 | 91.3 |
| 7.250 | 2610 | 0.0 | 9.641 | **9.681** | 9.935 | 61.3 |
| 7.333 | 2640 | 330.0 | 9.620 | **9.660** | 10.035 | 31.3 |
| 7.417 | 2670 | 300.0 | 9.599 | **9.639** | 10.135 | 1.3 |
| 7.500 | 2700 | 270.0 | 9.579 | **9.619** | 10.235 | 331.3 |
| 7.583 | 2730 | 240.0 | 9.559 | **9.599** | 10.335 | 301.3 |
| 7.667 | 2760 | 210.0 | 9.540 | **9.580** | 10.435 | 271.3 |
| 7.750 | 2790 | 180.0 | 9.522 | **9.562** | 10.535 | 241.3 |
| 7.833 | 2820 | 150.0 | 9.504 | **9.544** | 10.635 | 211.3 |
| 7.917 | 2850 | 120.0 | 9.487 | **9.527** | 10.735 | 181.3 |
| 8.000 | 2880 | 90.0 | 9.470 | **9.510** | 10.835 | 151.3 |
| 8.083 | 2910 | 60.0 | 9.454 | **9.494** | 10.935 | 121.3 |
| 8.167 | 2940 | 30.0 | 9.437 | **9.477** | 11.035 | 91.3 |
| 8.250 | 2970 | 0.0 | 9.422 | **9.462** | 11.135 | 61.3 |
| 8.333 | 3000 | 330.0 | 9.406 | **9.446** | 11.235 | 31.3 |
| 8.417 | 3030 | 300.0 | 9.392 | **9.432** | 11.335 | 1.3 |
| 8.500 | 3060 | 270.0 | 9.377 | **9.417** | 11.435 | 331.3 |
| 8.583 | 3090 | 240.0 | 9.363 | **9.403** | 11.535 | 301.3 |
| 8.667 | 3120 | 210.0 | 9.349 | **9.389** | 11.635 | 271.3 |
| 8.750 | 3150 | 180.0 | 9.336 | **9.376** | 11.735 | 241.3 |
| 8.833 | 3180 | 150.0 | 9.324 | **9.364** | 11.835 | 211.3 |
| 8.858 | 3189 | 141.1 | 9.320 | **9.360** | 11.865 | 202.4 |

Check on the table: at t = 8.761 (full wind), φ_CAD = 176.0° and α = 237.3°, which is the crossed-band tangent ✓.

- **Mates with:**
  - Arbor collar ⌀7.04 (press).
  - Band and fusee hook.
  - Schneckensperrad, in the large-end recess (pins on ⌀11.5, M2 on r6).
  - Stop nose (Stellungssteg) on the small face: M1.2 at r 9.5 tapped 2.0 deep, plus a ⌀0.6 pin (rev 2, §3.5).
  - Deckplatte (countersunk M1.7 at r 6 into one of the counterbore-floor M1.7 holes).
- **CAD notes:**
  - Sweep the 0.87 × 0.6 rectangular groove along z_c(t) with the root at r_root(t).
  - The large-side wall is the previous turn's land: height r_root(t − 1) − r_root(t) + 0.6.
  - From 0 to the slot at A, the first turn runs 17.25 → 14.75 (±0.2).

### Schnecke (fusee sub-assembly) — 05 06 04

- **Source sheet(s):** `05-06/Wempe_05-06_03-2.jpg` (Arbeitspause stamp 31 March 1948; change (a) 23.9.48(?); ≈ 55 % legible); superseded older issue `05-06/Wempe_05-06_03-1.jpg`; assembly context `05-06/Wempe_05-06_01.jpg` (Schnecke kompl.) and `05-06/Wempe_05-06_04.jpg` (Teilansicht, Schnitt A-B and C-D).
- **Material/stock:** Assembly.

| Feature | Value | Tier | Source |
|---|---|---|---|
| BOM | 1 Schneckenkörper 05 06 04-2; 2 Schneckenwelle 05 06 04-1; 3 Schneckensperrad 05 06 04-3; 4 WN-19 (not in set); 5 05 06 04-4 (not in set) | T1 | 03-2 |
| Body large face → 6.1/4.5 shoulder | **13.7 −0.1** (a) (was 13.6 +0.1(?)). This is the **body** dimension, not the superseded 13.7 square reading | T1 | 03-2 |
| Bracketed references | (12.3 −0.1), (1.6), (⌀35.6) | T1 | 03-2 |
| Other | ⌀33 +0.1 and 5° (new at (a)); pin ⌀0.5 s6 (+0.022 / +0.015); "Fläche muß schlagfrei zur Welle laufen" | T1 | 03-2 |
| Body on arbor | Large face Z **5.91**, small face 18.51 (= 19.61 − 13.7). Confirmed in rev 2: the recess floor (5.91 + 2.7 = 8.61) is the arbor collar start | T1 closure | res_fusee §2; closure.py |

- **Mates with:** Its components; Schneckenrad / Gegensperrad stack below; Deckplatte above.
- **CAD notes:** Treat this sheet as the authority for the body's axial position on the arbor.

### Schneckenwelle (fusee arbor) — 05 06 04-1

- **Source sheet(s):** Part `05-06/Wempe_05-06_15.jpg` (between centres, 60.6 −0.2); finished right end `05-06/Wempe_05-06_01.jpg` (18.3 −0.1); frame `05-08/Wempe_05-08_03a.jpg` (hole 10), `05-08/Wempe_05-08_08.jpg` (Schneckenfutter), `05-08/Wempe_05-08_09.jpg` (Staubfutter).
- **Material/stock:** Präz. Rundstahl 7.5 Din 175; "Toleranz ±0,1".

**Resolved segment table (arbor down; up = +0.04)**

| Feature | Value | Tier | Source |
|---|---|---|---|
| Lower tip (finished) | **Z −9.45**, flush with the Auf-u-Ab-Trieb outer face; 0.9 clear of the dial (−10.35) | T3 | res_fusee §2 |
| 1.6 pivot (1:70; "1,6 +0,1 +0,05"), finished | Z −9.45 → −6.55 (2.90). Press fit in the Auf-u-Ab-Trieb ("Festsitz"). **OVERRIDDEN (drawn: 15's left end ≈ 6.1 incl. the centre cone, between-centres blank)** | T3 | res_fusee §2; Resolved R1 |
| Lower journal | Z −6.55 → 0 (6.55; drawn "6,5 +0,1"). **Finished cylindrical ⌀2.68 f7 OVERRIDDEN (drawn: 2.7 → 2.8, 1:70; 2.8 ±0.02 at the shoulder)**. Runs in lower-plate hole 10, **⌀2.70 ±0.009 (unchanged)**. The arbor enters the hole from inside, so finish the whole 6.55 length at 2.68 | T4 (R2) | Resolved_Design; closure.py. Hole 2.83 is **superseded** |
| Lower shoulder | Bears on the lower-plate inner face, Z 0 | T3 | res_fusee §1 |
| Seat 4.38 → 4.5 (1:70) | Z 0 → **8.61**. **OVERRIDDEN (drawn chain: 8.7)** | T4 | res_fusee §2 override 1 |
| Vorreiber cross hole ⌀1.1 ("bohren + konisch reiben") | Axis at **Z 1.96**. **OVERRIDDEN (drawn chain: 2.0, from 19.7 − 17.7)**; 17.7 −0.05 is used at 17.65 | T4 | res_fusee §2 |
| Collar ⌀7.04 −0.01 | Z 8.61 → 16.51 (7.9) | T1 | 15 |
| Seat ⌀6.1 −0.05 | Z 16.51 → **19.61** (3.1 +0.05); its top 0.61 enters the J-K recess | T1 | 15; res_fusee §2 |
| Shoulder span (2.8/4.38 ↔ 6.1/4.5) | **19.61 OVERRIDDEN (drawn: 19.7 +0.05)**. 0.09 beyond the drawn tolerance, forced by the Schneckenfutter end at Z 19.65. Shop alternative: keep 19.7 and face the Futter to 7.01; that needs a J-K recess ≥ 0.8 deep | T4 | Resolved_Design; res_fusee §2 |
| Upper journal ⌀4.5 → 4.39 (1:70) | Z 19.61 → 27.61 (8). Runs in the Schneckenfutter (Z 19.65 → 26.75); fit "4,45 H7/g6" (01) | T1 | 15; 01 fit table |
| Staubplatte seat | "3,1□ r6 +0,023 +0,015": the root of the square itself, **3.1 across the flats**, Z 27.61 → 30.71. The Staubplatte has a matching square 1:100 hole | T1 | 15 (read at 4× magnification: the symbol is □, as at "2,92□") |
| Square 1:100 | **Across flats 3.10 at Z 27.61 → 2.92 at Z 44.6**; corners 4.38 → 4.13, milled from the ⌀4.39 journal end (it is the journal's own diameter). Staubplatte seat 3.1, flats for the key ≈ 13.9 (30.71 → 44.6), then a dome ≈ 1.3. **The drawn key socket "3,1□ +0,05" (05-01_9) fits this square at its root.** **OVERRIDDEN (rev 1: read as corners, i.e. 2.19 flats, which the key would not drive)** | T1 | 15; 05-01_9; closure.py |
| Upper tip (finished) | **Z 45.91** (−0.1) | T1 | 01 "18,3 −0,1" |
| Finished square, journal end → tip | **18.3 −0.1**. **OVERRIDDEN (drawn on 15 / 03-2: 20.3 between centres, incl. a 2.3 centre cone)**. 15.4 and 13.7 are **superseded** readings | T1 | 01; Resolved_Design |
| Finished overall | 55.36 (−9.45 → 45.91); between centres 60.6 −0.2 | T1/T3 | res_fusee §2 |
| End-shake | **0.04** (Futter end 19.65 − 19.61), allowed 0.02–0.05 | T1 closure | closure.py |

- **Mates with:**
  - Lower-plate hole 10.
  - Auf-u-Ab-Trieb.
  - Vorreiber and Vorreiberstift.
  - Schneckenrad / Gegenfeder / Gegensperrad stack.
  - Body (collar).
  - Deckplatte (⌀6.1 seat).
  - Schneckenfutter 05 08 01-2 (1:70 taper bore reamed to the journal; "4,1 +0,2" is the pre-bore).
  - Staubplatte (square hole, on the square root).
  - Staubfutter (square runs inside; the key tube passes its top bore and bottoms on the Staubplatte at 30.71).
  - Winding key.
- **CAD notes:** The 1.6 pivot never enters the plate. Its top is 3.2 below the plate's outer face, inside the Trieb.

### Schneckenrad (fusee great wheel) — 05 06 00-3

- **Source sheet(s):** `05-06/Wempe_05-06_07.jpg` (1940; N.gepr 30.4.43).
- **Material/stock:** Messingblech 5.5 Din 1751 Ms 58 federhart.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Teeth | "Zykloidenverzahnung", **z 90** | T1 | 07 |
| Tip ⌀ | D **40.57** "gewälzt" (blank 40.65 −0.05; handwritten "gedreht 41,1") | T1 | 07 |
| Pitch ⌀ | d **39.21** (sheet 20: 39.202) | T1 | 07 |
| Root ⌀ | dg **37.84** | T1 | 07 |
| Pitch / tooth thickness / module | t 1.368; ℓ 0.64; M 0.4356 | T1 | 07 |
| Flank form | Epicycloidal addendum fitted to D; generating circle = ½ the pinion pitch radius | T4 | Resolved_Design §4 |
| Body | ⌀33.8 −0.2; ⌀32.3 +0.05 (Gegenfeder recess); ⌀16.6 −0.2; ⌀17 +0.2; ⌀14 +0.1; ⌀4 +0.1; bore ⌀4.6 +0.1 | T1 | 07 |
| Thicknesses | 1.22 −0.04; 1.3 −0.1; 2.62 −0.04; 0.4 −0.05; 0.2 +0.02; 5 +0.2 (?); 45°, 60° | T1 | 07 |
| Gegenfeder pin hole | 1.2 H8 +0.014 at R14.2 −0.02 | T1 | 07 |
| Mesh | Minutentrieb z14 (d 6.098, M 0.4356); centre distance 22.65 (plate) = (39.21 + 6.098)/2 ✓ | T1 | closure.py |
| Z | Teeth 2.54 → 3.84 (mid 3.19), within the Minutentrieb leaves 1.8 → 5.8. Hub 1.97 → 4.59 (2.62); ⌀14 recess 1.97 → 3.19 (1.22); Gegenfeder recess 3.44 → 3.84 (0.4) | T3 (teeth) / T1 (thicknesses) / T4 (assignment) | inf_axial §2.3; §2.8.3 |
| Gegensperrad spigot (rev 2) | ⌀6.5 g6 on the hub top, 4.59 → 5.86, for the Gegensperrad's 6.5 H7 bore ("6,5 H7/g6" in the 05-06_01 fit table) | T4 | 05-06_01 |

- **Mates with:** Minutentrieb; Gegenfeder (pin at R14.2); Vorreiber (⌀14 d11 in ⌀14 +0.1); Gegensperrad (spigot); fusee arbor.
- **CAD notes:** The wheel turns freely on the Vorreiber and is driven through the Gegenfeder (maintaining spring).

### Staubplatte (dust plate) — 05 06 00-1

- **Source sheet(s):** `05-06/Wempe_05-06_05.jpg` (1941; N.gepr 30.4.43).
- **Material/stock:** Rundmessing 8 Din 1758 Ms58.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outside ⌀ | 7.6 −0.1 | T1 | 05 |
| Recess ⌀ | 6.2 +0.1 | T1 | 05 |
| Bore | **Square hole 3.1 across the flats, "Kegel 1:100", "H7 +0.012"** (the callout has no ⌀ sign), pressed on the 3.1□ r6 root of the fusee square | T1 | 05; 05-06_15 |
| Thicknesses | 3.1 −0.2 overall; hub 2.1 −0.2; 0.5 +0.2; 45° | T1 | 05 |
| Z | **27.61 → 30.71**, against the journal end | T1 / T4 | §2.8.3 |

- **Mates with:** Fusee square (3.1□ r6 root); Staubfutter 05 08 01-3 bore (≈⌀7.8 there; turns inside it as a dust seal).
- **CAD notes:** —

### Vorreiber (retaining collar) — 05 06 00-2

- **Source sheet(s):** `05-06/Wempe_05-06_06.jpg` (1941; N.gepr 30.4.43).
- **Material/stock:** Präz. Rundstahl 14 Din 175.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outside ⌀ | 14 d11 (−0.050 / −0.160) | T1 | 06 |
| Other ⌀ | 9.9 +0.2; 7.6 −0.2; (4.36) | T1 | 06 |
| Bore | 4.4 H7 +0.012, Kegel 1:70 | T1 | 06 |
| Cross hole | 1.1 +0.1 (Vorreiberstift) | T1 | 06 |
| Thicknesses | 3.1 −0.2 overall; 1.2 −0.2; 0.8; 0.4 +0.05; 0.3 +0.1; 45° | T1 | 06 |
| Condition | "bei Schneckenmontage Lochφ zur Welle passen Fläche a nachdrehen": fit the bore to the arbor at assembly, then re-turn face a | T1 | 06 |
| Z | **0.07 → 3.17**: ⌀7.6 hub 0.07 → 1.97 (Vorreiberstift at 1.96), ⌀14 d11 flange 1.97 → 3.17 (the drawn 1.2). Face a is re-turned at assembly to give the wheel stack 0.02–0.05 end-shake | T4 (closure) | §2.8.3; 06 |

- **Mates with:** Arbor 4.38 → 4.5 seat; Vorreiberstift (⌀1.1, cone-reamed); Schneckenrad (its ⌀14 +0.1 hub recess runs on the flange).
- **CAD notes:** The plain turned disc carries no stop element. Its flange overlaps the Minutenrad in plan; it clears its top (1.80) by 0.17.

### Deckplatte (cover plate) — 05 06 00-4

- **Source sheet(s):** `05-06/Wempe_05-06_08.jpg` (1941; N.gepr 30.4.43).
- **Material/stock:** Bandstahl 24×1 Din 1016.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outside ⌀ | 21 −0.1 (reads "21,1" (?)) | T1 | 08 |
| Bore | 6.1 H8 +0.018 | T1 | 08 |
| Holes | ⌀1.85 −0.1; ⌀3.1 +0.1; spacing 6 ±0.05 | T1 | 08 |
| Thicknesses | 0.8 −0.1 (plate); 0.4 −0.1 (relieved round the bore); 90° countersink on the ⌀1.85 hole (to ⌀3.1); 60°/45° bore chamfers | T1 | 08 |
| Fixing | Countersunk M1.7 through the ⌀1.85 hole at r 6 into one of the body's counterbore-floor M1.7 holes ("6r"), screw length 4.5 (it crosses the 1.6 cavity) | T1 (hole) / T4 (screw) | 08; 02-2 |
| Stop-nose notch (rev 2) | Radial notch 1.7 wide in the rim, from r 8.3 outward, for the stop nose (§3.5). Its phase on the plate follows the nose | T4 | §3.5 |
| Z | **18.51 → 19.31** on the body small face (19.35 dial up), 0.35 below the J-K floor. **OVERRIDDEN (rev 1: 18.61 → 19.61 "1 thick"; section T3 18.46 → 19.68)** | T1 (0.8) | 08; §2.8.3 |

- **Mates with:** Arbor ⌀6.1 seat; body small face and its ⌀15 counterbore (which it closes); stop nose; J-K recess (⌀22, 0.7 deep; clear).
- **CAD notes:** Steel; harden and temper blue like the other steel fusee parts.

### Gegenfeder (maintaining spring) — 05 06 01-1

- **Source sheet(s):** **Part sheet `05-06/Wempe_05-06_10.jpg` governs.** The kompl. sheet `05-06/Wempe_05-06_09.jpg` (127-556.04-U18) has variable width 1.8–3.5 and 1.4 thickness; it is not used for the part.
- **Material/stock:** Bandstahl 35×1.75 Din 1016; "härten in Öl, 310° blau anlassen"; a "400° anlassen" zone at the eye end; "nicht eingetr. Toleranz ±0,05".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | Open split ring | T1 | 10 |
| Outside ⌀ | 32.3 −0.1 | T1 | 10 |
| Width | **2, constant** | T1/T3 | 10; Resolved_Design |
| Thickness | **1.35 −0.1** | T1 | 10 |
| Holes | 2 × 1.2 H7 +0.009: one at R14.2 near the 65° end (6 from the end); one in the R1.8 eye at the other end | T1 | 10 |
| Other | 15.25, 4, 6, 0.8; 65°, 0° | T1 | 10 |
| Pins | 127-556.04-068 (no sheet); 09 shows ⌀1.25 / 1.2, lengths 1.3 / 2.5 | T1 (09) | 09 |
| Z | **3.44 → 4.79**: 0.40 sunk in the Schneckenrad's ⌀32.3 × 0.4 recess, 0.05 below the Gegensperrad. **OVERRIDDEN (section T3 3.84 → 5.08, which does not close)** | T1 (1.35, recess) / T4 | §2.8.3 |

- **Mates with:** Schneckenrad (pin at R14.2; ⌀32.3 +0.05 recess); Gegensperrad (pin hole 1.2 H8 at R14.2).
- **CAD notes:** —

### Gegensperrad (maintaining ratchet) — 05 06 02-1 (kompl. 05 06 02)

- **Source sheet(s):** `05-06/Wempe_05-06_12.jpg` (change (a) 11.3.48). Kompl.: `05-06/Wempe_05-06_11.jpg` (items -1, -2, -3, -4 (rivet/pin, no sheet), WN-21 screw; only 60° is dimensioned).
- **Material/stock:** Messingblech 3.5 Din 1751 Ms 58 federhart.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Teeth | **z 120** (a) | T1 | 12 |
| Tip ⌀ | 37.25 −0.1 (a) (was 37.5) | T1 | 12 |
| Tooth depth | "Zahntiefe = 0,7 +0,05". Root ⌀ **35.85** (35.65–35.85) | T1 | 12; inf_fusee §6 |
| Pitch | 3.000°, 0.975 at the tip | T1 | inf_fusee §6 |
| Face | Radial (0° undercut) | T4 | inf_fusee §6 |
| Back | Straight from the tip to the next root, ≈ 54° from radial | T2 | inf_fusee §6 |
| Tip / root | 0.03 tip flat; root radius 0.05 | T4 | inf_fusee §6 |
| Sense | The faces catch the Gegensperrkegel against rotation **CCW from the back** (= CW from the dial, during winding) | T2 | inf_fusee §6 |
| Body | Ring ⌀26.1(?) −0.2 outside / ⌀24.45 +0.1 inside, standing on the plate; recess 0.3 +0.15 (a) with a 45° edge | T1 | 12 |
| Bore | ⌀6.5 H7 +0.015, running on the Schneckenrad's ⌀6.5 g6 hub spigot (01 fit table: 6.5 H7/g6) | T1 / T4 (mate) | 12, 01 |
| Thicknesses | Rim plate 1.02 −0.02; 1.3 −0.1; 2.1; overall 3.1 −0.2 (plate + ring) | T1 | 12 |
| Holes | 2 × M1.7 on ⌀19.5 +0.05 (pitch-circle reading, consistent with the hole spacing scaled on 12); 1.2 H8 +0.014 at R14.2 (Gegenfeder pin); feature at 42° / 60° with 0.6 (?); 5° | T1/T3 | 12 |
| Z | **Plate 4.84 → 5.86; ring to 7.94**, inside the body's ⌀26.3 × 2.7 recess (0.1 radial clearance). **OVERRIDDEN (section T3 5.08 → 6.32, which overlaps the body face)** | T1 (thicknesses) / T4 | §2.8.3 |

- **Mates with:**
  - Gegenfeder.
  - Two Sperrkegel 05 06 02-3 with Sperrfeder 05 06 02-2, inside the ring, in the Schneckensperrad plane 6.61 → 8.61 (05-06_04 Schnitt A-B). Each click pivots on a riveted pin 05 06 02-4 (⌀1.19) with a spacer collar 5.86 → 6.61.
  - Gegensperrkegel 05 05 05-1 (blade 4.85 → 5.85).
- **CAD notes:** The stack closes (§2.8.3).

### Sperrfeder (click spring, ×2) — 05 06 02-2

- **Source sheet(s):** `05-06/Wempe_05-06_13.jpg` (1941; N.gepr 27.4.43).
- **Material/stock:** Bronzeband 1.5×0.4 federhart; "Toleranz ±0,1".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Section | 1.5 −0.1 wide × 0.4 −0.01 thick | T1 | 13 |
| Developed length | "gestreckt 27,0" | T1 | 13 |
| Form | Arcs R12.0 and R10.4; 13.6; 5; 5; 2.2 (?); 0.8 −0.05; 0.6 (?); angles 18°, 60°, 105°, 110° | T1 | 13 |
| Hole | ⌀0.6 +0.02 | T1 | 13 |

- **Mates with:** Gegensperrad; Sperrkegel 05 06 02-3.
- **CAD notes:** Two off, as shown on 05-06_04 Schnitt A-B.

### Sperrkegel (fusee click, ×2) — 05 06 02-3

- **Source sheet(s):** `05-06/Wempe_05-06_14.jpg` (10:1).
- **Material/stock:** Bandstahl 11×2 Din 1016; "härten 295° blau anlassen"; "Toleranz ±0,05".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Length | 10.05 −0.1 | T1 | 14 |
| Pivot bore | ⌀1.2 H7 +0.009 | T1 | 14 |
| Bosses | ⌀3, ⌀2.2, ⌀1.7 | T1 | 14 |
| Other | 5.2 −0.1; 5.2; 3.54 −0.01; 2.78 −0.001 (?); 1.82 −0.04; 2; R8; R3 (×2, one (?)); 85° (?); 45° | T1 | 14 |

- **Mates with:** Gegensperrad (pivot rivet 05 06 02-4, no sheet); Schneckensperrad teeth; Sperrfeder.
- **Z (rev 2):** 6.61 → 8.61 (2.0, Bandstahl 2 stock), in the Schneckensperrad plane, inside the Gegensperrad ring.
- **CAD notes:** Pivot pin ⌀1.19 riveted in the Gegensperrad plate, with a ⌀2.2 spacer collar 5.86 → 6.61 under each click (T4).

### Schneckensperrad (fusee click wheel) — 05 06 04-3

- **Source sheet(s):** `05-06/Wempe_05-06_16.jpg` (1947 title block).
- **Material/stock:** Ms Blech 2 mm DIN 17.51 Ms 58 federhart.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Teeth | **z 35**; pitch 10.286°, 1.436 at the tip | T1 | 16; inf_fusee §6 |
| Tip ⌀ | 16.0 −0.05 | T1 | 16 |
| Root ⌀ | 14.5 −0.2 (dashed circle); depth **0.75** | T1 | 16; inf_fusee §6 |
| Face | **Undercut 8°** from radial (hook tooth) | T1 | 16 |
| Back | Straight from the tip to the next root, ≈ 62° from radial. Alternative: tangent to the drawn "12,5" circle (T4) | T2 | inf_fusee §6 |
| Sense | Faces lead in the run-down sense (CCW seen from the dial = CW from the back). The body drives the two Sperrkegel on the Gegensperrad | T2 | inf_fusee §6 |
| Bore | 7.5 +0.05 | T1 | 16 |
| Thickness | 2 −0.1; edge 0.5 +0.2 × 45° | T1 | 16 |
| Fixing | 3 × ⌀2 +0.1, Kegel 1:8, at 120° on ⌀11.5 ±0.05; "Zulässiger Schlag der 3 Bohrungen 2φ zur Verzahnung 0,2 mm" | T1 | 16 |
| Z | **6.61 → 8.61**, flat on the floor of the body's large-end recess, in the plane of the Sperrkegel (05-06_04 Schnitt A-B shows them engaged) | T1 (2 thick, recess) / T4 | §2.8.3 |

- **Mates with:** Body (pins on ⌀11.5 = the "5.75r" holes); Sperrkegel ×2.
- **CAD notes:** inf_axial §2.3's "Schneckensperrad" at Z 16.84 → 18.32 is superseded.

### Gegensperrkegel (maintaining detent) — 05 05 05-1 (kompl. 05 05 05)

- **Source sheet(s):** `05-05/Wempe_05-05_12.jpg` (part, 1944). Kompl.: `05-05/Wempe_05-05_11.jpg`.
- **Material/stock:** Bandstahl 2.25 × 18 DIN 1016; "härten in Öl, 310° hell-blau anlassen"; "um die Bohrung 400° anlassen"; "nach dem Stanzen flachdrücken"; "Tol ±0,1".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Bore | 2.25 H7 +0.009, Kegel 1:70 | T1 | 05-05_12 |
| Thickness | 2 / 1 −0.03 | T1 | 05-05_12 |
| Outline | 14.2; 8.6; 5; 2.6; 80°; 150°; R18; R12 −0.1; R9; 9.645; 6.273 | T1 | 05-05_12 |
| Arbor 05 05 05-2 | No sheet. Kompl. gives "7,5" (before riveting, "vor dem aufschlagen") and **6.3 ±0.1, read as lower pivot tip → blade face**. Rev-2 design: a full-length steel arbor between the plates, body ⌀1.5. Lower pivot ⌀0.88 × 1.45 in Unterplatte hole 4 (tip Z −1.45, shoulder on the plate inner face at 0.00). Upper pivot ⌀0.88 × 1.45 in Oberplatte hole 4 (shoulder 18.97, tip 20.42). End-shake 0.03. The click is riveted on with its blade at 4.85 (= −1.45 + 6.3) | T1 (6.3, holes) / T4 | 05-05_11; 03a; 01a; closure.py |
| Pivot | Hole 4 at **(6.425; 36.437)**, "Körner, 0,9" in both the lower and the upper plate tables. 23.51 from the fusee axis | T1 | 03a, 01a |
| Nose | (17.56; 33.55), bearing 345.5° from hole 4. Nose radius 11.506 ("9,645 / 6,273" read as nose offsets) on the mid-tooth R18.275 | T3/T4 | inf_planview §2 (Clicks) |
| Z | **Blade 4.85 → 5.85** (1.0), in the Gegensperrad plate plane 4.84 → 5.86; boss 2.0, 4.35 → 6.35 | T1 (thickness) / T4 | §2.8.3 |

- **Mates with:** Gegensperrad teeth; Drahtfeder; plate holes 4 (both).
- **CAD notes:** The boss's 2.25 H7 1:70 bore is riveted on the arbor's matching taper ("vor dem aufschlagen 7,5").

### Drahtfeder (wire spring for the Gegensperrkegel) — none (no sheet)

- **Source sheet(s):** None. Screw hole on `05-08/Wempe_05-08_01a.jpg` (upper-plate table only). "Drahtfedermitte" marked on `05-06/Wempe_05-06_04.jpg` Schnitt A-B.
- **Material/stock:** Steel wire ⌀0.4 (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Fixing | Hole 5 at **(10.684; 38.507)**: "Körner, 1,3, M 1,7" in the upper plate. \|4 − 5\| = 4.735 | T1 | 01a table |
| Drahtfederstift (post, rev 2) | Steel post screwed into hole 5 from the inner face: M1.7 × 3.0 thread, ⌀2.4 × 0.5 collar on the plate face, ⌀1.2 shank down to **Z 4.60**, with a 0.45 cross slot at Z 5.6 for the wire's anchor end. "Drahtfedermitte" on 05-06_04 A-B marks this axis in the click plane | T1 (hole, A-B mark) / T4 | 01a; 05-06_04 |
| Form | ⌀0.4 steel wire, 2 turns coiled on the post at Z 5.0 → 5.8, anchor end in the post's slot, free leg ≈4.5 long pressing the Gegensperrkegel tail so the nose engages the Gegensperrad (preload ≈ 0.03 N at the nose) | T4 | Resolved_Design §4 |

- **Mates with:** Gegensperrkegel; post in hole 5.
- **CAD notes:** The post is 3.1 clear of the Schneckenrad tip circle (R20.29). The crossed band stays south of y 24 (from the fusee's SW side to the drum's NE side), ≥ 14 from the post.

### Auf-u-Ab-Trieb (up-and-down pinion) — none (no sheet)

- **Source sheet(s):** None. It is drawn in `05-06/Wempe_05-06_01.jpg` and the cross-section. Mesh data from `05-02/Wempe_05-02_11.jpg` (Auf u. Abrad z120, d 33.454).
- **Material/stock:** Steel pinion, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Leaves | **z 12** | T1 | c = 18.400 between plate holes 10 and 2 = (33.454 + 3.346)/2 |
| Pitch ⌀ / module | 3.346 / 0.2788 | T1 | Inferred_Values §3 |
| Tip ⌀ | ≈ 3.70 (0.64 m addendum, rounded leaf head) | T4 | Resolved_Design §4 convention |
| Flanks | Radial pinion flanks, rounded leaf head | T4 | Resolved_Design §4 |
| Length / Z | 2.90, Z −9.45 → −6.55 | T3 | res_fusee §2 |
| Bore | Pressed on the 1.6 (1:70) pivot, "Festsitz" (scaled bore 1.57) | T1/T3 | 01; res_fusee §1 |
| Mesh | Auf u. Abrad z120, Z −9.40 → −8.37 (raised 0.25 per Resolved_Design) | T1/T4 | Resolved_Design |
| Check | 56 h sweep = 313.6° against the drawn 315° dial | T1 | closure.py |

- **Mates with:** Fusee 1.6 pivot; Auf u. Abrad.
- **CAD notes:** Its outer face is flush with the arbor tip (Z −9.45).

---

### 3.5 Stop-work (rev 2: designed to work; no part sheets)

**Principle.** This is the English stop iron, adapted to a thin band and a reverse fusee. A steel bell-crank lever (Stellhebel) is pivoted under the upper plate and held out of action against the drawn banking pin (hole 7) by a light spring.

- On the last turn, the band rises up the fusee, and its upper edge cams a chamfered pad on the lever sideways.
- That swings the lever's beak inward into the path of a hardened stop nose (Stellungssteg) on the fusee small end. The nose strikes the beak at 8.761 turns.
- The mating stop faces are **inclined 27° from radial**, so the contact force passes 3.3 from the pivot on the engaging side. A hard turn of the key therefore presses the lever further **into** engagement, onto a second banking pin (B2), instead of forcing it out. The pivot and B2 carry the load, not the arm.
- On the previous turn (7.761) the beak is still out, 0.49 clear of the nose. The pad is not touched until 8.05 turns.

All numbers below are checked by `closure.py` (group `stop`). The 05-06_04 C-D view shows the same principle (lever, banking pin "Anschlagstift in Oberplatte", "Stegstellung"), but its scaled geometry cannot work (rev 1: no free axial plane for the beak, the bar crossed the Steg's path, and an open band was assumed). It is superseded as a geometry source.

**Wind-state rule** (crossed band): a body point at φ_CAD lies at plate bearing α = φ_CAD + 61.29° − 360°·(8.761 − w). The band's upper edge is at Z = 7.545 + 1.2·w.

### Stellungssteg (stop nose) — callout 05 06 03-1 (no sheet)

- **Source sheet(s):** none (callout on the cross-section). Rev-2 design.
- **Material/stock:** tool steel, hardened, tempered blue.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Plan | Block 1.5 wide (tangential), from r 8.4 to **r 11.60** (tip). Its **stop face** is the leading face in the winding sense (CCW from the back). It is a plane **inclined 27° from radial**: in the full-wind pose its outward normal points to plate bearing **25°**, matching the beak face (normal 205°) | T4 | closure.py |
| Section | Inside r 10.55: Z 18.51 → 18.86, sitting on the body small face in the Deckplatte's 1.7 notch. Outside r 10.55: Z **18.25 → 18.86**, hanging 0.26 below the small-face level, outside the body rim (r 10.5). The nose top (18.86, 18.90 dial up) is 0.10 below the plate inner face; its underside is 0.19 above the band's top edge (18.06) | T4 | closure.py |
| Fixing | M1.2 countersunk at r 9.5 into the body small face (tapped 2.0 deep), plus a ⌀0.6 steady pin at r 8.8. The nose also bears on the sides of the steel Deckplatte's notch. At a 500 N·mm over-wind (44.6 N at the nose) the combined bearing and shear stress is ≈ 30 N/mm² | T4 | closure.py |
| Phase | Stop face at **φ_CAD 78.71°** (body frame; groove end N is at 144°). At full wind (w = 8.761) it lies at plate bearing **140.0°**, on the beak face. Set the final phase at assembly with the fusee wound to 8.761 turns (§3.6 step 5) | T4 | closure.py |

### Stellhebel (stop iron) — no sheet

- **Source sheet(s):** none. Rev-2 design (placed by function, checked by closure.py).
- **Material/stock:** steel 0.75 thick, hardened, tempered blue; pad hardened steel, riveted.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Pivot | Shouldered screw at **S1 (−4.000; 20.000)** (Oberplatte table), shoulder ⌀1.5 h6 × 0.80. Lever bore 1.5 H7; hub ⌀3.0 | T4 | §2.2, §2.7 |
| Z | **18.20 → 18.95** dial down, **18.25 → 19.00** dial up (end-shake 0.05). It is 0.14 above the band's top edge at full wind | T4 | closure.py |
| Beak arm | Straight, from the hub toward the beak tip; pivot → beak tip **12.28**, direction 9.36° in the engaged pose. **2.2 wide at the hub, tapering to 1.5 wide at 6 from the pivot**, then 1.5 to the beak. The arm's **north edge lies 0.21 N of the pivot–beak-tip line** over its whole length (the extra width is on the south side). That edge banks on pin 7 at rest | T4 | closure.py |
| Beak | The arm's end. **Engaged: tip at (8.119; 22.003)**, r 10.90 from the fusee axis at bearing 142.0°. **At rest: (7.786; 23.458)**, r 12.09. Its stop face faces the oncoming nose (CW side), at bearing 140.0° in the engaged pose. It is **inclined 27° from radial**: the contact normal (the force on the beak) points to bearing 205°. Radial overlap with the nose 0.70; axial engagement ≥ 0.61 | T4 | closure.py |
| Self-locking | The contact force passes **3.3 from the pivot** on the engaging side (moment arm / beak arm 0.27). Over the whole friction band (μ 0.15) it stays between **0.12 and 0.41**: always engaging, never strongly loading the arm | T4 | closure.py |
| Engaged banking pin B2 | **⌀1.0 steel pin at (−3.045; 15.920)** in the upper plate (hole S3), projecting 0.7 (tip Z 18.30). It stops the pad arm in the fully engaged pose, so the lever cannot over-travel toward the fusee rim. At rest the pad arm is 0.49 clear of it | T4 | closure.py |
| Strength (500 N·mm over-wind at the key) | Nose force 44.6 N. Arm root moment ≤ 224 N·mm → 371 N/mm² at the 2.2-wide root and 408 at the 1.5 section 6 from the pivot (hardened, ≤ 600). Pivot shoulder shear 25 N/mm². B2 load 56 N → 200 N/mm² bending. All checked | T2 | closure.py |
| Pad arm | Second arm from the hub, 1.5 wide, ≈7.4 long toward bearing −52.7° from the pivot (rest pose). It carries the pad at its end and banks on B2 at 4.0 from the pivot | T4 | — |
| Pad | Hardened block 1.2 (along the band) × 1.6 (across), riveted under the pad arm, **Z 16.90 → 18.20**. It stands beside the full-wind band line on the side **away** from the fusee, 13.0 along the free span from the fusee tangent point. At rest its band-facing bottom corner is at **(0.513; 14.119)**, 0.35 from the band's centreline. That face is chamfered **45° × 1.2**, so the chamfer overhangs the band's path | T4 | closure.py |
| Action | The band's upper edge reaches the chamfer at **w = 8.05** and pushes the pad 0.85 (away from the fusee) by w = 8.761. The lever turns **6.97° CW** to engage, onto B2. At 56 h (8.711) the overlap is already 0.62 | T4 | closure.py |
| Rest / banking | The Stellfeder turns the lever **CCW** until the beak arm's north edge rests on pin 7 (hole 7, (5.676; 23.911), R14.000 from the fusee axis). Engaged, the arm is 1.27 clear of the pin | T1 (pin) / T4 | closure.py |
| Clearances | The arm stays outside r 11.9 of the fusee axis except the last 1.5 at the beak, and outside r 21.8 of the barrel axis. The pivot head (Z 17.85 → 18.20) is 0.86 clear of the band in plan; B2 is 7.7 clear of the nose sweep | T4 | closure.py |

- **Mates with:** S1 screw; pin 7 (rest); B2 (engaged); Stellfeder; band (pad, last turn only); stop nose.
- **CAD notes:** Model both poses (rest on pin 7, engaged on B2). The lever lies flat; only the pad hangs below it. Nothing else is cranked.

### Anschlagstift (banking pin) — 05 08 01-5, plate hole 7

- **Source sheet(s):** `05-08/Wempe_05-08_01a.jpg` (row 7). Assembly `05-08/Wempe_05-08_02.jpg` ("unten vorstehend").
- **Material/stock:** Steel pin, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Position | Hole 7 **(5.676; 23.911)**: "Körner, 1,45, 1,6 +0,009" | T1 | 01a |
| Radius from the fusee axis | **R14.000** (= C-D "14"); bearing 142.00° | T1 | inf_planview |
| Pin ⌀ | 1.6 (press in the 1.6 +0.009 hole) | T1/T2 | 01a |
| Projection | 0.7 below the upper plate, tip Z 18.30 ("unten vorstehend"). The lever banks on it over 18.30 → 18.95 | T1 / T4 | 05-08_02 |

- **Mates with:** Stellhebel beak-arm north edge.

### Stellfeder (stop-lever spring) — none (no sheet)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | Steel wire ⌀0.30, one coil under the head of an M1.0 screw at **S2 (3.000; 17.600)**, stopped from turning by a ⌀0.6 pin 1.0 W of the screw. A straight leg ≈5 long presses the beak arm's south edge northward (CCW about S1) | T4 | §2.2 |
| Force | ≈0.03 N at the arm (moment ≈0.15 N·mm about S1). The band overcomes it: its lateral stiffness at the pad is > 10 N/mm at 33 N tension | T2 | — |
| Z | 18.30 → 18.90 (in the lever's plane, above the band) | T4 | — |

### Superseded stop-work elements (do not model)

- Rev-1 Stellungssteg at r 6.95, φ_CAD 141°, in the body counterbore, under the Deckplatte.
- Rev-1 straight lever (6.02; 26.38) → (17.20; 2.83), its beak at R 6.3–6.8 and bearing 263°, and its 0.6 trim.
- Pivot candidate P1 (15.17; 5.93). Stop element at 35° from N; pin hole A.
- Rev-2 draft layouts with radial stop faces (pivot (−4.0; 23.0), beak at 186°; then pivot S1 with a 0.68 moment arm). The first could be forced out by the key; the second overstressed the arm at over-wind (1 320 N/mm²).

---

### 3.6 Power assembly and adjustment

1. **Barrel.**
   - Hook the mainspring inner eye on pin 05 07 02-2 and the outer end on the 45° M2.6 hook (7.85 above the floor).
   - Snap the cover into the drum's 5° undercut with a barrel-cover press, with notch 1 aligned over the floor slot. It comes out by levering at notch 2 (§3.2).
   - Fit the arbor between lower-plate hole 45 and bridge hole 45.
   - **Barrel end-shake 0.10** (22.35 − 22.25). Drum shake on the core: 0.05 +0.06.
2. **Fusee.**
   - Rivet the two Sperrkegel pivots (with spacer collars) and Sperrfeder on the Gegensperrad. Stack the Schneckenrad (on the Vorreiber), the Gegenfeder (pinned to both at R14.2) and the Gegensperrad (on the wheel's ⌀6.5 spigot).
   - Press the body on the collar with its large face at Z 5.91, the Schneckensperrad pinned on its recess floor, so the clicks engage it.
   - Fit the Vorreiber and its Vorreiberstift (Z 1.96); re-turn face a for 0.02–0.05 stack end-shake.
   - Fit the Deckplatte (countersunk M1.7 at r 6) and the stop nose (M1.2, pin) in its notch.
   - Press the Auf-u-Ab-Trieb on the 1.6 pivot (outer face at Z −9.45).
   - **Fusee end-shake 0.04** (Schneckenfutter end 19.65 − shoulder 19.61; allowed 0.02–0.05). It is 0.04–0.05 over the fitted plate gap; face the Futter spigot only if needed (§2.9, "Fitting the plate gap and the end-shakes").
3. **Band hooking** (fusee run down, w = 0).
   - Seat the throat of Bandhaken rund 05 07 03-2 on the ⌀0.55 cross-pin in the 0.8 slot at A (t = 0, large end).
   - Lead the band **crossed**: from the fusee's SW side, across the fusee–barrel line, to the drum's NE side.
   - Hook 05 07 03-3 into the barrel's oblique 2.5 slot. Cut that slot now, at fusee assembly, at Z ≈ 17.7.
   - Wrap the band onto the drum by turning the **drum CCW from the back** (its running sense), ≈ 5.4 turns at ≈ 2 mm lay per turn. Hold the arbor still while you do it; the click permits this.
4. **Mainspring set-up (ratchet clicks).**
   - With the fusee run down and the band taut, turn the barrel arbor **CCW from the back** by **¾ turn = 12 clicks** of the z16 Sperrad (22.5° per click). This is the drawn set-up on 05-06_20, "¾ Umgang gespannt".
   - The click 05 08 05-2 then holds the arbor against **CW**.
   - closure.py checks the turn budget: 5.92 usable turns against 5.00 needed.
   - Torque: measure the fusee output with a torque key on the square at w = 0, 4.4, 5.0 and 8.76.
     - Target 354 / ≈320 / 318 / 332 N·mm ±5 %.
     - The daily-window ratio T(8.76) / T(5.0) must lie between **1.00 and 1.06** (design 1.042). This is the top 24 h of a daily-wound instrument, and the limit keeps its torque spread to ±2.8 % or less (rev 2.1).
   - Tune the set-up by ±1 click (±1/16 turn) only if the spring is off its acceptance curve. The fusee's own spread (±5.4 % over the run, ±2.1 % over the top 24 h) is fixed by the drawn groove.
5. **Stop-work phasing.**
   - Fit the stop lever on S1, the Stellfeder at S2 and the banking pins 7 and B2. Check that the lever rests on pin 7 and the beak sits at r 12.09.
   - Wind the fusee CCW from the back to **w = 8.761** turns (56.3 h). Watch the band cam the pad from w ≈ 8.05; the lever reaches B2 and the beak reaches r 10.90.
   - Rotate the nose on the fusee small end (at assembly, before final tightening of its M1.2) until its inclined stop face bears flat on the beak face. Then drill the nose's steady pin.
   - Check:
     - on a full let-down and re-wind, the nose passes the retracted beak at 7.761 turns (0.49 clear) and stops at 8.761 (window 8.711 … 8.85, groove end N);
     - a firm extra turn of the key presses the lever onto B2 and does not move the beak outward.
6. **Maintaining power.**
   - During winding (fusee CCW from the back), the Gegensperrkegel at hole 4 (Drahtfeder on the post at hole 5) holds the Gegensperrad.
   - The Gegenfeder keeps driving the Schneckenrad.
   - When running, the Schneckensperrad (8° undercut faces) drives the Gegensperrad through the two Sperrkegel.

---

### 3.7 Points that were open in this section: all closed in rev 2

1. **Core ⌀ vs length:** ⌀13.3 × 11.7.
2. **Schneckenkörper axial position:** large face 5.91; it closes with the recess floor = collar start (§2.8.3).
3. **Schneckensperrad Z:** 6.61 → 8.61, on the recess floor at the large end.
4. **Lever pin trim:** superseded with the rev-1 lever; the new lever banks on pin 7 (rest) and B2 (engaged) by design.
5. **Stop-lever Z:** 18.20 → 18.95 (§3.5).
6. **Gegensperrkegel arbor:** full-length arbor in both holes 4; "6,3" = pivot tip → blade (§3.4).
7. **Sperrad part number:** 05 07 00-3.
8. **Plate-frame conversion:** α = φ_CAD + 61.29° − 360°(8.761 − w), crossed band. The C-D +25.39° mapping is superseded.
9. **Gegensperrad holes:** "19,5 +0,05" is the M1.7 pitch circle. "26,1" is the ring's outside ⌀.
10. **Steg vs beak radius:** superseded; nose to r 11.60 against a beak at r 10.90 (0.70 overlap).
11. **Band path and drum sense (new in rev 2):** crossed; drum CCW (§3.0).

---

## 4. Going train, motion work, hands and dial

Baugruppen 05 05 (Laufwerk) and 05 02 (Zeigerwerk, Auf u. Ab). The Gegensperrkegel 05 05 05 is covered in the power section and is not repeated here.

### 4.0 Conventions used in this section

- **Units:** mm, degrees.
- **Decimals:** every value is written with a decimal POINT. Drawing text quoted verbatim in quotes keeps its commas (e.g. "Laufsitz auf Anrichtstift", "24,1 -0,1").
- **Plan frame:** x = O(+)/W(−), y = N(+)/S(−). The origin is the Minutenrad axis (plate hole 1). The frame is **viewed from the BACK** (from the Oberplatte side). Angles are CCW from +x, viewed from the back.
- **Z:** Z = 0 at the lower-plate (Unterplatte) inner face, + toward the upper plate. The dial side is negative. The frame is: lower plate −3.35 → 0; upper plate 19.0 → 22.35; Zwischenbrücke −3.35 → −7.35 (dial side of the lower plate).
- **Dial angles:** θ is measured CW from 12 o'clock **viewed from the dial (front)**. 12 o'clock is +y (N): the Auf-u-Ab subdial is at N and the seconds subdial at S. Plan angle φ = 90° + θ (so 3 o'clock is −x = W).
- **Tiers:**

  | Tier | Meaning |
  |---|---|
  | T1 | Drawn, or closes exactly from drawn values |
  | T2 | Engineering rule |
  | T3 | Scaled from a drawing |
  | T4 | Convention or fitted value |

- **Override marking:** a value that replaces a drawn value is marked **OVERRIDDEN (drawn: x)**.
- **Superseded values:** these must NOT be modelled. They are mentioned only where a sheet still shows them.
  - back pivots 5.1 / 4.6 / 4.5;
  - the 9.2 seconds-arbor extension;
  - the 1940/43 pivot diameters 0.73 / 0.8 / 0.82 on the kompl. sheets. ⌀0.82 is superseded only as the 1940/43 Zwischentrieb pivot (05-05_05). It is the adopted 1946/48 Sekundentrieb back pivot.
- **Gear symbols** (as printed on the sheets):
  - z = teeth or leaves;
  - D = tip (outside) diameter;
  - d = pitch diameter;
  - dg = root diameter;
  - t = circular pitch;
  - l (also printed f or ℓ) = a tooth dimension printed without definition (see 4.1);
  - M = module.
- **Sources:**
  - Wheel and pinion data are verbatim from `_audit/audit_train.md`.
  - Z values are from `_inferred/inf_axial.md`.
  - Plan positions are from the 05-08_03a / 01a coordinate tables.
  - Decisions are from `Resolved_Design.md`.

#### Arbor positions and rotation senses (while the movement runs)

| Arbor | Plate hole | (x; y) | Sense viewed from the back | Sense viewed from the dial | Tier |
|---|---|---|---|---|---|
| Schnecke (fusee) | 10 | (16.708; 15.292) | CW | CCW | T1 |
| Minutenrad / Minutentrieb / Viertelrohr | 1 | (0; 0) | **CCW** | CW (minute hand) | T1 |
| Zwischenrad / Zwischentrieb | 38 | (−9.910; −15.170) | CW | CCW | T1 |
| Sekundenrad / Sekundentrieb | 35 | (0; −23.0) | CCW | CW (seconds hand) | T1 |
| Gangrad / Gangtrieb | 26 | (11.783; −21.743) | CW | CCW | T1 |
| Wechselrad / Wechseltrieb | 19 (lower plate only) | (10.912; −6.30) | CW | CCW | T1 |
| Stundenrad / Stundenrohr | 1 | (0; 0) | CCW | CW (hour hand) | T1 |
| Zeigerstelltrieb (only if hand-setting is fitted) | 18 (lower plate only) | (22.136; −12.780) | CCW (idles, driven by the Wechselrad) | CW | T1 |
| Auf u. Abrad | 2 (lower plate only) | (0; 23.0) | CCW | CW (reserve hand moves 0 → 56 as the movement runs down) | T1 |

Each external mesh reverses the sense. The fusee's sense follows from the Minutenrad sense through the Schneckenrad z90 / Minutentrieb z14 mesh. During winding the fusee and the Auf u. Abrad reverse; the train keeps its sense through the maintaining work.

---

### 4.1 Cycloidal tooth-form convention for CAD (T4, applies to every wheel and pinion in this section)

The sheets say only "Zykloidenverzahnung". They give z, D, d, dg, t and l (or f) for the wheels, and nothing for most pinions. The tooth extents below are T1 where drawn. The flank shape is T4.

| Item | Rule |
|---|---|
| Pitch circle | d as drawn (wheels), or as inferred from the centre distance (pinions); see each part |
| Generating circle | Generating circle = ½ the **mating pinion's** pitch radius (its radius; so its diameter = the pinion pitch radius). This is what makes the pinion flanks radial |
| Wheel tooth addendum | Epicycloid, generated by rolling that circle on the wheel pitch circle. Truncate at the drawn D (the addendum height is fitted to D); round the tip tangent to D |
| Wheel dedendum | Radial straight flanks from the pitch circle down to dg; root fillet r = 0.1 × t |
| Pinion leaf flanks | Radial (straight, through the pinion axis) from the pitch circle to the root |
| Pinion leaf head | Semicircular (rounded leaf) on the leaf thickness; pinion OD as listed per part |
| Pinion OD, where no D is drawn | OD = d + 1.28 M (addendum 0.64 M; the Resolved escape-pinion value, "normal for a rounded-leaf cycloidal pinion") |
| Pinion root, where no dg is drawn | dg = d − 4.26 M (dedendum 2.13 M, as drawn on the Minutentrieb z14: (6.098 − 4.24) / 2 = 0.929 = 2.13 × 0.4356) |
| Wheel tooth thickness on the pitch circle | = l as printed. The meaning of l is not stated on any sheet; numerically l ≈ 0.46 t on every wheel. Exception: Wechselrad, where the handwritten "Zahnstärke 0,55-0,56" governs |
| Pinion leaf thickness on the pitch circle | 0.40 t |
| Backlash | Results from the rules above (about 0.14 t). Do not tighten |

Root clearances that result from these rules, at the plate-table centre distances (all positive):
- Zwischentrieb root to Minutenrad tip: 0.19.
- Sekundentrieb root to Zwischenrad tip: 0.16.
- Viertelrohr root to Wechselrad tip: 0.32.
- Wechseltrieb root to Stundenrad tip: 0.35.
- Zeigerstelltrieb root to Wechselrad tip: 0.32.
- Fusee pinion root to Auf u. Abrad tip: 0.16.

---

### 4.2 Going train (Laufwerk 05 05)

### Minutenrad (centre wheel) — 05 05 03-1

- **Source sheet(s):**
  - `05-05/Wempe_05-05_09.jpg` (part);
  - `05-05/Wempe_05-05_08.jpg` (Minutenrad kompl. 05 05 03);
  - `05-05/Wempe_05-05_01.jpg` (Laufwerk section).
- **Material/stock:** "Messingblech 1,5 Din 1751 Ms 58 federhart" (brass sheet 1.5, spring-hard).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Teeth z | 90 | T1 | 05-05_09 |
| D (tip) | 33.10 | T1 | 05-05_09 |
| d (pitch) | 31.976 | T1 | 05-05_09 |
| dg (root) | 30.86 | T1 | 05-05_09 |
| t | 1.116 | T1 | 05-05_09 |
| l | 0.52 | T1 | 05-05_09 |
| M | 0.355 | T1 | 05-05_09 (d/z = 0.35529) |
| Blank (turned) | ⌀33.8 −0.2 | T1 | 05-05_09 |
| Wheel thickness ("Radstärke") | 1.3 −0.1 | T1 | 05-05_09 |
| Bore | ⌀5.4 H7 (+0.012) | T1 | 05-05_09 |
| Boss | ⌀10.6 −0.2 | T1 | 05-05_09 |
| Rim inner | ⌀28.1 +0.2 | T1 | 05-05_09 |
| Crossings | 5 straight radial spokes, 72° pitch, width 1.7 −0.2, square corners | T1 | 05-05_09 |
| General tolerance | ±0.01 ("nicht eingetr. Toleranz ±0,01") | T1 | 05-05_09 |
| Z (wheel faces) | 0.5 → 1.8 (between the plates) | T1 | inf_axial §2.4 (19.0 − 17.2) |
| Plan position | (0; 0), hole 1 | T1 | 05-08_03a |
| Rotation | CCW from the back, 1 rev/h | T1 | — |

- **Mates with:**
  - Minutentrieb seat ⌀5.4 n6, riveted.
  - Meshes the Zwischentrieb z12 at c = 18.120.
- **CAD notes:**
  - Phase one spoke on +y (as drawn; arbitrary, T4).
  - The 33.10 tip circle clears the Zwischenbrücke because the bridge is on the dial side of the lower plate (different Z).

### Minutentrieb (centre pinion and arbor) — 05 05 03-2

- **Source sheet(s):**
  - `05-05/Wempe_05-05_10.jpg` (part and Halbzeug Hz 05 05 03-2);
  - `05-05/Wempe_05-05_08.jpg` (kompl.).
- **Material/stock:** "Präz. Rundstahl 7,2 Din 175" (precision round steel ⌀7.2); "härten, 295° anlassen" (harden, temper at 295 °C).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Leaves z | 14 | T1 | 05-05_10 |
| D (tip) | not drawn ("D =" blank); use the Halbzeug leaf blank ⌀6.79 −0.02 | T1 (blank) | 05-05_10 |
| d | 6.098 | T1 | 05-05_10 |
| dg | 4.24 | T1 | 05-05_10 |
| t | 1.368 | T1 | 05-05_10 |
| M | 0.4356 | T1 | 05-05_10 |
| Leaf length | 4 −0.1, Z 1.8 → 5.8 | T1 | 05-05_10; inf_axial |
| Back pivot | ⌀1.2, finished length **3.0**, tip Z 22.0, Kegel 1:90 point **OVERRIDDEN (drawn: 5.1 −0.2, superseded)** | T1 dia / R1 length | 05-05_10; Resolved R1 |
| Back shoulder | Z 19.0 (bears on the upper-plate bushing face) | T1 | inf_axial |
| Arbor (back shoulder → pinion) | ⌀2.5, Z 19.0 → 5.8 | T1 | 05-05_10 |
| Back shoulder → wheel back face | 17.2 +0.05 (Z 1.8) | T1 | 05-05_10 |
| Wheel seat | ⌀5.4 n6, length 1.6 −0.1 (Z 1.8 → 0.2), boxed (= specially inspected) | T1 | 05-05_10 |
| Back shoulder → front bearing shoulder | boxed "(19 +0,05)", Z 0.0 | T1 | 05-05_10; inf_axial |
| Front zone Z 0.0 → −4.0 | ⌀3.6 shoulder collar at Z 0.0, then ⌀2.2 e8 (−0.014/−0.028) journal in the lower-plate bushing (hole 1); "Kegel 1:90" is also printed in this zone (reading partly uncertain) | T1 dia / T3 assignment | 05-05_10; 05-05_08 |
| Back shoulder → start of the 1:80 cone | 23 +0.05 (Z −4.0), cone ⌀1.8 there (boxed) | T1 | 05-05_10 |
| Front cone | "Kegel 1:80", drawn 16.7 −0.1 long to a ⌀1.65 point | T1 | 05-05_10 |
| Front tip, finished | **cut flush with the Viertelrohr front end, Z −18.23 OVERRIDDEN (drawn: tip at Z −20.65 from 39.65 −0.1 overall)**; finished tip ⌀ ≈ 1.67 (linear between the drawn ⌀1.8 and ⌀1.65) | R1 / T4 dia | Resolved_Design |
| Overall, finished | 22.0 − (−18.23) = 40.23 tip to tip | T1 (from the above) | — |
| Shoulder chamfer | 30° | T1 | 05-05_10 |
| Halbzeug | leaves ⌀6.79 −0.02 × 6.3; ⌀5.8 −0.2 × 1.5 +0.2; ⌀3.8 −0.2 (×2); 20.5 +0.1; 44.4 −0.2 overall; 60° centres | T1 | 05-05_10 |

- **Mates with:**
  - Minutenrad (riveted on the ⌀5.4 n6 seat).
  - Schneckenrad z90 (d 39.21) at c = 22.650; the Schneckenrad plane Z 2.54–3.84 lies inside the leaves (1.8–5.8).
  - Upper-plate bushing at hole 1 (⌀4.59 bore), with the back pivot.
  - Lower-plate bushing at hole 1, with the ⌀2.2 e8 journal.
  - Viertelrohr (friction fit on the front cone).
- **CAD notes:**
  - Model the arbor as a revolve of the stations above.
  - The "10ø" body drawn under the wheel on 05-05_08 does not reconcile with 05-05_10; ignore it.
  - Rotation: CCW from the back.

### Zwischenrad (third wheel) — 05 05 02-1

- **Source sheet(s):**
  - `05-05/Wempe_05-05_06.jpg` (part);
  - `05-05/Wempe_05-05_05.jpg` (kompl. 05 05 02);
  - `05-05/Wempe_05-05_01.jpg`.
- **Material/stock:** "Messingblech 1,2 Din 1751 Ms 58 federhart".

| Feature | Value | Tier | Source |
|---|---|---|---|
| z | 80 | T1 | 05-05_06 |
| D | 23.33 | T1 | 05-05_06 |
| d | 22.453 | T1 | 05-05_06 |
| dg | 21.57 | T1 | 05-05_06 |
| t | 0.882 | T1 | 05-05_06 |
| l | 0.40 | T1 | 05-05_06 |
| M | 0.280 | T1 | 05-05_06 |
| Blank | ⌀24 −0.2 | T1 | 05-05_06 |
| Thickness | 1.0 −0.1 | T1 | 05-05_06 |
| Bore | ⌀4 H7 (+0.012) | T1 | 05-05_06 |
| Boss | ⌀7.5 −0.2 (reading "(?)") | T1 | 05-05_06 |
| Rim inner | ⌀19.3 +0.2 | T1 | 05-05_06 |
| Crossings | 5 radial spokes, 72°, width 1.3 −0.2 | T1 | 05-05_06 |
| Riveting | "7ø vernietet" | T1 | 05-05_05 |
| General tolerance | ±0.01 | T1 | 05-05_06 |
| Z | −1.25 → −0.25, inside the lower plate | T1 | inf_axial §2.5 (19.0 − 19.25) |
| Plan position | (−9.910; −15.170), hole 38 | T1 | 05-08_03a |

- **Mates with:**
  - Zwischentrieb seat ⌀4.0 n6.
  - Meshes the Sekundentrieb z10 at c = 12.630.
  - Runs in the lower-plate pocket ⌀24.5 about hole 38 ("vor dem kalibrieren auf 24,5 fräsen"), radial clearance (24.5 − 23.33) / 2 = 0.585.
- **CAD notes:**
  - ⌀24.5 (05-05_01) is the **plate pocket, not the wheel** (R4). The pocket is a through-cut, closed on the dial side by the Zwischenbrücke.
  - Rotation: CW from the back.

### Zwischentrieb (third pinion and arbor) — 05 05 02-2

- **Source sheet(s):**
  - `05-05/Wempe_05-05_07.jpg` (part, 6.6.46);
  - `05-05/Wempe_05-05_05.jpg` (kompl., 1940/43, for the superseded pivots only).
- **Material/stock:** "Präz. Rundstahl 5,2 Din 175".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Leaves z | **12** (inferred: (2 × 18.120 − 31.976) / 0.355 = 12.00) | T1 | audit_train §2.2; Inferred_Values §3 |
| d | 4.264 | T1 | same |
| M | 0.355 (= the Minutenrad's) | T1 | — |
| t | 1.115 (π M) | T1 | — |
| OD | 4.718 (d + 1.28 M) | T4 | §4.1 |
| dg | 2.752 (d − 4.26 M) | T4 | §4.1 |
| Leaf length (pinion, not a pivot) | 4.6 −0.2 (reading uncertain), Z −0.25 → 4.35 | T1 | 05-05_07; inf_axial |
| Shoulder to shoulder | 23.05 −0.1 | T1 | 05-05_07 (agrees with 05-05_05) |
| Back shoulder → wheel face | 19.25 −0.1 | T1 | 05-05_07 (05-05_01 "19,2") |
| Wheel seat | ⌀4.0 n6 (+0.016/+0.008), 1.3 −0.1 long, Z −0.25 → −1.55 | T1 | 05-05_07 |
| Arbor | ⌀2 −0.1 (back part and the short front collar) | T1 | 05-05_07 |
| Pivot ⌀ (both) | 0.85 −0.05 **(1940/43 0.82 superseded)** | T1 / R1 | 05-05_07 |
| Back pivot length | **3.0, tip Z 22.0 OVERRIDDEN (drawn: 4.6 −0.2, superseded)** | R1 | Resolved_Design |
| Front shoulder | Z −4.05; bushing face −4.07 (end-shake 0.02, §2.4; bush pressed to suit the fitted plate gap, §2.9) | T1 | inf_axial §2.1; 05-08_10 |
| Front pivot length | **3.0, tip Z −7.05 OVERRIDDEN (drawn: 4.6 −0.2, superseded)**. It ends in the Zwischenbrücke bushing, 0.30 inside the bridge outer face (−7.35). 3.0 equals the 1940/43 kompl. "3 -0,1" | T4 (fitted, R1) | Resolved R1 ("≤ the 4 bridge") |
| Pivot ends | "Kegel 1:90" points; turn off when the pivots are cut to length | T1 | 05-05_07 |
| Shoulder chamfer | 30° | T1 | 05-05_07 |

- **Mates with:**
  - Minutenrad (Z 0.5–1.8 lies inside the leaves −0.25–4.35).
  - Zwischenrad (riveted).
  - Upper-plate bearing at hole 38.
  - Zwischenbrücke bushing WN-300 at hole 38, seat 4.59 +0.012 (§2.4, §7 #13; the drawn circle measures ⌀4.94, T3).
- **CAD notes:**
  - Stock ⌀5.2 > OD 4.718.
  - Rotation: CW from the back.

### Sekundenrad (fourth wheel) — 05 05 01-1

- **Source sheet(s):**
  - `05-05/Wempe_05-05_03.jpg` (part);
  - `05-05/Wempe_05-05_02.jpg` (kompl. 05 05 01).
- **Material/stock:** "Messingblech 1,2 Din 1751 Ms 58 federhart".

| Feature | Value | Tier | Source |
|---|---|---|---|
| z | 80 | T1 | 05-05_03 |
| D | 21.9 | T1 | 05-05_03 |
| d | 21.066 | T1 | 05-05_03 |
| dg | 20.23 | T1 | 05-05_03 |
| t | 0.827 | T1 | 05-05_03 |
| l | 0.38 | T1 | 05-05_03 |
| M | 0.263 | T1 | 05-05_03 |
| Blank | ⌀22.5 −0.2 | T1 | 05-05_03 |
| Thickness | 1.0 ±0.03 | T1 | 05-05_03 |
| Bore | ⌀2.6 H7 (+0.009) | T1 | 05-05_03 |
| Boss | ⌀6.5 −0.2 | T1 | 05-05_03 |
| Rim inner | ⌀18.3 +0.2 | T1 | 05-05_03 |
| Crossings | 5 radial spokes, 72°, width 1.3 −0.2 | T1 | 05-05_03 |
| Riveting | "6ø" both sides | T1 | 05-05_02 |
| Z | 4.12 → 5.12 | T1 | inf_axial §2.6 (05-05_01 "13,8" → 5.2 ✓) |
| Plan position | (0; −23.0), hole 35 | T1 | 05-08_03a |

- **Mates with:**
  - Sekundentrieb seat ⌀2.6 n6.
  - Meshes the Gangtrieb (escape pinion) z10 at c = 11.850. The Gangtrieb leaves span Z 3.30–8.30 (§5.2).
- **CAD notes:** rotation CCW from the back, 1 rev/min.

### Sekundentrieb (fourth pinion, seconds arbor) — 05 05 01-2

- **Source sheet(s):**
  - `05-05/Wempe_05-05_04.jpg` (part, 4.6.46, Änderung 24.3.48);
  - `05-05/Wempe_05-05_02.jpg` (kompl. 1940/43, superseded pivots only).
- **Material/stock:** "Präz. Rundstahl 3,5 Din 175".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Leaves z | **10** (inferred: (2 × 12.630 − 22.453) / 0.28066 = 10.00) | T1 | audit_train §2.2 |
| d | 2.807 | T1 | same |
| M | 0.2807 (= the Zwischenrad's) | T1 | — |
| t | 0.882 | T1 | — |
| OD | 3.166 (d + 1.28 M) | T4 | §4.1 |
| dg | 1.611 (d − 4.26 M) | T4 | §4.1 |
| Leaf length | 7, Z −2.88 → 4.12 | T1 | 05-05_04; inf_axial |
| Shoulder to shoulder | 24.1 −0.1 ("war 24 -0,05", 1948) | T1 | 05-05_04 |
| Front shoulder → wheel face | 9.25 −0.1 | T1 | 05-05_04 |
| Wheel seat | ⌀2.6 n6 (+0.013/+0.006), 1.2 +0.1 ("war 1,3 -0,1") | T1 | 05-05_04 |
| Front collar and arbor | ⌀1.55 −0.1 (4×, tolerance added 1948) | T1 | 05-05_04 |
| Back pivot | ⌀0.82 −0.02, **3.0 long, tip Z 22.0 OVERRIDDEN (drawn: 4.5, superseded)** | T1 dia / R1 | 05-05_04; Resolved |
| Front shoulder (on the Zwischenbrücke jewel) | Z −5.13 (end-shake 0.03) | T1 | inf_axial §2.6 |
| Front pivot and seconds extension | ⌀0.76 −0.02 at the shoulder, "Kegel 1:90" toward the tip. **Cut to 7.84, tip Z −12.97, tip ⌀0.673 OVERRIDDEN (drawn: 9.2 to a ⌀0.65 point, superseded)** | T1 dia / R1 + T3 | 05-05_04; Resolved_Design |
| Shoulder chamfer | 30° | T1 | 05-05_04 |
| Pivot diameters | 0.76 / 0.82 (1946/48) **(1940/43 kompl. 0.73 / 0.8 superseded)** | R1 | — |

- **Mates with:**
  - Zwischenrad (Z −1.25…−0.25 lies inside the leaves).
  - Sekundenrad (riveted on the ⌀2.6 n6 seat).
  - Upper-plate brass bush WN-300 at hole 35 (bore 0.83–0.84, §2.5).
  - Zwischenbrücke front hole jewel at 35: ⌀2.0 × 0.4, Z −5.13 → −5.53, in a ⌀5.2 setting in a 5.2 H7 seat (§2.4; the 001 opening ⌀3.27 is T3).
  - Zeigerfutter on the tip; dial hole ⌀1.7.
- **CAD notes:**
  - The tip clears the hour hand's rear face (Z −14.09) by 1.12.
  - The arbor passes the lower plate through the hole 35 clearance (⌀6.0 pre-drill, no bearing in the plate).
  - Rotation: CCW from the back.

---

### 4.3 Motion work (Zeigerwerk 05 02 and 05 05 03-3)

### Viertelrohr / Minutenrohr (cannon pinion) — 05 05 03-3

- **Source sheet(s):** no part sheet. Form only on `05-05/Wempe_05-05_08.jpg` (kompl. 05 05 03).
- **Material/stock:** steel (T4; no sheet).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Pinion leaves z | **14** (inferred: 2 × 12.600 − 20.16 = 5.04 → 5.04 / 0.36 = 14.0) | T1 | audit_train §2.3 |
| d | 5.04 | T1 | same |
| M | 0.36 (= the Wechselrad's) | T1 | — |
| t | 1.131 | T1 | — |
| OD | 5.501 | T4 | §4.1 |
| dg | 3.506 | T4 | §4.1 |
| Pinion (collar) span | Z −3.93 → −6.4 (2.47 long) | T1 / T3 length | inf_axial §2.4 (back shoulder → 25.4) |
| Overall (collar back face → front end) | 14.3; front end Z −18.23 | T1 | 05-05_08; inf_axial |
| Minute-hand seat | □2.6 r6 (+0.019/+0.012) square, 3.5 long (14.3 − 10.8 −0.1), Z −18.23 → −14.73 | T1 | 05-05_08 |
| Friction groove | "Körner" (punch-indented) groove, r 4 ("4r"), 6.3 from the collar back face (Z ≈ −10.23) | T1 | 05-05_08 |
| Tube OD | 3.7 (≥ the □2.6 square diagonal 3.68) | T4 | derived from the drawn square |
| Bore | follows the Minutentrieb front cone (⌀1.8 at Z −4.0 → ⌀1.67 at Z −18.23) + 0.01 | T4 | — |

- **Mates with:**
  - Minutentrieb front cone (friction at the Körner indentation).
  - Wechselrad z56 at c = 12.600.
  - Minute hand (□2.6 H7).
  - Stundenrohr bore (running).
- **CAD notes:**
  - The Minutentrieb tip is flush with the Viertelrohr front end (Z −18.23).
  - Rotation: CCW from the back.

### Wechselrad (minute wheel) — 05 02 02-1

- **Source sheet(s):**
  - `05-02/Wempe_05-02_07.jpg` (part, stamped "KOPIE"; sheet number 127-556.04-004 / 040202-1);
  - `05-02/Wempe_05-02_06.jpg` (Wechselrad kompl. 05 02 02).
- **Material/stock:** "Messingblech 1,2 Din 1751 Ms 58 federhart"; Rohmaß 1.2 × 22.5 × 22.5.

| Feature | Value | Tier | Source |
|---|---|---|---|
| z | 56 | T1 | 05-02_07 |
| D | **21.05 ±0.02** (handwritten; was "21,30 ±0,02" → "21,5", both struck) | T1 | 05-02_07 |
| d | 20.16 | T1 | 05-02_07 |
| dg | 19.03 | T1 | 05-02_07 |
| t | 1.131 | T1 | 05-02_07 |
| l (printed f or l) | 0.52 | T1 | 05-02_07 |
| Tooth thickness | "Zahnstärke 0,55-0,56" (handwritten), i.e. 0.555 | T1 | 05-02_07 |
| M | 0.36 (d/z; not printed) | T1 | — |
| Blank | ⌀21.5 "gedreht"; teeth "geschnitten" | T1 | 05-02_07 |
| Thickness | 1.2 → "fertig 1,0" | T1 | 05-02_07 |
| Bore | ⌀4.2 +0.0/−0.1 (dimension appears struck; riveted onto the Wechselbutzen) | T1 | 05-02_07 |
| Form | solid disc, no crossings | T1 | 05-02_07 |
| Z | −4.40 → −5.40 | T4 (fitted, see Wechselbutzen) | T3 section: −4.21 → −5.23 (inf_axial §2.4) |
| Plan position | (10.912; −6.30), hole 19 | T1 | 05-08_03a |

- **Mates with:**
  - Viertelrohr z14 (c 12.600).
  - Zeigerstelltrieb z16 (c 12.960).
  - Wechselbutzen ("vernietet").
- **CAD notes:**
  - The tip R 10.525 clears the Zwischenbrücke edge (closure.py, ≥ 0.3).
  - Rotation: CW from the back.

### Wechselbutzen (minute-wheel hub) — 05 02 02-2

- **Source sheet(s):** no part sheet. Section only on `05-02/Wempe_05-02_06.jpg`; stack on `05-02/Wempe_05-02_01.jpg`. This entry also covers its stud (Anrichtstift).
- **Material/stock:** brass (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Overall length | 7 −0.1; CAD 6.95 | T1 | 05-02_06 |
| Top (dial side) pipe OD | ⌀3.05 −0.04 ("aufschlagen zum Festsitz" for the Wechseltrieb) | T1 | 05-02_06 |
| Dial end → collar face under the pinion | 4.3 +0.1; CAD 4.35 | T1 | 05-02_06 |
| Collar between the pinion and the wheel | 0.6 (closes 6.95 − 4.35 − 1.0 − 1.0) | T1 closure / T3 | 05-02_06 |
| Wheel seat (riveted) | through the ⌀4.2 Wechselrad bore, wheel 1.0 | T1 | 05-02_06 |
| Below the wheel (plate side) | 0.9 +0.2; CAD 1.0 | T1 | 05-02_06 |
| Bore | ⌀1.5 running on the stud ("Laufsitz auf Anrichtstift") | T3 (scaled from 05-02_06, ±0.2) | 05-02_06 |
| Z | −3.40 → −10.35. The hub fills the 7.0 gap between the lower-plate outer face (−3.35) and the dial inner face (−10.35), 0.05 total shake | T4 (fitted) | inf_axial T3 hub −3.4 → −10.5 |
| Stud (Anrichtstift) | Steel. Pressed into lower-plate hole 19 (kalibr. ⌀3.50 +0.012); running ⌀1.5; Z 0.0 → **−10.15** ("6,8" beyond the plate outer face; 0.20 short of the dial) | T1 hole / T3 tip | 05-08_03a; 05-08_32-2 |

- **Mates with:** Wechselrad, Wechseltrieb, stud, lower plate, dial.
- **CAD notes:**
  - The T3 section position of the wheel (−4.21 → −5.23) would put the drawn 0.9 lower hub end inside the lower plate (−3.31 > −3.35). The fitted chain above keeps every drawn length and lies within the T3 band (±0.28).
  - Rotation: CW from the back.

### Wechseltrieb (minute pinion) — 05 02 02-3

- **Source sheet(s):** no part sheet. Outline only on `05-02/Wempe_05-02_06.jpg`.
- **Material/stock:** steel (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Leaves z | **18** (inferred: 2 × 12.600 − 18.90 = 6.30 → 6.30 / 0.35 = 18.0) | T1 | audit_train §2.3 |
| d | 6.30 | T1 | same |
| M | 0.35 (= the Stundenrad's) | T1 | — |
| t | 1.0996 | T1 | — |
| OD | 6.748 | T4 | §4.1 |
| dg | 4.809 | T4 | §4.1 |
| Bore | ⌀3.00 (+0.01), press fit on the ⌀3.05 −0.04 Butzen | T4 | "aufschlagen zum Festsitz" |
| Face width | 2.6, Z −6.00 → −8.60 (sits on the Butzen collar, which ends at −6.00) | T3 (scaled from 05-02_06) | — |

- **Mates with:**
  - Stundenrad z54 at c = 12.600; the Stundenrad (Z −6.44…−7.49) lies inside the leaves.
  - Wechselbutzen.
- **CAD notes:**
  - Ratio Viertelrohr → Stundenrad = (56 / 14) × (54 / 18) = 12 (exact).
  - Rotation: CW from the back.

### Stundenrad (hour wheel) — 05 02 03-1

- **Source sheet(s):**
  - `05-02/Wempe_05-02_09.jpg` (part, about 60 % legible; sheet number 127-556.04-000 / 040204-1);
  - `05-02/Wempe_05-02_08.jpg` (Stundenrad kompl. 05 02 03).
- **Material/stock:** "Messingblech 1,2 Din 1751 Ms 58 federhart"; Rohmaß 1.2 × 21 × 21.

| Feature | Value | Tier | Source |
|---|---|---|---|
| z | 54 | T1 | 05-02_09 |
| D | **19.7** (handwritten; was "20,0 ±0,02", struck) | T1 | 05-02_09 |
| d | 18.90 | T1 | 05-02_09 (the reading 18.30 would give z ≈ 20.4, impossible) |
| dg | 17.89 (?) | T1 | 05-02_09 |
| t | 1.099 (last digit faint; π d / z = 1.0996) | T1 | 05-02_09 |
| f | 0.5 | T1 | 05-02_09 |
| M | 0.35 (d/z) | T1 | — |
| Blank | ⌀20.2 −0.1 (handwritten; "20,1 gedreht" struck); teeth cut at 20.2 → D 19.7 | T1 | 05-02_09 |
| Thickness | "1,05 -0,03 gedreht" ("fertig 1,0" struck); the kompl. shows "1 -0,1" | T1 | 05-02_09 / 05-02_08 |
| Bore | ⌀6 (tolerance illegible) | T1 | 05-02_09 |
| Hub recess | 0.4 deep (?) | T1 (?) | 05-02_09 |
| Form | solid disc | T1 | 05-02_09 |
| Z | −6.44 → −7.49 (1.05 thick). Fitted so that the drawn 8.2 Stundenrohr ends at the T3 tip −14.64; within the T3 band | T4 | T3 section: −6.64 → −7.57 (inf_axial §2.4) |
| Plan position | (0; 0), concentric with the Minutenrad | T1 | — |

- **Mates with:**
  - Wechseltrieb z18 (c 12.600).
  - Stundenrohr ("vernietet").
- **CAD notes:**
  - In plan the Auf u. Abrad overlaps the Stundenrad by about 4. They are separated axially by 0.88 (Auf u. Abrad top face −8.37 against the Stundenrad −7.49).
  - The plate face −6.44 is 0.04 clear of the Viertelrohr pinion front face (−6.4).
  - **Axial retention (rev 2.1).** The Stundenrohr collar (⌀7.0, front face −10.15) runs against the dial inner face, so the hour wheel floats 0.14–0.24 in total. Without it the wheel could slide 1.4 toward the minute hand when dial down, dragging its hand on the minute hand and coming partly out of mesh with the Wechseltrieb.
  - Rotation: CCW from the back, 1 rev / 12 h.

### Stundenrohr (hour pipe) — 05 02 03-2

- **Source sheet(s):** no part sheet. Section only on `05-02/Wempe_05-02_08.jpg`.
- **Material/stock:** brass (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Hand seat | ⌀4.4 r6 (+0.023/+0.015), "Kegel 1:70", from the tip to the step, 8.2 − 5.2 = 3.0 long | T1 | 05-02_08 |
| Wheel back face → tip | 8.2 −0.1 | T1 | 05-02_08 |
| Wheel back face → step (end of the collar) | 5.2 −0.1 | T1 | 05-02_08 |
| Wheel | 1 −0.1 (riveted, "vernietet") | T1 | 05-02_08 |
| Boss at the wheel | ⌀8.5 × 0.6 (Z −6.44 → −7.04 incl. the riveted wheel), behind the dial only (the scaled "⌀8.5 collar") | T3 / T4 | rev 2 |
| Pipe, wheel → step | **⌀5.0** (−7.04 → −11.64), passing the ⌀6.0 dial hole with 0.5 radial clearance | T4 | rev 2 |
| Retaining collar (rev 2.1) | **⌀7.0, Z −7.04 → −10.15**, solid with the pipe. Its front face bears on the dial inner face around the ⌀6.0 hole: 0.10 end-shake to the dial (0.20 at the Werkring "7 −0.1" maximum dial seat) and 0.04 to the Viertelrohr pinion behind. Plan clearances: Auf u. Abrad tip 2.3, Wechseltrieb 5.7 | T4 | closure.py `review` |
| Bore | ≈ 3.7, running on the Viertelrohr tube | T3 (scaled, ±0.2) | — |
| Tip Z | −14.64 (governs); wheel plate face −6.44, step −11.64 | T3 tip / T1 lengths | inf_axial §2.4 (the section draws the pipe ≈ 8.0) |

- **Mates with:** Stundenrad, Viertelrohr tube, hour hand (⌀4.4 H7, Kegel 1:70), dial centre hole ⌀6.0.
- **CAD notes:**
  - **Closed (rev 2).** The ≈⌀8.5 that was scaled is a short boss at the wheel; the pipe that passes the dial is ⌀5.0, and the step at −11.64 lies inside the dial hole.
  - The hour hand's pipe end seats on the step, so its 3.1 overall height puts the blade at −14.09 → −14.74 (§4.5). The hand seat engages 3.0 of the drawn 3.0.
  - The rev-2.1 collar holds the hour wheel axially against the dial (§4.3 Stundenrad).

### Zeigerstelltrieb (hand-setting pinion) — no part number

- **Source sheet(s):** no part sheet. Section only on `05-02/Wempe_05-02_01.jpg`.
- **Material/stock:** steel (T4).
- **Conditional:** the plate holes are bracketed "nur wenn Zeigerstellung eingebaut wird" (only if hand-setting is fitted).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Leaves z | **16** (inferred: 2 × 12.96 − 20.16 = 5.76 → 5.76 / 0.36 = 16.0) | T1 | audit_train §2.3 |
| d | 5.76 | T1 | same |
| M | 0.36 | T1 | — |
| t | 1.131 | T1 | — |
| OD | 6.221 | T4 | §4.1 |
| dg | 4.226 | T4 | §4.1 |
| Centre distance to the Wechselrad | 12.96 (drawn); table 12.960 | T1 | 05-02_01; 05-08_03a holes 18–19 |
| Plan position | (22.136; −12.780), lower-plate hole 18 (kalibr. ⌀3.50 +0.012; Nr. pencil-struck) | T1 | 05-08_03a |
| Face width / Z | 2.4, Z −3.70 → −6.10 (centred on the Wechselrad mid-plane −4.90) | T4 | — |
| Arbor / stud | Steel stud pressed into hole 18 (⌀3.50); running ⌀1.5 | T4 | — |

- **Mates with:**
  - Wechselrad.
  - Setting-arbor parts and Zeigerstellung cut-outs A/B (frame section; conditional).
- **CAD notes:**
  - Plan clearance to the Zwischenbrücke is 14.0.
  - Rotation: CCW from the back (idles).

---

### 4.4 Power-reserve (Auf u. Ab) work

### Auf u. Abrad (up-and-down wheel) — 05 02 04-1

- **Source sheet(s):**
  - `05-02/Wempe_05-02_11.jpg` (part);
  - `05-02/Wempe_05-02_10.jpg` (Auf u. Abrad kompl. 05 02 04);
  - `05-02/Wempe_05-02_01.jpg`.
- **Material/stock:** "Messingblech 1,2 Din 1751 Ms 58 federhart".

| Feature | Value | Tier | Source |
|---|---|---|---|
| z | 120 | T1 | 05-02_11 |
| D | 34.33 | T1 | 05-02_11 |
| d | 33.454 | T1 | 05-02_11 |
| dg | 32.57 | T1 | 05-02_11 |
| t | 0.878 (π d / z = 0.8758; the sheet is 0.25 % off. Use 0.8758 for the CAD tooth spacing; 120 teeth fix it) | T1 | 05-02_11 |
| l | 0.40 | T1 | 05-02_11 |
| M | 0.27878 (d/z; not printed) | T1 | — |
| Blank | ⌀35.3 −0.2 | T1 | 05-02_11 |
| Thickness ("Radstärke") | 1.0 (kompl. 1 −0.1) | T1 | 05-02_11 / 05-02_10 |
| Bore | ⌀5.2 H7 (+0.012) | T1 | 05-02_11 |
| Boss | ⌀10.5 (tolerance illegible) | T1 | 05-02_11 |
| Rim inner | ⌀28.2 +0.2 | T1 | 05-02_11 |
| Crossings | 5 radial spokes, 72°, width 1.7 −0.2 | T1 | 05-02_11 |
| General tolerance | ±0.03 | T1 | 05-02_11 |
| Z | **−9.40 → −8.37, raised 0.25 on its stud OVERRIDDEN (section: −9.65 → −8.62)** | T4 | Resolved_Design |
| Plan position | (0; 23.0), lower-plate hole 2 (kalibr. ⌀3.50 +0.012) | T1 | 05-08_03a |

- **Mates with:**
  - Fusee Auf-u-Ab-Trieb z12 at c = 18.400. The wheel bottom face −9.40 is 0.05 inside the pinion end −9.45.
  - Hub 05 02 04-2 (riveted).
- **CAD notes:**
  - Clearance to the dial inner face (−10.35) is 0.95.
  - Rotation: CCW from the back (CW from the dial) while running.
  - Sweep: 12/120 × 360 = 36° per fusee turn. At 90/14 h per fusee turn that is 5.6°/h, so 56 h = 313.6°.

### Auf-u-Ab hub — 05 02 04-2

- **Source sheet(s):** no part sheet. Section only on `05-02/Wempe_05-02_10.jpg`.
- **Material/stock:** brass (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Hand seat | ⌀2.2 r6 (+0.019/+0.012), 1.4 long at the dial end | T1 | 05-02_10 |
| Step above the wheel | 0.7 | T1 | 05-02_10 |
| Wheel dial face → hub dial end | 2.8 | T1 | 05-02_10 |
| Wheel | 1 −0.1, riveted ("vernietet") | T1 | 05-02_10 |
| Wheel plate face → hub plate end | **4.95 OVERRIDDEN (drawn: 5.2)**. With the drawn 5.2 the Resolved 0.25 raise would put the hub end at −3.17, 0.18 into the lower plate. 4.95 restores the drawn 0.07 clearance (end Z −3.42) | T4 | 05-02_10; Resolved raise |
| Wheel dial face → hub dial end (rev 2) | **3.80 OVERRIDDEN (drawn: 2.8)**, so that the hand's ⌀4.4 × 1.4 boss, which cannot enter the ⌀3.2 dial hole, sits fully on the seat in front of the dial. The hand seat ⌀2.2 r6 runs −11.80 → −13.20; the hub body between the 0.7 step and the seat is ⌀3.0 (passes the ⌀3.2 dial hole) | T4 | §4.5; closure.py |
| Bore | ⌀1.5 running ("Laufsitz auf Anrichtstift") | T3 (scaled from 05-02_10, ±0.2) | — |
| OD below the wheel | ≈ 3.4 | T3 (scaled) | — |
| General tolerance | ±0.05 | T1 | 05-02_10 |
| Z (after the raise, rev 2) | plate end −3.42; wheel −8.37 → −9.40; step 0.7 −9.40 → −10.10; ⌀3.0 body −10.10 → −11.80; seat −11.80 → −13.20; dial end −13.20 | T1 (seat) / T4 | — |

- **Mates with:**
  - Auf u. Abrad, stud, dial hole ⌀3.2 (the ⌀3.0 body passes through it).
  - Auf-u-Ab hand (⌀2.2 H7), fully engaged.
- **CAD notes:** The 4.95 and 3.80 lengths are rev-2 fits, not in Resolved_Design. The hub's end-shake is 0.07 at the plate plus 0.25 to the dial (the 0.7 step, ⌀4.0, against the dial inner face). At the dial-ward extreme the wheel still engages 0.80 of its pinion face.

### Auf-u-Ab stud (Anrichtstift) — the same part as Futter 05 08 02-2

- **Source sheet(s):** no part sheet. `05-08/Wempe_05-08_32-2.jpg` ("Futter an dieser Seite eindrücken", "12,3"); `05-02/Wempe_05-02_01.jpg` (stack, "12,7" printed beside it).
- **Material/stock:** steel (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Plate seat | pressed into lower-plate hole 2 from the inner side, ⌀3.50 +0.012 (Festsitz), through the 3.35 plate; head flush with Z 0 | T1 hole | 05-08_03a; 05-08_32-2 |
| Running ⌀ | 1.5 | T3 | 05-02_10 hub bore |
| Z | 0.00 → **−12.30** ("12,3" from the inner face), inside the hub bore (hub to −13.20). **OVERRIDDEN (rev 1 §4.4: end −11.0)** | T3 | 05-08_32-2 |

- **Mates with:** Auf-u-Ab hub, lower plate.
- **CAD notes:** §2.5 and §2.8.9 describe this same part as "Futter 05 08 02-2". The "12,7" on 05-02_01 is not used.

### Auf-u-Ab-Trieb (fusee pinion for the reserve) — no part number

- **Source sheet(s):** no part sheet. `05-02/Wempe_05-02_01.jpg` ("Festsitz 1,6ø"). The fusee arbor itself is in the power section.
- **Material/stock:** steel (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Leaves z | **12** (inferred: 2 × 18.4 − 33.454 = 3.346 → 3.346 / 0.27878 = 12.0; confirmed by the 315° dial sweep) | T1 | Inferred_Values §3 |
| d | 3.346 | T1 | — |
| M | 0.2788 | T1 | — |
| t | 0.8758 | T1 | — |
| OD | 3.703 | T4 | §4.1 |
| dg | 2.158 | T4 | §4.1 |
| Bore | ⌀1.6, press fit on the fusee's 1.6 lower pivot ("Festsitz 1,6ø") | T1 | 05-02_01 |
| Z | −9.45 → −6.55 (2.90, the finished 1.6 pivot, §2.8.3) | T3 | inf_axial §2.3; res_fusee §2 |
| Plan position | (16.708; 15.292) | T1 | — |

- **Mates with:** Auf u. Abrad (c 18.400), fusee arbor.
- **CAD notes:** rotation CW from the back while running.

---

### 4.5 Hands

Z values are the section values from inf_axial (T3, ±0.4), except where rev 2 closes the hour-hand and Auf-u-Ab stacks (marked).

### Minutenzeiger (minute hand) — 05 02 00-1

- **Source sheet(s):** `05-02/Wempe_05-02_02.jpg`.
- **Material/stock:** "Goldin"; "Oberfläche poliert".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Seat | □2.6 H7 (+0.009) square | T1 | 05-02_02 |
| Boss | ⌀6 outer, ⌀4.2 inner step; boss height 2; 1.2 (plate at the boss); "Kegel 1:70" printed at the boss | T1 | 05-02_02 |
| Length, centre → tip | 46 | T1 | 05-02_02 |
| Plan widths | 1.2 at the neck; 2 at r 13; 0.7 at r 25; 1.7 at r 36 (section A-B, lens-shaped, not dimensioned); 0.4 at the tip r 46 | T1 | 05-02_02 |
| Thickness | 0.7 (inner blade), 0.6 (r 36), 0.4 (tip) | T1 | 05-02_02 |
| General tolerance | ±0.1 | T1 | 05-02_02 |
| Z | blade −16.10 → −16.75; the 2-high boss stands **forward** of the blade (−16.10 → −18.10), on the Viertelrohr square (−18.23 → −14.73). It is 1.36 clear of the hour hand | T3 / T4 (boss side) | inf_axial §3.7 |

- **Mates with:** Viertelrohr □2.6 r6.
- **CAD notes:**
  - Blend the widths with smooth tangent arcs through the listed stations.
  - Rotation: CW from the dial.
  - **Bezel constraint (case spec rev 3, §14).** The tip sweeps r 46 inside the bezel. The bezel keeps its ⌀92 only as a 1.0 lip at the glass end (dial-side face Z −17.95) and is undercut to ⌀95 below it. So the hand must be **≤ 47.0 long** with its **blade top at Z ≥ −16.95**. Both are met: 46 ±0.1, and −16.75. Do not lengthen the hand or raise its blade.

### Stundenzeiger (hour hand) — 05 02 00-2

- **Source sheet(s):** `05-02/Wempe_05-02_03.jpg`.
- **Material/stock:** "Goldin"; "hochglanz poliert".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Bore | ⌀4.4 H7 (+0.012), "Kegel 1:70" | T1 | 05-02_03 |
| Boss | ⌀8.2 outer ring, ⌀6.8 inner ring; pipe ⌀5 × 3.1 high (toward the dial); "-0,2" (?) | T1 | 05-02_03 |
| Length, centre → tip | **35** | T1 | 05-02_03 |
| Plan widths | 1.7 at the neck; 2.4 at r 9; 0.8 at the waist (before r 19.5); round bulb ⌀5.2 centred at r 22.5; 0.6 at r 30; 0.5 at the tip r 35 | T1 | 05-02_03 |
| Thickness (verbatim sequence, boss → tip) | 0.8 / 0.5 / 0.6 / 0.4 / 0.7 / 0.6 / 0.3 | T1 | 05-02_03 |
| General tolerance | ±0.1 | T1 | 05-02_03 |
| Z (rev 2) | Pipe end seated on the Stundenrohr step at −11.64; overall 3.1, so the **blade is −14.09 → −14.74**. **OVERRIDDEN (section T3 −13.50 → −14.15, and "1,8" dial → hand on the 1941 assembly 05-02_01).** Those cannot be met together with the 1948 drawn 5.2 / 8.2 Stundenrohr, the 3.1 pipe and the ⌀6.0 dial hole; this placement keeps all four drawn values | T1 (lengths) / T4 | closure.py |

- **Mates with:** Stundenrohr ⌀4.4 r6, Kegel 1:70 (3.0 of the hand's 3.1 on the seat).
- **CAD notes:**
  - It sweeps r 23 over the seconds arbor and the Auf-u-Ab hand: clearances 1.12 (arbor tip −12.97) and 0.89 (Auf-u-Ab boss −13.20). It is 1.36 behind the minute hand.
  - Rotation: CW from the dial.

### Auf u. Abzeiger (power-reserve hand) — 05 02 00-3

- **Source sheet(s):** `05-02/Wempe_05-02_04.jpg`.
- **Material/stock:** "Bandstahl 0,6 × 15"; "härten, Oberfläche polieren, blau anlassen".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Bore | ⌀2.2 H7 (+0.009) | T1 | 05-02_04 |
| Boss | ⌀4.4; heights 1.4 (overall) / 0.5 | T1 | 05-02_04 |
| Blade | width 0.9 at the neck → 0.25 at the tip; thickness 0.3 at the tip; section A-B half-round | T1 | 05-02_04 |
| Lengths | "9,5" from the centre and "11,7" from the far boss edge (= 9.5 + 2.2), both to the same station; a finer needle continues beyond, undimensioned | T1 / T3 | 05-02_04 |
| CAD tip radius | 12.5 (inside the ⌀26 subdial) | T4 | — |
| General tolerance | ±0.1 | T1 | 05-02_04 |
| Z (rev 2) | **Boss −11.80 → −13.20** (1.4, fully on the hub seat, 0.15 in front of the dial); **blade −11.80 → −12.30** on the dial side of the boss. **OVERRIDDEN (section T3 blade −11.95 → −12.43, which left only 0.55 of the boss on the seat)** | T1 (boss) / T4 | §4.4; closure.py |

- **Mates with:** Auf-u-Ab hub seat ⌀2.2 r6 (−11.80 → −13.20 after the rev-2 hub lengthening).
- **CAD notes:**

  - Phase: the hand points to "0" at full wind.
  - Rotation: CW from the dial while running.

### Sekundenzeiger (seconds hand) — 05 02 01-1

- **Source sheet(s):** `05-02/Wempe_05-02_05.jpg`.
- **Material/stock:** "Bandstahl 30 × 0,6 Din 1016"; "gehärtet, läppen, blau anlassen".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Hole | ⌀1.2 +0.05 | T1 | 05-02_05 |
| Boss | ⌀3.2 outer; "2.5" in the section is read as the boss's plan length along the hand, not its height. The boss's axial height is ≤ 0.89 (the hand is pressed on the Zeigerfutter, −11.97 → −12.97), so it stays ≥ 1.1 behind the hour hand | T1 / T4 (reading) | 05-02_05 |
| Pointer | centre → tip 19.5 (= 29.5 − 10); width 0.6 at the root → 0.2 at the tip | T1 | 05-02_05 |
| Tail | centre → tail end 10. Neck 0.3 wide to r 6.5, then a lance-shaped counterpoise 1.7 wide from r 6.5 to r 10 | T1 | 05-02_05 |
| Thickness | 0.5 (tail) / 0.3 (neck) / 0.4–0.5 (boss region) / 0.3 (tip) | T1 | 05-02_05 |
| Section A-B | half-round (detail at 10:1) | T1 | 05-02_05 |
| General tolerance | ±0.1 | T1 | 05-02_05 |
| Z | blade −12.08 → −12.42 | T3 | inf_axial §3.7 |

- **Mates with:** Zeigerfutter (OD 1.2).
- **CAD notes:**
  - The tip at r 19.5 just passes the seconds-subdial outer ring (⌀37).
  - Rotation: CW from the dial.
  ### Zeigerfutter (seconds-hand pipe) — no part number

- **Source sheet(s):** none (Resolved_Design: the cross-section callout "Zeigerfutter").
- **Material/stock:** brass (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| OD | 1.2 (the hand's ⌀1.2 +0.05 hole is pressed on) | T1 fit | Resolved_Design |
| Bore | taper 1:90 matching the arbor: ⌀0.684 at Z −11.97 → ⌀0.673 at Z −12.97 | T1 fit | Resolved_Design; 1:90 from ⌀0.76 |
| Length | 1.0, Z −11.97 → −12.97, flush with the arbor tip | T4 | Resolved_Design (≈ 1.0) |

- **Mates with:** Sekundentrieb tip (friction), seconds hand.
- **CAD notes:** the dial seconds hole ⌀1.7 passes the arbor (⌀0.68–0.70 at the dial).

---

### 4.6 Dial

### Zifferblatt (dial, Wempe) — 05 02 00-4

- **Source sheet(s):** `05-02/Wempe_05-02_12.jpg` (printed 127-556.04-162; "05040111" struck; handwritten "05 02 00-4"). The A. Lange & Söhne dial `05-02/Wempe_05-02_13.jpg` (1453/A) is **not** this calibre; do not use it.
- **Material/stock:**
  - "Messingblech 1,3 (hw 1,2) Din 1751 Ms58"; Rohmaß 1.3 × 110 × 110.
  - Handwritten alternative: "Eisenblech 1,3 gebondert".
  - Finish: "plan gespannt, geätzt 0,2 tief, schwarz ausgelegt, weiß lackiert" (flattened, etched 0.2 deep, filled black, lacquered white).

| Feature | Value | Tier | Source |
|---|---|---|---|
| OD | ⌀103.6 −0.1 ("fertig"; 105 struck) | T1 | 05-02_12 |
| Thickness | 1.3 (handwritten 1.2 noted) | T1 | 05-02_12 |
| Z faces | inner −10.35, outer −11.65 (lower-plate outer face −3.35 − "7") | T1 | inf_axial §2.1 (T3 −10.42 / −11.72) |
| Drawn rings | ⌀85, ⌀90, ⌀101 (minute track and chapter rings; artwork etched) | T1 dia / T3 assignment | 05-02_12 |
| Centre hole | ⌀6.0 | T1 | 05-02_01 "Loch ø 6,0"; drawn "6" |
| Auf-u-Ab subdial | centre **23 ±0.03 above the centre (N)**, plan (0; 23.0). Outer ring ⌀26; scale band between ⌀15 and ⌀18; hole ⌀3.2 | T1 | 05-02_12 |
| Reserve scale | **0–56 h over 315°**, numerals 0, 8, 16, 24, 32, 40, 48, 56 every 45° (5.625°/h). 0 at θ = 22.5° (CW of 12, viewed from the dial), 56 at θ = 337.5°; 45° gap centred on 12. Hand at h hours run: θ = 22.5° + 5.625° × h | T1 dial / T3 phase | 05-02_12 ("45°"); closure.py |
| Seconds subdial | centre **23 ±0.03 below the centre (S)**, plan (0; −23.0). Rings ⌀37 (outer), ⌀33 (seconds-track inner), ⌀23 (inner circle); hole ⌀1.7; 60 at the top; numerals at 10-s steps | T1 c-c / T3 rings | 05-02_12; 05-05_01 "Loch ø 1,7" |
| Fixing holes | ⌀1.8 H7 (+0.009), "Senkung 1,0 tief", on the ⌀101 circle (r 50.5): two at θ ≈ 120° and 240°; at the top one at θ ≈ −6° and a ⌀1 hole at θ ≈ +6° ("6°" each side of 12); "1,1" printed at a hole (unassigned). The WN-10 dial-screw heads in the "Senkung 1,0 tief" countersinks must finish **flush to 0.05 below the dial face**: the bezel relief clears the dial by only 0.10 (case spec rev 3, §14) | T1 dia / T3 angles (±3°) | 05-02_12; Werkring 05-08_07 "50,5", "6°"; case spec §14 |
| Lettering | "CHRONOMETERWERKE / WEMPE / HAMBURG", anchor mark, "Made in Germany"; numeral heights "2,7" and "2,2" (?) | T3 | 05-02_12 |

- **Mates with:**
  - Werkring (fixing; frame section).
  - Clearance holes for the Stundenrohr / hour-hand pipe (⌀6.0), the Auf-u-Ab hub (⌀3.2) and the seconds arbor (⌀1.7).
- **CAD notes:**
  - The audit reads the seconds rings as "27 (?), 17, 3,7 / 3,3 / 2,3 (?)". At the sheet's own 23-mm scale the labels "37", "33", "23" fit the ring diameters, "17" is the ⌀1.7 hole, and "27" is a numeral-height callout ("2,7"). T3.
  - The 05 02 00-1 number given in the brief for the dial is the minute hand's number. The dial is 05 02 00-4.

---

### 4.7 Train assembly

#### Pivot fitting (R1)

The arbor sheets show parts turned between centres. Diameters and shoulder spans come from the 1946/48 sheets. Pivot lengths are fitted to the frame:

| Arbor | Back pivot | Front end | End-shake |
|---|---|---|---|
| Minutentrieb | ⌀1.2 × 3.0, tip Z 22.0 | ⌀2.2 e8 journal in the lower plate; tip cut flush with the Viertelrohr at Z −18.23 | 0.05 (0.05–0.12 with nominal parts: WN-302 face 0.10 +0.02 below Z 0 against the boxed "19 +0,05"); fitted to the measured plate gap (§2.9) |
| Zwischentrieb | ⌀0.85 × 3.0, tip Z 22.0 | ⌀0.85 × 3.0 in the Zwischenbrücke bushing, tip Z −7.05 | 0.02 (0.02–0.12 over the 23.05 −0.1 tolerance; bush face −4.07, §2.9) |
| Sekundentrieb | ⌀0.82 × 3.0, tip Z 22.0 | ⌀0.76 pivot in the Zwischenbrücke jewel, continuing as the 1:90 extension cut to 7.84 (tip Z −12.97) | 0.03 (0.03–0.13 over 24.1 −0.1) |

- Back tips sit 0.35 under the upper-plate outer face (22.35), forming an oil sink.
- Bearing holes (bushings and jewels; seats in the frame section): hole = pivot + 0.01–0.02 (T2), "Enger Laufsitz" (close running fit, 05-05_01 and 05-02_01).
- Order of assembly:
  1. Rivet the wheels on their n6 seats.
  2. Cut the pivots to length; repolish the pivots and the conical ends.
  3. Fit the arbors between the upper plate and the lower plate / Zwischenbrücke.
  4. Fit the Viertelrohr with its Körner friction.
  5. Fit the motion work: Wechselrad on its stud, then the Stundenrad.
  6. Fit the Auf-u-Ab hub on its stud and the dial.
  7. Fit the hands: hour, Auf-u-Ab (at "0" with the fusee at full wind), Zeigerfutter + seconds hand, minute hand.

#### Depthing: each mesh at the plate-table centre distance

| Driver → driven | z / z | Ratio | c (table) | (d1 + d2) / 2 | Plane check |
|---|---|---|---|---|---|
| Schneckenrad → Minutentrieb | 90 / 14 | 6.4286 | 22.650 (10–1) | 22.654 | 2.54–3.84 ⊂ 1.8–5.8 |
| Minutenrad → Zwischentrieb | 90 / 12 | 7.5 | 18.120 (1–38) | 18.118 | 0.5–1.8 ⊂ −0.25–4.35 |
| Zwischenrad → Sekundentrieb | 80 / 10 | 8 | 12.630 (38–35) | 12.630 | −1.25…−0.25 ⊂ −2.88–4.12 |
| Sekundenrad → Gangtrieb (escape pinion z10, d 2.634, OD 2.97) | 80 / 10 | 8 | 11.850 (35–26) | 11.850 | 4.12–5.12 ⊂ 3.30–8.30 |
| Viertelrohr → Wechselrad | 14 / 56 | 1/4 | 12.600 (1–19) | 12.600 | −4.40…−5.40 ⊂ −3.93…−6.4 |
| Wechseltrieb → Stundenrad | 18 / 54 | 1/3 | 12.600 (coaxial) | 12.600 | −6.44…−7.49 ⊂ −6.00…−8.60 |
| Wechselrad → Zeigerstelltrieb (conditional) | 56 / 16 | 3.5 | 12.960 (19–18) | 12.960 | −4.40…−5.40 ⊂ −3.70…−6.10 |
| Auf-u-Ab-Trieb → Auf u. Abrad | 12 / 120 | 1/10 | 18.400 (10–2) | 18.400 | −9.40…−8.37 ⊂ −9.45…−6.55 |

- **Results:**
  - Centre → fourth = 7.5 × 8 = 60 (seconds 1 rpm).
  - Beat = 8 × 15 teeth × 2 × 60 = 14 400 vph.
  - Minute → hour = 4 × 3 = 12.
  - Reserve: 56 h = 313.6° against the 315° scale (0.4 %).
- **No-mesh spacings (T1):** Minutenrad–Auf u. Ab 23.000; Minutenrad–Sekundenrad 23.000.

#### Z summary (dial side negative)

| Item | Z | Tier |
|---|---|---|
| Minutentrieb back tip / back shoulder | 22.0 / 19.0 | R1 / T1 |
| Sekundenrad | 4.12 → 5.12 | T1 |
| Minutentrieb leaves | 1.8 → 5.8 | T1 |
| Minutenrad | 0.5 → 1.8 | T1 |
| Zwischentrieb leaves | −0.25 → 4.35 | T1 |
| Zwischenrad | −1.25 → −0.25 | T1 |
| Sekundentrieb leaves | −2.88 → 4.12 | T1 |
| Viertelrohr pinion | −3.93 → −6.4 | T1 / T3 |
| Wechselrad | −4.40 → −5.40 | T4 |
| Stundenrad | −6.44 → −7.49 | T4 (T3 −6.64 → −7.57) |
| Wechseltrieb | −6.00 → −8.60 | T3 |
| Auf u. Abrad | −8.37 → −9.40 | T4 (Resolved) |
| Dial | −10.35 → −11.65 | T1 |
| Auf-u-Ab hand blade / boss front | −11.80 → −12.30 / −13.20 | T4 (rev 2) |
| Seconds hand / arbor tip | −12.08 → −12.42 / −12.97 | T3 / R1 |
| Hour hand blade (pipe end on the step −11.64) | −14.09 → −14.74 | T1 lengths / T4 (rev 2) |
| Stundenrohr collar front face (rev 2.1) | −10.15 (0.10 behind the dial inner face) | T4 |
| Stundenrohr tip | −14.64 | T3 |
| Minute hand blade / boss front | −16.10 → −16.75 / −18.10 | T3 / T4 |
| Viertelrohr end = Minutentrieb front tip | −18.23 | T1 / R1 |

### 4.8 Items that were open in this section: all closed in rev 2

1. **Stundenrohr / hour hand / dial stack:** the ⌀5.0 pipe passes the dial; the ⌀8.5 is a boss behind the dial; the hour hand seats on the step (§4.3, §4.5). The 1941 "1,8" dial → hand is superseded.
2. **Auf-u-Ab hub:** 4.95 (plate side) and 3.80 (dial side), both rev-2 fits (§4.4).
3. **Auf-u-Ab hand:** boss fully on the seat in front of the dial; needle tip at r 12.5 (T4).
4. **Wechselbutzen:** the fitted chain (−3.40 → −10.35) governs; the master Z table now agrees.
5. **The meaning of l / f / ℓ:** used as the tooth thickness on the pitch circle (T4). The cutter maker works from z, D, d, dg and t, which are all drawn.
6. **Kompl./part disagreements:** Stundenrad 1.05 −0.03 (part sheet). Minutentrieb front zone: ⌀2.2 e8 journal (the running fit) from Z 0 to −4.0, then the 1:80 cone; "Kegel 1:90" there is not used.
7. **Dial part number:** 05 02 00-4.
8. **Compiler-scaled values** (Stundenrohr bore ⌀3.7, stud and hub bores ⌀1.5, Wechseltrieb face 2.6, hub OD 3.4, seconds rings, dial fixing angles): adopted as T3. Each has ≥ 0.3 functional margin in closure.py.
9. **Compiler fits:** adopted. They are listed in §7.

---

## 5. Escapement, balance and hairspring

Baugruppen 05 04 (Hemmung) and 05 03 (Unruh). Spring-detent (Earnshaw) escapement, 14 400 vph, 2.000 Hz balance.

### 5.0 Conventions and source keys

- Units are mm, g, g·mm², degrees. Every value uses a **decimal point**. Drawing text quoted verbatim in quotes keeps its commas, e.g. "vorm biegen der Kurve auf 13 Umgänge -3,5 mm kürzen".
- **Plan frame.** x = O(+)/W(−), y = N(+)/S(−). The origin is the Minutenrad axis, viewed from the **back** (the upper-plate side). Angles ("bearings") run CCW from +x, viewed from the back.
- **Z.** Z = 0 at the lower-plate inner face, + toward the upper plate. Lower plate −3.35 → 0; upper plate 19.00 → 22.35.
- **Axes.** Gangrad axis W = (11.783; −21.743). Unruh axis B = (9.100; −12.110). |WB| = 10.000.
- **Tiers.**
  - T1: drawn, or closes exactly.
  - T2: engineering rule.
  - T3: scaled from a drawing.
  - T4: convention or fitted.
- **OVERRIDDEN (drawn: x)** marks a CAD value that replaces a drawn value.
- **Source keys** (paths are relative to `drawings/`):

| Key | File |
|---|---|
| RD | `Resolved_Design.md` (highest precedence) |
| RH | `_inferred/res_hairspring.md` |
| IV | `Inferred_Values.md` |
| IE | `_inferred/inf_escapement.md` |
| IA | `_inferred/inf_axial.md` |
| IP | `_inferred/inf_planview.md` |
| AU | `_audit/audit_balance_escapement.md` (verbatim drawn values) |
| AF | `_audit/audit_frame.md` (plate tables, verbatim) |
| CL | `_inferred/scripts/closure.py` |
| C | Arithmetic compiled for this section from the adopted values above. No new measurement |
| Sheet names | e.g. `05-04/Wempe_05-04_23.jpg`, read for the datum of a drawn number |

**Superseded values. Do NOT model these.** Each is listed only so it can be recognised:

- escape wheel ⌀15.0 (07-1 "D = 15,0", unexplained);
- escape-pinion OD 3.13;
- 13 helical coils, or L 552 / 562 / 590;
- hairspring height 11.5 as installed (it is the blank on its former);
- weights of 1.16 g;
- the ≈14 staff family (05-04_04/05; pre-forms, used here for seat fits only);
- "04 = Anker" and "05-03 sheets are Anker";
- the faint 05-03_7 series read as the outer strip edge;
- anything from Index.md.

---

### 5.1 Layout in the plan frame (05-04_01 → plan)

**The layout's own frame.** Sheet `05-04/Wempe_05-04_01.jpg` ("Hemmung für Federchronometer", 10:1) is drawn as seen **from the back**, not mirrored. Two independent checks support this:

1. The wheel is drawn turning clockwise. Viewed from the back, the train gives the Gangrad a clockwise turn: Minutenrad CCW → Zwischenrad CW → Sekundenrad CCW → Gangrad CW (IP §2: Minutenrad CCW from the back).
2. The layout's Kloben point A lies on the clockwise (downstream) side of the line of centres. Plate hole 13 lies on that same side.

Layout coordinates (u, v), all T1:
- origin at W;
- +u along W→B;
- +v 90° CCW from +u, which is the upstream side of the wheel.

**Transform.** plan = W + u·(−0.26830; 0.96334) + v·(−0.96334; −0.26830).

This is a rotation of **+105.564°** (the bearing of W→B) with no mirror. A layout angle α (CCW from W→B) becomes plan bearing 105.564° + α. A wheel angle "LoC + φ" in IE, with + downstream, is α = −φ.

**Rotation sense.**
- The Gangrad turns at **8 rpm, clockwise viewed from the back**.
- It turns with the Gangtrieb, in the sense in which the Sekundenrad drives that pinion. The mesh is external, so the Gangrad turns opposite to the Sekundenrad itself (CCW from the back).
- During impulse the balance and rollers turn **CCW viewed from the back**.

| Point | Layout (u; v) | Plan (x; y) | Tier | Source |
|---|---|---|---|---|
| W, Gangrad axis | (0; 0) | (11.783; −21.743) | T1 | AF row 26 |
| B, Unruh axis | (10.000; 0) | (9.100; −12.110) | T1 | AF row 23; 05-04_01 "Gangrad - Unruh 10,00" |
| A, layout Kloben screw (25.68 from B, 23.8 from W; angle at W 89.160°) | (0.349; −23.797) | (34.613; −15.022) | T1 | IE §4 triangle |
| Plate hole 13, "Gangfederkl. Schr." (upper plate, Körner, bohren 1.8) | — | (34.536; −16.238) | T1 | AF 3a row 13. **Adopted Kloben screw position** (RD). 1.218 from A |
| Ruhestein (locking stone) centre: r 7.23 (7.17–7.29) from W at LoC + 37.3° downstream | (5.751; −4.381) | (14.460; −15.027); bearing 68.26° from W | T3 | IE §4 |
| Detent axis (foot → horn) | direction 52.44° | plan bearing **158.00°** | T1 + T3 | C: printed 18.8 (along) and 7.6 (across) from A on 05-04_01, applied to the stone. The axis is tangent to the wheel at the stone (W lies 7.23 off it) |
| Horn tip (4.4 beyond the Röhrchen centre) | (8.433; −0.893) | (10.381; −13.379) | T3 | C. It is 1.80 from B; the layout's own reading is 1.65 (IE). See CAD notes in 5.3 |
| Gangfeder foot-screw station (18.8 from the Röhrchen) | (−5.709; −19.284) | (31.891; −22.069) | T1 + T3 | C |
| Effective detent hinge (mid-Federung, 13.1 from the Röhrchen) | (−2.234; −14.766) | (26.606; −19.934) | T2 | IE §4 |
| Waiting tooth tip: r 7.0 at LoC − 11.6° (upstream) | (6.857; 1.408) | (8.587; −15.515); bearing 117.16° from W | T3 | IE §5 |
| Tooth tip at impulse end: r 7.0 at LoC + 10.83° | (6.875; −1.315) | (11.205; −14.767); bearing 94.73° from W | T1/T3 | IE §5 |
| Locked tooth (leading tip corner) at the drawn instant | — | bearing ≈ 69.16° from W; other teeth at 69.16° ± k·24° | T3 | C: waiting tooth − 2 pitches. It meets the stone flat at 68.26° |

**Drawn instant.** 05-04_01 shows the start of unlocking: the discharge stone is touching the Goldfeder tip. Use this pose as the CAD rest pose (T4). The real beat setting is made at assembly.

**Z bands of the escapement** (detail in each part):

| Item | Z | Tier |
|---|---|---|
| Escape endstones (faces) | −2.00 / 20.83 (arbor resting on the lower one) | T4 |
| Gangtrieb leaves | 3.30 → 8.30 | T1/T3 |
| Gangradbutzen | 12.30 → 17.00 | T1 |
| Gangrad rim / crossings | 17.00 → 18.40 / 17.00 → 17.80 | T1/T3 |
| Auslöserolle | 15.50 → 17.10 | T1 chain |
| Heberolle | 17.10 → 18.70 (Hebestein 17.00 → 18.70) | T1 chain; section 16.97 → 18.70 (IA) |
| Gangfeder (Steg) | 15.88 → 16.88 | T3 (IA section 15.76 → 16.88) |
| Gangfederkloben | 12.50 → 19.00 (hangs from the upper plate) | T4 |
| Balance endstones (faces) | 10.20 / 35.85 (staff resting on the lower one; span 25.65, RD) | T4 |
| Unruhauflage (arm underside) / arm top | 22.80 / 23.95 | T1 (RD 23.95 − arm 1.15) |
| Balance rim | 22.80 → 26.60 | T1/T3 |
| Spiralrolle (collet) | 23.95 → 27.25 | T1 |
| Hairspring strip envelope | 24.70 → 34.20 | T1 (RD) |
| Klötzchen (stud) arm on the cock top | 37.35 → 38.95 | T1 |

---

### 5.2 Gangrad, Gangtrieb, Gangradbutzen (escape wheel, pinion, hub)

The assembly is "Gangrad" 05 04 05-1 (`05-04/Wempe_05-04_07-2.jpg`, 1943). It was relabelled from "050408 bis 10"; the 1941 sheet is 07-1. Part numbers on 07-2: wheel 05 04 08, pinion 05 04 09 (= Gangtrieb Hz 05 04 05-2), hub 05 04 10 (= Gangradbutzen 05 04 05-3).

**Assembly 05 04 05-1, axial chain (T1 from 07-2, datums read on the sheet; C).**
- Overall: 22.8 −0.02, tip to tip.
- Pinion-end tip → pinion face: "5,3".
- Pinion-end tip → wheel face on the pinion side: "19".
- Wheel face → hub end: "4,7".
- Wheel-end pivot zone: "2".
- The pinion end is the lower end in the movement.

| Z | Feature |
|---|---|
| −2.00 | lower pivot tip = lower endstone face (arbor down) |
| 0.00 | lower pivot shoulder |
| 3.30 | pinion leaves start |
| 12.30 | hub end |
| 17.00 | wheel lower face |
| 18.40 | wheel upper face |
| 18.80 | upper pivot shoulder |
| 20.80 | upper pivot tip |

The wheel-face datum gives 17.00. This agrees with IV's wheel plane 17.0–18.5 and with IA's section 17.04–18.49.

#### Gangrad (escape wheel) — 05 04 08 (1941 number; 1943 dash number not shown)

- Source sheet(s): `05-04/Wempe_05-04_23.jpg` (tooth form, 25:1), `05-04/Wempe_05-04_01.jpg`, `05-04/Wempe_05-04_07-1.jpg`, `05-04/Wempe_05-04_07-2.jpg`
- Material/stock: "Messingblech 1,6 Din 1751 Ms63 federhart" (05-04_23)

Polar tooth coordinates are (r; θ) about W. θ is in degrees from the tooth's leading tip corner. **+θ is downstream (the rotation direction = clockwise viewed from the back)**, so plan bearing = bearing of the leading corner − θ.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Tooth count | z 15, pitch 24.000° | T1 | IE §3; beat closes at 14 400 (CL) |
| Tip circle | ⌀14.00 +0.03 ("14ϕ +0,03"); R 7.000 (model ⌀14.015 allowed) | T1 | 05-04_23, 05-04_01 "Gangrad ϕ 14,00", RD |
| Tip land | 1.5° of arc at R 7.0, from the leading corner (θ 0) to θ −1.5°; chord **0.1834** (printed "0,18 34") | T1 | IE §3 |
| Face (locking and impulse face) | Straight line from the leading corner (7.000; 0°) to the face foot (5.850; −5.55°), tangent to the circle **⌀6.06** (R 3.03); 25.65° to the radial at the tip, 31.2° at the foot; the tip leads the foot | T1 | IE §3, "6,06 06ϕ" |
| Back flank | **Concave arc R 3.03**, from the land end (7.000; −1.5°) to the back step (6.050; −14.9°); arc centre at (9.06; −17.5°) | T3 (R) / T1 (centre) | IE §3 |
| Back step | Radial step 0.20 at θ −14.9°, from r 6.050 (**⌀12.1**) down to r 5.850 | T1/T3 | IE §3, "12,1ϕ" |
| Root circle | **⌀11.70** (r 5.850), from θ −14.9° to θ −29.55° (= next upstream tooth's face foot, −24° − 5.55°) | T1 | IE §3, "11,7ϕ" |
| Tooth base width | 1.0 chord (back step → face foot, 9.35°) | T1 | "1" on 05-04_23 |
| Rim inner circle | ⌀10.90 (rim 0.40 radial under the root) | T1 | "10,9ϕ" |
| Crossings | 3 curved crossings (05-04_01); flank radius 7.9 ("7,9r", meaning unlabelled); crossing width ≈1.0 (visual) | T3 / T4 width | IE §3; AU |
| Unresolved angle labels | "50°", "6°", "15°" (05-04_23); "86°", "22°10'", "6°5'", "20°", "6,0" (05-04_01). Not used | — | IE §3, §5 |
| Centre bore | ⌀1.8 H7 on the Butzen spigot 1.8 h6 (07-2 drawing "1,8ϕ H7/h6"; 05-04_01 hub "18" = 1.8) | T1/T3 | AU 07-2. **Conflict:** the 07-2 table says "1,7ϕ" (see 5.12) |
| Thickness, rim and teeth | **1.40** (07-1 "1,4"); Z 17.00 → 18.40 | T1 (1941 sheet) / T3 | 07-1; IV 17.0–18.5; IA 1.45 |
| Thickness, crossings and hub web | 0.80 (07-1 "0,8", over-written "0,7"(?)). Recess of 0.60 on the upper face (toward the upper plate), inside ⌀10.90; web Z 17.00 → 17.80 | T3 | 07-1 dashed outline (compiler's reading) |
| Phase at the drawn instant | Leading corners at plan bearings 69.16° + k·24° from W | T3 | 5.1 |

- Mates with: Gangradbutzen (1.8 H7/h6, riveted or staked); Heberolle (impulse); Ruhestein (locking); Gangtrieb arbor.
- CAD notes:
  - Build one tooth from the polar points above, then pattern it 15× at 24°. Check that the tip-circle arc inside the impulse-roller circle is 21.65° < 24° (window 2.35°).
  - **Do not** use ⌀15.0 (superseded).
  - The recess on the upper face is the compiler's reading of the 07-1 dashed line. If you prefer, model a flat 1.40 disc; the inertia effect is negligible.

#### Gangtrieb (escape pinion and arbor) — 05 04 05-2

- Source sheet(s): `05-04/Wempe_05-04_08.jpg` (blank "Hz", between centres), `05-04/Wempe_05-04_07-2.jpg`, `05-04/Wempe_05-04_07-1.jpg`
- Material/stock: "Präz. Rundstahl 3,4 Din 175" (hardened and polished, T4)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Teeth | z 10, cycloidal ("Zykloidenverzahnung" convention) | T1 | 05-04_08 table |
| OD | **2.97 −0.01** | T1 | RD; 05-04_08 table "D = 2,97ϕ -0,01" |
| Pitch ⌀ | 2.633 (2.634 from the 11.85 centre distance) | T1 | table "d = 2,633ϕ" |
| Root ⌀ | 1.6 | T1 | table "dg = 1,6ϕ" |
| Pitch / module | t 0.827 / M 0.263 | T1 | table |
| Leaf length | 5.0 −0.2 (Z 3.30 → 8.30); meshes the Sekundenrad at Z 4.12–5.12 | T1 (part sheet, R1) | 05-04_08 "5 -0,2". 07-1 draws 3 (1941); 07-2 draws ≈4 (undimensioned) |
| Leaf form | Radial flanks, rounded head; addendum 0.64·M | T4 / T2 | RD §4, IV §3 |
| Arbor | ⌀1.2 finished, Kegel 1:70 toward the Butzen seat (blank 1.6 −0.2) | T1/T3 | 07-1 "1,2ϕ", "Kegel 1:70"; 05-04_08 |
| Overall | **22.8 −0.02**, tip to tip | T1 | RD; 07-2 |
| Lower end | Tip Z −2.00; pivot zone 2.0 (shoulder at Z 0.00); from tip to leaves 5.3 | T1/T3 | 07-2 "5,3", "0,5" |
| Upper end | Pivot zone 2.0 (Z 18.80 → 20.80) beyond a ⌀1.2 stub of 0.4 above the wheel | T1 | 07-2 "2"; C |
| Pivots | **⌀0.24** ("0,24ϕ Steinlager einpassen"), cylindrical running length ≈0.5 at the tip ("0,5"), then a curved cone to the arbor; both ends | T1 / T3 | 07-1, 07-2 |
| End-shake | 0.03 (endstone span 22.83) | T1 + T4 | RD, CL |

- Mates with: Sekundenrad z80 (centre distance 11.85, CL check 11.850); escape jewels (5.10); Gangradbutzen.
- CAD notes: the blank sheet 05-04_08 is 26.5 between centres. The finished length 22.8 comes from 07-2 (R1: pivots are fitted to the frame).

#### Gangradbutzen (escape-wheel hub) — 05 04 05-3 (no own sheet)

- Source sheet(s): `05-04/Wempe_05-04_07-2.jpg` (as 05 04 10), `05-04/Wempe_05-04_07-1.jpg`
- Material/stock: brass (T4; not stated)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Length from the wheel face | 4.7 (Z 12.30 → 17.00) | T1 | 07-2 "4,7" (07-1: 5) |
| Collar next to the wheel | ⌀3.0 × 1.8 (Z 15.20 → 17.00) | T1 (1941 sheet) | 07-1 "3,0ϕ", "1,8" |
| Neck | ⌀1.8 (Z 12.30 → 15.20) | T1/T3 | 07-1 "1,8ϕ" |
| Spigot through the wheel | 1.8 h6 × 1.40, staked over the wheel's upper face | T1/T4 | 07-2 "1,8ϕ H7/h6" |
| Bore | To the arbor, Kegel 1:70 (pressed) | T4 | 07-1 |

- Mates with: Gangrad bore 1.8 H7; Gangtrieb arbor.
- CAD notes: the collar (r 1.5) is 8.5 from B in plan, so it is clear of the rollers and the detent.

---

### 5.3 Detent: Gangfeder, Ruhestein, Goldfeder, Gangfederkloben, banking

**Detent coordinate s.** s is measured along the detent axis from the Röhrchen centre, positive toward the foot. In plan the foot direction is bearing 338.00°, the horn direction 158.00°.

#### Gangfeder (spring detent) — 1436 (Grießbach), Feder group 05 04 01

- Source sheet(s): `05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg` (values), `05-04/Wempe_05-04_10-2_Wempe_Griessbach.jpg` (part names), `05-04/Wempe_05-04_01.jpg` (layout)
- Material/stock: "Stahl" (spring-hard, T4)

**Orientation (T3/T4).** 1436 left view is the plan profile: its thicknesses are measured in plan, which is the bending direction. 1436 right view is the side elevation: its widths are axial. Model the **main** values. The bracketed values are lower limits or finish alternatives (IV §2, T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Overall length | **26.5 +0.5/−0.3** = horn 4.4 + Röhrchen→foot screw 18.8 + half foot 3.3 | T1/T3 | RD; IE §4 |
| Horn ("Spitze") | s −4.4 → 0 (tip → Röhrchen centre); 0.25 (0.22) thick × 0.8 (0.75) wide; tip "Anschrägen" (chamfered) | T1 / T3 | 1436; IE (4.4 to the centre; layout measures 4.43) |
| Horn, side-view figure | "5,4 (4,9)", horn tip → Röhrchen block (verbatim; not used for length) | T1 (reading) | AU |
| Röhrchen (tube for the Ruhestein) | ⌀1.15 at s 0; axial length ≈2.0; bore 0.75 | T1 (⌀) / T3 (length) | 1436 "1,15ϕ"; scaled from the right view |
| Steg (blade) | s 0 → 8.7; 0.33 (0.28) thick × 1 (0.9) wide | T1/T3 | IE §4 (8.7 = 15.5 − 4.8 − 2) |
| Viereck | s 8.7 → 10.7; 0.55 (0.50) thick × 2 (1.9) wide | T1 | 1436 "2" |
| Federung (bending blade) | s 10.7 → 15.5; **4.8** long; thickness 0.09 / 0.07 / 0.09 (ends / middle, linear taper) × 2 wide | T3 (length) / T1 | IE §4 |
| Effective hinge | s 13.1 (mid-Federung) | T2 | IE §4 |
| Foot ("Fuß") | s 15.5 → 22.1; **6.6** long; 0.65 (0.60) thick × 2 (1.9) wide | T1 | 1436 "6,6" |
| Foot screw | M1 (clearance hole ⌀1.1, T4) at s **18.8** (foot centre), axis horizontal (through the 0.65 thickness) | T1 / T4 hole | 05-04_03 side view "M1"; 05-04_01 "18,8" |
| Foot pin holes | 2, ≈±2.3 from the screw, ⌀0.5 | T3 / T4 | 1436 right view |
| Handwritten "0,18 u.d.g." | Meaning unknown; not used | — | AU |
| Plan position | Axis through the Ruhestein centre (14.460; −15.027), bearing 158.00° toward the horn; foot screw at (31.891; −22.069) | T3 | 5.1 |
| Z (T4, from the section) | One axial face flush: top face at Z 16.88. Steg Z 15.88 → 16.88; Viereck, Federung and foot Z 14.88 → 16.88; horn Z 16.08 → 16.88; Röhrchen Z 15.73 → 17.73 | T3 (top face) / T4 | IA (Gangfeder drawn 15.76 → 16.88); 1436 right view (Steg flush with one face) |

- Mates with: Gangfederkloben end face (M1 screw, pins); Goldfeder (pinned at the Viereck); Ruhestein (in the Röhrchen); banking screw.
- CAD notes:
  - The detent is straight in plan. Its axis is tangent to the escape wheel at the stone.
  - **Unlocking setting (rev 2.1, governs).** Place the **Goldfeder's acting corner** (the corner the discharge stone strikes on the unlocking pass) at:
    - **r 1.630 ±0.005 from B**, against a discharge-stone tip radius of **1.71**;
    - **0.05 ±0.02 to the wheel side of the line through B parallel to the detent axis**. That is plan bearing ≈ 336° from B: exactly where the 05-04_01 drawn instant puts the discharge stone touching the Goldfeder at the start of unlocking (stone at α_B 230.4° = bearing 335.96°).
    - **The horn must be set to carry it.** The straight detent axis passes 0.70 from B on the side away from the wheel. To reach this point, the last ≈1 of the horn is set over ≈0.9 toward B (68°), the "Anschrägen", and the Goldfeder follows it. The layout itself draws the horn tip at 1.65 from B, not at the straight-line 1.80, which supports a set-over horn. The horn tip ends **0.12 ±0.01 short of the Goldfeder corner** (the Goldfeder overhang), at r ≥ 1.735, outside the stone circle. Otherwise the stone meets the banked horn on the return swing and stops the balance (Goldfeder, Mounting).
    - **True-motion lift** (detent turning about its hinge at s 13.1, stone sweeping its circle; closure.py `review`): **0.485 nominal, ≥ 0.425 worst case** (r 1.6425 + 0.0075 side-shake, offset 0.03). Unlocking needs 0.384 = 0.334 (the 0.20 locking depth × 17.5/13.1 + 0.067 safety) + 0.05 margin.
    - **Rev 2 failed this check.** Its setting was a straight horn with the tip at r 1.650 on the Goldfeder's wheel-side face, 0.97 from the B-parallel line. There the stone presses the corner toward B, deeper into its own circle, and cannot slip off until the detent has been driven ≈1.5. Its "0.45" came from a radial approximation that holds only when the corner lies on the B-parallel line. Even there, the true-motion lift at r 1.650 is only 0.37, or 0.33 worst case, which is below 0.384. Hence the smaller radius. **OVERRIDDEN (rev 2: tip at r 1.650 ±0.005, position across the detent not stated)**
    - The construction's 1.80 (from 18.8 / 7.6) is superseded.
    - Confirm in the CAD kinematic sweep (§8 C1) and on the bench (§8 B5): a 2D paper check does not replace them.
  - RD: re-check locking once modelled.
  #### Ruhestein (locking stone) — no part number (05-04_01 "Ruhestein ϕ 0,75")

- Source sheet(s): `05-04/Wempe_05-04_01.jpg`, `05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg`
- Material/stock: sapphire or ruby (T4)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Diameter | **⌀0.75** | T1 | 05-04_01 |
| Form | Half-round (D) cylinder: flat locking face through the axis, ≈ radial to W | T3/T2 | IE §4 |
| Setting | Fitted in the Röhrchen ⌀1.15 (wall 0.20), shellacked (T4) | T1/T4 | 1436 |
| Plan centre | (14.460; −15.027), r 7.23 (7.17–7.29) from W, bearing 68.26° from W | T3 | IE §4 |
| Axial extent | Z 15.73 → 18.50 (projects above the tube to cover the wheel band 17.00 → 18.40) | T4 | C |
| Locking depth on the stone | 0.20 (stone edge r 6.80 vs tip r 7.00) | T3 | IE §4 |
| Draw | ≈0.4° | T3/T2 | IE §4 |

- Mates with: Gangrad tooth tips (locking); Röhrchen.
- CAD notes: see 5.11 for how the "0.39" figure relates to this 0.20.

#### Goldfeder (passing spring, gold spring) — 05 04 01-2

- Source sheet(s): `05-04/Wempe_05-04_02.jpg`
- Material/stock: "Goldblech 333 federhart"

| Feature | Value | Tier | Source |
|---|---|---|---|
| Length | 15.4 | T1 | 05-04_02 |
| Blade | Drawn 0.15 thick (in plan) × 1 wide (axial), uniform over the whole part (re-checked on the scan, rev 2.1). **Build: thin the free blade, from the "Biegungspunkt" to the tip, to 0.045**; keep 0.15 at the foot and over the Viereck. **OVERRIDDEN (drawn: 0.15 throughout)** | T1 (drawn) / T4 (thinning) | "0,15", "1"; closure.py `review` |
| Return-swing loss (rev 2.1) | At 0.15 the return pass (δ ≈ 0.62 with the rev-2.1 corner, L 8.6–14.2) costs **≈ 5–24 µJ per oscillation**, against the 12–23 µJ the balance receives (§5.11). At 0.045 it costs **≤ 0.65 µJ**; at 0.05 it would be 0.90, just over the 0.85 limit | T2 | closure.py `review` |
| Foot | 2 wide × 2.4 long at the root end | T1 | "2", "2,4" |
| Fixing hole | ⌀0.7 +0.05, 1.2 from the root end | T1 | "0,7 +0,05", "1,2" |
| Mounting | Foot pinned to the Viereck (s 8.7–10.7); blade runs along the horn toward its tip. **Overhang beyond the horn tip: 0.12 ±0.01** (rev 2.1), so the horn tip stays outside the stone circle: r ≥ 1.735 from B, 0.018 clear at the worst corner. On the return swing the stone must meet only the Goldfeder: the horn is banked and cannot give, and touching it would stop the balance. **OVERRIDDEN (IE §5: overhang 0–0.05, which leaves the horn tip at r 1.63–1.68, inside the 1.71 circle; closure.py REJ)** | T4 | IE §5; closure.py `review` |
| Side | On the W side of the horn (plan bearing 248° side). The discharge stone, turning CCW from the back, pushes it against the horn and lifts the detent away from the wheel | T2 | C (unlocking geometry) |
| Z | Blade Z 15.88 → 16.88; foot Z 14.88 → 16.88 | T4 | C |
| Layout labels | "Biegungspunkt der Goldfeder"; "0,4" near the blade; "0,04" beside the detent's bending point (it belongs to the Gangfeder, not to the Goldfeder; meaning not established) | — | AU; 05-04_01 (re-read rev 2.1) |

- Mates with: Gangfeder (Viereck, horn); Auslösestein.
- CAD notes:
  - **Overlap.** The Goldfeder–stone radial overlap is **0.08**: stone tip r 1.71 against the acting corner at r 1.630 (§5.3 unlocking setting, rev 2.1). It is very sensitive; set it at assembly. The "≈0.02" of IE §5 belongs to the superseded construction.
  - **Passing-spring loss (rev 2.1).** On every return swing the discharge stone bends the blade away from the horn. The stored spring energy is lost when the stone slips off the tip.
    - **Deflection.** On the return the stone meets the blade's horn-side face, 0.15 behind its wheel-side face. It must lift that face clear of its circle before it can pass the tip: δ ≈ √(1.71² − 1.629²) + 0.10 = 0.62.
    - **Free length.** Bend point → tip, L ≈ 8.6 on the 05-04_01 layout ("Biegungspunkt der Goldfeder"); up to 14.2 if the blade is free from its pin.
    - **Cost at 0.15.** For the drawn 0.15 gold (E ≈ 95 GPa) the loss is 5–24 µJ per oscillation, 23 % to all of the 12–23 µJ supply. It exceeds 5 % of the middle-efficiency impulse (0.85 µJ) at every possible L.
    - **Hence the 0.045 free blade** (table above). The worst case is then ≤ 0.65 µJ, and the bending stress at δ 0.62 is ≤ 54 N/mm², far below the yield of hard 333 gold. Passing springs are normally this thin. 0.05 would give 0.90 µJ (REJ).
    - **Unlocking is not affected.** The stone pushes the 0.12 overhang toward the horn. Under the ≈7.5 mN unlocking force (detent spring plus locking friction) the overhang deflects by about 0.00001, so the push moves the detent (closure.py).
    - Measure δ and L in the CAD sweep (§8 C1) and record them. If L proves much longer than 8.6, a thicker blade may be acceptable; recompute in `closure.py`.
  - **Lubrication:** the Goldfeder, horn and discharge stone run **dry** (§6, lubrication chart).

#### Gangfederkloben (detent block) — 05 04 01-4

- Source sheet(s): `05-04/Wempe_05-04_03.jpg` (1943); outline in `05-04/Wempe_05-04_01.jpg` (1941 layout)
- Material/stock: blank on the sheet; brass Ms58 (T4, as the cocks)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Fixing screw | M1.7 tapped "1,3 tief 3", screwed from the upper-plate outer face through **plate hole 13** (bohren 1.8) | T1 | 05-04_03; AF row 13; RD |
| Block footprint (drawn) | 14.6 (long axis) × 7.5 (3.75 each side of the screw); screw 7.3 +0.04 from the detent end face | T1 | "14,6", "7,3 +0,04", "3,75" |
| Long-axis bearing | **68.00°** (perpendicular to the detent); 001 measures 69.5° | T1 + T3 | C; IP |
| Detent end face (foot seat, "90° ±0,5°") | 6.07 from the hole-13 axis toward bearing 248.00° — **OVERRIDDEN (drawn: 7.3 +0.04)**. This is how the foot outline absorbs the 1.2 mm hole-13 offset (RD) | T4 | C: hole 13 lies 6.40 off the detent axis; minus the 0.33 half-foot thickness |
| Detent M1 screw | In the end face, axis along the long axis, at the detent foot station: 0.27 off the face centre toward the horn — **OVERRIDDEN (drawn: centred, 3.75)** | T4 | C |
| Far end | 7.30 from the screw. Block length 13.37 — **OVERRIDDEN (drawn: 14.6)** | T4 | C |
| Steady pins (rev 2.1) | 2 × ⌀0.9 at ±5.0 along the long axis from the screw (hole 13), ±2.0 across, on opposite sides ("2,3", "12,3", "2" on the 14.6 block = ±5.0 about its centred screw). Pins ⌀0.9 m6 × 3.0, pressed 1.7 into the block and projecting **1.3** into the plate (the WN-203 convention). Plate holes **G1 (38.263; −12.351)**, +5.0 along the axis toward the far end and 2.0 toward bearing 338°, and **G2 (30.808; −20.125)**, −5.0 toward the detent end (1.07 from the end face) and 2.0 toward 158°: ⌀0.9 H7, blind 1.6 deep from the inner face (Table O-1). The other pairing is rejected: it puts G1 1.74 from jig hole 12, inside that hole's ⌀3.50. The bench may instead spot-drill the plate through the block after positioning it on hole 13 and the detent layout. **OVERRIDDEN (rev 2: no plate holes; "drill at assembly")** | T1 (sheet) / T4 (pairing, depth) | 05-04_03; IP; closure.py `review` |
| Banking arm | 3 wide, rising from the block parallel to the detent; overall 25 from the block's far edge; M1.2 banking screw **18.8 ±0.03** from the M1.7 axis, 7 from the arm end; clamping slit 0.3 | T1 | "3", "25", "17,5", "15", "7", "M1,2", "18,8 ±0,03", "0,3" |
| Other drawn values | "1,4 +0,1", "3r", "0,9", "0,4", "2", "2,8", "12,3", side view "3", "2,3 +0,02", "6,5 +0,05" | T1 (verbatim) | AU |
| Axial (T4) | Hangs from the upper-plate inner face: block Z 12.50 → 19.00 ("6,5 +0,05" read as the axial height); detent M1 axis at Z 15.88 — **OVERRIDDEN (drawn: "2,3 +0,02" from a face, datum not established)**; banking arm Z 14.88 → 17.88 | T4 | C; IA could not isolate the Kloben |
| Footprint as built (13.37 × 7.5, long axis 68.00°; governs, and §2.4 repeats it) | Corners: far end (33.794; −8.064), (40.748; −10.874); detent end (28.785; −20.461), (35.739; −23.271). The unmodified 14.6 block of IP is superseded | T4 | C |

- Mates with: upper plate (hole 13, M1.7); Gangfeder foot (M1, pins); banking screw.
- CAD notes:
  - The Kloben screw sits on hole 13, while the stone and horn stay at their layout positions (RD).
  - Only the end face and the M1 station move: by 1.23 across the detent and 0.27 along it.
  - Plan clearance to the escape wheel is about 9.7 (IP).

#### Banking screw and detent screws (WN parts, no sheets)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Banking screw | M1.2 slotted, axis perpendicular to the detent (along the Kloben long axis), passing the Röhrchen station; it sets the locking depth (0.20). "12°" is drawn at its pointed end (meaning unresolved) | T1 (M1.2) / T3 | 05-04_03; 05-04_01; IE §4 |
| Kloben screw | M1.7 slotted cheese-head, from the plate's outer face | T1 thread / T4 head | 05-04_03; RD §4 |
| Detent foot screw | M1 slotted cheese-head | T1 thread / T4 head | 05-04_03 side view |
| Goldfeder pin | ⌀0.7 steel pin, in the 0.7 +0.05 hole | T4 | 05-04_02 |

---

### 5.4 Rollers and stones

**Escapement timing (balance B-angles converted to the layout, T3 ±2°).** At the drawn instant the impulse stone points at α_B = 151.6° and the discharge stone at 230.4°. Here α_B is measured about B, CCW from the W→B direction; plan bearing = 105.56° + α_B. The impulse arc runs from α_B 162.8° to 202.7°.

| Quantity | Value | Tier | Source |
|---|---|---|---|
| Phasing, impulse vs discharge stone | **79°**; the discharge stone leads in the impulse direction (CCW from the back) | T3 | IE §5 |
| Unlocking arc (balance) | **11°** (11.2°) | T2 | IE §5 |
| Wheel angle budget per tooth | **24° = 1.5° drop onto the stone + 21° impulse + 1.5° drop to locking** (printed "24°", "21°", "1° 1/2", arcs centred on W, R 15.5) | T3 | IE §5; AU |
| Balance impulse arc | ≤ 40° | T2 | IE §5 |
| Tip-circle / roller-circle penetration | **0.39** = 3.39 + 7.00 − 10.00 | T1 | IE §2; RD "locking penetration 0,39" |
| Unlocking precedes impulse | By 2.5° ≈ **0.15** at the roller | T2/T3 | IE §5; RD |
| Roller window | 24° − 21.65° = **2.35°** | T1 | RD; CL |

#### Heberolle (impulse roller) — 02 04 02 (sheet number "020402")

- Source sheet(s): `05-04/Wempe_05-04_06.jpg`; layout `05-04/Wempe_05-04_01.jpg`
- Material/stock: "Kupfer Beryllium"; stone "Saphir"

| Feature | Value | Tier | Source |
|---|---|---|---|
| OD | **⌀6.78 ±0.01** | T1 | 05-04_06; 05-04_01 "Heberolle ϕ 6,78" |
| Thickness | 1.6 +0.1 (Z 17.10 → 18.70) | T1 | "1,6 +0,1"; staff 4.1 below the Unruhauflage |
| Bore | 1.65 −0.03 at the top face → 1.627 at the bottom face, "Kegel 1:70 aufreiben" | T1 | 05-04_06 |
| Stone slot | 0.5 wide (tangential), radial; stone inner end 1.55 from the axis | T1 | "0,5", "1,55" |
| Cut-out (crescent) | Arc R 3.5 ("3,5r"); centre ≈5.6 from B on the stone side; floor ≈0.95 below the periphery at the stone; spans 61.5° about B, with the stone 25.3° from its leading end | T1 (R) / T3 | IE §5; "3,5", "2" |
| Poise hole | ⌀1.3 at 1.9 from the axis, opposite the stone, 0.7 lateral offset | T1 | "1,3", "1,9", "0,7" |
| Runout | 0.005 | T1 | "0,005" |

- Mates with: staff impulse seat (1.65 −0.02, 1:70); Hebestein; Gangrad teeth.
- CAD notes: press the roller from below; the large end of the bore goes up. This is the hand note "Rolle ? ?".

#### Hebestein (impulse stone)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Size | 0.5 tangential × **1.7 axial** ("Hebesteinbreite 1,7") × ≈1.9 radial | T1 / T3 | 05-04_06, 05-04_01 |
| Position | r 1.55 → 3.39 (tip flush with the roller periphery, 3.39–3.41); near-radial faces | T1/T3 | IE §5 |
| Z | 17.00 → 18.70 (0.1 proud of the roller's lower face) | T3 | 05-04_06 side view "1,7" |
| Setting | "Saphir eingelackt" (shellac) | T1 | 05-04_06 |

#### Auslöserolle (discharge roller) — no sheet

- Source sheet(s): `05-04/Wempe_05-04_01.jpg` (dashed outline)
- Material/stock: steel, hardened (T4)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Body | D-shaped: radius **1.37**, flat at ≈1.0 from the axis | T3 | IE §5 |
| Thickness / Z | 1.6 (Z 15.50 → 17.10), directly below the Heberolle | T3/T4 | IE §6; IA 15.24 → 16.97 |
| Bore | 1.25 (pressed on the staff's 1.25 −0.02 body, T4) | T4 | C (05-03_3-2 draws 1.25 there) |
| Phase | Auslösestein 79° ahead of the Hebestein in the CCW (impulse) sense | T3 | IE §5 |

#### Auslösestein (discharge stone)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Width (axial) | **1.7** ("Auslösesteinbreite 1,7") | T1 | 05-04_01 |
| Tip radius | **1.71 (adopted, rev 2)**; 1.65 scaled; protrusion ≈0.34 beyond the body | T2 | IE §5; §5.3 unlocking setting |
| Tangential width | 0.4–0.5 | T3 | IE §5 |
| Z | 15.50 → 17.20 (centred on the roller, 0.05 proud each face) | T4 | C |

---

### 5.5 Balance staff

#### Unruhwelle kpl. (balance staff) — 05-03_3-2 (sheet "050401", 1965)

- Source sheet(s): `05-03/Wempe_05-03_3-2.jpg`. Seat fits only from `05-04/Wempe_05-04_04.jpg` (05 04 02, 1946 pre-form) and `05-04/Wempe_05-04_05.jpg`.
- Material/stock: steel, hardened, "210° anlassen", "poliert" (05-03_3-2)

**Axial placement (T1 chain, C).** Arm top at Z 23.95 (RD), minus arm thickness 1.15, puts the Unruhauflage at **Z 22.80**. Then:
- lower tip Z 22.80 − 12.6 = **10.20**;
- upper tip Z 22.80 + 13.0 = **35.80**;
- jewel span 25.65 (RD), endstone faces Z 10.20 / 35.85 (staff resting on the lower endstone; in service, dial up, it rests on the upper diamond endstone, with its tips at 10.25 / 35.85).

Check: the Heberolle top lands at Z 18.70, which is exactly IA's section value.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Overall | **25.6 −0.02** (= 13.0 + 12.6) | T1 | RD; "Länge der Unruhwelle 25,6" (05-03_1) |
| Lower pivot | ⌀**0.21**, cylindrical 0.4 (Z 10.20 → 10.60), then a curved cone ("6ϕ" call-out unresolved) to ⌀1.25 at 2.0 from the end (Z 12.20); "in Lagerstein einpassen", polished | T1 | 05-03_3-2 detail |
| Lower body | ⌀1.25 −0.02, Z 12.20 → 17.10 (end of the 6.9 zone); discharge-roller seat Z 15.50 → 17.10 | T1 / T4 seat | "6,9", "1,25ϕ -0,02" |
| Impulse-roller seat | ⌀1.65 −0.02, Kegel 1:70, 1.6 long, Z 17.10 → 18.70 | T1 | "1,6", "1,65ϕ -0,02", "1:70"; 05-04_04 "1,65ϕ s6 +0,022/+0,015" |
| Roller shoulder | Z 18.70, **4.1 −0.05** below the Unruhauflage | T1 | "4,1 -0,05"; 05-04_01 "4,1 bis Unruhauflage" |
| Body below the brass collet | ⌀2.63 −0.06, Z 18.70 → 21.00; its upper end (Z 21.00) is the shoulder the brass collet is pressed down onto | T3 | 05-04_04 "2,63ϕ -0,06" (seat geometry) |
| Collet seat, inside the brass collet (rev 2.1) | Z 21.00 → 22.80. It continues the collet-zone 1:70 taper downward, ⌀1.676 at Z 21.00 → ⌀1.650 at Z 22.80 (−0.02). The Unruhauflage-Futter 05 04 02-2 is pressed onto it, 1:70 bore, down to the 21.00 shoulder. Rev 2 left this zone undefined | T4 (taper continued) / T1 (1:70) | 05-04_04 "Kegel 1:70" |
| Unruhauflage (arm seat) | Z 22.80, 13.0 below the upper tip. **In this build it is the top face of the brass collet's flange** (05 04 02-2, below); the staff has no flange of its own. The 1965 sheet's integral flange and its "2,40" collar are replaced by the 1946 brass collet, because the balance arm (05-03_4) is bored 2 H7 for that collet's 2 h6 spigot | T1 (13.0) / T4 (decision, §7 #50) | 05-03_3-2 "13,0"; 05-04_04 |
| Collar above the flange | "2,40ϕ -0,02" (1965). **Not used**: the arm seats on the 05-04_04 spigot 2 h6 (see 5.12) | — | AU |
| Collet zone | ⌀1.65 −0.02 (Kegel 1:70 per the collet bore), Z 22.80 → 28.90 ("6,1") | T1 | 05-03_3-2 |
| Upper zone | Z 28.90 → 35.80 ("6,9"): Kegel 1:70 down to ⌀1.25 −0.02; upper pivot zone 2.0 (Z 33.80 → 35.80); pivot ⌀0.21 × 0.4 cylindrical (Z 35.40 → 35.80) | T1 | 05-03_3-2 |
| Arm fixing | "nach Bohrlehre 2x M1": tapped in the brass collet's flange at r 2.14 in this build (the 1965 sheet puts them in the staff's own flange) | T1 / T4 | 05-03_3-2; 05-03_4 |
| End-shake | 0.05 (span 25.65) | T1/T4 | RD; CL |

- Mates with: balance jewels (5.10); Heberolle; Auslöserolle; Unruhauflage collet and arm; Spiralrolle.
- CAD notes:
  - 05-04_04 (14.03 lower length) is a pre-form between centres. Do not use its lengths (superseded staff family ≈14).
  - The staff passes through upper-plate hole 23 (⌀10.0). The brass collet's ⌀6.3 flange (Z 22.10 → 22.80) lies inside that hole.

#### Unruhauflage-Futter (brass staff collet, arm seat) — 05 04 02-2 (no own sheet; drawn on 05-04_04)

- Source sheet(s): `05-04/Wempe_05-04_04.jpg`, `05-03/Wempe_05-03_3-2.jpg`
- Material/stock: "Ms." (brass)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Flange | ⌀6.3 −0.1 × 0.7 (Z 22.10 → 22.80); top face = Unruhauflage | T1 (⌀) / T3 | 05-04_04 "6,3ϕ -0,1", "1,8" |
| Arm spigot | ⌀2.00 h6 −0.007 × 1.1 (Z 22.80 → 23.90; 0.05 below the arm top) | T1 / T3 | "2ϕ h6 -0,007", "1,1" |
| Lower hub | ⌀2.63 × 1.1 (Z 21.00 → 22.10) | T3 | "1,1", "2,63" |
| Bore | Kegel 1:70 on the staff | T1 | 05-04_04 |
| Arm screws | 2 × M1 tapped at r 2.14 on the arm axis ("nach Bohrlehre") | T1 | 05-03_3-2; 05-03_4 "2,14 +0,02" |

---

### 5.6 Balance rim and arm

#### Unruhreifen (balance rim with arm) — 05 03 01-1

- Source sheet(s): `05-03/Wempe_05-03_4.jpg` (2:1); assembly `05-03/Wempe_05-03_2.jpg`, `05-03/Wempe_05-03_1.jpg`
- Material/stock: "Nickelstahl Sonderlegierung u. Messing". This is a Guillaume rim: Ni-steel inner layer, brass outer layer.
- **Material and manufacture (rev 2.1, T4).** The sheet names the alloy only as a "special nickel steel", and compensation depends on it, so specify it by behaviour:
  - **Alloy.** A Guillaume integral-balance nickel steel, about 42–45 % Ni with small Cr/Mn additions (T4; confirm with the supplier).
  - **Certificate.** The supplier certifies its expansion coefficient α(T) over 0–40 °C. That α, with the brass layer, must compensate the hardened carbon-steel hairspring, including Guillaume's second-order term (§8 B7). An alloy without a certificate leaves the ±18° of weight travel (§5.11) with no known starting point.
  - **Bimetal.** Fuse the brass onto the Ni-steel ring in full contact over the 3.8 height: cast on, or furnace-brazed. Then turn to the drawn diameters. A pressed or glued layer does not compensate.
  - **Stabilise.** Before making the two cuts, heat the turned rim to ≈ 120 °C several times and cool it slowly. Repeat after cutting, until the free ends stay within 0.01 of the true circle.
  - **Fallback.** If no certified alloy can be had, change the pair: a monometallic balance (e.g. Glucydur, same geometry) with a self-compensating hairspring (Nivarox type). Then recompute k, I and the weight mass in `closure.py`. Never fit a self-compensating spring to this rim (§5.11).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outer ⌀ (brass) | **32.32 −0.04** | T1 | 05-03_4 |
| Layer interface ⌀ | **31.29 −0.04** (brass 0.515 radial) | T1 | 05-03_4 |
| Inner ⌀ (Ni-steel) | **30.48 +0.04** (Ni-steel 0.405 radial) | T1 | 05-03_4 |
| Rim height | **3.8** (Z 22.80 → 26.60) | T1 | 05-03_4 |
| Cuts | 2 cuts, **1.5 +0.2** wide, at **90° to the arm** (planar radial cuts) | T1 | 05-03_4 |
| Arm | Ni-steel, integral with the inner layer, at the rim's lower face (Z 22.80 → 23.95); thickness **1.15 (governs, rev 2)**. A 1.5 arm (the AU reading) is excluded: with the arm top fixed at 23.95 by the hairspring stack, it would leave the rim 0.10 above the plate and drop the impulse stone 0.23 into the detent horn's plane (closure.py REJ) | T3 / T1 (closure) | RH ("1,15" read; drawn 1.16); closure.py |
| Arm "0,4" | Drawn beside the arm thickness; meaning unresolved (step) | — | AU |
| Arm plan | Width 3.2 at the rim, 4 mid-span, 6.5 at the hub; blended by "20r" arcs | T1 (widths) / T3 (blend) | 05-03_4; RH |
| Centre hole | **2 H7 +0.009** on the collet spigot 2 h6 (the section reads "18ϕ H7" = 1.8; see 5.12) | T1/T3 | 05-03_4 plan; 05-04_04 |
| Screw holes | 2 × ⌀1.0 (M1 clearance) at **2.14 +0.02** each side of the centre, on the arm axis | T1 | "2,14 +0,02", "1" |
| Körner | "8 Körner in 60 Teilung" (6° pitch). Ticks drawn in four sectors (11–47°, 131–168°, 191–227°, 312–354° from a cut) | T1 / T3 | 05-03_4; IE §8 |
| Weight holes (4, used) | **30° from each cut** (60° from the arm), both sides of each cut | T3 | IE §8 |
| Adjustment holes (4, spare) | One division (6°) from each weight hole. T4 choice: 24° from the cut (toward the free end) | T4 | IE §8 |
| "20°" (05-03_4 plan) | Construction line at 20° from a cut to a small circle outside the rim; meaning unresolved (possibly the first division) | — | sheet |
| Hole form | Radial hole ⌀0.9 (tap core), thread pitch **0.16** ("0,16 Steigung"), axis at **2.15** above the arm face (Z 24.95); nominal ≈1.0 × 0.16 (Werknorm WN-12) | T1 / T4 nominal | IE §8 |
| Rest orientation | "Die Zeitschrauben müssen in Ruhestellung die Richtung von 6-12 einnehmen". With 12 = N (the Auf-u-Ab dial) and 6 = S (seconds), the arm lies along bearings 90° / 270° at rest; cuts at 0° / 180°; weights at 30°, 150°, 210°, 330° | T1 note / T3 (12 = N) | 05-03_1; C |
| Mass (rim) | 1.662 g brass + 1.210 g Ni-steel, less two cuts (−3.04 %) | T2 | RH §6 |

- Mates with: Unruhauflage collet (2 H7/h6, 2 × M1); weights; timing screws.
- CAD notes:
  - Free rim ends are at the cuts.
  - The rim clears the upper-plate outer face (Z 22.35) by 0.45.
  - The rim clears the Minutentrieb back pivot tips (Z ≤ 22.0).

---

### 5.7 Compensation weights, timing nuts and screws (no part sheets)

#### Kompensationsgewicht (saddle weight, ×4) — 05 03 01-4

- Source sheet(s): none for the part; geometry from `05-03/Wempe_05-03_1.jpg` (boxed "6,35", "6≈") and `05-03/Wempe_05-03_2.jpg`
- Material/stock: brass, ρ 8.5 (assumed, T4)

| Feature | Value | Tier | Source |
|---|---|---|---|
| Diameter | **⌀6.35** | T1/T3 | 05-03_1 boxed "6,35" |
| Axis | Parallel to the balance axis, centred on r **15.6** | T3 | RH §6; IE §8 |
| Saddle slot | 0.95 wide × 3.8 deep, from the lower end; straddles the rim (rim 0.92 radial). Cut the slot to the rim arc (R 15.24 / 16.16), not straight | T3 / T4 | RH §6 |
| **Fitted mass** | **1.476 g each with the Phillips terminal curves (build default, rev 2)**; 1.525 g each with the drawn curves (historical option). Either way it is the one fitted parameter (R5) | T4 | closure.py; RD |
| Length | Make the weights **6.6 long** (≈1.56 g), then face them down on the timing machine (≈36 s/d per 0.01 mm of all four, ≈ −3 600 s/d per mm) until the rate is within ±60 s/d. Expect **≈6.24** (Phillips curves) or ≈6.45 (drawn curves), lower end flush with the rim's lower face. The drawn 6.0 gives 1.42 g. **OVERRIDDEN (drawn: 6.0)** | T4 / T3 (drawn 6.0) | RD; RH; closure.py |
| Clamp | WN-12 screw (≈1.0 × 0.16), radial through the weight into the rim hole at Z 24.95 | T4 | IE §8 |
| Positions | 4 used holes, 30° from each cut | T3 | 5.6 |

- Mates with: rim (slot, WN-12).
- CAD notes:
  - Do not use 1.16 g (superseded).
  - The weight top (Z 29.25) clears the cock (34.95). The inner edge at r 12.43 clears the hairspring (r ≤ 6.4).

#### Zeitschraube and Zeitmutter (timing screw and nut, ×2) — 05 03 01-2 / 05 03 01-3; WN-12 / WN-12a

The sheets do not show which of -2 and -3 is the screw and which is the nut.

- Source sheet(s): `05-03/Wempe_05-03_1.jpg`, `05-03/Wempe_05-03_2.jpg` (call-outs only)
- Material/stock: nut brass (assumed, T4); screw steel

| Feature | Value | Tier | Source |
|---|---|---|---|
| Location | Radial, at both arm ends (bearings 90° / 270° at rest), axis at Z 24.95 | T1 (arm ends) / T4 (Z) | 05-03_1 note; C |
| Nut | Cylinder ⌀**4.23** × **3.26** radial, centred at r **18.6** (r 16.97 → 20.23); threaded bore ≈1.0 × 0.16 | T3 / T4 thread | RD; RH §6 |
| Nut mass | 0.389 g (solid brass); 0.367 g with the bore | T2 | RH; C |
| Screw | Steel, ≈1.0 × 0.16, screwed into the arm end and rim; tip at r **20.97** (42.1 / 2 over both screws); 0.038 g | T3 / T4 | RH; 05-03_2 "42,1" |
| Z clearance | Nut lower edge Z 22.835, 0.485 above the upper plate | T4 | C |

- Mates with: arm end (thread); nut on the screw.
- CAD notes: the "6–12" note fixes the balance's rest angle (5.6).

---

### 5.8 Hairspring

#### Spiralfaden (helical hairspring) — 05 03 02-1 (sheets carry 127-556.04-021 / "020310")

- Source sheet(s): `05-03/Wempe_05-03_6.jpg` (blank), `05-03/Wempe_05-03_7.jpg` (terminal curve, 10:1), `05-03/Wempe_05-03_5.jpg` (Spiralfeder kompl.), `05-03/Wempe_05-03_1.jpg`
- Material/stock: "Bandstahl 0,52x0,285 poliert", "härten dunkelblau anlassen"; blank "Rohmaß 0,52 x 0,285 x 603"

| Feature | Value | Tier | Source |
|---|---|---|---|
| Strip | **0.52 axial × 0.285 radial** | T1 | 05-03_6, 05-03_7 |
| Coil | Outer ⌀**12.8** ±0.05, inner ⌀**12.23**, centreline R 6.2575 | T1 | 05-03_6 |
| Pitch | **0.73** (gap 0.21) | T1 | IE §7 |
| Hand | **LH helix, as drawn** ("15 Windungen links"). Moving +Z (collet → stud), the strip turns **clockwise viewed from the back** | T1 / C | 05-03_6 |
| Active length | **Build default (rev 2): ≈513.6** = ≈11.77 helical coils (462.86) + **2 Phillips terminal curves × 25.35** (see the T2 curve below). Drawn (historical): ≈504 (503.96) = 11.77 coils + 2 × 20.55. The strip needed for the Phillips curves (≈517 with the leads) is within the 603 blank | T2 / T1 | RD; RH §2; IE §7 |
| Cut note | "vorm biegen der Kurve auf 13 Umgänge -3,5 mm kürzen": 13 × 39.317 − 3.5 = **507.62** of strip = helix + both curves + leads | T1 | RH §2 |
| Leads | Collet lead 2.66 (curve 220° → drawn strip end ≈263°); stud lead ≈1.0 | T3 / T4 | RH §1–2 |
| Coil envelope (installed) | **9.5** over the strip edges: Z 24.70 → 34.20 ("95" = 9.5 on 05-03_5) | T1 / T3 | RD; 05-03_5 |
| Spring stack | Stud arm underside → upper strip top 3.15 + envelope 9.5 + lower strip bottom → collet bottom 0.75 = **13.4**. Stud arm on the cock top **Z 37.35** gives collet bottom **Z 23.95** (closes to 0.00 on the arm top) | T1 | RD; RH §5; CL |
| Lower curve plane | Z 24.70 → 25.22 (centre 24.96) | T1/C | RH §5 |
| Upper curve plane | Z 33.68 → 34.20 (centre 33.94) | T1/C | RH §5 |
| Helix centreline | Z 25.154 → 33.746: 11.77 coils × 0.73 = 8.592 rise | T3 | C |
| Curve-to-helix transition | Each curve leaves the coil **tangentially** at chart 0° (r′(0) = 0, on the R 6.2575 centreline circle). The envelope remainder 9.5 − (11.77 × 0.73 + 0.52) = **0.39** is taken as a rise of 0.194 at each junction. Model it as a linear ramp over the first 45° of each curve next to the helix; the rest of each curve is flat | T3 (remainder, unproven) / T4 (ramp) | RD; CL |
| Not to model | 15 turns / 11.5 high (blank on its former); 13 helical coils (L 552) | — | RD |
| Phillips | 1st condition **met** (x_G +0.082, OG at 88.43°); 2nd **not met** (y_G 3.002 vs R²/L 1.905, +58 %) | T1 (as drawn) | RH §3 |

**Terminal curve: 05-03_7 polar table, copied in full** (T1, bold series = inked inner edge).

The chart frame on the sheet: angles run **clockwise on the sheet**, with 0° at the bottom, 90° left, 180° top, 270° right. Centreline = inner edge + 0.1425 (half the strip thickness). The exact construction offsets along the normal; the radial approximation below changes the curve length by only −0.03 (RH §1).

| Chart φ (°) | Inner edge r | Centreline r |
|---|---|---|
| 0 | 6.12 | 6.2625 |
| 10 | 6.07 | 6.2125 |
| 20 | 6.01 | 6.1525 |
| 30 | 5.96 | 6.1025 |
| 40 | 5.90 | 6.0425 |
| 50 | 5.83 | 5.9725 |
| 60 | 5.78 | 5.9225 |
| 70 | 5.74 | 5.8825 |
| 80 | 5.72 | 5.8625 |
| 90 | 5.65 | 5.7925 |
| 100 | 5.59 | 5.7325 |
| 110 | 5.49 | 5.6325 |
| 120 | 5.34 | 5.4825 |
| 130 | 5.19 | 5.3325 |
| 140 | 5.01 | 5.1525 |
| 150 | 4.79 | 4.9325 |
| 160 | 4.54 | 4.6825 |
| 170 | 4.31 | 4.4525 |
| 180 | 4.11 | 4.2525 |
| 190 | 3.88 | 4.0225 |
| 200 | 3.69 | 3.8325 |
| 210 | 3.52 | 3.6625 |
| 220 | 3.41 | 3.5525 |
| 230 | 3.37 | 3.5125 |
| 240 | 3.37 | 3.5125 |
| 250 | 3.37 | 3.5125 |

Notes on the table:
- The 0° value 6.12 = 12.23 / 2.
- The 150° value "4,79" is marked (?) in AU.
- The centreline at 220° (3.55) equals the collet pin radius 3.5 −0.02 (05-03_8).
- The faint outer series on 05-03_7 is **not** the outer edge and has no known meaning. Do not model it.

**Attachment.**

| Item | Chart φ | r | Tier | Source |
|---|---|---|---|---|
| "220°" "Ansteckungspunkt" (boxed) | **220°** | centreline 3.5525 | T1 | 05-03_7 |
| Pin block (black block) centroid | **223.9°** | spans r 2.80 → 4.38 | T3 | RH §0 |
| Drawn strip end | ≈263° | 3.54 | T3 | RH §0 |
| Curve length 0 → 220° | 0 → 220° | 20.55 (centreline); 19.99 inner / 21.12 outer | T3 | RH §1 |
| Curve length 0 → 224° / 250° | 224° / 250° | 20.79 / 22.38 | T3 | RH §1 |
| 05-03_1 "unterer / oberer Ansteckungspunkt" | 15° / 20° (a 5° phase between the pinning points) | — | T1 (reading) | RH §4 |

**Drawn curve (historical record).** If the original is reproduced, both terminal curves use this table (RD). The upper (stud) curve is the lower curve mirrored: rotated 180° about a horizontal axis through the spring centre. This keeps the LH hand.

**Plan placement (C, from the LH hand), drawn curves.** Let θ_pin be the plan bearing of the collet pin and θ_stud that of the stud pinning point.
- **Lower (collet) curve:** bearing = θ_pin − 220° + φ (φ increases CCW from the back). The sheet is therefore this curve seen from the dial side.
- **Upper (stud) curve:** bearing = θ_stud + 220° − φ.
- **Closure:** θ_stud = θ_pin − (220 + 11.77 × 360 + 220) = θ_pin + 2.8° (mod 360). Both pinning points sit at nearly the same bearing. This agrees with 05-03_5, which draws the collet pin and the stud at the same place.
- **CAD choice (T3/T4):** θ_stud = **15.0°** (stud slot, see the Klötzchen below), so θ_pin = 12.2°. The collet is turned on the staff at assembly.

**Why the build default changes (rev 2).** The drawn curve meets Phillips' 1st condition but misses the 2nd by 58 % (centre of gravity 3.01 from the axis against the 1.91 required; reproduced independently in rev 2). A curve that far off makes the rate depend on amplitude. The fusee cannot remove that dependence: its torque still varies ±2.1 % over a day, and amplitude falls as the oil ages. The factory corrected it by hand at assembly. A new instrument should start from a theoretically correct curve and use hand correction only for the residual.

**Build default (rev 2): T2 Phillips curve at both ends.** From IE §7, T2:
- centreline r(θ) = 6.2575 − 2.7575·s(u^0.8668), with s(x) = 3x² − 2x³ and u = θ / 302.8°;
- end at 302.8°, r 3.50; L 25.35;
- both Phillips residuals are 0.

Inner edge every 10° (copied from IE), chart φ 0 → 300°:

| φ | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| r inner | 6.12 | 6.09 | 6.05 | 5.98 | 5.90 | 5.80 | 5.70 | 5.58 | 5.47 | 5.34 | 5.21 |

| φ | 110 | 120 | 130 | 140 | 150 | 160 | 170 | 180 | 190 | 200 |
|---|---|---|---|---|---|---|---|---|---|---|
| r inner | 5.08 | 4.95 | 4.82 | 4.69 | 4.56 | 4.43 | 4.30 | 4.18 | 4.07 | 3.96 |

| φ | 210 | 220 | 230 | 240 | 250 | 260 | 270 | 280 | 290 | 300 |
|---|---|---|---|---|---|---|---|---|---|---|
| r inner | 3.86 | 3.76 | 3.68 | 3.60 | 3.53 | 3.47 | 3.43 | 3.39 | 3.37 | 3.36 |

With this curve:
- the attachment moves to 302.8° on both ends. The stud end is eased from r 3.50 to **r 3.76 over its last 30°**, so the strip enters the stud's ⌀0.7 hole along its inner side (§5.9; rev 2.1, was r 3.66 over 15°). The easing changes the curve's Phillips residuals slightly; this has not been calculated, so confirm it in the isochronism trial (§8 T3) and correct by hand if needed;
- the active length becomes 462.86 + 2 × 25.35 = 513.6 (+1.9 %);
- the fitted weight mass becomes **1.476 g** each (≈6.24 long; closure.py);
- placement: θ_stud = θ_pin − (302.8 + 11.77 × 360 + 302.8) = θ_pin − 162.8° (mod 360). With θ_stud = 15.0°, **θ_pin = 177.8°**. The upper curve is the lower one mirrored, as for the drawn curve;
- form the curves on a curve former made from this table, then correct by hand on the timing machine (§5.11).

---

### 5.9 Spiralrolle and Klötzchen

#### Spiralrolle (hairspring collet) — 05 03 02-2

- Source sheet(s): `05-03/Wempe_05-03_8.jpg` (10:1)
- Material/stock: "Messingblech 3,5 Din 1751 Ms 58"

| Feature | Value | Tier | Source |
|---|---|---|---|
| Plan form | Tapered bar, **9.1 −0.2** long; width **3.8 −0.2** at the slotted end, **2.7 −0.2** at the pin end; both ends radiused | T1 | 05-03_8 |
| Height (axial) | **3.3** (Z 23.95 → 27.25) | T1 | "3,3" |
| Bore | **1.6 H7 +0.009** at the lower face → (1.55) at the upper face, "Kegel 1:70"; bore centre ≈4.7 from the slotted end | T1 / T3 | 05-03_8 |
| Slit | 0.2 +0.1 wide from the slotted end, stopping **0.1 +0.05** short of the bore | T1 | "0,2 +0,1", "0,1 +0,05" |
| Pin hole | At **3.5 −0.02** from the bore axis, across the width (90° to the bar axis, i.e. tangential): "0,7 bohren", reamed ⌀0.8 +0.01 "Kegel 1:90" → (0.77) | T1 | 05-03_8 |
| Pinning (rev 2.1) | The strip end lies **centred** in the hole (its 0.52 faces meet the wall where the chord is 0.75 ≥ 0.52), so its centreline is at r 3.50. The taper pin goes on the outer side: a 1:90 steel or brass pin ⌀0.8 → 0.77 with a flat filed along it, leaving a ≈0.25 D-section beside the strip. A round pin the size of the hole has no room for the strip. **OVERRIDDEN (rev 2: "taper pin ⌀0.8 → 0.77", no flat)** | T4 | closure.py `review` |
| Pin height | "Körner anbringen" **0.75 ±0.05** from the lower face. The strip's lower edge sits 0.75 above the collet bottom (RD Z 24.70) | T1 | 05-03_8; 05-03_5 |
| Pin bearing | θ_pin = **177.8°** with the Phillips curves (build default); 12.2° with the drawn curves (see 5.8) | T4 | C |

- Mates with: staff collet zone (1.65 −0.02, 1:70); hairspring inner end, pinned with a flatted taper pin ⌀0.8 → 0.77 beside the strip (see Pinning; T4 steel or brass); balance-arm top face (Z 23.95).
- CAD notes: orient the collet with the larger bore end (1.6) down.

#### Klötzchen (hairspring stud) — 05 03 02-3

- Source sheet(s): `05-03/Wempe_05-03_9.jpg` (5:1); cock slot on `05-08/Wempe_05-08_05.jpg`
- Material/stock: "Flachmessing 15x7 Din 1759 Ms 58"

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | L-shaped: horizontal arm lying on the cock top, vertical leg through the cock slot | T1 | 05-03_9 |
| Arm | **14.6 −0.2** long, **1.6 −0.2** thick (Z 37.35 → 38.95); width 2.5 −0.2 at the leg end, tapering to a point (tip 0.8r, "3,1 -0,2" at the tip end) | T1 | 05-03_9 |
| Fixing hole | **1.5 H7 +0.009**, **5 ±0.1** from the leg's outer face; "6,6 -0,2" from the hole to the taper. 05-03_5 writes "1,4ϕ" here | T1 | 05-03_9; RH §5 |
| Leg | **1.8 g6** (−0.003/−0.010) × 1.6 −0.2; length **6.1 −0.2** from the arm top: tip at Z **32.85** | T1 | 05-03_9; RH §5 |
| Leg position | In the cock's **1.8 H7** slot: slot bottom 3.4 from the balance axis, so the leg spans r 3.4 → 5.0 (centre r 4.2). The slot runs perpendicular to the cock axis (bearing 105.0°), on bearing **15.0°**. That assumes the 05-08_05 plan is viewed from the back; if it is viewed from the front, use 195.0° | T1 (slot) / T3 (bearing) | RH §4–5; 05-08_05 |
| Arm direction | Parallel to the cock axis, toward the cock foot; fixing hole 4.2 off the slot line, at the cock's 05-08_06 hole | T1/T3 | RH §5 |
| Spring hole | ⌀0.7, "Loch wird bei Montage der Spirale gebohrt"; 1.9 −0.2 from the leg end, at "98°" | T1 / T4 position | 05-03_9 |
| CAD spring hole (rev 2.1) | **⌀0.70 as drawn**, drilled tangentially with its centre at **r 3.85**, bearing θ_stud, Z 33.94. It spans r 3.50 → 4.20, leaving a 0.10 wall to the leg's inner face (r 3.40), so it does not break out. The strip (0.285 radial × 0.52 axial) lies against the hole's **inner** side with its centreline at **r 3.76**; there its 0.52 faces meet the wall at a 0.52 chord. A brass taper pin ⌀0.6 → 0.4, with a flat filed along it, goes on the outer side, in the 0.30 left beside the strip. **OVERRIDDEN (rev 2: ⌀0.60 at r 3.66 with a ⌀0.6 → 0.5 pin: only ≈0.16 is left beside the strip, so that pin cannot fit; rev 1: ⌀0.7 at r 3.55, which broke out 0.2)** | T4 | C; closure.py `review` |

- Mates with: cock top face Z 37.35 (arm); cock slot 1.8 H7 (leg); cock fixing screw (no item number; T4 M1.4 to suit the "1,4ϕ"); hairspring outer end (pinned, taper pin T4).
- CAD notes: the 05-03_9 note ("bei Montage gebohrt") leaves the final position to assembly. Drill it after the spring has been vibrated and its curves formed, where the formed upper curve meets the leg. The hole centre goes at r 3.85 (≥ 0.10 wall to the leg face) and Z 33.94, and the formed curve end must arrive at r 3.76 ±0.03. Cock fixing hole: 1.5 H7 (05-03_9 governs over the "1,4ϕ" of 05-03_5), with an M1.4 screw.

---

### 5.10 Jewels and settings (no sheets; T2/T4)

Bore rule: hole = pivot + 0.01–0.02 (T2). Settings are screwed chatons with 2 × M1.2 (RD §4, T4). Endstone spans: escape 22.83, balance 25.65 (RD).

**Working length (rev 2.1).** A hole jewel's straight bore must lie on the pivot's cylindrical part at both end-shake extremes, with margin. Otherwise the cone of the pivot enters a bore that has only 0.0075 radial clearance, and the staff binds.
- **Balance.** The pivots are drawn with only 0.4 of cylinder (05-03_3-2, T1). So each balance hole jewel has a **0.25 straight bore at its endstone end**, then a 90° oil sink to the staff-side face:
  - lower straight bore Z 10.25 → 10.50, against pivot cylinders 10.20 → 10.60 (dial down) and 10.25 → 10.65 (dial up);
  - upper straight bore 35.55 → 35.80, against 35.40 → 35.80 and 35.45 → 35.85;
  - that leaves 0.10 before the cone at the worst extreme.
- **Rejected.** A straight bore through the full 0.45 jewel let the cone 0.05–0.10 into it (rev 2; closure.py `review` REJ).
- **Escape.** The 0.5 cylinder in a 0.4 jewel already clears: no change.
- **Sink faces the staff.** The domed face of each hole jewel faces its endstone, so the oil is held in the jewel–endstone gap.

| Position | Pivot | Hole-jewel bore | Jewel OD × thickness | Endstone | Setting / seat | Z (hole jewel; endstone face) | Tier, source |
|---|---|---|---|---|---|---|---|
| Balance, upper (Unruhkloben oben 05 08 03-1) | 0.21 | **0.225** (0.22–0.23), straight 0.25 at the endstone end (35.55 → 35.80), oil sink below | ⌀2.0 × 0.45 | Diamond ("Diamantdecke", 05-03_1), ⌀2.2 × 0.35 | Chaton **⌀5.2** in the cock seat **5.2 H7 +0.012**; 2 × M1.2 at "3,5 +0,05" | 35.35 → 35.80; endstone 35.85 → 36.20 (rev 2) | T2 bore / T1 seat / T4 rest; IE §9 |
| Balance, lower (Unruhkloben unten 05 08 00-2) | 0.21 | **0.225**, straight 0.25 at the endstone end (10.25 → 10.50), oil sink above | ⌀2.0 × 0.45 | ⌀2.2 × 0.35 in a screwed cap | Chaton ⌀5.2 in **5.2 H7** within a **0.5 +0.03** recess; 2 × M1.2 at "3,5 +0,1 (a)" | 10.25 → 10.70; endstone 9.85 → 10.20 (rev 2) | as above; AF 05-08_00-2 |
| Escape, upper (upper plate, hole 26) | 0.24 | **0.255** (0.25–0.26) | ⌀2.0 × 0.40 | ⌀2.0 × 0.30 | Chaton: flange ⌀5.2 × 0.5 in the **5.2 H7 × 0.5 +0.03** seat on the plate's outer face (Z 21.85 → 22.35); body ⌀4.5 h6 into the **4.5 H7** through-bore down to Z 20.30; 2 × M1.2 at "3,5 +0,05" | 20.38 → 20.78; endstone 20.83 → 21.13 (rev 2) | T1 seat (AF P-Q) / T4 |
| Escape, lower (lower plate, hole 26) | 0.24 | **0.255** | Pressed jewel **⌀2.50** (bore 2.50 ±0.009) × 0.40 | ⌀2.0 × 0.30, set in the end of a **screwed cap**: flange ⌀5.2 × 0.5 on the dial face, 2 × M1.2 at 3.5; spigot ⌀2.50 g6 up the bore (removable for oiling) | Plate bore **2.50 ±0.009** (bohren 2.3) | −1.95 → −1.55; endstone face −2.00 (endstone −2.30 → −2.00) (rev 2) | T1 bore / T4 stack |

- Mates with: staff and arbor pivots; cocks and plates (frame section).
- CAD notes:
  - The upper-plate table row 26 reads "25 +0,009 (sic, = 2,5)". The P-Q recess (4.5 H7 through, 5.2 H7 seat) governs; the 2.5 is probably a pre-bore.
  - Recess depth from the balance-cock layout is 1.35 ±0.3 (IE). The positions above follow from the staff placement in 5.5.

---

### 5.11 Timing and adjustment

**Target.** Beat 80/10 × 15 × 2 × 60 = **14 400 vph**, so the balance runs at **f = 2.000 Hz** and ω² = (2π·2)² = **157.91 s⁻²** (T1, CL).

**Hairspring stiffness.** k = E·b·h³ / (12·L), with:
- E = **205 GPa** = 205 000 N/mm² (T2; band 195–210);
- b = 0.52 (axial width);
- h = 0.285 (radial thickness);
- L = **513.6** with the Phillips curves (build default), or 503.96 with the drawn curves.

This gives **k = 0.4005 N·mm/rad** (Phillips curves) or 0.4081 (drawn curves) (C, RH §6).

**Required inertia.** I_req = k / ω² = **2535.5 g·mm²** (Phillips curves) or 2584.0 (drawn curves) at E 205 GPa. With E 195–210 the drawn-curve value ranges 2458.0–2647.0 (RH §6).

**Inertia budget (RH §6, T2/T3; brass weights and nuts assumed).**

| Part | I (g·mm²) |
|---|---|
| Rim, brass + Ni-steel, less the cuts | 687.4 |
| Arm (Ni-steel, 1.15 thick) | 78.5 |
| 4 weights at the drawn ⌀6.35 × 6.0 (1.420 g each) | 1411.2 |
| 2 timing nuts + screws at r 18.6 | 290.0 |
| Staff, rollers, collet, spring / 3 | 12.7 |
| **Geometric total** | **2479.7**: 2.022 Hz with the Phillips curves, 2.042 Hz with the drawn curves |
| **With fitted weights** (lever 15.6² + 3.175²/2 = 248.4 per weight) | **1.476 g** each (Phillips) or **1.525 g** (drawn) → **f = 2.000 Hz** (CL) |

**Regulation (procedure, rev 2).**
1. **Vibrate the spring.** Before pinning, vibrate the hairspring against a master balance of the same inertia, counting against a 2 Hz reference, and choose the pinning point at the collet. Then pin, and form the curves.
2. **Coarse: weight mass.** Make the weights 6.6 long (heavy, slow). Face all four equally on the timing machine until the rate is within **±60 s/d** of the target: 0.01 mm off all four ≈ +36 s/d.
3. **Fine: timing nuts.** Turn both together so the poise is kept. One thread pitch (0.16, T4) out on both nuts adds 2 × 0.389 × 2 × 18.6 × 0.16 = 4.63 g·mm² = **−77 s/d**. A 1/16 turn (0.01 mm) is ≈ −4.8 s/d, and the travel is ±3 pitches = ±230 s/d.
4. **Poise.** Poise the balance statically with the spring off. At rest the timing screws point 6–12 (05-03_1 note).
5. **Do not chase zero.** A marine chronometer is **rated, not set**: the navigator logs its error and daily rate. Regulate to within ±2 s/d, then rate it.

**Temperature compensation (procedure).**
- **Materials stay as a set.** The Guillaume rim (Ni-steel inner layer + brass outer) compensates only with the hardened **carbon-steel** hairspring drawn (RD §3). Do not fit a self-compensating alloy spring (Nivarox type) with this rim; it would over-compensate by tens of s/d per 10 °C. If a modern spring is wanted, change to a monometallic balance as well.
- **Coarse compensation: weight position.** The "8 Körner in 60 Teilung" marks give drilling positions every **6°** in four 36° sectors, so each weight can move over about ±18°. Nearer the free end (the cut) gives more compensation. Start at 30° from each cut, as drawn.
- **Trial.** Rate at least 48 h each at **4 °C, 18 °C and 32 °C**, dial up, at constant amplitude.
  - Move all four weights by the same number of divisions to equalise the cold and hot rates.
  - The residual "middle-temperature error" of a Guillaume balance is small; record it.
- **Re-check after compensation.** The heavier fitted weights (1.48–1.53 g against the drawn 1.42) increase compensation slightly, so the factory's 30° position is a starting point, not a result.

**Isochronism (procedure).**
- **Build default: Phillips-correct terminal curves at both ends** (§5.8, T2), formed on a curve former. The drawn curve misses Phillips' 2nd condition by 58 % (y_G 3.00 vs R²/L 1.91) and is kept only as the historical record.
- **Trial.**
  - Measure the rate over the first 24 h after full wind, and over 24–48 h.
  - Also measure at deliberately reduced amplitude (let the movement run down to 48 h, or reduce the drive with a let-down set-up).
  - Correct by small hand bends of the outer curve, or by the stud pinning point ("bei Montage gebohrt").
- **Drive torque.** The drive torque at the fusee varies **±2.1 % over the daily winding window** (top 24 h) and ±5.4 % over the full 56 h (closure.py, on the sheet-20 spring model). Wind every 24 h at the same hour. The rev-1 figure of ±3.7 % was on the chain basis. The ±2.1 % holds only for a spring that meets the slope criterion of §3.1. A spring tilted within the ±8 % band would raise it to ±4.8 %.

**Amplitude (energy budget; verify by measurement).**
- **Supply.** The mean fusee torque is ≈340 N·mm, which gives **0.106 N·mm** at the escape wheel before losses (train 3 085.7 : 1).
  - The wheel delivers one impulse per oscillation (24° of wheel per period).
  - With train × escapement efficiency of 0.52 / 0.39 / 0.28, the balance receives **23 / 17 / 12 µJ per period**.
- **Demand.** Balance energy is ½·k·A²: 2.0 mJ at 180° and 3.1 mJ at 225°.
  - To hold **200°** the balance needs **Q ≈ 670 / 900 / 1 280** at those three efficiencies; for 225°, Q ≈ 850 / 1 140 / 1 620 (closure.py).
  - These are high Q values but within reach of a large, heavy, dial-up chronometer balance on jewelled pivots, provided the pivots are polished and correctly oiled and the endstones are clean.
  - **Passing-spring loss (rev 2.1).** At the drawn 0.15 thickness, the Goldfeder would take 5–24 µJ of the supply on each return swing (§5.3). Its free blade is therefore thinned to 0.045, which brings the loss to ≤ 0.65 µJ. Confirm δ and L in the sweep.
  - **Dry escapement.** Keep the escapement dry (§6, lubrication chart). Oil on the stones or the Goldfeder makes the unlocking erratic.
- **Acceptance.**
  - Measure the amplitude on the timing machine at full wind and at 24 h.
  - A detent escapement needs the balance to swing well past its 51° of lift and unlocking. Aim for **≥ 200° at full wind** and **≥ 170° after 24 h**.
  - If it is low, look first at the escape-wheel and balance pivots (a 0.24 / 0.21 pivot shows friction quickly), the Goldfeder/unlocking setting, train depthing, and the spring's torque against its acceptance curve. Only then consider a stronger spring, which must stay within the stress limit.

**Rating for navigation (acceptance trial, recommended).** The useful property is a **constant** daily rate; its value only has to be known. One second of clock error is ≈ 0.25 nautical mile of longitude at the equator. Recommended targets for this instrument, to be replaced by the trial standard you are working to:
- **Rate stability:** daily-rate variation **≤ 0.5 s/d** day to day over 14 days at constant temperature, dial up in the gimbals.
- **Temperature:** after compensation, rate change **≤ 2 s/d** between 4 °C and 32 °C (≈ 0.07 s/d per °C).
- **Isochronism:** rate difference between the first and second 24 h after winding **≤ 0.5 s/d**.
- **Recovery:** after the temperature trial, the rate returns to within 0.5 s/d of its starting value.

Run the trial in the case and gimbals (`Federchronometer05_Case_Gimbal.md`), never loose on a bench. The balance and escapement are adjusted dial up only, which is why the gimbal is essential at sea.

**Escapement checks (model and movement must reproduce these).**

| Check | Target | Tier | Source |
|---|---|---|---|
| Wheel arc inside the impulse-roller circle | 21.65° < 24° pitch, window **2.35°** (⌀15 would give 30.38°, impossible) | T1 | RD; CL |
| Roller / tip-circle penetration | **0.39** (RD "locking penetration 0,39") | T1 | RD; IE §2 |
| Locking depth on the Ruhestein | 0.20 (stone edge r 6.80 vs tip 7.00), set by the banking screw | T3 | IE §4 |
| Unlocking precedes impulse | **0.15** at the roller (2.5°) | T2/T3 | RD; IE §5 |
| Unlocking arc | 11° | T2 | IE §5 |
| Stone phasing | 79° | T3 | IE §5 |
| Wheel budget | 24° = 1.5 + 21 + 1.5 | T3 | IE §5 |
| **Unlocking lift (rev 2.1)** | Goldfeder acting corner at **r 1.630 ±0.005** from B, **0.05 ±0.02 to the wheel side of the B-parallel line** (bearing ≈336°); discharge stone tip at r 1.71. Lift along the detent's true motion is **0.485 nominal, ≥ 0.425 worst case** (incl. 0.0075 side-shake) against 0.384 needed. The rev-2 straight-horn setting at r 1.650 cannot release (REJ) | T2 | closure.py `review`; §5.3 |
| Passing-spring loss (rev 2.1) | ≤ 0.85 µJ per oscillation (5 % of the middle-efficiency impulse): free blade thinned to 0.045 gives ≤ 0.65 | T2 | closure.py `review`; §5.3 |
| Horn tip on the return swing (rev 2.1) | Outside the stone circle: Goldfeder overhang 0.12 ±0.01, horn tip r ≥ 1.735, 0.018 clear worst case | T2 | closure.py `review`; §5.3 |
| Hebestein coverage of the wheel rim | ≥ 95 % of the 1.40 rim at every end-shake extreme | T1/T4 | closure.py |
| Balance arm | 1.15 (a 1.5 arm puts the Hebestein into the horn's plane) | T1 closure | closure.py |
| Staff end-shake | 0.05 | T1/T4 | CL |
| Escape end-shake | 0.03 | T4 | CL |
| Hairspring stack | 37.35 − 13.4 = 23.95 = arm top (residual 0.00) | T1 | CL |

**Kinematic sweep (do this in CAD before cutting metal).** Animate one balance oscillation with the wheel under a small torque and check, in order:
1. the discharge stone meets the Goldfeder before the impulse stone reaches the wheel's tip circle (0.15 at the roller);
2. the locking stone clears the tooth by ≥ 0.05 at full lift;
3. the tooth drops 1.5° onto the impulse stone;
4. the next tooth drops 1.5° onto the locking stone after impulse;
5. on the return swing, the discharge stone passes the Goldfeder with the detent stationary, and never touches the horn (horn tip r ≥ 1.735);
6. (rev 2.1) record the unlocking lift along the true motion (≥ 0.384 at the Goldfeder corner). Also record the return-swing deflection δ and the Goldfeder free length L, and recompute the passing-spring loss against 0.85 µJ.

Repeat at both end-shake extremes and with the balance shifted 0.0075 radially.

---

### 5.12 Points that were open between sources: all closed in rev 2

1. **"Locking penetration 0.39" vs locking depth 0.20:** both are used, for different things (§5.11).
2. **Horn-tip position:** Goldfeder acting corner at r 1.630 ±0.005, 0.05 ±0.02 to the wheel side of the B-parallel line, on a set-over horn (rev 2.1, §5.3; rev 2's r 1.650 failed the true-motion check).
3. **Gangrad bore:** 1.8 H7 on the Butzen's 1.8 h6 (§7 #6).
4. **Gangrad thickness:** 1.40 rim, 0.80 web (§5.2).
5. **Gangtrieb leaf length:** 5 −0.2 (05-04_08, the part sheet).
6. **Balance-arm bore:** 2 H7 on the collet spigot 2 h6 (the plan and the mating spigot agree; "18ϕ" in the section is a misprint).
7. **Arm thickness:** 1.15 (§5.6).
8. **Weight length:** trimmed on the timing machine, ≈6.24 (Phillips) / 6.45 (drawn) (§5.7).
9. **Weight angles:** 30° from each cut, adjustable in 6° steps (§5.11).
10. **Collet pin height:** "0,75" is the strip's lower edge (05-03_5, adopted); the pin hole on 05-03_8 is drilled to suit.
11. **Stud:** hole ⌀0.7 (as drawn) centred at r 3.85, strip centreline r 3.76, flatted taper pin on the outer side (rev 2.1; rev 2's ⌀0.6 at r 3.66 left no room for the pin); cock fixing hole 1.5 H7; slot at bearing 15° (the cock plan is in the same back-view frame as the plate tables) (§5.9).
12. **Gangfederkloben axial arrangement:** the §5.3 Z values (M1 at 15.88, banking arm 14.88 → 17.88) govern.
13. **Escape-wheel rotation:** CW from the back, opposite to the Sekundenrad.

---

## 6. Movement assembly sequence and adjustment

This is the order a chronometer maker would follow. It is also a sensible CAD assembly order, with the mates named.

### Frame and power

1. **Lower plate on its back**, dial side up.
   - Fit the Zwischenbrücke (dial side, 2 screws + 2 steady pins on the table rows) with the front bushings and jewels of the third and fourth wheels.
   - Fit the escape lower jewel (pressed) and its screwed endstone cap.
2. Turn the plate inner face up. Insert the train arbors:
   - centre (Minutentrieb + Minutenrad; ⌀2.2 e8 journal in WN-302, 2.2 H7);
   - third (Zwischentrieb + Zwischenrad, running in the ⌀24.5 pocket);
   - fourth (Sekundentrieb + Sekundenrad);
   - escape (Gangtrieb + Gangrad).
3. **Fusee assembly** (Schnecke kompl., §3.6 step 2):
   - Vorreiber, Schneckenrad, Gegenfeder and Gegensperrad (with its two Sperrkegel and Sperrfeder);
   - body with the Schneckensperrad, then the Deckplatte and stop nose;
   - fit the arbor in the lower-plate hole 10 (⌀2.70, journal 2.68);
   - fit the Gegensperrkegel arbor in both holes 4 (it is captured when the upper plate closes).
4. **Barrel**:
   - mainspring (15 × 0.37 × 1385, torque-tested) in the family-B drum, inner eye on the core hook, outer end on the 45° hook at 7.85 above the floor;
   - fit the cover; the arbor seats on the ⌀4.5 hub bores.
5. **Parts that hang from the upper plate**, fitted to it before closing:
   - lower balance cock (Unruhkloben unten, Z 9–19);
   - Gangfederkloben with the detent (Gangfeder) and Goldfeder, screwed on hole 13 and located by its steady pins in G1/G2;
   - stop lever on S1, Stellfeder at S2, banking pins at 7 and S3 (B2), Drahtfeder post at 5.
   - **Pre-set the escapement now (rev 2.1).** The banking screw sits inside the frame, at Z 15–18 with a horizontal axis, and cannot be reached once the plates are closed. The keyhole tail of hole 23 lets you see the stone and horn, but not turn the screw. With the upper plate on its back:
     - set the banking screw so the Ruhestein's locking edge is at r 6.80 from the escape axis (hole 26). That is the 0.20 locking depth. Use a setting gauge located in holes 26 and 23;
     - set the horn and the Goldfeder's acting corner to r 1.630 ±0.005 from the balance axis (hole 23), 0.05 ±0.02 to the wheel side of the B-parallel line;
     - leave the horn tip 0.12 ±0.01 short of the corner, at r ≥ 1.735 (§5.3).

   Then fit the **pillars** (3 on R37) and close the **upper plate**: 6 pillar screws, M2.6. Pivots enter their upper bushings or jewels.
6. **Plate gap and end-shakes.** Before any of this, fit the plate gap: face the 19.67 pillars as a set until the bare frame measures 19.00 +0.01 (§2.3). Then set each bush and setting from the measured gap and arbor spans (§2.9, "Fitting the plate gap and the end-shakes"). Record the results in §8 B6.

   | Arbor | End-shake |
   |---|---|
   | Centre | 0.05 (0.03–0.08); WN-302 depth set from the measured gap |
   | Third | 0.02–0.05; Zwischenbrücke WN-300 depth |
   | Fourth | 0.03 (0.02–0.05); jewel-setting seat depth |
   | Fusee | 0.04 (0.02–0.05); 0.04–0.05 as drawn over the fitted gap, so face the Schneckenfutter spigot only if needed |
   | Escape | 0.03 (0.02–0.04); face the upper chaton flange (made 0.55) |
   | Balance | jewel span 25.65 = 0.05 (independent of the gap) |
   | Barrel arbor | 0.10 (22.35 frame span − 22.25 shoulders; ≥ 0.03 at the minimum gap) |
   | Stop lever | 0.05 |
   | Gegensperrkegel arbor | 0.03 |
   | Wechselrad hub / hour wheel | 0.05 / 0.14–0.24, against the actual dial seat |

7. **Upper-plate outer face.**
   - Fit the Schneckenfutter (3 × M1.4) and press the Staubfutter onto its ⌀8 r6 boss.
   - Fit the Federhausbrücke over the ⌀42.5 crescent cut-out, with the Sperrad (z16) on the arbor square and the Sperrkegel (row 46) and its spring. The click must lock **CW** arbor rotation.
8. **Band**, **crossed**: hook 05 07 03-2 into the fusee hook slot (⌀0.55 cross-pin); lead the band across to the drum's NE side; hook 05 07 03-3 into the barrel slot; wrap ≈5.4 turns by turning the drum CCW (§3.6 step 3).
9. **Set up the mainspring**: ¾ turn = 12 clicks, arbor CCW from the back (§3.6 step 4). Check the fusee torque at four wind states, and check the daily-window ratio T(8.76) / T(5.0) of 1.00–1.06.
10. **Stop-work phasing** (§3.6 step 5): wind to 8.761 turns and set the nose's stop face on the beak. Check the pass at 7.761 and the window 8.711 … 8.85.

### Escapement, balance and dial

11. **Escapement**:
    - the rollers (Heberolle + Auslöserolle) are on the balance staff, which enters from the back through the ⌀10 Unruh hole in the upper plate, with its lower pivot in the lower cock;
    - the locking depth (0.20) and the Goldfeder corner were pre-set in step 5. Check them now through the ⌀10 balance hole and its keyhole tail, under a magnifier (§8 B5);
    - if either needs adjusting, lift the upper plate off with the Kloben on it, adjust, and close again. Neither can be adjusted in situ;
    - check locking, unlocking and impulse against the kinematic sweep in §5.11;
    - the escapement runs **dry**: no oil on the stones, the Goldfeder, the horn or the escape teeth (lubrication chart below).
12. **Balance and hairspring**:
    - vibrate the spring, then fit the collet (Spiralrolle) on the staff, bottom on the balance-arm top at Z 23.95, collet pin at θ_pin 177.8° (Phillips curves);
    - upper balance cock (15 high) on the upper plate;
    - stud (Klötzchen) arm on the cock top (Z 37.35), leg through the 1.8 H7 slot;
    - form the curves. Drill the stud's ⌀0.7 hole centred at r 3.85 and pin the strip at r 3.76, with a flatted taper pin on the outer side. Pin the collet with the strip centred at r 3.50 and a flatted pin on the outer side (§5.9).
13. **Motion work, dial and hands** (dial side):
    - Viertelrohr (cannon pinion) friction-fitted on the centre arbor;
    - Wechselrad with Wechseltrieb on its stud (tip −10.15);
    - Stundenrad (with the ⌀5.0 Stundenrohr and its ⌀7.0 retaining collar) on the Viertelrohr;
    - Auf u. Abrad on its stud (Futter 05 08 02-2, tip −12.30), wheel at Z −9.40 → −8.37;
    - the Auf-u-Ab-Trieb on the fusee's lower end;
    - dial (front face Z −11.65); then check the Wechselrad-hub end-shake (0.05) and the hour-wheel float (0.14–0.24), and face the hub or collar if needed;
    - hands: Auf u. Ab (boss on the seat, at "0" with the fusee at full wind), seconds (on the Zeigerfutter), hour (seated on the step), minute (boss forward).
14. **Werkring** (movement ring) on the lower plate; the movement then goes into the case (`Federchronometer05_Case_Gimbal.md`):
    - fit the pot rebate so the Werkring flange stands 0.03–0.05 proud of the rim; the bezel bears on the flange only;
    - face the Korkring to 0.1–0.2 contact with the case floor;
    - with the bezel tightened, re-check the fusee end-shake (0.04) and that the balance swings freely;
    - never turn the bowl over with the bezel off: the bezel alone holds the movement.
15. **Regulate, compensate, adjust for isochronism and rate** (§5.11), in the case and gimbals.

### Timing (for a dynamic model)

| Target | How |
|---|---|
| Rate: balance 2.000 Hz | Phillips curves (L 513.6) with weights 1.476 g each, or the drawn curves (L 504) with 1.525 g. Fine regulation by the two timing nuts: moving the nuts out lowers the rate (−77 s/d per pitch) |
| Temperature | Move the weights in 6° steps on the Körner divisions (±18° per sector) |
| Isochronism | Phillips-correct curves as the default; hand correction on trial |
| Drive | Fusee torque 354 → 332 N·mm (±5.4 % over 56 h, ±2.1 % over the top 24 h, for a spring within the §3.1 slope limit) |
| Amplitude | Not predicted; it needs a balance Q ≈ 670–1 280 for 200° (§5.11). Measure it. Passing-spring loss ≤ 0.65 µJ with the 0.045 Goldfeder blade |
| Escapement checks | Roller window 2.35°; roller penetration 0.39; locking depth 0.20; unlocking lift along the true detent motion ≥ 0.425 at the Goldfeder (0.384 needed); unlocking precedes impulse by 0.15 mm |

### Lubrication (rev 2.1; T2 practice / T4 products)

The drawings give no oiling. This chart follows marine-chronometer practice. The named products are examples of the oil class; use any equivalent. Put each oil in its sink with an oiler, never on a cone, tooth or face. Apply an epilame to the jewel settings beforehand if you want the oil to stay put (optional, T4).

| Point | Lubricant | Amount / note |
|---|---|---|
| Balance pivots, upper (Diamantdecke) and lower | Fine watch oil (e.g. Moebius 9010) | A drop in the jewel–endstone gap that fills about half the endstone face by capillarity |
| Escape pivots, upper and lower | Fine watch oil (e.g. Moebius 9010) | As for the balance, before fitting the endstones |
| Fourth-wheel front jewel (Zwischenbrücke) | Fine watch oil | In the jewel's sink |
| Train bushes: centre (WN-301/302), third and fourth (WN-300) | Medium watch oil (e.g. Moebius 9020) | Fill the oil sink at each back-pivot tip (0.35 below the plate face) and at the front bearings |
| Fusee journals (plate hole 10, Schneckenfutter); barrel-arbor pivots (holes 45) and the drum and cover hubs on the arbor; Gegensperrkegel pivots (holes 4) | Synthetic clock oil (e.g. Moebius 8030) | A film; wipe off any surplus |
| Mainspring | Mainspring grease (e.g. Moebius 8200), thin film | A non-slipping fusee barrel needs no braking grease |
| Maintaining work: Sperrkegel pivots and Sperrfeder tips, Gegensperrkegel nose | Clock oil, trace | **Ratchet teeth dry** |
| Barrel click: Sperrkegel pivot screw at 46, click-spring tip | Clock oil, trace | **Sperrad teeth dry** |
| Stop-work: S1 shoulder, Stellfeder contact | Clock oil, trace | **Nose and beak faces dry** (hardened steel) |
| Steel band and fusee groove | Wipe with a cloth barely moistened with clock oil, as rust protection only (carbon-steel strip; a 1.4310 strip runs dry) | Never grease the groove: grease collects dirt and changes the riding radius |
| Motion work: Wechselrad and Auf-u-Ab studs, hour wheel on the Viertelrohr | Medium watch oil, trace | — |
| Viertelrohr friction (Körner groove) | Very light grease, trace | Only enough to keep the setting friction smooth |
| **Must stay dry** | — | Escape-wheel teeth, Ruhestein, Hebestein, Auslösestein, Goldfeder, horn and detent spring, rollers, all wheel and pinion teeth, the hairspring, the balance. Oil on any acting surface of the detent escapement makes unlocking erratic and the rate unstable |

**Service:** a full overhaul (clean, re-oil to this chart, inspect the band per §8 T6) about every 3 years, and re-rate afterwards.

### Operation at sea (rev 2.1)

Winding, carrying, shipping and rating are in `Federchronometer05_Case_Gimbal.md` §8.6. Movement-specific points:

- **It is not self-starting.** A detent escapement will not start by itself once the balance has stopped, for example after a full run-down or a stop with the balance stop. After winding, start it with one brisk twist of the bowl about its own axis, in the plane of the balance, then let the gimbal settle. The maintaining power (§3.4) keeps it running while it is being wound, so daily winding needs no restart.
- **Never force the key past the stop.** The stop-work is the only thing between the key and the groove end N (0.09 turn beyond full wind). The design load is a firm 500 N·mm over-turn (§3.5).
- **After any stop or full run-down:** wind, restart, and re-rate before relying on it (its daily rate will have shifted).
- **Magnetism:** the hairspring is hardened carbon steel. Keep the box away from loudspeakers, magnets, electric motors and compass correctors. If the rate jumps for no reason, have it demagnetised.
- **Temperature:** keep it in its box and out of direct sun. A rapid temperature change shows as a transient rate error until the rim has settled.

---

## 7. Decisions: one governing value for every point the drawings leave open (rev 2)

Every point that a section once listed as open (§2.11, §3.7, §4.8, §5.12) is decided here. "Rev 1" was the previous default; where rev 2 changes it, the reason is given. T4 unless stated.

| # | Point | Governing value (rev 2) | Why |
|---|---|---|---|
| 1 | Fusee body axial position: Z 5.91 (03-2) vs 6.49 (section) | **5.91** | Its recess floor then lands on the arbor collar start (8.61), and 8.61 + 9.9 = 18.51 is its small face: a T1 closure (closure.py IND) |
| 2 | Schneckenfutter bore "4,1" vs the 4.5 → 4.39 journal | **1:70 taper bore reamed to the journal: ⌀4.512 → 4.410** (mean = the "4,45 H7/g6" of 05-06_01) | Both the bore and the journal are drawn 1:70; rev 1's cylindrical 4.50 / 4.48 is withdrawn |
| 3 | Staubfutter base | **Pressed on the Futter's ⌀8 r6 boss; base 23.85, top 41.95** | The drawn H7/r6 pair, the ⌀13.1 body that cannot pass the ⌀13.2 flange, and the lug top meeting the Korkring (38.95 vs 39.11) |
| 4 | G-H recess face | **Outer face** | Drawings point to the outer face |
| 5 | Escape-wheel thickness and Z | **Rim 1.40, web 0.80, Z 17.00 → 18.40**; arbor tip −2.00, endstones −2.00 / 20.83 | 07-1 "1,4" and the 07-2 chain; section 1.45 ✓. Rev 1's 0.8 is withdrawn |
| 6 | Escape-wheel bore 1.8 vs 1.7 | **1.8 H7** on the Gangradbutzen h6 | The labelled fit is the mating value |
| 7 | Detent horn / Goldfeder tip (rev 2.1) | **Goldfeder acting corner at r 1.630 ±0.005 from B, 0.05 ±0.02 to the wheel side of the line through B parallel to the detent (bearing ≈336°), on a horn set over ≈0.9 toward B; horn tip 0.12 ±0.01 short of the corner, outside the stone circle (#46); discharge stone tip r 1.71** | The lift along the true detent motion is 0.485, ≥ 0.425 worst case, against 0.384 needed (closure.py `review`). The point is where 05-04_01's drawn instant puts the stone on the Goldfeder. Rev 2 (r 1.650 on a straight horn) is withdrawn: on the true motion the stone cannot release (REJ), and even on the B-parallel line r 1.650 gives only 0.33 worst case |
| 8 | Balance endstone recesses | **1.20 / 1.50** (faces 10.20 / 35.85) | Forced by the 23.95 collet seat and the 1.15 arm |
| 9 | Weight mass and length | **1.476 g (Phillips curves) / 1.525 g (drawn curves); make 6.6 long and face to rate** | One fitted parameter (R5), set on the timing machine |
| 10 | Stop-lever trim | **Withdrawn** with the rev-1 lever | New stop-work (#11) |
| 11 | Stop-work | **Bell-crank stop iron on S1 (−4.000; 20.000), pad cammed by the band, stop nose on the fusee small end, stop faces inclined 27°, banking pins 7 (rest) and B2 (engaged)** (§3.5) | The rev-1 lever had no free axial plane. The new one closes every check, is self-locking over the whole friction band, and is strength-checked at a 500 N·mm over-wind |
| 12 | Barrel square start inside the bridge bore | **0.47** | Detailed frame closure (§2) |
| 13 | Zwischenbrücke bush seats | **4.59 +0.012** for the bushes; **5.2 H7** for the fourth-wheel jewel | Same convention as the plates |
| 14 | Hour-wheel thickness | **1.05 −0.03** | Part sheet |
| 15 | Hour pipe / hand / dial stack | **Stundenrohr ⌀5.0 pipe to the step at −11.64 (⌀8.5 only as a boss behind the dial); hour hand seated on the step, blade −14.09 → −14.74** | Keeps the drawn 5.2, 8.2, 3.1 and ⌀6.0. Rev 1's "end 0.2 in front of the dial" is withdrawn |
| 16 | Auf-u-Ab hand boss ⌀4.4 vs dial hole ⌀3.2 | **Boss fully on the seat in front of the dial (−11.80 → −13.20); hub dial side 3.80** | Full 1.4 engagement instead of 0.55 |
| 17 | Auf-u-Ab hub plate side | **4.95** | Otherwise the hub enters the lower plate |
| 18 | Dial number | **05 02 00-4**, as printed | 05 02 00-1 is the minute hand |
| 19 | Barrel ratchet number | **05 07 00-3**, as printed | — |
| 20 | Fourth-wheel jewel height | **Keep the −5.13 chain**; set the jewel setting's seat depth to suit the measured plate gap (#44) | Shoulder span governs (R1) |
| 21 | Oberplatte N-O rebate 1.35 −0.05 | **Not modelled** | Nothing in the Feder movement needs it |
| 22 | Lower-plate hole 23 "7" | **⌀4.4 through; ignore the "7"** | No Feder part sits there |
| 23 | Band run | **Crossed (reverse fusee); drum CCW from the back** | Lower-cock clearance, the drawn click and the "5" barrel turns (§3.0) |
| 24 | Band strip | **0.8 × 0.08**, UTS ≥ 2 000, brazed with a 0.14 filler in the 0.22 slot | The crossed band is reverse-bent: Goodman safety 1.22 at 0.08 (0.22: 0.63; 0.10: < 1.2) |
| 25 | Barrel click sense | **Locks CW; set-up CCW** | As drawn on 001 |
| 26 | Fusee square and key | **3.1□ → 2.92□ across the flats**; Staubplatte with a square hole; the key tube bottoms on the Staubplatte (30.71) and engages 15.2 with 0.03 play | Read as □ on 05-06_15; the drawn 3.1□ key and its "19 +2" depth fit |
| 27 | Fusee wheel stack | **§2.8.3** (Vorreiber 0.07 → 3.17 … Deckplatte 18.51 → 19.31) | Closes; the section values did not |
| 28 | Gegensperrkegel arbor | **Full-length arbor in both holes 4; blade at 4.85 ("6,3" from the lower pivot tip)** | Uses both drawn holes and the drawn 6.3 |
| 29 | Drahtfeder | **Post screwed into hole 5, coil at the click plane** | "Drahtfedermitte" on 05-06_04 |
| 30 | Gangfederkloben | **§5.3 values** (axis 68.00°, block 13.37, M1 at Z 15.88) | One value set; §2.4 repeats it |
| 31 | Centre-arbor front bush WN-302 | **2.2 H7** | The journal is drawn ⌀2.2 e8 |
| 32 | Motion-work Z | **§4.3 chains** (Wechselrad −5.40 → −4.40, Stundenrad −7.49 → −6.44, Wechseltrieb −8.60 → −6.00, stud tip −10.15) | Keeps every drawn length |
| 33 | Auf-u-Ab stud | **One part (Futter 05 08 02-2), tip −12.30** | Drawn "12,3" |
| 34 | Balance arm | **1.15** | A 1.5 arm clashes (closure.py REJ) |
| 35 | Terminal curves | **Phillips-correct T2 curves at both ends (build default); drawn curve = historical record** | The drawn curve misses Phillips' 2nd condition by 58 % |
| 36 | Stud hole (rev 2.1) | **⌀0.7 (as drawn) centred at r 3.85, drilled at assembly; strip at r 3.76 on the inner side; flatted taper pin on the outer side** (#42) | No break-out (0.10 wall), and room for the pin. Rev 2's ⌀0.6 at r 3.66 left ≈0.16 beside the strip, too little for its ⌀0.6 → 0.5 pin |
| 37 | Mainspring | **Alloy spring, torque-tested to M = 427 + 61.9·n ±8 %, with slope M(5.0) / M(0) = 1.725 ±0.07** (rev 2.1, #45) | 2.1–2.2 GPa is at the carbon-steel limit; the fusee was drawn for that torque. The slope limit keeps the daily torque spread ≤ ±2.8 % |
| 38 | Escape lower endstone | **Screwed cap** | Removable for oiling |
| 39 | Seconds-hand boss | **Axial height ≤ 0.89**; "2.5" is a plan length | Clears the hour hand |
| 40 | Case, gimbal, balance stop | **`Federchronometer05_Case_Gimbal.md`** (separate spec). Its winding chain uses the rev-2 Staubfutter top 41.95 and the tube stop on the Staubplatte (30.71) (a031202). Case rev 2: the bezel stops on the Werkring flange only; the Korkring is faced to 0.1–0.2 contact; the transport lock is a spring plunger in a closed hole (it locks both gimbal axes); the Zeigerstellung wall hole is conditional, as here | The gimbal is essential at sea; the balance stop is needed for transport |
| 41 | Balance hole-jewel working length (rev 2.1) | **0.25 straight bore at the endstone end, then a 90° oil sink to the staff side** (lower 10.25 → 10.50, upper 35.55 → 35.80) | The 0.4 cylindrical pivots (T1) cover it at both end-shake extremes, with 0.10 before the cone. A full 0.45 bore lets the cone in and binds (REJ) |
| 42 | Hairspring pinning (rev 2.1) | **Stud: #36. Collet: strip centred in the ⌀0.8 → 0.77 hole at r 3.50, flatted 1:90 pin on the outer side (≈0.25 D-section)** | A pin as large as its hole leaves no room for the strip |
| 43 | Barrel cover fit (rev 2.1) | **5° dovetail snap fit**: drum seat undercut from ⌀39.2 s6 at the mouth to ≈ ⌀39.41 at the shoulder; cover edge ⌀39.2 r6 → ⌀39.39 | The two sheets' 5° marks and the 39.39 agree (IND, closure.py). Rev 2's "5° lead-in" left the 39.39 lip with nothing to snap into |
| 44 | Plate gap and end-shakes (rev 2.1) | **Pillars made 19.67 and faced as a set to a measured gap of 19.00 +0.01; then WN-302 and WN-300 pressed to a computed depth, the fourth-jewel seat set, and the upper escape chaton flange (made 0.55) faced to suit** (§2.3, §2.9). **OVERRIDDEN (drawn pillar 19.6 ±0.01)** | The drawn tolerances give a gap of 18.93–19.01. At 18.93 the nominal end-shakes bind by up to 0.05, and the parts hung from the upper plate lose clearance that bearing fitting cannot restore: Ruhestein over the wheel 0.00, stop lever over the band 0.07 (REJ) |
| 45 | Drive-torque acceptance (rev 2.1) | **Spring: M(5.0) / M(0) = 1.725 ±0.07. Fusee: T(8.76) / T(5.0) = 1.00–1.06**, measured at w = 0, 4.4, 5.0 and 8.76 | A tilt inside the ±8 % band would double the daily torque spread (closure.py `review`) |
| 46 | Goldfeder free blade and overhang (rev 2.1) | **Free blade thinned to 0.045 from the bend point to the tip, with 0.15 kept at the foot and the Viereck. It overhangs the horn tip by 0.12 ±0.01. OVERRIDDEN (drawn: 0.15; IE overhang 0–0.05)** | At 0.15 the return-swing loss is 5–24 µJ per oscillation, a large share of the 12–23 µJ supply. At 0.045 it is ≤ 0.65 µJ. With the IE overhang the horn tip lies inside the stone circle and the return swing would jam on the banked horn (REJ) |
| 47 | Lubrication (rev 2.1) | **§6 chart; the detent escapement runs dry** | The drawings give none; oil on detent surfaces makes the rate unstable |
| 48 | Balance rim material (rev 2.1) | **Certified Guillaume integral-balance nickel steel (≈42–45 % Ni, T4); brass fused on; stabilised before and after cutting.** Fallback: monometallic balance + self-compensating spring as a pair | Compensation depends on the alloy's α(T); the sheet names it only as "Sonderlegierung" |
| 49 | Hour-wheel retention (rev 2.1) | **Stundenrohr collar ⌀7.0 to −10.15, against the dial: float 0.14–0.24** | Without it the hour wheel could slide 1.4 dial-down onto the minute hand and partly out of mesh |
| 50 | Balance staff at the arm (rev 2.1) | **No integral staff flange. The 1946 brass collet 05 04 02-2 is pressed onto a 1:70 taper (⌀1.676 → 1.650, Z 21.00 → 22.80); its flange top is the Unruhauflage at 22.80** | The arm (05-03_4) is bored 2 H7 for that collet's 2 h6 spigot; rev 2 left the staff undefined under the collet |
| 51 | Escapement setting order (rev 2.1) | **Banking screw and Goldfeder pre-set on the open upper plate (§6 step 5), checked after closing** | The banking screw is inside the frame, so it cannot be reached when assembled |
| 52 | Operation (rev 2.1) | **§6 "Operation at sea"** plus the case spec §8.6 | A detent escapement is not self-starting; the stop-work is the only over-wind protection; the steel hairspring is magnetic |
| 53 | Gangfederkloben steady pins (rev 2.1) | **Plate holes G1 (38.263; −12.351) and G2 (30.808; −20.125), ⌀0.9 H7 blind 1.6, from the inner face** (Table O-1; ±5.0 along the 68.00° axis from hole 13, 2.0 across on opposite sides) | Rev 2 pinned the block into holes that did not exist. The other pairing would break into jig hole 12 |
| 54 | Legible but unexplained marks (rev 2.1) | **Not used:** "0,18 u.d.g." on the Gangfeder (1436); "0,04" (beside the detent's bending point) and "0,4" (near the Goldfeder) on 05-04_01; the "12°" at the pointed end of the banking screw (05-04_03 / 05-04_01) | Everything they might stand for is set elsewhere: Goldfeder corner (#7), 0.20 locking depth by the banking screw, Goldfeder overhang 0–0.05, detent and Goldfeder thicknesses. Listed in §8.4 E4 for the archive |

---

## 8. Still to do: verification that no document can settle

Every value in this spec closes on paper (`closure.py`). The items below can only be closed by a CAD motion study, a measurement or a trial. Do them in this order. Record each result here, with a date, and update this spec and `closure.py` if a value changes.

### 8.1 In CAD, before any metal is cut

| # | Task | How | Pass | If it fails |
|---|---|---|---|---|
| C1 | **Escapement kinematic sweep**, including the true unlocking lift | Animate one full balance oscillation (§5.11), wheel under a small torque. Run it at both end-shake extremes and with the balance shifted 0.0075 radially. Measure the lift at the Goldfeder corner **along the detent's actual motion** (≈68°, square to the detent axis). The 2D paper check in `closure.py` (`review`) gives 0.485 nominal and ≥ 0.425 worst case for the rev-2.1 corner (§5.3); this sweep is the 3D confirmation. Also record the return-swing deflection δ and the Goldfeder free length L | Lift ≥ 0.384 (0.334 + 0.05). Locking stone clear of the tooth by ≥ 0.05 at full lift. Unlocking 0.15 ahead of impulse. Drops 1.5° / 1.5°. The return swing passes the Goldfeder without moving the detent. Passing-spring loss ≤ 0.85 µJ | Move the Goldfeder corner (§5.3) or the horn set-over, then re-run. Update §5.3, §7 #7 / #46 and the lift and loss checks in `closure.py` |
| C2 | **Stop-work motion study** (§3.5) | Model the band as a swept strip at each wind state from 7.7 to 8.761 turns. Check: pad camming from w ≈ 8.05; the lever reaching B2 at 8.761; the nose passing the retracted beak at 7.761; the inclined faces meeting flat. Repeat at fusee and lever end-shake extremes | Nose passes ≥ 0.4 clear at 7.761. Stop between 8.711 and 8.85. Beak never touches the Deckplatte or body rim | Adjust the pad chamfer start (Z 16.90) or the B2 position, then re-run the `stop` checks |
| C3 | **Full interference check** of the assembled movement in both rest positions (dial down as listed, dial up in service) and through a full let-down | CAD clash detection, all moving parts swept | No contact other than designed mates | Fix in the part concerned; record in §7 |

### 8.2 On the bench, at part and sub-assembly stage

| # | Task | How | Pass | If it fails |
|---|---|---|---|---|
| B1 | **Mainspring torque acceptance** (§3.1) | Torque meter, spring in its drum, after 50 wind/let-down cycles; n = 0 … 5.0 barrel turns | M = 427 + 61.9·n N·mm ±8 %, **and M(5.0) / M(0) = 1.725 ±0.07** (rev 2.1) | Reject the spring. Do not compensate with set-up beyond ±1 click |
| B2 | **Band strip material** (§3.3) | Mill certificate, or a tensile test on an offcut | UTS ≥ 2 000 N/mm², 0.08 ±0.005 thick, edges deburred | Reject the strip. A thicker strip is not an alternative (fatigue) |
| B3 | **Fusee output torque** (§3.6 step 4) | Torque key on the fusee square at w = 0, 4.4, 5.0 and 8.76 turns | 354 / ≈320 / 318 / 332 N·mm ±5 %, **and T(8.76) / T(5.0) = 1.00–1.06** (the daily window, rev 2.1) | Check the spring (B1), set-up and band hooking |
| B4 | **Stop-work first article** (§3.6 step 5) | Full let-down and re-wind 10 times. Then a firm over-turn of the key (≈500 N·mm) | Stops every time in the 8.711 … 8.85 window. No outward movement of the beak under the over-turn. No marks on the beak or nose faces | Re-phase the nose. If the faces mark, re-harden them or check the 27° face angle |
| B5 | **Escapement setting** (§5.3, §5.11) | Pre-set on the open upper plate (§6 step 5), then check under a magnifier through the balance hole: locking depth, Goldfeder corner position (r 1.630, 0.05 to the wheel side of the B-parallel line), unlocking, drops. The escapement must be dry | As C1 | Lift the upper plate off and set the banking screw, Goldfeder and horn |
| B6 | **Plate-gap and end-shake record** (§2.9) | Fit the bare frame: face the pillars as a set and measure the gap at the three pillars. Measure each arbor's shoulder span, compute the bush and setting positions, fit, and measure each end-shake | Gap 19.00 +0.01 at all three pillars, agreeing within 0.005. Every end-shake inside its §6 step 6 band. Values recorded here | Re-face or re-press the adjusting part; never ease a shoulder below its drawn tolerance |
| B7 | **Balance rim material** (§5.6) | Mill certificate for the nickel steel: composition and α(T) over 0–40 °C. Section a test rim to check the fused brass bond | Certificate present; bond continuous | Do not build the rim; use the §5.6 fallback pair |
| B8 | **Hairspring pinning and Goldfeder** (§5.3, §5.9) | Check the stud hole (⌀0.7 at r 3.85, wall ≥ 0.10) and that the flatted pins hold the strip without twisting it. Measure the Goldfeder free blade (0.045) and its overhang beyond the horn tip (0.12 ±0.01) | As specified | Re-make the pin; re-thin or replace the Goldfeder |

### 8.3 On the timing machine and in rating trials (in the case and gimbals, dial up)

| # | Task | How | Pass | If it fails |
|---|---|---|---|---|
| T1 | **Amplitude** (§5.11) | Timing machine at full wind and after 24 h | ≥ 200° at full wind; ≥ 170° after 24 h. (The design needs a balance Q of ≈ 670–1 280 for 200°; this measurement is the only proof) | Check, in order: pivot polish and oiling (to the §6 chart, escapement dry), endstones, the Goldfeder blade (0.045) and unlocking setting, train depthing, spring torque (B1). Only then consider a stronger spring, within its stress limit |
| T2 | **Coarse and fine regulation** (§5.11) | Face the weights equally (≈36 s/d per 0.01 mm of all four), then the timing nuts (−77 s/d per pitch) | Rate within ±2 s/d | — |
| T3 | **Isochronism** (§5.11) | Rate over 0–24 h and 24–48 h after full wind, and at deliberately reduced amplitude | ≤ 0.5 s/d difference | Hand-correct the outer terminal curve, or move the stud pinning point; repeat |
| T4 | **Temperature compensation** (§5.11) | At least 48 h each at 4 °C, 18 °C and 32 °C | ≤ 2 s/d change over 4–32 °C; record the middle-temperature error | Move all four weights by the same number of 6° divisions; repeat |
| T5 | **Rating trial for navigation** (§5.11) | 14 days at constant temperature, then a re-check after T4 | Daily-rate variation ≤ 0.5 s/d day to day; rate returns to within 0.5 s/d after the temperature trial | Repeat T1–T4. Do not issue the instrument |
| T6 | **Service inspection** (each overhaul) | Inspect the band near the fusee small end and at both hooks; check the stop faces | No cracks, kinks or set in the band; no peening of the stop faces | Replace the band (it is a fatigue part, §3.3) |

### 8.4 Evidence that would confirm rev-2 design choices

| # | Item | What would settle it |
|---|---|---|
| E1 | **Crossed band (reverse fusee).** Inferred from three drawn facts (§3.0), not drawn directly | A photograph or inspection of a surviving 1948 Wempe Feder movement showing the band run, or a drawing of the band path |
| E2 | **Stop-work geometry** (§3.5). Designed by function; no detail sheets | The missing stop-work sheets (05 06 03-x) or a surviving movement. If they differ, keep the rev-2 design only if it still passes C2 and B4 |
| E3 | **Phillips terminal curves** (§5.8) as the build default | Not needed for function. If an exact replica is wanted, use the drawn curve and accept hand correction in T3 |
| E4 | All "?" readings and struck values. Also the legible but unexplained marks of §7 #54: "0,18 u.d.g." (1436), "0,04" and "0,4" (05-04_01), and the banking-screw "12°" (05-04_03 / 05-04_01) | Original high-resolution scans (≥ 300 dpi) from the Wempe / DGC archive, or the factory's escapement setting instructions |
| E5 | **Set-over detent horn** (§5.3, rev 2.1). Inferred from the layout's horn tip at 1.65 from B and its drawn instant, not drawn as a dimension | A detail sheet of the Gangfeder horn, or a surviving detent |

---

## Appendix A. Case and key

The case, gimbal, movement seat, back shutter, winding path and key are now specified in **[Federchronometer05_Case_Gimbal.md](Federchronometer05_Case_Gimbal.md)**, with its own closure script `_inferred/scripts/case_closure.py`. The table below lists only the drawn case parts for reference.

| Part | No. | Sheet | Material | Drawn geometry | Tier |
|---|---|---|---|---|---|
| Gehäusetopf (case pot) | R-05 01 00-1 | `05-01/Wempe_05-01_2.jpg` | Brass, chill-cast, 350 g | Revolved profile: ⌀118, ⌀108, ⌀106, ⌀98 (internal), ⌀72.5, ⌀64; height 65; steps 53, 23.5, 14.5, 12, 5.5; 40° chamfer. No holes drawn | T1 profile; wall thickness and fillets T4 |
| Verschlußplatte (closing plate) | 05 01 00-2 | `05-01/Wempe_05-01_3.jpg` | Brass | ⌀68 −0.2; ⌀28 −0.2; ⌀26; ⌀10; ⌀7.5 +0.1; ⌀5.5 +0.1; plate 2.3 (?), total 5; 3 +0.2; 25; M2.6; 22.6 and 8 +0.2 (rev. a 1948) | T1 |
| Glasrand (bezel) | R-05 01 01-2 | `05-01/Wempe_05-01_5.jpg` | Brass, chill-cast | ⌀125, ⌀116, ⌀106, ⌀92; heights 16, 11.5; 30° | T1; glass rebate T4 |
| Schlüsselmittelteil (key centre) | 05 01 02-2 | `05-01/Wempe_05-01_8.jpg` | Steel, black phosphated | See sheet: ⌀8 +0.1, 3 H11, ⌀2.5, 25.1 −0.2, … (0.9 cross-hole, rev. a) | T1 |
| Schlüsselrohr (key pipe) | 05 01 02-3 | `05-01/Wempe_05-01_9.jpg` | Brass Ms 58 | ⌀8 −0.05; 3.1 □ +0.05 square socket; 50.1 −0.2 overall; 19 +2 (rev. a) | T1 |
| Gimbal ring | — | `05-01/Wempe_05-01_1.jpg` | — | ⌀160 only | T4 |
| Wooden box | — | `51-00/Wempe_51-00_1.jpg`, `_5.jpg` | Bleached birch | "Holzgehäuse 185×185×180 mm außen" | Out of scope |

**Key fit (rev 2).** The key's square socket (3.1□ +0.05) fits the fusee square, which is **3.1□ across the flats at its root** and tapers 1:100 to 2.92□. The parallel case spec reached the same reading of the square.
- The key tube passes down inside the Staubfutter (⌀7.62 top bore against the tube's ⌀5.95) and bottoms on the Staubplatte (Z 30.71).
- It then engages **15.2 of square** (30.71 → 45.91, inside the "19 +2" socket depth) with **0.03 play** at the socket mouth.
- The Staubfutter top Z does not govern the key engagement.

## Appendix B. Not modelled

- Zeigerstellung 05-33 (hand-setting; conditional plate rows 14–18 and cut-outs). A marine chronometer is rated, not set; the hands are set by turning the minute hand on its friction-fitted Viertelrohr;
- Unruhhaltevorrichtung 05-36 (balance stop; plate holes 51–53 are kept). **Fit one, or wedge the balance with cork, for any transport:** the 0.21 balance pivots will not survive a drop with an 11 g balance free. Its case push-piece (T3, Z +28.0 ±1.5) must be spotted against the built Winkelhebel on hole 52, and its inner end must stand back beyond r 42.5 when released, so the movement can be lowered past it;
- Sekundenkontakt 05-38;
- all Ankerchronometer sheets.

## Appendix C. Verification

All resolved values are checked by `_inferred/scripts/closure.py` (`python closure.py`, rev 2.1):

- **34 / 34 independent checks pass.** These test a value against drawn data it was not derived from. Examples: the crossed band clearing the lower cock, the drawn click sense, the 5.00 barrel turns, the fusee stack, the Staubfutter fit, the key fit and socket depth, and (rev 2.1) the barrel-cover dovetail, where the drum's 5° undercut matches the cover's 39.39.
- **116 / 116 consistency checks pass.** These show feasibility. Examples:
  - the stop-work (24 checks, including self-locking and over-wind strength), the band fatigue, the fits, the hands and the frequency;
  - and the rev-2.1 `review` group (49 checks):
    - jewel working lengths;
    - the fitted plate gap, with the four upper-plate clearances it protects, and the end-shake fitting;
    - the cover snap;
    - hairspring pinning;
    - hour-wheel float;
    - spring-slope limits;
    - Goldfeder loss and overhang stiffness;
    - the horn tip clear of the stone on the return swing;
    - the unlocking lift along the true detent motion;
    - the Kloben steady-pin holes.
- **17 / 17 rejected alternatives fail as expected:**
  - from rev 2: the ⌀15 escape wheel, the 9.2 seconds extension, the open band, the 0.22 band strip, the Staubfutter on the plate, and a 1.5 balance arm;
  - from rev 2.1:
    - full-length balance jewel bores;
    - the drawn pillar tolerance (Ruhestein clearance and the fusee end-shake at an 18.93 gap);
    - the ⌀0.6 stud hole;
    - a +8 % tilted spring;
    - the 0.15 Goldfeder and a 0.05 blade;
    - the IE horn overhang (0.05);
    - the rev-2 straight-horn unlocking setting;
    - r 1.650 on the B-parallel line;
    - the other steady-pin pairing.

The script also prints the design values used in this spec (band tangent, stop-work coordinates, torque curve, amplitude energy budget). See the evidence record (Federchronometer05.md §7–8).
