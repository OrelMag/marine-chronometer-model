// The Wempe's hairspring (Node.js, no browser): the helical spring as its sheets draw it (WESC.HSP and WESC.HSL in ../../wempe/js/escapement.js, loaded by
// wempe_load.js: 05 03_6's strip and coil, 05 03_7's terminal curve at both ends, the whole strip 13 turns less 3.5 mm), checked as tools/hairspring.js and
// hairspring-fe.js check the Hamilton's (HSPR, ../../shared/hairspring.js):
//   1. the length: each reading of 05 03_7's "auf 13 Umgänge −3,5 mm kürzen" and the coil as wound, its period with the weighed balance, where it puts the two
//      pinning points in plan (05 03_1 and 05 03_5 draw them together) and how high its helix stands (05 03_5: 9.5 between the curves);
//   2. 05 03_7's curve: the two compass centres marked inside it (the arcs it is drawn with), and Phillips' two conditions (the centroid on the perpendicular to the
//      junction's radius, at R²/l from the staff) for the inner curve and the outer as drawn; the curve that meets them to the same pin, for comparison;
//   3. the force the drawn spring leaves on the pivots under a couple (HSPR.lateral), as drawn and with its helix's turns varied (the two curves' errors cancel
//      when the helix between them is a whole number of turns), and with both ends designed;
//   4. at large swings, the drawn spring as an elastica (HSPR.large) and as co-rotational beam elements (hairspring-fe.js's fe): the couple, the force on the
//      pivots, and the rate the swing gives (its isochronism) over the model's swing and the 1954 instruction's 225-270°; with the escapement's over the wind.
// Exits 1 if a solver fails (the elastica, the beam elements, the period's integration, a designed curve), or the two methods part, or the drawn spring's
// isochronism is not what the model runs with (WESC.SET.HS). The drawn curves' force on the pivots is reported, not failed: they miss Phillips' second
// condition, which no change of the model can make them meet without leaving the sheet (README, Physics: hairspring and temperature). About 30 s.
//   node wempe_hairspring.js
const fs=require('fs'),path=require('path'),W=require('./wempe_load.js')(),{HSPR}=require('../../shared/hairspring.js'),{fe}=require('./hairspring-fe.js');
const{WESC,WPHYS:P}=W,H=WESC.HSP,L=WESC.HSL,S=P.SET,E=P.ESC,D=Math.PI/180,f=(x,n=1)=>Number.isFinite(x)?(+x).toFixed(n):'-',sg=(x,n=2)=>Number.isFinite(x)?(x>=0?'+':'−')+Math.abs(x).toFixed(n):'-';
const rows=[];let fail=0;const say=s=>rows.push('  '+s),chk=(c,s)=>{if(!c)fail=1;rows.push(`${c?'  ok ':'  !! '} ${s}`);},head=s=>rows.push('\n'+s);
const R=H.RC,R2=R*R;

head('1. The length: 05 03_7, "vorm biegen der Kurve auf 13 Umgänge −3,5 mm kürzen"');
{const rd=[['13 turns less 3.5 mm, the whole strip (the model\'s)',L.n13],['14 turns less 3.5 mm',L.n14],['15 turns less 3.5 mm (05 03_6\'s coil as wound, cut)',L.n15],['13 turns less 3.5 mm of helix, the curves added (phase 2a)',L.h13]];
  say(`the strip 0.285 × 0.52 (05 03_6), the coil's middle radius ${f(R,4)} (Ø 12.8 outside), a turn of helix ${f(L.LH,3)} mm at its pitch 0.73; each curve ${f(L.CV0/2,2)} mm from the coil to its pin (05 03_7, 220°), ${f(L.TAIL,2)} past the two pins (estimated)`);
  say(`reading                                                     helix    pin to pin   period    pins apart   helix's rise (05 03_5: 9.5)`);
  for(const[t,q]of rd){const T=P.HS.Tof(S.I,P.HS.kOf(q.L));say(`${t.padEnd(60)}${f(q.turns,3).padStart(7)}   ${f(q.L,1).padStart(7)} mm   ${f(T,4)} s   ${f(Math.abs(q.pins),1).padStart(5)}°       ${f(q.turns*H.PITCH,2)} mm`);}
  say(`05 03_1 draws the lower and upper pinning points at 15° and 20° (5° apart) and 05 03_5 the collet's pin end under the stud: a whole strip of n turns less 3.5 mm puts them ${f(Math.abs(L.n13.pins),1)}° apart for any n, the helix-only reading ${f(Math.abs(L.h13.pins),0)}°`);
  const Iw=S.I*(0.5/P.HS.T)**2;say(`the period with the weighed balance (${f(S.I,0)} g·mm²) is ${f(P.HS.T,4)} s; 0.5 s wants ${f(Iw,0)} g·mm² (${sg(100*(Iw/S.I-1),1)} %), the strip ${f(100*(1-(P.HS.kNeed/P.HS.k)**(1/3)),1)} % thinner, or the modulus ${f(100*(1-P.HS.kNeed/P.HS.k),1)} % lower`);
  const Jm=JSON.parse(fs.readFileSync(path.join(__dirname,'wempe_inertia.json'),'utf8')).balance.byHn['050301-4'].I;
  for(const h of[5.38,5.8,6.46]){const I=S.I+Jm*(h/6.46-1);say(`  the masses ${f(h,2)} high (${h===6.46?'the model\'s: 05 03_2\'s near pair from the rim\'s face, Wempe 3955\'s side view':h===5.38?'05 03_2\'s far pair\'s outline, its foot hidden by the arm\'s section (the model\'s until 15 October 2026)':'Lange 5829\'s side photograph, about'}; their moment taken as their height): I ${f(I,0)}, the period ${f(P.HS.Tof(I,P.HS.k),4)} s; 15 turns less 3.5 mm ${f(P.HS.Tof(I,P.HS.kOf(L.n15.L)),4)} s`);}}

head('2. The terminal curve (05 03_7, 10:1): its compass centres and Phillips\' conditions');
/* the curve in the sheet's own frame: x right, y up, the junction at the bottom (0°), the angles rising clockwise to the left (90°) and the top (180°) */
const pt=(r,th)=>[-r*Math.sin(th*D),-r*Math.cos(th*D)];
{const fit=(a,b)=>{const P=[];for(let t=a;t<=b;t+=10)P.push(pt(H.TBL[t/10],t));   /* the table's points (to the strip's inside), a circle through them by least squares */
    let A=[[0,0,0],[0,0,0],[0,0,0]],y=[0,0,0];for(const[x,z]of P){const r=[x,z,1],v=-(x*x+z*z);for(let i=0;i<3;i++){y[i]+=r[i]*v;for(let j=0;j<3;j++)A[i][j]+=r[i]*r[j];}}
    const det=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]),d=det(A),s=[0,1,2].map(k=>det(A.map((row,i)=>row.map((x,j)=>j===k?y[i]:x)))/d);
    const c=[-s[0]/2,-s[1]/2],r=Math.sqrt(c[0]*c[0]+c[1]*c[1]-s[2]),res=Math.max(...P.map(([x,z])=>Math.abs(Math.hypot(x-c[0],z-c[1])-r)));return{c,r,res};};
  const A1=fit(0,90),A2=fit(110,220),MK=[[-1.31,0.16],[0.25,-0.15]];   /* the marks on the sheet (366.5, 346 the coil's centre; 33.75 px/mm): a small circle at (322, 341) px, two at (375, 351) */
  say(`the table's 0-90° lie on a circle r ${f(A1.r,2)} (to ${f(A1.res*1000,0)} µm) about (${f(A1.c[0],2)}, ${f(A1.c[1],2)}) from the coil's centre, and its 110-220° on one r ${f(A2.r,2)} (to ${f(A2.res*1000,0)} µm) about (${f(A2.c[0],2)}, ${f(A2.c[1],2)}): the sheet marks small circles at (${MK[1].join(', ')}) and (${MK[0].join(', ')}), the compass's points (likely). The radii are from the coil's centre (the drawn curve scales to them within 0.07-0.12, where from the left mark it would miss by 1.3): the marks are how the curve was drawn, not another origin`);
  chk(Math.hypot(A2.c[0]-MK[0][0],A2.c[1]-MK[0][1])<0.25&&A2.res<0.05,`the second arc's centre ${f(Math.hypot(A2.c[0]-MK[0][0],A2.c[1]-MK[0][1]),2)} mm from the left mark: the table and the drawing agree`);
  /* Phillips: the first moment of the curve (junction to pin) l G must be R² along the junction's tangent, the way the curve goes: (-R², 0) here */
  const ph=(k,name)=>{let s=0,M=[0,0],p0=pt(k(0),0);for(let t=0.01;t<=220+1e-9;t+=0.01){const p1=pt(k(t),t),ds=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);s+=ds;M[0]+=ds*(p0[0]+p1[0])/2;M[1]+=ds*(p0[1]+p1[1])/2;p0=p1;}
    const G=[M[0]/s,M[1]/s];say(`${name}: ${f(s,2)} mm from the coil to its pin; its centroid ${f(Math.hypot(...G),3)} from the staff, ${f(Math.atan2(G[1],-G[0])/D,1)}° off the perpendicular to the junction's radius (condition 1: 0), l·OG ${f(s*Math.hypot(...G),1)} mm² against R² ${f(R2,1)} (condition 2: the centroid wants ${f(R2/s,3)}): ${f(s*Math.hypot(...G)/R2,3)} times`);return{s,G,M};};
  const ci=ph(H.rL,'the inner curve, 05 03_7\'s table into the collet (3.51 from the staff)'),co=ph(H.rU,'the outer, drawn in proportion to end at the stud (3.87, estimated)');
  say(`so the drawn curve meets the first condition (its centroid on the perpendicular, as a Phillips curve's) but not the second: its first moment is ${f(ci.s*Math.hypot(...ci.G)/R2,2)} R², its centroid ${f(Math.hypot(...ci.G)-R2/ci.s,2)} mm too far out`);
  /* the curve that meets both, from the coil to the same pin with the same heading (HSPR, its frame: junction counterclockwise from (R, 0)) */
  const des=(k,ri)=>{const q=th=>[k(th)*Math.cos(th*D),k(th)*Math.sin(th*D)],a=q(220),b=q(220.01),h=Math.atan2(b[1]-a[1],b[0]-a[0]),c=HSPR.design(R,1,a,h,ri);return c;};
  const di=des(H.rL,3.0),dO=des(H.rU,3.0);
  chk(!!di&&!!dO,`the curves that meet both conditions to the drawn pins and headings (HSPR.design): ${di?`into the collet ${f(di.l,2)} mm, starting ${f(((di.a/D)%360+360)%360-360,0)}° from the drawn junction`:'none'}; ${dO?`to the stud ${f(dO.l,2)} mm, ${f(((dO.a/D)%360+360)%360-360,0)}°`:'none'} (the drawn: ${f(ci.s,2)}, ${f(co.s,2)} from 0°)`);
  module.exports.curve={A1,A2,inner:{l:ci.s,OG:Math.hypot(...ci.G)},outer:{l:co.s,OG:Math.hypot(...co.G)},designed:{inner:di&&di.l,outer:dO&&dO.l}};}

head('3. The force on the pivots under a couple (HSPR.lateral: force × R / couple; 0 for Phillips\' ends, about 1 for plain ends)');
/* the spring in plan pin to pin, resampled every 0.15 mm along it (the elastica and the beam elements take it so) */
const plan=(turns)=>{const q=H.ra(0,true,0.25).map(([r,a])=>H.xy(r,a));return q;};
const resample=(q,ds)=>{const s=[0];for(let i=1;i<q.length;i++)s.push(s[i-1]+Math.hypot(q[i][0]-q[i-1][0],q[i][1]-q[i-1][1]));const Lt=s[s.length-1],n=Math.round(Lt/ds),o=[];let j=0;
  for(let i=0;i<=n;i++){const u=Lt*i/n;while(j<q.length-2&&s[j+1]<u)j++;const w=(u-s[j])/(s[j+1]-s[j]||1);o.push([q[j][0]+(q[j+1][0]-q[j][0])*w,q[j][1]+(q[j+1][1]-q[j][1])*w,u]);}return{pts:o,L:Lt};};
/* any helix: the drawn curves at both ends, TURNS of coil between them (the outer curve's junction where the coil ends), pin to pin */
const spring=turns=>{const o=[],a0L=0,a0U=360*turns;for(let th=220;th>0;th-=0.25)o.push(H.xy(H.rL(th),a0L-th));const n=Math.ceil(turns*1440);for(let i=0;i<=n;i++)o.push(H.xy(R,a0L+360*turns*i/n));
  for(let th=0.25;th<=220+1e-9;th+=0.25)o.push(H.xy(H.rU(th),a0U+th));return o;};
const drawn=resample(plan(),0.15),latD=HSPR.lateral(drawn.pts,R).ratio;
{const Lp=L.L-H.TURNS*(L.LH-2*Math.PI*R);chk(Math.abs(drawn.L-Lp)<0.02,`the drawn spring pin to pin in plan ${f(drawn.L,2)} mm (WESC.HSL's ${f(L.L,2)} less the helix's rise, ${f(Lp,2)}), ${f(H.TURNS,3)} turns of helix`);}
chk(latD<0.1,`as drawn: ${f(latD,3)} of couple / R on the pivots under a couple: the Hamilton's spring as drawn leaves 0.017 (hairspring.js, reported there), a designed one under 0.001, plain ends about 1 (fails past 0.1)`);
/* both ends designed to the drawn pins (HSPR.design, as hairspring.js): the inner traced back from its junction (clockwise) to the collet's pin */
{const qI=th=>[H.rL(th)*Math.cos(-th*D),H.rL(th)*Math.sin(-th*D)],qO=th=>[H.rU(th)*Math.cos(th*D),H.rU(th)*Math.sin(th*D)],hd=(q,a,b)=>{const u=q(a),v=q(b);return Math.atan2(v[1]-u[1],v[0]-u[0]);};
  const ci=HSPR.design(R,-1,qI(220),hd(qI,220,220.01),3.0),co=HSPR.design(R,1,qO(220),hd(qO,220,220.01),3.0),Pd=ci&&co?HSPR.path(R,ci,co,H.TURNS+440/360):null,lt=Pd?HSPR.lateral(Pd.pts,R).ratio:NaN;
  chk(Pd&&lt<1e-3,`both ends designed to the drawn pins and headings (inner ${ci?f(ci.l,2):'-'} mm, outer ${co?f(co.l,2):'-'} mm, ${Pd?f(Pd.L,1):'-'} mm in all): ${Number.isFinite(lt)?lt.toExponential(1):'-'} (the Hamilton's tolerance, 0.001)`);}
{const fr=[];for(let k=0;k<=8;k++){const t=11+k/8,q=resample(spring(t),0.15);fr.push(`${f(t,3)} ${f(HSPR.lateral(q.pts,R).ratio,3)}`);}
  const w=resample(spring(12),0.15),w11=resample(spring(11),0.15);say(`with the helix's turns varied (both curves as drawn): ${fr.join(', ')}; at a whole number of turns the two curves' errors cancel: 11 turns ${f(HSPR.lateral(w11.pts,R).ratio,4)}, 12 ${f(HSPR.lateral(w.pts,R).ratio,4)} (the outer curve's smaller error, drawn in proportion, leaves that)`);
  say(`the helix here is ${f(H.TURNS,3)} turns: ${f(H.TURNS%1,3)} of a turn short of whole, which the pins' place sets (the pins together want 360 n − 440°: ${f(H.TURNS+440/360,3)} turns pin to pin), so the drawn spring's force stands`);
  module.exports.lateral={drawn:latD};}

/* the essay (wempe_essaydata.js) takes the spring with its helix's turns varied (spring, resample) and the curve's figures above; the large swings below are this tool's */
module.exports.spring=spring;module.exports.resample=resample;module.exports.R=R;
if(require.main!==module)return;

head('4. At large swings: the drawn spring as an elastica (HSPR.large) and as beam elements (hairspring-fe.js)');
const ths=[];for(let a=-300;a<=300;a+=5)ths.push(a*D);
const big=HSPR.large(drawn.pts.map(p=>[p[0],p[1]]),ths),at=a=>big.find(q=>Math.abs(q.th-a*D)<1e-9),k0=1/drawn.L;
{const vw=[50,150,250].map(a=>{const i=big.indexOf(at(a));return Math.abs((big[i+1].U-big[i-1].U)/(big[i+1].th-big[i-1].th)/big[i].T-1);});
  chk(Math.max(...big.map(q=>q.res))<1e-9&&Math.max(...vw)<1e-4,`the elastica solved to ${Math.max(...big.map(q=>q.res)).toExponential(0)} mm at the stud, 300° each way; its couple and dU/dθ agree to ${Math.max(...vw).toExponential(0)}`);
  say(`its couple over θ EI / L: ${[90,180,270,-270].map(a=>`${a}° ${f(at(a).T/(a*D*k0),5)}`).join(', ')}; the force on the pivots × R / couple: ${[90,180,270,-270].map(a=>`${a}° ${f(at(a).F*R/Math.abs(at(a).T),3)}`).join(', ')}`);}
const Ts=big.map(q=>q.T),th=big.map(q=>q.th),rate=a=>86400*(1/HSPR.period(th,Ts,a*D).ratio-1);
{const lin=HSPR.period(ths,ths.map(t=>t),220*D).ratio;chk(Math.abs(lin-1)<1e-9,`the period's integration: a linear spring ${(lin-1).toExponential(0)} from 1`);}
const A12=E.A/D,AW=[];for(let h=0;h<=56.3;h+=2){const n=h/P.HPT,s=P.drv(n);AW.push({h,s,a:E.ampAt(s)/D});}
const aLo=Math.min(...AW.map(q=>q.a)),aHi=Math.max(...AW.map(q=>q.a)),r1=rate(225),r0=rate(247.5),r2=rate(270),slope=(rate(A12+10)-rate(A12-10))/2;
say(`the rate the spring alone gives against small swings: 180° ${sg(rate(180),3)}, ${f(aLo,0)}° ${sg(rate(aLo),3)}, ${f(A12,0)}° ${sg(rate(A12),3)}, ${f(aHi,0)}° ${sg(rate(aHi),3)}, 225° ${sg(r1,3)}, 247.5° ${sg(r0,3)}, 270° ${sg(r2,3)} s a day`);
say(`so it ${slope>=0?'gains':'loses'} ${f(Math.abs(slope),3)} s a day for each 10° about the model's swing (${f(A12,1)}° at 12 h), ${sg(r2-r1,2)} s a day over the 1954 instruction's 225-270°`);
chk(Math.abs((S.HS||0)-slope)<0.0005,`the model runs with it: WESC.SET.HS ${f(S.HS||0,3)} s a day per 10° (makeEsc's rate adds it to the escapement's: tools/escapement.js's settings)`);
{let lo=1e9,hi=-1e9,lo0=1e9,hi0=-1e9;for(const q of AW){const re=E.rateAt(q.a*D,q.s),r0=re-(S.HS||0)*(q.a-A12)/10;lo=Math.min(lo,re);hi=Math.max(hi,re);lo0=Math.min(lo0,r0);hi0=Math.max(hi0,r0);}
  say(`over the wind (0-56 h, the swing ${f(aLo,1)}-${f(aHi,1)}°) the escapement alone ${sg(lo0)} to ${sg(hi0)} s a day, with the drawn spring's isochronism ${sg(lo)} to ${sg(hi)} (both against 12 h)`);
  module.exports.iso={slope,r225:r1,r247:r0,r270:r2,rangeEsc:[lo0,hi0],range:[lo,hi]};}
/* the same spring as co-rotational beam elements (hairspring-fe.js's solver: extensible, the strip's 0.285), the rate at the same swings */
{const q=fe({P:drawn,big,R,rates:{r1:rate(aLo),r0:rate(A12),r2:rate(aHi)}},H.HT,{name:'the drawn spring',drawn:true,amps:[aLo,A12,aHi].map(a=>+a.toFixed(1)),coil:'r 3.5-6.3',band:'the model\'s swing over the wind',tolRate:0.02});   /* 0.02: 1,684 elements on 505 mm; the two methods' small-swing stiffnesses part 1.4e-4 */
  for(const r of q.rows)rows.push(r);if(q.fail)fail=1;}
say('the strip\'s own mass, its coils touching and the curves\' rise out of their planes are left out, as in hairspring.js; the helix is taken in plan (its 0.73 pitch tilts the strip 1.1°)');
module.exports.rows=rows;module.exports.fail=fail;
if(require.main===module){console.log(rows.join('\n'));process.exit(fail);}
