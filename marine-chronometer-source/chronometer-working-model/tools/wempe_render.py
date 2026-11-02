"""wempe_render.py: still renders of the Wempe's movement in Blender's Cycles, in the seven views of Wempe 3955's photographs (References/wempe/photos/
dg-chrono-dec/1-7_Wempe_3955_*.jpg: Z the dial, A the plan, uZ under the dial, N, O, S, W the obliques), as hamilton_render.py renders the Hamilton's drawn
parts. Each view's camera is the one photocompare.py fits to its photograph (tools/photocompare/w3955_V.json); the model is the page's own export to Blender
(wempe/js/blender.js, ?qa's __glb, without clips) of the version as photographed (rev=3955), the hands at the Z photograph's time; its case, ring and box left
out (the photographs show the movement out of its bowl) and, for uZ, the dial and hands (as its spec hides them). Not run by build.py or ci.py.

    python wempe_render.py [--only Z,A] [--samples 128] [--width 1600] [--out DIR] [--work DIR] [--reuse]
        (the fits about 10-60 s a view on the GPU, the export about 1-2 min, the renders about 10-60 s each as loaded as the GPU is; --reuse keeps the fits and
         the export in --work from a run before; Blender 5.x: MC_BLENDER, else the usual path)

Writes w3955_V.webp (transparent background with a shadow catcher) into --out, default marine-chronometer-source/wempe/renders/. No photograph goes into them."""
import argparse,asyncio,json,os,pathlib,subprocess,sys,tempfile,time
import numpy as np,cv2
HERE=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(HERE));import browser
from hamilton_render import blender
WEMPE=HERE.parents[1]/'wempe';OUT=WEMPE/'renders'
VIEWS=['Z','A','uZ','N','O','S','W']
STATE='rev=3955&t=3:41:19&wind=55.9'   # the Z photograph's time (w3955_Z.json), the obliques' wind
HH,MM,SS=3,41,19;HANDS={'hh':(HH%12+MM/60+SS/3600)*30,'mh':(MM+SS/60)*6,'sh':SS*6}   # degrees past twelve, clockwise

async def export(out):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto((WEMPE/'index.html').as_uri()+'?qa&start=movement#'+STATE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(2500)
        async with pg.expect_download(timeout=1800000) as d:st=await pg.evaluate("__glb([])")
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
c.samples=A['samples'];c.use_denoising=True;c.use_adaptive_sampling=True;c.max_bounces=12;c.glossy_bounces=6
s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA'
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
w=bpy.data.worlds.new('w');s.world=w;w.use_nodes=True;nt=w.node_tree;bg=nt.nodes['Background']
env=nt.nodes.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(A['hdri']);nt.links.new(env.outputs['Color'],bg.inputs['Color']);bg.inputs['Strength'].default_value=1.1
bpy.ops.import_scene.gltf(filepath=A['glb'])
mv=[o for o in bpy.data.objects if o.name.startswith('Movement')][0];bpy.context.view_layer.update()
def under(o,r):
    while o:
        if o==r:return True
        o=o.parent
    return False
inmv=[o for o in bpy.data.objects if under(o,mv)]
for o in bpy.data.objects:
    if o.type=='MESH' and o not in inmv:o.hide_render=True   # the box, ring and bowl: the photographs show the movement out of its case
M=mv.matrix_world@Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)));Mi=M.inverted();Rw=M.to_3x3().normalized()   # the importer turns glTF's y up to Blender's z up: the movement's own frame (the page's) is the node's with that undone
for o in inmv:   # the hands at the photographed time: the export leaves them at its rest, twelve; turned clockwise seen from the dial (about the movement's -y) through their arbors
    k=o.name.split('.')[0]
    if k in A['hands']:
        ax=Rw@Vector((0,-1,0));p=o.matrix_world.translation.copy();o.matrix_world=Matrix.Translation(p)@Matrix.Rotation(math.radians(A['hands'][k]),4,ax)@Matrix.Translation(-p)@o.matrix_world
bpy.context.view_layer.update()
P=[Mi@(o.matrix_world@v.co) for o in inmv if o.type=='MESH' and o.visible_get() for v in list(o.data.vertices)[::7]]
ymin=min(p.y for p in P);ymax=max(p.y for p in P);rad=max(math.hypot(p.x,p.z) for p in P)
sc=M.to_scale()[0];L=rad*sc   # the movement's radius in the scene's units
def light(name,loc,size,energy,shadow=True):
    d=bpy.data.lights.new(name,'AREA');d.size=size;d.energy=energy;d.use_shadow=shadow;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;return o
def aim(o,at):o.rotation_euler=(at-o.location).to_track_quat('-Z','Y').to_euler()
cd=bpy.data.cameras.new('cam');cam=bpy.data.objects.new('cam',cd);s.collection.objects.link(cam);s.camera=cam;cd.sensor_fit='HORIZONTAL';cd.sensor_width=36
made=[]
for V in A['views']:
    for o in made:bpy.data.objects.remove(o,do_unlink=True)
    made=[]
    for o in inmv:
        if o.type=='MESH':o.hide_render=any(('('+h+')') in a.name for h in V['hide'] for a in [o]+[p for p in [o.parent,o.parent.parent if o.parent else None] if p])
    R=Matrix(V['R']);t=Vector(V['t']);C=-(R.transposed()@t)   # OpenCV: x_cam = R x_mv + t
    X,Y,Z=R[0],-R[1],-R[2];Rc=Matrix((X,Y,Z)).transposed()
    cam.matrix_world=Matrix.Translation(M@C)@(Rw@Rc).to_4x4();W=A['width'];H=round(V['H']*W/V['W'])
    s.render.resolution_x,s.render.resolution_y=W,H;cd.lens=V['f']*36/V['W'];dist=(M@C-M@Vector((0,(ymin+ymax)/2,0))).length;cd.clip_start=dist/200;cd.clip_end=dist*20
    up=Rw@Vector((0,1 if C.y>0 else -1,0))   # the side the camera is on: the floor beyond the other
    base=M@Vector((0,ymin if C.y>0 else ymax,0))
    bpy.ops.mesh.primitive_plane_add(size=L*40,location=base);pl=bpy.context.active_object;pl.rotation_euler=up.to_track_quat('Z','Y').to_euler();pl.is_shadow_catcher=True;made.append(pl)
    ctr=M@Vector((0,(ymin+ymax)/2,0));cw=M@C;dv=(cw-ctr).normalized()
    mir=(dv-2*dv.dot(up)*up)*-1   # the camera's mirror image in the plates: a soft box there, so their faces read as metal, not as black
    sb=light('softbox',ctr+mir*dist*0.6,dist*0.5,2.2*(dist*0.6)**2,False);aim(sb,ctr);made.append(sb)
    side=up.cross(dv).normalized()
    for nm,(a,b,h),sz,e in (('key',(-0.6,-0.9,1.3),3,60),('fill',(1.0,-0.2,0.6),4,18),('rim',(0.4,1.0,0.8),3,30)):
        q=ctr+(side*a+dv*-b+up*h).normalized()*L*6;o=light(nm,q,sz*L,e*L*L);aim(o,ctr);made.append(o)
    s.render.filepath=V['png'];t0=__import__('time').time();bpy.ops.render.render(write_still=True);print('rendered',V['name'],round(__import__('time').time()-t0,1),'s',flush=True)
'''

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--samples',type=int,default=128);a.add_argument('--width',type=int,default=1600)
    a.add_argument('--out',default=str(OUT));a.add_argument('--work');a.add_argument('--reuse',action='store_true');o=a.parse_args()
    views=[v for v in VIEWS if not o.only or v in o.only.split(',')];out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True)
    work=pathlib.Path(o.work) if o.work else pathlib.Path(tempfile.mkdtemp(prefix='wrender_'));work.mkdir(parents=True,exist_ok=True);t0=time.time()
    V=[]
    for v in views:   # each photograph's camera, fitted by photocompare.py on its spec's picks
        r=work/f'r_pc_w3955_{v}.json'
        if not(o.reuse and r.exists()):
            p=subprocess.run([sys.executable,str(HERE/'photocompare.py'),str(HERE/'photocompare'/f'w3955_{v}.json'),'--model','wempe'],cwd=work,capture_output=True,text=True,encoding='utf-8',errors='replace',env={**os.environ,'MC_GL':os.environ.get('MC_GL','gpu')})
            if p.returncode or not r.exists():print(p.stdout[-2000:],p.stderr[-2000:]);sys.exit(f'photocompare.py failed on w3955_{v}')
            print(f'{v}: '+next((l for l in p.stdout.splitlines() if ' f ' in l and 'camera at' in l),'fitted'),flush=True)
        F=json.loads(r.read_text(encoding='utf-8'));q=np.asarray(F['q'],float);S=json.loads((HERE/'photocompare'/f'w3955_{v}.json').read_text(encoding='utf-8'))
        V.append({'name':v,'R':cv2.Rodrigues(q[:3])[0].tolist(),'t':q[3:6].tolist(),'f':F['f'],'W':F['W'],'H':F['H'],'hide':S.get('hide',[]),'png':str(work/f'w3955_{v}.png')})
    glb=work/'wempe3955.glb'
    if not(o.reuse and glb.exists()):asyncio.run(export(glb))
    hdri=str(next(pathlib.Path(blender()).parent.glob('*/datafiles/studiolights/world/studio.exr')))
    js=work/'scene.json';js.write_text(json.dumps({'views':V,'glb':str(glb),'samples':o.samples,'hands':HANDS,'width':o.width,'hdri':hdri}),encoding='utf-8')
    sp=work/'scene.py';sp.write_text(SCENE,encoding='utf-8');print(f'rendering {len(V)} views in Blender',flush=True)
    r=subprocess.run([blender(),'-b','--factory-startup','-P',str(sp),'--',str(js)],capture_output=True,text=True,encoding='utf-8',errors='replace')
    for l in r.stdout.splitlines():
        if l.startswith(('rendered','device')) or 'Error' in l:print(' ',l)
    if r.returncode:print(r.stderr[-3000:]);sys.exit('Blender failed')
    from PIL import Image
    for v in V:Image.open(v['png']).save(out/f"w3955_{v['name']}.webp",'WEBP',quality=88,method=6)
    print(f'wrote {len(V)} images into {out} in {time.time()-t0:.0f} s')
if __name__=='__main__':main()
