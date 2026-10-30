"""uiprobe.py: the pages' layout probed at a desktop's, a phone's upright and a phone's sideways sizes (30 October 2026). For each page (the Hamilton's, the
Wempe's, the essay's) and size: console errors and warnings, the page scrolling sideways, and for each panel tab (Explore, Run, Look, Advanced; every group opened)
the visible controls that run out past the panel or the window, whose text is cut off inside them, buttons without a name, text under WCAG's contrast (4.5:1, 3:1 large) on a solid background, and, on the touch sizes, targets under
19 px (the parts list's 22 px boxes and 19 px folds pass WCAG 2.5.8 by its spacing exception: 4-8 px apart, a 24 px circle on each touches no other). Writes r_ui_PAGE_SIZE_TAB.png and prints the findings; exit 1 if any. It reports what a person sees; smoke.py works the controls.
--jitter instead (about a minute a page and size; the Wempe's variants rebuild the model): what moves over 6 s with the model running, each choice in the panel
pressed shifting its neighbours, and the selection bar moving under its own opacity slider or squeezing the hint; exit 1 if any.

    python uiprobe.py [--page hamilton,wempe,essay] [--size desk,phone,land,tab,tabland,dark,darkphone] [--jitter]"""
import asyncio,os,sys,argparse,pathlib
sys.path.insert(0,os.path.dirname(__file__));import browser
from playwright.async_api import async_playwright
SRC=pathlib.Path(__file__).resolve().parents[2]
PAGES={'hamilton':SRC/'chronometer-working-model/index.html','wempe':SRC/'wempe/index.html','essay':SRC/'essay/index.html'}
SIZES={'desk':dict(viewport={'width':1400,'height':900}),'phone':dict(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2),
       'land':dict(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=2),
       'tab':dict(viewport={'width':768,'height':1024},has_touch=True,is_mobile=True,device_scale_factor=2),'tabland':dict(viewport={'width':1024,'height':768},has_touch=True,is_mobile=True,device_scale_factor=2),
       'dark':dict(viewport={'width':1400,'height':900},color_scheme='dark'),'darkphone':dict(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2,color_scheme='dark')}
PROBE=r"""(touch)=>{const out=[],W=innerWidth,de=document.documentElement;
 if(de.scrollWidth>W+1)out.push(`page scrolls sideways: ${de.scrollWidth} > ${W}`);
 const vis=e=>{if(!e.getClientRects().length)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0};
 const name=e=>(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/).join('.'):'')+' "'+(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,30)+'"';
 const hint=document.querySelector('#hint');if(hint&&vis(hint)&&hint.getBoundingClientRect().width<160)out.push(`hint squeezed to ${Math.round(hint.getBoundingClientRect().width)} px`);
 const panel=document.querySelector('#panel'),pr=panel&&vis(panel)?panel.getBoundingClientRect():null;
 const ctl=[...document.querySelectorAll('button,a[href],input,select,label.ck,.seg,.row')].filter(vis);
 const scroller=e=>{for(let a=e.parentElement;a;a=a.parentElement){const o=getComputedStyle(a).overflowX;if((o==='auto'||o==='scroll'||o==='hidden')&&a.scrollWidth>a.clientWidth)return true}return false};
 for(const e of ctl){let r=e.getBoundingClientRect();if(r.width===0||r.height===0)continue;
  if((r.right>W+1||r.left<-1)&&scroller(e))continue;
  if(r.right>W+1||r.left<-1)out.push(`off the window (${Math.round(r.left)}..${Math.round(r.right)}): ${name(e)}`);
  else if(pr&&panel.contains(e)&&(r.right>pr.right+1||r.left<pr.left-1))out.push(`out of the panel (${Math.round(r.left)}..${Math.round(r.right)} vs ${Math.round(pr.left)}..${Math.round(pr.right)}): ${name(e)}`);
  if(e.matches('button,label.ck')&&e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!=='visible')out.push(`text cut off (${e.scrollWidth}>${e.clientWidth}): ${name(e)}`);
  if(e.matches('button')&&!(e.getAttribute('aria-label')||e.textContent.trim()||e.title||e.getAttribute('aria-labelledby')))out.push(`button without a name: ${e.outerHTML.slice(0,80)}`);
  const lb=e.matches('input')&&e.closest('label');if(lb)r=lb.getBoundingClientRect();   /* a box's target is its label */
  if(touch&&e.matches('button,input[type=checkbox],input[type=range]')&&(r.height<19||r.width<19)&&!e.closest('p,li,.help'))out.push(`small target ${Math.round(r.width)}x${Math.round(r.height)}: ${name(e)}`);}
 return out}"""
JITTER=r"""async()=>{const els=[...document.querySelectorAll('button,.hud,.hud *,#hint,label,.info,.info *,.dock,.play,.vstrip,.selbar,.selbar *,[class*=sel] ')].filter(e=>e.getClientRects().length&&!e.closest('#panel'));
 const key=e=>(e.id?'#'+e.id:'')+'.'+(typeof e.className==='string'?e.className.trim().replace(/\s+/g,'.'):'')+' "'+(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,24)+'"';
 const first=new Map(els.map(e=>{const r=e.getBoundingClientRect();return[e,[r.left,r.width,r.top,r.height]]})),moved=new Map();
 for(let i=0;i<60;i++){await new Promise(r=>setTimeout(r,100));for(const e of els){if(!e.isConnected)continue;const r=e.getBoundingClientRect(),f=first.get(e),d=Math.max(Math.abs(r.left-f[0]),Math.abs(r.width-f[1]),Math.abs(r.top-f[2]),Math.abs(r.height-f[3]));
  if(d>0.5){const m=moved.get(e)||{n:0,d:0};m.n++;m.d=Math.max(m.d,d);moved.set(e,m)}}}
 return[...moved].filter(([e,m])=>m.n>3).map(([e,m])=>`moves (${m.n}/60 samples, up to ${m.d.toFixed(1)} px): ${key(e)}`)}"""
SHIFT=r"""async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms)),out=[],R=e=>e.getBoundingClientRect();
 for(const g of [...document.querySelectorAll('.panel .seg')]){const p=g.closest('.tabp');if(p)UI.show(p.dataset.tab);const bs=[...g.querySelectorAll(':scope>button[aria-pressed]')];if(bs.length<2||!g.getClientRects().length)continue;
  if(bs.some(b=>b.closest('#speeds,#spP')))continue;   /* the speeds stop or run the model */
  const was=bs.find(b=>b.getAttribute('aria-pressed')==='true');const p0=bs.map(b=>R(b).left);let worst=0,who='';
  for(const b of bs){b.click();await w(120);if(!g.getClientRects().length)break;const d=Math.max(...bs.map((x,i)=>Math.abs(R(x).left-p0[i])));if(d>worst){worst=d;who=b.textContent.trim()}}
  if(was&&g.getClientRects().length){was.click();await w(120);}if(worst>0.5&&worst<200)out.push(`pressing "${who}" shifts its group ${worst.toFixed(1)} px: ${g.id||g.className}`);}
 if(window.__sel&&window.__parts){const K=Object.keys(__parts);__sel.set([K[3],K[5]]);await w(200);const s=document.querySelector('#selBar input'),x0=R(s).left,t0=R(document.querySelector('#selMode')).top;
  for(const v of[60,0,100]){s.value=v;s.dispatchEvent(new Event('input'));await w(150);const dx=Math.abs(R(s).left-x0),dy=Math.abs(R(document.querySelector('#selMode')).top-t0);
   if(dx>0.5||dy>0.5)out.push(`the selection's opacity slider at ${v} % moves it ${dx.toFixed(0)} px, the tools ${dy.toFixed(0)} px`);}
  const h=document.querySelector('#hint');if(h&&+getComputedStyle(h).opacity>0&&R(h).width<160)out.push('the hint squeezed beside the selection bar');__sel.set([]);document.querySelector('#selBar [data-s=unfade]')?.click();}
 return out}"""
CON=r"""()=>{const P=c=>{const m=c.match(/[\d.]+/g);return m?m.map(Number):null};
 const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
 const bgOf=e=>{for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(a.matches('.stage,canvas'))return null;if(s.backgroundImage!=='none'&&!s.backgroundImage.startsWith('url'))return null;const c=P(s.backgroundColor);if(c&&(c.length<4||c[3]>0.9))return c.slice(0,3);if(c&&c[3]>0)return null;}return P(getComputedStyle(document.body).backgroundColor).slice(0,3)};
 const out=new Map();const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=tw.nextNode()){const t=n.textContent.trim();if(t.length<2)continue;const e=n.parentElement;if(!e||!e.getClientRects().length||e.closest('[hidden],.hidden,svg,canvas,[aria-hidden=true]'))continue;
  const s=getComputedStyle(e);if(s.visibility==='hidden'||+s.opacity<.5)continue;let op=1;for(let a=e;a;a=a.parentElement)op*=+getComputedStyle(a).opacity;if(op<.5)continue;
  const fg=P(s.color);if(!fg||(fg[3]!=null&&fg[3]<1))continue;const bg=bgOf(e);if(!bg)continue;const L1=lum(fg),L2=lum(bg),r=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
  const big=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.66&&+s.fontWeight>=700),need=big?3:4.5;
  if(r<need){const k=(e.id?'#'+e.id:'')+'.'+(typeof e.className==='string'?e.className:'')+' '+s.color+' on rgb('+bg+')';if(!out.has(k))out.set(k,`${r.toFixed(2)} < ${need}: "${t.slice(0,40)}" ${k}`)}}
 return[...out.values()]}"""
DLG=r"""(sel)=>{const e=document.querySelector(sel),out=[],W=innerWidth,H=innerHeight;if(!e)return['missing'];
 const shown=x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden'&&+getComputedStyle(x).opacity>0.05;if(!shown(e))return['not shown after opening'];
 const r=e.getBoundingClientRect();if(r.left<-1||r.top<-1||r.right>W+1||r.bottom>H+1)out.push(`past the window: ${[r.left,r.top,r.right,r.bottom].map(Math.round)} in ${W}x${H}`);
 const st=document.querySelector('.stage'),sr=st&&st.contains(e)?st.getBoundingClientRect():null;if(sr&&(r.left<sr.left-1||r.top<sr.top-1||r.right>sr.right+1||r.bottom>sr.bottom+1))out.push(`past the stage: ${[r.left,r.top,r.right,r.bottom].map(Math.round)} in ${[sr.left,sr.top,sr.right,sr.bottom].map(Math.round)}`);
 const sc=[e,...e.querySelectorAll('*')].filter(x=>x.scrollHeight>x.clientHeight+2&&x.clientHeight>40&&getComputedStyle(x).overflowY!=='visible');   /* only a box that clips: a title's descenders past its box show */
 if(sc.length&&!sc.some(x=>/auto|scroll/.test(getComputedStyle(x).overflowY)))out.push(`content ${sc[0].scrollHeight} px cut at ${sc[0].clientHeight}, no scroll`);
 const vis=Math.min(r.bottom,H)-Math.max(r.top,0);if(e.scrollHeight>vis+2&&!/auto|scroll/.test(getComputedStyle(e).overflowY)&&!sc.length)out.push(`taller than shown (${e.scrollHeight} > ${Math.round(vis)}), no scroll`);
 const cl=sel==='#opm'?1:[...e.querySelectorAll('button,[role=button]')].find(b=>/close|done|cancel|×|✕/i.test((b.getAttribute('aria-label')||'')+(b.textContent||'')+(b.title||'')));
 if(!cl)out.push('no close control');else if(cl!==1&&!(e.scrollHeight>e.clientHeight+2&&/auto|scroll/.test(getComputedStyle(e).overflowY))){const c=cl.getBoundingClientRect();if(!shown(cl)||c.top<0||c.bottom>H||c.left<0||c.right>W)out.push('its close control off screen');}
 const ov=[...e.querySelectorAll('*')].filter(x=>x.children.length===0&&x.textContent.trim()&&shown(x)&&x.scrollWidth>x.clientWidth+2&&getComputedStyle(x).overflowX==='hidden'&&getComputedStyle(x).textOverflow!=='ellipsis');
 if(ov.length)out.push(`text cut sideways: "${ov[0].textContent.trim().slice(0,30)}"`);
 return out}"""
async def dialogs(pages,sizes,outdir):
  bad=0;OPEN={'info':None,'help':'#helpBtn','about':'#aboutBtn','report':'#reportBtn','opm':None}
  async with async_playwright() as p:
    b=await p.chromium.launch(args=browser.ARGS)
    for pg in pages:
      if pg=='essay':continue
      for sz in sizes:
        ctx=await b.new_context(**SIZES[sz]);page=await ctx.new_page();log=[]
        page.on('pageerror',lambda e:log.append(f'page error: {e}'))
        await page.goto(PAGES[pg].as_uri()+'?snap&qa#view=movement');await page.wait_for_timeout(6000)
        cv=await page.eval_on_selector('#stage canvas','c=>{const r=c.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]}')
        for name,opener in OPEN.items():
          sel={'info':'#info','help':'#help','about':'#about','report':'#report','opm':'#opm'}[name]
          if name=='opm' and sz!='desk':continue   # touch opens it by a long press
          await page.evaluate("()=>{const e=document.querySelector('#panel');e&&e.scrollIntoView()}") if opener in('#aboutBtn','#reportBtn') else None
          if opener:
            if name in('about','report'):await page.evaluate("t=>{UI.show('adv')}",None) if await page.evaluate("()=>!document.querySelector('#aboutBtn').getClientRects().length") else None
            await page.click(opener)
          elif name=='info':await page.evaluate("()=>window.scrollTo(0,0)");await page.mouse.click(*cv)
          else:await page.evaluate("()=>window.scrollTo(0,0)");await page.mouse.click(*cv,button='right')
          await page.wait_for_timeout(700)
          f=await page.evaluate(DLG,sel);inside=await page.evaluate("s=>{const d=document.querySelector(s);return !!d&&d.contains(document.activeElement)}",sel)
          if name in('about','report','help') and not inside:f.append('focus not moved into it')
          await page.screenshot(path=str(outdir/f'r_dlg_{pg}_{sz}_{name}.png'))
          await page.keyboard.press('Escape');await page.wait_for_timeout(500)
          still=await page.evaluate("s=>{const d=document.querySelector(s);return !!d&&!!d.getClientRects().length&&+getComputedStyle(d).opacity>0.05&&getComputedStyle(d).visibility!=='hidden'}",sel)
          if still:f.append('Escape left it open')
          if opener and name in('about','report','help'):
            back=await page.evaluate("o=>document.activeElement===document.querySelector(o)",opener)
            if not back:f.append('focus not returned to its button on close')
          f+=[f'contrast {x}' for x in await page.evaluate(CON)]
          for x in f:log.append(f'[{name}] {x}')
        log=list(dict.fromkeys(log));print(f'== {pg} {sz} dialogs: {len(log)}');[print('  '+l) for l in log];bad+=len(log);await ctx.close()
    await b.close()
  return bad
async def jitter(pages,sizes):
  bad=0
  async with async_playwright() as p:
    b=await p.chromium.launch(args=browser.ARGS)
    for pg in pages:
      for sz in sizes:
        ctx=await b.new_context(**SIZES[sz]);page=await ctx.new_page()
        await page.goto(PAGES[pg].as_uri()+('?qa' if pg!='essay' else ''));await page.wait_for_timeout(6000)
        f=await page.evaluate(JITTER)
        if pg!='essay':f+=await page.evaluate(SHIFT);print(f'== {pg} {sz} jitter: {len(f)}');[print('  '+l) for l in f];bad+=len(f);await ctx.close()
    await b.close()
  return bad
async def run(pages,sizes,outdir):
  bad=0
  async with async_playwright() as p:
    b=await p.chromium.launch(args=browser.ARGS)
    for pg in pages:
      for sz in sizes:
        ctx=await b.new_context(**SIZES[sz]);page=await ctx.new_page();log=[]
        page.on('console',lambda m:m.type in('error','warning')and not any(s in m.text for s in('GPU stall','SwiftShader','WebGL'))and log.append(f'console {m.type}: {m.text[:200]}'))
        page.on('pageerror',lambda e:log.append(f'page error: {e}'))
        await page.goto(PAGES[pg].as_uri()+('?snap' if pg!='essay' else ''));await page.wait_for_timeout(5000)
        tabs=await page.eval_on_selector_all('#ptabs [data-t]','b=>b.map(x=>x.dataset.t)')
        for t in tabs or ['page']:
          if t!='page':
            await page.evaluate("t=>{UI.show(t);document.querySelectorAll('.tabp:not([hidden]) details').forEach(d=>d.open=true)}",t)
            # the narrow sizes keep the panel below the stage or in a sheet: scroll it in
            await page.evaluate("()=>document.querySelector('#panel')?.scrollIntoView()");await page.wait_for_timeout(600)
          found=await page.evaluate(PROBE,sz not in('desk','dark'))+[f'contrast {x}' for x in await page.evaluate(CON)]
          for f in dict.fromkeys(found):log.append(f'[{t}] {f}')
          await page.screenshot(path=str(outdir/f'r_ui_{pg}_{sz}_{t}.png'),full_page=False)
        print(f'== {pg} {sz}: {len(log)} finding(s)');[print('  '+l) for l in dict.fromkeys(log)];bad+=len(log)
        await ctx.close()
    await b.close()
  return bad
if __name__=='__main__':
  a=argparse.ArgumentParser();a.add_argument('--page',default='hamilton,wempe,essay');a.add_argument('--size',default='desk,phone,land');a.add_argument('--out',default='.');a.add_argument('--jitter',action='store_true');a.add_argument('--dialogs',action='store_true')
  o=a.parse_args();out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True)
  if o.dialogs:sys.exit(1 if asyncio.run(dialogs(o.page.split(','),o.size.split(','),out)) else 0)
  if o.jitter:sys.exit(1 if asyncio.run(jitter(o.page.split(','),o.size.split(','))) else 0)
  sys.exit(1 if asyncio.run(run(o.page.split(','),o.size.split(','),out)) else 0)
