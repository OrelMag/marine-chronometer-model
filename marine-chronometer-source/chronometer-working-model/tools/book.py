"""book.py: the build book checked as paper. Opens the page (?snap&qa), builds the book (MAKER.book(), which doesn't print under a webdriver), lays it out as
print at A4's printable width (190 mm) and checks each part's section as a maker would use it, the page alone in hand:

  - the sheet: its parts-list lines, each with a material and a fit (not blank), the overall size, the source of its shape;
  - every line with a tolerance (tools/tolerances.js) shows it on its sheet, and every line with a test on the bench (tools/bench.js) its test; the
    chapter of those tests (the book's last, section.tests: text, not a part) has every one; the chapter before it, the manual's reassembly in its order
    (section.order, from js/overhaul.js), has every operation;
  - every line of the parts list on a part of the model (the movement's and the box's) on some sheet; a part with pieces is an assembly page (its card and drawing, no sheet),
    its lines on its pieces' sheets;
  - the drawing: printed at a stated scale (its title says "scale N:1" or "1:N", and the print matches it within 1 %: max-width must not shrink it), no
    taller than a page (277 mm), no wider than the column, its smallest text at least 1.5 mm high on paper (about 4 pt), its lines at least 0.1 mm.

Prints one line per finding and a summary; exit code 1 on any. --pdf OUT also writes the book as an A4 PDF (Chromium's print).

    python book.py [--pdf OUT.pdf]          # about 1 min
    python book.py --model wempe            # the Wempe's (its materials and processes chapter, section.procs, is text, not a part)
"""
import asyncio,browser,json,pathlib,re,sys
import model   # --model wempe: the Wempe's book (its js/makers.js, tools/wempe_makers.py): no reassembly chapter (the Wempe has no overhaul sequence: none is in its sources)
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent;PAGE=model.PAGE
PX=96/25.4;COL=190;PAGE_H=277
JS=r"""()=>{MAKER.book();document.documentElement.classList.add('book-print');const out=[];
  for(const s of document.querySelectorAll('#bookPrint section.bk:not(.tests):not(.order):not(.procs)')){const h=s.querySelector('h2').textContent,svg=s.querySelector('svg.mkd'),r={name:h,asm:s.classList.contains('asm'),lines:[],asBuilt:/As built: /.test(s.textContent),src:(s.textContent.match(/Source of its shape: ([^.]*)/)||[])[1]||''};
    for(const tr of s.querySelectorAll('table.mk:first-of-type tbody tr')){const td=[...tr.children].map(x=>x.textContent.trim());r.lines.push(td);}
    if(svg){const b=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,wmm=parseFloat(svg.getAttribute('width')),k=b.width/vb.width;   /* px a unit as laid out */
      const fs=[...svg.querySelectorAll('text')].map(t=>parseFloat(t.getAttribute('font-size'))||0).filter(x=>x>0),sw=[...svg.querySelectorAll('g[stroke-width]')].map(g=>parseFloat(g.getAttribute('stroke-width')));
      r.svg={w:b.width,h:b.height,vbw:vb.width,wmm,k,fsMin:Math.min(...fs),swMin:Math.min(...sw),title:(svg.querySelector('title')||{}).textContent||''};}
    out.push(r);}
  /* the lines on the model (the parts' cards': MAKERS' part), and each part that has meshes: every one must be on a sheet in the book */
  const onModel=new Set(Object.keys(window.__parts).filter(p=>window.__mv&&(()=>{let n=0;let root=window.__mv;while(root.parent)root=root.parent;root.traverse(o=>{if(o.isMesh&&o.userData.part===p)n++;});return n;})()));
  const txt=document.getElementById('bookPrint').textContent;
  /* BYHN (another model's book: its lines' cards and meshes may differ, and a version or a choice hides some): the lines a shown mesh carries, on the mesh or the group above it */
  const HN=new Set();if(BYHN){let root=window.__mv;while(root.parent)root=root.parent;root.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes.position)return;for(let q=o;q;q=q.parent)if(!q.visible)return;for(let q=o;q;q=q.parent)if(q.userData.hn){HN.add(q.userData.hn);break;}});}
  return {sec:out,lines:MAKERS.filter(l=>l.part&&onModel.has(l.part)&&(!BYHN||HN.has(l.id))).map(l=>[l.no,l.name,l.part]),tol:MAKERS.filter(l=>l.tol).map(l=>[l.no,l.name,txt.includes('Tolerance ('+l.no+').')]),tests:[document.querySelectorAll('#bookPrint section.tests h3').length,(MAKERS.tests||[]).length],order:[document.querySelectorAll('#bookPrint section.order h3').length,typeof OVH!=='undefined'?OVH.RE.length:0],bench:MAKERS.filter(l=>l.bench).map(l=>[l.no,l.name,txt.includes('Test on the bench ('+l.no+').')])};}"""
async def main():
    pdf=sys.argv[sys.argv.index('--pdf')+1] if '--pdf' in sys.argv else None
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS);pg=await b.new_page(viewport={'width':round(COL*PX),'height':1000})
        await pg.goto(PAGE);await pg.wait_for_function('window.__mv&&typeof MAKER!=="undefined"&&typeof MAKERS!=="undefined"',timeout=120000);await pg.emulate_media(media='print')
        R=await pg.evaluate(JS.replace('()=>{','()=>{const BYHN='+('false' if model.HAMILTON else 'true')+';',1));S=R['sec']
        if pdf:await pg.pdf(path=pdf,format='A4',margin={'top':'10mm','bottom':'10mm','left':'10mm','right':'10mm'},print_background=False)
        await b.close()
    bad=[];say=lambda n,m:bad.append(f'  !! {n}: {m}')
    printed={td[1] for r in S for td in r['lines'] if len(td)>=7}
    for no,name,part in R['lines']:
        if no not in printed:say(name,f'line {no} ({part}) is on no sheet of the book')
    for no,name,shown in R['tol']:   # a line the sources don't size (tools/tolerances.js): its sheet says how closely to make it
        if not shown:say(name,f'line {no}: its tolerance is on no sheet of the book')
    for no,name,shown in R['bench']:   # a line with a test on the bench (tools/bench.js): its sheet says so
        if not shown:say(name,f'line {no}: its test on the bench is on no sheet of the book')
    if R['tests'][0]!=R['tests'][1] or not R['tests'][1]:say('Tests on the bench',f"the chapter has {R['tests'][0]} tests of tools/bench.json's {R['tests'][1]}")
    if (model.HAMILTON or R['order'][1]) and (R['order'][0]!=R['order'][1] or not R['order'][1]):say('Putting it together',f"the chapter has {R['order'][0]} operations of the manual's reassembly's {R['order'][1]} (js/overhaul.js)")
    for r in S:
        n=r['name']
        if not r['asm']:   # an assembly (a part with pieces) has its card and its drawing as assembled; its lines are on its pieces' sheets
            if not r['lines'] or (len(r['lines'])==1 and len(r['lines'][0])<7):say(n,'no line of the parts list on its sheet')
            for td in r['lines']:
                if len(td)>=7 and (not td[4] or not td[6] or td[6] in ('—','-')):say(n,f'line {td[1]} {td[2][:30]}: material "{td[4][:20]}", fit "{td[6][:20]}"')
            if not r['asBuilt']:say(n,'no overall size')
            if not r['src'] or r['src'].strip()=='—':say(n,'no source of its shape')
        v=r.get('svg')
        if not v:say(n,'no drawing');continue
        pmm=v['w']/PX;scale=pmm/v['vbw']   # printed mm a model mm
        m=re.search(r'scale (\d+(?:\.\d+)?):(\d+(?:\.\d+)?)',v['title'])
        if not m:say(n,f'its drawing states no scale (printed at {scale:.3f}:1)')
        else:
            st=float(m.group(1))/float(m.group(2))
            if abs(scale/st-1)>0.01:say(n,f'its drawing says scale {m.group(1)}:{m.group(2)} but prints at {scale:.3f}:1')
        if v['h']/PX>PAGE_H:say(n,f'its drawing is {v["h"]/PX:.0f} mm tall, taller than a page')
        if v['w']/PX>COL+0.5:say(n,f'its drawing is {v["w"]/PX:.0f} mm wide, wider than the column')
        if v['fsMin']*scale<1.5:say(n,f'its smallest text prints {v["fsMin"]*scale:.2f} mm high')
        if v['swMin']*scale<0.1:say(n,f'its finest lines print {v["swMin"]*scale:.3f} mm')
    print('\n'.join(bad));print(f'{len(S)} sections, {len(bad)} findings'+(f'; the PDF in {pdf}' if pdf else ''))
    sys.exit(1 if bad else 0)
asyncio.run(main())
