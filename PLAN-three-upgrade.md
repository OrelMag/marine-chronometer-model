# Moving the pages off three.js r128

Written 11 November 2026 on `claude/three-upgrade`, with a working pilot on the Wempe's page. The owner chose "plan and pilot the three.js upgrade" that day (Wempe first). Nothing here is merged or released.

The aim is what r128 cannot draw: jewels and glass that let light through and bend it, blued steel coloured by its oxide film, and shading where parts meet. IDEAS.md 4.1-4.3 has the background.

## What the pilot shows

The Wempe's page runs on three.js r187 with no console error or warning. Three things were proved.

1. **The page still opens from disk as classic scripts.** r187 ships ES modules only. A small script, `vendor_three.py`, joins the two published files into one classic script that sets the global `THREE`. Nothing in three's code is edited.
2. **What isn't meant to change, doesn't.** Of the Wempe's 1,582 meshes, 1,548 are the same solids vertex for vertex. 24 are the same solids with 4 fewer triangles each. 6 differ in the last digit of a rounding. 4 (the movement ring's two versions, seen twice) differ by 0.05 mm³ in 20,438. The views with Moving parts only differ from r128's by 4 to 615 pixels in 960,000 (one view 6,648), each a tone on an upward flat face. The whole movement's views differ by 12,000 to 28,000 pixels for the same reason, the plates' flat tops a few levels yellower (no pixel in the Movement view is more than 48 levels of 255 away but 56). The views through glass differ by 58,000 and 74,000: the glass, which is meant to change (below). `views.py` counts a pixel as changed past 24 levels.
3. **The gains are real.** Glass is clear and its print reads black, not grey. A jewel is a red stone you see the pivot hole through. Blued steel takes its blue from a film 80 nm thick, and thinner films give violet and straw, the order of the temper colours. Contact shading sets the pillars and cocks on their plate.

The cost: 2.5 to 4.5 ms more a frame on this machine's GPU, and 136 KB more of three.js in the page.

## The target release

**r187** (npm `three@0.187.0`, the current release on 11 November 2026).

- Going straight to the newest release means one retuning of the look, not two. r181 and r187 both changed how the environment lights a metal (the migration guide's entries for each).
- The official guide advises steps of ten releases, because deprecation warnings last ten. That is for code that uses much of the API. This code uses 67 names, and the pilot found every break by running the page. The guide's entries were read from r128 to r187 (`https://github.com/mrdoob/three.js/wiki/Migration-Guide`), and each break below names the release it came in.
- The WebGPU build (`three.webgpu.js`) is not used. `WebGLRenderer` stays: the page's shader patches (`patchSection`, `makeInk`) are GLSL.

## How it is vendored and loaded

- `vendor/three-r187/three.core.min.js` and `three.module.min.js` are cdnjs's files, byte for byte. `vendor_three.py` checks them against cdnjs's SHA-512 integrity hashes, as `three.min.js` was checked. cdnjs's unminified files are the npm tarball's, hash for hash.
- `python vendor_three.py` writes `vendor/three.r187.js` (739 KB; r128's `three.min.js` is 603 KB). Each module's body goes unchanged into a function of its own. Its import list becomes a destructuring of the core's exports. Its export list becomes the object returned. The result is assigned to `globalThis.THREE`, as the old UMD build did.
- `python vendor_three.py --check` fails if a hash is wrong or the written file is stale. It belongs in `ci.py` and `selfcontained.py` at stage 1.
- A page loads it with `<script src="../../vendor/three.r187.js"></script>`. `inline.py` and `build.py` need no change: the built page carries it inline and loads nothing from the network.
- The script refuses a release whose files have another shape (an import or export it does not know), so a later release fails loudly, not silently.
- Addons (`examples/jsm`, for example `OrbitControls`) can be wrapped the same way, reading their imports off the global. The script has the hook (`ADDONS`); none is used yet.

**Rejected:**

- *An import map with a `data:` URL, or `<script type="module">`.* Chromium does not load modules from `file://`, so the pages would no longer open from disk. A module also runs after the classic scripts that need `THREE`.
- *`build/three.cjs`.* In r187 it is 631 bytes that `require` the module build, and it is marked for removal.
- *Staying on r160, the last release with a global build.* It has transmission, iridescence and anisotropy, but it is three years old and its build is unsupported. The wrapper makes any release usable.
- *A bundler or npm.* The repository has neither, by design.

## Breaking changes that touch this code

Each was found by running the Wempe's page on r187, or by reading the guide. "Done" means done on the pilot branch.

| Change (release) | Where | What to do |
|---|---|---|
| `outputEncoding` is `outputColorSpace`; `Texture.encoding` is `colorSpace`; `sRGBEncoding` is `SRGBColorSpace` (r152) | `core.js`, `movement.js`, `app.js`, `viewer.js`, `essay.js`, `essaykit.js`, the Wempe's `case.js`, `dial.js`, `escapement.js`, `essay.js`, `frame.js`: 20 places | Done: `srgbTex(t)`, `isSrgbTex(t)`, `outSRGB(r)` in `core.js`, which work on both releases. |
| Colour management is on by default (r152) | `sc()` in `core.js` already makes each sRGB hex linear by hand | Done: `THREE.ColorManagement.enabled=false`, so every colour is as before. Turning it on later would mean `sc=h=>new THREE.Color(h)` and a check of every `Color` made without `sc` (lights, the environment's panels). No visible gain. |
| Light intensities are physical; the legacy mode is gone (r155) | 9 lights: `viewer.js`, `app.js` (both models), `essay.js`, `essaykit.js`, `hamilton-parts/index.html` | Done for all but the parts page: each directional and hemisphere light times π (`LK`). The environment map is unchanged. |
| `updateWorldMatrix()` skips an object whose matrix was set by hand unless `matrixWorldNeedsUpdate` is set (r185) | The Wempe's `fusee.js`: the chain's hooks (`place`, and the laid chain's `h.matrix.copy`) | Done: the flag is set. Without it the drum's chain slot was cut 60° away and the barrel's volume was 3.2 mm³ out. `movement.js` (the Hamilton's crook and hook) decomposes its matrix, so it is unaffected; check it at stage 3. |
| `ExtrudeGeometry` drops points within 1e-10 of their neighbour (after r128; the guide does not list it) | `extrude()` in `core.js`, which counts the side walls to turn the holes' walls | Done: `extrude()` drops the same points before counting. Without it it printed "side walls not as counted" and left 6 extrusions with a hole's wall wound into the metal (the gimbal ring's and the box's `WN-400` pieces, the lid's stay, a chain link). |
| `LatheGeometry` gives each quad's second triangle as (c, d, b), not (b, c, d) (after r128; not listed) | Every cutter that clips a turned solid cut after cut (`facePocket`, the bores) | Done: `core.js` restores r128's order under r187. Without it 35 meshes were the same solids with other vertices. Better later: make the cutters independent of triangle order. |
| The triangulator (Earcut) is a newer version | `solidGeo`, `polyGeo` and everything through `ShapeUtils.triangulateShape` | Open: only the movement ring came out differently (0.05 mm³, 213 fewer unique vertices). Either accept it and regenerate what is derived from that mesh, or keep r128's Earcut in `kit.js`. |
| `transmission` refracts and draws a second pass (r131 on) | `M.glass`, `M.clear`, `M.ruby` (`core.js`), `M.glassW` (`case.js`) | Done as the new look (`look3`). With r128's values the glass is a milky veil: 12 % of a white diffuse surface, which r128 hid in its alpha. |
| A transmissive material's fragment shader declares `projectionMatrix` itself (with real transmission, r131 on) | `patchSection` in `core.js`, which declares it for a cut face's depth | Done: not declared again for a transmissive material on r187. `smoke.py --model wempe` found it: every section failed to compile on the glass and the jewels (259 console errors). |
| `envMapIntensity` no longer dims `scene.environment` (r163) | `RUBY` in `core.js` (0.25) | Done by the new look, which doesn't need it. With `look=128` the ruby is brighter than on r128. |
| `PCFSoftShadowMap` is deprecated; `PCFShadowMap` is soft (r182) | `viewer.js`, `app.js` | Done: `SHADOW_SOFT`. Shadows (Display) not compared yet. |
| `iridescenceThicknessRange` is `iridescenceThicknessMaximum` (r187 warns) | new code only | Done. |
| WebGL 1 is gone (r163) | `SEC_DEPTH` tests `GL_EXT_frag_depth`; `extensions:{fragDepth:true}` | Works as it is (`gl_FragDepthEXT` is still defined). The WebGL 1 branches can go at stage 5. Chromium's SwiftShader has WebGL 2, so the tools run. |
| Default radial segments rose (r148) | every `CylinderGeometry`, `CircleGeometry`, `TorusGeometry`, `RingGeometry` call | Nothing found: the mesh comparison shows no solid changed, so each call gives its segments. Check the Hamilton the same way. |
| `setViewport` and `setScissor` no longer scale by pixel ratio with a render target bound (r187) | the essay's shared renderer (`r.inkPR`, `r.inkBS`), `select.js` | Not checked. The Wempe's essay tab loads and smoke passes; compare its figures' pixels at stage 2. |
| `OrbitControls` is a module only (r148) | `hamilton-parts/index.html`, the two motion-3d viewers | Not done. They keep their own r128 files until wrapped as an addon. |
| PMREM and indirect specular were improved (r181, r187) | every metal | Accepted: upward flat faces differ by 3 to 20 levels of 255. Retune if wanted. |

Checked and unaffected: the shadow pass still tests layers against the main camera (`drawMerge`'s layer 2); raycasts all pass `recursive`; the other `onBeforeCompile` patches (`#include <dithering_fragment>`, `diffuseColor`, `outgoingLight`, `vClipPosition`, `gl_FragDepthEXT`) compile; an override material skips the transmission pass, so the Edges pass's ids cost nothing more; `webglcontextrestored` rebuilds the environment as before (not exercised).

## The pilot's new look

In `core.js`'s `look3`, on r187 only, and off with `look=128` in the address. All values are estimates set by eye on 11 November 2026.

- **Glass:** all of the light through, index 1.52, its reflection at a quarter strength, perfectly smooth. No thickness: with one, what lies under the glass is drawn shifted by refraction and off its own Edges lines.
  - **A fault to settle before stage 6:** in the Dial and Box views the fine print of the sub-dials and the thin hands read paler than on r128. Close up they are crisper and blacker. three reads the scene behind a transmissive surface from a copy through a smoothing filter, which softens lines a pixel wide. A flat crystal gains nothing from refraction, so it should stay drawn by alpha, as r128's stand-in does (a small shader patch: opacity plus the reflection's brightness), and transmission be kept for the jewels. Not built.
- **Ruby:** clear corundum, index 1.77, red by absorption over 0.5 mm. No glow of its own.
- **Blued steel:** steel under an oxide film, index 2.4, 80 nm, matched to the seconds hand of Wempe 3955 (`1_Wempe_3955_Z.jpg`). On that photograph the seconds and up-and-down hands are blued; the hour and minute hands are gilt. The pale steel tempered at 310° (`M.blue310`) keeps its photographed grey.
- **Contact shading** (`ao=1` in the address): worked out on the Edges pass's own normals and depths, so it costs one full-screen pass and no pass over the model. It does not need the upgrade; it would run on r128 too. It is not light transport: it darkens lit and shaded alike.

## Numbers

Measured on this machine (RX 7800 XT), 1440 × 900, `perf.py --model wempe`.

| View, as opened | r128 | r187 pilot | Draw calls | Triangles |
|---|---:|---:|---|---|
| Dial | 12.8 ms | 14.3 ms | 495 → 713 | 3.29 M → 4.92 M |
| Movement | 11.9 ms | 14.9 ms | 391 → 559 | 2.34 M → 3.50 M |
| Train | 11.6 ms | 15.6 ms | 467 → 596 | 2.46 M → 3.21 M |
| Case | 11.7 ms | 16.2 ms | 495 → 713 | 3.29 M → 4.92 M |

- The added draw calls and triangles are the transmission pass: the opaque scene drawn once more whenever glass or a jewel is on screen. r187 without it was not measured apart.
- First frame: 24.8 s and 25.0 s (the build of the model, not three). Programs compiled: 13 and 21. JS heap: 462 MB both.
- Left alone, the page draws 57 and 62 frames a second on r128, 50 and 51 on the pilot.
- three.js in the page: 603 KB to 739 KB (about 150 KB to 190 KB compressed, estimated from the ratio; the build prints the real figure).

## Order of work

Each stage ends with its checks passing and can be released on its own.

1. **Vendoring.** Merge `vendor_three.py`, the upstream files and `three.r187.js`. Add `vendor_three.py --check` to `ci.py` and `selfcontained.py`. No page loads it yet. *Checks: the build, `ci.py --quick`.*
2. **The shared code on both releases.** Merge the two-release helpers in `core.js` and the fixes that are right on r128 too (`matrixWorldNeedsUpdate`, `extrude()`). The pages still load r128. *Checks: `ci.py` in full, `--views`: every view must diff to 0 px, since r128 is still what draws.*
3. **The Wempe's page on r187, the old look** (`look3` off by default). *Checks: `ci.py --full` for the Wempe's steps; the mesh comparison (make it a tool, `tools/meshdiff.py`, from the pilot's script); `views.py` against stage 2 with the differences explained; `photocompare.py` on Wempe 3955's seven views; `perf.py`; `gltf_check.py` and `blender_check.py --model wempe`; `sitecheck.py`.* Regenerate what is derived from meshes and has moved (`contactdata.js`, `audit-expected.json`, the inertia and gimbal JSONs if their rounding moves), each diff read first.
4. **The essay and the Hamilton's page on r187.** The essay draws the Wempe's scripts, so it follows at once. *Checks: `smoke.py`, `essay_hamdata.py`, the Hamilton's mesh comparison, `ci.py --full`.* Then wrap `OrbitControls` and move the parts page and the two motion-3d viewers.
5. **Remove r128** (`three.min.js`, the r128 branches of the helpers, the WebGL 1 branches). Update `vendor/README.md`, the root README, CLAUDE.md's "three.js r128".
6. **The new look**, a piece at a time, each with its before and after: glass, jewels, blued steel, then contact shading. This is where the owner's choices lie.

## Risks

- **Phones.** The transmission pass redraws the opaque scene. Set `renderer.transmissionResolutionScale` to 0.5, or make jewels transmissive only in close views. Measure with `perf.py --throttle 4` and on a real phone before stage 6.
- **Golden files.** Anything hashed or counted off a mesh can move with the triangulator. The pilot found one mesh. The Hamilton has not been compared.
- **Other sessions.** `core.js` and `viewer.js` change often on `main`. Stages 1 and 2 are small and should land soon after they start; a long-lived branch will conflict.
- **The look drifting.** Stage 3 keeps the old look so that one release changes the library and another the look. A single release doing both could not be checked.
- **Blender.** The export has its own materials (`blender.js`), so the new look does not reach it. Its geometry goes through the same solids, which the mesh comparison covers.
- **Not exercised in the pilot:** Shadows on, the section's cut faces, the drawing (ink) mode, the essay's figures, a lost WebGL context, the export, the versions (first drawn, 3955, 6MX, 1943), dark mode. `smoke.py --model wempe` clicks through most of them for errors, not for looks.

## Later

- Anisotropy for the plates' striping (`MeshPhysicalMaterial.anisotropy`, r153).
- Dispersion in the jewels (r164).
- Colour management on, if a wide-gamut display is ever a target.
- WebGPU: not before the shader patches are rewritten as nodes.

## Decisions for the owner

1. All pages at once, or the Wempe first (stages 3 then 4)? The pilot ran the Hamilton's page and the essay on r187 from temporary copies with no console error, so both are close.
2. How far may the new look depart from the present one? The glass and blued steel change what a visitor sees first.
3. Contact shading: on by default, a Display option, or left out?
4. The movement ring's mesh: accept the new triangulation, or keep r128's triangulator?
5. The 2.5 to 4.5 ms a frame: acceptable on desktop; on phones the jewels may need to stay as they are.
