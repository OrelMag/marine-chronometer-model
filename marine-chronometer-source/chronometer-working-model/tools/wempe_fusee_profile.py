"""The Wempe fusee's groove floor measured off the built solid, against its sheets (05 06_20's curve, 05 06 04-2's "Grund" radii).

    python wempe_fusee_profile.py          (about 30 s: the page once for the fusee body's vertices, then numpy)

The body (050604-2) is read in its own frame: every vertex's radius, height from the large end and angle. The groove floor's vertices are those at the
least radius in their 0.05 mm × 2° cell; each is put on the helix (a land's middle at A0 + PAX m from the large end, fusee.js), the helix's phase and
sense fitted, and only the middle third of each land kept (away from the ribs' feet). Prints the floor at each whole turn against the sheets, the whole
floor against 05 06_20's quarter-turn curve (fusee.js's RFT), and the pitch. Exits 1 if the floor leaves the sheet's ±0.05 ("nicht eingetr. Toleranz
± 0,05") over the working turns. 25 October 2026 (the per-part audit): within 0.025, rms 0.010; the pitch 1.1991 (1.2 ±0.01)."""
import asyncio, os, sys
import numpy as np
import browser
from playwright.async_api import async_playwright
PAGE = 'file:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'wempe', 'index.html')).replace('\\', '/') + '?snap&qa'
JS = r"""() => { let m=null; __mv.traverse(o=>{ if(o.isMesh&&o.userData.hn==='050604-2'&&!o.userData.sub&&!m) m=o; });
  return m ? Array.from(m.geometry.attributes.position.array) : null; }"""
A0, PAX = 1.235 - 0.2, 1.2   # fusee.js: FR2 + WLD/2 - PAX from the blank's face, less the large face's re-turn RT (the body's top is the re-turned face), the pitch
SHEET = {1: 14.75, 2: 13.32, 3: 12.17, 4: 11.24, 5: 10.55, 6: 10.07, 7: 9.71, 8: 9.47}   # 05 06 04-2's Grund (05 06_20: 10.04 at 6)
RFT = [17.25, 16.465, 15.785, 15.215, 14.75, 14.305, 13.935, 13.585, 13.32, 12.975, 12.685, 12.415, 12.17, 11.915, 11.675, 11.455, 11.24, 11.055, 10.865,
       10.705, 10.55, 10.405, 10.275, 10.155, 10.07, 9.945, 9.855, 9.78, 9.71, 9.635, 9.575, 9.525, 9.47, 9.435, 9.395, 9.355, 9.30]

async def verts():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=browser.ARGS); pg = await b.new_page()
        await pg.goto(PAGE); await pg.wait_for_function('window.__mv', timeout=120000); await pg.wait_for_timeout(2000)
        v = await pg.evaluate(JS); await b.close()
    if v is None: sys.exit('no fusee body (050604-2) on the page')
    return np.array(v).reshape(-1, 3)

def main():
    x, y, z = asyncio.run(verts()).T
    r, phi, a = np.hypot(x, z), np.arctan2(z, x), y.max() - y
    m = (r > 8.9) & (a > 2.0) & (a < a.max() - 0.35); A, R, PH = a[m], r[m], phi[m]
    key = np.floor(A / 0.05).astype(int) * 1000 + np.floor((PH + np.pi) / np.deg2rad(2)).astype(int)
    o = np.argsort(key); u, st = np.unique(key[o], return_index=True); lo = dict(zip(u, np.minimum.reduceat(R[o], st)))
    f = R < np.array([lo[k] for k in key]) + 0.02; A, R, PH = A[f], R[f], PH[f]
    best = None
    for sgn in (1, -1):
        t = sgn * PH / (2 * np.pi); base = (A - A0) / PAX - t; c = np.angle(np.mean(np.exp(2j * np.pi * base))) / (2 * np.pi)
        mm = np.round(base - c) + t + c; e = np.abs((A - A0) / PAX - mm).mean()
        if best is None or e < best[0]: best = (e, sgn, c, mm)
    _, sgn, c, mm = best
    k = np.abs((A - A0) / PAX - mm) < 0.12; A, R, mm = A[k], R[k], mm[k]
    print('the groove floor off the built body: %d vertices on the lands\' middles, the helix\'s sense %+d, phase %.3f turn' % (len(R), sgn, c))
    print('\n  turn   sheet   built    diff')
    for t0, sv in SHEET.items():
        s = np.abs(mm - t0) < 0.02; print('   %d    %6.2f  %7.3f  %+.3f' % (t0, sv, R[s].mean(), R[s].mean() - sv))
    s = (mm >= 0.5) & (mm <= 8.75); dev = R[s] - np.interp(mm[s] * 4, np.arange(37), RFT); g = np.abs(dev) < 0.2
    print('\n  against 05 06_20 at quarter turns, 0.5-8.75 turns: mean %+.4f, rms %.4f, max %.3f (%.1f %% of the vertices; the rest on the groove\'s run-in and run-out)'
          % (dev[g].mean(), np.sqrt((dev[g] ** 2).mean()), np.abs(dev[g]).max(), 100 * g.mean()))
    w = (mm >= 1.4) & (mm <= 8.5); dw = R[w] - np.interp(mm[w] * 4, np.arange(37), RFT)   # the working lands, past the run-in from the flange's slot (to 1.3) and before the run-out (8.6)
    print('  on the working lands, 1.4-8.5 turns: max %.3f' % np.abs(dw).max())
    pitch = np.polyfit(mm, A, 1)[0]; print('  the pitch %.4f mm a turn (05 06 04-2: 1,2 ±0,01)' % pitch)
    ok = np.abs(dw).max() <= 0.05 and abs(pitch - 1.2) <= 0.01
    print('\n  ok  within the sheet\'s tolerances' if ok else '\n  !!  outside the sheet\'s tolerances'); sys.exit(0 if ok else 1)

if __name__ == '__main__': main()
