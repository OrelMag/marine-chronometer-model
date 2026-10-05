// @ts-check
/* Report a bug or inaccuracy: the dialog (#report) opened from the panel, a part's card, About and the essay's end ([data-report]). Nothing leaves the page by
   itself (no fetch: tools/selfcontained.py): the report is written into the visitor's own email, through a mailto: link or Gmail's compose page, or copied,
   addressed to TO. Loaded first, so it keeps the page's last errors and warnings from every later script; they go into the report's technical details with
   the version, the address (the model's state is in its hash), the browser, the screen and the graphics. Declares only REPORT; app.js calls REPORT.bind(). */
const REPORT=(()=>{
  const TO='orelmag@gmail.com',T0=performance.now(),LOG=[],NLOG=30,MAILTO=1900,GMAIL=7500;   /* longest links: a mailto: past about 2,000 characters is cut short by some mail programs */
  /* a URL's directories go (on a local copy, the visitor's own folders): its file, line and column stay */
  const clean=s=>s.replace(/\b(?:file|https?):\/\/[^\s)'"]*\//g,'').replace(/\s+/g,' ').trim().slice(0,300);
  const str=x=>x instanceof Error?(x.stack&&x.stack.includes(x.message)?x.stack:x.message+' '+(x.stack||'')):typeof x==='string'?x:(()=>{try{return JSON.stringify(x);}catch(_){return String(x);}})();
  const sec=()=>((performance.now()-T0)/1000).toFixed(1)+' s';
  function note(k,a){const s=clean(a.map(str).join(' ')),l=LOG[LOG.length-1];if(l&&l.k===k&&l.s===s){l.n++;return;}LOG.push({t:sec(),k,s,n:1});if(LOG.length>NLOG)LOG.shift();}
  for(const k of['error','warn']){const f=console[k];console[k]=function(...a){note(k,a);return f.apply(this,a);};}
  addEventListener('error',e=>{const t=/** @type {any} */(e.target);if(t&&t!==window&&(t.src||t.href))note('load',['failed to load',t.tagName,t.src||t.href]);else note('error',[e.error&&e.error.stack?'Uncaught '+e.error.stack:e.message+(e.filename?` (${e.filename}:${e.lineno}:${e.colno})`:'')]);},true);
  addEventListener('unhandledrejection',e=>note('error',['unhandled rejection:',e.reason]));

  const KIND={bug:['Bug','What you did, what you expected and what happened instead. The technical details help reproduce it.'],
    inacc:['Inaccuracy','Where the model or the essay differs from a real Model 21 or the manual, and what shows it. Photographs and videos of real Model 21s and the 1948 manual decide what the model looks like and does, so a source settles it fastest.'],
    other:['Note','A suggestion, a question, a broken link, anything else.']};
  /** @type {{where?:()=>string,state?:()=>[string,string][],r?:any}} */
  let B={};let kind='bug',auto=true,gpu='';
  const $=s=>/** @type {any} */(document.querySelector(s)),kinds=()=>/** @type {NodeListOf<HTMLButtonElement>} */(document.querySelectorAll('#rpKind button'));
  const ver=()=>{const v=document.querySelector('[data-ver]');return v?v.textContent:'dev';};
  /* the page's address: on a local copy, the file's name alone, not the folders it is in */
  const page=()=>location.protocol==='file:'?'local copy, '+decodeURIComponent(location.pathname.split('/').pop()||'')+location.search+location.hash:location.href;
  function gpuName(){if(gpu||!B.r)return gpu;try{const gl=B.r.getContext(),g2=typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext;
      let n=gl.getParameter(gl.RENDERER);if(/^WebKit WebGL$/.test(n)){const x=gl.getExtension('WEBGL_debug_renderer_info');if(x)n=gl.getParameter(x.UNMASKED_RENDERER_WEBGL);}   /* Firefox names the renderer itself, and warns of the extension */
      gpu=`${g2?'WebGL 2':'WebGL 1'}, ${n}, textures to ${gl.getParameter(gl.MAX_TEXTURE_SIZE)} px`;}catch(e){gpu='unknown ('+e.message+')';}return gpu;}
  function tech(){const n=navigator,s=screen,mm=q=>matchMedia(q).matches,tz=-new Date().getTimezoneOffset(),d=new Date(Date.now()+tz*6e4).toISOString().slice(0,16).replace('T',' ');
    let st=[];try{st=B.state?B.state():[];}catch(e){st=[['Model state','unreadable ('+e.message+')']];}
    const L=[['Version',ver()],['Page',page()],...st,['Browser',n.userAgent],['Language',n.language],
      ['Screen',`${s.width}×${s.height}, window ${innerWidth}×${innerHeight}, pixel ratio ${devicePixelRatio}, ${n.maxTouchPoints?'touch':'no touch'}, ${mm('(pointer:fine)')?'mouse':'no mouse'}${mm('(prefers-reduced-motion:reduce)')?', reduced motion':''}${mm('(prefers-color-scheme:dark)')?', dark':''}`],
      ['Graphics',gpuName()||'not started'],['Open for',sec()],['Local time',`${d} (UTC${tz<0?'−':'+'}${Math.floor(Math.abs(tz)/60)}${Math.abs(tz)%60?':'+String(Math.abs(tz)%60).padStart(2,'0'):''})`]];
    return L.map(([k,v])=>k+': '+v).join('\n')+'\n\nRecent errors and warnings'+(LOG.length?` (the last ${LOG.length}):\n`+LOG.map(l=>`  ${l.t} ${l.k}${l.n>1?' ×'+l.n:''}: ${l.s}`).join('\n'):': none');}
  const val=id=>String($(id).value).trim();
  function subject(){const w=val('#rpWhat').split('\n')[0];return`Model 21 ${KIND[kind][0].toLowerCase()}${w?': '+(w.length>60?w.slice(0,59)+'…':w):''} (v${ver()})`;}
  function body(){const src=kind==='inacc'?val('#rpSrc'):'';
    return`Kind: ${KIND[kind][0]}\nWhere: ${val('#rpWhere')||'(not given)'}\n\nWhat's wrong:\n${val('#rpWhat')||'(write it here)'}\n`+(src?`\nSource: ${src}\n`:'')+($('#rpTech').checked?'\n-- Technical details --\n'+tech()+'\n':'');}
  /* a link no longer than max: the body is cut from its end (the oldest of it, the log, goes first) and the whole report put on the clipboard as the link opens */
  const CUT='\n\n[Shortened to fit the link. The whole report is on your clipboard: paste it here in its place.]';
  function fit(mk,max,s,b){if(mk(s,b).length<=max)return{u:mk(s,b),cut:false};let lo=0,hi=b.length;while(lo<hi){const m=(lo+hi+1)>>1;if(mk(s,b.slice(0,m)+CUT).length<=max)lo=m;else hi=m-1;}return{u:mk(s,b.slice(0,lo)+CUT),cut:true};}
  const E=encodeURIComponent,mailto=(s,b)=>`mailto:${TO}?subject=${E(s)}&body=${E(b.replace(/\n/g,'\r\n'))}`,gmail=(s,b)=>`https://mail.google.com/mail/?view=cm&fs=1&to=${E(TO)}&su=${E(s)}&body=${E(b)}`;
  let links={m:{u:'',cut:false},g:{u:'',cut:false}};
  function sync(){const s=subject(),b=body();$('#rpPrev pre').textContent='To: '+TO+'\nSubject: '+s+'\n\n'+b;links={m:fit(mailto,MAILTO,s,b),g:fit(gmail,GMAIL,s,b)};$('#rpMail').href=links.m.u;$('#rpGmail').href=links.g.u;}
  function say(t){const o=$('#rpOut');o.textContent=t;}
  function copy(then){const t=$('#rpPrev pre').textContent,sel=()=>{const p=$('#rpPrev');p.open=true;const r=document.createRange();r.selectNodeContents($('#rpPrev pre'));const g=getSelection();if(g){g.removeAllRanges();g.addRange(r);}};
    try{navigator.clipboard.writeText(t).then(()=>then(true),()=>{sel();then(false);});}catch(_){sel();then(false);}}
  function setKind(k){kind=k;kinds().forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k?'true':'false'));$('#rpHint').textContent=KIND[k][1];$('#rpSrcF').classList.toggle('hidden',k!=='inacc');sync();}
  /** @param {{kind?:string,where?:string,fresh?:boolean}} [o] where: what the report is about; fresh: from a part's card or the essay, so where is theirs even if one was typed */
  function open(o={}){const d=$('#report');if(!d)return;const ab=$('#about');if(ab&&ab.open)ab.close();
    if(o.kind)setKind(o.kind);let w=o.where;if(w==null&&(auto||o.fresh)&&B.where){try{w=B.where();}catch(_){w='';}}if(w!=null){$('#rpWhere').value=w;auto=true;}
    say('');sync();if(d.showModal){if(!d.open)d.showModal();}else d.setAttribute('open','');$('#rpWhat').focus();}
  /** @param {{where?:()=>string,state?:()=>[string,string][],r?:any}} b */
  function bind(b){B=b;const d=$('#report');if(!d)return;
    if(B.r&&B.r.domElement){const c=B.r.domElement;c.addEventListener('webglcontextlost',()=>note('warn',['WebGL context lost']));c.addEventListener('webglcontextrestored',()=>note('warn',['WebGL context restored']));}
    document.addEventListener('click',e=>{const t=/** @type {any} */(e.target),a=t&&t.closest&&t.closest('[data-report]');if(!a)return;e.preventDefault();open({kind:a.dataset.report||undefined,fresh:!!a.dataset.report});});
    d.addEventListener('click',e=>{if(e.target===d)d.close();});
    d.addEventListener('keydown',e=>e.stopPropagation());   /* typing here never reaches the model's or the essay's keys */
    kinds().forEach(b=>b.addEventListener('click',()=>setKind(b.dataset.v)));
    $('#rpWhere').addEventListener('input',()=>{auto=!val('#rpWhere');});
    for(const id of['#rpWhere','#rpWhat','#rpSrc','#rpTech'])$(id).addEventListener('input',sync);$('#rpTech').addEventListener('change',sync);
    $('#rpPrev').addEventListener('toggle',sync);
    for(const[id,k]of[['#rpMail','m'],['#rpGmail','g']])$(id).addEventListener('click',()=>{sync();const l=links[k];if(!val('#rpWhat'))say('Say what’s wrong in the email before you send it.');
      if(l.cut)copy(ok=>say(ok?'The report was too long for the link: the whole of it is on your clipboard, to paste into the email.':'The report was too long for the link: copy the whole of it from “What will be sent” (now selected) into the email.'));});
    $('#rpCopy').addEventListener('click',()=>{sync();copy(ok=>say(ok?`Copied. Paste it into an email to ${TO}.`:`Selected under “What will be sent”: copy it (Ctrl+C, or ⌘C) into an email to ${TO}.`));});
    $('#rpTo').textContent=TO;$('#rpTo').href='mailto:'+TO;setKind('bug');}
  return{bind,open,note:(...a)=>note('note',a),text:()=>{sync();return $('#rpPrev pre').textContent;},links:()=>{sync();return{mailto:links.m.u,gmail:links.g.u};}};
})();
