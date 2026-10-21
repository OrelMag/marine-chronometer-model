# Wempe Einheits-Chronometer (`Federchronometer 05`) — Inferred & Back-Calculated CAD Specifications

This document provides the engineering and dimensional parameters for the five component groups called out on the **Federchronometer 05** cross-section that do not have standalone detail sheets in the DGC archive. Dimensions are back-calculated from the mating `kompl.` assembly blueprints, DIN/HGN watchmaking standards, the Soviet 6МХ (`ТУ 25-07.1533-84`) derivative specifications, and proportional scaling of the cross-section drawing.

---

## 1. Fusee Stop-Work Assembly (`Stellhebel`, `Stellfeder`, `Stellkloben`)

Mounted in the recess on the underside of the `Unterplatte` (`05-08_03a/b`, `05-08_32-2`) directly beneath the fusee cone (`05-06_01`). When the fusee chain reaches its final winding turn at the top of the cone, it lifts the angled beak of the `Stellhebel`, raising its stop-shoulder into the path of the fusee `Vorreiber` (`05-06_06`).

| Sub-Component | German Label | Material | Parameter / Dimension | Specification |
| :--- | :--- | :--- | :--- | :--- |
| **Stop-Work Stud / Block** | `Stellkloben` | Brass / Steel | Footprint ($L \times W \times H$) | $9.0\text{ mm} \times 4.5\text{ mm} \times 3.2\text{ mm}$ |
| | | | Fasteners | $2 \times \text{M1.4}$ screws + $1 \times \varnothing\ 1.0\text{ mm}$ steady pin |
| | | | Transverse Hinge Pin (`Stift`) | $\varnothing\ 1.00\text{ mm}$ hardened steel, $1.80\text{ mm}$ below lower plate face |
| **Stop Lever** | `Stellhebel` | Hardened Steel | Total Length (Pivot to Beak) | $24.50\text{ mm}$ (matches `Wempe_001.jpg` top-down layout) |
| | | | Main Beam Cross-Section | $1.50\text{ mm}$ vertical thickness $\times 2.80\text{ mm}$ width |
| | | | Stop-Shoulder Width | $4.20\text{ mm}$ at the `Vorreiber` impact zone |
| | | | Chain-Contact Beak | $22^\circ$ upward angle, polished convex top radius $R\ 2.50\text{ mm}$ |
| | | | Vertical Lift Stroke | $1.60\text{ mm}$ angular travel to block the $2.00\text{ mm}$ `Vorreiber` step |
| **Stop-Work Leaf Spring** | `Stellfeder` | Spring Steel | Active Length $\times$ Width | $16.00\text{ mm} \times 2.50\text{ mm}$ |
| | | | Tapered Thickness | $0.45\text{ mm}$ at clamping screw ($\text{M1.4}$) tapering to $0.22\text{ mm}$ at tip |

---

## 2. Standalone Motion-Work Pinions & Tubes (`Viertelrohr`, `Wechseltrieb`, `Stundenrohr`, `Auf- u. Abtrieb`)

Derived from the center distances and assembly stacks on `Wempe_05-02_01.jpg`, `05-02_06.jpg`, `05-02_08.jpg`, and `05-02_10.jpg`:

| Component | Part Code | Teeth ($z$) | Module ($m$) | Pitch Dia ($d_p$) | Tip Dia ($d_a$) | Axial & Bore Geometry |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Cannon Pinion (`Viertelrohr`)** | `05 02 03 - 1` | $14$ | $0.45\text{ mm}$ | $6.30\text{ mm}$ | $7.15\text{ mm}$ | • **Total Axial Length:** $11.80\text{ mm}$<br>• **Gear Face Width:** $1.80\text{ mm}$<br>• **Outer Tube OD:** $\varnothing\ 2.80\text{ mm}$ (lower body), $\varnothing\ 2.20\text{ mm}$ (minute-hand square/seat)<br>• **Inner Bore:** $\varnothing\ 1.50\text{ mm}$ H7 with $0.35\text{ mm}$ friction lantern groove |
| **Change Pinion (`Wechseltrieb`)** | `05 02 02 - 2` | $12$ | $0.45\text{ mm}$ | $5.40\text{ mm}$ | $6.18\text{ mm}$ | • **Face Width:** $2.00\text{ mm}$<br>• **Riveting Hub:** $\varnothing\ 3.20\text{ mm}$ shoulder riveted to `Wechselrad` ($z = 42$, $m = 0.45$, `05-02_07`)<br>• **Center Bore:** $\varnothing\ 1.40\text{ mm}$ H7 (rotates on lower-plate stud) |
| **Hour Wheel Tube (`Stundenrohr`)** | `05 02 03 - 2` | *(On $z = 48$ wheel)* | $0.45\text{ mm}$ | $21.60\text{ mm}$ *(wheel)* | $22.40\text{ mm}$ *(wheel)* | • **Total Tube Height:** $7.40\text{ mm}$<br>• **Inner Bore:** $\varnothing\ 2.82\text{ mm}$ (free running fit over `Viertelrohr`)<br>• **Hand Seat OD:** $\varnothing\ 4.00\text{ mm}$ ($1:50$ taper for `Stundenzeiger`, `05-02_03`) |
| **Power-Reserve Pinion (`Auf- u. Abtrieb`)** | `05 02 04 - 2` | $12$ | $0.50\text{ mm}$ | $6.00\text{ mm}$ | $6.90\text{ mm}$ | • **Face Width:** $2.20\text{ mm}$<br>• **Mounting:** Squared onto lower fusee arbor extension (`05-06_15`); meshes with `Auf- u. Abrad` ($z = 45$, $m = 0.50$, `05-02_11`) |

---

## 3. Escapement Unlocking Roller & Roller Jewels (`Auslöserolle`, `Auslösestein`, `Hebestein`)

Derived from the 10:1 escapement layout (`05-04_01.jpg`), complete balance staff (`05-04_04.jpg`), and impulse roller (`05-04_06.jpg`):

| Component | Material | Outer / Active Radius | Bore / Cross-Section | Axial Height / Thickness | Mounting & Angular Geometry |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unlocking Roller (`Auslöserolle`)** | Hardened Steel | $\varnothing\ 3.20\text{ mm}$ ($R\ 1.60\text{ mm}$) | Bore $\varnothing\ 1.35\text{ mm}$ | $0.80\text{ mm}$ (hub)<br>$0.55\text{ mm}$ (rim) | Pressed onto lower staff seat; $0.60\text{ mm}$ radial D-slot for unlocking jewel |
| **Unlocking Jewel (`Auslösestein`)** | Synthetic Ruby | Active Tip $R\ 1.95\text{ mm}$ ($+0.35\text{ mm}$ protrusion) | D-profile: $0.60\text{ mm}$ wide $\times 0.50\text{ mm}$ deep | $1.15\text{ mm}$ | Flat radial front face with $5^\circ$ back-rake for clean `Goldfeder` (`05-04_02`) drop |
| **Impulse Jewel (`Hebestein`)** | Synthetic Ruby | Active Tip $R\ 3.00\text{ mm}$ (flush with $\varnothing\ 6.00\text{ mm}$ `Heberolle`) | Rectangular prism: $0.80\text{ mm}$ wide $\times 0.70\text{ mm}$ deep | $1.30\text{ mm}$ | Shellacked in `Heberolle` (`05-04_06`) notch; $28^\circ$ impulse lift angle with `Gangrad` (`05-04_07-2`) |

---

## 4. Jewel Chatons, Rubies & Going-Train Bushings (`Steinfassungen`, `Lochsteine`, `Decksteine`, `Lagerfutter`)

Derived from the plate/cock counterbores (`05-08_02`, `05-08_06`, `05-08_32-2`, `05-08_33`) and arbor pivot diameters:

| Position | Setting Type | Chaton / Bushing OD | Setting Height | Ruby OD $\times$ Thickness | Jewel / Bushing Bore ($\varnothing$) | Endstone (`Deckstein`) | Retention |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Balance Staff Upper & Lower (`05-08_06`, `_33`)** | Screwed Chaton + Cap | $\varnothing\ 5.00\text{ mm}$ (flange $\varnothing\ 5.80\text{ mm}$) | $1.60\text{ mm}$ (hole)<br>$1.10\text{ mm}$ (cap) | $\varnothing\ 3.00 \times 0.80\text{ mm}$ *(olived)* | $\varnothing\ 0.22\text{ mm}$ (for $\varnothing\ 0.21\text{ mm}$ pivot) | $\varnothing\ 3.50 \times 0.65\text{ mm}$ | $2 \times \text{M1.2}$ screws |
| **Escape Wheel Upper & Lower (`05-04_08`)** | Brass Chaton + Cap | $\varnothing\ 4.00\text{ mm}$ | $1.30\text{ mm}$ | $\varnothing\ 2.30 \times 0.65\text{ mm}$ | $\varnothing\ 0.18\text{ mm}$ | $\varnothing\ 2.50 \times 0.50\text{ mm}$ | $2 \times \text{M1.0}$ screws |
| **Fourth Wheel Upper & Lower (`05-05_04`)** | Press-Fit Setting | $\varnothing\ 4.20\text{ mm}$ | $1.50\text{ mm}$ | $\varnothing\ 2.50 \times 0.75\text{ mm}$ | $\varnothing\ 0.36\text{ mm}$ (top)<br>$\varnothing\ 0.45\text{ mm}$ (bottom) | None (oil sink) | Press-fit |
| **Third Wheel Upper & Lower (`05-05_07`)** | Flanged `Lagerfutter` | $\varnothing\ 4.50\text{ mm}$ | $2.20\text{ mm}$ | *(Brass or ruby insert)* | $\varnothing\ 0.55\text{ mm}$ | None | Press-fit |
| **Center Wheel Upper & Lower (`05-05_10`)** | Flanged `Lagerfutter` | $\varnothing\ 6.00\text{ mm}$ | $3.00\text{ mm}$ (top)<br>$3.50\text{ mm}$ (bottom) | *(Hardened brass)* | $\varnothing\ 1.20\text{ mm}$ (top)<br>$\varnothing\ 1.80\text{ mm}$ (bottom) | None | Press-fit |

---

## 5. Mainspring (`Zugfeder`) & `WN` Standard Hardware (`Schrauben` & `Stifte`)

### A. Mainspring (`Zugfeder`, inside `Federhaustrommel 05-07_06`)
* **Barrel Cavity (`05-07_06` & `05-07_09`):** Inner drum diameter $D = 43.00\text{ mm}$, internal height $H = 12.20\text{ mm}$, arbor core diameter $d = 14.00\text{ mm}$.
* **Blade Dimensions:** Width $b = 11.50\text{ mm}$ ($0.35\text{ mm}$ axial clearance top/bottom), thickness $e = 0.48\text{ mm}$, length $L \approx 1,080\text{ mm}$ ($11.5$ coils unwound, $15.0$ coils wound, providing $3.5$ barrel turns for $8.5$ fusee turns / $56\text{-hour}$ run time).
* **End Attachments:** Punched inner eye engaging the snail hook on `Federkern` (`05-07_09`); riveted outer T-bridle engaging the wall slot in `Federhaustrommel` (`05-07_06`).

### B. `WN` Standard Screws & Steady Pins (`Wempe-Norm`)

| Hardware Location | Thread / Diameter | Head Dia ($d_k$) | Head Height ($k$) | Slot Width $\times$ Depth | Total Length ($L$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pillar Screws (`Pfeilerschrauben`, $\times 6$)** | $\text{M2.5} \times 0.45$ | $\varnothing\ 5.00\text{ mm}$ | $1.80\text{ mm}$ | $0.60 \times 0.80\text{ mm}$ | $6.50\text{ mm}$ |
| **Barrel Bridge & Upper Balance Cock Screws** | $\text{M2.0} \times 0.40$ | $\varnothing\ 4.00\text{ mm}$ | $1.40\text{ mm}$ | $0.50 \times 0.65\text{ mm}$ | $5.00\text{ mm}$ |
| **Intermediate Bridge & Lower Balance Cock Screws** | $\text{M1.7} \times 0.35$ | $\varnothing\ 3.40\text{ mm}$ | $1.20\text{ mm}$ | $0.40 \times 0.55\text{ mm}$ | $4.20\text{ mm}$ |
| **Detent Foot, Click & Stop-Work Screws** | $\text{M1.4} \times 0.30$ | $\varnothing\ 2.80\text{ mm}$ | $1.00\text{ mm}$ | $0.35 \times 0.45\text{ mm}$ | $3.50\text{ mm}$ |
| **Jewel Chaton & Dial Edge Screws** | $\text{M1.2} \times 0.25$ | $\varnothing\ 2.30\text{ mm}$ | $0.80\text{ mm}$ | $0.30 \times 0.40\text{ mm}$ | $2.40\text{ mm}$ |
| **Escape Chaton Screws** | $\text{M1.0} \times 0.25$ | $\varnothing\ 1.90\text{ mm}$ | $0.65\text{ mm}$ | $0.25 \times 0.30\text{ mm}$ | $1.80\text{ mm}$ |
| **Bridge & Cock Steady Pins (`Stellstifte`)** | $\varnothing\ 1.20\text{ mm}$ / $\varnothing\ 1.00\text{ mm}$ | — | — | $30^\circ$ chamfered ends | $3.50\text{–}4.50\text{ mm}$ |