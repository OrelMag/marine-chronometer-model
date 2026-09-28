import asyncio,json,math
import numpy as np
from playwright.async_api import async_playwright
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
best=json.load(open('fit.json'))
PH={'balance':((775,512),-31.5),'fusee':((1105,695),-33.0),'barrel':((440,690),-37.4),'pillar_front':((703,985),-33.6),'pillar_backleft':((245,420),-29.6)}
EDGE=[(395,300),(300,345),(200,415),(140,490),(110,560),(100,640),(800,1030),(1000,995),(1100,960),(1200,915)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":1100,"height":1000},color_scheme='light')
        await pg.goto(PAGE); await pg.wait_for_timeout(4000)
        c=lambda s: pg.evaluate(f"document.querySelector('{s}').click()")
        await c('#lbls');await c('#views button[data-v="movement"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        s=best['s'];Rm=np.array(best['R']);ma=np.array(best['ma']);mb=np.array(best['mb'])
        toScreen=lambda q:(Rm.T@((np.array(q)-mb)/s))+ma      # invert the similarity: photo px -> render px
        pts=[list(toScreen(v[0]))+[v[1]] for v in PH.values()]+[list(toScreen(e))+[-33.0] for e in EDGE]
        out=json.loads(await pg.evaluate(f"JSON.stringify(window.__unproj({json.dumps(pts)},{best['yaw']},{best['pitch']},520,12))"))
        for k,o in zip(PH,out): print(k,[round(x,2) for x in o])
        E=np.array(out[len(PH):]);r=np.hypot(E[:,0],E[:,1])
        # circle fit to plate edge points
        A=np.c_[2*E[:,0],2*E[:,1],np.ones(len(E))];bb=(E**2).sum(1);cx,cz,cc=np.linalg.lstsq(A,bb,rcond=None)[0];R=math.sqrt(cc+cx*cx+cz*cz)
        print('edge radii',r.round(2).tolist());print('circle fit centre (%.2f,%.2f) radius %.2f'%(cx,cz,R))
        json.dump(dict(zip(PH,out)),open('unproj.json','w'))
        await b.close()
asyncio.run(main())
