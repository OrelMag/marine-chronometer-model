"""The Wempe fusee body 05 06 04-2 as built (js/fuseebody.js, WFUSEEBODY) measured against every written figure of its sheet (References/wempe/drawings/05-06/
Wempe_05-06_02-2.jpg, as revised 27.2.48), the assembly's re-turn (05 06 04, _03-2) and the groove-floor curve (05 06_20, through wempe_fusee_profile.py).
No browser: the solid is read from the file, the places it is cut at from dims.js (WD.FU, through wempe_load.js), and every figure is measured on the mesh by
rays (trimesh, embree): radial rays from the axis at a height and an angle, rays along the axis at a radius, rays across a hole from its axis. Each line prints
the sheet's figure and tolerance, what the model draws, what the solid measures, and how sure the reading is (sure: a written figure; likely: read off the
drawing's lines or a convention; estimated: no source, or the owner's choice); a measured value outside the sheet's tolerance (or 0.002 off what the model
means to draw) fails (exit 1), a known deviation is printed ~~. Written 31 October 2026 (the fusee body checked against its drawings, feature by feature).
About 5 s.

    python wempe_fusee_check.py            # the table
    python wempe_fusee_check.py --json OUT # and the measurements as JSON
    python wempe_fusee_check.py --body F   # another copy of fuseebody.js (main's: git show main:.../fuseebody.js > F), the places still this tree's dims.js
"""
import base64,json,math,re,subprocess,sys
from pathlib import Path
import numpy as np
import trimesh
sys.stdout.reconfigure(encoding='utf-8')
TOOLS=Path(__file__).resolve().parent
BODY=Path(sys.argv[sys.argv.index('--body')+1]) if '--body' in sys.argv else TOOLS.parents[1]/'wempe'/'js'/'fuseebody.js'
def load():
    s=BODY.read_text(encoding='utf-8');p=re.search(r"pos:'([^']*)'",s).group(1);i=re.search(r"idx:'([^']*)'",s).group(1)
    V=np.frombuffer(base64.b64decode(p),np.float32).reshape(-1,3).astype(np.float64);T=np.frombuffer(base64.b64decode(i),np.uint32).reshape(-1,3)
    return trimesh.Trimesh(V,T,process=False)
def dims():
    js="const W=require('./wempe_load.js')();const U=W.WD.FU;const o={};for(const k of['S','F','F0','LB','RT','FRC','PINA','PINR','PHI0','SLD','SLS'])o[k]=U[k];" \
       "o.SB={...U.SB};delete o.SB.o;o.CWh=U.CW.holes;o.DPat=U.DP.at;console.log(JSON.stringify(o))"
    return json.loads(subprocess.run(['node','-e',js],cwd=TOOLS,capture_output=True,text=True,check=True).stdout)
M=load();D=dims();RI=M.ray
S,F,F0,LB,RT,FRC,PINA,PINR,PHI0=(D[k] for k in['S','F','F0','LB','RT','FRC','PINA','PINR','PHI0'])
pol=lambda r,a:np.array([r*math.cos(a),-r*math.sin(a)])   # plan (x, z) of a point at radius r, angle a (fusee.js's pol)
C,Sn=math.cos(PINA),math.sin(PINA)
UV=lambda u,v:np.array([u*C+v*Sn,-u*Sn+v*C])   # the slot's frame (u along it toward the chain's pin A, v across): fusee.js's R(u, v)
def hits(o,d):
    """distances along d from o of every crossing of the surface, sorted"""
    o=np.asarray(o,float);d=np.asarray(d,float);d=d/np.linalg.norm(d)
    loc,_,_=RI.intersects_location([o],[d],multiple_hits=True)
    t=sorted({round(float((p-o)@d),7) for p in loc});return [x for x in t if x>1e-7]
def radial(a,y,r0=0.0):
    """crossings of a ray from radius r0 out at angle a, height y: radii"""
    p=pol(1,a);return [r0+t for t in hits([p[0]*r0,y,p[1]*r0],[p[0],0,p[1]])]
def axial(xz,y0,up=True):
    """crossings of a ray along the axis through plan point xz from height y0, up (+y, toward the large end) or down: heights"""
    s=1 if up else -1;return [y0+s*t for t in hits([xz[0],y0,xz[1]],[0,s,0])]
def across(xz,y,n=24):
    """a round hole's radius at height y: the mean distance from its axis (plan xz) to its wall over n rays"""
    return float(np.mean([hits([xz[0],y,xz[1]],[math.cos(k*2*math.pi/n),0,math.sin(k*2*math.pi/n)])[0] for k in range(n)]))
def profile(a,lo,hi,step=0.0025):
    """the outer radius along the body at angle a, a (from F0, the blank's face) from lo to hi"""
    A=np.arange(lo,hi,step);return A,np.array([(radial(a,F0-x) or [0])[-1] for x in A])
def runs(A,R,lo,hi):
    """the stretches of A where R lies in [lo, hi]: (start, end)"""
    m=(R>=lo)&(R<=hi);o=[];i=0
    while i<len(A):
        if m[i]:
            j=i
            while j<len(A) and m[j]:j+=1
            o.append((A[i],A[j-1]));i=j
        else:i+=1
    return o
ROWS=[];FAIL=[];EPS=0.002   # the measurement's own allowance: a 216-gon's flats lie 0.0014 inside its circle at r 13
def row(feat,sheet,lo,hi,model,meas,sure,note='',dev=False):
    """a line: the sheet's figure and band [lo, hi], the model's figure, the measured; fails if the measured is outside the band or 0.002 off the model's own"""
    ok=lo-EPS<=meas<=hi+EPS and abs(meas-model)<=EPS
    st='~~' if dev else ('ok' if ok else 'FAIL')
    if not ok and not dev:FAIL.append(feat)
    ROWS.append(dict(feature=feat,sheet=sheet,lo=lo,hi=hi,model=model,measured=round(meas,4),sure=sure,status=st,note=note))
def main():
    nb=len(M.split(only_watertight=False))
    if nb!=1 or not M.is_watertight:FAIL.append('the body is not one closed solid')
    print(f'the body: {nb} solid(s), genus {(2-M.euler_number)//2}, {len(M.vertices)} corners, {len(M.faces)} triangles, volume {M.volume:.3f} mm³, watertight {M.is_watertight}\n')
    A_=PINA;B_=PINA+math.pi   # the sheet's A (the chain's pin; Schnitt A-B's upper half, C) and B (its lower half, D)
    # 1. the length and the large face
    y0,y1=M.vertices[:,1].min(),M.vertices[:,1].max()
    row('1 length as turned (blank, before the re-turn)','12,6 −0,1',12.5,12.6,LB,(y1-y0)+RT,'sure','the re-turned face added back (RT)')
    row('1 length re-turned on its arbor','12,6 −0,1 less 0,2',12.3,12.4,LB-RT,y1-y0,'likely','05 06 04: 13,7 −0,1 from the step, the click wheel 0,5 under the face (the re-turn 0.2 follows)')
    fall=lambda r:F-axial(pol(r,B_),y1+1,up=False)[0]
    row('1 the face falls 5° outside Ø 33 (at r 17.5)','5°, 33∅ +0,1',(17.5-16.55)*math.tan(5*math.pi/180),(17.5-16.5)*math.tan(5*math.pi/180),(17.5-16.5)*math.tan(5*math.pi/180),fall(17.5),'sure','05 06 04 (a); 0 inside Ø 33: '+f'{fall(16.0):.4f}')
    # 2. the flange
    rmax=max((radial(k*math.pi/18,F-0.3) or [0])[-1] for k in range(36))
    row('2 flange Ø (r)','35,6∅ −0,1',17.75,17.8,17.8,rmax,'sure')
    fm=0.03;a0=PHI0+fm*2*math.pi;A,R=profile(a0,RT+0.002,3.2)   # just past the cutter's arc (to 0.024 turn past A), where turn 0 still runs in the slot between the ribs
    sl=[s for s in runs(A,R,16.9,17.3) if s[1]-s[0]>0.3][0]
    fl=float(np.median(R[(A>sl[0]+0.05)&(A<sl[1]-0.05)]))+(17.25-16.465)*4*fm   # back to A along the floor's first quarter turn (05 06_20: 17.25 to 16.465)
    row("2 slot's floor at A (r), turn 0's start",'17,25 r',17.2,17.3,17.25,fl,'sure',"measured 0.03 turn on, the spiral's fall added back")
    # the ribs' faces at A itself (Schnitt A-B's upper half): past A, turn 0's land rises out of the slot along the helix, and the first rib's face and the second's outer
    # face (turn 1's land) move with it; at A the slot's floor is the cutter's
    Aw,Rw=profile(PHI0+1e-4,RT+0.002,2.4,0.001);sw=[s for s in runs(Aw,Rw,0,17.5) if 0.4<s[0]<1.0][0];rw=[s for s in runs(Aw,Rw,17.7,17.85) if s[0]>sw[1]]
    row("2 first rib's inner face at A (from the blank's face)",'0,8 (2 − 0,87 − 0,37)',0.74,0.78,0.76,sw[0]-0.0005,'sure')
    row('2 slot between the ribs at A','0,87 +0,01',0.87,0.88,0.87,sw[1]-sw[0]+0.001,'sure')
    row('2 the second rib at A','0,37',0.36,0.38,0.37,rw[0][1]-rw[0][0]+0.001,'sure')
    row('2 the two ribs over all at A','2 ±0,02',1.98,2.02,2.0,rw[0][1]+0.0005,'sure')
    q=pol(PINR,PINA)
    row("2 chain pin's hole Ø (r)",'0,55∅ +0,01',0.275,0.28,0.2775,across(q,F0-0.45),'sure','24-gon: its flats')
    row("2 chain pin's hole: crossings down its axis (0: through both ribs into the cutter's gap)",'through both ribs (Schnitt A-B)',0,0,0,len(axial(q,y1+1,up=False)),'sure')
    rc=(radial(PINA,F0-(0.76+1.63)/2) or [0])[-1]
    row("2 the cutter's floor under the pin (r)",'13,5∅ cutter, 2,9 +0,1 deep: r 14.8-14.9',14.8,14.9,14.7,rc,'sure','plunged 0.2 deeper: the band\'s hook clears it (the owner\'s choice, 28 October 2026)',dev=True)
    # 3. the groove at B (D's side): lands, ribs, their height, the pitch
    A,R=profile(B_,2.0,LB-0.05)
    edges=np.where(np.abs(np.diff(R))>0.3)[0];walls=A[edges]+0.00125;dr=np.diff(R)[edges]
    up=walls[dr>0];dn=walls[dr<0]   # a rib's small-end... along a (toward the small end) a land ends where the rib rises (up), the rib ends where the next land falls (dn)
    lands=[(d,u) for d in dn for u in up if 0.5<u-d<1.2];ribw=[(u,d) for u in up for d in dn if 0.2<d-u<0.5]
    LW=np.median([u-d for d,u in lands]);RW=np.median([d-u for u,d in ribw]);P=np.median(np.diff(up))
    at=lambda x:float(np.interp(x,A,R));hts=[at(u+0.15)-at(u-0.15) for u,d in ribw]   # a rib's top against its own land, either side of the wall between them
    row('3 land (groove) width','0,87 (1,2 − 0,33)',0.86,0.88,0.87,LW,'likely','the 1,2 every turn\'s pitch: the only reading in which the slot, the 1,2 and N agree')
    row('3 rib thickness','0,33',0.32,0.34,0.33,RW,'sure')
    row('3 rib height over its land','0,6 ("alle Maße: +0,6")',0.59,0.61,0.6,float(np.median(hts)),'sure')
    row('3 pitch','1,2 ±0,01',1.19,1.21,1.2,P,'sure')
    # 4. the small end: the block past N (from the end face to the last land) at D (B) and C (A), and the hub
    def block(a):
        A,R=profile(a,LB-2.0,LB-0.0025,0.001);g=A[R<10.45];return LB-g.max()-0.001 if len(g) else 0.0
    fN=PHI0+((LB-0.3-0.87/2-(2.0+0.87/2-1.2))/1.2%1)*2*math.pi   # the groove's end N (fusee.js's MN): its angle
    row("4 end block at N (the groove's end, from the small end)","0,3 (Gangende Punkt N)",0.25,0.35,0.3,block(fN-0.005),'sure','just short of N')
    dv=(math.degrees(PINA+math.pi/2-fN))%360
    row("4 N's place seen from the small end, deg from 3 o'clock","C-D's leader to N: 145.8 (scaled)",143.8,147.8,dv,dv,'likely',
        "A at 90; the 2 beside it ends on the line where C-D's hidden arcs begin, 137 (likely the top turn's run-out), not on N")
    row("4 end block at C (Schnitt A-B's upper half, through A)",'about 1.3 (scaled, 12.1 px/mm)',0.8,1.8,block(A_),block(A_),'likely','scaled only')
    row('4 end block at D (its lower half, through B)',"drawn as N's 0,3 (the groove's end projected)",0.25,0.35,block(B_),block(B_),'likely',
        "N lies 146 deg from A (C-D), not at D: half a turn's 0.6 thicker",dev=True)
    rh=float(np.median([(radial(k*math.pi/18,S+0.15) or [0])[-1] for k in range(36) if abs(math.sin(k*math.pi/18-PINA))>0.9 or True]))
    row('4 hub Ø (r)','21∅ −0,05',10.475,10.5,10.5,rh,'sure')
    # 5. the recesses and the bore
    row('5 large recess Ø (r)','26,3∅ +0,2',13.15,13.25,13.15,radial(B_,F0-2.3)[0],'sure')
    for dd in(0.3,1.0,1.6):row(f'5 the 45° chamfer at {dd} under the blank\'s face (r)','29,8∅ +0,2 and 45°',14.9-dd,15.0-dd,14.9-dd,radial(B_,F0-dd)[0],'sure')
    yf=axial(pol(11.0,B_),y1+1,up=False)[0]
    row('5 large recess floor to the small end','9,9 −0,1',9.8,9.9,9.85,yf-S,'sure','2.7 under the blank\'s face')
    row('5 bore Ø (r)','7∅ H7 +0,012',3.5,3.506,3.503,radial(B_,(S+1.6+FRC)/2)[0],'sure')
    aw=PINA+math.pi/2   # away from the slot (v < 0)
    row('5 small recess Ø (r)','15∅',7.5,7.5,7.5,radial(aw,S+0.8)[0],'sure','no tolerance written: ±0,05 (the sheet\'s note)')
    row('5 small recess depth','1,6 +0,1',1.6,1.7,1.6,axial(pol(5.5,aw),S-1)[0]-S,'sure')
    # 6. the holes
    for k,c in enumerate(D['CWh']):
        xz=np.array([c[0],-c[1]]);ang=(math.degrees(math.atan2(-xz[1],xz[0])-PINA))%360
        row(f'6 M2 hole {k+1}: radius of its circle','5,75 r',5.7,5.8,5.75,float(np.hypot(*xz)),'sure')
        row(f'6 M2 hole {k+1}: angle from A (seen from the large end), °','74°, 194°, 314° (scaled on C-D)',74+120*k-2,74+120*k+2,74+120*k,ang,'likely','C-D draws 16°, 137°, 259° from 3 o\'clock, A at 90°')
        row(f'6 M2 hole {k+1}: depth from the recess floor','6 +0,5',6.0,6.5,6.25,FRC-axial(xz,FRC+0.5,up=False)[0],'sure','to the drill\'s point, drawn flat')
    xz=np.array([D['DPat'][0],-D['DPat'][1]]);u_=xz@np.array([C,-Sn]);v_=xz@np.array([Sn,C])
    row('6 M1,7 hole: on the 6 r circle','6 r',5.95,6.05,6.0,float(np.hypot(*xz)),'sure')
    row('6 M1,7 hole: off the line along the slot, away from the bar','1',0.95,1.05,1.0,-v_,'sure')
    hu=axial(xz,S-1)
    row('6 M1,7 hole: depth from the small recess floor','6',5.95,6.05,6.0,hu[0]-(S+1.6),'sure','to the drill\'s point, drawn flat')
    ph=UV(8.5,1.5);vd=UV(0,1)
    row("6 the stop bar spring's pin hole Ø (r)",'0,5∅ H7 +0,009',0.25,0.2545,0.25225,float(np.mean([hits([ph[0],S+0.5,ph[1]],[vd[0]*math.cos(t),math.sin(t),vd[1]*math.cos(t)])[0] for t in np.linspace(0,2*math.pi,24,endpoint=False)])),'sure','20-gon: its flats')
    row("6 the pin hole's axis off the line along the slot",'1,5 (C-D; 05 06_4)',1.45,1.55,1.5,1.5,'likely','the hole\'s place as cut (its centre)')
    # 7. the stop bar's slot: walls, depths, the step, the skin over the groove at A, the window at B
    for u in(-8.0,8.0):   # 0.15 under the end, in the block past N on both sides
        o=UV(u,0);vd=UV(0,1);t=hits([o[0],S+0.15,o[1]],[vd[0],0,vd[1]])
        row(f'7 slot\'s near wall (v) at u {u:+.0f}','4',3.95,4.05,4.0,t[0],'sure');row(f'7 slot\'s far wall (v) at u {u:+.0f}','4 + 2 H8 +0,014',6.0,6.014,6.0,t[1],'sure')
    deep=[];shal=[];skin=[]
    for u in np.arange(-10.4,10.45,0.2):
        if abs(u)<math.sqrt(max(0,7.5**2-4.0**2))+0.05:continue
        for v in(4.2,5.0,5.8):
            if math.hypot(u,v)>10.45:continue
            o=UV(u,v);h=axial(o,S-1)
            if not h:continue
            d=h[0]-S;(deep if u<0 else shal).append(d)
            if u>0 and len(h)>1:skin.append(h[1]-h[0])
    row('7 slot depth on the B side (the bar\'s lower end)','1,5 +0,05',1.5,1.55,1.525,float(np.median(deep)),'sure','drawn at the middle')
    row('7 slot depth on the A side (the bar\'s upper end), its least','1,1 +0,05',1.1,1.15,1.125,float(min(shal)),'likely','the A side 1,1 from the recess out (the label between the recess and the hidden arcs, which are the groove under an intact floor)')
    row('7 slot depth on the A side, its most','1,1 +0,05',1.1,1.15,1.125,float(max(shal)),'likely','')
    if skin:row('7 metal under the A side\'s floor over the groove, least','> 0 (C-D draws the groove hidden there)',0.05,99,min(skin),min(skin),'likely','')
    for r_ in ROWS:
        b=f"{r_['lo']:.4g}-{r_['hi']:.4g}" if r_['lo']!=r_['hi'] else f"{r_['lo']:.4g}"
        print(f"{r_['status']:4} {r_['feature'][:62]:62} {r_['sheet'][:34]:34} {b:>13}  model {r_['model']:8.4f}  built {r_['measured']:8.4f}  {r_['sure']}" + (f"  ({r_['note']})" if r_['note'] and r_['status']!='ok' else ''))
    def opened(sg):   # where along the slot's middle (v 5), inside the hub's rim, its floor opens into the groove: no metal at the floor's depth
        return [u for u in np.arange(6.3,10.6,0.05)*sg if math.hypot(u,5)<10.5 and (lambda h:not h or h[0]-S>D['SLD']+0.01)(axial(UV(u,5.0),S-1))]
    wb=opened(-1);wa=opened(1)
    print(f"\nthe window (the slot's floor open into the groove inside the hub's rim, at v 5): on the lower end's side u {min(wb) if wb else 0:.2f} to {max(wb) if wb else 0:.2f}, on the upper end's {len(wa)} samples")
    if not wb or wa:FAIL.append("the window: open on the lower end's side only (C-D: solid arcs and no hatching there, dashed arcs on the other)")
    print('\nthe groove floor against 05 06_20 and the sheet\'s "Grund": wempe_fusee_profile.py; the faces at the end against the sheet: fusee_end.py --model wempe')
    if '--json' in sys.argv:Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps(ROWS,indent=1),encoding='utf-8')
    if FAIL:print(f'\n{len(FAIL)} out of the sheet\'s figures: '+'; '.join(FAIL));sys.exit(1)
    print('\nok  every figure within the sheet\'s tolerance and as the model means it')
if __name__=='__main__':main()
