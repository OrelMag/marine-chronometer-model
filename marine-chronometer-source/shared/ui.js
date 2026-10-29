/* ui.js: the page's layout of 29 October 2026, on both models' pages (loaded after app.js or viewer.js): the panel in four tabs, the play bar and views along the
   stage's foot, the light/dark switch in the header, the tools as icons. Declares only UI.
   It adds nothing the page's own script must know: each new control drives the page's own (the speeds, the views, Display's boxes, the theme's buttons), whose
   ids, links and keys are unchanged, and shows their state (sync, a few times a second and after each click), since the page's script sets them without events. */
const UI=(()=>{
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=document.documentElement,mq=matchMedia('(prefers-color-scheme: dark)');
  const press=(g,v)=>g&&g.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v?'true':'false'));
  /* ---------- the tools as icons (Select and Lasso come later, from select.js) ---------- */
  const IC={helpBtn:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.3-.9.8-.9 1.4V14"/><path d="M12 17.3v.1"/>',shot:'<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
    link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',reset:'<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>',
    fs:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',selMode:'<path d="M6 4l11 6.5-4.6 1.1 2.7 5.2-2 1-2.7-5.2L6 16z"/>',selLasso:'<path d="M12 5c4.4 0 8 2.2 8 5s-3.6 5-8 5c-1.3 0-2.5-.2-3.6-.5"/><path d="M8.4 14.5C5.8 13.6 4 12 4 10c0-2.8 3.6-5 8-5"/><circle cx="7" cy="17" r="1.6"/><path d="M7 18.6c0 1.5.8 2.4 2 2.4"/>'};
  function icons(){for(const[id,p]of Object.entries(IC)){const b=document.getElementById(id);if(!b||b.dataset.ic)continue;b.dataset.ic='1';if(!b.getAttribute('aria-label'))b.setAttribute('aria-label',b.title.split(/[:(]/)[0].trim()||b.textContent.trim());
    b.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;b.classList.add('ib');}}
  const tools=$('.tools');if(tools){icons();new MutationObserver(icons).observe(tools,{childList:true});}
  /* ---------- the panel's tabs: Explore, Run, Look, Advanced. A section opened from elsewhere (a link, the walkthrough) brings its tab ---------- */
  const tabs=$$('#ptabs [data-t]'),panes=$$('.tabp');let tab='explore';
  function show(t,focus){if(!panes.some(p=>p.dataset.tab===t))return;const was=tab;tab=t;
    tabs.forEach(b=>{const on=b.dataset.t===t;b.setAttribute('aria-selected',on?'true':'false');b.tabIndex=on?0:-1;if(on&&focus)b.focus();});
    panes.forEach(p=>p.hidden=p.dataset.tab!==t);if(t==='look'&&$('#dispDet'))$('#dispDet').open=true;
    if(was!==t){const p=panes.find(p=>p.dataset.tab===t);p.querySelectorAll('details[open]').forEach(d=>d.dispatchEvent(new Event('toggle')));dispatchEvent(new Event('resize'));}}   /* their drawings were sized hidden: drawn again */
  tabs.forEach(b=>b.addEventListener('click',()=>show(b.dataset.t)));
  $('#ptabs')?.addEventListener('keydown',e=>{const i=tabs.findIndex(b=>b.dataset.t===tab),n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;
    if(n==null)return;e.preventDefault();show(tabs[(n+tabs.length)%tabs.length].dataset.t,true);});
  $('#panel')?.addEventListener('toggle',e=>{const d=e.target;if(!e.isTrusted||!d.open||!d.matches('details.grp'))return;const p=d.closest('.tabp');if(p&&p.hidden)show(p.dataset.tab);},true);
  for(const id of['tourBody','ovhBody']){const el=document.getElementById(id);if(el)new MutationObserver(()=>{if(!el.classList.contains('hidden'))show('explore');}).observe(el,{attributes:true,attributeFilter:['class']});}
  /* ---------- the play bar: stop and go on, the speed (its menu holds the page's own speeds), the time, Wind ---------- */
  const pp=$('#pp'),chip=$('#spdChip'),menu=$('#spMenu'),spdN=$('#spdN');let last=1;
  const stopped=()=>$('#speeds [data-v="0"]')?.getAttribute('aria-pressed')==='true';
  const fmt=v=>v>=1?(+v.toPrecision(3)).toLocaleString('en')+'×':v===0.25?'¼×':v===0.05?'1/20×':(+v.toPrecision(2))+'×';
  pp?.addEventListener('click',()=>{if(!stopped()){$('#speeds [data-v="0"]').click();return;}const b=$(`#speeds [data-v="${last}"]`);if(b)b.click();else if(spdN){spdN.value=String(last);spdN.dispatchEvent(new Event('change'));}});
  const open=on=>{if(!menu)return;menu.classList.toggle('hidden',!on);chip.setAttribute('aria-expanded',on?'true':'false');};
  chip?.addEventListener('click',e=>{e.stopPropagation();open(menu.classList.contains('hidden'));});
  menu?.addEventListener('click',e=>{e.stopPropagation();if(e.target.closest('#speeds button'))setTimeout(()=>open(false),120);});
  document.addEventListener('click',()=>open(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.classList.contains('hidden')){open(false);chip.focus();}});
  $('#windP')?.addEventListener('click',()=>$('#wind')?.click());
  const dock=$('#dock'),stage=$('#stage');if(dock&&stage&&typeof ResizeObserver!=='undefined')new ResizeObserver(()=>stage.style.setProperty('--dh',dock.offsetHeight+'px')).observe(dock);   /* the close-up keeps clear of it (style.css) */
  /* ---------- Take it apart: Assembled (the place the view was), Exploded, Laid out: the views' own buttons ---------- */
  const MODES=['exploded','laidout'],modeSeg=$('#modeSeg');let place='movement';
  modeSeg?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$(`#views [data-v="${b.dataset.v||place}"]`)?.click();});
  /* ---------- Look and Colour by: Display's boxes, drawn as one choice each ---------- */
  const ck=id=>document.getElementById(id),flip=$('#flip'),fol=$('#followSys');
  const setBox=(id,on)=>{const c=ck(id);if(c&&c.checked!==on)c.click();};
  $('#lookSeg')?.addEventListener('click',e=>{const v=e.target.closest('button')?.dataset.v;if(!v)return;if(v==='metal'){setBox('draw',false);setBox('drawInk',false);}else setBox(v==='tint'?'draw':'drawInk',true);sync();});
  $('#colSeg')?.addEventListener('click',e=>{const v=e.target.closest('button')?.dataset.v;if(!v)return;setBox('colr',v==='part');setBox('colrSrc',v==='src');sync();});
  /* ---------- light or dark: the page's own Auto, Light and Dark ---------- */
  const isDark=()=>{const t=root.dataset.theme;return t==='dark'||(t!=='light'&&mq.matches);},auto=()=>$('#theme [data-v="auto"]')?.getAttribute('aria-pressed')==='true';
  flip?.addEventListener('click',()=>{$(`#theme [data-v="${isDark()?'light':'dark'}"]`)?.click();sync();});
  fol?.addEventListener('change',()=>{$(`#theme [data-v="${fol.checked?'auto':isDark()?'dark':'light'}"]`)?.click();sync();});
  /* ---------- what each shows, from the page's own controls ---------- */
  function sync(){
    const sb=$('#speeds button[aria-pressed="true"]'),v=sb?+sb.dataset.v:+(spdN?.value||0);if(v>0)last=v;
    if(chip){const t=fmt(v>0?v:last);if(chip.firstChild.textContent!==t)chip.firstChild.textContent=t;}
    if(pp){const s=v===0,k=s?'go':'stop';if(pp.dataset.k!==k){pp.dataset.k=k;pp.setAttribute('aria-label',s?'Go on':'Stop');pp.firstChild.innerHTML=s?'<path d="M4.5 2.5v11l9-5.5z"/>':'<rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/>';}}
    const vb=$('#views button[aria-pressed="true"]'),vv=vb?vb.dataset.v:'';if(vv&&!MODES.includes(vv))place=vv;press(modeSeg,MODES.includes(vv)?vv:'');
    press($('#lookSeg'),ck('drawInk')?.checked?'ink':ck('draw')?.checked?'tint':'metal');
    press($('#colSeg'),ck('colrSrc')?.checked?'src':ck('colr')?.checked?'part':'none');
    if(flip){const d=isDark()?'true':'false';if(flip.getAttribute('aria-checked')!==d)flip.setAttribute('aria-checked',d);}
    if(fol)fol.checked=auto();}
  document.addEventListener('click',()=>setTimeout(sync,0));document.addEventListener('keyup',()=>setTimeout(sync,0));mq.addEventListener?.('change',sync);
  setInterval(sync,250);sync();
  return{show,sync};
})();
