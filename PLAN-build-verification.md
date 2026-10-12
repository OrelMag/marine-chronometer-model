# Plan: verifying a chronometer built from the model

Handoff for the next session (updated 12 October 2026, after the tripping, gimbals and mainspring-friction work, and the Nivaflex spring's re-solve).

**Read first, in this order:** this file; `CLAUDE.md` (the repo's rules, every tool with its run time); the memory files `build-goal.md` and `results-in-html-report.md`; then, for whatever you touch, the tool's own header comment and the matching section of the report.

## The goal (the user's, 12 October 2026)

The model should describe a **real, working marine chronometer** that could be made from it, not only historical parity with the Hamilton Model 21. **The user has no physical chronometer and never will** (neither an original nor one built from the model; CLAUDE.md): never ask them for measurements or equipment; the build's tools are guidance for any maker, and what only a made chronometer could settle stays an estimate.
- **Manufacture:** CNC and 3D printing.
- **Accuracy:** good enough to navigate by: a steady rate of a second or two a day. Navy test-card class isn't required.
- **Deviations:** allowed when they help, with 1950s–60s technology only. Tell the user about each, and show it on the part's card with a way back to the original (`deviations.js`; the 3D model stays the Model 21).
- **Questions:** ask the user when a decision is theirs (a change to the model, a deviation, a release).
- **Merging:** merge into `main` and push often. **Deploy only when the user asks**; every deploy is a release.
- **Documentation:** every test's method and results go into the HTML report, not only the console (the user asked for this explicitly).

For the Model 21 itself the source of truth is unchanged: the manual, photographs and videos.

## Where things stand

- **Branch:** `claude/build-verify`, worktree `.claude/worktrees/build-verify`. Merged into `main` (last merge `25943b8`), both pushed. Start by `git merge --ff-only main` in the worktree.
- **Live site:** 2.26.00. **Unreleased on `main`:** `benchcheck.py`; the bench tests' new figures (the detent's ring, the lock's floor, the mainspring's friction and room to coil-bound), which change `js/makers.js` and so the site's build book and cards; `?qa` now exposes `__M` and `__BX`. A **minor** release is due when the user asks (suggest lines; the user decides).
- **The report:** `marine-chronometer-source/chronometer-working-model/verification/build-verification/index.html`, built by `build_report.py` from `template.html` and `assets/*.json`. Sections 1–7 earlier work, **8 tripping, 9 gimbals at sea, 10 mainspring coil friction**. Its "Reproduce" section lists every step.
- **CI:** `python ci.py` passes 28 of 28 (about 8 min). `smoke.py` once failed under load in its winding step and passed alone: rerun it alone before believing a smoke failure.

## Done in this round, and what each found

| Tool (in `tools/`) | What it does | Finding |
|---|---|---|
| `tripping.js` (+ `tripping.json` via `--write`) | The detent as a 37-element plane frame from the drawn pieces, its modes in time with the balance and wheel, every contact elastic. Validated against `dynamics.js` with the frame rigid and hinged. | No trip at the model's settings: a held tooth's stone uses at most ~11 % (22 % worst estimate) of the 114 µm depth of lock. Trips from a 337° swing (the jewel comes round) or a 61 g / 3 ms blow. **The real margin is the depth of lock** (makeEsc's `lRel` keeps room to spare). The flexure turns about its middle: 39 % stiffer than the hinge. |
| bench additions | `bench.js` test "The detent rings"; the lock's floor in the escapement test; `benchcheck.py --ring FILE` reads a recording's pitch. | Never a lock under 5°. The ring (137 Hz as drawn; 137–342 Hz for a 0.079–0.150 mm spring) measures the detent spring's section, an open question. Against knocks the preload (Op. 78) holds, not the lock. |
| `dynamics.js` fix | A second unlocking in one swing now counts as a trip (it was booked as a beat). `RESOLVED.md`, Escapement. | — |
| `massprops.py` + `massprops-check.js` (→ `gimbals.json`) | Weighs the case with the movement and the gimbal ring on the model (every solid at its density), and how far each swings before it meets the box. | Case 1,669 g, ring 140 g; stops at 29.5° as drawn. **The drawn pivots aren't levelled** (the case would hang 35° out); the manual levels them by the brackets and straps (p. 13). |
| `gimbals.js` | The ring and case as two coupled rigid bodies on their pivots, driven by a ship's random roll, pitch, yaw and heave; what reaches the escapement run through `dynamics.js`. | Levelled periods 0.72 s / 0.68 s (the page's 0.7 s holds), far from ships' 10–30 s roll and 35 % clear of the 0.5 s beat. In working seas (to NORDFORSK's 0.12 g) the case stays within 0.3° of the apparent vertical, the rate moves 0.005 s a day. Beyond, it meets its stops: ~0.15 ms a blow, harmless to the escapement. |
| `mainspring.py --nivaflex`, `--bound`; `mainspring_friction.py --nivaflex` (→ `mainspring_t0.386.js`, `mainspring_bound.json`, `mainspring_friction_t0.386.json`) | The build's 0.386 mm Nivaflex strip solved over the wind beside the model's (same free curve), set up by the page's fusee rule (checked to reproduce the page's full wind); both strips' coil-bound found to 0.05 turn; both swings over the wind (`reportdata.js`, report section 10, Figure 16). | **The model's room was 0.33 turn, not 0.13** (the quarter-turn table's grid; RESOLVED.md). Nivaflex: fully wound 18.76, coil-bound past 19.35, **0.59 turn of room**; coils take 2.0 % running (model 3.4 %); fully wound the fusee gets 90.5 % (model 78.5 %); the swing starts at 241° and is in the band within ~0.8 h (model 225°, ~5.6 h). The build's strip mends the room problem. |
| `mainspring_friction.py` (→ `mainspring_friction.json`) | The coils' friction from the solved spring states: slip followed on the steel, packed coils' pressure by the ring equations of a packed spiral. | Coils take 3.4 % of the work running (6.8 % hysteresis). `physics.js` now takes the spring's losses from it up to what mainsprings measure (running 10–20 % under winding → x up to 11 %). **The model's spring is fully wound 0.13 turn from coil-bound**: running, the fusee's output there is 78.5 %, the swing ~220° for the first ~9 h after winding. The set-up can't mend it; the spring needs ~½ turn of room (the bench's mainspring test now counts it). |

## Decisions waiting on the user

1. **The mainspring's room.** Researched from sources (12 October 2026, option A; OPEN-QUESTIONS.md 1, report section 10's last part): the model packs its coils coarser than every source (its strip is the videos' pitch, the film added on top); packed at the videos' pitch (strip 0.391, film 0.003) it has 0.60 turn and swings in the band all through the wind, but the room then turns on the core (r 5.2, the readings' mean: 0.20) and the barrel's size against the fusee. **Corrected (the user's decision, 12 October 2026): the coils pack at the videos' pitch, the strip 0.394 with no film** (`MC_MS_GAP` 0): set up 0.89 turn, 0.60 turn of room, the swing 248° fully wound and in the band all through the wind; the build's Nivaflex then has 0.79. Still open: the core (on r 5.2 the room would be about 0.2) and the barrel's size against the fusee. Done for the build: the Nivaflex strip has 0.59 turn and swings in the band within an hour of winding. For the Model 21 itself the model's 0.394 mm strip has 0.33 turn and swings 225° fully wound (under the band ~5.6 h), which conflicts with real Model 21s swinging in the band fully wound: either the real strip is a few micrometres thinner (its thickness is OPEN-QUESTIONS.md 1; 8 µm less gives the half turn), or the friction model overstates pressure near coil-bound. Changing the model's spring is a model change: show the evidence (report section 10) and let the user decide; settle it from sources (videos of real springs, literature on mainspring room), never by asking the user to measure.
2. **Release.** Suggest a minor release with lines for visitors (the bench's new tests on the cards and in the build book); deploy only on the user's word.

## What to do next, in order

1. ~~Re-solve the spring for the build's Nivaflex strip~~: done (above; `--nivaflex` on `mainspring.py` and `mainspring_friction.py`).
2. **Rate while the temperature changes** (simulation item 4). The thin hairspring warms faster than the balance rim, so even a compensated pair runs off-rate during a change: heat flow through box, case, movement, balance and spring over a ship's day-night cycle; the error a navigator carries; how the Glucydur/Nivarox pair copes. Materials' thermal figures from data sheets, cited (never from memory). New tool, a report section 11.
3. **Which estimates matter most** (simulation item 5): push every estimate (tooth form and friction, the springs' sections, the detent's damping and the contacts' restitution, materials, the spring's room) through `dynamics.js` and a voyage (`errorbudget.js`), ranked by effect on the rate: which bench measurements to make first.
4. **Jigs**, as guidance for any maker (the user has no chronometer; don't ask about equipment): a torque lever for the barrel arbor's square and the fusee arbor, a barrel holder, a degree card for the escapement's angles, a stand for vibrating the balance, a clamp for the detent's foot (the ring test). Measure every seat on the model first (`holes.py`, `isolate.py`); STL through `MAKER.stl` or a small tool; add each to the build book's tests chapter.
5. **The "as made" Monte Carlo with CNC tolerances** in `errorbudget.js`: hole positions ±13 µm (`gearing.json`), turned diameters ±5 µm, a typical CNC's from published figures.
6. **Carry the deviations into the physics tools:** `strength.js` and `tolerances.js` still judge the steel mainspring (add Nivaflex from `deviations.json`); `physics.js` A5 should report the Glucydur/Nivarox requirement beside the Model 21's.
7. **Lower priority:** the arbors' own bending (`fea.py` takes them rigid; the fusee arbor carries up to 59 N); Archard wear on the fusee/centre mesh; the fusee chain's link-by-link ripple; oil friction with speed and temperature; the hairspring as a 3D helix with mass.

## How to work

- **Every new check**: its own tool with a header (purpose, usage, run time, what it fails on); a line in CLAUDE.md's tool list and its time in the timing paragraph; a bullet in the model README's "Checked in time"; a report section (method, figures, tables, charts, sources, what it leaves out) fed through `assets/*.json` or a tool JSON read by `build_report.py`; a CI step (`ci.py`: quick if under ~20 s, else `full`). Render the report in light and dark (and at 390 px) and look at it before committing.
- **Order before merging:** in the worktree, regenerate what you changed (`node bench.js --write` → `python makers.py` → `python build.py --site-url https://www.marinechronometermodel.com` → `python build_report.py`), run `python ci.py` (alone: browser checks under load fail), commit, push the branch, check `main`'s checkout is clean and in step with `origin`, then `git merge --no-ff` and push `main`. A bug fix gets a `RESOLVED.md` entry with its hash.
- **Validate a new model against the old one first.** Every new simulation here was first made to reproduce the existing tool (frame rigid and hinged = `dynamics.js`; the gimbals' periods against the page's GIM) before its new physics was trusted. Keep doing that, and keep the check in the tool.
- **Distrust results that change sharply with a tiny input change**: they were a solver failure every time this round (a Newton rest solve diverging; an augmented-Lagrangian multiplier dominated by its penalty; a sampled table's staircase).
- **Contact forces:** penalty contacts need their dampers sized on the local mass (1/|r|² over the kept modes) and the step sized on every contact's frequency and damping rate (`tripping.js` model()). In packed spirals, forces from differentiated shapes or solver multipliers are unreliable; equilibrium (ring) equations work.
- **Slip/kinematics:** follow material points, not fixed angles (a spiral's cumulative angle renumbers its coils between states).
- **Sources:** material and seakeeping figures from cited sources (search when needed); say "estimated" where there is none, and list it in the report's limits.
- **Shell pitfalls:** heredocs in the Bash tool collapse `\\` to `\` and turn `\n` into real newlines; write Python edit scripts with the Write tool into the scratchpad and run them, or use the Edit tool. The project's geometry hook fires on any command or file that merely mentions `escapement.js`/`movement.js`: if no part's shape changed, say so.
- **Run times on this machine:** `tripping.js` ~6 min (`--quick` 10 s, `--write` 2 min), `gimbals.js` ~2½ min, `massprops.py` 30 s, `mainspring_friction.py` ~1 min, `ci.py` ~8 min. Give an ETA before each run (CLAUDE.md requires it).

## Estimates the report flags (replace them when sources or measurements arrive)

- Tooth form BS 978 Part 2; tooth friction 0.10–0.20; pivot shake 10 µm.
- Brass E 97–110 GPa; expansion brass 18.7–20.9, steel 10.8–12.5 ×10⁻⁶/°C.
- Glucydur as CuBe2 (C17200); Nivarox expansion 7–10 ×10⁻⁶/°C, modulus 165–195 GPa; Nivaflex's 3000 N/mm² is its maker's aged figure.
- The mainspring's thickness and the detent and trip springs' sections are open (OPEN-QUESTIONS.md 1–2).
- `tripping.js`: the contacts' restitution (0.3; 0 at the jewels) and the detent's damping (Q 100).
- `gimbals.js`: the box's inside (stops 29.5°), the pivots' damping (ζ 0.05), the blows' stiffness and restitution, the box's place in the ship, small craft's motion; the balance's poise error (2 µm).
- `mainspring_friction.py`: μ 0.10 (0.08–0.16); the ring equations take packed coils as round; the strip's edges on the barrel and the steel's own hysteresis are left out.
- `benchcheck.py`: the bands around the manual's "about" figures.
