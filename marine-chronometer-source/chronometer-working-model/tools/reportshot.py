"""A stretch of a report (or any page) photographed: from one element to another, the page's full width (docs/motion-3d/'s figures of the reports). Playwright.

    python reportshot.py PAGE FROM_ID TO_ID OUT.png [--width 1300] [--wait 3000]    # a few seconds

PAGE a file (a report's index.html) or a URL; FROM_ID and TO_ID the ids of the first and last elements to take (a section's heading, its last table or callout).
Exits 1 on a page error, a console error or an id not on the page."""
import os,pathlib,sys
from playwright.sync_api import sync_playwright
import browser
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
def main():
    a=[x for i,x in enumerate(sys.argv[1:]) if not x.startswith('--') and not (i and sys.argv[i].startswith('--'))]
    if len(a)<4:sys.exit(__doc__)
    page,fr,to,out=a[:4];url=page if '://' in page else pathlib.Path(page).resolve().as_uri();W=int(arg('--width',1300))
    with sync_playwright() as pw:
        b=pw.chromium.launch(args=browser.ARGS);pg=b.new_page(viewport={'width':W,'height':1000});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        pg.goto(url);pg.wait_for_timeout(int(arg('--wait',3000)))
        box=pg.evaluate("([a,b])=>{const A=document.getElementById(a),B=document.getElementById(b);if(!A||!B)return null;return[A.getBoundingClientRect().top+scrollY,B.getBoundingClientRect().bottom+scrollY]}",[fr,to])
        if box:pg.screenshot(path=out,full_page=True,clip={'x':0,'y':box[0]-10,'width':W,'height':box[1]-box[0]+20})
        b.close()
    print(f'{out}: {page} #{fr} to #{to}' if box else f'no #{fr} or #{to} on {page}','| errors',errs[:3] or 'none')
    sys.exit(0 if box and not errs else 1)
if __name__=='__main__':main()
