# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Two static, browser-only projects about the Hamilton Model 21 marine chronometer (three.js r128 and the fonts vendored in `vendor/`; no npm, no bundler, no test suite):

- `marine-chronometer-source/chronometer-working-model/`: the interactive 3D working model. **This is the main project.** Its README documents files, coordinates, timing and sources in detail; read it before changing geometry or timing.
- `marine-chronometer-source/marine-chronometer-essay/`: an older long-form interactive essay (Ciechanowski-style). It predates the Hamilton manual; Hamilton-specific detail belongs in the working model. One exception: the detent figure (F7 in `src/p4.js`) uses the model's own escapement solver, `makeEsc` in `marine-chronometer-source/shared/escapement.js`.
- Root `chronometer-working-model.html` and `marine-chronometer.html` are published single-file copies of the two builds, fully self-contained (three.js, fonts and images inlined). The model's own `build.py` writes `dist/chronometer-working-model.html` (committed); the root build runs it. `python build.py` at the root regenerates both, the root copies and `site/` (the upload folder, committed); commit the regenerated root copies and `site/` with source changes. The root `README.md` is the user guide: setup, build, checks and publishing.
- `vendor/`: three.js r128 (verified against cdnjs's SRI hash) and Latin-subset woff2 fonts with their licences. Pages reference them as `../../vendor/...`; `inline.py` inlines them at build time (plus local `<img>` files, such as the model's `img/what-makes-it-precise.webp` shown in the Illustration tab), and the root build fails if any page still loads a script, stylesheet, font or image from the network.
- `site-assets/`: `social.png` and `social-movement.png` (link previews for the model and essay pages, rendered by `tools/social.py`) and `_headers`, copied into `site/`.
- `References/` holds the source material: the 1948 NAVSHIPS 250-624 overhaul manual PDF, reference photographs and drawings. Its README lists each file, what the model took from it and its original filename.
- `RESOLVED.md` lists bugs already found and fixed (from the commit history), grouped by area, each with what to keep true. Read the relevant section before changing a part, control or build step, and don't reintroduce anything listed. When a change fixes a bug, add an entry in the same commit, under its heading, with the hash (entries for uncommitted fixes go under "Fixed, not yet committed"). `IDEAS.md` holds ideas and `Review-results.md` open review findings; neither belongs in `RESOLVED.md`.

## Build / run

From the repository root:

    python build.py                          # both projects, root copies, site/
    python build.py --site-url https://...   # also adds canonical + og:image tags to site/ pages (or set SITE_URL)
    python build.py --site-url https://... --keep-html   # for hosts that don't redirect /page.html to /page

The live site is https://www.marinechronometermodel.com, a Cloudflare Worker serving `site/` (`wrangler.jsonc`); `worker.js` redirects the bare domain, the old workers.dev address and plain http to it. Pushing doesn't deploy it: build with `--site-url https://www.marinechronometermodel.com`, commit, then `npx wrangler deploy`.

Open `marine-chronometer-source/chronometer-working-model/index.html` directly in a browser for development. URL flags:
- `?snap`: disables camera/state easing so views settle immediately (for screenshots), and draws every frame (without it the loop skips frames in which nothing shown changed; see the README).
- `?qa`: exposes `window.__mv` (the movement group), `__proj` / `__unproj` (movement frame ↔ screen pixels for a given camera), `__cam(yaw,pitch,dist,fov)` / `__look(yaw,pitch,dist,x,y,z)` (set the camera) and `__camInfo()` (print it) for the verification tools and `social.py`, plus `__parts` (the parts registry), `__r` (the renderer) and `__renders()` (frames drawn).

Essay: edit `src/` and run the root build, which concatenates the pieces, closes the page and inlines the vendor files. `p1.html` opens the `<script>` tag that `p2`–`p4` continue; the pieces are not standalone files.

## Working-model architecture

- The four scripts in `js/` are classic (non-module) scripts sharing globals, loaded in order `core.js` → `../shared/escapement.js` → `movement.js` → `box.js` → `app.js`. `shared/escapement.js` declares only `makeEsc` (both pages declare their own `TAU`/`D2R`), and exports it for Node too. `core.js` defines shared helpers (`TAU`, `clamp`, `lerp`, `smooth`, `$`, `sc`, materials, geometry builders) used by the later files; load order matters.
- Units are millimetres. Movement frame: dial side +y, 12 o'clock −z, 3 o'clock +x. Arbor positions live in the `L` constant at the top of `movement.js`; they come from the photo-fitting pipeline, so don't move them casually. The main heights are the constants beside it (`TB_U`, `TB_T`, `BB_T`, `CK_T`, `EY`, `LB_T`, `BAL_Y`), measured on a side photograph; the README's layout section says which heights are measured and which are fitted for clearance.
- Single model clock `tSim`. Balance phase `p = frac(tSim/0.5)`; `ESC.state(p)` returns balance angle, detent lift, trip-spring deflection and escape-wheel tooth progress. Escape-wheel position `E` (in teeth) drives every other arbor by a fixed ratio, so hands step in half-seconds. The movement's per-frame `mv.userData.update({E, th, lift, psDef, ...})` applies this state.
- `app.js` rebuilds the environment map on `webglcontextrestored`: a restored context loses PMREM render targets, which leaves every metal flat and dark.
- Parts are tagged with `userData.partName` (used for picking/descriptions and by the interference check); `userData.noCap` / `noShadow` / `mat0` affect cross-sections and collision filtering.
- The code is written in a dense, compact style (long one-line statements, short names). Match it when editing.

## Verification tools (`tools/`)

Python scripts (numpy, scipy, Playwright + Chromium with SwiftShader WebGL) that fitted the layout to photographs and check it. Each script opens `../index.html?snap&qa` through a `PAGE` constant resolved from its own location. Outputs (`fit.json`, `p3fit.json`, `unproj.json`, `bundle.npy`, `r_*.png` screenshots) are written to the current directory, and `unproj.py` reads the `fit.json` that `fit.py` wrote there. The committed JSON files (`p3map.json`, `cock_outline.json`, `engr.json`) are traced photo data the model was built from, not tool output to regenerate.

- `fit.py` / `unproj.py`: fit the camera of the Fig. 2 photograph to the model, then unproject photo points onto the movement at known heights.
- `bundle.py`: two-camera fit / triangulation of balance, fusee and barrel axes.
- `solve.py` (no browser): places the arbors from the measured Fig. 2 positions and the centre distances the wheel radii require; re-run it after changing a tooth count.
- `dyn.py` + `interference-check.js`: 0.4 mm voxel collision check across a full escapement cycle; only intended joints (the `IGN` set) may overlap.
- `fine.py` + `fine-interference.js`: the same idea at 0.05 mm, over the escapement phases, 15 train positions (whole teeth apart) and wind states including full wind and winding; it also tests the chain's links and the tube springs. Pairs in its `EXPECTED` table are intended contacts, each with its reason and a size limit; anything new or grown fails (exit code 1). Run it after any geometry change: dyn.py missed four overlaps of 0.1–0.4 mm that this one found (RESOLVED.md, going train and winding). Expected entries include a pin that grazes the bevel of its train-bridge hole (the sustaining pawl's arbor), the chain links on the fusee cone and the chain's end fittings. `--dense` adds 101 balance phases; `--split` shows the split-balance variant and fails on open finding 9. It tests the barrel's open wall as the solid it encloses, and `barrel-clearance.js` measures (to about 0.002 mm) how close every other part comes to the solid the whole barrel sweeps (wall, caps, cap screws, hook), and where the mainspring lies inside; the tightest is the third wheel, 0.150 mm below the cap screws. `--eval JS` runs code after loading: a variant, `__mv.userData.R.timing(3,3)`, or a planted fault to prove a check. The dial face is the one open surface not tested.
- `maintaining.py`: drives the movement through run and wind cycles and checks the maintaining work: the sustaining ratchet never turns back (except its fall to the pawl as winding starts), the sustaining spring is loaded in running and only relaxes while winding, the fusee catches forward when the key lets go, the pawls sit on their teeth, and the stop-bar meets the winding stop at full wind. Run it after touching the fusee, the maintaining work or `update()`.
- `views.py`: before/after evidence for a change. `python views.py before`, change, `python views.py after`, then `python views.py --diff before after` lists the changed pixels per view (every view button, with and without "Moving parts only", model frozen, labels hidden; an unchanged model diffs to 0 px) and writes `r_vd_*.png` with the changes in red. `--keep parts --look yaw pitch dist x y z` renders close-ups of chosen parts. Every changed patch should be on the part you changed.
- `escapement.js` (Node.js, no browser): builds `ESC` with `makeEsc` from `shared/escapement.js` (centre distance from `movement.js`'s `L`) and reports lock, let-off, overall, drop, roller shake and horn clearance against the manual's figures (Sec. VIII, Ops. 84–88, 97). `node escapement.js rT=0.29` tries a setting without editing; exits 1 if any figure is out of tolerance.
- `social.py`: renders the 1200×630 link previews `site-assets/social.png` (dial) and `social-movement.png` (moving parts).
- `p3fit.py`: renders from the top-view photo camera into `r_p3.png`; the committed reference result is `verification/topview-comparison.png`.
- `audit.py` + `geometry-audit.js` (`audit.py box` runs `geometry-audit-box.js` for the box and gimbals): flags overlapping screws, screws with nothing under their seat, arbor/pin ends that sit in nothing, coplanar overlapping faces, and parts touching nothing. Screws are found through `userData.screw` (set by `screw()` in `movement.js`). Expected leftovers: the winding-stop pin and the free ends of the balance screws and timing weights' screws; most coplanar hits are faces in contact.

The README's "Estimated, not from the manual" section lists which dimensions/tooth counts are guesses versus sourced from the manual; keep that distinction accurate when changing the model.
