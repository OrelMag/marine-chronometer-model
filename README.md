# The Marine Chronometer

Two browser-based projects about the marine chronometer, centred on the
Hamilton Model 21: a two-day fusee chronometer with a spring detent escapement.
Both run from static files with three.js r128 (from cdnjs). No install is needed.

## Published files

| File | What it is |
|---|---|
| [`chronometer-working-model.html`](chronometer-working-model.html) | Interactive 3D model of the Model 21 running in real time inside its gimballed case and mounting box, with an eight-step walkthrough, cross-sections and part descriptions |
| [`marine-chronometer.html`](marine-chronometer.html) | Long-form interactive essay covering longitude, the balance, the helical spring, temperature compensation, the fusee, the train, the detent escapement and the gimbals |

Open either file in a browser.

## Sources

The editable sources are in [`marine-chronometer-source/`](marine-chronometer-source/):

- [`chronometer-working-model/`](marine-chronometer-source/chronometer-working-model/README.md):
  the 3D model. Its README covers the files, coordinates, timing, the
  references it draws on (principally the 1948 NAVSHIPS 250-624 Hamilton
  overhaul manual), how the layout was measured from photographs, and which
  details are estimated.
- [`marine-chronometer-essay/`](marine-chronometer-source/marine-chronometer-essay/README.md):
  the essay. It predates the Hamilton manual and the working model.

## Rebuilding the published files

Working model:

    cd marine-chronometer-source/chronometer-working-model
    python3 build.py
    cp dist/chronometer-working-model.html ../../

Essay:

    cd marine-chronometer-source/marine-chronometer-essay
    cat src/p1.html src/p2.js src/p3.js src/p4.js > marine-chronometer.html
    printf '\n</script>\n</body>\n</html>\n' >> marine-chronometer.html
    cp marine-chronometer.html ../../
