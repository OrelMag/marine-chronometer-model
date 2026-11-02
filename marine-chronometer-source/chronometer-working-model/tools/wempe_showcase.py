"""wempe_showcase.py: showcase stills of the Wempe in Blender's Cycles, composed for their own sake (not a photograph's view, as wempe_render.py's): the
chronometer in its box, the dial, the movement, the movement taken apart, the balance and detent, the fusee and chain, the train under the dial. A dark
studio sweep, the camera's depth of field at a real lens's stop (the export is in metres, true size). The model is the page's own export to Blender
(wempe/js/blender.js, ?qa's __glb) of the version as photographed (rev=3955), with its "Rig · explode" clip for the exploded shot; the hands set to 10:08:37.
Not run by build.py or ci.py.

    python wempe_showcase.py [--only box,dial] [--samples 256] [--size 2000x1333] [--out DIR] [--work DIR] [--reuse]
        (the export about 1-2 min, each still about 30-90 s on this machine's GPU; --reuse keeps the export in --work)

Writes showcase_NAME.webp into --out, default marine-chronometer-source/wempe/renders/."""
import argparse,asyncio,json,pathlib,subprocess,sys,tempfile,time
HERE=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(HERE));import browser
from hamilton_render import blender
WEMPE=HERE.parents[1]/'wempe';OUT=WEMPE/'renders'
STATE='rev=3955&wind=55.9'
HH,MM,SS=10,8,37;HANDS={'hh':(HH%12+MM/60+SS/3600)*30,'mh':(MM+SS/60)*6,'sh':SS*6}   # degrees past twelve, clockwise
# each shot in the movement's frame (mm; the dial +y, 12 o'clock -z, 3 o'clock +x): what shows ('all' or 'mv', the movement alone; hide: parts' keys),
# which way is up (+1 the dial side, -1 the top plate's), the camera's direction from its target, the parts it frames (their box), how much of the frame
# they fill, the lens (mm) and the stop (f), and whether the parts are apart
SHOTS=[
 dict(name='box',show='all',up=1,dir=(0.55,0.95,0.75),frame=None,fill=0.84,lens=60,f=11,trim=0),
 dict(name='dial',show='all',up=1,dir=(-0.30,1.0,0.55),frame=['dial'],fill=0.95,lens=105,f=5.6),
 dict(name='movement',show='mv',up=-1,dir=(0.62,-0.62,0.75),frame=None,fill=0.80,lens=90,f=11),
 dict(name='exploded',show='mv',up=-1,dir=(0.95,-0.32,0.55),frame=None,fill=0.86,lens=90,f=16,ex=1),
 dict(name='balance',show='mv',up=-1,dir=(-0.55,-0.75,0.55),frame=['balance','upperCock','detent'],fill=0.82,lens=105,f=4),
 dict(name='fusee',show='mv',up=-1,dir='out',rise=0.15,frame=['fusee','chain'],fill=0.85,lens=105,f=14),
 dict(name='train',show='mv',up=1,hide=['dial','hands'],dir=(0.45,1.0,0.35),frame=None,fill=0.82,lens=90,f=8)]

async def export(out):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto((WEMPE/'index.html').as_uri()+'?qa&start=movement#'+STATE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(2500)
        async with pg.expect_download(timeout=1800000) as d:await pg.evaluate("__glb(['Rig · explode'])")
        await (await d.value).save_as(out);await b.close()
    if errs:sys.exit('page errors: '+'; '.join(errs))
    print('exported',out.name,'%.1f MB'%(out.stat().st_size/1048576),flush=True)

SCENE=r'''
import bpy,json,math,sys
from mathutils import Vector,Matrix
A=json.load(open(sys.argv[sys.argv.index('--')+1]))
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.engine='CYCLES';c=s.cycles
pr=bpy.context.preferences.addons['cycles'].preferences;dev='NONE'
for d in ('OPTIX','CUDA','HIP','ONEAPI','METAL'):
    try:
        pr.compute_device_type=d;pr.refresh_devices()
        if any(x.type==d for x in pr.devices):dev=d;break
    except Exception:pass
if dev!='NONE':
    for x in pr.devices:x.use=(x.type==dev)
    c.device='GPU'
print('device',dev,flush=True)
c.samples=A['samples'];c.use_denoising=True;c.use_adaptive_sampling=True;c.max_bounces=12;c.glossy_bounces=8
s.render.resolution_x,s.render.resolution_y=A['size'];s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB'
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
# the world: the studio HDRI in reflections, a dark backdrop to the camera
w=bpy.data.worlds.new('w');s.world=w;w.use_nodes=True;nt=w.node_tree;N=nt.nodes;Lk=nt.links;bg=N['Background'];out=N['World Output']
env=N.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(A['hdri']);Lk.new(env.outputs['Color'],bg.inputs['Color']);bg.inputs['Strength'].default_value=0.9
dk=N.new('ShaderNodeBackground');dk.inputs['Color'].default_value=(0.010,0.011,0.013,1);mx=N.new('ShaderNodeMixShader');lp=N.new('ShaderNodeLightPath')
Lk.new(lp.outputs['Is Camera Ray'],mx.inputs['Fac']);Lk.new(bg.outputs['Background'],mx.inputs[1]);Lk.new(dk.outputs['Background'],mx.inputs[2]);Lk.new(mx.outputs['Shader'],out.inputs['Surface'])
bpy.ops.import_scene.gltf(filepath=A['glb'])
mv=[o for o in bpy.data.objects if o.name.startswith('Movement')][0];bpy.context.view_layer.update()
M=mv.matrix_world@Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)));Rw=M.to_3x3().normalized()   # the movement's own frame (glTF y up undone)
def under(o,r):
    while o:
        if o==r:return True
        o=o.parent
    return False
meshes=[o for o in bpy.data.objects if o.type=='MESH'];inmv={o for o in meshes if under(o,mv)}
def key(o):   # every part key along its ancestry ("... (dial)"), so a hand's mesh is under "hands"
    k=set()
    while o:
        n=o.name.split('.')[0]
        if n.endswith(')') and '(' in n:k.add(n[n.rindex('(')+1:-1])
        o=o.parent
    return k
K={o:key(o) for o in meshes}
hands={o.name.split('.')[0]:o for o in bpy.data.objects if under(o,mv) and o.name.split('.')[0] in A['hands']};HB={k:o.matrix_basis.copy() for k,o in hands.items()}
fl=bpy.data.materials.new('floor');fl.use_nodes=True;b=fl.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=(0.018,0.019,0.022,1);b.inputs['Roughness'].default_value=0.38
cd=bpy.data.cameras.new('cam');cam=bpy.data.objects.new('cam',cd);s.collection.objects.link(cam);s.camera=cam;cd.sensor_fit='HORIZONTAL';cd.sensor_width=36
asp=A['size'][0]/A['size'][1];made=[]
def light(name,loc,size,energy,at,shadow=True):
    d=bpy.data.lights.new(name,'AREA');d.size=size;d.energy=energy;d.use_shadow=shadow;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc
    o.rotation_euler=(at-loc).to_track_quat('-Z','Y').to_euler();made.append(o);return o
fps=s.render.fps
for S in A['shots']:
    for o in made:bpy.data.objects.remove(o,do_unlink=True)
    made=[]
    for k,o in hands.items():o.matrix_basis=HB[k]
    s.frame_set(int(round(2*fps)) if S.get('ex') else 0);bpy.context.view_layer.update()
    for k,o in hands.items():
        ax=Rw@Vector((0,-1,0));p=o.matrix_world.translation.copy();o.matrix_world=Matrix.Translation(p)@Matrix.Rotation(math.radians(A['hands'][k]),4,ax)@Matrix.Translation(-p)@o.matrix_world
    bpy.context.view_layer.update()
    vis=[o for o in meshes if o.matrix_world.to_scale().length>1e-9 and (S['show']=='all' or o in inmv) and not K[o]&set(S.get('hide',[]))]
    for o in meshes:o.hide_render=o not in vis
    def pts(L):return [o.matrix_world@v.co for o in L for v in list(o.data.vertices)[::5]]
    up=(Rw@Vector((0,S['up'],0))).normalized();P=pts(vis);FP=pts([o for o in vis if K[o]&set(S['frame'])]) if S['frame'] else P
    tr=S.get('trim',1);q=lambda L,f:sorted(L)[min(len(L)-1,max(0,int((0.5+(f-0.5)*(1 if tr else 1.0101))*len(L))))] if tr else (min(L) if f<0.5 else max(L))   # quantiles: a stray vertex (a piece parked away, scaled to nothing) doesn't decide the frame
    lo=q([p.dot(up) for p in P],0.001);ctr=Vector([(q([p[i] for p in FP],0.005)+q([p[i] for p in FP],0.995))/2 for i in range(3)]);ext=q([(p-ctr).length for p in FP],0.99)
    if S['dir']=='out':   # from the movement's axis out through the framed parts, a little above
        ax=M@Vector((0,0,0));h=ctr-ax;h=(h-h.dot(up)*up).normalized();d=(h+up*S.get('rise',0.3)).normalized()
    else:d=(Rw@Vector(S['dir'])).normalized();cd.lens=S['lens'];th=cd.sensor_width/2/cd.lens;dist=ext*8
    # the camera's up the movement's up (the floor's normal), aimed at the framed parts' middle, moved back until they fill the frame
    def place(dist):
        cam.location=ctr+d*dist;f=(-d);r=f.cross(up).normalized();u=r.cross(f)
        cam.matrix_world=Matrix.Translation(cam.location)@Matrix((r,u,-f)).transposed().to_4x4();bpy.context.view_layer.update()
    for _ in range(5):
        place(dist);W=cam.matrix_world.inverted();Q=[W@p for p in FP];uu=[q.x/-q.z for q in Q];vv=[q.y/-q.z for q in Q]
        k=max(max(abs(q(uu,0.005)),abs(q(uu,0.995)))/(S['fill']*th),max(abs(q(vv,0.005)),abs(q(vv,0.995)))/(S['fill']*th/asp));dist*=k
    place(dist);cd.clip_start=dist/100;cd.clip_end=dist*50
    cd.dof.use_dof=True;cd.dof.focus_distance=dist;cd.dof.aperture_fstop=S['f'];cd.dof.aperture_blades=7
    bpy.ops.mesh.primitive_plane_add(size=dist*60,location=up*lo);pl=bpy.context.active_object;pl.rotation_euler=up.to_track_quat('Z','Y').to_euler();pl.data.materials.append(fl);made.append(pl)
    R=q([(p-ctr).length for p in P],0.99);side=d.cross(up).normalized();bk=(d-d.dot(up)*up).normalized()
    light('key',ctr+(side*-0.8+bk*0.5+up*1.1).normalized()*R*7,R*4,90*R*R,ctr)
    light('fill',ctr+(side*1.0+bk*0.7+up*0.4).normalized()*R*7,R*5,22*R*R,ctr)
    light('rim',ctr+(side*0.3-bk*1.0+up*0.7).normalized()*R*6,R*3,110*R*R,ctr)
    mir=-(d-2*d.dot(up)*up);light('softbox',ctr+mir*dist*0.6,dist*0.45,1.6*(dist*0.6)**2,ctr,False)   # the camera's mirror image in the plates: their faces read as metal
    s.render.filepath=S['png'];t0=__import__('time').time();bpy.ops.render.render(write_still=True);print('rendered',S['name'],round(__import__('time').time()-t0,1),'s',flush=True)
'''

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--samples',type=int,default=256);a.add_argument('--size',default='2000x1333')
    a.add_argument('--out',default=str(OUT));a.add_argument('--work');a.add_argument('--reuse',action='store_true');o=a.parse_args()
    out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True);t0=time.time()
    work=pathlib.Path(o.work) if o.work else pathlib.Path(tempfile.mkdtemp(prefix='wshow_'));work.mkdir(parents=True,exist_ok=True)
    shots=[dict(S,png=str(work/f"showcase_{S['name']}.png")) for S in SHOTS if not o.only or S['name'] in o.only.split(',')]
    glb=work/'wempe3955_ex.glb'
    if not(o.reuse and glb.exists()):asyncio.run(export(glb))
    hdri=str(next(pathlib.Path(blender()).parent.glob('*/datafiles/studiolights/world/studio.exr')))
    js=work/'show.json';js.write_text(json.dumps({'shots':shots,'glb':str(glb),'samples':o.samples,'size':[int(x) for x in o.size.split('x')],'hdri':hdri,'hands':HANDS}),encoding='utf-8')
    sp=work/'show.py';sp.write_text(SCENE,encoding='utf-8');print(f'rendering {len(shots)} stills in Blender',flush=True)
    r=subprocess.run([blender(),'-b','--factory-startup','-P',str(sp),'--',str(js)],capture_output=True,text=True,encoding='utf-8',errors='replace')
    for l in r.stdout.splitlines():
        if l.startswith(('rendered','device')) or 'Error' in l:print(' ',l)
    if r.returncode:print(r.stderr[-3000:]);sys.exit('Blender failed')
    from PIL import Image
    for S in shots:Image.open(S['png']).convert('RGB').save(out/f"showcase_{S['name']}.webp",'WEBP',quality=90,method=6)
    print(f'wrote {len(shots)} stills into {out} in {time.time()-t0:.0f} s')
if __name__=='__main__':main()
