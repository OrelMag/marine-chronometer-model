# The Marine Chronometer

Browser-based working models of two marine chronometers, and an essay on how a
chronometer keeps time at sea:

- **The Hamilton Model 21**, a two-day fusee chronometer with a spring detent
  escapement, made for the U.S. Navy from 1941. It is built from the 1948
  overhaul manual (NAVSHIPS 250-624) and from photographs and videos of real
  ones.
- **The Wempe Einheits-Chronometer**, the German standard chronometer (spring
  detent, fusee, three pillars), built from Wempe's works drawings. It comes in
  several versions: as first drawn, the escapement of 1943, Wempe No. 3955 as
  photographed, and the Soviet 6MX.
- **The Marine Chronometer**, a long-form interactive essay shared by both
  models. Its text follows the Model 21; its 3D figures and dial are drawn
  from the Wempe's model.

The live site is <https://www.marinechronometermodel.com>. Since 21 October 2026
the Wempe has been the home page, with the Hamilton at `/hamilton/` and the
essay at `/essay/`.

Orel Magidish (assisted by Claude Opus 5.5) – September 2026  
[orelmag@gmail.com](mailto:orelmag@gmail.com). On every page, **Report a bug or
inaccuracy** (under About, on every part's card and at the essay's end) writes
the report into an email to this address. The email includes the version, the
model's settings, the browser and the page's last errors.

| File | What it is |
|---|---|
| [`chronometer-working-model.html`](chronometer-working-model.html) | The Hamilton's model as one file: the Model 21 running in real time in its gimballed case and mounting box. It has views (Exploded, Laid out and Contacts among them), an eight-step walkthrough, cross-sections, parts to fade, hide or isolate one at a time or as a selection (Ctrl-click, or a lasso by Alt-drag; Select and Lasso on touch), winding, setting the hands, stopping and starting, the rate and timing weights, and the manual's overhaul operation by operation. Each part's card gives its Hamilton part numbers, its maker's sheet, its drawing and its STL. Its **Essay** tab links to the essay's page |
| [`marine-chronometer-source/wempe/dist/wempe-einheitschronometer.html`](marine-chronometer-source/wempe/dist/wempe-einheitschronometer.html) | The Wempe's model as one file: the same kind of page, with its own views (Train, Fusee, Balance, Laid out), its versions and variants (dials, cases), the 35-day trial, a banking screw to turn (Swing and isochronism: the depth of lock it sets, with the swing and whether the escapement still works shown live), Making it (maker's sheets; its build book of drawings was withdrawn on 29 October 2026, to be replaced by a CAD file and operation sheet per part) and Download (STL, Blender). It also has an essay of its own on its drawings (the **Its drawings** tab) |
| [`marine-chronometer-source/essay/dist/the-marine-chronometer.html`](marine-chronometer-source/essay/dist/the-marine-chronometer.html) | The essay: longitude, the balance and its spring, heat, the fusee, winding, the train, the detent, the gimbals, keeping the rate, navigating without radio and making the chronometer. The models' own code computes its live figures |

Each is a single self-contained HTML file: download it and open it in any
modern browser. It works offline and needs no server, because three.js and the
fonts are built into the file. The pages link to each other, both on the site
and in the repository.

**In Blender:** each model's panel has **Blender (.glb)** (the Hamilton's under
Making it, the Wempe's under Download). It saves the whole instrument as a
glTF 2.0 file. Every part is a named object in its hierarchy, with its
materials, and every motion the model has is an action: running, a beat in
slow motion, run down, winding, setting the hands, stopping and starting,
exploded, laid out, lifting out, the lids, the latch, at sea. **Blender rig
(.py)** saves a script. Import the file in Blender 5 (File, Import, glTF 2.0),
then open the script in the Text Editor and run it. The chronometer then runs
on the timeline at its own ratios, with controls for the wind, the hands,
explode, laid out, lift, lids, latch, roll and pitch. The Hamilton's README,
"The model in Blender", has the details.

Contents:
[Repository layout](#repository-layout) ·
[Setting up](#setting-up) ·
[Building](#building) ·
[Changing things](#changing-things) ·
[Checking your changes](#checking-your-changes) ·
[Publishing the website](#publishing-the-website) ·
[Licence](#licence)

## Repository layout

    build.py                     builds everything (see Building)
    inline.py                    inlines scripts, stylesheets, fonts and images into one HTML file (used by the builds)
    CHANGELOG.md                 the site's versions and what changed in each, newest first (read by the build; see Versions)
    changelog.py                 reads and checks CHANGELOG.md, puts the version and the list into the pages, adds a release
    deploy.py                    puts site/ live, only as a new version (wrangler.jsonc runs its check before every deploy)
    worker.js, wrangler.jsonc    the Cloudflare Worker that serves site/: its domains, and the redirects from old and other addresses
    ci.py, citrace/              the checks, run on this machine (no GitHub workflows), with their results cache and the machine's shared slots
    chronometer-working-model.html   the Hamilton's page as one file (generated by build.py: do not edit by hand)
    site-assets/                 files only the website needs: the link previews (social.png, social-wempe.png), social-movement.png (an image for posting the essay), _headers (host settings)
    site/                        the website, ready to upload (generated by build.py, committed)
    vendor/                      three.js r128 and the fonts, with their licences
    docs/motion-3d/              the method behind the moving parts' 3D viewers (kinematics, the transmission in time, stress by finite elements)
    marine-chronometer-source/
      chronometer-working-model/ the Hamilton Model 21: index.html, css/, js/, tools/ (the verification and measuring tools, for both models),
                                 verification/ (its two reports and reference renders), blender/ (the rig), dist/ (its built file); its README has the details
      wempe/                     the Wempe Einheits-Chronometer: index.html, js/, css/, checks.py (its tables for the shared tools), bom.json, dials/ (its
                                 dials as SVG), verification/ (its report), dist/; its README has the details
      essay/                     the essay shared by both models: index.html (its text and figures' markup), js/essay.js (its figures),
                                 js/hamdata.js (the Model 21's figures it quotes, from tools/essay_hamdata.py), dist/
      shared/                    scripts both models use: escapement.js (the detent escapement's solver, makeEsc), escplan.js (its plan
                                 drawing), almanac.js (the essay's nautical almanac and sight reduction), hairspring.js (the hairspring's design),
                                 contacts.js (the Contacts view), select.js (selecting parts: Ctrl-click, the lasso), kit.js (the Wempe's part and screw builders), viewer.js (the Wempe's viewer),
                                 essaykit.js (the essays' machinery)
    References/                  source material: the 1948 manual, photographs, drawings (References/wempe/: the Wempe's works drawings and
                                 their transcriptions); its README lists each file; VIDEOS.md catalogues videos of real chronometers
    CLAUDE.md                    instructions for Claude Code: how the repository works, its rules, every tool and how long it takes
    RESOLVED.md                  bugs already found and fixed, from the commit history; check it before changing a part
    OPEN-QUESTIONS.md            readings no source has settled; REQUESTS.md is the post to send owners and the NAWCC for them
    PROVENANCE.md                the Hamilton's ledger: what each part's outline, sizes and place rest on
    WEMPE-PROVENANCE.md, WEMPE-DRAWING-LEDGER.md   the Wempe's: each part against its photographs and against its drawing
    IDEAS.md, Review-results.md, PERFORMANCE.md    ideas, open review findings, frame-time measurements
    PLAN-*.md                    plans of work, each with what is done and what is left
    BOM.md                       the manual's parts list against the model, part by part (generated by the model's tools/bom.py --md)

## Setting up

You need:

- **Git**, to clone the repository.
- **Python 3.9 or later**, for the build. It uses only the standard library.
- **A browser.** Any current Chrome, Edge, Firefox or Safari works.

Clone and build:

    git clone git@github.com:OrelMag/marine-chronometer-model.git
    cd marine-chronometer-model
    python build.py --site-url https://www.marinechronometermodel.com

On macOS and Linux, use `python3` wherever these instructions say `python`.

The verification tools are optional; you need them only when you change a
model. They need more software:

- **Node.js**, for the physics tools (`escapement.js`, `dynamics.js` and the
  rest), the type check (`npx`) and deploying (`wrangler`).
- **Python packages**, and a Chromium for Playwright to drive:

      python -m pip install numpy scipy playwright opencv-python matplotlib pillow shapely
      python -m playwright install chromium

  A few tools need more: torch for the mainspring's solve, pyamg for `fea.py`,
  skyfield for the almanac's references, yt-dlp and imageio-ffmpeg for videos,
  and trimesh and its helpers for the drawings. Each tool's docstring says what
  it needs.
- **Blender 5** (optional), for `blender_check.py`, which is skipped without it.

## Building

    python build.py --site-url https://www.marinechronometermodel.com

This one command:

1. Builds the Hamilton's model into `marine-chronometer-source/chronometer-working-model/dist/chronometer-working-model.html`, the Wempe's into `marine-chronometer-source/wempe/dist/wempe-einheitschronometer.html` and the essay into `marine-chronometer-source/essay/dist/the-marine-chronometer.html`.
2. Copies the Hamilton's to the repository root.
3. Assembles `site/`, the folder you upload to a web host:
   - `index.html` is the Wempe's model, so the site opens straight into it. `hamilton/index.html` is the Hamilton's, and `essay/index.html` the essay (`/essay/#detent` opens it at a section).
   - `social-wempe.png` is the home page's link-preview image and `social.png` the Hamilton's (the dial in its box). `social-movement.png` is an image of the mechanism titled for the essay, for posting and as the essay's preview.
   - `_headers` holds security and caching headers.
   - `navships-250-624-1948.pdf` is the 1948 manual itself, from `References/`, which the pages link to.
   - `verification/build-verification/` and `verification/real-chronometers/` are the Hamilton's two reports (each check's method, results and what they mean). `wempe/verification/` is the Wempe's: *The Wempe Einheits-Chronometer: does the model hold to its drawings, and would it keep time?* (since 3.43.00 its section 9 also takes the frame, train and escapement through heat and cold, `tools/wempe_thermal_frame.js`) Each is copied as its own `build_report.py` last wrote it, with its links into the repository pointed at GitHub. The pages' About and the essays link to them.
   - `sitemap.xml` (the pages and the reports) and `robots.txt`, for search engines, when `--site-url` is given (below).

`build.py` doesn't rebuild the reports. After changing what a report reports,
rebuild it with its `build_report.py`, then build. For the Wempe's, run
`node reportdata.js`, `python geometry.py` and `python build_report.py` in its
folder.

The build fails if a page still loads a script, stylesheet, font or image from
another server. That keeps the published files working offline and in
countries where common CDNs are blocked.

The build prints where each page's bytes go (three.js, fonts, images and the
rest) and how much a visitor downloads compressed. It sets no size limit.

`--site-url` gives the site's address. With it, the pages show a picture when
the link is shared, and search engines see the canonical address. A build
without it leaves out `robots.txt` and `sitemap.xml`, so always commit builds
made with the address.

Page addresses are written without `.html`, because Cloudflare redirects
`/page.html` to `/page`. On a host that serves the `.html` address directly
(Netlify, GitHub Pages, most plain web servers), add `--keep-html`.

The addresses changed on 21 October 2026: the Wempe moved from `/wempe/` to the home
page, the Hamilton from the home page to `/hamilton/`, and the essay from the
Hamilton's Essay tab (`/#essay`) to `/essay/` (it was once a page of its own too,
`/marine-chronometer`). On the live site, `worker.js` sends `/wempe/` to
`/?from=wempe` and `/marine-chronometer` to `/essay/`. A hash never reaches the
server, so the Wempe's page itself sends the Hamilton's old links on: `/#essay=detent`
to `/essay/#detent`, and `/#part=det` and the Hamilton's own settings to `/hamilton/`.
The reports and the manual keep their addresses. `tools/sitecheck.py` serves `site/`
through `worker.js` and follows every address, old and new. On another host, add
redirects of your own if old links matter.

### Versions

The site has a version, `M.mm.pp` (3.38.00, for example). The panel's last
section, Version … · what's new, shows it with the list of changes, and
About's byline shows it too. Both come from `CHANGELOG.md` at the root, newest
first. A plain build only reads the file, so building twice gives the same
files. To make a release, name the kind of change and what changed:

    python build.py --release patch -m "The camera turns further below the model" --site-url https://www.marinechronometermodel.com

`patch` is for fixes and small changes, `minor` for new features or parts (or
a merged branch), and `major` for a milestone. The build adds the next version,
dated today, with one line for each `-m` (written for visitors), then builds as
usual. Commit `CHANGELOG.md` with the built files, and bring this README up to date
with what the release changed. The build fails if the file
is malformed: a heading that isn't `## M.mm.pp · YYYY-MM-DD`, versions out of
order, or a version with no lines.

Rebuild after every change. Commit the regenerated root copy, the `dist/`
files and `site/` with your source changes, so that they stay identical.

## Changing things

### The models

Work on the unbuilt source. It loads the files directly, so a browser reload
shows each edit:

1. Open `marine-chronometer-source/chronometer-working-model/index.html` (the
   Hamilton) or `marine-chronometer-source/wempe/index.html` (the Wempe) in a
   browser. Double-clicking the file works.
2. Edit the files in `css/` and `js/`, then reload the page.
3. Keep the browser's developer console open (F12). Errors appear there, and so
   do warnings from the geometry builders, for example a hole that crosses a
   plate's outline.
4. When it looks right, run `python build.py` from the repository root.

Useful URL flags:

- `?snap` turns off camera and state easing, so views settle at once.
- `?qa` exposes the movement and camera helpers to the verification tools.

For example: `index.html?snap&qa`.

If you open a page from a local web server instead of the file, start the
server at the repository root. The pages read `../../vendor/`, so the server
must be able to reach it:

    python -m http.server 8000
    # then open http://localhost:8000/marine-chronometer-source/chronometer-working-model/

The Hamilton's [README](marine-chronometer-source/chronometer-working-model/README.md)
explains how its code is organised. Its "Modifying the model" section walks
through common changes: a part's shape, a new part, gear ratios, the dial, the
walkthrough, views and materials. The Wempe's
[README](marine-chronometer-source/wempe/README.md) says how each of its parts
was read off its drawings. Its dimensions are in `wempe/js/dims.js`, each with
its drawing's number. It loads the Hamilton's `core.js` and the shared
`kit.js` and `viewer.js`. Its section "The page's capabilities against the
Hamilton's" lists what was ported and what was left out.

Every outline, size and place is measured first, on a photograph, a video
frame, a manual figure or a works drawing, never drawn by eye. The code comment
beside it names its source. Each model's README has an "Estimated" section
listing what no source shows.

Some scripts in `marine-chronometer-source/shared/` are used by both models
and the tools, so a change to one reaches all of them:

- `escapement.js` holds the escapement's solver, `makeEsc`. The Wempe's is
  `makeEsc(settings, base)` against the Hamilton's settings. After changing it,
  `tools/escgolden.js` must still match: it holds the Hamilton's results bit
  for bit.
- `escplan.js` holds its plan drawing, `drawEscPlan`, used by the walkthrough's
  inset, the adjuster's bench and the essay.

The essay's sky sections (rating the chronometer by the Sun, longitude by
chronometer, the lunar distance, an almanac to print) compute with `ALM` in
`shared/almanac.js`. `tools/almanac.js` checks it against JPL Horizons and
skyfield; the Hamilton's README, "The almanac", says how and how well.

### The essay

The essay is shared by both models and has a page of its own,
`marine-chronometer-source/essay/`:

- Its text and figure markup are in its `index.html`, and its styles in the
  Hamilton's `css/essay.css`.
- Its figures are in `js/essay.js`. It builds the Wempe's movement from the
  Wempe's own scripts and lends it to each 3D figure as it draws: the dial, the
  balance and hairspring, the fusee, the maintaining work, the train, the
  escapement and the box. The figures use the models' Edges, off with
  `?edges=0`; the models' Essay tabs pass that on when their Edges are off.

Open `essay/index.html` to work on it; a reload shows each edit. Numbers come
from two places:

- The Wempe's numbers that a figure shows are `data-live` spans, filled in live.
- The Model 21's numbers that the text quotes are `data-ham` spans, from
  `js/hamdata.js`. `tools/essay_hamdata.py --write` works them out on the
  Hamilton's page. Run it after changing the Hamilton's escapement, train,
  balance or hairspring; `ci.py` checks it.

The Hamilton's README, "The essay", explains the rest. The Wempe's own essay
(its **Its drawings** tab) is `wempe/js/essay.js` and the `<article id="essay">`
in `wempe/index.html`. Its data that only Node can work out is in
`wempe/js/essaydata.js`, written by `tools/wempe_essaydata.js --write`.

### Tracing by hand

Outlines the model is built from can be traced by hand on a photograph or a
video frame, with the Edge Tracer:

- **On a computer**: open
  `marine-chronometer-source/chronometer-working-model/tools/tracer.html` in
  Chrome or Edge. Open the image, click along an edge, and press **?** for the
  keys. **Save** writes `NAME.trace.json`; keep it in `tools/traces/`.
- **On a phone or tablet**: open the private copy on claude.ai,
  <https://claude.ai/artifact/Ju3PQ8QErkH3fdRWZcSLjq> (only its owner can open
  it). Claude measures parts itself (below), so tracing is optional: when you
  offer to trace, Claude puts the frames there with a note on what to trace. To
  open one, choose **Panel**, then **From Claude**, then **Open**.
  - Tap to add a point.
  - To place one precisely, hold, then slide (a ring and the magnifier show
    where it goes), then lift.
  - Drag a point to move it. Pan with one finger and pinch with two.
  - **Fine** makes drags and aiming move a quarter as far as the finger.
  - The bar at the bottom has the keyboard's actions (Done, Insert, Delete
    point, Corner, Close curve).

  When done, tap **Send to Claude**. Claude reads the trace from there and
  saves it in `tools/traces/`.

The same file runs in both places. After changing `tracer.html`, Claude
rebuilds the phone copy with `tools/tracer_artifact.py` and publishes it to the
same link.

Claude measures parts itself with the `measure-trace` skill
(`.claude/skills/measure-trace/`), whose engine is `tools/mfgfit.py`. The skill
snaps a trace onto the image's edge and fits it as machined lines, arcs and
drilled holes.

## Checking your changes

The tools are in `marine-chronometer-source/chronometer-working-model/tools/`,
for both models: most take `--model wempe` for the Wempe. Run them from that
folder; they write their output files into it. [CLAUDE.md](CLAUDE.md) lists
every tool, what it checks and how long it takes. Before committing a change:

1. **Past fixes.** Look up the part, control or build step in
   [RESOLVED.md](RESOLVED.md), so an old bug doesn't come back.
2. **Build.** `python build.py --site-url https://www.marinechronometermodel.com`
   at the root must finish without errors.
3. **Console and arithmetic.** Run these two; both print `ok`:
   - `python smoke.py` clicks through every control of the model, then opens
     the essay's page, scrolls it and works every control in it. It fails on
     any console error or warning.
   - `python invariants.py` checks the hands against the time, the wind
     indicator, and the fusee's and the balance's figures.
4. **Geometry**, if you changed any part:

       python isolate.py PART --ref IMAGE   # the part alone beside a photograph or frame of a real one: compare them before going on
       python fine.py       # collisions at 0.05 mm, through the escapement, round the train and over the wind, plus the barrel's margins (exit code 1 on anything new)
       python fine.py --hold    # the same with the balance locking arm locked and the train-blocking screw down
       python maintaining.py    # the fusee's maintaining work over run and wind cycles (exit code 1 on a failure)
       python views.py before   # (before the change) renders every view; after it: python views.py after, then python views.py --diff before after
       python solids.py     # every part a closed solid, facing out (exit code 1 on a failure)
       python exploded.py   # no two parts meet in the Exploded view, at any spread (exit code 1 on a failure)
       python overhaul.py   # every operation of the manual's overhaul takes its parts off, or puts them on, clear of the rest
       python holecheck.py  # every hole has something in it, or a reason it is empty on the real movement
       python seatcheck.py --model wempe  # every pin, screw, stud and pipe held in a hole of another part, not lying in a slot or buried in solid metal
       python placements.py dump before   # (before the change) every mesh's place in seven states; after it: dump after, then --diff before after
       python audit.py      # screws, pivots, loose parts in the movement (exit code 1 on anything not expected; --update after an intended change of coplanar faces)
       python audit.py box  # the same for the box and gimbals
       python bom.py        # every part against the parts list: counts, how each is held and runs, the gears, the jewels (--md rewrites BOM.md)
       python contacts.py --write   # after changing fine.py's tables: the Contacts view's data
       python gltf_check.py     # the export to Blender, written and read back
       python blender_check.py  # that file in Blender 5 headless (skipped without one): the rig against the export's own clips
       npx -p typescript@5.9.3 tsc -p ../jsconfig.json   # the types of the files that start with // @ts-check

   What each should print:
   - `fine.py` prints `ok` on every line. Its table `EXPECTED` gives the
     reason for each intended contact.
   - The `views.py` diff shows changed pixels only on the parts you changed.
     The `placements.py` diff lists only the parts you rebuilt.
   - `solids.py` prints `0 not solid` twice. `exploded.py` and `overhaul.py`
     print `0 failing`.
   - `audit.py` ends with `OK: nothing new`. It compares its findings with the
     expected ones: the loose ends in its `LOOSE` table, each with its reason,
     and the coplanar faces, mostly faces in contact, in `audit-expected.json`.
   - `seatcheck.py` ends with `0 failing`; a piece held another way on the real
     chronometer too is printed `~~` with its reason (`SEAT_EXPECTED`).
   - `bom.py` prints `ok` (a press fit at most 0.02 mm open, a tapped hole 0.1;
     `MC_BOM_IN` tries other limits); a known deviation, with its reason, is printed with
     `~~`. After changing a part, run `python bom.py --md` and commit the
     regenerated `BOM.md`.
5. **Timing and physics**, if you changed the escapement, balance, springs,
   fusee or train. These are Node.js tools: `node escapement.js` (the
   escapement against the manual's figures), `node escgolden.js`,
   `node physics.js`, `node dynamics.js`, `node tripping.js` and
   `node gearing.js`. For the Wempe, run `node wempe_escapement.js` and the
   other `wempe_*.js` tools. Several write a golden JSON file with `--write`;
   without it, they fail if that file is stale. The reports then need
   rebuilding (see Building).
6. **Preview images.** If a model's appearance changed, re-render them with
   `python social.py` (`social.py wempe` for the Wempe's), then rebuild. If the
   Wempe's box, gimbals, fusee, escapement, train or balance changed, look over
   the essay's figures too: they are built from its model's code.
7. **Frame time**, if you changed the render loop, a rebuilt part, or what is
   drawn. `python perf.py` prints each view's frame cost, draw calls and
   triangles with the page's settings, with Shadows and without Edges, and how
   often the page draws when left alone. It runs on your GPU with vsync off;
   `--throttle 4` slows the CPU to about a phone's. Compare it with a run from
   before the change.
8. **All the checks at once.** `python ci.py` at the root runs them here and
   prints each step `ok` or `FAIL`, with its logs in `ci-logs/`. It runs about
   a hundred steps for both models, side by side (up to 12 at once, 3 with a
   browser), in about 20 minutes. Among them is the build with the live
   address, which fails if building changes a built copy (commit what it
   writes). The options:
   - `--quick` runs the steps without a browser.
   - `--full` adds the slow ones (`fine.py`, `bom.py`, the full physics runs,
     `fea.py`, the Blender export).
   - `--views` renders every view before and after the branch and prints the
     changed pixels.
   - `--only a,b` runs those steps.
   - `--plan` lists what would run, and the changed input behind each step.
   - `--no-cache` runs everything.
   - `--changed` runs only the steps that read a file the branch changed since
     `main`.
   - `--fail-fast` stops at the first failure.

   A step that passed is skipped (`cached`) while every file it read is
   unchanged, in this worktree or any other. `citrace/` traces each step's
   reads, and `.git/ci-cache/` keeps its pass. Runs in several worktrees share
   the machine's cores through `.git/ci-slots/` (`MC_CI_CPU`,
   `MC_CI_BROWSERS`), so a second run queues instead of slowing the first.
   Nothing runs on GitHub.

   Choose the checks by what the change can break:
   - Text no check reads (ledgers, plans, READMEs, comments) needs only the
     build.
   - A page's strings or controls need the build, the type check and
     `smoke.py` (and `sitecheck.py` if `site/` changed).
   - Timing or physics needs the tools that compute it and their golden files.
   - Geometry needs `python ci.py --full` (with `--views` if anything drawn
     changed).
   - A change to `ci.py`, the shared scripts or several areas needs
     `python ci.py`.
9. **Record fixes.** If the change fixes a bug, add it to
   [RESOLVED.md](RESOLVED.md) under the right heading, with the commit hash.
10. **Commit** the source and the regenerated built copies together. Work on a
    branch. Merge it into `main` with `git merge --no-ff` once its checks pass,
    and push every branch to GitHub.

## Publishing the website

The website is a folder of static files (`site/`): no server code, no
database. Any static host can serve it. The files are self-contained, so a
visitor's browser fetches only these few files, from the host alone.

### The live site

The site is live at https://www.marinechronometermodel.com, a Cloudflare Worker
that serves `site/` as static files. `wrangler.jsonc` at the root describes it,
with its custom domains; `worker.js` redirects every other address
(https://marinechronometermodel.com, https://marinechronometer.orelmac.workers.dev
and plain `http://`) to the main one, keeping the path. To update it (Node.js provides `npx`; the first run opens a
browser window to log in to Cloudflare):

    python build.py --release patch -m "what changed" --site-url https://www.marinechronometermodel.com
    git commit -am "Release ..."      # CHANGELOG.md and the built files
    python deploy.py

Each deploy is a release with its own version (see [Versions](#versions)), and
this is enforced. `deploy.py` (and `wrangler.jsonc`, which runs `deploy.py
--check` before any `npx wrangler deploy`) rebuilds with the live address and
refuses when:

- the rebuild changes anything, or anything that goes live is uncommitted;
- the live page has the same version but different contents (make a release first), or a newer one;
- the version's git tag already marks another commit;
- the live page can't be read to compare.

The same version with the same page passes, so the Worker alone can be
redeployed. After a deploy, `deploy.py` tags the commit `vM.mm.pp`; push it
with `git push origin main --follow-tags`. Pushing to GitHub doesn't deploy it. The steps below are for setting up a new
site elsewhere.

### A new site: Cloudflare Pages

It's free, has unlimited bandwidth on the free plan, serves from hundreds of
cities worldwide, and works with a private GitHub repository. Cloudflare
occasionally renames dashboard items; the steps below describe what to look for.

**First upload (about ten minutes):**

1. Create a free account at https://dash.cloudflare.com/sign-up.
2. Choose a project name, for example `marine-chronometer`. The site's address
   will be `https://marine-chronometer.pages.dev` (if the name is taken, pick
   another and use it in the next step).
3. Build with that address:

       python build.py --site-url https://marine-chronometer.pages.dev

4. In the dashboard, open **Workers & Pages**, choose **Create**, then the
   **Pages** tab, then **Upload assets** (Direct Upload). If you're offered a
   Worker first, look for the Pages option.
5. Enter the project name from step 2 and create the project.
6. Drag the **`site` folder** (the folder itself, not the files inside it, and
   not the whole repository) onto the upload area, and click **Deploy site**.
7. Open `https://marine-chronometer.pages.dev`. The Wempe's model loads as the home
   page; the Hamilton's is at `/hamilton/` and the essay at `/essay/`.

**Later updates:** rebuild with the same `--site-url`, open the project in the
dashboard, choose **Create deployment**, and drag `site/` in again. Each
deployment is kept, so you can roll back from the project's Deployments list.

**Updating from the command line instead** (needs Node.js, which provides
`npx`):

    python build.py --site-url https://marine-chronometer.pages.dev
    npx wrangler pages deploy site --project-name marine-chronometer

The first run opens a browser window to log in to Cloudflare.

**Automatic deploys on every push (optional):**
1. In the project, choose to connect it to GitHub and authorise access to the
   repository.
2. Set the build command to
   `python build.py --site-url https://marine-chronometer.pages.dev`.
3. Set the build output directory to `site`.

If the build log says Python can't be found, add an environment variable
`PYTHON_VERSION` with the value `3.11`.

**Your own domain (optional):** buy one (Cloudflare Registrar sells them at
cost, from about US$10 a year), then add it under the project's **Custom
domains**. Rebuild with `--site-url https://your-domain` and upload again, so
link previews use the new address.

**Check the link preview:** paste the address into https://www.opengraph.xyz.
It should show the Wempe in its box, with the page's title and description.

### Alternatives

- **Netlify Drop:** open https://app.netlify.com/drop and drag the `site`
  folder onto the page. You get an address immediately; create a free account
  to keep it and to rename it (`https://<name>.netlify.app`). Then rebuild with
  that `--site-url` and drag the folder in again. The free plan includes
  100 GB of traffic a month.
- **GitHub Pages:** free only for public repositories (this one is private).
  If you make it public:
  1. Commit a copy of `site/` in a `docs/` folder.
  2. Under **Settings → Pages**, choose **Deploy from a branch**, then `main`,
     then `/docs`.
  3. The address will be `https://orelmag.github.io/marine-chronometer-model/`.
- **Anywhere else:** upload the contents of `site/` to the web root of any
  hosting that serves plain files, such as a university or museum web server,
  or Amazon S3 with CloudFront.

The single `chronometer-working-model.html` file also works on its own. You can
email it, put it on a USB stick or attach it to a course page; it runs from the
file with no connection.

## Licence

- **Code:** MIT; see [`LICENSE`](LICENSE).
- **Text, drawings, diagrams and the model's design:**
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Anyone may share
  and adapt them with credit.
- **Third-party files in `vendor/`** keep their own licences: three.js is MIT,
  and the fonts are under the SIL Open Font License. See
  [`vendor/README.md`](vendor/README.md).
- **Source material:** the 1948 NAVSHIPS 250-624 manual is a U.S. government
  publication. The photographs and drawings in `References/` belong to their
  owners and are kept for reference; they are not covered by the licences above.
