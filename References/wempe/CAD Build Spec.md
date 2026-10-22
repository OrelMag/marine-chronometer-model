# Wempe Federchronometer 05: CAD build specification

**Movement:** Wempe Einheits-Chronometer, *Federchronometer 05*. Two-day marine chronometer with spring-detent (Earnshaw) escapement, fusee and steel band, 14 400 vph, 56 h.

**This file is self-contained.** Every value needed to model the movement, part by part, is here. The reasons, the alternatives ruled out, the timekeeping verification and the confidence of each value are in the companion **[Federchronometer05.md](Federchronometer05.md)** (evidence and decision record; its §5 is a summary of this spec).

Do **not** use `Index.md` or `Missing_details.md`: they are unsourced, and their file names are swapped.

---

## 1. Conventions and overview

### 1.1 Scope

| In scope | Partial (Appendix A) | Out of scope |
|---|---|---|
| The complete movement: frame, power (mainspring, barrel, band, fusee, maintaining power, stop-work), going train, escapement, balance and hairspring, motion work, power-reserve work, hands, dial | Case pot, bezel, closing plate, key: drawn parts only. The gimbal has no detail sheets | Ankerchronometer variant; Zeigerstellung (05-33, conditional); Unruhhaltevorrichtung (05-36); Sekundenkontakt (05-38); wooden box (51-00) |

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
| Barrel (Federhaus) | CW (driven by the band) | 4.93 turns per full run |

Each sense alternates along the train. While winding, the fusee turns CCW from the back.

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
| Hairspring | Steel, helical, active length ≈504 |
| Balance | Guillaume rim + 4 weights of 1.525 g |
| Mainspring | 15 × 0.37 (drawn) × 1385 in a ⌀38.5 barrel, core ⌀13.3; set-up ¾ turn (drawn) |
| Fusee connector | Steel band 730, 0.8 × 0.22; 4.93 barrel turns |


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
| Hole 23 | Körner/stanzen 4.4 only. 03b also draws "7" (a radius) at hole 23; the feature it belongs to is not identified. Model ⌀4.4 through and flag | T1 / unresolved | 03a; audit_frame §1 |
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
| Rebate N-O | Section N-O shows a step leaving **1.35 −0.05** of plate. Location and function are **not resolved**. It is **not** the barrel-bridge seat: a bridge seated on it would have its underside at Z 20.35, which contradicts the adopted 22.35. Do not model it until the sheet is re-read | T1 (value) / unresolved | 01b N-O; audit_frame §3a; inf_axial §2.1 |
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

- **Mates with:** pillars (spigots in 11/39/49), WN-300 (35, 38), WN-301 (1), Schneckenfutter (10) and its 3 × M1.4, upper balance cock (outer face; 6, 8, 9, 50), lower balance cock (inner face; 22, 36, 37), Gangfederkloben (inner face; 13), Federhausbrücke (outer face; 41, 42, 47, 48), escape upper chaton (26), stop pin 05 08 01-5 (7), Drahtfeder screw (5), Gegensperrkegel arbor (4), Staubfutter (outer face, about 10).
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
| Length between shoulders | 19.6 ±0.01 | T1 | 05-08_11 |
| Spigots (both ends, "wie oben") | ⌀4.5 f7 (−0.010 / −0.022) × 2.8 −0.1 long; lead-in "4,3ø −0,2" with "5°" at the spigot end | T1 | 05-08_11 |
| Overall length | 25.3 −0.2 printed. 19.6 + 2 × 2.8 = 25.2, which lies **inside** 25.3 −0.2, so model 25.2. This is not an override | T1 | 05-08_11; audit_frame §1 |
| Thread | M2.6 through ("Gewinde von beiden Seiten einschneiden"), 90° countersink at each mouth, "1,1 −0,2" (countersink depth, reading T3) | T1 / T3 | 05-08_11 |
| Shoulder groove | Small undercut drawn at the body/spigot junction; not dimensioned | T3 | 05-08_11 |
| Z position | Lower spigot Z −0.30 → −3.10 (end 0.25 inside the lower-plate outer face). Body −0.30 → 19.30 (shoulders on the 0.3 recess floors). Upper spigot 19.30 → 22.10 | T1 | Frame chain |
| Plate gap produced | 19.6 ±0.01 − 2 × (0.30…0.33) = 18.93…19.01; nominal 19.00 | T1 | — |

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
| **Governing rule for hole 13** | **The Kloben screw sits on plate hole 13 (34.536; −16.238). The locking stone and the horn sit at the 05-04_01 layout positions.** The two are 1.22–1.37 apart. The Kloben foot outline (which has no plan dimensions) absorbs the offset: rotate the Kloben −3.9° about hole 13 to restore the lock. The stone then returns to within 0.01 and the horn tip moves 0.31. Re-check the 0.39 locking penetration once modelled | T4 | RD §2; inf_escapement §4 |
| Foot block (plan) | 14.6 × 7.5, M1.7 screw centred (7.3 +0.04 from one end, 3.75 from the long edge) | T1 | 05-04_03 |
| Foot footprint, placed | Rectangle 14.6 × 7.5 centred on hole 13, long axis **69.5°**; corners (33.58; −8.09), (40.61; −10.71), (35.49; −24.39), (28.47; −21.76) | T1 (size) / T3 ±2° (angle) | inf_planview §2 |
| Screw | M1.7, tapped in the Kloben ("1,3 tief 3"), inserted from the Oberplatte outer face through the 1.8 clearance hole 13 | T1 | 05-04_03; 01a |
| Locating pins | 2 × ⌀0.9 holes at 2.3 and 12.3 from one end, ±2 across, on opposite sides | T1 (sheet) / T4 (which end is which) | 05-04_03; inf_planview §2 |
| Arm | 3 × 3, rising 17.5 beyond the block, carrying the M1.2 banking screw 7 from its end; banking screw 18.8 ±0.03 from the M1.7 line. Its plan direction is set by the escapement layout | T1 (sizes) / T4 (direction) | 05-04_03; inf_escapement §4 |
| Z | Hangs from the Oberplatte inner face: block Z 19.00 → 12.50 (side-view 6.5 +0.05 read as the height). Detent foot screw M1, axis parallel to the plate at Z 16.70 (2.3 +0.02 from the plate face). This is consistent with the section's detent at Z 15.76 → 16.88 | T4 (reading) / T3 (check) | 05-04_03 side view; inf_axial §2.7 |
| Drawn position on 001 | Screw 13 is drawn 1.19 N of row 13; the table governs | T3 | inf_planview §1.2 |

- **Mates with:** Oberplatte inner face (hole 13); Gangfeder (detent) foot (M1); Goldfeder.
- **CAD notes:** The footprint above is the foot block only. Model the arm per the escapement layout.

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
- **CAD notes:** The pivot screw is a shouldered M2.6 through the 3.2 bore (shoulder ⌀3.17, T4).

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
| Fourth-wheel jewel at 35 | Hole jewel; drawn opening ⌀3.27 on 001 (T3); 05-05_01 (127-series) draws a setting ⌀5.5. Jewel face at Z **−5.13** (T1 chain: 19.00 − 24.1 − 0.03 end-shake), recess 1.78 below the bridge's plate face. **OVERRIDDEN (drawn: "1,7"(?) recess on 05-08_10, i.e. Z −5.05, which would bind the −5.10 shoulder)** | T3 / T1 | 05-08_10; inf_planview; inf_axial §2.6 |

- **Mates with:** Unterplatte outer face (screws 28/43 into M2.6, pins 29/44); Zwischentrieb front pivot (WN-300); Sekundentrieb front pivot and seconds extension (jewel).
- **CAD notes:** Plan clearances in the same Z band: Stundenrad +3.20, Wechselrad +4.34 (closure.py). The bridge does not reach the dial (3.00 clear).

### Werkring (movement ring) — 05 08 00-3

- **Source sheet(s):** `05-08/Wempe_05-08_07.jpg` (rev a, 7 changes, 6.12.46).
- **Material/stock:** blank on the sheet (brass assumed, T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Diameters | OD ⌀105.95 −0.1 (a); ⌀104 +0.1 (dial recess); ⌀96 −0.3(?); ⌀93 +1.3(?); **⌀85 H9 +0.035** (plate bore); ⌀83 (ledge inner edge, tolerance illegible) | T1 | 05-08_07 |
| Heights | Overall 10.7 −0.1 (a); 3 +0.1 (a); 7 −0.1 (a); 0.7 +0.1 (a); also "4,7", "2,8", 45° chamfer | T1 | 05-08_07 |
| Axial reading | 3 + 7 + 0.7 = 10.7 closes. Reading: 3 = ring top face → plate ledge (the lower plate sits in the ⌀85 H9 bore on the ⌀83 ledge); 7 = ledge → dial seat (the "7" dial-foot distance); 0.7 = dial recess ⌀104 +0.1 (the ⌀103.6 dial) | T1 (closure) / T4 (assignment) | 05-08_07; inf_axial §2.1 (dial −10.35) |
| Z | Top face −0.35; ledge (lower-plate outer face) −3.35; dial seat floor −10.35; bottom face −11.05. Section T3: top −0.3, bottom −10.8 | T4 / T3 check | — |
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
| Outside fits | "8ø g6 −0,005/−0,014" (dimension line across the lower spigot, in the plate's 8.0 +0.015 seat) and "8ø r6 +0,028/+0,019" (printed like "T6"; feature not clearly identified); top ⌀7 ±0.1 with a 45° chamfer; "(7,96ø)" reference | T1 (values) / T3 (assignment) | 05-08_08 (viewed) |
| Bore | Drawn "4,1ø +0,2" and "Kegel 1:70". **Unresolved:** a 4.1 bore cannot pass the 4.5 → 4.39 journal. Adopted for CAD: a 1:70 taper bore matching the journal + 0.01 clearance (⌀4.51 at the lower end → ⌀4.41 at the top), with 4.1 read as a pre-bore. **OVERRIDDEN (drawn: "4,1ø +0,2")** | T4 | inf_fusee §5; RD §2 (the journal runs in the Futter) |
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
| Bore | ⌀8 H7 +0.015 at the bottom, Kegel 1:70 above; "5ø", "0,5" at the bottom edge | T1 | 05-08_09 |
| Z | **22.35 → 40.45** (on the Oberplatte outer face about hole 10) | T1 (length) / T3 (top 40.46) | res_fusee §2; inf_axial §2.3 |

- **Mates with:** Oberplatte outer face; fusee square (passes inside); 05 08 01-4 (no sheet); case/cork ring (Korkring T3 Z 39.11 → 43.0).
- **CAD notes:** **Unresolved fit:** with the base at 22.35, the Schneckenfutter flange (⌀13.2 × 1.5 at Z 22.35 → 23.85) sits inside the Staubfutter's lower end, but the drawn bottom bore is ⌀8 H7. Either the Staubfutter seats on the Futter's ⌀8 boss (base at 23.85, top at 41.95, which the section does not support) or its lower end is counterbored over the flange. Model a ⌀13.4 × 1.6 counterbore in the base (T4) so the adopted Z holds.

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
| Centre, front | WN-302 in Unterplatte 1 | journal + 0.01–0.02. The arbor diameter in the bush is not dimensioned; 05-05_10's ⌀3.6 step is the candidate → bore 3.61–3.62 | 4.59 +0.012 | −3.35 → −0.10 (inner face 0.1 +0.02 below Z 0, reading of 05-08_32-2) | none | T4 | 05-08_32-2; 05-05_10 |
| Third, back | WN-300 in Oberplatte 38 | 0.86–0.87 (pivot ⌀0.85) | 4.59 +0.012 | 19.00 → 22.35 | none | T2 | 05-08_02 |
| Third, front | WN-300 in Zwischenbrücke 38 | 0.86–0.87 | 4.59 +0.012 (T4) | −4.07 → −7.35 | none | T1 (face) / T4 | 05-08_10 |
| Fourth, back | WN-300 in Oberplatte 35 | 0.83–0.84 (pivot ⌀0.82) | 4.59 +0.012 | 19.00 → 22.35 | none | T2 | 05-08_02 |
| Fourth, front | Hole jewel in Zwischenbrücke 35 | 0.77–0.78 (pivot ⌀0.76); the seconds extension passes through | setting in the drawn ⌀3.27 opening (T3) | top face −5.13; thickness 0.4 (T4) | none | T1 (face) / T3 / T4 | inf_axial §2.6 |
| Escape, upper | Chaton in Oberplatte 26 | hole jewel 0.25–0.26 (pivot ⌀0.24 "Steinlager einpassen") | flange ⌀5.2 × 0.5 in the 5.2 H7 seat, body ⌀4.5 in the 4.5 H7 bore; 2 × M1.2 at 3.5, countersunk flush | chaton 19.00 → 22.35; endstone face **21.00** | flat endstone ⌀2.0 × 0.3, face Z 21.00 | T1 (seats) / T4 | 01b P-Q; inf_escapement §9 |
| Escape, lower | Unterplatte 26 | hole jewel 0.25–0.26 | jewel OD 2.50 (press, +0.005) in 2.50 ±0.009; endstone cap 2 × M1.2 at 3.5 on the dial face | jewel in −3.35 → 0; endstone face **−1.83** | flat endstone ⌀2.0 × 0.3 | T1 (bore) / T4 | 03a; inf_escapement §9 |
| Balance, upper | Unruhkloben oben | hole jewel 0.22–0.23 (pivot ⌀0.21) | chaton ⌀5.2 in 5.2 H7; 2 × M1.2 at 3.5 on the arm axis, 82° csk | in the arm, 34.95 → 37.35 | Diamantdecke ⌀2.2 × 0.35, face **35.85** (1.50 below the cock top) | T1 (seat) / T4 | 05-08_05; 05-03_1 "Diamantdecke" |
| Balance, lower | Unruhkloben unten ear | hole jewel 0.22–0.23 | chaton ⌀5.2 in 5.2 H7, recess 0.5 +0.03; 2 × M1.2 at 3.5 +0.1 | in the ear, 9.00 → 12.22 | endstone ⌀2.2 × 0.35, face **10.20** (1.20 above the cock bottom) | T1 (seat) / T4 | 05-08_04 |
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
| Bore | 3.61–3.62 (on the ⌀3.6 candidate journal) | T4 | 05-05_10 |
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
| Hole jewel | balance 0.22–0.23 bore × 0.45 thick, ⌀2.0 OD; escape 0.25–0.26 × 0.4, ⌀2.0 OD (escape lower OD 2.50 in the plate) | T2 / T4 | inf_escapement §9 |
| Endstone | balance ⌀2.2 × 0.35; escape ⌀2.0 × 0.3 | T4 | inf_escapement §9 |
| Endstone faces | balance 10.20 / 35.85 (span 25.65); escape −1.83 / 21.00 (span 22.83) | T1 (spans) / T4 (split) | RD §2; inf_axial F3/F4 |
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
| M1.7 | Drahtfeder screw 5; Gangfederkloben screw at 13 (into the Kloben, "1,3 tief 3"); contact screws 56, 57 (**conditional**) | 1.3 | ⌀3.2 × 1.1, slot 0.4 | 13: 5.5 (3.35 plate + 2.5 in the Kloben); 5: 3.0 | T1 / T4 | 01a, 03a, 05-04_03 |
| M1.4 (WN-34) | Schneckenfutter flange × 3 on R5.2 | 1.1 (T4) | ⌀2.1 × 0.5 (in the "2,2ø H8 × 0,5" counterbore) | 3.0 | T1 (01b, 05-08_02) / T4 | 01b; 05-08_08 |
| M1.2 | Chaton screws: Oberplatte 26 × 2, Unterplatte 26 × 2, upper cock × 2, lower cock × 2 | 0.95 (T4) | 82° countersunk, head ⌀2.0 (flush where under the balance) | 2.0 | T1 / T4 | 01b, 03b, 05-08_04, _05 |
| M1 | Detent foot on the Gangfederkloben (escapement section) | — | ⌀1.8 × 0.6 | 2.0 | T1 / T4 | 05-04_03 |

| Pin | Size | Positions | Tier | Source |
|---|---|---|---|---|
| Steady pin WN-203 | ⌀1.6 × 3.0, chamfered both ends; pressed into the part's 1.585 hole, protruding **1.3** into the plate's 1.6025 hole | Upper cock 6, 9, 50; lower cock 22, 37; Federhausbrücke 41, 47; Zwischenbrücke 29, 44 | T1 (1.3 protrusion, holes) / T2 (⌀) / T4 (length) | 05-08_06, 05-08_10, 05-08_12 |
| Stop pin 05 08 01-5 | ⌀1.6 in 1.6 +0.009, projecting below the Oberplatte inner face ("unten vorstehend"); length to suit the stop lever (T4) | Oberplatte 7 | T1 / T4 | 05-08_02 |
| Wendelfeder pin | ⌀1.5 in 1.5 H7 | Oberplatte 53 | T1 | 01a |
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
| Length | 3.35 in the plate + a projection below the inner face to the stop-lever plane. The projection is not drawn; model 0.7 (tip at Z 18.30), overall 4.05 | T4 | — |

- **Mates with:** Oberplatte hole 7; stop lever (banking).
- **CAD notes:** The stop lever's Z is not given by any source, so check the pin length once the lever is placed.

---

### 2.8 Master Z table

Z = 0 at the lower-plate inner face, + toward the upper plate. Rebuilt from `inf_axial.md`, then the overrides required by RD and the res_* files are applied. Ranges run low → high Z.

#### 2.8.1 Frame, bridges, cocks, dial

| Item | Z | Tier | Source |
|---|---|---|---|
| Zifferblatt outer face / inner face | −11.65 / −10.35 | T1 (corroborated) | inf_axial §2.1 ("7" + 1.3, 127-series; T3 −11.72 / −10.42) |
| Werkring bottom / dial seat / ledge / top | −11.05 / −10.35 / −3.35 / −0.35 | T4 (T3 check −10.8 / −0.3) | §2.4 |
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
| Schneckenfutter | 19.65 → 26.75 (flange 22.35 → 23.85) | T1 | res_fusee |
| Staubfutter | 22.35 → 40.45 | T1 | res_fusee; inf_axial |

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
| Square 1:100 (corners 3.10 → 2.93), finished 18.3 = ≈17.0 flats + ≈1.3 dome | 27.61 → **45.91** (tip) | T1 / T3 | RD §2; res_fusee §2 ("18,3 −0,1" on 05-06_01). **OVERRIDDEN (drawn: right end "20,3" on 05-06_15, which includes the 2.3 centre cone)** |
| Schneckenrad (great wheel) | 2.54 → 3.84 | T3 | inf_axial §2.3 |
| Gegenfeder | 3.84 → 5.08 | T3 | inf_axial §2.3 |
| Gegensperrad | 5.08 → 6.32 | T3 | inf_axial §2.3 |
| Schneckenkörper (cone) | 6.49 → 18.65 (the res_fusee alternative large face at 5.91 is unresolved; see the non-closure note below) | T3, stack does not close | inf_axial §2.3; res_fusee §2 |
| Schneckensperrad | 16.84 → 18.32 | T3 | inf_axial §2.3 |
| Deckplatte (05-06_08, 1 thick, ⌀21) | 18.61 → **19.61**, flush with the 6.1 step | T4 | Section T3 18.46 → 19.68 would foul the Futter end (19.65) within r ≤ 4 |
| Staubplatte | ≈27.7 → 30.9 | T3 | res_fusee §2 |
| Korkring (case) | 39.11 → 43.0 | T3 | inf_axial §2.3 |

Frame limits on the fusee: nothing within r ≤ 4.0 of the axis above Z 19.61 (Futter end 19.65), and nothing within r ≤ 11 above Z 19.70 (J-K floor).

**The fusee wheel/body stack does not close.** The rows from the Schneckenrad to the Deckplatte are T3 section readings. With the Deckplatte capped at 19.61, its underside (18.61) overlaps the section's Schneckenkörper top (18.65) by 0.04, and only 12.29 is available between the Gegensperrad top (6.32) and 18.61 for a body drawn 12.6 −0.1 long (05-06_02-2). Model the arbor segments as above (they close); take the wheel and body heights from the fusee section, which governs, and trim the body to end at 18.61 if no other value is given there.

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
| Minute-hand square 2.6□ r6 | −18.23 → −14.70 | T1 | inf_axial §2.4 |
| Viertelrohr front end | −18.23 | T1 | inf_axial §2.4 |
| Minutentrieb front tip, cut flush | **−18.23** | R1 | RD §2. **OVERRIDDEN (drawn: −20.65 from 39.65)** |
| Wechselrad (z56) | −5.23 → −4.21 (inside the Viertelrohr pinion span) | T3 | inf_axial §2.4 |
| Wechselrad hub (7 −0.1), between the plate outer face (−3.35) and the dial inner face (−10.35) | −10.35 → −3.40 (model 6.95, shown resting on the dial; end-shake 0.05) | T1 / T4 | 05-02_06; frame |
| Wechselrad stud (Anrichtstift) tip | −10.15 ("6,8" from the plate outer face) | T3 | 05-08_32-2 |
| Wechseltrieb (z18) on the hub, in the Stundenrad plane | ≈ −7.57 → −6.64 (leaves must cover the Stundenrad) | T4 | plane of the Stundenrad |
| Stundenrad | −7.57 → −6.64 | T3 | inf_axial §2.4 |
| Stundenrad pipe end | −14.64 | T3 | inf_axial §2.4 |

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
| Seconds extension 0.76 → 0.65 (Kegel 1:90), tip | **−12.97** (7.84 from −5.13; 0.53 above the hour hand) | T3 + R1 | RD §2. **OVERRIDDEN (drawn: 9.2 extension, superseded; tip −14.33)** |
| Zeigerfutter (seconds hand pipe), OD 1.2, ≈1.0 long | −12.97 → −11.97 | T1 fit / T4 length | RD §2 |
| Sekundenzeiger blade | −12.42 → −12.08 | T3 | inf_axial §2.6 |

#### 2.8.7 Escape arbor (Gangrad 05 04 05-1, 22.8 −0.02) — resting on the lower endstone

| Item | Z | Tier | Source |
|---|---|---|---|
| Lower endstone face / arbor lower tip | **−1.83** (inside the Unterplatte) | T3 (section, kept) | inf_axial §2.7 |
| Gangtrieb (z10) | 2.71 → 6.61 (contains the Sekundenrad 4.12 → 5.12) | T3 | inf_axial §2.7 |
| Gangrad (escape wheel, ⌀14.00) | **17.17 → 17.97** (07-2 "19" read as lower tip → wheel face, T4; thickness 0.8, T4). Section envelope 17.04 → 18.49 (1.45, T3). Lies inside the impulse-roller span 17.10 → 18.70 | T4 / T3 | inf_escapement §2; 05-04_07-2 |
| Arbor upper tip | 20.97 | T1 (22.8) | — |
| Upper endstone face | **21.00** (inside the Oberplatte; span **22.83**, end-shake 0.03) | T1 span / T4 split | RD §2. **OVERRIDDEN (section: endstones −1.83 / 20.16, span 22.0)** |

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
| Auf-u-Ab stud (Futter 05 08 02-2) | 0.00 → −12.3 | T3 | 05-08_32-2 |
| Auf-u-Ab hub 05 02 04-2 (runs on the stud; carries the wheel and the 2.2 r6 hand seat) | ≈ −12.2 → −8.37 (wheel face to the hand seat; heights 1.4 / 0.7 / 2.8 / 1 / 5.2 on 05-02_10, assignment T4) | T4 | 05-02_10 |
| Auf u. Abrad (z120, raised 0.25 on its stud) | **−9.40 → −8.37** (0.05 above the pinion end −9.45; 0.95 clear of the dial) | T4 | RD §2. **OVERRIDDEN (section: −9.65 → −8.62)** |
| Auf-u-Ab-Zeiger blade | −12.43 → −11.95 | T3 | inf_axial §2.8 |
| Stundenzeiger blade | −14.15 → −13.50 | T3 | inf_axial §3.7 |
| Minutenzeiger blade | −16.75 → −16.10 | T3 | inf_axial §3.7 |
| Gegensperrkegel blade (05-05_12, 2 / 1 −0.03), in the Gegensperrad plane | ≈5.08 → 6.32 | T4 | plane of the Gegensperrad |
| Stop lever, Stellfeder | Under the Oberplatte; Z not determined by any source. The beak must work in the J-K band (19.00 → 19.70) at r 6.3–6.8 from the fusee axis | T4 / open | IV §6; RD §2 |

Interference summary (all clear): barrel bottom 3.50 / Minutenrad top 1.80 = 1.70; Schneckenrad 2.54 / Minutenrad 1.80 = 0.74; Auf u. Abrad −8.37 / Stundenrad −7.57 = 0.80; seconds tip −12.97 / hour hand −13.50 = 0.53; balance rim 22.80 / plate 22.35 = 0.45; hairspring top 34.20 / cock relief 34.95 = 0.75; back pivot tips 22.00 / plate face 22.35 = 0.35.

---

### 2.9 Frame assembly and adjustment

| Step / end-shake | How it is set | Value |
|---|---|---|
| Plate gap | Fixed by the pillars: shoulders (19.6 ±0.01) in the 0.3 +0.03 recesses; spigots f7 in the 4.50 holes; M2.6 screws from both outer faces | 19.00 (18.93 … 19.01) |
| Barrel arbor | Fixed: Federhausbrücke underside (22.35) − shoulder span 22.25. Adjust by facing the upper shoulder | 0.10 |
| Barrel drum on the core | Hub space 11.8 − core 11.72 (05-07_04 (a) "0,05 +0,06") | 0.08 |
| Fusee | Schneckenfutter end (19.65) − 6.1 step (19.61). Shop alternative: keep the drawn 19.7 span and face the Futter to 7.01 (within 7.1 −0.2); that needs the J-K recess ≥ 0.8 deep | 0.04 |
| Centre arbor | Back shoulder on WN-301 (19.00); front by the WN-302 inner face, pressed to 0.10 +0.02 below Z 0 | 0.05 … 0.12 (T4) |
| Third | Press the Zwischenbrücke WN-300 bush to its face at −4.07 (drawn "0,7 +0,02" recess, at its maximum) | 0.02 (0.02–0.12 over the 23.05 −0.1 tolerance) |
| Fourth | Set the Zwischenbrücke jewel face to −5.13 (the drawn "1,7"(?) recess would give −5.05, i.e. bind; set at assembly) | 0.03 |
| Escape | Endstone span 22.83 set by the height of the screwed upper chaton (Oberplatte 26) | 0.03 |
| Balance | Endstone span 25.65 set by the chaton heights in the two cocks (lower 1.20, upper 1.50 recess) | 0.05 |
| Wechselrad | Hub 7 −0.1 between the plate outer face (−3.35) and the dial inner face (−10.35) | 0 … 0.10 (model 0.05) |
| Auf u. Abrad | Wheel raised 0.25 on its hub/stud to −9.40; retained by the dial | T4 |

Assembly order (T4): fit the bushes, studs and pins into the plates; mount the lower cock and Gangfederkloben (with the detent) on the Oberplatte inner face; set the barrel, fusee and train between the plates; close with the Oberplatte and the 6 pillar screws; fit the Schneckenfutter (3 × M1.4), Staubfutter, Federhausbrücke with Sperrad and Sperrkegel, escape chatons, balance and upper cock; on the dial side fit the Zwischenbrücke (2 × M2.6, 2 pins), motion work, Werkring, dial and hands.

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
- escape wheel ⌀15 (superseded; ⌀14.00).

### 2.11 Unresolved points in this section

1. **G-H recess face (hole 36):** inf_axial puts it on the inner face as a cock-spigot seat; the drawings support the outer face (screw-head recess). Outer face adopted; confirm on a better scan of 01b.
2. **Oberplatte N-O rebate (1.35 −0.05):** location and function unknown; not the bridge seat.
3. **Schneckenfutter bore** "4,1 +0,2" against the 4.5 → 4.39 journal; T4 taper bore adopted.
4. **Staubfutter base:** 22.35 (sources) against its ⌀8 H7 bottom bore and the Futter flange at the same Z.
5. **Federhausbrücke "73,5" against "5":** "5" adopted (0.18 difference).
6. **Lower-plate thickness:** the 03a value is struck and its replacement is illegible; the section hints at ≈3.2.
7. **Escape wheel thickness:** 0.8 (T4) against 1.45 (section T3); and the escape arbor's Z anchor (07-2 "19" reading).
8. **Balance setting split:** the collet override (23.95) with arm 1.15 forces lower/upper recesses 1.20/1.50; inf_escapement's symmetric 1.35/1.35 would put the Unruhauflage at 22.95 and needs a 1.0 arm.
9. **Fourth-wheel jewel face:** drawn "1,7"(?) recess (−5.05) against the T1 chain (−5.13).
10. **Zwischenbrücke seats:** WN-300 seat 4.59 (T4) against the measured ⌀4.94 and inf_planview's 5.2 H7 suggestion; jewel opening ⌀3.27 (T3) against ⌀5.5 on 05-05_01.
11. **Barrel arbor upper pivot:** with the 12.95 upper portion the square starts 0.47 inside the bridge, not the "0,3" stated in RD.
12. **Barrel core (resolved):** ⌀13.3, length 11.7 (res_barrel §3b). An earlier resolution file conflated length and diameter; corrected.
13. **Minutentrieb front bearing:** the journal diameter in WN-302 is not dimensioned (⌀3.6 candidate), and the "(19 +0,05)" chain against the 19.0 gap needs the WN-302 recess.
14. **Lower-plate hole 23 "7":** feature not identified.
15. **Stop lever Z:** not determined by any source.
16. **Fusee wheel/body stack:** with the Deckplatte capped at 19.61, the section's Schneckenkörper (6.49 → 18.65) overlaps it by 0.04, and the drawn 12.6 body does not fit the 12.29 left above the Gegensperrad (6.32).

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
  | Barrel drum, running | CW (open belt to the fusee, so the same sense as the fusee) |
  | Barrel drum, winding | CCW |
  | Barrel arbor | Stationary in use. It is held by the Sperrad and click, and turned only at set-up |
  | Fusee groove helix | **Left-hand** |

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
| Stop element at 35° from N, or in pin hole A | Stellungssteg at r ≈ 6.95, phase −3° ±4° from N |
| Fusee square 15.4 or 13.7 | Finished 18.3 |
| Fusee shoulder span 19.7 | 19.61 |
| Barrel turns 5.08 (chain) | 4.93 (band) |

---

### 3.1 Mainspring

### Zugfeder (mainspring) — none (no sheet)

- **Source sheet(s):** No part sheet; width from `05-07/Wempe_05-07_01.jpg` ("Zugfeder 15", cavity [15.8 ±0.1], family A); thickness drawn on `05-06/Wempe_05-06_20.jpg` ("Zugfeder 15 × 0,37"); hook position from `05-07/Wempe_05-07_04.jpg` and `05-07/Wempe_05-07_06.jpg`.
- **Material/stock:** Hardened and tempered carbon spring-steel strip (T2). The peak stress at full wind is ≈ 2 100–2 200 N/mm².

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
| Turns available | Usable turns (85 % of theoretical, T4) − ¾ set-up = 5.92 ≥ 4.93 needed | T2 | closure.py |
| Let-down inner radius | 14.4 (> core r 6.65 + 0.5) | T2 | closure.py |

- **Mates with:** Federkern pin 05 07 02-2; hook 05 07 01-3 in the drum wall; drum cavity (⌀38.5, floor-to-seat height 15.65).
- **CAD notes:**
  - Model the spring as wound in the let-down state, or as a simple annular solid for the assembly.
  - The 15-wide spring overhangs the 11.7-long core by about 1.65 at each end. The inner turn sits at r 6.65 (core ⌀13.3), outside the ⌀12 hub bosses, so it clears them.
  - Spring torque implied by sheet 20: M ≈ 427 + 61.9·n N·mm, where n = barrel turns wound from run-down. This is on the chain basis (inf_fusee §4); use it only for simulation.

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
| Cover seat | ⌀39.2 s6 (+0.059 / +0.043), with a 5° lead-in at the rim | T1 | 06 |
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
  - Cover 05 07 01-2 (s6/r6 seat; notch aligned with the floor slot).
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
| Snap lip ⌀ | 39.39, 5° (a); "Scharfe Kante leicht brechen" | T1 | 07 |
| Plate thickness | 1.3 −0.1 (a) | T1 | 07 |
| Hub overall length | 3.3 −0.1 (a). The hub projects 2.0 inward from the plate's inner face | T1 | 07; res_barrel §3a |
| Hub | ⌀8 −0.2 (a) at its inner end, flaring at 45° to ⌀12 −0.2 (a) at the plate | T1 | 07 |
| Bore | ⌀4.5 +0.1 (a) | T1 | 07 |
| Notch 1 (9 o'clock in the 07 plan) | 2 +0.05 wide; bottom at **r 18.3 ±0.02** (1.3 deep from ⌀39.2). Matches the drum floor slot | T1 | 07; res_barrel §1a |
| Notch 2 (3 o'clock) | 2.7 +0.1 wide × 2 +0.2 deep. Purpose not stated (probably a lever-off notch, T4) | T1 | 07 |

- **Mates with:** Drum seat (r6 in s6); arbor upper seat ⌀4.48 (running).
- **CAD notes:** The space between the hubs is 13.8 − (3.3 − 1.3) = **11.8**, which sets the core length (§ Federkern).

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
| Obliquity | Leans so that the barb of hook 05 07 03-3 lodges against the slot wall under band tension. The band pulls the hook tangentially toward the fusee; when running, the spring turns the drum CW from the back against that pull | T4 | — |

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
| Locking sense | The click must stop the arbor turning **CCW (from the back)** and let it turn CW for set-up | T2 | Spring reaction on the arbor (§3.6) |

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
| Z | On the bridge outer face: 25.67 → 28.27 | T1 | — |
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
- **Material/stock:** Strip 05 07 03-1 (no sheet): hardened steel band 0.8 × 0.22 (T2); hooks: Bandstahl 10×0.8 Din 1016.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Length | **730 ±3**, measured between the working points: the bight of fusee hook 05 07 03-2 to the barb of barrel hook 05 07 03-3 | T1 | 11; inf_fusee §2 |
| Strip section | **0.8 wide × 0.22 thick** | T2 | Resolved_Design (hook slot 0.22 +0.03; hook stock 0.8; fits the 0.87 groove) |
| Joints | "hart gelötet" (hard-brazed) at both hooks. The strip end is fully inserted in each hook's 0.22 +0.03 slot, which runs through the full 0.8 hook thickness | T1 | 11, 12, 13 |
| Orientation | The 0.22 thickness lies in the hook plane, and the 0.8 strip width runs along the hook thickness (axially on fusee and barrel) | T1 | res_barrel §1b |
| Riding radius | Fusee: groove root + **0.11**. Barrel: R 20.8 + 0.11 = 20.91 | T2 | inf_fusee §2 |
| Length budget at full wind | On fusee (t 0 → 8.761) 647; free span 40.9; remainder on barrel 42.1 ≈ 0.32 barrel turn | T1 | inf_fusee §2; closure.py |
| Barrel turns used | **4.93** (band). 5.08 is the **superseded** chain value | T1 | closure.py, against sheet 20 "5" |
| Free span | 40.9 (full wind) → 42.4 (run-down), open belt, C = 42.52 | T1 | inf_fusee §2 |

- **Mates with:** Fusee hook slot and ⌀0.55 cross-pin (02-2); fusee groove (0.87 × 0.6); drum OD and barrel-end slot.
- **CAD notes:**
  - Model the strip as a swept 0.8 × 0.22 rectangle: along the r_band(t) helix (§3.4 table) from t = 0 to the current wind state, then the straight open-belt tangent to the barrel, then a ≈ 2 mm/turn spiral on the drum.
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
| Schneckenrad (great wheel) | 2.54 → 3.84 | T3 (section) |
| Gegenfeder | 3.84 → 5.08 | T3 |
| Gegensperrad | 5.08 → 6.32 | T3 |
| **Schneckenkörper** large face → small face | **5.91 → 18.51** (provisional; see the contradictions list) | T1 chain (03-2 13.7 −0.1 from the 19.61 shoulder) |
| Deckplatte | 18.46 → 19.68 | T3 |
| J-K recess in the upper plate (⌀22) | 19.0 → 19.70 | T1/T3 |
| Schneckenfutter (in plate hole 10) | 19.65 → 26.75 | T1 |
| Staubplatte | ≈ 27.7 → 30.9 | T3 |
| Staubfutter | 22.35 → 40.45 | T1 |
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
| Band riding radius | **r_band = r_root + 0.11** | T2 | inf_fusee §2 |
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
- **Rule.** A point fixed in the body at φ_CAD lies at plate bearing **α = φ_CAD + 122.26° − 360°·(8.761 − w)** (mod 360) about the fusee axis.
  - w is the current wind state in fusee turns: 8.761 at full wind, decreasing as the fusee runs CW from the back.
  - Plate coordinates: x = 16.708 + r·cos α, y = 15.292 + r·sin α.
  - Z = 5.91 + z_c.
- **Basis.** At wind state w, groove point t = w sits on the band tangent at plate bearing **298.3°**. That bearing is for the chain at root + 0.41; for the band (root + 0.11) it moves by only 0.3–0.6° (inf_planview §2).
- **Full-wind pose (w = 8.761).** α = φ_CAD + 122.26°. This is the last column of the table below.
- **The +25.39° rotation is a different mapping.** inf_planview's +25.39° maps the **05-06_04 Schnitt C-D view** (drawn in the wound state, "Stellung im aufgezogenen Zustand") to the plate. It applies to plate-fixed parts drawn there: banking pin, lever, beak, and the Steg as drawn on 04. **Do not apply +25.39° to φ_CAD.** The 02-2 C-D view is a separate part drawing, and the body rotates.
- **Consistency check.** The Steg drawn on 04 C-D at 237.7° + 25.39° = 263.1°. The adopted Steg at φ_CAD 141° gives 141° + 122.26° = 263.3° at full wind. The beak is at 263.0° ✓.

#### 3.4.2 Groove-centreline table, 30° steps (copied in full from inf_fusee.md §3b; r_root uses 10.07)

- **Use r_band** (bold) for the band path. The chain column of the source is omitted because the chain is superseded.
- α_plate is the plate bearing at full wind (w = 8.761), computed as φ_CAD + 122.26°.
- The last row (t 8.858) is copied verbatim from the source. The groove end that governs the phasing is **t_N = 8.85 (φ_CAD 144°)**.

| t [turn] | θ [deg from A] | φ_CAD [deg, view from back] | r_root | **r_band (+0.11), USE** | z_c [mm from large face] | α_plate at full wind [deg] |
|---|---|---|---|---|---|---|
| 0.000 | 0 | 90.0 | 17.250 | **17.360** | 1.235 | 212.3 |
| 0.083 | 30 | 60.0 | 17.000 | **17.110** | 1.335 | 182.3 |
| 0.167 | 60 | 30.0 | 16.756 | **16.866** | 1.435 | 152.3 |
| 0.250 | 90 | 0.0 | 16.518 | **16.628** | 1.535 | 122.3 |
| 0.333 | 120 | 330.0 | 16.287 | **16.397** | 1.635 | 92.3 |
| 0.417 | 150 | 300.0 | 16.064 | **16.174** | 1.735 | 62.3 |
| 0.500 | 180 | 270.0 | 15.848 | **15.958** | 1.835 | 32.3 |
| 0.583 | 210 | 240.0 | 15.641 | **15.751** | 1.935 | 2.3 |
| 0.667 | 240 | 210.0 | 15.443 | **15.553** | 2.035 | 332.3 |
| 0.750 | 270 | 180.0 | 15.254 | **15.364** | 2.135 | 302.3 |
| 0.833 | 300 | 150.0 | 15.076 | **15.186** | 2.235 | 272.3 |
| 0.917 | 330 | 120.0 | 14.907 | **15.017** | 2.335 | 242.3 |
| 1.000 | 360 | 90.0 | 14.750 | **14.860** | 2.435 | 212.3 |
| 1.083 | 390 | 60.0 | 14.603 | **14.713** | 2.535 | 182.3 |
| 1.167 | 420 | 30.0 | 14.463 | **14.573** | 2.635 | 152.3 |
| 1.250 | 450 | 0.0 | 14.330 | **14.440** | 2.735 | 122.3 |
| 1.333 | 480 | 330.0 | 14.204 | **14.314** | 2.835 | 92.3 |
| 1.417 | 510 | 300.0 | 14.083 | **14.193** | 2.935 | 62.3 |
| 1.500 | 540 | 270.0 | 13.967 | **14.077** | 3.035 | 32.3 |
| 1.583 | 570 | 240.0 | 13.854 | **13.964** | 3.135 | 2.3 |
| 1.667 | 600 | 210.0 | 13.745 | **13.855** | 3.235 | 332.3 |
| 1.750 | 630 | 180.0 | 13.637 | **13.747** | 3.335 | 302.3 |
| 1.833 | 660 | 150.0 | 13.531 | **13.641** | 3.435 | 272.3 |
| 1.917 | 690 | 120.0 | 13.426 | **13.536** | 3.535 | 242.3 |
| 2.000 | 720 | 90.0 | 13.320 | **13.430** | 3.635 | 212.3 |
| 2.083 | 750 | 60.0 | 13.215 | **13.325** | 3.735 | 182.3 |
| 2.167 | 780 | 30.0 | 13.111 | **13.221** | 3.835 | 152.3 |
| 2.250 | 810 | 0.0 | 13.009 | **13.119** | 3.935 | 122.3 |
| 2.333 | 840 | 330.0 | 12.909 | **13.019** | 4.035 | 92.3 |
| 2.417 | 870 | 300.0 | 12.811 | **12.921** | 4.135 | 62.3 |
| 2.500 | 900 | 270.0 | 12.714 | **12.824** | 4.235 | 32.3 |
| 2.583 | 930 | 240.0 | 12.619 | **12.729** | 4.335 | 2.3 |
| 2.667 | 960 | 210.0 | 12.526 | **12.636** | 4.435 | 332.3 |
| 2.750 | 990 | 180.0 | 12.435 | **12.545** | 4.535 | 302.3 |
| 2.833 | 1020 | 150.0 | 12.345 | **12.455** | 4.635 | 272.3 |
| 2.917 | 1050 | 120.0 | 12.257 | **12.367** | 4.735 | 242.3 |
| 3.000 | 1080 | 90.0 | 12.170 | **12.280** | 4.835 | 212.3 |
| 3.083 | 1110 | 60.0 | 12.085 | **12.195** | 4.935 | 182.3 |
| 3.167 | 1140 | 30.0 | 12.000 | **12.110** | 5.035 | 152.3 |
| 3.250 | 1170 | 0.0 | 11.917 | **12.027** | 5.135 | 122.3 |
| 3.333 | 1200 | 330.0 | 11.835 | **11.945** | 5.235 | 92.3 |
| 3.417 | 1230 | 300.0 | 11.755 | **11.865** | 5.335 | 62.3 |
| 3.500 | 1260 | 270.0 | 11.675 | **11.785** | 5.435 | 32.3 |
| 3.583 | 1290 | 240.0 | 11.598 | **11.708** | 5.535 | 2.3 |
| 3.667 | 1320 | 210.0 | 11.522 | **11.632** | 5.635 | 332.3 |
| 3.750 | 1350 | 180.0 | 11.449 | **11.559** | 5.735 | 302.3 |
| 3.833 | 1380 | 150.0 | 11.377 | **11.487** | 5.835 | 272.3 |
| 3.917 | 1410 | 120.0 | 11.307 | **11.417** | 5.935 | 242.3 |
| 4.000 | 1440 | 90.0 | 11.240 | **11.350** | 6.035 | 212.3 |
| 4.083 | 1470 | 60.0 | 11.175 | **11.285** | 6.135 | 182.3 |
| 4.167 | 1500 | 30.0 | 11.110 | **11.220** | 6.235 | 152.3 |
| 4.250 | 1530 | 0.0 | 11.047 | **11.157** | 6.335 | 122.3 |
| 4.333 | 1560 | 330.0 | 10.986 | **11.096** | 6.435 | 92.3 |
| 4.417 | 1590 | 300.0 | 10.925 | **11.035** | 6.535 | 62.3 |
| 4.500 | 1620 | 270.0 | 10.867 | **10.977** | 6.635 | 32.3 |
| 4.583 | 1650 | 240.0 | 10.810 | **10.920** | 6.735 | 2.3 |
| 4.667 | 1680 | 210.0 | 10.754 | **10.864** | 6.835 | 332.3 |
| 4.750 | 1710 | 180.0 | 10.700 | **10.810** | 6.935 | 302.3 |
| 4.833 | 1740 | 150.0 | 10.648 | **10.758** | 7.035 | 272.3 |
| 4.917 | 1770 | 120.0 | 10.598 | **10.708** | 7.135 | 242.3 |
| 5.000 | 1800 | 90.0 | 10.550 | **10.660** | 7.235 | 212.3 |
| 5.083 | 1830 | 60.0 | 10.504 | **10.614** | 7.335 | 182.3 |
| 5.167 | 1860 | 30.0 | 10.458 | **10.568** | 7.435 | 152.3 |
| 5.250 | 1890 | 0.0 | 10.415 | **10.525** | 7.535 | 122.3 |
| 5.333 | 1920 | 330.0 | 10.372 | **10.482** | 7.635 | 92.3 |
| 5.417 | 1950 | 300.0 | 10.331 | **10.441** | 7.735 | 62.3 |
| 5.500 | 1980 | 270.0 | 10.291 | **10.401** | 7.835 | 32.3 |
| 5.583 | 2010 | 240.0 | 10.252 | **10.362** | 7.935 | 2.3 |
| 5.667 | 2040 | 210.0 | 10.213 | **10.323** | 8.035 | 332.3 |
| 5.750 | 2070 | 180.0 | 10.176 | **10.286** | 8.135 | 302.3 |
| 5.833 | 2100 | 150.0 | 10.140 | **10.250** | 8.235 | 272.3 |
| 5.917 | 2130 | 120.0 | 10.105 | **10.215** | 8.335 | 242.3 |
| 6.000 | 2160 | 90.0 | 10.070 | **10.180** | 8.435 | 212.3 |
| 6.083 | 2190 | 60.0 | 10.036 | **10.146** | 8.535 | 182.3 |
| 6.167 | 2220 | 30.0 | 10.002 | **10.112** | 8.635 | 152.3 |
| 6.250 | 2250 | 0.0 | 9.969 | **10.079** | 8.735 | 122.3 |
| 6.333 | 2280 | 330.0 | 9.937 | **10.047** | 8.835 | 92.3 |
| 6.417 | 2310 | 300.0 | 9.905 | **10.015** | 8.935 | 62.3 |
| 6.500 | 2340 | 270.0 | 9.875 | **9.985** | 9.035 | 32.3 |
| 6.583 | 2370 | 240.0 | 9.845 | **9.955** | 9.135 | 2.3 |
| 6.667 | 2400 | 210.0 | 9.816 | **9.926** | 9.235 | 332.3 |
| 6.750 | 2430 | 180.0 | 9.787 | **9.897** | 9.335 | 302.3 |
| 6.833 | 2460 | 150.0 | 9.760 | **9.870** | 9.435 | 272.3 |
| 6.917 | 2490 | 120.0 | 9.735 | **9.845** | 9.535 | 242.3 |
| 7.000 | 2520 | 90.0 | 9.710 | **9.820** | 9.635 | 212.3 |
| 7.083 | 2550 | 60.0 | 9.686 | **9.796** | 9.735 | 182.3 |
| 7.167 | 2580 | 30.0 | 9.663 | **9.773** | 9.835 | 152.3 |
| 7.250 | 2610 | 0.0 | 9.641 | **9.751** | 9.935 | 122.3 |
| 7.333 | 2640 | 330.0 | 9.620 | **9.730** | 10.035 | 92.3 |
| 7.417 | 2670 | 300.0 | 9.599 | **9.709** | 10.135 | 62.3 |
| 7.500 | 2700 | 270.0 | 9.579 | **9.689** | 10.235 | 32.3 |
| 7.583 | 2730 | 240.0 | 9.559 | **9.669** | 10.335 | 2.3 |
| 7.667 | 2760 | 210.0 | 9.540 | **9.650** | 10.435 | 332.3 |
| 7.750 | 2790 | 180.0 | 9.522 | **9.632** | 10.535 | 302.3 |
| 7.833 | 2820 | 150.0 | 9.504 | **9.614** | 10.635 | 272.3 |
| 7.917 | 2850 | 120.0 | 9.487 | **9.597** | 10.735 | 242.3 |
| 8.000 | 2880 | 90.0 | 9.470 | **9.580** | 10.835 | 212.3 |
| 8.083 | 2910 | 60.0 | 9.454 | **9.564** | 10.935 | 182.3 |
| 8.167 | 2940 | 30.0 | 9.437 | **9.547** | 11.035 | 152.3 |
| 8.250 | 2970 | 0.0 | 9.422 | **9.532** | 11.135 | 122.3 |
| 8.333 | 3000 | 330.0 | 9.406 | **9.516** | 11.235 | 92.3 |
| 8.417 | 3030 | 300.0 | 9.392 | **9.502** | 11.335 | 62.3 |
| 8.500 | 3060 | 270.0 | 9.377 | **9.487** | 11.435 | 32.3 |
| 8.583 | 3090 | 240.0 | 9.363 | **9.473** | 11.535 | 2.3 |
| 8.667 | 3120 | 210.0 | 9.349 | **9.459** | 11.635 | 332.3 |
| 8.750 | 3150 | 180.0 | 9.336 | **9.446** | 11.735 | 302.3 |
| 8.833 | 3180 | 150.0 | 9.324 | **9.434** | 11.835 | 272.3 |
| 8.858 | 3189 | 141.1 | 9.320 | **9.430** | 11.865 | 263.4 |

Check on the table: at t = 8.761 (full wind), α = 298.3°, which is the band tangent ✓.

- **Mates with:**
  - Arbor collar ⌀7.04 (press).
  - Band and fusee hook.
  - Schneckensperrad, in the large-end recess (pins on ⌀11.5, M2 on r6).
  - Stellungssteg at the small end.
  - Deckplatte.
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
| Body on arbor | Large face Z **5.91**, small face 18.51 (= 19.61 − 13.7) | T1 chain (provisional) | res_fusee §2 |

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
| Staubplatte seat | "3,1 r6 +0,023 +0,015" at the start of the square (on the square's corners) | T1/T2 | 15; res_fusee §2 |
| Square 1:100 | Corners 3.10 at Z 27.61 → 2.93 at Z 44.6. Full flats ≈ 17.0, then a dome ≈ 1.3 | T1 (taper) / T3 (split) | res_fusee §2 |
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
  - Schneckenfutter 05 08 01-2 (bore read as a 1:70 taper; the "4,1 +0,2" is a relief).
  - Staubplatte.
  - Staubfutter (square runs inside).
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
| Z | 2.54 → 3.84 (mid 3.19), within the Minutentrieb leaves 1.8 → 5.8 | T3 | inf_axial §2.3, §4.3 |

- **Mates with:** Minutentrieb; Gegenfeder (pin at R14.2); Vorreiber (⌀14 d11 in ⌀14 +0.1, T4 reading); fusee arbor.
- **CAD notes:** The wheel turns freely on the arbor and is driven through the Gegenfeder (maintaining spring).

### Staubplatte (dust plate) — 05 06 00-1

- **Source sheet(s):** `05-06/Wempe_05-06_05.jpg` (1941; N.gepr 30.4.43).
- **Material/stock:** Rundmessing 8 Din 1758 Ms58.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outside ⌀ | 7.6 −0.1 | T1 | 05 |
| Recess ⌀ | 6.2 +0.1 | T1 | 05 |
| Bore | 3.1 "Kegel 1:100", "H7 +0.012" (no nominal on the callout) | T1 | 05 |
| Thicknesses | 3.1 −0.2 overall; hub 2.1 −0.2; 0.5 +0.2; 45° | T1 | 05 |
| Z | ≈ 27.7 → 30.9, pressed onto the corners of the square at its 3.1 end | T3 | res_fusee §2 |

- **Mates with:** Fusee square (3.1 r6 seat); Staubfutter 05 08 01-3 (⌀8 H7 bore).
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
| Z | Pinned by the Vorreiberstift at Z 1.96. Exact Z band set at assembly | T4 | res_fusee §2 |

- **Mates with:** Arbor 4.38 → 4.5 seat; Vorreiberstift (⌀1.1, cone-reamed); Schneckenrad.
- **CAD notes:** The plain turned disc carries no Steg (inf_planview §2).

### Deckplatte (cover plate) — 05 06 00-4

- **Source sheet(s):** `05-06/Wempe_05-06_08.jpg` (1941; N.gepr 30.4.43).
- **Material/stock:** Bandstahl 24×1 Din 1016.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outside ⌀ | 21 −0.1 (reads "21,1" (?)) | T1 | 08 |
| Bore | 6.1 H8 +0.018 | T1 | 08 |
| Holes | ⌀1.85 −0.1; ⌀3.1 +0.1; spacing 6 ±0.05 | T1 | 08 |
| Thicknesses | 0.8 −0.1; 0.4 −0.1; angles 90°, 60°, 45° | T1 | 08 |
| Z | 18.46 → 19.68 (in the ⌀22 J-K recess) | T3 | inf_axial §2.3 |

- **Mates with:** Arbor ⌀6.1 seat; J-K recess (⌀22, 0.7(?) deep); body small end.
- **CAD notes:** It overlaps the stop-lever beak in plan (see the contradictions list).

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
| Z | 3.84 → 5.08 | T3 | inf_axial §2.3 |

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
| Body | ⌀26.1(?) −0.2 boss; ⌀24.45 +0.1; recess 0.3 +0.15 (a) with a 45° edge | T1 | 12 |
| Bore | ⌀6.5 H7 +0.015 (01 fit table: 6.5 H7/g6) | T1 | 12, 01 |
| Thicknesses | Rim plate 1.02 −0.02; 1.3 −0.1; 2.1; overall 3.1 −0.2 | T1 | 12 |
| Holes | 2 × M1.7 on ⌀19.5 +0.05 (pitch-circle reading, consistent with the hole spacing scaled on 12); 1.2 H8 +0.014 at R14.2 (Gegenfeder pin); feature at 42° / 60° with 0.6 (?); 5° | T1/T3 | 12 |
| Z | 5.08 → 6.32 | T3 | inf_axial §2.3 |

- **Mates with:**
  - Gegenfeder.
  - Two Sperrkegel 05 06 02-3 with Sperrfeder 05 06 02-2. These engage the Schneckensperrad (05-06_04 Schnitt A-B).
  - Gegensperrkegel 05 05 05-1.
- **CAD notes:** The ⌀26.1(?) boss can enter the body's ⌀26.3 × 2.7 large-end recess (T4 observation). This bears on the Z overlap in the contradictions list.

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
- **CAD notes:** Pivot pin ⌀1.19 riveted in the Gegensperrad (T4).

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
| Z | In the body's large-end recess, in the plane of the Sperrkegel (05-06_04 Schnitt A-B shows them engaged). Not dimensioned | T4 | — |

- **Mates with:** Body (pins on ⌀11.5 = the "5.75r" holes); Sperrkegel ×2.
- **CAD notes:** inf_axial §2.3 lists a "Schneckensperrad" at Z 16.84 → 18.32. Do not use it (see the contradictions list).

### Gegensperrkegel (maintaining detent) — 05 05 05-1 (kompl. 05 05 05)

- **Source sheet(s):** `05-05/Wempe_05-05_12.jpg` (part, 1944). Kompl.: `05-05/Wempe_05-05_11.jpg`.
- **Material/stock:** Bandstahl 2.25 × 18 DIN 1016; "härten in Öl, 310° hell-blau anlassen"; "um die Bohrung 400° anlassen"; "nach dem Stanzen flachdrücken"; "Tol ±0,1".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Bore | 2.25 H7 +0.009, Kegel 1:70 | T1 | 05-05_12 |
| Thickness | 2 / 1 −0.03 | T1 | 05-05_12 |
| Outline | 14.2; 8.6; 5; 2.6; 80°; 150°; R18; R12 −0.1; R9; 9.645; 6.273 | T1 | 05-05_12 |
| Arbor 05 05 05-2 | No sheet. Kompl. gives "7,5" (before riveting, "vor dem aufschlagen") and 6.3 ±0.1 | T1 | 05-05_11 |
| Pivot | Hole 4 at **(6.425; 36.437)**, "Körner, 0,9" in both the lower and the upper plate tables. 23.51 from the fusee axis | T1 | 03a, 01a |
| Nose | (17.56; 33.55), bearing 345.5° from hole 4. Nose radius 11.506 ("9,645 / 6,273" read as nose offsets) on the mid-tooth R18.275 | T3/T4 | inf_planview §2 (Clicks) |
| Z | Gegensperrad plane, 5.08 → 6.32 | T3 | inf_axial |

- **Mates with:** Gegensperrad teeth; wire spring; plate hole(s) 4.
- **CAD notes:** The upper bearing and Z of the 6.3-long arbor are not drawn (see the contradictions list).

### Drahtfeder (wire spring for the Gegensperrkegel) — none (no sheet)

- **Source sheet(s):** None. Screw hole on `05-08/Wempe_05-08_01a.jpg` (upper-plate table only). "Drahtfedermitte" marked on `05-06/Wempe_05-06_04.jpg` Schnitt A-B.
- **Material/stock:** Steel wire ⌀0.4 (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Fixing | Hole 5 at **(10.684; 38.507)**: "Körner, 1,3, M 1,7" in the upper plate. \|4 − 5\| = 4.735 | T1 | 01a table |
| Form | ⌀0.4 wire coiled once under an M1.7 screw at hole 5. The free leg presses the Gegensperrkegel tail so the nose engages the Gegensperrad | T4 | Resolved_Design §4 |

- **Mates with:** Gegensperrkegel.
- **CAD notes:** The wire must bridge from the upper plate (Z 19.0) to the click plane (Z ≈ 5–6). The leg geometry is designed, not drawn.

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

### 3.5 Stop-work (05-06_04 Schnitt C-D; no part sheets)

All plan values are in the plate frame (viewed from the back). For plate-fixed parts, the 05-06_04 C-D view maps to the plate by a **+25.39° rotation** about the fusee axis (not mirrored).

### Stellungssteg (stop bar) — callout 05 06 03-1 (no sheet)

- **Source sheet(s):** No part sheet. Drawn schematically on `05-06/Wempe_05-06_04.jpg` Schnitt C-D ("Stegstellung", "Stellung im aufgezogenen Zustand").
- **Material/stock:** Steel, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Location | On the fusee **small end** | T3 | Resolved_Design |
| Contact radius | **r ≈ 6.95** (Steg end), T3 ±0.8. Give the Steg radial extent from r 6.95 inward to ≤ 6.0, so it overlaps the beak face (R 6.31–6.78) by ≈ 0.6 | T3 / T4 (extent) | res_fusee §3; inf_planview |
| Phase | **ψ_S − ψ_N = −3° ±4°** (range −7° … +1°), i.e. 3° CW of groove end N viewed from the back. In body coordinates **φ_CAD = 141° ±4°** (N at 144°) | T1 (kinematics) / T3 | Resolved_Design; res_fusee §3 |
| Plate position at full wind | Bearing 263.0° from the fusee axis, so the Steg end is at **(15.861; 8.394)** | T3 | φ_CAD + 122.26° |
| Stop | At w = 8.761 turns = 56.3 h. Window 8.711 (56 h) → 8.85 (N) | T1 | closure.py |
| Section / mounting | Bar 1.0 wide × 1.0 high, seated in the body's ⌀15 × 1.6 small-end counterbore and held by an M1.7 screw in one of the counterbore holes | T4 | — |

- **Mates with:** Stellhebel beak; Schneckenkörper small end.
- **CAD notes:**
  - Superseded placements: a stop element "35° CW of N", and pin hole A. Do not use either.
  - A is at r ≈ 17, out of the lever's reach (R 6.3–6.8).

### Stellhebel (stop lever) — none (no sheet)

- **Source sheet(s):** No sheet. Outline scaled from `05-06/Wempe_05-06_04.jpg` Schnitt C-D, mapped to the plate (inf_planview §2; ±5 % R + 0.3).
- **Material/stock:** Steel, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | Straight bar, width **1.94** (the drawn "2" is not dimensioned across the bar) | T3 | inf_planview |
| Centreline | From the top end (6.02; 26.38) to the tip (17.20; 2.83); length 26.07; direction 295.4°; 4.90 from the fusee axis | T3 (±1.0 / ±0.9) | inf_planview |
| Edge corners (unit vector toward the tip u = (0.4289; −0.9034); outer side, away from the fusee, n = (−0.9034; −0.4289)) | Top end: outer (5.144; 25.964), inner (6.896; 26.796). Tip: outer (16.324; 2.414), inner (18.076; 3.246). The tip is chamfered ("3,2" to the 3.2 line) | T3 | Derived from the centreline ± 0.97·n |
| Beak (stop face) | Projects 0.89 inward from the inner edge. Stop-face corners **(16.33; 9.00)** and **(15.53; 8.61)**, 20.13 along the lever from the top end, face perpendicular to the lever. The beak extends ≈ 1.0 toward the tip, to (16.759; 8.097) and (15.959; 7.707) | T3 | inf_planview |
| Stop-face reach | R 6.31–6.78 about the fusee axis; bearing **263.0°** | T3 | inf_planview |
| Pin contact | The outer edge rests on the banking pin in the wound state. As scaled, the outer edge intrudes **0.40** into the ⌀1.6 pin at R14.000 (pin centre 1.37 from the centreline) | T3 | Computed from the values above |
| Trim | Resolved_Design: "stop face trimmed 0.6 so it clears the banking pin at its table position". Model: recess the outer edge locally at the top end to 0.57 from the centreline, over the pin zone ((5.505; 26.136) → (7.221; 22.522)). Keep the beak at R 6.3–6.8 | T4 | Resolved_Design (see the contradictions list) |
| Thickness / Z | Not given anywhere. Model 0.5 thick (T4). The Z plane is undetermined | T4 | — |
| Unresolved C-D values | "22.5" (tip to the solid/dashed transition), "12", "1.76", "1.5"; a dashed alternate beak 3.6 above | — | inf_planview |

- **Mates with:** Stellungssteg; banking pin (hole 7); Stellfeder; lever pivot; band (top turn).
- **CAD notes:**
  - On the top turn, the band crosses the lever near C-D y ≈ −10 (on the "3,3" extension line). That is how the band moves the lever into the Steg's path.
  - **Plane constraint.** The bar's inner edge passes 3.93 from the fusee axis (at 14.6 along the lever). It therefore lies inside the Steg's swept band (r 6.31–6.95) from about 8.9 to 20.3 along, and crosses that band a second time at about 8.9–9.7 along (bearing ≈ 150–154°). If the bar and the Steg share one plane, the Steg hits the bar body about 0.3 turn before the beak, so winding stops near 54 h instead of 56.3 h. Keep the bar body clear of the Steg's Z band. Only the beak, with its stop face, may reach down to the Steg's level (T4 design constraint).

### Anschlagstift (banking pin) — 05 08 01-5, plate hole 7

- **Source sheet(s):** `05-08/Wempe_05-08_01a.jpg` (row 7). Assembly `05-08/Wempe_05-08_02.jpg` ("unten vorstehend").
- **Material/stock:** Steel pin, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Position | Hole 7 **(5.676; 23.911)**: "Körner, 1,45, 1,6 +0,009" | T1 | 01a |
| Radius from the fusee axis | **R14.000** (= C-D "14"); bearing 142.00° | T1 | inf_planview |
| Pin ⌀ | 1.6 (press in the 1.6 +0.009 hole) | T1/T2 | 01a |
| Projection | Below the upper plate ("unten vorstehend"); length T4 = lever Z band + 0.3 | T1 / T4 | 05-08_02 |

- **Mates with:** Stellhebel outer edge.
- **CAD notes:** The pin is drawn at R14.84 (C-D) and R15.01 (001). Use the table value.

### Stellfeder (stop-lever spring) — none (no sheet)

- **Source sheet(s):** None.
- **Material/stock:** Steel leaf, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Form | Steel leaf **0.15–0.2 × 1.5 × ≈ 14** | T4 | Resolved_Design |
| Fixing | Screwed to the upper-plate underside. No table hole is allotted, so position it freely | T4 | Resolved_Design |
| Function | Holds the lever out of the band's path until the top turn | T4 | Resolved_Design |

- **Mates with:** Stellhebel; upper plate.
- **CAD notes:** —

### Stellhebel-Drehpunkt (stop-lever pivot) — none (no sheet)

- **Source sheet(s):** None. Weak candidate from `05-06/Wempe_05-06_04.jpg` C-D (a thin R ≈ 3.15 arc on the "3,2" line).
- **Material/stock:** Steel pivot screw or stud, T4.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Position | Candidate **P1 = (15.17; 5.93)**, ±1.5. This is near the tip end, 9.49 from the fusee axis | T4 | inf_planview |
| Form | Shouldered stud or screw in the upper plate | T4 | — |

- **Mates with:** Stellhebel; upper plate.
- **CAD notes:** With the pivot at P1, a 0.4 swing at the pin end moves the beak by only ≈ 0.06.

---

### 3.6 Power assembly and adjustment

1. **Barrel.**
   - Hook the mainspring inner eye on pin 05 07 02-2 and the outer end on the 45° M2.6 hook (7.85 above the floor).
   - Press the cover in (r6 into s6), with notch 1 aligned over the floor slot.
   - Fit the arbor between lower-plate hole 45 and bridge hole 45.
   - **Barrel end-shake 0.10** (22.35 − 22.25). Drum shake on the core: 0.05 +0.06.
2. **Fusee.**
   - Assemble Schneckenrad, Gegenfeder and Gegensperrad (with its two Sperrkegel and Sperrfeder) on the arbor, and secure them with the Vorreiber and Vorreiberstift (Z 1.96).
   - The body is pressed on the collar with its large face at Z 5.91, and the Schneckensperrad is pinned in the large-end recess.
   - Fit the Deckplatte on the ⌀6.1 seat.
   - Press the Auf-u-Ab-Trieb on the 1.6 pivot (outer face at Z −9.45).
   - **Fusee end-shake 0.04** (Schneckenfutter end 19.65 − shoulder 19.61; allowed 0.02–0.05).
3. **Band hooking** (fusee run down, w = 0).
   - Seat the throat of Bandhaken rund 05 07 03-2 on the ⌀0.55 cross-pin in the 0.8 slot at A (t = 0, large end).
   - Lead the band along the open belt (south tangent) to the barrel.
   - Hook 05 07 03-3 into the barrel's oblique 2.5 slot. Cut that slot now, at fusee assembly, at Z ≈ 17.7.
   - Wind the band onto the barrel by turning the drum CW from the back (≈ 5.25 turns at ≈ 2 mm lay per turn). Do this **with the barrel click lifted** (or before the Sperrad is fitted), so the arbor turns with the drum and the unset spring is not driven past zero in the let-down direction. Then re-engage the click and do step 4.
4. **Mainspring set-up (ratchet clicks).**
   - With the fusee run down and the band taut, turn the barrel arbor **CW from the back** by **¾ turn = 12 clicks** of the z16 Sperrad (22.5° per click). This is the drawn set-up on 05-06_20, "¾ Umgang gespannt".
   - The click 05 08 05-2 then holds the arbor against CCW.
   - closure.py checks the turn budget with a conservative 1.0-turn set-up: usable 6.31 turns at t 0.39 against 4.93 needed.
   - Fine-tune the set-up by ±1 click until the Kraftverlauf is flattest (target ±3.7 % over 0 → 8.761 turns, sheet 20).
5. **Stop-work phasing.**
   - Wind the fusee CCW from the back to w = **8.761** turns (56.3 h; band tangent at plate bearing 298.3°).
   - At that point the Stellungssteg (body φ_CAD 141° ±4°, r 6.95) must arrive at the beak (plate bearing 263.0°), with the lever's outer edge resting on the banking pin at R14.000.
   - Check that the stop falls inside the window 8.711 (56 h) … 8.85 (groove end N): +0.05 / −0.09 turns.
   - Check that the Stellfeder keeps the lever clear of the Steg on all lower turns.
6. **Maintaining power.**
   - During winding (fusee CCW from the back), the Gegensperrkegel at hole 4 (wire spring at hole 5) holds the Gegensperrad.
   - The Gegenfeder keeps driving the Schneckenrad.
   - When running, the Schneckensperrad (8° undercut faces) drives the Gegensperrad through the two Sperrkegel.

---

### 3.7 Contradictions and open points in this section (not resolved by the sources)

1. **Core ⌀ vs length (resolved).** 11.7 is the core *length* (res_barrel §3b); the diameter is ⌀13.3. An earlier resolution file misread it as a diameter; corrected here and in closure.py.
2. **Schneckenkörper axial position.** 03-2's 13.7 −0.1 gives a large face at Z 5.91. The section gives 6.49, which would put the small face at 19.09, past the plate face at 19.0. res_fusee leaves this open. At 5.91 the body overlaps the section's Gegensperrad top (6.32). This spec uses 5.91 as provisional.
3. **Schneckensperrad Z.** inf_axial places it at 16.84 → 18.32, near the small end. 05-06_04 Schnitt A-B and the 02-2 large-end recess put it at the large end with the Sperrkegel. Its Z is not dimensioned.
4. **Lever pin trim.** The scaled geometry shows a 0.40 intrusion into the pin; Resolved_Design states "trimmed 0.6". It also calls the trimmed edge the "stop face", whereas the intrusion is at the pin end.
5. **Stop-lever Z.** It is undetermined. The beak (R 6.3–6.8) lies inside the ⌀21 Deckplatte footprint (Z 18.46 → 19.68), and the Steg height is not given. The bar body also crosses the Steg's swept band in plan, so the lever must be stepped: only the beak may reach the Steg's level (see the Stellhebel CAD notes).
6. **Gegensperrkegel arbor.** It is 6.3 long, but hole 4 appears in both plate tables. Its upper bearing and Z are unknown. The wire spring is fixed on the upper plate, 13 above the click plane.
7. **Sperrad part number.** The brief says 05 07 03-3. The sheet reads 050700-3, and 05 07 03-3 is the Bandhaken f. Trommel.
8. **Plate-frame conversion.** The +25.39° rotation applies to the 05-06_04 C-D view only. For body φ_CAD use the wind-state formula in §3.4. The table's last row (t 8.858, 141.1°) differs from the governing t_N = 8.85 (144°).
9. **Gegensperrad holes.** The "19,5 +0,05" is read as the M1.7 pitch-circle ⌀; the boss ⌀ reads "26,1" (?).
10. **Steg vs beak radius.** The Steg contact r ≈ 6.95 lies outside the beak face's R 6.31–6.78. The overlap depends on the T4 radial extent given to the Steg.

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
| Front shoulder | Z −4.05 (−4.08 at the bushing face, end-shake 0.03) | T1 | inf_axial §2.1 |
| Front pivot length | **3.0, tip Z −7.05 OVERRIDDEN (drawn: 4.6 −0.2, superseded)**. It ends in the Zwischenbrücke bushing, 0.30 inside the bridge outer face (−7.35). 3.0 equals the 1940/43 kompl. "3 -0,1" | T4 (fitted, R1) | Resolved R1 ("≤ the 4 bridge") |
| Pivot ends | "Kegel 1:90" points; turn off when the pivots are cut to length | T1 | 05-05_07 |
| Shoulder chamfer | 30° | T1 | 05-05_07 |

- **Mates with:**
  - Minutenrad (Z 0.5–1.8 lies inside the leaves −0.25–4.35).
  - Zwischenrad (riveted).
  - Upper-plate bearing at hole 38.
  - Zwischenbrücke bushing at hole 38 (drawn hole ⌀4.94 T3; seat 5.2 H7 T4).
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
  - Meshes the Gangtrieb (escape pinion) z10 at c = 11.850. The Gangtrieb leaves span Z 2.71–6.61.
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
  - Upper-plate jewel at hole 35.
  - Zwischenbrücke front hole jewel at 35 (drawn hole ⌀3.27, jewel Z −6.13 → −5.05, T3).
  - Zeigerfutter on the tip; dial hole ⌀1.7.
- **CAD notes:**
  - The tip clears the hour hand (Z −13.50) by 0.53.
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
| Stud (Anrichtstift) | Steel. Pressed into lower-plate hole 19 (kalibr. ⌀3.50 +0.012); running ⌀1.5; Z 0.0 → −10.30 | T1 hole / T4 stud | 05-08_03a |

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
| Collar OD (between the wheel and the step) | ≈ 8.5 | T3 (scaled from 05-02_08 in this compilation, ±0.3) | — |
| Bore | ≈ 3.7, running on the Viertelrohr tube | T3 (scaled, ±0.2) | — |
| Tip Z | −14.64 (governs); wheel plate face −6.44, step −11.64 | T3 tip / T1 lengths | inf_axial §2.4 (the section draws the pipe ≈ 8.0) |

- **Mates with:** Stundenrad, Viertelrohr tube, hour hand (⌀4.4 H7, Kegel 1:70), dial centre hole ⌀6.0.
- **CAD notes:**
  - **Open axial conflict (not resolved by any source):** the drawn 5.2 puts the collar step at Z −11.64, at the dial outer face. Then:
    - a collar of ≈ ⌀8.5 cannot pass the ⌀6.0 dial hole (dial −10.35 → −11.65);
    - the 3.1 hour-hand pipe (blade outer face −14.15) would end at −11.05, 0.59 inside the collar.
  - Model the drawn lengths at these positions and treat this as an open item (see 4.8).

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
| Bore | ⌀1.5 running ("Laufsitz auf Anrichtstift") | T3 (scaled from 05-02_10, ±0.2) | — |
| OD below the wheel | ≈ 3.4 | T3 (scaled) | — |
| General tolerance | ±0.05 | T1 | 05-02_10 |
| Z (after the raise) | plate end −3.42; wheel −8.37 → −9.40; seat −10.80 → −12.20; dial end −12.20 | T1 chain / T4 | — |

- **Mates with:**
  - Auf u. Abrad, stud, dial hole ⌀3.2 (the hub passes through it).
  - Auf-u-Ab hand (⌀2.2 H7).
- **CAD notes:** this override is not in Resolved_Design (flagged in 4.8).

### Auf-u-Ab stud (Anrichtstift) — no part number

- **Source sheet(s):** no part sheet. `05-02/Wempe_05-02_01.jpg` (stack, "12,7" printed beside it).
- **Material/stock:** steel (T4).

| Feature | Value | Tier | Source |
|---|---|---|---|
| Plate seat | pressed into lower-plate hole 2, ⌀3.50 +0.012 (Festsitz), through the 3.35 plate | T1 hole | 05-08_03a |
| Running ⌀ | 1.5 | T3 | 05-02_10 hub bore |
| Z | top −0.16 (≈ flush with the plate inner face) → end −11.0 | T3 | inf_axial §2.8 |

- **Mates with:** Auf-u-Ab hub, lower plate.
- **CAD notes:**
  - The "12,7" on 05-02_01 cannot be assigned with certainty. A 12.7 stud from Z 0 would pass the hub end (−12.20); keep the stud end at −11.0.

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
| Z | −9.45 → −6.54 | T3 | inf_axial §2.3 |
| Plan position | (16.708; 15.292) | T1 | — |

- **Mates with:** Auf u. Abrad (c 18.400), fusee arbor.
- **CAD notes:** rotation CW from the back while running.

---

### 4.5 Hands

All Z values are the section values from inf_axial (T3, ±0.4).

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
| Z | blade −16.10 → −16.75, on the Viertelrohr square (−18.23 → −14.73) | T3 | inf_axial §3.7 |

- **Mates with:** Viertelrohr □2.6 r6.
- **CAD notes:**
  - Blend the widths with smooth tangent arcs through the listed stations.
  - Rotation: CW from the dial.

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
| Z | blade −13.50 → −14.15 | T3 | inf_axial §3.7 (dial → hand 1.78, cf. "1,8" on 05-02_01) |

- **Mates with:** Stundenrohr ⌀4.4 r6, Kegel 1:70.
- **CAD notes:**
  - It sweeps r 23 over the seconds arbor; clearance to the cut tip (−12.97) is 0.53.
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
| Z | blade −11.95 → −12.43 | T3 | inf_axial §3.7 |

- **Mates with:** Auf-u-Ab hub seat ⌀2.2 r6 (−10.80 → −12.20 after the raise).
- **CAD notes:**
  - The ⌀4.4 boss cannot enter the ⌀3.2 dial hole, so the hand can engage only the part of the seat outside the dial face (≈ 0.55). Flagged in 4.8.
  - Phase: the hand points to "0" at full wind.
  - Rotation: CW from the dial while running.

### Sekundenzeiger (seconds hand) — 05 02 01-1

- **Source sheet(s):** `05-02/Wempe_05-02_05.jpg`.
- **Material/stock:** "Bandstahl 30 × 0,6 Din 1016"; "gehärtet, läppen, blau anlassen".

| Feature | Value | Tier | Source |
|---|---|---|---|
| Hole | ⌀1.2 +0.05 | T1 | 05-02_05 |
| Boss | ⌀3.2 outer; raised boss 2.5 long in the section | T1 | 05-02_05 |
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
| Fixing holes | ⌀1.8 H7 (+0.009), "Senkung 1,0 tief", on the ⌀101 circle (r 50.5): two at θ ≈ 120° and 240°; at the top one at θ ≈ −6° and a ⌀1 hole at θ ≈ +6° ("6°" each side of 12); "1,1" printed at a hole (unassigned) | T1 dia / T3 angles (±3°) | 05-02_12; Werkring 05-08_07 "50,5", "6°" |
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
| Minutentrieb | ⌀1.2 × 3.0, tip Z 22.0 | ⌀2.2 e8 journal in the lower plate; tip cut flush with the Viertelrohr at Z −18.23 | 0.00–0.05 (boxed "19 +0,05" against the 19.0 plate gap) |
| Zwischentrieb | ⌀0.85 × 3.0, tip Z 22.0 | ⌀0.85 × 3.0 in the Zwischenbrücke bushing, tip Z −7.05 | 0.03 (0.03–0.13 over the 23.05 −0.1 tolerance) |
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
| Sekundenrad → Gangtrieb (escape pinion z10, d 2.634, OD 2.97) | 80 / 10 | 8 | 11.850 (35–26) | 11.850 | 4.12–5.12 ⊂ 2.71–6.61 |
| Viertelrohr → Wechselrad | 14 / 56 | 1/4 | 12.600 (1–19) | 12.600 | −4.40…−5.40 ⊂ −3.93…−6.4 |
| Wechseltrieb → Stundenrad | 18 / 54 | 1/3 | 12.600 (coaxial) | 12.600 | −6.44…−7.49 ⊂ −6.00…−8.60 |
| Wechselrad → Zeigerstelltrieb (conditional) | 56 / 16 | 3.5 | 12.960 (19–18) | 12.960 | −4.40…−5.40 ⊂ −3.70…−6.10 |
| Auf-u-Ab-Trieb → Auf u. Abrad | 12 / 120 | 1/10 | 18.400 (10–2) | 18.400 | −9.40…−8.37 ⊂ −9.45…−6.54 |

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
| Auf-u-Ab hand | −11.95 → −12.43 | T3 |
| Seconds hand / arbor tip | −12.08 → −12.42 / −12.97 | T3 / R1 |
| Hour hand | −13.50 → −14.15 | T3 |
| Stundenrohr tip | −14.64 | T3 |
| Minute hand | −16.10 → −16.75 | T3 |
| Viertelrohr end = Minutentrieb front tip | −18.23 | T1 / R1 |

### 4.8 Open items in this section (not resolved by the sources)

1. **Stundenrohr / hour hand / dial stack.** The drawn 5.2 and 8.2, the ≈⌀8.5 collar (scaled), the ⌀6.0 dial hole and the 3.1 hour-hand pipe do not close at the T3 Z positions (see Stundenrohr).
2. **Auf-u-Ab hub.** Shortened 5.2 → 4.95 so that the Resolved 0.25 raise does not drive the hub 0.18 into the lower plate. This is a compiler's fit, not in Resolved_Design.
3. **Auf-u-Ab hand.** The boss ⌀4.4 and 1.4 height against the ⌀3.2 dial hole: only about 0.55 of the 1.4 seat can be engaged. The needle length beyond "9,5" is undimensioned (T4 tip r 12.5).
4. **Wechselbutzen.** The T3 wheel Z would put the drawn hub into the plate; refitted (T4) within the T3 band.
5. **The meaning of l / f / ℓ** on the wheel tables is undefined. It is used here as the tooth thickness (T4).
6. **Kompl./part disagreements:**
   - Stundenrad thickness: kompl. "1 -0,1" against part "1,05 -0,03".
   - Minutentrieb front zone: both "Kegel 1:90" and "2,2 e8" are printed there.
7. **Dial part number.** The brief names the dial "05 02 00-1". Sheet 05-02_12 reads "05 02 00-4"; 05 02 00-1 is the Minutenzeiger.
8. **Values scaled by the compiler from the JPGs, not taken from the precedence sources** (T3, to be confirmed):
   - Stundenrohr collar ⌀≈8.5 and bore ⌀≈3.7;
   - stud and hub bores ⌀1.5 (05-02_06, 05-02_10);
   - Wechseltrieb face width 2.6;
   - Auf-u-Ab hub OD 3.4;
   - the re-reading of the seconds-subdial rings as ⌀37 / 33 / 23;
   - the dial fixing-hole angles.
9. **Compiler fits (T4) not in Resolved_Design, awaiting sign-off:**
   - Auf-u-Ab hub 4.95;
   - Wechselbutzen and Stundenrad Z chains;
   - Zwischentrieb front pivot 3.0;
   - Zeigerstelltrieb Z;
   - Auf-u-Ab hand tip r 12.5.

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
| Escape endstones (faces) | −2.015 / 20.815 | T4 |
| Gangtrieb leaves | 3.30 → 8.30 | T1/T3 |
| Gangradbutzen | 12.30 → 17.00 | T1 |
| Gangrad rim / crossings | 17.00 → 18.40 / 17.00 → 17.80 | T1/T3 |
| Auslöserolle | 15.50 → 17.10 | T1 chain |
| Heberolle | 17.10 → 18.70 (Hebestein 17.00 → 18.70) | T1 chain; section 16.97 → 18.70 (IA) |
| Gangfeder (Steg) | 15.88 → 16.88 | T3 (IA section 15.76 → 16.88) |
| Gangfederkloben | 12.50 → 19.00 (hangs from the upper plate) | T4 |
| Balance endstones (faces) | 10.175 / 35.825 | T4 (span 25.65, RD) |
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
| −2.00 | lower pivot tip |
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
  - The horn tip computed from the layout lies 1.80 from B. The layout's own scale reading is 1.65 (IE). The discharge stone reaches r 1.65–1.71, so the tip must sit within about 1.69 of B to unlock. Shape the "Anschrägen" chamfer, or let the horn lean, so the Goldfeder and horn tip reach r ≈1.67. This mismatch is listed in 5.12.
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
| Blade | 0.15 thick (in plan) × 1 wide (axial) | T1 | "0,15", "1" |
| Foot | 2 wide × 2.4 long at the root end | T1 | "2", "2,4" |
| Fixing hole | ⌀0.7 +0.05, 1.2 from the root end | T1 | "0,7 +0,05", "1,2" |
| Mounting | Foot pinned to the Viereck (s 8.7–10.7); blade runs toward the horn; tip at the horn tip, overhang 0–0.05 | T3 | IE §5 |
| Side | On the W side of the horn (plan bearing 248° side). The discharge stone, turning CCW from the back, pushes it against the horn and lifts the detent away from the wheel | T2 | C (unlocking geometry) |
| Z | Blade Z 15.88 → 16.88; foot Z 14.88 → 16.88 | T4 | C |
| Layout labels | "Biegungspunkt der Goldfeder"; "0,04" and "0,4" near the blade (meaning not established) | — | AU |

- Mates with: Gangfeder (Viereck, horn); Auslösestein.
- CAD notes: the Goldfeder–stone radial overlap is about 0.02 and is very sensitive. Set it at assembly (IE §5).

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
| Steady pins | 2 × ⌀0.9 at ±5.0 along the long axis, ±2.0 across, on opposite sides ("2,3", "12,3", "2"). No matching plate-table rows: drill at assembly | T1 / T4 | 05-04_03; IP |
| Banking arm | 3 wide, rising from the block parallel to the detent; overall 25 from the block's far edge; M1.2 banking screw **18.8 ±0.03** from the M1.7 axis, 7 from the arm end; clamping slit 0.3 | T1 | "3", "25", "17,5", "15", "7", "M1,2", "18,8 ±0,03", "0,3" |
| Other drawn values | "1,4 +0,1", "3r", "0,9", "0,4", "2", "2,8", "12,3", side view "3", "2,3 +0,02", "6,5 +0,05" | T1 (verbatim) | AU |
| Axial (T4) | Hangs from the upper-plate inner face: block Z 12.50 → 19.00 ("6,5 +0,05" read as the axial height); detent M1 axis at Z 15.88 — **OVERRIDDEN (drawn: "2,3 +0,02" from a face, datum not established)**; banking arm Z 14.88 → 17.88 | T4 | C; IA could not isolate the Kloben |
| Footprint, as placed on row 13 in IP (unmodified 14.6 × 7.5, long axis 68.00°) | Corners (33.793; −8.065), (40.747; −10.874), (35.279; −24.411), (28.325; −21.602) | T1/T3 | C (IP placement, re-angled) |

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
| Tip radius | **1.71** required; 1.65 scaled; protrusion ≈0.3 beyond the body | T2 / T3 | IE §5 (needed lift 0.334 at the tip) |
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
- jewel span 25.65 (RD), endstone faces Z 10.175 / 35.825.

Check: the Heberolle top lands at Z 18.70, which is exactly IA's section value.

| Feature | Value | Tier | Source |
|---|---|---|---|
| Overall | **25.6 −0.02** (= 13.0 + 12.6) | T1 | RD; "Länge der Unruhwelle 25,6" (05-03_1) |
| Lower pivot | ⌀**0.21**, cylindrical 0.4 (Z 10.20 → 10.60), then a curved cone ("6ϕ" call-out unresolved) to ⌀1.25 at 2.0 from the end (Z 12.20); "in Lagerstein einpassen", polished | T1 | 05-03_3-2 detail |
| Lower body | ⌀1.25 −0.02, Z 12.20 → 17.10 (end of the 6.9 zone); discharge-roller seat Z 15.50 → 17.10 | T1 / T4 seat | "6,9", "1,25ϕ -0,02" |
| Impulse-roller seat | ⌀1.65 −0.02, Kegel 1:70, 1.6 long, Z 17.10 → 18.70 | T1 | "1,6", "1,65ϕ -0,02", "1:70"; 05-04_04 "1,65ϕ s6 +0,022/+0,015" |
| Roller shoulder | Z 18.70, **4.1 −0.05** below the Unruhauflage | T1 | "4,1 -0,05"; 05-04_01 "4,1 bis Unruhauflage" |
| Body under the brass collet | ⌀2.63 −0.06, Z 18.70 → 21.00 | T3 | 05-04_04 "2,63ϕ -0,06" (seat geometry) |
| Unruhauflage (flange top = arm seat) | Z 22.80; 13.0 below the upper tip | T1 | 05-03_3-2 "13,0" |
| Collar above the flange | "2,40ϕ -0,02" (1965). **Not used**: the arm seats on the 05-04_04 spigot 2 h6 (see 5.12) | — | AU |
| Collet zone | ⌀1.65 −0.02 (Kegel 1:70 per the collet bore), Z 22.80 → 28.90 ("6,1") | T1 | 05-03_3-2 |
| Upper zone | Z 28.90 → 35.80 ("6,9"): Kegel 1:70 down to ⌀1.25 −0.02; upper pivot zone 2.0 (Z 33.80 → 35.80); pivot ⌀0.21 × 0.4 cylindrical (Z 35.40 → 35.80) | T1 | 05-03_3-2 |
| Arm fixing | "nach Bohrlehre 2x M1" in the flange | T1 | 05-03_3-2 |
| End-shake | 0.05 (span 25.65) | T1/T4 | RD; CL |

- Mates with: balance jewels (5.10); Heberolle; Auslöserolle; Unruhauflage collet and arm; Spiralrolle.
- CAD notes:
  - 05-04_04 (14.03 lower length) is a pre-form between centres. Do not use its lengths (superseded staff family ≈14).
  - The staff passes through upper-plate hole 23 (⌀10.0). The flange at Z 22.10 → 22.80 lies inside that hole.

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

| Feature | Value | Tier | Source |
|---|---|---|---|
| Outer ⌀ (brass) | **32.32 −0.04** | T1 | 05-03_4 |
| Layer interface ⌀ | **31.29 −0.04** (brass 0.515 radial) | T1 | 05-03_4 |
| Inner ⌀ (Ni-steel) | **30.48 +0.04** (Ni-steel 0.405 radial) | T1 | 05-03_4 |
| Rim height | **3.8** (Z 22.80 → 26.60) | T1 | 05-03_4 |
| Cuts | 2 cuts, **1.5 +0.2** wide, at **90° to the arm** (planar radial cuts) | T1 | 05-03_4 |
| Arm | Ni-steel, integral with the inner layer, at the rim's lower face (Z 22.80 → 23.95); thickness **1.15** | T3 | RH ("1,15" read; drawn 1.16). AU reads 1.5 (see 5.12) |
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
| **Fitted mass** | **1.525 g each** | T4 (the one fitted parameter, R5) | RD |
| Length | **≈6.45** (Z 22.80 → 29.25, lower end flush with the rim's lower face). The drawn length 6.0 gives 1.42 g. Trim the length to reach 1.525 g | T4 / T3 (drawn 6.0) | RD; RH. **OVERRIDDEN (drawn: 6.0)** |
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
| Active length | **≈504** (503.96) = **≈11.77 helical coils** (462.86) + **2 terminal curves × 20.55** (centreline) | T1 | RD; RH §2 |
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
| Curve length 0 → 220° | 20.55 (centreline); 19.99 inner / 21.12 outer | T3 | RH §1 |
| Curve length 0 → 224° / 250° | 20.79 / 22.38 | T3 | RH §1 |
| 05-03_1 "unterer / oberer Ansteckungspunkt" | 15° / 20° (a 5° phase between the pinning points) | T1 (reading) | RH §4 |

**Both terminal curves** use this table (RD). The upper (stud) curve is the lower curve mirrored: rotated 180° about a horizontal axis through the spring centre. This keeps the LH hand.

**Plan placement (C, from the LH hand).** Let θ_pin be the plan bearing of the collet pin and θ_stud that of the stud pinning point.
- **Lower (collet) curve:** bearing = θ_pin − 220° + φ (φ increases CCW from the back). The sheet is therefore this curve seen from the dial side.
- **Upper (stud) curve:** bearing = θ_stud + 220° − φ.
- **Closure:** θ_stud = θ_pin − (220 + 11.77 × 360 + 220) = θ_pin + 2.8° (mod 360). Both pinning points sit at nearly the same bearing. This agrees with 05-03_5, which draws the collet pin and the stud at the same place.
- **CAD choice (T3/T4):** θ_stud = **15.0°** (stud slot, see the Klötzchen below), so θ_pin = 12.2°. The collet is turned on the staff at assembly.

**T2 Phillips alternative (option, for isochronism simulation only).** From IE §7, T2:
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
- the attachment moves to 302.8° on both ends;
- the active length becomes 462.86 + 2 × 25.35 = 513.6 (+1.9 %);
- refit the weight mass (5.11).

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
| Pin height | "Körner anbringen" **0.75 ±0.05** from the lower face. The strip's lower edge sits 0.75 above the collet bottom (RD Z 24.70) | T1 | 05-03_8; 05-03_5 |
| Pin bearing | θ_pin = 12.2° (T4, see 5.8) | T4 | C |

- Mates with: staff collet zone (1.65 −0.02, 1:70); hairspring inner end, with a taper pin ⌀0.8 → 0.77 (T4 steel or brass); balance-arm top face (Z 23.95).
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
| CAD spring hole | At the upper curve's end: r 3.55, bearing θ_stud, Z 33.94 | T4 | C |

- Mates with: cock top face Z 37.35 (arm); cock slot 1.8 H7 (leg); cock fixing screw (no item number; T4 M1.4 to suit the "1,4ϕ"); hairspring outer end (pinned, taper pin T4).
- CAD notes: the hole drilled at r 3.55 breaks out of the leg's inner face (r 3.4) by ≈0.2. The 05-03_9 note leaves the radius to assembly (see 5.12).

---

### 5.10 Jewels and settings (no sheets; T2/T4)

Bore rule: hole = pivot + 0.01–0.02 (T2). Settings are screwed chatons with 2 × M1.2 (RD §4, T4). Endstone spans: escape 22.83, balance 25.65 (RD).

| Position | Pivot | Hole-jewel bore | Jewel OD × thickness | Endstone | Setting / seat | Z (hole jewel; endstone face) | Tier, source |
|---|---|---|---|---|---|---|---|
| Balance, upper (Unruhkloben oben 05 08 03-1) | 0.21 | **0.225** (0.22–0.23) | ⌀2.0 × 0.45 | Diamond ("Diamantdecke", 05-03_1), ⌀2.2 × 0.35 | Chaton **⌀5.2** in the cock seat **5.2 H7 +0.012**; 2 × M1.2 at "3,5 +0,05" | 35.375 → 35.825; endstone 35.825 → 36.175 | T2 bore / T1 seat / T4 rest; IE §9 |
| Balance, lower (Unruhkloben unten 05 08 00-2) | 0.21 | **0.225** | ⌀2.0 × 0.45 | ⌀2.2 × 0.35 in a screwed cap | Chaton ⌀5.2 in **5.2 H7** within a **0.5 +0.03** recess; 2 × M1.2 at "3,5 +0,1 (a)" | 10.175 → 10.625; endstone 9.825 → 10.175 | as above; AF 05-08_00-2 |
| Escape, upper (upper plate, hole 26) | 0.24 | **0.255** (0.25–0.26) | ⌀2.0 × 0.40 | ⌀2.0 × 0.30 | Chaton: flange ⌀5.2 × 0.5 in the **5.2 H7 × 0.5 +0.03** seat on the plate's outer face (Z 21.85 → 22.35); body ⌀4.5 h6 into the **4.5 H7** through-bore down to Z 20.30; 2 × M1.2 at "3,5 +0,05" | 20.415 → 20.815; endstone 20.815 → 21.115 | T1 seat (AF P-Q) / T4 |
| Escape, lower (lower plate, hole 26) | 0.24 | **0.255** | Pressed jewel **⌀2.50** (bore 2.50 ±0.009) × 0.40 | Pressed endstone **⌀2.50** × 0.30 in the same bore, below the jewel | Plate bore **2.50 ±0.009** (bohren 2.3) | −2.015 → −1.615; endstone face −2.015 (endstone −2.315 → −2.015) | T1 bore / T4 stack |

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
- L = 503.96.

This gives **k = 0.4081 N·mm/rad** (C, RH §6).

**Required inertia.** I_req = k / ω² = **2584.0 g·mm²** at E 205 GPa. The range is 2458.0 (E 195) to 2647.0 (E 210) (RH §6).

**Inertia budget (RH §6, T2/T3; brass weights and nuts assumed).**

| Part | I (g·mm²) |
|---|---|
| Rim, brass + Ni-steel, less the cuts | 687.4 |
| Arm (Ni-steel, 1.15 thick) | 78.5 |
| 4 weights at the drawn ⌀6.35 × 6.0 (1.420 g each) | 1411.2 |
| 2 timing nuts + screws at r 18.6 | 290.0 |
| Staff, rollers, collet, spring / 3 | 12.7 |
| **Geometric total** | **2479.7**, giving f = **2.042 Hz** (+2.1 %); −0.4 … +3.3 % over E 195–210 |
| **With fitted weights 1.525 g** (lever 15.6² + 3.175²/2 = 248.4 per weight) | **2584.0**, giving **f = 2.000 Hz** (CL) |

**Regulation.**
- Rate is regulated by the **two timing nuts**, turned in or out together so the poise is kept.
- Moving both nuts out by one thread pitch (0.16, T4 thread) adds 2 × 0.389 × 2 × 18.6 × 0.16 = 4.63 g·mm², a **−77 s/d** change (C, T2). The 0.01 mm step is ≈ −4.8 s/d.
- At rest the timing screws point 6–12 (05-03_1 note).

**Temperature adjustment.**
- The Guillaume rim (Ni-steel + brass) is paired with the steel hairspring (RD §3).
- Middle-temperature error is corrected by **weight position**: move a weight between its used hole (30° from the cut) and its spare hole (one division, 6°). A position nearer the free end gives more compensation.
- Weight mass is the inertia trim (R5).

**Isochronism.**
- Phillips' 2nd condition is **not met** by the drawn curves: y_G 3.00 vs R²/L 1.91.
- The factory therefore finished isochronism **by adjustment** at assembly. The stud hole is "bei Montage gebohrt", so the pinning point can be chosen; the curve is set by hand.
- The fusee keeps the drive torque within ±3.7 % (RD).
- For simulation only: swap in the T2 Phillips curve (5.8) and refit the weight mass.

**Escapement checks (model must reproduce these).**

| Check | Target | Tier | Source |
|---|---|---|---|
| Wheel arc inside the impulse-roller circle | 21.65° < 24° pitch, window **2.35°** (⌀15 would give 30.38°, impossible) | T1 | RD; CL |
| Roller / tip-circle penetration | **0.39** (RD "locking penetration 0,39") | T1 | RD; IE §2 |
| Locking depth on the Ruhestein | 0.20 (stone edge r 6.80 vs tip 7.00) | T3 | IE §4 |
| Unlocking precedes impulse | **0.15** at the roller (2.5°) | T2/T3 | RD; IE §5 |
| Unlocking arc | 11° | T2 | IE §5 |
| Stone phasing | 79° | T3 | IE §5 |
| Wheel budget | 24° = 1.5 + 21 + 1.5 | T3 | IE §5 |
| Goldfeder overlap with the Auslösestein | ≈0.02 radial (lift 0.334 at the horn tip). Set at assembly | T2 | IE §5 |
| Staff end-shake | 0.05 | T1/T4 | CL |
| Escape end-shake | 0.03 | T4 | CL |
| Hairspring stack | 37.35 − 13.4 = 23.95 = arm top (residual 0.00) | T1 | CL |

Not verified: impulse energy against balance losses (amplitude). The balance quality factor is unknown (RD §3).

---

### 5.12 Contradictions between sources, not resolved here

1. **"Locking penetration 0.39" (RD) vs locking depth 0.20 (IE).** IE uses 0.39 for the impulse-roller / tip-circle penetration and 0.20 for the depth on the stone. Both are given in 5.11.
2. **Horn-tip position.** The printed 18.8 / 7.6 plus the T3 stone position put the horn tip 1.80 from B. The layout's own reading is 1.65, and unlocking needs ≤ ~1.69. The B-angle stone timing (IE) also places the discharge stone ≈0.6 from the computed horn tip at the drawn instant.
3. **Gangrad bore.** 07-2 drawing "1,8ϕ H7/h6" vs its own table "1,7ϕ".
4. **Gangrad thickness.** IE: 0.8 (T4, "per the 05-04_01 section"). 07-1 shows 1.4 overall with "0,8"/"0,7" at the crossings. IA's section gives 1.45.
5. **Gangtrieb leaf length.** 5 −0.2 (05-04_08) vs 3 (07-1) vs ≈4 drawn (07-2).
6. **Balance-arm bore.** 05-03_4 section "18ϕ H7" (1.8) vs plan "2 H7". The 05-04_04 spigot is 2 h6. 05-03_3-2 (1965) draws a "2,40ϕ -0,02" collar at the same place.
7. **Arm thickness.** 1.15 (RH) vs 1.5 (AU).
8. **Weight length for 1.525 g.** ≈6.45 (RD) vs 6.39 (RH §6 table).
9. **Weight angles.** 30° from each cut (IE, measured) vs "about ±40° from the arm" (AU, 05-03_2). There is also an unexplained "20°" on 05-03_4.
10. **Collet pin height.** "0,75" is the strip's lower edge on 05-03_5 (RH, adopted) but the Körner (pin) centre on 05-03_8, a 0.26 difference.
11. **Stud.** The pin radius 3.55 is within 0.15 of the leg's inner face (slot bottom 3.4), so a ⌀0.7 hole breaks out. The cock fixing hole is "1,4ϕ" (05-03_5) vs 1.5 H7 (05-03_9). The slot side (15° vs 195°) depends on the unstated view of 05-08_05.
12. **Gangfederkloben axial arrangement.** The drawn "6,5 +0,05", "3" and "2,3 +0,02" cannot be placed so that both the M1 foot screw and the banking screw reach the detent level shown in the section. The Z values in 5.3 are T4.
13. **Escape-wheel rotation wording.** The brief says "same sense as the Sekundenrad's pinion drive". The wheel turns with its pinion, i.e. opposite to the Sekundenrad (CW vs CCW from the back). This section uses that reading.

---

## 6. Movement assembly sequence and adjustment

This is the order a chronometer maker would follow. It is also a sensible CAD assembly order, with the mates named.

### Frame and power

1. **Lower plate on its back**, dial side up. Fit the Zwischenbrücke (dial side, 2 screws + 2 steady pins on the table rows) with the front bushings and jewels of the third and fourth wheels.
2. Turn the plate inner face up. Insert the train arbors:
   - centre (Minutentrieb + Minutenrad);
   - third (Zwischentrieb + Zwischenrad, running in the ⌀24.5 pocket);
   - fourth (Sekundentrieb + Sekundenrad);
   - escape (Gangtrieb + Gangrad).
3. **Fusee assembly** (Schnecke kompl.):
   - stack on the arbor: Schneckenkörper, Schneckenrad with the maintaining-power parts (Gegensperrad, Gegenfeder, Sperrkegel, Sperrfeder), Schneckensperrad, Staubplatte, Vorreiber and Deckplatte;
   - fit the arbor in the lower-plate hole 10 (⌀2.70, journal 2.68);
   - fit the Gegensperrkegel (maintaining click) on plate hole 4, with its wire spring on hole 5.
4. **Barrel**:
   - mainspring (15 × 0.37 × 1385) in the family-B drum, inner eye on the core hook, outer end on the 45° hook at 7.85 above the floor;
   - fit the cover; the arbor seats on ⌀4.5 hub bores.
5. **Parts between the plates that hang from the upper plate**:
   - lower balance cock (Unruhkloben unten, Z 9–19);
   - Gangfederkloben with the detent (Gangfeder) and Goldfeder, screwed on hole 13 (see §2/§5 for which plate carries each);
   - stop-work lever, spring and banking pin.

   Fit these to the upper plate first. Then fit the **pillars** (3 on R37) and close the **upper plate**: 6 pillar screws, M2.6. Pivots enter their upper bushings or jewels.
6. **End-shakes** (set by facing the bushing or setting, or by the endstone settings):

   | Arbor | End-shake |
   |---|---|
   | Train arbors | 0.02–0.05 |
   | Fusee | 0.04 (Schneckenfutter end at Z 19.65) |
   | Escape | endstone span 22.83 = 0.03 |
   | Balance | jewel span 25.65 = 0.05 |
   | Barrel arbor | 0.10 (22.35 frame span − 22.25 shoulders) |

7. **Barrel bridge** (Federhausbrücke) on the upper-plate outer face, over the ⌀42.5 crescent cut-out. Fit the Sperrad (z16) on the arbor square, the Sperrkegel (row 46) and its spring.
8. **Band**: hook 05 07 03-2 into the fusee hook slot (⌀0.55 cross-pin); wrap 4.93 turns onto the barrel; hook 05 07 03-3 into the barrel slot.
9. **Set up the mainspring.** Turn the barrel arbor at the Sperrad so that the band is under tension at let-down. Set-up is ¾ turn (drawn on 05-06_20: "3/4 Umgang gespannt").
10. **Stop-work phasing** (the lever, spring and banking pin in hole 7 at R14.000 were fitted in step 5):
    - phase the Stellungssteg on the fusee small end at −3° ±4° from groove end N, so that the stop acts at 8.761 turns (full wind, 56.3 h);
    - check that the band does not reach the groove end (8.85).

### Escapement, balance and dial

11. **Escapement check**:
    - the roller (Heberolle + Auslöserolle) is on the balance staff, which enters from the back through the ⌀10 Unruh hole in the upper plate, with its lower pivot in the lower cock;
    - check the locking, unlocking and impulse depths against §5.
12. **Balance and hairspring**:
    - collet (Spiralrolle) on the staff, bottom on the balance-arm top at Z 23.95;
    - upper balance cock (15 high) on the upper plate;
    - stud (Klötzchen) arm on the cock top (Z 37.35), leg through the 1.8 H7 slot;
    - pin both ends at r ≈ 3.5.
13. **Motion work, dial and hands** (dial side):
    - Viertelrohr (cannon pinion) friction-fitted on the centre arbor;
    - Wechselrad with Wechseltrieb on its stud;
    - Stundenrad on the Viertelrohr;
    - Auf u. Abrad on its stud (Z −9.40 → −8.37);
    - the Auf-u-Ab-Trieb on the fusee's lower end;
    - dial (front face Z −11.65);
    - hands: Auf u. Ab, seconds (on the Zeigerfutter), hour, minute.
14. **Werkring** (movement ring) on the lower plate; the movement then goes into the case (Appendix A).

### Timing (for a dynamic model)

| Target | How |
|---|---|
| Rate: balance 2.000 Hz | Weights 1.525 g each. Fine regulation by the two timing nuts: moving a nut out lowers the rate |
| Temperature | Shift weights between the drawn rim holes (4 used, 4 spare per rim sector) |
| Isochronism | The drawn terminal curves meet only Phillips' 1st condition, so expect the isochronism to need tuning (or substitute the Phillips-correct curve given in §5) |
| Escapement checks | Roller window 2.35°; roller penetration 0.39, locking depth 0.20; unlocking precedes impulse by 0.15 mm |

---

## 7. Open points: recommended defaults

The drawings leave the points below undecided. Each section lists them in full (§2.11, §3.7, §4.8, §5.12). Use the default given here unless better evidence appears. All defaults are T4.

| # | Point | Recommended default | Why |
|---|---|---|---|
| 1 | Fusee body axial position: Z 5.91 (03-2) vs 6.49 (section) | **5.91** | The part sheet is above the section for this length. At 6.49 the small face passes the plate face (19.09 > 19.0) |
| 2 | Schneckenfutter bore "4,1" vs the 4.5 → 4.39 upper journal | **Bore 4.50 H7, journal 4.48** (running fit) | A 4.1 bore cannot pass the journal; treat "4,1" as a pre-ream or misread |
| 3 | Staubfutter base and the Schneckenfutter flange at the same Z | **Stack the Staubfutter on the Futter flange** | Keeps both drawn heights |
| 4 | G-H recess on the inner or outer plate face | **Outer face** (as §2 adopts) | Drawings point to the outer face |
| 5 | Escape-wheel thickness 0.8 (part sheet) vs 1.45 (section) | **0.8** | Part sheet over section |
| 6 | Escape-wheel bore 1.8 vs 1.7 | **1.8 H7** on the Gangradbutzen h6 | The labelled fit is the mating value |
| 7 | Detent horn tip 1.80 from the balance axis (by construction) vs layout 1.65; unlocking needs ≤ 1.69 | **Set the horn length so the tip sits at 1.65** | Function governs; the horn is filed to suit in practice |
| 8 | Balance endstone recesses 1.35 / 1.35 vs 1.20 / 1.50 | **1.20 / 1.50** | Forced by the 23.95 collet seat and the 1.15 arm |
| 9 | Weight length for 1.525 g: 6.45 vs 6.39 | **≈6.45** (as §5.7) | Trim by rate anyway; 6.39 is within the trim |
| 10 | Stop-lever trim against the banking pin: 0.40 (scaled) vs 0.6 | **0.40** | Measured value |
| 11 | Stop-lever Z clashes with the Deckplatte in plan | **Cranked (stepped) lever** that clears the Deckplatte | No sheet; geometry must clear |
| 12 | Barrel square start inside the bridge bore: 0.47 vs 0.3 | **0.47** | Detailed frame closure (§2) |
| 13 | Zwischenbrücke bush seats 4.59 vs 5.2 / 5.5 | **4.59 +0.012** for the bushes (the plates' standard); **5.2 H7** for the fourth-wheel jewel | Same convention as the plates |
| 14 | Hour-wheel thickness 1 −0.1 (assembly) vs 1.05 −0.03 (part) | **1.05 −0.03** | Part sheet |
| 15 | Hour-pipe / hour-hand pipe / ⌀6.0 dial-hole stack at the scaled Z | **Keep the drawn diameters; set the hour-hand pipe so it ends 0.2 in front of the dial** | Z values are scaled (T3) |
| 16 | Auf-u-Ab hand boss ⌀4.4 vs dial hole ⌀3.2 | **The boss sits in front of the dial**; only the ⌀2.2 hub passes the ⌀3.2 hole | Hands mount after the dial |
| 17 | Auf-u-Ab hub shortened 5.2 → 4.95 after the 0.25 wheel raise | **Accept 4.95** | Otherwise the hub enters the lower plate |
| 18 | Dial number: brief said 05 02 00-1 | **05 02 00-4**, as printed | 05 02 00-1 is the minute hand |
| 19 | Barrel ratchet number: 05 07 03-3 vs 05 07 00-3 | **05 07 00-3**, as printed on the sheet | — |
| 20 | Fourth-wheel jewel height "1,7" vs the −5.13 shoulder chain | **Keep the −5.13 chain** (T1 from 24.1); set the jewel setting to suit | Shoulder span governs (R1) |

---

## Appendix A. Case and key (partial: drawn parts only)

The gimbal (Kardanring, Klobens, Feststeller, Verschlußfeder 05 01 00-3…-7) and the movement-to-case fixing have **no detail sheets**. Model them by convention, or leave them out.

| Part | No. | Sheet | Material | Drawn geometry | Tier |
|---|---|---|---|---|---|
| Gehäusetopf (case pot) | R-05 01 00-1 | `05-01/Wempe_05-01_2.jpg` | Brass, chill-cast, 350 g | Revolved profile: ⌀118, ⌀108, ⌀106, ⌀98 (internal), ⌀72.5, ⌀64; height 65; steps 53, 23.5, 14.5, 12, 5.5; 40° chamfer. No holes drawn | T1 profile; wall thickness and fillets T4 |
| Verschlußplatte (closing plate) | 05 01 00-2 | `05-01/Wempe_05-01_3.jpg` | Brass | ⌀68 −0.2; ⌀28 −0.2; ⌀26; ⌀10; ⌀7.5 +0.1; ⌀5.5 +0.1; plate 2.3 (?), total 5; 3 +0.2; 25; M2.6; 22.6 and 8 +0.2 (rev. a 1948) | T1 |
| Glasrand (bezel) | R-05 01 01-2 | `05-01/Wempe_05-01_5.jpg` | Brass, chill-cast | ⌀125, ⌀116, ⌀106, ⌀92; heights 16, 11.5; 30° | T1; glass rebate T4 |
| Schlüsselmittelteil (key centre) | 05 01 02-2 | `05-01/Wempe_05-01_8.jpg` | Steel, black phosphated | See sheet: ⌀8 +0.1, 3 H11, ⌀2.5, 25.1 −0.2, … (0.9 cross-hole, rev. a) | T1 |
| Schlüsselrohr (key pipe) | 05 01 02-3 | `05-01/Wempe_05-01_9.jpg` | Brass Ms 58 | ⌀8 −0.05; 3.1 □ +0.05 square socket; 50.1 −0.2 overall; 19 +2 (rev. a) | T1 |
| Gimbal ring | — | `05-01/Wempe_05-01_1.jpg` | — | ⌀160 only | T4 |
| Wooden box | — | `51-00/Wempe_51-00_1.jpg`, `_5.jpg` | Bleached birch | "Holzgehäuse 185×185×180 mm außen" | Out of scope |

The key's square socket (3.1 □) must fit the fusee winding square (2.92–3.1, 1:100 taper; §3).

## Appendix B. Not modelled

- Zeigerstellung 05-33 (hand-setting; conditional plate rows 14–18 and cut-outs);
- Unruhhaltevorrichtung 05-36 (balance stop);
- Sekundenkontakt 05-38;
- all Ankerchronometer sheets.

## Appendix C. Verification

All resolved values are checked by `_inferred/scripts/closure.py`:

- **24 of 24 independent checks pass**;
- 23 consistency checks pass;
- the 2 rejected alternatives fail as expected.

See the evidence record (Federchronometer05.md §7–8).