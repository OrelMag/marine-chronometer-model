# Handover: the sustaining spring's section and gap

Written 17 October 2026 on branch `claude/sleepy-ptolemy-o0vda6`. Read `CLAUDE.md` first; its rules apply throughout. Above all: the user has no
chronometer, so never ask them for measurements. Every line you draw must be measured on a source and say which one, and anything left
estimated goes in the model README's "Estimated, not from the manual" section.

## The question

The user asked how the sustaining spring gives energy to the train, and whether the model gets it right. The answer they were given:

- **How it works.** The spring carries the whole drive the entire time the chronometer runs: mainspring → chain → fusee → winding
  ratchet → winding pawls → sustaining ratchet → **sustaining spring** → fusee wheel → train. So it is always loaded with the drive, and
  that energy came from the mainspring. When the key turns the fusee back, the sustaining pawl holds the sustaining ratchet. The spring,
  now held at that end, relaxes forward into the fusee wheel and drives the train for 5–10 minutes (Sec. IV). When the key lets go, the
  fusee turns forward and loads the spring again. It stores energy; it never adds any.
- **The behaviour is right.** `update()` in `js/movement.js` (around lines 1492–1530) and `driveNow()` in `js/app.js` (around line 754)
  model it as a linear spring. It pushes `R.ssF = 1 − R.ssD/SMAX` of the drive, where `SMAX` is the fusee wheel's turn in 10 minutes,
  9.3°. `tools/maintaining.py` checks the pawls and the catch. `tools/sustaining.js` finds that this spring drives the train for 9.4
  minutes.
- **The band as drawn is wrong.** That is `OPEN-QUESTIONS.md`, "The sustaining spring's section and gap (13 October 2026)". Bent in its
  plane between its two pins (Castigliano, `tools/sustaining.js`), the drawn band gives **0.70 N·m a radian**. The drive (0.311 N·m) would
  close it 25.4°, more than its 17° gap, so it would close solid and push only 67 % of the drive once the key turns. The manual's 5–10
  minutes need **1.78–4.19 N·m a radian**. At the measured width that means a band 2.9–6.8 mm high, and the fusee wheel's recess is only
  1.8 deep.

## What is measured and what is estimated

All of these are in `js/movement.js`, around lines 750–770: `SSF`, `SSH`, the line with `SMAX`, `SSG`, `SFL`, `SWL`, `SRO`, `SSW` and
`SPW`, and `sspGeo`. `tools/sustaining.js` reads them from that file by regex, so keep the form `SSG=…*D2R,SFL=…*D2R,…` and the height as
the second argument of `polyGeo` in `sspGeo`. If you change either form, change the regex too.

| Quantity | Value | Status |
|---|---|---|
| Band width (radial) `SSW` | 2.1 × FK = 1.85 mm | Measured, KLUwI2UUCMQ 27:26 (±0.3 mm), against the wheel's tips taken as 40.87 mm |
| Recess wall `SRO` | 17.97 × FK | Measured, 27:26 |
| Pins' radii | ratchet pin 14.6 × FK; fixed-end holes 15.9 × FK at `SSF` − 48° and `SSF` − 8° | Measured, 27:26 |
| Band height (along the fusee's axis) | 1.13 mm | **Estimated**; the recess caps it at 1.8 |
| Relaxed gap `SSG` | 17° | **Estimated**. VIDEOS.md's 27:26 row reads "steel round about 335° … with a gap of about 20°", taken in the wheel out of the movement |
| Fixed end's lobe `SFL` | 62° | **Estimated** |
| Working end's lobe `SWL` | 35° | **Estimated** |
| Working pin `SPW` | 12° | **Estimated** |
| Which fixed-end hole has the pin | the first (`SSH[0]`) | **Estimated** |

Stiffness goes as the width cubed, times the height, divided by the free band's ∫h²ds. Even 1.8 mm of height gives only 1.6× of the
2.5–6× needed. So a real Model 21 must have a shorter free band (longer lobes), different pin places, or a width closer to the 2.1 read
before FK. FK's use on this width is worth checking: (2.1/1.85)³ is 1.46×.

## The sources to look at

Network: in the last session every YouTube host was refused (`www.youtube.com`, `*.googlevideo.com`, `i.ytimg.com`), even after the user
allowed YouTube. First check `curl -sS -o /dev/null -w "%{http_code}\n" https://www.youtube.com/` and `$HTTPS_PROXY/__agentproxy/status`.
If they are still refused, the allowed domains need `*.youtube.com`, `*.googlevideo.com` and `*.ytimg.com`, or a broader level. Read the
`environment.network` documentation page and tell the user; don't retry.

The tools: `tools/video.py fetch ID` (into `$MC_VIDEO`, default `~/mc-video`, never the repository; it needs `pip install yt-dlp
opencv-python-headless`, and `--js-runtimes node` for TWQsSVWuikk), or yt-dlp `--download-sections "*mm:ss-mm:ss"` for a stretch only.
Then `video.py sheet ID --from --to` (about 1 s a frame) and `video.py frame ID mm:ss`.

In order of promise:

1. **KLUwI2UUCMQ** (C Spinner, 4K, movement 2E8489), **18:49–19:05**. VIDEOS.md's banking row: "the fusee wheel's face with the spring in
   (18:52) and coming out (18:56-18:58)". This is the best chance of seeing the band loose, giving its ends and relaxed gap, or on its
   edge, giving its height. It was only looked at by eye, for a banking pin.
2. **KLUwI2UUCMQ 27:20–27:50** (the spring in the wheel, out of the movement, face-on: the existing measurements) and **28:00–29:28** (the
   fusee wheel and maintaining work handled; any oblique view of the recess shows the band's edge against the wall, which gives its
   height).
3. **TWQsSVWuikk** (Boulder Horological Society, 360p, movement 2E7437), **45:30–46:30**. 45:40 shows the recess open face-on. It gives
   the shape only, not millimetres. 42:55, which the user sent, shows the sustaining ratchet's pawl side on top of the fusee wheel; the
   spring is hidden between the two.
4. Literature: a published torque or section for Hamilton's part 42016 (an NAWCC Bulletin, a Hamilton service note). `REQUESTS.md` has no
   item for this spring yet; add one: the spring out of its recess, face-on and side-on, or its torque.

Two images the user sent show the sustaining ratchet's face toward the fusee (winding pawls and their springs), not the sustaining spring.
One is TWQsSVWuikk 42:55; the other has no known source. Neither adds anything for this question.

## How to measure

- **Face-on frames** (gap, lobes, pins): `rimfit.py` with the wheel's tip circle (40.87 mm, drawn × FK) as the rim, or `video.py anchor`
  on the tips and the bore. Check the focal length with `fcal.py`. Trace the band's inner and outer edges as points all the way round:
  where each lobe starts, where the gap's two ends are, and the pins' centres.
- **Edge-on or oblique frames** (height): read the band's height against the recess depth (1.8 mm) or the wheel's thickness in the same
  frame. Use a ratio, which needs no camera. Say how sure each reading is.
- Record each reading in `References/VIDEOS.md`: the measurements table, with time, method and confidence.

## Then, in the model

1. Put the measured values in `js/movement.js` (`SSG`, `SFL`, `SWL`, `SPW`, which `SSH` hole, the height in `sspGeo`), each comment naming
   video, mm:ss and the numbers. Keep `SMAX` as it is: it is the manual's 10 minutes, and the model's drive runs on it.
2. `node tools/sustaining.js` (about a second). The goal is for its first `~~` line to become `ok`: the drawn band neither closing solid
   nor leaving the 5–10 minutes. If measured lines still leave it too soft, say so; don't bend measured lines to fit.
3. **Fallback**, only if no frame shows these: fit only the unmeasured parts (lobe lengths, pin angles, height ≤ 1.8, which hole) so
   `sustaining.js` passes, keeping every measured line. Record it as a fit in the README's "Estimated" section, and leave the
   OPEN-QUESTIONS entry open, saying what was searched.
4. Geometry checks (`CLAUDE.md`, with ETAs): `isolate.py` on the fusee wheel and spring against the frames (required by the project's
   hook), `solids.py` (16 s), `fine.py` (about 2½ min), `maintaining.py` (8 s), `exploded.py` (20 s), `audit.py` (9 s), `bom.py` (about
   6 min), and `views.py` before and after. Then `ci.py` (about 5 min) and the build (`python build.py`), committing the root copy and
   `site/`.
5. Docs: model README (the sustaining spring's line under "Estimated"; "Mechanisms" if `sustaining.js`'s figures change),
   `OPEN-QUESTIONS.md` (close or update the entry), `References/VIDEOS.md`, and `RESOLVED.md` if this counts as a fix (an entry with
   its hash). `verification/build-verification/mechdata.js` reads `sustaining.js`, so after a change run it (about 45 s), then
   that folder's `build_report.py` (about 45 s).

## Status when handed over

No code was changed. This file is the only addition on the branch.
