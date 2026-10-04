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

Books consulted. These are period texts on chronometers in general, not on the Model 21. They serve as a cross-check and
never as a source for the model's shapes or sizes:
- *Watch and Clock Escapements* (compiled from *The Keystone*; B. Thorpe, Philadelphia, 1904; public domain, Project Gutenberg
  eBook 17021, https://www.gutenberg.org/ebooks/17021), Ch. III "The Chronometer Escapement" (pp. 131-152): how to draw and
  make a spring-detent escapement, with rules for its proportions (15 teeth, an impulse roller half the wheel, the balance
  planted where the two rims cross over a pitch, the detent spring's sizes, the locking stone's form, the tooth's angles).
  `chronometer-working-model/tools/keystone.js` measures the model against each rule; the model README's "Against a period
  text" has the result.

Articles consulted (all rights reserved: cited, not copied; the copy read is kept outside the repository,
in `$MC_VIDEO/articles/`):
- William R. Smith, "The Man Who Saved the Hamilton Model 21 Ship's Chronometer", *NAWCC Watch & Clock Bulletin*
  No. 395 (January/February 2012), pp. 56-63. Pages 56-59 are public at
  https://pubs.nawcc.org/images/stories/395_56_63a.pdf; the docs.nawcc.org copy and pages 60-63 need an NAWCC login.
  It is history, with no dimensions. Hamilton believed the detent could only be made by hand, by the three people it
  had who could make one. V. E. Van Hoesen, a Memphis watchmaker, made them in quantity on milling machinery in the
  A. Graves & Steuwer jewelry store, a work the books by Whitney and Sauers don't mention. Fig. 2a is Hamilton's
  letter of 4 January 1943 to the Chief of the Bureau of Ships (contract NOs-85310), signed by M. F. Manby, Chief,
  Research-Engineering Division, copied to Comdr. E. B. Oliver at the Naval Observatory, asking for equipment for the
  firm "so they can make detents which we urgently need". Fig. 3 is a *Daily Capital News* article (Jefferson City,
  Missouri, 25 August 1943) on the work. John Huber holds unfinished Model 21 detent parts and photographs from Van
  Hoesen's estate; the pages behind the login may show them.

Not yet consulted (found 4 October 2026). These may hold facts about the Model 21 itself:
- NAWCC Library and Research Center, Hamilton Records Collection, Series V: Chronometers, 1940-1984
  (https://archive.nawcc.org/repositories/2/archival_objects/11056). The catalogue lists research reports, test data,
  correspondence, drawings, photographs and instructions on the production, design, assembly and performance of the M21,
  M22, M23 and 4221, among them "Care and Handling of the Hamilton Marine Chronometer, 1945" (George E. Shubrooks and
  Ernest W. Drescher; Box 13, Folder 5). The items aren't online; the library's research service has them
  (https://nawcc.org/index.php/library-research).
- Marvin E. Whitney, *The Ship's Chronometer* (American Watchmakers Institute Press; listings give 1984, 1985 and 1991,
  ISBN 0918845084, and Smith's article 1981). Whitney was a chronometer maker at the U.S. Naval Observatory during the war, and the book gives a
  first-hand account of how the Model 21 and 22 were developed.
- Jonathan Betts, *Marine Chronometers at Greenwich* (Oxford University Press): its chapter "How the Chronometer was Made"
  covers the 19th-century English trade, from bare metal to delivery on board.
- W. J. Gazeley, *Clock and Watch Escapements* (1956), and George Daniels, *The Practical Watch Escapement* (1994): how
  the detent escapement is drawn and made.

Videos consulted (YouTube, all rights reserved: cited, not copied; frames are taken from them with
`tools/video.py` into a folder outside the repository). Videos of real Model 21s are a source of truth,
with the photographs and the manual (IDEAS.md): they outrank an estimate. Times are mm:ss.
**[VIDEOS.md](VIDEOS.md)** has the full record: what each video shows minute by minute, every
measurement taken (with its frame and command), the methods that worked and those that didn't, and
which open gaps each could close. The table below is the summary.

| Video | What it shows | Used for |
|---|---|---|
| C Spinner Watch Restorations, "Repairing a World War II Navy Chronometer - The Iconic Hamilton Model 21", 54 min, 4K (https://www.youtube.com/watch?v=KLUwI2UUCMQ); a 1941 movement, plate serial 2E8489 | Full teardown, cleaning and reassembly, filmed close: the fusee wheel flat on the mat (27:30), every part laid out (23:30, 23:45), the pillar plate bare from the train side with its pillars (34:30, 35:14), the third, centre and fourth wheels going in (35:18-35:34) and the train in place (36:15), the dial side with the lower train bridge and motion work (40:15, 40:30), the bridges off (13:00, 13:45) | The train's tooth counts (IDEAS.md 1.8): fusee wheel 90, centre 90, third 80 with a 12-leaf pinion, fourth 75; which wheel is which, from the order they go in |
| BunnSpecial, "How I take apart a marine chronometer, Hamilton, Model 21", Part 1 of 2 (prep) and Part 2 of 2 (plates, wheels), 27 min each, 720p (https://www.youtube.com/watch?v=Jd2c3x8VKsE, https://www.youtube.com/watch?v=wcYqdgpyggQ) | Part 2: the motion work off the dial side (5:10), the barrel bridge off (12:00), the barrel and fusee out (13:00-15:50), the upper train bridge off with the balance lower bridge on it, held to the camera (19:30-20:40), two train wheels on the bare plate (20:50-21:10), the pillar plate bare with its four pillars, train side up (21:50-23:20), and its dial side (23:30-24:10) | The pillars' places (IDEAS.md 1.2, not yet fitted) |
| bunnspecial, "Hamilton Model 21 Marine Chronometer, Part 1 of 3", 3 min (https://www.youtube.com/watch?v=We1dLNXiBj0); RM Watch & Clock, "Hamilton Model 21 Marine Chronometer", 30 s, 1080p (https://www.youtube.com/watch?v=s7VW3RiJ97E) | The escapement running, close up | Not yet used: candidates for the escapement's motion and the balance's swing |
| Boulder Horological Society, "Zoom #19: Hamilton 21 Marine Chronometer Deconstructed" (https://www.youtube.com/watch?v=TWQsSVWuikk) | 43:13: the upper train bridge upturned, with the balance lower bridge on it | The balance lower bridge's form, with C Spinner's 36:01 |
