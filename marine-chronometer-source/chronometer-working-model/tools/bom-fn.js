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
    out.push(['locking arm',h.amp===0&&h.held&&g>-0.05&&g<0.1,`locked: amplitude ${f2(h.amp)}, train held ${h.held}, finger to timing weight ${f2(g)} mm (want -0.05..0.1); staff at ${f2(R.staff.rotation.y)} rad, ${byHn('42176').length} weights, ${fin.length} finger`]);
    click('#armSeg button[data-v="0"]');await wait(2000);const h2=H();
    out.push(['locking arm, unlocked',h2.amp===0&&h2.held,`unlocked, not started: amplitude ${f2(h2.amp)}, train held ${h2.held} (a detent chronometer doesn't start by itself)`]); }
  /* the twist (Sec. III): "a single quick twist" sets the balance swinging past the escapement's least amplitude, and the train runs */
  { click('#twist');await until(()=>H().amp>amin&&!H().held,60000);const h=H();out.push(['twist to start',h.amp>amin&&!h.held,`after the twist: amplitude ${f2(h.amp)} rad (least to unlock ${f2(amin)}), train held ${h.held}`]); }
  /* the train-blocking screw (Sec. II, Fig. 110): down, its dog point between the fourth wheel's spokes holds the train; raised, the train goes on */
  { click('#blkSeg button[data-v="1"]');await until(()=>H().held,60000);await wait(3000);const h=H(),E0=h.E;await wait(3000);const h1=H();   /* held, the wheel runs on to the spoke: then it stands */
    out.push(['train-blocking screw',h1.held&&h1.E===E0,`screwed down: train held ${h1.held}, escape wheel ${E0} then ${h1.E}`]);
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
  click('#speeds button[data-v="0"]');
  return out;}
