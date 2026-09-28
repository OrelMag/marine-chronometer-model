import asyncio,json
from playwright.async_api import async_playwright
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
IGN={('trainBridge','barrelBridge'),('trainBridge','cock'),('pillars','barrelBridge'),('spr','cock'),('pillars','trainBridge'),('pillar','pillars'),('ltb','fw')}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600})
        pg.on("pageerror",lambda e: print("ERR",e))
        await pg.goto(PAGE); await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        chk=open(HERE/'interference-check.js').read(); seen=set()
        for ph in [0.0,0.24,0.26,0.28,0.4,0.6,0.74,0.76,0.9]:
            await pg.evaluate(f"""(()=>{{const mv=window.__mv;if(!mv.userData._u){{mv.userData._u=mv.userData.update;mv.userData.update=()=>{{}};}}
               const s=ESC.state({ph});mv.userData._u({{E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n:2.5,winding:false,springOn:true,msOn:false}});}})()""")
            r=json.loads(await pg.evaluate(chk))
            for o in r['out']:
                pa,pb=o['a'].split(':')[0],o['b'].split(':')[0]
                if o['sameParent'] or (pa,pb) in IGN or (pb,pa) in IGN or o['vol']<0.3: continue
                key=(o['a'],o['b'],o['at'][:9])
                if key in seen: continue
                seen.add(key);print(f"ph {ph}: {o['vol']:6.1f} mm3 {o['a']:34s} x {o['b']:34s} @ {o['at']}",flush=True)
        await b.close()
asyncio.run(main())
