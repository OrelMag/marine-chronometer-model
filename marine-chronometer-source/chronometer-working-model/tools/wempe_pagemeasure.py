"""wempe_pagemeasure.py: the Wempe page's own meshes measured, for the parts no recipe builds (strips, the chain, the band, bought and box parts) and for
the assembly sheets (where each part stands in the movement): the other half of wempe_measure.py, for the audit against the works drawings
(WEMPE-PARTS-LEDGER.md). About two minutes (two loads of the page).

    python wempe_pagemeasure.py [--lines hn,hn,...] [--out DIR]     (DIR default tools/r_wpa/page/, ignored)

placements.json   every parts-list line shown in the version as last revised (the page frozen in recipes.py's POSE): its first mesh's root origin and the
                  directions of its local X, Y, Z in the movement frame (dial side +y, 12 o'clock -z, 3 o'clock +x; the case parts in the box's frame), and
                  the world box of all its meshes. For reading an assembly sheet's stack, centres and heights.
HN.json, HN.png   for each line in --lines (default LINES below): its meshes in its root's frame (Y the page's axis, the dial side up), the box, the volume
                  where closed, the levels of its faces square to Y, sections square to Y at the middle of each level's slab with their loops (a loop that
                  fits a circle within 0.005 mm given as one: centre, diameter), and rays from the axis along eight directions at mid height: every surface
                  crossed (a coiled strip's coils, a band's turns), with the strip's thickness and the coils' pitch read off them."""
import argparse,asyncio,base64,json,math,pathlib,sys
import numpy as np
import model
HERE=pathlib.Path(__file__).resolve().parent
import importlib.util
sp=importlib.util.spec_from_file_location('recipes_cli',HERE/'recipes.py');R=importlib.util.module_from_spec(sp);sp.loader.exec_module(R)
def r4(x):return round(float(x),4)
import wempe_parts_ledger as _WL
LINES=list(dict.fromkeys(h for row in _WL.S for h in row[6]))   # every page line the audit's sheet table names

PLACE="""()=>{const mv=window.__mv,out=[],seen=new Set(),v=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
  const shows=o=>{for(let p=o;p;p=p.parent)if(p.userData.rev&&mv.userData.revShows&&!mv.userData.revShows(p.userData.rev,'last')||p.userData.shut==='book'||p.visible===false)return false;return true;};
  const scan=(root,frame)=>{root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert();
    root.traverse(o=>{const h=o.userData.hn;if(!h||o.userData.sub||seen.has(h)||!shows(o))return;seen.add(h);
      const m=inv.clone().multiply(o.matrixWorld);m.decompose(v,q,s);const ax=[new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)].map(a=>a.applyQuaternion(q).toArray().map(x=>+x.toFixed(4)));
      const bb=new THREE.Box3();root.traverse(p=>{if(p.isMesh&&p.userData.hn===h&&shows(p)&&p.geometry){p.geometry.computeBoundingBox();const b=p.geometry.boundingBox.clone().applyMatrix4(inv.clone().multiply(p.matrixWorld));bb.union(b);}});
      out.push({hn:h,frame,origin:v.toArray().map(x=>+x.toFixed(4)),axes:{x:ax[0],y:ax[1],z:ax[2]},box:bb.isEmpty()?null:[...bb.min.toArray(),...bb.max.toArray()].map(x=>+x.toFixed(4))});});};
  scan(mv,'movement');if(window.__BX&&window.__BX.root)scan(window.__BX.root,'box');return out;}"""

async def placements(pose=R.POSE):
    import browser
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page()
        await pg.goto(model.PAGE+'#merge=0',timeout=120000);await pg.wait_for_function("!document.querySelector('#loading')&&window.__V&&window.__mv",timeout=180000);await pg.wait_for_timeout(1500)
        await pg.evaluate("""document.querySelector('#speeds button[data-v="0"]')?.click()""");await pg.evaluate(R.FREEZE+'('+pose+')');await pg.wait_for_timeout(300)
        out=await pg.evaluate(PLACE);await b.close()
    return out

def circ(P):
    """least-squares circle through 2D points: centre, radius, rms"""
    A=np.c_[2*P,np.ones(len(P))];b=(P**2).sum(1);c,*_=np.linalg.lstsq(A,b,rcond=None);r=math.sqrt(max(c[2]+c[0]**2+c[1]**2,0));return c[:2],r,float(np.sqrt(np.mean((np.hypot(*(P-c[:2]).T)-r)**2)))

def measure(hn,ms):
    import trimesh
    parts=R.tm_of(ms)
    if not parts:return None
    T=trimesh.util.concatenate(parts);bb=T.bounds
    J={'hn':hn,'units':'mm','frame':"the part's root frame on the page: Y its axis (the dial side +Y)",'meshes':len(ms),'bodies':len(parts),
       'box':[r4(x) for x in bb.ravel()],'size':[r4(x) for x in bb[1]-bb[0]],'volume_mm3':r4(sum(abs(p.volume) for p in parts)) if all(p.is_watertight for p in parts) else None}
    n=T.face_normals;cy=T.triangles_center[:,1];lv={}
    for i in np.nonzero(np.abs(n[:,1])>0.999)[0]:k=round(float(cy[i]),3);lv[k]=lv.get(k,0)+float(T.area_faces[i])
    ys=sorted(k for k,a in lv.items() if a>1e-3)
    if len(ys)>60:ys=sorted(sorted(ys,key=lambda k:-lv[k])[:20])   # a helix's countless slivers: the 20 largest faces' levels
    J['y_levels']=ys
    S=[];yy=sorted(set(ys)|{bb[0][1],bb[1][1]})
    mids=[(a+b)/2 for a,b in zip(yy,yy[1:]) if b-a>0.01] or [(bb[0][1]+bb[1][1])/2]
    for y in mids[:12]:
        sec=T.section(plane_origin=[0,y,0],plane_normal=[0,1,0])
        if sec is None:continue
        loops=[]
        for d in sec.discrete:
            P=np.c_[d[:,0],d[:,2]]
            if len(P)<4:continue
            c,r,rms=circ(P);L=float(np.sum(np.hypot(*np.diff(P,axis=0).T)))
            loops.append({'circle':{'c_xz':[r4(c[0]),r4(c[1])],'d':r4(2*r)}} if rms<0.005 else {'points':len(P),'length':r4(L),'x':[r4(P[:,0].min()),r4(P[:,0].max())],'z':[r4(P[:,1].min()),r4(P[:,1].max())]})
        S.append({'y':r4(y),'loops':sorted(loops,key=lambda l:-(l['circle']['d'] if 'circle' in l else l['length']))[:40],'n_loops':len(loops)})
    J['sections_square_to_Y']=S
    ym=(bb[0][1]+bb[1][1])/2;rays=[]
    for k in range(8):
        a=k*math.pi/4;d=np.array([math.cos(a),0,-math.sin(a)])
        try:loc,_,_=T.ray.intersects_location([[0,ym,0]],[d])
        except Exception:loc=np.zeros((0,3))
        t=sorted(round(float(np.dot(p-[0,ym,0],d)),4) for p in loc)
        th=[r4(t[i+1]-t[i]) for i in range(0,len(t)-1,2)];pitch=[r4(t[i+2]-t[i]) for i in range(0,len(t)-2,2)]
        rays.append({'deg_from_x_toward_minus_z':k*45,'hits':t,'strip_thickness':th,'coil_pitch':pitch})
    J['rays_from_axis_at_mid_height']=rays
    ax=[]   # rays parallel to Y at the radius where the radial rays first met the part: a helix's or a stack's turns, and their pitch along Y
    for k in range(4):
        a=k*math.pi/2;h=rays[2*k]['hits']
        if len(h)<2:continue
        r=(h[0]+h[1])/2;o=np.array([r*math.cos(a),bb[0][1]-1,-r*math.sin(a)])
        try:loc,_,_=T.ray.intersects_location([o],[[0,1,0]])
        except Exception:loc=np.zeros((0,3))
        t=sorted(round(float(p[1]),4) for p in loc);w=[r4(t[i+1]-t[i]) for i in range(0,len(t)-1,2)];c=[(t[i]+t[i+1])/2 for i in range(0,len(t)-1,2)]
        ax.append({'deg_from_x_toward_minus_z':k*90,'radius':r4(r),'turns_crossed':len(w),'strip_heights':w,'pitch_along_Y':[r4(c[i+1]-c[i]) for i in range(len(c)-1)],'y_of_turns':[r4(x) for x in c]})
    J['rays_along_Y_at_the_strip']=ax
    return J,T

def draw(hn,T,png):
    import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
    fig,ax=plt.subplots(1,2,figsize=(18,8.5));bb=T.bounds
    for a,(i,j,lab) in zip(ax,[(0,2,'plan seen along Y from +Y: x right, z down (mm)'),(0,1,'side: x right, y up (mm)')]):
        e=T.edges_unique;ang=T.face_adjacency_angles;fe=T.face_adjacency_edges[ang>math.radians(25)]
        for u,w in fe:a.plot([T.vertices[u][i],T.vertices[w][i]],[T.vertices[u][j],T.vertices[w][j]],'k-',lw=0.35)
        if j==2:a.invert_yaxis()
        a.set_aspect('equal');a.grid(True,lw=0.3);a.minorticks_on();a.grid(True,which='minor',lw=0.1,color='#ccc');a.set_title(f'{hn}: {lab}',fontsize=9)
    fig.tight_layout();fig.savefig(png,dpi=110);plt.close(fig)

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--lines');a.add_argument('--out',default=str(HERE/'r_wpa'/'page'));a.add_argument('--model',default='wempe');a.add_argument('--no-place',action='store_true');o=a.parse_args()
    out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True)
    if not o.no_place:
        P=asyncio.run(placements());(out/'placements.json').write_text(json.dumps(P,indent=0,ensure_ascii=False),encoding='utf-8');print(f'{len(P)} lines placed')
    hns=o.lines.split(',') if o.lines else LINES
    pm=asyncio.run(R.page_meshes(hns))
    for h in hns:
        v=pm.get(h)
        if not v or not v['meshes']:print(f'{h:16s} not shown');continue
        J,T=measure(h,v['meshes']);f=h.replace('/','_')
        (out/f'{f}.json').write_text(json.dumps(J,indent=1,ensure_ascii=False),encoding='utf-8');draw(h,T,out/f'{f}.png')
        print(f"{h:16s} size {J['size']} levels {len(J['y_levels'])} coils/hits {[len(r['hits']) for r in J['rays_from_axis_at_mid_height']][:4]}")
if __name__=='__main__':main()
