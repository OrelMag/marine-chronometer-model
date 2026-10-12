# Plan: verifying a chronometer built from the model

Handoff for the next session (written 12 October 2026). Read this, then `CLAUDE.md`, then the memory file `build-goal.md`.

## The goal (the user's, 12 October 2026)

The user wants a **real, working marine chronometer** made from the model, not historical parity with the Hamilton Model 21.
- **Manufacture:** CNC and 3D printing.
- **Accuracy:** good enough to navigate by, meaning a steady rate of a second or two a day. Navy test-card class isn't required.
- **Deviations:** allowed when they help, with 1950s–60s technology only. Tell the user about each one, and show it on the part's card with a way back to the original.
- **Questions:** check with the user when a decision is theirs.
- **Merging:** merge and push often. Deploy only when the user asks; every deploy is a release.

For the Model 21 itself, the source of truth is unchanged: the manual, photographs and videos. The build's changes live in a revertible layer (`deviations.js`), never overwriting the original.

## Where things stand

- **Branch:** `claude/build-verify`, worktree `.claude/worktrees/build-verify`. It is merged into `main` and both are pushed.
- **Live site:** **2.26.00**, which carries the deviations on the cards and the bench-test chapter.
- **Unreleased on `main`:** `benchcheck.py`, plus one new sentence in the build book's chapter. The next release should take them.
- **The report:** `marine-chronometer-source/chronometer-working-model/verification/build-verification/index.html`. Open the file; `build_report.py` rebuilds it, and its "Reproduce" section lists the steps.

### Tools added (all in `chronometer-working-model/tools/`, all listed in CLAUDE.md with run times)

| Tool | What it checks | Current result |
|---|---|---|
| `gearing.js` | The four train meshes tooth by tooth on `gearOutline`'s own outlines, with friction. The swing over time through `ampAt`/`rateAt`. Each mesh's depthing window, written to `gearing.json`. | Every mesh runs with no drop. The swing stays at 250–259°. **Holes ±13 µm**, aimed at the drawn centres. |
| `thermal.js` | Brass against steel from 40 to 100 °F: the depths, endshake, the escapement through `makeEsc`, the chain. | Depths change under 0.5 µm. Set endshake at 28–73 µm at 20 °C. Escapement rate change about 0.03 s a day. |
| `fea.py` | Voxel-brick finite elements (pyamg) on the six pivot-holding parts, joined by superposition. The solver is checked against a cantilever (`--check`). | Holes move at most 0.36 µm, depths at most 0.02 µm. Stress at most 13 MPa. |
| `hairspring-fe.js` | The designed hairspring solved by co-rotational beam elements, against `hairspring.js`'s elastica. | The couple's shape agrees to 4e-7. The spring's isochronism is 0.11 s a day. |
| `bench.js` | The 8 bench tests with their pass figures. Writes `bench.json` (`tests`, `lines`, `criteria`); `makers.py` puts them on the cards and in the build book. | — |
| `benchcheck.py` | Judges the maker's measurements (JSON) against `criteria`, and says what to do where one fails. | `--demo` finds 8 of 8 planted faults. |
| `rating.py` | A made chronometer's log of daily comparisons: the Navy test's figures, a fit, a backtest, and an error projected over 10, 30 and 60 days. | `--demo` recovers the made-up log's parameters. |
| `deviations.js` | The build's changes and their numbers, written to `deviations.json`; `makers.py` and `maker.js` put them on the cards. | Nivaflex mainspring 0.386 mm, margin 1.30. Glucydur balance with a Nivarox spring: thermoelastic coefficient +4 to +14 ppm/°C, within ±1.4. |
| `acoustic.py` | Now also accepts a recording's file path, for the made movement's swing. | — |

**How a deviation works in the page:**
- `MAKERS.devs` holds the list; each affected line in `makers.js` carries `dev`, `vmat` and `vtreat`.
- In `maker.js`, `ORIG`, `devOn` and `devHTML` drive the card's note and button.
- `MAKER.orig()` and `setOrig()` read and set the choice; `app.js` keeps it in the link as `orig=`.
- The cards default to the build's version. The 3D model is unchanged.

## What to do next, in order

1. **Ask the user what test equipment they have** (torque gauge, vibrating tool, microscope, timegrapher, temperature box). Then make the 3D-printable jigs the bench tests call for, each from the model's own dimensions:
   - a torque lever for the barrel arbor's square and the fusee arbor;
   - a holder for the barrel;
   - a degree card for reading the escapement's angles;
   - a stand for vibrating the balance.

   Measure the squares and seats on the model (`holes.py`, `isolate.py`) before drawing anything; CLAUDE.md requires every size to be measured first. Write STL with the existing STL writer (`MAKER.stl`, or a small Python tool), and add each jig to the build book's tests chapter.
2. **Redo the "as made" Monte Carlo with CNC tolerances.** `errorbudget.js` section 1 uses a careful hand's tolerances. Add a CNC set: hole positions ±13 µm (`gearing.json`), turned diameters about ±5 µm, the adjusted escapement settings left as they are. Report how many escapements run and how many fall in the band before adjustment. Ask the user what their machine actually holds.
3. **Carry the deviations into the physics tools.** `strength.js` and `tolerances.js` still judge the steel mainspring. Add the Nivaflex variant's line (E 220 GPa, strip 0.386 mm, strength over 3000 N/mm²), reading `deviations.json` rather than repeating its numbers. `physics.js` A5 should report the Glucydur/Nivarox requirement beside the Model 21's.
4. **Open checks the analysis hasn't done yet:**
   - **The box and gimbals under ship motion:** a modal analysis, and whether a gimbal resonance falls near the balance's 2 Hz.
   - **The arbors' own bending:** `fea.py` treats arbors as rigid. The fusee arbor carries up to 59 N; take its profile from `movement.js` and treat it as a beam.
   - **Tooth wear over years:** Archard wear on the fusee/centre mesh, which carries the highest load (strength.js says 187 MPa).
5. **When the user brings measurements:**
   - Run `benchcheck.py` on them and `rating.py` on their log, and `acoustic.py PATH` on a recording of the made movement.
   - Feed measured values back in: the build's parts become the build's source of truth. Each measured value replaces its estimate in `deviations.js` or `bench.js`, gets a note in the README's "Estimated, not from the manual", and the report is rebuilt.
6. **Release** `benchcheck.py` and whatever follows, when the user asks to deploy. Use `python build.py --release patch|minor -m "…" --site-url https://www.marinechronometermodel.com`, commit, merge, then `python deploy.py` from `main` and `git push origin main --follow-tags`. Suggest the release kind and lines; the user decides.

## Simulation and nonlinear mechanics: what's next

The existing tools rule out the obvious failures. What's left are the nonlinear, at-sea effects that decide whether a detent chronometer keeps a steady rate. In order of value:

1. **The escapement under shock, with a flexible detent.** Done (12 October 2026): `tools/tripping.js`, the report's section 8. See "Tripping" below.
2. **The box and gimbals in a seaway.** Done (12 October 2026): `tools/massprops.py` weighs the case and ring on the model (`gimbals.json`), `tools/gimbals.js` runs them in a seaway; the report's section 9. Levelled, the case swings in 0.72 s (the ring 0.68), far from a ship's roll and clear of the beat; in working seas (to NORDFORSK's 0.12 g) it stays within 0.3° of the apparent vertical and the rate moves 0.005 s a day; beyond, it meets its stops, about 0.15 ms a blow. The drawn pivots aren't levelled (the case would hang 35° out): a made one must be levelled by its brackets and straps (manual p. 13).
3. **The mainspring's coil friction.** Done (12 October 2026): `tools/mainspring_friction.py`, the report's section 10. The coils take 3.4 % running (6.8 % hysteresis) over the fusee's turns; physics.js takes the spring's losses from it up to what mainsprings measure. The model's spring is fully wound 0.13 turn from coil-bound, where the friction climbs: the fusee's output at full wind is 78.5 % running and the swing falls under the band for the first hours; the set-up can't mend it, the spring needs half a turn of room (bench.js counts it). Next, re-solve mainspring.py for the build's Nivaflex 0.386 strip to see its room. Lesson: in packed coils, contact forces from the energy solver's multipliers or from differentiated rod equations are unreliable; the ring equations work.
4. **Rate during temperature changes.** The thin hairspring warms faster than the balance rim, so even a well-compensated pair runs off-rate while the temperature is changing. Heat flow through box, movement, balance and spring over a ship's day-night cycle: the error a navigator actually carries, and how well the Glucydur/Nivarox pair copes.
5. **Which estimates matter most.** Push every estimate (tooth form, friction, the springs' sections, materials, and now the detent's damping and the contacts' restitution) through the time-domain escapement and a voyage, ranked by their effect on the rate: which bench measurements to make first.

Lower priority: the fusee chain's link-by-link pull ripple, oil friction that changes with speed and temperature, and the hairspring as a full 3D helix with its own mass. Each is a small effect on the rate.

### Tripping (`tools/tripping.js`), what it found

- The detent as a plane frame from the drawn pieces (37 beam elements; mass and inertia within 1 % of dynamics.js's). Made rigid and hinged at Ft, with the draw as a steady moment, it runs as dynamics.js does (swing 0.4°, rate 0.1 s a day, release, fall and landing within 0.1°) and is step-converged.
- As drawn, the spring bends about its middle: the detent is 39 % stiffer at the stone than dynamics.js's hinge (first mode 137 Hz, not 112). Small effect on swing and rate.
- **The margin is the depth of lock, not makeEsc's `lRel`.** makeEsc's recoil peaks where the tooth's tip reaches the flat's inner end (77 % of `lRel`); past it the tip rides the stone's rounded edge and its pressure pushes the stone *out*; the tip is free at 82 %. `lRel` keeps room to spare. An early version that held the tooth to `lRel` left the stone hovering on the edge and "tripped" with a blade half as stiff; that was the convention, not physics.
- makeEsc's recoil table steps with the stone's sampled outline; differentiate it as a secant over 1 % of `lRel`, never point by point (the staircase made the wheel chatter and cost a spurious 1.1° of swing).
- Contact dampers must be sized on the mass each contact meets locally (1/|r|² over the kept modes); sized on the whole detent's they made RK4 unstable on the light arm and trip spring. The stone's friction is smoothed below 1 mm/s for the same reason.
- Results at the model's settings, the estimates varied, the swing pushed and the knocks: the report's section 8 (`assets/trip.json`).
- On the bench (12 October 2026, `tripping.js --write` → `tripping.json` → `bench.js`): the lock's floor is the manual's 5° (the stone's chatter while held is 20-50 µm whatever the depth); the detent's ring, its foot clamped (137 Hz as drawn, 137-342 Hz for its spring 0.079-0.150 mm), measures the detent spring's section, the open question; `benchcheck.py --ring FILE` reads a recording. Against knocks the preload holds, not the lock. dynamics.js counts a second unlocking in a swing as a trip.
- The largest lift is a maximum of chaotic chatter (two runs a hair apart differ by ten points): treat it as a margin. The rest solve's Newton can diverge where a contact switches inside its difference step; it now falls back to letting the detent settle.

## Estimates the report flags (replace them when sources or measurements arrive)

- Tooth form: BS 978 Part 2. Tooth friction 0.10–0.20. Pivot shake 10 µm.
- Brass E 97–110 GPa. Expansion: brass 18.7–20.9, steel 10.8–12.5 ×10⁻⁶/°C.
- Glucydur figures taken as CuBe2's (C17200). Nivarox expansion 7–10 ×10⁻⁶/°C and modulus 165–195 GPa assumed.
- Nivaflex's 3000 N/mm² is the aged figure its maker says can be reached.
- The mainspring's thickness, and the detent and trip springs' sections, are still open (OPEN-QUESTIONS.md 1–2).
- In `benchcheck.py`, the bands around the manual's "about" figures are estimates (bench.js's comment says so).

## How to work (lessons from this session)

- **Worktree:** reuse `claude/build-verify`. Before merging, run `git merge main` into it, then run `python ci.py` (about 7 min; `--full` after a geometry change). Merge only when it passes, always with `git merge --no-ff`, then push both branches. Check that the main checkout is clean and in step with origin before merging (other sessions release there too).
- **Rebuilding:** use `python build.py --site-url https://www.marinechronometermodel.com`; a bare build drops robots.txt and the sitemap. After changing a tool the report uses, run `node reportdata.js`, then `fea.py --reuse --json` / `rating.py --demo --json` as needed, then `python build_report.py`. After changing a figure the cards use: `node bench.js --write` / `node deviations.js --write` / `node gearing.js --write`, then `python makers.py`, then the build.
- **Editing files from the shell:** heredocs in this Bash tool collapse `\\` to `\`, which broke several Python edit scripts. Write edit scripts with the Write tool into the scratchpad, then run them. In sed, avoid writing `\n` inside JS strings.
- **Watch for shadowed names in long functions:** in `fea.py`'s `main()`, a loop variable `a` hid `sys.argv`, so `--json` silently did nothing. Read options from `sys.argv` directly.
- **Gear contact normals:** smoothing them made the results worse. The ±0.003 zigzag in the torque ratio is the outline's sampling, documented in `gearing.js`. Don't "fix" it without checking that the frictionless mean ratio stays at 1.000.
- **gmsh can't mesh the page's solids:** their surfaces have self-overlapping facets, which is why `fea.py` uses voxels. pyamg, scikit-fem, gmsh, meshio and pypdf are installed.
- **Charts:** follow the dataviz skill. The report uses the validated palette (blue, orange, aqua, yellow). Aqua and yellow are below 3:1 contrast on the light surface, so every chart has direct labels and a table. Render the page and look at it before committing.
- **Sources:** never write a material figure or a manual criterion from memory. The Navy test's limits are in `app.js` `testCalc`; materials come from data sheets, cited in `deviations.js` and the report's sources.
