"""hamilton_render.py: still renders of the Hamilton's drawn parts (recipes/hamilton.py) and of their subassemblies from drawn parts only, in Blender's
Cycles, for the parts page (marine-chronometer-source/hamilton-parts/renders/, the cards and the gallery). Not run by build.py or ci.py: Cycles' output
isn't byte for byte the same from run to run.

    python hamilton_render.py [--only a,b] [--samples 96] [--size 1200x900] [--out DIR] [--keep DIR]
        (about 15-40 s an image on this machine's GPU after a minute building and tessellating the solids; Blender 5.x: MC_BLENDER, else the usual path)

The parts: every recipe with a sheet of its own (hamilton_visual.py's SHEET: the detent finished is the page's reconstruction). The assemblies: those
whose members are all drawn parts (recipes/hamilton.py's ASSEMBLIES but the detent's, whose other parts are the 3D model's placeholders), each assembled
and exploded by its members' own `ex`. The solids are the page's own (r.build(), each member's loc()), tessellated as hamilton_parts.py does. Each surface
by its recipe's material and finish only (24K gold plate, nickel plate, oxidized black, beryllium copper, brass, steel; polished where the sheet says
polish): nothing the sheets don't give. A turned part standing taller than it is wide is laid on its side. Transparent background with a shadow catcher,
WebP with alpha: KEY.webp, and KEY-exploded.webp for an assembly; js/hrenders.js (HRENDERS) lists them with their captions for the page."""
import argparse,json,math,os,pathlib,subprocess,sys,tempfile,time
import numpy as np
from recipes import hamilton as H
from hamilton_parts import tess
from hamilton_visual import SHEET
HERE=pathlib.Path(__file__).resolve().parent
OUT=HERE.parents[1]/'hamilton-parts'/'renders'

def finish(r):
    """the surface a recipe's material and treatment give: gold, nickel, black, becu, brass, steel or polished steel"""
    m=(r.material or '').lower();t=(r.treatment or '').lower()
    if 'gold plate' in t:return 'gold'
    if 'nickel plate' in t:return 'nickel'
    if 'oxidize black' in t:return 'black'
    if 'beryllium copper' in m:return 'becu'
    if 'brass' in m:return 'brass'
    return 'polished' if 'polish' in t else 'steel'
def stl(path,v,t):
    """a binary STL of the tessellation (mm)"""
    P=np.array([[q.X,q.Y,q.Z] for q in v],np.float32);T=np.array(t,np.int64);A=P[T]
    N=np.cross(A[:,1]-A[:,0],A[:,2]-A[:,0]);N/=np.maximum(np.linalg.norm(N,axis=1,keepdims=True),1e-12)
    rec=np.zeros(len(T),np.dtype([('n','<f4',3),('v','<f4',(3,3)),('a','<u2')]));rec['n']=N;rec['v']=A
    with open(path,'wb') as f:f.write(b'\0'*80);f.write(np.uint32(len(T)).tobytes());f.write(rec.tobytes())
def mat4(L):
    t=L.wrapped.Transformation();return [[t.Value(i,j) for j in range(1,5)] for i in range(1,4)]+[[0,0,0,1]]
def blender():
    exe=os.environ.get('MC_BLENDER')
    if not exe:
        for p in sorted(pathlib.Path(r'C:\Program Files\Blender Foundation').glob('Blender */blender.exe'),reverse=True):exe=str(p);break
    if not exe or not pathlib.Path(exe).exists():sys.exit('Blender not found (set MC_BLENDER)')
    return exe

SCENE=r'''
import bpy,json,math,sys,mathutils,glob,os
from mathutils import Vector,Matrix
A=json.load(open(sys.argv[sys.argv.index('--')+1]))
MATS={'gold':((1.0,0.70,0.27),0.20),'brass':((0.90,0.70,0.38),0.30),'nickel':((0.78,0.76,0.72),0.18),'black':((0.035,0.035,0.04),0.32),
      'becu':((0.93,0.62,0.45),0.28),'steel':((0.68,0.69,0.71),0.30),'polished':((0.78,0.79,0.81),0.10)}
def scene_setup():
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
    c.samples=A['samples'];c.use_denoising=True;c.use_adaptive_sampling=True
    s.render.resolution_x,s.render.resolution_y=A['size'];s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA'
    s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
    w=bpy.data.worlds.new('w');s.world=w;w.use_nodes=True;nt=w.node_tree;bg=nt.nodes['Background']
    env=nt.nodes.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(A['hdri']);nt.links.new(env.outputs['Color'],bg.inputs['Color']);bg.inputs['Strength'].default_value=1.1
    M={}
    for k,(col,ro) in MATS.items():
        m=bpy.data.materials.new(k);m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value=(*col,1);b.inputs['Metallic'].default_value=1.0;b.inputs['Roughness'].default_value=ro;M[k]=m
    return s,M
def light(s,name,loc,size,energy):
    d=bpy.data.lights.new(name,'AREA');d.size=size;d.energy=energy;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc
    o.rotation_euler=(Vector((0,0,0))-Vector(loc)).to_track_quat('-Z','Y').to_euler();return o
def render(item,exploded,out):
    s,M=scene_setup();root=bpy.data.objects.new('root',None);s.collection.objects.link(root);objs=[]
    for m in item['members']:
        bpy.ops.wm.stl_import(filepath=m['stl']);o=bpy.context.selected_objects[0];o.data.materials.append(M[m['finish']])
        T=Matrix(m['m']);
        if exploded:T=Matrix.Translation(Vector(m['ex']))@T
        o.matrix_world=T;o.parent=root;objs.append(o)
        bpy.context.view_layer.objects.active=o;bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    bpy.context.view_layer.update()
    P=[o.matrix_world@v.co for o in objs for v in o.data.vertices];lo=Vector([min(p[i] for p in P) for i in range(3)]);hi=Vector([max(p[i] for p in P) for i in range(3)]);ext=hi-lo
    if ext.z>1.3*max(ext.x,ext.y):root.rotation_euler=(0,math.radians(90),0)   # a turned part standing tall: laid along x
    bpy.context.view_layer.update()
    P=[o.matrix_world@v.co for o in objs for v in o.data.vertices];lo=Vector([min(p[i] for p in P) for i in range(3)]);hi=Vector([max(p[i] for p in P) for i in range(3)])
    c=(lo+hi)/2;R=(hi-lo).length/2;root.location=-Vector((c.x,c.y,lo.z));bpy.context.view_layer.update()
    P=[o.matrix_world@v.co for o in objs for v in o.data.vertices];c=Vector((0,0,(hi.z-lo.z)/2))
    flat=(hi.z-lo.z)<0.35*max(hi.x-lo.x,hi.y-lo.y)
    el=math.radians(52 if flat else 30);az=math.radians(-58)
    d=Vector((math.cos(el)*math.cos(az),math.cos(el)*math.sin(az),math.sin(el)))
    cd=bpy.data.cameras.new('cam');cd.lens=100;cd.sensor_width=36;cam=bpy.data.objects.new('cam',cd);s.collection.objects.link(cam);s.camera=cam
    asp=A['size'][0]/A['size'][1];th=cd.sensor_width/2/cd.lens;dist=R*20
    for _ in range(4):   # frame: the points' spread seen from the camera fills 84 % of the frame's width or height, its middle centred by the lens's shift
        cam.location=c+d*dist;cam.rotation_euler=(-d).to_track_quat('-Z','Y').to_euler();bpy.context.view_layer.update()
        W=cam.matrix_world.inverted();Q=[W@p for p in P];u=[q.x/-q.z for q in Q];v=[q.y/-q.z for q in Q]
        k=max((max(u)-min(u))/2/(0.84*th),(max(v)-min(v))/2/(0.84*th/asp));dist*=k
    cam.location=c+d*dist;bpy.context.view_layer.update();W=cam.matrix_world.inverted();Q=[W@p for p in P];u=[q.x/-q.z for q in Q];v=[q.y/-q.z for q in Q]
    cd.shift_x=(max(u)+min(u))/2/(2*th);cd.shift_y=(max(v)+min(v))/2/(2*th);cd.clip_start=dist/100;cd.clip_end=dist*10
    L=max(R,1)
    sb=light(s,'softbox',c+Vector((-d.x,-d.y,d.z))*dist*0.25,dist*0.3,0);sb.data.energy=2.2*(dist*0.25)**2;sb.data.shape='DISK';sb.data.use_shadow=False   # where the camera sees a flat face's mirror image: the faces lit, not black
    light(s,'key',(c.x-3*L,c.y-4*L,c.z+6*L),3*L,60*L*L);light(s,'fill',(c.x+5*L,c.y-1*L,c.z+3*L),4*L,18*L*L);light(s,'rim',(c.x+2*L,c.y+5*L,c.z+4*L),3*L,30*L*L)
    bpy.ops.mesh.primitive_plane_add(size=R*60,location=(0,0,0));pl=bpy.context.active_object;pl.is_shadow_catcher=True
    s.render.filepath=out;t=__import__('time').time();bpy.ops.render.render(write_still=True);print('rendered',out,round(__import__('time').time()-t,1),'s',flush=True)
for it in A['items']:
    render(it,False,it['png'])
    if it.get('png_ex'):render(it,True,it['png_ex'])
'''

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--samples',type=int,default=96);a.add_argument('--size',default='1200x900');a.add_argument('--out',default=str(OUT))
    a.add_argument('--keep',help='keep the meshes and PNGs in this folder');o=a.parse_args()
    only=set(o.only.split(',')) if o.only else None;out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True)
    tmp=pathlib.Path(o.keep) if o.keep else pathlib.Path(tempfile.mkdtemp(prefix='hrender_'));tmp.mkdir(parents=True,exist_ok=True)
    rec={};items=[];listing=[];t0=time.time()
    for grp,mk in H.RECIPES:
        r=mk()
        if r.key.startswith('det_') or r.key=='lockingStone':continue
        rec[r.key]=(grp,r)
    need=set()
    asms=[A for A in (mk() for mk in H.ASSEMBLIES) if not getattr(A,'placeholder',False)]
    for A in asms:
        if only is None or A.key in only:need|={m.key for m in A.members}
    for k,(grp,r) in rec.items():
        if k in SHEET and (only is None or k in only):need.add(k)
    for k in sorted(need):
        p=rec[k][1].build();v,t=tess(p);stl(tmp/f'{k}.stl',v,t)
    print(f'{len(need)} solids tessellated in {time.time()-t0:.0f} s',flush=True)
    def caption(r):return {'key':r.key,'title':r.title,'hn':r.hn,'drawing':r.drawing,'material':r.material,'treatment':r.treatment,'finish':finish(r)}
    for k,(grp,r) in rec.items():
        if k not in SHEET or (only and k not in only):continue
        items.append({'key':k,'png':str(tmp/f'{k}.png'),'members':[{'stl':str(tmp/f'{k}.stl'),'m':mat4(__import__('build123d').Location((0,0,0))),'ex':[0,0,0],'finish':finish(r)}]})
        listing.append({**caption(r),'group':grp,'assembly':False,'image':f'renders/{k}.webp','reconstructed':k=='detentFinished'})
    for A in asms:
        if only and A.key not in only:continue
        items.append({'key':A.key,'png':str(tmp/f'{A.key}.png'),'png_ex':str(tmp/f'{A.key}-exploded.png'),
                      'members':[{'stl':str(tmp/f'{m.key}.stl'),'m':mat4(m.loc()),'ex':list(m.ex),'finish':finish(rec[m.key][1])} for m in A.members]})
        listing.append({'key':A.key,'title':A.title,'group':A.group,'assembly':True,'image':f'renders/{A.key}.webp','exploded':f'renders/{A.key}-exploded.webp',
                        'members':sorted({rec[m.key][1].title for m in A.members}),'flags':A.flags})
    hdri=pathlib.Path(blender()).parent.glob('*/datafiles/studiolights/world/studio.exr');hdri=str(next(hdri))
    js=tmp/'scene.json';js.write_text(json.dumps({'items':items,'samples':o.samples,'size':[int(x) for x in o.size.split('x')],'hdri':hdri}),encoding='utf-8')
    sp=tmp/'scene.py';sp.write_text(SCENE,encoding='utf-8')
    n=sum(1+bool(i.get('png_ex')) for i in items);print(f'rendering {n} images in Blender',flush=True)
    r=subprocess.run([blender(),'-b','--factory-startup','-P',str(sp),'--',str(js)],capture_output=True,text=True,encoding='utf-8',errors='replace')
    for l in r.stdout.splitlines():
        if l.startswith(('rendered','device','Error','Traceback')) or 'Error' in l:print(' ',l)
    if r.returncode:print(r.stderr[-3000:]);sys.exit('Blender failed')
    from PIL import Image
    for it in items:
        for src in (it['png'],it.get('png_ex')):
            if not src:continue
            s=pathlib.Path(src);Image.open(s).save(out/(s.stem+'.webp'),'WEBP',quality=86,method=6)
    js=out.parent/'js'/'hrenders.js';old=[]
    if only and js.exists():old=json.loads(js.read_text(encoding='utf-8').split('const HRENDERS=',1)[1].rstrip().rstrip(';'))
    have={l['key'] for l in listing};allk=[k for k,(g,r) in rec.items() if k in SHEET]+[A.key for A in asms]
    L=sorted([x for x in old if x['key'] not in have]+listing,key=lambda x:allk.index(x['key']) if x['key'] in allk else 999)
    js.parent.mkdir(parents=True,exist_ok=True)
    js.write_text("/* hrenders.js: the drawn parts' and drawn-only subassemblies' still renders (renders/), for index.html beside it. Written by tools/hamilton_render.py;\n"
                  '   do not edit by hand. Declares only HRENDERS. */\n"use strict";\nconst HRENDERS='+json.dumps(L,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    print(f'wrote {n} images into {out} and {js.name} in {time.time()-t0:.0f} s')
if __name__=='__main__':main()
