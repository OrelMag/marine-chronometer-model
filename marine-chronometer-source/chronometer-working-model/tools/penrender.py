"""penrender.py: stills of a model drawn as an ink-and-watercolour illustration, in Blender: EEVEE with Blender's Line Art pen lines (a heavy line round
each part's own outline, every contour, the creases in a lighter ink) over each material painted as a wash (its own colour in the light, shading into a warm
or a cool shade of itself, darker where a surface turns away, a white glint on metal), under a key and a rim light, on cream paper with a faint tooth. The
model is the page's own export to Blender (gltf_check.py's), posed by the rig (blender/rig.py). Each still is one of the page's views, seen as the page sees
it: the tool opens the page (headless, at the still's size) on that view or link, reads its camera (?qa's __camInfo) and carries it into the movement's own
frame, so any view, link or camera on the page can be drawn (a camera turned by hand on the page is in its link as cam=). The parts the page has faded
(a see-through view's plates, the parts away from a picked one) are drawn as a layer of their own laid over at a third, a cutaway's ghost. An illustration for its own sake: every line is the model's, nothing is simplified or left out
as an illustrator would. Not run by build.py or ci.py.

    python penrender.py [--model wempe] [--view dial,movement,exploded] [--glb FILE] [--size 1600x1150] [--out DIR]
    python penrender.py --link "https://.../hamilton/#view=train&part=fs"    # a page link (its hash: the view, the explode share, a camera moved by hand)
    python penrender.py --view escapement --cam 1.9,-0.75,80                 # the page's camera turned: yaw, pitch, distance (mm)[, target x,y,z in the movement]
    python penrender.py --list                                                # the model's views
        (without --glb, gltf_check.py exports and checks the model first, about 2.5 min, 3.5 for the Wempe; then about 3-10 min a still;
         --lines freestyle the first lines, faster, which break into dashes on curved walls)

Writes pen_MODEL_VIEW.png (pen_MODEL_link.png, link_2, ...) into --out, default tools/r_pen/ (ignored)."""
import json,os,pathlib,subprocess,sys
try:
    import bpy
except ImportError:
    bpy=None
HERE=pathlib.Path(__file__).resolve().parent;RIG=HERE.parent/'blender'/'rig.py'
# each model's views (the page's VIEWS) and how the rig poses them: the box shown (its lid shut: lids), exploded, laid out; any other the movement lifted
# out of its case alone. The camera is the page's. Not listed: the Wempe's transport view (an outer box). The Wempe's laid out since 2 November 2026, when its
# blender.js got the Laid out clip and the rig its laid_out control
POSE={'hamilton':{'box':dict(box=1,lids=1),'dial':dict(box=1),'movement':{},'train':{},'escapement':{},'exploded':dict(explode=1),'laidout':dict(laid_out=1),
                  'fusee':{},'balance':{}},
      'wempe':{'dial':dict(box=1),'box':dict(box=1,lids=1),'case':dict(box=1),'movement':{},'plan':{},'side':{},'exploded':dict(explode=1),'laidout':dict(laid_out=1),
               'escapement':{},'train':{},'fusee':{},'balance':{}}}
PAPER=(0.965,0.945,0.9)

def paper(src,dst,centre=False,ghost=None,tooth=True):
    """the render laid on drawing paper (ghost: the faded parts' layer laid over it; centre: a drawing that stands clear of the sheet's edges centred at 88 % of it), then a faint tooth and fibre that the
    colour takes up most in its mid washes"""
    import numpy as np
    from PIL import Image
    from scipy.ndimage import gaussian_filter
    im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)/255;H,W,_=im.shape;bg=im[2,2].copy();ys,xs=np.nonzero(np.abs(im-bg).max(2)>0.04)
    if centre and len(xs) and not(xs.min()<3 or ys.min()<3 or xs.max()>W-4 or ys.max()>H-4):
        c=im[ys.min():ys.max()+1,xs.min():xs.max()+1];k=min(0.88*W/c.shape[1],0.88*H/c.shape[0])
        c=np.asarray(Image.fromarray((c*255).astype(np.uint8)).resize((int(c.shape[1]*k),int(c.shape[0]*k)),Image.LANCZOS)).astype(np.float32)/255
        im=np.ones_like(im)*bg;y0=(H-c.shape[0])//2;x0=(W-c.shape[1])//2;im[y0:y0+c.shape[0],x0:x0+c.shape[1]]=c
    if ghost and pathlib.Path(ghost).exists():   # the faded parts, drawn alone on a clear film, laid over at a third: a cutaway's ghost
        gi=np.asarray(Image.open(ghost).convert('RGBA')).astype(np.float32)/255;a=gi[...,3:]*0.35;im=im*(1-a)+gi[...,:3]*a;pathlib.Path(ghost).unlink()
    if not tooth:Image.fromarray((np.clip(im,0,1)*255).astype(np.uint8)).save(dst);return   # flat: a sheet that lays its own paper over all (laidout.py --pen)
    rng=np.random.default_rng(7);n=lambda s:(lambda a:a/a.std())(gaussian_filter(rng.standard_normal((H,W)),s))
    tooth,fibre,mottle=n(1.2),n((0.8,6)),n(40);ink=1-im.mean(2);take=np.clip(ink*2.2,0,1)*np.clip((1-ink)*2.5,0,1)
    g=1-0.014*tooth*(0.2+take)-0.004*fibre-0.004*mottle
    Image.fromarray((np.clip(im*g[...,None]*np.array([1.0,0.985,0.95]),0,1)*255).astype(np.uint8)).save(dst)

def photofinish(f,ghost):
    """--photo: the still kept on its transparent film; its faded parts (rendered alone on their own film) laid over at a third, alpha and all"""
    if not pathlib.Path(ghost).exists():return
    from PIL import Image
    im=Image.open(f).convert('RGBA');g=Image.open(ghost).convert('RGBA');g.putalpha(g.getchannel('A').point(lambda v:int(v*0.35)))
    Image.alpha_composite(im,g).save(f);pathlib.Path(ghost).unlink()

def pagecams(shots,W,H):
    """each shot's camera on the page: opened at W x H on its hash (a hand-set camera through __look), its position and target in the page's world (mm, y
    up), its vertical field and its canvas's aspect"""
    import asyncio,browser,model
    from playwright.async_api import async_playwright
    # its camera in the page's world (mm, y up), and the parts it has faded: a mesh wearing a see-through copy of its material (look(): a see-through view's
    # plates, the parts away from a picked one)
    READ="""()=>{const i=JSON.parse(__camInfo()),g=new Set();__mv.traverse(o=>{const m=o.material;if(o.isMesh&&m&&m.transparent&&(m.opacity??1)<0.5&&o.userData.part)g.add(o.userData.part)});
      return {pos:i.pos,tgt:i.tgt,fov:i.fov,aspect:i.aspect,ghosts:[...g]}}"""
    TURN="""(c)=>{const m=__mv;m.updateMatrixWorld(true);const t=c.length>=6?c.slice(3,6):m.worldToLocal(m.position.clone().set(...JSON.parse(__camInfo()).tgt)).toArray();
      __look(c[0],c[1],c[2],...t)}"""
    async def go():
        async with async_playwright() as p:
            b=await p.chromium.launch(args=browser.ARGS);w=await b.new_page();await w.set_content('<canvas></canvas>')
            await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
            pg=await b.new_page(viewport={'width':W,'height':H},device_scale_factor=1);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            for S in shots:
                await pg.goto('about:blank');await pg.goto(model.PAGE.split('#')[0]+'#'+S['hash'])
                await pg.wait_for_function("!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(2500)
                if S.get('cam'):await pg.evaluate(TURN,S['cam']);await pg.wait_for_timeout(1500)
                S['page']=await pg.evaluate(READ)
            await b.close()
            if errs:sys.exit('page errors: '+'; '.join(errs))
    asyncio.run(go())

if bpy is None:   # outside Blender: read each view's camera off the page, export if asked, run this file in Blender, lay each still on paper
    import argparse,urllib.parse,model
    from hamilton_render import blender
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--view',default='dial,movement,exploded');a.add_argument('--link',action='append',default=[]);a.add_argument('--cam')
    a.add_argument('--list',action='store_true');a.add_argument('--glb');a.add_argument('--lines',default='lineart',choices=['lineart','freestyle'])
    a.add_argument('--shots',help='a JSON list of shots made elsewhere (laidout.py --pen), each with its page camera (page), rig controls (ctl), alone, and show, ghost, hide: {parts, hns, devOf}')
    a.add_argument('--flat',action='store_true',help='no paper grain: for a sheet that adds its own over the whole')
    a.add_argument('--photo',action='store_true',help="photographic: Cycles on the export's own materials under a studio light, on a transparent film (assembled.py); a shot may cut its parts by a plane (cut)")
    a.add_argument('--samples',type=int,default=160)
    a.add_argument('--size',default='1600x1150');a.add_argument('--out',default=str(HERE/'r_pen'));o=a.parse_args();PZ=POSE[model.NAME]
    if o.list:print(model.NAME+':',', '.join(PZ));sys.exit(0)
    W,H=(int(x) for x in o.size.split('x'));shots=json.loads(pathlib.Path(o.shots).read_text(encoding='utf-8')) if o.shots else []
    def pose(h):
        q=dict(urllib.parse.parse_qsl(h));v=q.get('view','dial')
        if v not in PZ:sys.exit(f'{model.NAME} has no view {v!r} to draw (its views: {", ".join(PZ)}); a walkthrough step or an essay section is not one')
        c=dict(PZ[v]);box=c.pop('box',0)
        if 'explode' in c and 'pcs' in q:c['explode']=int(q['pcs'])/100
        if not box:c['lift']=1
        return dict(ctl=c,alone=not box)
    for i,L in enumerate(o.link):
        h=L.split('#',1)[1] if '#' in L else L;shots.append(dict(name='link'+(f'_{i+1}' if i else ''),hash=h,**pose(h)))
    if not o.link and not o.shots:
        for v in o.view.split(','):shots.append(dict(name=v,hash='view='+v,**pose('view='+v)))
    if o.cam:
        for S in shots:S['cam']=[float(x) for x in o.cam.split(',')]
    if not o.shots:print('reading',len(shots),'cameras off the page',flush=True);pagecams(shots,W,H)
    out=pathlib.Path(o.out).resolve();out.mkdir(parents=True,exist_ok=True)
    if o.glb:glb=pathlib.Path(o.glb).resolve()
    else:
        glb=(out/model.cfg('GLTF',{}).get('glb','r_model21.glb')).resolve();print('exporting',glb.name,'(gltf_check.py)',flush=True)
        r=subprocess.run([sys.executable,str(HERE/'gltf_check.py')]+([] if model.HAMILTON else ['--model',model.NAME]),cwd=out)
        if r.returncode or not glb.exists():sys.exit('the export failed')
    js=out/'pen.json';js.write_text(json.dumps({'glb':str(glb),'rig':str(RIG),'out':str(out),'model':model.NAME,'shots':shots,'size':[W,H],'paper':PAPER,'lines':o.lines,'photo':o.photo,'samples':o.samples,
      'hdri':str(next(pathlib.Path(blender()).parent.glob('*/datafiles/studiolights/world/studio.exr'))) if o.photo else None}),encoding='utf-8')
    print(f'rendering {len(shots)} stills in Blender',flush=True)
    r=subprocess.run([blender(),'-b','--factory-startup','--python',str(pathlib.Path(__file__).resolve()),'--',str(js)],capture_output=True,text=True,encoding='utf-8',errors='replace')
    for l in r.stdout.splitlines():
        if l.startswith(('MC ','Traceback','  File')) or 'Error' in l:print(' ',l)
    if r.returncode:print(r.stderr[-3000:]);sys.exit('Blender failed')
    for S in shots:
        f=out/f"pen_{model.NAME}_{S['name']}.png"
        g=out/f"pen_{model.NAME}_{S['name']}_ghost.png"
        if f.exists():(photofinish(f,g) if o.photo else paper(f,f,ghost=g,tooth=not o.flat));print('wrote',f)
        else:sys.exit(f"no still for {S['name']}")
    sys.exit(0)

# ---- inside Blender ----
import colorsys,math
from mathutils import Vector
A=json.load(open(sys.argv[sys.argv.index('--')+1],encoding='utf-8'));PHOTO=bool(A.get('photo'))
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=A['glb'])
exec(compile(open(A['rig'],encoding='utf-8').read(),A['rig'],'exec'),{'__name__':'__main__','__file__':A['rig']})
sc=bpy.context.scene;ctl=bpy.data.objects.get('Chronometer controls');PAPER=tuple(A['paper']);INK=(0.10,0.065,0.04)
# the export's meshes come in as separate triangles (every vertex its own, every edge open), and a flat face with holes as long thin triangles fanning
# from hole to hole: Freestyle found no creases, and drew those fans across the plates as silhouettes (its test is unsteady on slivers; the owner saw
# them on the Wempe's pillar plate). Each mesh welded (to 1e-6 of its units), each flat region merged and triangulated again
# without slivers (beauty), its normals then from its faces, sharp past 40 degrees. Its faces keep their winding: turned "outward", the dial's printed
# face (an open surface over its disc) faced down and the import's back-face culling hid it
import bmesh
for me in {o.data for o in bpy.data.objects if o.type=='MESH'}:
    bm=bmesh.new();bm.from_mesh(me);bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-6)
    bmesh.ops.dissolve_limit(bm,angle_limit=math.radians(0.5),verts=bm.verts,edges=bm.edges);bmesh.ops.triangulate(bm,faces=bm.faces,quad_method='BEAUTY',ngon_method='BEAUTY');bm.to_mesh(me);bm.free()
    if 'custom_normal' in me.attributes:me.attributes.remove(me.attributes['custom_normal'])
    me.set_sharp_from_angle(angle=math.radians(40))
print('MC welded',flush=True)

# each material's watercolour by name (the Hamilton's export); another is placed by its colour. TEX: how much of a material's map shows (the dial's
# printing whole, the wood's grain a hint, the plates' damascening none: it read as stripes)
PAL={'brass':(0.96,0.76,0.38),'brass2':(0.92,0.7,0.34),'gilt':(0.97,0.79,0.4),'copper':(0.92,0.66,0.5),
     'steel':(0.94,0.95,0.97),'steelS':(0.9,0.92,0.95),'steelD':(0.74,0.77,0.82),'steelK':(0.6,0.64,0.72),'invar':(0.84,0.85,0.83),
     'blued':(0.48,0.58,0.86),'mspring':(0.55,0.62,0.84),'chain':(0.76,0.78,0.82),'chain2':(0.68,0.7,0.75),
     'felt':(0.66,0.8,0.7),'fibre':(0.7,0.72,0.72),'packing':(0.6,0.6,0.6),'ruby':(0.92,0.52,0.56),'clear':(0.9,0.92,0.95),
     'plate':(0.96,0.96,0.95),'plateSolid':(0.96,0.96,0.95),'wood':(0.94,0.8,0.68),'woodEdge':(0.88,0.7,0.58)}
TEX={'plate':0.0,'wood':0.1,'engraveB':0.25}
def wash(m,c):
    if m.name in PAL:return PAL[m.name]
    if c is None:return (0.9,0.9,0.9)
    h,s,v=colorsys.rgb_to_hsv(*[max(0,x) for x in c[:3]])
    if 0.04<h<0.2 and s>0.3:return PAL['brass']                                  # brass, gilt
    if 0.0<=h<=0.04 or h>0.9:return (0.92,0.6,0.5) if s>0.5 and v>0.3 else PAL['wood']   # copper, a ruby, or a dark red-brown: wood
    if s<0.25:return colorsys.hsv_to_rgb(0.6,0.05,0.6+0.38*min(1,v*1.4))          # steel and nickel, near white; dark steel a grey
    if 0.55<h<0.75:return PAL['blued']
    return colorsys.hsv_to_rgb(h,min(0.45,s*0.7),0.72+0.28*v)

def texwood(n):
    """whether an image texture's mean colour is a dark red-brown: a wood"""
    im=getattr(n,'image',None)
    if not im:return False
    c=im.copy();c.scale(16,16);px=list(c.pixels);bpy.data.images.remove(c);k=len(px)//4
    h,s,v=colorsys.rgb_to_hsv(*(sum(px[i::4])/k for i in range(3)))
    return (h<0.1 or h>0.95) and s>0.35 and v<0.6

def restyle(m):
    if not m.use_nodes:return
    nt=m.node_tree;P=next((n for n in nt.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if not P:return
    out=next(n for n in nt.nodes if n.type=='OUTPUT_MATERIAL');L=nt.links.new;N=nt.nodes.new
    if P.inputs['Transmission Weight'].default_value>0.5:L(N('ShaderNodeBsdfTransparent').outputs[0],out.inputs['Surface']);return   # glass, crystal: Freestyle's outline only
    base=P.inputs['Base Color'];tex=base.links[0].from_socket if base.is_linked else None;metal=P.inputs['Metallic'].default_value
    if tex and m.name not in PAL and texwood(base.links[0].from_node):PAL[m.name]=PAL['wood'];TEX[m.name]=TEX['wood']   # a wood unnamed in the export (the Wempe's)
    def mix(kind,fac,a,b):
        x=N('ShaderNodeMix');x.data_type='RGBA';x.blend_type=kind
        for i,v in ((0,fac),(6,a),(7,b)):
            if isinstance(v,(int,float)):x.inputs[i].default_value=v
            elif isinstance(v,tuple):x.inputs[i].default_value=(*v,1)
            else:L(v,x.inputs[i])
        return x.outputs[2]
    def ramp(src,lo,hi,to=1.0):   # smoothstep of a shader's light, lo..hi onto 0..to
        S=N('ShaderNodeShaderToRGB');L(src,S.inputs[0]);V=N('ShaderNodeRGBToBW');L(S.outputs[0],V.inputs[0]);R=N('ShaderNodeMapRange');R.interpolation_type='SMOOTHSTEP'
        for k,v in (('From Min',lo),('From Max',hi),('To Min',0.0),('To Max',to)):R.inputs[k].default_value=v
        L(V.outputs[0],R.inputs['Value']);return R.outputs['Result']
    D=N('ShaderNodeBsdfDiffuse');D.inputs['Color'].default_value=(1,1,1,1);lit=ramp(D.outputs[0],0.12,0.85)   # the light painted in soft gradients
    col=wash(m,None if tex else base.default_value);C=N('ShaderNodeRGB');C.outputs[0].default_value=(*col,1);src=C.outputs[0]
    if tex:src=mix('MIX',TEX.get(m.name,1.0),src,tex)
    r,g,b=col;mx=max(col);sat=(mx-min(col))/max(mx,1e-6)   # the shade as a painter lays it: brass into amber, steel and white into blue-grey, the rest a darker self
    tint=(0.66,0.44,0.24) if sat>0.25 and r>g>b else (0.6,0.67,0.82) if sat<0.12 else (0.62,0.56,0.56)
    LW=N('ShaderNodeLayerWeight');LW.inputs['Blend'].default_value=0.35   # form: toward the shade where a surface turns away
    F=N('ShaderNodeMath');F.operation='MULTIPLY_ADD';F.inputs[1].default_value=-0.45;F.inputs[2].default_value=1.0;L(LW.outputs['Facing'],F.inputs[0])
    FM=N('ShaderNodeMath');FM.operation='MULTIPLY';FM.use_clamp=True;L(lit,FM.inputs[0]);L(F.outputs[0],FM.inputs[1])
    c=mix('MIX',FM.outputs[0],mix('MULTIPLY',1,src,tint),mix('MULTIPLY',1,src,(1.07,1.06,1.04)))
    Gl=N('ShaderNodeBsdfGlossy');Gl.inputs['Roughness'].default_value=0.18;Gl.inputs['Color'].default_value=(1,1,1,1)   # the metal's glint, added as white
    c=mix('MIX',ramp(Gl.outputs[0],0.45,0.9,0.85*min(1.0,metal*1.2)),c,(1,0.98,0.93))
    E=N('ShaderNodeEmission');L(c,E.inputs[0]);L(E.outputs[0],out.inputs['Surface'])
for m in bpy.data.materials:
    if not PHOTO:restyle(m)

# the paper, seen by the camera and lighting little; a key light and a rim from behind on the other side
if not PHOTO:
  w=bpy.data.worlds.new('paper');sc.world=w;w.use_nodes=True;wn=w.node_tree;B=wn.nodes['Background'];B.inputs[0].default_value=(*PAPER,1)
  B2=wn.nodes.new('ShaderNodeBackground');B2.inputs[1].default_value=0.22;LP=wn.nodes.new('ShaderNodeLightPath');MX=wn.nodes.new('ShaderNodeMixShader')
  wn.links.new(LP.outputs['Is Camera Ray'],MX.inputs[0]);wn.links.new(B2.outputs[0],MX.inputs[1]);wn.links.new(B.outputs[0],MX.inputs[2]);wn.links.new(MX.outputs[0],wn.nodes['World Output'].inputs[0])
def sun(name,e,ang,rot,shadow=True):
    o=bpy.data.objects.new(name,bpy.data.lights.new(name,'SUN'));sc.collection.objects.link(o);o.data.energy=e;o.data.angle=math.radians(ang);o.data.use_shadow=shadow
    o.rotation_euler=tuple(math.radians(x) for x in rot)
if not PHOTO:
  sun('key',3.6,8,(38,-28,-40));sun('rim',1.6,4,(70,35,150),False)
  sc.view_settings.view_transform='Standard'
  for e in('BLENDER_EEVEE','BLENDER_EEVEE_NEXT'):
    try:sc.render.engine=e;break
    except TypeError:pass
else:   # --photo: wempe_showcase.py's Cycles, its studio HDRI in the reflections and AgX; the film transparent, so the sheet puts its own ground under it
  sc.render.engine='CYCLES';cy=sc.cycles;pr=bpy.context.preferences.addons['cycles'].preferences;dev='NONE'
  for dt in ('OPTIX','CUDA','HIP','ONEAPI','METAL'):
    try:
      pr.compute_device_type=dt;pr.refresh_devices()
      if any(x.type==dt for x in pr.devices):dev=dt;break
    except Exception:pass
  if dev!='NONE':
    for x in pr.devices:x.use=(x.type==dev)
    cy.device='GPU'
  print('MC device',dev,flush=True)
  cy.samples=A['samples'];cy.use_denoising=True;cy.use_adaptive_sampling=True;cy.max_bounces=12;cy.glossy_bounces=8;cy.transparent_max_bounces=16
  sc.view_settings.view_transform='AgX';sc.view_settings.look='AgX - Medium High Contrast';sc.render.film_transparent=True
  sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGBA'
  w=bpy.data.worlds.new('studio');sc.world=w;w.use_nodes=True;wn=w.node_tree;env=wn.nodes.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(A['hdri'])
  wn.links.new(env.outputs['Color'],wn.nodes['Background'].inputs['Color']);wn.nodes['Background'].inputs['Strength'].default_value=0.9

# the pen: Freestyle line sets (a heavy contour, outlines, creases), each a calligraphic pen tapered at its ends, short strokes dropped. No border edges:
# every part is a closed solid, and the glTF import splits its meshes at their seams, so a border was a flat face's triangle fan drawn across it
sc.render.use_freestyle=not PHOTO;sc.render.line_thickness_mode='ABSOLUTE';fs=sc.view_layers[0].freestyle_settings;fs.crease_angle=math.radians(140);fs.use_smoothness=True
def pen(name,colour,thick,lo,hi,stretch,edges,minlen):
    ls=fs.linesets.new(name);ls.select_by_visibility=True;ls.visibility='VISIBLE';ls.select_by_edge_types=True
    for k in('silhouette','border','crease','external_contour'):setattr(ls,'select_'+k,k in edges)
    st=bpy.data.linestyles.new(name);ls.linestyle=st;st.color=colour;st.thickness=thick;st.chaining='PLAIN';st.use_length_min=True;st.length_min=minlen
    if stretch:st.geometry_modifiers.new('stretch','BACKBONE_STRETCHER').backbone_length=stretch
    c=st.thickness_modifiers.new('pen','CALLIGRAPHY');c.orientation=35;c.thickness_min=lo;c.thickness_max=hi
    t=st.thickness_modifiers.new('taper','ALONG_STROKE');t.blend='MULTIPLY';t.mapping='CURVE';cv=t.curve;p=cv.curves[0].points
    p[0].location=(0,0.3);p[1].location=(1,0.3);p.new(0.15,1.0);p.new(0.85,1.0);cv.update()
if not PHOTO:pen('contour',INK,5.0,3.4,6.4,1.5,('external_contour',),3);pen('inner',(0.36,0.26,0.18),1.1,0.8,1.4,0,('crease',),6)
if A['lines']=='freestyle' and not PHOTO:pen('outline',INK,2.6,1.6,3.4,1.0,('silhouette',),3)
# or Line Art (the default): its hidden lines worked out exactly on the triangles. Freestyle's ray test broke a curved wall's silhouette into dashes
# (the rings in the Wempe's exploded view; the owner, 2 November 2026). One pass, the contours: Freestyle keeps the heavy outer outline and the creases,
# which never broke (Line Art's three passes, a heavy outline, the contours and the creases, took 35 minutes a still against Freestyle's 2)
# A stroke's radius is in the world's units, so each view sets it from its camera's distance (PX: a pixel's size there)
LA=[]
if A['lines']=='lineart' and not PHOTO:
    def gpmat(name,c):
        m=bpy.data.materials.new(name);bpy.data.materials.create_gpencil_data(m);m.grease_pencil.color=(*c,1);return m
    bpy.ops.object.grease_pencil_add(type='LINEART_SCENE');gp=bpy.context.active_object;gp.modifiers.clear();gp.data.materials.clear()
    mi,mc=gpmat('ink',INK),gpmat('crease',(0.36,0.26,0.18));gp.data.materials.append(mi);gp.data.materials.append(mc);lay=gp.data.layers[0].name
    def art(name,mat,k,contour,crease,sil='NONE'):
        m=gp.modifiers.new(name,'LINEART');m.source_type='SCENE';m.target_layer=lay;m.target_material=mat;m.use_contour=contour;m.use_crease=crease
        m.use_intersection=False;m.use_loose=False;m.use_material=False;m.use_edge_mark=False;m.silhouette_filtering=sil;m.crease_threshold=math.radians(140);m.smooth_tolerance=0.1
        LA.append((m,k))
    art('contour',mi,2.6,True,False)
    gp.hide_render=False

cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam'));sc.collection.objects.link(cam);sc.camera=cam;cam.data.lens=50;cam.data.clip_start=0.001
sc.render.resolution_x,sc.render.resolution_y=A['size']
mv=next(o for o in bpy.data.objects if o.get('role')=='movement')
def under(o,a):
    while o:
        if o is a:return True
        o=o.parent
    return False
inmv={o for o in bpy.data.objects if under(o,mv)}
def key(o):   # every part key along its ancestry ("... (dial)"), so a hand's mesh is under "hands" (wempe_showcase.py's)
    k=set()
    while o:
        n=o.name.split('.')[0]
        if n.endswith(')') and '(' in n:k.add(n[n.rindex('(')+1:-1])
        o=o.parent
    return k
K={o:key(o) for o in bpy.data.objects if o.type in('MESH','CURVE')}
# the laid out view's schematic plates (the export's "laid out stand-in: ..." nodes): the page draws them see-through, so they go to the faded layer
S0=[q for q in bpy.data.objects if q.name.startswith('laid out stand-in')];STAND={o for o in K if any(under(o,q) for q in S0)}
def prop(o,k,stop=None):   # a custom property (the export's node extras: part, hn, devOf) on the object or the nearest above it that has it
    while o:
        if k in o.keys():return o[k]
        if stop and stop in o.keys():return None
        o=o.parent
    return None
HNO={o:prop(o,'hn','part') or prop(o,'hn') for o in K};DEVO={o:prop(o,'devOf') for o in K}
def picks(o,sel):   # a shot's selection (laidout.py's close-ups): parts by key, pieces by their parts-list line, stand-ins by what they stand in for
    return bool(sel) and (bool(K[o]&set(sel.get('parts',[]))) or HNO[o] in set(sel.get('hns',[])) or (DEVO[o] is not None and DEVO[o] in set(sel.get('devOf',[]))))
from mathutils import Matrix
# the page's world (mm, y up) is Blender's (m, z up) as (x, -z, y) / 1000: the export's clips put every part where the page does (blender_check.py holds the
# rig to them), so the page's camera is the camera. The page pulls its camera back on a canvas narrower than 3:2 (aspectK); the still's own aspect is put back
B=lambda v:Vector((v[0],-v[2],v[1]))/1000;AK=lambda a:min(max(1.25/a,1),2.2)
cam.data.sensor_fit='VERTICAL'
for S in A['shots']:
    shown={o for o in K if not(S['alone'] and o not in inmv)}
    if S.get('show'):shown={o for o in shown if picks(o,S['show']) and o not in STAND}   # these parts alone
    if S.get('hide'):shown={o for o in shown if not picks(o,S['hide'])}
    if not S['ctl'].get('laid_out'):shown-=STAND   # the laid out view's stand-in plates belong to it alone (assembled.py's stills)
    gh={o for o in shown if K[o]&set(S['page'].get('ghosts',[])) or o in STAND or picks(o,S.get('ghost'))}
    for o in K:o.hide_render=o not in shown or o in gh   # the faded parts left out: drawn, they would hide the lines behind them
    for k,v in S['ctl'].items():ctl[k]=float(v)
    SZ=S.get('size') or A['size'];sc.render.resolution_x,sc.render.resolution_y=SZ   # a shot may have a size of its own (penposter.py's pieces)
    ctl.update_tag();sc.frame_set(0);bpy.context.view_layer.update()
    up0=None
    if S.get('mvup'):   # the movement raised (mm, the world's up: the box upright) out of its bowl as it stands, not turned over (penposter.py's centre)
        up0=mv.location.copy();mv.location=mv.location+mv.parent.matrix_world.inverted().to_3x3()@Vector((0,0,S['mvup']/1000));bpy.context.view_layer.update()
    P=S['page'];tgt=B(P['tgt']);pos=tgt+(B(P['pos'])-tgt)*AK(SZ[0]/SZ[1])/AK(P['aspect']);up=Vector((0,0,1))
    f=(tgt-pos).normalized();r=f.cross(up).normalized();u=r.cross(f)
    cam.matrix_world=Matrix.Translation(pos)@Matrix((r,u,-f)).transposed().to_4x4();cam.data.angle_y=math.radians(P['fov'])
    d=(tgt-pos).length;cam.data.clip_start=d/200;cam.data.clip_end=d*60
    PX=2*d*math.tan(math.radians(P['fov'])/2)/SZ[1]   # a pixel's size at the target
    for m,k in LA:m.radius=k*PX
    made=[]
    if PHOTO:   # the lights placed about the view as wempe_showcase.py places them about its shot: a key, a fill, a rim, and a softbox at the camera's mirror image in the plates
        def light(name,loc,size,energy,at):
            l=bpy.data.lights.new(name,'AREA');l.size=size;l.energy=energy;o=bpy.data.objects.new(name,l);sc.collection.objects.link(o);o.location=loc
            o.rotation_euler=(at-loc).to_track_quat('-Z','Y').to_euler();o.visible_camera=False;made.append(o)   # never in the picture: seen from behind, an area light is a black card
        R=d*math.tan(math.radians(P['fov'])/2)*1.3;dv=(pos-tgt).normalized();side=dv.cross(up);side=side.normalized() if side.length>1e-6 else r
        bk=(dv-dv.dot(up)*up);bk=bk.normalized() if bk.length>1e-6 else -u
        light('key',tgt+(side*-0.8+bk*0.5+up*1.1).normalized()*R*7,R*4,90*R*R,tgt);light('fill',tgt+(side*1.0+bk*0.7+up*0.4).normalized()*R*7,R*5,22*R*R,tgt)
        light('rim',tgt+(side*0.3-bk*1.0+up*0.7).normalized()*R*6,R*3,110*R*R,tgt);mir=-(dv-2*dv.dot(up)*up);light('softbox',tgt+mir*d*0.6,d*0.45,1.6*(d*0.6)**2,tgt)
    cut=[]
    if S.get('cut'):   # a section: the plane through p (the page's world, mm), its normal n toward the half kept; a solid wholly beyond it hidden, one across it cut by an exact boolean (its cut face in its own first material)
        cp=B(S['cut']['p']);cn=Vector((S['cut']['n'][0],-S['cut']['n'][2],S['cut']['n'][1])).normalized();hh=0.2
        # each solid cut by a cutter of its own carrying a cut face of its own (the boolean's material transfer): its metal darkened and hatched in the picture's plane,
        # 45 or 135 degrees, its pitch and phase its own, so two parts cut side by side read apart, as a drawn section hatches them; Freestyle draws each cut face's
        # outline (its material's boundary) in a thin dark line (the owner, 8 November 2026: the cut parts' edges were invisible, the section a monolith)
        bm0=bmesh.new();bmesh.ops.create_cube(bm0,size=2*hh);cme=bpy.data.meshes.new('cutter');bm0.to_mesh(cme);bm0.free()
        rot=cn.to_track_quat('Z','Y').to_matrix().to_4x4();CM=Matrix.Translation(cp-cn*hh)@rot
        def cutmat(o,i):
            m0=next((s.material for s in o.material_slots if s.material),None);P0=m0 and m0.use_nodes and next((n for n in m0.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
            col=tuple(P0.inputs['Base Color'].default_value)[:3] if P0 else (0.7,0.7,0.7);met=P0.inputs['Metallic'].default_value if P0 else 0.5
            m=bpy.data.materials.new(f'cut {i}');m.use_nodes=True;nt=m.node_tree;N=nt.nodes.new;L=nt.links.new;Pb=nt.nodes['Principled BSDF']
            Pb.inputs['Metallic'].default_value=met*0.6;Pb.inputs['Roughness'].default_value=0.5
            tc=N('ShaderNodeTexCoord');sx=N('ShaderNodeSeparateXYZ');L(tc.outputs['Window'],sx.inputs[0])
            h=(hash(o.name)&0xffff)/65535;ang=math.radians((45,135,60,120)[(hash(o.name)>>17)&3]);pitch=SZ[1]/(95 if h<0.5 else 70);ph=h*7.3
            def mth(op,a,c=None):
                x=N('ShaderNodeMath');x.operation=op
                for k,v in enumerate((a,c)):
                    if v is None:continue
                    if isinstance(v,(int,float)):x.inputs[k].default_value=v
                    else:L(v,x.inputs[k])
                return x.outputs[0]
            t=mth('ADD',mth('MULTIPLY',sx.outputs[0],SZ[0]*math.cos(ang)/pitch),mth('MULTIPLY',sx.outputs[1],SZ[1]*math.sin(ang)/pitch))
            ln=mth('LESS_THAN',mth('FRACT',mth('ADD',t,ph)),0.22)
            mx=N('ShaderNodeMix');mx.data_type='RGBA';L(ln,mx.inputs[0]);mx.inputs[6].default_value=(*[c*0.78 for c in col],1);mx.inputs[7].default_value=(*[c*0.32 for c in col],1)
            L(mx.outputs[2],Pb.inputs['Base Color']);made_m.append(m);return m
        made_m=[];cme.materials.append(None);bpy.context.view_layer.update();n=0;dg0=bpy.context.evaluated_depsgraph_get()
        for o in K:
            if o.hide_render or o.type!='MESH':continue
            mw=o.matrix_world;sd=[(mw@v.co-cp).dot(cn) for v in o.evaluated_get(dg0).data.vertices]
            if not sd:continue
            if max(sd)<=0:o.hide_render=True;cut.append((o,None))
            elif min(sd)<0:
                cu=bpy.data.objects.new('cutter',cme);sc.collection.objects.link(cu);cu.matrix_world=CM;cu.hide_render=True;cu.display_type='WIRE'
                for k in ('visible_camera','visible_diffuse','visible_glossy','visible_transmission','visible_volume_scatter','visible_shadow'):setattr(cu,k,False)   # never drawn: the camera stands inside it
                cu.material_slots[0].link='OBJECT';cu.material_slots[0].material=cutmat(o,n);made.append(cu);n+=1
                m=o.modifiers.new('cut','BOOLEAN');m.operation='DIFFERENCE';m.object=cu;m.solver='EXACT';m.material_mode='TRANSFER';cut.append((o,m))
        made_me=[cme]
        fsl=None
        if PHOTO:   # the cut faces' outlines
            sc.render.use_freestyle=True;sc.render.line_thickness_mode='ABSOLUTE';fsl=fs.linesets.new('cut outline');fsl.select_by_visibility=True;fsl.visibility='VISIBLE';fsl.select_by_edge_types=True
            for k in('silhouette','border','crease','external_contour','material_boundary'):setattr(fsl,'select_'+k,k=='material_boundary')
            st=bpy.data.linestyles.new('cut outline');fsl.linestyle=st;st.color=(0.05,0.04,0.03);st.thickness=max(1.0,SZ[1]/800);st.chaining='PLAIN'
        # a boolean that fails on a solid can hand back the cutter or an inside-out shell: any result reaching past the solid's own box is tried again with the float
        # solver, then left out (named) if that fails too
        bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();bad=[]
        def grew(o):
            e=o.evaluated_get(dg);b1=[Vector(c) for c in e.bound_box];V0=[v.co for v in o.data.vertices];lo0=Vector([min(c[i] for c in V0) for i in range(3)]);hi0=Vector([max(c[i] for c in V0) for i in range(3)])   # the mesh's own vertices: an object's bound_box is already the cut one's
            return any(min(c[i] for c in b1)<lo0[i]-1e-5 or max(c[i] for c in b1)>hi0[i]+1e-5 for i in range(3))
        for o,m in cut:
            if m and grew(o):
                m.solver='FLOAT';bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
                if grew(o):o.hide_render=True;bad.append(o.name)
        bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();clip=[]
        for i,(o,m) in enumerate(cut):
            if not m or o.hide_render:continue
            mw=o.matrix_world;EV=[mw@v.co for v in o.evaluated_get(dg).data.vertices]
            P0=[mw@v.co for v in o.evaluated_get(dg0).data.vertices];K0=[q for q in P0 if (q-cp).dot(cn)>0]   # the posed solid's kept half, before the cut
            lo=lambda Q,k:min(q[k] for q in Q);hi=lambda Q,k:max(q[k] for q in Q)
            short=not EV or (bool(K0) and any(lo(K0,k)<lo(EV,k)-2e-4 or hi(K0,k)>hi(EV,k)+2e-4 for k in range(3)))
            if not short:   # and its surface: every face wholly on the kept side must outlive the cut (the ring's far half once lost its faces but kept its extent)
                def area(me,keep=False):
                    W=[mw@v.co for v in me.vertices];s=0.0
                    for f in me.polygons:
                        Q=[W[i] for i in f.vertices]
                        if keep and any((q-cp).dot(cn)<-1e-7 for q in Q):continue
                        s+=sum(((Q[i]-Q[0]).cross(Q[i+1]-Q[0])).length/2 for i in range(1,len(Q)-1))
                    return s
                a0=area(o.evaluated_get(dg0).data,True);short=a0>0 and area(o.evaluated_get(dg).data)<0.98*a0
            if not short and max(((q-cp).dot(-cn) for q in EV),default=0)<1e-5:continue   # cut right: nothing past the plane, and its kept half whole (the boolean once ate the ring's far half)
            cm=m.object.material_slots[0].material;o.modifiers.remove(m);bpy.context.view_layer.update();ev=o.evaluated_get(bpy.context.evaluated_depsgraph_get())
            me=bpy.data.meshes.new_from_object(ev);bm=bmesh.new();bm.from_mesh(me);inv=mw.inverted();co=inv@cp;no=(inv.to_3x3().transposed().inverted()@(-cn)).normalized()
            r0=bmesh.ops.bisect_plane(bm,geom=bm.verts[:]+bm.edges[:]+bm.faces[:],plane_co=co,plane_no=no,clear_outer=True,dist=1e-7)
            ce=[x for x in r0['geom_cut'] if isinstance(x,bmesh.types.BMEdge)]
            try:
                f0=bmesh.ops.triangle_fill(bm,use_beauty=True,use_dissolve=False,edges=ce)['geom'];me.materials.append(cm);mi=len(me.materials)-1
                for f in f0:
                    if isinstance(f,bmesh.types.BMFace):f.material_index=mi
            except Exception:pass
            bm.to_mesh(me);bm.free();old=o.data;o.data=me;sk=[(k,k.show_viewport,k.show_render) for k in o.modifiers]
            for k,_,_ in sk:k.show_viewport=k.show_render=False   # the copy is already posed
            clip.append((o,old,me,sk));cut[i]=(o,None);o.hide_render=False
        if clip:print('MC clipped by bisect (the boolean left them whole):',', '.join(o.name for o,*_ in clip)[:300],flush=True)
        print('MC cut',sum(1 for _,m in cut if m),'solids across the plane,',sum(1 for _,m in cut if not m),'beyond it'+(f'; {len(bad)} left out, their cut failed: '+', '.join(bad[:12]) if bad else ''),flush=True)
    sc.render.filepath=str(pathlib.Path(A['out'])/f"pen_{A['model']}_{S['name']}.png");bpy.ops.render.render(write_still=True);print('MC rendered',sc.render.filepath,flush=True)
    if gh:   # then the faded parts alone on a clear film, which the paper lays over the drawing at a third
        for o in K:o.hide_render=o not in gh
        sc.render.film_transparent=True;sc.render.image_settings.color_mode='RGBA'
        sc.render.filepath=str(pathlib.Path(A['out'])/f"pen_{A['model']}_{S['name']}_ghost.png");bpy.ops.render.render(write_still=True)
        sc.render.film_transparent=PHOTO;sc.render.image_settings.color_mode='RGBA' if PHOTO else 'RGB';print('MC rendered its faded parts:',len(gh),'meshes',flush=True)
    for k in S['ctl']:ctl[k]=0.0
    for o,m in cut:
        if m:o.modifiers.remove(m)
        else:o.hide_render=False
    for o in made:bpy.data.objects.remove(o,do_unlink=True)
    if S.get('cut'):
        for o,old,me,sk in clip:
            o.data=old;bpy.data.meshes.remove(me)
            for k,v,r in sk:k.show_viewport,k.show_render=v,r
        for m in made_m:bpy.data.materials.remove(m)
        for me in made_me:bpy.data.meshes.remove(me)
        if fsl:fs.linesets.remove(fsl);sc.render.use_freestyle=not PHOTO
    if up0 is not None:mv.location=up0
