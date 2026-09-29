# Marine Chronometer: interactive essay

A long-form interactive essay in the spirit of Bartosz Ciechanowski’s
“Mechanical Watch”. It covers longitude, the balance, the helical spring,
temperature compensation, the fusee, the train, the detent escapement and the
gimbals, and ends with a complete 3D model.

- `marine-chronometer.html` is the published single file.
- `src/` holds the pieces it was assembled from:
  - `p1.html`: markup, CSS and prose;
  - `p2.js`: helpers, 3D view, geometry;
  - `p3.js`: chronometer builder and figures 1–5;
  - `p4.js`: figures 6–9 and the main loop.

To rebuild, run `python build.py` at the repository root. It concatenates the
four pieces, closes the page, inlines three.js and the fonts from `vendor/`,
and writes `marine-chronometer.html` here and at the root. `p1.html` opens the
`<script>` tag that `p2.js` to `p4.js` continue, so the pieces don't work on
their own; always open the built file.

This essay predates the Hamilton manual and the working model. For
Hamilton-specific detail, use `../chronometer-working-model`. The one exception
is the detent figure (F7 in `p4.js`): it uses the model's own escapement
solver, `makeEsc` in `../shared/escapement.js` (loaded by `p1.html` and inlined
by the build), so it draws the Model 21 escapement at the manual's settings and
follows any change to it. The essay
links to the model as `chronometer-working-model.html`; `build.py` points that
link at the site's home page in `site/`.
