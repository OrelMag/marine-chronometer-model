// The Wempe transmission's beat refined: wempe_transmission.js's coupled beat (section 4) from its 8 starts at each integration step asked (MC_TR_H's factor on dynamics.js's
// steps), and every train mesh's peak over running: the worst of the starts, their median and start 0's; for the seconds wheel's mesh also the peak with the escape wheel's speed
// differenced over dynamics.js's steps, as the tool coupled it until 28 October 2026 (lamO in its meshEl: the same run, the old formula); and the work an impulse gives the
// balance, the starts' mean, which the beat's swing is judged on. The check that the peak judged against wempe_strength.js's line, and the swing, converge (the Wempe README, "Physics: the transmission"; Review-results.md, "The transmission's fatigue line on the seconds wheel's mesh").
// Needs only Node.js:   node wempe_transmission_converge.js [1,0.5,0.25,0.125] [--json OUT]   (MC_TR_TABS=FILE keeps the meshes' tables; about 2 minutes a step, the steps side by
// side). Reports, never fails.
'use strict';
if(!process.argv.includes('--model'))process.argv.push('--model','wempe');
const fs=require('fs'),path=require('path'),{Worker}=require('worker_threads');
const F=path.join(__dirname,'wempe_transmission.js'),TR=require(F),{MESH}=TR;
const HS=(process.argv.slice(2).find(a=>/^[\d.,]+$/.test(a))||'1,0.5,0.25,0.125').split(',').map(Number),jo=process.argv.indexOf('--json'),OUT=jo>0?process.argv[jo+1]:null;
const NPH=8,PHS=[...Array(NPH).keys()].map(k=>MESH.map((q,i)=>i<4?((q.ph+k*0.6180339887*(1+0.37*i))%1+1)%1:q.ph));   /* wempe_transmission.js's starts */
const run=(TB,hs,phs)=>new Promise((ok,no)=>{const w=new Worker(F,{workerData:{job:'beat',TB,o:{rigid:false,phs},par:{hs}},argv:['--model','wempe']});w.on('message',ok);w.on('error',no);});
const f=(x,d=1)=>x.toFixed(d),st=a=>{const s=[...a].sort((x,y)=>x-y);return{max:s[s.length-1],med:(s[(s.length-1)>>1]+s[s.length>>1])/2,min:s[0],s0:a[0]};};
(async()=>{const TC=process.env.MC_TR_TABS,TB=TC&&fs.existsSync(TC)?JSON.parse(fs.readFileSync(TC,'utf8')):await TR.tabs();if(TC&&!fs.existsSync(TC))fs.writeFileSync(TC,JSON.stringify(TB));
  const R=await Promise.all(HS.map(hs=>Promise.all(PHS.map(p=>run(TB,hs,p)))));const res=[];
  console.log('The coupled beat\'s mesh peaks over running, 8 starts, at each step (MC_TR_H): the worst / the median / start 0');
  HS.forEach((hs,j)=>{const rs=R[j],pk=i=>rs.map(r=>r.meshes[i].maxL/r.tq[MESH[i].B]),old=rs.map(r=>r.meshes[3].maxO/r.tq[MESH[3].B]),M=[0,1,2,3].map(i=>st(pk(i))),O=st(old);
    const W=rs.map(r=>r.W.reduce((t,x)=>t+x,0)/r.W.length*1e6),Wm=W.reduce((t,x)=>t+x,0)/W.length;
    res.push({hs,W,Wm,meshes:M,old:O,starts:pk(3),startsOld:old,beats:rs.map(r=>r.beats),trips:rs.map(r=>r.trips)});
    console.log(`  ${String(hs).padEnd(6)} ${M.map((m,i)=>`${MESH[i].nm.split(' → ')[0]} ${f(m.max)}/${f(m.med)}/${f(m.s0)}`).join('; ')}; the seconds wheel's as differenced ${f(O.max)}/${f(O.med)}/${f(O.s0)}; the work an impulse gives, the starts' mean ${f(Wm,3)} µJ (${f(Math.min(...W),3)}-${f(Math.max(...W),3)}); beats ${rs.map(r=>r.beats).join(',')}, trips ${rs.reduce((t,r)=>t+r.trips,0)}`);});
  const a=res.find(r=>r.hs===0.25),b=res.find(r=>r.hs===0.125);
  if(a&&b)console.log(`  the seconds wheel's mesh from 0.25 to 0.125: the worst ${f(100*(b.meshes[3].max/a.meshes[3].max-1),2)} %, the median ${f(100*(b.meshes[3].med/a.meshes[3].med-1),2)} % (as differenced: ${f(100*(b.old.max/a.old.max-1),0)} %, ${f(100*(b.old.med/a.old.med-1),0)} %)`);
  if(OUT)fs.writeFileSync(OUT,JSON.stringify(res,null,1));process.exit(0);})();
