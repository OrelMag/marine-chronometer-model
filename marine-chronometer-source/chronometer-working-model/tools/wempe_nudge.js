// wempe_nudge.js: the Wempe's numbers nudged as Node reads them, for wempe_sheetcheck.py's planted fault and its coverage sweep. Preloaded (NODE_OPTIONS=--require ...)
// into every Node the recipes start, it gives fs.readFileSync's readers of wempe/js/dims.js or wempe/js/escapement.js the file with the literals in MC_WNUDGE
// replaced: [[file, offset, old text, new text], ...], the offset a character index into the file. The file on disk is never written; without MC_WNUDGE it nudges nothing.
// A literal that is no longer at its offset throws: a nudge must never run on a file it wasn't made for.
// MC_WNUDGE_NOPHYS=1 (the sweep's): wempe/js/escphys.js is read as `const WPHYS=null;`, so wempe_load.js doesn't build the escapement in time (3 s a load, and each
// recipe reader is a load); no recipe reads WPHYS, and the sweep checks that the readers answer the same with it as without.
const fs=require('fs');
const N=process.env.MC_WNUDGE?JSON.parse(process.env.MC_WNUDGE):[],NOPHYS=process.env.MC_WNUDGE_NOPHYS==='1';
if(N.length||NOPHYS){const read=fs.readFileSync;
  fs.readFileSync=function(p,...a){const out=read.call(fs,p,...a);
    if(typeof p!=='string'||typeof out!=='string')return out;
    const q=p.replace(/\\/g,'/'),m=/\/wempe\/js\/([^/]+)$/.exec(q);if(!m)return out;
    if(NOPHYS&&m[1]==='escphys.js')return 'const WPHYS=null;';
    let s=out;
    for(const [file,off,old,neu] of N.filter(n=>n[0]===m[1]).sort((x,y)=>y[1]-x[1])){   /* from the end, so earlier offsets stay true */
      if(s.substr(off,old.length)!==old)throw Error(`wempe_nudge.js: ${file} has ${JSON.stringify(s.substr(off,old.length))} at ${off}, not ${JSON.stringify(old)}`);
      s=s.slice(0,off)+neu+s.slice(off+old.length);}
    return s;};}
