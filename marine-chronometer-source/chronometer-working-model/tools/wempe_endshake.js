// The Wempe's arbors' endshake from the sheets' fits, for wempe_bench.js (the bench's test) and wempe_thermal_frame.js (the endshake in heat and cold): each arbor's
// bearings' distance and its length between shoulders, each term [what, as drawn in the model (mm), lower, upper deviation, 'drawn' (the sheet's tolerance) or 'est'
// (none given: the deviation estimated), the sheet; a term named so with the same sheet is one part, shared]; the plates' inner faces apart are the pillar's 19.6 ±0.04
// less its two seats 0.3 +0.03 deep (05 08 00-1, 05 09 01 Schnitt L-M, 05 08 02-1 Schnitt E-F). The model draws each (train.js, fusee.js, escapement.js) at the figures
// in the second place. Moved here from wempe_bench.js on 27 October 2026, unchanged.
//   const{ARB,ESB}=require('./wempe_endshake.js');   each arbor's gap and arbor terms, drawn, range (the sheets' tolerances' ends) and band (the 1958 book's)
const r4=x=>+(+x).toFixed(4);
const INNER=[['the pillar between shoulders',19.6,-0.04,0.04,'drawn','05 08 00-1 (±0.04, likely: ±0.01 until 28 October 2026, drawing check 2, 9-M8)'],['less its seat in the top plate',-0.3,-0.03,0,'drawn','05 09 01'],['less its seat in the pillar plate',-0.3,-0.03,0,'drawn','05 08 02-1']];
const ARB=[
  {id:'centre',name:'the centre arbor',gap:[...INNER,['WN-302 set under the pillar plate\'s face',0.11,-0.01,0.01,'drawn','05 08 02 Schnitt A-B (0.1 +0.02, at its middle since 28 October 2026)']],arbor:[['its shoulders apart',19.03,-0.03,0.02,'drawn','05 05 03-2 (19 +0.05, framed)']]},
  {id:'intermediate',name:'the intermediate arbor',gap:[...INNER,['the top plate',3.35,-0.02,0.02,'est','05 09 01 (3.35; the pillar plate\'s struck ±0.02)'],['WN-300 set into the bridge',0.71,-0.01,0.01,'drawn','05 08 04 (0.7 +0.02)']],arbor:[['its shoulders apart',23.0,-0.05,0.05,'drawn','05 05 02-2 (23.05 −0.1)']]},
  {id:'seconds',name:'the seconds arbor',gap:[...INNER,['the top plate',3.35,-0.02,0.02,'est','05 09 01 (3.35; the pillar plate\'s struck ±0.02)'],['the jewel\'s face in the bridge',1.75,-0.02,0.02,'est','05 08 04 (1.7, no tolerance)']],arbor:[['its shoulders apart',24.05,-0.05,0.05,'drawn','05 05 01-2 (24.1 −0.1)']]},
  {id:'escape',name:'the escape arbor',gap:[['its endstones apart',22.84,-0.02,0.02,'est','its settings (no figure): the arbor\'s 22.78 and 0.06, the 1958 book\'s middle (22.82 until 25 October 2026)']],arbor:[['its pivots\' ends apart',22.78,0,0.02,'drawn','05 04_7-1 (22.8 −0.02)']]},
  {id:'fusee',name:'the fusee arbor',gap:[...INNER,['the fusee bush\'s end past the top plate\'s face',0.75,-0.02,0.02,'est','05 08 01-2']],arbor:[['its shoulders apart',19.7,0,0.05,'drawn','05 06 04-1 (19.7 +0.05); face a re-turned at assembly (05 06 00-2)']]},
  {id:'barrel',name:'the barrel arbor',gap:[...INNER,['its bearings past the inner faces',3.29,-0.02,0.02,'est','05 08 05, 05 07 02']],arbor:[['its shoulders apart',22.23,-0.03,0.07,'drawn','05 07 02 (22.2 +0.1)']]}];
const sum=(t,k)=>t.reduce((a,x)=>a+x[1]+(k==='lo'?x[2]:k==='hi'?x[3]:0),0);
for(const a of ARB){a.drawn=r4(sum(a.gap)-sum(a.arbor));a.range=[r4(sum(a.gap,'lo')-sum(a.arbor,'hi')),r4(sum(a.gap,'hi')-sum(a.arbor,'lo'))];}
/* the band at 20 °C, each arbor's: the Soviet Navy's MX repair book (Эксплуатация и ремонт измерителей времени, 1958, Appendix 4, pp. 128-129: the fusee 0.08-0.12, the barrel,
   centre, intermediate and seconds arbors 0.07-0.10, the escape pinion 0.05-0.07; the balance staff 0.04-0.06 at its endstones); the Wempe's sheets give none. Until 19 October 2026
   one band for all, 0.01-0.08 (estimated: the Hamilton manual's 0.003 in, Ops. 15, 69, 74) */
const ESA={centre:[0.07,0.10],intermediate:[0.07,0.10],seconds:[0.07,0.10],barrel:[0.07,0.10],escape:[0.05,0.07],fusee:[0.08,0.12]},ESB=[0.05,0.12];
for(const a of ARB)a.band=ESA[a.id];
module.exports={INNER,ARB,ESA,ESB,sum};
