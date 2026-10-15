// @ts-check
/* fusee.js: the Wempe Einheits-Chronometer's fusee, maintaining work, barrel, mainspring, chain and band (drawing groups 05 06 and 05 07, and the maintaining detent
   05 05 05), built from their sheets as last revised (the fusee body 05 06 04-2 of 27.2.48, its assembly 05 06 04 of 2.3.48, the click wheel 05 06 04-3 of 6.8.47, the
   maintaining ratchet 05 06 02-1 of 11.3.48, the barrel 05 07 01 of 20.4.48), as References/wempe/transcriptions/05-06-05-07-fusee-barrel.md reads them, checked on the
   sheets themselves; the stack along each arbor from the coloured section (Wempe_Einheitschronometer.jpg) where no sheet gives it (README, "How the fusee and barrel
   were measured").
   Part of the Wempe model (three.js r128). Declares only WFUSEE: WFUSEE.build(mv, M, K, FR, TR) adds the parts to the movement group (K: KIT.parts' makers; FR the frame's
   places, FR.click the barrel bridge's click; TR the train, whose centre pinion the fusee wheel drives) and returns {update, ...}: update(s, c) sets the fusee, its wheel,
   the maintaining work, the barrel, mainspring and chain or band from the escape wheel's place (through the centre arbor's angle c, rotation.y) and s.n, the fusee's
   turns from full wind (the Hamilton's MoveState: 0 fully wound, N_RUN run down), s.winding (the key on the square, the maintaining spring driving the train).
   Units mm, the movement frame (dims.js): dial side +y, 12 o'clock -z, 3 o'clock +x. Angles about an arbor in the frame rotation.y turns: a point at angle a, radius r lies
   at [r cos a, -r sin a] in plan (x, z), and rotation.y = g puts it at a + g; a running fusee turns rotation.y up (anticlockwise from the dial), as its wheel, which drives
   the centre pinion the other way (train.js). Outlines given to extrude() are in the shape's own (x, y), where that angle is the polar angle (y = -z). */
const WFUSEE=(()=>{
  const H=WD.H,TI=-WD.INNER,TT=TI-WD.TOP_T,PPT=WD.PP_T,V2=(a,b)=>new THREE.Vector2(a,b),{solidGeo,ring,sdfOutline}=KIT;
  const FX=H[10],BX=H[45],DX=H[4],SPX=H[7];   /* the fusee's, barrel's, maintaining detent's and stop pin's holes */
  const pol=(r,a)=>[r*Math.cos(a),-r*Math.sin(a)],angOf=(x,z)=>Math.atan2(-z,x),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a)),fr=x=>x-Math.floor(x);
  const sh=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];   /* a point of a shape's outline (x, y): its polar angle is the angle above */
  /* ---------- the stack (y), every height from a sheet or from the figures beside it (README) ----------
     The fusee arbor 05 06 04-1: 19.7 +0.05 between its shoulders, the dial-side one 0.025 off the pillar plate's inner face, the other 0.025 under the fusee bush (whose end is
     0.05 under the top plate's J-K recess floor, 19.75 from the pillar plate: frame.js). The Vorreiber's pin (05 06 00-5) through the arbor's cross hole, 2 from the dial
     shoulder (05 06 04-1's 19.7 less 17.7), its centre 1.1 from the Vorreiber's hub face (05 06 00-2; the coloured section draws it so), so the hub face 0.9 off the shoulder;
     its face a, re-turned at the fusee's assembly ("bei Schneckenmontage ... Fläche a nachdrehen"), 2.9 from the hub face (the sheet's 3.1 -0.2, its flange 1.2 -0.2 taken to 1.0),
     carries the fusee wheel's underside recess (05 06 00-3: 14 +0.1, 1.3 -0.1 deep), so the wheel's underside 2.5 off the plate. On the wheel, the maintaining spring (1.3,
     in its 32.3 recess on the web, 1.22), then the maintaining ratchet 0.05 over the wheel's rim (2.62), its teeth at 5.2-6.2 off the plate, where the maintaining detent's
     tip lies (05 05 05: its upper face 6.3 ±0.1 from its lower shoulder, the tip 1 thick at that face); the fusee body's large end 0.05 over the ratchet's plate, its cup
     inside the body's recess (Ø 26.3 × 2.7); the click wheel on the recess's floor, at the clicks' height in the cup; the body (12.55: 05 06 04-2's 12.6 -0.1) to its small
     end, the cover plate (0.8) on it, 0.085 under the J-K recess's floor */
  const yD=-0.025,yT=yD-19.7;                              /* the fusee arbor's shoulders */
  const VHF=yD-0.9,VFA=VHF-2.9,VFB=VHF-1.9;                  /* the Vorreiber's hub face, face a, the flange's lower face */
  const W=VFA+1.3,WT=W-2.62,WW=W-1.22,WL=W-2.42,WTB=W-5.0;   /* the fusee wheel: underside, rim/hub top, web top, ledge top, its tube's top */
  const GS0=WW,GS1=WW-1.3;                                   /* the maintaining spring */
  const G=WT-0.05,GP=G-1.02,GC=G-3.1;                        /* the maintaining ratchet: underside, plate top (the cup's floor), the cup's rim */
  const F=GP-0.05,LB=12.55,S=F-LB,FRC=F-2.7;                 /* the fusee body: large end face, length, small end face, the large end's recess floor */
  const CW0=FRC,CW1=FRC+2;                                   /* the click wheel, on the recess floor */
  const DP0=S-0.8;                                           /* the cover plate (Deckplatte), S to DP0 */
  const DTU=yD-6.3,DTL=DTU+2,DTT=DTU+1;                      /* the maintaining detent: upper face, lower face (its thick part), the tip's lower face (thin, 1, at the upper face) */
  const BB=-3.65,BR=BB-18.08,BI=BB-1.25,BBF=BB-3.1,BLT=BR+0.6,BLU=BLT+1.3,BLF=BLT+3.3;   /* the barrel: bottom's outer face, rim, bottom's inner face, its boss's face, the lid's top, underside, boss face */
  const BA0=-0.03,BA1=-22.32,BC0=BBF-0.05,BC1=BLF+0.05;       /* the barrel arbor's shoulders (22.29 apart, 22.2 +0.1: 0.06 endshake) and its core's ends, 0.05 off the bosses */
  const RS0=TT-3.32-0.05,RS1=RS0-2.65;                       /* the set-up ratchet, beside the click on the barrel bridge */
  const MS0=BI-0.065,MS1=BLU+0.065;                          /* the mainspring's edges (14.8 high) */

  /* ---------- the fusee's curve: the groove's floor radius by turns m from the large end (05 06 04-2's "Grund" radii, the same as 05 06_20's whole turns but its 10.04 at
     turn 6, where the body's 10.07 is taken; between them 05 06_20's curve scaled at quarter turns, less 0.035, which it runs above the written values: scaled) ---------- */
  const RFT=[17.25,16.465,15.785,15.215,14.75,14.305,13.935,13.585,13.32,12.975,12.685,12.415,12.17,11.915,11.675,11.455,11.24,11.055,10.865,10.705,10.55,10.405,10.275,10.155,
    10.07,9.945,9.855,9.78,9.71,9.635,9.575,9.525,9.47,9.435,9.395,9.355,9.30];
  const rf=m=>{const u=Math.max(0,Math.min(36,m*4)),i=Math.min(35,Math.floor(u));return RFT[i]+(RFT[i+1]-RFT[i])*(u-i);};
  /* the groove: square-cut, its lands 0.82 wide (the pencilled pitch 1.15 of 02-1 less the rib 0.33 of 02-2, the chain's framed 0.82 ±0.02), each with a rib 0.33 thick on its
     small-end side standing 0.6 over it ("alle Maße: +0,6"); a helix, a land's middle at a_c(m) from the large end face, so the full wind's turn (8.75) ends 0.3 from the small
     end ("Gangende Punkt N"); the first 0.15 turn rises from the flange's slot (where the chain's end is pinned) into the first turn */
  const PAX=1.15,WLD=0.82,RIB=0.33,RIBH=0.6,A0=LB-0.3-WLD/2-PAX*8.75,M_FULL=8.75;
  const ac=m=>m<0.15?1.0+(A0+PAX*0.15-1.0)*Math.max(0,m)/0.15:A0+PAX*m;
  const yc=m=>F-ac(m);
  /* the fusee's radius field: the flange (Ø 35.6, its two ribs and the slot between them, 0.8 wide, floor r 17.25), the slot deepened under the chain's pin (a cutter Ø 13.5,
     2.9 deep), the groove, and the small end's hub (Ø 21) for the last 0.3 */
  /* the chain's pin (A on the sheet's view C-D) at PHI0-0.17, just behind the groove's start, 1 under the ribs' tops (the view's "1"), in the middle of the cutter's arc (the view
     centres the arc on A): section A-B, through the pin, draws both ribs whole to their tops with the pin's hole across them and the slot between them about 2.8 deep (scaled),
     so the cutter is a slitting cutter in the slot, deepening it where the hook wraps the pin, not a flat across the ribs */
  const PHI0=0,PINA=PHI0-0.17,PINR=16.8,FLAT=PINA,RC=17.8-2.9+6.75;
  const rCut=th=>{const d=wrap(th-FLAT),q=RC*Math.sin(d);if(Math.abs(q)>=6.75||Math.cos(d)<0)return 99;return RC*Math.cos(d)-Math.sqrt(6.75*6.75-q*q);};
  function rBody(th,a){
    if(a>=LB-0.3-1e-9)return 10.5;
    let r=a<0.6?17.8:a<1.4?17.25:17.8;
    if(a>=0.9){const mt=fr((th-PHI0)/TAU);let j=Math.floor((a-(ac(mt)-WLD/2))/PAX),m=mt+j;
      while(m+1>=0.15&&a>=ac(m+1)-WLD/2)m+=1;while(m>=0&&a<ac(m)-WLD/2)m-=1;   /* the turn whose land (or rib) holds a */
      if(m>=0){const d=a-(ac(m)-WLD/2);if(d<WLD)r=rf(m);else if(a>=1.4||m>0.3)r=Math.min(r,rf(m)+RIBH);}}
    if(a>=0.6&&a<1.4)r=Math.min(r,rCut(th));   /* in the slot only */
    return r;}

  /* ---------- helpers ---------- */
  const turned=(P,seg=32)=>new THREE.LatheGeometry(P.map(([r,y])=>V2(r,y)),seg);   /* listed from one end on the axis to the other, y rising */
  const ringT=(P,seg=48)=>new THREE.LatheGeometry([...P,P[0]].map(([r,y])=>V2(r,y)),seg);   /* a closed loop counterclockwise in r, y */
  const shapeOf=(xy,holes=[])=>{const s=new THREE.Shape();s.moveTo(xy[0][0],xy[0][1]);for(let i=1;i<xy.length;i++)s.lineTo(xy[i][0],xy[i][1]);s.closePath();
    for(const h of holes){const p=new THREE.Path();if(h.c){p.absarc(h.c[0],h.c[1],h.r,0,TAU,true);}else{p.moveTo(h[0][0],h[0][1]);for(let i=1;i<h.length;i++)p.lineTo(h[i][0],h[i][1]);p.closePath();}s.holes.push(p);}return s;};
  /* an outline (shape coordinates) extruded from y0 to y1 (y0 < y1), one closed solid */
  const slab=(xy,holes,y0,y1,cs=24)=>{const g=extrude(shapeOf(xy,holes),{depth:y1-y0,bevelEnabled:false,curveSegments:cs});g.rotateX(-Math.PI/2);g.translate(0,y0,0);return g;};
  /* a closed ribbon along points P (THREE.Vector3), w across (along the horizontal normal to the path) and h high (centred on each point's y); ends capped */
  function ribbonGeo(P,w,h){const n=P.length,pos=new Float32Array(n*4*3),idx=[],up=new THREE.Vector3(0,1,0),t=new THREE.Vector3(),q=new THREE.Vector3();
    for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)];t.subVectors(b,a);t.y=0;t.normalize();q.crossVectors(t,up).normalize();   /* the in-plane normal (right of the path) */
      const p=P[i];[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([s,u],k)=>{pos[(i*4+k)*3]=p.x+q.x*s*w/2;pos[(i*4+k)*3+1]=p.y+u*h/2;pos[(i*4+k)*3+2]=p.z+q.z*s*w/2;});}
    for(let i=0;i<n-1;i++)for(let k=0;k<4;k++){const a=i*4+k,b=i*4+(k+1)%4,c=(i+1)*4+(k+1)%4,d=(i+1)*4+k;idx.push(a,b,c,a,c,d);}
    idx.push(0,3,2,0,2,1);const e=(n-1)*4;idx.push(e,e+1,e+2,e,e+2,e+3);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(idx);
    /* wound to face out: turned over if the volume comes out negative */
    let v=0;const A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3();for(let i=0;i<idx.length;i+=3){A.fromArray(pos,idx[i]*3);B.fromArray(pos,idx[i+1]*3);C.fromArray(pos,idx[i+2]*3);v+=A.dot(B.cross(C));}
    if(v<0){for(let i=0;i<idx.length;i+=3){const s=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=s;}g.setIndex(idx);}
    g.computeVertexNormals();return g;}
  /* the outermost radius of an outline (shape coordinates, about the origin) along each ray: a lookup of N rays, for a pawl to be seated on it from outside */
  function polarMax(xy,N=4096){const R=new Float32Array(N);for(let k=0;k<N;k++){const a=k/N*TAU,c=Math.cos(a),s=Math.sin(a);let best=0;
      for(let i=0;i<xy.length;i++){const p=xy[i],q=xy[(i+1)%xy.length],dx=q[0]-p[0],dy=q[1]-p[1],den=c*dy-s*dx;if(Math.abs(den)<1e-12)continue;
        const t=(p[0]*dy-p[1]*dx)/den,u=(p[0]*s-p[1]*c)/den;if(t>0&&u>=0&&u<=1)best=Math.max(best,t);}R[k]=best;}
    return a=>{const u=fr(a/TAU)*N,i=Math.floor(u)%N,j=(i+1)%N;return R[i]+(R[j]-R[i])*(u-Math.floor(u));};}
  /* a pawl seated on a ratchet: the pawl turns about P (shape coordinates, the ratchet's centre at the origin, turned rho), its tip at v from P when the pawl is at 0; from
     g0 (the tip clear outside the teeth) toward g1 (inside the roots), the first angle where the tip (or any point of the outline given) meets the teeth (rp, the ratchet's
     outer radius by its own angle) */
  function seat(rp,rho,P,v,g0,g1){const pts=typeof v[0]==='number'?[v]:v,tip=(g,q)=>{const c=Math.cos(g),s=Math.sin(g);return[P[0]+q[0]*c-q[1]*s,P[1]+q[0]*s+q[1]*c];},
      f=g=>{let m=9;for(const q of pts){const t=tip(g,q);m=Math.min(m,Math.hypot(t[0],t[1])-rp(Math.atan2(t[1],t[0])-rho));}return m-0.02;};   /* v: the tip, or the pawl's whole outline: its nearest point 0.02 off the teeth */
    if(f(g0)<=0&&f(g1)>0){const t=g0;g0=g1;g1=t;}
    const N=64;let a=g0,fa=f(a);for(let i=1;i<=N;i++){const b=g0+(g1-g0)*i/N,fb=f(b);if(fa>0&&fb<=0){let lo=a,hi=b;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m;}return lo;}a=b;fa=fb;}return g1;}
  /* a ratchet's outline (shape coordinates): z teeth, tips rt, roots rr; dir +1: each tooth's steep face meets a pawl when the ratchet turns back (rotation.y falling), the
     back falling from one tip to the next root as the angle rises; -1: the steep face drives a pawl forward (rising), the back rising to each tip. lean: the face's lean, rad
     (positive: the tip overhanging the root), fw: the face's width at the root as a fraction of a pitch (0: radial) */
  function ratchet(z,rt,rr,dir,lean=0,nb=6){const P=TAU/z,o=[];
    for(let k=0;k<z;k++){const a=k*P;
      if(dir>0){o.push(sh(rt,a));for(let i=1;i<=nb;i++){const f=i/nb,b=a+P*f;o.push(sh(rt+(rr-rt)*f,b-(i===nb?Math.max(0.004,lean):0)));}}   /* tip, back down to the root just short of the next tip */
      else{o.push(sh(rr,a+lean));for(let i=1;i<=nb;i++){const f=i/nb;o.push(sh(rr+(rt-rr)*f,a+lean+(P-lean)*f));}}}   /* root (the face's foot, behind its tip by lean), back up to the next tip */
    return o;}

  /* ---------- the going train's tooth form, as train.js draws it (copied: train.js keeps its helpers to itself) ---------- */
  function teeth(z,m,D,dg,mate,l){const rp=m*z/2,ro=D/2,ri=dg/2,p=TAU/z,pts=[];
    const b=l/2/rp,rg=m*mate/4,K=(rp+rg)/rg,ep=[],E=t=>{const x=(rp+rg)*Math.cos(t)-rg*Math.cos(K*t),y=(rp+rg)*Math.sin(t)-rg*Math.sin(K*t);return[Math.hypot(x,y),Math.atan2(y,x)];};
    let t1=0;while(t1<1.5){const[r,a]=E(t1+1e-4);if(a>=b||r>=ro)break;t1+=1e-4;}
    for(let k=0;k<=16;k++){const[r,a]=E(t1*k/16);ep.push(k<16?[r,a]:[Math.min(r,ro),Math.min(a,b)]);}
    for(let i=0;i<z;i++){const c=i*p+0.375*p;pts.push([ri,c-b]);for(const[r,a]of ep)pts.push([r,c-b+a]);for(let k=ep.length-1;k>=0;k--){const[r,a]=ep[k];if(a<b-1e-9||k<ep.length-1)pts.push([r,c+b-a]);}
      pts.push([ri,c+b]);for(let k=1;k<3;k++)pts.push([ri,c+b+(p-2*b)*k/3]);}
    return{xy:pts.map(([r,a])=>[r*Math.cos(a),r*Math.sin(a)]),ro,ri};}

  /* ---------- the chain and the band: what lies where along their pitch lines ----------
     The chain 05 07 04: figure-of-eight plates 4.05 × 2 (framed), riveted at a 2.05 pitch (framed) three deep, 0.82 ±0.02 across (framed: drawn 0.80, three plates 0.26 and
     two gaps 0.01), standing 2 high on the drums, its pitch line 1.02 out from the groove's floor and the barrel's wall; 780 +3 over its two hooks, the top hook's first rivet
     5 from its end and the bottom hook's last 7.5: 767.5 between them, about 374.4 pitches, drawn 375 (781.25 over all, within the +3) so the chain ends in an outer link at
     both ends, each hook riveted between its two plates; the bottom hook's barb 5 past the last rivet. The band 05 07 03: 0.22 +0.03 thick
     (drawn 0.22), 0.78 wide (no figure: its hooks' strip is 10 × 0.8, and it runs in the groove's 0.82 land: estimated), its middle 0.12 out; 730 ±3 from the round
     hook's shoulder to the drum hook's barb, the round hook 3 long from the fusee's pin to where the band starts */
  const CONN={chain:{of:1.02,ob:1.02,PC:2.05,NJ:375,barb:5.0},band:{of:0.12,ob:0.12,len:727}};
  CONN.chain.len=CONN.chain.NJ*CONN.chain.PC+CONN.chain.barb;
  const RB=20.8,DFB=Math.hypot(BX[0]-FX[0],BX[1]-FX[1]),PSID=angOf(BX[0]-FX[0],BX[1]-FX[1]);   /* the drum's outside radius (Ø 41.6 -0.1, 05 07 01-1); the drums' centres apart; the line between them */
  /* The chain runs from the fusee's south side to the barrel's north side, across between the drums (their inner common tangent), so the barrel turns against the fusee:
     running, the fusee turns anticlockwise from the dial (its wheel drives the centre pinion, clockwise) and the barrel clockwise. Three things say so (README): the set-up
     ratchet and click on Wempe 3955 and Lange 5177 (2_Wempe_3955_A.jpg, 2_Lange_5177_A.jpg) hold the barrel arbor against turning anticlockwise from the dial, which is how a
     barrel turning clockwise pulls it; sheet 001 draws the chain on the barrel's far side from the fusee; and a run along the drums' south side would pass through the lower
     balance cock (fine.py), along their north side it would turn the fusee the wrong way. The normal at the fusee's tangent point (the barrel's point is opposite, on its north) */
  const tan=(rfp,rbp)=>PSID-Math.acos((rfp+rbp)/DFB);
  /* each connector's geometry along its pitch line: Lf(m) the length wound on the fusee to turn m, its inverse, the fusee's turn m0 where it leaves at the fusee's angle Rf
     (rotation.y), and from there the run to the barrel and the barrel's turn (beta) that keeps the length */
  function connGeo(c,RF0x){const NM=Math.round(9.2*144),Lf=new Float64Array(NM+1);
    for(let i=1;i<=NM;i++){const m0=(i-1)/144,m1=i/144,r0=rf(m0)+c.of,r1=rf(m1)+c.of,da=TAU/144;Lf[i]=Lf[i-1]+Math.hypot(da*(r0+r1)/2,ac(m1)-ac(m0));}
    const lf=m=>{const u=Math.max(0,m)*144,i=Math.min(NM-1,Math.floor(u));return Lf[i]+(Lf[i+1]-Lf[i])*(u-i);};
    const mOf=s=>{let lo=0,hi=NM;if(s<=0)return 0;if(s>=Lf[NM])return 9.2;while(hi-lo>1){const k=(lo+hi)>>1;if(Lf[k]<=s)lo=k;else hi=k;}return(lo+(s-Lf[lo])/(Lf[hi]-Lf[lo]))/144;};
    const rbp=RB+c.ob,psiT=m=>tan(rf(m)+c.of,rbp);
    const RF0=RF0x??psiT(M_FULL)-PHI0-TAU*M_FULL;   /* the fusee's rotation.y fully wound: the chain's leaving point at the full wind's turn (the band's the same: the stop sets it) */
    const m0Of=Rf=>{let m=M_FULL-(Rf-RF0)/TAU;for(let i=0;i<4;i++)m=(psiT(Math.max(0,m))-PHI0-Rf)/TAU;return Math.max(0,Math.min(M_FULL+0.05,m));};
    const runOf=m0=>{const psi=psiT(m0),rfp=rf(m0)+c.of,A=pol(rfp,psi),B=pol(rbp,psi+Math.PI);return{psi,S:Math.hypot(BX[0]+B[0]-FX[0]-A[0],BX[1]+B[1]-FX[1]-A[1])};};
    return{lf,mOf,rbp,psiT,RF0,m0Of,runOf,NRUN:(psiT(0)-PHI0-RF0)/TAU};}

  /* ================================================================= the build ================================================================= */
  function build(mv,M,K,FRP,TR){const{part,loose}=K,P=K.parts,tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined),fx=FX[0],fz=FX[1];
    const grp=(par,x,z)=>{const g=new THREE.Group();g.position.set(x,0,z);par.add(g);return g;};

    const SB={d:5.0,lo:-11.6,hi:10.9,tr:3.6};   /* its middle line 5 from the axis (the slot's near edge 4), its ends retracted 11.6 and 10.9 along it from there (C-D, scaled), its travel */
    /* its turn on the fusee (barRot), so its upper end, slid out, meets the pin at full wind: the fusee turns back (rotation.y falling) while winding, so the end comes round onto
       the pin from the larger angle; the end's round (r 1) centre at SB.hi + travel - 1 along the bar */
    const SPA=angOf(SPX[0]-fx,SPX[1]-fz),SPR=Math.hypot(SPX[0]-fx,SPX[1]-fz),SBE=[SB.hi+SB.tr-1.0,SB.d],SBre=Math.hypot(...SBE),SBdA=Math.acos((SBre*SBre+SPR*SPR-(1.0+0.8+0.02)**2)/(2*SBre*SPR));
    const SBtipA=Math.atan2(SB.d,SB.lo);   /* the lower end's point, in the bar's frame (retracted) */
    /* the chain's and the band's runs (connGeo), and from them the drum's turns: the end's angle in the drum set so the drum stands at 0 fully wound (BLK0), and its turn at run down */
    const CG={chain:connGeo(CONN.chain)};CG.band=connGeo(CONN.band,CG.chain.RF0);
    /* on the barrel the chain runs on from its tangent point the way the barrel turns back (rotation.y falling) to its hook: the drum stands at 0 fully wound */
    const BLK0={},BETA_RUN={};for(const k of['chain','band']){const cg=CG[k],mf=cg.m0Of(cg.RF0),run=cg.runOf(mf),sT=cg.lf(mf)+run.S;BLK0[k]=run.psi+Math.PI-(CONN[k].len-sT)/cg.rbp;
      const r0=cg.runOf(0),s0=cg.lf(0)+r0.S;BETA_RUN[k]=r0.psi+Math.PI-(CONN[k].len-s0)/cg.rbp-BLK0[k];}
    /* the bar's turn: its end at the pin at full wind (the chain's full-wind turn; the band's is the same, their runs leaving the fusee along the same line) */
    const barRot=SPA+SBdA-CG.chain.RF0-Math.atan2(SBE[1],SBE[0]);
    const mTip=(()=>{const u=(barRot+SBtipA-PHI0)/TAU;return M_FULL-fr(M_FULL-u);})();

    /* =============== the fusee (Schnecke 05 06 04) =============== */
    const pF=part('fusee',-33),gF=grp(pF,fx,fz);
    /* the body 05 06 04-2 (Schneckenkörper, as revised 27.2.48; Rundmessing 36, Ms 58): a lathe whose outer surface is pushed out to the radius field above (rBody): the
       flange Ø 35.6 -0.1 (drawn 35.6) with its two ribs and the slot, the groove's nine turns, the hub at the small end. Inside: the large end's recess Ø 26.3 +0.2 (drawn
       26.3), 2.7 deep to the 9.9 -0.1 from the small end, entered by a 45° chamfer from Ø 29.8 (revision a); the bore 7 H7 (drawn 7.006) to the small end's recess Ø 15, 1.6
       +0.1 deep. Its M2 holes for the click wheel's screws and the cover plate's M1.7 aren't cut (a lathe can't be holed across): the screws lie in it (README). Gilt, as
       Wempe 3955's (8_Wempe_3955_Räderwerk_plus.jpg) */
    {const PH=99,col=[];for(let a=LB;a>-1e-9;a-=0.04)col.push([PH,F-Math.max(0,a)]);if(col[col.length-1][1]!==F)col.push([PH,F]);
      const pr=[[7.5,S],...col,[14.9,F],[13.15,F-1.75],[13.15,FRC],[7.006/2,FRC],[7.006/2,S+1.6],[7.5,S+1.6],[7.5,S]];
      const g=new THREE.LatheGeometry(pr.map(([r,y])=>V2(r,y)),216),p=g.attributes.position;
      for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),r=Math.hypot(x,z);if(r<PH-1)continue;const th=angOf(x,z),R=rBody(th,F-p.getY(i));p.setX(i,R*Math.cos(th));p.setZ(i,-R*Math.sin(th));}
      g.computeVertexNormals();tag(mesh(gF,g,M.gilt),'050604-2');}
    /* the arbor 05 06 04-1 (Schneckenwelle; Präz. Rundstahl 7,5, polished where marked): from the winding end, the square 3.17 r6 at its root tapering 1:100 (to the sheet's
       2.92 at its point), 20.3 long, the journal Ø 4.5 ±0.02 at the shoulder to 4.39 (1:70, 8 long) that runs in the fusee bush, the step Ø 6.1 -0.05 (3.1 +0.05) for the
       cover plate, the collar Ø 7.04 -0.01 (7.9) pressed into the body's bore, the Vorreiber's seat 4.5 ±0.02 to 4.38 (1:70), 8.7, the cross hole 1.1 for its pin 17.7 -0.05
       from the far shoulder, the dial-side pivot Ø 2.8 ±0.02 to 2.7 (1:70, 6.5 +0.1) in the pillar plate, and the stub Ø 1.6 +0.1/+0.05 for the up-and-down pinion (05 02 00-5,
       the motion work's), its end 0.25 under the dial: the sheet's 60.6 overall counts the two lathe centres, cut off at the dial end (the coloured section ends the arbor under
       the pinion), drawn as a short point at the square's end */
    {const rS=yT+19.7;   /* = yD */
      tag(mesh(gF,turned([[0,yT-8],[2.195,yT-8],[2.25,yT],[3.05,yT],[3.05,yT+3.1],[3.52,yT+3.1],[3.52,yT+11.0],[2.25,yT+11.0],[2.19,rS],[1.4,rS],[1.3536,rS+6.5],[0.8375,rS+6.5],[0.83,9.85],[0.6,10.1],[0,10.1]],40),M.steel),'050604-1');
      const sq=new THREE.CylinderGeometry(3.17/Math.SQRT2,2.977/Math.SQRT2,19.3,4,1);sq.translate(0,yT-8-9.65,0);tag(mesh(gF,sq,M.steel),'050604-1',1);
      const pt=new THREE.CylinderGeometry(2.977/Math.SQRT2,0.3,1.0,4,1);pt.translate(0,yT-27.3-0.5,0);tag(mesh(gF,pt,M.steel),'050604-1',1);}
    /* the click wheel 05 06 04-3 (Schneckensperrrad, 6.8.47; Ms Blech 2, Ms 58 federhart): 35 teeth, tips Ø 16.0 -0.05, roots Ø 14.5 -0.2 (drawn 15.99, 14.4), the faces undercut
       8°, driving the maintaining clicks forward; bore 7.5 +0.05; 2 -0.1 thick (drawn 1.95); its three holes Ø 2, opened 1:8 toward its free face for the screws' heads, on Ø
       11.5 ±0.05 at 120°; on the large end's recess floor, screwed into the body's M2 holes */
    const P35=TAU/35,CWO=ratchet(35,15.99/2,14.4/2,-1,(15.99-14.4)/2*Math.tan(8*D2R)/7.2,5),cwR=polarMax(CWO),CWH=[0,1,2].map(k=>sh(5.75,PHI0+0.3+k*TAU/3));
    {const T=(p,r0,r1)=>({p:ring(p[0],-p[1],r0,40),q:ring(p[0],-p[1],r1,40),a:CW0-0.0,b:CW1-0.05});
      tag(mesh(gF,solidGeo([{loop:CWO.map(([x,y])=>[x,-y]),y0:CW0,y1:CW1-0.05,F:[{p:ring(0,0,7.525/2,96),a:CW0,b:CW1-0.05},...CWH.map(c=>T(c,1.0,1.125))]}]),M.brass),'050604-3');}
    /* its screws (WN-19): heads turned to the holes' 1:8, flush in the wheel, M2 6 into the body (its M2 6 +0.5 deep); the heads' slots */
    for(const c of CWH){tag(mesh(gF,turned([[0,CW0-3.8],[0.85,CW0-3.8],[1.0,CW0-3.6],[1.0,CW0],[1.125,CW1-0.05],[0,CW1-0.05]],20),M.steel,c[0],0,-c[1]),'WN-19');   /* in the fusee's own group, as its body: fixed to it */
      const sl=tag(mesh(gF,new THREE.BoxGeometry(2.0,0.35,0.3),M.steelD,c[0],CW1-0.05+0.02-0.175,-c[1]),'WN-19',1);sl.rotation.y=0.7;}
    /* the cover plate 05 06 00-4 (Deckplatte; Bandstahl 24 × 1): Ø 21.1 -0.1, 0.8 -0.1 thick (drawn 0.8), its hole 6.1 H8 on the arbor's step, a 0.4 -0.1 step round it in the
       face on the body (out to r 4.7, scaled: the sheet's figure gives the depth only), one screw hole Ø 1.85 -0.1 at 6 ±0.05 from the centre sunk 90° to Ø 3.1 +0.1; the
       outer edge's 45° and the hole's 60° chamfers are left out. Over the stop bar's slot, which runs under it */
    const pDP=part('coverPlate',-38),gDP=grp(pDP,fx,fz),DPS=sh(6,barRot-Math.PI/2);   /* the screw on the side away from the stop bar's slot (05 06_4, C-D) */
    {const sp=ring(DPS[0],-DPS[1],0.875,48),y0=DP0,y1=S;
      tag(mesh(gDP,solidGeo([{loop:ring(0,0,21.05/2,240),y0,y1,F:[{p:ring(0,0,6.109/2,96),a:y0,b:y1},{p:ring(0,0,4.7,120),a:y1-0.35,b:y1},{p:ring(DPS[0],-DPS[1],1.575,48),q:sp,a:y0,b:y0+0.7},{p:sp,a:y0,b:y1}]}]),M.steel),'050600-4');}
    /* its screw (WN-20 in the coloured section, its sheet not in the set): a 90° countersunk head Ø 3.1 flush in the plate, M1.7 across the small end's recess and 3.5 into the
       body (its M1.7 6 deep): estimated */
    {const g=new THREE.Group();g.position.set(DPS[0],0,-DPS[1]);gDP.add(g);tag(g,'WN-20');
      mesh(g,turned([[0,DP0],[1.55,DP0],[0.85,DP0+0.7],[0.85,S+1.6+3.3],[0.7,S+1.6+3.5],[0,S+1.6+3.5]],20),M.steel);const sl=mesh(g,new THREE.BoxGeometry(2.3,0.25,0.28),M.steelD,0,DP0+0.125-0.02,0);sl.rotation.y=1.1;}   /* the slot, standing 0.02 out of the head's face as screw() draws them */
    /* the chain's pin 05 06 00-6 (Kettenstift, coloured section; the hole "0,55∅ +0,01" through the flange's ribs, 05 06 04-2): Ø 0.55 across the slot, near the ribs' tops,
       where the chain's (or the band's) hook takes it */
    {const q=pol(PINR,PINA);tag(cylBetween(gF,0.275,F,F-2.0,M.steel,q[0],q[1],16),'050600-6');}

    /* =============== the Vorreiber 05 06 00-2 and its pin 05 06 00-5 =============== */
    /* Präz. Rundstahl 14: the flange Ø 14 d11 (drawn 13.895), the hub Ø 7.6 -0.2 (drawn 7.5), 3.1 -0.2 overall (face a re-turned at the fusee's assembly: 2.9, the flange 1.0),
       the bore 4.4 H7 at the flange to 4.36 at the hub (1:70) pressed on the arbor's seat (drawn 0.01 clear of it, its facets apart from the arbor's), a recess Ø 9.9 +0.2 ×
       0.4 +0.05 in face a and a 0.3 × 45° chamfer at the flange's edge on that side; the pin's hole Ø 0.8, its centre 1.1 ±0.1 from the hub face. It holds the fusee wheel
       on the arbor from below, its flange in the wheel's underside recess. Steel */
    const pV=part('vorreiber',-14),gV=grp(pV,fx,fz);
    {const rb=y=>2.19+(yD-y)*(0.06/8.7)+0.01;
      tag(mesh(gV,ringT([[rb(VFA+0.425),VFA+0.425],[4.975,VFA+0.425],[4.975,VFA],[6.6475,VFA],[6.9475,VFA+0.3],[6.9475,VFB],[3.75,VFB],[3.75,VHF],[rb(VHF),VHF]],96),M.steel),'050600-2');
      /* the pin (Vorreiberstift, no sheet in the set): Ø 0.8 through the hub and the arbor's cross hole, drawn as its two ends in the hub (the arbor isn't holed) */
      const r0=rb(VHF-1.1)+0.01,r1=3.75;
      for(const s of[1,-1]){const f=PHI0+0.9+(s>0?0:Math.PI),d=new THREE.Vector3(Math.cos(f),0,-Math.sin(f)),m=tag(mesh(gV,new THREE.CylinderGeometry(0.4,0.4,r1-r0,12),M.steel),'050600-5',s<0);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d);m.position.copy(d).multiplyScalar((r0+r1)/2).setY(VHF-1.1);}}   /* each end's own y along the pin, for its axis */

    /* =============== the dust plate 05 06 00-1 (Staubplatte) on the winding square =============== */
    /* Rundmessing 8: Ø 7.6 -0.1, 3.1 -0.2 (drawn 3.0), its square hole 3.1 H7 tapered 1:100 like the square, so it sits where the square is 3.1 across: 7 from its root; a
       recess Ø 6.2 +0.1, 1.0 deep, in its face toward the plates (which face isn't drawn: estimated); the other face's 0.5 × 45° chamfer left out. It turns in the dust bush */
    const pSP=part('dustPlate',-70),gSP=grp(pSP,fx,fz);
    {const y0=yT-8-7.0,y1=y0+3.0,a=3.12/Math.SQRT2+0.01,sq=[[0,a],[a,0],[0,-a],[-a,0]].map(([x,z])=>[x,z]);   /* the square's corners on x and z, as CylinderGeometry's 4 sides lie */
      tag(mesh(gSP,solidGeo([{loop:ring(0,0,7.55/2,120),y0,y1,F:[{p:sq,a:y0,b:y1},{p:ring(0,0,3.125,96),a:y1-1.0,b:y1}]}]),M.brass),'050600-1');}

    /* =============== the fusee wheel 05 06 00-3 (Schneckenrad) =============== */
    /* Messingblech 5,5 Ms 58 federhart: 90 cycloidal teeth, D 40.57 (hobbed), d 39.21, dg 37.84, l 0.64, m 0.4356 (its table), driving the centre pinion (14); the rim 2.62
       -0.04 and the ledge inside it, 0.2 +0.02 lower, out of Ø 33.8 -0.2; the recess on its face Ø 32.3 +0.05 for the maintaining spring, down to the web, 1.22 -0.04; the hub
       Ø 16.6 -0.2 as thick as the rim, its edge broken 45°, and on it the tube Ø 6.5 g6 (the 1941 assembly's fit; the sheet's figure there overwritten), 5 +0.2 from the
       underside, on which the maintaining ratchet turns; the bore 4.55, running on the arbor's seat (the sheet's "4 +0,1" can't pass it; 05 06_1's fit table gives the wheel
       4.45 H7/g6 there: README); underneath, the recess Ø 14 +0.1 × 1.3 -0.1 for the Vorreiber's flange, its mouth chamfered; the maintaining spring's pin hole 1.2 H8 at r
       14.2 -0.02. Gilt (Wempe 3955). Four solids: hub and tube, web (with the pin hole), ledge and rim, the teeth */
    const pW=part('fuseeWheel',-21),gW=grp(pW,fx,fz),gWp=new THREE.Group();gW.add(gWp);
    const PINW=-Math.PI/2,TW=teeth(90,0.4356,40.57,37.84,14,0.64);
    {tag(mesh(gWp,ringT([[2.275,WTB],[3.245,WTB],[3.245,WT],[7.8,WT],[8.3,WT+0.5],[8.3,W],[7.3,W],[7.0,W-0.3],[7.0,W-1.3],[2.275,W-1.3]],96),M.gilt),'050600-3');
      const pw=sh(14.2,PINW+0.8/14.2);   /* under the spring's eye's hole (0.8 off its 0° line) */tag(mesh(gWp,solidGeo([{loop:ring(0,0,16.15,320),y0:WW,y1:W,F:[{p:ring(0,0,8.3,160),a:WW,b:W},{p:ring(pw[0],-pw[1],0.6035,32),a:WW,b:W}]}]),M.gilt),'050600-3',1);
      tag(mesh(gWp,ringT([[16.15,WL],[16.9,WL],[16.9,W],[16.15,W]],320),M.gilt),'050600-3',1);
      const tg=slab(TW.xy,[{c:[0,0],r:16.9}],WT,W);Object.assign(tg.userData,{ro:TW.ro,ri:TW.ri,pl:TW.xy});const tm=tag(mesh(gWp,tg,M.gilt),'050600-3',1);tm.userData.gear={z:90,m:0.4356};
      /* phased under load against the centre pinion (gearLash, core.js): the wheel drives it, turning rotation.y up; the pinion keeps its place (train.js), the wheel is turned to suit */
      const pin=TR.cw.userData.pin,[a,b]=gearLash(tm,FX,pin,H[1],1);tm.rotation.y=0;gWp.rotation.y=a+b*14/90;pW.userData.toothMesh=tm;}

    /* =============== the maintaining work: the ratchet 05 06 02 (Gegensperrrad kompl.) and the maintaining spring 05 06 01 (Gegenfeder) =============== */
    /* Turning with the fusee wheel: the spring's eye is pinned to the wheel, its square end to the ratchet. Running, the fusee drives the ratchet through the click wheel and the
       two clicks, the ratchet the spring, the spring the wheel; winding, the key turns the fusee back, the clicks ride over the click wheel, the maintaining detent holds the
       ratchet, and the spring, loaded, drives the wheel on. Its deflection under load (05 06_9's "x = 0,27 mm", about 1°) isn't drawn: the parts turn together.
       The drawings of this work (05 06_4 Schnitt A-B, 05 06 02, 05 06 01-1, 05 05 05-1) are seen from the fusee's large end, the movement's back: mirrored here. Angles in the
       ratchet's own sheet (05 06 02-1: its pin hole at 6 o'clock, the clicks' screws at 9 and 3) and the spring's (05 06 01-1: 0° at 6 o'clock, anticlockwise as drawn) are
       set so the spring's pins meet both holes */
    const pMW=part('maintaining',-25),gMW=grp(pMW,fx,fz);
    const bk=(ab,rot)=>-Math.PI/2-ab*D2R+rot;   /* an angle in a sheet seen from the back (from 6 o'clock, anticlockwise as drawn), in the frame here, the sheet turned rot */
    const PINS=bk(295,0),GROT=PINS-bk(0,0);    /* the spring's square-end pin (295° in its sheet: 65° the other way from 0°); the ratchet's sheet turned to put its pin hole there */
    /* the ratchet 05 06 02-1 (Messingblech 3,5 Ms 58 federhart, revised 11.3.48): 120 teeth, tips Ø 37.25 -0.1 (drawn 37.2), 0.7 +0.05 deep, their steep faces facing the
       detent, the backs about 35° (scaled); the plate 1.02 -0.02 at the teeth; the cup Ø 26.1 -0.2 outside, 24.45 +0.1 inside, 3.1 -0.2 overall (drawn 3.1), its floor 2.1
       under its rim (the plate's face), its inner edge broken 45°; bore 6.5 H7; the clicks' screws M1.7 at 19.5 +0.05 apart (9 and 3 o'clock); the clicks' springs' pins
       Ø 0.6 through the cup at 42° and 60° above 9 o'clock and as far below 3; the spring's pin hole 1.2 H8 at r 14.2, 6 o'clock */
    const GSO=ratchet(120,37.2/2,37.2/2-0.725,1,0,3),gsR=polarMax(GSO,8192);
    const CKP=[bk(270,GROT),bk(90,GROT)].map(a=>sh(9.75+0.0125,a)),SPP=[[228,210],[48,30]].map(pp=>pp.map(d=>bk(d,GROT)));
    {const ph=sh(14.2,PINS),F_=[{p:ring(0,0,6.5075/2,96),a:GP,b:G},{p:ring(ph[0],-ph[1],0.6035,32),a:GP,b:G},...CKP.map(c=>({p:ring(c[0],-c[1],0.87,32),a:GP,b:G}))];
      tag(mesh(gMW,solidGeo([{loop:GSO.map(([x,y])=>[x,-y]),y0:GP,y1:G,F:F_}]),M.gilt),'050602-1');
      tag(mesh(gMW,ringT([[12.525,GC],[13.0,GC],[13.0,GP],[12.225,GP],[12.225,GC+0.3]],160),M.gilt),'050602-1',1);}
    /* the clicks 05 06 02-3 (Sperrkegel; Bandstahl 11 × 2, hardened, blued at 295°): 10.05 -0.1 long, 1.82 -0.04 thick, the pivot hole 1.2 H7 5.2 from the nose's tip and from
       the tail's, the nose 2 high, its face at 85°, the back an arc r 8, the underside hollowed r 3 about a point 2.78 and 3.54 from the hole; traced on the sheet (10:1, 34
       px/mm) between those figures. Each turns on its screw's shoulder, seated by the click wheel (seat(), below) */
    const CKL=(()=>{const o=[],arc=(c,r,a0,a1,n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}};
      const C3=[-2.78,-3.54],nb=[-5.0,-3.54+Math.sqrt(9-(2.22**2))],q8=(()=>{const A=[-5.05,0.32],B=[-0.4,1.45],m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d),h=Math.sqrt(64-l*l/4);return[m[0]+d[1]/l*h,m[1]-d[0]/l*h];})();
      o.push([4.92,-1.68]);o.push([-0.43,-1.68]);
      arc(C3,3,Math.atan2(-1.68-C3[1],-0.43-C3[0]),Math.atan2(nb[1]-C3[1],nb[0]-C3[0]),14);   /* the hollow, from the base line back to the nose */
      o.push([-5.05,0.32]);   /* the nose's face up to its tip */
      arc(q8,8,Math.atan2(0.32-q8[1],-5.05-q8[0]),Math.atan2(1.45-q8[1],-0.4-q8[0]),12);   /* the back, r 8, to the boss */
      arc([0,0],1.5,Math.atan2(1.45,-0.4),Math.atan2(1.2,0.9),6);o.push([1.4,1.0]);return o;})();   /* round the boss, then the straight top edge down to the tail's point */
    const ckTip=[-5.05,0.32],gCK=[];
    for(const c of CKP){const g=new THREE.Group();g.position.set(c[0],0,-c[1]);gMW.add(g);gCK.push(g);
      const xy=CKL.map(([x,y])=>[x,-y]);   /* mirrored: the sheet is seen from the back */
      tag(mesh(g,slab(xy,[{c:[0,0],r:0.6045}],GP-1.82,GP),M.blued),'050602-3');g.userData.tip=xy.filter(([x,y])=>x<-1.0);}   /* the outline's points toward the nose, to seat it on the click wheel */
    /* their screws (WN-21, coloured section): put in from under the ratchet's plate, the head under it, the thread in the plate's M1.7, a shoulder Ø 1.19 above it for the
       click (its hole 1.2 H7), 0.1 past it; head Ø 2.6 × 0.5, the slot in it: estimated */
    for(const c of CKP){const g=new THREE.Group();g.position.set(c[0],0,-c[1]);gMW.add(g);tag(g,'WN-21');
      mesh(g,turned([[0,GP-1.92],[0.595,GP-1.92],[0.595,GP],[0.85,GP],[0.85,G],[1.3,G],[1.3,G+0.5],[0,G+0.5]],20),M.steel);
      const sl=mesh(g,new THREE.BoxGeometry(2.4,0.25,0.3),M.steelD,0,G+0.5+0.02-0.125,0);sl.rotation.y=0.4;}
    /* the clicks' springs 05 06 02-2 (Sperrfeder; Bronzeband 1.5 × 0.4 federhart, 27 long stretched): pinned at one end by two pins 05 06 02-4 (Ø 0.6) through the cup's wall,
       along its inside on r 12.0, an S round two 2.2 mandrels, then on r 10.4 to the click's back, which it presses toward the click wheel. Their bends from 05 06 02-2, laid
       as 05 06 02 draws them; the free end runs to the click wherever the click stands (rebuilt as it rides) */
    const spr=[],SPH=1.5,SPY=GP-0.75;
    SPP.forEach((pp,i)=>{const m=tag(mesh(gMW,new THREE.BufferGeometry(),M.brass2),'050602-2');spr.push({m,pp,ck:gCK[1-i],last:null});
      for(const a of pp){const cg=new THREE.CylinderGeometry(0.3,0.3,1.6,12);cg.rotateZ(Math.PI/2);cg.translate(12.6,SPY,0);cg.rotateY(a);tag(mesh(gMW,cg,M.brass2),'050602-4');}});
    function sprGeo(o){const ck=o.ck,P=[],Y=SPY,V=(r,a)=>new THREE.Vector3(r*Math.cos(a),Y,-r*Math.sin(a));
      const a0=o.pp[0]-0.12,a1=o.pp[1]+0.3;for(let i=0;i<=10;i++)P.push(V(12.0,a0+(a1-a0)*i/10));   /* along the wall, through both pins */
      const aS=a1+0.2;for(let i=1;i<=6;i++){const f=i/6;P.push(V(12.0-1.6*(0.5-0.5*Math.cos(Math.PI*f)),a1+(aS-a1)*f));}   /* the S, in to r 10.4 */
      /* the click's back (its r 8 arc), the point a third of the way from its nose, in this frame: the strip's end lies on it */
      const q=CKL[22],E=new THREE.Vector3(q[0],0,q[1]).applyAxisAngle(new THREE.Vector3(0,1,0),ck.rotation.y).add(ck.position),rE=Math.hypot(E.x,E.z)+0.21;let aE=angOf(E.x,E.z);while(aE<aS)aE+=TAU;while(aE>aS+TAU)aE-=TAU;
      const n=Math.max(4,Math.ceil((aE-aS)/0.05));for(let i=1;i<=n;i++){const f=i/n;P.push(V(10.4+(rE-10.4)*f*f*f,aS+(aE-aS)*f));}
      return ribbonGeo(P,0.4,SPH);}
    /* the maintaining spring 05 06 01-1 (Gegenfeder; Bandstahl 35 × 1.75, hardened in oil, blued at 310°, its ends tempered at 400°): an open ring Ø 32.3 -0.1, 2 wide, 1.35
       -0.1 thick (drawn 1.3, the kompl. sheet's finished 1.3), its eye turned in at 0° (r 1.8, the hole 1.2 H7 0.8 off the 0° line), widened inward to 4 at its square end, 6
       short of the eye, its other hole 1.2 H7 on r 14.2 at 65° from the eye: the outline from 05 06 01-1, the swell round that hole (05 06 01-1's r 6) approximated by widening it inward to 3.4 there and 4 at the end (estimated). Its two
       pins (Stellstift f. Gegenfeder 05 06 00-8, Ø 1.25 on 020605: drawn 1.2 in the holes' 1.2) stand 1.2 out of it, the eye's down into the wheel, the other up into the
       ratchet */
    {const aE=bk(0,0),aSq=bk(336,0),eye=sh(14.2,aE+0.8/14.2),hs=sh(14.2,PINS);
      const band=(x,y)=>{const r=Math.hypot(x,y),a=angOf(x,-y),u=fr((aE-a)/TAU);   /* u: the way round from the eye, clockwise here */
        if(u>336/360)return 1;const w=u>0.80?3.4+0.6*(u-0.80)/(336/360-0.80):u>0.77?2+1.4*(u-0.77)/0.03:2;return Math.max((16.125-w)-r,r-16.125);};
      const f=(x,y)=>Math.min(band(x,y),Math.hypot(x-eye[0],y-eye[1])-1.8);
      const loc=sdfOutline((x,z)=>f(x,-z),-16.3,-16.3,16.3,16.3,0.05);
      tag(mesh(gMW,solidGeo([{loop:loc,y0:GS1,y1:GS0,F:[{p:ring(eye[0],-eye[1],0.6,32),a:GS1,b:GS0},{p:ring(hs[0],-hs[1],0.6,32),a:GS1,b:GS0}]}]),M.blued),'050601-1');
      tag(cylBetween(gMW,0.6,GS0+1.2,GS1,M.steel,eye[0],-eye[1],16),'050600-8');tag(cylBetween(gMW,0.6,GS1-1.2+0.02,GS0,M.steel,hs[0],-hs[1],16),'050600-8');}

    /* =============== the maintaining detent 05 05 05 (Gegensperrkegel kompl.) at hole 4 =============== */
    /* The click 05 05 05-1 (Bandstahl 2,25 × 18, hardened in oil, light blue at 310°, round the hole 400°): 2 thick, its tip 1 -0.03 thick at its upper face; the boss Ø 5, the
       back r 18, the hollow underneath r 9 about a point 6.273 and 9.645 from the hole (tangent to the boss), the tip's end on r 12 ±0.1 about the hole, 14.2 overall; the hole
       2.25 H7 (1:70), staked on its arbor 6.3 ±0.1 from the arbor's lower shoulder to its upper face. The step to the thin tip (8.6 from the hole) is drawn where the thick
       part keeps 0.05 clear of the fusee wheel's tips, which it reaches over (8.3: README). Its arbor 05 05 05-2 (no sheet): Ø 2.25 between its shoulders, 18.95 (19 less
       0.05 endshake; scaled 19.5 on 05 05 05), its pivots Ø 0.88 in the plates' drilled 0.9, 3.1 long (scaled): estimated. Its wire spring (Feder 05 05 06-1, the coloured
       section; 05 06_4's "Drahtfedermitte") has no sheet and no hole in either plate's table: not drawn */
    const pD=part('maintDetent',-25),gD=grp(pD,DX[0],DX[1]);
    const DTO=(()=>{const o=[],C9=[6.273,-9.645],C18=(()=>{const A=[0,2.5],B=[11.99,-0.51],m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d),h=Math.sqrt(324-l*l/4);return[m[0]+d[1]/l*h,m[1]-d[0]/l*h];})();
      const arc=(c,r,a0,a1,n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}};
      arc(C9,9,Math.atan2(-2.1-C9[1],1.366-C9[0]),Math.atan2(-2.49-C9[1],11.74-C9[0]),24);   /* the hollow, from the boss to the tip */
      arc([0,0],12,Math.atan2(-2.49,11.74),Math.atan2(-0.51,11.99),4);   /* the tip's end */
      arc(C18,18,Math.atan2(-0.51-C18[1],11.99-C18[0]),Math.atan2(2.5-C18[1],-C18[0]),24);   /* the back */
      arc([0,0],2.5,Math.PI/2,TAU+Math.atan2(-2.1,1.366),24);o.pop();return o;})();
    /* turned (mirrored) so its hollow faces the ratchet: the sheet's ratchet centre (10.8, -20.9 from the hole, where the tip on r 12 meets the teeth) onto the fusee's */
    const DTA=(()=>{const s=[-10.8,-20.9],w=[FX[0]-DX[0],-(FX[1]-DX[1])];return Math.atan2(w[1],w[0])-Math.atan2(s[1],s[0]);})();
    const DTX=DTO.map(([x,y])=>{const X=-x,c=Math.cos(DTA),s=Math.sin(DTA);return[X*c-y*s,X*s+y*c];});
    const dtTip=(()=>{const X=-11.74,Y=-2.49,c=Math.cos(DTA),s=Math.sin(DTA);return[X*c-Y*s,X*s+Y*c];})();
    const gDc=new THREE.Group();gD.add(gDc);const DTN=DTX.filter(([x,y])=>Math.hypot(x,y)>7);   /* the outline toward its tip, to seat it on the ratchet */
    {/* the step: the thick part within s of the hole, s the most that keeps every point of it 0.05 clear of the fusee wheel's tips (r 20.285) */
      const fw=[FX[0]-DX[0],-(FX[1]-DX[1])];let s=8.6;while(s>5&&DTX.some(([x,y])=>Math.hypot(x,y)<=s&&Math.hypot(x-fw[0],y-fw[1])<20.285+0.25))s-=0.05;   /* 0.25: the click rides about 0.2 either way on the ratchet */
      const thick=KIT.clipPoly(DTX,p=>s-Math.hypot(p[0],p[1])),thin=KIT.clipPoly(DTX,p=>Math.hypot(p[0],p[1])-s);pD.userData.step=s;
      tag(mesh(gDc,slab(thick,[{c:[0,0],r:1.125}],DTU,DTL),M.blued),'050505-1');tag(mesh(gDc,slab(thin,[],DTU,DTT),M.blued),'050505-1',1);}
    tag(mesh(gD,turned([[0,-22.075],[0.44,-22.075],[0.44,-18.975],[1.125,-18.975],[1.125,yD],[0.44,yD],[0.44,yD+3.1],[0,yD+3.1]].map(([r,y])=>[r,y]),20),M.steel),'050505-2');

    /* =============== the stop work: the bar (Stellungssteg 05 06 03-1, coloured section) in its slot across the fusee's small end, and the stop pin 05 08 01-5 =============== */
    /* 05 06_4 Schnitt C-D: the bar 22.5 long, 2 wide (the slot 2 H8, 05 06 04-2), its slot's near edge 4 from the axis, 1.5 +0.05 deep (the bar drawn 1.45 thick); under the
       cover plate. Running, its lower end stands out of the hub into the top turn's groove; when the chain winds onto the top turn there it presses that end down to the groove's
       floor, the bar slides 3.6 (scaled on C-D: its two positions) and its upper end comes out past the hub, where the stop pin in the top plate ("Anschlagstift unten
       vorstehend", hole 7, 14.0 from the fusee) catches it at full wind ("Stellung im aufgezogenen Zustand"). Its ends' forms (the point, r 12 and 17.6 on C-D) approximated;
       its spring (Stegfeder 05 06 03-3, coloured section) has no sheet: not drawn. The slot isn't cut in the turned body: the bar lies in it (README), on the slot's floor (its
       1.45 in the 1.5 deep: the movement dial up in its case, the bar falls onto the floor), 0.05 under the small end's face and the cover plate; flush with them (until 15
       October 2026) its face was the body's end face's, and the two flickered through each other wherever the cover plate wasn't drawn */
    const pSW=part('stopWork',-33),gSW=grp(pSW,fx,fz),gBar=new THREE.Group();gSW.add(gBar);gBar.rotation.y=barRot;pSW.userData.mTip=mTip;
    {const bar=[[SB.lo+1.6,-1],[SB.hi-1,-1],...[...Array(9).keys()].map(i=>{const a=-Math.PI/2+Math.PI*i/8;return[SB.hi-1+Math.cos(a),Math.sin(a)];}),[SB.lo+1.6,1],[SB.lo,0]];
      /* the bar's frame: x along it (lower end to upper), y across; placed at d from the axis */
      tag(mesh(gBar,slab(bar.map(([x,y])=>[x,y+SB.d]),[],S+0.05,S+1.5),M.steel),'050603-1');}
    /* the stop pin 05 08 01-5 (no sheet): Ø 1.6 in the top plate's hole 7 (1.6 +0.009, reamed), flush with its outer face and standing 1.5 under its inner face, to the bar's
       height: estimated */
    tag(cylBetween(P.topPlate,0.8,TT,TI+1.5,M.steel,SPX[0],SPX[1],20),'050801-5');


    /* =============== the barrel 05 07 01 (Federhaus mit Deckel, as revised 20.4.48) =============== */
    /* The drum 05 07 01-1 (Federhaustrommel, Ms; drawn from a deep-drawn cup, R 05 07 01-1): Ø 41.6 -0.1 (drawn 41.6), 38.5 +0.1 inside, 18.1 -0.15 (drawn 18.08: its arbor's
       core sets it), the bottom 1.25 -0.1 with its boss: the land Ø 12, a 45° cone to the face Ø 8, 3.1 -0.1 from the outside, the bore 4.5 +0.1 (drawn 4.55); the lid's seat
       Ø 39.2 s6, 1.2 deep; the bottom's outer edge broken. Its bottom on the pillar plate's side, the lid toward the barrel bridge (05 07 01 draws the arbor's square through the
       lid; so does the coloured section). The mainspring's hook block 05 07 01-3 (3.05 -0.1 high, 3 wide) riveted inside the wall at the M2.6 hole 9.05 ±0.05 from the
       bottom's face, 45° from 9 o'clock; its radial depth 0.35 (estimated: as much as clears the spring's next coil). The slot for the chain's hook, cut at the fusee's assembly (0207: 2.5 wide), and the spring's slot
       in the wall (2 × 0.95) aren't cut in the turned drum. Gilt, as Wempe 3955's (7_Wempe_3955_W.jpg) */
    const pB=part('barrel',-33),gB=grp(pB,BX[0],BX[1]);
    tag(mesh(gB,ringT([[19.6,BR],[20.8,BR],[20.8,BB-0.2],[20.6,BB],[2.275,BB],[2.275,BBF],[4.0,BBF],[6.0,BI],[19.25,BI],[19.25,BR+1.2],[19.6,BR+1.2]],240),M.gilt),'050701-1');
    /* the lid 05 07 01-2 (Federhausdeckel, Ms 58, revised 20.4.48): sprung into the seat ("eingesprengt"), its face 0.6 -0.1 under the rim; 1.3 -0.1 thick (in the seat Ø 39.2
       r6, under it 0.05 clear of the wall: the sheet draws it 39.39 over all, the blank's); its boss 3.3 -0.1 from its face, the face Ø 8, a 45° cone to Ø 12; bore 4.55; its two
       notches (2 and 2.7 wide) left out */
    tag(mesh(gB,ringT([[2.275,BLT],[19.6,BLT],[19.6,BR+1.2],[19.2,BR+1.2],[19.2,BLU],[6.0,BLU],[4.0,BLF],[2.275,BLF]],240),M.gilt),'050701-2');
    const BLK=1.2;   /* the hook block's angle in the drum */
    {const yb=BB-9.05,bg=new THREE.BoxGeometry(0.35,3.05,3.0);bg.translate(19.25-0.175,yb,0);bg.rotateY(BLK);tag(mesh(gB,bg,M.steel),'050701-3');
      const rg=new THREE.CylinderGeometry(1.3,1.3,1.5,20);rg.rotateZ(Math.PI/2);rg.translate(20.0,yb,0);rg.rotateY(BLK);tag(mesh(gB,rg,M.steel),'050701-3',1);}
    /* the arbor 05 07 02 (Federkern kompl.): its pivot in the pillar plate (the 1941 arbor 020704-1's Ø 3, drawn 2.88 in the plate's 2.90 reamed: the arbor as last revised,
       05 07 02-1, isn't in the set), its end a ball, polished, 5 from the shoulder; the journals the drum's bosses run on (4.48 in their 4.55: 020704-1's 5 don't pass them),
       22.2 +0.1 between their outer shoulders (framed); the core Ø 13.3 between them, its ends chamfered 45° (05 07 01) to 0.05 off the bosses (10.98: the 1941 core's 12 can't
       pass the 1948 drum's 11.1 between its bosses); the pivot in the barrel bridge (drawn 3.88 in its 3.9 ±0.01), then the square 2.7 ±0.02 (1:100), 10 long, for the set-up
       ratchet. The hook (Federhaken 05 07 02-2): a pin Ø 2 in the core's hole, 0.5 -0.05 proud. Präz. Rundstahl 14, hardened, tempered at 270 */
    const pBA=part('barrelArbor',-33),gBA=grp(pBA,BX[0],BX[1]);
    {const bal=[];for(let i=0;i<=6;i++){const t=Math.PI/2*i/6;bal.push([1.44*Math.cos(t),4.35+0.6*Math.sin(t)]);}
      tag(mesh(gBA,turned([[0,-25.70],[1.94,-25.70],[1.94,BA1],[2.24,BA1],[2.24,BC1],[4.5,BC1],[6.65,BC1+2.15],[6.65,BC0-2.15],[4.5,BC0],[2.24,BC0],[2.24,BA0],[1.44,BA0],...bal],48),M.steel),'050702-1');
      const sq=new THREE.CylinderGeometry(2.7/Math.SQRT2,2.605/Math.SQRT2,9.5,4,1);sq.translate(0,-25.70-4.75,0);tag(mesh(gBA,sq,M.steel),'050702-1',1);
      const pt=new THREE.CylinderGeometry(2.605/Math.SQRT2,0.3,0.5,4,1);pt.translate(0,-35.2-0.25,0);tag(mesh(gBA,pt,M.steel),'050702-1',1);
      const hk=tag(mesh(gBA,new THREE.BufferGeometry(),M.steel),'050702-2');var hookSet=a=>{const g=new THREE.CylinderGeometry(1.0,1.0,1.05,20);g.rotateZ(Math.PI/2);g.translate(6.62,(BC0+BC1)/2,0);g.rotateY(a);hk.geometry.dispose();hk.geometry=g;};}
    /* the set-up ratchet 05 07 00-3 (Sperrad; Messingblech 3 Ms 58, revised 24.11.47): 16 teeth, tips Ø 14.1 -0.2, roots 11.1 -0.2 (drawn 14.0, 11.0), each face along a line 1.2
       off the radius (10°), the back an arc r 12.5; 2.65 -0.1 thick (drawn 2.6); its square hole 2.7 H7 (1:100) on the arbor's square; turned so the click's beak lies against a
       face (the click and its place are the frame's, 05 08 05-2). Gilt */
    const SRO=(()=>{const z=16,P=TAU/z,o=[],rt=7.0,rr=5.5;
      for(let k=0;k<z;k++){const a=k*P,t=Math.asin(1.2/rt),u=Math.asin(1.2/rr);   /* the face: from the root to the tip along the line 1.2 off the radius */
        o.push(sh(rt,a+t));const A=sh(rt,a+t),B=sh(rr,a+P+u),m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d),h=Math.sqrt(12.5*12.5-l*l/4),c=[m[0]-d[1]/l*h,m[1]+d[0]/l*h];
        const a0=Math.atan2(A[1]-c[1],A[0]-c[0]),a1=Math.atan2(B[1]-c[1],B[0]-c[0]);for(let i=1;i<=6;i++){const aa=a0+wrap(a1-a0)*i/6;o.push([c[0]+12.5*Math.cos(aa),c[1]+12.5*Math.sin(aa)]);}}   /* the back r 12.5 from this tip to the next root */
      return o.map(([x,y])=>[x,-y]).reverse();})();   /* mirrored: its faces then fit the click as the frame has it (traced on Wempe 3955), facing the way rotation.y rises (README, Unresolved) */
    {const sr=polarMax(SRO),q=FRP.click,b=[BX[0],BX[1]],pts=q.loop.map(([x,z])=>[x-b[0],-(z-b[1])]);
      let best=null;for(let i=0;i<2000;i++){const rho=i/2000*TAU/16;let pen=-9;for(const p of pts){const r=Math.hypot(p[0],p[1]);if(r>7.2)continue;pen=Math.max(pen,sr(Math.atan2(p[1],p[0])-rho)-r);}if(!best||pen<best.pen)best={rho,pen};}
      /* then turned on until a face meets the beak */
      let rho=best.rho;const pen=r=>{let m=-9;for(const p of pts){const rr=Math.hypot(p[0],p[1]);if(rr>7.2)continue;m=Math.max(m,sr(Math.atan2(p[1],p[0])-r)-rr);}return m;};
      for(let i=0;i<4000&&pen(rho+0.0005)<-0.03;i++)rho+=0.0005;
      const a=2.7/Math.SQRT2+0.01,sq=[[0,a],[a,0],[0,-a],[-a,0]].map(([x,z])=>[x*Math.cos(rho)-z*Math.sin(rho),x*Math.sin(rho)+z*Math.cos(rho)]);   /* the square hole turned back by what rotateY(rho) turns it on: it stays on the arbor's square */
      const rgg=solidGeo([{loop:SRO.map(([x,y])=>[x,-y]),y0:RS1,y1:RS0,F:[{p:sq,a:RS1,b:RS0}]}]);rgg.rotateY(rho);const pSR=part('setupRatchet',-60);tag(mesh(grp(pSR,BX[0],BX[1]),rgg,M.gilt),'050700-3');   /* a part of its own: it comes off the square before the bridge (the Exploded view) */pBA.userData.ratchetPen=pen(rho);}

    /* =============== the mainspring 05 07 00-6 (Zugfeder) =============== */
    /* "Zugfeder 15 × 0,37" (05 06_20; 0207: "Zugfeder 15", its space 15.8 ±0.1 framed): drawn 14.8 high to clear the 1948 drum's 14.95 inside (its lid 1.3 under the seat)
       and 0.36 thick so packed coils lie at the strip's 0.37 pitch. Its length isn't drawn anywhere: 1,240 mm, fitted to the sheet's own force (05 06_20: the spring solved
       in this drum by tools/mainspring.py at lengths 1,180-1,360 and its torque taken through the drawn fusee gives the measured pull's shape best at 1,240, to 1.1 % rms;
       tools/wempe_mainspring.py, README Physics: energy; 1,386, the strip filling half the room, until 15 October 2026). It lies 11.9 turns all on the wall and 18.9 on the
       core, coil-bound: 6.9 turns for the barrel's 5.1 working turns and the ¾ set-up (05 06_20: "3/4 Umgang gespannt"), 1.1 to spare. Drawn as two packs, on the core and
       on the wall, joined by a turn: its inner end in the arbor's hook, its outer end at the drum's block. Its length estimated, its shape simplified (README) */
    const MSL=1240,MST=0.37,MSa=6.65+MST/2,MSR=19.25-MST/2;
    const msLen=(ni,no)=>{const r1=MSa+MST*ni,r2=MSR-MST*no;return Math.PI*ni*(MSa+r1)+Math.PI*no*(MSR+r2)+Math.PI*(r1+r2);};
    const msShape=T=>{let lo=0,hi=T-1;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(msLen(m,T-1-m)>MSL)lo=m;else hi=m;}return lo;};   /* the core's pack's turns at T */
    const msT=(()=>{let lo=2,hi=40;for(let i=0;i<50;i++){const m=(lo+hi)/2;if(msLen(0,m-1)>MSL)hi=m;else lo=m;}return lo;})();   /* all on the wall */
    const pMS=part('mainspring',-33),gMS=grp(pMS,BX[0],BX[1]),msM=tag(mesh(gMS,new THREE.BufferGeometry(),M.mspring),'050700-6');
    /* its turns T: from its inner end, 0.18 past the arbor's hook (HKA), winding outward the way the drum runs (rotation.y rising), to its outer end 0.08 short of the drum's
       block; set up 0.75 turn past lying all on the wall at run down (with the chain: the band turns the drum a little less, so its set-up there is a little more), which sets
       the hook's angle */
    const MST0=msT+0.75,HKA=wrap(BLK+BETA_RUN.chain-0.26-MST0*TAU);hookSet(HKA);const msK=Math.round(MST0-(BLK+BETA_RUN.chain-0.26-HKA)/TAU),msTurns=beta=>(BLK+beta-0.26-HKA)/TAU+msK;
    function msGeo(T){const ni=msShape(T),no=T-1-ni,r1=MSa+MST*ni,r2=MSR-MST*no,P=[],n=Math.ceil(T*64),ym=(MS0+MS1)/2;
      for(let i=0;i<=n;i++){const tau=T*i/n;let r;if(tau<=ni)r=MSa+MST*tau;else if(tau<=ni+1){const f=tau-ni;r=r1+(r2-r1)*(f*f*(3-2*f));}else r=r2+MST*(tau-ni-1);
        const a=HKA+0.18+TAU*tau;P.push(new THREE.Vector3(r*Math.cos(a),ym,-r*Math.sin(a)));}
      return ribbonGeo(P,0.36,Math.abs(MS1-MS0));}

    /* =============== the chain 05 07 04 (Kette) and the band 05 07 03 (Schneckenband) =============== */
    /* the chain: hardened, tempered at 310°, lightly polished: the plates' figure of eight (two lobes r 1 round the rivets, waisted to 1.2 between them: scaled on 05 07 04),
       an outer link two plates and its two rivets Ø 0.55 (the rivet stock 0.6), an inner link one plate; instanced, laid along the pitch line every update */
    const pC=part('chain',-33),gC=new THREE.Group();pC.add(gC);
    const plate=y=>{const s=new THREE.Shape(),r=1.0,tw=Math.asin(0.6/r);s.absarc(1.025,0,r,tw-Math.PI,Math.PI-tw,false);s.absarc(-1.025,0,r,tw,TAU-tw,false);s.closePath();
      const g=extrude(s,{depth:0.26,bevelEnabled:false,curveSegments:12});g.rotateX(-Math.PI/2);g.translate(0,y-0.13,0);return g;};
    const I4=new THREE.Matrix4(),geoA=mergeGeo([[plate(0.27),I4],[plate(-0.27),I4],...[1.025,-1.025].map(x=>[cylY(0.275,0.80,10),new THREE.Matrix4().makeTranslation(x,0,0)])]),geoB=plate(0);
    const MAXL=200,imA=new THREE.InstancedMesh(geoA,M.chain,MAXL),imB=new THREE.InstancedMesh(geoB,M.chain2,MAXL);gC.add(imA,imB);imA.frustumCulled=imB.frustumCulled=false;tag(imA,'050704');tag(imB,'050704',1);
    /* its hooks (from the strip 10 × 0.9; drawn as the middle layer, 0.26 thick, riveted between the end link's plates: how thick they are where they're riveted isn't drawn): the top hook (3.5 wide, its throat 1.8 deep, 30°, the nose r 0.4) round the fusee's
       pin, the bottom hook (7.5 from the last rivet to its tip, the barb 3.5 and 5 from it, 1.4 wide at the tip, its back r 8 and front r 20) into the drum's slot: outlines
       approximated on those figures */
    const HKT=[[0,-1.0],[2.4,-1.75],[3.55,-1.2],[3.95,-0.2],[3.7,0.75],[2.95,1.05],[2.6,0.55],[2.95,0.05],[2.7,-0.6],[1.6,-0.5],[0.9,0.25],[0,1.0]];   /* x from its rivet toward the pin */
    const HKB=[[0,-1.0],[2.5,-0.95],[5.0,-0.75],[7.3,-0.55],[7.5,-0.1],[6.6,0.2],[5.5,0.75],[5.2,1.2],[4.2,0.55],[2.0,0.95],[0,1.0]];   /* x from its rivet toward its tip; the barb on +y, toward the drum */
    const hkMesh=(o,th,id,mat)=>{const g=new THREE.Group();gC.add(g);tag(mesh(g,slab(o,[],-th/2,th/2),mat),id,1);return g;};
    const cHT=hkMesh(HKT,0.26,'050704',M.chain),cHB=hkMesh(HKB,0.26,'050704',M.chain);
    /* the band: its strip a ribbon along its pitch line; its hooks (Bandstahl 10 × 0.8, brazed to it): the round hook 05 07 03-2 (its back r 6, the crown r 1.5, the nose 1.7
       from the band's slot with r 0.4 at its tip) round the fusee's pin, the drum's hook 05 07 03-3 (its back r 10, front r 20, a barb 1.4 out, the tip 4.5 above the barb)
       into the drum's slot: outlines approximated on those figures */
    const pBd=part('band',-33),gBd=new THREE.Group();pBd.add(gBd);const bdM=tag(mesh(gBd,new THREE.BufferGeometry(),M.steel),'050703-1');
    const BHT=[[0,-0.45],[1.4,-0.6],[2.6,-0.25],[3.2,0.5],[2.9,1.35],[2.0,1.6],[1.3,1.2],[1.6,0.75],[2.1,0.6],[2.2,0.15],[1.5,0.0],[0,0.45]];
    const BHB=[[0,-0.45],[2.0,-0.55],[4.5,-0.6],[6.9,-0.4],[7.0,-0.05],[6.2,0.3],[4.9,0.75],[4.6,1.15],[2.5,0.7],[0,0.45]];
    const hkB=(o,id)=>{const g=new THREE.Group();gBd.add(g);tag(mesh(g,slab(o,[],-0.38,0.38),M.chain),id);return g;};
    const bHT=hkB(BHT,'050703-2'),bHB=hkB(BHB,'050703-3');

    /* =============== the state =============== */
    let conn='chain';pBd.visible=false;
    const setConn=v=>{conn=v==='band'?'band':'chain';pC.visible=conn==='chain';pBd.visible=conn==='band';last.n=null;};
    const NRUN=CG.chain.NRUN;   /* run down: the chain's last turn has left the fusee (both connectors end within a hundredth of a turn of each other) */
    const last={n:null,ck:[null,null],conn:null};
    /* the clicks: where the click wheel seats click 0 (its nose at the root against a face), the fusee's angle against the ratchet's; computed once */
    const ck0={P:CKP[0],v:gCK[0].userData.tip};
    const ckAng=(i,rel)=>{const P=CKP[i],v=gCK[i].userData.tip,a0=Math.atan2(P[1],P[0]);   /* rel: the click wheel's turn against the ratchet; its nose toward the wheel and behind its pivot, the click turned about a0 + 1.17 (05 06 02) */
      return seat(cwR,rel,P,v,a0+1.17+0.4,a0+1.17-0.4);};
    const SEAT=(()=>{let best=null;for(let i=0;i<180;i++){const rel=i/180*P35,g=ckAng(0,rel),c=Math.cos(g),s=Math.sin(g);let r=99;for(const v of ck0.v)r=Math.min(r,Math.hypot(ck0.P[0]+v[0]*c-v[1]*s,ck0.P[1]+v[0]*s+v[1]*c));
      if(!best||r<best.r)best={rel,r};}return best.rel;})();   /* where click 0 drops deepest: at the root, against a face */
    /* the clicks' rest angle when lifted clear (no teeth under them): for the spring's shape before the first update */
    function update(s,c){
      const n=Math.max(0,Math.min(NRUN,s.n??0)),cg=CG[conn],RW=-c*14/90+gWp.rotation.y,RG=RW;   /* the fusee wheel (its phase included) and the ratchet with it */
      gW.rotation.y=-c*14/90;gMW.rotation.y=-c*14/90+gWp.rotation.y;
      /* the fusee: its turns from full wind, and running, carried forward onto the clicks (the click wheel's face against click 0's nose); winding, as the key has it */
      let Rf=cg.RF0+TAU*n;const rel=Rf-RG;if(!s.winding)Rf+=fr((SEAT-rel)/P35)*P35;
      for(const g of[gF,gDP,gSP,gV,gSW])g.rotation.y=Rf;
      /* the clicks ride on the click wheel */
      const rl=Rf-RG;gCK.forEach((g,i)=>{const a=ckAng(i,rl);g.rotation.y=a;if(last.ck[i]===null||Math.abs(last.ck[i]-a)>0.002){last.ck[i]=a;const o=spr[1-i];o.m.geometry.dispose();o.m.geometry=sprGeo(o);}});
      /* the maintaining detent rides on the ratchet's teeth */
      {const P=[DX[0]-FX[0],-(DX[1]-FX[1])];gDc.rotation.y=seat(gsR,RG,P,DTN,0.35,-0.35);}
      /* the chain or band, the barrel and the mainspring, and the stop bar: only when the fusee has moved */
      if(last.n!==null&&Math.abs(last.Rf-Rf)<1e-4&&last.conn===conn)return Rf;last.n=n;last.Rf=Rf;last.conn=conn;
      const m0=cg.m0Of(Rf),run=cg.runOf(m0),sT=cg.lf(m0)+run.S,L=CONN[conn].len,rbp=cg.rbp;
      const beta=run.psi+Math.PI-(L-sT)/rbp-BLK0[conn];gB.rotation.y=beta;
      /* the path: on the fusee from its first rivet (m 0) to m0, the run, round the barrel to the end */
      const pts=[],Pf=m=>{const r=rf(m)+CONN[conn].of,q=pol(r,PHI0+TAU*m+Rf);return new THREE.Vector3(fx+q[0],yc(m),fz+q[1]);};
      for(let m=0;m<m0;m+=1/144)pts.push(Pf(m));pts.push(Pf(m0));
      /* on the barrel each piece of the chain lies at the height it left the fusee at; what stays on it fully wound (a quarter turn) at the top turn's */
      const nb=Math.max(2,Math.ceil((L-sT)/(rbp*TAU/144)));for(let i=0;i<=nb;i++){const sv=sT+(L-sT)*i/nb,a=run.psi+Math.PI-(sv-sT)/rbp,mm=cg.mOf(sv),yy=yc(Math.min(mm,M_FULL));
        const q=pol(rbp,a);pts.push(new THREE.Vector3(BX[0]+q[0],yy,BX[1]+q[1]));}
      if(conn==='chain'){const PC=CONN.chain.PC,NJ=CONN.chain.NJ,J=[pts[0].clone()];let acc=0,next=PC;
        for(let i=1;i<pts.length&&J.length<=NJ;i++){const seg=pts[i].distanceTo(pts[i-1]);while(acc+seg>=next&&J.length<=NJ){J.push(new THREE.Vector3().lerpVectors(pts[i-1],pts[i],(next-acc)/seg));next+=PC;}acc+=seg;}
        const mtx=new THREE.Matrix4(),t=new THREE.Vector3(),up=new THREE.Vector3(),nn=new THREE.Vector3(),pos=new THREE.Vector3();let ia=0,ib=0;
        for(let k=0;k+1<J.length;k++){pos.addVectors(J[k],J[k+1]).multiplyScalar(0.5);t.subVectors(J[k+1],J[k]).normalize();up.set(0,1,0).addScaledVector(t,-t.y).normalize();nn.crossVectors(t,up);
          mtx.makeBasis(t,up,nn).setPosition(pos);if(k%2===0)imA.setMatrixAt(ia++,mtx);else imB.setMatrixAt(ib++,mtx);}
        imA.count=ia;imB.count=ib;imA.instanceMatrix.needsUpdate=true;imB.instanceMatrix.needsUpdate=true;
        /* the hooks: the top one from the first rivet back to the pin, the bottom one on from the last rivet along the drum */
        place(cHT,J[0],PINA,Rf,'top');place(cHB,J[J.length-1],null,beta,'bot');}
      else{bdM.geometry.dispose();bdM.geometry=ribbonGeo(pts,0.22,0.78);place(bHT,pts[0],PINA,Rf,'top');place(bHB,pts[pts.length-1],null,beta,'bot');}
      /* the mainspring: the barrel's turns from run down give its turns (its outer end turns with the drum, its inner end stays with the arbor) */
      const T=msTurns(beta);msM.geometry.dispose();msM.geometry=msGeo(Math.max(msT+0.1,T));pMS.userData.T=T;
      /* the stop bar: pressed in when the chain lies over its lower end, in the top turn */
      const tr=SB.tr*Math.max(0,Math.min(1,(m0-mTip+0.15)/0.15));gBar.children[0].position.x=tr;pSW.userData.travel=tr;return Rf;}   /* the chain's run comes down on the end over the 0.15 turn before it lies on it */
    /* the hooks' places: the top hook from the connector's first point back to the fusee's pin; the bottom hook on from its last point along the drum */
    function place(g,p,pa,rot,which){const up=new THREE.Vector3(0,1,0);
      if(which==='top'){const q=pol(PINR,pa+rot),P=new THREE.Vector3(fx+q[0],p.y,fz+q[1]),d=new THREE.Vector3().subVectors(P,p);d.y=0;const L=d.length();d.normalize();const n=new THREE.Vector3().crossVectors(d,up);
        const m=new THREE.Matrix4().makeBasis(d,up,n).setPosition(p);g.matrixAutoUpdate=false;g.matrix.copy(m);g.userData.span=L;}
      else{const v=new THREE.Vector3(p.x-BX[0],0,p.z-BX[1]).normalize(),d=new THREE.Vector3().crossVectors(v,up).normalize(),n=new THREE.Vector3().crossVectors(d,up);
        const m=new THREE.Matrix4().makeBasis(d,up,n).setPosition(p);g.matrixAutoUpdate=false;g.matrix.copy(m);}}
    pB.userData.blk=BLK;
    /* keySeat: where the winding key goes on (case.js keyAt): the dust plate's group, turning with the fusee and spread with the dust plate in the Exploded view (so the key
       stays outside the dust bush, which spreads further than the fusee), and the plate's face toward the key (y0 above: 7 from the square's root, where it is 3.1 across, as
       the key's square), on which the tube's mouth stops */
    return{update,setConn,get conn(){return conn;},keySeat:{g:gSP,y:yT-15},NRUN,HPT:90/14,CG,rf,yc,ac,SEAT,P35,MST0,msT,rBody,stack:{yD,yT,VHF,VFA,W,WT,G,GP,F,S,DP0,DTU,DTL,BB,BR}};}
  return{build};
})();
