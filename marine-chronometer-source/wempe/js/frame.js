// @ts-check
/* frame.js: the Wempe Einheits-Chronometer's frame (Gestell, drawing group 05 08), built from its sheets as last revised (about 1946-48): the two plates with every hole of
   their tables, the three pillars and their screws, the movement ring, the barrel bridge with its click, the fusee bush and dust bush, the two balance cocks and the
   intermediate bridge, each with its screws and steady pins. Part of the Wempe model (three.js r128). Declares only WFRAME: WFRAME.build(mv, M, K) adds the parts to the
   movement group (K: KIT.parts' makers), and returns their places for the later groups. Sizes read off the sheets are in the comments beside them, with how sure; the shared
   ones (plates, pillars, the hole table WD.H) are in dims.js.
   Units mm, the movement frame as the Hamilton's: dial side +y, 12 o'clock -z, 3 o'clock +x (x = the sheets' W, z = their S). The pillar plate's inner face at y 0, its dial face
   at +PP_T; the top plate's inner face at -INNER (TI), its outer face at -INNER-TOP_T (TT). Holes are drawn at the middle of their fits; a tapped hole at its thread's size and
   0.02 (as the Hamilton's hT), a steady pin's hole in a plate at its reamed 1.6025 (a slide fit) and in the part that carries the pin at 1.585 -0.005 (pressed). */
const WFRAME=(()=>{
  const H=WD.H,R=WD.PLATE_R,TT=-WD.INNER-WD.TOP_T,TI=-WD.INNER,PPT=WD.PP_T,{ring,bool,solidGeo,area,stadiumPts,sdfOutline,clipPoly,twoCircles}=KIT;
  const brg=b=>[-Math.sin(b*D2R),-Math.cos(b*D2R)],add=(p,u,k=1)=>[p[0]+u[0]*k,p[1]+u[1]*k],sub=(p,q)=>[p[0]-q[0],p[1]-q[1]],unit=u=>{const l=Math.hypot(u[0],u[1]);return[u[0]/l,u[1]/l];};
  const bearing=u=>Math.atan2(-u[0],-u[1])/D2R;   /* plan direction to bearing (deg from N toward O) */
  const C=(p,r,n=0,ph=0)=>ring(p[0],p[1],r,n,ph);
  /* hole radii: tapped (the thread's and 0.02, as the Hamilton's hT), clearance and reamed */
  const rM26=1.32,rM2=1.02,rM17=0.87,rM14=0.72,rM12=0.62,rCl26=2.8/2,rPinP=1.6025/2,rPinQ=1.5825/2,rPin=1.6/2,rJ=4.596/2,rH35=3.506/2;
  /* a feature cut in a cell from y0 to y1: T through, A from y0 d deep, B from y1 d deep */
  const T=(p,r,y0,y1)=>({p:C(p,r),a:y0,b:y1}),A=(p,r,y0,d)=>({p:C(p,r),a:y0,b:y0+d}),B=(p,r,y1,d)=>({p:C(p,r),a:y1-d,b:y1});
  const PL={};   /* places for the later groups */

  function build(mv,M,K){const{part,screw,loose,headOn}=K,V2=(a,b)=>new THREE.Vector2(a,b),tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined);
    /* the versions (movement.js's setRev): rv(par, 'last first 1943' or '6mx') a group of the pieces only those versions have. The drawings' two versions share the frame; the
       Soviet 6MX (Kirov No. 247) moves pillar 39 to 190° (WD.P39_6MX), leaves out the top plate's hole 53 and the upper cock's hole 20: each plate and that cock built once for
       each, the pillar and its screws at 39 in each version's group */
    const rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;},VER=[['last first 1943',H[39],1],['6mx',WD.P39_6MX,0]];   /* [versions, pillar 39, the drawings' holes 20 and 53] */
    /* The 6MX's finish: Geneva stripes (Kirov No. 247's plates, bridges and cocks; the Wempe's are hammered, drawn plain gilt), straight, 3.95 mm apart (FFT on plain
       patches of its top plate, 2_Kirow_247_A.jpg at 8.98 px/mm: 3.73-4.28, and its dial side, 3_Kirow_247_uZ.jpg at 8.63: 3.71-4.35; median), running at 50 deg in each
       face's own photograph (49.8-50.3 and 48.5-52.1): in plan along (-0.643, 0.766) on the top plate's side, as one sweep over the plate, the cocks and the barrel bridge
       (the photograph's stripes run on across them), and along (0.643, 0.766) on the dial side (each plate striped from its own face). Across each stripe the photograph's
       brightness, folded on its pitch and averaged over two patches (each to its brightest): from 1 down to 0.61 and back, a slow fall and a quick rise (G6: the gilt with that
       profile as its map; solidGeo's UVs are plan mm, (x, -z), the map's u the plan point along the stripes' normal over the pitch). The faces the photographs don't show
       (the plates' inner faces) take the same */
    const G6=(th)=>{const PR=[1.000,0.992,0.956,0.918,0.862,0.812,0.761,0.713,0.685,0.657,0.630,0.622,0.628,0.617,0.607,0.605,0.614,0.623,0.635,0.663,0.725,0.839,0.937,0.984],cv=document.createElement('canvas');cv.width=96;cv.height=4;
      const x=cv.getContext('2d');for(let i=0;i<96;i++){const f=i/4,k=Math.floor(f),t=f-k,g=Math.round(255*(PR[k]*(1-t)+PR[(k+1)%24]*t));x.fillStyle=`rgb(${g},${g},${g})`;x.fillRect(i,0,1,4);}
      const tx=new THREE.CanvasTexture(cv);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(1/3.95,1/3.95);tx.rotation=th;tx.anisotropy=8;tx.encoding=THREE.sRGBEncoding;
      const m=M.gilt.clone();m.map=tx;m.needsUpdate=true;return m;};
    const G6T=G6(-40*D2R),G6D=G6(40*D2R);
    /* the finishes are on the faces: a wall (a plate's edge, a cock's side, a hole's bore) takes one point of the tile, plain as the photographs' turned and filed edges */
    const faceUV=g=>{const N=g.attributes.normal.array,U=g.attributes.uv.array;for(let v=0,w=0;w<U.length;v+=3,w+=2)if(Math.abs(N[v+1])<0.7){U[w]=0;U[w+1]=0;}g.attributes.uv.needsUpdate=true;return g;};   /* the stripes' normal in UV (x, -z): (0.766, -0.643) on the top side, (0.766, 0.643) on the dial side */
    /* The drawings' versions' finish: gilt over a rippled, hammered-looking face, as Wempe 3955's plates and bridges (2_Wempe_3955_A.jpg, square-on at 0.111 mm/px,
       photocompare.py's fit): on its two plain patches (the top plate by 5, the barrel bridge) the brightness about its local mean varies 8.8 and 14.1 % (sd), the
       spectrum's mean wavelength 1.84 and 1.76 mm, weakly oriented (anisotropy 0.25, 0.20): wavy bands across the plan's z (along x) on plate and bridge alike. Its gilt
       more saturated than the wheels' (hue 0.10-0.11, saturation 0.60 against the render's 0.44 at the same patch, the photograph's exposure aside). Synthesised, not copied
       (the photographs aren't ours to put on the page): a 24 mm periodic tile of 96 waves of 1.3-2.4 mm within 15° of z, their phase warped by six slow waves (0.3 mm) so the
       bands wander, and a frosting of 64 faint waves of 0.3-0.55 mm any way, sd 7 % (the photograph's 9-14 % holds tarnish too), as the map's brightness and, through its slope, the normal map's relief; the specks and tarnish left out (as made). Until 18 October 2026 plain gilt */
    const GH=(()=>{const N=256,L=24;let sd=3955;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647,W=[],D=[];
      for(let i=0;i<96;i++){const k=L/(1.3+1.1*rnd()),a=(rnd()*30-15)*D2R;W.push([Math.round(k*Math.sin(a)),Math.round(k*Math.cos(a)),rnd()*TAU,0.5+rnd()]);}   /* the bands */
      for(let i=0;i<64;i++){const k=L/(0.3+0.25*rnd()),a=rnd()*TAU;W.push([Math.round(k*Math.sin(a)),Math.round(k*Math.cos(a)),rnd()*TAU,0.22*rnd()]);}   /* the frosting's grain, 0.3-0.55 mm, any way */
      for(let i=0;i<6;i++)D.push([1+Math.floor(rnd()*3),1+Math.floor(rnd()*3),rnd()*TAU]);
      const h=new Float32Array(N*N);let s=0,s2=0;
      for(let j=0;j<N;j++)for(let i=0;i<N;i++){const u=i/N,v=j/N;let dx=0,dz=0;D.forEach(([a,b,p],k)=>{const w=0.3/L*Math.sin(TAU*(a*u+b*v)+p);if(k%2)dz+=w;else dx+=w;});
        let t=0;for(const[a,b,p,m]of W)t+=m*Math.cos(TAU*(a*(u+dx)+b*(v+dz))+p);h[j*N+i]=t;s+=t;s2+=t*t;}
      const mu=s/(N*N),sg=Math.sqrt(s2/(N*N)-mu*mu),mk=()=>{const c=document.createElement('canvas');c.width=c.height=N;return c;},cm=mk(),cn=mk(),xm=cm.getContext('2d'),xn=cn.getContext('2d'),im=xm.createImageData(N,N),nm=xn.createImageData(N,N);
      const H=(i,j)=>(h[((j+N)%N)*N+(i+N)%N]-mu)/sg;
      for(let j=0;j<N;j++)for(let i=0;i<N;i++){const o=4*(j*N+i),g=Math.round(255*clamp(0.88*(1+0.07*H(i,j)),0,1)),gx=(H(i+1,j)-H(i-1,j))/2,gz=(H(i,j+1)-H(i,j-1))/2,k=0.01,l=Math.hypot(k*gx,k*gz,1);
        im.data[o]=im.data[o+1]=im.data[o+2]=g;im.data[o+3]=255;nm.data[o]=Math.round(255*(0.5-0.5*k*gx/l));nm.data[o+1]=Math.round(255*(0.5-0.5*k*gz/l));nm.data[o+2]=Math.round(255*(0.5+0.5/l));nm.data[o+3]=255;}
      xm.putImageData(im,0,0);xn.putImageData(nm,0,0);
      const tx=c=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1/L,1/L);t.anisotropy=8;return t;},mp=tx(cm);mp.encoding=THREE.sRGBEncoding;
      const m=M.gilt.clone();m.color=sc(0xc68c34);m.userData.faceOnly=1;m.roughness=0.42;m.map=mp;m.normalMap=tx(cn);m.normalScale=new THREE.Vector2(0.3,0.3);m.needsUpdate=true;M.giltH=m;return m;})();   /* M.giltH: named, so the tools' density tables (massprops, mechanisms, inertia) and the export know it */

    /* ================= the top plate (Oberplatte, 05 09 01; its assembly 05 08 01) ================= */
    /* Messingblech 4, Sonder Ms α-β (05 09 01's title block: rolled brass, from a 4 × 90 disc turned to 3.5 × 90): drawn gilt, as Wempe 3955's (2_Wempe_3955_A.jpg). 85 h6 × 3.35;
       the cut round the barrel milled 42.5 across about hole 45 ("vor dem Kalibrieren auf 42,5∅ fräsen", 05 08_1b), so the plate is a crescent, its horns where the cut leaves
       the rim (05 08_1b, _2; Wempe 3955's plate off, 12_ and 13_Wempe_3955_obere_Platte_*.jpg). Every hole of 05 09 01's table at its drilled, reamed or tapped size (sure) and
       the sheet's sections: L-M the pillar seats (Ø 8.6 × 0.3 in the inner face); A-B the steady pins' holes 6, 9, 41, 47, 50 reamed from the outer face and opened Ø 2.5 from the
       inner face to 1.6 deep, C-D 22 and 37 the other way (their pins come from the lower cock, under the plate); G-H hole 36 sunk Ø 6 H7 × 1.8 from the outer face for the lower
       cock's screw head; P-Q the escape wheel's setting at 26 (Ø 5.2 H7 from the inner face to 0.5 under the outer one, Ø 4.5 H7 through that, two M1.2 3.5 +0.05 either side
       along the O-W line); J-K a recess Ø 22 × 0.7 round the fusee's hole 10 in the inner face, its wall at 45° (dashed on 05 08_1b, seen on 13_…unten); the fusee bush's three
       M1.4 on a radius 5.2 ±0.05, 120° apart, the first toward N (05 08_1b; the transcription's "2,65" there is the 22,65 from hole 1). The balance's opening 23 (Ø 10 with a
       tongue 2.5 wide) and, in the inner face, the pocket N-O for the balance holding work: from the opening to hole 51 with its end r 4 about it (read "4ʳ"; the
       transcription's "4,7 r" is the 4 and its arrowhead), its two dashed edges the common tangents of the opening's r 5 and that r 4 (traced on 05 08_1b at 4:1: the edges
       converge 4-5° each side of the 23-51 line, the upper one 5.0 from 23 and 3.9 from 51), so 10 wide at 23 narrowing to 8 at 51 (13_…unten shows it tapering, about
       9.4 to 7.5 scaled: sure); until 15 October 2026 drawn 8 wide throughout. 1.35 -0.05 deep (Schnitt N-O). The Hilfslöcher 3, 12, 40, Ø 3.50 (read until 16 October 2026 as
       Altmeppen's three small windows by the pillars, which he says the 6MX lacks; Kirov No. 247 has all three: README, The Soviet 6MX) */
    const tp=part('topPlate',-40);
    for(const[V,P39,DR]of VER){const y0=TT,y1=TI,F=[];
      const out=KIT.subtractCircle(C([0,0],R,1200),H[45],42.5/2);
      for(const k of[1,35,38])F.push(T(H[k],rJ,y0,y1));                                  /* 4.4 punched, 4.59 +0.012 reamed: the centre, seconds and intermediate wheels' settings (WN-301, WN-300: 05 08 01) */
      for(const k of[3,12,40])F.push(T(H[k],rH35,y0,y1));                                /* Hilfslöcher, 3.50 +0.012 */
      F.push({p:C(H[4],2.15,60),q:C(H[4],1.2,60),a:y0,b:y0+0.55},{p:C(H[4],1.2,60),q:C(H[4],0.45,60),a:y0+0.55,b:y0+0.95},{p:C(H[4],0.45,60),a:y0+0.95,b:y1});   /* hole 4's oil sink on the outer face, Ø 4.3 (Wempe 3955, 2_Wempe_3955_A.jpg: spherical, the pivot bright in it; its depth estimated, as the bushes' sinks; two cones for the sphere) */
      F.push(T(H[5],rM17,y0,y1),T(H[7],1.609/2,y0,y1),T(H[51],rM2,y0,y1),T(H[52],rM2,y0,y1));if(DR)F.push(T(H[13],1.8/2,y0,y1),T(H[53],1.5045/2,y0,y1));else F.push(T(WESC.HOLES.block6.stud,rH35,y0,y1),...WD.CONTACT6.access.map(q=>T(q,rH35,y0,y1)));   /* the 6MX: no 13, the detent block's stud in a Ø 3.5 2.2 S of it (Kirov No. 247: WESC.HOLES.block6); the Ø 3.5 access holes over its contact's base screws (2_Kirow_247_A.jpg: the screws' heads seen 19 down through them; Kirov 1564's, without the contact, open to the plate: likely) */   /* 4 drilled 0.9; 5 M1.7; 7 the stop pin's 1.6 +0.009; 13 drilled 1.8 (the detent block's screw passes); 51, 52 M2; 53 1.5 H7 */   /* 53 not in the 6MX (Kirov No. 247's plate is bare there, in plain view: likely) */
      for(const k of[8,42,48])F.push(T(H[k],rM26,y0,y1));                                /* the upper cock's and the barrel bridge's screws, M2.6 */
      for(const k of[6,9,41,47,50])F.push(T(H[k],rPinP,y0,y1),B(H[k],2.5/2,y1,1.6));   /* steady pins from above, the holes opened from below (A-B) */
      for(const k of[22,37])F.push(T(H[k],rPinP,y0,y1),A(H[k],2.5/2,y0,1.6));           /* steady pins from below (C-D) */
      F.push(T(H[36],2.8/2,y0,y1),A(H[36],6.012/2,y0,1.8));                              /* the lower cock's screw, its head sunk (G-H) */
      for(const q of[H[11],P39,H[49]])F.push(T(q,WD.PIL_HOLE,y0,y1),B(q,WD.PIL_SEAT[0],y1,WD.PIL_SEAT[1]));
      F.push(T(H[26],4.506/2,y0,y1),{p:C(H[26],5.206/2),a:y0+0.5,b:y1});                 /* P-Q */
      for(const q of DR?WESC.HOLES.blockPins:WESC.HOLES.block6.pins)F.push({p:C(q,0.7,40),q:C(q,0.4625,40),a:y0,b:y0+0.24},{p:C(q,0.4625,40),a:y0+0.24,b:y1});   /* the detent block's steady pins Ø 0.9 (05 04 01-4), 1.3 into the plate: not in its table, drilled at assembly through the plate and countersunk Ø 1.4 on its outer face, as Wempe 3955's (2_Wempe_3955_A.jpg, 8.81 px/mm: 10.7 apart, the model's 10.8; likely); blind from the inside until 16 October 2026 */
      for(const s of[-1,1])F.push(T(add(H[26],[1,0],3.5*s),rM12,y0,y1));
      {const n=176;F.push(T(H[10],8.0075/2,y0,y1),{p:C(H[10],11,n),q:C(H[10],11.7,n),a:y1-0.7,b:y1});   /* the fusee bush's hole 8.0 +0.015; J-K's recess Ø 22 at its floor, its wall opening at 45° to the face (P1c: the fusee's cover plate, Ø 21.1, lies in it; read until then as Ø 22 at the face, its floor Ø 20.6, which the plate can't enter) */
        for(const b of[0,120,240])F.push(T(add(H[10],brg(b),5.2),rM14,y0,y1));}
      /* the balance's opening and the pocket, crossed (KIT.bool) so their outlines share their corners: the tongue's root on the opening's edge 50° round from the pocket's
         line (N-O, 23 to 51), toward S ("50°" on 05 08_1b); its end 8.6 from 23's centre toward 112.5°, scaled on 05 08_1b (115°) and Wempe 3955's top face (110°): estimated */
      const b51=bearing(sub(H[51],H[23])),tg0=add(H[23],brg(b51+50),5),tgE=add(H[23],brg(112.5),8.6-1.25),tu=unit(sub(tgE,tg0));
      /* the pocket: the hull of 51's r 4 and the opening's r 5, the far side's tangent drawn from r 4.95 so it crosses the opening's edge cleanly, the tongue's side's from where
         the tangent to r 5 meets the tongue's edge (X, just past the tongue's corner on the circle: the tangent passes 0.08 outside that corner, which would leave a sliver of floor) */
      const a0=add(tg0,tu,-2),key=bool(C(H[23],5,200),stadiumPts(a0,tgE,2.5)).uni[0],ua=unit(sub(H[51],H[23])),va=[-ua[1],ua[0]],dv=q=>(q[0]-H[23][0])*va[0]+(q[1]-H[23][1])*va[1],sT=Math.sign(dv(tgE));
      const D5=Math.hypot(H[51][0]-H[23][0],H[51][1]-H[23][1]),w5=add(ua.map(q=>q/D5),va,sT*Math.sqrt(1-1/D5/D5)),T5=add(H[23],w5,5),ld=[-w5[1],w5[0]],nt=[-tu[1],tu[0]];   /* w5: from 23 to the tangent's point on r 5 (u·w = (5-4)/D) */
      const X=[-1,1].map(s=>{const p=add(a0,nt,1.25*s),r=sub(T5,p),k=(r[0]*ld[1]-r[1]*ld[0])/(tu[0]*ld[1]-tu[1]*ld[0]);return{k,x:add(p,tu,k)};}).find(o=>o.k>0&&o.k<Math.hypot(...sub(tgE,a0))).x;
      const pk=bool(key,KIT.hull([...C(H[23],4.95,200).filter(q=>dv(q)*sT<=0),X,...C(H[51],4,160)])),U=pk.uni[0],fl=pk.dBA.sort((a,b)=>Math.abs(area(b))-Math.abs(area(a)));
      if(pk.uni.length!==1||fl.length!==1)console.warn('topPlate: the pocket and the balance opening cross in',pk.uni.length,'and',fl.length,'loops');
      F.push({p:pk.A2,a:y0,b:y1},{p:U,a:y1-1.35,b:y1,floorOut:fl[0]});
      tag(mesh(rv(tp,V),faceUV(solidGeo([{loop:out,y0,y1,F}])),DR?GH:G6T),'050901');}
    /* its pillar screws (WN-57) from its outer face into the pillars' tapped ends (PSCR), brass as Wempe 3955's (39's in each version's group) */
    const S=WD.PSCR,P3=(par,f)=>{for(const q of[H[11],H[49]])f(par,q);for(const[V,P39]of VER)f(rv(par,V),P39);};
    /* the 6MX's (Kirov No. 247's) are polished steel with domed heads (its A, N, O and W photographs, photocompare.py: sure), lower than the drawings' brass cheese heads: 2.4
       overall, the dome rising 0.8 over the rim (4_Kirow_247_N.jpg: the side and the dome against the model's 3.0 head of the same width, ±0.3: estimated) */
    for(const[V,P39]of VER)for(const q of[H[11],H[49],P39]){const six=V==='6mx';tag(screw(rv(tp,V),q[0],q[1],TT,S.r,six?2.4:S.h,S.len,S.rs,six?M.steel:M.brass,six?0.8:0),'WN-57');}

    /* the maker's engraving on the top plate's outer face, as Wempe 3955's (2_Wempe_3955_A.jpg, square-on at 7.74 px/mm by the plate's 85, the centre found from holes 10 and 23;
       15_Wempe_3955_Logo_plus.jpg close): three lines reading along O with N up, centred at O 30.6, N 8.6: "Gerhard D." 8.7 long, its letters 1.2 high; "WEMPE" 9.85 long,
       1.7 high (outlined capitals on the plate: drawn filled); "Hamburg" 7.4 long, 1.2 high; the lines 1.9 apart (likely). Not on the sheets. A decal on the face */
    {const k=60,W=12,Hh=6.4,c=document.createElement('canvas');c.width=W*k;c.height=Hh*k;const x=/** @type {CanvasRenderingContext2D} */(c.getContext('2d'));
      x.fillStyle='rgba(58,40,14,0.78)';x.textAlign='center';x.textBaseline='middle';
      for(const[t,dv,len,h,wt]of/** @type {[string,number,number,number,number][]} */([['Gerhard D.',-1.9,8.7,1.2,500],['WEMPE',0,9.85,1.7,700],['Hamburg',1.9,7.4,1.2,500]])){
        x.font=`${wt} ${h/0.72*k}px "Instrument Sans", Arial, sans-serif`;x.save();x.translate(W/2*k,(Hh/2+dv)*k);fillTracked(x,t,len*k,0.8);x.restore();}
      const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
      const m=new THREE.MeshStandardMaterial({map:t,transparent:true,metalness:0.6,roughness:0.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});m.userData.inkDecal=true;
      const g=new THREE.PlaneGeometry(W,Hh);g.rotateX(Math.PI/2);g.rotateY(Math.PI);   /* facing out of the plate (−y); its text along −x (O), up toward −z (N) */
      const e=mesh(rv(tp,'last first 1943'),g,m,-30.6,TT-0.01,-8.6);e.userData.decal=1;   /* Wempe's, so the drawings' versions only (not the Soviet 6MX's plate) */e.userData.noShadow=1;e.userData.noCap=1;tag(e,'050901',1);}

    /* ================= the pillar plate (Unterplatte, 05 08 02-1; its assembly 05 08 02) ================= */
    /* As the top plate's metal; 85 h6 × 3.35 (05 08 02-1's "3,35 ±0,02 stark" is struck with no legible replacement: likely). Every hole of its table (sure) but 56, 57
       ("nur bei Bedarf", the seconds contact's; not in Wempe 3955's plate). Its sections: E-F the pillar seats in the inner face; A-B the intermediate bridge's steady pins 29, 44 reamed from the
       dial face and opened Ø 2.5 × 1.6 from the inner face ("oben"); G-H hole 30's setting, Ø 5.2 H7 from the inner face to 0.5 above the dial face, Ø 4.59 H7 through that,
       its two M1.2 3.5 either side along the O-W line. 26 reamed 2.50 with two M1.2 3.5 either side on the line 37° below O toward S (05 08_3b). The opening for the intermediate
       wheel (38) milled Ø 24.5 ("vor dem kalibrieren auf 24,5 fräsen"; it scales 24.8), joined by the seconds arbor's hole 35 (punched 6.0) on its rim; hole 10, the fusee's, reamed 2.70
       ±0.009 in the table, is drawn 2.82 (P1c): the fusee arbor's pivot (05 06 04-1) is Ø 2.8 ±0.02 at its shoulder, 2.75 at the plate's dial face (1:70), so the table's 2.70 can't
       take it; opened to the pivot and 0.02, as reamed to the arbor at assembly (README, Unresolved); 23 drawn Ø 7 (the table
       punches it 4.4: the 7 drawn and labelled is taken). A notch at 6 o'clock in its rim for the pin that the movement ring's sheet drills across the joint at assembly (05 08 00-3,
       "wird bei Montage der Unterplatte gebohrt", Ø 1) */
    const pp=part('pillarPlate',0),pinAt=add([0,0],brg(180),R);
    for(const[V,P39,DR]of VER){const y0=0,y1=PPT,F=[],out=bool(C([0,0],R,720),C(pinAt,0.5,32,0.5)).dAB[0];
      F.push(T(H[1],rJ,y0,y1),T(H[2],rH35,y0,y1),T(H[3],rH35,y0,y1),T(H[4],0.9/2,y0,y1),T(H[10],2.82/2,y0,y1),T(H[12],rH35,y0,y1),T(H[40],rH35,y0,y1),T(H[19],rH35,y0,y1),
        T(H[23],7/2,y0,y1),T(H[45],2.90/2,y0,y1),T(H[26],2.50/2,y0,y1));
      for(const s of[-1,1])F.push(T(add(H[26],[-Math.cos(37*D2R),Math.sin(37*D2R)],3.5*s),rM12,y0,y1));
      F.push(B(H[26],4.6/2,y1,0.25));   /* the seat of the escape wheel's lower endstone's setting, Ø 4.6 × 0.25 in the dial face (Wempe 3955's dial side: escapement.js; not on the sheet) */
      for(const k of[28,43])F.push(T(H[k],rM26,y0,y1));
      for(const k of[29,44])F.push(T(H[k],rPinP,y0,y1),A(H[k],2.5/2,y0,1.6));
      F.push(T(H[30],rJ,y0,y1),{p:C(H[30],5.206/2),a:y0,b:y1-0.5});for(const s of[-1,1])F.push(T(add(H[30],[1,0],3.5*s),rM12,y0,y1));
      for(const q of[H[11],P39,H[49]])F.push(T(q,WD.PIL_HOLE,y0,y1),A(q,WD.PIL_SEAT[0],y0,WD.PIL_SEAT[1]));
      if(V==='6mx')for(const q of WD.CONTACT6.screws56)F.push(T(q,rM17,y0,y1));   /* the 6MX's electrical contact's base screws, M1.7 through (train.js; WD.CONTACT6) */
      F.push({p:twoCircles(H[38],24.5/2,H[35],6.0/2),a:y0,b:y1});
      /* the hand-setting work's cut and holes (Zeigerstellung, 05 33): the table's 14-18 are struck through, "nur wenn Zeigerstellung eingebaut wird", but Wempe 3955's plate
         is cut and drilled for it, every hole and the cut open, nothing fitted but a bush in 18 (3_Wempe_3955_uZ.jpg, 6_Wempe_3955_S.jpg, 8_Wempe_3955_Räderwerk_plus.jpg), and
         the plate's assembly (05 08 02) draws them so. 14, 15 drilled 1.45 (steady pins), 16, 17 drilled 2.8 (screws), 18 reamed 3.50 +0.012 (the setting pinion's bush: train.js).
         The cut, on the line from the centre through 18 (30.0° below O toward S), the four holes symmetric about it (05 08_3b's plan; 05 08_3a's partial plan and Schnitt C-D,
         along the cut, across the line; 05 08 02's Schnitt E-F): through the plate a window 6.5 square on the dial face (05 08_3b's two "6,5"), its outer edge 8.3 -0.1 from the
         rim ("8,3-0,1", drawn at its middle), widened along the cut to 12 +0.2 on the inner face (C-D's "12+0,2", drawn 12.1), each end a Ø 14 arc ("14∅") from one face's edge
         to the other's, hollow (the arcs traced on C-D at 9.74 px/mm bow 2-3 px into the metal; their sagitta 0.35); 05 08_3a's "9,3-0,1" is the inner face's end to the dial
         face's far edge (6.05 + 3.25). Wempe 3955's dial face measures the window 6.4 × 6.5 at 27.7-33.9 from the centre, its edges at 30.2° (the photograph fitted on the
         plate's holes 1, 12, 26, 30, 40, 0.3 mm rms): sure. Not cut: the bore Ø 2 at mid-thickness (C-D's circle, 1.68 from the dial face, and E-F's) from the window's outer
         wall to the rim (dashed on 05 08_3a), which solidGeo can't cut across the plate (its mouth shows on the rim's notch on 8_Wempe_3955_Räderwerk_plus.jpg); the notch in
         the rim where it leaves and the groove in the ring under it are Wempe 3955's (below and the movement ring's band), on no sheet */
      if(V!=='6mx'){   /* the 6MX's plate has none of it: Kirov 247's dial side (3_Kirow_247_uZ.jpg) is plain there, and Altmeppen lists no external hand-setting */
      for(const k of[14,15])F.push(T(H[k],1.45/2,y0,y1));
      for(const k of[16,17])F.push(T(H[k],2.8/2,y0,y1));
      F.push(T(H[18],rH35,y0,y1));
      {const eu=unit(H[18]),et=[-eu[1],eu[0]],P=(u,t)=>add(eu.map(q=>q*u),et,t),uo=R-8.25,ui=uo-6.5,tD=3.25,tI=12.1/2,rc=7;
        const L=Math.hypot(tI-tD,PPT),M=[(tI+tD)/2,PPT/2],nn=[PPT/L,(tI-tD)/L],h=Math.sqrt(rc*rc-L*L/4),Ct=M[0]-nn[0]*h,Cy=M[1]-nn[1]*h;   /* the end arcs' centre in (t, y), on the window's side of their chord */
        const tw=y=>Ct+Math.sqrt(rc*rc-(y-Cy)*(y-Cy)),K=6,Rk=[...Array(K+1).keys()].map(k=>{const t=tw(PPT*k/K);return[P(ui,-t),P(uo,-t),P(uo,t),P(ui,t)];});
        for(let k=0;k<K;k++)F.push({p:Rk[k],q:Rk[k+1],a:y0,b:k<K-1?PPT*(k+1)/K:y1});}   /* six cones nested from the inner face, the last through: the arcs in six chords */
      }
      if(/** @type {string} */(V).includes('first')){tag(mesh(rv(pp,V+' -3955'),faceUV(solidGeo([{loop:out,y0,y1,F}])),DR?GH:G6D),'050802-1');
        /* Wempe 3955's (the version as photographed) rim notched where the hand-setting cut's bore leaves it, on 18's line: a flat 0.33 deep (its middle at r 42.16) between
           ends 8.3 apart (8_Wempe_3955_Räderwerk_plus.jpg through photocompare.py's w3955_train camera, 0.07-0.27 mm on the plate's holes: the notch's top corners at r 42.25,
           8.3 apart, the bore's mouth in its face at r 42.16 on its middle line; 3_Wempe_3955_uZ.jpg, 8.42 px/mm, the plate's edge seen at r 42.17 where the ring's channel
           opens the lip, below; ±0.3: likely). On no sheet. The bore itself, across the plate, isn't cut (above) */
        const eu=unit(H[18]),et=[-eu[1],eu[0]],P=(u,w)=>add(eu.map(q=>q*u),et,w),nt=bool(out,[P(42.16,-4.15),P(44,-4.15),P(44,4.15),P(42.16,4.15)]).dAB[0];
        tag(mesh(rv(pp,'3955'),faceUV(solidGeo([{loop:nt,y0,y1,F}])),DR?GH:G6D),'050802-1');}
      else tag(mesh(rv(pp,V),faceUV(solidGeo([{loop:out,y0,y1,F}])),DR?GH:G6D),'050802-1');}
    /* its pillar screws (WN-56) from the dial side, in a frame turned over so their heads face +y */
    {const rg=new THREE.Group();rg.rotation.x=Math.PI;pp.add(rg);   /* the 6MX's polished steel (3_Kirow_247_uZ.jpg, photocompare.py: sure) */
      for(const[V,P39]of VER)for(const q of[H[11],H[49],P39]){const g=rv(rg,V);tag(screw(g,q[0],-q[1],-PPT,S.r,S.h,S.len,S.rs,V==='6mx'?M.steel:M.brass),'WN-56');}}

    /* ================= the pillars (Pfeiler, 05 08 00-1) ================= */
    /* turned brass (Rundmessing 8,5 Ms 58), the body Ø 8.1 for 19.6 between its shoulders, which sit in the plates' seats; a spigot Ø 4.5 f7 at each end, 2.8 long, its last 1.1
       turned to Ø 4.3 at 6°; tapped M2.6 through from both ends (drawn at the thread's size and 0.02, as the tapped holes), a 90° countersink at each end; a half-round relief
       groove in each shoulder's face round the spigot's root (drawn, not figured: WD.PIL.grv). One profile turned about the pillar's axis, its outer wall rising in y */
    {const P=WD.PIL,yb=WD.PIL_SEAT[1],yt=TI-WD.PIL_SEAT[1],e0=yt-P.sL,e1=yb+P.sL,rb=S.rs+0.02,cd=P.cs-rb,[gr,gd]=P.grv,gc=(P.sr+gr)/2,ga=(gr-P.sr)/2;
      const grv=(y,s)=>[...Array(9).keys()].map(i=>{const t=Math.PI*(1-i/8);return V2(gc+ga*Math.cos(t),y+s*gd*Math.sin(t));});   /* from the spigot out (s: into the body, +1 at the top shoulder) */
      const prof=[V2(P.cs,e0),V2(P.tip[0],e0),V2(P.sr,e0+P.tip[1]),...grv(yt,1),V2(P.r,yt),V2(P.r,yb),...grv(yb,-1).reverse(),V2(P.sr,e1-P.tip[1]),V2(P.tip[0],e1),V2(P.cs,e1),V2(rb,e1-cd),V2(rb,e0+cd),V2(P.cs,e0)];
      const pil=part('pillars',-20),pg=new THREE.LatheGeometry(prof,64);P3(pil,(g,[x,z])=>tag(mesh(g,pg,M.brass,x,0,z),'050800-1'));}

    /* ================= the movement ring (Werkring, 05 08 00-3, as revised 6.12.46) ================= */
    /* The pillar plate sits in its seat (Ø 85 H9, 3 +0.1 deep) on a lip (Ø 83), the plate 0.35 proud of the ring's inner face (the coloured section, Wempe_Einheitschronometer.jpg,
       left and right ends); below the lip a 45° cone opens to Ø 93 at the dial's recess (Ø 104 +0.1, 0.7 +0.1 deep) in the flange's face; the flange Ø 105.95 -0.1 and 4.7 high, the
       ring under it Ø 96 -0.3; 10.7 -0.1 overall, 7 -0.1 from the recess's floor to the seat's. Three M2.6 on Ø 89, 120° apart, at 340°, 100°, 220° (the sheet drawn from the
       dial side, 20° from 12; Wempe 3955's three brass heads on the plate's rim at 339°, 99°, 218°, 2_Wempe_3955_A.jpg): their screws' heads bear on the plate's rim and hold it
       in the seat. The dial's pin hole at r 50.5, 6° from 12 toward 3 ("wird bei Montage des Zifferblattes gebohrt"), Ø 1.1 (the section's dashed
       pair, 4.7 off the axis as 50.5 sin 6° puts it, is figured "1,1 Ø"; the plan's "1,6" is across the radial hole at 12, below: sure; drawn Ø 1.6 until 15 October 2026),
       the dial's pin (dial.js) in it; the plate's pin hole Ø 1 at 6 o'clock across the
       seat's wall. Its depths below the lip, the cone's run and the screws' are not figured: the 7 and 0.7 put the lip's floor at 3.35 below its inner face, so the cone, from the
       lip's Ø 83 at 45° to Ø 93, starts 2.0 below the seat (the coloured section draws about 2); the plate's pin 5.35 long, to the cone (the section draws it 7.6, which would
       cross the cone); the M2.6 holes 6.0 deep (to the flange): estimated. Material not given ("——"); Wempe 3955's is nickel-bright: drawn nickel, estimated. Its radial pin
       to the case (P1f, below) */
    const rg=part('ring',12);
    {const nS=840,nC=600,c41=C([0,0],83/2,nC),bb=bool(C([0,0],85.0175/2,nS),C(pinAt,0.5,40,0.5));
      /* the screws' places: the drawings' 340, 100, 220; the Soviet 6MX's 342.2, 102.2, 246.4 ±0.5 (Kirov No. 247: 2_Kirow_247_A.jpg and 3_Kirow_247_uZ.jpg, holemap.py
         --model wempe on each at 8.89 and 8.57 px/mm, the two faces agreeing; Kirov 009 and Poljot 20027 the same: sure), so 120°, 144° and 96° apart; the band built per version */
      const RSV=/** @type {[string,number[]][]} */([['last first 1943',[340,100,220]],['6mx',[342.2,102.2,246.4]]]),RS={};for(const[V,b]of RSV)RS[V]=b;
      for(const[V,BS]of RSV){const band={loop:C([0,0],96/2,nS),y0:0.35,y1:6.35,F:[{p:bb.uni[0],a:0.35,b:3.35,floorOut:bb.dAB[0]},{p:bb.B2,a:0.35,b:5.35},{p:c41,a:0.35,b:6.35},{p:c41,q:C([0,0],42.5,nC),a:5.35,b:6.35},
        ...BS.map(b=>T(add([0,0],brg(b),89/2),rM26,0.35,6.35))]};   /* Wempe 3955's dial side shows them through, opening in the flange's cone (3_Wempe_3955_uZ.jpg: likely); a vertical hole through the cone's slope is more than solidGeo cuts: left at the flange (README, Unresolved) */
      tag(mesh(rv(rg,V==='6mx'?V:V+' -3955'),solidGeo([band]),V==='6mx'?M.gilt:M.plateSolid),'050800-3');}
      /* Wempe 3955's (the version as photographed) band: a groove across it on the hand-setting cut's line (through 18), under the plate's notch (above), from the lip out
         through the band's outside, for the hand-setting's shaft: straight sides, a round floor, closed in the band (the user's reading of 8_, 18 October 2026), which passes
         under the lip's drawn cone near its inner edge and so opens the lip there. 8_Wempe_3955_Räderwerk_plus.jpg through photocompare.py's w3955_train camera: its top edges
         9.0-9.1 apart (unprojected on the band's top face); its sides straight down to 2.05-2.63 under the plate's inner face (unprojected on their planes); its profile on the
         band's outside (unprojected on r 48) straight to 2.4, then round to its bottom at 6.07-6.11; 3_Wempe_3955_uZ.jpg, the dial side: the lip opened over 4.4 at its inner
         edge, the plate's rim showing to r 42.17 there (8.42 px/mm): likely. A circle through the sides' foot and the bottom: r 4.565 about an axis 1.54 under the face (the
         bore's, 05 08_3a, is 1.67), the floor 0.25 above the band's underside; the lip opened to r 42.25, 5.0 wide. On no sheet (05 08 00-3). The band in cells: outside the
         seat (its screws' holes), the lip under the plate (its drawn cone a sloped underside), the pin's notch, and the groove's floor in strips across it, each in the band
         and under the lip */
      {const eu=unit(H[18]),et=[-eu[1],eu[0]],P=(u,w)=>add(eu.map(q=>q*u),et,w),Wo=(/** @type {number[]} */p)=>p[0]*et[0]+p[1]*et[1],Uo=(/** @type {number[]} */p)=>p[0]*eu[0]+p[1]*eu[1];
        const ya=1.54,Rc=4.565,wm=4.5,yf=(/** @type {number} */w)=>ya+Math.sqrt(Rc*Rc-w*w),cc=(/** @type {number[][]} */L)=>area(L)>0?L:L.slice().reverse();
        const we=Math.sqrt(Rc*Rc-(5.30-ya)**2),ri=(/** @type {number} */w)=>41.5+yf(w)-5.35+0.05;   /* under the lip the floor meets its cone at r 41.5 + (yf - 5.35): the opening, its edge 0.05 thick */
        const rect=[P(40,-wm),P(48.6,-wm),P(48.6,wm),P(40,wm)],C48=C([0,0],96/2,nS),C41=c41,SP=bb.dAB[0];
        const main=bool(C48,bool(bb.uni[0],rect).uni[0]).dAB[0],lip=bool(bb.dAB[0],bool(C41,rect).uni[0]).dAB[0];
        const yc=(/** @type {number[]} */p)=>Math.min(6.35,5.35+(Math.hypot(p[0],p[1])-41.5));   /* the drawn cone under the lip: Ø 83 at 5.35 to Ø 85 at 6.35 */
        const cells=/** @type {any[]} */([{loop:cc(main),y0:0.35,y1:6.35,F:RS['last first 1943'].map(b=>T(add([0,0],brg(b),89/2),rM26,0.35,6.35))},{loop:cc(lip),y0:3.35,y1:yc},{loop:cc(bb.B2),y0:5.35,y1:yc}]);
        const on=(/** @type {number[][]} */L,/** @type {number} */w)=>L.filter(p=>Math.abs(Wo(p)-w)<1e-7&&Uo(p)>0).sort((a,b)=>Uo(a)-Uo(b));
        const cross=(/** @type {number[][]} */L,/** @type {number} */w)=>{for(let i=0;i<L.length;i++){const p=L[i],q=L[(i+1)%L.length],a=Wo(p)-w,b=Wo(q)-w;if(a*b<0&&Uo(p)>0){const t=a/(a-b);return[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];}}return[0,0];};
        const among=(/** @type {number[][]} */L,/** @type {number} */w0,/** @type {number} */w1)=>L.filter(p=>Uo(p)>0&&Wo(p)>Math.min(w0,w1)&&Wo(p)<Math.max(w0,w1)).sort((a,b)=>(Wo(a)-Wo(b))*(w1>w0?1:-1));
        /* each strip edge's points: [the lip's inner edge (or the opening's), the seat, the band's outside]; at the groove's sides the bool loops' own points, shared with the lip's and band's cells */
        const E=(/** @type {number} */w)=>Math.abs(w)===wm?[on(lip,w)[0],on(main,w)[0],on(main,w)[1]]:[Math.abs(w)<we?P(Math.sqrt(ri(w)**2-w*w),w):cross(C41,w),cross(SP,w),cross(C48,w)];
        const WS=[0,0.5,1.0,1.5,1.9,we,2.7,3.1,3.5,3.85,4.2,wm],y0=(/** @type {number[]} */p)=>yf(Math.min(wm,Math.abs(Wo(p))));
        for(const s of[-1,1])for(let k=0;k<WS.length-1;k++){const w0=s*WS[k],w1=s*WS[k+1],A=E(w0),B=E(w1),inner=Math.abs(w1)<=we+1e-9?[]:among(C41,w0,w1);
          cells.push({loop:cc([A[1],...among(SP,w0,w1),B[1],B[2],...among(C48,w1,w0),A[2]]),y0,y1:6.35});   /* in the band */
          cells.push({loop:cc([A[0],...inner,B[0],B[1],...among(SP,w1,w0),A[1]]),y0:(/** @type {number[]} */p)=>Math.max(3.35,y0(p)),y1:yc});}   /* under the lip, from the plate's seat down */
        tag(mesh(rv(rg,'3955'),solidGeo(cells),M.plateSolid),'050800-3');}   /* the 6MX's gilt brass (Kirov No. 247's A, N and W photographs, photocompare.py: sure; nickel until 18 October 2026) */
      const FLG=[];   /* each version's flange, the pin pressed across it with it (fine.py takes pieces fixed to each other by their shared group) */
      for(const[V,AS]of/** @type {[string,number[]][]} */([['last first 1943',[354,120,240]],['6mx',[354,114,234]]])){   /* the 6MX's dial screws at 114, 234 and 354 (dial.js) */
      const fl={loop:C([0,0],105.95/2,1000),y0:6.35,y1:11.05,F:[{p:C([0,0],42.5,nC),q:C([0,0],93/2,nC),a:6.35,b:11.05},{p:C([0,0],104/2,1000),a:10.35,b:11.05},T(add([0,0],brg(-6),50.5),1.1/2,6.35,11.05),
        ...AS.map(a=>{const rD=V==='6mx'?49.9:50.5;return{p:C([rD*Math.sin(a*D2R),-rD*Math.cos(a*D2R)],0.52),a:6.35,b:11.05};})]};   /* the 6MX's on r 49.9 (dial.js) */   /* the dial screws' M1 through the flange: they show on its underside in Wempe 3955's top plate photograph (2_Wempe_3955_A.jpg: likely; 2.5 deep until 16 October 2026) */   /* the dial's three screws (05 02 00-4: at 354, 120 and 240 deg from 12 seen from the dial, r 50.5), tapped M1 2.5 deep into the recess's floor (not on the ring's sheet, drilled at assembly as its dial pin hole: estimated; P1e) */
      const gF=rv(rg,V);FLG.push(gF);tag(mesh(gF,solidGeo([fl]),V==='6mx'?M.gilt:M.plateSolid),'050800-3',1);}
      /* its three screws (WN number not read): heads Ø 6.2 × 3.05, brass, the shank 6.3, on the coloured section (Wempe_Einheitschronometer.jpg px 1819-1878 × 510-538.5, its
         shank 1837-1862: Ø 6.28 (6.2 kept, within the reading) × 3.07, M2.6, at 9.37 px/mm by the pillar's 178 px for 19; sure on the section, 2.25 high until 17 October 2026); head on the plate's inner face */
      for(const b of RS['last first 1943']){const q=add([0,0],brg(b),89/2);headOn(tag(screw(rv(rg,'last first 1943'),q[0],q[1],0,3.1,3.05,6.3,1.3,M.brass),'WN-rs'),'ring','pillarPlate');}
      /* the 6MX's: steel, slotted, their heads Ø 6.1 ±0.2 × 2.0 ±0.2 (6_Kiro_247_S.jpg, 7_Kirow_247_W.jpg, scaled by pillar 39: likely), M2.6; drawn Ø 6.2, inside the
         reading, as the drawings' (their heads reach over the plate's rim by 1.1, which the photographs show them doing, bearing on it) */
      for(const b of RS['6mx']){const q=add([0,0],brg(b),89/2);headOn(tag(screw(rv(rg,'6mx'),q[0],q[1],0,3.1,2.0,6.3,1.3,M.steel),'WN-rs'),'ring','pillarPlate');}
      tag(cylBetween(rg,0.49,0.1,5.35,M.steel,pinAt[0],pinAt[1],12),'WN-201');   /* the plate's pin (Stellstift WN-201 in the coloured section), Ø 1, its top 0.1 under the plate's face (drawn flush: estimated) */
      /* its radial pin to the case (Stellstift 3, WN-202 in the coloured section; P1f): in the radial hole at 12 o'clock, Ø 1.6 at 2.8 from the dial's face (05 08 00-3: the plan,
         drawn from the dial side under the section (first angle), draws it at 12 as a dashed pair across the ring figured "1,6"; the section draws it end on, ⊙ 2.8 under the
         top face on its centre line; sure for the place, likely for the size). Wempe 3955 shows its end on the ring's 45° cone at 12 (3_Wempe_3955_uZ.jpg, about r 44-46; the
         hole meets the cone at r 44.4). It stands 2.0 out of the flange (the coloured section, 9.4 px/mm: 2.0) into the notch in the bezel's recess (case.js), which sets the
         movement's turn in the case; its inner end at r 45.3, inside the cone's face (45.2 at the pin's top edge), 9.7 long, its hole across the turned flange not cut
         (estimated). Until 15 October 2026 drawn Ø 1.1 at 6 o'clock (the sheet's hole Ø 1.1 and its "1,6" read the other way round, and the plan's top taken for 6) */
      for(const g of FLG){const p=tag(cylBetween(g,0.8,45.3,55.0,M.steel,0,0,16),'WN-202');p.rotation.x=Math.PI/2;p.position.set(0,11.05-2.8,-(45.3+55.0)/2);}}

    /* ================= the barrel bridge (Federhausbrücke, 05 08 05-1; kompl. 05 08 05) ================= */
    /* Messingblech 3,5 Ms 58, 3.32 -0.04 thick, on the top plate's outer face over the barrel. Its outer edge the plate's rim ("mit der Oberplatte überdrehen"), its inner edge a
       straight chord, 7 from hole 45 and 7.7 from hole 42 (both figures' extension lines run parallel to the chord, so each is the hole's distance square to it), which puts it
       18.493 from the centre: the greatest width 24.002 (the sheet's 24), all three figures to 0.002 (sure). The sheet draws it so (its 2:1 view, measured at 4.87 px/mm by its
       holes' spacing: 45 7.10, 42 7.59, 48 6.84 from the drawn chord; this chord 7, 7.7, 6.71). The short edge at the top at 150° to the chord, 5 from hole 48 (the "5": its
       extension lines run parallel to the short edge, through 48 and the corner on the rim; Wempe 3955, 2_Wempe_3955_A.jpg, 4.95 by a line fitted to the edge, 150.2°), which
       leaves the sheet's 73.5 from the point at 6 o'clock's end to the corner 73.31 (the "5" and the 150° taken, as the figures a maker would work to; likely). Wempe 3955's
       chord, fitted to the edge (0.5 px rms) and carried onto the sheet's frame by similarities on its screws: 18.43-18.66 from the centre, its normal 14.35-14.46° N of W
       against this chord's 14.94 and the earlier 13.61 (45 7.0, 42 7.8-8.0, 48 6.3-6.6 from it): between the two, so the sheet decides. Until 15 October 2026 the chord was
       drawn square to hole 45's line at 18.5 (42 then 8.29 from it), the 7.7 read along the chord from the point to pin 41 and the "5" as the corner's offset from the chord,
       which put 48 4.5 from the short edge. Holes: 45 the barrel arbor's, 3.9 ±0.01; 46 the click's screw, M2.6; 42, 48 clear 2.8 for its screws; 41, 47
       its steady pins, 1.585 -0.005, 2.5 deep (their holes' 90° countersink 0.3: in since 16 October 2026). Drawn gilt */
    const bb=part('barrelBridge',-52),BBG=VER.map(([V])=>rv(bb,V));   /* each version's bridge (the 6MX's striped) with its pins in one group */
    {const dt=(p,q)=>p[0]*q[0]+p[1]*q[1],sc=(p,k)=>[p[0]*k,p[1]*k],v=sub(H[45],H[42]),l=Math.hypot(v[0],v[1]),u=sc(v,1/l),ca=-0.7/l;   /* n·(45 − 42) = 7 − 7.7 */
      const n=/** @type {number[]} */([-1,1].map(s=>add(sc(u,ca),[-u[1],u[0]],s*Math.sqrt(1-ca*ca))).find(q=>dt(q,H[45])>0)),c=dt(n,H[45])-7,t=(q=>q[1]<0?q:[-q[0],-q[1]])([n[1],-n[0]]);
      const c30=Math.cos(30*D2R),e=add(sc(t,c30),n,0.5),m=add(sc(t,-0.5),n,c30),kE=dt(m,H[48])-5*Math.sign(dt(m,H[45])-dt(m,H[48]));   /* the short edge: along e, m·p = kE, 5 beyond 48 */
      const Bp=add(sc(n,c),t,-Math.sqrt(R*R-c*c)),Tp=[1,-1].map(s=>add(sc(m,kE),e,s*Math.sqrt(R*R-kE*kE))).sort((a,b)=>dt(b,n)-dt(a,n))[0],Cp=add(sc(n,c),t,2*(c30*c-kE));
      const aB=Math.atan2(Bp[1],Bp[0]),aT=Math.atan2(Tp[1],Tp[0]),an=Math.atan2(n[1],n[0]);let da=((aT-aB)%TAU+TAU)%TAU;if(Math.abs(((an-aB)%TAU+TAU)%TAU)>da)da-=TAU;   /* round the rim through n */
      const N=Math.ceil(Math.abs(da)*R/0.1),arc=[...Array(N-1).keys()].map(i=>{const a=aB+da*(i+1)/N;return[R*Math.cos(a),R*Math.sin(a)];});
      const y0=TT-3.32,y1=TT,F=[T(H[45],3.9/2,y0,y1),T(H[46],rM26,y0,y1),T(H[42],rCl26,y0,y1),T(H[48],rCl26,y0,y1),...[41,47].flatMap(k=>[{p:C(H[k],rPinQ,40),a:y1-2.5,b:y1-0.3},{p:C(H[k],rPinQ,40),q:C(H[k],rPinQ+0.3,40),a:y1-0.3,b:y1}])];   /* the steady pins' holes' 90° countersink 0.3 (05 08_13) */
      const bg=faceUV(solidGeo([{loop:[Bp,...arc,Tp,Cp],y0,y1,F}]));VER.forEach(([,,DR],i)=>tag(mesh(BBG[i],bg,DR?GH:G6T),'050805-1'));PL.bbChord=[Bp,Cp];}
    /* its screws (WN-55 in the coloured section): heads Ø 6.4 × 3.0, brass (Wempe 3955), the shank 6.2, through the bridge and 2.9 into the plate: scaled on the coloured section (estimated) */
    VER.forEach(([V],i)=>{const six=V==='6mx';for(const k of[42,48])tag(screw(BBG[i],H[k][0],H[k][1],TT-3.32,3.2,six?2.4:3.0,6.2,1.3,six?M.steel:M.brass,six?0.8:0),'WN-55');});   /* the 6MX's steel and domed, as its top plate's (above) */
    /* its steady pins (WN-203, 05 08 05): Ø 1.6, 1.3 proud of its face (sure), 3 long (as the balance cock's on 127-556.04 U30: estimated) */
    for(const g of BBG)for(const k of[41,47])tag(cylBetween(g,rPin,TT-1.7,TT+1.3,M.steel,H[k][0],H[k][1],16),'WN-203.bb');
    /* the click (Sperrkegel, 05 08 05-2, revised 25.5.48): Messingblech 3 Ms 58 federhart, so its own spring (no separate spring is drawn); 2.6 -0.03/-0.05 thick on the bridge's
       face, turning on a shouldered screw (WN-22) in hole 46. Its outline in its own frame (x from its hole toward its nose, y away from its base line), from 05 08 05-2 at 5:1:
       the hole Ø 3.2 +0.03; 17.4 long; the base 2.85 under the hole (the thin circle "Ø 5,7" about the hole, tangent to it: 2.81 scaled until 16 October 2026); the nose r 1 at
       7.5 from the hole; the beak 3.5 high at the base's other end, its end face at 85° to the base leaning toward the hole as it rises (the "85°", its arc about the beak's foot;
       82.4° until 16 October 2026), its tip 9.7 from the hole; under it the hollow r 6 about a point 5.142 back and 7.212 under the hole (sure), which meets the base 9.69 from the
       hole, the tip's "9,7"; the back an arc r 12.5 (sure), its centre traced on the sheet (a circle fitted to 37 points along it, 0.05 mm rms: 1.53 back, 9.55 under the hole) and
       moved 0.12 (to 1.599 back, 9.455 under) so that it passes through the beak's top corner, which the figures put 0.12 outside the traced arc. Its beak toward the barrel's ratchet: its base line at 23.3° from N toward O, traced on Wempe 3955's
       (2_Wempe_3955_A.jpg, ±3°: the nose's centre lands at 37.3° from the hole, where the photograph has it, 37.5°) */
    {const yb=-5.7/2,c6=[-5.142,-7.212],cn=[Math.sqrt(7.5**2-(yb+1)**2),yb+1],tB=[c6[0]-Math.sqrt(36-(yb-c6[1])**2),yb],tC=[tB[0]+3.5/Math.tan(85*D2R),yb+3.5],
      c12=(u=>[tC[0]+12.5*u[0],tC[1]+12.5*u[1]])((d=>[d[0]/Math.hypot(...d),d[1]/Math.hypot(...d)])([-1.53-tC[0],-9.55-tC[1]]));   /* the traced centre moved along its radius to the corner */
      const ln=(p,q,x)=>{const d=[q[0]-p[0],q[1]-p[1]],l=Math.hypot(d[0],d[1]);return((x[0]-p[0])*d[1]-(x[1]-p[1])*d[0])/l;};   /* + right of p to q */
      const f=x=>Math.max(Math.hypot(x[0]-c12[0],x[1]-c12[1])-12.5,yb-x[1],6-Math.hypot(x[0]-c6[0],x[1]-c6[1]),-ln(tB,tC,x),Math.min(x[0]-cn[0],Math.hypot(x[0]-cn[0],x[1]-cn[1])-1));
      const loc=sdfOutline((x,z)=>f([x,z]),-10,-4,9,4,0.02),ex=brg(23.3),ey=brg(23.3-90),pl=p=>add(add(H[46],ex,p[0]),ey,p[1]);
      const ck=loose(new THREE.Group(),4);bb.add(ck);const y0=TT-3.32-2.6,y1=TT-3.32;
      tag(mesh(ck,solidGeo([{loop:loc.map(pl),y0,y1,F:[T(H[46],3.23/2,y0,y1)]}]),M.gilt),'050805-2');ck.userData.y0=0;PL.click={loop:loc.map(pl),y0,y1};}   /* its outline, for the barrel's ratchet (fusee.js) to be turned against */
    /* the click's screw (WN-22): head Ø 4.5 × 2.1 (Wempe 3955's 4.6), shoulder Ø 3.1 through the click (its hole 3.2) and 0.05 more, M2.6 through the bridge: the coloured section,
       scaled (estimated) */
    {const g=tag(screw(bb,H[46][0],H[46][1],TT-3.32-2.65,2.25,2.1,0,1.3,M.steel),'WN-22'),L=2.65+3.2,rs=1.3,pt=0.3,d=pt*0.3,n=Math.floor((L-2.65-pt*0.6)/pt),pr=[V2(0,0),V2(3.1/2,0),V2(3.1/2,2.65),V2(rs,2.65),V2(rs,L-n*pt-d)];   /* its shoulder and thread turned below the head, the thread's rings as screw() draws them */
      for(let i=0;i<n;i++){const a=L-(n-i)*pt-d;pr.push(V2(rs-d,a+pt/2),V2(rs,a+pt));}pr.push(V2(rs-d,L),V2(0,L));mesh(g,new THREE.LatheGeometry(pr,28),M.steel);g.userData.lift=L+2.1+1.5;}

    /* ================= the fusee bush (Schneckenfutter, 05 08 01-2) and dust bush (Staubfutter, 05 08 01-3) ================= */
    /* Schneckenfutter: Rundmessing 13,5 Ms 58: a flange Ø 13.2 -0.2 × 1.5 -0.1 on the top plate's outer face, its spigot below it Ø 8 g6 (-0.005/-0.014, drawn at its middle,
       7.9905) in the plate's hole 10 (8.0 +0.015: a slide fit, the bush held by its three screws; the spigot runs to the J-K recess, which leaves the plate 2.65 there), above
       the flange Ø 8 T6 (+0.019/+0.028, drawn at its middle, 8.0235) tapering 1:70 (to the sheet's 7.96 at its top), on which the dust bush's 8 H7 bore is pressed, 2.9 +0.2 high,
       7.1 -0.2 overall (05 08 01-2 at 5:1: the T6's dimension line runs across the part above the flange, under the "Kegel 1:70" leader, the g6's extension lines down the
       spigot's walls: sure; until 15 October 2026 the fits were taken the other way round, the spigot T6 pressed into the plate); bore 4.1 +0.2, its top sunk
       Ø 7 ±0.1 at 45°; the flange's three holes Ø 1.5 +0.1, sunk Ø 2.2 H8 × 0.5 +0.05, on Ø 10.4 ±0.05 (sure), for M1.4 screws (WN-34) into the plate (the coloured section and
       05 08 01's section put them in from above). Three solids: the body below the flange and above it turned, the flange with its holes cut.
       Two figures give way to the fusee arbor's (P1c, js/fusee.js; README, Unresolved): the bore is drawn 4.52, reamed to the arbor's journal (05 06 04-1: Ø 4.5 ±0.02 at its
       shoulder, 4.39 at its end, 1:70), which the sheet's 4.1 +0.2 can't take; and the body below the flange 2.6, not the sheet's 2.7, so its end is 0.05 short of the J-K
       recess's floor: at 2.7 it stood 0.05 proud of it, 19.65 from the pillar plate, and the arbor's 19.7 +0.05 between its shoulders would have had no endshake */
    const fb=part('fuseeBush',-46),F10=H[10];
    {const r=2.26,lw=[V2(r,TT),V2(7.9905/2,TT),V2(7.9905/2,TT+2.6),V2(r,TT+2.6),V2(r,TT)],up=[V2(3.5,TT-4.4),V2(8.0235/2-2.9/140,TT-4.4),V2(8.0235/2,TT-1.5),V2(r,TT-1.5),V2(r,TT-4.4+3.5-r),V2(3.5,TT-4.4)];
      const g=tag(mesh(fb,new THREE.LatheGeometry(lw,64),M.brass,F10[0],0,F10[1]),'050801-2');tag(mesh(fb,new THREE.LatheGeometry(up,64),M.brass,F10[0],0,F10[1]),'050801-2',1);
      const y0=TT-1.5,y1=TT,F=[T(F10,r,y0,y1)];for(const b of[0,120,240]){const q=add(F10,brg(b),5.2);F.push(T(q,1.55/2,y0,y1),A(q,2.207/2,y0,0.5));}
      tag(mesh(fb,solidGeo([{loop:C(F10,6.6,240),y0,y1,F}]),M.brass),'050801-2',1);}
    /* its screws: heads Ø 2.1 × 0.45, just under the flange's face in the sinks (the dust bush stands on the flange), M1.4 × 3.2 through the flange into the plate, ending 0.4
       short of the recess's floor, as the coloured section draws them (Wempe_Einheitschronometer.jpg x 741-752: the head's top at y 313.3, the shank's end at 348.3, 2.7-4.5 px
       short of the recess's floor at 351, at 9.37 px/mm: 3.15-3.3 from the seat; likely; 3.6, to the recess, until 17 October 2026) */
    for(const b of[0,120,240]){const q=add(F10,brg(b),5.2);tag(screw(fb,q[0],q[1],TT-1.0,1.05,0.45,3.2,0.7),'WN-34');}
    /* Staubfutter: Rundmessing 15 Ms 58, 18.1 -0.2 long on the bush's flange, pressed on its top (bore Ø 8 H7 on the bush's 8 T6, both tapering 1:70: 0.008 interference on
       the radius at the fits' middles; until 15 October 2026 a slide over the bush's g6 as then read; its top Ø 7.62 under a 20° mouth
       1.8 +0.2 deep); body Ø 13.1 -0.2 for 15.1, then a neck Ø 9.7 -0.2 (for 05 08 01-4, not in the set); at the body's top a collar 3.1 -0.2 high, Ø 15.1 -0.2 with a flat 14.1
       from its far side, so flush with the body on one side (sure). The flat faces the upper balance cock, which passes 7.0 from the fusee's axis (the cock's coordinates):
       turned any other way the collar would stand 0.55 into the cock's web (inferred). Its bottom's 5° × 0.5 chamfer on its outer edge (since 16 October 2026) */
    const db=part('dustBush',-66);
    {const Yb=TT-1.5,Yt=Yb-18.1,rr=y=>8.0075/2-(Yb-y)/140,rT=rr(Yt+1.8)+1.8*Math.tan(20*D2R),nf=brg(255);
      const lw=[V2(rr(Yb-12),Yb-12),V2(6.55,Yb-12),V2(6.55,Yb-0.5),V2(6.55-0.5*Math.tan(5*D2R),Yb),V2(rr(Yb),Yb),V2(rr(Yb-12),Yb-12)],nk=[V2(rT,Yt),V2(4.85,Yt),V2(4.85,Yb-15.1),V2(rr(Yb-15.1),Yb-15.1),V2(rr(Yt+1.8),Yt+1.8),V2(rT,Yt)];
      const g=tag(mesh(rv(db,'last first 1943 -3955'),new THREE.LatheGeometry(lw,72),M.brass,F10[0],0,F10[1]),'050801-3');
      /* Wempe 3955's (the version as photographed): the body turned down to a waist under the collar (4_Wempe_3955_N.jpg, photocompare.py's fit, 10.6 px/mm on the bush,
         its silhouette traced on a 5 px grid): the Ø 13.1 body to a flat shoulder at y -29.0 (±0.3), then Ø 9.0 (±0.4: 93-95 px across) up to the collar; the collar 1.85 thick (±0.2: its lower
         edge, traced at full size on both silhouettes beside the model's outline, 16.5 px above a 3.1 collar's and 3-6 px below a 1.4 one's; its top the sheet's), the waist running up to it, its plan (14.2 across toward the
         cock, the sheet's 15.1 with its 14.1 flat) and the neck (Ø 9.3, its bore 7.6) the sheet's. Kirov No. 247's has a waist too (Ø 9.8). 05 08 01-3
         (2.7.42) draws the body straight */
      /* Kirov No. 247's (the 6MX), the same in kind (4_Kirow_247_N.jpg, photocompare.py's fit, 10.3 px/mm): the body 4.8 high, a flare, the waist Ø 9.8 ±0.3, the collar
         about 1.2 thick; traced as Wempe 3955's (below) */
      const WB=/** @type {[string,number,number,number,number][]} */([['3955',-29.0,-29.0,4.5,-37.1],['6mx',Yb-4.8,Yb-6.45,4.9,-37.75]]);   /* [version, the body's shoulder, the waist's foot (a cone between), its radius, the collar's underside] */
      for(const[V,yS,yW,rW,yC]of WB){const w=[V2(rr(yC),yC),V2(rW,yC),V2(rW,yW),V2(6.55,yS),V2(6.55,Yb-0.5),V2(6.55-0.5*Math.tan(5*D2R),Yb),V2(rr(Yb),Yb),V2(rr(yC),yC)].filter((q,i,a)=>!i||q.x!==a[i-1].x||q.y!==a[i-1].y);
        tag(mesh(rv(db,V),new THREE.LatheGeometry(w,72),M.brass,F10[0],0,F10[1]),'050801-3');}tag(mesh(db,new THREE.LatheGeometry(nk,72),M.brass,F10[0],0,F10[1]),'050801-3',1);
      const lug=clipPoly(C(F10,15.1/2,320),p=>6.55-((p[0]-F10[0])*nf[0]+(p[1]-F10[1])*nf[1])),y0=Yb-15.1,y1=Yb-12.0;
      tag(mesh(rv(db,'last first 1943 -3955'),solidGeo([{loop:lug,y0,y1,F:[{p:C(F10,rr(y0),180),q:C(F10,rr(y1),180),a:y0,b:y1}]}]),M.brass),'050801-3',1);
      for(const[V,,,,yC]of WB)tag(mesh(rv(db,V),solidGeo([{loop:lug,y0,y1:yC,F:[{p:C(F10,rr(y0),180),q:C(F10,rr(yC),180),a:y0,b:yC}]}]),M.brass),'050801-3',1);}   /* the photographed collars, thinner (WB) */
    /* Korkring 05 08 01-4 (no sheet; 05 08 01 names it on the dust bush, the coloured section "Korkring 05 08 01-4", its "05 06 01-4" in the transcription's list a misreading):
       a cork ring of square-cut section on the dust bush's neck, sitting on the collar's top, under the bowl's winding hole. In the bowl (its bore 53 deep, R-05 01 00-1,
       the movement on its flange) its top is 3.84 over the bottom, where the bowl's raised seat round the hole meets it (case.js: the 6MX's, estimated). Scaled on the coloured section (Wempe_Einheitschronometer.jpg) at 9.32 px/mm, by the bush's own drawn Ø 13.1 (122 px) and neck Ø 9.7
       (90.5 px): Ø 16.1 outside (x 720-870.5 px), its bore the neck's, 3.86 high (y 135-171), so its top 0.95 over the neck's (y 144) (likely: a pictorial section, but
       the bush's own figures scale to 0.1 on it). Lange No. 5829's (stahl_113510_lange_4.jpg, side-on) has it 1.23 times the bush's body across, as the section's 16.1/13.1,
       and a quarter as high as wide (sure). Its bore drawn 0.01 clear of the neck. Natural cork, its colour off that photograph */
    const ck=part('corkRing',-68);
    /* Wempe 3955 (the version as photographed) has none: its N, O and A photographs show the neck bare to its mouth (photocompare.py; its movement was photographed out of the
       bowl, so the cork may have perished or stayed in the case's seat); the sheets' versions keep it */
    /* its colour Kirov No. 247's cork (4_Kirow_247_N.jpg, photocompare.py: hue 0.08, saturation 0.6 against 0.31 rendered from the colour read off Lange 5829's, the photograph's
       exposure 0.78 of the render's on the steel square; until 18 October 2026 0xc8a070, a cream). The 6MX's 2.4 thick (its top 1.6 under a 3.86 one's on the same photograph,
       the agent's reading 2.5: likely); the drawings' versions keep the section's 3.86 */
    {const cm=new THREE.MeshStandardMaterial({color:sc(0xa06838),metalness:0,roughness:0.92});
      for(const[V,th]of/** @type {[string,number][]} */([['last first 1943 -3955',3.86],['6mx',2.4]])){const yb=TT-1.5-15.1,yt=yb-th;tag(mesh(rv(ck,V),new THREE.LatheGeometry([V2(4.86,yt),V2(8.05,yt),V2(8.05,yb),V2(4.86,yb),V2(4.86,yt)],72),cm,F10[0],0,F10[1]),'050801-4');}}

    /* ================= the upper balance cock (Unruhkloben oben, 05 08 03-1; kompl. 127-556.04 U30) ================= */
    /* Profilmessing Ms 58, cranked: a foot 3.2 thick on the top plate's outer face, a web, and an arm 15 -0.1 over the foot's underside to the balance's upper setting at 23.
       Its axis runs from 23 toward 15° W of N; in plan it tapers from 17 wide at the foot's end, 49 from the end of its arm, to the r 6 round the setting; the foot 16.5 long, the
       web's outer face 26.5 from 23 and its inner face an arc r 22 ±0.1 about 23 (so 4.5 on the axis, about 5.5 at its sides: "≈5,5"); the arm 3.2 thick, relieved 0.8 under
       it within r 12 of the setting, the step at 45° (05 08 03-1's "0,8", "45°", "12ʳ"; 127-556.04 U30 draws the arm 2.4 there: the relief). Round the setting, a boss under the arm, its face Ø 6 0.8 below the
       relieved underside, so 3.2 thick there (05 08 03-1's "3,2 ±0,02", its Schnitt A-B to the boss's face, and its "6 Ø"), its flanks 45° to Ø 7.6 (U30, 12.5 px/mm: the face
       9-10 px under the relief, its base Ø 7.2 traced; the coloured section, 9.37 px/mm: the face Ø 6.35 at y 217, x 1465.5-1525, its base Ø 7.8, the cock's top at 187, so
       3.2; sure: three dimensioned views draw it as the cock's metal, the section leaving it unhatched only where the setting screws' holes run down through it): built
       with its face Ø 5.8 and its base Ø 7.5 (within the sources' 5.6-6.35 and 7.2-7.8), so the stud's slot, milled through it to 2.93 from the axis, clears the face. The setting's
       seat Ø 5.2 H7 2.7 deep from the top, leaving a floor 0.5 thick bored Ø 4.59 (U30: 0.1 + 1.4 + 1.4 + 0.5 = 3.3 from the settings' top, 0.1 proud; the floor's hole the table's
       "Körner 4,4, kalibr. 4,59" for 23): both settings go in from the top, a piloted counterbore (until 17 October 2026 the hole jewel's setting came from below with a flange
       Ø 6 in a sink 0.5 deep, and the arm was flat 2.4 there). Two M1.2 3.5 +0.05 either side along the axis (drawn at their tap drill, Ø 0.95, at 3.525), through the boss and
       out of its flanks;
       the auxiliary hole 20 Ø 2.8 at 10 from 23; a slot 1.8 H7 wide, its middle on the setting's line across the arm, from the O side's edge to 3.4 from the axis (C-D; Wempe 3955's
       index lies in it). Foot: the screw's hole 8 clear 2.8, steady pins 6 and 50 5 either side of the axis at 40, pin 9 at 24.5 under the web, 1.585 -0.005 × 2.5 deep (sure).
       C-D's 82°: the slot's inner wall leans 8° toward the axis going down, 3.4 from it on the top and 3.06 under the thin end, as the stud's upright does (05 03 02-3's 98°,
       js/escapement.js; left out until 15 October 2026). The pins' 0.2 × 90° sinks are in (since 16 October 2026). Built of five cells: the arm's thin end, the 45° step, the arm, the web and the foot */
    const uc=part('upperCock',-58),UCG=VER.map(([V])=>rv(uc,V));   /* each version's cock with its screw and pins in one group (fine.py takes pieces fixed to each other by their shared group) */
    {const c=H[23],ax=brg(345),vo=brg(75),pl=new Map(),P=q=>{if(!pl.has(q))pl.set(q,add(add(c,ax,q[0]),vo,q[1]));return pl.get(q);};   /* local [u along the axis, v toward O] to plan, one plan point per local point */
      const Fp=[43,8.5],Fm=[43,-8.5],ph=Math.atan2(8.5,43)+Math.acos(6/Math.hypot(43,8.5)),Tp=[6*Math.cos(ph),6*Math.sin(ph)],Tm=[Tp[0],-Tp[1]];
      const onE=(Tq,Fq,f)=>{const D=[Fq[0]-Tq[0],Fq[1]-Tq[1]];let a=0,b=1;for(let i=0;i<60;i++){const m=(a+b)/2;(f([Tq[0]+D[0]*m,Tq[1]+D[1]*m])<0)?a=m:b=m;}return[Tq[0]+D[0]*a,Tq[1]+D[1]*a];};
      const X=(s,r)=>onE(s>0?Tp:Tm,s>0?Fp:Fm,typeof r==='number'?q=>Math.hypot(q[0],q[1])-r:q=>q[0]-26.5),Xs={};for(const r of[12,12.8,22,'u'])Xs[r]=[X(1,r),X(-1,r)];
      const arc=(r,a0,a1)=>{const n=Math.max(2,Math.ceil(Math.abs(a1-a0)*r/0.1)),o=[];for(let i=1;i<n;i++){const a=a0+(a1-a0)*i/n;o.push([r*Math.cos(a),r*Math.sin(a)]);}return o;};   /* interior points */
      const cut=r=>{const[p,m]=Xs[r];return[p,...arc(r,Math.atan2(p[1],p[0]),Math.atan2(m[1],m[0])),m];};   /* X+ round through u > 0 to X- */
      const K12=cut(12),K128=cut(12.8),K22=cut(22),Ku=Xs.u,rev=a=>a.slice().reverse();
      const S1=[-0.9,Math.sqrt(36-0.81)],S2=onE(Tp,Fp,q=>q[0]-0.9),aS1=Math.atan2(S1[1],S1[0]),aTm=Math.atan2(Tm[1],Tm[0]);
      const end=[Tm,...arc(6,aTm,aS1-TAU),S1];   /* round the end from T- through u < 0 to the slot */
      const yC=q=>TT-12.6+clamp(Math.hypot(q[0]-c[0],q[1]-c[1])-12,0,0.8);
      const TN=Math.tan(8*D2R),SW=3.4-2.4*TN;   /* the slot's inner wall at 82° to the faces (C-D), 3.4 from the axis on the top, SW under the thin end */
      const cells=[{L:[...end,[-0.9,3.4],[-0.9,SW],[0.9,SW],[0.9,3.4],S2,...K12],y0:TT-15,y1:TT-12.6},{L:[...rev(K12),...K128],y0:TT-15,y1:yC},{L:[...rev(K128),...K22],y0:TT-15,y1:TT-11.8},
        {L:[...rev(K22),Ku[0],Ku[1]],y0:TT-15,y1:TT},{L:[Ku[1],Ku[0],Fp,Fm],y0:TT-3.2,y1:TT},
        {L:[[0.9,SW],[-0.9,SW],[-0.9,3.4],[0.9,3.4]],y0:TT-15,y1:q=>TT-15+Math.max(0,3.4-((q[0]-c[0])*vo[0]+(q[1]-c[1])*vo[1]))/TN}];   /* the wall's overhang, its underside the 82° face */
      const L=(u,v)=>add(add(c,ax,u),vo,v),[thin,,,web,foot]=cells;
      /* the boss under the thin end: Ø 7.6 at the arm's underside, its face Ø 6 0.8 below; the setting screws' holes bite its flanks and the stud's slot crosses it (local u, v) */
      const bo=(()=>{const R=3.75,R0=2.9,d=3.525,SN=SW-0.8*TN-0.02,rh=0.475,xi=(R*R-rh*rh+d*d)/(2*d),yi=Math.sqrt(R*R-xi*xi),aI=Math.atan2(yi,xi),aN=Math.atan2(Math.sqrt(R*R-0.81),0.9);   /* SN: the stud's slot milled through the boss, its wall where the upright's 82° lean reaches at the boss's face */
        const bI=Math.atan2(yi,xi-d);   /* where the outer circle meets a bite, seen from the bite's centre (about 58°) */
        const add=(o,p)=>{const l=o[o.length-1];if(!l||Math.hypot(l[0]-p[0],l[1]-p[1])>1e-9)o.push(p);};   /* no point twice in a row */
        const arcAt=(cx,r,a0,a1,o)=>{const n=Math.max(2,Math.ceil(Math.abs(a1-a0)*r/0.08));for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;add(o,[cx+r*Math.cos(a),r*Math.sin(a)]);}return o;};
        const fix=o=>{let a=0;for(let i=0;i<o.length;i++){const p=o[i],q=o[(i+1)%o.length];a+=p[0]*q[1]-q[0]*p[1];}return a<0?o.reverse():o;};
        const N=240,C3=[];for(let k=0;k<N;k++)C3.push([R0*Math.cos(TAU*k/N),R0*Math.sin(TAU*k/N)]);   /* the face's edge: the same points for the disc and both halves */
        const Pp=[d-rh,0],Pm=[rh-d,0];
        const top=[Pp];arcAt(d,rh,Math.PI,bI,top);arcAt(0,R,aI,aN,top);top.push([0.9,SN],[-0.9,SN]);arcAt(0,R,Math.PI-aN,Math.PI-aI,top);arcAt(-d,rh,Math.PI-bI,0,top);top.pop();top.push(Pm);
        for(let k=N/2;k>=0;k--)top.push(C3[k%N]);
        const bot=[Pm];arcAt(-d,rh,0,bI-Math.PI,bot);arcAt(0,R,Math.PI+aI,TAU-aI,bot);arcAt(d,rh,TAU-bI,Math.PI,bot);bot.pop();bot.push(Pp);
        for(let k=N;k>=N/2;k--)bot.push(C3[k%N]);
        return[fix(top),fix(bot),fix(C3.slice())];})();   /* the flank's two halves (the setting screws' bites and the slot cut from them) and the face's disc: one solid of its own on the arm's underside (solidGeo's cells lie side by side, not one under another) */
      const ySl=q=>TT-11.8-clamp((Math.hypot(q[0]-c[0],q[1]-c[1])-2.9)*0.8/0.85,0,0.8);
      const boss=[{L:bo[0],y0:TT-12.6,y1:ySl},{L:bo[1],y0:TT-12.6,y1:ySl},{L:bo[2],y0:TT-12.6,y1:TT-11.8,F:[{p:C(c,5.206/2),a:TT-12.6,b:TT-12.3},{p:C(c,4.59/2),a:TT-12.3,b:TT-11.8}]}];
      const thF=[T(c,5.206/2,thin.y0,thin.y1),T(L(3.525,0),0.95/2,thin.y0,thin.y1),T(L(-3.525,0),0.95/2,thin.y0,thin.y1),
        T(WESC.HOLES.studScrew,rM14,thin.y0,thin.y1)];   /* the hairspring stud's screw (WN-11, M1.4; js/escapement.js): not on 05 08 03-1, tapped where the stud's hole lies (estimated) */
      const sk=(k,y)=>[{p:C(H[k],rPinQ,40),a:y-2.5,b:y-0.2},{p:C(H[k],rPinQ,40),q:C(H[k],rPinQ+0.2,40),a:y-0.2,b:y}];   /* the pins' holes, 2.5 deep, their 0.2 × 90° sinks (05 08_05) */
      foot.F=[T(H[8],rCl26,foot.y0,foot.y1),...sk(6,foot.y1),...sk(50,foot.y1)];web.F=[...sk(9,web.y1)];
      /* the auxiliary hole 20 (Ø 2.8) in the drawings' versions only: the 6MX's cock has none (Altmeppen's list: no window in the upper cock; his comparison's arrow on the
         Wempe's hole there; Kirov No. 247's cock is plain where the overlay puts 20: sure) */
      VER.forEach(([,,DR],i)=>{thin.F=DR?[...thF,T(H[20],rCl26,thin.y0,thin.y1)]:thF;tag(mesh(UCG[i],faceUV(solidGeo(cells.map(q=>({loop:q.L.map(P),y0:q.y0,y1:q.y1,F:q.F||[]})))),DR?GH:G6T),'050803-1');
        tag(mesh(UCG[i],faceUV(solidGeo(boss.map(q=>({loop:q.L.map(P),y0:q.y0,y1:q.y1,F:q.F||[]})))),DR?GH:G6T),'050803-1',1);});}
    /* its screw (hole 8; its WN number not read): head Ø 6.4 × 3.0, blued (Wempe 3955), scaled on the coloured section; M2.6 through the foot and 3.0 into the plate (estimated) */
    VER.forEach(([V],i)=>tag(screw(UCG[i],H[8][0],H[8][1],TT-3.2,3.2,3.0,6.2,1.3,V==='6mx'?M.steel:M.blued),'WN-ucs'));   /* the 6MX's polished steel (Kirov No. 247's A, N and W photographs: sure; blued until 18 October 2026) */
    /* its steady pins (hole numbers 6, 9, 50; their WN not given): Ø 1.6, 3 long, 1.3 proud (127-556.04 U30: sure for that cock) */
    for(const g of UCG)for(const k of[6,9,50])tag(cylBetween(g,rPin,TT-1.7,TT+1.3,M.steel,H[k][0],H[k][1],16),'WN-203.uc');

    /* ================= the lower balance cock (Unruhkloben unten, 05 08 00-2, revised 2.12.46) ================= */
    /* Profilmessing 20×10×8×3,3 Ms 58: a bar 20 × 8 and 10 -0.1 deep under the top plate's inner face, its axis through 22, 36, 37 (7 apart) at 32°30' from S toward W, and a lug
       10 wide flush with its end at 22, 3.22 -0.04 thick at the bar's far face, ending in r 5 round the balance's lower setting at 23 (8.2 from the bar's axis, 5 along it from
       36; 17.2 across both). The setting's seat Ø 5.2 H7 from the lug's far face to 0.5 +0.03 from its near one, Ø 4.59 +0.012 through that; two M1.2 3.5 +0.1 either side
       across the bar's axis. 36 tapped M2.6 through for the screw from the top plate (G-H); 22, 37 its steady pins, 1.585 -0.005 × 2.5 deep (sure). Two cells: the bar and the lug */
    const lc=part('lowerCock',-31);
    {const o=H[36],bu=unit(sub(H[37],H[22])),nv=(q=>q[0]*(H[23][0]-o[0])+q[1]*(H[23][1]-o[1])>0?q:[-q[0],-q[1]])([-bu[1],bu[0]]),L=(u,w)=>add(add(o,bu,u),nv,w);
      const L1=L(0,4),L2=L(-10,4),semi=[...Array(41).keys()].map(i=>{const t=Math.PI*i/40;return L(-5+5*Math.cos(t),8.2+5*Math.sin(t));});
      const bar={loop:[L(-10,-4),L(10,-4),L(10,4),L1,L2],y0:TI,y1:TI+10,F:[T(o,rM26,TI,TI+10),A(H[22],rPinQ,TI,2.5),A(H[37],rPinQ,TI,2.5)]};
      const ly0=TI+10-3.22,ly1=TI+10,lug={loop:[L2,L1,...semi],y0:ly0,y1:ly1,F:[T(H[23],rJ,ly0,ly1),B(H[23],5.206/2,ly1,3.22-0.5),T(add(H[23],nv,3.5),rM12,ly0,ly1),T(add(H[23],nv,-3.5),rM12,ly0,ly1)]};
      tag(mesh(rv(lc,'last first 1943'),solidGeo([bar,lug]),M.gilt),'050800-2');
      /* the Soviet 6MX's: the bar full depth only over the lug, the rest toward the screw and pins cut back from the pillar plate's side to 3.5 under the top plate (every 6MX
         side view of the detent, 8_Kirow_247_F.jpg and the gallery's 13 Feder photographs, a stamped number on the deep part; on 247's, the full depth taken as the drawn 10:
         the cut-back part 3.3 deep (3.0-3.9), the step about at the lug's edge: likely; Wempe 3955 and Kirov 422, German-made, the plain bar). Built 3.3. Its lug 3.22 thick as drawn (247's reads 2.7,
         by that same scale: not taken). Its plan (Kirov 14100's loose cock, chasy-ru: the setting's screws 6.9 apart, its round end r 6.6 off the setting's centre) too
         rough to take: the drawn plan kept (README, The Soviet 6MX). The step 1.5 past the lug's edge, so the lug and the screw's hole stand on the full depth (estimated) */
      const st=1.5,b6a={loop:[L(-10,-4),L(st,-4),L(st,4),L1,L2],y0:TI,y1:TI+10,F:[T(o,rM26,TI,TI+10),A(H[22],rPinQ,TI,2.5)]},b6b={loop:[L(st,-4),L(10,-4),L(10,4),L(st,4)],y0:TI,y1:TI+3.3,F:[A(H[37],rPinQ,TI,2.5)]};
      tag(mesh(rv(lc,'6mx'),solidGeo([b6a,b6b,lug]),M.gilt),'050800-2');}
    for(const g of lc.children.filter(c=>c.userData.rev))for(const k of[22,37])tag(cylBetween(g,rPin,TI-1.3,TI+1.7,M.steel,H[k][0],H[k][1],16),'WN-203.lc');   /* in each version's group with its cock (fine.py takes pieces fixed together by their shared group) */   /* before the screws' groups (below), which aren't the cock's */
    /* its screw (WN-53 in the coloured section): head Ø 5.8 × 1.7 in the plate's Ø 6 × 1.8 sink, M2.6 × 5.0, 3.45 into the cock: the coloured section, scaled (estimated) */
    headOn(tag(screw(rv(lc,'last first 1943'),H[36][0],H[36][1],TT+1.8,2.9,1.7,5.0,1.3,M.brass),'WN-53'),'lowerCock','topPlate');   /* brass, as Wempe 3955's (2_Wempe_3955_A.jpg; steel until 16 October 2026) */
    headOn(tag(screw(rv(lc,'6mx'),H[36][0],H[36][1],TT+1.8,2.7,1.7,5.0,1.3,M.steel),'WN-53'),'lowerCock','topPlate');   /* the 6MX's steel, its head Ø 5.4 (2_Kirow_247_A.jpg, photocompare.py's fit: likely) */

    /* ================= the intermediate bridge (Zwischenbrücke kompl., 05 08 04) ================= */
    /* On the pillar plate's dial face, across the opening 38: the intermediate wheel's brass bush (WN-300: 05 08 04's leader goes to it) pressed in at 38 (its face 0.7 +0.02
       in from the plate side) and the seconds wheel's jewel in its setting (05 05 04-1, -2 in the coloured section) at 35 (1.7 in) (both built with the train, train.js),
       steady pins (WN-203) 1.3 proud, a screw at each end from the dial side, sunk. Holes 43, 38, 35, 28 and the pins 44, 29 all lie on one line
       (the tables' coordinates, to 0.001: sure), 34.13 between the screws, 41.13 between the pins. Its outline (05 08 04-1, not in the set) scaled on 05 08 04 at 2:1 against
       those spacings (7.03 px/mm): 45.5 × 10.0 with round ends, 3.8 thick; the screws' sinks Ø 4.4 × 2.0: estimated. The bush's hole Ø 4.3 with a 45° mouth from the plate side
       down to the bush, about Ø 5.7 at the face (05 08 04's section, measured: 5.8 across at the face, 0.78 deep to the bush's top, its walls at 45°: likely); the setting's
       hole Ø 5.2 straight through, the setting filling it (train.js: the section's hatched walls run the bridge's full thickness, their top about 0.2 under the plate side's
       face: likely). Until 15 October 2026 both were sunk Ø 6.2 from the plate side, 0.7 and 1.7 deep (estimated; the section draws neither). Drawn gilt (Wempe 3955's,
       3_Wempe_3955_uZ.jpg) */
    const zb=part('intermediateBridge',18),ZBG=VER.map(([V])=>rv(zb,V));   /* each version's bridge (the 6MX's striped) with its pins */
    {const d=unit(sub(H[28],H[43])),m=[(H[28][0]+H[43][0])/2,(H[28][1]+H[43][1])/2],y0=PPT,y1=PPT+3.8;
      const F=[T(H[28],rCl26,y0,y1),T(H[43],rCl26,y0,y1),B(H[28],2.2,y1,2.0),B(H[43],2.2,y1,2.0),A(H[29],rPinQ,y0,2.5),A(H[44],rPinQ,y0,2.5),T(H[38],4.3/2,y0,y1),{p:C(H[38],2.85,180),q:C(H[38],2.16,180),a:y0,b:y0+0.69},T(H[35],5.2/2,y0,y1)];
      const zg=faceUV(solidGeo([{loop:stadiumPts(add(m,d,-17.75),add(m,d,17.75),10),y0,y1,F}]));VER.forEach(([,,DR],i)=>tag(mesh(ZBG[i],zg,DR?GH:G6D),'050804-1'));
      for(const[V,mt]of[['last first 1943',M.brass],['6mx',M.blued]]){const g=new THREE.Group();g.rotation.x=Math.PI;rv(zb,V).add(g);   /* the 6MX's blued (3_Kirow_247_uZ.jpg, photocompare.py: sure) */
        for(const k of[28,43])tag(screw(g,H[k][0],-H[k][1],-(PPT+1.8),2.1,1.9,4.7,1.3,mt),'WN-52');}   /* heads Ø 4.2 × 1.9 (Wempe 3955 4.4), just under the bridge's face, M2.6 × 4.7 into the plate: estimated */
      for(const g of ZBG)for(const k of[29,44])tag(cylBetween(g,rPin,PPT-1.3,PPT+1.7,M.steel,H[k][0],H[k][1],16),'WN-203.zb');}
    return PL;}
  return{build,TT,TI};
})();
