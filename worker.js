/* The live site's Worker (wrangler.jsonc): every address other than the main one (the bare domain, the workers.dev
   address, plain http) is sent to https://www.marinechronometermodel.com with the same path, by a permanent redirect;
   the main address gets the static files in site/. Local `wrangler dev` (localhost) is served as it is.
   Old addresses, each sent on in the same hop (tools/sitecheck.py tests them):
   - the essay was once a page of its own, /marine-chronometer, then the Hamilton's Essay tab (/#essay); since 21 October 2026 it is a page again, /essay/;
   - the Wempe's page was /wempe/ until 21 October 2026, when it became the home page (the Hamilton moved to /hamilton/): /wempe/ goes to /?from=wempe, which tells the
     page that a hash such as #essay=detent is its own (its Its drawings tab) and not an old link to the Hamilton's essay (the page's script sends those on); a fragment never
     reaches the server, and the browser keeps it across the redirect. Its report keeps its address, /wempe/verification/, as the Hamilton's reports keep /verification/.
   The Hamilton's old links on / (/#part=…, /#essay=…, /#ovh=…) can't be told apart here: the Wempe's page sends them on (wempe/index.html's script, its app.js's away). */
const MAIN='www.marinechronometermodel.com',LOCAL=new Set(['localhost','127.0.0.1']),ESSAY=new Set(['/marine-chronometer','/marine-chronometer.html','/marine-chronometer/']);
/* the path and query an old address now has, or null if it hasn't moved */
function moved(u){
  const p=u.pathname;
  if(ESSAY.has(p))return{path:'/essay/',search:''};
  if(p==='/wempe'||p.startsWith('/wempe/')&&!/^\/wempe\/verification(\/|$)/.test(p))return{path:'/',search:(u.search?u.search+'&':'?')+'from=wempe'};
  return null;
}
export default{
  async fetch(req,env){
    const u=new URL(req.url),m=moved(u);let go=!!m;
    if(m){u.pathname=m.path;u.search=m.search;}
    if(!LOCAL.has(u.hostname)&&(u.hostname!==MAIN||u.protocol!=='https:')){u.hostname=MAIN;u.protocol='https:';u.port='';go=true;}
    if(go)return Response.redirect(u.toString(),301);
    return env.ASSETS.fetch(req);
  }
};
