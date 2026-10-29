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
  /* chamf(R, c, N, y0, y1, up): a disc's outer edge broken c × 45° on its y1 face (up) or its y0 face, for solidGeo: the disc's loop inside the chamfer (r R - c, N points,
     the cell its features go in) and the chamfer's ring as N quads between it and r R, each a sloped cell (solidGeo takes no features in those), sharing the inner cell's
     points the other way round; the slope is the cone's, chord by chord (25 October 2026) */
  const chamf=(R,c,N,y0,y1,up)=>{const I=ring(0,0,R-c,N),O=ring(0,0,R,N),f=(/** @type {number[]} */p)=>{const d=Math.hypot(p[0],p[1])-(R-c);return d<1e-9?0:Math.min(c,d);},cells=[];
    for(let i=0;i<N;i++){const j=(i+1)%N;cells.push({loop:[I[j],I[i],O[i],O[j]],y0:up?y0:(/** @type {number[]} */p)=>y0+f(p),y1:up?(/** @type {number[]} */p)=>y1-f(p):y1});}return{I,cells};};
  const FX=H[10],BX=H[45],DX=H[4],SPX=H[7];   /* the fusee's, barrel's, maintaining detent's and stop pin's holes */
  const pol=(r,a)=>[r*Math.cos(a),-r*Math.sin(a)],angOf=(x,z)=>Math.atan2(-z,x),wrap=a=>Math.atan2(Math.sin(a),Math.cos(a)),fr=x=>x-Math.floor(x);
  const sh=(r,a)=>[r*Math.cos(a),r*Math.sin(a)];   /* a point of a shape's outline (x, y): its polar angle is the angle above */
  /* ---------- the stack (y), every height from a sheet or from the figures beside it (README) ----------
     The fusee arbor 05 06 04-1: 19.7 +0.05 between its shoulders, the dial-side one 0.025 off the pillar plate's inner face, the other 0.025 under the fusee bush (whose end is
     0.05 under the top plate's J-K recess floor, 19.75 from the pillar plate: frame.js). The Vorreiber's pin (05 06 00-5) through the arbor's cross hole, 2 from the dial
     shoulder (05 06 04-1's 19.7 less 17.7), its centre 1.1 from the Vorreiber's hub face (05 06 00-2; the coloured section draws it so), so the hub face 0.9 off the shoulder;
     its face a, re-turned at the fusee's assembly ("bei Schneckenmontage ... Fläche a nachdrehen"), 2.76 from the hub face (the sheet's 3.1 -0.2, its flange 1.2 -0.2 taken to
     0.86: what the stack under the fusee body's face needs, below), carries the fusee wheel's underside recess (05 06 00-3: 14 +0.1, 1.3 -0.1 deep), so the wheel's underside
     2.385 off the plate (the coloured section's 2.4). On the wheel, the maintaining spring (1.3, in its 32.3 recess on the web, 1.22), then the maintaining ratchet 0.05 over
     the wheel's rim (2.62), its teeth at 5.08-6.1 off the plate (the coloured section's ratchet to 6.1), where the maintaining detent's tip lies (05 05 05: its upper face
     6.3 ±0.1 from its lower shoulder, the tip 1 thick at that face; set at 6.2, the sheet's least, so the tip covers 0.85 of the teeth's 1.02 and stands 0.15 past their face);
     the fusee body's large end 0.05 over the ratchet's plate, its cup inside the body's recess (Ø 26.3 × 2.7 as turned); the click wheel on the recess's floor, at the clicks'
     height in the cup; the body to its small end, the cover plate (0.8) on it, 0.425 under the J-K recess's floor (the coloured section's empty 0.5).
     The body's place on its arbor (05 06 04 as revised 2.3.48): pressed on, its large face is re-turned true to the arbor ("(a) Fläche muß schlagfrei zur Welle laufen")
     to "13,7 -0,1" from the end of the arbor's Ø 6.1 step (taken at 13.6, the old "13,6 +0,1" and the new band's common end, which keeps the stack's 0.05 gaps), leaving
     the click wheel's face "0,5 +0,05" under it: 0.2 off the turned blank's face (RT; the click wheel 0.7 under the blank's, 2.7 less its 2), so the body 12.35 long (the
     sheet's bracketed reference 12.3), the flange's first rib 0.56 and the "2" over both ribs 1.8 (the bracketed reference 1.6, carried over from before the revision, is
     the one figure it leaves); the groove, cut before, keeps its place from the small end (N 0.3). Outside "33∅ +0,1" the face falls back 5° ("5°", an angle at the
     flange's outer corner with one leg on the 33's extension line), 0.114 at the rim: so the face bears on the ratchet's plate only inside Ø 33 (the purpose inferred).
     Measured on 05 06_3.2 (25 October 2026; line centres on profiles, 12.02 px/mm by the arbor's 19.7 and 7.9 + 3.1): the face 13.61 from the step's end, the click
     wheel 0.60 under it, the small end 1.29 from the step's end, the recess floor 11.24 (here 13.6, 0.5, 1.25, 11.1). Until 25 October 2026 the face 13.46 from the step's
     end, not re-turned, and face a 2.9 */
  const VPR=WD.FA.VPR;                                          /* the Vorreiber's pin's holes, reamed through hub and arbor together: Ø 1.15 (below) */
  const yD=WD.FA.yD,yT=yD-WD.FA.len,SQ0=WD.FA.SQ0;                     /* the fusee arbor's shoulders; its winding square across the flats at its root (05 06 04-1: 3,1 r6, 1:100) */
  const VHF=yD-0.9,VFA=VHF-2.76,VFB=VHF-1.9;                 /* the Vorreiber's hub face, face a, the flange's lower face */
  const W=VFA+1.3,WT=W-2.62,WW=W-1.22,WL=W-2.42,WTB=W-5.0;   /* the fusee wheel: underside, rim/hub top, web top, ledge top, its tube's top */
  const GS0=WW,GS1=WW-1.3;                                   /* the maintaining spring */
  const G=WT-0.05,GT=G-1.02,GP=G-1.3,GC=G-3.1;               /* the maintaining ratchet: underside, the plate's face at the teeth, its face inside the cup (the cup's floor), the cup's rim */
  const F=GT-0.05,RT=0.2,F0=F+RT,LB=12.55,S=F0-LB,FRC=F0-2.7;   /* the fusee body: large end face (re-turned: yT + 13.6), the re-turn, the blank's face as turned (every depth
                                                             of 05 06 04-2's from it), the blank's length, small end face, the large end's recess floor */
  const CW0=FRC,CW1=FRC+2;                                   /* the click wheel, on the recess floor */
  const DP0=S-0.8;                                           /* the cover plate (Deckplatte), S to DP0 */
  const SLD=1.5;                                             /* the stop bar's slot across the small end: 1.5 +0.05 deep (05 06 04-2) */
  const DTU=yD-6.2,DTL=DTU+2,DTT=DTU+1;                      /* the maintaining detent: upper face, lower face (its thick part), the tip's lower face (thin, 1, at the upper face) */
  const BRD=WD.BAR,BB=BRD.BB,BR=BB-BRD.h,BI=BB-BRD.bi,BBF=BB-BRD.bf,BLT=BR,BLU=BLT+BRD.lu,BLF=BLT+BRD.lf;   /* the barrel: bottom's outer face, rim, bottom's inner face, its boss's face, the lid's top (flush with the rim: 05 07 01 and the coloured section draw it so, the "0,6" running from the arbor's shoulder to it; 0.6 under the rim until 26 October 2026), underside (the lid 1.2: its 1,3 -0,1 at the drum's 1,2 seat, below), boss face */
  const BA0=WD.BAR.BA0,BA1=WD.BAR.BA1,BC0=BBF-WD.BAR.e,BC1=BLF+WD.BAR.e;       /* the barrel arbor's shoulders (22.29 apart, 22.2 +0.1: 0.06 endshake) and its core's ends, 0.05 off the bosses */
  const RS0=TT-3.32-0.05,RS1=RS0-2.65;                       /* the set-up ratchet, beside the click on the barrel bridge */
  const MS0=(BI+BLU)/2+7.5,MS1=(BI+BLU)/2-7.5;               /* the mainspring's edges, 15 high (05 06_20's "Zugfeder 15 × 0,37"), in the middle of the drum's 15.63 inside (14.8 high until 26 October 2026, under the lid sunk 0.6; 15.53 under a 1.3 seat until 27 October 2026); its middle 0.015 off the hook block's (9,05 from the bottom's face: 05 07 01-1) */

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
  const yc=m=>F0-ac(m);
  /* the fusee's radius field: the flange (Ø 35.6, its two ribs and the slot between them, 0.87 wide, floor r 17.25), the slot deepened under the chain's pin (a cutter Ø 13.5,
     2.9 deep), the groove, and the small end's hub (Ø 21). The groove is cut only to its end N ("Gangende Punkt N", 0.3 from the small end: MN, the turn whose land's
     small-end edge is there); past N the end stays uncut at the hub's Ø 21, and so does the last turn's rib, so the hub's inner face follows the helix: 05 06 04-2's
     Schnitt A-B draws the end so, the last land against a block at Ø 21 0.3 thick at D (N's side) and about 1.3 at C (scaled at 12.1 px/mm: likely), with no rib
     between them. Until 17 October 2026 the hub was 0.3 all round with the groove cut on under it past N, which left the stop bar's slot cutting a loose flange and ribs */
  const MN=(LB-0.3-WLD/2-A0)/PAX;   /* 8.817: 0.067 turn past the full wind's 8.75, as 02-2's view C-D draws N past the groove's end at 8.75 */
  /* the chain's pin (A on the sheet's view C-D) at PHI0-0.17, just behind the groove's start, 1 under the ribs' tops (the view's "1"), in the middle of the cutter's arc (the view
     centres the arc on A): section A-B, through the pin, draws both ribs whole to their tops with the pin's hole across them and the slot between them about 2.8 deep (scaled),
     so the cutter is a slitting cutter in the slot, deepening it where the hook wraps the pin, not a flat across the ribs. Plunged 0.2 deeper than the sheet's 2,9 ±0,1 from
     the rim (05 06 04-2): its floor r 14.7 at the pin, so the band's round hook (05 07 03-2, 1943), whose crown wraps the pin to r 14.73 (r 2.08 about its seat, 05 07_12),
     clears it (the owner's choice, 28 October 2026: drawing check 2's O-5, N-2; the band's hook and the 1948 body don't agree there and no sheet says which gives way; until
     then 2.9, the hook 0.550 mm³ into the floor); the chain's top hook (05 07 04) fits it as before */
  const PHI0=0,PINA=PHI0-0.17,PINR=16.8,FLAT=PINA,RC=17.8-2.9-0.2+6.75;
  const rCut=th=>{const d=wrap(th-FLAT),q=RC*Math.sin(d);if(Math.abs(q)>=6.75||Math.cos(d)<0)return 99;return RC*Math.cos(d)-Math.sqrt(6.75*6.75-q*q);};
  const T5=Math.tan(5*D2R);   /* the face's fall outside Ø 33 (05 06 04's "33∅ +0,1" and "5°") */
  function rBody(th,a){   /* a from the blank's face (F0); the re-turned face at RT */
    if(a>=LB-0.3-1e-9)return 10.5;
    let r=17.8;   /* the slot between the ribs isn't turned all round: it is the groove's turn 0 where it starts at A (its floor the "Grund" 17.25) and the cutter's arc
       at the pin (rCut), and elsewhere the flange stands at its full radius over both ribs' width: Schnitt A-B's lower half, through B, draws the large end as one land at
       full radius, about 1.15 wide (14 px at 12.1 px/mm), then the first turn's land (drawing check 2, 5-M9: likely; until 28 October 2026 the slot, floor r 17.25, turned
       all round, which the upper half through A alone draws) */
    if(a<RT+1.3*T5)r=Math.min(r,16.5+Math.max(0,a-RT)/T5);
    if(a>=FR1){const mt=fr((th-PHI0)/TAU);let j=Math.floor((a-(ac(mt)-WLD/2))/PAX),m=mt+j;
      while(m+1>=0.15&&a>=ac(m+1)-WLD/2)m+=1;while(m>=0&&a<ac(m)-WLD/2)m-=1;   /* the turn whose land (or rib) holds a */
      if(m>=0){const d=a-(ac(m)-WLD/2);if(m>MN||(d>=WLD&&m+1>MN))return 10.5;   /* past N, or the last land's rib: the uncut end */
        if(d<WLD)r=Math.min(r,rf(m));else if(a>=FS1||m>0.3)r=Math.min(r,rf(m)+RIBH);}}
    if(a>=FR1&&a<FS1)r=Math.min(r,rCut(th));   /* in the slot only */
    return r;}

  /* ---------- helpers ---------- */
  const turned=(P,seg=32)=>KIT.crease(new THREE.LatheGeometry(P.map(([r,y])=>V2(r,y)),seg));   /* listed from one end on the axis to the other, y rising */
  const ringT=(P,seg=48)=>KIT.crease(new THREE.LatheGeometry([...P,P[0]].map(([r,y])=>V2(r,y)),seg));   /* both shaded by their own faces at corners (KIT.crease) */   /* a closed loop counterclockwise in r, y */
  const shapeOf=(xy,holes=[])=>{const s=new THREE.Shape();s.moveTo(xy[0][0],xy[0][1]);for(let i=1;i<xy.length;i++)s.lineTo(xy[i][0],xy[i][1]);s.closePath();
    for(const h of holes){const p=new THREE.Path();if(h.c){p.absarc(h.c[0],h.c[1],h.r,0,TAU,true);}else{p.moveTo(h[0][0],h[0][1]);for(let i=1;i<h.length;i++)p.lineTo(h[i][0],h[i][1]);p.closePath();}s.holes.push(p);}return s;};
  /* an outline (shape coordinates) extruded from y0 to y1 (y0 < y1), one closed solid */
  const slab=(xy,holes,y0,y1,cs=24)=>{const g=extrude(shapeOf(xy,holes),{depth:y1-y0,bevelEnabled:false,curveSegments:cs});g.rotateX(-Math.PI/2);g.translate(0,y0,0);return g;};
  /* a solid of revolution's piece built ray by ray, its groove swept (05 06 04-2, 05 06_20): at each angle th of cols (a part's own frame, rising) the ray's section from
     a0 to a1 under the blank's large end face (F0 - a the height): out along inner(th) ([a, r] from a0 to a1) and back along the outer line, rhi(th, a). The body is flat
     along a at any angle but for the groove's walls, its lands' edges ac(m) - WLD/2 and ac(m) + WLD/2 (rBody), so the outer line has a corner pair at each wall, its foot and
     its top at the wall's own depth, and none between; neighbouring rays are joined wall to wall, each wall named by its turn as a thread's flank (KIT's helixSide), the
     walls a wall comes or goes at (the groove's end N, a0, a1, a cap) fanned from the neighbour. So the walls are square and on the helix: until 27 October 2026 the rays had
     rows every 0.04 (radialSolid, and the body's LatheGeometry), each wall a 0.04 slope between rows and its edge jumping 0.04 as the helix crossed a row, every turn's rib
     stair-stepped (the drawings check, batch 5, A5). A full turn (its last angle its first's plus TAU) closes on itself; any other is capped at its first and last angle.
     Flat faces stay flat; the curved ones are shaded smooth wherever neighbouring triangles turn less than 35° (the lathe's look) */
  function helixSolid(cols,a0,a1,inner,rhi){const e=1e-7,full=Math.abs(cols[cols.length-1]-cols[0]-TAU)<1e-9;
    const loopAt=th=>{const mt=(th-PHI0)/TAU,W=/** @type {[number,string,number,number][]} */([]),c=Math.cos(th),s=Math.sin(th),I=inner(th),rin=a=>{let k=1;while(k<I.length-1&&I[k][0]<a)k++;const[p,q]=[I[k-1],I[k]];return q[0]>p[0]?p[1]+(q[1]-p[1])*(a-p[0])/(q[0]-p[0]):q[1];},rh=a=>Math.max(rin(a),rhi(th,a));   /* never inside the inner line (radialSolid's clamp: the slot's walls cut the hub there) */
      for(let j=Math.floor((a0-A0)/PAX-mt)-2;j<=Math.ceil((a1-A0)/PAX-mt)+2;j++){const m=mt+j;if(m<0)continue;const q=ac(m);
        for(const[k,w]of/** @type {[string,number][]} */([['s',q-WLD/2],['e',q+WLD/2]]))if(w>a0+1e-6&&w<a1-1e-6){const r0=rh(w-e),r1=rh(w+e);if(Math.abs(r0-r1)>2e-3)W.push([w,j+k,r0,r1]);}}   /* a step under 2 µm (where a slot's wall or the hub caps both sides) is none */
      W.sort((p,q)=>p[0]-q[0]);const L=[{id:'A',a:a0,r:rh(a0+e)}];for(const[w,id,r0,r1]of W)L.push({id:id+'0',a:w,r:r0},{id:id+'1',a:w,r:r1});L.push({id:'B',a:a1,r:rh(a1-e)});
      for(let i=I.length-1;i>=0;i--)L.push({id:'i'+i,a:I[i][0],r:I[i][1]});
      return L.map(q=>({id:q.id,a:q.a,r:q.r,p:[q.r*c,F0-q.a,-q.r*s]}));};
    const R=cols.map(loopAt),P=[],tri=(a,b,c)=>P.push(a,b,c);
    for(let i=0;i<R.length-1;i++){const A=[...R[i],R[i][0]],B=[...R[i+1],R[i+1][0]],inA=new Set(A.map(q=>q.id)),inB=new Set(B.map(q=>q.id));let p=0,q=0;
      const near=(v,c,n)=>Math.abs(v.a-n.a)<Math.abs(v.a-c.a),stA=()=>{tri(A[p].p,B[q].p,A[p+1].p);p++;},stB=()=>{tri(A[p].p,B[q].p,B[q+1].p);q++;};
      while(p<A.length-1||q<B.length-1){const a=A[p+1],b=B[q+1];
        if(a&&b&&a.id===b.id){tri(A[p].p,B[q].p,b.p);tri(A[p].p,b.p,a.p);p++;q++;continue;}
        if(a&&a.id===B[q].id){stA();continue;}if(b&&b.id===A[p].id){stB();continue;}   /* one ray caught up with the other */
        const aL=a&&!inB.has(a.id),bL=b&&!inA.has(b.id);   /* a wall on one ray only (it ends between them, or crosses a0 or a1): its corners fanned to the other ray's corner nearer in depth */
        if(aL&&!(b&&near(a,B[q],b)))stA();else if(bL&&!(a&&near(b,A[p],a)))stB();else if(aL&&b)stB();else if(bL&&a)stA();else throw Error('helixSolid: walls out of order');}}
    if(!full)for(const[i,sg]of[[0,1],[R.length-1,-1]]){const L=R[i],T=THREE.ShapeUtils.triangulateShape(L.map(q=>V2(q.r,q.a)),[]);
      for(const t of T){const o=[...t].sort((x,y)=>sg*(x-y));tri(L[o[0]].p,L[o[1]].p,L[o[2]].p);}}   /* the end caps wound against the side's edges along them */
    let vol=0;for(let k=0;k<P.length;k+=3){const[a,b,c]=[P[k],P[k+1],P[k+2]];vol+=a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0]);}
    if(vol<0)for(let k=0;k<P.length;k+=3){const t=P[k+1];P[k+1]=P[k+2];P[k+2]=t;}   /* wound to face out */
    const T=[],Q=[];for(let k=0;k<P.length;k+=3){const[a,b,c]=[P[k],P[k+1],P[k+2]],u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],x=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...x);
      if(l<1e-12)continue;T.push(x.map(z=>z/l));Q.push(a,b,c);}   /* a sliver's triangle with no area dropped */
    /* normals: each corner the mean of the triangles round its point that turn less than 35° from its own */
    const K=p=>p.map(q=>Math.round(q*1e5)).join(','),at=new Map();Q.forEach((p,k)=>{const key=K(p);if(!at.has(key))at.set(key,[]);at.get(key).push(Math.floor(k/3));});
    const pos=new Float32Array(Q.length*3),nor=new Float32Array(Q.length*3),cs=Math.cos(35*D2R);
    Q.forEach((p,k)=>{const f=Math.floor(k/3),n=T[f],a=[0,0,0];for(const g of at.get(K(p))){const m=T[g];if(m[0]*n[0]+m[1]*n[1]+m[2]*n[2]>cs){a[0]+=m[0];a[1]+=m[1];a[2]+=m[2];}}
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
  /* ribbonHoleGeo(P, w, h, holes): ribbonGeo's ribbon with round holes straight across its w, each {s: along the path from its first point, r}, on its middle height:
     built in the strip's own (s along, t across, v up) and laid on the path. Each hole's square patch (h along the path, the strip's height) zipped by angle between its
     circle and the patch's edges (its stations on the strip's edges), the hole's wall straight across; elsewhere the strip as ribbonGeo, a quad between stations. Shaded
     by its faces at corners (KIT.crease) */
  function ribbonHoleGeo(P,w,h,holes,nc=24){const n=P.length,S=[0],up=new THREE.Vector3(0,1,0);for(let i=1;i<n;i++)S.push(S[i-1]+P[i].distanceTo(P[i-1]));
    const Nm=P.map((p,i)=>{const t=new THREE.Vector3().subVectors(P[Math.min(n-1,i+1)],P[Math.max(0,i-1)]);t.y=0;t.normalize();return new THREE.Vector3().crossVectors(t,up).normalize();});
    const at=(s,t,v)=>{let i=1;while(i<n-1&&S[i]<s)i++;const f=(s-S[i-1])/(S[i]-S[i-1]||1),p=P[i-1].clone().lerp(P[i],f),q=Nm[i-1].clone().lerp(Nm[i],f).normalize();return[p.x+q.x*t,p.y+v,p.z+q.z*t];};
    const a=h/2,K=8,PT=holes.map(o=>[o.s-a,o.s+a]),inP=s=>PT.some(([l,r])=>s>l+1e-9&&s<r-1e-9);
    const st=[...S.filter(s=>!inP(s)),...holes.flatMap(o=>[...Array(K+1).keys()].map(k=>o.s-a+2*a*k/K))].sort((x,y)=>x-y).filter((s,i,A)=>!i||s-A[i-1]>1e-6);
    const V=[],T=[],vx=(s,t,v)=>(V.push([s,t,v]),V.length-1),C=st.map(s=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([t,v])=>vx(s,t*w/2,v*a)));   /* each station's corners, (t, v): (-, -), (+, -), (+, +), (-, +) */
    const tri=(i,j,k,nd)=>{const[A,B,D]=[V[i],V[j],V[k]],u=[B[0]-A[0],B[1]-A[1],B[2]-A[2]],q=[D[0]-A[0],D[1]-A[1],D[2]-A[2]],x=[u[1]*q[2]-u[2]*q[1],u[2]*q[0]-u[0]*q[2],u[0]*q[1]-u[1]*q[0]];T.push(x[0]*nd[0]+x[1]*nd[1]+x[2]*nd[2]<0?[i,k,j]:[i,j,k]);};
    const quad=(i,j,k,l,nd)=>{tri(i,j,k,nd);tri(i,k,l,nd);};
    const SD=new Map();for(const o of holes)for(const s of[o.s-a,o.s+a]){const i=st.findIndex(x=>Math.abs(x-s)<1e-6);SD.set(i,[-1,1].map(t=>[-0.5,0,0.5].map(v=>vx(st[i],t*w/2,v*a))));}   /* a patch's sides: three corners up each, so every point of its circle sees the side it is zipped to */
    for(let i=0;i<st.length-1;i++){const[c,d]=[C[i],C[i+1]];quad(c[0],d[0],d[1],c[1],[0,0,-1]);quad(c[3],d[3],d[2],c[2],[0,0,1]);   /* the strip's edges */
      if(PT.some(([l,r])=>st[i]>=l-1e-9&&st[i+1]<=r+1e-9))continue;   /* its faces, but in a hole's patch: */
      for(const[k,lo,hi]of[[0,0,3],[1,1,2]]){const L=[c[lo],d[lo],...(SD.get(i+1)?.[k]||[]),d[hi],c[hi],...(SD.get(i)?.[k]||[]).slice().reverse()];   /* round the quad, a patch's side corners on it, fanned from its middle */
        if(L.length===4)quad(L[0],L[1],L[2],L[3],[0,2*k-1,0]);else{const m=vx((st[i]+st[i+1])/2,(2*k-1)*w/2,0);for(let q=0;q<L.length;q++)tri(m,L[q],L[(q+1)%L.length],[0,2*k-1,0]);}}}
    quad(...C[0],[-1,0,0]);quad(...C[st.length-1],[1,0,0]);   /* its ends */
    for(const o of holes){const I=st.map((s,i)=>i).filter(i=>st[i]>=o.s-a-1e-9&&st[i]<=o.s+a+1e-9),ang=(i,k)=>Math.atan2(V[i][2],V[i][0]-o.s);
      for(const[side,ci]of/** @type {[number,number[]][]} */([[-1,[0,3]],[1,[1,2]]])){const t=side*w/2,k=(side+1)/2,B=[...I.map(i=>C[i][ci[0]]),...I.slice().reverse().map(i=>C[i][ci[1]]),...SD.get(I[0])[k],...SD.get(I[I.length-1])[k]].sort((x,y)=>ang(x)-ang(y)),Ci=[];
        for(let j=0;j<nc;j++){const f=-Math.PI+TAU*j/nc;Ci.push(vx(o.s+o.r*Math.cos(f),t,o.r*Math.sin(f)));}
        const aB=k=>k<B.length?ang(B[k]):ang(B[0])+TAU,aC=k=>-Math.PI+TAU*k/nc;let i=0,j=0;   /* zipped by angle about the hole's centre, the boundary from the patch's lower left corner, the circle from its far side */
        while(i<B.length||j<nc){if(j>=nc||(i<B.length&&aB(i+1)<=aC(j+1))){tri(B[i],B[(i+1)%B.length],Ci[j%nc],[0,side,0]);i++;}else{tri(B[i%B.length],Ci[(j+1)%nc],Ci[j],[0,side,0]);j++;}}
        o['c'+side]=Ci;}
      for(let j=0;j<nc;j++){const f=-Math.PI+TAU*(j+0.5)/nc;quad(o['c-1'][j],o['c-1'][(j+1)%nc],o['c1'][(j+1)%nc],o['c1'][j],[-Math.cos(f),0,-Math.sin(f)]);}}   /* the hole's wall, facing its axis */
    const pos=[];for(const t of T)for(const i of t)pos.push(...at(...V[i]));
    let vol=0;for(let k=0;k<pos.length;k+=9){const[a0,a1,a2,b0,b1,b2,c0,c1,c2]=pos.slice(k,k+9);vol+=a0*(b1*c2-b2*c1)-a1*(b0*c2-b2*c0)+a2*(b0*c1-b1*c0);}
    if(vol<0)for(let k=0;k<pos.length;k+=9)for(let q=0;q<3;q++){const x=pos[k+3+q];pos[k+3+q]=pos[k+6+q];pos[k+6+q]=x;}   /* wound to face out (the path may turn the strip's own frame over) */
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();return KIT.crease(g,30);}
  /* tjFix(g): a non-indexed solid's T-junctions closed: an edge only one triangle has, with points of other such edges lying along it (core.js facePocket's sections leave
     out a point a cut put in a straight line, as earcut does), its triangle split at them as a fan from its third corner */
  /* IK(): an id for each integer triple (a hash of the three, its bucket searched): the corner and cell keys of tjFix, snapNear and fillOpen (strings until 26 October 2026,
     most of the time the bores' closing took) */
  const IK=()=>{let cap=1<<12,K=new Float64Array(cap*3),V=new Int32Array(cap).fill(-1),n=0;const h=(a,b,c)=>((a*73856093)^(b*19349663)^(c*83492791))>>>0;   /* open addressing on typed arrays */
    const grow=()=>{const oK=K,oV=V,oc=cap;cap*=2;K=new Float64Array(cap*3);V=new Int32Array(cap).fill(-1);for(let i=0;i<oc;i++)if(oV[i]>=0){let j=h(oK[3*i],oK[3*i+1],oK[3*i+2])&(cap-1);while(V[j]>=0)j=(j+1)&(cap-1);K[3*j]=oK[3*i];K[3*j+1]=oK[3*i+1];K[3*j+2]=oK[3*i+2];V[j]=oV[i];}};
    return(a,b,c)=>{let j=h(a,b,c)&(cap-1);while(V[j]>=0){if(K[3*j]===a&&K[3*j+1]===b&&K[3*j+2]===c)return V[j];j=(j+1)&(cap-1);}K[3*j]=a;K[3*j+1]=b;K[3*j+2]=c;V[j]=n++;if(2*n>cap)grow();return n-1;};};
  function tjFix(g){const P=g.attributes.position,Nm=g.attributes.normal,Uv=g.attributes.uv,ik=IK(),K=i=>ik(Math.round(P.getX(i)*1e5),Math.round(P.getY(i)*1e5),Math.round(P.getZ(i)*1e5));
    let T=[];for(let t=0;t<P.count;t+=3)T.push([0,1,2].map(q=>({k:K(t+q),p:[P.getX(t+q),P.getY(t+q),P.getZ(t+q)],n:[Nm.getX(t+q),Nm.getY(t+q),Nm.getZ(t+q)],u:Uv?[Uv.getX(t+q),Uv.getY(t+q)]:[0,0]})));
    const EK=2**26;for(let pass=0;pass<4;pass++){const E=new Set();for(const t of T)for(let i=0;i<3;i++)E.add(t[i].k*EK+t[(i+1)%3].k);
      const open=[];T.forEach((t,ti)=>{for(let i=0;i<3;i++)if(!E.has(t[(i+1)%3].k*EK+t[i].k))open.push([ti,i]);});if(!open.length)break;
      const pts=new Map();for(const[ti,i]of open)for(const v of[T[ti][i],T[ti][(i+1)%3]])pts.set(v.k,v);let ch=0;const add=[],drop=new Set();
      /* the open edges' points in a grid of 2 mm cells, so each edge tries only those in the cells its box covers (every point until 26 October 2026: quadratic, 30 s
         for the Wempe ring's bores); the same points found */
      const G=2,gk=IK(),grid=new Map();for(const v of pts.values()){const k=gk(...v.p.map(x=>Math.floor(x/G)));(grid.get(k)||grid.set(k,[]).get(k)).push(v);}
      const near=(a,b)=>{const lo=[0,1,2].map(j=>Math.floor((Math.min(a.p[j],b.p[j])-1e-4)/G)),hi=[0,1,2].map(j=>Math.floor((Math.max(a.p[j],b.p[j])+1e-4)/G)),o=[];
        for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){const c=grid.get(gk(x,y,z));if(c)for(const v of c)o.push(v);}return o;};
      for(const[ti,i]of open){if(drop.has(ti))continue;const a=T[ti][i],b=T[ti][(i+1)%3],c=T[ti][(i+2)%3],d=[0,1,2].map(j=>b.p[j]-a.p[j]),L2=d[0]*d[0]+d[1]*d[1]+d[2]*d[2],on=[];
        for(const v of near(a,b)){if(v.k===a.k||v.k===b.k)continue;const w=[0,1,2].map(j=>v.p[j]-a.p[j]),s=(w[0]*d[0]+w[1]*d[1]+w[2]*d[2])/L2;if(s<=1e-6||s>=1-1e-6)continue;
          const e=[0,1,2].map(j=>w[j]-s*d[j]);if(Math.hypot(...e)<2e-5)on.push([s,v]);}
        if(!on.length)continue;on.sort((x,y)=>x[0]-y[0]);const mid=on.map(([s,v])=>({k:v.k,p:v.p,n:a.n.map((x,j)=>x+(b.n[j]-x)*s),u:a.u.map((x,j)=>x+(b.u[j]-x)*s)})),ch2=[a,...mid,b];
        for(let j=0;j<ch2.length-1;j++)add.push([ch2[j],ch2[j+1],c]);drop.add(ti);ch=1;}
      if(!ch)break;T=T.filter((_,ti)=>!drop.has(ti)).concat(add);}
    const o=new THREE.BufferGeometry(),f=T.flat();o.setAttribute('position',new THREE.Float32BufferAttribute(f.flatMap(v=>v.p),3));o.setAttribute('normal',new THREE.Float32BufferAttribute(f.flatMap(v=>v.n),3));
    o.setAttribute('uv',new THREE.Float32BufferAttribute(f.flatMap(v=>v.u),2));g.dispose();return o;}
  /* capFix(g, yF): a facePocket cut whose floor or side wasn't closed: where the pocket's floor at yF runs into a hollow (the drum's slot ending in its bore), facePocket's
     floor, the outer loop less the hole each clipped to the pocket, touches itself and comes out wrong; so the triangles in that plane are dropped, the T-junctions closed,
     and each loop of open edges left (the floor's, a side's facePocket missed) filled flat by core.js closeGeo */
  function capFix(g,yF){const P=g.attributes.position,keep=[];for(let t=0;t<P.count;t+=3){let f=yF!=null;for(let q=0;q<3&&f;q++)if(Math.abs(P.getY(t+q)-yF)>1e-5)f=false;if(!f)keep.push(t);}
    const o=new THREE.BufferGeometry();for(const k of['position','normal','uv']){const a=g.attributes[k];if(!a)continue;const w=a.itemSize,arr=new Float32Array(keep.length*3*w);
      keep.forEach((t,j)=>arr.set(a.array.subarray(t*w,(t+3)*w),j*3*w));o.setAttribute(k,new THREE.BufferAttribute(arr,w));}
    const ud=g.userData;g.dispose();const t=tjFix(o);t.setIndex([...Array(t.attributes.position.count).keys()]);const z=snapNear(fillOpen(closeGeo(t)));z.userData={...ud};return z;}   /* indexed: closeGeo copies an unindexed one through toNonIndexed, which warns */
  /* snapNear(g): corners within 2 µm of each other, chained (union-find), put at one place, the triangles kept: holeCut's cuts leave corners a few tenths of a µm
     apart, closed only when welded; a weld on a grid (the STL's at 1 µm in the movement's frame, gltf_check.py) splits or joins such a pair as it falls across a cell's
     edge and leaves edges open. Afterwards distinct corners stand over 2 µm apart, beyond any 1 µm cell's reach, and a triangle folded flat by it adds each edge twice */
  function snapNear(g){const p=g.attributes.position,n=p.count,A=p.array,c=2e-3;
    /* the corners exactly alike first (a corner is repeated in every triangle round it), then the 2 µm search among the distinct ones only (every corner against its
       neighbours' cells until 26 October 2026: 19 s of the Wempe page's build); the same welds */
    const B=new Uint32Array(A.buffer,A.byteOffset,A.length),ik=IK(),of=new Int32Array(n),U=[];for(let i=0;i<n;i++){const u=ik(B[3*i],B[3*i+1],B[3*i+2]);if(u===U.length)U.push(i);of[i]=u;}   /* alike to the bit */
    const m=U.length,P=new Int32Array(m);for(let u=0;u<m;u++)P[u]=u;const f=x=>{while(P[x]!==x){P[x]=P[P[x]];x=P[x];}return x;},cell=new Map(),ck=IK();
    for(let u=0;u<m;u++){const i=U[u],x=A[3*i],y=A[3*i+1],z=A[3*i+2],k0=Math.floor(x/c),k1=Math.floor(y/c),k2=Math.floor(z/c);
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let d=-1;d<=1;d++){const L=cell.get(ck(k0+a,k1+b,k2+d));if(L)for(const v of L){const j=U[v];if(Math.hypot(A[3*j]-x,A[3*j+1]-y,A[3*j+2]-z)<c)P[f(u)]=f(v);}}
      const kk=ck(k0,k1,k2);(cell.get(kk)||cell.set(kk,[]).get(kk)).push(u);}
    for(let i=0;i<n;i++){const r=U[f(of[i])];if(r!==i)p.setXYZ(i,A[3*r],A[3*r+1],A[3*r+2]);}p.needsUpdate=true;return g;}
  /* fillOpen(g): an indexed solid's open loops that closeGeo's triangulation left (three corners nearly in a line, a few µm across, where a hole's wall meets a faceted face:
     bore) closed by a fan from each loop's first corner, welded at 1 µm as tools/solids-check.js welds */
  function fillOpen(g){const p=g.attributes.position,ix=g.index.array,ik=IK(),first=[],V=[];for(let i=0;i<p.count;i++){const u=ik(Math.round(p.getX(i)*1e3),Math.round(p.getY(i)*1e3),Math.round(p.getZ(i)*1e3));if(u===first.length)first.push(i);V.push(first[u]);}
    const EK=2**26,E=new Set(),nx=new Map();for(let t=0;t<ix.length;t+=3){const a=V[ix[t]],b=V[ix[t+1]],c=V[ix[t+2]];if(a!==b&&b!==c&&c!==a)for(const[u,v]of[[a,b],[b,c],[c,a]])E.add(u*EK+v);}
    for(const k of E){const u=Math.floor(k/EK),v=k-u*EK;if(!E.has(v*EK+u))nx.set(v,u);}if(!nx.size)return g;const I=Array.from(ix),done=new Set();
    for(const s of nx.keys()){if(done.has(s))continue;const L=[];let q=s;while(q!==undefined&&!done.has(q)){done.add(q);L.push(q);q=nx.get(q);}for(let i=1;i+1<L.length;i++)I.push(L[0],L[i],L[i+1]);}
    g.setIndex(I);return g;}
  /* bore(g, o, d, r, from, n, poly, h): a hole cut in a closed solid g of any shape (a turned part's lathe, a wall, an extrusion) along the axis through o ([x, y, z] in g's
     frame) in the direction d, from `from` (mm from o along d) on out of the part: core.js facePocket with d turned onto +y, its prism open that way, so the metal beyond
     the hole's end along d must lie clear of it (a hole through, or a blind one opening outward). Its outline a regular n-gon whose flats lie r from the axis (a pin r
     across fits it), or poly ([u, w] across d, u along h projected square to d, w along u × d): a slot. So a turned part is holed across or along, closed: until 25
     October 2026 such holes weren't cut ("a turned body can't be holed across", README). Returns the cut geometry, not yet closed (capFix) */
  /* tp (0 by default): the hole narrowing along d, its radius falling tp a mm (a taper's half-angle's tangent: 1/180 for a 1:90 reamer), r its radius at o */
  function bore(g,o,d,r,from,n=24,poly=null,h=[0,1,0],tp=0){const D=new THREE.Vector3(...d).normalize();let X=new THREE.Vector3(...h);X.addScaledVector(D,-X.dot(D));
    if(X.lengthSq()<1e-9){X=new THREE.Vector3(1,0,0);X.addScaledVector(D,-X.dot(D));}X.normalize();const Z=new THREE.Vector3().crossVectors(X,D);
    const B=new THREE.Matrix4().makeBasis(X,D,Z).setPosition(o[0],o[1],o[2]);g.applyMatrix4(B.clone().invert());   /* B: the hole's frame (x along h, y along d) to g's */
    const R=r/Math.cos(Math.PI/n),pl=poly||[...Array(n).keys()].map(i=>[R*Math.cos((i+0.5)/n*TAU),R*Math.sin((i+0.5)/n*TAU)]),P=g.attributes.position;
    const out=holeCut(g,pl,from,tp);out.applyMatrix4(B);out.userData={...g.userData};return out;}   /* the part's userData kept (its tapped holes' threads, for matchThreads: lost until 26 October 2026, so a bored part's screws stood crest on crest) */
  /* holeCut(g, poly, yb): what core.js facePocket(g, 'top', poly, y1 - yb) cuts (the prism over the convex plan poly, from y = yb up), but only the triangles that come
     within the prism's box are split by its planes. facePocket splits every triangle each of its infinite planes crosses, and every plane of a hole across a turned part
     runs through it from side to side near its axis, so the pieces multiply there (a drum's 16,000 corners became 560,000, and the page took 25 s to build). The sections that
     close the hole's walls and floor are still each plane's whole loop through the solid: a far triangle's crossing worked out as its split would be, its edge left whole
     (capFix's tjFix splits it where a near piece's corner lies on it) */
  function holeCut(g0,poly,yb,tp=0){const g=g0.index?g0.toNonIndexed():g0,P=g.attributes.position,Nm=g.attributes.normal,U=g.attributes.uv,n=P.count,e=1e-7;
    const cx=poly.reduce((a,p)=>a+p[0],0)/poly.length,cz=poly.reduce((a,p)=>a+p[1],0)/poly.length,PL=[{n:[0,-1,0],c:-yb}];   /* inside the pocket where n·p < c */
    poly.forEach((a,k)=>{const b=poly[(k+1)%poly.length];let m=[a[1]-b[1],0,b[0]-a[0]];if(m[0]*(cx-a[0])+m[2]*(cz-a[1])>0)m=m.map(v=>-v);const l=Math.hypot(m[0],m[2]);m=m.map(v=>v/l);const kt=Math.hypot(1,tp);PL.push({n:[m[0]/kt,tp/kt,m[2]/kt],c:(m[0]*a[0]+m[2]*a[1])/kt});});   /* tp: each side leaning in tp a mm along the hole (a taper) */
    const dist=(pl,v)=>{const d=pl.n[0]*v[0]+pl.n[1]*v[1]+pl.n[2]*v[2]-pl.c;return Math.abs(d)<e?0:d;};
    const cut=(a,b,da,db)=>{if(a[0]>b[0]||a[0]===b[0]&&(a[1]>b[1]||a[1]===b[1]&&a[2]>b[2])){[a,b]=[b,a];[da,db]=[db,da];}const t=da/(da-db);return a.map((x,i)=>x+(b[i]-x)*t);};   /* facePocket's: an edge's point the same from both its triangles */
    const xs=poly.map(p=>p[0]),zs=poly.map(p=>p[1]),bx=[Math.min(...xs)-1e-4,Math.max(...xs)+1e-4,yb-1e-4,Math.min(...zs)-1e-4,Math.max(...zs)+1e-4];
    let T=[];const FAR=[];for(let t=0;t<n;t+=3){const tr=[0,1,2].map(q=>[P.getX(t+q),P.getY(t+q),P.getZ(t+q),U?U.getX(t+q):0,U?U.getY(t+q):0,Nm.getX(t+q),Nm.getY(t+q),Nm.getZ(t+q)]);
      const near=Math.max(...tr.map(v=>v[0]))>=bx[0]&&Math.min(...tr.map(v=>v[0]))<=bx[1]&&Math.max(...tr.map(v=>v[1]))>=bx[2]&&Math.max(...tr.map(v=>v[2]))>=bx[3]&&Math.min(...tr.map(v=>v[2]))<=bx[4];(near?T:FAR).push(tr);}
    const split=(tr,D)=>{const A=[],B=[];for(let i=0;i<3;i++){const p=tr[i],q=tr[(i+1)%3],dp=D[i],dq=D[(i+1)%3];if(dp>=0)A.push(p);if(dp<=0)B.push(p);if(dp*dq<0){const m=cut(p,q,dp,dq);A.push(m);B.push(m);}}return[A,B];};
    T=T.filter(tr=>PL.some(pl=>{const D=tr.map(v=>dist(pl,v));return D.every(x=>x>=0)&&D.some(x=>x>0);})?(FAR.push(tr),false):true);   /* near the prism's box but wholly outside one of its planes: whole, as a far one (25 October 2026: the planes before it split it first; the movement ring's flange, frame.js, came out a third larger without this) */
    for(const pl of PL){const o=[];for(const tr of T){const D=tr.map(v=>dist(pl,v));if(D.every(x=>x>=0)||D.every(x=>x<=0)){o.push(tr);continue;}for(const Q of split(tr,D))for(let i=1;i+1<Q.length;i++)o.push([Q[0],Q[i],Q[i+1]]);}T=o;}
    const pos=[],nor=[],uv=[],key=v=>v.slice(0,3).map(x=>x.toFixed(6)).join(',');
    T=T.filter(tr=>{const c=[0,1,2].map(i=>(tr[0][i]+tr[1][i]+tr[2][i])/3);return!PL.every(pl=>dist(pl,c)<0);});   /* inside the pocket: dropped */
    for(const tr of[...T,...FAR])for(const v of tr){pos.push(v[0],v[1],v[2]);uv.push(v[3],v[4]);nor.push(v[5],v[6],v[7]);}
    PL.forEach(pl=>{const nx=new Map(),pt=new Map(),put=(a,b)=>{nx.set(key(a),key(b));pt.set(key(a),a);pt.set(key(b),b);};   /* the section on this plane, as facePocket's: each edge in it from its triangle outside the pocket, in that triangle's order */
      for(const tr of T){const D=tr.map(v=>dist(pl,v));if(!D.some(x=>x>0))continue;for(let k=0;k<3;k++)if(D[k]===0&&D[(k+1)%3]===0)put(tr[k],tr[(k+1)%3]);}
      for(const tr of FAR){const D=tr.map(v=>dist(pl,v));if(!D.some(x=>x>0))continue;if(D.some(x=>x<0)){const[A]=split(tr,D);for(let k=0;k<A.length;k++){const a=A[k],b=A[(k+1)%A.length];if(dist(pl,a)===0&&dist(pl,b)===0&&key(a)!==key(b))put(a,b);}}
        else for(let k=0;k<3;k++)if(D[k]===0&&D[(k+1)%3]===0)put(tr[k],tr[(k+1)%3]);}
      const w=pl.n.map(v=>-v),u=Math.abs(w[1])>0.5?[1,0,0]:[0,1,0],v=[w[1]*u[2]-w[2]*u[1],w[2]*u[0]-w[0]*u[2],w[0]*u[1]-w[1]*u[0]],to2=p=>new THREE.Vector2(p[0]*u[0]+p[1]*u[1]+p[2]*u[2],p[0]*v[0]+p[1]*v[1]+p[2]*v[2]);
      /* the section's loops, whole; then the face is the section within the pocket's other planes, worked as a region (its loops' edges inside that convex window, and the
         window's edges inside the section), not each loop clipped on its own: a turned wall cut across makes a ring of two loops, and each clipped alone met the other
         along the window's edges, which the triangulation left as slivers of no area (facePocket does so) */
      const raw=[],seen=new Set();for(const k0 of nx.keys()){if(seen.has(k0))continue;const L=[];let k=k0;while(k!==undefined&&!seen.has(k)){seen.add(k);L.push(pt.get(k));k=nx.get(k);}if(L.length>2)raw.push(L);}
      const loops=[];if(raw.length){const e1=u.map((x,i)=>x-(u[0]*w[0]+u[1]*w[1]+u[2]*w[2])*w[i]),l1=Math.hypot(...e1),E1=e1.map(x=>x/l1),E2=[w[1]*E1[2]-w[2]*E1[1],w[2]*E1[0]-w[0]*E1[2],w[0]*E1[1]-w[1]*E1[0]],p0=pl.n.map(x=>x*pl.c),Lb=1e3;
        let C=[[1,1],[-1,1],[-1,-1],[1,-1]].map(([a,b])=>p0.map((x,i)=>x+Lb*(a*E1[i]+b*E2[i])));
        for(const q of PL)if(q!==pl&&C.length>2){const o=[];for(let j=0;j<C.length;j++){const a=C[j],b=C[(j+1)%C.length],da=dist(q,a),db=dist(q,b);if(da<=0)o.push(a);if(da*db<0)o.push(cut(a,b,da,db));}C=o;}   /* the window: within the other planes */
        if(C.length>2){if(THREE.ShapeUtils.area(C.map(to2))>0)C.reverse();   /* turned as the outer loops run */
          const C2=C.map(to2),nC=C.length,side=(k,q)=>{const a=C2[k],b=C2[(k+1)%nC];return(b.x-a.x)*(q.y-a.y)-(b.y-a.y)*(q.x-a.x);},onC=C.map(()=>[]),segs=[];
          const lerp=(a,b,t)=>a.map((x,i)=>i<3?x+(b[i]-x)*t:x);
          for(const L of raw)for(let j=0;j<L.length;j++){const a=L[j],b=L[(j+1)%L.length],A2=to2(a),B2=to2(b);let t0=0,t1=1,k0=-1,k1=-1,ok=true;
            for(let k=0;k<nC&&ok;k++){const fa=side(k,A2),fb=side(k,B2);if(fa>0&&fb>0)ok=false;else if(fa>0){const t=fa/(fa-fb);if(t>t0){t0=t;k0=k;}}else if(fb>0){const t=fa/(fa-fb);if(t<t1){t1=t;k1=k;}}}
            if(!ok||t1-t0<1e-12)continue;const P=t0>0?lerp(a,b,t0):a,Q=t1<1?lerp(a,b,t1):b;segs.push([P,Q]);
            for(const[k,X]of[[k0,P],[k1,Q]])if(k>=0){const c=C2[k],d=C2[(k+1)%nC],x=to2(X);onC[k].push([((x.x-c.x)*(d.x-c.x)+(x.y-c.y)*(d.y-c.y))/((d.x-c.x)**2+(d.y-c.y)**2),X]);}}
          const S2=raw.map(L=>L.map(to2)),inS=q=>{let r=false;for(const V of S2)for(let a=0,b=V.length-1;a<V.length;b=a++)if((V[a].y>q.y)!==(V[b].y>q.y)&&q.x<(V[b].x-V[a].x)*(q.y-V[a].y)/(V[b].y-V[a].y)+V[a].x)r=!r;return r;};
          for(let k=0;k<nC;k++){const R=[[0,C[k]],...onC[k].sort((x,y)=>x[0]-y[0]),[1,C[(k+1)%nC]]];for(let j=0;j+1<R.length;j++){if(R[j+1][0]-R[j][0]<1e-12)continue;const m=to2(lerp(R[j][1],R[j+1][1],0.5));if(inS(m))segs.push([R[j][1],R[j+1][1]]);}}
          const nx2=new Map();for(const sg of segs)nx2.set(key(sg[0]),sg);const used=new Set();
          for(const sg of segs){if(used.has(sg))continue;const L=[];let c=sg;while(c&&!used.has(c)){used.add(c);L.push(c[0]);c=nx2.get(key(c[1]));}if(L.length>2&&Math.abs(THREE.ShapeUtils.area(L.map(to2)))>1e-9)loops.push(L);}}}
      const out=loops.filter(L=>THREE.ShapeUtils.area(L.map(to2))<0),holes=loops.filter(L=>THREE.ShapeUtils.area(L.map(to2))>0),inL=(L,p)=>{const q=to2(p),V=L.map(to2);let r=false;for(let a=0,b=V.length-1;a<V.length;b=a++)if((V[a].y>q.y)!==(V[b].y>q.y)&&q.x<(V[b].x-V[a].x)*(q.y-V[a].y)/(V[b].y-V[a].y)+V[a].x)r=!r;return r;};
      for(const L of out){const H=holes.filter(h=>inL(L,h[0])),all=[...L,...H.flat()];
        for(const[a,b,c]of THREE.ShapeUtils.triangulateShape(L.map(to2),H.map(h=>h.map(to2)))){let f=[all[a],all[b],all[c]];const p=f[0],q=f[1],r=f[2],m=[(q[1]-p[1])*(r[2]-p[2])-(q[2]-p[2])*(r[1]-p[1]),(q[2]-p[2])*(r[0]-p[0])-(q[0]-p[0])*(r[2]-p[2]),(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])];
          if(m[0]*w[0]+m[1]*w[1]+m[2]*w[2]<0)f=[p,r,q];for(const x of f){pos.push(x[0],x[1],x[2]);nor.push(...w);uv.push(x[0],-x[2]);}}}});   /* facing into the pocket */
    const o=new THREE.BufferGeometry();o.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));o.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
    o.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));if(g0!==g)g.dispose();g0.dispose();return o;}
  /* the same ribbon with an eye through it: samples i0 to i1 open between lo and hi (heights off each point's y), closed by the eye's floor, roof and two ends (core.js
     mainspringGeo's faces: the sides in three bands, the middle one open over the eye) */
  function eyeRibbonGeo(P,w,h,i0,i1,lo,hi){const N=P.length-1,up=new THREE.Vector3(0,1,0),t=new THREE.Vector3(),q=new THREE.Vector3(),C=[];
    for(let i=0;i<=N;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(N,i+1)];t.subVectors(b,a);t.y=0;t.normalize();q.crossVectors(t,up).normalize();
      const p=P[i],Y=[p.y-h/2,p.y+lo,p.y+hi,p.y+h/2],at=s=>Y.map(y=>[p.x+q.x*s*w/2,y,p.z+q.z*s*w/2]);C.push({O:at(1),I:at(-1)});}
    const pos=[],idx=[],rib=(A,B,j0,j1)=>{const b=pos.length/3;for(let i=j0;i<=j1;i++)pos.push(...A(C[i]),...B(C[i]));for(let i=0;i<j1-j0;i++){const j=b+i*2;idx.push(j,j+1,j+3,j,j+3,j+2);}},
      quad=(A,B,D,E)=>{const b=pos.length/3;pos.push(...A,...B,...D,...E);idx.push(b,b+1,b+2,b,b+2,b+3);};
    for(const[l,h]of[[0,1],[2,3]]){rib(c=>c.O[l],c=>c.O[h],0,N);rib(c=>c.I[h],c=>c.I[l],0,N);}
    for(const[j0,j1]of[[0,i0],[i1,N]]){rib(c=>c.O[1],c=>c.O[2],j0,j1);rib(c=>c.I[2],c=>c.I[1],j0,j1);}
    rib(c=>c.O[3],c=>c.I[3],0,N);rib(c=>c.I[0],c=>c.O[0],0,N);rib(c=>c.O[1],c=>c.I[1],i0,i1);rib(c=>c.I[2],c=>c.O[2],i0,i1);
    const wall=(c,f)=>{for(const[l,h]of[[0,1],[1,2],[2,3]]){if(f===2&&l!==1)continue;const A=c.O[l],B=c.O[h],D=c.I[h],E=c.I[l];if(f>0)quad(A,B,D,E);else quad(A,E,D,B);}};
    wall(C[0],0);wall(C[N],1);wall(C[i0],2);const e=C[i1];quad(e.O[1],e.I[1],e.I[2],e.O[2]);   /* the strip's ends; the eye's two ends face into it */
    let v=0;const A=new THREE.Vector3(),B=new THREE.Vector3(),D=new THREE.Vector3();for(let i=0;i<idx.length;i+=3){A.fromArray(pos,idx[i]*3);B.fromArray(pos,idx[i+1]*3);D.fromArray(pos,idx[i+2]*3);v+=A.dot(B.cross(D));}
    if(v<0)for(let i=0;i<idx.length;i+=3){const s=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=s;}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
  /* the outermost radius of an outline (shape coordinates, about the origin) along each ray: a lookup of N rays, for a pawl to be seated on it from outside */
  function polarMax(xy,N=4096,hi=false){const R=new Float32Array(N);for(let k=0;k<N;k++){const a=k/N*TAU,c=Math.cos(a),s=Math.sin(a);let best=0;
      for(let i=0;i<xy.length;i++){const p=xy[i],q=xy[(i+1)%xy.length],dx=q[0]-p[0],dy=q[1]-p[1],den=c*dy-s*dx;if(Math.abs(den)<1e-12)continue;
        const t=(p[0]*dy-p[1]*dx)/den,u=(p[0]*s-p[1]*c)/den;if(t>0&&u>=0&&u<=1)best=Math.max(best,t);}R[k]=best;}
    return a=>{const u=fr(a/TAU)*N,i=Math.floor(u)%N,j=(i+1)%N;return hi?Math.max(R[i],R[j]):R[i]+(R[j]-R[i])*(u-Math.floor(u));};}   /* hi: the higher of the two rays about a, never under the outline between them (a sharp tip between two rays is cut by their line) */
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
    /* the versions (movement.js's setRev): rv(par, 'last 1943', 'first', 'last 6mx 1943' or 'first 6mx') a group of the pieces only those versions have (the 6MX keeps the revised maintaining spring and the first drawn barrel; the escapement of 1943 the revised barrel and maintaining spring); onRev(g) runs g(version) when it changes */
    const rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;},onRev=f=>mv.userData.onRev.push(f);

    /* the stop bar 05 06 03-1 (Stellungssteg; no sheet in the set: the coloured section's) as 05 06_4's Schnitt C-D draws it, traced at 12.2 px/mm (its Ø 21 hub, Ø 15 recess
       and Ø 6 step come out so) and scaled 0.989 to its 22.5. The sheet is seen from the fusee's small end, as its view A-B (the maintaining work's, below): mirrored here.
       In the bar's frame (u along it, lower end to upper, from the foot of the axis's perpendicular; v across, as the shape's y) it lies at v -4 to -6 (02-2: the slot 2 H8,
       its near edge 4 from the axis), its ends at u -11.52 and 10.98 retracted. Its lower end is cut obliquely: the point on
       the near side, rounded r 0.39, the far side 0.94 shorter; its upper end is square on the far side, its near side rounded r 2.47 from u 8.56; across it at u -6.0 the
       hole for its pin 05 06 03-2 (the dashed hole on C-D), on which the spring's end bears. Its travel 3.6, between C-D's two positions. Its width is a sliding fit in the slot's 2 H8 (2.000-2.014): 1.98,
       v 4.01 to 5.99 (no sheet sizes it: a g6-class bar, estimated; drawn 2.00, its sides in the slot's walls, until 18 October 2026) */
    const SBN=4.01,SBF=5.99,SB={d:5.0,lo:-11.52,hi:10.98,tr:3.6,lf:-10.58,ru:8.555,rr:2.47,rt:0.39,sp:-6.0,us:8.0,ub:3.4,tt:1.05};
    /* the slot is 1.5 deep along the bar's lower part and "1,1+0,05 tief" toward its upper end (02-2's two depths, inside its lines at either end), from where 02-2's hidden arc
       r 9.45 crosses it, u 8.0 (us): there the rib between the top turn and the next isn't cut, and the bar's upper end, standing out over the groove, passes under it, clear
       of the chain on the turn below. So the bar is thinner toward its upper end: 1.05 (tt; the coloured section draws its end standing out 9.5 px thick against its middle's
       13.5, 0.70 (±0.07), flush on the cover plate's side; 1.05/1.45 is 0.72), from u 3.4 (ub, estimated: slid its whole 3.6, its full thickness stays inside the top land's floor, r 9.3, at its far side, so off the
       chain on the turn below, and short of the shallow part) */
    const SBO=(()=>{const o=[],c=[SB.lo+SB.rt,SBN+SB.rt],e=Math.asin((SBN+SB.rr-SBF)/SB.rr);
      for(let i=0;i<=8;i++){const a=Math.PI*(150+120*i/8)/180;o.push([c[0]+SB.rt*Math.cos(a),c[1]+SB.rt*Math.sin(a)]);}   /* the point's round, from the oblique edge to the near side */
      for(let i=0;i<=16;i++){const a=-Math.PI/2+(Math.PI/2-e)*i/16;o.push([SB.ru+SB.rr*Math.cos(a),SBN+SB.rr+SB.rr*Math.sin(a)]);}   /* the upper end's round, from the near side to the far */
      o.push([SB.lf,SBF]);return o.map(([u,v])=>[u,-v]).reverse();})();   /* the far side back to the oblique edge; mirrored */
    const SPA=angOf(SPX[0]-fx,SPX[1]-fz),SPR=Math.hypot(SPX[0]-fx,SPX[1]-fz),SBtipA=Math.atan2(-SBN-SB.rt,SB.lo);   /* the stop pin's place about the fusee's axis; the lower end's point, in the bar's frame */
    /* the chain's and the band's runs (connGeo), and from them the drum's turns: the end's angle in the drum set so the drum stands at 0 fully wound (BLK0), and its turn at run down */
    /* full wind is where the stop holds the fusee. The slot runs along the line from the axis to the chain's pin A, its upper end toward A (02-2 dimensions it from that
       line: "4", "2 H8", no angle), so the bar's turn on the fusee is A's; the stop pin (Ø 1.6, hole 7, 14.0 from the axis) then bears on the bar's far side near its upper
       end, 0.02 off, where C-D draws it ("Stellung im aufgezogenen Zustand"): at that turn of the fusee (the fusee turns back, rotation.y falling, while winding, so the far
       side comes round onto the pin; the face reaches past the pin once the bar has slid 2.1 of its 3.6). It falls 0.112 turn short of the chain lying to the groove's end N
       (M_FULL, the full wind assumed until 15 October 2026): 8.638 turns of chain on the fusee, 8.70 turns and 55.9 h from run down (05 06_20's test: 8.75 working turns;
       the up-and-down dial: 56 h); the groove's last turn-tenth stays empty, as a fusee's should (02-2 draws N a further 0.07 on) */
    const barRot=PINA,SPu=Math.sqrt(SPR*SPR-(SBF+0.8+0.02)**2);
    const CG={},RF0N=connGeo(CONN.chain).RF0,RFS=(()=>{const r=SPA-barRot-Math.atan2(-(SBF+0.82),SPu);return r+TAU*Math.round((RF0N-r)/TAU);})();   /* the stop's turn, in the turn nearest the groove's end's */
    CG.chain=connGeo(CONN.chain,RFS);CG.band=connGeo(CONN.band,RFS);
    /* on the barrel the chain runs on from its tangent point the way the barrel turns back (rotation.y falling) to its hook: the drum stands at 0 fully wound */
    const BLK0={},BETA_RUN={};for(const k of['chain','band']){const cg=CG[k],mf=cg.m0Of(cg.RF0),run=cg.runOf(mf),sT=cg.lf(mf)+run.S;BLK0[k]=run.psi+Math.PI-(CONN[k].len-sT)/cg.rbp;
      const r0=cg.runOf(0),s0=cg.lf(0)+r0.S;BETA_RUN[k]=r0.psi+Math.PI-(CONN[k].len-s0)/cg.rbp-BLK0[k];}
    const mTip=(()=>{const u=(barRot+SBtipA-PHI0)/TAU;return M_FULL-fr(M_FULL-u);})();
    /* the body's tapped holes' places (05 06 04-2's Schnitt C-D, seen from the small end: mirrored here, its angles a = PINA + 90° - the drawn angle from 3 o'clock):
       the click wheel's three M2 on r 5.75 (11.5 ±0.05 on 05 06 04-3) at PINA + 74° + k·120° (drawn 16°, 137°, 259°: likely ±2°), and the cover plate's screw's M1.7
       6 from the axis and 1 from the line through it along the slot, on the side away from the bar (02-2's "6 r" and "1"; C-D draws it at 78°, PINA + 12°, and 05 06_4's C-D so) */
    const CWH=[0,1,2].map(k=>sh(5.75,PINA+74*D2R+k*TAU/3)),DPS=sh(6,barRot+Math.asin(1/6));

    /* =============== the fusee (Schnecke 05 06 04) =============== */
    const pF=part('fusee',-33),gF=grp(pF,fx,fz);
    /* the body 05 06 04-2 (Schneckenkörper, as revised 27.2.48; Rundmessing 36, Ms 58): a lathe whose outer surface is pushed out to the radius field above (rBody): the
       flange Ø 35.6 -0.1 (drawn 35.6) with its two ribs and the slot, the groove's nine turns, the hub at the small end. Inside: the large end's recess Ø 26.3 +0.2 (drawn
       26.3), 2.7 deep to the 9.9 -0.1 from the small end, entered by a 45° chamfer from Ø 29.8 (revision a); the bore 7 H7 (drawn 7.006) to the small end's recess Ø 15, 1.6
       +0.1 deep. Its holes (05 06 04-2, 25 October 2026; until then not cut, the screws and the chain's pin lying in the metal): the three M2 for the click wheel's
       screws from the large end's recess floor on r 5.75 at 120° (sure), "6 +0,5" deep (revision a; to the drill's point, drawn flat at its middle, 6.25), at 74°, 194°
       and 314° from the chain's pin A seen from the large end: Schnitt C-D (seen from the small end, 36.4 px/mm on the crop by its Ø 15) draws them at 16°, 137° and 259°
       (as drawn, from 3 o'clock) with A at 90° (likely, ±2°; until 25 October 2026 at 47° less, an estimate, which would have broken the M1.7 into the nearest);
       the M1.7 for the cover plate's screw from the small end's recess floor, on the "6 r" circle (C-D's fourth dashed circle, scaled r 6.04, at 78°), "6" deep to the
       drill's point (Schnitt A-B: its 6 from the recess floor, 1.6 under the end, to the point; sure), its place the cover plate's (below); the chain's pin's hole
       "0,55∅ +0,01" through both ribs of the flange, axial (section A-B), drawn Ø 0.555, to 2.05 under the large end; each a tapped hole drawn at its thread's size
       and 0.02, as the frame's (frame.js), flat at the drill's depth: the tapped holes cut in the tube (below), the pin's hole bored into the flange's lathe (bore, above). Gilt, as
       Wempe 3955's (8_Wempe_3955_Räderwerk_plus.jpg) */
    {const PH=99,N=216,col=[[PH,S+SLD]];for(let a=LB-0.04*Math.ceil(SLD/0.04);a>RT+1e-9;a-=0.04)col.push([PH,F0-a]);col.push([PH,F]);   /* to the re-turned face */
      /* three closed pieces, each holed as a small solid (facePocket on the whole 120,000-triangle lathe took seconds): the flange's lathe to AS under the large end, through
         which the chain's pin's hole runs; the rest outside r 7.5 under it, swept ray by ray with the groove's walls square (helixSolid); and the tube between the bore and r 7.5
         from the small end's recess floor to the large end's, its tapped holes cut in it as a solid of plan cells (KIT.solidGeo). The pieces meet on the lathe's own angles and
         at AS on its row (the tube's circle on its 216 corners) */
      const AS=col.map(q=>F0-q[1]).filter(a=>a>2.1).reduce((m,a)=>Math.min(m,a),9);   /* AS: the first row under 2.1, below the hole's end (2.05) */
      const lathe=pr=>{const g=new THREE.LatheGeometry(pr.map(([r,y])=>V2(r,y)),216),p=g.attributes.position;
        for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),r=Math.hypot(x,z);if(r<PH-1)continue;const th=angOf(x,z),R=rBody(th,F0-p.getY(i));p.setX(i,R*Math.cos(th));p.setZ(i,-R*Math.sin(th));}
        return KIT.crease(g);};   /* its faces' own normals at corners (computeVertexNormals until 26 October 2026: the large face shaded as a dish, the small end streaked) */
      const gFl=(()=>{const q=pol(PINR,PINA);return capFix(bore(lathe([[13.15,F0-AS],...col.filter(q=>q[1]>=F0-AS-1e-9),[14.9-RT,F],[13.15,F0-1.75],[13.15,F0-AS]]),[q[0],0,q[1]],[0,1,0],0.2775,F0-2.05),null);})();   /* the chain's pin's hole through rib 1, the slot and rib 2 to the land under it (r 14.8 at the pin, inside the hole's 16.5) */
      const gRe=helixSolid([...Array(N+1).keys()].map(k=>k*TAU/N),AS,LB-SLD,()=>[[AS,13.15],[2.7,13.15],[2.7,7.5],[LB-SLD,7.5]],rBody);   /* from AS to the stop bar's slot's floor (below), the groove swept (helixSolid; the lathe's 0.04 rows until 27 October 2026), the recess's wall r 13.15 to its floor FRC (2.7) inside */
      const bo=ring(0,0,7.006/2,216),gTu=solidGeo([{loop:ring(0,0,7.5,216),y0:S+1.6,y1:FRC,F:[{p:bo,a:S+1.6,b:FRC},...CWH.map(c=>({p:ring(c[0],-c[1],1.02,40),a:FRC-6.25,b:FRC,th:{rs:1.0}})),{p:ring(DPS[0],-DPS[1],0.87,36),a:S+1.6,b:S+1.6+6,th:{rs:0.85}}]}]);   /* the M2s from the recess floor, the M1.7 from the small end's, each tapped (KIT's threadWall: their screws' threads matched to them, matchThreads; plain until 28 October 2026, drawing check 2's 5-M11 and S-6) */
      const bF=[tag(mesh(gF,gRe,M.gilt),'050604-2'),tag(mesh(gF,gFl,M.gilt),'050604-2',1),tag(mesh(gF,gTu,M.gilt),'050604-2',1)];   /* the body's pieces, these and those below, merged into one (fuse) */
      /* the small end's last 1.5, which the stop bar's slot crosses (05 06 04-2's Schnitt C-D: 2 H8 wide, its near edge 4 from the axis, "1,5+0,05 tief", right across the end
         and out through the hub and the top turn on both sides): the two pieces it leaves between the recess (Ø 15) and the radius field, the large one on the axis's side
         of the slot and the arch beyond it, each built ray by ray on the lathe's own angles, the groove swept as in the rest (helixSolid), with more rays where the slot's
         walls meet the outside. Pieces of the body: drawn gilt as it is */
            const fine=(a0,a1)=>{const o=[];for(let d=a0;d<=a1+1e-9;d+=0.15)o.push(d*D2R);return o;};
      const cols=(p0,p1,extra)=>{const L=[p0,p1,...extra.filter(f=>f>p0&&f<p1)];for(let k=0;k<N;k++){const f=p0+fr((k*TAU/N-Math.PI/2-barRot-p0)/TAU)*TAU;if(f>p0+1e-6&&f<p1-1e-6)L.push(f);}
        return[...new Set(L.map(x=>+x.toFixed(9)))].sort((a,b)=>a-b).map(f=>f+barRot);};   /* the angles from the bar's direction, put in the fusee's frame */
      const sA=Math.asin(4/7.5),c1=fine(22.0,26.0),c2=fine(34.3,40.9);   /* the angles (from the bar's direction) where the slot's walls meet the outside */
      /* with the stop bar's spring's pin's hole "0,5 H7" (05 06 04-2's C-D, dashed along the slot; drawn Ø 0.5045) from the recess out through the end, on the pin's axis
         (below: 1.5 from the line through the axis along the slot, at the spring's mid-height, S + 0.5); 25 October 2026, until then not cut */
      {const c=Math.cos(barRot),s_=Math.sin(barRot),u0=Math.sqrt(6.4*6.4-1.5*1.5);
        bF.push(tag(mesh(gF,capFix(bore(helixSolid(cols(-sA,Math.PI+sA,[...c1.map(f=>-f),...c1.map(f=>Math.PI+f)]),LB-SLD,LB,()=>[[LB-SLD,7.5],[LB,7.5]],(th,a)=>{const s_=-Math.sin(th-barRot);return Math.min(rBody(th,a),s_>1e-9?4/s_:1e9);}),
          [u0*c+1.5*s_,S+0.5,-u0*s_+1.5*c],[c,0,-s_],0.25225,0,20),null),M.gilt),'050604-2',1));}
      const sC=Math.asin(6/10.5);
      bF.push(tag(mesh(gF,helixSolid(cols(Math.PI+sC,TAU-sC,[...c2.map(f=>Math.PI+f),...c2.map(f=>TAU-f)]),LB-SLD,LB,th=>{const r=Math.max(7.5,-6/Math.sin(th-barRot));return[[LB-SLD,r],[LB,r]];},rBody),M.gilt),'050604-2',1));
      /* and the slot's shallow part toward the bar's upper end: from 1.1 to 1.5 deep, beyond u 8.0, between its walls */
      const pA=Math.atan2(-6,SB.us),pB=Math.atan2(-4,Math.sqrt(10.6*10.6-16)),c3=[];for(let f=pA;f<=pB+1e-9;f+=0.25*D2R)c3.push(f);
      bF.push(tag(mesh(gF,helixSolid([...c3,pB].map(f=>f+barRot),LB-SLD,LB-1.1,th=>{const f=th-barRot,r=Math.max(SB.us/Math.cos(f),4/-Math.sin(f));return[[LB-SLD,r],[LB-1.1,r]];},(th,a)=>{const f=th-barRot;return Math.min(rBody(th,a),6/-Math.sin(f));}),M.gilt),'050604-2',1));fuse(bF);bF[0].geometry.userData.threads=gTu.userData.threads;}   /* one solid, one mesh (fuse, core.js): flush faces drew lines on it in Edges until 21 October 2026; the tube's tapped holes' threads carried onto it (fuse keeps only the first piece's userData), for matchThreads */
    /* the arbor 05 06 04-1 (Schneckenwelle; Präz. Rundstahl 7,5, polished where marked): from the winding end, the square "3,1 r6" (+0.023/+0.015, r6 for 3-6 mm: 3.12 at
       its root, the middle; read 3.17 until 28 October 2026, drawing check 2's 5-M1: the small figure after "3," is this hand's flagged 1, as in "+0,015" beside it) tapering
       1:100 to the sheet's 2,92 at its point (3.12 less 20.3/100: 2.917; 3.17 would give 2.97), 20.3 long, the journal Ø 4.5 ±0.02 at the shoulder to 4.39 (1:70, 8 long) that runs in the fusee bush, the step Ø 6.1 -0.05 (3.1 +0.05) for the
       cover plate, the collar Ø 7.04 -0.01 (7.9) pressed into the body's bore, the Vorreiber's seat 4.5 ±0.02 to 4.38 (1:70), 8.7, the cross hole 1.1 for its pin 17.7 -0.05
       from the far shoulder, the dial-side pivot Ø 2.8 ±0.02 to 2.7 (1:70, 6.5 +0.1) in the pillar plate, and the stub Ø 1.6 +0.1/+0.05 for the up-and-down pinion (05 02 00-5,
       the motion work's), tapering 1:70 toward its end as the sheet writes in it ("1:70", as on every round portion), drawn 1.675 at its middle so its whole 3.375 lies in the
       figure's 1.65-1.70 (1.699 at the pivot's shoulder, 1.651 at the chamfer; the figure's place on the taper not given; 1:225 until 28 October 2026, drawing check 2's
       5-M14), its end 0.25 under the dial: the sheet's 60.6 overall counts the two lathe centres, cut off at the dial end (the coloured section ends the arbor under
       the pinion). The square's end is turned to a point (the sheet's other centre), its 28.3 to the tip: a cone cut through the square, the flats ending in curves (the
       sheet draws them so). Scaled on 05 06_15 at 7.0 px/mm (its 60.6 over 424.6 px; the 28.3 gives 6.9): the tip at x 585, the flats' ends at 571 and the corners' at 568,
       2.0 and 2.43 from it, which a cone of half-angle 38.7° fits to 0.2 (likely: a pixel is 0.14). Kirow 247's (4_Kirow_247_N.jpg) is pointed so (sure); the coloured
       section's dome is pictorial */
    {const rS=yT+19.7,rU=y=>0.8375+((rS+6.5+9.85)/2-y)/140;   /* = yD; the stub's radius at y (1:70 on the diameter about its middle: dial.js's UDP.rb, the pinion pressed on it) */
      /* its cross hole "1,1 bohren + konisch reiben" (drill 1.1 and ream taper, at assembly with the Vorreiber's pin), 2 from the dial-side shoulder (19.7 less the 17.7 -0.05),
         across the axis at the Vorreiber's pin hole's turn (below): reamed with the Vorreiber's, drawn straight at Ø 1.15 (VPR: the pin's, below; the drill's 1.1 until 28
         October 2026), bored into the lathe (25 October 2026: until then not cut) */
      tag(mesh(gF,capFix(bore(turned(WD.FA.prof(),40),
        [0,yD-WD.FA.hole.dy,0],[Math.cos(PHI0+WD.FA.hole.a),0,-Math.sin(PHI0+WD.FA.hole.a)],VPR,WD.FA.hole.from,24),null),M.steel),'050604-1');
      const tA=Math.tan(WD.FA.ang*D2R);
      /* Wempe 3955's (the version as photographed) is 4.5 shorter: its pointed end shows inside the dust bush's mouth, its top at y -43.5 ±0.5 (4_Wempe_3955_N.jpg,
         photocompare.py's fit: row 114 on the fusee's axis, 9.65 px/mm along it), not 6 proud of the bush as the sheet's 28.3 puts it (-48.0); the O, S and W views show nothing
         above the mouth. Kirov No. 247's matches the sheet's. The same cone and taper, the square 15.8 */
      for(const[V,LS]of/** @type {[string,number][]} */([['last first 6mx 1943 -3955',WD.FA.LS],['3955',23.8]])){const g=rv(gF,V),yP=yT-LS,sB=SQ0-(LS-8-2.6)/100,cB=sB/Math.SQRT2,yB=yP+cB/tA+0.01;   /* the tip; the square where the cone leaves its corners, 2.6 from the tip (1:100 from SQ0 at the root) */
        const sq=KIT.crease(new THREE.CylinderGeometry(SQ0/Math.SQRT2,cB,yT-8-yB,4,1));sq.translate(0,(yT-8+yB)/2,0);tag(mesh(g,sq,M.steel),'050604-1',1);
        const NP=64,dm=t=>{const r=cB/(Math.abs(Math.cos(t))+Math.abs(Math.sin(t)));return[r*Math.cos(t),r*Math.sin(t)];},cl=[];   /* the square's outline, its corners on x and z as the CylinderGeometry's */
        for(let i=0;i<NP;i++)cl.push({loop:[[0,0],dm(i/NP*TAU),dm((i+1)/NP*TAU)],y0:p=>yP+Math.hypot(p[0],p[1])/tA,y1:yB});
        tag(mesh(g,solidGeo(cl),M.steel),'050604-1',1);}}
    /* the click wheel 05 06 04-3 (Schneckensperrrad, 6.8.47; Ms Blech 2, Ms 58 federhart): 35 teeth, tips Ø 16.0 -0.05, roots Ø 14.5 -0.2 (drawn 15.99, 14.4), the faces undercut
       8°: the sheet's 8° line runs from a root through the face, which carried on inward passes on the tooth's own side of the centre, so each tip overhangs its gap ahead of
       its root (scaled about 10° on the plan's teeth at 17.9 px/mm: sure). Until 15 October 2026 the faces leaned back 8° (the root ahead of the tip). Driving the maintaining
       clicks forward; bore 7.5 +0.05; 2 -0.1 thick (drawn 1.95); its three holes Ø 2, opened 1:8 toward its free face for the screws' heads, on Ø 11.5 ±0.05 at 120°; on the
       large end's recess floor, screwed into the body's M2 holes */
    const P35=TAU/35,CWO=ratchet(35,15.99/2,14.4/2,-1,-(15.99-14.4)/2*Math.tan(8*D2R)/7.2,5),cwR=polarMax(CWO);
    {const T=(p,r0,r1)=>({p:ring(p[0],-p[1],r0,40),q:ring(p[0],-p[1],r1,40),a:CW0-0.0,b:CW1-0.05});
      /* the bore's "0,3 +0,2" × 45° chamfer (05 06 04-3's section, at the bore's corner on its top face, where the screw holes are narrow: the face on the recess's floor, CW0,
         the holes opening 1:8 away from it to the screws' heads on the free face: sure), drawn 0.4 (the middle of 0.3 +0.2); 25 October 2026, until then left out (this comment
         named the free face until 28 October 2026, drawing check 2's 5-M7; the chamfer was always built on the floor's) */
      const bo=ring(0,0,7.525/2,96);tag(mesh(gF,solidGeo([{loop:CWO.map(([x,y])=>[x,-y]),y0:CW0,y1:CW1-0.05,F:[{p:ring(0,0,7.525/2+0.4,96),q:ring(0,0,7.525/2,96),a:CW0,b:CW0+0.4},{p:bo,a:CW0+0.4,b:CW1-0.05},...CWH.map(c=>T(c,1.0,1.125))]}]),M.brass),'050604-3');}
    /* its screws (WN-19): heads turned to the holes' 1:8, flush in the wheel, M2 3.8 into the body (its M2 6 +0.5 deep), an ISO thread (KIT.threadGeo, as WN-20's and the
       clicks' WN-21: a plain Ø 2.0 shank until 28 October 2026, drawing check 2's 5-M11), from the head's foot to its chamfered tip, turned onto its hole's helix (matchThreads);
       the heads' slots */
    for(const c of CWH){tag(mesh(gF,turned([[0,CW0],[1.0,CW0],[1.125,CW1-0.05],[0,CW1-0.05]],20),M.steel,c[0],0,-c[1]),'WN-19');   /* in the fusee's own group, as its body: fixed to it */
      {const a=CW0-3.8,b=CW0,tg=KIT.threadGeo(1.0,a,b,a+b).clone(),gt=new THREE.Group();tg.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI));tg.translate(0,a+b,0);   /* its tip toward -y, into the body */
        gt.position.set(c[0],0,-c[1]);gF.add(gt);tag(mesh(gt,tg,M.steel),'WN-19',1).userData.thread={rs:1.0,p:KIT.isoP(1.0)};}   /* in a group on its own axis, which matchThreads turns it about */
      const sl=tag(mesh(gF,new THREE.BoxGeometry(2.0,0.35,0.3),M.steelD,c[0],CW1-0.05+0.02-0.175,-c[1]),'WN-19',1);sl.rotation.y=0.7;}
    /* the cover plate 05 06 00-4 (Deckplatte; Bandstahl 24 × 1): Ø 21.1 -0.1, 0.8 -0.1 thick (drawn 0.8), its hole 6.1 H8 on the arbor's step, straight for 0.4 -0.1 from the
       face on the body (the section's "0,4 -0,1" spans that land: sure) and opened by a 60° chamfer to the outer face, the 60° taken from the axis as on the fusee wheel (drawn
       0.36 deep, 0.57 out: likely), so Ø 7.49 at that face; one screw hole Ø 1.85 -0.1 at 6 ±0.05 from the centre sunk 90° to Ø 3.1 +0.1, both from the outer face, as the
       outer edge's 45°: not sized; scaled on the section (17.0 px/mm by the 21.1 across it), at both ends it runs from the outer face 11-12 px along the axis and 10-12 px
       in, nearly the plate's whole thickness (drawn 12 px), a land of about 1-2 px left on the face on the body: drawn 0.65 × 45° (0.6-0.7), the land 0.15 (scaled:
       likely ±0.1; left out until 25 October 2026). Until 15 October 2026 the 0.4 was drawn as a recess Ø 9.4 in the face on the body and the hole's chamfer left out. Over the stop
       bar's slot, which runs under it */
    const pDP=part('coverPlate',-38),gDP=grp(pDP,fx,fz);   /* its screw's place DPS: above, with the body's holes */
    {const sp=ring(DPS[0],-DPS[1],0.9,48),   /* the screw's hole Ø 1.80, the middle of 1.85 −0.1 (Ø 1.75 until 25 October 2026, its bottom) */
     hb=ring(0,0,6.109/2,96),y0=DP0,y1=S,ch=chamf(21.05/2,0.65,240,y0,y1,false);   /* the outer edge's 45° on the outer face (y0), with the sinks */
      tag(mesh(gDP,solidGeo([...ch.cells,{loop:ch.I,y0,y1,F:[{p:ring(0,0,6.109/2+0.4*Math.tan(60*D2R),96),q:hb,a:y0,b:y0+0.4},{p:hb,a:y0,b:y1},{p:ring(DPS[0],-DPS[1],1.575,48),q:sp,a:y0,b:y0+0.7},{p:sp,a:y0,b:y1}]}]),M.steel),'050600-4');}
    /* its screw (WN-20 in the coloured section, its sheet not in the set): a 90° countersunk head Ø 3.1 seated in the plate's sink (Ø 3.15, the sheet's 3.1 +0.1), so 0.025
       under its face, M1.7 across the small end's recess and 3.5 into the body (its M1.7 6 deep): estimated. Until 18 October 2026 the head was drawn flush, 0.025 off the
       sink all round, holding nothing (the Contacts view, Inside the part) */
    {const g=new THREE.Group();g.position.set(DPS[0],0.025,-DPS[1]);gDP.add(g);tag(g,'WN-20');
      mesh(g,turned([[0,DP0],[1.55,DP0],[0.85,DP0+0.7],[0,DP0+0.7]],20),M.steel);mesh(g,KIT.threadGeo(0.85,DP0+0.6,S+1.6+3.5),M.steel).userData.thread={rs:0.85,p:KIT.isoP(0.85)};const sl=mesh(g,new THREE.BoxGeometry(2.3,0.25,0.28),M.steelD,0,DP0+0.125-0.02,0);sl.rotation.y=1.1;}   /* the slot, standing 0.02 out of the head's face as screw() draws them */
    /* the chain's pin 05 06 00-6 (Kettenstift, coloured section; the hole "0,55∅ +0,01" through the flange's ribs, 05 06 04-2): Ø 0.55 across the slot, near the ribs' tops,
       where the chain's (or the band's) hook takes it */
    {const q=pol(PINR,PINA);tag(cylBetween(gF,0.2835,F,F0-2.0,M.steel,q[0],q[1],24),'050600-6');}   /* pressed: Ø 0.567 on 24 sides in the hole's Ø 0.555 (24 sides), 0.001-0.006 tight on the radius,
       as the stop bar spring's pin 05 06 04-4 is pressed in its hole (its sheet's +0.015/+0.022 on 0,5 H7): estimated, the pin's own figure isn't in the set (Ø 0.55, 0.0025 clear
       but held by the ratchet's plate over its end and the hole's floor, until 28 October 2026: drawing check 2, 5-M5) */

    /* =============== the Vorreiber 05 06 00-2 and its pin 05 06 00-5 =============== */
    /* Präz. Rundstahl 14: the flange Ø 14 d11 (drawn 13.895), the hub Ø 7.6 -0.2 (drawn 7.5), 3.1 -0.2 overall (face a re-turned at the fusee's assembly: 2.9, the flange 1.0),
       the bore 4.4 H7 at the flange to 4.36 at the hub (1:70) fitted to the arbor's seat at assembly ("Loch Ø zur Welle passen") and seated on it, 0.007 under the seat's
       radius at the bore's corners (its 96 facets inside the arbor's 40: 0.0002-0.008 tight), held there by its pin (below; until 28 October 2026 drawn 0.01 clear of the
       seat with the pin's two ends stopping short of the arbor, so nothing held it: drawing check 2, 5-M3), a recess Ø 9.9 +0.2 × 0.4 +0.05 in face a (the solid's 0.425
       under the re-turned face: the relief cut after the re-turn, as the sheet's figure stands), and a 0.3 +0.1 × 45° chamfer (drawn 0.35) on the flange's edge on the hub's side (the section draws it at both of the flange's corners on that face, face a's
       square: sure; until 15 October 2026 on face a's edge); the pin's hole Ø 0.8, its centre 1.1 ±0.1 from the hub face. It holds the fusee wheel on the arbor from below,
       its flange in the wheel's underside recess. Steel. Pinned to the arbor, it comes apart from it in the Exploded view only with the pin driven out, which a view that
       moves each part along the arbor can't show: so it spreads with the fusee (its offset the fusee's, -33), and the fusee wheel and maintaining work held between it and
       the body with it (until 28 October 2026 -14, -21 and -25, the pin drawn as two ends in the hub for it) */
    const pV=part('vorreiber',-33),gV=grp(pV,fx,fz);
    {const rb=y=>2.19+(yD-y)*(0.06/8.7)-0.007;
      /* the pin's hole across the hub, its centre 1.1 ±0.1 from the hub face (the sheet's front view dashes it through both sides), bored into the lathe (25 October 2026:
         until then not cut): drilled Ø 0.8 (05 06 00-2) and reamed out with the arbor's, below */
      const f=PHI0+0.9,d=[Math.cos(f),0,-Math.sin(f)];
      tag(mesh(gV,capFix(bore(ringT([[rb(VFA+0.425),VFA+0.425],[4.975,VFA+0.425],[4.975,VFA],[6.9475,VFA],[6.9475,VFB-0.35],[6.5975,VFB],[3.75,VFB],[3.75,VHF],[rb(VHF),VHF]],96),[0,VHF-1.1,0],d,VPR,-5,24),null),M.steel),'050600-2');
      /* the pin (Vorreiberstift 05 06 00-5, no sheet in the set): one taper pin through the hub and the arbor, as the coloured section draws it (Wempe_Einheitschronometer.jpg:
         through the hub, its rounded ends standing out of it both sides: on the crop at 75 px/mm by the hub's drawn 7.5 (568 px), the ends 628 px apart, so 8.3 long, 0.4 out each
         side (±0.15; its thickness drawn about 0.7, pictorial: the sheets size it, below)). Its size from the
         three sheets read together: the arbor's hole "1,1 bohren + konisch reiben" (05 06 04-1: drilled 1.1, then taper-reamed at the fusee's assembly), the Vorreiber's
         drilled 0.8 (05 06 00-2, its bore "fitted to the arbor" then too), and 05 06_1's "Vorreiberstift", its circle drawn Ø 1.2: the two holes reamed through together with
         the Vorreiber on the arbor, so the reamer opens the hub's 0.8 to the arbor's size, which it must take past the drill's 1.1, and the pin is about 05 06_1's 1.2 there.
         A 1:50 reamer (the taper pin's) taking the arbor's far side just past 1.1 leaves 1.07 to 1.22 across the hub's 7.5: drawn straight at that mean, Ø 1.15, in both
         holes (the 0.075 on the radius its taper adds at the hub's faces not drawn: bore cuts straight holes), the pin Ø 1.16 in them, 0.0023-0.0055 tight on the radius
         (a pin driven home in its reamed hole; estimated: the pin's own figure isn't in the set), 8.3 long, its ends rounded r 0.25. Until 28 October 2026 drawn Ø 0.8 as
         two ends in the hub stopping 0.025 short of the arbor's metal, the arbor's hole empty (drawing check 2, 5-M3 and 5-M16) */
      const PL=4.15,lp=[[0,-PL]];for(let k=0;k<=2;k++){const t=k/2*Math.PI/2;lp.push([0.33+0.25*Math.sin(t),-PL+0.25*(1-Math.cos(t))]);}for(let k=2;k>=0;k--){const t=k/2*Math.PI/2;lp.push([0.33+0.25*Math.sin(t),PL-0.25*(1-Math.cos(t))]);}lp.push([0,PL]);   /* the round in two steps: a crease at each end that the book's drawing (its edges over 30°) shows */
      const m=tag(mesh(gV,turned(lp,48),M.steel),'050600-5');m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...d));m.position.set(0,VHF-1.1,0);}

    /* =============== the dust plate 05 06 00-1 (Staubplatte) on the winding square =============== */
    /* Rundmessing 8: Ø 7.6 -0.1, 3.1 -0.2 (drawn 3.0), its square hole "3,1 □ H7 +0,012, Kegel 1:100" tapered like the square (05 06 00-1), so it wedges on it where
       the two are one size: its face toward the plates 1.0 from the square's root, as 05 06_1 (the 1941 assembly) figures it ("1"), the hole there 3.110 (in its H7,
       3.100-3.112) on the square's 3.110 (05 06 04-1's 3.12 at the root, 1:100), 0.002 tight across the corners (pressed on by the taper; the fits' middles, 3.106 on 3.119,
       would put it 1.3 off); the coloured section draws it on the root, pictorially, within that. Its square part 2.0 long (to the recess), 3.110 to 3.090. Until 28 October
       2026 (drawing check 2, 5-M2) the hole straight 3.134, 0.004-0.024 loose on the 3.17 square read then, 4 from its root; a
       recess Ø 6.2 +0.1, 1.0 deep, in its face away from the plates, toward the key: the coloured section draws it opening upward (Wempe_Einheitschronometer.jpg,
       Ø 6.4 × 0.7 at 9.4 px/mm), and the sheet's hole narrows 1:100 toward its recessed face as the square narrows away from the plates (sure, both); the other face's
       outer edge broken 0.5 +0.2 × 45° (the section draws it at both ends of the face away from the recess, the 0.5 along the axis: sure; drawn 0.5, the tolerance's
       bottom; left out until 25 October 2026). It turns in the dust bush */
    const pSP=part('dustPlate',-70),gSP=grp(pSP,fx,fz);
    {const y1=yT-8-1.0,y0=y1-3.0,sq=d=>{const a=(SQ0-d/100)/Math.SQRT2-0.002;return[[0,a],[a,0],[0,-a],[-a,0]];};   /* the hole at d from the square's root: its corners on x and z, as CylinderGeometry's 4 sides lie */
      const ch=chamf(7.55/2,0.5,120,y0,y1,true);   /* on the face toward the plates (y1), the recess on y0 */
      tag(mesh(gSP,solidGeo([...ch.cells,{loop:ch.I,y0,y1,F:[{p:sq(3.0),q:sq(1.0),a:y0,b:y1},{p:ring(0,0,3.125,96),a:y0,b:y0+1.0}]}]),M.brass),'050600-1');}   /* the square hole tapered from the recess's floor (y0 + 1, 3 from the root) to y1 */

    /* =============== the fusee wheel 05 06 00-3 (Schneckenrad) =============== */
    /* Messingblech 5,5 Ms 58 federhart: 90 cycloidal teeth, D 40.57 (hobbed), d 39.21, dg 37.84, l 0.64, m 0.4356 (its table), driving the centre pinion (14); the rim 2.62
       -0.04 and the ledge inside it, 0.2 +0.02 lower, out of Ø 33.8 -0.2; the recess on its face Ø 32.3 +0.05 for the maintaining spring, down to the web, 1.22 -0.04; the hub
       Ø 16.6 -0.2 as thick as the rim, its edge broken 45°, and on it the tube Ø 6.5 g6 (05 06_1's 6,5 H7/g6, under the ratchet's
       6,5 H7: 05 06 02-1, drawn 29.11.40 and unchanged by its revision of 11.3.48; the sheet's figure there reads "6,6 +0,1" written over a struck one, the tube drawn 6.31-6.44,
       and a 6.6 tube can't enter the ratchet's bore), 5 +0.2 from the underside, on which the maintaining ratchet turns; the bore 4.55, running on the arbor's seat (the sheet's
       "4 +0,1" can't pass it; 05 06_1's fit table gives the wheel 4,45 H7/g6 there, a straight seat's fit: on 05 06 04-1's 1:70 seat, 4.43-4.48 under the wheel, a 4,45 H7
       bore would wedge, so the 4.55 is an estimate, 0.04-0.06 clear on the radius, 4-5 times H7/g6's clearance: README, Estimated); underneath, the recess Ø 14 +0.1 × 1.3 -0.1 for the Vorreiber's flange, its mouth chamfered 60° from Ø 17 +0.2 on the underside: the 60° taken
       from the axis (from the face it would run 2.6 deep, twice the recess), so the chamfer reaches Ø 14 0.87 up and the recess's wall is straight above it (the section draws
       the slope from Ø 17, scaled 16.8, to about 1.0 up: likely; until 15 October 2026 a 0.3 × 45° from Ø 14.6); the hub's top edge 0.5 × 45° as drawn before (the
       section's slope there, unsure). The maintaining spring's pin hole 1.2 H8 at r 14.2 -0.02. Gilt (Wempe 3955). Four solids: hub and tube, web (with the pin hole), ledge and rim,
       the teeth; the web's bore opened to Ø 17.2 at the underside's mouth, which cuts into it */
    const pW=part('fuseeWheel',-33),gW=grp(pW,fx,fz),gWp=new THREE.Group();gW.add(gWp);
    const PINW=-Math.PI/2,TW=teeth(90,0.4356,40.57,37.84,14,0.64);
    {const RM=17.1/2,RH=8.65,ch=r=>W-(RM-r)/Math.tan(60*D2R);   /* the mouth's radius (17 +0.2), the hub's outer radius on the underside (the web's bore there), the chamfer's height at r */
      const wP=[tag(mesh(gWp,ringT([[2.275,WTB],[3.245,WTB],[3.245,W-2.22],[7.3,W-2.22],[8.3,WW],[RH,WW],[RH,W],[RM,W],[7.0,ch(7.0)],[7.0,W-1.3],[2.275,W-1.3]],96),M.gilt),'050600-3')];   /* the hub's face 0.4 −0.05 under the lip, a 45° flank 1.0 down to Ø 16.6 at the web (05 06 00-3's section read pixel by pixel; until 26 October 2026 the hub as high as the lip, its edge 0.5 × 45°) */
      const pw=sh(14.2,PINW-295*D2R);   /* under the spring's pin at 295° (05 06 01-1), which goes down into the wheel (05 06_4 A-B; its eye's pin goes up into the ratchet) */wP.push(tag(mesh(gWp,solidGeo([{loop:ring(0,0,16.15,320),y0:WW,y1:W,F:[{p:ring(0,0,RH,160),a:WW,b:W},{p:ring(pw[0],-pw[1],0.6035,32),a:WW,b:W}]}]),M.gilt),'050600-3',1));
      wP.push(tag(mesh(gWp,ringT([[16.15,WT],[16.9,WT],[16.9,W],[16.15,W]],320),M.gilt),'050600-3',1));   /* the lip between Ø 32.3 and Ø 33.8 the one part at the full 2.62; the rim and the teeth outside it 0.2 lower (05 06 00-3's section: the 2,62 runs to the lip alone; until 26 October 2026 the other way round) */
      const tg=slab(TW.xy,[[...Array(320).keys()].map(i=>{const t=-i/320*TAU;return[16.9*Math.cos(t),16.9*Math.sin(t)];})],WL,W);   /* its bore the lip's own 320 corners (the lathe's): the arc's 48 cut 0.02-0.04 into the ledge, 6.2 mm³ weighed twice until 24 October 2026 (overlaps.py) */Object.assign(tg.userData,{ro:TW.ro,ri:TW.ri,pl:TW.xy});const tm=tag(mesh(gWp,tg,M.gilt),'050600-3',1);tm.userData.gear={z:90,m:0.4356};fuse([...wP,tm],tm);   /* the wheel one mesh (fuse; the teeth's own box kept, gear.box): its four solids' flush faces drew rings in Edges until 21 October 2026 */
      /* phased under load against the centre pinion (gearLash, core.js): the wheel drives it, turning rotation.y up; the pinion keeps its place (train.js), the wheel is turned to suit */
      const pin=TR.cw.userData.pin,[a,b]=gearLash(tm,FX,pin,H[1],1);tm.rotation.y=0;gWp.rotation.y=a+b*14/90;pW.userData.toothMesh=tm;}

    /* =============== the maintaining work: the ratchet 05 06 02 (Gegensperrrad kompl.) and the maintaining spring 05 06 01 (Gegenfeder) =============== */
    /* Turning with the fusee wheel: the spring's eye is pinned to the ratchet, its other end (the pin at 295°) to the wheel (05 06_4 Schnitt A-B: the eye's pin drawn whole,
       "Stift nach oben", up into the ratchet, whose own sheet puts its pin hole at 6 o'clock between the clicks at 9 and 3, as A-B draws the eye; the other pin hidden under
       the ratchet's plate, down into the wheel; until 16 October 2026 the other way round, the ratchet's sheet turned 65° to meet it). Running, the fusee drives the ratchet
       through the click wheel and the two clicks, the ratchet the spring, the spring the wheel: the drive closes the ring, its ends nearly meeting (14.4-15.6° of the ratchet ahead of the
       wheel over the wind, 1.1-2.3° short of its eye meeting its square end, WPHYS.MSB 16.7°: tools/wempe_sustaining.js), and the ring is drawn so, bent as its section bends
       it (below).
       Winding, the key turns the fusee back, the clicks ride over the click wheel, the ratchet turns back with the spring until the maintaining detent takes a tooth and is
       held, and the spring, opening, drives the wheel on (s.ms, the ratchet's lead over the wheel: WPHYS.susPhi).
       The drawings of this work (05 06_4 Schnitt A-B, 05 06 02, 05 06 01-1, 05 05 05-1) are seen from the fusee's small end, the movement's back (the top plate's side): mirrored here. Angles in the
       ratchet's own sheet (05 06 02-1: its pin hole at 6 o'clock, the clicks' screws at 9 and 3) and the spring's (05 06 01-1: 0° at 6 o'clock, anticlockwise as drawn) are
       set so the spring's pins meet both holes */
    const pMW=part('maintaining',-33),gMW=grp(pMW,fx,fz),gMS2=grp(pMW,fx,fz);   /* the ratchet with its clicks and the spring's eye pin; the spring and its other pin, with the wheel */
    const bk=(ab,rot)=>-Math.PI/2-ab*D2R+rot;   /* an angle in a sheet seen from the back (from 6 o'clock, anticlockwise as drawn), in the frame here, the sheet turned rot */
    const PINS=bk(295,0),EYO=0,EYEA=bk(0,0)+EYO/14.2,GROT=EYEA-bk(0,0);    /* the spring's pin at 295° (in its sheet: 65° the other way from 0°), its eye's hole on its 0° line (EYO, mm toward the square end: 05 06 01-1, to scale there, draws it on the line; its "0,8" there, taken as this offset until 16 October 2026, measures to a line about 2 off, README Unresolved); the ratchet's sheet turned to put its pin hole on the eye */
    /* the ratchet 05 06 02-1 (Messingblech 3,5 Ms 58 federhart, revised 11.3.48): 120 teeth, tips Ø 37.25 -0.1 (drawn 37.2), 0.7 +0.05 deep, their steep faces facing the
       detent, the backs about 35° (scaled); the plate 1.02 -0.02 at the teeth and 1.3 -0.1 inside the cup (the section draws the floor inside the cup higher than the plate
       outside it: 1.3 and 0.94 scaled at 6.9 px/mm, sure), so the cup's rim stands 2.1 over the plate outside it (3.1 less 1.02: the "2,1"); the cup Ø 26.1 -0.2 outside, 24.45
       +0.1 inside, 3.1 -0.2 overall (drawn 3.1), revision (a)'s 0.3 +0.15 × 45° on its outer top edge (the leader and the 0.3's extension line meet the outer corner, and the
       section's right half draws the slope outside: sure); bore 6.5 H7; the clicks' screws M1.7 at 19.5 +0.05 apart (9 and 3 o'clock); the clicks' springs' pins Ø 0.6
       through the cup at 42° and 60° above 9 o'clock and as far below 3; the spring's pin hole 1.2 H8 at r 14.2, 6 o'clock. Until 15 October 2026 the plate was 1.02 inside
       the cup too (the clicks 0.28 lower) and the chamfer on the cup's inner edge */
    /* As first drawn (05 06 02-1 before revision (a), 11.3.48: "Maß 37,25∅ war 37,5∅"): the tips Ø 37.5, drawn 37.45 (its tolerance not kept: the revised one's -0.1 taken), the
       teeth as deep, so 0.125 further out under the maintaining detent; revision (a)'s other changes leave the part as it was (its struck "25,4∅" the chamfer's top, 26.1 less
       2 × 0.35, as the revised 0.3 +0.15 puts it on the drawn cup's 26.0: the same chamfer, built in both). Built 27 October 2026 (until then in neither version) */
    const GSO=ratchet(120,37.2/2,37.2/2-0.725,1,0,3),GSO1=ratchet(120,37.45/2,37.45/2-0.725,1,0,3),gsR0=polarMax(GSO,12000,true),gsR1=polarMax(GSO1,12000,true),SPY=GP-0.75;   /* SPY: the click springs' and their pins' height; the tables 100 rays a tooth, so each tooth's seat is the same (8192: the drop moved a ray from tooth to tooth, and the rig's one-tooth loop missed it by the drop) */
    let gsR=gsR0;onRev(v=>{gsR=v==='first'||v==='3955'?gsR1:gsR0;});   /* the teeth the maintaining detent seats on, the version's */
    const CKP=[bk(270,GROT),bk(90,GROT)].map(a=>sh(9.75+0.0125,a)),SPP=[[228,210],[48,30]].map(pp=>pp.map(d=>bk(d,GROT)));
    {const ph=sh(14.2,EYEA),F_=[{p:ring(0,0,6.5075/2,96),a:GP,b:G},{p:ring(ph[0],-ph[1],0.6035,32),a:GP,b:G},...CKP.map(c=>({p:ring(c[0],-c[1],0.87,32),a:GP,b:G,th:{rs:0.85}}))];   /* the clicks' screws' M1.7 tapped (KIT's threadWall; plain until 27 October 2026) */
      /* one solid of plan cells (solidGeo), each depth filled once: inside the cup the floor GP..G with the bore and the clicks' tapped holes; the cup's wall GC..G from r 12.225
         to 12.7; its chamfer 0.3 × 45° to r 13.0 (a strip); the plate at the teeth GT..G, with the spring's pin hole; the rings and the plate each in two halves, split on the
         radial line through a tooth's tip and the one opposite, away from the pin hole and the rivets' holes. Then the springs' rivets' Ø 0.6 holes bored through the wall (left out until 26 October
         2026, the pins in the metal). Until 28 October 2026 three solids fused (the plate GT..G over the whole disc, the floor GP..GT and the wall GC..GT), whose faces at GT
         and r 12.225 lay inside the part (the second drawing check, 3-M13) */
      const pA=Math.atan2(ph[1],ph[0]),PT=TAU/120,k0=(()=>{const far=(a,d)=>Math.abs(wrap(a))>d&&Math.abs(wrap(a+Math.PI))>d;for(let k=0;k<60;k++)if(far(pA-k*PT,0.35)&&SPP.flat().every(a=>far(a-k*PT,0.15)))return k;return 0;})(),f0=-k0*PT;   /* the split: the plan angle of tooth k0's tip, 20° or more from the pin hole and 8.6° from the rivets */
      const arc=(R,a)=>Array.from({length:81},(_,j)=>[R*Math.cos(a+Math.PI*j/80),R*Math.sin(a+Math.PI*j/80)]),ccw=L=>{let A=0;for(let q=0;q<L.length;q++){const u=L[q],w=L[(q+1)%L.length];A+=u[0]*w[1]-w[0]*u[1];}return A>0?L:L.slice().reverse();};
      const inH=(a,p)=>wrap(Math.atan2(p[1],p[0])-a-Math.PI/2)**2<(Math.PI/2)**2;   /* a plan point in the half from angle a to a + π */
      const cupG=O=>{const Op=O.map(([x,y])=>[x,-y]),n=Op.length,i0=k0*4,C=[];
        for(const[h,a]of[[0,f0-Math.PI],[1,f0]]){const T=[];for(let q=0;q<=n/2;q++)T.push(Op[(i0+h*n/2+q)%n]);   /* the teeth from one split tip to the other, plan angles falling from a + π to a */
          const PH=inH(a,[ph[0],-ph[1]])?[{p:ring(ph[0],-ph[1],0.6035,32),a:GT,b:G}]:[];
          C.push({loop:ccw([...T,...arc(13.0,a)]),y0:GT,y1:G,F:PH},{loop:ccw([...arc(12.7,a),...arc(13.0,a).reverse()]),y0:q=>GC+(Math.hypot(q[0],q[1])-12.7),y1:G,strip:1},{loop:ccw([...arc(12.225,a),...arc(12.7,a).reverse()]),y0:GC,y1:G});}
        C.push({loop:ccw([...arc(12.225,f0-Math.PI).slice(0,80),...arc(12.225,f0).slice(0,80)]),y0:GP,y1:G,F:F_.filter((f,q)=>q!==1)});
        return SPP[0].reduce((g,a)=>capFix(bore(g,[13.5*Math.cos(a),SPY,-13.5*Math.sin(a)],[-Math.cos(a),0,Math.sin(a)],0.3,0,16),null),solidGeo(C));};   /* each pair's holes in one bore, from outside across the cup (its pins at 228° and 48°, 210° and 30°: on one line) */
      for(const[V,O]of/** @type {[string,any][]} */([['last 6mx 1943',GSO],['first',GSO1]]))tag(mesh(rv(gMW,V),cupG(O),M.gilt),'050602-1');}   /* one solid, one mesh: flush faces drew lines on it in Edges until 21 October 2026 */
    /* the clicks 05 06 02-3 (Sperrkegel; Bandstahl 11 × 2, hardened, blued at 295°): 10.05 -0.1 long, 1.82 -0.04 thick, the pivot hole 1.2 H7 5.2 from the nose's foot and from
       the tail's tip, the nose 2 high, the back an arc r 8, the underside hollowed r 3 about a point 2.78 and 3.54 from the hole; traced on the sheet (10:1, 33.8 px/mm) between
       those figures. The base line 1.5 under the hole, tangent to the boss's thin Ø 3 circle: the r 3 hollow's chord there ends at the nose's foot 5.201 from the hole, the
       "5,2 -0,1" (a radius about the pivot: the sheet draws its arc through the nose's foot); it scales 1.52-1.545, and was built at 1.52 until 28 October 2026, which put the
       foot 5.224 out, past the figure (the second drawing check, 3-M2); the nose's face at 85° to
       it, leaning back toward the pivot (scaled 85.1°, sure), so its tip 2 over the base line and 0.17 nearer the pivot than its foot. Until 15 October 2026 the base line lay
       1.68 under the hole and the face 1.84 tall, leaning out (91.6°). Each turns on its screw's shoulder, seated by the click wheel (seat(), below) */
    const CKB=-1.5,CKN=[-2.78-Math.sqrt(9-(3.54+CKB)**2),CKB],CKT=[CKN[0]+2/Math.tan(85*D2R),CKB+2];   /* the base line, the nose's foot and its tip */
    const CKL=(()=>{const o=[],arc=(c,r,a0,a1,n)=>{for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}};
      const C3=[-2.78,-3.54],h0=[-2.78+Math.sqrt(9-(3.54+CKB)**2),CKB],q8=(()=>{const A=CKT,B=[-0.4,1.45],m=[(A[0]+B[0])/2,(A[1]+B[1])/2],d=[B[0]-A[0],B[1]-A[1]],l=Math.hypot(...d),h=Math.sqrt(64-l*l/4);return[m[0]+d[1]/l*h,m[1]-d[0]/l*h];})();
      const TK=(()=>{let a=0.5,b=0.7;for(let i=0;i<50;i++){const k=(a+b)/2,s=Math.hypot(k,1);if(Math.hypot((1.5*s-0.2*s-(CKB+0.2))/k,CKB+0.2)+0.2>5.2)a=k;else b=k;}return(a+b)/2;})();   /* the top edge's slope: tangent to the boss, its tail's round reaching the sheet's 5.2 from the hole (0.581; scanned 0.585, which with the base at 1.5 leaves the tail 5.17) */
      const TL=[TK,1].map(v=>v/Math.hypot(TK,1)),TC=[(1.5*Math.hypot(TK,1)-0.2*Math.hypot(TK,1)-(CKB+0.2))/TK,CKB+0.2],T1=[TC[0]+0.2*TL[0],TC[1]+0.2*TL[1]],TB=Math.atan2(TL[1],TL[0]);   /* the top edge's normal, the tail's round r 0.2 (its centre, its point on the top edge) */
      o.push([TC[0],CKB]);o.push(h0);   /* from where the tail's round meets the base line, along it to the hollow */
      arc(C3,3,Math.atan2(h0[1]-C3[1],h0[0]-C3[0]),Math.atan2(CKN[1]-C3[1],CKN[0]-C3[0]),14);   /* the hollow, from the base line back to the nose's foot */
      o.push(CKT);   /* the nose's face up to its tip */
      arc(q8,8,Math.atan2(CKT[1]-q8[1],CKT[0]-q8[0]),Math.atan2(1.45-q8[1],-0.4-q8[0]),12);   /* the back, r 8, to the boss */
      arc([0,0],1.5,Math.atan2(1.45,-0.4),TB,8);   /* round the boss to the top edge's tangent point */
      o.push(T1);for(let i=1;i<8;i++){const a=TB+(-Math.PI/2-TB)*i/8;o.push([TC[0]+0.2*Math.cos(a),TC[1]+0.2*Math.sin(a)]);}return o;})();   /* the top edge, one line tangent to the boss (05 06 02-3: y = 1.738 - 0.585 x scanned; its slope set to 0.581, TK, so the tail's far point is the sheet's 5.2 with the base at 1.5), and the tail's round r 0.2 into the base line (scaled); overall 10.01, the 10,05 -0,1 (until 26 October 2026 the edge kinked at (1.4, 1.0) to a sharp tip, up to 0.30 thin) */
    const gCK=[];
    for(const c of CKP){const g=new THREE.Group();g.position.set(c[0],0,-c[1]);gMW.add(g);gCK.push(g);
      const xy=CKL.map(([x,y])=>[x,-y]);   /* mirrored: the sheet is seen from the back */
      /* its pivot hole 1.2 H7 (drawn Ø 1.209) sunk 45° to Ø 1.7 on one face and opened to Ø 2.2 on the other (05 06 02-3's edge view, 135 px/mm on the crop by its 1.82:
         the 1.7's sink 0.24 deep, the 2.2's cone 0.42 deep, its sides 50° off the axis; the "3∅" on that cone not read): the edge view, below the plan in first angle, has the
         face toward the plan's viewer at its foot, the 2.2's, and the plan is seen from the back (mirrored here), so the 2.2 opens on the free face toward the small end and
         the 1.7 sink lies on the ratchet's cup floor (likely: the projection's reading; 25 October 2026, until then a plain hole) */
      const ph=ring(0,0,0.6045,32);tag(mesh(g,solidGeo([{loop:xy.map(([x,y])=>[x,-y]),y0:GP-1.82,y1:GP,F:[{p:ph,a:GP-1.82,b:GP},{p:ring(0,0,1.1,32),q:ph,a:GP-1.82,b:GP-1.82+0.42},{p:ph,q:ring(0,0,0.85,32),a:GP-0.25,b:GP}]}]),M.blued),'050602-3');g.userData.tip=xy.filter(([x,y])=>x<-1.0);}   /* the outline's points toward the nose, to seat it on the click wheel */
    /* their screws (WN-21, coloured section): put in from under the ratchet's plate, the head under it, the thread in the plate's M1.7, a shoulder Ø 1.19 above it for the
       click (its hole 1.2 H7), 0.1 past it; head Ø 2.6 × 0.5, the slot in it: estimated */
    for(const c of CKP){const g=new THREE.Group();g.position.set(c[0],0,-c[1]);gMW.add(g);tag(g,'WN-21');
      const yE=GC+0.25;mesh(g,turned([[0,yE],[0.3,yE+0.03],[0.5,yE+0.09],[0.595,yE+0.15],[0.595,GP+0.05],[0,GP+0.05]],20),M.steel);mesh(g,turned([[0,G],[1.3,G],[1.3,G+0.9],[0,G+0.9]],20),M.steel);   /* the head 0.9 high and the end domed 0.25 inside the cup's rim, as 05 06 02's section draws them (until 26 October 2026 0.5 and flat, 0.12 past the rim: estimated) */
      {const tg=KIT.threadGeo(0.85,GP-0.1,G,G+GP).clone();tg.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI));tg.translate(0,G+GP,0);mesh(g,tg,M.steel).userData.thread={rs:0.85,p:KIT.isoP(0.85)};}   /* the M1.7 through the plate, from 0.1 in the head to the cup's floor, an ISO thread on the plate's (matchThreads; a plain Ø 1.7 until 27 October 2026): built tip up and turned over about y (G + GP)/2, its helix's phase (yr G + GP) still 0 at the screw's origin, so matchThreads turns it as any shank (the profile is even in u) */
      const sl=mesh(g,new THREE.BoxGeometry(2.4,0.25,0.3),M.steelD,0,G+0.9+0.02-0.125,0);sl.rotation.y=0.4;}
    /* the clicks' springs 05 06 02-2 (Sperrfeder; Bronzeband 1.5 × 0.4 federhart, "gestreckt 27,0"): along the cup's wall from their end, through the pin hole
       0.6 5 from it, 5 more to the S (05 06 02-2: sure; at 17.1 px/mm the end and the bend scale 23.5° and 22.1° from the hole, 4.9 and 4.6), the S round two Ø 2.2
       formers (02-2 draws both circles, the strip on the inside one then the outside one) in 1.6 to the long arm (the "12,0" and "10,4" to the outer face, as 05 06_4's
       A-B's "0,2" from the cup's wall puts it: the strip's middle on r 11.825 along the wall, 0.2 off the wall's 12.225 (the second drawing check, 3-M5: on r 12.0, 0.025
       off it, until 28 October 2026), and 10.225 on the arm): its bends round the formers (their middle line r 1.3) and the straight between them solved so the arm
       starts 15° round from where the S leaves the wall, where 02-2 draws the formers' tangencies (until 28 October 2026 a cosine ramp over 8.5°, scaled on the
       sprung assembly 05 06 02; 3-M7); then on the arm to the tip on the click's back (below). The hole is on the pin at 60° over 9 o'clock (05 06 02-1's 42° and 60°,
       18° apart), the other pin beside the end. Its length the sheet's 27.0: the tip, sprung onto the click's back, lies where the strip ends (TIPL; 05 06 02 draws it
       8.6° over 3 o'clock, 110° from the hole, as 02-2's free spring's "110°": with the S and runs as figured the strip reaches about 115° on the drawn r 10.4, the
       refuter's centreline on 02-2 26.9 long at 113.9°, so the figure is the drawing's round number: likely). Until 28 October 2026 the tip on the 110° line, 26.6 long;
       until 25 October 2026 the end 1.44 short of the 42° pin and the S 3.6 past the 60° (the sheets' 5 and 5), the tip on the back a third of the way from the nose
       (99° from the hole): 24.4 long. The free end runs to the click wherever the click stands (rebuilt as it rides) */
    const spr=[],SPH=1.5,CKBK=CKL.slice(17,31);   /* CKBK: the click's back, its r 8 arc from the nose's tip to the boss */
    SPP.forEach((pp,i)=>{const m=tag(mesh(gMW,new THREE.BufferGeometry(),M.brass2),'050602-2');spr.push({m,pp,ck:gCK[1-i],last:null});
      /* their rivets 05 06 02-4 (the coloured section's "Niet"; 05 06 02 draws each with a rounded head on both sides, about 0.2 high, past the wall's outer face and inside the
         spring's inner face: the second drawing check, 3-M6): the shank Ø 0.6 through the spring and the cup's wall, a domed head 0.2 high each side, Ø 1.0 (estimated: no
         sheet sizes the heads), seated on the spring's inner face (r 11.625, its base 0.012 inside so it clears the face's curve) and the wall's outer face (r 13.0). Turned on 32 sides, their flats on the cup's Ø 0.6 hole (16 left two 0.022 loose: bom.py's press 0.02). Until 28
         October 2026 plain pins Ø 0.6 × 1.6, flush with the spring inside and 0.4 proud of the wall */
      const RV=(()=>{const cap=(u0,sg)=>{const o=[];for(let i=0;i<=8;i++){const a=Math.atan2(0.5,0.725-0.2)*(1-i/8);o.push([0.725*Math.sin(a),u0+sg*(0.725*Math.cos(a)-0.525)]);}return o;};
        return[...cap(11.613,-1).reverse(),[0.3,11.613],[0.3,13.002],...cap(13.002,1)];})();
      for(const a of pp){const cg=turned(RV,32);cg.rotateZ(-Math.PI/2);cg.translate(0,SPY,0);cg.rotateY(a);tag(mesh(gMW,cg,M.brass2),'050602-4');}});
    function sprGeo(o){const ck=o.ck,P=[],Y=SPY,V=(r,a)=>new THREE.Vector3(r*Math.cos(a),Y,-r*Math.sin(a));
      const RO=11.825,RI=RO-1.6,RC=1.3,DS=15*D2R,TIPL=27.0;   /* the wall run's and the arm's middle radii, the formers' (1.1) plus half the strip, the S's span, the strip's length */
      const a0=o.pp[1]-5/RO,a1=o.pp[1]+5/RO;for(let i=0;i<=12;i++)P.push(V(RO,a0+(a1-a0)*i/12));   /* along the wall from its end, the hole on the 60° pin halfway */
      /* the S, in the frame of its start (on r RO at angle 0, heading round): a bend b1 in round the first former, a straight, a bend b1 - DS out round the second, onto r RI at DS */
      const cs=Math.cos(a1),sn=Math.sin(a1),pt=(X,Z)=>new THREE.Vector3(X*cs-Z*sn,Y,-(X*sn+Z*cs)),c1=[RO-RC,0],c2=[RI*Math.cos(DS)+RC*Math.cos(DS),RI*Math.sin(DS)+RC*Math.sin(DS)];
      const ends=b=>{const h=Math.PI/2+b,P1=[c1[0]+RC*Math.cos(h-Math.PI/2),c1[1]+RC*Math.sin(h-Math.PI/2)],Q=[c2[0]+RC*Math.cos(h+Math.PI/2),c2[1]+RC*Math.sin(h+Math.PI/2)];return[P1,Q,Math.cos(h)*(Q[1]-P1[1])-Math.sin(h)*(Q[0]-P1[0])];};
      let lo=0.5,hi=1.2;for(let i=0;i<50;i++){const m=(lo+hi)/2;if(/** @type {number} */(ends(m)[2])>0)lo=m;else hi=m;}const b1=(lo+hi)/2;   /* 47.3°, the straight 1.58: 02-2 draws 51-55° and 36-40° round formers 15° apart (its step there drawn 1.82 for the figured 1.6) */
      for(let i=1;i<=8;i++){const h=Math.PI/2+b1*i/8;P.push(pt(c1[0]+RC*Math.cos(h-Math.PI/2),c1[1]+RC*Math.sin(h-Math.PI/2)));}
      for(let i=0;i<=8;i++){const h=Math.PI/2+b1-(b1-DS)*i/8;P.push(pt(c2[0]+RC*Math.cos(h+Math.PI/2),c2[1]+RC*Math.sin(h+Math.PI/2)));}
      const aS=a1+DS,len=Q=>{let l=0;for(let i=1;i<Q.length;i++)l+=Q[i].distanceTo(Q[i-1]);return l;},L0=len(P);
      /* its tip on the click's back where the strip's 27.0 ends (or the back's nearer end), in this frame: the arm drawn out from r RI onto the back where it crosses the line at aT, aT found so the whole is TIPL */
      const W=CKBK.map(q=>new THREE.Vector3(q[0],0,q[1]).applyAxisAngle(new THREE.Vector3(0,1,0),ck.rotation.y).add(ck.position));
      const arm=aT=>{const rel=v=>wrap(angOf(v.x,v.z)-aT);let E=Math.abs(rel(W[0]))<Math.abs(rel(W[W.length-1]))?W[0]:W[W.length-1];for(let k=0;k+1<W.length;k++){const u=rel(W[k]),w=rel(W[k+1]);if(u*w<=0&&u!==w){E=W[k].clone().lerp(W[k+1],u/(u-w));break;}}
        const rE=Math.hypot(E.x,E.z)+0.21;let aE=angOf(E.x,E.z);while(aE<aS)aE+=TAU;while(aE>aS+TAU)aE-=TAU;
        const n=Math.max(4,Math.ceil((aE-aS)/0.05)),A=[P[P.length-1]];for(let i=1;i<=n;i++){const f=i/n;A.push(V(RI+(rE-RI)*f*f*f,aS+(aE-aS)*f));}return A;};
      let tl=o.pp[1]+90*D2R,th=o.pp[1]+135*D2R;for(let i=0;i<30;i++){const m=(tl+th)/2;if(L0+len(arm(m))<TIPL)tl=m;else th=m;}const A=arm((tl+th)/2);P.push(...A.slice(1));
      const g=ribbonHoleGeo(P,0.4,SPH,[{s:RO*(o.pp[0]-a0),r:0.305},{s:5,r:0.305}]);g.userData.len=L0+len(A);g.userData.tipA=((tl+th)/2-o.pp[1])/D2R;return g;}   /* its own holes Ø 0.6 +0.02 on both pins (05 06 02-2: the one 5 from the end figured, the end's "0,6∅" across the other's dashed lines, 18° from it, on the 42° pin, as 05 06 02 draws both pins through the spring; "0,8 -0,05" from its edge: on its middle, 0.75, the lower limit; a plain ribbon until 27 October 2026, the pins in the metal) */
    /* the maintaining spring 05 06 01-1 (Gegenfeder; Bandstahl 35 × 1.75, hardened in oil, blued at 310°, its ends tempered at 400°): an open ring Ø 32.3 -0.1, 2 wide, 1.35
       -0.1 thick (drawn 1.3, the kompl. sheet's finished 1.3), its eye turned in at 0° (r 1.8, the hole 1.2 H7 on the 0° line: EYO, above), widened inward to 4 at its square end, 6
       short of the eye, its other hole 1.2 H7 on r 14.2 at 65° from the eye: the outline from 05 06 01-1, its inner edge three arcs traced on the sheet (5:1, 17.26 px/mm by
       the ring's circles; w48 below): 2.0 wide from 50° to 270° from the eye, wider toward the eye (3.16 at 10°), the swell's r 6 to 3.68 at 293.9°, then to the end's "4" at
       336° (its corners scaled radial at 335.6°): sure. Until 15 October 2026 the swell was estimated: 3.4 at 288°, 4 at the end. Its two
       pins (Stellstift f. Gegenfeder 05 06 00-8, Ø 1.25 on 020605: drawn 1.2 in the holes' 1.2) stand 1.2 out of it, the eye's up into the ratchet, the other down into
       the wheel (05 06_4 A-B: above) */
    /* As first drawn, 020605 (Gegenfeder kompl., 127-556.04-U18, 15.4.41: the older number of the same spring, drawn the same day as 05 06 01-1): the same ring, eye, pins and
       holes, but its width given round it, 1.8 at 40°, 1.9 at 100°, 2 at 150° and 195°, 2.5 at 240°, 3.5 at 270° from the eye (all sure), so it widens from the eye's side to
       the square end; drawn between those figures, on to 4 at the square end as 05 06 01-1's (estimated) */
    const msBent=[];let gEP=null;
    {const aE=bk(0,0),aSq=bk(336,0),eye=sh(14.2,EYEA),hs=sh(14.2,PINS);
      const tab=T=>d=>{for(let i=1;i<T.length;i++)if(d<=T[i][0]){const[a0,w0]=T[i-1],[a1,w1]=T[i];return w0+(w1-w0)*(d-a0)/(a1-a0);}return 4;};
      const w41=tab([[0,1.8],[40,1.8],[100,1.9],[150,2],[195,2],[240,2.5],[270,3.5],[336,4]]);
      /* 05 06 01-1's width (u in degrees from the eye, the sheet's sense), its inner edge as the sheet constructs it, three arcs on the ring's inner circle r 14.125 (Ø 32.3
         −0.1 less twice the 2), each traced on the sheet (tools/wempe_maintspring.py: the edge along rays from the ring's centre every 0.25°, 17.26 px/mm by the ring's two
         circles; a circle fitted to each run): from the eye an arc r 10.41 (traced: r 10.40, rms 0.005 over 11-40°, its centre on the 50.2° ray) tangent to the inner circle at 50.3° (its centre there, 3.715 from
         the axis), widening the band to 3.16 at 10° and to the eye, which it meets in a shallow corner 0.08 deep, as the sheet draws it (until 27 October 2026 the band 2 wide
         up to the eye, a corner 1.7 deep, no figure there); the swell, the "6": an arc r 6 about the small circle drawn on the 9 o'clock line (8.125 from the axis, tangent to
         the inner circle at 270°; the trace within 0.02 of it over 278-293.5°); and from its corner (at 293.9°, 3.68 wide) to the square end an arc r 13.24 (traced: rms 0.004
         over 295-335°, its centre on the 160.3° ray) through the end's "4" at 336°. Until 27 October 2026 a width table traced every 2-10° and joined straight (kinks along
         the swell, the drawings check, batch 6). wempe_sustaining.js reads this block */
      /* MS-W48 */const w48=(()=>{const R0=16.125,RI=14.125,t=u=>[Math.sin(u*D2R),Math.cos(u*D2R)],far=(u,c,R)=>{const[x,y]=t(u),d=x*c[0]+y*c[1];return d+Math.sqrt(d*d-c[0]*c[0]-c[1]*c[1]+R*R);};
        const UA=50.3,RA=10.41,cA=t(UA).map(q=>q*(RI-RA)),c6=t(270).map(q=>q*(RI-6)),RE=13.24,E=t(160.29);
        let lo=0.5,hi=2;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(far(336,E.map(q=>q*m),RE)>R0-4)lo=m;else hi=m;}const cE=E.map(q=>q*(lo+hi)/2);   /* the end arc's centre on its ray, so it reaches the "4" */
        let a=285,b=300;for(let i=0;i<60;i++){const m=(a+b)/2;if(far(m,c6,6)>far(m,cE,RE))a=m;else b=m;}const UC=(a+b)/2;   /* the swell's corner */
        const w=u=>u<UA?R0-far(u,cA,RA):u<270?R0-RI:u<UC?R0-far(u,c6,6):R0-far(u,cE,RE);w.UC=UC;return w;})();/* /MS-W48 */
      /* closed by the drive (ms, the ratchet's lead over the wheel, rad): its eye's pin turned with the ratchet, its other end held by its pin and by the recess's wall
         (clamped: tools/wempe_sustaining.js), the band bent between as an elastica, from the clamp to the eye's round end: its turn θ' = θ0' + M / E I (I as the width
         cubed: t and E drop out of the shape), M = (p - x) × F the moment about the bent band's point of the force on the eye's pin, F found by Newton so the eye's pin
         lies where the ratchet turns it (wempe_sustaining.js solves the same, and gives the push). Each outline point moves with the band's section at its angle round,
         the eye's round end with the band's end, the tail past the pin not at all */
      const bend=(wf,R0=16.125)=>{const u0=1.8/14.2/D2R,N=300,C=[],I=[];for(let i=0;i<=N;i++){const u=295-(295-u0)*i/N,w=wf(u);C.push(i?sh(R0-w/2,aE-u*D2R):hs);I.push(w**3);}
        const Ls=[],As=[];for(let i=1;i<=N;i++){Ls.push(Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]));As.push(Math.atan2(C[i][1]-C[i-1][1],C[i][0]-C[i-1][0]));}
        const rot=(v,a)=>[v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a)],off=[eye[0]-C[N][0],eye[1]-C[N][1]];
        const shoot=(F,tg)=>{let x=hs.slice(),d=0;const X=[x],TH=[0];for(let i=0;i<N;i++){const m=[x[0]+0.5*Ls[i]*Math.cos(As[i]+d),x[1]+0.5*Ls[i]*Math.sin(As[i]+d)];
          const dn=d+((tg[0]-m[0])*F[1]-(tg[1]-m[1])*F[0])/((I[i]+I[i+1])/2)*Ls[i],dm=(d+dn)/2;x=[x[0]+Ls[i]*Math.cos(As[i]+dm),x[1]+Ls[i]*Math.sin(As[i]+dm)];d=dn;X.push(x);TH.push(d);}
          const o=rot(off,d);return{X,TH,eye:[x[0]+o[0],x[1]+o[1]]};};
        let F=[0,0];   /* each solve starts from the last's force */
        return phi=>{const tg=rot(eye,phi);let r=shoot(F,tg);
          for(let it=0;it<30;it++){const R=[r.eye[0]-tg[0],r.eye[1]-tg[1]];if(Math.hypot(...R)<1e-7)break;const h=1e-6*(1+Math.hypot(...F)),a=shoot([F[0]+h,F[1]],tg).eye,b=shoot([F[0],F[1]+h],tg).eye;
            const J=[[(a[0]-r.eye[0])/h,(b[0]-r.eye[0])/h],[(a[1]-r.eye[1])/h,(b[1]-r.eye[1])/h]],dj=J[0][0]*J[1][1]-J[0][1]*J[1][0];F=[F[0]-(J[1][1]*R[0]-J[0][1]*R[1])/dj,F[1]-(-J[1][0]*R[0]+J[0][0]*R[1])/dj];r=shoot(F,tg);}
          const at=(x,y,i)=>{const q=rot([x-C[i][0],y-C[i][1]],r.TH[i]);return[r.X[i][0]+q[0],r.X[i][1]+q[1]];};
          return(x,y)=>{const u=fr((aE-Math.atan2(y,x))/TAU)*360;if(Math.hypot(x-eye[0],y-eye[1])<1.9||u<u0)return at(x,y,N);if(u>=295)return[x,y];return at(x,y,Math.round((295-u)/(295-u0)*N));};};};   /* the eye's round end, the tail with its square end's face, the band */
      const eyeH=ring(eye[0],-eye[1],0.6,32),hsH=ring(hs[0],-hs[1],0.6,32),bent=(P,d)=>P.map(([x,z])=>{const q=d(x,-z);return[q[0],-q[1]];});
      /* the band's outer edge into the eye: the eye (r 1.8 about its hole on r 14.2) reaches r 16.0, the ring's outer edge r 16.125 (Ø 32.3 -0.1), and both sheets draw the
         edge running on into the eye's round with no step (05 06 01-1, 020605); 05 06 01-1's line comes in over the 60° before the eye (tools/wempe_maintspring.py: 0.17
         inside its own radius over 60-120° at 10°, 0.10 at 40°, 0.07 at 60°, the drawn ring wandering ±0.08 about its circle). So an arc tangent to the outer circle 60° from
         the eye and to the eye's round (r 15.88, its centre 0.25 off the axis; 0.09 inside the circle at 10°, 0.03 at 30°): until 27 October 2026 the band was cut square at the eye's centre line, its outer corner 0.125 proud of the eye (the drawings check, batch 6) */
      const U1=60,blendOf=R=>{const RB=R-((R-1.8)**2-14.2*14.2)/(2*(R-1.8)-2*14.2*Math.cos(U1*D2R));return{RB,QB:sh(R-RB,aE-U1*D2R)};};   /* the blend's radius and centre for a ring of outer radius R */
      for(const v of['last 6mx 1943','first']){const g=rv(gMS2,v);
        const band=(x,y)=>{const r=Math.hypot(x,y),a=angOf(x,-y),u=fr((aE-a)/TAU);   /* u: the way round from the eye, clockwise here */
          if(u>336/360)return 1;const w=(v==='first'?w41:w48)(u*360);return Math.max((16.125-w)-r,r-16.125);};
        /* the outline walked along its own lines and arcs (until 28 October 2026 a 0.02 contour of the distance to them, sdfOutline: its square end stepped ±0.009 and the
           build book listed hundreds of segments; the second drawing check, 3-M8): the outer circle r 16.125 from the square end to 60° from the eye, the blend r RB to its
           tangency with the eye's round, the eye's round r 1.8 about its hole to where the inner edge meets it, the inner edge (the width w48's arcs or 020605's table) back
           to the square end at 336°, its corners on their breakpoints, the end radial */
        /* the ring's outside: 05 06 01-1's Ø 32.3 -0.1 drawn 32.25; as first drawn 020605's boxed [32,3 -0,02] (32.28-32.30, checked at acceptance), drawn at its middle, 32.29
           (32.25 until 28 October 2026: the second drawing check, 3-M12a); the pins' holes on r 14.2 in both */
        const R0v=v==='first'?16.145:16.125,{RB,QB}=blendOf(R0v),wf=v==='first'?w41:w48,at=(u,r)=>sh(r,aE-u*D2R),in_=u=>at(u,R0v-wf(u)),eyeF=(x,y)=>Math.hypot(x-eye[0],y-eye[1])-1.8,L=[];   /* eyeF: tools/wempe_sustaining.js reads the eye's radius from it */
        for(let u=336;u>U1;u-=1)L.push(at(u,R0v));
        const tB=Math.atan2(eye[1]-QB[1],eye[0]-QB[0]),aB0=Math.atan2(at(U1,R0v)[1]-QB[1],at(U1,R0v)[0]-QB[0]);let dB=tB-aB0;while(dB>Math.PI)dB-=TAU;while(dB<-Math.PI)dB+=TAU;   /* the blend, from its tangency with the ring to the eye's (internal: QB, the eye's centre and the tangency in a line) */
        for(let i=0;i<=12;i++){const a=aB0+dB*i/12;L.push([QB[0]+RB*Math.cos(a),QB[1]+RB*Math.sin(a)]);}
        let ul=0,uh=40;for(let i=0;i<60;i++){const m=(ul+uh)/2;if(eyeF(...in_(m))<0)ul=m;else uh=m;}const ui=(ul+uh)/2,Pi=in_(ui);   /* where the inner edge leaves the eye's round (the shallow corner) */
        const eT=Math.atan2(L[L.length-1][1]-eye[1],L[L.length-1][0]-eye[0]),eP=Math.atan2(Pi[1]-eye[1],Pi[0]-eye[0]);
        let dA=eP-eT;while(dA<0)dA+=TAU;const mid=d=>{const a=eT+d/2;return[eye[0]+1.8*Math.cos(a),eye[1]+1.8*Math.sin(a)];};if(band(...mid(dA))<0)dA-=TAU;   /* round the eye's end, the way outside the band */
        const nE=Math.ceil(Math.abs(dA)/(3*D2R));for(let i=1;i<nE;i++){const a=eT+dA*i/nE;L.push([eye[0]+1.8*Math.cos(a),eye[1]+1.8*Math.sin(a)]);}
        const BK=v==='first'?[40,100,150,195,240,270]:[50.3,270,w48.UC];for(let u=ui;u<336;){L.push(in_(u));const nb=BK.filter(b=>b>u+1e-9).concat(336)[0];u=Math.min(u+1,nb);}L.push(in_(336));   /* the inner edge every 1° and at its breakpoints */
        const loc=L.map(([x,y])=>[x,-y]),sv=bend(wf,R0v);
        const geo=phi=>{const d=sv(phi),c=Math.cos(phi),sn=Math.sin(phi);   /* the eye's hole turned as the ratchet turns its pin (the same circle about the pin as bent with the band's end, its facets kept on the pin's) */
          return solidGeo([{loop:bent(loc,d),y0:GS1,y1:GS0,F:[{p:eyeH.map(([x,z])=>[x*c+z*sn,-x*sn+z*c]),a:GS1,b:GS0},{p:hsH,a:GS1,b:GS0}]}]);};
        msBent.push({m:tag(mesh(g,geo(WPHYS.runPhi(1)),M.blue310),'050601-1'),geo});}
      gEP=new THREE.Group();gMS2.add(gEP);gEP.rotation.y=WPHYS.runPhi(1);tag(cylBetween(gEP,0.6,GS1-1.2+0.02,GS0,M.steel,eye[0],-eye[1],16),'050600-8');   /* the eye's pin with the spring's drawn eye (turned as its hole is), in the ratchet's hole (Ø 1.2 H8: within 0.0035 of it as the spring is redrawn in steps) */tag(cylBetween(gMS2,0.6,GS0+1.2,GS1,M.steel,hs[0],-hs[1],16),'050600-8');}
    let msPhi=WPHYS.runPhi(1);   /* the ratchet's lead the spring is drawn at (by default the running drive's at 12 h) */

    /* =============== the maintaining detent 05 05 05 (Gegensperrkegel kompl.) at hole 4 =============== */
    /* The click 05 05 05-1 (Bandstahl 2,25 × 18, hardened in oil, light blue at 310°, round the hole 400°): 2 thick, its tip 1 -0.03 thick at its upper face; the boss Ø 5, the
       back r 18, the hollow underneath r 9 about a point 6.273 and 9.645 from the hole (tangent to the boss), the tip's lower corner on r 12 ±0.1 about the hole, its end 2.6
       tall at 80° (below), 14.2 overall; the hole
       2.25 H7 (1:70), staked on its arbor 6.3 ±0.1 from the arbor's lower shoulder to its upper face. The step to the thin tip runs obliquely from 8.6 from the hole at
       the back to the hollow (below), clear of the fusee wheel's tips, which the thin part reaches over. Its arbor 05 05 05-2 (no sheet): Ø 2.25 between its shoulders, 18.95 (19 less
       0.05 endshake; scaled 19.5 on 05 05 05), its pivots Ø 0.88 in the plates' drilled 0.9, 3.1 long (scaled): estimated. Its wire spring (Feder 05 05 06-1), at hole 5
       beside it, below */
    const pD=part('maintDetent',-33),gD=grp(pD,DX[0],DX[1]);   /* spread with the fusee, its wheel and maintaining work, whose ratchet's teeth its tip lies among (-25 with them at -21 and -25 until 28 October 2026: the Vorreiber pinned, above) */
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
    const gDc=new THREE.Group();gD.add(gDc);const DTN=DTX.flatMap((p,i)=>{const q=DTX[(i+1)%DTX.length],n=Math.ceil(Math.hypot(q[0]-p[0],q[1]-p[1])/0.01);return[...Array(n).keys()].map(k=>[p[0]+(q[0]-p[0])*k/n,p[1]+(q[1]-p[1])*k/n]);}).filter(([x,y])=>Math.hypot(x,y)>7);   /* the outline toward its tip, every 0.01 along its edges (its corners only until 27 October 2026, so a tooth's tip could reach between them), to seat it on the ratchet */
    {/* the step: a straight hidden edge on 05 05_12 (dashed), from the back where the "8,6" meets it (8.6 from the hole, 1.40 above it on the r 18) obliquely down to the
         hollow at the sheet's "150°": the angle between the step's construction line and the horizontal through the boss's underside, so the step runs at 30° to it
         (drawn 30.4-31.3°; the construction line meets the pivot's centre line 3.65-3.75 under the hole, where 30° from (8.6, 1.403) puts it 3.56), meeting the r 9 hollow
         at (4.859, -0.757): the thick part about 0.68 clear of the fusee wheel's tips (r 20.285) as the click rides on its ratchet. Until 16 October 2026 an arc about the
         hole at 7.55, the 8.6 taken as a radius, which put it over the tips; until 28 October 2026 the line ran at 34.7° to x 5.6 on the hollow (scaled ±0.3; the second
         drawing check, 3-M1) */
      const fw=[FX[0]-DX[0],-(FX[1]-DX[1])],tx=([x,y])=>{const X=-x,c=Math.cos(DTA),s=Math.sin(DTA);return[X*c-y*s,X*s+y*c];};
      const SA=[8.6,1.403],SD=[-Math.cos(30*D2R),-Math.sin(30*D2R)],Sq=[SA[0]-6.273,SA[1]+9.645],Sb=Sq[0]*SD[0]+Sq[1]*SD[1],St=-Sb-Math.sqrt(Sb*Sb-(Sq[0]**2+Sq[1]**2-81));   /* the 30° line from the 8,6 point to the r 9 hollow */
      const S1=tx(/** @type {[number,number]} */(SA)),S2=tx([SA[0]+St*SD[0],SA[1]+St*SD[1]]),side=p=>(S2[0]-S1[0])*(p[1]-S1[1])-(S2[1]-S1[1])*(p[0]-S1[0]),sg=Math.sign(side([0,0]));
      const thick=KIT.clipPoly(DTX,p=>sg*side(p)),thin=KIT.clipPoly(DTX,p=>-sg*side(p));
      pD.userData.step=Math.min(...thick.map(([x,y])=>Math.hypot(x-fw[0],y-fw[1])))-20.285;   /* the thick part's least clearance over the tips, at rest */
      /* one solid, drawn as one mesh: the thick part and the thin tip merged, so no seam is drawn across the upper face they share (Edges outlines each mesh); two meshes until 21 October 2026 */
      /* its hole Ø 2.25 H7 "Kegel 1:70" (05 05_12's section A-B): opening 1:70 on the diameter toward the arbor's lower shoulder (yD), the way the detent was knocked on from 7,5
         to 6,3 (05 05_11), Ø 2.25 at its small end (DTU) and 2.279 at DTL: the hole's wall turned to the cone (straight until 28 October 2026: the second drawing check, 3-M14) */
      const I4=new THREE.Matrix4(),tk=slab(thick,[{c:[0,0],r:1.125}],DTU,DTL),tp=tk.attributes.position,hA=new Set();for(let i=0;i<tp.count;i++)if(Math.abs(Math.hypot(tp.getX(i),tp.getZ(i))-1.125)<1e-5)hA.add(Math.round(Math.atan2(tp.getZ(i),tp.getX(i))*1e4));const hc=Math.cos(Math.PI/hA.size);   /* its flats on the cone (its corners 1/cos(π/n) out), so the arbor's turned seat, line to line, stays inside it as a pin in a bore() hole */
      for(let i=0;i<tp.count;i++){const x=tp.getX(i),z=tp.getZ(i),r=Math.hypot(x,z);if(Math.abs(r-1.125)<1e-5){const k=(1.125+(tp.getY(i)-DTU)/140)/hc/r;tp.setXYZ(i,x*k,tp.getY(i),z*k);}}tk.computeVertexNormals();
      tag(mesh(gDc,mergeGeo([[tk,I4],[slab(thin,[],DTU,DTT),I4]]),M.blue310),'050505-1');}
    /* the arbor (05 05_11 draws it, 5:1, at 17.2 px/mm by its body's 2.25): its shoulders chamfered about 0.25 × 45° (scaled 0.22-0.29 each way), its pivots' ends domed, the end
       by the lower shoulder (yD, the 6,3's) rising 0.35 and the other 0.25 over the pivot's 0.44 (scaled ±0.06: likely); its seat on the detent tapered 1:70 as the detent's hole
       (05 05_12's "Kegel 1:70"), line to line with it across the detent and on over the 1.2 it was knocked along (7,5 to 6,3), the body straight either side at the taper's end
       diameters, 2.233 and 2.279 (no sheet sizes the body: estimated). Square shoulders, flat ends and a straight Ø 2.25 until 28 October 2026 (the second drawing check, 3-M14, 3-M16) */
    {const dome=(y0,sg,h)=>{const R=(0.44*0.44+h*h)/(2*h),o=[];for(let i=0;i<=8;i++){const a=Math.asin(0.44/R)*(1-i/8);o.push([R*Math.sin(a),y0+sg*(R*Math.cos(a)-(R-h))]);}return o;},rT=y=>1.125+(y-DTU)/140,ya=DTU-1.2;
      tag(mesh(gD,turned([...dome(-21.825,-1,0.25).reverse(),[0.44,-18.975],[rT(ya)-0.25,-18.975],[rT(ya),-18.725],[rT(ya),ya],[rT(DTL),DTL],[rT(DTL),yD-0.25],[rT(DTL)-0.25,yD],[0.44,yD],...dome(yD+2.75,1,0.35)].map(([r,y])=>[r,y]),20),M.steel),'050505-2');}
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
      /* steel, as drawn; Wempe 3955's (the version as photographed) brass, head and all (2_Wempe_3955_A.jpg from above and 5_Wempe_3955_O.jpg from the side: brass coloured,
         slotted, beside the steel pivot in hole 4's sink; photocompare.py: likely), in its own group (a version that differs only in metal gets its own copy) */
      const hd=solidGeo([{loop:A,y0:TT-1.9,y1:TT},{loop:B,y0:TT-1.9,y1:TT},{loop:C,y0:hb,y1:TT}]),Rr=0.85-KIT.isoEs(0.35)-KIT.isoD(0.35),sk=KIT.lathThread([[0,TT-0.3],[Rr,TT-0.3],[Rr,WR-0.25],...[1,2,3,4,5].map(i=>{const a=i/6*Math.PI/2;return[Rr-0.25+0.25*Math.cos(a),WR-0.25+0.25*Math.sin(a)];}),[Rr-0.25,WR],[WRW,WR],[WRW,WR-WH],[0,WR-WH]],1,{rs:0.85,out:true},24);   /* the shank an M1.7 thread (ISO, KIT's lathThread: tapped hole 5 is threaded, 26 October 2026), its end rounded from the thread's root */
      for(const[V,mt]of/** @type {[string,any][]} */([['last first 6mx 1943 -3955',M.steel],['3955',M.brass]])){const g=rv(gWS,V);mesh(g,hd,mt);mesh(g,sk,mt).userData.thread={rs:0.85,p:KIT.isoP(0.85)};}}   /* the head (its two halves, the slot's floor between them) and the shank, from inside the head */
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
    const pSW=part('stopWork',-33),gSW=grp(pSW,fx,fz),gBar=new THREE.Group();gSW.add(gBar);gBar.add(new THREE.Group());gBar.rotation.y=barRot;   /* gBar.children[0]: the bar with its pin, which slides (a group, so holecheck.py sees the pin as another mesh in the bar's hole) */
    pSW.userData.mTip=mTip;
    {const clip=(P,c,k)=>{const o=[],f=q=>k*(q[0]-c);for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];if(f(a)<=0)o.push(a);if(f(a)*f(b)<0){const t=f(a)/(f(a)-f(b));o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}return o;};
      const pl=P=>P.map(([u,v])=>[u,-v]);   /* the shape's (u, v) as solidGeo's plan (x, z) */
      tag(mesh(gBar.children[0],capFix(bore(solidGeo([{loop:pl(clip(SBO,SB.ub,1)),y0:S,y1:S+1.45},{loop:pl(clip(SBO,SB.ub,-1)),y0:S,y1:S+SB.tt}]),[SB.sp,S+0.5,3.5],[0,0,1],0.25,0,16),null),M.steel),'050603-1');}   /* the bar's frame: x along it (u), the shape's y across (v); in the first child, which slides. Its pin's hole Ø 0.5 across it at u -6.0, at the pin's height (05 06_4's C-D draws it dashed across the bar in both positions; the pin pressed, line to line): left out until 28 October 2026, the pin in solid steel (the second drawing check, 3-M3) */
    /* its spring (Stegfeder 05 06 03-3; no sheet: the coloured section names it, 05 06_4's C-D draws it in both positions): a steel strip in the small end's recess against
       its wall, from its end at the slot's near wall round the bar's upper side and the recess to a free span whose end bears on the bar's pin near its lower end (below),
       pressing the bar out toward that end. Its two drawn shapes traced on C-D (12.2 px/mm, each point at the line's darkest pixel; the dashed, wound one searched along rays
       through its gaps), scaled 0.989 as the bar, mirrored into the bar's frame: running it leaves the wall 152° round from the bar's upper end, wound (the bar slid 3.6) at 95°, looping
       in to 3.15 from the axis, 0.1 off the arbor's step. Drawn between the two as the bar slides (the drawn shapes' lengths differ by 4 %, 32.1 and 30.8: the drawing's
       precision). Its section isn't drawn (the coloured section leaves the recess between the bar's end and its wall, its full 1.6, uncoloured, where it colours steel blue): 1.0 high, a design value (anything from 0.9, its pin's Ø 0.5 hole through it, to 1.5, under the recess's 1.6, works: its push is linear in the height, its stress isn't; wempe_strength.js, and the bench's stop work test), on the cover plate as the bar, and 0.10 thick, worked from its two drawn shapes:
       between them its curvature changes by up to 0.064-0.073 /mm along its free span (its end pinned in the bar, unbent), so a strip t thick of hardened spring steel
       (206 GPa) is stressed 6,500-7,500 t MPa (t in mm) wound and pushes the bar out with 0.06-0.08 N half way, 0.11-0.16 N wound (its strain energy over the 3.6):
       at 0.10, half its steel's yield once a wind, and 20-30 times the bar's 0.5 g against a knock along it (C-D's double line, 0.15, would be stressed 0.7 of yield) */
    const SPW=7.5-0.051,SPU=[[-3,-5.555],[-2.5,-5.632],[-2,-5.875],[-1.5,-6.202],[-1,-6.528],[-0.5,-6.705],[0,-6.868],[0.5,-7.018],[1,-7.03],[1.5,-7.03],[2,-7.03],[2.5,-6.942],[3,-6.78]],
      SPD=[[-3,-2.113],[-2.5,-2.188],[-2,-2.438],[-1.5,-3.0],[-1,-3.5],[-0.5,-3.912],[0,-4.238],[0.5,-4.405],[1.5,-4.72],[2,-4.807],[2.5,-4.808],[3.5,-4.57],[4.335,-4.489],[5.059,-3.953],[5.742,-3.315],[6.398,-2.585],[6.899,-1.72]];   /* C-D's (x right, y up from the axis; the bar on the left, its upper end up), mm. The running shape's traced end, [-3.5, -5.638], left out (27 October 2026): it stood 0.21 past the pin's end and the strip turned 125° back from it onto the pin in 0.24, a fold the 0.10 ribbon crumpled in (the drawings check, batch 6: shaded inside out); the end now comes straight off the pin as the wound shape's does */
    const toBar=P=>P.map(([x,y])=>{let u=0.989*y,v=0.989*x;const r=Math.hypot(u,v);if(r>SPW){u*=SPW/r;v*=SPW/r;}return[u,v];});   /* nowhere outside the wall: its outer face 0.001 inside the recess's r 7.5, past the wall's 216 facets (their chords 0.0008 inside the circle; 0 until 27 October 2026, its corners then 0.0008 through them, fine.py) */
    const SPA0=152.1*D2R,SPA1=95*D2R,SPE=-Math.asin(3.9/SPW);   /* where each leaves the wall (from the bar's upper end); the fixed end, 0.1 short of the slot */
    const spFree=(P,h,a)=>{const Q=[h,...toBar(P),[SPW*Math.cos(a),SPW*Math.sin(a)]],L=[0];for(let i=1;i<Q.length;i++)L.push(L[i-1]+Math.hypot(Q[i][0]-Q[i-1][0],Q[i][1]-Q[i-1][1]));
      return x=>{const t=x*L[L.length-1];let i=1;while(i<L.length-1&&L[i]<t)i++;const f=(t-L[i-1])/(L[i]-L[i-1]||1);return[Q[i-1][0]+(Q[i][0]-Q[i-1][0])*f,Q[i-1][1]+(Q[i][1]-Q[i-1][1])*f];};};
    const SPE0=[SB.sp+0.31,-3.25],SF0=spFree(SPU,SPE0,SPA0),SF1=spFree(SPD,[SPE0[0]+SB.tr,SPE0[1]],SPA1);   /* its end on the pin's side toward the bar's upper end, where the pin stands out of the bar */
    const spPath=t=>{const f=t/SB.tr,o=[];   /* its end bears on the bar's pin (below), leaving it toward the arbor in both shapes */
      for(let k=0;k<=40;k++){const a=SF0(k/40),b=SF1(k/40);o.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);}
      const aD=SPA0+(SPA1-SPA0)*f,n=Math.ceil((aD-SPE)/(3*D2R));o[o.length-1]=[SPW*Math.cos(aD),SPW*Math.sin(aD)];
      for(let k=1;k<=n;k++){const a=aD+(SPE-aD)*k/n;o.push([SPW*Math.cos(a),SPW*Math.sin(a)]);}   /* along the wall to its fixed end */
      return o.map(([u,v])=>new THREE.Vector3(u,S+0.5,-v));};
    /* its hole for its pin 05 06 04-4 (C-D draws the pin through the spring's line where the spring lies on the wall, so the spring is held on it: a hole through the ribbon
       seen edge on, which that view can't draw): Ø 0.54 for the pin's 0.5 (no sheet, estimated: the pin, along the slot, crosses the strip
       obliquely, so the hole's width across it is about 0.51, the click springs' +0.02 on their pins' 0.6), where the ribbon's middle crosses the pin's axis (v -1.5, on the wall, 11.6° under the slot's line): left out until 28 October 2026, the pin through the ribbon (the second drawing check, 3-M4) */
    const spGeo=t=>{const P=spPath(t);let s=0,h=null;for(let i=1;i<P.length&&h===null;i++){const a=P[i-1],b=P[i],l=a.distanceTo(b);if(a.x>0&&b.x>0&&(a.z-1.5)*(b.z-1.5)<=0&&a.z!==b.z)h=s+l*(1.5-a.z)/(b.z-a.z);s+=l;}
      return ribbonHoleGeo(P,0.10,1.0,h===null?[]:[{s:h,r:0.27}]);};
    let spT=0;const spM=tag(mesh(gBar,spGeo(0),M.blued),'050603-3');
    /* the bar's pin (Stift 05 06 03-2: the coloured section's label; 05 06_4's C-D draws it in both positions, the spring's line ending on it, at 12.2 px/mm): Ø 0.5 (6 px)
       pressed across the bar's 2 at u -6.0 in its hole (dashed inside the bar), standing 0.9 (11 px) out of its near side, toward the arbor, where the spring's end bears on it;
       at the spring's mid-height (likely, ±0.1). Built 17 October 2026: until then the spring's end went 1 into the hole */
    {const g=new THREE.CylinderGeometry(0.25,0.25,2.9,12);g.translate(0,-(6-1.45),0);g.rotateX(-Math.PI/2);tag(mesh(gBar.children[0],g,M.steel,SB.sp,S+0.5,0),'050603-2');}
    /* the spring's pin (Stift 05 06 04-4: the coloured section's label, its leader to this pin, and 05 06 04's parts list, piece 5, a 0.5 pin: likely; numbered 05 06 03-2 until
       17 October 2026; the hole "0,5 H7" in 05 06 04-2, not cut in it): along the slot, 1.5 from the line through the axis on the bar's side (02-2's "15"),
       from the recess, where it stands in to 6.4 from the axis through the spring (C-D), out through the end, which is uncut there (past N), its end's outer corner 0.02 inside
       the hub's Ø 21 (flush with it until 17 October 2026, its middle, when the groove's last land lay under it, so the corner stood through); at the spring's mid-height (estimated).
       Pressed in the hole as 05 06 04 gives it (03-2, item 5: "0,5 ⌀ +0,022/+0,015" in 02-2's 0,5 H7 +0,009: 0.006-0.022 tight): drawn Ø 0.5185, its middle, on 24 sides, in the
       hole's Ø 0.5045 (its H7's middle, 20 sides): 0.0017-0.0068 tight on the radius (Ø 0.500, 0.0023 clear, until 28 October 2026: drawing check 2, 5-M4) */
    {const rp=0.5185/2;let uo=9;for(let i=0;i<4;i++){const R=rBody(barRot+Math.atan2(-1.5-rp,uo),LB-0.5);uo=Math.sqrt((R-0.02)**2-(1.5+rp)**2);}const ui=Math.sqrt(6.4*6.4-2.25),g=new THREE.CylinderGeometry(rp,rp,uo-ui,24);
      tag(mesh(gBar,g,M.steel,(ui+uo)/2,S+0.5,1.5),'050604-4').rotation.z=Math.PI/2;}   /* placed and turned as a mesh, not in its geometry, so audit.py probes its own ends (25 October 2026: its geometry moved put its probes on the fusee's axis, in the arbor's cross hole) */
    /* the bar's slide: its spring holds it out until the connector on the top turn, or coming down onto it, reaches its lower end; it then slides as far as keeps that end clear
       of the connector's inner side by 0.02 (the chain's plates 1.0 from its pitch line, 0.80 across; the band 0.11, 0.78 high), never past its 3.6. The connector's path (pitch line)
       from the update: on the fusee to its leaving point (index kf), then the run to the barrel */
    const LOW=[[SB.lf,-SBF],[-6.5,-SBF],[-6.5,-SBN],...SBO.filter(([u])=>u<-11)];   /* the lower end's outline in the bar's frame (the far side, across at u -6.5, the near side, the point's round; the oblique edge closes it) */
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
    /* pressed (05 08 01: "Anschlagstift", its hole reamed 1,6 +0,009): Ø 1.615, 0.01 over the hole's middle (estimated; Ø 1.6, 0.0045 loose, until 28 October 2026, drawing
       check 2's 9-M7). The stop's place (SPu, above) keeps the bar 0.02 off a Ø 1.6 pin, 0.0125 off this one */
    {const rP=1.615/2,PE=TI+1.6,PH=0.25,R=(rP*rP+PH*PH)/(2*PH),C=PE+PH-R,a0=Math.asin(rP/R),cap=[];for(let i=0;i<=8;i++){const a=a0*(1-i/8);cap.push([R*Math.sin(a),C+R*Math.cos(a)]);}
      tag(mesh(P.topPlate,turned([[0,TT],[rP,TT],...cap],20),M.steel,SPX[0],0,SPX[1]),'050801-5').userData.devKeep=true;}   /* devKeep: shown laid out, where the fusee and its stop bar stay */


    /* =============== the barrel 05 07 01 (Federhaus mit Deckel, as revised 20.4.48) =============== */
    /* The drum 05 07 01-1 (Federhaustrommel, Ms; drawn from a deep-drawn cup, R 05 07 01-1): Ø 41.6 -0.1 (drawn 41.6), 38.5 +0.1 inside, 18.1 -0.15 (drawn 18.08: its arbor's
       core sets it), the bottom 1.25 -0.1 with its boss: the land Ø 12, a 45° cone to the face Ø 8, 3.1 -0.1 from the outside, the bore 4.5 +0.1 (drawn 4.55); the lid's seat
       Ø 39.2 s6, 1.2 deep; the bottom's outer edge broken. Its bottom on the pillar plate's side, the lid toward the barrel bridge (05 07 01 draws the arbor's square through the
       lid; so does the coloured section). The mainspring's hook block 05 07 01-3 (3.05 -0.1 high, 3 wide) riveted inside the wall at the M2.6 hole 9.05 ±0.05 from the
       bottom's face, 45° from 9 o'clock; its radial depth 0.35 (estimated: as much as clears the spring's next coil). The sheets make it 0.5 deep (05 07 01 gives the wall at
       the hook 2.05 -0.1 against the drum's 1.55, 020701 2 against 1.5: sure) and about 6.5 long round the bore (05 07 01's section, the block seen on the far wall, its ends
       arcs: 7.3 there, 6.3 and 5.9 on the other sheets: likely, ±1; the "3" on 020701 its height); drawn so, it stands 1.2-4.3 mm³ into the solved spring's outer coil at
       full wind (fine.py, 18 October 2026), whose solve (tools/mainspring.py's wall) has no block: left for that spring's re-solve (PLAN-wempe-estimates.md, A.9). The slot for the chain's hook, cut at the fusee's assembly
       (0207: 2.5 wide, 45° to the radius), is cut once the connector is laid (DRUM, below). Gilt, as Wempe 3955's (7_Wempe_3955_W.jpg).
       The slot at 9 o'clock (05 07 01-1, revision a of 11.3.48): 2 +0.05 wide (drawn 2.025), its sides drawn on the plan across the whole wall from outside (to scale there:
       6.875 px/mm, the rim r 20.80, the seat 19.64, the bore 19.20), its end r 18.3: "0,95 +0,15" in from the bore (drawn 1.025 from the bore's 19.275), the "18,3 +0,02" the
       revision struck. 18.3 is the lid's 9 o'clock notch's bottom (05 07 01-2: 18.3 ±0.02, as wide), and 05 07 01 draws the two as one at 9 o'clock with the lid in: the slot
       across the joint, the drum's wall cut through to the lid's notch (for prising the sprung-in lid out, likely). How far down the wall it runs isn't drawn: to the lid's
       underside, through the lid's 1.3 as its notch goes (estimated). Read from the lid's side (the plan, first-angle, below the section) the M2.6 hole stands 45° clockwise of
       it, so the slot is 45° back from the hook block (rotation.y falling) */
    const pB=part('barrel',-33),gB=grp(pB,BX[0],BX[1]),gBL=rv(gB,'last 1943'),gBF=rv(gB,'first 6mx');
    /* BLK: the hook block's rivet hole's angle in the drum, set by the chain's slot (DRUM, below: -19.57°, where the laid chain's barb comes to the drum, which stands at 0
       fully wound) as 0207 draws them round the drum (127-556.04 U24, 15.4.41, its plan "Federhausdeckel abgenommen" at 12.27 px/mm by the drum's two circles fitted, rms
       0.24 px): the Steg's notch on the 12 o'clock centre line, the M2.6 hole "45°" from it, and the "Schlitz für Kette" on the same line at 6 o'clock (its walls 176.5° and
       184.8° from 12 at the bore, 174.3° and 181.3° at the rim: 180° ±2); the section, cut along that line, draws the Steg (106) under the wall at the top and the slot
       through the wall at the bottom. The "45°" by the slot is its lean through the wall (the dimension's arc is centred on the slot's wall at the rim, not on the drum's
       centre), not its place. So the slot is 180° from the Steg and 135° from the rivet hole: the slot + 225° (5π/4) here, the Steg 45° back from the hole (LS, as 05 07 01-1
       has it and the strip's end needs, the drum running rotation.y falling). The slot's place is the chain's (cut at the fusee's assembly), so the drum's insides turn to it:
       0207's is the drum of 1941, and the later sheets don't draw the slot; the lid's 3 o'clock notch (05 07 01-2), opposite the Steg, then lies at the slot's angle (sure on
       0207, likely for the drum of 1948). 1.2 until 25 October 2026 (an estimate: the slot then 88° from the hole). The mainspring, the arbor's hook (HKA) and the Steg follow
       it rigidly: the solve holds the strip's end and the Steg relative to each other (tools/wempe_mainspring.py's BLOCK, STEG), so nothing is re-solved; DRUM checks it */
    const BLK=3.585;
    /* The Steg 05 07 00-1 (the coloured section's #6, "Steg", a thin steel strip standing inside the drum's wall; 0207's part 106, 127-556.04-097): a bar across the drum
       from its bottom to its lid, 45° back from the rivet hole (rotation.y falling), its tabs through the bottom's slot and the lid's 9 o'clock notch. 0207's plan (lid off,
       12.0 px/mm) draws its section 2 wide and "0,5" thick, "0,4" off the bore (r 18.35-18.85), its section through 12 o'clock the strip from the lid's outer face to the
       bottom's, through both; 05 07 01-1 (revision a, 11.3.48) the bottom's slot 2 +0.05 wide, "0,95 +0,15" from the bore to its inner end (r 18.3, the struck 18.3 +0.02)
       and, since revision b (20.4.48), "0,8 +0,05" across (r 18.3-19.1: the section draws it through the bottom just inside the bore, the plan its outline there); the lid's
       notch 2 +0.05 wide to 18.3 ±0.02 from the centre (05 07 01-2), the Steg's inner face bearing on its bottom; the coloured section puts it at r 18.20-18.73 (9.37 px/mm).
       Built 2 × 0.5, r 18.3-18.8 (as first drawn 18.35-18.85, in slots 2.025 × 0.55 through the 1941 lid and bottom: estimated, 0207 draws them closed round it), its ends
       flush with the bottom's and the lid's outer faces (0207's section: likely). Steel. The mainspring's outer coil is threaded between it and the wall, so the strip's
       last 45° lies on the wall to the hook block (tools/wempe_mainspring.py's STEG). Until 18 October 2026 it wasn't built, and the 9 o'clock slot (read as one through
       the wall from the rim, for prising the lid out) was cut through the drum's wall */
    const LS=BLK-Math.PI/4,SG0=18.3,SG1=18.8,SGW=1.0,rect=(a,r0,r1,w)=>{const u=[Math.cos(a),-Math.sin(a)],v=[Math.sin(a),Math.cos(a)];return[[r0,w/2],[r1,w/2],[r1,-w/2],[r0,-w/2]].map(([r,t])=>[u[0]*r+v[0]*t,u[1]*r+v[1]*t]);},
      slot=(a,r0,w)=>rect(a,r0,23,w);   /* a slot's outline in plan along the angle a, from r0 to r1 (slot: out past the drum) */
    /* the hook block's rivet hole M2.6 through the wall (05 07 01-1; drawn at its thread's size and 0.02, Ø 2.64, as the frame's tapped holes), bored into the lathe (25 October
       2026: until then not cut, the rivet in the metal); the slot for the chain's (or the band's) hook, below, cut once the connector is laid (slotCut) */
    const YRV=BB-9.05,YRV41=(-3.7-1.2-21.7+1.0)/2,RVD=[Math.cos(BLK),0,-Math.sin(BLK)];   /* YRV41: as first drawn (below) */
    const dL=tag(mesh(gBL,bore(facePocket(ringT([[19.6,BR],[20.8,BR],[20.8,BB-0.2],[20.6,BB],[2.275,BB],[2.275,BBF],[4.0,BBF],[6.0,BI],[19.25,BI],[19.25,BLU],[19.695,BLU]],240),'top',rect(LS,18.3,19.1,2.025),1.6),[0,YRV,0],RVD,1.32,18.6),M.gilt),'050701-1');
    /* the lid 05 07 01-2 (Federhausdeckel, Ms 58, revised 20.4.48): sprung into the seat ("eingesprengt"), its face flush with the rim (05 07 01's section, the lid's face on the rim's line at
       both walls, its "0,6 -0,1" the arbor's shoulder over it; until 26 October 2026 read as 0.6 under the rim); 1.3 -0.1 thick, drawn 1.2, its edge one 5° face from Ø 39.2 at its face
       to Ø 39.39 at its underside (05 07 01-2), sprung into the drum's seat cut to match, 1.2 deep: 05 07 01-1's (1,2), bracketed by its revision a (11.3.48: "Maß 1,2 -0,1 in
       Klammern") as the chain 18,1 - 13,8 - 3,1 then fixes it (18.08 - 13.78 - 3.1: the 13,8 -0,05 from the seat's floor to the boss's face holds only on a 1.2 seat), and the
       lid's 1,3 -0,1 at its least, so its face lies on the rim as 05 07 01 draws it (27 October 2026; 1.3 deep and the lid 1.3 from 26 October, the seat 0.1 under the 13,8's
       limit; until then a stepped edge, Ø 38.4 under a 1.2 seat); its boss 3.3 -0.1 from its face, the face Ø 8, a 45° cone to Ø 12; bore 4.55; its two
       notches through it: at 9 o'clock, on the drum's slot, 2 +0.05 wide to 18.3 ±0.02 from the centre (drawn 2.025, 18.3), and opposite, at 3 o'clock, 2.7 +0.1 wide, 2 +0.2 deep
       from its 39.39 (drawn 2.75 wide to r 19.695 - 2.1); the 9 o'clock notch is the Steg's seat (above), the 3 o'clock notch's use isn't drawn (for prising the lid out:
       likely) (sure on both, unrevised since 7.4.41) */
    tag(mesh(gBL,capFix(facePocket(facePocket(ringT([[2.275,BLT],[19.6,BLT],[19.695,BLU],[6.0,BLU],[4.0,BLF],[2.275,BLF]],240),'bottom',slot(LS,18.3,2.025),BLU-BLT+0.1),
      'bottom',slot(LS+Math.PI,19.695-2.1,2.75),BLU-BLT+0.1),null),M.gilt),'050701-2');
    /* As first drawn, the barrel of 1941 (0207 Federhaus, 127-556.04 U24, 15.4.41, 5:1, scaled 12.0 px/mm by its 22.3; the drum 020701, U22; its ring 020701-3), in three pieces:
       the ring (Federhausring, Messingrohr 42 × 2, Ms 58) Ø 41.5 outside, 38.5 inside (0207: sure), 18 long (sure), the bottom (Boden) on the pillar plate's side and the lid
       (Deckel) on the bridge's: 020701's note (struck through) heats the ring "vor dem einsprengen des Bodens", and 0207 writes "warm einsprengen" at the plate's side; 020701's
       bottom is its thicker disc, 1.2 with its boss 3.1 from outside, as 0207's plate-side disc, its lid 1.1 with its boss 3 (0207's bridge-side 1.0 and 2.9); 0207's plan
       "Federhausdeckel abgenommen", drawn left of the section (first-angle: seen from the right, the bridge's side), registers on the model mirrored, seen from the bridge's
       side, the arbor's square end-on in it (likely, three readings agreeing; until 28 October 2026 named the other way round, the lid on the plate's side: drawing check 2,
       4-M1). Its plate-side face 3.7 off the plate and the bridge-side face 0.6 under the bridge (22.3 between them, sure; 3.7 scaled 3.75), each disc sprung into a seat at
       its end of the ring (below); the bottom 1.2 and the lid 1.0 thick (0207: sure; 020701's lid 1.1 and inside 15.7 ±0.05, a later issue), 15.8 between them (framed, sure);
       each with a boss standing 1.9 inward, its face 3.1 from the bottom's outside and 2.9 from the lid's (sure), Ø 9 with a 22½° cone out to Ø 12
       (020701: likely), bored 4.55 as the later drum's (020701's 4.5; 0207 draws the journals Ø 5). The ring's seats 0.35 wide, the joints drawn as faces. The hook block and
       the slots are the later drum's. The Soviet 6MX (the Variants' third version) has it too: its barrel cap is underneath, on the pillar plate's side (Altmeppen's
       list; Knirim's against Lange's Kal. 100), as this drum of the drawings' has it; Kirov No. 247's side views (4_, 6_Kirow_247_N, S) show a drum about Ø 41.5 × 18
       under the chain, too fine to tell this ring from the later drum turned over: likely */
    const S41=[18.35,18.85];   /* the Steg as first drawn (0207) */
    /* the ring's seats: 020701-3 (the ring's own sheet, 2:1, 7.4.41) cuts one, at one end: Ø 39.2 +0.1 (framed), 1.5 deep, its wall undercut 5° (framed), the ring then 19 long
       (Rohmaß 42 × 2 × 20); 020701 (the barrel, 2:1) faces it to 18 and cuts the other at assembly, its wall at 3° (the lid's end: its "3°" on the wall's extension line,
       leaning in toward the mouth); 0207 draws its "5°" at the plate side's corner, both discs flush with the ring's ends and the plate-side disc 1.2 deep in its seat. So the
       bottom's seat at the plate's end, sprung in warm, 1.2 deep as finished (020701-3's 1.5 less 0.3 faced off with the ring's 19 to 18: its mouth Ø 39.25, its floor Ø
       39.46 at 5°); the lid's at the bridge's end, 1.0 deep (0207's lid), its mouth Ø 39.2, its floor Ø 39.30 at 3°. Each disc's edge turned to its seat's cone (sprung in,
       as the drum of 1948 takes its lid). Until 28 October 2026 plain seats Ø 39.2 at both ends (drawing check 2, 4-M11) */
    /* the oil sinks round the discs' bores on their outer faces (0207's section, 5:1 at 12.2 px/mm): the bottom's dimensioned Ø 8 at the face ("8ρ"), its cone "10°" off the
       face (the figure: scaled the cone reads nearer 20°, 0.5 deep, the drawing loose), so 0.30 deep to the bore; the lid's drawn the same way, undimensioned: Ø 7.4 scaled
       against the bottom's drawn Ø 8 (555 px against 600 at 6×; estimated), at the same 10°, 0.25 deep. 020701 draws the bores straight (not shown at its 2:1). Until 28
       October 2026 not cut (drawing check 2, 4-M2) */
    const SKB=4.0,SKL=3.7,SKA=Math.tan(10*D2R);
    const RP0=19.6+0.3*Math.tan(5*D2R),RP1=19.6+1.5*Math.tan(5*D2R),RB0=19.6,RB1=19.6+1.0*Math.tan(3*D2R);
    {const R1=20.75,Ri=19.25,yL=-3.7,yB=-21.7,yLi=yL-1.2,yBi=yB+1.0,bo=2.275,sl=slot(LS,S41[0],2.025);
      var dF=tag(mesh(gBF,bore(ringT([[RB1,yBi],[RB0,yB],[R1,yB],[R1,yL],[RP0,yL],[RP1,yLi],[Ri,yLi],[Ri,yBi]],240),[0,YRV41,0],RVD,1.32,18.6),M.gilt),'050701-1');   /* the ring, its seats at both ends, the rivet's hole through it (above) */
      tag(mesh(gBF,capFix(facePocket(ringT([[SKB,yL],[bo,yL-(SKB-bo)*SKA],[bo,yL-3.1],[4.5,yL-3.1],[6.0,yL-3.1+0.62],[6.0,yLi],[RP1,yLi],[RP0,yL]],240),'top',sl,1.5),null),M.gilt),'050701-1',1);   /* the bottom (Boden) on the plate's side, its boss inward: with the ring, the drum 05 07 01-1's counterpart */
      /* the lid's prising notch: 020701's plan (6.94 px/mm by the ring's Ø 41.5) draws a half-round notch in the lid's edge at 3 o'clock, 2.5 wide and 1.9 deep (scaled; 05 07
         01-2 of 7.4.41 has its 2.7 +0.1 × 2 +0.2 at 3 o'clock, square), 135° from the "vernieten" hook block: turned onto 0207's plan (both seen from the bridge's side, by
         rotation alone) it stands opposite 0207's Steg at 12 o'clock, on the "Schlitz für Kette" line, as 05 07 01-2's 3 o'clock notch stands opposite its Steg's (likely: were
         020701's plan mirrored it would stand 90° from the Steg). Cut so: its round end r 1.25, 1.9 in from the lid's edge at its face. The Steg's slots in both discs open to
         their rims, 2.025 wide to r 18.35, as 05 07 01-2 (7.4.41) draws the lid's 9 o'clock notch (until 28 October 2026 closed slots 2.025 × 0.55, estimated: drawing check 2,
         4-M3); the ring's seat closes them outside */
      const uN=(a,rc,w)=>{const u=[Math.cos(a),-Math.sin(a)],v=[Math.sin(a),Math.cos(a)],P=[[rc,w/2],[23,w/2],[23,-w/2],[rc,-w/2]];for(let i=1;i<12;i++){const t=-Math.PI/2+Math.PI*i/12;P.push([rc-w/2*Math.cos(t),w/2*Math.sin(t)]);}return P.map(([r,t])=>[u[0]*r+v[0]*t,u[1]*r+v[1]*t]);};
      tag(mesh(gBF,capFix(facePocket(facePocket(ringT([[SKL,yB],[RB0,yB],[RB1,yBi],[6.0,yBi],[6.0,yB+2.9-0.62],[4.5,yB+2.9],[bo,yB+2.9],[bo,yB+(SKL-bo)*SKA]],240),'bottom',sl,1.3),'bottom',uN(LS+Math.PI,RB0-1.9+1.25,2.5),1.3),null),M.gilt),'050701-2');   /* the lid (Deckel) on the bridge's side */
      const sg=new THREE.BoxGeometry(S41[1]-S41[0],yL-yB,2*SGW);sg.translate((S41[0]+S41[1])/2,(yL+yB)/2,0);sg.rotateY(LS);tag(mesh(gBF,sg,M.steel),'050700-1');}
    {const sg=new THREE.BoxGeometry(SG1-SG0,BB-BLT,2*SGW);sg.translate((SG0+SG1)/2,(BB+BLT)/2,0);sg.rotateY(LS);tag(mesh(gBL,sg,M.steel),'050700-1');}   /* the Steg as last revised, bottom to lid */
    /* the hook block 05 07 01-3: 0.5 deep off the bore (above), 6 long round it (0207's flat "6", dimensioned: the later sheets scale it 5-7), 3.05 high at the rivet hole's
       9.05 from the bottom's face, its face an arc concentric with the bore; the rivet hole (M2.6 on 05 07 01-1, "vernieten" on 05 07 01) 1.4 from its far end (0207's plan:
       the hole's sides 3.3-5.9 along the flat from its end toward the Steg: likely ±0.5), so it runs 4.6 back toward the Steg. Until 18 October 2026 0.35 × 3 centred on the
       hole, as much as cleared the spring drawn without it; the spring is now solved and drawn over it (tools/wempe_mainspring.py's BLOCK, msGeo below). The rivet through
       the wall and the block, its head flush with the drum's outside (estimated) */
    /* As first drawn the block's middle at the middle of the 15.8 between the 1941 discs (0207's "7,9" either side of it, under the section; 020701's "7,9", revised from
       9,7, from the bottom's inside to it), y -12.80: until 28 October 2026 at the 1948 drum's 9.05, 0.10 toward the plate (drawing check 2, 4-M9).
       Its fixing (0207 and 05 07 01-1 write "M2,6" at the wall's hole; 020701 "Ø 2,6, vernieten", 05 07 01 "vernieten"): as last revised an M2.6 thread (05 07 01-1's,
       the drum's own sheet), its shank threaded from the drum's outside, 0.05 under it, to the block's face, the wall's and the block's holes drawn at the thread's size and
       0.02 (Ø 2.64: a radial hole in a turned wall is bored plain, bore()); as first drawn a rivet Ø 2.6 (020701), flush both ends (riveted over: the heads' form isn't
       drawn). Until 28 October 2026 a plain pin in both (drawing check 2, 4-M14) */
    const HB0=4.6,HB1=1.4,BLD=0.5;
    for(const[g,yb]of/** @type {[any,number][]} */([[gBL,BB-9.05],[gBF,YRV41]])){const a0=BLK-HB0/19.25,a1=BLK+HB1/19.25,ar=[];for(let i=0;i<=12;i++){const a=a0+(a1-a0)*i/12;ar.push([Math.cos(a),Math.sin(a)]);}
      tag(mesh(g,capFix(bore(slab([...ar.map(([c,s])=>[19.25*c,19.25*s]),...ar.reverse().map(([c,s])=>[(19.25-BLD)*c,(19.25-BLD)*s])],[],yb-1.525,yb+1.525),[0,yb,0],RVD,1.32,17),null),M.steel),'050701-3');   /* in each state's drum (fixed to it); the rivet's hole through it as through the wall (25 October 2026) */
      const rg=g===gBL?KIT.threadGeo(1.3,0,20.75-(19.25-BLD)).clone():new THREE.CylinderGeometry(1.3,1.3,20.75-(19.25-BLD),20);   /* the M2.6 shank along +y from the drum's outside (its tip at the block's face), or the rivet */
      if(g===gBL){rg.rotateZ(Math.PI/2);rg.translate(20.75,yb,0);}else{rg.rotateZ(Math.PI/2);rg.translate((20.75+19.25-BLD)/2,yb,0);}rg.rotateY(BLK);tag(mesh(g,rg,M.steel),'050701-3',1);}
    /* the arbor 05 07 02 (Federkern kompl.): its pivot in the pillar plate (the 1941 arbor 020704-1's Ø 3, drawn 2.88 in the plate's 2.90 reamed: the arbor as last revised,
       05 07 02-1, isn't in the set), its end a ball, polished, 5 from the shoulder; the journals the drum's bosses run on (4.48 in their 4.55: 020704-1's 5 don't pass them),
       22.2 +0.1 between their outer shoulders (framed); the core Ø 13.3 between them, its ends Ø 10 chamfered 45° 1.65 (05 07 01: faces about Ø 10, the cylinder 8.7; 05 07 02 Ø 10.1;
       Ø 9 and 2.15 until 26 October 2026, the 1941 core's) to 0.05 off the bosses (11.58 long: the 1941 core's 12 can't pass the 1948 drum's 11.68 between its bosses); the pivot in the barrel bridge (drawn 3.88 in its 3.9 ±0.01; 2.93 long, BSQ below), then the square 2.7 ±0.02 (1:100), 10 long, for the set-up
       ratchet. The hook (Federhaken 05 07 02-2): a pin Ø 2 in the core's hole with a head over the core: 05 07 02's end view (unwrapped about the core's circle
       fitted at 9.88 px/mm, 0.23 px median: tools/wempe_bandhooks.py endview) draws the head standing on the core from a radial face at 15.5° from
       the vertical centre line (the pin's, which the side view draws on it; the figure "15°" between that radius and a line 15° on) to flush 4-5° past the centre line on the
       other side, its top falling evenly from the face (0,5 -0,05, drawn 0.475; the face's top scaled 0.6-0.75, the drawing not to scale) to the core: 20° of the core, 2.3
       wide, wider than the Ø 2 pin (17°) as the 1941 hook's head was (0207: a block 3 wide over its Ø 2 pin), 2 along the axis as the side view draws it (2.09). The face 15°
       and the land to 5° past (scaled, ±2°); the head's own sheet (05 07 02-2) isn't in the set: likely. Until 27 October 2026 the pin's own end ramped across its width (the
       face its flat side, 8.6° off the line, 0.545 over the core there and 0.08 at the back). The pin's hole: 05 07 02 dashes it through the core to the far side (no drill
       point), the 1941 arbor's 6 deep with its point (0207); both drawn 6 deep, the pin to its foot (bore() leaves a hole through a turned core's axis open: README,
       Unresolved, the tools' limits). The face takes the mainspring's eye, so it is put on the side
       the spring pulls (its coil runs on from its inner end the way rotation.y rises: the barrel's run, README): seen from the ball end, as the view reads that way (from the
       square's end the face would stand on the other side, and the spring would pull against the photographed set-up click: likely). Until 15 October 2026 a flat-topped pin
       0.5 proud. Präz. Rundstahl 14, hardened, tempered at 270 */
    /* BSQ: where the 1943 arbor's square starts. 05 07 02 gives it 40,2 over all (its general tolerance ±0.1: "nicht eingetr. Toleranz ± 0,1"), with the ball's 5 and the
       square's 10 (its point included): 25.2 between the ball's shoulder and the square, so with the shoulders 22.29 apart (22,2 +0,1) the bridge pivot 2.93 (the sheet
       scales 3.3 and 21.96: drawn not to scale). The barrel bridge is 3.32 thick (05 08 05-1), so the square starts 0.42 inside its hole: its diagonal 3.82 in the
       hole's 3.9 ±0.01, and the set-up ratchet, its hole 2,7 H7 1:100 on the square's 1:100, pressed down the taper to 0.05 off the bridge's face, where the square is
       2.696 across (its 2,7 ±0,02 hold anywhere along the first 2 mm). 3.38 (40.65 over all) until 27 October 2026; the 1941 arbor (020704-1's 7 + 22,2 + 15) keeps it */
    const BSQ=BA1-WD.BAR.sq;
    const pBA=part('barrelArbor',-33),gBA=grp(pBA,BX[0],BX[1]);
    {const bal=WD.BAR.bal();
      const gAL=rv(gBA,'last 1943'),gAF=rv(gBA,'first 6mx');
      const aL=tag(mesh(gAL,turned(WD.BAR.prof(),48),M.steel),'050702-1');
      /* as first drawn the 1941 core between the 1941 drum's bosses: 020704-1's 12 long Ø 13.3 with its 22½° ends (sure), 0.05 off each boss (11.9) */
      {const c0=-3.7-3.1-0.05,c1=-21.7+2.9+0.05,ch=2.15*Math.tan(22.5*D2R);
        var aF=tag(mesh(gAF,turned([[0,-25.70],[1.94,-25.70],[1.94,BA1],[2.24,BA1],[2.24,c1],[4.5,c1],[6.65,c1+ch],[6.65,c0-ch],[4.5,c0],[2.24,c0],[2.24,BA0],[1.44,BA0],...bal],48),M.steel),'050702-1');}
      const Q=WD.BAR.sqr,sq=KIT.crease(new THREE.CylinderGeometry(Q.a/Math.SQRT2,Q.b/Math.SQRT2,Q.L,4,1));sq.translate(0,BSQ-Q.L/2,0);tag(mesh(rv(gBA,'last 1943'),sq,M.steel),'050702-1',1);
      const pt=KIT.crease(new THREE.CylinderGeometry(Q.b/Math.SQRT2,Q.tip,Q.tl,4,1));pt.translate(0,BSQ-Q.L-Q.tl/2,0);tag(mesh(rv(gBA,'last 1943'),pt,M.steel),'050702-1',1);
      /* as first drawn (020704-1, 1941): the square end 15 from the upper journal's shoulder (7 + 22.2 + 15 = its 44.2 overall, centres included: sure), so its tip at BA1-15,
         and the turning centre left on it, a cone the sheet draws undimensioned (scaled about 2.5). Wempe 3955's (4_Wempe_3955_N.jpg, photocompare.py's fit, 10.6 px/mm on
         the arbor): the square's sides end 13.1 from the shoulder (y -35.4 ±0.3; the model's 1943 square -35.2), the point 2.2 ±0.3 high to its tip at -37.6 ±0.3, the
         sheet's -37.32 within its reading; four-sided, its tip about 0.4 across. Until 18 October 2026 every version had the 1943 arbor's 10 and a 0.5 point */
      /* Kirov No. 247's (the 6MX) longer still: its sides end at y -36.6 and its point at -38.5 (±0.4: 4_Kirow_247_N.jpg, photocompare.py's fit, about 9 px a mm of height, the sides
         1.4 and the tip 3.0 above the 1943 square's), pointed as the 1941 one */
      for(const[V,yS,yT]of/** @type {[string,number,number][]} */([['first',-35.4,BA1-15],['6mx',-36.6,-38.5]])){const s1=2.7-(yS+25.70)*-0.01,sq1=KIT.crease(new THREE.CylinderGeometry(2.7/Math.SQRT2,s1/Math.SQRT2,-25.70-yS,4,1));sq1.translate(0,(-25.70+yS)/2,0);tag(mesh(rv(gBA,V),sq1,M.steel),'050702-1',1);
        const pt1=KIT.crease(new THREE.CylinderGeometry(s1/Math.SQRT2,0.2/Math.SQRT2*2,yS-yT,4,1));pt1.translate(0,(yS+yT)/2,0);tag(mesh(rv(gBA,V),pt1,M.steel),'050702-1',1);}
      /* the hook at its core's middle (0.51 lower as first drawn), in each state's group with its core: the pin and its head */
      const HKS=[[gAL,(BC0+BC1)/2,aL],[gAF,(-3.7-3.1-21.7+2.9)/2,aF]].map(([g,y,a])=>[tag(mesh(g,new THREE.BufferGeometry(),M.steel),'050702-2'),y,a,tag(mesh(g,new THREE.BufferGeometry(),M.steel),'050702-2',1),g]);
      /* the pin along +x from 6.1 into the core; its end over the core (r 6.65) by 0.475 at its face (+z, the side rotation.y falls toward) down to 0 at its back (-z).
         05 07 02's end view, first-angle (DIN) and so seen from the square's end, from above (the square drawn solid), puts the square face on the side the arbor turns from
         and the ramp falling the way it turns: the spring's eye, pulled along the strip (rotation.y rising, as the coil winds outward), catches the face with its trailing edge
         and the strip lies over the ramp. The arbor is then pulled against the set-up click (anticlockwise from the dial), as the crossed chain has it (2_Kirow_2973_A: README).
         Until 16 October 2026 the face was on the other side, read from the ball end */
      /* the core's lathe (48 sides) turned first so the hole's axis crosses the middle of a facet: the hole's walls then cut its facets the same way at any turn of the
         hook (at 1.65° off that, after BLK moved, holeCut's sections left a flat 0.06 into the pin: bom.py); the pin in its hole in the core, Ø 2 and 6 deep (0207's section dashes it from the core's face to r 0.65 with a drill's point: sure), bored into the arbor's lathe at the
         hook's turn (25 October 2026: until then the pin stood 0.55 into the unholed core); the pin pressed to its foot, 0.005 off the hole's floor */
      /* the head in the pin's frame (its y the radius, +z the face's side, x along the arbor): a slab 2 along the arbor, its outline about the core's axis from HFT (flush)
         to HFA (the face), its top r 6.65 + 0.475 at the face falling evenly to 6.65, its underside r 6.64 on the core's facets, the face radial */
      const HFA=15*D2R,HFT=-5*D2R,hd=[];for(let i=0;i<=20;i++){const f=HFT+(HFA-HFT)*i/20,r=6.65+0.475*i/20;hd.push([r*Math.sin(f),-r*Math.cos(f)]);}
      for(let i=20;i>=0;i--){const f=HFT+(HFA-HFT)*i/20;hd.push([6.64*Math.sin(f),-6.64*Math.cos(f)]);}
      /* as first drawn the head 3 along the arbor: 0207's section dimensions it "3" (its arrows on its ends) and 0,5 high over the Ø 2 pin, its far edge 9,4 from the bottom's
         inside (centred on the core's middle); 020704-1 draws the arbor without its hook. Its end-view form as revised (no 1941 end view). 2 until 28 October 2026 (drawing
         check 2, 4-M4) */
      const hdT=new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0)),hdG=slab(hd,[],-1.0,1.0),hdG41=slab(hd,[],-1.5,1.5);hdG.applyMatrix4(hdT);hdG41.applyMatrix4(hdT);   /* the slab's (x, thickness, -y) onto the pin's (z, x, y): a turn */
      var hookSet=a=>{for(const[hk,y,arb,hh,g0]of HKS){const st=TAU/48;arb.geometry.rotateY(a-st/2-Math.floor((a-st/2)/st)*st);arb.geometry=capFix(bore(arb.geometry,[0,y,0],[Math.cos(a),0,-Math.sin(a)],1.0,0.65,24),null);
        const g=new THREE.CylinderGeometry(1.0,1.0,1.0,24,1),p=g.attributes.position;for(let i=0;i<p.count;i++){const z=p.getZ(i),c=Math.sqrt(6.65*6.65-z*z);p.setY(i,p.getY(i)>0?c:0.655);}
        g.computeVertexNormals();hk.geometry.dispose();   /* its top on the core's round, its foot 0.005 off the hole's floor */
        hk.geometry=g;hk.position.set(0,y,0);hk.rotation.set(0,a,-Math.PI/2);hh.geometry=g0===gAF?hdG41:hdG;hh.position.set(0,y,0);hh.rotation.set(0,a,-Math.PI/2);}};}   /* built along its own y, turned onto the hook's radius: the pin's axis is its mesh's (bom.py reads a part's axis so; built in the arbor's frame until 25 October 2026, its axis read upright through its box's middle, which an oblique pin's ramped end puts off the pin) */
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
      /* the square hole 2,7 H7 "Kegel 1:100" (05 07 00-3's section A-B: the taper written in the hole), cut as the arbor's square tapers, 0.01 across a mm: at each face the
         square's own across there and 0.002 (line to line, 0.001 a side), so it is held on the taper where it is pressed down to, 0.05 off the bridge (the square 2.6953 across
         at the ratchet's bridge-side face and 2.6688 at its outer face as last revised, its 2.7 at BSQ; 2.6998 and 2.6733 on the 1941 arbor's, its 2.7 at -25.70). Until 28
         October 2026 straight, 2.714 across (2.7/√2 + 0.01 at the corners): 0.019-0.045 loose on the square, nothing holding it (drawing check 2, 4-M7). yS: where that
         version's square is 2.7 across; turned back by what rotateY(rho) turns it on, so it stays on the arbor's square */
      const sqH=(yS,y)=>{const a=(2.7-(yS-y)*0.01+0.002)/Math.SQRT2;return[[0,a],[a,0],[0,-a],[-a,0]].map(([x,z])=>[x*Math.cos(rho)-z*Math.sin(rho),x*Math.sin(rho)+z*Math.cos(rho)]);};
      const pSR=part('setupRatchet',-60),gSR=grp(pSR,BX[0],BX[1]);
      for(const[V,yS]of/** @type {[string,number][]} */([['last 1943',BSQ],['first -3955',-25.70]])){const rgg=solidGeo([{loop:SRO.map(([x,y])=>[x,-y]),y0:RS1,y1:RS0,F:[{p:sqH(yS,RS1),q:sqH(yS,RS0),a:RS1,b:RS0}]}]);rgg.rotateY(rho);tag(mesh(rv(gSR,V),rgg,M.gilt),'050700-3');}   /* a part of its own: it comes off the square before the bridge (the Exploded view) */pBA.userData.ratchetPen=pen(rho);
      /* Wempe 3955's (the version as photographed): a turned recess round the square in its outer face, Ø 8.7 at the face to Ø 7.3 at its floor (2_Wempe_3955_A.jpg square-on,
         0.111 mm/px: the cone's two edges, 78 and 66 px across, ±0.2), its wall seen lit on the far side in 4_Wempe_3955_N.jpg; 0.7 deep, the wall taken at 45° (estimated).
         05 07 00-3 (revised 24.11.47) draws the face flat; the earlier issue (05 05 00-1) isn't in the set */
      const C=(r,n=96)=>[...Array(n).keys()].map(i=>[r*Math.cos(i/n*TAU),r*Math.sin(i/n*TAU)]),rg3=solidGeo([{loop:SRO.map(([x,y])=>[x,-y]),y0:RS1,y1:RS0,F:[{p:C(8.7/2),q:C(7.3/2),a:RS1,b:RS1+0.7},{p:sqH(-25.70,RS1+0.7),q:sqH(-25.70,RS0),a:RS1,b:RS0}]}]);   /* the square's hole from the recess's floor, on the 1941 arbor's square */
      rg3.rotateY(rho);tag(mesh(rv(gSR,'3955 6mx'),rg3,M.gilt),'050700-3');}   /* Kirov No. 247's has it too (4_Kirow_247_N.jpg) */

    /* =============== the mainspring 05 07 00-6 (Zugfeder) =============== */
    /* "Zugfeder 15 × 0,37" (05 06_20; 0207: "Zugfeder 15", its space 15.8 ±0.1 framed): drawn 15 high in the 1948 drum's 15.63 inside (its lid flush, 1.2 thick in its 1.2 seat; 15.53 under a 1.3 seat until 27 October 2026; 14.8 in a 14.95 until 26 October 2026, the lid read as sunk 0.6)
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
    onRev(Object.assign(v=>{const f=v==='first'||v==='3955'||v==='6mx';gMS.position.y=f?(-3.7-1.2-21.7+1.0)/2-(MS0+MS1)/2:0;},{sub:'barrel'}));   /* as first drawn the same spring in the middle of the 1941 drum's 15.8 (0207: "Zugfeder 15"), 0.44 lower */
    /* the eye the arbor's hook holds it by: no sheet draws the strip's ends, so the Hamilton's (MSPRING.ey: 2.2 to 9.4 along the strip from its end, 5.2 high, KLUwI2UUCMQ
       15:54), as tools/mainspring.py holds the Wempe's inner end on the core through it (MC_MS_EYE 9.4): estimated. Its end toward the tip stands 0.05 off the hook's face at
       the strip's inner edge (the face radial, 15° off the pin's centre line: 0.05/6.65 rad more; the pin's flat side 1.0 off it, asin(1.05/6.65), until 27 October 2026);
       the eye 7.2 long past it takes the head (2.3 round the core) and the Ø 2 pin and lets the strip lie over the land. Until 17 October 2026 the eye wasn't cut (the hook passed through the drawn strip, fine.py's expected overlap) and the tip stood 0.18 rad behind the hook */
    const [EY0,EY1,EYH]=MSPRING.ey,tAt=s=>(Math.sqrt(MSa*MSa+MST*s/Math.PI)-MSa)/MST;   /* the turns from the tip to s mm along the core's coil (r MSa + MST tau) */
    const TIP=15*D2R+0.05/(MSa-MST/2)+TAU*tAt(EY0);   /* rad from the tip to the hook's centre line */
    /* its turns T: from its inner end, its tip TIP behind the arbor's hook (HKA), the hook in its eye, winding outward the way the drum runs (rotation.y rising), to its outer
       end lying on the hook block, 0.3 short of its far end (MSE past the rivet hole, estimated: the hook's form isn't drawn); set up 0.75 turn past lying all on the wall
       at run down (with the chain: the band turns the drum a little less, so its set-up there is a little more), which sets the hook's angle. Until 18 October 2026 the end
       stood 0.08 rad short of the hole, against the old 3-long block */
    const MSE=(HB1-0.3)/19.25,MST0=msT+0.75,HKA=wrap(BLK+BETA_RUN.chain+TIP+MSE-MST0*TAU);hookSet(HKA);const msK=Math.round(MST0-(BLK+BETA_RUN.chain+TIP+MSE-HKA)/TAU),msTurns=beta=>(BLK+beta+TIP+MSE-HKA)/TAU+msK;
    /* the outer end as the solve holds it (tools/wempe_mainspring.py): reckoned back from the end, psi round the drum, each turn's radius held under what is outside it.
       The end's last 5.7 on the block (r 19.25 - 0.5 less half the strip), then rising to the wall over 0.25 rad; the outer coil passes the Steg near the wall (between it
       and the wall, held on the wall there, 0.035 clear of its outer face as first drawn, 0.085 as last revised); every coil inside it bends under the Steg (0.005 clear of its inner face, over 0.3 rad either side) and under the strip's
       end on the block, each lying on the one outside it at the strip's pitch where they're packed; the outer coil, coming round to the end, dips under the block's far end
       over 0.4 rad. The bends' lengths are estimated (the solve's states show the same steps); the strip's length is kept as drawn without them */
    const PSB=(HB0+HB1-0.3)/19.25,PSF=0.3/19.25,PSS=Math.PI/4+MSE,RBK=19.25-BLD-MST/2,RSI=SG0-MST/2-0.005,ss=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
    const msCap=(u,ps)=>{let c=1e9;   /* u turns back from the outer end, ps its angle round the drum from the end */
      if(u<1){c=ps<=PSB?RBK:RBK+(MSR+0.05-RBK)*ss((ps-PSB)/0.25);c=Math.min(c,RBK-MST+(MSR+0.05-RBK+MST)*ss((TAU-PSF-ps)/0.4));}   /* on the block and up off it; under the block's far end */
      else{const d=Math.abs(ps-PSS)-SGW/SG0;c=d<=0?RSI:RSI+(MSR+0.05-RSI)*ss(d/0.3);}   /* under the Steg */
      return c;};
    function msGeo(T){const ni=msShape(T),no=T-1-ni,r1=MSa+MST*ni,r2=MSR-MST*no,P=[],n=Math.ceil(T*64),ym=(MS0+MS1)/2;
      const e0=tAt(EY0),e1=tAt(EY1),ts=[...new Set([...Array.from({length:n+1},(_,i)=>T*i/n),...Array.from({length:3*288+1},(_,i)=>T-i/288).filter(x=>x>0),T-PSB/TAU,e0,e1])].sort((x,z)=>x-z);   /* finer over the outer three turns */
      const R=ts.map(tau=>{if(tau<=ni)return MSa+MST*tau;if(tau<=ni+1){const f=tau-ni;return r1+(r2-r1)*(f*f*(3-2*f));}return r2+MST*(tau-ni-1);});
      for(let i=ts.length-1,j=ts.length-1;i>=0;i--){const u=T-ts[i],ps=TAU*(u-Math.floor(u));let r=Math.min(R[i],msCap(u,ps));   /* outward first: each held under the turn outside it */
        if(u<1){const d=Math.abs(ps-PSS)-SGW/SG0;r+=(MSR-r)*(1-ss(d/0.3));}   /* the outer coil on the wall behind the Steg (the drawn spiral stands 0.05 off it there: as first drawn the Steg's outer face is 18.85) */
        if(u>=1){const t1=ts[i]+1;while(j>0&&ts[j-1]>=t1)j--;const k=Math.max(1,j),o=R[k-1]+(R[k]-R[k-1])*(t1-ts[k-1])/(ts[k]-ts[k-1]);r=Math.min(r,o-MST);}
        R[i]=r;}
      ts.forEach((tau,i)=>{const a=HKA-TIP+TAU*tau;P.push(new THREE.Vector3(R[i]*Math.cos(a),ym,-R[i]*Math.sin(a)));});
      return eyeRibbonGeo(P,0.36,Math.abs(MS1-MS0),ts.indexOf(e0),ts.indexOf(e1),-EYH/2,EYH/2);}

    /* =============== the chain 05 07 04 (Kette) and the band 05 07 03 (Schneckenband) =============== */
    /* the chain: hardened, tempered at 310°, lightly polished: the plates' figure of eight, two lobes r 1 round the rivets (the framed 2 across) joined by concave sides,
       an arc each tangent to both lobes. Traced on 05 07 04's two plan views (stroke centres, across scaled by the lobes' framed 2, along by the 2.05 pitch): the waist 1.41
       (1.38-1.44 over its 13 waists, the inner plates' seen between the outer pairs among them), the side 0.74 from the line at 0.28 from the waist and 0.81 at 0.46, the lobe's
       circle from about 0.5 on: the arc r 0.93 that the waist and tangency give (0.75 and 0.83 there). Until 17 October 2026 the waist was 1.2, the sides straight and meeting
       the lobes in a notch. An outer link two plates, an inner link one plate, each lobe with its hole for the rivet (05 07 04's "0,55" across a pin's centre, the plan
       view's circle in every lobe: drawn Ø 0.56 round the rivet's 0.55, the rivet stock 0.6), the rivets, a pair to each outer link, through all three plates, their ends
       flush with the outer plates (the edge view draws nothing standing out of the framed 0.82) and polished bright, as Wempe 3955's chain shows them, each end a round
       lighter than its plate (14_Wempe_3955_Band_Kette.jpg). Until 17 October 2026 the plates had no holes and the rivets were the plates' own steel, so none showed.
       Instanced, laid along the pitch line every update */
    const pC=part('chain',-33),gC=new THREE.Group();pC.add(gC);
    /* the outline as points, about 20° a segment on the lobes and the sides alike (absarc's divisions are per arc, which cut the short sides five times as fine), the holes
       12-gons in the rivets' phase (cylY's vertices at the shape's multiples of 30°), 0.005 clear all round: 375 links drawn in software must stay cheap (smoke.py's wind) */
    const RVH=0.28,PLO=(()=>{const r=1.0,c=1.025,w=0.705,R=(c*c+w*w-r*r)/(2*(r-w)),ta=Math.atan2(w+R,-c),tf=Math.atan2(-(w+R),c),o=[];   /* R: the side's arc; ta, tf: the tangent points' angles about the right lobe and the top side's centre */
      const arc=(x,y,q,a0,a1,n)=>{for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n;o.push([x+q*Math.cos(a),y+q*Math.sin(a)]);}};
      arc(c,0,r,-ta,ta,12);arc(0,w+R,R,tf,-Math.PI-tf,3);arc(-c,0,r,Math.PI-ta,Math.PI+ta,12);arc(0,-w-R,R,Math.PI+tf,-tf,3);return o;})();
    const plate=y=>{const g=slab(PLO,[1.025,-1.025].map(x=>Array.from({length:12},(_,k)=>[x+RVH*Math.cos(-k*Math.PI/6),RVH*Math.sin(-k*Math.PI/6)])),-0.13,0.13);g.translate(0,y,0);return g;};   /* with the rivets' holes */
    const I4=new THREE.Matrix4(),geoA=mergeGeo([[plate(0.27),I4],[plate(-0.27),I4]]),geoB=plate(0),geoR=mergeGeo([1.025,-1.025].map(x=>[cylY(0.275,0.80,12),new THREE.Matrix4().makeTranslation(x,0,0)]));
    const MAXL=200,imA=new THREE.InstancedMesh(geoA,M.chain,MAXL),imB=new THREE.InstancedMesh(geoB,M.chain2,MAXL),imR=new THREE.InstancedMesh(geoR,M.steel,MAXL);gC.add(imA,imB,imR);
    imA.frustumCulled=imB.frustumCulled=imR.frustumCulled=false;tag(imA,'050704');tag(imB,'050704',1);tag(imR,'050704',1);   /* imR: an outer link's rivets, laid as imA */
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
    const hkMesh=(o,id,mat)=>{const g=new THREE.Group();gC.add(g);tag(mesh(g,slab(o,[{c:[0,0],r:RVH}],-0.13,0.13),mat),id,1);   /* the eye's hole, its end link's rivet through it */
      const b=offEye(o,1.1);tag(mesh(g,slab(b,[],0.13,0.40),mat),id,1);tag(mesh(g,slab(b,[],-0.40,-0.13),mat),id,1);return g;};   /* the eye 0.26; the body 0.80 */
    const cHT=hkMesh(HKT,'050704',M.chain),cHB=hkMesh(HKB,'050704',M.chain);
    /* the band: its strip a ribbon along its pitch line; its hooks (Bandstahl 10 × 0.8 DIN 1016, 0.8 -0.05 thick: drawn 0.78), the band's end brazed into each.
       Their plan views (10:1) traced on the scans (tools/wempe_bandhooks.py: the outline's middle, 34.5 px/mm checked on each sheet's own figures) and cut into lines and
       arcs by tools/mfgfit.py (floor 1 px, 0.03 mm), each figure the sheet writes taken in place of its traced reading; the arcs it doesn't figure (or figures against its
       own drawing) are the traced ones. Coordinates in mm on each sheet as drawn (x right, y up).
       The round hook 05 07 03-2 (Bandhaken rund, 18.3.43), its origin the seat's centre: the throat's top r 0,4 (the fusee's pin's seat; traced 0.43, the line's width) at
       the origin; its right wall straight down 0.4 from it (traced 0.38) to the bottom r 1 about (1,4, -2,5) (the "7r" read "1r": traced 1.21 and 0.91 at its two sides),
       which it meets tangent, as the figures make it; the nose r 0,4 about (-1,25, -0,5) (traced 0.44 about (-1.24, -0.51)), the throat's left wall the line tangent to it
       and the seat, 31.7° off the vertical (the sheet's "30°": its other figures make 31.7; traced 27.4 ±0.3); the nose's back a line 7.9° off the vertical (traced, 0.010
       rms) up to the crown, a corner there; the crown r 2.08 about (0.17, -0.34) (traced, 0.006 rms on both its pieces: the bracketed "(1,5r)" isn't what's drawn); the
       flank r 5.93 about (-3.47, -1.70) (traced r 5.90 ±0.07 about that, 0.007 rms; its "6r" and "3,55" hold, its "2,8" below is drawn 1.70: the drawing kept), set
       tangent to the bottom circle (5.93 then). The band 0,22 +0,03 in its slot at 5° to the vertical, its right face through the bottom circle's centre (the 5°'s vertex, 1,4
       and 2,5 from the seat), leaving through a notch with its edges broken ("Kante brechen": 0.1 here). The fusee's pin in the seat, the band pulling down: laid level in
       the flange's slot as the chain's top hook. Its extent 4.1 across × 5.2 along.
       The drum hook 05 07 03-3 (Bandhaken f. Trommel), its origin where the barb's line (0,3 above the barb's centre) crosses the vertical centre line: the tip r 0,2
       about (0, 4,5) (drawn about r 0.3, its centre 0.08 right); the back r 10 about (-7.97, -1,2), tangent to the tip: the figures decide, the drawn back lying 0.10-0.15
       outside it over its middle (traced r 9.99 ±0.03 about (-7.87, -1.07), 0.008 rms; through the traced back at the 1,2 the circle would leave the tip r 0.3); the bottom
       r 1 about (1,0, -2,5) on both sides of the band's notch (the "7r" read "1r": traced r 1.009 ±0.002 about (0.995, -2.511), one circle); the barb's tip r 0,2 about (-1,0,
       -0,3); its upper flank r 4 about (2,8, -0,35) (traced 3.98 ±0.05 about (2.72, -0.42)), which the barb's circle touches inside (4 - 0.2 = 3.80: the figures agree to
       0.002); the barb's lower edge the line tangent to it and to the notch's r 0,2 about the origin, 50.8° off the vertical (the sheet's "50°"; traced 50.2); the left wall
       from the notch to the bottom circle, tangent to both (4.7° off the vertical; traced 5.2); the front a line 7.5° off the vertical tangent to the tip (traced, 0.010 rms;
       the sheet's "20r" bows it 0.014 over its 1.5), meeting the barb's flank in a corner. The band at 10° to the vertical, its right face 0.2 left of the bottom's centre
       ("0,2"; traced 0.26), leaving through a notch as the round hook's. Its extent 3.4 across × 8.1 along. Laid with its left wall on the drum, its barb in the drum's
       slot (DRUM, below), the band rising off the drum into it.
       Until 27 October 2026 both were placeholders: 12- and 10-point outlines about half the size, no throat, slot, crown, barb or notch */
    const pBd=part('band',-33),gBd=new THREE.Group();pBd.add(gBd);const bdM=tag(mesh(gBd,new THREE.BufferGeometry(),M.steel),'050703-1');
    const BHK=(()=>{const V=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],ang=(c,p)=>Math.atan2(p[1]-c[1],p[0]-c[0]),pt=(c,r,a)=>[c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];
      const tg=(c1,r1,s1,c2,r2,s2)=>{const D=V(c2,c1),L=Math.hypot(...D),th=Math.atan2(D[1],D[0])-Math.asin((s2*r2-s1*r1)/L),n=[-Math.sin(th),Math.cos(th)];   /* the line tangent to both, directed c1 to c2, circle i on its left (s +1) or right (-1) */
        return[[c1[0]-s1*r1*n[0],c1[1]-s1*r1*n[1]],[c2[0]-s2*r2*n[0],c2[1]-s2*r2*n[1]]];};
      const arc=(o,c,r,a0,a1,ccw)=>{let d=a1-a0;if(ccw)while(d<=0)d+=TAU;else while(d>=0)d-=TAU;const n=Math.max(2,Math.ceil(Math.abs(d)/(6*D2R)));for(let i=0;i<=n;i++)o.push(pt(c,r,a0+d*i/n));return o;};
      const cc=(c1,r1,c2,r2)=>{const D=V(c2,c1),L=Math.hypot(...D),a=(r1*r1-r2*r2+L*L)/(2*L),h=Math.sqrt(Math.max(0,r1*r1-a*a)),m=[c1[0]+D[0]*a/L,c1[1]+D[1]*a/L];return[[m[0]-D[1]*h/L,m[1]+D[0]*h/L],[m[0]+D[1]*h/L,m[1]-D[0]*h/L]];};   /* circles' crossings */
      const lc=(p,d,c,r)=>{const w=V(p,c),b=dot(w,d),q=b*b-(dot(w,w)-r*r);return[-b-Math.sqrt(q),-b+Math.sqrt(q)].map(t=>[p[0]+d[0]*t,p[1]+d[1]*t]);};   /* a line's crossings with a circle, along d */
      /* the band's slot (12 and 13 each draw the band 0,22 +0,03 running up into the hook from its notch to the sheet's reference line, 2,5 over the bottom circle's centre:
         the round hook's through the seat's centre, the drum hook's along the barb's line; "hart gelötet", 11): cut 0.235 wide (the 0,22 +0,03's middle) about the band's
         faces, its end square to the band where its right face reaches the line yt; its mouth's edges broken 0.1 ("Kante brechen"). Until 28 October 2026 only the 0.1 break
         was cut and the band butted on it (drawing check 2, 4-M8) */
      const notch=(B,p,d,w,yt)=>{const nl=[-d[1],d[0]],e=(0.235-w)/2,off=(q,k)=>[q[0]+nl[0]*k,q[1]+nl[1]*k],pR=off(p,e),pL=off(p,-w-e),xR=lc(pR,d,B,1)[1],xL=lc(pL,d,B,1)[1];   /* the slot's faces (p on the band's right face, d down it, w across) out through the bottom circle B (r 1) */
        const up=(q,y)=>{const t=(y-q[1])/-d[1];return[q[0]-d[0]*t,q[1]-d[1]*t];},tR=up(pR,yt),tL=off(tR,-0.235),bR=lc(p,d,B,1)[1],bL=lc(off(p,-w),d,B,1)[1],tM=off(up(p,yt),-w/2);
        return{aL:ang(B,xL),aR:ang(B,xR),put:o=>{o.push([xL[0]-d[0]*0.1,xL[1]-d[1]*0.1],tL,tR,[xR[0]-d[0]*0.1,xR[1]-d[1]*0.1]);},mouth:[(bL[0]+bR[0])/2,(bL[1]+bR[1])/2],top:[tM[0]+d[0]*0.01,tM[1]+d[1]*0.01]};};   /* top: the band's end, its middle 0.01 short of the slot's end */
      /* the round hook, walked round anticlockwise from the bottom circle's tangent with the right wall */
      const S=[0,0],N=[-1.25,-0.5],B=[1.4,-2.5],K=[0.165,-0.343],RK=2.076,F=[-3.465,-1.700],RF=Math.hypot(...V(B,F))+1,b5=5*D2R,dB=[Math.sin(b5),-Math.cos(b5)];
      const nb=notch(B,B,dB,0.22,0),[lw0,lw1]=tg(N,0.4,1,S,0.4,-1),b7=7.9*D2R,dk=[-Math.sin(b7),-Math.cos(b7)],nk=[-dk[1],dk[0]],pN=[N[0]-0.4*nk[0],N[1]-0.4*nk[1]];
      const X1=cc(F,RF,K,RK).sort((a,b)=>b[1]-a[1])[0],X2=lc(pN,dk,K,RK)[0];
      const T=[];arc(T,B,1,Math.PI,nb.aL-0.1,true);nb.put(T);arc(T,B,1,nb.aR+0.1,ang(F,B),true);arc(T,F,RF,ang(F,B),ang(F,X1),true);arc(T,K,RK,ang(K,X1),ang(K,X2),true);
      arc(T,N,0.4,ang(N,pN),ang(N,lw0),true);arc(T,S,0.4,ang(S,lw1),0,false);
      /* the drum hook, from the tip */
      const Tp=[0,4.5],CR=[-7.972,-1.2],B3=[1.0,-2.5],Q=[0,0],BT=[-1.0,-0.3],A4=[2.8,-0.35],b10=10*D2R,dB3=[-Math.sin(b10),-Math.cos(b10)],b75=7.5*D2R,df=[Math.sin(b75),-Math.cos(b75)],nf=[-df[1],df[0]];
      const pT=[Tp[0]-0.2*nf[0],Tp[1]-0.2*nf[1]],Xa=lc(pT,df,A4,4)[0],tA=pt(A4,4,ang(A4,BT)),[bl0,bl1]=tg(BT,0.2,1,Q,0.2,-1),[wl0,wl1]=tg(Q,0.2,-1,B3,1,1);
      const n3=notch(B3,[0.8,-2.5],dB3,0.22,0),XB=cc(B3,1,CR,10).sort((a,b)=>a[1]-b[1])[0],tT=pt(CR,10,ang(CR,Tp));
      const D=[];arc(D,Tp,0.2,ang(Tp,tT),ang(Tp,pT),true);D.push(Xa);arc(D,A4,4,ang(A4,Xa),ang(A4,tA),true);arc(D,BT,0.2,ang(BT,tA),ang(BT,bl0),true);arc(D,Q,0.2,ang(Q,bl1),ang(Q,wl0),false);
      arc(D,B3,1,ang(B3,wl1),n3.aL-0.1,true);n3.put(D);arc(D,B3,1,n3.aR+0.1,ang(B3,XB),true);arc(D,CR,10,ang(CR,XB),ang(CR,tT),true);
      /* into the chain's hooks' frames: the round hook's x up the band from its mouth (the band's middle where it leaves), y to its left; the drum hook's x up its left
         wall from 1.5 behind the mouth (where the band, laid on the drum, ends), y out from the wall (the barb on -y): turned over, so its order reversed */
      const dedup=o=>o.filter((p,i)=>Math.hypot(...V(p,o[(i+1)%o.length]))>1e-4);
      const u5=[-dB[0],-dB[1]],v5=[-u5[1],u5[0]],M5=nb.mouth,top=dedup(T).map(p=>{const q=V(p,M5);return[dot(q,u5),dot(q,v5)];});
      const uw=V(wl0,wl1),lw=Math.hypot(...uw),uW=[uw[0]/lw,uw[1]/lw],mW=[uW[1],-uW[0]],bot=dedup(D).map(p=>[dot(V(p,n3.mouth),uW)+1.5,dot(V(p,wl1),mW)]).reverse();
      return{top,bot,seat:[dot(V(S,M5),u5),dot(V(S,M5),v5)],mouth:[1.5,dot(V(n3.mouth,wl1),mW)],endT:[dot(V(nb.top,M5),u5),dot(V(nb.top,M5),v5)],endB:[dot(V(n3.top,n3.mouth),uW)+1.5,dot(V(n3.top,wl1),mW)]};})();   /* endT, endB: the band's ends in the slots, in each hook's frame */
    const hkB=(o,id)=>{const g=new THREE.Group();gBd.add(g);tag(mesh(g,slab(o,[],-0.39,0.39),M.chain),id);return g;};
    const BYW=20.81-CG.band.rbp,bHT=hkB(BHK.top,'050703-2'),bHB=hkB(BHK.bot.map(([x,y])=>[x,y+BYW]),'050703-3');   /* the drum hook's wall 0.01 off the drum */

    /* the chain's first rivet: where along the chain's path (from its start, m 0) the top hook's seat, 3.70 from its rivet, reaches the pin (about 0.4: the path starts at
       the flange's slot on the chain's pitch line, which the hook's real run into the deepened slot below it shortens) */
    const HK0=(()=>{const q=pol(PINR,PINA),SD=Math.hypot(...HKSEAT),of=CONN.chain.of,P=m=>{const a=pol(rf(m)+of,PHI0+TAU*m);return[a[0],yc(m),a[1]];},dh=b=>Math.hypot(b[0]-q[0],b[2]-q[1]);
      let s=0,a=P(0);if(dh(a)>=SD)return 0;for(let i=1;i<=400;i++){const b=P(i/4000),sg=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);if(dh(b)>=SD)return s+sg*(SD-dh(a))/(dh(b)-dh(a));s+=sg;a=b;}return s;})();
    /* =============== the state =============== */
    let conn='chain';pBd.visible=false;
    const setConn=v=>{conn=v==='band'?'band':'chain';pC.visible=conn==='chain';pBd.visible=conn==='band';if(DRUM[conn]){dL.geometry=DRUM[conn][0];dF.geometry=DRUM[conn][1];}last.n=null;};   /* the drum slotted for its connector's hook (DRUM, below) */
    const NRUN=CG.chain.NRUN;   /* run down: the chain's last turn has left the fusee (both connectors end within a hundredth of a turn of each other) */
    const last={n:null,ck:[null,null],conn:null};
    /* the clicks: where the click wheel seats click 0 (its nose at the root against a face), the fusee's angle against the ratchet's; computed once */
    const ck0={P:CKP[0],v:gCK[0].userData.tip};
    const ckAng=(i,rel)=>{const P=CKP[i],v=gCK[i].userData.tip,a0=Math.atan2(P[1],P[0]);   /* rel: the click wheel's turn against the ratchet; its nose toward the wheel and behind its pivot, the click turned about a0 + 1.17 (05 06 02) */
      return seat(cwR,rel,P,v,a0+1.17+0.4,a0+1.17-0.4);};
    const SEAT=(()=>{let best=null;for(let i=0;i<180;i++){const rel=i/180*P35,g=ckAng(0,rel),c=Math.cos(g),s=Math.sin(g);let r=99;for(const v of ck0.v)r=Math.min(r,Math.hypot(ck0.P[0]+v[0]*c-v[1]*s,ck0.P[1]+v[0]*s+v[1]*c));
      if(!best||r<best.r)best={rel,r};}return best.rel-0.02*P35;})();   /* where click 0 drops deepest: at the root, against a face; 2 % of a tooth (0.2°) back from it, as the deepest sample lies within one step of the face's edge and the click outline's polar table (polarMax, 0.09°) can put that a hair past the drawn face, the click then on the next tooth's tip (16 October 2026, maintaining.py's bearing test, once the ratchet's sheet stood as A-B draws it) */
    /* the clicks' rest angle when lifted clear (no teeth under them): for the spring's shape before the first update */
    /* fall(): how far the ratchet turns back, the key put on, before the maintaining detent meets a tooth's steep face: turned back in 120 steps over a tooth, the detent
       seated at each as update() seats it, until it would have to jump (its seat moving 0.01 rad at once: the face in its way); 0 to a tooth's 3° (wempe_ratchets.js
       reports the same fall off the built model) */
    let lastRG=0;const fall=()=>{const P=[DX[0]-FX[0],-(DX[1]-FX[1])],step=TAU/120/120;let g0=seat(gsR,lastRG,P,DTN,0.35,-0.35);
      for(let i=1;i<=120;i++){const g=seat(gsR,lastRG-i*step,P,DTN,0.35,-0.35);if(Math.abs(g-g0)>0.01)return(i-1)*step;g0=g;}return TAU/120;};
    function update(s,c){
      const n=Math.max(0,Math.min(NRUN,s.n??0)),cg=CG[conn],ms=s.ms??WPHYS.runPhi(1);
      if(Math.abs(ms-msPhi)>2e-4||(ms===0)!==(msPhi===0)){msPhi=ms;for(const o of msBent){o.m.geometry.dispose();o.m.geometry=o.geo(ms);}gEP.rotation.y=ms;}   /* the spring bent to the ratchet's lead in steps of 0.0002 rad (0.0028 at the eye, inside the ratchet's pin hole's 0.0035), its eye's pin with it */
      const RW=-c*14/90+gWp.rotation.y,RG=RW+ms;   /* the fusee wheel (its phase included), and the ratchet ahead of it by the spring's lead (closed by the drive: WPHYS), exactly: held by its detent while the key turns */
      gW.rotation.y=-c*14/90;gMW.rotation.y=RG;gMS2.rotation.y=RW;
      /* the fusee: its turns from full wind, and running, carried forward onto the clicks (the click wheel's face against the nearer click's nose); winding, as the key has it */
      let Rf=cg.RF0+TAU*n;const rel=Rf-RG;if(!s.winding)Rf+=fr((SEAT-rel)/(P35/2))*(P35/2);   /* onto the nearer click: the two 180° apart on 35 teeth, half a tooth out of step (until 16 October 2026 onto click 0, up to a whole tooth) */
      for(const g of[gF,gDP,gSP,gV,gSW])g.rotation.y=Rf;
      /* the clicks ride on the click wheel */
      const rl=Rf-RG;gCK.forEach((g,i)=>{const a=ckAng(i,rl);g.rotation.y=a;if(last.ck[i]===null||Math.abs(last.ck[i]-a)>0.002){last.ck[i]=a;const o=spr[1-i];o.m.geometry.dispose();o.m.geometry=sprGeo(o);}});
      /* the maintaining detent rides on the ratchet's teeth */
      {const P=[DX[0]-FX[0],-(DX[1]-FX[1])];gDc.rotation.y=seat(gsR,RG,P,DTN,0.35,-0.35);lastRG=RG;}
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
          mtx.makeBasis(t,up,nn).setPosition(pos);if(k%2===0){imR.setMatrixAt(ia,mtx);imA.setMatrixAt(ia++,mtx);}else imB.setMatrixAt(ib++,mtx);}
        imA.count=imR.count=ia;imB.count=ib;imA.instanceMatrix.needsUpdate=imR.instanceMatrix.needsUpdate=true;imB.instanceMatrix.needsUpdate=true;
        /* the hooks: the top one from the first rivet back to the pin, the bottom one on from the last rivet along the drum */
        const nJ=J.length-1;place(cHT,J[0],PINA,Rf,'top',Math.atan2(HKSEAT[1],HKSEAT[0]),J[1].clone().sub(J[0]).normalize());place(cHB,J[nJ],null,beta,'bot',0,J[nJ].clone().sub(J[nJ-1]).normalize());}
      else{const q=pol(PINR,PINA+Rf),SD=Math.hypot(...BHK.seat),dh=v=>Math.hypot(v.x-fx-q[0],v.z-fz-q[1]);let i=1;while(i<pts.length-1&&dh(pts[i])<SD)i++;   /* the band from where its round hook's seat, SD from its mouth, lies on the pin */
        const a=pts[i-1],b=pts[i],t=(SD-dh(a))/Math.max(1e-9,dh(b)-dh(a)),p0=dh(a)>=SD?a:a.clone().lerp(b,Math.min(1,Math.max(0,t)));
        place(bHT,p0,PINA,Rf,'top',Math.atan2(BHK.seat[1],BHK.seat[0]));place(bHB,pts[pts.length-1],null,beta,'bot');
        const bp=[new THREE.Vector3(BHK.endT[0],0,-BHK.endT[1]).applyMatrix4(bHT.matrix),p0,...pts.slice(i)];   /* from its end in the round hook's slot */
        bp.push(new THREE.Vector3(BHK.mouth[0],0,-(BHK.mouth[1]+BYW)).applyMatrix4(bHB.matrix),new THREE.Vector3(BHK.endB[0],0,-(BHK.endB[1]+BYW)).applyMatrix4(bHB.matrix));   /* on into the drum hook's mouth, risen off the drum, and up its slot */
        bdM.geometry.dispose();bdM.geometry=ribbonGeo(bp,0.22,0.78);}
      /* the mainspring: the barrel's turns from run down give its turns (its outer end turns with the drum, its inner end stays with the arbor) */
      const T=msTurns(beta);msM.geometry.dispose();msM.geometry=msGeo(Math.max(msT+0.1,T));pMS.userData.T=T;
      /* the stop bar: as far in as the connector presses it; its spring follows */
      const tr=barTravel(pts,kf,m0,Rf);gBar.children[0].position.x=tr;pSW.userData.travel=tr;
      if(Math.abs(tr-spT)>1e-4){spT=tr;spM.geometry.dispose();spM.geometry=spGeo(tr);}
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
    /* the slot for the connector's drum hook (0207: "Schlitz für Kette erst bei Schneckenmontage einsetzen", 2.5 wide round the drum in its plan, its section 0.85 across
       the wall's height, through the wall: sure; 0207 draws it on the drum of 1941, and the later sheets keep its note's practice), cut where the hook's barb comes to the
       drum: the connector laid once and its drum hook's points inside the drum's Ø 41.6, put in the drum's frame, give the slot's middle, round the drum and along it (the
       chain's barb -21.7° to -17.5°, 1.03 into the wall, 0.80 high on y -18.0; the band's -40.3° to -34.7°, 0.33 in). Cut so in the drum of each version, each connector
       its own drum (setConn swaps them). 0207 draws the chain's slot 180° from the Steg and 135° from the hook block's rivet hole: BLK (above) is set from the chain's
       slot so; the band's (no sheet places it) stands 162° from the Steg. 25 October 2026: until then not cut, the hooks' barbs in the drum's metal.
       Cut at 45° to the radius, not radially: 0207's plan (12.27 px/mm) draws the slot's walls leaning through the wall, its "45°" arc centred on the left wall where it
       meets the rim and measured from the 6 o'clock centre line (the walls there read 48° and about 30°, drawn freehand; the dimension decides: sure), going outward away
       from the chain's run, so going in it leans back toward the run, as the bottom hook's barb does (its flank 50° to the shank, its tip back toward the rivet: 05 07 04).
       Its walls parallel, 2.5 apart round the drum at the rim (0207's "2,5" there; across the slot 2.5 cos 45° = 1.77), 0.85 along the axis (the section), its middle
       line through the wall's middle at the barb's angle; the lean's sense taken from the laid hook (its rivet's side). Radial until 25 October 2026 */
    const DRUM={};{const base=[dL.geometry,dF.geometry],SW=1.25*Math.SQRT1_2,sl=[[-0.425,-SW],[0.425,-SW],[0.425,SW],[-0.425,SW]];
      for(const k of['chain','band']){setConn(k);update({n:2.5},0);gB.updateWorldMatrix(true,true);const hk=k==='chain'?cHB:bHB,A=[],Y=[];hk.updateWorldMatrix(true,true);
        const inv=new THREE.Matrix4().copy(gB.matrixWorld).invert(),v=new THREE.Vector3();
        hk.traverse(o=>{if(!o.isMesh)return;const P=o.geometry.attributes.position,m=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld);for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(m);if(Math.hypot(v.x,v.z)<20.8){A.push(angOf(v.x,v.z));Y.push(v.y);}}});
        const a=(Math.min(...A)+Math.max(...A))/2,y=(Math.min(...Y)+Math.max(...Y))/2;pB.userData['slot_'+k]=[+(a/D2R).toFixed(2),+y.toFixed(3)];
        const rh=[Math.cos(a),0,-Math.sin(a)],th=[-Math.sin(a),0,-Math.cos(a)],bk=new THREE.Vector3(-1,0,0).transformDirection(new THREE.Matrix4().multiplyMatrices(inv,hk.matrixWorld)),sb=Math.sign(bk.x*th[0]+bk.z*th[2]);   /* rh out, th the way a grows; the hook's rivet's side (the run's) along th */
        const dO=[0,2].map(j=>(rh[j]-sb*th[j])*Math.SQRT1_2),rm=20.0,o=[rm*rh[0],y,rm*rh[2]];   /* out through the wall leaning away from the run (in, back toward it); through the wall's middle (r 19.25-20.8) */
        if(k==='chain'&&Math.abs(wrap(a-BLK+5*Math.PI/4))>0.5*D2R)console.error(`fusee.js: the chain's slot at ${(a/D2R).toFixed(2)}° is not 225° behind the rivet hole (BLK ${BLK}): set BLK to the slot + 5π/4 (0207)`);
        DRUM[k]=base.map(g=>capFix(bore(g.clone(),o,[dO[0],0,dO[1]],0,-1.6,4,sl),null));}
      base.forEach(g=>g.dispose());setConn('chain');}
    /* keySeat: where the winding key goes on (case.js keyAt): the dust plate's group, turning with the fusee and spread with the dust plate in the Exploded view (so the key
       stays outside the dust bush, which spreads further than the fusee), and the plate's face toward the key (y0 above: 4 from the square's root, where it is 3.08 across,
       under the key's socket, 3.15: 05 01 02-3's 3.1 +0.05 takes the square anywhere, so the socket's mouth stops on the plate; until 28 October 2026 7 from the root, where
       the square read then was 3.1); the tube's mouth, Ø 5.95, comes over the plate's recess there, Ø 6.2 */
    return{update,fall,setConn,get conn(){return conn;},keySeat:{g:gSP,y:yT-12},NRUN,MW:CG.chain.m0Of(CG.chain.RF0),HPT:90/14,CG,rf,yc,ac,SEAT,P35,MST0,msT,rBody,stack:{yD,yT,VHF,VFA,W,WT,G,GT,GP,F,F0,S,DP0,DTU,DTL,BB,BR}};}
  return{build,bore,capFix};   /* bore and capFix lent to frame.js (the movement ring's screw holes through its cone), which builds before this file's build runs */
})();
