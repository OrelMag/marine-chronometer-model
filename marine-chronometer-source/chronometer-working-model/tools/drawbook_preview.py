"""drawbook_preview.py: each drawn part's sheets photographed as PNG (r_drawbook/MODEL/png/KEY-1.png, -2.png), to look at without a PDF reader: python drawbook_preview.py --model wempe [a,b]"""
import asyncio,browser,pathlib,sys
import model
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent;OUT=HERE/'r_drawbook'/model.NAME
async def main(only):
    (OUT/'png').mkdir(exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS);pg=await b.new_page(device_scale_factor=1.6)
        for f in sorted((OUT/'sheets').glob('*.html')):
            if only and f.stem not in only:continue
            await pg.goto(f.as_uri());await pg.wait_for_timeout(300)
            for i,el in enumerate(await pg.query_selector_all('.sh,.tab')):await el.screenshot(path=str(OUT/'png'/f'{f.stem}-{i+1}.png'))
        await b.close()
asyncio.run(main(set(sys.argv[1].split(',')) if len(sys.argv)>1 else set()))
