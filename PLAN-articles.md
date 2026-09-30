# Plan: engineering articles, gear-train widget and open downloads

_Status: planned, not started (saved 2026-09-30)._

## Context
The site (www.marinechronometermodel.com) has two pages: the 3D working model at `/` and the older essay at `/marine-chronometer`. The goal is to draw engineers and makers and to earn backlinks. We will add:
- three standalone, shareable technical pages: the detent escapement as a clocked sequential circuit, the fusee as a torque regulator, and an interactive gear-train calculator;
- free, ungated downloads (STL/glTF exported from the model, plus the math as JS/CSV/JSON).

Decisions made: standalone pages rather than essay chapters; downloads free, licensed CC BY, with **no newsletter**.

What exists to reuse:
- `shared/escapement.js` `makeEsc()` is the real escapement solver and runs in the browser and in Node. `state(p)` gives the balance angle `th`, detent `lift`, passing-spring bend `psDef` and wheel progress `prog`, with thresholds `thRel`, `thEnd`, `thPass` and `AMIN`.
- `movement.js:36-43` holds `TRAIN={fu:96,cp:14,cw:80,tp:10,tw:75,fp:10,fw:60,ep:8,ew:16}`, plus `MW`, `ESC_PER`, `FUSEE_PER_HOUR`, `FUSEE_TURNS=8.75` and `MOD`.
- The fusee profile `rf(m)=rmin/(1-drop·m/N)` and barrel turns `I(m)` are in `makeFusee`, `movement.js:641-718`.
- The essay's 2D figure kit is in `essay/src/p2.js:10-60`: `addFig`, `bindRange`/`bindPlay`/`bindSeg`, `canvas2D`, `chart`, `PAL`. Its F7 escapement plan drawing is at `p4.js:26-99`.

Known gaps these pages must be honest about:
- The fusee torque is flat *by construction*: no mainspring torque model exists (IDEAS §2.2).
- The centre, third and fourth tooth counts are estimated, not sourced (README "Estimated" section).
- IDEAS §12 requires illustrative physics to be labelled on the page and the `References/` photos to stay unpublished.

## 1. Shared code (no behaviour change to the model)
- **`marine-chronometer-source/shared/figs.js`:** move the essay's 2D helpers here (`addFig`, `bind*`, `canvas2D`, `chart`, `PAL`, and the F7 escapement-plan drawing as `drawEscPlan(ctx, ESC, st, opts)`). Load it from `essay/src/p1.html` before the concatenated script, and delete the moved code from `p2.js`/`p4.js`.
- **`marine-chronometer-source/shared/train.js`:** holds `TRAIN`, `MW` and `FUSEE_TURNS` plus pure functions:
  - `ratios(T)`: escape turns per arbor turn, and the period of each arbor for a given beat;
  - `fuseeR(m,{rmin,rmax,N})` and `barrelTurns(m,…)`: moved out of `makeFusee`;
  - `idealFusee(springTorque)`: the radius profile that makes output torque constant for any spring curve.

  It exports for Node the same way as escapement.js. `movement.js` then reads its constants and fusee formulas from here. The model's `index.html` script order becomes `core.js → shared/escapement.js → shared/train.js → movement.js → …`. Update the CLAUDE.md architecture line to match.
- Verify there is no behaviour change with `placements.py dump/--diff` and `views.py before/after`; both should diff to 0.

## 2. Pages: `marine-chronometer-source/articles/`
The files are `escapement.html`, `fusee.html`, `gear-train.html`, `articles.css` and one `*.js` per page. The pages are 2D canvas only, with no three.js, so they are small and fast.

Each page has its own `<title>`, description, `Article` JSON-LD and "Open in the 3D model" deep links (`/#view=…`, `#tour=N`). Each also has a shared footer linking the other articles, the model and the essay.

### a. `/escapement`: "A mechanical clocked sequential circuit"
- **Framing:**
  - the balance is the oscillator (2 Hz clock);
  - the detent is an edge-triggered latch that fires on one direction of swing only, because the passing spring makes it ignore the return swing, so it acts as a ÷2 edge detector;
  - the escape wheel is a one-step-per-clock register;
  - drop and lock are the setup/hold margins;
  - `AMIN` is the minimum clock amplitude below which the latch never triggers (the model's "stopped" state).
- **Fig 1, a logic-analyser timing diagram** computed from `ESC.state(p)` over two cycles:
  - an analogue trace of `th`;
  - digital lanes derived from the thresholds: LOCKED, UNLOCKING (`lift>0`), IMPULSE (`0<prog<1`), PASSING (`psDef>0`);
  - a scrubbable cursor.
- **Fig 2, a state-machine diagram** (SVG) with the states lit live from the same `state()`, next to the `drawEscPlan` plan view.
- **Fig 3, an amplitude slider:** below `AMIN` the IMPULSE lane goes flat. This demonstrates the "clock too weak" failure.
- Quote the manual's figures (lock, let-off, drop) from `tools/escapement.js measure()`.

### b. `/fusee`: "A mechanical voltage regulator"
- **Framing:**
  - the mainspring is a source whose torque sags as it unwinds;
  - the fusee is a variable gear ratio (radius `rf`) that holds the output constant, like an LDO;
  - maintaining power is a hold-up capacitor during winding.
- **Fig 1, a linked chart:** spring torque (a curve that is **labelled illustrative**), the fusee radius from the model's real profile, and output torque over 0–60 h. It has a "going barrel (no fusee)" toggle that shows the drop.
- **Fig 2, a design-your-own tool:** drag 3–4 control points of the spring curve, then `idealFusee()` redraws the cone's side profile and the residual torque. This is the most shareable figure.
- **Fig 3, chain bookkeeping:** 8¾ turns, 17½ half turns, 60 h (the same numbers `invariants.py` checks).
- **Optional follow-on:** switch the essay's F5 (`p3.js:222-240`) to the same `train.js` math (IDEAS §2.2).

### c. `/gear-train`: "Gear-train calculator"
- **Inputs:** number fields and steppers for each wheel and pinion count (defaults to the real `TRAIN`) and the beat (0.5 s).
- **Outputs**, live from `ratios()`:
  - the period of each arbor;
  - whether the fourth arbor still makes 60 s (so it can carry the seconds hand) and the centre arbor 3600 s;
  - the rate error in s/day;
  - that error turned into **longitude error in nautical miles after a 30-day voyage** (1 s ≈ 0.25′ of longitude). This ties the widget back to why chronometers mattered.
- **Also:**
  - a "frequency divider" diagram of the train as a counter chain (escape ÷16 teeth, …);
  - presets, including the essay's illustrative 80/75/60/16;
  - a note that the centre, third and fourth counts are estimates;
  - URL-hash state (`#cw=80&tw=75…`) so a configuration can be linked.
- **Embeds, the backlink engine:** `?embed` hides the page chrome and adds a "Made with marinechronometermodel.com" link. An "Embed this" button copies an `<iframe>` snippet. `_headers` sends no `X-Frame-Options`, so framing works; state that on purpose in `_headers` with a comment.

## 3. Downloads: `/downloads`
- **`tools/export.py`** (Playwright, `?snap&qa`, the same pattern as `social.py`):
  - loads the model, walks `__parts`, and exports per-part **STL** and a whole-movement **glTF (.glb)**. It uses r128's `examples/js` `STLExporter`/`GLTFExporter`, vendored into `vendor/` (checked against the r128 tag, with the licence noted in `vendor/README.md`) and injected only by the tool, not shipped in the page;
  - bakes the part hierarchy transforms at one frozen escapement phase;
  - converts millimetres directly, since the model's units are already mm.

  Every solid is already closed and consistently wound (`solids.py`), so the STLs are printable as-is. Add a `solids.py`-style check on the exported files.
- **Data files:**
  - `train.csv` (arbor, teeth, ratio, period);
  - `fusee-profile.csv` (turn, radius, barrel turns);
  - `escapement-cycle.csv` (`state(p)` sampled at 1000 points);
  - `escapement.js` and `train.js` as-is.
- **Output:** everything goes to `site/downloads/` with a `LICENSE.txt` (CC BY 4.0 for the model data; the code keeps its existing licence), and a `downloads.html` page listing the files with sizes and what is estimated and what is sourced. There is no email capture.
- Keep each file under Cloudflare's 25 MiB per-asset limit. Generate once and commit, like `social.png`, rather than on every build, and document it in the root README.

## 4. Build and site wiring (`build.py`)
- Replace the hard-coded essay-only branch with a `PAGES` table: `(slug, source, social png, budget)`. It drives:
  - `inline()` + `check()`;
  - `BUDGET` (each article gets about 150 KB);
  - `meta()` canonical/og tags;
  - the link rewrite `chronometer-working-model.html#…` → `./#…`;
  - the sitemap tuple (`build.py:79-82`).
- Copy `site-assets/downloads/` into `site/downloads/`.
- **Social images:** extend `tools/social.py`, or add `tools/article-social.py`, to render a 1200×630 PNG for each article from the page itself. Examples: the timing diagram for `/escapement`, the torque chart for `/fusee`. The same PNGs serve as images for forum posts.
- **Navigation:**
  - add an "Articles" group to the model's About dialog next to "Further reading" (`index.html:198`);
  - add the shared footer to the essay;
  - optionally add an `/articles` index page.
- CI (`.github/workflows/checks.yml`): add the new built pages to the `git diff --exit-code` list.

## 5. Checks
- **`tools/smoke.py`:** generalise `essay()` into `page(path)` and loop over every built page. For the widget pages, also change every input and toggle once, and fail on any console error.
- **`tools/invariants.py`:** also assert that `train.js` with the default `TRAIN` gives 60 s / 3600 s / 60 h, and that `idealFusee` applied to the model's linear spring reproduces `fuseeR` within 1e-9. This proves the article math is the model's math.
- **`node tools/escapement.js`:** still passes, since its tolerances are unchanged.
- **After the `train.js` extraction:** `solids.py`, `placements.py --diff` and `views.py --diff` should show 0 changes, `maintaining.py` should pass, and `fine.py` runs once as a precaution.
- **`python build.py --site-url https://www.marinechronometermodel.com`:** passes the budget and offline checks; then manually open each article and the embed form, and try each download (open the .glb in a viewer, and one STL in a slicer).

## 6. Order of work (one branch, separate commits)
1. `shared/figs.js` + `shared/train.js` extraction; model and essay unchanged (verified by diffs).
2. `build.py` `PAGES` table + smoke generalisation.
3. `/gear-train` first: the smallest, and the one most likely to earn links.
4. `/escapement`.
5. `/fusee`.
6. `tools/export.py` + `/downloads`.
7. Social images, navigation, sitemap, then README/CLAUDE.md/IDEAS.md status updates. Deploy per CLAUDE.md: `build --site-url…`, commit, then `npx wrangler deploy`.

## Distribution (after it's live; not code)
- Submit `/escapement` to Hacker News and Hackaday tips.
- Post `/fusee`'s design tool to r/AskEngineers and r/watchmaking.
- Offer the gear-train embed to horology and education sites.
- Add Google Search Console to watch for backlinks. The site has no analytics, and this plan adds none.
