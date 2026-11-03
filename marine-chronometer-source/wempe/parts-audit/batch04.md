# Batch 4: the going train (reader)

Sheets 05 05_1 to 05 05_7 (the layout Laufwerk and the seconds and intermediate wheels and pinions). Read blind; measurements from `TOOLS/r_wpa/measure/` and `page/placements.json`. Where a sheet prints no tolerance the fallback (+-0.05 up to 6 mm, +-0.1 to 30 mm) is used. Part-sheet pivot lengths (sheets 4 and 7, rev. 6.6.46) differ from the assembly sheets (2 and 5); both are listed.


## Sheet 05 05_1 Laufwerk (layout, going train)

**Title block as read.** Title block: Laufwerk; Zeichnung Nr So 127-556.04 / 04 05; scale 5:1; Werkstoff blank; Arbeitspause Nr 10; note 'Lagerstellen: Enger Laufsitz'; no general tolerance, no revisions legible; chronometer not stated. Fallback tolerances used.

**Views and step-2 findings.** One vertical section through the Oberplatte, Unterplatte, Zwischenbruecke and Zifferblatt (dial) with the arbors Minutenrad (centre), Zwischenrad and Sekundenrad. In the drawing the Oberplatte is at the top, so drawing 'up' = movement -y; heights are measured from the Oberplatte's inner face (built y -19). The escape wheel is not drawn. Step 2: the 19 and the 19.2/13.8 chain agree; plate thicknesses 3.0 and the bridge's 4 are read off the same section. The diagonal dims 3.1, 12.9/10.9, 2 on the centre arbor end are unclear (no clear extension lines).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 04-1-1 | Centre distance Minutenrad arbor to Zwischenrad arbor (horizontal dim at arbor mid-height) | 18.12; sure | placements 050503-2 origin (0,0) to 050502-2 origin (9.91,15.17) in plan: 18.1201 | 0.000 | match |
| 04-1-2 | Centre distance Zwischenrad arbor to Sekundenrad arbor | 12.63; sure | placements 050502-2 (9.91,15.17) to 050501-2 (0,23): 12.6300 | 0.000 | match |
| 04-1-3 | Oberplatte inner face to top face of Minutenrad (centre wheel) | 17; sure | placements 050901 box ymax -19; 050503-1 box ymin -1.74: 17.26 | +0.26 | mismatch |
| 04-1-4 | Oberplatte inner face to top face of Zwischenrad | 19.2; sure | 050901 ymax -19; 050502-1 box ymin 0.23: 19.23 | +0.03 | match |
| 04-1-5 | Oberplatte inner face to top face of Sekundenrad | 13.8; sure | 050901 ymax -19; 050501-1 box ymin -5.12: 13.88 | +0.08 (scan accuracy) | match |
| 04-1-6 | Oberplatte inner face to Unterplatte face | 19; sure | 050901 ymax -19; 050802-1 ymin 0: 19.0 | 0.0 | match |
| 04-1-7 | Oberplatte thickness | 3.0; likely | measure/topPlate.json z_levels 0..3.35; placements 050901 y -22.35..-19: 3.35 | +0.35 | mismatch |
| 04-1-8 | Unterplatte thickness (label 3.0 beside a second dim 4; unclear) | 3.0; unsure | measure/pillarPlate.json box z 0..3.35: 3.35 | +0.35 | mismatch |
| 04-1-9 | Zwischenbruecke thickness | 4; likely | measure/intermediateBridge.json box z 0..3.8: 3.8 | -0.2 | mismatch |
| 04-1-10 | Unterplatte lower face to Zifferblatt | 7; likely | placements 050802-1 ymax 3.35; 050200-4 dial ymin 10.35: 7.0 | 0.0 | match |
| 04-1-11 | Clearance in the Unterplatte round the Zwischenrad | 24.5 diameter; likely | measure/pillarPlate.json cylinders: d 24.5 inside at (-9.91,-15.17), z 0..3.35 (mirrored frame of the 9.91,15.17 position): 24.5 | 0.0 | match |
| 04-1-12 | Hole in the Zifferblatt for the seconds pivot | Loch dia 1.7; sure | measure/dial.json cylinders: d 1.7 inside at (0,-23), z 0..1.2: 1.7 | 0.0 | match |
| 04-1-13 | Seconds pivot standing proud of the Zifferblatt face | 0.5 (tiny figure); unsure, scaled about 0.75 | placements 050501-2 box ymax 12.275; dial ymax 11.57: 0.705 | +0.2 vs 0.5; within scale | can't tell |
| 04-1-14 | Centre arbor end below the Unterplatte: 3.1, 10.9, 12.9, 2 (diagonal dims) | 3.1 / 10.9 / 12.9 / 2; unsure which features | placements 050503-2 box ymax 18.36 (15.0 past the Unterplatte face 3.35): - | - | can't tell |
| 04-1-15 | Detail circle dia 5.5 at the Sekundenrad bush in the Oberplatte | 5.5; unsure, an enlargement mark | -: - | - | can't tell |

**Extras.**
- The escape wheel and its arbor are named for this sheet but are not drawn on it.
- Dial hole, plates and bridge are on the layout but belong to other sheets.

**After the verdicts.** Not done: the recipe code was not consulted (the verifier decides disagreements; no explanation of the mismatches is claimed).


## Sheet 05 05_2 Sekundenrad kompl. 05 05 01 (assembly)

**Title block as read.** Title block: Sekundenrad kompl.; Zeichnung Nr 05 05 01; scale 5:1 (M 1:1 inset); Werkstoff blank; 'nicht eingetr. Toleranz +-0,05'; gez. 27.7.40, gepr. 18.12.40, N.gepr. 20.4.43. Parts 050501-1 wheel, 050501-2 pinion/arbor. Wheel 'vernietet' (riveted).

**Views and step-2 findings.** One section view. Upper (dial-side) pivot with 'Kegel 1:90', fit note 0.73 dia 'i/Steinlager einpassen' over a 2 mm length, pivot length 7.2, collar to wheel top 9.2 +-0.05, wheel to lower shoulder 14.8, lower pivot 3 and 0.8 dia -0.02, hub dia 6 (both sides of the wheel), 0.2 (riveting projection). Step 2: pivot length 7.2 here but sheet 4 (later) prints 9.2; lower pivot 3 here, 4.5 on sheet 4; lower pivot dia 0.8 here, 0.82 on sheet 4; hub dia 6 here, 6.5 on sheet 3.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 04-2-1 | Upper pivot length, tip to collar top | 7.2; sure | measure/secondsArbor.json box z max 31.25; z_levels 24.05: 7.2 | 0.0 | match |
| 04-2-2 | Collar top to wheel top face | 9.2 +-0.05; sure | z_levels 24.05 and 14.85 (wheel against pinion shoulder): 9.2 | 0.0 | match |
| 04-2-3 | Wheel top face to lower shoulder | 14.8; likely (extension line to the wheel top face) | z_levels 14.85; lower shoulder z 0: 14.85 | +0.05 | match |
| 04-2-4 | Lower pivot length | 3; sure | box z min -3.0; shoulder 0: 3.0 | 0.0 | match |
| 04-2-5 | Lower pivot dia | 0.8 -0.02 (0.78..0.80); sure | cones[6].d 0.7767..0.81: 0.81 at shoulder | +0.01 | mismatch |
| 04-2-6 | Upper pivot fit, 2 mm above the collar | 0.73 dia; likely | cones[8].d 0.6711..0.75 over z 24.05..31.15 gives 0.728 at 2 mm: 0.728 | -0.002 | match |
| 04-2-7 | Taper Kegel 1:90 (both pivots) | 1:90; sure | cones[8] half_angle 0.3 deg (1:90); cones[6] 1:83: 1:90 / 1:83 | - | match |
| 04-2-8 | Hub dia of the wheel (arrows each side of the wheel) | 6; likely | measure/secondsWheel.json cylinders[2].d 6.4 outside: 6.4 | +0.4 | can't tell |
| 04-2-9 | Riveting projection of the pinion seat past the wheel | 0.2; unsure | seat z 13.6..14.85, wheel z 13.85..14.85 (placements 050501-1 y -5.12..-4.12 vs arbor shoulder -4.13): 0.25 | +0.05 | match |

**Extras.**
- Built hub dia 6.4 where the assembly gives 6 (sheet 3: 6.5).

**After the verdicts.** Not done: the recipe code was not consulted (the verifier decides disagreements; no explanation of the mismatches is claimed).


## Sheet 05 05_3 Sekundenrad 05 05 01-1 (seconds wheel)

**Title block as read.** Title block: Sekundenrad; Zeichnung Nr 05 05 01-1; scale 5:1 (M 1:1 inset); Werkstoff Messingblech 1,2 DIN 1751 Ms 58 federhart; 'nicht eingetr. Toleranz +-0,01'; gez. 15.8.40, gepr. 18.12.40, N.gepr. 20.4.43. Radstaerke 1,0 +-0,03.

**Views and step-2 findings.** Plan only: five arms 72 deg apart (one drawn vertical), rim, hub, bore; cycloidal teeth drawn on the top 72 deg only. Data block 'Zykloidenverzahnung': z 80, D 21.9, d 21.066, dg 20.23, t 0.827, l 0.38, M 0.263. Step 2: d = z*M = 21.06 and t = pi*M = 0.826 agree; D is the tip circle (tips drawn inside the 22.5 outline); 22.5 is the blank before cutting.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 04-3-1 | Tooth count | z 80; sure | teeth[0].count 80: 80 | 0 | match |
| 04-3-2 | Tip circle D | 21.9; sure | teeth[0].tips_d 21.8981: 21.898 | -0.002 | match |
| 04-3-3 | Root circle dg | 20.23; sure | teeth[0].roots_d 20.2295: 20.2295 | 0.000 | match |
| 04-3-4 | Tooth depth (D-dg)/2 | 0.835 derived; sure | teeth[0].depth 0.8343: 0.8343 | -0.001 | match |
| 04-3-5 | Tooth flank form, pitch t 0.827, l 0.38, M 0.263 (cycloidal) | cycloidal, drawn on 72 deg; likely | flank polylines in outlines_by_level, not reduced to a form: - | - | can't tell |
| 04-3-6 | Blank outer dia | 22.5 -0.2; sure | not on the finished part (tips 21.898 are the outermost): - | - | can't tell |
| 04-3-7 | Inner rim dia | 18.3 +0.2 (18.3..18.5); sure | cylinders[0].d 18.4 inside, arc 322.6 deg: 18.4 | +0.1 | match |
| 04-3-8 | Hub outer dia | 6.5 -0.2 (6.3..6.5); sure | cylinders[2].d 6.4 outside, arc 251.9 deg: 6.4 | -0.1 | match |
| 04-3-9 | Bore | 2.6 H7 (+0.009 printed); sure | cylinders[1].d 2.6, 360 deg: 2.6 | 0 (at the lower limit) | match |
| 04-3-10 | Arm width | 1.3 -0.2 (1.1..1.3); sure | outlines_by_level[0] arc end points: arm sides 1.2 apart, parallel: 1.2 | -0.1 | match |
| 04-3-11 | Arm count and spacing | 5 arms, 72 deg; sure | five arms 72 deg apart (phase arbitrary, wheel is riveted): 5 at 72 | 0 | match |
| 04-3-12 | Wheel thickness (Radstaerke) | 1.0 +-0.03; sure | box z 0..1.0, z_levels [0,1]: 1.0 | 0 | match |

**Extras.**
- None (teeth drawn only on 72 deg; flank form not measured).

**After the verdicts.** Not done: the recipe code was not consulted (the verifier decides disagreements; no explanation of the mismatches is claimed).


## Sheet 05 05_4 Sekundentrieb 05 05 01-2 (seconds pinion and arbor), rev. 6.6.46

**Title block as read.** Title block: Sekundentrieb; Zeichnung Nr 05 05 01-2; scale 5:1; Werkstoff Praez. Rundstahl 3,5 DIN 175; 'nicht eingetr. Toleranz +-0,1'; gez. 4.6.46 Moeller, gepr. 12.6.46. Revision note (24.3.48): 'Mass 24,1 -0,1 war 24 -0,05; Mass 1,2 +0,1 war 1,3 -0,1; (a) 4x Mass 1,55 -0,1 war ohne Toleranz'.

**Views and step-2 findings.** One side view, dial-side end at the top. Upper pivot 'Kegel 1:90', 0.65 dia at the tip, 0.76 -0.02 at the root; 1.55 collar; pinion leaf block drawn as uncut stock; 2.6 n6 seat; 1.55 body; 30 deg chamfer; lower pivot 0.82 -0.02 with Kegel 1:90. Step 2: 9.25 (collar top to pinion bottom) = 2.25 collar + 7 leaf, agrees; 24.1 from collar top to lower shoulder. Pivot lengths 9.2 / 4.5 here disagree with sheet 2's 7.2 / 3 (this sheet is the later).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 04-4-1 | Upper pivot length, tip to collar top | 9.2; sure (scaled 9.3) | z max 31.25 minus z 24.05: 7.2 | -2.0 | mismatch |
| 04-4-2 | Upper pivot dia at the tip end | 0.65; likely | cones[8].d 0.6711 at z 31.15: 0.671 | +0.02 | match |
| 04-4-3 | Upper pivot dia at the root | 0.76 -0.02 (0.74..0.76); sure | cones[8].d 0.75 at z 24.05: 0.75 | -0.01 | match |
| 04-4-4 | Collar dia (upper) | 1.55 -0.1 (1.45..1.55); sure | cylinders[2].d 1.5, z 21.85..24.05: 1.5 | -0.05 | match |
| 04-4-5 | Collar length (derived 9.25-7) | 2.25; likely | z 21.85..24.05: 2.2 | -0.05 | match |
| 04-4-6 | Collar top to pinion bottom | 9.25 -0.1; sure | z 24.05 - 14.85: 9.2 | -0.05 | match |
| 04-4-7 | Pinion leaf length | 7; sure | z_levels 14.85..21.85: 7.0 | 0 | match |
| 04-4-8 | Pinion leaf outside (uncut blank on the sheet) | stock 3.5 (scaled 3.47); likely; tip not printed | teeth[0].tips_d 3.1663; roots 1.6997: 3.166 | -0.33 | can't tell |
| 04-4-9 | Pinion leaf count | not printed; unsure | teeth[0].count 10 (80/10 with the 80-tooth Zwischenrad at 12.63: pitch dia 2.807 / M 0.280 = 10.0): 10 | - | can't tell |
| 04-4-10 | Seat under the leaves, dia | 2.6 n6 (+0.013/+0.006); sure | cylinders[0].d 2.6: 2.6 | -0.006..-0.013 | mismatch |
| 04-4-11 | Seat length | 1.2 +0.1 (1.2..1.3); sure | cylinders[0].z 13.6..14.85: 1.25 | +0.05 | match |
| 04-4-12 | Arbor body dia | 1.55 -0.1 (a); sure | cylinders[1].d 1.5, z 0.1992..13.6: 1.5 | -0.05 | match |
| 04-4-13 | Collar top to lower shoulder | 24.1 -0.1 (24.0..24.1); sure | z 24.05 to shoulder z 0: 24.05 | -0.05 | match |
| 04-4-14 | Lower pivot dia | 0.82 -0.02 (0.80..0.82); sure | cones[6].d 0.7767..0.81: 0.81 | -0.01 | match |
| 04-4-15 | Lower pivot length | 4.5; sure (scaled 4.4) | box z min -3.0: 3.0 | -1.5 | mismatch |
| 04-4-16 | Shoulder chamfer | 30 deg; likely | cones[7] half_angle 60 = 30 deg to the face (d 0.81..1.5 over 0.1992): 30.0 | 0 | match |
| 04-4-17 | Taper upper pivot | Kegel 1:90; sure | cones[8] 1:90: 1:90 | 0 | match |
| 04-4-18 | Upper tip form (pointed cone about 0.5 long, scaled) | pointed cone; unsure | cones[9]: 45 deg chamfer 0.1 long to a flat of d 0.47 at z 31.25: flat 0.47 | - | mismatch |

**Extras.**
- Built lower tip is a domed cone chain ending at d 0.201; the sheet draws a pointed cone.

**After the verdicts.** Not done: the recipe code was not consulted (the verifier decides disagreements; no explanation of the mismatches is claimed).


## Sheet 05 05_5 Zwischenrad kompl. 05 05 02 (assembly)

**Title block as read.** Title block: Zwischenrad kompl.; Zeichnung Nr 05 05 02; scale 5:1 (M 1:1 inset); Werkstoff blank; no general tolerance legible; gez. 27.7.40, gepr. 18.12.40, N.gepr. 20.4.43. Parts 050502-1, 050502-2.

**Views and step-2 findings.** One section view: 3 -0.1 pivot at each end, 0.82 -0.02 pivots (Kegel figure illegible), overall 23.05 -0.1 (collar top to lower shoulder), hub 7 dia 'vernietet', 0.2 projection. Step 2: part sheet 7 prints 4.6 pivots and 0.85 dia, here 3 and 0.82.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 04-5-1 | Collar top to lower shoulder | 23.05 -0.1; sure | measure/intermediateArbor.json z 23.0 to shoulder 0: 23.0 | -0.05 | match |
| 04-5-2 | Upper pivot length | 3 -0.1; sure | box z max 25.95 - 23.0: 2.95 | -0.05 | match |
| 04-5-3 | Lower pivot length | 3 -0.1; sure | box z min -2.95: 2.95 | -0.05 | match |
| 04-5-4 | Pivot dia (both) | 0.82 -0.02 (0.80..0.82); sure | cones: 0.825 at shoulder, 0.7922 outward: 0.825 | +0.005 | mismatch |
| 04-5-5 | Hub dia of the wheel | 7; unsure (arrow ends unclear) | measure/intermediateWheel.json cylinders[2].d 7.45: 7.45 | +0.45 | can't tell |
| 04-5-6 | Riveting projection past the wheel | 0.2; unsure | seat z 19.2..20.45 vs wheel thickness 0.95: 0.30 | +0.1 (0.2..0.4 within the printed thickness and seat tolerances) | match |
| 04-5-7 | Pivot taper Kegel | figure illegible; unsure | cones half_angle 0.3 deg: - | - | can't tell |

**Extras.**
- None.

**After the verdicts.** Not done: the recipe code was not consulted (the verifier decides disagreements; no explanation of the mismatches is claimed).


## Sheet 05 05_6 Zwischenrad 05 05 02-1 (intermediate wheel)

**Title block as read.** Title block: Zwischenrad; Zeichnung Nr 05 05 02-1; scale 5:1 (M 1:1 inset); Werkstoff Messingblech 1,2 DIN 1751 Ms 58 federhart; 'nicht eingetr. Toleranz +-0,01'; gez. 20.8.40, gepr. 18.12.40, N.gepr. 20.4.43. Radstaerke 1,0 -0,1.

**Views and step-2 findings.** Plan only: five arms at 72 deg, rim, hub, bore, teeth drawn on the top 72 deg. Data: Zykloidenverzahnung z 80, D 23.33, d 22.453, dg 21.57, t 0.882, l 0.40, M 0.280. Step 2: d = z*M = 22.4 and t = pi*M = 0.880 agree.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 04-6-1 | Tooth count | z 80; sure | teeth[0].count 80: 80 | 0 | match |
| 04-6-2 | Tip circle D | 23.33; sure | teeth[0].tips_d 23.3293: 23.329 | 0.000 | match |
| 04-6-3 | Root circle dg | 21.57; sure | teeth[0].roots_d 21.5694: 21.569 | 0.000 | match |
| 04-6-4 | Tooth depth (D-dg)/2 | 0.88 derived; sure | teeth[0].depth 0.8799: 0.880 | 0 | match |
| 04-6-5 | Tooth flank form, t 0.882, l 0.40, M 0.280 (cycloidal) | cycloidal; likely | flank polylines only: - | - | can't tell |
| 04-6-6 | Blank outer dia | 24 -0.2; sure | finished tips 23.329 outermost: - | - | can't tell |
| 04-6-7 | Inner rim dia | 19.3 +0.2 (19.3..19.5); sure | cylinders[0].d 19.4 inside, arc 324.5 deg: 19.4 | +0.1 | match |
| 04-6-8 | Hub outer dia | 7.5 -0.1 (7.4..7.5); likely | cylinders[2].d 7.45 outside: 7.45 | -0.05 | match |
| 04-6-9 | Bore | 4 H7 (+0.012); sure | cylinders[1].d 4.0: 4.0 | 0 (at the lower limit) | match |
| 04-6-10 | Arm width | 1.3 -0.2 (1.1..1.3); sure | arc end points: arm 1.2 wide, parallel sides: 1.2 | -0.1 | match |
| 04-6-11 | Arm count and spacing | 5 at 72 deg; sure | five arms at 72 deg: 5 at 72 | 0 | match |
| 04-6-12 | Wheel thickness | 1.0 -0.1 (0.9..1.0); sure | z 0..0.95: 0.95 | -0.05 | match |

**Extras.**
- None.

**After the verdicts.** Not done: the recipe code was not consulted (the verifier decides disagreements; no explanation of the mismatches is claimed).


## Sheet 05 05_7 Zwischentrieb 05 05 02-2 (intermediate pinion and arbor), rev. 6.6.46

**Title block as read.** Title block: Zwischentrieb; Zeichnung Nr 05 05 02-2; scale 5:1; Werkstoff Praez. Rundstahl 5,2 DIN 175; no general tolerance legible; gez. 6.6.46 Moeller, gepr. 12.6.46.

**Views and step-2 findings.** One side view, collar end at the top. 2 dia -0.1 body and collar, 0.85 -0.05 pivots both ends, 4.0 n6 seat (+0.016/+0.008) 1.3 -0.1 long, leaf block (stock 5.2 dia, uncut) with 4.6 -0.2 to the seat's top, 19.25 -0.1 and 23.05 -0.1 from the lower shoulder, pivots 4.6 -0.2 each, 30 deg chamfer. Step 2: the 4.6 -0.2 beside the leaf spans leaf plus seat (arrow to the seat top; 3.3 + 1.3). The pivots' 4.6 disagree with sheet 5's 3.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 04-7-1 | Body dia | 2 -0.1 (1.9..2.0); sure | cylinders[1].d 1.95: 1.95 | -0.05 | match |
| 04-7-2 | Collar dia above seat | 2 -0.1; likely | cylinders[2].d 1.95, z 20.45..22.9: 1.95 | -0.05 | match |
| 04-7-3 | Seat dia | 4.0 n6 (+0.008..+0.016); sure | cylinders[0].d 4.0: 4.0 | -0.008..-0.016 | mismatch |
| 04-7-4 | Seat length | 1.3 -0.1 (1.2..1.3); sure | z 19.2..20.45: 1.25 | -0.05 | match |
| 04-7-5 | Leaf plus seat | 4.6 -0.2 (4.4..4.6); likely (arrow spans leaf and seat) | z 15.95..20.45: 4.5 | -0.1 | match |
| 04-7-6 | Shoulder to leaf top | 19.25 -0.1 (19.15..19.25); sure | z_levels 19.2: 19.2 | -0.05 | match |
| 04-7-7 | Lower shoulder to collar top | 23.05 -0.1 (22.95..23.05); sure | z_levels 23.0: 23.0 | -0.05 | match |
| 04-7-8 | Pivot dia (both) | 0.85 -0.05 (0.80..0.85); sure | cones: 0.825 at root: 0.825 | -0.025 | match |
| 04-7-9 | Upper pivot length | 4.6 -0.2; likely (scaled 4.5) | box z max 25.95 - 23.0: 2.95 | -1.65 | mismatch |
| 04-7-10 | Lower pivot length | 4.6 -0.2; sure (scaled 4.3) | box z min -2.95: 2.95 | -1.65 | mismatch |
| 04-7-11 | Shoulder chamfer | 30 deg; likely | cones[7] half_angle 60 = 30 deg to the face: 30.0 | 0 | match |
| 04-7-12 | Pinion leaf outside (uncut blank on the sheet) | stock 5.2 (scaled 5.3); likely; tip not printed | teeth[0].tips_d 4.7188; roots 2.8627: 4.719 | -0.5 | can't tell |
| 04-7-13 | Pinion leaf count | not printed; unsure | teeth[0].count 12: 12 | - | can't tell |

**Extras.**
- Built pivots end in domed cone chains (d 0.205 at the tip); the sheet draws pointed cones.

**After the verdicts.** Not done: the recipe code was not consulted (the verifier decides disagreements; no explanation of the mismatches is claimed).


## Summary

Counts: match 59, mismatch 13, can't tell 14; total 86.

**Mismatches** (no item is "not built"):

- 04-1-3 Oberplatte inner face to top face of Minutenrad (centre wheel): drawn 17, built 17.26, delta +0.26
- 04-1-7 Oberplatte thickness: drawn 3.0, built 3.35, delta +0.35
- 04-1-8 Unterplatte thickness (label 3.0 beside a second dim 4; unclear): drawn 3.0, built 3.35, delta +0.35
- 04-1-9 Zwischenbruecke thickness: drawn 4, built 3.8, delta -0.2
- 04-2-5 Lower pivot dia: drawn 0.8 -0.02 (0.78..0.80), built 0.81 at shoulder, delta +0.01
- 04-4-1 Upper pivot length, tip to collar top: drawn 9.2, built 7.2, delta -2.0
- 04-4-10 Seat under the leaves, dia: drawn 2.6 n6 (+0.013/+0.006), built 2.6, delta -0.006..-0.013
- 04-4-15 Lower pivot length: drawn 4.5, built 3.0, delta -1.5
- 04-4-18 Upper tip form (pointed cone about 0.5 long, scaled): drawn pointed cone, built flat 0.47, delta -
- 04-5-4 Pivot dia (both): drawn 0.82 -0.02 (0.80..0.82), built 0.825, delta +0.005
- 04-7-3 Seat dia: drawn 4.0 n6 (+0.008..+0.016), built 4.0, delta -0.008..-0.016
- 04-7-9 Upper pivot length: drawn 4.6 -0.2, built 2.95, delta -1.65
- 04-7-10 Lower pivot length: drawn 4.6 -0.2, built 2.95, delta -1.65

**Could not read / can't tell:**

- 04-1-13 Seconds pivot standing proud of the Zifferblatt face
- 04-1-14 Centre arbor end below the Unterplatte: 3.1, 10.9, 12.9, 2 (diagonal dims)
- 04-1-15 Detail circle dia 5.5 at the Sekundenrad bush in the Oberplatte
- 04-2-8 Hub dia of the wheel (arrows each side of the wheel)
- 04-3-5 Tooth flank form, pitch t 0.827, l 0.38, M 0.263 (cycloidal)
- 04-3-6 Blank outer dia
- 04-4-8 Pinion leaf outside (uncut blank on the sheet)
- 04-4-9 Pinion leaf count
- 04-5-5 Hub dia of the wheel
- 04-5-7 Pivot taper Kegel
- 04-6-5 Tooth flank form, t 0.882, l 0.40, M 0.280 (cycloidal)
- 04-6-6 Blank outer dia
- 04-7-12 Pinion leaf outside (uncut blank on the sheet)
- 04-7-13 Pinion leaf count

**Cross-sheet finding.** The part sheets 05 05_4 and 05 05_7 (rev. 6.6.46) give pivots 9.2/4.5 and 4.6/4.6; the assembly sheets 05 05_2 and 05 05_5 and the built arbors give 7.2/3 and 3/3. The built part follows the assembly. The centre distances 18.12 and 12.63 and layout heights 19.2, 13.8, 19, 7 are met; the 17, the plate thicknesses (layout 3.0) and the bridge (4) are not. Tiny tolerance misses (n6 seats built at nominal, 0.825 pivots against 0.82 -0.02) are listed as mismatches of 0.005-0.016 mm.
