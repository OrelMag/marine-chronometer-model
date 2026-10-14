// assets/mech.json: the mechanisms' analyses for the report's section 11 (the key forced, the ratchets and pawls, the sustaining spring, the motion work, wear,
// the train in time, the whole movement to a maker's tolerances), each tool's own results as its module exports them. Needs only Node.js:
//   node mechdata.js     (about 45 s: the sustaining spring's and the Monte Carlo's runs)
const fs=require('fs'),path=require('path'),T=path.join(__dirname,'..','..','tools'),req=f=>require(path.join(T,f));
const OW=req('overwind.js'),RA=req('ratchets.js'),SU=req('sustaining.js'),MW=req('motionwork.js'),WE=req('wear.js'),TD=req('traindyn.js'),MC=req('montecarlo.js'),MJ=req('mechanisms.json');
const strip=o=>{const c={...o};delete c.rows;return c;};
const pawls=MJ.pawls.map(q=>({name:q.name,outline:q.outline,teeth:q.teeth,pivot:q.pivot,C:q.face.C,n:q.face.n,fit:q.face.fit,kind:q.face.kind,ro:q.ro,ri:q.ri}));
const su=strip(SU);su.sim={drawn:SU.sim.drawn.trace,model:SU.sim.model.trace,w10:SU.sim.w10,w30:SU.sim.w30,w30d:SU.sim.w30d,tStop:{drawn:SU.sim.drawn.tStop,model:SU.sim.model.tStop},tBand:{drawn:SU.sim.drawn.tBand,model:SU.sim.model.tBand},tTurn:{drawn:SU.sim.drawn.tTurn,model:SU.sim.model.tTurn}};
const out={ow:strip(OW),ra:strip(RA),su,mw:strip(MW),we:strip(WE),td:strip(TD),mc:strip(MC),pawls,rows:{ow:OW.rows,ra:RA.rows,su:SU.rows,mw:MW.rows,we:WE.rows,td:TD.rows,mc:MC.rows}};
fs.mkdirSync(path.join(__dirname,'assets'),{recursive:true});fs.writeFileSync(path.join(__dirname,'assets','mech.json'),JSON.stringify(out));
console.log('wrote assets/mech.json:',pawls.length,'pawls,',WE.contacts.length,'wear contacts,',MC.N,'movements');
