// @ts-check
/* train.js: the Wempe Einheits-Chronometer's going train (Laufwerk, drawing group 05 05), built from its sheets as last revised (the pinions 05 05 01-2 and 05 05 02-2 redrawn
   6.46, the seconds pinion's last change 24.3.48): the centre (minute) wheel 05 05 03, the intermediate (Zwischen-) wheel 05 05 02 and the seconds wheel 05 05 01, each a
   brass wheel riveted on its steel pinion and arbor, at holes 1, 38 and 35 of WD.H; and their bearings: the brass bushes (Messinglager) WN-301 at 1 and WN-300 at 35 and 38 in
   the top plate (05 08 01), WN-302 at 1 in the pillar plate (05 08 02), WN-300 at 38 in the intermediate bridge and the seconds wheel's jewel 05 05 04-1 in its setting
   05 05 04-2 at 35 in the bridge (05 08 04, the coloured section); and the pillar plate's two bushes 05 08 02-2 at holes 2 and 19 with the studs (Anrichtstifte 05 02 00-6,
   -7) they hold, on which the motion work and the up-and-down work turn (05 08 02). The escape wheel and pinion (05 04), the fusee wheel, the cannon tube 05 05 03-3 on the
   centre arbor and the motion work are other groups'.
   Part of the Wempe model (three.js r128). Declares only WTRAIN: WTRAIN.build(mv, M, K) adds the parts to the movement group (K: KIT.parts' makers, the frame already built) and
   returns {cw, tw, sw, update}: the three arbors' turning groups, each with its wheel and pinion meshes (userData.wheel, .pin: gearLash's meshes, for the fusee wheel and the
   escape pinion to phase against), and update(s), which turns them from the escape wheel's place s.E (teeth) and returns their angles {c, t, s} (rotation.y, the movement's
   frame) for the motion work and the fusee.
   Units mm, the movement frame (dims.js): dial side +y, 12 o'clock -z, 3 o'clock +x. Each arbor is placed along y from its top-plate shoulder at ys, the shoulder that rests
   on the top plate's bush; every height below is from that shoulder (u) unless it says y. Sizes are the middle of their fits, as the frame's. */
const WTRAIN=(()=>{
  const H=WD.H,TI=-WD.INNER,TT=TI-WD.TOP_T,PPT=WD.PP_T,ZB=PPT+3.8,V2=(a,b)=>new THREE.Vector2(a,b);   /* ZB: the intermediate bridge's dial face (3.8 thick, frame.js) */
  /* ---------- the sheets' teeth, on core.js's cycloidal forms (gearOutline) with the tables' numbers ----------
     A wheel's tooth as gearOutline draws one: radial flanks from the root to the pitch circle, then the epicycloid its pinion's rolling circle (half the pinion's pitch
     radius: mate, its leaves) traces from the pitch point, both sides, here with the table's tooth thickness l on the pitch circle, run up to the table's tip diameter D
     (the epicycloid would meet the tooth's middle at 1.60-1.69 m, the tables' D at 1.56-1.58 m: the sheets' rounded ogives, topped there), and the table's root
     diameter dg. A pinion's leaf as gearOutline's (radial flanks, a round end on the pitch circle) with its radii put on the sheet's tip and root: radii outside the
     pitch circle stretched from gearOutline's addendum to the sheet's, inside it from its root to the sheet's (05 05 03-2's end view draws the leaves so, long and
     round-ended). m: the pitch diameter over the teeth */
  function teeth(z,m,D,dg,mate,l){const rp=m*z/2,ro=D/2,ri=dg/2,p=TAU/z,pts=[];
    if(!l){const G=gearOutline(z,m,{}),xy=G.xy.map(([x,y])=>{const r=Math.hypot(x,y),a=Math.atan2(y,x),q=r>=rp?rp+(r-rp)*(ro-rp)/(G.ro-rp):ri+(r-G.ri)*(rp-ri)/(rp-G.ri);return[q*Math.cos(a),q*Math.sin(a)];});
      return{xy,ro,ri};}
    const b=l/2/rp,rg=m*mate/4,K=(rp+rg)/rg,ep=[],E=t=>{const x=(rp+rg)*Math.cos(t)-rg*Math.cos(K*t),y=(rp+rg)*Math.sin(t)-rg*Math.sin(K*t);return[Math.hypot(x,y),Math.atan2(y,x)];};
    let t1=0;while(t1<1.5){const[r,a]=E(t1+1e-4);if(a>=b||r>=ro)break;t1+=1e-4;}   /* where the epicycloid reaches the tooth's middle or the tip circle */
    for(let k=0;k<=16;k++){const[r,a]=E(t1*k/16);ep.push(k<16?[r,a]:[Math.min(r,ro),Math.min(a,b)]);}
    for(let i=0;i<z;i++){const c=i*p+0.375*p;pts.push([ri,c-b]);for(const[r,a]of ep)pts.push([r,c-b+a]);for(let k=ep.length-1;k>=0;k--){const[r,a]=ep[k];if(a<b-1e-9||k<ep.length-1)pts.push([r,c+b-a]);}
      pts.push([ri,c+b]);for(let k=1;k<3;k++)pts.push([ri,c+b+(p-2*b)*k/3]);}
    return{xy:pts.map(([r,a])=>[r*Math.cos(a),r*Math.sin(a)]),ro,ri};}
  /* a wheel or pinion as one closed solid (core.js's extrude): the outline extruded th along y and centred on y 0, as gearGeo; spokes [n, width, hub radius, rim's inner
     radius], straight spokes of constant width as gearGeo cuts them; bore its hole. Outline and radii in userData as gearGeo's, for gearLash */
  function gear(T,th,o={}){const s=new THREE.Shape();s.moveTo(T.xy[0][0],T.xy[0][1]);for(let i=1;i<T.xy.length;i++)s.lineTo(T.xy[i][0],T.xy[i][1]);s.closePath();
    if(o.spokes){const[n,sw,R0,R1]=o.spokes,d1=Math.asin(sw/2/R1),d0=Math.asin(sw/2/R0);
      for(let j=0;j<n;j++){const a0=j/n*TAU,a1=(j+1)/n*TAU,h=new THREE.Path();h.absarc(0,0,R1,a0+d1,a1-d1,false);h.absarc(0,0,R0,a1-d0,a0+d0,true);s.holes.push(h);}}
    if(o.bore){const h=new THREE.Path();h.absarc(0,0,o.bore,0,TAU,true);s.holes.push(h);}
    const g=extrude(s,{depth:th,bevelEnabled:false,curveSegments:o.spokes?40:24});g.rotateX(-Math.PI/2);g.translate(0,-th/2,0);Object.assign(g.userData,{ro:T.ro,ri:T.ri,pl:T.xy});return g;}
  /* a turned solid from a profile [[r, y], ...] listed from one end on the axis to the other, y rising (counterclockwise in r, y, as shaftGeo's) */
  const turned=(P,seg=32)=>new THREE.LatheGeometry(P.map(([r,y])=>V2(r,y)),seg);
  /* a turned ring (a bush, a setting): its profile a closed loop counterclockwise in r, y (the first point again at the end) */
  const ringT=(P,seg=48)=>new THREE.LatheGeometry([...P,P[0]].map(([r,y])=>V2(r,y)),seg);
  /* a 30 deg chamfer on a shoulder (the pinion sheets' "30°"): the body's edge cut C30 across, at 30 deg to the shoulder's face */
  const C30=0.15,c30=C30*Math.tan(30*D2R);
  /* a pivot l long from a shoulder at u0, Ø 2r at the shoulder tapering to 2re at its end, the end rounded (a quarter ellipse re across, 0.6 re deep); s -1 toward -u (listed
     from its end on the axis out to the shoulder), +1 toward +u (from the shoulder to its end on the axis) */
  const piv=(r,re,l,s,u0=0)=>{const h=0.6*re,o=[];for(let k=0;k<=6;k++){const t=k/6*Math.PI/2;o.push([re*Math.sin(t),u0+s*(l-h+h*Math.cos(t))]);}
    return s<0?[...o,[r,u0]]:[[r,u0],...o.reverse()];};
  /* a bush's oil sink, a cup in its face at y (s +1 going into the bush toward +y, from its low face; -1 toward -y): from the face's rim (radius rs) down to the bore (rb), on a
     sphere through the rim and the cup's bottom ds deep */
  const cup=(rb,rs,ds,y,s)=>{const R=(rs*rs+ds*ds)/(2*ds),yc=y+s*(ds-R),a0=Math.asin(rs/R),a1=Math.asin(rb/R),o=[];
    for(let k=0;k<=12;k++){const a=a0+(a1-a0)*k/12;o.push([R*Math.sin(a),yc+s*R*Math.cos(a)]);}return o;};
  /* a bush: Ø 2ro from y0 to y1, bore rb; sk: its sink, {f: +1 in the face at y1, -1 at y0; rs its radius at the face; ds a spherical cup's depth, or cone: a 90 deg cone} */
  function bushGeo(ro,rb,y0,y1,sk){
    if(!sk)return ringT([[rb,y0],[ro,y0],[ro,y1],[rb,y1]]);
    const yf=sk.f>0?y1:y0,s=-sk.f,S=sk.cone?[[sk.rs,yf],[rb,yf+s*(sk.rs-rb)]]:cup(rb,sk.rs,sk.ds,yf,s);   /* from the face's rim in to the bore */
    return sk.f>0?ringT([[rb,y0],[ro,y0],[ro,y1],...S]):ringT([[ro,y0],[ro,y1],[rb,y1],...S.slice().reverse()]);}

  /* ================= the arbors, as the sheets give them =================
     Heights: the plates' inner faces 19.0 apart (WD.INNER). Each arbor's train-side shoulder rests on a brass bush flush with the top plate's inner face (05 08 01 draws
     WN-300 and WN-301 through the plate; the sheets' lengths below add up to the plates' 19 with them flush). Its dial-side shoulder rests on:
     - the centre arbor: the pillar plate's bush WN-302, set 0.1 +0.02 under the plate's inner face (05 08 02, Schnitt A-B), by the riveting collar Ø 3.0 at the end of its
       wheel's seat, 19 +0.05 (framed) from its train-side shoulder (05 05 03-2; 05 05 03's "19 ±0,05", also framed): 19.1 between the bushes' faces, the arbor drawn 19.03,
       so 0.07 endshake (the arbor's tolerance and the bush's give 0.05-0.12);
     - the intermediate arbor: the bush WN-300 pressed into the intermediate bridge, its face 0.7 +0.02 in from the bridge's plate side (05 08 04): 19 + 3.35 + 0.71 = 23.06
       against the arbor's 23.05 -0.1 between shoulders (05 05 02-2), drawn 23.0: 0.06;
     - the seconds arbor: its jewel 05 05 04-1 in the bridge, its face 1.7 in from the bridge's plate side (05 08 04's "1,7", drawn 1.75: the sheet gives no tolerance),
       19 + 3.35 + 1.75 = 24.1 against the arbor's 24.1 -0.1 between shoulders (05 05 01-2, revised 24.3.48: "war 24 -0,05"), drawn 24.05: 0.05.
     Each arbor is drawn in the middle of its endshake. */
  /* the centre arbor's journal C (1:30, its e8's middle 2.179 at the collar) and shank (1:80 from Ø 1.8 at C) by their radius at u; CRN the sphere its end and the cannon tube's
     top are crowned on, crown(f, u1) its end's profile from the shank's radius f(u) to the axis at u1 */
  const rCj=u=>(2.179-(u-19.03)/30)/2,rSh=u=>(1.8-(u-23.03)/80)/2,CRN=3.1,dCr=r=>CRN-Math.sqrt(CRN*CRN-r*r),
    crown=(f,u1)=>{let u=u1;for(let i=0;i<4;i++)u=u1-dCr(f(u));const r0=f(u),o=[];for(let k=0;k<=6;k++){const r=r0*(1-k/6);o.push([r,u1-dCr(r)]);}return o;};
  const A={
    /* the centre (minute) arbor, 05 05 03 (Minutenrad kompl., 22.7.43): its pinion and arbor 05 05 03-2 (Minutentrieb, Präz. Rundstahl 7,2, hardened and tempered at 295°)
       and the wheel 05 05 03-1 (Minutenrad, Messingblech 1,5 Ms 58 federhart) riveted on it ("vernietet").
       From the train-side shoulder (05 05 03-2): the pivot Ø 1.2 -0.02, 3 long (05 05 03; the pinion sheet's 5.1 -0.2 is the turned blank's, with its 60° centre), tapered
       (its "Kegel 1:?0" too small to read; 1:30, as the seconds wheel's sheet of the same years: likely), rounded; the arbor Ø 2.5 to the pinion, a 30° chamfer at the
       shoulder; the pinion 14 leaves, m 0.4356, d 6.098, tip 6.79 -0.02 (the blank's), root 4.24, 4 -0.1 long, its end 17.2 +0.05 from the shoulder; the wheel's seat
       Ø 5.4 n6 above it, the wheel on it against the pinion's end; the riveting collar to 19 +0.05 (framed): Ø 3.0 at its foot (05 05 03-2's "3,0∅"), flared to Ø 3.2 at
       its top, its flank running on down into a V groove in the seat's face under it, 0.99 deep to Ø 2.44, the groove's outer wall rising at 34° to the seat's edge, which
       the riveting spreads over the wheel's hole (05 05 03-2 at 5:1, cropped and enlarged 8×, 141.7 px/mm by the journal's 2.2 and the seat's 5.4 alike: the collar's foot
       Ø 3.0, its top 3.14-3.21 at its edges (its extension lines 3.35), the groove's bottom Ø 2.44 at 0.99, its wall to the seat's corner; 05 05 03 draws the same, riveted:
       likely; until 15 October 2026 a plain Ø 3.0 with a 30° chamfer on top); the journal "C" Ø 2.2 e8 (-0.014/-0.028) on a 1:30 taper ("Kegel 1:30" along it on
       05 05 03 and 05 05 03-2: legible), Ø 2.2 at the collar, where both sheets put the figure, and smaller toward the dial as the shank's 1:80 is (05 05 03-2's outline 1 px,
       0.06, wider at the collar end, under the 2.2 px the taper would give: which end is the larger is likely, not sure), to 23 +0.05, which runs in WN-302 (until 15 October
       2026 a cylinder); then the shank that carries the cannon tube 05 05 03-3 (another group's), Ø 1.8 at C tapering 1:80 ("Kegel 1:80", Ø 1.65 near its end), to the
       tube's top: 14.3 over the C shoulder (05 05 03; the pinion sheet's 39.65 -0.1 overall is the blank's, with its centre). Under the tube's punch mark ("Körner") a groove
       in the shank, its square shoulder 6.07 over C and its cone 0.24 deep rising to the shank's 6.73 over C (05 05 03 of 1943, 16.8 px/mm: 4 px each side, 10.5 px high;
       05 05 03-2 of 1940 hasn't it: likely), which the punch drives the tube's wall into. Its end crowned with the tube's, flush (05 05 03 draws one arc across both, rising
       0.35 over the tube's 2.86 seen: a sphere r 3.1, likely; until 15 October 2026 its end chamfered 0.1). The sheets' 1.6 -0.1 for the seat and collar together
       (05 05 03-2) leaves 1.8 between the pinion's end and the framed 19: not settled (README).
       The wheel (05 05 03-1): z 90, m 0.355 (d 31.976, so 0.35529), tip 33.10, root 30.86, l 0.52 (the tooth on the pitch circle), 1.3 -0.1 thick at the rim, five spokes
       1.7 -0.2 wide, hub 10.6 -0.2, rim's inside 28.1 +0.2, hole 5.4 H7; its hub left the sheet's 1.5 thick and standing 0.2 proud on the dial side, turned to Ø 10 there
       (05 05 03: "0,2", "10∅"). */
    cw:{at:H[1],ys:TI+0.035,
      prof:[...piv(1.19/2,(1.19-3/30)/2,3,-1),[2.5/2-C30,0],[2.5/2,c30],[2.5/2,17.225],[5.4/2,17.225],[5.4/2,18.675],[2.44/2,18.675-0.99],[3.2/2,19.03],
        [rCj(19.03),19.03],[rCj(23.03),23.03],[rSh(23.03),23.03],[rSh(29.1),29.1],[rSh(29.1)-0.24,29.1],[rSh(29.76),29.76],...crown(rSh,37.33)],
      crown:CRN,
      pin:{z:14,m:6.098/14,D:6.79-0.01,dg:4.24,u0:17.225-3.95,u1:17.225},
      wheel:{z:90,m:31.976/90,D:33.10,dg:30.86,l:0.52,mate:12,rim:[17.225,18.475],boss:[18.475,18.675,10/2],spokes:[5,1.6,10.5/2,28.2/2],bore:5.4/2}},
    /* the intermediate arbor, 05 05 02 (Zwischenrad kompl., 27.7.40): its pinion and arbor 05 05 02-2 (Zwischentrieb, Präz. Rundstahl 5,2, redrawn 6.46) and the wheel
       05 05 02-1 (Zwischenrad, Messingblech 1,2 Ms 58 federhart) riveted on it. From the train-side shoulder: the pivot Ø 0.85 -0.05 (05 05 02-2; the kompl.'s 0.82 -0.02
       of 1940 superseded), 3 -0.1 long (05 05 02; the pinion sheet's 4.6 -0.2 the blank's, pointed), tapered ("Kegel 1:?0": 1:90, as the seconds pinion redrawn with it: likely),
       rounded; the arbor Ø 2 -0.1 to the pinion, a 30° chamfer at the shoulder; the pinion 4.6 -0.2 long, its end 19.25 -0.1 from the shoulder; the wheel's seat Ø 4.0 n6,
       1.3 -0.1 long; the collar Ø 2 -0.1 to the dial-side shoulder at 23.05 -0.1; the pivot as the other.
       The pinion: 12 leaves, not on its sheet: from the centre distance 18.12 (05 05_1, the plates' tables) and the centre wheel's module, (2 × 18.12 - 31.976)/0.35529 =
       12.0 (the transcription's inference, confirmed: no other count fits); its tip Ø 5.0 (scaled on 05 05 02-2 against the arbor's Ø 2: 4.9-5.2, the bar 5.2),
       root Ø 2.75 (the centre pinion's dedendum, 2.13 m, as the sheets give no root for it: estimated).
       The wheel (05 05 02-1): z 80, m 0.280 (d 22.453, so 0.28066), tip 23.33, root 21.57, l 0.40, 1.0 -0.1 thick at the rim, five spokes 1.3 -0.2, hub 7.5 -0.1, rim's
       inside 19.3 +0.2, hole 4 H7; its hub 1.2 (the sheet's metal) standing 0.2 proud on the dial side, turned to Ø 7 there (05 05 02: "0,2", "7∅") */
    tw:{at:H[38],ys:TI+0.03,
      prof:[...piv(0.825/2,(0.825-2.95/90)/2,2.95,-1),[1.95/2-C30,0],[1.95/2,c30],[1.95/2,19.2],[4.0/2,19.2],[4.0/2,20.45],[1.95/2,20.45],[1.95/2,23.0-c30],[1.95/2-C30,23.0],
        ...piv(0.825/2,(0.825-2.95/90)/2,2.95,1,23.0)],
      pin:{z:12,m:4.264/12,D:5.0,dg:2.75,u0:19.2-4.5,u1:19.2},
      wheel:{z:80,m:22.453/80,D:23.33,dg:21.57,l:0.40,mate:10,rim:[19.2,20.15],boss:[20.15,20.35,7/2],spokes:[5,1.2,7.45/2,19.4/2],bore:4.0/2}},
    /* the seconds arbor, 05 05 01 (Sekundenrad kompl., 27.7.40): its pinion and arbor 05 05 01-2 (Sekundentrieb, Präz. Rundstahl 3,5, redrawn 6.46, revised 24.3.48) and the
       wheel 05 05 01-1 (Sekundenrad, Messingblech 1,2 Ms 58 federhart) riveted on it. From the dial-side shoulder (05 05 01-2): the pivot Ø 0.76 -0.02 at its root, 0.65 at
       its end 9.2 out ("Kegel 1:90"): its first 2 run in the jewel ("i/Steinlager einpassen", 05 05 01) and the rest is the post that carries the seconds hand through the
       dial; a collar Ø 1.55 -0.1 (a), 2.2 long (scaled on 05 05 01-2: 2.24); the pinion 7 long, its end 9.25 -0.1 from the shoulder; the wheel's seat Ø 2.6 n6, 1.2 +0.1 long;
       the arbor Ø 1.55 -0.1 (a) to the train-side shoulder at 24.1 -0.1, a 30° chamfer there; the pivot Ø 0.82 -0.02, 3 long (05 05 01: the pinion sheet's 4.5 is the
       blank's), "Kegel 1:90", rounded.
       The pinion: 10 leaves, not on its sheet: from the centre distance 12.63 and the intermediate wheel's module, (2 × 12.63 - 22.453)/0.28066 = 10.0 (the
       transcription's inference, confirmed); tip Ø 3.4 (scaled on 05 05 01-2: 3.36-3.57, the bar 3.5), root Ø 1.61 (the centre pinion's 2.13 m: estimated).
       The wheel (05 05 01-1): z 80, m 0.263 (d 21.066, so 0.26333), tip 21.9, root 20.23, l 0.38, 1.0 ±0.03 thick at the rim, five spokes 1.3 -0.2, hub 6.5 -0.2, rim's
       inside 18.3 +0.2, hole 2.6 H7; its hub 1.2 (the sheet's metal) standing 0.2 proud on the pinion's side (05 05 01: "0,2" over the wheel's face under the pinion, the
       hub's "6∅"), so its rim clears the intermediate pinion's end by 0.05 (0.055 as drawn) */
    sw:{at:H[35],ys:TI+0.025,
      prof:[...piv(0.81/2,(0.81-3/90)/2,3,-1),[1.5/2-C30,0],[1.5/2,c30],[1.5/2,13.6],[2.6/2,13.6],[2.6/2,14.85],[1.5/2,14.85],[1.5/2,24.05],[0.75/2,24.05],[0.65/2,33.15],[0.65/2-0.1,33.25],[0,33.25]],
      pin:{z:10,m:2.807/10,D:3.4,dg:1.61,u0:14.85,u1:24.05-2.2},
      wheel:{z:80,m:21.066/80,D:21.9,dg:20.23,l:0.38,mate:10,rim:[13.65,14.65],boss:[14.65,14.85,6/2],spokes:[5,1.2,6.4/2,18.4/2],bore:2.6/2}}};

  function build(mv,M,K){const{part}=K,P=K.parts,tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined);
    const R={};
    for(const[k,name,off,ids]of[['cw','centreWheel',-12,['050503-2','050503-1']],['tw','intermediateWheel',-6,['050502-2','050502-1']],['sw','secondsWheel',-33,['050501-2','050501-1']]]){
      const a=A[k],g=new THREE.Group(),pt=part(name,off);g.position.set(a.at[0],a.ys,a.at[1]);pt.add(g);
      const pin=a.pin,wh=a.wheel;
      const ar=tag(mesh(g,turned(a.prof),M.steel),ids[0]);
      const pm=tag(mesh(g,gear(teeth(pin.z,pin.m,pin.D,pin.dg),pin.u1-pin.u0),M.steel,0,(pin.u0+pin.u1)/2,0),ids[0],1);pm.userData.gear={z:pin.z,m:pin.m};
      const wm=tag(mesh(g,gear(teeth(wh.z,wh.m,wh.D,wh.dg,wh.mate,wh.l),wh.rim[1]-wh.rim[0],{spokes:wh.spokes,bore:wh.bore}),M.gilt,0,(wh.rim[0]+wh.rim[1])/2,0),ids[1]);wm.userData.gear={z:wh.z,m:wh.m};
      tag(mesh(g,ringT([[wh.bore,wh.boss[0]],[wh.boss[2],wh.boss[0]],[wh.boss[2],wh.boss[1]],[wh.bore,wh.boss[1]]]),M.gilt),ids[1],1);   /* the hub's boss, 0.2 proud of the rim */
      g.userData.wheel=wm;g.userData.pin=pm;R[k]=g;void ar;}
    /* tooth phasing under load, as the Hamilton's (gearLash, core.js): the centre wheel drives the intermediate pinion, turning as update() turns it (-1: clockwise from
       the dial, rotation.y falling), the intermediate wheel the seconds pinion (+1). The fusee wheel phases the centre pinion and the seconds wheel the escape pinion
       (other groups': their wheels drive) */
    const ph=(Aw,pa,Bp,pb,s)=>{const[a,b]=gearLash(Aw,pa,Bp,pb,s);Aw.rotation.y=a;Bp.rotation.y=b;};
    ph(R.cw.userData.wheel,H[1],R.tw.userData.pin,H[38],-1);
    ph(R.tw.userData.wheel,H[38],R.sw.userData.pin,H[35],1);

    /* ================= the bearings ================= */
    /* the top plate's brass bushes (Messinglager, 05 08 01: WN-301 at 1, WN-300 at 35 and 38; the coloured section names them): pressed into its holes reamed 4.59 +0.012
       (05 09 01), flush with both faces (05 08 01's Schnitt A-B draws the one at 35 so), the oil sink in the outer face (Wempe 3955, 12_…oben). Bores: the pivots' and 0.01-0.02
       (a close running fit, "Lagerstellen: Enger Laufsitz", 05 05_1): WN-301 Ø 1.21 for the centre's 1.19, WN-300 Ø 0.86 for the intermediate's 0.825 and the seconds' 0.81
       (one standard bush for both, opened to the larger: estimated). The WN sheets aren't in the set: their sizes beyond the hole are estimated */
    const rJ=4.596/2,sk={f:-1,rs:2.0,ds:1.2};
    tag(mesh(P.topPlate,bushGeo(rJ,1.21/2,TT,TI,sk),M.brass2,H[1][0],0,H[1][1]),'WN-301');
    tag(mesh(P.topPlate,bushGeo(rJ,0.86/2,TT,TI,sk),M.brass2,H[38][0],0,H[38][1]),'WN-300.t38');
    tag(mesh(P.topPlate,bushGeo(rJ,0.86/2,TT,TI,sk),M.brass2,H[35][0],0,H[35][1]),'WN-300.t35');
    /* the pillar plate's bush for the centre arbor's journal (WN-302, 05 08 02 Schnitt A-B; Messinglager in the coloured section): in hole 1 (4.59 +0.012), its inner face
       0.1 +0.02 under the plate's (drawn 0.1), flush with the dial face; its oil sink there a spherical cup, Ø 3.8 × 0.55 (05 08 02's Schnitt A-B at 2:1, 4.74 px/mm, enlarged
       20×: an arc 20 px across in the bush's 24 between its lines, Ø 4.59, and 3 px deep; the section is schematic, its bore drawn 1.1 for the journal's 2.2, so the cup's
       form is likely and its size estimated; until 15 October 2026 a 90° cone Ø 3.2); bored to the journal's 1:30 (train.js's A.cw: the journal's e8 middle and 0.026,
       H7: estimated; until 15 October 2026 a straight Ø 2.205) */
    {const rb=y=>rCj(y-A.cw.ys)+0.013,S=cup(rb(PPT-0.4),3.8/2,0.55,PPT,-1);
      tag(mesh(P.pillarPlate,ringT([[rb(0.1),0.1],[rJ,0.1],[rJ,PPT],...S]),M.brass2,H[1][0],0,H[1][1]),'WN-302');}
    /* the intermediate bridge's bush WN-300 at 38 (05 08 04): in its Ø 4.3 hole, its face 0.71 (0.7 +0.02) in from the plate side under the 0.7 sink (frame.js), through to the
       dial face, a cup there (the section draws it; Wempe 3955's dial side, 3_Wempe_3955_uZ.jpg, shows it Ø 3.7 across, 17.4 px/mm by the bridge's screws 34.13 apart:
       drawn Ø 3.7, 0.9 deep, estimated); bore Ø 0.86 as the top plate's */
    tag(mesh(P.intermediateBridge,bushGeo(4.3/2,0.86/2,PPT+0.71,ZB,{f:1,rs:1.85,ds:0.9}),M.brass2,H[38][0],0,H[38][1]),'WN-300.zb');
    /* the seconds wheel's jewel at 35 in the bridge: the setting 05 05 04-2 (Fassung) in the bridge's Ø 5.2 hole from the floor of its 1.7 sink (frame.js) to the dial face,
       burnished over the jewel 05 05 04-1 (Lagerstein f. Sek.), whose face is 1.75 in (the sheet's 1.7); under it a floor with the post's hole Ø 1.1, opening in a cone to
       Ø 3.8 at the dial face (Wempe 3955's dial side shows a dark mouth Ø 3.8 in a thin brass ring there, 3_Wempe_3955_uZ.jpg at 17.4 px/mm; its depth estimated). The jewel Ø 3.6 × 1.1, scaled on the coloured section (9.4 px/mm; a pictorial section, so estimated), its hole Ø 0.78 olive for the pivot's 0.75 at the jewel; the
       setting's sheets aren't in the set: estimated */
    {const y0=PPT+1.7,yj=PPT+1.75,hj=1.1,rjw=3.6/2;
      tag(mesh(P.intermediateBridge,ringT([[1.65,y0],[5.2/2,y0],[5.2/2,ZB],[1.9,ZB],[0.55,ZB-0.75],[0.55,yj+hj],[rjw,yj+hj],[rjw,yj],[1.65,yj]]),M.brass2,H[35][0],0,H[35][1]),'050504-2');
      tag(mesh(P.intermediateBridge,stoneGeo(rjw,0.78/2,hj,'olive'),M.ruby,H[35][0],yj+hj/2,H[35][1]),'050504-1');}
    /* the pillar plate's bushes for the motion work's studs (05 08 02 Schnitt A-B): 05 08 02-2 pressed into hole 2 (3.50 +0.012) from the inner face ("Futter an dieser Seite
       eindrücken"), through the plate, and the stud (Anrichtstift lg, 05 02 00-6, in the coloured section) pressed in it, 12.3 long from the plate's inner face; the short stud
       (Anrichtstift kurz, 05 02 00-7) at hole 19 (3.50 +0.012), standing 6.8 out of the dial face, in a bush drawn dashed beside it, taken as a second 05 08 02-2 (estimated).
       The studs Ø 1.5: 05 02_1 at 5:1 draws both 18 px across (11.87 px/mm by its 12.6 between the change wheel's stud and the centre arbor, whose shank there scales its
       1.8 the same way): 1.52; the pipes that run on them bored 1.50-1.54 (05 02 02, against its figured 3.05) and 1.53-1.56 (05 02 04, against its 3.4); Wempe 3955's dial
       side shows their rounded ends Ø 1.39-1.44 (3_Wempe_3955_uZ.jpg); 05 08 02 at 2:1 (4.7 px/mm) too coarse to size them: likely (until 15 October 2026 Ø 1.3, scaled on
       05 08 02). Their ends domed, both (05 02_1: each end rounded, rising 3.5 px, 0.3 over the stud's Ø; until 15 October 2026 chamfered): likely. The bushes bored to
       them (a press fit) */
    const dS=0.3,RS=(0.75*0.75+dS*dS)/(2*dS),dome=(y,s)=>[...Array(7).keys()].map(k=>{const a=Math.asin(0.75/RS)*k/6;return[RS*Math.sin(a),y+s*RS*(1-Math.cos(a))];});
    for(const[k,len,id]of/** @type {[number,number,string][]} */([[2,12.3,'050200-6'],[19,PPT+6.8,'050200-7']])){
      tag(mesh(P.pillarPlate,bushGeo(3.506/2,1.5/2,0,PPT),M.brass2,H[k][0],0,H[k][1]),'050802-2');
      tag(mesh(P.pillarPlate,turned([...dome(0,1),...dome(len,-1).reverse()],24),M.steel,H[k][0],0,H[k][1]),id);}

    /* update(s): the escape wheel's place s.E (teeth) turns the train. The escape wheel (15 teeth) and its pinion (10 leaves) drive the seconds wheel (80): the seconds arbor
       turns once in 15 × 8 = 120 teeth, a minute; the seconds pinion (10) is driven by the intermediate wheel (80): 1/8 of the seconds'; the intermediate pinion (12) by the
       centre wheel (90): 12/90 of that, so the centre turns once in 7,200 teeth, an hour. Each mesh turns the other way: the centre clockwise from the dial (rotation.y
       falling), the intermediate anticlockwise, the seconds clockwise, the escape wheel anticlockwise (the Hamilton's directions, movement.js). Returns the angles (rotation.y
       in the movement's frame) of the centre (c), intermediate (t) and seconds (s) arbors: c for the motion work and the fusee, s for the seconds hand */
    const update=(/** @type {{E:number}} */s)=>{const a=TAU*s.E/120;R.sw.rotation.y=-a;R.tw.rotation.y=a/8;R.cw.rotation.y=-a/60;return{c:-a/60,t:a/8,s:-a};};
    return{cw:R.cw,tw:R.tw,sw:R.sw,update};}
  return{build,A,teeth,gear};   /* teeth, gear: the sheets' tooth forms, for the escape pinion (escapement.js) */
})();
