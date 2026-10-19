"""The 3D viewer of the moving parts, opened and photographed (PLAN-motion-3d.md; docs/motion-3d/). Playwright; no Node.

    python motion3d_shots.py --model wempe [--dir DIR] [--out DIR] [--check]    # about a minute (the viewer's data load, then each still)

Serves DIR (default the viewer beside the model's report: wempe/verification/assets/motion3d/, verification/build-verification/assets/motion3d/ for the Hamilton;
or a private pack, r_motion3d/<model>/pack/) on a free local port, opens it in Chromium on the GPU (MC_GL=gpu) and checks that it loads: its data read (the status line
hidden), its parts table filled, no page error or console error, nothing fetched from anywhere but DIR (the site's pages load nothing from the network). Then, unless
--check, renders the stills through the viewer's own hooks (window.__m3: ver, run, mode, frame, only, peak, look, pick), each a run at its peak moment seen from a fixed
camera, into OUT (default r_motion3d/<model>/shots/): the whole movement, the let-go blow on the maintaining work (or the Hamilton's winding work), the train, the
mainspring at the stop, a beat by speed, the parts table and the findings (each version's for the Wempe). Exits 1 if the viewer doesn't load clean."""
import functools,http.server,json,os,pathlib,socket,sys,threading
os.environ.setdefault('MC_GL','gpu')
from playwright.sync_api import sync_playwright
import browser,model
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
M=model.NAME
SITE={'wempe':HERE.parents[1]/'wempe'/'verification'/'assets'/'motion3d','hamilton':HERE.parent/'verification'/'build-verification'/'assets'/'motion3d'}[M]
DIR=pathlib.Path(arg('--dir',str(SITE))).resolve();OUT=pathlib.Path(arg('--out',str(HERE/'r_motion3d'/M/'shots')));CHECK='--check' in sys.argv
# the stills: name, version, run (0 a beat, 1 the key let go outright, 2 eased, 3 the stop), mode (mat: material; mpa: stress; use: against its limit; speed), the channel
# whose peak sets the moment, the camera (its place, what it looks at; mm in the movement's frame, dial side +y), the parts shown (None: all), the part picked
if M=='wempe':
    F=[-16.71,-6.5,-15.29];TR=['fuseeWheel','centreWheel','intermediateWheel','secondsWheel','escapeWheel']
    SHOTS=[('1_whole_letgo','last',1,'mat','click1',([80,-165,130],[2,-14,2]),None,'maintaining.ratchet'),
           ('2_letgo_drawn_maintaining','last',1,'mpa','click1',([F[0]+22,10,F[2]+30],F),['maintaining','maintDetent','fusee'],'maintaining.ratchet'),
           ('3_letgo_build_maintaining','build',1,'mpa','click2',([F[0]+22,10,F[2]+30],F),['maintaining','maintDetent','fusee'],'maintaining.clicks'),
           ('4_beat_drawn_speed','last',0,'speed','mesh:seconds wheel → escape pinion',([12,-70,60],[-5,-14,14]),TR+['balance','rollers','hairspring','detent'],'escapeWheel'),
           ('5_mainspring_build','build',3,'mpa','stop',([54.8,-40,22],[24.8,-12,-6]),['mainspring','barrelArbor','setupRatchet'],'mainspring'),
           ('6_letgo_drawn_train','last',1,'mpa','mesh:fusee wheel → centre pinion',([30,8,48],[0,-10,8]),TR,'fuseeWheel'),
           ('7_letgo_drawn_limit','last',1,'use','click1',([80,-165,130],[2,-14,2]),None,'maintaining.ratchet')]
    VERS=['last','build']
else:
    F=[14.31,-12,-14.52];TR=['gw','cw','tw','fw','escW']
    SHOTS=[('1_whole_letgo','last',1,'mat','click1',([60,-125,95],[2,-14,2]),None,'gw'),
           ('2_letgo_winding','last',1,'mpa','click1',([F[0]+20,12,F[2]+28],F),['fusee','sratchet','spawl','gw','sq'],'sratchet.pawls'),
           ('3_letgo_train','last',1,'mpa','mesh:fusee wheel → centre pinion',([18,10,50],[2,-12,4]),TR,'gw'),
           ('4_mainspring_stop','last',3,'mpa','stop',([5.86,-40,20.65],[-22.14,-14,-5.35]),['mainspring','ratchet'],'mainspring'),
           ('5_beat_speed','last',0,'speed','mesh:fourth wheel → escape pinion',([15,-70,60],[3,-14,12]),TR+['bal','spr','det'],'escW'),
           ('6_letgo_limit','last',1,'use','click1',([60,-125,95],[2,-14,2]),None,'gw')]
    VERS=['last']

def serve(d):
    s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close()
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(s,*a):pass   # quiet: the check prints what it finds
    H=functools.partial(Q,directory=str(d))
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',port),H);threading.Thread(target=srv.serve_forever,daemon=True).start();return srv,port

def main():
    if not (DIR/'index.html').exists():sys.exit(f'{DIR} has no index.html: motion3d_pack.py --model {M} [--site DIR] writes it')
    srv,port=serve(DIR);base=f'http://127.0.0.1:{port}';errs=[];off=[]
    try:
        with sync_playwright() as pw:
            b=pw.chromium.launch(args=browser.ARGS);pg=b.new_page(viewport={'width':1400,'height':1050})
            pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
            pg.on('request',lambda r:off.append(r.url) if not r.url.startswith(base) and not r.url.startswith('data:') and not r.url.startswith('blob:') else None)
            pg.goto(base+'/index.html');pg.wait_for_function("document.getElementById('status').hidden||/didn/.test(document.getElementById('status').textContent)",timeout=120000)
            st=pg.evaluate("document.getElementById('status').hidden?'':document.getElementById('status').textContent");rows=pg.evaluate("document.querySelectorAll('#parts tbody tr').length")
            ok=not st and rows>0 and not errs and (DIR!=SITE or not off)
            print(f'{M}: {DIR}: {"loads" if not st else st}; {rows} parts in its table; errors {errs[:3] or "none"}; fetched off it {off[:3] or "nothing"}')
            if ok and not CHECK:
                OUT.mkdir(parents=True,exist_ok=True)
                for name,ver,run,mode,ch,cam,only,pick in SHOTS:
                    pg.evaluate(f"__m3.ver('{ver}')");pg.evaluate(f"__m3.run({run})");pg.evaluate(f"__m3.mode('{mode}')");pg.evaluate("__m3.frame(false)");pg.evaluate(f"__m3.only({json.dumps(only)})")
                    t=pg.evaluate(f"__m3.peak({json.dumps(ch)})");pg.evaluate(f"__m3.pick('{pick}')");pg.evaluate(f"__m3.look({cam[0]},{cam[1]})");pg.wait_for_timeout(700)
                    pg.locator('.bench').screenshot(path=str(OUT/f'{name}.png'));print(f'  {name}.png: run {run} at {t:.4f} s')
                pg.evaluate("__m3.only(null)")
                for v in VERS:
                    pg.evaluate(f"__m3.ver('{v}')");pg.wait_for_timeout(400);sfx='' if len(VERS)==1 else f'_{v}'
                    pg.locator('#parts').screenshot(path=str(OUT/f'parts{sfx}.png'));pg.locator('#findings').screenshot(path=str(OUT/f'findings{sfx}.png'));print(f'  parts{sfx}.png, findings{sfx}.png')
                ok=ok and not errs
            b.close()
    finally:srv.shutdown()
    sys.exit(0 if ok else 1)

if __name__=='__main__':main()
