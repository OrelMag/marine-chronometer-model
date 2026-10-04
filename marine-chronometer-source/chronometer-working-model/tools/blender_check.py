"""The export to Blender, in Blender: imports r_model21.glb (gltf_check.py writes it), runs the rig (blender/rig.py) and checks it against the export's own clips.
About 3 minutes (most of it the import). Needs Blender 5.x: MC_BLENDER, else the usual install path; with neither it says so and exits 0.

    python blender_check.py [GLB]       # default r_model21.glb in the current directory; renders r_blender_*.png there

Checks: every clip came in as an action; the parts are objects in their hierarchy, the jewels and crystal transmitting; the rig made its controls and drivers;
at a series of moments the rig (the timeline at t) puts every part the Running clip moves (the balance, detent, escape wheel, train, hands, fusee) where that clip
has it at t, to 0.02 mm and 0.1 degree in the world; the explode, laid out, lift and lids controls at 1 match the end of their own clips. Exit code 1 on a failure."""
import os,pathlib,subprocess,sys
try:
    import bpy
except ImportError:
    bpy=None
HERE=pathlib.Path(__file__).resolve().parent;RIG=HERE.parent/'blender'/'rig.py'
if bpy is None:   # outside Blender: find it and run this file in it
    exe=os.environ.get('MC_BLENDER')
    if not exe:
        for p in sorted(pathlib.Path(r'C:\Program Files\Blender Foundation').glob('Blender */blender.exe'),reverse=True):exe=str(p);break
    if not exe or not pathlib.Path(exe).exists():print('Blender not found (set MC_BLENDER): skipped');sys.exit(0)
    glb=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'r_model21.glb').resolve()
    r=subprocess.run([exe,'-b','--factory-startup','--python',str(pathlib.Path(__file__).resolve()),'--',str(glb),str(RIG),str(pathlib.Path.cwd())],capture_output=True,text=True,encoding='utf-8',errors='replace')
    out=[l for l in r.stdout.splitlines() if l.startswith(('MC ','FAIL','Traceback','  File','Error'))or 'Error' in l]
    print('\n'.join(out));ok=any(l.startswith('MC passed') for l in out)
    if not ok:print(r.stderr[-3000:])
    sys.exit(0 if ok else 1)
# ---- inside Blender ----
import math,json
from mathutils import Matrix
argv=sys.argv[sys.argv.index('--')+1:];GLB,RIGP,OUT=argv[0],argv[1],pathlib.Path(argv[2])
bad=[];fail=lambda m:(bad.append(m),print('FAIL',m))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
sc=bpy.context.scene;fps=sc.render.fps/sc.render.fps_base
root=next((o for o in bpy.data.objects if 'clips' in o.keys()),None)
if not root:fail('no root with the clips');raise SystemExit
clips=[c.to_dict() for c in root['clips']]
print('MC imported: %d objects, %d actions, %d materials'%(len(bpy.data.objects),len(bpy.data.actions),len(bpy.data.materials)))
for c in clips:
    if c['name'] not in bpy.data.actions:fail('clip %r not an action'%c['name'])
for k in['escW','bal','det','fs','cw','hands','trainBridge']:
    if not any(o.name.endswith('(%s)'%k) for o in bpy.data.objects):fail('no object for part '+k)
tm=[m for m in bpy.data.materials if m.node_tree and any(n.type=='BSDF_PRINCIPLED' and n.inputs['Transmission Weight'].default_value>0.5 for n in m.node_tree.nodes)]
if not tm:fail('no transmitting material (the jewels, the crystal)')
# the clips' poses, played on every part
def owner(slot):
    n=slot.name_display;return bpy.data.objects.get(n) if slot.target_id_type=='OBJECT' else bpy.data.shape_keys.get(n) if slot.target_id_type=='KEY' else None
from mathutils import Vector,Quaternion
def clear():
    """no clip on any part, and every part that moves back at its rest (extras.rest, in Blender's axes): else it keeps the pose the last clip left"""
    for i in list(bpy.data.objects)+list(bpy.data.shape_keys):
        ad=i.animation_data
        if ad:
            for t in list(ad.nla_tracks):ad.nla_tracks.remove(t)
            for fc in list(ad.drivers):ad.drivers.remove(fc)
            ad.action=None
        if isinstance(i,bpy.types.Object) and 'rest' in i.keys():
            r=list(i['rest']);i.rotation_mode='QUATERNION';i.location=(r[0],-r[2],r[1]);i.rotation_quaternion=Quaternion((r[6],r[3],-r[5],r[4]));i.scale=(r[7],r[9],r[8])
def play(name):
    clear();a=bpy.data.actions[name]
    for s in a.slots:
        i=owner(s)
        if i:ad=i.animation_data_create();ad.action=a;ad.action_slot=s
    return a
def pose(objs):
    bpy.context.view_layer.update();return {o.name:o.matrix_world.copy() for o in objs}
def diff(A,B):
    w=(0,'',0)
    for k in A:
        if k not in B:continue
        d=(A[k].translation-B[k].translation).length*1000;qa=A[k].to_quaternion();qb=B[k].to_quaternion();ang=math.degrees(qa.rotation_difference(qb).angle);ang=min(ang,360-ang)
        sa=A[k].to_scale().length;sb=B[k].to_scale().length
        if sa<1e-6 or sb<1e-6:continue   # hidden (scale 0)
        if d+ang*0.2>w[0]+w[2]*0.2:w=(d,k,ang)   # the worst part, by its distance and its angle (0.1 degree as 0.02 mm)
    return w
for a in bpy.data.actions:a.use_fake_user=True
run=bpy.data.actions['Running'];moved=set()
for s in run.slots:
    i=owner(s)
    if isinstance(i,bpy.types.Object):moved.add(i)
TS=[0.0,0.13,0.25,0.31,0.5,1.07,3.33,7.71,12.5,29.98]
ref={}
play('Running')
for t in TS:sc.frame_set(int(t*fps),subframe=t*fps-int(t*fps));ref[t]=pose(moved)
for c in['Rig · explode','Rig · laid out','Rig · lift','Rig · lids']:
    a=play(c);sc.frame_set(int(a.frame_range[1]));ref[c]=pose(a and [owner(s) for s in a.slots if isinstance(owner(s),bpy.types.Object)])
clear()
ns={'__name__':'__main__','__file__':RIGP};exec(compile(open(RIGP,encoding='utf-8').read(),RIGP,'exec'),ns)
ctl=bpy.data.objects.get('Chronometer controls')
if not ctl:fail('the rig made no controls')
nd=sum(len(o.animation_data.drivers) for o in bpy.data.objects if o.animation_data)
print('MC rig: %d drivers, %d objects with strips'%(nd,sum(1 for i in list(bpy.data.objects)+list(bpy.data.shape_keys) if i.animation_data and len(i.animation_data.nla_tracks))))
worst=(0,'',0)
for t in TS:
    sc.frame_set(int(t*fps),subframe=t*fps-int(t*fps));P=pose(moved);w=diff(ref[t],P);worst=max(worst,w)
    ch='chain' in w[1]   # a link between two of Run down's moments, 1.9 hours of wind apart
    if w[0]>(0.1 if ch else 0.02) or w[2]>(0.25 if ch else 0.1):fail('rig at %.2f s off the Running clip: %.4f mm, %.3f deg (%s)'%(t,w[0],w[2],w[1]))
print('MC rig against Running: worst %.5f mm, %.4f deg (%s) over %d moments'%(worst[0],worst[2],worst[1],len(TS)))
sc.frame_set(0)
for c,k in[('Rig · explode','explode'),('Rig · laid out','laid_out'),('Rig · lift','lift'),('Rig · lids','lids')]:
    ctl[k]=1.0;ctl.update_tag();sc.frame_set(0);P=pose([bpy.data.objects[n] for n in ref[c]]);w=diff(ref[c],P);ctl[k]=0.0;ctl.update_tag()
    if w[0]>0.02 or w[2]>0.1:fail('%s = 1 off its clip\'s end: %.4f mm, %.3f deg (%s)'%(k,w[0],w[2],w[1]))
    else:print('MC %s: matches its clip (%.5f mm)'%(k,w[0]))
# pictures, in the workbench: the movement out of its case, and exploded
try:
    cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam'));sc.collection.objects.link(cam);sc.camera=cam;cam.data.lens=50;cam.data.clip_start=0.001
    sc.render.engine='BLENDER_WORKBENCH';sc.render.resolution_x=900;sc.render.resolution_y=640;sc.display.shading.light='STUDIO';sc.display.shading.color_type='MATERIAL'
    from mathutils import Vector
    for tag,k,dist in(('movement','lift',0.22),('exploded','explode',0.5)):
        ctl['lift']=1.0;ctl[k]=1.0;ctl.update_tag();sc.frame_set(0);mv=next(o for o in bpy.data.objects if o.get('role')=='movement');c=mv.matrix_world.translation
        cam.location=c+Vector((dist*0.55,-dist*0.75,dist*0.55));cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler()
        sc.render.filepath=str(OUT/('r_blender_%s.png'%tag));bpy.ops.render.render(write_still=True);print('MC rendered',sc.render.filepath)
        ctl[k]=0.0;ctl['lift']=0.0
except Exception as e:fail('render: %s'%e)
print('MC passed' if not bad else 'MC %d failures'%len(bad))
