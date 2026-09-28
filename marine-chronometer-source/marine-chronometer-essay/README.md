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

To rebuild:

    cat src/p1.html src/p2.js src/p3.js src/p4.js > marine-chronometer.html
    printf '\n</script>\n</body>\n</html>\n' >> marine-chronometer.html

This essay predates the Hamilton manual and the working model. For
Hamilton-specific detail, use `../chronometer-working-model`.
