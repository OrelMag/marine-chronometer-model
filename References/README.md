# References

Source material for the working model. The model's README ("Sources" and "How
the layout was measured") says what was taken from each file.

| File | What it is | Used for | Original filename |
|---|---|---|---|
| `navships-250-624-overhaul-manual-1948.pdf` | *Manual for Overhaul, Repair and Handling of Hamilton Ship Chronometer*, NAVSHIPS 250-624, Bureau of Ships, 1948 (Google Books scan) | Structure, escapement layout (Fig. 90) and adjustment figures (Sec. VIII), parts list, dial (Fig. 107); its Fig. 2 photograph is the first camera of the photo fit | `Manual_for_Overhaul_Repair_and_Handling Marine Chronometer.pdf` |
| `manual-fig13-train-exploded.jpg` | The manual's Fig. 13 (p. 14): exploded drawing of the train, fusee, barrel and motion work, upscaled | Visual reference for the train and part names | `Hamilton_Marine_Chronometer_Model_21.jpg` |
| `photo-top-view.jpg` | Near top-down photograph of a 1941 Model 21 movement (serial 2E11795) in its gimbals | Second camera of the photo fit; traced for `tools/p3map.json`, `cock_outline.json`, `engr.json`; the dial screws in the mounting ring's flange, the case's rim (about 105 mm across) and the gimbal ring's size | `chronometer_mech_1.jpg` |
| `photo-side-view.jpg` | Side photograph of an unmounted movement (Nikon D500, 2023) | Heights above the pillar plate, scaled by its 3.86 mm edge; the mounting ring under the plate (a band as wide as the plate, then a flange 95.9 mm across, its slot) and the dial on it (about 95 mm) | `sideview.jpeg` |
| `photo-oblique-balance-side.jpg` | Oblique photograph of an unmounted movement from the balance side, showing the fusee chain, barrel, pillars and bridges | Visual reference | `H0096-L305589483_original.JPG` |
| `photo-dial-ulysse-nardin-noaa.jpg` | Ulysse Nardin marine chronometer used by the U.S. Coast and Geodetic Survey in the 1940s, dial in its box (NOAA Heritage, "Friday Find", July 2024: https://www.noaa.gov/heritage/stories/friday-find-1940s-timepiece-was-original-gps-for-ships) | The Variants panel's Swiss dial (`dialCanvas('swiss')`) and its hands; the maker's name and number are left off | `FF-20240706_FFMarineChronometer-1009770_OnBlack.jpg` |
| `photo-dial-hamilton-maritime-commission.jpg` | Dial of a Hamilton Model 21 of the U.S. Maritime Commission contract, serial 2E10861, in its gimbals | The Hamilton dial (`dialCanvas()`): layout, inscriptions and hands; its proportions (sub-dials about 0.54 of the minute track's radius out) agree with a 95 mm dial | a pasted image (`2.png`) |
| `photo-movement-2E12055.jpg` | Bridge side of a Model 21 movement, serial 2E12055, in its gimbals | The plate engraving's text, sizes and layout (`M.engraveB`, `M.engraveT` in `core.js`) and the model's serial | a pasted image (`3.png`) |
| `photo-dial-soviet-kirov.png` | Dial of a First Moscow Watch Factory (МЧЗ имени Кирова) deck chronometer, serial 14024 | The Variants panel's Soviet dial (`dialCanvas('soviet')`) and its hands; the maker's name and number are left off | a pasted image (`1.png`) |
| `photo-dial-side-lower-train-bridge.png` | Dial side of a Model 21 in its mounting ring during reassembly (404 × 321 px; source unknown): the lower train bridge, the motion work and the wind indicator wheel going in | The lower train bridge's shape (a square-ended steel bar, settings inboard, a screw toward each end), the opening in the plate under it, the minute wheel's side, the motion work's shapes, the mounting ring's bore (the plate sunk in it); mapped through the centre, the fusee arbor and the wind indicator wheel | a pasted image (`1.png`) |
| `drawing-lexicon-plan-and-section.png` | German encyclopedia figure (c. 1900): plan and section of a marine chronometer, with a lettered key | Visual reference for the general arrangement | `L-Cronometer.png` |
| `screenshot-model-exploded-view.jpg` | Screenshot of this model's exploded view | Record of the model's look | `Web view.jpg` |

Names: `manual-*` are figures from the manual, `photo-*` photographs of real
movements, `drawing-*` other drawings, `screenshot-*` captures of this model.

Web photographs consulted (all rights reserved, so cited, not copied here):
- omegaforums.net, "Incoming Hamilton Model 21 chronometer" (thread 78172): side views of the train between the plates (the third wheel lowest with its pinion above it, the fourth pinion long under its wheel; the train-blocking screw's dog point at the fourth wheel), and the train-blocking screw's head circled on the bridge.
- delaneyantiqueclocks.com, Hamilton Model 21 No. 8854 (1941): the dial (sub-dial centres about 0.47-0.51 of the dial's radius) and a side view of the movement.
- Wikimedia Commons, "Hamilton Marine Chronometer Model 21.jpg": the manual's Fig. 13 (1943 edition), public domain.
