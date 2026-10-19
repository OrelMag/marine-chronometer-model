"""Pack the 3D viewer's data (PLAN-motion-3d.md, phase 5): motion3d.py's geometry and samples, motion3d_fe.py's stress, motion3d_springs.py's and motion3d_kin.py's
results and the transmission runs, into r_motion3d/<model>/pack/ for the viewer (tools/motion3d_viewer.html, published beside them). numpy; no browser.

    python motion3d_pack.py --model wempe [--frames 2500]   # a few seconds

Writes geom.bin (the solids, as motion3d.py wrote them), samp.bin (the samples the viewer plays: the hairspring by the balance's angle, the barrel, chain, up-and-down
work and stop by the fusee's turns, the maintaining spring by its lead), v_<version>.bin (each vertex's stress at its part's worst load, in MPa as 16-bit, then each run's
frames: every body's angle and every element's load, Float32) and meta.json (everything else: the meshes, which body moves each, the samples' index, each version's
parts, springs, kinematics and channels)."""
import json,math,pathlib,sys,base64,shutil
import numpy as np
import model
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
M=model.NAME;D=HERE/'r_motion3d'/M;P=D/'pack';P.mkdir(exist_ok=True);NF=int(arg('--frames',2500))
J=json.loads((D/'meshes.json').read_text());S=json.loads((D/'samples.json').read_text());sb=(D/'samples.bin').read_bytes()
shutil.copyfile(D/'geom.bin',P/'geom.bin')
# which trace body turns each part (the rest is the frame, or moved by the samples)
BODY={'barrel':'barrel','chain':'barrel*','fusee':'fusee','coverPlate':'fusee','dustPlate':'fusee','vorreiber':'fusee','stopWork':'fusee','udPinion':'fusee','fuseeWheel':'fw',
      'maintaining':'ratchet','centreWheel':'centre','cannon':'cannon','changeWheel':'change','hourWheel':'hour','intermediateWheel':'inter','secondsWheel':'sec',
      'escapeWheel':'esc','udWheel':'ud','maintDetent':'maintaining detent','balance':'balance','hairspring':'balance','rollers':'balance','detent':'detent'}
HANDS={'hands.minute':'cannon','hands.hour':'hour','hands.seconds':'sec','hands.ud':'ud'}
meshes=[]
for m in J['meshes']:
    pk=m['pk'] or m['part'];body=HANDS.get(pk) or BODY.get(m['part'])
    if m['part']=='maintaining' and pk=='maintaining.clicks':body='ratchet'   # the clicks ride the ratchet, and turn on their own pivots by the run's click angles (the viewer)
    ax=None
    for k in ('E','th','lift','winding'):
        f=(m.get('drv') or {}).get(k)
        if f and f['kind']=='turn':ax={'pt':f['pt'],'s':1 if f['ax'][1]>0 else -1,'by':k};break
    meshes.append({'id':m['id'],'part':m['part'],'pk':pk,'hn':m['hn'],'col':m['mat0'],'metal':m['metal'],'mat':m['mat'],'box':m['box'],'pos':m['pos'],'idx':m['idx'],'nv':m['nv'],
                   'body':body,'ax':ax,'frame':m['page'][0]=='full' and body is None})
# the samples the viewer plays
out=bytearray();samp={}
def put(a):
    global out;o=len(out);b=np.asarray(a,'<f4').tobytes();out+=b;return [o,len(b)//4]
for key,ent in S.items():
    k=key.split('@')[0]
    if k not in('th','n','ms'):continue
    vals=ent['vals'];ids=ent['ids'];o,cnt=ent['mats'];mats=np.frombuffer(sb,'<f4',cnt,o).reshape(len(vals),len(ids),16)
    keep=[j for j,i in enumerate(ids) if (k=='n' and J['meshes'][i]['part'] in('barrel','chain','udWheel','hands','stopWork')) or (k=='ms' and J['meshes'][i]['part'] in('maintaining','maintDetent'))]
    e={'vals':vals,'ids':[ids[j] for j in keep],'mats':put(mats[:,keep,:]) if keep else None,'geo':{}}
    for i,(go,nn,nv) in ent['geo'].items():
        part=J['meshes'][int(i)]['part']
        if (k=='th' and part=='hairspring') or (k=='ms' and part=='maintaining'):e['geo'][i]=put(np.frombuffer(sb,'<f4',nn*nv,go))+[nn,nv]
    samp[key]=e
(P/'samp.bin').write_bytes(bytes(out))
# each version: its parts' stress (16-bit MPa at every vertex of the parts solved), its results, and its runs thinned to NF frames each (the trace's own steps kept in proportion)
dec=lambda b:np.frombuffer(base64.b64decode(b),'<f4')
vers={}
for v in ('last','build'):
    if not (D/f'stress_{v}.json').exists():continue
    st=json.loads((D/f'stress_{v}.json').read_text());sbin=(D/f'stress_{v}.bin').read_bytes();sidx=json.loads((D/f'stress_{v}.idx.json').read_text())
    buf=bytearray();sv={}
    for i,(o,n) in sidx.items():
        a=np.frombuffer(sbin,'<f4',n,o);q=np.clip(np.round(a),0,65535).astype('<u2');sv[i]=[len(buf),n];buf+=q.tobytes()
        while len(buf)%4:buf+=bytes(2)
    s=(D/f'trace_{v}.js').read_text(encoding='utf-8');T=json.loads(s[s.index('{'):s.rstrip().rindex('}')+1]);runs=[]
    for r in T['S']:
        n=int(r['n']);j=np.unique(np.linspace(0,n-1,min(NF,n)).round().astype(int));t=(dec(r['t'])+r.get('t0',0))[j]
        ch={'t':None};o=len(buf);buf+=np.asarray(t,'<f4').tobytes();ch['t']=[o,len(j)]
        bodies={}
        for nm,bd in r['bodies'].items():
            q=(dec(bd['kin']).astype(float)+bd['q0'])[j];dv=dec(bd['dev'])[j];o=len(buf);buf+=np.asarray(q,'<f4').tobytes()+np.asarray(dv,'<f4').tobytes();bodies[nm]=[o,len(j)]
        forces={}
        for nm,b in r['forces'].items():
            a=dec(b)[j];o=len(buf);buf+=np.asarray(a,'<f4').tobytes();forces[nm]=[o,len(j)]
        runs.append({'name':r['name'],'kind':r['kind'],'n':len(j),'t':ch['t'],'bodies':bodies,'forces':forces})
    (P/f'v_{v}.bin').write_bytes(bytes(buf))
    vers[v]={'stress':sv,'parts':st['parts'],'runs':runs,'springs':json.loads((D/f'springs_{v}.json').read_text()),'kin':json.loads((D/f'kin_{v}.json').read_text()),'ref':T['meta']['ref']}
meta={'model':M,'meshes':meshes,'samples':samp,'versions':vers,'geo':json.loads(json.dumps(T['meta']['geo'])),'made':__import__('datetime').date.today().isoformat()}
(P/'meta.json').write_text(json.dumps(meta,separators=(',',':')))
sz={f.name:f.stat().st_size for f in P.iterdir()}
print(f'{M}: '+', '.join(f'{k} {v/1e6:.1f} MB' for k,v in sz.items())+f'; versions {list(vers)}')
