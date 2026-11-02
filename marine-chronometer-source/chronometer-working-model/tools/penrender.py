"""penrender.py: stills of a model drawn as an ink-and-watercolour illustration, in Blender: EEVEE with Freestyle's pen lines (a heavy contour round each
part's outline, thinner lines at its silhouettes, fine ones at its creases) over each material painted as a wash (its own colour in the light, shading into a warm
or a cool shade of itself, darker where a surface turns away, a white glint on metal), under a key and a rim light, on cream paper (a faint tooth laid over
afterwards, the drawing centred on the sheet). The model is the page's own export to Blender (gltf_check.py's), posed by the rig (blender/rig.py): the
movement out of its case, the chronometer in its box, the movement taken apart. An illustration for its own sake: every line is the model's, nothing is
simplified or left out as an illustrator would. Not run by build.py or ci.py.

    python penrender.py [--model wempe] [--glb FILE] [--only box,movement,exploded] [--size 1600x1150] [--out DIR]
        (without --glb, gltf_check.py exports and checks the model first, about 2.5 min, 3.5 for the Wempe; then about 3 min a still)

Writes pen_MODEL_VIEW.png into --out, default tools/r_pen/ (ignored)."""
import json,os,pathlib,subprocess,sys
try:
    import bpy
except ImportError:
    bpy=None
HERE=pathlib.Path(__file__).resolve().parent;RIG=HERE.parent/'blender'/'rig.py'
# each view: the rig's controls set to 1 (lift: out of its case and turned over), the camera's direction from the movement (Blender's axes, z up), and
# whether it shows the movement alone, fitted to the frame, or the whole at a set distance (m)
VIEWS={'movement':dict(ctl=['lift'],dir=(0.55,-0.75,0.55),alone=True),
       'box':dict(ctl=[],dir=(0.45,-0.8,0.75),alone=False,dist=0.36),
       'exploded':dict(ctl=['lift','explode'],dir=(0.55,-0.75,0.55),alone=True)}
PAPER=(0.965,0.945,0.9)

def paper(src,dst):
    """the render laid on drawing paper: a drawing that stands clear of the sheet's edges centred at 88 % of it, then a faint tooth and fibre that the
    colour takes up most in its mid washes"""
    import numpy as np
    from PIL import Image
    from scipy.ndimage import gaussian_filter
    im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)/255;H,W,_=im.shape;bg=im[2,2].copy();ys,xs=np.nonzero(np.abs(im-bg).max(2)>0.04)
    if len(xs) and not(xs.min()<3 or ys.min()<3 or xs.max()>W-4 or ys.max()>H-4):
        c=im[ys.min():ys.max()+1,xs.min():xs.max()+1];k=min(0.88*W/c.shape[1],0.88*H/c.shape[0])
        c=np.asarray(Image.fromarray((c*255).astype(np.uint8)).resize((int(c.shape[1]*k),int(c.shape[0]*k)),Image.LANCZOS)).astype(np.float32)/255
        im=np.ones_like(im)*bg;y0=(H-c.shape[0])//2;x0=(W-c.shape[1])//2;im[y0:y0+c.shape[0],x0:x0+c.shape[1]]=c
    rng=np.random.default_rng(7);n=lambda s:(lambda a:a/a.std())(gaussian_filter(rng.standard_normal((H,W)),s))
    tooth,fibre,mottle=n(1.2),n((0.8,6)),n(40);ink=1-im.mean(2);take=np.clip(ink*2.2,0,1)*np.clip((1-ink)*2.5,0,1)
    g=1-0.014*tooth*(0.2+take)-0.004*fibre-0.004*mottle
    Image.fromarray((np.clip(im*g[...,None]*np.array([1.0,0.985,0.95]),0,1)*255).astype(np.uint8)).save(dst)

if bpy is None:   # outside Blender: export if asked, run this file in Blender, lay each still on paper
    import argparse,model
    from hamilton_render import blender
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--glb');a.add_argument('--only');a.add_argument('--size',default='1600x1150');a.add_argument('--out',default=str(HERE/'r_pen'));o=a.parse_args()
    out=pathlib.Path(o.out).resolve();out.mkdir(parents=True,exist_ok=True)
    if o.glb:glb=pathlib.Path(o.glb).resolve()
    else:
        glb=(out/model.cfg('GLTF',{}).get('glb','r_model21.glb')).resolve();print('exporting',glb.name,'(gltf_check.py)',flush=True)
        r=subprocess.run([sys.executable,str(HERE/'gltf_check.py')]+([] if model.HAMILTON else ['--model',model.NAME]),cwd=out)
        if r.returncode or not glb.exists():sys.exit('the export failed')
    views=[v for v in VIEWS if not o.only or v in o.only.split(',')];W,H=(int(x) for x in o.size.split('x'))
    js=out/'pen.json';js.write_text(json.dumps({'glb':str(glb),'rig':str(RIG),'out':str(out),'model':model.NAME,'views':{v:VIEWS[v] for v in views},'size':[W,H],'paper':PAPER}),encoding='utf-8')
    print(f'rendering {len(views)} stills in Blender',flush=True)
    r=subprocess.run([blender(),'-b','--factory-startup','--python',str(pathlib.Path(__file__).resolve()),'--',str(js)],capture_output=True,text=True,encoding='utf-8',errors='replace')
    for l in r.stdout.splitlines():
        if l.startswith(('MC ','Traceback','  File')) or 'Error' in l:print(' ',l)
    if r.returncode:print(r.stderr[-3000:]);sys.exit('Blender failed')
    for v in views:
        f=out/f'pen_{model.NAME}_{v}.png'
        if f.exists():paper(f,f);print('wrote',f)
        else:sys.exit(f'no still for {v}')
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
sc.render.use_freestyle=True;sc.render.line_thickness_mode='ABSOLUTE';fs=sc.view_layers[0].freestyle_settings;fs.crease_angle=math.radians(118)
def pen(name,colour,thick,lo,hi,stretch,edges,minlen):
    ls=fs.linesets.new(name);ls.select_by_visibility=True;ls.visibility='VISIBLE';ls.select_by_edge_types=True
    for k in('silhouette','border','crease','external_contour'):setattr(ls,'select_'+k,k in edges)
    st=bpy.data.linestyles.new(name);ls.linestyle=st;st.color=colour;st.thickness=thick;st.chaining='PLAIN';st.use_length_min=True;st.length_min=minlen
    if stretch:st.geometry_modifiers.new('stretch','BACKBONE_STRETCHER').backbone_length=stretch
    c=st.thickness_modifiers.new('pen','CALLIGRAPHY');c.orientation=35;c.thickness_min=lo;c.thickness_max=hi
    t=st.thickness_modifiers.new('taper','ALONG_STROKE');t.blend='MULTIPLY';t.mapping='CURVE';cv=t.curve;p=cv.curves[0].points
    p[0].location=(0,0.3);p[1].location=(1,0.3);p.new(0.15,1.0);p.new(0.85,1.0);cv.update()
pen('contour',INK,5.0,3.4,6.4,1.5,('external_contour',),3);pen('outline',INK,2.6,1.6,3.4,1.0,('silhouette',),3);pen('inner',(0.36,0.26,0.18),1.1,0.8,1.4,0,('crease',),30)

cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam'));sc.collection.objects.link(cam);sc.camera=cam;cam.data.lens=50;cam.data.clip_start=0.001
sc.render.resolution_x,sc.render.resolution_y=A['size']
mv=next(o for o in bpy.data.objects if o.get('role')=='movement')
def under(o,a):
    while o:
        if o is a:return True
        o=o.parent
    return False
inmv={o for o in bpy.data.objects if under(o,mv)}
for name,V in A['views'].items():
    for o in bpy.data.objects:
        if o.type in('MESH','CURVE'):o.hide_render=V['alone'] and o not in inmv
    for k in V['ctl']:ctl[k]=1.0
    ctl.update_tag();sc.frame_set(0);bpy.context.view_layer.update()
    cc=mv.matrix_world.translation.copy();d=Vector(V['dir']);cam.location=cc+d*V.get('dist',0.2);cam.rotation_euler=(cc-cam.location).to_track_quat('-Z','Y').to_euler()
    if V['alone']:   # fitted to what is shown, a little back
        bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
        vs=[o.matrix_world@Vector(b) for o in inmv if o.type=='MESH' and o.visible_get() for b in o.bound_box]
        loc,_=cam.camera_fit_coords(dg,[x for v in vs for x in v]);cam.location=loc+d.normalized()*0.012
    sc.render.filepath=str(pathlib.Path(A['out'])/f"pen_{A['model']}_{name}.png");bpy.ops.render.render(write_still=True);print('MC rendered',sc.render.filepath,flush=True)
    for k in V['ctl']:ctl[k]=0.0
