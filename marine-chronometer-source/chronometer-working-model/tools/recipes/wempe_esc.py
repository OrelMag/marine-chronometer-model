"""The Wempe's escapement-side recipes beyond batch 8 (31 October 2026; PLAN-recipes.md): the balance arm's screws WN-10, the stud's screw WN-11, the compensation
masses' screws WN-12, the detent block's other versions and the hairspring's collet and stud. Their numbers are the page's own (escapement.js, through wempe_load.js)."""
import math
import build123d as bd
from . import (Op,Recipe,Setup,S,iso,Bar,TurnOD,TurnCone,Bore,ThreadOD,TurnProfile,Cut,Bought,Blank,page_matrix)
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
from .wempe import WDET,_detFrame,_box,Drill
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
