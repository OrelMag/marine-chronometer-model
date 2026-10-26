"""drawbook.py: the build book as engineering drawings, one sheet a part, in the style of the Wempe's own works drawings (DIN first-angle projection,
a turned part in half section, sections hatched, dimensions with arrows, a ruled title block), each with a shaded render of the part, then the part's
maker's sheet (its parts-list lines, material, fits). Made offline from the model's own solids:

    python drawbook.py --model wempe export [--only a,b]     # the page's parts, their solids and renders into r_drawbook/MODEL/ (about 1-3 min)
    python drawbook.py --model wempe draw [--only a,b]       # each part's sheet as SVG from the export (drawbook_geo.py: views, hidden lines, sections, dimensions)
    python drawbook.py --model wempe pdf OUT.pdf             # the sheets printed into one PDF (Chromium)

The export (drawbook-export.js in the page, ?snap&qa, the model frozen as isolate.py freezes it) lists the parts in the build book's order (maker.js's
book()), writes each one's triangles in the movement's frame (mm; y the arbors' axis toward the dial side) as r_drawbook/MODEL/parts/KEY.npz, its
metadata (title, description, its parts-list lines, a wheel's teeth, a screw's sizes) as KEY.json, and its render as KEY.png."""
import asyncio,base64,browser,json,pathlib,sys
import numpy as np
import model
HERE=pathlib.Path(__file__).resolve().parent;PAGE=model.PAGE+'#merge=0'
OUT=HERE/'r_drawbook'/model.NAME
def opt(k,d=None):
    a=sys.argv;return a[a.index(k)+1] if k in a else d
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading,.tabs,.modeTabs{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important;background:#fff!important}"
     "body *{visibility:hidden!important}canvas{visibility:visible!important}html,body{background:#fff!important}")   # the canvas alone, on white, for the renders
def crop(png):
    """the render cut to the part with a margin, on white (the page's background is taken as what the corners show)"""
    from PIL import Image,ImageChops
    im=Image.open(png).convert('RGB');bg=Image.new('RGB',im.size,im.getpixel((2,2)));d=ImageChops.difference(im,bg).convert('L').point(lambda v:255 if v>10 else 0);bb=d.getbbox()
    if not bb:return
    m=int(0.06*max(bb[2]-bb[0],bb[3]-bb[1]))+4;im.crop((max(0,bb[0]-m),max(0,bb[1]-m),min(im.width,bb[2]+m),min(im.height,bb[3]+m))).save(png)
async def export(only):
    from playwright.async_api import async_playwright
    (OUT/'parts').mkdir(parents=True,exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={'width':1000,'height':1000},device_scale_factor=2,color_scheme='light');errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')&&window.__V",timeout=180000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE)
        await pg.evaluate("document.querySelector('#views button[data-v=\"movement\"]').click()");await pg.wait_for_timeout(2500)
        await pg.add_script_tag(path=str(HERE/'drawbook-export.js'))
        L=await pg.evaluate('DB.list()');(OUT/'list.json').write_text(json.dumps({'mid':await pg.evaluate('DB.mid()'),'parts':L},indent=1),encoding='utf-8')
        mk={l['id']:l for l in await pg.evaluate('MAKERS.map(l=>l)')}
        for e in L:
            k=e['k']
            if only and k not in only and k.split('.')[0] not in only:continue
            ms=await pg.evaluate('k=>DB.part(k)',k);V=[];F=[];M=[];n=0;meta=[]
            for i,m in enumerate(ms):
                v=np.frombuffer(base64.b64decode(m['pos']),np.float32).reshape(-1,3);f=np.frombuffer(base64.b64decode(m['idx']),np.uint32).reshape(-1,3)
                V.append(v);F.append(f+n);M.append(np.full(len(f),i,np.int32));n+=len(v);meta.append({x:m[x] for x in ('mat','hn','gear','screw')})
            np.savez_compressed(OUT/'parts'/f'{k}.npz',V=np.concatenate(V),F=np.concatenate(F),M=np.concatenate(M))
            hns=sorted({m['hn'] for m in meta if m['hn']})
            json.dump({**e,'meshes':meta,'lines':[mk[h] for h in hns if h in mk]},open(OUT/'parts'/f'{k}.json','w',encoding='utf-8'),indent=1)
            c=await pg.evaluate('k=>DB.show(k)',k);s=max(c[3:]);await pg.evaluate(f"window.__look(0.75,0.62,{max(4,s*2.0)},{c[0]},{c[1]},{c[2]})");await pg.wait_for_timeout(300)
            png=OUT/'parts'/f'{k}.png';await pg.screenshot(path=str(png));crop(png);print(k,sum(len(f) for f in F),'triangles',flush=True)
        await b.close()
    if errs:print('page errors:',errs)
if __name__=='__main__':
    cmd=sys.argv[1] if len(sys.argv)>1 else '';only=set(opt('--only','').split(','))-{''}
    if cmd=='export':asyncio.run(export(only))
    elif cmd=='draw':import drawbook_geo;drawbook_geo.main(OUT,only)
    elif cmd=='pdf':import drawbook_sheet;asyncio.run(drawbook_sheet.pdf(OUT,sys.argv[2]))
    else:sys.exit(__doc__)
