"""The Soviet 6MX's electrical seconds contact as recipes (1 November 2026; PLAN-recipes.md, batch 13): the base, the two blocks and the stud, the contact disc and its bracket, the lever, the
staff with its jewel setting, the cock and its cap plate, the contact screw, the contact wheel with its collet and the two springs in the bowl. All hand-built in train.js and case.js from Kirov No. 247's
photographs (Johannes Altmeppen) and Romanov's figures (1975, Figs. 100-101 and p. 105), no works drawing: every size is an estimate, and every sheet says so. The sizes are the page's own (dims.js
WD.CONTACT6 and WD.CT6), never restated. Imported into wempe.py's RECIPES by one line at its end."""
import math
import numpy as np
import build123d as bd
from . import Op,Recipe,Setup,S,page_matrix,Bar,Ring,Plate,Hole,Cut,Bought,Blank,TurnProfile,ThreadOD,CutLeaves,iso,_rev
from .wempe import W
from .wempe_rest import Add

SRC="train.js (the Soviet 6MX's electrical contact: Kirov No. 247's photographs by Johannes Altmeppen, Romanov 1975 Figs. 100-101 and p. 105; no sheet), estimated"
EST="Every size is an estimate from photographs of Kirov No. 247 and Romanov's figures; no works drawing of the 6MX's contact exists. The numbers are the page's (dims.js CONTACT6, CT6)."
RX=[[1,0,0],[0,0,1],[0,-1,0]]   # recipe (x, y, z) to the page: x, up the page's y, plan z = -y
def C6():return W()['WD']['CONTACT6']
def K6():return W()['WD']['CT6']
def P(q):return (q[0],-q[1])   # the page's plan [x, z] to the part's frame (y = -z)
def poly(Q,z=0):return bd.Face(bd.Wire.make_polygon([bd.Vector(x,-y,z) for x,y in Q],close=True))
def cen(Q):return (sum(q[0] for q in Q)/len(Q),sum(q[1] for q in Q)/len(Q))
def th09():return {'d':0.9,'p':0.225,'D1':0.9-1.0825*0.225,'H1':0.5413*0.225,'es':0.015+0.011*0.225}   # KIT's ISOP has M0.9 at 0.225; the recipes' iso() has no key between 0.8 and 1.0
def tapx(at,rp,th,L,why):
    """the page draws a tapped hole plain at the thread's size + 0.02 (radius rp): the recipe drills the tap drill, the thread zone allows half the ring, the rest is this expect's volume"""
    rz=th['D1']/2;v=math.pi*(rp**2-rz**2)*L-0.5*math.pi*((rz+th['H1']+0.05)**2-(rz-0.02)**2)*L
    return {'at':at,'r':rp+0.3,'max':0.05,'why':why,'vol':max(v,0)}
WHY="the page draws the tapped hole plain at the thread's size + 0.02, not the tap drill and a thread"

class Make(Op):
    """stock made of any solid (a union of cylinders, a boss): make() builds it in the part's frame"""
    kind='stock'
    def __init__(self,make,text,sizes=(),src=''):super().__init__(text,sizes,src);self.make=make
    def apply(self,p):return self.make()
def cyl(c,r,z0,z1):return bd.Cylinder(r,z1-z0,align=(bd.Align.CENTER,bd.Align.CENTER,bd.Align.MIN)).moved(bd.Location((c[0],c[1],z0)))
def prism(face,z0,z1):return bd.extrude(face.moved(bd.Location((0,0,z0))),z1-z0,dir=(0,0,1))
def rec(key,hn,title,mat,treat,setups,tp,**kw):
    pc=kw.pop('pieces',None);r=Recipe(key,hn,title,SRC,mat,treat,setups,tp,**{'notes':[EST]+kw.pop('notes',[]),**kw});r.rev='6mx'
    if pc is not None:r.pieces=pc   # the page's meshes of the line this recipe is of (recipes.py's check: pieces)
    return r

# ---------------- the base (Grundplatte 58) ----------------
def ctBase():
    c=C6();k=K6()['base'];y0,y1=k['y'];t=y1-y0;t5=iso(1.4);F=K6()['foot'];fA,fB=c['cockFoot'][1],c['cockFoot'][0];fl=math.hypot(fB[0]-fA[0],fB[1]-fA[1]);fu=((fB[0]-fA[0])/fl,(fB[1]-fA[1])/fl);fv=(-fu[1],fu[0])
    fs=cen(c['cockFoot']);fc=(fs[0]+F['s']*fu[0],fs[1]+F['s']*fu[1]);fp=(fc[0]+F['p']*fv[0],fc[1]+F['p']*fv[1]);fq=(fc[0]-F['p']*fv[0],fc[1]-F['p']*fv[1])
    B=c['bsP']+c['bsM'];ops=[Plate(poly(c['base']),t,'Cut the base from 2 mm brass plate (gilt), the outline milled to the traced lines',[S('thickness',f'{t:g}',None,SRC),S('outline',f'{len(c["base"])} traced points (Fig. 100 on 247\'s photographs)',None,SRC)],SRC)]
    for i,q in enumerate(c['screws56']):ops.append(Hole(P(q),2*k['rS'],'in',t,None,"Drill the clearance hole for a base screw (M1.7) through",[S('hole',f'Ø {2*k["rS"]:g}',None,SRC)],SRC,key='56'+'ab'[i]))
    ex=[]
    for i,q in enumerate(B):
        ops.append(Hole(P(q),t5['D1'],'in',t,None,"Drill and tap M1.4 through for a block screw",[S('thread','M1.4',None,SRC)],SRC,thread=t5,key='b'+str(i)));ex.append(tapx(P(q),k['rB'],t5,t,WHY))
    ops.append(Hole(P(c['staff']),2*k['rSt'],'in',t,None,"Bore Ø 3 through for the staff's jewel setting",[S('bore',f'Ø {2*k["rSt"]:g}','pressed fit (estimated)',SRC)],SRC,key='staff'))
    ops.append(Hole(P(fc),t5['D1'],'in',t,None,"Drill and tap M1.4 through for the cock's screw",[S('thread','M1.4',None,SRC)],SRC,thread=t5,key='cock'));ex.append(tapx(P(fc),k['rF'],t5,t,WHY))
    for i,q in enumerate((fp,fq)):ops.append(Hole(P(q),2*k['rP'],'in',t,k['pY'][1]-k['pY'][0],"Drill Ø 0.8, 1 deep, for a steady pin of the cock",[S('hole',f'Ø {2*k["rP"]:g}, {k["pY"][1]-k["pY"][0]:g} deep',None,SRC)],SRC,key='pin'+str(i)))
    return rec('ct6Base','6MX.ct',"Contact base (6MX, Romanov's 58)",'brass (Ms), gilt','gilt',[Setup('1','plate on the mill, the face for the blocks up',ops,view='top')],page_matrix(RX,(0,y0,0)),faces=('block face','pillar-plate face'),expect=ex,
      notes=["The page's four block screws' holes and the cock screw's are drawn at the thread's size plus 0.02; the recipe drills the tap drill and taps M1.4. The outline is the traced points joined by straight lines."])

# ---------------- the blocks 52 (+) and 57 (-) ----------------
def ctBlock(plus):
    c=C6();k=K6()['blk'];y0,y1=k['y'];t=y1-y0;O=c['blkP' if plus else 'blkM'];BS=c['bsP' if plus else 'bsM'];ops=[Plate(poly(O),t,f'Cut the block from 1.45 mm brass plate (gilt), the outline milled',[S('thickness',f'{t:.2f}',None,SRC)],SRC)]
    for i,q in enumerate(BS):ops.append(Hole(P(q),2*k['rh'],'in',t,None,"Drill the clearance hole for the insulating bush through",[S('hole',f'Ø {2*k["rh"]:g}',None,SRC)],SRC,key=str(i)))
    return rec('ct6BlockP' if plus else 'ct6BlockM','6MX.ctbp' if plus else '6MX.ctbm','Contact block '+('+ (6MX, 52)' if plus else '- (6MX, 57)'),'brass (Ms), gilt','gilt',[Setup('1','plate on the mill',ops,view='top')],page_matrix(RX,(0,y0,0)),faces=('outer face','fibre face'),
      notes=['It lies on the black fibre 68 (a bought line) over the base, the bushes in its two holes.'])

# ---------------- the stud 53 on block 52 ----------------
def ctStud():
    c=C6();k=K6()['sd'];y0,y1=k['y'];t=y1-y0;th=iso(1.2);st=cen(c['stud']);L=k['hy'][1]-k['hy'][0]
    ops=[Plate(poly(c['stud']),t,'Cut the stud from 4.6 mm brass (gilt)',[S('height',f'{t:g}',None,SRC)],SRC),
         Hole(P(st),th['D1'],'in',t,L,"Drill and tap M1.2, 2 deep, in the top for the spiral's clamp screw",[S('thread','M1.2, 2 deep',None,SRC)],SRC,thread=th,key='clamp')]
    return rec('ct6Stud','6MX.ctq','Spiral stud (6MX, 53)','brass (Ms), gilt','gilt',[Setup('1','bar or block on the mill, the top up',ops,view='top')],page_matrix(RX,(0,y0,0)),faces=('top','foot'),expect=[tapx(P(st),k['r'],th,L,WHY)])

# ---------------- the staff 69 ----------------
def ctStaff():
    k=K6();s=k['st'];lb=k['lb'];ca=k['ck']['ca'];ym=ca[1]+s['t0'];Z=lambda y:y-ym
    prof=[(0,0),(s['r0'],0),(s['r0'],Z(ca[1]+s['t1'])),(s['r1'],Z(ca[1]+s['t2'])),(s['r1'],Z(lb[0])),(s['r2'],Z(lb[0])),(s['r2'],Z(s['y0'])),(s['r0'],Z(s['y1'])),(s['r0'],Z(s['y2'])),(0,Z(s['y2']))]
    L=Z(s['y2'])
    ops=[Blank(2*s['r1'],0,L,'Part off steel rod Ø 1.0 to length',[S('overall',f'{L:.2f}',None,SRC)],SRC),
         TurnProfile(prof,'Turn the staff: pivots Ø 0.4, the cone up to Ø 1.0 above the lever\'s seat, Ø 0.6 below it, the lever\'s boss pressed on the Ø 1.0',[S('pivots',f'Ø {2*s["r0"]:g}',None,SRC),S('upper part',f'Ø {2*s["r1"]:g}',None,SRC),S('under the boss',f'Ø {2*s["r2"]:g}',None,SRC)],SRC)]
    return rec('ct6Staff','6MX.ctst','Contact staff (6MX, 69)','steel, hardened and polished','hardened',[Setup('1','rod in the collet, turned',ops)],page_matrix(RX,(0,ym,0)))

# ---------------- the upper jewels' setting ----------------
def ctSetting():
    k=K6()['js'];y0,y1=k['y']
    ops=[Ring(2*k['ro'],2*k['ri'],y1-y0,'Part off brass tube and face to length; the jewel pressed into its bore',[S('outside',f'Ø {2*k["ro"]:g}',None,SRC),S('bore',f'Ø {2*k["ri"]:g}',None,SRC),S('height',f'{y1-y0:g}',None,SRC)],SRC)]
    return rec('ct6Setting','6MX.ctjs',"Staff's upper jewel setting (6MX)",'brass (Ms), gilt','gilt',[Setup('1','tube in the collet, parted off',ops)],page_matrix(RX,(0,y0,0)),notes=['It is pressed into the base\'s Ø 3 bore; the hole jewel and the end stone (bought lines) are pressed into it.'])

# ---------------- the cock ----------------
def cockGeo():
    c=C6();k=K6()['ck'];cA=cen(c['cockArm']);A0=c['cockArm'][0];A1=c['cockArm'][-1];al=math.hypot(A1[0]-A0[0],A1[1]-A0[1]);u=((A1[0]-A0[0])/al,(A1[1]-A0[1])/al);nv=(-u[1],u[0]);sg=math.copysign(1,(cA[0]-A0[0])*nv[0]+(cA[1]-A0[1])*nv[1])
    P4=lambda a,b:(A0[0]+u[0]*a+nv[0]*sg*b,A0[1]+u[1]*a+nv[1]*sg*b);lg=k['lg'];leg=[P4(lg[0],0),P4(lg[1],0),P4(lg[1],lg[2]),P4(lg[0],lg[2])]
    S0=c['staff'];su=k['su'];cs=[(S0[0]+su[0]*q,S0[1]+su[1]*q) for q in k['cs']];return c,k,leg,cs
def ctCock():
    c,k,leg,cs=cockGeo();ca=k['ca'];fy=k['fy'];ym=ca[1];Z=lambda y:y-ym;t=Z(fy[1]);t1=Z(ca[0]);t2=Z(fy[0]);th=th09();t14=iso(1.4);bk=K6()['base'];F=K6()['foot']
    fA,fB=c['cockFoot'][1],c['cockFoot'][0];fl=math.hypot(fB[0]-fA[0],fB[1]-fA[1]);fu=((fB[0]-fA[0])/fl,(fB[1]-fA[1])/fl);fv=(-fu[1],fu[0]);fs=cen(c['cockFoot']);fc=(fs[0]+F['s']*fu[0],fs[1]+F['s']*fu[1])
    fp=(fc[0]+F['p']*fv[0],fc[1]+F['p']*fv[1]);fq=(fc[0]-F['p']*fv[0],fc[1]-F['p']*fv[1])
    def arm():return prism(poly(c['cockArm']),0,t1)+cyl(P(cs[1]),k['ra'],0,t1)
    ops=[Make(arm,"Mill the arm from 1.3 mm brass plate (gilt): the traced outline, its end rounded r 1.6 about the far screw",[S('thickness',f'{t1:g}',None,SRC),S('end',f'r {k["ra"]:g} about the far screw',None,SRC)],SRC),
         Add(lambda:prism(poly(leg),t1,t2),f"Add the leg {k['lg'][2]:g} × {k['lg'][1]-k['lg'][0]:g}, standing {t2-t1:.1f} high from the arm's root (milled from the solid, or soldered)",[S('leg',f'{k["lg"][2]:g} × {k["lg"][1]-k["lg"][0]:g} × {t2-t1:.1f}',None,SRC)],SRC),
         Add(lambda:prism(poly(c['cockFoot']),t2,t),f"Add the foot {t-t2:g} thick on the base",[S('foot',f'{t-t2:g} thick',None,SRC)],SRC),
         Hole(P(c['staff']),2*k['rb'],'in',t,t1,"Bore Ø 1.8 through the arm for the lower jewel",[S('bore',f'Ø {2*k["rb"]:g}',None,SRC)],SRC,key='staff')]
    ex=[]
    for i,q in enumerate(cs):
        ops.append(Hole(P(q),th['D1'],'in',t,k['td'],"Drill and tap M0.9, 1.1 deep, in the arm's underside for a cap plate screw",[S('thread','M0.9, 1.1 deep',None,SRC)],SRC,thread=th,key='cap'+str(i)));ex.append(tapx(P(q),k['rt'],th,k['td'],WHY))
    ops.append(Hole(P(fc),2*bk['rF'],'out',t,t-t2,"Drill Ø 1.44 through the foot for the screw M1.4",[S('hole',f'Ø {2*bk["rF"]:g}',None,SRC)],SRC,key='screw'))
    for i,q in enumerate((fp,fq)):ops.append(Hole(P(q),2*bk['rP'],'out',t,t-t2,"Drill Ø 0.8 through the foot for a steady pin",[S('hole',f'Ø {2*bk["rP"]:g}',None,SRC)],SRC,key='pin'+str(i)))
    return rec('ct6Cock','6MX.ctc','Contact cock (6MX)','brass (Ms), gilt','gilt',[Setup('1','plate on the mill, the arm\'s underside up; the leg and foot added',ops,view='bottom')],page_matrix(RX,(0,ym,0)),faces=('arm underside','foot'),expect=ex,
      notes=["The page's screw holes in the arm are drawn at the thread's size plus 0.02 with a helical thread; the recipe drills the M0.9 tap drill."])

def ctCap():
    c,k,leg,cs=cockGeo();S0=c['staff'];rel=lambda q:(q[0]-S0[0],-(q[1]-S0[1]));ca=k['ca'];t=ca[1]-k['cp']
    def stock():return cyl((0,0),k['rc'],0,t)+cyl(rel(cs[0]),k['rl'],0,t)+cyl(rel(cs[1]),k['rl'],0,t)
    ops=[Make(stock,"Mill the cap plate from 0.5 mm brass (gilt): a lobe r 1.5 about the staff and a lobe r 1.25 about each screw, joined",[S('thickness',f'{t:g}',None,SRC),S('lobes',f'r {k["rc"]:g} and 2 of r {k["rl"]:g}, the screws 2.1 either side',None,SRC)],SRC),
         Hole((0,0),2*k['rb'],'in',t,None,"Bore Ø 1.8 through for the lower end stone's seat",[S('bore',f'Ø {2*k["rb"]:g}',None,SRC)],SRC,key='staff')]
    for i,q in enumerate(cs):ops.append(Hole(rel(q),2*k['rch'],'in',t,None,"Drill Ø 1.0 through for a screw M0.9",[S('hole',f'Ø {2*k["rch"]:g}',None,SRC)],SRC,key=str(i)))
    return rec('ct6Cap','6MX.ctcc','Cock cap plate (6MX)','brass (Ms), gilt','gilt',[Setup('1','plate on the mill',ops,view='top')],page_matrix(RX,(S0[0],k['cp'],S0[1])),faces=('outer face','arm face'))

# ---------------- the contact screw 54 ----------------
def ctScrew():
    c=C6();k=K6()['sk'];s=c['screw54'];sl=math.hypot(s['tip'][0]-s['h'][0],s['tip'][1]-s['h'][1]);r=s['d']/2;th=iso(s['d']);L0=sl-k['l0']
    prof=[(0,0),(r,0),(r,sl-k['l0']),(r,sl-k['l1']),(k['tip'],sl),(0,sl)]
    ops=[Bar(s['d'],sl,'Part off brass rod Ø 1.0 to length',[S('overall',f'{sl:.2f}',None,SRC)],SRC),
         TurnProfile(prof,'Turn the point: a cone over the last 0.3, r 0.08 at the end',[S('point',f'cone over {k["l1"]:g}, r {k["tip"]:g} at the end',None,SRC)],SRC),
         ThreadOD(th,0,L0,f'Cut M{s["d"]:g} ×{th["p"]:g} along {L0:.1f}',[S('thread',f'M{s["d"]:g} × {th["p"]:g}, {L0:.1f} long',None,SRC)],SRC)]
    return rec('ct6Screw','6MX.ctk','Contact screw (6MX, 54)','brass (Ms)','none',[Setup('1','rod in the collet, turned and threaded',ops)],page_matrix(RX,(0,-sl/2,0)),
      notes=["The page turns the thread as grooves 0.06 deep at pitch 0.25 (its pitch estimated); the recipe draws the screw at its major diameter and names the thread (DIN ISO 6410)."])

# ---------------- the lever 60 ----------------
def ctLever():
    c=C6();k=K6();lv=k['lv'];lb=k['lb'];S0=c['staff'];loc=lambda q:(q[0]-S0[0],q[1]-S0[1]);ym=lb[1];Z=lambda y:y-ym;s54=c['screw54']
    stn=c['stone'];SA=lv['sa'];sl0=math.hypot(stn[0]-SA[0],stn[1]-SA[1]);rd=((stn[0]-SA[0])/sl0,(stn[1]-SA[1])/sl0);sc=loc((SA[0]+rd[0]*lv['rs'],SA[1]+rd[1]*lv['rs']))
    eA=(sc[0]-rd[1]*lv['so'],sc[1]+rd[0]*lv['so']);eH=loc(s54['h']);kk=lb[0]+lb[1]-(lv['y'][0]+lv['y'][1]);y0,y1=lv['y'];w=lv['w']
    def boss():return _rev([(lv['rb'][0],0),(lv['rb'][1],0),(lv['rb'][1],Z(lb[0])),(lv['rb'][0],Z(lb[0]))])
    def arm(e):
        e=P(e);l=math.hypot(*e);u=(e[0]/l,e[1]/l);n=(u[1],-u[0],0);V=lambda t,z:bd.Vector(u[0]*t,u[1]*t,z)
        f=bd.Face(bd.Wire.make_polygon([V(0,Z(y0+kk/2)),V(l,Z(y0)),V(l,Z(y1)),V(0,Z(y1+kk/2))],close=True))
        return bd.extrude(f.moved(bd.Location((-n[0]*w/2,-n[1]*w/2,0))),w,dir=n)
    d=(s54['tip'][0]-s54['h'][0],s54['tip'][1]-s54['h'][1]);dl=math.hypot(*d);dd=(d[0]/dl,-d[1]/dl,0);hy=lv['hy'];hz=lv['hz'];hl=hz[1]-hz[0];hw=2*lv['hw'];hh=hy[1]-hy[0];eh=P(eH);ang=math.degrees(math.atan2(dd[1],dd[0]));zc=Z((hy[0]+hy[1])/2)
    def holder():return bd.Box(hl,hw,hh).rotate(bd.Axis.Z,ang).moved(bd.Location((eh[0],eh[1],zc)))
    th=iso(s54['d']);zb=Z(s54['y']);L=hl+0.2
    def bore():return bd.Solid.make_cylinder(th['D1']/2,L,bd.Plane(origin=(eh[0]-dd[0]*L/2,eh[1]-dd[1]*L/2,zb),z_dir=dd))
    ops=[Make(boss,"Turn the boss from steel: Ø 3.0 outside, Ø 1.0 bore, 1.3 long, to press on the staff",[S('outside',f'Ø {2*lv["rb"][1]:g}',None,SRC),S('bore',f'Ø {2*lv["rb"][0]:g}',None,SRC),S('length',f'{Z(lb[0]):g}',None,SRC)],SRC),
         Add(lambda:arm(eA),f"Mill the stone arm from {y1-y0:.1f} mm brass bar (gilt), {w:g} wide, its end sheared up so it rises along its length to the boss (a plane cut at {math.degrees(math.atan2(-kk/2,math.hypot(*eA))):.1f}°), and solder it to the boss",
           [S('width',f'{w:g}',None,SRC),S('length',f'{math.hypot(*eA):.2f}',None,SRC),S('rise at the boss',f'{-kk/2:.1f}',None,SRC)],SRC),
         Add(lambda:arm(eH),f"The same for the screw arm, {math.hypot(*eH):.2f} long toward the holder",[S('length',f'{math.hypot(*eH):.2f}',None,SRC)],SRC),
         Add(holder,f"Solder on the screw's holder, a block {hl:g} along the screw × {hw:g} across × {hh:.1f} high",[S('block',f'{hl:g} × {hw:g} × {hh:.1f}',None,SRC)],SRC),
         Cut(bore,"Drill and tap M1.0 along the holder for the contact screw",[S('thread',f'M{s54["d"]:g}',None,SRC),S('axis',f'{s54["y"]:g} on the page\'s height',None,SRC)],SRC)]
    return rec('ct6Lever','6MX.ctl','Contact lever (6MX, 60)','steel (boss); brass, gilt (arms and holder)','gilt',[Setup('1','the boss turned, the arms and the holder milled and soldered, the holder tapped',ops)],page_matrix(RX,(0,ym,0)),
      expect=[{'at':eh,'r':1.6,'z':(zb-0.6,zb+0.6),'max':0.2,'why':"the page bores the holder at the screw's thread diameter (r 0.5, plain), the recipe at the tap drill",'vol':max(math.pi*(0.25-(th['D1']/2)**2)*hl-0.5*math.pi*((th['D1']/2+th['H1']+0.05)**2-(th['D1']/2-0.02)**2)*hl,0)}],
      notes=["The page draws the arms solid through the staff's seat, and the boss ring bored for the staff; the arms start at the staff's axis. The recipe follows it (the staff's seat is a maker's reaming of the pressed boss).",
             "The contact stone 61 (a bought line) is set in the stone arm's end."])

# ---------------- the contact disc 55 and its bracket ----------------
def discXY():
    c=C6();k=K6()['disc'];D=c['disc'];xy=[]
    for i in range(k['n']*4):
        n=i//4;kk=i%4;r=D['d']/2 if kk<2 else D['d']/2-k['td'];f=(n+(0.5 if kk in(1,2) else 1 if kk==3 else 0))/k['n']*2*math.pi-(k['eps'] if kk==3 else 0);xy.append((r*math.cos(f),r*math.sin(f)))
    return xy
def ctDisc():
    c=C6();k=K6()['disc'];D=c['disc'];t=D['t'];ro=D['d']/2;n=k['n']
    ops=[Blank(D['d'],0,t,f'Part off brass rod Ø {D["d"]} to length {t}',[S('diameter',f'Ø {D["d"]}',None,SRC),S('thickness',f'{t}',None,SRC)],SRC),
         CutLeaves(discXY(),ro+0.1,0,t,f"Cut the straight knurl: {n} square teeth {k['td']} deep round the rim",[S('teeth',f'{n}, square, {k["td"]} deep',None,SRC+' (the depth estimated)')],SRC),
         Cut(lambda:cyl((0,0),k['rc'],-0.01,k['rd']),f"Turn the recess Ø {2*k['rc']:g} × {k['rd']:g} deep in the low face for the axle screw's head",[S('recess',f'Ø {2*k["rc"]:g} × {k["rd"]:g}',None,SRC+' (the photograph\'s 6.1; the depth estimated)')],SRC)]
    return rec('ct6Disc','6MX.ctd','Contact disc (6MX, 55)','brass (Ms), gilt','gilt',[Setup('1','disc turned, knurled, recessed on the lathe or mill',ops)],page_matrix(RX,(0,-t/2,0)),pieces=[0],
      notes=["The disc turns on an axle screw (a bought line) on its bracket on block 57; the page draws the screw's head only. The disc's centre is a web 0.9 thick left by the recess."])
def hmat(t):
    """the matrix of the three.js quaternion setFromUnitVectors((0,1,0), (t[0], 0, t[1])): the shortest turn"""
    a=np.array([0,1.0,0]);b=np.array([t[0],0,t[1]]);b/=np.linalg.norm(b);v=np.cross(a,b);s=np.linalg.norm(v);c=a@b
    if s<1e-12:return np.eye(3)
    V=np.array([[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]]);return np.eye(3)+V+V@V*((1-c)/s**2)
def ctBracket():
    c=C6();k=K6()['disc'];D=c['disc'];th=math.radians(D['th']);t=np.array([-math.cos(th),math.sin(th)]);r=D['r'];ctr=np.array([-r*math.sin(th),D['y'],-r*math.cos(th)])
    q=ctr+np.array([t[0],0,t[1]])*(D['t']/2+k['bk']);q[1]=(k['by'][0]+k['by'][1])/2;a=math.atan2(-t[1],t[0])
    Ry=np.array([[math.cos(a),0,math.sin(a)],[0,1,0],[-math.sin(a),0,math.cos(a)]]);H=hmat(t)
    bx=k['br'];Mb=page_matrix(RX,(0,-bx[1]/2,0));Mw=np.eye(4);Mw[:3,:3]=Ry;Mw[:3,3]=q;Mr=np.eye(4);Mr[:3,:3]=H;Mr[:3,3]=ctr
    M=np.linalg.inv(Mr)@Mw@Mb
    face=bd.Face(bd.Wire.make_polygon([bd.Vector(-bx[0]/2,-bx[2]/2,0),bd.Vector(bx[0]/2,-bx[2]/2,0),bd.Vector(bx[0]/2,bx[2]/2,0),bd.Vector(-bx[0]/2,bx[2]/2,0)],close=True))
    ops=[Plate(face,bx[1],f'Mill the bracket from {bx[1]:g} mm brass bar: {bx[0]:g} thick (along the disc\'s axis) × {bx[2]:g} across × {bx[1]:g} high',[S('block',f'{bx[0]:g} × {bx[2]:g} × {bx[1]:g}',None,SRC)],SRC)]
    return rec('ct6DiscBracket','6MX.ctd','Contact disc bracket (6MX)','brass (Ms), gilt','gilt',[Setup('1','bar on the mill',ops,view='top')],M,pieces=[2],notes=["The bracket on block 57's low end carries the disc's axle; the page draws a plain block (no hole for the axle screw, no fixing to the block). A maker drills and fits it."])

# ---------------- the contact wheel 62 and its collet ----------------
def ctWheel():
    c=C6();k=K6()['wh'];W6=c['wheel'];rt=W6['tip']/2;rr=W6['root']/2;th=W6['y'][0]-W6['y'][1];n,sw,R0,R1=W6['spokes'],k['sw'],k['hub'],W6['rim']/2;P2=lambda r,d:bd.Vector(r*math.cos(math.radians(d)),r*math.sin(math.radians(d)),0)
    def teeth():
        E=[];pres=[i for i in range(60) if i!=k['miss']];cur=None
        for j,i in enumerate(pres):
            cc=k['c0']+k['p']*i;pts=[P2(rr+(rt-rr)*q/k['sn'],cc+k['a']*q/k['sn']) for q in range(k['sn']+1)];nxt=k['c0']+k['p']*pres[(j+1)%len(pres)]+(360 if j+1==len(pres) else 0)
            E.append(bd.Edge.make_spline(pts));e2=P2(rr,cc+k['a']+k['e']);E.append(bd.Edge.make_line(pts[-1],e2))
            a0=cc+k['a']+k['e'];E.append(bd.Edge.make_three_point_arc(e2,P2(rr,(a0+nxt)/2),P2(rr,nxt)))
        f=bd.Face(bd.Wire(E));return bd.extrude(f,th,dir=(0,0,1))
    def stock():
        return teeth()
    def spokes():
        d1=math.asin(sw/2/R1);d0=math.asin(sw/2/R0);sol=None
        for j in range(n):
            a0=j/n*2*math.pi;a1=(j+1)/n*2*math.pi;Q=lambda r,t:bd.Vector(r*math.cos(t),r*math.sin(t),-0.01)
            e=[bd.Edge.make_three_point_arc(Q(R1,a0+d1),Q(R1,(a0+a1)/2),Q(R1,a1-d1)),bd.Edge.make_line(Q(R1,a1-d1),Q(R0,a1-d0)),bd.Edge.make_three_point_arc(Q(R0,a1-d0),Q(R0,(a0+a1)/2),Q(R0,a0+d0)),bd.Edge.make_line(Q(R0,a0+d0),Q(R1,a0+d1))]
            x=bd.extrude(bd.Face(bd.Wire(e)),th+0.02,dir=(0,0,1));sol=x if sol is None else sol+x
        return sol
    ops=[Make(stock,f"Blank the wheel from {th:g} mm brass plate and cut its 59 ratchet teeth (the 60th taken out for the minute): each a spiral slope rising {rt-rr:g} over {k['a']:g}°, then the radial face, then the root",
          [S('thickness',f'{th:g}',None,SRC),S('tips',f'Ø {W6["tip"]:g}',None,SRC+' (the tips likely, the depth estimated)'),S('roots',f'Ø {W6["root"]:g}',None,SRC),S('teeth','60 places, tooth 59 missing',None,'Romanov Figs. 100-101; 6_Kirow_009_S')],SRC),
         Cut(spokes,f'Cross it out: {n} spokes',[S('spokes',f'{n}, {sw:g} wide',None,SRC),S('hub',f'Ø {2*R0:g}',None,SRC),S("rim's inside",f'Ø {2*R1:g}',None,SRC)],SRC,at=(0,0)),
         Hole((0,0),W6['collet'],'in',th,None,"Bore Ø 2.0 for the collet's seat",[S('bore',f'Ø {W6["collet"]:g}',None,SRC)],SRC,key='bore')]
    return rec('ct6Wheel','6MX.cw','Contact wheel (6MX, 62)','brass (Ms), gilt','gilt',[Setup('1','on the wheel-cutting engine or the mill, then crossed out',ops,view='top')],page_matrix(RX,(0,-th/2,0)),pieces=[0],faces=('train side','dial side'),
      notes=["It is riveted on its collet, on the seconds arbor under the seconds wheel. The page's teeth are chords of the spiral (6 to a slope) and of the root circle; the recipe draws the spiral as a spline and the root as arcs."])
def ctCollet():
    c=C6();k=K6()['wh'];W6=c['wheel'];ym=(W6['y'][0]+W6['y'][1])/2;cy=W6['colY'];L=cy[0]-cy[1]
    ops=[Ring(W6['collet'],k['cb']+2*k['ce'],L,f'Turn the collet from brass: Ø {W6["collet"]:g} outside, bore Ø {k["cb"]+2*k["ce"]:g}, {L:g} long',[S('outside',f'Ø {W6["collet"]:g}',None,SRC),S('bore',f'Ø {k["cb"]+2*k["ce"]:g}',None,SRC),S('length',f'{L:g}',None,SRC)],SRC)]
    return rec('ct6Collet','6MX.cw','Contact wheel collet (6MX)','brass (Ms), gilt','gilt',[Setup('1','bar in the collet, turned and parted off',ops)],page_matrix(RX,(0,cy[1]-ym,0)),pieces=[1],
      notes=["It rides on the seconds arbor (the page's Ø 1.5 bore, 0.001 over); the wheel is riveted to it."])

# ---------------- the bought lines ----------------
def ct6Bought():
    c=C6();k=K6();st=c['stud'];return [
      Bought('ct6Clamp','6MX.ctqs',"Spiral stud's clamp screw (6MX)","a slotted steel cheese-head screw clamping the spiral's end in the stud's notch",'M1.2 × 2.0, head Ø 2.2 × 1.0','ISO 1207 M1.2, cut to length','steel',SRC,
        ['The page draws a thread of r 0.6 and a head Ø 2.2 (the photograph\'s 2.2: likely).']),
      Bought('ct6Nut','6MX.ctn','Contact screw lock nut (6MX)',"a brass hex lock nut on the contact screw's thread, against the holder",'M1.0 hex nut, 0.5 thick (the page draws 1.1 across the corners)','ISO 4035 M1 thin nut, brass','brass',SRC,
        ["Page fault: the page's hex is 1.1 across the corners (0.95 across the flats) with a bore of Ø 1.0 drawn through it, so the bore cuts through all six flats (a flat is 0.476 from the axis, the bore 0.5); no nut can be cut to it. A standard M1 nut is 2.5 across the flats. Bought here; the page is not changed."]),
      Bought('ct6Spiral','6MX.cth',"Contact spiral (6MX, 59) with its collet",'a flat spiral of copper-coloured strip, 0.6 high × 0.1, seven turns from Ø 3.9 at the collet to Ø 8.9, then straight out over the stud and bent down into its notch; its small brass collet (Ø 3.8 × 0.8, bore Ø 1.0) pressed on the staff','strip 0.6 × 0.1, about 7 turns; collet Ø 3.8 × 0.8','copper or phosphor-bronze strip, wound on a former; brass collet turned','copper, brass',SRC,
        ["The spiral is formed by hand from strip, the collet turned: a bought strip and a turned ring, not a machined part. The lead to block 52 is the spiral's own end, clamped in the stud (Romanov: the lead from block 52's stud 53, which also returns it).","The collet turns with the lever on the staff; the spiral's other end is fixed to the stud."]),
      Bought('ct6Axle','6MX.ctd','Contact disc axle screw (6MX)',"a slotted steel axle screw in the disc's recess, on which the disc turns to renew the contact",'head Ø 2.6 × 0.8 (the photograph: likely); the shank is not drawn','steel screw to size','steel',SRC,
        ['The page draws the head only, 0.8 high, in the recess; the shank into the bracket is not drawn (a maker makes it M1).'])]
def wn12a():
    return Bought('wn12a','WN-12a',"Poising screw for the compensation masses' tapped tops (not fitted)","a cheese-head screw M1.2 for the tapped hole in the middle of a mass's top, fitted where a poising wants it",'M1.2 × up to 2.0 (the hole is 2.0 deep and stops 0.64 short of the rim); the head is not sized on the sheets','a watch screw to size, steel','steel',
      "05 03_2 (the plan's leader to a double circle at the mass's centre); the coloured section draws a cheese head on a flat top in one mass",
      ["Not fitted: the holes in all four masses are drawn empty (the owner's choice, 28 October 2026); the page draws no screw (qty 0). The sources show the thread 1.17 wide and 1.9-2.0 deep under a cheese head; no sheet sizes the head, so none is given here."])

# ---------------- the two contact springs 66 in the bowl (case.js) ----------------
def ctSpring(i):
    cf=K6()['cf'];yF=cf['yF'];rI=cf['rI'];h=cf['h'];F0,F1,T0,T1=cf['sp'][i][:4];ro=rI-cf['ins'];ri=rI-cf['fi'];H=2*h;D=math.pi/180
    Pq=lambda r,a:bd.Vector(r*math.cos(a),r*math.sin(a),0);a0,a1=(F0+90)*D,(F1+90)*D;am=(a0+a1)/2
    def foot():
        E=[bd.Edge.make_three_point_arc(Pq(ro,a0),Pq(ro,am),Pq(ro,a1)),bd.Edge.make_line(Pq(ro,a1),Pq(ri,a1)),bd.Edge.make_three_point_arc(Pq(ri,a1),Pq(ri,am),Pq(ri,a0)),bd.Edge.make_line(Pq(ri,a0),Pq(ro,a0))]
        return bd.extrude(bd.Face(bd.Wire(E)),H,dir=(0,0,1))
    n=cf['n'];tw=(T1-T0)/n;gap=cf['gap']/(rI-cf['fi'])/D;y0=yF+h;y1=cf['y1'];r0=rI-cf['tm'];r1=cf['r1']+cf['r1e'];ln=math.hypot(y1-y0,r0-r1);lean=math.atan2(r0-r1,y1-y0);wd=(tw-gap)*D*(rI-cf['tm'])
    def tine(k):
        tm=T0+tw*(k+0.5);ry=tm*D+math.pi;rx=-lean;Ry=np.array([[math.cos(ry),0,math.sin(ry)],[0,1,0],[-math.sin(ry),0,math.cos(ry)]]);Rx=np.array([[1,0,0],[0,math.cos(rx),-math.sin(rx)],[0,math.sin(rx),math.cos(rx)]]);R=Ry@Rx
        c=np.array([-(r0+r1)/2*math.sin(tm*D),(y0+y1)/2,-(r0+r1)/2*math.cos(tm*D)]);m=lambda v:(float(v[0]),float(-v[2]),float(v[1]))   # the page's (x, y, z) in the part's frame: x, -z, y
        cr=m(c-np.array([0,yF-h,0]));return bd.Box(wd,ln,cf['tt']).moved(bd.Location(bd.Plane(origin=cr,x_dir=m(R[:,0]),z_dir=m(R[:,2]))))
    ops=[Make(foot,f"Mill the foot from brass: an arc band r {ri:g} to {ro:g} ({ro-ri:g} thick), {F1-F0:g}° long, {H:g} high, curved to the bowl's bore",[S('radii',f'r {ri:g} to {ro:g}',None,SRC),S('arc',f'{F1-F0:g}°',None,SRC),S('height',f'{H:g}',None,SRC)],SRC)]
    for k in range(n):ops.append(Add(lambda k=k:tine(k),f"Solder tine {k+1} to the foot's top edge: a strip {wd:.2f} wide × {ln:.2f} long × {cf['tt']:g} thick, leaning in {math.degrees(lean):.1f}° to bear on the block's end",[S('strip',f'{wd:.2f} × {ln:.2f} × {cf["tt"]:g}',None,SRC),S('lean',f'{math.degrees(lean):.1f}°',None,SRC)],SRC))
    r=rec('ct6SpringA' if i==0 else 'ct6SpringB','6MX.cf','Contact spring '+('A (+)' if i==0 else 'B (-)')+' (6MX, 66)','brass (Ms)','none',[Setup('1','the foot milled on the rotary table; the three tines cut from sheet and soldered',ops)],page_matrix(RX,(0,yF-h,0)),
      notes=["The page draws the foot and each tine as separate pieces (the tines' lower ends overlap the foot's top by 0.016); the screws that hold the foot to the bowl go through the wall into it, and the page draws no holes for them in the foot (a maker drills and taps them). The foot's black insulating strip and the screws, washers and terminals are bought lines."])
    r.root_i=i;r.near=2.0;return r

RECIPES={'ct6Base':ctBase,'ct6BlockP':lambda:ctBlock(True),'ct6BlockM':lambda:ctBlock(False),'ct6Stud':ctStud,'ct6Staff':ctStaff,'ct6Setting':ctSetting,'ct6Cock':ctCock,'ct6Cap':ctCap,'ct6Screw':ctScrew,'ct6Lever':ctLever,
         'ct6Disc':ctDisc,'ct6DiscBracket':ctBracket,'ct6Wheel':ctWheel,'ct6Collet':ctCollet,'wn12a':wn12a}
for _b in ct6Bought():RECIPES[_b.key]=(lambda b=_b:b)
RECIPES['ct6SpringA']=lambda:ctSpring(0);RECIPES['ct6SpringB']=lambda:ctSpring(1)
