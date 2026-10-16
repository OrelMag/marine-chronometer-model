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
  /* the balance locking arm (Fig. 9, Sec. X): locked, its finger stops the balance at a timing weight; unlocked, the balance doesn't start by itself (Sec. III) */
  { click('#armSeg button[data-v="1"]');await until(()=>H().amp===0,60000);await wait(300);const h=H();   /* the page's frames carry model time: a slow renderer takes longer */
    const fin=[];R.arm.traverse(m=>{if(m.isMesh&&m.geometry.type==='CylinderGeometry')fin.push(ax(m));});let g=1e9;
    for(const w of byHn('42176')){const[a,b,r]=ax(w);for(const[c,d,q]of fin)g=Math.min(g,segD(a,b,c,d)-r-q);}
    out.push(['locking arm',h.amp===0&&h.held&&g>-0.05&&g<0.25,`locked: amplitude ${f2(h.amp)}, train held ${h.held}, finger to timing weight about ${f2(g)} mm (between their axes less their radii, which overstates it where the finger's end stands above the weight's axis; want -0.05..0.25, fine.py measures it)`]);
    click('#armSeg button[data-v="0"]');await wait(2000);const h2=H();
    out.push(['locking arm, unlocked',h2.amp===0&&h2.held,`unlocked, not started: amplitude ${f2(h2.amp)}, train held ${h2.held} (a detent chronometer doesn't start by itself)`]); }
  /* the twist (Sec. III): "a single quick twist" sets the balance swinging past the escapement's least amplitude, and the train runs */
  { click('#twist');await until(()=>H().amp>amin&&!H().held,60000);const h=H();out.push(['twist to start',h.amp>amin&&!h.held,`after the twist: amplitude ${f2(h.amp)} rad (least to unlock ${f2(amin)}), train held ${h.held}`]); }
  /* the train-blocking screw (Sec. II, Fig. 110): down, its dog point between the fourth wheel's spokes holds the train; raised, the train goes on */
  { click('#blkSeg button[data-v="1"]');await until(()=>H().held,180000);await wait(3000);const h=H(),E0=h.E;await wait(3000);const h1=H();   /* it waits over the wheel for a gap between spokes; held, the wheel runs on to the spoke: then it stands */
    out.push(['train-blocking screw',h1.held&&h1.E===E0,h.held?`screwed down: train held ${h1.held}, escape wheel ${E0} then ${h1.E}`:'screwed down: the train not held within 180 s']);
    click('#blkSeg button[data-v="0"]');await until(()=>!H().held,10000);if(H().held){click('#twist');await until(()=>!H().held,60000);}   /* held at the spoke, a tooth in the impulse jewel's path banks the balance, which may have stopped: then it needs its twist */const h2=H(),E2=h2.E;await until(()=>H().E!==E2,30000);const h3=H();
    const ok=!h3.held&&h3.E!==E2;out.push(['train-blocking screw, raised',ok,`raised: train held ${h3.held}, escape wheel ${E2} then ${h3.E}, amplitude ${f2(h3.amp)}`]); }
  /* the shield plate (Fig. 107; Sec. III, Fig. 7): at rest its metal covers the case's key hole; turned open, its hole lines up with it */
  { const sh=byHn('42104')[0],u=sh.userData.hole,bowl=sh.parent,d=rot=>{sh.userData.turn(rot);sh.updateWorldMatrix(true,false);
      const p=new T.Vector3(u.p[0],0,u.p[1]).applyMatrix4(sh.matrixWorld),c=new T.Vector3(u.c[0],0,u.c[1]).applyMatrix4(bowl.matrixWorld);return Math.hypot(p.x-c.x,p.z-c.z);};
    const rest=d(u.rest),open=d(0);sh.userData.turn(u.rest);
    out.push(['shield plate',rest>2*u.r+1&&open<0.05,`its hole from the case's: at rest ${f2(rest)} mm (want over ${f2(2*u.r+1)}, covered), open ${f2(open)} mm (want under 0.05)`]); }
  /* the gimbal latch (Fig. 106, Sec. III): released, the case swings in its gimbals as the ship rolls; latched, it goes with the box. Drawn as the ship's people see it
     (16 October 2026): the box stands still and the case swings against it (until then the box rolled and the case was kept level) */
  { const ring=byHn('42106')[0],bowl=byHn('42104')[0].parent,box=ring.parent,up=o=>new T.Vector3(0,1,0).applyQuaternion(o.getWorldQuaternion(new T.Quaternion()));
    const ang=(a,b)=>Math.acos(Math.min(1,a.dot(b)))*180/Math.PI;
    const rk=document.getElementById('rock'),la=document.getElementById('latch'),set=(el,v)=>{if(el.checked!==v)el.click();};
    set(la,false);set(rk,true);await wait(3000);const free=[ang(up(box),new T.Vector3(0,1,0)),ang(up(box),up(bowl))];
    set(la,true);await wait(3000);const held=ang(up(box),up(bowl));set(rk,false);set(la,false);await wait(500);
    out.push(['gimbal latch',free[0]<0.5&&free[1]>3&&held<0.5,`rolling: the box ${f2(free[0])} deg from level (it stands still); released, the case ${f2(free[1])} deg from the box; latched, ${f2(held)} deg from it`]); }
  /* the setup click (Sec. II: the setup ratchet and pawl "prevent the barrel arbor from turning during winding and running"): the mainspring pulls the arbor the way
     opposite to the barrel's turn in running; turned a little that way the ratchet's steep face runs into the click's tip, turned the other way its tip only rides up a
     tooth's back (a radial face's corner has the next back just behind it, so the outline under the tip rises a little that way too, at the back's slope: under half the
     face's rise; until 11 October 2026 it wanted the gap to open, which only a face leaning back gives). The ratchet's outline is read off its mesh (its top face's
     boundary, along a ray from the axis), the click's tip as its point nearest the axis */
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
      rw.rotation.y=r0;rw.updateWorldMatrix(true,false);return[Math.atan2(tip[1],tip[0]),rt,tip];};
    const depth=dl=>{const[a,r]=tipAt(dl);return rOut(a)-r;},held=depth(0.02*pull),free=depth(-0.02*pull),rest=depth(0);
    /* whether the tip lies in the tooth's metal, turned dl: a ray from it outward crosses the outline an odd number of times (an undercut face overhangs the tip, so
       the outline's farthest radius along its ray, depth, no longer rises as the face comes on; since 14 October 2026) */
    const inMetal=dl=>{const[a,,p]=tipAt(dl),d=[Math.cos(a),Math.sin(a)];let n=0;for(const[[ax,az],[bx,bz2]]of seg){const ex=bx-ax,ez=bz2-az,den=d[0]*ez-d[1]*ex;if(Math.abs(den)<1e-12)continue;
        const qx=ax-p[0],qz=az-p[1],t=(qx*ez-qz*ex)/den,u=(qx*d[1]-qz*d[0])/den;if(u>=0&&u<1&&t>0)n++;}return n%2===1;},inH=inMetal(0.02*pull),inF=inMetal(-0.02*pull),in0=inMetal(0);
    const[ta,tr]=tipAt(0);let top=0;for(let j=1;j<=30;j++)top=Math.max(top,rOut(ta+pull*0.001*j));   /* the tooth top behind the face the tip bears on */
    out.push(['setup click',wb!==0&&!in0&&inH&&!inF&&top-tr>0.3,`the barrel turns ${wb>0?'+':'-'} about its axis in running; at rest the click's tip ${in0?'is in':'is clear of'} the teeth's metal; turned 0.02 rad the way the spring pulls the arbor, the tooth's face comes onto it (the tip ${inH?'in the tooth':'still clear'}; the outline ${f2(rest)} -> ${f2(held)} mm from it along its ray), turned the other way only a back passes under it (${inF?'in the tooth':'clear'}): it holds the arbor the right way. The tip stands ${f2(top-tr)} mm inside the teeth's tips (want over 0.3: seated, the pivot where both photographs have it)`]); }
  click('#speeds button[data-v="0"]');
  return out;}
