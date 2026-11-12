# Moving the pages off three.js r128

Written 11 November 2026 on `claude/three-upgrade`, with a working pilot on the Wempe's page. The owner chose "plan and pilot the three.js upgrade" that day (Wempe first), then decided the rollout from the pilot's report (below). Stage 1, the Wempe's page on r187 with the present look, is prepared on the branch for landing. The sections down to "Later" are the pilot's record; where stage 1 changed something, the row or line says so.

The aim is what r128 cannot draw: jewels and glass that let light through and bend it, blued steel coloured by its oxide film, and shading where parts meet. IDEAS.md 4.1-4.3 has the background.

## What the pilot shows

The Wempe's page runs on three.js r187 with no console error or warning. Three things were proved.

1. **The page still opens from disk as classic scripts.** r187 ships ES modules only. A small script, `vendor_three.py`, joins the two published files into one classic script that sets the global `THREE`. Nothing in three's code is edited.
2. **What isn't meant to change, doesn't.** Of the Wempe's 1,582 meshes, 1,548 are the same solids vertex for vertex. 24 are the same solids with 4 fewer triangles each. 6 differ in the last digit of a rounding. 4 (the movement ring's two versions, seen twice) differ by 0.05 mm³ in 20,438. The views with Moving parts only differ from r128's by 4 to 615 pixels in 960,000 (one view 6,648), each a tone on an upward flat face. The whole movement's views differ by 12,000 to 28,000 pixels for the same reason, the plates' flat tops a few levels yellower (no pixel in the Movement view is more than 48 levels of 255 away but 56). The views through glass differ by 58,000 and 74,000: the glass, which is meant to change (below). `views.py` counts a pixel as changed past 24 levels.
3. **The gains are real.** Glass is clear and its print reads black, not grey. A jewel is a red stone you see the pivot hole through. Blued steel takes its blue from a film 80 nm thick, and thinner films give violet and straw, the order of the temper colours. Contact shading sets the pillars and cocks on their plate.

The cost: 2.5 to 4.5 ms more a frame on this machine's GPU, and 150 KB more of three.js in the page (before compression).

## The target release

**r187** (npm `three@0.187.0`, the current release on 11 November 2026).

- Going straight to the newest release means one retuning of the look, not two. r181 and r187 both changed how the environment lights a metal (the migration guide's entries for each).
- The official guide advises steps of ten releases, because deprecation warnings last ten. That is for code that uses much of the API. This code uses 67 names, and the pilot found every break by running the page. The guide's entries were read from r128 to r187 (`https://github.com/mrdoob/three.js/wiki/Migration-Guide`), and each break below names the release it came in.
- The WebGPU build (`three.webgpu.js`) is not used. `WebGLRenderer` stays: the page's shader patches (`patchSection`, `makeInk`) are GLSL.

## How it is vendored and loaded

- `vendor/three-r187/three.core.min.js` and `three.module.min.js` are cdnjs's files, byte for byte. `vendor_three.py` checks them against cdnjs's SHA-512 integrity hashes, as `three.min.js` was checked. cdnjs's unminified files are the npm tarball's, hash for hash.
- `python vendor_three.py` writes `vendor/three.r187.js` (756,979 bytes; r128's `three.min.js` is 603,445). Each module's body goes unchanged into a function of its own. Its import list becomes a destructuring of the core's exports. Its export list becomes the object returned. The result is assigned to `globalThis.THREE`, as the old UMD build did.
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
| The triangulator (Earcut) is a newer version | `solidGeo`, `polyGeo` and everything through `ShapeUtils.triangulateShape` | Accepted by the owner (11 November 2026): only the movement ring came out differently (0.05 mm³ in 20,438, 213 fewer unique vertices). No check's stored figure moved with it at stage 1. |
| `transmission` refracts and draws a second pass (r131 on) | `M.glass`, `M.clear`, `M.ruby` (`core.js`), `M.glassW` (`case.js`) | Stage 1: a material made with transmission is a `GlassA` on r187, which draws r128's alpha and no second pass. With r128's values real transmission makes the glass a milky veil: 12 % of a white diffuse surface, which r128 hid in its alpha. Real transmission is kept for the new look's jewels (`look3`). |
| A transmissive material's fragment shader declares `projectionMatrix` itself (with real transmission, r131 on) | `patchSection` in `core.js`, which declares it for a cut face's depth | Done: not declared again for a transmissive material on r187. `smoke.py --model wempe` found it: every section failed to compile on the glass and the jewels (259 console errors). |
| `envMapIntensity` no longer dims `scene.environment` (r163) | `RUBY` in `core.js` (0.25) | Done at stage 1: `envOwn` gives a material that dims its environment the scene's map as its own. A tinted or faded copy of the ruby keeps the map it was cloned with, so after a lost context it reflects the old one until it is next made. |
| `PCFSoftShadowMap` is deprecated; `PCFShadowMap` is soft (r182) | `viewer.js`, `app.js` | Done: `SHADOW_SOFT`. Compared at stage 1 with Shadows on: the same picture. |
| `iridescenceThicknessRange` is `iridescenceThicknessMaximum` (r187 warns) | new code only | Done. |
| WebGL 1 is gone (r163) | `SEC_DEPTH` tests `GL_EXT_frag_depth`; `extensions:{fragDepth:true}` | Works as it is (`gl_FragDepthEXT` is still defined). The WebGL 1 branches can go at stage 5. Chromium's SwiftShader has WebGL 2, so the tools run. |
| Default radial segments rose (r148) | every `CylinderGeometry`, `CircleGeometry`, `TorusGeometry`, `RingGeometry` call | Nothing found: the mesh comparison shows no solid changed, so each call gives its segments. Check the Hamilton the same way. |
| `setViewport` and `setScissor` no longer scale by pixel ratio with a render target bound (r187) | the essay's shared renderer (`r.inkPR`, `r.inkBS`), `select.js` | Not checked. The Wempe's essay tab loads and smoke passes; compare its figures' pixels at stage 2. |
| `OrbitControls` is a module only (r148) | `hamilton-parts/index.html`, the two motion-3d viewers | Not done. They keep their own r128 files until wrapped as an addon. |
| A rough surface's reflection is bent toward its normal by roughness⁴, not roughness² (after r128; not listed). PMREM and indirect specular were also improved (r181, r187) | every metal | Done at stage 1: the bend was what made the plates' flat tops 3 to 20 levels darker and yellower. `core.js` puts r128's bend back in three's shader chunk, at ^1.7 (fitted). The filter's own shape is left as r187 has it. |
| A Phong or Lambert material is lit by `scene.environment` too (after r128; not listed) | `drawOf` in `core.js`: the tinted and the ink drawing | Done at stage 1: the drawing's material leaves three's `lights_fragment_maps` out on r187. With it the wash's bands were 20 levels lighter on 48,849 pixels of the Movement view. |
| An sRGB texture is decoded by the GPU before it is filtered (r152 on); r128's shader decoded the filtered sample | every `srgbTex` texture: the dial's print, the engraving | Done at stage 1: `SRGB_LATE` has three decode in the shader, as it does for a video's texture. Without it fine black print came out thinner and paler (10,549 pixels of the Dial view; 651 with it). |

Checked and unaffected: the shadow pass still tests layers against the main camera (`drawMerge`'s layer 2); raycasts all pass `recursive`; the other `onBeforeCompile` patches (`#include <dithering_fragment>`, `diffuseColor`, `outgoingLight`, `vClipPosition`, `gl_FragDepthEXT`) compile; an override material skips the transmission pass, so the Edges pass's ids cost nothing more; `webglcontextrestored` rebuilds the environment as before (exercised at stage 1: lost and restored once, the picture the same to the pixel).

## The pilot's new look

In `core.js`'s `look3`, on r187 only. Since stage 1 it is off, on with `look=187` in the address, and holds the ruby and the blued steel only: the glass stays drawn by alpha and contact shading is out of the code until its own release (commit `65b8e86f` has it), as the owner decided. All values are estimates set by eye on 11 November 2026.

- **Glass:** all of the light through, index 1.52, its reflection at a quarter strength, perfectly smooth. No thickness: with one, what lies under the glass is drawn shifted by refraction and off its own Edges lines.
  - **A fault to settle before stage 6:** in the Dial and Box views the fine print of the sub-dials and the thin hands read paler than on r128. Close up they are crisper and blacker. three reads the scene behind a transmissive surface from a copy through a smoothing filter, which softens lines a pixel wide. A flat crystal gains nothing from refraction, so it should stay drawn by alpha, as r128's stand-in does (a small shader patch: opacity plus the reflection's brightness), and transmission be kept for the jewels. Not built.
- **Ruby:** clear corundum, index 1.77, red by absorption over 0.5 mm. No glow of its own.
- **Blued steel:** steel under an oxide film, index 2.4, 80 nm, matched to the seconds hand of Wempe 3955 (`1_Wempe_3955_Z.jpg`). On that photograph the seconds and up-and-down hands are blued; the hour and minute hands are gilt. The pale steel tempered at 310° (`M.blue310`) keeps its photographed grey.
- **Contact shading** (`ao=1` in the address): worked out on the Edges pass's own normals and depths, so it costs one full-screen pass and no pass over the model. It does not need the upgrade; it would run on r128 too. It is not light transport: it darkens lit and shaded alike.

## Numbers

Measured on this machine (RX 7800 XT), 1440 × 900, `perf.py --model wempe`. These are the pilot's, with its new look on; stage 1 draws no transmission pass (its own figures are in its section below).

| View, as opened | r128 | r187 pilot | Draw calls | Triangles |
|---|---:|---:|---|---|
| Dial | 12.8 ms | 14.3 ms | 495 → 713 | 3.29 M → 4.92 M |
| Movement | 11.9 ms | 14.9 ms | 391 → 559 | 2.34 M → 3.50 M |
| Train | 11.6 ms | 15.6 ms | 467 → 596 | 2.46 M → 3.21 M |
| Case | 11.7 ms | 16.2 ms | 495 → 713 | 3.29 M → 4.92 M |

- The added draw calls and triangles are the transmission pass: the opaque scene drawn once more whenever glass or a jewel is on screen. r187 without it was not measured apart.
- First frame: 24.8 s and 25.0 s (the build of the model, not three). Programs compiled: 13 and 21. JS heap: 462 MB both.
- The built Wempe page (`site/index.html`): 5,706,658 bytes to 5,868,472; compressed (gzip -9) 2,463,091 to 2,507,280, 44 KB more to download. `build.py`'s size line counted three.js as `three.min.js`'s size; corrected at stage 1.
- The root build passes on the pilot: nothing loaded from the network, and `laidout.py --write` drew the lettered sheet on r187 with every element in view and opening its own card. The built copies and `site/` are not committed on the branch.
- Left alone, the page draws 57 and 62 frames a second on r128, 50 and 51 on the pilot.
- three.js in the page: 603,445 bytes to 756,979 (gzip -9: 148,739 to 188,313).

## Order of work

Each stage ends with its checks passing and can be released on its own.

The owner's rollout (below) takes stages 1 to 3 together as the first release, for the Wempe's page ("Stage 1 as prepared for landing"). Then stage 4, then 5. Then stage 6 a piece a release: the jewels, the blued steel, and contact shading as a Display option that is off by default. The glass stays as it is.

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
- **Not exercised in the pilot, exercised at stage 1:** Shadows on, the tinted and ink drawing, the essay's figures (on r128), a lost WebGL context, the export, the versions (first drawn, 3955, 6MX, 1943), dark mode, see-through. The section's cut faces were only clicked through by `smoke.py --model wempe`, for errors, not compared for looks.

## Later

- Anisotropy for the plates' striping (`MeshPhysicalMaterial.anisotropy`, r153).
- Dispersion in the jewels (r164).
- Colour management on, if a wide-gamut display is ever a target.
- WebGPU: not before the shader patches are rewritten as nodes.

## The owner's decisions (11 November 2026)

From the pilot's report and stills:

1. **Rollout.** The library first, with the present look, on the Wempe's page. Then the essay and the Hamilton. The new look afterwards, one piece a release.
2. **The new look, once the library is in.**
   - Refracting jewels: yes. Off on phones if the frame cost needs it.
   - Blued steel by its oxide film: yes.
   - Glass: kept as it is now. The flat crystal is drawn by alpha, with no transmission on it.
   - Contact shading: a Display option, off by default.
3. **The movement ring's mesh:** the new triangulation is accepted.

## Stage 1 as prepared for landing (11 November 2026)

The owner's rollout joins the plan's stages 1 to 3 for the Wempe: the vendored library, the shared code on both releases, and the Wempe's page on r187 with the present look. The Hamilton's page and the essay stay on r128.

### What "the present look" took beyond the pilot

All of it is in `core.js` and runs on r187 only (`T3`).

- **Glass by alpha** (`GlassA`, `physMat`). r128's transmission was a stub: alpha = 1 - transmission + the reflection's luminance. On r187 a material made with transmission is a `GlassA`: three sees transmission 0, so there is no transmission pass, and the shader applies r128's alpha. `opq()` counts its `trA`. This is also the owner's choice for the glass, so it stays.
- **sRGB textures decoded after filtering** (`SRGB_LATE`). r128 decoded each sample in the shader. r187 has the GPU decode before filtering, which draws fine black print thinner and paler when small. That, not transmission alone, was most of the pale print the pilot reported. The setting leans on three's video-texture path (`isVideoTexture`, an empty `update`); check it at each upgrade.
- **The reflection's bend** (`envmap_physical_pars_fragment`, patched as text). Before it reads the environment, three bends a rough surface's reflection toward its normal: by roughness² in r128, by roughness⁴ in r187. On a gilt plate (roughness 0.35 to 0.42) that moved the studio's top lamp off the flat tops, which came out darker and yellower, and flattened the 6MX's stripes. `core.js` puts the bend back at roughness^1.7. The exponent is fitted on four views (Movement, Side, Escapement, the 6MX's Movement): pixels past 16 levels, of their 3.84 million, 24,111 at ^2 and 9,649 at ^1.7; past 24 levels 323 and 263. The first try, the top lamp 1.3 times brighter with r187's own bend, left 91,177 and 28,739; it is gone, and the lamps are r128's. If three's chunk no longer holds the text patched, the page logs an error, which `smoke.py` fails on.
- **The ruby's dimmed environment** (`envOwn`): r187's `envMapIntensity` dims only a material's own map, so the ruby is given the scene's.
- **The tinted and ink drawing lit by the lamps alone** (`drawOf`): r187 lights a Phong material from the scene's environment too, which washed the bands out. Its material leaves three's `lights_fragment_maps` out.
- **A texture's `encoding`** still works on r187 (a shim on `Texture.prototype`), so a script not yet moved to `srgbTex` needs no edit. The Wempe's `escapement.js` is as `main` has it for that reason.
- **Left out of stage 1:** contact shading (it changed the Edges pass's shader on every page; it is in commit `65b8e86f`, for its own release). The new look (`look3`: jewels, blued steel) stays in `core.js` behind `look=187` in the address, off.

### The look against r128

`views.py --model wempe`, r128 (`main`) against the branch, pixels past 24 levels of 255 in each view's 960,000:

| View | Whole movement | Moving parts only |
|---|---:|---:|
| Box | 25 | 89 |
| Dial | 11 | 9 |
| Movement | 11 | 0 |
| Escapement | 196 | 89 |
| Plan | 1 | 1 |
| Side | 57 | 9 |
| Case | 2 | 89 |
| Transport box | 28 | 89 |
| Exploded | 1 | 1 |
| Laid out | 51 | 51 |

811 pixels in the 20 views' 19.2 million. With the pilot's look off it was 12,000 to 28,000 a view for the whole movement. The four 89s are one picture (a view whose button is off in Moving parts only keeps the Escapement's).

- **Escapement, 196:** the hairspring's coils, a patch 17 by 16 pixels. Its top edges catch the lamp a few levels bluer (blue +3 on average). The cause is in the environment's reflection, not the lamps (it stays with the lamps off and goes with the environment off). It is not the mip the environment is read at, nor the bend (both tried). Not pinned down further.
- **Laid out, 51:** one column of pixels on the barrel's outline, an Edges line a pixel over.
- **Side, 57:** a pillar's highlight a touch brighter.
- The rest are single pixels on outlines.

Looked at in the same way, r128 against the branch (pixels past 24 levels, a 1200 × 800 still):

| State | Pixels |
|---|---:|
| Shadows on, Movement and Dial | 9, 11 |
| Dark mode, Movement and Dial | 11, 11 |
| Coloured by source, Movement and Dial | 0, 3 |
| See-through | 101 (the hairspring's glints, as above) |
| As first drawn, Movement and Escapement | 5, 196 |
| Wempe 3955, Movement and Dial | 9, 11 |
| The 6MX, Movement, Dial and Box | 10, 6, 0 |
| 1943, Movement and Escapement | 6, 196 |
| After a lost and restored WebGL context, Movement and Dial | 11, 11 |
| Tinted drawing, Movement, Dial, Escapement | 4,092, 8,128, 9,288 |
| Ink drawing, Movement, Dial, Box, Escapement | 5,903, 10,572, 2,986, 13,806 |

- The context was lost and restored once (counted by the canvas's two events); the picture after is the picture before to the pixel.
- The tinted and ink drawings differ by the pen's own noise and no more: its pressure is random at each load. r128 loaded twice differs from itself by 3,954, 7,762 and 11,215 (tinted) and 5,832, 10,490, 2,861 and 16,090 (ink).
- The section's cut faces were clicked through by `smoke.py`, not compared for looks.

### The meshes

1,582 meshes on the page. 1,548 are the same vertex for vertex. 24 are the same solid with 4 fewer triangles (r187's `ExtrudeGeometry` drops a repeated point). 6 differ in the last digit of a rounding. 4 are the movement ring's (two versions, seen twice): 0.05 mm³ in 20,438, the newer triangulator, accepted by the owner.

The same triangulator reaches one generated file. **`wempe/js/fuseebody.js` was made again** (`wempe_fusee_body.py`, whose `--check` failed on r187): the fusee body's tube has two flat end faces with holes, split into triangles otherwise now. The new file has the same 25,398 corners, each bit for bit, and 50,632 of its 50,808 triangles. The other 176 lie in those two faces (y −16.875 and −8.625) and cover the same 66.137145 and 44.8396 mm². Volume 4011.054 mm³, as before. No other stored figure moved.

### The essay's page, still on r128

It loads `report.js`, `vendor/three.min.js` (r128), `core.js`, `shared/kit.js`, the Wempe's `dims.js`, `frame.js`, `train.js`, `escapement.js`, `shared/escapement.js`, `escphys.js`, `fuseebody.js`, `fusee.js`, `dialface.js`, `dial.js`, `case.js`, `movement.js`, `essaydata.js`, `shared/escplan.js`, `shared/almanac.js`, its own `hamdata.js` and `essay.js`.

Of these the branch changes `core.js`, the Wempe's `frame.js`, `fusee.js`, `dial.js`, `case.js` and `movement.js`, `essay.js` and `fuseebody.js`. On r128 every change is the same call under another name (`srgbTex`, `outSRGB`, `SHADOW_SOFT`, `physMat`, a light times 1), a branch not taken (`T3`), or a flag r128 already honours (`matrixWorldNeedsUpdate`).

Proved by pixels: `main`'s essay and the branch's, each under a paused clock and a seeded `Math.random`, each of the 17 figures photographed (9.27 million pixels).

- Before the fusee body was made again (two runs of `main`, three of the branch): every figure the same to the pixel in at least one pair of a `main` run and a branch run. 13 are the same in every pair. Four change between two runs of the same page too, by their animations' timing, which the harness doesn't pin.
- With the new fusee body (two more runs of the branch): the same, but for the maintaining work's figure, which looks through the fusee: 73 pixels differ, none by more than 3 levels of 255. (A fifth figure, the escapement in plan, a 2D drawing, was caught at another moment in one run and matched in the other.)
- `smoke.py` works every control of it.

### Frame cost

No transmission pass is drawn, so the cost over r128 is three's own.

Not measured again: `perf.py` (the machine was running three other check runs; the pilot's table above is with its transmission pass).

### Checks, as printed (11 November 2026, through `ci.py --only`, the machine loaded)

Passed on the stage's code with the new fusee body:

- `vendor-three`, `selfcontained` (ok), `types`, `wempe-types` (no error), `wempe-sheetcheck` (712 sheet figures on 77 parts: 658 inside their limits and where the audit found them, 54 kept departures, 0 outside, 0 moved, 0 not found).
- `smoke` (ok; it includes the essay's page), `wempe-smoke` (ok).
- `wempe-solids` (0 not solid), `wempe-exploded` (81 bodies, 658 pairs, 0 failing), `wempe-holecheck` (1630 holes over 5 states, 1481 populated, 33 expected empty, 0 failing), `wempe-seatcheck` (508 pieces over 5 states, 501 seated, 3 expected, 0 failing).
- `wempe-fine`, `-first`, `-6mx`, `-1943` (ok; the dial's face 0.180 mm clear), `wempe-bom` (278 lines, 302 relations, 12 jewels: ok), `-first` (300 relations), `-6mx` (308 relations, 20 jewels), `wempe-maintaining` (ok).
- `wempe-gltf` (0 failures), `wempe-blender` (passed).
- `wempe-fusee-body` (up to date, the new file), `wempe-fusee-end` (0 over 0.01 mm²), `wempe-fusee-check` (every figure within the sheet's tolerance), `wempe-book` (236 sections, 0 findings), `wempe-dialsvg`, `wempe-recipes-site`.
- The Hamilton's page, on r128 with the shared code: `solids` (0 not solid), `audit`, `audit-box` (nothing new), `exploded` (84 bodies, 0 failing), `invariants` (ok), `holecheck` (942 holes, 0 failing), `essay-hamdata` (up to date).

Still to run, or to run again, when this was written: `wempe-audit` with its versions and boxes, `wempe-exploded-first`, `-3955`, `-6mx`, `-1943`, `wempe-fine-3955`, `wempe-fine-band`, `wempe-bom-3955`, `wempe-bom-1943`, `wempe-inertia`, `wempe-inertia-6mx`, `wempe-massprops`, `wempe-invariants`, `wempe-mechanisms`, `wempe-assembly`, `wempe-stopwork`, `wempe-recipes`; then the build, `wempe-laidout` and `sitecheck`. `wempe-audit` passed before the fusee body was made again.

Every failure so far was one thing: `Page.goto: Timeout 30000ms exceeded`. The Wempe's page took 26 s to load on the loaded machine, on r128 and on r187 alike (measured back to back, 26.2 s each), and the tools wait 30 s. Each such step passed when run again.

### Paused here (11 November 2026, the owner's word): what remains before stage 1 can land

The check run was stopped; nothing is running. The steps that passed are in `ci.py`'s shared cache and are skipped while their inputs stay the same.

1. **Checks not yet passed, by name** (`python ci.py --browsers 2 --only` with the list):
   - `wempe-audit`, `wempe-audit-first`, `wempe-audit-3955`, `wempe-audit-6mx`, `wempe-audit-1943`, `wempe-audit-box`, `wempe-audit-box-first`, `wempe-audit-box-1943`. (`wempe-audit` passed before the fusee body was made again; since then it has failed once, on the page's load passing 30 s.)
   - `wempe-exploded-first`, `wempe-exploded-3955`, `wempe-exploded-6mx`, `wempe-exploded-1943`.
   - `wempe-fine-3955`, `wempe-fine-band`, `wempe-bom-3955`, `wempe-bom-1943` (`wempe-bom-1943` failed three times on the load's 30 s, never on a finding).
   - `wempe-inertia`, `wempe-inertia-6mx`, `wempe-massprops`, `wempe-invariants`, `wempe-mechanisms`: these will say whether a stored figure moves with the meshes. None has run on r187 yet.
   - `wempe-assembly`, `wempe-stopwork`, `wempe-recipes`.
2. **Merge `origin/main`** once the Wempe's discharge-stone change is on it (`claude/wempe-reread`: `wempe/js/escapement.js`, `shared/escapement.js`, `wempe/checks.py` and the generated Wempe tables, none of which this branch changes). Run again whatever that merge leaves uncached.
3. **The build:** `python build.py --site-url https://www.marinechronometermodel.com`, the built copies, `site/` and `wempe/renders/laidout_sheet.*` committed. It renders the lettered Laid out sheet on r187 (about 20 minutes on the loaded machine) and will note that the assembled sheet is older than the page. The pilot's build passed; stage 1's has not been run.
4. **`wempe-laidout` and `sitecheck`**, after the build.
5. **`perf.py --model wempe`**, r128 against stage 1, on a quiet machine. Stage 1 draws no transmission pass, so the pilot's 2.5 to 4.5 ms more a frame should not stand; this is not measured.
6. **The section's cut faces**, looked at against r128 (`tools/pagecmp.py shots` with a section on, then `pixels`). `smoke.py` clicks through them for errors only.
7. The release, the root README's last touches and the deploy are the coordinator's, after landing.

### Landed (12 November 2026): what the remaining steps found

On `claude/three-land` (this branch with `origin/main` at 3.86.01 merged in, no conflict), compared throughout with 3.86.01, the last release on r128 (a worktree of the tag).

1. **Checks:** `python ci.py --full --browsers 2`: 161 of 161 steps ok (34 from the cache), the machine otherwise quiet. No step failed, on a load's 30 s or otherwise.
2. **The build** with the live address, the Laid out sheet drawn on r187 and looked at: every view, close-up and letter as before.
3. **The solids, part by part** (`tools/geomdiff.py`, made that day; it compares each parts-list line's volume, volume centroid and surface area, whatever the triangles, in one stated pose, in all five versions): of 194-222 lines, two lines' solids differ and 49-52 more are the same solid cut into other triangles.
   - `050800-3`, the movement ring: 0.0545 mm³ less in 20,438.6 (0.0021 on the 6MX's): the newer triangulator, accepted by the owner (above).
   - `050701-3`, the mainspring's hook block inside the drum: its surface 0.003 mm² less in 65.9, its volume the same to 0.0001 mm³. Not looked into further (a sliver in a bored cap, by its size); `solids.py` passes it on both.
4. **Frame cost** (`perf.py --model wempe`, 1440 × 900, twice each in alternating order; another project's session was using the GPU, so single runs moved by several ms: the first r128 run's Dial view read 6.8 ms, its second 15.5). The same draw calls and triangles as r128 (495, 391, 467, 495), as expected with no transmission pass. The JavaScript inside a frame's renders is the steady difference: about 3 ms on r128 and 4 ms on r187 with Edges on (2.5-3.2 against 3.7-4.5 over the four views, both pairs), 0.2-0.9 ms more with Edges off. A frame as opened: 14.3-15.5 ms on r128 and 15.7-16.7 on r187 in the second pair. So about 1 ms more a frame, three's own; the pilot's 2.5-4.5 ms was mostly its transmission pass. First frame 22.0 s on both (the model's build).
5. **The section's cut faces** (`pagecmp.py shots` with `pagecmp/section.json`, nine stills: each plane in the Side and Movement views, the other half, Outlines through the cut, the Dial view, off again; then `pixels`): the hatching, its colour and the cut's outlines are the same; 51-181 pixels of 960,000 differ by more than 24 levels of 255 in eight of the stills (60 with no section), 868 in the ninth, the 12–6 plane in the Side view.
   - **One difference, small, recorded open:** in that still the movement ring's cut, at its inner step low on the right, shows grey specks on both releases; on r187 they cover about 500 pixels more at this size. With the ring hidden they are gone, with the dial hidden they stay: it is the ring's own mesh under the cut (the mesh whose triangulation differs), not the cut's depth patch. A fault of the ring's mesh worth mending with the ring's outline (the one-geometry work), not of three.
6. Not done here, for the discussion the owner asked for after this release: the essay and the Hamilton's page on r187 (this plan's stage 4), removing r128 (5), the new look (6).
