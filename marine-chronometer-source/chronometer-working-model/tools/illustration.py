"""Draw the overview illustration shown in the Illustration tab from the model itself, twice: tinted (img/illustration.webp) and in ink (img/illustration-ink.webp).

    python illustration.py                  # render every view, stylize, lay out both sheets, write ../img/illustration.webp and illustration-ink.webp
    python illustration.py --no-render      # stylize and lay out again from the passes already in r_ill/ (no browser for the views)
    python illustration.py --only esc bal   # re-render some views only (the others are reused from r_ill/)

Each view is set up in index.html?snap&qa (a view button, a camera, parts kept, dropped or drawn in outline), the page's loop is frozen, and
illustration-passes.js renders albedo, lit shade (with the scene's shadows), normals, depth, object ids and metalness through replacement
materials at twice the output size. stylize() turns those into a drawing: outlines where depth jumps or the silhouette ends, finer lines
at creases and between parts, with a varying pen pressure; tinted, colour lifted toward the paper in soft value bands, laid true to the lines,
with white left for highlights on metal; in ink, the lines alone and the printing (the dial's figures). Parts listed as a view's `ghost` are drawn in outline only, under the others
(the barrel round the mainspring, the balance behind the escapement, the box round the gimbals). The sheet is laid out as HTML in the page's
typefaces (vendor/fonts) and screenshotted. Label anchors given as sheet coordinates were placed by eye: after changing a camera or the
geometry, look at r_ill/sheet-tint.png and sheet-ink.png and move them. Intermediates go to r_ill/ in the current directory."""
import asyncio,base64,json,math,pathlib,sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
FONTS=(HERE.parents[2]/'vendor'/'fonts'/'fonts.css').as_uri()
OUT=HERE.parent/'img'/'illustration.webp';OUT_INK=HERE.parent/'img'/'illustration-ink.webp'
WD=pathlib.Path('r_ill')
SS=2   # supersampling of the passes
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading,.tabs{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
FLOOR='return o.parent&&o.parent.type==="Scene"'   # the floor under the box
# the balance's rim, arms, screws and hairspring: parts of bal/spr wider than 9 mm across the staff or more than 4 mm off it (L.B = 8.0, 6.77); the staff and rollers stay solid
BALBIG=('let b=o;while(b&&!/^(bal|spr)$/.test(b.userData.partName||""))b=b.parent;if(!b)return false;o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox,m=new THREE.Matrix4().copy(__mv.matrixWorld).invert().multiply(o.matrixWorld);'
        'let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(let i=0;i<8;i++){const v=new THREE.Vector3(i&1?bb.max.x:bb.min.x,i&2?bb.max.y:bb.min.y,i&4?bb.max.z:bb.min.z).applyMatrix4(m);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);z0=Math.min(z0,v.z);z1=Math.max(z1,v.z);}'
        'return Math.max(x1-x0,z1-z0)>9||Math.hypot((x0+x1)/2-8.0,(z0+z1)/2-6.77)>4;')
# views: page view button, CSS size (passes at SS times), --drive, camera (__cam yaw pitch dist fov, or __look yaw pitch dist x y z in the movement frame), JS run after freezing, parts
# the moving parts at one escapement phase and 20 h of wind (the page's starting state), after a moment of winding, as views.py does; the hands are not in these views
FREEZE=("(p=>{const mv=__mv,s=ESC.state(p),n=20*FUSEE_PER_HOUR,u=(n,w)=>mv.userData.update({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});"
        "u(0,true);u(n,false);})(%s)")
VIEWS=[
 # the box with both covers open, the movement lifted 215 mm out of its case and tipped toward the viewer (without its shadow on the lid)
 dict(name='hero',view='dial',W=900,H=1100,look=[0.55,0.40,640,0,85,0],hide=[FLOOR],
      pre='__mv.position.y+=215;__mv.rotateOnWorldAxis(new THREE.Vector3(0.85,0,-0.52).normalize(),0.42);__mv.traverse(o=>{o.castShadow=false;})',
      anchors=[['mvbot','@mv',0,-42,0],['bowlc','@bowl',0,0,0]]),
 # the box tilted 8 degrees in pitch and 17 in roll, the case level in its ring; the box in outline; the two pivot axes
 dict(name='gim',view='box',W=900,H=620,cam=[0.6,0.5,520,30],pre='__tilt(0.14,0.30)',hide=[FLOOR],keep=['ring','bowl'],drop=['lid','lidGlass','key'],ghost=['box'],
      anchors=[['r1','@box',105,-20,0],['r2','@box',-105,-20,0],['c1','@ring',0,0,90],['c2','@ring',0,0,-90]]),
 dict(name='fusee',view='train',W=800,H=520,drive=True,pre=FREEZE%0.4,keep=['fusee','chain','gw','sq','mainspring'],ghost=['barrel'],look=[-0.35,0.35,112,-3.5,-14,-9.8]),
 dict(name='esc',view='train',W=700,H=560,drive=True,pre=FREEZE%0.4,keep=['escW','det','bal','spr'],hide=[BALBIG],ghost=['bal','spr'],look=[2.6,1.1,64,8.0,-18.5,12]),
 dict(name='bal',view='train',W=700,H=560,drive=True,pre=FREEZE%0.4,keep=['bal','spr'],look=[2.27,0.35,70,8.0,-29,6.8]),
]
async def render(b,name,view,W,H,drive=False,keep=None,ghost=None,drop=None,cam=None,look=None,pre='',hide=(),anchors=()):
    pg=await b.new_page(viewport={"width":W,"height":H});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
    await pg.goto(PAGE);await pg.wait_for_timeout(4000)
    await pg.evaluate((HERE/'illustration-passes.js').read_text()+";(()=>{const r=__r,o=r.render;r.render=function(s,c){window.__S=s;window.__C=c;return o.call(this,s,c)};})()")
    # stopped at ten past ten, as watches are drawn
    await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate("t=>{const i=document.querySelector('#tod');i.value=t;i.dispatchEvent(new Event('change'))}",'10:09:36')
    # Edges off (on by default): its overlay is drawn last, so the render hook would capture the overlay's scene, not the model's. Shadows on (off by default): the shade pass has them
    await pg.evaluate("(()=>{const e=document.querySelector('#edges');if(e.checked)e.click();})()");await pg.evaluate("(()=>{const e=document.querySelector('#shadows');if(!e.checked)e.click();})()")
    if drive:await pg.evaluate("document.querySelector('#driveOn').click()")
    await pg.evaluate(f"document.querySelector('#views button[data-v=\"{view}\"]').click()");await pg.wait_for_timeout(1500)
    if cam:await pg.evaluate(f"window.__cam({','.join(map(str,cam))})")
    if look:await pg.evaluate(f"window.__look({','.join(map(str,look))})")
    await pg.wait_for_timeout(1200);await pg.evaluate("__stop()");await pg.wait_for_timeout(300)
    if pre:await pg.evaluate(pre)
    # the solid parts, then the ghost parts alone (the floor stays hidden)
    for nm,kp,dr,hd in ((name,keep,drop,list(hide)),)+(((name+'_ghost',ghost,None,[h for h in hide if h==FLOOR]),) if ghost else ()):
        out=await pg.evaluate("([W,H,h,k,d,a])=>__passes(W,H,{hide:h,keep:k,drop:d,anchors:a})",[W*SS,H*SS,hd,kp,dr,list(anchors)])
        d=WD/nm;d.mkdir(parents=True,exist_ok=True)
        for k,v in out.items():
            if k!='anc':(d/f'{k}.png').write_bytes(base64.b64decode(v.split(',',1)[1]))
        (d/'anchors.json').write_text(json.dumps(out['anc']))
    print(name,'rendered','page errors:',errs);await pg.close()
def stylize(d,lineonly=False,tint=True,lift=0.45,sat=1.6,cap=0.3,seed=1):
    """The view drawn in ink, tinted (tint) or not; lineonly: the lines alone (a ghost)."""
    ld=lambda k:np.asarray(Image.open(d/f'{k}.png').convert('RGB'),np.float64);rng=np.random.default_rng(seed)
    A=ld('albedo')/255;S=ld('shade')[...,0]/255;N=ld('normal')/255*2-1;Dp=ld('depth');I=ld('id').astype(np.int64);M=ld('mat')/255
    D=(Dp[...,0]*65536+Dp[...,1]*256+Dp[...,2])/64;ID=I[...,0]*65536+I[...,1]*256+I[...,2];bg=ID==0;D[bg]=D[~bg].max()*4;H,W=ID.shape;N/=np.maximum(np.linalg.norm(N,axis=2,keepdims=True),1e-6)
    def nb(a,dy,dx):p=np.pad(a,((1,1),(1,1))+((0,0),)*(a.ndim-2),mode='edge');return p[1-dy:1-dy+H,1-dx:1-dx+W]
    # outlines where depth jumps (0.6 mm + 1.2% of the distance) or the silhouette ends; lighter lines at creases (over ~37 degrees) and between parts
    sil=np.zeros((H,W));cre=np.zeros((H,W))
    for dy,dx in((0,1),(1,0),(1,1),(1,-1)):
        Db=nb(D,dy,dx);s=(np.abs(D-Db)>0.6+0.012*np.minimum(D,Db))|((ID==0)!=(nb(ID,dy,dx)==0));idb=(ID!=nb(ID,dy,dx))&~s;c=((N*nb(N,dy,dx)).sum(2)<0.80)&~s&~bg
        sil=np.maximum(sil,s);cre=np.maximum(cre,np.maximum(c*0.75,idb*0.6))
    fn=lambda sig,amp=1:(lambda n:n/(n.std()+1e-9)*amp)(nd.gaussian_filter(rng.standard_normal((H,W)),sig))
    r=max(1,round(SS*0.9));ink=np.maximum(nd.grey_dilation(sil,size=(r+1,r+1)),nd.grey_dilation(cre,size=(r,r))*0.8)
    press=np.clip(0.85+0.15*fn(12*SS),0.55,1.0);ink=nd.gaussian_filter(ink,0.35*SS)*press   # pen pressure varies slowly along the strokes
    fg=(~bg).astype(float);alb=np.clip(A,0,1)**(1/2.2);L=(alb*[0.3,0.55,0.15]).sum(2,keepdims=True)
    if tint and not lineonly:
        # colour: albedo in sRGB, lightened toward the paper, chroma boosted but capped; value from the lit pass in soft bands
        ch=(alb-L)*sat;ch*=np.minimum(1,cap/np.maximum(np.linalg.norm(ch,axis=2,keepdims=True),1e-6));wc=np.clip(lift+(1-lift)*0.95*L+ch,0,1)
        v=np.clip(S/max(np.percentile(S[~bg],97),1e-3),0,1)**(1/2.2);bd=np.clip((v-0.25)/0.7,0,1);bd=nd.gaussian_filter(0.5*bd+0.5*np.round(bd*3)/3,0.8*SS)
        # pigment: colour plus a shadow glaze of the same hue, laid true to the lines; white left where metal catches the light
        dens=(1-wc)+(1-bd)[...,None]*(0.26+0.55*(1-wc))
        Hv=np.array([-0.35,0.55,0.76]);Hv/=np.linalg.norm(Hv);hl=nd.gaussian_filter(np.clip(((N*Hv).sum(2)-0.9)/0.07,0,1)*np.clip(M[...,0]*1.3,0,1),1.2*SS)
        out=np.exp(-dens*(1-0.85*hl)[...,None]*fg[...,None]*1.25)
    else:
        out=np.ones((H,W,3))
        # in ink, printing is inked (the dial's figures): albedo under 55% of its mesh's median
        if not lineonly:u=np.unique(ID[~bg]);med=np.zeros(ID.max()+1);med[u]=nd.median(L[...,0],ID,u);ink=np.maximum(ink,nd.gaussian_filter(np.clip((0.55*med[ID]-L[...,0])/(0.2*med[ID]+1e-3),0,1)*fg,0.4*SS)*0.9)
    out=out*(1-ink[...,None])+np.array([0.17,0.15,0.14])*ink[...,None]
    img=Image.fromarray((np.clip(out,0,1)*255).astype(np.uint8)).resize((W//SS,H//SS),Image.LANCZOS)
    img.putalpha(Image.fromarray((np.clip(np.maximum(fg,nd.grey_dilation(sil,size=(r+1,r+1))),0,1)*255).astype(np.uint8)).resize((W//SS,H//SS),Image.LANCZOS));return img
def prep(n,ghost=0.55,pad=14,crop=None,tint=True):
    """The view with its ghost's lines under it, cropped to the drawing (crop: fractions of that), flattened on white; anchors as fractions of the crop."""
    im=stylize(WD/n,tint=tint)
    if (WD/(n+'_ghost')).exists():
        ga=np.asarray(stylize(WD/(n+'_ghost'),lineonly=True)).astype(float);ga[...,3]*=np.clip((1-ga[...,:3].mean(2)/255)*2.2,0,1)*ghost
        base=Image.new('RGBA',im.size,(255,255,255,0));base.alpha_composite(Image.fromarray(ga.astype(np.uint8)));base.alpha_composite(im);im=base
    ys,xs=np.nonzero(np.asarray(im.getchannel('A'))>8);x0,x1,y0,y1=max(xs.min()-pad,0),min(xs.max()+pad,im.width),max(ys.min()-pad,0),min(ys.max()+pad,im.height)
    if crop:x0,y0,x1,y1=[int(v) for v in (x0+crop[0]*(x1-x0),y0+crop[1]*(y1-y0),x0+crop[2]*(x1-x0),y0+crop[3]*(y1-y0))]
    c=im.crop((x0,y0,x1,y1));flat=Image.new('RGB',c.size,'white');flat.paste(c,(0,0),c);flat.save(WD/f'{n}-{STY[tint]}.png')
    anc={k:((v[0]*im.width-x0)/c.width,(v[1]*im.height-y0)/c.height) for k,v in json.loads((WD/n/'anchors.json').read_text()).items()}
    return dict(src=f'{n}-{STY[tint]}.png',w=c.width,h=c.height,anc=anc)
SW,SH=1200,1420
STY={True:'tint',False:'ink'}
def sheet(tint=True):
    # views: the drawing fitted into box [x, y, w, h]; labels (anchor: a view anchor or a sheet point, text, 'l'/'r' = the text starts/ends at x, x, y)
    V=[dict(d=prep('hero',tint=tint),box=[40,200,600,720],dashed=[('mvbot','bowlc')],labels=[((222,352),'Movement, lifted out','r',196,420),((262,480),'Glass-top cover','r',226,470),
         ((172,628),'Chronometer case','r',150,540),((160,668),'Gimbal ring','r',140,590),((470,805),'Mahogany box','l',440,880)]),
       dict(d=prep('gim',tint=tint),box=[680,296,480,270],axes=[('r1','r2',0.15),('c1','c2',0.3)],labels=[('r1','Ring pivots in the box','l',985,318),('c1','Case pivots in the ring','l',690,500),((930,488),'Case hangs level','l',960,530)]),
       dict(d=prep('fusee',ghost=0.95,tint=tint),box=[680,680,480,250],labels=[((822,795),'Mainspring','r',790,700),((848,772),'Barrel, drawn open','l',830,730),((738,800),'Chain','r',728,812),
         ((1040,830),'Fusee','l',1060,760),((900,880),'Fusee wheel','r',870,900)]),
       dict(d=prep('esc',crop=[0.14,0.02,1,1],tint=tint),box=[40,1050,540,320],labels=[((368,1285),'Escape wheel','l',400,1300),((340,1215),'Detent','l',440,1128),((225,1205),'Impulse roller','r',175,1235),((95,1100),'Balance, in outline','l',70,1060)]),
       dict(d=prep('bal',tint=tint),box=[620,1050,540,320],labels=[((975,1110),'Elinvar hairspring','l',1000,1070),((948,1288),'Steel rim','l',990,1340),((1000,1212),'Invar arm','l',1015,1170),((735,1283),'Balance screws','l',640,1330)])]
    PANELS=[(680,200,480,'1','Gimbals','The box moves with the ship. The ring pivots in the box, and the case in the ring at right angles, so the case hangs level and the balance swings in the plane it was adjusted in.'),
      (680,580,480,'2','Fusee and chain','A mainspring pulls harder wound than run down. The chain comes off the fusee’s narrow end while the spring is strong and its wide end as it weakens, so the train is driven with about the same force for two days.'),
      (40,940,540,'3','Spring detent escapement','Once per oscillation the balance trips the detent; the released escape wheel pushes the impulse roller once, and the detent locks the next tooth. On the return swing it only bends a light trip spring aside.'),
      (620,940,540,'4','Balance and hairspring','A solid steel rim on an Invar arm, with a cylindrical Elinvar hairspring. The rim’s screws correct for temperature; balance screws and timing weights set the rate. There is no regulator.')]
    ink,blue,paper='#2c2824','#2f5d8a','#f5f0e4'
    css=(f"@import url('{FONTS}');*{{box-sizing:border-box}}html,body{{margin:0}}body{{width:{SW}px;height:{SH}px;background:{paper};position:relative;overflow:hidden;color:{ink};font-family:'Instrument Sans',sans-serif}}"
      ".sheet{position:absolute;inset:18px;border:1.2px solid #3a342d;outline:0.6px solid #3a342d;outline-offset:-6px}"
      "h1{position:absolute;left:48px;top:40px;margin:0;font:300 44px/1.05 Spectral,serif;letter-spacing:-.01em}.sub{position:absolute;left:50px;top:98px;font:italic 400 20px/1.3 Spectral,serif;color:#5a5047}"
      ".intro{position:absolute;left:50px;top:134px;width:1100px;font-size:15.5px;line-height:1.5;color:#3e3832}img{position:absolute;mix-blend-mode:multiply}svg{position:absolute;left:0;top:0}"
      ".p{position:absolute}.p h2{margin:0 0 6px;font:600 21px/1.2 Spectral,serif;display:flex;gap:10px;align-items:baseline}.p p{margin:0;font-size:14.2px;line-height:1.48;color:#3e3832}"
      f".p h2 b{{font:italic 400 17px Spectral,serif;border:1.1px solid {ink};border-radius:50%;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;flex:none;transform:translateY(-2px)}}"
      f".lb{{position:absolute;font:italic 400 15px/1.2 Spectral,serif;white-space:nowrap;text-shadow:0 0 3px {paper},0 0 3px {paper},0 0 2px {paper}}}"
      ".foot{position:absolute;left:50px;right:50px;bottom:32px;font-size:12px;color:#6f655b;display:flex;justify-content:space-between}")
    imgs,svg,txt=[],[],[]
    for v in V:
        d=v['d'];bx,by,bw,bh=v['box'];s=min(bw/d['w'],bh/d['h']);w,h=d['w']*s,d['h']*s;x,y=bx+(bw-w)/2,by+(bh-h)/2
        imgs.append(f'<img src="{d["src"]}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">');P=lambda k:(x+d['anc'][k][0]*w,y+d['anc'][k][1]*h)
        for k,t,al,X,Y in v.get('labels',[]):
            # the leader runs from the nearest point of the label's box (its width estimated) to the anchor, ending in a dot
            ax,ay=P(k) if isinstance(k,str) else k;tw=len(t)*6.5;b0,b1=(X-3,X+tw+3) if al=='l' else (X-tw-3,X+3);ex,ey=min(max(ax,b0),b1),min(max(ay,Y-1),Y+19)
            txt.append(f'<div class="lb" style="{"left" if al=="l" else "right"}:{X if al=="l" else SW-X}px;top:{Y}px">{t}</div>')
            svg.append(f'<path d="M{ex:.1f},{ey:.1f} L{ax:.1f},{ay:.1f}" stroke="{ink}" stroke-width="0.9"/><circle cx="{ax:.1f}" cy="{ay:.1f}" r="2.4" fill="{ink}"/>')
        for a,b,e in v.get('axes',[]):   # pivot axes, dash-dot, carried a little past both pivots
            (x1,y1),(x2,y2)=P(a),P(b);svg.append(f'<path d="M{x1-(x2-x1)*e:.1f},{y1-(y2-y1)*e:.1f} L{x2+(x2-x1)*e:.1f},{y2+(y2-y1)*e:.1f}" stroke="{blue}" stroke-width="1.1" stroke-dasharray="10 4 2 4"/>')
        for a,b in v.get('dashed',[]):   # where a lifted part came from
            (x1,y1),(x2,y2)=P(a),P(b);svg.append(f'<path d="M{x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f}" stroke="{blue}" stroke-width="1.3" stroke-dasharray="7 5" marker-end="url(#ar)"/>')
    for x,y,w,n,t,p in PANELS:txt.append(f'<div class="p" style="left:{x}px;top:{y}px;width:{w}px"><h2><b>{n}</b>{t}</h2><p>{p}</p></div>')
    html=(f'<!doctype html><meta charset="utf-8"><style>{css}</style><body><div class="sheet"></div>'+''.join(imgs)+
      f'<svg width="{SW}" height="{SH}" fill="none"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{blue}"/></marker></defs>'+''.join(svg)+'</svg>'
      '<h1>What keeps a marine chronometer on time</h1><div class="sub">The Hamilton Model 21 of 1941, drawn from this site’s working model</div>'
      '<div class="intro">A key-wound clock driven by a spring, it holds a steady rate at sea through four features: gimbals that keep the movement level, even force from the fusee and chain, '
      'a balance left almost free by its detent escapement, and a balance and hairspring made to resist changes of temperature.</div>'+''.join(txt)+
      '<div class="foot"><span>Rendered from the 3D model: '+('outlines, shading and colour' if tint else 'every line')+' from the same geometry the working model runs</span><span>CC BY 4.0</span></div></body>')
    (WD/f'sheet-{STY[tint]}.html').write_text(html,encoding='utf-8')
async def main():
    a=sys.argv[1:];only=a[a.index('--only')+1:] if '--only' in a else None
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        if '--no-render' not in a:
            # a throwaway page absorbs the first WebGL context, which a fresh headless Chromium loses
            t=await b.new_page();await t.goto(PAGE);await t.wait_for_timeout(1500);await t.close()
            for v in VIEWS:
                if not only or v['name'] in only:await render(b,**v)
        for tint,out in((True,OUT),(False,OUT_INK)):
            sheet(tint);n=STY[tint];pg=await b.new_page(viewport={'width':SW,'height':SH})
            await pg.goto((WD/f'sheet-{n}.html').resolve().as_uri());await pg.evaluate('document.fonts.ready');await pg.wait_for_timeout(400)
            await pg.screenshot(path=str(WD/f'sheet-{n}.png'));await pg.close()
            Image.open(WD/f'sheet-{n}.png').convert('RGB').save(out,quality=78,method=6);print('wrote',out,out.stat().st_size//1024,'KB; the sheet as laid out:',WD/f'sheet-{n}.png')
        await b.close()
if __name__=='__main__':asyncio.run(main())
