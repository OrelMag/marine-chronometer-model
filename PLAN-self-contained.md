# Plan: a self-contained model, enough to make a Model 21 and use it at sea

_Status: written 4 October 2026. Phase 0 done (a239864). Decisions D1–D4 taken as suggested (the user, 4 October 2026). Phase E's E1 and E2 done, E3 in part (below)._

## The goal

Someone with only the site (or its single-file copy, offline) can make a Model 21 that keeps
time, adjust and rate it, and use it to find longitude with no radio. Today the model is a
faithful picture of how the movement is laid out and moves. It is not a set of making
instructions, and its dynamics are calibrated, not derived.

The review of 4 October 2026 found these gaps. It used `audit.py` (movement and box),
`solids.py`, `escapement.js` and `invariants.py`, all passing, and three read-throughs: the
estimates, the physics and what a maker would need.

1. **The balance drawn isn't the balance timed.** The drawn balance gives about 730 g·mm².
   `I_REST` adds 410 to reach Table II's 1,140 (`movement.js` 934–939). A balance built to the
   drawing would run about 25% fast.
2. **The hairspring isn't specified.** It is drawn as round wire with generic terminal curves
   (`core.js` `springGeo`). It has no strip section, length, stiffness or alloy. Its
   isochronism is taken as perfect (`HS`=0). The stiffness the balance needs
   (k = Iω² ≈ 1.8×10⁻⁴ N·m/rad) appears nowhere on the page.
3. **The energy is fitted, not budgeted.**
   - The escape-wheel torque is solved so the balance swings 255°.
   - The fusee is flat by construction: the spring's pull is defined as what the profile evens out.
   - A rough check doesn't close. The assumed damping (TF 25 s, Q 157) loses about 140 µW, but a
     spring of the parts list's 0.0165 in gives the balance about 20–60 µW.
4. **The escape wheel and train have no mass.** The drop and impulse are kinematic.
5. **Temperature is copied, not computed.** It comes from Table IV and one test card (No. 3390),
   and the 30-day test is checked against that same card.
6. **Most sizes needed to cut metal are estimated or absent.** These include:
   - pivots and jewel holes, and threads;
   - the tooth forms, assumed from BS 978;
   - the mainspring's width, length and steel, and the chain's pins;
   - the detent and trip-spring sections;
   - every material beyond a few names, heat treatment and lubrication.
7. **The page shows no sizes.** It has no dimensions, drawings or export (STL, CAD). The manual
   isn't shipped: `site/` is one page.
8. **The time can't be found without radio.** The essay assumes radio time signals.

## Decisions (taken 4 October 2026: each as suggested)

| # | Decision | Options | Suggested |
|---|---|---|---|
| D1 | **A fourth kind of source.** Heat treatment, substitute alloys, oils, thread standards and pivot practice are in none of the three sources of truth (manual, photographs, videos). | (a) Admit published horological literature, cited and shown as its own class in Colour by source. (b) Derive only, and say where the model stops. | (a), with literature never outranking the three. |
| D2 | **Which chronometer.** | (a) The Model 21 as made: Elinvar spring, Invar-armed balance. (b) Also an achievable variant from ordinary steel and brass: a steel hairspring with the split bimetallic balance the model already has, a few days' rate stability given up. | Both. (a) is the record; (b) is what can be made after an apocalypse. |
| D3 | **Shipping the manual.** It is an 8.9 MB Google Books scan of a 1948 U.S. Navy publication, so probably public domain, but the scan's terms need checking. | (a) A file in `site/`, linked from About › Sources. (b) Also inlined in the root single file (about 13 MB). (c) Transcribe what's used into the page only. | (a) plus (c). (b) only if the root copy must hold everything. |
| D4 | **Astronomy scope.** | (a) Methods only, using a printed almanac. (b) An almanac computed in the page: Sun, Moon, about 60 navigational stars. | (b): without it the page isn't self-contained at sea. |

## Phase 0: stale records (done, a239864)

- The train's module comments now give 0.392 / 0.3245 / 0.251 / 0.2614, as `MOD` and `solve.py`
  do. They said 0.314 / 0.245 / 0.249.
- README: the essay's terminal-curve figure draws 10 coils, and the model's spring has 9 turns.
  It said "the model's fourteen".
- README: the chain is riveted at a 1.7 mm pitch with about 390 links. It said 1.0 mm and 660 links.

## Phase A: the physics derived, not fitted (L)

Each item ends with a check that fails when the derivation and the manual disagree, in
`invariants.py` or `tools/escapement.js`. The model stops being tuned to the answer; the
manual's figures become the test.

| # | Item | How | Check | Effort |
|---|---|---|---|---|
| A1 | **What carries the 410 g·mm².** | Measure the staff, rollers, collet, arm and hub on the videos (`References/VIDEOS.md`), at the hub and staff, with `video.py`, `rimfit.py` and `framecam.py`. Recheck the parts list's screw masses against the measured heads: README "the masses need a denser metal than brass". Then drop `I_REST`. | Drawn I = Table II's 1,140 within 1%, with no added term. | M |
| A2 | **The hairspring designed.** | 1. k from I and the 0.5 s period, shown live. 2. Strip section and length from k = Ebt³/12L, using the measured coil (r 6.3, 9 turns, 5.9 tall). E comes from the alloy (D1, D2), and a measured strip if any video shows one. 3. Draw it as a strip. 4. Terminal curves that meet Phillips' conditions, computed: the curve's centre of gravity on the axis, and its radius of gyration. 5. Isochronism computed from the curve's residual, not set to 0. Note: `claude/navy-pins` has the coil's radius in question (Review-results 25: 6.3 on video, about 5.0 on a photograph); settle it first. | The period from k and I is 0.5 s. Phillips' residuals are under a set limit. The isochronism figure is within the manual's 30-day card limit (0.50 s). | L |
| A3 | **The energy budget closed.** The fusee half of IDEAS 2.2 goes further. | 1. Mainspring torque from its section (thickness from the parts list; the barrel's measured height bounds the width, and a video gives the width), its length, and set, with coil friction. 2. Fusee torque from that and the measured profile. 3. Each stage's efficiency from its cycloidal mesh. 4. Escape-wheel torque. 5. Q from a source: a filmed run-down if one exists, or literature (D1). 6. The amplitude then becomes a prediction. | The predicted amplitude is within 1⅜–1½ turns (manual) over the 56 h. The fusee's measured profile evens the derived pull to within a few %. A budget that doesn't close fails. | L |
| A4 | **The escape wheel with mass.** | Its inertia from its drawn solid and brass. The drop and impulse become a chase: the wheel accelerates, then strikes. `makeEsc` gets a dynamic impulse; the geometry stays. | Lock, let-off, drop and overall still meet Ops. 84–97. The impulse's efficiency and the landing angle are reported, not assumed. | M |
| A5 | **Temperature from the materials.** | The rim's and arm's expansion, and the spring's thermoelastic coefficient (alloy from D1, D2), give the linear term and the curvature. Table IV and card No. 3390 become checks, not inputs. For the variant (D2 b), the bimetal dimensions that compensate a steel spring. | The derived curve is within the card's figures (0.08 / 0.06 / 0.02 s a day) and the Bureau of Ships limits. | M |

## Phase B: every part fully specified (L)

| # | Item | How | Effort |
|---|---|---|---|
| B1 | **A maker's sheet for each part,** generated from the built model so it can't go stale. | Each part card gains the following. **Sizes:** overall size, thickness, and every hole's centre and diameter (`holes.py`'s reading, moved into the page). **Fits:** the fits it makes (`bom-check.js`'s relations: run, press, tap, clear) with the clearance. **Making:** material, finish, heat treatment. **Provenance:** each value's source and confidence: Manual, Measured, Derived (Phase A), Literature (D1) or Estimated. Follows `claude/pieces`, which splits the lumped parts. | M |
| B2 | **The estimates that decide running, closed by measurement.** | 1. Pivot and jewel-hole diameters (video close-ups; bounds where a video can't resolve). 2. The mainspring's width. 3. The chain's pin and plate sizes. 4. The detent spring's section and set, from Op. 78's test: 0.770 g hung on the locking jewel (Tool No. 8, Fig. 88) just parts the spring from its stop button. Beryllium copper's E gives the section. 5. The trip spring's section, from the unlocking work and Elinvar's E. 6. The threads: diameter from the screw's shank, pitch measured where a video shows one, a cited standard otherwise (D1). | L |
| B3 | **Tolerances.** | From the manual: end-shakes 0.001–0.003 in; roller and horn clearances; the escapement's angles. From literature (D1): side-shake, depthing, poise. Each fit in B1 gets its range, not the model's single clearance. | M |
| B4 | **The teeth.** | Each wheel's and pinion's actual outline: module (`MOD`), count, cycloidal addendum and root, rim and crossing-out, as drawn. The profile stays marked Estimated (BS 978) unless a frame resolves one. | S |

## Phase C: sizes a visitor can take away (M)

| # | Item | How | Effort |
|---|---|---|---|
| C1 | **Measure.** | IDEAS 3.9: two points, snapping to axes, holes and edges; mm and in. | S |
| C2 | **Exports.** | Per-part STL and a whole-movement glTF, plus the data as CSV and JSON: train, fusee profile, escapement cycle, maker's sheets. Do it as PLAN-articles §3 lays out. It is generated in the page, not by a tool, so the offline copy carries it. Binary STL is a few lines in `core.js`, and every solid is already closed (`solids.py`). Tooth outlines go out as SVG and DXF. | M |
| C3 | **Dimensioned drawings.** | For each part: a plan and a section (the section view's cut, already hatched), with dimensions from B1. | M |
| C4 | **A build book.** | A print stylesheet that lays out every maker's sheet, drawing and procedure (D, E) as a book: what survives when the screen doesn't. | S |

## Phase D: the workshop, in the page (M–L)

| # | Item | Source | Effort |
|---|---|---|---|
| D1 | **Oiling:** an overlay and table, `{part, point, oil, op}`, as IDEAS 3.5 describes, with substitute oils. | Ops. 43–71 (Sec. VIII) and the figures they point to (Figs. 80 and 81 and those after, each oil point arrowed red or argon). Substitutes from literature (decision D1). | S–M |
| D2 | **Adjusting the escapement:** in full, with Op. 78's detent-spring test. The adjuster's bench already drives the model. | Ops. 77–97 (Op. 78: 0.770 g, Tool No. 8, Fig. 88). | S |
| D3 | **Order of work:** taking down and putting together, IDEAS 3.5's overhaul walkthrough, each step with its operation number and tool. | Secs. V (Disassembly) and VIII (Reassembly). | M |
| D4 | **Tools.** The manual's list, and how to make the ones that matter: depthing tool, turns, staking, a wheel-cutting engine, the endshake stand. | Sec. XIII; literature for making them (decision D1). | M |
| D5 | **Materials, substitutes and heat treatment** for staff, pivots, springs, detent and pinions; the achievable variant's (decision D2 b) part by part. | Literature (decision D1); Phase A's derived numbers. | M |
| D6 | **Rating:** the 30-day test, Tables I–IV, timing and vernier weights, as now, plus how to rate against the sky (Phase E) instead of a time signal. | Sec. IX (Test and Adjustment). | S |

## Phase E: time and longitude without radio (M–L)

**Done (4 October 2026), on `claude/self-contained`:**
- **E1, the almanac.** `shared/almanac.js` (`ALM`) is the almanac and the navigator's arithmetic. It has:
  - the Sun (VSOP87 abridged), the Moon (ELP-2000/82's main terms), the 57 stars and Polaris (SIMBAD), sidereal time, nutation, aberration and ΔT;
  - dip, refraction, parallax and semi-diameter;
  - the time sight, the intercept and a fix;
  - equal altitudes, and the lunar distance cleared exactly, with the Earth's figure taken off from the DR;
  - sights made from the almanac, for the worked examples.

  `tools/almanac.js` checks it, about 1 s, and is in `ci.py --quick`. The references are JPL Horizons and skyfield, written to `almanac-ref.json` by
  `almanac_ref.py`. Its findings:
  - the Sun within 0.5″ and the Moon within 6.5″ over 1950–2149, and the stars within 2.1″;
  - round trips give the longitude back within 0.001 nm, the error by equal altitudes within 0.01 s, and a lunar's GMT within 1 s;
  - the Sun's hand rule is within 0.6′.

  The page's own accuracy statements are checked against these findings.
- **E2, the essay.** Four sections after "Keeping the rate":
  - "Greenwich time from the sky" (equal altitudes ashore);
  - "Longitude by chronometer" (the time sight, with the corrections);
  - "The lunar distance" (clearing, and the time it gives);
  - "An almanac to print" (the almanac's pages for any days and Print, the hand rules for the Sun and the sight, and a workbook for one's own sights).

  Each worked example is a fixed day and place, made by the almanac and worked from the readings alone.
- **E3, in part.** The model already keeps a rate book (`#open=bookDet`), and the workbook gives the chronometer's error from a lunar. Still open: the rate book
  taking comparisons from equal altitudes or lunars as well as from the master time.

**Still open in E:** a meridian transit and the noon sight for latitude (only the time sight is worked); the planets, which the Nautical Almanac
tabulated for lunars too; the rate book above.

| # | Item | How | Effort |
|---|---|---|---|
| E1 | **An almanac computed in the page** (decision D4 b). | Sun, Moon, about 60 navigational stars, the equation of time and the Moon's distance from the Sun and stars. Computed with published algorithms (Meeus), each cited. Checked against a printed almanac's values for chosen dates, in a new `almanac.py` or `invariants.py` step. | M |
| E2 | **Essay sections.** | 1. Local time from equal altitudes or a meridian transit. 2. Setting to Greenwich at a place of known longitude. 3. Greenwich time at sea from a lunar distance (with clearing the distance worked through). 4. Longitude from a time sight. 5. Each with a worked example run on E1 and the model's own clock. | M |
| E3 | **The rate book** wired to it: daily comparisons against the sky, the mean rate, several chronometers compared. | IDEAS 3.2; `claude/record-book`'s Form NavShips 702. | S–M |

## Phase F: packaging and the check that keeps it so (S–M)

| # | Item | How | Effort |
|---|---|---|---|
| F1 | **The manual shipped** (decision D3). | It is linked from About › Sources and from each part card's figure and operation reference. | S |
| F2 | **One offline copy that holds everything.** | The root `chronometer-working-model.html` already runs offline. It gains the exports (C2), the build book (C4) and the almanac (E1), and the manual if decision D3 b. The essay says that this file is the thing to keep. | S |
| F3 | **`selfcontained.py`**, a new step in `ci.py`. | It fails when: **(a)** a part has no full maker's sheet; **(b)** a quantity that decides running is Estimated without bounds (I, k, the hairspring section, pivots, jewel holes, the mainspring, the escapement's sections, the train counts); **(c)** the page reaches the network; **(d)** a `data-live` value is missing; **(e)** the manual's link is broken. | S |

## Order and branches

- **Order:**
  1. The decisions D1–D4.
  2. A1, which A2 and A5 need, then A2–A5.
  3. B, then C and D in parallel.
  4. F last.
- E depends on none of these and can start whenever the decisions are made.
- **Branches.** Work happens on `claude/self-contained` (worktree
  `.claude/worktrees/self-contained`), with a sub-branch per phase merged back with
  `--no-ff`. `main` is merged in before each phase. Nothing goes into `main` until the user
  asks.
- **Overlaps with other branches:**
  - `claude/navy-pins`: the hairspring's radius (A2).
  - `claude/pieces`: the part split (B1).
  - `claude/record-book`: the rate book (E3).
  - PLAN-articles §3: the exports (C2); C2 supersedes its tool-made files with page-made ones.
- **Checks:** after each geometry change, `isolate.py` against the reference, then `fine.py`,
  `solids.py`, `audit.py` and `bom.py`. After each physics change, `escapement.js` and
  `invariants.py`. Before merging, `ci.py --full`.

## What stays out of reach

- **Skill and tools.** The page can describe making a hairspring, a jewel or a cut wheel; it can't
  supply the hand skill, or the lathe and wheel-cutting engine.
- **Measurement limits.** Some sizes will stay bounded rather than exact: pivots read off a 4K
  frame are good to about ±0.02 mm. The maker's sheet gives the range and says where the
  practice is to fit on assembly, as the manual's end-shake operations do.
- **The alloys.** The Model 21's Elinvar and Invar can't be made without modern metallurgy.
  The achievable variant (decision D2 b) is how a chronometer was made before them, and its
  rate is less stable.
