# References

Source material for the working model. The model's README ("Sources" and "How
the layout was measured") says what was taken from each file.

Two folders have their own README: `wempe/` (the second model, the Wempe
Einheits-Chronometer, and the Soviet 6MX) and `third-model/` (Swiss and Japanese
marine chronometers surveyed on 16 October 2026 for a possible third model;
nothing is built on it).

| File | What it is | Used for | Original filename |
|---|---|---|---|
| `navships-250-624-overhaul-manual-1948.pdf` | *Manual for Overhaul, Repair and Handling of Hamilton Ship Chronometer*, NAVSHIPS 250-624, Bureau of Ships, 1948 (Google Books scan) | Structure, escapement layout (Fig. 90) and adjustment figures (Sec. VIII), parts list, dial (Fig. 107); its Fig. 2 photograph is the first camera of the photo fit | `Manual_for_Overhaul_Repair_and_Handling Marine Chronometer.pdf` |
| `manual-fig13-train-exploded.jpg` | The manual's Fig. 13 (p. 14): exploded drawing of the train, fusee, barrel and motion work, upscaled | Visual reference for the train and part names | `Hamilton_Marine_Chronometer_Model_21.jpg` |
| `photo-top-view.jpg` | Near top-down photograph of a 1941 Model 21 movement (serial 2E11795) in its gimbals | Second camera of the photo fit; traced for `tools/p3map.json`, `cock_outline.json`, `engr.json`; the dial screws in the mounting ring's flange, the case's rim (about 105 mm across) and the gimbal ring's size | `chronometer_mech_1.jpg`; found 5 October 2026 as Bonhams' image 1 of sale 22389, lot 1128 (4 March 2015; listed as "No. 2E11975", the plate engraved 2E11795; a U.S. Army dial), the same 2322 px image. Image 2 there shows this chronometer in its box, the latch's head at the front: a box reference (cited, all rights reserved) |
| `photo-side-view.jpg` | Side photograph of an unmounted movement (Nikon D500, 2023) | Heights above the pillar plate, scaled by its 3.86 mm edge; the mounting ring under the plate (a band as wide as the plate, then a flange 95.9 mm across, its slot) and the dial on it (about 95 mm) | `sideview.jpeg` |
| `photo-oblique-balance-side.jpg` | Oblique photograph of an unmounted movement from the balance side, showing the fusee chain, barrel, pillars and bridges | Visual reference | `H0096-L305589483_original.JPG` |
| `photo-dial-ulysse-nardin-noaa.jpg` | Ulysse Nardin marine chronometer used by the U.S. Coast and Geodetic Survey in the 1940s, dial in its box (NOAA Heritage, "Friday Find", July 2024: https://www.noaa.gov/heritage/stories/friday-find-1940s-timepiece-was-original-gps-for-ships) | The Variants panel's Swiss dial (`dialCanvas('swiss')`) and its hands; the maker's name and number are left off | `FF-20240706_FFMarineChronometer-1009770_OnBlack.jpg` |
| `photo-dial-hamilton-maritime-commission.jpg` | Dial of a Hamilton Model 21 of the U.S. Maritime Commission contract, serial 2E10861, in its gimbals | The Hamilton dial (`dialCanvas()`): layout, inscriptions and hands; its proportions (sub-dials about 0.54 of the minute track's radius out) agree with a 95 mm dial | a pasted image (`2.png`) |
| `photo-movement-2E12055.jpg` | Bridge side of a Model 21 movement, serial 2E12055, in its gimbals | The plate engraving's text, sizes and layout (`M.engraveB`, `M.engraveT` in `core.js`) and the model's serial | a pasted image (`3.png`) |
| `photo-dial-soviet-kirov.png` | Dial of a First Moscow Watch Factory (МЧЗ имени Кирова) deck chronometer, serial 14024 | The Variants panel's Soviet dial (`dialCanvas('soviet')`) and its hands; the maker's name and number are left off | a pasted image (`1.png`) |
| `photo-dial-side-lower-train-bridge.png` | Dial side of a Model 21 in its mounting ring during reassembly (404 × 321 px; source unknown): the lower train bridge, the motion work and the wind indicator wheel going in | The lower train bridge's shape (a square-ended steel bar, settings inboard, a screw toward each end), the opening in the plate under it, the minute wheel's side, the motion work's shapes, the mounting ring's bore (the plate sunk in it); mapped through the centre, the fusee arbor and the wind indicator wheel | a pasted image (`1.png`) |
| `photo-cock-top.png` | A Model 21's balance cock in place, from above at the nose (376 × 343 px; a screenshot of a listing, source unknown; supplied 6 October 2026) | The cock's top face (`CK_TR` in `movement.js`): its straight edge's bend, the nose and the concave edge, the last as the user marked it, put on the cock's top through a homography on its holes | (screenshot) |
| `photo-lower-bridge-underside.jpg` | A Model 21's upper train bridge lying underside up on a green mat, oblique and close (1932 × 2576 px, a phone's ultra-wide lens, about f 970 px; serial not shown; supplied 12 October 2026): the balance lower bridge on it with its cap, the fourth's gilt setting and both lug screws, the escape wheel under the slab, the detent's brass block | The balance lower bridge checked against the restoration video's 13:49.5 (`References/VIDEOS.md`, "Balance lower bridge on a photograph"): its camera fitted on the train bridge's rim, barrel cut, centre bushing and fusee-end hole (`tools/anchors/photo_lower_bridge.json`, `photo_lower_bridge_cam.json`); the lugs, screws and train-blocking screw's hole confirmed, the slab's outline within about 1.3 mm, its height left open (`OPEN-QUESTIONS.md`); the train bridge's holes near the fusee end (Review-results.md, "Elsewhere", 27) | a pasted image |
| `drawing-lexicon-plan-and-section.png` | German encyclopedia figure (c. 1900): plan and section of a marine chronometer, with a lettered key | Visual reference for the general arrangement | `L-Cronometer.png` |
| `photo-plate-cork-as-shown.jpg` | The half-round enamel plate inside the lid of a Navy chronometer box (697 × 666 px; source unknown): "Cork as shown", the balance drawn with a wedge under its rim at each end of the arm, "See Ship's Chronometer Record Book (Form N.B.S. 702) 'Transportation' Paragraph 2 (A)" | Where the transport instructions were: the record book below, and the manual's corking (Sec. X, p. 75; Sec. III, Fig. 10). The same plate is in the lid in *Quartermaster 1 & C*'s Fig. 2 | a pasted image |
| `bureau-of-ships-manual-ch24-ship-control-equipment-1946.pdf` | *Bureau of Ships Manual*, Chapter 24, "Ship Control Equipment", 1946 edition (printed 1948), 28 page scans (University of Illinois copy, Google-digitized, public domain; HathiTrust `uiug.30112069885678`), grayscale | Art. 24-33 (p. 24-41): "Complete instructions relative to the care and handling of chronometers … are contained in the Ships Chronometer Record Book (Form NavShips 702)", the plate's "N.B.S. 702" under the Bureau's later prefix; Arts. 24-31 to 24-34: issue, exchange at the chronometer pools, overhaul by the Naval Observatory only, submerged timepieces | HathiTrust page images (whole-book download needs a member library's login) |
| *Quartermaster 1 & C* (not committed: 29 MB; cited) | *Quartermaster 1 & C*, Bureau of Naval Personnel, 1952, 412 page scans (University of Illinois copy, Google-digitized, public domain; HathiTrust `uiug.30112106656264`, also on Google Books, below); kept out of the repository for its size, to fetch from HathiTrust | pp. 16-21, "Care of Chronometers": the record book's instructions summarised (winding to the left, about seven half-turns, the last bringing up gently against the stop; daily at 1130, reported at 1200; the gimbal ring locked before moving; carried by hand from ship to pool; express shipment by BuShips instructions); by 1952 each chronometer's *Record Book* is NavShips 3587, a new one issued with each overhaul. Fig. 2 (p. 16): a Hamilton box with the cork plate in its lid | HathiTrust page images |
| `screenshot-model-exploded-view.jpg` | Screenshot of this model's exploded view | Record of the model's look | `Web view.jpg` |
| `patent-US2356911-balance-wheel.pdf` | US 2,356,911, "Balance Wheel", W. O. Bennett Jr., Hamilton, filed 19 Dec. 1941, granted 29 Aug. 1944 (Google Patents) | The balance's construction: stainless rim, Invar crossbar in a step under it, screws in paired holes (below, "Hamilton Watch Company's patents") | `US2356911.pdf` |
| `patent-US2356911-balance-wheel-sheet1.png` | Its drawing sheet, rendered at 200 dpi | Reference image for `isolate.py --ref` | (rendered) |
| `patent-US2379780-hairspring-mounting.pdf` | US 2,379,780, "Hairspring Mounting", Bennett and E. W. Drescher, filed 4 Aug. 1943, granted 3 July 1945 | The hairspring's end clamps at collet and stud | `US2379780.pdf` |
| `patent-US2379780-hairspring-mounting-sheet1.png` | Its drawing sheet, rendered at 200 dpi | Reference image for `isolate.py --ref` | (rendered) |
| `patent-US2391816-hairspring-collet.pdf` | US 2,391,816, "Hairspring Collet", Bennett, filed 29 July 1944, granted 25 Dec. 1945 | The counterpoised collet | `US2391816.pdf` |
| `patent-US2391816-hairspring-collet-sheet1.png` | Its drawing sheet, rendered at 200 dpi | Reference image for `isolate.py --ref` | (rendered) |
| `patent-US2457631-cylindrical-hairspring-form.pdf` | US 2,457,631, "Cylindrical Hairspring Form", Bennett, filed 22 Sept. 1943, granted 28 Dec. 1948 | How the helical hairspring was formed, its ends turned in | `US2457631.pdf` |
| `patent-US2457631-cylindrical-hairspring-form-sheet1.png` | Its drawing sheet, rendered at 200 dpi | Reference image | (rendered) |
| `patent-US2385252-balance-screw.pdf` | US 2,385,252, "Balance Screw", Bennett, filed 12 Apr. 1943, granted 18 Sept. 1945 | Poising screws | `US2385252.pdf` |
| `patent-US2392745-escape-and-balance-staff.pdf` | US 2,392,745, "Escape and Balance Staff", A. J. Kleiner, filed 21 Jan. 1943, granted 8 Jan. 1946 | The staffs' pivots (about 0.007 in) | `US2392745.pdf` |
| `patent-US2433509-chronometer-box-securing-support.pdf` | US 2,433,509, "Chronometer Box Securing Support", Drescher, filed 21 Feb. 1945, granted 30 Dec. 1947 | The box's mounting on board | `US2433509.pdf` |
| `patent-US2425602-cantilever-support-gimbal.pdf` | US 2,425,602, "Cantilever Support for Gimbal Carried Instruments", Drescher, filed 13 Jan. 1945, granted 12 Aug. 1947 | The gimbals' support | `US2425602.pdf` |
| `patent-CH273734-movement-for-marine-chronometers.pdf` | CH 273,734, "Uhrwerk, vorzugsweise für Marinechronometer", Hamilton, filed 19 Feb. 1946, published 16 May 1951 (DEPATISnet, four pages joined) | A schematic seconds-stepping movement; not the Model 21's layout | `CH000000273734A_1.pdf`-`_4.pdf` |

Photographs consulted, not kept (cited only):

- A 1941 Model 21, serial 2E7832, its dial N 7832 (photographs of a sale listing, pasted 6 October 2026): the movement from above, the barrel bridge's horn on the 6 o'clock side and the cock's edge (compared with the model's barrel bridge, `RESOLVED.md`), and the dial face-on, which the Navy dial (`dialCanvas('usn')`) is measured on.

Names: `manual-*` are figures from the manual, `photo-*` photographs of real
movements, `patent-*` Hamilton's patents, `drawing-*` other drawings, `screenshot-*` captures of this model.
The two Navy books keep their own titles.

The Ships Chronometer Record Book itself (Form N.B.S. 702, later NavShips 702,
then NavShips 3587) is not online: HathiTrust's full text has no "N.B.S. 702",
and "NavShips 702" only in the Bureau of Ships Manual above (4 October 2026).
A new one went out with every overhauled chronometer, so copies turn up in Navy
chronometer boxes; blank forms may be in the National Archives, Record Group 19
(Bureau of Ships). Google Books has both Navy books as whole PDFs
(`books.google.com/books?id=hiE6oREONHEC`, `?id=z8gE8mun6OMC`).

Web photographs consulted (all rights reserved, so cited, not copied here):
- Renaissance Antiques, a Hamilton 21 case side-on (`www.renaissanceantiques.com/product/rare-american-hamilton-21-marine-chronometer-master-clock/`, image `antique-clock-LPEC109-4.jpg`, 900 px): the case's profile (band, step, wall, chamfer, base), traced for `box.js` (5 October 2026).
- Leland Little, two Model 21 lots (`www.lelandlittle.com/items/332339/...` and `.../items/239771/...`; full-size images under `/images/inventory/original/`, up to 5,120 px): the empty case from below and inside, its brackets and keeper, the gimbal ring in the box, the key block. Fontaines (`www.fontainesauction.com/auction-lot/hamilton-watch-co.-model-21-marine-chronometer_2C7482D97F`): the case in its gimbal ring out of the box.
- watchdoc.com, "Hamilton Model 21 WW2 Ship Chronometer Balance Staff" (`www.watchdoc.com/products/hamilton-ww2-ship-chronometer-balance-staff-for-model-21`, image `Hamilton_21_Balance_Staff.jpg`, 748 px): a bare Model 21 balance staff side-on, the only whole staff found; the model's staff is traced on it (5 October 2026).
- omegaforums.net, "Incoming Hamilton Model 21 chronometer" (thread 78172): side views of the train between the plates (the third wheel lowest with its pinion above it, the fourth pinion long under its wheel; the train-blocking screw's dog point at the fourth wheel), and the train-blocking screw's head circled on the bridge.
- delaneyantiqueclocks.com, Hamilton Model 21 No. 8854 (1941): the dial (sub-dial centres about 0.47-0.51 of the dial's radius) and a side view of the movement.
- Wikimedia Commons, "Hamilton Marine Chronometer Model 21.jpg": the manual's Fig. 13 (1943 edition), public domain.
- Royal Museums Greenwich, five Model 21s in their collection, each with a long catalogue description and four to six photographs (1,280 px; found 5 October 2026):
  ZBA7849 (No. 5674, 1942, `www.rmg.co.uk/collections/objects/rmgc-object-252898`), ZBA7835 (No. 53, 1941, `rmgc-object-252882`), ZBA7845 (No. 3653, `-252893`),
  ZBA7848 (No. 5513, `-252897`), No. 333 (`-79229`). The text of ZBA7849: the barrel's cap "secured with five screws into the edge of the barrel wall"; "The
  barrel has a fixed steel hook and an additional steel-hooking piece in the barrel at the outer terminal of the mainspring, for protection of the hooking.
  This piece runs just under three quarters of the way round the inside of the barrel, a fixed hook in the mainspring proper locating in a hole in the piece";
  the mainspring unsigned; the detent "beryllium-copper (?)" on a nickel block, its passing spring Elinvar, "cranked out to run parallel to the detent blade"; the
  dial 104 mm (104.2 on No. 53) across, held by four screws, the movement by three. Used for the barrel's wall and brace (SHAPE-PASS.md, 109-6). The photographs
  show the box (British Ministry of Defence boxes, a pressed brass sliding catch) and the latch from above and in front (No. 333 and 5674: the knurled head on its
  post, a rectangular plate under it at the lever's end, the lever and its knurled handle to the ring), and the movement from the bridge side, obliquely, with
  the barrel and chain (No. 53); none shows the box's right side, the gimbal straps' screws or the inside of the movement.

Searched without result (5 October 2026), for the records: NAWCC message board threads on the Model 21 (`mb.nawcc.org/threads/...`, "Tool suggestion for
hairspring removal on Hamilton Model 21", "First marine chronometer overhaul", "Hamilton Model 21 #N2623") answer every fetch with a Cloudflare challenge;
the Wayback Machine holds only the last, which has no sizes but names a member's teardown with about 25 photographs, *NAWCC Bulletin* No. 365 (December
2006), behind the members' login. historictimekeepers.com's Model 21 parts page (detent, locking jewel, escapement jewels, escape wheel and pinion,
balance staff) gives no sizes. An eBay listing of Model 21 parts (item 206182812628) and the omegaforums thread "Hamilton Model 21 chronometer porn" (150793)
gave nothing to measure (eBay refuses automated fetches). No supplier lists the Model 21's mainspring by its sizes; Google Patents' Hamilton patents of
1939-1947 (above) give none for the barrel, mainspring, ratchets, stop work, detent or box. YouTube searched through yt-dlp ("Hamilton Model 21
chronometer", "... repair", "... mainspring", "... detent", "... fusee chain", "marine chronometer Hamilton restoration", "... service"): the videos found
are in the table below and in VIDEOS.md.

Searched again without result (5 October 2026), for the critical readings (the barrel's and mainspring's sizes, the detent's sections): Hamilton's material catalogues of 1947, 1951
and 1953 (NAWCC's scans, `pubs.nawcc.org/images/stories/hamilton_errata/material_service_military_catalogs/`) leave the marine chronometer out ("Materials for all war timepieces,
therefore, require separate inquiry direct to the Material Sales Department"), and their mainspring chart lists watch sizes only; neither 42038 nor 42168 is in them. The Wayback
Machine's copies of 19 NAWCC Model 21 threads (found through its CDX index: "Hamilton 21 Stopping" 188579, "Ham 21 pre-war" 127322, "Model 21 mystery part" 161172 and others)
give no sizes; in "Hamilton 21 Stopping" Dewey Clark (historictimekeepers.com) confirms the trip spring is held by one screw on the Z-shaped bracket and that Hamilton's detent jigs
went to Paul Rye. chronometerbook.com's post 4 gives "typically about 0.04 mm thick by 2 mm wide" for most chronometers' detent springs, not the Model 21's ("in two parts").
Google Patents (assignee Hamilton Watch before 1950: "detent", "escapement", "chronometer"; "passing spring" 1930-1952, any assignee, Elgin's US 2,501,266 among them) has no
detent or mainspring patent with sizes. Smithsonian NMAH (its Open Access API: seven Hamilton chronometer records, box sizes only), RMG ZBA0072 (dial "104 mm") and Ingenium give
nothing. The teardown in *NAWCC Bulletin* No. 365 is Doug Sinclair's "From the Workshop: The Hamilton Series XXI Marine Chronometer" (December 2006, p. 707,
`docs.nawcc.org/Bulletins/2000/articles/2006/365/365_707.pdf`, members only); the NAWCC Library's Hamilton Records (Series VI: "Notes on Hamilton Chronometer, 1941-1950", Box 13,
Folder 10; "Subseries A: Specifications and Procedures, 1941-1976") may hold the drawings. YouTube searched again through yt-dlp ("Hamilton Model 21" with barrel, mainspring,
detent, service, teardown, overhaul, restoration, repair, fusee, disassembly; in French and German): the new videos are short showcases, but for bunnspecial's side-on
turntable (`bEWF2ivi1Rg`, used) and "Three marine chronometers" (`wuobTVulVGY`, nothing to measure).

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

Hamilton Watch Company's patents. These are Hamilton's own records of its designs, public on Google Patents and copied here
(`patent-*`, in the table above; published patents may be reproduced freely). A patent shows a principle and the company's intent, not a production part's sizes: it ranks
below the manual, the photographs and the videos, and above a generic text. Hamilton held 64 patents with priority dates
from 1939 to 1947 (Google Patents, assignee "Hamilton Watch"); these bear on the Model 21:
- US 2,356,911, "Balance Wheel" (W. O. Bennett Jr., filed 19 December 1941, granted 29 August 1944): the Model 21's
  balance principle. An unbroken stainless-steel rim and an Invar crossbar, brazed or screwed into a step under the rim
  (Fig. III), so that heat turns the rim into an ellipse; screws in uniformly spaced, diametrically opposed threaded
  holes all round the rim (Fig. I) set how much mass the ellipse carries, to match a hairspring that grows stronger
  with heat, as one of Elinvar may.
- US 2,379,780, "Hairspring Mounting" (Bennett and E. W. Drescher, filed 4 August 1943): clamping the ends of a
  chronometer's hairspring, which has no regulator, so the point of flexure stays fixed ("a change in length of five
  one-hundred-thousandths of an inch in the usual chronometer hairspring will cause a change of rate of one-tenth second
  per day"). Figs. 7-12 draw a split collet and a stud bar holding the spring's end in a U-shaped clamp.
- US 2,457,631, "Cylindrical Hairspring Form" (Bennett, filed 22 September 1943): forming the helical hairspring on a
  stack of discs with a helical guide, each end turned in to the staff and to the cock.
- US 2,391,816, "Hairspring Collet" (Bennett, filed 29 July 1944): a collet counterpoised against the hairspring's
  out-of-poise effect. US 2,385,252, "Balance Screw" (Bennett, filed 12 April 1943), for poising the balance.
- US 2,392,745, "Escape and Balance Staff" (A. J. Kleiner, filed 21 January 1943): hardening the pivots of escape and
  balance staffs, "about 7 thousandths of an inch in diameter" in high-grade timepieces.
- US 2,433,509, "Chronometer Box Securing Support", and US 2,425,602, "Cantilever Support for Gimbal Carried
  Instruments" (Drescher, filed 1945): mounting the box and the gimbals on board.
- CH 273,734, "Uhrwerk, vorzugsweise für Marinechronometer" (filed 19 February 1946, published 16 May 1951; from
  DEPATISnet): a movement whose seconds can be stepped by whole seconds through a planetary gear between the train and
  the escapement. Its drawing is a schematic, not the Model 21's layout.

- A. G. Randall and R. Good, *Catalogue of Watches in the British Museum VI: Pocket Chronometers, Marine Chronometers and Other
  Portable Precision Timekeepers* (British Museum Publications, 1990), cat. no. 117A, pp. 127-128, Plates 78-79 (a public scan in the
  Internet Archive's item `horology-books-and-catalogs`; found 12 October 2026, the figures checked on the page images). A Model 21
  numbered ZE 10228 (BM 1988,4-10,2), assembled for Hamilton UK's managing director "from the last parts available at the factory"
  (dated 1959-65: a late example; its balance is an uncut stainless-steel rim on an Invar arm with a Ni-Span-C spring, not the wartime
  balance). Measured: the barrel's "inside dim. 38 mm, internal available h. 15·3 mm, mainspring h. 15·0 mm, th. 0·44 mm", the
  mainspring with a brace, the arbor solid steel and 13 mm across; the detent 3.00 mm wide, its spring two strips each 0.5 mm wide and
  3.5 mm long, the passing spring's bracket about 2.4 mm tall with a bent horn and a nib, a D-shaped locking stone pinned in a square
  section, a gold stop on the block's extension; the discharge roller a long split collet with two flats, its jewel "with a radius to
  the back of the acting part of the tip", the impulse jewel's face radial; the stop work's spring-loaded slider in the fusee meeting
  a stud in the barrel bridge; the sustaining pawl ("detent") with an integral wire spring parallel to its arbor; the train 90; 14/90,
  12/80, 10/75, 10/16 (the model's), 14,400 beats an hour; the motion work 14, 18, 54, 56 and the up-and-down 12/120; the dial ring's
  flange 106.6 mm reduced to 97.7, 9.0 thick, "front plate" 97.8 and "back plate" 87.7 across (which plates these name isn't sure:
  the back plate is described as the one on three pillars with the barrel's and fusee's cut-outs, the upper train bridge, whose rim the
  model has at r 40.5; the 87.7 is the pillar plate's 87.57), the frame 46.6 mm high. Plate 79b reproduces Hamilton's drawing of the
  stud, hairspring and collet; 79c the mainspring and brace; 79d the rate certificate. Used in OPEN-QUESTIONS.md (the mainspring, the
  detent, the discharge jewel, the collet).

Searched without result (12 October 2026), for the open readings (OPEN-QUESTIONS.md): HathiTrust's full-text search and Google Books
(refused: a Cloudflare check and the API's quota); scholar.archive.org (an anti-scraping check); the Internet Archive's full-text search
("42038", "42087", "42088", "0.0165" with mainspring, "model 21" with mainspring, detent or Elinvar, "lift angle" with Hamilton,
"Bureau of Ships" with Hamilton chronometer, "spring, main" chronometer: only advertisements and parts queries in *American Horologist
& Jeweler*, 1963-1981); RMG ZBA4526 (Hamilton No. 4E019, its impulse roller "0.250" dia", no spring sizes); Navy Department
Specification 18W7 (1945, the chronometer watch, not the Model 21); TM 9-1575 (1945, no chronometers); NAVPERS 10193-A (1961);
Gould (1923/1960, no Hamilton); Bowman (1945); T. Bales's Time Travelers Clock manual (2022; a Model 21 kept in step with GPS by
turning it, no amplitude); the NAWCC Bulletin's articles (docs.nawcc.org 403; the Wayback Machine holds only login pages) and threads
185214, 164627, 166328, 154431, 156100, 60629 through the Wayback Machine (no sizes; Smith's article is in the Bulletin of January/February
2012, from p. 57; Van Hoesen made the detents; DeweyC: Hamilton detents nearly unobtainable). Whitney's *The Ship's Chronometer* and
Betts's Greenwich catalogue have no online copy. YouTube, about 95 queries (timegrapher, amplitude, lift angle, free swing, mainspring,
detent, in ten languages) and the channels of every video's maker: 17 new Model 21 videos (References/VIDEOS.md), none with a free
run-down, a timegrapher, the mainspring out or the detent out; Bilibili refused (HTTP 412).

Searched again (12 October 2026), forums, photographs and archives: 51 NAWCC threads through the Wayback Machine (its CDX index of
`mb.nawcc.org/threads/*`, 11 pages, and the old `showthread.php` addresses; 13 copies empty, 3 not archived; attachments only as 250 px
thumbnails), uhrforum.de (403), forum.watch.ru (502), WatchUSeek (a bot wall), practicalmachinist (403), Worthpoint, eBay and Rock
Island (403, through the Wayback Machine too), LiveAuctioneers, Invaluable, Heritage, Etsy, Flickr, Commons, the Science Museum Group,
Reddit (PullPush), tz-uk, thewatchforum, hamiltonparts.com, Google Patents (Hamilton before 1955): no measured mainspring, detent or
trip spring, no amplitude or lift angle, no run-down. Found: Hamilton's assembly record card for No. 2E10860 (March 1945, "JOB-
ISOCHRONISM"; landandseacollection.com/id1352.html, 1,000 px): an isochronism row in turns of swing from 1 to 1½, read roughly "ok",
+.2, +.7, +.9, 1.2 (units and signs uncertain at this size; probably seconds a day), the mainspring's maker likely "Wallace Barnes",
the balance screws' corrections; Jones-Horan lots 63662 (sale 230507) and 38240 (sale 1902), the box's side square-on with the latch
support bracket's two screws (OPEN-QUESTIONS.md); nonosore's two break-circuit Model 21s (ramassespoussiere.free.fr/Model21.html, 59
photographs: the escapement side-on under the train bridge, 43.jpg, the flexure hidden); Duwan's No. 3922 on forumamontres (the detent
assembly out, oblique, 794 px; the mainspring relaxed beside its barrel, 7-8 open turns); horlogeforum.nl thread 462279 (the barrel and
arbor out, 4,032 px); G. Franco Toriz's balance staffs (LinkedIn, 2019; the arm's seat labelled 2 mm). Qualitative: a worn trip spring
taken up by slotting its screw's hole (forumamontres t189277; NAWCC 154431); DeweyC: the first ~400 had a steel detent and a one-piece
roller, detents now over $700. The searches and downloads are in `$MC_VIDEO/oq/` (outside the repository).

Not yet consulted (found 4 October 2026). These may hold facts about the Model 21 itself:
- NAWCC Library and Research Center, Hamilton Records Collection (71 boxes), Series V: Chronometers, 1940-1984
  (https://archive.nawcc.org/repositories/2/archival_objects/11056). The catalogue's tree is public
  (`/repositories/2/resources/54/tree/node?node=...`); the items aren't online. Those on the Model 21, with their places:
  - Drawings: "Chronometer Parts", 1943-1951 (Box 14, Folder 6); "Patents", 1942-1946 (Box 14, Folder 7); "Various Parts
    and Assembly", 1942-1943 (Box 14, Folder 8); "Assembly of M21, M22, M23 Chronometer Watches", 1942-1957 (Box 14,
    Folder 10).
  - Photographs: "Marine Chronometer Parts", not dated (Box 14, Folder 3).
  - Data and correspondence: "Elinvar Fuse Chains", 1945-1946 (Box 12, Folder 10); "Detailed Bill of Materials,
    Department of Defense" (Box 12, Folder 11); "Chronometer Assembly Operations", 1944-1960 (Box 12, Folder 12).
  - Leroy May's papers: "Notes on Hamilton Chronometer", 1941-1950 (Box 13, Folder 10); "Data, Drawings, and
    Correspondence", 1941-1977 (Box 13, Folder 11).
  - Publications and procedures: "Care and Handling of the Hamilton Marine Chronometer", 1945 (Shubrooks and Drescher;
    Box 13, Folder 5); "Hamilton Ship Chronometer Manual", 1948-1950 (Box 13, Folder 14); "Leveling and Reassembly of
    Ship Chronometer", 1981-1984 (Drescher; Box 13, Folder 17); "The Hamilton Marine Chronometer (Draft #2)", 1977
    (Box 12, Folder 3).
  Copies through the library's research service (research@nawcc.org, 717-684-8261; $40 a question for non-members,
  free for members: https://nawcc.org/index.php/library-research). Membership (about $112 a year in 2025) also opens
  the whole *Bulletin* archive, with Smith's pages 60-63.
- Marvin E. Whitney, *The Ship's Chronometer* (American Watchmakers Institute Press; listings give 1984, 1985 and 1991,
  ISBN 0918845084, and Smith's article 1981). Whitney was a chronometer maker at the U.S. Naval Observatory during the war, and the book gives a
  first-hand account of how the Model 21 and 22 were developed.
- Jonathan Betts, *Marine Chronometers at Greenwich* (Oxford University Press): its chapter "How the Chronometer was Made"
  covers the 19th-century English trade, from bare metal to delivery on board.
- W. J. Gazeley, *Clock and Watch Escapements* (1956), and George Daniels, *The Practical Watch Escapement* (1994): how
  the detent escapement is drawn and made.
- Rupert T. Gould, *The Marine Chronometer: Its History and Development* (1923), on the Internet Archive
  (https://archive.org/details/the-marine-chronometer): the English chronometer's construction in general.

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
| TN24H - Clocks & Watches, "Assembling and Testing 1941 Hamilton Chronometer Model 21" (https://www.youtube.com/watch?v=3SFDplGq6vs) and "Exploring Clock 15: Disassemble Hamilton Marine 21" (https://www.youtube.com/watch?v=R-DrJz1DYOY), 4.5 and 3.5 min, 1080p; one movement, dial N4104 | Every part laid flat, the barrel face-on with its spring and arbor, the movement side-on with the barrel and chain | The barrel's wall (0:16), the arbor's core, the coils' pitch; **the barrel's size**, its cap flat beside the fusee wheel (0:12.6; VIDEOS.md) |
| James Martin, "Hamilton Model 21 Inspection for Rob from Michigan # 131" (https://www.youtube.com/watch?v=SNLqsS9wrrM), 9 min, 720p; "Sounds of a Hamilton model 21 ..." (xDKFZaY88cM) | A unit inspected, not taken down: shipping can, case, dial, escapement, the barrel and fusee side-on | Searched for the ratchets, collar and stop work: not shown |
| bunnspecial, "Hamilton Model 21 Marine Chronometer, Part 2 of 3", 2 min, 720p (https://www.youtube.com/watch?v=bEWF2ivi1Rg) | The movement in its case's bowl on a turntable, side-on under a long lens: barrel, chain, fusee and pillars in profile | The barrel a plain cylinder, its edge against the pillar plate's (rough) |
| Deafboy, "Hamilton Model 21 detent" (https://www.youtube.com/watch?v=XJQCgMV_GA8) and "... ship's chronometer (4k)" (W9gy2gjvZHc); pefkipefki, "Hamilton model 21 chronometer detent escapement" (FpolZSipVmQ) | The escapement running through the keyhole; a movement out of its case at 4K | Searched for the detent's heights, the trip spring and the collet: blurred or hidden |
