"""The Wempe's Laid out view against a textbook's developed drawing of a fusee chronometer ("Modern chronometer movement", Figs. 83 (elevation) and 84 (plan),
its letters of reference): every element the drawing letters is in the view, shown, on screen, and opens its own card when clicked (the schematic plates too, which
stand in for the frame laid out); then both views rendered on one sheet with the drawing's letters as callouts and a key.

    python wempe_laidout.py [OUTDIR]        # r_laidout_sheet.png (both views and the key) and r_laidout_checks.json in OUTDIR, default the current directory

What the drawing letters and the Wempe has otherwise: B' (the stud carrying the stop work) has no counterpart, the Wempe's stop bar sliding in a slot across the fusee's
own small end; S' (the snail the stopping arm meets) is the stop pin in the top plate that the bar meets (the stop work turned round: the arm in the fusee, its stop in
the plate); s, the bar's spring, lies inside the fusee's small end under its cover plate, in the view but out of sight from any side (HIDDEN; its letter in brackets).
Each element is clicked where the view shows it (the elevation, else the plan, as the drawing's two figures share their letters), the page's own pick: a real click, its
anchor a pixel where the page's rule (the first part not see-through, else the smallest schematic plate) finds it. Exits 1 if an element is missing from the view, out of
sight in both views (HIDDEN apart), or a click on it opens another part's card. About 1 minute."""
import asyncio,browser,json,math,pathlib,sys
import model
from playwright.async_api import async_playwright
from PIL import Image,ImageChops,ImageDraw,ImageFont
sys.stdout.reconfigure(encoding='utf-8')
PAGE=(model.MODELS['wempe']/'index.html').as_uri()+'?snap&qa&start=movement#merge=0'
OUT=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '.')
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading,#info{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""   # views.py's
# (letter, the drawing's name, the Wempe's key: a part or part.piece; ':gear'/':arbor' the toothed mesh of a piece or the plain one; None: no counterpart, with why)
FIG=[('Framework',[('A','The pillar plate','pillarPlate'),('A′','The top-plate','topPlate'),('B','The pillars','pillars')]),
  ('Driving power',[('C','The mainspring barrel','barrel.drum'),('c','The barrel arbor, squared for setting up','barrelArbor.arbor'),('r','Ratchet (set-up)','setupRatchet'),
    ('r′','Click (set-up)','barrelBridge.click'),('f','The fusee chain','chain')]),
  ('Fusee and maintaining power',[('D','The fusee','fusee.body'),('d','The fusee arbor, squared for the key','fusee.arbor'),('D′','Ratchet wheel of the maintaining power','maintaining.ratchet'),
    ('d′','Click of the maintaining power','maintDetent.click'),('B′','Stud carrying the stop-work',None,'no stud: the bar slides in a slot across the fusee’s small end'),
    ('S','Stopping-arm','stopWork.bar'),('S′','Stopping-snail','topPlate.stopPin','the stop pin the bar meets (the stop work turned round)'),('s','Stopping-arm spring','stopWork.spring')]),
  ('Train',[('D″','The great wheel','fuseeWheel'),('E','The centre wheel','centreWheel.wheel'),('e','The centre wheel arbor','centreWheel.arbor:arbor'),('E′','The centre wheel pinion','centreWheel.arbor:gear'),
    ('G','The third wheel','intermediateWheel.wheel'),('g','The third wheel arbor','intermediateWheel.arbor:arbor'),('G′','The third wheel pinion','intermediateWheel.arbor:gear'),
    ('H','The fourth wheel','secondsWheel.wheel'),('h','The fourth wheel arbor','secondsWheel.arbor:arbor'),('H′','The fourth wheel pinion','secondsWheel.arbor:gear'),
    ('K','The escape wheel','escapeWheel.wheel'),('k','The escape wheel arbor','escapeWheel.pinion:arbor'),('K′','The escape wheel pinion','escapeWheel.pinion:gear')]),
  ('Up-and-down indicator',[('P','Pinion mounted on the fusee arbor','udPinion'),('p','Wheel engaging with P','udWheel.wheel')]),
  ('Motion work and hands',[('V','The cannon pinion','cannon:gear'),('V′','The minute wheel','changeWheel.wheel'),('X','The minute pinion','changeWheel.pinion'),('X′','The hour wheel','hourWheel.wheel'),
    ('Y','The minute hand','hands.minute'),('Z','The hour hand','hands.hour')]),
  ('Drawn, not lettered',[('1','Balance (under the cock Z of Fig. 84)','balance.rim'),('2','Hairspring','hairspring.spring'),('3','Detent','detent.detent'),('4','Upper balance cock','upperCock'),
    ('5','Lower balance cock','lowerCock'),('6','Intermediate bridge','intermediateBridge'),('7','Barrel bridge','barrelBridge.bridge'),('8','Seconds hand','hands.seconds'),('9','Up-and-down hand','hands.ud')])]
HIDDEN={'s':'inside the fusee’s small end, under its cover plate'}
ITEMS=[(L,n,k,(x[0] if x else '')) for _,g in FIG for (L,n,k,*x) in g]
JS=r"""((items)=>{const mv=window.__mv,r=window.__r,cv=r.domElement,ci=JSON.parse(__camInfo()),W=cv.clientWidth,H=cv.clientHeight;
  const cam=new THREE.PerspectiveCamera(ci.fov,W/H,1,6000);cam.position.set(...ci.pos);cam.lookAt(new THREE.Vector3(...ci.tgt));cam.updateMatrixWorld();cam.updateProjectionMatrix();
  const sh=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;},M=[];mv.traverse(o=>{if(o.isMesh&&sh(o))M.push(o);});
  const isG=m=>!!(m.userData.gear||(m.parent&&m.parent.userData&&m.parent.userData.gear));
  const sel=key=>{const[k,f]=key.split(':');return M.filter(m=>(m.userData.pk===k||m.userData.part===k)&&(!f||(f==='gear')===isG(m)));};
  const P=window.__parts,title=k=>{const[p,c]=k.split('.');const q=P[p];if(!q)return null;if(!c)return q.t;const pc=(q.pcs||[]).find(x=>x.k===c);return pc?pc.t:null;};
  const v=new THREE.Vector3(),box=S=>{const b=new THREE.Box3();S.forEach(m=>b.expandByObject(m));let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for(let i=0;i<8;i++){v.set(i&1?b.max.x:b.min.x,i&2?b.max.y:b.min.y,i&4?b.max.z:b.min.z).project(cam);const x=(v.x+1)/2*W,y=(1-v.y)/2*H;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return[x0,y0,x1,y1];};
  /* the page's pick (viewer.js hitAt): the first hit not see-through (glass, or a schematic plate, drawn see-through laid out), else the smallest schematic plate hit */
  const thr=m=>{const m0=m.userData.mat0||m.material;return !!m.userData.devPlate||(m0.transparent&&m0.opacity<0.5);};
  const rc=new THREE.Raycaster(),pickAt=(x,y)=>{rc.setFromCamera({x:x/W*2-1,y:-(y/H*2-1)},cam);const hs=rc.intersectObjects(M,false);
    const h=hs.find(h=>!thr(h.object))||hs.filter(h=>h.object.userData.devPlate).sort((a,b)=>a.object.userData.rad-b.object.userData.rad)[0];return h?h.object:null;};
  const out={};
  for(const[L,,key]of items){if(!key)continue;const S=sel(key),set=new Set(S);if(!S.length){out[L]={n:0,hits:0};continue;}
    const[x0,y0,x1,y1]=box(S),hs=[],N=32;
    for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){const x=x0+(x1-x0)*i/N,y=y0+(y1-y0)*j/N;if(x<1||y<1||x>W-1||y>H-1)continue;const o=pickAt(x,y);if(o&&set.has(o))hs.push([x,y,o.userData.pk]);}
    let a=null;if(hs.length){const cx=hs.reduce((s,h)=>s+h[0],0)/hs.length,cy=hs.reduce((s,h)=>s+h[1],0)/hs.length;a=hs.reduce((p,h)=>Math.hypot(h[0]-cx,h[1]-cy)<Math.hypot(p[0]-cx,p[1]-cy)?h:p);}
    const pk=a?a[2]:S[0].userData.pk;out[L]={n:S.length,hits:hs.length,at:a?[a[0],a[1]]:[(x0+x1)/2,(y0+y1)/2],pk,title:title(pk),plate:S.some(m=>m.userData.devPlate)};}
  return {W,H,out};})"""
def font(names,size):
    for n in names:
        try:return ImageFont.truetype(n,size)
        except OSError:pass
    return ImageFont.load_default()
def spread(xs,gap,lo,hi):
    """label places as near their anchors' x as a least gap allows, kept in [lo, hi] (forward, then back)"""
    p=list(xs)
    for i in range(1,len(p)):p[i]=max(p[i],p[i-1]+gap)
    if p and p[-1]>hi:p[-1]=hi
    for i in range(len(p)-2,-1,-1):p[i]=min(p[i],p[i+1]-gap)
    if p and p[0]<lo:
        p[0]=lo
        for i in range(1,len(p)):p[i]=max(p[i],p[i-1]+gap)
    return p
def wrap(d,s,f,w):
    o,cur=[],''
    for t in s.split(' '):
        if cur and d.textlength(cur+' '+t,font=f)>w:o.append(cur);cur=t
        else:cur=(cur+' '+t).strip()
    return o+([cur] if cur else [])
FONTS=lambda F:dict(LET=font(['georgiai.ttf','cambriai.ttf'],F(21)),LK=font(['georgiai.ttf','cambriai.ttf'],F(15)),TXT=font(['georgia.ttf','cambria.ttc'],F(14)),
  HD=font(['georgiab.ttf','georgia.ttf'],F(13)),SUB=font(['georgia.ttf'],F(17)),TT=font(['georgia.ttf'],F(24)))
INK,RED,BLUE=(40,40,40),(150,30,30),(60,85,140)
def panel(shot,bg,res,sub,dpr):
    """one view: the render cropped to what the movement draws, its letters in a row above and one below, leaders to their anchors (dashed for HIDDEN)"""
    im=Image.open(shot).convert('RGB');F=lambda s:int(s*dpr);T=FONTS(F)
    bb=ImageChops.difference(im,Image.open(bg).convert('RGB')).convert('L').point(lambda v:255 if v>10 else 0).getbbox()   # what the movement draws: against the same frame without it
    pad=F(16);bx0,by0,bx1,by1=max(0,bb[0]-pad),max(0,bb[1]-pad),min(im.size[0],bb[2]+pad),min(im.size[1],bb[3]+pad)
    im=im.crop((bx0,by0,bx1,by1));W,H=im.size
    A=[(L,(res[L]['at'][0]*dpr-bx0,res[L]['at'][1]*dpr-by0),res[L]['hits']==0) for L,_,k,_ in ITEMS if k and res.get(L,{}).get('n')]
    A=[a for a in A if not a[2] or a[0] in HIDDEN]   # out of sight in this view: lettered in the other (HIDDEN in both, dashed)
    band=F(62);top=F(34);C=Image.new('RGB',(W,top+band+H+band),'white');oy=top+band;C.paste(im,(0,oy));d=ImageDraw.Draw(C);d.text((F(4),F(4)),sub,font=T['SUB'],fill=INK)
    mid=sorted(a[1][1] for a in A)[len(A)//2]   # the anchors shared evenly between the rows above and below
    for up in (True,False):
        S=sorted([a for a in A if (a[1][1]<mid)==up],key=lambda a:a[1][0])
        if not S:continue
        xs=spread([a[1][0] for a in S],F(30),F(14),W-F(14));ly=oy-band*0.5 if up else oy+H+band*0.5
        for (L,p,hid),lx in zip(S,xs):
            t=('('+L+')') if hid else L;tw=d.textlength(t,font=T['LET']);px,py=p[0],p[1]+oy;ey=ly+(F(12) if up else -F(12))
            if hid:
                n=int(max(2,((px-lx)**2+(py-ey)**2)**0.5//F(6)))
                for i in range(0,n,2):d.line([(lx+(px-lx)*i/n,ey+(py-ey)*i/n),(lx+(px-lx)*(i+1)/n,ey+(py-ey)*(i+1)/n)],fill=RED,width=max(1,F(1)))
            else:d.line([(lx,ey),(px,py)],fill=RED,width=max(1,F(1)))
            d.ellipse([px-F(2.5),py-F(2.5),px+F(2.5),py+F(2.5)],fill=RED);d.text((lx-tw/2,ly-F(13)),t,font=T['LET'],fill=RED)
    return C
def key(views,dpr,hmax):
    """the key: each group of the drawing's letters with its names and the Wempe's part (the card's title) under it, in as many columns as keep it within hmax"""
    F=lambda s:int(s*dpr);T=FONTS(F);KW=F(450);meas=ImageDraw.Draw(Image.new('RGB',(10,10)));blocks=[]
    for g,its in FIG:
        b=[('h',g.upper(),F(20))]
        for L,nm,k,*why in its:
            t=next((v[L]['title'] for v in views if v.get(L,{}).get('title')),'') if k else '— '+why[0]
            if k and why:t+=': '+why[0]
            if L in HIDDEN:t+=' ('+HIDDEN[L]+')'
            b.append(('L',(('('+L+')') if L in HIDDEN else L,nm),F(17)))
            b+=[('w',ln,F(17)) for ln in wrap(meas,t,T['TXT'],KW-F(70))]
        blocks.append(b+[('s','',F(8))])
    cols=[[]];h=0
    for b in blocks:
        bh=sum(x[2] for x in b)
        if h+bh>hmax and cols[-1]:cols.append([]);h=0
        cols[-1]+=b;h+=bh
    C=Image.new('RGB',(KW*len(cols),max(sum(x[2] for x in c) for c in cols)),'white');d=ImageDraw.Draw(C)
    for ci,c in enumerate(cols):
        x=ci*KW;y=0
        for kind,v,hh in c:
            if kind=='h':d.text((x,y),v,font=T['HD'],fill=(100,100,100))
            elif kind=='L':d.text((x,y),v[0],font=T['LK'],fill=RED);d.text((x+F(38),y),v[1],font=T['TXT'],fill=INK)
            elif kind=='w':d.text((x+F(52),y),v,font=T['TXT'],fill=BLUE)
            y+=hh
    return C
def sheet(panels,views,path,dpr):
    """the two views one above the other, the key beside them, under one title (as the drawing's Figs. 83 and 84 share their letters)"""
    F=lambda s:int(s*dpr);T=FONTS(F);g=F(24);top=F(70);pw=max(p.size[0] for p in panels);ph=sum(p.size[1] for p in panels)+g*(len(panels)-1)
    K=key(views,dpr,ph);C=Image.new('RGB',(F(20)+pw+F(40)+K.size[0]+F(20),top+max(ph,K.size[1])+F(40)),'white');d=ImageDraw.Draw(C)
    d.text((F(20),F(18)),'Wempe Einheits-Chronometer, laid out, against a textbook’s developed drawing (“Modern chronometer movement”, Figs. 83 and 84) and its letters of reference',font=T['TT'],fill=INK)
    y=top
    for p in panels:C.paste(p,(F(20),y));y+=p.size[1]+g
    C.paste(K,(F(20)+pw+F(40),top+F(6)));C.save(path)
async def main():
    OUT.mkdir(parents=True,exist_ok=True);dpr=2;fails=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(2000);await w.close()
        pg=await b.new_page(viewport={"width":1800,"height":1000},device_scale_factor=dpr,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.id='shotcss';s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE)
        await pg.evaluate("document.querySelector('#views button[data-v=\"laidout\"]').click()");await pg.wait_for_timeout(3000)
        DEV=json.loads(await pg.evaluate("JSON.stringify(window.__mv.userData.DEV)"));yaw=math.atan2(DEV['w'][1],DEV['w'][0])
        views={};clicked={};panels=[];css=lambda a,b2:pg.evaluate("((a,b)=>{const s=document.getElementById('shotcss');s.textContent=s.textContent.replace(a,b);})(%s,%s)"%(json.dumps(a),json.dumps(b2)))
        for name,pitch in (('elevation',0.05),('plan',1.5)):
            await pg.evaluate(f"window.__look({yaw},{pitch},420,{DEV['mid'][0]},-11,{DEV['mid'][1]})");await pg.wait_for_timeout(2500)
            shot=OUT/f'r_laidout_{name}_raw.png';await pg.screenshot(path=str(shot));bg=OUT/f'r_laidout_{name}_bg.png'
            await pg.evaluate("window.__mv.visible=false");await pg.wait_for_timeout(500);await pg.screenshot(path=str(bg));await pg.evaluate("window.__mv.visible=true");await pg.wait_for_timeout(500)
            R=await pg.evaluate(JS+"(%s)"%json.dumps([[L,n,k] for L,n,k,_ in ITEMS]));views[name]=R['out']
            panels.append(panel(shot,bg,R['out'],'Elevation, from the side (cf. Fig. 83)' if name=='elevation' else 'Plan, from the train side (cf. Fig. 84)',dpr));shot.unlink();bg.unlink()
            # a real click at each element's anchor not clicked yet (pointerdown and up; 0.55 s apart, so no two make a double), its card's title against the element's
            await css(',#info{','{')
            for L,nm,k,_ in ITEMS:
                q=R['out'].get(L)
                if not k or not q or not q.get('hits') or L in clicked:continue
                await pg.mouse.click(*q['at']);await pg.wait_for_timeout(550)
                got=await pg.evaluate("(()=>{const i=document.getElementById('info');return i.classList.contains('on')?i.querySelector('h3').textContent:null})()")
                clicked[L]=(name,got,q['title']);await pg.evaluate("document.querySelector('#info .x').click()");await pg.wait_for_timeout(200)
            await css('.loading{','.loading,#info{')
        sheet(panels,list(views.values()),OUT/'r_laidout_sheet.png',dpr)
        print('page errors:',errs);await b.close()
    E,Pl=views['elevation'],views['plan']
    for L,nm,k,why in ITEMS:
        if not k:print(f'   {L:3} {nm:42} --  {why}');continue
        e=E.get(L,{});pl=Pl.get(L,{});c=clicked.get(L);seen=e.get('hits',0)+pl.get('hits',0)
        ok=e.get('n',0)>0 and ((c is not None and c[1]==c[2]) or (seen==0 and L in HIDDEN))
        if not ok:fails.append(L)
        print(f"{'  ' if ok else 'XX'} {L:3} {nm:42} {k:30} meshes {e.get('n',0):3}  seen {e.get('hits',0):4} / plan {pl.get('hits',0):4}  "+(f"clicked in the {c[0]}: {c[1]}" if c else 'not clicked: '+HIDDEN.get(L,'out of sight')))
    (OUT/'r_laidout_checks.json').write_text(json.dumps({'views':views,'clicked':clicked},indent=1,ensure_ascii=False),encoding='utf-8')
    if errs:fails.append('page errors')
    print('FAIL: '+', '.join(fails) if fails else f'ok: every lettered element of Figs. 83-84 shown laid out and clickable ({sum(1 for i in ITEMS if i[2])} checked)');sys.exit(1 if fails else 0)
asyncio.run(main())
