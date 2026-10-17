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
  const G=WT-0.05,GT=G-1.02,GP=G-1.3,GC=G-3.1;               /* the maintaining ratchet: underside, the plate's face at the teeth, its face inside the cup (the cup's floor), the cup's rim */
  const F=GT-0.05,LB=12.55,S=F-LB,FRC=F-2.7;                 /* the fusee body: large end face, length, small end face, the large end's recess floor */
  const CW0=FRC,CW1=FRC+2;                                   /* the click wheel, on the recess floor */
  const DP0=S-0.8;                                           /* the cover plate (Deckplatte), S to DP0 */
  const SLD=1.5;                                             /* the stop bar's slot across the small end: 1.5 +0.05 deep (05 06 04-2) */
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
  /* the flange and the groove (05 06 04-2's Schnitt A-B, enlarged): the flange's two ribs and the slot between them "2 ±0,02" over all, the slot "0,87 +0,01" and the second
     rib "0,37", so the first rib 0.76 (its "0,8" the nominal); then "1,2 ±0,01" from the second rib's outer face to the first groove rib's far face: a land and its rib, the
     pitch. The groove square-cut, its lands 0.87 wide (1.2 less the rib "0,33"), the slot's width: the chain (0.82 ±0.02) runs in a 0.87 channel on the whole fusee, 0.03-0.07
     clear. Each land's rib 0.33 thick on its small-end side, standing 0.6 over it ("alle Maße: +0,6"). A helix, a land's middle at a_c(m) from the large end face: turn 0 in
     the slot, its first 0.15 rising from the slot's middle; turn 1 on the first land, 2.0 to 2.87 (the section's 1,2); the full wind's turn (8.75) then ends 12.17 from the
     large end, 0.08 short of "Gangende Punkt N" 0.3 from the small end (the pitch's ±0.01 is ±0.09 over the turns). Sure of the figures; that the 1,2 is every turn's pitch,
     likely: it is the only reading in which the slot, the 1,2 and point N agree (the pencilled 1.15 of the superseded 02-1 would cut the second rib to 0.28 and stop the
     groove 0.85 short of N). Until 16 October 2026 the pitch 1.15 and the lands 0.82, the flange's ribs 0.6 and about 0.14 and its slot 0.8, from 0.6 to 1.4 */
  const FR1=0.76,FS1=0.76+0.87,FR2=2.0,FSC=(FR1+FS1)/2;   /* the first rib's inner face, the slot's far wall (the second rib's inner face), the second rib's outer face, the slot's middle */
  const PAX=1.2,WLD=0.87,RIB=0.33,RIBH=0.6,A0=FR2+WLD/2-PAX,M_FULL=8.75;
  /* the first 0.15 turn: from the slot's middle, level along it where the top hook lies on its pin, into the helix at its pitch (a cubic: level at 0, the helix's slope at 0.15) */
  const ac=m=>{if(m>=0.15)return A0+PAX*m;const t=Math.max(0,m)/0.15,d=A0+PAX*0.15-FSC;return FSC+d*(3*t*t-2*t*t*t)+PAX*0.15*(t*t*t-t*t);};
  const yc=m=>F-ac(m);
  /* the fusee's radius field: the flange (Ø 35.6, its two ribs and the slot between them, 0.87 wide, floor r 17.25), the slot deepened under the chain's pin (a cutter Ø 13.5,
     2.9 deep), the groove, and the small end's hub (Ø 21). The groove is cut only to its end N ("Gangende Punkt N", 0.3 from the small end: MN, the turn whose land's
     small-end edge is there); past N the end stays uncut at the hub's Ø 21, and so does the last turn's rib, so the hub's inner face follows the helix: 05 06 04-2's
     Schnitt A-B draws the end so, the last land against a block at Ø 21 0.3 thick at D (N's side) and about 1.3 at C (scaled at 12.1 px/mm: likely), with no rib
     between them. Until 17 October 2026 the hub was 0.3 all round with the groove cut on under it past N, which left the stop bar's slot cutting a loose flange and ribs */
  const MN=(LB-0.3-WLD/2-A0)/PAX;   /* 8.817: 0.067 turn past the full wind's 8.75, as 02-2's view C-D draws N past the groove's end at 8.75 */
  /* the chain's pin (A on the sheet's view C-D) at PHI0-0.17, just behind the groove's start, 1 under the ribs' tops (the view's "1"), in the middle of the cutter's arc (the view
     centres the arc on A): section A-B, through the pin, draws both ribs whole to their tops with the pin's hole across them and the slot between them about 2.8 deep (scaled),
     so the cutter is a slitting cutter in the slot, deepening it where the hook wraps the pin, not a flat across the ribs */
  const PHI0=0,PINA=PHI0-0.17,PINR=16.8,FLAT=PINA,RC=17.8-2.9+6.75;
  const rCut=th=>{const d=wrap(th-FLAT),q=RC*Math.sin(d);if(Math.abs(q)>=6.75||Math.cos(d)<0)return 99;return RC*Math.cos(d)-Math.sqrt(6.75*6.75-q*q);};
  function rBody(th,a){
    if(a>=LB-0.3-1e-9)return 10.5;
    let r=a<FR1?17.8:a<FS1?17.25:17.8;
    if(a>=FR1){const mt=fr((th-PHI0)/TAU);let j=Math.floor((a-(ac(mt)-WLD/2))/PAX),m=mt+j;
      while(m+1>=0.15&&a>=ac(m+1)-WLD/2)m+=1;while(m>=0&&a<ac(m)-WLD/2)m-=1;   /* the turn whose land (or rib) holds a */
      if(m>=0){const d=a-(ac(m)-WLD/2);if(m>MN||(d>=WLD&&m+1>MN))return 10.5;   /* past N, or the last land's rib: the uncut end */
        if(d<WLD)r=Math.min(r,rf(m));else if(a>=FS1||m>0.3)r=Math.min(r,rf(m)+RIBH);}}
    if(a>=FR1&&a<FS1)r=Math.min(r,rCut(th));   /* in the slot only */
    return r;}

  /* ---------- helpers ---------- */
  const turned=(P,seg=32)=>new THREE.LatheGeometry(P.map(([r,y])=>V2(r,y)),seg);   /* listed from one end on the axis to the other, y rising */
  const ringT=(P,seg=48)=>new THREE.LatheGeometry([...P,P[0]].map(([r,y])=>V2(r,y)),seg);   /* a closed loop counterclockwise in r, y */
  const shapeOf=(xy,holes=[])=>{const s=new THREE.Shape();s.moveTo(xy[0][0],xy[0][1]);for(let i=1;i<xy.length;i++)s.lineTo(xy[i][0],xy[i][1]);s.closePath();
    for(const h of holes){const p=new THREE.Path();if(h.c){p.absarc(h.c[0],h.c[1],h.r,0,TAU,true);}else{p.moveTo(h[0][0],h[0][1]);for(let i=1;i<h.length;i++)p.lineTo(h[i][0],h[i][1]);p.closePath();}s.holes.push(p);}return s;};
  /* an outline (shape coordinates) extruded from y0 to y1 (y0 < y1), one closed solid */
  const slab=(xy,holes,y0,y1,cs=24)=>{const g=extrude(shapeOf(xy,holes),{depth:y1-y0,bevelEnabled:false,curveSegments:cs});g.rotateX(-Math.PI/2);g.translate(0,y0,0);return g;};
  /* a solid of revolution's piece built ray by ray: at each angle th of cols (a part's own frame, rising), from rlo(th,a) out to rhi(th,a), at each depth a of rows (from the
     body's large end face, F - a the height); the faces at the first and last row and the walls at the first and last angle close it. Flat faces stay flat; the curved ones
     are shaded smooth wherever neighbouring triangles turn less than 35° (the lathe's look), so the slot's walls keep their edges */
  function radialSolid(cols,rows,rlo,rhi){const P=[],T=[],nc=cols.length,nr=rows.length,I=[],O=[];
    for(let i=0;i<nc;i++){I.push([]);O.push([]);const th=cols[i],c=Math.cos(th),s=Math.sin(th);
      for(let j=0;j<nr;j++){const lo=rlo(th,rows[j]),hi=Math.max(lo,rhi(th,rows[j]));I[i].push([lo*c,F-rows[j],-lo*s]);O[i].push([hi*c,F-rows[j],-hi*s]);}}
    const tri=(a,b,c,n)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],x=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...x);
      if(l<1e-12)return;if(x[0]*n[0]+x[1]*n[1]+x[2]*n[2]<0){const t=b;b=c;c=t;x[0]=-x[0];x[1]=-x[1];x[2]=-x[2];}T.push(x.map(q=>q/l));P.push(a,b,c);};
    const quad=(a,b,c,d,n)=>{tri(a,b,c,n);tri(a,c,d,n);};
    for(let i=0;i<nc-1;i++){const m=(cols[i]+cols[i+1])/2,rn=[Math.cos(m),0,-Math.sin(m)],ri=rn.map(q=>-q);
      for(let j=0;j<nr-1;j++){quad(O[i][j],O[i+1][j],O[i+1][j+1],O[i][j+1],rn);quad(I[i][j],I[i+1][j],I[i+1][j+1],I[i][j+1],ri);}
      quad(I[i][nr-1],I[i+1][nr-1],O[i+1][nr-1],O[i][nr-1],[0,-1,0]);quad(I[i][0],I[i+1][0],O[i+1][0],O[i][0],[0,1,0]);}
    for(const[i,sg]of[[0,-1],[nc-1,1]]){const th=cols[i],tn=[-Math.sin(th)*sg,0,-Math.cos(th)*sg];for(let j=0;j<nr-1;j++)quad(I[i][j],I[i][j+1],O[i][j+1],O[i][j],tn);}
    /* normals: each corner the mean of the triangles round its point that turn less than 35° from its own */
    const K=p=>p.map(q=>Math.round(q*1e5)).join(','),at=new Map();P.forEach((p,k)=>{const key=K(p);if(!at.has(key))at.set(key,[]);at.get(key).push(Math.floor(k/3));});
    const pos=new Float32Array(P.length*3),nor=new Float32Array(P.length*3),cs=Math.cos(35*D2R);
    P.forEach((p,k)=>{const f=Math.floor(k/3),n=T[f],a=[0,0,0];for(const g of at.get(K(p))){const m=T[g];if(m[0]*n[0]+m[1]*n[1]+m[2]*n[2]>cs){a[0]+=m[0];a[1]+=m[1];a[2]+=m[2];}}
      const l=Math.hypot(...a)||1;pos.set(p,k*3);nor.set([a[0]/l,a[1]/l,a[2]/l],k*3);});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));return g;}
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
    const RF0=RF0x??psiT(M_FULL)-PHI0-TAU*M_FULL;   /* the fusee's rotation.y fully wound: given (the stop's), or the chain's leaving point at the groove's end */
    const m0Of=Rf=>{let m=M_FULL-(Rf-RF0)/TAU;for(let i=0;i<4;i++)m=(psiT(Math.max(0,m))-PHI0-Rf)/TAU;return Math.max(0,Math.min(M_FULL+0.05,m));};
    const runOf=m0=>{const psi=psiT(m0),rfp=rf(m0)+c.of,A=pol(rfp,psi),B=pol(rbp,psi+Math.PI);return{psi,S:Math.hypot(BX[0]+B[0]-FX[0]-A[0],BX[1]+B[1]-FX[1]-A[1])};};
    return{lf,mOf,rbp,psiT,RF0,m0Of,runOf,NRUN:(psiT(0)-PHI0-RF0)/TAU};}

  /* ================================================================= the build ================================================================= */
  function build(mv,M,K,FRP,TR){const{part,loose}=K,P=K.parts,tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined),fx=FX[0],fz=FX[1];
    const grp=(par,x,z)=>{const g=new THREE.Group();g.position.set(x,0,z);par.add(g);return g;};
    /* the versions (movement.js's setRev): rv(par, 'last', 'first', 'last 6mx' or 'first 6mx') a group of the pieces only those versions have (the 6MX keeps the revised maintaining spring and the first drawn barrel); onRev(g) runs g(version) when it changes */
    const rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;},onRev=f=>mv.userData.onRev.push(f);

    /* the stop bar 05 06 03-1 (Stellungssteg; no sheet in the set: the coloured section's) as 05 06_4's Schnitt C-D draws it, traced at 12.2 px/mm (its Ø 21 hub, Ø 15 recess
       and Ø 6 step come out so) and scaled 0.989 to its 22.5. The sheet is seen from the fusee's large end, as its view A-B (the maintaining work's, below): mirrored here.
       In the bar's frame (u along it, lower end to upper, from the foot of the axis's perpendicular; v across, as the shape's y) it lies at v -4 to -6 (02-2: the slot 2 H8,
       its near edge 4 from the axis), its ends at u -11.52 and 10.98 retracted. Its lower end is cut obliquely: the point on
       the near side, rounded r 0.39, the far side 0.94 shorter; its upper end is square on the far side, its near side rounded r 2.47 from u 8.56; across it at u -6.0 the
       hole the spring's end goes into (the dashed hole on C-D). Its travel 3.6, between C-D's two positions */
    const SB={d:5.0,lo:-11.52,hi:10.98,tr:3.6,lf:-10.58,ru:8.555,rr:2.47,rt:0.39,sp:-6.0,us:8.0,ub:3.4,tt:1.05};
    /* the slot is 1.5 deep along the bar's lower part and "1,1+0,05 tief" toward its upper end (02-2's two depths, inside its lines at either end), from where 02-2's hidden arc
       r 9.45 crosses it, u 8.0 (us): there the rib between the top turn and the next isn't cut, and the bar's upper end, standing out over the groove, passes under it, clear
       of the chain on the turn below. So the bar is thinner toward its upper end: 1.05 (tt; the coloured section draws its end standing out 9.5 px thick against its middle's
       13.5, 0.70 (±0.07), flush on the cover plate's side; 1.05/1.45 is 0.72), from u 3.4 (ub, estimated: slid its whole 3.6, its full thickness stays inside the top land's floor, r 9.3, at its far side, so off the
       chain on the turn below, and short of the shallow part) */
    const SBO=(()=>{const o=[],c=[SB.lo+SB.rt,4+SB.rt],e=Math.asin(0.47/SB.rr);
      for(let i=0;i<=8;i++){const a=Math.PI*(150+120*i/8)/180;o.push([c[0]+SB.rt*Math.cos(a),c[1]+SB.rt*Math.sin(a)]);}   /* the point's round, from the oblique edge to the near side */
      for(let i=0;i<=16;i++){const a=-Math.PI/2+(Math.PI/2-e)*i/16;o.push([SB.ru+SB.rr*Math.cos(a),6.47+SB.rr*Math.sin(a)]);}   /* the upper end's round, from the near side to the far */
      o.push([SB.lf,6]);return o.map(([u,v])=>[u,-v]).reverse();})();   /* the far side back to the oblique edge; mirrored */
    const SPA=angOf(SPX[0]-fx,SPX[1]-fz),SPR=Math.hypot(SPX[0]-fx,SPX[1]-fz),SBtipA=Math.atan2(-4-SB.rt,SB.lo);   /* the stop pin's place about the fusee's axis; the lower end's point, in the bar's frame */
    /* the chain's and the band's runs (connGeo), and from them the drum's turns: the end's angle in the drum set so the drum stands at 0 fully wound (BLK0), and its turn at run down */
    /* full wind is where the stop holds the fusee. The slot runs along the line from the axis to the chain's pin A, its upper end toward A (02-2 dimensions it from that
       line: "4", "2 H8", no angle), so the bar's turn on the fusee is A's; the stop pin (Ø 1.6, hole 7, 14.0 from the axis) then bears on the bar's far side near its upper
       end, 0.02 off, where C-D draws it ("Stellung im aufgezogenen Zustand"): at that turn of the fusee (the fusee turns back, rotation.y falling, while winding, so the far
       side comes round onto the pin; the face reaches past the pin once the bar has slid 2.1 of its 3.6). It falls 0.112 turn short of the chain lying to the groove's end N
       (M_FULL, the full wind assumed until 15 October 2026): 8.638 turns of chain on the fusee, 8.70 turns and 55.9 h from run down (05 06_20's test: 8.75 working turns;
       the up-and-down dial: 56 h); the groove's last turn-tenth stays empty, as a fusee's should (02-2 draws N a further 0.07 on) */
    const barRot=PINA,SPu=Math.sqrt(SPR*SPR-(6+0.8+0.02)**2);
    const CG={},RF0N=connGeo(CONN.chain).RF0,RFS=(()=>{const r=SPA-barRot-Math.atan2(-6.82,SPu);return r+TAU*Math.round((RF0N-r)/TAU);})();   /* the stop's turn, in the turn nearest the groove's end's */
    CG.chain=connGeo(CONN.chain,RFS);CG.band=connGeo(CONN.band,RFS);
    /* on the barrel the chain runs on from its tangent point the way the barrel turns back (rotation.y falling) to its hook: the drum stands at 0 fully wound */
    const BLK0={},BETA_RUN={};for(const k of['chain','band']){const cg=CG[k],mf=cg.m0Of(cg.RF0),run=cg.runOf(mf),sT=cg.lf(mf)+run.S;BLK0[k]=run.psi+Math.PI-(CONN[k].len-sT)/cg.rbp;
      const r0=cg.runOf(0),s0=cg.lf(0)+r0.S;BETA_RUN[k]=r0.psi+Math.PI-(CONN[k].len-s0)/cg.rbp-BLK0[k];}
    const mTip=(()=>{const u=(barRot+SBtipA-PHI0)/TAU;return M_FULL-fr(M_FULL-u);})();

    /* =============== the fusee (Schnecke 05 06 04) =============== */
    const pF=part('fusee',-33),gF=grp(pF,fx,fz);
    /* the body 05 06 04-2 (Schneckenkörper, as revised 27.2.48; Rundmessing 36, Ms 58): a lathe whose outer surface is pushed out to the radius field above (rBody): the
       flange Ø 35.6 -0.1 (drawn 35.6) with its two ribs and the slot, the groove's nine turns, the hub at the small end. Inside: the large end's recess Ø 26.3 +0.2 (drawn
       26.3), 2.7 deep to the 9.9 -0.1 from the small end, entered by a 45° chamfer from Ø 29.8 (revision a); the bore 7 H7 (drawn 7.006) to the small end's recess Ø 15, 1.6
       +0.1 deep. Its M2 holes for the click wheel's screws and the cover plate's M1.7 aren't cut (a lathe can't be holed across): the screws lie in it (README). Gilt, as
       Wempe 3955's (8_Wempe_3955_Räderwerk_plus.jpg) */
    {const PH=99,col=[[PH,S+SLD]];for(let a=LB-0.04*Math.ceil(SLD/0.04);a>-1e-9;a-=0.04)col.push([PH,F-Math.max(0,a)]);if(col[col.length-1][1]!==F)col.push([PH,F]);
      const pr=[[7.5,S+SLD],...col,[14.9,F],[13.15,F-1.75],[13.15,FRC],[7.006/2,FRC],[7.006/2,S+1.6],[7.5,S+1.6],[7.5,S+SLD]];   /* from the stop bar's slot's floor (below) */
      const g=new THREE.LatheGeometry(pr.map(([r,y])=>V2(r,y)),216),p=g.attributes.position;
      for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),r=Math.hypot(x,z);if(r<PH-1)continue;const th=angOf(x,z),R=rBody(th,F-p.getY(i));p.setX(i,R*Math.cos(th));p.setZ(i,-R*Math.sin(th));}
      g.computeVertexNormals();tag(mesh(gF,g,M.gilt),'050604-2');
      /* the small end's last 1.5, which the stop bar's slot crosses (05 06 04-2's Schnitt C-D: 2 H8 wide, its near edge 4 from the axis, "1,5+0,05 tief", right across the end
         and out through the hub and the top turn on both sides): the two pieces it leaves between the recess (Ø 15) and the radius field, the large one on the axis's side
         of the slot and the arch beyond it, each built ray by ray on the lathe's own angles and depths (so they meet its surface row for row) with more rays where the slot's
         walls meet the outside. Pieces of the body: drawn gilt as it is */
      const N=216,rows=[LB-SLD];for(let k=Math.ceil(SLD/0.04)-1;k>=0;k--)rows.push(LB-0.04*k);
      const fine=(a0,a1)=>{const o=[];for(let d=a0;d<=a1+1e-9;d+=0.15)o.push(d*D2R);return o;};
      const cols=(p0,p1,extra)=>{const L=[p0,p1,...extra.filter(f=>f>p0&&f<p1)];for(let k=0;k<N;k++){const f=p0+fr((k*TAU/N-Math.PI/2-barRot-p0)/TAU)*TAU;if(f>p0+1e-6&&f<p1-1e-6)L.push(f);}
        return[...new Set(L.map(x=>+x.toFixed(9)))].sort((a,b)=>a-b).map(f=>f+barRot);};   /* the angles from the bar's direction, put in the fusee's frame */
      const sA=Math.asin(4/7.5),c1=fine(22.0,26.0),c2=fine(34.3,40.9);   /* the angles (from the bar's direction) where the slot's walls meet the outside */
      tag(mesh(gF,radialSolid(cols(-sA,Math.PI+sA,[...c1.map(f=>-f),...c1.map(f=>Math.PI+f)]),rows,()=>7.5,(th,a)=>{const s_=-Math.sin(th-barRot);return Math.min(rBody(th,a),s_>1e-9?4/s_:1e9);}),M.gilt),'050604-2',1);
      const sC=Math.asin(6/10.5);
      tag(mesh(gF,radialSolid(cols(Math.PI+sC,TAU-sC,[...c2.map(f=>Math.PI+f),...c2.map(f=>TAU-f)]),rows,th=>Math.max(7.5,-6/Math.sin(th-barRot)),(th,a)=>rBody(th,a)),M.gilt),'050604-2',1);
      /* and the slot's shallow part toward the bar's upper end: from 1.1 to 1.5 deep, beyond u 8.0, between its walls */
      const r2=[LB-SLD];for(let k=Math.ceil(SLD/0.04)-1;k>=0;k--){const a=LB-0.04*k;if(a<LB-1.1-1e-9)r2.push(a);}r2.push(LB-1.1);
      const pA=Math.atan2(-6,SB.us),pB=Math.atan2(-4,Math.sqrt(10.6*10.6-16)),c3=[];for(let f=pA;f<=pB+1e-9;f+=0.25*D2R)c3.push(f);
      tag(mesh(gF,radialSolid([...c3,pB].map(f=>f+barRot),r2,th=>{const f=th-barRot;return Math.max(SB.us/Math.cos(f),4/-Math.sin(f));},(th,a)=>{const f=th-barRot;return Math.min(rBody(th,a),6/-Math.sin(f));}),M.gilt),'050604-2',1);}
    /* the arbor 05 06 04-1 (Schneckenwelle; Präz. Rundstahl 7,5, polished where marked): from the winding end, the square 3.17 r6 at its root tapering 1:100 (to the sheet's
       2.92 at its point), 20.3 long, the journal Ø 4.5 ±0.02 at the shoulder to 4.39 (1:70, 8 long) that runs in the fusee bush, the step Ø 6.1 -0.05 (3.1 +0.05) for the
       cover plate, the collar Ø 7.04 -0.01 (7.9) pressed into the body's bore, the Vorreiber's seat 4.5 ±0.02 to 4.38 (1:70), 8.7, the cross hole 1.1 for its pin 17.7 -0.05
       from the far shoulder, the dial-side pivot Ø 2.8 ±0.02 to 2.7 (1:70, 6.5 +0.1) in the pillar plate, and the stub Ø 1.6 +0.1/+0.05 for the up-and-down pinion (05 02 00-5,
       the motion work's), its end 0.25 under the dial: the sheet's 60.6 overall counts the two lathe centres, cut off at the dial end (the coloured section ends the arbor under
       the pinion). The square's end is turned to a point (the sheet's other centre), its 28.3 to the tip: a cone cut through the square, the flats ending in curves (the
       sheet draws them so). Scaled on 05 06_15 at 7.0 px/mm (its 60.6 over 424.6 px; the 28.3 gives 6.9): the tip at x 585, the flats' ends at 571 and the corners' at 568,
       2.0 and 2.43 from it, which a cone of half-angle 38.7° fits to 0.2 (likely: a pixel is 0.14). Kirow 247's (4_Kirow_247_N.jpg) is pointed so (sure); the coloured
       section's dome is pictorial */
    {const rS=yT+19.7;   /* = yD */
      tag(mesh(gF,turned([[0,yT-8],[2.195,yT-8],[2.25,yT],[3.05,yT],[3.05,yT+3.1],[3.52,yT+3.1],[3.52,yT+11.0],[2.25,yT+11.0],[2.19,rS],[1.4,rS],[1.3536,rS+6.5],[0.8375,rS+6.5],[0.83,9.85],[0.6,10.1],[0,10.1]],40),M.steel),'050604-1');
      const tA=Math.tan(38.7*D2R),yP=yT-28.3,sB=3.17-(20.3-2.64)/100,cB=sB/Math.SQRT2,yB=yP+cB/tA+0.01;   /* the tip; the square 2.99 across where the cone leaves its corners, 2.64 from the tip (1:100 from 3.17 at the root) */
      const sq=new THREE.CylinderGeometry(3.17/Math.SQRT2,cB,yT-8-yB,4,1);sq.translate(0,(yT-8+yB)/2,0);tag(mesh(gF,sq,M.steel),'050604-1',1);
      const NP=64,dm=t=>{const r=cB/(Math.abs(Math.cos(t))+Math.abs(Math.sin(t)));return[r*Math.cos(t),r*Math.sin(t)];},cl=[];   /* the square's outline, its corners on x and z as the CylinderGeometry's */
      for(let i=0;i<NP;i++)cl.push({loop:[[0,0],dm(i/NP*TAU),dm((i+1)/NP*TAU)],y0:p=>yP+Math.hypot(p[0],p[1])/tA,y1:yB});
      tag(mesh(gF,solidGeo(cl),M.steel),'050604-1',1);}
    /* the click wheel 05 06 04-3 (Schneckensperrrad, 6.8.47; Ms Blech 2, Ms 58 federhart): 35 teeth, tips Ø 16.0 -0.05, roots Ø 14.5 -0.2 (drawn 15.99, 14.4), the faces undercut
       8°: the sheet's 8° line runs from a root through the face, which carried on inward passes on the tooth's own side of the centre, so each tip overhangs its gap ahead of
       its root (scaled about 10° on the plan's teeth at 17.9 px/mm: sure). Until 15 October 2026 the faces leaned back 8° (the root ahead of the tip). Driving the maintaining
       clicks forward; bore 7.5 +0.05; 2 -0.1 thick (drawn 1.95); its three holes Ø 2, opened 1:8 toward its free face for the screws' heads, on Ø 11.5 ±0.05 at 120°; on the
       large end's recess floor, screwed into the body's M2 holes */
    const P35=TAU/35,CWO=ratchet(35,15.99/2,14.4/2,-1,-(15.99-14.4)/2*Math.tan(8*D2R)/7.2,5),cwR=polarMax(CWO),CWH=[0,1,2].map(k=>sh(5.75,PHI0+0.3+k*TAU/3));
    {const T=(p,r0,r1)=>({p:ring(p[0],-p[1],r0,40),q:ring(p[0],-p[1],r1,40),a:CW0-0.0,b:CW1-0.05});
      tag(mesh(gF,solidGeo([{loop:CWO.map(([x,y])=>[x,-y]),y0:CW0,y1:CW1-0.05,F:[{p:ring(0,0,7.525/2,96),a:CW0,b:CW1-0.05},...CWH.map(c=>T(c,1.0,1.125))]}]),M.brass),'050604-3');}
    /* its screws (WN-19): heads turned to the holes' 1:8, flush in the wheel, M2 6 into the body (its M2 6 +0.5 deep); the heads' slots */
    for(const c of CWH){tag(mesh(gF,turned([[0,CW0-3.8],[0.85,CW0-3.8],[1.0,CW0-3.6],[1.0,CW0],[1.125,CW1-0.05],[0,CW1-0.05]],20),M.steel,c[0],0,-c[1]),'WN-19');   /* in the fusee's own group, as its body: fixed to it */
      const sl=tag(mesh(gF,new THREE.BoxGeometry(2.0,0.35,0.3),M.steelD,c[0],CW1-0.05+0.02-0.175,-c[1]),'WN-19',1);sl.rotation.y=0.7;}
    /* the cover plate 05 06 00-4 (Deckplatte; Bandstahl 24 × 1): Ø 21.1 -0.1, 0.8 -0.1 thick (drawn 0.8), its hole 6.1 H8 on the arbor's step, straight for 0.4 -0.1 from the
       face on the body (the section's "0,4 -0,1" spans that land: sure) and opened by a 60° chamfer to the outer face, the 60° taken from the axis as on the fusee wheel (drawn
       0.36 deep, 0.57 out: likely), so Ø 7.49 at that face; one screw hole Ø 1.85 -0.1 at 6 ±0.05 from the centre sunk 90° to Ø 3.1 +0.1, both from the outer face, as the
       outer edge's 45° (not sized: left out). Until 15 October 2026 the 0.4 was drawn as a recess Ø 9.4 in the face on the body and the hole's chamfer left out. Over the stop
       bar's slot, which runs under it */
    const pDP=part('coverPlate',-38),gDP=grp(pDP,fx,fz),DPS=sh(6,barRot+Math.asin(1/6));   /* the screw 6 from the axis and 1 from the line through it along the slot, on the side away from the bar (02-2's "6 r" and "1"; 05 06_4's C-D draws it so) */
    {const sp=ring(DPS[0],-DPS[1],0.875,48),hb=ring(0,0,6.109/2,96),y0=DP0,y1=S;
      tag(mesh(gDP,solidGeo([{loop:ring(0,0,21.05/2,240),y0,y1,F:[{p:ring(0,0,6.109/2+0.4*Math.tan(60*D2R),96),q:hb,a:y0,b:y0+0.4},{p:hb,a:y0,b:y1},{p:ring(DPS[0],-DPS[1],1.575,48),q:sp,a:y0,b:y0+0.7},{p:sp,a:y0,b:y1}]}]),M.steel),'050600-4');}
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
       0.4 +0.05 in face a, and a 0.3 +0.1 × 45° chamfer (drawn 0.35) on the flange's edge on the hub's side (the section draws it at both of the flange's corners on that face, face a's
       square: sure; until 15 October 2026 on face a's edge); the pin's hole Ø 0.8, its centre 1.1 ±0.1 from the hub face. It holds the fusee wheel on the arbor from below,
       its flange in the wheel's underside recess. Steel */
    const pV=part('vorreiber',-14),gV=grp(pV,fx,fz);
    {const rb=y=>2.19+(yD-y)*(0.06/8.7)+0.01;
      tag(mesh(gV,ringT([[rb(VFA+0.425),VFA+0.425],[4.975,VFA+0.425],[4.975,VFA],[6.9475,VFA],[6.9475,VFB-0.35],[6.5975,VFB],[3.75,VFB],[3.75,VHF],[rb(VHF),VHF]],96),M.steel),'050600-2');
      /* the pin (Vorreiberstift, no sheet in the set): Ø 0.8 through the hub and the arbor's cross hole, drawn as its two ends in the hub (the arbor isn't holed) */
      const r0=rb(VHF-1.1)+0.01,r1=3.75;
      for(const s of[1,-1]){const f=PHI0+0.9+(s>0?0:Math.PI),d=new THREE.Vector3(Math.cos(f),0,-Math.sin(f)),m=tag(mesh(gV,new THREE.CylinderGeometry(0.4,0.4,r1-r0,12),M.steel),'050600-5',s<0);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d);m.position.copy(d).multiplyScalar((r0+r1)/2).setY(VHF-1.1);}}   /* each end's own y along the pin, for its axis */

    /* =============== the dust plate 05 06 00-1 (Staubplatte) on the winding square =============== */
    /* Rundmessing 8: Ø 7.6 -0.1, 3.1 -0.2 (drawn 3.0), its square hole 3.1 H7 tapered 1:100 like the square, so it sits where the square is 3.1 across: 7 from its root; a
       recess Ø 6.2 +0.1, 1.0 deep, in its face away from the plates, toward the key: the coloured section draws it opening upward (Wempe_Einheitschronometer.jpg,
       Ø 6.4 × 0.7 at 9.4 px/mm), and the sheet's hole narrows 1:100 toward its recessed face as the square narrows away from the plates (sure, both); the other face's
       0.5 × 45° chamfer left out. It turns in the dust bush */
    const pSP=part('dustPlate',-70),gSP=grp(pSP,fx,fz);
    {const y0=yT-8-7.0,y1=y0+3.0,a=3.12/Math.SQRT2+0.01,sq=[[0,a],[a,0],[0,-a],[-a,0]].map(([x,z])=>[x,z]);   /* the square's corners on x and z, as CylinderGeometry's 4 sides lie */
      tag(mesh(gSP,solidGeo([{loop:ring(0,0,7.55/2,120),y0,y1,F:[{p:sq,a:y0,b:y1},{p:ring(0,0,3.125,96),a:y0,b:y0+1.0}]}]),M.brass),'050600-1');}

    /* =============== the fusee wheel 05 06 00-3 (Schneckenrad) =============== */
    /* Messingblech 5,5 Ms 58 federhart: 90 cycloidal teeth, D 40.57 (hobbed), d 39.21, dg 37.84, l 0.64, m 0.4356 (its table), driving the centre pinion (14); the rim 2.62
       -0.04 and the ledge inside it, 0.2 +0.02 lower, out of Ø 33.8 -0.2; the recess on its face Ø 32.3 +0.05 for the maintaining spring, down to the web, 1.22 -0.04; the hub
       Ø 16.6 -0.2 as thick as the rim, its edge broken 45°, and on it the tube Ø 6.5 g6 (the 1941 assembly's fit; the sheet's figure there overwritten), 5 +0.2 from the
       underside, on which the maintaining ratchet turns; the bore 4.55, running on the arbor's seat (the sheet's "4 +0,1" can't pass it; 05 06_1's fit table gives the wheel
       4.45 H7/g6 there: README); underneath, the recess Ø 14 +0.1 × 1.3 -0.1 for the Vorreiber's flange, its mouth chamfered 60° from Ø 17 +0.2 on the underside: the 60° taken
       from the axis (from the face it would run 2.6 deep, twice the recess), so the chamfer reaches Ø 14 0.87 up and the recess's wall is straight above it (the section draws
       the slope from Ø 17, scaled 16.8, to about 1.0 up: likely; until 15 October 2026 a 0.3 × 45° from Ø 14.6); the hub's top edge 0.5 × 45° as drawn before (the
       section's slope there, unsure). The maintaining spring's pin hole 1.2 H8 at r 14.2 -0.02. Gilt (Wempe 3955). Four solids: hub and tube, web (with the pin hole), ledge and rim,
       the teeth; the web's bore opened to Ø 17.2 at the underside's mouth, which cuts into it */
    const pW=part('fuseeWheel',-21),gW=grp(pW,fx,fz),gWp=new THREE.Group();gW.add(gWp);
    const PINW=-Math.PI/2,TW=teeth(90,0.4356,40.57,37.84,14,0.64);
    {const RM=17.1/2,RH=8.65,ch=r=>W-(RM-r)/Math.tan(60*D2R);   /* the mouth's radius (17 +0.2), the hub's outer radius on the underside (the web's bore there), the chamfer's height at r */
      tag(mesh(gWp,ringT([[2.275,WTB],[3.245,WTB],[3.245,WT],[7.8,WT],[8.3,WT+0.5],[8.3,WW],[RH,WW],[RH,W],[RM,W],[7.0,ch(7.0)],[7.0,W-1.3],[2.275,W-1.3]],96),M.gilt),'050600-3');
      const pw=sh(14.2,PINW+0.8/14.2);   /* under the spring's eye's hole (0.8 off its 0° line) */tag(mesh(gWp,solidGeo([{loop:ring(0,0,16.15,320),y0:WW,y1:W,F:[{p:ring(0,0,RH,160),a:WW,b:W},{p:ring(pw[0],-pw[1],0.6035,32),a:WW,b:W}]}]),M.gilt),'050600-3',1);
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
       detent, the backs about 35° (scaled); the plate 1.02 -0.02 at the teeth and 1.3 -0.1 inside the cup (the section draws the floor inside the cup higher than the plate
       outside it: 1.3 and 0.94 scaled at 6.9 px/mm, sure), so the cup's rim stands 2.1 over the plate outside it (3.1 less 1.02: the "2,1"); the cup Ø 26.1 -0.2 outside, 24.45
       +0.1 inside, 3.1 -0.2 overall (drawn 3.1), revision (a)'s 0.3 +0.15 × 45° on its outer top edge (the leader and the 0.3's extension line meet the outer corner, and the
       section's right half draws the slope outside: sure); bore 6.5 H7; the clicks' screws M1.7 at 19.5 +0.05 apart (9 and 3 o'clock); the clicks' springs' pins Ø 0.6
       through the cup at 42° and 60° above 9 o'clock and as far below 3; the spring's pin hole 1.2 H8 at r 14.2, 6 o'clock. Until 15 October 2026 the plate was 1.02 inside
       the cup too (the clicks 0.28 lower) and the chamfer on the cup's inner edge */
    const GSO=ratchet(120,37.2/2,37.2/2-0.725,1,0,3),gsR=polarMax(GSO,8192);
    const CKP=[bk(270,GROT),bk(90,GROT)].map(a=>sh(9.75+0.0125,a)),SPP=[[228,210],[48,30]].map(pp=>pp.map(d=>bk(d,GROT)));
    {const ph=sh(14.2,PINS),F_=[{p:ring(0,0,6.5075/2,96),a:GP,b:G},{p:ring(ph[0],-ph[1],0.6035,32),a:GP,b:G},...CKP.map(c=>({p:ring(c[0],-c[1],0.87,32),a:GP,b:G}))];
      tag(mesh(gMW,solidGeo([{loop:GSO.map(([x,y])=>[x,-y]),y0:GT,y1:G,F:F_.map(f=>({...f,a:GT}))}]),M.gilt),'050602-1');
      tag(mesh(gMW,solidGeo([{loop:ring(0,0,12.225,160),y0:GP,y1:GT,F:F_.filter((f,i)=>i!==1).map(f=>({...f,a:GP,b:GT}))}]),M.gilt),'050602-1',1);   /* the plate's 0.28 more inside the cup */
      tag(mesh(gMW,ringT([[12.225,GC],[12.7,GC],[13.0,GC+0.3],[13.0,GT],[12.225,GT]],160),M.gilt),'050602-1',1);}
    /* the clicks 05 06 02-3 (Sperrkegel; Bandstahl 11 × 2, hardened, blued at 295°): 10.05 -0.1 long, 1.82 -0.04 thick, the pivot hole 1.2 H7 5.2 from the nose's foot and from
       the tail's tip, the nose 2 high, the back an arc r 8, the underside hollowed r 3 about a point 2.78 and 3.54 from the hole; traced on the sheet (10:1, 33.8 px/mm) between
       those figures. The base line 1.52 under the hole: the r 3 hollow's chord there ends at the nose's foot, 5.2 from the hole (scaled 1.545: sure); the nose's face at 85° to
       it, leaning back toward the pivot (scaled 85.1°, sure), so its tip 2 over the base line and 0.17 nearer the pivot than its foot. Until 15 October 2026 the base line lay
       1.68 under the hole and the face 1.84 tall, leaning out (91.6°). Each turns on its screw's shoulder, seated by the click wheel (seat(), below) */
    const CKB=-1.52,CKN=[-2.78-Math.sqrt(9-(3.54+CKB)**2),CKB],CKT=[CKN[0]+2/Math.tan(85*D2R),CKB+2];   /* the base line, the nose's foot and its tip */
    const CKL=(()=>{const o=[],arc=(c,r,a0,a1,n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}};
      const C3=[-2.78,-3.54],h0=[-2.78+Math.sqrt(9-(3.54+CKB)**2),CKB],q8=(()=>{const A=CKT,B=[-0.4,1.45],m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d),h=Math.sqrt(64-l*l/4);return[m[0]+d[1]/l*h,m[1]-d[0]/l*h];})();
      o.push([Math.sqrt(5.2*5.2-CKB*CKB),CKB]);o.push(h0);   /* the tail's tip, 5.2 from the hole, and along the base line to the hollow */
      arc(C3,3,Math.atan2(h0[1]-C3[1],h0[0]-C3[0]),Math.atan2(CKN[1]-C3[1],CKN[0]-C3[0]),14);   /* the hollow, from the base line back to the nose's foot */
      o.push(CKT);   /* the nose's face up to its tip */
      arc(q8,8,Math.atan2(CKT[1]-q8[1],CKT[0]-q8[0]),Math.atan2(1.45-q8[1],-0.4-q8[0]),12);   /* the back, r 8, to the boss */
      arc([0,0],1.5,Math.atan2(1.45,-0.4),Math.atan2(1.2,0.9),6);o.push([1.4,1.0]);return o;})();   /* round the boss, then the straight top edge down to the tail's point */
    const gCK=[];
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
       short of the eye, its other hole 1.2 H7 on r 14.2 at 65° from the eye: the outline from 05 06 01-1, its width traced on the sheet (5:1, 17.21 px/mm by the 32.3, along
       rays from its centre to the inner edge): 2 to 272° from the eye, widening to 2.29 at 280°, 2.85 at 287°, 3.44 at 292°, 3.65 at the hole (295°), 3.76 at 310°, 3.87 at
       330°, and the end's "4" at 336° (its corners scaled radial at 335.6°): sure. Until 15 October 2026 the swell was estimated: 3.4 at 288°, 4 at the end. Its two
       pins (Stellstift f. Gegenfeder 05 06 00-8, Ø 1.25 on 020605: drawn 1.2 in the holes' 1.2) stand 1.2 out of it, the eye's down into the wheel, the other up into the
       ratchet */
    /* As first drawn, 020605 (Gegenfeder kompl., 127-556.04-U18, 15.4.41: the older number of the same spring, drawn the same day as 05 06 01-1): the same ring, eye, pins and
       holes, but its width given round it, 1.8 at 40°, 1.9 at 100°, 2 at 150° and 195°, 2.5 at 240°, 3.5 at 270° from the eye (all sure), so it widens from the eye's side to
       the square end; drawn between those figures, on to 4 at the square end as 05 06 01-1's (estimated) */
    {const aE=bk(0,0),aSq=bk(336,0),eye=sh(14.2,aE+0.8/14.2),hs=sh(14.2,PINS);
      const tab=T=>d=>{for(let i=1;i<T.length;i++)if(d<=T[i][0]){const[a0,w0]=T[i-1],[a1,w1]=T[i];return w0+(w1-w0)*(d-a0)/(a1-a0);}return 4;};
      const w41=tab([[0,1.8],[40,1.8],[100,1.9],[150,2],[195,2],[240,2.5],[270,3.5],[336,4]]),w48=tab([[0,2],[272,2],[276,2.12],[280,2.29],[284,2.5],[287,2.85],[290,3.1],[292,3.44],[293,3.6],[295,3.65],[300,3.68],[310,3.76],[320,3.82],[330,3.87],[336,4]]);
      for(const v of['last 6mx','first']){const g=rv(gMW,v);
        const band=(x,y)=>{const r=Math.hypot(x,y),a=angOf(x,-y),u=fr((aE-a)/TAU);   /* u: the way round from the eye, clockwise here */
          if(u>336/360)return 1;const w=(v==='first'?w41:w48)(u*360);return Math.max((16.125-w)-r,r-16.125);};
        const f=(x,y)=>Math.min(band(x,y),Math.hypot(x-eye[0],y-eye[1])-1.8);
        const loc=sdfOutline((x,z)=>f(x,-z),-16.3,-16.3,16.3,16.3,0.05);
        tag(mesh(g,solidGeo([{loop:loc,y0:GS1,y1:GS0,F:[{p:ring(eye[0],-eye[1],0.6,32),a:GS1,b:GS0},{p:ring(hs[0],-hs[1],0.6,32),a:GS1,b:GS0}]}]),M.blued),'050601-1');}
      tag(cylBetween(gMW,0.6,GS0+1.2,GS1,M.steel,eye[0],-eye[1],16),'050600-8');tag(cylBetween(gMW,0.6,GS1-1.2+0.02,GS0,M.steel,hs[0],-hs[1],16),'050600-8');}

    /* =============== the maintaining detent 05 05 05 (Gegensperrkegel kompl.) at hole 4 =============== */
    /* The click 05 05 05-1 (Bandstahl 2,25 × 18, hardened in oil, light blue at 310°, round the hole 400°): 2 thick, its tip 1 -0.03 thick at its upper face; the boss Ø 5, the
       back r 18, the hollow underneath r 9 about a point 6.273 and 9.645 from the hole (tangent to the boss), the tip's lower corner on r 12 ±0.1 about the hole, its end 2.6
       tall at 80° (below), 14.2 overall; the hole
       2.25 H7 (1:70), staked on its arbor 6.3 ±0.1 from the arbor's lower shoulder to its upper face. The step to the thin tip runs obliquely from 8.6 from the hole at
       the back to the hollow (below), clear of the fusee wheel's tips, which the thin part reaches over. Its arbor 05 05 05-2 (no sheet): Ø 2.25 between its shoulders, 18.95 (19 less
       0.05 endshake; scaled 19.5 on 05 05 05), its pivots Ø 0.88 in the plates' drilled 0.9, 3.1 long (scaled): estimated. Its wire spring (Feder 05 05 06-1), at hole 5
       beside it, below */
    const pD=part('maintDetent',-25),gD=grp(pD,DX[0],DX[1]);
    /* the tip's end (05 05_12): a straight edge from its lower corner, on r 12 about the hole and on the line tangent to the boss's underside (2.5 under the hole: scaled 2.56),
       2.6 tall above that line ("2,6", sure) at 80° to it, leaning back toward the hole ("80°", sure; scaled 81.7°, and 2.35 tall: the figure is not to scale there); the 1941
       assembly 05 05_11 scales it 2.54 tall, leaning back about 4°. Until 15 October 2026 the end ran along r 12 from 2.49 to 0.51 under the hole (1.98 tall), leaning out */
    const DTE=[Math.sqrt(144-2.5*2.5),-2.5],DTE1=[DTE[0]-2.6/Math.tan(80*D2R),DTE[1]+2.6];
    const DTO=(()=>{const o=[],C9=[6.273,-9.645],C18=(()=>{const A=[0,2.5],B=DTE1,m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d),h=Math.sqrt(324-l*l/4);return[m[0]+d[1]/l*h,m[1]-d[0]/l*h];})();
      const arc=(c,r,a0,a1,n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}};
      arc(C9,9,Math.atan2(-2.1-C9[1],1.366-C9[0]),Math.atan2(DTE[1]-C9[1],DTE[0]-C9[0]),24);   /* the hollow, from the boss to the tip's lower corner */
      for(let i=1;i<4;i++)o.push([DTE[0]+(DTE1[0]-DTE[0])*i/4,DTE[1]+(DTE1[1]-DTE[1])*i/4]);   /* the tip's end, straight */
      arc(C18,18,Math.atan2(DTE1[1]-C18[1],DTE1[0]-C18[0]),Math.atan2(2.5-C18[1],-C18[0]),24);   /* the back */
      arc([0,0],2.5,Math.PI/2,TAU+Math.atan2(-2.1,1.366),24);o.pop();return o;})();
    /* turned (mirrored) so its hollow faces the ratchet: the sheet's ratchet centre (10.8, -20.9 from the hole, where the tip on r 12 meets the teeth) onto the fusee's */
    const DTA=(()=>{const s=[-10.8,-20.9],w=[FX[0]-DX[0],-(FX[1]-DX[1])];return Math.atan2(w[1],w[0])-Math.atan2(s[1],s[0]);})();
    const DTX=DTO.map(([x,y])=>{const X=-x,c=Math.cos(DTA),s=Math.sin(DTA);return[X*c-y*s,X*s+y*c];});
    const gDc=new THREE.Group();gD.add(gDc);const DTN=DTX.filter(([x,y])=>Math.hypot(x,y)>7);   /* the outline toward its tip, to seat it on the ratchet */
    {/* the step: a straight hidden edge on 05 05_12 (dashed), from the back where the "8,6" meets it (8.6 from the hole, 1.40 above it on the r 18) obliquely down to the
         hollow about 5.6 from the hole (scaled ±0.3; section A-B's step where the line crosses it, about 5.9): the thick part 0.52-0.61 clear of the fusee wheel's tips
         (r 20.285) as the click rides on its ratchet. Until 16 October 2026 an arc about the hole at 7.55, the 8.6 taken as a radius, which put it over the tips */
      const fw=[FX[0]-DX[0],-(FX[1]-DX[1])],tx=([x,y])=>{const X=-x,c=Math.cos(DTA),s=Math.sin(DTA);return[X*c-y*s,X*s+y*c];};
      const S1=tx([8.6,1.403]),S2=tx([5.6,-9.645+Math.sqrt(81-(5.6-6.273)**2)]),side=p=>(S2[0]-S1[0])*(p[1]-S1[1])-(S2[1]-S1[1])*(p[0]-S1[0]),sg=Math.sign(side([0,0]));
      const thick=KIT.clipPoly(DTX,p=>sg*side(p)),thin=KIT.clipPoly(DTX,p=>-sg*side(p));
      pD.userData.step=Math.min(...thick.map(([x,y])=>Math.hypot(x-fw[0],y-fw[1])))-20.285;   /* the thick part's least clearance over the tips, at rest */
      tag(mesh(gDc,slab(thick,[{c:[0,0],r:1.125}],DTU,DTL),M.blued),'050505-1');tag(mesh(gDc,slab(thin,[],DTU,DTT),M.blued),'050505-1',1);}
    tag(mesh(gD,turned([[0,-22.075],[0.44,-22.075],[0.44,-18.975],[1.125,-18.975],[1.125,yD],[0.44,yD],[0.44,yD+3.1],[0,yD+3.1]].map(([r,y])=>[r,y]),20),M.steel),'050505-2');
    /* its wire spring (Feder 05 05 06-1: the coloured section's #24; no sheet) in its stud, at the top plate's hole 5 ("Drahtfeder", 05 08_1a: N 38.507 O 10.684, Körner 1.3,
       M 1.7, 4.73 from hole 4; 05 06_4's A-B marks the "Drahtfedermitte" beside the detent's arbor). Sizes off the photographs, each scaled by the hole table's own spacing (holes
       49, 3, 4 and 5 on the top plate: 8.8 px/mm from above, 11-12 from the north) and checked on the coloured section (9.37 px/mm by the plates' 19):
       the stud a plain cheese head screwed in from the outer face, Ø 3.0 × 1.9 (from above Wempe 3955's 2.6-2.9, Kirow 247's 2.8-2.9, Lange 5177's 3.3-3.5; from the north 2.8, 2.8,
       3.3; its height 1.8, 1.9, 2.0; the section's 3.4 × 1.87: likely ±0.3 and ±0.15), its slot 0.45 wide and 0.7 deep (the section's 0.47 × 0.73, Kirow 247's 0.48 × about 0.9,
       Wempe 3955's 0.4 × 0.6: likely), turned 10° off the N-S line toward 3 o'clock as Wempe 3955's (Kirow 247's N-S, Lange 5177's E-W: it's turned by hand); steel, as the
       section colours it and Kirow 247's and Lange 5177's are (Wempe 3955's is brass coloured); its shank M1.7 through the plate and 0.4 out under its inner face, the end rounded
       (the section, scaled: likely); the wire held in an axial hole 1.5 deep in that end (estimated: the section draws it leaving the end's middle, the photographs under the
       head's axis within 0.1-0.25). The wire: steel Ø 0.25 (its width against the hole spacing and the detent's arbor on 4_Wempe_3955_N, 4_Kirow_247_N, 4_Lange_5177_N:
       0.24-0.26, likely ±0.05), straight down past the detent's back (its r 18 edge, at the thick part) to 1.8 over the pillar plate (the section scales 1.8; Kirow 247 1.75,
       Wempe 3955 1.2, Lange 5177 3.3: likely ±0.4). Its axis lies 0.32 inside that edge (hole 5 against hole 4 and the detent's sheet), so the detent bends it out: a cantilever
       from the stud's end loaded at the arm's upper corner, 12.3 below, where alone it bears, pressing the detent onto the ratchet (as the teeth lift the detent, more). Upright
       across that, as the section draws it: the photographs lean it 1.8° (Wempe 3955) and 2.9° (Kirow 247) toward the arbor, 4.9° away (Lange 5177), each against the arbor's own
       lean in the frame, a set given by hand. Rebuilt in update() as the detent rides */
    const WR=TI+0.4,WH=1.5,WE=-1.8,WRW=0.125,WA=DTU-WR,WP=[H[5][0]-DX[0],-(H[5][1]-DX[1])];   /* the stud's end, the hole's depth, the wire's end, its radius, its arm to the corner, its axis (shape coordinates about hole 4) */
    const gWS=tag(K.headOn(loose(grp(gD,H[5][0]-DX[0],H[5][1]-DX[1]),0),'maintDetent','topPlate'),'wireStud');   /* in the Exploded view it stays in the top plate */
    {const r=1.5,hb=TT-1.2,w=0.225,v=[Math.sin(10*D2R),-Math.cos(10*D2R)],u=[-v[1],v[0]],t0=Math.acos(w/r),pt=t=>[r*Math.cos(t)*u[0]+r*Math.sin(t)*v[0],r*Math.cos(t)*u[1]+r*Math.sin(t)*v[1]];   /* plan: v along the slot (10° off N toward 3 o'clock, +x), u across it */
      const arc=(a,b,n)=>Array.from({length:n+1},(_,i)=>pt(a+(b-a)*i/n)),A=arc(-t0,t0,14),B=arc(Math.PI-t0,Math.PI+t0,14),C=[...arc(t0,Math.PI-t0,2),...arc(Math.PI+t0,TAU-t0,2)];   /* the slot's ends: the circle's short arcs, through the halves' chord ends */
      mesh(gWS,solidGeo([{loop:A,y0:TT-1.9,y1:TT},{loop:B,y0:TT-1.9,y1:TT},{loop:C,y0:hb,y1:TT}]),M.steel);   /* the head: its two halves, the slot's floor between them */
      mesh(gWS,turned([[0,TT-0.3],[0.85,TT-0.3],[0.85,WR-0.25],...[1,2,3,4,5].map(i=>{const a=i/6*Math.PI/2;return[0.6+0.25*Math.cos(a),WR-0.25+0.25*Math.sin(a)];}),[0.6,WR],[WRW,WR],[WRW,WR-WH],[0,WR-WH]],24),M.steel);}   /* the shank, from inside the head */
    /* the wire's deflection: the least that puts its section (WRW) clear of the detent's outline at the arm's upper face, its click turned g; along the outline's normal there */
    const wireDef=g=>{const c=Math.cos(g),s=Math.sin(g),Q=DTX.map(([x,y])=>[x*c-y*s,x*s+y*c]),pt=[WP[0],WP[1]];let dx=0,dy=0;
      for(let it=0;it<4;it++){let best=9,q=null;for(let i=0;i<Q.length;i++){const a=Q[i],b=Q[(i+1)%Q.length],ex=b[0]-a[0],ey=b[1]-a[1],t=Math.max(0,Math.min(1,((pt[0]-a[0])*ex+(pt[1]-a[1])*ey)/(ex*ex+ey*ey))),X=[a[0]+ex*t,a[1]+ey*t],d=Math.hypot(pt[0]-X[0],pt[1]-X[1]);if(d<best){best=d;q=X;}}
        const ins=KIT.pip(pt,Q),sd=ins?-best:best;if(sd>=WRW-1e-6||!q)break;const n=ins?[(q[0]-pt[0])/best,(q[1]-pt[1])/best]:[(pt[0]-q[0])/best,(pt[1]-q[1])/best],m=WRW-sd;pt[0]+=n[0]*m;pt[1]+=n[1]*m;dx+=n[0]*m;dy+=n[1]*m;}
      return[dx,dy];};
    function wireGeo(d){const P=[],f=y=>{const sv=y-WR;if(sv<=0)return 0;if(sv<=WA)return sv*sv*(3*WA-sv)/(2*WA*WA*WA);return 1+1.5*(sv-WA)/WA;};   /* the cantilever's shape, 1 at the corner, straight beyond it */
      const ys=[WR-WH,WR,...Array.from({length:12},(_,i)=>WR+WA*(i+1)/12),WE];for(const y of ys){const k=f(y);P.push([d[0]*k,y,-d[1]*k]);}
      const N=12,pos=[],nor=[],idx=[],n=P.length;
      for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],t=new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]).normalize(),e=new THREE.Vector3(1,0,0).cross(t).normalize(),h=new THREE.Vector3().crossVectors(t,e);
        for(let k=0;k<N;k++){const th=k/N*TAU,q=e.clone().multiplyScalar(Math.cos(th)).addScaledVector(h,Math.sin(th));pos.push(P[i][0]+q.x*WRW,P[i][1]+q.y*WRW,P[i][2]+q.z*WRW);nor.push(q.x,q.y,q.z);}}
      for(let i=0;i<n-1;i++)for(let k=0;k<N;k++){const a=i*N+k,b=i*N+(k+1)%N,c=b+N,e=a+N;idx.push(a,b,c,a,c,e);}
      for(const[i,sg]of[[0,-1],[n-1,1]]){const t=new THREE.Vector3(P[Math.min(n-1,i+1)][0]-P[Math.max(0,i-1)][0],P[Math.min(n-1,i+1)][1]-P[Math.max(0,i-1)][1],P[Math.min(n-1,i+1)][2]-P[Math.max(0,i-1)][2]).normalize().multiplyScalar(sg),o=pos.length/3;   /* the ends, flat, their own corners */
        for(let k=0;k<N;k++){pos.push(pos[(i*N+k)*3],pos[(i*N+k)*3+1],pos[(i*N+k)*3+2]);nor.push(t.x,t.y,t.z);}pos.push(P[i][0],P[i][1],P[i][2]);nor.push(t.x,t.y,t.z);
        for(let k=0;k<N;k++)idx.push(o+N,sg>0?o+k:o+(k+1)%N,sg>0?o+(k+1)%N:o+k);}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
      /* wound to face out: turned over if the volume comes out negative (as ribbonGeo) */
      let vol=0;const A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3();for(let i=0;i<idx.length;i+=3){A.fromArray(pos,idx[i]*3);B.fromArray(pos,idx[i+1]*3);C.fromArray(pos,idx[i+2]*3);vol+=A.dot(B.cross(C));}
      if(vol<0)for(let i=0;i<idx.length;i+=3){const s=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=s;}
      g.setIndex(idx);return g;}
    let wsA=0;const wsM=tag(mesh(gWS,wireGeo(wireDef(0)),M.steel),'050506-1');pD.userData.wire=wireDef(0);

    /* =============== the stop work: the bar (Stellungssteg 05 06 03-1, coloured section) in its slot across the fusee's small end, and the stop pin 05 08 01-5 =============== */
    /* 05 06_4 Schnitt C-D: the bar (its outline above) slides in the slot across the small end (05 06 04-2: 2 H8, 1.5 +0.05 deep, cut in the body above), 1.45 thick (the
       coloured section's), under the cover plate. The chronometer dial up, the small end faces down and the bar lies on the cover plate, its other face 0.05 under the slot's
       floor: so it reaches through the hub (0.3), the top turn's land (0.82) and its rib (0.33) and no further, 1.45 in all. Running, its spring holds it out toward its lower
       end, which stands out of the hub into the top turn's groove; when the chain winds onto the top turn there it presses that end in, and the upper end comes out past the
       hub, where the stop pin in the top plate ("Anschlagstift unten vorstehend", hole 7, 14.0 from the fusee) meets its far side at full wind ("Stellung im aufgezogenen
       Zustand"). Its slide is the chain's contact (barTravel, below) */
    const pSW=part('stopWork',-33),gSW=grp(pSW,fx,fz),gBar=new THREE.Group();gSW.add(gBar);gBar.rotation.y=barRot;pSW.userData.mTip=mTip;
    {const clip=(P,c,k)=>{const o=[],f=q=>k*(q[0]-c);for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];if(f(a)<=0)o.push(a);if(f(a)*f(b)<0){const t=f(a)/(f(a)-f(b));o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}return o;};
      const pl=P=>P.map(([u,v])=>[u,-v]);   /* the shape's (u, v) as solidGeo's plan (x, z) */
      tag(mesh(gBar,solidGeo([{loop:pl(clip(SBO,SB.ub,1)),y0:S,y1:S+1.45},{loop:pl(clip(SBO,SB.ub,-1)),y0:S,y1:S+SB.tt}]),M.steel),'050603-1');}   /* the bar's frame: x along it (u), the shape's y across (v); the first child, which slides */
    /* its spring (Stegfeder 05 06 03-3; no sheet: the coloured section names it, 05 06_4's C-D draws it in both positions): a steel strip in the small end's recess against
       its wall, from its end at the slot's near wall round the bar's upper side and the recess to a free span that comes in to the hole across the bar near its lower end,
       pressing the bar out toward that end. Its two drawn shapes traced on C-D (12.2 px/mm, each point at the line's darkest pixel; the dashed, wound one searched along rays
       through its gaps), scaled 0.989 as the bar, mirrored into the bar's frame: running it leaves the wall 152° round from the bar's upper end, wound (the bar slid 3.6) at 95°, looping
       in to 3.15 from the axis, 0.1 off the arbor's step. Drawn between the two as the bar slides (the drawn shapes' lengths differ by 4 %, 32.1 and 30.8: the drawing's
       precision). Its section isn't drawn (the coloured section leaves the recess between the bar's end and its wall, its full 1.6, uncoloured, where it colours steel blue): 1.0 high, a design value (anything from 0.9, its pin's Ø 0.5 hole through it, to 1.5, under the recess's 1.6, works: its push is linear in the height, its stress isn't; wempe_strength.js, and the bench's stop work test), on the cover plate as the bar, and 0.10 thick, worked from its two drawn shapes:
       between them its curvature changes by up to 0.064-0.073 /mm along its free span (its end pinned in the bar, unbent), so a strip t thick of hardened spring steel
       (206 GPa) is stressed 6,500-7,500 t MPa (t in mm) wound and pushes the bar out with 0.06-0.08 N half way, 0.11-0.16 N wound (its strain energy over the 3.6):
       at 0.10, half its steel's yield once a wind, and 20-30 times the bar's 0.5 g against a knock along it (C-D's double line, 0.15, would be stressed 0.7 of yield) */
    const SPW=7.5-0.05,SPU=[[-3.5,-5.638],[-3,-5.555],[-2.5,-5.632],[-2,-5.875],[-1.5,-6.202],[-1,-6.528],[-0.5,-6.705],[0,-6.868],[0.5,-7.018],[1,-7.03],[1.5,-7.03],[2,-7.03],[2.5,-6.942],[3,-6.78]],
      SPD=[[-3,-2.113],[-2.5,-2.188],[-2,-2.438],[-1.5,-3.0],[-1,-3.5],[-0.5,-3.912],[0,-4.238],[0.5,-4.405],[1.5,-4.72],[2,-4.807],[2.5,-4.808],[3.5,-4.57],[4.335,-4.489],[5.059,-3.953],[5.742,-3.315],[6.398,-2.585],[6.899,-1.72]];   /* C-D's (x right, y up from the axis; the bar on the left, its upper end up), mm */
    const toBar=P=>P.map(([x,y])=>{let u=0.989*y,v=0.989*x;const r=Math.hypot(u,v);if(r>SPW){u*=SPW/r;v*=SPW/r;}return[u,v];});   /* nowhere outside the wall */
    const SPA0=152.1*D2R,SPA1=95*D2R,SPE=-Math.asin(3.9/SPW);   /* where each leaves the wall (from the bar's upper end); the fixed end, 0.1 short of the slot */
    const spFree=(P,h,a)=>{const Q=[h,...toBar(P),[SPW*Math.cos(a),SPW*Math.sin(a)]],L=[0];for(let i=1;i<Q.length;i++)L.push(L[i-1]+Math.hypot(Q[i][0]-Q[i-1][0],Q[i][1]-Q[i-1][1]));
      return x=>{const t=x*L[L.length-1];let i=1;while(i<L.length-1&&L[i]<t)i++;const f=(t-L[i-1])/(L[i]-L[i-1]||1);return[Q[i-1][0]+(Q[i][0]-Q[i-1][0])*f,Q[i-1][1]+(Q[i][1]-Q[i-1][1])*f];};};
    const SF0=spFree(SPU,[SB.sp,-4],SPA0),SF1=spFree(SPD,[SB.sp+SB.tr,-4],SPA1);
    const spPath=t=>{const f=t/SB.tr,o=[[SB.sp+t,-5.0],[SB.sp+t,-4.5]];   /* its end 1 into the bar's hole */
      for(let k=0;k<=40;k++){const a=SF0(k/40),b=SF1(k/40);o.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);}
      const aD=SPA0+(SPA1-SPA0)*f,n=Math.ceil((aD-SPE)/(3*D2R));o[o.length-1]=[SPW*Math.cos(aD),SPW*Math.sin(aD)];
      for(let k=1;k<=n;k++){const a=aD+(SPE-aD)*k/n;o.push([SPW*Math.cos(a),SPW*Math.sin(a)]);}   /* along the wall to its fixed end */
      return o.map(([u,v])=>new THREE.Vector3(u,S+0.5,-v));};
    let spT=0;const spM=tag(mesh(gBar,ribbonGeo(spPath(0),0.10,1.0),M.blued),'050603-3');
    /* the spring's pin (Stift 05 06 04-4: the coloured section's label, its leader to this pin, and 05 06 04's parts list, piece 5, a 0.5 pin: likely; numbered 05 06 03-2 until
       17 October 2026; the hole "0,5 H7" in 05 06 04-2, not cut in it): along the slot, 1.5 from the line through the axis on the bar's side (02-2's "15"),
       from the recess, where it stands in to 6.4 from the axis through the spring (C-D), out through the end, which is uncut there (past N), its end's outer corner 0.02 inside
       the hub's Ø 21 (flush with it until 17 October 2026, its middle, when the groove's last land lay under it, so the corner stood through); at the spring's mid-height (estimated) */
    {let uo=9;for(let i=0;i<4;i++){const R=rBody(barRot+Math.atan2(-1.75,uo),LB-0.5);uo=Math.sqrt((R-0.02)**2-1.75*1.75);}const ui=Math.sqrt(6.4*6.4-2.25),g=new THREE.CylinderGeometry(0.25,0.25,uo-ui,12);
      g.rotateZ(Math.PI/2);g.translate((ui+uo)/2,S+0.5,1.5);tag(mesh(gBar,g,M.steel),'050604-4');}
    /* the bar's slide: its spring holds it out until the connector on the top turn, or coming down onto it, reaches its lower end; it then slides as far as keeps that end clear
       of the connector's inner side by 0.02 (the chain's plates 1.0 from its pitch line, 0.80 across; the band 0.11, 0.78 high), never past its 3.6. The connector's path (pitch line)
       from the update: on the fusee to its leaving point (index kf), then the run to the barrel */
    const LOW=[[SB.lf,-6],[-6.5,-6],[-6.5,-4],...SBO.filter(([u])=>u<-11)];   /* the lower end's outline in the bar's frame (the far side, across at u -6.5, the near side, the point's round; the oblique edge closes it) */
    const sd=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);};
    const crs=(a,b,c,d)=>{const o=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);return o(a,b,c)*o(a,b,d)<0&&o(c,d,a)*o(c,d,b)<0;};
    const inP=(p,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++)if((P[i][1]>p[1])!==(P[j][1]>p[1])&&p[0]<(P[j][0]-P[i][0])*(p[1]-P[i][1])/(P[j][1]-P[i][1])+P[i][0])c=!c;return c;};
    function barTravel(pts,kf,m0,Rf){if(m0<M_FULL-1.2)return 0;
      const half=conn==='chain'?1.0:0.11,hw=conn==='chain'?0.40:0.39,b=Rf+barRot,c=Math.cos(b),s_=Math.sin(b),Q=[];
      for(let k=Math.max(0,kf-160);k<=Math.min(kf+1,pts.length-1);k++){const P=pts[k];if(P.y-hw>=S+1.45-1e-6||P.y+hw<=S+1e-6){Q.push(null);continue;}
        const dx=P.x-fx,dy=-(P.z-fz),u=dx*c+dy*s_,v=-dx*s_+dy*c;Q.push(u<-2&&v<2?[u,v]:null);}
      const seg=[];for(let k=1;k<Q.length;k++)if(Q[k]&&Q[k-1])seg.push([Q[k-1],Q[k]]);if(!seg.length)return 0;
      const gap=t=>{const E=LOW.map(([u,v])=>[u+t,v]);let m=1e9;for(const[a,bq]of seg){if(inP(a,E))return -half;for(let i=0;i<E.length;i++){const p=E[i],q=E[(i+1)%E.length];
        const d=crs(a,bq,p,q)?0:Math.min(sd(a,p,q),sd(bq,p,q),sd(p,a,bq),sd(q,a,bq));if(d<m)m=d;}}return m-half-0.02;};
      if(gap(0)>=0)return 0;if(gap(SB.tr)<0){pSW.userData.jam=(pSW.userData.jam||0)+1;return SB.tr;}
      let lo=0,hi=SB.tr;for(let i=0;i<22;i++){const t=(lo+hi)/2;if(gap(t)>=0)hi=t;else lo=t;}return hi;}
    /* the stop pin 05 08 01-5 (no sheet): Ø 1.6 in the top plate's hole 7 (1.6 +0.009, reamed), flush with its outer face (estimated). Its length off the coloured section
       (Wempe_Einheitschronometer.jpg, its "Anschlagstift" leader followed across the barrel wall, the band and the maintaining detent's arbor to it, px 628-642 × 357-375):
       on the plate's drawn 31 px (3.35, so 9.25 px/mm), its straight sides 15 px (1.62) under the inner face, then a domed end 2.5 px (0.27), ±1 px each; its width 14 px
       (Ø 1.5, for 1.6). So 1.6 straight and a 0.25 dome, 1.85 in all; the bar's thin end, 1.235 under the face, bears on its straight part (the section draws the dome
       just past the bar's lower face: it draws the small end's stack 0.5 lower than the sheets put it, the cover plate's top level with the plate's face under an empty 0.5
       of the J-K recess, where the sheets leave 0.085) */
    {const PE=TI+1.6,PH=0.25,R=(0.64+PH*PH)/(2*PH),C=PE+PH-R,a0=Math.asin(0.8/R),cap=[];for(let i=0;i<=8;i++){const a=a0*(1-i/8);cap.push([R*Math.sin(a),C+R*Math.cos(a)]);}
      tag(mesh(P.topPlate,turned([[0,TT],[0.8,TT],...cap],20),M.steel,SPX[0],0,SPX[1]),'050801-5');}


    /* =============== the barrel 05 07 01 (Federhaus mit Deckel, as revised 20.4.48) =============== */
    /* The drum 05 07 01-1 (Federhaustrommel, Ms; drawn from a deep-drawn cup, R 05 07 01-1): Ø 41.6 -0.1 (drawn 41.6), 38.5 +0.1 inside, 18.1 -0.15 (drawn 18.08: its arbor's
       core sets it), the bottom 1.25 -0.1 with its boss: the land Ø 12, a 45° cone to the face Ø 8, 3.1 -0.1 from the outside, the bore 4.5 +0.1 (drawn 4.55); the lid's seat
       Ø 39.2 s6, 1.2 deep; the bottom's outer edge broken. Its bottom on the pillar plate's side, the lid toward the barrel bridge (05 07 01 draws the arbor's square through the
       lid; so does the coloured section). The mainspring's hook block 05 07 01-3 (3.05 -0.1 high, 3 wide) riveted inside the wall at the M2.6 hole 9.05 ±0.05 from the
       bottom's face, 45° from 9 o'clock; its radial depth 0.35 (estimated: as much as clears the spring's next coil). The slot for the chain's hook, cut at the fusee's assembly (0207: 2.5 wide), and the spring's slot
       in the wall (2 × 0.95) aren't cut in the turned drum. Gilt, as Wempe 3955's (7_Wempe_3955_W.jpg) */
    const pB=part('barrel',-33),gB=grp(pB,BX[0],BX[1]),gBL=rv(gB,'last'),gBF=rv(gB,'first 6mx');
    tag(mesh(gBL,ringT([[19.6,BR],[20.8,BR],[20.8,BB-0.2],[20.6,BB],[2.275,BB],[2.275,BBF],[4.0,BBF],[6.0,BI],[19.25,BI],[19.25,BR+1.2],[19.6,BR+1.2]],240),M.gilt),'050701-1');
    /* the lid 05 07 01-2 (Federhausdeckel, Ms 58, revised 20.4.48): sprung into the seat ("eingesprengt"), its face 0.6 -0.1 under the rim; 1.3 -0.1 thick (in the seat Ø 39.2
       r6, under it 0.05 clear of the wall: the sheet draws it 39.39 over all, the blank's); its boss 3.3 -0.1 from its face, the face Ø 8, a 45° cone to Ø 12; bore 4.55; its two
       notches (2 and 2.7 wide) left out */
    tag(mesh(gBL,ringT([[2.275,BLT],[19.6,BLT],[19.6,BR+1.2],[19.2,BR+1.2],[19.2,BLU],[6.0,BLU],[4.0,BLF],[2.275,BLF]],240),M.gilt),'050701-2');
    /* As first drawn, the barrel of 1941 (0207 Federhaus, 127-556.04 U24, 15.4.41, 5:1, scaled 12.0 px/mm by its 22.3; the drum 020701, U22; its ring 020701-3), in three pieces:
       the ring (Federhausring, Messingrohr 42 × 2, Ms 58) Ø 41.5 outside, 38.5 inside (0207: sure), 18 long (sure), the lid on the pillar plate's side ("warm einsprengen", the
       arbor's square through the bottom on the bridge's: sure), its face 3.7 off the plate and the bottom 0.6 under the bridge (22.3 between them, sure; 3.7 scaled 3.75), each
       sprung into a seat Ø 39.2 (020701-3: framed) at its end; the lid 1.2 and the bottom 1.0 thick (0207: sure; 020701's 1.2 leaves 15.6 inside, against the framed 15.8), 15.8
       between them (framed, sure); each with a boss standing 1.9 inward, its face 3.1 from the lid's outside and 2.9 from the bottom's (sure), Ø 9 with a 22½° cone out to Ø 12
       (020701: likely), bored 4.55 as the later drum's (020701's 4.5; 0207 draws the journals Ø 5). The ring's seats 0.35 wide, the joints drawn as faces. The hook block and
       the slots are the later drum's. The Soviet 6MX (the Variants' third version) has it too: its barrel cap is underneath, on the pillar plate's side (Altmeppen's
       list; Knirim's against Lange's Kal. 100), as this drum of the drawings' has it; Kirov No. 247's side views (4_, 6_Kirow_247_N, S) show a drum about Ø 41.5 × 18
       under the chain, too fine to tell this ring from the later drum turned over: likely */
    {const R1=20.75,Ri=19.25,Rs=19.6,yL=-3.7,yB=-21.7,yLi=yL-1.2,yBi=yB+1.0,bo=2.275;
      tag(mesh(gBF,ringT([[Rs,yB+1.0],[Rs,yB],[R1,yB],[R1,yL],[Rs,yL],[Rs,yL-1.2],[Ri,yL-1.2],[Ri,yB+1.0]],240),M.gilt),'050701-1');   /* the ring, its seats at both ends */
      tag(mesh(gBF,ringT([[bo,yL],[bo,yL-3.1],[4.5,yL-3.1],[6.0,yL-3.1+0.62],[6.0,yLi],[Rs,yLi],[Rs,yL]],240),M.gilt),'050701-2');   /* the lid on the plate's side, its boss inward */
      tag(mesh(gBF,ringT([[bo,yB],[Rs,yB],[Rs,yBi],[6.0,yBi],[6.0,yB+2.9-0.62],[4.5,yB+2.9],[bo,yB+2.9]],240),M.gilt),'050701-1',1);}   /* the bottom on the bridge's side */
    const BLK=1.2;   /* the hook block's angle in the drum */
    for(const g of[gBL,gBF]){const yb=BB-9.05,bg=new THREE.BoxGeometry(0.35,3.05,3.0);bg.translate(19.25-0.175,yb,0);bg.rotateY(BLK);tag(mesh(g,bg,M.steel),'050701-3');   /* in each state's drum (fixed to it) */
      const rg=new THREE.CylinderGeometry(1.3,1.3,1.5,20);rg.rotateZ(Math.PI/2);rg.translate(20.0,yb,0);rg.rotateY(BLK);tag(mesh(g,rg,M.steel),'050701-3',1);}
    /* the arbor 05 07 02 (Federkern kompl.): its pivot in the pillar plate (the 1941 arbor 020704-1's Ø 3, drawn 2.88 in the plate's 2.90 reamed: the arbor as last revised,
       05 07 02-1, isn't in the set), its end a ball, polished, 5 from the shoulder; the journals the drum's bosses run on (4.48 in their 4.55: 020704-1's 5 don't pass them),
       22.2 +0.1 between their outer shoulders (framed); the core Ø 13.3 between them, its ends chamfered 45° (05 07 01) to 0.05 off the bosses (10.98: the 1941 core's 12 can't
       pass the 1948 drum's 11.1 between its bosses); the pivot in the barrel bridge (drawn 3.88 in its 3.9 ±0.01), then the square 2.7 ±0.02 (1:100), 10 long, for the set-up
       ratchet. The hook (Federhaken 05 07 02-2): a pin Ø 2 in the core's hole, its end a ramp across it: 05 07 02's end view draws it rising over the pin's width from
       flush with the core to 0.5 -0.05 (drawn 0.475) at a radial face 15° from the vertical centre line (sure). The face takes the mainspring's eye, so it is put on the side
       the spring pulls (its coil runs on from its inner end the way rotation.y rises: the barrel's run, README): seen from the ball end, as the view reads that way (from the
       square's end the face would stand on the other side, and the spring would pull against the photographed set-up click: likely). Until 15 October 2026 a flat-topped pin
       0.5 proud. Präz. Rundstahl 14, hardened, tempered at 270 */
    const pBA=part('barrelArbor',-33),gBA=grp(pBA,BX[0],BX[1]);
    {const bal=[];for(let i=0;i<=6;i++){const t=Math.PI/2*i/6;bal.push([1.44*Math.cos(t),4.35+0.6*Math.sin(t)]);}
      const gAL=rv(gBA,'last'),gAF=rv(gBA,'first 6mx');
      tag(mesh(gAL,turned([[0,-25.70],[1.94,-25.70],[1.94,BA1],[2.24,BA1],[2.24,BC1],[4.5,BC1],[6.65,BC1+2.15],[6.65,BC0-2.15],[4.5,BC0],[2.24,BC0],[2.24,BA0],[1.44,BA0],...bal],48),M.steel),'050702-1');
      /* as first drawn the 1941 core between the 1941 drum's bosses: 020704-1's 12 long Ø 13.3 with its 22½° ends (sure), 0.05 off each boss (11.9) */
      {const c0=-3.7-3.1-0.05,c1=-21.7+2.9+0.05,ch=2.15*Math.tan(22.5*D2R);
        tag(mesh(gAF,turned([[0,-25.70],[1.94,-25.70],[1.94,BA1],[2.24,BA1],[2.24,c1],[4.5,c1],[6.65,c1+ch],[6.65,c0-ch],[4.5,c0],[2.24,c0],[2.24,BA0],[1.44,BA0],...bal],48),M.steel),'050702-1');}
      const sq=new THREE.CylinderGeometry(2.7/Math.SQRT2,2.605/Math.SQRT2,9.5,4,1);sq.translate(0,-25.70-4.75,0);tag(mesh(gBA,sq,M.steel),'050702-1',1);
      const pt=new THREE.CylinderGeometry(2.605/Math.SQRT2,0.3,0.5,4,1);pt.translate(0,-35.2-0.25,0);tag(mesh(gBA,pt,M.steel),'050702-1',1);
      /* the hook at its core's middle (0.51 lower as first drawn), in each state's group with its core */
      const HKS=[[gAL,(BC0+BC1)/2],[gAF,(-3.7-3.1-21.7+2.9)/2]].map(([g,y])=>[tag(mesh(g,new THREE.BufferGeometry(),M.steel),'050702-2'),y]);
      /* the pin along +x from 6.1 into the core; its end over the core (r 6.65) by 0.475 at its face (+z, the side rotation.y falls toward) down to 0 at its back (-z).
         05 07 02's end view, first-angle (DIN) and so seen from the square's end, from above (the square drawn solid), puts the square face on the side the arbor turns from
         and the ramp falling the way it turns: the spring's eye, pulled along the strip (rotation.y rising, as the coil winds outward), catches the face with its trailing edge
         and the strip lies over the ramp. The arbor is then pulled against the set-up click (anticlockwise from the dial), as the crossed chain has it (2_Kirow_2973_A: README).
         Until 16 October 2026 the face was on the other side, read from the ball end */
      var hookSet=a=>{for(const[hk,y]of HKS){const g=new THREE.CylinderGeometry(1.0,1.0,1.0,24,1),p=g.attributes.position;g.rotateZ(-Math.PI/2);
        for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setX(i,x>0?6.65+0.005+0.47*(1+z)/2:6.1);}
        g.computeVertexNormals();g.translate(0,y,0);g.rotateY(a);hk.geometry.dispose();hk.geometry=g;}};}
    /* the set-up ratchet 05 07 00-3 (Sperrad; Messingblech 3 Ms 58, revised 24.11.47): 16 teeth, tips Ø 14.1 -0.2, roots 11.1 -0.2 (drawn 14.0, 11.0), each face along a line 1.2
       off the radius (10°), the back an arc Ø 12.5 (r 6.25) whose centre lies on the Ø 6.4 circle: the sheet's "12,5" runs across the circle through its centre (its two ends on
       it, scaled 12.7 at 16.9 px/mm), its centre 3.24 from the axis (scaled), on the "6,4" circle (r 3.2): sure. Each back's centre falls 3.12 from the axis with the drawn tips and
       roots. Until 15 October 2026 the backs were arcs r 12.5 (read as a radius), nearly flat. 2.65 -0.1 thick (drawn 2.6); its square hole 2.7 H7 (1:100) on the arbor's square;
       turned so the click's beak lies against a face (the click and its place are the frame's, 05 08 05-2). Gilt */
    const SRO=(()=>{const z=16,P=TAU/z,o=[],rt=7.0,rr=5.5,RBK=12.5/2;
      for(let k=0;k<z;k++){const a=k*P,t=Math.asin(1.2/rt),u=Math.asin(1.2/rr);   /* the face: from the root to the tip along the line 1.2 off the radius */
        o.push(sh(rt,a+t));const A=sh(rt,a+t),B=sh(rr,a+P+u),m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d),h=Math.sqrt(RBK*RBK-l*l/4),c=[m[0]-d[1]/l*h,m[1]+d[0]/l*h];
        const a0=Math.atan2(A[1]-c[1],A[0]-c[0]),a1=Math.atan2(B[1]-c[1],B[0]-c[0]);for(let i=1;i<=8;i++){const aa=a0+wrap(a1-a0)*i/8;o.push([c[0]+RBK*Math.cos(aa),c[1]+RBK*Math.sin(aa)]);}}   /* the back r 6.25 from this tip to the next root */
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
    onRev(v=>{const f=v!=='last';gMS.position.y=f?(-3.7-1.2-21.7+1.0)/2-(MS0+MS1)/2:0;});   /* as first drawn the same spring in the middle of the 1941 drum's 15.8 (0207: "Zugfeder 15"), 0.44 lower */
    /* its turns T: from its inner end, its tip 0.18 behind the arbor's hook (HKA), the hook in its eye (until 16 October 2026 the tip 0.18 past the hook, abutting its face from
       the side the pull leaves it on), winding outward the way the drum runs (rotation.y rising), to its outer end 0.08 short of the drum's
       block; set up 0.75 turn past lying all on the wall at run down (with the chain: the band turns the drum a little less, so its set-up there is a little more), which sets
       the hook's angle */
    const MST0=msT+0.75,HKA=wrap(BLK+BETA_RUN.chain+0.10-MST0*TAU);hookSet(HKA);const msK=Math.round(MST0-(BLK+BETA_RUN.chain+0.10-HKA)/TAU),msTurns=beta=>(BLK+beta+0.10-HKA)/TAU+msK;
    function msGeo(T){const ni=msShape(T),no=T-1-ni,r1=MSa+MST*ni,r2=MSR-MST*no,P=[],n=Math.ceil(T*64),ym=(MS0+MS1)/2;
      for(let i=0;i<=n;i++){const tau=T*i/n;let r;if(tau<=ni)r=MSa+MST*tau;else if(tau<=ni+1){const f=tau-ni;r=r1+(r2-r1)*(f*f*(3-2*f));}else r=r2+MST*(tau-ni-1);
        const a=HKA-0.18+TAU*tau;P.push(new THREE.Vector3(r*Math.cos(a),ym,-r*Math.sin(a)));}
      return ribbonGeo(P,0.36,Math.abs(MS1-MS0));}

    /* =============== the chain 05 07 04 (Kette) and the band 05 07 03 (Schneckenband) =============== */
    /* the chain: hardened, tempered at 310°, lightly polished: the plates' figure of eight (two lobes r 1 round the rivets, waisted to 1.2 between them: scaled on 05 07 04),
       an outer link two plates and its two rivets Ø 0.55 (the rivet stock 0.6), an inner link one plate; instanced, laid along the pitch line every update */
    const pC=part('chain',-33),gC=new THREE.Group();pC.add(gC);
    const plate=y=>{const s=new THREE.Shape(),r=1.0,tw=Math.asin(0.6/r);s.absarc(1.025,0,r,tw-Math.PI,Math.PI-tw,false);s.absarc(-1.025,0,r,tw,TAU-tw,false);s.closePath();
      const g=extrude(s,{depth:0.26,bevelEnabled:false,curveSegments:12});g.rotateX(-Math.PI/2);g.translate(0,y-0.13,0);return g;};
    const I4=new THREE.Matrix4(),geoA=mergeGeo([[plate(0.27),I4],[plate(-0.27),I4],...[1.025,-1.025].map(x=>[cylY(0.275,0.80,10),new THREE.Matrix4().makeTranslation(x,0,0)])]),geoB=plate(0);
    const MAXL=200,imA=new THREE.InstancedMesh(geoA,M.chain,MAXL),imB=new THREE.InstancedMesh(geoB,M.chain2,MAXL);gC.add(imA,imB);imA.frustumCulled=imB.frustumCulled=false;tag(imA,'050704');tag(imB,'050704',1);
    /* its hooks (from the strip 10 × 0.9): both side views of 05 07 04 draw each one solid bar the chain's full width (the framed 0.82 ±0.02), the links' three layers
       starting at its rivet: drawn 0.80 thick, the chain's outer links' width; each end link is an outer pair (the chain's first and last, 375 links), so the hook's eye is
       thinned to the inner links' 0.26 where it lies between that pair's plates, out to r 1.1 about its rivet (the plates' lobes r 1.0: where the step falls isn't drawn,
       estimated). Until 16 October 2026 both were the middle layer's 0.26 throughout. Their outlines
       traced on 05 07 04 (5:1, 17.1 px/mm by the top hook's 3.5) and put to its figures where the drawing isn't to scale. Each has an eye r 1 round its rivet, as the plates'.
       The top hook, round the fusee's pin: 5 from its rivet to its crown, 3.5 wide; its shank's outer edge 1.0 off the rivet's line, its throat's inner wall 1.8 from it, the
       throat's round end r 0.4 (the pin's seat) 3.5 from the rivet (drawn 3.0); its nose turned back toward the chain, reaching 2 from the rivet 2.5 across, its inner edge
       at 30° to the chain's line, tangent to the seat (with these figures the 30° can only be to the chain's line); the crown an arc r 1.55 (traced). The pin enters the throat
       from the nose's side and the chain's pull holds it in the seat: the hook lies with its seat on the pin (place()). The bottom hook, into the drum's slot: its barb's root
       3.5 from its last rivet (drawn 3.0), the barb's flank at 50° to the shank, its tip 1.4 past the shank's edge, pointing back toward the rivet; the barb's lower end 5 and
       the tip, round r 0.6, 7.5 from the rivet; its back r 8 and the shank's edge below the barb r 20 (traced). Its barb toward the drum, into the slot cut at the fusee's
       assembly (0207), not in the turned drum. All sure but the traced arcs (likely). Until 15 October 2026 the top hook was 3.95 long and 2.8 wide, its throat round the
       pin, and the bottom hook's barb hooked forward, 5.2 from its rivet, on the side away from the drum */
    const arcP=(o,c,r,a0,a1,n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}return o;};
    const HKSEAT=[3.5,-1.2];   /* the top hook's seat (x along it from its rivet, y across) */
    const HKT=(()=>{const o=[],c1=HKSEAT,T1=[c1[0]+0.4*Math.cos(-60*D2R),c1[1]+0.4*Math.sin(-60*D2R)];   /* x from its rivet toward the crown, y across: the throat and nose on -y */
      arcP(o,[0,0],1,Math.atan2(-0.8,0.6),-1.5*Math.PI,16);   /* the eye, from the throat's wall round the rivet to the outer edge */
      arcP(o,[3.45,-0.55],1.55,Math.PI/2,-Math.PI/2,16);   /* the outer edge (y 1.0) up to the crown, over it */
      o.push([2.9,-2.35],[2.35,-2.5],[2.12,-2.55],[2.0,-2.53]);   /* the outer side down to the nose, 2 from the rivet */
      arcP(o,c1,0.4,Math.atan2(T1[1]-c1[1],T1[0]-c1[0]),Math.PI/2,10);   /* the nose's inner edge (30° to the chain) up to the seat, round it to the throat's wall */
      return o;})();
    const HKB=(()=>{const o=[];   /* (u across, the barb on +u; v along from its rivet toward its tip) */
      arcP(o,[0,0],1,Math.atan2(0.3,-0.95),TAU+Math.atan2(0.53,0.85),16);   /* the eye */
      o.push([0.78,3.3],[0.82,3.42],[0.933,3.371],[2.18,2.33],[2.2,2.45],[2.12,3.0],[1.96,3.86],[1.38,4.55],[0.8,5.0],[0.91,6.05]);   /* the shank's edge to the barb's root, the barb, its front */
      arcP(o,[0.37,6.9],0.6,0,Math.PI,10);   /* the tip */
      o.push([-0.43,5.59],[-0.72,4.19],[-0.84,1.73]);   /* the back up to the eye */
      return o.map(([u,v])=>[v,-u]);})();   /* x along it, y across: the barb on -y, toward the drum (place()) */
    /* the outline less the disc r about its rivet (at the origin): walked round, the points inside the disc dropped and the disc's arc put in where the outline crosses it,
       the way round that lies inside the outline */
    const offEye=(o,r)=>{const n=o.length,ins=q=>Math.hypot(q[0],q[1])<r,X=(p,q)=>{const d=[q[0]-p[0],q[1]-p[1]],A=d[0]*d[0]+d[1]*d[1],B=2*(p[0]*d[0]+p[1]*d[1]),C=p[0]*p[0]+p[1]*p[1]-r*r,
        t=(-B+(ins(p)?1:-1)*Math.sqrt(Math.max(0,B*B-4*A*C)))/(2*A);return[p[0]+d[0]*t,p[1]+d[1]*t];};
      const inPoly=q=>{let c=false;for(let i=0,j=n-1;i<n;j=i++){const a=o[i],b=o[j];if((a[1]>q[1])!==(b[1]>q[1])&&q[0]<(b[0]-a[0])*(q[1]-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;};
      let k=o.findIndex(q=>!ins(q));const out=[];let enter=null;
      for(let i=0;i<n;i++){const p=o[(k+i)%n],q=o[(k+i+1)%n];if(!ins(p))out.push(p);
        if(!ins(p)&&ins(q))enter=X(p,q);
        if(ins(p)&&!ins(q)){const ex=X(p,q),a0=Math.atan2(enter[1],enter[0]),a1=Math.atan2(ex[1],ex[0]);let da=a1-a0;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
          const am=a0+da/2;if(!inPoly([r*Math.cos(am),r*Math.sin(am)]))da-=Math.sign(da)*TAU;
          const N=Math.max(4,Math.ceil(Math.abs(da)/(8*D2R)));for(let j=0;j<=N;j++){const a=a0+da*j/N;out.push([r*Math.cos(a),r*Math.sin(a)]);}}}
      return out;};
    const hkMesh=(o,id,mat)=>{const g=new THREE.Group();gC.add(g);tag(mesh(g,slab(o,[],-0.13,0.13),mat),id,1);
      const b=offEye(o,1.1);tag(mesh(g,slab(b,[],0.13,0.40),mat),id,1);tag(mesh(g,slab(b,[],-0.40,-0.13),mat),id,1);return g;};   /* the eye 0.26; the body 0.80 */
    const cHT=hkMesh(HKT,'050704',M.chain),cHB=hkMesh(HKB,'050704',M.chain);
    /* the band: its strip a ribbon along its pitch line; its hooks (Bandstahl 10 × 0.8, brazed to it): the round hook 05 07 03-2 (its back r 6, the crown r 1.5, the nose 1.7
       from the band's slot with r 0.4 at its tip) round the fusee's pin, the drum's hook 05 07 03-3 (its back r 10, front r 20, a barb 1.4 out, the tip 4.5 above the barb)
       into the drum's slot: outlines approximated on those figures */
    const pBd=part('band',-33),gBd=new THREE.Group();pBd.add(gBd);const bdM=tag(mesh(gBd,new THREE.BufferGeometry(),M.steel),'050703-1');
    const BHT=[[0,-0.45],[1.4,-0.6],[2.6,-0.25],[3.2,0.5],[2.9,1.35],[2.0,1.6],[1.3,1.2],[1.6,0.75],[2.1,0.6],[2.2,0.15],[1.5,0.0],[0,0.45]];
    const BHB=[[0,-0.45],[2.0,-0.55],[4.5,-0.6],[6.9,-0.4],[7.0,-0.05],[6.2,0.3],[4.9,0.75],[4.6,1.15],[2.5,0.7],[0,0.45]];
    const hkB=(o,id)=>{const g=new THREE.Group();gBd.add(g);tag(mesh(g,slab(o,[],-0.38,0.38),M.chain),id);return g;};
    const bHT=hkB(BHT,'050703-2'),bHB=hkB(BHB,'050703-3');

    /* the chain's first rivet: where along the chain's path (from its start, m 0) the top hook's seat, 3.70 from its rivet, reaches the pin (about 0.4: the path starts at
       the flange's slot on the chain's pitch line, which the hook's real run into the deepened slot below it shortens) */
    const HK0=(()=>{const q=pol(PINR,PINA),SD=Math.hypot(...HKSEAT),of=CONN.chain.of,P=m=>{const a=pol(rf(m)+of,PHI0+TAU*m);return[a[0],yc(m),a[1]];},dh=b=>Math.hypot(b[0]-q[0],b[2]-q[1]);
      let s=0,a=P(0);if(dh(a)>=SD)return 0;for(let i=1;i<=400;i++){const b=P(i/4000),sg=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);if(dh(b)>=SD)return s+sg*(SD-dh(a))/(dh(b)-dh(a));s+=sg;a=b;}return s;})();
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
      /* its wire spring follows it */
      if(Math.abs(gDc.rotation.y-wsA)>1e-4){wsA=gDc.rotation.y;const d=wireDef(wsA);pD.userData.wire=d;wsM.geometry.dispose();wsM.geometry=wireGeo(d);}
      /* the chain or band, the barrel and the mainspring, and the stop bar: only when the fusee has moved */
      if(last.n!==null&&Math.abs(last.Rf-Rf)<1e-4&&last.conn===conn)return Rf;last.n=n;last.Rf=Rf;last.conn=conn;
      const m0=cg.m0Of(Rf),run=cg.runOf(m0),sT=cg.lf(m0)+run.S,L=CONN[conn].len,rbp=cg.rbp;
      const beta=run.psi+Math.PI-(L-sT)/rbp-BLK0[conn];gB.rotation.y=beta;
      /* the path: on the fusee from its first rivet (m 0) to m0, the run, round the barrel to the end */
      const pts=[],Pf=m=>{const r=rf(m)+CONN[conn].of,q=pol(r,PHI0+TAU*m+Rf);return new THREE.Vector3(fx+q[0],yc(m),fz+q[1]);};
      for(let m=0;m<m0;m+=1/144)pts.push(Pf(m));pts.push(Pf(m0));const kf=pts.length-1;
      /* on the barrel each piece of the chain lies at the height it left the fusee at; what stays on it fully wound (a quarter turn) at the top turn's */
      const nb=Math.max(2,Math.ceil((L-sT)/(rbp*TAU/144)));for(let i=0;i<=nb;i++){const sv=sT+(L-sT)*i/nb,a=run.psi+Math.PI-(sv-sT)/rbp,mm=cg.mOf(sv),yy=yc(Math.min(mm,M_FULL));
        const q=pol(rbp,a);pts.push(new THREE.Vector3(BX[0]+q[0],yy,BX[1]+q[1]));}
      if(conn==='chain'){const PC=CONN.chain.PC,NJ=CONN.chain.NJ,J=[];let acc=0,next=HK0;   /* the first rivet HK0 along the path, where the top hook's seat reaches the pin */
        for(let i=1;i<pts.length&&J.length<=NJ;i++){const seg=pts[i].distanceTo(pts[i-1]);while(acc+seg>=next&&J.length<=NJ){J.push(new THREE.Vector3().lerpVectors(pts[i-1],pts[i],(next-acc)/seg));next+=PC;}acc+=seg;}
        const mtx=new THREE.Matrix4(),t=new THREE.Vector3(),up=new THREE.Vector3(),nn=new THREE.Vector3(),pos=new THREE.Vector3();let ia=0,ib=0;
        for(let k=0;k+1<J.length;k++){pos.addVectors(J[k],J[k+1]).multiplyScalar(0.5);t.subVectors(J[k+1],J[k]).normalize();up.set(0,1,0).addScaledVector(t,-t.y).normalize();nn.crossVectors(t,up);
          mtx.makeBasis(t,up,nn).setPosition(pos);if(k%2===0)imA.setMatrixAt(ia++,mtx);else imB.setMatrixAt(ib++,mtx);}
        imA.count=ia;imB.count=ib;imA.instanceMatrix.needsUpdate=true;imB.instanceMatrix.needsUpdate=true;
        /* the hooks: the top one from the first rivet back to the pin, the bottom one on from the last rivet along the drum */
        const nJ=J.length-1;place(cHT,J[0],PINA,Rf,'top',Math.atan2(HKSEAT[1],HKSEAT[0]),J[1].clone().sub(J[0]).normalize());place(cHB,J[nJ],null,beta,'bot',0,J[nJ].clone().sub(J[nJ-1]).normalize());}
      else{bdM.geometry.dispose();bdM.geometry=ribbonGeo(pts,0.22,0.78);place(bHT,pts[0],PINA,Rf,'top');place(bHB,pts[pts.length-1],null,beta,'bot');}
      /* the mainspring: the barrel's turns from run down give its turns (its outer end turns with the drum, its inner end stays with the arbor) */
      const T=msTurns(beta);msM.geometry.dispose();msM.geometry=msGeo(Math.max(msT+0.1,T));pMS.userData.T=T;
      /* the stop bar: as far in as the connector presses it; its spring follows */
      const tr=barTravel(pts,kf,m0,Rf);gBar.children[0].position.x=tr;pSW.userData.travel=tr;
      if(Math.abs(tr-spT)>1e-4){spT=tr;spM.geometry.dispose();spM.geometry=ribbonGeo(spPath(tr),0.10,1.0);}
      return Rf;}
    /* the hooks' places: the top hook from the connector's first point back to the fusee's pin; the bottom hook on from its last point along the drum */
    /* phi: the angle of the hook's seat off its own line (the chain's top hook), which then lies on the pin; t: the end link's direction, whose plates the hook lies between
       (the chain's hooks, tilted with it as it rises out of the flange's slot) */
    /* The top hook lies level in the flange's slot: the pin through both ribs and the slot (0.87 for its 0.80) hold it within 0.8° of the fusee's plane, the end link
       turning about its rivet as the chain leaves the slot (until 16 October 2026 tilted with that link, which put its crown 0.03 into the first rib at run down) */
    function place(g,p,pa,rot,which,phi=0,t=null){const up=new THREE.Vector3(0,1,0);if(t&&which!=='top')up.addScaledVector(t,-t.y).normalize();
      if(which==='top'){const q=pol(PINR,pa+rot),P=new THREE.Vector3(fx+q[0],p.y,fz+q[1]),d=new THREE.Vector3().subVectors(P,p);d.addScaledVector(up,-d.dot(up));const L=d.length();d.normalize().applyAxisAngle(up,-phi);const n=new THREE.Vector3().crossVectors(d,up);
        const m=new THREE.Matrix4().makeBasis(d,up,n).setPosition(p);g.matrixAutoUpdate=false;g.matrix.copy(m);g.userData.span=L;}
      else{const v=new THREE.Vector3(p.x-BX[0],0,p.z-BX[1]).normalize(),d=new THREE.Vector3().crossVectors(v,up).normalize(),n=new THREE.Vector3().crossVectors(d,up);
        const m=new THREE.Matrix4().makeBasis(d,up,n).setPosition(p);g.matrixAutoUpdate=false;g.matrix.copy(m);}}
    pB.userData.blk=BLK;
    /* keySeat: where the winding key goes on (case.js keyAt): the dust plate's group, turning with the fusee and spread with the dust plate in the Exploded view (so the key
       stays outside the dust bush, which spreads further than the fusee), and the plate's face toward the key (y0 above: 7 from the square's root, where it is 3.1 across, as
       the key's square), where the square stops the key's socket; the tube's mouth, Ø 5.95, comes over the plate's recess there, Ø 6.2 */
    return{update,setConn,get conn(){return conn;},keySeat:{g:gSP,y:yT-15},NRUN,MW:CG.chain.m0Of(CG.chain.RF0),HPT:90/14,CG,rf,yc,ac,SEAT,P35,MST0,msT,rBody,stack:{yD,yT,VHF,VFA,W,WT,G,GT,GP,F,S,DP0,DTU,DTL,BB,BR}};}
  return{build};
})();
