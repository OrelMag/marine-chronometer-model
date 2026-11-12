"""section_who.py: which part a blemish in a cross-section belongs to: one corner of the page photographed with one thing hidden at a time.

    python section_who.py --model wempe [--view side] [--plane x] [--clip 780,500,230,120] [--out r_secwho.png] [--hide "LABEL=JS;LABEL=JS"]

Opens the model's page laid out as pagecmp.py lays it out (1200 x 800, the panels hidden, so a pixel box read off one of its stills is the same box here), at three times
the pixels, clicks the view (a View button's data-v) and the section plane (x, y or z), and photographs the --clip box (x, y, width, height in page pixels) as it is and
after each --hide step in turn (each step's JS run on top of the last: it may show again what an earlier one hid). The Wempe's default steps: the printed faces
(userData.surface), the dial, then the dial back and the movement ring (05 08 00-3) hidden. The tiles are stacked top to bottom in the order printed.
Written on 12 November 2026 for grey specks at the movement ring's inner step in the Side view cut on the 12-6 plane (PLAN-three-upgrade.md, "Landed"): they stay with
the dial hidden and go with the ring, so they are the ring's own mesh under the cut. It reports, never fails. About a minute."""
import asyncio,browser,io,pathlib,sys
from PIL import Image
from playwright.async_api import async_playwright
import model
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")   # pagecmp.py's
WEMPE=[('the printed faces hidden (userData.surface)',"(()=>{let sc=__mv;while(sc.parent)sc=sc.parent;sc.traverse(o=>{if(o.userData.surface)o.visible=false})})()"),
  ('the dial hidden',"__mv.traverse(o=>{if(o.userData.partName==='dial')o.visible=false})"),
  ('the dial back, the movement ring hidden (050800-3)',"__mv.traverse(o=>{if(o.userData.partName==='dial')o.visible=true;if(o.userData.hn==='050800-3')o.visible=false})")]
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
async def main():
    view=arg('--view','side');plane=arg('--plane','x');x,y,w,h=[int(v) for v in arg('--clip','780,500,230,120').split(',')];out=arg('--out','r_secwho.png')
    steps=[tuple(s.split('=',1)) for s in arg('--hide').split(';')] if '--hide' in sys.argv else (WEMPE if not model.HAMILTON else [])
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        t=await b.new_page();await t.set_content('<canvas></canvas>');await t.evaluate("document.querySelector('canvas').getContext('webgl')");await t.wait_for_timeout(3000);await t.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=3)
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(model.PAGE,timeout=300000);await pg.wait_for_function("window.__mv&&!document.querySelector('#loading')",timeout=300000);await pg.wait_for_timeout(2000)
        await pg.evaluate("(()=>{const b=document.querySelector('#speeds button[data-v=\"0\"]');if(b)b.click();})()")
        await pg.evaluate(f"document.querySelector('#views button[data-v=\"{view}\"]').click()");await pg.wait_for_timeout(1500)
        await pg.evaluate(f"document.querySelector('#secs button[data-v=\"{plane}\"]').click()");await pg.wait_for_timeout(2500)
        print('three r'+str(await pg.evaluate("THREE.REVISION")),'view',view,'plane',plane,'clip',(x,y,w,h));tiles=[]
        for name,js in [('as it is','')]+steps:
            if js:await pg.evaluate(js)
            await pg.wait_for_timeout(1200);tiles.append(Image.open(io.BytesIO(await pg.screenshot(clip={'x':x,'y':y,'width':w,'height':h}))).convert('RGB'));print(' ',len(tiles),name)
        S=Image.new('RGB',(tiles[0].width,sum(t.height+6 for t in tiles)),'white');yy=0
        for t in tiles:S.paste(t,(0,yy));yy+=t.height+6
        S.save(out);print('wrote',out);await b.close()
asyncio.run(main())
