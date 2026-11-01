"""The Wempe's general arrangement ("Federchronometer 05") at the resolution of its print in Klassik Uhren 3/2006.

The coloured section in the repository (References/wempe/drawings/Wempe_Einheitschronometer.jpg, 2048 px wide) is a photograph of the
hand-coloured drawing. Lux and Petersen's article "Das Einheitschronometer" (Klassik Uhren 3/2006, pp. 16-24; its PDF on
https://www.glashuetteuhren.de/kaliberuebersichten-modelle/a-lange-soehne/einheitschronometer-kal-100/, scanned at about 280 dpi)
prints the same drawing in black and white across pp. 16-17, about 2.49 times as fine. This joins the two pages into one image in
the coloured scan's frame, scaled 2.49 (5099 x 2061 px):

- each page's drawing (its top 55 %) is placed by a similarity (scale, turn, shift) fitted by SIFT matches and RANSAC onto the
  coloured scan, so each page keeps its own geometry and the scan only places the two halves and the gap between them;
- what the print lacks (the gutter between the pages, about 110 px, the margins beyond each page) and the magazine's running
  header over p. 16 are filled from the coloured scan, scaled up and toned to the print's paper and ink (grey, paper-tinted);
- MASK (PNG, same size): white where the pixel is the print's, black where it is the coloured scan's.

The PDF and the magazine pages stay outside the repository ($MC_VIDEO); the joined drawing is kept beside the coloured scan.

    python wempe_section_hires.py PDF [OUT.jpg] [--mask MASK.png]       about 30 s
"""
import sys, argparse
import numpy as np, cv2, pymupdf
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
REF = ROOT / 'References/wempe/drawings/Wempe_Einheitschronometer.jpg'
S = 2.49          # the print's px per coloured-scan px (the two pages fit 2.483 and 2.494)
TOP = 0.55        # the drawing's share of each page's height (the article's text below)
HEADER = (60, 80, 1060, 160)   # the running header on p. 16 in that page's own pixels (x0, y0, x1, y1)


def pages(pdf):
    d = pymupdf.open(pdf); out = []
    for i in (0, 1):
        x = d[i].get_images(full=True)[0][0]; pm = pymupdf.Pixmap(d, x)
        if pm.n > 3: pm = pymupdf.Pixmap(pymupdf.csRGB, pm)
        a = np.frombuffer(pm.samples, np.uint8).reshape(pm.height, pm.width, pm.n)[:, :, :3]
        out.append(cv2.cvtColor(a, cv2.COLOR_RGB2BGR))
    return out


def place(a, refg, kr, dr, sift):
    ka, da = sift.detectAndCompute(cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), None)
    m = cv2.BFMatcher().knnMatch(da, dr, k=2); g = [x for x, y in m if x.distance < 0.75 * y.distance]
    src = np.float32([ka[x.queryIdx].pt for x in g]); dst = np.float32([kr[x.trainIdx].pt for x in g])
    M, inl = cv2.estimateAffinePartial2D(src, dst, method=cv2.RANSAC, ransacReprojThreshold=2.0, maxIters=20000, confidence=0.999)
    k = inl.ravel() == 1; r = dst[k] - (src[k] @ M[:, :2].T + M[:, 2])
    print(f'  {k.sum()} of {len(g)} matches, scale {1/np.hypot(M[0,0],M[1,0]):.4f}, turn {np.degrees(np.arctan2(M[1,0],M[0,0])):.3f} deg, '
          f'rms {np.sqrt((r**2).sum(1).mean()):.2f} px of the coloured scan')
    return M


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('pdf'); ap.add_argument('out', nargs='?', default=str(REF.with_name('Wempe_Einheitschronometer_hires.jpg')))
    ap.add_argument('--mask', default=None); o = ap.parse_args()
    ref = cv2.imread(str(REF)); refg = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY)
    sift = cv2.SIFT_create(20000); kr, dr = sift.detectAndCompute(refg, None)
    H, W = int(ref.shape[0] * S), int(ref.shape[1] * S)
    acc = np.zeros((H, W, 3), np.float32); wsum = np.zeros((H, W), np.float32)
    for i, p in enumerate(pages(o.pdf)):
        a = p[:int(p.shape[0] * TOP)]; print(f'p. {16+i}:'); M = place(a, refg, kr, dr, sift) * S
        valid = np.ones(a.shape[:2], np.float32)
        if i == 0: x0, y0, x1, y1 = HEADER; valid[y0:y1, x0:x1] = 0
        w = cv2.warpAffine(a, M, (W, H), flags=cv2.INTER_LANCZOS4).astype(np.float32)
        m = cv2.erode(cv2.warpAffine(valid, M, (W, H), flags=cv2.INTER_LINEAR), np.ones((5, 5)))
        acc += w * m[..., None]; wsum += m
    pr = acc / np.maximum(wsum, 1e-6)[..., None]; have = wsum > 0.5
    # the coloured scan, scaled and toned: its grey mapped linearly (ink at the 2nd percentile, paper at the 90th) onto the print's
    L = cv2.cvtColor(pr.clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)[have].astype(np.float32)
    paper = np.median(pr[have & (cv2.cvtColor(pr.clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY) > np.percentile(L, 70))], 0)
    pi, pp = np.percentile(L, 2), np.percentile(L, 90)
    rg = cv2.resize(refg, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    ri, rp = np.percentile(rg, 2), np.percentile(rg, 90)
    t = np.clip(pi + (rg - ri) * (pp - pi) / (rp - ri), 0, 255)
    fill = paper[None, None, :] * (t / max(paper.mean(), 1))[..., None]
    # feather the print into the fill over a few pixels
    a = cv2.GaussianBlur(have.astype(np.float32), (0, 0), 2) * have
    out = pr * a[..., None] + fill * (1 - a[..., None])
    cv2.imwrite(o.out, out.clip(0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(f'{o.out}: {W} x {H}, {100*have.mean():.1f} % of it the print, the rest the coloured scan')
    if o.mask: cv2.imwrite(o.mask, (have * 255).astype(np.uint8))


if __name__ == '__main__':
    main()
