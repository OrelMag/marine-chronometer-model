# Illustrations for print

Pictures drawn from the models for print, not shown on the site (the owner's choice, 2 November 2026). Each is made by a tool in
`marine-chronometer-source/chronometer-working-model/tools/`; the root README's "Making illustrations" says how.

- `wempe-laidout-sheet-ink.jpg`, `wempe-laidout-sheet-ink-A3.pdf`: the Wempe's lettered Laid out sheet in ink and wash, against a
  textbook's developed drawing ("Modern chronometer movement", Figs. 83 and 84). `python laidout.py --model wempe --pen --glb r_wempe.glb OUT`
  (export first: `gltf_check.py --model wempe`). 4164 x 4495 px; the PDF is A3 at 300 dpi with a margin (the owner chose an A3 sheet), the drawing's own pixels at about 375 dpi.
  Every letter checked: each lettered element shown, and a click at its letter's anchor on the page opening that element's card; no two leaders cross.
- `wempe-poster-precision.jpg`, `wempe-poster-precision-A2.pdf`: *What makes a marine chronometer precise*, the Wempe in ink and wash,
  lettered in Caveat: the box open with the movement raised over its bowl (a cutaway), and four callouts (the spring detent escapement, the fusee,
  the balance, the gimbals). `python penposter.py --glb r_wempe.glb` (export first). 7016 x 4961 px, A2 landscape at 300 dpi.
  Every label and leader ends on the part it names (the page's own pick), every drawing lies on the page's outline within a pen stroke,
  no leader or label line crosses another, and each sentence's sources are in the tool's `TEXT`.
