// The Wempe's going train for the Node tools (gearing.js --model wempe, wempe_physics.js, wempe_strength.js): its four meshes from the page's own tables and tooth
// forms (../../wempe/js/train.js WTRAIN.A and teeth(); the fusee wheel's table in fusee.js, 05 06 00-3; the escape pinion's in escapement.js, 05 04 05-2), the arbors'
// places from the plates' hole table (dims.js WD.H), the escapement and its drive from escphys.js (WPHYS). The outlines sampled finer than the page draws them, as
// gearing.js samples the Hamilton's (the epicycloid's 16 points a flank and gearOutline's 24 an addendum are enough to see, not to mesh).
//   const T=require('./wempe_train.js');   T.STG, T.outline(z, m, mate), T.D0, T.SH, T.ESC, T.W
const W=require('./wempe_load.js')({train:true,xf:(f,s)=>{
  for(const[a,b]of[['k<=24;k++){const t=0.6*k/24','k<=400;k++){const t=0.6*k/400'],['k<12;k++){const t=Math.PI*k/12','k<240;k++){const t=Math.PI*k/240'],
    ['for(let k=0;k<=16;k++){const[r,a]=E(t1*k/16);ep.push(k<16?','for(let k=0;k<=400;k++){const[r,a]=E(t1*k/400);ep.push(k<400?']])if(s.includes(a))s=s.split(a).join(b);
  return s;}});
const{WD,WTRAIN,WPHYS}=W,H=WD.H,A=WTRAIN.A,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
/* the fusee wheel 05 06 00-3 (fusee.js: z 90, D 40.57, d 39.21, dg 37.84, l 0.64, m 0.4356; its epicycloid from the centre pinion's 14 leaves) and the escape pinion 05 04 05-2
   (escapement.js: 10 leaves, m 0.263, tip 2.97, root 1.6) */
const FW={z:90,m:0.4356,D:40.57,dg:37.84,l:0.64,mate:14},EP={z:10,m:0.263,D:2.97,dg:1.6};
/* each stage: [name, the wheel's teeth, the pinion's leaves, the wheel's module (to 5 places: the outlines are the tables' own), seconds a turn of the wheel, the wheel's table, the pinion's, the two arbors' holes, their pivots' radii
   (the driven arbor's, for the bearings' loads: wempe_physics.js), the wheel's and pinion's widths (mm, their sheets)] */
const STG=[['fusee wheel → centre pinion',90,14,FW.m,90/14*3600,FW,A.cw.pin,[H[10],H[1]],[0.595,1.0895],[2.62,A.cw.pin.u1-A.cw.pin.u0]],
  ['centre wheel → intermediate pinion',90,12,+A.cw.wheel.m.toFixed(5),3600,A.cw.wheel,A.tw.pin,[H[1],H[38]],[0.4125,0.4125],[A.cw.wheel.rim[1]-A.cw.wheel.rim[0],A.tw.pin.u1-A.tw.pin.u0]],
  ['intermediate wheel → seconds pinion',80,10,+A.tw.wheel.m.toFixed(5),3600/(90/12),A.tw.wheel,A.sw.pin,[H[38],H[35]],[0.405,0.375],[A.tw.wheel.rim[1]-A.tw.wheel.rim[0],A.sw.pin.u1-A.sw.pin.u0]],
  ['seconds wheel → escape pinion',80,10,+A.sw.wheel.m.toFixed(5),60,A.sw.wheel,EP,[H[35],H[26]],[0.12,0.12],[A.sw.wheel.rim[1]-A.sw.wheel.rim[0],3]]];
/* the outlines by teeth and the stage's module (a wheel's z@m, its pinion's z@m: each pair is one): the tables' own tips, roots and tooth thicknesses */
const OUT={};for(const[,zA,zB,m,,w,p]of STG){OUT[`${zA}@${m}`]=WTRAIN.teeth(w.z,w.m,w.D,w.dg,w.mate,w.l);OUT[`${zB}@${m}`]=WTRAIN.teeth(p.z,p.m,p.D,p.dg);}
const outline=(z,m)=>{const o=OUT[`${z}@${m}`];if(!o)throw Error(`no Wempe gear ${z}@${m}`);return o;};
/* each mesh's drawn centres (the holes) against m (zA + zB) / 2 on the wheel's module */
const D0=STG.map(([,zA,zB,m,,,,h])=>dist(h[0],h[1])-m*(zA+zB)/2);
/* the pivots' shake in their holes, each mesh the looser of its two arbors' (diametral, as drawn: WN-301's 1.21 on the centre's 1.19, WN-300's 0.86 on the intermediate's
   0.825 and the seconds' 0.81; the WN sheets aren't in the set, so estimated) */
const SH=[0.02,0.035,0.05,0.05];
module.exports={W,STG,outline,D0,SH,ESC:WPHYS.ESC,FW,EP,dist};
