// assets/data.json for build_report.py: the corrected escapement's events against the swing (dynamics.js, in beat, at 14 drives) and We1dLNXiBj0's start
// (let go at 0:55.2 from 70°) run in the model at its own run-down (TF 68 s since 12 October 2026, 52 until then; at the drive that fits it best, 100 % of the torque) and at two the
// start fits (startup.js, the likeliest reading: 160 s at 80 %, 320 s at 70 %); and xM_mxtGfeqQ's recovery at three (below). Needs only Node.js:   node reportdata.js   (about 10 s)
const fs=require('fs'),path=require('path'),{sim,ESC}=require('../../tools/dynamics.js'),D=Math.PI/180,out={model:[],start:{}};
for(const s of [0.35,0.4,0.45,0.5,0.6,0.7,0.8,0.9,1,1.1,1.25,1.4,1.6,1.8]){const tr=[],r=sim({mode:'phys',T:4,from:3,trace:tr,s,A:ESC.ampAt(s)/D}),ev=tr.map(x=>[+x[0],x[1]]);
  const st=ev.filter(e=>e[1]===0&&e[0]>2.9&&e[0]<3.4)[0][0],E={};for(const[t,k]of ev){const d=(t-st)*1e3;if(d<-20||d>300)continue;if(E[k]===undefined)E[k]=d;}out.model.push({A:+r.A.toFixed(1),E});}
for(const[nm,s,TF]of[['TFm',1,ESC.settings.TF],['TF160',0.8,160],['TF320',0.7,320]]){const a=sim({mode:'phys',T:70,from:69,s,TF,A:70.1}).amps,c=[];
  for(let t=0.5;t<=69;t+=1){const k=Math.round(t/0.25),w=a.slice(Math.max(0,k-2),k+2);c.push([+(55.2+t).toFixed(1),+(w.reduce((x,y)=>x+y,0)/w.length/D).toFixed(1)]);}out.start[nm]={s,TF,curve:c};}
/* a second movement (12 October 2026): xM_mxtGfeqQ's swing recovering after handling (swing.json, 170 deg at 8:56), run from its first reading at the model's TF and at the two
   run-downs that fit it best (startup.js --xm: the drive in 5 % steps, the fit ragged along TF): 68 s at 80 %, 200 s at 50 %, 320 s at 45 % */
{const X=JSON.parse(fs.readFileSync(path.join(__dirname,'..','..','tools','swing.json'),'utf8')).xM_mxtGfeqQ,t0=X.A_t[0][0],a0=X.A_t[0][1],T=Math.ceil(X.A_t[X.A_t.length-1][0]-t0)+2;out.xm={};
  for(const[nm,s,TF]of[['TFm',0.8,ESC.settings.TF],['TF200',0.5,200],['TF320',0.45,320]]){const a=sim({mode:'phys',T,from:T-1,s,TF,A:a0}).amps,c=[];
    for(let t=0;t<=T-1;t+=1){const k=Math.round(t/0.25),w=a.slice(Math.max(0,k-2),k+2);c.push([+(t0+t).toFixed(1),+(w.reduce((x,y)=>x+y,0)/w.length/D).toFixed(1)]);}out.xm[nm]={s,TF,curve:c};}}
fs.writeFileSync(path.join(__dirname,'assets','data.json'),JSON.stringify(out));console.log('wrote assets/data.json');
