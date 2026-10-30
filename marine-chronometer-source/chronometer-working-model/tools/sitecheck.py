"""The built site as visitors meet it: site/ served through worker.js (siteserve.mjs: the Worker's redirects, and the static files as wrangler.jsonc's assets serve them) on a
free port, every address, old and new, asked for and followed (since 21 October 2026 the Wempe is the home page, the Hamilton /hamilton/ and the essay /essay/; every old
address must still lead to the same thing), and the pages opened in Chromium (tools/browser.py; MC_GL=gpu for the GPU) for page errors, console errors and warnings.

    python sitecheck.py      # exit 1 on any failure (about 1½ minutes; build the site first: python build.py --site-url ... at the root)

Checks: each address's status and where it redirects (the worker's 301s, the assets' 307s to a trailing slash); in the browser, where an address ends up with its hash (a
fragment never reaches the server: the Wempe's page sends the Hamilton's old links on, js/app.js's away and its index.html's script), the essay's page's links to the models,
the Hamilton's Essay tab, and the reports' links back to the pages."""
import asyncio,pathlib,socket,subprocess,sys,time,urllib.request,urllib.error
HERE=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import browser
from playwright.async_api import async_playwright
SITE=HERE.parents[2]/'site'
def free():
    s=socket.socket();s.bind(('127.0.0.1',0));p=s.getsockname()[1];s.close();return p
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*a,**k):return None
OPEN=urllib.request.build_opener(NoRedirect)
def ask(base,p):
    try:r=OPEN.open(base+p,timeout=30);return r.status,None
    except urllib.error.HTTPError as e:return e.code,e.headers.get('Location')
# address -> (status, where it redirects: the path and query after the host, or None)
HTTP=[('/',200,None),('/hamilton/',200,None),('/essay/',200,None),('/hamilton',307,'/hamilton/'),('/essay',307,'/essay/'),('/index.html',307,'/'),
      ('/wempe/',301,'/?from=wempe'),('/wempe',301,'/?from=wempe'),('/wempe/index.html',301,'/?from=wempe'),('/wempe/index.html?snap',301,'/?snap&from=wempe'),
      ('/wempe/verification/',200,None),('/verification/build-verification/',200,None),('/verification/real-chronometers/',200,None),
      ('/marine-chronometer',301,'/essay/'),('/marine-chronometer.html',301,'/essay/'),('/marine-chronometer/',301,'/essay/'),
      ('/navships-250-624-1948.pdf',200,None),('/social.png',200,None),('/social-wempe.png',200,None),('/social-movement.png',200,None),('/sitemap.xml',200,None),('/robots.txt',200,None)]
# in the browser: address -> where it ends up (path and hash), the page that loads there
NAV=[('/','/',''),('/hamilton/','/hamilton/',''),('/essay/','/essay/',''),('/essay/#detent','/essay/','#detent'),
     ('/#essay','/essay/',''),('/#essay=detent','/essay/','#detent'),('/#part=det&view=escapement','/hamilton/','#part=det&view=escapement'),('/#ovh=r46','/hamilton/','#ovh=r46'),
     ('/hamilton/#essay=gimbals','/essay/','#gimbals'),('/wempe/#essay=detent','/','#drawings=detent'),('/wempe/#view=train','/','#view=train'),('/wempe/','/',''),
     ('/marine-chronometer','/essay/',''),('/marine-chronometer#detent','/essay/','#detent')]

async def browse(base,errs):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        async def page(tag):
            pg=await b.new_page(viewport={'width':1100,'height':800})
            pg.on('pageerror',lambda e:errs.append(f'{tag}: page error: {e}'))
            pg.on('console',lambda m:errs.append(f'{tag}: console {m.type}: {m.text}') if m.type in('error','warning') and not any(n in m.text for n in('GL Driver Message','GPU stall')) else None)
            return pg
        for a,path,hsh in NAV:
            pg=await page(a);await pg.goto(base+a);await pg.wait_for_timeout(4000)
            for _ in range(20):   # a page that sends an old link on (the Hamilton's #essay=…) may still be navigating: read again once it has loaded
                try:u=await pg.evaluate("[location.pathname,location.search,location.hash]");break
                except Exception as e:
                    if 'context was destroyed' not in str(e):raise
                    await pg.wait_for_load_state();await pg.wait_for_timeout(1000)
            kv=lambda h:set(h.lstrip('#').split('&'))-{''}   # the hash's settings: the page may add its own (the Hamilton's overhaul adds block=1) and order them its way
            if u[0]!=path or u[1] or not kv(hsh)<=kv(u[2]) or (not hsh and u[2]):errs.append(f'{a} ended at {u[0]}{u[1]}{u[2]}, not {path}{hsh}')
            else:print(f'  ok  {a} -> {path}{hsh}')
            await pg.close()
        # the Hamilton's Essay tab; the essay's links to both models; the reports' links back
        pg=await page('the Hamilton\'s Essay tab');await pg.goto(base+'/hamilton/');await pg.wait_for_function("!document.querySelector('#loading')",timeout=90000)
        await pg.click('#tabEssay');await pg.wait_for_timeout(3000)
        if await pg.evaluate("location.pathname")!='/essay/':errs.append('the Hamilton\'s Essay tab went to '+await pg.evaluate("location.href"))
        else:print('  ok  the Hamilton\'s Essay tab -> /essay/')
        hs=await pg.evaluate("[...document.querySelectorAll('#essay a')].map(a=>a.href)")
        for want in['/hamilton/#tour=3','/#view=train','/navships-250-624-1948.pdf','/verification/build-verification/index.html']:
            if not any(h==base+want for h in hs):errs.append(f'the essay has no link to {want}')
        await pg.close()
        for a,sel,want in[('/verification/build-verification/',"a[href='../../hamilton/']",'/hamilton/'),('/wempe/verification/',"a[href='../../']",'/')]:
            pg=await page(a);await pg.goto(base+a);await pg.wait_for_timeout(1000)
            h=await pg.evaluate(f"(document.querySelector(\"{sel}\")||{{}}).href||''")
            if h!=base+want:errs.append(f'{a}: its link to the model is {h!r}, not {want}')
            else:print(f'  ok  {a} links to {want}')
            await pg.close()
        await b.close()

def main():
    if not (SITE/'index.html').exists():sys.exit('no site/: python build.py --site-url ... at the root first')
    port=free();base=f'http://localhost:{port}'
    sv=subprocess.Popen(['node',str(HERE/'siteserve.mjs'),str(port)],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
    try:
        t0=time.time()
        while time.time()-t0<20:
            try:ask(base,'/robots.txt');break
            except Exception:time.sleep(0.3)
        errs=[]
        for p,st,loc in HTTP:
            s,l=ask(base,p);l=l and l.replace(base,'')
            if s!=st or (loc is not None and l!=loc):errs.append(f'{p}: {s} {l or ""}, not {st} {loc or ""}')
            else:print(f'  ok  {p}: {s}{" -> "+l if l else ""}')
        asyncio.run(browse(base,errs))
    finally:sv.terminate()
    for e in errs:print('  !!  '+e)
    print(f'{len(errs)} failures' if errs else 'ok');sys.exit(1 if errs else 0)
main()
