"""Compare the model with the top-view photograph (References/photo-top-view.jpg): render the movement from above, warp the render onto the photo through
five screws on the barrel bridge, and lay the two side by side (and blended) in verification/topview-comparison.png.

    python topview.py                      # writes ../verification/topview-comparison.png
    python topview.py --hide trainBridge   # the same with parts hidden (userData.partName), into r_topview.png in the current directory

The warp is an affine map fitted to the barrel bridge's plane (the five screws agree with it to 0.6 mm), so parts at that height line up; parts far above or
below it (the cock, the pillar plate) are shifted by the photograph's slight tilt, up to about 3 mm. The model is frozen as in views.py."""
import asyncio,json,math,pathlib,sys
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
PHOTO=HERE.parents[2]/'References'/'photo-top-view.jpg'
OUT=HERE.parent/'verification'/'topview-comparison.png'
CROP=(470,280,1760,1470)   # the movement in the photograph, px
# screw heads on the barrel bridge (the one at (29.24, -12.28) is the train bridge's, sunk in a hole through it) and the setup cover: model point (x, y at the head's top, z) and its centre in the photograph, px
D2R=math.pi/180;BA=(-18.56,0.19);P2=lambda r,a,y:[BA[0]+r*math.cos(a*D2R),y,BA[1]+r*math.sin(a*D2R)]
PTS0=[([-15.3,-28.76,-26.58],(1353,325)),(P2(11.6,288,-30.21),(1410,608)),(P2(11.1,107,-30.21),(1615,995)),([29.24,-25.36,-12.28],(510,778)),([32.11,-28.76,-4.1],(495,925))]
# the screws in the photographs' frame; the model's photographed group stands PHOTO_TURN (14 deg, movement.js) round the centre from it
TURN=14*D2R;PTS=[([p[0]*math.cos(TURN)-p[2]*math.sin(TURN),p[1],p[0]*math.sin(TURN)+p[2]*math.cos(TURN)],q) for p,q in PTS0]
CAM=(2.1,1.5,1400,3.8)   # yaw, pitch, distance, field of view: from above, far away, the movement filling the canvas's height (about 9 px/mm)
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading,.tabs{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
async def main():
    hide=arg('--hide')
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        # a fresh headless Chromium loses its first WebGL context: spend it on a blank page
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1400,"height":1400},device_scale_factor=1);errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE)
        await pg.evaluate("(()=>{const e=document.querySelector('#edges');if(e.checked)e.click();})()");await pg.evaluate("(()=>{const e=document.querySelector('#shadows');if(!e.checked)e.click();})()")   # Edges off, the lamp's shadows on (off by default), as the comparison was made
        await pg.evaluate("document.querySelector('#views button[data-v=\"movement\"]').click()");await pg.wait_for_timeout(2500)
        if hide:await pg.evaluate("(H=>{for(const c of window.__mv.children)if(H.includes(c.userData.partName))c.visible=false;})(%s)"%json.dumps(hide.split(',')))
        await pg.evaluate("window.__cam(%s)"%','.join(map(str,CAM)));await pg.wait_for_timeout(2500)
        await pg.screenshot(path='r_topview_render.png')   # the canvas is the page's top left, the size __proj works in
        src=np.array(await pg.evaluate("q=>__proj(q,%s)"%','.join(map(str,CAM)),[q for q,_ in PTS]))
        await b.close()
    dst=np.array([u for _,u in PTS],float)
    A,*_=np.linalg.lstsq(np.c_[dst,np.ones(len(dst))],src,rcond=None)   # photo px -> render px, as PIL's transform wants
    back,*_=np.linalg.lstsq(np.c_[src,np.ones(len(src))],dst,rcond=None);res=np.hypot(*(np.c_[src,np.ones(len(src))]@back-dst).T)
    print('screws off the fitted plane: %s px (the photo has about 20 px/mm there)'%np.round(res,1).tolist(),'page errors:',errs)
    ph=Image.open(PHOTO).convert('RGB');r=Image.open('r_topview_render.png').convert('RGB')
    wr=r.transform(ph.size,Image.AFFINE,tuple(A[:,0])+tuple(A[:,1]),resample=Image.BICUBIC,fillcolor=(255,255,255))
    a,m=ph.crop(CROP),wr.crop(CROP);W,H=a.size;s=0.5
    a,m=a.resize((int(W*s),int(H*s))),m.resize((int(W*s),int(H*s)));out=Image.new('RGB',(a.width*3+20,a.height),'white')
    out.paste(a,(0,0));out.paste(m,(a.width+10,0));out.paste(Image.blend(a,m,0.5),(2*a.width+20,0))
    path=OUT if not hide else pathlib.Path('r_topview.png');out.save(path);print('wrote',path)
asyncio.run(main())
