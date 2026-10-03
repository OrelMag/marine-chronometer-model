#!/usr/bin/env python3
"""Build the working model and the website.

    python build.py                                  # rebuild everything
    python build.py --site-url https://example.org   # also set the site's public address (link previews, canonical URL)
    python build.py --site-url https://example.org --keep-html   # for hosts that serve /page.html without redirecting to /page
    python build.py --release patch -m "what changed" [-m ...]   # a release: the next version in CHANGELOG.md (patch, minor or major), then the build

Writes:
  marine-chronometer-source/chronometer-working-model/dist/chronometer-working-model.html
  chronometer-working-model.html      (the root copy, for opening straight from the repo)
  site/                               (the folder to upload to a web host)
     index.html            the working model, the site's home page, with the essay as its Essay tab (/#essay; worker.js sends the essay's old address there)
     social.png            link-preview image of the page (the dial in its box)
     social-movement.png   an image of the mechanism titled for the essay, for posting
     sitemap.xml, robots.txt   for search engines (with --site-url only)
The HTML file is self-contained: three.js and the fonts are inlined, so nothing is fetched from another server.
Its version and list of changes come from CHANGELOG.md (changelog.py); a build without --release changes neither, so CI's rebuild matches.
"""
import argparse,gzip,os,pathlib,re,shutil,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT))
from inline import inline,remote_refs
import changelog
MODEL=ROOT/'marine-chronometer-source/chronometer-working-model'
SITE=ROOT/'site'

def write(p,text):
    p.write_text(text,encoding='utf-8',newline='\n');print('wrote',p.relative_to(ROOT),f'{len(text.encode())/1024:.0f} KB')

def check(name,html):
    r=remote_refs(html)
    if r:sys.exit(f'{name} still loads {r}: vendor the file and point the page at it')

BUDGET={'working model':1_450_000}   # bytes: past its budget the build warns, and goes on (it failed until 3 October 2026, which stopped a release over 8 KB; a tripwire for growth nobody meant, not a limit the host sets) (1.33 MB with the Illustration's images on 30 September 2026; the essay moved in and the images out on 1 October; 1.40 MB until 3 October, raised by 30 KB for the balance's numbered holes and the rate panel's pairs, temperature and link, 1.408 MB then; 1.43 MB until 3 October, raised by 20 KB for the balance's dynamics: Swing and isochronism, the jolt, the gimbals' inertia, the temperature curves, 1.435 MB then)
def budget(name,html):
    """Print where a page's bytes go (three.js, fonts, images, the rest) and what a visitor downloads (gzip; the site sends Brotli, a little less), and warn if it is over its budget."""
    n=len(html.encode());three=(ROOT/'vendor/three.min.js').stat().st_size if 'three.min.js' in html or 'REVISION' in html else 0
    fonts=sum(map(len,re.findall(r'data:font/[^;]+;base64,[A-Za-z0-9+/=]+',html)));imgs=sum(map(len,re.findall(r'data:image/[^;,]+;base64,[A-Za-z0-9+/=]+',html)))
    kb=lambda b:f'{b/1024:.0f} KB'
    print(f'  {name}: {kb(n)} of {kb(BUDGET[name])} = three.js {kb(three)}, fonts {kb(fonts)}, images {kb(imgs)}, the rest {kb(n-three-fonts-imgs)}; {kb(len(gzip.compress(html.encode(),9)))} compressed')
    if n>BUDGET[name]:print(f'  WARNING: {name} is {kb(n)}, over its budget of {kb(BUDGET[name])} (BUDGET in build.py): find what grew, or raise the budget knowingly')

def address(url,page,keep=False):
    # Cloudflare (Workers and Pages) redirects /page.html to /page, so name the address it ends up at, unless --keep-html
    return url.rstrip('/')+'/'+('' if page=='index.html' else page if keep else page.removesuffix('.html'))

def meta(html,url,page,img='social.png',keep=False):
    """Link-preview and canonical tags that need the site's absolute address."""
    if not url:return html
    u=address(url,page,keep)
    tags=(f'<link rel="canonical" href="{u}">\n<meta property="og:url" content="{u}">\n'
          f'<meta property="og:image" content="{url.rstrip("/")}/{img}">\n<meta property="og:image:width" content="1200">\n'
          f'<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n')
    return html.replace('</head>',tags+'</head>',1)

def main():
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--keep-html',action='store_true',help="keep .html in page addresses (for hosts that don't redirect /page.html to /page)")
    ap.add_argument('--site-url',default=os.environ.get('SITE_URL',''),help='public address of the site, e.g. https://marine-chronometer.pages.dev (or set SITE_URL)')
    ap.add_argument('--release',choices=['patch','minor','major'],help='add the next version to CHANGELOG.md, with today’s date and the -m lines, before building')
    ap.add_argument('-m',dest='notes',action='append',default=[],help='with --release: one line of what changed, for visitors (repeat for more)')
    a=ap.parse_args()
    if a.notes and not a.release:ap.error('-m goes with --release')
    if a.release:print('release',changelog.release(a.release,a.notes))
    # the working model, with the essay in its Essay tab: its own build script writes dist/
    subprocess.run([sys.executable,str(MODEL/'build.py')],check=True)
    model=(MODEL/'dist/chronometer-working-model.html').read_text(encoding='utf-8');check('working model',model);budget('working model',model)
    write(ROOT/'chronometer-working-model.html',model)
    # site/: what a web host serves
    if SITE.exists():shutil.rmtree(SITE)
    SITE.mkdir()
    write(SITE/'index.html',meta(model,a.site_url,'index.html',keep=a.keep_html))
    for f in(ROOT/'site-assets').glob('*.png'):shutil.copy(f,SITE/f.name)   # the link-preview image, and the essay's image for posting
    for f in(ROOT/'site-assets').glob('_*'):shutil.copy(f,SITE/f.name)   # host config such as _headers
    if a.site_url:   # for search engines: the page, at the address its canonical tag names
        write(SITE/'sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
              f'<url><loc>{address(a.site_url,"index.html",a.keep_html)}</loc></url>\n'+'</urlset>\n')
        write(SITE/'robots.txt',f'User-agent: *\nAllow: /\nSitemap: {a.site_url.rstrip("/")}/sitemap.xml\n')
    print('site/ is ready to upload'+('' if a.site_url else ' (no --site-url given: link previews will show no image)'))

if __name__=='__main__':main()
