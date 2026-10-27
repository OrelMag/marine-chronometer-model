"""The Wempe band's two hooks off their sheets (05 07 03-2 Bandhaken rund, 05 07 03-3 Bandhaken f. Trommel; References/wempe/drawings/05-07/
Wempe_05-07_12.jpg, _13.jpg, both 10:1): each plan view's outline traced on the scan and put in mm, for mfgfit.py fit to cut into lines and arcs.

  python wempe_bandhooks.py [OUTDIR]     (a second or two; writes OUTDIR/bh_12.trace.json, bh_12.map.json, bh_13.*, and bh_NN.png overlays)
  python mfgfit.py fit OUTDIR/bh_12.trace.json --map OUTDIR/bh_12.map.json --floor 1.0 --out bh_12.mfg.json    (the lines and arcs; kept as traces/wempe_bh_*)
  python wempe_bandhooks.py endview [OUTDIR]   (05 07 02's end view, the barrel arbor's hook: the core's circle fitted, the view unwrapped about it into
                                                OUTDIR/bh_08_unwrap.png, and the drawn lines' heights over the core printed every 2°)

Method: the sheet's dark lines thresholded, the part's region the pixels not reached by a flood from outside (its outline closes it; the
throat and the notch where the band leaves open to the outside, as drawn), opened by a 7 px disc so the dimension and extension lines
(about 2 px) and the band's lines drop away while the 0.8-wide body stays, eroded by the outline's half width (1.2 px) so the trace
runs along the drawn line's middle, and its boundary taken (cv2.findContours) every 3 px. The scale: 34.5 px a model mm (the sheets'
10:1 on the A4 scan), checked on each sheet's own figures (05 07 03-2: 3,55 scaled 3.56, 2,5 2.52, 1,25 1.25, 0,5 0.54; 05 07 03-3:
4,5 4.53, 2,8 2.77, 1,0 1.04, 0,9 0.87). The origin is each sheet's datum: 03-2 the seat's centre (the pin's, the r 0,4 at the throat's
top), 03-3 the barb line's crossing with the vertical centre line (the slot's top r 0,2); x right, z down (image axes), so mm y = -z.
"""
import sys, os, json
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); REF = os.path.join(HERE, '..', '..', '..', 'References', 'wempe', 'drawings', '05-07')
K = 34.5
SHEETS = {   # crop box (x0, y0, x1, y1) round the plan view, and the datum in the scan's pixels (found below, from the drawn centre marks)
    '12': dict(box=(245, 235, 405, 430), datum=(310.0, 304.4), lips=((346, 422), (363, 422)),
               seeds=((315, 265), (375, 335), (333, 325), (333, 385), (373, 405), (263, 315))),
    '13': dict(box=(355, 236, 520, 540), datum=(414.5, 410.0), lips=((424, 520), (439, 530)),
               seeds=((435, 316), (467, 476), (471, 426), (395, 400), (424, 476), (465, 496), (467, 466), (455, 436), (447, 436), (449, 506), (452, 470), (437, 496), (439, 482), (436, 505))),
}
def outline(img, S):
    x0, y0, x1, y1 = S['box']; g = img[y0:y1, x0:x1].copy(); (a, b), (c, d) = S['lips']; cv2.line(g, (a - x0, b - y0), (c - x0, d - y0), 0, 2)   # the band's exit closed
    dk = (g < 150).astype(np.uint8); h, w = dk.shape; reg = np.zeros_like(dk)
    for sx, sy in S['seeds']:   # the metal between the drawn lines, a seed in each piece the dimension lines cut it into
        ff = dk.copy(); m = np.zeros((h + 2, w + 2), np.uint8); cv2.floodFill(ff, m, (sx - x0, sy - y0), 2); reg |= (ff == 2).astype(np.uint8)
    reg = cv2.dilate(reg, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))   # out over the drawn lines (the outline's and the dimension lines inside)
    reg = cv2.morphologyEx(reg, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    n, lab, st, _ = cv2.connectedComponentsWithStats(reg); reg = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    up = cv2.resize(reg * 255, None, fx=4, fy=4, interpolation=cv2.INTER_LINEAR); up = (up > 127).astype(np.uint8)
    up = cv2.erode(up, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))   # the dilation's 2 px less the line's half width (about 1 px), at 4x
    cs, _ = cv2.findContours(up, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); c = max(cs, key=len)[:, 0, :].astype(float) / 4 + [x0, y0]
    return c[::12], reg
def main():
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    for s, S in SHEETS.items():
        img = cv2.imread(os.path.join(REF, f'Wempe_05-07_{s}.jpg'), 0); pts, reg = outline(img, S); dx, dz = S['datum']
        tr = dict(image=f'Wempe_05-07_{s}.jpg', source=f'05 07 03-{"2" if s == "12" else "3"}', planes=dict(Face=dict(face_y=None, calibration=dict(method='none'),
                  traces={f'outline_{s}': dict(kind='curve', h=0, closed=True, points_px=[[round(x, 2), round(y, 2)] for x, y in pts])})))
        json.dump(tr, open(os.path.join(out, f'bh_{s}.trace.json'), 'w'), indent=0)
        json.dump(dict(px_per_mm=K, x0=-dx / K - 0.5 / K, z0=-dz / K - 0.5 / K), open(os.path.join(out, f'bh_{s}.map.json'), 'w'))
        col = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        for x, y in pts: cv2.circle(col, (int(round(x)), int(round(y))), 0, (0, 0, 255), -1)
        x0, y0, x1, y1 = S['box']; cv2.imwrite(os.path.join(out, f'bh_{s}.png'), cv2.resize(col[y0:y1, x0:x1], None, fx=5, fy=5, interpolation=cv2.INTER_NEAREST))
        mm = [((x - dx) / K, -(y - dz) / K) for x, y in pts]
        print(f'05-07_{s}: {len(pts)} points; x {min(p[0] for p in mm):.2f}..{max(p[0] for p in mm):.2f}, y {min(p[1] for p in mm):.2f}..{max(p[1] for p in mm):.2f} mm')
def endview():
    """05 07 02 (Wempe_05-07_08.jpg, 2:1): the core's circle (Ø 13,3) fitted to its drawn line away from the hook (50-165° left out), then each ray's dark pixels
    from the core's line out, as mm over it: the hook's land, its face's radial line and the dimension's extension line show apart (fusee.js, the hook)."""
    from scipy.optimize import least_squares
    out = sys.argv[2] if len(sys.argv) > 2 else '.'; im = cv2.imread(os.path.join(REF, 'Wempe_05-07_08.jpg'), 0).astype(np.float32); cx, cy = 186.4, 163.6
    prof = lambda a, rs: np.array([cv2.getRectSubPix(im, (1, 1), (float(cx + r*np.cos(np.radians(a))), float(cy - r*np.sin(np.radians(a)))))[0, 0] for r in rs])
    pts = []
    for a in np.arange(0, 360, 2):
        if 50 < a < 165: continue
        rs = np.arange(60, 72, 0.1); r = rs[np.argmin(prof(a, rs))]; pts.append((cx + r*np.cos(np.radians(a)), cy - r*np.sin(np.radians(a))))
    pts = np.array(pts); f = lambda p: np.hypot(pts[:, 0] - p[0], pts[:, 1] - p[1]) - p[2]
    cx, cy, R = least_squares(f, [cx, cy, 64], loss='soft_l1', f_scale=1).x; k = R/6.65
    print(f'core circle ({cx:.2f}, {cy:.2f}) r {R:.2f} px: {k:.3f} px/mm by its 13,3, {np.sqrt(np.median(f((cx, cy, R))**2)):.2f} px median')
    A = np.arange(180, 40, -0.25); Rs = np.arange(R - 12, R + 20, 0.2); U = np.array([prof(a, Rs) for a in A]).T[::-1]
    cv2.imwrite(os.path.join(out, 'bh_08_unwrap.png'), cv2.resize(U, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST).astype(np.uint8))
    for j in range(0, len(A), 8):
        dk = Rs[::-1][U[:, j] < 120]; v = [(r - R)/k for r in dk if (r - R)/k > -0.3]
        print(f'{A[j]:6.1f} deg (90 the vertical centre line): dark at ' + ' '.join(f'{x:+.2f}' for x in v[::3]))
if __name__ == '__main__': endview() if len(sys.argv) > 1 and sys.argv[1] == 'endview' else main()
