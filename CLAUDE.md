# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Two static, browser-only projects about the Hamilton Model 21 marine chronometer (three.js r128 and the fonts vendored in `vendor/`; no npm, no bundler, no test suite):

- `marine-chronometer-source/chronometer-working-model/`: the interactive 3D working model. **This is the main project.** Its README documents files, coordinates, timing and sources in detail; read it before changing geometry or timing.
- `marine-chronometer-source/marine-chronometer-essay/`: an older long-form interactive essay (Ciechanowski-style). It predates the Hamilton manual; Hamilton-specific detail belongs in the working model.
- Root `chronometer-working-model.html` and `marine-chronometer.html` are published single-file copies of the two builds, fully self-contained (three.js and fonts inlined). `python build.py` at the root regenerates both, the root copies and `site/` (the upload folder, gitignored); commit the regenerated root copies with source changes. The root `README.md` is the user guide: setup, build, checks and publishing.
- `vendor/`: three.js r128 (verified against cdnjs's SRI hash) and Latin-subset woff2 fonts with their licences. Pages reference them as `../../vendor/...`; `inline.py` inlines them at build time, and the build fails if any page still loads a script, stylesheet or font from the network.
- `site-assets/`: `social.png` and `social-movement.png` (link previews for the model and essay pages, rendered by `tools/social.py`) and `_headers`, copied into `site/`.
- `References/` (gitignored) holds the source material: the 1948 NAVSHIPS 250-624 overhaul manual PDF and reference photographs.

## Build / run

From the repository root:

    python build.py                          # both projects, root copies, site/
    python build.py --site-url https://...   # also adds canonical + og:image tags to site/ pages

Open `index.html` directly in a browser for development. URL flags:
- `?snap`: disables camera/state easing so views settle immediately (for screenshots).
- `?qa`: exposes `window.__mv` (the movement group), `window.__proj` / `window.__unproj` for the verification tools.

Essay: edit `src/` and run the root build, which concatenates the pieces, closes the page and inlines the vendor files. `p1.html` opens the `<script>` tag that `p2`–`p4` continue; the pieces are not standalone files.

## Working-model architecture

- The four scripts in `js/` are classic (non-module) scripts sharing globals, loaded in order `core.js` → `movement.js` → `box.js` → `app.js`. `core.js` defines shared helpers (`TAU`, `clamp`, `lerp`, `smooth`, `$`, `sc`, materials, geometry builders) used by the later files; load order matters.
- Units are millimetres. Movement frame: dial side +y, 12 o'clock −z, 3 o'clock +x. Arbor positions live in the `L` constant at the top of `movement.js`; they come from the photo-fitting pipeline, so don't move them casually.
- Single model clock `tSim`. Balance phase `p = frac(tSim/0.5)`; `ESC.state(p)` returns balance angle, detent lift, trip-spring deflection and escape-wheel tooth progress. Escape-wheel position `E` (in teeth) drives every other arbor by a fixed ratio, so hands step in half-seconds. The movement's per-frame `mv.userData.update({E, th, lift, psDef, ...})` applies this state.
- `app.js` rebuilds the environment map on `webglcontextrestored`: a restored context loses PMREM render targets, which leaves every metal flat and dark.
- Parts are tagged with `userData.partName` (used for picking/descriptions and by the interference check); `userData.noCap` / `noShadow` / `mat0` affect cross-sections and collision filtering.
- The code is written in a dense, compact style (long one-line statements, short names). Match it when editing.

## Verification tools (`tools/`)

Python scripts (numpy, scipy, Playwright + Chromium with SwiftShader WebGL) that fitted the layout to photographs and check it. Each script opens `../index.html?snap&qa` through a `PAGE` constant resolved from its own location. Outputs (`fit.json`, `p3fit.json`, screenshots) are written to the current directory, and `unproj.py` reads the `fit.json` that `fit.py` wrote there.

- `bundle.py`: two-camera fit / triangulation of balance, fusee and barrel axes.
- `dyn.py` + `interference-check.js`: 0.4 mm voxel collision check across a full escapement cycle; only intended joints (the `IGN` set) may overlap.
- `social.py`: renders the 1200×630 link previews `site-assets/social.png` (dial) and `social-movement.png` (moving parts).
- `p3fit.py`: renders from the top-view photo camera; output in `verification/topview-comparison.png`.
- `audit.py` + `geometry-audit.js` (`audit.py box` for the box and gimbals): flags overlapping screws, screws with nothing under their seat, arbor/pin ends that sit in nothing, coplanar overlapping faces, and parts touching nothing. Screws are found through `userData.screw` (set by `screw()` in `movement.js`). Expected leftovers: the winding-stop pin and balance-screw free ends; most coplanar hits are faces in contact.

The README's "Estimated, not from the manual" section lists which dimensions/tooth counts are guesses versus sourced from the manual; keep that distinction accurate when changing the model.
