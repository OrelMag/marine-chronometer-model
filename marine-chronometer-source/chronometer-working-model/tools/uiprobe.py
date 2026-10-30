"""uiprobe.py: the pages' layout probed at a desktop's, a phone's upright and a phone's sideways sizes (30 October 2026). For each page (the Hamilton's, the
Wempe's, the essay's) and size: console errors and warnings, the page scrolling sideways, and for each panel tab (Explore, Run, Look, Advanced; every group opened)
the visible controls that run out past the panel or the window, whose text is cut off inside them, buttons without a name, and, on the touch sizes, targets under
19 px (the parts list's 22 px boxes and 19 px folds pass WCAG 2.5.8 by its spacing exception: 4-8 px apart, a 24 px circle on each touches no other). Writes r_ui_PAGE_SIZE_TAB.png and prints the findings; exit 1 if any. It reports what a person sees; smoke.py works the controls.

    python uiprobe.py [--page hamilton,wempe,essay] [--size desk,phone,land]"""
import asyncio,os,sys,argparse,pathlib
sys.path.insert(0,os.path.dirname(__file__));import browser
from playwright.async_api import async_playwright
SRC=pathlib.Path(__file__).resolve().parents[2]
PAGES={'hamilton':SRC/'chronometer-working-model/index.html','wempe':SRC/'wempe/index.html','essay':SRC/'essay/index.html'}
SIZES={'desk':dict(viewport={'width':1400,'height':900}),'phone':dict(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2),
       'land':dict(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=2)}
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
          found=await page.evaluate(PROBE,sz!='desk')
          for f in dict.fromkeys(found):log.append(f'[{t}] {f}')
          await page.screenshot(path=str(outdir/f'r_ui_{pg}_{sz}_{t}.png'),full_page=False)
        print(f'== {pg} {sz}: {len(log)} finding(s)');[print('  '+l) for l in dict.fromkeys(log)];bad+=len(log)
        await ctx.close()
    await b.close()
  return bad
if __name__=='__main__':
  a=argparse.ArgumentParser();a.add_argument('--page',default='hamilton,wempe,essay');a.add_argument('--size',default='desk,phone,land');a.add_argument('--out',default='.')
  o=a.parse_args();out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True)
  sys.exit(1 if asyncio.run(run(o.page.split(','),o.size.split(','),out)) else 0)
