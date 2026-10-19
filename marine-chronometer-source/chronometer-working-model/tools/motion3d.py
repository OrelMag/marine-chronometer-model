"""Every moving part measured on the page itself: its geometry, and how update()'s inputs move it (PLAN-motion-3d.md, phase 1-2). Playwright, numpy.

    python motion3d.py --model wempe [--out r_motion3d/wempe]   # about 3-5 minutes

Opens the page (?snap&qa#drive=1: the mainspring and hairspring built) and runs motion3d-page.js in it. Writes into --out:
  geom.bin      every mesh shown at the base state: its positions quantised to 16 bits within its own box, then its indices (16 or 32 bits), mesh after mesh
  meshes.json   each mesh: part, piece, parts-list line, its matrix into the movement's frame (mm; dial side +y), its box, offsets into geom.bin; and, for each input
                that moves it, the move fitted as a turn about a fixed axis (unit axis, a point on it, rad per unit of the input, the fit's miss in mm) or 'other'
  samples.bin / samples.json   the inputs that move parts nonlinearly sampled over their range: each moved mesh's matrix at each sample, and the reshaped meshes'
                positions (the hairspring with the balance's angle, the gold spring with its bend, the maintaining spring with its lead)
Prints the bodies found (meshes turning together about one axis at one rate) with their rates, which kinematics.py checks against the tooth counts.
The base state: the escape wheel at 1000 teeth, the balance at rest (th 0), the detent home, the fusee 4 turns from full wind, running."""
import json,math,pathlib,struct,sys,time
import numpy as np
from playwright.sync_api import sync_playwright
import browser,model
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
M=model.NAME   # model.py strips --model NAME from the arguments
PAGE=(model.DIR/'index.html').resolve().as_uri()+'?snap&qa#drive=1'
OUT=pathlib.Path(arg('--out',str(HERE/'r_motion3d'/M)));OUT.mkdir(parents=True,exist_ok=True)
# the inputs nudged, each by a small step from the base state
NUDGE=[('E',0.02),('th',0.02),('lift',0.002),('psDef',0.002),('n',0.002),('ms',0.002)]
# the nonlinear inputs sampled over their range (the balance swings to about 120 deg; the fusee 0 to 8.64 turns; the detent's lift and the gold spring's bend over makeEsc's)
SAMPLE={'th':np.linspace(-2.3,2.3,47),'n':np.linspace(0,8.6,87),'lift':np.linspace(0,0.06,7),'psDef':np.linspace(0,0.25,11),'ms':np.linspace(0,0.32,9)}
TOLP=1e-4   # mm: a mesh moved less than this hasn't moved

def fit(m0,m1):
    """the move from matrix m0 to m1 (4x4, column-major lists, movement frame) as a turn about a fixed axis: (axis, point, angle, miss) or None if it didn't move"""
    A=np.array(m0).reshape(4,4).T;B=np.array(m1).reshape(4,4).T;T=B@np.linalg.inv(A);R=T[:3,:3];t=T[:3,3]
    if np.abs(R-np.eye(3)).max()<1e-7 and np.abs(t).max()<TOLP:return None
    c=max(-1,min(1,(np.trace(R)-1)/2));ang=math.acos(c)
    if ang<1e-9:return {'kind':'slide','t':t.tolist()}
    ax=np.array([R[2,1]-R[1,2],R[0,2]-R[2,0],R[1,0]-R[0,1]]);ax/=np.linalg.norm(ax)
    # a point on the axis: (I - R) p = t in the plane normal to the axis (least squares), the slide along the axis is the miss
    p,*_=np.linalg.lstsq(np.eye(3)-R,t-ax*(ax@t),rcond=None);p-=ax*(ax@p)
    return {'kind':'turn','ax':ax.tolist(),'pt':p.tolist(),'ang':ang,'slide':float(ax@t)}

def one(pg,url,keep,buf,sbuf,smp,t0,sample):
    """a pass over the page at url: the meshes keep(m) accepts, their geometry into buf, each input nudged, the nonlinear inputs sampled (if sample) into sbuf/smp"""
    pg.goto(url);pg.wait_for_function('()=>window.__mv&&!document.querySelector("#loading")',timeout=180000);pg.wait_for_timeout(2500)
    pg.evaluate((HERE/'motion3d-page.js').read_text(encoding='utf-8'))
    allm=pg.evaluate('__m3d.base()');meshes=[m for m in allm if keep(m)]
    for m in meshes:
        g=pg.evaluate(f'__m3d.geom({m["id"]})');p=np.array(g['p'],np.float64).reshape(-1,3);lo=p.min(0);hi=p.max(0);sc=np.where(hi-lo>0,(hi-lo)/65535,1)
        q=np.round((p-lo)/sc).astype('<u2');m['box']=[lo.tolist(),hi.tolist()];m['pos']=[len(buf),q.nbytes];buf+=q.tobytes()
        ix=np.array(g['ix'] if g['ix'] is not None else range(len(p)),np.int64);dt='<u2' if len(p)<65536 else '<u4'
        while len(buf)%4:buf+=bytes(1)
        a=ix.astype(dt);m['idx']=[len(buf),a.size,dt[-1]];buf+=a.tobytes()
    ids=[m['id'] for m in meshes]
    pick=lambda r:[r[i] for i in ids]
    base=pick(pg.evaluate('__m3d.at({})'))
    for k,d in NUDGE+[('winding',True)]:
        st={k:(1000+d if k=='E' else d)}
        s=pick(pg.evaluate(f'__m3d.at({json.dumps(st)})'))
        for m,a,c in zip(meshes,base,s):
            f=fit(a['m'],c['m']);rs=a['fp']!=c['fp']
            if f or rs:m.setdefault('drv',{})[k]={**(f or {'kind':'none'}),'rate':(f['ang']/d if f and f['kind']=='turn' and k!='winding' else None),'reshape':rs}
    print(f'{url.split("?")[1]}: {len(meshes)} meshes of {len(allm)}, inputs nudged ({time.time()-t0:.0f} s)',flush=True)
    if sample:
        for k,vals in SAMPLE.items():
            mid=[m['id'] for m in meshes if k in m.get('drv',{})];rsh=[m['id'] for m in meshes if m.get('drv',{}).get(k,{}).get('reshape')]
            if not mid:continue
            mats=[];geo={i:[] for i in rsh}
            for v in vals:
                st={k:float(v)};r=pg.evaluate(f'__m3d.at({json.dumps(st)})');mats.append([r[i]['m'] for i in mid])
                if rsh:
                    for i,gq in zip(rsh,pg.evaluate(f'__m3d.geomAt({json.dumps(st)},{json.dumps(rsh)})')):geo[i].append(gq['p'])
            ent={'vals':vals.tolist(),'pageIds':mid,'mats':[len(sbuf),len(vals)*len(mid)*16],'geo':{},'rebuilt':[]};sbuf+=np.array(mats,'<f4').tobytes()
            for i,ps in geo.items():
                if len({len(x) for x in ps})>1:ent['rebuilt'].append(i);continue   # rebuilt with another vertex count at each sample (the mainspring): the viewer builds it itself
                a=np.array(ps,'<f4');ent['geo'][str(i)]=[len(sbuf),a.shape[0],a.shape[1]];sbuf+=a.tobytes()
            smp[k]=ent;print(f'  {k}: {len(vals)} samples, {len(mid)} meshes moved, {len(rsh)} reshaped ({time.time()-t0:.0f} s)',flush=True)
    return meshes

def main():
    t0=time.time();buf=bytearray();sbuf=bytearray();smp={};smp2={}
    with sync_playwright() as pw:
        b=pw.chromium.launch(args=browser.ARGS)
        w=b.new_page();w.set_content('<canvas></canvas>');w.evaluate("document.querySelector('canvas').getContext('webgl')");w.wait_for_timeout(2000);w.close()   # smoke.py: a throwaway page takes the first context
        pg=b.new_page(viewport={'width':1200,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        # the moving parts' view (#drive=1: the mainspring and hairspring built), then the page as it opens for every part that view hides (the frame, the dial side)
        mov=one(pg,PAGE,lambda m:True,buf,sbuf,smp,t0,True);have={m['part'] for m in mov}
        fr=one(pg,PAGE.split('#')[0],lambda m:m['part'] not in have,buf,sbuf,smp2,t0,True)
        b.close()
    meshes=[]
    for src,ms in (('moving',mov),('full',fr)):
        for m in ms:m['page']=[src,m['id']];m['id']=len(meshes);meshes.append(m)
    for S_,ms in ((smp,mov),(smp2,fr)):
        pid={m['page'][1]:m['id'] for m in ms}
        for ent in S_.values():ent['ids']=[pid[i] for i in ent['pageIds']];ent['geo']={str(pid[int(i)]):v for i,v in ent['geo'].items()};ent['rebuilt']=[pid[i] for i in ent['rebuilt']]
    for k,ent in smp2.items():smp[k+'@full']=ent   # the dial side's and the frame's moving meshes (the up-and-down work, the hands), sampled on the page as it opens
    (OUT/'geom.bin').write_bytes(bytes(buf));(OUT/'samples.bin').write_bytes(bytes(sbuf));(OUT/'samples.json').write_text(json.dumps(smp))
    (OUT/'meshes.json').write_text(json.dumps({'model':M,'base':{'E':1000,'th':0,'lift':0,'psDef':0,'n':4,'winding':False},'meshes':meshes}))
    print(f'geom.bin {len(buf)/1e6:.1f} MB, samples.bin {len(sbuf)/1e6:.1f} MB, {len(meshes)} meshes, {sum((m["ni"] or m["nv"])//3 for m in meshes)/1e6:.2f} M triangles')
    # the bodies: meshes turning together (one input, one axis, one point, one rate)
    for k,_ in NUDGE+[('winding',0)]:
        groups={}
        for m in meshes:
            f=m.get('drv',{}).get(k)
            if not f:continue
            if f['kind']=='turn':key=('turn',tuple(round(abs(x),3) for x in f['ax']),tuple(round(x,2) for x in f['pt']),round(f.get('rate') or 0,5))
            else:key=(f['kind'],'reshaped' if f.get('reshape') else '')
            groups.setdefault(key,set()).add(m['part'])
        print(f'{chr(10)}{k}: {sum(1 for m in meshes if k in m.get("drv",{}))} meshes moved')
        for key,parts in sorted(groups.items(),key=lambda x:str(x[0])):print(f'   {key}: {", ".join(sorted(parts))}')
    print(f'{chr(10)}wrote {OUT} ({time.time()-t0:.0f} s); page errors: {errs or "none"}')
if __name__=='__main__':main()
