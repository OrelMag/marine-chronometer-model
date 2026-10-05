// Checks the almanac and the navigator's arithmetic (ALM in ../../shared/almanac.js) that the essay's sky section computes with. Needs only Node.js:
//   node almanac.js           (about 2 s; exits with 1 on any failure)
// 1. Meeus's own worked examples (Astronomical Algorithms, 2nd ed.): the Moon (47.a), sidereal time (12.a, 12.b), a star's apparent place (23.a).
// 2. Against independent ephemerides (almanac-ref.json, made by almanac_ref.py: JPL Horizons for the Sun and Moon, SIMBAD and skyfield for the stars): the Sun's
//    and Moon's apparent places, distances and elongation at 90 epochs 1950-2149, sidereal time, the 58 stars' apparent places at six epochs, and the Sun's and
//    Moon's topocentric altitude and azimuth from three places. ALM.STARS must be the reference's catalogue.
// 3. Round trips: sights made from the almanac at a known time and place (ALM.sextant, sextantLunar: refraction, dip, parallax and semi-diameters put in) and
//    reduced as a navigator would (correct, timeSight, equalAlt, clear, fix) must give the place and the Greenwich time back.
// The tolerances are what navigation needs (the Nautical Almanac prints to 0.1′; a lunar distance 1′ out is about 2 minutes of Greenwich time) with the
// algorithms' stated accuracy; each line prints the worst case found.
const fs=require('fs'),path=require('path'),{ALM}=require('../../shared/almanac.js');
const REF=JSON.parse(fs.readFileSync(path.join(__dirname,'almanac-ref.json'),'utf8'));
const D=Math.PI/180,sep=ALM.sep,n180=ALM.n180,rows=[],B={};   /* B: the worst found, in the units the essay states its bounds in (″; ′ for the hand rule; s) */
const chk=(name,v,lim,unit,note='')=>{const ok=Number.isFinite(v)&&Math.abs(v)<=lim;if(!ok)process.exitCode=1;rows.push(`${ok?'  ok ':'  !! '} ${name.padEnd(64)}${(Number.isFinite(v)?v.toFixed(unit==='s'||unit==='km'?2:3):String(v)).padStart(10)} ${unit.padEnd(4)} (limit ${lim})${note?'  '+note:''}`);};
/* Horizons' times are UTC and its ΔT is held at about 69.2 s past 2026 (its forecast, not ours): the ephemerides are compared at its ΔT, with UT1 = UTC + DUT1,
   and the forecast ΔT is checked on its own */
const ut1=r=>r.jd_ut+(r.dut1||0)/86400,tOf=r=>{ALM.setDeltaT(r.dT-(r.dut1||0));return ALM.MS(ut1(r));},as3600=x=>x*3600,
  near=j=>REF.epochs.reduce((a,r)=>Math.abs(r.jd_ut-j)<Math.abs(a.jd_ut-j)?r:a);

/* 1. Meeus's examples (ΔT 0: his are in TD) */
ALM.setDeltaT(0);
{const m=ALM.moon(ALM.MS(2448724.5));chk('Meeus 47.a: the Moon\'s apparent α',as3600(m.ra-134.688470),0.5,'″');chk('Meeus 47.a: δ',as3600(m.dec-13.768368),0.5,'″');chk('Meeus 47.a: distance',m.km-368409.7,0.1,'km');
 chk('Meeus 12.a: mean sidereal time, 1987 Apr 10 0h UT',as3600(ALM.gmst(2446895.5)-197.693195),0.01,'″');chk('Meeus 12.b: at 19:21 UT',as3600(ALM.gmst(2446896.30625)-128.7378734),0.01,'″');
 const d0=49+13/60+42.48/3600;ALM.STARS.push([99,'θ Per',(2+44/60+11.986/3600)*15,d0,0.03425*15000*Math.cos(d0*D),-89.5,4.1]);const st=ALM.star(ALM.STARS.length-1,ALM.MS(2462088.69));ALM.STARS.pop();
 chk('Meeus 23.a: θ Persei\'s apparent α (cos δ), 2028 Nov 13.19',as3600(st.ra-41.5599583)*Math.cos(st.dec*D),0.5,'″');chk('Meeus 23.a: δ',as3600(st.dec-49.3520694),0.5,'″');}
ALM.setDeltaT(null);

/* 2. against the ephemerides */
{const cat=REF.stars;let bad=cat.length!==ALM.STARS.length?1:0;cat.forEach((s,i)=>{const a=ALM.STARS[i];if(!a||a[0]!==s.n||a[1].replace('’',"'")!==s.name||Math.abs(a[2]-s.ra)>1e-6||Math.abs(a[3]-s.dec)>1e-6||Math.abs(a[4]-s.pmra)>0.01||Math.abs(a[5]-s.pmdec)>0.01)bad++;});
 chk('ALM.STARS is the reference catalogue (stars that differ)',bad,0,'');}
const per=(f,lo,hi)=>REF.epochs.filter(r=>{const y=+r.utc.slice(0,4);return y>=lo&&y<hi;}).reduce((m,r)=>Math.max(m,Math.abs(f(r))),0);
const sunSep=r=>{const s=ALM.sun(tOf(r));return as3600(sep(s.ra,s.dec,r.sun.ra,r.sun.dec));},moonSep=r=>{const m=ALM.moon(tOf(r));return as3600(sep(m.ra,m.dec,r.moon.ra,r.moon.dec));};
chk('the Sun\'s apparent place against Horizons, 2026-2035 (worst)',per(sunSep,2026,2036),3,'″');
chk('the Sun, 1950-2149 (worst)',B.sun=per(sunSep,1950,2150),5,'″');
chk('the Sun\'s distance (worst, in 1e-6 au)',per(r=>(ALM.sun(tOf(r)).au-r.sun.au)*1e6,1950,2150),2,'');
chk('the Moon\'s apparent place against Horizons, 2026-2035 (worst)',per(moonSep,2026,2036),15,'″','(ΔT forecast included)');
chk('the Moon, 1950-2149 (worst)',B.moon=per(moonSep,1950,2150),30,'″');
chk('the Moon\'s distance, as the error in its parallax (worst)',per(r=>{const m=ALM.moon(tOf(r));return as3600(m.hp/60*(r.moon.km-m.km)/r.moon.km);},1950,2150),1,'″',`(the truncated series: up to ${per(r=>ALM.moon(tOf(r)).km-r.moon.km,1950,2150).toFixed(0)} km)`);
chk('the Moon\'s elongation from the Sun, the lunar distance (worst, 2026-2035)',per(r=>as3600(ALM.lunar('Sun',tOf(r))-r.elong),2026,2036),15,'″');
chk('mean sidereal time against skyfield (worst)',per(r=>(ALM.gmst(ut1(r))/15-r.gmst)*3600,1950,2150),0.1,'s','(Meeus 12.a exact: the references\' UT1 differ by this much)');
chk('apparent sidereal time, the GHA of Aries (worst)',per(r=>{tOf(r);return(ALM.gast(ut1(r))/15-r.gast)*3600;},1950,2150),0.1,'s','(0.1 s is 1.5″)');
ALM.setDeltaT(null);{const dd=r=>ALM.deltaT(2000+(r.jd_ut-2451545)/365.25)-(r.dT-(r.dut1||0));chk('ΔT against Horizons\', 1950 to 2026 (worst)',per(dd,1950,2027),1,'s');
 chk('ΔT\'s forecast against Horizons\' (each holds the last measured), 2027-2049',per(dd,2027,2050),1,'s','(a second of ΔT moves a lunar\'s GMT a second)');}
{let w=0,wn='';for(const e of REF.stars_apparent){ALM.setDeltaT((e.jd_tt-e.jd_ut)*86400);const t=ALM.MS(e.jd_ut);ALM.STARS.forEach((s,i)=>{const a=ALM.star(i,t),d=as3600(sep(a.ra,a.dec,e.ra[i],e.dec[i]));if(d>w){w=d;wn=`${s[1]}, ${e.utc.slice(0,10)}`;}});}
 B.stars=w;chk('the 58 stars\' apparent places against skyfield, 1950-2120 (worst)',w,3,'″',wn+' (its 3.7″ a year carried linearly)');}
{let ws=0,wm=0,wz=0;for(const r of REF.topo){const t=tOf({...near(r.jd_ut),jd_ut:r.jd_ut}),[la,lo,h]=r.site,s=ALM.topo(ALM.sun(t),la,lo,h),m=ALM.topo(ALM.moon(t),la,lo,h);
   ws=Math.max(ws,Math.abs(as3600(s.alt-r.sun.el)));wm=Math.max(wm,Math.abs(as3600(m.alt-r.moon.el)));if(m.alt>5)wz=Math.max(wz,Math.abs(as3600(n180(m.az-r.moon.az)*Math.cos(m.alt*D))));}
 chk('the Sun\'s topocentric altitude against Horizons (worst)',ws,5,'″');chk('the Moon\'s topocentric altitude, its parallax included (worst)',wm,20,'″');chk('the Moon\'s azimuth (× cos alt, worst)',wz,20,'″');}

{for(const[k,key]of[['Venus','venus'],['Mars','mars']]){let w=0,wu='';for(const r of REF.planets||[]){const t=tOf(r),b=ALM.planet(k,t),d=as3600(sep(b.ra,b.dec,r[key].ra,r[key].dec));if(d>w){w=d;wu=r.utc.slice(0,10);}}
  B[key]=w;chk(`${k}'s apparent place against Horizons, 1950-2049 (JPL's approximate elements: for sights, not lunars)`,w,k==='Venus'?60:120,'″',wu);}}
{for(const[k,key]of[['Jupiter','jupiter'],['Saturn','saturn']]){let w=0,wu='';for(const r of REF.outer||[]){const t=tOf(r),b=ALM.planet(k,t),d=as3600(sep(b.ra,b.dec,r[key].ra,r[key].dec));if(d>w){w=d;wu=r.utc.slice(0,10);}}
  B[key]=w;chk(`${k}'s apparent place against Horizons, 1950-2149 (its series fitted to DE440, tools/planets_fit.py)`,w,k==='Jupiter'?10:5,'″',wu);}}
ALM.setDeltaT(null);
{let wg=0,wd=0;for(let t=Date.UTC(1950,0,1);t<Date.UTC(2050,0,1);t+=8.37*864e5){const a=ALM.sun(t),h=ALM.sunHand(t);wg=Math.max(wg,Math.abs(n180(a.gha-h.gha))*60);wd=Math.max(wd,Math.abs(a.dec-h.dec)*60);}
 chk('the Sun by hand (the essay\'s formulas), 1950-2049: GHA (worst)',wg,1,'′');chk('the Sun by hand: declination (worst)',wd,1,'′');B.hand=Math.max(wg,wd);}
/* 3. round trips, from sights the almanac makes (a fixed sequence of times and places) */
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647,O={eye:6,ic:-1.4,T:18,P:1008};
{let wl=0,n=0;for(let k=0;n<200&&k<4000;k++){const t=Date.UTC(2026,0,1)+rnd()*3650*864e5,la=-60+120*rnd(),lo=-180+360*rnd(),key=rnd()<0.5?'Sun':ALM.STARS[Math.floor(rnd()*58)][1],
    B=ALM.body(key,t),p=ALM.topo(B,la,lo);if(p.alt<15||p.alt>60||Math.abs(Math.sin(p.az*D))<0.7)continue;   /* time sights: well up, near the prime vertical, as the books advise */
    const limb=key==='Sun'?'L':'C',hs=ALM.sextant(key,t,la,lo,{...O,limb}),c=ALM.correct(hs,B,{...O,limb,lat:la}),r=ALM.timeSight(la,B.dec,c.ho,B.gha,Math.sin(p.az*D)>0);
    wl=Math.max(wl,Math.abs(n180(r.lon-lo))*60*Math.cos(la*D));n++;}
 chk(`time sights (${n}, the Sun and stars): longitude back (worst, nautical miles)`,wl,0.3,'nm');}
{let we=0,wq=0,n=0;for(let k=0;n<60&&k<600;k++){const day=Date.UTC(2026,0,1)+Math.floor(rnd()*3650)*864e5,la=-55+110*rnd(),lo=-180+360*rnd(),E=-120+240*rnd(),ln=ALM.noon(lo,day+12*36e5-lo/15*36e5);
    const alt=t=>{const S=ALM.sun(t);return ALM.hcz(la,S.dec,ALM.n360(S.gha+lo)).hc;},noonAlt=alt(ln),h=noonAlt*0.55;if(h<8)continue;
    const cross=(a,b)=>{for(let i=0;i<60;i++){const m=(a+b)/2;(alt(m)<h)===(alt(a)<h)?a=m:b=m;}return(a+b)/2;},t1=cross(ln-9*36e5,ln),t2=cross(ln,ln+9*36e5);
    const r=ALM.equalAlt(la,lo,t1+E*1000,t2+E*1000);we=Math.max(we,Math.abs(r.E-E));wq=Math.max(wq,Math.abs(r.eqn));n++;}
 chk(`equal altitudes ashore (${n}): the chronometer's error back (worst)`,we,0.05,'s',`(the equation of equal altitudes up to ${wq.toFixed(1)} s)`);}
{let wt=0,wn='',ws=0,n=0,dd=0,slow=0;for(let k=0;n<150&&k<20000;k++){const t=Date.UTC(2026,0,1)+rnd()*3650*864e5,la=-50+100*rnd(),lo=-180+360*rnd(),key=ALM.LUNAR[Math.floor(rnd()*ALM.LUNAR.length)];
    const M=ALM.moon(t),B=ALM.body(key,t),pm=ALM.topo(M,la,lo),pb=ALM.topo(B,la,lo),d=ALM.lunar(key,t);if(pm.alt<10||pb.alt<10||d<20||d>110)continue;
    const L=ALM.sextantLunar(key,t,la,lo,O),r=ALM.clear(L.ds,L.hm,L.hb,key,t+25*6e4,{...O,lat:la,dr:{lat:la+0.5,lon:lo-0.5}});if(Math.abs(r.rate)<15){slow++;continue;}   /* too slow: the navigator takes another body */
    const e=Math.abs(r.gmt-t)/1000,s0=Math.abs(ALM.clear(L.ds,L.hm,L.hb,key,t+25*6e4,{...O,lat:la}).gmt-t)/1000;if(e>wt){wt=e;wn=key;}ws=Math.max(ws,s0);dd+=Math.abs(r.rate);n++;}B.lunar=wt;
 chk(`lunar distances (${n}, the Sun and Maskelyne's stars): GMT back from 25 min out, DR 30′ out (worst)`,wt,3,'s',`(${wn}; the sphere alone ${ws.toFixed(0)} s; ${slow} under 15′ an hour left out; 1′ of distance is ${(60/(dd/n)*60).toFixed(0)} s of time)`);}
{let wn=0,wp=0,nn=0,np=0;for(let k=0;(nn<80||np<80)&&k<20000;k++){const day=Date.UTC(2026,0,1)+Math.floor(rnd()*3650)*864e5,la=-60+120*rnd(),lo=-180+360*rnd();
    if(nn<80){const t=ALM.noon(lo,day+12*36e5-lo/15*36e5),S=ALM.sun(t),p=ALM.topo(S,la,lo);if(p.alt>8&&p.alt<85){const hs=ALM.sextant('Sun',t,la,lo,{...O,limb:'L'}),c=ALM.correct(hs,S,{...O,limb:'L',lat:la});
      wn=Math.max(wn,Math.abs(ALM.meridianLat(c.ho,S.dec,Math.cos(p.az*D)<0)-la)*60);nn++;}}   /* the noon sight, at the Sun's meridian passage there */
    if(np<80&&la>3){const t=day+rnd()*864e5,P=ALM.body('Polaris',t),p=ALM.topo(P,la,lo),Sn=ALM.topo(ALM.sun(t),la,lo);if(Sn.alt<-6&&p.alt>3){const hs=ALM.sextant('Polaris',t,la,lo,{...O,limb:'C'}),c=ALM.correct(hs,P,{...O,limb:'C'}),
      l=ALM.latByAlt(c.ho,P.dec,ALM.n360(P.gha+lo-0.5));wp=Math.max(wp,Math.abs(l-la)*60);np++;}}}   /* the pole star at twilight or night, the DR longitude 30′ out */
 chk(`noon sights (${nn}): latitude back (worst)`,wn,0.1,'′');chk(`the pole star (${np}, the DR longitude 30′ out): latitude back (worst)`,wp,1,'′','(it stands 0.64° from the pole: 30′ of hour angle moves it at most 30′ × sin 0.64°, 0.33′)');}
{let w=0,n=0;for(let k=0;n<60&&k<3000;k++){const t=Date.UTC(2026,0,1)+rnd()*3650*864e5,la=-60+120*rnd(),lo=-180+360*rnd(),up=ALM.STARS.map((s,i)=>i).filter(i=>{const p=ALM.topo(ALM.star(i,t),la,lo);return p.alt>20&&p.alt<70;});
    if(up.length<3)continue;const pick=[up[0],up[Math.floor(up.length/2)],up[up.length-1]],ss=pick.map(i=>{const B=ALM.star(i,t),hs=ALM.sextant(B.name,t,la,lo,{...O,limb:'C'});return{gha:B.gha,dec:B.dec,ho:ALM.correct(hs,B,{...O,limb:'C'}).ho};});
    const f=ALM.fix(ss,la+0.7,lo-0.9);w=Math.max(w,Math.hypot(f.lat-la,n180(f.lon-lo)*Math.cos(la*D))*60);n++;}
 chk(`star fixes (${n}, three stars, from 1° out): the place back (worst, nautical miles)`,w,0.3,'nm');}
/* the essay's stated accuracy (spans data-bound="…" in index.html, in ″, ′ for the hand rule, s for a lunar's GMT) must cover the worst found here */
{const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),got={};for(const m of html.matchAll(/data-bound="(\w+)"[^>]*>([\d.]+)/g))got[m[1]]=+m[2];
 for(const[k,v]of Object.entries(B))chk(`the essay states ${k} within ${got[k]??'(missing)'}: the worst found is ${v.toFixed(2)}`,got[k]!=null&&v<=got[k]?0:1,0,'');}
console.log(rows.join('\n'));
