"""The export to Blender (js/blender.js, js/gltf.js) checked: the page's own export, through ?qa's __glb(), written to r_model21.glb (the current directory)
and read back here, with no Blender. About 2 minutes (most of it the headless browser encoding the textures).

    python gltf_check.py              # export, then check the file
    python gltf_check.py --file F     # check a .glb already written (no browser)
    python gltf_check.py --model wempe   # the Wempe's export (wempe/js/blender.js) to r_wempe.glb, its clips and parts from wempe/checks.py (GLTF)

Checks: the GLB's header and chunks; every accessor inside its buffer view and every view inside the buffer, with the counts its type needs; POSITION accessors'
min and max; indices in range; normals of unit length; every node, mesh, material, texture and channel reference valid; the node tree a tree (each node one parent,
the scene's roots none); node names unique; every animation's times rising, its rotations unit quaternions, its weights as many per key as the mesh has targets;
the clips the page names all there, each with channels; the parts the movement is built of all named among the nodes. Where the page has the STL export too (?qa's __stl:
the Wempe's), the movement's STL and the model's chosen parts' (GLTF['stl']): the header's count against the file's length, unit normals, the size it spans (mm), and each
solid closed (every edge, its ends welded at 1 µm, in an even number of triangles). Exit code 1 on a failure."""
import asyncio,base64,browser,json,math,model,pathlib,struct,sys
import numpy as np
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(model.DIR/'index.html').as_uri()+'?qa'+('' if model.HAMILTON else '&start=movement')   # not ?snap: the page then idles while the export runs, instead of drawing every frame
CT={5126:('f4',4),5125:('u4',4),5123:('u2',2),5121:('u1',1)};NC={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
CLIPS=['Running','Beat (slow motion)','Run down','Winding','Setting the hands','Stop and start','Exploded','Laid out','Lift out','Lids','Latch','At sea',
       'Rig · beat','Rig · explode','Rig · laid out','Rig · lift','Rig · lids','Rig · latch']
PARTS=['escW','fw','tw','cw','bal','det','spr','fs','gw','hands','motion','pillar','trainBridge','barrelBridge','cock','lockArm','dial']   # the parts' keys, each a node named "... (key)"
G=model.cfg('GLTF',{});CLIPS=G.get('clips',CLIPS);PARTS=G.get('parts',PARTS);GLB=G.get('glb','r_model21.glb')
async def export(out):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.on("console",lambda m:errs.append(m.text) if m.type in('error','warning') and 'GPU stall' not in m.text and 'swiftshader' not in m.text.lower() else None)
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        async with pg.expect_download(timeout=1800000) as d:st=await pg.evaluate("__glb()")
        await (await d.value).save_as(out)
        print('exported',out.name,'%.1f MB'%(out.stat().st_size/1048576),st)
        if await pg.evaluate("typeof __stl==='function'"):
            for k in[None]+G.get('stl',[]):
                s64=await pg.evaluate('__stl(%s)'%('' if k is None else json.dumps(k)));STL.append((k or 'movement',base64.b64decode(s64) if s64 else b''))
        await b.close()
    return errs
STL=[]   # (name, bytes): the STLs the page gave
def stl_check(name,B,fail):
    """a binary STL: its count against its length, unit normals, the span (mm), and closed: every edge (its ends welded at 1 µm) in an even number of triangles"""
    if len(B)<84:fail('STL %s: empty'%name);return
    n=struct.unpack_from('<I',B,80)[0]
    if len(B)!=84+50*n:fail('STL %s: %d triangles in the header, %d bytes'%(name,n,len(B)));return
    T=np.frombuffer(B,dtype=np.dtype([('n','<f4',3),('v','<f4',(3,3)),('a','<u2')]),count=n,offset=84);V=T['v'].astype(np.float64)
    ln=np.linalg.norm(T['n'],axis=1);deg=np.linalg.norm(np.cross(V[:,1]-V[:,0],V[:,2]-V[:,0]),axis=1)<1e-10
    if (np.abs(ln[~deg]-1)>1e-3).any():fail('STL %s: normals not unit'%name)
    K=np.round(V.reshape(-1,3)*1000).astype(np.int64);_,ids=np.unique(K,axis=0,return_inverse=True);ids=ids.reshape(-1,3)
    E=np.sort(np.concatenate([ids[:,[0,1]],ids[:,[1,2]],ids[:,[2,0]]]),axis=1);E=E[E[:,0]!=E[:,1]];_,cnt=np.unique(E,axis=0,return_counts=True);odd=int((cnt%2).sum())
    if odd:fail('STL %s: %d edges in an odd number of triangles (open)'%(name,odd))
    lo,hi=V.reshape(-1,3).min(0),V.reshape(-1,3).max(0)
    print('  STL %-12s %8d triangles, %6.1f x %6.1f x %6.1f mm, %d open edges'%(name,n,*(hi-lo),odd))
def check(path):
    bad=[];B=path.read_bytes();fail=lambda m:bad.append(m)
    for nm,b in STL:stl_check(nm,b,fail)
    mg,ver,ln=struct.unpack_from('<III',B,0)
    if mg!=0x46546C67 or ver!=2 or ln!=len(B):fail('header: magic %x version %d length %d of %d'%(mg,ver,ln,len(B)))
    jl,jt=struct.unpack_from('<II',B,12);J=json.loads(B[20:20+jl]);o=20+jl;bl,bt=struct.unpack_from('<II',B,o);BIN=B[o+8:o+8+bl]
    if jt!=0x4E4F534A or bt!=0x004E4942:fail('chunk types');
    if J['buffers'][0]['byteLength']!=bl:fail('buffer length %d, BIN chunk %d'%(J['buffers'][0]['byteLength'],bl))
    for i,v in enumerate(J['bufferViews']):
        if v['byteOffset']+v['byteLength']>bl:fail('view %d past the buffer'%i)
        if v['byteOffset']%4:fail('view %d not aligned'%i)
    def arr(a):
        A=J['accessors'][a];v=J['bufferViews'][A['bufferView']];dt,sz=CT[A['componentType']];n=A['count']*NC[A['type']]
        if n*sz>v['byteLength']:fail('accessor %d: %d values past its view'%(a,n));return np.zeros(0)
        return np.frombuffer(BIN,dtype='<'+dt,count=n,offset=v['byteOffset']+A.get('byteOffset',0)).reshape(A['count'],NC[A['type']])
    N=J['nodes'];M=J['meshes'];par={}
    for i,n in enumerate(N):
        for c in n.get('children',[]):
            if c>=len(N):fail('node %d: child %d'%(i,c))
            elif c in par:fail('node %d has two parents'%c)
            else:par[c]=i
        if 'mesh' in n and n['mesh']>=len(M):fail('node %d: mesh %d'%(i,n['mesh']))
        r=n.get('rotation');
        if r and abs(math.hypot(*r)-1)>1e-4:fail('node %d rotation not unit'%i)
    for r in J['scenes'][0]['nodes']:
        if r in par:fail('root %d has a parent'%r)
    names=[n.get('name','') for n in N];dup={x for x in names if names.count(x)>1} if len(names)<20000 else set()
    if dup:fail('node names not unique: %s'%sorted(dup)[:8])
    tris=0
    for mi,m in enumerate(M):
        for p in m['primitives']:
            P=arr(p['attributes']['POSITION']);A=J['accessors'][p['attributes']['POSITION']]
            if 'min' not in A or not np.allclose(P.min(0),A['min'],atol=1e-5) or not np.allclose(P.max(0),A['max'],atol=1e-5):fail('mesh %d: POSITION min/max'%mi)
            Nn=arr(p['attributes']['NORMAL'])
            if len(Nn)!=len(P) or (len(Nn) and np.abs(np.linalg.norm(Nn,axis=1)-1).max()>1e-3):fail('mesh %d (%s): normals'%(mi,m.get('name')))
            if 'TEXCOORD_0' in p['attributes'] and len(arr(p['attributes']['TEXCOORD_0']))!=len(P):fail('mesh %d: uv count'%mi)
            if 'indices' in p:
                I=arr(p['indices']).ravel()
                if len(I)%3 or (len(I) and I.max()>=len(P)):fail('mesh %d: indices'%mi)
                tris+=len(I)//3
            else:tris+=len(P)//3
            if 'material' in p and p['material']>=len(J['materials']):fail('mesh %d: material'%mi)
            for t in p.get('targets',[]):
                if len(arr(t['POSITION']))!=len(P):fail('mesh %d: a target\'s count'%mi)
    for i,m in enumerate(J['materials']):
        for k in('baseColorTexture',):
            t=m['pbrMetallicRoughness'].get(k)
            if t and t['index']>=len(J.get('textures',[])):fail('material %d: texture'%i)
    for t in J.get('textures',[]):
        im=J['images'][t['source']];v=J['bufferViews'][im['bufferView']]
        if BIN[v['byteOffset']:v['byteOffset']+8]!=b'\x89PNG\r\n\x1a\n':fail('image not PNG')
    have={a['name']:a for a in J.get('animations',[])}
    for c in CLIPS:
        if c not in have:fail('clip missing: '+c)
        elif not have[c]['channels']:fail('clip without channels: '+c)
    for a in J.get('animations',[]):
        for ch in a['channels']:
            s=a['samplers'][ch['sampler']];t=arr(s['input']).ravel();v=arr(s['output']);node=ch['target']['node']
            if node>=len(N):fail('%s: channel to node %d'%(a['name'],node));continue
            if len(t)>1 and (np.diff(t)<0).any():fail('%s: times not rising (%s)'%(a['name'],N[node].get('name')))
            pth=ch['target']['path'];
            if pth=='rotation' and len(v) and np.abs(np.linalg.norm(v,axis=1)-1).max()>1e-3:fail('%s: rotation not unit (%s)'%(a['name'],N[node].get('name')))
            if pth=='weights':
                k=len(M[N[node]['mesh']]['primitives'][0].get('targets',[]))
                if v.size!=len(t)*k:fail('%s: weights %d for %d keys of %d targets'%(a['name'],v.size,len(t),k))
            elif len(v)!=len(t):fail('%s: %d values for %d times'%(a['name'],len(v),len(t)))
    for k in PARTS:
        if not any(n.get('name','').endswith('(%s)'%k) for n in N):fail('no node for the part '+k)
    nch=sum(len(a['channels']) for a in J.get('animations',[]))
    print('%s: %.1f MB, %d nodes, %d meshes, %d triangles, %d materials, %d textures, %d animations (%d channels), extensions %s'%(path.name,len(B)/1048576,len(N),len(M),tris,len(J['materials']),len(J.get('textures',[])),len(have),nch,J.get('extensionsUsed',[])))
    for a in J.get('animations',[]):print('  %-20s %5d channels'%(a['name'],len(a['channels'])))
    return bad
def main():
    a=sys.argv[1:];out=pathlib.Path(GLB);errs=[]
    if '--file' in a:out=pathlib.Path(a[a.index('--file')+1])
    else:errs=asyncio.run(export(out))
    bad=check(out)+['page: '+e for e in errs]
    for b in bad[:60]:print('FAIL',b)
    print('%d failures'%len(bad));sys.exit(1 if bad else 0)
main()
