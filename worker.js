/* The live site's Worker (wrangler.jsonc): every address other than the main one (the bare domain, the workers.dev
   address, plain http) is sent to https://www.marinechronometermodel.com with the same path, by a permanent redirect;
   the main address gets the static files in site/. Local `wrangler dev` (localhost) is served as it is. The essay was once a page of its own,
   /marine-chronometer: it is the model's Essay tab now, and its old addresses go there (/#essay), in the same hop. */
const MAIN='www.marinechronometermodel.com',LOCAL=new Set(['localhost','127.0.0.1']),ESSAY=new Set(['/marine-chronometer','/marine-chronometer.html','/marine-chronometer/']);
export default{
  async fetch(req,env){
    const u=new URL(req.url);
    if(ESSAY.has(u.pathname)){u.pathname='/';u.search='';u.hash='essay';if(!LOCAL.has(u.hostname)){u.hostname=MAIN;u.protocol='https:';u.port='';}return Response.redirect(u.toString(),301);}
    if(!LOCAL.has(u.hostname)&&(u.hostname!==MAIN||u.protocol!=='https:')){u.hostname=MAIN;u.protocol='https:';u.port='';return Response.redirect(u.toString(),301);}
    return env.ASSETS.fetch(req);
  }
};
