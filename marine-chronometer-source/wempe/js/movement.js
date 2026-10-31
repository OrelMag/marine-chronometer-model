// @ts-check
/* movement.js: the Wempe Einheits-Chronometer's movement, built from the works drawings' numbers (dims.js, WD) by its groups' builders, each in its own file: the frame
   (js/frame.js, WFRAME, P1a, 14 October 2026), the going train (js/train.js, WTRAIN, P1b), the fusee, maintaining work, barrel, mainspring and chain or band (js/fusee.js,
   WFUSEE, P1c), the balance and escapement (js/escapement.js, WESC, P1d), the dial, motion work, hands and up-and-down work (js/dial.js, WDIAL, P1e).
   Part of the Wempe model (three.js r128). Units mm; the movement frame as the Hamilton's: dial side +y, 12 o'clock -z, 3 o'clock +x (dims.js: x = the sheets' W, z = their S).
   The pillar plate's inner face at y 0, its dial face at +PP_T; the top plate's inner face at -INNER, its outer face (the train side) at -INNER-TOP_T.
   Everything is built inside buildWempe, so none of its names reach the page's globals: core.js reads the Hamilton's (L, DIAL_R, SEC_L, UDA, UD_SWEEP, MSHAPE) lazily.
   Its API on mv.userData: update(s), explode(e), develop(e) (the Laid out view), setRev(v) (a version or each subassembly's), parts, R, S, DEV.
   Declares only buildWempe and ESC. */
/* parts-list lines (userData.hn, bom.json ids): the drawing's number without its spaces (as 05 09 01's title block writes it, 050901), since a piece's lines are a space-separated list */
/* ESC: the escapement's motion (js/escapement.js): the tools set the model through ESC.state(phase) (the freeze strings of audit.py, exploded.py, fine.py,
   isolate.py and bom-check.js) and pass what it returns to update(), which takes the Hamilton's MoveState and uses what it has */
const ESC=WESC.ESC;
function buildWempe(M){
  /* the gilt as Wempe 3955's photographs show it (photocompare.py, its A and N views, the same patches in photograph and render): its polished wheels hue 0.10, saturation
     0.64-0.73, its plates 0.59, against the core's gilt rendered 0.34-0.51 (the photographs' neutral steel 4 % warm at most). This page's own materials (the Hamilton's untouched) */
  if(!M.gilt.userData.wempe){M.gilt.userData.g0=[M.gilt.color.clone(),M.gilt.roughness];M.gilt.color=sc(0xc88a32);M.gilt.userData.wempe=1;}
  /* steel tempered to light blue at 310° (the sheets' "310° hell-blau anlassen": the maintaining detent 050505-1, the maintaining spring 05 06 01-1), not the deep blue of 295°
     (M.blued: the fusee's clicks); Wempe 3955's and Kirov 247's maintaining detents photograph pale grey (photocompare.py, their N views). Until 18 October 2026 M.blued */
  if(!M.blue310){M.blue310=M.blued.clone();M.blue310.color=sc(0x8d9cb8);M.blue310.roughness=0.3;}
  const mv=new THREE.Group(),K=KIT.parts(mv,M);mv.userData.onRev=[];   /* the sheets' two states (setRev, below): each builder's moves for them */
  const FR=WFRAME.build(mv,M,K);   /* the frame: plates, pillars, ring, bridges, cocks, bushes, their screws and pins */
  /* Variants' Finish: 'hammered' (the default, as above and frame.js's M.giltH) or 'plain', the page's gilt until 18 October 2026: the core's plain gilt on every gilt part,
     the plates and bridges without the hammering (the 6MX's stripes kept, in that colour). See-through and faded copies follow on the next look() (syncMat) */
  M.setFinish=k=>{const p=k==='plain',g=M.gilt.userData.g0,H=M.giltH,f=H&&H.userData.fin;M.gilt.color.copy(p?g[0]:sc(0xc88a32));for(const m of Object.values(M.gilt6||{}))m.color.copy(M.gilt.color);
    if(f){if((H.map===null)!==p){H.map=p?null:f.map;H.normalMap=p?null:f.normalMap;H.needsUpdate=true;}H.color.copy(p?g[0]:f.color);H.roughness=p?g[1]:f.rough;}};
  const TR=WTRAIN.build(mv,M,K);   /* the going train: the centre, intermediate and seconds arbors, their bushes and the seconds jewel */
  const EB=WESC.build(mv,M,K);   /* the balance, hairspring, rollers, escape wheel, detent and their jewels */
  const DL=WDIAL.build(mv,M,K);   /* the dial, motion work, hands and up-and-down work */
  /* the seconds wheel drives the escape pinion (train.js's meshes, phased under load by gearLash as the train's own: -1, the seconds arbor clockwise from the dial); the
     escape wheel's own teeth keep their phase to the locking stone, the pinion's leaves turned on its arbor */
  {const sw=TR.sw.userData.wheel,[a,b]=gearLash(sw,WD.H[35],EB.R.pinion,WD.H[26],-1);sw.rotation.y=a;EB.R.pinion.rotation.y=b;EB.R.pinion1.rotation.y=gearLash(sw,WD.H[35],EB.R.pinion1,WD.H[26],-1)[1];}
  const FU=WFUSEE.build(mv,M,K,FR,TR);   /* the fusee and its wheel, the maintaining work and detent, the stop work, the barrel, its arbor and set-up ratchet, the mainspring, the chain and the band */
  K.done();
  /* setRev(v): the version shown (app.js's Variants): the sheets as last revised ('last', about 1946-48, the page's default), as first drawn ('first', 1940-44), the Soviet
     copy made from them ('6mx', Kirov No. 247 of 1952), or the escapement of 1943 as photographed ('1943': the sheets as last revised but for the escapement, at the heights
     the sheets first drew with the 1943 detent block, as Kirow DEC 422 and 479 and Lange 5177 are made). Each part keeps its key; the pieces not every version has are in
     groups whose userData.rev lists the versions they show in ('last 6mx 1943': the revised sheets' pieces the 6MX and 1943 kept), the others hidden as the band is (the
     tools skip what isn't shown), and each builder's onRev(v) moves what they share but stands elsewhere */
  /* '3955': Wempe 3955 as photographed (References/wempe/photos/dg-chrono-dec, photocompare.py): the first-drawn sheets' pieces but where its photographs show another form,
     so 'first' stays the drawings' fallback. A group listed 'first' shows in both, '3955' in the photographed version only, 'first -3955' in the drawn one only (revShows) */
  /* Each version's pieces and moves belong to one of the movement's subassemblies (SUBS; the Variants' Subassemblies, 27 October 2026, the owner's choice: each chosen on its
     own, the parts tied by their heights kept in one, so every mix runs): a group's userData.sub, set where it is built or else its part's (PSUB), an onRev's f.sub ('*': the
     whole mix). setRev(v) takes a version for all of them (a preset: the tools' states) or a mix {esc:'first', ...} (the others as last revised); mv.userData.rev is the
     version all of them show, or 'mix'; mv.userData.mix each one's */
  const SUBS=['esc','fusee','barrel','train','dial','frame','case','key'];mv.userData.subs=SUBS;
  const PSUB=/** @type {Record<string,string>} */({});for(const[s,ks]of/** @type {[string,string][]} */([['esc','balance hairspring rollers escapeWheel detent detentBlock escJewelUp escJewelLow escEndstoneUp escEndstoneLow balanceJewelsUp balanceJewelsLow dustBush upperCock lowerCock'],
    ['fusee','fusee maintaining maintDetent'],['barrel','barrel barrelArbor setupRatchet mainspring'],['train','centreWheel intermediateWheel secondsWheel intermediateBridge'],['dial','dial changeWheel hourWheel udWheel hands']]))for(const k of ks.split(' '))PSUB[k]=s;
  mv.userData.subOf=(/** @type {string} */k)=>PSUB[k]||'frame';
  const RV=[];{const key=new Map();for(const k in mv.userData.parts)key.set(mv.userData.parts[k],k);
    mv.traverse(o=>{if(!o.userData.rev||o===mv)return;RV.push(o);if(o.userData.sub)return;let p=o,s=null;for(;p&&!s;p=p.parent)s=p.userData.sub||(key.has(p)?mv.userData.subOf(key.get(p)):null);o.userData.sub=s||'frame';});}
  mv.userData.revs=['last','first','3955','6mx','1943'];
  /* TIES: [a, va, b, vb], a shows va if and only if b shows vb: the 6MX's escapement and its plates (the top plate's holes for its detent block and its horn are the 6MX's own),
     its dial and its plates (fine.py: the 6MX's dial in the drawings' ring, or theirs in its, 1.0 mm3 2.0 deep at its fixing) */
  const TIES=[['esc','6mx','frame','6mx'],['dial','6mx','frame','6mx']];mv.userData.ties=TIES;
  const revShows=(/** @type {string} */l,/** @type {string} */v)=>{const L=l.split(' ');return L.includes(v)||(v==='3955'&&L.includes('first')&&!L.includes('-3955'));};mv.userData.revShows=revShows;
  /* mixOf(v, ch): a preset's or a mix's versions, each subassembly's, held to TIES; shows(o): o's pieces in the mix shown (whatever the contact) */
  const mixOf=(/** @type {any} */v,/** @type {string=} */ch=undefined)=>{const m=/** @type {Record<string,string>} */({});for(const s of SUBS){const x=typeof v==='string'?v:v&&v[s];m[s]=mv.userData.revs.includes(x)?x:'last';}
    const fx=new Set(),Q=ch?[ch]:[];for(const s0 of SUBS){if(!fx.has(s0)&&!Q.length)Q.push(s0);while(Q.length){const p=/** @type {string} */(Q.shift());if(fx.has(p))continue;fx.add(p);   /* from ch, the one just chosen, along the ties: each settled once, so its choice holds */
      for(const[a,va,b,vb]of TIES)for(const[x,vx,q,vq]of[[a,va,b,vb],[b,vb,a,va]])if(x===p&&!fx.has(q)){if(m[p]===vx)m[q]=vq;else if(m[q]===vq)m[q]='last';Q.push(q);}}}
    return m;};mv.userData.mixOf=mixOf;
  const shows=(/** @type {any} */o,/** @type {any=} */m)=>revShows(o.userData.rev,(m||mv.userData.mix)[o.userData.sub||'frame']||'last');mv.userData.shows=shows;
  /* setContact(on): the 6MX's electrical seconds contact (its groups flagged userData.contact: train.js's on the pillar plate and on the seconds arbor) shown or not in its
     version; on when built, so the tools weigh and check it; the page hides it unless asked (app.js's setCt) */
  mv.userData.ctOn=true;const vis=(/** @type {any} */o)=>shows(o)&&(!o.userData.contact||mv.userData.ctOn&&mv.userData.mix.frame==='6mx');   /* the contact's base through the 6MX's pillar plate */mv.userData.vis=vis;
  mv.userData.setRev=(/** @type {any} */v)=>{const m=mixOf(v);mv.userData.mix=m;const u=SUBS.map(s=>m[s]);mv.userData.rev=u.every(x=>x===u[0])?u[0]:'mix';
    for(const o of RV)o.visible=vis(o);for(const g of mv.userData.onRev)g(g.sub==='*'?m:m[g.sub||'esc']);};
  mv.userData.setContact=(/** @type {boolean} */on)=>{mv.userData.ctOn=!!on;for(const o of RV)if(o.userData.contact)o.visible=vis(o);};
  /* subOpts(extra, cards): each subassembly's choices, the versions that show it alike (its groups here and in extra, the case's; cards(s, v) a key for the cards it takes)
     in one: {esc: [['last'], ['first'], ...], frame: [['last','first','1943'], ['3955'], ['6mx']], ...} */
  mv.userData.subOpts=(/** @type {any[]} */extra,/** @type {(s:string,v:string)=>string} */cards)=>{const all=[...RV,...(extra||[])],O=/** @type {Record<string,string[][]>} */({});
    for(const s of SUBS){const G=all.filter(o=>(o.userData.sub||'frame')===s),C=/** @type {Record<string,string[]>} */({});
      for(const v of mv.userData.revs){const k=G.map(o=>revShows(o.userData.rev,v)?1:0).join('')+'|'+(cards?cards(s,v):'');(C[k]=C[k]||[]).push(v);}O[s]=Object.values(C);}return O;};
  mv.userData.setRev('last');
  /* update(s): the Hamilton's MoveState ({E, th, lift, psDef, n, winding, ...}). E, the escape wheel's place in teeth, turns the train (WTRAIN: its arbors' angles, ang.c the
     centre arbor's, which the motion work and the fusee wheel follow, ang.s the seconds arbor's, which carries the seconds hand) and the escape wheel; th the balance's
     angle (rad), lift the detent's turn and psDef the gold spring's (rad, escapement.js); n, the fusee's turns from full wind, and winding set the fusee, the chain or band,
     the barrel and the mainspring (WFUSEE), and the motion work, hands and up-and-down work follow the train's angles and the fusee's (ang.f) (WDIAL) */
  mv.userData.update=(/** @type {any} */s)=>{const ang=TR.update(s);ang.f=FU.update(s,ang.c);mv.userData.ang=ang;EB.update(s);DL.update(s,ang);};
  mv.userData.R={fr:FR,tr:TR,esc:EB.R,fu:FU,dl:DL.R};mv.userData.S={pil:WD.PILLARS};   /* the tools read R and S on the Hamilton; R.tr the train's arbors (their wheel and pinion meshes, for the other groups' tooth phasing) */
  /* ---------- laid out: buildWempe.DEV (below) ---------- */
  const DEV=buildWempe.DEV;
  /* driven pinions: when a pair's line of centres turns by D, the driver standing, the pinion turns D(1 + driver's teeth / its leaves) to stay in mesh (a coin rolled round a
     coin); the escape pinion less the turn of its frame. Taken within half a pitch, on top of the loaded phase gearLash gave it (r0): the fusee wheel (90) drives the centre
     pinion, the centre wheel the intermediate's, the intermediate wheel the seconds', the seconds wheel the escape pinion (both states' pinions) */
  const PT=mv.userData.parts,dOf=(/** @type {string} */k)=>DEV.sub(DEV.P[k],DEV.A[k]),dC=dOf('C'),dE=dOf('E'),E0=DEV.A.E,gz=(/** @type {any} */m)=>m.userData.gear.z;
  const DPH=/** @type {[any,string,string,number,number][]} */([[TR.cw.userData.pin,'Fu','C',90,0],[TR.tw.userData.pin,'C','T',gz(TR.cw.userData.wheel),0],[TR.sw.userData.pin,'T','S',gz(TR.tw.userData.wheel),0],
    [EB.R.pinion,'S','E',gz(TR.sw.userData.wheel),DEV.g],[EB.R.pinion1,'S','E',gz(TR.sw.userData.wheel),DEV.g]]).map(([m,a,b,na,x])=>{const nb=gz(m),p=TAU/nb,c=(DEV.fi(DEV.w)-DEV.fi(DEV.sub(DEV.A[b],DEV.A[a])))*(1+na/nb)-x;
    return{m,r0:m.rotation.y,c:(((c+p/2)%p)+p)%p-p/2};});
  const DMV=/** @type {[any,number[]][]} */([...['centreWheel','cannon','changeWheel','hourWheel','hands'].map(k=>[PT[k],dC]),[PT.intermediateWheel,dOf('T')],[PT.secondsWheel,dOf('S')],
    [DL.R.sh,DEV.sub(dOf('S'),dC)],[DL.R.uh,[-dC[0],-dC[1]]]]);   /* the seconds and up-and-down hands are in the hands' part, which goes with the centre arbor */
  for(const[o]of DMV)o.userData.xz0=[o.position.x,o.position.z];
  const EFP=['escapeWheel','detent','detentBlock','balance','rollers','hairspring','stud'].map(k=>PT[k]);
  /* schematic plates for the laid-out view, drawn see-through (the viewer, devPlate), standing in for the frame, whose holes no longer meet the arbors: the pillar plate and
     top plate along the line at their own heights and wide enough for the barrel (Ø 41.6) and fusee wheel, the intermediate bridge on the dial side under the intermediate and
     seconds arbors, a bridge over the barrel's arbor, the lower cock hanging from the top plate and the upper cock over the balance on a foot, and three pillars (Ø 8.1) beside
     the line clear of the wheels, the chain and the detent. Not parts (no partName: not listed, sectioned or checked as the movement's; schematic), but each stands in for
     its part (devOf, its piece pc), whose card a click on it opens while laid out (the viewer); the barrel bridge's runs from the barrel's arbor to the click's screw (hole
     46, 12.0 off the line), as the real bridge does, so the click (r′ in a textbook's developed drawing, "Modern chronometer movement", Figs. 83-84), kept shown laid out (devKeep), hangs from it */
  {const dp=new THREE.Group();mv.add(dp);const w=DEV.w,n=[-w[1],w[0]],at=(/** @type {number} */t,s=0)=>[DEV.A.Ba[0]+w[0]*t+n[0]*s,DEV.A.Ba[1]+w[1]*t+n[1]*s],tB=DEV.t('B'),TI=-WD.INNER,TT=TI-WD.TOP_T,PPT=WD.PP_T,PW=48;
    const dg=(/** @type {string} */k,/** @type {string} */pc)=>{const g=new THREE.Group();g.userData.devOf=k;if(pc)g.userData.pc=pc;dp.add(g);return g;},H46=WD.H[46],B0=DEV.A.Ba,l46=Math.hypot(H46[0]-B0[0],H46[1]-B0[1]),bb0=[B0[0]-(H46[0]-B0[0])*5/l46,B0[1]-(H46[1]-B0[1])*5/l46];
    mesh(dg('pillarPlate','plate'),KIT.stadium(at(0),at(tB),PW,PPT),M.gilt,0,0,0);mesh(dg('topPlate','plate'),KIT.stadium(at(0),at(tB),PW,WD.TOP_T),M.gilt,0,TT,0);
    mesh(dg('intermediateBridge','bridge'),KIT.stadium(at(DEV.t('T')-5),at(DEV.t('S')+5),10,3.8),M.gilt,0,PPT,0);mesh(dg('barrelBridge','bridge'),KIT.stadium(bb0,H46,14,3.32),M.gilt,0,TT-3.32,0);
    {const g=dg('lowerCock','cock');mesh(g,KIT.stadium(at(tB),at(tB+12),8,3.22),M.gilt,0,TI+10-3.22,0);cylBetween(g,3,TI,TI+10,M.gilt,...at(tB+12),32);}
    {const g=dg('upperCock','cock');mesh(g,KIT.stadium(at(tB),at(tB+18),9,2.4),M.gilt,0,TT-15,0);cylBetween(g,3.5,TT-12.6,TT,M.gilt,...at(tB+18),32);}
    {const g=dg('pillars','');for(const[t,s]of[[22,19],[22,-19],[DEV.t('E'),19]])cylBetween(g,WD.PIL.r,TI,0,M.brass,...at(t,s),48);}
    dp.traverse(o=>{if(o.isMesh){o.userData.devPlate=true;o.userData.noCap=true;o.visible=false;}});}
  /* develop(e): 0 as built, 1 laid out in a line; moves only x, z and the turn about y, so it combines with the explode */
  mv.userData.develop=(/** @type {number} */e)=>{for(const[o,d]of DMV){o.position.x=o.userData.xz0[0]+d[0]*e;o.position.z=o.userData.xz0[1]+d[1]*e;}
    const a=DEV.g*e,c=Math.cos(a),s=Math.sin(a);for(const g of EFP){g.rotation.y=a;g.position.x=E0[0]+dE[0]*e-(E0[0]*c+E0[1]*s);g.position.z=E0[1]+dE[1]*e-(-E0[0]*s+E0[1]*c);}
    for(const q of DPH)q.m.rotation.y=q.r0+q.c*e;};
  mv.userData.DEV=DEV;
  /* ---------- the subassemblies (31 October 2026, the owner's: the Exploded view's Subassemblies, Apart, and Isolate subassembly): the units the 1958 Soviet repair book
     takes out whole (checks.py's ASSEMBLY, pp. 59-60: its steps 3, 4, 6, 7 with 9, and 14), each a list of parts (t its name on the page). Those with a place, to [x, z]
     (mm; the Exploded view's right is (-0.589, 0.808) in mv's frame, its yaw 2.2, the movement turned train side up: barrel 120 to the left, fusee 105 and balance 160 to the right), are taken apart beside the movement: moved there, every part at its anchor's rise (at), then spread
     along their arbor by sp (mm toward the dial, +y) and pc (pieces inside a part, [part, its line, mm, 1: the part's group that holds it, not the mesh]), in the order
     they come apart, each about 10 clear of the next: laid out for the view, not measured. The fusee's: the stop work and the cover plate off the cone's top, the click wheel, the
     maintaining ratchet with its clicks, the wheel with the maintaining spring pinned in it, the Vorreiber; the barrel's: the mainspring, the lid and the set-up ratchet off the
     bridge's side, the arbor off the dial's; the balance's: the rollers below, the hairspring with its stud above ---------- */
  const ASM=[{k:'fusee',t:'Fusee',parts:['fusee','fuseeWheel','maintaining','vorreiber','stopWork','coverPlate'],at:'fusee',to:[-62,85],sp:{stopWork:-12,coverPlate:-26,maintaining:20,fuseeWheel:32,vorreiber:44},pc:[['fusee','050604-3',10],['maintaining','050601-1',12,1]]},
    {k:'barrel',t:'Barrel',parts:['barrel','barrelArbor','mainspring','setupRatchet'],at:'barrel',to:[71,-97],sp:{mainspring:-28,barrelArbor:44,setupRatchet:-46},pc:[['barrel','050701-2',-40]]},
    {k:'balance',t:'Balance',parts:['balance','hairspring','stud','rollers'],at:'balance',to:[-94,129],sp:{rollers:18,hairspring:-22,stud:-22}},
    {k:'detent',t:'Detent',parts:['detent','detentBlock']},{k:'motion',t:'Motion work',parts:['hourWheel','changeWheel','cannon','udWheel','udPinion']}];
  mv.userData.asm=ASM.map(a=>({k:a.k,t:a.t,parts:a.parts.filter(k=>PT[k]),apart:!!a.to}));
  /* asmx(s, e): s 0 together, 1 apart; e the explode's share. Run after explode(e) and develop (the viewer's loop), which set the parts' groups outright each frame, so it
     adds to them; the parts develop doesn't move, and the pieces inside parts (which nothing else moves: update() only turns them), it sets outright */
  {const DS=new Set([...DMV.map(d=>d[0]),...EFP]),AX=/** @type {any[]} */([]);
    for(const a of ASM){if(!a.to)continue;const oA=PT[a.at].userData.off,sp=/** @type {Record<string,number>} */(a.sp);
      for(const k of a.parts){const g=PT[k];if(g)AX.push({o:g,d:oA-g.userData.off,dy:sp[k]||0,to:a.to,add:DS.has(g),x0:g.position.x,z0:g.position.z});}
      for(const[k,h,dy,gp]of/** @type {[string,string,number,number?][]} */(a.pc||[])){const g=PT[k],S=new Set();if(!g)continue;
        g.traverse(o=>{if(!o.isMesh||!(o.userData.hn||'').split(' ').includes(h))return;let q=o;if(gp)while(q.parent&&q.parent!==g)q=q.parent;S.add(q);});
        for(const o of S)AX.push({o,dy,y0:o.position.y});}}
    mv.userData.asmx=(/** @type {number} */s,/** @type {number} */e)=>{for(const q of AX){const o=q.o;if(q.y0!=null){o.position.y=q.y0+q.dy*s;continue;}
      o.position.y+=s*(q.d*e+q.dy);if(q.add){o.position.x+=q.to[0]*s;o.position.z+=q.to[1]*s;}else{o.position.x=q.x0+q.to[0]*s;o.position.z=q.z0+q.to[1]*s;}}};}
  return mv;
}
/* ---------- laid out (the Hamilton's Laid out view, its movement.js's DEV: the textbooks' developed drawing): the barrel and fusee stay, and with them all they carry; each
     later arbor goes onto the barrel-fusee line at its real centre distance from the one before (the hole tables': 22.65, 18.12, 12.63, 11.85, the balance 10.00 from
     the escape arbor), so every pair still meshes; the escape wheel, detent, its block, the balance, rollers, hairspring and stud turn together about the escape arbor
     (DEV.g), so the escapement is unchanged and the balance ends the line. The motion work and hands go with the centre arbor, the seconds hand with the seconds arbor;
     the up-and-down wheel stays on the fusee's pinion and its hand with it ---------- */
/* buildWempe.DEV: the line (w its direction from the barrel through the fusee), each arbor as built (A) and laid out (P), t(k) how far along the line from the barrel,
   g the escapement's turn, mid the line's middle (app.js's Laid out view aims there) */
buildWempe.DEV=(()=>{const H=WD.H,A={Ba:H[45],Fu:H[10],C:H[1],T:H[38],S:H[35],E:WESC.W,B:WESC.B},sub=(/** @type {number[]} */a,/** @type {number[]} */b)=>[a[0]-b[0],a[1]-b[1]],fi=(/** @type {number[]} */p)=>Math.atan2(-p[1],p[0]);
  const d=sub(A.Fu,A.Ba),l=Math.hypot(d[0],d[1]),w=[d[0]/l,d[1]/l],/** @type {{[k:string]:number[]}} */P={Ba:A.Ba,Fu:A.Fu},t=(/** @type {string} */k)=>(P[k][0]-A.Ba[0])*w[0]+(P[k][1]-A.Ba[1])*w[1];
  for(const[a,b]of[['Fu','C'],['C','T'],['T','S'],['S','E'],['E','B']]){const r=Math.hypot(...sub(A[b],A[a]));P[b]=[P[a][0]+w[0]*r,P[a][1]+w[1]*r];}
  return{A,w,P,t,fi,sub,g:fi(w)-fi(sub(A.B,A.E)),mid:[(A.Ba[0]+P.B[0])/2,(A.Ba[1]+P.B[1])/2]};})();
