#!/usr/bin/env python3
"""Build the working model and the website.

    python build.py                                  # rebuild everything
    python build.py --site-url https://example.org   # also set the site's public address (link previews, canonical URL)
    python build.py --site-url https://example.org --keep-html   # for hosts that serve /page.html without redirecting to /page
    python build.py --release patch -m "what changed" [-m ...]   # a release: the next version in CHANGELOG.md (patch, minor or major), then the build

Writes:
  marine-chronometer-source/chronometer-working-model/dist/chronometer-working-model.html
  marine-chronometer-source/wempe/dist/wempe-einheitschronometer.html   (the second model, the Wempe Einheits-Chronometer; no root copy)
  marine-chronometer-source/essay/dist/the-marine-chronometer.html      (the essay shared by both models, its figures the Wempe's; no root copy)
  chronometer-working-model.html      (the root copy, for opening straight from the repo)
  site/                               (the folder to upload to a web host; the addresses swapped on 21 October 2026: until then the Hamilton was the home page, the Wempe /wempe/)
     index.html            the Wempe Einheits-Chronometer, the site's home page: its links to the Hamilton pointed at hamilton/, to the essay at essay/, to its report at
                           wempe/verification/; its own essay is its Its drawings tab (#drawings), and a script on it sends old links to the Hamilton (by their hash) on to hamilton/ or essay/
     hamilton/index.html   the Hamilton Model 21 working model (/hamilton/), its Essay tab a link to essay/ and #essay[=section] sent there (app.js)
     essay/index.html      the essay 'The Marine Chronometer', shared by both models, on a page of its own (/essay/#section; marine-chronometer-source/essay/): its figures
                           drawn from the Wempe's model, its links to the models pointed at / and hamilton/
     social.png            link-preview image of the Hamilton's page (the dial in its box)
     social-movement.png   an image of the mechanism titled for the essay, for posting; the essay's page's link preview
     social-wempe.png      link-preview image of the Wempe's page, the home page (its dial in its box)
     navships-250-624-1948.pdf   the manual itself (References/, Google Books' scan of the 1948 Navy manual), which the Hamilton's page and the essay link to
     verification/build-verification/   the checks' report "Would a chronometer made to the model run and keep time?" (its build_report.py, committed)
     verification/real-chronometers/    the report "Does the model behave like a real Hamilton Model 21?", with its plots
     wempe/verification/                the Wempe's report "The Wempe Einheits-Chronometer: does the model hold to its drawings, and would it keep time?" (wempe/verification/build_report.py)
     sitemap.xml, robots.txt   for search engines (with --site-url only)
  The reports and the manual keep their addresses, their links to the pages pointed at the pages' new places; worker.js redirects /wempe/ to the home page (/?from=wempe)
  and the essay's old address to /essay/.
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
WE_HAM='href="../../chronometer-working-model/dist/chronometer-working-model.html'   # the Wempe's built page's links to the Hamilton (its build.py), pointed at hamilton/ on the site: a prefix, so a link keeps its hash (one into the Hamilton's essay, …html#essay=detent, goes to essay/#detent)
HAM_WE='href="../../wempe/dist/wempe-einheitschronometer.html"'   # the Hamilton's built page's link to the Wempe (its build.py): from the root copy to the Wempe's built page, on the site to the home page
HAM_SITE=[('href="navships-250-624-1948.pdf"','href="../navships-250-624-1948.pdf"'),('href="verification/','href="../verification/')]   # the Hamilton's page's links beside itself (the manual, its reports), from hamilton/ to the site's root, where they stay
ESSAY=ROOT/'marine-chronometer-source/essay'   # the essay shared by both models (its own build.py writes its dist/)
TO_ESSAY='href="../../essay/dist/the-marine-chronometer.html'   # the models' built pages' links to the essay (their build.py): a prefix, so a link to a section (…html#detent) keeps it
ES_SITE=[('href="../../chronometer-working-model/dist/chronometer-working-model.html','href="../hamilton/'),('href="../../wempe/dist/wempe-einheitschronometer.html','href="../'),
         ('href="../../chronometer-working-model/verification/','href="../verification/'),('href="navships-250-624-1948.pdf"','href="../navships-250-624-1948.pdf"')]   # the essay's built page's links (essay/build.py), on the site
SITE=ROOT/'site'
MANUAL='navships-250-624-1948.pdf'   # the page links to it by this name, beside itself
REPORTS=['build-verification','real-chronometers']   # the checks' reports (the model's verification/, each built by its own build_report.py), served at the same paths beside the page
REPO='https://github.com/OrelMag/marine-chronometer-model/blob/main/marine-chronometer-source/chronometer-working-model/'   # where a report's links into the repository (its tools) go on the site
GITHUB='https://github.com/OrelMag/marine-chronometer-model/blob/main/'   # the repository's root on GitHub, for the Wempe's report's links into it
WE_REP='href="../verification/'   # the Wempe's built page's links to its report (wempe/build.py, from dist/), pointed at site/wempe/verification/ on the site

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
        html=re.sub(r'href="\.\./\.\./(tools/[^"]+)"',lambda m:f'href="{REPO}{m.group(1)}"',html).replace('href="../../index.html','href="../../hamilton/');check(page,html)   # the model's page: hamilton/ on the site
        for f in sorted(subpages(src,html,f'verification/{r}',set(re.findall(r'src="(assets/[^"]+)"',html)))):(dst.parent/f).parent.mkdir(parents=True,exist_ok=True);shutil.copy(src/f,dst.parent/f)
        bad=[h for h in re.findall(r'(?:href|src)="(\.[^"#]*)',html) if not (dst.parent/h).resolve().is_relative_to(SITE.resolve())]
        if bad:sys.exit(f'{page} links to {bad} outside site/: point them at the site, or at GitHub (REPO in build.py)')
        dst.parent.mkdir(parents=True,exist_ok=True);write(dst,meta(html,url,page,keep=keep));out.append(page)
    return out

def subpages(src,html,name,got):
    """A report's pages of their own in assets/ (the Wempe's transmission viewer, the 3D viewers of the moving parts) added to got, the files it copies, with what each loads
    beside it; a page in a folder of its own under assets/ brings the whole folder (the 3D viewers fetch their data). Each checked as the pages are: nothing from the network."""
    for f in set(re.findall(r'href="(assets/[^"#]+\.html)"',html)):
        sub=(src/f).read_text(encoding='utf-8');check(f'{name}/{f}',sub);got.add(f);d=pathlib.PurePosixPath(f).parent
        got|={(d/s).as_posix() for s in re.findall(r'src="([^":#]+)"',sub)}
        if (src/f).parent!=src/'assets':got|={(d/x.name).as_posix() for x in (src/f).parent.iterdir() if x.is_file()}
    return got

def wempe_report(url,keep):
    """The Wempe's report (wempe/verification/, its build_report.py) into site/wempe/verification/, beside the Wempe's page as in the source, with the images it shows. Its links
    to the Wempe's page, the Hamilton's page and the Hamilton's reports go to their places on the site; every other link into the repository (the tools, a README) to GitHub.
    Returns its page's path."""
    src=WEMPE/'verification';page='wempe/verification/index.html';dst=SITE/page;html=(src/'index.html').read_text(encoding='utf-8')
    site={WEMPE/'index.html':'../../',MODEL/'index.html':'../../hamilton/',**{MODEL/'verification'/r/'index.html':f'../../verification/{r}/index.html' for r in REPORTS}}
    def link(m):
        h=m.group(2)
        if re.match(r'[a-z]+:|#',h):return m.group(0)
        f,_,frag=h.partition('#');p=(src/f).resolve()
        if p.is_relative_to(src.resolve()/'assets'):return m.group(0)
        to=site.get(p) or GITHUB+p.relative_to(ROOT).as_posix()
        return f'{m.group(1)}="{to}{"#"+frag if frag else ""}"'
    html=re.sub(r'(href|src)="([^"]+)"',link,html);check(page,html)
    got=subpages(src,html,'wempe/verification',set(re.findall(r'src="(assets/[^"]+)"',html)))
    for f in sorted(got):(dst.parent/f).parent.mkdir(parents=True,exist_ok=True);shutil.copy(src/f,dst.parent/f)
    dst.parent.mkdir(parents=True,exist_ok=True);write(dst,meta(html,url,page,keep=keep));return page

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
    if TO_ESSAY not in model:sys.exit(f'the working model has no {TO_ESSAY}: its Essay tab (its build.py)')
    write(ROOT/'chronometer-working-model.html',model.replace(HAM_WE,'href="marine-chronometer-source/wempe/dist/wempe-einheitschronometer.html"').replace(TO_ESSAY,'href="marine-chronometer-source/essay/dist/the-marine-chronometer.html'))
    # the Wempe: its own build script writes its dist/ (no root copy)
    subprocess.run([sys.executable,str(WEMPE/'build.py')],check=True)
    wempe=(WEMPE/'dist/wempe-einheitschronometer.html').read_text(encoding='utf-8');check('wempe',wempe);sizes('wempe',wempe)
    if WE_HAM not in wempe:sys.exit(f'the Wempe page has no {WE_HAM}: its link to the Hamilton (wempe/build.py), which the site points at hamilton/')
    if TO_ESSAY not in wempe:sys.exit(f'the Wempe page has no {TO_ESSAY}: its Essay tab (wempe/build.py)')
    # the essay: its own build script writes its dist/ (no root copy)
    subprocess.run([sys.executable,str(ESSAY/'build.py')],check=True)
    essay=(ESSAY/'dist/the-marine-chronometer.html').read_text(encoding='utf-8');check('essay',essay);sizes('essay',essay)
    # site/: what a web host serves
    if SITE.exists():shutil.rmtree(SITE)
    SITE.mkdir()
    # the Hamilton at hamilton/
    for k,_ in HAM_SITE:
        if k not in model:sys.exit(f'the working model has no {k}: its link beside itself, which the site points at its root')
    ham=model.replace(HAM_WE,'href="../"').replace(TO_ESSAY,'href="../essay/')
    for k,v in HAM_SITE:ham=ham.replace(k,v)
    (SITE/'hamilton').mkdir();write(SITE/'hamilton/index.html',meta(ham,a.site_url,'hamilton/index.html',keep=a.keep_html))
    # the essay at essay/
    for k,v in ES_SITE:
        if k not in essay:sys.exit(f'the essay has no {k}: its link, which the site points at its place')
        essay=essay.replace(k,v)
    (SITE/'essay').mkdir();write(SITE/'essay/index.html',meta(essay,a.site_url,'essay/index.html',img='social-movement.png',keep=a.keep_html))
    # the Wempe, the home page
    if WE_REP not in wempe:sys.exit(f'the Wempe page has no {WE_REP}: its link to its report (wempe/build.py), which the site points at site/wempe/verification/')
    write(SITE/'index.html',meta(wempe.replace(TO_ESSAY,'href="essay/').replace(WE_HAM,'href="hamilton/').replace(WE_REP,'href="wempe/verification/'),a.site_url,'index.html',img='social-wempe.png',keep=a.keep_html))
    for f in(ROOT/'site-assets').glob('*.png'):shutil.copy(f,SITE/f.name)   # the link-preview image, and the essay's image for posting
    for f in(ROOT/'site-assets').glob('_*'):shutil.copy(f,SITE/f.name)   # host config such as _headers
    shutil.copy(ROOT/'References/navships-250-624-overhaul-manual-1948.pdf',SITE/MANUAL)   # the manual, so the site carries its source (PLAN-self-contained.md, D3)
    pages=['index.html','hamilton/index.html','essay/index.html']+reports(a.site_url,a.keep_html)+[wempe_report(a.site_url,a.keep_html)]
    if a.site_url:   # for search engines: the pages, at the addresses their canonical tags name
        write(SITE/'sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
              ''.join(f'<url><loc>{address(a.site_url,p,a.keep_html)}</loc></url>\n' for p in pages)+'</urlset>\n')
        write(SITE/'robots.txt',f'User-agent: *\nAllow: /\nSitemap: {a.site_url.rstrip("/")}/sitemap.xml\n')
    print('site/ is ready to upload'+('' if a.site_url else ' (no --site-url given: link previews will show no image)'))

if __name__=='__main__':main()
