"""Before and after renders of changed parts: the same parts, from the same cameras, in two copies of a model's page (a worktree of main before a change, and the
branch after it), joined side by side.

    python beforeafter.py SPECS.json BEFORE_ROOT AFTER_ROOT OUTDIR [--model wempe]   (about 15 s a camera on each side)

SPECS.json is a list of {"name", "title", "parts": "a,b", "view" (optional: a view button clicked first, the Wempe's box or case: "box"), "looks": [[yaw, pitch,
dist], ...] or [[yaw, pitch, dist, x, y, z], ...]}: a look of three is aimed at the parts' centre as the AFTER page finds it, and the same full camera is then used on
both sides. Each root is a repository (a worktree). Writes OUTDIR/NAME.png per spec, BEFORE on the left and AFTER on the right, each frame titled, and
OUTDIR/index.json (the specs with their cameras). The isolation, freeze and page style are isolate.py's."""
import asyncio, json, os, pathlib, re, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw
import browser
SRC = (pathlib.Path(__file__).resolve().parent / 'isolate.py').read_text(encoding='utf8')
NS = {}; exec(SRC[SRC.index('CSS='):SRC.index('def opt')], NS)   # isolate.py's CSS, FREEZE and KEEP
CSS, FREEZE, KEEP = NS['CSS'], NS['FREEZE'], NS['KEEP']

def page_of(root, model):
    p = pathlib.Path(root) / 'marine-chronometer-source' / ('wempe' if model == 'wempe' else 'chronometer-working-model') / 'index.html'
    return 'file:///' + str(p).replace('\\', '/') + '?snap&qa'

async def render(page_url, specs, tag, outdir, aim):
    shots = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(args=browser.ARGS)
        w = await b.new_page(); await w.set_content('<canvas></canvas>'); await w.evaluate("document.querySelector('canvas').getContext('webgl')"); await w.wait_for_timeout(3000); await w.close()
        pg = await b.new_page(viewport={"width": 1000, "height": 760}, device_scale_factor=1, color_scheme='light'); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});" % CSS)
        await pg.goto(page_url); await pg.wait_for_function("!document.querySelector('#loading')", timeout=180000); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()"); await pg.evaluate(FREEZE)
        for s in specs:
            v = s.get('view', 'movement')
            await pg.evaluate("v=>document.querySelector('#views button[data-v=\"'+v+'\"]').click()", v); await pg.wait_for_timeout(2500)
            cx, cy, cz, sz = await pg.evaluate(KEEP % json.dumps(s['parts'].split(',')))
            if aim: s['looks'] = [l if len(l) == 6 else [l[0], l[1], l[2], cx, cy, cz] for l in s['looks']]
            for i, l in enumerate(s['looks']):
                await pg.evaluate(f"window.__look({','.join(map(str, l))})"); await pg.wait_for_timeout(1500)
                f = os.path.join(outdir, f"_{tag}_{s['name']}_{i}.png"); await pg.screenshot(path=f, timeout=180000); shots[(s['name'], i)] = f
        await b.close()
    if errs: print(tag, 'page errors:', errs)
    return shots

def main():
    a = sys.argv
    if len(a) < 5: sys.exit(__doc__)
    specs = json.load(open(a[1], encoding='utf8')); before, after, outdir = a[2], a[3], a[4]; model = a[a.index('--model') + 1] if '--model' in a else None
    os.makedirs(outdir, exist_ok=True)
    A = asyncio.run(render(page_of(after, model), specs, 'after', outdir, True))
    B = asyncio.run(render(page_of(before, model), specs, 'before', outdir, False))
    H = 380
    for s in specs:
        rows = []
        for i in range(len(s['looks'])):
            ims = [Image.open(B[(s['name'], i)]).convert('RGB'), Image.open(A[(s['name'], i)]).convert('RGB')]
            rows.append([im.resize((int(im.width * H / im.height), H)) for im in ims])
        W = sum(im.width for im in rows[0]); S = Image.new('RGB', (W, len(rows) * (H + 26)), 'white'); D = ImageDraw.Draw(S)
        for k, r in enumerate(rows):
            x = 0
            for im, t in zip(r, ('BEFORE', 'AFTER')): S.paste(im, (x, k * (H + 26) + 26)); D.text((x + 8, k * (H + 26) + 7), t, fill='black'); x += im.width
        S.save(os.path.join(outdir, s['name'] + '.png')); print('wrote', s['name'] + '.png')
    for f in list(A.values()) + list(B.values()): os.remove(f)
    json.dump(specs, open(os.path.join(outdir, 'index.json'), 'w', encoding='utf8'), indent=1, ensure_ascii=False)

if __name__ == '__main__': main()
