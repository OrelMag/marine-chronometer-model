"""wempe_movie.py: a two-minute film of the Wempe Einheits-Chronometer at work, for posting (YouTube): the page's own export to Blender (wempe/js/blender.js, ?qa's
__glb, the version as photographed, rev=3955) with its clips (Running, Beat (slow motion), Winding, Exploded, Laid out, Run down, Lift out, Lid, At sea) played shot by
shot through cameras fitted to what each shot frames, in wempe_showcase.py's studio (the same lights, floor, world and lens), captions burned in and the page's own
tick (app.js's tickSnd: a 30 ms noise burst through a 3.4 kHz band-pass) on each tooth's fall (the escape wheel past half a tooth, as the page ticks). One shot table
(SHOTS) drives the draft (EEVEE) and the final (Cycles): only the engine, size, fps and samples differ. Facts in the captions come from the Wempe README and the essay
(each line's source beside it). Not run by build.py or ci.py; the film and its frames stay outside the repository (default E:\\mc-video\\movie).

    python wempe_movie.py export                       the glb with the clips (about 3 min), into WORK
    python wempe_movie.py plan                         each shot's camera and its ticks (Blender, no render; about 2 min): WORK/plan.json
    python wempe_movie.py stills [--only a,b] [--at 0.5]   one EEVEE frame of each shot at that share of it (framing), WORK/stills/
    python wempe_movie.py render --engine eevee|cycles [--size 1280x720] [--fps 30] [--samples N] [--only a,b]
                                                       every frame, into WORK/frames/TAG/SHOT/00000.png; frames already there are kept (resumable)
    python wempe_movie.py compose --tag TAG [--out FILE] [--no-voice]   captions, fades, ticks and the narration over the frames: the MP4, its .srt and the sound track
    python wempe_movie.py say   the narration (SAY) spoken by Kokoro into WORK/voice, each line's length against its room
  --work DIR (default E:\\mc-video\\movie\\work)."""
import argparse,asyncio,json,math,pathlib,subprocess,sys,time,wave
HERE=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(HERE));import browser
from hamilton_render import blender
ROOT=HERE.parents[2];WEMPE=HERE.parents[1]/'wempe'
WORK=pathlib.Path(r'E:\mc-video\movie\work')
STATE='rev='+','.join(k+(':last' if k=='case' else ':3955') for k in ['esc','fusee','barrel','train','dial','frame','case','key'])+'&wind=6'   # as photographed, but the drawings' brass bowl (the owner's choice, 3 November 2026)   # 6 h from full wind: at wempe_showcase.py's 55.9 the train runs down 36 s into Running
CLIPS=['Lid','At sea','Running','Beat (slow motion)','Winding','Exploded','Run down','Lift out']
BAND=0.2   # the share of the frame's height at its foot kept for the captions: the cameras frame the parts above it
SLIP=-6630   # the hands set 1 h 50 min 30 s back from the export's 12:00 (a slip forward turns them back): 10:09:30 at clip 0, 10:10 through the dial shot (the owner's choice)
CFPS=30   # the scene's fps when the glb is imported: a clip's second is CFPS frames of its action

# The shots, in order. dur: seconds. layers: [clip, [[shot s, clip s], ...]] played at once, piecewise linear between the keys and held outside them (a later layer wins
# where two move the same part: none do). show 'all' or 'mv' (the movement alone; plus: case parts' keys added; hide: parts' keys left out); up: +1 the dial side up, -1
# the train side (as wempe_showcase.py, the floor under whichever is up); floor: False leaves it out (the box rolls in At sea). cams: [[shot s, {dir (the camera's
# direction from its target, the movement's frame), frame (the parts it frames, None all shown), fill, lens, f}], ...] eased between; each fitted over the shot's poses.
# caps: [[t0, t1, line, second line or ''], ...]; title: a title card's lines over the shot. tick: 'run' (the page's tick at each tooth's fall), 'slow' (the slow
# motion's, an octave down and longer), None.
R=lambda t0,d:['Running',[[0,t0],[d,t0+d]]]
SEE=['topPlate','pillarPlate','barrelBridge','intermediateBridge','fuseeBush','dustBush','coverPlate','dustPlate','ring','lowerCock']   # the frame, drawn see-through
C=lambda t,dr,fr=None,fill=0.85,lens=90,f=11,**k:[t,dict(dir=dr,frame=fr,fill=fill,lens=lens,f=f,**k)]   # a camera key
SHOTS=[
 dict(name='open',dur=10,show='all',up=1,layers=[['Lid',[[0,3.5],[2,3.5],[8,7]]],R(0,10)],tick='run',
  cams=[C(0,(0.25,0.45,1.0),None,0.70,60),C(5,(0.30,0.75,0.90),None,0.80,60),C(10,(0.20,1.0,0.60),['dial'],0.62,70,8)],
  title=['The Wempe Einheits-Chronometer','How a marine chronometer keeps time at sea'],   # README: the Deutsches Einheits-Chronometer, the standard marine chronometer
  caps=[[6.5,10,"Germany's standard marine chronometer,","designed at Wempe's chronometer works in Hamburg in the early 1940s"]]),   # README, first paragraph
 dict(name='sea',dur=12,show='all',up=1,floor=False,layers=[['At sea',[[0,4],[12,16]]],R(10,12)],tick='run',
  cams=[C(0,(1.0,0.45,0.55),None,0.62,50),C(12,(0.55,0.60,1.0),None,0.66,50)],
  caps=[[0.6,5.8,'At sea the ship rolls and pitches;','the bowl hangs level in its gimbals'],   # At sea's clip (case.js): the case hangs still, the box rolls round it
        [6.2,11.6,'A navigator finds longitude from Greenwich time:','four seconds of error are a nautical mile at the equator']]),   # the essay ("four seconds are a minute of arc")
 dict(name='dial',dur=12,show='all',up=1,layers=[R(22,12)],tick='run',
  cams=[C(0,(-0.30,1.0,0.55),['dial'],0.92,105,5.6),C(6,(0.0,1.0,0.25),['dial'],0.96,105,5.6),C(12,(0.25,1.0,0.45),['dial'],0.88,105,5.6)],
  caps=[[0.6,5.8,'The seconds hand steps every half second:','7,200 beats an hour'],   # README: 120 beats a minute, the centre once in 7,200
        [6.2,11.6,'The up-and-down hand shows how far it has run down:','56 hours from full wind']]),   # README: the up-and-down hand, 0 to 56 h
 dict(name='face',dur=12,show='mv',up=1,hide=['dial'],layers=[R(34,12)],tick='run',   # the dial side with the dial left out (the owner, 3 November 2026)
  cams=[C(0,(0.35,1.0,0.60),['cannon','hourWheel','changeWheel','udWheel','udPinion'],0.84,90,16),C(6,(0.05,1.0,0.45),['cannon','hourWheel','changeWheel','udWheel','udPinion'],0.88,90,16),C(12,(-0.30,1.0,0.55),['cannon','hourWheel','changeWheel','udWheel','udPinion'],0.84,90,16)],
  caps=[[0.6,5.8,'Under the dial, the motion work: the cannon tube turns once an hour','with the minute hand, the hour wheel twelve times slower'],   # README P1e Motion: an hour a turn, the hour wheel at a twelfth
        [6.2,11.6,'The up-and-down wheel, turned by the fusee,','carries the hand that shows the hours run']]),   # README P1e Motion: the up-and-down pinion with the fusee, the wheel back at a tenth
 dict(name='wind',dur=14,show='all',up=1,layers=[['Winding',[[0,0],[12.1167,12.1167]]],R(34,14)],tick='run',
  cams=[C(0,(0.55,0.95,0.75),None,0.82,60),C(7,(0.25,1.0,0.55),['bowl'],0.80,60),C(14,(0.10,1.0,0.65),None,0.80,60)],
  caps=[[0.6,6.6,'It is wound with a key:','the bowl turned over in its gimbals, the key turned to the stop'],   # Winding's clip, after the 6MX's instruction (README)
        [7.0,13.4,'Wound to the stop, it runs 56 hours:','the bowl is turned back and the key taken off']]),   # Winding's clip; README: 55.9 h from full wind to run down
 dict(name='maint',dur=12,show='mv',up=-1,hide=['dial','hands','cannon','hourWheel','changeWheel','udWheel','udPinion'],see=SEE+['fuseeWheel','Schneckensperrrad'],layers=[['Winding',[[0,2.6],[12,8.1]]]],tick='run',
  # the bowl turned over to be wound: the fusee's large end, its wheel and the maintaining work, at the pillar plate, face down; seen from under it, the dial and motion work left out
  cams=[C(0,(0.55,-1.0,0.65),['fuseeWheel','maintaining','maintDetent'],0.86,90,22),C(6,(0.20,-1.0,0.55),['Sperrfeder','maintDetent'],0.88,105,22),
        C(12,(-0.25,-1.0,0.60),['fuseeWheel','maintaining','maintDetent'],0.86,90,22)],
  caps=[[0.6,5.8,"Harrison's maintaining work: as the key turns the fusee back,","its two clicks ride over the click wheel and the maintaining detent holds the ratchet"],   # README: Harrison's maintaining work (ratchet, clicks, maintaining spring, maintaining detent)
        [6.2,11.6,'and the maintaining spring drives the fusee wheel and the train,','so it keeps time while it is wound']]),   # README: the maintaining spring driving the train while the key turns
 dict(name='stop',dur=12,show='mv',up=1,hide=['upperCock','balance','hairspring','rollers'],see=SEE+['fuseeBush','dustBush'],layers=[['Winding',[[0,4.0],[12,10.2]]]],tick='run',
  cams=[C(0,(-0.45,1.0,0.40),['stopWork','Anschlagstift'],0.55,90,22),C(8,(-0.30,1.0,0.30),['stopWork','Anschlagstift'],0.60,90,22),C(12,(-0.20,1.0,0.45),['stopWork','setupRatchet'],0.75,90,22)],   # the stop work at the fusee's small end (the owner, 3 November 2026), the balance left out of the way
  caps=[[0.6,5.8,"As the chain comes onto the fusee's top turn it presses the stop bar out:",'at full wind its end meets the stop pin and the key can turn no further'],   # app.js stopWork's description; README, the stop work
        [6.2,11.6,'Beside it, the set-up ratchet and its click on the barrel arbor','keep the mainspring set up']]),   # app.js setupRatchet: the bridge's click holds it, the mainspring set up
 dict(name='apart',dur=12,show='mv',up=1,layers=[['Exploded',[[0,2.5],[8,5.5],[12,6]]]],tick=None,
  cams=[C(0,(0.95,0.55,0.55),None,0.88,90,16),C(6,(0.95,0.40,0.30),None,0.90,90,16),C(12,(0.80,0.35,0.05),None,0.92,90,16)],
  caps=[[1.0,11.4,'Inside: the power, a train of wheels,','the escapement and the balance']]),
 dict(name='fusee',dur=14,show='mv',up=-1,see=SEE+['barrel'],layers=[['Run down',[[0,0],[14,30]]]],tick=None,
  cams=[C(0,'out',['fusee','chain','barrel'],0.88,90,22,rise=0.20),C(7,'out',['fusee','chain'],0.88,90,22,rise=0.35),C(14,'out',['chain','barrel'],0.88,90,22,rise=0.30)],
  caps=[[0.6,6.6,'The mainspring in its barrel pulls a chain','wound on the fusee (here 56 hours in 14 seconds)'],   # Run down's clip: the chain off the fusee onto the barrel
        [7.0,13.4,"The fusee's cone gives the strong spring a short lever","and the weak one a long one: the drive stays even"]]),   # the essay, the fusee
 dict(name='train',dur=12,show='mv',up=-1,see=SEE,layers=[R(10,12)],tick='run',
  cams=[C(0,(0.40,-1.0,0.55),['fusee','fuseeWheel','centreWheel'],0.88,90,22),C(6,(0.15,-1.0,0.60),['centreWheel','intermediateWheel','secondsWheel'],0.88,90,22),
        C(12,(-0.20,-1.0,0.55),['secondsWheel','escapeWheel','balance'],0.88,90,22)],
  caps=[[0.6,11.4,'Through the plates: the fusee turns the centre, intermediate','and seconds wheels, and they the escape wheel']]),   # README: the train (centre, intermediate, seconds, escape)
 dict(name='train2',dur=10,show='mv',up=-1,see=SEE+['barrel'],layers=[R(24,10)],tick='run',
  cams=[C(0,(-1.0,-0.25,-0.35),['fuseeWheel','centreWheel','intermediateWheel'],0.86,90,32),C(10,(-0.35,-0.25,-1.0),['intermediateWheel','secondsWheel','escapeWheel'],0.82,90,32)],
  caps=[[0.6,4.8,'The going train between the plates:','the escape wheel moves one tooth a beat'],   # README: a beat each half second, 24 degrees of the escape wheel's 15 teeth
        [5.2,9.6,'the seconds wheel turns once a minute,','the centre wheel, with the minute hand, once an hour']]),   # README: the seconds arbor once in 120 teeth, the centre once in 7,200
 dict(name='beat',dur=20,show='mv',up=-1,see=SEE+['upperCock','balance','hairspring'],layers=[['Beat (slow motion)',[[0,0],[1,0],[5,2.3],[14,3.1],[19,10],[20,10]]]],tick='slow',   # the wheel moves at clip 2.54-2.94 s: those spread over 9 s (shot 7.7-12.2)
  cams=[C(0,(-0.30,-1.0,0.30),['balance','escapeWheel','detent'],0.88,105,32),C(5,(-0.25,-1.0,0.40),['detent','rollers'],0.92,135,32),
        C(14,(-0.10,-1.0,0.50),['detent','rollers'],0.94,135,32),C(20,(-0.02,-1.0,0.48),['detent','rollers'],0.92,135,32)],   # the last key near the 14 s one: at (0.05,-1,0.45) the see-through balance rim came before the lens, all blurred   # close on the detent and rollers (the owner, 3 November 2026)
  caps=[[0.5,5.8,'One beat, slowed down: the spring detent escapement.',"The escape wheel is held on the detent's locking stone"],   # README: the detent with its gold spring and locking stone
        [6.0,9.2,"The balance's discharge jewel pushes the gold spring","and lifts the detent: the wheel is unlocked"],   # the wheel starts at shot 7.7 s
        [9.4,12.2,'A tooth drives the impulse roller:','the balance gets its push'],   # the tooth's fall, the tick, at 10.0 s
        [12.4,19.6,'The detent falls back and locks the next tooth;','on the way back the jewel passes the gold spring freely']]),   # locked at 12.2 s
 dict(name='balance',dur=12,show='mv',up=-1,layers=[R(40,12)],tick='run',
  cams=[C(0,(-0.55,-0.75,0.55),['balance','upperCock','detent'],0.86,105,4),C(12,(-0.85,-0.55,0.20),['balance','upperCock','detent'],0.90,105,4)],
  caps=[[0.6,5.8,'The balance and its hairspring swing at a steady rate:','every swing lets one tooth go'],
        [6.2,11.6,'Its cut bimetallic rim opens and closes with the heat','to keep the rate the same']]),   # README: the cut bimetallic balance in heat and cold
 dict(name='end',dur=8,show='mv',up=-1,layers=[R(52,8)],tick='run',
  cams=[C(0,(0.62,-0.62,0.75),None,0.80,90),C(8,(0.85,-0.40,0.55),None,0.86,90)],
  title=['Explore it in 3D','marinechronometermodel.com'],caps=[])]

async def export(out):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto((WEMPE/'index.html').as_uri()+'?qa&start=movement#'+STATE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(2500)
        async with pg.expect_download(timeout=3600000) as d:await pg.evaluate("c=>{window.__msK=241;window.__msSlip=SLIP;return __glb(c);}".replace("SLIP",str(SLIP)),CLIPS)   # the mainspring's shapes over the run: 241 (the page's 24 jump every 0.6 s in the fusee shot)
        await (await d.value).save_as(out);await b.close()
    if errs:sys.exit('page errors: '+'; '.join(errs))
    print('exported',out.name,'%.1f MB'%(out.stat().st_size/1048576),flush=True)

# Blender's side: the scene (wempe_showcase.py's), the clips evaluated by hand (each layer at its own clip time, so two clips play at once), the cameras fitted over each
# shot's poses, and the jobs: plan (cameras and the escape wheel's teeth over time), frames (render the listed frames)
SCENE=r'''
import bpy,json,math,sys,os,time
from mathutils import Vector,Matrix,Quaternion
from bpy_extras import anim_utils
A=json.load(open(sys.argv[sys.argv.index('--')+1]))
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.fps=A['cfps']
eng=A.get('engine','eevee')
if eng=='cycles':
    s.render.engine='CYCLES';c=s.cycles;pr=bpy.context.preferences.addons['cycles'].preferences;dev='NONE'
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
else:
    for e in ('BLENDER_EEVEE','BLENDER_EEVEE_NEXT'):
        try:s.render.engine=e;break
        except Exception:pass
    ee=s.eevee;ee.taa_render_samples=A['samples']
    for k,v in (('use_raytracing',True),('use_shadows',True),('use_gtao',True)):
        try:setattr(ee,k,v)
        except Exception:pass
    try:ee.ray_tracing_options.resolution_scale='1'
    except Exception:pass
s.render.resolution_x,s.render.resolution_y=A['size'];s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB'
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
w=bpy.data.worlds.new('w');s.world=w;w.use_nodes=True;nt=w.node_tree;N=nt.nodes;Lk=nt.links;bg=N['Background'];out=N['World Output']
env=N.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(A['hdri']);Lk.new(env.outputs['Color'],bg.inputs['Color']);bg.inputs['Strength'].default_value=0.9
dk=N.new('ShaderNodeBackground');dk.inputs['Color'].default_value=(0.010,0.011,0.013,1);mx=N.new('ShaderNodeMixShader');lp=N.new('ShaderNodeLightPath')
Lk.new(lp.outputs['Is Camera Ray'],mx.inputs['Fac']);Lk.new(bg.outputs['Background'],mx.inputs[1]);Lk.new(dk.outputs['Background'],mx.inputs[2]);Lk.new(mx.outputs['Shader'],out.inputs['Surface'])
t0=time.time();bpy.ops.import_scene.gltf(filepath=A['glb']);print('imported',round(time.time()-t0),'s',flush=True)
mv=[o for o in bpy.data.objects if o.name.startswith('Movement')][0]
# every clip off its objects: the clips are evaluated by hand below
for i in list(bpy.data.objects)+list(bpy.data.shape_keys):
    ad=i.animation_data
    if ad:
        for t in list(ad.nla_tracks):ad.nla_tracks.remove(t)
        ad.action=None
REST={}
for o in bpy.data.objects:
    if 'rest' in o.keys():r=list(o['rest']);REST[o]=((r[0],-r[2],r[1]),Quaternion((r[6],r[3],-r[5],r[4])),(r[7],r[9],r[8]))
def rest(only=None):
    for o,(l,q,sc) in REST.items():
        if only is None or o in only:o.rotation_mode='QUATERNION';o.location=l;o.rotation_quaternion=q;o.scale=sc
def owner(slot):
    n=slot.name_display;return bpy.data.objects.get(n) if slot.target_id_type=='OBJECT' else bpy.data.shape_keys.get(n) if slot.target_id_type=='KEY' else None
CH={}   # each clip's channels: (the object or key, path, index, fcurve)
def chans(name):
    if name not in CH:
        a=bpy.data.actions[name];L=[]
        for sl in a.slots:
            i=owner(sl);cb=anim_utils.action_get_channelbag_for_slot(a,sl)
            if i is None or cb is None:continue
            for fc in cb.fcurves:L.append((i,fc.data_path,fc.array_index,fc))
        CH[name]=L
    return CH[name]
def keyed(K,t):   # piecewise linear through [[shot s, clip s], ...], held outside
    if t<=K[0][0]:return K[0][1]
    for (a,x),(b,y) in zip(K,K[1:]):
        if t<=b:return x+(y-x)*(t-a)/(b-a) if b>a else y
    return K[-1][1]
def pose(S,t,only=None):   # only: those objects alone (their local transforms), no scene update
    rest(only)
    for name,K in S['layers']:
        f=keyed(K,t)*A['cfps']
        for i,p,ix,fc in chans(name):
            if only is not None and i not in only:continue
            if p=='rotation_quaternion':i.rotation_mode='QUATERNION'
            try:getattr(i,p)[ix]=fc.evaluate(f)
            except Exception:
                try:setattr(i,p,fc.evaluate(f))
                except Exception:pass
    if only is None:bpy.context.view_layer.update()
rest();bpy.context.view_layer.update()
M=mv.matrix_world@Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)));Rw=M.to_3x3().normalized()   # the movement's own frame at rest (glTF y up undone)
def under(o,r):
    while o:
        if o==r:return True
        o=o.parent
    return False
meshes=[o for o in bpy.data.objects if o.type=='MESH'];inmv={o for o in meshes if under(o,mv)}
def key(o):
    k=set()
    while o:
        n=o.name.split('.')[0]
        if n.endswith(')') and '(' in n:k.add(n[n.rindex('(')+1:-1])
        o=o.parent
    return k
K={o:key(o) for o in meshes}
S0={o:max(o.matrix_world.to_scale().length,1e-12) for o in meshes}   # each mesh's scale at rest: the export is in metres, the movement's parts at 0.001; a clip hides a piece by scaling it to nothing
# see-through plates (the page's see-through parts): a translucent brass in their place, casting no shadow
gh=bpy.data.materials.new('ghost');gh.use_nodes=True;gb=gh.node_tree.nodes['Principled BSDF'];gb.inputs['Base Color'].default_value=(0.80,0.60,0.30,1);gb.inputs['Metallic'].default_value=0.6;gb.inputs['Roughness'].default_value=0.35;gb.inputs['Alpha'].default_value=0.16
for k_,v_ in (('surface_render_method','BLENDED'),('use_transparency_overlap',False)):
    try:setattr(gh,k_,v_)
    except Exception:pass
def see(S):
    for o in meshes:
        g=bool(K[o]&set(S.get('see',[])))
        for sl in o.material_slots:
            if g:sl.link='OBJECT';sl.material=gh
            else:sl.link='DATA'
        o.visible_shadow=not g
fl=bpy.data.materials.new('floor');fl.use_nodes=True;b=fl.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=(0.018,0.019,0.022,1);b.inputs['Roughness'].default_value=0.38
cd=bpy.data.cameras.new('cam');cam=bpy.data.objects.new('cam',cd);s.collection.objects.link(cam);s.camera=cam;cd.sensor_fit='HORIZONTAL';cd.sensor_width=36
asp=A['size'][0]/A['size'][1];made=[];cd.shift_y=-A['band']/(2*asp)   # the aim at the middle of the frame above the band
def light(name,loc,size,energy,at,shadow=True):
    d=bpy.data.lights.new(name,'AREA');d.size=size;d.energy=energy;d.use_shadow=shadow;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc
    o.rotation_euler=(at-loc).to_track_quat('-Z','Y').to_euler();made.append(o);return o
def shown(S):
    return [o for o in meshes if (S['show']=='all' or o in inmv or K[o]&set(S.get('plus',[]))) and not K[o]&set(S.get('hide',[]))]
def q(L,f):return sorted(L)[min(len(L)-1,max(0,int(f*len(L))))]
def fit(S,C,vis,up,P):
    """a camera key fitted over the shot's poses: P the visible meshes' points at each sampled moment, the framed parts' among them"""
    FP=[p for ps in P for (p,k) in ps if not C['frame'] or k&set(C['frame'])]
    ctr=Vector([(q([p[i] for p in FP],0.005)+q([p[i] for p in FP],0.995))/2 for i in range(3)]);ext=q([(p-ctr).length for p in FP],0.99)
    if C['dir']=='out':
        ax=M@Vector((0,0,0));h=ctr-ax;h=(h-h.dot(up)*up).normalized();d=(h+up*C.get('rise',0.3)).normalized()
    else:d=(Rw@Vector(C['dir'])).normalized()
    lens=C['lens'];th=36/2/lens;dist=ext*8
    for _ in range(6):
        loc=ctr+d*dist;f=-d;r=f.cross(up).normalized();u=r.cross(f);W=Matrix((r,u,-f)).transposed().to_4x4();W.translation=loc;W=W.inverted()
        Q=[W@p for p in FP];uu=[v.x/-v.z for v in Q];vv=[v.y/-v.z for v in Q]
        k=max(max(abs(q(uu,0.005)),abs(q(uu,0.995)))/(C['fill']*th),max(abs(q(vv,0.005)),abs(q(vv,0.995)))/(C['fill']*th/asp*(1-A['band'])));dist*=k
    return dict(ctr=list(ctr),d=list(d),dist=dist,lens=lens,f=C['f'])
def plan(S):
    vis=shown(S);up=(Rw@Vector((0,S['up'],0))).normalized();P=[];lo=[];R=[]
    for j in range(7):
        pose(S,S['dur']*j/6);ps=[(o.matrix_world@v.co,K[o]) for o in vis if o.matrix_world.to_scale().length>0.05*S0[o] for v in list(o.data.vertices)[::7]];P.append(ps)
        lo.append(q([p.dot(up) for p,_ in ps],0.001))
    allp=[p for ps in P for p,_ in ps];c0=Vector([sum(p[i] for p in allp)/len(allp) for i in range(3)])
    keys=[[t,fit(S,C,vis,up,[P[j] for j in range(7) if abs(S['dur']*j/6-t)<=S['dur']/5])] for t,C in S['cams']]   # each key on the poses near its own time
    return dict(up=list(up),lo=min(lo),R=q([(p-c0).length for p in allp],0.99),keys=keys)
def ease(x):x=max(0,min(1,x));return x*x*(3-2*x)
def camAt(pl,t,up):
    ks=pl['keys']
    if t<=ks[0][0] or len(ks)==1:k0=k1=ks[0];a=0
    else:
        i=max(j for j in range(len(ks)) if ks[j][0]<=t);k0=ks[i];k1=ks[min(i+1,len(ks)-1)];a=ease((t-k0[0])/(k1[0]-k0[0])) if k1[0]>k0[0] else 0
    A0,A1=k0[1],k1[1];L=lambda x,y:x+(y-x)*a
    ctr=Vector(A0['ctr']).lerp(Vector(A1['ctr']),a);d=Vector(A0['d']).slerp(Vector(A1['d']),a) if (Vector(A0['d'])-Vector(A1['d'])).length>1e-6 else Vector(A0['d'])
    dist=math.exp(L(math.log(A0['dist']),math.log(A1['dist'])));lens=L(A0['lens'],A1['lens']);fs=L(A0['f'],A1['f'])
    loc=ctr+d*dist;f=-d;r=f.cross(up).normalized();u=r.cross(f);W=Matrix((r,u,-f)).transposed().to_4x4();W.translation=loc
    return W,dist,lens,fs
job=A['job'];PL=A.get('plan')
if job=='plan':
    res={};ewp=next(o for o in bpy.data.objects if o.name.split('.')[0].endswith('(escapeWheel)'));ew=next(i for i,p,ix,fc in chans('Running') if p=='rotation_quaternion' and isinstance(i,bpy.types.Object) and under(i,ewp));print('escape wheel',ew.name,flush=True)   # the object Running turns: under the part's group
    for S in A['shots']:
        t1=time.time();pl=plan(S);
        # the escape wheel's teeth from rest (24 degrees a tooth, 15 teeth: README) every 1/240 s, for the ticks
        E=[];prev=None;acc=0;q0=REST[ew][1]
        for i in range(int(S['dur']*240)+1):
            pose(S,i/240,only={ew});qr=q0.inverted()@ew.rotation_quaternion;qv=Vector((qr.x,qr.y,qr.z));ang=2*math.atan2(qv.length,qr.w)
            ax=qv.normalized() if qv.length>1e-9 else None
            if ax is not None:
                if prev is None:prev=ax
                ang=ang if ax.dot(prev)>=0 else -ang
            E.append(math.degrees(ang)/24)
        pl['E']=E;res[S['name']]=pl;print('planned',S['name'],round(time.time()-t1,1),'s',flush=True)
    json.dump(res,open(A['out'],'w'))
elif job=='frames':
    for S in A['shots']:
        pl=PL[S['name']];up=Vector(pl['up']);vis=set(shown(S))
        for o in made:bpy.data.objects.remove(o,do_unlink=True)
        made=[]
        for o in meshes:o.hide_render=o not in vis
        see(S)
        ctr=Vector(pl['keys'][0][1]['ctr']);d0=Vector(pl['keys'][0][1]['d']);dist0=pl['keys'][0][1]['dist'];R=pl['R']
        if S.get('floor',True):
            bpy.ops.mesh.primitive_plane_add(size=max(dist0,R)*80,location=up*pl['lo']);p=bpy.context.active_object;p.rotation_euler=up.to_track_quat('Z','Y').to_euler();p.data.materials.append(fl);made.append(p)
        side=d0.cross(up).normalized();bk=(d0-d0.dot(up)*up).normalized()
        light('key',ctr+(side*-0.8+bk*0.5+up*1.1).normalized()*R*7,R*4,90*R*R,ctr)
        light('fill',ctr+(side*1.0+bk*0.7+up*0.4).normalized()*R*7,R*5,22*R*R,ctr)
        light('rim',ctr+(side*0.3-bk*1.0+up*0.7).normalized()*R*6,R*3,110*R*R,ctr)
        mir=-(d0-2*d0.dot(up)*up);light('softbox',ctr+mir*dist0*0.6,dist0*0.45,1.6*(dist0*0.6)**2,ctr,False)
        dr=os.path.join(A['dir'],S['name']);os.makedirs(dr,exist_ok=True)
        for t,fn in S['frames']:
            pth=os.path.join(dr,fn)
            if os.path.exists(pth):continue
            pose(S,t);W,dist,lens,fs=camAt(pl,t,up);cam.matrix_world=W;cd.lens=lens;cd.clip_start=dist/100;cd.clip_end=dist*50
            cd.dof.use_dof=True;cd.dof.focus_distance=dist;cd.dof.aperture_fstop=fs;cd.dof.aperture_blades=7
            s.render.filepath=pth+'.tmp.png';t1=time.time();bpy.ops.render.render(write_still=True);os.replace(pth+'.tmp.png',pth)
            print('rendered',S['name'],fn,round(time.time()-t1,2),'s',flush=True)
'''

def run_blender(work,args,log=None):
    js=work/f"job_{args['job']}.json";js.write_text(json.dumps(args),encoding='utf-8');sp=work/'movie_scene.py';sp.write_text(SCENE,encoding='utf-8')
    p=subprocess.Popen([blender(),'-b','--factory-startup','--python-exit-code','1','-P',str(sp),'--',str(js)],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,encoding='utf-8',errors='replace')
    lf=open(log,'a',encoding='utf-8') if log else None;tail=[]
    for l in p.stdout:
        tail=(tail+[l])[-60:]
        if lf:lf.write(l);lf.flush()
        if l.startswith(('rendered','planned','device','imported')) or 'Error' in l:print(' ',l.rstrip(),flush=True)
    if p.wait():print(''.join(tail));sys.exit('Blender failed')

def base(work,size,engine='eevee',samples=64):
    hdri=str(next(pathlib.Path(blender()).parent.glob('*/datafiles/studiolights/world/studio.exr')))
    return dict(glb=str(work/'wempe_movie.glb'),hdri=hdri,cfps=CFPS,size=list(size),engine=engine,samples=samples,band=BAND)

def pick(only):return [S for S in SHOTS if not only or S['name'] in only.split(',')]

# ---- the narration (the owner's choice, 3 November 2026: an English voice, British, male; the captions kept): Kokoro, offline, its voice VOICE; each line [shot s, text],
# spoken shorter than its caption (about 2.6 words a second), the same facts and sources as the captions beside each shot. [word](/phonemes/) spells a German word out
VOICE='bm_george';VSPEED=1.0
WEMPE='[Wempe](/vˈɛmpə/) [Einheits](/ˈInhIts/)-Chronometer'
SAY={'open':[[0.6,f"This is the {WEMPE}: Germany's standard marine chronometer, designed in Hamburg in the early nineteen-forties."]],
 'sea':[[0.6,'At sea, the bowl hangs level in its gimbals.'],[4.2,'Longitude comes from Greenwich time: four seconds of error is a nautical mile at the equator.']],
 'dial':[[0.5,'The seconds hand steps every half second: seventy-two hundred beats an hour.'],[6.6,'The small hand above shows how far it has run down.']],
 'face':[[0.6,'Under the dial, the motion work turns the hands: the minute hand once an hour, and the hour hand twelve times slower.']],
 'wind':[[0.6,'It is wound with a key, the bowl turned over in its gimbals.'],[7.0,'Wound to the stop, it runs fifty-six hours.']],
 'maint':[[0.6,"While it is wound, Harrison's maintaining work keeps it going."],[5.6,'A detent holds the ratchet, and a spring drives the train.']],
 'stop':[[0.5,'At full wind, the chain presses the stop bar against its pin, and the key turns no further.'],[7.2,'Beside it, a ratchet and click keep the mainspring set up.']],
 'apart':[[1.0,'Inside are the power, a train of wheels, the escapement, and the balance.']],
 'fusee':[[0.6,'The mainspring in its barrel pulls a chain off the cone-shaped fusee.'],[6.6,'A short lever for the strong spring, a long one for the weak: the drive stays even.']],
 'train':[[0.8,'The fusee drives the centre, intermediate and seconds wheels, and they the escape wheel.']],
 'train2':[[0.6,'The escape wheel moves one tooth a beat. The seconds wheel turns once a minute; the centre wheel once an hour.']],
 'beat':[[0.4,"One beat, slowed right down. The detent's stone holds the escape wheel."],[5.2,"The balance's jewel pushes the gold spring, and lifts the detent."],   # the wheel free at 7.7 s
         [9.8,'A tooth gives the balance its push.'],[12.5,'The detent falls back and locks the next tooth. Swinging back, the jewel passes freely.']],   # the tick at 10.0, locked at 12.2
 'balance':[[0.6,'The balance and its hairspring set the rate.'],[4.6,'Its cut bimetallic rim opens and closes with the heat, to keep that rate the same.']],
 'end':[[0.8,'Explore it in 3D, at marine chronometer model dot com.']]}
def voice(work,name=VOICE):
    """each line of SAY spoken (cached by its text and voice in WORK/voice), at SR; prints each line's length against the room before the next"""
    import numpy as np,hashlib,soundfile as sf;from scipy.signal import resample_poly
    vd=work/'voice';vd.mkdir(exist_ok=True);pipe=None;out={};T0=0
    for S in SHOTS:
        L=SAY.get(S['name'],[])
        for j,(t0,txt) in enumerate(L):
            f=vd/(hashlib.sha1(f'{name} {VSPEED} {txt}'.encode()).hexdigest()[:16]+'.wav')
            if not f.exists():
                if pipe is None:
                    from kokoro import KPipeline;pipe=KPipeline(lang_code='b')
                a=np.concatenate([np.asarray(x[2]) for x in pipe(txt,voice=name,speed=VSPEED)]);sf.write(str(f),a,24000)
            a,_=sf.read(str(f));a=resample_poly(a,SR,24000);nz=np.nonzero(np.abs(a)>0.01*np.abs(a).max())[0];a=a[max(0,nz[0]-int(0.03*SR)):nz[-1]+int(0.08*SR)];out[(S['name'],j)]=a   # Kokoro's silence at either end cut
            room=(L[j+1][0] if j+1<len(L) else S['dur']-0.3)-t0;d=len(a)/SR
            print(f"  {S['name']:8s} {t0:5.1f} s  {d:4.1f} s of {room:4.1f}  {'OVER ' if d>room else ''}{txt[:60]}")
        T0+=S['dur']
    return out
def duck(aud,vo):
    """the voice over the ticks, which duck to a third under it: the voice's span widened 0.2 s each side, eased over 0.15 s (running filters, not convolutions)"""
    import numpy as np;from scipy.ndimage import maximum_filter1d,uniform_filter1d
    g=uniform_filter1d(maximum_filter1d((np.abs(vo)>1e-3).astype(float),int(0.4*SR)),int(0.15*SR))
    return aud*(1-0.67*g)+0.9*vo/max(1e-9,np.abs(vo).max())
# ---- the sound: app.js's tickSnd (white noise, exp decay 1.8 ms, 30 ms, band-pass 3.4 kHz Q 2.2, gain 0.5), each where the escape wheel passes half a tooth ----
SR=48000
def tick(slow=False):
    import numpy as np;from scipy import signal
    rng=np.random.default_rng(7);n=int(SR*(0.12 if slow else 0.03));t=np.arange(n)/SR
    x=(rng.random(n)*2-1)*np.exp(-t/(0.009 if slow else 0.0018));f0=1700 if slow else 3400
    b,a=signal.iirpeak(f0,2.2,fs=SR);return 0.5*signal.lfilter(b,a,x)
def ticks(S,E):
    """the shot's tick times: the escape wheel's teeth E (every 1/240 s) past each half tooth, as app.js (floor(E-0.5) rising)"""
    out=[];U=[E[0]]
    for e in E[1:]:d=e-U[-1]%15;d-=15*round(d/15);U.append(U[-1]+d)   # unwrapped: the angle comes back modulo a turn, 15 teeth
    if U[-1]<U[0]:U=[-u for u in U]   # forward: the angle's sign is the first sample's axis, either way round
    for i in range(1,len(U)):
        if math.floor(U[i]-0.5)>math.floor(U[i-1]-0.5):out.append(i/240)
    return out

def compose(work,tag,outp,narrate=True):
    import numpy as np;from PIL import Image,ImageDraw,ImageFont,ImageFilter
    from fontTools.ttLib import TTFont
    import imageio_ffmpeg
    fr=work/'frames'/tag;meta=json.loads((fr/'meta.json').read_text());fps=meta['fps'];W,H=meta['size'];pl=json.loads((work/'plan.json').read_text())
    fonts={}
    for nm,src in (('sans','InstrumentSans-normal-400.woff2'),('serif','Spectral-normal-400.woff2'),('serifL','Spectral-normal-300.woff2')):
        ttf=work/(nm+'.ttf')
        if not ttf.exists():f=TTFont(str(ROOT/'vendor'/'fonts'/src));f.flavor=None;f.save(str(ttf))
        fonts[nm]=str(ttf)
    F=lambda nm,px:ImageFont.truetype(fonts[nm],int(px))
    cap1,cap2,ttl1,ttl2=F('sans',H*0.043),F('sans',H*0.036),F('serifL',H*0.075),F('serif',H*0.038)
    band=Image.new('RGBA',(W,H),(0,0,0,0));bd=np.zeros((H,1),np.uint8);y0=int(H*0.70);bd[y0:,0]=(np.linspace(0,1,H-y0)**0.8*150).astype(np.uint8)   # a soft dark band behind the captions
    band=Image.new('RGBA',(W,H),(2,2,3,255));bandA=Image.fromarray(np.repeat(bd,W,1),'L')
    def text(img,lines,y,fonts_,alpha):
        if alpha<=0:return img
        L=Image.new('RGBA',img.size,(0,0,0,0));d=ImageDraw.Draw(L);yy=y
        for s_,f_ in zip(lines,fonts_):
            if not s_:continue
            w_=d.textlength(s_,font=f_);d.text(((W-w_)/2,yy),s_,font=f_,fill=(255,255,255,int(255*alpha)));yy+=f_.size*1.35
        sh=L.split()[3].filter(ImageFilter.GaussianBlur(H*0.006));S_=Image.new('RGBA',img.size,(0,0,0,0));S_.putalpha(sh.point(lambda v:int(v*0.85)))
        img=Image.alpha_composite(img,S_);return Image.alpha_composite(img,L)
    def fade(t,t0,t1,r=0.35):return max(0,min(1,(t-t0)/r,(t1-t)/r))
    # the sound
    total=sum(S['dur'] for S in SHOTS);aud=np.zeros(int(total*SR)+SR);tk,tks=tick(),tick(True);T0=0;srt=[];n=1
    for S in SHOTS:
        if S['tick']:
            for t in ticks(S,pl[S['name']]['E']):
                x=tks if S['tick']=='slow' else tk;i=int((T0+t)*SR);aud[i:i+len(x)]+=x[:len(aud)-i]
        for c in S.get('caps',[]):
            srt.append(f"{n}\n{ts(T0+c[0])} --> {ts(T0+c[1])}\n{c[2]}"+(f"\n{c[3]}" if c[3] else '')+'\n');n+=1
        T0+=S['dur']
    if narrate:   # the voice over the ticks, which duck to a third under it (0.15 s ramps)
        vo=np.zeros_like(aud);T0=0;V=voice(work)
        for S in SHOTS:
            for j,(t0,_) in enumerate(SAY.get(S['name'],[])):a=V[(S['name'],j)];i=int((T0+t0)*SR);vo[i:i+len(a)]+=a[:len(vo)-i]
            T0+=S['dur']
        aud=duck(aud,vo)
    aud=np.clip(aud,-1,1);wav=outp.with_suffix('.wav')
    with wave.open(str(wav),'wb') as wf:wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(SR);wf.writeframes((aud*32767).astype('<i2').tobytes())
    outp.with_suffix('.srt').write_text('\n'.join(srt),encoding='utf-8')
    ff=imageio_ffmpeg.get_ffmpeg_exe()
    p=subprocess.Popen([ff,'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-i',str(wav),'-c:v','libx264','-preset','slow','-crf','16',
        '-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest',str(outp)],stdin=subprocess.PIPE)
    T0=0;black=Image.new('RGBA',(W,H),(3,3,4,255))
    for k,S in enumerate(SHOTS):
        nF=int(round(S['dur']*fps))
        for i in range(nF):
            t=i/fps;pth=fr/S['name']/f'{i:05d}.png'
            img=Image.open(pth).convert('RGBA') if pth.exists() else black.copy()
            if 'title' in S:
                a=fade(t,0.6,S['dur']-(3.8 if S['name']=='open' else 0.2),0.8);img=text(img,S['title'],H*0.815,[ttl1,ttl2],a)
            ca=max([fade(t,c[0],c[1]) for c in S.get('caps',[])]+([fade(t,0.6,S['dur']-(3.8 if S['name']=='open' else 0.2),0.8)] if 'title' in S else [])+[0])
            if ca>0:b_=band.copy();b_.putalpha(bandA.point(lambda v:int(v*ca)));img=Image.alpha_composite(img,b_)
            for c in S.get('caps',[]):img=text(img,[c[2],c[3]],H*0.835,[cap1,cap1],fade(t,c[0],c[1]))
            dip=min(1,(t+0.5/fps)/0.4 if k else (t+0.5/fps)/1.0,(S['dur']-t-0.5/fps)/0.4 if k<len(SHOTS)-1 else (S['dur']-t)/1.5)   # a dip to black between shots
            if dip<1:img=Image.blend(black,img,max(0,dip))
            p.stdin.write(img.convert('RGB').tobytes())
        T0+=S['dur'];print('composed',S['name'],flush=True)
    p.stdin.close();p.wait();print('wrote',outp,'%.1f MB'%(outp.stat().st_size/1048576))
def ts(t):h=int(t//3600);m=int(t%3600//60);s_=t%60;return f'{h:02d}:{m:02d}:{int(s_):02d},{int(round((s_%1)*1000)):03d}'

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('job',choices=['export','plan','stills','render','compose','say']);a.add_argument('--work',default=str(WORK));a.add_argument('--only')
    a.add_argument('--at',default='0.5');a.add_argument('--engine',default='eevee');a.add_argument('--size',default='1280x720');a.add_argument('--fps',type=int,default=30)
    a.add_argument('--samples',type=int);a.add_argument('--tag');a.add_argument('--out');a.add_argument('--no-voice',action='store_true');o=a.parse_args()
    work=pathlib.Path(o.work);work.mkdir(parents=True,exist_ok=True);t0=time.time();size=[int(x) for x in o.size.split('x')]
    samples=o.samples or (64 if o.engine=='eevee' else 128)
    if o.job=='export':asyncio.run(export(work/'wempe_movie.glb'))
    elif o.job=='plan':
        pj=work/'plan.json';old=json.loads(pj.read_text()) if o.only and pj.exists() else {}   # --only: those shots planned again, the rest kept
        run_blender(work,dict(base(work,size),job='plan',shots=pick(o.only),out=str(work/'plan_new.json')))
        old.update(json.loads((work/'plan_new.json').read_text()));pj.write_text(json.dumps(old))
    elif o.job=='stills':
        pl=json.loads((work/'plan.json').read_text());sh=[]
        for S in pick(o.only):
            sh.append(dict(S,frames=[[float(x)*S['dur'],f"{S['name']}_{float(x):.2f}.png"] for x in o.at.split(',')]))
        for S in sh:   # stills are always made again (render keeps its frames)
            for _,fn in S['frames']:(work/'stills'/S['name']/fn).unlink(missing_ok=True)
        run_blender(work,dict(base(work,size,o.engine,samples),job='frames',shots=sh,plan=pl,dir=str(work/'stills')))
        for S in sh:   # one folder per shot: the stills side by side in WORK/stills
            for _,fn in S['frames']:
                src=work/'stills'/S['name']/fn;(work/'stills'/fn).write_bytes(src.read_bytes())
    elif o.job=='render':
        pl=json.loads((work/'plan.json').read_text());tag=o.tag or f'{o.engine}_{size[0]}x{size[1]}_{o.fps}';dr=work/'frames'/tag;dr.mkdir(parents=True,exist_ok=True)
        (dr/'meta.json').write_text(json.dumps(dict(fps=o.fps,size=size,engine=o.engine,samples=samples)))
        sh=[dict(S,frames=[[i/o.fps,f'{i:05d}.png'] for i in range(int(round(S['dur']*o.fps)))]) for S in pick(o.only)]
        run_blender(work,dict(base(work,size,o.engine,samples),job='frames',shots=sh,plan=pl,dir=str(dr)),log=dr/'render.log')
    elif o.job=='compose':
        tag=o.tag;outp=pathlib.Path(o.out) if o.out else work.parent/f'wempe_movie_{tag}.mp4';compose(work,tag,outp,not o.no_voice)
    elif o.job=='say':voice(work)   # the narration spoken and timed, without the frames
    print(f'{o.job} done in {time.time()-t0:.0f} s')
if __name__=='__main__':main()
