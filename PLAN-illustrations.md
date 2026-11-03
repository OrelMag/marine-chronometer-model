# Handover: two accurate illustrations from the models

Written 2 November 2026 by the session that built `tools/penrender.py` (releases up to 3.77.00), for the session that takes this on. Read this, then the root README's
"Making illustrations", then `penrender.py`'s comments. Work in your own branch and worktree (CLAUDE.md), and ask the owner the decisions in section 5 first
(AskUserQuestion, recommended option first).

## Status (3 November 2026)

The owner's choices (section 5): the poster is the Wempe's; both pictures are for print, committed in `illustrations/` (not on the site); an
A2 poster and an A3 sheet; Caveat for the lettering; no ship. Done on branch `claude/illustrations`:
- 3.1: the Wempe's export has the Laid out clip and the rig's `laid_out` (3.79.00); the rig now shows a part hidden at rest that a control shows (the
  stand-in plates never showed, on both models: 3.79.01, RESOLVED.md "Rendering").
- 3.2, 3.3: `laidout.py --pen` (sheet A) and `penposter.py` (the poster), on `penrender.py --shots` (a page camera, size, parts alone, faded or
  hidden, the movement raised); their checks: each label on the page's own pick, each drawing on the page's outline.
- A: `illustrations/wempe-laidout-sheet-ink.jpg` and its A3 PDF.
- 3.4-3.6: the poster's centre (a cutaway: the dial, plates, lower cock and ring faded, so the leaders end on the fusee, escape wheel and balance),
  the gimbals panel (the box rolled 15° each way, the case level, the arrows the way the page turns the box) and the text (`TEXT` in the tool, each
  sentence with its sources).

## 1. The goal

The owner wants very accurate versions of two pictures:

**A. The lettered Laid out sheet, drawn in ink and wash.** Today's sheet (`laidout.py --model wempe`, in the page as `wempe/renders/laidout_sheet.webp`; a copy as the
owner sent it: `E:\mc-video\illustration-refs\wempe-laidout-sheet-3.76.01.jpg`) has the right content but the page's rendered look: the train laid out in elevation
and plan against a textbook's developed drawing ("Modern chronometer movement", Figs. 83 and 84), an isometric view with four numbered close-ups (mainspring and
fusee, maintaining power, spring detent escapement, balance and hairspring), every element lettered as the drawing letters it, and a key of what each part does.
The new version keeps every letter, view, close-up and key line, with the drawings in `penrender.py`'s ink-and-watercolour style.

**B. A poster: what makes a marine chronometer precise.** The reference is someone else's hand-drawn poster (`E:\mc-video\illustration-refs\poster-what-makes-a-chronometer-precise.jpg`;
not ours: never commit it, trace it or copy its text, and use it for its kind of layout only). Its layout: a hand-lettered title and a sentence under it; in the
middle the chronometer in its box, lid open, the bowl in its gimbal ring, the key in its holder, the movement lifted out above it with its dial; four boxed
callouts joined to the parts by curved leader lines, each with a hand-lettered heading, two or three lines of text and a small drawing with labels:
(1) the mainspring arrangement (barrel with the spring shown inside, the chain, the fusee), (2) the spring detent escapement (detent, escape wheel, rollers),
(3) the balance and hairspring (temperature compensation), (4) the box and gimbals (the bowl kept level, drawn twice with coloured arrows for the rolls).
"Very accurate" means: every drawing is the model's own geometry (no part drawn by hand or from a generic chronometer), every label points at the part it names,
and every sentence is true of the model and backed by its sources (CLAUDE.md: the manual and photographs for the Hamilton, `References/wempe/` and the Wempe
README for the Wempe; the essay's text is a good, already-sourced place to take it from).

## 2. What already exists

- **`tools/penrender.py`** (root README, "Making illustrations"): draws any page view, page link (`--link`, with `cam=`) or turned camera (`--cam`) of either model
  in the ink-and-wash style; reads the page's camera headless at the still's size and draws it in Blender (the page's world is Blender's as (x, -z, y)/1000); the
  rig poses lift, explode, laid out (Hamilton only, see 3.1) and lids (`POSE`); the parts the page shows faded are drawn as a ghost layer laid over at a third. About
  1-5 minutes a still. Its 11 Wempe plates (2 November 2026, a private artifact the owner has: https://claude.ai/artifact/RYn28BWbmdMpogQh2NdMcK) show the style.
- **`tools/laidout.py`**: renders the lettered sheet from the page (three views, close-ups, key; the letters' table `FIGS` per model) and checks it: every lettered
  element shown, out of sight only where listed (`HIDDEN`), and a real click at each letter's anchor pixel opening that element's own card. Its anchors are page
  pixels for the page's camera; reuse them (3.2).
- **The pages' views** that the poster needs: `case` (box open, bowl in its gimbals), `dial`, `exploded` (and its All: the case apart under the movement), `fusee`
  (barrel, chain and fusee, see-through plates), `escapement`, `balance`; the Hamilton's `box` and `dial`. `part=KEY` in a link fades every other part; `cam=` keeps
  a framing. The rig also has controls for roll and pitch (`blender/rig.py`: at sea), lids and the hands.
- **`tools/wempe_showcase.py`** and **`hamilton_render.py`**: photographic Cycles stills (not this style), useful for composition ideas and their framing code
  (`SHOTS`: frame chosen parts, fill a fraction of the frame).
- The page-rendered close-ups in today's sheet already show what each callout needs (the barrel see-through with its spring, the maintaining work, the detent
  with escape wheel and roller, the balance with its helical spring).

## 3. The work, in order

### 3.1 The Wempe's export has no Laid out motion (blocks A)
`wempe/js/blender.js` writes no "Laid out" clip; its header comment still says the Wempe "has no laid-out view", which stopped being true at 3.76.00. Add the clip
as the Hamilton's has it (`chronometer-working-model/js/blender.js`, the "Laid out" line: the train laid out along the barrel-fusee line, `dev`), driven by the
Wempe movement's own `develop(e)`; correct the comment; run `gltf_check.py --model wempe` and `blender_check.py --model wempe` (its `BLENDER` table in `wempe/checks.py`
names the controls to check: add `laid_out`); then put `laidout:dict(laid_out=1)` back in `penrender.py`'s `POSE['wempe']` (taken out on 2 November 2026 because
the still showed the movement whole). Check a still against the page's Laid out view side by side. A change to `blender.js` is a page change: a release.

### 3.2 Lettering and leaders over the stills (A and B)
`penrender.py` draws a page camera at the still's size, so a pixel `laidout.py` (or the page's `__proj`) finds for a part is the same pixel in the still, provided
both use the same camera and size. One catch: `penrender.py` takes out the page's pull-back for narrow canvases (`AK`, aspectK); for anchors to line up, either
render the page at the still's aspect (open it at a viewport whose canvas, not window, is that aspect) or add a switch to keep the page's distance. Then compose
in SVG (or Pillow) over the PNG: letters, leader lines, boxes, arrows, the key. Keep it a tool in `tools/` (CLAUDE.md: every picture script is tracked), for
example `penplate.py` for A and `penposter.py` for B, with a `--check` that does what `laidout.py` does: a click at each anchor opens the part it names.

### 3.3 Parts on their own (B's callouts, A's close-ups)
`penrender.py` can fade everything but one part (`part=` in a link) but cannot draw a few parts alone. Add an option (for example `--parts barrel,fusee,chain`)
that hides every other part in both layers, and `--cut KEY` to draw a part see-through (the barrel, so the mainspring shows: the Hamilton builds the mainspring
only when shown, the Wempe's export carries it; check). Frame them as `wempe_showcase.py` frames its shots, or from a page camera aimed with `__look`.

### 3.4 The poster's central drawing and the gimbals panel (B)
The box open with the movement lifted above it is a pose the page doesn't have as one view: the rig's lift lifts and turns the movement over, the reference shows
it dial up above the bowl. Pose it in Blender (lids open, the movement moved up along the bowl's axis, not turned over) and say in the tool which pose it is. The
gimbals panel: the case view rolled one way and the other through the rig's roll and pitch, with arrows drawn about the gimbal axes (the axes from
`tools/gimbals.json` / `gimbals_wempe.json`, so the arrows turn about the real pivots).

### 3.5 Text
Hand lettering: a Google font with an open licence that reads as hand lettering (choose with the owner). Write every sentence anew from the sources, never from
the reference poster: what the fusee does (the essay's fusee section), the detent escapement, the compensated balance (the Wempe's cut bimetallic rim and masses,
the Hamilton's balance as the manual has it), the gimbals keeping the bowl level (the model's gimbal periods are in the reports). Units and terms as the model
README uses them.

### 3.6 Look and check
Show the owner each picture before calling it done: a contact sheet or the PNG, and what is still off. For A, put the new sheet beside `laidout_sheet.webp` and
check every letter sits on the same part. For B, run the anchor check, and read every sentence against its source.

## 4. Pitfalls already found (so you don't find them again)

- **Lines across flat faces.** The glTF import gives every triangle its own vertices, and flat faces with holes come as long thin fans; Freestyle drew the fans as
  silhouettes. `penrender.py` welds each mesh and re-triangulates each flat region (dissolve under 0.5°, beauty). Don't turn faces "outward"
  (`recalc_face_normals`): the Hamilton's dial face is an open surface and vanished under the import's back-face culling. More than 0.5° merged the facets of large
  rings' walls.
- **Dashed contours.** Freestyle's hidden-line test breaks silhouettes on walls curving away from view; Line Art doesn't. Line Art is slow with several passes
  (three passes: 35 minutes a still; one pass: under 5), so it draws the contours only and Freestyle the heavy outline and creases.
- **The page camera into Blender.** Through the world, not the movement's frame (the importer turns the movement's axes). The page's link writes where the camera
  is going (`G`), not where it is mid-move (`C`).
- **Materials.** The Wempe's textured materials have no names (`material 11` ...): the tool tells wood by its texture's mean colour (`texwood`). Damascening reads
  as stripes in a wash: its map is left out.
- **Load.** Page checks and renders slow down a lot beside other sessions' runs; Playwright's default 30 s page load timed out once. `smoke.py --model wempe` fails
  with load-timing problems on `main` itself (7 on 2 November 2026): compare against `main` before blaming a change.
- **Time.** A Wempe export is about 3½ minutes and 180 MB; keep it (`--glb`) across runs while the geometry doesn't change.

## 5. Decisions for the owner (ask first)

1. Which model for the poster: the Wempe (the eleven plates' model, its essay tab) or the Hamilton (the reference's dial with Roman numerals is neither's)?
2. Its size and use: a page on the site, a print (which paper size and resolution), or a private artifact to share.
3. Where the finished pictures live: committed beside the model (as `wempe/renders/`), on the site, or outside the repository.
4. The hand-lettering font.
5. Whether to keep the reference's fifth element, the small ship vignette (it would have to be drawn anew; no outside image goes in).

## 6. Sizes of the work (estimates)

3.1 half a day with its checks and release; 3.2 a day (the anchors and the check are the hard part); 3.3 and 3.4 half a day each; 3.5 a few hours; renders a few
minutes each. Sheet A first: its content, letters and check exist already, and it proves 3.2 for the poster.
