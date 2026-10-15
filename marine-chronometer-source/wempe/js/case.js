// @ts-check
/* case.js: the Wempe Einheits-Chronometer's gimballed case and wooden box (drawing groups 05 01 and 51 00), built from their sheets as last revised
   (References/wempe/transcriptions/05-01-51-00-case-box-overview.md, checked on the sheets themselves, cropped and enlarged where a number mattered): the bowl
   (Gehäusetopf R-05 01 00-1, 6.3.42), its two brackets for the inner pivots and the locking bracket (Gehäusekloben 05 01 00-3, Feststellkloben -4), the closing plate in its foot
   (Verschlußplatte 05 01 00-2, rev. a 14.4.48), the bezel and its glass (Glasrand R-05 01 01-2, 6.3.42; Glasrand kompl. 05 01 01), the gimbal ring with its bracket, pivot
   screws and lock nuts (Kardanring 05 01 00-5, Kardanringkloben -6, WN-79, WN-400, 05 01 Gehäuse Kardan, 1940, reissued 28.6.46), the transit lock (Feststeller, 15 on
   05 01), the wooden box with its lid, hinges, handles (51 00 10), maker's plate (Firmenschild 00 01 01-9, "Type 3371") and latch tongue (Zunge P. 51 00 02-2), the outer
   pivots (WN-80) in the box's walls, and the one-way winding key of 1943 (Chronometerschlüssel 51 00 11: 05 01 02-2, -3), lying in the box.
   Part of the Wempe model (three.js r128). Declares only WCASE: WCASE.build(M) returns {root, ring, bowl, lid, tongue, YP, YB}: root the box (the scene's group), ring the
   gimbal ring's group (turning about x, the outer pivots' axis, at YP), bowl the bowl's group inside it (turning about z, the inner pivots' axis), into which the page puts
   the movement (at y -YP: the movement's frame and the case's coincide at rest), lid the lid's group (turning about x at its hinge), tongue the latch tongue's.
   Units mm, the movement's frame (dims.js): dial side +y (up in the box), 12 o'clock -z (toward the box's back, its hinges), 3 o'clock +x. The bowl's top face, on which
   the movement ring's flange lies, at YB. Plan outlines [x, z]; solids from KIT.solidGeo, turned profiles as cells of rings (cells() below), so every part is one closed
   solid with its holes; holes across a turned part (radial) are not cut, as on the movement's turned parts. */
const WCASE=(()=>{
  const{solidGeo,ring,bool,polyGeo,stadiumPts,area}=KIT,V2=(a,b)=>new THREE.Vector2(a,b),H=WD.H;
  const tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined);
  /* ================= heights (the movement's frame) =================
     YB: the bowl's top face, on which the movement ring's flange (Ø 105.95 × 4.7, 05 08 00-3) lies, its body (Ø 96 −0.3) in the bowl's bore (Ø 98): the flange's underside,
     6.0 over the ring's inner face (frame.js: 0.35 + 6.0). YP: the gimbals' two pivot axes, both 11.5 under the ring's top (05 01's "11,5", from axis A to the ring's top: likely,
     27 px at 2.45 px/mm), the ring's top level with the bowl's top face (05 01's elevation draws them together, ±2: estimated); 51 00 10 puts the outer pivot's M6 11.5 under a
     line across the box's side 105 over its bottom: the box's bottom 93.5 under the pivots, its parting line at the ring's top */
  const YB=6.35,YP=YB-11.5,YF=YP-93.5,YT=YF+180,YL=YF+105,BW=185/2,WT=12.5;
  const N=240,CC=new Map(),circ=(r,s0=0)=>{const k=r+'|'+s0;if(!CC.has(k)){const o=[];for(let i=0;i<N;i++){const t=s0+i/N*TAU;o.push([r*Math.cos(t),r*Math.sin(t)]);}CC.set(k,o);}return CC.get(k);};
  /* turned solids as plan cells of rings: rs the radii, ys[i] the depths [y0, y1] of the disc (i 0) and of each ring (each a constant or a function of the plan point), F[i] its
     features; each ring in two halves (a ring isn't a simple outline), split at s0 so no feature crosses the split, a sloped one in N/4 sectors. Every circle is the same N points, so neighbouring cells share them */
  const cells=(rs,ys,F=[],s0=0)=>{const out=[{loop:circ(rs[0],s0),y0:ys[0][0],y1:ys[0][1],F:F[0]||[]}];
    for(let i=1;i<rs.length;i++){const a=circ(rs[i-1],s0),b=circ(rs[i],s0),M=ys[i].some(y=>typeof y==='function')?N/4:2;   /* a sloped ring in narrow sectors, so its faces' triangles stay short and follow the slope */
      for(let h=0;h<M;h++){const ix=[...Array(N/M+1).keys()].map(k=>(k+h*N/M)%N);
        const f=(F[i]||[]).filter(q=>{const c=KIT.cen(q.p),t=((Math.atan2(c[1],c[0])-s0)%TAU+TAU)%TAU;return Math.floor(t/(TAU/M))===h;});
        out.push({loop:[...ix.map(k=>b[k]),...ix.slice().reverse().map(k=>a[k])],y0:ys[i][0],y1:ys[i][1],F:f});}}return out;};
  /* turned faces shaded smooth: each face of g whose normal leans along the radius from the axis (a cone, a round, a turned wall) takes at each corner that normal turned to the
     corner's azimuth, so the revolution reads round and not as facets (solidGeo's normals are each face's own) */
  const smoothRev=g=>{const P=g.attributes.position,Nm=g.attributes.normal;for(let t=0;t<P.count;t+=3){const cx=(P.getX(t)+P.getX(t+1)+P.getX(t+2))/3,cz=(P.getZ(t)+P.getZ(t+1)+P.getZ(t+2))/3,cr=Math.hypot(cx,cz);if(cr<1e-6)continue;
    const nx=Nm.getX(t),ny=Nm.getY(t),nz=Nm.getZ(t),h=Math.hypot(nx,nz);if(h<0.05||Math.abs(nx*cz-nz*cx)/(h*cr)>0.05)continue;const sg=Math.sign(nx*cx+nz*cz);
    for(let k=t;k<t+3;k++){const x=P.getX(k),z=P.getZ(k),r=Math.hypot(x,z)||1;Nm.setXYZ(k,sg*h*x/r,ny,sg*h*z/r);}}Nm.needsUpdate=true;return g;};
  const rr=p=>Math.hypot(p[0],p[1]),C=(p,r,n=0)=>ring(p[0],p[1],r,n);
  /* a sector [r0, r1] × [a0, a1] (rad, atan2(z, x)) in cells joined along their arcs: arcs cut at the given angles so neighbours share their points */
  const arcP=(r,as)=>{const o=[];for(let j=0;j<as.length-1;j++){const n=Math.max(2,Math.ceil(Math.abs(as[j+1]-as[j])*r/0.4));for(let i=j?1:0;i<=n;i++){const t=as[j]+(as[j+1]-as[j])*i/n;o.push([r*Math.cos(t),r*Math.sin(t)]);}}return o;};
  const sector=(r0,r1,as0,as1)=>[...arcP(r1,as1),...arcP(r0,as0).reverse()];
  /* a group whose +y points along unit u (for a screw put in along u: KIT's screw draws its shank toward +y), at point p */
  const along=(par,p,u)=>{const g=new THREE.Group();g.position.set(p[0],p[1],p[2]);g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(u[0],u[1],u[2]).normalize());par.add(g);return g;};
  const box=(par,w,h,d,x,y,z,mt)=>mesh(par,new THREE.BoxGeometry(w,h,d),mt,x,y,z);
  /* oak, drawn in code (the boxes photographed are oak: Greenwich's wartime Wempe, Lange 1947): pale ground, long dark grain and the rays */
  function oakTex(){const c=document.createElement('canvas');c.width=256;c.height=512;const x=/** @type {CanvasRenderingContext2D} */(c.getContext('2d'));x.fillStyle='#b48a55';x.fillRect(0,0,256,512);
    let s=11;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
    for(let i=0;i<140;i++){const xx=rnd()*256,a=0.05+rnd()*0.16,ph=rnd()*6,amp=1.5+rnd()*6;x.strokeStyle=rnd()<0.6?`rgba(90,55,25,${a})`:`rgba(235,200,150,${a})`;x.lineWidth=0.5+rnd()*2.2;x.beginPath();
      for(let y=0;y<=512;y+=16){const px=xx+Math.sin(y/120+ph)*amp;y?x.lineTo(px,y):x.moveTo(px,y);}x.stroke();}
    for(let i=0;i<60;i++){x.fillStyle=`rgba(225,190,140,${0.18+rnd()*0.2})`;x.fillRect(rnd()*256,rnd()*512,1+rnd()*1.5,6+rnd()*16);}
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
  /* the maker's plate (Firmenschild, 00 01 01-9, 22.3.43, 2:1): 26 × 52, white, the lettering sunk and filled black; the number runs on ("Nummer fortlaufend"): 3371 as drawn.
     Its letters measured on the sheet (6.98 px/mm): CHRONOMETERWERKE 4.0 high, 44 long; WEMPE and HAMBURG 2.4; the monogram 6 × 9 (a C over a W on one stroke); 3371 3.7 */
  function plateTex(){const k=20,c=document.createElement('canvas');c.width=52*k;c.height=26*k;const x=/** @type {CanvasRenderingContext2D} */(c.getContext('2d'));
    x.fillStyle='#f2f1ec';x.fillRect(0,0,c.width,c.height);x.fillStyle='#16171a';x.strokeStyle='#16171a';x.textAlign='center';x.textBaseline='middle';
    x.font=`700 ${4.0*k*1.36}px "Instrument Sans", Arial, sans-serif`;x.save();x.translate(26*k,6.6*k);fillTracked(x,'CHRONOMETERWERKE',44*k,0.8);x.restore();
    x.font=`700 ${2.4*k*1.36}px "Instrument Sans", Arial, sans-serif`;x.save();x.translate(13.5*k,13.2*k);fillTracked(x,'WEMPE',15*k);x.restore();x.save();x.translate(38.5*k,13.2*k);fillTracked(x,'HAMBURG',17*k);x.restore();
    x.lineWidth=0.55*k;x.beginPath();x.arc(26*k,11.6*k,2.0*k,0.35*Math.PI,1.65*Math.PI);x.stroke();x.beginPath();x.moveTo(23.4*k,13.6*k);x.lineTo(24.6*k,17.4*k);x.lineTo(26*k,14.6*k);x.lineTo(27.4*k,17.4*k);x.lineTo(28.6*k,13.6*k);x.stroke();
    x.beginPath();x.moveTo(26*k,9*k);x.lineTo(26*k,18*k);x.moveTo(24.4*k,16*k);x.lineTo(27.6*k,16*k);x.stroke();
    x.font=`600 ${2.6*k*1.36}px "Instrument Sans", Arial, sans-serif`;x.fillText('Type',13.5*k,20.6*k);x.font=`700 ${3.7*k*1.36}px "Instrument Sans", Arial, sans-serif`;x.fillText('3371',38.5*k,20.6*k);
    for(const[u,v]of[[2,2],[50,2],[2,24],[50,24]]){x.beginPath();x.arc(u*k,v*k,0.6*k,0,TAU);x.fill();}
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}

  function build(M){
    const S=(c,m,r,x={})=>new THREE.MeshStandardMaterial(Object.assign({color:sc(c),metalness:m,roughness:r},x));
    const MC={oak:S(0xffffff,0,0.55,{map:oakTex()}),oakEnd:S(0x8a6238,0,0.6),black:S(0x18181a,0.25,0.42),knob:S(0x111112,0.1,0.35),white:S(0xf2f1ec,0.1,0.5),
      label:new THREE.MeshStandardMaterial({map:plateTex(),metalness:0.1,roughness:0.5}),alu:S(0xc9ccd0,1,0.35)};
    const K=KIT.parts(new THREE.Group(),M),{screw}=K;   /* KIT's screw (its exploded-view list is its own: the case isn't exploded) */
    const root=new THREE.Group(),ringG=new THREE.Group(),bowlG=new THREE.Group();ringG.position.y=YP;root.add(ringG);ringG.add(bowlG);
    const prt=(par,name,y=0)=>{const g=new THREE.Group();g.userData.partName=name;g.position.y=y;par.add(g);return g;};

    /* ================= the bowl (Gehäusetopf, R-05 01 00-1, 6.3.42) ================= */
    /* "Ms-Sandguß (Kokillenguß)", 1:1, every figure of the sheet (sure): the flange Ø 118 for 12 from the top, the band Ø 108 to 23.5, the body Ø 106, the cone at 40° over
       its last 14.5 to the foot Ø 72.5, 65 overall; inside, the bore Ø 98, 53 deep, and the recess under the bottom Ø 64 × 5.5, so the bottom is 6.5 at the middle. The corner
       inside, between the bore and the bottom, a round drawn without a figure: r 7 (scaled at 3.45 px/mm, 6-8). It is the casting: what is machined isn't drawn, but for the
       closing plate's seat, the recess opened to Ø 68.2 (the plate is Ø 68 −0.2: estimated), and the two holes through the bottom: the winding hole over the fusee's square
       (hole 10, 22.65 from the centre: the closing plate's Ø 8 at 22.6 lies over it) and the closing plate's screw's, tapped M3 (estimated). The sheet's "Gewicht 350 gr."
       is light for brass (this solid is 1.3 kg in brass; 350 g is aluminium's or a moulded case's weight): README. The bowl's side keeps the brackets' screws
       (not cut: radial). Brass, as the sheet; the wartime Glashütte bowls were Bakelite, the 1942 arrangement names a Buna case (README) */
    const bowl=prt(bowlG,'bowl',-YP);
    {const cone=p=>YB-65+(rr(p)-36.25)*14.5/16.75,fil=p=>YB-46-Math.sqrt(Math.max(0,49-(rr(p)-42)**2));
      const rs=[34.1,36.25,42,43.2,44.4,45.5,46.5,47.3,48,48.5,49,53,54,59],ys=[[YB-59.5,YB-53],[YB-65,YB-53],[cone,YB-53],...Array(8).fill([cone,fil]),[cone,YB],[YB-23.5,YB],[YB-12,YB]];
      const F0=[{p:C(H[10],8.2/2,72),a:YB-59.5,b:YB-53},{p:C([0,0],1.52,40),a:YB-59.5,b:YB-53}];
      tag(mesh(bowl,smoothRev(solidGeo(cells(rs,ys,[F0]))),M.brass),'050100-1');}
    /* the two case brackets (Gehäusekloben 05 01 00-3), on the bowl's side at 12 and 6 o'clock, carrying the inner pivots b: no sheet; scaled on 05 01 (Schnitt A-B and C-D,
       2.45 px/mm) and Kirow 422's bowl (11_Kirow_DEC_422_Gehäuse.jpg): a plate on the body 44 long, 9 high, 3 thick, its two screws in slots ("Kloben verstellen bis Gleichgewicht
       erreicht ist": moved along the bowl until it hangs level), and a block 9 wide standing out to 3.5 short of the ring, up past the flange to 5.5 over the pivot, with the
       pivot's hole. Estimated (±1.5) */
    const brk=prt(bowl,'bowl'),ang=a=>a*D2R;
    for(const ph of[90,-90]){const g=tag(new THREE.Group(),'050100-3');brk.add(g);const a=ang(ph),w=Math.asin(4.5/59.5),q=ang(22);
      const P1=sector(53,56,[a-q,a+q],[a-q,a-w,a+w,a+q]),P2=sector(56,59.5,[a-w,a+w],[a-w,a+w]),P3=sector(59.5,66.5,[a-w,a+w],[a-w,a+w]);
      mesh(g,solidGeo([{loop:P1,y0:YB-33,y1:YB-24},{loop:P2,y0:YB-33,y1:YB-24},{loop:P3,y0:YB-33,y1:YB-6}]),M.brass);
      for(const s of[-1,1]){const b=a+s*ang(15.7),u=[-Math.cos(b),0,-Math.sin(b)];tag(screw(along(brk,[56*Math.cos(b),YB-28.5,56*Math.sin(b)],u),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-78');}}
    /* the locking bracket (Feststellkloben 05 01 00-4) at 50° from 6 o'clock toward 3 (05 01 Schnitt A-B's "50°"): a foot screwed to the body, cranked out past the band
       to an upright and a pad at the pivots' height, which the transit lock's lever presses the ring against. No sheet of its own: measured on 05 01 (phase 2d, the scan
       1024 px wide, enlarged 6×). The elevation's outside half (heights from the ring's top, which the "11,5" puts 11.5 over the pivots, at 2.47 px/mm by the bowl's 65; widths
       from the bowl's axis, the ring's inside there 69.4 at 2.46): the pad +5.5 to +1.3 about the pivots' line, the upright under it to −8.2, the crank's face −8.2 to −16.6
       stepping in toward the bowl, the foot's face −16.6 to −26.4 with its screw at −20.3; seen from 6 o'clock the pad spans 40.7-56.8 from the axis, the upright to 53.8,
       the foot 34.8-47.7. Schnitt A-B (at the pivots, 2.46 px/mm by its 160): the upright cut as a block 15.8 wide, its outer face 63.7 from the centre, at 49.8°. So
       (r, half-width 7.9 at r 60): the foot 53-56, the crank 56-59.6, the upright 59.6-63.7 (A-B's face; its inner face off the flange, Ø 118, which 05 01's 1940 bowl
       doesn't draw), the pad to 67.5 (the elevation's 56.8 at its corner): 2.5 short of the ring, its farthest point 67.7 from the gimbal centre, so the case turns in the
       ring without meeting it (P1f's estimate, the pad 12.5 under the pivots' line and 1 short, stopped the case at 8.5°: phase 2d). Every reading ±0.4 mm (a pixel); likely */
    {const g=tag(new THREE.Group(),'050100-4');brk.add(g);const a=ang(40),w=Math.asin(7.9/60),YQ=YB-11.5;   /* YQ: the pivots' height */
      const sp=()=>[a-w,a+w];mesh(g,solidGeo([{loop:sector(53,56,sp(),sp()),y0:YQ-26.4,y1:YQ-16.6},{loop:sector(56,59.6,sp(),sp()),y0:YQ-18,y1:YQ-7.4},{loop:sector(59.6,63.7,sp(),sp()),y0:YQ-8.2,y1:YQ+5.5},
        {loop:sector(63.7,67.5,sp(),sp()),y0:YQ+1.3,y1:YQ+5.5}]),M.brass);
      tag(screw(along(brk,[56*Math.cos(a),YQ-20.3,56*Math.sin(a)],[-Math.cos(a),0,-Math.sin(a)]),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-78');}

    /* ================= the closing plate (Verschlußplatte 05 01 00-2, rev. a 14.4.48) ================= */
    /* Ms, 1:1, every figure (sure but the hole Ø 1.2 at 12.4 and the 2 −0.05/−0.1, likely): Ø 68 −0.2, 2.3 at its rim, the boss Ø 28 −0.2 on its outer face making it 5 thick;
       the hole Ø 5.5 +0.1 through the middle, counterbored Ø 7.5 +0.1 from outside to 2 under the inner face; a groove Ø 10 to Ø 26, 1.5 deep, in the inner face; M2.6 at 25,
       Ø 1.2 at 12.4 (drawn at 12.35, inside the groove's edge) on one line, Ø 8 +0.2 at 22.6 at 90° to it. It lies in the bowl's foot, its inner face on the recess's floor and
       its boss 0.5 inside the foot, turning on its screw (7: WN-71, unsure) in the bottom: turned by the knob in its M2.6 (WN-72, brass on Wempe 3955,
       16_Wempe_3955_Gehäusetopf_Kardan.jpg), its Ø 8 comes over the winding hole for the key and away from it to close it; the closing spring (Verschlußfeder 05 01 00-7, 14 on 05 01)
       that holds it, likely in the groove with its end in the Ø 1.2, has no sheet: not drawn. Its turn: open, the Ø 8 over hole 10 */
    const cp=prt(bowlG,'closingPlate',-YP);
    {const t8=Math.atan2(H[10][1],H[10][0]),tk=t8-Math.PI/2,s0=t8+Math.PI/4,P=(r,t)=>[r*Math.cos(t),r*Math.sin(t)],y0=YB-64.5,yr=YB-61.8,y1=YB-59.5;
      const rs=[5,13,13.95,33.95],ys=[[y0,y1],[y0,y1-1.5],[y0,y1],[yr,y1]];
      const F=[[{p:C([0,0],5.55/2,48),a:y0,b:y1},{p:C([0,0],7.55/2,60),a:y0,b:y0+3}],[{p:C(P(12.35,tk),0.6,24),a:y0,b:y1-1.5}],[],[{p:C(P(22.6,t8),8.1/2,72),a:yr,b:y1},{p:C(P(25,tk),1.32,32),a:yr,b:y1}]];
      tag(mesh(cp,smoothRev(solidGeo(cells(rs,ys,F,s0))),M.brass),'050100-2');
      tag(screw(cp,0,0,y0+3,3.6,2.5,7.5,1.5,M.steel),'WN-71');   /* its screw: head Ø 7.2 × 2.5 in the counterbore, M3 through the plate into the bottom (estimated) */
      const kq=P(25,tk);tag(screw(cp,kq[0],kq[1],yr,2.6,2.4,2.2,1.3,M.brass),'WN-72');}   /* the knob: a brass head Ø 5.2 × 2.4 (Wempe 3955's), M2.6 (estimated) */

    /* ================= the bezel (Glasrand R-05 01 01-2, 6.3.42) and its glass (05 01 01-1) ================= */
    /* Ms, Kokillenguß, 1:1, every figure (sure): Ø 125 for its top 8.2, a 30° chamfer to Ø 116 at its underside, 16 high; the sight bore Ø 92 (it shows the dial's minute
       track, Ø 90), the lower bore Ø 106, 4.5 deep. It lies on the bowl's top face round the movement ring's flange (Ø 105.95, the same figure: the 1941 assembly 05 01 01 draws
       the flange's recess so, its depth scaling 4.2-5.2), the recess drawn 4.75 deep (the casting's 4.5 opened to the flange's 4.7) and relieved to Ø 104.2 a further 0.7 over the
       dial, which stands 0.6 proud of the flange (05 01 01 draws a step there), with a notch for the ring's radial pin (WN-202, Stellstift 3 in the coloured section) at 6 o'clock,
       which sets the movement's turn. The glass in a seat at the top: Ø 112 × 2.3 (05 01 01: Ø 111.7 scaled at 4.78 px/mm, its section 2.3), flush with the top face, so its
       underside is 16.7 over the pillar plate's dial face (05 02_1: 15.8, corrected in pencil to 17.0; the 1941 bezel's own section puts it at 15.3): README. How the bezel is held
       on the bowl isn't drawn (no screws in 05 01's list; Kirow 422's bezel is knurled, so screwed): not drawn */
    const bz=prt(bowlG,'bezel',-YP);
    {const b0=YB,top=YB+16,ch=p=>b0+(rr(p)-58)/Math.tan(30*D2R);
      const rec=bool(C([0,0],53.05,720),[[-0.75,52.5],[0.75,52.5],[0.75,55.3],[-0.75,55.3]]).uni[0];
      const F=[{p:rec,a:b0,b:b0+4.75},{p:C([0,0],52.1,720),a:b0,b:b0+5.45},{p:C([0,0],46,600),a:b0,b:top},{p:C([0,0],56.1,720),a:top-2.3,b:top}];
      tag(mesh(bz,smoothRev(solidGeo(cells([58,62.5],[[b0,top],[ch,top]],[F]))),M.brass),'050101-2');
      const gl=tag(mesh(bz,solidGeo([{loop:circ(56),y0:top-2.3,y1:top}]),M.glass),'050101-1');gl.userData.noShadow=1;gl.userData.inkBox=1;}   /* no Edges lines: a glass is drawn as a ghost, whose outline the line pass lays over everything, the box's wood in front of it too (the Hamilton's crystal and box glass are inkBox) */

    /* ================= the gimbal ring (Kardanring 05 01 00-5) and its bracket (Kardanringkloben 05 01 00-6) ================= */
    /* No sheets: scaled on 05 01 (2.45 px/mm by its 160 and the bowl's 106; circles fitted to Schnitt A-B: Ø 139.2 inside and 146.8 outside the lines, the elevation's section
       3.3 thick and 23.2 high): Ø 140 inside, 3.3 thick, 23.2 high, its top level with the bowl's, its pivots at mid height (likely). The outer pivots a on the 3-9 line, the inner b on
       12-6, in one plane, so the bowl swings about one point. At the 3 o'clock pivot a bracket on the ring's outside, its two screws in slots ("Kloben verstellen": moved to level the
       bowl), 57 long, 16.7 high, 3.3 thick, the pivot through it (Schnitt A-B, the elevation's outside half: estimated). The inner pivots: screws through the ring (12: WN-79) with
       lock nuts (10: WN-400), their points in the case brackets' holes ("Lagerstellen a u. b leicht spielend"): M4 (scaled), heads Ø 7 (estimated). Brass, as the bowl (no material
       given; Wempe 3955's is Bakelite) */
    const rgP=prt(ringG,'gimbalRing',-YP);
    {tag(mesh(rgP,smoothRev(solidGeo(cells([70,73.3],[[0,0],[YB-23.2,YB]]).slice(1))),M.brass),'050100-5');
      const q=28.5/73.3,ss=ang(18/73.3/D2R);tag(mesh(rgP,solidGeo([{loop:sector(73.3,76.6,[-q,q],[-q,q]),y0:YP-8.35,y1:YP+8.35}]),M.brass),'050100-6');
      for(const s of[-1,1])tag(screw(along(rgP,[76.6*Math.cos(s*ss),YP,76.6*Math.sin(s*ss)],[-Math.cos(s*ss),0,-Math.sin(s*ss)]),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-kr');
      for(const s of[-1,1]){const g=along(rgP,[0,YP,s*76.5],[0,0,-s]);tag(screw(g,0,0,0,3.5,2.8,13,2,M.steel),'WN-79');
        const nt=tag(mesh(g,new THREE.CylinderGeometry(7/Math.sqrt(3),7/Math.sqrt(3),3.2,6),M.steel,0,1.6,0),'WN-400');nt.rotation.y=Math.PI/6;}}

    /* ================= the wooden box (Holzkasten, 127-556.02) ================= */
    /* "Holzgehäuse 185 × 185 × 180 mm außen" (05 01, sure); its walls 12.5 (51 00 10's section, sure; 05 01 draws the walls 12.6 and their inside 160, its "160 Ø"); the line
       across 51 00 10's side 105 over the bottom taken as the lid's parting line (it lies at the ring's top, 11.5 over the pivot's M6: likely). Its other boards, joints and the lid's
       glazed top aren't on a sheet in the set: drawn as Greenwich's wartime Wempe (rmg_L5393_wempe_wartime_001.jpg) and Lange 1947 (drouot_33810142_*) show them, the floor
       12.5, the lid's top a frame 20 wide round a glass 3 thick, two hinges at the back: estimated. Oak, as both */
    const bx=prt(root,'box');
    {const B=tag(new THREE.Group(),'Holzkasten');bx.add(B);const hh=YL-YF-WT;
      box(B,2*BW,WT,2*BW,0,YF+WT/2,0,MC.oak);for(const s of[-1,1]){box(B,2*BW,hh,WT,0,YF+WT+hh/2,s*(BW-WT/2),MC.oak);box(B,WT,hh,2*BW-2*WT,s*(BW-WT/2),YF+WT+hh/2,0,MC.oak);}
      /* the outer pivots a (11: WN-80): M6 through the side walls (51 00 10: "Verbohren 4,8 mm Gew. M 6", 93.5 over the bottom), their ends the pivots in the ring's holes;
         heads Ø 9 × 3.8 (51 00 10's front and side views, 2.36 px/mm) and a brass bearing disc Ø 23 × 2.4 on each wall's inside (05 01's elevation, scaled): estimated */
      for(const s of[-1,1]){tag(screw(along(bx,[s*BW,YP,0],[-s,0,0]),0,0,0,4.5,3.8,22.5,3,M.steel),'WN-80');
        const d=tag(mesh(bx,new THREE.CylinderGeometry(11.5,11.5,2.4,48),M.brass,s*(BW-WT-1.2),YP,0),'Lagerscheibe');d.rotation.z=Math.PI/2;}
      /* the handles (Griff f. Chronometerkasten, Änderung von 51 00 10, 14.7.42, 1:1): a strip 100 long and 18 high, its ends 10 long flat on the side with a screw each, between
         them standing 10 off it, the grip pressed out to an oval 70 × 30, 6 deep; its middle 75 over the box's bottom, its top 3.5 under the pivot's screw (sure). The strip 3 thick (likely); the screws estimated */
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'510010');g.position.set(s*BW,YF+75,0);g.rotation.y=s>0?0:Math.PI;bx.add(g);
        const st=polyGeo([[0,-50],[3,-50],[3,-41],[10,-36],[10,36],[3,41],[3,50],[0,50],[0,40],[7,35],[7,-35],[0,-40]],18);st.translate(0,-9,0);mesh(g,st,MC.alu);   /* the strip seen from below: [off the side, along it] */
        const o=new THREE.Shape(stadiumPts([0,-20],[0,20],30).map(([y,z])=>V2(z,y)));const og=extrude(o,{depth:3,bevelEnabled:false,curveSegments:24});og.rotateY(Math.PI/2);mesh(g,og,MC.alu,7,-12,0);   /* the grip: the oval 70 × 30, hanging 12 below the strip's middle (its dashed outline on the sheet's front view, scaled at 2.36 px/mm) */
        for(const z of[-45,45])tag(screw(along(g,[3,0,z],[-1,0,0]),0,0,0,2.5,1.6,11,1.2,M.steel),'WN-hg');}
      /* the hinges, two at the back (estimated: Lange 1947's): leaves 40 × 18 × 1.2 on the back, the knuckle Ø 5 on the parting line */
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Scharnier');bx.add(g);box(g,40,18,1.2,s*55,YL-9,-BW-0.6,M.brass);const k=mesh(g,cylY(2.5,40,20),M.brass,s*55,YL,-BW-2.5);k.rotation.z=Math.PI/2;}}
    /* the lid: its walls 75 − 12.5 high on the box's, its top a frame round the glass (estimated, above); hinged at the back */
    const lidG=new THREE.Group();lidG.position.set(0,YL,-BW-2.5);root.add(lidG);const ld=prt(lidG,'lid');ld.position.z=2.5;   /* turning about the hinges' knuckles, 2.5 behind the back */
    {const B=tag(new THREE.Group(),'Holzkasten.D');ld.add(B);const h=YT-YL-WT,o=BW;
      for(const s of[-1,1]){box(B,2*BW,h,WT,0,h/2,o+s*(BW-WT/2),MC.oak);box(B,WT,h,2*BW-2*WT,s*(BW-WT/2),h/2,o,MC.oak);
        box(B,2*BW,WT,20,0,h+WT/2,o+s*(BW-10),MC.oak);box(B,20,WT,2*BW-40,s*(BW-10),h+WT/2,o,MC.oak);}
      const g=tag(box(ld,151,3,151,0,h-1.5,o,M.glass),'Deckelglas');g.userData.noShadow=g.userData.inkBox=1;   /* no Edges lines, as the bezel's glass */
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Scharnier',1);ld.add(q);box(q,40,18,1.2,s*55,9,-0.6,M.brass);}
      /* the maker's plate on the lid's front (Greenwich's wartime Wempe: its place), 26 × 52 aluminium, 1 thick (Alu 10: likely), on four pins in its Ø 1.2 holes */
      const fp=tag(new THREE.Group(),'000101-9');fp.position.set(0,42,2*BW+0.5);ld.add(fp);box(fp,52,26,1,0,0,0,MC.white);
      const dg=mesh(fp,new THREE.PlaneGeometry(52,26),MC.label,0,0,0.52);dg.userData.decal=1;
      for(const[u,v]of[[-24,11],[24,11],[-24,-11],[24,-11]]){const n=mesh(fp,cylY(0.9,0.6,12),M.steel,u,v,0.8);n.rotation.x=Math.PI/2;}}
    /* the latch tongue (Zunge, P. 51 00 02-2, 18.9.42, 2:1): iron flat 10 × 4, bonderised and black lacquered, 45 long, 10 wide at its round end tapering 2°40' along one edge to 8
       at the other, the hole Ø 6.2 (sunk 0.5 × 45°) 6 from its round end and 39 from the other, M3.5 14 from it (sure); its last 7 thinned 0.2 (not drawn). Where it goes isn't
       drawn: taken as the lid's latch, turning on a screw in its Ø 6.2 on the lid's front over the parting line, its end under a keeper on the box's front, a knob in its M3.5
       (Greenwich's wartime Wempe has a latch there): estimated */
    const tgG=new THREE.Group();tgG.position.set(0,12,2*BW);ld.add(tgG);const tz=prt(tgG,'lid');
    {const arc=(c,r,t0,t1,n)=>[...Array(n+1).keys()].map(i=>{const t=t0+(t1-t0)*i/n;return[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];});
      const out=[[-5,-1],[-5,35],...arc([-1,35],4,Math.PI,0,12).slice(1,-1),[3,35],[5,-1],...arc([0,-1],5,0,-Math.PI,16).slice(1,-1)];   /* plan [across, along]: the hole at 0, the round end r 5, the far end r 4 at 39 */
      const geo=polyGeo(out,4,[[0,0,3.1],[0,14,1.77,1]]);geo.rotateX(Math.PI/2);tag(mesh(tz,geo,MC.black),'P510002-2');   /* hanging down the lid's front, 4 thick out from it */
      tag(screw(along(tz,[0,0,4],[0,0,-1]),0,0,0,4.5,2,12,3,M.steel),'WN-zg');   /* its pivot screw, M6 in the Ø 6.2, head Ø 9 (estimated) */
      const kn=tag(new THREE.Group(),'WN-zk');kn.position.set(0,-14,4);tz.add(kn);const kg=new THREE.LatheGeometry([V2(0,0),V2(1.75,0),V2(1.75,1.5),V2(3,1.5),V2(3,6),V2(2.5,7),V2(0,7)],24);kg.rotateX(Math.PI/2);mesh(kn,kg,MC.knob);}   /* its knob in the M3.5 (estimated) */
    /* its keeper on the box's front (estimated): a strap 16 wide, 1.5 thick, 4.4 off the front over the tongue's end */
    {const g=tag(new THREE.Group(),'Schliessblech');bx.add(g);box(g,18,10,1.5,0,YL-26,BW+5.15,M.steel);for(const s of[-1,1])box(g,3,10,4.4,s*7,YL-26,BW+2.2,M.steel);}

    /* ================= the transit lock (Feststeller, 15 on 05 01; its number 05 01 01 in 05 01's list, which Glasrand kompl.'s own sheet also bears) ================= */
    /* No sheet: scaled on 05 01's Schnitt A-B: a knob Ø 19.6 turning a lever in the box's front right corner (the knob's axis 65 and 63 from the box's centre), its lever 28 long and
       8 wide, a pin Ø 8 near its end, on a bracket on the right wall; turned toward the centre the lever presses the ring onto the locking bracket on the bowl, so neither gimbal
       swings; drawn turned off, along the front wall. Heights not drawn: the lever at the ring's, the knob above it (Greenwich's wartime Wempe has a black knob there): estimated */
    const lk=prt(root,'caseLock');
    {const c=[65.1,62.9],e=[39,73];const g=tag(new THREE.Group(),'050101.F');lk.add(g);
      box(g,5.3,20,15,80-2.65,YP-6,62.9,M.steel);box(g,20,4,12,70,YP-14,62.9,M.steel);
      cylBetween(g,2,YP-12,YP+16,M.steel,c[0],c[1],20);
      const lv=polyGeo(stadiumPts(c,e,8),4);lv.translate(0,YP-8,0);mesh(g,lv,M.steel);cylBetween(g,4,YP-10,YP-4,M.steel,51.4,66,24);
      const kn=new THREE.LatheGeometry([V2(0,0),V2(9.3,0),V2(9.8,0.5),V2(9.8,7.5),V2(8.8,9.5),V2(0,10)],40);mesh(g,kn,MC.knob,c[0],YP+15,c[1]);}

    /* ================= the winding key (Chronometerschlüssel 51 00 11, 16.7.43: one way) ================= */
    /* "Linksaufzug b. Rechtsdrehung entspannt sich die Feder": a coil spring round the tube grips it as the key winds and slips the other way, so the key can't be forced
       backward (the Hamilton's key isn't one-way). Its parts, 2:1: the handle (51 00 11-1), a flat round paddle Ø 34.5 (scaled, 6.94 px/mm), 3 thick in the body's slot (3 H11),
       its centre 10.6 over the body; the body (Schlüsselmittelteil 05 01 02-2, St. Az DIN 668, sand-blasted, phosphated, sprayed black, every figure: Ø 14.5 −0.2 with a 1.5 × 45°
       chamfer at the top, the 15° cone from 15.1 down, 25.1 −0.2 long; the bore Ø 8 +0.1 22 deep with its 120° point, Ø 6 +0.1 through the bottom; the cross hole Ø 2.5 for the
       grooved pin (51 00 11-6, K.S. 1); the slot 3 wide; the hole Ø 0.9 at 5° for the spring's end); the tube (Schlüsselrohr 05 01 02-3, Ms 58, every figure: its head Ø 8 −0.05 ×
       2.6 in the bore, Ø 5.95 −0.05 through the bottom, 50.1 −0.2 long, the square 3.1 +0.05, 19 +2 deep, drilled 23 deep, a 60° sink 1 deep, the end relieved over 2.5); the coil
       spring (Wendelfeder 51 00 11-4) round the tube between its head and the bore's floor. The paddle's centre 10.95 over the body's top: the slot's floor is the Ø 35 arc 6.3
       +0.1 deep (05 01 02-2's side view, sure), on which the Ø 34.5 paddle's rim stands (17.25 − 6.3; 10.6 scaled on 51 00 11, which put its rim 0.35 into the floor). The
       grooved pin across the slot, through the paddle's thickness (05 01 02-2: the cross hole runs across the 3 slot in the section and shows end-on in the side view, as the hole
       through the paddle's face does on 51 00 11's outside view), 4 −0.05 under the top. The square 3.1 +0.05 across, 19 deep, its corners on the key's x and z as the fusee
       arbor's square has them (its 60° sink 1 deep left out). The tube's head drawn 6.8 under the body's top (so it clears the paddle; the free length then 31.8, scaled 30),
       the spring's wire 0.9, the end's relief to Ø 4.6, the slot and cross hole not cut: estimated. Built in the key's own frame (its axis +y, the tube's mouth at 0) in its
       part's group, which lies on the box's floor or, while it winds, sits on the fusee's square (keyAt) */
    const key=prt(root,'key'),KEYREST=()=>{key.position.set(-62,YF+WT+7.25,-40);key.rotation.set(Math.PI/2,19.8*D2R,0);};KEYREST();   /* on its body and its paddle's rim: the paddle 19.8° from flat (17.25 sin + 1.5 cos = 7.25) */
    {const g=new THREE.Group();key.add(g);
      const lathe=(pr,n=40)=>{let q=[...pr,pr[0]];if(area(q)<0)q=q.slice().reverse();return new THREE.LatheGeometry(q.map(([r,y])=>V2(r,y)),n);};
      const T=50.1,B0=31.8,BT=B0+25.1,sq=3.15/Math.SQRT2;
      tag(mesh(g,smoothRev(solidGeo(cells([2.3,2.975],[[0,19],[p=>(rr(p)-2.3)*2.5/0.675,19]],[[{p:[[sq,0],[0,sq],[-sq,0],[0,-sq]],a:0,b:19}]]))),M.brass),'050102-3');   /* the socket end: the square, the relief */
      tag(mesh(g,lathe([[1.45,19],[2.975,19],[2.975,T-2.9],[3.275,T-2.6],[4,T-2.6],[4,T],[0,T],[0,23],[1.45,22.2]]),M.brass),'050102-3',1);   /* on: the drilled hole's end, the head */
      tag(mesh(g,lathe([[3.05,B0],[4.57,B0],[7.25,B0+10],[7.25,BT-1.5],[5.75,BT],[4.05,BT],[4.05,BT-22],[3.05,BT-22-0.58]]),MC.black),'050102-2');
      const pd=tag(mesh(g,cylY(17.25,3,72),MC.black,0,BT+10.95,0),'510011-1');pd.rotation.x=Math.PI/2;
      const pn=tag(mesh(g,cylY(1.25,13,16),M.steel,0,BT-4,0),'510011-6');pn.rotation.x=Math.PI/2;
      /* the spring: 0.9 wire on Ø 7.0 mean, close wound from the bore's floor to the tube's head */
      const y0=BT-22+0.45,y1=T-2.6-0.45,nT=(y1-y0)/0.92,cv=new THREE.Curve();cv.getPoint=t=>new THREE.Vector3(3.51*Math.cos(t*nT*TAU),y0+(y1-y0)*t,3.51*Math.sin(t*nT*TAU));
      tag(mesh(g,closeGeo(new THREE.TubeGeometry(cv,Math.ceil(nT*24),0.44,6,false)),M.steel),'510011-4');}
    /* keyAt(seat): the key onto the fusee's square (seat {g, y}: fusee.js keySeat, the dust plate's group, which turns with the fusee, and its face, where the square is 3.1
       across and the tube's mouth stops), its axis down the square (the movement frame's −y), or (no seat) back on the box's floor */
    const keyAt=s=>{if(s){s.g.add(key);key.position.set(0,s.y-0.05,0);key.rotation.set(Math.PI,0,0);}else{root.add(key);KEYREST();}};
    return{root,ring:ringG,bowl:bowlG,lid:lidG,tongue:tgG,YP,YB,keyAt,parts:{bowl,closingPlate:cp,bezel:bz,gimbalRing:rgP,box:bx,lid:ld,caseLock:lk,key}};}
  return{build,YP:YB-11.5,YB};
})();
