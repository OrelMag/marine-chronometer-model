// ci.py's trace of what a step reads, for Node (ci.py adds --require this file to NODE_OPTIONS with MC_TRACE, a folder, and MC_TRACE_ROOT, the repository;
// child processes and workers inherit it): every file under the repository read, opened, tested or listed is appended to MC_TRACE/node-PID-THREAD.txt
// as 'r PATH', 'w PATH' (written) or 'l DIR' (listed), and every module in require.cache at exit as read. Nothing happens without MC_TRACE.
'use strict';
const D=process.env.MC_TRACE,R=process.env.MC_TRACE_ROOT;
if(D&&R){
  const fs=require('fs'),path=require('path'),url=require('url'),tid=(()=>{try{return require('worker_threads').threadId}catch(e){return 0}})();
  const win=process.platform==='win32',norm=p=>{p=path.resolve(p);return win?p.toLowerCase():p},RN=norm(R);
  const out=path.join(D,`node-${process.pid}-${tid}.txt`),app=fs.appendFileSync,seen=new Set();
  const rec=(k,p)=>{try{
    if(p==null||typeof p==='number')return;if(p instanceof URL)p=url.fileURLToPath(p);else if(Buffer.isBuffer(p))p=p.toString();else if(typeof p!=='string')return;
    const a=norm(p);if(!a.startsWith(RN))return;const l=k+' '+a;if(seen.has(l))return;seen.add(l);app(out,l+'\n');
  }catch(e){}};
  const W=fs.constants.O_WRONLY|fs.constants.O_RDWR|fs.constants.O_APPEND|fs.constants.O_CREAT;
  const isW=f=>typeof f==='number'?!!(f&W):typeof f==='string'&&/[wa+]/.test(f);
  const wrap=(o,n,k)=>{const f=o[n];if(typeof f!=='function')return;o[n]=function(p,...a){rec(typeof k==='function'?k(a):k,p);return f.call(this,p,...a)}};
  const flag=a=>{const o=a[0];return isW(typeof o==='object'&&o?o.flag:o)?'w':'r'};
  for(const n of['readFileSync','readFile','existsSync','statSync','stat','lstatSync','accessSync','access'])wrap(fs,n,'r');
  for(const n of['readdirSync','readdir','opendirSync'])wrap(fs,n,'l');
  for(const n of['writeFileSync','writeFile','appendFileSync','appendFile','createWriteStream','mkdirSync','rmSync','unlinkSync','renameSync','copyFileSync'])wrap(fs,n,'w');
  for(const n of['openSync','open'])wrap(fs,n,a=>isW(a[0])?'w':'r');
  wrap(fs,'createReadStream',flag);
  for(const n of['readFile','stat','access'])wrap(fs.promises,n,'r');
  for(const n of['writeFile','appendFile','mkdir','rm','unlink','rename'])wrap(fs.promises,n,'w');
  wrap(fs.promises,'readdir','l');wrap(fs.promises,'open',a=>isW(a[0])?'w':'r');
  process.on('exit',()=>{for(const f of Object.keys(require.cache))rec('r',f)});
}
