// The data of the report "Would a chronometer made to the model run and keep time?" (index.html here, build_report.py): the tools' results gathered into
// assets/data.json. Needs only Node.js:   node reportdata.js     (about 1 minute: each mesh worked through a pitch, six hours of the train, the hairspring by elements)
// fea.py and rating.py write their own (python ../../tools/fea.py --reuse --json assets/fea.json; python ../../tools/rating.py --demo --json assets/rating.json).
const fs=require('fs'),path=require('path'),T=path.join(__dirname,'..','..','tools'),req=f=>require(path.join(T,f));
const DV=JSON.parse(fs.readFileSync(path.join(T,'deviations.json'),'utf8')),G=req('gearing.js'),TH=req('thermal.js'),HF=req('hairspring-fe.js'),GJ=JSON.parse(fs.readFileSync(path.join(T,'gearing.json'),'utf8')),BJ=JSON.parse(fs.readFileSync(path.join(T,'bench.json'),'utf8'));
const r=(x,n=4)=>+(+x).toFixed(n);
/* 1. each mesh through a pitch, at its drawn centres: the torque ratio at mu 0, 0.10, 0.20 */
const base=G.STG.map(([nm,zA,zB,m])=>G.stage(zA,zB,m));G.setBase(base);
const meshes=G.STG.map(([nm,zA,zB,m],k)=>{const s=base[k],a0=s.al[0],span=s.al[s.al.length-1]-a0;
  return{name:nm,zA,zB,m,approach:r(s.approach,3),drop:s.drop,backlash:r(s.blmm*1000,1),tip:r(s.tip*1000,1),phi:r(s.phi*180/Math.PI,2),
    stats:s.fac.map(f=>{const q=G.st(f);return{mn:r(q.mn),mx:r(q.mx),mean:r(q.mean)};}),curve:s.al.map((a,i)=>[r((a-a0)/span,4),...s.fac.map(f=>r(f[i],5))])};});
/* 2. six hours of the train at mu 0.10 and 0.20: the swing every 20 s */
const days=[1,2].map(j=>{const q=G.day(base,j,6,undefined,undefined,20);return{mu:G.MU[j],amin:r(q.amin,2),amax:r(q.amax,2),wander:q.wander,trace:q.tr.filter(p=>p[0]>0.1)};});
const data={made:new Date().toISOString().slice(0,10),meshes,days,windows:GJ,
  thermal:{AB:TH.AB,AS:TH.AS,DA:TH.DA,dT:TH.dT,depth:TH.depth,esc:TH.esc,m0:TH.m0,SPAN:TH.SPAN,ES:TH.ES,dC:TH.dC,dH:TH.dH,LCH:TH.LCH,dl:TH.dl},
  hair:{N:HF.N,Ltot:HF.Ltot,L:HF.L,curves:HF.curves.map(c=>({deg:c.deg,fe:r(c.fe-1,8),el:c.el==null?null:r(c.el-1,8),feF:r(c.feF,6),elF:c.elF==null?null:r(c.elF,6)})),rates:HF.rates},
  bench:BJ.tests,devs:DV.devs};
fs.mkdirSync(path.join(__dirname,'assets'),{recursive:true});fs.writeFileSync(path.join(__dirname,'assets','data.json'),JSON.stringify(data));
console.log('wrote assets/data.json:',meshes.length,'meshes,',days[0].trace.length,'swing points,',data.hair.curves.length,'hairspring angles,',data.bench.length,'tests');
