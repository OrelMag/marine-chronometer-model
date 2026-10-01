"""Checks of the model's arithmetic against what a chronometer must do and the manual's figures (exit code 1 on any failure).

    python invariants.py

- Hands: with the escape wheel at E = 2t teeth (t seconds), the second, minute and hour hands and the escape wheel point where a clock reading t
  would put them: 1 turn a minute, an hour, 12 hours, and 16 teeth in 8 s. A wrong tooth count anywhere in the train fails this.
- Wind indicator: at UP (fully wound) and after 56 h, the hand is at the ends of the dial's scale, 313.6° apart and centred on the 6 (UD_SWEEP),
  within 1% of the 315.7° a photographed Model 21 dial's ticks give.
- Fusee: 8¾ turns of chain is 17½ half turns of the key (manual Sec. III) and 56¼ h of running, the manual's "maximum of 56 hours" (Sec. III).
- Balance: the moment of inertia as built (1,140 g·mm², the manual's Table II, from the parts list's masses and the balance as drawn), and a full turn of the timing weights and of the vernier weights
  changing the rate by the manual's 40 s and 2.8 s a day (p. 70).
The movement's update() is driven directly, as views.py does; the page's own loop is stopped first."""
import asyncio,json,math,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS="""(()=>{const mv=window.__mv,R=mv.userData.R,TAU=Math.PI*2,D=Math.PI/180;
  if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const u=(E,n,w)=>mv.userData._u({E,th:0,lift:0,psDef:0,n,winding:w,springOn:false,msOn:false});
  const wrap=a=>{a=((a%TAU)+TAU)%TAU;return a>Math.PI?a-TAU:a;},out=[],chk=(name,got,want,tol,unit)=>out.push({name,got,want,tol,unit,ok:Math.abs(got-want)<=tol});
  u(0,0,true);u(0,3,false);
  for(const t of[37.5,754.5,5230,40001.5]){u(2*t,3,false);const esc0=-ESC.t0;
    chk(`second hand at t=${t} s (1 turn/min)`,wrap(R.sec.rotation.y+TAU*t/60)/D,0,1e-6,'deg off');
    chk(`minute hand at t=${t} s (1 turn/h)`,wrap(R.min.rotation.y+TAU*t/3600)/D,0,1e-6,'deg off');
    chk(`hour hand at t=${t} s (1 turn/12 h)`,wrap(R.hour.rotation.y+TAU*t/43200)/D,0,1e-6,'deg off');
    chk(`escape wheel at t=${t} s (16 teeth/8 s)`,wrap(R.esc.rotation.y-esc0-TAU*t/8)/D,0,1e-6,'deg off');}
  /* wind indicator: the hand's angle from 12, clockwise seen from the dial; the fusee's ratchet can sit up to a tooth (9 deg) past n turns, 0.9 deg of the hand. After 56 h the
     train has run with the fusee (7200 escape teeth an hour, as maintaining.py drives it), so the ratchet sits where it sat at UP; the fusee turned alone, as a jump with the train
     held would, the ratchet's seat lands anywhere in a tooth from where it was */
  const ud=()=>(-R.ud.rotation.y)/D;
  u(0,0,true);u(0,0,false);chk('wind indicator at UP (fully wound)',ud(),UD_UP,0.95,'deg');
  u(56*7200,56*FUSEE_PER_HOUR,false);u(56*7200,56*FUSEE_PER_HOUR,false);chk('wind indicator after 56 h (DOWN end of the scale)',ud(),UD_UP+UD_SWEEP,0.95,'deg');chk('wind indicator sweep against the photographed dial',UD_SWEEP,315.7,3.2,'deg');
  chk('fusee: 8 3/4 turns of chain run (manual: 56 h at most)',FUSEE_TURNS/FUSEE_PER_HOUR,56,0.5,'h');chk('fusee: half turns of the key to wind fully',FUSEE_TURNS*2,17.5,1e-9,'');
  chk('fusee: 7 half turns restore (manual: 24 h)',7*0.5/FUSEE_PER_HOUR,24,1.6,'h');
  const I0=R.timing(0,0),rate=(t,v)=>86400*(Math.sqrt(I0/R.timing(t,v))-1);
  chk('balance moment of inertia as built (Table II)',I0,1140.0,1,'g mm2');
  chk('timing weights, a full turn out (manual: 40 s/day)',-rate(1,0),40,2,'s/day');chk('vernier weights, a full turn out (manual: 2.8 s/day)',-rate(0,1),2.8,0.15,'s/day');
  R.timing(0,0);return out;})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("window.__mv",timeout=60000);await pg.wait_for_timeout(1000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        out=await pg.evaluate(JS);await b.close()
    bad=[r for r in out if not r['ok']]
    for r in out:print(f"{'ok' if r['ok'] else '!!':3s} {r['name']:58s} {r['got']:12.6g}  want {r['want']:g} ± {r['tol']:g} {r['unit']}")
    for e in errs:print('page error:',e)
    print('ok' if not bad and not errs else f'{len(bad)} failures');sys.exit(1 if bad or errs else 0)
asyncio.run(main())
