// siteserve.mjs: site/ served on http://localhost:PORT as the live site serves it, for sitecheck.py: every request through the root's worker.js (its redirects), the files by
// an ASSETS binding that does what wrangler.jsonc's assets ask of Cloudflare (html_handling "auto-trailing-slash": /dir to /dir/, /dir/index.html and /page.html to /dir/
// and /page; not_found_handling "none": a 404). Node 18 or later (fetch's Request and Response). Usage: node siteserve.mjs PORT
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import{fileURLToPath,pathToFileURL}from'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..'),SITE=path.join(ROOT,'site'),PORT=+process.argv[2]||8787;
const W=(await import(pathToFileURL(path.join(ROOT,'worker.js')).href)).default;
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json',
  '.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain','.woff2':'font/woff2','.gz':'application/gzip','.bin':'application/octet-stream','.wav':'audio/wav','.mp3':'audio/mpeg'};
const go=(u,p)=>Response.redirect(new URL(p+u.search,u).href,307);
const ASSETS={async fetch(req){const u=new URL(req.url),p=decodeURIComponent(u.pathname);
  if(p.endsWith('/index.html'))return go(u,p.slice(0,-10));if(p.endsWith('.html'))return go(u,p.slice(0,-5));
  let f=path.join(SITE,p);if(!f.startsWith(SITE))return new Response('Not found',{status:404});
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory()){if(!p.endsWith('/'))return go(u,p+'/');f=path.join(f,'index.html');}
  else if(!fs.existsSync(f)&&fs.existsSync(f+'.html'))f+='.html';
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory())return new Response('Not found',{status:404});
  return new Response(fs.readFileSync(f),{headers:{'content-type':TYPES[path.extname(f)]||'application/octet-stream'}});}};
http.createServer(async(q,s)=>{try{const r=await W.fetch(new Request('http://localhost:'+PORT+q.url),{ASSETS});const h=Object.fromEntries(r.headers);s.writeHead(r.status,h);s.end(Buffer.from(await r.arrayBuffer()));}
  catch(e){s.writeHead(500);s.end(String(e));}}).listen(PORT,'127.0.0.1',()=>console.log('serving site/ through worker.js on http://localhost:'+PORT));
