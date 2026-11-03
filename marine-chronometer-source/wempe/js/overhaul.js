/* overhaul.js: the Wempe's overhaul, in the order the Soviet Navy's repair book gives for the MX (Эксплуатация и ремонт измерителей времени, 1958, pp. 59-60,
   "Порядок разборки и сборки": References/wempe/documents/Ekspluatatsiya-i-remont-izmeritelei-vremeni-1958/p059.png, p060.png), the Hamilton's overhaul
   (../../chronometer-working-model/js/overhaul.js) on this page. The book takes the movement down in one paragraph and puts it back in another; where it says only
   "and all the parts" the order is checks.py's ASSEMBLY (tools/assembly.py checks its clearance), marked estimated. Its figures are the book's: the escapement's
   four checks (p. 60), the endshakes (Appendix 4, pp. 128-129), the oils (Appendix 5, p. 132, printed small and turned: its MX column read as best it can be). It
   names no cleaning, no tools but the key, no oil for the escapement. Each step's parts move as the Exploded view moves them (each part's rise, part(name, off) in
   kit.js, a screw's lift), or along a path of straight legs (PATH: the detent's block out sideways under the top plate, as ASSEMBLY's step 6 has it); what rides
   on another until its own step rides with it (HOST). One IIFE; the page sees only OVH. app.js calls OVH.bind() once the model is built, and OVH.frame() each
   frame after the Exploded view's offsets are set (the viewer's cfg.after) */
"use strict";
const OVH=(()=>{
  /* what rides on another until its own step (or for good): an id, a part ('@name'); a piece whose step never names it rides on the part it is built in */
  const HOST={'@balance':'@upperCock','@hairspring':'@balance','@stud':'@balance','@rollers':'@balance','@balanceJewelsUp':'@upperCock','WN-55.ck':'@balanceJewelsUp','WN-11':'@stud',
    '@detent':'@detentBlock','@barrelArbor':'@barrel','@mainspring':'@barrel',
    '@fuseeBush':'@topPlate','WN-34':'@fuseeBush','@lowerCock':'@topPlate','WN-53':'@lowerCock','@balanceJewelsLow':'@lowerCock','WN-18':'@balanceJewelsLow',
    '@escJewelUp':'@topPlate','@escEndstoneUp':'@escJewelUp','WN-es':'@escEndstoneUp',
    '@fuseeWheel':'@fusee','@maintaining':'@fusee','@coverPlate':'@fusee','WN-20':'@coverPlate','@vorreiber':'@fusee','@stopWork':'@fusee','WN-52':'@intermediateBridge','WN-10.d':'@dial'};
  /* sd the side up: c the movement in its case, t train side up (the book's "dial down", the movement on the bowl), d dial side up. out, in: what comes off, goes
     on; fc: what to look at; a: 'down' lets the mainspring and the maintaining spring down (the wind run out), 'wind' winds it; est: the book doesn't give this
     step or its place (ASSEMBLY's order, or the step the book's next one needs) */
  const DIS=[
    {sd:'c',t:'Out of the gimbals; the bezel off',x:'Take the chronometer out of its gimbals. Unscrew the bezel with its glass.',fc:['@dial']},
    {sd:'t',t:'Onto the bowl, dial down',x:'Lift the movement out and stand it on the bowl, dial side down: the bowl is the stand for the work on the train side.'},
    {sd:'t',t:'Let the mainspring down',x:'Put the winding key on the fusee’s square, hold the click away and let the mainspring down smoothly, turning the key counterclockwise.',fc:['@fusee','@barrel','@chain'],a:'down',tl:'the winding key'},
    {sd:'t',t:'Let the maintaining spring down',x:'Free the maintaining detent from the fusee’s ratchet: hold the detent away and let the ratchet down.',fc:['@maintDetent','@maintaining']},
    {sd:'d',t:'Turn it over; the hands',x:'Turn the movement over, dial side up. Take off the seconds hand, the up-and-down hand, the minute hand and the hour hand.',out:['@hands']},
    {sd:'d',t:'The dial',x:'Take off the dial.',out:['@dial']},
    {sd:'d',t:'The motion work and the up-and-down pinion',x:'From the dial side, take off the wheels of the motion work, the cannon pinion and the up-and-down pinion. (The up-and-down wheel comes off with them: the book says “the wheels of the motion work”.)',out:['@hourWheel','@changeWheel','@udWheel','@cannon','@udPinion']},
    {sd:'t',t:'Turn it over; the balance cock’s screw',x:'Turn the movement over and stand it dial side down. Unscrew the balance cock’s screw.',out:['WN-ucs']},
    {sd:'t',t:'The balance cock and the balance',x:'Take off the balance cock and the balance: the balance comes out hanging in the cock’s jewel, lifted with it. (The cock’s arm lies 1.6 mm under the fusee arbor’s cork washer, which the book takes off later: a repairer lifts the cock clear of its seat and draws it out from under the washer. The model lifts it straight, through the washer.)',out:['@upperCock']},
    {sd:'t',t:'The detent’s block',x:'Take off the detent’s block. (Its fixing screw comes out of the top plate’s outer face; the block, with the detent, drops off its two steady pins and slides out under the top plate between the pillars, the stone drawn back out of the escape wheel’s teeth: estimated. The book’s “ходовая пружина” here is the detent spring, not the mainspring.)',out:['WN-gk','@detentBlock']},
    {sd:'t',t:'The barrel arbor’s ratchet',x:'Then take off the barrel arbor’s ratchet. (Its click, with its screw, comes off the barrel bridge too: the book puts it back at assembly.)',out:['@setupRatchet','050805-2','WN-22']},
    {sd:'t',t:'The barrel bridge',x:'Unscrew the two screws that hold the barrel bridge, and take it off.',out:['WN-55','@barrelBridge']},
    {sd:'t',t:'The barrel and the chain',x:'Let down, the chain lies all on the barrel: unhook its end from the fusee and lift out the barrel with it, with its arbor and mainspring. (Not in the book: it says only “and all the parts”. Estimated.)',out:['@chain','@barrel'],est:1},
    {sd:'t',t:'The cork washer, flange and washer',x:'Take off the fusee arbor’s cork washer, its flange and its washer.',out:['@corkRing','@dustBush','@dustPlate']},
    {sd:'t',t:'The top plate',x:'Unscrew the three screws and take off the top plate, with its fusee bush, the lower balance cock and the jewels in it.',out:['WN-57','@topPlate']},
    {sd:'t',t:'The escape wheel',x:'Take out the escape wheel. (From here on the book says only “take all the parts apart”: the order is estimated, the one tools/assembly.py checks for clearance.)',out:['@escapeWheel'],est:1},
    {sd:'t',t:'The maintaining detent',x:'Take out the maintaining detent.',out:['@maintDetent'],est:1},
    {sd:'t',t:'The fusee',x:'Lift out the fusee with its wheel, maintaining work and stop work.',out:['@fusee'],est:1},
    {sd:'t',t:'The seconds, centre and intermediate wheels',x:'Take out the seconds wheel, the centre wheel and the intermediate wheel.',out:['@secondsWheel','@centreWheel','@intermediateWheel'],est:1},
    {sd:'d',t:'The intermediate bridge',x:'Turn the plate over and unscrew the intermediate bridge from its dial side.',out:['@intermediateBridge'],est:1}];
  const RE=[
    {sd:'t',t:'The barrel and the fusee first',x:'At assembly, put the barrel and the fusee together first: the barrel with its arbor and mainspring, the fusee with its wheel, maintaining work and stop work.',fc:['@barrel','@fusee']},
    {sd:'d',t:'The intermediate bridge',x:'Screw the bridge of the intermediate and seconds wheels to the pillar plate.',in:['@intermediateBridge']},
    {sd:'t',t:'The lower balance cock',x:'Screw the lower balance cock to the top plate. (The top plate stands off the movement here; the cock goes on with it.)',fc:['@lowerCock','@topPlate']},
    {sd:'t',t:'The plate on the bowl; the wheels and the fusee',x:'Stand the pillar plate on the bowl, dial side down. Put in the intermediate, centre and seconds wheels, the fusee, the maintaining detent, the fusee’s ratchet, and the escape wheel.',in:['@intermediateWheel','@centreWheel','@secondsWheel','@fusee','@maintDetent','@escapeWheel']},
    {sd:'t',t:'The top plate',x:'Put the top plate on the pillars and screw it down with its three screws.',in:['@topPlate','WN-57']},
    {sd:'t',t:'The barrel and its bridge',x:'Then put in the barrel and the barrel bridge, and screw the bridge to the top plate with its screws.',in:['@barrel','@barrelBridge','WN-55']},
    {sd:'t',t:'The barrel arbor’s ratchet and its click',x:'Put on the barrel arbor’s ratchet, put the click in place and screw it down.',in:['@setupRatchet','050805-2','WN-22']},
    {sd:'t',t:'The balance and its cock',x:'Put in the balance, screw the upper balance cock to the top plate and fasten the hairspring’s stud to the cock with its screw. (The model puts the balance in hanging in the cock, as it came out.)',in:['@upperCock','WN-ucs'],fc:['@stud']},
    {sd:'t',t:'The detent’s block',x:'Put in the detent’s block and screw it to the plate.',in:['@detentBlock','WN-gk']},
    {sd:'t',t:'Check the escapement',x:'Check that it is put together right. A tooth of the escape wheel must go onto the locking stone by 0.20-0.25 mm; the gold spring’s end must reach 0.35-0.40 mm past the detent’s end; at rest the gold spring’s end must stop 0.10-0.15 mm short of the discharge stone; and the gap between a tooth and the impulse stone must be 0.04-0.07 mm. <span data-ovhk="esc"></span>',fc:['@escapeWheel','@detent','@detentBlock','@rollers']},
    {sd:'t',t:'Hook on the chain',x:'Hook the chain on the barrel, wind it onto the barrel, and hook its other end on the fusee.',in:['@chain']},
    {sd:'t',t:'Set the mainspring up',x:'Set the mainspring up by ten teeth of the barrel arbor’s ratchet.',fc:['@setupRatchet','050805-2','@barrel']},
    {sd:'t',t:'The washer, flange and cork washer',x:'On the fusee arbor’s square, put the washer, then the fusee’s flange, and on the flange the cork washer.',in:['@dustPlate','@dustBush','@corkRing']},
    {sd:'d',t:'Turn it over; the motion work',x:'Turn the movement over on the bowl, dial side up. Put on the cannon pinion, the change pinion with its wheel and the hour wheel. Press the up-and-down pinion onto the fusee arbor’s end, and put the up-and-down wheel on its stud.',in:['@cannon','@changeWheel','@hourWheel','@udPinion','@udWheel']},
    {sd:'d',t:'The dial',x:'Put on the dial and screw it down with its three screws.',in:['@dial']},
    {sd:'d',t:'The hands',x:'Put on the up-and-down hand, the seconds hand, the hour hand and the minute hand. (With the seconds hand on its zero, the minute hand must stand on a minute’s mark, p. 59.) A chronometer with the electrical contact has it put together apart and fitted to the movement now.',in:['@hands']},
    {sd:'d',t:'Oil it',x:'The book gives no step for oiling. Its table of oils (Appendix 5, p. 132, printed small; its MX column read as best it can be) names the fusee’s pivots, the fusee wheel’s and ratchet’s holes, the ratchet’s spring, the maintaining detent and the stop (МЦ-3); the barrel with its spring (МЦ-3); the pivots of the centre, intermediate, seconds and escape arbors, and under the cannon pinion (МЗП-6); the balance’s pivots and the chain (МБП-12). The barrel arbor’s pivots can’t be read. It names no oil for the escapement’s stones and teeth.',fc:['@fusee','@barrel','@centreWheel','@intermediateWheel','@secondsWheel','@escapeWheel','@balance','@chain'],est:1},
    {sd:'c',t:'Into the case',x:'Put the movement in its bowl. (A chronometer with the contact first has its two current collectors screwed into the bowl with four screws, their insulators in.) Screw on the bezel with its glass and hang the chronometer in its gimbals. The endshakes the book checks at assembly (Appendix 4): the fusee 0.08-0.12 mm, the barrel, centre, intermediate and seconds arbors 0.07-0.10, the escape arbor 0.05-0.07, the balance staff 0.04-0.06.'}];
  const SEQ={d:DIS,r:RE};
  /* where a piece comes off other than straight off along the arbors as the Exploded view sends it: straight legs, mm in the movement's frame from where it stands
     assembled (+y toward the dial side). The detent's block drops 1.5 off its steady pins and slides out along -x between the pillars (ASSEMBLY's step 6), then
     away */
  const PATH={'@detentBlock':[[0,1.5,0],[-45,1.5,0],[-45,-40,0]]};
  let A=null,on=null,i=0,play=0,bz=false,prog=1,HID=new Set();
  const MV=[],MVS=new Set(),byId=new Map(),F=new Map(),T=new Map(),P0=new Map(),host=new Map(),R=new Map(),B=new Map(),Q=new Map(),W=new Map(),M2M=new Map();   /* R each mover's path (legs), B its place as built, Q the movement's frame to its parent's */
  let EX=null;
  const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function find(id){if(byId.has(id))return byId.get(id);const mv=A.mv,out=[];
    if(id[0]==='@'){const p=mv.userData.parts[id.slice(1)];if(p)out.push(p);}
    else{const has=o=>{const h=o.userData.hn;return typeof h==='string'?h.split(' ').includes(id):Array.isArray(h)&&h.includes(id);};mv.traverse(o=>{if(has(o)){for(let p=o.parent;p&&p!==mv;p=p.parent)if(has(p))return;out.push(o);}});}
    byId.set(id,out);return out;}
  const V3=(a)=>new THREE.Vector3(a[0],a[1],a[2]);
  /* a path's point at share f (0 assembled, 1 off): along its legs by their lengths */
  function along(P,f){if(f<=0)return new THREE.Vector3();const L=[0];let s=0;for(let k=1;k<P.length;k++)L.push(s+=P[k].distanceTo(P[k-1]));const d=f*s;
    for(let k=1;k<P.length;k++)if(d<=L[k]||k===P.length-1){const u=L[k]>L[k-1]?(d-L[k-1])/(L[k]-L[k-1]):1;return P[k-1].clone().lerp(P[k],clamp(u,0,1));}return P[P.length-1].clone();}
  function setup(){if(MV.length)return;const mv=A.mv,ids=new Set(Object.keys(HOST));for(const q of[DIS,RE])for(const s of q)for(const k of['out','in'])for(const id of s[k]||[])ids.add(id);
    for(const id of ids)for(const o of find(id)){if(!MVS.has(o)){MV.push(o);MVS.add(o);}o.userData.ovId=id;}
    EX=new Set([...Object.values(mv.userData.parts),...mv.userData.lifted]);
    for(const o of MV){const h=HOST[o.userData.ovId];let hh=null;if(h!=null)hh=find(h)[0]||null;else for(let p=o.parent;p&&p!==mv;p=p.parent)if(MVS.has(p)){hh=p;break;}host.set(o,hh);F.set(o,0);T.set(o,0);}
    /* each one's rise in the Exploded view, against where it stands assembled (in the movement's frame, through its parent's turn from it) */
    const loc=o=>{const v=o.getWorldPosition(new THREE.Vector3());return mv.worldToLocal(v);};
    mv.userData.explode(0);mv.updateMatrixWorld(true);const y0=new Map(MV.map(o=>[o,loc(o).y]));mv.userData.explode(1);mv.updateMatrixWorld(true);const r1=new Map(MV.map(o=>[o,loc(o).y-y0.get(o)]));mv.userData.explode(0);mv.updateMatrixWorld(true);
    const side=new Map();for(const q2 of[DIS,RE])for(const s of q2)for(const o of[...(s.out||[]),...(s.in||[])].flatMap(find))if(!side.has(o))side.set(o,s.sd);
    const hr=o=>{const h=host.get(o);return h?r1.get(h):0;};
    for(const o of MV){const id=o.userData.ovId,r=r1.get(o)-hr(o),sg=side.get(o)==='d'?1:-1;
      /* straight off: as far past what carries it as the Exploded view sets them apart, away from the side facing up; at least 25 mm, so it clears the movement */
      const y=Math.abs(r)>=0.5?Math.sign(r)*Math.max(25,Math.abs(r)):sg*25;R.set(o,(PATH[id]?[[0,0,0],...PATH[id]]:[[0,0,0],[0,y,0]]).map(V3));
      B.set(o,o.position.clone());}
    mv.traverse(m=>{if(!m.isMesh)return;for(let p=m;p&&p!==mv;p=p.parent)if(MVS.has(p)){M2M.set(m,p);return;}});}
  /* the movement's frame into each mover's parent's (the train stands still while the overhaul shows: the turn of a wheel's group is what it is now) */
  function frames(){const mv=A.mv;for(const o of MV){const q=new THREE.Quaternion();for(let p=o.parent;p&&p!==mv;p=p.parent)q.premultiply(p.quaternion);Q.set(o,q.invert());}}
  function stateAt(q,k){const S=new Map(),st=SEQ[q];for(const o of MV)S.set(o,0);
    if(q==='r')for(const s of st)for(const id of s.in||[])for(const o of find(id))S.set(o,1);
    for(let j=0;j<=k;j++){const s=st[j];for(const id of s.out||[])for(const o of find(id))S.set(o,1);for(const id of s.in||[])for(const o of find(id))S.set(o,0);}
    return S;}
  /* what step k puts away (the tray): off before it and after it, and neither moved nor looked at nor carrying what is */
  function away(q,k){const a=stateAt(q,k-1),b=stateAt(q,k),s=SEQ[q][k],inv=new Set();
    const pres=(S,o)=>S.get(o)<1&&(host.get(o)?pres(S,host.get(o)):true);
    for(const id of[...(s.out||[]),...(s.in||[]),...(s.fc||[])])for(let o of find(id)){for(;o;o=host.get(o)){if(!MVS.has(o))break;inv.add(o);}}
    return new Set(MV.filter(o=>!inv.has(o)&&!pres(a,o)&&!pres(b,o)));}
  /* each mover's way off: its host's, and its own path at its share, in the movement's frame */
  const ways=f=>{W.clear();const wr=o=>{if(W.has(o))return W.get(o);const h=host.get(o),w=(h?wr(h).clone():new THREE.Vector3()).add(along(R.get(o),f.get(o)));W.set(o,w);return w;};for(const o of MV)wr(o);return W;};
  /* each mover where its way puts it, less what the mover above it in the scene has moved; the Exploded view's parts and screws have their y set each frame (settle()), so it
     is added to it, their x and z set from where they stand built; the rest set from where they stand built */
  function pose(){ways(F);
    for(const o of MV){let up=null;for(let p=o.parent;p&&p!==A.mv;p=p.parent)if(MVS.has(p)){up=W.get(p);break;}const d=W.get(o).clone();if(up)d.sub(up);d.applyQuaternion(Q.get(o));const b=B.get(o);
      if(EX.has(o)){o.position.x=b.x+d.x;o.position.z=b.z+d.z;o.position.y+=d.y;}else o.position.set(b.x+d.x,b.y+d.y,b.z+d.z);}}
  const VIEW={t:{yaw:2.5,pitch:0.62},d:{yaw:0.3,pitch:0.85},c:{yaw:0.3,pitch:1.02,dist:330}};
  /* what a step looks at, framed whole where it starts and where it is going */
  function frameOf(s,fa,fb){const ids=[...(s.out||[]),...(s.in||[]),...(s.fc||[])],obs=ids.flatMap(find),mv=A.mv;
    const pk=new Set();for(const o of obs)o.traverse(m=>{if(m.isMesh&&(m.userData.pk||m.userData.part))pk.add(m.userData.pk||m.userData.part);});
    if(!obs.length)return{pk:null,c:null,d:0};
    const Wa=new Map([...ways(fa)].map(([k,v])=>[k,v.clone()])),Wb=new Map([...ways(fb)].map(([k,v])=>[k,v.clone()]));ways(F);const Wn=new Map(W);
    mv.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert(),b=new THREE.Box3(),bb=new THREE.Box3(),M=new THREE.Matrix4();
    for(const o of obs)o.traverse(m=>{if(!m.isMesh||!m.geometry||!m.visible)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();M.multiplyMatrices(inv,m.matrixWorld);bb.copy(m.geometry.boundingBox).applyMatrix4(M);
      const mo=M2M.get(m),c=mo?Wn.get(mo):null;for(const w of[Wa,Wb]){const t=mo?w.get(mo).clone().sub(c):new THREE.Vector3();b.union(bb.clone().translate(t));}});
    if(b.isEmpty())return{pk,c:null,d:0};const c=b.getCenter(new THREE.Vector3()),z=b.getSize(new THREE.Vector3());
    return{pk,c,d:clamp(Math.max(z.x,z.y,z.z)*2+40,70,380)};}
  function show(k,jump){const st=SEQ[on];i=clamp(k,0,st.length-1);const s=st[i],S=stateAt(on,i);
    const F0=new Map(F);for(const o of MV){T.set(o,S.get(o));P0.set(o,F.get(o));}prog=0;if(jump){for(const o of MV)F.set(o,S.get(o));prog=1;}
    if(s.a)A.act(s.a);
    bz=on==='d'?true:i<st.length-1;   /* the bezel: off from the first step taking it down, back on with the last putting it back */
    const aw=away(on,i);HID=new Set();for(const[m,o]of M2M)if(aw.has(o))HID.add(m);
    const v=VIEW[s.sd],f=frameOf(s,jump?S:F0,S);A.focus(s.sd==='c'?null:f.pk);
    A.cam({side:s.sd,yaw:v.yaw,pitch:v.pitch,dist:v.dist||f.d||235,target:s.sd!=='c'&&f.c?[f.c.x,f.c.y,f.c.z]:null});
    const n=st.length;$('#oStep').textContent=`${on==='d'?'Taking it down':'Putting it back'}, step ${i+1} of ${n}`;$('#oTitle').textContent=s.t;
    $('#oText').innerHTML=s.x.replace('<span data-ovhk="esc"></span>',A.escNote?A.escNote():'');$('#oMeta').innerHTML=meta(s).join('<br>');
    $('#oSl').max=n;$('#oSl').value=i+1;$('#oSl').setAttribute('aria-valuetext',`Step ${i+1}: ${s.t}`);$('#oPrev').disabled=i===0;$('#oNext').textContent=i===n-1?'Finish':'Next';A.changed();}
  function meta(s){const name=id=>{if(id[0]==='@'){const p=A.PARTS[id.slice(1)];return p?p.t:id.slice(1);}const l=typeof MAKERS!=='undefined'&&MAKERS.find(x=>x.id===id);return l?`${l.no} ${l.name}`:id;},
      pt=[...(s.out||[]),...(s.in||[])].map(name);
    return[s.est?'<b>Estimated</b>: not in the book’s words, or not in its order':'',s.tl?'Tools: '+esc(s.tl):'',pt.length?(s.out?'Off':'On')+': '+pt.map(esc).join('; '):''].filter(Boolean);}
  function start(q,k=0){if(!SEQ[q])return;A.begin();setup();frames();const fresh=on!==q;on=q;$('#ovhIntro').classList.add('hidden');$('#ovhBody').classList.remove('hidden');show(k,fresh);}
  function end(){if(!on)return;on=null;stopPlay();for(const o of MV){F.set(o,0);T.set(o,0);}pose();bz=false;HID=new Set();$('#ovhIntro').classList.remove('hidden');$('#ovhBody').classList.add('hidden');A.finish();}
  function stopPlay(){clearInterval(play);play=0;const b=$('#oPlay');if(b){b.textContent='Play';b.setAttribute('aria-pressed','false');}}
  return{DIS,RE,HOST,PATH,meta,
    bind(api){A=api;
      $('#ovhDis').addEventListener('click',()=>start('d'));$('#ovhRe').addEventListener('click',()=>start('r'));
      $('#oPrev').addEventListener('click',()=>{stopPlay();show(i-1);});$('#oNext').addEventListener('click',()=>{stopPlay();if(i<SEQ[on].length-1)show(i+1);else end();});
      $('#oSl').addEventListener('input',e=>{stopPlay();const k=+(/** @type {HTMLInputElement} */(e.target)).value-1;show(k,Math.abs(k-i)>1);});$('#oExit').addEventListener('click',end);
      $('#oPlay').addEventListener('click',()=>{if(play){stopPlay();return;}const b=$('#oPlay');b.textContent='Pause';b.setAttribute('aria-pressed','true');play=setInterval(()=>{if(!on||i>=SEQ[on].length-1){stopPlay();return;}show(i+1);},3000);});},
    on:()=>on,bezelOff:()=>!!on&&bz,hides:m=>HID.has(m),
    side:()=>on?SEQ[on][i].sd:null,
    /* the hash: ovh=d5 (step 5 taking it down), ovh=r12 */
    hash:()=>on?on+(i+1):null,
    go(v){const m=/^([dr])(\d+)$/.exec(v||'');if(!m||+m[2]<1||+m[2]>SEQ[m[1]].length)return false;start(m[1],+m[2]-1);return true;},
    start,end,
    label:()=>on?`Overhaul, ${on==='d'?'taking it down':'putting it back'}, step ${i+1} of ${SEQ[on].length}: ${SEQ[on][i].t}.`:'',
    /* each frame, after the Exploded view's offsets: the step's parts moved together from where they were to where it leaves them, in about a second (at once with
       ?snap or reduced motion), each by the same share; its sum is the frame's signature */
    frame(dt,snap){if(!on)return 0;if(prog<1){prog=snap?1:Math.min(1,prog+dt*1.1);const e=prog<1?prog*prog*(3-2*prog):1;for(const o of MV)F.set(o,P0.get(o)+(T.get(o)-P0.get(o))*e);}pose();return prog+i;},
    /* for tools/assembly.py: the step (0 on) that takes a part (by name) off, itself or the part it rides on (HOST); -1 if none does */
    offAt:n=>{for(let id='@'+n,k=0;id&&k<8;id=HOST[id],k++){const j=DIS.findIndex(s=>(s.out||[]).includes(id));if(j>=0)return j;}return -1;}};
})();
