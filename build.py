#!/usr/bin/env python3
"""Build the working model and the website.

    python build.py                                  # rebuild everything
    python build.py --site-url https://example.org   # also set the site's public address (link previews, canonical URL)
    python build.py --site-url https://example.org --keep-html   # for hosts that serve /page.html without redirecting to /page
    python build.py --release patch -m "what changed" [-m ...]   # a release: the next version in CHANGELOG.md (patch, minor or major), then the build

Writes:
  marine-chronometer-source/chronometer-working-model/dist/chronometer-working-model.html
  marine-chronometer-source/wempe/dist/wempe-einheitschronometer.html   (the second model, the Wempe Einheits-Chronometer: in progress; no root copy)
  chronometer-working-model.html      (the root copy, for opening straight from the repo)
  site/                               (the folder to upload to a web host)
     index.html            the working model, the site's home page, with the essay as its Essay tab (/#essay; worker.js sends the essay's old address there)
     wempe/index.html      the Wempe Einheits-Chronometer (/wempe/), its link to the Hamilton pointed at the home page
     social.png            link-preview image of the page (the dial in its box)
     social-movement.png   an image of the mechanism titled for the essay, for posting
     navships-250-624-1948.pdf   the manual itself (References/, Google Books' scan of the 1948 Navy manual), which the page links to beside it
     verification/build-verification/   the checks' report "Would a chronometer made to the model run and keep time?" (its build_report.py, committed)
     verification/real-chronometers/    the report "Does the model behave like a real Hamilton Model 21?", with its plots
     sitemap.xml, robots.txt   for search engines (with --site-url only)
The HTML file is self-contained: three.js and the fonts are inlined, so nothing is fetched from another server.
Its version and list of changes come from CHANGELOG.md (changelog.py); a build without --release changes neither, so ci.py's rebuild matches.
"""
import argparse,gzip,os,pathlib,re,shutil,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT))
from inline import inline,remote_refs
import changelog
MODEL=ROOT/'marine-chronometer-source/chronometer-working-model'
WEMPE=ROOT/'marine-chronometer-source/wempe'   # the second model (its own build.py writes its dist/)
WE_HAM='href="../../chronometer-working-model/dist/chronometer-working-model.html"'   # the Wempe's built page's link to the Hamilton (its build.py), pointed at the site's home page in site/wempe/
HAM_WE='href="../../wempe/dist/wempe-einheitschronometer.html"'   # the Hamilton's built page's link to the Wempe (its build.py): from the root copy to the Wempe's built page, on the site to /wempe/
SITE=ROOT/'site'
MANUAL='navships-250-624-1948.pdf'   # the page links to it by this name, beside itself
REPORTS=['build-verification','real-chronometers']   # the checks' reports (the model's verification/, each built by its own build_report.py), served at the same paths beside the page
REPO='https://github.com/OrelMag/marine-chronometer-model/blob/main/marine-chronometer-source/chronometer-working-model/'   # where a report's links into the repository (its tools) go on the site

def write(p,text):
    p.write_text(text,encoding='utf-8',newline='\n');print('wrote',p.relative_to(ROOT),f'{len(text.encode())/1024:.0f} KB')

def check(name,html):
    r=remote_refs(html)
    if r:sys.exit(f'{name} still loads {r}: vendor the file and point the page at it')

# no size limit on the pages (removed at the user's word, 15 October 2026; until then a budget per page warned past 2.3 MB and 1.5 MB): sizes() only reports where the bytes go
def sizes(name,html):
    """Print where a page's bytes go (three.js, fonts, images, the rest) and what a visitor downloads (gzip; the site sends Brotli, a little less)."""
    n=len(html.encode());three=(ROOT/'vendor/three.min.js').stat().st_size if 'three.min.js' in html or 'REVISION' in html else 0
    fonts=sum(map(len,re.findall(r'data:font/[^;]+;base64,[A-Za-z0-9+/=]+',html)));imgs=sum(map(len,re.findall(r'data:image/[^;,]+;base64,[A-Za-z0-9+/=]+',html)))
    kb=lambda b:f'{b/1024:.0f} KB'
    print(f'  {name}: {kb(n)} = three.js {kb(three)}, fonts {kb(fonts)}, images {kb(imgs)}, the rest {kb(n-three-fonts-imgs)}; {kb(len(gzip.compress(html.encode(),9)))} compressed')

def address(url,page,keep=False):
    # Cloudflare (Workers and Pages) redirects /page.html to /page, so name the address it ends up at, unless --keep-html
    return url.rstrip('/')+'/'+(page.removesuffix('index.html') if page.endswith('index.html') else page if keep else page.removesuffix('.html'))

def meta(html,url,page,img='social.png',keep=False):
    """Link-preview and canonical tags that need the site's absolute address."""
    if not url:return html
    u=address(url,page,keep)
    tags=(f'<link rel="canonical" href="{u}">\n<meta property="og:url" content="{u}">\n'
          f'<meta property="og:image" content="{url.rstrip("/")}/{img}">\n<meta property="og:image:width" content="1200">\n'
          f'<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n')
    return html.replace('</head>',tags+'</head>',1)

def reports(url,keep):
    """The checks' reports into site/verification/, where they sit beside the model's page in the source (so their links to it and to each other hold),
    each with the images it shows; their links into the repository (its tools) go to GitHub. Returns their pages' paths."""
    out=[]
    for r in REPORTS:
        src=MODEL/'verification'/r;page=f'verification/{r}/index.html';dst=SITE/page;html=(src/'index.html').read_text(encoding='utf-8')
        html=re.sub(r'href="\.\./\.\./(tools/[^"]+)"',lambda m:f'href="{REPO}{m.group(1)}"',html);check(page,html)
        for f in sorted(set(re.findall(r'src="(assets/[^"]+)"',html))):(dst.parent/f).parent.mkdir(parents=True,exist_ok=True);shutil.copy(src/f,dst.parent/f)
        bad=[h for h in re.findall(r'(?:href|src)="(\.[^"#]*)',html) if not (dst.parent/h).resolve().is_relative_to(SITE.resolve())]
        if bad:sys.exit(f'{page} links to {bad} outside site/: point them at the site, or at GitHub (REPO in build.py)')
        dst.parent.mkdir(parents=True,exist_ok=True);write(dst,meta(html,url,page,keep=keep));out.append(page)
    return out

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
    model=(MODEL/'dist/chronometer-working-model.html').read_text(encoding='utf-8');check('working model',model);sizes('working model',model)
    if HAM_WE not in model:sys.exit(f'the working model has no {HAM_WE}: its link to the Wempe (its build.py), which the root copy and the site point at their own places')
    write(ROOT/'chronometer-working-model.html',model.replace(HAM_WE,'href="marine-chronometer-source/wempe/dist/wempe-einheitschronometer.html"'))
    # the Wempe: its own build script writes its dist/ (no root copy)
    subprocess.run([sys.executable,str(WEMPE/'build.py')],check=True)
    wempe=(WEMPE/'dist/wempe-einheitschronometer.html').read_text(encoding='utf-8');check('wempe',wempe);sizes('wempe',wempe)
    if WE_HAM not in wempe:sys.exit(f'the Wempe page has no {WE_HAM}: its link to the Hamilton (wempe/build.py), which the site points at its home page')
    # site/: what a web host serves
    if SITE.exists():shutil.rmtree(SITE)
    SITE.mkdir()
    write(SITE/'index.html',meta(model.replace(HAM_WE,'href="wempe/"'),a.site_url,'index.html',keep=a.keep_html))
    (SITE/'wempe').mkdir();write(SITE/'wempe/index.html',meta(wempe.replace(WE_HAM,'href="../"'),a.site_url,'wempe/index.html',keep=a.keep_html))
    for f in(ROOT/'site-assets').glob('*.png'):shutil.copy(f,SITE/f.name)   # the link-preview image, and the essay's image for posting
    for f in(ROOT/'site-assets').glob('_*'):shutil.copy(f,SITE/f.name)   # host config such as _headers
    shutil.copy(ROOT/'References/navships-250-624-overhaul-manual-1948.pdf',SITE/MANUAL)   # the manual, so the site carries its source (PLAN-self-contained.md, D3)
    pages=['index.html','wempe/index.html']+reports(a.site_url,a.keep_html)
    if a.site_url:   # for search engines: the pages, at the addresses their canonical tags name
        write(SITE/'sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
              ''.join(f'<url><loc>{address(a.site_url,p,a.keep_html)}</loc></url>\n' for p in pages)+'</urlset>\n')
        write(SITE/'robots.txt',f'User-agent: *\nAllow: /\nSitemap: {a.site_url.rstrip("/")}/sitemap.xml\n')
    print('site/ is ready to upload'+('' if a.site_url else ' (no --site-url given: link previews will show no image)'))

if __name__=='__main__':main()
