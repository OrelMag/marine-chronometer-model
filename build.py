#!/usr/bin/env python3
"""Build both projects and the website.

    python build.py                                  # rebuild everything
    python build.py --site-url https://example.org   # also set the site's public address (link previews, canonical URL)
    python build.py --site-url https://example.org --keep-html   # for hosts that serve /page.html without redirecting to /page

Writes:
  marine-chronometer-source/chronometer-working-model/dist/chronometer-working-model.html
  marine-chronometer-source/marine-chronometer-essay/marine-chronometer.html
  chronometer-working-model.html, marine-chronometer.html      (root copies, for opening straight from the repo)
  site/                                                         (the folder to upload to a web host)
     index.html            the working model, the site's home page
     marine-chronometer.html   the essay
     social.png            link-preview image of the model page (the dial in its box)
     social-movement.png   link-preview image of the essay page (the mechanism), also for posting
Each HTML file is self-contained: three.js and the fonts are inlined, so nothing is fetched from another server.
"""
import argparse,os,pathlib,re,shutil,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT))
from inline import inline,remote_refs
MODEL=ROOT/'marine-chronometer-source/chronometer-working-model'
ESSAY=ROOT/'marine-chronometer-source/marine-chronometer-essay'
SITE=ROOT/'site'

def write(p,text):
    p.write_text(text,encoding='utf-8',newline='\n');print('wrote',p.relative_to(ROOT),f'{len(text.encode())/1024:.0f} KB')

def check(name,html):
    r=remote_refs(html)
    if r:sys.exit(f'{name} still loads {r}: vendor the file and point the page at it')

BUDGET={'working model':1_600_000,'essay':1_100_000}   # bytes: a page past its budget fails the build (the model was 1.33 MB, the essay 0.94 MB, on 30 September 2026)
def budget(name,html):
    """Print where a page's bytes go (three.js, fonts, images, the rest) and fail if it is over its budget."""
    n=len(html.encode());three=(ROOT/'vendor/three.min.js').stat().st_size if 'three.min.js' in html or 'REVISION' in html else 0
    fonts=sum(map(len,re.findall(r'data:font/[^;]+;base64,[A-Za-z0-9+/=]+',html)));imgs=sum(map(len,re.findall(r'data:image/[^;,]+;base64,[A-Za-z0-9+/=]+',html)))
    kb=lambda b:f'{b/1024:.0f} KB'
    print(f'  {name}: {kb(n)} of {kb(BUDGET[name])} = three.js {kb(three)}, fonts {kb(fonts)}, images {kb(imgs)}, the rest {kb(n-three-fonts-imgs)}')
    if n>BUDGET[name]:sys.exit(f'{name} is {kb(n)}, over its budget of {kb(BUDGET[name])} (BUDGET in build.py): find what grew, or raise the budget knowingly')

def meta(html,url,page,img='social.png',keep=False):
    """Link-preview and canonical tags that need the site's absolute address."""
    if not url:return html
    # Cloudflare (Workers and Pages) redirects /page.html to /page, so name the address it ends up at, unless --keep-html
    u=url.rstrip('/')+'/'+('' if page=='index.html' else page if keep else page.removesuffix('.html'))
    tags=(f'<link rel="canonical" href="{u}">\n<meta property="og:url" content="{u}">\n'
          f'<meta property="og:image" content="{url.rstrip("/")}/{img}">\n<meta property="og:image:width" content="1200">\n'
          f'<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n')
    return html.replace('</head>',tags+'</head>',1)

def main():
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--keep-html',action='store_true',help="keep .html in page addresses (for hosts that don't redirect /page.html to /page)")
    ap.add_argument('--site-url',default=os.environ.get('SITE_URL',''),help='public address of the site, e.g. https://marine-chronometer.pages.dev (or set SITE_URL)')
    a=ap.parse_args()
    # working model: its own build script writes dist/
    subprocess.run([sys.executable,str(MODEL/'build.py')],check=True)
    model=(MODEL/'dist/chronometer-working-model.html').read_text(encoding='utf-8');check('working model',model);budget('working model',model)
    # essay: the pieces in src/ are one page split in four (p1.html opens the <script> that p2-p4 continue)
    parts=''.join((ESSAY/'src'/f).read_text(encoding='utf-8') for f in('p1.html','p2.js','p3.js','p4.js'))
    essay=inline(parts+'\n</script>\n</body>\n</html>\n',ESSAY);check('essay',essay);budget('essay',essay)
    write(ESSAY/'marine-chronometer.html',essay)
    write(ROOT/'chronometer-working-model.html',model)
    write(ROOT/'marine-chronometer.html',essay)
    # site/: what a web host serves
    if SITE.exists():shutil.rmtree(SITE)
    SITE.mkdir()
    write(SITE/'index.html',meta(model,a.site_url,'index.html',keep=a.keep_html))
    # the essay links to the model by its repository name; on the site the model is the home page
    write(SITE/'marine-chronometer.html',meta(essay.replace('href="chronometer-working-model.html"','href="./"'),a.site_url,'marine-chronometer.html','social-movement.png',a.keep_html))
    for f in(ROOT/'site-assets').glob('*.png'):shutil.copy(f,SITE/f.name)   # link-preview images
    for f in(ROOT/'site-assets').glob('_*'):shutil.copy(f,SITE/f.name)   # host config such as _headers
    print('site/ is ready to upload'+('' if a.site_url else ' (no --site-url given: link previews will show no image)'))

if __name__=='__main__':main()
