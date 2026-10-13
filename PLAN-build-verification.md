# Plan: verifying a chronometer built from the model

Handoff for the next session (updated 12 October 2026, evening: after the mainspring's room was researched from sources and the model's spring corrected, released as 2.27.02).

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

- **Branch:** `claude/build-verify`, worktree `.claude/worktrees/build-verify`. Merged into `main`, both pushed. Start by `git merge --ff-only main` in the worktree. **Other sessions work on `main` at the same time** (2.27.00 and 2.27.01, the stop-bar and the fusee's top, were released by another session during this one): fetch and look before merging.
- **Live site: 2.27.02** (deployed 12 October 2026, tag `v2.27.02`): the mainspring corrected. Nothing of this work is unreleased.
- **The report:** `marine-chronometer-source/chronometer-working-model/verification/build-verification/index.html`, built by `build_report.py` from `template.html`, `assets/*.json` and the tools' JSON. Sections 1–7 earlier work, 8 tripping, 9 gimbals at sea, **10 the mainspring**: coil friction (Figures 14–15), the build's Nivaflex strip (Table 16, Figure 16), the model's strip against the sources' proportions (Table and Figure 17). Its "Reproduce" section lists every step.
- **CI:** `python ci.py --full` passes 40 of 40 (about 56 min on this machine; `python ci.py` 28 of 28 in about 9 min). `smoke.py` once failed under load and passed alone: rerun it alone before believing a smoke failure.

## The mainspring (this round's main work)

**The finding.** The strip's 0.394 mm was read off the packed coils' *pitch* on KLUwI2UUCMQ (1/41.4 of the barrel's inside radius): the strip plus whatever lies between the coils. `mainspring.py` took it as the bare strip and kept the coils a further 0.01 mm apart, so the model packed at 1/40.3 of the inside radius, coarser than every source (videos 1/41.0–1/43.7; the British Museum's Model 21, Randall & Good 1990 cat. 117A, strip 1/43.2). Room in turns depends only on proportions (pitch, core, length against the barrel's inside radius), so the sources' ratios decide it without the barrel in millimetres.

**Corrected (the user's decision, 12 October 2026; released 2.27.02):** the film between packed coils is 0 (`MC_MS_GAP`, default 0 in `mainspring.py`; `MSPRING.gap` 0 in `core.js`, unused): the strip stays 0.394, the coils pack at the measured pitch. No source gives a film (the literature search found none; one secondary source says 0.002–0.004 mm).

| | until 12 October 2026 (film 0.01) | now (packed at the pitch) |
|---|---|---|
| set-up, fully wound, coil-bound | 1.01 turns, 18.87, 19.20 | 0.89 turn, 18.75, 19.35 |
| room, full wind to coil-bound | 0.33 turn | **0.60 turn** |
| fusee torque fully wound, of frictionless (μ 0.10) | 78.5 % | 95.3 % |
| swing fully wound; hours under 247.5° | 225°; ~5.6 h | 248°; none |
| coils' friction running; hysteresis | 3.4 %; 6.8 % | 2.0 %; 4.0 % |
| let down, arbor out: coils packed on the wall (video 12 ± 1) | 10.4 | 11.2 |

The build's Nivaflex 0.386 mm strip packed the same way: 0.79 turn of room, 97.1 % fully wound, the swing from 251°.

**The sources' proportions** (each solved in the model's barrel with the model's free curve and fusee; report Table 17): KLUwI2UUCMQ's pitch with the old 0.01 film 0.46 turn; TN24H's finer pitch 0.78; KLUwI2UUCMQ's pitch on the core's mean reading r 5.2 (0.32 of the inside radius) **0.20**; the British Museum's proportions (core 0.34) 0.30 and a fusee output uneven 18.8 % (the model's fusee isn't cut for that spring). Within about ±0.1 turn (the set-up comes from the smoothed pull over quarter-turn states).

**The literature** (checked in the scans; `References/` doesn't hold them): Britten, *Watch and Clockmakers' Handbook* 1896 p. 229, the arbor a third of the barrel's inside "for watches and 2-day marine chronometers", a fusee spring with about ½ turn to spare; Saunier, *Traité d'horlogerie moderne* 1887 §1214 (Rozé), the strip 1/30 of the arbor's diameter for chronometers (the museum's 13/0.44 = 29.5; the model's 9.8/0.394 = 24.9); J. and H. Grossmann, *Lessons in Horology* 1905 §§105–111, the turns formula, real turns "always less".

**Still open (OPEN-QUESTIONS.md 1):** the room now rests on the core, r 4.9, the lowest of its readings (r 4.9–5.6 on two movements); on their mean it would be about 0.2 turn. And the barrel's size against the fusee (the museum's barrel is larger: fewer turns of chain, not in these runs). Settle from sources only.

**Two bugs found and fixed on the way** (RESOLVED.md): `write()` now drops trailing states at coil-bound whose energy jumps (over 3× the median step; one bent the Nivaflex pull over the whole wind); `maintaining.py`'s catch check now adds what the frame's running adds to the reload at the drive `R.release` took (it added the train's whole turn, which fails where the reload begins).

## Done in earlier rounds, and what each found

| Tool (in `tools/`) | What it does | Finding |
|---|---|---|
| `tripping.js` (+ `tripping.json` via `--write`) | The detent as a 37-element plane frame from the drawn pieces, its modes in time with the balance and wheel, every contact elastic. Validated against `dynamics.js` with the frame rigid and hinged. | No trip at the model's settings: a held tooth's stone uses at most ~11 % (22 % worst estimate) of the 114 µm depth of lock. Trips from a 337° swing or a 61 g / 3 ms blow. The real margin is the depth of lock. The flexure turns about its middle: 39 % stiffer than the hinge. |
| bench additions | `bench.js` test "The detent rings"; the lock's floor in the escapement test; `benchcheck.py --ring FILE`. | Never a lock under 5°. The ring (137 Hz as drawn; 137–342 Hz for a 0.079–0.150 mm spring) measures the detent spring's section. |
| `massprops.py` (→ `gimbals.json`) | Weighs the case with the movement and the gimbal ring on the model; how far each swings before it meets the box. | Case 1,669 g, ring 140 g; stops 29.5°. The drawn pivots aren't levelled (the manual levels them, p. 13). **Rerun `--write` after any change to a heavy part's shape, the mainspring's included.** |
| `gimbals.js` | Ring and case as coupled rigid bodies in a random seaway; what reaches the escapement through `dynamics.js`. | Periods 0.72 / 0.68 s, clear of ships and the beat; in working seas within 0.3° of the apparent vertical, the rate 0.005 s a day. |
| `mainspring_friction.py` | The coils' friction from the solved states (slip on the steel, packed coils' pressure by ring equations). | Now 2.0 % running (above). `physics.js` takes the spring's losses from it up to what mainsprings measure. |
| `mainspring.py` variants, `--bound`; `mainspring_friction.py --variants` | Any strip, length, core and film solved beside the page's spring; coil-bound to 0.05 turn; every variant's friction and swing. | Above. |

## Decisions waiting on the user

None. (The mainspring's correction and the release are done.) If a source settles the core or the barrel's size, the room may change: a model change, so show the evidence and ask.

## What to do next, in order

1. **Rate while the temperature changes** (simulation item 4). The thin hairspring warms faster than the balance rim, so even a compensated pair runs off-rate during a change: heat flow through box, case, movement, balance and spring over a ship's day-night cycle; the error a navigator carries; how the build's pair (the Model 21's stainless and Invar balance, a Nivarox spring) copes. Materials' thermal figures from data sheets, cited (never from memory). New tool, a report section 11.
2. **The arbor's core, from sources** (OPEN-QUESTIONS.md 1; optional, it decides the room): re-read the core's ratio to the barrel's inside radius on more frames and videos (`References/VIDEOS.md` lists the ones that show the barrel open: KLUwI2UUCMQ 33:06, 33:20.5; TN24H `3SFDplGq6vs` 0:16), ratios only, with how sure each is; then solve the spring on it as a variant (`MC_MS_RA`) and report the room. A change to the model's core is the user's decision.
3. **Which estimates matter most** (simulation item 5): push every estimate (tooth form and friction, the springs' sections, the detent's damping and the contacts' restitution, materials, the spring's room and core) through `dynamics.js` and a voyage (`errorbudget.js`), ranked by effect on the rate: which bench measurements to make first.
4. **Jigs**, as guidance for any maker: a torque lever for the barrel arbor's square and the fusee arbor, a barrel holder, a degree card for the escapement's angles, a stand for vibrating the balance, a clamp for the detent's foot (the ring test). Measure every seat on the model first (`holes.py`, `isolate.py`); STL through `MAKER.stl` or a small tool; add each to the build book's tests chapter.
5. **The "as made" Monte Carlo with CNC tolerances** in `errorbudget.js`: hole positions ±13 µm (`gearing.json`), turned diameters ±5 µm, a typical CNC's from published figures.
6. **Carry the deviations into the physics tools:** `strength.js` and `tolerances.js` still judge the steel mainspring (add Nivaflex from `deviations.json`); `physics.js` A5 still gives the Model 21's requirement from Invar's and stainless's bounds (−22 to +10 × 10⁻⁶); `deviations.js` now reads it from Table IV (+0.1 to +13.0), which A5 could take. The Nivaflex card (`deviations.js`) could also say its room (0.79 turn): visitor-facing text, ask first.
7. **Lower priority:** the arbors' own bending (`fea.py` takes them rigid; the fusee arbor carries up to 59 N); Archard wear on the fusee/centre mesh; the fusee chain's link-by-link ripple; oil friction with speed and temperature; the hairspring as a 3D helix with mass; the model's spring shows two loose inner turns let down where KLUwI2UUCMQ 33:20.5 shows about one (old and new alike).

## How to work

- **Every new check**: its own tool with a header (purpose, usage, run time, what it fails on); a line in CLAUDE.md's tool list and its time in the timing paragraph; a bullet in the model README's "Checked in time"; a report section (method, figures, tables, charts, sources, what it leaves out) fed through `assets/*.json` or a tool JSON read by `build_report.py`; a CI step (`ci.py`: quick if under ~20 s, else `full`). Render the report in light and dark (and at 390 px) and look at it before committing.
- **Order before merging:** in the worktree, regenerate what you changed (`node bench.js --write` → `python makers.py` → `python build.py --site-url https://www.marinechronometermodel.com` → `python build_report.py`), run `python ci.py` (alone: browser checks under load fail; `--full` after anything that feeds the drive or geometry), commit, push the branch, fetch and check `main`'s checkout is clean and in step with `origin`, then `git merge --no-ff` and push `main`. A bug fix gets a `RESOLVED.md` entry (under "Fixed, not yet committed", then moved under its heading with its hash).
- **If `main` moved while you worked:** commit, `git merge main` into the branch, resolve conflicts in the built copies and `js/makers.js` by regenerating (`git checkout --theirs` them, then `bench.js --write`, `makers.py`, `build.py`), re-read anything page-derived (below) and rerun `ci.py --full`. Another session's fusee change and this session's spring met that way: `maintaining.py` passed on each alone.
- **Changing the page's mainspring** (`js/mainspring.js`; the order used for 2.27.02): `mainspring.py` from a scratch directory (it writes `mainspring.json` to the current directory; about 22 min on 14 processes; `MC_MS_THI=20.0` to see past coil-bound), then `--bound` (about 6 min) → read the page's new fusee through `?qa` (`__mv.userData.R.fs`: `MS.Tup`, `MS.Tdown`, and `[n, Ib(n), torque(n)]` every quarter turn to 8.5) into `mainspring_friction.py`'s `TUP,TDOWN,FUSEE` (`invariants.py` holds them to the page) → `mainspring_friction.py` → `--variants` (each variant's file is checked by CI) → `mainspring.py --letdown` against the video's 12 ± 1 → `isolate.py mainspring` beside a barrel frame (the mainspring is built only when shown: `--eval` sets `F.ms.geometry=mainspringGeo(MSHAPE.T0,…)` and `visible`; aim the camera at its centre, about −22.1, −15.1, −5.3) → `massprops.py --write`, `gimbals.js`, `gimbals.js --json …/assets/gimbals.json` → `bench.js --write`, `makers.py`, `build.py`, `reportdata.js`, `build_report.py` → `ci.py --full`.
- **Spring variants:** `MC_MS_T`, `MC_MS_L`, `MC_MS_RA`, `MC_MS_GAP`, `MC_MS_E`, named by `MC_MS_TAG` (`--nivaflex` sets the build's from `deviations.json`); the table goes to `tools/mainspring_TAG.js` (never `js/mainspring.js`), `--bound` records the parameters in `mainspring_bound.json`, `mainspring_friction.py --variants` runs each. Two solves at once on this machine's 28 cores are fine; **stagger their `--bound` steps** (each rewrites `mainspring_bound.json`). Check every table's pull rises past the slack before trusting a set-up: a state solved right at coil-bound bends the smoothed pull (now dropped by `write()`).
- **Validate a new model against the old one first.** Every new simulation here was first made to reproduce the existing tool (frame rigid and hinged = `dynamics.js`; the gimbals' periods against the page's GIM; the fusee rule against the page's full wind) before its new physics was trusted. Keep doing that, and keep the check in the tool.
- **Distrust results that change sharply with a tiny input change**: they were a solver failure every time (a Newton rest solve diverging; an augmented-Lagrangian multiplier dominated by its penalty; a sampled table's staircase; a coil-bound state in a smoothing fit; a limit read where a quarter-turn table stops, 0.13 where the truth was 0.33).
- **Contact forces:** penalty contacts need their dampers sized on the local mass (1/|r|² over the kept modes) and the step sized on every contact's frequency and damping rate (`tripping.js` model()). In packed spirals, forces from differentiated shapes or solver multipliers are unreliable; equilibrium (ring) equations work.
- **Slip/kinematics:** follow material points, not fixed angles (a spiral's cumulative angle renumbers its coils between states).
- **A reading off a photograph or video is what it measures:** a pitch is the strip plus what lies between; a thickness taken from it is at most that. Ratios need no scale; prefer them.
- **Sources:** material and seakeeping figures from cited sources (search when needed; a subagent can search the literature, but check its key quotes in the scans before relying on them); say "estimated" where there is none, and list it in the report's limits.
- **Shell pitfalls:** heredocs in the Bash tool collapse `\\` to `\` and turn `\n` into real newlines (it broke a Python string twice this round); write Python edit scripts with the Write tool into the scratchpad and run them, or use the Edit tool. The project's geometry hook fires on any command or file that merely mentions `escapement.js`/`movement.js`: if no part's shape changed, say so. The page's console isn't captured by `maintaining.py`: put debug figures in a `fail()` message.
- **Run times on this machine:** `mainspring.py` ~22 min (14 processes), `--bound` ~6 min, `--letdown` ~2 min; `mainspring_friction.py` ~1 min, `--variants` ~6 min; `tripping.js` ~6 min (`--quick` 10 s, `--write` 2 min); `gimbals.js` ~2½ min; `massprops.py` 30 s; `ci.py` ~9 min, `--full` ~56 min. Give an ETA before each run (CLAUDE.md requires it).

## Estimates the report flags (replace them when sources or measurements arrive)

- Tooth form BS 978 Part 2; tooth friction 0.10–0.20; pivot shake 10 µm.
- Brass E 97–110 GPa; expansion brass 18.7–20.9, steel 10.8–12.5 ×10⁻⁶/°C.
- Nivarox expansion 7–10 ×10⁻⁶/°C, modulus 165–195 GPa; Nivaflex's 3000 N/mm² is its maker's aged figure.
- The mainspring's thickness (0.394, the videos' pitch, so the strip at most) and the detent and trip springs' sections are open (OPEN-QUESTIONS.md 1–2); **the film between packed coils 0** (no source); **the arbor's core r 4.9**, the lowest of its readings (the room rests on it); the spring's free curve is the model's for every variant.
- `tripping.js`: the contacts' restitution (0.3; 0 at the jewels) and the detent's damping (Q 100).
- `gimbals.js`: the box's inside (stops 29.5°), the pivots' damping (ζ 0.05), the blows' stiffness and restitution, the box's place in the ship, small craft's motion; the balance's poise error (2 µm).
- `mainspring_friction.py`: μ 0.10 (0.08–0.16); the ring equations take packed coils as round; the strip's edges on the barrel and the steel's own hysteresis are left out; the variants run on the model's fusee (a real fusee is cut for its spring).
- `benchcheck.py`: the bands around the manual's "about" figures.
