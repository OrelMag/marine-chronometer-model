"""The Wempe's stop work in its last turns (wempe/js/fusee.js, the stop work; wempe/README.md, "The stop work"): the stop bar (05 06 03-1) against the stop pin
(05 08 01-5) as the fusee is wound through its last 1.2 turns, every 0.005 turn, with the chain and with the band.

    python wempe_stopwork.py            # about 40 s
    python wempe_stopwork.py --step 0.01 [--eval JS]

The page (?snap&qa) frozen as isolate.py freezes it; each state set through the movement's own update ({n, winding:true}: n the fusee's turns from full wind). The gap is the
bar's solid against the pin's cylinder: every triangle of the bar near the pin sampled over its face at 0.02 mm (the pin bears mid-face on the bar's far side, where no vertex
is), each point's distance from the pin's axis less its radius, over the pin's length. The bar's slide is the stop work part's userData.travel, a jam its userData.jam.

Fails (exit 1) unless, for both connectors:
  - fully wound (n 0) the pin is 0.005-0.05 off the bar's far side, and closer than a step before: the stop is what holds full wind (fusee.js: 0.02 off);
  - the gap is never under 0.5 from 1.2 to 0.05 turn before it, and closes steadily over the last 0.05: the bar never catches the pin early;
  - the pin bears on the bar's whole thickness where they meet (its end below the bar's lower face there);
  - the bar has slid fully wound, short of its 3.6, from rest (0) a turn and more before, and never jammed;
  - the page's full wind is escphys.js's (fusee.js MW against WPHYS's MF: the page warns if they part).
Prints the travel's onset, the travel and gap fully wound, the least gap before it and where, and the pin's bearing."""
import asyncio,browser,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parents[1]/'wempe'/'index.html').as_uri()+'?snap&qa'
STEP=float(sys.argv[sys.argv.index('--step')+1]) if '--step' in sys.argv else 0.005
EVAL=sys.argv[sys.argv.index('--eval')+1] if '--eval' in sys.argv else None
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}})()"""
SWEEP="""(([conn,N,step])=>{const mv=window.__mv,FU=mv.userData.R.fu,T=THREE;FU.setConn(conn);const s=ESC.state(0.4);
  const set=n=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:true,springOn:true,msOn:false});
  let pin=null,bars=[],pSW=null;mv.traverse(o=>{if(o.isMesh&&o.userData.hn==='050801-5')pin=o;if(o.isMesh&&o.userData.hn==='050603-1')bars.push(o);if(o.userData.partName==='stopWork')pSW=o;});
  const inv=new T.Matrix4();mv.updateMatrixWorld(true);inv.copy(mv.matrixWorld).invert();
  const loc=o=>new T.Matrix4().multiplyMatrices(inv,o.matrixWorld);
  pin.geometry.computeBoundingBox();const pb=pin.geometry.boundingBox.clone().applyMatrix4(loc(pin));   /* the pin: vertical, in the movement's frame */
  const px=(pb.min.x+pb.max.x)/2,pz=(pb.min.z+pb.max.z)/2,pr=(pb.max.x-pb.min.x)/2,py0=pb.min.y,py1=pb.max.y;
  const meas=()=>{mv.updateMatrixWorld(true);let g=1e9,ylo=1e9,yhi=-1e9;const near=[];
    for(const b of bars){const m=loc(b),P=b.geometry.attributes.position,I=b.geometry.index,nt=I?I.count/3:P.count/3,a=new T.Vector3(),c=new T.Vector3(),d=new T.Vector3(),q=new T.Vector3();
      const vi=k=>I?I.getX(k):k;
      for(let t=0;t<nt;t++){a.fromBufferAttribute(P,vi(3*t)).applyMatrix4(m);c.fromBufferAttribute(P,vi(3*t+1)).applyMatrix4(m);d.fromBufferAttribute(P,vi(3*t+2)).applyMatrix4(m);
        const lo=Math.min(Math.hypot(a.x-px,a.z-pz),Math.hypot(c.x-px,c.z-pz),Math.hypot(d.x-px,d.z-pz)),L=Math.max(a.distanceTo(c),c.distanceTo(d),d.distanceTo(a));
        if(lo-L>pr+2)continue;   /* a triangle wholly over 2 mm off the pin */
        const n=Math.max(1,Math.ceil(L/0.02));
        for(let i=0;i<=n;i++)for(let j=0;j<=n-i;j++){const u=i/n,v=j/n,w=1-u-v;q.set(a.x*w+c.x*u+d.x*v,a.y*w+c.y*u+d.y*v,a.z*w+c.z*u+d.z*v);
          const h=Math.hypot(q.x-px,q.z-pz),dy=q.y<py0?py0-q.y:q.y>py1?q.y-py1:0,e=dy>0?Math.hypot(Math.max(0,h-pr),dy):h-pr;
          if(e<g)g=e;if(h-pr<0.06)near.push(q.y);}}}
    return{g,near};};
  const out=[];for(let k=Math.round(N/step);k>=0;k--){const n=k*step;pSW.userData.jam=0;set(n);const r=meas();out.push({n:+n.toFixed(4),gap:r.g,tr:pSW.userData.travel||0,jam:pSW.userData.jam||0});}
  set(0);const r0=meas(),bar0=(()=>{let lo=1e9,hi=-1e9;for(const b of bars){b.geometry.computeBoundingBox();const bb=b.geometry.boundingBox.clone().applyMatrix4(loc(b));lo=Math.min(lo,bb.min.y);hi=Math.max(hi,bb.max.y);}return[lo,hi];})();
  /* where they meet fully wound: the bar's faces within 0.06 of the pin's cylinder (its length not counted), the height the pin must cover */
  const yb=r0.near.length?[Math.min(...r0.near),Math.max(...r0.near)]:null;
  return{conn,out,pin:{x:px,z:pz,r:pr,y0:py0,y1:py1},bear:yb,bar:bar0,MW:FU.MW,MF:(typeof WPHYS!=='undefined'&&WPHYS.MF)||null};})(%s)"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        warns=[];pg.on("console",lambda m:warns.append(m.text) if m.type in('warning','error') else None)
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE)
        if EVAL:await pg.evaluate(EVAL)
        res=[await pg.evaluate(SWEEP%json.dumps([c,1.2,STEP])) for c in('chain','band')]
        await b.close()
    bad=[]
    if errs:bad.append(f'page errors: {errs}')
    for m in warns:
        if 'MF' in m or 'full wind' in m:bad.append(f'page warns: {m}')
    for R in res:
        c=R['conn'];o=R['out'];full=o[-1];pre=o[:-1];mn=min(pre,key=lambda x:x['gap']);on=next((x for x in o if x['tr']>1e-6),None);jams=sum(x['jam'] for x in o)
        P=R['pin'];bear=R['bear']
        print(f"{c}: the bar slides from {on['n'] if on else '-'} turn before full wind; fully wound it has slid {full['tr']:.3f} (of 3.6), the pin {full['gap']:.3f} off its far side "
              f"({o[-2]['gap']:.3f} a step before); the least gap before full wind {mn['gap']:.3f} at {mn['n']} turn; jams {jams}")
        if bear:print(f"   the pin (y {P['y0']:.3f} to {P['y1']:.3f}, r {P['r']:.2f}; {P['y1']-P['y0']:.2f} long) meets the bar's far side over y {bear[0]:.3f} to {bear[1]:.3f} (the bar y {R['bar'][0]:.3f} to {R['bar'][1]:.3f})")
        if not(0.005<=full['gap']<=0.05):bad.append(f"{c}: fully wound the pin is {full['gap']:.3f} off the bar (0.005-0.05 wanted: the stop holds full wind)")
        if not(o[-2]['gap']>full['gap']):bad.append(f"{c}: the gap doesn't close toward full wind ({o[-2]['gap']:.3f} a step before, {full['gap']:.3f} fully wound)")
        far=[x for x in pre if x['n']>=0.05];fm=min(far,key=lambda x:x['gap']);last=[x for x in o if x['n']<0.05]
        print(f"   over 1.2 to 0.05 turn before full wind the least gap {fm['gap']:.3f} at {fm['n']} turn")
        if fm['gap']<0.5:bad.append(f"{c}: the bar comes {fm['gap']:.3f} from the pin at {fm['n']} turn before full wind (the stop catches early)")
        if any(b_['gap']>a_['gap']+1e-6 for a_,b_ in zip(last,last[1:])):bad.append(f"{c}: the gap doesn't close steadily over the last 0.05 turn")
        if not bear:bad.append(f"{c}: the pin doesn't meet the bar fully wound")
        elif P['y0']>bear[0]+0.01 or P['y1']<bear[1]-0.01:bad.append(f"{c}: the pin (y {P['y0']:.3f} to {P['y1']:.3f}) doesn't cover the bar's thickness where they meet (y {bear[0]:.3f} to {bear[1]:.3f}): it bears on part of it")
        if not(0.5<full['tr']<3.6-0.05):bad.append(f"{c}: fully wound the bar has slid {full['tr']:.3f} (0.5 to 3.55 wanted)")
        if o[0]['tr']>1e-6:bad.append(f"{c}: the bar is in ({o[0]['tr']:.3f}) {o[0]['n']} turn before full wind (the spring holds it out there)")
        if jams:bad.append(f"{c}: the bar jammed {jams} times")
    MW,MF=res[0]['MW'],res[0]['MF']
    print(f"full wind: fusee.js MW {MW:.4f} turns of chain" + (f", escphys.js MF {MF}" if MF is not None else ''))
    if MF is not None and abs(MW-MF)>0.002:bad.append(f"fusee.js's full wind {MW:.4f} isn't escphys.js's {MF}")
    for x in bad:print('FAIL',x)
    print('wempe_stopwork:', 'FAIL' if bad else 'ok');sys.exit(1 if bad else 0)
asyncio.run(main())
