"""The Wempe's case, as recipes (Batch 11, 31 October 2026; PLAN-recipes.md): the gimbal ring and its bracket, the knurled lock nuts, the pivot screws, the case brackets, the
closing plate, the bowl and the bezel (case.js; the sizes in dims.js CASEQ and CASE). The page's frame: the case's own, y up; a recipe's axis Z is the page's y, its plan
(X, Y) the page's (x, -z), so a page angle a (atan2(z, x)) is -a here. Its holes (sweepS in case.js) are straight cylinders along a radius, not curved ones: an exact Drill."""
import functools,math
import build123d as bd
from . import Op,Recipe,Setup,S,iso,page_matrix,Ring,Bar,TurnOD,TurnCone,ThreadOD,SlotHead,Blank,Bought
from .ops_case import Revolve,Sector,TurnIn,DrillT,Point,Note,rev_items
from .wempe import W,WMW

def Q():return W()['WD']['CASEQ']
def YPf():y=Q()['Y'];return y['YB']-y['YSEAT']
def UP(y0):return page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,y0,0))   # recipe Z = page y (from y0), recipe Y = -page z
def pol(a,r):return (r*math.cos(-a),r*math.sin(-a))
def rad(a,r0,r1,z,d,text,sizes=(),src='',thread=None,key=''):
    """a straight hole along the radius at page angle a, diameter d, from radius r0 to r1 at height z"""
    u=(math.cos(-a),math.sin(-a),0);return DrillT((r0*u[0],r0*u[1],z),u,d,r1-r0,text,sizes,src,thread=thread,key=key)

# ---------------- the gimbal ring (Kardanring 05 01 00-5) and its bracket (Kardanringkloben 05 01 00-6) ----------------
def gimbalRing():
    R=Q()['RG'];RI,RO,hh=R['RI'],R['RO'],R['hh'];YP=YPf();ss=math.asin(R['bs']/2/R['br']);lk=R['lk'];src='05 01 Schnitt A-B, C-D and the elevation (no sheet of its own: case.js)'
    m5=iso(5.0);m25=iso(2.5);z0=hh-lk['dy']+lk['y0'];z1=hh-lk['dy']+lk['y1'];a0,a1=[(90-d)*math.pi/180 for d in lk['a']]
    ops=[Ring(2*RO,2*RI,2*hh,'Turn the ring from a brass casting or tube, faced to height',[S('outside',f'Ø {2*RO:g}','likely ±0.2',src),S('inside',f'Ø {2*RI:g}',None,src),S('height',f'{2*hh:g}','centred on the pivots; likely ±0.3',src)],src),
      rad(0,R['tb'],RO+0.5,hh,2*R['tp'],"Drill the 3 o'clock pivot tip's hole, blind from the outside, its floor flat",[S('hole',f'Ø {2*R["tp"]:g}, floor at r {R["tb"]}','"leicht spielend" on the tip Ø 3.1',src)],src),
      rad(math.pi,RI-0.5,RO+0.5,hh,2*R['tp'],"Drill the 9 o'clock pivot tip's hole through",[S('hole',f'Ø {2*R["tp"]:g}','"leicht spielend"',src)],src)]
    for s in (-1,1):ops.append(rad(s*math.pi/2,RI-0.5,RO+0.5,hh,m5['D1'],f"Drill and tap M5 through the ring at {'12' if s<0 else '6'} o'clock for the inner pivot screw (WN-79)",[S('tap drill',f'Ø {m5["D1"]:.3f}',None,'ISO 261'),S('thread','M5',None,'05 01 Schnitt C-D, 4.9')],src,thread=m5))
    for s in (-1,1):ops.append(rad(s*ss,RI-0.5,RO+0.5,hh,m25['D1'],"Drill and tap M2.5 through the ring for the bracket's screw (WN-kr)",[S('tap drill',f'Ø {m25["D1"]:.3f}',None,'ISO 261'),S('thread','M2.5',None,'05 01 Schnitt A-B')],src,thread=m25))
    ops.append(Sector([(RI-1,z0),(RO+1,z0),(RO+1,z1),(RI-1,z1)],-a1,-a0,'cut',"Mill the transit lock's window through the band between two radial planes",[S("from 6 o'clock toward 3",f'{lk["a"][1]:g}° to {lk["a"][0]:g}°','±1°',src),S('height',f'{z1-z0:g}, its floor {z0:g} over the ring\'s underside','estimated 0.5 over and under the lever',src)],src))
    return Recipe('gimbalRing','050100-5','Gimbal ring (Kardanring)','05 01 (no sheet of its own): Schnitt A-B, C-D and the elevation',"brass (Ms; no sheet gives it; Wempe 3955's is Bakelite)",'none',[Setup('1','ring in the chuck, then on the drill and mill',ops,view='top')],UP(YP-hh),
      notes=["The page draws M5 and M2.5 tapped holes at the thread's size (r 2.52, 1.27); here they are drilled at the tap drill and tapped by convention (DIN ISO 6410).",'Its holes are straight along a radius.'])
def ringBracket():
    R=Q()['RG'];bk=R['bk'];RO=R['RO'];YP=YPf();q=bk['q']/RO;ss=math.asin(R['bs']/2/R['br']);zm=-min(dy for _,dy in bk['sec']);src="05 01, the elevation at 3 o'clock (case.js)"
    items=[(RO+dr,dy+zm) for dr,dy in bk['sec']];w=bk['sec'][2][0]
    ops=[Sector(items,-q,q,'stock',"Mill the bracket from brass strip bent to the ring's outside, its outer edges bevelled 2.0 × 2.0",[S('length along the ring',f'{2*bk["q"]:g}','likely',src),S('thickness',f'{w:g}','likely',src),S('height',f'{2*zm:g}','15.4 at the ring ±0.4',src),S('bevels','2.0 × 2.0','likely',src)],src),
      rad(0,RO-0.5,RO+w+0.5,zm,2*R['tp'],"Drill the pivot tip's hole through",[S('hole',f'Ø {2*R["tp"]:g}','"leicht spielend"',src)],src)]
    for s in (-1,1):ops.append(rad(s*ss,RO-0.5,RO+w+0.5,zm,2*bk['cl'],"Drill the screw's clearance hole through",[S('hole',f'Ø {2*bk["cl"]:g}','clear for M2.5 (the slots of "Kloben verstellen" not drawn)',src)],src))
    return Recipe('ringBracket','050100-6',"Gimbal ring bracket (Kardanringkloben)",'05 01 (no sheet of its own)','brass (Ms)','none',[Setup('1','on the mill',ops,view='top')],UP(YP-zm))

# ---------------- the knurled lock nuts (Kontermutter WN-400) ----------------
def nut(key,hn,title,tag,where,centred=False):
    N=Q()['NUT'][tag];r,d,h,n,hr=N['r'],N['d'],N['h'],N['n'],N['hr'];pitch=math.pi*2*r/n;src='05 01 Schnitt C-D (WN-400, 10 on 05 01); case.js'
    return Recipe(key,hn,title,'05 01 (WN-400, 10 on 05 01; no sheet of its own)','brass (the parts list: knurled brass)','none',[Setup('1','bar in the collet, then knurled',[
      Ring(2*r,2*hr,h,'Part off a ring from brass bar, bored and faced',[S("outside (the knurl's tips)",f'Ø {2*r:g}',None,src),S('bore',f'Ø {2*hr:g}','thread not drawn (the page draws the bore plain: estimated)',src),S('height',f'{h:g}',None,src)],src),
      Note('turn',(r-d-0.05,r+0.05,0,h),f'Knurl the rim straight, DIN 82 RAA {pitch:.1f}',[S('knurl',f'RAA {pitch:.1f}, {n} teeth, {d:g} deep',None,f'DIN 82 (the page draws {n} straight teeth)')],src)])],
      UP(-h/2 if centred else 0),notes=[f'The knurl is drawn as its nominal cylinder at the tips (Ø {2*r:g}); the page draws {n} teeth {d:g} deep.',where])
def nutA():return nut('nutA','WN-400','Lock nut, inner pivot (WN-400)','a',"Inside the ring against its inner face at 12 and 6 o'clock (05 01 Schnitt C-D: Ø 22 × 2.4).")
def nutW():return nut('nutW','WN-400.w','Lock nut, outer pivot (WN-400)','w',"Against each side wall's inside round the M6 of the outer pivots (05 01: Ø 23 × 2).",True)

# ---------------- the case brackets (Gehäusekloben 05 01 00-3) and the locking bracket (Feststellkloben 05 01 00-4) ----------------
def caseBracket():
    B=Q()['BR'];YP=YPf();a=math.pi/2;w=B['bw']/B['bwr'];wl=math.radians(B['wl']);ss=math.asin(B['sp']/B['sr']);hmin=min(h for _,h in B['KF']);src='05 01 Schnitt C-D, A-B and the elevation (no sheet of its own: case.js)'
    z=lambda h:h-hmin;KF=[(r,z(h)) for r,h in B['KF']];KB=[(r,z(h)) for r,h in B['KB']]
    ops=[Sector(KF,-(a+wl),-(a-wl),'stock',"Cut the foot from brass plate, bent to the body's band and body (its inside stepped r 54 over and 53 under: estimated)",[S('foot',f'{2*B["sr"]*math.sin(wl):.1f} long at its outside, r 53 to 57.7, 12.0 high','C-D 8.3 to 20.3 taken; ±0.4',src)],src),
      Sector(KB,-(a+w),-(a-w),'add',"Add the boss: 9.0 wide between radial sides, its section r 60.3 to 64.3 up to 4.8 over the pivots' line",[S('boss width',f'{2*B["bw"]:g} at r {B["bwr"]}','the elevation 9.0 ±0.5',src),S('boss face',f'r {B["pa"]} to {B["pb"]}',"5.8 inside the ring's",src)],src),
      rad(a,B['pa']-0.5,B['pb']+0.5,z(0),2*B['pr'],"Drill the pivot's hole through the boss",[S('hole',f'Ø {2*B["pr"]:g}','"Lagerstellen a u. b leicht spielend" on the tip Ø 3.0',src)],src)]
    for s in (-1,1):ops.append(rad(a+s*ss,B['s0'],B['s0']+B['sl'],z(B['sdy']),B['sd'],"Drill the screw's clearance hole through the foot",[S('hole',f'Ø {B["sd"]:g}','clear for the M4; the slots of "Kloben verstellen" not drawn',src)],src))
    return Recipe('caseBracket','050100-3','Case bracket (Gehäusekloben)','05 01 (no sheet of its own)','brass (Ms)','none',[Setup('1','on the mill',ops,view='top')],UP(YP+hmin),
      notes=["Two of them, at 12 and 6 o'clock, screwed to the bowl by two WN-78 each (\"Kloben verstellen bis Gleichgewicht erreicht ist\"). The page cuts the screw holes as 24-sided polygons whose flats lie at the radius."])
def lockBracket():
    L=Q()['LB'];YP=YPf();a=-math.radians(L['a']);P=L['P'];hmin=min(h for _,h in P['LO']);src='05 01 Schnitt A-B and the elevation (case.js; no sheet of its own)'
    def slab(pts,t0,t1):
        f=bd.Face(bd.Wire.make_polygon([bd.Vector(r,0,h-hmin) for r,h in pts],close=True));return bd.extrude(f,t1-t0,dir=(0,1,0)).moved(bd.Location((0,t0,0)))
    def make():
        sol=slab(P['LO'],-L['tw'],L['tw'])+slab(P['NK'],L['tn'],L['tw'])+slab(P['HD'],-L['tw'],L['tw']);return sol.rotate(bd.Axis.Z,math.degrees(a))
    class Stock(Op):
        kind='stock'
        def apply(self,p):return make()
    u=(math.cos(a),math.sin(a),0);r0=L['rb']-L['hr0']
    ops=[Stock("Mill the bracket from brass: a foot, a crank leaning out to an upright, a neck under a head, across the upright a slot open on the 6 o'clock side",[S('width',f'{2*L["tw"]:g}','likely ±0.4',src),S('neck from',f'{L["tn"]:g} to {L["tw"]:g} across',"the slot open on the 6 o'clock side",src),S('heights over the pivots','-25.8 to 5.9','likely ±0.4',src)],src),
      DrillT((r0*u[0],r0*u[1],L['hy']-hmin),u,L['hd'],L['rb']+L['off']+0.5-r0,"Drill the screw's clearance hole through the foot",[S('hole',f'Ø {L["hd"]:g}','clear for the M2.5 (estimated)',src)],src)]
    ax=math.hypot(L['rb']+L['off']/2,0);bx=(ax*math.cos(a),ax*math.sin(a))
    return Recipe('lockBracket','050100-4','Locking bracket (Feststellkloben)','05 01 (no sheet of its own)','brass (Ms)','none',[Setup('1','on the mill',ops,view='top')],UP(YP+hmin),
      notes=["At 50° from 6 o'clock toward 3; the transit lock's lever turns in through the ring's window and stops against its neck. The page cuts the hole as a 20-sided polygon whose flats lie at the radius."],
      expect=[{'at':bx,'r':5.0,'max':0.06,'why':"the screw's hole through the foot (fusee.js's bore through holeCut, closed by capFix) joins its two mouths with wall triangles that skip round the hole: chords up to 0.05 off its circle; the fault of the detent's and the gold spring's holes"}])

# ---------------- a screw with a plain tip beyond its thread (WN-79, WN-80) ----------------
def screwT(key,hn,title,r,h,ln,rs,material,src,tip,notes=()):
    """wempe.screw's slotted cheese head and thread, and a plain tip beyond the thread's end: tip (radius, length beyond the thread, end chamfer); Z = 0 at the tip's end"""
    tr,tl,tch=tip;th=iso(2*rs);c=min(0.35,r*0.14);w=max(0.35,r*0.2);s_=max(min(0.55,h*0.45),c+0.05);crest=2*rs-th['es'];ch=min(th['H1'],ln*0.3);root=crest/2-th['H1'];rt=max(root-th['H1']/2,root*0.6);Lt=tl+ln
    return Recipe(key,hn,title,f'{hn} (Wempe standard part; its sheet is not in the set)',material,'none',[
      Setup('1','bar in the collet, the tip end out',[
        Bar(2*r,h+Lt,'Part off and face to the overall length',[S('overall',f'{h+Lt:.2f}',None,src)],src),
        TurnOD(crest,tl,Lt,"Turn the shank to the thread's major diameter",[S('shank',f'Ø {crest:.3f}','6g (es %.3f)'%th['es'],'ISO 965')],src),
        TurnOD(2*tr,0,tl,'Turn the pivot tip',[S('tip',f'Ø {2*tr:g} × {tl:g}','"leicht spielend" in its bore',src)],src),
        TurnCone(tr-tch,0,tr,tch,"Chamfer the tip's end",[S('chamfer',f'{tch:g} × 45°',None,src)],src),
        TurnCone(rt,tl,crest/2,tl+ch,"Chamfer the thread's start",[S('chamfer',f'Ø {2*rt:.2f}',None,'KIT threadGeo')],src),
        ThreadOD(th,tl,Lt,f'Cut the thread M{2*rs:g} (die or single point)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src)]),
      Setup('2','reversed, held on the thread in a split bush',[
        TurnCone(r-c,h+Lt,r,h+Lt-c,"Chamfer the head's top 45°",[S('head',f'Ø {2*r:.2f} × {h:.2f}',None,src),S('chamfer',f'{c:.2f} × 45°',None,'KIT headGeo')],src),
        SlotHead(h+Lt,w,s_,'Mill the slot across the head',[S('slot',f'{w:.2f} wide × {s_:.2f} deep',None,'KIT headGeo')],src)])],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,Lt,0)),notes=list(notes)+["The slot's width and depth are the model's convention (KIT headGeo), no drawing's."])
def _hd(f,r,bound):
    """a screw whose head the kit draws a 32-sided polygon: its chords lie r(1 - cos(pi/32)) inside the true circle the recipe turns (a head over about Ø 8 passes 0.02)"""
    def g():
        x=f();x.box_tol=bound;x.expect.append({'at':(0,0),'r':r+0.5,'max':bound,'why':f"the kit draws a screw's head a 32-sided polygon: a Ø {2*r:g} head's chords lie {r*(1-math.cos(math.pi/32)):.3f} inside the true circle the recipe turns"});return x
    return g
_x79=lambda f:_hd(f,Q()['P79']['hr'],0.03)
def screw79():
    P=Q()['P79'];R=Q()['RG'];RO=R['RO'];ln=RO-P['ex']
    return screwT('screw79','WN-79','Inner pivot screw (WN-79, 12 on 05 01)',P['hr'],P['hh'],ln,P['rs'],'brass (the page: as the ring)','05 01 Schnitt C-D and A-B (head Ø 9.2 × 2.8, M5, the tip Ø 3.0 × 4.6)',(P['tr'],P['ex']-P['t2'],P['t1']-P['t2']),
      ["Through the ring at 12 and 6 o'clock, tapped in it; the tip the inner pivot in the case bracket's hole, ending 0.1 short of the boss (endshake)."])

# ---------------- the closing plate (Verschlußplatte 05 01 00-2, rev. a 14.4.48) ----------------
def closingPlate():
    from . import Hole,Drill
    D=W()['WD'];C=D['CASEQ']['CP'];Hh=D['H']['10'];t8=math.atan2(Hh[1],Hh[0]);tk=t8+math.pi/2;YB=D['CASEQ']['Y']['YB']
    t=C['y1']-C['y0'];zr=C['y1']-C['yr'];ro=C['ro'];bo=C['bo'];fc=bo+ro;R=C['R'];g0,g1,gd=C['g'];P=lambda r,a:(r*math.cos(a),r*math.sin(a));q12=P(C['q'],tk);src='05 01 00-2 (rev. a 14.4.48)'
    zb=t-C['tip']-C['hr']/math.tan(math.radians(C['ang']))   # the blind hole's bottom (its drill point's base), from the inner face
    th=iso(2.6);prof=[(0,0),(R,0),(R,zr),(fc,zr),('arc',(fc-ro*math.cos(math.pi/4),zr+ro-ro*math.sin(math.pi/4)),(bo,zr+ro)),(bo,t),(0,t)]
    ops=[Revolve(prof,'Turn the plate from brass bar Ø 70: the rim 2.3 thick, the boss Ø 28 −0.2 on its outer face making it 5, a round r 1.3 between them',[S('diameter',f'Ø {2*R:g}','−0.2',src),S('rim thickness',f'{zr:g}',None,src),S('boss',f'Ø {2*bo:g}, to {t:g} overall','−0.2',src),S('round',f'r {ro:g}','drawn without a figure, scaled 1.3-1.5: likely',src)],src),
      TurnIn([(g0,-0.1),(g1,-0.1),(g1,gd),(g0,gd)],'Turn the groove in the inner face for the closing spring',[S('groove',f'Ø {2*g0:g} to Ø {2*g1:g}, {gd:g} deep',None,src)],src),
      Hole((0,0),C['bore'],'in',t,None,'Bore the middle hole through',[S('hole',f'Ø {C["bore"]:g}','+0.1',src)],src,key='bore'),
      Hole((0,0),C['cb'][0],'out',t,C['cb'][1],"Counterbore from outside for the screw's head",[S('counterbore',f'Ø {C["cb"][0]:g} × {C["cb"][1]:g} deep','+0.1; the web under it 1.925',src)],src,key='cb'),
      Hole(P(C['w'][0],t8),C['w'][1],'in',zr,None,'Drill the window over the winding hole through the rim',[S('hole',f'Ø {C["w"][1]:g} at {C["w"][0]:g}','+0.2',src)],src,key='win'),
      Hole(P(C['k'][0],tk),th['D1'],'in',zr,None,"Drill and tap M2.6 for the knob, on the line 90° from the window",[S('tap drill',f'Ø {th["D1"]:.3f}',None,'ISO 261'),S('thread',f'M2.6 at {C["k"][0]:g}',None,src)],src,thread=th,key='knob'),
      Drill((q12[0],q12[1],gd-0.2),(0,0,1),2*C['hr'],zb-(gd-0.2),'Drill the spring\'s hole blind from the groove floor, against the groove\'s outer wall',[S('hole',f'Ø {2*C["hr"]:g} at r {C["q"]:g}',None,src)],src,key='sp'),
      Point((q12[0],q12[1],zb),(0,0,1),C['hr'],2*C['ang'],'Its drill point (118°), the tip 0.15 short of the boss\'s face',[S('point','118°',None,src)],src,tipr=0.0)]
    return Recipe('closingPlate','050100-2','Closing plate (Verschlußplatte)',src,'brass (Ms)','none',[Setup('1','plate in the chuck, then on the drill',ops,view='top')],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,YB+C['y1'],0)),faces=('inner face (on the bowl)','outer face (boss)'),
      expect=[{'at':(0,0),'r':fc+0.2,'max':0.03,'why':'the page draws the round r 1.3 between rim and boss in four straight rings (22.5° of the arc each): its chords lie up to 0.025 inside the true arc the recipe turns'}],
      notes=['Turns on its screw WN-71 (a shoulder screw) in the bowl\'s bottom, by the knob WN-72; the closing spring (05 01 00-7) holds it. Wempe 3955\'s plate has two small holes through its boss: not in this version.'])

# ---------------- the bowl (Gehäusetopf R-05 01 00-1, 6.3.42) ----------------
def bowl():
    from . import Hole,Cut,Drill
    D=W()['WD'];Qc=D['CASEQ'];Y=Qc['Y'];B=Qc['BW'];T=Qc['TH'];YB=Y['YB'];YC=YB+Y['TC'];y0=YC-B['hh'];Z=lambda y:y-y0
    Hh=D['H']['10'];hx,hz=Hh;ca=math.atan2(hz,hx)+math.pi/2-math.radians(B['csi'][3]);src='R-05 01 00-1 (Ms-Sandguß/Kokillenguß, 6.3.42; 1:1)'
    rc0=B['rc'][0];rr=B['rc'][2];rcast=32.0   # the casting's recess Ø 64
    cast=[(rcast,0),(B['rf'],0),(B['rb'],Z(YC-B['ct'])),(B['rb'],Z(YC-B['bd'])),(B['bk'],Z(YC-B['bd'])),(B['bk'],Z(YC-B['fl'])),(B['rfl'],Z(YC-B['fl'])),(B['rfl'],Z(YC)),(B['bore'],Z(YC)),
      (B['bore'],Z(YC-53)+rr),('arc',(rc0+rr*math.cos(math.pi/4),Z(YC-53)+rr-rr*math.sin(math.pi/4)),(rc0,Z(YC-53))),(0,Z(YC-53)),(0,Z(YC-B['fy'])),(rcast,Z(YC-B['fy']))]
    zy=Z(YC-B['fy']);zf=Z(YB-B['fd']);Rmaj=T['Rm']+T['d']
    # the threaded rim: the flange turned down to the thread, its crest envelope the cone 0.5 long at each end (the page's run-out and lead chamfer)
    outside=[(T['Rm'],Z(YB)),(Rmaj,Z(YB)+0.5),(Rmaj,Z(YC)-0.5),(T['Rm'],Z(YC)),(T['Rm'],Z(YC)+1),(B['rfl']+1,Z(YC)+1),(B['rfl']+1,Z(YB))]
    notch=lambda:bd.Box(2*B['ns'],10,Z(YC)+1-Z(YB)-B['nf'],align=(bd.Align.CENTER,bd.Align.MIN,bd.Align.MIN)).moved(bd.Location((0,B['rr2']-1,Z(YB)+B['nf'])))
    csx=B['csi'][0]*math.cos(-ca);csy=B['csi'][0]*math.sin(-ca);hy=-hz;m3=iso(3.0)
    ops=[Revolve(cast,'Cast the bowl in brass (Kokillenguß): the flange Ø 118 for 12, the band Ø 108 to 23.5, the body Ø 106, the cone to the foot Ø 72.5, 65 overall; the bore Ø 98, 53 deep, with a round r 7 at its floor; the recess Ø 64 × 5.5 under the bottom',
        [S('overall height',f'{B["hh"]:g}',None,src),S('flange',f'Ø {2*B["rfl"]:g} for {B["fl"]:g} from the top',None,src),S('band',f'Ø {2*B["bk"]:g} to {B["bd"]:g}',None,src),S('body',f'Ø {2*B["rb"]:g}',None,src),S('foot',f'Ø {2*B["rf"]:g}',None,src),S('bore',f'Ø {2*B["bore"]:g}, 53 deep',None,src),S('round at the floor',f'r {rr:g}','drawn without a figure, scaled 6-8: likely',src),S('recess',f'Ø {2*rcast:g} × 5.5',None,src)],src),
      TurnIn([(rcast-1,-0.5),(B['rr'],-0.5),(B['rr'],zy),(rcast-1,zy)],"Open the recess to Ø 68.2 for the closing plate (Ø 68 −0.2)",[S('recess',f'Ø {2*B["rr"]:g}',None,'case.js: the plate Ø 68 −0.2 with its play (estimated)')],src),
      TurnIn([(0,zf),(rc0,zf),('arc',(rc0+rr*math.cos(math.pi/4),zf+rr-rr*math.sin(math.pi/4)),(B['bore'],zf+rr)),(B['bore'],Z(YC)+1),(0,Z(YC)+1)],'Face the floor of the bore to 49 under the seat and turn its round r 7',[S('floor',f'{B["fd"]:g} under the seat (YB)','05 06_01 "49 von Werkring-auflage": sure',src),S('round',f'r {rr:g}',None,src)],src),
      TurnIn(outside,'Turn the flange down to the thread: the shoulder at the seat, the thread Ø 110.55 × 0.75 to the rim\'s top, a relief 0.5 at the foot of the thread and a lead chamfer 0.5 at its end',[S('thread outside',f'Ø {2*Rmaj:.2f}, roots Ø {2*T["Rm"]:.2f}','the 6MX\'s rim Ø 110.5 measured; likely',src),S('shoulder',f'at the seat YB, {Y["TC"]:g} under the casting\'s top','the movement ring\'s flange flush with the rim\'s top',src)],src),
      TurnIn([(B['bore']-1,Z(YB)),(B['rr2'],Z(YB)),(B['rr2'],Z(YC)+1),(B['bore']-1,Z(YC)+1)],"Turn the rebate inside the rim to Ø 106.06 down to the seat",[S('rebate',f'Ø {2*B["rr2"]:g}',"the movement ring's flange 105.95 −0.1 in it, 0.05 clear",src)],src),
      Note('thread',(T['Rm']-0.05,Rmaj+0.05,Z(YB),Z(YC)),f'Cut the fine thread M{2*Rmaj:.2f} × {T["p"]} (DIN 13 fine pitch, right-hand) on the rim, the bezel screwing on',[S('thread',f'Ø {2*Rmaj:.2f} × {T["p"]}','pitch 0.75 ±0.05 from Kirov-Poljot 24020; right-hand estimated','DIN ISO 6410 convention')],src),
      Cut(notch,"Mill the notch through the threaded rim at 12 o'clock for the movement ring's radial pin, down to 0.8 over the seat",[S('notch',f'{2*B["ns"]:g} wide, floor {B["nf"]:g} over the seat','the pin Ø 1.6 0.1 clear each side; its depth estimated',src)],src),
      Drill((hx,hy,zy-0.5),(0,0,1),B['w'],zf-zy+1,"Drill the winding hole through the bottom over the fusee's square",[S('hole',f'Ø {B["w"]:g} at {math.hypot(hx,hz):.2f} from the centre',None,src+' / hole 10')],src,key='wind'),
      DrillT((0,0,zy-0.5),(0,0,1),m3['D1'],zf-zy+1,"Drill and tap M3 through the bottom for the closing plate's screw (WN-71)",[S('tap drill',f'Ø {m3["D1"]:.3f}',None,'ISO 261'),S('thread','M3',None,'case.js: estimated')],src,thread=m3,key='m3'),
      Drill((csx,csy,zy-0.5),(0,0,1),2*B['csi'][1],B['csi'][2]+0.5,"Drill the closing spring's inner end's hole, blind from the recess",[S('hole',f'Ø {2*B["csi"][1]:g} × {B["csi"][2]:g} deep, at r {B["csi"][0]:g}','not on the sheet: estimated',src)],src,key='csi')]
    return Recipe('bowl','050100-1','Bowl (Gehäusetopf)',src,'brass (Ms; the sheet\'s "Ms-Sandguß (Kokillenguß)")','none given',[Setup('1','casting held by its flange, turned and bored, then on the drill and mill',ops)],UP(y0),
      notes=['The sheet is a casting\'s: nothing machined is drawn but the recess for the closing plate and the holes; the rim\'s thread, rebate, notch and the faced floor are the model\'s (case.js, from 05 01 01 and the 6MX\'s bowls). The case brackets\' screws (WN-78) are tapped into the wall at assembly, where the brackets are moved to level the bowl ("Kloben verstellen"); the page draws no hole for them.',
        'The sheet gives the weight as 350 g, light for brass.'])

# ---------------- the bezel (Glasrand R-05 01 01-2, 6.3.42) and its glass ----------------
def bezel():
    from . import Op
    D=W()['WD'];Qc=D['CASEQ'];BZ=Qc['BZ'];T=Qc['TH'];Rf=T['Rf'];crest=Rf-T['d'];cone=lambda r:BZ['dh']+(r-BZ['ca'][0])*BZ['ca'][1]/(BZ['RG']-BZ['ca'][0]);K=BZ['kn'];src='R-05 01 01-2 (6.3.42) and Glasrand kompl. 05 01 01 (27.11.41), traced at 4.78 px/mm'
    pz=[(Rf if r is None else r,(cone(Rf if r is None else r) if dy is None else dy)) for r,dy in BZ['pz']]
    # inside: the thread by convention, its crests (the bore at the minor) between a relief and a lead cone 0.5 long at each end; the knurl band out to the tips
    items=[pz[0],(Rf,5.0),(crest,4.5),(crest,0.5),(Rf,0.0),*pz[3:7],(K['bore'],K['y0']),(K['r'],K['y0']),(K['r'],K['y1']),(K['bore'],K['y1']),*pz[7:]]
    ops=[Revolve(items,'Turn the bezel all over from its casting: the step, the bore, the underside, the outside in three lines to the widest band, the bevel to the glass\'s seat, the sight cone',
        [S('height to the lip',f'{pz[8][1]:.1f}','casting 16 high; likely ±0.2',src),S('widest band',f'Ø {2*K["bore"]:g}','Ø 121: 05 01 elevation scales about 120',src),S('sight cone',f'from Ø {2*pz[0][0]:g} at the step to Ø {2*BZ["RG"]:g} at the glass\'s seat',"the casting's Ø 92 bore",src),S('bore under the thread',f'Ø {2*crest:.2f} at the thread\'s crests',None,src)],src),
      Note('thread',(crest-0.05,Rf+0.05,0.0,5.0),f'Cut the fine thread M{2*Rf:.2f} × {T["p"]} in the skirt\'s bore, from the underside to the step (a relief 0.5 under the step)',[S('thread',f'Ø {2*Rf:.2f} × {T["p"]} (inside)','crests traced at r 54.9; pitch as the bowl\'s','DIN ISO 6410 convention')],src),
      Note('turn',(K['bore']-0.05,K['r']+0.05,K['y0'],K['y1']),f'Knurl the widest band straight, DIN 82 RAA {math.pi*2*K["r"]/K["n"]:.1f}',[S('knurl',f'RAA {math.pi*2*K["r"]/K["n"]:.1f}, {K["n"]} teeth, {K["d"]:g} deep, Ø {2*K["r"]:.1f} at the tips','as Wempe 6161\'s and 5377\'s bezels show their widest band: likely',"DIN 82 (the page draws %d straight teeth)"%K["n"])],src)]
    return Recipe('bezel','050101-2','Bezel ring (Glasrand)',src,'brass (Ms; casting Kokillenguß)','none given',[Setup('1','casting in the chuck, turned, then knurled',ops)],UP(WMW()['DY1']-BZ['dh']),
      notes=['Screws onto the bowl\'s rim; its step bears on the dial\'s rim and holds the movement down.','The glass (05 01 01-1) is bought.'])

def glass():
    Qc=Q();BZ=Qc['BZ'];g=BZ['gl'];return Bought('glass','050101-1','Bezel glass (Glas)','a flat glass disc, its top edge chamfered',f'Ø {2*g[1][0]:g} × {g[4][1]-g[0][1]:g} thick, the top edge chamfered {g[2][0]-g[3][0]:g} × {g[3][1]-g[2][1]:g} (45°) to r {g[3][0]:g}',
      'no standard: a glass cut and ground to the size','mineral glass (the drawings do not give it)','05 01 01 (Glasrand kompl., the section\'s band y 192.5 to 210; re-measured 26 October 2026: likely ±0.2)',
      ['Lies on the ring\'s seat at 12.3 over the underside, flush with nothing: it stands about 2.4 proud of the ring\'s lip.'])
def boxBought():
    return Bought('box','Holzkasten','Wooden box (Holzkasten)','a wooden box, made by a joiner (not machined from the model)','185 × 185 × 180 outside, walls 12.5, a hinged lid with a glazed top, the gimbals hung in it',
      'joinery: no sheet in the set but 05 01 and 51 00 10 (the sizes) ','mahogany as Wempe 6161\'s (the drawings say "Holzgehäuse"); the outer box birch','05 01 (Holzgehäuse 185 × 185 × 180 mm außen, sure), 51 00 10 (the walls 12.5, the hinges, the handles)',
      ['Its hinges, handles, latch tongue, key holder, the lid\'s stay and the maker\'s plate (00 01 01-9, "Type 3371", 26 × 52) are fitted to it; the page draws them, a recipe does not (made elsewhere: joinery and stampings).'])

# ---------------- the case's screws, a line to each size (31 October 2026: WN-78, WN-71, WN-72, WN-80 and WN-ur were each one line on two or four sizes) ----------------
def _cs(key,hn,title,c,material,src,notes=(),rev=None):
    from .wempe import screw
    r=screw(key,hn,title,c[0],c[1],c[2],c[3],material,src,notes)
    if rev:r.rev=rev
    return r
def screw78m4():
    c=Q()['BR']['sc'];return _cs('screw78m4','WN-78.m4',"Case bracket screw (WN-78, 13 on 05 01), M4",c,'steel (the page: a DIN 84 cheese head M4 is Ø 7 × 2.6)','dims.js CASEQ.BR.sc (05 01: the head Ø 7.0 by a circle fitted to it; the length 8 estimated)',['Four of them, two to each case bracket, through the foot into the bowl\'s wall; the tapped holes are cut at assembly, where the brackets are moved to level the bowl.'])
def screw78m25():
    c=Q()['LB']['sc'];return _cs('screw78m25','WN-78.m25',"Locking bracket screw (WN-78, 13 on 05 01), M2.5",c,'steel','dims.js CASEQ.LB.sc (05 01 Schnitt A-B; the length 7.5 estimated)',['One, through the locking bracket\'s foot into the bowl\'s wall.'])
def screw71():
    from .wempe import screw
    S71=Q()['S71']['a'];ln=S71['t1']-S71['sl']   # the thread beyond the shoulder: from the shoulder's end (1.95) to 7.45
    return screw('screw71','WN-71',"Closing plate shoulder screw (WN-71, 7 on 05 01)",S71['r'],S71['h'],ln,S71['rs'],'steel','dims.js CASEQ.S71 (05 01 00-2: the Ø 5.5 bore under a Ø 7.5 counterbore over a web held to 1.90-1.95 is a shoulder\'s seat; no WN sheet: estimated)',
      ["Head Ø 7.2 × 2.5, its shoulder Ø 5.45 × 1.95 through the plate's web (0.05 clear on the bore) to the bowl's bottom, which it bears on; M3 on into the bottom."],shoulder=(S71['sd'],S71['sl']))
def screw71f():
    S=Q()['S71']['f'];return _cs('screw71f','WN-71.f',"Closing plate screw, the 6MX's (WN-71)",[S['r'],S['h'],S['len'],S['rs']],'steel','dims.js CASEQ.S71.f (Kirov 14917, rAw2zmulpk8 0:11.75; the head Ø 8 on the plate\'s face, 2.4 high estimated)',['M3 through the plate\'s Ø 3.2 into the bowl\'s bottom (Kirov 422: a flat plate, a slotted screw).'],rev='6mx')
def screw72():
    return _cs('screw72','WN-72',"Closing plate knob (WN-72)",Q()['S72']['a'],'brass (Wempe 3955\'s)','dims.js CASEQ.S72.a (05 01 Schnitt C-D; Wempe 3955: a brass head Ø 5.2 × 2.4, M2.6 estimated)',['Its dome is drawn as the kit\'s head.'])
def screw72f():
    return _cs('screw72f','WN-72.6',"Closing plate knob, the 6MX's (WN-72)",Q()['S72']['f'],'brass','dims.js CASEQ.S72.f (Kirov 14917: the domed knob about Ø 6.5 at r 19 ±2)',[],rev='6mx')
def _s80(side,six):
    S=Q()['S80'];B=S['B'][1 if six else 0];i=0 if side>0 else 1;sh,te=S['sh'][i],S['te'][i];r=S['r6'] if six else S['r']
    rec=screwT(f"screw80_{'3' if side>0 else '9'}{'m' if six else ''}",f"WN-80.{'3' if side>0 else '9'}{'m' if six else ''}",f"Outer pivot screw, {'3' if side>0 else '9'} o'clock{', the 6MX box' if six else ''} (WN-80, 11 on 05 01), M6",
      r,S['h'],B-sh,S['rs'],'steel','51 00 10 ("Verbohren 4,8 mm, Gew. M 6"), 05 01 elevation (the length by the box\'s wall; case.js)',(S['tr'],sh-te,S['ch']),
      [f"Through the box's {'3' if side>0 else '9'} o'clock side wall; its tip the gimbal ring's pivot, {"through the ring's bracket into the ring" if side>0 else "through the ring"}. Locked by the knurled nut WN-400.w against the wall's inside."])
    if six:rec.rev='6mx'
    return rec
def screwUr():
    return _cs('screwUr','WN-ur',"Strap screw (WN-ur), the carrying case's",Q()['SUR']['a'],'steel','dims.js CASEQ.SUR.a (51 00_5 "Schraube f. Riemenbef."; size estimated)',[])
def screwUr6():
    return _cs('screwUr6','WN-ur.6',"Strap screw (WN-ur), the 6MX carrying case's",Q()['SUR']['f'],'steel','dims.js CASEQ.SUR.f (estimated)',[],rev='6mx')
def din96():
    return Bought('din96','DIN96','Wood screw DIN 96, 3 × 15 (the transit lock bracket\'s)','slotted round-head wood screw','3 × 15','DIN 96','steel (bright)','bom.json: "Holzschraube DIN 96, 3 × 15 (the transit lock\'s bracket\'s wood screws, estimated)"',
      ['Two. The page draws the kit\'s machine screw, head Ø 5.6 × 2.1 (DIN 96\'s head for 3 mm is Ø 5.6), 15 long.'])
def closingSpring():
    C=Q()['CP']
    return Bought('closingSpring','050100-7','Closing spring (Verschlußfeder, 14 on 05 01)','steel spring wire wound into a flat spiral of two turns, its outer end turned down 2 into the plate\'s hole and its inner end up 1.2 into the bowl\'s',
      f'Ø 1.0 wire, a spiral across the groove (Ø {2*C["g"][0]:g} to Ø {2*C["g"][1]:g} × {C["g"][2]:g} deep) from r {C["q"]:g} to 6.5, each bend r 0.8; the ends turned into the Ø 1.2 holes','music wire (DIN EN 10270-1)','spring steel',
      'case.js (no sheet; 05 01 00-2 gives its seat: the groove and the Ø 1.2 hole). Estimated; under the plate on every bowl photographed or filmed (Wempe 3955; moMvyx8eXfo 7:10-7:45)',
      ['Unloaded with the plate shut, wound up as the plate is opened 25°. Its sprung shape follows the plate\'s turn on the page, so it has no recipe of its own.'])
def woRo():
    return Bought('woRo','WN-ro','Eye screw 3 × 15 DIN 96 (the carrying case\'s eyes\')','slotted round-head wood screw','3 × 15','DIN 96','steel (bright)','bom.json: "Schraube 3 x 15 DIN 96 (11)" (the parts list)',
      ['Two. The page draws the kit\'s machine screw with a head Ø 8.5 × 2.2, shank 15, M3: DIN 96\'s head for 3 mm is Ø 5.6 × 2.0 (a page fault, recorded in PLAN-recipes.md; not changed here).'])

RECIPES={'gimbalRing':gimbalRing,'ringBracket':ringBracket,'nutA':nutA,'nutW':nutW,'caseBracket':caseBracket,'lockBracket':lockBracket,'screw79':_x79(screw79),'closingPlate':closingPlate,'bowl':bowl,'bezel':bezel,'glass':glass,'box':boxBought,
  'screw78m4':screw78m4,'screw78m25':screw78m25,'screw71':screw71,'screw71f':_hd(screw71f,Q()['S71']['f']['r'],0.03),'screw72':screw72,'screw72f':screw72f,'screw80_3':_hd(lambda:_s80(1,False),Q()['S80']['r'],0.035),'screw80_9':_hd(lambda:_s80(-1,False),Q()['S80']['r'],0.035),'screw80_3m':_hd(lambda:_s80(1,True),Q()['S80']['r6'],0.035),'screw80_9m':_hd(lambda:_s80(-1,True),Q()['S80']['r6'],0.035),
  'screwUr':screwUr,'screwUr6':screwUr6,'din96':din96,'woRo':woRo,'closingSpring':closingSpring}
