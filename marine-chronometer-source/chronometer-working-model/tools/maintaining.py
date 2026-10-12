"""Maintaining work over run / wind cycles: the sustaining ratchet, its spring, the winding pawls and the fusee's catch.

    python maintaining.py

Drives mv.userData.update through running, winding (short winds, winds to the stop), sets of the "Since winding" slider and of the hands, many partial winds,
a run down and a sudden one, with the train and the fusee advancing together as in the page (7200 escape teeth to FUSEE_PER_HOUR, 14/90, of a fusee turn an
hour), and when the key lets go adds the catch's hours (R.release) as app.js does. Checks after every frame:
  - the sustaining ratchet never turns back, except as winding starts (locked to the fusee, its winding pawls on their faces, until its pawl holds it) and when the
    spring pushes it back to its pawl (a sudden drop of the fusee's drive), each time by less than one of its teeth;
  - the spring: running, where it balances the fusee's drive (d = SMAX (1 - D)) unless its pawl holds the ratchet; while held or winding it only relaxes, up to SMAX;
  - the winding pawls: running, on the steep faces of the fusee's winding ratchet (R.WPH) and at least half its teeth's depth into them (0.4 mm of 0.82 until the teeth were measured 0.55 deep, 11 October 2026); as winding starts, still on the faces
    and as deep while the ratchet goes back with the fusee (they ride over the teeth only once the sustaining pawl holds it);
  - the catch when the key lets go: the fusee (and the arbor, square and wind-indicator pinion with it) turns forward by the gap to the pawls plus the spring's
    reload, exactly (catchAt in movement.js), never back, never a tooth short or a whole tooth too many (with nothing moved it turns none), and R.release foretold it;
  - over 40 partial winds, eps (the fusee past its n turns) stays within a tooth and the spring's travel;
  - run down: the drive tapers and the spring relaxes with it; suddenly run down (the slider), the spring drives the train alone, the fusee standing;
  - the winding and sustaining pawls rest on their teeth, not in them (the gap measured with the teeth's tips against the pawls' edges);
  - winding to the stop, the stop-bar meets the winding stop at full wind and is clear of it half a turn earlier.
  - the fusee swept from full wind to run down, the stop-bar (bar, nose, tab) passes the winding stop more than the manual's widest endshake clear (0.1 mm).
Exit code 1 on any failure."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS=r"""(()=>{const mv=window.__mv,R=mv.userData.R;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
 const D=180/Math.PI,FPR=R.FPR,WD=(FPR.ro-FPR.ri)/2,SRP=R.SRP,SMAX=R.SMAX,TAU=2*Math.PI,fails=[],cnt={},fail=(k,m)=>{cnt[k]=(cnt[k]||0)+1;if(cnt[k]<=3)fails.push(k+': '+m);},info={};
 const TPH=7200,NPH=FUSEE_PER_HOUR,st={E:1000,n:3,spent:false,reset:false};let prev=null,k=0,ws=null;
 /* how far a pawl is from its ratchet's teeth (negative: inside): its outline every 0.1 mm against the profile (as seatPawl tests it), and the teeth's tips against
    its edges (a tip can touch an edge between the points): the nearest tip's distance outside the outline, negative inside */
 const dense=pts=>{const d=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.1));for(let k=0;k<n;k++)d.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}return d;};
 const gap=(pts,q,th,pr)=>{const c=Math.cos(th),sn=Math.sin(th);let m=1e9;for(const[x,z]of dense(pts)){const X=q[0]+x*c+z*sn,Z=q[1]-x*sn+z*c,r=Math.hypot(X,Z);if(r<pr.ro+0.5)m=Math.min(m,r-pr.r(Math.atan2(Z,X)));}
   const Q=pts.map(([x,z])=>[q[0]+x*c+z*sn,q[1]-x*sn+z*c]),sg=Math.sign(pr.tipB(1)-pr.tipB(0)),k0=Math.round(Math.atan2(Q[0][1],Q[0][0])*sg/pr.p);
   for(let k=k0-6;k<=k0+6;k++){const b=pr.tipB(k),tx=pr.ro*Math.cos(b),tz=pr.ro*Math.sin(b);let ins=false,d=1e9;
     for(let i=0,j=Q.length-1;i<Q.length;j=i++){const[xi,zi]=Q[i],[xj,zj]=Q[j];if(((zi>tz)!==(zj>tz))&&(tx<(xj-xi)*(tz-zi)/(zj-zi)+xi))ins=!ins;const l2=(xi-xj)**2+(zi-zj)**2,t=Math.max(0,Math.min(1,((tx-xj)*(xi-xj)+(tz-zj)*(zi-zj))/l2));d=Math.min(d,Math.hypot(tx-xj-t*(xi-xj),tz-zj-t*(zi-zj)));}
     m=Math.min(m,ins?-d:d);}return m;};
 /* how far into the teeth a pawl reaches: below the tips, at its nearest point to the wheel's centre */
 const deep=(pts,q,th,pr)=>{const c=Math.cos(th),sn=Math.sin(th);let m=1e9;for(const[x,z]of dense(pts))m=Math.min(m,Math.hypot(q[0]+x*c+z*sn,q[1]-x*sn+z*c));return pr.ro-m;};
 const stud=[];mv.traverse(o=>{if(o.userData.wstop&&o.geometry&&o.geometry.parameters&&o.geometry.parameters.radiusTop)stud.push(o);});
 const barGap=()=>{mv.updateMatrixWorld(true);const bar=R.fs.stopBar.children[0],p=bar.geometry.parameters,inv=bar.matrixWorld.clone().invert(),s=stud[0],c=new THREE.Vector3();s.getWorldPosition(c);c.applyMatrix4(inv);
   const dx=Math.max(0,Math.abs(c.x)-p.width/2),dz=Math.max(0,Math.abs(c.z)-p.depth/2);return Math.hypot(dx,dz)-s.geometry.parameters.radiusTop;};
 const mod=(x,p)=>{const r=((x%p)+p)%p;return Math.min(r,p-r);};
 let catches=[],epsR=[1e9,-1e9];
 function frame(w,tag){const s=ESC.state(0.4);mv.userData._u({E:st.E+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n:st.n,winding:w,spent:st.spent,reset:st.reset,springOn:false,msOn:false});k++;st.reset=false;
   const sr=R.sr.rotation.y,gA=R.gw.rotation.y,fz=R.fs.g.rotation.y+R.fs.fz.rotation.y,cur={sr,gA,fz,eps:R.eps,n:st.n,w,held:R.held,tag},at=`frame ${k} (${tag}, n ${st.n.toFixed(3)})`,d=gA-sr,psi=fz-sr;
   const dq=SMAX*Math.max(-0.25,Math.min(1,1-(st.spent?0:R.drvN(st.n))));
   if(Math.abs((R.sq.rotation.y+R.fs.g.rotation.y)-fz)>1e-6)fail('arbor',`${at}: square and fusee differ by ${((R.sq.rotation.y+R.fs.g.rotation.y-fz)*D).toFixed(2)} deg`);
   if(prev){const dsr=sr-prev.sr,jump=/slider|set|start/.test(tag);
     if(w&&!prev.w)ws={sr0:prev.sr,psi0:prev.fz-prev.sr,rel:[]};
     if(dsr<-1e-9&&!/slider|set/.test(tag)){
       if(w&&ws&&!prev.held&&(Math.abs(psi-ws.psi0)<1e-9||cur.held)){if(ws.sr0-sr>=SRP.p)fail('ratchet back',`${at}: went back ${((ws.sr0-sr)*D).toFixed(2)} deg with the fusee as winding started, a tooth or more (${(SRP.p*D).toFixed(1)})`);}   /* locked to the fusee until its pawl holds it */
       else if(!w&&cur.held&&!prev.held&&-dsr<SRP.p){}   /* pushed back to its pawl: the fusee's drive fell faster than the spring relaxes */
       else fail('ratchet back',`${at}: sustaining ratchet turned back ${(-dsr*D).toFixed(2)} deg${prev.w&&!w?' as winding stopped':''}`);}
     if(w&&ws&&!cur.held){const u=R.wp[0].userData,ql=toWheel(u.q,[0,0],psi),dp=deep(u.pts,ql,R.wp[0].rotation.y-psi,FPR);if(mod(psi-R.WPH,FPR.p)>1e-4||dp<WD)fail('lift',`${at}: winding pawls ${dp.toFixed(3)} mm into the teeth, ${(mod(psi-R.WPH,FPR.p)*D).toFixed(2)} deg off their faces, while the ratchet goes back with the fusee`);}
     if(prev.w&&!w&&!jump){const sh=prev.sr,fc=sh+R.WPH+FPR.p*Math.ceil((prev.fz-sh-R.WPH)/FPR.p-1e-9),want=fc+Math.max(0,gA-dq-sh)-prev.fz,got=fz-prev.fz;   /* the catch: gap to the pawls, then the reload */
       catches.push(got);if(got<-1e-9)fail('catch',`${at}: fusee turned back ${(-got*D).toFixed(2)} deg when the key let go`);
       if(Math.abs(got-want)>2e-4)fail('catch',`${at}: the catch turned the fusee ${(got*D).toFixed(3)} deg, the gap and reload ${(want*D).toFixed(3)}`);
       const fore=prev.rel*TAU+(gA-prev.gA);if(Math.abs(got-fore)>2e-4)fail('catch',`${at}: R.release foretold ${(prev.rel*360).toFixed(3)} deg and the train turned ${((gA-prev.gA)*D).toFixed(3)}, the catch took ${(got*D).toFixed(3)}`);}   /* the frame's own running turns the fusee too */
   }
   if(!w&&!cur.held&&Math.abs(d-dq)>1e-6)fail('load',`${at}: spring relaxed ${(d*D).toFixed(3)} deg in running, where the drive puts it ${(dq*D).toFixed(3)}`);
   if((w||cur.held)&&prev&&(prev.w||prev.held)&&!/slider|set/.test(tag)&&d<prev.gA-prev.sr-1e-9)fail('load',`${at}: spring loaded again while ${w?'winding':'held'}`);
   if(d>SMAX+1e-6)fail('load',`${at}: spring relaxed ${(d*D).toFixed(2)} deg, past its ${(SMAX*D).toFixed(1)}`);
   if(!w&&!cur.held&&R.WPH!=null){const e=mod(psi-R.WPH,FPR.p);if(e>1e-4)fail('engage',`${at}: winding pawls ${(e*D).toFixed(2)} deg off the steep faces in running`);
     const u=R.wp[0].userData,ql=toWheel(u.q,[0,0],psi),dp=deep(u.pts,ql,R.wp[0].rotation.y-psi,FPR);info.wdeep=Math.min(info.wdeep??9,dp);if(dp<WD)fail('engage',`${at}: winding pawls only ${dp.toFixed(3)} mm into the teeth in running`);}
   for(const pw of R.wp){const ql=toWheel(pw.userData.q,[0,0],psi),dp=gap(pw.userData.pts,ql,pw.rotation.y-psi,FPR);if(dp<-0.01||dp>0.02)fail('pawl',`${at}: winding pawl ${dp.toFixed(3)} mm from its teeth`);}
   { const q=toWheel([R.spawl.position.x-L.Fu[0],R.spawl.position.z-L.Fu[1]],[0,0],sr),dp=gap(R.spawl.userData.pts,q,R.spawl.rotation.y-sr,SRP);if(dp<-0.01||dp>0.02)fail('pawl',`${at}: sustaining pawl ${dp.toFixed(3)} mm from its teeth`);
     if(cur.held){const dd=deep(R.spawl.userData.pts,q,R.spawl.rotation.y-sr,SRP);info.sdeep=[Math.min(info.sdeep?.[0]??9,dd),Math.max(info.sdeep?.[1]??0,dd)];} }
   if(!w){epsR=[Math.min(epsR[0],R.eps),Math.max(epsR[1],R.eps)];}
   cur.rel=w?R.release():null;prev=cur;return cur;}
 const run=(frames,dE)=>{for(let i=0;i<frames;i++){st.E+=dE;st.n=Math.min(FUSEE_TURNS,st.n+dE/TPH*NPH);st.spent=st.n>=FUSEE_TURNS;frame(false,'running');}};
 const wind=(to,dn,dE=0.07)=>{while(st.n>to+1e-12){st.n=Math.max(to,st.n-dn);st.spent=false;st.E+=dE;frame(true,'winding');}};
 const letGo=()=>{st.n+=R.release();st.spent=st.n>=FUSEE_TURNS;};   /* app.js windEnd: the catch's hours come off the mainspring */
 const bar=[];
 run(40,17);wind(2.2,0.031);letGo();run(30,23);wind(2.15,0.004);letGo();run(25,11);wind(0,0.05);bar.push(['full wind, winding',barGap()]);
 st.n=0.5;frame(true,'winding start');bar.push(['half a turn before full wind',barGap()]);wind(0,0.02);bar.push(['full wind again',barGap()]);
 letGo();run(1,5);bar.push(['let go at full wind',barGap()]);run(30,29);
 st.n+=2.3;frame(false,'slider');run(20,7);wind(4,0.043);letGo();run(20,3);wind(3.9,0.011);letGo();run(20,13);st.n-=1.1;frame(false,'slider');run(10,5);
 /* the key let go with nothing moved: no tooth taken */
 { run(3,9);frame(true,'winding');letGo();const c0=catches.length;run(1,0.001);const c=catches[c0];if(c!==undefined&&c>FPR.p/2)fail('catch',`let go with nothing moved: the fusee turned ${(c*D).toFixed(2)} deg (a tooth is ${(FPR.p*D).toFixed(0)})`); }
 /* the hands set: the train jumps forward and back, running and while winding (the loop's reset) */
 { run(5,11);const n0=st.n;st.E+=1.3e5;st.reset=true;frame(false,'set');st.E-=2.6e5;st.reset=true;frame(false,'set');run(5,11);wind(n0-0.2,0.02);const d0=R.gw.rotation.y-R.sr.rotation.y;st.E+=9e4;st.reset=true;frame(true,'set');
   const dd=R.gw.rotation.y-R.sr.rotation.y-d0;if(dd<-1e-9||dd>=SRP.p)fail('set',`setting the hands while winding loaded the spring or let it go a tooth or more (${(dd*D).toFixed(3)} deg)`);   /* the held ratchet stays on its pawl's tooth */wind(n0-0.4,0.02);letGo();run(5,11); }
 /* 40 partial winds, the train running between: eps (the fusee past its turns) stays within a tooth and the spring's travel */
 { let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;epsR=[1e9,-1e9];st.n=4;frame(false,'slider');
   for(let i=0;i<40;i++){run(5+Math.floor(rnd()*30),5+rnd()*40);wind(Math.max(0,st.n-rnd()*0.8),0.01+rnd()*0.05,0.05+rnd()*2);letGo();}
   run(5,10);info.eps=epsR.map(x=>x*D);if(epsR[1]-epsR[0]>FPR.p+SMAX+1e-6||epsR[0]<-FPR.p-SMAX||epsR[1]>FPR.p+SMAX)fail('eps',`over 40 partial winds eps ranged ${(epsR[0]*D).toFixed(1)} to ${(epsR[1]*D).toFixed(1)} deg`); }
 /* run down: the drive tapers, the spring relaxing with it (none held); then winding a run-down movement */
 { st.n=FUSEE_TURNS-0.3;frame(false,'slider');run(10,5);const per=(FUSEE_TURNS-st.n)/120*TPH/NPH;let held=0;for(let i=0;i<121;i++){run(1,per);if(R.held)held++;}
   info.runDown={spring:(R.gw.rotation.y-R.sr.rotation.y)*D,drive:R.drvN(st.n),held};if(R.gw.rotation.y-R.sr.rotation.y<SMAX-1e-3)fail('rundown',`run down, the spring still loaded (relaxed ${info.runDown.spring.toFixed(2)} of ${(SMAX*D).toFixed(1)} deg)`);
   wind(FUSEE_TURNS-1,0.03,0);letGo();run(5,10); }   /* the train stopped, as at run down */
 /* run down at once (the slider): the spring drives the train alone, its pawl holding the ratchet, the fusee standing */
 { st.n=3;frame(false,'slider');run(10,7);st.n=FUSEE_TURNS;st.spent=true;frame(false,'slider');const fz0=R.fs.g.rotation.y+R.fs.fz.rotation.y,f0=R.ssF();run(30,30);
   const f1=R.ssF(),fz1=R.fs.g.rotation.y+R.fs.fz.rotation.y;info.sudden={push0:f0,push1:f1,held:R.held};
   if(!R.held||f0<1-SRP.p/SMAX-0.05||!(f1<f0)||Math.abs(fz1-fz0)>1e-9)fail('sudden',`run down at once: held ${R.held}, the spring's push ${f0.toFixed(3)} then ${f1.toFixed(3)}, the fusee moved ${((fz1-fz0)*D).toFixed(3)} deg`);
   st.spent=false;wind(FUSEE_TURNS-0.5,0.03);letGo();run(5,10); }
 const gOK=[bar[0][1]>=-0.02&&bar[0][1]<=0.02,bar[1][1]>0.02,bar[2][1]>=-0.02&&bar[2][1]<=0.02,bar[3][1]>=-0.02];
 bar.forEach(([t,g],i)=>{if(!gOK[i])fail('stop',`${t}: stop-bar ${g.toFixed(3)} mm from the winding stop`);});
 /* the stop-bar's passes: the fusee swept from full wind to run down, every 0.002 turn; the bar, nose and tab (their triangles sampled, in the bar's frame) against the
    stud. Past the approach to full wind (n 0.01 on) nothing may come within ESH of it: the manual's widest endshake, 0.003 in (Ops. 15, 69), with 0.024 to spare, since
    the fusee is drawn at one end of its shake and dial up sits at the other, toward the stud (Review-results.md, "The winding stop-bar's function") */
 { const ESH=0.1,S=stud[0],sr=S.geometry.parameters.radiusTop,sh=S.geometry.parameters.height,sb=R.fs.stopBar,pts=[];mv.updateMatrixWorld(true);const bi=sb.matrixWorld.clone().invert();
   sb.traverse(o=>{if(!o.isMesh)return;const g=o.geometry,ps=g.attributes.position,ix=g.index,nT=(ix?ix.count:ps.count)/3,m=bi.clone().multiply(o.matrixWorld),v=i=>new THREE.Vector3().fromBufferAttribute(ps,ix?ix.getX(i):i).applyMatrix4(m);
     for(let t=0;t<nT;t++){const a=v(3*t),b=v(3*t+1),c=v(3*t+2);for(let i=0;i<=8;i++)for(let j=0;j<=8-i;j++)pts.push(a.clone().multiplyScalar(1-(i+j)/8).addScaledVector(b,i/8).addScaledVector(c,j/8));}});
   const M=new THREE.Matrix4(),q=new THREE.Vector3();let worst={gap:1e9,n:0,how:''};
   for(let n=0.01;n<=FUSEE_TURNS+1e-9;n+=0.002){R.fs.setWind(n,0);mv.updateMatrixWorld(true);M.copy(S.matrixWorld).invert().multiply(sb.matrixWorld);
     for(const p of pts){q.copy(p).applyMatrix4(M);const rr=Math.hypot(q.x,q.z)-sr,dy=Math.abs(q.y)-sh/2,d=dy>0?Math.hypot(Math.max(rr,0),dy):rr;if(d<worst.gap)worst={gap:d,n,how:dy>0&&rr<0?'along the arbor':dy>0?'round the end edge':'radially'};}}
   info.pass=worst;if(!(worst.gap>ESH))fail('stop pass',`the stop-bar passes the winding stop ${worst.gap.toFixed(3)} mm clear (${worst.how}) at ${worst.n.toFixed(3)} turns from full wind; want more than ${ESH}`); }
 info.catches=catches.length;return JSON.stringify({frames:k,fails,cnt,bar,SMAX:SMAX*D,info});})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        r=json.loads(await pg.evaluate(JS));await b.close()
    i=r['info']
    print(f"{r['frames']} frames; spring travel {r['SMAX']:.1f} deg; {i['catches']} catches")
    for t,g in r['bar']:print(f"stop-bar to winding stop, {t}: {g:.3f} mm")
    print(f"stop-bar passing the winding stop, full wind to run down: at least {i['pass']['gap']:.3f} mm ({i['pass']['how']}, {i['pass']['n']:.3f} turns from full wind)")
    print(f"winding pawls into the teeth in running: at least {i.get('wdeep',0):.3f} mm; sustaining pawl holding {i.get('sdeep',[0,0])[0]:.3f}-{i.get('sdeep',[0,0])[1]:.3f} mm")
    print(f"eps over 40 partial winds: {i['eps'][0]:.2f} to {i['eps'][1]:.2f} deg")
    print(f"run down: spring relaxed {i['runDown']['spring']:.2f} deg, the fusee's drive {i['runDown']['drive']:.3f}, held {i['runDown']['held']} of 121 frames")
    print(f"run down at once: the spring's push {i['sudden']['push0']:.3f} then {i['sudden']['push1']:.3f} (held {i['sudden']['held']})")
    for f in r['fails']:print('FAIL',f)
    for t,c in r['cnt'].items():print(f"{c:5d} frames failed '{t}'")
    if errs:print('page errors:',errs)
    print('ok' if not r['fails'] and not errs else f"{sum(r['cnt'].values())} failures");sys.exit(1 if r['fails'] or errs else 0)
asyncio.run(main())
