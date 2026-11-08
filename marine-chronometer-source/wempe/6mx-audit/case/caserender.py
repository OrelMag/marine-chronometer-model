"""caserender.py: the Wempe page's 6MX case (or another version's) rendered alone, for comparing with the photographs (6MX case review, 8 November 2026).

    python caserender.py OUT.png [--rev 6mx] [--parts bowl,bezel] [--look yaw pitch dist x y z] ... [--hide-contact] [--eval JS]

Opens the Wempe page (?snap&qa, #rev=REV), the Case view, freezes the model as isolate.py does, shows only the named case parts (partName, case.js's prt():
bowl, bezel, gimbalRing, box, overBox, lock, key ...; 'movement' keeps the movement), and renders each --look (movement mm, as isolate.py) side by side.
The version is set in the link before the page loads, so the case's version groups are already shown when the parts are chosen (isolate.py's --eval
click came after its hiding and left the box shown). Frames and outputs stay outside the repository (E:\\mc-video\\oq\\6mx-case\\)."""
import sys,asyncio,json,pathlib
HERE=pathlib.Path(__file__).resolve().parent
TOOLS=HERE.parents[2]/'chronometer-working-model'/'tools'
sys.path.insert(0,str(TOOLS))
import browser
from playwright.async_api import async_playwright
from PIL import Image
PAGE=(HERE.parents[1]/'index.html').as_uri()+'?snap&qa&start=movement'
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading,.tabs,.modeTabs,#playbar,.playbar{display:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
KEEP="""(K=>{const mv=window.__mv;let sc=mv;while(sc.parent)sc=sc.parent;const ins=o=>{for(let p=o;p;p=p.parent)if(p===mv)return true;return false;},
  pn=o=>{for(let p=o;p;p=p.parent)if(p.userData.partName)return p.userData.partName;return null;};let n=0;
  sc.traverse(o=>{if(!o.isMesh)return;if(ins(o)){if(!K.includes('movement'))o.visible=false;return;}const k=K.includes(pn(o));if(!k)o.visible=false;else n++;});return n;})"""
def opt(k,n):
    a=sys.argv;return [a[i+1:i+1+n] for i,x in enumerate(a) if x==k]
async def main():
    out=sys.argv[1];rev=(opt('--rev',1) or [['6mx']])[0][0];parts=(opt('--parts',1) or [['bowl,bezel']])[0][0].split(',');looks=opt('--look',6) or [['0.8','0.3','350','0','-20','0']]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1000,"height":800},device_scale_factor=1,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(PAGE+'#rev='+rev+('&contact=0' if '--hide-contact' in sys.argv else ''),timeout=120000);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(2000)
        await pg.evaluate("(()=>{const b=document.querySelector('#speeds button[data-v=\"0\"]');if(b)b.click();})()")
        await pg.evaluate("(()=>{const b=document.querySelector('#views button[data-v=\"case\"]');if(b)b.click();})()");await pg.wait_for_timeout(3000)
        n=await pg.evaluate(KEEP+"(%s)"%json.dumps(parts));print('meshes kept',n)
        for e in opt('--eval',1):await pg.evaluate(e[0]);await pg.wait_for_timeout(300)   # e.g. --eval "__BX.lock(1)" (the transit lock turned in)
        shots=[]
        for i,l in enumerate(looks):
            await pg.evaluate(f"window.__look({','.join(l)})")
            await pg.wait_for_timeout(1500);f=str(pathlib.Path(out).with_suffix(f'.{i}.png'));await pg.screenshot(path=f);shots.append(f)
        await b.close()
    if errs:print('page errors:',errs)
    ims=[Image.open(f).convert('RGB') for f in shots];W=sum(i.width for i in ims);S=Image.new('RGB',(W,max(i.height for i in ims)),'white');x=0
    for i in ims:S.paste(i,(x,0));x+=i.width
    S.save(out);print('wrote',out)
asyncio.run(main())
