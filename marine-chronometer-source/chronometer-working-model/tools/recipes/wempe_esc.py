"""The Wempe's escapement-side recipes beyond batch 8 (31 October 2026; PLAN-recipes.md): the balance arm's screws WN-10, the stud's screw WN-11, the compensation
masses' screws WN-12, the detent block's other versions and the hairspring's collet and stud. Their numbers are the page's own (escapement.js, through wempe_load.js)."""
import math
import build123d as bd
from . import (Op,Recipe,Setup,S,iso,Bar,TurnOD,TurnCone,Bore,ThreadOD,TurnProfile,Cut,Bought,Blank,page_matrix,Plate,InnerCone,Drill)
from .wempe import W,WB,BALM,_thr,screw,Solid

RECIPES={}

class SpinCut(Cut):
    """a cut at a heading the page sets arbitrarily (a screw's slot, turned at random): make(angle), the angle fitted by the check's free_spin, 0 for the STEP"""
    spin=True
    def __init__(self,make,*a,**k):super().__init__(lambda:make(self.angle),*a,**k);self.angle=0.0

def _thread(rs,L,z0):
    """an outside thread's figures for a shank of radius rs: the nut's thread (iso), the crest diameter, the tip chamfer as KIT threadGeo draws it (length, tip radius)"""
    th=iso(2*rs);crest=2*rs-th['es'];ch=min(th['H1'],(L-z0)*0.3);root=crest/2-th['H1'];return th,crest,ch,max(root-th['H1']/2,root*0.6)

# ---------------- the stud's screw WN-11 (escapement.js STS) ----------------
def studScrew():
    Q=WB()['STS'];ln=Q['bar']+Q['ck']+Q['be']
    return screw('studScrew','WN-11',"Hairspring stud's screw (WN-11, by the coloured section)",Q['r'],Q['h'],ln,Q['rs'],'steel (not given)',
      "escapement.js STS (the coloured section, Wempe_Einheitschronometer.jpg px 1408.4-1429.6 × 156-171.4 at 9.37 px/mm: head Ø 2.26 × 1.64, 0.6 through the cock: likely)",
      ['Head and shank are read off the coloured section (estimated).'])
RECIPES['studScrew']=studScrew

# ---------------- the arm's two screws WN-10 into the balance flange (escapement.js HUB.sc) ----------------
def armScrew():
    X=WB();H=X['HUB'];SC=H['sc'];Y=X['Y'];rs=H['rs'];src="escapement.js HUB.sc (the arm's screws; 05 03_3.2 \"2 x M1\"; the head and shank estimated)"
    hh=SC['b']-SC['a'];z0=SC['c']-SC['a'];Lt=Y['flB']-SC['e']-(Y['armT']+SC['a']);th,crest,ch,rt=_thread(rs,Lt,z0)
    prof=[(0,0),(SC['r1'],0),(SC['r2'],hh),(crest/2,hh),(crest/2,Lt-ch),(rt,Lt),(0,Lt)]
    sl=SC['sl'];zs0=SC['sy']-sl[1]/2-SC['a'];zs1=SC['sy']+sl[1]/2-SC['a']   # the slot box's two faces in the part's frame (z from the head's face): 1.3 along x, 0.2 high (page y), 0.25 across
    ops=[Bar(2*SC['r1'],Lt,'Cut and face a bar to the overall length, the head end out',[S('overall',f'{Lt:.2f}',None,src)],src),
         TurnProfile(prof,"Turn the countersunk head (wide at its face), the shank to the thread's major diameter and the tip",
           [S('head',f"Ø {2*SC['r1']:.2f} at the face, Ø {2*SC['r2']:.2f} {hh:.2f} up",None,src),S('shank',f'Ø {crest:.3f}','6g (es %.3f)'%th['es'],'ISO 965')],src),
         ThreadOD(th,z0,Lt,f'Cut the thread M{2*rs:g} (die)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src),
         SpinCut(lambda a:bd.Box(sl[0],sl[2],zs1-max(zs0,-0.01),align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).rotate(bd.Axis.Z,math.degrees(a)).moved(bd.Location((0,0,max(zs0,-0.01)))),
           'Slot the head across its face',[S('slot',f'{sl[0]} long × {sl[2]} wide, {zs1:.3f} deep','estimated',src)],src)]
    r=Recipe('armScrew','WN-10','Balance arm screw (WN-10, by the coloured section), two',src,'steel (not given)','none',[Setup('1','bar in the collet, the head end out; slotted at the bench',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,Y['armT']+SC['a'],0)),
      fits=["through the arm into the balance flange's tapped holes (2 × M1), the heads sunk in the arm's face"],
      expect=[{'at':(0,0),'r':0.9,'max':0.14,'why':"the head's slot: the page draws it as a solid dark box (1.3 × 0.25 across × 0.2 deep) filling the slot and standing 0.02 out of the head's face, not cut into it: its top is 0.125 from the recipe's slot walls"}])
    r.near=0.5;r.free_spin=(math.pi,0.0);r.box_tol=0.03;return r
RECIPES['armScrew']=armScrew

# ---------------- the compensation masses' screws WN-12 (escapement.js MS.sc) ----------------
def massScrew():
    X=WB();M=X['MS'];SC=M['sc'];src='escapement.js MS.sc (05 03_2; Wempe 3955 9_Hemmung.jpg: the head flush in the outer face, Ø 1.56)'
    B=X['BAL'];rc=(B['r0']+B['r2'])/2;mr=M['d']/2;ro=B['r2']+M['cl'];rOut=rc+mr;tA=ro-SC['tg'];rs=M['TS']
    zb=rOut-M['cb']-tA;zt=rOut-SC['hu']-tA;zc=rc-tA;hr=SC['hr'];th,crest,ch,rt=_thread(rs,zb+SC['tp'],0)
    prof=[(0,0),(rt,0),(crest/2,ch),(crest/2,zb),(hr,zb),(hr,zt),(0,zt)]
    sl=SC['sl'];zbot=rOut-sl[1]-tA
    def top():   # the head's face on the mass's round side, 0.02 under it: everything outside a cylinder of the mass's radius about the mass's own axis, above its middle
        up=bd.Box(4*hr,4*hr,10,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,zc-SC['hu']-0.5-mr)))
        return up-bd.Solid.make_cylinder(mr,4,bd.Plane(origin=(0,-2,zc-SC['hu']),z_dir=(0,1,0)))
    ops=[Bar(2*hr,zt+0.2,'Cut and face a bar to length, the thread end out',[S('overall',f'{zt:.2f}',None,src)],src),
         TurnProfile(prof,"Turn the head and the shank to the thread's major diameter, the tip chamfered",[S('head',f'Ø {2*hr:.2f} × {zt-zb:.2f}','Wempe 3955 (5_O, 6_S): Ø 1.56 (sure)',src),S('shank',f'Ø {crest:.3f}','6g',src)],src),
         ThreadOD(th,0,zb+SC['tp'],f'Cut the thread M{2*rs:g} (die)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src),
         Cut(top,"Face the head's top on the mass's round side (a form tool, or filed to the mass)",[S('face',f"on the mass's r {mr:.3f}, {SC['hu']} under it","escapement.js (the mass's side)",src)],src),
         Cut(lambda:bd.Box(sl[0],sl[2],sl[1]+1,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((0,0,zbot))),'Slot the head across the mass (horizontal)',[S('slot',f"{sl[0]} long × {sl[2]} wide, {sl[1]} under the mass's side",'estimated',src)],src)]
    r=Recipe('massScrew','WN-12','Compensation mass screw (WN-12, by the coloured section), four',src,'steel (not given)','none',[Setup('1','bar in the collet; faced and slotted at the bench',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,tA,0)),fits=["through the mass's outer jaw to the rim's outer face, the head sunk in the mass's counterbore"],
      expect=[{'at':(0,0),'r':1.0,'max':0.14,'why':"the head's slot: the page draws it as a solid dark box (1.6 × 0.25 across × 0.25 deep) filling the slot and standing 0.02 out of the head's face, not cut into it: its top is 0.125 from the recipe's slot walls; and the page's head top is a fan of 24 triangles from its centre to a rim bent onto the mass's side, up to 0.022 off the true cylinder the recipe turns"}])
    r.near=0.5;r.box_tol=0.03;return r
RECIPES['massScrew']=massScrew

# ---------------- the detent block as the escapement of 1943 has it (escapement.js, the '1943' group of the block) ----------------
from .wempe import WDET,_detFrame,_box,Drill,_prism,_tn
def detentBlock1943():
    """the block of 05 04 01-4 as last revised, but its steady pins, its fixing stud and its slit as the German movements with this block have them (HOLES.block43; the slit
    along the plate through the upright's width, 8_Kirow_DEC_479_Feder.jpg, 8_Lange_5177_Feder.jpg, 8_Kirow_DEC_422_Feder.jpg): in the detent's frame (its recipe's)"""
    X=WDET();Bk=X['BLK'];s,M=_detFrame();ROW,nE=X['ROW'],X['BLK_NE'];U=Bk['up'];B43=X['HOLES']['block43'];P=X['P'];TD=X['TD'];src='05 04 01-4 (8.7.43) as the escapement of 1943 builds it (escapement.js)'
    toD=lambda q:((q[0]-P[0])*TD['t'][0]+(q[1]-P[1])*TD['t'][1],(q[0]-P[0])*TD['n'][0]+(q[1]-P[1])*TD['n'][1])
    tF,tT=ROW+Bk['tF'],ROW+Bk['tT'];tU=tF-Bk['len'];nUl=nE-Bk['nl'];nUr=nUl-Bk['uw'];nm=(nUl+nUr)/2
    A,B,R=Bk['JC']['A'],Bk['JC']['B'],Bk['JC']['R'];m=((A[0]+B[0])/2,(A[1]+B[1])/2);d=(B[0]-A[0],B[1]-A[1]);l=math.hypot(*d);h=math.sqrt(R*R-l*l/4);c=(m[0]-d[1]/l*h,m[1]+d[0]/l*h)
    a0=math.atan2(A[1]-c[1],A[0]-c[0]);a1=math.atan2(B[1]-c[1],B[0]-c[0]);od=lambda a:(tT-(c[1]+R*math.sin(a)),nUr-(c[0]+R*math.cos(a)))
    V=lambda t,n,z:bd.Vector(t,s*n,z)
    def body():
        ya,yb=U['a'],U['b']
        cove=bd.Wire([bd.Edge.make_line(V(tT-A[1],nUr,ya),V(*od(a0),ya)),bd.Edge.make_three_point_arc(V(*od(a0),ya),V(*od((a0+a1)/2),ya),V(*od(a1),ya)),
                      bd.Edge.make_line(V(*od(a1),ya),V(tT,nUr-B[0],ya)),bd.Edge.make_line(V(tT,nUr-B[0],ya),V(tT,nUr,ya)),bd.Edge.make_line(V(tT,nUr,ya),V(tT-A[1],nUr,ya))])
        from .wempe import _box as bx
        return (bx(tT,tF,nE-Bk['bl'],nE,0,Bk['bd'],s)+bx(tT,tF,nE-Bk['tl'],nE-Bk['bl'],0,Bk['td'],s)+bx(tU,tT,nUr,nUl,ya,yb,s)+bd.extrude(bd.Face(cove),yb-ya,dir=(0,0,1)))
    m17=iso(2*Bk['m17']['rs']);m1=iso(1.0);m12=iso(1.2);yS=U['s'];tS=ROW+U['tS'];hs=U['hs']
    p0,p1,st=toD(B43['pins'][0]),toD(B43['pins'][1]),toD(B43['stud']);zf=2.3
    ops=[Solid(body,'Mill the block from brass: the base 6.5 deep at its end, the thin part 3 deep, the upright 3 × 3 at the free face with its cove r 3 to the base',
          [S('base',f"{tF-tT:.1f} long, {Bk['bl']} wide, {Bk['bd']} deep; on to {Bk['tl']} at {Bk['td']} deep",'±0.1; "6,5", "3" (sure)',src),
           S('upright',f"{Bk['uw']} wide, {U['b']-U['a']} thick, {Bk['len']} from the base's foot, {Bk['nl']} in from the end face",'"3", "25", "1,4 +0,1" (sure)',src),
           S('cove','a step 0.35 at 2.5 over the base, then r 3 to 2.0 out and 0.4 over it','"3 r" (traced at 17.1 px/mm: sure)',src)],src),
         Cut(lambda:_box(tU-0.1,tU+U['sl'],nUr-0.1,nUl+0.1,yS-hs,yS+hs,s),"Saw the upright's end slit along the plate, through its width",[S('slit',f"{2*hs:.1f} wide, {U['sl']} from the end, {yS} under the plate",'"0,3", "7" (sure); along the plate as the photographs show it (DEC 479, Lange 5177, DEC 422: sure)',src)],src),
         Drill((tS,s*(nUr-0.1),yS),(0,s,0),m12['D1'],Bk['uw']+0.2,"Drill and tap the banking screw's M1.2 across both leaves",[S('',f"M1.2, {-U['tS']} from the base's hole row, {yS} under the plate",'"18,8 ±0,03", "M1,2" (sure)',src)],src,thread=m12,key='M1.2'),
         Drill((p0[0],s*p0[1],-0.01),(0,0,1),2*Bk['pr'],1.2+0.01,"Drill the near steady pin's hole 1.2 into the base",[S('',f"Ø {2*Bk['pr']}, 1.2 deep",'(sure)',src)],src,key='pin1'),
         Drill((p1[0],s*p1[1],-0.01),(0,0,1),2*Bk['pr'],Bk['td']+0.02,"Drill the far steady pin's hole through the thin part",[S('',f"Ø {2*Bk['pr']}",'(sure)',src)],src,key='pin2'),
         Drill((ROW,s*(nE+Bk['h13']['n']),-0.01),(0,0,1),2*Bk['h13']['r'],Bk['h13']['d']+0.01,'Drill the Ø 1.3 hole from the plate face, 3 deep',[S('',f"Ø {2*Bk['h13']['r']}, {-Bk['h13']['n']} from the end face",'"1,3", "3" (sure)',src)],src,key='h1.3'),
         Drill((st[0],s*st[1],-0.01),(0,0,1),m17['D1'],3.0+0.01,'Drill and tap the fixing M1.7 3.0 into the base (the stud)',[S('',"M1.7, 3.0 deep",'estimated (HOLES.block43, the 6MX\'s stud)',src)],src,thread=m17,key='M1.7'),
         Drill((ROW,s*(nE+Bk['h13']['n']),zf),(0,s,0),m1['D1'],-Bk['h13']['n']+0.02,"Drill and tap the M1 for the detent foot's screw from the end face to the Ø 1.3 hole",[S('',f"M1, {zf} under the plate",'05 04 01-4 (sure)',src)],src,thread=m1,key='M1'),
         *[Drill((ROW+t,s*(nE+dn),zf),(0,s,0),2*r,-dn+0.02,"Drill a steady pin's hole in the end face for the detent's foot (at assembly, with the foot)",[S('',f"Ø {2*r:.2f}, {-dn} deep, {abs(t)} either side of the M1",'1436\'s pins (estimated)',src)],src,key=f'p{t:+.1f}') for t,dn,r,_ in Bk['endH'][1:]]]
    vol=math.pi*(U['rh']**2-(m12['D1']/2)**2)*Bk['uw']
    r=Recipe('detentBlock.1943','050401-4','Detent block (Gangfederkloben), the escapement of 1943',src,'brass (not read on the sheet)','none',[Setup('1','brass block on the mill; the end holes drilled with the detent\'s foot at assembly',ops,view='top')],M,
      faces=("the plate's side","the free side"),fits=["screwed to the top plate's inner face by the M1.7 from its stud, on its two steady pins","the detent's foot clamped to its end face by the M1 WN-gf"],
      expect=[{'at':(tS,s*nm),'r':1.8,'max':0.2,'vol':vol,'why':"the banking screw's hole across the leaves: the page draws it plain, a bore r 0.62 round the shank's 0.6 in the slit's profile, the recipe tapped M1.2 at the tap drill (the threads' convention; a hole across has no thread zone)"}],
      notes=["Drawn in the detent's frame (its recipe's): X along the detent, Y across it, Z under the top plate's inner face.","The block of the escapement of 1943: the last revised block's form, its slit along the plate through the upright's width, its stud and steady pins where Kirow DEC 479 and Lange 5177 have them."])
    r.rev='1943';return r
RECIPES['detentBlock.1943']=detentBlock1943

# ---------------- the hairspring's collet (05 03 02-2) and stud (05 03 02-3) (escapement.js COL, STD) ----------------
import functools,json,subprocess
from .wempe import TOOLS
@functools.lru_cache()
def WE():
    js="const W=require(%r)(),E=W.WESC;process.stdout.write(JSON.stringify({COL:E.COL,STD:E.STD}))"%str(TOOLS/'wempe_load.js')
    return json.loads(subprocess.run(['node','-e',js],capture_output=True,text=True,check=True).stdout)

def collet():
    C=WE()['COL'];RE,W1,W2,cw,cn,cT,sT,h=C['RE'],C['W1'],C['W2'],C['cw'],C['cn'],C['cT'],C['sT'],C['h'];src='05 03 02-2 (24.2.43); plan traced at 34.5 px/mm (05 03_5); escapement.js COL'
    P=lambda e,w:bd.Vector(e,-w,0);m=(C['r1']-C['r0'])/h;e0=0.01
    face=bd.Face(bd.Wire([bd.Edge.make_line(P(-cw,-W1),P(cn,-W2)),bd.Edge.make_three_point_arc(P(cn,-W2),P(RE,0),P(cn,W2)),bd.Edge.make_line(P(cn,W2),P(-cw,W1)),bd.Edge.make_three_point_arc(P(-cw,W1),P(-RE,0),P(-cw,-W1))]))
    rH=C['hd']/2+(C['ho']-C['hw'])/C['tp'];Lh=C['ho']+C['hw']+0.3;zh=h-C['hy']
    o=(C['HX']+C['ho']*sT,C['ho']*cT,zh);u=(-sT,-cT,0)
    def hole():return bd.Solid.make_cone(rH,rH-Lh/C['tp'],Lh,bd.Plane(origin=o,z_dir=u))
    ops=[Plate(face,h,'Mill the bar from brass sheet: its ends arcs of r %.1f about the bore, %.2f wide at the slit end and %.2f at the other'%(RE,2*W1,2*W2),
           [S('length',f'{2*RE:.1f}',"9.1 -0.2 on the sheet, drawn at the fits' middles (sure)",src),S('width, slit end',f'{2*W1:.1f}','3.8 -0.2',src),S('width, other end',f'{2*W2:.1f}','2.7 -0.2',src),S('height',f'{h}','3.3',src)],src),
         InnerCone(C['r0']-e0*m,-e0,C['r1']+e0*m,h+e0,'Bore it at 1:70 for the staff and ream: Ø %.3f at the arm side, Ø %.3f at the other'%(2*C['r0'],2*C['r1']),
           [S('bore',f'1:70, Ø {2*C["r0"]:.3f} to {2*C["r1"]:.3f}',"1,6 H7 at the face toward the arm, (1,55) at the other, opened to the 1946 staff's seat (sure)",src)],src),
         Cut(lambda:bd.Box(RE+0.5-C['rb']-C['sl'],2*C['sl'],h+0.2,align=(bd.Align.MIN,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((-RE-0.5,0,-0.1))),'Saw the slit from the wide end to short of the bore',
           [S('slit',f'{2*C["sl"]} wide, ending {C["sl"]} short of the bore',"0,2 +0,1 wide, 0,1 +0,05 short (built at the fits' middles, 0.25 and 0.125)",src)],src),
         Cut(hole,"Drill the spring's hole across the narrow end (0.7, bei Montage gebohrt), then ream it 1:90 to Ø %.3f where it enters"%C['hd'],
           [S('hole',f'Ø {C["hd"]} where it enters, 1:90',f'0,8 +0,01 (Kegel 1:90); axis {C["HX"]} from the bore, {C["hy"]} from the face, leaning {math.degrees(C["TH"]):.1f}° off square to the bar, square to the side it enters (90°)',src)],src)]
    ax=C['ax']
    return Recipe('hsCollet','050302-2','Hairspring collet (Spiralrolle)',src,'Messingblech Ms 58 (05 03 02-2)','none',[Setup('1','bar on the mill, then bored and reamed at the lathe; the slit sawn and the hole drilled at the fitting',ops,view='top')],
      page_matrix([[ax[0],ax[1],0],[0,0,1],[ax[1],-ax[0],0]],(0,C['colB']-h,0)),faces=('underside (toward the arm)','top'),fits=["on the staff's 1:70, line to line, gripping by its slit","the hairspring's inner end in its hole, with its pin (05 03 02-4)"])
RECIPES['hsCollet']=collet

def stud():
    D=WE()['STD'];AX,VO,o=D['AX'],D['VO'],D['o'];src='05 03 02-3 (6.6.41); 05 03_1, 05 03_5, 05 03_7; escapement.js STD'
    cr=AX[0]*VO[1]-VO[0]*AX[1];sg=1 if cr<0 else -1   # part Y = sg x v (page_matrix needs a proper turn)
    uw,c,tn,HU,ck,yB,yE=D['uw'],D['c'],D['tn'],D['HU'],D['ck'],D['yB'],D['yE'];t=ck-yB;dq=yE-ck
    Ep,Em,Cp,Cm,Ap,Tp=(-uw,c+D['E'][0]),(-uw,c-D['E'][1]),(HU,c+D['Cw']),(HU,c-D['Cw']),(HU+D['Ap'],c),(D['Tp'],c)
    V=lambda u,v,z:bd.Vector(u,sg*v,z)
    def facet(q):   # under the plane through (q, 0), (Ap, 0) and (Tp, t - fac): the blank's underside ground up to the point, over the triangle (q, Ap, Tp)
        pts=[V(*q,0),V(*Ap,0),V(*Tp,t-D['fac'])];n=(pts[1]-pts[0]).cross(pts[2]-pts[0]);n=n if n.Z>0 else -n
        tri=bd.extrude(bd.Face(bd.Wire.make_polygon([V(*q,-0.5),V(*Ap,-0.5),V(*Tp,-0.5)],close=True)),t+1.0,dir=(0,0,1))
        return tri&bd.Box(60,60,60,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MAX)).moved(bd.Location(bd.Plane(origin=pts[0],z_dir=n)))
    def body():
        bar=bd.extrude(bd.Face(bd.Wire.make_polygon([V(*Em,0),V(*Cm,0),V(*Tp,0),V(*Cp,0),V(*Ep,0)],close=True)),t,dir=(0,0,1))
        up=bd.extrude(bd.Face(bd.Wire.make_polygon([V(-uw,v,z) for v,z in ((D['v0'],t),(D['v1'],t),(D['v1']-tn*dq,t+dq),(D['v0']-tn*dq,t+dq))],close=True)),2*uw,dir=(1,0,0))
        return bar-facet(Cp)-facet(Cm)+up
    ops=[Solid(body,'Mill the stud from Flachmessing 15 × 7: the bar %.1f thick, the upright %.1f over it leaning 8° toward the staff, then grind the two facets under the point'%(t,dq),
           [S('bar',f'{Tp[0]+uw:.1f} long, {t} thick','14.6 -0.2, 1.6 -0.2 (drawn 1.5, the middle)',src),S('width',f'{D["E"][0]+D["E"][1]:.2f} at the square end (1.2 out, 1.26 in), {2*D["Cw"]:.1f} at the hole','2.5 -0.2, 3.1 -0.2 (1,2 -0,1; 1.26 scaled)',src),
            S('upright',f'{2*uw:.4f} thick along the bar (1.8 g6), {dq} over the bar, leaning 8°','1.8 g6; 6.0 -0.2 (98° side view)',src),S('facets',f'from the V (apex {D["Ap"]} on from the hole) to the point at {D["Tp"]}, a knife edge {D["fac"]} under the top',"the plan's V, the section (sure)",src)],src),
         Drill((HU,sg*c,-0.5),(0,0,1),2*D['hr'],t+1.0,"Drill and ream the screw's hole Ø 1.5 H7 through the bar",[S('',f'Ø {2*D["hr"]:.3f}, at {HU} on, {c} across',"1,5 H7; 5 ±0.1 from the square end's hole line (sure)",src)],src,key='screw'),
         Drill((-uw-0.1,sg*D['SVH'],D['SYH']-yB),(1,0,0),2*D['hh'],2*uw+0.2,"Drill the hairspring's hole Ø 0.7 along the bar through the upright (at the fitting of the spring)",[S('',f'Ø {2*D["hh"]}, {D["SYH"]-ck:.2f} over the bar, {D["SVH"]:.3f} across','bei Montage der Spirale gebohrt; 3.15 (05 03_5, sure)',src)],src,key='spring')]
    return Recipe('hsStud','050302-3','Hairspring stud (Klötzchen)',src,'Flachmessing 15 × 7 Ms 58 (05 03 02-3)','none',[Setup('1','flat bar on the mill, ground at the bench, drilled at the fitting of the spring',ops,view='top')],
      page_matrix([[AX[0],sg*VO[0],0],[0,0,1],[AX[1],sg*VO[1],0]],(o[0],yB,o[1])),faces=('underside','top'),
      fits=["screwed to the balance cock's top by the WN-11, the upright down through the cock's slot","the spring's outer end in the hole across the upright, with its pin"])
RECIPES['hsStud']=stud

def hairspringPins():
    D=WE();C,S_=D['COL'],D['STD'];Lc=2*(C['hw']/C['cT']+C['pp']);Ls=2*(S_['uw']+S_['pp'])
    src='escapement.js COL, STD (Spiralstift 05 03 02-4, the stud\'s pin\'s number; brass, Ldzmn4kuKMA 4:32-4:34; sizes estimated)'
    note='Half round: filed from round wire to the hole\'s round less the spring\'s side, its flat 0.005 off the strip, set at the fitting of the spring.'
    return [Bought('hsCollet.pin','050302-4.c',"Collet's pin for the hairspring (Spiralstift)",'brass wire, filed half round and driven in the collet\'s Ø 0.8 hole beside the spring\'s inner end',
              f'Ø {2*C["pr"]:.3f} × {Lc:.2f} (0.45 standing out of each side of the collet)','brass wire','brass',src,[note]),
            Bought('hsStud.pin','050302-4.s',"Stud's pin for the hairspring (Spiralstift)",'brass wire, filed half round and driven in the stud\'s Ø 0.7 hole beside the spring\'s outer end',
              f'Ø {2*S_["pr"]:.3f} × {Ls:.2f} (0.45 standing out of each side of the upright)','brass wire','brass',src,[note])]
for _b in hairspringPins():RECIPES[_b.key]=(lambda b=_b:b)


# ================= batch 8d (1 November 2026): the detent block's other versions, the banking screws, the studs and the detent's two screws =================
# The first-drawn block (05 04_1; Wempe 3955 as photographed), the Soviet 6MX's (with its adjusting slide and stop screw), the escapement of 1943's and the 6MX's studs and
# banking screws, the first-drawn block's banking screw, and the detent's WN-14 and WN-gf. Their numbers are the page's (escapement.js BLK.first, BLK.m6, BLK.s43, DETK.gs, DETK.gf).
from . import SlotHead

class TurnArcs(Op):
    """turn to a finished profile with arcs, from the axis at one end to the axis at the other: items (r, z) a straight run to there, ((r, z) mid, (r, z) end) an arc through
    the middle point to the end (a dome, a ball end): everything outside it removed"""
    kind='turn'
    def __init__(self,items,text,sizes=(),src=''):super().__init__(text,sizes,src);self.items=items
    def apply(self,p):
        P=lambda q:bd.Vector(q[0],0,q[1]);E=[];cur=self.items[0]
        for it in self.items[1:]:
            if isinstance(it[0],tuple):E.append(bd.Edge.make_three_point_arc(P(cur),P(it[0]),P(it[1])));cur=it[1]
            elif math.dist(it,cur)>1e-9:E.append(bd.Edge.make_line(P(cur),P(it)));cur=it
        E.append(bd.Edge.make_line(P(cur),P(self.items[0])))
        return p&bd.revolve(bd.Face(bd.Wire(E)),bd.Axis.Z,360)

def _cap(rH,hH,z0):
    """a spherical cap of height hH over a rim of radius rH at z0: the arc's (middle, end) items from the rim to the apex, and the sphere's radius"""
    R=(rH*rH+hH*hH)/(2*hH);a0=math.asin(rH/R);c=z0+hH-R;return ((R*math.sin(a0/2),c+R*math.cos(a0/2)),(0.0,z0+hH)),R

def _blk():
    X=WDET();return X,X['BLK'],X['ROW'],X['BLK_NE']
def _toD(X):
    P,TD=X['P'],X['TD'];return lambda q:((q[0]-P[0])*TD['t'][0]+(q[1]-P[1])*TD['t'][1],(q[0]-P[0])*TD['n'][0]+(q[1]-P[1])*TD['n'][1])

def _bankingScrew(key,hn,title,L,items,rs,rH,top,sd,sw,src,sizes,notes,expect_why,sz=0.01):
    """a banking screw M1.2 as the page draws it: a lathe about its axis from the thread's end (z 0) to the dome's top; its slot a dark bar across the head along a heading the page
    sets (SpinCut), cut here to sd under the top; the thread by convention (the page draws its rings)"""
    th,crest,ch,rt=_thread(rs,L,0)
    ops=[Bar(2*rH,top,'Cut and face a bar to the overall length, the thread end out',[S('overall',f'{top:.2f}',None,src)],src),
         TurnArcs(items(crest/2,ch,rt),"Turn the thread's blank (the tip chamfered), the head's underside and the dome",sizes(crest),src),
         ThreadOD(th,0,L,f'Cut the thread M{2*rs:g} (die)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src),
         SpinCut(lambda a:bd.Box(2*rH+0.4,2*sw,sd+1,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).rotate(bd.Axis.Z,math.degrees(a)).moved(bd.Location((0,0,top-sd))),
           'Slot the dome across (a saw)',[S('slot',f'{2*sw:.2f} wide × {sd} deep','estimated',src)],src)]
    r=Recipe(key,hn,title,src,'brass (the photographs: likely)','none',[Setup('1','bar in the collet, the head end out; slotted at the bench',ops)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),fits=notes[0],notes=notes[1:],
      expect=[{'at':(0,0),'r':rH+0.1,'max':sd+sz+0.1,'why':expect_why}])
    r.near=1.0;r.free_spin=(math.pi,0.0);r.box_tol=0.03;return r

def bankScrew6mx():
    X,Bk,ROW,nE=_blk();m=Bk['m6']['bk'];nUr=nE-Bk['nl']-Bk['uw'];lS=m['nH']-(nUr-m['nB']);rH,hH,rs=m['rH'],m['hH'],m['rs'];arc,R3=_cap(rH,hH,lS);top=lS+hH
    src="escapement.js BLK.m6.bk (the Soviet 6MX's block, Kirov 247: 8_Kirow_247_F.jpg, 9_KirPol_24020_Feder2.jpg; the slotted dome, the thread showing past the upright: likely)"
    return _bankingScrew('bankScrew6','WN-gkA',"Banking screw M1.2 across the 6MX block's upright (its WN number not read)",lS,lambda c,ch,rt:[(0.0,0.0),(rt,0.0),(c,ch),(c,lS),(rH,lS),arc],rs,rH,top,m['sd'],m['sw'],src,
      lambda crest:[S('shank',f'Ø {crest:.3f}','6g',src),S('head',f'Ø {2*rH:.1f} across, a dome {hH} high on the underside at {lS:.2f}',"Kirov 247's: Ø 3.4 (3.45 ±0.1, 3.43 on 24020) (likely)",src)],
      [["through the upright's slit and both leaves, its thread tapped in the leaves; its dome on the wheel's side of the pipe, which rests on it"],
       "The banking screw of the 6MX's block: the pipe's flat face rests on its dome, turning it sets the depth of lock."],
      "the dome's slot: the page draws it as a solid dark bar standing 0.01 out of the dome (0.34 wide, 0.45 deep, following the curve), not cut into it: the recipe cuts it flat-floored 0.45 under the top; and the bar follows the curve 0.45 down, so at the rim it hangs 0.45 under the head's underside (0.4487), in the air")
def _bs6():
    r=bankScrew6mx();r.rev='6mx';return r
RECIPES['bankScrew6']=_bs6

def bankScrew1943():
    X,Bk,ROW,nE=_blk();m=Bk['s43'];lT,rH,hc,hd,rs=m['lT'],m['rH'],m['hc'],m['hd'],m['rs'];arc,R4=_cap(rH,hd,lT+hc);top=lT+hc+hd
    src="escapement.js BLK.s43 (the escapement of 1943's block: 8_Kirow_DEC_479_Feder.jpg, 8_Lange_5177_Feder.jpg, 8_Kirow_DEC_422_Feder.jpg; the length from the 6MX's loose block: estimated)"
    r=_bankingScrew('bankScrew43','WN-gkA43',"Banking screw M1.2 along the 1943 block's slit upright, its domed slotted head (its WN number not read)",lT,lambda c,ch,rt:[(0.0,0.0),(rt,0.0),(c,ch),(c,lT),(rH,lT),(rH,lT+hc),arc],rs,rH,top,m['sd'],m['sw'],src,
      lambda crest:[S('shank',f'Ø {crest:.3f}, {lT} long','6g; 8.2 as the 6MX loose block\'s screw (estimated)',src),S('head',f'Ø {2*rH:.1f}, {hc} long under a dome {hd} high',"the photographs: Ø 3.15-3.6 (likely); the dome's rise estimated",src)],
      [["through the slit upright's two leaves, its thread tapped in them; the pipe rests on the head's side"],
       "The banking screw of the escapement of 1943's block; its slit is along the plate, so its two leaves grip the thread from above and below."],
      "the head's slot: the page draws it as a solid dark bar standing 0.01 out of the dome (0.4 wide, 0.5 deep, following the curve), not cut into it: the recipe cuts it flat-floored 0.5 under the top")
    r.rev='1943';return r
RECIPES['bankScrew43']=bankScrew1943

def _cone41(ver):
    X,Bk,ROW,nE=_blk();FD=Bk['first'];CN=FD['cone'];nF=nE-FD['dF'];nA1=nF-FD['w'];nA0=nF if ver=='3955' else nE-FD['nA'];xl=CN['xl'][1 if ver=='3955' else 0]
    u1=nA0-nA1;hF=nA0-CN['nP'];R=CN['R'];c0=hF-CN['hh']+R;rh,rs=CN['rh'],CN['rs'];ytip=u1-CN['ins']+xl+CN['tip'];a1=math.asin(rh/R)
    Z=lambda y:ytip-y   # the lathe's y from the head's apex toward the tail, turned over: the tail's point at z 0, the head up
    top=Z(c0-R);zs=Z(hF);zk=Z(u1-CN['ins']+xl);ang=math.degrees(math.atan2(rs,CN['tip']))
    # from the tail's point up the cone to the shank, the shank, the head's underside, its edge, the dome to its apex
    prof=[(0.0,0.0),(rs,zk),(rs,zs),(rh,zs),(rh,Z(hF-CN['ed'])),((R*math.sin(a1/2),Z(c0-R*math.cos(a1/2))),(0.0,top))]
    th=iso(2*rs);src="escapement.js BLK.first.cone (05 04_1's plan and coloured section; Wempe 3955, 11_Wempe_3955_Gangfeder_plus.jpg, 10_Vergleich_CWW-6MX: head Ø 3.3, a dome R 1.8, 1.5 in all: likely)"
    ops=[Bar(2*rh,top,'Cut and face a bar to the overall length, the point end out',[S('overall',f'{top:.2f}',None,src)],src),
         TurnArcs(prof,"Turn the pointed tail (a cone %.1f° to the shank), the shank Ø %.1f, the head's underside, its edge and the dome R %.1f"%(ang,2*rs,R),
           [S('tail',f'a cone to a point, {CN["tip"]} long','12° written, 10.8° scaled (05 04_1; likely)',src),S('shank',f'Ø {2*rs:.1f}','M1.2',src),S('head',f'Ø {2*rh:.1f}, {CN["ed"]} edge, a dome R {R} rising {CN["hh"]-CN["ed"]:.2f}','plan: 3.29; section 3.31-3.36 (likely)',src)],src),
         ThreadOD(th,zk,zs,f'Cut the thread M{2*rs:g} (die)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src),
         SpinCut(lambda a:bd.Box(2*rh+0.4,2*CN['sw'],CN['sd']+1,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).rotate(bd.Axis.Z,math.degrees(a)).moved(bd.Location((0,0,top-CN['sd']))),
           'Slot the dome across (a saw)',[S('slot',f'{2*CN["sw"]:.2f} wide × {CN["sd"]} deep','the section, the photograph; the slot estimated',src)],src)]
    r=Recipe('cone41' if ver=='first' else 'cone41.3955','cone41',"Banking screw M1.2 of the first-drawn block, domed head and pointed tail (WN-16 by the coloured section)"+(", as Wempe 3955's (0.55 longer)" if ver=='3955' else ''),src,
      'brass, gilt (the photographs: likely)','none',[Setup('1','bar in the collet, the tail end out; slotted at the bench',ops)],page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,ytip,0)),
      fits=["through the arm's slit end, its thread in the arm; the pipe banks on its dome (the detent's spring presses it there)"],
      notes=["Turning the screw sets the depth of lock, 0.25 mm a turn."],
      expect=[{'at':(0,0),'r':rh+0.1,'max':CN['sd']+CN['sz']+0.1,'why':"the dome's slot: the page draws it as a solid dark band standing 0.01 out of the dome (0.3 wide, 0.45 deep, following the curve), not cut into it: the recipe cuts it flat-floored 0.45 under the top"}])
    r.near=1.0;r.free_spin=(math.pi,0.0);r.box_tol=0.03;r.rev=ver;r.show='first -3955' if ver=='first' else None;return r
RECIPES['cone41']=lambda:_cone41('first')
RECIPES['cone41.3955']=lambda:_cone41('3955')

# ---------------- the block's stud as the 6MX's and the escapement of 1943's have it (WN-gk), the 6MX's stop screw (6MX.gke) ----------------
def _studScrew(key,v,q,src,notes):
    """the stud: a slotted cylinder head Ø 3.4 x 5.85 standing out of the plate's outer face, M1.7 into the block; the slot 0.5 wide, 0.9 deep at the heading the page gives it"""
    r_,h_,ln,rs,sl=q;r=screw(key,'WN-gk','Block stud (WN-gk, the '+v+'\'s)',r_,h_,ln,rs,'steel, polished (the photographs: likely)',src,notes)
    r.setups[1].ops[-1]=SlotHead(h_+ln,sl['w'],sl['s'],'Mill the slot across the head',[S('slot',f"{sl['w']} wide × {sl['s']} deep",'estimated',src)],src);r.box_tol=0.03;return r
def studScrew43():
    X,Bk,ROW,nE=_blk();r=_studScrew('studScrew43','escapement of 1943',Bk['s43']['stud'],"escapement.js BLK.s43.stud (HOLES.block43; 2_Kirow_DEC_479_A.jpg, 2_Lange_5177_A.jpg, 6_Kirow_DEC_422_S.jpg: Ø 3.2-3.4, slotted steel: likely)",
      ['Seated on the block\'s plate face, no slide under it; M1.7 3.0 into the block (estimated).']);r.rev='1943';return r
RECIPES['studScrew43']=studScrew43
def studScrew6mx():
    X,Bk,ROW,nE=_blk();r=_studScrew('studScrew6','6MX',Bk['m6']['stud'],"escapement.js BLK.m6.stud (HOLES.block6; 2_Kirow_247_A.jpg, 8_Gangfeder_mit_Kloben_Rus_einfach.jpg: Ø 3.3-3.55, slotted, standing proud of the plate's outer face: likely)",
      ['Through the adjusting slide (2.5) and 3.0 into the block (estimated); it stands 2.5 proud of the plate\'s outer face.']);r.rev='6mx';return r
RECIPES['studScrew6']=studScrew6mx
def stopScrew6mx():
    X,Bk,ROW,nE=_blk();q=Bk['m6']['gke'];r=screw('stopScrew6','6MX.gke',"Detent foot's stop screw (6MX), in the block's side",q[0],q[1],q[2],q[3],'steel (the photographs: likely)',
      "escapement.js BLK.m6.gke (the loose block, 8_Gangfeder_mit_Kloben_Rus_einfach.jpg: a large slotted screw in the base's free side face beside the foot's tail, head Ø 4.0-4.4; its head's height and the thread estimated)",
      ['A stop for the detent foot\'s place along it (README, The Soviet 6MX).']);r.rev='6mx';return r
RECIPES['stopScrew6']=stopScrew6mx

# ---------------- the detent's gold spring screw WN-14 and foot screw WN-gf (escapement.js DETK.gs, DETK.gf; the same in every version) ----------------
def goldScrew():
    K=WDET()['K'];G=K['gs'];r_,hd,dr,rs,t0,t1=G['r'],G['hd'],G['dr'],G['rs'],G['t0'],G['t1'];L=t1;th=dict(d=2*rs,p=0.175,D1=2*rs-1.0825*0.175,H1=0.5413*0.175,es=0.015+0.011*0.175);crest=2*rs-th['es'];ch=min(th['H1'],(L-hd)*0.3);rt=max(crest/2-th['H1']-th['H1']/2,(crest/2-th['H1'])*0.6)
    Z=lambda y:L-y;src="escapement.js DETK.gs (05 04 01-2's head Ø 1.4 estimated; photographs: 10_Wempe_3955_Feder_plus.jpg, 10_Vergleich_CWW-6MX: Ø 1.2-1.6; M0.7: estimated)"
    R=(r_*r_+dr*dr)/(2*dr);a1=math.asin(r_/R)   # the page's parabola dr (r/R0)^2 for the head's top, a circle of the same rise at the rim
    ops=[Bar(2*r_,L,'Cut and face a bar to the overall length, the thread end out',[S('overall',f'{L:.2f}',None,src)],src),
         TurnArcs([(0.0,0.0),(rt,0.0),(crest/2,ch),(crest/2,Z(hd)),(r_,Z(hd)),(r_,Z(dr)),((R*math.sin(a1/2),Z(R-R*math.cos(a1/2))),(0.0,Z(0)))],
           "Turn the shank to the thread's major diameter, the tip, the head and its rounded top",[S('head',f'Ø {2*r_} × {hd}, rounded {dr} at the rim',None,src),S('shank',f'Ø {crest:.3f}','6g',src)],src),
         ThreadOD(th,0,Z(hd),f'Cut the thread M{2*rs:g} (die)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src),
         SpinCut(lambda a:bd.Box(2*r_+0.4,2*G['sw'],G['sd']+1,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).rotate(bd.Axis.Z,math.degrees(a)).moved(bd.Location((0,0,L-G['sd']))),
           'Slot the head across (a saw)',[S('slot',f"{2*G['sw']} wide × {G['sd']} deep",'estimated',src)],src)]
    r=Recipe('goldScrew','WN-14',"Gold spring's screw (WN-14), across into the square",src,'steel, polished (the photographs: likely)','none',[Setup('1','bar in the collet, the thread end out; slotted at the bench',ops)],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,L,0)),fits=["through the gold spring's head into the detent's square, tapped there"],
      expect=[{'at':(0,0),'r':r_+0.1,'max':G['sd']+G['sz']+0.1,'why':"the head's slot: the page draws it as a solid dark bar standing 0.01 out of the rounded top, not cut into it: the recipe cuts it flat-floored 0.15 under the top"}])
    r.near=0.6;r.free_spin=(math.pi,0.0);r.box_tol=0.03;return r
RECIPES['goldScrew']=goldScrew

def footScrew():
    G=WDET()['K']['gf'];r_,hh,rs,l=G['r'],G['hh'],G['rs'],G['l'];L=hh+l;th=iso(2*rs);src="escapement.js DETK.gf (05 04 01-1's foot screw M1; the number not read; the head's size estimated)"
    Z=lambda y:L-y
    ops=[Bar(2*r_,L,'Cut and face a bar to the overall length, the thread end out',[S('overall',f'{L:.2f}',None,src)],src),
         TurnProfile([(0.0,0.0),(rs,0.0),(rs,Z(hh)),(r_,Z(hh)),(r_,L),(0.0,L)],"Turn the shank to the thread's major diameter and the head",[S('head',f'Ø {2*r_} × {hh}','estimated',src),S('shank',f'Ø {2*rs}, {l} long','6g',src)],src),
         ThreadOD(th,0,l,f'Cut the thread M{2*rs:g} (die)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src)]
    return Recipe('footScrew','WN-gf',"Detent foot's screw M1 (WN-13 by the coloured section's label, likely)",src,'steel (not given)','none',[Setup('1','bar in the collet, the thread end out',ops)],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,L,0)),fits=["through the foot's Ø 1.1 hole along it, into the block's end face (M1)"],
      notes=["The page draws the head plain (no slot) and the shank at the thread's major diameter; the recipe follows it."])
RECIPES['footScrew']=footScrew

# ---------------- the detent block as first drawn (05 04_1; Wempe 3955 as photographed): the base with a long arm toward the stone (escapement.js BLK.first) ----------------
def _blockFirst(ver):
    X,Bk,ROW,nE=_blk();s,M=_detFrame();FD=Bk['first'];h13=X['H13'];bd_,tl=Bk['bd'],Bk['tl']
    tF,tT=ROW+Bk['tF'],ROW+Bk['tT'];nF=nE-FD['dF'];nA1=nF-FD['w'];rc=FD['rc'];nC=nA1-rc;tC=tT-FD['tC'];tE=FD['tE'];z0=FD['da']
    p3=ver=='3955';nA0=nF if p3 else nE-FD['nA'];sl=FD['sl'][1 if p3 else 0];h=sl[1]/2;yc=FD['yc'];rh=FD['r'];wA=nA0-nA1
    src="05 04_1 (as first drawn: no sheet of its own, the plan at 10:1, 24.4 px/mm) and Wempe 3955 as photographed (11_Wempe_3955_Gangfeder_plus.jpg, 10_Vergleich_CWW-6MX; escapement.js BLK.first)"
    V=lambda t,n,z:bd.Vector(t,s*n,z);c45=math.sqrt(0.5)
    def body():
        w=bd.Wire([bd.Edge.make_line(V(tE,nA0,z0),V(tT,nA0,z0)),bd.Edge.make_line(V(tT,nA0,z0),V(tT,nC,z0)),bd.Edge.make_line(V(tT,nC,z0),V(tC+rc,nC,z0)),
                   bd.Edge.make_three_point_arc(V(tC+rc,nC,z0),V(tC+rc*c45,nC+rc*c45,z0),V(tC,nA1,z0)),bd.Edge.make_line(V(tC,nA1,z0),V(tE,nA1,z0)),bd.Edge.make_line(V(tE,nA1,z0),V(tE,nA0,z0))])
        return _box(tT,tF,nE-tl,nF,0,bd_,s)+bd.extrude(bd.Face(w),bd_-z0,dir=(0,0,1))
    m17=iso(2*Bk['m17']['rs']);m1=iso(1.0);m12=iso(1.2);zf=2.3
    ops=[Solid(body,'Mill the block from brass: the base 6.5 deep all its length, the arm on its free side from 3.7 to 6.5 under the plate, a cove r %.2f to the base'%rc,
          [S('base',f"{tF-tT:.1f} long, {tl} wide, {bd_} deep",'"6,5" (sure)',src),S('arm',f"{wA:.2f} wide, from {z0} to {bd_} under the plate, {tT-FD['rt']-tE:.1f} from its end to the base"+('' if p3 else f", set back {FD['nA']} from the base's end face"),
            "\"2,8\", \"6,5\" (sure); "+("flush with the base's edge as photographed" if p3 else "2.5 wide on the plan, its far face where the photographs have it (scaled)"),src),
           S('cove',f"r {rc}, centred {FD['tC']} from the base",'scaled (the photographs show the cove)',src)],src),
         Cut(lambda:_box(tE-0.1,tE+sl[0],nA1-0.1,nA0+0.1,yc-h,yc+h,s),"Saw the arm's end slit along the banking screw, through the arm's width",
           [S('slit',f"{2*h:.2f} wide, {sl[0]} from the end, {yc} under the plate",'05 04_1 elevation: 0.2 wide, 6.1 long (sure)' if not p3 else 'Wempe 3955: 5.0-5.3 long, 0.07-0.14 wide (likely)',src)],src),
         Drill((0.0,s*(nA1-0.1),yc),(0,s,0),m12['D1'],wA+0.2,"Drill and tap the banking screw's M1.2 across the arm",[S('',f"M1.2, on the stone's line, {yc} under the plate",'05 04_1 (sure)',src)],src,thread=m12,key='M1.2'),
         Drill((ROW+Bk['pin'][0][0],s*(nE+Bk['pin'][0][1]),-0.01),(0,0,1),2*Bk['pr'],bd_+0.02,"Drill the near steady pin's hole through the base",[S('',f"Ø {2*Bk['pr']}",'(sure)',src)],src,key='pin1'),
         Drill((ROW+Bk['pin'][1][0],s*(nE+Bk['pin'][1][1]),-0.01),(0,0,1),2*Bk['pr'],bd_+0.02,"Drill the far steady pin's hole through the base",[S('',f"Ø {2*Bk['pr']}",'(sure)',src)],src,key='pin2'),
         Drill((ROW,s*(nE+Bk['h13']['n']),-0.01),(0,0,1),2*Bk['h13']['r'],Bk['h13']['d']+0.01,'Drill the Ø 1.3 hole from the plate face, 3 deep',[S('',f"Ø {2*Bk['h13']['r']}, {-Bk['h13']['n']} from the end face",'05 04 01-4 "1,3", "3" (sure)',src)],src,key='h1.3'),
         Drill((h13[0],s*h13[1],-0.01),(0,0,1),m17['D1'],bd_+0.02,'Drill and tap the fixing M1.7 through the base (under hole 13)',[S('',"M1.7",'05 04_1 (the plate\'s hole 13; the photograph puts it further out: README)',src)],src,thread=m17,key='M1.7'),
         Drill((ROW,s*(nE+Bk['h13']['n']),zf),(0,s,0),m1['D1'],-Bk['h13']['n']+0.02,"Drill and tap the M1 for the detent foot's screw from the end face to the Ø 1.3 hole",[S('',f"M1, {zf} under the plate",'05 04 01-4 (sure)',src)],src,thread=m1,key='M1'),
         *[Drill((ROW+t,s*(nE+dn),zf),(0,s,0),2*r,-dn+0.02,"Drill a steady pin's hole in the end face for the detent's foot (at assembly, with the foot)",[S('',f"Ø {2*r:.2f}, {-dn} deep, {abs(t)} either side of the M1",'1436\'s pins (estimated)',src)],src,key=f'p{t:+.1f}') for t,dn,r,_ in Bk['endH'][1:]]]
    vol=math.pi*(rh**2-(m12['D1']/2)**2)*wA
    r=Recipe('detentBlock.first' if not p3 else 'detentBlock.3955','050401-4','Detent block (Gangfederkloben), '+('as first drawn' if not p3 else "as Wempe 3955's is photographed"),src,'brass (not read: 05 04_1 gives no material)','none',
      [Setup('1','brass block on the mill; the end holes drilled with the detent\'s foot at assembly',ops,view='top')],M,faces=("the plate's side","the free side"),
      fits=["screwed to the top plate's inner face by the M1.7 from hole 13, on its two steady pins","the detent's foot clamped to its end face by the M1 WN-gf","the banking screw across the arm's slit end"],
      expect=[{'at':(0.0,s*(nA1+nA0)/2),'r':wA/2+0.3,'max':0.2,'vol':vol,'why':"the banking screw's hole across the arm: the page draws it plain, a bore r 0.62 round the shank's 0.6, the recipe tapped M1.2 at the tap drill (the threads' convention; a hole across has no thread zone)"}],
      notes=["Drawn in the detent's frame (its recipe's): X along the detent, Y across it, Z under the top plate's inner face.",
             "The version as first drawn: a long arm toward the stone in place of the upright, the base's end face %s in from the sheet's line for 1436's thicker foot."%FD['dF']])
    r.rev=ver;r.show='first -3955' if not p3 else None;return r
RECIPES['detentBlock.first']=lambda:_blockFirst('first')
RECIPES['detentBlock.3955']=lambda:_blockFirst('3955')

# ---------------- the Soviet 6MX's detent block (Kirov 247; escapement.js BLK.m6) and its adjusting slide ----------------
def _six():
    X,Bk,ROW,nE=_blk();s,M=_detFrame();U=Bk['up'];M6=Bk['m6'];toD=_toD(X);B6=X['HOLES']['block6'];bl,tl,bd_,td=Bk['bl'],Bk['tl'],Bk['bd'],Bk['td'];ya,yb=U['a'],U['b'];yS=M6['s']
    tF,tT=ROW+Bk['tF'],ROW+Bk['tT'];tU=tF-Bk['len'];nUl=nE-Bk['nl'];nUr=nUl-Bk['uw'];tE6=tU+M6['e'];tS=ROW+U['tS'];rh=U['rh'];hs=M6['hs']
    st=toD(B6['stud']);nS0=st[1]-M6['hw'];nS1=st[1]+M6['hw'];tS6=st[0]-M6['hw'];yN=M6['yN']
    return dict(X=X,Bk=Bk,ROW=ROW,nE=nE,s=s,M=M,U=U,M6=M6,toD=toD,B6=B6,bl=bl,tl=tl,bd=bd_,td=td,ya=ya,yb=yb,yS=yS,tF=tF,tT=tT,tU=tU,nUl=nUl,nUr=nUr,tE6=tE6,tS=tS,rh=rh,hs=hs,st=st,nS0=nS0,nS1=nS1,tS6=tS6,yN=yN)

def blockSix():
    Q=_six();X,Bk,ROW,nE,s,M,U,M6,toD,B6=(Q[k] for k in 'X Bk ROW nE s M U M6 toD B6'.split())
    bl,tl,bd_,td,ya,yb,yS,tF,tT,tU,nUl,nUr,tE6,tS,rh,hs,st,nS0,nS1,tS6,yN=(Q[k] for k in 'bl tl bd td ya yb yS tF tT tU nUl nUr tE6 tS rh hs st nS0 nS1 tS6 yN'.split())
    src="05 04 01-4's form read in first angle as the 6MX has it (8_Gangfeder_mit_Kloben_Rus_einfach.jpg, 10_Vergleich_CWW-6MX_Gangfeder_mit_Kloben.jpg, 8_Kirow_247_F.jpg, 9_KirPol_24020_Feder2.jpg; escapement.js BLK.m6)"
    V=lambda t,n,z:bd.Vector(t,s*n,z);tp=M6['tp'];zf=2.3
    def body():
        # the page's four cells (escapement.js: base6, thin6, nb6, nt6, the stud's notch between them), as it draws them: the thin part's corner stops at the notch's near wall nS0, which lies 0.35
        # beyond the base's side (nE - 6.4), so a strip of the notch's wall 0.35 wide stands only from yN to the thin part's top
        thin=_prism(_tn([(tT,nE-bl),(tT,nE-tl),(tF,nE-tl),(tF,nS0),(tS6,nS0),(tS6,nE-bl)],s),0,td)+_box(tS6,tF,nS0,nE-bl,yN,td,s)
        base=_prism(_tn([(tT,nE),(tT,nE-bl),(tS6,nE-bl),(tS6,nS1),(tF,nS1),(tF,nE)],s),0,bd_)+_box(tS6,tF,nE-bl,nS1,yN,bd_,s)
        up=bd.extrude(bd.Face(bd.Wire.make_polygon([V(tT,nUl,ya),V(tE6,nUl,ya),V(tE6,nUr,ya),V(tT-tp[0],nUr,ya),V(tT,nUr-tp[1],ya)],close=True)),yb-ya,dir=(0,0,1))
        end=_box(tU,tE6,nUr,nUl,ya,yb,s)
        return thin+base+up+end
    m17=iso(2*Bk['m17']['rs']);m1=iso(1.0);m12=iso(1.2);m14=iso(1.4);sq=M6['sq']
    p0,p1=toD(B6['pins'][0]),toD(B6['pins'][1])
    ops=[Solid(body,"Mill the block from brass: the base 6.5 deep at its end, the thin part 3 deep, a notch across the free corner for the slide, the upright 3 × 3 with a short taper into the base",
          [S('base',f"{tF-tT:.1f} long, {bl} wide, {bd_} deep; on to {tl} at {td} deep",'05 04 01-4\'s sizes read in the Soviet block (likely)',src),
           S('upright',f"{Bk['uw']} wide, {yb-ya} thick, {Bk['len']} from the base's foot, {Bk['nl']} in from the end face",'05 04 01-4\'s (likely)',src),
           S('taper',f"{tp[0]} long, widening {tp[1]} into the base (about 27°)",'8_Gangfeder_..., 30.3 px/mm: estimated',src),
           S('notch',f"{2*M6['hw']} wide across the corner of the plate face and the free side, {yN} deep, from the stud to the edge",'the loose block, 8_Gangfeder_...: likely in kind',src)],src),
         Cut(lambda:_box(tU-0.1,tS,nUr-0.1,nUl+0.1,yS-hs,yS+hs,s),"Saw the upright's end slit along the plate, into the screw's hole",[S('slit',f"{2*hs:.2f} wide, ending in the hole",'8_Kirow_247_F.jpg, 9_KirPol_24020_Feder2.jpg: about 0.1 wide, 2.8-2.9 from the end (sure, two chronometers)',src)],src),
         Drill((tS,s*(nUr-0.1),yS),(0,s,0),m12['D1'],Bk['uw']+0.2,"Drill and tap the banking screw's M1.2 across both leaves",[S('',f"M1.2, {-U['tS']} from the base's hole row, {yS} under the plate",'(the screw seen on both Kirov 247 and 24020: likely)',src)],src,thread=m12,key='M1.2'),
         Drill((p0[0],s*p0[1],-0.01),(0,0,1),2*Bk['pr'],M6['p0']+0.01,"Drill the near steady pin's hole 1.2 into the base",[S('',f"Ø {2*Bk['pr']}, {M6['p0']} deep",'(estimated)',src)],src,key='pin1'),
         Drill((p1[0],s*p1[1],-0.01),(0,0,1),2*Bk['pr'],td+0.02,"Drill the far steady pin's hole through the thin part",[S('',f"Ø {2*Bk['pr']}",'(estimated)',src)],src,key='pin2'),
         Drill((st[0],s*st[1],yN),(0,0,1),m17['D1'],M6['sd'],"Drill and tap the stud's M1.7 into the block under the slide",[S('',f"M1.7, {M6['sd']} deep from the notch's floor",'estimated',src)],src,thread=m17,key='M1.7'),
         Drill((tF-sq[0],s*(nE-sq[1]),sq[2]),(1,0,0),m14['D1'],sq[0]+0.1,"Drill and tap the foot's stop screw M1.4 in the free side",[S('',f"M1.4, {sq[0]} deep, {sq[1]} from the end face, {sq[2]} under the plate",'8_Gangfeder_...: estimated',src)],src,thread=m14,key='M1.4'),
         Drill((ROW,s*(nE+Bk['h13']['n']),zf),(0,s,0),m1['D1'],-Bk['h13']['n']+0.02,"Drill and tap the M1 for the detent foot's screw from the end face",[S('',f"M1, {-Bk['h13']['n']} deep, {zf} under the plate",'05 04 01-4 (sure)',src)],src,thread=m1,key='M1'),
         *[Drill((ROW+t,s*(nE+dn),zf),(0,s,0),2*r,-dn+0.02,"Drill a steady pin's hole in the end face for the detent's foot (at assembly, with the foot)",[S('',f"Ø {2*r:.2f}, {-dn} deep, {abs(t)} either side of the M1",'1436\'s pins (estimated)',src)],src,key=f'p{t:+.1f}') for t,dn,r,_ in Bk['endH'][1:]]]
    vol12=math.pi*(rh**2-(m12['D1']/2)**2)*(Bk['uw']-2*hs);vol1=math.pi*(0.5**2-(m1['D1']/2)**2)*(-Bk['h13']['n']);vol14=math.pi*(sq[3]**2-(m14['D1']/2)**2)*sq[0]
    r=Recipe('detentBlock.6mx','050401-4','Detent block (Gangfederkloben), the Soviet 6MX\'s',src,'brass (the photographs)','none',[Setup('1','brass block on the mill; the end holes drilled with the detent\'s foot at assembly',ops,view='top')],M,
      faces=("the plate's side","the free side"),fits=["clamped to the top plate by the stud (M1.7 into the block, through the adjusting slide) on its two steady pins","the detent's foot clamped to its end face by the M1 WN-gf","the adjusting slide in the notch across the corner, under the stud"],
      expect=[{'at':(tS,s*(nUr+nUl)/2),'r':1.8,'max':0.2,'vol':vol12,'why':"the banking screw's hole across the leaves: the page draws it plain, a bore r 0.62 round the shank's 0.6, the recipe tapped M1.2 at the tap drill (the threads' convention; a hole across has no thread zone)"},
              {'at':(ROW,s*(nE+Bk['h13']['n']/2)),'r':1.7,'max':0.2,'vol':vol1,'why':"the end face's M1: the page draws the 6MX's hole at the thread's major diameter (r 0.5, a polygon), where the 1943 block's is at the minor (0.729): the recipe taps it M1 at the tap drill"},
              {'at':(tF-sq[0]/2,s*(nE-sq[1])),'r':1.8,'max':0.2,'vol':vol14,'why':"the stop screw's hole: the page draws a polygon bore of r 0.70 (the thread's major), the recipe taps it M1.4 at the tap drill (a hole across has no thread zone)"}],
      notes=["Drawn in the detent's frame (its recipe's): X along the detent, Y across it, Z under the top plate's inner face.",
             "The Soviet 6MX's block: 05 04 01-4's form (its base, thin part, upright), read in first angle; the upright's end slit along the plate as the German blocks' (Kirov 247, 24020); what clamps it to the plate is not seen (README, Unresolved)."])
    r.rev='6mx';return r
RECIPES['detentBlock.6mx']=blockSix

def slide6mx():
    Q=_six();X,Bk,s,M,B6,st,tS6,tF,nS0,nS1,yN,M6=(Q[k] for k in 'X Bk s M B6 st tS6 tF nS0 nS1 yN M6'.split())
    src="the loose 6MX block (8_Gangfeder_mit_Kloben_Rus_einfach.jpg, 10_Vergleich_CWW-6MX_Gangfeder_mit_Kloben.jpg, 30.3 px/mm across the block; the view tilted 30-36°: likely in kind; escapement.js BLK.m6.hw/yN)"
    hole=2*Bk['m17']['r']
    ops=[Solid(lambda:_box(tS6,tF,nS0,nS1,0,yN,s),"Mill the slide from brass: a key %.1f wide, centred on the stud, from the stud to the block's edge, %.1f deep"%(2*M6['hw'],yN),
          [S('width',f"{2*M6['hw']}",'30.3 px/mm (estimated)',src),S('depth',f"{yN}",'estimated',src),S('length',f"{tF-tS6:.1f}",'from the stud to the edge',src)],src),
         Drill((st[0],s*st[1],-0.01),(0,0,1),hole,yN+0.02,"Drill the stud's clearance hole Ø %.2f through the slide"%hole,[S('',f"Ø {hole}",'the stud M1.7 passes (estimated)',src)],src,key='stud')]
    return Recipe('adjSlide6','6MX.gks',"Adjusting slide (6MX), the detent block's",src,'brass, gilt (the photographs)','none',[Setup('1','brass on the mill',ops,view='top')],M,faces=("the plate's side","the block's side"),
      fits=["flush in the notch across the block's corner, under the stud","how it fits the plate's hole 13 isn't seen (README, Unresolved)"],
      notes=["Altmeppen names it, a gilt piece in a notch across the base's plate face under a slotted cylinder; the stud is the cylinder."])
def _sl6():
    r=slide6mx();r.rev='6mx';return r
RECIPES['adjSlide6']=_sl6
