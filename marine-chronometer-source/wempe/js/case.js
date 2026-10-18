// @ts-check
/* case.js: the Wempe Einheits-Chronometer's gimballed case and wooden box (drawing groups 05 01 and 51 00), built from their sheets as last revised
   (References/wempe/transcriptions/05-01-51-00-case-box-overview.md, checked on the sheets themselves, cropped and enlarged where a number mattered): the bowl
   (Gehäusetopf R-05 01 00-1, 6.3.42), its two brackets for the inner pivots and the locking bracket (Gehäusekloben 05 01 00-3, Feststellkloben -4), the closing plate in its foot
   (Verschlußplatte 05 01 00-2, rev. a 14.4.48), the bezel and its glass (Glasrand R-05 01 01-2, 6.3.42; Glasrand kompl. 05 01 01), the gimbal ring with its bracket, pivot
   screws and lock nuts (Kardanring 05 01 00-5, Kardanringkloben -6, WN-79, WN-400, 05 01 Gehäuse Kardan, 1940, reissued 28.6.46), the transit lock (Feststeller, 15 on
   05 01), the wooden box with its lid, hinges, handles (51 00 10), maker's plate (Firmenschild 00 01 01-9, "Type 3371") and latch tongue (Zunge P. 51 00 02-2), the outer
   pivots (WN-80) in the box's walls, and the one-way winding key of 1943 (Chronometerschlüssel 51 00 11: 05 01 02-2, -3), standing in its holder in the box's back right corner.
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
  /* DY6: how much lower the Soviet 6MX's bowl hangs in the gimbals: its case brackets' pivot holes 3.0 under the threaded rim's top (YB + 1.7: Kirov No. 247's bowl,
     12_Kirow_247_E-Kontakt_3.jpg and 11_Kirow247_E-Kontakt_2.jpg, a camera fitted in the meridian plane, ±2; Kirov 2973's 3.7 under), where the drawings' are 11.5 under the
     ring's top (YB − 11.5): likely. Kirov-Poljot 24020, later, has them about 10.8 under: the 1950s bowls' are the higher */
  const DY6=YB+1.7-YP;
  const HGL=148,HGT=0.6,STA=5,STB=40,STC=20,STD=45,STL=91,SS0=23.5,SS1=86.5;   /* the hinge's length and leaf, the lid stay's pivot (over the parting line, from the back's outside), its pin (under it, from the back) and the bar, its slot from the pivot */
  const KX=BW-WT-16.5,KZ=-(BW-WT-16.5),KH=YF+WT+65;   /* the key's holder: its hole's centre (back right, 16.5 from each wall) and its shelf's top (the box, below) */
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
  /* a straight knurl: n teeth round a circle r, d deep (a tip at r, a root at r - d half a pitch on), h high from y 0, a hole hr through it (or none) */
  const knurlPts=(r,d,n,a0=0)=>{const o=[];for(let j=0;j<n;j++){const a=a0+j/n*TAU,b=a+Math.PI/n;o.push([r*Math.cos(a),r*Math.sin(a)],[(r-d)*Math.cos(b),(r-d)*Math.sin(b)]);}return o;};
  const knurl=(r,d,h,n,hr=0)=>polyGeo(knurlPts(r,d,n),h,hr?[[0,0,hr]]:[]);
  const box=(par,w,h,d,x,y,z,mt)=>mesh(par,new THREE.BoxGeometry(w,h,d),mt,x,y,z);
  /* the box's mahogany, drawn in code, as Wempe No. 6161's (Antiquorum 208-4, a brass bowl in brass gimbals as the drawings' Ms.): its colours sampled on that photograph,
     the lid's lit front a median #904527, its grain #773921 to #bb8166, the box's front in shade #491a10 to #8c4e34; quarter-sawn, so a ribbon figure of long light and dark
     bands, and fine pores; the texture's ground and bands about 0.7 of those, since the page's light renders a colour about 1.4 times the photograph's (the Case view's
     box front #a34d32 drawn with the sampled colours). The wartime boxes photographed (Greenwich's wartime Wempe, Lange 1947) are oak round a Bakelite bowl: the brass bowl drawn is 6161's.
     Birch (the outer box's, "gebleichte Birke": bleached birch): a pale ground and fine long grain */
  /* kirov: the 6MX's boxes, Kirov 247's (14_Kirow_247_Kasten_2.jpg, 13_Kirow_247_Kasten_1.jpg): an orange lacquered wood, sampled medians #dc6914 to #e07c3e (its
     10th-90th percentiles #c54807 to #e9821e), fine and even in grain; drawn as the mahogany is, its ground and bands about 0.7 of those (#9b4c16) */
  function woodTex(birch,kirov){const c=document.createElement('canvas');c.width=256;c.height=512;const x=/** @type {CanvasRenderingContext2D} */(c.getContext('2d'));x.fillStyle=birch?'#e4d5b7':kirov?'#9b4c16':'#66301a';x.fillRect(0,0,256,512);
    let s=birch?23:kirov?37:11;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
    const line=(xx,amp,ph,w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.beginPath();for(let y=0;y<=512;y+=16){const px=xx+Math.sin(y/120+ph)*amp;y?x.lineTo(px,y):x.moveTo(px,y);}x.stroke();};
    if(birch){for(let i=0;i<140;i++){const a=0.03+rnd()*0.08;line(rnd()*256,1.5+rnd()*6,rnd()*6,0.5+rnd()*1.2,rnd()<0.6?`rgba(150,120,80,${a})`:`rgba(235,200,150,${a})`);}}
    else if(kirov){for(let xx=-8;xx<264;){const w=6+rnd()*22,lt=rnd()<0.5;line(xx+w/2,1.5+rnd()*3,rnd()*6,w,lt?`rgba(170,92,36,${0.15+rnd()*0.2})`:`rgba(122,52,12,${0.12+rnd()*0.2})`);xx+=w;}
      for(let i=0;i<500;i++){x.fillStyle=`rgba(90,36,8,${0.15+rnd()*0.25})`;x.fillRect(rnd()*256,rnd()*512,0.7,1+rnd()*3);}}   /* fine flecks: a close, even grain */
    else{for(let xx=-8;xx<264;){const w=8+rnd()*30,lt=rnd()<0.5;line(xx+w/2,2+rnd()*3,rnd()*6,w,lt?`rgba(140,84,60,${0.18+rnd()*0.22})`:`rgba(58,20,9,${0.15+rnd()*0.25})`);xx+=w;}   /* the ribbon: bands toward the sampled light and dark */
      for(let i=0;i<90;i++){const a=0.05+rnd()*0.15;line(rnd()*256,1+rnd()*4,rnd()*6,0.4+rnd()*1.4,rnd()<0.7?`rgba(40,14,6,${a})`:`rgba(150,90,62,${a})`);}
      for(let i=0;i<900;i++){x.fillStyle=`rgba(40,14,6,${0.25+rnd()*0.35})`;x.fillRect(rnd()*256,rnd()*512,0.8,2+rnd()*5);}}   /* the pores, short dark dashes along the grain */
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
  /* a cushion (the outer box's Polster, 51 00_5): w × h on a board, standing out along its own +y from 0, t0 thick at its rim rising as (1 − u²)(1 − v²) (u, v −1 to 1 across it)
     to T in its middle, as 51 00_5's sections draw each one, a lens thickest at its middle; one closed solid, its face shaded smooth */
  function pillow(w,h,T,t0=1,n=32){const th=(u,v)=>t0+(T-t0)*(1-u*u)*(1-v*v),P=[],Nm=[],put=(p,q)=>{P.push(...p);Nm.push(...q);};
    const top=(i,j)=>{const u=2*i/n-1,v=2*j/n-1,dx=-(T-t0)*2*u*(1-v*v)*2/w,dz=-(T-t0)*(1-u*u)*2*v*2/h,l=Math.hypot(dx,1,dz);return[[u*w/2,th(u,v),v*h/2],[-dx/l,1/l,-dz/l]];};   /* dx, dz: dt/dx, dt/dz */
    for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=top(i,j),b=top(i,j+1),c=top(i+1,j),d=top(i+1,j+1);for(const q of[a,b,c,c,b,d])put(q[0],q[1]);
      const B=(ii,jj)=>[(2*ii/n-1)*w/2,0,(2*jj/n-1)*h/2];for(const q of[B(i,j),B(i+1,j),B(i,j+1),B(i+1,j),B(i+1,j+1),B(i,j+1)])put(q,[0,-1,0]);}
    const side=(p0,p1,o)=>{const q=[[p0[0],0,p0[2]],[p1[0],0,p1[2]],[p1[0],p1[1],p1[2]],[p0[0],p0[1],p0[2]]];for(const k of[0,2,1,0,3,2])put(q[k],o);};   /* a rim's wall, p0 to p1 clockwise seen from outside */
    for(let k=0;k<n;k++){const e=(i,j)=>top(i,j)[0];side(e(k,0),e(k+1,0),[0,0,-1]);side(e(n,k),e(n,k+1),[1,0,0]);side(e(n-k,n),e(n-k-1,n),[0,0,1]);side(e(0,n-k),e(0,n-k-1),[-1,0,0]);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(Nm,3));return g;}
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
  /* Kirov 247's box plates (14_Kirow_247_Kasten_2.jpg): the factory's diamond badge, a light metal rhombus 38.6 × 24 lettered black "1 / МЧЗ / им. Кирова" (the 1 over
     the Ч), two pins at its side corners; the number plate, a disc Ø 31 of the same metal with a darker rim, "247", a screw over and under the figures. Sizes by the hasp's
     width (53, below): ±1. The lettering's form is the photograph's by eye, drawn in the page's sans-serif */
  function kirovTex(kind){const k=24,W=kind==='badge'?38.6:31,H=kind==='badge'?24:31,c=document.createElement('canvas');c.width=Math.round(W*k);c.height=Math.round(H*k);
    const x=/** @type {CanvasRenderingContext2D} */(c.getContext('2d'));x.fillStyle='#aaa392';x.fillRect(0,0,c.width,c.height);x.fillStyle='#1d1b18';x.textAlign='center';x.textBaseline='middle';
    const F=(sz,w=700)=>`${w} ${sz*k*1.36}px "Instrument Sans", Arial, sans-serif`;   /* sz: the capitals' height, mm */
    if(kind==='badge'){x.strokeStyle='#4a4335';x.lineWidth=0.9*k;x.beginPath();x.moveTo(0.4*k,H/2*k);x.lineTo(W/2*k,0.6*k);x.lineTo((W-0.4)*k,H/2*k);x.lineTo(W/2*k,(H-0.6)*k);x.closePath();x.stroke();
      x.font=F(3.0);x.fillText('1',W/2*k,7.3*k);x.font=F(4.0);x.fillText('МЧЗ',W/2*k,11.2*k);x.font=`italic ${F(2.4,600)}`;x.fillText('им. Кирова',W/2*k,15.6*k);
      for(const u of[3.5,W-3.5]){x.beginPath();x.arc(u*k,H/2*k,0.7*k,0,TAU);x.fillStyle='#6f6857';x.fill();}}
    else{x.strokeStyle='#4d4a44';x.lineWidth=1.2*k;x.beginPath();x.arc(W/2*k,H/2*k,(W/2-0.6)*k,0,TAU);x.stroke();x.font=F(6.8,500);x.fillText('247',W/2*k,H/2*k);
      for(const v of[3.2,H-3.2]){x.beginPath();x.arc(W/2*k,v*k,0.8*k,0,TAU);x.fillStyle='#8d877a';x.fill();}}
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}

  function build(M){
    const S=(c,m,r,x={})=>new THREE.MeshStandardMaterial(Object.assign({color:sc(c),metalness:m,roughness:r},x));
    const MC={mah:S(0xffffff,0,0.42,{map:woodTex()}),black:S(0x18181a,0.25,0.42),knob:S(0x111112,0.1,0.35),white:S(0xf2f1ec,0.1,0.5),
      label:new THREE.MeshStandardMaterial({map:plateTex(),metalness:0.1,roughness:0.5}),alu:S(0xc9ccd0,1,0.35),
      birch:S(0xffffff,0,0.6,{map:woodTex(true)}),kir:S(0xffffff,0,0.38,{map:woodTex(false,true)}),badge:new THREE.MeshStandardMaterial({map:kirovTex('badge'),metalness:0.5,roughness:0.45}),
      num:new THREE.MeshStandardMaterial({map:kirovTex('num'),metalness:0.5,roughness:0.45}),felt:S(0x5b5f55,0,0.95),leather:S(0x5a3a22,0,0.7)};   /* the outer box's bleached birch; its cushions' cover and the strap: not given (estimated) */
    const K=KIT.parts(new THREE.Group(),M),{screw}=K;   /* KIT's screw (its exploded-view list is its own: the case isn't exploded) */
    const root=new THREE.Group(),ringG=new THREE.Group(),bowlG=new THREE.Group(),bowlS=new THREE.Group();ringG.position.y=YP;root.add(ringG);ringG.add(bowlG);bowlG.add(bowlS);
    /* bowlS: what the bowl carries (the bowl, its closing plate and bezel, the movement: app.js adds it to out.inner), hung from the inner pivots: the drawings' case
       brackets hold them 11.5 under the ring's top (YP); the Soviet 6MX's (Kirov No. 247's) 1.7 over it, so its bowl hangs 13.2 lower in the gimbals (DY6, rev) */
    const prt=(par,name,y=0)=>{const g=new THREE.Group();g.userData.partName=name;g.position.y=y;par.add(g);return g;};
    /* the versions (movement.js's setRev; app.js shows each group whose rev lists the version): rv(par, 'last first' or '6mx') a group of the pieces only those versions have */
    const rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;};
    const Y6=row=>YB-65+(row-56)*0.13215;   /* a row of Kirov 422's bowl photograph (11_Kirow_DEC_422_Gehäuse.jpg) put on the movement's frame: the 6MX's bowl, below */

    /* ================= the bowl (Gehäusetopf, R-05 01 00-1, 6.3.42) ================= */
    /* "Ms-Sandguß (Kokillenguß)", 1:1, every figure of the sheet (sure): the flange Ø 118 for 12 from the top, the band Ø 108 to 23.5, the body Ø 106, the cone at 40° over
       its last 14.5 to the foot Ø 72.5, 65 overall; inside, the bore Ø 98, 53 deep, and the recess under the bottom Ø 64 × 5.5, so the bottom is 6.5 at the middle. The corner
       inside, between the bore and the bottom, a round drawn without a figure: r 7 (scaled at 3.45 px/mm, 6-8). It is the casting: what is machined isn't drawn, but for the
       closing plate's seat, the recess opened to Ø 68.2 (the plate is Ø 68 −0.2: estimated), and the two holes through the bottom: the winding hole over the fusee's square
       (hole 10, 22.65 from the centre: the closing plate's Ø 8 at 22.6 lies over it) and the closing plate's screw's, tapped M3 (estimated). The sheet's "Gewicht 350 gr."
       is light for brass (this solid is 1.3 kg in brass; 350 g is aluminium's or a moulded case's weight): README. The bowl's side keeps the brackets' screws
       (not cut: radial). Brass, as the sheet; the wartime Glashütte bowls were Bakelite, the 1942 arrangement names a Buna case (README) */
    const bowl=prt(bowlS,'bowl',-YP);
    /* in two solids: the bottom inside the recess's wall (r 34.1), cut by its two holes, and the rest turned from its profile (the foot, the cone, the body, band and flange, the
       bore and the round inside), which nothing crosses. Until 15 October 2026 the whole was plan cells of rings, whose narrow sloped rings under the round left cracks along
       the cone, seen through once the bowl is turned over to wind. CSI: the closing spring's inner end, in a hole Ø 1.2, 1.5 deep, in the recess's floor (the closing plate, below) */
    const CSI=[6.5,Math.atan2(H[10][1],H[10][0])-Math.PI/2-25*D2R];   /* [r, angle]: its outer end's place in the plate shut (the plate's 25°, CPS below) */
    {const F0=[{p:C(H[10],8.2/2,72),a:YB-59.5,b:YB-53},{p:C([0,0],1.52,40),a:YB-59.5,b:YB-53},{p:C([CSI[0]*Math.cos(CSI[1]),CSI[0]*Math.sin(CSI[1])],0.6,24),a:YB-59.5,b:YB-58}];
      tag(mesh(bowl,solidGeo([{loop:circ(34.1),y0:YB-59.5,y1:YB-53,F:F0}]),M.brass),'050100-1');
      /* the winding hole's seat inside: a raised ring round the hole on the bottom, which the cork ring on the dust bush (05 08 01-4, frame.js) meets. Not on the casting's
         sheet (it draws no hole and nothing machined); the 6MX's bowls have it: moMvyx8eXfo 3:35 (1080p, the bowl empty) a flat-topped ring standing on the bottom round
         the hole (sure that it stands), 72 px across against the hole's 38.5, so Ø 15.3 by the hole's 8.2 (likely), the cork's 16.1 nearly; its top an ellipse 60 px by 72,
         so seen 34° from the axis, its near wall 8.5 ±1.5 px high at about 4.5 px/mm (the bottom's scale), 3.4 ±0.6 high (rough); DIxob2Rl4dc 5:09 (480p) a pale ring
         there, so perhaps a pressed bush. Without it the cork stands 3.84 short of the bottom; drawn to the cork's top, 3.84 high (estimated: inside the video's height),
         its bore the hole's 8.2 */
      {const ya=YB-53,yb=YB-53+3.84;tag(mesh(bowl,new THREE.LatheGeometry([V2(4.1,ya),V2(7.65,ya),V2(7.65,yb),V2(4.1,yb),V2(4.1,ya)],72),M.brass,H[10][0],0,H[10][1]),'050100-1',1);}
      const fil=[...Array(13).keys()].map(i=>{const t=i/12*Math.PI/2;return[42+7*Math.sin(t),YB-46-7*Math.cos(t)];}).reverse();   /* the round r 7 about (42, YB − 46), from the bore's wall down to the floor */
      const pr=[[34.1,YB-65],[36.25,YB-65],[53,YB-50.5],[53,YB-23.5],[54,YB-23.5],[54,YB-12],[59,YB-12],[59,YB],[49,YB],...fil,[34.1,YB-53]];
      const lg=pr=>{const g=new THREE.LatheGeometry([...pr,pr[0]].map(([r,y])=>V2(r,y)),N).toNonIndexed();g.computeVertexNormals();return smoothRev(g);};   /* each face its own normal, then smoothed round the axis only (smoothRev), so the profile's corners stay sharp */
      tag(mesh(rv(bowl,'last first'),lg(pr),M.brass),'050100-1',1);
      /* the Soviet 6MX's bowl (the Variants' Version, '6mx'): the same inside (the bore, its round, the bottom, the recess and its closing plate, the winding hole's seat: the
         movement is the drawings' and stands in it as drawn), turned outside to another profile, with a threaded rim for the knurled bezel (below). Its radii: the rim
         Ø 110.5, measured on Kirov 247's dial photograph (dg-chrono-6mx/1_Kirow_247_Z.jpg, in its bowl, the bezel off) by dialtrace.py's own fit of the dial (8.75 px/mm,
         0.03 rms): the movement ring's flange ends at r 53.0 (its 105.95: sure) and the bowl's dark rim outside it at r 55.0-55.6 round the dial (24 rays; ±0.6 for its
         height under the dial); the dial photographs of Kirov 009, 1564, 2973, 22823, 23239 and Poljot 00127 in their bowls show the same narrow rim (by eye). The rest
         on Kirov 422's bowl turned over (dg-chrono-dec/11_Kirow_DEC_422_Gehäuse.jpg, side on), its silhouette traced row by row and scaled by its band, 930 px, as that
         Ø 110.5 (8.42 px/mm): the body r 51.8 (51.6-52.2, smaller down the photograph as it lies farther from the camera), the foot r 37.5 (taken as the drawn 36.25: the
         camera, about 0.33 m off, makes the foot 5 % larger than the band), the cone between them, a stepped round out to the band. Their heights in the photograph's rows,
         put on the movement's frame by two ends: the foot's face at the drawn YB − 65 (the bottom and the recess as drawn, the floor where the cork ring's seat needs it),
         and the bezel's glass 0.65 over the hands (below): 0.1322 mm a row, 6.4 % more than the photograph's own vertical scale (8.05 px/mm), the stretch its close camera
         leaves unmeasured (9° up at the foot to over 20° at the bezel). So: the foot to row 76 (YB − 62.36), the cone to row 160 (YB − 51.26), the body to row 448
         (YB − 13.20), the round to the band by row 472 (YB − 10.03), the band to the bezel's edge at row 552 (YB + 0.55), its thread on under the bezel to the rim's top. The
         rim stands round the movement ring's flange, flush with its top (YB + 4.7): Kirov 14917 with its bezel off (rAw2zmulpk8 0:29, 2:52, 1080p) shows the thread
         running up to the gold flange round the dial; its counterbore r 53.05 down to the drawn seat at YB, a notch 1.8 wide at 12 o'clock for the ring's radial pin
         (WN-202, frame.js: its end at r 55.0, 1.9 over the seat) down to YB + 0.8, through the thin wall under the bezel (estimated). The thread isn't drawn. Estimated
         as the README says (heights ±2) */
      /* Since 18 October 2026 its outside measured with a camera fitted in the meridian plane, scaled by the rim's Ø 110.5, on Kirov 2973's bowl near side on
         (bilder-zum-6mx/13_Kirow_2973_E-Kontakt4.jpg, residuals under 0.3 px) and Kirov 247's own (12_Kirow_247_E-Kontakt_3.jpg), h from the threaded rim's top (YB + 4.7):
         the thread r 55.25 to h −5.55, a collar r 56.6 with a flat underside to −7.76, the body r 52.4 (52.2-52.6) to −46.7 (247's −47.0), a shallow cone traced to the foot
         r 36.7 at −55.3 (50.6/−47, 47.0/−49, 43.7/−51, 40.3/−53, 37.1/−55), the foot on past the frame to the drawn floor (YB − 65: its end isn't seen; ≥ 8.3 shown): likely.
         Until then Kirov 422's photograph scaled by its band gave a body r 51.8 ending 10 lower. A cone that high leaves no room for the drawings' bore (53 deep): the inside
         follows the outside, the bore r 49 then a cone 3.4 from the outer one (the body's wall) down to the recess's wall r 34.1, the floor where drawn (estimated: no 6MX's
         inside is photographed; the movement's lowest parts, the cork ring at r 30.7, clear it by 3.4 and more) */
      {const hY=h=>YB+4.7+h,B6=52.4;
        const cn=[[50.6,hY(-47)],[47.0,hY(-49)],[43.7,hY(-51)],[40.3,hY(-53)],[37.1,hY(-55)],[36.7,hY(-55.3)]].reverse();
        const sh=[[B6,hY(-7.76)],[56.6,hY(-7.76)],[56.6,hY(-5.55)],[55.25,hY(-5.55)]];
        const ci=[[49,hY(-44.69)],[34.1,hY(-52.84)]];   /* the inner cone: the outer's line (52.4, −46.7)-(36.7, −55.3) moved 3.4 across it, cut by the bore and the recess's wall */
        const p6=[[34.1,YB-65],[36.7,YB-65],...cn,[B6,hY(-46.7)],...sh,[55.25,YB],[49,YB],...ci,[34.1,YB-53]];
        const g6=rv(bowl,'6mx');tag(mesh(g6,lg(p6),M.brass),'050100-1',1);
        const a=-Math.PI/2,w=0.9/53.05,R0=53.05,R1=55.25;   /* the rim: a full ring to the notch's floor, then the ring less the notch */
        tag(mesh(g6,solidGeo([{loop:circ(R1),y0:YB,y1:YB+0.8,F:[{p:circ(R0),a:YB,b:YB+0.8}]}]),M.brass),'050100-1',1);
        tag(mesh(g6,solidGeo([{loop:sector(R0,R1,[a+w,a+TAU-w],[a+w*R0/R1,a+TAU-w*R0/R1]),y0:YB+0.8,y1:YB+4.7}]),M.brass),'050100-1',1);}
        /* the electrical contact's parts in the bowl (Kirov No. 247: 11_Kirow247_E-Kontakt_2.jpg inside, 12_Kirow_247_E-Kontakt_3.jpg outside, a camera fitted on the
           bowl's band; Kirov 2973's the same; Romanov 1975, Fig. 95, 101 and p. 105's parts 63-66): two flat brass springs 66 inside, each a foot 5.5 high curved to the bore
           on a black insulating strip, held by two screws 65 through the wall, and three tines 6.5 wide rising from it and leaning in to bear on a block's outer end (spring A
           on block 52, +, 176-195°; B on block 57, −, 212-231°: train.js, WD.CONTACT6); outside, each spring's two slotted brass screws (heads Ø 5.6) and its terminal, a brass
           socket Ø 6.4 with a 3.0 hole standing 2 proud, each on a black fibre washer, all at y −27.5: A's at 178.4°, 189.3° and its + socket 200.6°, B's at 215.7°, 225.2° and
           − 235.9° (±1-3°, the case bracket's pivot taken as 180°): likely in kind and place; the springs' sizes estimated (±15 %). Bearings as frame.js's brg */
        {const gC=new THREE.Group();gC.userData.rev='6mx';bowl.add(gC);const pol=(t,r,y)=>[-r*Math.sin(t*D2R),y,-r*Math.cos(t*D2R)],inw=t=>[Math.sin(t*D2R),0,Math.cos(t*D2R)];
          const yF=-27.5,rI=49,arcB=(t0,t1,r0,r1,y0,y1)=>{const n=Math.max(4,Math.ceil(Math.abs(t1-t0)/2)),A=[],B=[];for(let i=0;i<=n;i++){const t=(t0+(t1-t0)*i/n)*D2R;A.push([-r1*Math.sin(t),-r1*Math.cos(t)]);B.push([-r0*Math.sin(t),-r0*Math.cos(t)]);}return{loop:[...A,...B.reverse()],y0,y1};};
          for(const[F0,F1,T0,T1,S1,S2,SK,id]of/** @type {[number,number,number,number,number,number,number,string][]} */([[174.4,203.6,176,195,178.4,189.3,200.6,'+'],[211.7,238.9,212,231,215.7,225.2,235.9,'−']])){
            const c1=arcB(F0,F1,rI-1,rI,yF-2.75,yF+2.75);c1.loop=KIT.area(c1.loop)>0?c1.loop:c1.loop.slice().reverse();tag(mesh(gC,solidGeo([c1]),M.packing),'6MX.cfi');   /* the insulating strip on the bore */
            const c2=arcB(F0,F1,rI-1.5,rI-1,yF-2.75,yF+2.75);c2.loop=KIT.area(c2.loop)>0?c2.loop:c2.loop.slice().reverse();tag(mesh(gC,solidGeo([c2]),M.brass),'6MX.cf');   /* the spring's foot */
            const tw=(T1-T0)/3,gap=0.8/(rI-1.5)/D2R;for(let k=0;k<3;k++){const tm=T0+tw*(k+0.5),y0=yF+2.75,y1=-4.5,r0=rI-1.25,r1=45.4+0.15,len=Math.hypot(y1-y0,r0-r1),lean=Math.atan2(r0-r1,y1-y0),wd=(tw-gap)*D2R*(rI-1.25);
              const b=tag(mesh(gC,new THREE.BoxGeometry(wd,len,0.3),M.brass,...pol(tm,(r0+r1)/2,(y0+y1)/2)),'6MX.cf',1);b.rotation.order="YXZ";b.rotation.y=tm*D2R+Math.PI;b.rotation.x=-lean;}   /* a tine, leaning in from the foot to the block's end */
            for(const t of[S1,S2]){const g=along(gC,pol(t,52.4,yF),inw(t));tag(mesh(g,cylY(4.25,1,40),M.packing,0,-0.5,0),'6MX.cfw');tag(screw(g,0,0,-1,2.8,3.0,5.9,1.0,M.brass),'6MX.cfs');}   /* a screw 65 on its washer, through the wall into the foot */
            {const g=along(gC,pol(SK,52.4,yF),inw(SK));tag(mesh(g,cylY(4.0,1,40),M.packing,0,-0.5,0),'6MX.cfw');tag(mesh(g,new THREE.LatheGeometry([[1.5,-3],[3.2,-3],[3.2,-1],[1.5,-1],[1.5,-3]].map(([r,y])=>V2(r,y)),40),M.brass),'6MX.cfk').userData.mark=id;}}}}
    /* the two case brackets (Gehäusekloben 05 01 00-3), on the bowl's side at 12 and 6 o'clock, carrying the inner pivots b: no sheet; scaled on 05 01 (Schnitt A-B and C-D,
       2.45 px/mm) and Kirow 422's bowl (11_Kirow_DEC_422_Gehäuse.jpg): a plate on the body 44 long, 9 high, 3 thick, its two screws in slots ("Kloben verstellen bis Gleichgewicht
       erreicht ist": moved along the bowl until it hangs level), and a block 9 wide standing out to 3.5 short of the ring, up past the flange to 5.5 over the pivot, with the
       pivot's hole. Estimated (±1.5) */
    const brk=prt(bowl,'bowl'),ang=a=>a*D2R;
    /* each version's on its body: the drawn bowl's r 53, the 6MX's r 51.8 (above), the plates 3 thick on it, the blocks where drawn (Kirow 422's, 11_Kirow_DEC_422_Gehäuse.jpg,
       are these: plates with two slotted screws in slots, a block with the pivot's hole) */
    const BRV=/** @type {[string,number][]} */([['last first',53]]).map(([V,rb])=>[rv(brk,V),rb,rb+3]);
    for(const[bv,rb,rp]of BRV)for(const ph of[90,-90]){const g=tag(new THREE.Group(),'050100-3');bv.add(g);const a=ang(ph),w=Math.asin(4.5/59.5),q=ang(22);
      const P1=sector(rb,rp,[a-q,a+q],[a-q,a-w,a+w,a+q]),P2=sector(rp,59.5,[a-w,a+w],[a-w,a+w]),P3=sector(59.5,66.5,[a-w,a+w],[a-w,a+w]);
      mesh(g,solidGeo([{loop:P1,y0:YB-33,y1:YB-24},{loop:P2,y0:YB-33,y1:YB-24},{loop:P3,y0:YB-33,y1:YB-6}]),M.brass);
      for(const s of[-1,1]){const b=a+s*ang(15.7),u=[-Math.cos(b),0,-Math.sin(b)];tag(screw(along(bv,[rp*Math.cos(b),YB-28.5,rp*Math.sin(b)],u),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-78');}}
    /* the locking bracket (Feststellkloben 05 01 00-4) at 50° from 6 o'clock toward 3 (05 01 Schnitt A-B's "50°"): a foot screwed to the body, cranked out past the band
       to an upright and a pad at the pivots' height, which the transit lock's lever presses the ring against. No sheet of its own: measured on 05 01 (phase 2d, the scan
       1024 px wide, enlarged 6×). The elevation's outside half (heights from the ring's top, which the "11,5" puts 11.5 over the pivots, at 2.47 px/mm by the bowl's 65; widths
       from the bowl's axis, the ring's inside there 69.4 at 2.46): the pad +5.5 to +1.3 about the pivots' line, the upright under it to −8.2, the crank's face −8.2 to −16.6
       stepping in toward the bowl, the foot's face −16.6 to −26.4 with its screw at −20.3; seen from 6 o'clock the pad spans 40.7-56.8 from the axis, the upright to 53.8,
       the foot 34.8-47.7. Schnitt A-B (at the pivots, 2.46 px/mm by its 160): the upright cut as a block 15.8 wide, its outer face 63.7 from the centre, at 49.8°. So
       (r, half-width 7.9 at r 60): the foot 53-56, the crank 56-59.6, the upright 59.6-63.7 (A-B's face; its inner face off the flange, Ø 118, which 05 01's 1940 bowl
       doesn't draw), the pad to 67.5 (the elevation's 56.8 at its corner): 2.5 short of the ring, its farthest point 67.7 from the gimbal centre, so the case turns in the
       ring without meeting it (P1f's estimate, the pad 12.5 under the pivots' line and 1 short, stopped the case at 8.5°: phase 2d). Every reading ±0.4 mm (a pixel); likely */
    /* the Soviet 6MX's (Kirov No. 247's: 12_Kirow_247_E-Kontakt_3.jpg, 11_Kirow247_E-Kontakt_2.jpg, the camera fitted in the meridian plane, scaled by the rim's Ø 110.5,
       heights ±2; Kirov 2973's the same form, Kirow 422's too), the high form: each case bracket a flat plate on the body 9.7 high (h −12.8 to −22.4 under the rim's top), its
       wings 27.5 either side of a block 8.7 wide which rises to 1.8 over the rim's top, the pivot's hole 4.8 under its top (YB + 1.7), the wings' slotted screws 16.8 from the
       block's middle at h −17.4, through the bowl's wall (the small holes in the bore 16-21 under the rim, two 29° apart on Kirov-Poljot 24020's: their ends: likely). The
       block 4.6 deep at the pivot (the reading), its outer face at the drawings' r 66.5 for the ring's pivot screw, a web to the plate under the collar; it stands clear of
       the screwed bezel (r 58.3 at its knurl). The locking bracket: an upright 11.7 wide, its foot on the body with two screws in a vertical slot at h −20.0 and −27.4, cranked
       out past the collar and the bezel to an L hook whose top is 3.8 over the rim's top: the pad the transit lock stops against at the pivots' height, as the drawings'
       (Romanov 1975, p. 204: the lock plate swings through the ring's slot until it stops against the bowl's hook). Its bearing kept the drawings' 50° from the case bracket
       (Kirov 247's reads 35-43°, 24020's 51°: the transit lock on the ring keeps its place); the plates' and web's thicknesses estimated */
    {const bv=rv(brk,'6mx'),rb=52.4,rp=rb+3,hY=h=>YB+4.7+h,w4=4.35;
      for(const ph of[90,-90]){const g=tag(new THREE.Group(),'050100-3');bv.add(g);const a=ang(ph),ws=w4/rp,wo=w4/64,wl=(w4+27.5)/rp;
        mesh(g,solidGeo([{loop:sector(rb,rp,[a-wl,a+wl],[a-wl,a-ws,a+ws,a+wl]),y0:hY(-22.4),y1:hY(-12.8)},{loop:sector(rp,61.9,[a-ws,a+ws],[a-wo,a+wo]),y0:hY(-22.4),y1:hY(-12.8)},
          {loop:sector(61.9,66.5,[a-wo,a+wo],[a-wo,a+wo]),y0:hY(-22.4),y1:hY(1.8)}]),M.brass);
        for(const s2 of[-1,1]){const b=a+s2*16.8/rp,u=[-Math.cos(b),0,-Math.sin(b)];tag(screw(along(bv,[rp*Math.cos(b),hY(-17.4),rp*Math.sin(b)],u),0,0,0,2.4,1.6,6.4,1.25,M.steel),'6MX.bks');}}
      const g=tag(new THREE.Group(),'050100-4');bv.add(g);const a=ang(40),w=5.85/60,sp=()=>[a-w,a+w];
      mesh(g,solidGeo([{loop:sector(rb,rp,sp(),sp()),y0:hY(-30.5),y1:hY(-16.5)},{loop:sector(rp,59,sp(),sp()),y0:hY(-19.5),y1:hY(-16.5)},{loop:sector(59,62,sp(),sp()),y0:hY(-19.5),y1:hY(3.8)},
        {loop:sector(62,67.5,sp(),sp()),y0:hY(-2.0),y1:hY(3.8)}]),M.brass);
      for(const h of[-20.0,-27.4])tag(screw(along(bv,[rp*Math.cos(a),hY(h),rp*Math.sin(a)],[-Math.cos(a),0,-Math.sin(a)]),0,0,0,2.4,1.6,6,1.25,M.steel),'6MX.bks');}
    for(const[bv,rb,rp]of BRV){const g=tag(new THREE.Group(),'050100-4');bv.add(g);const a=ang(40),w=Math.asin(7.9/60),YQ=YB-11.5;   /* YQ: the pivots' height; the 6MX's foot on its body (r 51.8) */
      const sp=()=>[a-w,a+w];mesh(g,solidGeo([{loop:sector(rb,rp,sp(),sp()),y0:YQ-26.4,y1:YQ-16.6},{loop:sector(rp,59.6,sp(),sp()),y0:YQ-18,y1:YQ-7.4},{loop:sector(59.6,63.7,sp(),sp()),y0:YQ-8.2,y1:YQ+5.5},
        {loop:sector(63.7,67.5,sp(),sp()),y0:YQ+1.3,y1:YQ+5.5}]),M.brass);
      tag(screw(along(bv,[rp*Math.cos(a),YQ-20.3,rp*Math.sin(a)],[-Math.cos(a),0,-Math.sin(a)]),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-78');}

    /* ================= the closing plate (Verschlußplatte 05 01 00-2, rev. a 14.4.48) ================= */
    /* Ms, 1:1, every figure (sure but the hole Ø 1.2 at 12.4 and the 2 −0.05/−0.1, likely): Ø 68 −0.2, 2.3 at its rim, the boss Ø 28 −0.2 on its outer face making it 5 thick;
       the hole Ø 5.5 +0.1 through the middle, counterbored Ø 7.5 +0.1 from outside to 2 under the inner face; a groove Ø 10 to Ø 26, 1.5 deep, in the inner face; M2.6 at 25,
       Ø 1.2 at 12.4 (drawn at 12.35, inside the groove's edge) on one line, Ø 8 +0.2 at 22.6 at 90° to it. The Ø 1.2 is drilled blind from the groove's floor: the section
       draws its drill point inside the boss, its tip a pixel or so (0.1-0.2) short of the boss's face (likely; drawn with a 118° point, its tip 0.15 short). Between the rim's
       underside and the boss a round, drawn and not figured: r 1.3 (scaled 1.3-1.5 at 3.45 px/mm; likely). Until 15 October 2026 the hole was drawn through and the corner
       sharp. Wempe 3955's plate (16_Wempe_3955_Gehäusetopf_Kardan.jpg) shows two small holes, about Ø 1 at r 11 opposite each other, in the boss's face: not on the sheet,
       not drawn (README, Unresolved). It lies in the bowl's foot, its inner face on the recess's floor and
       its boss 0.5 inside the foot, turning on its screw (7: WN-71, unsure) in the bottom: turned by the knob in its M2.6 (WN-72, brass on Wempe 3955,
       16_Wempe_3955_Gehäusetopf_Kardan.jpg), its Ø 8 comes over the winding hole for the key and away from it to close it; the closing spring (Verschlußfeder 05 01 00-7, 14 on 05 01)
       that holds it, in the groove with its end in the Ø 1.2, has no sheet: estimated (below). Its turn: built open, the Ø 8 over hole 10; at rest the spring holds it shut, turned
       CPS (25°: no sheet, photograph or video gives it; its Ø 8.1 clears the Ø 8.2 hole from 20.8° on, so 1.7 of metal over the hole's edge: estimated), and winding in the case
       opens it (shutter, app.js), as the 6MX's shutter is opened for the key (Uy8A88_j-cA 5:21-5:25; the 6MX's own is a pin in a slot) */
    const cp=prt(bowlS,'closingPlate',-YP),CPS=25*D2R;cp.rotation.y=CPS;
    {const t8=Math.atan2(H[10][1],H[10][0]),tk=t8-Math.PI/2,s0=t8+Math.PI/4,P=(r,t)=>[r*Math.cos(t),r*Math.sin(t)],y0=YB-64.5,yr=YB-61.8,y1=YB-59.5;
      const q12=P(12.35,tk),yt=y0+0.15,yh=yt+0.6/Math.tan(59*D2R),ro=1.3,fc=13.95+ro,fy=p=>yr-ro+Math.sqrt(Math.max(0,ro*ro-(rr(p)-fc)**2));   /* the blind hole's point (yt its tip, yh its top); the round about (fc, yr − ro) */
      const rs=[5,13,13.95,...[1,2,3].map(i=>fc-ro*Math.cos(i*Math.PI/8)),fc,33.95],ys=[[y0,y1],[y0,y1-1.5],[y0,y1],[fy,y1],[fy,y1],[fy,y1],[fy,y1],[yr,y1]];   /* the round in four rings, 22.5° of it each */
      const F=[[{p:C([0,0],5.55/2,48),a:y0,b:y1},{p:C([0,0],7.55/2,60),a:y0,b:y0+3}],[{p:C(q12,0.6,24),a:yh,b:y1-1.5},{p:C(q12,0.03,24),q:C(q12,0.59,24),a:yt,b:yh}],[],[],[],[],[],
        [{p:C(P(22.6,t8),8.1/2,72),a:yr,b:y1},{p:C(P(25,tk),1.32,32),a:yr,b:y1}]];
      const cpW=rv(cp,'last first');tag(mesh(cpW,smoothRev(solidGeo(cells(rs,ys,F,s0))),M.brass),'050100-2');
      tag(screw(cpW,0,0,y0+3,3.6,2.5,7.5,1.5,M.steel),'WN-71');   /* its screw: head Ø 7.2 × 2.5 in the counterbore, M3 through the plate into the bottom (estimated) */
      const kq=P(25,tk);tag(screw(cpW,kq[0],kq[1],yr,2.6,2.4,2.2,1.3,M.brass),'WN-72');   /* the knob: a brass head Ø 5.2 × 2.4 (Wempe 3955's), M2.6 (estimated) */
      /* the Soviet 6MX's: a flat disc, no boss (Kirov 14917's foot, rAw2zmulpk8 0:11.75, square on: no boss edge round the screw; Kirow 422's, 11_Kirow_DEC_422_Gehäuse.jpg,
         a flat plate recessed inside the foot's lip, a central dome about Ø 7; moMvyx8eXfo 7:20, a modern one, flat: likely), its slotted screw's head about Ø 8 on its face, the
         domed knob about Ø 6.5 at r 19 ±2 (25 on 05 01 00-2): 14917's, scaled by the recess's Ø 68.2 (likely). The plate the drawings' 2.3 at its rim throughout, its groove,
         holes and spring as theirs; the Ø 8 over the winding hole as drawn (Kirow 422's reads 6.7: a German-made bowl) */
      {const c6=rv(cp,'6mx'),ys6=ys.map((q,i)=>[yr,i===1?y1-1.5:y1]),yt6=yr+0.15,yh6=yt6+0.6/Math.tan(59*D2R),k6=P(19,tk);
        const F6=[[{p:C([0,0],3.2/2,48),a:yr,b:y1}],[{p:C(q12,0.6,24),a:yh6,b:y1-1.5},{p:C(q12,0.03,24),q:C(q12,0.59,24),a:yt6,b:yh6}],[],[],[],[],[],
          [{p:C(P(22.6,t8),8.1/2,72),a:yr,b:y1},{p:C(k6,1.32,32),a:yr,b:y1}]];
        tag(mesh(c6,smoothRev(solidGeo(cells(rs,ys6,F6,s0))),M.brass),'050100-2');
        tag(screw(c6,0,0,yr,4.0,2.4,7.5,1.5,M.steel),'WN-71');   /* the head Ø 8 on the plate's face (2.4 high estimated), M3 through its Ø 3.2 into the bottom */
        const kn=tag(screw(c6,k6[0],k6[1],yr,3.25,2.6,2.2,1.3,M.brass),'WN-72');void kn;}   /* the knob Ø 6.5 (its dome drawn as the kit's head, 2.6 high estimated) */
      /* the closing spring (Verschlußfeder 05 01 00-7, 14 on 05 01): no sheet, and under the plate on every bowl photographed or filmed (Wempe 3955's; moMvyx8eXfo 7:10-7:45;
         the 6MX's shutter is another, a pin in a slot: Uy8A88_j-cA 5:21-5:25), so estimated from what the plate's sheet gives it: its seat, the groove Ø 10 to Ø 26, 1.5 deep, in
         the face on the bowl's bottom (a closed chamber between them), and the Ø 1.2 drilled blind from the groove's floor at 12.4, against its outer wall, for one end. A round
         steel wire Ø 1.0 (the Ø 1.2's), a flat spiral of two turns across the chamber from r 12.35 to 6.5, at its mid depth (0.25 clear of the groove's floor and of the bowl),
         its outer end turned down 2 into the plate's hole and its inner end up 1.2 into a hole Ø 1.2, 1.5 deep, in the bowl's bottom (CSI, above: not on the casting's sheet,
         which draws nothing machined); each turn on a bend r 0.8. Unloaded with the plate shut, so nothing need stop it there; opened 25° it winds up (README, the case). It is
         built in the plate's frame for the plate's turn and rebuilt in place (reclose) as it turns (cp.userData.turn, from shutter), the inner end staying in the bowl's hole */
      let spEnd=YB-63;const NT=2,RI=CSI[0],RO=12.35,ym=y1-0.75,rb=0.8,WR=0.5,V=(r,a,y)=>new THREE.Vector3(r*Math.cos(a),y,r*Math.sin(a));
      const spGeo=(rot,old)=>{const ai=CSI[1]+rot-NT*TAU,a0=ai+rb/RI,a1=tk-rb/RO,Q=[V(RI,ai,YB-58.3)];   /* the inner end's angle in the plate's frame (the bowl's turned back by the plate's turn) */
        for(let j=0;j<=6;j++){const t=j/6*Math.PI/2;Q.push(V(RI,ai+(rb-rb*Math.cos(t))/RI,ym+rb-rb*Math.sin(t)));}   /* the turn from the bowl's hole into the spiral */
        const n=Math.ceil((a1-a0)/0.05);for(let i=1;i<n;i++){const u=i/n;Q.push(V(RI+(RO-RI)*u,a0+(a1-a0)*u,ym));}
        for(let j=6;j>=0;j--){const t=j/6*Math.PI/2;Q.push(V(RO,tk-(rb-rb*Math.cos(t))/RO,ym-rb+rb*Math.sin(t)));}   /* and out of it, down into the plate's hole */
        Q.push(V(RO,tk,spEnd));return reclose(old,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Q,false,'centripetal'),Q.length*3,WR,8,false));};
      const sp=tag(mesh(cp,spGeo(CPS,null),M.steel),'050100-7');let last=CPS;
      cp.userData.turn=()=>{const r=cp.rotation.y;if(Math.abs(r-last)>1e-4){last=r;sp.geometry=spGeo(r,sp.geometry);}};
      /* its outer end's depth in the plate's blind hole: into the drawings' boss, to the top of the drill point in the 6MX's flat plate (YB − 61.3; its tip 0.15 over the plate's outer face) */
      cp.userData.spEnd=y=>{if(y!==spEnd){spEnd=y;sp.geometry=spGeo(cp.rotation.y,sp.geometry);}};}

    /* ================= the bezel (Glasrand R-05 01 01-2, 6.3.42) and its glass (05 01 01-1) ================= */
    /* Ms, Kokillenguß, 1:1, every figure (sure): Ø 125 for its top 8.2, a 30° chamfer to Ø 116 at its underside, 16 high; the sight bore Ø 92 (it shows the dial's minute
       track, Ø 90), the lower bore Ø 106, 4.5 deep. It lies on the bowl's top face round the movement ring's flange (Ø 105.95, the same figure: the 1941 assembly 05 01 01 draws
       the flange's recess so, its depth scaling 4.2-5.2), the recess drawn 4.75 deep (the casting's 4.5 opened to the flange's 4.7) and relieved to Ø 104.2 a further 0.7 over the
       dial, which stands 0.6 proud of the flange (05 01 01 draws a step there), with a notch for the ring's radial pin (WN-202, Stellstift 3 in the coloured section) at 12 o'clock,
       which sets the movement's turn (1.8 wide for the pin's Ø 1.6 and 0.3 beyond its end: estimated; 05 08 00-3 puts the pin's hole at 12, frame.js; Wempe 3955's dial side,
       3_Wempe_3955_uZ.jpg, shows a gap in the rim round the movement at 12, over the pin's end; until 15 October 2026 at 6 o'clock, 1.5 wide). The glass in a seat at the top: Ø 112 × 2.3 (05 01 01: Ø 111.7 scaled at 4.78 px/mm, its section 2.3), flush with the top face, so its
       underside is 16.7 over the pillar plate's dial face (05 02_1: 15.8, corrected in pencil to 17.0; the 1941 bezel's own section puts it at 15.3): README. How the bezel is held
       on the bowl isn't drawn (no screws in 05 01's list; Kirow 422's bezel is knurled, so screwed): not drawn. The Ø 125's lowest 2.5 knurled, 0.4 deep, as Wempe 6161's and
       Wempe 5377's bezels show (antiquorum_208-4_wempe6161.jpg: the band about 10 px at 4.4 px/mm by the bezel's 125; bonhams_26816_327_wempe5377_type05.jpg): likely */
    const bz=prt(bowlS,'bezel',-YP),bW=rv(bz,'last first');
    {const b0=YB,top=YB+16,ch=p=>b0+(rr(p)-58)/Math.tan(30*D2R);
      const rec=bool(C([0,0],53.05,720),[[-0.9,-52.5],[-0.9,-55.3],[0.9,-55.3],[0.9,-52.5]]).uni[0];
      const F=[{p:rec,a:b0,b:b0+4.75},{p:C([0,0],52.1,720),a:b0,b:b0+5.45},{p:C([0,0],46,600),a:b0,b:top},{p:C([0,0],56.1,720),a:top-2.3,b:top}];
      const kb=b0+4/Math.tan(30*D2R);   /* the knurl's foot, where the chamfer meets r 62 */
      tag(mesh(bW,smoothRev(solidGeo(cells([58,62,62.5],[[b0,top],[ch,top],[kb+2.5,top]],[F]))),M.brass),'050101-2');
      tag(mesh(bW,polyGeo(knurlPts(62.5,0.4,480),2.5,[[0,0,62]]),M.brass,0,kb,0),'050101-2',1);
      const gl=tag(mesh(bW,solidGeo([{loop:circ(56),y0:top-2.3,y1:top}]),M.glass),'050101-1');gl.userData.noShadow=1;gl.userData.inkBox=1;}   /* no Edges lines: a glass is drawn as a ghost, whose outline the line pass lays over everything, the box's wood in front of it too (the Hamilton's crystal and box glass are inkBox) */
    /* the 6MX's bezel ('6mx'), knurled and screwed onto the bowl's threaded rim (Kirow 422's: 11_Kirow_DEC_422_Gehäuse.jpg; Kirov 14917's off its bowl, its inside threaded:
       rAw2zmulpk8 0:29, 2:52), its glass thick and standing proud (12_Kirow_DEC_422_Kasten_1.jpg: a green edge over a narrow brass top). Traced on the bowl photograph as the
       bowl (rows by Y6, radii at 8.42 px/mm, the right edge less its 0.45 offset at the knurl): its lower edge r 56.1 at row 552, swelling (a bell) to the knurl's tips, r 58.3
       (Ø 116.6) by row 598; the knurl to row 640 (diamond on the photographs, drawn as 360 straight teeth 0.4 deep: the diamond's crossing isn't drawn); a plain lip, rounded
       into the top face at row 650 (YB + 13.5). Inside (not on any photograph: estimated): the glass in a seat 1.5 deep to r 53.6, the sight bore r 52.1 (the dial's edge 51.8
       under it), the shoulder at the rim's top (YB + 4.7) bearing on the ring's flange and the rim, which holds the movement down as the drawn bezel's recess does, the thread's
       bore r 55.3 to its edge. The glass: Ø 107 × 4.0, its top edge chamfered 0.8, its underside YB + 12.0, 0.65 over the hands' highest point (the minute hand's boss, 17.70 in
       the movement's frame), its top YB + 16.0, where the drawn bezel's top is (estimated: the photographs give no height) */
    {const b6=rv(bz,'6mx'),yj=Y6(552),yk0=Y6(598),yk1=Y6(640),top=Y6(650),gu=YB+12.0;
      const bell=[[56.1,552],[56.5,556],[56.73,560],[57.09,564],[57.32,568],[57.56,572],[57.68,576],[57.82,580],[57.9,588],[57.9,598]].map(([r,w])=>[r,Y6(w)]);
      const pr=[[55.3,yj],...bell,[57.9,yk1],[58.0,yk1],[58.0,Y6(646)],[57.6,Y6(649)],[57.2,top],[53.6,top],[53.6,gu],[52.1,gu],[52.1,YB+4.7],[55.3,YB+4.7]];
      const g=new THREE.LatheGeometry([...pr,pr[0]].map(([r,y])=>V2(r,y)),N).toNonIndexed();g.computeVertexNormals();tag(mesh(b6,smoothRev(g),M.brass),'050101-2');
      const NK=360,kn=[];for(let i=0;i<NK;i++){const t=i/NK*TAU,u=t+Math.PI/NK;kn.push([58.3*Math.cos(t),58.3*Math.sin(t)],[57.9*Math.cos(u),57.9*Math.sin(u)]);}
      tag(mesh(b6,solidGeo([{loop:kn,y0:yk0,y1:yk1,F:[{p:circ(57.85),a:yk0,b:yk1}]}]),M.brass),'050101-2',1);
      const gq=[[0,gu],[53.5,gu],[53.5,gu+3.2],[52.7,gu+4.0],[0,gu+4.0]],gg=new THREE.LatheGeometry([...gq,gq[0]].map(([r,y])=>V2(r,y)),N);
      const gl=tag(mesh(b6,gg,M.glass),'050101-1');gl.userData.noShadow=1;gl.userData.inkBox=1;}   /* no Edges lines: a glass is drawn as a ghost, whose outline the line pass lays over everything, the box's wood in front of it too (the Hamilton's crystal and box glass are inkBox) */

    /* ================= the gimbal ring (Kardanring 05 01 00-5) and its bracket (Kardanringkloben 05 01 00-6) ================= */
    /* No sheets: scaled on 05 01 (2.45 px/mm by its 160 and the bowl's 106; circles fitted to Schnitt A-B: Ø 139.2 inside and 146.8 outside the lines, the elevation's section
       3.3 thick and 23.2 high): Ø 140 inside, 3.3 thick, 23.2 high, its top level with the bowl's, its pivots at mid height (likely). The outer pivots a on the 3-9 line, the inner b on
       12-6, in one plane, so the bowl swings about one point. At the 3 o'clock pivot a bracket on the ring's outside, its two screws in slots ("Kloben verstellen": moved to level the
       bowl), 57 long, 16.7 high, 3.3 thick, the pivot through it (Schnitt A-B, the elevation's outside half: estimated). The inner pivots: screws through the ring (12: WN-79) with
       lock nuts (10: WN-400), their points in the case brackets' holes ("Lagerstellen a u. b leicht spielend"): M4 (scaled), heads Ø 7 (estimated). Brass, as the bowl (no material
       given; Wempe 3955's is Bakelite). The screws brass and each lock nut a knurled brass disc Ø 19 × 2.5 inside the ring, against its inner face, between it and the case bracket
       (Wempe 3955's bowl, 16_Wempe_3955_Gehäusetopf_Kardan.jpg: the disc beside the bracket about Ø 19 at 6.0 px/mm by the closing plate's recess Ø 68.2, its knurl's teeth
       about 0.5 apart, the screw's end outside the ring brass; Lange 1947's at 12 and 6 the same: likely). Until 16 October 2026 a hex steel nut outside the ring, under the screw's head 3.2 off the ring */
    const rgP=prt(ringG,'gimbalRing',-YP);
    {tag(mesh(rgP,smoothRev(solidGeo(cells([70,73.3],[[0,0],[YB-23.2,YB]]).slice(1))),M.brass),'050100-5');
      const q=28.5/73.3,ss=ang(18/73.3/D2R);tag(mesh(rgP,solidGeo([{loop:sector(73.3,76.6,[-q,q],[-q,q]),y0:YP-8.35,y1:YP+8.35}]),M.brass),'050100-6');
      for(const s of[-1,1])tag(screw(along(rgP,[76.6*Math.cos(s*ss),YP,76.6*Math.sin(s*ss)],[-Math.cos(s*ss),0,-Math.sin(s*ss)]),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-kr');
      for(const s of[-1,1]){const g=along(rgP,[0,YP,s*73.3],[0,0,-s]);tag(screw(g,0,0,0,3.5,2.8,9.8,2,M.brass),'WN-79');   /* its head on the ring's outside, its point where it was in the bracket's hole */
        tag(mesh(g,knurl(9.5,0.35,2.5,120,2),M.brass,0,3.95,0),'WN-400');   /* its face at r 69.35, where its rim meets the ring's curved inside (70 less the curve's 0.65 over its 9.5) */}}

    /* ================= the wooden box (Holzkasten, 127-556.02) ================= */
    /* "Holzgehäuse 185 × 185 × 180 mm außen" (05 01, sure); its walls 12.5 (51 00 10's section, sure; 05 01 draws the walls 12.6 and their inside 160, its "160 Ø"); the line
       across 51 00 10's side 105 over the bottom taken as the lid's parting line (it lies at the ring's top, 11.5 over the pivot's M6: likely). Its other boards, joints and the lid's
       glazed top aren't on a sheet in the set: drawn as Greenwich's wartime Wempe (rmg_L5393_wempe_wartime_001.jpg) and Lange 1947 (drouot_33810142_*) show them, the floor
       12.5, the lid's top a frame 20 wide round a glass 3 thick, the piano hinge and the lid's stay (below): estimated. Mahogany, as Wempe No. 6161's (woodTex) */
    const bx=prt(root,'box');const bxW=rv(bx,'last first');   /* the drawings' box; the 6MX's (Kirov 247's) below */
    {const B=tag(new THREE.Group(),'Holzkasten');bxW.add(B);const hh=YL-YF-WT;
      box(B,2*BW,WT,2*BW,0,YF+WT/2,0,MC.mah);for(const s of[-1,1]){if(s>0)box(B,2*BW,hh,WT,0,YF+WT+hh/2,s*(BW-WT/2),MC.mah);box(B,WT,hh,2*BW-2*WT,s*(BW-WT/2),YF+WT+hh/2,0,MC.mah);}
      /* the back wall, its top let in 0.6 for the hinge's leaf over the hinge's length (below) */
      for(const s of[-1,1])box(B,BW-HGL/2,hh,WT,s*(BW+HGL/2)/2,YF+WT+hh/2,-(BW-WT/2),MC.mah);box(B,HGL,hh-HGT,WT,0,YF+WT+(hh-HGT)/2,-(BW-WT/2),MC.mah);
      /* the outer pivots a (11: WN-80): M6 through the side walls (51 00 10: "Verbohren 4,8 mm Gew. M 6", 93.5 over the bottom), their ends the pivots in the ring's holes;
         heads Ø 9 × 3.8 (51 00 10's front and side views, 2.36 px/mm) and a brass bearing disc Ø 23 × 2.4 on each wall's inside (05 01's elevation, scaled): estimated; its
         edge knurled, as Wempe 6161's and Lange 1947's show it (antiquorum_208-4_wempe6161.jpg at 9 and 3 o'clock, drouot_33810142_lange1947_2.jpg: likely) */
      for(const s of[-1,1]){tag(screw(along(bxW,[s*BW,YP,0],[-s,0,0]),0,0,0,4.5,3.8,22.5,3,M.steel),'WN-80');
        const dg=knurl(11.5,0.35,2.4,140,3);dg.translate(0,-1.2,0);const d=tag(mesh(bxW,dg,M.brass,s*(BW-WT-1.2),YP,0),'Lagerscheibe');d.rotation.z=Math.PI/2;}
      /* the handles (Griff f. Chronometerkasten, Änderung von 51 00 10, 14.7.42, 1:1): a strip 100 long and 18 high, its ends 10 long flat on the side with a screw each, between
         them standing 10 off it, the grip pressed out to an oval 70 × 30, 6 deep; its middle 75 over the box's bottom, its top 3.5 under the pivot's screw (sure). The strip 3 thick (likely); the screws estimated */
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'510010');g.position.set(s*BW,YF+75,0);g.rotation.y=s>0?0:Math.PI;bxW.add(g);
        const st=polyGeo([[0,-50],[3,-50],[3,-41],[10,-36],[10,36],[3,41],[3,50],[0,50],[0,40],[7,35],[7,-35],[0,-40]],18);st.translate(0,-9,0);mesh(g,st,MC.alu);   /* the strip seen from below: [off the side, along it] */
        const ov=stadiumPts([-12,-20],[-12,20],30),cut=[];for(let i=0;i<ov.length;i++){const a=ov[i],b=ov[(i+1)%ov.length];if(a[0]<=-9)cut.push(a);if((a[0]<=-9)!==(b[0]<=-9)){const t=(-9-a[0])/(b[0]-a[0]);cut.push([-9,a[1]+t*(b[1]-a[1])]);}}
        const o=new THREE.Shape(cut.map(([y,z])=>V2(z,y)));const og=extrude(o,{depth:3,bevelEnabled:false,curveSegments:24});og.rotateY(Math.PI/2);mesh(g,og,MC.alu,7,0,0);   /* the grip: the oval 70 × 30, hanging 12 below the strip's middle (its dashed outline on the sheet's front view, scaled at 2.36 px/mm); drawn below the strip only (y −9 down), so the two don't share their faces 7 and 10 off the side, which flickered where they overlapped (until 16 October 2026) */
        for(const z of[-45,45])tag(screw(along(g,[3,0,z],[-1,0,0]),0,0,0,2.5,1.6,11,1.2,M.steel),'WN-hg');}
      /* the hinge: one piano hinge across the back (no sheet: every photographed box has it; Lange 1947 from above, drouot_33810142_lange1947_2.jpg, 4.48 px/mm by the box's
         185: 148 long, 664 px, its leaves let into the box's and the lid's parting faces, the box's showing 6.7 over the wall, five screws about 33 apart; Wempe 6161's, Wempe
         5377's and Greenwich's wartime Wempe's the same, brass or black): likely. Its leaves 0.6 thick, 6.5 wide over the walls from the knuckle's tangent at the back's face, the knuckle Ø 5 on the axis
         2.5 behind the back, in seven lengths, the box's four and the lid's three (estimated). Until 16 October 2026 two hinges 40 long on the back's face (the README then said the
         photographs show two) */
      {const g=tag(new THREE.Group(),'Scharnier');bxW.add(g);box(g,HGL,HGT,6.5,0,YL-HGT/2,-BW+3.25,M.brass);
        for(let i=0;i<7;i+=2){const k=mesh(g,cylY(2.5,HGL/7,20),M.brass,-HGL/2+HGL/7*(i+0.5),YL,-BW-2.5);k.rotation.z=Math.PI/2;}}
      /* the key's holder (no sheet: the box's own, 127-556.02, isn't in the set): a triangular shelf across the back right corner, the key standing in a hole through it, its
         body's cone seated on the hole's edge and its paddle up, as every photographed box keeps it: Greenwich's wartime Wempe (rmg_L5393_wempe_wartime_001.jpg: the black
         1943 key, its paddle's top 18 px over the back rim's line behind it, the key 21 in front of the back wall, the camera looking down about 35° (the box's 210 deep spans
         305 px at about 2.5 px/mm): the paddle's top 24 ±6 over the box's top, 20 ±8 read apart (16 October 2026; until then read as level with it); the 6MX's shelf 15-30 under
         the rim with its paddle above, moMvyx8eXfo 3:06, Kirova 422), Wempe 5377 (later case, its paddle under the rim) (bonhams_26816_327: the shelf and the key in it), Lange VEB 2285 (drouot_33246921_*_3, from above:
         the shelf's front edge, the key near it), Lange 5510 and the 6MX Kirova 422 (12_Kirow_DEC_422_Kasten_1.jpg). Its legs 55 along the back and right walls (Lange 2285
         from above: about a third of the box's inside), the hole Ø 11 16.5 from each wall (21 read on the same photograph, as the key stood until 16 October 2026: raised to the ring's height its body then met the gimbal ring after 9.5° of swing; 16.5 stands it clear), 10 thick, its top 65 over the floor (the key's paddle then
         22.3 over the box's top, between the two readings of the wartime Wempe's; 40 and 2.7 under until 16 October 2026): estimated; of the box's mahogany. The paddle faces the box's middle, its plane 89.8 from the gimbals' centre and its body's near side 82.6, beyond the case's
         and ring's reach (79.4: massprops.py); the shelf's front edge lies beyond the ring's (x − z 105 against its 103.7) */
      tag(mesh(bxW,polyGeo([[BW-WT,-(BW-WT)],[BW-WT-55,-(BW-WT)],[BW-WT,-(BW-WT)+55]],10,[[KX,KZ,5.5]]),MC.mah,0,KH-10,0),'Schluesselhalter');}
    /* the lid: its walls 75 − 12.5 high on the box's, its top a frame round the glass (estimated, above); hinged at the back */
    /* the lid's stay (below, in the lid): the bar on its pivot, turned each frame to lie on its pin in the box's wall (stayAt); the pin a brass stud Ø 2 out of the wall */
    const stayP=new THREE.Group(),stayPin=[YL-STC,-BW+STD];
    {const o=[...stadiumPts([0,0],[0,-STL+3],6)];   /* [x, z] here: the bar along -z from its pivot, 6 wide; turned onto the wall below */
      const g=polyGeo(o,1.5,[{pts:stadiumPts([0,-SS0],[0,-SS1],2.4)},[0,0,1]]);g.translate(0,-0.75,0);g.rotateZ(Math.PI/2);g.rotateX(-Math.PI/2);   /* its thickness across the wall (x), its length down -y */
      const bar=tag(mesh(stayP,g,M.brass),'Deckelstuetze');bar.name='stayBar';bar.onBeforeRender=()=>stayAt();
      tag(mesh(stayP,(()=>{const c=cylY(1,2.2,16);c.rotateZ(Math.PI/2);return c;})(),M.brass),'Deckelstuetze',1);   /* its pivot screw's head, Ø 2, through the bar into the lid's wall */
      const pin=tag(mesh(bxW,(()=>{const c=cylY(1,3.0,16);c.rotateZ(Math.PI/2);return c;})(),M.brass,-(BW-WT)+1.5,stayPin[0],stayPin[1]),'Deckelstuetze',1);}
    const stayAt=()=>{const al=lidG.rotation.x,dy=-STC,dz=STD+2.5,c=Math.cos(-al),n=Math.sin(-al),y=dy*c-dz*n,z=dy*n+dz*c-2.5;   /* the pin in the lid's frame */
      stayP.rotation.x=Math.atan2(-(z-STB),-(y-STA));};
    const lidG=new THREE.Group();lidG.position.set(0,YL,-BW-2.5);root.add(lidG);const ld=prt(lidG,'lid');ld.position.z=2.5;const ldW=rv(ld,'last first');   /* turning about the hinges' knuckles, 2.5 behind the back */
    {const B=tag(new THREE.Group(),'Holzkasten.D');ldW.add(B);const h=YT-YL-WT,o=BW;
      for(const s of[-1,1]){if(s>0)box(B,2*BW,h,WT,0,h/2,o+s*(BW-WT/2),MC.mah);box(B,WT,h,2*BW-2*WT,s*(BW-WT/2),h/2,o,MC.mah);
        box(B,2*BW,WT,20,0,h+WT/2,o+s*(BW-10),MC.mah);box(B,20,WT,2*BW-40,s*(BW-10),h+WT/2,o,MC.mah);}
      const g=tag(box(ldW,151,3,151,0,h-1.5,o,M.glass),'Deckelglas');g.userData.noShadow=g.userData.inkBox=1;   /* no Edges lines, as the bezel's glass */
      for(const s of[-1,1])box(B,BW-HGL/2,h,WT,s*(BW+HGL/2)/2,h/2,WT/2,MC.mah);box(B,HGL,h-HGT,WT,0,HGT+(h-HGT)/2,WT/2,MC.mah);   /* the lid's back wall, let in for the hinge's leaf */
      {const q=tag(new THREE.Group(),'Scharnier',1);ldW.add(q);box(q,HGL,HGT,6.5,0,HGT/2,3.25,M.brass);
        for(let i=1;i<7;i+=2){const k=mesh(q,cylY(2.5,HGL/7,20),M.brass,-HGL/2+HGL/7*(i+0.5),0,-2.5);k.rotation.z=Math.PI/2;}}
      /* the lid's stay (no sheet: Wempe 6161, antiquorum_208-4_wempe6161.jpg, a brass bar with a long slot on the left, pivoted on the lid's wall near the hinge and riding on a
         pin in the box's wall near the back; Greenwich's wartime Wempe's on the left too, Lange 1947's on the right, 5.6 wide at 4.48 px/mm): the bar 6 wide and 1.5 thick on the
         walls' inside, its pivot 5 over the parting line and 40 from the back's outside on the lid, its pin 20 under it and 45 from the back on the box; the slot 2.4 wide from
         23.5 to 86.5 from the pivot, the pin 25.5 from it shut and 85.5 open (100°), so the bar crosses the parting line 12.8 or more in front of the back wall's inside at
         every angle of the lid and lies down along the side wall shut: estimated, fitted to the lid's travel and the walls */
      ldW.add(stayP);stayP.position.set(-(BW-WT)+0.75,STA,STB);
      /* the maker's plate on the lid's front (Greenwich's wartime Wempe: its place), 26 × 52 aluminium, 1 thick (Alu 10: likely), on four pins in its Ø 1.2 holes */
      const fp=tag(new THREE.Group(),'000101-9');fp.position.set(0,42,2*BW+0.5);ldW.add(fp);box(fp,52,26,1,0,0,0,MC.white);
      const dg=mesh(fp,new THREE.PlaneGeometry(52,26),MC.label,0,0,0.52);dg.userData.decal=1;
      for(const[u,v]of[[-24,11],[24,11],[-24,-11],[24,-11]]){const n=mesh(fp,cylY(0.9,0.6,12),M.steel,u,v,0.8);n.rotation.x=Math.PI/2;}}
    /* the latch tongue (Zunge, P. 51 00 02-2, 18.9.42, 2:1): iron flat 10 × 4, bonderised and black lacquered, 45 long, 10 wide at its round end tapering 2°40' along one edge to 8
       at the other, the hole Ø 6.2 (sunk 0.5 × 45°) 6 from its round end and 39 from the other, M3.5 14 from it (sure); its last 7 thinned 0.2 (not drawn). Where it goes isn't
       drawn: taken as the lid's latch, turning on a screw in its Ø 6.2 on the lid's front over the parting line, its end under a keeper on the box's front, a knob in its M3.5
       (Greenwich's wartime Wempe has a latch there): estimated */
    const tgG=new THREE.Group();tgG.position.set(0,12,2*BW);ldW.add(tgG);const tz=prt(tgG,'lid');
    {const arc=(c,r,t0,t1,n)=>[...Array(n+1).keys()].map(i=>{const t=t0+(t1-t0)*i/n;return[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];});
      const out=[[-5,-1],[-5,35],...arc([-1,35],4,Math.PI,0,12).slice(1,-1),[3,35],[5,-1],...arc([0,-1],5,0,-Math.PI,16).slice(1,-1)];   /* plan [across, along]: the hole at 0, the round end r 5, the far end r 4 at 39 */
      const geo=polyGeo(out,4,[[0,0,3.1],[0,14,1.77,1]]);geo.rotateX(Math.PI/2);tag(mesh(tz,geo,MC.black),'P510002-2');   /* hanging down the lid's front, 4 thick out from it */
      tag(screw(along(tz,[0,0,4],[0,0,-1]),0,0,0,4.5,2,12,3,M.steel),'WN-zg');   /* its pivot screw, M6 in the Ø 6.2, head Ø 9 (estimated) */
      const kn=tag(new THREE.Group(),'WN-zk');kn.position.set(0,-14,4);tz.add(kn);const kg=new THREE.LatheGeometry([V2(0,0),V2(1.75,0),V2(1.75,1.5),V2(3,1.5),V2(3,6),V2(2.5,7),V2(0,7)],24);kg.rotateX(Math.PI/2);mesh(kn,kg,MC.knob);}   /* its knob in the M3.5 (estimated) */
    /* its keeper on the box's front (estimated): a strap 16 wide, 1.5 thick, 4.4 off the front over the tongue's end */
    {const g=tag(new THREE.Group(),'Schliessblech');bxW.add(g);box(g,18,10,1.5,0,YL-26,BW+5.15,M.steel);for(const s of[-1,1])box(g,3,10,4.4,s*7,YL-26,BW+2.2,M.steel);}

    /* ================= the 6MX's box (Kirov No. 247's, '6mx') ================= */
    /* A box in three tiers, the body, a glazed lid and a top lid, two hasps with knurled screws across the parting lines, brass corner strips, a ring handle on each side
       (Kirov 247: 13_, 14_Kirow_247_Kasten_*.jpg, its front between the hasps; Kirov 1564, 2973, 22823 and 23239's the same, Kirov 422's and 479's two-tiered). Its size the TU's,
       "190x190x190" outside (6MX-figures.md, TU 1.2.7; of 1984, the only figure). The tiers measured on Kirov 22823's front, nearly square-on
       (bilder-zum-6mx/10_Kirow_22823_Kasten.jpg: its height 785 px at the near edge, 765 at the far, its width 773), as parts of 190: the body 97 (0.506, 0.514), the
       glazed lid 68 (0.354, 0.360), the top lid 25 (0.140, 0.127); Kirov 247's own front puts its parting lines 450 px apart at 53/330 mm a px, 72 (by the hasp's width,
       below). The hasps: 53 wide (22823's 215 of 773 px), each leaf 13 high with a peak 3 more at its middle, two screws a leaf, the knurled head Ø 11 × 5 on the lower leaf
       6.4 under the line (Kirov 247's: 330 px wide, the head 70 px). On the glazed lid's front the factory's diamond badge, 38.6 × 24, its centre 37.6 under the upper line;
       on the body's the number plate, Ø 31, 40 under the lower (14_: by the hasp). The corner strips 27 × 12 wrapping each vertical corner: at the bottom, 27 under the lower
       line, 25 under the upper, and capping the top (22823's, at 2.46 px/mm). The ring handles (22823's left side, folded down): a ring Ø 34 of 6 wire from a lug under
       the lower line (estimated). Not on any photograph, estimated: the walls 10 thick; the glass in the glazed lid's top under a frame 20 wide (as the drawings' box); both
       lids hinged at the back and opened together (the page has one lid); the outer pivots, the bearing discs, the transit lock and the key's holder as the drawings' box has
       them, against its walls (5 wider each side: the pivots 2.5 longer); the bottom 93.5 under the pivots, as drawn */
    const B6=95,W6=10,P2=YF+97,P1=YF+165,T6=YF+190;   /* half its width outside, its walls; the parting lines and top */
    const lid6G=new THREE.Group();lid6G.position.set(0,P2,-B6-2.5);const ld6=prt(lid6G,'lid');ld6.position.z=2.5;const tg6=new THREE.Group();   /* tg6: no latch tongue (the page turns it) */
    /* a vertical plate on the front face (z0 its face, out to +z): outline [x, y] in the face, th thick */
    const plate=(par,pts,th,x,y,z0,mt)=>{const g=polyGeo(pts.map(([a,b])=>[a,-b]),th);g.rotateX(Math.PI/2);return mesh(par,g,mt,x,y,z0);};
    const LEAF=[[-26.5,0.25],[26.5,0.25],[26.5,12],[25,13.25],[6,13.25],[0,16.25],[-6,13.25],[-25,13.25],[-26.5,12]];   /* a hasp's leaf over its line (y up from it) */
    const leaf=(par,y,z0,up,knurl)=>{const g=tag(new THREE.Group(),'Ueberfall6');par.add(g);plate(g,LEAF.map(([a,b])=>[a,up?b:-b]),1.2,0,y,z0,M.brass);
      for(const sx of[-1,1]){const q=mesh(g,cylY(1.4,0.6,12),M.brass,sx*21,y+(up?7:-7),z0+1.5);q.rotation.x=Math.PI/2;}
      if(knurl){const k=mesh(g,cylY(5.5,5,36),M.brass,0,y-6.4,z0+3.7);k.rotation.x=Math.PI/2;}};
    /* corner strips round the four vertical corners at height y (each a strip on the front or back and one on the side), the box centred at z c */
    const strips=(par,y,c,h=12)=>{for(const sx of[-1,1])for(const sz of[-1,1]){box(par,27,h,1,sx*(B6-12.5),y,c+sz*(B6+0.5),M.brass);box(par,1,h,26,sx*(B6+0.5),y,c+sz*(B6-13),M.brass);}};
    {const g6=rv(bx,'6mx'),Bk=tag(new THREE.Group(),'Kasten6');g6.add(Bk);rv(root,'6mx').add(lid6G);const hb=P2-YF-W6;
      box(Bk,2*B6,W6,2*B6,0,YF+W6/2,0,MC.kir);
      for(const s of[-1,1]){box(Bk,2*B6,hb,W6,0,YF+W6+hb/2,s*(B6-W6/2),MC.kir);box(Bk,W6,hb,2*B6-2*W6,s*(B6-W6/2),YF+W6+hb/2,0,MC.kir);}
      for(const s of[-1,1]){tag(screw(along(g6,[s*B6,YP,0],[-s,0,0]),0,0,0,4.5,3.8,25,3,M.steel),'WN-80');
        const d=tag(mesh(g6,new THREE.CylinderGeometry(11.5,11.5,2.4,48),M.brass,s*(B6-W6-1.2),YP,0),'Lagerscheibe');d.rotation.z=Math.PI/2;}
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Griff6');g6.add(g);const yh=P2-12;box(g,1.5,10,34,s*(B6+0.75),yh,0,M.brass);box(g,6,8,10,s*(B6+4.5),yh,0,M.brass);
        const r=mesh(g,new THREE.TorusGeometry(17,3,12,48),M.brass,s*(B6+6),yh-17,0);r.rotation.y=Math.PI/2;}
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Scharnier6');g6.add(g);box(g,40,12,1.2,s*55,P2-6,-B6-0.6,M.brass);const k=mesh(g,cylY(2.5,40,20),M.brass,s*55,P2,-B6-2.5);k.rotation.z=Math.PI/2;}
      tag(mesh(g6,polyGeo([[B6-W6,-(B6-W6)],[B6-W6-65,-(B6-W6)],[B6-W6,-(B6-W6)+65]],10,[[KX,KZ,5.5]]),MC.kir,0,KH-10,0),'Schluesselhalter');   /* legs 65: its front edge where the drawn box's is (x − z 105), the key's hole where it is */
      {const g=tag(new THREE.Group(),'Beschlag6');g6.add(g);strips(g,YF+6,0);strips(g,P2-27,0);}
      leaf(g6,P2,B6,false,true);
      const np=tag(new THREE.Group(),'Nummernschild');g6.add(np);const d=mesh(np,cylY(15.5,0.8,48),M.steel,0,P2-40,B6+0.4);d.rotation.x=Math.PI/2;
      const dc=mesh(np,new THREE.CircleGeometry(15.5,48),MC.num,0,P2-40,B6+0.82);dc.userData.decal=1;}
    /* the lids, in the hinge's frame (y up from the lower line, z from the back's outer face: the front at 2·B6) */
    {const o=B6,L6=tag(new THREE.Group(),'Kasten6.D');ld6.add(L6);
      const I6=B6-W6;   /* the walls run each tier's full height; the glass's frame (10 more inside them) and the top board sit between them */
      for(const s of[-1,1]){box(L6,2*B6,68,W6,0,34,o+s*(B6-W6/2),MC.kir);box(L6,W6,68,2*I6,s*(B6-W6/2),34,o,MC.kir);
        box(L6,2*I6,W6,10,0,63,o+s*(I6-5),MC.kir);box(L6,10,W6,2*I6-20,s*(I6-5),63,o,MC.kir);
        box(L6,2*B6,25,W6,0,80.5,o+s*(B6-W6/2),MC.kir);box(L6,W6,25,2*I6,s*(B6-W6/2),80.5,o,MC.kir);}
      box(L6,2*I6,W6,2*I6,0,88,o,MC.kir);
      const gl=tag(box(ld6,156,3,156,0,56.5,o,M.glass),'Deckelglas');gl.userData.noShadow=gl.userData.inkBox=1;
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Scharnier6',1);ld6.add(q);box(q,40,12,1.2,s*55,6,-0.6,M.brass);box(q,30,10,1.2,s*55,62,-0.6,M.brass);box(q,30,10,1.2,s*55,74,-0.6,M.brass);
        const k=mesh(q,cylY(2.5,30,20),M.brass,s*55,68,-2.5);k.rotation.z=Math.PI/2;}
      const g=tag(new THREE.Group(),'Beschlag6',1);ld6.add(g);strips(g,43,o);strips(g,87,o);for(const sx of[-1,1])for(const sz of[-1,1])box(g,26,1,26,sx*(B6-13),93.5,o+sz*(B6-13),M.brass);
      leaf(ld6,0,2*B6,true,false);leaf(ld6,68,2*B6,false,true);leaf(ld6,68,2*B6,true,false);
      const bg=tag(new THREE.Group(),'Firmenschild6');ld6.add(bg);const DM=[[19.3,0],[0,12],[-19.3,0],[0,-12]];plate(bg,DM,0.8,0,30.4,2*B6,M.steel);
      const sg=new THREE.ShapeGeometry(new THREE.Shape(DM.map(([a,b])=>V2(a,b)))),uv=sg.attributes.uv,ps=sg.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(ps.getX(i)+19.3)/38.6,(ps.getY(i)+12)/24);
      const dc=mesh(bg,sg,MC.badge,0,30.4,2*B6+0.82);dc.userData.decal=1;}

    /* ================= the outer box (Überkasten 127-556.01, renumbered 52 00 16, 28.2.42; 1 on Boden-Chronometer 127-556. A-1, 4.3.42) ================= */
    /* "gebleichte Birke", "gezinkt, geleimt" (bleached birch, dovetailed and glued), 1:2 (the scan 1.195 px/mm, by the plan's 370; its 225 and 270 measure the same).
       Its figures (sure but where said): the body 157 high closed to its parting line ("Trennlinie") with the base plate, the lid 88 (the 1:5 view; a pencil "240" beside
       88 + 157); the walls 12.5 (likely), 225 inside at the rim front to back (Schnitt A-B), so 250 outside (the "250" under it, "260" in pencil); the base plate 12.5 thick
       (likely), 270 front to back, 10 past the walls; in plan 370 over its ends, the body 270 long outside (370 less the plan's 50 at each end; it measures 271), so 245
       inside. The plate's ends are arcs, traced on the plan (its outline every 6 px): R 367 about the long axis (sagitta 24 over the 270, the mid-points within a pixel),
       the corners rounded r 8 (scaled). A strip inside the rim (17, 18), 13 high and 5 thick, standing 4 over the walls (likely: the lid closes over it). Cushions ("Polster",
       the swirled hatching) on each wall, the floor and the lid's top, each a lens 20 thick at its middle (the side's and lid's "20", sure; the ends' scale 23, the floor's 21:
       estimated 20), so the figures fit the wooden box with nothing to spare: 225 = 20 + 185 + 20 across; 245 = 20 + 10 (the handles) + 185 + 10 + 20 along; 157 + 88 less
       the two boards, 220 = 20 + 180 + 20 high. The wooden box stands on the floor cushion's crown, its handles along the long side (51 00_1's plan); its latch and keeper,
       5-8 proud of its front, press 2-3 into the front cushion. Two hinges (7) at the back, 32 long, from 68 to 100 off the middle line, 2.5 proud; hook and eye (9,
       "Haken u. Öse handelsüblich", commercial) at the front, the eye 9 under the rim (scaled), their size estimated. The strap (10, 30 wide, its buckle on the lid) fixed on
       each end wall by two screws ("Schraube f. Riemenbef.") 80 apart, the lower 60 over the floor: drawn up its end wall to the rim, where, with the lid open, it falls off
       (51 00_1's plan draws its ends lying loose): its loose ends and buckle aren't drawn; leather 3 thick (estimated). The eyes (11, 12: 3 × 15 DIN 96, 127-556.01-08) on
       the plate's ends 25 out from the walls on the long axis (the plan's "25"), a disc Ø 23 round a centre Ø 8.5 (scaled): drawn so, 2 thick, the centre the screw's
       head (estimated). The catch (19) inside the front isn't drawn: its form can't be read. Its parts list names no part (Sach-Nr. only): which number is which is
       inferred. It carries the wooden box when it travels (A-1 draws the two together, the outer lid open): the Transport box view (app.js) shows it so; the other views leave it */
    const OB=YF-32.5,OP=OB+12.5,OT=OB+157,OX=135,OZ=125,OW=12.5;   /* the base plate's underside, the floor (the plate's top), the parting line; the body's half outside */
    const over=prt(root,'overBox');const overW=rv(over,'last first');   /* the drawings' outer box; the 6MX's below */
    {const B=tag(new THREE.Group(),'Ueberkasten');overW.add(B);
      /* the base plate: the ends' arcs R 367 about (∓(185 − 367), 0), filleted r 8 into the long sides (z ±135) */
      const R=367,F=8,cx=185-R,fz=135-F,fx=cx+Math.sqrt((R-F)**2-fz*fz),out=[];   /* cx: the right end's centre; fx: its fillets' centres' x, from |f − C| = R − F */
      const arc=(c,r,a0,a1,n)=>{for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n,p=[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)],q=out[out.length-1];if(!q||Math.hypot(p[0]-q[0],p[1]-q[1])>1e-6)out.push(p);}};   /* a point where the last arc ended isn't repeated */
      const ae=Math.atan2(fz,fx-cx);   /* the end arc's half angle, at the fillets' tangent points */
      arc([cx,0],R,-ae,ae,24);arc([fx,fz],F,ae,Math.PI/2,6);arc([-fx,fz],F,Math.PI/2,Math.PI-ae,6);arc([-cx,0],R,Math.PI-ae,Math.PI+ae,24);arc([-fx,-fz],F,Math.PI+ae,1.5*Math.PI,6);arc([fx,-fz],F,1.5*Math.PI,2*Math.PI-ae,6);out.pop();   /* its last point is the first */
      const bp=polyGeo(area(out)>0?out:out.slice().reverse(),OW);bp.translate(0,OB,0);mesh(B,bp,MC.birch);
      const hb=OT-OP;for(const s of[-1,1]){box(B,2*OX,hb,OW,0,OP+hb/2,s*(OZ-OW/2),MC.birch);box(B,OW,hb,2*OZ-2*OW,s*(OX-OW/2),OP+hb/2,0,MC.birch);}
      /* the strip inside the rim (17, 18): 13 high, 5 thick, 4 over the walls */
      const L=tag(new THREE.Group(),'Randleiste');overW.add(L);const IX=OX-OW,IZ=OZ-OW;
      for(const s of[-1,1]){box(L,2*IX,13,5,0,OT-4.5,s*(IZ-2.5),MC.birch);box(L,5,13,2*IZ-10,s*(IX-2.5),OT-4.5,0,MC.birch);}
      /* the cushions: on the long walls (front and back), the ends and the floor, each 1 off its neighbours (their rims 1 thick) */
      const hc=OT-9-OP-1,yc=OP+1+hc/2;
      for(const s of[-1,1]){const g=pillow(2*IX-2,hc,20);g.rotateX(-s*Math.PI/2);tag(mesh(overW,g,MC.felt,0,yc,s*IZ),'Polster.S');   /* rotateX(∓π/2): its +y to ∓z, out of the wall */
        const e=pillow(2*IZ-2,hc,20);e.rotateX(Math.PI/2);e.rotateY(-s*Math.PI/2);tag(mesh(overW,e,MC.felt,s*IX,yc,0),'Polster.E');}
      tag(mesh(overW,pillow(2*IX-2,2*IZ-2,20),MC.felt,0,OP,0),'Polster.B');
      /* the strap's ends on the end walls (10): 30 wide, from 10 under its lower screw to the rim, each held by its two screws, 60 and 140 over the floor */
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Riemen');overW.add(g);box(g,3,OT-(OP+50),30,s*(OX+1.5),(OT+OP+50)/2,0,MC.leather);
        for(const h of[60,140])tag(screw(along(overW,[s*(OX+3),OP+h,0],[-s,0,0]),0,0,0,3.5,2.6,25,2,M.steel),'WN-ur');
        /* the eyes on the plate's ends: a disc Ø 23 × 2 and its screw (3 × 15), whose round head is the centre Ø 8.5 */
        const ex=s*(OX+25);tag(mesh(overW,cylY(11.5,2,48),M.steel,ex,OB+OW+1,0),'Riemenoese');tag(screw(along(overW,[ex,OB+OW+2,0],[0,-1,0]),0,0,0,4.25,2.2,15,1.5,M.steel),'WN-ro');}
      /* the hinges (7) at the back: the body's leaves 32 × 12 × 1, the knuckle Ø 5 on the parting line (estimated but their length and place) */
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Scharnier.U');overW.add(g);box(g,32,12,1,s*84,OT-6,-OZ-0.5,M.brass);const k=mesh(g,cylY(2.5,32,20),M.brass,s*84,OT,-OZ-2.5);k.rotation.z=Math.PI/2;}
      /* the eye of the hook and eye (9): a screw eye on the front, 9 under the rim (commercial, estimated: a ring Ø 9 of 1.6 wire on a shank) */
      {const g=tag(new THREE.Group(),'Hakenoese');overW.add(g);const r=mesh(g,new THREE.TorusGeometry(3.7,0.8,10,28),M.steel,0,OT-9,OZ+5.2);r.rotation.y=Math.PI/2;
        const sh=mesh(g,cylY(0.8,7,10),M.steel,0,OT-9,OZ-1.5);   /* from 5 into the wall to the ring's wire */sh.rotation.x=Math.PI/2;}}
    /* the lid: walls and top 12.5, 88 high outside, hinged at the back about the knuckles, 2.5 behind it; the cushion (16) on its top's inside, 20 at its middle */
    const olG=new THREE.Group();olG.position.set(0,OT,-OZ-2.5);overW.add(olG);const ol=prt(olG,'overLid');ol.position.z=2.5;
    {const B=tag(new THREE.Group(),'Ueberkasten.D');ol.add(B);const h=88-OW;
      for(const s of[-1,1]){box(B,2*OX,h,OW,0,h/2,OZ+s*(OZ-OW/2),MC.birch);box(B,OW,h,2*OZ-2*OW,s*(OX-OW/2),h/2,OZ,MC.birch);}
      box(B,2*OX,OW,2*OZ,0,h+OW/2,OZ,MC.birch);
      const g=pillow(2*(OX-OW)-2,2*(OZ-OW)-2,20);g.rotateX(Math.PI);tag(mesh(ol,g,MC.felt,0,h,OZ),'Polster.D');
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Scharnier.U',1);ol.add(q);box(q,32,12,1,s*84,6,-0.5,M.brass);}
      /* the hook (9): a wire Ø 1.6 hanging from a screw eye 8 over the parting line down to the box's eye, its end bent through it (commercial, estimated) */
      const hk=tag(new THREE.Group(),'Haken');ol.add(hk);const r=mesh(hk,new THREE.TorusGeometry(2.5,0.8,10,24),M.steel,0,8,2*OZ+3.3);r.rotation.y=Math.PI/2;
      cylBetween(hk,0.8,-9,5.5,M.steel,0,2*OZ+3.3,10);const c=mesh(hk,closeGeo(new THREE.TorusGeometry(2.0,0.8,10,20,Math.PI)),M.steel,0,-9,2*OZ+5.3);c.rotation.y=Math.PI/2;c.rotation.z=Math.PI;}

    /* the 6MX's outer box (Kirov 247's: 13_Kirow_247_Kasten_1.jpg, Poljot 08479's 14_Poljot_08479_Kasten_komplett.jpg): of the inner box's wood, felt-lined, a half-round
       notch in the body's front at the parting line and a half-round tab on the lid's front that closes into it, a turning hook on the tab over a brass catch on the body
       below the notch, the number plate 247 on the lid's front, a leather strap on each side. Its sizes aren't on any photograph that can be scaled (13_ is taken from
       above, the lid raised): estimated round the inner box, its 190 in 18 of felt at the floor and top and 8 at the walls, walls 12: 250 each way and high, the parting
       line at half; the notch's radius 48 (13_: 0.38 of the front's width, 93 mm across) */
    /* measured since 18 October 2026 (±7 %: the inner box, 190 by the TU, scaled on 13_Kirow_247_Kasten_1.jpg and 14_Poljot_08479_Kasten_komplett.jpg, tilted): the body's
       front about 233 wide (the lid's 237-251), the notch a circular segment, its chord 102 and depth 33 (r 56, its centre 23 over the parting line), the catch Ø 26 51 under
       the parting line; the parting line's height, the box's and the straps' places hidden by the bag (estimated as before). The lid's tab reads larger than the notch (chord
       105-111, 41-44 high), so it may lap over the body's front: drawn filling the notch (README, Unresolved) */
    const OB6=YF-30,OP6=OB6+12,OT6=OB6+125,OX6=233/2,OW6=12,NC=23,NR=56,ND=33,NH=Math.sqrt(NR*NR-NC*NC),NA=Math.atan2(NC,NH),FI=OX6-OW6;   /* its underside, floor, parting line; half its width; walls; the notch (centre over the line, radius, depth, half chord, its ends' angle); inside */
    const ol6G=new THREE.Group();ol6G.position.set(0,OT6,-OX6-2.5);const ol6=prt(ol6G,'overLid');ol6.position.z=2.5;
    const arc6=(c,r,t0,t1,n)=>[...Array(n+1).keys()].map(i=>{const t=t0+(t1-t0)*i/n;return[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];});
    {const g=rv(over,'6mx');g.add(ol6G);const Bo=tag(new THREE.Group(),'Ueberkasten6');g.add(Bo);const hb=OT6-OP6;
      box(Bo,2*OX6,OW6,2*OX6,0,OB6+OW6/2,0,MC.kir);box(Bo,2*OX6,hb,OW6,0,OP6+hb/2,-(OX6-OW6/2),MC.kir);
      for(const s of[-1,1])box(Bo,OW6,hb,2*OX6-2*OW6,s*(OX6-OW6/2),OP6+hb/2,0,MC.kir);
      plate(Bo,[[-OX6+OW6,OP6],[OX6-OW6,OP6],[OX6-OW6,OT6],[NH,OT6],...arc6([0,OT6+NC],NR,-NA,-Math.PI+NA,24).slice(1,-1),[-NH,OT6],[-OX6+OW6,OT6]],OW6,0,0,OX6-OW6,MC.kir);
      tag(box(g,2*FI,18,2*FI,0,OP6+9,0,MC.felt),'Polster6');
      for(const s of[-1,1]){tag(box(g,8,hb-18,2*FI-16,s*(FI-4),OP6+18+(hb-18)/2,0,MC.felt),'Polster6');}
      tag(box(g,2*FI,hb-18,8,0,OP6+18+(hb-18)/2,-(FI-4),MC.felt),'Polster6');
      tag(box(g,2*FI,OT6-ND-4-(OP6+18),8,0,(OT6-ND-4+OP6+18)/2,FI-4,MC.felt),'Polster6');   /* the front's, under the notch */
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Riemen');g.add(q);box(q,3,OT6-(OP6+40),30,s*(OX6+1.5),(OT6+OP6+40)/2,0,MC.leather);
        for(const h of[50,100])tag(screw(along(g,[s*(OX6+3),OP6+h,0],[-s,0,0]),0,0,0,3.5,2.6,15,2,M.steel),'WN-ur');}
      {const q=tag(new THREE.Group(),'Hakenoese');g.add(q);const d=mesh(q,cylY(10,2,40),M.brass,0,OT6-51,OX6+1);d.rotation.x=Math.PI/2;const pn=mesh(q,cylY(1.5,5,16),M.steel,0,OT6-51,OX6+4.5);pn.rotation.x=Math.PI/2;}
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Scharnier.U');g.add(q);box(q,32,12,1,s*70,OT6-6,-OX6-0.5,M.brass);const k=mesh(q,cylY(2.5,32,20),M.brass,s*70,OT6,-OX6-2.5);k.rotation.z=Math.PI/2;}}
    {const o=OX6,h=125-OW6,D=tag(new THREE.Group(),'Ueberkasten6.D');ol6.add(D);
      box(D,2*OX6,h,OW6,0,h/2,o-(OX6-OW6/2),MC.kir);for(const s of[-1,1])box(D,OW6,h,2*OX6-2*OW6,s*(OX6-OW6/2),h/2,o,MC.kir);box(D,2*OX6,OW6,2*OX6,0,h+OW6/2,o,MC.kir);
      plate(D,[[-OX6+OW6,h],[-OX6+OW6,0],[-NH+0.5,0],...arc6([0,NC],NR-0.5,-Math.PI+NA,-NA,24).slice(1,-1),[NH-0.5,0],[OX6-OW6,0],[OX6-OW6,h]],OW6,0,0,2*OX6-OW6,MC.kir);
      tag(box(ol6,2*FI,18,2*FI,0,h-9,o,MC.felt),'Polster6');
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Scharnier.U',1);ol6.add(q);box(q,32,12,1,s*70,6,-0.5,M.brass);}
      const np=tag(new THREE.Group(),'Nummernschild');ol6.add(np);const d=mesh(np,cylY(15.5,0.8,48),M.steel,0,h-30,2*OX6+0.4);d.rotation.x=Math.PI/2;
      const dc=mesh(np,new THREE.CircleGeometry(15.5,48),MC.num,0,h-30,2*OX6+0.82);dc.userData.decal=1;
      const hk=tag(new THREE.Group(),'Haken');ol6.add(hk);const b=mesh(hk,cylY(4,3,24),M.steel,0,-ND/2,2*OX6+1.5);b.rotation.x=Math.PI/2;box(hk,6,51-ND/2+5,1.5,0,-(51+ND/2-5)/2,2*OX6+3.75,M.steel);}

    /* ================= the transit lock (Feststeller, 15 on 05 01; its number 05 01 01 in 05 01's list, which Glasrand kompl.'s own sheet also bears) ================= */
    /* No sheet: scaled on 05 01's Schnitt A-B: a knob Ø 19.6 turning a lever in the box's front right corner (the knob's axis 65 and 63 from the box's centre), its lever 28 long and
       8 wide, a pin Ø 8 near its end, on a bracket on the right wall; turned toward the centre the lever presses the ring onto the locking bracket on the bowl, so neither gimbal
       swings; drawn turned off, along the front wall. Heights not drawn (05 01): read on Wempe 5377 (bonhams_26816_327, the lock enlarged, scaled by the knob's Ø 19.6 across
       and its top's ellipse, 0.75 of it, so seen 49° from above) and Greenwich's wartime Wempe (rmg_L5393_wempe_wartime_001.jpg): the lever lies over the ring's top (both draw
       it and its pin in front of the ring's band), at the box's rim, on a bracket on the right wall; on it a hub about Ø 10 standing 10.8 (likely, ±1.5) under the knob, 4.3
       thick (4.5 drawn), its top so 18 over the rim; the lever 2.2 thick (2.5 drawn); the pin Ø 4 standing 16.7 over the lever about halfway along it (5377's, plain; the
       wartime one has a round head). Until 16 October 2026 the lever was drawn at the pivots' height and the knob, 10 thick on a Ø 4 stem, barely over the rim (estimated) */
    const lk=prt(root,'caseLock');
    for(const[V,Wx]of/** @type {[string,number][]} */([['last first',80],['6mx',85]])){const c=[65.1,62.9],e=[39,73],ly=YL+0.5,lt=ly+2.5;const g=tag(new THREE.Group(),'050101.F');rv(lk,V).add(g);   /* ly, lt: the lever's underside and top; Wx: the right wall's inside (the 6MX's box 5 wider each side, its lock at the same height over the ring: estimated) */
      box(g,5.3+Wx-80,18.5,15,(74.7+Wx)/2,YL-10.25,62.9,M.steel);box(g,18,4,12,69,ly-2,62.9,M.steel);   /* the bracket: a plate on the wall, under the rim, and the lever's seat on it (estimated) */
      cylBetween(g,2,ly-4,lt+0.5,M.steel,c[0],c[1],20);cylBetween(g,4.9,lt-0.5,lt+11,M.steel,c[0],c[1],32);   /* the lever's arbor through the seat, and the hub (Ø 9.8) to the knob */
      const lv=polyGeo(stadiumPts(c,e,8),2.5);lv.translate(0,ly,0);mesh(g,lv,M.steel);cylBetween(g,2,ly+0.5,lt+16.7,M.steel,c[0]+(e[0]-c[0])*0.55,c[1]+(e[1]-c[1])*0.55,16);
      /* the knob knurled round its side (Greenwich's wartime Wempe, black; Wempe 6161 and 5377, brass: every photographed one): the band 0.5 to 4.0, 0.35 deep (estimated) */
      mesh(g,new THREE.LatheGeometry([V2(0,0),V2(9.3,0),V2(9.45,0.5),V2(0,0.5)],40),MC.knob,c[0],lt+10.8,c[1]);mesh(g,knurl(9.8,0.35,3.5,90),MC.knob,c[0],lt+11.3,c[1]);
      mesh(g,new THREE.LatheGeometry([V2(0,4.0),V2(9.45,4.0),V2(9.3,4.5),V2(0,4.5)],40),MC.knob,c[0],lt+10.8,c[1]);}

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
       part's group, which stands in its holder in the box or, while it winds, sits on the fusee's square (keyAt) */
    /* at rest the key stands in its holder (above), its axis up, its tube's mouth under the shelf where its body's cone is Ø 11, the hole's: 35.27 over the mouth (the cone
       Ø 9.14 to 14.5 over 10, from 31.8); as first drawn the 1940 key's cone (Ø 10.32 to 17.9 over 19.3, from 31.7) at 33.43. The paddle (and the 1940 handle) faces the box's
       middle (turned −45° about the axis); until 15 October 2026 it lay on the box's floor in the back left corner, where no photograph has it */
    const key=prt(root,'key'),KEYREST=()=>{const f=!!key.userData.first;key.position.set(KX,KH-(f?33.43:35.27),KZ);key.rotation.set(0,-45*D2R,0);};KEYREST();
    {const g=new THREE.Group();g.userData.rev='last 6mx';key.add(g);
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
    /* As first drawn (the page's Variants), the key of 1940 (Aufzugschlüssel 127-556.02 U 01 = 51 00 11, 12.12.40, 2:1), which the one-way key of 1943 replaced under the same
       number: 84 overall and the stem 32 out of the body (sure); the rest traced on the sheet at 6.79 px/mm (by its 84): the handle a flat pear-shaped plate (the tang, part 1:
       the side view draws it 3.2 thick and no bulb), widest Ø 34.8 about 9 from its top, its neck Ø 16.5; a collar Ø 20.5 × 2.9; the body (2) a cone Ø 17.9 to 10.3 over 19.3;
       the stem (3) Ø 6.0 pressed in, its socket for the fusee's square drilled from its end (drawn round, Ø 3.1, 28 deep, as the later tube's: estimated), its end chamfered
       0.9 × 45°; the screw (5) on the collar beside the tang, 5.3 from the axis (head Ø 3 × 1, estimated). The click spring (4) in the body isn't drawn. Its materials, which the
       sheet doesn't give, as the later key's (estimated). It stands in the holder as the later key does, on its cone (KEYREST) */
    {const g=new THREE.Group();g.userData.rev='first';key.add(g);   /* placed by the key part (KEYREST, keyAt): the same frame, its stem's end at 0 */
      const lathe=(pr,n=48)=>{let q=[...pr,pr[0]];if(area(q)<0)q=q.slice().reverse();return new THREE.LatheGeometry(q.map(([r,y])=>V2(r,y)),n);};
      tag(mesh(g,lathe([[3.0,31.7],[5.16,31.7],[8.95,51.0],[10.25,51.0],[10.25,54.0],[0,54.0],[0,45.0],[3.0,45.0]]),MC.black),'127556.02-02');   /* the body and collar, the stem pressed 13.3 into it (estimated) */
      tag(mesh(g,lathe([[1.55,0],[2.1,0],[3.0,0.9],[3.0,45.0],[0,45.0],[0,28.0],[1.55,27.2]]),M.brass),'127556.02-03');
      const PR=[[54.0,9.0],[55.0,9.0],[56.0,8.69],[57.5,8.33],[59.0,8.25],[60.4,8.4],[61.9,8.77],[63.4,9.43],[64.8,10.39],[66.3,11.86],[67.8,14.0],[69.3,15.7],[70.7,16.65],[72.2,17.24],[73.7,17.39],
        [75.2,17.39],[76.6,17.0],[78.1,16.2],[79.6,15.03],[81.05,12.45],[82.5,8.55],[83.4,4.8],[84.0,0.6]];
      const out=[...PR.map(([y,r])=>[r,y]),...PR.slice().reverse().map(([y,r])=>[-r,y])];   /* the plate's outline in its own plane (x across, y along the key) */
      const pl=polyGeo(area(out)>0?out:out.slice().reverse(),3.2);pl.rotateX(-Math.PI/2);pl.translate(0,0,1.6);tag(mesh(g,pl,MC.black),'127556.02-01');
      tag(mesh(g,lathe([[0,54.0],[1.5,54.0],[1.5,55.0],[0,55.0]],20),M.steel,0,0,5.3),'127556.02-05');}
    /* keyAt(seat): the key onto the fusee's square (seat {g, y}: fusee.js keySeat, the dust plate's group, which turns with the fusee, and its face, where the square is 3.1
       across and the tube's mouth stops), its axis down the square (the movement frame's −y), or (no seat) back in its holder */
    const keyAt=(s,d=0)=>{if(s){s.g.add(key);key.position.set(0,s.y-0.05-d,0);key.rotation.set(Math.PI,0,0);}else{root.add(key);KEYREST();}};   /* d: how far out along the square it still is (coming on or going off) */
    stayAt();
    const out={stay:stayAt,root,ring:ringG,bowl:bowlG,inner:bowlS,lid:lidG,tongue:tgG,YP,YB,keyAt,keyRest:()=>{if(key.parent===root)KEYREST();},shutter:q=>{cp.rotation.y=CPS*(1-q);cp.userData.turn();},over,overLid:olG,parts:{bowl,closingPlate:cp,bezel:bz,gimbalRing:rgP,box:bx,lid:ld,caseLock:lk,key,overBox:over,overLid:ol}};
    /* rev(v): the lids the page turns are the version's (app.js's onRev) */
    out.rev=v=>{const s=v==='6mx';out.lid=s?lid6G:lidG;out.tongue=s?tg6:tgG;out.overLid=s?ol6G:olG;bowlS.position.y=s?-DY6:0;cp.userData.spEnd(s?YB-61.3:YB-63);};
    return out;}
  return{build,YP:YB-11.5,YB};
})();
