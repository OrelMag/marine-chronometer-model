# Wempe Federchronometer 05: case and gimbal specification

**Purpose.** This file specifies, buildably, the **case pot (Gehäusetopf), bezel and glass (Glasrand), movement seat, back shutter and winding path, gimbal (Kardan) and the gimbal's mounting in the wooden box** for the Federchronometer 05 movement of [`Federchronometer05.md`](Federchronometer05.md). It stays as close to the drawings as possible. Where the drawings are silent, the part is designed as a 1940s German chronometer and case maker would have made it, and the text says so.

**Scope.** Sheets 001, 05-01_1…_9, 51-00_1…_5 (box interface only), 05-33, 05-36, 05-38, plus the movement sheets that touch the case (05-08_07 Werkring, 05-02_12 Zifferblatt, 05-06_01 Schnecke kompl.) and the master cross-section. The outer Überkasten (51-00_5) is out of scope beyond a note in §10.

**Conventions** (as `Federchronometer05.md`):

- Decimal points; drawing text quoted in "…" keeps its German decimal comma. Illegible digits are `?`, never guessed.
- **Z = 0 at the lower-plate inner face, + toward the upper plate.** In the case, +Z points down into the pot toward its floor; the dial and glass are at −Z (up).
- **Case plan frame (dial view, from above):** X = toward 3 o'clock, Y = toward 12 o'clock. 12 o'clock faces the back (hinge side) of the box, as drawn on 51-00_1. The movement plate table (05-08_03a) is viewed **from the back**, so X = −x(table), Y = +y(table). Bearings are given clockwise from 12 o'clock **in dial view** unless stated otherwise.
- **Pot local datum P0 = rim top face** (Z −11.01). Depths "P0 + d" are measured down from it.
- Tiers: **T1** drawn or exact closure; **T2** engineering rule; **T3** scaled from a calibrated drawing (scale stated); **T4** designed or convention.

All checks are in [`_inferred/scripts/case_closure.py`](_inferred/scripts/case_closure.py) (`python case_closure.py`, §11):

| Kind | Meaning | Result |
|---|---|---|
| IND | Independent: tests a case value against drawn data it was not derived from | **29 / 29 pass** |
| CON | Consistency: passes by construction; shows feasibility | 78 / 78 pass |
| REJ | Rejected alternatives, expected to fail | 19 / 19 fail as expected |

**Revision 2 (clockmaker's review, 2026-10-22).** Six changes make the case buildable and the lock work:

- the bezel stops on the Werkring flange only, with P0 0.04 clear (§2.1);
- the transport lock is a spring plunger in a closed hole, which locks both gimbal axes (§8.3);
- the Feststellkloben moves inside the 108 band (§8.3);
- the Korkring is faced at assembly to 0.1–0.2 contact (§4.3);
- the Zeigerstellung hole is conditional, as the movement spec makes the device (§4.4);
- the WN-78 screws are M2.6 × 6.

**Revision 3 (second clockmaker's review, 2026-10-22).** Rev 2 still had parts that could not be assembled or would not run. Each fix below is a dimension change, except for one new part, the Lagerbuchse:

- **Minute hand vs bezel.** The drawn minute hand is 46 long and runs inside the drawn ⌀92 aperture, so it would rub the bezel.
  - The ⌀92 is kept only as a 1.0-thick lip at the **glass end**, where it is also the glass ledge.
  - Below the lip, the bore is undercut to ⌀95 down to the dial: 1.4 clear of the hand tip.
  - The lip must be at the glass end: the bezel goes on from that side, so a lip at the dial end would sweep past the hand while the bezel is screwed down (§5.1).
- **Shutter pivot.** The WN-71 shoulder of 3.0 was shorter than the shutter's drawn bore length, 3.05–3.10, so its head would clamp the shutter. The shoulder is now fitted to 3.15 (§6.1).
- **Shutter detent.** The Verschlußfeder was a flat leaf, which cannot flex radially into notches in the recess wall. It is now an edge-wise arm (§6.1).
- **Axis b pivots.**
  - The WN-79 (× 12, 7.0 pivot) left 1.5 of thread outside the ring for a 1.8 nut.
  - Its shoulder stood 4.0 off the boss face, so nothing limited the bowl's end-shake along Y.
  - It is now × 13 with a 3.1 pivot, and the shoulder sets the end-shake (§8.3).
- **Axis a pivots.** The WN-80 now has its shoulder at the Kloben face. Its lock nut bears on a Ms Lagerbuchse through the wall, not on wood (§8.3, §10).
- **Gehäuseklaben.**
  - The upper screw sat under the crank arm.
  - Sliding the foot ±2.5 on the curved band turned the pivot bore 2.7°, against 1.07° of pivot freedom, so the pivot would bind.
  - The feet now slide straight on milled flats (±1.5), with the two screws side by side.
  - The Kardanringkloben adjustment is cut to ±1.0 (§8.3, §8.4).
- **Feststellkloben.** A screw counterbore broke into the lock hole, and the hole wall was 0.4. The block now has two ears and a boss to r 60.5 (wall 1.4). The lever (8 × 4) and its plunger housing are dimensioned clear of the bowl (§8.3).
- **Daily winding.** It is 3.73 turns (24 h), not 8.8. 8.8 turns is a full wind from run-down (§6.3, §8.6).
- **Corrections.**
  - Thread engagement: 3.2 of full thread (4.3 turns), not "6 threads".
  - Notch floor: r 54.60.
  - Glass: retained by a turned lip that can be rubbed over (§5.2).
  - CG: the default build has no Zeigerstellung.
  - Kardanring material: Ms 63 if rolled.
  - Liner: extent corrected.
  - Fits: corrected.
  - §13: numbering fixed.

Operating and workshop rules are collected in §8.6.

**Contents:** 1 Sources and calibration · 2 The two decisions: bezel joint and notch · 3 Movement seat and Werkring · 4 Case pot · 5 Bezel and glass · 6 Back shutter, winding and key · 7 Pass-throughs · 8 Gimbal · 9 Masses and centre of gravity · 10 Box interface · 11 Fits, clearances and closure · 12 Decision log · 13 Open items · 14 Findings that affect the movement spec

---

## 1. Sources and calibration

### 1.1 Sheets used

| Sheet | Content | Status for the case |
|---|---|---|
| 001 | Feder layout 2:1; "Platten⌀ 85 mm", "innerer Plattenabstand 19 mm", "innerer Gehäuse⌀ 100mm", "evtl. Einlage gegen magnetische Einflüsse" | 100 = finished bore (§4.1) |
| 05-01_1 (05 01) | Gehäuse Kardan, 1:1 on an A3 sheet, gez. 30.10.40, stamps 28.6.46 / 31.3.47. Sections A-B (plan, through axis a) and C-D (elevation through axis b); parts list items 1–15; "160⌀", "17", "50°", "1?5" (near A, one digit illegible), "Lagerstellen a u.b leicht spielend", "Kloben verstellen bis Gleichgewicht erreicht ist", "Holzgehäuse 185×185×180mm außen" | Gimbal arrangement; only geometry source for ring, Klobens, Feststeller |
| 05-01_2 (R-050100-1) | Gehäusetopf, 1:1, "Ms-Sandguß (Kokillenguß)", "Gewicht 350 gr.", 1942/43 | **Casting (Rohteil) drawing**, see §4.1 |
| 05-01_3 (050100-2) | Verschlußplatte, rev a "Maße eingetragen" 14.4.48 | Shutter, fully used |
| 05-01_4 (05 01 01) | Glasrand kompl., no dimensions | Glass thickness, stepped ceiling (T3) |
| 05-01_5 (R-050101-2) | Glasrand, 1:1, "Kokillenguß", 125⌀ / 116⌀ / 106⌀ / 92⌀, 16, 11,5, 30° | **Casting drawing** |
| 05-01_6…_9 | Aufzugschlüssel (old), Chronometerschlüssel 51 00 11, Schlüsselmittelteil, Schlüsselrohr | Key chain (§6.3) |
| 05-08_07 (05 08 00-3) | **Werkring**, 1:1, gez. 2.7.41, rev a (7 changes) 6.12.46 | **Exists**; the movement seat (§3) |
| 05-02_12 | Zifferblatt: "fertig 103,6", "Stärke 1,3" | Dial envelope |
| 05-06_01 | Schnecke kompl. 5:1 (1941, rev 1944): "Werkringauflage", "3 ±0,05", "7 ±0,02", "49" "von Werkring-auflage", "Gehäuse", "8,0⌀", "1", "3,9", "0,9" | **Floor datum** (§4.3) |
| 05-33 | Zeigerstellung kompl. 5:1: "23,15±0,1", "8,5", "10", "Stellung: Knopf herausgezogen" | Wall hole height |
| 05-36 | Unruhhaltevorrichtung: "Ansicht v. C." at 1:1 shows pot, bezel and the push-piece with "frei"/"fest" plate; "zum Schalten hineindrücken", "rot auslegen", "34°18'" | Push-piece height; overall height check |
| 05-38 | Sekundenkontakt: Schnitt C-D shows "Gehäuse" with Gehäusebuchse (37), Isolierbuchse (34), "30°", "35 ±0,2(?)"; "Höchstgrenze 24 Volt, 0,4 Ampère" | Optional feed-through |
| 51-00_1 | Boden-Chronometer GA 1:2 | Axis height in the box, 12 o'clock orientation |
| 51-00_2 | Griff; board 12,5 thick | Box wall thickness |
| Cross-section `Wempe_Einheitschronometer.jpg` | Callouts "Werkring 05 08 00-3", "Stellstift 3 WN-202", "Schraube WN-10", "Stellstift WN-201", "Schraube WN-56", "Korkring 05 08 01-4" | Werkring in place, locating pin, cork seal |

### 1.2 Calibration of scaled readings

| Source | Calibrated on | Scale | Accuracy used |
|---|---|---|---|
| 05-01_2 Gehäusetopf | 118 / 108 / 12 / 23,5 / 53 / 65 (pixel edge scan) | 3.48 px/mm H, 3.45 V | ±0.3 |
| 05-01_1 (A3 at 1:1) | "160" extension lines (box inner walls) | 2.46 px/mm | ±0.8 (2 px); heights ±1.5 (scan speckle) |
| 05-01_4 Glasrand kompl. | bezel 125 across the section | 4.64 px/mm | ±0.3 |
| 05-36 Ansicht v. C. (1:1) | bezel 125; checked on body 106 and foot 72,5 | 2.40 px/mm | ±1.5 overall height |
| 05-33 (5:1, A3) | 23,15 / 8,5 / 10 | 19.2 px/mm | ±0.6 |
| 51-00_1 (1:2) | Holzkasten 185 outside, 160 inside | 1.24 px/mm | ±3 |
| Cross-section | §3 of the movement spec | 9.25 px/mm | ±1.5 % + 0.2 |

---

## 2. The two decisions (up front)

### 2.1 Bezel joint: **threaded. Male fine thread on the pot rim, female thread in the bezel skirt.**

**Recommended joint (T4 values, reading T3/T1-supported):**

- Pot rim: external thread **M113 × 0.75**, 6g, from P0 down 5.0 (4.2 full thread + 0.8 undercut ⌀111.9), 0.5 × 45° lead chamfer at P0.
- Bezel: the cast ⌀106 skirt bore is opened to an internal thread **M113 × 0.75**, 6H, over the whole skirt (4.5), with a thread relief ⌀113.6 × 0.8 at the ceiling and a 0.5 × 45° lead-in at the skirt end. Full-thread engagement is **3.2 = 4.3 turns** (P0 + 0.76 → P0 + 3.96, after the relief, the lead-in, the pot's lead chamfer and the undercut). The shear area is over 500 mm², far more than a hand-tight clamp needs. Single-point chased on the lathe (a special diameter on the DIN 13 fine-pitch form).
- **Seating faces.** The bezel **ceiling** (the floor of the skirt bore, annulus r 52.2 → 56.1) bears on **the Werkring flange face only** (land r 52.2 → 52.97, 0.78 wide). The rebate is fitted so that the flange stands **0.03–0.05 proud of P0** (nominal 0.04), so P0 (annulus r 53.0 → 56.1) never touches the ceiling; it is a dust labyrinth, not a stop. Hand-tightening the bezel sets the clamp on the movement.
  - A metal stop on P0 and a nip on the flange at the same time cannot both happen: squeezing the 4.7-high brass flange by 0.02 would take tens of kilonewtons.
  - Fine-turn the rebate, seat face, P0 and thread in one setting of the pot, and the ceiling and female thread in one setting of the bezel, so that the clamp is square and does not distort the Werkring.
  - The skirt end is 0.54 clear of the 117.5 shoulder, so the shoulder never takes load.
- **Dial relief** in the ceiling, ⌀104.4 × 0.70: the dial stands 0.60 proud of the Werkring flange face, so it is cleared by 0.10 and is not clamped.
- **Seal:** none. Period practice: the box keeps spray out; the only seal in the case is the movement's own Korkring at the winding hole (§4.3). A thin film of tallow on the thread is permitted.
- **Anti-rotation of the movement while the bezel is screwed down:** the Werkring's Stellstift 3 in the pot notch (§2.2). This is why the pin exists.

**Why this reading, and why not the alternatives.**

| Evidence | Thread on pot rim (chosen) | Thread in the 118 rim on the 116 skirt | Screws through a flange, bezel over the Werkring flange |
|---|---|---|---|
| 05-01_2: the 108 is an **outer** step (pixel scan, both halves), not a rim bore; the rim top 12 mm is solid 98 → 118 (10 mm wall) | ✓ metal for a rebate + male thread | ✗ a female thread for the 116 skirt leaves a 1.0 wall in the 118 rim (REJ) | ✓ 118 band overhangs the 108 band by 5 mm, a flange |
| Overall height bezel top → foot: 75.0 (05-36 Ansicht v. C., 1:1), 74.4 (05-01_1 C-D), 74 (51-00_1) | **75.6** ✓ | — | 80.3 ✗ (REJ) |
| 05-01_1 C-D: the bezel skirt passes **outside** the top of the pot wall | ✓ | ✗ | ✗ (skirt would sit on the rim face) |
| 05-06_01: case floor at "49" "von Werkring-auflage"; Korkring touches the case | ✓ floor at seat + 49 needs the seat 4.7 below the rim, i.e. a rebate | — | ✗ Korkring 3.35 short of the floor (REJ) |
| Werkring carries a **radial** Stellstift 3 at 2.8 below its flange face | ✓ lies inside the non-rotating pot rim | ✗ would sit inside a rotating skirt | ✓ but then the notch is in the bezel and the movement is indexed to the pot only through the bezel screws |
| 05-01_1 parts list: screws WN-71/-72/-78/-79/-80 and nut WN-400 only, **no bezel screws** | ✓ | ✓ | ✗ |
| Bezel casting bore ⌀106 ≈ Werkring flange ⌀105.95 | ✗ coincidence; the bore is opened to the thread | — | ✓ the one point in its favour |

The ⌀106 × 4.5 recess of the bezel casting matches the Werkring flange (105,95 × 4,7) closely, and that is the strongest argument for the flange-and-screws reading. It loses on four independent counts: the overall height (three drawings), the drawn floor datum, the cork seal and the parts list. The match is recorded as an open point (§13).

A wavy line in the left skirt of 05-01_4 at ⌀113–114.6 (T3) could be a thread symbol; it is more likely the boundary line of the local break-out section, so it is not counted as evidence. It is, however, at the diameter chosen here.

### 2.2 The notch: **a locating notch in the pot rim for the Werkring's Stellstift 3 (WN-202)**

**Where it must exist.** The cross-section calls out "Stellstift 3 WN-202" as a **radial pin** projecting from the Werkring flange OD (drawn 2.4 ±0.3 proud, ⌀1.7 ±0.2, T3). The Werkring sheet 05-08_07 drills its seat: a ⌀"1,6" radial hole on the 12 o'clock centre line, "2,8" from the flange face (the dial-side face). No case sheet has anything to receive it, because the case sheets are casting drawings (§4.1). The pin has two jobs: it **indexes the movement to the pot** (so the fusee square lines up with the winding hole, and the Zeigerstellung and balance stop line up with their wall holes), and it **stops the movement turning** while the threaded bezel is tightened on the flange.

**Recommended notch (T4 dimensions, T1 position):**

| Item | Value | Tier |
|---|---|---|
| Position | 12 o'clock (dial view), on the Werkring's radial hole; the dial's 12 is the Werkring's 12 (dial and Werkring both drill the dial pin at "6°" from the same line) | T1 |
| Form | Axial slot cut into the rebate wall, open at P0, so the movement drops in vertically | T4 |
| Width | 1.70 +0.05 (pin ⌀1.6 m6 → 0.09–0.15 clearance) | T4 |
| Depth from P0 | 3.66: to Z −7.35, 0.10 below the pin's lower edge (pin axis Z −8.25 = flange face −11.05 + "2,8") | T1 pin / T4 notch |
| Radial depth | from the rebate wall r 53.03 to r **54.60** (pin tip r 54.425–54.475: 0.13–0.18 clear) | T4 |
| Pin | WN-202, steel ⌀1.6 m6 × 6.0, pressed 4.5 into the Werkring, **protruding 1.5** (drawn ≈2.4) | T4 |
| Wall left behind the notch | 1.44 to the thread root | CON |

The pin is shortened from the drawn ≈2.4 to 1.5 so that 1.44 of wall remains behind the notch under the M113 thread. If the full 2.4 is kept, the notch goes to r 55.5 and only 0.5 remains; that is not recommended.

**Alternatives considered:**

- *Spanner or pin-wrench notches in the bezel.* Not adopted: nothing is drawn, the 8.2-tall ⌀124.6 cylinder gives a hand grip, and the joint is only hand-tight on the flange land. Period practice was a leather-lined strap or a hand grip, not notches in a polished bezel. If a tool is wanted: two ⌀2.0 × 1.5 blind holes at 180° in the lower bevel.
- *Notches for the pass-throughs.* Not needed. The Zeigerstellung shaft, if fitted, is withdrawn outward through its bush before the movement is lifted (its knob pulls out, "Knopf herausgezogen"), the balance-stop push-piece only pushes on its lever ("zum Schalten hineindrücken"), and the Werkring body ⌀96 clears the ⌀100 bore by 2.0. A vertical slot from the rim down to the Zeigerstellung hole is the fallback if the shaft cannot be withdrawn; it would cut the thread and is not recommended.

---

## 3. Movement seat and Werkring

### 3.1 The Werkring exists: 05-08_07 (05 08 00-3)

The movement spec and the case audit treat the Werkring as missing. It has a sheet. It is a movement part, so it is not redesigned here; its drawn values (T1) are:

| Feature | Drawn | Z (movement frame) |
|---|---|---|
| Flange OD × height | "105,95⌀ −0,1 (a)" × "4,7" | −11.05 → −6.35 |
| Body OD | "96⌀ −0,3(?)" | −6.35 → −0.35 |
| Overall | "10,7 −0,1 (a)" | −11.05 → −0.35 |
| Plate seat | "85⌀ H9 +0,035" × "3 +0,1 (a)"; lip "83⌀" | plate dial face rests on the lip at −3.35 |
| Lip → dial seat | "7 −0,1 (a)" | dial seat −10.35 |
| Dial recess | "104⌀ +0,1" × "0,7 +0,1 (a)" | −10.35 → −11.05 |
| Inner chamfer | "93⌀ +1,3", "45°" | at the dial seat |
| Movement screws | 3 × "M2,6" on "89⌀", 120°, first at "20°" (Schraube WN-56 on the section) | heads on the movement side |
| Dial pin | "1,1⌀", R "50,5", "6°" from 12, "wird bei Montage des Zifferblattes gebohrt" (Stellstift WN-201) | — |
| Plate pin | "1" at 6 o'clock, "wird bei Montage der Unterplatte gebohrt" (Stellstift WN-201) | — |
| Locating pin hole | "1,6" radial at 12 o'clock, "2,8" from the flange face (Stellstift 3 WN-202) | pin axis −8.25 |

Closures (all IND): 3 + 7 + 0.7 = 10.7 exactly; the dial seat −10.35 equals the movement spec's dial inner face (from "7" on 05-05_01, another sheet); the Werkring top −0.35 and flange face −11.05 agree with the cross-section (−0.30, −10.8) within its calibration; the flange underside is 3.0 from the plate's dial face, as 05-06_01 states ("3 ±0,05" from the plate to the "Werkringauflage").

**So the "Werkringauflage" (the Werkring's bearing face on the case) is the flange underside, Z −6.35.** The movement hangs in the pot from its flange.

### 3.2 Dial

05-02_12: "fertig 103,6", "Stärke 1,3" (handwritten "1,2"). In the ⌀104 +0.1 recess: 0.4–0.6 diametral clearance (IND). Inner face −10.35, outer face −11.65 (T1 via the Werkring), i.e. **0.60 proud of the Werkring flange face.** Fixed by 3 × Schraube WN-10 (countersunk, through the dial into the flange, holes at assembly) and located by Stellstift WN-201. The WN-10 heads sit in the dial's "Senkung 1,0 tief" on the ⌀101 circle and must finish **flush to 0.05 below the dial face**: the bezel relief clears the dial face by only 0.10. The dial rim r 46 → 51.8, with the screws, lies under the bezel's ⌀92 lip and is not seen. The minute track (⌀90) shows inside the lip with 1.0 to spare (IND).

### 3.3 Seat in the pot (designed)

| Item | Value | Tier | Note |
|---|---|---|---|
| Rebate | **⌀106.05 +0.05**, depth **4.66**, fitted at assembly so that the flange stands **0.03–0.05** proud of P0 | T4 | "auf Werkring einpassen". Diametral clearance on the flange 0.10–0.25. The flange land is the bezel's only stop (§2.1) |
| Seat face | Z **−6.35**, annulus r 50.0 → 53.03 (3.0 land) | T1 Z / T4 | Flat, fine-turned |
| Notch | §2.2 | T1/T4 | — |
| Bore below | ⌀100.0 ±0.1; Werkring body ⌀96 −0.3 clear by 2.0 radial | T1 (001) | The body is not a locating fit |
| Movement screws to the case | **None.** The bezel ceiling clamps the flange onto the seat | T4 | Matches the parts list (no case screws for the movement). With the bezel off the movement is loose in the pot (§8.6) |

**Z fit of the movement in the case** (details in §11):

- Dial outer face −11.65 → bezel relief −11.75: **0.10** clear. The relief is referenced to the flange face, on which the bezel now sits, so the clearance does not depend on the P0 fit.
- Minute hand blade top −16.75 → glass underside −18.95: **2.20**; its boss (forward to −18.10 in movement rev 2) → glass: **0.85**.
- Minute hand tip (r 46 +0.1, 05-02_02) → bezel sight bore ⌀95: **1.4** radial. The hands run at Z −12.1 … −16.75, inside the bezel, so this radial clearance matters as much as the axial ones (§5.1).
- Minutentrieb tip −18.23 (the highest point toward the glass) → glass: **0.72**.
- Balance-cock top 37.35 → floor 42.65: **5.30** (cock screws ≈1.7 above the cock still clear by 3.6).
- Staubfutter top 41.95 (rev 2) → floor 42.65: **0.70**.
- Korkring → floor: **0.1–0.2 contact, faced at assembly** (§4.3).
- Fusee square tip 45.91 → enters the ⌀8.0 floor hole; 1.88 short of the shutter.

**Radial fit:** plates ⌀85 in the ⌀100 bore, 7.5 clear; Werkring body 2.0 clear; at the floor the inner cone (r 44.9) still clears the plate edge (r 42.5) and the Staubfutter (r ≈29). Nothing on the movement stands outside the plate edge below the Werkring.

---

## 4. Case pot (Gehäusetopf, 05 01 00-1)

### 4.1 What the sheet is, and the "100" and "350 g" notes

- **R-050100-1 and R-050101-2 are casting (Rohteil) drawings.** Their parts-list numbers are 05 01 00-1 (pot) and 05 01 01-2 (bezel); the "R-" sheets carry "Kokillenguß", a weight, and no holes, threads, rebates or notches of any kind. The finished-part sheets are missing.
- **"innerer Gehäuse⌀ 100mm" (001) is the finished bore.** The casting bore is 98 (pixel scan: the 98⌀ arrow ends on the inner wall), leaving 1.0 per side to bore out. All other machined faces are given 0.3–1.0 stock in the same way. (IND check: stock 1.0.)
- **"Gewicht 350 gr." contradicts the drawn section in brass.** The casting as drawn is 149.2 cm³: **1268 g in Ms**, 403 g in light alloy. The finished pot is 955 g in Ms, 303 g in light alloy. 350 g therefore fits only a light-alloy casting (between raw and finished weight). Possible explanations: a light-alloy Kokillenguß variant (wartime Sparstoff substitution; chill casting is the usual light-alloy process), or a weight never updated. **Decision: build in Ms as the Werkstoff field says (T1); the CG is shown to work for both readings (§9).**

### 4.2 Revolved profile (finished)

Material **cast brass, sand or chill cast per "Ms-Sandguß (Kokillenguß)"**: a leaded casting brass of the DIN 1709 family (e.g. GK-CuZn37Pb for the chill casting), not the wrought Ms 58. Raw casting dimensions in brackets.

**Outside (top to bottom):**

| Zone | P0 + | Z | Diameter | Tier | Cast |
|---|---|---|---|---|---|
| Thread M113 × 0.75-6g incl. undercut ⌀111.9 × 0.8 | 0 → 5.0 | −11.01 → −6.01 | 113 | T4 | [118, 0 → 12] |
| Shoulder (rest of the 118 band) | 5.0 → 11.7 | −6.01 → +0.69 | **117.5** h11 | T4 | [118] |
| 108 band | 11.7 → 23.2 | +0.69 → +12.19 | **107.5** | T4 | ["108⌀", 12 → "23,5"] |
| Body | 23.2 → 50.2 | +12.19 → +39.19 | **105.5** | T4 | ["106⌀"] |
| Cone | 50.2 → 64.4 | +39.19 → +53.39 | 105.5 → **72.7** at the foot | T1 diameters / T4 | ["72,5⌀", "14,5", "40°"] |
| Foot face | 64.4 | +53.39 | annulus 68.4 → 72.7 | — | ["65"] |

The drawn cone set is over-determined: 106 → 72.5 over 14.5 gives 40.9° to the base plane against "40°". The diameters govern; the finished cone is 41.3°. Outside edges: body/cone edge R3, other edges 0.3 × 45° (T4).

**Inside:**

| Zone | P0 + | Z | Diameter | Tier |
|---|---|---|---|---|
| Rebate (Werkring flange) | 0 → 4.66 | −11.01 → −6.35 | 106.05 +0.05 | T4 (fit to T1 flange) |
| Locating notch at 12 o'clock | 0 → 3.66 | −11.01 → −7.35 | 1.70 +0.05 wide, to r 54.60 | §2.2 |
| Bore | 4.66 → 49.27 | −6.35 → +38.26 | **100.0 ±0.1** | T1 (001) |
| Inner cone, parallel to the outside, 2.5 normal wall | 49.27 → 53.66 | +38.26 → +42.65 | 100 → 89.9 | T4 |
| Floor face | **53.66** | **+42.65** = seat + "49" | flat, r < 44.9 | T1 value (05-06_01), T3-corroborated datum |
| Shutter recess (from below) | 58.80 → 64.4 | +47.79 → +53.39 | **68.4 H9** × 5.6 | T4 [cast "64⌀" × "5,5"] |

The bore cannot run at ⌀100 to the floor: the outer cone would be cut through below Z +41.5. The inner cone keeps a 2.5 wall and still leaves r 44.9 at the floor, 2.4 outside the plate edge. Every finished surface lies inside the casting (checked at Z 38.2, 39, 40, 41.7 against the cast R5 inner fillet, which measures R≈5.3 on the sheet).

**Wall thicknesses:** rim at the thread 3.0 (rebate to thread root); shoulder 5.7 above the seat; 108 band 3.75 (3.06 at the Gehäuseklaben screws, under the flats, §8.3); body 2.75; cone 2.5 normal; floor 5.14; foot ring 2.15. Inside edge fillets R0.5, rebate corner 0.2 × 45° relief.

**Finish (T4, general practice):** outside fine-turned, grained and lacquered (Zaponlack) or nickel-plated; inside fine-turned, left bright or blackened. The optional "Einlage gegen magnetische Einflüsse" (001, "evtl.") fits as a soft-iron liner 1.5 thick (ID 97, OD 100), a light push fit in the bore.
- It runs from **0.1 below the seat** (Z −6.25, so the Werkring flange still bears on the brass seat alone) to the start of the inner cone (Z +38.26), between the Werkring body (0.5 radial clear) and the bore.
- Its pass-through holes must match the wall holes.
- Not fitted by default.
- **Fit the liner for service on a steel ship.** The movement has a steel hairspring ("Bandstahl") and a nickel-steel Guillaume rim, both ferromagnetic. A magnetised hairspring changes the rate by seconds a day, and the balance is near the hull, the compass deviation magnets and the electrical gear.
- The liner is an open cylinder, so it shields horizontal fields well and vertical fields poorly.
- There is no room for a floor disc inside the pot: the Staubfutter is only 0.70 below the floor face. Keep the chronometer away from the compass and from the main switchboard.
- The liner adds ≈160 g near Z +16, which lowers the CG further.
- The WN-78 tips stop at least 0.56 short of the bore (§8.3), so they never reach the liner.

### 4.3 Floor datum: why the floor is at seat + 49

05-06_01 (1941, rev 1944) dimensions "49" "von Werkring-auflage" to the "Gehäuse" inner face, shows the Korkring (cross-hatched, "3,9" thick) bearing on that face, and the square tip "1" short of the case's outer face inside the "8,0⌀" winding hole. Carried to the 1948 movement:

- floor face Z = −6.35 + 49 = **+42.65**;
- the Korkring 05 08 01-4 sits on the Staubfutter lug (top face 38.95, movement rev 2). Its top reaches the floor by every route: 0.35 from the T3 cross-section top (43.0 ±0.6), 0.20 from the lug plus the 1941 "3,9", 0.10 from the lug plus the scaled 3.8 (IND). So the floor at seat + 49 is where the cork expects it;
- the cast depth "53" less 0.3 top facing leaves 0.96 to machine off the floor face: feasible (IND).

**Korkring fit (designed, T4).** The scatter above (0.10–0.35, ±0.6 on the scaled value) is too wide to leave to chance.
- The cork's reaction runs down through the Staubfutter and the Schneckenfutter into the upper plate, right beside the fusee, which has only 0.04 end-shake. A hard-pressed cork bends the plate and eats into that end-shake.
- So **face the cork at assembly to 0.1–0.2 contact** with the floor: enough to seal dust from the key hole, not enough to load the plate. Check the fusee end-shake with the bezel tightened.
- The cork sits round the Staubfutter body, so its bore is **≈13.1**, a light push fit on the ⌀13.1 body, shellacked to the lug. The ≈9.7 read earlier is the Staubfutter's top neck, not the cork.
- On the floor the cork seals outside the ⌀8.0 winding hole with a 2.5 land.

If instead the Werkring sat on an unrebated rim, the floor would be at +46.65 and the cork would miss it by 3.35 (REJ).

### 4.4 Holes and apertures in the pot

Bearings clockwise from 12 o'clock in dial view; Z in the movement frame.

| # | Hole | Bearing | Z | Size | Tier |
|---|---|---|---|---|---|
| 1 | Locating notch (Werkring Stellstift 3) | 0° | −11.01 → −7.35 | §2.2 | T1 pos. / T4 |
| 2 | Winding hole in the floor, r **22.65** | **312.5°** (= 47.5° clockwise seen from below) | floor | **⌀8.0** +0.1 ("8,0⌀", 05-06_01), 0.3 × 45° both ends | T1 |
| 3 | Shutter pivot, tapped M3 blind at the centre: tap drill ⌀2.5 × 4.2 deep (0.94 of floor left, so no hole into the movement space), 3.0 of full thread with a bottoming tap | — | recess floor | for WN-71 | T4 |
| 4 | Zeigerstellung bush (05-33 item 36), **only if fitted** (the movement's default build omits the Zeigerstellung: plate rows 14–18 are "nur wenn Zeigerstellung eingebaut wird") | **240° ±10°** (table bearing 120° from the back, rows 14/15 Kloben pins) | **+16.8** ("23,15±0,1" from the seat; T3 +17.3) | ⌀7.0 H8, bush soft-soldered | T1 Z / T3 pos. / T3 size |
| 5 | Balance-stop push-piece (05-36 item 28) | **217° ±15°** (on the radial through the balance, table bearing 143°) | **+28.0 ±1.5** (Ansicht v. C. 1:1) | ⌀5.0 H8; plate 29 ("frei"/"fest", engraving "rot auslegen") 37.5 × 13 (T3), curved R52.75, 2 × M1.7 | T3 / T4 |
| 6 | Sekundenkontakt Gehäusebuchse (05-38 item 37), **only if fitted** | 150° (T4) | **+28.65** ("35 ±0,2(?)" from the seat; T3 ≈27.7) | ⌀6.0 H8 for the Isolierbuchse 34, outside "30°" countersink | T1(?) / T4 |
| 7 | Gehäuseklaben seats: a **flat 19 wide** milled on the 108 band over its full length (0.85 deep at the centre); 2 × M2.6 through-tapped in each flat, side by side at X ±4 | 0° and 180° | +7.5 | M2.6 (WN-78 × 6: 2.5 engaged in the 3.06 wall, tips 0.56 short of the bore) | T4 |
| 8 | Feststellkloben screws, 2 × M2.6 through-tapped, one under each ear, ±6.5 tangential from the lock hole | 123° and 137° | +6.25 | M2.6 (WN-78 × 6: 2.5 engaged in the 3.75 wall, tips 1.25 short of the bore) | T4 |

Every Kloben foot and tapped hole lies inside the 108 band (Z +0.69 → +12.19) with at least 0.71 to spare (CON). The rev-1 Feststellkloben (Z +6 → +13, screw at +11.5) overhung the band's end by 0.81 and broke its upper hole across the step (REJ). The through-tapped holes are filled by their screws; a touch of shellac on each thread keeps dust out of the pot.

**Without the Zeigerstellung** (the default), hole #4 is not drilled. A marine chronometer is rated, not set: the navigator logs its error and daily rate. When the hands must be set, it is done on the bench with the bezel off by turning the minute hand on its friction-fitted Viertelrohr (movement spec). Taking the bezel off also unclamps the movement (§8.6).

No hole is needed for the barrel arbor: its 2.7□ square (to Z ≈35.4) is for set-up only; winding is by the fusee alone ("Linksaufzug", §6).

---

## 5. Bezel (Glasrand, 05 01 01-2) and glass (05 01 01-1)

### 5.1 Profile (finished), from the bezel top face B0 (Z −22.25)

Material **Ms, chill cast** ("Ms.", "Kokillenguß"), turned, bevel and top face **polished and lacquered** (T4).

| Zone | B0 + | Z | Diameter | Tier |
|---|---|---|---|---|
| Top face, annulus r 50.1 → 62.3, outer edge 0.4 × 45° polished. A groove r 50.6 → 51.6, 0.8 deep, frees a **glass lip** 0.5 wide (r 50.1 → 50.6) for rubbing over (§5.2) | 0 | −22.25 | — | T4 |
| Outer cylinder | 0 → 8.2 | −22.25 → −14.05 | **124.6** [cast "125⌀"] | T4 |
| 30° bevel (to the axis) | 8.2 → 15.7 | −14.05 → −6.55 | 124.6 → **116.0** ["116⌀", "30°"] | T1 angle |
| Glass rebate | 0 → 3.3 | −22.25 → −18.95 | **100.2 +0.1** | T4 |
| Aperture lip = glass ledge (r 46 → 50.1 under the glass) | 3.3 → 4.3 | −18.95 → −17.95 | **92.0** ["92⌀"], edge 0.2 × 45° | T1 |
| Sight bore, where the hands run: an undercut, bored from the skirt side | 4.3 → 10.5 | −17.95 → −11.75 | **95.0** | T4 |
| Dial relief | 10.5 → 11.2 | −11.75 → −11.05 | **104.4** | T4 |
| Ceiling | 11.2 | −11.05, on the flange land; P0 0.04 below it | annulus r 52.2 → 56.1; only the land r 52.2 → 52.97 bears | ["11,5" cast, 0.3 faced] |
| Skirt, female M113 × 0.75-6H | 11.2 → 15.7 | −11.05 → −6.55 | 113 [cast "106⌀" × 4.5] | T4 |

Total height 15.7 (cast "16"). The top face, ceiling and skirt end are each faced 0.15, which a chill casting allows. Skirt wall at its bottom edge 1.5, growing up the bevel. 05-01_4 shows a stepped ceiling with the step at r ≈51 (T3); its direction cannot be read from the hidden lines, so it is made a dial relief.

**Why the aperture is not ⌀92 all the way down.** The drawn minute hand reaches r 46 (05-02_02 "46", ±0.1). Its blade, at Z −16.10 → −16.75, runs inside the bezel, between the glass ledge (−18.95) and the dial relief (−11.75). A plain ⌀92 bore over that height leaves the tip 0.0 (−0.1 at tolerance) from the bore, so the hand would rub the bezel (REJ).
- The drawn ⌀92 is kept as a 1.0-thick **lip at the glass end**, which is also the glass ledge. Seen through the glass it frames the dial, hides the screws on the ⌀101 circle, and shows the ⌀90 minute track (IND). The lip's dial-side face is 1.2 above the minute-hand blade.
- Below the lip the bore is undercut to **⌀95** down to the dial relief. The minute hand clears it by 1.4. On the lathe this is bored from the skirt side, removing 1.5 per side of the cast "92".
- **Why the lip is at the glass end.** The bezel is lowered over the fitted movement from the glass side and screwed down. Every bezel surface that ends up on the dial side of the minute hand has swept past the hand's plane on the way in. A ⌀92 lip at the dial end would pass the r 46.1 hand tip at r 46.0 (REJ). With the lip at the glass end the smallest bore that passes the hand is the ⌀95, 1.4 clear (CON).

If a finished bezel sheet ever shows a plain ⌀92 through, the minute hand must be shortened to ≤45.0 (§14).

### 5.2 Glass

| Item | Value | Tier |
|---|---|---|
| Material | Mineral plate glass (Kristallspiegelglas), flat, edge ground, top and bottom arris 0.3 × 45° | T4 (period) |
| Thickness | **3.0** (05-01_4, section strip 14 px at 4.64 px/mm) | T3 ±0.3 |
| Diameter | **100.0 −0.1** in the 100.2 +0.1 rebate | T4 |
| Retention | Set from the top on the ledge (the ⌀92 lip, r 46 → 50.1) and held by **rubbing the turned lip over the glass's top arris** ("eingerieben") on the lathe with a burnisher, the bezel turning slowly. The lip is 0.5 wide and stands 0.3 above the glass; the groove behind it lets it fold. Optionally bedded in shellac. The diametral clearance (0.2–0.4) stays: brass shrinks 0.04 more than glass on 100 mm over 40 K, so the glass is never squeezed in the cold | T4 |
| Seal | None | T4 |
| Z | underside −18.95, top −21.95 | T4 |

The glass must sit at the top of the bezel: anywhere lower than about 1 mm it would foul the Minutentrieb tip (−18.23). 05-01_4 seems to show a larger glass at the bezel's mid-height; that is incompatible with the hand stack and is not followed (§13).

---

## 6. Back shutter, winding and key

### 6.1 Verschlußplatte (05 01 00-2, rev a 14.4.48)

All drawn: "68⌀ −0,2" disc, plate "2,3"(?), total "5", boss "28⌀ −0,2" (on the outer face), top-face relief "26⌀" × "1,5" around a "10⌀" hub, pivot bore "5,5⌀ +0,1", head counterbore "7,5⌀ +0,1" × "2 −0,05/−0,1" in the boss, winding hole **"8 +0,2" at "22,6"** (rev a), "M2,6" at "25", "1,2" at "12,4" (audit reads "12,4(?)") with "3 +0,2" deep, "nicht eingetr. Toleranz ± 0,1".

**Fit in the pot (T4):** inner face on the recess floor (Z +47.79), boss face at +52.79, 0.6 inside the foot plane. Rotates on **WN-71**: shoulder screw, shoulder ⌀5.5 f7 × **3.15** (fitted at assembly to the shutter's bore length + 0.05), M3 × 3 into the floor, cheese head ⌀7 × 1.8, 0.05–0.10 below the boss face in the counterbore. Clearance on the recess 0.4–0.67.
- The drawn counterbore "2 −0,05/−0,1" in the 5-thick shutter makes the ⌀5.5 bore **3.05–3.10** long.
- Rev 2's 3.0 shoulder was shorter than that, so the screw head would have clamped the shutter fast (REJ). With 3.15 the shutter has 0.05–0.10 end-shake and turns freely.

**What the drawn small holes are (05-01_3 section).** The "M2,6" at r 25 is tapped through the 2.3 plate. The "1,2" at r 12.4 is drilled "3 +0,2" deep into the **boss face**, inside the ⌀28 boss: 0.5 of the 3.5 of metal there (5 less the 1.5 inner relief) is left under it.

**Function:** a 90° rotary shutter. **Open:** its ⌀8.2 hole over the pot's ⌀8.0 winding hole (both r 22.6/22.65, IND 0.05). **Closed:** turned 90°, the plate covers the hole.

**Verschlußfeder (05 01 00-7, no sheet, T4):** hardened and blued spring steel 0.4 thick, in one piece, with a foot and an arm.
- **Foot.** It lies flat on the shutter's outer plate face (Z +50.09) and is fixed by **WN-72** (M2.6 × 3 cheese head, in the "M2,6" at r 25; 05-01_1 C-D leader at r ≈23, T3). Its inner end is cranked up 2.7 against the boss wall onto the boss face, where a ⌀1.2 steady pin in the "1,2" × "3 +0,2" hole keeps it square.
- **Arm.** It is turned **on edge** (2.2 high, Z +50.09 → +52.29, inside the foot plane) and runs about 25 along an arc at r ≈32.5. Its free end carries a nib that bears outward on the recess wall (r 34.2) and snaps into one of two V-notches 0.6 deep, at the open and closed positions. The notches are filed at assembly; 1.55 of the 2.15 foot-ring wall remains behind them.
- **Why on edge.** A flat leaf is stiff in its own plane and cannot flex radially into the notches. On edge the arm gives ≈0.3 N at 0.6 deflection, at ≈120 MPa.
- The WN-72 head (top at Z +52.3, 1.1 inside the foot plane) is the finger tab for turning the shutter.

### 6.2 Winding path

| Station | Z | Value | Tier |
|---|---|---|---|
| Foot plane | +53.39 | — | T4 |
| Shutter outer face / hole ⌀8.2 | +50.09 | key tube ⌀5.95 clear by 2.05 | T1 |
| Floor, hole ⌀8.0 | +47.79 → +42.65 | clear by 2.05 | T1 |
| Korkring (faced to 0.1–0.2 contact) | 42.65 → 38.95 (on the lug) | bore ≈13.1 round the Staubfutter body; the tube passes inside the Staubfutter, not the cork | T3 / T4 |
| Staubfutter (movement rev 2: 23.85 → 41.95): top neck ⌀9.7 (40.15 → 41.95), top bore ⌀7.62 with 20° chamfer | +41.95 | tube ⌀5.95 clear by 1.67 | T1 (movement) |
| Staubplatte top face (27.61 → 30.71, ⌀7.6 −0.1): **tube end stops here** | +30.71 | — | T1 (movement) |
| Square engaged | 30.71 → 45.91 | **15.2** (full flats to ≈44.6, then the dome) | T1 |

### 6.3 Key length chain (Chronometerschlüssel 51 00 11)

| Element | Value | Source |
|---|---|---|
| Schlüsselrohr overall | "50,1 −0,2" | 05-01_9 |
| Collar inside the Mittelteil | "8⌀ −0,05" × "2,6 −0,2" | 05-01_9 |
| Mittelteil bore depth / length | "22 +0,2" / "25,1 −0,2", exit bore "6⌀ +0,1" | 05-01_8 |
| **Tube protrusion** | 50.1 − 2.6 − (25.1 − 22) = **44.4** | T1 closure |
| Reach needed: foot plane → Staubplatte top | 53.39 − 30.71 = **22.68** | the Mittelteil stays 21.7 outside the foot |
| Socket | "3,1□ +0,05", depth "19 +2" (rev a, "Maß 29+2 geänd. in 19+2"), entry "60°" | covers the 15.2 engagement + 1 (IND) |
| Fit on the 1:100 square | flats 3.069 at the socket mouth, Z 30.71 (3.10 at the root, Z 27.61) → play **0.03–0.08** | IND |
| Sense | "Linksaufzug b. Rechtsdrehung entspannt sich die Feder.": the Wendelfeder 510011-4 is a wrap-spring that drives counter-clockwise and slips clockwise | T1 text |

"Linksaufzug" agrees with the movement: the fusee runs clockwise seen from the back (`inf_planview.md`), so it is wound counter-clockwise seen from the key.

**Daily winding.** With the Feststeller at "Frei" (as aboard) and the lid open, open the shutter and turn the bowl over about axis b inside the ring (§8.5). Wind until the stop-work stops the key.
- After 24 h that is **3.73 turns** (24 h × 14/90). The up-and-down hand then returns to 0.
- The full 8.761 turns (56.3 h) are needed only to start a chronometer that has run down.

The key path follows movement rev 2 (`Federchronometer05_CAD_Spec.md`, commit fcf87e4): the Staubfutter's top bore (⌀7.62) is larger than the tube, so the tube goes down to the Staubplatte and the socket fills on the square near its root. An earlier version of this section stopped the tube on the Staubfutter top at 40.45 (5.46 engaged, play 0.13–0.18); that is superseded.

---

## 7. Pass-throughs (summary)

| Device | Wall hole | What the case provides | Tier |
|---|---|---|---|
| Zeigerstellung 05-33 (127-556.05), **only if fitted** (conditional in the movement) | §4.4 #4 | ⌀7.0 H8 at Z +16.8, bearing 240° ±10°; bush 36 soft-soldered flush inside, knob outside (pulls out to set) | T1 Z / T3 |
| Unruhhaltevorrichtung 05-36 (127-556.06) | §4.4 #5 | ⌀5.0 H8 at Z +28.0, bearing 217° ±15°; curved plate 29 with "frei"/"fest" | T3 / T4 |
| Sekundenkontakt 05-38 (optional) | §4.4 #6 | ⌀6.0 H8 at Z +28.65, Isolierbuchse 34 + Gehäusebuchse 37 + nuts 38, 30° countersink outside; 24 V / 0.4 A | T1(?) / T4 |

Final azimuths are spotted through the fitted movement ("bei Montage", as the Werkring's own pin holes are). All three lie in the front half of the bowl, as 51-00_1 shows the knobs on the front.

The balance-stop parts (05-36) have no sheets. Its push-piece Z (+28.0 ±1.5) and bearing must be spotted against the built Winkelhebel on upper-plate hole 52. Its inner end must stand back beyond r 42.5 in the released position, so the movement can be lowered past it.

---

## 8. Gimbal (Kardan)

### 8.1 Arrangement as drawn (05-01_1)

Two orthogonal, coplanar axes:

- **Axis a, outer:** box ↔ Kardanring, at 3 and 9 o'clock. Box-side Schraube **WN-80** with Kontermutter **WN-400**; ring-side **Kardanringkloben 05 01 00-6**.
- **Axis b, inner:** Kardanring ↔ bowl, at 12 and 6 o'clock. Ring-side Schraube **WN-79** with Kontermutter WN-400; bowl-side **Gehäuseklaben 05 01 00-3** (cranked; drawn as such in C-D), fixed by Schraube **WN-78**.
- **Lock:** Feststellkloben 05 01 00-4 on the bowl plus Feststeller "05 01 01" on the box.
- "Lagerstellen a u.b leicht spielend": the bearings have slight play, so they are **plain cylindrical pivots in holes**, not cones (cone points have no play by design).
- "Kloben verstellen bis Gleichgewicht erreicht ist": both kinds of Kloben are adjustable to make the bowl hang level.

**"50°" is not a swing angle.** It is drawn in the plan section at the centre, between the 6 o'clock axis line and the radial line to the Feststellkloben; a swing cannot be shown in plan. It locates the lock: **Feststellkloben at 50° from 6 o'clock toward 3 o'clock = bearing 130°** (the scan measures 44–46°; the text governs). Independent support: the drawn Feststeller lever (32 ±1.5, T3) exactly spans its pivot to a lock point at 130°, r 57.5 (32.2, IND).

### 8.2 Axis height

| Reading | Z axis | Tier |
|---|---|---|
| 05-01_1 C-D: axis b 2.0 below the bezel's lower edge (local relation at the joint) | **−4.5** (adopted; −4.55 exact) | T3 |
| 05-01_1 A-B / C-D, proportional on the overall height | −2.9 / −2.0 | T3 |
| 51-00_1 (1:2), proportional | −8.2 | T3 |

**Design: Z_axis = −4.5**, i.e. P0 + 6.5: 1.8 below the Werkring seat, at the height of the 117.5 shoulder. All later checks are also run at −2.0 and −8.2.

### 8.3 Parts (none has a sheet; all T4 unless stated)

| Part | Specification |
|---|---|
| **Kardanring 05 01 00-5** | Ms ring **OD 146 / ID 139 × 23 high** (T3: 145.4 / 137.9 ±0.8 × 22.7–24), centred on the axis plane (Z −16.0 → +7.0). Rolled **Ms 63** strip 3.5 × 23 (Ms 58 is leaded and cracks when rolled and hard-soldered), hard-soldered and turned; or cast and turned. 2 × M3 tapped radial at 12/6 o'clock, spot-faced ⌀6 on the OD for the lock nuts; 2 × slots ⌀3.6 × 5.6 (tangential) at 3/9 o'clock behind the Kardanringkloben; 4 × M2.6 for the Klobens. Polished, lacquered |
| **Kardanringkloben 05 01 00-6** (2×) | Ms block 20 (tangential) × 23 (axial) × **3.5** (radial), inner face R73. Bearing hole ⌀3.05 H8 radial, 3.5 long. 2 × WN-78, one 7 above and one 7 below the bearing hole, in slots 2.7 × 4.7: **adjusts ±1.0 along Y**. On the curved ring a slide of s turns the bore by s/73. At ±1.0 that is 0.78°, inside the 0.95° the pivot clearance allows; ±2.5 would bind (REJ). Pinned after balancing |
| **Gehäuseklaben 05 01 00-3** (2×) | Milled from solid Ms 58, cranked (Z-shape). **Foot** 16 (X) × 10 (Z +1.4 → +11.4, inside the band's +0.69 → +12.19) × 3.5, **flat**, on the 19-wide flat milled on the 108 band (§4.4 #7). 2 × WN-78 M2.6 × 6 **side by side** at X ±4, Z +7.5, in slots 2.7 × 5.7 along X: **adjusts ±1.5**. On the flat the foot slides straight, so the bearing bore stays square to the pivot at any setting. **Crank arm** Z +1.4 → +4.4, under the 117.5 shoulder face (0.71 clear) and 0.85 above the screw heads, out to r 63. **Upright** r 59.5 → 63, 7 wide, from the crank arm up to a **boss ⌀7 × 6 radial at r 59.5 → 65.5, axis Z −4.5**, bearing hole ⌀2.55 H8 × 5. Boss top 1.10 below the bezel bevel; inner face 0.75 off the shoulder. Nothing stands radially outside the screw heads, so a screwdriver reaches them straight in |
| **Pivots b: WN-79** | M3 slotted set-screw **× 13** with a plain pivot ⌀2.5 f7 × 3.1, hardened and polished steel. Through the ring's M3 (3.5 of thread). **The thread's end is the shoulder**: it stands 0.10–0.15 off the boss face, so the pair sets the end-shake to **0.2–0.3 total**; the pivot runs 3.0 in the boss. About 3.9 of thread is exposed inside the ring ID and 2.5 outside the OD, which carries a DIN 439 M3 thin lock nut (WN-400, 1.8) on the spot face. To lift the bowl out, slack the nut and back each screw out 3.5; the screw stays in the ring |
| **Pivots a: WN-80** | M4 slotted set-screw **× 25** with a plain pivot ⌀3 f7 × 4.0, hardened and polished. From outside through the **Lagerbuchse** (§10), which is M4 tapped through its 15 length. **The thread's end is the shoulder**: it projects 0.85–0.9 past the Lagerplatte and stands 0.10–0.15 off the Kardanringkloben's outer face. The pivot runs 3.4 in the Kloben and its tip stops at r 72.6, 0.4 into the ring slot. WN-400 M4 lock nut on the bush's outer end, metal to metal. End-shake **0.2–0.3 total**, set from outside at 20 °C. Do not set it tighter: the brass ring grows 0.06 against the wooden box over +20 K |
| **Feststellkloben 05 01 00-4** | Milled Ms 58. Z **+2.5 → +10.0**, 20 tangential overall, foot curved R53.75 on the 108 band. **Central boss** 7 wide × r 53.75 → **60.5**, centred so that the **lock hole** lies at bearing **130°**, r 57.5. **Two ears** 3.5 thick (r 53.75 → 57.25), each with a WN-78 M2.6 × 6 at ±6.5 tangential, Z +6.25; the heads clear the hole by 2.65. The lock hole is ⌀3.2 H11 × 2.5 deep, drilled **vertically up from the block's lower end face** (Z +10.0), with 1.4 of wall outside and 2.15 inside. A 0.5 × 30° ramp on the end face leads the plunger in from the side the lever approaches. Rev 2's single block had a counterbore that broke into the lock hole and a 0.4 outer wall (REJ) |
| **Feststeller "05 01 01"** | Turn-button (Vorreiber) on a Ms bracket in the box's **front-right corner**.<br>• **Pivot and lever.** Vertical pivot ⌀4 at **X +63, Y −63** ("17" from the front inner wall; on the diagonal, T3 ±1.5). The lever is **32** long to the plunger (T3), **8 wide × 4 thick**, Ms 58 hard or steel. Its upper face is at Z +10.5: 3.5 below the ring, 0.5 below the Kloben's end face. The tip end stops at r 55, 1.25 clear of the 108 band.<br>• **Plunger.** The tip carries a **spring index plunger** (Federbolzen): ⌀3 h9 hardened steel, protruding 1.5 upward under a light spring. It is housed in a ⌀7 × 8 boss under the lever, 1.25 clear of the pot body, with a knurled pull-knob underneath.<br>• **"Fest".** Swing the lever about 67° until it points roughly at the bowl centre. The plunger rides up the ramp, is pressed down under the end face, and snaps 1.0 into the lock hole. A pin in a **closed** hole holds the lock point both radially and tangentially. That point is 14 below the axis plane, so the two constraints block rotation about **both** axes. The residual tilt is 0.41–0.61° from the 0.10–0.15 radial play (CON). A 5 g shock in the padded Überkasten puts ≈120 N on the plunger and 73 MPa in the lever (CON).<br>• **"Frei".** Pull the knob down and swing the lever back along the wall as drawn, 26 mm outside the ring's swept volume (IND) |
| Screws WN-71/72/78 | M3 shoulder (shutter, §6.1), M2.6 × 3, **M2.6 × 6**, all slotted cheese head and blued (T4 heads, like the movement's WN screws). The M2.6 × 6 gives 2.5 of thread in each wall:<br>• the 3.75 wall of the 108 band, tips 1.25 short of the bore;<br>• the 3.06 wall under the Gehäuseklaben flats, tips 0.56 short;<br>• the Kardanring wall, tips 1.0 short of the ID |

**Why the lock was changed (rev 2).** Rev 1 put a ⌀3 vertical pin on the lever tip into a fork slot in the Kloben that opened radially outward. That cannot work, for two reasons:
- A pin in an open slot restrains one direction only (across the slot), and the bowl has two tilt freedoms. The bowl stays free to tilt about the horizontal axis square to the lock radius (REJ: rank 1).
- With the drawn pivot and lever, the tip moves at 76° to the radial at engagement, almost tangentially. It could not enter a slot that opens radially in the first place (REJ).

The plunger in a closed hole keeps the drawn lever, pivot and "50°" and fixes both faults.

### 8.4 Balancing ("Kloben verstellen")
The plan CG of the bowl comes out at **X +0.76, Y +0.20** in the default build, without the Zeigerstellung (the barrel lies toward 3 o'clock in dial view). With the Zeigerstellung fitted it is X +0.50.
- **Axis b.** Shift both Gehäuseklaben about 0.75 toward 3 o'clock.
- **Axis a.** Shift the Kardanringkloben about 0.2 so that the bowl moves toward 6 o'clock.
- **Unadjusted**, the bowl would hang atan(0.76 / 13.7) = 3.2° out of level. The balance would then run in a tilted position, with a position error of its own.
- **Range.** The ±1.5 (b) and ±1.0 (a) adjustments cover these with ≥0.5 to spare for the T4 mass estimates (CON). A bowl that needs more is not as specified. Find the cause, for example an unrecorded fitting; do not file the slots longer.
- **Procedure.** Balance with the movement, bezel and glass in, and the shutter closed. The bowl must rest level in any position it is turned to. Then drill and pin the Klobens.

### 8.5 Swing and clearances

- **No swing stops are drawn.** With the inner lid closed (axis 46 below it, T3), the ring touches the lid at **±29°** about a and the bezel corner at **±28°** about b. That is the usual marine range, but a ship can roll further, and the lid height is only T3 ±3. **Line the lid's underside with felt or chamois** where the ring top and the bezel corner can reach it (a 60-wide band over the ring's path at 12/6 and at 3/9), so that a heavy roll ends in a soft stop rather than a knock to the balance.
- With the lid open the bowl **turns over about b inside the ring** for winding: bowl envelope radius 68.5 about the axis (at the body/cone edge) against ring ID/2 69.5, **0.97 clear**. The drawn ring (137.9) would give 0.42, which is why the ID is taken 1 mm up within its scan tolerance. The knobs of the Zeigerstellung (if fitted), the balance stop and the Feststellkloben all lie inside the envelope.
- The WN-79 nuts (r 75.0, at 12/6) clear the front and back walls by 5.0 and touch the closed lid only at about ±36°, after the ring itself.
- Ring and Kloben (r 76.5) sit 1.0 inside the box bearing plates (r 77.5) of the 160 interior ("160⌀" extension lines land on the inner wall faces: 185 − 2 × 12.5 = 160, IND).
- Box floor 97 below the axis (T3): the ring's swept envelope (73.9) and the bowl (68.5) clear it by ≥23.

### 8.6 Operating and workshop rules

| When | Rule | Why |
|---|---|---|
| Making the pot and bezel | Rough-machine both castings, **stress-relieve** (Ms: about 250–300 °C, slow cool), then finish. Turn the pot's rebate, seat, P0 and thread in one setting, and the bezel's ceiling and thread in one setting | A cast brass ring that relaxes after finishing goes out of round and out of flat. The bezel clamps the Werkring on a 0.78 land, so both faces must be flat and square to the thread |
| Fitting the movement | Fit the rebate depth to the actual Werkring so the flange stands 0.03–0.05 proud of P0. Check that the WN-10 dial-screw heads are flush to 0.05 below the dial. Face the Korkring to 0.1–0.2 contact. With the bezel tight, check the fusee end-shake (0.04), that the balance swings freely, and that the minute hand clears the bezel all round | §2.1, §3.2, §4.3, §5.1 |
| Closing the bezel | Screw it home firmly by hand (a leather strap if needed), then scribe a fine **witness line** across the bezel and the pot | The bezel is the movement's only clamp. A broken line shows at a glance that it has backed off |
| Opening the bezel | **Lift the bowl out of the ring first**: slack the WN-400 nuts and back the WN-79 pivots out 3.5. In the ring only the top 6 mm of the bezel stands above the ring, with about 7 mm of finger room | Unscrewing it in place invites a slip that jars the bowl |
| With the bezel off | **Never turn the bowl over.** The movement is held only by the bezel; without it the movement lies loose on its seat, lifted slightly by the Korkring | No case screws (§3.3) |
| Setting the hands (no Zeigerstellung) | Bezel off, bowl level on the bench, turn the minute hand only | §4.4 |
| Daily winding | Every 24 h at the same hour, by the same person. Feststeller at "Frei": open the shutter, turn the bowl over gently about b inside the ring, and wind counter-clockwise with the key until the stop-work stops it. That is about **3.75 turns**; the up-and-down hand returns to 0. Close the shutter and turn the bowl back | §6.3. Winding at a fixed hour keeps the fusee in its top 24 h, where the drive torque varies only ±2.1 % (movement spec) |
| Rating | Never set the hands to correct the time. Compare daily with a radio time signal and log the error and the daily rate; the navigator applies them | A chronometer is used by its known rate, not by its reading |
| Carrying by hand (e.g. to the rating office) | Keep it **running**. Feststeller "Fest", lid closed, carried level | Stopping it with the balance stop breaks the rate record |
| Shipping as freight | Feststeller "Fest", balance stop "fest" (05-36), box in the padded Überkasten. Re-rate after restarting | The 0.21 balance pivots will not survive a drop with the balance free |
| Aboard | Feststeller "Frei", gimbals free, inner lid closed | The bowl must hang free to stay level |
| Servicing the gimbal | A trace of clock oil on the four pivots at each movement service. Check the axis end-shakes (0.2–0.3) and the WN-400 nuts | Dry plain pivots stick and let the bowl hang off level; too little end-shake binds in the heat |

---

## 9. Masses and centre of gravity

Ms 8.5, glass 2.5 g/cm³. The case parts and the Werkring and dial are computed from their drawn or designed solids (T2); the movement items are estimates (T4).

| Part | Mass g | CG Z |
|---|---|---|
| Gehäusetopf, finished, Ms | 955 | +24.3 |
| Glasrand, Ms (⌀95 sight bore) | 493 | −16.0 |
| Glass ⌀100 × 3 | 59 | −20.5 |
| Verschlußplatte + WN-71 + Feder | 84 | +49.8 |
| Werkring (05-08_07 solid) | 176 | −5.9 |
| Zifferblatt ⌀103.6 × 1.3 | 93 | −11.0 |
| Plates, barrel bridge, pillars | 289 | +9.8 |
| Barrel complete (spring 62 g) | 139 | +11 |
| Fusee complete | 65 | +10 |
| Train, balance, escapement, cocks, Staubfutter group, Zwischenbrücke, motion work, sundries | 131 | +12.3 |
| Gehäuseklaben, Feststellkloben, balance stop | 44 | — |
| **Bowl (all brass, default build without Zeigerstellung)** | **2529** | **+9.19** |

The Zeigerstellung (14 g, at Z +16.8) is left out of the default. It hangs below the CG, so leaving it out is the conservative case for the CG depth: fitted, the bowl is 2543 g and its CG is 13.8 below the axis.

| Case | CG below axis b/a | Tier |
|---|---|---|
| **Design axis −4.5, brass castings** | **13.7 mm** | CON |
| Axis at −8.2 / −2.0 (scan spread) | 17.4 / 11.2 | CON |
| Pot taken as the drawn "350 gr.", bezel Ms | 9.0 | CON |
| Pot **and** bezel in light alloy | 12.9 | CON |

The CG is below the gimbal axis in every reading, by 9.0 mm at worst. The bowl's pendulum period is ≈0.72 s, far shorter than a ship's roll (6–15 s), so the dial follows the apparent vertical quasi-statically. **No lead or brass ballast is needed or drawn.** The shutter (84 g at the very bottom) and the 5-mm floor already act as ballast. If light-alloy castings are used and more margin is wanted, a Ms ballast ring 3 × 8 on the floor face outside r 36 adds about 50 g at Z +41 (T4, optional).

---

## 10. Box interface (Holzkasten 127-556.02, no sheet)

| Item | Specification | Tier |
|---|---|---|
| Interior | 160 × 160 ("160⌀" on 05-01_1; "Holzgehäuse 185×185×180mm außen", walls 12.5 as the 51-00_2 board) | T1 |
| Axis a height | **97** above the interior floor, 46 below the inner lid (51-00_1, 1:2) | T3 ±3 |
| **Lagerplatte** (2×, one per side wall) | Ms 30 wide × 40 high × 2.5, centred on axis a; inner face at 77.5 from the box centre; fixed by 2 wood screws "2,4×13 Din 97" (hardware already in the 51-00_5 list) at ±14 vertical | T4 |
| **Lagerbuchse** (2×, new in rev 3) | Ms ⌀8 × 15, hard-soldered into a ⌀8 hole at the Lagerplatte's centre, passing through the wall. Its outer end is flush with the outer face of the wall. **M4 tapped through** its full length for WN-80. The WN-400 lock nut bears on the bush end, so neither the screw's thread nor its lock depends on the wood. Rev 2 had 2.5 of thread in the plate and locked the nut on the wooden wall, which creeps and lets the pivot screw turn | T4 |
| Wall hole | ⌀8.0, square to the wall, on axis a, for the Lagerbuchse | T4 |
| Feststeller bracket | Ms angle in the front-right corner, pivot at X +63, Y −63, lever upper face **82 above the interior floor** (Z +10.5); 2 wood screws "3×15 Din 96" | T3 / T4 |
| Lid lining | Felt or chamois on the inner lid's underside over the ring and bezel paths (§8.5) | T4 |
| Box joinery | Front and back boards with the grain horizontal, so that the side-wall spacing that carries axis a (and its 0.2–0.3 end-shake) is set along the grain and barely moves with humidity | T4 |
| Überkasten (51-00_5) | Out of scope: outer birch transport box 370 × 270 (pencil "240", "260'"), padded; the Holzkasten sits inside it | — |

---

## 11. Fits, clearances and closure

### 11.1 Fits and clearances

| # | Pair | Values | Clearance / contact | Tier |
|---|---|---|---|---|
| 1 | Werkring flange / pot rebate (dia.) | 105.85–105.95 / 106.05–106.10 | 0.10–0.25 | T1 / T4 |
| 2 | Werkring flange height / rebate depth | 4.70 / 4.66 fitted | flange 0.03–0.05 proud of P0 | T1 / T4 |
| 3 | Werkring body / bore (radial) | 95.7–96.0 / 100.0 ±0.1 | 1.95–2.2 | T1 |
| 4 | Stellstift 3 / notch width | 1.602–1.608 / 1.70–1.75 | 0.09–0.15 | T4 |
| 5 | Pin lower edge / notch floor | Z −7.45 / −7.35 | 0.10 | T1 / T4 |
| 6 | Pin tip / notch radial floor | r 54.425–54.475 / 54.60 | 0.13–0.18 | T4 |
| 7 | Bezel / pot thread | M113 × 0.75 6H/6g, 3.2 of full thread (4.3 turns) | standard | T4 |
| 8 | Bezel ceiling / Werkring flange land; ceiling / P0 | land 0.78 wide, the only stop; P0 Z −11.01 | 0 on the land; P0 0.03–0.05 clear | T4 |
| 9 | Bezel skirt end / 117.5 shoulder | Z −6.55 / −6.01 | 0.54 | T4 |
| 10 | Bezel relief / dial outer face | Z −11.75 / −11.65 | 0.10 | T1 / T4 |
| 11 | Dial / Werkring recess (dia.) | 103.5–103.6 / 104.0–104.1 | 0.4–0.6 | T1 |
| 12 | Glass / rebate (dia.) | 99.9–100.0 / 100.2–100.3 | 0.2–0.4 | T4 |
| 13 | Glass underside / Minutentrieb tip | −18.95 / −18.23 | **0.72** | T4 / T1 |
| 14 | Glass underside / minute hand blade | −18.95 / −16.75 | 2.20 | T3 |
| 14a | Glass underside / minute-hand boss (rev 2, forward) | −18.95 / −18.10 | 0.85 | T4 / T1 |
| 14b | Minute-hand tip / bezel sight bore (radial), in place and while the bezel goes on | r 46.1 max / 47.5 | **1.4** (a plain ⌀92 bore, or a ⌀92 lip at the dial end: −0.1, REJ) | T1 / T4 |
| 14c | Minute-hand blade top / dial-side face of the ⌀92 lip (axial) | −16.75 / −17.95 | 1.2 | T3 / T4 |
| 14d | Dial minute track / ⌀92 lip (radial) | r 45.0 / 46.0 | 1.0 visible margin | T1 / T1 (IND) |
| 15 | Korkring / floor face | faced at assembly / 42.65 | 0.1–0.2 contact (as found 0.10–0.35) | T4 / T1 |
| 15a | Staubfutter top / floor face | 41.95 / 42.65 | 0.70 | T1 |
| 16 | Balance cock top / floor | 37.35 / 42.65 | 5.30 | T1 |
| 17 | Fusee square tip / shutter inner face | 45.91 / 47.79 | 1.88 | T1 / T4 |
| 18 | Shutter / recess (dia.) | 67.8–68.0 / 68.4–68.47 | 0.4–0.67 | T1 / T4 |
| 19 | Shutter boss face / foot plane | 52.79 / 53.39 | 0.60 recessed | T1 / T4 |
| 20 | Shutter bore / WN-71 shoulder | 5.5–5.6 / 5.478–5.490 (f7) | 0.01–0.12 | T1 / T4 |
| 20a | Shutter bore length / WN-71 shoulder length | 3.05–3.10 / 3.15 fitted | 0.05–0.10 end-shake (3.0: −0.05, clamps, REJ) | T1 / T4 |
| 21 | Key tube / shutter hole, floor hole (dia.) | 5.90–5.95 / 8.0–8.2, 8.0–8.1 | 2.05–2.30 | T1 |
| 22 | Key socket / square flats at the socket mouth (Z 30.71) | 3.10–3.15 / 3.069 | 0.03–0.08 | T1 |
| 22a | Key tube / Staubfutter top bore (dia.) | 5.90–5.95 / 7.62 | 1.67–1.72 | T1 |
| 23 | Pivots a, b / bearing holes | ⌀3 f7, ⌀2.5 f7 / 3.05, 2.55 H8 | 0.056–0.080 ("leicht spielend"); angular freedom 0.95° (a, 3.4 long), 1.07° (b, 3.0 long) | T4 |
| 23a | Kloben bore misalignment from adjustment | b: on flats, 0 at any setting; a: ±1.0 on R73 | a: 0.78° < 0.95° | T4 |
| 24 | End-shake a, b (total per axis) | WN-79 / WN-80 shoulders 0.10–0.15 off the boss / Kloben faces | 0.2–0.3 at 20 °C | T4 |
| 24a | WN-79 thread outside the ring OD / DIN 439 M3 nut | 2.5 / 1.8 | 0.7 for the slot | T4 |
| 25 | Bowl envelope / ring ID (turn-over) | 68.5 / 69.5 | 0.97 (0.42 with the T3 ring) | T1 bowl / T3–T4 ring |
| 26 | Kardanringkloben / Lagerplatte | r 76.5 / 77.5 | 1.0 | T4 |
| 27 | Gehäuseklaben boss top / bezel bevel | Z −8.05 / −9.15 at r 59.5 | 1.10 | T4 |
| 28 | Gehäuseklaben boss / 117.5 shoulder | r 59.5 / 58.75 | 0.75 | T4 |
| 29 | Feststeller lever upper face / ring bottom | Z +10.5 / +7.0 | 3.5 | T4 |
| 29a | Feststeller lever upper face / Feststellkloben end face | Z +10.5 / +10.0 | 0.5 (plunger rides under it) | T4 |
| 29b | Lock plunger / lock hole | ⌀3 h9 / ⌀3.2 H11, 1.0 engaged | 0.10–0.15 radial → 0.41–0.61° residual tilt | T4 |
| 29c | Kloben feet and tapped holes / 108 band ends | Z +1.4 … +11.4 / +0.69, +12.19 | ≥ 0.71 | T4 |
| 29d | WN-78 M2.6 × 6 / 108 band wall 3.75; 3.06 under the flats | 2.5 engaged | tips 1.25 / 0.56 short of the bore | T4 |
| 29e | Gehäuseklaben screw heads / crank arm | Z 5.25 / 4.4 | 0.85 | T4 |
| 29f | Lock hole / Feststellkloben boss faces | r 55.9 … 59.1 / 53.75, 60.5 | 2.15 inside, 1.4 outside | T4 |
| 29g | Feststeller lever tip end / 108 band; plunger housing / body | r 55.0 / 53.75; r 54.0 / 52.75 | 1.25; 1.25 | T4 |
| 30 | Ring swing / inner lid | — | contact at ±29° (a), ±28° (b) | T3 |
| 31 | Ring and bowl / box floor | 73.9, 68.5 / 97 | ≥23 | T3 |

### 11.2 `case_closure.py` result

```
Independent checks:   29/29 pass
Consistency checks:   78/78 pass (by construction; feasibility only)
Rejected alternatives: 19/19 fail as expected
Unexpected results: 0
```

The independent checks:

- **Werkring:** 3 + 7 + 0.7 = 10.7; dial seat vs 05-05_01; cross-section heights; "3 ±0,05" on 05-06_01; dial 103.6 in the 104 recess.
- **Pot:** floor stock from "53" vs "49"; the Korkring reaches the floor by two routes (T3 top 43.0; rev-2 lug 38.95 + "3,9"); bore stock 98 → 100.
- **Overall height:** against 05-36 Ansicht v. C. and against 05-01_1 C-D.
- **Dial in the bezel (rev 3):** the drawn ⌀90 minute track inside the drawn ⌀92 aperture; the dial screws on the drawn ⌀101 circle under it.
- **Winding:** shutter "22,6" vs fusee radius 22.650 from the plate table; key tube through "8,0⌀", "8 +0,2" and the Staubfutter top bore 7.62; key reach 44.4; socket depth "19 +2"; 3.1□ socket on the square.
- **Pass-throughs:** Zeigerstellung Z from "23,15" vs scaled; Sekundenkontakt Z from "35" vs scaled.
- **Gimbal:** bowl turn-over inside the drawn ring; ring and bowl vs box floor; Feststeller outside the swept ring; drawn lever 32 vs pivot → lock hole at "50°"; 185 − 2 × 12.5 vs "160".

The rev-2 consistency checks add:
- the P0 clearance under the bezel;
- the fitted Korkring and its seal land;
- the Staubfutter to the floor;
- the lock's rank and residual tilt (the 2 × 2 matrix of the constraint normals against the two tilt axes);
- the lever under the Kloben end face;
- every Kloben foot and tapped hole inside the 108 band;
- the WN-78 engagement and tip clearance.

The rev-3 consistency checks add:
- **Bezel and hands:** the full-thread engagement; the notch floor; the minute hand against the sight bore and the lip; the **assembly path** (every bezel bore that passes the hand plane as the bezel goes on); the glass ledge; the glass clearance in the cold.
- **Shutter and winding:** the WN-71 end-shake, head height and tap-drill floor; the Verschlußfeder force, stress and height; the daily winding turns.
- **Box:** the Lagerbuchse and WN-80 lengths and the WN-80 tip.
- **Gimbal parts:**
  - the Gehäuseklaben flat, screw-tip and crank clearances;
  - the Kardanringkloben misalignment;
  - the WN-79 length and nut;
  - the axis-a end-shake when warm;
  - the Feststellkloben hole wall and ear heads;
  - the lever tip and plunger housing;
  - the lever stress at 5 g.
- **Balancing:** the balancing range for both builds.

The rejected alternatives are:
- a bezel skirt threaded into the 118 rim (1.0 wall);
- the Werkring on an unrebated rim (cork 3.35 short);
- the bezel over the Werkring flange (height 80.3);
- the corner reading of the fusee square (key play 0.93);
- "350 gr." for an Ms casting (1268 g);
- three rev-1 features:
  - the open fork lock (rank 1);
  - the lever tip entering a radial fork (it moves at 76° to the radial);
  - the Feststellkloben at Z +6 → +13 (0.81 past the 108 band);
- ten rev-2 features:
  - the plain ⌀92 aperture (minute-hand tip −0.1);
  - "4.5 = 6 threads" (4.3 full turns);
  - the WN-71 shoulder 3.0 (clamps the shutter);
  - daily winding "8.8 turns" (3.73);
  - the upper Gehäuseklaben screw under the crank;
  - the Gehäuseklaben slid ±2.5 on the curved band (2.66° against 1.07°);
  - the Kardanringkloben slid ±2.5 (1.96° against 0.95°);
  - the WN-79 × 12 (1.5 outside the ring for a 1.8 nut);
  - the WN-79 shoulder 4.0 off the boss (end-shake 8);
  - the Feststellkloben counterbore breaking into the lock hole;
- one rev-3 draft: the ⌀92 lip at the dial end (it fits in place, but sweeps past the minute hand as the bezel goes on).

---

## 12. Decision log

| Item | Drawn options | Decision | Tier | Evidence |
|---|---|---|---|---|
| What the pot and bezel sheets are | "R-050100-1", "R-050101-2" with "Kokillenguß" and a weight | **Casting drawings**; finished geometry designed inside them | T4 | No holes, threads or seats on either; the parts list uses 05 01 00-1 / 05 01 01-2 |
| Bore | "98⌀" (casting) vs "innerer Gehäuse⌀ 100mm" (001) | **100.0 finished** | T1 | 1.0 stock per side; Werkring body 96 clears |
| 106⌀ / 108⌀ sense | audit: 106 external (?), 98 internal (?) | **118, 108, 106 all outside; 98 inside** | T1 | Pixel scan of both halves (§1.2) |
| Bezel joint | thread on the pot; thread in the rim; screws through the 118 flange | **M113 × 0.75 on the pot rim, female in the bezel** | T4 (T3/T1 support) | §2.1 table |
| Movement fixing | none drawn on case sheets; Werkring 05-08_07 | **Werkring flange in a pot rebate, clamped by the bezel ceiling; no case screws** | T1 Werkring / T4 seat | Werkring closes 10.7; "Werkringauflage" on 05-06_01 |
| The notch | none drawn | **Locating notch at 12 o'clock for Stellstift 3 (WN-202)** | T1 position / T4 size | Cross-section callout; ⌀1.6 radial hole on 05-08_07 |
| Stellstift 3 length | protrudes ≈2.4 (T3) | **1.5** | T4 | Keeps 1.44 wall under the thread |
| Floor height | "53" casting depth; "49" from the Werkring seat (05-06_01) | **Seat + 49 = Z +42.65** | T1 value / T3 datum | The Korkring reaches the floor by every route (0.10–0.35) |
| Bezel stop (rev 2) | rev 1: ceiling on P0 and a 0.02 nip on the flange at once | **Flange land the only stop; flange 0.03–0.05 proud of P0** | T4 | Both cannot happen: a 0.02 squeeze of the brass flange needs tens of kN |
| Korkring fit (rev 2) | T3 0.35; lug + "3,9" 0.20; lug + 3.8 0.10; bore "≈9.7" | **Faced at assembly to 0.1–0.2 contact; bore ≈13.1** | T4 | Seals the key hole without loading the upper plate next to the fusee (0.04 end-shake); the cork sits round the ⌀13.1 Staubfutter body |
| Floor corner | bore 98 straight to the floor with R≈5 | **⌀100 to Z +38.26, then a 2.5-wall inner cone** | T4 | A straight ⌀100 would cut through the cone |
| "Gewicht 350 gr." | 350 g vs 1268 g (Ms, as drawn) | **Build in Ms; check the CG for both** | T1 conflict | §4.1 |
| Glass | position not dimensioned; kompl. sheet suggests a large glass mid-height | **⌀100 × 3 at the top, burnished lip** | T3 thickness / T4 | Hand stack forbids a lower glass |
| Dial clamping | 05-01_4 stepped ceiling, direction unclear | **Relief 0.70; the bezel clamps the Werkring flange, not the dial** | T4 | Protects the lacquered dial |
| Shutter function | M2.6 at 25, 1.2 at 12.4, Verschlußfeder, WN-72 | **90° rotary shutter, spring detent, WN-72 head as finger tab** | T1 features / T4 function | 8 +0.2 at 22.6 = fusee radius |
| Fusee square size | spec: 3.10 → 2.93 corners | **3.1 across flats at the root** | T1 (key) | Key socket "3,1□ +0,05"; otherwise the key slips (REJ) |
| "50°" | swing limit or position | **Angular position of the Feststellkloben (130°)** | T1 text / T3 | Drawn in plan; lever-length closure 32.2 vs 32 |
| Lock engagement (rev 2) | rev 1: ⌀3 pin in an open radial fork | **Spring index plunger in the lever tip into a closed vertical ⌀3.2 hole** | T4 | The fork gives one constraint for two tilt axes (rank 1) and cannot be entered by a tip moving at 76° to the radial; the closed hole gives rank 2, 0.41–0.61° residual tilt |
| Feststellkloben height (rev 2) | rev 1: Z +6 → +13, screws +7.5 / +11.5 | **Z +2.5 → +10.0, screws +4.5 / +7.5** | T4 | Rev 1 overhung the 108 band (ends +12.19) by 0.81 and broke its upper hole across the step |
| WN-78 length (rev 2) | rev 1: M2.6 × 5 | **M2.6 × 6** | T4 | 1.5 of thread in brass is short for the bowl's weight under shock; × 6 gives 2.5 with the tip 1.25 short of the bore |
| Zeigerstellung hole (rev 2) | rev 1: always drilled | **Only if the Zeigerstellung is fitted** | T1 (movement plate rows 14–18 conditional) | The movement's default build omits it; hands are set with the bezel off |
| Swing limit | not drawn | **None fitted; inner lid limits ±28–29°, lid lined with felt; turn-over about b with the lid open** | T3 / T4 | Box GA 51-00_1 |
| Pivot type | "Lagerstellen a u.b leicht spielend" | **Plain cylindrical pivots, 0.056–0.080 clearance, 0.2–0.3 end-shake** | T1 text / T4 sizes | Cones have no play |
| Pivot screws (rev 3) | WN-79 / WN-80 with WN-400; rev 2: × 12 / × 26, end-shake not limited by anything | **M3 × 13 and M4 × 25 slotted set-screws whose thread end is the shoulder that sets the end-shake; lock nuts on the ring's spot face and on a Ms Lagerbuchse** | T3 shank (≈4 on 05-01_1) / T4 | Nut on the ring (C-D) and outside the wall. Rev 2 left 1.5 for a 1.8 nut and 4.0 of bare pivot, and locked the M4 nut on wood |
| Bezel aperture (rev 3) | "92⌀" (casting) through the hand stack | **⌀92 lip 1.0 thick at the glass end (also the glass ledge); ⌀95 undercut below it, to the dial** | T1 lip / T4 bore | Drawn minute hand 46 would rub a plain ⌀92 (−0.1). At the dial end the lip would sweep past the hand as the bezel goes on. At the glass end it still frames the ⌀90 track and hides the ⌀101 screws |
| Glass retention (rev 3) | "eingerieben" reading; rev 2 burnished a solid wall | **Turned lip 0.5 × 0.8, freed by a groove, rubbed over the arris** | T4 | A 12-wide solid wall cannot be rubbed over |
| WN-71 shoulder (rev 3) | rev 2: 3.0 | **3.15, fitted to the shutter's bore length + 0.05** | T1 bore ("5", "2 −0,05/−0,1") / T4 | 3.0 is shorter than the 3.05–3.10 bore; the head would clamp the shutter |
| Verschlußfeder (rev 3) | rev 2: flat leaf 0.3 × 3.5 | **0.4 steel, flat foot under WN-72 with a cranked steady-pin end on the boss; arm on edge, nib in two V-notches** | T1 holes / T4 | A flat leaf cannot flex radially into the recess-wall notches |
| Gehäuseklaben seat (rev 3) | rev 2: curved foot, ±2.5, screws stacked at Z +3.9 / +8.9 | **19-wide flats on the 108 band; screws side by side at Z +7.5; ±1.5** | T4 | The curved slide turned the bore 2.66° (pivot freedom 1.07°); the upper screw sat under the crank arm |
| Feststellkloben form (rev 3) | rev 2: 16 × 5.75 block, counterbored screws 4 off the hole | **Central boss to r 60.5 plus two 3.5 ears with the screws** | T4 | The counterbore broke into the lock hole; the outer wall was 0.4 |
| Daily winding (rev 3) | rev 2: "about 8.8 turns" | **3.73 turns per 24 h, to the stop-work** | T1 train (z14 / z90) | 8.761 is the full wind from run-down |
| Axis height | −2.0 … −8.2 across three scans | **−4.5** | T3 | C-D local relation; CG checked over the whole spread |
| Ring size | 145.4 / 137.9 × 22.7–24 | **146 / 139 × 23** | T3 → T4 | Turn-over clearance 1.0 |
| Klobens adjustable | "Kloben verstellen bis Gleichgewicht erreicht ist" | **Gehäuseklaben ±1.5 on flats (axis b), Kardanringkloben ±1.0 on the ring (axis a); pinned after balancing** | T1 text / T4 | Plan CG X +0.76, Y +0.20 (default build); +0.50 with the Zeigerstellung |
| Ballast | none drawn | **None** | T4 | CG ≥ 9.0 below the axis in every reading |
| Seconds contact | 05-38, optional | **Feed-through provided only if fitted** | T1(?) Z / T4 | "35 ±0,2(?)" from the seat |

---

## 13. Open items and what would settle them

| # | Item | Current basis | Would be settled by |
|---|---|---|---|
| 1 | Bezel joint: thread vs screws through the flange; the 106⌀ bezel recess ≈ Werkring flange | §2.1 (four counts against one) | The finished-part sheets 05 01 00-1 and 05 01 01-2, or a surviving case |
| 2 | Thread diameter and pitch, M113 × 0.75 | T4 within the casting; T3 hint at ⌀113–114.6 on 05-01_4 | As 1 |
| 3 | Casting material and the 350 g | Ms per the Werkstoff field; weight fits light alloy | A better scan of 05-01_2 or a material change note |
| 4 | Gimbal axis height | T3 spread −2.0 … −8.2 | Sheets 05 01 00-3 (Gehäuseklaben) and 05 01 00-5 (Kardanring) |
| 5 | Kardanring section, Klobens, Feststeller, Verschlußfeder | T3 outlines / T4 | Sheets 05 01 00-3 … -7 and "05 01 01" Feststeller (number collides with Glasrand kompl.) |
| 6 | Glass size, position, retention | T3 thickness / T4 | A better scan of 05-01_4 or the glass sheet 05 01 01-1 |
| 7 | Azimuths of the Zeigerstellung, balance stop and seconds contact | T3 from the plate table / T4 | Spot through the fitted movement; or sub-part sheets of 05-33 / 05-36 / 05-38 |
| 8 | Korkring thickness and bore (the Staubfutter bore is settled: ⌀8 H7 → ⌀7.62, open at the top; the "5" on 05-08_09 is the 5° lead-in) | T3 3.8 (1941 "3,9"); faced at assembly | Sheet 05 08 01-4 |
| 9 | Box interior height, inner lid, axis height | T3 1:2 GA | Holzkasten 127-556.02 sheet |
| 10 | Stellstift 3 protrusion | T3 2.4 vs designed 1.5 | Pin sheet WN-202 |
| 11 | Illegible: "1?5" near A on 05-01_1; "96⌀ −0,3(?)"; "35 ±0,2(?)"; "2,3(?)"; "12,4(?)" | Designed around | Originals at ≥300 dpi |
| 12 | Balance-stop push-piece height and bearing | T3 +28.0 ±1.5 / 217° ±15° | Sub-part sheets of 05-36, or spotting against the built Winkelhebel |
| 13 | Bezel aperture form: ⌀92 lip at the glass end + ⌀95 undercut, against the drawn minute hand 46 | T1 both / T4 form | The finished Glasrand sheet 05 01 01-2 |
| 14 | Verschlußfeder form and the open/closed detent | T1 holes / T4 spring | Sheet 05 01 00-7 |

---

## 14. Findings that affect the movement spec

**Status (movement rev 2, commit fcf87e4):** items 1–3 are now in `Federchronometer05.md` / `Federchronometer05_CAD_Spec.md` (Werkring T1 with the flange underside at −6.35, fusee square 3.1□ across the flats, Korkring on the Staubfutter lug). Item 4 (`inf_fusee.md`) is a stale working file and is left as history.

1. **The Werkring has a sheet**, 05-08_07 (05 08 00-3). `Federchronometer05.md` §10.2 lists "movement fixing / Werkring" as missing, and `_audit/audit_case.md` says the Werkring of 05-38 has no sheet (`audit_frame.md` does transcribe it). The Werkring makes the dial faces −10.35 / −11.65 **T1** (3 + 7 + 0.7 = 10.7), not T3 as in §5.4.
2. **Fusee winding square:** `res_fusee.md` reads "3,10 → 2,93" as corner diameters. The key socket "3,1□ +0,05" only drives a square that is **3.1 across the flats** at its root. Read as corners, the flats would be 2.19 and the key would slip (REJ). The Staubplatte's round "3,1 Kegel 1:100" bore then fits on the flats region, not on the corners; this needs re-checking in the fusee chapter.
3. **Korkring 05 08 01-4** (cross-section callout, on the Staubfutter top, T3 top Z 43.0, ≈3.8 thick) is missing from the movement spec. It is the movement's highest axial contact and sets the case floor.
4. **`inf_fusee.md` line 237** ("tip 1 inside the case face and 0,9 from the Staubfutter end") describes the 1941 sheet 05-06_01. With the 1948 square (tip 45.91) and the rev-2 Staubfutter (top 41.95) the tip stands 3.96 above the Staubfutter. The "1" is the tip-to-case-**outer**-face distance inside the winding hole.
5. **§10.1 "innerer Gehäuse⌀ 100 matches no dimension on the Gehäusetopf"** is resolved: the pot sheet is a casting drawing with a 98 bore; 100 is the finished bore.
6. **Not a conflict, but new:** the movement's dial is 0.60 proud of the Werkring flange; any case design must relieve or clamp it.
7. **Korkring (case rev 2):** the movement spec gives the cork as "≈38.95 → 43.0, ≈3.8 thick", but 38.95 + 3.8 = 42.75. The case now faces the cork at assembly to 0.1–0.2 contact. The cork's bore must clear the ⌀13.1 Staubfutter body (≈13.1), so the movement spec's cork row could carry that. The cork's reaction passes into the upper plate beside the fusee: check the fusee end-shake with the bezel tightened (assembly step).
8. **Zeigerstellung:** the case hole is now conditional, matching the movement spec's conditional plate rows 14–18. If the Zeigerstellung is ever fitted, its shaft must be withdrawable through the case bush before the movement is lifted (§2.2).
9. **Balance stop:** its push-piece position in the case is T3 and must be spotted against the built Winkelhebel (upper-plate hole 52). Its inner end must stand back beyond r 42.5 when released, so the movement can be lowered past it.
10. **Minute hand vs bezel (case rev 3):**
    - The drawn minute hand (05-02_02, 46 ±0.1) reaches the drawn bezel aperture radius (46.0). The hand runs inside the bezel, so a plain ⌀92 bore would touch it.
    - The case keeps the ⌀92 only as a 1.0 lip at the glass end and undercuts ⌀95 below it, so the movement keeps its drawn hand.
    - The constraint for the movement: the minute hand must stay ≤47.0 long, and its blade top must stay at Z ≥ −16.95, i.e. ≥1.0 on the dial side of the lip's face at −17.95 (now −16.75: 1.2).
11. **Dial screws (case rev 3):** the WN-10 heads must finish flush to 0.05 below the dial face, because the bezel relief clears the dial by 0.10. This belongs in the dial-fitting step of the movement assembly.
12. **Daily winding (case rev 3):** the operating figure is 3.73 key turns per 24 h, from the movement's z14 / z90. The case spec previously said 8.8. No movement value changes.

**Cross-check (2026-10-22, read-only).** `Federchronometer05.md` and `Federchronometer05_CAD_Spec.md` were searched for the rev-3 case values (bezel mass 516, bowl 2566, "8.8 turns", WN-71/79/80, Verschlußfeder, Gehäuseklaben, ⌀92).
- The only hits were general mentions (the case parts list, the Glasrand row "⌀92" in the CAD spec's sheet table). None of them repeats a value that rev 3 changes.
- The CAD spec was being revised by a parallel session at the time. The check should be repeated against its next revision, which should also cross-reference items 10 and 11 in its hands and dial sections.