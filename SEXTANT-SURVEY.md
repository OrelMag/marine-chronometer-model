# A sextant model: effort and source survey

27 October 2026. An estimate and a first search for sources, nothing built. The owner's word: keep the survey, no further work for now.

## What exists already

No sextant is drawn anywhere in the project. The arithmetic is done: `shared/almanac.js` has `ALM.sextant` and `ALM.sextantLunar` (what a sextant would read at a time and place: refraction, dip, the index correction) and `ALM.correct` (a sextant altitude reduced to the observed altitude), which the essay's sky sections use for the time sight, the noon sight and the lunar distance.

## What a fully 3D, correct sextant would take

By the project's own rules (every outline measured on a photograph, frame or drawing; the sources outrank estimates), as the two chronometers were built:

1. **Sources** for one chosen instrument: a manual with a parts catalogue, patents, photographs, a teardown video. This decides most of the effort (below).
2. **Geometry**, about 40-60 parts: the frame, the arc and its rack, the index arm with its worm, clamp and micrometer drum (and vernier), the index and horizon mirrors with their adjusting screws, the index and horizon shades, the telescope and its bracket, the handle and legs. Each part measured (the measure-trace skill), closed solids, a BOM, `solids.py`/`audit.py`-style checks.
3. **Optics, correct by physics**: the double reflection (the angle read twice the arm's turn), the half-silvered horizon mirror, the worm and drum's reading, and the four instrument errors (perpendicularity, side error, index error, collimation) by ray tracing, tied to `ALM.correct`'s index correction; a Node check like `escapement.js` proving them.
4. **The view through the telescope**: the split field, the Sun or a star brought down to the horizon as the drum turns, rendered from `ALM` at the essay's time and place, so a sight taken in 3D reduces with the essay's own tools.
5. **The page**: an essay figure or a page of its own (as `/hamilton/`), `smoke.py`, `sitecheck.py`, the changelog, a release.

| Scope | What it gives | Effort |
|---|---|---|
| Essay-figure grade | one instrument from photographs (and a drawing if found), correct optics, the drum, the telescope view, in the sky sections | about 2-4 days of sessions |
| Model grade (the Hamilton's and Wempe's standard) | the above, every part measured, a BOM, the errors and their adjustment as a walkthrough, a verification report, maker's sheets | about 1½-3 weeks |

The optics can be exactly correct whatever the sources; the parts no source shows (the worm, the rack's tooth form, the micrometer's inside) stay estimates until a manual or a teardown shows them.

## Candidates

**US Navy Mark II (the recommended one).** The Model 21's Navy contemporary, made in the war by David White, the Pioneer Division of Bendix Aviation and Ajax Engineering; Scientific Instruments of Milwaukee later bought David White's Mark II parts and machinery (dealer pages, not a primary source). Its arc reads to 145° (strictly a quintant), its drum and vernier to 6″ (dealer listings).
- Its manual is in the same series as the Hamilton's: **NAVSHIPS 250-624-6**, *Manual for Overhaul, Repair and Handling of Sextant and Fiske Type Stadimeters with Parts Catalog*, Bureau of Ships, November 1951 (1953 imprint), iv + 123 + 2 pp., illustrated, contract NObs-47863, prepared with Navy repair activities and Schick, Inc., Stamford, Conn.; a service bulletin NAVSHIPS 250-624-6-1 beside it. The catalogue record marks it official use, sent to depository libraries. A parts catalogue there would do for the sextant what Sec. XI does for the chronometer. **Not found online**: not on archive.org (searched); HathiTrust refused the search (403), so whether it is there in full view is unchecked.
- Photographs: Land and Sea Collection's Mark II and Mark III pages, Patriots Point's, CHSI's Mark II.

**C. Plath (a companion for the Wempe).** The German maker; the Navy's later Mark III was made under licence from Plath (by Scientific Instruments, until 2008). No service manual found; the Navistar came with an instruction booklet, no scan found. A collector's account of dismantling a 1956 Plath geodetic sextant (de Hilster) and museum records (Ingenium, Royal Museums Greenwich).
- Video: Cassens & Plath, "Parts of a SEXTANT, how it is made, which one to choose", YouTube `Pa_8UbmjLc4`, 21:07, a factory's view of the parts, usable to measure shapes on. Also "C. Plath sextant from April 1959", `sbkBAmfKgV4`, 1:31.

## Other sources found

- Bruce Bauer, *The Sextant Handbook: Adjustment, Repair, Use, and History* (McGraw-Hill, 1986; 2nd ed. 1995, 192 pp.): taking apart and putting together, the adjustments, oiling and cleaning.
- A second sextant book, its contents on morkniga.ru (p209162): chapters on dissection (removing the subassemblies), the rack and micrometer (taking the micrometer apart and back), a Brandis / US Navy Mark II section, restoration. Title and author not confirmed.
- US 2,252,341 (P. F. Everitt, Henry Hughes & Son, filed 8 March 1938, British priority 7 June 1937): a sextant's micrometer screw, drum and worm gearing, a totaliser; three sheets, Figs. 1-8. A British instrument, not the Mark II.
- *Basic Optics and Optical Instruments* (the Navy's Opticalman 3 & 2 training manual, Dover reprint): the optics' theory; whether it has a sextant overhaul chapter unchecked. The Opticalman 1 & C manual unchecked.
- Videos on YouTube (searched with yt-dlp): use and errors only, nothing taking a marine sextant apart. "Adjustable errors of the sextant" (`HTJDBC4GPZQ`, 18:32), "Non-adjustable errors of the SEXTANT" (`NAFM-0BbUE8`), "Checking Index Alignment on a Davis Mark 15" (`HRRemMwuozI`). A Kollsman periscopic (aircraft) sextant teardown (`3QyCG4E0w5A`, 40:54) is another instrument. Several searches came back empty (perhaps rate-limited): "US navy mark 2 sextant", "C Plath sextant", "sextant overhaul", "Hughes Husun sextant"; worth trying again.

## What would settle it

1. A copy of NAVSHIPS 250-624-6: HathiTrust (searched by hand), a depository library's scan, DTIC, the NAWCC library, collectors (who cite these manuals by number), a used copy. With it the Mark II can be built to model grade.
2. Without it, the Mark II at essay-figure grade from dealers' and museums' photographs, the hidden parts estimated and said so.

## Links

- NAVSHIPS 250-624-6, catalogue record: https://mocat.library.unt.edu/catalog/704-16562
- US 2,252,341: https://patents.google.com/patent/US2252341
- Mark II, Land and Sea Collection: https://landandseacollection.com/id888.html
- Mark III, Land and Sea Collection: https://landandseacollection.com/id833.html
- Mark II, Patriots Point: https://patriotspoint.org/artifacts-archives/mark-ii-us-navy-sextant
- Mark II, CHSI: https://chsi.emuseum.com/objects/897/navy-sextant-mark-ii
- Bauer, *The Sextant Handbook*: https://mhprofessional.com/the-sextant-handbook-9780070052192-usa
- The second book's contents: https://www.morkniga.ru/p209162.html
- 1956 Plath geodetic sextant dismantled: https://dehilster.info/geodetic_instruments/1956_c_plath_geodetic_sextant.php
- Admiralty sextant, Royal Museums Greenwich: https://www.rmg.co.uk/collections/objects/rmgc-object-43441
- Plath Navistar, Ingenium: https://collection.ingenium.ca/en/id/1997.0307.001
- Cassens & Plath video: https://www.youtube.com/watch?v=Pa_8UbmjLc4
