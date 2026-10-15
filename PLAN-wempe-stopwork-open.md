# Handover: the Wempe's stop work, what stays open

For a session closing the last open readings of the Wempe's fusee stop work. Written 15 October 2026, after 2.41.02 (the stop work as drawn) and 2.42.01 (full wind at the stop). Read CLAUDE.md first; then `marine-chronometer-source/wempe/README.md` ("How the fusee and barrel were measured", **The stop work**; "Estimated, not from the drawings"; "Unresolved"), and RESOLVED.md's two entries on the Wempe's stop bar.

## What is settled (don't redo it)

- **The sheets are seen from the fusee's small end.** 05 06_4 (views A-B and C-D) and 05 06 04-2's Schnitt C-D (`References/wempe/drawings/05-06/Wempe_05-06_04.jpg`, `Wempe_05-06_02-2.jpg`) are mirror images of the model's shape frame (seen from +y, the dial side). fusee.js mirrors them. Unmirrored, the bar met the stop pin with the wrong side.
- **The slot** (05 06 04-2): 2 H8, its near edge 4 from the axis, 1.5 deep along the bar's lower part, 1.1 toward its upper end. Cut in the body: the lathe stops at the slot's floor and the last 1.5 is built by `radialSolid` on the lathe's own radius field.
- **The bar** (05 06 03-1): its outline traced on C-D (`SB`, `SBO` in fusee.js), 1.45 thick, thinned to 1.05 from u 3.4. It lies on the cover plate, because dial up the small end faces down.
- **Its turn** is the chain's pin A's. 02-2 dimensions the slot from the line through A ("4", "2 H8", no angle), so the slot runs along it.
- **Full wind is where the stop holds the fusee**: the stop pin (hole 7) 0.02 off the bar's far side. That is 8.638 turns of chain (`fu.MW`; `escphys.js` `MF`, and the page warns if they part), 0.112 turn short of the groove's end N. From there it is 8.70 turns and 55.9 h to run down.
- **The spring** (Stegfeder 05 06 03-3): its two drawn shapes traced on C-D; the model draws it between them as the bar slides. 0.10 thick, worked from its bending: half a hardened spring steel's yield, 0.06-0.16 N on the bar.
- **The slide** comes from the chain's (or band's) contact, `barTravel`, 0.02 off.
- **Checks:** fine.py (chain and band), solids, both audits (current and `--rev first`), bom, smoke and the full ci.py all pass.

## What stays open, and how I'd close each

### 1. Where the groove ends (N) against the slot: 0.07 turn, 0.08 mm along the axis

- **Known.** 02-2 draws N 55° round from the bar's upper end, on the bar's side. The model's groove ends 80° round (`M_FULL` 8.75 at the 1.15 pitch, its start fixed by the chain's pin at `PINA`).
- **Why it hardly matters.** N's angle isn't dimensioned, and the chain stops 0.112 turn before N, so nothing works there. Only the empty last tenth of the groove would change.
- **How to close it: a photograph.** In `References/wempe/photos/dg-chrono-dec/8_Wempe_3955_Räderwerk_plus.jpg` (copy it to a path without the umlaut first), the fusee's small end shows the cover plate (Ø 21.05, known), both of the bar's ends standing out past its rim (which gives the slot's line), and the top turns of the groove.
  1. Fit the cover plate's rim as a circle of known radius, as `tools/rimfit.py` does for a plate on the mat. Write a spec for it; `fcal.py` gives the focal length the frame allows.
  2. Unproject the bar's two ends and the point where the top land runs out into the hub (N).
  3. Read N's angle from the bar's direction, mirrored into the model's frame, and say how sure it is: the frame is about 8 px/mm, and the groove's end is a soft step in a gilt cone.
  4. If it differs from 80° by more than the reading's spread, move the groove's end, not its pitch. The cleanest change is the groove's angular start (`PHI0` against `PINA`), which moves N without moving the lands.
  5. Re-run the stop sweep (below), fine.py with chain and band, solids, both audits, and `tools/wempe_mainspring.py --check`. The force test 05 06_20 is indexed by the groove's turns.
- **Also look at:** the 6MX photographs in `photos/dg-chrono-6mx/`, and any video in `References/wempe/VIDEOS.md` that shows a fusee off its plates. A side view gives N's axial place too (02-2: 0.3 from the small end).

### 2. The stop pin's length (05 08 01-5, no sheet)

- **Known.** The model has 1.5 below the top plate's inner face (`cylBetween(P.topPlate,…,TI+1.5,…)` in fusee.js). Mechanics bound it: at least 1.24, to bear on the bar's whole thin end, and at most about 6, short of the chain on the fusee's fourth turn.
- **How to close it: the coloured overall section.** `References/wempe/drawings/Wempe_Einheitschronometer.jpg` (2048 px) labels "Anschlagstift 05 05 01-5" (#14 in `transcriptions/05-01-51-00-case-box-overview.md`, at px 475,428). Its leader runs into the section to the right of the barrel.
  1. Follow the leader at 4× zoom. If the section plane cuts the pin, measure its protrusion against the top plate's drawn thickness (3.35, `WD.TOP_T`) in the same crop. The section isn't strictly to scale, so scale from the nearest dimensioned part.
  2. If it isn't drawn, the pin stays an estimate inside the bound. Write the bound into the README's Estimated entry and stop.
- **Also look at:** `05-08/Wempe_05-08_02.jpg`'s Schnitt A-B, whose stepped section line passes hole 7. I couldn't read a pin in it at 4×; a better attempt is to fit the plate's drawn thickness and look for the short stub on its inner side.

### 3. The spring's height, 1.0 (and its thickness, 0.10, a design value)

- **Known.** No sheet. The recess is 1.6 deep. The spring's end goes into a hole across the bar about Ø 0.5 (C-D's dashed hole), so the tab at its end is narrower than its body. The push on the bar scales with the height; the stress doesn't.
- **How to close it.**
  1. Measure the height in the coloured section. At the fusee's small end (crop about px 680-880 × 320-420, 5×) the section shows the cover plate, the bar (dark blue) and a white rectangle with a pin inside the bar's left portion: possibly the spring or its pin seen in section. Scale from the cover plate's 0.8 and the bar's 1.45 in the same crop.
  2. Keep the thickness as worked, unless the section shows it (it won't at this scale).
  3. If the height changes, re-run `springmech`-style numbers. The method and the figures are in fusee.js's comment at `SPW`; the push is linear in the height.
  4. Then run fine.py, solids, both audits and bom.
- **It can't be closed further.** No physical chronometer exists (CLAUDE.md). What only a made spring would settle stays an estimate, and says so.

### 4. The bounded estimates: the bar's thinning at u 3.4, the slot's step at u 8.0

- **Known.** Both are inside their mechanical bounds. The thick part must stay inside the top land's floor (r 9.3) at full travel, so the thinning starts at u ≤ 3.5. The step must lie between the thick part's reach (7.0) and where the rib would be cut (8.4). The step was read at 8.0 on 02-2's hidden arc r 9.45 (likely ±0.3). The coloured section draws the bar's protruding end about two thirds as thick.
- **How to close it.** The coloured section, at the bar's protruding end (the small blue square left of the fusee in the crop above). Measure the thin end's thickness against the bar's middle; the model has 1.05/1.45 = 0.72. Only change it if the reading is clearly outside that, and keep it within the bounds above.

## How to check a change here

- **The stop sweep.** Gap from the bar to the stop pin over the last 1.2 turns, every 0.005, with chain and band; travel onset; jams. It is not a tool in the repository yet. The method: `?snap&qa`, freeze `__mv.userData.update` (as `tools/isolate.py`'s `FREEZE`), then for each n call the saved update with `{n, winding:true}`. Measure the bar mesh (`userData.hn==='050603-1'`) against the pin (`'050801-5'`) by sampling along the triangles' edges, not only at the vertices: the pin bears mid-face. Read the travel from the stop work part's `userData.travel` and jams from `userData.jam`.
  - Expected now: travel starts 0.195 turn before full wind, 3.37 at full wind; the gap 0.021 at full wind and never under 0.69 before it; no jams.
  - Worth adding as `tools/wempe_stopwork.py` and a ci.py step, if you have time.
- **The geometry checks:** `fine.py --model wempe`, the same with `--eval "__mv.userData.R.fu.setConn('band')"`, `solids.py --model wempe`, `audit.py --model wempe` and `--rev first`, `bom.py --model wempe`.
- **The physics checks.** If anything moves full wind or the groove: the Wempe steps of ci.py. `wempe-essaydata`, `wempe-tolerances`, `wempe-bench` and `wempe-montecarlo` each say which `--write` to run. `HS` in `wempe/js/escapement.js` is what `wempe_hairspring.js` prints.
- **The comparison.** isolate.py beside C-D as printed (no mirror: the model seen from the small end matches the sheet) and beside the Wempe 3955 photograph, as CLAUDE.md asks.

## Gotchas

- **The bar's frame:** u along it from the axis's foot (lower end negative), v across. The bar is at v −6 to −4 (the shape's y; z = −v in the group). `gBar.children[0]` is the bar and the only child that slides; the spring and its pin are later children.
- **N and the groove:** `M_FULL` (8.75) is still the groove's end N and the helix's reference. Full wind is `CG.chain.RF0` (the stop's turn); don't conflate them.
- **The pin's leader number:** the coloured section's label for the stop pin reads 05 05 01-5, the transcription's "05 05 01-5 or 05 08 01-5". bom.json carries it as 05 08 01-5 (the top plate's group).
- **Other sessions are working on the Wempe.** A 3.00.00 release is being prepared (memory `wempe-release-3`; branch `claude/wempe-release3`, which stays out of the geometry files). Check `main` is clean and matches `origin/main` before merging. Merge main into your branch, rebuild the built copies rather than resolving them by hand, run ci.py, then `--no-ff`. Tell that session when you land.
