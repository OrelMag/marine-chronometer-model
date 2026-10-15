// What a maker's error in the three springs the sources don't size does to the timekeeping, and so how closely each must be made (OPEN-QUESTIONS.md: the
// mainspring's thickness and the detent's and trip spring's sections are not known). Needs only Node.js:
//   node tolerances.js            prints the analysis; exit 1 if tools/tolerances.json (the sheets' tolerance lines, makers.py) is not what it finds
//   node tolerances.js --write    writes tools/tolerances.json (then run makers.py)
// The balance's swing and the escapement's rate come from the model's escapement (shared/escapement.js, atK): the escape wheel's torque scales with the mainspring's
// stiffness E b t³ / 12 L (taken to scale with it, the fusee evening its pull as drawn: a spring of other proportions may need its set-up adjusted), and the detent and trip springs' work on the balance with their stiffness, as each strip's thickness cubed. The band is the manual's
// running swing, 1⅜-1½ turns (Sec. IX: 247.5-270°). The rate is the escapement's own change at that swing, s a day, which the timing weights take up when the
// chronometer is rated; it is given so a maker sees how far off the first rate will be. Under a second.
const fs=require('fs'),path=require('path'),rd=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const core=rd('../js/core.js'),phys=rd('physics.js');
const num=(re,s,what)=>{const m=re.exec(s);if(!m)throw Error('not found: '+what);return m.slice(1).map(Number);};
const [t0]=num(/MSPRING=\{t:([\d.]+)/,core,'the mainspring\'s thickness'),[L0]=num(/MSPRING=\{[^}]*len:([\d.]+)/,core,'its length'),[b0]=num(/const b=([\d.]+),t=MS\.t/,phys,'its width (physics.js)');
const [IN,rUp,rDn]=num(/const IN=([\d.]+),ratio=([\d.]+)\/([\d.]+)/,phys,'the barrel\'s turns and the fusee\'s radii (physics.js)'),ratio=rUp/rDn;
const {build}=require('./escapement.js'),ESC=build().ESC,D=180/Math.PI,LO=247.5,HI=270;
const ES=ESC.ES,{SPL:sL,SN0:sn0,SN1:sn1,tsT}=ESC.settings;   /* the detent spring's length and faces, the trip spring's thickness: makeEsc's settings (read off its source until 15 October 2026) */
const td0=Math.abs(sn1-sn0)*ES,ld=sL*ES;   /* the detent spring as drawn: thickness in the plane it bends in, length from the foot to the point of flexure (mm) */
const at=(s,kd,kp)=>{const r=ESC.atK(s,kd,kp);return{A:r.A*D,rate:r.rate};};
/* the value of x at which f(x) crosses y, f monotone between a and b */
const cross=(f,y,a,b)=>{let fa=f(a)-y;for(let i=0;i<80;i++){const m=(a+b)/2,fm=f(m)-y;if((fm>0)===(fa>0)){a=m;fa=fm;}else b=m;}return(a+b)/2;};
const E=207e9,b=b0,t=t0/1000,L=L0/1000,m1=2*Math.PI*E*b*t**3/(12*L),Mup=IN*m1/(1-1/ratio);   /* as physics.js: the spring's moment fully wound, N·m */
const rows=[],say=s=>rows.push('  '+s),f=(x,n=2)=>x.toFixed(n),pc=x=>(x>=1?'+':'−')+f(Math.abs(x-1)*100,0)+' %';
/* the mainspring */
const sLo=cross(s=>at(s,1,1).A,LO,0.3,1),sHi=cross(s=>at(s,1,1).A,HI,1,3),tLo=t0*Math.cbrt(sLo),tHi=t0*Math.cbrt(sHi),r375=at((0.374/t0)**3,1,1),r419=at((0.419/t0)**3,1,1);
const rLo=at(sLo,1,1).rate,rHi=at(sHi,1,1).rate,bmm=f(b0*1000,2);
say(`the mainspring (${t0} × ${bmm} mm, ${L0} long): the balance swings ${LO}-${HI}° for a stiffness ${pc(sLo)} to ${pc(sHi)} of the drawn spring's`);
say(`  so ${f(tLo,3)}-${f(tHi,3)} mm thick at the drawn width and length; fully wound ${f(Mup*sLo,2)}-${f(Mup*sHi,2)} N·m (the drawn ${f(Mup,2)}); the escapement's rate ${f(rLo,2)} to +${f(rHi,2)} s a day there`);
say(`  the parts list's 0.0165 in (0.419 mm), the same length: ${f(r419.A,0)}°, the rate +${f(r419.rate,2)} s a day; a 0.374 mm strip (the coils' pitch on TN24H's movement: OPEN-QUESTIONS.md): ${f(r375.A,0)}°, the rate ${f(r375.rate,2)} s a day`);
/* the detent spring */
/* Op. 78 sets it up: the 0.770 g weight parts it from its button by 0.005 in, so a stiffer spring is given less preload (makeEsc's th78), none at kdP; stiffer than that the
   test can't be met with the spring resting on its button. Set up so, a stiffer spring takes less of the impulse, not more (the preload it loses outweighs its stiffness over the lift) */
const kdP=ESC.MW/(ESC.KD*ESC.th78),aP=at(1,kdP,1).A,kdHi=aP>=LO?kdP:cross(k=>at(1,k,1).A,LO,1,kdP),tdHi=td0*Math.cbrt(kdHi),aD0=at(1,1e-6,1).A,aHi=at(1,kdHi,1).A,rdHi=at(1,kdHi,1).rate;
say(`the detent spring (${f(td0,3)} mm thick as drawn, ${f(ld,2)} to its flexure): Op. 78's 0.005 in leaves it no preload at ${f(kdP,2)} times its stiffness, ${f(td0*Math.cbrt(kdP),3)} mm thick; up to ${f(kdHi,2)} times (${f(tdHi,3)} mm) it can be set up by the test and the swing stays above ${LO}° (${f(aHi,1)}° there, the rate ${f(rdHi,2)} s a day); with no stiffness at all ${f(aD0,0)}°`);
/* the trip spring */
const kpHi=cross(k=>at(1,1,k).A,LO,1,200),tpHi=tsT*Math.cbrt(kpHi),rpHi=at(1,1,kpHi).rate;
say(`the trip spring (${tsT} mm thick as drawn): the swing stays above ${LO}° up to ${f(kpHi,1)} times its stiffness, ${f(tpHi,3)} mm thick (the rate +${f(rpHi,2)} s a day there)`);
/* the sheets' tolerance lines (makers.py puts each on its line's maker's sheet and so in the build book) */
const TOL={
  '42038':`The sources don't give its thickness or length (OPEN-QUESTIONS.md); its stiffness E b t³/12 L sets the balance's swing. Within ${pc(sLo)} to ${pc(sHi)} of the drawn spring's (${f(tLo,3)}-${f(tHi,3)} mm thick at the drawn ${bmm} mm width and ${L0} mm length; about ${f(Mup*sLo,2)}-${f(Mup*sHi,2)} N·m fully wound) the balance swings the manual's 1⅜-1½ turns (247.5-270°), and the escapement's rate changes ${f(rLo,2)} to +${f(rHi,2)} s a day, which the timing takes up. The drawn 0.394 mm is the coils' spacing on the videos (the parts list says 0.0165 in, 0.419 mm): measure the strip before fitting it. One of the parts list's 0.419 mm, the same length, swings the balance ${f(r419.A,0)}° (${f(r419.rate,2)} s a day fast before timing) and wants a larger barrel or a smaller core to wind the fusee's turns; one 0.374 mm thick (the other movement's spacing) only ${f(r375.A,0)}° (${f(Math.abs(r375.rate),2)} s a day slow). (The drive taken to scale with the spring's stiffness, the fusee evening it as drawn; tools/tolerances.js)`,
  '42087':`The sources don't give its spring's section (OPEN-QUESTIONS.md). Its stiffness goes as its thickness cubed: up to ${f(kdHi,1)} times the drawn spring's (${f(tdHi,3)} mm thick, the drawn ${f(td0,3)} over ${f(ld,2)} mm to the point of flexure) it can be set up by the manual's test (Op. 78: a 0.770 g weight on the locking jewel parts the spring from its stop button by approximately 0.005 in; bend the spring until it does) and the balance swings ${f(aD0,0)}-${f(aHi,0)}°; stiffer, the weight can't lift it 0.005 in with the spring still resting on its button. Set up so, a stiffer spring has less preload and takes a little less of the impulse; its work sets no lower limit (with no stiffness, ${f(aD0,0)}°). A thinner spring still brings the detent back in time: from half to twice the drawn stiffness, and with no preload at all, it is back on its stop well before the next tooth reaches the stone, the preload doing most of the work (tools/tolerances.js, tools/dynamics.js)`,
  '42088':`The sources don't give its thickness (OPEN-QUESTIONS.md). It bends only on the return swing (the horn backs it when it lifts the detent), but it is bent far, round the discharge jewel's end, and the work is lost when it flies back: up to ${f(kpHi,1)} times the drawn strip's stiffness (${f(tpHi,3)} mm thick, the drawn ${tsT}) the balance still swings 247.5° or more; thinner costs nothing. (tools/tolerances.js)`};
const P=path.join(__dirname,'tolerances.json'),out=JSON.stringify(TOL,null,1)+'\n';
console.log(rows.join('\n'));
if(process.argv.includes('--write')){fs.writeFileSync(P,out);console.log('wrote tools/tolerances.json: run makers.py');}
else{const cur=fs.existsSync(P)?fs.readFileSync(P,'utf8'):'';if(cur.replace(/\r/g,'')!==out){console.log('  !! tools/tolerances.json is not what this finds: node tolerances.js --write, then python makers.py');process.exitCode=1;}else console.log('  ok  the sheets\' tolerances (tools/tolerances.json) are what this finds');}
