/* The live site's Worker (wrangler.jsonc): every address other than the main one (the bare domain, the workers.dev
   address, plain http) is sent to https://www.marinechronometermodel.com with the same path, by a permanent redirect;
   the main address gets the static files in site/. Local `wrangler dev` (localhost) is served as it is. */
const MAIN='www.marinechronometermodel.com',LOCAL=new Set(['localhost','127.0.0.1']);
export default{
  async fetch(req,env){
    const u=new URL(req.url);
    if(!LOCAL.has(u.hostname)&&(u.hostname!==MAIN||u.protocol!=='https:')){u.hostname=MAIN;u.protocol='https:';u.port='';return Response.redirect(u.toString(),301);}
    return env.ASSETS.fetch(req);
  }
};
