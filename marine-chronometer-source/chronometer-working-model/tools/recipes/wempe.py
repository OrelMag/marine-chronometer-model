"""The Wempe's recipes (from 29 October 2026; PLAN-recipes.md). Their numbers come from the page's own dims.js (WD) and escapement.js (WESC), run in Node
by wempe_load.js: a size frame.js drew as a literal beside its part is moved into dims.js (WD.FRAME, WD.RING, WD.CORK...) before a recipe reads it, the page's
meshes hashed before and after (recipes_pagehash.py) so the move changes nothing."""
import functools,json,math,pathlib,subprocess
import build123d as bd
from . import (Recipe,Setup,S,iso,page_matrix,Bar,Ring,TurnOD,TurnCone,FaceGroove,Bore,Countersink,ThreadOD,SlotHead,Plate,Hole,Cone,Pocket,InnerCone,Drill,Cut,Bought)
TOOLS=pathlib.Path(__file__).resolve().parents[1]

@functools.lru_cache()
def W():
    """WD and WESC.HOLES as the page has them (functions left out)"""
    js="const W=require(%r)();process.stdout.write(JSON.stringify({WD:W.WD,HOLES:W.WESC.HOLES}))"%str(TOOLS/'wempe_load.js')
    return json.loads(subprocess.run(['node','-e',js],capture_output=True,text=True,check=True).stdout)

def brg(b):
    """frame.js's brg: plan [x, z] of the bearing b (deg from N toward O)"""
    return (-math.sin(math.radians(b)),-math.cos(math.radians(b)))
def add(p,u,k=1):return (p[0]+u[0]*k,p[1]+u[1]*k)

# ---------------- the cork ring (Korkring, 05 08 01-4) ----------------
def corkRing():
    D=W()['WD'];K=D['CORK'];TT=-D['INNER']-D['TOP_T'];yb=TT-K['below'][0]-K['below'][1]   # its underside on the dust bush's collar
    ro,ri,h=K['ro'],K['ri'],K['h']   # dims.js CORK: Ø 16.1 × 3.86 scaled on the coloured section at 9.32 px/mm, the bore the dust bush's neck Ø 9.7 + 0.02, drawn 3.70 squeezed
    src='05 08 01-4 (no sheet; scaled on the coloured section, frame.js)'
    return Recipe('corkRing','050801-4','Cork ring (Korkring)','05 08 01-4 (named on 05 08 01; no sheet of its own)','natural cork (no drawing gives it)','none',
      [Setup('1','cork sheet on a backing board',[
        Ring(2*ro,2*ri,h,'Punch or trepan the ring from cork sheet 4 thick, then sand to height',
          [S('outside',f'Ø {2*ro:.2f}',None,src),S('bore',f'Ø {2*ri:.2f}','slide on the dust bush neck Ø 9.70',src),S('height',f'{h:.2f}','as squeezed; free about 3.86',src)],src)])],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,yb,0)),notes=['Its sizes are scaled, not figured: the coloured section names it and draws it, no sheet exists (estimated).'])

# ---------------- a pillar (Pfeiler, 05 08 00-1) ----------------
def pillar():
    D=W()['WD'];P=D['PIL'];yb=D['PIL_SEAT'][1];e1=yb+P['sL'];L=e1-(-D['INNER']-D['PIL_SEAT'][1]-P['sL'])   # the page's e1 (dial end) to e0
    sL=P['sL'];sr=P['sr'];t0,t1=P['tip'];gr,gd=P['grv'];th=iso(2*D['PSCR']['rs']);z2=L-sL
    src='05 08 00-1'
    return Recipe('pillars','050800-1','Pillar (Pfeiler)','05 08 00-1','Rundmessing 8,5 Ms 58 (05 08 00-1)','none on the drawing',[
      Setup('1','bar Ø 8.5 in the collet, first end out',[
        Bar(8.5,L,'Part off from Rundmessing Ø 8.5 and face both ends to the overall length',[S('overall length',f'{L:.2f}','-0.2 (25.3 -0.2)',src)],src),
        TurnOD(2*P['r'],sL,z2,'Turn the body',[S('body',f'Ø {2*P["r"]:.2f}','8.1 -0.2, drawn at the middle',src),S('between shoulders',f'{z2-sL:.2f}',f'±{P["LT"]}',src)],src),
        TurnOD(2*sr,0,sL,'Turn the first spigot to the shoulder',[S('spigot',f'Ø {2*sr:.3f}','4.5 f7 (-0.010/-0.022)',src),S('length',f'{sL:.2f}','-0.1',src)],src),
        TurnCone(t0,0,sr,t1,'Turn the spigot end at 6° (the lead into the plate)',[S('end',f'Ø {2*t0:.2f} at the face','4.3 -0.2',src),S('lead length',f'{t1:.2f}','-0.2',src),S('angle','6°',None,src)],src),
        FaceGroove(sL,sr,gr,gd,1,'Turn the relief groove into the shoulder face round the spigot',[S('groove',f'to r {gr:.2f}, {gd:.2f} deep',None,'05 08 00-1, drawn at 5:1 without figures (estimated)')],src),
        Bore(th['D1'],0,L,'Drill through for M2.6 (tap drill)',[S('tap drill',f'Ø {th["D1"]:.2f}',None,'ISO 261: D1 for M2.6')],src,thread=th),
        Countersink(0,2*P['cs'],90,1,'Countersink the end 90°',[S('countersink',f'Ø {2*P["cs"]:.2f} × 90°',None,src+' scaled at 5:1 (likely)')],src)]),
      Setup('2','turned end for end in a soft collet on the body',[
        TurnOD(2*sr,z2,L,'Turn the second spigot',[S('spigot',f'Ø {2*sr:.3f}','4.5 f7',src),S('length',f'{sL:.2f}','-0.1',src)],src),
        TurnCone(sr,L-t1,t0,L,'Turn its end at 6°',[S('end',f'Ø {2*t0:.2f}','4.3 -0.2',src)],src),
        FaceGroove(z2,sr,gr,gd,-1,'Turn the relief groove into this shoulder',[S('groove',f'to r {gr:.2f}, {gd:.2f} deep',None,'estimated')],src),
        Countersink(L,2*P['cs'],90,-1,'Countersink this end 90°',[S('countersink',f'Ø {2*P["cs"]:.2f} × 90°',None,src)],src),
        Bore(th['D1'],0,L,'Tap M2.6 from both ends ("Gewinde von beiden Seiten einschneiden")',[S('thread','M2.6 through',None,src)],src,thread=th)])],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,e1,0)),fits=['spigots Ø 4.5 f7 in the plates\' holes 4.50 +0.012 (sliding)','shoulders seat in the plates\' Ø 8.6 × 0.3 recesses'])

# ---------------- screws (Wempe's own norm, WN: special heads, so made, not bought) ----------------
def screw(key,hn,title,r,h,ln,rs,material,src,notes=()):
    """a slotted cheese-head screw as the page's screw() draws it (KIT headGeo, threadGeo): head r x h with its 45° chamfer and slot, shank ln long, thread rs"""
    th=iso(2*rs);c=min(0.35,r*0.14);w=max(0.35,r*0.2);s_=max(min(0.55,h*0.45),c+0.05)
    crest=2*rs-th['es'];ch=min(th['H1'],ln*0.3);root=crest/2-th['H1'];rt=max(root-th['H1']/2,root*0.6)
    return Recipe(key,hn,title,f'{hn} (Wempe standard part; its sheet is not in the set)',material,'none',[
      Setup('1','bar in the collet, the tip end out',[
        Bar(2*r,h+ln,'Part off and face to the overall length',[S('overall',f'{h+ln:.2f}',None,src)],src),
        TurnOD(crest,0,ln,"Turn the shank to the thread's major diameter",[S('shank',f'Ø {crest:.3f}','6g (es %.3f)'%th['es'],'ISO 965')],src),
        TurnCone(rt,0,crest/2,ch,'Chamfer the tip',[S('tip',f'Ø {2*rt:.2f}',None,'KIT threadGeo')],src),
        ThreadOD(th,0,ln,f'Cut the thread M{2*rs:g} (die or single point)',[S('thread',f'M{2*rs:g} × {th["p"]}','6g','ISO 261')],src)]),
      Setup('2','reversed, held on the thread in a split bush',[
        TurnCone(r-c,h+ln,r,h+ln-c,"Chamfer the head's top 45°",[S('head',f'Ø {2*r:.2f} × {h:.2f}',None,src),S('chamfer',f'{c:.2f} × 45°',None,'KIT headGeo')],src),
        SlotHead(h+ln,w,s_,'Mill the slot across the head',[S('slot',f'{w:.2f} wide × {s_:.2f} deep',None,'KIT headGeo')],src)])],
      page_matrix([[1,0,0],[0,0,-1],[0,1,0]],(0,ln,0)),notes=list(notes)+["The slot's width and depth are the model's convention (KIT headGeo), no drawing's."])
def pillarScrew():
    Q=W()['WD']['PSCR'];return screw('pillarScrew','WN-57','Pillar screw, top plate (WN-57)',Q['r'],Q['h'],Q['len'],Q['rs'],"brass (Wempe 3955's; no drawing gives it)",
      'dims.js PSCR (the coloured section, Wempe 3955; WN sheet not in the set: estimated)',['Head and shank read off the coloured section and Wempe 3955 (estimated ±0.2).'])
def pillarScrew56():
    Q=W()['WD']['PSCR'];return screw('pillarScrew56','WN-56','Pillar screw, pillar plate (WN-56)',Q['r'],Q['h'],Q['len'],Q['rs'],"brass (Wempe 3955's; no drawing gives it)",
      'dims.js PSCR (the coloured section: estimated)',['The same screw as WN-57 in the model (the coloured section reads them alike).'])
def ringScrew():
    G=W()['WD']['RING'];return screw('ringScrew','WN-rs','Movement ring screw (WN number not read)',G['scr'][0],G['scr'][1],G['scr'][2],1.3,"brass (Wempe 3955's)",
      'dims.js RING.scr (the coloured section at 9.37 px/mm: sure on the section)')

# ---------------- the top plate (Oberplatte, 05 09 01) ----------------
def topPlate():
    X=W();D=X['WD'];H={int(k):v for k,v in D['H'].items()};t=D['TOP_T']
    pl=lambda q:(-q[0],-q[1])   # page plan [x, z] to the sheet's (O, N)
    FR=D['FRAME'];rPinP=FR['rPinP'];rJ=FR['rJ'];rH35=FR['rH35']   # dims.js FRAME: steady pins' holes reamed 1.6025, the settings 4.59 +0.012, the Hilfslöcher 3.50 +0.012, each at its fit's middle
    src='05 09 01'
    ops=[];hl=lambda k,q,d,text,sz,face='out',dp=None,thd=None,s=src:ops.append(Hole(pl(q),d,face,t,dp,text,sz,s,thread=thd,key=k))
    # the outline: the disc 85 h6 less the cut Ø 42.5 about hole 45, its horns rounded r 1 (05 08 01, 2.11.46, as last revised)
    with bd.BuildSketch() as sk:
        bd.Circle(D['PLATE_R'])
        with bd.Locations(pl(H[45])):bd.Circle(42.5/2,mode=bd.Mode.SUBTRACT)
        bd.fillet(sk.vertices(),1.0)
    stock=Plate(sk.sketch.faces()[0],t,'Turn the blank from Messingblech 4 (Ø 90 × 4 to 3.5 × 90), face to thickness, turn to 85 h6; mill the cut Ø 42.5 about hole 45 and round the horns',
      [S('diameter',f'Ø {2*D["PLATE_R"]:.3f}','85 h6 (0/-0.022)',src),S('thickness',f'{t:.2f}',None,src),S('cut round the barrel','Ø 42.5 about hole 45',None,'05 08_1b'),S('horns','r 1',None,'05 08 01 (2.11.46), scaled')],src)
    for k in (1,35,38):hl(k,H[k],2*rJ,f'Hole {k}: drill 4.4, ream',[S('',f'Ø 4.59','+0.012',src)])
    for k in (3,12,40):hl(k,H[k],2*rH35,f'Hole {k} (Hilfsloch): ream',[S('',f'Ø 3.50','+0.012',src)])
    for k,d,th_ in ((5,1.7,1),(51,2.0,1),(52,2.0,1)):i=iso(d);hl(k,H[k],i['D1'],f'Hole {k}: drill and tap M{d}',[S('',f'M{d}',None,src)],thd=i)
    hl(7,H[7],1.6045,'Hole 7 (stop pin): ream',[S('','Ø 1.6','+0.009',src)])
    hl(13,H[13],1.8,'Hole 13: drill',[S('','Ø 1.8',None,src)])
    hl(53,H[53],1.5045,'Hole 53: ream',[S('','Ø 1.5','H7',src)])
    for k in (8,42,48):i=iso(2.6);hl(k,H[k],i['D1'],f'Hole {k}: drill and tap M2.6',[S('','M2.6',None,src)],thd=i)
    hl(4,H[4],0.9,'Hole 4: drill',[S('','Ø 0.9',None,src)])
    ops.append(Cone(pl(H[4]),2.15,1.2,'out',t,0.55,'Hole 4: the oil sink, first cone',[S('sink','Ø 4.3 at the face',None,'Wempe 3955 (2_Wempe_3955_A.jpg); depth estimated')]))
    ops.append(Cone(pl(H[4]),1.2,0.45,'out',t,0.4,'Hole 4: the oil sink, second cone',[],z0=t-0.55))
    for k,q in ((11,H[11]),(39,H[39]),(49,H[49])):
        hl(k,q,2*D['PIL_HOLE'],f'Hole {k} (pillar): ream',[S('','Ø 4.50','+0.012',src)])
        hl(k,q,2*D['PIL_SEAT'][0],f'Hole {k}: the pillar\'s seat in the inner face',[S('seat',f'Ø {2*D["PIL_SEAT"][0]:.1f} × {D["PIL_SEAT"][1]}','+0.03 deep',src+' Schnitt L-M')],face='in',dp=D['PIL_SEAT'][1])
    cp=(1.25-rPinP)/math.tan(math.radians(59))
    for k,face in ((6,'in'),(9,'in'),(41,'in'),(47,'in'),(50,'in'),(22,'out'),(37,'out')):
        hl(k,H[k],2*rPinP,f'Hole {k} (steady pin): ream',[S('','Ø 1.6','slide fit',src)])
        hl(k,H[k],2.5,f'Hole {k}: open from the {"inner" if face=="in" else "outer"} face',[S('',f'Ø 2.5 × 1.6',None,src+(' A-B' if face=='in' else ' C-D'))],face=face,dp=1.6)
        ops.append(Cone(pl(H[k]),1.25,rPinP,face,t,cp,f'Hole {k}: 118° drill point',[],z0=(1.6 if face=='in' else t-1.6)))
    hl(36,H[36],2.8,'Hole 36: drill',[S('','Ø 2.8',None,src)])
    hl(36,H[36],6.012,'Hole 36: sink for the lower cock\'s screw head',[S('','Ø 6 × 1.8','H7',src+' G-H')],dp=1.8)
    hl(26,H[26],4.596,'Hole 26 (escape wheel\'s setting): ream through',[S('','Ø 4.59','H7 (revision a)',src+' P-Q')])
    hl(26,H[26],5.206,'Hole 26: bore the setting\'s seat from the inner face',[S('',f'Ø 5.2 to {0.5:.1f} under the outer face','H7',src+' P-Q')],face='in',dp=t-0.5)
    for sg in (-1,1):i=iso(1.2);hl('26'+('W' if sg>0 else 'O'),add(H[26],(1,0),3.525*sg),i['D1'],'The setting\'s screw: drill and tap M1.2',[S('','M1.2, 3.5 +0.05 from 26',None,src+' P-Q')],thd=i)
    for q in X['HOLES']['blockPins']:
        hl('bp',q,0.925,'The detent block\'s steady pin: drill at assembly through the block',[S('','Ø 0.9',None,'05 04 01-4')])
        ops.append(Cone(pl(q),0.7,0.4625,'out',t,0.24,'and countersink on the outer face',[S('','Ø 1.4',None,'Wempe 3955 (likely)')]))
    hl(10,H[10],8.0075,'Hole 10 (fusee bush): bore',[S('','Ø 8.0','+0.015',src)])
    ops.append(Cone(pl(H[10]),11.0,10.3,'in',t,0.7,'Hole 10: the recess round it in the inner face, its wall 45°',[S('recess','Ø 22 at the face × 0.7',None,src+' J-K')]))
    for b in (0,120,240):i=iso(1.4);hl('10s',add(H[10],brg(b),5.2),i['D1'],'The fusee bush\'s screw: drill and tap M1.4',[S('',f'M1.4 on r 5.2 at {b}°','±0.05',src)],thd=i)
    # the balance's opening (Ø 10) with its tongue (2.5 wide), through; the pocket N-O in the inner face, the common tangents of the opening's r 5 and r 4 about 51
    tA=add(H[23],brg(203.5),0.85);tu=brg(113.5);tg0=add(tA,tu,4.0);tgE=add(tA,tu,math.sqrt(81-0.85**2)-1.25);a0=add(tg0,tu,-2)
    c23,c51=pl(H[23]),pl(H[51]);A0,AE=pl(a0),pl(tgE);Ls=math.dist(A0,AE);ang=math.degrees(math.atan2(AE[1]-A0[1],AE[0]-A0[0]))
    with bd.BuildSketch() as key:
        with bd.Locations(c23):bd.Circle(5)
        with bd.Locations(bd.Location(((A0[0]+AE[0])/2,(A0[1]+AE[1])/2,0),(0,0,ang))):bd.SlotCenterToCenter(Ls,2.5)
    Dd=math.dist(c23,c51);u=((c51[0]-c23[0])/Dd,(c51[1]-c23[1])/Dd);ca=(5-4)/Dd;sa=math.sqrt(1-ca*ca)
    ns=[(ca*u[0]-s_*sa*u[1],ca*u[1]+s_*sa*u[0]) for s_ in (1,-1)]
    quad=[add(c23,ns[0],5),add(c51,ns[0],4),add(c51,ns[1],4),add(c23,ns[1],5)]
    # on the tongue's side the sheet dashes the tangent only from where it crosses the tongue's far edge (05 08_1b; frame.js X): between its point on r 5 (T5)
    # and the tongue the plate stays whole, so that corner (T5, the tongue's near edge where the tangent crosses it, and where that edge meets r 5) is left out
    uT=(math.cos(math.radians(ang)),math.sin(math.radians(ang)));nT=(-uT[1],uT[0])
    iT=min((0,1),key=lambda i:math.dist(add(c23,ns[i],5),AE));T5=add(c23,ns[iT],5);lt=(c51[0]+4*ns[iT][0]-T5[0],c51[1]+4*ns[iT][1]-T5[1])
    def cross(sg):   # the tangent from T5 against the tongue's edge sg (its offset 1.25 across the axis): the parameter along the tangent and the point
        p0=add(A0,nT,1.25*sg);den=lt[0]*uT[1]-lt[1]*uT[0];k=((p0[0]-T5[0])*uT[1]-(p0[1]-T5[1])*uT[0])/den;return k,add(T5,lt,k)
    kn,sn=min((cross(sg)[0],sg) for sg in (-1,1) if cross(sg)[0]>0);Xn=cross(sn)[1]   # the tongue's near edge
    p0=add(A0,nT,1.25*sn);b=(p0[0]-c23[0])*uT[0]+(p0[1]-c23[1])*uT[1];cc=(p0[0]-c23[0])**2+(p0[1]-c23[1])**2-25;Pc=add(p0,uT,-b+math.sqrt(b*b-cc))
    with bd.BuildSketch() as hull:
        with bd.Locations(c23):bd.Circle(5)
        with bd.Locations(c51):bd.Circle(4)
        bd.Polygon(*quad,align=None)
        bd.Polygon(add(T5,ns[iT],0.5),add(Xn,ns[iT],0.5),Xn,Pc,add(c23,ns[iT],4.0),align=None,mode=bd.Mode.SUBTRACT)
    ops.append(Pocket(hull.sketch.faces()[0],'in',t,1.35-0.025,'Mill the pocket N-O in the inner face (balance holding work)',[S('depth','1.325','1.35 -0.05, at the middle',src+' N-O'),S('ends','r 5 about 23, r 4 about 51; sides their common tangents',None,'05 08_1b')]))
    ops.append(Pocket(key.sketch.faces()[0],'in',t,None,'Mill the balance\'s opening and its tongue through',[S('opening','Ø 10 about 23',None,src),S('tongue','2.5 wide, its end r 9.0 from 23 toward 113.5°',None,'05 08_1b traced (likely)')]))
    drills=[o for o in ops if o.kind=='drill'];mills=[o for o in ops if o.kind=='mill']
    return Recipe('topPlate','050901','Top plate (Oberplatte)','05 09 01 (assembly 05 08 01)','Messingblech 4, Sonder Ms α-β (05 09 01)','gilt (Wempe 3955)',[
        Setup('1','blank in the lathe\'s chuck, outer face out',[stock]),
        Setup('2','on the mill, inner face up, located on holes 1 and 45\'s cut (the hole table\'s origin hole 1)',mills+[o for o in drills if o.face=='in']),
        Setup('3','turned over, outer face up, on the same two locations',[o for o in drills if o.face=='out'])],
      page_matrix([[-1,0,0],[0,0,-1],[0,-1,0]],(0,-D['INNER'],0)),
      expect=[{'at':((c23[0]+c51[0])/2,(c23[1]+c51[1])/2),'r':Dd/2+5,'max':0.055,'why':"the page draws the pocket's far side tangent to r 4.95 about 23, so it crosses the opening's edge cleanly (frame.js); the sheet's r 5: the old mesh"}],
      fits=['pillar holes 4.50 +0.012 on the pillars\' 4.5 f7','settings 1, 35, 38 4.59 +0.012 for WN-300/301 pressed'])

# ---------------- the pillar plate (Unterplatte, 05 08 02-1) ----------------
def pillarPlate():
    X=W();D=X['WD'];H={int(k):v for k,v in D['H'].items()};t=D['PP_T'];F=D['FRAME'];R=D['PLATE_R']
    pl=lambda q:(-q[0],-q[1]);src='05 08 02-1'
    ops=[];hl=lambda k,q,d,text,sz,face='in',dp=None,thd=None,s=src:ops.append(Hole(pl(q),d,face,t,dp,text,sz,s,thread=thd,key=k))
    pinAt=(0.0,R)   # frame.js: brg(180) on the rim, 6 o'clock, the movement ring's pin drilled across the joint at assembly (05 08 00-3)
    with bd.BuildSketch() as sk:
        bd.Circle(R)
        with bd.Locations(pl(pinAt)):bd.Circle(F['ringPin']/2,mode=bd.Mode.SUBTRACT)
    stock=Plate(sk.sketch.faces()[0],t,'Turn the blank to 85 h6 and face to thickness',[S('diameter',f'Ø {2*R:.3f}','85 h6 (0/-0.022)',src),S('thickness',f'{t:.2f}','±0.02 (struck; likely)',src),S('notch for the ring\'s pin','Ø 1 at 6 o\'clock, drilled across the joint at assembly',None,'05 08 00-3')],src)
    hl(1,H[1],2*F['rJ'],'Hole 1: drill 4.4, ream',[S('','Ø 4.59','+0.012',src)])
    for k in (2,3,12,40,19,18):hl(k,H[k],2*F['rH35'],f'Hole {k}: ream',[S('','Ø 3.50','+0.012',src)])
    hl(4,H[4],0.9,'Hole 4: drill',[S('','Ø 0.9',None,src)])
    hl(10,H[10],F['pp10'],'Hole 10 (fusee pivot): ream to the pivot at assembly',[S('','Ø 2.82','2.70 ±0.009 in the table; opened to the pivot Ø 2.8 + 0.02 (README, Unresolved)',src)])
    hl(23,H[23],7.0,'Hole 23: bore',[S('','Ø 7','drawn and labelled (the table punches 4.4)',src)])
    hl(45,H[45],2.90,'Hole 45: ream',[S('','Ø 2.90',None,src)])
    hl(26,H[26],2.50,'Hole 26: ream',[S('','Ø 2.50',None,src)])
    hl(26,H[26],4.6,"Hole 26: the lower endstone setting's seat in the dial face",[S('','Ø 4.6 × 0.25',None,"Wempe 3955's dial side (escapement.js; not on the sheet)")],dp=0.25)
    u37=(-math.cos(math.radians(37)),math.sin(math.radians(37)))
    for sg in (-1,1):i=iso(1.2);hl('26'+('a' if sg>0 else 'b'),add(H[26],u37,3.525*sg),i['D1'],'Its endstone screws: drill and tap M1.2',[S('','M1.2, 3.5 +0.05 from 26, 37° below O toward S',None,'05 08_3b')],thd=i)
    for k in (28,43):i=iso(2.6);hl(k,H[k],i['D1'],f'Hole {k}: drill and tap M2.6',[S('','M2.6',None,src)],thd=i)
    rPinP=F['rPinP'];cp=(1.25-rPinP)/math.tan(math.radians(59))
    for k in (29,44):
        hl(k,H[k],2*rPinP,f'Hole {k} (steady pin): ream from the dial face',[S('','Ø 1.6','slide fit',src+' A-B')])
        hl(k,H[k],2.5,f'Hole {k}: open from the inner face',[S('','Ø 2.5 × 1.6',None,src+' A-B')],face='out',dp=1.6)
        ops.append(Cone(pl(H[k]),1.25,rPinP,'out',t,cp,f'Hole {k}: 118° drill point',[],z0=t-1.6))
    hl(30,H[30],2*F['rJ'],'Hole 30 (escape setting, lower): ream through',[S('','Ø 4.59','H7',src+' G-H')])
    hl(30,H[30],5.206,"Hole 30: bore the setting's seat from the dial face",[S('','Ø 5.2 to 0.5 under the inner face','H7',src+' G-H')],dp=t-0.5)
    for sg in (-1,1):i=iso(1.2);hl('30'+('W' if sg>0 else 'O'),add(H[30],(1,0),3.525*sg),i['D1'],'Its screws: drill and tap M1.2',[S('','M1.2, 3.5 +0.05 from 30',None,src+' G-H')],thd=i)
    for k,q in ((11,H[11]),(39,H[39]),(49,H[49])):
        hl(k,q,2*D['PIL_HOLE'],f'Hole {k} (pillar): ream',[S('','Ø 4.50','+0.012',src)])
        hl(k,q,2*D['PIL_SEAT'][0],f"Hole {k}: the pillar's seat in the inner face",[S('seat',f'Ø {2*D["PIL_SEAT"][0]:.1f} × {D["PIL_SEAT"][1]}','+0.03 deep',src+' E-F')],face='out',dp=D['PIL_SEAT'][1])
    for k in (14,15):hl(k,H[k],1.45,f"Hole {k} (hand setting's steady pin): drill",[S('','Ø 1.45',None,src+' (struck, but drilled on Wempe 3955)')])
    for k in (16,17):hl(k,H[k],2.8,f"Hole {k} (hand setting's screw): drill",[S('','Ø 2.8',None,src)])
    c38,c35=pl(H[38]),pl(H[35])
    def opening():
        with bd.BuildSketch() as o:
            with bd.Locations(c38):bd.Circle(F['op38']/2)
            with bd.Locations(c35):bd.Circle(F['op35']/2)
        return bd.extrude(o.sketch.moved(bd.Location((0,0,-0.01))),t+0.02)
    ops.append(Cut(opening,'Mill the opening for the intermediate wheel through, joined by hole 35',[S('opening','Ø 24.5 about 38',None,src+' ("vor dem kalibrieren auf 24,5 fräsen")'),S('hole 35','Ø 6.0 punched, on its rim',None,src)],src,at=c38))
    # the hand-setting window (05 08_3a C-D, 05 08_3b): on the line through 18, 6.5 square on the dial face, widened along the cut to 12.1 on the inner face, its ends Ø 14 arcs
    eu=pl(H[18]);n_=math.hypot(*eu);eu=(eu[0]/n_,eu[1]/n_);et=(-eu[1],eu[0]);uo=R-F['hsOut'];ui=uo-F['hsW'];tD=F['hsW']/2;tI=F['hsIn']/2;rc=F['hsArc']/2
    L=math.hypot(tI-tD,t);h=math.sqrt(rc*rc-L*L/4);Ct=(tI+tD)/2-t/L*h;Cz=t/2+(tI-tD)/L*h   # the arcs' centre in (across, Z), as frame.js's (t, y) with Z = t - y
    tw=lambda z:Ct+math.sqrt(rc*rc-(z-Cz)**2)
    assert abs(tw(0)-tD)<1e-9 and abs(tw(t)-tI)<1e-9
    def window():
        pln=bd.Plane(origin=(ui*eu[0],ui*eu[1],0),x_dir=(et[0],et[1],0),z_dir=(eu[0],eu[1],0));sg=1 if pln.y_dir.Z>0 else -1;P=lambda a,z:pln.from_local_coords((a,sg*z))
        e=[bd.Edge.make_three_point_arc(P(tD,0),P(tw(t/2),t/2),P(tI,t)),bd.Edge.make_line(P(tI,t),P(-tI,t)),bd.Edge.make_three_point_arc(P(-tI,t),P(-tw(t/2),t/2),P(-tD,0)),bd.Edge.make_line(P(-tD,0),P(tD,0))]
        return bd.extrude(bd.Face(bd.Wire(e)),F['hsW'],dir=(eu[0],eu[1],0))
    ops.append(Cut(window,'Mill the hand-setting window through, its ends to the Ø 14 arcs',[S('dial face','6.5 square',None,'05 08_3b'),S('inner face','12 +0.2 along the cut','drawn 12.1',src+' C-D'),S('from the rim',f'{F["hsOut"]:.2f}','8.3 -0.1, at the middle','05 08_3b'),S('ends','Ø 14 arcs, hollow',None,src+' C-D')],src,at=(uo*eu[0],uo*eu[1])))
    ops.append(Drill((34*eu[0],34*eu[1],F['hsBoreY']),(eu[0],eu[1],0),F['hsBore'],R-34+1,"Drill the hand-setting shaft's hole from the window out through the rim",[S('',f'Ø {F["hsBore"]:g}, {F["hsBoreY"]} above the dial face',None,src+' C-D, E-F')],key='hsb'))
    plate=[o for o in ops if isinstance(o,(Hole,Cone)) and getattr(o,'face',None)]
    return Recipe('pillarPlate','050802-1','Pillar plate (Unterplatte)','05 08 02-1 (assembly 05 08 02)',"as the top plate's: Messingblech, Sonder Ms α-β",'gilt (Wempe 3955)',[
        Setup('1',"blank in the lathe's chuck",[stock]),
        Setup('2','on the mill, dial face up, located on holes 1 and 49',[o for o in plate if o.face=='in'],view='bottom'),
        Setup('3','turned over, inner face up, on the same locations',[o for o in ops if o.kind=='mill' or isinstance(o,Drill)]+[o for o in plate if o.face=='out'],view='top')],
      page_matrix([[-1,0,0],[0,0,-1],[0,-1,0]],(0,t,0)),faces=('dial face','inner face'),
      fits=["pillar holes 4.50 +0.012 on the pillars' 4.5 f7",'settings 1, 30 4.59 H7'],notes=['Holes 14-18 and the window are struck through on the table ("nur wenn Zeigerstellung eingebaut wird"), but Wempe 3955\'s plate has them: made, as the model has them.'])

# ---------------- the movement ring (Werkring, 05 08 00-3, revised 6.12.46) ----------------
def ring():
    D=W()['WD'];G=D['RING'];src='05 08 00-3';z0=G['y0'];zt=G['yTop']
    at=lambda b,r:(-math.sin(math.radians(b))*r,math.cos(math.radians(b))*r)   # r brg(b) in this frame (X = page x, Y = -page z)
    ops1=[Ring(G['flD'],G['lipD'],zt-z0,'Turn the ring blank to its overall height, bored to the lip',[S('overall',f'{zt-z0:.2f}','10.7 -0.1',src),S('lip',f'Ø {G["lipD"]}',None,src)],src,z0=z0),
      TurnOD(G['bandD'],z0,G['yFl'],"Turn the band's outside",[S('band',f'Ø {G["bandD"]}','-0.3',src)],src),
      Bore(G['seatD'],z0,G['ySeat'],"Bore the plate's seat",[S('seat',f'Ø {G["seatD"]:.4f} × {G["ySeat"]-z0:.2f}','85 H9 (drawn at the middle); 3 +0.1 deep',src)],src),
      InnerCone(G['lipD']/2,G['yCone'],G['coneD2']/2,G['yRec'],"Turn the 45° cone from under the lip to the dial's recess",[S('cone',f'Ø {G["lipD"]} to Ø {G["coneD2"]} at the recess, 45°',None,src)],src),
      Bore(G['recD'],G['yRec'],zt,"Bore the dial's recess in the flange's face",[S('recess',f'Ø {G["recD"]} × {zt-G["yRec"]:.2f}','104 +0.1; 0.7 +0.1 deep',src)],src)]
    th=iso(2.6);t1=iso(1.0);ops2=[]
    for b in G['screws']:
        c=at(b,G['screwD']/2);ops2.append(Drill((c[0],c[1],z0),(0,0,1),th['D1'],zt-z0,f'At {b}° on Ø 89: drill and tap M2.6, on through the flange to the cone',[S('','M2.6 on Ø 89',None,src)],thread=th,key=f'm26-{b}'))
    pin=at(180,D['PLATE_R']);ops2.append(Drill((pin[0],pin[1],z0),(0,0,1),D['FRAME']['ringPin'],G['yCone']-z0,"Drill the plate's pin hole across the seat's wall at assembly",[S('',"Ø 1 at 6 o'clock, 5 deep",None,src+' ("wird bei Montage der Unterplatte gebohrt")')],key='pin',mz=(G['ySeat']+G['yCone'])/2))
    dp=at(-6,G['dialR']);ops2.append(Drill((dp[0],dp[1],G['yFl']),(0,0,1),G['dialPin'],zt-G['yFl'],"Drill the dial's pin hole at assembly",[S('','Ø 1.1 on r 50.5, 6° from 12 toward 3',None,src)],key='dialpin'))
    for a in G['dialScrews']:
        q=(G['dialR']*math.sin(math.radians(a)),G['dialR']*math.cos(math.radians(a)));ops2.append(Drill((q[0],q[1],G['yFl']),(0,0,1),t1['D1'],zt-G['yFl'],f'The dial screw at {a}°: drill and tap M1 through the flange',[S('','M1 on r 50.5',None,'05 02 00-4 (drilled at assembly: estimated)')],thread=t1,key=f'm1-{a}'))
    ops2.append(Drill((0,G['casePinR0'],zt-G['casePinZ']),(0,1,0),G['casePin'],12,"Drill the case pin's radial hole at 12 o'clock",[S('',"Ø 1.6, 2.8 under the dial's face",None,src)],key='casepin'))
    return Recipe('ring','050800-3','Movement ring (Werkring)','05 08 00-3 (revised 6.12.46)','not given on the sheet ("——"); nickel-bright on Wempe 3955 (estimated)','nickel (estimated)',[
        Setup('1',"blank in the chuck, the seat's face out",ops1),Setup('2','on the mill with a dividing head, flange face up',ops2)],
      page_matrix([[1,0,0],[0,0,1],[0,-1,0]],(0,0,0)),fits=["seat 85 H9 on the plate's 85 h6"])

# ---------------- bought: pins ----------------
def pinsBought():
    return [Bought('stellstift203','WN-203.bb','Steady pin (Stellstift WN-203)','dowel pin, hardened',"Ø 1.6 m6, cut to length (barrel bridge 3; the cocks' and the intermediate bridge's as fitted)",'ISO 8734 (DIN 6325), or Ø 1.6 silver steel ground','steel','frame.js pinM: Ø 1.6, both ends chamfered 0.1 × 45° (estimated)'),
            Bought('stellstift201','WN-201','Plate pin (Stellstift WN-201)','dowel pin, pressed','Ø 1.0 m6 × 5.25','ISO 8734, or silver steel Ø 1','steel','frame.js: Ø 1.01 pressed in its Ø 1 hole, 5.25 long (estimated)'),
            Bought('stellstift202','WN-202','Case pin (Stellstift WN-202)','dowel pin, pressed','Ø 1.6 m6 × 9.45','ISO 8734, or silver steel Ø 1.6','steel','frame.js: Ø 1.61 pressed, 9.45 long, 1.78 out of the flange (05 08 00-3)')]

RECIPES={'corkRing':corkRing,'pillars':pillar,'pillarScrew':pillarScrew,'pillarScrew56':pillarScrew56,'topPlate':topPlate,'pillarPlate':pillarPlate,'ring':ring,'ringScrew':ringScrew}
for _b in pinsBought():RECIPES[_b.key]=(lambda b=_b:b)
