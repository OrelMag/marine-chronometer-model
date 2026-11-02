"""penrender.py: stills of a model drawn as an ink-and-watercolour illustration, in Blender: EEVEE with Blender's Line Art pen lines (a heavy line round
each part's own outline, every contour, the creases in a lighter ink) over each material painted as a wash (its own colour in the light, shading into a warm
or a cool shade of itself, darker where a surface turns away, a white glint on metal), under a key and a rim light, on cream paper with a faint tooth. The
model is the page's own export to Blender (gltf_check.py's), posed by the rig (blender/rig.py). Each still is one of the page's views, seen as the page sees
it: the tool opens the page (headless, at the still's size) on that view or link, reads its camera (?qa's __camInfo) and carries it into the movement's own
frame, so any view, link or camera on the page can be drawn. An illustration for its own sake: every line is the model's, nothing is simplified or left out
as an illustrator would. Not run by build.py or ci.py.

    python penrender.py [--model wempe] [--view dial,movement,exploded] [--glb FILE] [--size 1600x1150] [--out DIR]
    python penrender.py --link "https://.../hamilton/#view=train&part=fs"    # a page link (its hash: the view, the explode share, a camera when it has one)
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
# out of its case alone. The camera is the page's. The Wempe's transport view (an outer box) is in no export, and isn't listed
POSE={'hamilton':{'box':dict(box=1,lids=1),'dial':dict(box=1),'movement':{},'train':{},'escapement':{},'exploded':dict(explode=1),'laidout':dict(laid_out=1),
                  'fusee':{},'balance':{}},
      'wempe':{'dial':dict(box=1),'box':dict(box=1,lids=1),'case':dict(box=1),'movement':{},'plan':{},'side':{},'exploded':dict(explode=1),'laidout':dict(laid_out=1),
               'escapement':{},'train':{},'fusee':{},'balance':{}}}
PAPER=(0.965,0.945,0.9)

def paper(src,dst,centre=False):
    """the render laid on drawing paper (centre: a drawing that stands clear of the sheet's edges centred at 88 % of it), then a faint tooth and fibre that the
    colour takes up most in its mid washes"""
    import numpy as np
    from PIL import Image
    from scipy.ndimage import gaussian_filter
    im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)/255;H,W,_=im.shape;bg=im[2,2].copy();ys,xs=np.nonzero(np.abs(im-bg).max(2)>0.04)
    if centre and len(xs) and not(xs.min()<3 or ys.min()<3 or xs.max()>W-4 or ys.max()>H-4):
        c=im[ys.min():ys.max()+1,xs.min():xs.max()+1];k=min(0.88*W/c.shape[1],0.88*H/c.shape[0])
        c=np.asarray(Image.fromarray((c*255).astype(np.uint8)).resize((int(c.shape[1]*k),int(c.shape[0]*k)),Image.LANCZOS)).astype(np.float32)/255
        im=np.ones_like(im)*bg;y0=(H-c.shape[0])//2;x0=(W-c.shape[1])//2;im[y0:y0+c.shape[0],x0:x0+c.shape[1]]=c
    rng=np.random.default_rng(7);n=lambda s:(lambda a:a/a.std())(gaussian_filter(rng.standard_normal((H,W)),s))
    tooth,fibre,mottle=n(1.2),n((0.8,6)),n(40);ink=1-im.mean(2);take=np.clip(ink*2.2,0,1)*np.clip((1-ink)*2.5,0,1)
    g=1-0.014*tooth*(0.2+take)-0.004*fibre-0.004*mottle
    Image.fromarray((np.clip(im*g[...,None]*np.array([1.0,0.985,0.95]),0,1)*255).astype(np.uint8)).save(dst)

def pagecams(shots,W,H):
    """each shot's camera on the page: opened at W x H on its hash (a hand-set camera through __look), its position and target in the page's world (mm, y
    up), its vertical field and its canvas's aspect"""
    import asyncio,browser,model
    from playwright.async_api import async_playwright
    READ="""()=>{const i=JSON.parse(__camInfo());return {pos:i.pos,tgt:i.tgt,fov:i.fov,aspect:i.aspect}}"""   # in the page's world (mm, y up)
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
    a.add_argument('--size',default='1600x1150');a.add_argument('--out',default=str(HERE/'r_pen'));o=a.parse_args();PZ=POSE[model.NAME]
    if o.list:print(model.NAME+':',', '.join(PZ));sys.exit(0)
    W,H=(int(x) for x in o.size.split('x'));shots=[]
    def pose(h):
        q=dict(urllib.parse.parse_qsl(h));v=q.get('view','dial')
        if v not in PZ:sys.exit(f'{model.NAME} has no view {v!r} to draw (its views: {", ".join(PZ)}); a walkthrough step or an essay section is not one')
        c=dict(PZ[v]);box=c.pop('box',0)
        if 'explode' in c and 'pcs' in q:c['explode']=int(q['pcs'])/100
        if not box:c['lift']=1
        return dict(ctl=c,alone=not box)
    for i,L in enumerate(o.link):
        h=L.split('#',1)[1] if '#' in L else L;shots.append(dict(name='link'+(f'_{i+1}' if i else ''),hash=h,**pose(h)))
    if not o.link:
        for v in o.view.split(','):shots.append(dict(name=v,hash='view='+v,**pose('view='+v)))
    if o.cam:
        for S in shots:S['cam']=[float(x) for x in o.cam.split(',')]
    print('reading',len(shots),'cameras off the page',flush=True);pagecams(shots,W,H)
    out=pathlib.Path(o.out).resolve();out.mkdir(parents=True,exist_ok=True)
    if o.glb:glb=pathlib.Path(o.glb).resolve()
    else:
        glb=(out/model.cfg('GLTF',{}).get('glb','r_model21.glb')).resolve();print('exporting',glb.name,'(gltf_check.py)',flush=True)
        r=subprocess.run([sys.executable,str(HERE/'gltf_check.py')]+([] if model.HAMILTON else ['--model',model.NAME]),cwd=out)
        if r.returncode or not glb.exists():sys.exit('the export failed')
    js=out/'pen.json';js.write_text(json.dumps({'glb':str(glb),'rig':str(RIG),'out':str(out),'model':model.NAME,'shots':shots,'size':[W,H],'paper':PAPER,'lines':o.lines}),encoding='utf-8')
    print(f'rendering {len(shots)} stills in Blender',flush=True)
    r=subprocess.run([blender(),'-b','--factory-startup','--python',str(pathlib.Path(__file__).resolve()),'--',str(js)],capture_output=True,text=True,encoding='utf-8',errors='replace')
    for l in r.stdout.splitlines():
        if l.startswith(('MC ','Traceback','  File')) or 'Error' in l:print(' ',l)
    if r.returncode:print(r.stderr[-3000:]);sys.exit('Blender failed')
    for S in shots:
        f=out/f"pen_{model.NAME}_{S['name']}.png"
        if f.exists():paper(f,f);print('wrote',f)
        else:sys.exit(f"no still for {S['name']}")
    sys.exit(0)

# ---- inside Blender ----
import colorsys,math
from mathutils import Vector
A=json.load(open(sys.argv[sys.argv.index('--')+1],encoding='utf-8'))
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
for m in bpy.data.materials:restyle(m)

# the paper, seen by the camera and lighting little; a key light and a rim from behind on the other side
w=bpy.data.worlds.new('paper');sc.world=w;w.use_nodes=True;wn=w.node_tree;B=wn.nodes['Background'];B.inputs[0].default_value=(*PAPER,1)
B2=wn.nodes.new('ShaderNodeBackground');B2.inputs[1].default_value=0.22;LP=wn.nodes.new('ShaderNodeLightPath');MX=wn.nodes.new('ShaderNodeMixShader')
wn.links.new(LP.outputs['Is Camera Ray'],MX.inputs[0]);wn.links.new(B2.outputs[0],MX.inputs[1]);wn.links.new(B.outputs[0],MX.inputs[2]);wn.links.new(MX.outputs[0],wn.nodes['World Output'].inputs[0])
def sun(name,e,ang,rot,shadow=True):
    o=bpy.data.objects.new(name,bpy.data.lights.new(name,'SUN'));sc.collection.objects.link(o);o.data.energy=e;o.data.angle=math.radians(ang);o.data.use_shadow=shadow
    o.rotation_euler=tuple(math.radians(x) for x in rot)
sun('key',3.6,8,(38,-28,-40));sun('rim',1.6,4,(70,35,150),False)
sc.view_settings.view_transform='Standard'
for e in('BLENDER_EEVEE','BLENDER_EEVEE_NEXT'):
    try:sc.render.engine=e;break
    except TypeError:pass

# the pen: Freestyle line sets (a heavy contour, outlines, creases), each a calligraphic pen tapered at its ends, short strokes dropped. No border edges:
# every part is a closed solid, and the glTF import splits its meshes at their seams, so a border was a flat face's triangle fan drawn across it
sc.render.use_freestyle=True;sc.render.line_thickness_mode='ABSOLUTE';fs=sc.view_layers[0].freestyle_settings;fs.crease_angle=math.radians(140);fs.use_smoothness=True
def pen(name,colour,thick,lo,hi,stretch,edges,minlen):
    ls=fs.linesets.new(name);ls.select_by_visibility=True;ls.visibility='VISIBLE';ls.select_by_edge_types=True
    for k in('silhouette','border','crease','external_contour'):setattr(ls,'select_'+k,k in edges)
    st=bpy.data.linestyles.new(name);ls.linestyle=st;st.color=colour;st.thickness=thick;st.chaining='PLAIN';st.use_length_min=True;st.length_min=minlen
    if stretch:st.geometry_modifiers.new('stretch','BACKBONE_STRETCHER').backbone_length=stretch
    c=st.thickness_modifiers.new('pen','CALLIGRAPHY');c.orientation=35;c.thickness_min=lo;c.thickness_max=hi
    t=st.thickness_modifiers.new('taper','ALONG_STROKE');t.blend='MULTIPLY';t.mapping='CURVE';cv=t.curve;p=cv.curves[0].points
    p[0].location=(0,0.3);p[1].location=(1,0.3);p.new(0.15,1.0);p.new(0.85,1.0);cv.update()
pen('contour',INK,5.0,3.4,6.4,1.5,('external_contour',),3);pen('inner',(0.36,0.26,0.18),1.1,0.8,1.4,0,('crease',),6)
if A['lines']=='freestyle':pen('outline',INK,2.6,1.6,3.4,1.0,('silhouette',),3)
# or Line Art (the default): its hidden lines worked out exactly on the triangles. Freestyle's ray test broke a curved wall's silhouette into dashes
# (the rings in the Wempe's exploded view; the owner, 2 November 2026). One pass, the contours: Freestyle keeps the heavy outer outline and the creases,
# which never broke (Line Art's three passes, a heavy outline, the contours and the creases, took 35 minutes a still against Freestyle's 2)
# A stroke's radius is in the world's units, so each view sets it from its camera's distance (PX: a pixel's size there)
LA=[]
if A['lines']=='lineart':
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
from mathutils import Matrix
# the page's world (mm, y up) is Blender's (m, z up) as (x, -z, y) / 1000: the export's clips put every part where the page does (blender_check.py holds the
# rig to them), so the page's camera is the camera. The page pulls its camera back on a canvas narrower than 3:2 (aspectK); the still's own aspect is put back
B=lambda v:Vector((v[0],-v[2],v[1]))/1000;AK=lambda a:min(max(1.25/a,1),2.2)
cam.data.sensor_fit='VERTICAL'
for S in A['shots']:
    for o in bpy.data.objects:
        if o.type in('MESH','CURVE'):o.hide_render=S['alone'] and o not in inmv
    for k,v in S['ctl'].items():ctl[k]=float(v)
    ctl.update_tag();sc.frame_set(0);bpy.context.view_layer.update()
    P=S['page'];tgt=B(P['tgt']);pos=tgt+(B(P['pos'])-tgt)*AK(A['size'][0]/A['size'][1])/AK(P['aspect']);up=Vector((0,0,1))
    f=(tgt-pos).normalized();r=f.cross(up).normalized();u=r.cross(f)
    cam.matrix_world=Matrix.Translation(pos)@Matrix((r,u,-f)).transposed().to_4x4();cam.data.angle_y=math.radians(P['fov'])
    d=(tgt-pos).length;cam.data.clip_start=d/200;cam.data.clip_end=d*60
    PX=2*d*math.tan(math.radians(P['fov'])/2)/A['size'][1]   # a pixel's size at the target
    for m,k in LA:m.radius=k*PX
    sc.render.filepath=str(pathlib.Path(A['out'])/f"pen_{A['model']}_{S['name']}.png");bpy.ops.render.render(write_still=True);print('MC rendered',sc.render.filepath,flush=True)
    for k in S['ctl']:ctl[k]=0.0
