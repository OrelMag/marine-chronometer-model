"""The Hamilton Model 21's figures the shared essay quotes (its spans data-ham="…"), worked out on the Hamilton's own page, into the essay's js/hamdata.js (HAMDATA).

    python essay_hamdata.py           # exits 1 if js/hamdata.js isn't what the Hamilton's page gives now (about 20 s)
    python essay_hamdata.py --write   # rewrites it

The essay has a page of its own since 21 October 2026 (marine-chronometer-source/essay/), its figures drawn from the Wempe's model (its scripts load there; the Hamilton's
movement.js can't load beside them: both declare ESC). Its text still quotes the Model 21 where it speaks of it: the escapement's figures against the manual's, its train,
its balance and hairspring as designed. Those come from the Hamilton's page here, by the same expressions its Essay tab's fillLive used until then (ESC.measure, TRAIN,
ESC_PER, RUN_H, R.timing, R.hsDesign, ESC.ampAt and rateAt), so they follow the model as before: run it after changing the Hamilton's escapement, train, balance or hairspring
(ci.py runs it). BAL_R: the balance's radius, for the essay's drawing of the Model 21's balance (Heat)."""
import asyncio,json,pathlib,sys
HERE=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import browser
from playwright.async_api import async_playwright
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
OUT=HERE.parents[1]/'essay'/'js'/'hamdata.js'
JS="""(()=>{const m=ESC.measure(),T=TRAIN,f1=(v,n=1)=>v.toFixed(n),R=__mv.userData.R,I0=R.timing(0,0),d=R.hsDesign;
  const sAt=a=>{let lo=0.05,hi=4;for(let k=0;k<50;k++){const q=(lo+hi)/2;ESC.ampAt(q)<a?lo=q:hi=q;}return(lo+hi)/2;},r=A=>{const a=A*D2R;return Math.abs(ESC.rateAt(a,sAt(a))).toFixed(2);};
  const V={lock:f1(m.lock)+'°',letoff:f1(m.letoff)+'°',drop:f1(m.drop)+'°',overall:f1(m.overall)+'°',shake:f1(m.shake,3)+' mm',horn:f1(m.hornClr,2)+' mm',D:f1(m.D,2)+' mm',
    roller:f1(2*ESC.rRoll*ESC.ES,1)+' mm',A:Math.round(ESC.A/D2R)+'°',AMIN:Math.round(ESC.AMIN/D2R)+'°',motion:f1(2*ESC.A/TAU,2),ew:T.ew,fu:T.fu,cp:T.cp,cw:T.cw,tw:T.tw,fw:T.fw,tp:T.tp,fp:T.fp,ep:T.ep,
    gwT:(T.ew/2*ESC_PER.gw/3600).toFixed(2)+' hours',halfT:(0.5/FUSEE_PER_HOUR).toFixed(2),run:Math.round(RUN_H),I0:Math.round(I0/10)*10,
    hsB:f1(d.b,2)+' mm',hsT:f1(d.t,3)+' mm',hsL:Math.round(d.L)+' mm',hsOut:f1(d.outer.l,1)+' mm',hsIn:f1(d.inner.l,1)+' mm',hsInR:f1(d.rIn,1)+' mm',hsLat:d.lat.toExponential(1),isoLo:r(247.5),isoHi:r(270)};
  V.kappa=f1(V.I0*1e-9*(4*Math.PI)**2*1e6,0);   /* κ = I (2π/T)², T = 0.5 s, in µN·m per radian */
  return{V,BAL_R};})()"""

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS);pg=await b.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=90000)
        d=await pg.evaluate(JS);await b.close()
    if errs:sys.exit('the Hamilton page: '+'; '.join(errs))
    text=('/* hamdata.js: the Hamilton Model 21\'s figures the essay quotes (its spans data-ham="…"), worked out on the Hamilton\'s page by\n'
          '   ../../chronometer-working-model/tools/essay_hamdata.py --write: don\'t edit. Declares only HAMDATA */\n'
          'const HAMDATA='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')
    old=OUT.read_text(encoding='utf-8') if OUT.exists() else ''
    if '--write' in sys.argv:
        OUT.write_text(text,encoding='utf-8',newline='\n');print('wrote',OUT.relative_to(HERE.parents[2]))
    elif old!=text:sys.exit(f'{OUT.name} is stale: python essay_hamdata.py --write\n  now: {json.dumps(d,ensure_ascii=False)}')
    else:print(f'{OUT.name} up to date: {len(d["V"])} figures')

asyncio.run(main())
