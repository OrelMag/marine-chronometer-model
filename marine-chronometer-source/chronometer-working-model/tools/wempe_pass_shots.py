"""wempe_pass_shots.py: the Wempe's discharge stone passing the gold spring as the page itself runs it, in plan, with the overlap measured.

    python wempe_pass_shots.py [--rev last] [--out r_pass.png] [--phases 0.247,0.25,...] [--step 0.0002]

A comparison pose (geomdiff.py's, beforeafter.py --still: the balance at rest, the detent home, the gold spring free) shows the stone's corner inside the gold spring's tip,
since with the stone at 05 04_1's 5 deg it meets the spring 1.7 deg before rest. That pose is not a state the page runs through. This tool poses the movement by the page's
own ESC.state(p) and update() at stated phases of the beat (the meeting, rest on the way out with the detent being lifted, the release; rest on the way back with the gold
spring bent) and renders the rollers, the detent and its gold spring and the escape wheel in plan from the dial side, each tile labelled with the balance's angle, the
detent's lift and the gold spring's bend. Then it sweeps both passes every --step of the beat and, at each, samples the stone's surface (a 14-point grid on every triangle)
and tests each point inside the gold spring's and the detent's solids (ray parity both ways along three axes): the count inside and the deepest (the least distance to the
solid's surface along six axes). Prints the sweep's worst; exit 1 if a point is over 0.005 mm inside (fine.py's phases are the check; this is the picture). About 30 s."""
import asyncio,base64,browser,io,json,pathlib,sys
from PIL import Image,ImageDraw
from playwright.async_api import async_playwright
import model
W,H=700,540
SHOW=['050404-1','050404-2','050401-1','050401-2','050401-3','050405-1','050403-1','050403-2','050402-1']
JS=r"""(()=>{const mv=window.__mv;let sc=mv;while(sc.parent)sc=sc.parent;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const shows=o=>{for(let q=o;q;q=q.parent)if(!q.visible)return false;return true;};
  const own=o=>{for(let q=o;q;q=q.parent)if(q.userData.hn)return q.userData.hn;return null;};
  const of=hn=>{const a=[];sc.traverse(o=>{if(o.isMesh&&shows(o)&&own(o)===hn&&!o.userData.decal)a.push(o);});return a;};
  window.__psPose=p=>{const s=ESC.state(p),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);sc.updateMatrixWorld(true);
    return {th:s.th*(Math.abs(s.th)>7?1:180/Math.PI),lift:s.lift,psDef:s.psDef,prog:s.prog};};
  window.__psStill=()=>{const u=(n,w)=>mv.userData._u({E:1000,th:0,lift:0,psDef:0,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);sc.updateMatrixWorld(true);};   /* geomdiff.py's comparison pose */
  window.__psShot=(lines,yaw,pitch,dist,t)=>{const S=new Set();lines.forEach(h=>of(h).forEach(o=>S.add(o)));const vis=[];
    sc.traverse(o=>{if(o.isMesh||o.isLine||o.isLineSegments||o.isPoints||o.isSprite){vis.push([o,o.visible]);const k=o.isMesh?S.has(o):(o.parent&&S.has(o.parent));o.visible=k;}});
    const T=new THREE.Vector3(...t),cp=Math.cos(pitch),d=new THREE.Vector3(cp*Math.sin(yaw),Math.sin(pitch),cp*Math.cos(yaw)),P=T.clone().addScaledVector(d,dist);mv.localToWorld(P);mv.localToWorld(T);
    const c=new THREE.PerspectiveCamera(20,%W%/%H%,dist/200,dist*20);c.position.copy(P);c.up.copy(new THREE.Vector3(0,0,-1).transformDirection(mv.matrixWorld));c.lookAt(T);c.updateMatrixWorld();c.updateProjectionMatrix();
    const r=window.__r,sz=r.getSize(new THREE.Vector2()),pr=r.getPixelRatio();r.setPixelRatio(1);r.setSize(%W%,%H%,false);const cc=r.getClearColor(new THREE.Color()),ca=r.getClearAlpha(),bg=sc.background;sc.background=null;r.setClearColor(0xeef0f3,1);
    r.render(sc,c);const url=r.domElement.toDataURL('image/png');r.setSize(sz.x,sz.y,false);r.setPixelRatio(pr);r.setClearColor(cc,ca);sc.background=bg;for(const[o,v]of vis)o.visible=v;return url;};
  /* the stone's surface sampled, each point tested inside the target's solid: parity of the crossings along +x, +y, +z (two of three), the depth the least way out along six axes */
  const rc=new THREE.Raycaster();rc.layers.enableAll();const AX=[[1,0,0],[0,1,0],[0,0,1],[-1,0,0],[0,-1,0],[0,0,-1]].map(a=>new THREE.Vector3(...a));
  window.__psIn=(stone,target)=>{const ts=of(target),ss=of(stone),sides=ts.map(o=>o.material.side);ts.forEach(o=>o.material.side=THREE.DoubleSide);let n=0,inside=0,deep=0,at=null;
    const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),q=new THREE.Vector3(),K=4;
    for(const o of ss){const g=o.geometry,p=g.attributes.position,ix=g.index,nt=(ix?ix.count:p.count)/3;
      for(let t=0;t<nt;t++){const i=ix?[ix.getX(3*t),ix.getX(3*t+1),ix.getX(3*t+2)]:[3*t,3*t+1,3*t+2];a.fromBufferAttribute(p,i[0]).applyMatrix4(o.matrixWorld);b.fromBufferAttribute(p,i[1]).applyMatrix4(o.matrixWorld);c.fromBufferAttribute(p,i[2]).applyMatrix4(o.matrixWorld);
        for(let u=0;u<=K;u++)for(let v=0;u+v<=K;v++){q.set(0,0,0).addScaledVector(a,u/K).addScaledVector(b,v/K).addScaledVector(c,1-(u+v)/K);n++;
          const hits=AX.map(d=>{rc.set(q,d);return rc.intersectObjects(ts,false);});let odd=0;for(let k=0;k<3;k++)if(hits[k].length%2)odd++;
          if(odd>=2){const dd=Math.min(...hits.map(h=>h.length?h[0].distance:1e9));inside++;if(dd>deep){deep=dd;at=mv.worldToLocal(q.clone()).toArray();}}}}}
    ts.forEach((o,k)=>o.material.side=sides[k]);return {n,inside,deep,at};};})()""".replace('%W%',str(W)).replace('%H%',str(H))
async def main():
    a=sys.argv;rev=a[a.index('--rev')+1] if '--rev' in a else 'last';out=pathlib.Path(a[a.index('--out')+1] if '--out' in a else 'r_pass.png');step=float(a[a.index('--step')+1]) if '--step' in a else 2e-4
    PH=[float(x) for x in a[a.index('--phases')+1].split(',')] if '--phases' in a else [0.2470,0.2484,0.2500,0.2560,0.2614,0.7447,0.7500,0.7560]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=1,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(model.PAGE.split('#')[0]+'#merge=0',timeout=300000);await pg.wait_for_function("window.__mv&&!document.querySelector('#loading')",timeout=300000);await pg.wait_for_timeout(2000)
        await pg.evaluate("(()=>{const b=document.querySelector('#speeds button[data-v=\"0\"]');if(b)b.click();})()");await pg.evaluate(f"__mv.userData.setRev({json.dumps(rev)})");await pg.evaluate(JS)
        c=await pg.evaluate("""(()=>{const mv=__mv;let sc=mv;while(sc.parent)sc=sc.parent;__psPose(0.25);const bx=new THREE.Box3();sc.traverse(o=>{if(o.isMesh){for(let q=o;q;q=q.parent)if(q.userData.hn==='050404-2'){bx.expandByObject(o);break;}}});
            const c=bx.getCenter(new THREE.Vector3());mv.worldToLocal(c);return c.toArray();})()""")
        cols=4;rows=(len(PH)+cols-1)//cols;S=Image.new('RGB',(cols*W,rows*(H+26)+4),'white');D=ImageDraw.Draw(S)
        for k,ph in enumerate(PH):
            s=await pg.evaluate("p=>__psPose(p)",ph);g=await pg.evaluate("()=>__psIn('050404-2','050401-2')");d=await pg.evaluate("()=>__psIn('050404-2','050401-1')")
            u=await pg.evaluate("a=>__psShot(...a)",[SHOW,3.8,1.5,5.2,c]);im=Image.open(io.BytesIO(base64.b64decode(u.split(',',1)[1]))).convert('RGB')
            x,y=(k%cols)*W,(k//cols)*(H+26);S.paste(im,(x,y+24))
            D.text((x+6,y+6),f"phase {ph:.4f}: balance {s['th']:+.1f} deg, detent lift {s['lift']:.4f}, gold spring bent {s['psDef']:.4f}; stone inside the gold spring {g['inside']} of {g['n']} points, deepest {g['deep']*1000:.1f} um",fill='black')
            print(f"phase {ph:.4f}  balance {s['th']:+7.2f} deg  lift {s['lift']:.4f}  psDef {s['psDef']:.4f}  in gold spring {g['inside']}/{g['n']} deepest {g['deep']*1000:.1f} um  in detent {d['inside']} deepest {d['deep']*1000:.1f} um",flush=True)
        S.save(out);print('wrote',out)
        await pg.evaluate("()=>__psStill()");g=await pg.evaluate("()=>__psIn('050404-2','050401-2')")
        print(f"the comparison pose (balance at rest, detent home, gold spring free; not a state the page runs through): the stone in the gold spring {g['inside']} of {g['n']} points, deepest {g['deep']*1000:.1f} um")
        worst={'050401-2':(0,None,0),'050401-1':(0,None,0)};n=0
        for lo,hi in ((0.244,0.266),(0.742,0.764)):
            ph=lo
            while ph<=hi+1e-9:
                await pg.evaluate("p=>__psPose(p)",ph);n+=1
                for t in worst:
                    r=await pg.evaluate("t=>__psIn('050404-2',t)",t)
                    if r['deep']>worst[t][0]:worst[t]=(r['deep'],ph,r['inside'])
                ph+=step
        print(f"swept {n} phases of both passes (0.244-0.266 and 0.742-0.764, every {step}):")
        for t,nm in (('050401-2','the gold spring'),('050401-1','the detent')):
            dd,ph,k=worst[t];print(f"  the stone in {nm}: "+(f"deepest {dd*1000:.1f} um at phase {ph:.4f} ({k} points)" if ph is not None else 'no point inside at any phase'))
        if errs:print('page errors:',errs[:3])
        await b.close()
    sys.exit(1 if errs or any(v[0]>0.005 for v in worst.values()) else 0)
asyncio.run(main())
