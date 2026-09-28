#!/usr/bin/env python3
"""Build both projects and the website.

    python build.py                                  # rebuild everything
    python build.py --site-url https://example.org   # also set the site's public address (link previews, canonical URL)

Writes:
  marine-chronometer-source/chronometer-working-model/dist/chronometer-working-model.html
  marine-chronometer-source/marine-chronometer-essay/marine-chronometer.html
  chronometer-working-model.html, marine-chronometer.html      (root copies, for opening straight from the repo)
  site/                                                         (the folder to upload to a web host)
     index.html            the working model, the site's home page
     marine-chronometer.html   the essay
     social.png            the link-preview image
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

def meta(html,url,page):
    """Link-preview and canonical tags that need the site's absolute address."""
    if not url:return html
    u=url.rstrip('/')+'/'+('' if page=='index.html' else page)
    tags=(f'<link rel="canonical" href="{u}">\n<meta property="og:url" content="{u}">\n'
          f'<meta property="og:image" content="{url.rstrip("/")}/social.png">\n<meta property="og:image:width" content="1200">\n'
          f'<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n')
    return html.replace('</head>',tags+'</head>',1)

def main():
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--site-url',default=os.environ.get('SITE_URL',''),help='public address of the site, e.g. https://marine-chronometer.pages.dev (or set SITE_URL)')
    a=ap.parse_args()
    # working model: its own build script writes dist/
    subprocess.run([sys.executable,str(MODEL/'build.py')],check=True)
    model=(MODEL/'dist/chronometer-working-model.html').read_text(encoding='utf-8');check('working model',model)
    # essay: the pieces in src/ are one page split in four (p1.html opens the <script> that p2-p4 continue)
    parts=''.join((ESSAY/'src'/f).read_text(encoding='utf-8') for f in('p1.html','p2.js','p3.js','p4.js'))
    essay=inline(parts+'\n</script>\n</body>\n</html>\n',ESSAY);check('essay',essay)
    write(ESSAY/'marine-chronometer.html',essay)
    write(ROOT/'chronometer-working-model.html',model)
    write(ROOT/'marine-chronometer.html',essay)
    # site/: what a web host serves
    if SITE.exists():shutil.rmtree(SITE)
    SITE.mkdir()
    write(SITE/'index.html',meta(model,a.site_url,'index.html'))
    write(SITE/'marine-chronometer.html',meta(essay,a.site_url,'marine-chronometer.html'))
    shutil.copy(ROOT/'site-assets/social.png',SITE/'social.png')
    for f in(ROOT/'site-assets').glob('_*'):shutil.copy(f,SITE/f.name)   # host config such as _headers
    print('site/ is ready to upload'+('' if a.site_url else ' (no --site-url given: link previews will show no image)'))

if __name__=='__main__':main()
