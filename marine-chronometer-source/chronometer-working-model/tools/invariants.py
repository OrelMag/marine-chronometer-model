"""Checks of the model's arithmetic against what a chronometer must do and the manual's figures (exit code 1 on any failure).

    python invariants.py

- Hands: with the escape wheel at E = 2t teeth (t seconds), the second, minute and hour hands and the escape wheel point where a clock reading t
  would put them: 1 turn a minute, an hour, 12 hours, and 16 teeth in 8 s. A wrong tooth count anywhere in the train fails this.
- Wind indicator: at UP (fully wound) and after 56 h, the hand is at the ends of the dial's scale, 313.6° apart and centred on the 6 (UD_SWEEP),
  within 1% of the 315.7° a photographed Model 21 dial's ticks give.
- Fusee: 8¾ turns of chain is 17½ half turns of the key (manual Sec. III) and 56¼ h of running, the manual's "maximum of 56 hours" (Sec. III).
- Balance: the moment of inertia as built (578 g·mm², the manual's Table II fitted with the parts list's masses read as a pair's), the drawing within 10% of it (I_REST), and a full turn of the timing weights and of the vernier weights
  changing the rate by the manual's 40 s and 2.8 s a day (p. 70); Table IV (p. 74) rebuilt from its fitted seven-to-n figures; a pair of screws moved along the rim
  leaving the moment of inertia as it was.
- Escapement: the running amplitude 255° and the escapement's rate 0 s a day at the model's settings exactly, and Airy's signs for the impulse jewel's angle and the depth of lock.
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
    chk(`escape wheel at t=${t} s (16 teeth/8 s)`,wrap(R.esc.rotation.y-esc0-TAU*t/8)/D,0,1e-6,'deg off');
    chk(`cannon pinion's square with the minute hand at t=${t} s`,wrap(R.cannon.rotation.y-R.min.rotation.y)/D,0,1e-9,'deg off');chk(`hour wheel's pipe with the hour hand at t=${t} s`,wrap(R.hourW.rotation.y-R.hour.rotation.y)/D,0,1e-9,'deg off');}
  /* setting the hands: 10 minutes on the key (the cannon pinion slips on the centre arbor) turns the minute hand 60 deg and the hour hand 5, the second hand not at all */
  u(1509,3,false);const m0=R.min.rotation.y,h0=R.hour.rotation.y,s0=R.sec.rotation.y;mv.userData._u({E:1509,th:0,lift:0,psDef:0,n:3,winding:false,slip:600,springOn:false,msOn:false});
  chk('setting 10 min: minute hand',wrap(m0-R.min.rotation.y)/D,60,1e-6,'deg');chk('setting 10 min: hour hand',wrap(h0-R.hour.rotation.y)/D,5,1e-6,'deg');chk('setting 10 min: second hand untouched',wrap(R.sec.rotation.y-s0)/D,0,1e-9,'deg');
  chk('setting 10 min: square with the minute hand',wrap(R.cannon.rotation.y-R.min.rotation.y)/D,0,1e-9,'deg off');chk('setting 10 min: hour pipe with the hour hand',wrap(R.hourW.rotation.y-R.hour.rotation.y)/D,0,1e-9,'deg off');
  /* wind indicator: the hand's angle from 12, clockwise seen from the dial; the fusee's ratchet can sit up to a tooth (9 deg) past n turns, 0.9 deg of the hand. After 56 h the
     train has run with the fusee (7200 escape teeth an hour, as maintaining.py drives it), so the ratchet sits where it sat at UP; the fusee turned alone, as a jump with the train
     held would, the ratchet's seat lands anywhere in a tooth from where it was */
  const ud=()=>(-R.ud.rotation.y)/D;
  u(0,0,true);u(0,0,false);chk('wind indicator at UP (fully wound)',ud(),UD_UP,0.95,'deg');
  u(56*7200,56*FUSEE_PER_HOUR,false);u(56*7200,56*FUSEE_PER_HOUR,false);chk('wind indicator after 56 h (DOWN end of the scale)',ud(),UD_UP+UD_SWEEP,0.95,'deg');chk('wind indicator sweep against the photographed dial',UD_SWEEP,315.7,3.2,'deg');
  chk('fusee: 8 3/4 turns of chain run (manual: 56 h at most)',FUSEE_TURNS/FUSEE_PER_HOUR,56,0.5,'h');chk('fusee: half turns of the key to wind fully',FUSEE_TURNS*2,17.5,1e-9,'');
  chk('fusee: 7 half turns restore (manual: 24 h)',7*0.5/FUSEE_PER_HOUR,24,1.6,'h');
  const I0=R.timing(0,0),rate=(t,v)=>86400*(Math.sqrt(I0/R.timing(t,v))-1);
  chk('balance moment of inertia as built (Table II, masses a pair’s)',I0,578.0,1,'g mm2');chk('the drawn balance leaves to I_REST (under 10%)',R.I_REST/I0*100,0,10,'%');
  { const d=R.hsDesign,k=R.I_T2*1e-9*(4*Math.PI)**2,sec=HSPR.section(k,d.L,d.b,180);   /* the hairspring as designed (shared/hairspring.js) */
    chk('hairspring: the strip as drawn, against the stiffness Table II needs (Elinvar 180 GPa)',d.t,sec.t,0.002,'mm');
    chk('hairspring: the outer terminal curve, Phillips residual',d.outer.res,0,1e-7,'mm');chk('hairspring: the inner terminal curve, Phillips residual',d.inner.res,0,1e-7,'mm');
    chk('hairspring: the force on the pivots under a couple (of couple / R)',d.lat,0,1e-3,'');chk('hairspring: the bending stress at the swing (Elinvar’s spring temper takes far more)',sec.stress(ESC.A),210,40,'MPa'); }
  { let J=0;const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();   /* the escape wheel, pinion and arbor about their axis, on the solids (tools/physics.js uses it) */
    mv.traverse(o=>{if(!o.isMesh||o.userData.part!=='escW')return;const g=o.geometry,P=g.attributes.position,I=g.index,m=inv.clone().multiply(o.matrixWorld),n=I?I.count:P.count;
      for(let k=0;k<n;k+=3){a.fromBufferAttribute(P,I?I.getX(k):k).applyMatrix4(m);b.fromBufferAttribute(P,I?I.getX(k+1):k+1).applyMatrix4(m);c.fromBufferAttribute(P,I?I.getX(k+2):k+2).applyMatrix4(m);
        for(const q of[a,b,c]){q.x-=L.E[0];q.z-=L.E[1];}const v=a.dot(b.clone().cross(c))/6;J+=v*(a.x*a.x+b.x*b.x+c.x*c.x+a.x*b.x+a.x*c.x+b.x*c.x+a.z*a.z+b.z*b.z+c.z*c.z+a.z*b.z+a.z*c.z+b.z*c.z)/10;}});
    chk('escape wheel: its moment of inertia on the solid, steel (tools/physics.js takes 4.72e-9 kg m2)',J*7.85e-12,4.72e-9,0.15e-9,'kg m2'); }
  chk('timing weights, a full turn out (manual: 40 s/day)',-rate(1,0),40,2,'s/day');chk('vernier weights, a full turn out (manual: 2.8 s/day)',-rate(0,1),2.8,0.15,'s/day');
  /* Table IV (p. 74): R.T4 holds its "7 to n" figures fitted to all its rows; every row printed is the difference of two of them, holes 3-6 mirroring 11-8 */
  const HH=[0.120,0.100,0.090,0.080,0.070,0.060,0.050,0.040],T4R=[[12,11,[-1.69,-1.41,-1.10,-0.79,-0.66,-0.53,-0.32,-0.12]],[12,8,[-5.89,-4.91,-4.37,-3.82,-3.46,-3.09,-2.46,-1.89]],
    [11,10,[-1.86,-1.55,-1.45,-1.35,-1.24,-1.14,-0.95,-0.79]],[3,5,[-3.30,-2.75,-2.57,-2.38,-2.20,-2.01,-1.68,-1.39]],[10,8,[-2.34,-1.95,-1.82,-1.68,-1.55,-1.42,-1.19,-0.98]],
    [4,3,[1.86,1.55,1.45,1.35,1.24,1.14,0.95,0.79]],[9,12,[4.99,4.16,3.67,3.17,2.86,2.54,2.00,1.51]],[5,6,[-0.90,-0.75,-0.70,-0.65,-0.60,-0.55,-0.46,-0.38]],[8,11,[4.20,3.50,3.26,3.03,2.80,2.56,2.14,1.77]]];
  let t4=0;for(const[a,b,v]of T4R)HH.forEach((h,i)=>{t4=Math.max(t4,Math.abs(R.T4(h,b)-R.T4(h,a)-v[i]));});chk('Table IV: its printed rows from the fitted 7-to-n figures',t4,0,0.041,'s/day');
  /* moving a pair along the rim keeps the moment of inertia (the rate at the mean temperature); the standard set is back after */
  R.screws(R.screwStd.map((p,i)=>i?p:{...p,n:7}));chk('a pair moved from hole 3 to 7: moment of inertia unchanged',R.timing(0,0),I0,1e-9,'g mm2');R.screws(R.screwStd);
  /* the escapement's running amplitude and rate (makeEsc, the adjuster's bench): exactly 255 deg and 0 s a day at the model's settings; away from them Airy's signs: the impulse
     jewel set on (aI 184) ends the impulse sooner after the dead point and gains, set back (aI 178) loses; a deeper lock (dL 0.03, 0.20 mm) takes more from the balance before it and loses */
  const es=o=>makeEsc({EX:ESC.EX,...o});chk("escapement: running amplitude at the model's settings",ESC.A/D,255,1e-9,'deg');chk("escapement: rate at the model's settings",ESC.run.rate,0,0,'s/day');
  chk('escapement: impulse jewel at 184 deg gains',es({aI:184}).run.rate,1,0.9,'s/day');chk('escapement: impulse jewel at 178 deg loses',es({aI:178}).run.rate,-2,1.5,'s/day');
  const dl=es({dL:0.03});chk('escapement: deeper lock (0.20 mm, from 0.13) swings less',dl.A/D,248,6.9,'deg');chk('escapement: deeper lock loses',dl.run.rate,-3.5,3,'s/day');
  /* the balance's dynamics (makeEsc ampAt, rateAt): the torque the escapement is calibrated at gives its 255 deg and rate 0; free, it decays as exp(-t/TF), a quarter of
     its swing stays after TF ln 4; the manual's 1 3/8 to 1 1/2 turns take a torque within the fusee's residual of it; a smaller swing loses (the escapement's isochronism) */
  chk('dynamics: the calibrated torque swings the balance 255 deg',ESC.ampAt(1)/D,255,1e-9,'deg');chk('dynamics: and its rate there',ESC.rateAt(ESC.A,1),0,1e-12,'s/day');
  chk('dynamics: a smaller swing (90% of the torque) loses',ESC.rateAt(ESC.ampAt(0.9),0.9),-0.2,0.15,'s/day');
  /* the fusee (makeFusee pull, torque): the illustrative spring's pull falls from 1 to rmin/rmax; the torque on the fusee wheel keeps within its 3% residual; the going barrel's
     doesn't (the essay's and walkthrough's dashed line) */
  const F=R.fs,N=FUSEE_TURNS;let tq=[1e9,-1e9];for(let i=0;i<=100;i++){const v=F.torque(N*i/100);tq=[Math.min(tq[0],v),Math.max(tq[1],v)];}
  chk('fusee: the spring pulls 1 fully wound',F.pull(0),1.03,1e-9,'');chk('fusee: and rmin/rmax run down',F.pull(N),F.rf(0)/F.rf(N)*0.97,1e-9,'');
  chk('fusee: torque on the fusee wheel within 3% of its mean',(tq[1]-tq[0])/2,0.03,0.0005,'');
  /* temperature (core.js MTE): the Model 21's curvature against the test card of No. 3390 (90 F -0.02, 72.5 +0.06, 55 0.00 s a day: 72.5 above the ends' mean by 0.07) */
  chk('temperature: Model 21 balance, 72.5 F above the mean of 55 and 90 F',-(MTE.uncut(55)+MTE.uncut(90))/2,0.07,0.002,'s/day');
  chk('temperature: split balance, 0 at 72.5 F',MTE.split(72.5),0,1e-12,'s/day');
  /* the hairspring set against the escapement (HS, the adjuster's bench): -0.1 s a day per 10 deg all but cancels the escapement's loss at a smaller swing */
  { const h=es({HS:-0.075}),a=h.ampAt(0.9);chk('hairspring at -0.075 (cancels the escapement’s, TF 33): rate at 90% of the torque, nearly isochronous',h.rateAt(a,0.9),0,0.03,'s/day'); }
  /* the 30-day performance test (Sec. IX) on the model as loaded: within every Bureau of Ships limit, its temperature figures the card of No. 3390's (0.08, 0.06, 0.02) */
  { const t=window.__test();chk('performance test: regulation (limit 1.55)',t.reg,0,0.2,'s/day');chk('performance test: 90 against 72.5 F (card 0.08, limit 0.75)',t.t1,0.07,0.015,'s/day');
    chk('performance test: 72.5 against 55 F (card 0.06, limit 0.75)',t.t2,0.07,0.015,'s/day');chk('performance test: 90 against 55 F (card 0.02, limit 1.20)',t.t3,0,0.03,'s/day');chk('performance test: isochronism (card 0.00, limit 0.50)',t.iso,0,0.05,'s'); }
  R.timing(0,0);return out;})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("window.__mv&&window.__test",timeout=60000);await pg.wait_for_timeout(1000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        out=await pg.evaluate(JS);await b.close()
    bad=[r for r in out if not r['ok']]
    for r in out:print(f"{'ok' if r['ok'] else '!!':3s} {r['name']:58s} {r['got']:12.6g}  want {r['want']:g} ± {r['tol']:g} {r['unit']}")
    for e in errs:print('page error:',e)
    print('ok' if not bad and not errs else f'{len(bad)} failures');sys.exit(1 if bad or errs else 0)
asyncio.run(main())
