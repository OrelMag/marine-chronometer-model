// The Wempe's escapement in heat and cold, for wempe_thermal_frame.js and wempe_tolerances.js (the lock window over the TU's 4-36 °C): makeEsc's settings moved as
// the parts that aren't brass move against the brass frame and escape wheel (05 04 05-1, Ms 63), the wheel's radius the unit. Moved here from wempe_thermal_frame.js
// on 27 October 2026, unchanged.
//   const H=require('./wempe_escheat.js')(W);   H.at(H.K.mid, 36, dL0)  ->  {o: the settings, E: makeEsc, kd: the drive's factor, dr, dt}
/* expansion a °C (published ranges): brass, the sheets' Ms 58 (leaded, CuZn39Pb3) and Ms 63 (CuZn37), 18.5-20.9 × 10⁻⁶ (wempe_thermal.js's 18.5-20.0 and thermal.js's
   leaded clock brass 18.7-20.9 together); hardened carbon steel 10.8-12.5 (thermal.js); beryllium copper (C17200, hardened) 16.7-17.8 (wempe_thermal.js's 17); a gold
   spring alloy 13.5-15.0 (estimated: fine gold 14.2, its alloy not on 05 04 01-2). The discharge roller (05 04 04-1, bought in, no material drawn) taken as steel (estimated).
   Thermoelastic coefficients, 1/E dE/dT: carbon steel -240 to -270 × 10⁻⁶ (wempe_thermal.js's hairspring; the detent spring and mainspring alike), gold -200 to -300
   (estimated). K: their middle, and the corner of the ranges that moves each part most (brass the most, steel the least) */
const MAT={b:[18.5e-6,20.9e-6],s:[10.8e-6,12.5e-6],r:[16.7e-6,17.8e-6],g:[13.5e-6,15.0e-6],es:[-2.7e-4,-2.4e-4],eg:[-3.0e-4,-2.0e-4]};
const mid=r=>(r[0]+r[1])/2,K={mid:{b:mid(MAT.b),s:mid(MAT.s),r:mid(MAT.r),g:mid(MAT.g),es:mid(MAT.es),eg:mid(MAT.eg)},most:{b:MAT.b[1],s:MAT.s[0],r:MAT.r[0],g:MAT.g[0],es:MAT.es[0],eg:MAT.eg[0]}};
const T0=20,TS=[4,36];
/* makeEsc's frame: the balance's centre at the origin, the wheel's at EX, its tip radius the unit: brass held, so EX, the teeth and their root stay. In it, at γ = (α - αb) ΔT
   for each part (negative warm for anything that grows less than brass):
   - the detent (steel) from its foot Ft, held by its brass block: the stone's flat at S moves by BL γs along the detent, dirB: its radial part (from the wheel's centre at
     the locked tooth, uS) changes the depth of lock, dL - BL γs (dirB·uS), its tangential part the angle the wheel rests at, LO; BL itself grows by γs
   - the gold spring's tip Pt, carried by the detent from Ft to the spring's root Ps0 and by the gold spring from there (γg): rT and PSO, its place from the staff
   - the impulse roller (beryllium copper, rRoll, rp) and the discharge roller's reach (rd, rDR: steel, estimated) on the steel staff (γr, γs)
   - the detent spring's stiffness (EB) by its thermoelastic coefficient and its height's growth (its length and thickness grow alike: their ratio holds), the preload
     with its modulus (OP78 0: W78 the preload); the gold spring's (ET) likewise
   - the drive: the mainspring's torque E b t³ θ / L, by es + 3 αs; the fusee's and barrel's radii both brass, their ratio held */
module.exports=W=>{const S=W.WPHYS.SET,E0=W.WPHYS.ESC,D=180/Math.PI,dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
  const uS=[Math.cos(E0.lockA),Math.sin(E0.lockA)],tS=[-uS[1],uS[0]],dB=[E0.dirB.x,E0.dirB.y],nB=[E0.nB.x,E0.nB.y],Ft=[E0.Ft.x,E0.Ft.y],Pt=[E0.Pt.x,E0.Pt.y],Ps0=[E0.Ps0.x,E0.Ps0.y];
  /* the escapement at t with the constants k, its lock set at 20 °C to dL0 (units of ES: the drawn S.dL, or the bench's) */
  const at=(k,t,dL0=S.dL)=>{const dT=t-T0,gs=(k.s-k.b)*dT,gg=(k.g-k.b)*dT,gr=(k.r-k.b)*dT,dr=S.BL*gs*dot(dB,uS),dt=S.BL*gs*dot(dB,tS);
    const Pn=[0,1].map(i=>Ft[i]+(Ps0[i]-Ft[i])*(1+gs)+(Pt[i]-Ps0[i])*(1+gg));
    const o={...S,dL:dL0-dr,LO:S.LO+dt*D,BL:S.BL*(1+gs),rT:-dot(Pn,dB),PSO:dot(Pn,nB),PSL:S.PSL*(1+gg),rRoll:S.rRoll*(1+gr),rp:S.rp*(1+gr),rd:S.rd*(1+gs),rDR:S.rDR*(1+gs),
      EB:S.EB*(1+(k.es+k.s)*dT),W78:S.W78*(1+k.es*dT),ET:S.ET*(1+(k.eg+k.g)*dT)};
    return{o,E:W.makeEsc(o,S),kd:1+(k.es+3*k.s)*dT,dr,dt};};
  return{MAT,K,T0,TS,at};};
module.exports.MAT=MAT;module.exports.K=K;module.exports.T0=T0;module.exports.TS=TS;
