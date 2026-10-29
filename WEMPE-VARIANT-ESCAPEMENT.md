# The Wempe's non-sheet versions: the detent, its block and what their heights touch

Checked 29 October 2026, geometry only (the owner's scope). The three versions built from photographs rather than the drawing sheets:
- **3955**: Wempe No. 3955 as photographed.
- **6mx**: the Soviet 6MX, Kirov No. 247.
- **1943**: the escapement of 1943, as Kirow DEC 422, DEC 479 and Lange 5177 are made.

What was checked in each: the detent, the detent block (with its holes, pins, fixing and banking screw), the escape wheel, collet and pinion, the rollers and balance heights, both balance cocks, and the top plate's holes under the block.

What the physics leaves open for these versions is in `WEMPE-VARIANT-PHYSICS-GAPS.md`.

## How

1. **Clash checks in each version**, each run with `--eval "__mv.userData.setRev(v)"` or `--rev v`. On main (3.56.00) all were clean:
   - `fine.py`: 68 states, nothing new or grown.
   - `exploded.py`: 0 failing.
   - `audit.py`: nothing new.
   - `seatcheck.py`: 310 pieces, 0 failing.
   - `overlaps.py`: every escapement part counted itself the same as in the drawn versions. The 6MX's top plate first read 1.53 mm³ against 0.37 elsewhere, but at a finer grid the two agree (1.85 against 2.06): sampling, not the 6MX.
   - `holecheck.py`: all five states, no failure.
   - Closed solids in every version: none open.
2. **The photographs, one version at a time, read blind.** Each feature was measured on the photographs before the model's figures were read, then compared. Three agents did the first reading, one per version. Every claim that led to a change, or that contradicted a reading the code called sure, was then re-read here on the photograph. Two claims fell:
   - the 3955 collet's length;
   - the 1943 stud being the 6MX's place (the first unprojection used a hand seed).
3. **Cameras.** New `photocompare.py` cameras, in `tools/photocompare/`:

   | Camera | Photograph | rms |
   |---|---|---|
   | `d422_A` | Kirow DEC 422, plan | 0.9 px |
   | `d479_A` | Kirow DEC 479, plan | 0.8 px |
   | `l5177_A` | Lange 5177, plan | 0.2 px |
   | `d479_feder` | Kirow DEC 479, detent view | 2.9 px |
   | `d422_feder` | Kirow DEC 422, detent view | 4.7 px |
   | `l5177_feder` | Lange 5177, detent view | 5.2 px; loose, no heights taken from it |
   | `m6_detent_v2` | Kirov 247, detent view | 14.4 px; weak, local readings only |
   | `w3955_detentBlock_v2` | Wempe 3955, block | 3.4 px; the old spec's far pin was mispicked by 15 px |

## The escapement of 1943

| Part | Finding | Source | Sureness | Action |
|---|---|---|---|---|
| Block fixing | Not the drawn screw through hole 13. A slotted steel stud beside it, as on the 6MX, with hole 13 drilled and open. The stud's Ø 3.5 meets hole 13's rim. The stud is at (-34.13, 18.88), 0.4 from the 6MX's. | the three plans through their cameras; sub-pixel on the stud's rim, the three within 0.3 | sure | built: `WESC.HOLES.block43`; the 1943 top plate drilled for it; the block bored for the stud and pins, with no hole under 13 |
| Steady pins | Near pin (-29.81, 21.82), the 6MX's within 0.35 (read 0.24 inside the end face, so the 6MX's 0.55 taken). Far pin (-38.26, 15.41), 1.9 across from the 6MX's, so 10.6 apart. | same | sure | built |
| Kirov 247's plate | Plain where hole 13 and the German far pin would be. | `k247_A` camera | sure | the 6MX unchanged |
| Escape collet | One straight cone, Ø 3.0 at the wheel to 1.6 at its end, 5.0 long. The model had the first-drawn cone and pipe. | three Feder views at 20.5 px/mm; the outline through `d479_feder` | sure in form, ±0.3 | built |
| Banking head | Reads Ø 3.05 ±0.15 through the Feder cameras, against 3.4 from the upright's scale. Its height across matches; its right edge stands about 0.2 farther out. | `d479_feder`, `d422_feder` | possible | not changed; README |
| Block lower face | Reads about 6.0 under the plate, against 6.5. | same | likely, but conflicts with the Unresolved detent level | not changed; README |
| Blued screw in the upright's end | On DEC 479 only. | `8_Kirow_DEC_479_Feder.jpg` | likely (one movement) | not built |
| Matched | The wheel 0.2-0.5 under the plate; the collet's foot; the detent's foot, spring and horn within 0.1-0.3; the gold spring and blade in plan; the upper cock and plate screws within 0.01-0.24. | | | |

## The Soviet 6MX

| Part | Finding | Source | Sureness | Action |
|---|---|---|---|---|
| Upright | Slit along the banking screw, parallel to the plate, about 0.1 wide, 2.85-2.9 deep from the end (247) and 2.8 (24020), the thread showing in it. The model had no slit, from the loose block's plate-side face, where such a slit can't show. | `8_Kirow_247_F.jpg` 18.3 px/mm; `9_KirPol_24020_Feder2.jpg` 26.6 | sure | built: 0.12 wide, into the hole |
| Banking head | Ø 3.45 ±0.1 (247) and 3.43 (24020) at the wheel's scale, against the model's 3.2. | same | likely | Ø 3.4 |
| Escape pinion | 3.77 long, from 11.15 to 14.92 under the wheel, its foot about 2.2 over the pillar plate. The model had 3.9 from 11.67, read at 17.65 px/mm from a 247 px tip span; the tips measure 257.5 px. | 247 | likely ±0.1 | built |
| Collet end | Ø 1.37-1.57 (247) and 1.58 (24020), against 1.70. | same | likely | Ø 1.55 |
| Matched | The base's 6.5; the stop screw's place and head (Ø 4.4 against 4.2); the collet's length and its diameter at the wheel; the wheel's rim. | | | |
| Open | The upright's height (3.45 ±0.3 against 3.0) and the screw's axis 0.4-0.6 under the upright's middle, each from one view (possible). The adjusting slide and stud, and the lower cock's plan and step: no photograph settles them (README, Unresolved). | | | |

## Wempe 3955

| Part | Finding | Source | Sureness | Action |
|---|---|---|---|---|
| Escape collet | The first reading gave 5.5-5.7 long; it took the wheel's underside at the far edge of its ellipse. With the axis at the ellipse's middle: 82 px at 16.8 px/mm, so 4.9, as built. Its length over its top Ø is 1.64; the model's is 1.66. | `10_Wempe_3955_Feder_plus.jpg` | likely | none (the claim refuted) |
| Foot screw's Ø 1.3 hole | Reads 2.3-2.5 from the base's edge, against the sheet's 2.8. The detent foot's screw is under it. | `11_`, the code's own reading 2.4-2.5 | likely | not built: it would leave the hole off its screw; README |
| Arm | Both edges stand about 0.7 farther out than the model's, with the camera fitted on the base alone. | `w3955_detentBlock_v2` | possible | README |
| Block lower edge | 0.4-0.9 over the model's. | `5_Wempe_3955_O.jpg` | possible | README |
| Pin holes | A bright ring about Ø 1.3 round both, on the plate's inner face. | `13_` | possible | README |
| Matched | The plate's holes 13, the pins' and the lower cock's (0.02-0.17); the block's base, arm, slit and banking screw; the arbor and pinion; the cock, balance and masses within 0.2-0.4. | | | |

## Checked after the changes

- **`fine.py`** with `--eval setRev(v)`: 0 new or grown in 6mx (68 states, 18 pairs), 1943 (17) and last (17).
- **`exploded.py`**: 0 failing in all three.
- **`audit.py --rev`**: nothing new in 6mx. In 1943, two new flush faces, both contacts:
  - the block's face on the plate, now seen through the open hole 13;
  - the far pin's end flush with the thin part's back face, as the drawn block's is.

  `--update` was run in 1943, 6mx and 3955; the last two only dropped the stale barrel bridge entry.
- **`holecheck.py`**: 1627 holes over five states, 0 failing. Hole 13 in the 1943 plate is expected empty (`HOLE_EXPECTED`, with the photographs).
- **`seatcheck.py`**: 508 pieces over five states, 0 failing.
- **`bom.py`**: 265 lines, 302 relations, 12 jewels, ok.
- **Closed solids**: every version, as loaded and in Moving parts only with a section on.
- **The Wempe's type check**: passes.
- **Before and after**: rendered through the fitted cameras, release 3.56.00 against this branch. The 1943 stud, pins, hole 13 and collet now lie on the photographs' outlines; the 6MX's slit and pinion are shown beside Kirov 247's.
