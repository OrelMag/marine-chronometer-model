"""Maintaining work over run / wind cycles: the sustaining ratchet, its spring and the fusee's catch.

    python maintaining.py

Drives mv.userData.update through running, winding (short winds, winds to the stop) and a jump of the "Since winding" slider, with the train and the
fusee advancing together as in the page (7200 escape teeth to FUSEE_PER_HOUR, 14/90, of a fusee turn an hour), and checks after every frame:
  - the sustaining ratchet never turns back, except once as winding starts, by less than one of its teeth, until its pawl holds it;
  - in running the spring is at its loaded deflection (fusee wheel and sustaining ratchet turn together); while winding it only relaxes, up to SMAX;
  - the fusee (and the arbor, square and wind-indicator pinion with it) only moves forward when the key lets go: its winding ratchet catches the pawls;
  - in running the winding pawls sit on the steep faces of the fusee's winding ratchet (R.WPH, where the model exposes it);
  - the winding and sustaining pawls rest on their teeth, not in them;
  - winding to the stop, the stop-bar meets the winding stop at full wind and is clear of it half a turn earlier.
Exit code 1 on any failure."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS=r"""(()=>{const mv=window.__mv,R=mv.userData.R;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
 const D=180/Math.PI,FPR=ratchetProf(40,0.47,false),SRP=ratchetProf(120,0.27,true),SMAX=R.SMAX??10/D,fails=[],cnt={},fail=(k,m)=>{cnt[k]=(cnt[k]||0)+1;if(cnt[k]<=3)fails.push(k+': '+m);};
 const TPH=7200,NPH=FUSEE_PER_HOUR,st={E:1000,n:3};let prev=null,k=0,wasW=false;
 /* how far into its ratchet's teeth a pawl reaches (negative: inside), pawl frame as seatPawl */
 const dense=pts=>{const d=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.1));for(let k=0;k<n;k++)d.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}return d;};   /* as seatPawl measures it (movement.js): every 0.1 mm along the outline's edges */
 const depth=(pts,q,th,pr)=>{const c=Math.cos(th),sn=Math.sin(th);let m=1e9;for(const[x,z]of dense(pts)){const X=q[0]+x*c+z*sn,Z=q[1]-x*sn+z*c,r=Math.hypot(X,Z);if(r<pr.ro+0.5)m=Math.min(m,r-pr.r(Math.atan2(Z,X)));}return m;};
 const stud=[];mv.traverse(o=>{if(o.userData.wstop&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.radiusTop)stud.push(o);});
 const barGap=()=>{mv.updateMatrixWorld(true);const bar=R.fs.stopBar.children[0],p=bar.geometry.parameters,inv=bar.matrixWorld.clone().invert(),s=stud[0],c=new THREE.Vector3();s.getWorldPosition(c);c.applyMatrix4(inv);
   const dx=Math.max(0,Math.abs(c.x)-p.width/2),dz=Math.max(0,Math.abs(c.z)-p.depth/2);return Math.hypot(dx,dz)-s.geometry.parameters.radiusTop;};
 function frame(w,tag){const s=ESC.state(0.4);mv.userData._u({E:st.E+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n:st.n,winding:w,springOn:false,msOn:false});k++;
   const sr=R.sr.rotation.y,gA=R.gw.rotation.y,fz=R.fs.g.rotation.y+R.fs.fz.rotation.y,base=R.fs.g.rotation.y+st.n*2*Math.PI,cur={sr,gA,fz,eps:fz-base,n:st.n,w},at=`frame ${k} (${tag}, n ${st.n.toFixed(3)})`;
   if(Math.abs((R.sq.rotation.y+R.fs.g.rotation.y)-fz)>1e-6)fail('arbor',`${at}: square and fusee differ by ${((R.sq.rotation.y+R.fs.g.rotation.y-fz)*D).toFixed(2)} deg`);
   if(prev){const dsr=sr-prev.sr;
     if(w&&!prev.w){if(dsr<-SRP.p-1e-9)fail('ratchet back',`${at}: fell back ${(-dsr*D).toFixed(2)} deg starting to wind, more than a tooth (${(SRP.p*D).toFixed(1)})`);}
     else if(dsr<-1e-9)fail('ratchet back',`${at}: sustaining ratchet turned back ${(-dsr*D).toFixed(2)} deg${prev.w&&!w?' as winding stopped':''}`);
     if(prev.w&&!w&&Math.abs(st.n-prev.n)<1e-12&&cur.eps<prev.eps-1e-9)fail('catch',`${at}: fusee turned back ${((prev.eps-cur.eps)*D).toFixed(2)} deg when the key let go`);}
   const d=gA-sr;
   if(!w&&Math.abs(d)>1e-6)fail('load',`${at}: spring deflection ${(d*D).toFixed(2)} deg in running (should be the loaded 0)`);
   if(w&&(d<-1e-6||d>SMAX+1e-6))fail('load',`${at}: spring deflection ${(d*D).toFixed(2)} deg while winding (0 to ${(SMAX*D).toFixed(1)})`);
   if(!w&&R.WPH!=null){const r=((fz-sr-R.WPH)%FPR.p+FPR.p)%FPR.p,e=Math.min(r,FPR.p-r);if(e>1e-4)fail('engage',`${at}: winding pawls ${(e*D).toFixed(2)} deg off the steep faces in running`);}
   for(const pw of R.wp){const psi=fz-sr,q=toWheel(pw.userData.q,[0,0],psi),dp=depth(pw.userData.pts,q,pw.rotation.y-psi,FPR);if(dp<-0.01||dp>0.02)fail('pawl',`${at}: winding pawl ${dp.toFixed(3)} mm from its teeth`);}
   { const q=toWheel([R.spawl.position.x-L.Fu[0],R.spawl.position.z-L.Fu[1]],[0,0],sr),dp=depth(R.spawl.userData.pts,q,R.spawl.rotation.y-sr,SRP);if(dp<-0.01||dp>0.02)fail('pawl',`${at}: sustaining pawl ${dp.toFixed(3)} mm from its teeth`); }
   prev=cur;return cur;}
 const run=(frames,dE)=>{for(let i=0;i<frames;i++){st.E+=dE;st.n+=dE/TPH*NPH;frame(false,'running');}};
 const wind=(to,dn)=>{while(st.n>to+1e-12){st.n=Math.max(to,st.n-dn);st.E+=0.07;frame(true,'winding');}};
 const bar=[];
 run(40,17);wind(2.2,0.031);run(30,23);wind(2.15,0.004);run(25,11);wind(0,0.05);bar.push(['full wind, winding',barGap()]);
 st.n=0.5;frame(true,'winding');bar.push(['half a turn before full wind',barGap()]);wind(0,0.02);bar.push(['full wind again',barGap()]);
 run(1,5);bar.push(['let go at full wind',barGap()]);run(30,29);
 st.n+=2.3;frame(false,'slider');run(20,7);wind(4,0.043);run(20,3);wind(3.9,0.011);run(20,13);st.n-=1.1;frame(false,'slider');run(10,5);
 const gOK=[bar[0][1]>=-0.02&&bar[0][1]<=0.02,bar[1][1]>0.02,bar[2][1]>=-0.02&&bar[2][1]<=0.02,bar[3][1]>=-0.02];
 bar.forEach(([t,g],i)=>{if(!gOK[i])fail('stop',`${t}: stop-bar ${g.toFixed(3)} mm from the winding stop`);});
 return JSON.stringify({frames:k,fails,cnt,bar,SMAX:SMAX*D,hasWPH:R.WPH!=null});})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        r=json.loads(await pg.evaluate(JS));await b.close()
    print(f"{r['frames']} frames; spring travel limit {r['SMAX']:.1f} deg"+('' if r['hasWPH'] else '; R.WPH not exposed, engagement not checked'))
    for t,g in r['bar']:print(f"stop-bar to winding stop, {t}: {g:.3f} mm")
    for f in r['fails']:print('FAIL',f)
    for t,c in r['cnt'].items():print(f"{c:5d} frames failed '{t}'")
    if errs:print('page errors:',errs)
    print('ok' if not r['fails'] and not errs else f"{sum(r['cnt'].values())} failures");sys.exit(1 if r['fails'] or errs else 0)
asyncio.run(main())
