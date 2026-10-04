/* bom.py's function checks: the parts the manual describes by what they do, worked through the page's own controls at 1× and measured (bom.json lines'
   'check': 'bom.py fn: NAME'). Each returns [name, ok, what was seen]. The page runs in real time between steps */
async()=>{
  const out=[],T=window.THREE,mv=window.__mv,R=mv.userData.R,H=()=>window.__H(),wait=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms)=>{const t0=performance.now();while(!f()&&performance.now()-t0<ms)await wait(200);},click=s=>document.querySelector(s).click();
  let root=mv;while(root.parent)root=root.parent;
  const byHn=id=>{const o=[];root.traverse(x=>{if(x.userData.hn===id)o.push(x);});return o;};
  const ax=m=>{m.updateWorldMatrix(true,false);const g=m.geometry;if(!g.boundingBox)g.computeBoundingBox();const b=g.boundingBox;   /* a cylinder or nut on its local y: its axis (world) and radius */
    const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;return[new T.Vector3(cx,b.min.y,cz).applyMatrix4(m.matrixWorld),new T.Vector3(cx,b.max.y,cz).applyMatrix4(m.matrixWorld),(b.max.x-b.min.x)/2];};
  const segD=(p1,q1,p2,q2)=>{const d1=q1.clone().sub(p1),d2=q2.clone().sub(p2),r=p1.clone().sub(p2),a=d1.dot(d1),e=d2.dot(d2),f=d2.dot(r),c=d1.dot(r),b=d1.dot(d2),dn=a*e-b*b;
    let s=dn>1e-12?Math.min(1,Math.max(0,(b*f-c*e)/dn)):0,t=(b*s+f)/e;if(t<0){t=0;s=Math.min(1,Math.max(0,-c/a));}else if(t>1){t=1;s=Math.min(1,Math.max(0,(b-c)/a));}
    return p1.clone().add(d1.multiplyScalar(s)).distanceTo(p2.clone().add(d2.multiplyScalar(t)));};
  const amin=ESC.AMIN,f2=x=>+x.toFixed(3);
  click('#speeds button[data-v="1"]');await wait(300);
  /* the balance locking arm (Fig. 9, Sec. X): locked, the washer at its end holds the balance by a timing weight's screw; unlocked, the balance doesn't start by itself (Sec. III) */
  { click('#armSeg button[data-v="1"]');await until(()=>H().amp===0,60000);await wait(300);const h=H();   /* the page's frames carry model time: a slow renderer takes longer */
    /* the washer at the arm's end (userData.lockEnd, its axis on local y): the timing weight's screw (42177) must stand in its hole, square to it, its end through the washer's inner face */
    let wm=null;R.arm.traverse(m=>{if(m.isMesh&&m.userData.lockEnd)wm=m;});wm.updateWorldMatrix(true,false);const wh=wm.userData.lockEnd,C=new T.Vector3().setFromMatrixPosition(wm.matrixWorld),nW=new T.Vector3(0,1,0).transformDirection(wm.matrixWorld);
    let best=null;for(const sc of byHn('42177')){const[a,b,r]=ax(sc),[base,tip]=a.distanceTo(C)<b.distanceTo(C)?[b,a]:[a,b],u=tip.clone().sub(base).normalize(),q=C.clone().sub(base),off=q.clone().sub(u.clone().multiplyScalar(q.dot(u))).length();
      const depth=tip.clone().sub(C).dot(u)+wh.h/2;if(!best||off<best.off)best={off,depth,clear:wh.hole-r-off,sq:Math.abs(u.dot(nW))};}   /* off: the screw's axis from the washer's centre; depth: its end past the washer's inner face */
    out.push(['locking arm',h.amp===0&&h.held&&best.clear>0&&best.depth>0.05&&best.sq>0.99,`locked: amplitude ${f2(h.amp)}, train held ${h.held}; the timing weight's screw in the washer's hole: ${f2(best.clear)} mm clear of its edge, ${f2(best.depth)} mm into it, its axis ${f2(Math.acos(Math.min(1,best.sq))*180/Math.PI)} deg off the washer's (want clear over 0, in over 0.05, square)`]);
    click('#armSeg button[data-v="0"]');await wait(2000);const h2=H();
    out.push(['locking arm, unlocked',h2.amp===0&&h2.held,`unlocked, not started: amplitude ${f2(h2.amp)}, train held ${h2.held} (a detent chronometer doesn't start by itself)`]); }
  /* the twist (Sec. III): "a single quick twist" sets the balance swinging past the escapement's least amplitude, and the train runs */
  { click('#twist');await until(()=>H().amp>amin&&!H().held,60000);const h=H();out.push(['twist to start',h.amp>amin&&!h.held,`after the twist: amplitude ${f2(h.amp)} rad (least to unlock ${f2(amin)}), train held ${h.held}`]); }
  /* the train-blocking screw (Sec. II, Fig. 110): down, its dog point between the fourth wheel's spokes holds the train; raised, the train goes on */
  { click('#blkSeg button[data-v="1"]');await until(()=>H().held,180000);await wait(3000);const h=H(),E0=h.E;await wait(3000);const h1=H();   /* it waits over the wheel for a gap between spokes; held, the wheel runs on to the spoke: then it stands */
    out.push(['train-blocking screw',h1.held&&h1.E===E0,h.held?`screwed down: train held ${h1.held}, escape wheel ${E0} then ${h1.E}`:'screwed down: the train not held within 180 s']);
    click('#blkSeg button[data-v="0"]');await until(()=>!H().held,60000);const h2=H(),E2=h2.E;await until(()=>H().E!==E2,30000);const h3=H();
    const ok=h3.amp>amin?!h3.held&&h3.E!==E2:true;out.push(['train-blocking screw, raised',ok,`raised: train held ${h3.held}, escape wheel ${E2} then ${h3.E}, amplitude ${f2(h3.amp)}`]); }
  /* the shield plate (Fig. 107; Sec. III, Fig. 7): at rest its metal covers the case's key hole; turned open, its hole lines up with it */
  { const sh=byHn('42104')[0],u=sh.userData.hole,bowl=sh.parent,d=rot=>{sh.userData.turn(rot);sh.updateWorldMatrix(true,false);
      const p=new T.Vector3(u.p[0],0,u.p[1]).applyMatrix4(sh.matrixWorld),c=new T.Vector3(u.c[0],0,u.c[1]).applyMatrix4(bowl.matrixWorld);return Math.hypot(p.x-c.x,p.z-c.z);};
    const rest=d(u.rest),open=d(0);sh.userData.turn(u.rest);
    out.push(['shield plate',rest>2*u.r+1&&open<0.05,`its hole from the case's: at rest ${f2(rest)} mm (want over ${f2(2*u.r+1)}, covered), open ${f2(open)} mm (want under 0.05)`]); }
  /* the gimbal latch (Fig. 106, Sec. III): released, the gimbals keep the case level as the box rolls; latched, the case goes with the box */
  { const ring=byHn('42106')[0],bowl=byHn('42104')[0].parent,box=ring.parent,up=o=>new T.Vector3(0,1,0).applyQuaternion(o.getWorldQuaternion(new T.Quaternion()));
    const ang=(a,b)=>Math.acos(Math.min(1,a.dot(b)))*180/Math.PI;
    const rk=document.getElementById('rock'),la=document.getElementById('latch'),set=(el,v)=>{if(el.checked!==v)el.click();};
    set(la,false);set(rk,true);await wait(3000);const free=[ang(up(bowl),new T.Vector3(0,1,0)),ang(up(box),up(bowl))];
    set(la,true);await wait(3000);const held=ang(up(box),up(bowl));set(rk,false);set(la,false);await wait(500);
    out.push(['gimbal latch',free[0]<1.5&&free[1]>3&&held<0.5,`rolling: released, the case ${f2(free[0])} deg from level with the box ${f2(free[1])} deg from it; latched, the case ${f2(held)} deg from the box`]); }
  /* the setup click (Sec. II: the setup ratchet and pawl "prevent the barrel arbor from turning during winding and running"): the mainspring pulls the arbor the way
     opposite to the barrel's turn in running; turned a little that way the ratchet's steep face runs into the click's tip, turned the other way its tip only rides up a
     tooth's back. The ratchet's outline is read off its mesh (its top face's boundary, along a ray from the axis), the click's tip as its point nearest the axis */
  { const bz=byHn('42168')[0],rw=byHn('42026').find(o=>o.isMesh),ck=byHn('42027').find(o=>o.isMesh),axis=o=>new T.Vector3(0,1,0).transformDirection(o.matrixWorld);
    const ang=o=>{o.updateWorldMatrix(true,false);const a=axis(o),x=new T.Vector3(1,0,0).transformDirection(o.matrixWorld);return[a,x];};
    click('#speeds button[data-v="60"]');const[a0,x0]=ang(bz);await wait(4000);const[,x1]=ang(bz);click('#speeds button[data-v="1"]');
    const wb=Math.sign(new T.Vector3().crossVectors(x0,x1).dot(a0));   /* the barrel's turn in running, about its own axis */
    const pull=-wb*Math.sign(a0.dot(axis(rw)));   /* the spring's pull on the arbor, as a turn of the ratchet about its own y */
    const g=rw.geometry,P=g.attributes.position,I=g.index?g.index.array:[...Array(P.count).keys()];let ymax=-1e9;for(let i=0;i<P.count;i++)ymax=Math.max(ymax,P.getY(i));
    const E=new Map(),k=(a,b)=>a<b?a+','+b:b+','+a,V=i=>[P.getX(i),P.getZ(i)],key=i=>V(i).map(v=>v.toFixed(4)).join(':');
    for(let t=0;t<I.length;t+=3){const tri=[I[t],I[t+1],I[t+2]];if(tri.some(i=>Math.abs(P.getY(i)-ymax)>1e-4))continue;for(let e=0;e<3;e++){const a=key(tri[e]),b=key(tri[(e+1)%3]),kk=k(a,b);E.set(kk,(E.get(kk)||0)+1);}}
    const seg=[...E].filter(([,n])=>n===1).map(([kk])=>kk.split(',').map(s=>s.split(':').map(Number)));
    const rOut=th=>{const d=[Math.cos(th),Math.sin(th)];let best=0;for(const[[ax,az],[bx,bz2]]of seg){const ex=bx-ax,ez=bz2-az,den=d[0]*ez-d[1]*ex;if(Math.abs(den)<1e-12)continue;
        const t=(ax*ez-az*ex)/den,u=(ax*d[1]-az*d[0])/den;if(u>=0&&u<=1&&t>best)best=t;}return best;};
    ck.updateWorldMatrix(true,false);const CP=ck.geometry.attributes.position,v=new T.Vector3();
    const tipAt=dl=>{const r0=rw.rotation.y;rw.rotation.y=r0+dl;rw.updateWorldMatrix(true,false);const inv=new T.Matrix4().copy(rw.matrixWorld).invert();let tip=null,rt=1e9;
      for(let i=0;i<CP.count;i++){v.fromBufferAttribute(CP,i).applyMatrix4(ck.matrixWorld).applyMatrix4(inv);const r=Math.hypot(v.x,v.z);if(r<rt){rt=r;tip=[v.x,v.z];}}
      rw.rotation.y=r0;rw.updateWorldMatrix(true,false);return[Math.atan2(tip[1],tip[0]),rt];};
    const depth=dl=>{const[a,r]=tipAt(dl);return rOut(a)-r;},held=depth(0.02*pull),free=depth(-0.02*pull),rest=depth(0);
    const[ta,tr]=tipAt(0);let top=0;for(let j=1;j<=30;j++)top=Math.max(top,rOut(ta+pull*0.001*j));   /* the tooth top behind the face the tip bears on */
    out.push(['setup click',wb!==0&&held>rest&&free<rest-0.1&&top-tr>0.3,`the barrel turns ${wb>0?'+':'-'} about its axis in running; turned 0.02 rad the way the spring pulls the arbor, the tooth's face comes onto the click's tip (outline ${f2(rest)} -> ${f2(held)} mm from it), turned the other way the gap opens under it (${f2(free)}): it holds the arbor the right way. The tip stands ${f2(top-tr)} mm inside the teeth's tips (want over 0.3: seated, the pivot where both photographs have it)`]); }
  click('#speeds button[data-v="0"]');
  return out;}
