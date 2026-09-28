import asyncio,json,math
import numpy as np
from playwright.async_api import async_playwright
PH={'balance':(775,512),'fusee_post_base':(1105,695),'barrel_square':(440,690),'front_pillar_screw':(703,985),'backleft_pillar_screw':(245,420)}
MD={'balance':[8.01,-31.5,8.6],'fusee_post_base':[11.3,-33.0,-18.27],'barrel_square':[-21.82,-37.4,1.64],'front_pillar_screw':[-23.0,-33.6,-24.5],'backleft_pillar_screw':[-9.1,-29.6,33.3]}
EDGE=[(395,300),(300,345),(200,415),(140,490),(110,560),(100,640),(800,1030),(1000,995),(1100,960),(1200,915)]
RING=[[37.5*math.cos(t),-33,37.5*math.sin(t)] for t in np.linspace(0,2*math.pi,240)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":1100,"height":1000},color_scheme='light')
        await pg.goto("file:///home/claude/v7/all.html?snap&qa"); await pg.wait_for_timeout(4000)
        c=lambda s: pg.evaluate(f"document.querySelector('{s}').click()")
        await c('#lbls');await c('#views button[data-v="movement"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        keys=list(PH);best=None
        grid=[(float(y),float(p)) for y in np.arange(-1.0,-0.3,0.02) for p in np.arange(0.45,0.85,0.02)]
        allpts=[MD[k] for k in keys]+RING
        outs=json.loads(await pg.evaluate("(g)=>JSON.stringify(g.map(([y,p])=>window.__proj(%s,y,p,520,12)))"%json.dumps(allpts),grid))
        for (yaw,pitch),out in zip(grid,outs):
            A=np.array(out[:len(keys)]);ring=np.array(out[len(keys):]);Bp=np.array([PH[k] for k in keys])
            ma,mb=A.mean(0),Bp.mean(0);A0,B0=A-ma,Bp-mb
            U,S,Vt=np.linalg.svd(A0.T@B0);Rm=(U@Vt).T
            if np.linalg.det(Rm)<0: continue
            s=S.sum()/(A0**2).sum();fitted=(s*(Rm@A0.T)).T+mb;res=np.linalg.norm(fitted-Bp,axis=1)
            ringF=(s*(Rm@(ring-ma).T)).T+mb;ee=np.array([np.min(np.linalg.norm(ringF-np.array(e),axis=1)) for e in EDGE])
            score=res.mean()+0.5*ee.mean()
            if best is None or score<best['score']:best=dict(score=float(score),yaw=yaw,pitch=pitch,s=float(s),R=Rm.tolist(),ma=ma.tolist(),mb=mb.tolist(),res=dict(zip(keys,res.round(1).tolist())),edge=ee.round(1).tolist())
        pxmm=660/37.5
        print('best yaw %.2f pitch %.2f'%(best['yaw'],best['pitch']))
        print('feature residuals (photo px / mm):',{k:(v,round(v/pxmm,2)) for k,v in best['res'].items()})
        print('plate-edge residuals (mm):',[round(e/pxmm,2) for e in best['edge']])
        json.dump(best,open('fit.json','w'))
        await pg.evaluate(f"window.__cam({best['yaw']},{best['pitch']},520,12)");await pg.wait_for_timeout(5000)
        el=await pg.query_selector('#stage');bb=await el.bounding_box()
        await pg.screenshot(path='r_fit.png',clip=bb,timeout=150000)
        await b.close()
asyncio.run(main())
