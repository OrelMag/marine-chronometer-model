const B=require('./beatcore.js');const T={};let i=0;
const alt=[[[0,0.3,5200],[1.4,0.8,4300],[6.9,1.0,6100]],[[0,0.25,5600],[1.6,0.6,4100],[7.2,1.0,5900]]];
for(const bph of [18000,21600,28800,36000])for(const be of [0,0.4,1.2,3])for(const noise of [0.01,0.04,0.08,0.12])for(const g of [[1,0.7],[1,0.3],[0.4,1]])for(const sh of [0,1]){
 const s=B.synth({seed:11+i++,dur:15,bph,be,noise,gain:g,rate:3,shapes:sh?alt:undefined});const r=B.analyze(s.x,s.fs);
 const k=noise+(g[1]===0.7?' even':' uneq');T[k]=T[k]||{right:0,wrong:0,unc:0,weak:0};
 const right=r.bph===bph&&Math.abs(r.beatError-be)<0.15;if(r.ok&&!right&&noise<0.1)console.log('WRONG',bph,be,noise,g,sh,'->',r.bph,r.beatError.toFixed(2),r.pm.toFixed(2),r.method,r.gap.toFixed(2));T[k][r.ok?(right?'right':'wrong'):r.reason==='uncertain'?'unc':'weak']++}
console.table(T)
