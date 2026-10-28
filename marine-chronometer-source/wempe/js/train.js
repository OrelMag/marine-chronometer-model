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
    if(o.spokes){const[n,sw,R0,R1,sw1]=o.spokes,d1=Math.asin((sw1||sw)/2/R1),d0=Math.asin(sw/2/R0);   /* sw at the hub, sw1 (if given) at the rim: straight edges between, a taper */
      for(let j=0;j<n;j++){const a0=j/n*TAU,a1=(j+1)/n*TAU,h=new THREE.Path();h.absarc(0,0,R1,a0+d1,a1-d1,false);h.absarc(0,0,R0,a1-d0,a0+d0,true);s.holes.push(h);}}
    if(o.bore){const h=new THREE.Path();if(o.bseg){for(let k=0;k<o.bseg;k++){const t=-k/o.bseg*TAU;if(k)h.lineTo(o.bore*Math.cos(t),o.bore*Math.sin(t));else h.moveTo(o.bore,0);}h.closePath();}else h.absarc(0,0,o.bore,0,TAU,true);s.holes.push(h);}   /* bseg (a multiple of 4): the bore an
       n-gon on the same angles as a lathe of n segments, so a pipe turned to the bore's radius lies on its flats exactly (the curve's 24 points left the motion work's 48- and 64-segment seats 0.02-0.03 into them until 27 October 2026) */
    const g=extrude(s,{depth:th,bevelEnabled:false,curveSegments:o.spokes?40:24});g.rotateX(-Math.PI/2);g.translate(0,-th/2,0);Object.assign(g.userData,{ro:T.ro,ri:T.ri,pl:T.xy});return g;}
  /* a turned solid from a profile [[r, y], ...] listed from one end on the axis to the other, y rising (counterclockwise in r, y, as shaftGeo's) */
  const turned=(P,seg=64)=>KIT.latheF(P.map(([r,y])=>V2(r,y)),seg);
  /* a turned ring (a bush, a setting): its profile a closed loop counterclockwise in r, y (the first point again at the end) */
  const ringT=(P,seg=48)=>KIT.latheF([...P,P[0]].map(([r,y])=>V2(r,y)),seg);
  /* a 30 deg chamfer on a shoulder (the pinion sheets' "30°"): the body's edge cut C30 across, at 30 deg to the shoulder's face; on the train side the whole shoulder is one 30° cone
     from the pivot's root to the arbor, as the three pinion sheets draw it (a flat shoulder chamfered C30 until 26 October 2026) */
  const C30=0.15,c30=C30*Math.tan(30*D2R);
  /* a train-side shoulder's 30° cone from the pivot's root r0 out to r1, ringed every 0.025 of radius: the same cone, sampled so a ray along the arbor from it meets the jewel
     where the cone does, at the hole's edge (two rings left bom.py's endshake reading the cone's rim, 0.38 up) */
  const cone30=(r0,r1)=>{const n=Math.max(1,Math.ceil((r1-r0)/0.025)),o=[];for(let i=1;i<=n;i++){const r=r0+(r1-r0)*i/n;o.push([r,(r-r0)*Math.tan(30*D2R)]);}return o;};
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
       (its "Kegel 1:?0", the digit re-inked: 1:90 read at 8x, as the seconds pinion's "Kegel 1:90" of the same years, the journal C beside it plainly 1:30: likely; 1:30
       until 25 October 2026), rounded; the arbor Ø 2.5 to the pinion, a 30° chamfer at the
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
       The wheel (05 05 03-1): z 90, m 0.355 (d 31.976, so 0.35529), tip 33.10, root 30.86, l 0.52 (the tooth on the pitch circle), 1.3 -0.1 thick at the rim (drawn 1.25, the fit's middle, as the other wheels; 1.3 until 25 October 2026), five spokes
       1.7 -0.2 wide, hub 10.6 -0.2, rim's inside 28.1 +0.2, hole 5.4 H7; its hub left the sheet's 1.5 thick and standing 0.2 proud on the dial side, turned to Ø 10 there
       (05 05 03: "0,2", "10∅"). */
    cw:{at:H[1],ys:TI+0.035,
      prof:[...piv(1.19/2,(1.19-3/90)/2,3,-1),...cone30(1.19/2,2.5/2),[2.5/2,17.225],[5.4/2,17.225],[5.4/2,18.775],[2.44/2,18.775-0.99],[3.2/2,19.03],
        [rCj(19.03),19.03],[rCj(23.03),23.03],[rSh(23.03),23.03],[rSh(29.1),29.1],[rSh(29.1)-0.24,29.1],[rSh(29.76),29.76],...crown(rSh,37.33)],
      crown:CRN,
      pin:{z:14,m:6.098/14,D:6.79-0.01,dg:4.24,u0:17.225-3.95,u1:17.225},
      wheel:{z:90,m:31.976/90,D:33.10,dg:30.86,l:0.52,mate:12,rim:[17.225,18.475],boss:[18.475,18.725,10/2],spokes:[5,1.6,10.5/2,28.2/2],bore:5.4/2}},
    /* the intermediate arbor, 05 05 02 (Zwischenrad kompl., 27.7.40): its pinion and arbor 05 05 02-2 (Zwischentrieb, Präz. Rundstahl 5,2, redrawn 6.46) and the wheel
       05 05 02-1 (Zwischenrad, Messingblech 1,2 Ms 58 federhart) riveted on it. From the train-side shoulder: the pivot Ø 0.85 -0.05 (05 05 02-2; the kompl.'s 0.82 -0.02
       of 1940 superseded), 3 -0.1 long (05 05 02; the pinion sheet's 4.6 -0.2 the blank's, pointed), tapered ("Kegel 1:?0": 1:90, as the seconds pinion redrawn with it: likely),
       rounded; the arbor Ø 2 -0.1 to the pinion, the shoulder one 30° cone; the pinion's leaves 3.3 long (the sheet's 4.6 -0.2 spans them and the seat, its 1.3 -0.1 the seat
       alone: 3.25 at the middles; the 4.5 built until 26 October 2026 read the 4.6 as the leaves' own), their end 19.25 -0.1 from the shoulder; the wheel's seat Ø 4.0 n6,
       1.3 -0.1 long, its end riveted flush with the wheel's face (drawn ending there; the spread into the sheet's Ø 7 × 0.2 not built); the collar Ø 2 -0.1 to the dial-side shoulder at 23.05 -0.1; the pivot as the other.
       The pinion: 12 leaves, not on its sheet: from the centre distance 18.12 (05 05_1, the plates' tables) and the centre wheel's module, (2 × 18.12 - 31.976)/0.35529 =
       12.0 (the transcription's inference, confirmed: no other count fits); its leaves cut to tip Ø 4.72, root Ø 2.87 (likely): the Ø 5.0 scaled on 05 05 02-2 (4.9-5.2,
       the bar 5.2) is the turned head, as on the escape pinion's sheet, which alone gives a pinion's cut figures (05 04_8: head Ø 3.13, tip D 2.97, root dg 1.6 for z 10,
       m 0.263, so the head d + 1.89 m, the tip d + 1.28 m, the root d - 3.93 m): its head here d + 1.89 m = 4.93, against the 5.0 scaled; the tip and root by the same cutter's
       proportions. Until 18 October 2026 the tip the head's 5.0 and the root 2.75 (the centre pinion's 2.13 m dedendum: estimated).
       The wheel (05 05 02-1): z 80, m 0.280 (d 22.453, so 0.28066), tip 23.33, root 21.57, l 0.40, 1.0 -0.1 thick at the rim, five spokes 1.3 -0.2, hub 7.5 -0.1, rim's
       inside 19.3 +0.2, hole 4 H7; its hub flush with the rim (05 05 02's column scans; the "0,2" and "7∅" the riveting's sink: until 26 October 2026 a hub 0.2 proud) */
    tw:{at:H[38],ys:TI+0.03,
      prof:[...piv(0.825/2,(0.825-2.95/90)/2,2.95,-1),...cone30(0.825/2,1.95/2),[1.95/2,19.2],[4.0/2,19.2],[4.0/2,20.15],[1.95/2,20.15],[1.95/2,23.0-c30],[1.95/2-C30,23.0],
        ...piv(0.825/2,(0.825-2.95/90)/2,2.95,1,23.0)],
      pin:{z:12,m:4.264/12,D:4.264+1.28*4.264/12,dg:4.264-3.93*4.264/12,u0:19.2-3.25,u1:19.2},
      wheel:{z:80,m:22.453/80,D:23.33,dg:21.57,l:0.40,mate:10,rim:[19.2,20.15],boss:null,spokes:[5,1.2,7.45/2,19.4/2],bore:4.0/2}},
    /* the seconds arbor, 05 05 01 (Sekundenrad kompl., 27.7.40): its pinion and arbor 05 05 01-2 (Sekundentrieb, Präz. Rundstahl 3,5, redrawn 6.46, revised 24.3.48) and the
       wheel 05 05 01-1 (Sekundenrad, Messingblech 1,2 Ms 58 federhart) riveted on it. From the dial-side shoulder (05 05 01-2): the pivot Ø 0.76 -0.02 at its root, 0.65 at
       its end 9.2 out ("Kegel 1:90"): its first 2 run in the jewel ("i/Steinlager einpassen", 05 05 01) and the rest is the post that carries the seconds hand through the
       dial; a collar Ø 1.55 -0.1 (a), 2.2 long (scaled on 05 05 01-2: 2.24); the pinion 7 long, its end 9.25 -0.1 from the shoulder; the wheel's seat Ø 2.6 n6, 1.2 +0.1 long;
       the arbor Ø 1.55 -0.1 (a) to the train-side shoulder at 24.1 -0.1, a 30° chamfer there; the pivot Ø 0.82 -0.02, 3 long (05 05 01: the pinion sheet's 4.5 is the
       blank's), "Kegel 1:90", rounded.
       The pinion: 10 leaves, not on its sheet: from the centre distance 12.63 and the intermediate wheel's module, (2 × 12.63 - 22.453)/0.28066 = 10.0 (the
       transcription's inference, confirmed); its leaves cut to tip Ø 3.17, root Ø 1.70 (likely): the escape pinion's proportions (05 04_8, above at the intermediate; the
       same z 10, so its tip and root scaled by the pitch diameters), the Ø 3.4 scaled on 05 05 01-2 (3.36-3.57, the bar 3.5) being the turned head (d + 1.89 m = 3.34).
       Until 18 October 2026 the tip the head's 3.4 and the root 1.61 (the centre pinion's 2.13 m: estimated).
       The wheel (05 05 01-1): z 80, m 0.263 (d 21.066, so 0.26333), tip 21.9, root 20.23, l 0.38, 1.0 ±0.03 thick at the rim, five spokes 1.3 -0.2, hub 6.5 -0.2, rim's
       inside 18.3 +0.2, hole 2.6 H7; its hub flush with the rim, its face 9.2 from the dial-side shoulder (05 05 01's 9,2 ±0,05; the "0,2" and "6∅" the riveting's: until 26 October
       2026 a hub 0.2 proud, the rim 0.2 lower, clearing the intermediate pinion's 4.5 by 0.05; its 3.25 now leaves 1.1) */
    sw:{at:H[35],ys:TI+0.025,
      prof:[...piv(0.81/2,(0.81-3/90)/2,3,-1),...cone30(0.81/2,1.5/2),[1.5/2,13.6],[2.6/2,13.6],[2.6/2,14.85],[1.5/2,14.85],[1.5/2,24.05],[0.75/2,24.05],[0.65/2,33.15],[0.65/2-0.1,33.25],[0,33.25]],
      pin:{z:10,m:2.807/10,D:2.807+1.28*2.807/10,dg:2.807-3.93*2.807/10,u0:14.85,u1:24.05-2.2},
      wheel:{z:80,m:21.066/80,D:21.9,dg:20.23,l:0.38,mate:10,rim:[13.85,14.85],boss:null,spokes:[5,1.2,6.4/2,18.4/2],bore:2.6/2}}};

  function build(mv,M,K){const{part}=K,P=K.parts,tag=(o,id,s)=>hn(o,id,s?{sub:1}:undefined);
    const R={};
    for(const[k,name,off,ids]of[['cw','centreWheel',-12,['050503-2','050503-1']],['tw','intermediateWheel',-6,['050502-2','050502-1']],['sw','secondsWheel',-33,['050501-2','050501-1']]]){
      const a=A[k],g=new THREE.Group(),pt=part(name,off);g.position.set(a.at[0],a.ys,a.at[1]);pt.add(g);
      const pin=a.pin,wh=a.wheel;
      const ar=tag(mesh(g,turned(a.prof),M.steel),ids[0]);
      const pm=tag(mesh(g,gear(teeth(pin.z,pin.m,pin.D,pin.dg),pin.u1-pin.u0),M.steel,0,(pin.u0+pin.u1)/2,0),ids[0],1);pm.userData.gear={z:pin.z,m:pin.m};
      const wm=tag(mesh(g,gear(teeth(wh.z,wh.m,wh.D,wh.dg,wh.mate,wh.l),wh.rim[1]-wh.rim[0],{spokes:wh.spokes,bore:wh.bore}),M.gilt,0,(wh.rim[0]+wh.rim[1])/2,0),ids[1]);wm.userData.gear={z:wh.z,m:wh.m};
      if(wh.boss)tag(mesh(g,ringT([[wh.bore,wh.boss[0]],[wh.boss[2],wh.boss[0]],[wh.boss[2],wh.boss[1]],[wh.bore,wh.boss[1]]]),M.gilt),ids[1],1);   /* the centre wheel's lip, 0.2 proud (05 05 03); the intermediate and seconds wheels' hubs flush with their rims (their sheets' hubs between the rims' rows: the "0,2" the riveting; 0.2 proud until 26 October 2026) */
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
       (one standard bush for both, opened to the larger: estimated). The WN sheets aren't in the set: their sizes beyond the hole are estimated. The oil sinks run out to the
       bush's rim, no flat round them: Ø 4.69, 4.46 and 4.60 at 1, 38 and 35 on Wempe 3955's top plate (12_…obere_Platte_oben, 11.52 px/mm by the bushes' places), taken Ø 4.55
       (sure that no flat shows, likely on the size; ±0.15); their depth, 1.2, estimated. Until 18 October 2026 Ø 4.0 with a 0.3 flat round it (estimated) */
    const rJ=4.596/2,sk={f:-1,rs:rJ-0.0005,ds:1.2},   /* the cup out to the bush's rim (4.55/2 until 26 October 2026 left a 0.023 sliver ring) */rv=(par,v)=>{const g=new THREE.Group();g.userData.rev=v;par.add(g);return g;};   /* rv: a group of one version's pieces (movement.js's setRev) */
    /* ================= the Soviet 6MX's electrical seconds contact (WD.CONTACT6: its sources and how sure each is) =================
       Romanov 1975 (p. 105, Figs. 100-101; p. 209): on the pillar plate's inner face a gilt base 58 carries two gilt blocks 52 (+) and 57 (−) on fibre 68 and bushes 67;
       the lever 60 on its jewelled staff 69, a flat spiral 59 (the lead from block 52's stud 53, which also returns it) holding its contact screw 54 on the disc 55 on block 57;
       the contact wheel 62, 60 ratchet teeth less one, fixed on the seconds arbor, lifts the lever's corundum stone 61 off its rest on every other beat, so the circuit opens
       for half a second each second and stays closed a second and a half at the missing tooth, at the minute. The two springs 66 in the bowl (case.js) bear on the blocks'
       outer ends. The 6MX's (Kirov No. 247's) only: the pillar plate's pieces, its wheel the seconds wheel's, its lever turned by update() */
    const C6=WD.CONTACT6,cc=Q=>KIT.area(Q)>0?Q:Q.slice().reverse(),cir=(c,r,n=32)=>cc([...Array(n).keys()].map(i=>[c[0]+r*Math.cos(i/n*TAU),c[1]+r*Math.sin(i/n*TAU)]));
    const SG=KIT.solidGeo,g6=rv(P.pillarPlate,'6mx'),_c6=(g6.userData.contact=true,g6.userData.sub='train'),cen=Q=>[Q.reduce((a,q)=>a+q[0],0)/Q.length,Q.reduce((a,q)=>a+q[1],0)/Q.length],brg2=(t,r)=>[-r*Math.sin(t*D2R),-r*Math.cos(t*D2R)];
    const yAx=new THREE.Vector3(0,1,0),hor=(m,d)=>{m.quaternion.setFromUnitVectors(yAx,new THREE.Vector3(d[0],0,d[1]).normalize());return m;};
    /* the cock's foot: its screw 2 past its middle toward its far end, clear of the leg at the arm's root, its pins 2.2 either side across it (estimated) */
    const fs=cen(C6.cockFoot),fA=C6.cockFoot[1],fB=C6.cockFoot[0],fl=Math.hypot(fB[0]-fA[0],fB[1]-fA[1]),fu=[(fB[0]-fA[0])/fl,(fB[1]-fA[1])/fl],fv=[-fu[1],fu[0]],fc=[fs[0]+2*fu[0],fs[1]+2*fu[1]],fp=[fc[0]+2.2*fv[0],fc[1]+2.2*fv[1]],fq=[fc[0]-2.2*fv[0],fc[1]-2.2*fv[1]];
    {const B=[...C6.bsP,...C6.bsM];
      /* the base: its screws' clearance, the block screws' M1.4, the staff's setting, the cock's screw M1.4 and pins Ø 0.8 1 deep */
      tag(mesh(g6,SG([{loop:cc(C6.base),y0:-2,y1:0,F:[...C6.screws56.map(q=>({p:cir(q,0.95),a:-2,b:0})),...B.map(q=>({p:cir(q,0.72),a:-2,b:0})),{p:cir(C6.staff,1.5,40),a:-2,b:0},{p:cir(fc,0.72),a:-2,b:0},
        ...[fp,fq].map(q=>({p:cir(q,0.4,20),a:-2,b:-1}))]}]),M.gilt),'6MX.ct');
      for(const[O,BS,id]of/** @type {[number[][],number[][],string][]} */([[C6.blkP,C6.bsP,'6MX.ctbp'],[C6.blkM,C6.bsM,'6MX.ctbm']])){
        tag(mesh(g6,SG([{loop:cc(O),y0:-3.8,y1:-2,F:BS.map(q=>({p:cir(q,1.15),a:-3.8,b:-2}))}]),M.packing),'6MX.ctf');   /* the fibre under it, black (10_Kirow_247_E-Kontakt_1.jpg) */
        tag(mesh(g6,SG([{loop:cc(O),y0:-5.25,y1:-3.8,F:BS.map(q=>({p:cir(q,1.15),a:-5.25,b:-3.8}))}]),M.gilt),id);}
      for(const q of B){tag(mesh(g6,ringT([[0.75,-6.2],[2.3,-6.2],[2.3,-5.25],[1.15,-5.25],[1.15,-2],[0.75,-2]]),M.packing,q[0],0,q[1]),'6MX.ctu');   /* the insulating bush 67, its flange black */
        tag(K.screw(g6,q[0],q[1],-6.2,1.55,2.6,6.2,0.7,M.steel),'6MX.cts');}   /* a block screw, into the base */
      for(const q of C6.screws56)tag(K.screw(g6,q[0],q[1],-2,1.5,1.2,2+PPT,0.85,M.steel),'6MX.ctm');}   /* the base's screws 56, through the pillar plate, their ends flush on the dial side */
    /* the contact disc 55 upright in its radial plane, gilt with a straight knurl, 48 square teeth 0.25 deep (10_Kirow_247_E-Kontakt_1.jpg, 14_E-Kontakt1.jpg: square, the
       depth estimated), its face on the low side recessed Ø 6.0 (the photograph's 6.1 at the disc's 11.9) 0.3 deep (estimated), a slotted steel axle screw in it, head
       Ø 2.6 (the photograph, through the m6_contact camera: likely); until 18 October 2026 a sawtooth knurl and a raised brass boss Ø 5.4. Its bracket on block 57 (Romanov:
       the disc fixed to block 57); the contact screw 54 brass, as there */
    {const D=C6.disc,t=[-Math.cos(D.th*D2R),Math.sin(D.th*D2R)],c=brg2(D.th,D.r),at=k=>[c[0]+t[0]*k,c[1]+t[1]*k],RC=3.0,RD=0.3;
      const dk=hor(tag(mesh(g6,gear({xy:[...Array(192).keys()].map(i=>{const n=Math.floor(i/4),k=i%4,r=k<2?D.d/2:D.d/2-0.25,f=(n+(k===1||k===2?0.5:k===3?1:0))/48*TAU-(k===3?1e-4:0);return[r*Math.cos(f),r*Math.sin(f)];}),ro:D.d/2,ri:D.d/2-0.25},D.t,{bore:RC}),M.gilt,c[0],D.y,c[1]),'6MX.ctd'),t);
      let q=at(RD/2);fuse([dk,hor(tag(mesh(g6,new THREE.CylinderGeometry(RC,RC,D.t-RD,48),M.gilt,q[0],D.y,q[1]),'6MX.ctd',1),t)]);   /* the disc and its centre one mesh (fuse, core.js): their faces ran flush, a ring in Edges until 21 October 2026. The centre fills the bore's own 48 corners (r RC: 0.002 over it until 24 October 2026, 0.035 mm³ weighed twice, overlaps.py) */   /* the centre, its face RD under the rim's */
      q=at(-D.t/2+RD);const sh=new THREE.Group();sh.position.set(q[0],D.y,q[1]);hor(sh,t);g6.add(sh);tag(K.screw(sh,0,0,0,1.3,0.8,0,0.5,M.steel),'6MX.ctd',1).userData.lift=0;
      q=at(D.t/2+0.5);const br=tag(mesh(g6,new THREE.BoxGeometry(1.0,5.05,4.0),M.gilt,q[0],(-5.25-10.3)/2,q[1]),'6MX.ctd',1);br.rotation.y=Math.atan2(-t[1],t[0]);}
    /* the staff 69 (steel, its pivots Ø 0.4) in its jewels: the upper in a gilt setting in the base, the lower in the cock's arm under a cap plate, each a hole jewel and a cap
       jewel (the TU's 20 jewels with the contact, 15 without: these four and the stone) */
    /* C6LB: the lever's boss on the staff, just under the spiral's collet: on Kirov 2973 (14_E-Kontakt1.jpg) and 24020 (12_KirPol_24020_E-Kontakt2.jpg) the boss sits on the
       staff right under the collet (0.1-0.3 of gap at the scale of the cock's arm, 16.7 px a mm on 24020), the staff bare under it, and its arm runs down from it to the screw's
       holder on block 52 (likely; Kirov 247's own is hidden behind the stud and holder on 10_Kirow_247_E-Kontakt_1.jpg). The stone arm runs down the same way to the contact
       wheel (estimated: no photograph shows it). Until 24 October 2026 the boss and both arms flat at -6.1 to -7.4, 4.5 under the spiral */
    const C6LB=[-10.2,-11.5];
    const C6L=new THREE.Group();C6L.position.set(C6.staff[0],0,C6.staff[1]);g6.add(C6L);   /* the lever, staff and spiral's collet turn together (update(): C6L) */
    /* in the Exploded view the lever (its stone level with the contact wheel's teeth), its staff and spiral leave before the seconds wheel, 38 up, and the cock over them
       first, 43.5 with its cap plate's screws in it (1.0 under the top plate at full spread); the base, blocks and disc stay on the pillar plate under the train */
    const gCk=new THREE.Group(),gSp=new THREE.Group();g6.add(gCk,gSp);K.loose(C6L,38);K.loose(gCk,43.5);K.loose(gSp,38);
    /* heights (18 October 2026): the cock's arm -12.9 to -14.2, its cap plate to -14.7, the spiral at -11.7 to -12.3 under it, read on 10_Kirow_247_E-Kontakt_1.jpg against
       a millimetre scale stood at the staff through photocompare.py's m6_contact camera (0.6 mm residuals at the block screws; the arm's front edge -12.9 to -14.2, the
       spiral's collet -11.9 to -12.7: likely); until then the arm -11 to -13.2 and the spiral -8.5 to -9.1 (Fig. 101: estimate) */
    /* the staff: Ø 1.0 from the cock down to the lever's boss, Ø 0.6 under it to the base (12_KirPol_24020_E-Kontakt2.jpg and 14_E-Kontakt1.jpg, Kirov 2973: bare steel under the
       boss, 8-11 px across against the block screws' Ø 3.1 at 23-26 px a mm, a little further off, so Ø 0.4-0.6, and about 0.8 above it: likely; Ø 1.0 the whole way until
       24 October 2026) */
    {const S=C6.staff,CA=[-12.9,-14.2],CP=-14.7;tag(mesh(C6L,turned([[0,CA[1]+0.02],[0.2,CA[1]+0.02],[0.2,CA[1]+0.6],[0.5,CA[1]+0.8],[0.5,C6LB[0]],[0.3,C6LB[0]],[0.3,-2.6],[0.2,-2.4],[0.2,-1.42],[0,-1.42]],24),M.steel),'6MX.ctst');   /* its upper pivot through its hole jewel to 0.02 off the cap jewel, as the lower (until 24 October 2026 it ended at -1.9, 0.1 into the stone, the staff 0.52 loose between its cap jewels) */
      tag(mesh(g6,ringT([[0.9,-2],[1.5,-2],[1.5,0],[0.9,0]],40),M.gilt,S[0],0,S[1]),'6MX.ctjs');   /* the upper jewels' setting in the base */
      tag(mesh(g6,ringT([[0.21,-2],[0.9,-2],[0.9,-1.4],[0.21,-1.4]],32),M.ruby,S[0],0,S[1]),'6MX.ctju');
      tag(mesh(g6,turned([[0,-1.4],[0.9,-1.4],[0.9,-1.0],[0,-1.0]],32),M.ruby,S[0],0,S[1]),'6MX.ctjeu');
      tag(mesh(gCk,ringT([[0.21,CA[1]],[0.9,CA[1]],[0.9,CA[1]+0.6],[0.21,CA[1]+0.6]],32),M.ruby,S[0],0,S[1]),'6MX.ctjl');
      tag(mesh(gCk,turned([[0,CA[1]-0.4],[0.9,CA[1]-0.4],[0.9,CA[1]],[0,CA[1]]],32),M.ruby,S[0],0,S[1]),'6MX.ctjel');
      /* the cock: its foot on the base, a leg 1.5 × 5 at the arm's root, its arm 1.3 thick over the spiral, the cap plate and its two screws on the arm's end. The screws
         and the jewel in a row (10_Kirow_247_E-Kontakt_1.jpg and 14_E-Kontakt1.jpg, both cameras: the screws 2.0 and 2.1 either side of the jewel across the view, along
         (-0.97, 0.24) as triangulated, the depth loose: likely), 2.1 from the staff; the arm's end rounded r 1.6 about the far screw (the photographs: its end 1.4 past
         that screw across the view), the cap plate the screws' and the jewel's lobes (r 1.25, 1.5) joined. Until 18 October 2026 the screws 75° either side of the arm's axis
         on a round cap plate Ø 6 */
      const A0=C6.cockArm[0],A1=C6.cockArm[C6.cockArm.length-1],al=Math.hypot(A1[0]-A0[0],A1[1]-A0[1]),u=[(A1[0]-A0[0])/al,(A1[1]-A0[1])/al],nv=[-u[1],u[0]],cA=cen(C6.cockArm),sg=Math.sign((cA[0]-A0[0])*nv[0]+(cA[1]-A0[1])*nv[1]),
        P4=(a,b)=>[A0[0]+u[0]*a+nv[0]*sg*b,A0[1]+u[1]*a+nv[1]*sg*b],leg=cc([P4(0.5,0),P4(5.5,0),P4(5.5,1.5),P4(0.5,1.5)]),su=[-0.972,0.236],cs=[-2.1,2.1].map(k=>[S[0]+su[0]*k,S[1]+su[1]*k]);
      const armL=KIT.bool(cc(C6.cockArm),cir(cs[1],1.6,40)).uni[0],capL=KIT.bool(KIT.bool(cir(S,1.5,40),cir(cs[0],1.25,32)).uni[0],cir(cs[1],1.25,32)).uni[0];
      fuse([tag(mesh(gCk,SG([{loop:cc(C6.cockFoot),y0:-3.5,y1:-2,F:[{p:cir(fc,0.72),a:-3.5,b:-2},...[fp,fq].map(q=>({p:cir(q,0.4,20),a:-3.5,b:-2}))]}]),M.gilt),'6MX.ctc'),
      tag(mesh(gCk,SG([{loop:leg,y0:CA[0],y1:-3.5}]),M.gilt),'6MX.ctc',1),
      tag(mesh(gCk,SG([{loop:cc(armL),y0:CA[1],y1:CA[0],F:[{p:cir(S,0.9,40),a:CA[1],b:CA[0]},...cs.map(q=>({th:{rs:0.45},p:cir(q,0.47,32),a:CA[1],b:CA[1]+1.1}))]}]),M.gilt),'6MX.ctc',1)]);   /* the cock's foot, leg and arm one piece, one mesh (fuse); the cap plate's screws tapped M0.9 into the arm (bom.json's "tap"), 0.02 over the thread as the Wempe's other tapped holes (until 27 October 2026 plain Ø 1.0, the screws loose in both: seatcheck.py) */
      tag(mesh(gCk,SG([{loop:cc(capL),y0:CP,y1:CA[1],F:[{p:cir(S,0.9,40),a:CP,b:CA[1]},...cs.map(q=>({p:cir(q,0.5,20),a:CP,b:CA[1]}))]}]),M.gilt),'6MX.ctcc');
      for(const q of cs)tag(K.screw(gCk,q[0],q[1],CP,1.2,0.8,1.6,0.45,M.steel),'6MX.ctccs').userData.lift=0;
      tag(K.screw(gCk,fc[0],fc[1],-3.5,1.4,1.0,3.0,0.7,M.steel),'6MX.ctcs');
      for(const q of[fp,fq])tag(cylBetween(gCk,0.4,-3.5,-1.0,M.steel,q[0],q[1],16),'6MX.ctcp');
      /* the spiral 59 (copper colour, 0.6 high × 0.1, 7 turns from its collet Ø 3.8 to Ø 8.9, then straight out over the stud 53 and down into its top, beside its clamp
         screw: the photograph's wire drops from the spiral into the stud's notch, 10_Kirow_247_E-Kontakt_1.jpg), the stud and its clamp screw (head Ø 2.2, the photograph's 2.2:
         likely; 2.8 until 18 October 2026) */
      const st=cen(C6.stud),phE=Math.atan2(st[1]-S[1],st[0]-S[0]),N=7,ri=1.96,ro=4.45,cl=[];for(let i=0;i<=N*72;i++){const f=i/(N*72),ph=phE-TAU*N*(1-f);cl.push([S[0]+(ri+(ro-ri)*f)*Math.cos(ph),S[1]+(ri+(ro-ri)*f)*Math.sin(ph)]);}
      const dS=Math.hypot(st[0]-S[0],st[1]-S[1])-1.25;for(let k=1;k<=8;k++){const r=ro+(dS-ro)*k/8;cl.push([S[0]+r*Math.cos(phE),S[1]+r*Math.sin(phE)]);}
      const off=(i,s2)=>{const a=cl[Math.max(0,i-1)],b=cl[Math.min(cl.length-1,i+1)],l=Math.hypot(b[0]-a[0],b[1]-a[1]);return[cl[i][0]-(b[1]-a[1])/l*0.05*s2,cl[i][1]+(b[0]-a[0])/l*0.05*s2];};
      const SY=[-12.3,-11.7],eP=cl[cl.length-1],eT=[Math.cos(phE),Math.sin(phE)],eN=[-eT[1]*0.05,eT[0]*0.05];
      fuse([tag(mesh(gSp,SG([{loop:cc([...cl.map((_,i)=>off(i,1)),...cl.map((_,i)=>off(i,-1)).reverse()]),y0:SY[0],y1:SY[1]}]),M.copper),'6MX.cth'),
      tag(mesh(gSp,SG([{loop:cc([[eP[0]+eN[0]-eT[0]*0.3,eP[1]+eN[1]-eT[1]*0.3],[eP[0]+eN[0],eP[1]+eN[1]],[eP[0]-eN[0],eP[1]-eN[1]],[eP[0]-eN[0]-eT[0]*0.3,eP[1]-eN[1]-eT[1]*0.3]]),y0:SY[1],y1:-9.87}]),M.copper),'6MX.cth',1)]);   /* its end bent down onto the stud's top (clamped there: drawn 0.02 clear) */
      tag(mesh(C6L,ringT([[0.5,SY[0]-0.1],[1.9,SY[0]-0.1],[1.9,SY[1]+0.1],[0.5,SY[1]+0.1]],40),M.brass),'6MX.cth',1);
      tag(mesh(g6,SG([{loop:cc(C6.stud),y0:-9.85,y1:-5.25,F:[{p:cir(st,0.6),a:-9.85,b:-7.85}]}]),M.gilt),'6MX.ctq');
      tag(K.screw(g6,st[0],st[1],-9.85,1.1,1.0,2.0,0.6,M.steel),'6MX.ctqs');}
    /* the lever 60 pressed on the staff (its boss Ø 3, arms 1.1 wide, −6.1 to −7.4), its stone 61 (0.8 × 1.0 × 3, its acting corner 9.7 from the seconds arbor), the screw 54
       in the holder at its other end with a lock nut: in a group about the staff, which update() turns (C6L) */
    {const S=C6.staff,loc=q=>[q[0]-S[0],q[1]-S[1]],arm=(e,w)=>{const l=Math.hypot(e[0],e[1]),n=[-e[1]/l*w/2,e[0]/l*w/2];return cc([[n[0],n[1]],[e[0]+n[0],e[1]+n[1]],[e[0]-n[0],e[1]-n[1]],[-n[0],-n[1]]]);};
      const eS=loc(C6.stone),eH=loc(C6.screw54.h),eT=loc(C6.screw54.tip);
      tag(mesh(C6L,ringT([[0.5,C6LB[1]],[1.5,C6LB[1]],[1.5,C6LB[0]],[0.5,C6LB[0]]],40),M.steel),'6MX.ctl');
      const SA=[0,23],sl0=Math.hypot(C6.stone[0]-SA[0],C6.stone[1]-SA[1]),rd=[(C6.stone[0]-SA[0])/sl0,(C6.stone[1]-SA[1])/sl0],sc=loc([SA[0]+rd[0]*11.2,SA[1]+rd[1]*11.2]);
      const eA=[sc[0]-rd[1]*0.5,sc[1]+rd[0]*0.5];   /* the stone arm ends against the stone's side, at its middle, outside the wheel's tips: the stone set in the lever's end */
      /* each arm drawn flat at its end's height (-7.4 to -6.1), then sheared so it rises along its length to the boss's (C6LB): a linear shear, so its faces stay planar and the
         solid closed */
      const shear=(g,e)=>{const l=Math.hypot(e[0],e[1]),u=[e[0]/l,e[1]/l],k=C6LB[0]+C6LB[1]-(-7.4-6.1),ps=g.attributes.position;
        for(let i=0;i<ps.count;i++){const t=Math.max(0,Math.min(1,(ps.getX(i)*u[0]+ps.getZ(i)*u[1])/l));ps.setY(i,ps.getY(i)+k/2*(1-t));}ps.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();return g;};
      const lvA=[eA,eH].map(e=>tag(mesh(C6L,shear(SG([{loop:arm(e,1.1),y0:-7.4,y1:-6.1}]),e),M.gilt),'6MX.ctl',1));   /* gilt (14_E-Kontakt1.jpg: likely; steel until 18 October 2026) */
      /* the screw's holder: a gilt block under the lever's end, down past the screw's axis (-5.2: dims.js), 1.6 along the screw and 1.8 across (14_E-Kontakt1.jpg: about
         1.0 × 1.4 by its rough camera: estimated), its foot 0.05 over block 52's top; until 18 October 2026 a steel collar at the lever's height */
      {const d=[C6.screw54.tip[0]-C6.screw54.h[0],C6.screw54.tip[1]-C6.screw54.h[1]],y0=-7.4,y1=-5.3,hb=tag(mesh(C6L,new THREE.BoxGeometry(1.6,y1-y0,1.8),M.gilt,eH[0],(y0+y1)/2,eH[1]),'6MX.ctl',1);hb.rotation.y=-Math.atan2(d[1],d[0]);fuse([...lvA,hb]);}   /* the lever's two arms and the holder one gilt piece, one mesh (fuse): flush faces drew lines in Edges until 21 October 2026 */
      {const tn=[-rd[1],rd[0]],R0=9.7-11.2,Q=(a,b)=>[sc[0]+rd[0]*a+tn[0]*b,sc[1]+rd[1]*a+tn[1]*b];   /* the stone along the radius from the arbor, 0.8 wide, its end chamfered to 0.3 over 0.6 (Romanov: 'the bevel of stone 61') */
        tag(mesh(C6L,SG([{loop:cc([Q(R0,-0.15),Q(R0,0.15),Q(R0+0.6,0.4),Q(1.5,0.4),Q(1.5,-0.4),Q(R0+0.6,-0.4)]),y0:-7.4,y1:-6.4}]),M.ruby),'6MX.ctp');}
      const sd=[eT[0]-eH[0],eT[1]-eH[1]],sl=Math.hypot(sd[0],sd[1]),su=[sd[0]/sl,sd[1]/sl],sp=k=>[eH[0]+su[0]*k,eH[1]+su[1]*k];
      /* the screw threaded along its length (turned grooves, pitch 0.25: 10_Kirow_247_E-Kontakt_1.jpg's thread, its pitch estimated), its point coned; the lock nut brass (the photographs) */
      const rS=C6.screw54.d/2,pt=0.25,dp=0.06,pr=[[0,-sl/2],[rS-dp,-sl/2]];for(let y=-sl/2+pt/2;y<sl/2-0.6;y+=pt)pr.push([rS,y],[rS-dp,y+pt/2]);pr.push([rS,sl/2-0.6],[rS,sl/2-0.3],[0.08,sl/2],[0,sl/2]);
      let q=sp(sl/2);hor(tag(mesh(C6L,turned(pr,20),M.brass,q[0],C6.screw54.y,q[1]),'6MX.ctk'),su);
      q=sp(1.1);hor(tag(mesh(C6L,new THREE.CylinderGeometry(0.55,0.55,0.5,6),M.brass,q[0],C6.screw54.y,q[1]),'6MX.ctn'),su);}   /* the nut 1.1 across corners, 0.5 long (14_E-Kontakt1.jpg: 0.5-0.8 across by its rough camera: estimated), 0.05 over block 52 */
    /* its turn: the stone's lift off its rest as the wheel carries a tooth's slope under it (the stone's place on the wheel's teeth, s = a + c0 in degrees: the slope from the
       root, r 9.3, at 0 to the tip, 10.2, at 55 % of the 6° pitch, then the radial face), less the 0.4 it rests above the root while the screw is on the disc; the missing
       tooth (59) lifts nothing. The stone moves out from the arbor by C6K a radian of the lever; the teeth under its whole 0.3-wide end count */
    const C6K=(()=>{const a=[C6.stone[0]-C6.staff[0],C6.stone[1]-C6.staff[1]],l=Math.hypot(a[0],a[1]),q=[C6.stone[0],C6.stone[1]-23],r=Math.hypot(q[0],q[1]);return Math.abs((-a[1]*q[0]+a[0]*q[1])/(l*r))*l;})();   /* the stone's move out from the arbor for a radian of the lever (its arm's length times its arc's share along the radius) */
    const C6T=n=>n!==59,c6r=aD=>{const s2=((aD%360)+360)%360,n=Math.floor(s2/6),f=(s2-6*n)/6;return C6T(n)&&f<0.55?9.3+0.9*f/0.55:9.3;},
      c6lift=aD=>{let L=0;for(let k=-30;k<=30;k++){const w=0.4*k/30,sf=9.7+2.4*Math.max(0,Math.abs(w)-0.15);L=Math.max(L,c6r(aD+w/9.7/D2R)-sf+0.08);}return L/C6K;};   /* the teeth under the stone's whole end (0.3 wide, its chamfers rising 0.6 over 0.25 each side) kept 0.08 clear (the train's mesh play moves the wheel a little off the escape wheel's ratio) */
    /* the contact wheel 62: in the seconds arbor's frame (u from its shoulder), riveted on its gilt collet; its teeth's slopes rise the way the stone runs along them (s up) */
    {const W6=C6.wheel,rt=W6.tip/2,rr=W6.root/2,c0=10.6,xy=[],P2=(r,d)=>[r*Math.cos(d*D2R),r*Math.sin(d*D2R)];
      for(let n=0;n<60;n++){const c=c0+6*n;if(C6T(n)){xy.push(P2(rr,c));for(let k=1;k<=6;k++)xy.push(P2(rr+(rt-rr)*k/6,c+3.3*k/6));xy.push(P2(rr,c+3.3+0.02));for(let k=1;k<4;k++)xy.push(P2(rr,c+3.3+2.7*k/4));}
        else for(let k=0;k<8;k++)xy.push(P2(rr,c+6*k/8));}
      const yu=y=>y-(TI+0.025),u0=yu(W6.y[1]),u1=yu(W6.y[0]),cu0=yu(W6.colY[1]),cu1=yu(W6.colY[0]),g=rv(R.sw,'6mx');g.userData.contact=true;
      tag(mesh(g,gear({xy,ro:rt,ri:rr},u1-u0,{spokes:[W6.spokes,1.0,2.3,W6.rim/2],bore:W6.collet/2}),M.gilt,0,(u0+u1)/2,0),'6MX.cw');
      tag(mesh(g,ringT([[1.5/2+0.001,cu0],[W6.collet/2,cu0],[W6.collet/2,cu1],[1.5/2+0.001,cu1]]),M.gilt),'6MX.cw',1);}
    R.c6={lever:C6L,lift:c6lift};
    /* the 6MX's seconds wheel rises 30.6, not 33: its contact wheel stands 1.35 under the lower cock's deep part and lug, which rise 29.9 (exploded.py's 0.5 kept) */
    mv.userData.onRev.push(Object.assign(v=>{P.secondsWheel.userData.off=v==='6mx'?-30.6:-33;P.intermediateWheel.userData.off=v==='6mx'?9:-6;},{sub:'train'}));   /* and its intermediate wheel leaves toward the dial after its bridge (+18), as a watchmaker takes it out, since the contact's base overhangs the plate's window it would rise through */
    tag(mesh(P.topPlate,bushGeo(rJ,1.21/2,TT,TI,sk),M.brass2,H[1][0],0,H[1][1]),'WN-301');
    {const g=rv(P.topPlate,'last first 1943');g.userData.sub='train';tag(mesh(g,bushGeo(rJ,0.845/2,TT,TI,sk),M.brass2,H[38][0],0,H[38][1]),'WN-300.t38');tag(mesh(g,bushGeo(rJ,0.83/2,TT,TI,sk),M.brass2,H[35][0],0,H[35][1]),'WN-300.t35');}   /* each bored 0.02 over its pivot (the intermediate's 0.825, the seconds' 0.81), 05 05_1's "Lagerstellen: Enger Laufsitz", as WN-301's 1.21 on the centre's 1.19; both 0.86 until 25 October 2026 (the seconds pivot 0.05 clear) */
    /* the Soviet 6MX's jewels in chatons (the Variants' third version): Altmeppen's list: the seconds and intermediate wheels in jewels in chatons, not brass bearings; the TU's 15
       jewels are the drawings' 12 and these three. Kirov No. 247's top plate (2_Kirow_247_A.jpg, 8.97 px/mm) shows at 35 and 38 a flush gilt setting about Ø 4.1 (±0.3), the
       pivot in its middle, no screws; its dial side (3_Kirow_247_uZ.jpg) the same at 38 in the intermediate bridge (the seconds arbor's lower jewel there as drawn). Each chaton
       is taken to fill the bush's hole (4.59 in the plate, 4.3 in the bridge: likely), the stone flush with the face the arbor's shoulder bears on, as the bush's face is, so the
       endshake stays the drawings' (likely); the stone Ø 2.2 × 0.6, its hole olive, the pivot's and 0.025, and the oil sink a cone from Ø 3.4 at the outer face to the lip
       over the stone, Ø 1.2 (estimated: the photographs show the settings' faces only) */
    {const g=rv(P.topPlate,'6mx'),_s=(g.userData.sub='train'),rw=1.1,hj=0.6,rl=0.6,rs=1.7,ch=ringT([[rs,TT],[rJ,TT],[rJ,TI],[rw,TI],[rw,TI-hj],[rl,TI-hj]]);   /* the chaton from the outer face (TT) to the inner (TI), the stone in its inner end */
      for(const[k,pv,u]of/** @type {[number,number,string][]} */([[38,0.825,'38u'],[35,0.81,'35u']])){tag(mesh(g,ch,M.gilt,H[k][0],0,H[k][1]),'6MX.ch'+u);
        tag(mesh(g,stoneGeo(rw,(pv+0.025)/2,hj,'olive'),M.ruby,H[k][0],TI-hj/2,H[k][1]),'6MX.jw'+u);}}
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
    tag(mesh(rv(P.intermediateBridge,'last first 1943'),bushGeo(4.3/2,0.86/2,PPT+0.71,ZB,{f:1,rs:1.85,ds:0.9}),M.brass2,H[38][0],0,H[38][1]),'WN-300.zb');
    /* the 6MX's chaton there (above): the stone flush with the bush's plate-side face (PPT+0.71), the sink toward the dial face */
    {const g=rv(P.intermediateBridge,'6mx'),y0=PPT+0.71,rw=1.1,hj=0.6;tag(mesh(g,ringT([[rw,y0],[4.3/2,y0],[4.3/2,ZB],[1.7,ZB],[0.6,y0+hj],[rw,y0+hj]]),M.gilt,H[38][0],0,H[38][1]),'6MX.ch38l');
      tag(mesh(g,stoneGeo(rw,(0.825+0.025)/2,hj,'olive'),M.ruby,H[38][0],y0+hj/2,H[38][1]),'6MX.jw38l');}
    /* the seconds wheel's jewel at 35 in the bridge: the setting 05 05 04-2 (Fassung) in the bridge's Ø 5.2 hole (frame.js), a tube the bridge's full thickness but its top 0.2
       under the plate side's face, its bore Ø 3.7 open from there down to the jewel 05 05 04-1 (Lagerstein f. Sek.), whose face is 1.75 in (the sheet's 1.7), and under the jewel
       a straight recess Ø 3.7 to the dial face (05 08 04's section, measured at 6.9 px/mm by its 3.8: the hatched walls from 0.2 to 3.8, Ø 5.3 outside, Ø 3.77 inside, the
       jewel's faces 1.85-1.9 and 3.0 in, the recess 0.75; likely). It holds the jewel in a seat Ø 3.6 its height, burnished over it (the section's walls bow in there).
       Wempe 3955's dial side shows a dark mouth Ø 3.8 in a thin brass ring Ø 4.8 there (3_Wempe_3955_uZ.jpg, 8.4 px/mm by the plate's 85), the jewel deep in it. Until 15 October
       2026 the setting began at the floor of a Ø 6.2 × 1.7 sink in the bridge and closed under the jewel to the post's Ø 1.1, opening in a cone to Ø 3.8 at the dial face
       (estimated: the section draws neither). The jewel Ø 3.6 × 1.1, scaled on the coloured section (9.4 px/mm; a pictorial section, so estimated; 05 08 04 draws it about 1.15),
       its hole Ø 0.78 olive for the pivot's 0.75 at the jewel; the setting's sheets aren't in the set. Its form the section's (traced on its red, 18 October 2026, ±0.1): flat
       on the arbor's side, where the shoulder runs, an oil sink in its dial face, a cone from the hole to Ø 1.7 0.6 deep (until 18 October 2026 a plain disc) */
    {const y0=PPT+0.2,yj=PPT+1.75,hj=1.1,rjw=3.6/2;
      tag(mesh(P.intermediateBridge,ringT([[3.7/2,y0],[5.2/2,y0],[5.2/2,ZB],[3.7/2,ZB],[3.7/2,yj+hj],[rjw,yj+hj],[rjw,yj],[3.7/2,yj]]),M.brass2,H[35][0],0,H[35][1]),'050504-2');
      let q=KIT.jewelPr(rjw,hj,0.78/2,0.001,0.85,0.6,yj,1);if(KIT.area([...q,q[0]])<0)q=q.slice().reverse();   /* flat (domed 0.001) toward the arbor */
      tag(mesh(P.intermediateBridge,ringT(q,32),M.ruby,H[35][0],0,H[35][1]),'050504-1');}
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
    /* the hand-setting pinion's bush in 18 (Zeigerstelltrieb, reamed 3.50 +0.012, as 2 and 19): 05 08 02 draws a bush there (a ring and its bore, unnamed); Wempe 3955 has it,
       the only part of the hand-setting work fitted (3_Wempe_3955_uZ.jpg, 8.52 px/mm by the plate's holes: its rim Ø 3.46 flush with the dial face, its bore 1.29 with a bright
       sink to 1.64; flush with the inner face on 6_Wempe_3955_S.jpg): bore and sink as measured, a 90° cone (likely); empty, as on Wempe 3955 */
    tag(mesh(rv(P.pillarPlate,'last first 1943'),bushGeo(3.506/2,1.3/2,0,PPT,{f:1,rs:1.64/2,cone:true}),M.brass2,H[18][0],0,H[18][1]),'WN-hs');   /* not in the 6MX (no hand-setting cut: frame.js) */

    /* update(s): the escape wheel's place s.E (teeth) turns the train. The escape wheel (15 teeth) and its pinion (10 leaves) drive the seconds wheel (80): the seconds arbor
       turns once in 15 × 8 = 120 teeth, a minute; the seconds pinion (10) is driven by the intermediate wheel (80): 1/8 of the seconds'; the intermediate pinion (12) by the
       centre wheel (90): 12/90 of that, so the centre turns once in 7,200 teeth, an hour. Each mesh turns the other way: the centre clockwise from the dial (rotation.y
       falling), the intermediate anticlockwise, the seconds clockwise, the escape wheel anticlockwise (the Hamilton's directions, movement.js). Returns the angles (rotation.y
       in the movement's frame) of the centre (c), intermediate (t) and seconds (s) arbors: c for the motion work and the fusee, s for the seconds hand */
    const update=(/** @type {{E:number}} */s)=>{const a=TAU*s.E/120;R.sw.rotation.y=-a;R.tw.rotation.y=a/8;R.cw.rotation.y=-a/60;R.c6.lever.rotation.y=-R.c6.lift(a/D2R);   /* the 6MX's contact lever, as the contact wheel lifts its stone */return{c:-a/60,t:a/8,s:-a};};
    return{cw:R.cw,tw:R.tw,sw:R.sw,update};}
  return{build,A,teeth,gear};   /* teeth, gear: the sheets' tooth forms, for the escape pinion (escapement.js) */
})();
