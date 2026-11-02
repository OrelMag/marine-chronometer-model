# Hamilton drawn-parts audit: brief for each batch agent

Goal: audit parts BUILT from Hamilton Watch Co. factory drawings against the drawings themselves, thoroughly. You are an independent checker: a check that reads the builder's notes first tends to confirm the builder's errors, so the order of work below matters.

## Material
- Sheet images (300 dpi PNG renders of the NAWCC scans): E:/mc-video/hd-audit/sheets/NAME.png. Zoom by cropping with Python/PIL into E:/mc-video/hd-audit/crops/ (make it) and reading the crop: dimensions are small; read every number at 2-4x zoom. Never copy any sheet image or crop into the git repository (the NAWCC forbids reproduction). Only numbers and words go into your report.
- Built part measurements (read off the solid, not the code): E:/Marine-Chronometer/.claude/worktrees/hparts-audit/marine-chronometer-source/chronometer-working-model/tools/r_hparts_audit/KEY.json and KEY.png (plan along Z and the section through the axis in the XZ plane, inches). JSON fields: size_in, box_in, z_levels_in (planar faces along Z), cylinders (diameter in inches, axis, centre 'at_in', z span, inside = hole/bore or outside = turned diameter/boss), cones (two diameters, z span, half angle to the axis), outline_first_face (flat parts: arcs with centre/radius/ends, lines, full circles; in inches about the sheet datum), section_corners_in (turned parts: (r, z) corners), teeth (count, tip and root diameters).
- Only AFTER your blind reading: the builder's transcription References/Hamilton-original-drawings/transcriptions/NNNNN.md (in the same worktree) and the recipe tools/recipes/hamilton.py (function per part) for what was intended.

## Steps per sheet
1. BLIND READ (sheet only, no transcription/code yet): inventory every view, every dimension (value, tolerance as printed, what its arrows/extension lines attach to), every coordinate table row, every hole, radius, angle, chamfer, note, material, finish, date. Mark each reading sure / likely / unsure and why. Check views against each other (a size in one view consistent with the other view).
2. COMPARE to the built part's measurements: for each inventory item, MATCH (within the printed tolerance, or within 0.0002 in when none), MISMATCH (give drawing value, built value, difference in inches and mm), NOT BUILT (feature on the sheet missing from the solid), EXTRA (feature in the solid not on the sheet), or CAN'T TELL. Also check things the numbers imply: tangency, concentricity, that holes land where the table says, wall thicknesses, overall lengths summing.
3. THEN read the transcription and the recipe: list every place where the transcription or the builder's interpretation differs from your blind reading (who is right, and how sure). Note every builder estimate (flagged 'estimated', 'likely', 'unsure', 'inferred') and whether the sheet actually settles it.
4. Note fit/joint information for subassemblies: what mates with what (bores and shafts, pins and holes, screws, which hole of one part lines up with which of another, endshake), with the numbers, so parts can be assembled from the drawings alone.

## Frames of the built parts
- Flat parts lie in XY in the sheet's own frame: the coordinate table's datum (2.0000, 2.0000) at the origin, x right, y up the sheet as drawn; first face at Z 0. Wheels and ratchets are centred at the origin.
- Turned parts: axis Z, Z 0 at the end the recipe starts from (stated per part in the batch list).

## Report
Write E:/mc-video/hd-audit/batch_X.md (X your batch letter): per sheet a table of items (# | drawing reads | how sure | built | verdict | note), then "Disagreements with the transcription", "Builder estimates the sheet settles", "Joints and fits", and a short list of the fixes you recommend, most important first. Final answer to the caller: a short summary (mismatches and fixes, top first). Be concrete and do not pad. Do not edit any file in the repository.
