"""The Wempe fusee body's small end (05 06 04-2, Schnitt C-D) checked face by face: the stop bar's slot runs straight across the end, 2 H8 wide between two
parallel walls 4 and 6 from the axis, 1,5 +0,05 deep and 1,1 +0,05 toward the bar's upper end, out through the hub and the top turn on both sides. Every triangle of the
body's mesh in the end's last 1.5 (and 0.05 under it) must lie on a face the sheet draws: a flat face square to the axis (the end, the slot's floors, the groove's walls), one
of the slot's two walls (its plane), the shallow part's step across the slot at u 8.0, a turned surface (its normal radial), the radial wall where the groove ends at N,
the stop bar's spring's pin's hole, or the bores and holes inside r 7.5. A triangle on none of them (a slanted face where a piece ends, a fan) is listed with its place in
the slot's frame (u along the slot toward the bar's upper end, v across it from the line through the axis, depth under the end). Exit 1 on any over 0.01 mm² (the slivers a few µm across left where a wall meets a step between two close rays can't be seen). About 40 s. Written 31 October
2026 for the owner's pictures of the slot's ends: a slanted fan where the groove ends at N, twisted strips at the walls' feet (216 triangles, 6.6 mm², before the fix).

    python fusee_end.py --model wempe [--dump r_fusee_end.json] [--eval JS] [--page PATH]
"""
import asyncio,browser,json,math,sys
import numpy as np
from playwright.async_api import async_playwright
import model,pathlib;PAGE=model.PAGE   # --model wempe (model.py); --page PATH another copy of its index.html (a worktree of main: the fault before the fix)
if '--page' in sys.argv:PAGE=pathlib.Path(sys.argv[sys.argv.index('--page')+1]).resolve().as_uri()+'?snap&qa&start=movement'
# fN: the groove's end N's angle, PHI0 + frac(MN) turns, MN = (LB - 0.3 - WLD/2 - A0)/PAX as fusee.js has it (WLD 0.87, A0 = 2.0 + WLD/2 - PAX, PAX 1.2)
DUMP="""(()=>{const U=WD.FU;let g=null;__mv.traverse(o=>{if(!g&&o.isMesh&&o.userData.hn==='050604-2'&&!o.userData.sub)g=o;});
  g.updateWorldMatrix(true,false);const par=g.parent;par.updateWorldMatrix(true,false);const m=new THREE.Matrix4().copy(par.matrixWorld).invert().multiply(g.matrixWorld);
  const geo=g.geometry.index?g.geometry.toNonIndexed():g.geometry,p=geo.attributes.position,v=new THREE.Vector3(),P=[];
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(m);P.push(+v.x.toFixed(6),+v.y.toFixed(6),+v.z.toFixed(6));}
  return {P,barRot:U.PINA,S:U.S,LB:U.LB,F0:U.F0,SLD:U.SLD,us:U.SB.us,fN:U.PHI0+(((U.LB-0.3-0.87/2-(2.0+0.87/2-1.2))/1.2)%1)*Math.PI*2,N:U.SB.N,F:U.SB.F};})()"""
async def grab():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":900,"height":700});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        if '--eval' in sys.argv:await pg.evaluate(sys.argv[sys.argv.index('--eval')+1])
        d=await pg.evaluate(DUMP);await b.close()
        if errs:print('page errors:',errs);sys.exit(1)
        return d
def main():
    d=asyncio.run(grab())
    if '--dump' in sys.argv:json.dump(d,open(sys.argv[sys.argv.index('--dump')+1],'w'))
    P=np.array(d['P']).reshape(-1,3,3);S=d['S'];br=d['barRot'];SLD=d['SLD']
    # the end faces S (the small end; the body lies on the other side, toward F0); depth under the end along the axis
    sg=1 if d['F0']>S else -1;dep=lambda y:sg*(y-S)
    th=lambda x,z:np.arctan2(-z,x)   # fusee.js's angle: x = r cos th, z = -r sin th
    c,s=math.cos(br),math.sin(br)
    def uv(x,z):   # u along the bar's direction (th = barRot), v = -r sin(th - barRot)
        r=np.hypot(x,z);t=th(x,z)-br;return r*np.cos(t),-r*np.sin(t)
    cen=P.mean(1);D=dep(cen[:,1]);sel=(D>-0.02)&(D<SLD+0.05)
    Q=P[sel];C=cen[sel];n=np.cross(Q[:,1]-Q[:,0],Q[:,2]-Q[:,0]);A=np.linalg.norm(n,axis=1)/2;ok=A>1e-7;Q,C,n,A=Q[ok],C[ok],n[ok]/(2*A[ok,None]),A[ok]
    r=np.hypot(C[:,0],C[:,2]);u,v=uv(C[:,0],C[:,2])
    ex=np.array(uv(np.array([1.0]),np.array([0.0])));ez=np.array(uv(np.array([0.0]),np.array([1.0])))   # (u,v) of unit x and unit z
    vdir=np.array([ex[1,0],0,ez[1,0]]);vdir/=np.linalg.norm(vdir)
    flat=np.abs(n[:,1])>0.999
    wall=(np.abs(n@vdir)>0.999)
    udir=np.array([ex[0,0],0,ez[0,0]]);udir/=np.linalg.norm(udir)
    rad=np.stack([C[:,0],np.zeros_like(r),C[:,2]],1)/r[:,None];turned=(np.abs(np.sum(n*rad,1))>0.97)&(np.abs(n[:,1])<0.05)
    step=(np.abs(n@udir)>0.999)&(np.abs(u-d['us'])<0.01)   # the shallow part's step across the slot at u 8.0
    tang=np.stack([C[:,2],np.zeros_like(r),-C[:,0]],1)/r[:,None];tN=d['fN'];endN=(np.abs(np.sum(n*tang,1))>0.99)&(np.abs(np.angle(np.exp(1j*(np.arctan2(-C[:,2],C[:,0])-tN))))<0.0015)   # the groove's end N: a radial wall at its angle
    inner=r<7.6;pin=np.hypot(v-1.5,D[sel][ok]-0.5)<0.3   # the recess, bore and holes; the stop bar's spring's pin's hole along the slot (Ø 0.5 at v 1.5, 0.5 deep)
    bad=~(flat|wall|turned|step|endN|inner|pin)&(A>0.01)   # slivers under 0.01 mm² (a few µm across, where a wall meets a step between two close rays) unseen
    print(f'{sel.sum()} triangles in the end\'s last {SLD}; {int(bad.sum())} on no face the sheet draws (area {A[bad].sum():.4f} mm²)')
    for i in np.argsort(-A[bad])[:40]:
        k=np.where(bad)[0][i];print(f'  u {u[k]:7.3f} v {v[k]:6.3f} r {r[k]:6.3f} depth {D[sel][ok][k]:5.3f}  area {A[k]:.4f}  n ({n[k,0]:.2f},{n[k,1]:.2f},{n[k,2]:.2f})  n.v {n[k]@vdir:+.2f}')
    sys.exit(1 if bad.any() else 0)
if __name__=='__main__':main()
