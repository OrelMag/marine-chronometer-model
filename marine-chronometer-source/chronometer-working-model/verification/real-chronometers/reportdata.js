// assets/data.json for build_report.py: the corrected escapement's events against the swing (dynamics.js, in beat, at 14 drives) and We1dLNXiBj0's start
// (let go at 0:55.2 from 70°) run in the model at its own run-down (TF 52 s, 90 % of the torque) and at two the start fits (startup.js: 160 s at 65 %,
// 320 s at 60 %). Needs only Node.js:   node reportdata.js   (about 10 s)
const fs=require('fs'),path=require('path'),{sim,ESC}=require('../../tools/dynamics.js'),D=Math.PI/180,out={model:[],start:{}};
for(const s of [0.35,0.4,0.45,0.5,0.6,0.7,0.8,0.9,1,1.1,1.25,1.4,1.6,1.8]){const tr=[],r=sim({mode:'phys',T:4,from:3,trace:tr,s,A:ESC.ampAt(s)/D}),ev=tr.map(x=>[+x[0],x[1]]);
  const st=ev.filter(e=>e[1]===0&&e[0]>2.9&&e[0]<3.4)[0][0],E={};for(const[t,k]of ev){const d=(t-st)*1e3;if(d<-20||d>300)continue;if(E[k]===undefined)E[k]=d;}out.model.push({A:+r.A.toFixed(1),E});}
for(const[nm,s,TF]of[['TF52',0.9,52],['TF160',0.65,160],['TF320',0.6,320]]){const a=sim({mode:'phys',T:70,from:69,s,TF,A:70.1}).amps,c=[];
  for(let t=0.5;t<=69;t+=1){const k=Math.round(t/0.25),w=a.slice(Math.max(0,k-2),k+2);c.push([+(55.2+t).toFixed(1),+(w.reduce((x,y)=>x+y,0)/w.length/D).toFixed(1)]);}out.start[nm]={s,TF,curve:c};}
fs.writeFileSync(path.join(__dirname,'assets','data.json'),JSON.stringify(out));console.log('wrote assets/data.json');
