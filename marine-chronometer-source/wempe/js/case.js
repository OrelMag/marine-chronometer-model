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
   Units mm, the movement's frame (dims.js): dial side +y (up in the box), 12 o'clock -z (toward the box's back, its hinges), 3 o'clock +x. The seat in the bowl's rim (its
   rebate's floor: the bowl's top face until 24 October 2026), on which the movement ring's flange lies, at YB. Plan outlines [x, z]; solids from KIT.solidGeo, turned profiles as cells of rings (cells() below), so every part is one closed
   solid with its holes; holes across a turned part (radial) are not cut, as on the movement's turned parts. */
const WCASE=(()=>{
  const{solidGeo,ring,bool,polyGeo,stadiumPts,area}=KIT,V2=(a,b)=>new THREE.Vector2(a,b),H=WD.H;
  const tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined);
  /* ================= heights (the movement's frame) =================
     YB: the seat in the bowl's rim (TC, below), on which the movement ring's flange (Ø 105.95 × 4.7, 05 08 00-3) lies, its body (Ø 96 −0.3) in the bowl's bore (Ø 98): the flange's underside,
     6.0 over the ring's inner face (frame.js: 0.35 + 6.0). YP: the gimbals' two pivot axes, both 11.5 under the ring's top (05 01's "11,5", from axis A to the ring's top: likely,
     29 px), and 5.3 under the bowl's top face: 05 01 draws the movement ring's flange lying on the bowl's top 4.6 over axis A in its elevation (11.5 px under it, the ring's
     top 29 px over it, scaled on the "11,5") and 4.75 over axis b in Schnitt C-D (12.6 of 30.5 px), ±0.5 each, the bezel and its glass over it, the glass's top 15.8 over
     the seat (R-05 01 01-2's 16). Taken at 5.3, 0.6 under them: 05 01 hangs the 1940 bowl (53.7 under its pivots); the cast bowl
     of 1942 (R-05 01 00-1, 65 high) must still turn in the ring (Ø 140) to be wound, onto its side (the instruction) or over (the videos), and its foot's edge (Ø 72.5 at 65
     under its top) sweeps √(36.25² + (65 − s)²) about the inner pivots, inside the ring's 70 only for s over 5.11 (its body's corner, Ø 106 at 50.5, for s over 4.77): at
     4.7 the bowl met the ring at 39°, at 5.0 at 56.5° (massprops.py); at 5.3 it clears by 0.16 (estimated). So the ring's top stands 6.2 over the bowl's (likely). Until
     21 October 2026 the ring's top was level with the bowl's (YB − 11.5), the bowl and all it holds 6.2 too high in the gimbals and the box. 51 00 10 puts the outer pivot's M6 11.5 under a line across the box's side 105 over its bottom: the box's
     bottom 93.5 under the pivots, its parting line at the ring's top */
  const YSEAT=5.3,YB=6.35,YP=YB-YSEAT,YF=YP-93.5,YT=YF+180,YL=YF+105,BW=185/2,WT=12.5;
  /* DY6: how much lower the Soviet 6MX's bowl hangs in the gimbals: its case brackets' pivot holes 3.0 under the threaded rim's top (YB + 1.7: Kirov No. 247's bowl,
     12_Kirow_247_E-Kontakt_3.jpg and 11_Kirow247_E-Kontakt_2.jpg, a camera fitted in the meridian plane, ±2; Kirov 2973's 3.7 under), where the drawings' are 11.5 under the
     ring's top (YB − 5.3): likely. Kirov-Poljot 24020, later, has them about 10.8 under: the 1950s bowls' are the higher */
  const DY6=YB+1.7-YP;
  /* the bezel screws onto the bowl, and that holds the movement in: a fine thread outside the bowl's rim and inside the bezel's skirt. The drawings are castings' sheets
     (R-05 01 00-1, R-05 01 01-2: nothing machined on them), but 05 01 01, the bezel finished, draws the thread's symbol up its skirt's bore, hidden (a dashed zig-zag at
     its left end, x 202-215 px, 22 px from the underside up to the step: 4.6 high at 4.78 px/mm; sure that it is a thread, likely its height), and the 6MX's bowls show
     it outside the rim (Kirov 14917 with its bezel off, rAw2zmulpk8 0:29, 2:52; Kirov-Poljot 24020, dg-chrono-6mx-gallery/leben-des-6mx/13_KirPol_24020_E-Kontakt3.jpg),
     and the notch cut through the threaded rim for the movement ring's radial pin (24020's, at the locking bracket). Its pitch on 24020: 7.0 px a groove (the rim's front,
     x 640-740, by the spectrum of the rows) over the band from the rim's top face to the collar, 50-51 px there for the 6MX's 5.55: 0.77 mm, so 0.75 (±0.05), a DIN 13
     fine pitch. Its form the ISO basic profile (iso, below: 60°, 0.406 deep for 0.75). Its size: the bezel's skirt bore as traced on 05 01 01, r 54.9, the inside thread's
     crests, its roots 0.406 out, r 55.306; the bowl's thread 0.03 inside it radially all round (0.015 along the flanks: a fit, the bezel's flanks bearing on the bowl's
     when it is screwed down), its roots r 54.87 and crests r 55.276, Ø 110.55 (the 6MX's rim Ø 110.5 measured on Kirov 247's dial photograph: below). Right-hand (estimated),
     the bowl's and the bezel's on one helix (TH.yr). TC: the bowl's rim over the seat, the flange's 4.7 */
  const TC=4.7,TH={p:0.75,d:0.406,Rm:54.87,Rf:55.306,yr:YB};
  const HGL=148,HGT=0.6,STA=5,STB=40,STC=20,STD=45,STL=91,SS0=23.5,SS1=86.5;   /* the hinge's length and leaf, the lid stay's pivot (over the parting line, from the back's outside), its pin (under it, from the back) and the bar, its slot from the pivot */
  const KX=BW-WT-14,KZ=-(BW-WT-14),KH=YF+WT+65;   /* the key's holder: its fitting's centre (back right, 14 from each wall: 51-00_1, the box, below) and the fitting's top, where the key's cone seats */
  const N=240,CC=new Map(),circ=(r,s0=0)=>{const k=r+'|'+s0;if(!CC.has(k)){const o=[];for(let i=0;i<N;i++){const t=s0+i/N*TAU;o.push([r*Math.cos(t),r*Math.sin(t)]);}CC.set(k,o);}return CC.get(k);};
  /* turned solids as plan cells of rings: rs the radii, ys[i] the depths [y0, y1] of the disc (i 0) and of each ring (each a constant or a function of the plan point), F[i] its
     features; each ring in two halves (a ring isn't a simple outline), split at s0 so no feature crosses the split, a sloped one in N/4 sectors. Every circle is the same N points, so neighbouring cells share them */
  const cells=(rs,ys,F=[],s0=0)=>{const out=[{loop:circ(rs[0],s0),y0:ys[0][0],y1:ys[0][1],F:F[0]||[]}];
    for(let i=1;i<rs.length;i++){const a=circ(rs[i-1],s0),b=circ(rs[i],s0),M=ys[i].some(y=>typeof y==='function')?N:2;   /* a sloped ring in sectors one step wide, so each face is a quad whose two triangles span both circles and follow the slope.
       N/4 sectors until 24 October 2026: their faces of 5 + 5 points triangulated with slivers on three points of one circle, flat (solidGeo gives a face level along its
       outline a normal straight up), 50° off a cone's, which Edges drew as broken rings round every seam of the bezel's bevel and the sight cone */
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
  /* a knurl's flanks shaded leaning 15° off the radius, not their own 36-55°: neighbouring flanks then part by 30°, under the 37° at which Edges draws a crease (makeInk).
     Their teeth, a pixel or less at any view of the case, drew every crease line by chance and the band came out in rows of dashes (the bezel, 24 October 2026); the
     shading still alternates tooth by tooth. Only the side faces out at r0 (the teeth's roots) or beyond; a bore through it keeps its own */
  const softKnurl=(g,r0)=>{const P=g.attributes.position,N=g.attributes.normal,c=Math.cos(15*Math.PI/180),s=Math.sin(15*Math.PI/180);
    for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i),r=Math.hypot(x,z),nx=N.getX(i),nz=N.getZ(i);if(r<r0-1e-3||Math.abs(N.getY(i))>0.5)continue;
      const ux=x/r,uz=z/r,a=nx*ux+nz*uz,b=-nx*uz+nz*ux;if(a<=0||Math.abs(b)<=a*s/c)continue;const sb=Math.sign(b);N.setXYZ(i,c*ux-sb*s*uz,0,c*uz+sb*s*ux);}
    N.needsUpdate=true;return g;};
  const knurl=(r,d,h,n,hr=0)=>softKnurl(polyGeo(knurlPts(r,d,n),h,hr?[[0,0,hr]]:[]),r-d);
  /* the thread's form: the ISO metric basic profile, 60°, its depth 5/8 of the sharp V's (0.541 p), a flat at the outside thread's root a quarter of the pitch wide and at
     its crest an eighth: iso(u) its height, 0 at the root to 1 at the crest, u in pitches (the root's middle at whole u). Rows: thread() and lathT() sample every thread on
     one lattice of heights, a sixteenth of the pitch from yr, so an inside thread and an outside one on the same helix, drawn a constant apart, stay that far apart between
     their rows too (two piecewise linear surfaces a constant apart) */
  const iso=u=>{const a=Math.abs(u-Math.round(u));return a<0.125?0:a>0.4375?1:(a-0.125)/0.3125;};
  const rowsY=(y0,y1,yr,p)=>{const dy=p/16,lo=Math.min(y0,y1),hi=Math.max(y0,y1),o=[];for(let k=Math.floor((lo-yr)/dy)+1;yr+k*dy<hi-1e-6;k++)if(yr+k*dy>lo+1e-6)o.push(yr+k*dy);return y1<y0?o.reverse():o;};   /* the lattice's heights strictly between y0 and y1, from y0 toward y1 */
  /* a fine thread chased on a turned face (the bowl's rim outside, the bezel's skirt inside): a band from y0 to y1 between a plain face at rp and the threaded face
     r(θ, y) = R + d·s(y)·(iso(u) − (inside ? 1 : 0)), u = (y − yr)/p + θ/τ (θ = atan2(z, x): a right-hand thread up +y): R the outside thread's root, or the inside one's,
     d its depth, so an inside thread on the same yr whose R is the outside one's R + d + c lies c clear of it radially all round (c/2 along the 60° flanks); s(y) rises 0 to 1
     over e0 from y0 and falls back over e1 to y1, the thread running out into an undercut, a relief or a lead chamfer at its ends (s0, s1: the run-out's ends, y0 and y1 unless
     the thread is built in two bands). slot: a slot's half-width cut through the band at angle a (its sides parallel), else the whole ring. One closed solid, the turned faces
     shaded smooth round the axis (smoothRev), the flanks sharp */
  const thread=({R,rp,d,p,yr,y0,y1,s0=y0,s1=y1,e0=0.5,e1=0.5,inside=false,slot=0,a=0})=>{const NT=360,Y=[y0,...rowsY(y0,y1,yr,p),y1],NY=Y.length-1,q=inside?1:0,P=[],out=inside?-1:1;
    const s=y=>Math.min(1,(y-s0)/e0,(s1-y)/e1),rf=(t,y)=>R+d*Math.max(0,s(y))*(iso((y-yr)/p+t/TAU)-q);
    const ang=(r,i)=>slot?a+slot/r+(TAU-2*slot/r)*i/NT:i/NT*TAU,ni=slot?NT+1:NT,ix=i=>i%ni;
    const T=[],Q=[];for(let i=0;i<ni;i++){const tt=ang(R,i),tp=ang(rp,i),A=[],B=[];for(const y of Y){const r=rf(tt,y);A.push([r*Math.cos(tt),y,r*Math.sin(tt)]);B.push([rp*Math.cos(tp),y,rp*Math.sin(tp)]);}T.push(A);Q.push(B);}
    /* a triangle a b c wound to face along n (the face's outward way), so every face faces out whatever order it was listed in */
    const tr=(a,b,c,n)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],x=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];P.push(...(x[0]*n[0]+x[1]*n[1]+x[2]*n[2]<0?[a,c,b]:[a,b,c]));};
    const quad=(a,b,c,e,n)=>{tr(a,b,c,n);tr(a,c,e,n);},rad=(pt,k)=>{const r=Math.hypot(pt[0],pt[2]);return[k*pt[0]/r,0,k*pt[2]/r];};
    for(let i=0;i<NT;i++){const i1=ix(i+1);
      for(let j=0;j<NY;j++){quad(T[i][j],T[i1][j],T[i1][j+1],T[i][j+1],rad(T[i][j],out));quad(Q[i][j],Q[i1][j],Q[i1][j+1],Q[i][j+1],rad(Q[i][j],-out));}
      quad(T[i][NY],T[i1][NY],Q[i1][NY],Q[i][NY],[0,1,0]);quad(T[i][0],T[i1][0],Q[i1][0],Q[i][0],[0,-1,0]);}
    if(slot)for(const[i,k]of[[0,-1],[NT,1]]){const t=ang(R,i),n=[-k*Math.sin(t),0,k*Math.cos(t)];for(let j=0;j<NY;j++)quad(T[i][j],Q[i][j],Q[i][j+1],T[i][j+1],n);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P.flat(),3));g.computeVertexNormals();return smoothRev(g);};
  /* a turned part with a thread on it, as one solid: the closed profile pr ([r, y], either way round) turned about the axis, its edge from pr[k] to pr[k + 1] (k = th.k)
     threaded as thread() threads a band (th: R, d, p, yr, s0, s1, e0, e1, inside; the edge's ends, where s is 0, at R whatever pr gives them) */
  const circT=r=>[...Array(360).keys()].map(i=>{const t=i/360*TAU;return[r*Math.cos(t),r*Math.sin(t)];});   /* lathT's 360 corners at r, in plan */
  const lathT=(pr,th)=>{const NT=360,{R,d,p,yr,k,inside=false,e0=0.5,e1=0.5}=th,q=inside?1:0,s0=th.s0??Math.min(pr[k][1],pr[(k+1)%pr.length][1]),s1=th.s1??Math.max(pr[k][1],pr[(k+1)%pr.length][1]);
    const s=y=>Math.min(1,(y-s0)/e0,(s1-y)/e1),rf=(t,y)=>R+d*Math.max(0,s(y))*(iso((y-yr)/p+t/TAU)-q);
    const n=pr.length,k1=(k+1)%n,rg=[];   /* the rings: each a profile point, r a function of the turn on the threaded edge */
    for(let i=0;i<n;i++){const[r,y]=pr[i],on=i===k||i===k1;rg.push({y,r:on?t=>rf(t,y):()=>r});
      if(i===k)for(const yy of rowsY(y,pr[k1][1],yr,p))rg.push({y:yy,r:t=>rf(t,yy)});}
    const ar=pr.reduce((a,c,i)=>{const e=pr[(i+1)%n];return a+c[0]*e[1]-e[0]*c[1];},0)>0?1:-1,P=[];
    const tr=(a,b,c,nn)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],x=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(Math.hypot(...x)<1e-12)return;P.push(...(x[0]*nn[0]+x[1]*nn[1]+x[2]*nn[2]<0?[a,c,b]:[a,b,c]));};
    const V=rg.map(g=>[...Array(NT).keys()].map(i=>{const t=i/NT*TAU,r=g.r(t);return[r*Math.cos(t),g.y,r*Math.sin(t)];}));
    for(let a=0;a<V.length;a++){const b=(a+1)%V.length,dy=rg[b].y-rg[a].y;
      for(let i=0;i<NT;i++){const i1=(i+1)%NT,t=(i+0.5)/NT*TAU,dr=rg[b].r(t)-rg[a].r(t),nr=ar*dy,ny=-ar*dr,nn=[nr*Math.cos(t),ny,nr*Math.sin(t)];   /* the profile's way out at this turn (on a flank the helix turns it) */tr(V[a][i],V[a][i1],V[b][i1],nn);tr(V[a][i],V[b][i1],V[b][i],nn);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P.flat(),3));g.computeVertexNormals();return smoothRev(g);};
  const box=(par,w,h,d,x,y,z,mt)=>mesh(par,new THREE.BoxGeometry(w,h,d),mt,x,y,z);
  /* a hinge's half, L long along x at x: its knuckle Ø 5 about (y, z) kc, drawn as cylY(2.5, L, 20) was (the same 20 corners), and its leaves (each [y0, y1, z0, z1]) joined to it
     in one outline (KIT.bool's union) extruded along x, so the leaf no longer runs into the knuckle: as a box fused with a cylinder each leaf's end inside the knuckle was weighed
     twice (19.5-71 mm³ a leaf) until 24 October 2026 (overlaps.py). The knuckle's faces shaded round as the cylinder's were */
  const hinge=(par,L,x,kc,leaves,mt)=>{const r=2.5,n=20,P=[...Array(n).keys()].map(i=>{const t=i/n*TAU;return[-(kc[0]+r*Math.sin(t)),kc[1]+r*Math.cos(t)];});   /* plan [-y, z]: rotateZ(-90°) below makes it (y, z), the extrusion x */
    let U=P;for(const[y0,y1,z0,z1]of leaves){const u=bool(U,[[-y0,z0],[-y0,z1],[-y1,z1],[-y1,z0]]).uni;if(u.length!==1)console.error('hinge: leaf and knuckle not one outline',u.length);U=u[0];}
    const g=solidGeo([{loop:area(U)>0?U:U.slice().reverse(),y0:-L/2,y1:L/2}]);g.rotateZ(-Math.PI/2);
    const Pa=g.attributes.position,Nm=g.attributes.normal,on=k=>Math.abs(Math.hypot(Pa.getY(k)-kc[0],Pa.getZ(k)-kc[1])-r)<1e-3;   /* float32 positions: 1e-5 off at 100 mm */
    for(let t=0;t<Pa.count;t+=3)if(Math.abs(Nm.getX(t))<0.5&&on(t)&&on(t+1)&&on(t+2))for(let k=t;k<t+3;k++){const dy=Pa.getY(k)-kc[0],dz=Pa.getZ(k)-kc[1];Nm.setXYZ(k,0,dy/r,dz/r);}
    Nm.needsUpdate=true;return mesh(par,g,mt,x,0,0);};
  /* the box's mahogany, drawn in code, as Wempe No. 6161's (Antiquorum 208-4, a brass bowl in brass gimbals as the drawings' Ms.): its colours sampled on that photograph,
     the lid's lit front a median #904527, its grain #773921 to #bb8166, the box's front in shade #491a10 to #8c4e34; quarter-sawn, so a ribbon figure of long light and dark
     bands, and fine pores; the texture's ground and bands about 0.7 of those, since the page's light renders a colour about 1.4 times the photograph's (the Case view's
     box front #a34d32 drawn with the sampled colours). The wartime boxes photographed (Greenwich's wartime Wempe, Lange 1947) are oak round a Bakelite bowl: the brass bowl drawn is 6161's.
     Birch (the outer box's, "gebleichte Birke": bleached birch): a pale ground and fine long grain */
  /* kirov: the 6MX's boxes, Kirov 247's (14_Kirow_247_Kasten_2.jpg, 13_Kirow_247_Kasten_1.jpg): an orange lacquered wood, sampled medians #dc6914 to #e07c3e (its
     10th-90th percentiles #c54807 to #e9821e), fine and even in grain; drawn as the mahogany is, its ground and bands about 0.7 of those (#9b4c16) */
  /* km: Wempe No. 3044's box (the Variants' black case; milivault_529241_wempe3044_screen.png, a photograph of a screen, so its colours washed out and only rough): a lighter,
     redder mahogany, the box's left rim's median #c2876f (10th-90th percentiles #7f5543 to #e4a88d), fine straight grain; its ground and bands about 0.7 of those, as the
     mahogany's, a little more saturated than the washed-out photograph (#87503a) */
  function woodTex(birch,kirov,km){const c=document.createElement('canvas');c.width=256;c.height=512;const x=/** @type {CanvasRenderingContext2D} */(c.getContext('2d'));x.fillStyle=birch?'#e4d5b7':kirov?'#9b4c16':km?'#87503a':'#66301a';x.fillRect(0,0,256,512);
    let s=birch?23:kirov?37:km?53:11;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
    const line=(xx,amp,ph,w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.beginPath();for(let y=0;y<=512;y+=16){const px=xx+Math.sin(y/120+ph)*amp;y?x.lineTo(px,y):x.moveTo(px,y);}x.stroke();};
    if(birch){for(let i=0;i<140;i++){const a=0.03+rnd()*0.08;line(rnd()*256,1.5+rnd()*6,rnd()*6,0.5+rnd()*1.2,rnd()<0.6?`rgba(150,120,80,${a})`:`rgba(235,200,150,${a})`);}}
    else if(kirov){for(let xx=-8;xx<264;){const w=6+rnd()*22,lt=rnd()<0.5;line(xx+w/2,1.5+rnd()*3,rnd()*6,w,lt?`rgba(170,92,36,${0.15+rnd()*0.2})`:`rgba(122,52,12,${0.12+rnd()*0.2})`);xx+=w;}
      for(let i=0;i<500;i++){x.fillStyle=`rgba(90,36,8,${0.15+rnd()*0.25})`;x.fillRect(rnd()*256,rnd()*512,0.7,1+rnd()*3);}}   /* fine flecks: a close, even grain */
    else if(km){for(let xx=-8;xx<264;){const w=5+rnd()*18,lt=rnd()<0.5;line(xx+w/2,1+rnd()*2,rnd()*6,w,lt?`rgba(160,104,80,${0.15+rnd()*0.2})`:`rgba(89,53,38,${0.15+rnd()*0.22})`);xx+=w;}   /* narrower bands toward the sampled 10th and 90th percentiles (×0.7) */
      for(let i=0;i<120;i++){const a=0.05+rnd()*0.12;line(rnd()*256,0.5+rnd()*2,rnd()*6,0.4+rnd()*1.0,rnd()<0.7?`rgba(70,34,22,${a})`:`rgba(175,120,96,${a})`);}
      for(let i=0;i<700;i++){x.fillStyle=`rgba(70,34,22,${0.2+rnd()*0.3})`;x.fillRect(rnd()*256,rnd()*512,0.7,2+rnd()*4);}}   /* fine straight grain and pores */
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
       brackets hold them 5.3 under the bowl's top (YP); the Soviet 6MX's (Kirov No. 247's) 1.7 over it, so its bowl hangs 7.0 lower in the gimbals (DY6, rev) */
    const prt=(par,name,y=0)=>{const g=new THREE.Group();g.userData.partName=name;g.position.y=y;par.add(g);return g;};
    /* the versions (movement.js's setRev; app.js shows each group whose rev lists the version): rv(par, 'last first 1943' or '6mx': the escapement of 1943 has the drawings' case) a group of the pieces only those versions have */
    const rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;};
    /* the case's own brass (bowl, bezel, gimbal ring and bracket, the transit lock's bracket), which the Variants' black case (setCase, below) lacquers black: Wempe
       No. 3044's (milivault_529241_wempe3044_screen.png, a Kriegsmarine chronometer: its bowl, bezel and gimbal ring black, the bezel's glass in a bright edge; the transit
       lock's bracket a black block, its knob and the pivots brass) */
    const CB=M.caseB=M.caseB||M.brass.clone();
    const BAK=M.bakelite=M.bakelite||new THREE.MeshStandardMaterial({color:sc(0x15130f),metalness:0,roughness:0.32});   /* Bakelite, black, moulded and polished (Wempe 3955's bowl and gimbal ring) */
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
    /* Since 24 October 2026 the drawn bowl's casting stands TC (4.7) higher on the movement: its rim round the movement ring's flange, flush with the flange's top, as the
       6MX's (below), the threaded rim the bezel screws onto (TH, above) turned from the top of the 12 high flange, a rebate in it to the seat at YB (Ø 106.06, the flange's
       105.95 −0.1 in it 0.05 clear), and a notch cut through it for the ring's radial pin. So the inside bottom lies 48.3 under the seat as cast (53 less 4.7), faced to 49:
       05 06_01's "49 von Werkring-auflage" (sure), the case 49 from the movement ring's seat, which the cork ring on the dust bush meets (frame.js). Until then the casting's
       top was the seat, the bezel lay over a plain flange, and the bottom 53 under the seat had a raised ring round the winding hole (estimated) to meet the cork. The rest of
       the casting as drawn, 65 overall from the rim's top; its closing plate and spring with it (CPY) */
    const YC=YB+TC,CPY=TC;
    {const F0=[{p:C(H[10],8.2/2,72),a:YB-59.5,b:YB-53},{p:C([0,0],1.52,40),a:YB-59.5,b:YB-53},{p:C([CSI[0]*Math.cos(CSI[1]),CSI[0]*Math.sin(CSI[1])],0.6,24),a:YB-59.5,b:YB-58}];
      /* the bottom and the winding hole's seat in the bowl's own stuff: brass as drawn, Wempe 3955's moulded Bakelite with the rest of it (its plate's Ø 8 shows the bottom dark
         through it: 16_Wempe_3955_Gehäusetopf_Kardan.jpg) */
      const G1=rv(bowl,'last first 1943 -3955'),G6=rv(bowl,'6mx'),G3=rv(bowl,'3955'),BW=/** @type {[any,any][]} */([[G1,CB],[G3,BAK]]);   /* each version's bowl in its own group, one mesh (fuse, below) */
      const yd=YC-59.5,F1=[{p:C(H[10],8.2/2,72),a:yd,b:YB-49},{p:C([0,0],1.52,40),a:yd,b:YB-49},{p:C([CSI[0]*Math.cos(CSI[1]),CSI[0]*Math.sin(CSI[1])],0.6,24),a:yd,b:yd+1.5}];
      /* the bottom drawn 0.01 inside the turned part's wall (r 34.09 against its 34.1): its 240 facets and the wall's 360 would cross, and a ray out from the axis would meet
         the wall's face before the bottom's at r 34.1 as often as not, so that bom.py's rays read the bottom's metal as ending at the axis (the closing plate's screw, 24 October 2026) */
      for(const[g,mt]of BW)tag(mesh(g,solidGeo([{loop:circ(34.09),y0:yd,y1:YB-49,F:F1}]),mt),'050100-1');
      tag(mesh(G6,solidGeo([{loop:circ(34.09),y0:YB-59.5,y1:YB-53,F:F0}]),M.brass),'050100-1');
      /* the winding hole's seat inside: a raised ring round the hole on the bottom, which the cork ring on the dust bush (05 08 01-4, frame.js) meets. Not on the casting's
         sheet (it draws no hole and nothing machined); the 6MX's bowls have it: moMvyx8eXfo 3:35 (1080p, the bowl empty) a flat-topped ring standing on the bottom round
         the hole (sure that it stands), 72 px across against the hole's 38.5, so Ø 15.3 by the hole's 8.2 (likely), the cork's 16.1 nearly; its top an ellipse 60 px by 72,
         so seen 34° from the axis, its near wall 8.5 ±1.5 px high at about 4.5 px/mm (the bottom's scale), 3.4 ±0.6 high (rough); DIxob2Rl4dc 5:09 (480p) a pale ring
         there, so perhaps a pressed bush. Without it the cork stands 3.84 short of the bottom; drawn to the cork's top, 3.84 high (estimated: inside the video's height),
         its bore the hole's 8.2. The 6MX's only since 24 October 2026: the drawn bowl's bottom, 49 under the seat, meets the cork itself (above) */
      {const ya=YB-53,yb=YB-53+3.84;tag(mesh(G6,new THREE.LatheGeometry([V2(4.1,ya),V2(7.65,ya),V2(7.65,yb),V2(4.1,yb),V2(4.1,ya)],72),M.brass,H[10][0],0,H[10][1]),'050100-1',1);}
      const fil=[...Array(13).keys()].map(i=>{const t=i/12*Math.PI/2;return[42+7*Math.sin(t),YB-42-7*Math.cos(t)];}).reverse();   /* the round r 7 about (42, YB − 42), from the bore's wall down to the floor */
      /* the casting from its rim's top YC: the flange Ø 118 to 12 under it, the band Ø 108 to 23.5, the body Ø 106 to the cone, 50.5, the foot 65; the flange's top 4.7 turned
         down to the thread (below), so the profile's top is the seat's level, YB, the flange's shoulder outside the thread 0.3 under the bezel */
      const pr=[[34.1,YC-65],[36.25,YC-65],[53,YC-50.5],[53,YC-23.5],[54,YC-23.5],[54,YC-12],[59,YC-12],[59,YB],[TH.Rm,YB],[TH.Rm,YB+0.8],[53.03,YB+0.8],[53.03,YB],[49,YB],...fil,[34.1,YB-49]];
      /* the threaded rim, from the seat's level to the flange's top: inside, the rebate's wall r 53.03; outside, the thread, run out into an undercut at its root 0.5 over the
         shoulder and a lead chamfer 0.5 to the top; the notch through it at 12 o'clock, 1.8 wide (the pin's Ø 1.6 0.1 clear each side), down to 0.8 over the seat (the pin's
         underside 1.1: the pin 2.8 under the flange's top, 05 08 00-3): the 6MX's, as 24020's photograph shows it cut (its depth not seen: estimated). The rim to the notch's
         floor turned with the casting, one solid with it (lathT, its thread the profile's edge k); above it, the rim less the notch (rim) */
      const ko=pr.findIndex(q=>q[0]===TH.Rm),tho=k=>({R:TH.Rm,d:TH.d,p:TH.p,yr:TH.yr,k,s0:YB,s1:YC});
      const rim=(g,mt,rp)=>tag(mesh(g,thread({R:TH.Rm,rp,d:TH.d,p:TH.p,yr:TH.yr,s0:YB,s1:YC,y0:YB+0.8,y1:YC,slot:0.9,a:-Math.PI/2}),mt),'050100-1',1);
      tag(mesh(G1,lathT(pr,tho(ko)),CB),'050100-1',1);rim(G1,CB,53.03);
      /* Wempe 3955's (the version as photographed: 16_Wempe_3955_Gehäusetopf_Kardan.jpg, photocompare.py) black Bakelite, as the wartime Glashütte and Wempe bowls were, the
         gimbal ring too; their pivot screws and knurled lock wheels brass (sure). Its profile (by eye: a narrower drum to the bottom, a rounded shoulder) not measured: the
         sheet's kept */
      tag(mesh(G3,lathT(pr,tho(ko)),BAK),'050100-1',1);rim(G3,BAK,53.03);
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
         (WN-202, frame.js: its end at r 54.75, 1.9 over the seat) down to YB + 0.8, through the thin wall under the bezel (estimated). The thread drawn since 24 October 2026 (TH). Estimated
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
        const sh=[[B6,hY(-7.76)],[56.6,hY(-7.76)],[56.6,hY(-5.55)],[TH.Rm,hY(-5.55)]];   /* under the thread to the collar at its root: the undercut */
        const ci=[[49,hY(-44.69)],[34.1,hY(-52.84)]];   /* the inner cone: the outer's line (52.4, −46.7)-(36.7, −55.3) moved 3.4 across it, cut by the bore and the recess's wall */
        const p6=[[34.1,YB-65],[36.7,YB-65],...cn,[B6,hY(-46.7)],...sh,[TH.Rm,YB+0.8],[53.05,YB+0.8],[53.05,YB],[49,YB],...ci,[34.1,YB-53]];
        const g6=G6;tag(mesh(g6,lathT(p6,tho(p6.findIndex(q=>q[0]===TH.Rm))),M.brass),'050100-1',1);
        rim(g6,M.brass,53.05);}   /* the rim, threaded (TH: until 24 October 2026 a plain ring r 55.25), its notch: the drawn bowl's */
      for(const g of[G1,G6,G3])fuse(g.children.filter(o=>o.isMesh&&o.userData.hn==='050100-1'));   /* the bowl one casting, one mesh in each version (fuse, core.js): its bottom, seat, body and rim's flush faces drew rings in Edges until 21 October 2026 */
        /* the electrical contact's parts in the bowl (Kirov No. 247: 11_Kirow247_E-Kontakt_2.jpg inside, 12_Kirow_247_E-Kontakt_3.jpg outside, a camera fitted on the
           bowl's band; Kirov 2973's the same; Romanov 1975, Fig. 95, 101 and p. 105's parts 63-66): two flat brass springs 66 inside, each a foot 5.5 high curved to the bore
           on a black insulating strip, held by two screws 65 through the wall, and three tines 6.5 wide rising from it and leaning in to bear on a block's outer end (spring A
           on block 52, +, 176-195°; B on block 57, −, 212-231°: train.js, WD.CONTACT6); outside, each spring's two slotted brass screws (heads Ø 5.6) and its terminal, a brass
           socket Ø 6.4 with a 3.0 hole standing 2 proud, each on a black fibre washer, all at y −27.5: A's at 178.4°, 189.3° and its + socket 200.6°, B's at 215.7°, 225.2° and
           − 235.9° (±1-3°, the case bracket's pivot taken as 180°): likely in kind and place; the springs' sizes estimated (±15 %). Bearings as frame.js's brg */
        {const gC=new THREE.Group();gC.userData.rev='6mx';gC.userData.contact=true;bowl.add(gC);const pol=(t,r,y)=>[-r*Math.sin(t*D2R),y,-r*Math.cos(t*D2R)],inw=t=>[Math.sin(t*D2R),0,Math.cos(t*D2R)];
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
       pivot's hole (the pivot 5.3 under the bowl's top, YP: the block's top 0.2 over it, beside the bezel's chamfer). Estimated (±1.5) */
    const brk=prt(bowl,'bowl'),ang=a=>a*D2R;
    /* each version's on its body: the drawn bowl's r 53, the 6MX's r 51.8 (above), the plates 3 thick on it, the blocks where drawn (Kirow 422's, 11_Kirow_DEC_422_Gehäuse.jpg,
       are these: plates with two slotted screws in slots, a block with the pivot's hole) */
    const BRV=/** @type {[string,number][]} */([['last first 1943',53]]).map(([V,rb])=>[rv(brk,V),rb,rb+3]);
    for(const[bv,rb,rp]of BRV)for(const ph of[90,-90]){const g=tag(new THREE.Group(),'050100-3');bv.add(g);const a=ang(ph),w=Math.asin(4.5/59.5),q=ang(22);
      const P1=sector(rb,rp,[a-q,a+q],[a-q,a-w,a+w,a+q]),P2=sector(rp,59.5,[a-w,a+w],[a-w,a+w]),P3=sector(59.5,66.5,[a-w,a+w],[a-w,a+w]);
      mesh(g,solidGeo([{loop:P1,y0:YB-33,y1:YB-24},{loop:P2,y0:YB-33,y1:YB-24},{loop:P3,y0:YB-33,y1:YP+5.5}]),M.brass);
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
    for(const[bv,rb,rp]of BRV){const g=tag(new THREE.Group(),'050100-4');bv.add(g);const a=ang(40),w=Math.asin(7.9/60),YQ=YP,YO=YB-11.5;   /* YQ: the pivots' height; YO: where 05 01's 1940 bowl put them on the body, which keeps the foot and its screw on the cast bowl's body (Ø 106), under its band (Ø 108, to YB − 23.5); the crank up to the upright, which the pivots place */
      const sp=()=>[a-w,a+w];mesh(g,solidGeo([{loop:sector(rb,rp,sp(),sp()),y0:YO-26.4,y1:YO-16.6},{loop:sector(rp,59.6,sp(),sp()),y0:YO-18,y1:YQ-7.4},{loop:sector(59.6,63.7,sp(),sp()),y0:YQ-8.2,y1:YQ+5.5},
        {loop:sector(63.7,67.5,sp(),sp()),y0:YQ+1.3,y1:YQ+5.5}]),M.brass);
      tag(screw(along(bv,[rp*Math.cos(a),YO-20.3,rp*Math.sin(a)],[-Math.cos(a),0,-Math.sin(a)]),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-78');}

    /* ================= the closing plate (Verschlußplatte 05 01 00-2, rev. a 14.4.48) ================= */
    /* Ms, 1:1, every figure (sure but the hole Ø 1.2 at 12.4 and the 2 −0.05/−0.1, likely): Ø 68 −0.2, 2.3 at its rim, the boss Ø 28 −0.2 on its outer face making it 5 thick;
       the hole Ø 5.5 +0.1 through the middle, counterbored Ø 7.5 +0.1 from outside to 2 under the inner face; a groove Ø 10 to Ø 26, 1.5 deep, in the inner face; M2.6 at 25,
       Ø 1.2 at 12.4 (drawn at 12.35, inside the groove's edge) on one line, Ø 8 +0.2 at 22.6 at 90° to it. The Ø 1.2 is drilled blind from the groove's floor: the section
       draws its drill point inside the boss, its tip a pixel or so (0.1-0.2) short of the boss's face (likely; drawn with a 118° point, its tip 0.15 short). Between the rim's
       underside and the boss a round, drawn and not figured: r 1.3 (scaled 1.3-1.5 at 3.45 px/mm; likely). Until 15 October 2026 the hole was drawn through and the corner
       sharp. Wempe 3955's plate (16_Wempe_3955_Gehäusetopf_Kardan.jpg) shows two small holes through the boss's face on the knob's line: built in its version (below). It lies in the bowl's foot, its inner face on the recess's floor and
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
      /* Wempe 3955's (the version as photographed: 16_Wempe_3955_Gehäusetopf_Kardan.jpg, its plate's ellipse 0.80 and Ø 68 scaling it at 6.65 px/mm, which puts the Ø 8 at
         23.7 from the centre, the knob at 25.3 and the boss at Ø 31: the sheet's plate): its face a matte neutral grey (saturation 0.03, value 0.49 against the background's
         0.82: blackened or lacquered, not the brass drawn), and two small holes through its boss on the knob's line, at 12.2 on the knob's side (the spring's Ø 1.2 at 12.4,
         drilled through, not blind) and Ø 1 at 10.6 opposite (likely) */
      const F3=F.map((f,i)=>i===1?[{p:C(q12,0.6,24),a:y0,b:y1-1.5},{p:C(P(10.6,tk+Math.PI),0.5,24),a:y0,b:y1-1.5}]:f);
      const CPG=new THREE.MeshStandardMaterial({color:sc(0x3a3b3e),metalness:0.3,roughness:0.7});
      for(const[V,mt,FF]of/** @type {[string,any,any][]} */([['last first 1943 -3955',M.brass,F],['3955',CPG,F3]])){const cpW=rv(cp,V);cpW.position.y=CPY;tag(mesh(cpW,smoothRev(solidGeo(cells(rs,ys,FF,s0))),mt),'050100-2');
        tag(screw(cpW,0,0,y0+3,3.6,2.5,7.5,1.5,M.steel),'WN-71');   /* its screw: head Ø 7.2 × 2.5 in the counterbore, M3 through the plate into the bottom (estimated) */
        const kq=P(25,tk);tag(screw(cpW,kq[0],kq[1],yr,2.6,2.4,2.2,1.3,M.brass),'WN-72');}   /* the knob: a brass head Ø 5.2 × 2.4 (Wempe 3955's), M2.6 (estimated) */
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
      const sp=tag(mesh(cp,spGeo(CPS,null),M.steel),'050100-7');sp.position.y=CPY;let last=CPS;
      cp.userData.turn=()=>{const r=cp.rotation.y;if(Math.abs(r-last)>1e-4){last=r;sp.geometry=spGeo(r,sp.geometry);}};
      /* its outer end's depth in the plate's blind hole: into the drawings' boss, to the top of the drill point in the 6MX's flat plate (YB − 61.3; its tip 0.15 over the plate's outer face);
         dy: the spring raised with the drawn bowl's plate (CPY) */
      cp.userData.spEnd=(y,dy)=>{sp.position.y=dy;if(y!==spEnd){spEnd=y;sp.geometry=spGeo(cp.rotation.y,sp.geometry);}};}

    /* ================= the bezel (Glasrand kompl. 05 01 01: the ring 05 01 01-2 and its glass 05 01 01-1) ================= */
    /* The ring finished, as Glasrand kompl. (05 01 01, 27.11.41, 1:1) draws it in section: machined from its casting, R-05 01 01-2 (6.3.42, Ms, Kokillenguß: Ø 125 for its
       top 8.2, a 30° chamfer to Ø 116, 16 high, bores Ø 92 and Ø 106 × 4.5, every figure sure), the "R-" a casting's sheet as the bowl's R-05 01 00-1. 05 01 01 has no figures:
       its section traced (the right end, hatched; tools/wempe_bezel_trace.py) at the sheet's 4.78 px/mm, the scan turned 0.67° (its top and bottom lines), the axis at x 470.5.
       Its height comes out 16.0 (y 269 to 192.5), the casting's, and every line lies inside the casting: the sight cone starts at the casting's Ø 92 (r 45.9 at the step) and
       opens to r 55.3 at the glass's seat, 12.3 up; the lower bore r 54.9, 5.0 deep to the step; outside, r 56.6 at the underside, out to r 58.1 at 6.1 and 58.9 at 6.9,
       the widest band r 60.6 from 7.5 to 9.8 (Ø 121: 05 01's elevation scales the bezel about 120), then a bevel in to the glass's edge at the top. Every reading ±0.2 (a
       pixel); likely. Its step bears on the dial's rim and holds the movement down: the dial, 1.3 thick (05 02 00-4's "Stärke 1,3"), lies in the
       movement ring's recess Ø 104 × 0.7 (05 08 00-3) in its flange 4.7 thick, so it stands 0.6 proud, its top YB + 5.3, and the step, 5.0 over the bezel's underside, puts
       that 0.3 over the bowl's top face; the cone's foot (r 45.9) just outside the dial's minute track (Ø 90). Until 21 October 2026 the step was relieved over the dial
       (estimated) and the bezel lay on the bowl's top face. The sheet marks a thread in the lower bore (its left end): since 24 October 2026 cut there (TH), its crests at the
       traced r 54.9, its roots r 55.306, from the underside to the step, run out 0.5 at each end (a lead-in, a relief under the step), screwed onto the bowl's rim (above),
       and the movement ring's radial pin (WN-202, its end at r 54.75) in the bowl's notch inside its crests; until then the bore plain r 55.25 (1.7 px over the reading) and
       nothing on the bowl for it to screw onto; the bezel has no notch for the pin (one was cut until 21 October 2026, estimated). The glass (05 01 01-1) in the seat at the top: Ø 110.5 × 3.7 (the sheet's band, y 192.5 to 210), flush with the ring's edge, its underside
       YB + 12.6, 15.6 over the pillar plate's dial face (05 02_1 asks 15.8, corrected in pencil to 17.0), 1.25 over the hands' highest point. The widest band knurled, 0.3
       deep, as Wempe 6161's and Wempe 5377's bezels show their widest band (antiquorum_208-4_wempe6161.jpg; bonhams_26816_327_wempe5377_type05.jpg): likely. Until 21 October
       2026 the ring was drawn as its casting (flat top, the glass Ø 112 × 2.3 flush in it) */
    const bz=prt(bowlS,'bezel',-YP),bW=rv(bz,'last first 1943');
    /* the bezel's glass, a little greener and less clear than the box's (M.glass, 0.12): a plain glass reads as nothing at 0.12, so the case view and a section showed the
       bezel open (21 October 2026). Its edge green, as Wempe 6161's (antiquorum_208-4_wempe6161.jpg: a green ring round the dial where the glass's edge shows) */
    const GLW=M.glassW=M.glassW||new THREE.MeshStandardMaterial({color:sc(0xd8efe4),metalness:0,roughness:0.02,transparent:true,opacity:0.3,depthWrite:false});
    {const b0=YB+0.3,top=b0+16,RG=55.25,cone=r=>b0+5.0+(r-45.9)*7.3/(RG-45.9),bev=r=>top-(r-RG)*6.2/(60.6-RG);
      /* its section as traced (above), turned, the skirt's bore (its edge 1, at the thread's root TH.Rf) threaded: the step's underside, the bore, the underside, the outside's three lines
         (to r 58.05 at 6.07, 58.9 at 6.9, toward 60.6 at 7.5), the widest band, the bevel to the glass's edge, the seat's wall, the sight cone (cells of rings until 24 October 2026) */
      const pz=[[46.0,b0+5.0],[TH.Rf,b0+5.0],[TH.Rf,b0],[56.6,b0],[58.05,b0+6.07],[58.9,b0+6.9],[60.2,b0+6.9+(60.2-58.9)*0.6/1.7],[60.2,bev(60.2)],[RG,top],[RG,cone(RG)],[46.0,cone(46.0)]];
      fuse([tag(mesh(bW,lathT(pz,{R:TH.Rf,d:TH.d,p:TH.p,yr:TH.yr,k:1,inside:true}),CB),'050101-2'),
      tag(mesh(bW,softKnurl(solidGeo([{loop:knurlPts(60.6,0.3,460),y0:b0+7.5,y1:b0+9.8,F:[{p:circT(60.2),a:b0+7.5,b:b0+9.8}]}]),60.3),CB),'050101-2',1)]);   /* the ring and its knurl one mesh (fuse). The knurl's bore on the ring's own 360 corners (lathT's, circT): polyGeo's coarser circle cut 0.04 into the ring, 36 mm³ of brass weighed twice until 24 October 2026 (overlaps.py) */
      const gl=tag(mesh(bW,solidGeo([{loop:circ(RG),y0:b0+12.3,y1:top}]),GLW),'050101-1');gl.userData.noShadow=1;gl.userData.inkBox=1;}   /* no Edges lines: a glass is drawn as a ghost, whose outline the line pass lays over everything, the box's wood in front of it too (the Hamilton's crystal and box glass are inkBox) */
    /* the 6MX's bezel ('6mx'), knurled and screwed onto the bowl's threaded rim (Kirow 422's: 11_Kirow_DEC_422_Gehäuse.jpg; Kirov 14917's off its bowl, its inside threaded:
       rAw2zmulpk8 0:29, 2:52), its glass thick and standing proud (12_Kirow_DEC_422_Kasten_1.jpg: a green edge over a narrow brass top). Traced on the bowl photograph as the
       bowl (rows by Y6, radii at 8.42 px/mm, the right edge less its 0.45 offset at the knurl): its lower edge r 56.1 at row 552, swelling (a bell) to the knurl's tips, r 58.3
       (Ø 116.6) by row 598; the knurl to row 640 (diamond on the photographs, drawn as 360 straight teeth 0.4 deep: the diamond's crossing isn't drawn); a plain lip, rounded
       into the top face at row 650 (YB + 13.5). Inside (not on any photograph: estimated): the glass in a seat 1.5 deep to r 53.6, the sight bore r 52.1 (the dial's edge 51.8
       under it), the shoulder at the rim's top (YB + 4.7) bearing on the ring's flange and the rim, which holds the movement down as the drawn bezel's recess does, the thread
       to its edge (TH; its bore r 55.3 plain until 24 October 2026). The glass: Ø 107 × 4.0, its top edge chamfered 0.8, its underside YB + 12.0, 0.65 over the hands' highest point (the minute hand's boss, 17.70 in
       the movement's frame), its top YB + 16.0, where the drawn bezel's top is (estimated: the photographs give no height) */
    {const b6=rv(bz,'6mx'),yj=Y6(552),yk0=Y6(598),yk1=Y6(640),top=Y6(650),gu=YB+12.0;
      const bell=[[56.1,552],[56.5,556],[56.73,560],[57.09,564],[57.32,568],[57.56,572],[57.68,576],[57.82,580],[57.9,588],[57.9,598]].map(([r,w])=>[r,Y6(w)]);
      const pr=[[TH.Rf,yj],...bell,[57.9,yk1],[58.0,yk1],[58.0,Y6(646)],[57.6,Y6(649)],[57.2,top],[53.6,top],[53.6,gu],[52.1,gu],[52.1,YB+4.7],[TH.Rf,YB+4.7]];
      /* its bore threaded (TH, the profile's last edge) from its edge to the shoulder on the rim's top (until 24 October 2026 plain, r 55.3) */
      const b6m=tag(mesh(b6,lathT(pr,{R:TH.Rf,d:TH.d,p:TH.p,yr:TH.yr,k:pr.length-1,inside:true}),M.brass),'050101-2');
      const NK=360,kn=[];for(let i=0;i<NK;i++){const t=i/NK*TAU,u=t+Math.PI/NK;kn.push([58.3*Math.cos(t),58.3*Math.sin(t)],[57.9*Math.cos(u),57.9*Math.sin(u)]);}
      fuse([b6m,tag(mesh(b6,softKnurl(solidGeo([{loop:kn,y0:yk0,y1:yk1,F:[{p:circT(57.9),a:yk0,b:yk1}]}]),57.9),M.brass),'050101-2',1)]);   /* one mesh (fuse): the knurl's bore on the lathe's own 360 corners at its r 57.9 (circT; it was 57.85, 0.05 into the lathe: 100 mm³ weighed twice until 24 October 2026, overlaps.py) */
      const gq=[[0,gu],[53.5,gu],[53.5,gu+3.2],[52.7,gu+4.0],[0,gu+4.0]],gg=new THREE.LatheGeometry([...gq,gq[0]].map(([r,y])=>V2(r,y)),N);
      const gl=tag(mesh(b6,gg,GLW),'050101-1');gl.userData.noShadow=1;gl.userData.inkBox=1;}   /* no Edges lines: a glass is drawn as a ghost, whose outline the line pass lays over everything, the box's wood in front of it too (the Hamilton's crystal and box glass are inkBox) */

    /* ================= the gimbal ring (Kardanring 05 01 00-5) and its bracket (Kardanringkloben 05 01 00-6) ================= */
    /* No sheets: scaled on 05 01 (2.45 px/mm by its 160 and the bowl's 106; circles fitted to Schnitt A-B: Ø 139.2 inside and 146.8 outside the lines, the elevation's section
       3.3 thick and 23.2 high): Ø 140 inside, 3.3 thick, 23.2 high, its top 11.5 over its pivots (05 01's "11,5") and 6.2 over the bowl's top (YP, above), its pivots at mid height (likely). The outer pivots a on the 3-9 line, the inner b on
       12-6, in one plane, so the bowl swings about one point. At the 3 o'clock pivot a bracket on the ring's outside, its two screws in slots ("Kloben verstellen": moved to level the
       bowl), 57 long, 16.7 high, 3.3 thick, the pivot through it (Schnitt A-B, the elevation's outside half: estimated); its screws 35.5 apart (Wempe 3955's ring,
       16_Wempe_3955_Gehäusetopf_Kardan.jpg: 35.5 ±0.8, slotted; 37.2 until 18 October 2026, estimated). The inner pivots: screws through the ring (12: WN-79) with
       lock nuts (10: WN-400), their points in the case brackets' holes ("Lagerstellen a u. b leicht spielend"): M4 (scaled), heads Ø 7 (estimated). Brass, as the bowl (no material
       given; Wempe 3955's is Bakelite). The screws brass and each lock nut a knurled brass disc Ø 19 × 2.5 inside the ring, against its inner face, between it and the case bracket
       (Wempe 3955's bowl, 16_Wempe_3955_Gehäusetopf_Kardan.jpg: the disc beside the bracket about Ø 19 at 6.0 px/mm by the closing plate's recess Ø 68.2, its knurl's teeth
       about 0.5 apart, the screw's end outside the ring brass; Lange 1947's at 12 and 6 the same: likely). Until 16 October 2026 a hex steel nut outside the ring, under the screw's head 3.2 off the ring */
    const rgP=prt(ringG,'gimbalRing',-YP);
    {const rgG=smoothRev(solidGeo(cells([70,73.3],[[0,0],[YP+11.5-23.2,YP+11.5]]).slice(1))),q=28.5/73.3,ss=Math.asin(35.5/2/76.6),brG=solidGeo([{loop:sector(73.3,76.6,[-q,q],[-q,q]),y0:YP-8.35,y1:YP+8.35}]);
      for(const[V,mt]of[['last first 1943 -3955',CB],['6mx',M.brass],['3955',BAK]]){const g=rv(rgP,V);tag(mesh(g,rgG,mt),'050100-5');tag(mesh(g,brG,mt),'050100-6');}   /* Wempe 3955's black (above) */
      for(const s of[-1,1])tag(screw(along(rgP,[76.6*Math.cos(s*ss),YP,76.6*Math.sin(s*ss)],[-Math.cos(s*ss),0,-Math.sin(s*ss)]),0,0,0,2.4,1.6,6,1.25,M.steel),'WN-kr');
      for(const s of[-1,1]){const g=along(rgP,[0,YP,s*73.3],[0,0,-s]);tag(screw(g,0,0,0,3.5,2.8,9.8,2,M.brass),'WN-79');   /* its head on the ring's outside, its point where it was in the bracket's hole */
        tag(mesh(g,knurl(9.5,0.35,2.5,120,2),M.brass,0,3.95,0),'WN-400');   /* its face at r 69.35, where its rim meets the ring's curved inside (70 less the curve's 0.65 over its 9.5) */}}

    /* ================= the wooden box (Holzkasten, 127-556.02) ================= */
    /* "Holzgehäuse 185 × 185 × 180 mm außen" (05 01, sure); its walls 12.5 (51 00 10's section, sure; 05 01 draws the walls 12.6 and their inside 160, its "160 Ø"); the line
       across 51 00 10's side 105 over the bottom taken as the lid's parting line (it lies at the ring's top, 11.5 over the pivot's M6: likely). Its other boards, joints and the lid's
       glazed top aren't on a sheet in the set: drawn as Greenwich's wartime Wempe (rmg_L5393_wempe_wartime_001.jpg) and Lange 1947 (drouot_33810142_*) show them, the floor
       12.5, the lid's top a frame 20 wide round a glass 3 thick, the piano hinge and the lid's stay (below): estimated. Mahogany, as Wempe No. 6161's (woodTex) */
    const bx=prt(root,'box');const bxW=rv(bx,'last first 1943');   /* the drawings' box; the 6MX's (Kirov 247's) below */
    {const B=tag(new THREE.Group(),'Holzkasten');bxW.add(B);const hh=YL-YF-WT;
      box(B,2*BW,WT,2*BW,0,YF+WT/2,0,MC.mah);for(const s of[-1,1]){if(s>0)box(B,2*BW,hh,WT,0,YF+WT+hh/2,s*(BW-WT/2),MC.mah);box(B,WT,hh,2*BW-2*WT,s*(BW-WT/2),YF+WT+hh/2,0,MC.mah);}
      /* the back wall, its top let in 0.6 for the hinge's leaf over the hinge's length (below) */
      for(const s of[-1,1])box(B,BW-HGL/2,hh,WT,s*(BW+HGL/2)/2,YF+WT+hh/2,-(BW-WT/2),MC.mah);box(B,HGL,hh-HGT,WT,0,YF+WT+(hh-HGT)/2,-(BW-WT/2),MC.mah);
      /* the outer pivots a (11: WN-80): M6 through the side walls (51 00 10: "Verbohren 4,8 mm Gew. M 6", 93.5 over the bottom), their ends the pivots in the ring's holes;
         heads Ø 12.5 (51 00 10's front view, 29 px at 2.31-2.36 px/mm; 05 01's elevation 12.7; the handle's sheet puts its top, 84 over the bottom, 3.5 under the screw's: Ø 12 at 93.5: likely; Ø 9 until 18 October 2026) × 3.8 (its side view, 2.36 px/mm; 4.1-7.2
         scaled with the slot: rough) and a brass bearing disc Ø 23 × 2.4 on each wall's inside (05 01's elevation, scaled): estimated; its
         edge knurled, as Wempe 6161's and Lange 1947's show it (antiquorum_208-4_wempe6161.jpg at 9 and 3 o'clock, drouot_33810142_lange1947_2.jpg: likely) */
      for(const s of[-1,1]){tag(screw(along(bxW,[s*BW,YP,0],[-s,0,0]),0,0,0,6.25,3.8,22.5,3,M.steel),'WN-80');
        const dg=knurl(11.5,0.35,2.4,140,3);dg.translate(0,-1.2,0);const d=tag(mesh(bxW,dg,M.brass,s*(BW-WT-1.2),YP,0),'Lagerscheibe');d.rotation.z=Math.PI/2;}
      /* the handles (Griff f. Chronometerkasten, Änderung von 51 00 10, 14.7.42, 1:1): a strip 100 long and 18 high, its ends 10 long flat on the side with a screw each, between
         them standing 10 off it, the grip pressed out to an oval 70 × 30, 6 deep; its middle 75 over the box's bottom, its top 3.5 under the pivot's screw (sure). The strip 3 thick (likely); the screws estimated */
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'510010');g.position.set(s*BW,YF+75,0);g.rotation.y=s>0?0:Math.PI;bxW.add(g);
        const st=polyGeo([[0,-50],[3,-50],[3,-41],[10,-36],[10,36],[3,41],[3,50],[0,50],[0,40],[7,35],[7,-35],[0,-40]],18);st.translate(0,-9,0);const sm=mesh(g,st,MC.alu);   /* the strip seen from below: [off the side, along it] */
        const ov=stadiumPts([-12,-20],[-12,20],30),cut=[];for(let i=0;i<ov.length;i++){const a=ov[i],b=ov[(i+1)%ov.length];if(a[0]<=-9)cut.push(a);if((a[0]<=-9)!==(b[0]<=-9)){const t=(-9-a[0])/(b[0]-a[0]);cut.push([-9,a[1]+t*(b[1]-a[1])]);}}
        const o=new THREE.Shape(cut.map(([y,z])=>V2(z,y)));const og=extrude(o,{depth:3,bevelEnabled:false,curveSegments:24});og.rotateY(Math.PI/2);fuse([sm,mesh(g,og,MC.alu,7,0,0)]);   /* the strip and its grip one pressing, one mesh (fuse): their walls ran flush, lines in Edges until 21 October 2026 */   /* the grip: the oval 70 × 30, hanging 12 below the strip's middle (its dashed outline on the sheet's front view, scaled at 2.36 px/mm); drawn below the strip only (y −9 down), so the two don't share their faces 7 and 10 off the side, which flickered where they overlapped (until 16 October 2026) */
        for(const z of[-45,45])tag(screw(along(g,[3,0,z],[-1,0,0]),0,0,0,2.5,1.6,11,1.2,M.steel),'WN-hg');}
      /* the hinge: one piano hinge across the back (no sheet: every photographed box has it; Lange 1947 from above, drouot_33810142_lange1947_2.jpg, 4.48 px/mm by the box's
         185: 148 long, 664 px, its leaves let into the box's and the lid's parting faces, the box's showing 6.7 over the wall, five screws about 33 apart; Wempe 6161's, Wempe
         5377's and Greenwich's wartime Wempe's the same, brass or black): likely. Its leaves 0.6 thick, 6.5 wide over the walls from the knuckle's tangent at the back's face, the knuckle Ø 5 on the axis
         2.5 behind the back, in seven lengths, the box's four and the lid's three (estimated). Until 16 October 2026 two hinges 40 long on the back's face (the README then said the
         photographs show two) */
      {const g=tag(new THREE.Group(),'Scharnier');bxW.add(g);box(g,HGL,HGT,6.5,0,YL-HGT/2,-BW+3.25,M.brass);
        for(let i=0;i<7;i+=2){const k=mesh(g,cylY(2.5,HGL/7,20),M.brass,-HGL/2+HGL/7*(i+0.5),YL,-BW-2.5);k.rotation.z=Math.PI/2;}fuse(g.children.slice());}   /* the box's half, its leaf and knuckles one mesh (fuse) */
      /* the key's holder (no sheet: the box's own, 127-556.02, isn't in the set): a triangular shelf across the back right corner, the key standing in a hole through it, its
         body's cone seated on the hole's edge and its paddle up, as every photographed box keeps it: Greenwich's wartime Wempe (rmg_L5393_wempe_wartime_001.jpg: the black
         1943 key, its paddle's top 18 px over the back rim's line behind it, the key 21 in front of the back wall, the camera looking down about 35° (the box's 210 deep spans
         305 px at about 2.5 px/mm): the paddle's top 24 ±6 over the box's top, 20 ±8 read apart (16 October 2026; until then read as level with it); the 6MX's shelf 15-30 under
         the rim with its paddle above, moMvyx8eXfo 3:06, Kirova 422), Wempe 5377 (later case, its paddle under the rim) (bonhams_26816_327: the shelf and the key in it), Lange VEB 2285 (drouot_33246921_*_3, from above:
         the shelf's front edge, the key near it), Lange 5510 and the 6MX Kirova 422 (12_Kirow_DEC_422_Kasten_1.jpg). The box's plan (127-556. A-1, 51-00_1, 1:2; scaled 1.24-1.25 px/mm by the box's 185 and the gimbal ring's Ø 146.6) draws it: a triangle in the corner, its legs 22.3
         along the two lines it is drawn against (2-4 mm inside the box's inner faces as the box's centre places them: taken as the walls), and on its long edge a round
         fitting, the circle fitted on its rim (8 points, 0.4 px rms): Ø 19.5 (±1), its centre 10.35 from each of those lines (13.4-14.5 from the inner faces by the box's centre)
         and 1.1 inside the long edge, with two screws' heads on the box's diagonal 11.9 apart, one 6.4 inside the edge and one 5.2 outside it. Lange VEB 2285's box
         (drouot_33246921_langeVEB2285_3, from above) shows the same: a wooden shelf in the corner and the key's black body in a round black cup standing over its front edge.
         Built so: the key's axis 14 from each wall (±1; 13.5 would leave the 1943 key's paddle, 3 thick, 0.24 from the walls at its widest); the shelf's front edge a concave arc about the box's centre, following the gimbal ring as Wempe 6161's
         (antiquorum_208-4_wempe6161.jpg) and Wempe 3044's (milivault_529241_wempe3044_screen.png) do, r 82.5 so the cup stands wholly on the wood, 1 inside it (its legs 59.8 along the walls;
         3044's scale about 45-50 against its box's inner width, ±15 %, its fitting smaller: the arc's radius and its centre estimated), the key's tube through a hole r 6 in it, 10
         thick, its top 5 under the cup's (until 24 October 2026 a straight edge 1.1 beyond the key, as the drawing's triangle, which left the cup half over nothing and the key's tube in an open notch); the cup Ø 19.5, 5 high (Lange 2285's, scaled on its Ø: estimated), brass (the drawing gives no material: Wempe 6161's key stands in a
         brass ring at its cone's foot, antiquorum_208-4_wempe6161.jpg, and Wempe 3044's corner shows nothing black, milivault_529241_wempe3044_screen.png, its brass key's
         body top and paddle over the shelf; black, as Lange 2285's, until 24 October 2026), bored
         Ø 11 for the key's cone, which seats on its top edge 65 over the floor (the key's paddle 20.7 over the box's top, as before); its two screws 14 apart, heads Ø 2.2 on Ø 1.2 shanks
         (the dots read 11.9 apart and about Ø 2.4, ±1 each: so near the centre, heads that size would lie over the key's Ø 11 bore, so they are built as far out as the
         reading allows), both into the shelf. The paddle (Ø 34.5 × 3, its top
         20.7 over the rim, facing the box's middle) clears the walls (and the closed lid's, flush with them) by 0.74 at its widest, the 1940 key's pear by 0.57 (measured on the page). Until 18 October
         2026 a shelf with legs 55 and the key in a hole 16.5 from each wall (estimated). The paddle faces the box's middle, its plane 94.8 from the gimbals' centre and its
         body's near side 87.6, beyond the case's and ring's reach (79.4: massprops.py); the shelf's front edge lies beyond the ring's and the case's (82.5 from the centre against the ring's 73.3 and the case's reach 79.4) */
      {const c=[BW-WT,-(BW-WT)],d=[-Math.SQRT1_2,Math.SQRT1_2],RS=Math.hypot(KX,KZ)-9.75-1,L=c[0]-Math.sqrt(RS*RS-c[0]*c[0]);   /* the front edge an arc about the box's centre, following the ring (Wempe 6161, 3044), r 82.5: the cup 1 inside it */
        const sIn=[KX-7*d[0],KZ-7*d[1]],sOut=[KX+7*d[0],KZ+7*d[1]],a0=Math.atan2(c[1],c[0]-L),a1=Math.atan2(c[1]+L,c[0]),arc=[];
        for(let i=0;i<=32;i++){const t=a0+(a1-a0)*i/32;arc.push([RS*Math.cos(t),RS*Math.sin(t)]);}
        tag(mesh(bxW,polyGeo([c,...arc],10,[[KX,KZ,6],[sIn[0],sIn[1],0.6],[sOut[0],sOut[1],0.6]]),MC.mah,0,KH-15,0),'Schluesselhalter');
        const cup=[];for(let i=0;i<96;i++){const a=i/96*TAU;cup.push([KX+9.75*Math.cos(a),KZ+9.75*Math.sin(a)]);}
        tag(mesh(bxW,polyGeo(cup,5,[[KX,KZ,5.5],[sIn[0],sIn[1],0.6],[sOut[0],sOut[1],0.6]]),M.brass,0,KH-5,0),'Schluesselhalter.F');
        const rg=new THREE.Group();rg.rotation.x=Math.PI;bxW.add(rg);
        tag(screw(rg,sIn[0],-sIn[1],-KH,1.1,1.0,10,0.6,M.steel),'WN-kh');tag(screw(rg,sOut[0],-sOut[1],-KH,1.1,1.0,10,0.6,M.steel),'WN-kh');}}
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
    const lidG=new THREE.Group();lidG.position.set(0,YL,-BW-2.5);root.add(lidG);const ld=prt(lidG,'lid');ld.position.z=2.5;const ldW=rv(ld,'last first 1943');   /* turning about the hinges' knuckles, 2.5 behind the back */
    {const B=tag(new THREE.Group(),'Holzkasten.D');ldW.add(B);const h=YT-YL-WT,o=BW;
      for(const s of[-1,1]){if(s>0)box(B,2*BW,h,WT,0,h/2,o+s*(BW-WT/2),MC.mah);box(B,WT,h,2*BW-2*WT,s*(BW-WT/2),h/2,o,MC.mah);
        box(B,2*BW,WT,20,0,h+WT/2,o+s*(BW-10),MC.mah);box(B,20,WT,2*BW-40,s*(BW-10),h+WT/2,o,MC.mah);}
      const g=tag(box(ldW,151,3,151,0,h-1.5,o,M.glass),'Deckelglas');g.userData.noShadow=g.userData.inkBox=1;   /* no Edges lines, as the bezel's glass */
      for(const s of[-1,1])box(B,BW-HGL/2,h,WT,s*(BW+HGL/2)/2,h/2,WT/2,MC.mah);box(B,HGL,h-HGT,WT,0,HGT+(h-HGT)/2,WT/2,MC.mah);   /* the lid's back wall, let in for the hinge's leaf */
      {const q=tag(new THREE.Group(),'Scharnier',1);ldW.add(q);box(q,HGL,HGT,6.5,0,HGT/2,3.25,M.brass);
        for(let i=1;i<7;i+=2){const k=mesh(q,cylY(2.5,HGL/7,20),M.brass,-HGL/2+HGL/7*(i+0.5),0,-2.5);k.rotation.z=Math.PI/2;}fuse(q.children.slice());}   /* the lid's half, one mesh (fuse) */
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
    {const g=tag(new THREE.Group(),'Schliessblech');bxW.add(g);box(g,18,10,1.5,0,YL-26,BW+5.15,M.steel);for(const s of[-1,1])box(g,3,10,4.4,s*7,YL-26,BW+2.2,M.steel);fuse(g.children.slice());}   /* one bent strap, one mesh (fuse) */

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
    const strips=(par,y,c,h=12)=>{const o=[];for(const sx of[-1,1])for(const sz of[-1,1])o.push(fuse([box(par,27,h,1,sx*(B6-12.5),y,c+sz*(B6+0.5),M.brass),box(par,1,h,26,sx*(B6+0.5),y,c+sz*(B6-13),M.brass)]));return o;};   /* each corner's angle one piece, one mesh (fuse, core.js): a line down its corner in Edges until 21 October 2026 */
    {const g6=rv(bx,'6mx'),Bk=tag(new THREE.Group(),'Kasten6');g6.add(Bk);rv(root,'6mx').add(lid6G);const hb=P2-YF-W6;
      box(Bk,2*B6,W6,2*B6,0,YF+W6/2,0,MC.kir);
      for(const s of[-1,1]){box(Bk,2*B6,hb,W6,0,YF+W6+hb/2,s*(B6-W6/2),MC.kir);box(Bk,W6,hb,2*B6-2*W6,s*(B6-W6/2),YF+W6+hb/2,0,MC.kir);}
      for(const s of[-1,1]){tag(screw(along(g6,[s*B6,YP,0],[-s,0,0]),0,0,0,4.5,3.8,25,3,M.steel),'WN-80');
        const d=tag(mesh(g6,new THREE.CylinderGeometry(11.5,11.5,2.4,48),M.brass,s*(B6-W6-1.2),YP,0),'Lagerscheibe');d.rotation.z=Math.PI/2;}
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Griff6');g6.add(g);const yh=P2-12;box(g,1.5,10,34,s*(B6+0.75),yh,0,M.brass);box(g,6,8,10,s*(B6+4.5),yh,0,M.brass);
        const r=mesh(g,new THREE.TorusGeometry(17,3,12,48),M.brass,s*(B6+6),yh-17,0);r.rotation.y=Math.PI/2;}
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Scharnier6');g6.add(g);hinge(g,40,s*55,[P2,-B6-2.5],[[P2-12,P2,-B6-1.2,-B6]],M.brass);}   /* leaf and knuckle one solid (hinge) */
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
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Scharnier6',1);ld6.add(q);box(q,40,12,1.2,s*55,6,-0.6,M.brass);
        hinge(q,30,s*55,[68,-2.5],[[57,67,-1.2,0],[69,79,-1.2,0]],M.brass);}   /* the upper hinge's leaves on its one knuckle, one solid (hinge) */
      const g=tag(new THREE.Group(),'Beschlag6',1);ld6.add(g);strips(g,43,o);const tc=strips(g,87,o);let ci=0;for(const sx of[-1,1])for(const sz of[-1,1])fuse([tc[ci++],box(g,26,1,26,sx*(B6-13),93.5,o+sz*(B6-13),M.brass)]);   /* the top's caps with their angles, one mesh each */
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
    const over=prt(root,'overBox');const overW=rv(over,'last first 1943');   /* the drawings' outer box; the 6MX's below */
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
      for(const s of[-1,1]){const g=tag(new THREE.Group(),'Scharnier.U');overW.add(g);hinge(g,32,s*84,[OT,-OZ-2.5],[[OT-12,OT,-OZ-1,-OZ]],M.brass);}
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
      for(const s of[-1,1]){const q=tag(new THREE.Group(),'Scharnier.U');g.add(q);hinge(q,32,s*70,[OT6,-OX6-2.5],[[OT6-12,OT6,-OX6-1,-OX6]],M.brass);}}
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
    for(const[V,Wx]of/** @type {[string,number][]} */([['last first 1943',80],['6mx',85]])){const c=[65.1,62.9],e=[39,73],ly=YL+0.5,lt=ly+2.5;const g=tag(new THREE.Group(),'050101.F');rv(lk,V).add(g);const LB=V==='6mx'?M.steel:M.brass,LK=V==='6mx'?MC.knob:M.brass;   /* ly, lt: the lever's underside and top; Wx: the right wall's inside (the 6MX's box 5 wider each side, its lock at the same height over the ring: estimated) */
      /* the bracket (no sheet): a milled angle, as the owner's case design has it ("Ms angle in the front-right corner", 2 wood screws 3 × 15 DIN 96: CAD Model Case.md, §10),
         brass as Wempe 6161's (antiquorum_208-4_wempe6161.jpg: a brass seat under the lever, its end round about the hub), black as Wempe 3044's with the black case: the wall
         leg 3 thick and 12 wide against the right wall, from the seat's top 22 down, its lower corners rounded r 3, two round-headed wood screws (DIN 96, 3 × 15: head Ø 5.6,
         2.1 high) 7 and 16 under the seat's top; the seat 4 thick under the lever, from the wall to the pivot, its end round about it (r 6, the same 12 wide), bored Ø 4.1
         for the lever's arbor. Its sizes estimated, fitted to the drawn lever and pivot (the seat's top the lever's underside) */
      {const LS=V==='6mx'?M.steel:CB,W0=56.9,W1=68.9,yt=ly,yb=ly-22,rc=3,arc=(cx,cy,a0,a1)=>[...Array(9).keys()].map(k=>{const t=a0+(a1-a0)*k/8;return[cx+rc*Math.cos(t),cy+rc*Math.sin(t)];});
        const wl=[[W0,yt],...arc(W0+rc,yb+rc,Math.PI,1.5*Math.PI),...arc(W1-rc,yb+rc,1.5*Math.PI,2*Math.PI),[W1,yt]];   /* [z, y] round the wall leg */
        const wg=polyGeo(wl.map(([u,v])=>[-v,u]),3);wg.rotateZ(-Math.PI/2);wg.translate(Wx-3,0,0);mesh(g,wg,LS);   /* plan [−y, z] extruded 3 along +y, turned so the extrusion runs along +x */
        const sp=[[Wx-3,W0],[Wx-3,W1],...[...Array(17).keys()].map(k=>{const t=Math.PI/2+Math.PI*k/16;return[c[0]+6*Math.cos(t),c[1]+6*Math.sin(t)];})];
        const sg=polyGeo(sp,4,[[c[0],c[1],2.05]]);sg.translate(0,ly-4,0);mesh(g,sg,LS);
        for(const yy of[yt-7,yt-16])tag(screw(along(g,[Wx-3,yy,(W0+W1)/2],[1,0,0]),0,0,0,2.8,2.1,15,1.5,M.steel),'DIN96');}
      cylBetween(g,2,ly-4,lt+0.5,M.steel,c[0],c[1],20);cylBetween(g,4.9,lt-0.5,lt+11,LB,c[0],c[1],32);   /* the lever's arbor through the seat, and the hub (Ø 9.8) to the knob */
      const lv=polyGeo(stadiumPts(c,e,8),2.5);lv.translate(0,ly,0);mesh(g,lv,LB);const pp=[c[0]+(e[0]-c[0])*0.55,c[1]+(e[1]-c[1])*0.55];cylBetween(g,2,ly+0.5,V==='6mx'?lt+16.7:lt+15.5,LB,pp[0],pp[1],16);   /* under a head, its end inside it */
      /* the pin's round head (the drawings' case): Wempe No. 3044's (milivault_529241_wempe3044_screen.png, from above, 4.8 px/mm by the knob's Ø 19.6) Ø 8.7 ±1, brass, slotted,
         its shank about Ø 4 under it; Greenwich's wartime Wempe's round too (5377's plain: the 6MX's kept so). Its height not seen: 2.5 thick, its top the pin's (estimated) */
      if(V!=='6mx'){const hd=new THREE.LatheGeometry([V2(0,0),V2(4.35,0),V2(4.35,2.0),V2(3.85,2.5),V2(0,2.5)],40);mesh(g,hd,LB,pp[0],lt+14.2,pp[1]);}   /* its slot not drawn */
      /* the knob knurled round its side (Greenwich's wartime Wempe, black; Wempe 6161 and 5377, brass: every photographed one): the band 0.5 to 4.0, 0.35 deep (estimated).
         Brass with its hub, lever and pin on the drawings' brass case, as on Wempe No. 6161's (antiquorum_208-4_wempe6161.jpg: the knurled knob, the hub and the lever brass; one
         photograph: likely; the knob black and the rest steel until 18 October 2026); the 6MX's black on steel (Wempe 5377's and 4585's black) */
      mesh(g,new THREE.LatheGeometry([V2(0,0),V2(9.3,0),V2(9.45,0.5),V2(0,0.5)],40),LK,c[0],lt+10.8,c[1]);mesh(g,knurl(9.8,0.35,3.5,90),LK,c[0],lt+11.3,c[1]);
      mesh(g,new THREE.LatheGeometry([V2(0,4.0),V2(9.45,4.0),V2(9.3,4.5),V2(0,4.5)],40),LK,c[0],lt+10.8,c[1]);}

    /* ================= the winding key (Chronometerschlüssel 51 00 11, 16.7.43: one way) ================= */
    /* "Linksaufzug b. Rechtsdrehung entspannt sich die Feder": a coil spring round the tube grips it as the key winds and slips the other way, so the key can't be forced
       backward (the Hamilton's key isn't one-way). Its parts, 2:1: the handle (51 00 11-1), a flat round paddle Ø 34.5 (scaled, 6.94 px/mm), 3 thick in the body's slot (3 H11),
       its centre 10.6 over the body; the body (Schlüsselmittelteil 05 01 02-2, St. Az DIN 668, sand-blasted, phosphated, sprayed black, every figure: Ø 14.5 −0.2 with a 1.5 × 45°
       chamfer at the top, the 15° cone from 15.1 down, 25.1 −0.2 long; the bore Ø 8 +0.1 22 deep with its 120° point, Ø 6 +0.1 through the bottom; the cross hole Ø 2.5 for the
       grooved pin (51 00 11-6, K.S. 1); the slot 3 wide; the hole Ø 0.9 at 5° for the spring's end); the tube (Schlüsselrohr 05 01 02-3, Ms 58, every figure: its head Ø 8 −0.05 ×
       2.6 in the bore, Ø 5.95 −0.05 through the bottom, 50.1 −0.2 long, the square 3.1 +0.05, 19 +2 deep, drilled 23 deep, a 60° sink 1 deep, the end relieved over 2.5); the coil
       spring (Wendelfeder 51 00 11-4) round the tube between its head and the bore's floor. The paddle's centre 9.37 over the body's top: the slot's floor is the Ø 35 arc, 6.3
       +0.1 under the top where it meets the body's outside (05 01 02-2's side view, sure: the extension line leaves the arc at the outer wall), so 7.40 under it at the bore's edge
       (centre 9.63 over the top), and the Ø 34.5 paddle rests on it there (17.25 sinks 16.77 at r 4.05: 9.37; 51 00 11's outside view scales 9.37 from the top face, its dashed
       rim 7.9 under it; until 17 October 2026 10.95, the 6.3 taken at the axis). The grooved pin across the slot, through the paddle's thickness (05 01 02-2: the cross hole runs
       across the 3 slot in the section and shows end-on in the side view, as the hole through the paddle's face does on 51 00 11's outside view; The Mariner's Chronometer,
       Fig. 2.35, a 1943 key taken apart, its handle with the hole in the face the slot covered), 4 −0.05 under the top (both views of 51 00 11 scale its centre 3.9-4.1), Ø 2.5
       and 15.3 long, its rounded ends 0.4 proud of the body (51 00 11's section: 15.8 against the body's 14.95 there). The square 3.1 +0.05 across, 19 deep, its corners on the
       key's x and z as the fusee arbor's square has them (its 60° sink 1 deep left out). The tube's head 8.0 under the body's top, just under the paddle's rim (51 00 11's
       section, ±0.15; 6.8 until 17 October 2026), so its free length 33.0 (the sheet draws the tube 48.1 against its own 50.1, so scales 30-31). The spring as 51 00 11's
       section draws it: about 12 open coils (pitch 0.95, from the coils' profile both sides) of wire about 0.6 (the coils 0.6-0.7 across between the tube and the bore's wall)
       wound on the tube, from its head down to the bore's floor, where the end turns down (drawn solid on the right) into the body's Ø 0.9 hole and runs along it to the bottom
       face (the end view's small square, 3.6 out); the hole's angular place is free (05 01 02-2: "Lochstellung beliebig"), the end drawn at +z. Followed up from its end its coils turn +x to +z,
       clockwise seen from the paddle (counterclockwise is winding, "Linksaufzug"; the body drags the end that way, adding turns, which closes the coils on the tube; turned back they open:
       inferred). Scaled, not figured: the wire, the pitch, the head's depth; estimated: the end's relief to Ø 4.6. The body cut as its sheet draws it (below), the pin through its cross hole
       and the paddle's, the spring's end down its Ø 0.9 hole. Built in the key's own frame (its axis +y, the tube's mouth at 0) in its part's group, which stands in its
       holder in the box or, while it winds, sits on the fusee's square (keyAt) */
    /* at rest the key stands in its holder (above), its axis up, its tube's mouth under the shelf where its body's cone is Ø 11, the hole's: 36.47 over the mouth (the cone
       Ø 9.14 to 14.5 over 10, from 33.0); as first drawn the 1940 key's cone (Ø 10.32 to 17.9 over 19.3, from 31.7) at 33.43. The paddle (and the 1940 handle) faces the box's
       middle (turned −45° about the axis); until 15 October 2026 it lay on the box's floor in the back left corner, where no photograph has it */
    const key=prt(root,'key'),KEYREST=()=>{const f=!!key.userData.first;key.position.set(KX,KH-(f?33.43:36.47),KZ);key.rotation.set(0,-45*D2R,0);};KEYREST();
    {const g=new THREE.Group();g.userData.rev='last 6mx 1943';key.add(g);
      const lathe=(pr,n=40)=>{let q=[...pr,pr[0]];if(area(q)<0)q=q.slice().reverse();return new THREE.LatheGeometry(q.map(([r,y])=>V2(r,y)),n);};
      const T=50.1,B0=T+8-25.1,BT=B0+25.1,sq=3.15/Math.SQRT2;
      tag(mesh(g,smoothRev(solidGeo(cells([2.3,2.975],[[0,19],[p=>(rr(p)-2.3)*2.5/0.675,19]],[[{p:[[sq,0],[0,sq],[-sq,0],[0,-sq]],a:0,b:19}]]))),M.brass),'050102-3');   /* the socket end: the square, the relief */
      tag(mesh(g,lathe([[1.45,19],[2.975,19],[2.975,T-2.9],[3.275,T-2.6],[4,T-2.6],[4,T],[0,T],[0,23],[1.45,22.2]]),M.brass),'050102-3',1);   /* on: the drilled hole's end, the head */
      /* the body (05 01 02-2) cut as its sheet draws it, from four closed solids meeting face to face (the cell builder cuts upright holes in flat faces only), joined into one below: below the drill
         point's foot (YA) the spring's Ø 0.9 hole, 3.8 out at the bottom face and 5° in toward the axis going up, cut through as a slanted hole; from YA to YS (under the slot)
         the drill point's 120° cone, the spring's hole carried up through it (upright, where it leaves the hole below) to come out in the cone, the bore's wall and the cone
         outside; above YS the two jaws either side of the slot, built along the pin's axis (z), so that the cross hole (Ø 2.5 +0.05, 4 −0.05 under the top) is an upright hole
         through each jaw from the bore to the outside, and the slot's walls (3 H11 apart) and its Ø 35 floor (6.3 +0.1 under the top at the outside) are faces: each plan
         point (x, y) of a jaw holds z from the bore's wall (or the slot's, or the plane z 0 below the floor, where the jaws meet) to the turned outside. Fits: the bore Ø 8.1,
         the hole Ø 6.1, the slot 3.03 and the cross hole 2.525 (the middles of their tolerances) */
      const YD=BT-22.58,YA=YD-0.12,YS=BT-7.6,SW=1.515,RB=4.05,RO=7.25,RH=1.2625,YH=BT-4,YC=BT-6.3+Math.sqrt(17.5**2-RO**2),ZC=3.8-(YA-B0)*Math.tan(5*D2R),
        cone=p=>B0+(rr(p)-4.57)*10/2.68,dp=p=>YD+(rr(p)-3.05)*0.58,hc=(c,r,n=24)=>[...Array(n).keys()].map(k=>{const t=k/n*TAU;return[c[0]+r*Math.cos(t),c[1]+r*Math.sin(t)];});
      const BG=[solidGeo(cells([3.05,4.57],[[0,0],[B0,YA]],[[],[{p:hc([0,3.8],0.45),q:hc([0,ZC],0.45),a:B0,b:YA}]]).slice(1))];
      const bore=x=>Math.sqrt(Math.max(0,RB*RB-x*x)),zo=p=>Math.sqrt(Math.max(0,(p[1]<BT-1.5?RO:BT+5.75-p[1])**2-p[0]**2)),fl=x=>YC-Math.sqrt(17.5**2-x*x),
        ych=x=>BT+5.75-Math.hypot(x,SW),xl=y=>Math.sqrt((BT+5.75-y)**2-SW*SW),XS=bore(SW),XO=Math.sqrt(RO*RO-SW*SW),XT=xl(BT),YL=[1,2,3].map(k=>BT-1.5+k*0.375);
      /* the jaws' columns in x: the outside and the bore every 3° (their 6° the sectors below), the cross hole by angle (each sheds its curve evenly), where the slot's wall meets
         the bore and the outside, where the chamfer's levels meet its edge; none wider than 0.3. The solid under the jaws takes its outline's points from these columns, so the
         two meet point for point (a polygon of their own left slivers 2 µm wide, which drew as a dashed line) */
      const SP=[0,XS,XO,XT,...YL.map(xl),RH,RB,RO,...[...Array(61).keys()].flatMap(k=>[RO,RB].map(r=>r*Math.cos(k*Math.PI/60)))].flatMap(v=>[v,-v]).sort((u,v)=>u-v).filter((v,i,A)=>!i||v-A[i-1]>1e-9);
      let X=[];for(let k=1;k<24;k++)X.push(RH*Math.cos(k*Math.PI/24));
      X=[...SP,...X.filter(v=>SP.every(s=>Math.abs(v-s)>0.004))].sort((u,v)=>u-v);
      for(let i=X.length-2;i>=0;i--){const n=Math.ceil((X[i+1]-X[i])/0.3);if(n>1)X.splice(i+1,0,...[...Array(n-1).keys()].map(k=>X[i]+(X[i+1]-X[i])*(k+1)/n));}
      {const an=(A,r)=>A.filter(x=>Math.abs(x)<=r+1e-12).flatMap(x=>{const t=Math.acos(clamp(x/r,-1,1));return[t,TAU-t];}).sort((u,v)=>u-v).filter((v,i,B)=>!i||v-B[i-1]>1e-12),
          AO=an(X,RO),AB=an(X,RB),G=[...Array(241).keys()].map(k=>k*TAU/240),T6=[...Array(61).keys()].map(k=>k*TAU/60),
          pts=(r,A,ta,tb)=>A.filter(t=>t>ta-1e-9&&t<tb+1e-9).map(t=>[r*Math.cos(t),r*Math.sin(t)]),
          ringC=(r0,A0,r1,A1,bd,y0,y1)=>bd.slice(0,-1).map((ta,i)=>({loop:[...pts(r1,A1,ta,bd[i+1]),...pts(r0,A0,ta,bd[i+1]).reverse()],y0,y1,F:[]}));
        /* rings: the drill point (in 6° sectors, its sectors from 78° to 102° as two cells either side of the spring's hole, which they leave open; from YA, 0.12 under the
           cone's foot, so no sloped face has an edge in the joint's plane), the flat ring to the cone's foot, the cone's ring; arcs at the bore and the outside the jaws'
           points, at 3.05 and 4.57 the bottom ring's (cells' 1.5°) */
        const H=hc([0,ZC],0.45),c=[...ringC(3.05,G,RB,AB,T6,YA,dp),...ringC(RB,AB,4.57,G,[0,Math.PI,TAU],YA,YS),...ringC(4.57,G,RO,AO,T6,cone,YS)],t=T6;
        c.splice(13,4,{loop:[...pts(RB,AB,t[13],t[15]),...[6,5,4,3,2,1,0,23,22,21,20,19,18].map(k=>H[k]),...pts(3.05,G,t[13],t[15]).reverse()],y0:YA,y1:dp,F:[]},
          {loop:[...pts(RB,AB,t[15],t[17]),...pts(3.05,G,t[15],t[17]).reverse(),...[18,17,16,15,14,13,12,11,10,9,8,7,6].map(k=>H[k])],y0:YA,y1:dp,F:[]});
        BG.push(solidGeo(c));}
      {/* each column's levels (low to high): the jaws' foot YS, the slot's floor (outside the bore's shadow), the cross hole's lower and upper edge, the chamfer's foot and three
           levels up it, and the top (the chamfer's edge, where the slot's wall leaves it, toward the outside) */
        const lev=(xa,xb)=>{const m=Math.abs((xa+xb)/2),L=/** @type {{f:(x:number)=>number,fl?:number,lo?:number}[]} */([{f:()=>YS}]);if(m>XS)L.push({f:fl,fl:1});if(m<RH)L.push({f:x=>YH-Math.sqrt(Math.max(0,RH*RH-x*x)),lo:1},{f:x=>YH+Math.sqrt(Math.max(0,RH*RH-x*x))});
          if(m<XO){L.push({f:()=>BT-1.5});for(const y of YL)if(m<xl(y))L.push({f:()=>y});L.push({f:m<XT?()=>BT:ych});}return L;};
        const C=X.slice(0,-1).map((xa,i)=>{const xb=X[i+1];return{xa,xb,L:lev(xa,xb).map(l=>({...l,a:l.f(xa),b:l.f(xb)})).sort((u,v)=>u.a+u.b-v.a-v.b)};}),out=[],e=1e-7;
        C.forEach((c,i)=>{const lt=i?C[i-1].L.map(l=>l.b):[],rt=i<C.length-1?C[i+1].L.map(l=>l.a):[],u=A=>A.filter((v,k)=>!k||Math.abs(v-A[k-1])>e);
          for(let j=0;j<c.L.length-1;j++){const l0=c.L[j],l1=c.L[j+1];if(l0.lo)continue;   /* between the cross hole's edges: the hole */
            const R=u(rt.filter(y=>y>l0.b+e&&y<l1.b-e).sort((p,q)=>p-q)),Lf=u(lt.filter(y=>y>l0.a+e&&y<l1.a-e).sort((p,q)=>q-p));
            let lp=[[c.xa,l0.a],[c.xb,l0.b],...R.map(y=>[c.xb,y]),[c.xb,l1.b],[c.xa,l1.a],...Lf.map(y=>[c.xa,y])];lp=lp.filter((q,k)=>{const n=lp[(k+1)%lp.length];return Math.abs(q[0]-n[0])>e||Math.abs(q[1]-n[1])>e;});
            out.push({loop:lp,y0:c.L.slice(0,j+1).some(l=>l.fl)?SW:p=>bore(p[0]),y1:zo,F:[]});}});
        const gz=solidGeo(out);gz.rotateX(-Math.PI/2);const gp=gz.clone();gp.rotateY(Math.PI);   /* the plan's (x, y) and depth z to the key's frame: the jaw at −z, turned about the axis to +z */
        BG.push(gz,gp);}
      /* the four as one: the faces where they meet (y YA and the wall r 4.57 under it, y YS, and z 0 below the slot's floor, where the jaws meet) dropped, both sides; their outlines are the same points,
         so what is left is one closed surface (kept apart, the faces met the surface's edge at its own depth and flickered through as a line) */
      {const P=[],Nn=[],U=[],on=(a,i,k,v)=>Math.abs(a[i+k]-v)<1e-6&&Math.abs(a[i+3+k]-v)<1e-6&&Math.abs(a[i+6+k]-v)<1e-6,
          wl=(a,i)=>[0,3,6].every(k=>Math.abs(Math.hypot(a[i+k],a[i+k+2])-4.57)<1e-5&&a[i+k+1]<YA+1e-6)&&!on(a,i,1,a[i+1]);   /* the joint's wall at r 4.57 (a horizontal face's sliver on that arc kept) */
        for(const q of BG){const a=q.attributes.position.array,n=q.attributes.normal.array,u=q.attributes.uv.array;
          for(let i=0;i<a.length;i+=9){if(on(a,i,1,YA)||on(a,i,1,YS)||on(a,i,2,0)||wl(a,i))continue;P.push(...a.slice(i,i+9));Nn.push(...n.slice(i,i+9));U.push(...u.slice(i/3*2,i/3*2+6));}}
        const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.Float32BufferAttribute(P,3));bg.setAttribute('normal',new THREE.Float32BufferAttribute(Nn,3));bg.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
        tag(mesh(g,smoothRev(bg),MC.black),'050102-2');}
      /* the paddle with the pin's hole (Ø 2.525), its centre on the slot's floor at the bore's edge */
      const PY=BT+0.002+Math.sqrt(17.25**2-RB*RB)-(Math.sqrt(17.5**2-RB*RB)-(YC-BT)),ds=new THREE.Shape();ds.absarc(0,0,17.25,0,TAU,false);{const h=new THREE.Path();h.absarc(0,YH-PY,RH,0,TAU,true);ds.holes.push(h);}
      const dg=extrude(ds,{depth:3,bevelEnabled:false,curveSegments:72});dg.translate(0,PY,-1.5);tag(mesh(g,dg,MC.black),'510011-1');
      const pe=[...Array(4).keys()].map(k=>[0.8+0.45*Math.sin(k*Math.PI/6),7.65-0.45*(1-Math.cos(k*Math.PI/6))]);   /* the pin's rounded end, r 0.45 */
      const pn=tag(mesh(g,lathe([[0,-7.65],...pe.map(([r,y])=>[r,-y]),...pe.slice().reverse(),[0,7.65]],16),M.steel,0,BT-4,0),'510011-6');pn.rotation.x=Math.PI/2;
      /* the spring: 0.6 wire on the tube (its coils' centres r 3.285), pitch 0.95, from the bore's floor (its lowest coil 0.02 over the drill point) to 0.01 under the tube's head;
         its end from there out and down to the Ø 0.9 hole's axis where the hole leaves the drill point (r 3.554, 2.812 over the bottom face) and along it, 5° off the axis, to
         0.05 inside the bottom face (r 3.8 there). Sampled at its own parameter (the end's corners at samples) */
      const rs=2.975+0.31,y0=BT-21.95,y1=T-2.6-0.31,nT=(y1-y0)/0.95,nH=Math.ceil(nT*24),N=nH+4,V3=(x,y,z)=>new THREE.Vector3(x,y,z),
        Pc=V3(0,B0+0.05,3.8-0.05*Math.tan(5*D2R)),Pb=V3(0,B0+2.812,3.554),Pa=V3(0,y0,rs),cv=new THREE.Curve();
      cv.getPoint=s=>{if(s<=2/N)return Pc.clone().lerp(Pb,s*N/2);if(s<=4/N)return Pb.clone().lerp(Pa,(s-2/N)*N/2);const t=(s-4/N)/(1-4/N),a=Math.PI/2+t*nT*TAU;return V3(rs*Math.cos(a),y0+(y1-y0)*t,rs*Math.sin(a));};
      cv.getPointAt=cv.getPoint;cv.getTangentAt=cv.getTangent;
      tag(mesh(g,closeGeo(new THREE.TubeGeometry(cv,N,0.3,6,false)),M.steel),'510011-4');}
    /* As first drawn (the page's Variants), the key of 1940 (Aufzugschlüssel 127-556.02 U 01 = 51 00 11, 12.12.40, 2:1), which the one-way key of 1943 replaced under the same
       number: 84 overall and the stem 32 out of the body (sure); the rest traced on the sheet at 6.79 px/mm (by its 84): the handle a flat pear-shaped plate (the tang, part 1:
       the side view draws it 3.2 thick and no bulb), widest Ø 34.8 about 9 from its top, its neck Ø 16.5; a collar Ø 20.5 × 2.9; the body (2) a cone Ø 17.9 to 10.3 over 19.3;
       the stem (3) Ø 6.0 pressed in, its socket for the fusee's square drilled from its end (drawn round, Ø 3.1, 28 deep, as the later tube's: estimated), its end chamfered
       0.9 × 45°; the screw (5) on the collar beside the tang, 5.3 from the axis (head Ø 3 × 1, estimated). The click spring (4) in the body isn't drawn. The handle and the body
       with its collar brass, the screw steel: Wempe No. 6161's key (antiquorum_208-4_wempe6161.jpg, px 2350-3050 × 2200-2900: the pear-shaped handle about Ø 35.6 and the
       collar with its slotted screw brass; the body under it not seen: sure for the handle and collar), which the sheet doesn't give (black, as the later key's, until 18 October
       2026). It stands in the holder as the later key does, on its cone (KEYREST) */
    {const g=new THREE.Group();g.userData.rev='first';key.add(g);   /* placed by the key part (KEYREST, keyAt): the same frame, its stem's end at 0 */
      const lathe=(pr,n=48)=>{let q=[...pr,pr[0]];if(area(q)<0)q=q.slice().reverse();return new THREE.LatheGeometry(q.map(([r,y])=>V2(r,y)),n);};
      tag(mesh(g,lathe([[3.0,31.7],[5.16,31.7],[8.95,51.0],[10.25,51.0],[10.25,54.0],[0,54.0],[0,45.0],[3.0,45.0]]),M.brass),'127556.02-02');   /* the body and collar, the stem pressed 13.3 into it (estimated) */
      tag(mesh(g,lathe([[1.55,0],[2.1,0],[3.0,0.9],[3.0,45.0],[0,45.0],[0,28.0],[1.55,27.2]]),M.brass),'127556.02-03');
      const PR=[[54.0,9.0],[55.0,9.0],[56.0,8.69],[57.5,8.33],[59.0,8.25],[60.4,8.4],[61.9,8.77],[63.4,9.43],[64.8,10.39],[66.3,11.86],[67.8,14.0],[69.3,15.7],[70.7,16.65],[72.2,17.24],[73.7,17.39],
        [75.2,17.39],[76.6,17.0],[78.1,16.2],[79.6,15.03],[81.05,12.45],[82.5,8.55],[83.4,4.8],[84.0,0.6]];
      const out=[...PR.map(([y,r])=>[r,y]),...PR.slice().reverse().map(([y,r])=>[-r,y])];   /* the plate's outline in its own plane (x across, y along the key) */
      const pl=polyGeo(area(out)>0?out:out.slice().reverse(),3.2);pl.rotateX(-Math.PI/2);pl.translate(0,0,1.6);tag(mesh(g,pl,M.brass),'127556.02-01');
      tag(mesh(g,lathe([[0,54.0],[1.5,54.0],[1.5,55.0],[0,55.0]],20),M.steel,0,0,5.3),'127556.02-05');}
    /* keyAt(seat): the key onto the fusee's square (seat {g, y}: fusee.js keySeat, the dust plate's group, which turns with the fusee, and its face, where the square is 3.1
       across and the tube's mouth stops), its axis down the square (the movement frame's −y), or (no seat) back in its holder */
    const keyAt=(s,d=0)=>{if(s){s.g.add(key);key.position.set(0,s.y-0.05-d,0);key.rotation.set(Math.PI,0,0);}else{root.add(key);KEYREST();}};   /* d: how far out along the square it still is (coming on or going off) */
    stayAt();
    /* the Variants' case: 'brass' (the drawings' Ms., as Wempe 6161's) or 'black', as Wempe No. 3044's (milivault_529241_wempe3044_screen.png): the bowl, bezel, gimbal ring and
       its bracket lacquered black and the transit lock's bracket black (CB above), the box's mahogany its lighter, redder wood (woodTex's km). The 6MX's and Wempe 3955's
       cases keep theirs. Colours only: the shapes are the drawings' */
    let woodK=null;const C0=[CB].map(m=>m.userData.c0||(m.userData.c0={c:m.color.clone(),m:m.metalness,r:m.roughness})),woodB=MC.mah.map;
    const setCase=v=>{const b=v==='black';[CB].forEach((m,i)=>{const o=C0[i];m.color.copy(b?sc(0x141416):o.c);m.metalness=b?0.1:o.m;m.roughness=b?0.36:o.r;});
      if(b&&!woodK)woodK=woodTex(false,false,true);MC.mah.map=b?woodK:woodB;MC.mah.needsUpdate=true;};
    const out={setCase,stay:stayAt,root,ring:ringG,bowl:bowlG,inner:bowlS,lid:lidG,tongue:tgG,YP,YB,keyAt,keyRest:()=>{if(key.parent===root)KEYREST();},shutter:q=>{cp.rotation.y=CPS*(1-q);cp.userData.turn();},over,overLid:olG,parts:{bowl,closingPlate:cp,bezel:bz,gimbalRing:rgP,box:bx,lid:ld,caseLock:lk,key,overBox:over,overLid:ol}};
    /* rev(v): the lids the page turns are the version's (app.js's onRev) */
    out.rev=v=>{const s=v==='6mx';out.lid=s?lid6G:lidG;out.tongue=s?tg6:tgG;out.overLid=s?ol6G:olG;bowlS.position.y=s?-DY6:0;cp.userData.spEnd(s?YB-61.3:YB-63,s?0:CPY);};
    return out;}
  return{build,YP,YB};
})();
