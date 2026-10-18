# A third model, Swiss or Japanese? Source survey

16 October 2026. A desk survey for E:\Marine-Chronometer. It asks whether a Swiss or a Japanese marine chronometer has enough sources to be modelled to the repo's standard: every outline, size and place measured on a source (a dimensioned drawing, a manual's figure or text, a photograph, a video frame), never drawn by eye. Searched in English, French, German and Japanese: the web, YouTube (its search results scraped directly, with each video's length and best resolution read off its page), auction archives, museum records and Google Patents. Japan is covered only briefly here, because another agent is covering Japanese sources in depth. Nothing was downloaded: no freely available dimensioned PDF turned up for any candidate.

How to read the ratings:
- **dimensioned source**: a drawing, manual or patent gives the sizes.
- **measurable from photos/video**: a place or outline can be traced and put in mm with the repo's tools (`video.py`, `rimfit.py`, `fcal.py`), on footage good enough for it.
- **estimate only**: nothing shows it well enough to measure.

For comparison, the Hamilton has the 1948 NAVSHIPS 250-624 manual (with figures, a parts list and tolerances) plus 4K teardown videos. The Wempe has 124 works drawings.

---

## 0. What the repo already holds that is Swiss

- `References/photo-dial-ulysse-nardin-noaa.jpg`: the NOAA Heritage photograph ("Friday Find", July 2024) of a Ulysse Nardin used by the U.S. Coast and Geodetic Survey in the 1940s. It shows the dial in its box and nothing of the movement. It is already used for the Variants panel's Swiss dial.
- `References/patent-CH273734-movement-for-marine-chronometers.pdf`: **not Swiss in origin.** It is Hamilton's patent, filed in Switzerland: "Uhrwerk, vorzugsweise für Marinechronometer", Hamilton Watch Co., filed 19 Feb. 1946 and published 16 May 1951. It shows a schematic movement that steps the seconds, not a Nardin and not the Model 21.

So the repo holds no Swiss movement source at all.

## 1. Key context: the Nardin is the parent of both existing and candidate designs

- Royal Museums Greenwich (RMG) describes several Model 21s as "Hamilton's version of Nardin's standard M.G.F. type": a two-day, full-plate fusee movement with four pillars. Its caption for print F1098/F1099 says Nardin's "model M.G.F. ... a superb design and the one adopted by ... Hamilton in 1941 to be the basis of their rapidly produced ... Model 21". https://www.rmg.co.uk/collections/objects/rmgc-object-201808 (ZBA0072, 1941, one of the first 125)
- JCK, "How Hamilton Watch Co. Won World War II": after 26 Feb. 1941, Hamilton staff "studied chronometers, the Nardin model, and maritime and military needs". The changes it lists are the balance and hairspring assembly and a modified detent. https://www.jckonline.com/magazine-article/how-hamilton-watch-co-won-world-war-ii/
- RMG ZAA0268 is a **Seiko** two-day chronometer of about 1920, "a replica of a Swiss chronometer by Ulysse Nardin of the 1910-20 period". Auction listings for the wartime Daini Seikosha cite Knirim (2001) for a Nardin-identical construction. https://www.rmg.co.uk/collections/objects/rmgc-object-79373

**What follows:** a Nardin M.G.F. would be a near-sibling of the Model 21 already built, and the Seikosha a near-copy of the Nardin. The three would share one layout and differ in their materials and fine geometry:
- plates: gilt brass on the Nardin, nickel alloy on the Hamilton;
- detent: steel strip on the Nardin, beryllium-copper on the Hamilton;
- balance: cut bimetallic or Guillaume "Integral" on the Nardin, the Hamilton's ovalising Invar/steel balance;
- bridges: the Nardin has a separate fusee/barrel bridge and an escape wheel under its own bridge;
- sizes.

The Hamilton manual's dimensions **cannot** be carried over to a Nardin. Hamilton changed parts, and the repo's standard would need the Nardin's own sources.

---

## 2. Ulysse Nardin (Le Locle): marine chronometers, M.G.F. and other calibres

About 10,000 marine and deck chronometers were made between 1900 and 1975, per Bonfigli's HSNY lecture. Nardin supplied the U.S. Navy and USC&GS, and some 50 navies. Known calibre designations:
- **M.G.F.** (the standard large two-day);
- **"Cal. 83"**: an 83 mm movement (Antiquorum No. 5529);
- **M.70.F**: a 66 mm "marin petit format", of which "only 110 ... produced 1944-1975" (Dr. Crott 95th auction, lot 388, No. 5991, with a 32 mm Guillaume-screw balance);
- a small two-day with a 75 mm dial (BADA/Pieces of Time);
- the deck chronometers.

All have an Earnshaw spring detent, fusee and chain, and Harrison's maintaining power.

### Sources found

| Source | What it is | Dimensioned? | Access |
|---|---|---|---|
| U.S. Navy/USC&GS manual for Nardin chronometers | **None found.** NAVSHIPS 250-624 covers the Hamilton only. Watch forums mention a short Navy care-and-handling sheet, which is operating instructions, not an overhaul manual with figures | — | — |
| Ulysse Nardin Heritage dept. (Massimo Bonfigli) and the company museum, Le Locle (opened Nov. 2021) | The maker's archive. Whether works drawings of the M.G.F. survive and can be seen is **unknown**; nothing is published online. HSNY lecture recap: https://hs-ny.org/news/recap-ulysse-nardin-exploring-the-world-of-chronometry-since-1846-by-massimo-bonfigli-and-jean-christophe-sabatier | Possibly (the only route to a Wempe-like set) | Request only |
| NAWCC LARC, Hamilton Records Collection, Series V "Chronometers" (1940-84) | Research reports, test data, **drawings**, photographs, BuShips bulletins. Hamilton studied the Nardin in 1941, so a teardown study of a Nardin *may* be in it (e.g. Box 13 f.10 "Notes on Hamilton Chronometer, 1941-1950", Leroy May papers). Unverified. https://archive.nawcc.org/repositories/2/archival_objects/17082 | Possibly | On-site / request (research@nawcc.org) |
| Swiss patents CH 2960 and CH 2993, Paul-D. Nardin, filed 20 Dec. 1890 ("Perfectionnement apporté à la construction des chronomètres de marine") | Winding (G04B3) and adjusting the balance's beat. https://patents.google.com/patent/CH2960A/fr, https://patents.google.com/patent/CH2993A/fr | A mechanism's schematic only; 1890s, not the 20th-century calibre | Free |
| Betts, *Marine Chronometers at Greenwich* (OUP 2017) | Every RMG chronometer dismantled and recorded, with "extensive tabulated data". Whether it has a Nardin entry is unconfirmed; it should have the Seiko Nardin-replica ZAA0268 and the Hamiltons | Partly (tabulated measurements, not drawings) | Paid / library |
| Gould, *The Marine Chronometer* (1923), p. 201 | The Guillaume "Integral" balance, as used by Nardin | Generic | Library / reprint |
| Whitney, *The Ship's Chronometer* (AWI 1991) | A USNO chronometer maker. Says the Model 21 was "based on the Nardin", and gives disassembly, cleaning and oiling in general terms | No (descriptive) | Library / second-hand |
| Auction lots: Antiquorum No. 5529 (Cal. 83) https://catalog.antiquorum.swiss/en/lots/ulysse-nardin-lot-165-5 and No. 2363 https://catalog.antiquorum.swiss/en/lots/ulysse-nardin-lot-131-2; Christie's No. 5472 (c.1944) https://www.christies.com.cn/lot/lot-289165 and No. 5107 https://www.christies.com.cn/lot/lot-1618974; Dr. Crott No. 5991 M.70.F https://uhren-muser.de/en/archives/95/44429; Bonhams No. 243 (for F. Dencker) https://www.bonhams.com/auction/22622/lot/31/; BADA/Pieces of Time c.1945 https://www.bada.org/object/small-two-day-marine-chronometer-nardin; Gazette Drouot deck chronometers | Text gives movement diameter, jewel count, balance type, dial diameter (100-104 mm) and box size. Usually 1-7 photos of the movement, assembled | Overall sizes only | Free |
| Museum records: RMG (deck watches F1098/F1099, ZAA0268); Grinnell College physics museum (a 5-inch Nardin with a USNO tag dated 28 Sep 1945) https://omeka-s.grinnell.edu/s/physicsmuseum/item/5216; Musée d'horlogerie du Locle (a Nardin with a quartz attachment on display; no online catalogue) | Photos of the outside, short text | No | Free / visit |
| NOAA Heritage photo (already in repo) | Dial in box | No | Free |
| Swiss generic texts: Defossez, *Théorie générale de l'horlogerie* (2 vols, La Chaux-de-Fonds 1950-52, for the Swiss watch schools); Grossmann, *Horlogerie théorique*; Reymondin et al., *Théorie d'horlogerie* | How to design and calculate a detent escapement and a train, **not any one chronometer's dimensions** | Generic only | Library |
| *Bulletin annuel de la SSC* / *Journal suisse d'horlogerie* | Articles on marine chronometers exist, e.g. "Le chronomètre de marine électronique à quartz" (Nardin/Ébauches, 1961). No article dimensioning the mechanical M.G.F. found online | Not found | Library (SSC; e-periodica coverage partial) |

### Videos (YouTube; IDs checked, best resolution in brackets)

| ID | Title / channel | Length | What it is |
|---|---|---|---|
| **MeRB0AGrJrw** | "What is inside a Ulysee Nardin marine chronometer, Part 1", bunnspecial (2021) | 35:19 (720p) | A full take-apart for cleaning by an amateur |
| **yqf3jbSKkNQ** | "What is inside a Ulysse Nardin marine chronometer, part 2", bunnspecial | 40:26 (720p) | Continued: parts out, reassembly |
| wuobTVulVGY | "Three marine chronometers", bunnspecial (2020) | 18:06 (720p) | Nardin, Seikosha and Hamilton side by side ("a Swiss original with copies from Japan and America") |
| gEmo6GOkWEc | "Two Marine Chronometers", bunnspecial (2024) | 13:41 (720p) | Two Nardins; the earlier one an ébauche from another maker finished by Nardin |
| WH7vNL07atU | "Marine Chronometer from ebay", bunnspecial (2026) | 26:51 (720p) | An older Nardin of a different style |
| HQABgn6klYA | "Ulysse Nardin Marine Chronometer Repair", watchmakerUA | 2:15 | A short clip |
| rUvieKqhviw / vt43nC5XeAY | Nardin two-day SN 3551 "inside", Black Water Pictures | 1:01 / 0:31 | Walk-around clips |
| y65WQc0VIXw, SiErT48sWsA, ao1tl29Lzio, Ad1ovwcbSa0 | Nardin marine/deck chronometers running | under 1:15 each | Running footage only |

**What these videos can and cannot settle.** bunnspecial's two parts (75 min together) are the only Nardin teardown found. They run at **720p**, against the Hamilton's 4K KLUwI2UUCMQ, and were filmed handheld by an amateur.
- **Can:** tooth counts of wheels seen whole (`video.py count` works at 720p only where a wheel fills the frame); the pillars' and bridges' plan layout, traced against the plate's rim with `rimfit.py`; the general shapes of the bridges, cock and detent.
- **Cannot:** the escapement's geometry (detent, roller, locking stone and discharge pallet: tenths of a millimetre); the fusee's profile; pivots, endshake, jewel sizes or heights, to the standard used on the Hamilton.
- **Unknown:** which calibre is filmed (M.G.F. or earlier). That must be checked before any of it is used.

### Coverage table: Ulysse Nardin M.G.F. (two-day)

| Area | Rating | Notes |
|---|---|---|
| Frame (plates, pillars, bridges, cock) | measurable from photos/video | Overall diameter from lot texts (e.g. 83 mm); the layout traced on bunnspecial frames and auction photos. Heights coarse |
| Going train | measurable from photos/video (counts); estimate only (modules, pivots) | Tooth counts readable if the wheels are shown whole; no published counts found |
| Escapement (detent, roller, escape wheel) | estimate only | Too small for 720p; no dimensioned source |
| Balance / hairspring | estimate only (sizes); type from photos | Cut bimetallic or Guillaume "Integral", four weights; the 32 mm balance is quoted only for the M.70.F |
| Fusee, chain, barrel, maintaining power | measurable from photos/video (outline); estimate only (fusee profile, spring) | |
| Dial and hands | measurable from photos | NOAA photo; many auction dials; dial 100-104 mm quoted |
| Box and gimbals | measurable from photos | Box sizes quoted (e.g. 190 mm square); three-tier mahogany |

**Verdict: not enough** for the repo's standard as things stand. It would be **close** only if the Nardin Heritage archive or the NAWCC Hamilton papers yield drawings or a measured study. Photographs and a 720p amateur teardown can give a layout and tooth counts, but the escapement and the fusee would be estimates. Those are the parts the repo cares most about, and the parts the Hamilton and Wempe models have sources for.

### Other Swiss makers

| Maker | What exists | Verdict |
|---|---|---|
| Paul Ditisheim (La Chaux-de-Fonds) | A few marine chronometers with Guillaume balances (e.g. No. 132, video KRMPNuJU934, 1:16); auction photos | Not enough: a handful of examples, no drawings, no teardown |
| Zenith | Deck and marine pieces (calibre 260, bezel-wound: N8UdEqUkwEE, 0:57). The "Torpedo boat timepiece Zenith" series (GOD0QIlCsCg, 4 parts) is a 1902 piece with a **Vail USA** movement | Not enough |
| Paul Buhré, Mathey-Tissot, Girard-Perregaux, Longines | Mostly deck/torpedo-boat watches (lever escapement); few box chronometers; no technical sources found | Not enough |
| Swiss observatory/school competition chronometers (Technicum du Locle under Defossez/Pellaton) | One-off pieces; Antiquorum describes a school 22''' spring-detent competition movement | Not enough (one-offs) |

Pivoted or spring detent: every 20th-century Swiss marine chronometer found uses the Earnshaw **spring** detent. The pivoted detent appears only on continental (French, German) pieces and some pocket chronometers, so it is not a factor for a Swiss box chronometer.

---

## 3. Japan: Seikosha / Daini Seikosha 経線儀 (brief; another agent is covering Japanese sources in depth)

- **Design:** a two-day fusee, Earnshaw spring detent, bimetallic balance and 56 h indicator, a reproduction of the Nardin. RMG ZAA0268 (about 1920) is catalogued as a Seiko replica of a 1910-20 Nardin. The wartime version (1942) is described in the Seiko Museum Ginza's record: "Around 500 pieces were manufactured at the request of the Imperial Japanese Navy", best daily rate 0.1 s. http://museum.seiko.co.jp/en/collections/clock/collect006/
- **Survivors:** the Seiko Museum's example; RMG ZAA0268; auction lots (HiBid, V-376, about 1943, citing Knirim 2001 for its construction); a collector example with a broken detent.
- **Video:** bunnspecial's "Three marine chronometers" (wuobTVulVGY, 18:06, 720p) compares it with a Nardin and a Hamilton. No Seikosha teardown was found in English or in a brief Japanese YouTube search (精工舎 経線儀 / マリンクロノメーター 分解).
- **Dimensioned sources:** none found. An IJN manual or Seikosha drawings would have to come from Japanese archives (JACAR, Seiko Museum), which is the other agent's ground.

**Verdict: not enough** on what this survey found. Since it is a Nardin copy, it inherits the Nardin's gaps, unless Japanese archives hold Seikosha's works drawings or an IJN manual with figures. If they do, it would become the best-supported Nardin-pattern chronometer.

---

## 4. Alternatives noticed

- **Thomas Mercer (St Albans, England):** the most numerous British maker.
  - Books: Tony Mercer, *Mercer Chronometers: History, Maintenance & Repair* (repair and rating chapters; 2003 edition per one seller) and *Mercer Chronometers: Radical Tom Mercer and the House He Founded* (1978, 251 pp.).
  - Videos: bunnspecial "How I take apart a Marine Chronometer, Thomas Mercer" (o8lIysjIo9E, 1:05:47, 720p); Cornehl clips (z_XsSusop0Q, 8s5rw9S1rLE).
  - RMG/Betts tabulated data for many English chronometers.
  - Gaps: no works drawings or Admiralty manual with figures found. Only somewhat better than the Nardin, because of the repair book. Verdict: not enough.
- **GUB Glashütte (East German, postwar Einheits pattern):** READ Repairs #008 (4lgd_h9Ai98, **2:06:25, 1080p**) takes a GUB No. 8408 fully apart and cleans it, gimbals and dial included. It names the Glashütte museum archive. It is essentially the Wempe/Einheits design already modelled, so it is useful as a check on the Wempe or the 6MX, not as a new third model.
- **Soviet 6MX:** already being built on the Wempe's branch (`claude/wempe-6mx`).
- **Hamilton Model 22 (deck watch):** a U.S. Navy design with its own Navy literature. American, not Swiss or Japanese; not checked further.

---

## 5. What would change the verdict

1. **Ulysse Nardin Heritage (Le Locle):** ask whether works drawings, a parts list or calibre sheets for the M.G.F. (and the M.70.F) survive and can be studied. This is the one source that could make a Nardin model Wempe-grade.
2. **NAWCC LARC, Hamilton Records Series V:** ask whether Hamilton's 1941 study of the Nardin (measurements, drawings, comparisons) is in the boxes (e.g. the Leroy May papers).
3. **Betts (OUP 2017):** check from a library copy whether it has Nardin or Seiko entries with tabulated dimensions.
4. **Japanese archives (the other agent):** Seikosha drawings or an IJN manual.
5. **Owners and the NAWCC (as in REQUESTS.md):** measurements or high-resolution photographs of an M.G.F. taken apart, from people who own one. Not the user: the user has no chronometer.

Without 1, 2 or 4, a Swiss or Japanese third model would rest on photographs and one 720p amateur teardown. Its escapement, fusee and balance would be estimates throughout, which falls short of the standard the Hamilton and the Wempe meet.
