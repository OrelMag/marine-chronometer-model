"""Contact-sheet helper for the blind case/gimbals/box audit: tiles images (resized to a cell, captioned with
their index) into one JPEG for quick reading.  Usage: python montage.py OUT.jpg cellW cols img1 img2 ...
Writes nothing else; reads photographs only (never the model)."""
import sys, cv2, numpy as np
out, cw, cols = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
cells = []
for i, f in enumerate(fs):
    im = cv2.imdecode(np.fromfile(f, np.uint8), 1)
    h, w = im.shape[:2]; s = cw / w; im = cv2.resize(im, (cw, int(h * s)))
    ch = int(cw * 1.0)
    c = np.zeros((ch, cw, 3), np.uint8); hh = min(ch, im.shape[0]); c[:hh] = im[:hh]
    cv2.putText(c, str(i), (5, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2); cells.append(c)
while len(cells) % cols: cells.append(np.zeros_like(cells[0]))
rows = [np.hstack(cells[i:i + cols]) for i in range(0, len(cells), cols)]
cv2.imencode('.jpg', np.vstack(rows))[1].tofile(out)
