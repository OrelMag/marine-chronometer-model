// The Wempe's escapement's work against its swing, near the swing it keeps (Node.js, no browser; reports, never fails). makeEsc's work an oscillation nets the balance, wn(s, a),
// steps where the locking stone, falling home, lands on the escaping tooth's back (or doesn't) as the swing changes: its blow and ride through the back's slope push the wheel
// (RWD, the Wempe README's "The stone's blow on the escaping tooth's back"). A swing whose work balances its losses at such a step is pinned there (the work with the blow
// above the losses, without it below), and makeEsc's beat (WESC.ESC.beat, wempe_escapement.js's check at 12 h) closes only within the step's size. For each drive it prints
// the swing ampAt gives, the work's balance just either side of it, and every step over 0.5 % within 8° (degrees from the swing: the share the work changes by); then the beat's
// closure (lam, 1 if makeEsc's pushes balance the losses) every 2 h over the wind. MC_WREV picks the version (6mx, build, build40); MC_ESC, makeEsc's settings overridden (JSON).
//   node wempe_cliff.js            (about 1-2 minutes)
const W=require('./wempe_load.js')(),{WESC,WPHYS:P,makeEsc}=W,d=Math.PI/180,o=process.env.MC_ESC?JSON.parse(process.env.MC_ESC):null;
const S=o?{...P.SET,...o}:P.SET,E=o?makeEsc(S,P.SET):P.ESC,Q=Math.PI*S.TF/0.5,net=(s,a)=>E.wn(s,a)-Math.PI*a*a/Q;
console.log(`the Wempe (${process.env.MC_WREV||'last'}${o?', '+JSON.stringify(o):''}): the swing ${(E.A/d).toFixed(2)}° at the reference's drive`);
for(const s of[0.8,0.85,0.9,0.95,1,1.05,1.1]){const A=E.ampAt(s),st=[];let prev=null;for(let a=A/d-8;a<=A/d+8;a+=0.05){const w=E.wn(s,a*d);if(prev!==null&&Math.abs(w-prev)/Math.abs(prev)>0.005)st.push(`${(a-0.025-A/d).toFixed(2)}:${(100*(w-prev)/prev).toFixed(1)}%`);prev=w;}
  console.log(`  drive ${s.toFixed(2)}: swing ${(A/d).toFixed(2)}°, work less losses ${net(s,A-0.02*d).toExponential(1)} / ${net(s,A+0.02*d).toExponential(1)} k at ∓0.02°; steps ${st.join(' ')||'none'}`);}
if(!o){const K=WESC.ESC,r=[];for(let h=0;h<=56;h+=2){const s=P.drv(h/P.HPT),A=E.ampAt(s),b=K.beat(A,s);r.push(`${h} h ${(A/d).toFixed(1)}° ${b?b.lam.toFixed(3):'-'}`);}console.log('  the beat over the wind (hours, swing, lam): '+r.join(', '));}
