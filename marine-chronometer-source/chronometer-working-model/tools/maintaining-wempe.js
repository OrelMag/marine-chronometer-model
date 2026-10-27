/* maintaining-wempe.js: run in the Wempe's page by maintaining.py --model wempe (its first part). The Wempe's Harrison maintaining work (wempe/js/fusee.js) driven through
   run and wind cycles through the movement's own update (frozen, as audit.py freezes it, and set as app.js sets it: the escape wheel's place E, a tooth a beat, 7,200 an hour,
   and the fusee's turns from full wind n = hours / (90/14)), each frame measured on the built solids in the movement's frame:
   - the maintaining ratchet (05 06 02-1) never turns back (rotation.y falling: its steep faces meet the maintaining detent that way);
   - running, the fusee turns with the ratchet (the click wheel's face on a click's nose: fusee.js carries the fusee forward onto it), and the bearing click's nose is at
     least half the click wheel's teeth's depth into them; winding, the fusee turns back while the ratchet goes on; when the key lets go the fusee catches forward, by
     less than one of the click wheel's 35 teeth, never back;
   - both clicks (05 06 02-3) on the click wheel (05 06 04-3) and the maintaining detent (05 05 05-1) on the ratchet: never in their teeth, never off them (the least gap
     between the solids, signed: every vertex of each against the other's walls, inside by ray parity); the detent dropping at least half a tooth's depth into the gaps;
   - the detent's wire spring (05 05 06-1) bent by the detent and bearing on it.
   Returns JSON: the figures and the failures (each kind's first three). */
(()=>{const mv=window.__mv,FU=mv.userData.R.fu,T=THREE,TAU=2*Math.PI,D=180/Math.PI,fails=[],cnt={},fail=(k,m)=>{cnt[k]=(cnt[k]||0)+1;if(cnt[k]<=3)fails.push(k+': '+m);};
  if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const find=(id,sub)=>{const o=[];mv.traverse(m=>{if(m.isMesh&&m.userData.hn===id&&(sub===undefined||!!m.userData.sub===sub))o.push(m);});return o;};
  const vis=o=>{for(let h=o;h&&h!==mv;h=h.parent)if(!h.visible)return false;return true;};
  const RAT=find('050602-1',false).filter(vis)[0],CKS=find('050602-3'),CW=find('050604-3')[0],DET=find('050505-1').filter(vis),WIRE=find('050506-1')[0];
  if(!RAT||CKS.length!==2||!CW||!DET.length||!WIRE)return JSON.stringify({fails:['parts: the ratchet, two clicks, the click wheel, the detent and its wire not all found'],cnt:{parts:1}});
  const inv=new T.Matrix4(),loc=o=>{mv.updateMatrixWorld(true);inv.copy(mv.matrixWorld).invert();return new T.Matrix4().multiplyMatrices(inv,o.matrixWorld);};
  const ang=o=>{const e=loc(o).elements;return Math.atan2(e[8],e[0]);};   /* its turn about y in the movement's frame */
  /* a mesh's triangles in its own frame, each with its box */
  const TRI=new Map(),tri=o=>{if(TRI.has(o.geometry))return TRI.get(o.geometry);const g=o.geometry,p=g.attributes.position,ix=g.index?g.index.array:null,n=ix?ix.length:p.count,t=new Float64Array(n*3),bx=new Float64Array(n/3*6),bb=new T.Box3(),v=new T.Vector3();
    for(let i=0;i<n;i++){v.fromBufferAttribute(p,ix?ix[i]:i);t.set([v.x,v.y,v.z],3*i);bb.expandByPoint(v);}
    for(let k=0;k<n/3;k++){for(let a=0;a<3;a++){bx[6*k+a]=Math.min(t[9*k+a],t[9*k+3+a],t[9*k+6+a]);bx[6*k+3+a]=Math.max(t[9*k+a],t[9*k+3+a],t[9*k+6+a]);}}
    const r={t,bx,bb,n:n/3};TRI.set(o.geometry,r);return r;};   /* by geometry: the wire's is rebuilt as the detent rides (cached by mesh until 27 October 2026, so the wire was measured as first built) */
  /* the closest point on a triangle (Ericson, Real-Time Collision Detection 5.1.5): its distance */
  const cpt=(p,a,b,c)=>{const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ac=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],ap=[p[0]-a[0],p[1]-a[1],p[2]-a[2]],dt=(u,w)=>u[0]*w[0]+u[1]*w[1]+u[2]*w[2],ds=q=>Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]);
    const d1=dt(ab,ap),d2=dt(ac,ap);if(d1<=0&&d2<=0)return ds(a);const bp=[p[0]-b[0],p[1]-b[1],p[2]-b[2]],d3=dt(ab,bp),d4=dt(ac,bp);if(d3>=0&&d4<=d3)return ds(b);
    const vc=d1*d4-d3*d2;if(vc<=0&&d1>=0&&d3<=0){const v=d1/(d1-d3);return ds([a[0]+v*ab[0],a[1]+v*ab[1],a[2]+v*ab[2]]);}
    const cp=[p[0]-c[0],p[1]-c[1],p[2]-c[2]],d5=dt(ab,cp),d6=dt(ac,cp);if(d6>=0&&d5<=d6)return ds(c);
    const vb=d5*d2-d1*d6;if(vb<=0&&d2>=0&&d6<=0){const w=d2/(d2-d6);return ds([a[0]+w*ac[0],a[1]+w*ac[1],a[2]+w*ac[2]]);}
    const va=d3*d6-d5*d4;if(va<=0&&d4-d3>=0&&d5-d6>=0){const w=(d4-d3)/((d4-d3)+(d5-d6));return ds([b[0]+w*(c[0]-b[0]),b[1]+w*(c[1]-b[1]),b[2]+w*(c[2]-b[2])]);}
    const dn=1/(va+vb+vc),v=vb*dn,w=vc*dn;return ds([a[0]+ab[0]*v+ac[0]*w,a[1]+ab[1]*v+ac[1]*w,a[2]+ab[2]*v+ac[2]*w]);};
  /* inside a closed mesh: crossings of a slanted ray from the point, odd */
  const SL=[0.5773,0.5784,0.5762],inside=(R,q)=>{const t=R.t;let c=0;for(let i=0;i<t.length;i+=9){const ax=t[i],ay=t[i+1],az=t[i+2],e1=[t[i+3]-ax,t[i+4]-ay,t[i+5]-az],e2=[t[i+6]-ax,t[i+7]-ay,t[i+8]-az];
      const h=[SL[1]*e2[2]-SL[2]*e2[1],SL[2]*e2[0]-SL[0]*e2[2],SL[0]*e2[1]-SL[1]*e2[0]],a=e1[0]*h[0]+e1[1]*h[1]+e1[2]*h[2];if(Math.abs(a)<1e-12)continue;
      const f=1/a,s=[q[0]-ax,q[1]-ay,q[2]-az],u=f*(s[0]*h[0]+s[1]*h[1]+s[2]*h[2]);if(u<0||u>1)continue;const qq=[s[1]*e1[2]-s[2]*e1[1],s[2]*e1[0]-s[0]*e1[2],s[0]*e1[1]-s[1]*e1[0]],w=f*(SL[0]*qq[0]+SL[1]*qq[1]+SL[2]*qq[2]);
      if(w<0||u+w>1)continue;if(f*(e2[0]*qq[0]+e2[1]*qq[1]+e2[2]*qq[2])>1e-9)c++;}return c%2===1;};
  /* the least gap from A's vertices to B's solid (negative inside it), within CAP */
  const CAP=0.5,gap1=(A,B)=>{const R=tri(B),M=new T.Matrix4().copy(loc(B)).invert().multiply(loc(A)),P=A.geometry.attributes.position,v=new T.Vector3(),bb=R.bb.clone().expandByScalar(CAP);let best=CAP;
    for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(M);if(!bb.containsPoint(v))continue;const p=[v.x,v.y,v.z];let d=CAP;
      for(let k=0;k<R.n;k++){const b=R.bx;if(p[0]<b[6*k]-d||p[0]>b[6*k+3]+d||p[1]<b[6*k+1]-d||p[1]>b[6*k+4]+d||p[2]<b[6*k+2]-d||p[2]>b[6*k+5]+d)continue;
        const t=R.t,q=cpt(p,[t[9*k],t[9*k+1],t[9*k+2]],[t[9*k+3],t[9*k+4],t[9*k+5]],[t[9*k+6],t[9*k+7],t[9*k+8]]);if(q<d)d=q;}
      const s=R.bb.containsPoint(v)&&inside(R,p)?-d:d;if(s<best)best=s;}return best;};
  const gap=(A,B)=>{let g=CAP;for(const a of A)for(const b of B)g=Math.min(g,gap1(a,b),gap1(b,a));return g;};
  /* a ratchet's tips and roots (its own frame, centred on its axis): the outline's radii beyond r0 */
  const radii=(o,r0)=>{const P=o.geometry.attributes.position,v=new T.Vector3();let lo=1e9,hi=0;for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i);const r=Math.hypot(v.x,v.z);if(r>r0){lo=Math.min(lo,r);hi=Math.max(hi,r);}}return{root:lo,tip:hi};};
  const CWr=radii(CW,7.0),RTr=radii(RAT,17);
  /* how far into a ratchet's teeth a part reaches: its nearest vertex to the ratchet's axis, below the tips */
  const into=(A,W,Rr)=>{const M=new T.Matrix4().copy(loc(W)).invert(),v=new T.Vector3();let m=1e9;for(const a of A){const N=M.clone().multiply(loc(a)),P=a.geometry.attributes.position;
      for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(N);m=Math.min(m,Math.hypot(v.x,v.z));}}return Rr.tip-m;};
  const s0=ESC.state(0.4),HPT=90/14,TPH=7200,P35=TAU/35,P120=TAU/120,st={E:1000,n:3};let prev=null,k=0;
  const info={ck:[1e9,-1e9],det:[1e9,-1e9],wire:[1e9,-1e9],bear:[1e9,-1e9],detIn:[1e9,-1e9],catches:[],back:0,frames:0,runWith:0,wound:0};
  const mm=(a,x)=>{a[0]=Math.min(a[0],x);a[1]=Math.max(a[1],x);};
  function frame(w,tag){mv.userData._u({E:st.E+s0.prog,th:s0.th,lift:s0.lift,psDef:s0.psDef,n:st.n,winding:w,slip:0});k++;
    const at=`frame ${k} (${tag}, n ${st.n.toFixed(3)})`,cur={RG:ang(RAT),Rf:ang(CW),w};
    if(prev){const dG=Math.atan2(Math.sin(cur.RG-prev.RG),Math.cos(cur.RG-prev.RG)),dF=Math.atan2(Math.sin(cur.Rf-prev.Rf),Math.cos(cur.Rf-prev.Rf));
      if(dG<-1e-9){fail('ratchet back',`${at}: the maintaining ratchet turned back ${(-dG*D).toFixed(4)} deg`);info.back=Math.max(info.back,-dG);}
      if(!w&&!prev.w){if(Math.abs(dF-dG)>1e-6)fail('running',`${at}: the fusee turned ${(dF*D).toFixed(4)} deg, the ratchet ${(dG*D).toFixed(4)}: not together`);else info.runWith++;}
      if(w&&prev.w&&!(dF<0))fail('winding',`${at}: winding, the fusee turned ${(dF*D).toFixed(4)} deg (it turns back)`);
      if(w)info.wound++;
      if(!w&&prev.w){const c=dF-dG;info.catches.push(c*D);if(c<-1e-9||c>=P35)fail('catch',`${at}: the key let go, the fusee caught ${(c*D).toFixed(3)} deg against the ratchet (0 to ${(P35*D).toFixed(2)}, a click wheel's tooth)`);}}
    const gc=CKS.map(c=>gap([c],[CW])),gd=gap(DET,[RAT]),gw=gap([WIRE],DET);
    /* in their teeth: past 0.012, the precision fusee.js seats them to (seat() against a table of the outline's radius every 0.044 deg; for the maintaining detent the higher
       of the two rays about each angle and its outline every 0.01 since 27 October 2026, so it stays 0.01-0.025 off); the wire bearing within 0.025 (wireDef clears its section at the arm's upper face in four steps, which leaves it up to 0.019 in, 16 October 2026) */
    gc.forEach((g,i)=>{mm(info.ck,g);if(g<-0.012)fail('click',`${at}: click ${i} ${(-g).toFixed(3)} into the click wheel`);if(g>0.06)fail('click',`${at}: click ${i} ${g.toFixed(3)} off the click wheel`);});
    mm(info.det,gd);if(gd<-0.012)fail('detent',`${at}: the maintaining detent ${(-gd).toFixed(3)} into the ratchet`);if(gd>0.06)fail('detent',`${at}: the maintaining detent ${gd.toFixed(3)} off the ratchet`);
    mm(info.wire,gw);if(gw<-0.025||gw>0.025)fail('wire',`${at}: the wire spring ${gw.toFixed(3)} from the detent (bearing on it wanted)`);
    const wdef=(()=>{let d=null;mv.traverse(o=>{if(o.userData.partName==='maintDetent'&&o.userData.wire)d=o.userData.wire;});return d;})();
    if(!wdef||Math.hypot(wdef[0],wdef[1])<0.01)fail('wire',`${at}: the wire spring isn't bent by the detent (${wdef?Math.hypot(...wdef).toFixed(3):'none'})`);
    const din=into(DET,RAT,RTr)/(RTr.tip-RTr.root);mm(info.detIn,din);
    if(!w){const b=Math.max(...CKS.map(c=>into([c],CW,CWr)))/(CWr.tip-CWr.root);mm(info.bear,b);if(b<0.5)fail('bearing',`${at}: running, the bearing click only ${(b*100).toFixed(0)} % into the click wheel's teeth`);}
    prev=cur;info.frames=k;}
  const run=(N,dE)=>{for(let i=0;i<N;i++){st.E+=dE;st.n=Math.min(FU.NRUN,st.n+dE/TPH/HPT);frame(false,'running');}};
  const wind=(to,dn,dE=0.1)=>{while(st.n>to+1e-12){st.n=Math.max(to,st.n-dn);st.E+=dE;frame(true,'winding');}};
  /* running over four of the ratchet's teeth (386 escape teeth each: a 120th of the fusee wheel's turn), the detent riding them; a wind of half a turn, the clicks riding
     over the click wheel a tooth in seven frames; let go and run; wound to full; near run down and wound a little */
  run(60,25);wind(2.5,0.004);run(40,25);wind(1.2,0.013);run(20,40);wind(0,0.05);run(20,25);st.n=FU.NRUN-0.05;prev=null;frame(false,'slider');run(20,25);wind(FU.NRUN-0.4,0.006);run(20,25);
  if(info.detIn[1]<0.5)fail('detent',`the maintaining detent never more than ${(info.detIn[1]*100).toFixed(0)} % into the ratchet's gaps`);
  return JSON.stringify({fails,cnt,info:{...info,ck:info.ck,CW:CWr,RT:RTr,P35:P35*D}});})()
