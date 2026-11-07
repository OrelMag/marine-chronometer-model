// wempe_6mx_gimbal_sweep.js: the Soviet 6MX's case period (gimbals.js's bodies, levelled) as its case brackets' pivots stand higher or lower on the bowl than case.js's DY6 puts them
// (Kirov 247's pivots measured ±2 mm). Run: MC_WREV=6mx node wempe_6mx_gimbal_sweep.js (under a second; reports, never fails)
process.argv.push('--model','wempe');const G=require('./gimbals.js');const B=G.bodies(),g=9.80665;const m=B.bw.m,c=B.bw.c,Iz=B.Iz;
console.log('levelled T',(2*Math.PI/B.wz).toFixed(4),(2*Math.PI/B.wx).toFixed(4));
const Icg=Iz-m*(c[0]**2+c[1]**2);
for(const d of [-2,-1,-0.7,0,0.3,0.5,1,2]){const h=-c[1]+d/1000,I=Icg+m*h*h;console.log('pivots '+d+' mm higher on the bowl: cg '+(h*1000).toFixed(2)+' under, case '+(2*Math.PI*Math.sqrt(I/(m*g*h))).toFixed(4)+' s');}
const bw=B.bw,rg=B.rg,Ix=B.Ix;const Ixcg=Ix-(bw.m*(bw.c[1]**2+bw.c[2]**2)+rg.m*(rg.c[1]**2+rg.c[2]**2));
for(const d of [-2,0,1,2]){const hb=-bw.c[1]+d/1000,I=Ixcg+bw.m*(hb*hb+bw.c[2]**2)+rg.m*(rg.c[1]**2+rg.c[2]**2),k=g*(bw.m*hb-rg.m*rg.c[1]);console.log('ring with pivots '+d+': '+(2*Math.PI*Math.sqrt(I/k)).toFixed(4));}
