import asyncio,json,math
import numpy as np
from playwright.async_api import async_playwright
# photo points (the uploaded top view) and model points (movement frame)
PH={'B':(640,830),'Fu':(1240,610),'Ba':(930,1440),'scr_ll2':(389,1505),'scr_left':(1060*0+ (-1)+0,0)}
PH={'B':(640,830),'Fu':(1240,610),'Ba':(930,1440)}
MD={'B':[8.0,-31.5,6.77],'Fu':[11.59,-33.0,-19.8],'Ba':[-18.56,-37.4,0.19]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":1100,"height":1100},color_scheme='light')
        errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto("file:///home/claude/v8/all.html?snap&qa"); await pg.wait_for_timeout(4500)
        c=lambda s: pg.evaluate(f"document.querySelector('{s}').click()")
        await c('#lbls');await c('#views button[data-v="movement"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        keys=list(PH);grid=[(float(y),float(pt)) for y in np.arange(-3.14,3.14,0.04) for pt in np.arange(1.1,1.571,0.03)]
        outs=json.loads(await pg.evaluate("(g)=>JSON.stringify(g.map(([y,p])=>window.__proj(%s,y,p,700,10)))"%json.dumps([MD[k] for k in keys]),grid))
        best=None
        for (yaw,pitch),out in zip(grid,outs):
            A=np.array(out);Bp=np.array([PH[k] for k in keys]);ma,mb=A.mean(0),Bp.mean(0);A0,B0=A-ma,Bp-mb
            U,S,Vt=np.linalg.svd(A0.T@B0);Rm=(U@Vt).T
            if np.linalg.det(Rm)<0: continue
            s=S.sum()/(A0**2).sum();res=np.linalg.norm((s*(Rm@A0.T)).T+mb-Bp,axis=1)
            if best is None or res.mean()<best['e']:best=dict(e=float(res.mean()),yaw=yaw,pitch=pitch,s=float(s),R=Rm.tolist(),ma=ma.tolist(),mb=mb.tolist())
        print('camera yaw %.2f pitch %.2f  mean residual %.1f px (%.2f mm)'%(best['yaw'],best['pitch'],best['e'],best['e']/23.28/0.955))
        json.dump(best,open('p3fit.json','w'))
        await pg.evaluate(f"window.__cam({best['yaw']},{best['pitch']},700,10)");await pg.wait_for_timeout(6000)
        el=await pg.query_selector('#stage');bb=await el.bounding_box()
        await pg.screenshot(path='r_p3.png',clip=bb,timeout=150000)
        print('errors',errs);await b.close()
asyncio.run(main())
