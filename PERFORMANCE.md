# Performance

What a frame of the working model costs, what was done about it (September 2026) and what is left. Measure with
`marine-chronometer-source/chronometer-working-model/tools/perf.py` (see its docstring); ideas that aren't started
live in `IDEAS.md` section 5, fixed regressions in `RESOLVED.md`.

## How it was measured

- **Browser.** Chromium through Playwright, on the machine's GPU (AMD RX 7800 XT, ANGLE / Direct3D 11), with vsync
  and the frame-rate limit off. The frame rate is therefore what a frame costs, not the display's rate.
- **Page.** 1440 × 900 at a pixel ratio of 1, with `?snap&qa`, which draws every frame.
- **Draw calls and triangles.** Counted over every pass, the shadow pass and Edges' passes included.
- **Phone.** "Phone" below means the same machine with Chrome's CPU throttling at 4×. It stands in for a phone's CPU,
  not its GPU.
- **Weak GPU.** SwiftShader (`--sw`), WebGL on the CPU. It is slow on everything, so only the relative costs mean
  anything.
- **Settings as the page opens.** Edges on and Shadows off. Before these changes, Shadows was always on and Edges was
  off on phones.

## What was found

1. **The hairspring was rebuilt through `closeGeo` every frame.** This happened in every view where the movement is
   lifted out: Movement, Train, Escapement, Balance, Fusee, Exploded and Laid out.
   - `closeGeo` string-hashes the tube's 4,500 vertices and 23,000 edges and triangulates its end caps.
   - That was 63% of the frame's CPU time: about 9 ms a frame on the desktop and 50 ms on the phone, which capped
     those views at about 15 fps there.
   - It came in with the rule that every part is a closed solid. Before that, IDEAS.md had measured the rebuild at
     0.94 ms.
2. **Shadows cost a pass over every caster.** That is about 230–380 more draw calls and every caster's triangles
   again (2M triangles a frame instead of 1.35M).
   - Every Standard shader also carries the soft-shadow code, and two more programs are compiled at start.
   - Cost: 0.4–1.1 ms a frame on the desktop, and 22% (Edges on) to 47% (Edges off) of the Dial view on the phone.
     In SwiftShader the cost was 14–22%.
3. **Edges costs two extra scene passes.** Draw calls go from 470 to 940 in the Dial view, and a frame takes 0.7–2 ms
   longer on the desktop, mostly in the JavaScript of the extra draw calls.
4. **The running model was drawn every frame, even when nothing visible moved.**
   - The balance's angle was part of the "has anything changed" signature, including in the Dial view, where the
     balance is under the dial.
   - A 120 or 144 Hz display drew 120–144 frames a second with nobody touching the page.
5. **Startup takes 1.3 s to the first frame on the desktop** (2.8 s on the phone). It breaks down as:
   - about 880 ms compiling the shader programs, synchronously, on the first frame;
   - about 170 ms building the environment map;
   - about 200 ms in `buildMovement`.
6. **Triangles.** The whole model is about 720k triangles, with no level of detail. Three parts carry 64% of them:
   - the fusee lathe, 148k;
   - the chain, 188k;
   - the 52 threaded screws, 133k.

## What was done

- **The hairspring is updated in place.** `reclose(old, g)` in `core.js` writes a freshly bent tube's positions and
  normals into the previous closed geometry.
  - `closeGeo` now records which vertex each cap vertex copies (`userData.capOf`), so the weld and the caps are kept
    and nothing is hashed again.
  - It runs only when the balance has turned. The stop-bar spring uses it too.
  - The vertices and index are identical to before; only the caps' normals differ, by at most 1.5e-6.
  - The tools that read the geometry `update()` builds (`fine.py`, `solids.py`, `illustration.py`) see the same
    shape.
- **Shadows became a Display switch, off by default.**
  - It is `shadows=1` in the URL hash, and Reset display turns it off.
  - With it off the light casts nothing: there is no shadow pass, the shaders are simpler, and the shadow map is
    freed.
  - The floor's soft shadow under the box is a texture and is always drawn.
  - `illustration.py`, `social.py`, `topview.py` and `p3fit.py` turn Shadows on, as their images were made with it.
- **Edges is on by default everywhere, phones included.** It is `edges=0` in the hash when off.
- **Fewer frames drawn when nothing visible moves.**
  - While the balance can't be seen, its swing is left out of the signature. That means the movement is in its case
    under the dial (Dial and Box views), with nothing see-through, hidden, faded or cut, and neither the walkthrough's
    inset nor the adjuster's bench showing the escapement. Only the hands' steps then draw a frame, about 4 a second
    at 1×.
  - Without input, a frame comes at most every 10 ms, so a 120 or 144 Hz display draws the running model at 60 or
    72 Hz. Input still draws at the display's rate.
  - The signature is compared with the last frame drawn, so a change made in a skipped frame is still drawn.
- **`tools/perf.py` was added.** It prints each view's frame cost as the page opens, with Shadows and without Edges,
  then the frames drawn a second when the page is left alone, and the time to the first frame.

## Results

Milliseconds a frame, as the page opens. "Before" is the old default: Shadows on, and Edges on except on phones.

| View | Desktop before | Desktop after | Phone before | Phone after |
|---|---|---|---|---|
| Dial | 2.9 | 2.3 | 14.9 | 10.9 |
| Movement | 12.5 | 2.6–3.7 | 70.7 | 13.8 |
| Escapement | 12.8 | 2.3 | | 12.6 |
| Train | 12.7 | 5.7 | | |
| Balance | 13.2 | 3.2 | | |

Blank cells weren't measured before the change.

- **Dial view left alone while running:** it used to draw every frame; now it draws about 4 frames a second.
- **Startup:** 14 programs are compiled at start instead of 16, and the first frame comes at 1.2 s instead of 1.3 s on
  the desktop.
- **Everything still passes:** `solids.py`, `fine.py` and `fine.py --hold` (0 new or grown overlaps),
  `maintaining.py`, `exploded.py`, `invariants.py`, `escapement.js` and `smoke.py`. `placements.py` found 0 of 39
  parts moved.

## Since then (3 October 2026)

The Movement view felt slower while dragging. Against `bf503d8`, with runs alternated to cancel the machine's drift
(other sessions' browser checks were running), it cost 8–17% more a frame. No single change caused it:

- **More geometry.** The fidelity work added 54 visible meshes (342 → 396) and 56k triangles in the Movement view:
  draw calls 753 → 859, doubled by Edges. The barrel alone added 6 meshes and 20k triangles; the escape bridge, train
  bridge, posts and balance added the rest. The merged drawing below is the answer.
- **`seatPawl`** went from 0.30 to 0.63 ms a frame when the pawls' outlines were resampled every 0.1 mm (`8cbb259`).
  It now tests only the points that can reach the teeth, with the same results (RESOLVED.md, Rendering): about a
  third less.
- **Not the cause.** The adjuster's bench driving the model (1.20.00) changed no draw call and runs its solver only
  at load and when a slider moves. Loading with a warm cache is faster than in September (0.70 s against 0.96 s to
  the first frame).

Measure on a quiet machine: another session's `bom.py` or `smoke.py` doubles the spread between identical runs.

## Static pieces drawn merged (3 October 2026)

The pieces under one group that share a material are drawn as one merged copy (`drawMerge` in `core.js`; the model
README, "Static pieces drawn merged", has how it works and what it leaves out). The pieces stay for the tools,
picking and every display mode; a batch draws merged only while all its pieces are shown in their own material,
and a piece that moves or is rebuilt leaves its batch. Display's Performance mode (on by default, `merge=0` in the hash
when off) turns it off: every piece then draws itself, as before.

| View (as opened) | Draw calls | ms a frame | JS in the renders |
|---|---|---|---|
| Dial | 1,099 → 623 | 2.60 → 2.01 | 2.14 → 1.47 ms |
| Movement | 859 → 509 | 2.69 → 2.06 | 1.61 → 0.91 ms |
| Escapement | 665 → 477 | 2.49 → 2.10 | 1.44 → 0.96 ms |
| Train | 947 → 637 | 2.93 → 2.37 | 1.86 → 1.21 ms |
| Box | 1,131 → 627 | 2.57 → 1.83 | 2.11 → 1.29 ms |

- `perf.py` on a quiet machine, before and after. With Shadows on, the Movement view's calls go from 1,259 to 745.
- Dragging the Movement view (60 Hz, under the profiler), the main thread is busy 404–412 ms a second instead of
  505–514: 6.7 ms a frame instead of 8.5.
- The picture is the same. `views.py` differs by 0–38 scattered pixels a view (a vertex placed in its group's frame
  rounds differently in the last bit, which moves an Edges line in a 1-pixel slot), 1 pixel with Shadows on, 0–8 in
  `isolate.py`'s views. `placements.py` finds 0 of 39 parts moved.
- `bom.py`, `audit.py` (the same findings, apart from the balance's turn), `solids.py`, `exploded.py`,
  `invariants.py` and `smoke.py` pass.
- Two things to keep. r128's shadow pass tests layers against the main camera, not the shadow camera, so a merged
  piece on layer 2 casts nothing and the copy casts for it. Several tools walk the whole scene with `traverse()`
  (`bom-check.js` counted 113 copies belonging to no line), so the copies' group stops `traverse()` at itself.

## What's next

In order of what they would save for the effort.

1. **Fewer draw calls, further** (M). The static pieces are drawn merged now (above), by parent group and material:
   562 meshes shown become 116 batches and the pieces left out. Two steps would take more:
   - **Merge across a part.** Merging by part and material instead of parent group leaves about 133 meshes. A part's
     moving subgroups (wheels, pawls, the balance) would each need their own copy, placed as they move.
   - **Keep a batch merged when one of its pieces is hidden.** A hidden or recoloured piece sends its whole batch back
     to its pieces. Merging the shown subset again (cached by which pieces are shown) would keep the gain in the modes
     that hide a few pieces (Moving parts only, the laid-out train).
2. **Fewer triangles** (M). This matters most for weak GPUs, SwiftShader and the shadow pass. Each item changes
   geometry, so re-run `fine.py` (the chain on the fusee cone is an expected contact, and `EXPECTED` may need its
   sizes retuned), `solids.py` and `exploded.py`, on its own branch. The figures are September's (the whole model
   about 720k then).
   - **Fusee lathe, 148k.** Its profile is sampled every 0.03 mm (343 points) × 216 segments (`makeFusee`). Sample the
     groove's flanks more coarsely or adaptively.
   - **Chain, 188k.** An outer link is 408 triangles and an inner link 164, with the plates' round ends at
     `curveSegments: 10`; use fewer. The instance buffers are sized for 900 links where 328 are used.
   - **Screws, 133k.** There are two lathe rings per thread pitch, so the finest screws are the heaviest: the 0.45 mm
     endstone-cap screws are 4,760 triangles each. Identical screws could share one geometry (`screw()`), which saves
     memory and upload time rather than draw calls.
   - **Small holes.** Every `absarc` gets 2 × `curveSegments` points whatever its radius, so a 0.5 mm hole in
     `discGeo` (64) or `ringGeo` (48) costs as much as a rim. The escape wheel's web (128) alone is 10k.
3. **Cheaper Edges** (S–M). The id pass re-uploads every mesh's uniforms each frame (`setId` sets
   `uniformsNeedUpdate`).
   - The box glass counts as a ghost, so an extra ghost pass and a full-size render target are kept for it in the
     Dial and Box views.
4. **Startup** (M). Shader compiling is about 880 ms of the 1.2 s to the first frame, done synchronously on the
   first frame.
   - Fewer program variants would help.
   - So would compiling in parallel through `KHR_parallel_shader_compile`. three r128 doesn't use it, so the programs
     would have to be issued before the first render.
   - The environment map takes about 170 ms.
5. **Adaptive quality** (M, IDEAS 5.5). Measure the frame time and step down: pixel ratio, then Edges. Shadows is
   already off by default.
6. **Measure on real phones.** The phone figures here come from CPU throttling on a desktop GPU. A phone's GPU and
   its thermal limits are not measured.
